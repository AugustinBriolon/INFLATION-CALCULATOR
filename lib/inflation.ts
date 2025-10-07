import cpi from '@/data/france-cpi.json';
import type { CPISeries } from '@/lib/cpi-source';
import { Currency, euroTo, toEuro } from './currencies';

type CPIData = {
  source: string;
  frequency: 'annual' | 'monthly';
  units: string;
  data: Record<string, number>;
};

const cpiData = cpi as unknown as CPIData;

export function getAnnualCPI(year: number): number | undefined {
  return cpiData.data[String(year)];
}

export function getApproxMonthlyCPI(
  year: number,
  month: number
): number | undefined {
  const y = year;
  let val = getAnnualCPI(y);
  if (val !== undefined) return val;
  for (let delta = 1; delta <= 5; delta++) {
    const before = getAnnualCPI(y - delta);
    if (before !== undefined) return before;
    const after = getAnnualCPI(y + delta);
    if (after !== undefined) return after;
  }
  return undefined;
}

export function computeAdjustedAmountWithSeries(
  amount: number,
  fromCurrency: Currency,
  toCurrency: Currency,
  fromYear: number,
  toYear: number,
  series: CPISeries
) {
  const cpiFrom = series[String(fromYear)];
  const cpiTo = series[String(toYear)];
  if (typeof cpiFrom !== 'number' || typeof cpiTo !== 'number') {
    return { adjustedAmount: null, pctChange: null } as const;
  }
  const amountInEuroAtFrom = amount * toEuro(fromCurrency);
  const amountInEuroAtTo = amountInEuroAtFrom * (cpiTo / cpiFrom);
  const adjustedAmount = amountInEuroAtTo * euroTo(toCurrency);
  const nominalSameCurrencyFactor = euroTo(toCurrency) / euroTo(fromCurrency);
  const baseline = amount * nominalSameCurrencyFactor;
  const pctChange = ((adjustedAmount - baseline) / baseline) * 100;
  return { adjustedAmount, pctChange, cpiFrom, cpiTo };
}

export function parseMonthValue(
  value: string
): { year: number; month: number } | null {
  const m = /^([0-9]{4})-([0-9]{2})$/.exec(value);
  if (!m) return null;
  return { year: Number(m[1]), month: Number(m[2]) };
}

export function computeAdjustedAmount(
  amount: number,
  fromCurrency: Currency,
  toCurrency: Currency,
  fromMonthValue: string,
  toMonthValue: string
): {
  adjustedAmount: number | null;
  pctChange: number | null;
  cpiFrom?: number;
  cpiTo?: number;
} {
  const from = parseMonthValue(fromMonthValue);
  const to = parseMonthValue(toMonthValue);
  if (!from || !to) return { adjustedAmount: null, pctChange: null };

  const cpiFrom = getApproxMonthlyCPI(from.year, from.month);
  const cpiTo = getApproxMonthlyCPI(to.year, to.month);
  if (cpiFrom === undefined || cpiTo === undefined)
    return { adjustedAmount: null, pctChange: null };

  // Conversion: montant -> EUR à la date d'origine, puis ajustement inflation, puis vers devise cible
  const amountInEuroAtFrom = amount * toEuro(fromCurrency);
  const amountInEuroAtTo = amountInEuroAtFrom * (cpiTo / cpiFrom);
  const adjustedAmount = amountInEuroAtTo * euroTo(toCurrency);

  // Variation en % par rapport à un simple change de devise sans inflation
  const nominalSameCurrencyFactor = euroTo(toCurrency) / euroTo(fromCurrency);
  const baseline = amount * nominalSameCurrencyFactor;
  const pctChange = ((adjustedAmount - baseline) / baseline) * 100;

  return { adjustedAmount, pctChange, cpiFrom, cpiTo };
}

export function buildCpiSeriesBetween(
  fromMonthValue: string,
  toMonthValue: string,
  stepYears = 1
) {
  const from = parseMonthValue(fromMonthValue);
  const to = parseMonthValue(toMonthValue);
  if (!from || !to) return [] as { date: string; cpi: number }[];

  const start = Math.min(from.year, to.year);
  const end = Math.max(from.year, to.year);
  const series: { date: string; cpi: number }[] = [];
  for (let y = start; y <= end; y += stepYears) {
    const v = getAnnualCPI(y);
    if (v !== undefined) series.push({ date: `${y}-01`, cpi: v });
  }
  return series;
}
