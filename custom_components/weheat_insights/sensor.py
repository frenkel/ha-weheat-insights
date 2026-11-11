"""Derived sensors for Weheat Insights.

The COP/SCOP and per-degree-day sensors are ratios for a period so far.
They deliberately have no ``state_class``: Home Assistant would store hourly
means of those running ratios, which mean nothing (the same trap as
averaging an instantaneous COP). History of COP per day or month is drawn
from the energy statistics by the performance card instead.
"""

from __future__ import annotations

from collections.abc import Callable
from dataclasses import dataclass
from typing import Any

from homeassistant.components.sensor import (
    SensorDeviceClass,
    SensorEntity,
    SensorEntityDescription,
    SensorStateClass,
)
from homeassistant.const import (
    ATTR_UNIT_OF_MEASUREMENT,
    STATE_UNAVAILABLE,
    STATE_UNKNOWN,
    UnitOfEnergy,
    UnitOfPower,
    UnitOfTemperature,
    UnitOfTime,
)
from homeassistant.core import Event, EventStateChangedData, HomeAssistant, callback
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback
from homeassistant.helpers.event import async_track_state_change_event
from homeassistant.helpers.update_coordinator import CoordinatorEntity
from homeassistant.util.unit_conversion import TemperatureConverter

from . import WeheatInsightsConfigEntry
from .calculations.heating_curve import WEHEAT_CURVE_POINTS
from .calculations.operating import GROUPS
from .calculations.temperature import delta_t
from .const import DOMAIN
from .coordinator import InsightsData, PeriodResult, WeheatInsightsCoordinator
from .discovery import WeheatHeatPump, WeheatKey
from .entity import WeheatInsightsEntity
from .house import HouseCoordinator, HouseData
from .operating_tracker import OperatingTracker

PARALLEL_UPDATES = 0


