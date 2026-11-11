/**
 * Turns the integration's resolved entities into a Lovelace dashboard.
 *
 * Pure functions only: no Home Assistant calls here, so the output is easy
 * to reason about. Missing entities are skipped instead of producing
 * "entity not found" cards, because the core Weheat integration only
 * creates sensors that the heat pump actually reports.
 */
import type { Localize } from "./localize";
import { PERFORMANCE_CARD_TAG } from "./performance-card";
import { SCATTER_CARD_TAG } from "./scatter-card";
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

function section(
  cards: (LovelaceCardConfig | null)[],
  columnSpan?: number,
  noHeading = false,
): LovelaceSectionConfig | null {
  const real = present(cards);
  // A section with only its heading is noise.
  if (real.length <= (noHeading ? 0 : 1)) return null;
  return { type: "grid", cards: real, ...(columnSpan ? { column_span: columnSpan } : {}) };
}

/** Bars of the daily (or monthly) change of energy counters or degree days. */
function changeBars(
  title: string,
  entities: Entity[],
  period: "day" | "month",
  days: number,
  columns: number | "full" = "full",
): LovelaceCardConfig | null {
  return entities.length
    ? {
        type: "statistics-graph",
        title,
        entities,
        period,
        days_to_show: days,
        stat_types: ["change"],
        chart_type: "bar",
        grid_options: { columns },
      }
    : null;
}

/** Heat pump states in which an instantaneous COP means something. */
const RUNNING_STATES = ["heating", "dhw", "legionella_prevention"];

/**
 * COP gauge, shown only while the pump runs: in standby the core sensor
 * reports 0, which a red gauge would present as bad performance.
 */
