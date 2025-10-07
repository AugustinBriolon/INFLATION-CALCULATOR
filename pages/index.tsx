import CountrySelector from '@/components/CountrySelector';
import InflationResults from '@/components/InflationResults';
import YearFlow from '@/components/YearFlow';
import { useApp } from '@/context/AppContext';

export default function Home() {
  const app = useApp();

  return (
    <div className='min-h-screen w-full flex flex-col items-center relative font-mono'>
      <CountrySelector
        selectedCountry={app.selectedCountry}
        onCountryChange={app.setSelectedCountry}
      />

      <div className='w-full max-w-6xl px-6 py-14 space-y-12'>
        <h1 className='text-4xl md:text-6xl font-bold tracking-tight text-center uppercase'>
          Inflation Calculator
        </h1>

        <YearFlow initialAmount={app.amount} />

        <InflationResults />
      </div>
    </div>
  );
}
