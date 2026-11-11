"""Config and options flow for Weheat Insights."""

from __future__ import annotations

from typing import Any

from homeassistant.components.sensor import SensorDeviceClass
from homeassistant.config_entries import (
    ConfigEntry,
    ConfigFlow,
    ConfigFlowResult,
    OptionsFlowWithReload,
)
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.selector import (
    BooleanSelector,
    DateSelector,
    EntitySelector,
    EntitySelectorConfig,
    NumberSelector,
    NumberSelectorConfig,
    NumberSelectorMode,
    SelectOptionDict,
    SelectSelector,
    SelectSelectorConfig,
    SelectSelectorMode,
)
from homeassistant.util import dt as dt_util
import voluptuous as vol

from .const import (
    CONF_CURRENT_CURVE,
    CONF_CURVE_CHANGED_ON,
    CONF_DEGREE_DAY_BASE,
    CONF_EMITTER_TYPE,
    CONF_HEAT_PUMP_ID,
    CONF_INDOOR_ENTITY,
    CONF_OUTDOOR_ENTITY,
    CONF_SEASON_END_MONTH,
    CONF_SEASON_START_MONTH,
    CONF_TARGET_ROOM_TEMPERATURE,
    CONF_WEIGHTED_DEGREE_DAYS,
    DEFAULT_DEGREE_DAY_BASE,
    DEFAULT_EMITTER_TYPE,
    DEFAULT_SEASON_END_MONTH,
    DEFAULT_SEASON_START_MONTH,
    DEFAULT_TARGET_ROOM_TEMPERATURE,
    DEFAULT_WEIGHTED_DEGREE_DAYS,
    DOMAIN,
)
from .discovery import (
    WeheatHeatPump,
    WeheatKey,
    async_get_heat_pump,
    async_get_heat_pumps,
    async_map_heat_pump_entities,
)

TEMPERATURE_SELECTOR = EntitySelector(
    EntitySelectorConfig(domain="sensor", device_class=SensorDeviceClass.TEMPERATURE)
)


def _to_registry_id(hass: HomeAssistant, entity_id: str | None) -> str | None:
    """Store a registry id when possible, so renaming the entity keeps working."""
    if not entity_id:
        return None
    if (reg_entry := er.async_get(hass).async_get(entity_id)) is not None:
        return reg_entry.id
    # Not in the registry (e.g. a YAML template sensor without unique_id).
    return entity_id


def resolve_entity_id(hass: HomeAssistant, value: str | None) -> str | None:
    """Turn a stored registry id or entity_id back into a current entity_id."""
    if not value:
        return None
    return er.async_resolve_entity_id(er.async_get(hass), value) or value


def _sources_schema(
    hass: HomeAssistant,
    pump: WeheatHeatPump | None,
    current: dict[str, Any] | None = None,
) -> vol.Schema:
    """Build the form for the temperature sources, with sensible defaults."""
    discovered = async_map_heat_pump_entities(hass, pump) if pump else {}
    if current is not None:
        outdoor = resolve_entity_id(hass, current.get(CONF_OUTDOOR_ENTITY))
        indoor = resolve_entity_id(hass, current.get(CONF_INDOOR_ENTITY))
    else:
        outdoor = discovered.get(WeheatKey.OUTSIDE_TEMPERATURE)
        indoor = discovered.get(WeheatKey.ROOM_TEMPERATURE)

    outdoor_key = (
        vol.Required(CONF_OUTDOOR_ENTITY, default=outdoor)
        if outdoor
        else vol.Required(CONF_OUTDOOR_ENTITY)
    )
    indoor_key = (
        vol.Optional(CONF_INDOOR_ENTITY, description={"suggested_value": indoor})
        if indoor
        else vol.Optional(CONF_INDOOR_ENTITY)
    )
    return vol.Schema(
        {outdoor_key: TEMPERATURE_SELECTOR, indoor_key: TEMPERATURE_SELECTOR}
    )


MONTH_SELECTOR = SelectSelector(
    SelectSelectorConfig(
        options=[str(month) for month in range(1, 13)],
        mode=SelectSelectorMode.DROPDOWN,
        translation_key="month",
    )
)
BASE_SELECTOR = NumberSelector(
    NumberSelectorConfig(
        min=10, max=22, step=0.5, unit_of_measurement="°C", mode=NumberSelectorMode.BOX
    )
)


