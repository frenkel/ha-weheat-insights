"""WebSocket API used by the dashboard strategy."""

from __future__ import annotations

from typing import Any

from homeassistant.components import websocket_api
from homeassistant.config_entries import ConfigEntryState
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import entity_registry as er
from homeassistant.util import dt as dt_util
import voluptuous as vol

from .const import DOMAIN
from .degree_day_statistics import statistic_id as degree_day_statistic_id
from .dhw import DEFAULT_DAYS as DHW_DEFAULT_DAYS, async_dhw
from .dhw_statistics import statistic_id as dhw_target_statistic_id
from .discovery import WeheatKey
from .history import MAX_COUNT, async_history
from .house import async_supply_curve, curve_payload, heat_loss_payload


@callback
def async_register(hass: HomeAssistant) -> None:
    """Register the WebSocket commands."""
    websocket_api.async_register_command(hass, ws_dashboard_config)
    websocket_api.async_register_command(hass, ws_performance_history)
    websocket_api.async_register_command(hass, ws_heat_loss)
    websocket_api.async_register_command(hass, ws_supply_curve)
    websocket_api.async_register_command(hass, ws_dhw)


def _loaded_entry(hass: HomeAssistant, entry_id: str):
    entry = hass.config_entries.async_get_entry(entry_id)
    if (
        entry is None
        or entry.domain != DOMAIN
        or entry.state is not ConfigEntryState.LOADED
    ):
        return None
    return entry


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
                "dhw_target_statistic_id": (
                    dhw_target_statistic_id(data.pump.uuid)
                    if WeheatKey.DHW_BOTTOM_TEMPERATURE in data.entities
                    else None
                ),
                "outdoor_entity_id": data.outdoor_entity_id,
                "indoor_entity_id": data.indoor_entity_id,
            }
        )
    heat_pumps.sort(key=lambda pump: pump["name"].casefold())
    connection.send_result(msg["id"], {"heat_pumps": heat_pumps})


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/performance_history",
        vol.Required("entry_id"): str,
        vol.Optional("period", default="month"): vol.In(list(MAX_COUNT)),
        vol.Optional("count"): vol.All(int, vol.Range(min=1, max=92)),
    }
)
@websocket_api.async_response
async def ws_performance_history(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return COP per day, month or season for one heat pump."""
    entry = hass.config_entries.async_get_entry(msg["entry_id"])
    if (
        entry is None
        or entry.domain != DOMAIN
        or entry.state is not ConfigEntryState.LOADED
    ):
        connection.send_error(msg["id"], "not_found", "Heat pump not set up")
        return
    data = entry.runtime_data
    kind = msg["period"]
    count = msg.get("count", {"day": 30, "month": 13, "season": 5}[kind])
    periods = await async_history(
        hass,
        data.entities,
        data.coordinator.settings,
        today=dt_util.now().date(),
        kind=kind,
        count=count,
    )
    connection.send_result(
        msg["id"],
        {
            "period": kind,
            "has_dhw": WeheatKey.ELECTRICITY_USED_DHW in data.entities,
            "periods": periods,
        },
    )


@websocket_api.websocket_command(
    {vol.Required("type"): f"{DOMAIN}/heat_loss", vol.Required("entry_id"): str}
)
@callback
def ws_heat_loss(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return the daily heat-loss points and the fitted line."""
    entry = _loaded_entry(hass, msg["entry_id"])
    if entry is None or entry.runtime_data.house is None:
        connection.send_error(msg["id"], "not_found", "Heat pump not set up")
        return
    connection.send_result(msg["id"], heat_loss_payload(entry.runtime_data.house.data))


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/supply_curve",
        vol.Required("entry_id"): str,
        vol.Optional("days", default=365): vol.All(int, vol.Range(min=1, max=365)),
    }
)
@websocket_api.async_response
async def ws_supply_curve(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return hourly supply temperature against outdoor temperature."""
    entry = _loaded_entry(hass, msg["entry_id"])
    if entry is None:
        connection.send_error(msg["id"], "not_found", "Heat pump not set up")
        return
    data = entry.runtime_data
    points = await async_supply_curve(
        hass, data.entities, data.outdoor_entity_id, msg["days"]
    )
    curves = curve_payload(data.house.data) if data.house is not None else None
    connection.send_result(
        msg["id"], {"days": msg["days"], "points": points, "curves": curves}
    )


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/dhw",
        vol.Required("entry_id"): str,
        vol.Optional("days", default=DHW_DEFAULT_DAYS): vol.All(
            int, vol.Range(min=7, max=365)
        ),
    }
)
@websocket_api.async_response
async def ws_dhw(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return the hot-water figures: per day, start hours and standing loss."""
    entry = _loaded_entry(hass, msg["entry_id"])
    if entry is None:
        connection.send_error(msg["id"], "not_found", "Heat pump not set up")
        return
    connection.send_result(
        msg["id"], await async_dhw(hass, entry.runtime_data, msg["days"])
    )
