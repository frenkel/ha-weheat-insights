"""Realistic lifetime counter values (kWh) for one heat pump.

The electricity and defrost figures are taken from a real installation; the
heat output for heating and DHW is plausible for that installation.
"""

from custom_components.weheat_insights.calculations.performance import EnergyTotals

LIFETIME = EnergyTotals(
    in_heating=763.16,
    in_dhw=597.85,
    in_defrost=8.58,
    in_standby=129.53,
    in_indoor_unit=0.0,
    out_heating=3433.0,
    out_dhw=1793.6,
    out_defrost=-66.43,
)