TARGET_SELECTOR = NumberSelector(
    NumberSelectorConfig(
        min=15, max=25, step=0.5, unit_of_measurement="°C", mode=NumberSelectorMode.BOX
    )
)
EMITTER_SELECTOR = SelectSelector(
    SelectSelectorConfig(
        options=["radiators", "underfloor", "mixed"],
        mode=SelectSelectorMode.DROPDOWN,
        translation_key="emitter_type",
    )
)


CURVE_SELECTOR = NumberSelector(
    NumberSelectorConfig(
        min=10, max=70, step=0.1, unit_of_measurement="°C", mode=NumberSelectorMode.BOX
    )
)


def _curve_schema(current: dict[str, Any]) -> dict:
    """Return optional fields for the current heating curve, one per point."""
    return {
        vol.Optional(key, description={"suggested_value": current.get(key)}): (
            CURVE_SELECTOR
        )
        for key in CONF_CURRENT_CURVE.values()
    }


def _curve_options(user_input: dict[str, Any]) -> dict[str, float]:
    """Return the current-curve values that were filled in."""
    return {
        key: round(float(user_input[key]), 1)
        for key in CONF_CURRENT_CURVE.values()
        if user_input.get(key) not in (None, "")
    }


def with_change_date(
    old: dict[str, Any], new: dict[str, Any], today: str
) -> dict[str, Any]:
    """Store today as the change date when the current curve was changed.

    Only when the curve was already filled in before (entering it the first
    time is not a change) and the user did not pick a different date in the
    same go.
    """
    old_curve = {k: old[k] for k in CONF_CURRENT_CURVE.values() if k in old}
    new_curve = {k: new[k] for k in CONF_CURRENT_CURVE.values() if k in new}
    date_untouched = new.get(CONF_CURVE_CHANGED_ON) == old.get(CONF_CURVE_CHANGED_ON)
    if old_curve and new_curve and old_curve != new_curve and date_untouched:
        return {**new, CONF_CURVE_CHANGED_ON: today}
    return new


def _calculation_schema(current: dict[str, Any]) -> dict:
    """Form fields for the season and degree-day settings."""
    return {
        vol.Required(
            CONF_SEASON_START_MONTH,
            default=str(
                current.get(CONF_SEASON_START_MONTH, DEFAULT_SEASON_START_MONTH)
            ),
        ): MONTH_SELECTOR,
        vol.Required(
            CONF_SEASON_END_MONTH,
            default=str(current.get(CONF_SEASON_END_MONTH, DEFAULT_SEASON_END_MONTH)),
        ): MONTH_SELECTOR,
        vol.Required(
            CONF_DEGREE_DAY_BASE,
            default=current.get(CONF_DEGREE_DAY_BASE, DEFAULT_DEGREE_DAY_BASE),
        ): BASE_SELECTOR,
        vol.Required(
            CONF_WEIGHTED_DEGREE_DAYS,
            default=current.get(
                CONF_WEIGHTED_DEGREE_DAYS, DEFAULT_WEIGHTED_DEGREE_DAYS
            ),
        ): BooleanSelector(),
        vol.Required(
            CONF_TARGET_ROOM_TEMPERATURE,
            default=current.get(
                CONF_TARGET_ROOM_TEMPERATURE, DEFAULT_TARGET_ROOM_TEMPERATURE
            ),
        ): TARGET_SELECTOR,
        vol.Required(
            CONF_EMITTER_TYPE,
            default=current.get(CONF_EMITTER_TYPE, DEFAULT_EMITTER_TYPE),
        ): EMITTER_SELECTOR,
        vol.Optional(
            CONF_CURVE_CHANGED_ON,
            description={"suggested_value": current.get(CONF_CURVE_CHANGED_ON)},
        ): DateSelector(),
    }


