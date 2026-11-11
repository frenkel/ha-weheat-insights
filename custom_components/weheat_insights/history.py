"""COP per day, month or season, for the performance card.

Computed here (not in the browser) so the COP definitions live in one
place: calculations/performance.py.
"""

from __future__ import annotations

from datetime import date, timedelta
from functools import reduce
import operator
from typing import TYPE_CHECKING, Any, Literal

from homeassistant.core import HomeAssistant

from .calculations.performance import EnergyTotals, performance
from .calculations.periods import (
    add_months,
    month_start,
    previous_season,
    season_bounds,
    sum_days,
)
from .statistics import async_energy

if TYPE_CHECKING:
    from .coordinator import Settings
    from .discovery import WeheatKey

type Kind = Literal["day", "month", "season"]

MAX_COUNT = {"day": 92, "month": 36, "season": 10}


def history_periods(
    kind: Kind, today: date, count: int, settings: Settings
) -> list[tuple[date, date]]:
    """Return the last ``count`` periods of ``kind`` up to today, oldest first."""
    if kind == "day":
        return [
            (today - timedelta(days=n), today - timedelta(days=n - 1))
            for n in range(count - 1, -1, -1)
        ]
    if kind == "month":
        first = month_start(today)
        return [
            (add_months(first, -n), add_months(first, 1 - n))
            for n in range(count - 1, -1, -1)
        ]
    start, end = season_bounds(
        today, settings.season_start_month, settings.season_end_month
    )
    seasons = [(start, end)]
    for _ in range(count - 1):
        seasons.append(previous_season(*seasons[-1]))
    return list(reversed(seasons))


def _round(value: float | None) -> float | None:
    return None if value is None else round(value, 3)


def summarise(
    periods: list[tuple[date, date]], energy: dict[date, EnergyTotals]
) -> list[dict[str, Any]]:
    """COP figures and the energy behind them for each period."""
    result = []
    for start, end in periods:
        totals = sum_days(
            energy, start, end, lambda rows: reduce(operator.add, rows, EnergyTotals())
        )
        perf = performance(totals)
        heating_in, heating_out = totals.mode_energy("heating")
        dhw_in, dhw_out = totals.mode_energy("dhw")
        result.append(
            {
                "start": start.isoformat(),
                "end": end.isoformat(),
                "cop": _round(perf.cop),
                "cop_heat_pump": _round(perf.cop_heat_pump),
                "cop_heating": _round(perf.cop_heating),
                "cop_dhw": _round(perf.cop_dhw),
                "defrost_cop_impact": _round(perf.defrost_cop_impact),
                "electricity_kwh": round(totals.total_in, 2),
                "heat_kwh": round(totals.total_out, 2),
                "heat_pump_electricity_kwh": round(totals.heat_pump_in, 2),
                "standby_kwh": round(totals.in_standby, 2),
                "indoor_unit_kwh": round(totals.in_indoor_unit, 2),
                "heating_electricity_kwh": round(heating_in, 2),
                "heating_heat_kwh": round(heating_out, 2),
                "dhw_electricity_kwh": round(dhw_in, 2),
                "dhw_heat_kwh": round(dhw_out, 2),
            }
        )
    return result


async def async_history(
    hass: HomeAssistant,
    entities: dict[WeheatKey, str],
    settings: Settings,
    *,
    today: date,
    kind: Kind,
    count: int,
) -> list[dict[str, Any]]:
    """Fetch statistics and summarise the requested periods."""
    periods = history_periods(kind, today, min(count, MAX_COUNT[kind]), settings)
    start, end = periods[0][0], min(periods[-1][1], today + timedelta(days=1))
    energy = await async_energy(
        hass, entities, start, end, "day" if kind == "day" else "month"
    )
    return summarise(periods, energy)
