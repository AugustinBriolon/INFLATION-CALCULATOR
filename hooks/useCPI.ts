import { useQuery } from '@tanstack/react-query';
import { Country } from '@/lib/countries';

const ISO2_TO_ISO3: Record<string, string> = {
  FR: 'FRA',
  DE: 'DEU',
  IT: 'ITA',
  ES: 'ESP',
  US: 'USA',
  UK: 'GBR',
};

function normalizeWorldBankJson(json: any): Record<string, number> {
  const series: Record<string, number> = {};
  const dataArray =
    Array.isArray(json) && Array.isArray(json[1]) ? json[1] : [];

  for (const row of dataArray) {
    const y = row?.date;
    const v = row?.value;
    if (y && typeof v === 'number') {
      series[String(y)] = v;
    }
  }
  return series;
}

async function fetchCPIFromWorldBank(
  country: Country
): Promise<Record<string, number>> {
  const iso3 = ISO2_TO_ISO3[country];
  if (!iso3) {
    throw new Error(`Unsupported country for CPI: ${country}`);
  }

  const url = `https://api.worldbank.org/v2/country/${iso3}/indicator/FP.CPI.TOTL?format=json&per_page=20000`;
  const r = await fetch(url);
  if (!r.ok) throw new Error(`WorldBank ${r.status}`);
  const j = await r.json();
  return normalizeWorldBankJson(j);
}

export function useCPI(country: Country) {
  return useQuery({
    queryKey: ['cpi', country],
    queryFn: () => fetchCPIFromWorldBank(country),
    staleTime: 1000 * 60 * 60 * 12,
    refetchOnWindowFocus: false,
  });
}
