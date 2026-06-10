import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'Docs — WalCup 26',
  description: 'How WalCup 26 works: predictions, scoring, Walrus Memory, and the AI agent.',
};

export default function DocsPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-12 py-4">
      <div>
        <div className="flex items-center gap-3 mb-4">
          <Image src="/imgs/logo.png" alt="WalCup 26" width={120} height={44} className="object-contain" />
        </div>
        <h1 className="text-4xl font-black text-on-surface">Documentation</h1>
        <p className="text-on-surface-variant mt-2 text-lg">How WalCup 26 works — predictions, memory, scoring, and the AI agent.</p>
      </div>

      {/* What is WalCup 26 */}
      <section className="sticker-card rounded-2xl p-6 space-y-3">
        <h2 className="text-2xl font-black text-on-surface">What is WalCup 26?</h2>
        <p className="text-on-surface-variant leading-relaxed">
          WalCup 26 is a World Cup 2026 prediction game built on the <strong className="text-on-surface">Sui blockchain</strong> and powered by <strong className="text-on-surface">Walrus Memory (MemWal)</strong> — a decentralized storage protocol that gives your AI agent persistent, cross-session memory.
        </p>
        <p className="text-on-surface-variant leading-relaxed">
          Built for the <a href="https://thewalrussessions.wal.app" className="text-primary hover:underline">Walrus Sessions 4 hackathon</a>, WalCup 26 demonstrates how on-chain memory can power genuinely intelligent, personalized AI agents.
        </p>
      </section>

      {/* How predictions work */}
      <section className="space-y-4">
        <h2 className="text-2xl font-black text-on-surface">Making Predictions</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { step: '1', title: 'Connect Wallet', desc: 'Connect your Sui testnet wallet. Your wallet address becomes your unique identity — no sign-up needed.', color: 'bg-primary text-white' },
            { step: '2', title: 'Pick & Predict', desc: 'Choose any group stage match. Pick the winner, predict the score, set your confidence level, and add your reasoning.', color: 'bg-secondary-container text-on-secondary-container' },
            { step: '3', title: 'Saved on Walrus', desc: 'Every prediction is stored as an encrypted memory blob on the Walrus decentralized network — permanently.', color: 'bg-tertiary text-white' },
          ].map(({ step, title, desc, color }) => (
            <div key={step} className="sticker-card rounded-xl p-4 space-y-2">
              <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-black ${color}`}>{step}</span>
              <h3 className="font-bold text-on-surface">{title}</h3>
              <p className="text-sm text-on-surface-variant">{desc}</p>
            </div>
          ))}
        </div>
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

      {/* Walrus Memory */}
      <section className="space-y-4">
        <h2 className="text-2xl font-black text-on-surface">🦭 How Walrus Memory Works</h2>
        <div className="sticker-card rounded-2xl p-6 space-y-4">
          <p className="text-on-surface-variant leading-relaxed">
            <strong className="text-on-surface">Walrus Memory (MemWal)</strong> is a middleware layer built on top of the Walrus decentralized blob storage protocol. When you interact with the AI agent, your conversation history, predictions, and insights are stored as encrypted binary blobs on the Walrus network.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: '🔒', title: 'Encrypted Storage', desc: 'Your memory blobs are encrypted before being stored on Walrus — only your wallet key can decrypt them.' },
              { icon: '🌐', title: 'Decentralized', desc: 'Data lives on the Walrus network of storage nodes — no single server can lose or censor your memories.' },
              { icon: '♾️', title: 'Persistent', desc: 'Memories survive across browser sessions, devices, and app versions. The agent truly never forgets.' },
              { icon: '🔍', title: 'Semantic Search', desc: 'Memories are indexed with vector embeddings, so the agent can find relevant context even from months ago.' },
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
        </div>
      </section>

      {/* The AI Agent */}
      <section className="sticker-card sticker-tilt-2 rounded-2xl p-6 space-y-3">
        <h2 className="text-2xl font-black text-on-surface">🎙️ The AI Agent</h2>
        <p className="text-on-surface-variant leading-relaxed">
          The WalCup 26 AI agent is powered by <strong className="text-on-surface">Google Gemini 2.0 Flash</strong> wrapped with the MemWal middleware. Before every response, the agent automatically queries your Walrus memory for relevant context — past predictions, stated opinions, detected biases — and injects it into the conversation.
        </p>
        <div className="bg-surface-container rounded-xl p-4 font-mono text-xs text-on-surface-variant space-y-1">
          <p className="text-tertiary font-bold">// How it works under the hood:</p>
          <p>1. User sends message</p>
          <p>2. MemWal searches Walrus blobs for relevant memories</p>
          <p>3. Top matches injected into system context</p>
          <p>4. Gemini generates response with full memory context</p>
          <p>5. New memory blob saved to Walrus automatically</p>
        </div>
        <p className="text-xs text-on-surface-variant">
          For users without a Sui wallet, the agent works without persistent memory — predictions are still saved in-app but not on Walrus.
        </p>
      </section>

      {/* Data */}
      <section className="sticker-card rounded-xl p-5 space-y-2 border-l-4 border-secondary-container">
        <h2 className="text-lg font-black text-on-surface">⚠️ About Match Data</h2>
        <p className="text-sm text-on-surface-variant leading-relaxed">
          Match fixtures and results in WalCup 26 are based on the official World Cup 2026 schedule but are <strong className="text-on-surface">not automatically synced</strong> with real-time data. Results shown in the app are updated manually and may not reflect the latest scores. For official standings, visit{' '}
          <a href="https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/standings" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
            fifa.com
          </a>.
        </p>
      </section>

      <div className="text-center space-y-3 pb-8">
        <Link href="/predict" className="inline-flex items-center gap-2 bg-primary text-white rounded-xl px-8 py-4 font-bold hover:scale-105 shadow-lg transition-all">
          ⚽ Start Predicting
        </Link>
        <p className="text-xs text-on-surface-variant">
          Built by <a href="https://x.com/EdCriptoFi/" className="text-primary hover:underline">Ed</a> for Walrus Sessions 4
        </p>
      </div>
    </div>
  );
}
