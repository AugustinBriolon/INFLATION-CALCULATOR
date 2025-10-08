export function computeAdjustedAmountWithSeries(
  amount: number,
  fromYear: number,
  toYear: number,
  series: Record<string, number>
) {
  const startYear = Math.min(fromYear, toYear);
  const endYear = Math.max(fromYear, toYear);

  const cpiFrom = series[String(startYear)];
  const cpiTo = series[String(endYear)];

  if (!cpiFrom || !cpiTo) {
    return {
      adjustedAmount: null,
      pctChange: null,
      purchasingPower: null,
      inflationRate: null,
      cpiFrom: undefined,
      cpiTo: undefined,
    };
  }

  const inflationFactor = cpiTo / cpiFrom;
  const adjustedAmount = amount / inflationFactor;

  const purchasingPower = (adjustedAmount / amount) * 100;
  const pctChange = 100 - purchasingPower;
  const totalInflationRate = (inflationFactor - 1) * 100;

  return {
    adjustedAmount,
    pctChange,
    purchasingPower,
    inflationRate: totalInflationRate,
    cpiFrom,
    cpiTo,
  };
}