function copGauge(
  cop: string | undefined,
  state: string | undefined,
  t: Localize,
): LovelaceCardConfig | null {
  if (!cop) return null;
  const gauge = {
    type: "gauge",
    entity: cop,
    name: t("cop"),
    min: 0,
    max: 7,
    needle: true,
    severity: { red: 0, yellow: 3, green: 4 },
  };
  if (!state) return gauge;
  return {
    type: "conditional",
    conditions: [{ condition: "state", entity: state, state: RUNNING_STATES }],
    card: gauge,
  };
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
  const deltaT = present([entity(pump.insights.delta_t, t("delta_t"))]);

  const live = section([
    heading(t("live"), "mdi:heat-pump"),
    tile(w.heat_pump_state, t("state")),
    copGauge(w.cop, w.heat_pump_state, t),
    tile(room, t("room")),
    tile(outdoor, t("outdoor")),
    tile(w.water_outlet_temperature, t("supply")),
    tile(w.water_inlet_temperature, t("return")),
    tile(pump.insights.delta_t, t("delta_t_short")),
    tile(w.power_input, t("power_input_short")),
    tile(w.power_output, t("power_output_short")),
  ]);

  const day = section([
    heading(t("last_24h"), "mdi:clock-outline"),
    historyGraph(t("temperatures"), temperatures, 24),
    historyGraph(t("power"), power, 24),
    historyGraph(t("delta_t"), deltaT, 24),
    historyGraph(t("state"), present([entity(w.heat_pump_state, t("state"))]), 24),
  ]);

  // Seven days of raw history is heavy; hourly long-term statistics are not.
  // No COP here: the hourly mean of an instantaneous COP includes idle
  // periods (COP 0) and means nothing. Real COP per period is phase 2.
  const week = section([
    heading(t("last_7d"), "mdi:calendar-week"),
    statisticsGraph(t("temperatures"), temperatures, 7),
    statisticsGraph(t("power"), power, 7),
    statisticsGraph(t("delta_t"), deltaT, 7),
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

export function performanceView(pump: HeatPumpConfig, t: Localize, index: number): LovelaceViewConfig {
  const w = pump.weheat;
  const i = pump.insights;

  const headline = section([
    heading(t("scop_heading"), "mdi:chart-bar"),
    tile(i.scop_heat_pump_season, t("heat_pump")),
    tile(i.scop_season, t("total")),
    tile(i.scop_heating_season, t("heating")),
    tile(i.scop_dhw_season, t("dhw")),
    tile(i.defrost_cop_impact_season, t("defrost_loss")),
    heading(t("cop_month"), "mdi:calendar-month"),
    tile(i.cop_heat_pump_month, t("heat_pump")),
    tile(i.cop_month, t("total")),
    heading(t("cop_today"), "mdi:calendar-today"),
    tile(i.cop_heat_pump_today, t("heat_pump")),
    tile(i.cop_today, t("total")),
  ]);

  // The card has its own title, so no heading above it.
  const history = section([{ type: `custom:${PERFORMANCE_CARD_TAG}`, entry_id: pump.entry_id }], 2, true);

  const energy = section(
    [
      heading(t("energy_per_day"), "mdi:lightning-bolt"),
      changeBars(
        `${t("energy_per_day")} · ${t("electricity")}`,
        present([
          entity(w.electricity_used_heating, t("heating")),
          entity(w.electricity_used_dhw, t("dhw")),
          entity(w.electricity_used_defrost, t("defrost")),
          entity(w.electricity_used_standby, t("standby")),
        ]),
        "day",
        30,
      ),
      changeBars(
        `${t("energy_per_day")} · ${t("heat")}`,
        present([
          entity(w.energy_output_heating, t("heating")),
          entity(w.energy_output_dhw, t("dhw")),
          entity(w.energy_output_defrost, t("defrost")),
        ]),
        "day",
        30,
      ),
    ],
    2,
  );

  const about = section([heading(t("title"), "mdi:information-outline"), { type: "markdown", content: `${t("definitions")}\n\n_${t("disclaimer")}_` }]);

  return {
    title: `${pump.name} · ${t("performance")}`,
    path: index === 0 ? "performance" : `performance-${index + 1}`,
    icon: "mdi:chart-bar",
    type: "sections",
    max_columns: 4,
    sections: present([headline, history, energy, about]),
  };
}

export function houseView(pump: HeatPumpConfig, t: Localize, index: number): LovelaceViewConfig {
  const i = pump.insights;

  const house = section([
    heading(t("house"), "mdi:home-thermometer"),
    tile(i.heat_loss_coefficient, t("heat_loss_short")),
    tile(i.heat_loss_design_load, t("heat_loss_design")),
    tile(i.balance_point, t("balance_point")),
    tile(i.cool_down_time_constant, t("cool_down_tau")),
    tile(i.cool_down_rate, t("cool_down_rate")),
    tile(i.thermal_mass, t("thermal_mass")),
  ]);
  const houseCharts = section(
    [{ type: `custom:${SCATTER_CARD_TAG}`, entry_id: pump.entry_id, mode: "heat_loss" }],
    2,
    true,
  );
  const explanation = section([
    heading(t("title"), "mdi:information-outline"),
    { type: "markdown", content: `${t("house_definitions")}\n\n_${t("disclaimer")}_` },
  ]);

  const degreeDays = pump.degree_days_statistic_id
    ? { entity: pump.degree_days_statistic_id, name: t("degree_days") }
    : null;
  const weather = section([
    heading(t("heat_per_degree_day"), "mdi:home-thermometer-outline"),
    tile(i.heat_per_degree_day_season, t("this_season")),
    tile(i.heat_per_degree_day_last_year, t("last_year_to_date")),
    tile(i.heat_per_degree_day_last_season, t("whole_last_season")),
    heading(t("degree_days"), "mdi:thermometer-lines"),
    tile(i.degree_days_month, t("this_month")),
    tile(i.degree_days_season, t("this_season")),
  ]);
  // Side by side in a wide section, so both columns end at about the same height.
  const degreeDayCharts = section(
    [
      degreeDays ? changeBars(t("degree_days_per_month"), [degreeDays], "month", 400, 6) : null,
      degreeDays ? changeBars(t("degree_days_per_day"), [degreeDays], "day", 30, 6) : null,
    ],
    2,
    true,
  );

  return {
    title: `${pump.name} · ${t("house")}`,
    path: index === 0 ? "house" : `house-${index + 1}`,
    icon: "mdi:home-thermometer-outline",
    type: "sections",
    max_columns: 4,
    sections: present([house, houseCharts, weather, degreeDayCharts, explanation]),
  };
}

const CURVE_POINTS: [number, string][] = [
  [-20, "curve_advice_minus_20"],
  [9, "curve_advice_9"],
  [15, "curve_advice_15"],
  [20, "curve_advice_20"],
  [25, "curve_advice_25"],
];

/** Text safe inside a single-quoted Jinja string. */
const jinja = (text: string) => text.replace(/\\/g, "\\\\").replace(/'/g, "\\'");

/** Markdown table with a Jinja template, so it updates without a custom card. */
export function curveTable(pump: HeatPumpConfig, t: Localize): string | null {
  const rows = CURVE_POINTS.filter(([, key]) => pump.insights[key]);
  if (!rows.length) return null;
  const first = pump.insights[rows[0][1]]!;
  const deg = (expr: string) => `{{ (${expr}) ~ ' °C' if (${expr}) is not none else '–' }}`;
  const lines = [
    `{% set reason = state_attr('${first}', 'no_advice_reason') %}`,
    `**${t("curve_target")}:** {{ state_attr('${first}', 'target_room_temperature') }} °C` +
      ` · ${t("curve_measured")}: {{ state_attr('${first}', 'measured_indoor_temperature') or '–' }} °C`,
    "",
    `{% if reason %}${t("curve_no_advice")} {{ {'no_heat_loss': '${jinja(t("reason_no_heat_loss"))}', 'too_few_steady_hours': '${jinja(t("reason_too_few_steady_hours"))}'}.get(reason, reason) }}{% endif %}`,
    "",
    `| ${t("curve_outdoor")} | ${t("curve_current")} | ${t("curve_app")} | ${t("curve_portal")} | ${t("curve_range")} |`,
    "|---:|---:|---:|---:|:---|",
    ...rows.map(([outdoor, key]) => {
      const e = pump.insights[key]!;
      const value = `states('${e}') | float(none)`;
      return (
        `| ${outdoor} °C | ${deg(`state_attr('${e}', 'current')`)} | ${deg(`state_attr('${e}', 'app')`)} | ` +
        `{{ '**' ~ (${value}) ~ ' °C**' if (${value}) is not none else '–' }} | ` +
        `{% if state_attr('${e}', 'no_heat_needed') %}${t("curve_no_heat")}{% elif state_attr('${e}', 'range_low') is not none %}` +
        `{{ state_attr('${e}', 'range_low') }}–{{ state_attr('${e}', 'range_high') }} °C` +
        `{% if state_attr('${e}', 'extrapolated') %} (${t("curve_extrapolated")}){% endif %}{% endif %} |`
      );
    }),
  ];
  return lines.join("\n");
}

export function curveView(pump: HeatPumpConfig, t: Localize, index: number): LovelaceViewConfig {
  const i = pump.insights;
  const table = curveTable(pump, t);
  const advice = section([
    heading(t("curve_advice"), "mdi:chart-bell-curve-cumulative"),
    table ? { type: "markdown", content: table } : null,
  ]);
  const chart = section(
    [{ type: `custom:${SCATTER_CARD_TAG}`, entry_id: pump.entry_id, mode: "supply_curve", days: 60 }],
    2,
    true,
  );
  const comparison = section([
    heading(t("before_after"), "mdi:swap-vertical"),
    tile(i.heating_electricity_per_degree_day_before, t("per_degree_day_before")),
    tile(i.heating_electricity_per_degree_day_after, t("per_degree_day_after")),
    tile(i.heating_curve_change_effect, t("change_effect")),
  ]);
  const explanation = section([
    heading(t("title"), "mdi:information-outline"),
    { type: "markdown", content: `${t("curve_definitions")}\n\n_${t("disclaimer")}_` },
  ]);
  return {
    title: `${pump.name} · ${t("heating_curve")}`,
    path: index === 0 ? "heating-curve" : `heating-curve-${index + 1}`,
    icon: "mdi:chart-bell-curve-cumulative",
    type: "sections",
    max_columns: 4,
    sections: present([advice, chart, comparison, explanation]),
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
  return {
    title: t("title"),
    // Performance first: it is the default tab; live status second.
    views: pumps.flatMap((pump, index) => [
      performanceView(pump, t, index),
      houseView(pump, t, index),
      curveView(pump, t, index),
      pumpView(pump, t, index),
    ]),
  };
}

export function errorDashboard(t: Localize, detail: string): LovelaceConfig {
  return {
    title: t("title"),
    views: [messageView(t, t("error_title"), `${t("error_body")}\n\n\`${detail}\``)],
  };
}
