export type Country = 'FR' | 'DE' | 'IT' | 'ES' | 'US' | 'UK';

export interface CountryData {
  code: Country;
  name: string;
  flag: string;
  currency: string;
  currencySymbol: string;
}

export const COUNTRIES: Record<Country, CountryData> = {
  FR: {
    code: 'FR',
    name: 'France',
    flag: '🇫🇷',
    currency: 'EUR',
    currencySymbol: '€',
  },
  DE: {
    code: 'DE',
    name: 'Allemagne',
    flag: '🇩🇪',
    currency: 'EUR',
    currencySymbol: '€',
  },
  IT: {
    code: 'IT',
    name: 'Italie',
    flag: '🇮🇹',
    currency: 'EUR',
    currencySymbol: '€',
  },
  ES: {
    code: 'ES',
    name: 'Espagne',
    flag: '🇪🇸',
    currency: 'EUR',
    currencySymbol: '€',
  },
  US: {
    code: 'US',
    name: 'États-Unis',
    flag: '🇺🇸',
    currency: 'USD',
    currencySymbol: '$',
  },
  UK: {
    code: 'UK',
    name: 'Royaume-Uni',
    flag: '🇬🇧',
    currency: 'GBP',
    currencySymbol: '£',
  },
};

export const DEFAULT_COUNTRY: Country = 'FR';
