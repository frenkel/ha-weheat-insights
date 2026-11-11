# Weheat Insights

> [!IMPORTANT]
> **Unofficial community project.** Weheat Insights is not affiliated with,
> endorsed by or supported by Weheat. Please don't contact Weheat support about it.

A Home Assistant integration that turns the data from the core
[Weheat integration](https://www.home-assistant.io/integrations/weheat/) into
insight, and ships its own dashboard. Everything runs locally in Home
Assistant: no external server, no accounts, no telemetry.

## Features

**Available now (0.1)**

- A dashboard that builds itself, with no YAML. For each heat pump:
  - Live overview: operating state, COP gauge, room, outdoor, supply and
    return temperatures, ΔT, electrical power and heat output.
  - History for the last 24 hours and hourly statistics for the last 7 days.
- A **ΔT supply/return** sensor.
- Works with multiple heat pumps.
- English and Dutch.

**Planned**

- Real COP and SCOP per day, month and heating season, split into space
  heating and domestic hot water.
- Degree days and energy per degree day.
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
The integration serves the dashboard code itself, so you don't need a
separate frontend install.

## How it works

Weheat Insights reads the sensors that the core Weheat integration creates.
It finds them through Home Assistant's device and entity registries, so
renaming entities is fine. It does not talk to the Weheat cloud and cannot
control your heat pump.

## Development

See [docs/development.md](docs/development.md).

## License

[MIT](LICENSE)
