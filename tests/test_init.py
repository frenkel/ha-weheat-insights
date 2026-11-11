"""Tests for setup, unload and reacting to registry changes."""

from homeassistant.config_entries import ConfigEntryState
from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.weheat_insights.discovery import WeheatKey

from .conftest import FakeWeheat


async def test_setup_and_unload(
    hass: HomeAssistant, weheat: FakeWeheat, insights_entry: MockConfigEntry
) -> None:
    assert await hass.config_entries.async_setup(insights_entry.entry_id)
    await hass.async_block_till_done()
    assert insights_entry.state is ConfigEntryState.LOADED

    data = insights_entry.runtime_data
    assert (
        data.entities[WeheatKey.SUPPLY_TEMPERATURE]
        == (weheat.entity_ids["water_outlet_temperature"])
    )
    assert data.outdoor_entity_id == weheat.entity_ids["outside_temperature"]
    assert data.indoor_entity_id is None

    assert await hass.config_entries.async_unload(insights_entry.entry_id)
    assert insights_entry.state is ConfigEntryState.NOT_LOADED


async def test_not_ready_when_pump_missing(hass: HomeAssistant) -> None:
    entry = MockConfigEntry(
        domain="weheat_insights",
        unique_id="gone",
        data={"heat_pump_id": "gone"},
        options={"outdoor_entity": "sensor.x"},
    )
    entry.add_to_hass(hass)
    await hass.config_entries.async_setup(entry.entry_id)
    assert entry.state is ConfigEntryState.SETUP_RETRY


async def test_reloads_when_weheat_entity_renamed(
    hass: HomeAssistant, weheat: FakeWeheat, insights_entry: MockConfigEntry
) -> None:
    await hass.config_entries.async_setup(insights_entry.entry_id)
    await hass.async_block_till_done()

    er.async_get(hass).async_update_entity(
        weheat.entity_ids["water_outlet_temperature"],
        new_entity_id="sensor.aanvoertemperatuur",
    )
    await hass.async_block_till_done()

    assert insights_entry.state is ConfigEntryState.LOADED
    assert (
        insights_entry.runtime_data.entities[WeheatKey.SUPPLY_TEMPERATURE]
        == "sensor.aanvoertemperatuur"
    )


async def test_ignores_unrelated_registry_changes(
    hass: HomeAssistant, weheat: FakeWeheat, insights_entry: MockConfigEntry
) -> None:
    await hass.config_entries.async_setup(insights_entry.entry_id)
    await hass.async_block_till_done()
    data_before = insights_entry.runtime_data

    er.async_get(hass).async_get_or_create("sensor", "template", "unrelated")
    er.async_get(hass).async_update_entity(weheat.entity_ids["cop"], name="My COP")
    await hass.async_block_till_done()

    assert insights_entry.runtime_data is data_before
