"""Tests for the hot-water (SWW) figures."""

from datetime import date, datetime, timedelta
from unittest.mock import MagicMock

from homeassistant.components.recorder import get_instance
from homeassistant.components.recorder.models import StatisticMeanType
from homeassistant.components.recorder.statistics import (
    async_import_statistics,
    statistics_during_period,
)
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry
from pytest_homeassistant_custom_component.components.recorder.common import (
    async_wait_recording_done,
)

from custom_components.weheat_insights.calculations.dhw import (
    dhw_days,
    run_targets,
    standing_loss,
    start_hours,
    weekly_median,
)
from custom_components.weheat_insights.calculations.operating import Period
from custom_components.weheat_insights.calculations.performance import EnergyTotals
from custom_components.weheat_insights.const import (
    CONF_HEAT_PUMP_ID,
    CONF_OUTDOOR_ENTITY,
    DOMAIN,
)
from custom_components.weheat_insights.websocket_api import ws_dhw

from .conftest import PUMP_UUID, WEHEAT_SENSORS, add_weheat_pump

TZ = dt_util.get_default_time_zone()


def _at(day: int, hour: int, minute: int = 0) -> datetime:
    return datetime(2026, 11, day, hour, minute, tzinfo=TZ)


def test_dhw_days_combine_target_runs_and_cop() -> None:
    d1, d2 = date(2026, 11, 2), date(2026, 11, 3)
    periods = [
        Period("dhw", _at(2, 6), _at(2, 7)),
        Period("dhw", _at(2, 18), _at(2, 18, 40)),
        Period("legionella", _at(3, 13), _at(3, 15)),
        Period("heating", _at(3, 1), _at(3, 4)),
    ]
    rows = dhw_days(
        [d1, d2],
        targets={d1: 50.5},
        energy={d1: EnergyTotals(in_dhw=1.0, out_dhw=3.0)},
        outdoor_mean={d1: 6.0},
        periods=periods,
    )
    assert rows[0].target_c == 50.5
    assert rows[1].target_c is None
    assert rows[0].runs == 2
    assert rows[0].cop == pytest.approx(3.0)
    assert not rows[0].legionella
    assert rows[1].legionella
    assert rows[1].runs == 0
    assert rows[1].cop is None  # no DHW electricity
    assert rows[1].outdoor_c is None


def test_run_targets_leave_legionella_out() -> None:
    bottom = {_at(2, 7): 53.0, _at(2, 8): 50.0, _at(3, 6): 52.0}
    bottom |= {_at(3, 13): 58.0, _at(3, 14): 64.0, _at(3, 15): 63.0}
    periods = [
        Period("dhw", _at(2, 7, 5), _at(2, 7, 55)),
        Period("dhw", _at(3, 6, 10), _at(3, 6, 50)),
        Period("legionella", _at(3, 13), _at(3, 14, 30)),
        # A short run right after legionella: the tank is still hot.
        Period("dhw", _at(3, 15, 10), _at(3, 15, 30)),
    ]
    targets = run_targets(bottom, periods)
    assert targets == {date(2026, 11, 2): 53.0, date(2026, 11, 3): 52.0}


def test_run_targets_with_a_hot_tank_every_day() -> None:
    # Heated to 64 °C by ordinary runs every day: that is the target.
    bottom = {_at(day, 6): 64.0 for day in (2, 3, 4)}
    periods = [Period("dhw", _at(day, 6), _at(day, 6, 50)) for day in (2, 3, 4)]
    assert set(run_targets(bottom, periods).values()) == {64.0}
    # Legionella prevention every day besides 50 °C runs: still 50.
    bottom |= {_at(day, 14): 64.0 for day in (2, 3, 4)}
    bottom |= {_at(day, 6): 50.0 for day in (2, 3, 4)}
    periods += [Period("legionella", _at(d, 14), _at(d, 14, 40)) for d in (2, 3, 4)]
    assert set(run_targets(bottom, periods).values()) == {50.0}


def test_start_hours_count_tank_runs_since() -> None:
    periods = [
        Period("dhw", _at(2, 6, 10), _at(2, 7)),
        Period("dhw", _at(3, 6, 50), _at(3, 7, 30)),
        Period("legionella", _at(3, 13), _at(3, 15)),
        Period("heating", _at(3, 6), _at(3, 8)),
        Period("dhw", _at(1, 22), _at(1, 23)),  # before ``since``
    ]
    counts = start_hours(periods, _at(2, 0))
    assert counts[6] == 2
    assert counts[13] == 1
    assert counts[22] == 0
    assert sum(counts) == 3


