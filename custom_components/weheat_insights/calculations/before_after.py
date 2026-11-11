"""Compare heating before and after a heating-curve change, per degree day.

Weather differs between the two periods, so heating electricity is divided
by degree days. The heating COP is shown as well; it does not need weather
correction as much, but a colder period does lower it somewhat.
"""

from __future__ import annotations

from collections.abc import Mapping
from dataclasses import dataclass
from datetime import date, timedelta
from functools import reduce
import operator

from .degree_days import heat_per_degree_day
from .performance import EnergyTotals, ratio

WINDOW_DAYS = 60
MIN_DAYS = 7


@dataclass(frozen=True, slots=True)
class PeriodFigures:
    """Heating figures for one side of the comparison."""

    start: date
    end: date  # exclusive
    days: int
    degree_days: float
    electricity_kwh: float
    heat_kwh: float

    @property
    def electricity_per_degree_day(self) -> float | None:
        """Heating electricity per degree day (kWh/K·d)."""
        return heat_per_degree_day(self.electricity_kwh, self.degree_days)

    @property
    def cop(self) -> float | None:
        """Heating COP over the period."""
        return ratio(self.heat_kwh, self.electricity_kwh)


@dataclass(frozen=True, slots=True)
class Comparison:
    """Before and after a change; None sides have too few days."""

    changed_on: date
    before: PeriodFigures | None
    after: PeriodFigures | None

    @property
    def change_percent(self) -> float | None:
        """Change in heating electricity per degree day, in percent."""
        if self.before is None or self.after is None:
            return None
        old = self.before.electricity_per_degree_day
        new = self.after.electricity_per_degree_day
        if old is None or new is None or old == 0:
            return None
        return (new - old) / old * 100


def _figures(
    start: date,
    end: date,
    energy: Mapping[date, EnergyTotals],
    degree_days: Mapping[date, float],
) -> PeriodFigures | None:
    days = [
        d
        for d in (start + timedelta(n) for n in range((end - start).days))
        if d in energy and d in degree_days
    ]
    if len(days) < MIN_DAYS:
        return None
    totals = reduce(operator.add, (energy[d] for d in days), EnergyTotals())
    electricity, heat = totals.mode_energy("heating")
    return PeriodFigures(
        start=days[0],
        end=days[-1] + timedelta(days=1),
        days=len(days),
        degree_days=sum(degree_days[d] for d in days),
        electricity_kwh=electricity,
        heat_kwh=heat,
    )


def compare(
    changed_on: date,
    today: date,
    energy: Mapping[date, EnergyTotals],
    degree_days: Mapping[date, float],
) -> Comparison:
    """Up to 60 days before the change against the days since (not today)."""
    before = _figures(
        changed_on - timedelta(days=WINDOW_DAYS), changed_on, energy, degree_days
    )
    after = _figures(
        changed_on, min(today, changed_on + timedelta(WINDOW_DAYS)), energy, degree_days
    )
    return Comparison(changed_on, before, after)
