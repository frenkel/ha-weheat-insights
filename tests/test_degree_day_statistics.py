"""Tests for the external degree-day statistic."""

from datetime import date, timedelta

from homeassistant.components.recorder import get_instance
from homeassistant.components.recorder.models import StatisticMeanType
from homeassistant.components.recorder.statistics import (
    async_import_statistics,
    statistics_during_period,
)
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
import pytest
from pytest_homeassistant_custom_component.components.recorder.common import (
    async_wait_recording_done,
)

from custom_components.weheat_insights.coordinator import Settings
from custom_components.weheat_insights.degree_day_statistics import (
    DegreeDayStatistics,
    cumulative_rows,
    statistic_id,
)


def test_statistic_id_is_valid() -> None:
    assert statistic_id("0B5C-11aa") == "weheat_insights:degree_days_0b5c_11aa"


def test_cumulative_rows() -> None:
    rows = cumulative_rows({date(2026, 1, 2): 3.0, date(2026, 1, 1): 2.0}, 10.0)
    assert rows == [(date(2026, 1, 1), 2.0, 12.0), (date(2026, 1, 2), 3.0, 15.0)]


async def _read(hass, sid, start, end, period="day"):
    rows = await get_instance(hass).async_add_executor_job(
        statistics_during_period,
        hass,
        dt_util.start_of_local_day(start),
        dt_util.start_of_local_day(end),
        {sid},
        period,
        None,
        {"change", "sum"},
    )
    return rows.get(sid, [])


async def test_backfill_then_extend(hass: HomeAssistant) -> None:
    await hass.config.async_set_time_zone("Europe/Amsterdam")
    first = date(2026, 11, 1)
    start = dt_util.start_of_local_day(first)
    async_import_statistics(
        hass,
        {
            "has_sum": False,
            "mean_type": StatisticMeanType.ARITHMETIC,
            "name": None,
            "source": "recorder",
            "statistic_id": "sensor.outdoor",
            "unit_class": "temperature",
            "unit_of_measurement": "°C",
        },
        [{"start": start + timedelta(hours=h), "mean": 8.0} for h in range(24 * 5)],
    )
    await async_wait_recording_done(hass)

    stats = DegreeDayStatistics(hass, "pump-1", "Pump degree days")
    today = date(2026, 11, 4)
    await stats.async_update(today, Settings(), "sensor.outdoor", {})
    await async_wait_recording_done(hass)

    rows = await _read(hass, stats.statistic_id, first, date(2026, 11, 10))
    # Only completed days (1-3 Nov) are written, 10 degree days each.
    assert [row["change"] for row in rows] == pytest.approx([10.0, 10.0, 10.0])

    # Next day: 4 Nov is complete now and gets appended, sums continue.
    await stats.async_update(
        date(2026, 11, 5),
        Settings(),
        "sensor.outdoor",
        {date(2026, 11, 3): 8.0, date(2026, 11, 4): 13.0},
    )
    await async_wait_recording_done(hass)
    rows = await _read(hass, stats.statistic_id, first, date(2026, 11, 10))
    assert [row["change"] for row in rows] == pytest.approx([10.0, 10.0, 10.0, 5.0])
    assert rows[-1]["sum"] == pytest.approx(35.0)


async def test_nothing_without_outdoor_sensor(hass: HomeAssistant) -> None:
    stats = DegreeDayStatistics(hass, "pump-1", "Pump degree days")
    await stats.async_update(date(2026, 11, 4), Settings(), None, {})
    await async_wait_recording_done(hass)
    assert (
        await _read(hass, stats.statistic_id, date(2026, 1, 1), date(2027, 1, 1)) == []
    )
