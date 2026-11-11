"""Cool-down rate of the house from hourly data.

During a period without heating the indoor-outdoor difference decays
roughly exponentially: dT(t) = dT0 * exp(-t / tau). Fitting ln(dT) against
time gives the time constant tau in hours. With the heat-loss coefficient H
this gives the thermal mass of the house: C = tau * H.
"""

from __future__ import annotations

from collections.abc import Sequence
from dataclasses import dataclass
from datetime import datetime, timedelta
import math
from statistics import median

from .regression import linear_fit

MIN_HOURS = 4
NO_HEAT_KWH = 0.05  # heating heat per hour regarded as "off"
MIN_START_DELTA_K = 5.0
MIN_EPISODES = 3
MIN_R_SQUARED = 0.5
TAU_RANGE_H = (5.0, 1000.0)
REFERENCE_DELTA_K = 15.0


@dataclass(frozen=True, slots=True)
class HourPoint:
    """Hourly means (and the heating heat delivered in that hour)."""

    start: datetime
    indoor_c: float | None
    outdoor_c: float | None
    heating_kwh: float | None


@dataclass(frozen=True, slots=True)
class Episode:
    """One cool-down period and its fitted time constant."""

    start: datetime
    hours: int
    start_delta_k: float
    tau_h: float
    r_squared: float


@dataclass(frozen=True, slots=True)
class CoolDownResult:
    """Median time constant over all accepted episodes."""

    episodes: list[Episode]
    tau_h: float | None

    def rate_k_per_h(self, delta_k: float = REFERENCE_DELTA_K) -> float | None:
        """Return the initial cool-down speed at an indoor-outdoor difference."""
        return None if self.tau_h is None else delta_k / self.tau_h

    def thermal_mass_kwh_per_k(self, h_w_per_k: float | None) -> float | None:
        """C = tau * H, in kWh/K."""
        if self.tau_h is None or h_w_per_k is None:
            return None
        return self.tau_h * h_w_per_k / 1000


def _runs(points: Sequence[HourPoint]) -> list[list[HourPoint]]:
    """Consecutive hours without heating and with complete data."""
    runs: list[list[HourPoint]] = []
    current: list[HourPoint] = []
    for point in points:
        quiet = (
            point.heating_kwh is not None
            and point.heating_kwh <= NO_HEAT_KWH
            and point.indoor_c is not None
            and point.outdoor_c is not None
        )
        contiguous = not current or point.start - current[-1].start == timedelta(
            hours=1
        )
        if quiet and contiguous:
            current.append(point)
        else:
            if current:
                runs.append(current)
            current = [point] if quiet else []
    if current:
        runs.append(current)
    return runs


def fit_episode(run: Sequence[HourPoint]) -> Episode | None:
    """Fit one run; the first hour is skipped (it may still contain heating)."""
    hours = list(run[1:])
    if len(hours) < MIN_HOURS:
        return None
    deltas = [p.indoor_c - p.outdoor_c for p in hours]  # type: ignore[operator]
    if deltas[0] < MIN_START_DELTA_K or min(deltas) <= 0:
        return None
    fit = linear_fit(list(range(len(deltas))), [math.log(d) for d in deltas])
    if fit is None or fit.slope >= 0 or fit.r_squared < MIN_R_SQUARED:
        return None
    tau = -1 / fit.slope
    if not TAU_RANGE_H[0] <= tau <= TAU_RANGE_H[1]:
        return None
    return Episode(hours[0].start, len(hours), deltas[0], tau, fit.r_squared)


def cool_down(points: Sequence[HourPoint]) -> CoolDownResult:
    """Find cool-down episodes and return their median time constant."""
    ordered = sorted(points, key=lambda p: p.start)
    episodes = [e for run in _runs(ordered) if (e := fit_episode(run)) is not None]
    tau = median(e.tau_h for e in episodes) if len(episodes) >= MIN_EPISODES else None
    return CoolDownResult(episodes, tau)
