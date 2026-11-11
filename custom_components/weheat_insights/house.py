"""House analysis: heat-loss coefficient and cool-down rate.

Runs hourly. Uses up to twelve months of daily statistics for the heat-loss
fit and hourly statistics for cool-down episodes.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import date, datetime, timedelta
from typing import TYPE_CHECKING

from homeassistant.const import UnitOfEnergy, UnitOfTemperature
from homeassistant.core import HomeAssistant
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator
from homeassistant.util import dt as dt_util

from .calculations.before_after import Comparison, compare
from .calculations.cool_down import CoolDownResult, HourPoint, cool_down
from .calculations.degree_days import degree_days_by_day
from .calculations.heat_loss import DayPoint, HeatLossResult, heat_loss
from .calculations.heating_curve import (
    EMITTER_EXPONENTS,
    CurvePoint,
    EmitterModel,
    SteadyHour,
    advise,
    calibrate_emitters,
)
from .const import DOMAIN, LOGGER
from .coordinator import Settings
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
    curve: CurveAdvice | None = None
    comparison: Comparison | None = None


@dataclass(frozen=True, slots=True)
class CurveAdvice:
    """Heating-curve advice and what it is based on."""

    points: list[CurvePoint]  # empty when there is not enough data
    emitters: EmitterModel | None
    target_c: float
    measured_indoor_c: float | None
    reason: str | None  # why there is no advice
    emitter_type: str = "mixed"
    # The user's current heating curve (outdoor °C -> water °C), if entered.
    current: dict[float, float] = field(default_factory=dict)


# Steady heating hours from the whole last year calibrate the heating system:
# how much heat it gives at a water temperature does not depend on the heating
# curve setting, and cold days make the advice at low outdoor temperatures
# better.
CURVE_WINDOW_DAYS = 365
MEASURED_INDOOR_DAYS = 14


def steady_hours(
    supply: dict[datetime, float],
    return_: dict[datetime, float],
    room: dict[datetime, float] | float,
    heating_kwh: dict[datetime, float],
    dhw_kwh: dict[datetime, float],
) -> list[tuple[datetime, SteadyHour]]:
    """Hours of steady space heating: heating this hour and both neighbours.

    Hours next to hot water are left out (left-over DHW heat, cold return).
    """
    hour = timedelta(hours=1)
    result = []
    for start in sorted(supply):
        window = (start - hour, start, start + hour)
        if any(heating_kwh.get(t, 0.0) < MIN_HEATING_KWH_PER_HOUR for t in window):
            continue
        if any(dhw_kwh.get(t, 0.0) > MAX_DHW_KWH_PER_HOUR for t in window):
            continue
        room_c = room if isinstance(room, float) else room.get(start)
        if start not in return_ or room_c is None:
            continue
        result.append(
            (
                start,
                SteadyHour(heating_kwh[start], supply[start], return_[start], room_c),
            )
        )
    return result


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


# An hour counts for the heating curve when the pump delivered at least this
# much space-heating heat and (almost) no hot water: hourly means of hours
# that were mostly idle or doing DHW say nothing about the heating curve.
# The hour after a hot-water hour is skipped too: when DHW finishes, the
# pump can push left-over heat into the heating circuit at a high supply
# temperature, which is booked as space heating.
MIN_HEATING_KWH_PER_HOUR = 0.5
MAX_DHW_KWH_PER_HOUR = 0.05


def supply_curve_points(
    outdoor: dict[datetime, float],
    supply: dict[datetime, float],
    return_: dict[datetime, float],
    heating_kwh: dict[datetime, float],
    dhw_kwh: dict[datetime, float],
) -> list[dict[str, float | str]]:
    """Hourly (outdoor, supply, ΔT) points for hours of space heating."""
    points: list[dict[str, float | str]] = []
    for start in sorted(supply):
        heat = heating_kwh.get(start, 0.0)
        previous = start - timedelta(hours=1)
        if (
            heat < MIN_HEATING_KWH_PER_HOUR
            or dhw_kwh.get(start, 0.0) > MAX_DHW_KWH_PER_HOUR
            or dhw_kwh.get(previous, 0.0) > MAX_DHW_KWH_PER_HOUR
        ):
            continue
        if start not in outdoor or start not in return_:
            continue
        points.append(
            {
                "time": start.isoformat(),
                "outdoor_c": round(outdoor[start], 2),
                "supply_c": round(supply[start], 2),
                "delta_t_k": round(supply[start] - return_[start], 2),
                "heating_kwh": round(heat, 3),
            }
        )
    return points


async def async_supply_curve(
    hass: HomeAssistant,
    entities: dict[WeheatKey, str],
    outdoor_entity_id: str | None,
    days: int,
) -> list[dict[str, float | str]]:
    """Fetch hourly statistics and return the heating-curve scatter points."""
    end = dt_util.now()
    start = local_midnight(end.date() - timedelta(days=days))
    temps = await async_series(
        hass,
        {
            "outdoor": outdoor_entity_id or "",
            "supply": entities.get(WeheatKey.SUPPLY_TEMPERATURE, ""),
            "return": entities.get(WeheatKey.RETURN_TEMPERATURE, ""),
        },
        start,
        end,
        period="hour",
        kind="mean",
        units={"temperature": UnitOfTemperature.CELSIUS},
    )
    energy = await async_series(
        hass,
        {
            "heating": entities.get(WeheatKey.ENERGY_OUTPUT_HEATING, ""),
            "dhw": entities.get(WeheatKey.ENERGY_OUTPUT_DHW, ""),
        },
        start,
        end,
        period="hour",
        kind="change",
        units={"energy": UnitOfEnergy.KILO_WATT_HOUR},
    )
    return supply_curve_points(
        temps["outdoor"],
        temps["supply"],
        temps["return"],
        energy["heating"],
        energy["dhw"],
    )


def heat_loss_payload(data: HouseData) -> dict:
    """Daily points and the fit, for the heat-loss scatter chart."""
    result = data.heat_loss
    fit = result.fit
    return {
        "indoor_assumed": data.indoor_assumed,
        "reason": result.reason,
        "days_used": result.used,
        "coefficient_w_per_k": result.coefficient_w_per_k,
        "confidence_95_w_per_k": result.coefficient_ci95,
        "fit": None
        if fit is None
        else {
            "slope": fit.slope,
            "intercept": fit.intercept,
            "r_squared": fit.r_squared,
        },
        "points": [
            {
                "day": day.day.isoformat(),
                "delta_k": round(day.delta_k, 2),
                "heating_kwh": round(day.heating_kwh, 2),
                "excluded": day.excluded,
            }
            for day in result.days
            if day.delta_k is not None and day.heating_kwh is not None
        ],
    }


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

        temps = await async_series(
            self.hass,
            {
                "indoor": data.indoor_entity_id or "",
                "outdoor": data.outdoor_entity_id or "",
                "supply": data.entities.get(WeheatKey.SUPPLY_TEMPERATURE, ""),
                "return": data.entities.get(WeheatKey.RETURN_TEMPERATURE, ""),
            },
            start,
            end,
            period="hour",
            kind="mean",
            units={"temperature": UnitOfTemperature.CELSIUS},
        )
        heat = await async_series(
            self.hass,
            {
                "heating": data.entities.get(WeheatKey.ENERGY_OUTPUT_HEATING, ""),
                "dhw": data.entities.get(WeheatKey.ENERGY_OUTPUT_DHW, ""),
            },
            start,
            end,
            period="hour",
            kind="change",
            units={"energy": UnitOfEnergy.KILO_WATT_HOUR},
        )

        cooling: CoolDownResult | None = None
        if not indoor_assumed:
            cooling = cool_down(
                build_hour_points(temps["indoor"], temps["outdoor"], heat["heating"])
            )

        settings = data.coordinator.settings if data.coordinator else Settings()
        curve = self._curve_advice(
            result,
            temps=temps,
            heat=heat,
            settings=settings,
            indoor=indoor,
            outdoor_days=outdoor,
            today=today,
        )

        comparison = None
        if settings.curve_changed_on is not None:
            degree_days = degree_days_by_day(
                outdoor, settings.degree_day_base, settings.weighted_degree_days
            )
            comparison = compare(settings.curve_changed_on, today, energy, degree_days)

        return HouseData(
            heat_loss=result,
            cool_down=cooling,
            indoor_assumed=indoor_assumed,
            has_other_heat_source=any(heat_sources),
            period_start=first,
            period_end=today,
            curve=curve,
            comparison=comparison,
        )

    def _curve_advice(
        self,
        result: HeatLossResult,
        *,
        temps: dict[str, dict[datetime, float]],
        heat: dict[str, dict[datetime, float]],
        settings: Settings,
        indoor: dict[date, float] | float,
        outdoor_days: dict[date, float],
        today: date,
    ) -> CurveAdvice:
        """Calibrate the heating system and advise a heating curve."""
        since = local_midnight(today - timedelta(days=CURVE_WINDOW_DAYS))
        room = settings.target_room_c if isinstance(indoor, float) else temps["indoor"]
        hours = [
            (t, h)
            for t, h in steady_hours(
                temps["supply"], temps["return"], room, heat["heating"], heat["dhw"]
            )
            if t >= since
        ]
        emitters = calibrate_emitters(
            [h for _, h in hours],
            EMITTER_EXPONENTS.get(settings.emitter_type, EMITTER_EXPONENTS["mixed"]),
        )
        # Average indoor temperature over the last two weeks, to compare
        # with the target the advice aims for.
        last_days = (
            []
            if isinstance(indoor, float)
            else [
                v
                for d, v in indoor.items()
                if d >= today - timedelta(days=MEASURED_INDOOR_DAYS)
            ]
        )
        measured = sum(last_days) / len(last_days) if last_days else None
        fit = result.fit
        reason = None
        if fit is None:
            reason = "no_heat_loss"
        elif emitters is None:
            reason = "too_few_steady_hours"
        if reason is not None or fit is None or emitters is None:
            return CurveAdvice(
                [],
                emitters,
                settings.target_room_c,
                measured,
                reason,
                settings.emitter_type,
                settings.current_curve,
            )
        # The demand model is fitted on daily data, so "measured range" means
        # the outdoor temperatures of the days the heat-loss fit used.
        used_outdoor = [
            outdoor_days[day.day]
            for day in result.days
            if day.excluded is None and day.day in outdoor_days
        ]
        observed = (
            (min(used_outdoor), max(used_outdoor)) if used_outdoor else (0.0, 0.0)
        )
        points = advise(
            slope=fit.slope,
            slope_ci=fit.slope_ci95,
            intercept=fit.intercept,
            emitters=emitters,
            target_c=settings.target_room_c,
            observed_outdoor=observed,
        )
        return CurveAdvice(
            points,
            emitters,
            settings.target_room_c,
            measured,
            None,
            settings.emitter_type,
            settings.current_curve,
        )


def curve_payload(data: HouseData) -> dict:
    """Return the current (as entered) and advised curve for the chart."""
    curve = data.curve
    if curve is None:
        return {"current": [], "advice": [], "reason": "no_data"}
    return {
        "current": [
            {"outdoor_c": point, "supply_c": value}
            for point, value in sorted(curve.current.items())
        ],
        "advice": [
            {
                "outdoor_c": p.outdoor_c,
                "supply_c": round(p.supply_c, 1),
                "low_c": round(p.supply_low_c, 1),
                "high_c": round(p.supply_high_c, 1),
                "extrapolated": p.extrapolated,
            }
            for p in curve.points
        ],
        "reason": curve.reason,
        "target_c": curve.target_c,
    }
