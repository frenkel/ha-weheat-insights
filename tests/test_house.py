"""End-to-end tests for the house analysis."""

from datetime import date, datetime, timedelta
import math

from homeassistant.components.recorder.models import StatisticMeanType
from homeassistant.components.recorder.statistics import async_import_statistics
from homeassistant.core import HomeAssistant, State
from homeassistant.helpers import entity_registry as er
from homeassistant.util import dt as dt_util
import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry
from pytest_homeassistant_custom_component.components.recorder.common import (
    async_wait_recording_done,
)

from custom_components.weheat_insights.const import (
    CONF_HEAT_PUMP_ID,
    CONF_INDOOR_ENTITY,
    CONF_OUTDOOR_ENTITY,
    DOMAIN,
)
from custom_components.weheat_insights.house import build_day_points
from custom_components.weheat_insights.statistics import on_days

from .conftest import PUMP_UUID, WEHEAT_SENSORS, add_weheat_pump

H_W_PER_K = 200.0
FREE_KWH_PER_DAY = 10.0


def _meta(statistic_id: str, *, mean: bool, unit: str) -> dict:
    return {
        "has_sum": not mean,
        "mean_type": StatisticMeanType.ARITHMETIC if mean else StatisticMeanType.NONE,
        "name": None,
        "source": "recorder",
        "statistic_id": statistic_id,
        "unit_class": "temperature" if mean else "energy",
        "unit_of_measurement": unit,
    }


def _entity(hass, key):
    return er.async_get(hass).async_get_entity_id(
        "sensor", DOMAIN, f"{PUMP_UUID}_{key}"
    )


async def test_heat_loss_from_statistics(hass: HomeAssistant, freezer) -> None:
    await hass.config.async_set_time_zone("Europe/Amsterdam")
    freezer.move_to("2026-11-11 12:00:00+01:00")
    sensors = dict(WEHEAT_SENSORS)
    sensors["energy_output_heating"] = ("energy_output_heating", "kWh", "energy")
    sensors["electricity_used_heating"] = ("electricity_used_heating", "kWh", "energy")
    weheat = add_weheat_pump(hass, sensors=sensors)

    days = 30
    start = dt_util.start_of_local_day() - timedelta(days=days)
    heat_rows, el_rows, out_rows, room_rows = [], [], [], []
    heat_sum = el_sum = 0.0
    for d in range(days):
        outdoor = 12 - (d % 13)
        indoor = 20.0
        daily = H_W_PER_K * 24 / 1000 * (indoor - outdoor) - FREE_KWH_PER_DAY
        daily += 0.5 * math.sin(d)
        for h in range(24):
            when = start + timedelta(days=d, hours=h)
            heat_sum += daily / 24
            el_sum += daily / 24 / 4
            heat_rows.append({"start": when, "state": heat_sum, "sum": heat_sum})
            el_rows.append({"start": when, "state": el_sum, "sum": el_sum})
            out_rows.append({"start": when, "mean": outdoor})
            room_rows.append({"start": when, "mean": indoor})
    ids = weheat.entity_ids
    async_import_statistics(
        hass, _meta(ids["energy_output_heating"], mean=False, unit="kWh"), heat_rows
    )
    async_import_statistics(
        hass, _meta(ids["electricity_used_heating"], mean=False, unit="kWh"), el_rows
    )
    async_import_statistics(
        hass, _meta(ids["outside_temperature"], mean=True, unit="°C"), out_rows
    )
    async_import_statistics(
        hass, _meta(ids["thermostat_room_temperature"], mean=True, unit="°C"), room_rows
    )
    await async_wait_recording_done(hass)

    entry = MockConfigEntry(
        domain=DOMAIN,
        unique_id=PUMP_UUID,
        data={CONF_HEAT_PUMP_ID: PUMP_UUID},
        options={
            CONF_OUTDOOR_ENTITY: ids["outside_temperature"],
            CONF_INDOOR_ENTITY: ids["thermostat_room_temperature"],
        },
    )
    entry.add_to_hass(hass)
    await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()

    coefficient = hass.states.get(_entity(hass, "heat_loss_coefficient"))
    assert float(coefficient.state) == pytest.approx(H_W_PER_K, abs=5)
    assert coefficient.attributes["days_used"] >= 28
    assert coefficient.attributes["r_squared"] > 0.95
    assert coefficient.attributes["indoor_temperature_assumed"] is False

    design = hass.states.get(_entity(hass, "heat_loss_design_load"))
    assert float(design.state) == pytest.approx(6.0, abs=0.2)
    balance = hass.states.get(_entity(hass, "balance_point"))
    assert float(balance.state) == pytest.approx(20 - 10 / 4.8, abs=0.5)

    # Heating ran every hour: no cool-down episodes, so no estimate yet.
    tau = hass.states.get(_entity(hass, "cool_down_time_constant"))
    assert tau.state == "unknown"
    assert tau.attributes["episodes"] == 0


async def test_no_heat_loss_without_data(
    hass: HomeAssistant, insights_entry: MockConfigEntry
) -> None:
    await hass.config_entries.async_setup(insights_entry.entry_id)
    await hass.async_block_till_done()
    state = hass.states.get(_entity(hass, "heat_loss_coefficient"))
    assert state.state == "unknown"
    assert state.attributes["no_result_reason"] == "too_few_days"
    assert state.attributes["indoor_temperature_assumed"] is True
    cool = hass.states.get(_entity(hass, "cool_down_rate"))
    assert cool.attributes["requires_indoor_sensor"] is True


async def test_on_days_spans_midnight(hass: HomeAssistant) -> None:
    await hass.config.async_set_time_zone("Europe/Amsterdam")

    def at(text):
        return datetime.fromisoformat(text)

    states = [
        State("binary_sensor.gas", "off", last_changed=at("2026-11-01T10:00:00+01:00")),
        State("binary_sensor.gas", "on", last_changed=at("2026-11-01T23:00:00+01:00")),
        State("binary_sensor.gas", "off", last_changed=at("2026-11-02T01:00:00+01:00")),
    ]
    assert on_days(states, at("2026-11-05T00:00:00+01:00")) == {
        date(2026, 11, 1),
        date(2026, 11, 2),
    }


def test_build_day_points_with_assumed_indoor() -> None:
    day = date(2026, 11, 1)
    [point] = build_day_points([day], {day: 30.0}, 20.0, {day: 5.0}, {day})
    assert point.indoor_c == 20.0
    assert point.other_heat_source is True
