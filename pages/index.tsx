import CountrySelector from '@/components/CountrySelector';
import InflationResults from '@/components/InflationResults';
import YearFlow from '@/components/YearFlow';

export default function Home() {
  return (
    <div className='min-h-screen w-full flex flex-col items-center relative font-mono'>
      <CountrySelector />

      <div className='w-full max-w-6xl px-6 py-14 space-y-12'>
        <h1 className='text-4xl md:text-6xl font-medium tracking-tight text-center uppercase'>
          Calculateur d'inflation
        </h1>

        <YearFlow />

        <InflationResults />
      </div>
    </div>
  );
}
