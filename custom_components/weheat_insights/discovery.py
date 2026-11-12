"""Discover the entities the core Weheat integration created for a heat pump.

The core integration names its entities through translations, so entity_ids
depend on the language and on user renames. The unique_id is stable: it is
``f"{heat_pump_uuid}_{key}"``. We match on that, never on entity_id strings.
"""

from __future__ import annotations

from collections.abc import Iterable
from dataclasses import dataclass
from enum import StrEnum

from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr, entity_registry as er

from .const import WEHEAT_DOMAIN


class WeheatKey(StrEnum):
    """Entity description keys used by the core Weheat integration."""

    SUPPLY_TEMPERATURE = "water_outlet_temperature"
    RETURN_TEMPERATURE = "water_inlet_temperature"
    CH_INLET_TEMPERATURE = "ch_inlet_temperature"
    OUTSIDE_TEMPERATURE = "outside_temperature"
    ROOM_TEMPERATURE = "thermostat_room_temperature"
    ROOM_SETPOINT = "thermostat_room_temperature_setpoint"
    WATER_SETPOINT = "thermostat_water_setpoint"
    POWER_INPUT = "power_input"
    POWER_OUTPUT = "power_output"
    COP = "cop"
    STATE = "heat_pump_state"
    COMPRESSOR_PERCENTAGE = "compressor_percentage"
    CH_FLOW = "central_heating_flow_volume"
    DHW_TOP_TEMPERATURE = "dhw_top_temperature"
    DHW_BOTTOM_TEMPERATURE = "dhw_bottom_temperature"
    ELECTRICITY_USED = "electricity_used"
    ELECTRICITY_USED_INDOOR_UNIT = "electricity_used_indoor_unit"
    ELECTRICITY_USED_HEATING = "electricity_used_heating"
    ELECTRICITY_USED_DHW = "electricity_used_dhw"
    ELECTRICITY_USED_DEFROST = "electricity_used_defrost"
    ELECTRICITY_USED_STANDBY = "electricity_used_standby"
    ENERGY_OUTPUT = "energy_output"
    ENERGY_OUTPUT_HEATING = "energy_output_heating"
    ENERGY_OUTPUT_DHW = "energy_output_dhw"
    ENERGY_OUTPUT_DEFROST = "energy_output_defrost"
    GAS_BOILER = "indoor_unit_gas_boiler_state"
    ELECTRIC_HEATER = "indoor_unit_electric_heater_state"


_KEYS = {key.value: key for key in WeheatKey}


@dataclass(frozen=True, slots=True)
class RegistryEntity:
    """The registry fields discovery needs; decoupled from HA for testing."""

    entity_id: str
    unique_id: str
    platform: str
    disabled: bool = False


@dataclass(frozen=True, slots=True)
class WeheatHeatPump:
    """A heat pump device created by the core Weheat integration."""

    uuid: str
    device_id: str
    name: str
    model: str | None


def map_entities(uuid: str, entities: Iterable[RegistryEntity]) -> dict[WeheatKey, str]:
    """Map known Weheat keys to entity_ids for one heat pump.

    Disabled entities are skipped, as are entities from other platforms
    and keys we do not know (new core sensors are ignored, not an error).
    """
    prefix = f"{uuid}_"
    found: dict[WeheatKey, str] = {}
    for entity in entities:
        if entity.platform != WEHEAT_DOMAIN or entity.disabled:
            continue
        if not entity.unique_id.startswith(prefix):
            continue
        key = _KEYS.get(entity.unique_id.removeprefix(prefix))
        if key is not None:
            found[key] = entity.entity_id
    return found


def heat_pump_uuid(device: dr.DeviceEntry) -> str | None:
    """Return the Weheat heat pump uuid of a device, if it is a Weheat pump."""
    for domain, identifier in device.identifiers:
        if domain == WEHEAT_DOMAIN:
            return identifier
    return None


def async_get_heat_pumps(hass: HomeAssistant) -> list[WeheatHeatPump]:
    """Return all heat pumps known to the core Weheat integration."""
    pumps: list[WeheatHeatPump] = []
    for device in dr.async_get(hass).devices.values():
        uuid = heat_pump_uuid(device)
        if uuid is None:
            continue
        pumps.append(
            WeheatHeatPump(
                uuid=uuid,
                device_id=device.id,
                name=device.name_by_user or device.name or uuid,
                model=device.model,
            )
        )
    return sorted(pumps, key=lambda pump: pump.name.casefold())


def async_get_heat_pump(hass: HomeAssistant, uuid: str) -> WeheatHeatPump | None:
    """Return one heat pump by uuid."""
    return next(
        (pump for pump in async_get_heat_pumps(hass) if pump.uuid == uuid), None
    )


def async_map_heat_pump_entities(
    hass: HomeAssistant, pump: WeheatHeatPump
) -> dict[WeheatKey, str]:
    """Map Weheat keys to entity_ids using the live entity registry."""
    registry = er.async_get(hass)
    return map_entities(
        pump.uuid,
        (
            RegistryEntity(
                entity_id=entry.entity_id,
                unique_id=entry.unique_id,
                platform=entry.platform,
                disabled=entry.disabled,
            )
            for entry in er.async_entries_for_device(
                registry, pump.device_id, include_disabled_entities=True
            )
        ),
    )
