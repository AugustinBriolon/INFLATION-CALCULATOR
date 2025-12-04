import { Card, CardContent } from '@/components/ui/card';
import { useApp } from '@/context/AppContext';
import { useInflation } from '@/hooks/useInflation';
import { currencySymbol } from '@/lib/currencies';
import products from '@/lib/products.json';
import { useGSAP } from '@gsap/react';
import NumberFlow from '@number-flow/react';
import gsap from 'gsap';
import { useMemo, useRef, useState } from 'react';

type ProductKey = keyof typeof products;

export default function ProductResults() {
  const { result, currencyCode } = useInflation();
  const { year1, year2, amount } = useApp();
  const [hasAnimated, setHasAnimated] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const productCalculations = useMemo(() => {
    if (!result || !result.cpiFrom || !result.cpiTo || !year1 || !year2)
      return [];

    const productKeys = Object.keys(products) as ProductKey[];

    return productKeys.map((productKey) => {
      const product = products[productKey];
      const priceToday = product.priceToday;
      const cpi2024 = 100;
      const priceAtYear1 = priceToday * (Number(result.cpiFrom) / cpi2024);
      const priceAtYear2 = priceToday * (Number(result.cpiTo) / cpi2024);
      const quantityAtYear1 = Math.floor(amount / priceAtYear1);
      const quantityAtYear2 = Math.floor(result.adjustedAmount / priceAtYear2);

      return {
        key: productKey,
        product,
        quantityAtYear1,
        quantityAtYear2,
        priceAtYear1,
        priceAtYear2,
        priceToday,
        difference: quantityAtYear1 - quantityAtYear2,
        percentageChange:
          quantityAtYear1 > 0
            ? ((quantityAtYear2 - quantityAtYear1) / quantityAtYear1) * 100
            : 0,
      };
    });
  }, [result, year1, year2, amount]);

  useGSAP(() => {
    if (hasAnimated || !containerRef.current) return;

    const cards = cardsRef.current.filter(Boolean);
    if (cards.length === 0) return;

    gsap.from(cards, {
      autoAlpha: 0,
      y: 25,
      duration: 0.5,
      stagger: 0.05,
      ease: 'power1.inOut',
      onComplete: () => setHasAnimated(true),
    });
  }, [hasAnimated]);

  if (!result) return null;

  return (
    <div ref={containerRef} className='space-y-6'>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
        {productCalculations.map((calc, index) => (
          <Card
            key={calc.key}
            ref={(el) => {
              cardsRef.current[index] = el;
            }}
            className='stat-card py-0'
          >
            <CardContent className='h-full flex flex-col gap-6 justify-center p-4 sm:p-6'>
              <div className='flex items-center gap-4'>
                <span className='text-3xl'>{calc.product.icon}</span>
                <span className='text-sm text-gray-600 uppercase'>
                  {calc.product.name}
                </span>
              </div>

              <div className='space-y-1'>
                <div className='text-sm text-gray-600'>
                  {Math.min(year1 || 0, year2 || 0)}
                </div>
                <div className='flex items-center justify-start gap-2'>
                  <NumberFlow
                    value={calc.quantityAtYear1}
                    format={{ maximumFractionDigits: 0 }}
                    className='font-bold text-2xl text-gray-900'
                  />
                  <span className='text-sm text-gray-600'>
                    {calc.product.unit}
                    {calc.quantityAtYear1 > 0 ? 's' : ''}
                  </span>
                </div>
              </div>

              <div className='space-y-1'>
                <div className='text-sm text-gray-600'>
                  {Math.max(year1 || 0, year2 || 0)}
                </div>
                <div className='flex items-center justify-start gap-2'>
                  <NumberFlow
                    value={calc.quantityAtYear2}
                    format={{ maximumFractionDigits: 0 }}
                    className='font-bold text-2xl text-gray-900'
                  />
                  <span className='text-sm text-gray-600'>
                    {calc.product.unit}
                    {calc.quantityAtYear2 > 0 ? 's' : ''}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
