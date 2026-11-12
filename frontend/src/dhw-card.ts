/**
 * Hot-water (SWW) charts in plain SVG, fed by `weheat_insights/dhw`.
 *
 * Modes:
 *  - summary:       key figures of the last 30 days
 *  - target:        temperature the tank was heated to, per day
 *  - energy:        hot-water heat and electricity per day, with the COP
 *  - cop_target:    COP per day against the tank temperature
 *  - cop_outdoor:   COP per day against the outdoor temperature
 *  - start_hours:   at what time of day the tank is heated
 *  - standing_loss: how fast the tank cools at night, per week
 *
 * Bar charts show few days on purpose (default 14): more bars that go up
 * and down are hard to read.
 */
import { LitElement, css, html, svg, nothing, type PropertyValues, type TemplateResult } from "lit";
import { language, localizer, type Localize } from "./localize";
import { niceTicks } from "./scatter-card";
import type { HomeAssistant } from "./types";

export const DHW_CARD_TAG = "weheat-insights-dhw-card";

const MODES = ["summary", "target", "energy", "cop_target", "cop_outdoor", "start_hours", "standing_loss"] as const;
type Mode = (typeof MODES)[number];

interface DhwDay {
  day: string;
  target_c: number | null;
  top_max_c: number | null;
  setpoint_c: number | null;
  legionella: boolean;
  runs: number;
  heat_kwh: number;
  electricity_kwh: number;
  cop: number | null;
  outdoor_c: number | null;
}

interface DhwResponse {
  days: DhwDay[];
  start_hours: number[];
  start_hours_days: number;
  standing_loss: { day: string; k_per_h: number }[];
  standing_loss_weeks: { week: string; k_per_h: number }[];
  summary: {
    target_today_c: number | null;
    target_typical_c: number | null;
    runs_per_day: number | null;
    heat_per_run_kwh: number | null;
    heat_per_day_kwh: number | null;
    standing_loss_k_per_h: number | null;
    days: number;
  };
}

export interface DhwCardConfig {
  type: string;
  entry_id: string;
  mode: Mode;
  /** Days shown in a per-day bar chart (default 14) or a scatter (default 90). */
  days?: number;
  title?: string;
}

const WIDTH = 600;
const HEIGHT = 240;
const PAD = { left: 40, right: 12, top: 18, bottom: 34 };
const PLOT_W = WIDTH - PAD.left - PAD.right;
const PLOT_H = HEIGHT - PAD.top - PAD.bottom;
const REFRESH_MS = 60 * 60 * 1000;
const FETCH_DAYS = 90;

/** Least-squares line through points; null with too few or too close x's. */
export function linearFit(points: { x: number; y: number }[]): { slope: number; intercept: number } | null {
  if (points.length < 8) return null;
  const xs = points.map((p) => p.x);
  if (Math.max(...xs) - Math.min(...xs) < 3) return null;
  const mx = xs.reduce((a, b) => a + b, 0) / xs.length;
  const my = points.reduce((a, p) => a + p.y, 0) / points.length;
  let sxy = 0;
  let sxx = 0;
  for (const p of points) {
    sxy += (p.x - mx) * (p.y - my);
    sxx += (p.x - mx) ** 2;
  }
  const slope = sxy / sxx;
  return { slope, intercept: my - slope * mx };
}

/** Cold (blue) to warm (red) for an outdoor temperature. */
function outdoorColor(value: number | null): string {
  if (value == null) return "var(--disabled-text-color, #9e9e9e)";
  const t = Math.min(1, Math.max(0, (value + 5) / 25));
  return `hsl(${(220 - 220 * t).toFixed(0)} 70% 50%)`;
}

interface Bar {
  label: string;
  value: number | null;
  cls?: string;
  /** Second, narrower bar drawn inside this one. */
  inner?: number | null;
  /** Text above the bar. */
  note?: string;
  /** Short horizontal marker (for example a set point). */
  marker?: number | null;
  tip: string;
}

