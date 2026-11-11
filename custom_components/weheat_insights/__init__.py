"""Weheat Insights: local analysis of data from the core Weheat integration.

This is an unofficial community project and is not affiliated with Weheat.
"""

from __future__ import annotations

from dataclasses import dataclass

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import CALLBACK_TYPE, Event, HomeAssistant, callback
from homeassistant.exceptions import ConfigEntryNotReady
from homeassistant.helpers import entity_registry as er

from .config_flow import resolve_entity_id
from .const import (
    CONF_HEAT_PUMP_ID,
    CONF_INDOOR_ENTITY,
    CONF_OUTDOOR_ENTITY,
    DOMAIN,
    WEHEAT_DOMAIN,
)
from .discovery import (
    WeheatHeatPump,
    WeheatKey,
    async_get_heat_pump,
    async_map_heat_pump_entities,
)

PLATFORMS: list[Platform] = []


@dataclass(slots=True)
class WeheatInsightsData:
    """Resolved configuration for one analysed heat pump."""

    pump: WeheatHeatPump
    entities: dict[WeheatKey, str]
    outdoor_entity_id: str | None
    indoor_entity_id: str | None


type WeheatInsightsConfigEntry = ConfigEntry[WeheatInsightsData]


async def async_setup_entry(
    hass: HomeAssistant, entry: WeheatInsightsConfigEntry
) -> bool:
    """Set up Weheat Insights from a config entry."""
    uuid: str = entry.data[CONF_HEAT_PUMP_ID]
    pump = async_get_heat_pump(hass, uuid)
    if pump is None:
        raise ConfigEntryNotReady(
            translation_domain=DOMAIN,
            translation_key="heat_pump_not_found",
            translation_placeholders={"uuid": uuid},
        )

    entry.runtime_data = WeheatInsightsData(
        pump=pump,
        entities=async_map_heat_pump_entities(hass, pump),
        outdoor_entity_id=resolve_entity_id(
            hass, entry.options.get(CONF_OUTDOOR_ENTITY)
        ),
        indoor_entity_id=resolve_entity_id(hass, entry.options.get(CONF_INDOOR_ENTITY)),
    )

    entry.async_on_unload(_async_watch_weheat_entities(hass, entry, uuid))

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    return True


async def async_unload_entry(
    hass: HomeAssistant, entry: WeheatInsightsConfigEntry
) -> bool:
    """Unload a config entry."""
    return await hass.config_entries.async_unload_platforms(entry, PLATFORMS)


def _async_watch_weheat_entities(
    hass: HomeAssistant, entry: WeheatInsightsConfigEntry, uuid: str
) -> CALLBACK_TYPE:
    """Reload when the pump's Weheat entities appear, vanish or get renamed."""
    registry = er.async_get(hass)
    prefix = f"{uuid}_"

    @callback
    def _is_relevant(event_data: er.EventEntityRegistryUpdatedData) -> bool:
        if event_data["action"] == "update" and not (
            {"entity_id", "disabled_by"} & event_data.get("changes", {}).keys()
        ):
            # Only renames and (en/dis)abling matter for the mapping.
            return False
        entity_id = event_data["entity_id"]
        if event_data["action"] == "remove":
            # Removed entries are gone from the registry; check our own mapping.
            return entity_id in entry.runtime_data.entities.values()
        reg_entry = registry.async_get(entity_id)
        return (
            reg_entry is not None
            and reg_entry.platform == WEHEAT_DOMAIN
            and reg_entry.unique_id.startswith(prefix)
        )

    @callback
    def _handle(event: Event[er.EventEntityRegistryUpdatedData]) -> None:
        hass.config_entries.async_schedule_reload(entry.entry_id)

    return hass.bus.async_listen(
        er.EVENT_ENTITY_REGISTRY_UPDATED, _handle, event_filter=_is_relevant
    )
