"""Tests for COP/SCOP calculations."""

import pytest

from custom_components.weheat_insights.calculations.performance import (
    EnergyTotals,
    performance,
    ratio,
)

from .fixtures.energy import LIFETIME


def test_total_cop_includes_everything() -> None:
    result = performance(LIFETIME)
    total_in = 763.16 + 597.85 + 8.58 + 129.53
    total_out = 3433.0 + 1793.6 - 66.43
    assert result.cop == pytest.approx(total_out / total_in)


def test_defrost_is_split_pro_rata_to_mode_electricity() -> None:
    share = 763.16 / (763.16 + 597.85)
    heating_in, heating_out = LIFETIME.mode_energy("heating")
    dhw_in, dhw_out = LIFETIME.mode_energy("dhw")

    assert heating_in == pytest.approx(763.16 + share * 8.58)
    assert heating_out == pytest.approx(3433.0 - share * 66.43)
    # The two shares add back up to the full defrost amounts.
    assert heating_in + dhw_in == pytest.approx(763.16 + 597.85 + 8.58)
    assert heating_out + dhw_out == pytest.approx(3433.0 + 1793.6 - 66.43)

    result = performance(LIFETIME)
    assert result.cop_heating == pytest.approx(heating_out / heating_in)
    assert result.cop_dhw == pytest.approx(dhw_out / dhw_in)


def test_split_cops_leave_out_standby_and_indoor_unit() -> None:
    with_standby = performance(LIFETIME)
    without = performance(EnergyTotals(**_no_standby()))
    assert with_standby.cop_heating == pytest.approx(without.cop_heating)
    assert with_standby.cop_dhw == pytest.approx(without.cop_dhw)
    assert with_standby.cop < without.cop


def _no_standby() -> dict:
    return {
        "in_heating": LIFETIME.in_heating,
        "in_dhw": LIFETIME.in_dhw,
        "in_defrost": LIFETIME.in_defrost,
        "out_heating": LIFETIME.out_heating,
        "out_dhw": LIFETIME.out_dhw,
        "out_defrost": LIFETIME.out_defrost,
    }


def test_defrost_impact_is_positive_when_defrost_costs_heat() -> None:
    result = performance(LIFETIME)
    assert result.cop_without_defrost > result.cop
    assert result.defrost_cop_impact == pytest.approx(
        result.cop_without_defrost - result.cop
    )


def test_no_value_for_too_little_energy() -> None:
    quiet_day = EnergyTotals(in_heating=0.2, out_heating=1.0, in_standby=0.1)
    result = performance(quiet_day)
    assert result.cop is None
    assert result.cop_heating is None
    assert result.defrost_cop_impact is None


def test_pump_without_dhw() -> None:
    result = performance(EnergyTotals(in_heating=10.0, out_heating=42.0))
    assert result.cop_heating == pytest.approx(4.2)
    assert result.cop_dhw is None


def test_nothing_used() -> None:
    assert EnergyTotals().mode_energy("heating") == (0.0, 0.0)
    assert performance(EnergyTotals()).cop is None


def test_totals_add_up() -> None:
    a = EnergyTotals(in_heating=1.0, out_defrost=-0.5)
    b = EnergyTotals(in_heating=2.0, out_dhw=3.0)
    assert a + b == EnergyTotals(in_heating=3.0, out_dhw=3.0, out_defrost=-0.5)


def test_ratio_threshold() -> None:
    assert ratio(4.0, 1.0) == 4.0
    assert ratio(4.0, 0.4) is None
    assert ratio(4.0, 0.4, minimum=0.1) == pytest.approx(10.0)
