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
