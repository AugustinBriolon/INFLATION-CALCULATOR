export type Currency = 'AFR' | 'FRF' | 'EUR' | 'USD' | 'GBP';

export type Pair = {
  from: Currency;
  to: Currency;
};

export const CURRENCY_LABEL: Record<Currency, string> = {
  AFR: 'Anciens francs',
  FRF: 'Francs',
  EUR: 'Euros',
  USD: 'Dollars US',
  GBP: 'Livres sterling',
};

// Taux fixes légaux (pas des taux de marché) pour les changements de monnaie en France
// 100 anciens francs = 1 franc (1960)
// 6.55957 francs = 1 euro (2002-01-01)
export const EURO_TO_FRF = 6.55957; // 1 EUR -> 6.55957 FRF
export const EURO_TO_AFR = EURO_TO_FRF * 100; // 1 EUR -> 655.957 AFR

export function euroTo(currency: Currency): number {
  if (currency === 'EUR') return 1;
  if (currency === 'FRF') return EURO_TO_FRF;
  if (currency === 'USD') return 1.1; // Taux approximatif
  if (currency === 'GBP') return 0.85; // Taux approximatif
  return EURO_TO_AFR; // AFR
}

export function toEuro(currency: Currency): number {
  // multiplicateur pour passer de la devise vers EUR
  if (currency === 'EUR') return 1;
  if (currency === 'FRF') return 1 / EURO_TO_FRF;
  if (currency === 'USD') return 1 / 1.1;
  if (currency === 'GBP') return 1 / 0.85;
  return 1 / EURO_TO_AFR; // AFR
}

export const PAIRS: Pair[] = [
  { from: 'AFR', to: 'AFR' },
  { from: 'AFR', to: 'FRF' },
  { from: 'AFR', to: 'EUR' },
  { from: 'FRF', to: 'FRF' },
  { from: 'FRF', to: 'EUR' },
  { from: 'EUR', to: 'EUR' },
];

export function pairLabel(pair: Pair): string {
  return `${CURRENCY_LABEL[pair.from]} vers ${CURRENCY_LABEL[pair.to]}`;
}

export function currentDate(): string {
  return new Date(Date.now()).toISOString().split('T')[0];
}

// Contraintes de sélection de dates en fonction des monnaies
// AFR: avant 1960-01, FRF: 1960-01 à 2001-12, EUR: à partir de 2002-01
export function minMaxForCurrency(currency: Currency): {
  min: string;
  max: string;
} {
  if (currency === 'AFR') {
    return { min: '1960-01', max: '1959-12' };
  }
  if (currency === 'FRF') {
    return { min: '1960-01', max: '2001-12' };
  }
  if (currency === 'USD') {
    return { min: '1960-01', max: currentDate() };
  }
  if (currency === 'GBP') {
    return { min: '1960-01', max: currentDate() };
  }
  return { min: '2002-01', max: currentDate() }; // EUR
}
