"""Tests for operating periods."""

from datetime import datetime, timedelta

import pytest

from custom_components.weheat_insights.calculations.operating import (
    Period,
    group_of,
    periods_from_states,
    window_stats,
)

T0 = datetime(2026, 11, 11, 0, 0)


def at(minutes: float) -> datetime:
    return T0 + timedelta(minutes=minutes)


def test_group_mapping() -> None:
    assert group_of("defrosting") == "defrost"
    assert group_of("legionella_prevention") == "legionella"
    assert group_of("water_check") is None  # rare: not counted
    assert group_of("offline") is None
    assert group_of("unavailable") is None
    assert group_of(None) is None


def test_periods_merge_same_group_and_stop_at_gaps() -> None:
    changes = [
        (at(0), "standby"),
        (at(30), "heating"),
        (at(32), "heating"),  # repeated state, same period
        (at(90), "defrosting"),
        (at(95), "heating"),
        (at(150), "legionella_prevention"),
        (at(152), "legionella_prevention"),  # repeated report, same period
        (at(170), "water_check"),  # rare state: a gap that ends the period
        (at(180), "standby"),
    ]
    periods, open_period = periods_from_states(changes, until=at(200))
    assert [(p.group, p.minutes) for p in periods] == [
        ("standby", 30),
        ("heating", 60),
        ("defrost", 5),
        ("heating", 55),
        ("legionella", 20),
    ]
    assert open_period == ("standby", at(180))


def test_window_stats() -> None:
    periods = [
        Period("heating", at(0), at(8)),
        Period("standby", at(8), at(60)),
        Period("heating", at(60), at(120)),
        Period("defrost", at(120), at(124)),
        Period("heating", at(124), at(200)),  # ends outside the window
    ]
    stats = window_stats(periods, at(0), at(180))
    heating = stats["heating"]
    assert heating.count == 2
    assert heating.min_minutes == pytest.approx(8)
    assert heating.max_minutes == pytest.approx(60)
    assert heating.avg_minutes == pytest.approx(34)
    # Time is clipped to the window: 8 + 60 + 56 minutes.
    assert heating.total_hours == pytest.approx(124 / 60)
    assert heating.share_percent == pytest.approx(124 / 180 * 100)
    assert stats["dhw"].count == 0
    assert stats["dhw"].avg_minutes is None