def _calculation_options(user_input: dict[str, Any]) -> dict[str, Any]:
    """Normalise the season and degree-day input into stored options."""
    return {
        CONF_SEASON_START_MONTH: int(user_input[CONF_SEASON_START_MONTH]),
        CONF_SEASON_END_MONTH: int(user_input[CONF_SEASON_END_MONTH]),
        CONF_DEGREE_DAY_BASE: float(user_input[CONF_DEGREE_DAY_BASE]),
        CONF_WEIGHTED_DEGREE_DAYS: bool(user_input[CONF_WEIGHTED_DEGREE_DAYS]),
        CONF_TARGET_ROOM_TEMPERATURE: float(user_input[CONF_TARGET_ROOM_TEMPERATURE]),
        CONF_EMITTER_TYPE: user_input[CONF_EMITTER_TYPE],
        **(
            {CONF_CURVE_CHANGED_ON: user_input[CONF_CURVE_CHANGED_ON]}
            if user_input.get(CONF_CURVE_CHANGED_ON)
            else {}
        ),
    }


def _sources_options(hass: HomeAssistant, user_input: dict[str, Any]) -> dict:
    """Normalise the sources form input into stored options."""
    options: dict[str, Any] = {
        CONF_OUTDOOR_ENTITY: _to_registry_id(hass, user_input[CONF_OUTDOOR_ENTITY])
    }
    if indoor := _to_registry_id(hass, user_input.get(CONF_INDOOR_ENTITY)):
        options[CONF_INDOOR_ENTITY] = indoor
    return options


class WeheatInsightsConfigFlow(ConfigFlow, domain=DOMAIN):
    """Set up insights for one Weheat heat pump."""

    VERSION = 1

    def __init__(self) -> None:
        """Initialise the flow."""
        self._pump: WeheatHeatPump | None = None

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Pick the heat pump to analyse."""
        pumps = async_get_heat_pumps(self.hass)
        if not pumps:
            return self.async_abort(reason="no_heat_pumps")

        configured = self._async_current_ids(include_ignore=False)
        available = [pump for pump in pumps if pump.uuid not in configured]
        if not available:
            return self.async_abort(reason="already_configured")

        if user_input is not None:
            pump = async_get_heat_pump(self.hass, user_input[CONF_HEAT_PUMP_ID])
            if pump is None:
                return self.async_abort(reason="no_heat_pumps")
            await self.async_set_unique_id(pump.uuid)
            self._abort_if_unique_id_configured()
            self._pump = pump
            return await self.async_step_sources()

        return self.async_show_form(
            step_id="user",
            data_schema=vol.Schema(
                {
                    vol.Required(
                        CONF_HEAT_PUMP_ID, default=available[0].uuid
                    ): SelectSelector(
                        SelectSelectorConfig(
                            options=[
                                SelectOptionDict(value=pump.uuid, label=pump.name)
                                for pump in available
                            ],
                            mode=SelectSelectorMode.DROPDOWN,
                        )
                    )
                }
            ),
        )

    async def async_step_sources(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Choose the outdoor and (optional) indoor temperature sources."""
        assert self._pump is not None
        if user_input is not None:
            return self.async_create_entry(
                title=self._pump.name,
                data={CONF_HEAT_PUMP_ID: self._pump.uuid},
                options=_sources_options(self.hass, user_input),
            )

        return self.async_show_form(
            step_id="sources",
            data_schema=_sources_schema(self.hass, self._pump),
            description_placeholders={"heat_pump": self._pump.name},
        )

    @staticmethod
    @callback
    def async_get_options_flow(config_entry: ConfigEntry) -> OptionsFlowHandler:
        """Return the options flow."""
        return OptionsFlowHandler()


class OptionsFlowHandler(OptionsFlowWithReload):
    """Change the temperature sources and calculation settings later."""

    async def async_step_init(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Edit the temperature sources and calculation settings."""
        if user_input is not None:
            options = {
                **_sources_options(self.hass, user_input),
                **_calculation_options(user_input),
                **_curve_options(user_input),
            }
            return self.async_create_entry(
                data=with_change_date(
                    dict(self.config_entry.options),
                    options,
                    dt_util.now().date().isoformat(),
                )
            )

        current = dict(self.config_entry.options)
        pump = async_get_heat_pump(self.hass, self.config_entry.data[CONF_HEAT_PUMP_ID])
        sources = _sources_schema(self.hass, pump, current)
        return self.async_show_form(
            step_id="init",
            data_schema=vol.Schema(
                {
                    **sources.schema,
                    **_calculation_schema(current),
                    **_curve_schema(current),
                }
            ),
        )
