"""Read the recorder's long-term statistics.

The core Weheat energy counters have long-term statistics from the day the
core integration was installed, so every period (also past ones) can be
computed from them; we keep no running totals of our own.
"""

from __future__ import annotations

from collections.abc import Iterable, Mapping
from dataclasses import replace
from datetime import date, datetime
from functools import partial

from homeassistant.components.recorder import get_instance
from homeassistant.components.recorder.history import get_significant_states
from homeassistant.components.recorder.statistics import (
    StatisticsRow,
    statistics_during_period,
)
from homeassistant.const import STATE_ON, UnitOfEnergy, UnitOfTemperature
from homeassistant.core import HomeAssistant, State
from homeassistant.util import dt as dt_util

from .calculations.performance import EnergyTotals
from .discovery import WeheatKey

# EnergyTotals field -> the core Weheat counter that feeds it.
COUNTER_FIELDS: dict[str, WeheatKey] = {
    "in_heating": WeheatKey.ELECTRICITY_USED_HEATING,
    "in_dhw": WeheatKey.ELECTRICITY_USED_DHW,
    "in_defrost": WeheatKey.ELECTRICITY_USED_DEFROST,
    "in_standby": WeheatKey.ELECTRICITY_USED_STANDBY,
    "in_indoor_unit": WeheatKey.ELECTRICITY_USED_INDOOR_UNIT,
    "out_heating": WeheatKey.ENERGY_OUTPUT_HEATING,
    "out_dhw": WeheatKey.ENERGY_OUTPUT_DHW,
    "out_defrost": WeheatKey.ENERGY_OUTPUT_DEFROST,
}

type Period = str  # "day" | "month"


def local_midnight(day: date) -> datetime:
    """Start of ``day`` in Home Assistant's time zone, as an aware datetime."""
    return dt_util.start_of_local_day(day)


def _row_date(row: StatisticsRow) -> date:
    return dt_util.as_local(dt_util.utc_from_timestamp(row["start"])).date()


def _within[T](rows: dict[date, T], start: date, end: date) -> dict[date, T]:
    """Keep [start, end): the recorder can include the period starting at end."""
    return {day: value for day, value in rows.items() if start <= day < end}


def counter_entities(entities: Mapping[WeheatKey, str]) -> dict[str, str]:
    """EnergyTotals field -> entity_id, for the counters this pump has."""
    return {
        field: entities[key] for field, key in COUNTER_FIELDS.items() if key in entities
    }


def rows_to_energy(
    rows: Mapping[str, Iterable[StatisticsRow]], counters: Mapping[str, str]
) -> dict[date, EnergyTotals]:
    """Turn per-statistic rows of "change" into EnergyTotals per period start."""
    by_day: dict[date, EnergyTotals] = {}
    for field, statistic_id in counters.items():
        for row in rows.get(statistic_id, ()):
            change = row.get("change")
            if change is None:
                continue
            day = _row_date(row)
            current = by_day.get(day, EnergyTotals())
            by_day[day] = replace(current, **{field: getattr(current, field) + change})
    return by_day


def rows_to_means(rows: Iterable[StatisticsRow]) -> dict[date, float]:
    """Mean value per period start."""
    return {_row_date(row): row["mean"] for row in rows if row.get("mean") is not None}


async def async_energy(
    hass: HomeAssistant,
    entities: Mapping[WeheatKey, str],
    start: date,
    end: date,
    period: Period = "day",
) -> dict[date, EnergyTotals]:
    """Energy per day (or month) for [start, end), keyed by period start."""
    counters = counter_entities(entities)
    if not counters:
        return {}
    rows = await get_instance(hass).async_add_executor_job(
        statistics_during_period,
        hass,
        local_midnight(start),
        local_midnight(end),
        set(counters.values()),
        period,
        {"energy": UnitOfEnergy.KILO_WATT_HOUR},
        {"change"},
    )
    return _within(rows_to_energy(rows, counters), start, end)


async def async_daily_means(
    hass: HomeAssistant, entity_id: str | None, start: date, end: date
) -> dict[date, float]:
    """Daily mean temperature (°C) for [start, end) from long-term statistics.

    Returns an empty mapping when the sensor has no statistics (for example a
    sensor without ``state_class: measurement``).
    """
    if entity_id is None:
        return {}
    rows = await get_instance(hass).async_add_executor_job(
        statistics_during_period,
        hass,
        local_midnight(start),
        local_midnight(end),
        {entity_id},
        "day",
        {"temperature": UnitOfTemperature.CELSIUS},
        {"mean"},
    )
    return _within(rows_to_means(rows.get(entity_id, ())), start, end)


async def async_series(
    hass: HomeAssistant,
    statistic_ids: Mapping[str, str],
    start: datetime,
    end: datetime,
    *,
    period: Period,
    kind: str,
    units: dict[str, str] | None = None,
) -> dict[str, dict[datetime, float]]:
    """Fetch one statistic type ("mean" or "change") for several statistics.

    ``statistic_ids`` maps our own names to statistic ids. The result maps
    each name to {period start (local, aware): value}.
    """
    ids = {sid for sid in statistic_ids.values() if sid}
    if not ids:
        return {name: {} for name in statistic_ids}
    rows = await get_instance(hass).async_add_executor_job(
        statistics_during_period,
        hass,
        start,
        end,
        ids,
        period,
        units,
        {kind},  # type: ignore[arg-type]
    )
    result: dict[str, dict[datetime, float]] = {}
    for name, sid in statistic_ids.items():
        series: dict[datetime, float] = {}
        for row in rows.get(sid, ()) if sid else ():
            value = row.get(kind)  # type: ignore[misc]
            when = dt_util.as_local(dt_util.utc_from_timestamp(row["start"]))
            if value is not None and start <= when < end:
                series[when] = value
        result[name] = series
    return result


def on_days(states: Iterable[State], end: datetime) -> set[date]:
    """Local dates during which an on/off entity was on at some point."""
    days: set[date] = set()
    ordered = sorted(states, key=lambda state: state.last_changed)
    for index, state in enumerate(ordered):
        if state.state != STATE_ON:
            continue
        until = ordered[index + 1].last_changed if index + 1 < len(ordered) else end
        day = dt_util.as_local(state.last_changed).date()
        last = dt_util.as_local(until).date()
        while day <= last:
            days.add(day)
            day = date.fromordinal(day.toordinal() + 1)
    return days


async def async_on_days(
    hass: HomeAssistant, entity_ids: Iterable[str], start: datetime, end: datetime
) -> set[date]:
    """Days on which any of the entities was on, as far as history goes back.

    Binary sensors have no long-term statistics, so this only covers the
    recorder's state history (10 days by default).
    """
    ids = [entity_id for entity_id in entity_ids if entity_id]
    if not ids:
        return set()
    states = await get_instance(hass).async_add_executor_job(
        partial(
            get_significant_states,
            hass,
            start,
            end,
            ids,
            significant_changes_only=False,
            no_attributes=True,
        )
    )
    days: set[date] = set()
    for entity_states in states.values():
        days |= on_days((s for s in entity_states if isinstance(s, State)), end)
    return days
