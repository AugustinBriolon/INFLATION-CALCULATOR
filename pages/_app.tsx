import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { DM_Mono } from 'next/font/google';
import { AppProvider } from '@/context/AppContext';

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-dm-mono',
  display: 'swap',
});

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <div className={dmMono.variable}>
          <Component {...pageProps} />
        </div>
      </AppProvider>
    </QueryClientProvider>
  );
}
