"""Periodic computation of performance figures from long-term statistics."""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import date, timedelta
from functools import reduce
import operator
from typing import TYPE_CHECKING

from homeassistant.core import HomeAssistant
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator
from homeassistant.util import dt as dt_util

from .calculations.degree_days import degree_days_by_day, heat_per_degree_day
from .calculations.performance import EnergyTotals, Performance, performance
from .calculations.periods import (
    month_start,
    previous_season,
    same_day_last_year,
    season_bounds,
    sum_days,
)
from .const import (
    CONF_CURRENT_CURVE,
    CONF_CURVE_CHANGED_ON,
    CONF_DEGREE_DAY_BASE,
    CONF_EMITTER_TYPE,
    CONF_SEASON_END_MONTH,
    CONF_SEASON_START_MONTH,
    CONF_TARGET_ROOM_TEMPERATURE,
    CONF_WEIGHTED_DEGREE_DAYS,
    DEFAULT_DEGREE_DAY_BASE,
    DEFAULT_EMITTER_TYPE,
    DEFAULT_SEASON_END_MONTH,
    DEFAULT_SEASON_START_MONTH,
    DEFAULT_TARGET_ROOM_TEMPERATURE,
    DEFAULT_WEIGHTED_DEGREE_DAYS,
    DOMAIN,
    LOGGER,
)
from .degree_day_statistics import DegreeDayStatistics
from .dhw_statistics import DhwTargetStatistics
from .statistics import async_daily_means, async_energy

if TYPE_CHECKING:
    from . import WeheatInsightsConfigEntry

# The core energy counters update every 30 minutes and statistics are
# compiled every 5 minutes / hourly, so polling more often gains nothing.
UPDATE_INTERVAL = timedelta(minutes=15)


@dataclass(frozen=True, slots=True)
class Settings:
    """User settings that affect the calculations."""

    season_start_month: int = DEFAULT_SEASON_START_MONTH
    season_end_month: int = DEFAULT_SEASON_END_MONTH
    degree_day_base: float = DEFAULT_DEGREE_DAY_BASE
    weighted_degree_days: bool = DEFAULT_WEIGHTED_DEGREE_DAYS
    target_room_c: float = DEFAULT_TARGET_ROOM_TEMPERATURE
    emitter_type: str = DEFAULT_EMITTER_TYPE
    curve_changed_on: date | None = None
    # Current heating curve as entered by the user: outdoor °C -> water °C.
    current_curve: dict[float, float] = field(default_factory=dict)

    @classmethod
    def from_options(cls, options) -> Settings:
        """Read settings from config entry options, with defaults."""
        return cls(
            season_start_month=int(
                options.get(CONF_SEASON_START_MONTH, DEFAULT_SEASON_START_MONTH)
            ),
            season_end_month=int(
                options.get(CONF_SEASON_END_MONTH, DEFAULT_SEASON_END_MONTH)
            ),
            degree_day_base=float(
                options.get(CONF_DEGREE_DAY_BASE, DEFAULT_DEGREE_DAY_BASE)
            ),
            weighted_degree_days=bool(
                options.get(CONF_WEIGHTED_DEGREE_DAYS, DEFAULT_WEIGHTED_DEGREE_DAYS)
            ),
            target_room_c=float(
                options.get(
                    CONF_TARGET_ROOM_TEMPERATURE, DEFAULT_TARGET_ROOM_TEMPERATURE
                )
            ),
            emitter_type=str(options.get(CONF_EMITTER_TYPE, DEFAULT_EMITTER_TYPE)),
            current_curve={
                point: float(options[key])
                for point, key in CONF_CURRENT_CURVE.items()
                if options.get(key) is not None
            },
            curve_changed_on=(
                date.fromisoformat(options[CONF_CURVE_CHANGED_ON])
                if options.get(CONF_CURVE_CHANGED_ON)
                else None
            ),
        )


@dataclass(frozen=True, slots=True)
class PeriodResult:
    """Figures for one period."""

    start: date
    end: date  # exclusive
    performance: Performance
    degree_days: float | None  # None when there is no outdoor data
    heating_heat_kwh: float
    heat_per_degree_day: float | None


