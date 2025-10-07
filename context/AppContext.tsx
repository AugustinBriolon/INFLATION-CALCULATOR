import { createContext, useContext, useMemo, useState } from 'react';
import { Country, DEFAULT_COUNTRY, COUNTRIES } from '@/lib/countries';
import type { Currency } from '@/lib/currencies';

type AppState = {
  selectedCountry: Country;
  setSelectedCountry: (c: Country) => void;
  currencyCode: Currency;
  year1: number | null;
  setYear1: (y: number | null) => void;
  year2: number | null;
  setYear2: (y: number | null) => void;
  amount: number;
  setAmount: (a: number) => void;
};

const Ctx = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [selectedCountry, setSelectedCountry] =
    useState<Country>(DEFAULT_COUNTRY);
  const [year1, setYear1] = useState<number | null>(null);
  const [year2, setYear2] = useState<number | null>(null);
  const [amount, setAmount] = useState<number>(100);

  const currencyCode = COUNTRIES[selectedCountry].currency as Currency;

  const value = useMemo<AppState>(
    () => ({
      selectedCountry,
      setSelectedCountry,
      currencyCode,
      year1,
      setYear1,
      year2,
      setYear2,
      amount,
      setAmount,
    }),
    [selectedCountry, currencyCode, year1, year2, amount]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useApp must be used within <AppProvider>');
  return v;
}
