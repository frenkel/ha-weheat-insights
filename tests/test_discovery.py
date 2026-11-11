"""Tests for entity discovery."""

from homeassistant.core import HomeAssistant

from custom_components.weheat_insights.discovery import (
    RegistryEntity,
    WeheatKey,
    async_get_heat_pumps,
    async_map_heat_pump_entities,
    map_entities,
)

from .conftest import PUMP_UUID, FakeWeheat, add_weheat_pump

UUID = "abc"


def test_map_entities_matches_on_unique_id_not_entity_id() -> None:
    entities = [
        RegistryEntity("sensor.aanvoer", f"{UUID}_water_outlet_temperature", "weheat"),
        RegistryEntity("sensor.retour", f"{UUID}_water_inlet_temperature", "weheat"),
    ]
    assert map_entities(UUID, entities) == {
        WeheatKey.SUPPLY_TEMPERATURE: "sensor.aanvoer",
        WeheatKey.RETURN_TEMPERATURE: "sensor.retour",
    }


def test_map_entities_ignores_other_pumps_platforms_unknown_and_disabled() -> None:
    entities = [
        RegistryEntity("sensor.a", "other_cop", "weheat"),
        RegistryEntity("sensor.b", f"{UUID}_cop", "template"),
        RegistryEntity("sensor.c", f"{UUID}_brand_new_sensor", "weheat"),
        RegistryEntity("sensor.d", f"{UUID}_power_input", "weheat", disabled=True),
        RegistryEntity("sensor.e", f"{UUID}_cop", "weheat"),
    ]
    assert map_entities(UUID, entities) == {WeheatKey.COP: "sensor.e"}


def test_map_entities_does_not_confuse_prefix_keys() -> None:
    # "energy_output" must not match "energy_output_heating" or vice versa.
    entities = [
        RegistryEntity("sensor.total", f"{UUID}_energy_output", "weheat"),
        RegistryEntity("sensor.heating", f"{UUID}_energy_output_heating", "weheat"),
    ]
    assert map_entities(UUID, entities) == {
        WeheatKey.ENERGY_OUTPUT: "sensor.total",
        WeheatKey.ENERGY_OUTPUT_HEATING: "sensor.heating",
    }


async def test_registry_discovery(hass: HomeAssistant, weheat: FakeWeheat) -> None:
    second = add_weheat_pump(
        hass, uuid="zzzz-second", name="Attic pump", entry=weheat.entry
    )

    pumps = async_get_heat_pumps(hass)
    assert [pump.name for pump in pumps] == ["Attic pump", "Blackbird P80"]

    mapping = async_map_heat_pump_entities(hass, pumps[1])
    assert pumps[1].uuid == PUMP_UUID
    assert (
        mapping[WeheatKey.SUPPLY_TEMPERATURE]
        == (weheat.entity_ids["water_outlet_temperature"])
    )
    # Entities of the other pump never leak into this mapping.
    assert second.entity_ids["cop"] not in mapping.values()
