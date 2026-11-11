"""Constants for Weheat Insights (unofficial, not affiliated with Weheat)."""

from logging import Logger, getLogger
from typing import Final

DOMAIN: Final = "weheat_insights"
NAME: Final = "Weheat Insights"
WEHEAT_DOMAIN: Final = "weheat"

LOGGER: Logger = getLogger(__package__)

CONF_HEAT_PUMP_ID: Final = "heat_pump_id"
CONF_OUTDOOR_ENTITY: Final = "outdoor_entity"
CONF_INDOOR_ENTITY: Final = "indoor_entity"

CONF_SEASON_START_MONTH: Final = "season_start_month"
CONF_SEASON_END_MONTH: Final = "season_end_month"
CONF_DEGREE_DAY_BASE: Final = "degree_day_base"
CONF_WEIGHTED_DEGREE_DAYS: Final = "weighted_degree_days"

DEFAULT_SEASON_START_MONTH: Final = 9
DEFAULT_SEASON_END_MONTH: Final = 5
DEFAULT_DEGREE_DAY_BASE: Final = 18.0
DEFAULT_WEIGHTED_DEGREE_DAYS: Final = True

CONF_TARGET_ROOM_TEMPERATURE: Final = "target_room_temperature"
CONF_EMITTER_TYPE: Final = "emitter_type"
CONF_CURVE_CHANGED_ON: Final = "curve_changed_on"

DEFAULT_TARGET_ROOM_TEMPERATURE: Final = 20.0
DEFAULT_EMITTER_TYPE: Final = "mixed"

# The current Weheat heating curve, entered by the user: water temperature at
# each outdoor temperature of the curve.
CONF_CURRENT_CURVE: Final = {
    -20.0: "current_curve_minus_20",
    9.0: "current_curve_9",
    15.0: "current_curve_15",
    20.0: "current_curve_20",
    25.0: "current_curve_25",
}
