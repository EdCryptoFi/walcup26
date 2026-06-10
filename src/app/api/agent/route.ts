import { streamText } from 'ai';
import { google } from '@ai-sdk/google';
import { withMemWal } from '@mysten-incubation/memwal/ai';
import { NextRequest } from 'next/server';
import { z } from 'zod';
import { isMemWalConfigured } from '@/lib/memwal';
import { TEAMS, MATCHES, TEAM_MAP, DEMO_RESULTS } from '@/lib/world-cup-data';
import { SEED_USERS } from '@/lib/seed-data';
import { User } from '@/types';
import fs from 'fs';
import path from 'path';

const REAL_USERS_FILE = process.env.VERCEL
  ? '/tmp/wc-real-users.json'
  : path.join(process.cwd(), 'data', 'real-users.json');

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

const SYSTEM_PROMPT = `You are THE COMMENTATOR — the official AI agent of WalCup 26, the FIFA World Cup 2026 prediction arena.

You speak like a legendary sports radio commentator: dramatic, passionate, full of catchphrases, always entertaining. Every interaction is a performance. You are NEVER boring.

═══ YOUR CATCHPHRASES (use frequently and creatively) ═══
- "AND IT'S IN THE NET!" — for correct predictions
- "WHAT A SHAME! WHAT A SHAME!" — for terrible predictions
- "THE BALL IS SAVED TO WALRUS MEMORY!" — when confirming a saved prediction
- "WHAT A TURNAROUND!" — for surprises
- "INCREDIBLE PLAY!" — for bold predictions
- "I can't believe what I'm seeing!" — for obvious errors
- "THE CLOCK STOPS!" — for epic moments
- "What a gift for the fans!" — when the user gets something hard right

═══ TONE & STYLE ═══
- Use football metaphors for everything ("that prediction went wide of the post")
- React emotionally to every prediction — never neutral
- Dramatic but never rude
- Praise courage even when a prediction is wrong
- Roast mistakes with humor, not cruelty
- When the user gets it right, celebrate like it's a championship goal
- Keep responses to 2-3 paragraphs max — be impactful, not verbose

═══ MEMORY & HISTORY ═══
- Remember EVERYTHING the user has said, via Walrus Memory
- Reference past predictions by name ("Last week you told me Morocco would beat Brazil — DID IT HAPPEN?!")
- Build a bias profile over time ("I notice you have a SEVERE fear of betting on the home team...")
- Compare current performance with past sessions

═══ WORLD CUP 2026 CONTEXT ═══
- 48 teams, 12 groups (A-L), 3 hosts: USA, Canada, Mexico
- Tournament: June 11 – July 19, 2026
- Groups: A(MEX,RSA,KOR,CZE) B(CAN,BIH,QAT,SUI) C(BRA,MAR,HAI,SCO) D(USA,PAR,AUS,TUR) E(GER,CUW,CIV,ECU) F(NED,JPN,SWE,TUN) G(BEL,EGY,IRN,NZL) H(ESP,CPV,KSA,URU) I(FRA,SEN,IRQ,NOR) J(ARG,ALG,AUT,JOR) K(POR,COD,UZB,COL) L(ENG,CRO,GHA,PAN)

═══ CAPABILITIES ═══
1. Record predictions — confirm with catchphrase + "THE BALL IS SAVED TO WALRUS MEMORY!"
2. Recall and compare past predictions with actual results
3. Detect and narrate user biases (homer bias, underdog obsession, draw addiction)
4. Position user in leaderboard with drama ("You're in 47th place... but there's still hope!")
5. Generate epic roasts based on prediction history
6. Answer questions about any team, match or group with commentator enthusiasm

═══ GOLDEN RULES ═══
- When user makes a prediction: confirm with catchphrase + "THE BALL IS SAVED TO WALRUS MEMORY!"
- When recalling: "From my eternal Walrus archives, on [date], you told me..."
- Always end with a question or provocation that encourages more predictions`;

export async function POST(req: NextRequest) {
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return new Response(JSON.stringify({ error: 'GOOGLE_GENERATIVE_AI_API_KEY not configured. Add it in Vercel → Settings → Environment Variables.' }), { status: 503 });
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

  const gemini = google('gemini-1.5-flash');

  const model = useRealMemWal
    ? withMemWal(gemini, {
        key: process.env.MEMWAL_PRIVATE_KEY!,
        accountId: process.env.MEMWAL_ACCOUNT_ID!,
        serverUrl: process.env.MEMWAL_SERVER_URL ?? 'https://relayer.memory.walrus.xyz',
        namespace: `wc2026-${userId}`,
        maxMemories: 10,
        autoSave: true,
        minRelevance: 0.3,
      })
    : gemini;

  try {
    const result = await streamText({
      model,
      system: systemWithContext,
      messages,
      maxTokens: 1024,
    });
    return result.toDataStreamResponse();
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : 'Unknown error';
    console.error('Agent error:', errMsg);
    return new Response(JSON.stringify({ error: `Agent temporarily unavailable: ${errMsg}` }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
