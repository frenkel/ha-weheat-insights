"""WebSocket API used by the dashboard strategy."""

from __future__ import annotations

from typing import Any

from homeassistant.components import websocket_api
from homeassistant.config_entries import ConfigEntryState
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import entity_registry as er
import voluptuous as vol

from .const import DOMAIN
from .degree_day_statistics import statistic_id as degree_day_statistic_id
from .discovery import WeheatKey


@callback
def async_register(hass: HomeAssistant) -> None:
    """Register the WebSocket commands."""
    websocket_api.async_register_command(hass, ws_dashboard_config)


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/dashboard_config"})
@callback
def ws_dashboard_config(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return the resolved entities of every loaded heat pump."""
    registry = er.async_get(hass)
    heat_pumps: list[dict[str, Any]] = []
    for entry in hass.config_entries.async_entries(DOMAIN):
        if entry.state is not ConfigEntryState.LOADED:
            continue
        data = entry.runtime_data
        insights = {
            reg.unique_id.removeprefix(f"{data.pump.uuid}_"): reg.entity_id
            for reg in er.async_entries_for_config_entry(registry, entry.entry_id)
            if not reg.disabled
        }
        heat_pumps.append(
            {
                "entry_id": entry.entry_id,
                "uuid": data.pump.uuid,
                "name": entry.title or data.pump.name,
                "model": data.pump.model,
                "has_dhw": WeheatKey.DHW_TOP_TEMPERATURE in data.entities,
                "weheat": {key.value: eid for key, eid in data.entities.items()},
                "insights": insights,
                "degree_days_statistic_id": (
                    degree_day_statistic_id(data.pump.uuid)
                    if data.outdoor_entity_id
                    else None
                ),
                "outdoor_entity_id": data.outdoor_entity_id,
                "indoor_entity_id": data.indoor_entity_id,
            }
        )
    heat_pumps.sort(key=lambda pump: pump["name"].casefold())
    connection.send_result(msg["id"], {"heat_pumps": heat_pumps})
