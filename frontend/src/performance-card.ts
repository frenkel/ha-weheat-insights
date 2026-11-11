/**
 * COP per day, month or season, drawn as grouped bars in plain SVG.
 *
 * The backend computes the figures (weheat_insights/performance_history) so
 * the COP definitions live in one place; this card only draws them.
 */
import { LitElement, css, html, svg, nothing, type PropertyValues } from "lit";
import { language, localizer, type Localize } from "./localize";
import type { HomeAssistant } from "./types";

export const PERFORMANCE_CARD_TAG = "weheat-insights-performance-card";

type Kind = "day" | "month" | "season";

interface PeriodRow {
  start: string;
  end: string;
  cop: number | null;
  cop_heat_pump: number | null;
  cop_heating: number | null;
  cop_dhw: number | null;
  electricity_kwh: number;
  heat_kwh: number;
  heat_pump_electricity_kwh: number;
  standby_kwh: number;
  indoor_unit_kwh: number;
  heating_electricity_kwh: number;
  heating_heat_kwh: number;
  dhw_electricity_kwh: number;
  dhw_heat_kwh: number;
}

interface HistoryResponse {
  period: Kind;
  has_dhw: boolean;
  periods: PeriodRow[];
}

export interface PerformanceCardConfig {
  type: string;
  entry_id: string;
  period?: Kind;
  title?: string;
}

const WIDTH = 600;
const HEIGHT = 220;
const PAD = { left: 30, right: 8, top: 10, bottom: 26 };
const REFRESH_MS = 15 * 60 * 1000;

const fmt = (value: number | null, digits = 2) => (value == null ? "–" : value.toFixed(digits));

function label(row: PeriodRow, kind: Kind, lang: string): string {
  const start = new Date(`${row.start}T12:00:00`);
  if (kind === "day") return String(start.getDate());
  if (kind === "month") return start.toLocaleDateString(lang, { month: "short" });
  const end = new Date(`${row.end}T12:00:00`);
  const endYear = end.getMonth() === 0 ? end.getFullYear() - 1 : end.getFullYear();
  return endYear === start.getFullYear()
    ? String(start.getFullYear())
    : `${start.getFullYear()}/${String(endYear).slice(2)}`;
}

function fullLabel(row: PeriodRow, kind: Kind, lang: string): string {
  const start = new Date(`${row.start}T12:00:00`);
  if (kind === "day") return start.toLocaleDateString(lang, { weekday: "short", day: "numeric", month: "long" });
  if (kind === "month") return start.toLocaleDateString(lang, { month: "long", year: "numeric" });
  return label(row, kind, lang);
}

