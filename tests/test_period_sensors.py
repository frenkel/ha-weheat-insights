"""Tests for the COP, degree-day and per-degree-day sensors."""

from datetime import timedelta
import json
from pathlib import Path

from homeassistant.components.recorder.models import StatisticMeanType
from homeassistant.components.recorder.statistics import async_import_statistics
from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er
from homeassistant.util import dt as dt_util
import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry
from pytest_homeassistant_custom_component.components.recorder.common import (
    async_wait_recording_done,
)

from custom_components.weheat_insights.const import (
    CONF_HEAT_PUMP_ID,
    CONF_OUTDOOR_ENTITY,
    DOMAIN,
)
from custom_components.weheat_insights.sensor import HOUSE_SENSORS, PERIOD_SENSORS

from .conftest import PUMP_UUID, WEHEAT_SENSORS, add_weheat_pump

COMPONENT = Path(__file__).parent.parent / "custom_components" / "weheat_insights"

COUNTERS = {
    "electricity_used_heating": 0.4,  # kWh per hour
    "electricity_used_dhw": 0.1,
    "electricity_used_defrost": 0.02,
    "electricity_used_standby": 0.03,
    "energy_output_heating": 1.6,
    "energy_output_dhw": 0.3,
    "energy_output_defrost": -0.08,
}


def _import(hass, statistic_id, start, hours, per_hour, *, mean=False):
    rows = []
    total = 0.0
    for hour in range(hours):
        when = start + timedelta(hours=hour)
        if mean:
            rows.append({"start": when, "mean": per_hour})
        else:
            total += per_hour
            rows.append({"start": when, "state": total, "sum": total})
    async_import_statistics(
        hass,
        {
            "has_sum": not mean,
            "mean_type": StatisticMeanType.ARITHMETIC
            if mean
            else StatisticMeanType.NONE,
            "name": None,
            "source": "recorder",
            "statistic_id": statistic_id,
            "unit_class": "temperature" if mean else "energy",
            "unit_of_measurement": "°C" if mean else "kWh",
        },
        rows,
    )


def _entity_id(hass, key):
    return er.async_get(hass).async_get_entity_id(
        "sensor", DOMAIN, f"{PUMP_UUID}_{key}"
    )


async def test_period_sensors_from_statistics(hass: HomeAssistant, freezer) -> None:
    # Inside the default heating season, whatever day the tests run.
    await hass.config.async_set_time_zone("Europe/Amsterdam")
    freezer.move_to("2026-11-11 12:00:00+01:00")
    sensors = dict(WEHEAT_SENSORS)
    sensors.update({key: (key, "kWh", "energy") for key in COUNTERS})
    weheat = add_weheat_pump(hass, sensors=sensors)

    # Two full days of history ending at the start of today.
    start = dt_util.start_of_local_day() - timedelta(days=2)
    for key, per_hour in COUNTERS.items():
        _import(hass, weheat.entity_ids[key], start, 48, per_hour)
    _import(hass, weheat.entity_ids["outside_temperature"], start, 48, 8.0, mean=True)
    await async_wait_recording_done(hass)

    entry = MockConfigEntry(
        domain=DOMAIN,
        unique_id=PUMP_UUID,
        data={CONF_HEAT_PUMP_ID: PUMP_UUID},
        options={
            CONF_OUTDOOR_ENTITY: weheat.entity_ids["outside_temperature"],
            "weighted_degree_days": False,
        },
    )
    entry.add_to_hass(hass)
    await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()

    scop = hass.states.get(_entity_id(hass, "scop_season"))
    total_in = 0.4 + 0.1 + 0.02 + 0.03
    total_out = 1.6 + 0.3 - 0.08
    assert float(scop.state) == pytest.approx(total_out / total_in, abs=0.01)
    assert "state_class" not in scop.attributes
    assert scop.attributes["electricity_kwh"] > 0
    assert scop.attributes["electricity_standby_kwh"] == pytest.approx(0.03 * 48)
    # Unitless COP states are rounded to the display precision.
    assert len(scop.state.split(".")[1]) <= 2

    heat_pump = hass.states.get(_entity_id(hass, "scop_heat_pump_season"))
    assert float(heat_pump.state) == pytest.approx(
        total_out / (0.4 + 0.1 + 0.02), abs=0.01
    )
    assert heat_pump.attributes["electricity_kwh"] == pytest.approx(0.52 * 48)

    share = 0.4 / 0.5
    heating = hass.states.get(_entity_id(hass, "scop_heating_season"))
    expected = (1.6 - share * 0.08) / (0.4 + share * 0.02)
    assert float(heating.state) == pytest.approx(expected, abs=0.01)
    assert hass.states.get(_entity_id(hass, "scop_dhw_season")) is not None

    impact = hass.states.get(_entity_id(hass, "defrost_cop_impact_season"))
    assert float(impact.state) > 0

    dd = hass.states.get(_entity_id(hass, "degree_days_season"))
    assert float(dd.state) == pytest.approx(20.0, abs=0.01)  # 2 days x (18 - 8)
    hpdd = hass.states.get(_entity_id(hass, "heat_per_degree_day_season"))
    assert float(hpdd.state) > 0

    # No history for today yet: today's COP is unknown, not zero.
    assert hass.states.get(_entity_id(hass, "cop_today")).state == "unknown"


async def test_no_dhw_sensors_without_dhw_counters(
    hass: HomeAssistant, insights_entry: MockConfigEntry
) -> None:
    await hass.config_entries.async_setup(insights_entry.entry_id)
    await hass.async_block_till_done()
    assert _entity_id(hass, "scop_season") is not None
    assert _entity_id(hass, "scop_dhw_season") is None


@pytest.mark.parametrize("lang", ["en", "nl"])
def test_every_sensor_has_a_translated_name(lang: str) -> None:
    names = json.loads((COMPONENT / "translations" / f"{lang}.json").read_text())[
        "entity"
    ]["sensor"]
    keys = {d.translation_key for d in [*PERIOD_SENSORS, *HOUSE_SENSORS]} | {"delta_t"}
    assert keys <= names.keys()


def test_every_sensor_has_an_icon() -> None:
    icons = json.loads((COMPONENT / "icons.json").read_text())["entity"]["sensor"]
    keys = {d.translation_key for d in [*PERIOD_SENSORS, *HOUSE_SENSORS]} | {"delta_t"}
    assert keys <= icons.keys()
