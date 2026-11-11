"""Calendar helpers: heating seasons and summing daily rows."""

from __future__ import annotations

from collections.abc import Callable, Iterable, Mapping
from datetime import date


def add_months(day: date, months: int) -> date:
    """First day of the month ``months`` after the month of ``day``."""
    index = day.year * 12 + (day.month - 1) + months
    return date(index // 12, index % 12 + 1, 1)


def season_bounds(today: date, start_month: int, end_month: int) -> tuple[date, date]:
    """Return [start, end) of the heating season containing ``today``.

    The season runs from the first day of ``start_month`` up to and
    including the last day of ``end_month`` and may wrap the year end
    (default September up to and including May). Outside the season the
    most recent season is returned, so summer shows last winter's SCOP.
    """
    if not (1 <= start_month <= 12 and 1 <= end_month <= 12):
        raise ValueError("months must be 1..12")
    length = (end_month - start_month) % 12 + 1
    # Latest season start that is not after today.
    start = date(today.year, start_month, 1)
    if start > today:
        start = date(today.year - 1, start_month, 1)
    return start, add_months(start, length)


def previous_season(start: date, end: date) -> tuple[date, date]:
    """Return the same season one year earlier."""
    return _shift_year(start, -1), _shift_year(end, -1)


def _shift_year(day: date, years: int) -> date:
    try:
        return day.replace(year=day.year + years)
    except ValueError:  # 29 February
        return day.replace(year=day.year + years, day=28)


def same_day_last_year(day: date) -> date:
    """``day`` one year earlier (28 Feb for 29 Feb)."""
    return _shift_year(day, -1)


def month_start(day: date) -> date:
    """First day of the month of ``day``."""
    return day.replace(day=1)


def sum_days[T](
    rows: Mapping[date, T],
    start: date,
    end: date,
    add: Callable[[Iterable[T]], T],
) -> T:
    """Combine daily rows with ``start <= day < end``."""
    return add(value for day, value in rows.items() if start <= day < end)
