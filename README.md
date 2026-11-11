# Weheat Insights

> [!IMPORTANT]
> **Unofficial community project.** Weheat Insights is not affiliated with,
> endorsed by or supported by Weheat. Please don't contact Weheat support about it.

A Home Assistant integration that turns the data from the core
[Weheat integration](https://www.home-assistant.io/integrations/weheat/) into
insight, and ships its own dashboard. Everything runs locally in Home
Assistant: no external server, no accounts, no telemetry.

## Features

**Available now (0.2)**

- A dashboard that builds itself, with no YAML. For each heat pump:
  - **Performance** (default tab): COP and SCOP per day, month and heating
    season, for the heat pump (as in the Weheat app) and in total (incl.
    standby and pumps), split into space heating and hot water; COP over time per day, month or
    season; what defrosting costs; degree days and heating per degree day
    compared with last season; energy per day.
  - **Live**: operating state, COP gauge (while running), room, outdoor,
    supply and return temperatures, ΔT, electrical power and heat output,
    history for the last 24 hours and hourly statistics for the last 7 days.
- Sensors: ΔT supply/return; COP today, COP this month and SCOP this season
  (heat pump, total, heating, hot water); COP lost to defrost; degree days; heating per
  degree day (this season, same period last season, whole last season).
- Works from day one with your existing history: everything is computed from
  Home Assistant's long-term statistics of the core Weheat energy counters.
- Works with multiple heat pumps. English and Dutch.

**Planned**

- Heat-loss coefficient of the house and cool-down rate.
- Heating-curve advice based on your own data.

## Screenshots

_Coming soon._

<!-- ![Live overview](docs/images/live.png) -->
<!-- ![History](docs/images/history.png) -->

## Requirements

- Home Assistant 2026.10 or newer.
- The core **Weheat** integration, set up and working.

## Installation

### HACS (recommended)

1. In HACS, open the menu → **Custom repositories**, add
   `https://github.com/frenkel/ha-weheat-insights` with type **Integration**.
2. Install **Weheat Insights** and restart Home Assistant.

### Manual

Copy `custom_components/weheat_insights` into your `config/custom_components/`
folder and restart Home Assistant.

## Setup

1. Go to **Settings → Devices & services → Add integration → Weheat Insights**.
2. Pick the heat pump to analyse.
3. Choose the outdoor temperature sensor (default: the heat pump's own
   air-inlet sensor) and, optionally, an indoor temperature sensor.

Repeat for each heat pump. You can change the sensors later under
**Configure**.

### Dashboard

Create a new dashboard (**Settings → Dashboards → Add dashboard → New
dashboard from scratch**), open it, choose **Edit → ⋮ → Raw configuration
editor** and replace the contents with:

```yaml
strategy:
  type: custom:weheat-insights
```

The dashboard updates itself when you add heat pumps or when sensors change.

> [!TIP]
> If the dashboard says *"Timeout waiting for strategy element
> ll-strategy-dashboard-weheat-insights"*, your browser is still showing a page
> from before the install or update. Do a hard refresh (Ctrl/Cmd + Shift + R);
> in the companion app, use *Settings → Companion app → Debugging → Reset
> frontend cache*.

Negative values in the power and COP graphs are defrost cycles: the heat pump
briefly takes heat back from the heating water to thaw the outdoor unit. They
are real and are kept on purpose.
The integration serves the dashboard code itself, so you don't need a
separate frontend install.

## How the numbers are calculated

- **Heat pump COP/SCOP** = all useful heat ÷ compressor electricity for
  heating, hot water and defrost. This is the same number the Weheat app
  shows.
- **Total COP/SCOP** = the same heat ÷ all electricity, so also standby and
  the indoor unit (circulation pumps). This is what your heat actually
  costs. The total COP sensors list in their attributes where the
  electricity went (heating, hot water, defrost, standby, indoor unit).
- **Heating** and **hot water COP** count only the compressor electricity for
  that mode, plus its share of defrost. The core Weheat integration reports
  defrost as one combined counter, so defrost electricity and the heat taken
  back during defrost are split in proportion to the heating and hot-water
  electricity. Standby and the indoor unit are left out of these two.
- **COP lost to defrost** = COP without defrost − COP with defrost.
- **Degree days** per day = max(0, base − mean outdoor temperature), base
  18 °C by default, weighted by default with the Dutch convention (Nov–Feb
  ×1.1, Mar/Oct ×1.0, Apr–Sep ×0.8). Weighting can be switched off.
- **Heating per degree day** uses space-heating heat only (hot water does not
  depend on the weather), so you can compare a mild and a cold winter.
- The **heating season** runs from September up to and including May by
  default. Out of season, "this season" shows the season that just ended.
- A COP is only shown when at least 0.5 kWh of electricity was used in the
  period, so a quiet day doesn't show a meaningless value.
- Figures can lag up to about an hour: the core counters update every 30
  minutes and statistics are compiled hourly.

COP/SCOP sensors have no `state_class` on purpose: Home Assistant would store
hourly averages of a running ratio, which mean nothing. Use the performance
card for COP over time.

You can change the outdoor and indoor sensor, the heating season and the
degree-day settings under **Settings → Devices & services → Weheat Insights →
Configure**.

## How it works

Weheat Insights reads the sensors that the core Weheat integration creates.
It finds them through Home Assistant's device and entity registries, so
renaming entities is fine. Performance figures come from the recorder's
long-term statistics; degree days are also published as a long-term statistic
(`weheat_insights:degree_days_…`) for the statistics graph card. It does not
talk to the Weheat cloud and cannot control your heat pump.

## Development

See [docs/development.md](docs/development.md).

## License

[MIT](LICENSE)
