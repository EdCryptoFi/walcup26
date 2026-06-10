import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'Docs — WalCup 26',
  description: 'WalCup 26: on-chain prediction game powered by Walrus Memory. Built for Walrus Sessions 4.',
};

export default function DocsPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-12 py-4">

      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <Image src="/imgs/logo.png" alt="WalCup 26" width={120} height={44} className="object-contain" />
          <span className="pill bg-primary text-white text-xs font-bold">Walrus Sessions 4</span>
        </div>
        <h1 className="text-4xl font-black text-on-surface">How WalCup 26 Works</h1>
        <p className="text-on-surface-variant mt-2 text-lg">
          A World Cup 2026 prediction arena where every pick is stored permanently on Walrus,
          and an AI agent remembers everything across sessions.
        </p>
      </div>

      {/* What is it */}
      <section className="sticker-card rounded-2xl p-6 space-y-3">
        <h2 className="text-2xl font-black text-on-surface">What is WalCup 26?</h2>
        <p className="text-on-surface-variant leading-relaxed">
          WalCup 26 is a <strong className="text-on-surface">World Cup prediction game</strong> built on the{' '}
          <strong className="text-on-surface">Sui blockchain</strong> and powered by{' '}
          <strong className="text-on-surface">Walrus Memory (MemWal)</strong> — a decentralized blob storage
          protocol with semantic search, giving the AI agent genuine cross-session memory.
        </p>
        <p className="text-on-surface-variant leading-relaxed">
          Built for the{' '}
          <a href="https://thewalrussessions.wal.app" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
            Walrus Sessions 4 hackathon
          </a>
          , it demonstrates a real use case for persistent on-chain memory: an agent that knows your history,
          detects your prediction biases, and roasts you for them — across every session, forever.
        </p>
        <div className="grid sm:grid-cols-3 gap-3 pt-2 text-center">
          {[
            { n: '48', label: 'Teams' },
            { n: '∞', label: 'Walrus Blobs' },
            { n: '1', label: 'Agent that never forgets' },
          ].map(({ n, label }) => (
            <div key={label} className="sticker-card sticker-tilt-1 rounded-xl p-3">
              <p className="text-2xl font-black text-primary">{n}</p>
              <p className="text-xs text-on-surface-variant">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Making predictions */}
      <section className="space-y-4">
        <h2 className="text-2xl font-black text-on-surface">Making Predictions</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { step: '1', title: 'Connect Wallet', desc: 'Connect your Sui wallet. Your address becomes your unique on-chain identity — no sign-up needed.', color: 'bg-primary text-white' },
            { step: '2', title: 'Pick & Sign', desc: 'Choose a match, pick the winner, predict the score, and sign with your wallet. Your wallet proves ownership of every prediction.', color: 'bg-secondary-container text-on-secondary-container' },
            { step: '3', title: 'Stored on Walrus', desc: 'The prediction is stored as a memory blob on the Walrus network. You get a blob ID you can verify live on WalrusScan.', color: 'bg-tertiary text-white' },
          ].map(({ step, title, desc, color }) => (
            <div key={step} className="sticker-card rounded-xl p-4 space-y-2">
              <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-black ${color}`}>{step}</span>
              <h3 className="font-bold text-on-surface">{title}</h3>
              <p className="text-sm text-on-surface-variant">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Walrus Memory deep dive */}
      <section className="space-y-4">
        <h2 className="text-2xl font-black text-on-surface">🦭 Walrus Memory — How It Works</h2>
        <div className="sticker-card rounded-2xl p-6 space-y-4">
          <p className="text-on-surface-variant leading-relaxed">
            <strong className="text-on-surface">MemWal SDK</strong> wraps the Walrus blob storage protocol
            with a namespace-based memory layer. Each wallet gets a dedicated namespace:{' '}
            <code className="text-primary bg-primary/5 px-1 rounded">wc2026-sui-[wallet]</code>.
            Predictions are written as natural-language memory texts, stored as encrypted blobs, and indexed
            with vector embeddings for semantic search.
          </p>
          <div className="bg-surface-container rounded-xl p-4 font-mono text-xs text-on-surface-variant space-y-1">
            <p className="text-tertiary font-bold">// Prediction storage flow</p>
            <p>1. User signs prediction with Sui wallet</p>
            <p>2. API formats it as natural language memory</p>
            <p>3. <span className="text-primary">memwal.rememberAndWait(text)</span> → blob stored on Walrus</p>
            <p>4. Returns <span className="text-primary">blob_id</span> — verifiable on WalrusScan</p>
            <p>5. blob_id saved to user record in Convex DB</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: '🔒', title: 'Wallet-scoped', desc: 'Each namespace is tied to a Sui wallet address. Only predictions from your wallet live in your namespace.' },
              { icon: '🌐', title: 'Decentralized blobs', desc: 'Data lives on the Walrus network of storage nodes — no single server controls your memories.' },
              { icon: '♾️', title: 'Cross-session', desc: 'Memories persist across browser sessions, devices, and app redeployments. The agent remembers Day 1.' },
              { icon: '🔍', title: 'Semantic recall', desc: 'Vector-indexed blobs. The agent queries "Brazil predictions" and finds all relevant memory across all sessions.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="flex gap-3">
                <span className="text-2xl flex-shrink-0">{icon}</span>
                <div>
                  <p className="font-bold text-on-surface text-sm">{title}</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3 text-xs text-on-surface-variant">
            Every blob is publicly verifiable:{' '}
            <a
              href="https://walruscan.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-semibold"
            >
              walruscan.com/blob/[blob_id] ↗
            </a>
            {' '}— paste any blob ID from your dashboard to inspect the raw on-chain memory.
          </div>
        </div>
      </section>

      {/* AI Agent */}
      <section className="sticker-card sticker-tilt-2 rounded-2xl p-6 space-y-3">
        <h2 className="text-2xl font-black text-on-surface">🎙️ The Commentator — AI Agent</h2>
        <p className="text-on-surface-variant leading-relaxed">
          Powered by <strong className="text-on-surface">Groq Llama 3.3-70b</strong> via the Vercel AI SDK.
          Before every response, the agent queries your Walrus namespace for semantically relevant memories
          — past predictions, stated opinions, detected biases — and injects them into the system context.
        </p>
        <div className="bg-surface-container rounded-xl p-4 font-mono text-xs text-on-surface-variant space-y-1">
          <p className="text-tertiary font-bold">// Agent memory retrieval flow</p>
          <p>1. User sends message to <span className="text-primary">/api/agent</span></p>
          <p>2. <span className="text-primary">memwal.recall(query, limit=15)</span> → top blob matches</p>
          <p>3. Blob texts injected into Groq system prompt</p>
          <p>4. Llama 3.3-70b generates response with full context</p>
          <p>5. Agent detects biases, tracks accuracy, roasts freely</p>
        </div>
        <p className="text-xs text-on-surface-variant">
          Without a Sui wallet, the agent uses in-app predictions only — no persistent Walrus memory.
          Connect a wallet to unlock full cross-session recall.
        </p>
      </section>

      {/* Scoring */}
      <section className="sticker-card sticker-tilt-1 rounded-2xl p-6 space-y-3">
        <h2 className="text-2xl font-black text-on-surface">🏆 Points System</h2>
        <div className="space-y-2">
          {[
            ['Correct winner — Group Stage', '3 pts'],
            ['Exact score prediction bonus', '+2 pts'],
            ['Correct winner — Round of 32', '4 pts'],
            ['Correct winner — Round of 16', '5 pts'],
            ['Correct winner — Quarter Finals', '6 pts'],
            ['Correct winner — Semi Finals', '7 pts'],
            ['Correct winner — Final', '8 pts'],
            ['Tournament Champion', '10 pts'],
          ].map(([label, pts]) => (
            <div key={label} className="flex justify-between items-center py-1.5 border-b border-outline-variant last:border-0">
              <span className="text-on-surface-variant text-sm">{label}</span>
              <span className="font-black text-secondary">{pts}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Tech stack */}
      <section className="sticker-card rounded-2xl p-6 space-y-4">
        <h2 className="text-2xl font-black text-on-surface">⚙️ Tech Stack</h2>
        <div className="grid sm:grid-cols-2 gap-3 text-sm">
          {[
            { label: 'Frontend', value: 'Next.js 15 + React 19 + Tailwind CSS' },
            { label: 'Blockchain', value: 'Sui Mainnet · @mysten/dapp-kit' },
            { label: 'On-chain memory', value: 'Walrus Memory (MemWal SDK v0.0.7)' },
            { label: 'Database', value: 'Convex (persistent) + Vercel /tmp (fallback)' },
            { label: 'AI Agent', value: 'Groq Llama 3.3-70b-versatile · Vercel AI SDK' },
            { label: 'Deployment', value: 'Vercel · walcup26.vercel.app' },
          ].map(({ label, value }) => (
            <div key={label} className="flex gap-2">
              <span className="text-on-surface-variant font-semibold min-w-[110px]">{label}:</span>
              <span className="text-on-surface">{value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Data disclaimer */}
      <section className="sticker-card rounded-xl p-5 space-y-2 border-l-4 border-secondary-container">
        <h2 className="text-lg font-black text-on-surface">⚠️ About Match Data</h2>
        <p className="text-sm text-on-surface-variant leading-relaxed">
          Fixtures and results are based on the official World Cup 2026 schedule but are{' '}
          <strong className="text-on-surface">not auto-synced</strong> with live scores.
          Results are updated manually. For official standings visit{' '}
          <a
            href="https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/standings"
            className="text-primary hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            fifa.com ↗
          </a>.
        </p>
      </section>

      {/* CTA */}
      <div className="text-center space-y-3 pb-8">
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/predict" className="inline-flex items-center gap-2 bg-primary text-white rounded-xl px-8 py-4 font-bold hover:scale-105 shadow-lg transition-all">
            ⚽ Start Predicting
          </Link>
          <a
            href="https://github.com/EdCryptoFi/walcup26"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-surface-container text-on-surface border border-outline-variant rounded-xl px-6 py-4 font-bold hover:scale-105 shadow transition-all"
          >
            GitHub ↗
          </a>
        </div>
        <p className="text-xs text-on-surface-variant">
          Built by{' '}
          <a href="https://x.com/EdCriptoFi/" className="text-primary hover:underline">Ed</a>{' '}
          for{' '}
          <a href="https://thewalrussessions.wal.app" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
            Walrus Sessions 4
          </a>
        </p>
      </div>

    </div>
  );
}
