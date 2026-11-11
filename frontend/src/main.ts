/**
 * Weheat Insights frontend entry point (unofficial, not affiliated with Weheat).
 *
 * Registers the dashboard strategy, used as:
 *
 *   strategy:
 *     type: custom:weheat-insights
 */
import { errorDashboard, generateDashboard } from "./dashboard";
import { localizer } from "./localize";
import { PERFORMANCE_CARD_TAG, WeheatInsightsPerformanceCard } from "./performance-card";
import { SCATTER_CARD_TAG, WeheatInsightsScatterCard } from "./scatter-card";
import type { DashboardConfigResponse, HomeAssistant, LovelaceConfig } from "./types";

const STRATEGY_TAG = "ll-strategy-dashboard-weheat-insights";

class WeheatInsightsDashboardStrategy extends HTMLElement {
  static async generate(_config: Record<string, unknown>, hass: HomeAssistant): Promise<LovelaceConfig> {
    const t = localizer(hass);
    try {
      const response = await hass.callWS<DashboardConfigResponse>({
        type: "weheat_insights/dashboard_config",
      });
      return generateDashboard(response.heat_pumps, t);
    } catch (err) {
      const detail = err instanceof Error ? err.message : JSON.stringify(err);
      return errorDashboard(t, detail);
    }
  }
}

if (!customElements.get(STRATEGY_TAG)) {
  customElements.define(STRATEGY_TAG, WeheatInsightsDashboardStrategy);
}

if (!customElements.get(PERFORMANCE_CARD_TAG)) {
  customElements.define(PERFORMANCE_CARD_TAG, WeheatInsightsPerformanceCard);
}

if (!customElements.get(SCATTER_CARD_TAG)) {
  customElements.define(SCATTER_CARD_TAG, WeheatInsightsScatterCard);
}

declare global {
  interface Window {
    customStrategies?: { type: string; name: string; description: string; strategyType?: string }[];
    customCards?: { type: string; name: string; description: string }[];
  }
}

window.customCards = window.customCards ?? [];
if (!window.customCards.some((c) => c.type === PERFORMANCE_CARD_TAG)) {
  window.customCards.push({
    type: PERFORMANCE_CARD_TAG,
    name: "Weheat Insights performance",
    description: "COP per day, month or season for heating and hot water (unofficial)",
  });
}

if (!window.customCards.some((c) => c.type === SCATTER_CARD_TAG)) {
  window.customCards.push({
    type: SCATTER_CARD_TAG,
    name: "Weheat Insights scatter",
    description: "Heat loss of the house or supply vs outdoor temperature (unofficial)",
  });
}

// Lets the "add dashboard" dialog list this strategy where supported.
window.customStrategies = window.customStrategies ?? [];
if (!window.customStrategies.some((s) => s.type === "weheat-insights")) {
  window.customStrategies.push({
    type: "weheat-insights",
    strategyType: "dashboard",
    name: "Weheat Insights",
    description: "Live overview and history for Weheat heat pumps (unofficial)",
  });
}
