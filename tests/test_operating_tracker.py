"""Tests for the operating-state tracker."""

from datetime import timedelta

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import async_fire_time_changed
from pytest_homeassistant_custom_component.components.recorder.common import (
    async_wait_recording_done,
)

from custom_components.weheat_insights.operating_tracker import OperatingTracker

ENTITY = "sensor.weheat_state"


async def test_follows_state_changes_and_persists(hass: HomeAssistant, freezer) -> None:
    freezer.move_to("2026-11-11 08:00:00+00:00")
    hass.states.async_set(ENTITY, "standby")
    tracker = OperatingTracker(hass, "entry1", ENTITY)
    await tracker.async_start()
    calls = []
    tracker.async_add_listener(lambda: calls.append(1))

    for minutes, state in (
        (10, "heating"),
        (40, "defrosting"),
        (45, "heating"),
        (90, "dhw"),
    ):
        freezer.move_to(
            dt_util.parse_datetime("2026-11-11 08:00:00+00:00")
            + timedelta(minutes=minutes)
        )
        hass.states.async_set(ENTITY, state)
        await hass.async_block_till_done()

    groups = [(p.group, round(p.minutes)) for p in tracker.periods]
    assert groups[-4:] == [
        ("standby", 10),
        ("heating", 30),
        ("defrost", 5),
        ("heating", 45),
    ]
    assert tracker.open[0] == "dhw"
    assert tracker.totals["heating"]["count"] == 2
    assert tracker.totals["heating"]["seconds"] == 75 * 60
    # Every completed period notifies (the 5-minute tick may add more).
    assert len(calls) >= 4

    today = tracker.summary()["today"]
    assert today["heating"].count == 2
    assert today["defrost"].avg_minutes == 5

    await tracker.async_stop()
    again = OperatingTracker(hass, "entry1", ENTITY)
    await again.async_start()
    assert again.totals["heating"]["count"] == 2
    assert [p.group for p in again.periods][-4:] == [
        "standby",
        "heating",
        "defrost",
        "heating",
    ]
    await again.async_stop()


async def test_backfills_from_history(hass: HomeAssistant, freezer) -> None:
    start = dt_util.parse_datetime("2026-11-10 06:00:00+00:00")
    for minutes, state in (
        (0, "standby"),
        (20, "heating"),
        (80, "standby"),
        (100, "heating"),
    ):
        freezer.move_to(start + timedelta(minutes=minutes))
        hass.states.async_set(ENTITY, state)
        await hass.async_block_till_done()
    await async_wait_recording_done(hass)

    freezer.move_to(start + timedelta(minutes=130))
    tracker = OperatingTracker(hass, "entry2", ENTITY)
    await tracker.async_start()
    # The first (standby) period is dropped: its real start is unknown.
    assert [(p.group, round(p.minutes)) for p in tracker.periods] == [
        ("heating", 60),
        ("standby", 20),
    ]
    assert tracker.open[0] == "heating"

    async_fire_time_changed(hass, dt_util.utcnow() + timedelta(minutes=6))
    await hass.async_block_till_done()
    await tracker.async_stop()
