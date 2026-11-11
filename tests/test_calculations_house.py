"""Tests for the heat-loss fit, cool-down rate and regression helpers."""

from datetime import date, datetime, timedelta
import math

import pytest

from custom_components.weheat_insights.calculations.cool_down import (
    HourPoint,
    cool_down,
    fit_episode,
)
from custom_components.weheat_insights.calculations.heat_loss import (
    DayPoint,
    Exclusion,
    heat_loss,
)
from custom_components.weheat_insights.calculations.regression import (
    linear_fit,
    t95,
)

# A house with H = 200 W/K (4.8 kWh per K per day) and 10 kWh/day free heat.
A = 4.8
B = -10.0


def _days(n: int = 30, indoor: float = 20.0) -> list[DayPoint]:
    start = date(2026, 10, 1)
    points = []
    for i in range(n):
        outdoor = 12 - (i % 13)  # 12 .. 0 °C
        noise = 0.8 * math.sin(i * 1.7)  # deterministic scatter
        heat = A * (indoor - outdoor) + B + noise
        points.append(DayPoint(start + timedelta(days=i), heat, indoor, outdoor))
    return points


def test_linear_fit_perfect_line() -> None:
    fit = linear_fit([1, 2, 3, 4], [3, 5, 7, 9])
    assert fit.slope == pytest.approx(2)
    assert fit.intercept == pytest.approx(1)
    assert fit.r_squared == pytest.approx(1)
    assert fit.slope_stderr == pytest.approx(0)


def test_linear_fit_degenerate() -> None:
    assert linear_fit([1, 2], [1, 2]) is None
    assert linear_fit([1, 1, 1], [1, 2, 3]) is None


def test_t95() -> None:
    assert t95(1) == 12.706
    assert t95(35) == 2.021  # conservative: next table entry up
    assert t95(1000) == 1.960


def test_heat_loss_recovers_coefficient() -> None:
    result = heat_loss(_days())
    assert result.used == 30
    assert result.coefficient_w_per_k == pytest.approx(200, abs=5)
    assert result.coefficient_ci95 < 10
    assert result.fit.r_squared > 0.98
    assert result.design_load_kw == pytest.approx(6.0, abs=0.2)
    # Heat demand reaches zero at 20 - 10 / 4.8 = 17.9 °C outdoors.
    assert result.balance_point_c == pytest.approx(20 - 10 / 4.8, abs=0.5)


def test_exclusions() -> None:
    days = _days()
    days[3] = DayPoint(days[3].day, None, 20.0, 5.0)
    days[4] = DayPoint(days[4].day, 5.0, 20.0, 18.5)
    days[6] = DayPoint(days[6].day, 50.0, 22.5, 5.0)  # was 20 the day before
    days[8] = DayPoint(days[8].day, 30.0, 20.0, 5.0, other_heat_source=True)
    result = heat_loss(days)
    reasons = {d.day: d.excluded for d in result.days}
    assert reasons[days[3].day] is Exclusion.MISSING_DATA
    assert reasons[days[4].day] is Exclusion.TOO_MILD
    assert reasons[days[6].day] is Exclusion.INDOOR_CHANGED
    assert reasons[days[8].day] is Exclusion.OTHER_HEAT_SOURCE
    # Day 7 compares with 22.5 on day 6 and is excluded too.
    assert reasons[days[7].day] is Exclusion.INDOOR_CHANGED
    assert result.used == 25
    assert result.coefficient_w_per_k == pytest.approx(200, abs=6)


def test_no_result_with_too_few_days_or_spread() -> None:
    few = heat_loss(_days(10))
    assert few.fit is None
    assert few.reason == "too_few_days"
    assert few.coefficient_w_per_k is None

    flat = [
        DayPoint(date(2026, 10, 1) + timedelta(days=i), 40.0 + i % 2, 20.0, 9.0)
        for i in range(20)
    ]
    narrow = heat_loss(flat)
    assert narrow.reason == "too_little_spread"


def test_no_balance_point_without_free_heat() -> None:
    days = [
        DayPoint(p.day, A * (p.indoor_c - p.outdoor_c) + 5, p.indoor_c, p.outdoor_c)
        for p in _days()
    ]
    assert heat_loss(days).balance_point_c is None


# --- cool-down -------------------------------------------------------------

TAU = 60.0


def _night(start: datetime, hours: int, delta0: float = 15.0) -> list[HourPoint]:
    """One heated hour, then ``hours`` without heating, decaying with TAU."""
    points = [HourPoint(start, 20.0, 20.0 - delta0, 1.5)]
    for h in range(1, hours + 1):
        delta = delta0 * math.exp(-(h - 1) / TAU)
        points.append(HourPoint(start + timedelta(hours=h), 5.0 + delta, 5.0, 0.0))
    return points


def test_fit_episode_recovers_tau() -> None:
    run = _night(datetime(2026, 11, 1, 23), 7)[1:]
    episode = fit_episode([run[0], *run])
    assert episode.tau_h == pytest.approx(TAU, rel=0.01)
    assert episode.hours == 7


def test_cool_down_needs_enough_episodes() -> None:
    points = []
    for night in range(3):
        start = datetime(2026, 11, 1, 22) + timedelta(days=night)
        points += _night(start, 6)
        # Heated hours in between break the runs.
        points += [
            HourPoint(start + timedelta(hours=7 + h), 20.0, 5.0, 1.0) for h in range(3)
        ]
    result = cool_down(points)
    assert len(result.episodes) == 3
    assert result.tau_h == pytest.approx(TAU, rel=0.01)
    assert result.rate_k_per_h() == pytest.approx(15 / TAU, rel=0.01)
    assert result.thermal_mass_kwh_per_k(200) == pytest.approx(TAU * 0.2, rel=0.01)

    two = cool_down(points[: len(points) * 2 // 3])
    assert two.tau_h is None
    assert two.rate_k_per_h() is None


def test_short_or_heated_runs_are_ignored() -> None:
    short = _night(datetime(2026, 11, 1, 23), 3)
    assert cool_down(short).episodes == []
    gap = _night(datetime(2026, 11, 1, 23), 6)
    del gap[3]  # missing hour splits the run
    assert cool_down(gap).episodes == []
