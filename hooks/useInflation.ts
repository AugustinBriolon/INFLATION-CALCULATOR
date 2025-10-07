import { useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { useCPI } from '@/hooks/useCPI';
import { computeAdjustedAmountWithSeries } from '@/lib/inflation';

export function useInflation() {
  const { selectedCountry, currencyCode, year1, year2, amount } = useApp();
  const { data: series, isLoading } = useCPI(selectedCountry);

  const isReady = useMemo(
    () => year1 !== null && year2 !== null && amount > 0 && !!series,
    [year1, year2, amount, series]
  );

  const result = useMemo(() => {
    if (!isReady || !series || year1 === null || year2 === null) {
      return {
        adjustedAmount: null,
        pctChange: null,
        cpiFrom: undefined,
        cpiTo: undefined,
      } as const;
    }
    return computeAdjustedAmountWithSeries(
      amount,
      currencyCode,
      currencyCode,
      year1,
      year2,
      series
    );
  }, [isReady, amount, currencyCode, year1, year2, series]);

  const chartSeries = useMemo(() => {
    if (!series || year1 === null || year2 === null)
      return [] as { date: string; cpi: number }[];
    const start = Math.min(year1, year2);
    const end = Math.max(year1, year2);
    const data: { date: string; cpi: number }[] = [];
    for (let y = start; y <= end; y++) {
      const v = series[String(y)];
      if (typeof v === 'number') data.push({ date: `${y}-01`, cpi: v });
    }
    return data;
  }, [series, year1, year2]);

  return { isReady, result, chartSeries, isLoading, currencyCode };
}
