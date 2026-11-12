"""Publish the hot-water tank target per day as an external statistic.

The target comes from the operating periods (only ordinary hot-water runs,
not legionella prevention), so Home Assistant has no statistic for it. One
row per day, at local midnight, lets the built-in statistics-graph card draw
it as daily bars. The first update writes the whole history the operating
tracker has; later updates rewrite the last few days.
"""

from __future__ import annotations

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
from homeassistant.const import UnitOfTemperature
from homeassistant.core import HomeAssistant

from .const import DOMAIN
from .dhw import async_targets, local_periods
from .discovery import WeheatKey
from .statistics import local_midnight

if TYPE_CHECKING:
    from . import WeheatInsightsData

# The operating tracker keeps about 13 months of periods.
BACKFILL_DAYS = 400
RECENT_DAYS = 3


def statistic_id(uuid: str) -> str:
    """External statistic id for a heat pump's tank target per day."""
    return f"{DOMAIN}:dhw_target_{uuid.replace('-', '_').lower()}"


class DhwTargetStatistics:
    """Keeps the external tank-target statistic of one heat pump up to date."""

    def __init__(self, hass: HomeAssistant, uuid: str, name: str) -> None:
        """Initialise."""
        self.hass = hass
        self.statistic_id = statistic_id(uuid)
        self._name = name
        self._backfilled = False

    async def async_update(self, today: date, data: WeheatInsightsData) -> None:
        """Write the target of recent days (all history the first time)."""
        if (
            data.operating is None
            or WeheatKey.DHW_BOTTOM_TEMPERATURE not in data.entities
        ):
            return
        days = RECENT_DAYS if self._backfilled else BACKFILL_DAYS
        start = local_midnight(today - timedelta(days=days))
        end = local_midnight(today + timedelta(days=1))
        targets = await async_targets(
            self.hass, data, start, end, local_periods(data, start)
        )
        self._backfilled = True
        if not targets:
            return
        async_add_external_statistics(
            self.hass,
            StatisticMetaData(
                mean_type=StatisticMeanType.ARITHMETIC,
                has_sum=False,
                name=self._name,
                source=DOMAIN,
                statistic_id=self.statistic_id,
                unit_class="temperature",
                unit_of_measurement=UnitOfTemperature.CELSIUS,
            ),
            [
                StatisticData(
                    start=local_midnight(day), mean=value, min=value, max=value
                )
                for day, value in sorted(targets.items())
            ],
        )
