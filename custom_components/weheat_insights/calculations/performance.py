"""COP/SCOP from energy counters.

Definitions (see README):

* Heat-pump COP: all useful heat (heating + DHW + defrost, defrost being
  negative) divided by the compressor electricity (heating + DHW +
  defrost). This matches what the Weheat app shows.
* Total COP: the same heat divided by all electricity, i.e. also standby
  and the indoor unit (circulation pumps). This is what heat costs you.
* Heating and DHW COP: only the electricity the compressor used for that
  mode, plus its share of defrost. The core Weheat integration reports
  defrost as one combined counter, so defrost electricity and defrost heat
  are split pro rata to the heating and DHW electricity. Standby and the
  indoor unit are left out of these two.
* Cooling is not part of any heating figure.
"""

from __future__ import annotations

from dataclasses import dataclass, fields

# Below this much electricity a ratio is mostly noise (e.g. a mild day
# with one short run), so we report no value instead of a silly one.
MIN_INPUT_KWH = 0.5


@dataclass(frozen=True, slots=True)
class EnergyTotals:
    """Energy over some period, in kWh. Missing counters count as 0."""

    in_heating: float = 0.0
    in_dhw: float = 0.0
    in_defrost: float = 0.0
    in_standby: float = 0.0
    in_indoor_unit: float = 0.0
    out_heating: float = 0.0
    out_dhw: float = 0.0
    out_defrost: float = 0.0  # heat taken back during defrost: <= 0

    def __add__(self, other: EnergyTotals) -> EnergyTotals:
        """Sum two periods."""
        return EnergyTotals(
            **{
                f.name: getattr(self, f.name) + getattr(other, f.name)
                for f in fields(self)
            }
        )

    @property
    def total_in(self) -> float:
        """All electricity, including standby and the indoor unit."""
        return (
            self.in_heating
            + self.in_dhw
            + self.in_defrost
            + self.in_standby
            + self.in_indoor_unit
        )

    @property
    def heat_pump_in(self) -> float:
        """Compressor electricity: heating, DHW and defrost (as the Weheat app)."""
        return self.in_heating + self.in_dhw + self.in_defrost

    @property
    def total_out(self) -> float:
        """All useful heat, net of what defrost took back."""
        return self.out_heating + self.out_dhw + self.out_defrost

    @property
    def heating_share(self) -> float | None:
        """Fraction of compressor electricity used for space heating."""
        compressor = self.in_heating + self.in_dhw
        return None if compressor <= 0 else self.in_heating / compressor

    def mode_energy(self, mode: str) -> tuple[float, float]:
        """Return (electricity, heat) for "heating" or "dhw" incl. defrost share."""
        share = self.heating_share
        if share is None:
            return 0.0, 0.0
        if mode == "heating":
            fraction, used, made = share, self.in_heating, self.out_heating
        elif mode == "dhw":
            fraction, used, made = 1 - share, self.in_dhw, self.out_dhw
        else:
            raise ValueError(mode)
        return (
            used + fraction * self.in_defrost,
            made + fraction * self.out_defrost,
        )


def ratio(
    heat: float, electricity: float, minimum: float = MIN_INPUT_KWH
) -> float | None:
    """Heat divided by electricity, or None when there is too little data."""
    if electricity < minimum:
        return None
    return heat / electricity


@dataclass(frozen=True, slots=True)
class Performance:
    """Derived figures for one period."""

    cop: float | None  # total, incl. standby and indoor unit
    cop_heat_pump: float | None  # compressor only, as the Weheat app
    cop_heating: float | None
    cop_dhw: float | None
    cop_without_defrost: float | None
    defrost_cop_impact: float | None
    totals: EnergyTotals


def performance(totals: EnergyTotals, minimum: float = MIN_INPUT_KWH) -> Performance:
    """Compute all COP figures for one period."""
    cop = ratio(totals.total_out, totals.total_in, minimum)
    cop_without_defrost = ratio(
        totals.total_out - totals.out_defrost,
        totals.total_in - totals.in_defrost,
        minimum,
    )
    heating_in, heating_out = totals.mode_energy("heating")
    dhw_in, dhw_out = totals.mode_energy("dhw")
    return Performance(
        cop=cop,
        cop_heat_pump=ratio(totals.total_out, totals.heat_pump_in, minimum),
        cop_heating=ratio(heating_out, heating_in, minimum),
        cop_dhw=ratio(dhw_out, dhw_in, minimum),
        cop_without_defrost=cop_without_defrost,
        # How many COP points defrosting costs: positive means it lowers COP.
        defrost_cop_impact=(
            None
            if cop is None or cop_without_defrost is None
            else cop_without_defrost - cop
        ),
        totals=totals,
    )
