export type Currency = 'AFR' | 'FRF' | 'EUR' | 'USD' | 'GBP';

export const EURO_TO_FRF = 6.55957;
export const EURO_TO_AFR = EURO_TO_FRF * 100;

export function euroTo(currency: Currency): number {
  if (currency === 'EUR') return 1;
  if (currency === 'FRF') return EURO_TO_FRF;
  if (currency === 'USD') return 1.1;
  if (currency === 'GBP') return 0.85;
  return EURO_TO_AFR;
}

export function toEuro(currency: Currency): number {
  if (currency === 'EUR') return 1;
  if (currency === 'FRF') return 1 / EURO_TO_FRF;
  if (currency === 'USD') return 1 / 1.1;
  if (currency === 'GBP') return 1 / 0.85;
  return 1 / EURO_TO_AFR;
}

export function currencySymbol(currency: Currency): string {
  if (currency === 'EUR') return '€';
  if (currency === 'USD') return '$';
  if (currency === 'GBP') return '£';
  return '';
}
