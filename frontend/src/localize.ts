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
  performance: "Performance",
  cop_history: "COP over time",
  day: "Day",
  month: "Month",
  season: "Season",
  heating: "Heating",
  dhw: "Hot water",
  total: "Total",
  no_data: "No data for this period yet.",
  electricity: "electricity",
  heat: "heat",
  scop_season: "SCOP this season",
  cop_month: "COP this month",
  cop_today: "COP today",
  defrost_cop_impact: "COP lost to defrost",
  degree_days_month: "Degree days this month",
  degree_days_season: "Degree days this season",
  heat_per_degree_day: "Heating per degree day",
  heat_per_degree_day_last_year: "Same period last season",
  heat_per_degree_day_last_season: "Whole last season",
  energy_per_day: "Energy per day",
  degree_days_per_day: "Degree days per day",
  degree_days_per_month: "Degree days per month",
  defrost: "Defrost",
  standby: "Standby",
  degree_days: "Degree days",
  definitions:
    "**How these numbers are calculated.** *Total* COP/SCOP is all useful heat divided by all electricity, including standby and the indoor unit. *Heating* and *hot water* only count the compressor electricity for that mode plus its share of defrost (split by electricity use); standby and the indoor unit are left out. Defrost heat taken back from the water counts against the COP. *Heating per degree day* uses heating heat only and lets you compare winters of different coldness. Figures come from Home Assistant's long-term statistics and can lag up to about an hour.",
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
  performance: "Prestaties",
  cop_history: "COP door de tijd",
  day: "Dag",
  month: "Maand",
  season: "Seizoen",
  heating: "Verwarming",
  dhw: "Warm water",
  total: "Totaal",
  no_data: "Nog geen gegevens voor deze periode.",
  electricity: "stroom",
  heat: "warmte",
  scop_season: "SCOP dit stookseizoen",
  cop_month: "COP deze maand",
  cop_today: "COP vandaag",
  defrost_cop_impact: "COP-verlies door ontdooien",
  degree_days_month: "Graaddagen deze maand",
  degree_days_season: "Graaddagen dit stookseizoen",
  heat_per_degree_day: "Verwarming per graaddag",
  heat_per_degree_day_last_year: "Zelfde periode vorig seizoen",
  heat_per_degree_day_last_season: "Heel vorig seizoen",
  energy_per_day: "Energie per dag",
  degree_days_per_day: "Graaddagen per dag",
  degree_days_per_month: "Graaddagen per maand",
  defrost: "Ontdooien",
  standby: "Stand-by",
  degree_days: "Graaddagen",
  definitions:
    "**Zo worden deze getallen berekend.** De *totale* COP/SCOP is alle nuttige warmte gedeeld door alle stroom, inclusief stand-by en de binnenunit. *Verwarming* en *warm water* tellen alleen de compressorstroom voor die functie plus hun deel van het ontdooien (verdeeld naar stroomverbruik); stand-by en de binnenunit tellen daar niet mee. Warmte die bij ontdooien uit het water wordt gehaald, telt negatief mee. *Verwarming per graaddag* gebruikt alleen verwarmingswarmte, zodat je winters van verschillende koude kunt vergelijken. De cijfers komen uit de langetermijnstatistieken van Home Assistant en kunnen tot ongeveer een uur achterlopen.",
};

const translations: Record<string, Record<Key, string>> = { en, nl };

export type Localize = (key: Key) => string;

export function language(hass: HomeAssistant): string {
  return (hass.locale?.language ?? hass.language ?? "en").split("-")[0];
}

export function localizer(hass: HomeAssistant): Localize {
  const table = translations[language(hass)] ?? en;
  return (key) => table[key] ?? en[key];
}
