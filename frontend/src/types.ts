/** Minimal Home Assistant frontend types used by the strategy. */

export interface HomeAssistant {
  language: string;
  locale?: { language: string };
  callWS<T>(msg: { type: string; [key: string]: unknown }): Promise<T>;
}

export type LovelaceCardConfig = { type: string; [key: string]: unknown };

export interface LovelaceSectionConfig {
  type: "grid";
  column_span?: number;
  cards: LovelaceCardConfig[];
}

export interface LovelaceViewConfig {
  title: string;
  path: string;
  icon?: string;
  type?: "sections" | "panel" | "masonry";
  max_columns?: number;
  sections?: LovelaceSectionConfig[];
  cards?: LovelaceCardConfig[];
}

export interface LovelaceConfig {
  title?: string;
  views: LovelaceViewConfig[];
}

/** Shape of the `weheat_insights/dashboard_config` WebSocket response. */
export interface HeatPumpConfig {
  entry_id: string;
  uuid: string;
  name: string;
  model: string | null;
  has_dhw: boolean;
  /** Core Weheat entities, keyed by the core integration's entity key. */
  weheat: Partial<Record<string, string>>;
  /** Our own derived entities, keyed by our entity key. */
  insights: Partial<Record<string, string>>;
  outdoor_entity_id: string | null;
  indoor_entity_id: string | null;
}

export interface DashboardConfigResponse {
  heat_pumps: HeatPumpConfig[];
}
