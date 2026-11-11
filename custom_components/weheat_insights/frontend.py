"""Serve the bundled dashboard strategy from the integration itself.

One HACS install delivers both backend and frontend: the JS lives in
``www/`` next to this file, is served on a static path and loaded on every
page as an extra module.
"""

from __future__ import annotations

from pathlib import Path

from homeassistant.components.frontend import add_extra_js_url
from homeassistant.components.http import StaticPathConfig
from homeassistant.core import HomeAssistant
from homeassistant.loader import async_get_integration

from .const import DOMAIN

URL_BASE = f"/{DOMAIN}"
JS_FILENAME = "weheat-insights.js"
WWW_DIR = Path(__file__).parent / "www"


async def async_register_frontend(hass: HomeAssistant) -> None:
    """Register the static path and the extra JS module (once per HA start)."""
    integration = await async_get_integration(hass, DOMAIN)
    await hass.http.async_register_static_paths(
        [StaticPathConfig(URL_BASE, str(WWW_DIR), cache_headers=False)]
    )
    # The version query makes browsers fetch the new bundle after an update.
    add_extra_js_url(hass, f"{URL_BASE}/{JS_FILENAME}?v={integration.version}")
