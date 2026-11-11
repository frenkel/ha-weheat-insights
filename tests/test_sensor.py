"""Tests for the derived sensors."""

from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr, entity_registry as er
import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry

from .conftest import PUMP_UUID, FakeWeheat


def _delta_t_entity_id(hass: HomeAssistant) -> str:
    entity_id = er.async_get(hass).async_get_entity_id(
        "sensor", "weheat_insights", f"{PUMP_UUID}_delta_t"
    )
    assert entity_id is not None
    return entity_id


async def test_delta_t_follows_sources(
    hass: HomeAssistant, weheat: FakeWeheat, insights_entry: MockConfigEntry
) -> None:
    supply = weheat.entity_ids["water_outlet_temperature"]
    return_ = weheat.entity_ids["water_inlet_temperature"]
    celsius = {"unit_of_measurement": "°C"}
    hass.states.async_set(supply, "35.2", celsius)
    hass.states.async_set(return_, "30.1", celsius)

    await hass.config_entries.async_setup(insights_entry.entry_id)
    await hass.async_block_till_done()

    entity_id = _delta_t_entity_id(hass)
    state = hass.states.get(entity_id)
    assert float(state.state) == pytest.approx(5.1)
    assert state.attributes["unit_of_measurement"] == "K"
    assert state.attributes["device_class"] == "temperature_delta"
    assert state.attributes["state_class"] == "measurement"

    hass.states.async_set(return_, "unavailable")
    await hass.async_block_till_done()
    assert hass.states.get(entity_id).state == "unknown"

    # Sources shown in °F are converted before subtracting.
    hass.states.async_set(supply, "95", {"unit_of_measurement": "°F"})
    hass.states.async_set(return_, "86", {"unit_of_measurement": "°F"})
    await hass.async_block_till_done()
    assert float(hass.states.get(entity_id).state) == pytest.approx(5.0)


async def test_delta_t_lives_on_insights_device(
    hass: HomeAssistant, weheat: FakeWeheat, insights_entry: MockConfigEntry
) -> None:
    await hass.config_entries.async_setup(insights_entry.entry_id)
    await hass.async_block_till_done()

    reg = er.async_get(hass).async_get(_delta_t_entity_id(hass))
    device = dr.async_get(hass).async_get(reg.device_id)
    assert device.identifiers == {("weheat_insights", PUMP_UUID)}
    assert device.via_device_id == weheat.device.id


async def test_no_delta_t_without_both_temperatures(
    hass: HomeAssistant, insights_entry: MockConfigEntry, weheat: FakeWeheat
) -> None:
    er.async_get(hass).async_remove(weheat.entity_ids["water_inlet_temperature"])
    await hass.async_block_till_done()
    await hass.config_entries.async_setup(insights_entry.entry_id)
    await hass.async_block_till_done()

    assert (
        er.async_get(hass).async_get_entity_id(
            "sensor", "weheat_insights", f"{PUMP_UUID}_delta_t"
        )
        is None
    )
