import { useApp } from '@/context/AppContext';
import { computeAdjustedAmountWithSeries } from '@/lib/inflation';
import { useCPI } from './useCPI';
import { useEffect, useMemo, useState } from 'react';

export function useInflation() {
  const { selectedCountry, currencyCode, year1, year2, amount } = useApp();

  const { data: series, isLoading } = useCPI(selectedCountry);

  const isReady = useMemo(
    () =>
      year1 !== null && year2 !== null && amount > 0 && !isLoading && series,
    [year1, year2, amount, isLoading, series]
  );

  const result = useMemo(() => {
    if (!isReady || year1 === null || year2 === null) {
      return {
        adjustedAmount: null,
        pctChange: null,
        purchasingPower: null,
        inflationRate: null,
        cpiFrom: undefined,
        cpiTo: undefined,
      } as const;
    }
    return computeAdjustedAmountWithSeries(amount, year1, year2, series || {});
  }, [isReady, amount, currencyCode, year1, year2, series]);

  const chartSeries = useMemo(() => {
    if (year1 === null || year2 === null || !series)
      return [] as { date: string; value: number }[];
    const start = Math.min(year1, year2);
    const end = Math.max(year1, year2);
    const data: { date: string; value: number }[] = [];

    const baseAmount = 100;
    const cpiStart = series[String(start)];

    for (let y = start; y <= end; y++) {
      const cpiY = series[String(y)];
      if (cpiY && cpiStart) {
        const value = baseAmount / (cpiY / cpiStart);
        data.push({ date: `${y}-01`, value });
      }
    }
    return data;
  }, [year1, year2, series]);

  const [cachedResult, setCachedResult] = useState<typeof result | null>(null);
  const [cachedChartSeries, setCachedChartSeries] = useState<
    typeof chartSeries
  >([]);

  useEffect(() => {
    if (isReady && result) {
      setCachedResult(result);
    }
  }, [isReady, result]);

  useEffect(() => {
    if (isReady && chartSeries.length > 0) {
      setCachedChartSeries(chartSeries);
    }
  }, [isReady, chartSeries]);

  const displayResult = isReady ? result : cachedResult;
  const displayChartSeries = isReady ? chartSeries : cachedChartSeries;

  return {
    isReady,
    result: displayResult,
    chartSeries: displayChartSeries,
    currencyCode,
  };
}
