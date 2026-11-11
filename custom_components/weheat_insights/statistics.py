"""Read the recorder's long-term statistics.

The core Weheat energy counters have long-term statistics from the day the
core integration was installed, so every period (also past ones) can be
computed from them; we keep no running totals of our own.
"""

from __future__ import annotations

from collections.abc import Iterable, Mapping
from dataclasses import replace
from datetime import date, datetime

from homeassistant.components.recorder import get_instance
from homeassistant.components.recorder.statistics import (
    StatisticsRow,
    statistics_during_period,
)
from homeassistant.const import UnitOfEnergy, UnitOfTemperature
from homeassistant.core import HomeAssistant
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
    return rows_to_energy(rows, counters)


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
    return rows_to_means(rows.get(entity_id, ()))
