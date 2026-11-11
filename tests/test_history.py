"""Tests for COP history per day, month and season."""

from datetime import date, timedelta
from unittest.mock import MagicMock

from homeassistant.core import HomeAssistant
import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.weheat_insights.calculations.performance import EnergyTotals
from custom_components.weheat_insights.coordinator import Settings
from custom_components.weheat_insights.history import history_periods, summarise
from custom_components.weheat_insights.websocket_api import ws_performance_history

TODAY = date(2026, 11, 11)


def test_day_periods() -> None:
    periods = history_periods("day", TODAY, 3, Settings())
    assert periods == [
        (date(2026, 11, 9), date(2026, 11, 10)),
        (date(2026, 11, 10), date(2026, 11, 11)),
        (date(2026, 11, 11), date(2026, 11, 12)),
    ]


def test_month_periods_cross_year() -> None:
    periods = history_periods("month", date(2026, 1, 20), 3, Settings())
    assert periods == [
        (date(2025, 11, 1), date(2025, 12, 1)),
        (date(2025, 12, 1), date(2026, 1, 1)),
        (date(2026, 1, 1), date(2026, 2, 1)),
    ]


def test_season_periods() -> None:
    periods = history_periods("season", TODAY, 2, Settings())
    assert periods == [
        (date(2025, 9, 1), date(2026, 6, 1)),
        (date(2026, 9, 1), date(2027, 6, 1)),
    ]


def test_summarise_groups_months_into_seasons() -> None:
    month = EnergyTotals(in_heating=100.0, out_heating=400.0)
    energy = {
        date(2026, 9, 1): month,
        date(2026, 10, 1): month,
        date(2026, 7, 1): month,
    }
    [season] = summarise([(date(2026, 9, 1), date(2027, 6, 1))], energy)
    assert season["heating_electricity_kwh"] == 200.0  # July is outside
    assert season["cop_heating"] == pytest.approx(4.0)
    assert season["cop_dhw"] is None
    assert season["cop_heat_pump"] == pytest.approx(4.0)
    assert season["heat_pump_electricity_kwh"] == 200.0


def test_summarise_empty_period() -> None:
    [row] = summarise([(TODAY, TODAY + timedelta(days=1))], {})
    assert row["cop"] is None
    assert row["electricity_kwh"] == 0.0


async def test_websocket_history(
    hass: HomeAssistant, insights_entry: MockConfigEntry
) -> None:
    await hass.config_entries.async_setup(insights_entry.entry_id)
    await hass.async_block_till_done()

    connection = MagicMock()
    ws_performance_history(
        hass,
        connection,
        {
            "id": 7,
            "type": "weheat_insights/performance_history",
            "entry_id": insights_entry.entry_id,
            "period": "day",
            "count": 5,
        },
    )
    await hass.async_block_till_done(wait_background_tasks=True)
    msg_id, result = connection.send_result.call_args.args
    assert msg_id == 7
    assert result["period"] == "day"
    assert result["has_dhw"] is False
    assert len(result["periods"]) == 5


async def test_websocket_history_unknown_entry(hass: HomeAssistant) -> None:
    connection = MagicMock()
    ws_performance_history(
        hass,
        connection,
        {"id": 1, "type": "x", "entry_id": "nope", "period": "month"},
    )
    await hass.async_block_till_done(wait_background_tasks=True)
    connection.send_error.assert_called_once()