def test_standing_loss_uses_clean_night_hours() -> None:
    # Night of the 2nd: steady 0.5 K/h from 00:00 to 06:00.
    top = {_at(2, h): 55.0 - 0.5 * h for h in range(7)}
    # Night of the 3rd: a draw at 03:00 (2 K drop) splits it; the longest
    # clean run is 03:00-06:00 at 0.3 K/h.
    top |= {_at(3, 0): 54.0, _at(3, 1): 53.6, _at(3, 2): 53.2}
    top |= {_at(3, h): 51.0 - 0.3 * (h - 3) for h in range(3, 7)}
    # Night of the 4th: a DHW run at 02:00 leaves too few clean hours.
    top |= {_at(4, h): 50.0 - 0.4 * h for h in range(7)}
    periods = [Period("dhw", _at(4, 1, 30), _at(4, 3, 10))]
    loss = standing_loss(top, periods)
    assert loss[date(2026, 11, 2)] == pytest.approx(0.5)
    assert loss[date(2026, 11, 3)] == pytest.approx(0.3)
    assert date(2026, 11, 4) not in loss
    # Daytime hours never count.
    assert standing_loss({_at(5, h): 50.0 - h for h in range(10, 16)}, []) == {}


def test_weekly_median_by_monday() -> None:
    values = {
        date(2026, 11, 2): 0.4,  # Monday
        date(2026, 11, 3): 0.6,
        date(2026, 11, 4): 0.5,
        date(2026, 11, 9): 0.3,  # next Monday
    }
    assert weekly_median(values) == {
        date(2026, 11, 2): 0.5,
        date(2026, 11, 9): 0.3,
    }


async def test_websocket_dhw(hass: HomeAssistant, freezer) -> None:
    freezer.move_to("2026-11-11 12:00:00+00:00")
    sensors = dict(WEHEAT_SENSORS)
    sensors["dhw_bottom_temperature"] = ("weheat_dhw_bottom", "°C", "temperature")
    sensors["dhw_top_temperature"] = ("weheat_dhw_top", "°C", "temperature")
    weheat = add_weheat_pump(hass, sensors=sensors)
    entry = MockConfigEntry(
        domain=DOMAIN,
        title="Pump",
        unique_id=PUMP_UUID,
        data={CONF_HEAT_PUMP_ID: PUMP_UUID},
        options={CONF_OUTDOOR_ENTITY: weheat.entity_ids["outside_temperature"]},
    )
    entry.add_to_hass(hass)
    await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()

    bottom = weheat.entity_ids["dhw_bottom_temperature"]
    start = dt_util.start_of_local_day(date(2026, 11, 9))
    rows = []
    peaks = {7: 53.0, 30: 52.0, 38: 62.0}  # 9 Nov 07:00, 10 Nov 06:00 and 14:00
    for hour in range(48):
        value = peaks.get(hour, 45.0)
        rows.append(
            {
                "start": start + timedelta(hours=hour),
                "mean": value,
                "min": value,
                "max": value,
            }
        )
    async_import_statistics(
        hass,
        {
            "has_sum": False,
            "mean_type": StatisticMeanType.ARITHMETIC,
            "name": None,
            "source": "recorder",
            "statistic_id": bottom,
            "unit_class": "temperature",
            "unit_of_measurement": "°C",
        },
        rows,
    )
    await async_wait_recording_done(hass)
    tz = dt_util.get_default_time_zone()
    entry.runtime_data.operating.periods[:0] = [
        Period(
            "dhw",
            datetime(2026, 11, 9, 7, 5, tzinfo=tz),
            datetime(2026, 11, 9, 7, 50, tzinfo=tz),
        ),
        Period(
            "dhw",
            datetime(2026, 11, 10, 6, 0, tzinfo=tz),
            datetime(2026, 11, 10, 6, 45, tzinfo=tz),
        ),
        Period(
            "legionella",
            datetime(2026, 11, 10, 13, 30, tzinfo=tz),
            datetime(2026, 11, 10, 14, 50, tzinfo=tz),
        ),
    ]

    connection = MagicMock()
    ws_dhw(
        hass,
        connection,
        {"id": 1, "type": "weheat_insights/dhw", "entry_id": entry.entry_id, "days": 7},
    )
    await hass.async_block_till_done(wait_background_tasks=True)
    _, result = connection.send_result.call_args.args
    days = {row["day"]: row for row in result["days"]}
    assert len(result["days"]) == 7
    assert days["2026-11-09"]["target_c"] == 53.0
    assert days["2026-11-10"]["target_c"] == 52.0  # legionella left out
    assert days["2026-11-10"]["legionella"] is True
    assert days["2026-11-11"]["target_c"] is None
    assert len(result["start_hours"]) == 24
    assert result["summary"]["target_typical_c"] == 52.5

    # The same targets as an external statistic, for the statistics graph.
    stats = entry.runtime_data.coordinator.dhw_target_statistics
    await stats.async_update(date(2026, 11, 11), entry.runtime_data)
    await async_wait_recording_done(hass)
    rows = await get_instance(hass).async_add_executor_job(
        statistics_during_period,
        hass,
        start,
        start + timedelta(days=3),
        {stats.statistic_id},
        "day",
        None,
        {"mean"},
    )
    assert [r["mean"] for r in rows[stats.statistic_id]] == [53.0, 52.0]

    connection = MagicMock()
    ws_dhw(hass, connection, {"id": 2, "type": "x", "entry_id": "nope", "days": 7})
    await hass.async_block_till_done(wait_background_tasks=True)
    connection.send_error.assert_called_once()
