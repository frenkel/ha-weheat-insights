"""Derived sensors for Weheat Insights.

The COP/SCOP and per-degree-day sensors are ratios for a period so far.
They deliberately have no ``state_class``: Home Assistant would store hourly
means of those running ratios, which mean nothing (the same trap as
averaging an instantaneous COP). History of COP per day or month is drawn
from the energy statistics by the performance card instead.
"""

from __future__ import annotations

from collections.abc import Callable
from dataclasses import dataclass
from typing import Any

from homeassistant.components.sensor import (
    SensorDeviceClass,
    SensorEntity,
    SensorEntityDescription,
    SensorStateClass,
)
from homeassistant.const import (
    ATTR_UNIT_OF_MEASUREMENT,
    STATE_UNAVAILABLE,
    STATE_UNKNOWN,
    UnitOfEnergy,
    UnitOfTemperature,
)
from homeassistant.core import Event, EventStateChangedData, HomeAssistant, callback
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback
from homeassistant.helpers.event import async_track_state_change_event
from homeassistant.helpers.update_coordinator import CoordinatorEntity
from homeassistant.util.unit_conversion import TemperatureConverter

from . import WeheatInsightsConfigEntry
from .calculations.temperature import delta_t
from .coordinator import InsightsData, PeriodResult, WeheatInsightsCoordinator
from .discovery import WeheatHeatPump, WeheatKey
from .entity import WeheatInsightsEntity

PARALLEL_UPDATES = 0


