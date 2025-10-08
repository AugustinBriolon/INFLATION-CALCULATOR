import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useApp } from '@/context/AppContext';
import NumberFlow from '@number-flow/react';
import { useMemo, useState } from 'react';

type YearFlowProps = {
  minYear?: number;
  maxYear?: number;
  initialAmount?: number;
  onChange?: (data: { year1: number; year2: number; amount: number }) => void;
};

export default function YearFlow({
  minYear = 1960,
  maxYear = new Date().getFullYear() - 1,
  initialAmount = 100,
  onChange,
}: YearFlowProps) {
  const app = useApp();

  const years = useMemo(() => {
    const arr: number[] = [];
    for (let y = maxYear; y >= minYear; y -= 1) arr.push(y);
    return arr;
  }, [minYear, maxYear]);

  const [year1, setYear1] = useState<string>('');
  const [year2, setYear2] = useState<string>('');
  const [amount, setAmount] = useState<number>(app.amount ?? initialAmount);

  const canEmit = year1 !== '' && year2 !== '';

  function handleAmountChange(v: number) {
    setAmount(v);
    app.setAmount(v);
    if (canEmit && onChange)
      onChange({ year1: Number(year1), year2: Number(year2), amount: v });
  }

  function handleYear1Change(v: string) {
    setYear1(v);
    app.setYear1(v === '' ? null : Number(v));
    if (year2 !== '' && onChange)
      onChange({ year1: Number(v), year2: Number(year2), amount });
  }
  function handleYear2Change(v: string) {
    setYear2(v);
    app.setYear2(v === '' ? null : Number(v));
    if (year1 !== '' && onChange)
      onChange({ year1: Number(year1), year2: Number(v), amount });
  }

  return (
    <div className='w-full max-w-3xl mx-auto space-y-16 my-32'>
      <div className='text-center space-y-3'>
        <div className='text-sm text-muted-foreground'>INITIAL AMOUNT</div>
        <div className='text-6xl md:text-7xl tracking-tight'>
          <NumberFlow
            className='font-mono'
            value={amount}
            format={{
              style: 'currency',
              currency: app.currencyCode,
              maximumFractionDigits: 0,
            }}
          />
        </div>

        <Slider
          value={[amount]}
          min={10}
          max={1000000}
          step={10}
          onValueChange={(vals) => handleAmountChange(vals[0] ?? amount)}
        />
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
        <div className='flex flex-col gap-2'>
          <Label>YEAR 1</Label>
          <Select value={year1} onValueChange={handleYear1Change}>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='SELECT A YEAR' />
            </SelectTrigger>
            <SelectContent className='max-h-72'>
              {years.map((y) => (
                <SelectItem key={`y1-${y}`} value={String(y)}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className='flex flex-col gap-2'>
          <Label>YEAR 2</Label>
          <Select value={year2} onValueChange={handleYear2Change}>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='SELECT A YEAR' />
            </SelectTrigger>
            <SelectContent className='max-h-72'>
              {[...years].reverse().map((y) => (
                <SelectItem key={`y2-${y}`} value={String(y)}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
