"""Follow the Weheat operating state and keep its periods.

The operating state is a text sensor without long-term statistics and the
recorder keeps its history for only ~10 days by default, so completed
periods are stored here (up to ~13 months) and also published as counters
with long-term statistics (number of periods and time per state).
"""

from __future__ import annotations

from collections.abc import Callable
from datetime import datetime, timedelta
from functools import partial
from typing import Any

from homeassistant.components.recorder import get_instance
from homeassistant.components.recorder.history import get_significant_states
from homeassistant.core import (
    CALLBACK_TYPE,
    Event,
    EventStateChangedData,
    HomeAssistant,
    State,
    callback,
)
from homeassistant.helpers.event import (
    async_track_state_change_event,
    async_track_time_interval,
)
from homeassistant.helpers.storage import Store
from homeassistant.util import dt as dt_util

from .calculations.operating import (
    GROUPS,
    GroupStats,
    Period,
    group_of,
    periods_from_states,
    window_stats,
)
from .const import DOMAIN

STORAGE_VERSION = 1
KEEP_DAYS = 400
BACKFILL_DAYS = 30
SAVE_DELAY_S = 60
REFRESH = timedelta(minutes=5)
WINDOWS: dict[str, int | None] = {"today": None, "7d": 7, "30d": 30}


class OperatingTracker:
    """Periods per operating state for one heat pump."""

    def __init__(self, hass: HomeAssistant, entry_id: str, entity_id: str) -> None:
        """Initialise."""
        self.hass = hass
        self.entity_id = entity_id
        self._store: Store[dict[str, Any]] = Store(
            hass, STORAGE_VERSION, f"{DOMAIN}.operating.{entry_id}"
        )
        self.periods: list[Period] = []
        self.totals: dict[str, dict[str, float]] = {
            group: {"count": 0, "seconds": 0.0} for group in GROUPS
        }
        self.open: tuple[str, datetime] | None = None
        self._listeners: list[CALLBACK_TYPE] = []
        self._unsubs: list[CALLBACK_TYPE] = []

    # -- lifecycle ---------------------------------------------------------

    async def async_start(self) -> None:
        """Load stored periods (or backfill from history) and start following."""
        data = await self._store.async_load()
        if data:
            self._load(data)
        else:
            await self._async_backfill()
        if (state := self.hass.states.get(self.entity_id)) is not None:
            self._process(state.last_changed, state.state)
        self._unsubs.append(
            async_track_state_change_event(
                self.hass, [self.entity_id], self._async_state_changed
            )
        )
        self._unsubs.append(
            async_track_time_interval(self.hass, self._async_tick, REFRESH)
        )

    async def async_stop(self) -> None:
        """Stop following and save."""
        for unsub in self._unsubs:
            unsub()
        self._unsubs.clear()
        await self._store.async_save(self._dump())

    @callback
    def async_add_listener(self, update: CALLBACK_TYPE) -> CALLBACK_TYPE:
        """Call ``update`` when the figures change; returns a remover."""
        self._listeners.append(update)
        return lambda: self._listeners.remove(update)

    # -- figures -------------------------------------------------------------

    def summary(self, now: datetime | None = None) -> dict[str, dict[str, GroupStats]]:
        """Statistics per window ("today", "7d", "30d") and group."""
        now = now or dt_util.now()
        result = {}
        for name, days in WINDOWS.items():
            start = (
                dt_util.start_of_local_day(now)
                if days is None
                else now - timedelta(days=days)
            )
            result[name] = window_stats(self.periods, start, now)
        return result

    def seconds_in(self, group: str, now: datetime | None = None) -> float:
        """Time in ``group`` so far, including the period that is still running.

        Counting the running period as it goes puts its hours in the hours
        they happened, instead of all at once in the hour it ends.
        """
        seconds = self.totals[group]["seconds"]
        if self.open is not None and self.open[0] == group:
            running = (now or dt_util.utcnow()) - self.open[1]
            seconds += max(0.0, running.total_seconds())
        return seconds

    # -- internals -----------------------------------------------------------

    @callback
    def _async_state_changed(self, event: Event[EventStateChangedData]) -> None:
        new: State | None = event.data["new_state"]
        when = new.last_changed if new is not None else dt_util.utcnow()
        if self._process(when, new.state if new is not None else None):
            self._notify()

    @callback
    def _async_tick(self, _now: datetime) -> None:
        self._notify()  # windows such as "today" move with the clock

    def _process(self, when: datetime, state: str | None) -> bool:
        """Apply a state change; True when a period was completed."""
        group = group_of(state)
        if self.open is not None and group == self.open[0]:
            return False
        completed = False
        if self.open is not None and when > self.open[1]:
            self._complete(Period(self.open[0], self.open[1], when))
            completed = True
        self.open = (group, when) if group is not None else None
        self._store.async_delay_save(self._dump, SAVE_DELAY_S)
        return completed

    def _complete(self, period: Period) -> None:
        self.periods.append(period)
        total = self.totals[period.group]
        total["count"] += 1
        total["seconds"] += (period.end - period.start).total_seconds()
        cutoff = period.end - timedelta(days=KEEP_DAYS)
        if self.periods and self.periods[0].end < cutoff:
            self.periods = [p for p in self.periods if p.end >= cutoff]

    @callback
    def _notify(self) -> None:
        for update in list(self._listeners):
            update()

    async def _async_backfill(self) -> None:
        """Seed periods from the recorder's state history (~10 days by default)."""
        end = dt_util.utcnow()
        states = await get_instance(self.hass).async_add_executor_job(
            partial(
                get_significant_states,
                self.hass,
                end - timedelta(days=BACKFILL_DAYS),
                end,
                [self.entity_id],
                significant_changes_only=False,
                no_attributes=True,
            )
        )
        changes = [
            (s.last_changed, s.state)
            for s in states.get(self.entity_id, [])
            if isinstance(s, State)
        ]
        periods, self.open = periods_from_states(changes, until=end)
        # The first period starts at the beginning of the history window, not
        # at a real state change, so its length is unknown: drop it.
        for period in periods[1:]:
            self._complete(period)

    def _dump(self) -> dict[str, Any]:
        return {
            "periods": [
                [p.group, p.start.timestamp(), p.end.timestamp()] for p in self.periods
            ],
            "totals": self.totals,
            "open": None
            if self.open is None
            else [self.open[0], self.open[1].timestamp()],
        }

    def _load(self, data: dict[str, Any]) -> None:
        ts = dt_util.utc_from_timestamp
        self.periods = [
            Period(_migrate(group), ts(start), ts(end))
            for group, start, end in data.get("periods", [])
            if _migrate(group) in GROUPS
        ]
        for old_group, total in data.get("totals", {}).items():
            group = _migrate(old_group)
            if group in self.totals:
                self.totals[group] = {
                    "count": total.get("count", 0),
                    "seconds": total.get("seconds", 0.0),
                }
        if (open_ := data.get("open")) and _migrate(open_[0]) in GROUPS:
            self.open = (_migrate(open_[0]), ts(open_[1]))


def _migrate(group: str) -> str:
    """Map groups from older versions: "other" was legionella prevention."""
    return "legionella" if group == "other" else group


TrackerFactory = Callable[[HomeAssistant, str, str], OperatingTracker]
