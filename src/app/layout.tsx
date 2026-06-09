import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import './globals.css';
import { Providers } from '@/providers';
import { WalletConnect } from '@/components/wallet-connect';

export const metadata: Metadata = {
  title: 'WalCup 26 — World Cup Predictions on Walrus',
  description: 'FIFA World Cup 2026 AI prediction agent with persistent memory on the Walrus decentralized network. Make predictions, get roasted, climb the leaderboard.',
  openGraph: {
    title: 'WalCup 26',
    description: 'World Cup 2026 Prediction Arena powered by Walrus Memory',
    images: ['/imgs/logo.png'],
  },
};

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-sm shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <Image src="/imgs/logo.png" alt="WalCup 26" width={120} height={44} className="object-contain" priority />
          </Link>

          <nav className="hidden md:flex items-center gap-1 text-sm">
            <Link href="/" className="rounded-lg px-3 py-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
              Home
            </Link>
            <Link href="/groups" className="rounded-lg px-3 py-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
              Groups
            </Link>
            <Link href="/users" className="rounded-lg px-3 py-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
              Players
            </Link>
            <Link href="/dashboard" className="rounded-lg px-3 py-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
              Dashboard
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/predict"
              className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 transition-colors"
            >
              Predict
            </Link>
            <WalletConnect />
          </div>
        </div>
      </div>
    </header>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header />
          <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
          <footer className="mt-16 border-t border-slate-200 bg-white py-8">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <Image src="/imgs/logo.png" alt="WalCup 26" width={90} height={33} className="object-contain opacity-70" />
              <p className="text-xs text-slate-400 text-center">
                Powered by{' '}
                <a href="https://memory.walrus.xyz" className="text-wc-gold hover:underline" target="_blank" rel="noopener noreferrer">
                  Walrus Memory
                </a>
                {' · '}Built for{' '}
                <a href="https://thewalrussessions.wal.app" className="text-wc-gold hover:underline" target="_blank" rel="noopener noreferrer">
                  Walrus Sessions 4
                </a>
                {' · '}Sui Testnet
              </p>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
