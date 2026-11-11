"""Publish degree days as an external long-term statistic.

A cumulative sum per day lets the built-in statistics-graph card show
degree days per day, week or month ("change" with a bar chart). The series
is rewritten in full when the entry is set up (so a change of base
temperature or weighting applies to all history) and extended with each
completed day afterwards.
"""

from __future__ import annotations

from collections.abc import Mapping
from datetime import date, timedelta
from typing import TYPE_CHECKING

from homeassistant.components.recorder.models import (
    StatisticData,
    StatisticMeanType,
    StatisticMetaData,
)
from homeassistant.components.recorder.statistics import (
    async_add_external_statistics,
)
from homeassistant.core import HomeAssistant

from .calculations.degree_days import degree_days_by_day
from .const import DOMAIN
from .statistics import async_daily_means, local_midnight

if TYPE_CHECKING:
    from .coordinator import Settings

# How far back the first backfill looks for outdoor temperature statistics.
BACKFILL_DAYS = 3 * 366
UNIT = "K·d"


def statistic_id(uuid: str) -> str:
    """External statistic id for a heat pump's degree days."""
    return f"{DOMAIN}:degree_days_{uuid.replace('-', '_').lower()}"


def cumulative_rows(
    degree_days: Mapping[date, float], start_sum: float = 0.0
) -> list[tuple[date, float, float]]:
    """(day, degree days that day, cumulative sum) in date order."""
    rows = []
    total = start_sum
    for day in sorted(degree_days):
        total += degree_days[day]
        rows.append((day, degree_days[day], total))
    return rows


class DegreeDayStatistics:
    """Keeps the external degree-day statistic of one heat pump up to date."""

    def __init__(self, hass: HomeAssistant, uuid: str, name: str) -> None:
        """Initialise."""
        self.hass = hass
        self.statistic_id = statistic_id(uuid)
        self._name = name
        self._last_day: date | None = None
        self._last_sum = 0.0

    async def async_update(
        self,
        today: date,
        settings: Settings,
        outdoor_entity_id: str | None,
        recent_means: Mapping[date, float],
    ) -> None:
        """Write completed days. The first call rewrites the whole series."""
        if outdoor_entity_id is None:
            return
        if self._last_day is None:
            means = await async_daily_means(
                self.hass,
                outdoor_entity_id,
                today - timedelta(days=BACKFILL_DAYS),
                today,
            )
            start_sum = 0.0
        else:
            means = {
                d: m for d, m in recent_means.items() if self._last_day < d < today
            }
            start_sum = self._last_sum
        if not means:
            return

        degree_days = degree_days_by_day(
            means, settings.degree_day_base, settings.weighted_degree_days
        )
        rows = cumulative_rows(degree_days, start_sum)
        async_add_external_statistics(
            self.hass,
            StatisticMetaData(
                mean_type=StatisticMeanType.NONE,
                has_sum=True,
                name=self._name,
                source=DOMAIN,
                statistic_id=self.statistic_id,
                unit_class=None,
                unit_of_measurement=UNIT,
            ),
            [
                StatisticData(start=local_midnight(day), state=value, sum=total)
                for day, value, total in rows
            ],
        )
        self._last_day, _, self._last_sum = rows[-1]
