'use client';
import { useState, useEffect } from 'react';

export function PlayerCount() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    function load() {
      fetch('/api/leaderboard', { cache: 'no-store' })
        .then((r) => r.json())
        .then((d) => setCount(d.total ?? d.leaderboard?.length ?? 0))
        .catch(() => {});
    }
    load();
    const id = setInterval(load, 30_000);
    return () => clearInterval(id);
  }, []);

  return <>{count ?? '…'}</>;
}