@dataclass(frozen=True, slots=True)
class InsightsData:
    """Everything the sensors need."""

    today: PeriodResult
    month: PeriodResult
    season: PeriodResult
    season_last_year_same_period: PeriodResult
    last_season: PeriodResult


def _sum_energy(values) -> EnergyTotals:
    return reduce(operator.add, values, EnergyTotals())


def build_period(
    start: date,
    end: date,
    energy: dict[date, EnergyTotals],
    degree_days: dict[date, float],
) -> PeriodResult:
    """Combine daily rows into the figures for [start, end)."""
    totals = sum_days(energy, start, end, _sum_energy)
    days_with_temp = [d for d in degree_days if start <= d < end]
    dd = sum(degree_days[d] for d in days_with_temp) if days_with_temp else None
    heating_heat = totals.mode_energy("heating")[1]
    return PeriodResult(
        start=start,
        end=end,
        performance=performance(totals),
        degree_days=dd,
        heating_heat_kwh=heating_heat,
        heat_per_degree_day=(
            None if dd is None else heat_per_degree_day(heating_heat, dd)
        ),
    )


def compute(
    today: date,
    settings: Settings,
    energy: dict[date, EnergyTotals],
    daily_means: dict[date, float],
) -> InsightsData:
    """Compute all figures from daily energy and daily mean temperatures."""
    degree_days = degree_days_by_day(
        daily_means, settings.degree_day_base, settings.weighted_degree_days
    )
    tomorrow = today + timedelta(days=1)
    season_start, season_end = season_bounds(
        today, settings.season_start_month, settings.season_end_month
    )
    last_start, last_end = previous_season(season_start, season_end)
    season_until = min(season_end, tomorrow)
    # "Same period last year": the previous season up to today's date a year ago.
    last_until = min(last_end, same_day_last_year(season_until - timedelta(days=1)))
    last_until += timedelta(days=1)

    def period(start: date, end: date) -> PeriodResult:
        return build_period(start, end, energy, degree_days)

    return InsightsData(
        today=period(today, tomorrow),
        month=period(month_start(today), tomorrow),
        season=period(season_start, season_until),
        season_last_year_same_period=period(last_start, last_until),
        last_season=period(last_start, last_end),
    )


def fetch_start(today: date, settings: Settings) -> date:
    """First day we need data for: the start of the previous season."""
    season_start, season_end = season_bounds(
        today, settings.season_start_month, settings.season_end_month
    )
    return min(previous_season(season_start, season_end)[0], month_start(today))


class WeheatInsightsCoordinator(DataUpdateCoordinator[InsightsData]):
    """Recompute performance figures from the recorder every 15 minutes."""

    config_entry: WeheatInsightsConfigEntry

    def __init__(
        self, hass: HomeAssistant, config_entry: WeheatInsightsConfigEntry
    ) -> None:
        """Initialise the coordinator."""
        super().__init__(
            hass,
            LOGGER,
            config_entry=config_entry,
            name=DOMAIN,
            update_interval=UPDATE_INTERVAL,
        )
        self.settings = Settings.from_options(config_entry.options)
        self.degree_day_statistics: DegreeDayStatistics | None = None
        self.dhw_target_statistics: DhwTargetStatistics | None = None

    async def _async_update_data(self) -> InsightsData:
        data = self.config_entry.runtime_data
        today = dt_util.now().date()
        start = fetch_start(today, self.settings)
        end = today + timedelta(days=1)
        energy = await async_energy(self.hass, data.entities, start, end)
        means = await async_daily_means(self.hass, data.outdoor_entity_id, start, end)
        if self.degree_day_statistics is None:
            self.degree_day_statistics = DegreeDayStatistics(
                self.hass, data.pump.uuid, f"{data.pump.name} degree days"
            )
        await self.degree_day_statistics.async_update(
            today, self.settings, data.outdoor_entity_id, means
        )
        if self.dhw_target_statistics is None:
            self.dhw_target_statistics = DhwTargetStatistics(
                self.hass, data.pump.uuid, f"{data.pump.name} hot-water tank target"
            )
        await self.dhw_target_statistics.async_update(today, data)
        return compute(today, self.settings, energy, means)
