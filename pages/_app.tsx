import type { AppProps } from 'next/app';
import { SWRConfig } from 'swr';
import { Syne, DM_Sans, JetBrains_Mono } from 'next/font/google';
import Navbar from '@/components/layout/Navbar';
import '../styles/globals.css';

const syne = Syne({ subsets: ['latin'], variable: '--font-syne', display: 'swap' });
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans', display: 'swap' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains', display: 'swap' });

const swrConfig = {
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  dedupingInterval: 60000,
  errorRetryCount: 3,
  errorRetryInterval: 5000,
  onError: (error: Error) => {
    console.error('SWR Error:', error);
  }
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig value={swrConfig}>
      <div className={`${syne.variable} ${dmSans.variable} ${jetbrainsMono.variable} font-sans min-h-screen bg-[#0D0F14] text-[#E8EDFF]`}>
        <Navbar />
        <Component {...pageProps} />
      </div>
    </SWRConfig>
  );
}

