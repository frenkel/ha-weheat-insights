import type { HomeAssistant } from "./types";

const en = {
  title: "Weheat Insights",
  live: "Live",
  last_24h: "Last 24 hours",
  last_7d: "Last 7 days",
  temperatures: "Temperatures",
  power: "Power",
  cop: "COP",
  delta_t: "ΔT supply/return",
  state: "Operating state",
  room: "Room",
  outdoor: "Outdoor",
  supply: "Supply",
  return: "Return",
  power_input: "Electrical power",
  power_output: "Heat output",
  no_pumps_title: "No heat pump set up yet",
  no_pumps_body:
    "Add the **Weheat Insights** integration under *Settings → Devices & services* and pick a heat pump. This dashboard fills itself in once that is done.",
  error_title: "Weheat Insights is not available",
  error_body:
    "The dashboard could not load its configuration. Check that the Weheat Insights integration is installed and loaded.",
  disclaimer: "Unofficial community project, not affiliated with Weheat.",
};

type Key = keyof typeof en;

const nl: Record<Key, string> = {
  title: "Weheat Insights",
  live: "Live",
  last_24h: "Afgelopen 24 uur",
  last_7d: "Afgelopen 7 dagen",
  temperatures: "Temperaturen",
  power: "Vermogen",
  cop: "COP",
  delta_t: "ΔT aanvoer/retour",
  state: "Bedrijfstoestand",
  room: "Kamer",
  outdoor: "Buiten",
  supply: "Aanvoer",
  return: "Retour",
  power_input: "Elektrisch vermogen",
  power_output: "Warmteafgifte",
  no_pumps_title: "Nog geen warmtepomp ingesteld",
  no_pumps_body:
    "Voeg de integratie **Weheat Insights** toe via *Instellingen → Apparaten & diensten* en kies een warmtepomp. Dit dashboard vult zich daarna vanzelf.",
  error_title: "Weheat Insights is niet beschikbaar",
  error_body:
    "Het dashboard kon zijn configuratie niet laden. Controleer of de integratie Weheat Insights is geïnstalleerd en geladen.",
  disclaimer: "Onofficieel communityproject, niet verbonden aan Weheat.",
};

const translations: Record<string, Record<Key, string>> = { en, nl };

export type Localize = (key: Key) => string;

export function localizer(hass: HomeAssistant): Localize {
  const lang = (hass.locale?.language ?? hass.language ?? "en").split("-")[0];
  const table = translations[lang] ?? en;
  return (key) => table[key] ?? en[key];
}
