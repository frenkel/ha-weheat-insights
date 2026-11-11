"""Tests for pure temperature calculations."""

import pytest

from custom_components.weheat_insights.calculations.temperature import delta_t


@pytest.mark.parametrize(
    ("supply", "return_", "expected"),
    [
        (35.0, 30.0, 5.0),
        (30.0, 32.5, -2.5),  # defrost: return warmer than supply
        (None, 30.0, None),
        (35.0, None, None),
    ],
)
def test_delta_t(supply, return_, expected) -> None:
    assert delta_t(supply, return_) == expected
