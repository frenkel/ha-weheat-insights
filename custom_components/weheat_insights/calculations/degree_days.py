"""Degree days.

Plain degree days for a day are ``max(0, base - mean outdoor temperature)``.
Weighted degree days (the Dutch "gewogen graaddagen" convention) multiply
that by 1.1 for November to February, 1.0 for March and October and 0.8 for
April to September, to account for sun and season.
"""

from __future__ import annotations

from collections.abc import Mapping
from datetime import date

DEFAULT_BASE_C = 18.0

# Below this many degree days a ratio like kWh per degree day is noise.
MIN_DEGREE_DAYS = 1.0

_WEIGHTS = {11: 1.1, 12: 1.1, 1: 1.1, 2: 1.1, 3: 1.0, 10: 1.0}


def month_weight(month: int) -> float:
    """Weighting factor for weighted degree days."""
    return _WEIGHTS.get(month, 0.8)


def degree_days_for_day(
    day: date,
    mean_temp_c: float,
    base_c: float = DEFAULT_BASE_C,
    weighted: bool = False,
) -> float:
    """Degree days for one day, from its mean outdoor temperature."""
    value = max(0.0, base_c - mean_temp_c)
    return value * month_weight(day.month) if weighted else value


def degree_days_by_day(
    daily_means: Mapping[date, float], base_c: float, weighted: bool
) -> dict[date, float]:
    """Degree days per day for a mapping of daily mean temperatures."""
    return {
        day: degree_days_for_day(day, mean, base_c, weighted)
        for day, mean in daily_means.items()
    }


def heat_per_degree_day(
    heat_kwh: float, degree_days: float, minimum: float = MIN_DEGREE_DAYS
) -> float | None:
    """Space-heating heat per degree day (kWh/K·d), None if too few degree days."""
    if degree_days < minimum:
        return None
    return heat_kwh / degree_days
