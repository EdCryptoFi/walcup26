# WalCup 26 ⚽

World Cup 2026 prediction arena powered by **Walrus Memory** — every prediction is stored as a permanent on-chain blob, and an AI agent that remembers your full history across sessions.

Built for the [Walrus Sessions 4](https://thewalrussessions.wal.app) hackathon.

**Live demo:** [walcup26.vercel.app](https://walcup26.vercel.app)  
**Video:** [youtu.be/CNJizSaD9gc](https://youtu.be/CNJizSaD9gc)

---

## What it does

- **Predict** match outcomes for all 48 World Cup 2026 group-stage matches
- **Sign** predictions with your Sui wallet — your address is your on-chain identity
- **Store** every prediction as a Walrus blob (verifiable on [WalrusScan](https://walruscan.com))
- **AI agent** (Groq Llama 3.3-70b) recalls your past predictions semantically and roasts you for bias
- **Collect stickers** for every team you predict — all 48 nations
- **Leaderboard** tracks correct winners and exact scores across all players

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 15 + React 19 + Tailwind CSS |
| Blockchain | Sui Mainnet · `@mysten/dapp-kit` |
| On-chain memory | Walrus Memory (`@mysten-incubation/memwal` v0.0.7) |
| Database | Convex (persistent) + Vercel `/tmp` (fallback) |
| AI Agent | Groq Llama 3.3-70b-versatile · Vercel AI SDK |
| Deployment | Vercel |

## Quick Start

```bash
npm install
cp .env.local.example .env.local
# Fill in your credentials (see .env.local.example)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

See `.env.local.example` for all required variables:

- `MEMWAL_PRIVATE_KEY` + `MEMWAL_ACCOUNT_ID` — from [memory.walrus.xyz](https://memory.walrus.xyz)
- `GROQ_API_KEY` — from [console.groq.com](https://console.groq.com)
- `CONVEX_URL` — from your [Convex](https://convex.dev) project dashboard
- `ADMIN_SECRET` — any random hex string

## How Walrus Memory Works

Each wallet gets a dedicated namespace: `wc2026-sui-[address]`. Predictions are written as natural-language memory texts, stored as Walrus blobs, and indexed with vector embeddings for semantic search.

```
1. User signs prediction with Sui wallet
2. API formats it as natural language memory text
3. memwal.rememberAndWait(text) → blob stored on Walrus network
4. Returns blob_id → verifiable at walruscan.com/blob/[blob_id]
5. blob_id saved to user record in Convex
6. AI agent: memwal.recall(query) → top blob matches → injected into Groq context
```

## Project Structure

```
src/
  app/
    page.tsx          # Landing page
    predict/          # Main game — predict + AI agent
    dashboard/        # Personal prediction history + blob trail
    users/            # Leaderboard + player recall results
    groups/           # Group stage standings
    album/            # Sticker collection
    docs/             # Hackathon documentation
    api/
      predict/        # POST — save prediction + store to Walrus
      agent/          # POST — AI agent with MemWal recall
      recall/         # GET — fetch blobs for a user
      stats/          # GET — live player count
  lib/
    memwal.ts         # MemWal SDK wrapper
    world-cup-data.ts # All 48 teams, 72 matches, results
    users-data.ts     # Dual storage (Convex + filesystem)
  components/
    player-count.tsx  # Live player counter (polls /api/stats every 30s)
    mobile-nav.tsx    # Hamburger drawer for mobile
```

## License

MIT
