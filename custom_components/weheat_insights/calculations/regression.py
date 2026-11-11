"""Ordinary least squares with the statistics we report."""

from __future__ import annotations

from collections.abc import Sequence
from dataclasses import dataclass
import math

# Two-sided 95 % critical values of Student's t by degrees of freedom.
_T95 = {
    1: 12.706, 2: 4.303, 3: 3.182, 4: 2.776, 5: 2.571, 6: 2.447, 7: 2.365,
    8: 2.306, 9: 2.262, 10: 2.228, 11: 2.201, 12: 2.179, 13: 2.160, 14: 2.145,
    15: 2.131, 16: 2.120, 17: 2.110, 18: 2.101, 19: 2.093, 20: 2.086,
    21: 2.080, 22: 2.074, 23: 2.069, 24: 2.064, 25: 2.060, 26: 2.056,
    27: 2.052, 28: 2.048, 29: 2.045, 30: 2.042, 40: 2.021, 60: 2.000,
    120: 1.980,
}  # fmt: skip


def t95(df: int) -> float:
    """Two-sided 95 % t critical value (conservative between table entries)."""
    if df < 1:
        raise ValueError("df must be >= 1")
    for key in sorted(_T95):
        if df <= key:
            return _T95[key]
    return 1.960


@dataclass(frozen=True, slots=True)
class LinearFit:
    """y = slope * x + intercept."""

    slope: float
    intercept: float
    r_squared: float
    slope_stderr: float
    n: int

    @property
    def slope_ci95(self) -> float:
        """Half width of the 95 % confidence interval of the slope."""
        return t95(self.n - 2) * self.slope_stderr

    def predict(self, x: float) -> float:
        """Value of the fitted line at ``x``."""
        return self.slope * x + self.intercept


def linear_fit(xs: Sequence[float], ys: Sequence[float]) -> LinearFit | None:
    """Fit a line; None with fewer than 3 points or no spread in x."""
    n = len(xs)
    if n != len(ys) or n < 3:
        return None
    mean_x = sum(xs) / n
    mean_y = sum(ys) / n
    sxx = sum((x - mean_x) ** 2 for x in xs)
    if sxx == 0:
        return None
    sxy = sum((x - mean_x) * (y - mean_y) for x, y in zip(xs, ys, strict=True))
    slope = sxy / sxx
    intercept = mean_y - slope * mean_x
    ss_res = sum(
        (y - (slope * x + intercept)) ** 2 for x, y in zip(xs, ys, strict=True)
    )
    ss_tot = sum((y - mean_y) ** 2 for y in ys)
    r_squared = 1.0 - ss_res / ss_tot if ss_tot > 0 else 0.0
    stderr = math.sqrt(ss_res / (n - 2) / sxx)
    return LinearFit(slope, intercept, r_squared, stderr, n)
