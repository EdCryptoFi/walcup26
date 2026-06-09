import { MemWal } from '@mysten-incubation/memwal';

const SERVER_URL =
  process.env.MEMWAL_SERVER_URL ?? 'https://relayer.memory.walrus.xyz';

/**
 * Returns a MemWal client scoped to a specific user namespace.
 * Namespace pattern: "wc2026-{userId}"
 */
export function getMemWal(userId: string) {
  const key = process.env.MEMWAL_PRIVATE_KEY;
  const accountId = process.env.MEMWAL_ACCOUNT_ID;

  if (!key || !accountId) {
    throw new Error(
      'MEMWAL_PRIVATE_KEY and MEMWAL_ACCOUNT_ID must be set in environment variables.'
    );
  }

  return MemWal.create({
    key,
    accountId,
    serverUrl: SERVER_URL,
    namespace: `wc2026-${userId}`,
  });
}

/**
 * Returns a MemWal client scoped to the global registry namespace.
 * Used to track the list of all users who have interacted.
 */
export function getRegistryMemWal() {
  const key = process.env.MEMWAL_PRIVATE_KEY;
  const accountId = process.env.MEMWAL_ACCOUNT_ID;

  if (!key || !accountId) {
    throw new Error(
      'MEMWAL_PRIVATE_KEY and MEMWAL_ACCOUNT_ID must be set in environment variables.'
    );
  }

  return MemWal.create({
    key,
    accountId,
    serverUrl: SERVER_URL,
    namespace: 'wc2026-registry',
  });
}

export function isMemWalConfigured(): boolean {
  return !!(process.env.MEMWAL_PRIVATE_KEY && process.env.MEMWAL_ACCOUNT_ID);
}

/**
 * Formats a prediction as a human-readable string for MemWal storage.
 * MemWal uses semantic search, so natural language is better than raw JSON.
 */
export function formatPredictionMemory(opts: {
  username: string;
  matchLabel: string;       // e.g. "Brazil vs Morocco (Group C, MD1)"
  predicted: string;        // e.g. "Brazil win" or "draw"
  score?: string;           // e.g. "2-0"
  confidence: number;       // 1-5
  opinion?: string;
  timestamp: string;
}): string {
  const parts = [
    `[PREDICTION] ${opts.username} predicted ${opts.predicted} in ${opts.matchLabel}.`,
    opts.score ? `Predicted score: ${opts.score}.` : '',
    `Confidence: ${opts.confidence}/5.`,
    opts.opinion ? `Opinion: "${opts.opinion}"` : '',
    `Recorded at: ${opts.timestamp}.`,
  ];
  return parts.filter(Boolean).join(' ');
}

/**
 * Formats a match result + prediction outcome for MemWal storage.
 */
export function formatResultMemory(opts: {
  username: string;
  matchLabel: string;
  result: string;           // e.g. "Brazil 4-0 Morocco"
  predicted: string;
  correct: boolean;
  pointsEarned: number;
  cumulativePoints: number;
}): string {
  return [
    `[RESULT] ${opts.matchLabel} ended ${opts.result}.`,
    `${opts.username} predicted ${opts.predicted} — ${opts.correct ? 'CORRECT ✓' : 'WRONG ✗'}.`,
    `Points earned: ${opts.pointsEarned}. Total: ${opts.cumulativePoints} pts.`,
  ].join(' ');
}
