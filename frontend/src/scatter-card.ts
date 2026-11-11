/**
 * Scatter charts in plain SVG:
 *  - mode "heat_loss": daily heating heat vs indoor-outdoor difference, with fit
 *  - mode "supply_curve": hourly supply vs outdoor temperature, coloured by ΔT
 */
import { LitElement, css, html, svg, nothing, type PropertyValues } from "lit";
import { language, localizer, type Localize } from "./localize";
import type { HomeAssistant } from "./types";

export const SCATTER_CARD_TAG = "weheat-insights-scatter-card";

type Mode = "heat_loss" | "supply_curve";

interface HeatLossResponse {
  indoor_assumed: boolean;
  reason: string | null;
  days_used: number;
  coefficient_w_per_k: number | null;
  confidence_95_w_per_k: number | null;
  fit: { slope: number; intercept: number; r_squared: number } | null;
  points: { day: string; delta_k: number; heating_kwh: number; excluded: string | null }[];
}

interface CurvePoint {
  outdoor_c: number;
  supply_c: number;
  low_c?: number;
  high_c?: number;
}

interface SupplyCurveResponse {
  days: number;
  curves: { current: CurvePoint[]; advice: CurvePoint[]; reason: string | null } | null;
  points: { time: string; outdoor_c: number; supply_c: number; delta_t_k: number; heating_kwh: number }[];
}

export interface ScatterCardConfig {
  type: string;
  entry_id: string;
  mode: Mode;
  days?: number;
  title?: string;
}

interface ChartLine {
  cls: string;
  points: { x: number; y: number }[];
  band?: [{ x: number; y: number }[], { x: number; y: number }[]];
}

interface Dot {
  x: number;
  y: number;
  cls?: string;
  color?: string;
  tip: string;
}

const WIDTH = 600;
const HEIGHT = 300;
const PAD = { left: 46, right: 12, top: 12, bottom: 40 };
const REFRESH_MS = 60 * 60 * 1000;

/** Round numbers for axis ticks. */
export function niceTicks(min: number, max: number, count = 6): number[] {
  if (!isFinite(min) || !isFinite(max)) return [];
  if (min === max) {
    min -= 1;
    max += 1;
  }
  const raw = (max - min) / count;
  const magnitude = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * magnitude).find((s) => s >= raw) ?? raw;
  const ticks = [];
  for (let v = Math.floor(min / step) * step; v <= max + step * 1e-9; v += step) {
    ticks.push(Math.round(v * 1e6) / 1e6);
  }
  if (ticks[ticks.length - 1] < max) ticks.push(ticks[ticks.length - 1] + step);
  return ticks;
}

/** Piecewise-linear value of a curve at x (curves are sorted by x). */
export function curveAt(points: { x: number; y: number }[], x: number): number | null {
  if (!points.length) return null;
  if (x <= points[0].x) return points.length > 1 ? interpolate(points[0], points[1], x) : points[0].y;
  for (let i = 1; i < points.length; i++) {
    if (x <= points[i].x) return interpolate(points[i - 1], points[i], x);
  }
  const n = points.length;
  return n > 1 ? interpolate(points[n - 2], points[n - 1], x) : points[0].y;
}

function interpolate(a: { x: number; y: number }, b: { x: number; y: number }, x: number): number {
  return a.y + ((b.y - a.y) * (x - a.x)) / (b.x - a.x);
}

/** Blue (small ΔT) → green → orange → red (large ΔT). */
export function deltaColor(value: number, min: number, max: number): string {
  const t = max > min ? Math.min(1, Math.max(0, (value - min) / (max - min))) : 0.5;
  const hue = 220 - 220 * t;
  return `hsl(${hue.toFixed(0)} 75% 48%)`;
}

