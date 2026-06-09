import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { Providers } from '@/providers';
import { WalletConnect } from '@/components/wallet-connect';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'WalCup 26 — Sticker Album & Predictions on Walrus Memory',
  description: 'FIFA World Cup 2026 prediction arena with an AI agent that evolves across sessions. Collect stickers, make predictions, get roasted — all stored on-chain via Walrus Memory.',
  openGraph: {
    title: 'WalCup 26 — Collect. Predict. Get Roasted.',
    description: 'AI agent with persistent Walrus Memory tracks your World Cup 2026 predictions, detects your biases, and never forgets. Collect all 48 team stickers.',
    images: ['/imgs/logo.png'],
  },
};

function Header() {
  return (
    <header className="sticky top-0 z-50 bg-surface-container-low border-b border-outline-variant shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <Image src="/imgs/logo.png" alt="WalCup 26" width={120} height={44} className="object-contain" priority />
          </Link>

          <nav className="hidden md:flex items-center gap-1 text-sm">
            <Link href="/" className="rounded-lg px-3 py-1.5 text-on-surface-variant hover:text-primary font-bold text-sm transition-colors">
              Home
            </Link>
            <Link href="/groups" className="rounded-lg px-3 py-1.5 text-on-surface-variant hover:text-primary font-bold text-sm transition-colors">
              Groups
            </Link>
            <Link href="/users" className="rounded-lg px-3 py-1.5 text-on-surface-variant hover:text-primary font-bold text-sm transition-colors">
              Players
            </Link>
            <Link href="/dashboard" className="rounded-lg px-3 py-1.5 text-on-surface-variant hover:text-primary font-bold text-sm transition-colors">
              Dashboard
            </Link>
            <Link href="/album" className="rounded-lg px-3 py-1.5 text-on-surface-variant hover:text-primary font-bold text-sm transition-colors">
              🎴 Stickers
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/predict"
              className="bg-primary text-white rounded-full px-5 py-2 font-bold text-sm hover:scale-105 transition-all shadow-sm"
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
    <html lang="en" className={plusJakartaSans.variable}>
      <body className={`${plusJakartaSans.className} paper-texture text-on-surface`}>
        <Providers>
          <Header />
          <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
          <footer className="mt-16 border-t border-outline-variant bg-surface-container-low py-8">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <Image src="/imgs/logo.png" alt="WalCup 26" width={90} height={33} className="object-contain opacity-70" />
                <p className="text-xs text-on-surface-variant text-center">
                  Created by{' '}
                  <a href="https://x.com/EdCriptoFi/" className="text-primary hover:underline font-bold" target="_blank" rel="noopener noreferrer">
                    Ed
                  </a>
                  {' · '}Powered by{' '}
                  <a href="https://memory.walrus.xyz" className="text-secondary hover:underline" target="_blank" rel="noopener noreferrer">
                    Walrus Memory
                  </a>
                  {' · '}Built for{' '}
                  <a href="https://thewalrussessions.wal.app" className="text-secondary hover:underline" target="_blank" rel="noopener noreferrer">
                    Walrus Sessions 4
                  </a>
                </p>
                <div className="flex gap-3 text-xs text-on-surface-variant">
                  <a href="/docs" className="hover:text-primary transition-colors">Docs</a>
                  <span>·</span>
                  <a href="/cookies" className="hover:text-primary transition-colors">Cookie Policy</a>
                </div>
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
