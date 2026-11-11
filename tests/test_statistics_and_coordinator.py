"""Tests for reading statistics and computing period figures."""

from datetime import date, timedelta

from homeassistant.components.recorder.models import StatisticMeanType
from homeassistant.components.recorder.statistics import async_import_statistics
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
import pytest
from pytest_homeassistant_custom_component.components.recorder.common import (
    async_wait_recording_done,
)

from custom_components.weheat_insights.calculations.performance import EnergyTotals
from custom_components.weheat_insights.coordinator import (
    Settings,
    compute,
    fetch_start,
)
from custom_components.weheat_insights.discovery import WeheatKey
from custom_components.weheat_insights.statistics import (
    async_daily_means,
    async_energy,
)

DAY = EnergyTotals(
    in_heating=4.0,
    in_dhw=1.0,
    in_defrost=0.2,
    in_standby=0.3,
    out_heating=16.0,
    out_dhw=3.0,
    out_defrost=-0.8,
)


def _days(start: date, end: date):
    day = start
    while day < end:
        yield day
        day += timedelta(days=1)


def test_compute_periods_and_last_year() -> None:
    today = date(2026, 11, 11)
    energy = {d: DAY for d in _days(date(2025, 9, 1), today + timedelta(days=1))}
    means = {d: 8.0 for d in energy}  # 10 degree days per day at base 18

    data = compute(today, Settings(weighted_degree_days=False), energy, means)

    assert data.today.start == today
    assert data.today.performance.totals == DAY
    assert data.month.start == date(2026, 11, 1)
    assert data.month.performance.totals.in_heating == pytest.approx(4.0 * 11)
    assert (data.season.start, data.season.end) == (
        date(2026, 9, 1),
        date(2026, 11, 12),
    )
    # Same period last year: 1 Sep 2025 up to and including 11 Nov 2025.
    last = data.season_last_year_same_period
    assert (last.start, last.end) == (date(2025, 9, 1), date(2025, 11, 12))
    assert data.last_season.end == date(2026, 6, 1)

    # Identical days give identical figures in every period.
    assert data.season.performance.cop == pytest.approx(data.today.performance.cop)
    assert data.season.degree_days == pytest.approx(10.0 * 72)
    heating_heat = DAY.mode_energy("heating")[1]
    assert data.today.heat_per_degree_day == pytest.approx(heating_heat / 10.0)
    assert data.season.heat_per_degree_day == pytest.approx(last.heat_per_degree_day)


def test_compute_without_outdoor_data() -> None:
    today = date(2026, 11, 11)
    data = compute(today, Settings(), {today: DAY}, {})
    assert data.today.degree_days is None
    assert data.today.heat_per_degree_day is None
    assert data.today.performance.cop is not None


def test_compute_weighted_degree_days() -> None:
    today = date(2026, 11, 11)
    data = compute(
        today,
        Settings(degree_day_base=15.5, weighted_degree_days=True),
        {},
        {today: 5.5},
    )
    assert data.today.degree_days == pytest.approx(11.0)


def test_weighted_degree_days_are_the_default() -> None:
    today = date(2026, 11, 11)
    data = compute(today, Settings(), {}, {today: 8.0})
    assert data.today.degree_days == pytest.approx(11.0)  # (18 - 8) x 1.1


def test_fetch_start_covers_previous_season() -> None:
    assert fetch_start(date(2026, 11, 11), Settings()) == date(2025, 9, 1)


def _import_sum(hass, statistic_id: str, unit: str, hourly: list[float], start):
    total = 0.0
    rows = []
    for index, value in enumerate(hourly):
        total += value
        rows.append(
            {"start": start + timedelta(hours=index), "state": total, "sum": total}
        )
    async_import_statistics(
        hass,
        {
            "has_sum": True,
            "mean_type": StatisticMeanType.NONE,
            "name": None,
            "source": "recorder",
            "statistic_id": statistic_id,
            "unit_class": "energy",
            "unit_of_measurement": unit,
        },
        rows,
    )


