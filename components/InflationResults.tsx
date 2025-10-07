import { Card, CardContent } from '@/components/ui/card';
import { useInflation } from '@/hooks/useInflation';
import { useGSAP } from '@gsap/react';
import NumberFlow from '@number-flow/react';
import gsap from 'gsap';
import { useMemo, useRef } from 'react';
import { Line, LineChart, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from './ui/chart';


export default function InflationResults() {
  const { isReady, result, chartSeries, currencyCode } = useInflation();
  const cardsRef = {
    montant: useRef<HTMLDivElement | null>(null),
    difference: useRef<HTMLDivElement | null>(null),
    cpi: useRef<HTMLDivElement | null>(null),
    chart: useRef<HTMLDivElement | null>(null),
  };

  useGSAP(() => {
    if (!isReady) return;

    gsap.fromTo(
      [
        cardsRef.montant.current,
        cardsRef.difference.current,
        cardsRef.cpi.current,
        cardsRef.chart.current,
      ],
      {
        autoAlpha: 0,
        filter: 'blur(10px)',
        y: 50,
      },
      {
        autoAlpha: 1,
        filter: 'blur(0px)',
        y: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power1.inOut',
      }
    );
  }, [isReady]);

  const baseYear = useMemo(() => {
    if (!chartSeries || chartSeries.length === 0) return undefined;
    let best = chartSeries[0];
    for (const pt of chartSeries) {
      if (Math.abs(pt.cpi - 100) < Math.abs(best.cpi - 100)) best = pt;
    }
    return best.date.slice(0, 4);
  }, [chartSeries]);

  if (!isReady) return null;

  return (
    <div className='mt-24 grid grid-cols-1 md:grid-cols-3 gap-4'>
      <Card ref={cardsRef.montant} className='stat-card'>
        <CardContent className='h-full flex flex-col justify-center'>
          <div className='text-sm text-gray-600'>AMOUNT IN {currencyCode}</div>
          {typeof result.adjustedAmount === 'number' ? (
            <div className='text-xl md:text-3xl font-extrabold tracking-tight'>
              <NumberFlow
                value={result.adjustedAmount}
                format={{
                  style: 'currency',
                  currency: currencyCode,
                  maximumFractionDigits: 0,
                }}
              />
            </div>
          ) : (
            <div className='text-2xl font-semibold'>—</div>
          )}
        </CardContent>
      </Card>
      <Card ref={cardsRef.difference} className='stat-card'>
        <CardContent className='h-full flex flex-col justify-center'>
          <div className='text-sm text-gray-600'>Différence %</div>
          {typeof result.pctChange === 'number' ? (
            <div
              className={`text-xl md:text-3xl font-extrabold tracking-tight ${
                result.pctChange > 0
                  ? 'text-emerald-600'
                  : result.pctChange < 0
                  ? 'text-rose-600'
                  : 'text-foreground'
              }`}
            >
              <NumberFlow
                value={result.pctChange / 100}
                format={{ style: 'percent', maximumFractionDigits: 2 }}
              />
            </div>
          ) : (
            <div className='text-2xl font-semibold'>—</div>
          )}
        </CardContent>
      </Card>
      <Card ref={cardsRef.cpi} className='stat-card'>
        <CardContent className='h-full flex flex-col justify-center'>
          <div className='text-sm text-gray-600'>CPI (origine → cible)</div>
          {typeof result.cpiFrom === 'number' &&
          typeof result.cpiTo === 'number' ? (
            <div className='text-2xl font-semibold font-mono tabular-nums flex items-center gap-2'>
              <NumberFlow
                value={result.cpiFrom}
                format={{ maximumFractionDigits: 1 }}
              />
              <span>→</span>
              <NumberFlow
                value={result.cpiTo}
                format={{ maximumFractionDigits: 1 }}
              />
            </div>
          ) : (
            <div className='text-2xl font-semibold'>—</div>
          )}
          {baseYear && (
            <div className='text-xs text-muted-foreground mt-2'>
              Base ~ {baseYear}=100 (indicatif)
            </div>
          )}
        </CardContent>
      </Card>
      <Card
        ref={cardsRef.chart}
        className='h-fit w-full rounded-lg border p-2 col-span-3'
      >
        <ChartContainer
          config={{
            cpi: { label: 'CPI', color: 'hsl(221, 83%, 53%)' },
          }}
        >
          <LineChart
            data={chartSeries}
            margin={{ left: 12, right: 12, top: 8, bottom: 8 }}
          >
            <XAxis
              dataKey='date'
              tick={{ fontSize: 12 }}
              interval='preserveStartEnd'
            />
            <YAxis tick={{ fontSize: 12 }} domain={['auto', 'auto']} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              type='monotone'
              dataKey='cpi'
              stroke='var(--color-cpi)'
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </Card>
    </div>
  );
}
