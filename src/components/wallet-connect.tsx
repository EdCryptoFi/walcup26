'use client';

import { ConnectButton, useCurrentAccount, useDisconnectWallet } from '@mysten/dapp-kit';
import Link from 'next/link';

export function WalletConnect() {
  const account = useCurrentAccount();

  if (!account) {
    return (
      <div className="wc-connect-btn">
        <ConnectButton connectText="Connect Wallet" />
      </div>
    );
  }

  const short = `${account.address.slice(0, 6)}…${account.address.slice(-4)}`;

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/dashboard"
        className="flex items-center gap-2 rounded-lg bg-primary border border-primary px-3 py-1.5 text-sm font-bold text-white hover:bg-primary/90 transition-colors shadow-sm"
      >
        <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
        <span className="font-mono">{short}</span>
      </Link>
    </div>
  );
}

export function useWalletIdentity() {
  const account = useCurrentAccount();
  if (!account) return { userId: null, username: null, address: null };

  const address = account.address;
  const userId = `sui-${address.slice(2, 10)}`;
  const username = `${address.slice(0, 6)}…${address.slice(-4)}`;
  return { userId, username, address };
}