async def test_energy_and_means_from_recorder(hass: HomeAssistant) -> None:
    await hass.config.async_set_time_zone("Europe/Amsterdam")
    day1 = date(2026, 11, 9)
    start = dt_util.start_of_local_day(day1)
    entities = {
        WeheatKey.ELECTRICITY_USED_HEATING: "sensor.heating_in",
        WeheatKey.ENERGY_OUTPUT_DEFROST: "sensor.defrost_out",
    }
    # 48 hours: 0.1 kWh per hour on day 1, 0.2 on day 2.
    _import_sum(hass, "sensor.heating_in", "kWh", [0.1] * 24 + [0.2] * 24, start)
    # Defrost output is a decreasing TOTAL counter, given in Wh here.
    _import_sum(hass, "sensor.defrost_out", "Wh", [-50.0] * 48, start)
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
        [
            {"start": start + timedelta(hours=h), "mean": 4.0 if h < 24 else 6.0}
            for h in range(48)
        ],
    )
    await async_wait_recording_done(hass)

    energy = await async_energy(hass, entities, day1, date(2026, 11, 11))
    assert energy[day1].in_heating == pytest.approx(2.4 - 0.1, abs=0.15)
    assert energy[date(2026, 11, 10)].in_heating == pytest.approx(4.8, abs=0.15)
    # Converted to kWh and kept negative.
    assert energy[date(2026, 11, 10)].out_defrost == pytest.approx(-1.2)

    means = await async_daily_means(hass, "sensor.outdoor", day1, date(2026, 11, 11))
    assert means == {day1: pytest.approx(4.0), date(2026, 11, 10): pytest.approx(6.0)}

    assert await async_daily_means(hass, None, day1, date(2026, 11, 11)) == {}
    assert await async_energy(hass, {}, day1, date(2026, 11, 11)) == {}


def test_settings_from_options() -> None:
    settings = Settings.from_options(
        {"season_start_month": "10", "degree_day_base": 15.5}
    )
    assert settings == Settings(season_start_month=10, degree_day_base=15.5)


async def test_history_imported_in_front_has_no_negative_first_period(
    hass: HomeAssistant, freezer
) -> None:
    """History prepended before existing rows starts with a negative sum.

    The recorder computes the first period's change against zero, which would
    give one hugely negative day or month; that period is left out.
    """
    await hass.config.async_set_time_zone("Europe/Amsterdam")
    freezer.move_to("2026-11-11 12:00:00+01:00")
    meta = {
        "has_sum": True,
        "mean_type": StatisticMeanType.NONE,
        "name": None,
        "source": "recorder",
        "statistic_id": "sensor.heat_in",
        "unit_class": "energy",
        "unit_of_measurement": "kWh",
    }
    anchor = dt_util.start_of_local_day(date(2026, 9, 14))
    existing = [
        {"start": anchor + timedelta(hours=h), "state": 700 + 0.1 * h, "sum": 0.1 * h}
        for h in range(24 * 10)
    ]
    first = dt_util.start_of_local_day(date(2025, 11, 12))
    hours = int((anchor - first).total_seconds() // 3600)
    prepended = [
        {
            "start": first + timedelta(hours=h),
            "state": 700 - 0.1 * (hours - h),
            "sum": -0.1 * (hours - h),
        }
        for h in range(hours)
    ]
    async_import_statistics(hass, meta, existing)
    async_import_statistics(hass, meta, prepended)
    await async_wait_recording_done(hass)

    entities = {WeheatKey.ELECTRICITY_USED_HEATING: "sensor.heat_in"}
    for period in ("day", "month"):
        energy = await async_energy(
            hass, entities, date(2025, 9, 1), date(2026, 11, 12), period
        )
        assert min(v.in_heating for v in energy.values()) >= 0, period
    daily = await async_energy(hass, entities, date(2025, 9, 1), date(2026, 11, 12))
    assert daily[date(2026, 1, 15)].in_heating == pytest.approx(2.4)
