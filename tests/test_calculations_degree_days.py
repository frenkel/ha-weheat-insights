"""Tests for degree days."""

from datetime import date

import pytest

from custom_components.weheat_insights.calculations.degree_days import (
    degree_days_by_day,
    degree_days_for_day,
    heat_per_degree_day,
    month_weight,
)


def test_plain_degree_days() -> None:
    assert degree_days_for_day(date(2026, 11, 11), 5.6) == pytest.approx(12.4)
    assert degree_days_for_day(date(2026, 11, 11), 19.0) == 0.0
    assert degree_days_for_day(date(2026, 11, 11), 5.0, base_c=15.5) == 10.5


@pytest.mark.parametrize(
    ("month", "weight"),
    [
        (1, 1.1),
        (2, 1.1),
        (3, 1.0),
        (4, 0.8),
        (7, 0.8),
        (9, 0.8),
        (10, 1.0),
        (11, 1.1),
        (12, 1.1),
    ],
)
def test_weights(month, weight) -> None:
    assert month_weight(month) == weight


def test_weighted_degree_days() -> None:
    assert degree_days_for_day(date(2026, 1, 5), 8.0, weighted=True) == pytest.approx(
        11.0
    )
    assert degree_days_for_day(date(2026, 4, 5), 8.0, weighted=True) == pytest.approx(
        8.0
    )


def test_degree_days_by_day() -> None:
    means = {date(2026, 11, 10): 6.0, date(2026, 11, 11): 20.0}
    assert degree_days_by_day(means, 18.0, False) == {
        date(2026, 11, 10): 12.0,
        date(2026, 11, 11): 0.0,
    }


def test_heat_per_degree_day() -> None:
    assert heat_per_degree_day(300.0, 12.0) == 25.0
    assert heat_per_degree_day(3.0, 0.5) is None
