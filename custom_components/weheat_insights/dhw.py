"""Hot water (SWW) figures for the dashboard's hot-water tab.

Reads the tank temperatures, outdoor temperature and the DHW energy counters
from the recorder's long-term statistics and the runs from the operating
tracker; the calculations live in calculations/dhw.py.
"""

from __future__ import annotations

from datetime import date, datetime, timedelta
from statistics import median
from typing import TYPE_CHECKING, Any

from homeassistant.const import UnitOfTemperature
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from .calculations.dhw import (
    dhw_days,
    standing_loss,
    start_hours,
    weekly_median,
)
from .calculations.operating import Period
from .discovery import WeheatKey
from .statistics import async_energy, async_series, local_midnight

if TYPE_CHECKING:
    from . import WeheatInsightsData

DEFAULT_DAYS = 90
START_HOURS_DAYS = 30
SUMMARY_DAYS = 30


def _round(value: float | None, digits: int = 2) -> float | None:
    return None if value is None else round(value, digits)


def local_periods(data: WeheatInsightsData, since: datetime) -> list[Period]:
    """Return the tracked periods ending after ``since``, in local time."""
    return [
        Period(p.group, dt_util.as_local(p.start), dt_util.as_local(p.end))
        for p in (data.operating.periods if data.operating is not None else [])
        if p.end >= since
    ]


async def async_dhw(
    hass: HomeAssistant, data: WeheatInsightsData, days: int = DEFAULT_DAYS
) -> dict[str, Any]:
    """Everything the hot-water tab draws, for the last ``days`` days."""
    entities = data.entities
    today = dt_util.now().date()
    first = today - timedelta(days=days - 1)
    start, end = local_midnight(first), local_midnight(today + timedelta(days=1))
    celsius = {"temperature": UnitOfTemperature.CELSIUS}

    outdoor = await async_series(
        hass,
        {"outdoor": data.outdoor_entity_id or ""},
        start,
        end,
        period="day",
        kind="mean",
        units=celsius,
    )
    top_hourly = await async_series(
        hass,
        {"top": entities.get(WeheatKey.DHW_TOP_TEMPERATURE, "")},
        start,
        end,
        period="hour",
        kind="mean",
        units=celsius,
    )
    energy = await async_energy(hass, entities, first, today + timedelta(days=1))

    periods = local_periods(data, start)
    heated_to = await async_series(
        hass,
        {"bottom": entities.get(WeheatKey.DHW_BOTTOM_TEMPERATURE, "")},
        start,
        end,
        period="day",
        kind="max",
        units=celsius,
    )

    def by_day(series: dict) -> dict[date, float]:
        return {moment.date(): value for moment, value in series.items()}

    day_list = [first + timedelta(days=n) for n in range(days)]
    rows = dhw_days(
        day_list,
        targets=by_day(heated_to["bottom"]),
        energy=energy,
        outdoor_mean=by_day(outdoor["outdoor"]),
        periods=periods,
    )
    loss = standing_loss(top_hourly["top"], periods)
    return {
        "days": [
            {
                "day": row.day.isoformat(),
                "target_c": _round(row.target_c, 1),
                "legionella": row.legionella,
                "runs": row.runs,
                "heat_kwh": _round(row.heat_kwh),
                "electricity_kwh": _round(row.electricity_kwh),
                "cop": _round(row.cop),
                "outdoor_c": _round(row.outdoor_c, 1),
            }
            for row in rows
        ],
        "start_hours": start_hours(
            periods, local_midnight(today - timedelta(days=START_HOURS_DAYS - 1))
        ),
        "start_hours_days": START_HOURS_DAYS,
        "standing_loss": [
            {"day": night.isoformat(), "k_per_h": round(rate, 3)}
            for night, rate in sorted(loss.items())
        ],
        "standing_loss_weeks": [
            {"week": monday.isoformat(), "k_per_h": round(rate, 3)}
            for monday, rate in weekly_median(loss).items()
        ],
        "summary": _summary(rows, loss, today),
    }


def _summary(rows: list, loss: dict[date, float], today: date) -> dict[str, Any]:
    """Key figures: today's target and averages over the last 30 days."""
    recent = [row for row in rows if (today - row.day).days < SUMMARY_DAYS]
    past = [row for row in recent if row.day < today]  # complete days only
    runs = sum(row.runs for row in past)
    heat = sum(row.heat_kwh for row in past)
    targets = [row.target_c for row in past if row.target_c is not None]
    recent_loss = [
        rate for night, rate in loss.items() if (today - night).days < SUMMARY_DAYS
    ]
    target_today = rows[-1].target_c if rows else None
    return {
        "target_today_c": _round(target_today, 1),
        "target_typical_c": _round(median(targets), 1) if targets else None,
        "runs_per_day": _round(runs / len(past), 1) if past else None,
        "heat_per_run_kwh": _round(heat / runs) if runs else None,
        "heat_per_day_kwh": _round(heat / len(past), 1) if past else None,
        "standing_loss_k_per_h": (
            _round(median(recent_loss), 2) if recent_loss else None
        ),
        "days": SUMMARY_DAYS,
    }