export class WeheatInsightsPerformanceCard extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
    _kind: { state: true },
    _data: { state: true },
    _error: { state: true },
  };

  hass?: HomeAssistant;
  private _config?: PerformanceCardConfig;
  private _kind: Kind = "month";
  private _data?: HistoryResponse;
  private _error?: string;
  private _timer?: number;
  private _fetchedKey?: string;

  setConfig(config: PerformanceCardConfig): void {
    if (!config.entry_id) throw new Error("entry_id is required");
    this._config = config;
    this._kind = config.period ?? "month";
  }

  getCardSize(): number {
    return 5;
  }

  getGridOptions() {
    return { columns: "full", min_rows: 4 };
  }

  connectedCallback(): void {
    super.connectedCallback();
    this._timer = window.setInterval(() => this._fetch(true), REFRESH_MS);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.clearInterval(this._timer);
  }

  protected willUpdate(changed: PropertyValues): void {
    if (changed.has("hass") || changed.has("_kind") || changed.has("_config")) this._fetch(false);
  }

  private async _fetch(force: boolean): Promise<void> {
    if (!this.hass || !this._config) return;
    const key = `${this._config.entry_id}:${this._kind}`;
    if (!force && key === this._fetchedKey) return;
    this._fetchedKey = key;
    try {
      this._data = await this.hass.callWS<HistoryResponse>({
        type: "weheat_insights/performance_history",
        entry_id: this._config.entry_id,
        period: this._kind,
      });
      this._error = undefined;
    } catch (err) {
      this._error = err instanceof Error ? err.message : JSON.stringify(err);
    }
  }

  protected render() {
    if (!this.hass || !this._config) return nothing;
    const t = localizer(this.hass);
    return html`
      <ha-card>
        <div class="header">
          <div class="title">${this._config.title ?? t("cop_history")}</div>
          <div class="kinds" role="tablist">
            ${(["day", "month", "season"] as Kind[]).map(
              (kind) => html`<button
                role="tab"
                aria-selected=${kind === this._kind}
                class=${kind === this._kind ? "active" : ""}
                @click=${() => (this._kind = kind)}
              >
                ${t(kind)}
              </button>`,
            )}
          </div>
        </div>
        <div class="content">${this._renderBody(t)}</div>
      </ha-card>
    `;
  }

  private _renderBody(t: Localize) {
    if (this._error) return html`<div class="message">${this._error}</div>`;
    const data = this._data;
    if (!data || data.period !== this._kind) return html`<div class="message">…</div>`;
    if (!data.periods.some((row) => row.cop != null)) return html`<div class="message">${t("no_data")}</div>`;
    return html`${this._renderChart(data, t)}${this._renderLegend(data, t)}`;
  }

  private _renderChart(data: HistoryResponse, t: Localize) {
    const lang = language(this.hass!);
    // Start at the first period with data: before that there is no history
    // (e.g. the core Weheat integration was installed recently).
    const first = data.periods.findIndex((row) => row.cop != null || row.cop_heat_pump != null);
    const rows = data.periods.slice(Math.max(0, first));
    const values = rows.flatMap((r) => [r.cop_heat_pump, r.cop, r.cop_heating, data.has_dhw ? r.cop_dhw : null]);
    const max = Math.max(5, Math.ceil(Math.max(...values.map((v) => v ?? 0)) + 0.5));
    const plotW = WIDTH - PAD.left - PAD.right;
    const plotH = HEIGHT - PAD.top - PAD.bottom;
    const y = (v: number) => PAD.top + plotH - (Math.max(0, v) / max) * plotH;
    const group = plotW / rows.length;
    const series = data.has_dhw ? 2 : 1;
    const barW = Math.max(2, Math.min(28, (group * 0.75) / series));
    const step = max > 8 ? 2 : 1;
    const labelEvery = Math.ceil(rows.length / 12);

    const grid = [];
    for (let v = 0; v <= max; v += step) {
      grid.push(svg`<line class="grid" x1=${PAD.left} x2=${WIDTH - PAD.right} y1=${y(v)} y2=${y(v)}></line>
        <text class="axis" x=${PAD.left - 6} y=${y(v) + 4} text-anchor="end">${v}</text>`);
    }

    const bar = (value: number | null, x: number, cls: string) =>
      value == null ? nothing : svg`<rect class=${cls} x=${x} y=${y(value)} width=${barW} height=${y(0) - y(value)} rx="2"></rect>`;

    const marker = (value: number | null, x: number, cls: string) =>
      value == null
        ? nothing
        : svg`<line class=${cls} x1=${x - 2} x2=${x + barW * series + 2} y1=${y(value)} y2=${y(value)}></line>`;

    const groups = rows.map((row, i) => {
      const x0 = PAD.left + i * group + (group - barW * series) / 2;
      const cx = PAD.left + i * group + group / 2;
      const tip = [
        fullLabel(row, data.period, lang),
        `${t("heat_pump")}: ${fmt(row.cop_heat_pump)} (${fmt(row.heat_kwh, 1)} kWh ${t("heat")} / ${fmt(row.heat_pump_electricity_kwh, 1)} kWh ${t("electricity")})`,
        `${t("total")}: ${fmt(row.cop)} (+ ${fmt(row.standby_kwh, 1)} kWh ${t("standby").toLowerCase()}, + ${fmt(row.indoor_unit_kwh, 1)} kWh ${t("pumps")})`,
        `${t("heating")}: ${fmt(row.cop_heating)} (${fmt(row.heating_heat_kwh, 1)} / ${fmt(row.heating_electricity_kwh, 1)} kWh)`,
        ...(data.has_dhw
          ? [`${t("dhw")}: ${fmt(row.cop_dhw)} (${fmt(row.dhw_heat_kwh, 1)} / ${fmt(row.dhw_electricity_kwh, 1)} kWh)`]
          : []),
      ].join("\n");
      return svg`<g>
        <title>${tip}</title>
        <rect class="hit" x=${PAD.left + i * group} y=${PAD.top} width=${group} height=${plotH}></rect>
        ${bar(row.cop_heating, x0, "heating")}
        ${data.has_dhw ? bar(row.cop_dhw, x0 + barW, "dhw") : nothing}
        ${marker(row.cop_heat_pump, x0, "heat-pump")}
        ${marker(row.cop, x0, "total")}
        ${i % labelEvery === 0 ? svg`<text class="axis" x=${cx} y=${HEIGHT - 8} text-anchor="middle">${label(row, data.period, lang)}</text>` : nothing}
      </g>`;
    });

    return html`<svg viewBox="0 0 ${WIDTH} ${HEIGHT}" role="img" aria-label=${t("cop_history")}>
      ${grid}${groups}
    </svg>`;
  }

  private _renderLegend(data: HistoryResponse, t: Localize) {
    return html`<div class="legend">
      <span><i class="swatch heating"></i>${t("heating")}</span>
      ${data.has_dhw ? html`<span><i class="swatch dhw"></i>${t("dhw")}</span>` : nothing}
      <span><i class="swatch heat-pump"></i>${t("heat_pump")}</span>
      <span><i class="swatch total"></i>${t("total")}</span>
    </div>`;
  }

  static styles = css`
    ha-card {
      padding: 12px 16px 12px;
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      flex-wrap: wrap;
    }
    .title {
      font-size: var(--ha-card-header-font-size, 24px);
      line-height: 1.3;
    }
    .kinds {
      display: inline-flex;
      border: 1px solid var(--divider-color);
      border-radius: 16px;
      overflow: hidden;
    }
    .kinds button {
      background: none;
      border: 0;
      color: var(--primary-text-color);
      font: inherit;
      font-size: 13px;
      padding: 4px 12px;
      cursor: pointer;
    }
    .kinds button.active {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    svg {
      width: 100%;
      height: auto;
      display: block;
      margin-top: 8px;
    }
    .grid {
      stroke: var(--divider-color);
      stroke-width: 1;
    }
    .axis {
      fill: var(--secondary-text-color);
      font-size: 11px;
    }
    .hit {
      fill: transparent;
    }
    g:hover .hit {
      fill: var(--secondary-background-color);
      opacity: 0.5;
    }
    .heating {
      fill: var(--orange-color, #ff9800);
    }
    .dhw {
      fill: var(--blue-color, #2196f3);
    }
    line.heat-pump {
      stroke: var(--primary-text-color);
      stroke-width: 2.5;
      stroke-linecap: round;
    }
    line.total {
      stroke: var(--error-color, #db4437);
      stroke-width: 2.5;
      stroke-linecap: round;
      stroke-dasharray: 4 3;
    }
    .legend {
      display: flex;
      gap: 16px;
      justify-content: center;
      font-size: 13px;
      color: var(--secondary-text-color);
      margin-top: 4px;
    }
    .swatch {
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 2px;
      margin-right: 6px;
      vertical-align: middle;
    }
    .swatch.heating {
      background: var(--orange-color, #ff9800);
    }
    .swatch.dhw {
      background: var(--blue-color, #2196f3);
    }
    .swatch.heat-pump {
      height: 3px;
      background: var(--primary-text-color);
    }
    .swatch.total {
      height: 3px;
      background: repeating-linear-gradient(90deg, var(--error-color, #db4437) 0 4px, transparent 4px 7px);
    }
    .message {
      padding: 24px 0;
      text-align: center;
      color: var(--secondary-text-color);
    }
  `;
}