export class WeheatInsightsScatterCard extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
    _data: { state: true },
    _error: { state: true },
  };

  hass?: HomeAssistant;
  private _config?: ScatterCardConfig;
  private _data?: HeatLossResponse | SupplyCurveResponse;
  private _error?: string;
  private _timer?: number;
  private _fetchedKey?: string;

  setConfig(config: ScatterCardConfig): void {
    if (!config.entry_id) throw new Error("entry_id is required");
    if (config.mode !== "heat_loss" && config.mode !== "supply_curve") {
      throw new Error('mode must be "heat_loss" or "supply_curve"');
    }
    this._config = config;
    this._data = undefined;
  }

  getCardSize(): number {
    return 6;
  }

  getGridOptions() {
    return { columns: "full", min_rows: 5 };
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
    const { entry_id, mode, days } = this._config;
    const key = `${entry_id}:${mode}:${days ?? ""}`;
    if (!force && key === this._fetchedKey) return;
    this._fetchedKey = key;
    try {
      this._data =
        mode === "heat_loss"
          ? await this.hass.callWS<HeatLossResponse>({ type: "weheat_insights/heat_loss", entry_id })
          : await this.hass.callWS<SupplyCurveResponse>({
              type: "weheat_insights/supply_curve",
              entry_id,
              days: days ?? 60,
            });
      this._error = undefined;
    } catch (err) {
      this._error = err instanceof Error ? err.message : JSON.stringify(err);
    }
  }

  protected render() {
    if (!this.hass || !this._config) return nothing;
    const t = localizer(this.hass);
    const heatLoss = this._config.mode === "heat_loss";
    return html`<ha-card>
      <div class="title">${this._config.title ?? t(heatLoss ? "heat_loss_title" : "supply_curve_title")}</div>
      ${this._error
        ? html`<div class="message">${this._error}</div>`
        : !this._data
          ? html`<div class="message">…</div>`
          : heatLoss
            ? this._renderHeatLoss(this._data as HeatLossResponse, t)
            : this._renderSupply(this._data as SupplyCurveResponse, t)}
    </ha-card>`;
  }

  private _renderHeatLoss(data: HeatLossResponse, t: Localize) {
    const lang = language(this.hass!);
    const fmt = new Intl.NumberFormat(lang, { maximumFractionDigits: 1 });
    const dots: Dot[] = data.points.map((p) => ({
      x: p.delta_k,
      y: p.heating_kwh,
      cls: p.excluded ? "excluded" : "used",
      tip: `${p.day}: ${fmt.format(p.delta_k)} K, ${fmt.format(p.heating_kwh)} kWh${p.excluded ? ` (${t("excluded")})` : ""}`,
    }));
    const fit = data.fit;
    const summary = fit
      ? html`<div class="summary">
          <strong>${Math.round(data.coefficient_w_per_k!)} ± ${Math.round(data.confidence_95_w_per_k!)} W/K</strong>
          · R² ${fit.r_squared.toFixed(2)} · ${data.days_used} ${t("days_used")}
        </div>`
      : html`<div class="summary muted">${data.reason ? t(`reason_${data.reason}` as never) : ""}</div>`;
    return html`${summary}
      ${this._chart(dots, {
        xLabel: t("indoor_outdoor_diff"),
        yLabel: t("heating_per_day"),
        includeZeroY: true,
        line: fit ? (x: number) => fit.slope * x + fit.intercept : undefined,
      })}
      <div class="legend">
        <span><i class="dot used"></i>${t("used")}</span>
        <span><i class="dot excluded"></i>${t("excluded")}</span>
        ${fit ? html`<span><i class="line"></i>${t("fit_line")}</span>` : nothing}
      </div>
      ${data.indoor_assumed ? html`<div class="note">${t("indoor_assumed_note")}</div>` : nothing}`;
  }

  private _renderSupply(data: SupplyCurveResponse, t: Localize) {
    if (!data.points.length) return html`<div class="message">${t("no_data")}</div>`;
    const lang = language(this.hass!);
    const fmt = new Intl.NumberFormat(lang, { maximumFractionDigits: 1 });
    const deltas = data.points.map((p) => p.delta_t_k).sort((a, b) => a - b);
    // Colour scale on the 5th-95th percentile so one odd hour doesn't flatten it.
    const lo = deltas[Math.floor(deltas.length * 0.05)];
    const hi = deltas[Math.min(deltas.length - 1, Math.floor(deltas.length * 0.95))];
    const dots: Dot[] = data.points.map((p) => ({
      x: p.outdoor_c,
      y: p.supply_c,
      color: deltaColor(p.delta_t_k, lo, hi),
      tip: `${new Date(p.time).toLocaleString(lang, { dateStyle: "short", timeStyle: "short" })}: ${fmt.format(p.outdoor_c)} °C → ${fmt.format(p.supply_c)} °C, ΔT ${fmt.format(p.delta_t_k)} K`,
    }));
    const toXY = (pts: CurvePoint[], key: "supply_c" | "low_c" | "high_c" = "supply_c") =>
      pts
        .filter((p) => p[key] != null)
        .map((p) => ({ x: p.outdoor_c, y: p[key] as number }))
        .sort((a, b) => a.x - b.x);
    const curves = data.curves;
    const lines: ChartLine[] = [];
    if (curves?.advice.length) {
      lines.push({ cls: "advice", points: toXY(curves.advice), band: [toXY(curves.advice, "low_c"), toXY(curves.advice, "high_c")] });
    }
    if (curves && curves.current.length > 1) lines.push({ cls: "current", points: toXY(curves.current) });
    return html`${this._chart(dots, { xLabel: t("outdoor_temp"), yLabel: t("supply_temp"), curves: lines })}
      <div class="legend">
        <span>ΔT ${fmt.format(lo)} K</span>
        <i class="gradient"></i>
        <span>${fmt.format(hi)} K</span>
        ${lines.some((l) => l.cls === "current") ? html`<span><i class="line current"></i>${t("current_curve")}</span>` : nothing}
        ${lines.some((l) => l.cls === "advice") ? html`<span><i class="line advice"></i>${t("advised_curve")}</span>` : nothing}
      </div>`;
  }

  private _chart(
    dots: Dot[],
    opts: {
      xLabel: string;
      yLabel: string;
      includeZeroY?: boolean;
      line?: (x: number) => number;
      curves?: ChartLine[];
    },
  ) {
    if (!dots.length) return html`<div class="message">${localizer(this.hass!)("no_data")}</div>`;
    const xs = dots.map((d) => d.x);
    const ys = dots.map((d) => d.y);
    const xTicks = niceTicks(Math.min(...xs), Math.max(...xs));
    const yTicks = niceTicks(opts.includeZeroY ? Math.min(0, ...ys) : Math.min(...ys), Math.max(...ys));
    const [x0, x1] = [xTicks[0], xTicks[xTicks.length - 1]];
    const [y0, y1] = [yTicks[0], yTicks[yTicks.length - 1]];
    const plotW = WIDTH - PAD.left - PAD.right;
    const plotH = HEIGHT - PAD.top - PAD.bottom;
    const sx = (x: number) => PAD.left + ((x - x0) / (x1 - x0)) * plotW;
    const sy = (y: number) => PAD.top + plotH - ((y - y0) / (y1 - y0)) * plotH;
    const clampY = (y: number) => Math.min(y1, Math.max(y0, y));

    return html`<svg viewBox="0 0 ${WIDTH} ${HEIGHT}" role="img" aria-label=${opts.yLabel}>
      ${yTicks.map(
        (v) => svg`<line class="grid" x1=${PAD.left} x2=${WIDTH - PAD.right} y1=${sy(v)} y2=${sy(v)}></line>
          <text class="axis" x=${PAD.left - 6} y=${sy(v) + 4} text-anchor="end">${v}</text>`,
      )}
      ${xTicks.map(
        (v) => svg`<line class="grid" x1=${sx(v)} x2=${sx(v)} y1=${PAD.top} y2=${PAD.top + plotH}></line>
          <text class="axis" x=${sx(v)} y=${PAD.top + plotH + 16} text-anchor="middle">${v}</text>`,
      )}
      <text class="label" x=${PAD.left + plotW / 2} y=${HEIGHT - 4} text-anchor="middle">${opts.xLabel}</text>
      <text class="label" transform="translate(12 ${PAD.top + plotH / 2}) rotate(-90)" text-anchor="middle">${opts.yLabel}</text>
      ${dots.map(
        (d) => svg`<circle class=${d.cls ?? ""} cx=${sx(d.x)} cy=${sy(d.y)} r="3.5" style=${d.color ? `fill:${d.color}` : ""}>
          <title>${d.tip}</title>
        </circle>`,
      )}
      ${(opts.curves ?? []).map((curve) => {
        // Curves are drawn over the measured outdoor range only.
        // The current curve is only known between its observed points; the
        // advice is defined at every curve point and may span the whole chart.
        const steps = 40;
        const known = curve.points.map((p) => p.x);
        const from = curve.band ? x0 : Math.max(x0, Math.min(...known));
        const to = curve.band ? x1 : Math.min(x1, Math.max(...known));
        if (to <= from) return nothing;
        const xsAt = Array.from({ length: steps + 1 }, (_, k) => from + ((to - from) * k) / steps);
        const path = (pts: { x: number; y: number }[]) =>
          xsAt.map((x) => `${sx(x)},${sy(clampY(curveAt(pts, x) ?? y0))}`).join(" ");
        const band = curve.band
          ? svg`<polygon class="band ${curve.cls}" points=${`${path(curve.band[1])} ${path(curve.band[0]).split(" ").reverse().join(" ")}`}></polygon>`
          : nothing;
        return svg`${band}<polyline class="curve ${curve.cls}" points=${path(curve.points)}></polyline>`;
      })}
      ${opts.line
        ? svg`<line class="fit" x1=${sx(x0)} y1=${sy(clampY(opts.line(x0)))} x2=${sx(x1)} y2=${sy(clampY(opts.line(x1)))}></line>`
        : nothing}
    </svg>`;
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
    }
    .muted,
    .note {
      color: var(--secondary-text-color);
    }
    .note {
      font-size: 13px;
      margin-top: 4px;
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
    circle {
      fill: var(--primary-color);
      fill-opacity: 0.8;
    }
    circle.excluded {
      fill: var(--disabled-text-color, #bdbdbd);
      fill-opacity: 0.6;
    }
    polyline.curve {
      fill: none;
      stroke-width: 2.5;
    }
    polyline.curve.advice {
      stroke: var(--primary-text-color);
    }
    polyline.curve.current {
      stroke: var(--secondary-text-color);
      stroke-dasharray: 6 4;
    }
    polygon.band {
      fill: var(--primary-text-color);
      fill-opacity: 0.08;
      stroke: none;
    }
    .line.current {
      background: repeating-linear-gradient(90deg, var(--secondary-text-color) 0 6px, transparent 6px 9px);
    }
    line.fit {
      stroke: var(--primary-text-color);
      stroke-width: 2;
    }
    .legend {
      display: flex;
      gap: 12px;
      justify-content: center;
      align-items: center;
      font-size: 13px;
      color: var(--secondary-text-color);
    }
    .dot {
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      margin-right: 6px;
      vertical-align: middle;
    }
    .dot.used {
      background: var(--primary-color);
    }
    .dot.excluded {
      background: var(--disabled-text-color, #bdbdbd);
    }
    .line {
      display: inline-block;
      width: 14px;
      height: 2px;
      margin-right: 6px;
      vertical-align: middle;
      background: var(--primary-text-color);
    }
    .gradient {
      display: inline-block;
      width: 120px;
      height: 10px;
      border-radius: 5px;
      background: linear-gradient(90deg, hsl(220 75% 48%), hsl(110 75% 48%), hsl(40 75% 48%), hsl(0 75% 48%));
    }
    .message {
      padding: 24px 0;
      text-align: center;
      color: var(--secondary-text-color);
    }
  `;
}
