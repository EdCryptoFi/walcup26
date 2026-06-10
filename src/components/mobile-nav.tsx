'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { href: '/',          label: 'Home' },
  { href: '/predict',   label: '⚽ Predict' },
  { href: '/groups',    label: 'Groups' },
  { href: '/users',     label: 'Players' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/album',     label: '🎴 Stickers' },
  { href: '/docs',      label: 'Docs' },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      {/* Hamburger button — only visible on mobile */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="md:hidden flex flex-col justify-center items-center w-9 h-9 rounded-lg hover:bg-surface-container transition-colors gap-1.5"
        aria-label="Toggle menu"
        aria-expanded={open}
      >
        <span className={`block h-0.5 w-5 bg-on-surface rounded-full transition-all duration-200 ${open ? 'rotate-45 translate-y-2' : ''}`} />
        <span className={`block h-0.5 w-5 bg-on-surface rounded-full transition-all duration-200 ${open ? 'opacity-0' : ''}`} />
        <span className={`block h-0.5 w-5 bg-on-surface rounded-full transition-all duration-200 ${open ? '-rotate-45 -translate-y-2' : ''}`} />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <nav
        className={`md:hidden fixed top-16 left-0 right-0 z-50 bg-surface-container-low border-b border-outline-variant shadow-xl transition-all duration-200 ${open ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'}`}
      >
        <div className="px-4 py-3 space-y-1">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`block rounded-xl px-4 py-3 font-bold text-sm transition-colors ${pathname === href ? 'bg-primary text-white' : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'}`}
            >
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
