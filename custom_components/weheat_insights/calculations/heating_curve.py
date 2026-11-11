"""Heating-curve advice: the lowest supply temperature that keeps the target.

For each outdoor temperature of the Weheat curve:

1. Heat demand from the heat-loss fit, with the target room temperature:
   Q = (a * (T_target - T_out) + b) / 24 kW (``a``, ``b`` from the daily fit).
2. The mean water temperature at which the heating system delivers Q,
   from the emitter law Q = K * (T_water - T_room) ** n. K is calibrated on
   hours in which the pump heated steadily; n is 1.3 for radiators, 1.1 for
   underfloor heating and 1.2 for a mix.
3. Supply = mean water temperature + half the supply-return difference,
   which is calibrated as proportional to the delivered heat.

Above the balance point no heat is needed and the advice is the target room
temperature. Points far outside the measured outdoor range are flagged as
extrapolated. Ranges come from the 95 % interval of the heat-loss slope.
"""

from __future__ import annotations

from collections.abc import Sequence
from dataclasses import dataclass
import math
from statistics import median

# Outdoor temperatures at which the Weheat app and portal define the curve.
WEHEAT_CURVE_POINTS: tuple[float, ...] = (-20.0, 9.0, 15.0, 20.0, 25.0)

EMITTER_EXPONENTS = {"radiators": 1.3, "underfloor": 1.1, "mixed": 1.2}

MIN_CALIBRATION_HOURS = 24
MIN_WATER_ROOM_DIFF_K = 3.0
EXTRAPOLATION_MARGIN_K = 3.0


@dataclass(frozen=True, slots=True)
class SteadyHour:
    """An hour of steady space heating: mean temperatures and heat delivered."""

    heat_kw: float
    supply_c: float
    return_c: float
    room_c: float


@dataclass(frozen=True, slots=True)
class EmitterModel:
    """Q = k * (T_water_mean - T_room) ** n; supply-return = dt_per_kw * Q."""

    k: float
    n: float
    dt_per_kw: float
    hours: int

    def water_mean_for(self, heat_kw: float, room_c: float) -> float:
        """Mean water temperature needed to deliver ``heat_kw``."""
        if heat_kw <= 0:
            return room_c
        return room_c + (heat_kw / self.k) ** (1 / self.n)

    def supply_for(self, heat_kw: float, room_c: float) -> float:
        """Supply temperature needed to deliver ``heat_kw``."""
        if heat_kw <= 0:
            return room_c
        return self.water_mean_for(heat_kw, room_c) + self.dt_per_kw * heat_kw / 2


def calibrate_emitters(hours: Sequence[SteadyHour], n: float) -> EmitterModel | None:
    """Robust (median) calibration of k and the supply-return difference."""
    ks: list[float] = []
    dts: list[float] = []
    for hour in hours:
        water_mean = (hour.supply_c + hour.return_c) / 2
        diff = water_mean - hour.room_c
        if hour.heat_kw <= 0 or diff < MIN_WATER_ROOM_DIFF_K:
            continue
        ks.append(hour.heat_kw / diff**n)
        dts.append(max(0.0, hour.supply_c - hour.return_c) / hour.heat_kw)
    if len(ks) < MIN_CALIBRATION_HOURS:
        return None
    return EmitterModel(k=median(ks), n=n, dt_per_kw=median(dts), hours=len(ks))


@dataclass(frozen=True, slots=True)
class CurvePoint:
    """Advice for one outdoor temperature of the Weheat curve."""

    outdoor_c: float
    heat_kw: float
    supply_c: float  # one decimal precision is meaningful for the portal
    supply_low_c: float
    supply_high_c: float
    extrapolated: bool

    @property
    def no_heat_needed(self) -> bool:
        """Above the balance point: the value hardly matters (≤ room target)."""
        return self.heat_kw <= 0

    @property
    def app_c(self) -> int:
        """Whole degrees for the app, rounded up so the house stays warm."""
        return math.ceil(self.supply_c - 1e-9)


def heat_demand_kw(
    slope: float, intercept: float, target_c: float, outdoor_c: float
) -> float:
    """Average heat demand from the daily fit (kWh/day per K and kWh/day)."""
    return max(0.0, (slope * (target_c - outdoor_c) + intercept) / 24)


def advise(
    *,
    slope: float,
    slope_ci: float,
    intercept: float,
    emitters: EmitterModel,
    target_c: float,
    observed_outdoor: tuple[float, float],
    points: Sequence[float] = WEHEAT_CURVE_POINTS,
) -> list[CurvePoint]:
    """Advised supply temperature at each curve point, with a range."""
    low_out, high_out = observed_outdoor
    result = []
    for outdoor in points:
        demand = heat_demand_kw(slope, intercept, target_c, outdoor)
        low = heat_demand_kw(max(0.0, slope - slope_ci), intercept, target_c, outdoor)
        high = heat_demand_kw(slope + slope_ci, intercept, target_c, outdoor)
        result.append(
            CurvePoint(
                outdoor_c=outdoor,
                heat_kw=demand,
                supply_c=emitters.supply_for(demand, target_c),
                supply_low_c=emitters.supply_for(low, target_c),
                supply_high_c=emitters.supply_for(high, target_c),
                extrapolated=not (
                    low_out - EXTRAPOLATION_MARGIN_K
                    <= outdoor
                    <= high_out + EXTRAPOLATION_MARGIN_K
                ),
            )
        )
    return result
