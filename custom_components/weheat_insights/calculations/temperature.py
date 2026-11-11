"""Temperature calculations."""

from __future__ import annotations


def delta_t(supply_c: float | None, return_c: float | None) -> float | None:
    """Return supply minus return temperature in kelvin.

    Both inputs are in °C. Returns None when either value is unknown.
    A negative result is real (e.g. during defrost or cooling) and is kept.
    """
    if supply_c is None or return_c is None:
        return None
    return supply_c - return_c
