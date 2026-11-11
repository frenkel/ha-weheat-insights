"""Operating periods of the heat pump: how often and how long per state.

The core Weheat integration reports the operating state every two minutes,
so lengths are accurate to about two minutes and very short periods (a
brief defrost) can be missed.
"""

from __future__ import annotations

from collections.abc import Iterable, Sequence
from dataclasses import dataclass
from datetime import datetime
from statistics import mean

GROUPS: tuple[str, ...] = ("heating", "dhw", "defrost", "standby", "legionella")

# Core Weheat heat_pump_state options -> our group. States not listed here
# (water check, cooling, self test, manual control, updating, offline,
# unknown, unavailable) are rare or not operation; they are gaps: they end a
# period and start none.
STATE_GROUPS: dict[str, str] = {
    "heating": "heating",
    "dhw": "dhw",
    "defrosting": "defrost",
    "standby": "standby",
    "legionella_prevention": "legionella",
}


def group_of(state: str | None) -> str | None:
    """Group of a core Weheat operating state, None for a gap."""
    return STATE_GROUPS.get(state or "")


@dataclass(frozen=True, slots=True)
class Period:
    """A completed period in one group."""

    group: str
    start: datetime
    end: datetime

    @property
    def minutes(self) -> float:
        """Length in minutes."""
        return (self.end - self.start).total_seconds() / 60


def periods_from_states(
    changes: Iterable[tuple[datetime, str | None]], until: datetime
) -> tuple[list[Period], tuple[str, datetime] | None]:
    """Turn (time, state) changes into completed periods plus the open one.

    Repeated reports of the same state form one period.
    """
    periods: list[Period] = []
    current: tuple[str, datetime] | None = None
    for when, state in sorted(changes, key=lambda change: change[0]):
        group = group_of(state)
        if current is not None and group == current[0]:
            continue
        if current is not None:
            periods.append(Period(current[0], current[1], when))
        current = (group, when) if group is not None else None
    if current is not None and current[1] >= until:
        current = None
    return periods, current


@dataclass(frozen=True, slots=True)
class GroupStats:
    """Statistics for one group over a window."""

    count: int
    min_minutes: float | None
    avg_minutes: float | None
    max_minutes: float | None
    total_hours: float
    share_percent: float


def window_stats(
    periods: Sequence[Period], start: datetime, end: datetime
) -> dict[str, GroupStats]:
    """Periods that ended within [start, end], per group.

    The share is the time spent in each group, clipped to the window,
    relative to the window length.
    """
    window_hours = max((end - start).total_seconds() / 3600, 1e-9)
    result: dict[str, GroupStats] = {}
    for group in GROUPS:
        ended = [p for p in periods if p.group == group and start <= p.end <= end]
        lengths = [p.minutes for p in ended]
        clipped = sum(
            max(0.0, (min(p.end, end) - max(p.start, start)).total_seconds())
            for p in periods
            if p.group == group
        )
        result[group] = GroupStats(
            count=len(ended),
            min_minutes=min(lengths) if lengths else None,
            avg_minutes=mean(lengths) if lengths else None,
            max_minutes=max(lengths) if lengths else None,
            total_hours=clipped / 3600,
            share_percent=clipped / 3600 / window_hours * 100,
        )
    return result
