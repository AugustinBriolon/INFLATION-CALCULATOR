import { Country } from './countries';
import { Pair } from './currencies';

// Paires de devises disponibles par pays
export const CURRENCY_PAIRS_BY_COUNTRY: Record<Country, Pair[]> = {
  FR: [
    { from: 'AFR', to: 'AFR' },
    { from: 'AFR', to: 'FRF' },
    { from: 'AFR', to: 'EUR' },
    { from: 'FRF', to: 'FRF' },
    { from: 'FRF', to: 'EUR' },
    { from: 'EUR', to: 'EUR' },
  ],
  DE: [{ from: 'EUR', to: 'EUR' }],
  IT: [{ from: 'EUR', to: 'EUR' }],
  ES: [{ from: 'EUR', to: 'EUR' }],
  US: [{ from: 'USD', to: 'USD' }],
  UK: [{ from: 'GBP', to: 'GBP' }],
};

export function getCurrencyPairsForCountry(country: Country): Pair[] {
  return CURRENCY_PAIRS_BY_COUNTRY[country] || CURRENCY_PAIRS_BY_COUNTRY.FR;
}
