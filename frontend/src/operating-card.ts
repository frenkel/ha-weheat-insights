/**
 * Operating statistics at a glance: how the last 30 days were spent, and per
 * state how many periods (today / 7 days / 30 days) and how long they last.
 *
 * Reads the attributes of the integration's `operating_<state>` sensors.
 */
import { LitElement, css, html, nothing } from "lit";
import { language, localizer, type Localize } from "./localize";
import type { HomeAssistant } from "./types";

export const OPERATING_CARD_TAG = "weheat-insights-operating-card";

export const OPERATING_STATES = ["heating", "dhw", "defrost", "legionella", "standby"] as const;
type State = (typeof OPERATING_STATES)[number];

const STYLE: Record<State, { icon: string; color: string }> = {
  heating: { icon: "mdi:radiator", color: "var(--orange-color, #ff9800)" },
  dhw: { icon: "mdi:water-boiler", color: "var(--blue-color, #2196f3)" },
  defrost: { icon: "mdi:snowflake-melt", color: "var(--cyan-color, #00bcd4)" },
  legionella: { icon: "mdi:bacteria-outline", color: "var(--purple-color, #9c27b0)" },
  standby: { icon: "mdi:power-sleep", color: "var(--grey-color, #9e9e9e)" },
};

export interface OperatingCardConfig {
  type: string;
  /** Entity id of the `operating_<state>` sensor per state. */
  entities: Partial<Record<State, string>>;
  title?: string;
}

interface HassWithStates extends HomeAssistant {
  states?: Record<string, { attributes: Record<string, unknown> } | undefined>;
}

export class WeheatInsightsOperatingCard extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
  };

  hass?: HassWithStates;
  private _config?: OperatingCardConfig;

  setConfig(config: OperatingCardConfig): void {
    if (!config.entities || !Object.keys(config.entities).length) {
      throw new Error("entities is required (operating_<state> sensors per state)");
    }
    this._config = config;
  }

  getCardSize(): number {
    return 6;
  }

  getGridOptions() {
    return { columns: "full", min_rows: 5 };
  }

  private _states(): State[] {
    return OPERATING_STATES.filter((s) => this._config?.entities[s] && this._attrs(s));
  }

  private _attrs(state: State): Record<string, unknown> | undefined {
    const id = this._config?.entities[state];
    return id ? this.hass?.states?.[id]?.attributes : undefined;
  }

  private _num(state: State, key: string): number | null {
    const value = this._attrs(state)?.[key];
    return typeof value === "number" ? value : null;
  }

  protected render() {
    if (!this.hass || !this._config) return nothing;
    const t = localizer(this.hass);
    const lang = language(this.hass);
    const states = this._states();
    if (!states.length) {
      return html`<ha-card><div class="message">${t("no_data")}</div></ha-card>`;
    }
    // Share of the time that was actually tracked: in the first weeks the
    // 30-day window is not yet covered, so raw shares add up to less than 100.
    const raw = states.map((s) => ({ s, value: this._num(s, "30d_hours") ?? 0 }));
    const total = raw.reduce((sum, x) => sum + x.value, 0) || 1;
    const share = raw.map(({ s, value }) => ({ s, value: (value / total) * 100 }));
    const pct = new Intl.NumberFormat(lang, { maximumFractionDigits: 0 });
    const minutes = new Intl.NumberFormat(lang, { maximumFractionDigits: 0 });
    const label = (s: State) => (s === "standby" ? t("standby") : t(s as never));

    return html`<ha-card>
      ${this._config.title ? html`<div class="title">${this._config.title}</div>` : nothing}
      <div class="subtitle">${t("op_share_30d")}</div>
      <div class="bar" role="img" aria-label=${t("op_share_30d")}>
        ${share.map(
          ({ s, value }) =>
            html`<span
              style="width:${value}%;background:${STYLE[s].color}"
              title="${label(s)}: ${pct.format(value)} %"
            ></span>`,
        )}
      </div>
      <div class="legend">
        ${share.map(
          ({ s, value }) =>
            html`<span><i style="background:${STYLE[s].color}"></i>${label(s)} ${pct.format(value)}&nbsp;%</span>`,
        )}
      </div>

      <div class="rows">
        <div class="row header">
          <span></span>
          <span></span>
          <span class="count">${t("op_today")}</span>
          <span class="count">${t("op_7d")}</span>
          <span class="count">${t("op_30d")}</span>
        </div>
        ${states.map((s) => this._row(s, label(s), t, minutes))}
      </div>
    </ha-card>`;
  }

  private _row(s: State, name: string, t: Localize, minutes: Intl.NumberFormat) {
    const avg = this._num(s, "30d_avg_minutes");
    const min = this._num(s, "30d_min_minutes");
    const max = this._num(s, "30d_max_minutes");
    const range =
      min == null || max == null || Math.round(min) === Math.round(max)
        ? ""
        : ` · ${minutes.format(min)}–${minutes.format(max)} min`;
    const detail = avg == null ? t("op_no_periods") : `${t("op_avg_short")} ${minutes.format(avg)} min${range}`;
    return html`<div class="row">
      <ha-icon .icon=${STYLE[s].icon} style="color:${STYLE[s].color}"></ha-icon>
      <span class="name">
        <span>${name}</span>
        <span class="detail">${detail}</span>
      </span>
      <span class="count big">${this._num(s, "today_count") ?? "–"}</span>
      <span class="count big">${this._num(s, "7d_count") ?? "–"}</span>
      <span class="count big">${this._num(s, "30d_count") ?? "–"}</span>
    </div>`;
  }

  static styles = css`
    ha-card {
      padding: 16px;
    }
    .title {
      font-size: var(--ha-card-header-font-size, 24px);
      line-height: 1.3;
      margin-bottom: 8px;
    }
    .subtitle {
      color: var(--secondary-text-color);
      font-size: 13px;
      margin-bottom: 6px;
    }
    .bar {
      display: flex;
      height: 14px;
      border-radius: 7px;
      overflow: hidden;
      background: var(--divider-color);
    }
    .bar span {
      display: block;
      height: 100%;
    }
    .legend {
      display: flex;
      flex-wrap: wrap;
      gap: 4px 14px;
      margin-top: 8px;
      font-size: 13px;
      color: var(--secondary-text-color);
    }
    .legend span {
      white-space: nowrap;
    }
    .legend i {
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 2px;
      margin-right: 6px;
      vertical-align: middle;
    }
    .rows {
      margin-top: 16px;
      display: grid;
      row-gap: 10px;
    }
    .row {
      display: grid;
      grid-template-columns: 32px 1fr repeat(3, minmax(56px, auto));
      align-items: center;
      column-gap: 12px;
    }
    .row.header {
      color: var(--secondary-text-color);
      font-size: 12px;
    }
    .name {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }
    .detail {
      color: var(--secondary-text-color);
      font-size: 12px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .count {
      text-align: right;
      white-space: nowrap;
    }
    .big {
      font-size: 20px;
      font-weight: 500;
      font-variant-numeric: tabular-nums;
    }
    .message {
      padding: 24px 0;
      text-align: center;
      color: var(--secondary-text-color);
    }
  `;
}
