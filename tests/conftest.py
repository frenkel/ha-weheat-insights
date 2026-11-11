"""Shared fixtures.

The core Weheat integration is not loaded in tests. Instead we create the
device and registry entries it would create, using its real unique_id
pattern ``f"{uuid}_{key}"``.
"""

from __future__ import annotations

from dataclasses import dataclass

from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr, entity_registry as er
import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.weheat_insights.const import (
    CONF_HEAT_PUMP_ID,
    CONF_OUTDOOR_ENTITY,
    DOMAIN,
)

PUMP_UUID = "0b5c8f4e-1111-4a2b-9c3d-abcdefabcdef"
PUMP_NAME = "Blackbird P80"

# key -> (suggested object id, unit, device_class)
WEHEAT_SENSORS = {
    "water_outlet_temperature": ("weheat_water_outlet", "°C", "temperature"),
    "water_inlet_temperature": ("weheat_water_inlet", "°C", "temperature"),
    "outside_temperature": ("weheat_outside", "°C", "temperature"),
    "thermostat_room_temperature": ("weheat_room", "°C", "temperature"),
    "power_input": ("weheat_power_input", "W", "power"),
    "power_output": ("weheat_power_output", "W", "power"),
    "cop": ("weheat_cop", None, None),
    "heat_pump_state": ("weheat_state", None, "enum"),
}


@pytest.fixture(autouse=True)
def auto_enable_custom_integrations(recorder_mock, enable_custom_integrations):
    """Enable custom integrations and an in-memory recorder in every test.

    ``recorder_mock`` must come before anything that creates ``hass``.
    """
    return


@dataclass
class FakeWeheat:
    """Handles to the fake core Weheat setup."""

    entry: MockConfigEntry
    device: dr.DeviceEntry
    entity_ids: dict[str, str]


def add_weheat_pump(
    hass: HomeAssistant,
    uuid: str = PUMP_UUID,
    name: str = PUMP_NAME,
    sensors: dict[str, tuple[str, str | None, str | None]] | None = None,
    entry: MockConfigEntry | None = None,
) -> FakeWeheat:
    """Register a Weheat device and its sensors as the core integration would."""
    if entry is None:
        entry = MockConfigEntry(domain="weheat", title="Weheat cloud")
        entry.add_to_hass(hass)
    device = dr.async_get(hass).async_get_or_create(
        config_entry_id=entry.entry_id,
        identifiers={("weheat", uuid)},
        manufacturer="Weheat",
        model="Blackbird P80 heat pump",
        name=name,
    )
    registry = er.async_get(hass)
    entity_ids: dict[str, str] = {}
    for key, (object_id, _unit, _cls) in (sensors or WEHEAT_SENSORS).items():
        reg = registry.async_get_or_create(
            "sensor",
            "weheat",
            f"{uuid}_{key}",
            config_entry=entry,
            device_id=device.id,
            suggested_object_id=f"{object_id}_{uuid[:4]}",
        )
        entity_ids[key] = reg.entity_id
    return FakeWeheat(entry=entry, device=device, entity_ids=entity_ids)


@pytest.fixture
def weheat(hass: HomeAssistant) -> FakeWeheat:
    """One fake Weheat heat pump."""
    return add_weheat_pump(hass)


@pytest.fixture
def insights_entry(hass: HomeAssistant, weheat: FakeWeheat) -> MockConfigEntry:
    """A Weheat Insights entry for the fake heat pump (not yet set up)."""
    entry = MockConfigEntry(
        domain=DOMAIN,
        title=PUMP_NAME,
        unique_id=PUMP_UUID,
        data={CONF_HEAT_PUMP_ID: PUMP_UUID},
        options={CONF_OUTDOOR_ENTITY: weheat.entity_ids["outside_temperature"]},
    )
    entry.add_to_hass(hass)
    return entry
