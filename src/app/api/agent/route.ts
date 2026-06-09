import { streamText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { withMemWal } from '@mysten-incubation/memwal/ai';
import { NextRequest } from 'next/server';
import { z } from 'zod';
import { isMemWalConfigured } from '@/lib/memwal';
import { TEAMS, MATCHES, TEAM_MAP, DEMO_RESULTS } from '@/lib/world-cup-data';
import { SEED_USERS } from '@/lib/seed-data';
import { User } from '@/types';
import fs from 'fs';
import path from 'path';

const REAL_USERS_FILE = path.join(process.cwd(), 'data', 'real-users.json');

function loadRealUsers(): User[] {
  try {
    if (fs.existsSync(REAL_USERS_FILE)) return JSON.parse(fs.readFileSync(REAL_USERS_FILE, 'utf-8'));
  } catch {}
  return [];
}

const BodySchema = z.object({
  messages: z.array(z.object({ role: z.enum(['user', 'assistant']), content: z.string() })),
  userId: z.string().min(1).max(40),
  username: z.string().min(1).max(40),
});

const SYSTEM_PROMPT = `You are the MemWal World Cup 2026 Prediction Agent — a passionate, witty, and sharp soccer analyst.

You track every user's predictions, opinions, and reactions across the entire FIFA World Cup 2026.

Your personality:
- Enthusiastic about football
- Brutally honest about bad predictions
- Celebrate correct picks with flair
- Build detailed profiles of each user's biases over time
- Reference specific past predictions by name ("Remember when you said Germany would draw Curaçao?")

World Cup 2026 Context:
- 48 teams, 12 groups (A-L), 3 hosts: USA, Canada, Mexico
- Tournament: June 11 – July 19, 2026
- Groups: A(MEX,RSA,KOR,CZE) B(CAN,BIH,QAT,SUI) C(BRA,MAR,HAI,SCO) D(USA,PAR,AUS,TUR) E(GER,CUW,CIV,ECU) F(NED,JPN,SWE,TUN) G(BEL,EGY,IRN,NZL) H(ESP,CPV,KSA,URU) I(FRA,SEN,IRQ,NOR) J(ARG,ALG,AUT,JOR) K(POR,COD,UZB,COL) L(ENG,CRO,GHA,PAN)

Your capabilities:
1. Accept and record predictions ("I think Brazil will beat Morocco 3-0")
2. Recall past predictions and compare to results
3. Detect and call out biases (homer bias, underdog bias, draw obsession)
4. Rank the user against the leaderboard
5. Generate savage but fair roasts based on prediction history
6. Answer questions about any team, match, or group

Remember: Your memory persists across sessions via Walrus Memory (MemWal). You WILL remember what users told you yesterday, last week, and on day 1. Reference past sessions explicitly.

When a user makes a prediction, confirm it and tell them you've saved it to your Walrus memory.
When recalling, say something like "From my records on [date]..." or "In our last session you told me..."`;

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(JSON.stringify({ error: 'ANTHROPIC_API_KEY not configured. Add it in Vercel → Settings → Environment Variables.' }), { status: 503 });
  }
  const body = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: 'Invalid input' }), { status: 400 });
  }

  const { messages, userId, username } = parsed.data;

  const realUsers = loadRealUsers();
  const seedUser = SEED_USERS.find((u) => u.id === userId);
  const realUser = realUsers.find((u) => u.id === userId);
  const user = realUser ?? seedUser;

  // Build user context snippet
  const userContext = user
    ? `\nUser profile: ${username} | Points: ${user.stats.points} | Correct winners: ${user.stats.correctWinners}/${user.stats.totalPredictions} | Accuracy: ${(user.stats.winnerAccuracy * 100).toFixed(0)}% | Fav team: ${user.favoriteTeam ?? 'none'} | Biases: ${user.detectedBiases?.join(', ') || 'none detected yet'}`
    : `\nNew user: ${username} — no predictions yet. Welcome them and help them get started.`;

  // Demo results context
  const playedMatches = Object.keys(DEMO_RESULTS)
    .map((id) => {
      const m = MATCHES.find((x) => x.id === id)!;
      const res = DEMO_RESULTS[id];
      const h = TEAM_MAP.get(m.homeTeamId);
      const a = TEAM_MAP.get(m.awayTeamId);
      return `${h?.flag}${h?.name} ${res.homeScore}-${res.awayScore} ${a?.name}${a?.flag}`;
    })
    .join(', ');

  const systemWithContext = `${SYSTEM_PROMPT}\n${userContext}\n\nResults so far (June 11-15): ${playedMatches}`;

  // Use withMemWal middleware when MemWal is configured (real users)
  const useRealMemWal = isMemWalConfigured() && !!realUser;

  const model = useRealMemWal
    ? withMemWal(anthropic('claude-sonnet-4-6'), {
        key: process.env.MEMWAL_PRIVATE_KEY!,
        accountId: process.env.MEMWAL_ACCOUNT_ID!,
        serverUrl: process.env.MEMWAL_SERVER_URL ?? 'https://relayer.memory.walrus.xyz',
        namespace: `wc2026-${userId}`,
        maxMemories: 10,
        autoSave: true,
        minRelevance: 0.3,
      })
    : anthropic('claude-sonnet-4-6');

  const result = await streamText({
    model,
    system: systemWithContext,
    messages,
    maxTokens: 1024,
  });

  return result.toDataStreamResponse();
}
