"""Domestic hot water (SWW): tank temperature, runs, COP and standing loss.

Pure functions; the recorder and the operating tracker feed them.

- The tank target is the highest temperature the BOTTOM sensor reaches
  during an ordinary hot-water run: the heat pump stops charging once the
  bottom of the tank reaches the target. Hours touched by legionella
  prevention are left out, so a weekly (or daily) high-temperature run
  does not count as the target.
- Standing loss is how fast the TOP of the tank cools at night while nothing
  is drawn and nothing is heated. A small hot-water draw also cools the top,
  so nights with a sudden drop are left out.
"""

from __future__ import annotations

from collections.abc import Iterable, Mapping
from dataclasses import dataclass
from datetime import date, datetime, timedelta
from statistics import median

from .operating import Period
from .performance import EnergyTotals, ratio

# A day's DHW COP needs at least this much DHW electricity (kWh); one or two
# short runs on a summer day are often below the 0.5 kWh used elsewhere.
MIN_DHW_KWH = 0.25
# Night window for standing loss: hours starting at 00:00 up to 06:00 local.
NIGHT_HOURS = range(7)
# Settling time after a run before the top sensor is a fair measure.
SETTLE = timedelta(hours=1)
# Hour-to-hour changes of the top sensor that mean something else happened.
MAX_DROP_K = 1.0  # a draw
MAX_RISE_K = 0.2  # heating
MIN_HOURS = 3  # values (so at least two hour steps)

TANK_GROUPS = ("dhw", "legionella")


@dataclass(frozen=True, slots=True)
class DhwDay:
    """One day of hot water."""

    day: date
    target_c: float | None  # bottom temperature reached by hot-water runs
    legionella: bool
    runs: int
    heat_kwh: float
    electricity_kwh: float
    cop: float | None
    outdoor_c: float | None


def _local_day(moment: datetime) -> date:
    return moment.date()


def dhw_days(
    days: Iterable[date],
    *,
    targets: Mapping[date, float],
    energy: Mapping[date, EnergyTotals],
    outdoor_mean: Mapping[date, float],
    periods: Iterable[Period],
) -> list[DhwDay]:
    """Combine the daily figures; periods must be in local time."""
    runs: dict[date, int] = {}
    legionella: set[date] = set()
    for period in periods:
        day = _local_day(period.start)
        if period.group == "dhw":
            runs[day] = runs.get(day, 0) + 1
        elif period.group == "legionella":
            legionella.add(day)
    result = []
    for day in days:
        totals = energy.get(day, EnergyTotals())
        electricity, heat = totals.mode_energy("dhw")
        result.append(
            DhwDay(
                day=day,
                target_c=targets.get(day),
                legionella=day in legionella,
                runs=runs.get(day, 0),
                heat_kwh=heat,
                electricity_kwh=electricity,
                cop=ratio(heat, electricity, MIN_DHW_KWH),
                outdoor_c=outdoor_mean.get(day),
            )
        )
    return result


def _hours(period: Period, after: timedelta = timedelta(0)) -> list[datetime]:
    """Hour starts (local) from the hour a period starts to the one it ends."""
    hour = period.start.replace(minute=0, second=0, microsecond=0)
    hours = []
    while hour < period.end + after:
        hours.append(hour)
        hour += timedelta(hours=1)
    return hours


def run_targets(
    bottom_hourly_max: Mapping[datetime, float], periods: Iterable[Period]
) -> dict[date, float]:
    """Tank target per day: highest bottom temperature during hot-water runs.

    Uses hourly maxima (local hour starts) in the hours of each ``dhw`` run.
    Hours touched by legionella prevention, and the hour after it, are left
    out: the tank is still hotter than its usual target then.
    """
    periods = list(periods)
    legionella = {
        hour
        for period in periods
        if period.group == "legionella"
        for hour in _hours(period, timedelta(hours=1))
    }
    result: dict[date, float] = {}
    for period in periods:
        if period.group != "dhw":
            continue
        values = [
            bottom_hourly_max[hour]
            for hour in _hours(period)
            if hour not in legionella and hour in bottom_hourly_max
        ]
        if values:
            day = period.start.date()
            result[day] = max(result.get(day, values[0]), *values)
    return result


def start_hours(periods: Iterable[Period], since: datetime) -> list[int]:
    """Count hot-water runs (incl. legionella) starting in each hour 0-23."""
    counts = [0] * 24
    for period in periods:
        if period.group in TANK_GROUPS and period.start >= since:
            counts[period.start.hour] += 1
    return counts


def _busy_hours(periods: Iterable[Period]) -> set[datetime]:
    """Hour starts (local) touched by a tank run or its settling time."""
    return {
        hour
        for period in periods
        if period.group in TANK_GROUPS
        for hour in _hours(period, SETTLE)
    }


def standing_loss(
    top_hourly: Mapping[datetime, float], periods: Iterable[Period]
) -> dict[date, float]:
    """Cooling of the tank top (K/h) per night, from hourly means (local)."""
    busy = _busy_hours(periods)
    by_night: dict[date, list[tuple[datetime, float]]] = {}
    for hour, value in top_hourly.items():
        if hour.hour in NIGHT_HOURS and hour not in busy:
            by_night.setdefault(hour.date(), []).append((hour, value))
    result: dict[date, float] = {}
    for night, values in by_night.items():
        rate = _night_rate(sorted(values))
        if rate is not None:
            result[night] = rate
    return result


def _night_rate(values: list[tuple[datetime, float]]) -> float | None:
    """Mean drop per hour over the longest clean run of consecutive hours."""
    best: list[tuple[datetime, float]] = []
    run: list[tuple[datetime, float]] = []
    for hour, value in values:
        if run:
            step = value - run[-1][1]
            consecutive = hour - run[-1][0] == timedelta(hours=1)
            if not consecutive or step < -MAX_DROP_K or step > MAX_RISE_K:
                run = []
        run.append((hour, value))
        if len(run) > len(best):
            best = list(run)
    if len(best) < MIN_HOURS:
        return None
    hours = (best[-1][0] - best[0][0]).total_seconds() / 3600
    return (best[0][1] - best[-1][1]) / hours


def weekly_median(values: Mapping[date, float]) -> dict[date, float]:
    """Median per week, keyed by the Monday of the week."""
    weeks: dict[date, list[float]] = {}
    for day, value in values.items():
        monday = day - timedelta(days=day.weekday())
        weeks.setdefault(monday, []).append(value)
    return {monday: median(rates) for monday, rates in sorted(weeks.items())}
