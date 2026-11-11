"""House analysis: heat-loss coefficient and cool-down rate.

Runs hourly. Uses up to twelve months of daily statistics for the heat-loss
fit and hourly statistics for cool-down episodes.
"""

from __future__ import annotations

from dataclasses import dataclass
from datetime import date, datetime, timedelta
from typing import TYPE_CHECKING

from homeassistant.const import UnitOfEnergy, UnitOfTemperature
from homeassistant.core import HomeAssistant
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator
from homeassistant.util import dt as dt_util

from .calculations.cool_down import CoolDownResult, HourPoint, cool_down
from .calculations.heat_loss import DayPoint, HeatLossResult, heat_loss
from .const import DOMAIN, LOGGER
from .discovery import WeheatKey
from .statistics import (
    async_daily_means,
    async_energy,
    async_on_days,
    async_series,
    local_midnight,
)

if TYPE_CHECKING:
    from . import WeheatInsightsConfigEntry

UPDATE_INTERVAL = timedelta(hours=1)
WINDOW_DAYS = 365
ASSUMED_INDOOR_C = 20.0


@dataclass(frozen=True, slots=True)
class HouseData:
    """Result of the house analysis."""

    heat_loss: HeatLossResult
    cool_down: CoolDownResult | None  # None without an indoor sensor
    indoor_assumed: bool
    has_other_heat_source: bool
    period_start: date
    period_end: date  # exclusive


def build_day_points(
    days: list[date],
    heating_kwh: dict[date, float],
    indoor: dict[date, float] | float,
    outdoor: dict[date, float],
    other_heat_days: set[date],
) -> list[DayPoint]:
    """Combine the daily inputs; ``indoor`` may be a constant (assumed)."""
    return [
        DayPoint(
            day=day,
            heating_kwh=heating_kwh.get(day),
            indoor_c=indoor if isinstance(indoor, float) else indoor.get(day),
            outdoor_c=outdoor.get(day),
            other_heat_source=day in other_heat_days,
        )
        for day in days
    ]


def build_hour_points(
    indoor: dict[datetime, float],
    outdoor: dict[datetime, float],
    heating_kwh: dict[datetime, float],
) -> list[HourPoint]:
    """Align hourly series on their start times."""
    return [
        HourPoint(start, indoor.get(start), outdoor.get(start), heating_kwh.get(start))
        for start in sorted(set(indoor) | set(outdoor) | set(heating_kwh))
    ]


class HouseCoordinator(DataUpdateCoordinator[HouseData]):
    """Recompute the house analysis every hour."""

    config_entry: WeheatInsightsConfigEntry

    def __init__(
        self, hass: HomeAssistant, config_entry: WeheatInsightsConfigEntry
    ) -> None:
        """Initialise."""
        super().__init__(
            hass,
            LOGGER,
            config_entry=config_entry,
            name=f"{DOMAIN}_house",
            update_interval=UPDATE_INTERVAL,
        )

    async def _async_update_data(self) -> HouseData:
        data = self.config_entry.runtime_data
        today = dt_util.now().date()
        first = today - timedelta(days=WINDOW_DAYS)
        days = [first + timedelta(days=n) for n in range(WINDOW_DAYS)]
        start, end = local_midnight(first), local_midnight(today)

        energy = await async_energy(self.hass, data.entities, first, today)
        heating = {
            day: totals.mode_energy("heating")[1] for day, totals in energy.items()
        }
        outdoor = await async_daily_means(
            self.hass, data.outdoor_entity_id, first, today
        )
        indoor_assumed = data.indoor_entity_id is None
        indoor: dict[date, float] | float = (
            ASSUMED_INDOOR_C
            if indoor_assumed
            else await async_daily_means(self.hass, data.indoor_entity_id, first, today)
        )
        heat_sources = [
            data.entities.get(WeheatKey.GAS_BOILER),
            data.entities.get(WeheatKey.ELECTRIC_HEATER),
        ]
        other_heat_days = await async_on_days(
            self.hass, [e for e in heat_sources if e], start, dt_util.now()
        )
        result = heat_loss(
            build_day_points(days, heating, indoor, outdoor, other_heat_days)
        )

        cooling: CoolDownResult | None = None
        if not indoor_assumed:
            series = await async_series(
                self.hass,
                {
                    "indoor": data.indoor_entity_id or "",
                    "outdoor": data.outdoor_entity_id or "",
                },
                start,
                end,
                period="hour",
                kind="mean",
                units={"temperature": UnitOfTemperature.CELSIUS},
            )
            heat = await async_series(
                self.hass,
                {"heating": data.entities.get(WeheatKey.ENERGY_OUTPUT_HEATING, "")},
                start,
                end,
                period="hour",
                kind="change",
                units={"energy": UnitOfEnergy.KILO_WATT_HOUR},
            )
            cooling = cool_down(
                build_hour_points(series["indoor"], series["outdoor"], heat["heating"])
            )

        return HouseData(
            heat_loss=result,
            cool_down=cooling,
            indoor_assumed=indoor_assumed,
            has_other_heat_source=any(heat_sources),
            period_start=first,
            period_end=today,
        )
