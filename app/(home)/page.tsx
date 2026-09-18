import Link from 'next/link';
import markets from '@/data/markets.json';
import { site } from '@/lib/site';
import { StatusStrip } from '@/components/status-strip';

const audiences = [
  {
    eyebrow: '01 · Trade',
    title: 'Trade in ten minutes',
    body: 'Connect a Stellar wallet, claim test USDC from the faucet and open your first perpetual position.',
    href: '/guides/getting-started',
    cta: 'Getting started',
  },
  {
    eyebrow: '02 · Build',
    title: 'Build on the API',
    body: 'A REST and WebSocket gateway with TypeScript and Python SDKs. It prepares transactions; your wallet signs them.',
    href: '/developers',
    cta: 'Developer overview',
  },
  {
    eyebrow: '03 · Protocol',
    title: 'Read the protocol',
    body: 'Soroban contracts, the Noeracle price chain, and the margin, funding and liquidation mechanics.',
    href: '/protocol/architecture',
    cta: 'Architecture',
  },
];

const glance = [
  {
    label: 'Markets',
    value: String(markets.openCount),
    note:
      markets.openCount === markets.count
        ? 'perpetual pairs on testnet'
        : `open for trading · ${markets.count} listed`,
  },
  { label: 'Max leverage', value: '10×', note: 'every pair on testnet · contract ceiling 25×' },
  { label: 'Maker / taker', value: '0.020% / 0.050%', note: 'tier 0, falls with volume' },
  { label: 'Min collateral', value: '10 USDC', note: 'per position' },
  { label: 'Max position', value: '$100,000', note: 'notional' },
  { label: 'Price staleness', value: '60 s', note: 'oldest price the market accepts' },
];

const popular = [
  { title: 'Trading guide', href: '/guides/trading', note: 'orders, margin modes, fees, liquidation' },
  { title: 'Authentication', href: '/developers/authentication', note: 'wallet-signed challenges and API keys' },
  { title: 'Endpoint reference', href: '/developers/reference', note: 'every gateway route with a playground' },
  { title: 'WebSocket API', href: '/developers/websocket', note: 'tickers, trades and account events' },
  { title: 'TypeScript SDK', href: '/developers/sdk-ts', note: 'typed client and reconnecting stream' },
  { title: 'Contracts and events', href: '/protocol/contracts', note: 'deployed addresses and how to verify them' },
];

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-[1120px] px-4 pb-20 pt-10 sm:px-6 sm:pt-14">
      <section className="border-b border-fd-border pb-10">
        <p className="noe-eyebrow">Documentation · Stellar testnet</p>
        <h1 id="main-content" tabIndex={-1} className="mt-4 max-w-[18ch] text-3xl font-medium leading-tight sm:text-[40px]">
          Perpetual futures on Stellar, fully on-chain.
        </h1>
        <p className="mt-4 max-w-[58ch] text-base text-fd-muted-foreground">
          Every order, match, liquidation and funding payment executes in Soroban smart contracts. These docs cover
          the web app, the gateway API and the protocol underneath.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link href="/guides/getting-started" className="noe-btn">
            Start trading
          </Link>
          <Link href="/developers" className="noe-btn noe-btn-quiet">
            Build on the API
          </Link>
          <a href={site.appTrade} className="text-sm text-fd-muted-foreground underline-offset-4 hover:underline" target="_blank" rel="noreferrer">
            Open the app <span aria-hidden="true">↗</span>
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
        <div className="mt-8 max-w-[520px]">
          <StatusStrip />
        </div>
      </section>

      <section className="grid gap-4 py-10 sm:grid-cols-3">
        {audiences.map((a) => (
          <Link key={a.href} href={a.href} className="noe-card">
            <p className="noe-eyebrow">{a.eyebrow}</p>
            <h2 className="mt-3 text-lg font-medium">{a.title}</h2>
            <p className="mt-2 text-sm text-fd-muted-foreground">{a.body}</p>
            <p className="mt-5 text-sm font-medium text-fd-primary">
              {a.cta} <span aria-hidden="true">→</span>
            </p>
          </Link>
        ))}
      </section>

      <section className="border-t border-fd-border py-10">
        <p className="noe-eyebrow">At a glance</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {glance.map((g) => (
            <div key={g.label} className="noe-stat">
              <p className="text-[11px] uppercase tracking-[0.12em] text-fd-muted-foreground">{g.label}</p>
              <p className="noe-stat-value mt-2">{g.value}</p>
              <p className="mt-1 text-xs text-fd-muted-foreground">{g.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-10 border-t border-fd-border py-10 md:grid-cols-[1fr_320px]">
        <div>
          <p className="noe-eyebrow">Popular pages</p>
          <ul className="mt-4 divide-y divide-fd-border">
            {popular.map((p) => (
              <li key={p.href}>
                <Link href={p.href} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-3 hover:text-fd-primary">
                  <span className="font-medium">{p.title}</span>
                  <span className="text-sm text-fd-muted-foreground">{p.note}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="noe-eyebrow">Links</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><a className="hover:text-fd-primary" href={site.appTrade} target="_blank" rel="noreferrer">Web app (testnet) <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span></a></li>
            <li><a className="hover:text-fd-primary" href={`${site.gateway}/docs`} target="_blank" rel="noreferrer">Gateway Swagger UI <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span></a></li>
            <li><a className="hover:text-fd-primary" href={site.npm} target="_blank" rel="noreferrer">noether-sdk on npm <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span></a></li>
            <li><a className="hover:text-fd-primary" href={site.pypi} target="_blank" rel="noreferrer">noether-sdk on PyPI <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span></a></li>
            <li><a className="hover:text-fd-primary" href={site.github} target="_blank" rel="noreferrer">GitHub <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span></a></li>
            <li><a className="hover:text-fd-primary" href={site.x} target="_blank" rel="noreferrer">@Noetherdex on X <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span></a></li>
            <li><Link className="hover:text-fd-primary" href="/llms.txt">llms.txt</Link></li>
          </ul>
        </div>
      </section>
    </div>
  );
}
