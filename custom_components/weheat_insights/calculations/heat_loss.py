"""Heat-loss coefficient of the house from daily heating energy.

Model, one point per day:

    heating heat (kWh/day) = a * (T_indoor - T_outdoor) + b

``a`` is the heat lost per kelvin per day, so the heat-loss coefficient is
H = a * 1000 / 24 W/K. ``b`` is normally negative: free heat from sun,
people and appliances. Days are left out when the house was storing or
releasing heat (indoor temperature changed a lot from the day before),
when another heat source ran, when data is missing, when it was too mild
to say anything, or when there was (almost) no space heating at all.
"""

from __future__ import annotations

from collections.abc import Iterable
from dataclasses import dataclass, field
from datetime import date
from enum import StrEnum

from .regression import LinearFit, linear_fit

MIN_DAYS = 14
MIN_SPREAD_K = 6.0
MIN_DELTA_K = 3.0
# Days with hardly any space heating are below the balance point: the house
# needed no heat, so they say nothing about heat loss, and as zeros they
# would pull the line flat (it cannot go below zero).
MIN_HEATING_KWH_PER_DAY = 1.0
MAX_INDOOR_CHANGE_K = 1.5
DESIGN_INDOOR_C = 20.0
DESIGN_OUTDOOR_C = -10.0


class Exclusion(StrEnum):
    """Why a day is not used for the fit."""

    MISSING_DATA = "missing_data"
    TOO_MILD = "too_mild"
    NO_HEATING = "no_heating"
    INDOOR_CHANGED = "indoor_changed"
    OTHER_HEAT_SOURCE = "other_heat_source"


@dataclass(frozen=True, slots=True)
class DayPoint:
    """One day of input."""

    day: date
    heating_kwh: float | None
    indoor_c: float | None
    outdoor_c: float | None
    other_heat_source: bool = False


@dataclass(frozen=True, slots=True)
class ClassifiedDay:
    """A day with its temperature difference and why it was excluded."""

    day: date
    heating_kwh: float | None
    delta_k: float | None
    excluded: Exclusion | None


@dataclass(frozen=True, slots=True)
class HeatLossResult:
    """Fit result; ``fit`` is None when there is not enough data yet."""

    days: list[ClassifiedDay]
    fit: LinearFit | None
    spread_k: float
    mean_indoor_c: float | None
    reason: str | None = None  # why there is no result
    used: int = field(default=0)

    @property
    def coefficient_w_per_k(self) -> float | None:
        """Heat-loss coefficient H in W/K."""
        return None if self.fit is None else self.fit.slope * 1000 / 24

    @property
    def coefficient_ci95(self) -> float | None:
        """95 % confidence half width of H in W/K."""
        return None if self.fit is None else self.fit.slope_ci95 * 1000 / 24

    @property
    def design_load_kw(self) -> float | None:
        """Heat loss at the design temperatures (20 °C in, -10 °C out), kW."""
        h = self.coefficient_w_per_k
        return None if h is None else h * (DESIGN_INDOOR_C - DESIGN_OUTDOOR_C) / 1000

    @property
    def balance_point_c(self) -> float | None:
        """Outdoor temperature where no heating is needed, if determinable."""
        if self.fit is None or self.mean_indoor_c is None or self.fit.slope <= 0:
            return None
        if self.fit.intercept >= 0:
            return None  # no measurable free heat: no meaningful balance point
        return self.mean_indoor_c - (-self.fit.intercept / self.fit.slope)


def classify(points: Iterable[DayPoint]) -> list[ClassifiedDay]:
    """Decide for each day whether it can be used."""
    result: list[ClassifiedDay] = []
    previous_indoor: dict[date, float] = {}
    ordered = sorted(points, key=lambda p: p.day)
    for point in ordered:
        if point.indoor_c is not None:
            previous_indoor[point.day] = point.indoor_c
    for point in ordered:
        delta = (
            None
            if point.indoor_c is None or point.outdoor_c is None
            else point.indoor_c - point.outdoor_c
        )
        prev = previous_indoor.get(date.fromordinal(point.day.toordinal() - 1))
        if point.heating_kwh is None or delta is None:
            reason: Exclusion | None = Exclusion.MISSING_DATA
        elif point.other_heat_source:
            reason = Exclusion.OTHER_HEAT_SOURCE
        elif delta < MIN_DELTA_K:
            reason = Exclusion.TOO_MILD
        elif point.heating_kwh < MIN_HEATING_KWH_PER_DAY:
            reason = Exclusion.NO_HEATING
        elif (
            prev is not None
            and point.indoor_c is not None
            and abs(point.indoor_c - prev) > MAX_INDOOR_CHANGE_K
        ):
            reason = Exclusion.INDOOR_CHANGED
        else:
            reason = None
        result.append(ClassifiedDay(point.day, point.heating_kwh, delta, reason))
    return result


def heat_loss(points: Iterable[DayPoint]) -> HeatLossResult:
    """Classify the days and fit the heat-loss line when there is enough data."""
    points = list(points)
    days = classify(points)
    used = [d for d in days if d.excluded is None]
    indoor_by_day = {p.day: p.indoor_c for p in points}
    xs = [d.delta_k for d in used]  # type: ignore[misc]
    ys = [d.heating_kwh for d in used]  # type: ignore[misc]
    spread = (max(xs) - min(xs)) if xs else 0.0
    indoors = [indoor_by_day[d.day] for d in used if indoor_by_day[d.day] is not None]
    mean_indoor = sum(indoors) / len(indoors) if indoors else None

    if len(used) < MIN_DAYS:
        return HeatLossResult(
            days, None, spread, mean_indoor, "too_few_days", len(used)
        )
    if spread < MIN_SPREAD_K:
        return HeatLossResult(
            days, None, spread, mean_indoor, "too_little_spread", len(used)
        )
    fit = linear_fit(xs, ys)  # type: ignore[arg-type]
    if fit is None or fit.slope <= 0:
        return HeatLossResult(days, None, spread, mean_indoor, "no_relation", len(used))
    return HeatLossResult(days, fit, spread, mean_indoor, None, len(used))