export class WeheatInsightsDhwCard extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
    _data: { state: true },
    _error: { state: true },
  };

  hass?: HomeAssistant;
  private _config?: DhwCardConfig;
  private _data?: DhwResponse;
  private _error?: string;
  private _timer?: number;
  private _fetchedKey?: string;

  setConfig(config: DhwCardConfig): void {
    if (!config.entry_id) throw new Error("entry_id is required");
    if (!MODES.includes(config.mode)) throw new Error(`mode must be one of ${MODES.join(", ")}`);
    this._config = config;
    this._data = undefined;
  }

  getCardSize(): number {
    return this._config?.mode === "summary" ? 2 : 5;
  }

  getGridOptions() {
    return { columns: "full", min_rows: this._config?.mode === "summary" ? 2 : 4 };
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
    if (changed.has("hass") || changed.has("_config")) this._fetch(false);
  }

  private async _fetch(force: boolean): Promise<void> {
    if (!this.hass || !this._config) return;
    const days = Math.max(FETCH_DAYS, this._config.days ?? 0);
    const key = `${this._config.entry_id}:${days}`;
    if (!force && key === this._fetchedKey) return;
    this._fetchedKey = key;
    try {
      this._data = await this.hass.callWS<DhwResponse>({
        type: "weheat_insights/dhw",
        entry_id: this._config.entry_id,
        days: Math.min(days, 365),
      });
      this._error = undefined;
    } catch (err) {
      this._error = err instanceof Error ? err.message : JSON.stringify(err);
    }
  }

  protected render() {
    if (!this.hass || !this._config) return nothing;
    const t = localizer(this.hass);
    const mode = this._config.mode;
    const title = this._config.title ?? (mode === "summary" ? null : t(`dhw_${mode}_title` as never));
    return html`<ha-card>
      ${title ? html`<div class="title">${title}</div>` : nothing}
      ${this._error
        ? html`<div class="message">${this._error}</div>`
        : !this._data
          ? html`<div class="message">…</div>`
          : this._renderMode(mode, this._data, t)}
    </ha-card>`;
  }

  private _fmt(digits: number) {
    return new Intl.NumberFormat(language(this.hass!), {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    });
  }

  private _dayLabel(day: string, weekday = true): string {
    const date = new Date(`${day}T12:00:00`);
    return date.toLocaleDateString(language(this.hass!), weekday ? { weekday: "short", day: "numeric" } : { day: "numeric", month: "short" });
  }

  private _recent(data: DhwResponse, fallback: number): DhwDay[] {
    return data.days.slice(-(this._config!.days ?? fallback));
  }

  private _renderMode(mode: Mode, data: DhwResponse, t: Localize) {
    switch (mode) {
      case "summary":
        return this._renderSummary(data, t);
      case "target":
        return this._renderTarget(data, t);
      case "energy":
        return this._renderEnergy(data, t);
      case "cop_target":
        return this._renderCopScatter(data, t, "target");
      case "cop_outdoor":
        return this._renderCopScatter(data, t, "outdoor");
      case "start_hours":
        return this._renderStartHours(data, t);
      case "standing_loss":
        return this._renderStandingLoss(data, t);
    }
  }

  // -- summary --------------------------------------------------------------

  private _renderSummary(data: DhwResponse, t: Localize) {
    const s = data.summary;
    const f0 = this._fmt(0);
    const f1 = this._fmt(1);
    const f2 = this._fmt(2);
    const value = (v: number | null, fmt: Intl.NumberFormat, unit: string) =>
      v == null ? "—" : `${fmt.format(v)} ${unit}`;
    const items: [string, string, string][] = [
      ["mdi:thermometer-water", t("dhw_target_today"), value(s.target_today_c, f0, "°C")],
      ["mdi:thermometer-check", t("dhw_target_typical"), value(s.target_typical_c, f0, "°C")],
      ["mdi:counter", t("dhw_runs_per_day"), value(s.runs_per_day, f1, "×")],
      ["mdi:water-boiler", t("dhw_heat_per_run"), value(s.heat_per_run_kwh, f1, "kWh")],
      ["mdi:fire", t("dhw_heat_per_day"), value(s.heat_per_day_kwh, f1, "kWh")],
      ["mdi:thermometer-minus", t("dhw_standing_loss"), value(s.standing_loss_k_per_h, f2, "K/h")],
    ];
    return html`<div class="stats">
        ${items.map(
          ([icon, label, text]) => html`<div class="stat">
            <ha-icon .icon=${icon}></ha-icon>
            <div><div class="stat-value">${text}</div><div class="stat-label">${label}</div></div>
          </div>`,
        )}
      </div>
      <div class="note">${t("dhw_summary_note").replace("{days}", String(s.days))}</div>`;
  }

  // -- per-day bars -----------------------------------------------------------

  private _renderTarget(data: DhwResponse, t: Localize) {
    const days = this._recent(data, 14);
    const f = this._fmt(0);
    const bars: Bar[] = days.map((d) => ({
      label: this._dayLabel(d.day),
      value: d.target_c,
      cls: d.legionella ? "legionella" : "target",
      note: d.target_c == null ? "" : f.format(d.target_c),
      marker: d.setpoint_c,
      tip: `${d.day}: ${d.target_c == null ? "—" : `${f.format(d.target_c)} °C`}${d.legionella ? ` (${t("legionella")})` : ""}`,
    }));
    const values = days.map((d) => d.target_c).filter((v): v is number => v != null);
    if (!values.length) return html`<div class="message">${t("no_data")}</div>`;
    // Start the axis below the lowest bar: from 0 the differences disappear.
    const low = Math.floor((Math.min(...values) - 6) / 5) * 5;
    const hasSetpoint = days.some((d) => d.setpoint_c != null);
    return html`${this._bars(bars, { min: Math.max(0, low), unit: "°C" })}
      <div class="legend">
        <span><i class="swatch target"></i>${t("dhw_tank_temperature")}</span>
        ${days.some((d) => d.legionella) ? html`<span><i class="swatch legionella"></i>${t("legionella")}</span>` : nothing}
        ${hasSetpoint ? html`<span><i class="tick"></i>${t("dhw_setpoint")}</span>` : nothing}
      </div>`;
  }

  private _renderEnergy(data: DhwResponse, t: Localize) {
    const days = this._recent(data, 14);
    const f1 = this._fmt(1);
    const bars: Bar[] = days.map((d) => ({
      label: this._dayLabel(d.day),
      value: d.heat_kwh,
      inner: d.electricity_kwh,
      cls: "heat",
      note: d.cop == null ? "" : f1.format(d.cop),
      tip: `${d.day}: ${f1.format(d.heat_kwh)} kWh ${t("dhw_heat").toLowerCase()}, ${f1.format(d.electricity_kwh)} kWh ${t("dhw_electricity").toLowerCase()}${d.cop == null ? "" : `, COP ${f1.format(d.cop)}`}`,
    }));
    return html`${this._bars(bars, { min: 0, unit: "kWh" })}
      <div class="legend">
        <span><i class="swatch heat"></i>${t("dhw_heat")}</span>
        <span><i class="swatch electricity"></i>${t("dhw_electricity")}</span>
        <span>${t("dhw_numbers_cop")}</span>
      </div>`;
  }

  private _renderStartHours(data: DhwResponse, t: Localize) {
    const bars: Bar[] = data.start_hours.map((count, hour) => ({
      label: hour % 3 === 0 ? String(hour) : "",
      value: count,
      cls: "target",
      tip: `${String(hour).padStart(2, "0")}:00–${String(hour).padStart(2, "0")}:59: ${count}×`,
    }));
    if (!data.start_hours.some((c) => c > 0)) return html`<div class="message">${t("no_data")}</div>`;
    return html`${this._bars(bars, { min: 0, unit: "×", integer: true })}
      <div class="note">${t("dhw_start_hours_note").replace("{days}", String(data.start_hours_days))}</div>`;
  }

  private _renderStandingLoss(data: DhwResponse, t: Localize) {
    const weeks = data.standing_loss_weeks.slice(-12);
    if (!weeks.length) return html`<div class="message">${t("dhw_standing_loss_none")}</div>`;
    const f = this._fmt(2);
    const bars: Bar[] = weeks.map((w) => ({
      label: this._dayLabel(w.week, false),
      value: w.k_per_h,
      cls: "loss",
      note: f.format(w.k_per_h),
      tip: `${t("dhw_week_of")} ${w.week}: ${f.format(w.k_per_h)} K/h`,
    }));
    return html`${this._bars(bars, { min: 0, unit: "K/h" })}
      <div class="note">${t("dhw_standing_loss_note")}</div>`;
  }

  private _bars(bars: Bar[], opts: { min: number; unit: string; integer?: boolean }): TemplateResult {
    const tops = bars.flatMap((b) => [b.value ?? opts.min, b.marker ?? opts.min]);
    let ticks = niceTicks(opts.min, Math.max(opts.min + (opts.integer ? 3 : 1), ...tops), 5);
    if (opts.integer) ticks = ticks.filter((v) => Number.isInteger(v));
    const [y0, y1] = [ticks[0], ticks[ticks.length - 1]];
    const sy = (v: number) => PAD.top + PLOT_H - ((Math.min(y1, Math.max(y0, v)) - y0) / (y1 - y0)) * PLOT_H;
    const slot = PLOT_W / bars.length;
    const width = Math.min(34, slot * 0.7);
    const tickFmt = new Intl.NumberFormat(language(this.hass!), { maximumFractionDigits: 2 });
    return html`<svg viewBox="0 0 ${WIDTH} ${HEIGHT}" role="img">
      ${ticks.map(
        (v) => svg`<line class="grid" x1=${PAD.left} x2=${WIDTH - PAD.right} y1=${sy(v)} y2=${sy(v)}></line>
          <text class="axis" x=${PAD.left - 6} y=${sy(v) + 4} text-anchor="end">${tickFmt.format(v)}</text>`,
      )}
      <text class="axis" x=${PAD.left - 6} y=${PAD.top - 6} text-anchor="end">${opts.unit}</text>
      ${bars.map((b, i) => {
        const cx = PAD.left + slot * (i + 0.5);
        const bar =
          b.value == null
            ? nothing
            : svg`<rect class="bar ${b.cls ?? ""}" x=${cx - width / 2} y=${sy(b.value)} width=${width} height=${Math.max(0, sy(y0) - sy(b.value))} rx="2"><title>${b.tip}</title></rect>`;
        const inner =
          b.inner == null || b.inner <= 0
            ? nothing
            : svg`<rect class="bar electricity" x=${cx - width / 4} y=${sy(b.inner)} width=${width / 2} height=${Math.max(0, sy(y0) - sy(b.inner))} rx="1"><title>${b.tip}</title></rect>`;
        const marker =
          b.marker == null
            ? nothing
            : svg`<line class="marker" x1=${cx - width / 2 - 3} x2=${cx + width / 2 + 3} y1=${sy(b.marker)} y2=${sy(b.marker)}></line>`;
        const note =
          b.note && b.value != null
            ? svg`<text class="note-text" x=${cx} y=${sy(b.value) - 4} text-anchor="middle">${b.note}</text>`
            : nothing;
        return svg`${bar}${inner}${marker}${note}
          <text class="axis" x=${cx} y=${PAD.top + PLOT_H + 16} text-anchor="middle">${b.label}</text>`;
      })}
    </svg>`;
  }

  // -- scatter ----------------------------------------------------------------

  private _renderCopScatter(data: DhwResponse, t: Localize, against: "target" | "outdoor") {
    const days = this._recent(data, 90).filter((d) => d.cop != null && (against === "target" ? d.target_c : d.outdoor_c) != null);
    if (days.length < 3) return html`<div class="message">${t("no_data")}</div>`;
    const f1 = this._fmt(1);
    const points = days.map((d) => ({
      x: (against === "target" ? d.target_c : d.outdoor_c) as number,
      y: d.cop as number,
      d,
    }));
    const clean = points.filter((p) => !p.d.legionella);
    const fit = linearFit(clean);
    // Draw the fit only where its days are, not out to the legionella days.
    const fitFrom = Math.min(...clean.map((p) => p.x));
    const fitTo = Math.max(...clean.map((p) => p.x));
    const xTicks = niceTicks(Math.min(...points.map((p) => p.x)), Math.max(...points.map((p) => p.x)), 6);
    // Not from 0: the spread between days is what matters here.
    const yTicks = niceTicks(Math.min(...points.map((p) => p.y)) - 0.3, Math.max(...points.map((p) => p.y)) + 0.2, 5);
    const [x0, x1] = [xTicks[0], xTicks[xTicks.length - 1]];
    const [y0, y1] = [yTicks[0], yTicks[yTicks.length - 1]];
    const sx = (v: number) => PAD.left + ((v - x0) / (x1 - x0)) * PLOT_W;
    const sy = (v: number) => PAD.top + PLOT_H - ((v - y0) / (y1 - y0)) * PLOT_H;
    const color = (d: DhwDay) =>
      against === "target"
        ? outdoorColor(d.outdoor_c)
        : `hsl(${(220 - 220 * Math.min(1, Math.max(0, ((d.target_c ?? 50) - 45) / 15))).toFixed(0)} 70% 50%)`;
    const unit = "°C";
    const fitText = fit
      ? (against === "target" ? t("dhw_fit_target") : t("dhw_fit_outdoor")).replace(
          "{value}",
          new Intl.NumberFormat(language(this.hass!), { maximumFractionDigits: 2, signDisplay: "always" }).format(fit.slope),
        )
      : null;
    return html`${fitText ? html`<div class="summary">${fitText}</div>` : nothing}
      <svg viewBox="0 0 ${WIDTH} ${HEIGHT + 10}" role="img">
        ${yTicks.map(
          (v) => svg`<line class="grid" x1=${PAD.left} x2=${WIDTH - PAD.right} y1=${sy(v)} y2=${sy(v)}></line>
            <text class="axis" x=${PAD.left - 6} y=${sy(v) + 4} text-anchor="end">${v}</text>`,
        )}
        ${xTicks.map(
          (v) => svg`<line class="grid" x1=${sx(v)} x2=${sx(v)} y1=${PAD.top} y2=${PAD.top + PLOT_H}></line>
            <text class="axis" x=${sx(v)} y=${PAD.top + PLOT_H + 16} text-anchor="middle">${v}</text>`,
        )}
        <text class="axis" x=${PAD.left - 6} y=${PAD.top - 6} text-anchor="end">COP</text>
        <text class="label" x=${PAD.left + PLOT_W / 2} y=${HEIGHT + 6} text-anchor="middle"
          >${against === "target" ? `${t("dhw_tank_temperature")} (°C)` : t("outdoor_temp")}</text
        >
        ${points.map(
          (p) => svg`<circle class=${p.d.legionella ? "hollow" : ""} cx=${sx(p.x)} cy=${sy(p.y)} r="4.5"
            style=${p.d.legionella ? `stroke:${color(p.d)}` : `fill:${color(p.d)}`}>
            <title>${p.d.day}: COP ${f1.format(p.y)}, ${f1.format(p.x)} ${unit}${p.d.legionella ? ` (${t("legionella")})` : ""}</title>
          </circle>`,
        )}
        ${fit
          ? svg`<line class="fit" x1=${sx(fitFrom)} y1=${sy(fit.intercept + fit.slope * fitFrom)} x2=${sx(fitTo)} y2=${sy(fit.intercept + fit.slope * fitTo)}></line>`
          : nothing}
      </svg>
      <div class="legend">
        <span>${against === "target" ? t("dhw_color_outdoor") : t("dhw_color_target")}</span>
        <i class="gradient"></i>
        ${points.some((p) => p.d.legionella) ? html`<span><i class="ring"></i>${t("legionella")}</span>` : nothing}
      </div>`;
  }

  static styles = css`
    ha-card {
      padding: 12px 16px;
    }
    .title {
      font-size: var(--ha-card-header-font-size, 24px);
      line-height: 1.3;
    }
    .summary {
      margin-top: 4px;
      color: var(--primary-text-color);
      font-size: 14px;
    }
    .message,
    .note {
      color: var(--secondary-text-color);
      font-size: 13px;
      margin-top: 4px;
    }
    .message {
      padding: 16px 0;
      text-align: center;
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
    .axis,
    .label {
      fill: var(--secondary-text-color);
      font-size: 11px;
    }
    .note-text {
      fill: var(--primary-text-color);
      font-size: 11px;
    }
    rect.bar.target,
    .swatch.target {
      fill: var(--blue-color, #2196f3);
      background: var(--blue-color, #2196f3);
    }
    rect.bar.legionella,
    .swatch.legionella {
      fill: var(--purple-color, #9c27b0);
      background: var(--purple-color, #9c27b0);
    }
    rect.bar.heat,
    .swatch.heat {
      fill: var(--orange-color, #ff9800);
      background: var(--orange-color, #ff9800);
      fill-opacity: 0.55;
    }
    rect.bar.electricity,
    .swatch.electricity {
      fill: var(--blue-color, #2196f3);
      background: var(--blue-color, #2196f3);
    }
    rect.bar.loss {
      fill: var(--teal-color, #009688);
    }
    line.marker {
      stroke: var(--primary-text-color);
      stroke-width: 2;
    }
    line.fit {
      stroke: var(--primary-text-color);
      stroke-width: 2;
      stroke-dasharray: 6 4;
    }
    circle {
      fill-opacity: 0.85;
    }
    circle.hollow {
      fill: none;
      stroke-width: 2;
    }
    .legend {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      justify-content: center;
      align-items: center;
      font-size: 13px;
      color: var(--secondary-text-color);
      margin-top: 4px;
    }
    .swatch {
      display: inline-block;
      width: 12px;
      height: 12px;
      border-radius: 2px;
      margin-right: 6px;
      vertical-align: middle;
    }
    .tick {
      display: inline-block;
      width: 14px;
      height: 2px;
      background: var(--primary-text-color);
      margin-right: 6px;
      vertical-align: middle;
    }
    .ring {
      display: inline-block;
      width: 9px;
      height: 9px;
      border-radius: 50%;
      border: 2px solid var(--secondary-text-color);
      margin-right: 6px;
      vertical-align: middle;
    }
    .gradient {
      display: inline-block;
      width: 80px;
      height: 8px;
      border-radius: 4px;
      background: linear-gradient(90deg, hsl(220 70% 50%), hsl(110 70% 50%), hsl(0 70% 50%));
    }
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 12px;
      margin-top: 4px;
    }
    .stat {
      display: flex;
      gap: 10px;
      align-items: center;
    }
    .stat ha-icon {
      color: var(--state-icon-color, var(--secondary-text-color));
    }
    .stat-value {
      font-size: 18px;
      font-weight: 500;
    }
    .stat-label {
      font-size: 12px;
      color: var(--secondary-text-color);
    }
  `;
}