async def async_setup_entry(
    hass: HomeAssistant,
    entry: WeheatInsightsConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    """Set up the derived sensors."""
    data = entry.runtime_data
    entities: list[SensorEntity] = []
    supply = data.entities.get(WeheatKey.SUPPLY_TEMPERATURE)
    return_ = data.entities.get(WeheatKey.RETURN_TEMPERATURE)
    if supply and return_:
        entities.append(DeltaTSensor(data.pump, supply, return_))

    if data.coordinator is not None:
        has_dhw = WeheatKey.ELECTRICITY_USED_DHW in data.entities
        entities.extend(
            PeriodSensor(data.pump, data.coordinator, description)
            for description in PERIOD_SENSORS
            if has_dhw or not description.dhw_only
        )
    if data.house is not None:
        entities.extend(
            HouseSensor(data.pump, data.house, description)
            for description in HOUSE_SENSORS
        )
        entities.extend(
            CurveAdviceSensor(data.pump, data.house, outdoor)
            for outdoor in WEHEAT_CURVE_POINTS
        )
        entities.extend(
            HouseSensor(data.pump, data.house, description)
            for description in COMPARISON_SENSORS
        )
    # Before 0.6.5 the fifth operating group was called "other".
    registry = er.async_get(hass)
    for key in ("operating_other", "other_periods_total", "other_time_total"):
        if entity_id := registry.async_get_entity_id(
            "sensor", DOMAIN, f"{data.pump.uuid}_{key}"
        ):
            registry.async_remove(entity_id)
    if data.operating is not None:
        for group in GROUPS:
            entities.append(OperatingSummarySensor(data.pump, data.operating, group))
            entities.append(
                OperatingCounterSensor(data.pump, data.operating, group, "count")
            )
            entities.append(
                OperatingCounterSensor(data.pump, data.operating, group, "time")
            )
    async_add_entities(entities)


def _celsius(hass: HomeAssistant, entity_id: str) -> float | None:
    """Read a temperature state as °C, whatever unit the user displays it in."""
    state = hass.states.get(entity_id)
    if state is None or state.state in (STATE_UNKNOWN, STATE_UNAVAILABLE):
        return None
    try:
        value = float(state.state)
    except ValueError:
        return None
    unit = state.attributes.get(ATTR_UNIT_OF_MEASUREMENT, UnitOfTemperature.CELSIUS)
    if unit not in TemperatureConverter.VALID_UNITS:
        return None
    return TemperatureConverter.convert(value, unit, UnitOfTemperature.CELSIUS)


class DeltaTSensor(WeheatInsightsEntity, SensorEntity):
    """Supply minus return temperature, updated when either changes."""

    _attr_device_class = SensorDeviceClass.TEMPERATURE_DELTA
    _attr_native_unit_of_measurement = UnitOfTemperature.KELVIN
    _attr_state_class = SensorStateClass.MEASUREMENT
    _attr_suggested_display_precision = 1

    def __init__(
        self, pump: WeheatHeatPump, supply_entity_id: str, return_entity_id: str
    ) -> None:
        """Initialise the sensor."""
        super().__init__(pump, "delta_t")
        self._supply = supply_entity_id
        self._return = return_entity_id

    async def async_added_to_hass(self) -> None:
        """Start following the source sensors."""
        self.async_on_remove(
            async_track_state_change_event(
                self.hass, [self._supply, self._return], self._async_source_changed
            )
        )
        self._update()

    @callback
    def _async_source_changed(self, event: Event[EventStateChangedData]) -> None:
        self._update()
        self.async_write_ha_state()

    @callback
    def _update(self) -> None:
        value = delta_t(
            _celsius(self.hass, self._supply), _celsius(self.hass, self._return)
        )
        self._attr_native_value = None if value is None else round(value, 2)
        self._attr_extra_state_attributes = {
            "supply_entity_id": self._supply,
            "return_entity_id": self._return,
        }


UNIT_DEGREE_DAYS = "K·d"
UNIT_HEAT_PER_DEGREE_DAY = "kWh/K·d"


@dataclass(frozen=True, kw_only=True)
class PeriodSensorDescription(SensorEntityDescription):
    """A figure taken from the coordinator's InsightsData."""

    period_fn: Callable[[InsightsData], PeriodResult]
    value_fn: Callable[[PeriodResult], float | None]
    attrs_fn: Callable[[PeriodResult], dict[str, Any]] | None = None
    dhw_only: bool = False


def _round(value: float | None, digits: int = 3) -> float | None:
    return None if value is None else round(value, digits)


def _cop_attrs(mode: str | None) -> Callable[[PeriodResult], dict[str, Any]]:
    def attrs(result: PeriodResult) -> dict[str, Any]:
        totals = result.performance.totals
        if mode is None:
            used, made = totals.total_in, totals.total_out
        elif mode == "heat_pump":
            used, made = totals.heat_pump_in, totals.total_out
        else:
            used, made = totals.mode_energy(mode)
        attrs: dict[str, Any] = {
            "period_start": result.start.isoformat(),
            "period_end": result.end.isoformat(),
            "electricity_kwh": round(used, 2),
            "heat_kwh": round(made, 2),
        }
        if mode is None:
            # Where the electricity of the total COP goes.
            attrs |= {
                "electricity_heating_kwh": round(totals.in_heating, 2),
                "electricity_dhw_kwh": round(totals.in_dhw, 2),
                "electricity_defrost_kwh": round(totals.in_defrost, 2),
                "electricity_standby_kwh": round(totals.in_standby, 2),
                "electricity_indoor_unit_kwh": round(totals.in_indoor_unit, 2),
                "heat_heating_kwh": round(totals.out_heating, 2),
                "heat_dhw_kwh": round(totals.out_dhw, 2),
                "heat_defrost_kwh": round(totals.out_defrost, 2),
            }
        return attrs

    return attrs


def _period_attrs(result: PeriodResult) -> dict[str, Any]:
    return {
        "period_start": result.start.isoformat(),
        "period_end": result.end.isoformat(),
    }


def _hpdd_attrs(result: PeriodResult) -> dict[str, Any]:
    return {
        **_period_attrs(result),
        "heating_heat_kwh": round(result.heating_heat_kwh, 1),
        "degree_days": _round(result.degree_days, 1),
    }


def _defrost_attrs(result: PeriodResult) -> dict[str, Any]:
    perf = result.performance
    return {
        **_period_attrs(result),
        "defrost_electricity_kwh": round(perf.totals.in_defrost, 2),
        "defrost_heat_taken_kwh": round(-perf.totals.out_defrost, 2),
        "cop_without_defrost": _round(perf.cop_without_defrost),
        "cop": _round(perf.cop),
    }


def _today(data: InsightsData) -> PeriodResult:
    return data.today


def _month(data: InsightsData) -> PeriodResult:
    return data.month


def _season(data: InsightsData) -> PeriodResult:
    return data.season


def _cop_descriptions() -> list[PeriodSensorDescription]:
    periods = (("today", "cop", _today), ("month", "cop", _month))
    periods += (("season", "scop", _season),)
    modes: tuple[tuple[str | None, str, Callable], ...] = (
        ("heat_pump", "_heat_pump", lambda r: r.performance.cop_heat_pump),
        (None, "", lambda r: r.performance.cop),
        ("heating", "_heating", lambda r: r.performance.cop_heating),
        ("dhw", "_dhw", lambda r: r.performance.cop_dhw),
    )
    return [
        PeriodSensorDescription(
            key=f"{prefix}{suffix}_{period}",
            translation_key=f"{prefix}{suffix}_{period}",
            suggested_display_precision=2,
            period_fn=period_fn,
            value_fn=value_fn,
            attrs_fn=_cop_attrs(mode),
            dhw_only=mode == "dhw",
        )
        for period, prefix, period_fn in periods
        for mode, suffix, value_fn in modes
    ]


PERIOD_SENSORS: list[PeriodSensorDescription] = [
    *_cop_descriptions(),
    PeriodSensorDescription(
        key="defrost_cop_impact_season",
        translation_key="defrost_cop_impact_season",
        suggested_display_precision=2,
        period_fn=_season,
        value_fn=lambda r: r.performance.defrost_cop_impact,
        attrs_fn=_defrost_attrs,
    ),
    PeriodSensorDescription(
        key="defrost_heat_season",
        translation_key="defrost_heat_season",
        device_class=SensorDeviceClass.ENERGY,
        native_unit_of_measurement=UnitOfEnergy.KILO_WATT_HOUR,
        suggested_display_precision=1,
        period_fn=_season,
        value_fn=lambda r: -r.performance.totals.out_defrost,
        attrs_fn=_defrost_attrs,
    ),
    PeriodSensorDescription(
        key="degree_days_month",
        translation_key="degree_days_month",
        native_unit_of_measurement=UNIT_DEGREE_DAYS,
        suggested_display_precision=0,
        period_fn=_month,
        value_fn=lambda r: r.degree_days,
        attrs_fn=_period_attrs,
    ),
    PeriodSensorDescription(
        key="degree_days_season",
        translation_key="degree_days_season",
        native_unit_of_measurement=UNIT_DEGREE_DAYS,
        suggested_display_precision=0,
        period_fn=_season,
        value_fn=lambda r: r.degree_days,
        attrs_fn=_period_attrs,
    ),
    PeriodSensorDescription(
        key="heat_per_degree_day_season",
        translation_key="heat_per_degree_day_season",
        native_unit_of_measurement=UNIT_HEAT_PER_DEGREE_DAY,
        suggested_display_precision=1,
        period_fn=_season,
        value_fn=lambda r: r.heat_per_degree_day,
        attrs_fn=_hpdd_attrs,
    ),
    PeriodSensorDescription(
        key="heat_per_degree_day_last_year",
        translation_key="heat_per_degree_day_last_year",
        native_unit_of_measurement=UNIT_HEAT_PER_DEGREE_DAY,
        suggested_display_precision=1,
        period_fn=lambda d: d.season_last_year_same_period,
        value_fn=lambda r: r.heat_per_degree_day,
        attrs_fn=_hpdd_attrs,
    ),
    PeriodSensorDescription(
        key="heat_per_degree_day_last_season",
        translation_key="heat_per_degree_day_last_season",
        native_unit_of_measurement=UNIT_HEAT_PER_DEGREE_DAY,
        suggested_display_precision=1,
        period_fn=lambda d: d.last_season,
        value_fn=lambda r: r.heat_per_degree_day,
        attrs_fn=_hpdd_attrs,
    ),
]


class PeriodSensor(
    CoordinatorEntity[WeheatInsightsCoordinator], WeheatInsightsEntity, SensorEntity
):
    """A COP, degree-day or per-degree-day figure for a period so far."""

    entity_description: PeriodSensorDescription

    def __init__(
        self,
        pump: WeheatHeatPump,
        coordinator: WeheatInsightsCoordinator,
        description: PeriodSensorDescription,
    ) -> None:
        """Initialise the sensor."""
        CoordinatorEntity.__init__(self, coordinator)
        WeheatInsightsEntity.__init__(self, pump, description.key)
        self.entity_description = description

    @property
    def _result(self) -> PeriodResult:
        return self.entity_description.period_fn(self.coordinator.data)

    @property
    def native_value(self) -> float | None:
        """Return the figure, rounded for storage."""
        # COP sensors have no unit, so the frontend shows the raw state
        # without applying the display precision: round it here.
        precision = self.entity_description.suggested_display_precision
        return _round(
            self.entity_description.value_fn(self._result),
            3 if precision is None else precision,
        )

    @property
    def extra_state_attributes(self) -> dict[str, Any] | None:
        """Return the energy behind the figure, for transparency."""
        if self.entity_description.attrs_fn is None:
            return None
        return self.entity_description.attrs_fn(self._result)


@dataclass(frozen=True, kw_only=True)
class HouseSensorDescription(SensorEntityDescription):
    """A figure from the house analysis."""

    value_fn: Callable[[HouseData], float | None]
    attrs_fn: Callable[[HouseData], dict[str, Any]] | None = None


def _house_attrs(data: HouseData) -> dict[str, Any]:
    result = data.heat_loss
    fit = result.fit
    attrs: dict[str, Any] = {
        "period_start": data.period_start.isoformat(),
        "period_end": data.period_end.isoformat(),
        "days_used": result.used,
        "temperature_spread_k": round(result.spread_k, 1),
        "indoor_temperature_assumed": data.indoor_assumed,
    }
    if fit is not None:
        attrs |= {
            "confidence_95_w_per_k": _round(result.coefficient_ci95, 1),
            "r_squared": round(fit.r_squared, 3),
            "free_heat_kwh_per_day": round(-fit.intercept, 1),
        }
    if result.reason is not None:
        attrs["no_result_reason"] = result.reason
    if data.has_other_heat_source:
        # Binary sensors have no long-term statistics: other heat sources can
        # only be detected within the recorder's history (10 days by default).
        attrs["other_heat_source_detection_limited"] = True
    return attrs


def _cool_down_attrs(data: HouseData) -> dict[str, Any]:
    if data.cool_down is None:
        return {"requires_indoor_sensor": True}
    episodes = data.cool_down.episodes
    return {
        "episodes": len(episodes),
        "last_episode": episodes[-1].start.isoformat() if episodes else None,
    }


HOUSE_SENSORS: list[HouseSensorDescription] = [
    HouseSensorDescription(
        key="heat_loss_coefficient",
        translation_key="heat_loss_coefficient",
        native_unit_of_measurement="W/K",
        suggested_display_precision=0,
        value_fn=lambda d: d.heat_loss.coefficient_w_per_k,
    ),
    HouseSensorDescription(
        key="heat_loss_design_load",
        translation_key="heat_loss_design_load",
        device_class=SensorDeviceClass.POWER,
        native_unit_of_measurement=UnitOfPower.KILO_WATT,
        suggested_display_precision=1,
        value_fn=lambda d: d.heat_loss.design_load_kw,
    ),
    HouseSensorDescription(
        key="balance_point",
        translation_key="balance_point",
        device_class=SensorDeviceClass.TEMPERATURE,
        native_unit_of_measurement=UnitOfTemperature.CELSIUS,
        suggested_display_precision=1,
        value_fn=lambda d: d.heat_loss.balance_point_c,
    ),
    HouseSensorDescription(
        key="cool_down_time_constant",
        translation_key="cool_down_time_constant",
        device_class=SensorDeviceClass.DURATION,
        native_unit_of_measurement=UnitOfTime.HOURS,
        suggested_display_precision=0,
        value_fn=lambda d: None if d.cool_down is None else d.cool_down.tau_h,
    ),
    HouseSensorDescription(
        key="cool_down_rate",
        translation_key="cool_down_rate",
        native_unit_of_measurement="K/h",
        suggested_display_precision=2,
        value_fn=lambda d: None if d.cool_down is None else d.cool_down.rate_k_per_h(),
    ),
    HouseSensorDescription(
        key="thermal_mass",
        translation_key="thermal_mass",
        native_unit_of_measurement="kWh/K",
        suggested_display_precision=1,
        value_fn=lambda d: (
            None
            if d.cool_down is None
            else d.cool_down.thermal_mass_kwh_per_k(d.heat_loss.coefficient_w_per_k)
        ),
    ),
]


class HouseSensor(
    CoordinatorEntity[HouseCoordinator], WeheatInsightsEntity, SensorEntity
):
    """Heat loss, balance point and cool-down figures of the house."""

    entity_description: HouseSensorDescription

    def __init__(
        self,
        pump: WeheatHeatPump,
        coordinator: HouseCoordinator,
        description: HouseSensorDescription,
    ) -> None:
        """Initialise the sensor."""
        CoordinatorEntity.__init__(self, coordinator)
        WeheatInsightsEntity.__init__(self, pump, description.key)
        self.entity_description = description

    @property
    def native_value(self) -> float | None:
        """Return the estimate."""
        return _round(self.entity_description.value_fn(self.coordinator.data), 3)

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """Return the quality of the estimate."""
        if self.entity_description.attrs_fn is not None:
            return self.entity_description.attrs_fn(self.coordinator.data)
        if self.entity_description.key.startswith(("cool_down", "thermal")):
            return _cool_down_attrs(self.coordinator.data)
        return _house_attrs(self.coordinator.data)


def _comparison_attrs(data: HouseData) -> dict[str, Any]:
    comparison = data.comparison
    if comparison is None:
        return {"curve_changed_on": None}
    attrs: dict[str, Any] = {"curve_changed_on": comparison.changed_on.isoformat()}
    for name, side in (("before", comparison.before), ("after", comparison.after)):
        if side is None:
            attrs[f"{name}_days"] = 0
            continue
        attrs |= {
            f"{name}_start": side.start.isoformat(),
            f"{name}_end": side.end.isoformat(),
            f"{name}_days": side.days,
            f"{name}_degree_days": round(side.degree_days, 1),
            f"{name}_electricity_kwh": round(side.electricity_kwh, 1),
            f"{name}_cop_heating": _round(side.cop, 2),
        }
    return attrs


def _side_value(data: HouseData, side: str) -> float | None:
    if data.comparison is None:
        return None
    figures = getattr(data.comparison, side)
    return None if figures is None else figures.electricity_per_degree_day


COMPARISON_SENSORS: list[HouseSensorDescription] = [
    HouseSensorDescription(
        key="heating_electricity_per_degree_day_before",
        translation_key="heating_electricity_per_degree_day_before",
        native_unit_of_measurement=UNIT_HEAT_PER_DEGREE_DAY,
        suggested_display_precision=2,
        value_fn=lambda d: _side_value(d, "before"),
        attrs_fn=_comparison_attrs,
    ),
    HouseSensorDescription(
        key="heating_electricity_per_degree_day_after",
        translation_key="heating_electricity_per_degree_day_after",
        native_unit_of_measurement=UNIT_HEAT_PER_DEGREE_DAY,
        suggested_display_precision=2,
        value_fn=lambda d: _side_value(d, "after"),
        attrs_fn=_comparison_attrs,
    ),
    HouseSensorDescription(
        key="heating_curve_change_effect",
        translation_key="heating_curve_change_effect",
        native_unit_of_measurement="%",
        suggested_display_precision=0,
        value_fn=lambda d: (
            None if d.comparison is None else d.comparison.change_percent
        ),
        attrs_fn=_comparison_attrs,
    ),
]


def curve_point_key(outdoor: float) -> str:
    """Entity key for a curve point, e.g. curve_advice_minus_20."""
    value = int(outdoor)
    return f"curve_advice_{'minus_' if value < 0 else ''}{abs(value)}"


class CurveAdviceSensor(
    CoordinatorEntity[HouseCoordinator], WeheatInsightsEntity, SensorEntity
):
    """Advised water temperature at one point of the Weheat heating curve."""

    _attr_device_class = SensorDeviceClass.TEMPERATURE
    _attr_native_unit_of_measurement = UnitOfTemperature.CELSIUS
    _attr_suggested_display_precision = 1

    def __init__(
        self, pump: WeheatHeatPump, coordinator: HouseCoordinator, outdoor: float
    ) -> None:
        """Initialise the sensor."""
        CoordinatorEntity.__init__(self, coordinator)
        WeheatInsightsEntity.__init__(self, pump, curve_point_key(outdoor))
        self._outdoor = outdoor
        self._attr_translation_key = "curve_advice"
        self._attr_translation_placeholders = {"outdoor": f"{outdoor:g}"}

    def _point(self):
        curve = self.coordinator.data.curve
        if curve is None:
            return None
        return next((p for p in curve.points if p.outdoor_c == self._outdoor), None)

    @property
    def native_value(self) -> float | None:
        """Advised supply temperature, one decimal."""
        point = self._point()
        return None if point is None else round(point.supply_c, 1)

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """Return the range, the entered current value and caveats."""
        curve = self.coordinator.data.curve
        point = self._point()
        attrs: dict[str, Any] = {"outdoor_temperature": self._outdoor}
        if curve is not None:
            attrs |= {
                "current": curve.current.get(self._outdoor),
                "target_room_temperature": curve.target_c,
                "emitter_type": curve.emitter_type,
                "measured_indoor_temperature": _round(curve.measured_indoor_c, 1),
            }
            if curve.reason is not None:
                attrs["no_advice_reason"] = curve.reason
        if point is not None:
            attrs |= {
                "range_low": round(point.supply_low_c, 1),
                "range_high": round(point.supply_high_c, 1),
                "heat_demand_kw": round(point.heat_kw, 2),
                "extrapolated": point.extrapolated,
                "no_heat_needed": point.no_heat_needed,
            }
        return attrs


class _OperatingEntity(WeheatInsightsEntity, SensorEntity):
    """Updates when the operating tracker reports a change."""

    def __init__(
        self, pump: WeheatHeatPump, tracker: OperatingTracker, key: str
    ) -> None:
        """Initialise."""
        super().__init__(pump, key)
        self._tracker = tracker

    async def async_added_to_hass(self) -> None:
        """Follow the tracker."""
        self.async_on_remove(
            self._tracker.async_add_listener(self.async_write_ha_state)
        )


class OperatingSummarySensor(_OperatingEntity):
    """Number of periods today in one operating state, with full statistics."""

    def __init__(
        self, pump: WeheatHeatPump, tracker: OperatingTracker, group: str
    ) -> None:
        """Initialise."""
        super().__init__(pump, tracker, f"operating_{group}")
        self._group = group

    @property
    def native_value(self) -> int:
        """Periods that ended today."""
        return self._tracker.summary()["today"][self._group].count

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """Count, length (min/avg/max, minutes), time and share per window."""
        attrs: dict[str, Any] = {}
        for window, stats in self._tracker.summary().items():
            figures = stats[self._group]
            attrs |= {
                f"{window}_count": figures.count,
                f"{window}_min_minutes": _round(figures.min_minutes, 1),
                f"{window}_avg_minutes": _round(figures.avg_minutes, 1),
                f"{window}_max_minutes": _round(figures.max_minutes, 1),
                f"{window}_hours": round(figures.total_hours, 2),
                f"{window}_share_percent": round(figures.share_percent, 1),
            }
        open_ = self._tracker.open
        attrs["active_since"] = (
            open_[1].isoformat()
            if open_ is not None and open_[0] == self._group
            else None
        )
        return attrs


class OperatingCounterSensor(_OperatingEntity):
    """Running total of periods or time in one state, for long-term statistics."""

    _attr_state_class = SensorStateClass.TOTAL_INCREASING

    def __init__(
        self,
        pump: WeheatHeatPump,
        tracker: OperatingTracker,
        group: str,
        kind: str,
    ) -> None:
        """Initialise; ``kind`` is "count" or "time"."""
        super().__init__(
            pump,
            tracker,
            f"{group}_periods_total" if kind == "count" else f"{group}_time_total",
        )
        self._group = group
        self._kind = kind
        if kind == "time":
            self._attr_device_class = SensorDeviceClass.DURATION
            self._attr_native_unit_of_measurement = UnitOfTime.HOURS
            self._attr_suggested_display_precision = 1

    @property
    def native_value(self) -> float:
        """Completed periods, or hours in this state (running period included)."""
        total = self._tracker.totals[self._group]
        if self._kind == "count":
            return int(total["count"])
        return round(self._tracker.seconds_in(self._group) / 3600, 3)
