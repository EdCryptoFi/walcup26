export const metadata = {
  title: 'Cookie Policy — WalCup 26',
  description: 'Cookie and data policy for WalCup 26.',
};

export default function CookiesPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-8 py-4">
      <div>
        <h1 className="text-4xl font-black text-on-surface">Cookie Policy</h1>
        <p className="text-on-surface-variant mt-2">Last updated: June 2026</p>
      </div>

      {[
        {
          title: 'What We Store',
          content: `WalCup 26 is a client-side application. We do not use traditional tracking cookies. The following data may be stored in your browser's localStorage:

• Your profile picture (PFP) — stored as a data URL keyed to your wallet address
• Your username — if you logged in manually (no wallet)
• Your user ID — for session continuity

No cookies are set by WalCup 26 itself.`,
        },
        {
          title: 'Walrus Memory Storage',
          content: `If you connect a Sui wallet, your predictions and AI conversation history are stored as encrypted blobs on the Walrus decentralized network. This data is:

• Encrypted with your wallet key
• Stored on-chain / on the Walrus network
• NOT stored on any WalCup 26 server
• Accessible only through the MemWal SDK

This is not a cookie — it is decentralized storage linked to your wallet identity.`,
        },
        {
          title: 'Third-Party Services',
          content: `WalCup 26 uses the following third-party services which may set their own cookies or collect data:

• Vercel — hosting and edge functions (see vercel.com/legal/privacy-policy)
• Google Gemini API — AI responses (see ai.google.dev/terms)
• Sui blockchain / Mysten Labs dapp-kit — wallet connection (see mystenlabs.com/privacy)
• Walrus Memory (MemWal) — decentralized memory storage (see memory.walrus.xyz)`,
        },
        {
          title: 'Data Retention',
          content: `localStorage data persists until you clear your browser storage. Walrus memory blobs persist as long as they are renewed on the Walrus network. We do not control the lifecycle of on-chain data.`,
        },
        {
          title: 'Your Rights',
          content: `You can clear all local data at any time by clearing your browser localStorage. For Walrus-stored memories, contact the MemWal team at memory.walrus.xyz. This project is a hackathon demo — no personal data is collected or sold.`,
        },
      ].map(({ title, content }) => (
        <section key={title} className="sticker-card rounded-xl p-5 space-y-2">
          <h2 className="text-lg font-black text-on-surface">{title}</h2>
          <p className="text-sm text-on-surface-variant leading-relaxed whitespace-pre-line">{content}</p>
        </section>
      ))}

      <p className="text-xs text-on-surface-variant text-center pb-8">
        Questions? Contact <a href="https://x.com/EdCriptoFi/" className="text-primary hover:underline">Ed on X</a>
      </p>
    </div>
  );
}
