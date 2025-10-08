import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { COUNTRIES, Country } from '@/lib/countries';
import { useRef, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export default function CountrySelector() {
  const { selectedCountry, setSelectedCountry } = useApp();
  const selectRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const currentCountry = COUNTRIES[selectedCountry];

  useGSAP(() => {
    if(!selectRef.current) return;

    gsap.from(selectRef.current, {
      autoAlpha: 0,
      scale: 0.9,
      delay: .5,
      duration: .2,
      ease: 'power1.inOut'
    })
  })

  return (
    <div ref={selectRef} className='fixed bottom-8 right-8 z-10'>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            className='flex items-center justify-between gap-2 w-42'
          >
            <div className='flex items-center gap-2'>
              <span className='text-lg'>{currentCountry.flag}</span>
              <span className='font-medium'>{currentCountry.name}</span>
            </div>
            <span className='text-sm text-muted-foreground'>
              {currentCountry.currencySymbol}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent align='end' className='w-42 p-0'>
          <div className='space-y-1'>
            {Object.values(COUNTRIES).map((country) => (
              <Button
                key={country.code}
                variant={selectedCountry === country.code ? 'default' : 'ghost'}
                className='flex items-center justify-between gap-0 w-full px-3 py-1'
                onClick={() => {
                  setSelectedCountry(country.code);
                  setIsOpen(false);
                }}
              >
                <div className='flex items-center gap-2'>
                  <span className='text-lg'>{country.flag}</span>
                  <span className='font-medium'>{country.name}</span>
                </div>
                <span className='text-sm text-muted-foreground'>
                  {country.currencySymbol}
                </span>
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
