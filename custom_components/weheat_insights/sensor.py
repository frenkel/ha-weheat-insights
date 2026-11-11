"""Derived sensors for Weheat Insights."""

from __future__ import annotations

from homeassistant.components.sensor import (
    SensorDeviceClass,
    SensorEntity,
    SensorStateClass,
)
from homeassistant.const import (
    ATTR_UNIT_OF_MEASUREMENT,
    STATE_UNAVAILABLE,
    STATE_UNKNOWN,
    UnitOfTemperature,
)
from homeassistant.core import Event, EventStateChangedData, HomeAssistant, callback
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback
from homeassistant.helpers.event import async_track_state_change_event
from homeassistant.util.unit_conversion import TemperatureConverter

from . import WeheatInsightsConfigEntry
from .calculations.temperature import delta_t
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
    supply = data.entities.get(WeheatKey.SUPPLY_TEMPERATURE)
    return_ = data.entities.get(WeheatKey.RETURN_TEMPERATURE)
    if supply and return_:
        async_add_entities([DeltaTSensor(data.pump, supply, return_)])


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
