'use client';

import { useEffect, useState } from 'react';

interface MemoryDepthProps {
  userId: string;
  isReal: boolean;
  localCount: number;
}

export function MemoryDepth({ userId, isReal, localCount }: MemoryDepthProps) {
  const [total, setTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isReal) {
      setTotal(localCount);
      return;
    }
    setLoading(true);
    fetch(`/api/recall?userId=${encodeURIComponent(userId)}&query=prediction result session&limit=50`)
      .then((r) => r.json())
      .then((d) => setTotal(d.total ?? d.results?.length ?? localCount))
      .catch(() => setTotal(localCount))
      .finally(() => setLoading(false));
  }, [userId, isReal, localCount]);

  if (loading) {
    return (
      <span className="inline-flex items-center gap-1 text-primary">
        <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
        querying…
      </span>
    );
  }

  return (
    <span className="text-primary font-mono">
      {total ?? localCount} on-chain
      {isReal && <span className="text-on-surface-variant text-[10px] ml-1">(all sessions)</span>}
    </span>
  );
}
