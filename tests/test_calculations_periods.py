"""Tests for season and period helpers."""

from datetime import date

import pytest

from custom_components.weheat_insights.calculations.periods import (
    month_start,
    previous_season,
    same_day_last_year,
    season_bounds,
    sum_days,
)


@pytest.mark.parametrize(
    ("today", "expected"),
    [
        (date(2026, 11, 11), (date(2026, 9, 1), date(2027, 6, 1))),
        (date(2027, 1, 15), (date(2026, 9, 1), date(2027, 6, 1))),
        (date(2027, 5, 31), (date(2026, 9, 1), date(2027, 6, 1))),
        # Summer: the most recent (ended) season.
        (date(2027, 7, 1), (date(2026, 9, 1), date(2027, 6, 1))),
        (date(2026, 9, 1), (date(2026, 9, 1), date(2027, 6, 1))),
    ],
)
def test_default_season(today, expected) -> None:
    assert season_bounds(today, 9, 5) == expected


def test_season_within_one_year_and_full_year() -> None:
    assert season_bounds(date(2026, 6, 1), 1, 12) == (
        date(2026, 1, 1),
        date(2027, 1, 1),
    )
    assert season_bounds(date(2026, 2, 1), 10, 4) == (
        date(2025, 10, 1),
        date(2026, 5, 1),
    )


def test_invalid_month() -> None:
    with pytest.raises(ValueError):
        season_bounds(date(2026, 1, 1), 0, 5)


def test_previous_season_and_last_year() -> None:
    assert previous_season(date(2026, 9, 1), date(2027, 6, 1)) == (
        date(2025, 9, 1),
        date(2026, 6, 1),
    )
    assert same_day_last_year(date(2028, 2, 29)) == date(2027, 2, 28)
    assert month_start(date(2026, 11, 11)) == date(2026, 11, 1)


def test_sum_days_is_half_open() -> None:
    rows = {date(2026, 11, d): float(d) for d in range(1, 6)}
    assert sum_days(rows, date(2026, 11, 2), date(2026, 11, 4), sum) == 5.0
