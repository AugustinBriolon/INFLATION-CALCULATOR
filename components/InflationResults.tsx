import { Card, CardContent } from '@/components/ui/card';
import { useInflation } from '@/hooks/useInflation';
import { currencySymbol } from '@/lib/currencies';
import { useGSAP } from '@gsap/react';
import NumberFlow from '@number-flow/react';
import gsap from 'gsap';
import { useRef, useState } from 'react';
import { Line, LineChart, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from './ui/chart';

export default function InflationResults() {
  const { isReady, result, chartSeries, currencyCode } = useInflation();
  const [hasAnimated, setHasAnimated] = useState(false);

  const cardsRef = {
    montant: useRef<HTMLDivElement | null>(null),
    difference: useRef<HTMLDivElement | null>(null),
    cpi: useRef<HTMLDivElement | null>(null),
    chart: useRef<HTMLDivElement | null>(null),
  };

  useGSAP(() => {
    if (!isReady || hasAnimated) return;

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
        onComplete: () => setHasAnimated(true),
      }
    );
  }, [isReady, hasAnimated]);

  if (!result && !isReady) return null;

  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
      <Card ref={cardsRef.montant} className='stat-card'>
        <CardContent className='h-full flex flex-col justify-center'>
          <div className='text-sm text-gray-600'>VALEUR ACTUELLE</div>
          <div className='text-xl md:text-3xl font-medium tracking-tight'>
            <NumberFlow
              value={result?.adjustedAmount ?? 0}
              format={{
                style: 'currency',
                currency: currencyCode,
                currencyDisplay: 'symbol',
                maximumFractionDigits:
                  (result?.adjustedAmount ?? 0) > 10 ? 0 : 1,
              }}
            />
          </div>

          <div className='text-xs text-muted-foreground mt-1'>
            Ce que vaut aujourd'hui votre argent
          </div>
        </CardContent>
      </Card>
      <Card ref={cardsRef.difference} className='stat-card'>
        <CardContent className='h-full flex flex-col justify-center'>
          <div className='text-sm text-gray-600'>PERTE DE VALEUR</div>
          <div className='text-xl md:text-3xl font-medium tracking-tight'>
            <NumberFlow
              value={Math.abs(result?.pctChange ?? 0) / 100}
              format={{
                style: 'percent',
                maximumFractionDigits:
                  (result?.pctChange ?? 0) > 10 ? 0 : 1,
              }}
            />
          </div>
          <div className='text-xs text-muted-foreground mt-1'>
            Votre argent a perdu cette valeur
          </div>
        </CardContent>
      </Card>
      <Card ref={cardsRef.cpi} className='stat-card'>
        <CardContent className='h-full flex flex-col justify-center'>
          <div className='text-sm text-gray-600'>INFLATION TOTALE</div>
          <div className='text-xl md:text-3xl font-medium tracking-tight'>
            <NumberFlow
              value={(result?.inflationRate ?? 0) / 100}
              format={{
                style: 'percent',
                maximumFractionDigits:
                  (result?.inflationRate ?? 0) > 10 ? 0 : 1,
              }}
            />
          </div>
          <div className='text-xs text-muted-foreground mt-1'>
            Sur toute la période
          </div>
        </CardContent>
      </Card>
      <Card
        ref={cardsRef.chart}
        className='h-fit w-full rounded-lg border p-2 col-span-3'
      >
        <ChartContainer
          config={{
            value: {
              label: 'Valeur de votre argent',
              color: 'hsl(0, 84%, 60%)',
            },
          }}
        >
          <LineChart
            data={chartSeries || []}
            margin={{ left: 12, right: 12, top: 8, bottom: 8 }}
          >
            <XAxis
              dataKey='date'
              tick={{ fontSize: 12 }}
              interval='preserveStartEnd'
            />
            <YAxis
              tick={{ fontSize: 12 }}
              domain={['auto', 'auto']}
              tickFormatter={(value) => `€${value.toFixed(0)}`}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => [
                    `${currencySymbol(currencyCode)}${Number(value).toFixed(
                      0
                    )}`,
                  ]}
                />
              }
            />
            <Line
              type='monotone'
              dataKey='value'
              stroke='var(--color-value)'
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </Card>
    </div>
  );
}
