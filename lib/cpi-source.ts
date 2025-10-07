import { Country } from '@/lib/countries';

export type CPISeries = Record<string, number>; // year -> index

export async function fetchOfficialCPI(country: Country): Promise<CPISeries> {
  // TODO: tenter d'abord OECD pour FR (série annuelle) puis fallback WorldBank
  // OECD API (ex FR CPI annual): https://stats.oecd.org/sdmx-json/data/PRICES_CPI/A..CPALTT01.FR.A/all
  // Pour simplifier, on passe par notre backend qui pourra évoluer sans casser le client
  const resp = await fetch(`/api/cpi?country=${country}`);
  if (!resp.ok) throw new Error('CPI fetch failed');
  const json = await resp.json();
  return json.series as CPISeries;
}