async def async_setup_entry(
    hass: HomeAssistant,
    entry: WeheatInsightsConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    """Set up the derived sensors."""
    data = entry.runtime_data
    entities: list[SensorEntity] = []
    supply = data.entities.get(WeheatKey.SUPPLY_TEMPERATURE)
    return_ = data.entities.get(WeheatKey.RETURN_TEMPERATURE)
    if supply and return_:
        entities.append(DeltaTSensor(data.pump, supply, return_))

    if data.coordinator is not None:
        has_dhw = WeheatKey.ELECTRICITY_USED_DHW in data.entities
        entities.extend(
            PeriodSensor(data.pump, data.coordinator, description)
            for description in PERIOD_SENSORS
            if has_dhw or not description.dhw_only
        )
    async_add_entities(entities)


def _celsius(hass: HomeAssistant, entity_id: str) -> float | None:
    """Read a temperature state as °C, whatever unit the user displays it in."""
    state = hass.states.get(entity_id)
    if state is None or state.state in (STATE_UNKNOWN, STATE_UNAVAILABLE):
        return None
    try:
        value = float(state.state)
    except ValueError:
        return None
    unit = state.attributes.get(ATTR_UNIT_OF_MEASUREMENT, UnitOfTemperature.CELSIUS)
    if unit not in TemperatureConverter.VALID_UNITS:
        return None
    return TemperatureConverter.convert(value, unit, UnitOfTemperature.CELSIUS)


class DeltaTSensor(WeheatInsightsEntity, SensorEntity):
    """Supply minus return temperature, updated when either changes."""

    _attr_device_class = SensorDeviceClass.TEMPERATURE_DELTA
    _attr_native_unit_of_measurement = UnitOfTemperature.KELVIN
    _attr_state_class = SensorStateClass.MEASUREMENT
    _attr_suggested_display_precision = 1

    def __init__(
        self, pump: WeheatHeatPump, supply_entity_id: str, return_entity_id: str
    ) -> None:
        """Initialise the sensor."""
        super().__init__(pump, "delta_t")
        self._supply = supply_entity_id
        self._return = return_entity_id

    async def async_added_to_hass(self) -> None:
        """Start following the source sensors."""
        self.async_on_remove(
            async_track_state_change_event(
                self.hass, [self._supply, self._return], self._async_source_changed
            )
        )
        self._update()

    @callback
    def _async_source_changed(self, event: Event[EventStateChangedData]) -> None:
        self._update()
        self.async_write_ha_state()

    @callback
    def _update(self) -> None:
        value = delta_t(
            _celsius(self.hass, self._supply), _celsius(self.hass, self._return)
        )
        self._attr_native_value = None if value is None else round(value, 2)
        self._attr_extra_state_attributes = {
            "supply_entity_id": self._supply,
            "return_entity_id": self._return,
        }


UNIT_DEGREE_DAYS = "K·d"
UNIT_HEAT_PER_DEGREE_DAY = "kWh/K·d"


@dataclass(frozen=True, kw_only=True)
class PeriodSensorDescription(SensorEntityDescription):
    """A figure taken from the coordinator's InsightsData."""

    period_fn: Callable[[InsightsData], PeriodResult]
    value_fn: Callable[[PeriodResult], float | None]
    attrs_fn: Callable[[PeriodResult], dict[str, Any]] | None = None
    dhw_only: bool = False


def _round(value: float | None, digits: int = 3) -> float | None:
    return None if value is None else round(value, digits)


def _cop_attrs(mode: str | None) -> Callable[[PeriodResult], dict[str, Any]]:
    def attrs(result: PeriodResult) -> dict[str, Any]:
        totals = result.performance.totals
        if mode is None:
            used, made = totals.total_in, totals.total_out
        else:
            used, made = totals.mode_energy(mode)
        attrs: dict[str, Any] = {
            "period_start": result.start.isoformat(),
            "period_end": result.end.isoformat(),
            "electricity_kwh": round(used, 2),
            "heat_kwh": round(made, 2),
        }
        if mode is None:
            # Where the electricity of the total COP goes.
            attrs |= {
                "electricity_heating_kwh": round(totals.in_heating, 2),
                "electricity_dhw_kwh": round(totals.in_dhw, 2),
                "electricity_defrost_kwh": round(totals.in_defrost, 2),
                "electricity_standby_kwh": round(totals.in_standby, 2),
                "electricity_indoor_unit_kwh": round(totals.in_indoor_unit, 2),
                "heat_heating_kwh": round(totals.out_heating, 2),
                "heat_dhw_kwh": round(totals.out_dhw, 2),
                "heat_defrost_kwh": round(totals.out_defrost, 2),
            }
        return attrs

    return attrs


def _period_attrs(result: PeriodResult) -> dict[str, Any]:
    return {
        "period_start": result.start.isoformat(),
        "period_end": result.end.isoformat(),
    }


def _hpdd_attrs(result: PeriodResult) -> dict[str, Any]:
    return {
        **_period_attrs(result),
        "heating_heat_kwh": round(result.heating_heat_kwh, 1),
        "degree_days": _round(result.degree_days, 1),
    }


def _defrost_attrs(result: PeriodResult) -> dict[str, Any]:
    perf = result.performance
    return {
        **_period_attrs(result),
        "defrost_electricity_kwh": round(perf.totals.in_defrost, 2),
        "defrost_heat_taken_kwh": round(-perf.totals.out_defrost, 2),
        "cop_without_defrost": _round(perf.cop_without_defrost),
        "cop": _round(perf.cop),
    }


def _today(data: InsightsData) -> PeriodResult:
    return data.today


def _month(data: InsightsData) -> PeriodResult:
    return data.month


def _season(data: InsightsData) -> PeriodResult:
    return data.season


def _cop_descriptions() -> list[PeriodSensorDescription]:
    periods = (("today", "cop", _today), ("month", "cop", _month))
    periods += (("season", "scop", _season),)
    modes: tuple[tuple[str | None, str, Callable], ...] = (
        (None, "", lambda r: r.performance.cop),
        ("heating", "_heating", lambda r: r.performance.cop_heating),
        ("dhw", "_dhw", lambda r: r.performance.cop_dhw),
    )
    return [
        PeriodSensorDescription(
            key=f"{prefix}{suffix}_{period}",
            translation_key=f"{prefix}{suffix}_{period}",
            suggested_display_precision=2,
            period_fn=period_fn,
            value_fn=value_fn,
            attrs_fn=_cop_attrs(mode),
            dhw_only=mode == "dhw",
        )
        for period, prefix, period_fn in periods
        for mode, suffix, value_fn in modes
    ]


PERIOD_SENSORS: list[PeriodSensorDescription] = [
    *_cop_descriptions(),
    PeriodSensorDescription(
        key="defrost_cop_impact_season",
        translation_key="defrost_cop_impact_season",
        suggested_display_precision=2,
        period_fn=_season,
        value_fn=lambda r: r.performance.defrost_cop_impact,
        attrs_fn=_defrost_attrs,
    ),
    PeriodSensorDescription(
        key="defrost_heat_season",
        translation_key="defrost_heat_season",
        device_class=SensorDeviceClass.ENERGY,
        native_unit_of_measurement=UnitOfEnergy.KILO_WATT_HOUR,
        suggested_display_precision=1,
        period_fn=_season,
        value_fn=lambda r: -r.performance.totals.out_defrost,
        attrs_fn=_defrost_attrs,
    ),
    PeriodSensorDescription(
        key="degree_days_month",
        translation_key="degree_days_month",
        native_unit_of_measurement=UNIT_DEGREE_DAYS,
        suggested_display_precision=0,
        period_fn=_month,
        value_fn=lambda r: r.degree_days,
        attrs_fn=_period_attrs,
    ),
    PeriodSensorDescription(
        key="degree_days_season",
        translation_key="degree_days_season",
        native_unit_of_measurement=UNIT_DEGREE_DAYS,
        suggested_display_precision=0,
        period_fn=_season,
        value_fn=lambda r: r.degree_days,
        attrs_fn=_period_attrs,
    ),
    PeriodSensorDescription(
        key="heat_per_degree_day_season",
        translation_key="heat_per_degree_day_season",
        native_unit_of_measurement=UNIT_HEAT_PER_DEGREE_DAY,
        suggested_display_precision=1,
        period_fn=_season,
        value_fn=lambda r: r.heat_per_degree_day,
        attrs_fn=_hpdd_attrs,
    ),
    PeriodSensorDescription(
        key="heat_per_degree_day_last_year",
        translation_key="heat_per_degree_day_last_year",
        native_unit_of_measurement=UNIT_HEAT_PER_DEGREE_DAY,
        suggested_display_precision=1,
        period_fn=lambda d: d.season_last_year_same_period,
        value_fn=lambda r: r.heat_per_degree_day,
        attrs_fn=_hpdd_attrs,
    ),
    PeriodSensorDescription(
        key="heat_per_degree_day_last_season",
        translation_key="heat_per_degree_day_last_season",
        native_unit_of_measurement=UNIT_HEAT_PER_DEGREE_DAY,
        suggested_display_precision=1,
        period_fn=lambda d: d.last_season,
        value_fn=lambda r: r.heat_per_degree_day,
        attrs_fn=_hpdd_attrs,
    ),
]


class PeriodSensor(
    CoordinatorEntity[WeheatInsightsCoordinator], WeheatInsightsEntity, SensorEntity
):
    """A COP, degree-day or per-degree-day figure for a period so far."""

    entity_description: PeriodSensorDescription

    def __init__(
        self,
        pump: WeheatHeatPump,
        coordinator: WeheatInsightsCoordinator,
        description: PeriodSensorDescription,
    ) -> None:
        """Initialise the sensor."""
        CoordinatorEntity.__init__(self, coordinator)
        WeheatInsightsEntity.__init__(self, pump, description.key)
        self.entity_description = description

    @property
    def _result(self) -> PeriodResult:
        return self.entity_description.period_fn(self.coordinator.data)

    @property
    def native_value(self) -> float | None:
        """Return the figure, rounded for storage."""
        # COP sensors have no unit, so the frontend shows the raw state
        # without applying the display precision: round it here.
        precision = self.entity_description.suggested_display_precision
        return _round(
            self.entity_description.value_fn(self._result),
            3 if precision is None else precision,
        )

    @property
    def extra_state_attributes(self) -> dict[str, Any] | None:
        """Return the energy behind the figure, for transparency."""
        if self.entity_description.attrs_fn is None:
            return None
        return self.entity_description.attrs_fn(self._result)
