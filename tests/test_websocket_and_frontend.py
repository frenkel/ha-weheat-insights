"""Tests for the dashboard WebSocket API and the bundled frontend.

The handler is called directly with a mock connection, so these tests need
no local TCP port.
"""

import json
from pathlib import Path
from unittest.mock import MagicMock

from homeassistant.components.frontend import DATA_EXTRA_MODULE_URL
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.weheat_insights.frontend import JS_FILENAME, WWW_DIR
from custom_components.weheat_insights.websocket_api import ws_dashboard_config

from .conftest import PUMP_NAME, PUMP_UUID, FakeWeheat


def _call_dashboard_config(hass: HomeAssistant) -> dict:
    connection = MagicMock()
    ws_dashboard_config(
        hass, connection, {"id": 1, "type": "weheat_insights/dashboard_config"}
    )
    connection.send_result.assert_called_once()
    msg_id, result = connection.send_result.call_args.args
    assert msg_id == 1
    return result


async def test_dashboard_config(
    hass: HomeAssistant, weheat: FakeWeheat, insights_entry: MockConfigEntry
) -> None:
    await hass.config_entries.async_setup(insights_entry.entry_id)
    await hass.async_block_till_done()

    [pump] = _call_dashboard_config(hass)["heat_pumps"]
    assert pump["uuid"] == PUMP_UUID
    assert pump["name"] == PUMP_NAME
    assert pump["has_dhw"] is False
    assert (
        pump["weheat"]["water_outlet_temperature"]
        == (weheat.entity_ids["water_outlet_temperature"])
    )
    assert pump["weheat"]["cop"] == weheat.entity_ids["cop"]
    assert pump["insights"]["delta_t"].startswith("sensor.")
    assert pump["outdoor_entity_id"] == weheat.entity_ids["outside_temperature"]
    assert pump["indoor_entity_id"] is None


async def test_dashboard_config_skips_unloaded_entries(
    hass: HomeAssistant, insights_entry: MockConfigEntry
) -> None:
    await hass.config_entries.async_setup(insights_entry.entry_id)
    await hass.config_entries.async_unload(insights_entry.entry_id)

    assert _call_dashboard_config(hass) == {"heat_pumps": []}


async def test_frontend_module_registered(
    hass: HomeAssistant, insights_entry: MockConfigEntry
) -> None:
    await hass.config_entries.async_setup(insights_entry.entry_id)
    await hass.async_block_till_done()

    urls = [u for u in hass.data[DATA_EXTRA_MODULE_URL].urls if "weheat" in u]
    version = json.loads((Path(WWW_DIR).parent / "manifest.json").read_text())[
        "version"
    ]
    assert urls == [f"/weheat_insights/{JS_FILENAME}?v={version}"]


def test_bundle_is_committed_and_defines_strategy() -> None:
    bundle = Path(WWW_DIR) / JS_FILENAME
    assert bundle.is_file(), "run `npm run build` in frontend/"
    assert "ll-strategy-dashboard-weheat-insights" in bundle.read_text()
