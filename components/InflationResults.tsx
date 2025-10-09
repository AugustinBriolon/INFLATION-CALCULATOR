import { Card, CardContent } from '@/components/ui/card';
import { useInflation } from '@/hooks/useInflation';
import { currencySymbol } from '@/lib/currencies';
import { useGSAP } from '@gsap/react';
import NumberFlow from '@number-flow/react';
import gsap from 'gsap';
import { useRef, useState } from 'react';
import { Line, LineChart, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from './ui/chart';
import StatExplanationModal from './StatExplanationModal';
import explanations from '@/lib/explanations.json';

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

    gsap.from(
      [
        cardsRef.montant.current,
        cardsRef.difference.current,
        cardsRef.cpi.current,
        cardsRef.chart.current,
      ],
      {
        autoAlpha: 0,
        filter: 'blur(10px)',
        y: 25,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power1.inOut',
        onComplete: () => setHasAnimated(true),
      }
    );
  }, [isReady, hasAnimated]);

  if (!result && !isReady) return null;

  return (
    <div className='space-y-4'>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
        <Card ref={cardsRef.montant} className='stat-card py-0'>
          <CardContent className='h-full flex flex-col justify-center p-4 sm:p-6'>
            <div className='flex items-center justify-between'>
              <div className='text-sm text-gray-600'>VALEUR ACTUELLE</div>
              <StatExplanationModal
                title={explanations.valeurActuelle.title}
                description={explanations.valeurActuelle.description}
              />
            </div>
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
        <Card ref={cardsRef.difference} className='stat-card py-0'>
          <CardContent className='h-full flex flex-col justify-center p-4 sm:p-6'>
            <div className='flex items-center justify-between'>
              <div className='text-sm text-gray-600'>PERTE DE VALEUR</div>
              <StatExplanationModal
                title={explanations.perteDeValeur.title}
                description={explanations.perteDeValeur.description}
              />
            </div>
            <div className='text-xl md:text-3xl font-medium tracking-tight'>
              <NumberFlow
                value={Math.abs(result?.pctChange ?? 0) / 100}
                format={{
                  style: 'percent',
                  maximumFractionDigits: (result?.pctChange ?? 0) > 10 ? 0 : 1,
                }}
              />
            </div>
            <div className='text-xs text-muted-foreground mt-1'>
              Votre argent a perdu cette valeur
            </div>
          </CardContent>
        </Card>
        <Card
          ref={cardsRef.cpi}
          className='stat-card py-0 sm:col-span-2 lg:col-span-1'
        >
          <CardContent className='h-full flex flex-col justify-center p-4 sm:p-6'>
            <div className='flex items-center justify-between'>
              <div className='text-sm text-gray-600'>INFLATION TOTALE</div>
              <StatExplanationModal
                title={explanations.inflationTotale.title}
                description={explanations.inflationTotale.description}
              />
            </div>
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
      </div>

      <Card
        ref={cardsRef.chart}
        className='h-fit w-full rounded-lg border pr-8 py-8'
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
