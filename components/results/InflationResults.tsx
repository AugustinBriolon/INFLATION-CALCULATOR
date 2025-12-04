import { ChartSpline, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { Switch } from '../ui/switch';
import ProductResults from './ProductResults';
import StatsResults from './StatsResults';
import { useInflation } from '@/hooks/useInflation';

export default function InflationResults() {
  const { isReady } = useInflation();
  const [showProductResults, setShowProductResults] = useState(false);

  if (!isReady) return null;

  return (
    <div className='w-full flex flex-col items-center gap-8'>
      {/* Switch avec labels clairs */}
      <div className='flex items-center gap-4 bg-gray-100 rounded-lg p-1'>
        <div className='flex items-center gap-2 px-3 py-2'>
          <ChartSpline className='w-4 h-4' />
          <span className='text-sm font-medium'>Statistiques</span>
        </div>
        <Switch
          checked={showProductResults}
          onCheckedChange={setShowProductResults}
        />
        <div className='flex items-center gap-2 px-3 py-2'>
          <ShoppingCart className='w-4 h-4' />
          <span className='text-sm font-medium'>Produits</span>
        </div>
      </div>

      {showProductResults ? <ProductResults /> : <StatsResults />}
    </div>
  );
}
