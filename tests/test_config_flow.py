"""Tests for the config and options flow."""

from datetime import date

from homeassistant.config_entries import SOURCE_USER
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType
from homeassistant.helpers import entity_registry as er
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.weheat_insights.config_flow import with_change_date
from custom_components.weheat_insights.const import (
    CONF_HEAT_PUMP_ID,
    CONF_INDOOR_ENTITY,
    CONF_OUTDOOR_ENTITY,
    DOMAIN,
)

from .conftest import PUMP_NAME, PUMP_UUID, FakeWeheat


def _schema_default(result, key):
    for marker in result["data_schema"].schema:
        if marker == key:
            default = marker.default
            return default() if callable(default) else default
    raise KeyError(key)


def _suggested(result, key):
    for marker in result["data_schema"].schema:
        if marker == key:
            return (marker.description or {}).get("suggested_value")
    raise KeyError(key)


async def test_abort_without_weheat(hass: HomeAssistant) -> None:
    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": SOURCE_USER}
    )
    assert result["type"] is FlowResultType.ABORT
    assert result["reason"] == "no_heat_pumps"


async def test_full_flow_defaults_to_pump_sensors(
    hass: HomeAssistant, weheat: FakeWeheat
) -> None:
    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": SOURCE_USER}
    )
    assert result["type"] is FlowResultType.FORM
    assert result["step_id"] == "user"

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], {CONF_HEAT_PUMP_ID: PUMP_UUID}
    )
    assert result["step_id"] == "sources"
    outside = weheat.entity_ids["outside_temperature"]
    room = weheat.entity_ids["thermostat_room_temperature"]
    assert _schema_default(result, CONF_OUTDOOR_ENTITY) == outside
    assert _suggested(result, CONF_INDOOR_ENTITY) == room

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], {CONF_OUTDOOR_ENTITY: outside, CONF_INDOOR_ENTITY: room}
    )
    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert result["title"] == PUMP_NAME
    assert result["data"] == {CONF_HEAT_PUMP_ID: PUMP_UUID}

    # Entities are stored by registry id, so renames keep working.
    registry = er.async_get(hass)
    assert result["options"] == {
        CONF_OUTDOOR_ENTITY: registry.async_get(outside).id,
        CONF_INDOOR_ENTITY: registry.async_get(room).id,
    }
    assert result["result"].unique_id == PUMP_UUID


async def test_indoor_is_optional_and_non_registry_entities_work(
    hass: HomeAssistant, weheat: FakeWeheat
) -> None:
    hass.states.async_set("sensor.yaml_outdoor", "7.5", {"device_class": "temperature"})
    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": SOURCE_USER}
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], {CONF_HEAT_PUMP_ID: PUMP_UUID}
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], {CONF_OUTDOOR_ENTITY: "sensor.yaml_outdoor"}
    )
    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert result["options"] == {CONF_OUTDOOR_ENTITY: "sensor.yaml_outdoor"}


async def test_abort_when_all_pumps_configured(
    hass: HomeAssistant, insights_entry: MockConfigEntry
) -> None:
    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": SOURCE_USER}
    )
    assert result["type"] is FlowResultType.ABORT
    assert result["reason"] == "already_configured"


async def test_options_flow(
    hass: HomeAssistant, weheat: FakeWeheat, insights_entry: MockConfigEntry
) -> None:
    await hass.config_entries.async_setup(insights_entry.entry_id)
    await hass.async_block_till_done()

    result = await hass.config_entries.options.async_init(insights_entry.entry_id)
    assert result["step_id"] == "init"
    outside = weheat.entity_ids["outside_temperature"]
    assert _schema_default(result, CONF_OUTDOOR_ENTITY) == outside

    assert _schema_default(result, "season_start_month") == "9"
    assert _schema_default(result, "degree_day_base") == 18.0
    assert _schema_default(result, "weighted_degree_days") is True

    room = weheat.entity_ids["thermostat_room_temperature"]
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {
            CONF_OUTDOOR_ENTITY: outside,
            CONF_INDOOR_ENTITY: room,
            "season_start_month": "10",
            "season_end_month": "4",
            "degree_day_base": 15.5,
            "weighted_degree_days": True,
            "target_room_temperature": 21.0,
            "emitter_type": "radiators",
            "curve_changed_on": "2026-11-01",
        },
    )
    assert result["type"] is FlowResultType.CREATE_ENTRY
    await hass.async_block_till_done()

    data = insights_entry.runtime_data
    assert data.outdoor_entity_id == outside
    assert data.indoor_entity_id == room
    settings = data.coordinator.settings
    assert settings.season_start_month == 10
    assert settings.season_end_month == 4
    assert settings.degree_day_base == 15.5
    assert settings.weighted_degree_days is True
    assert settings.target_room_c == 21.0
    assert settings.emitter_type == "radiators"
    assert settings.curve_changed_on == date(2026, 11, 1)


def test_change_date_is_stored_when_the_current_curve_changes() -> None:
    old = {"current_curve_9": 26.0, "current_curve_minus_20": 42.0}
    changed = {"current_curve_9": 25.0, "current_curve_minus_20": 42.0}
    assert with_change_date(old, changed, "2026-11-12")["curve_changed_on"] == (
        "2026-11-12"
    )
    # Same curve: no date.
    assert "curve_changed_on" not in with_change_date(old, dict(old), "2026-11-12")
    # First time entered: not a change.
    assert "curve_changed_on" not in with_change_date({}, changed, "2026-11-12")
    # A date picked by the user in the same go wins.
    picked = {**changed, "curve_changed_on": "2026-11-01"}
    assert with_change_date(old, picked, "2026-11-12")["curve_changed_on"] == (
        "2026-11-01"
    )


async def test_options_flow_stores_current_curve(
    hass: HomeAssistant, weheat: FakeWeheat, insights_entry: MockConfigEntry
) -> None:
    await hass.config.async_set_time_zone("Europe/Amsterdam")
    await hass.config_entries.async_setup(insights_entry.entry_id)
    await hass.async_block_till_done()
    base = {
        CONF_OUTDOOR_ENTITY: weheat.entity_ids["outside_temperature"],
        "season_start_month": "9",
        "season_end_month": "5",
        "degree_day_base": 18.0,
        "weighted_degree_days": True,
        "target_room_temperature": 20.0,
        "emitter_type": "radiators",
    }

    async def submit(values):
        flow = await hass.config_entries.options.async_init(insights_entry.entry_id)
        result = await hass.config_entries.options.async_configure(
            flow["flow_id"], {**base, **values}
        )
        await hass.async_block_till_done()
        return result

    await submit({"current_curve_9": 26, "current_curve_minus_20": 42})
    settings = insights_entry.runtime_data.coordinator.settings
    assert settings.current_curve == {-20.0: 42.0, 9.0: 26.0}
    assert settings.curve_changed_on is None

    await submit({"current_curve_9": 25, "current_curve_minus_20": 42})
    settings = insights_entry.runtime_data.coordinator.settings
    assert settings.current_curve[9.0] == 25.0
    assert settings.curve_changed_on is not None
