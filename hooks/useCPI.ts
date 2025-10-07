import { useQuery } from '@tanstack/react-query';
import { Country } from '@/lib/countries';
import { CPISeries } from '@/lib/cpi-source';

const ISO2_TO_ISO3: Record<string, string> = {
  FR: 'FRA',
  DE: 'DEU',
  IT: 'ITA',
  ES: 'ESP',
  US: 'USA',
  UK: 'GBR',
};

function normalizeWorldBankJson(json: any): CPISeries {
  const arr = Array.isArray(json) && Array.isArray(json[1]) ? json[1] : [];
  const out: CPISeries = {};
  for (const row of arr) {
    const y = row?.date;
    const v = row?.value;
    if (y && typeof v === 'number') out[String(y)] = v;
  }
  return out;
}

async function fetchCPIFromWorldBank(country: Country): Promise<CPISeries> {
  const iso3 = ISO2_TO_ISO3[country];
  if (!iso3) throw new Error('Unsupported country');
  const url = `https://api.worldbank.org/v2/country/${iso3}/indicator/FP.CPI.TOTL?format=json&per_page=65`;
  const r = await fetch(url);
  if (!r.ok) throw new Error(`WorldBank ${r.status}`);
  const j = await r.json();
  return normalizeWorldBankJson(j);
}

async function fetchCPIFallbackLocal(country: Country): Promise<CPISeries> {
  // fallback basique: fichier local France, normalisé si besoin
  const mod: any = await import('@/data/france-cpi.json');
  const raw = mod?.default ?? mod;
  if (Array.isArray(raw)) return normalizeWorldBankJson(raw);
  if (raw?.data && typeof raw.data === 'object') return raw.data as CPISeries;
  // si déjà WB shape {1:[...]}
  if (Array.isArray(raw?.[1])) return normalizeWorldBankJson(raw);
  return {} as CPISeries;
}

async function fetchCPI(country: Country): Promise<CPISeries> {
  try {
    return await fetchCPIFromWorldBank(country);
  } catch {
    return await fetchCPIFallbackLocal(country);
  }
}

export function useCPI(country: Country) {
  return useQuery({
    queryKey: ['cpi', country],
    queryFn: () => fetchCPI(country),
    staleTime: 1000 * 60 * 60 * 12,
    refetchOnWindowFocus: false,
  });
}
