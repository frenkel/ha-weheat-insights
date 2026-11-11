"""Base entity for Weheat Insights."""

from __future__ import annotations

from homeassistant.helpers.device_registry import DeviceEntryType, DeviceInfo
from homeassistant.helpers.entity import Entity

from .const import DOMAIN, NAME, WEHEAT_DOMAIN
from .discovery import WeheatHeatPump


class WeheatInsightsEntity(Entity):
    """An entity on the Insights device that belongs to one heat pump."""

    _attr_has_entity_name = True
    _attr_should_poll = False

    def __init__(self, pump: WeheatHeatPump, key: str) -> None:
        """Initialise the entity."""
        self._attr_unique_id = f"{pump.uuid}_{key}"
        self._attr_translation_key = key
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, pump.uuid)},
            name=f"{pump.name} {NAME}",
            entry_type=DeviceEntryType.SERVICE,
            via_device=(WEHEAT_DOMAIN, pump.uuid),
        )
