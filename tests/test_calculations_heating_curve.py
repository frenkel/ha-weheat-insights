"""Tests for the heating-curve advice."""

import pytest

from custom_components.weheat_insights.calculations.heating_curve import (
    EMITTER_EXPONENTS,
    EmitterModel,
    SteadyHour,
    advise,
    calibrate_emitters,
    heat_demand_kw,
)

N = EMITTER_EXPONENTS["mixed"]
K = 0.12  # kW per K^1.2
DT_PER_KW = 1.5  # K supply-return per kW


def _hours(count: int = 48) -> list[SteadyHour]:
    hours = []
    for i in range(count):
        room = 20.0 + 0.2 * (i % 3)
        heat = 1.0 + 0.05 * i  # 1 .. 3.35 kW
        mean = room + (heat / K) ** (1 / N)
        half = DT_PER_KW * heat / 2
        hours.append(SteadyHour(heat, mean + half, mean - half, room))
    return hours


def test_calibration_recovers_emitter_law() -> None:
    model = calibrate_emitters(_hours(), N)
    assert model.k == pytest.approx(K, rel=1e-6)
    assert model.dt_per_kw == pytest.approx(DT_PER_KW, rel=1e-6)
    assert model.hours == 48


def test_calibration_needs_enough_usable_hours() -> None:
    assert calibrate_emitters(_hours(10), N) is None
    lukewarm = [SteadyHour(1.0, 22.0, 21.0, 20.0)] * 50  # water barely above room
    assert calibrate_emitters(lukewarm, N) is None


def test_supply_for_demand() -> None:
    model = EmitterModel(k=K, n=N, dt_per_kw=DT_PER_KW, hours=48)
    supply = model.supply_for(2.0, 20.0)
    assert supply == pytest.approx(20 + (2 / K) ** (1 / N) + DT_PER_KW, rel=1e-6)
    assert model.supply_for(0.0, 20.0) == 20.0


def test_heat_demand() -> None:
    # 4.8 kWh/day per K, 10 kWh/day free heat: at 0 °C, 20 °C target
    assert heat_demand_kw(4.8, -10.0, 20.0, 0.0) == pytest.approx((96 - 10) / 24)
    assert heat_demand_kw(4.8, -10.0, 20.0, 19.0) == 0.0


def test_advice_points() -> None:
    model = EmitterModel(k=K, n=N, dt_per_kw=DT_PER_KW, hours=48)
    points = advise(
        slope=1.95,  # ~81 W/K
        slope_ci=0.65,
        intercept=-6.0,
        emitters=model,
        target_c=20.0,
        observed_outdoor=(4.0, 15.0),
    )
    by_outdoor = {p.outdoor_c: p for p in points}
    assert list(by_outdoor) == [-20.0, 9.0, 15.0, 20.0, 25.0]

    cold = by_outdoor[-20.0]
    assert cold.extrapolated is True
    assert cold.supply_low_c < cold.supply_c < cold.supply_high_c

    nine = by_outdoor[9.0]
    assert nine.extrapolated is False
    assert nine.heat_kw == pytest.approx((1.95 * 11 - 6) / 24)
    assert nine.supply_c == pytest.approx(model.supply_for(nine.heat_kw, 20.0))

    # Above the balance point no heat is needed: advice is the room target.
    warm = by_outdoor[25.0]
    assert warm.no_heat_needed is True
    assert warm.supply_c == 20.0
    # Supply falls as it gets warmer outside.
    supplies = [p.supply_c for p in points]
    assert supplies == sorted(supplies, reverse=True)


def test_higher_target_needs_warmer_water() -> None:
    model = EmitterModel(k=K, n=N, dt_per_kw=DT_PER_KW, hours=48)
    args = dict(slope=2.0, slope_ci=0.2, intercept=-6.0, emitters=model)
    at20 = advise(**args, target_c=20.0, observed_outdoor=(0, 15))
    at21 = advise(**args, target_c=21.0, observed_outdoor=(0, 15))
    assert at21[1].supply_c > at20[1].supply_c
