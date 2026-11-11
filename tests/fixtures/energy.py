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


# 1-12 November 2026 on the same installation, as shown by the "COP this
# month" attributes. The Weheat app showed a COP of 4.6 for this month.
NOVEMBER = EnergyTotals(
    in_heating=38.51,
    in_dhw=17.38,
    in_defrost=0.04,
    in_standby=2.42,
    in_indoor_unit=12.94,
    out_heating=192.91,
    out_dhw=66.61,
    out_defrost=-0.27,
)
