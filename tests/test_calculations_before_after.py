"""Tests for the before/after comparison."""

from datetime import date, timedelta

import pytest

from custom_components.weheat_insights.calculations.before_after import compare
from custom_components.weheat_insights.calculations.performance import EnergyTotals

CHANGE = date(2026, 11, 1)


def _range(start: date, days: int):
    return [start + timedelta(days=n) for n in range(days)]


def test_weather_corrected_change() -> None:
    energy, dd = {}, {}
    for d in _range(CHANGE - timedelta(days=20), 20):
        energy[d] = EnergyTotals(in_heating=5.0, out_heating=20.0)
        dd[d] = 10.0  # 0.5 kWh per degree day
    for d in _range(CHANGE, 10):
        energy[d] = EnergyTotals(in_heating=5.4, out_heating=24.0)
        dd[d] = 12.0  # colder, but 0.45 kWh per degree day
    result = compare(CHANGE, CHANGE + timedelta(days=10), energy, dd)
    assert result.before.electricity_per_degree_day == pytest.approx(0.5)
    assert result.after.electricity_per_degree_day == pytest.approx(0.45)
    assert result.change_percent == pytest.approx(-10.0)
    assert result.before.cop == pytest.approx(4.0)
    assert result.after.cop == pytest.approx(24 / 5.4)


def test_too_few_days_after() -> None:
    energy = {
        d: EnergyTotals(in_heating=5.0, out_heating=20.0)
        for d in _range(CHANGE - timedelta(days=30), 33)
    }
    dd = dict.fromkeys(energy, 10.0)
    result = compare(CHANGE, CHANGE + timedelta(days=3), energy, dd)
    assert result.before is not None
    assert result.after is None
    assert result.change_percent is None
