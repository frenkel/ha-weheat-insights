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

declare global {
  interface Window {
    customStrategies?: { type: string; name: string; description: string; strategyType?: string }[];
  }
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
