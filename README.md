# Weheat Insights

> [!IMPORTANT]
> **Unofficial community project.** Weheat Insights is not affiliated with,
> endorsed by or supported by Weheat. Please don't contact Weheat support about it.

A Home Assistant integration that turns the data from the core
[Weheat integration](https://www.home-assistant.io/integrations/weheat/) into
insight, and ships its own dashboard. Everything runs locally in Home
Assistant: no external server, no accounts, no telemetry.

## Features

**Features**

- A dashboard that builds itself, with no YAML. For each heat pump four tabs:
  - **Performance** (default): COP and SCOP per day, month and heating
    season, for the heat pump (as in the Weheat app) and in total (incl.
    standby and pumps), split into space heating and hot water; COP over
    time per day, month or season; what defrosting costs; energy per day.
  - **House**: heat-loss coefficient with confidence interval and scatter
    chart, heat loss at −10 °C, balance point, cool-down rate and thermal
    mass; degree days and heating per degree day compared with last season.
  - **Heating curve**: advice for the five points of the Weheat heating
    curve (−20, 9, 15, 20 and 25 °C outdoor) that just keeps your target room
    temperature, next to your current curve; supply temperature against
    outdoor temperature with both curves; before/after comparison of a curve
    change, corrected for weather.
  - **Live**: operating state, COP gauge (while running), room, outdoor,
    supply and return temperatures, ΔT, electrical power and heat output,
    history for the last 24 hours and hourly statistics for the last 7 days.
- Sensors: ΔT supply/return; COP today, COP this month and SCOP this season
  (heat pump, total, heating, hot water); COP lost to defrost; degree days; heating per
  degree day (this season, same period last season, whole last season).
- Works from day one with your existing history: everything is computed from
  Home Assistant's long-term statistics of the core Weheat energy counters.
- Works with multiple heat pumps. English and Dutch.

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

### House analysis

- **Heat-loss coefficient H (W/K)**: a straight line through one point per
  day, heating heat (kWh/day) against the average indoor − outdoor
  difference, over the last 12 months. H = slope × 1000 / 24. The line's
  offset is the free heat from sun, people and appliances.
- Days are left out when data is missing, the difference is below 3 K, the
  indoor temperature changed more than 1.5 K from the day before (the house
  was storing or releasing heat), or a gas boiler or electric heater ran
  (only detectable within the recorder's state history, 10 days by default).
- A result is shown once there are 14 usable days spanning at least 6 K,
  with a 95 % confidence interval and R². Without an indoor sensor 20 °C is
  assumed and flagged.
- **Heat loss at −10 °C** = H × (20 − (−10)). **Balance point**: the outdoor
  temperature at which the line reaches zero.
- **Cool-down**: periods of at least 4 hours without heating (hourly
  statistics) are fitted to an exponential decay. The median time constant
  τ gives the cool-down rate at 15 K difference and, with H, the thermal
  mass C = τ × H. A modulating heat pump that runs all night leaves few such
  periods, so this can take a while to appear.
- The heating-curve chart only uses hours in which the pump mainly heated
  the house (at least 0.5 kWh space heating, no hot water), and skips the
  hour after hot water, when left-over DHW heat can be pushed into the
  heating circuit at a high supply temperature.

### Heating-curve advice

The aim is one heating curve that keeps the house at your target room
temperature (default 20 °C, a setting) with water no warmer than needed:
lower water temperatures give a higher COP.

For each point of the Weheat curve:

1. **Heat demand** at that outdoor temperature, from the heat-loss fit at the
   target room temperature.
2. **The water temperature at which your heating system delivers exactly
   that heat.** The emitter law Q = k × (mean water − room)ⁿ is calibrated on
   hours of steady heating (heating in the hour and both neighbours, no hot
   water nearby) over the last 60 days, with n = 1.3 for radiators, 1.1 for
   underfloor heating and 1.2 for a mix (a setting). Half the measured
   supply−return difference at that heat is added.
3. Above the balance point no heat is needed; the advice there is the room
   temperature.

The advice is given with one decimal, which the Weheat web portal accepts;
in the app, which only takes whole degrees, round up so the house stays warm.
The range comes from the 95 % interval of the heat-loss coefficient. Points
far outside the outdoor temperatures you have measured are marked as
extrapolated. The current curve is read from the Weheat water setpoint
against the heat pump's own outdoor sensor over the last 14 days, so points
it has not seen show "–".

Treat the advice as a starting point, not a guarantee: change the curve in
small steps and check the rooms stay warm. Set the date of the change under
**Configure** to compare heating electricity per degree day (and heating
COP) for up to 60 days before and after.

COP/SCOP sensors have no `state_class` on purpose: Home Assistant would store
hourly averages of a running ratio, which mean nothing. Use the performance
card for COP over time.

You can change the outdoor and indoor sensor, the heating season, the
degree-day settings, the target room temperature, the heating system and the
date of a heating-curve change under **Settings → Devices & services → Weheat Insights →
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
