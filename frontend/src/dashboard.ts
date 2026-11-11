/**
 * Turns the integration's resolved entities into a Lovelace dashboard.
 *
 * Pure functions only: no Home Assistant calls here, so the output is easy
 * to reason about. Missing entities are skipped instead of producing
 * "entity not found" cards, because the core Weheat integration only
 * creates sensors that the heat pump actually reports.
 */
import type { Localize } from "./localize";
import type {
  HeatPumpConfig,
  LovelaceCardConfig,
  LovelaceConfig,
  LovelaceSectionConfig,
  LovelaceViewConfig,
} from "./types";

type Entity = { entity: string; name?: string };

const present = <T>(items: (T | null | undefined | false)[]): T[] =>
  items.filter((item): item is T => Boolean(item));

function heading(text: string, icon?: string): LovelaceCardConfig {
  return { type: "heading", heading: text, heading_style: "title", ...(icon ? { icon } : {}) };
}

function tile(entity: string | null | undefined, name: string): LovelaceCardConfig | null {
  return entity ? { type: "tile", entity, name } : null;
}

function entity(entityId: string | null | undefined, name: string): Entity | null {
  return entityId ? { entity: entityId, name } : null;
}

function historyGraph(title: string, entities: Entity[], hours: number): LovelaceCardConfig | null {
  return entities.length
    ? { type: "history-graph", title, hours_to_show: hours, entities, grid_options: { columns: "full" } }
    : null;
}

function statisticsGraph(title: string, entities: Entity[], days: number): LovelaceCardConfig | null {
  return entities.length
    ? {
        type: "statistics-graph",
        title,
        entities,
        days_to_show: days,
        period: "hour",
        stat_types: ["mean"],
        chart_type: "line",
        grid_options: { columns: "full" },
      }
    : null;
}

function section(cards: (LovelaceCardConfig | null)[]): LovelaceSectionConfig | null {
  const real = present(cards);
  // A section with only its heading is noise.
  return real.length > 1 ? { type: "grid", cards: real } : null;
}

/** The room temperature: the user's chosen sensor wins over the thermostat's. */
function roomEntity(pump: HeatPumpConfig): string | undefined {
  return pump.indoor_entity_id ?? pump.weheat.thermostat_room_temperature;
}

export function pumpView(pump: HeatPumpConfig, t: Localize, index: number): LovelaceViewConfig {
  const w = pump.weheat;
  const room = roomEntity(pump);
  const outdoor = pump.outdoor_entity_id ?? w.outside_temperature;

  const temperatures = present([
    entity(w.water_outlet_temperature, t("supply")),
    entity(w.water_inlet_temperature, t("return")),
    entity(outdoor, t("outdoor")),
    entity(room, t("room")),
  ]);
  const power = present([
    entity(w.power_input, t("power_input")),
    entity(w.power_output, t("power_output")),
  ]);
  const performance = present([
    entity(w.cop, t("cop")),
    entity(pump.insights.delta_t, t("delta_t")),
  ]);

  const live = section([
    heading(t("live"), "mdi:heat-pump"),
    tile(w.heat_pump_state, t("state")),
    w.cop
      ? {
          type: "gauge",
          entity: w.cop,
          name: t("cop"),
          min: 0,
          max: 7,
          needle: true,
          severity: { red: 0, yellow: 3, green: 4 },
        }
      : null,
    tile(room, t("room")),
    tile(outdoor, t("outdoor")),
    tile(w.water_outlet_temperature, t("supply")),
    tile(w.water_inlet_temperature, t("return")),
    tile(pump.insights.delta_t, t("delta_t")),
    tile(w.power_input, t("power_input")),
    tile(w.power_output, t("power_output")),
  ]);

  const day = section([
    heading(t("last_24h"), "mdi:clock-outline"),
    historyGraph(t("temperatures"), temperatures, 24),
    historyGraph(t("power"), power, 24),
    historyGraph(`${t("cop")} / ${t("delta_t")}`, performance, 24),
    historyGraph(t("state"), present([entity(w.heat_pump_state, t("state"))]), 24),
  ]);

  // Seven days of raw history is heavy; hourly long-term statistics are not.
  const week = section([
    heading(t("last_7d"), "mdi:calendar-week"),
    statisticsGraph(t("temperatures"), temperatures, 7),
    statisticsGraph(t("power"), power, 7),
    statisticsGraph(`${t("cop")} / ${t("delta_t")}`, performance, 7),
  ]);

  return {
    title: pump.name,
    path: index === 0 ? "heat-pump" : `heat-pump-${index + 1}`,
    icon: "mdi:heat-pump-outline",
    type: "sections",
    max_columns: 3,
    sections: present([live, day, week]),
  };
}

function messageView(t: Localize, title: string, body: string): LovelaceViewConfig {
  return {
    title: t("title"),
    path: "weheat-insights",
    type: "panel",
    cards: [{ type: "markdown", content: `## ${title}\n\n${body}\n\n_${t("disclaimer")}_` }],
  };
}

export function generateDashboard(pumps: HeatPumpConfig[], t: Localize): LovelaceConfig {
  if (!pumps.length) {
    return { title: t("title"), views: [messageView(t, t("no_pumps_title"), t("no_pumps_body"))] };
  }
  return { title: t("title"), views: pumps.map((pump, index) => pumpView(pump, t, index)) };
}

export function errorDashboard(t: Localize, detail: string): LovelaceConfig {
  return {
    title: t("title"),
    views: [messageView(t, t("error_title"), `${t("error_body")}\n\n\`${detail}\``)],
  };
}
