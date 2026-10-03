# Noether docs redesign — design spec (2026-09-18)

Status: approved in chat 2026-09-18 (Yahya: "go with your recommendations. Vercel is okay.").
Scope: the docs site only (this repo). The main repo is untouched except optional infra noted in §9.

## 1. Problem

docs.noether.exchange is a stock Nextra 3 template that reads as a different product from the
app, and it is factually stale: every API example targets the retired Railway gateway (still
answering, wired to the paused July-6 market), 8 of 10 contract addresses are from that stack,
"Launch app" lands on the mainnet waitlist, SDK pages document 0.1.1 while 0.2.0 is published,
and the market list says 14 where the gateway serves 16. Visually: system fonts, purple accent,
rainbow logo, every page opening with the same testnet warning box, ~110-character lines.

## 2. Goals

1. Brand parity with the app: same tokens, fonts, wordmark, elevation model, focus ring, radius.
2. Every fact verifiable against a live source, and the drift-prone facts generated, not typed.
3. A docs home that routes three audiences (trader, developer, protocol reader) in one screen.
4. API reference generated from the gateway's OpenAPI spec, with a playground.
5. Same URLs as today (no broken inbound links; DOCS_URL in the app, llms.txt consumers).

Non-goals: light theme; moving hosting off Vercel; screenshots in guides (text-first stays until a
wallet-connected capture session exists); a mainnet section beyond "planned" markers.

## 3. Architecture

- Fumadocs 16 (`@fumadocs/base-ui` UI) on Next 16 App Router, Tailwind v4, Orama search
  (route handler), built-in `llms.txt` / `llms-full.txt` / `*.mdx` routes, OG route.
- Content in `content/docs/**.mdx` with per-folder `meta.json`; docs mounted at `/` so
  `/guides/...`, `/developers/...`, `/protocol/...` keep resolving. Home at `/` is a custom page.
- Generated data (committed snapshots, refreshed by `npm run fetch:all`):
  - `public/openapi.json` from the gateway (`/docs/json`), post-processed: `servers` set to the
    public base URL, per-operation `tags` derived from the path (markets, oracle, account,
    positions, trading, vaults, referral, keys, events, system).
  - `data/contracts.json` from `/v1/health` (resolved addresses) cross-checked against the main
    repo's `contracts.json` on GitHub; the contracts page renders a table from it.
  - `data/markets.json` from `/v1/markets` (symbols, count) for the markets tables and the home
    "At a glance" tiles.
- One base-URL constant (`lib/site.ts`) used by React components; MDX code samples carry the
  literal, replaced in one sed if the hostname changes.
- Deploy: Vercel, GitHub-connected, push to `main` deploys; branch `fumadocs` gets a preview.

## 4. Design system port (from `web/app/globals.css` + `tailwind.config.js`)

- Dark only. `<html class="dark">`, theme switching disabled.
- Tokens (HSL triplets as in the app): background 216 19% 5% (#0B0D10), surface 216 19% 8%,
  surface-2 216 18% 11%, surface-3 217 18% 14%, foreground 216 12% 92%, muted-foreground
  212 8% 63%, faint 212 7% 42%, border 216 13% 12%, border-strong 217 11% 15%, primary
  (gold) 45 93% 47% with near-black foreground, accent blue 217 91% 60%, destructive
  357 81% 57%, long 158 80% 43%, short 357 81% 57%, radius 0.5rem.
- Mapped onto Fumadocs UI variables (`--color-fd-*`): background, foreground, card, popover,
  muted, muted-foreground, border, primary, primary-foreground, secondary, accent, ring.
- Fonts: Inter (body, `--font-sans`), Sora (headings, `--font-heading`), JetBrains Mono (code,
  numerals, eyebrows; `tabular-nums`), self-hosted woff2 copied from the app.
- Elevation: surface steps + hairline borders only; no shadows, no glow, no gradients.
- Focus: `2px solid` gold outline, offset 2px. Selection: gold at 35%. Scrollbar as the app.
- Gold is reserved for actions, active state, brand marks and eyebrows. Never large fills.

## 5. Shell

- Header: wordmark SVG (`/wordmark.svg`, the app's `noethersvg.svg`) + "DOCS" pill styled like the
  app's Testnet pill; section links Guides / Developers / Protocol; ⌘K search; GitHub; gold
  "Open app" button to https://testnet.noether.exchange/trade.
- A slim status strip ("Testnet · funds are not real · gateway ok") replaces the emoji banner and
  the per-page testnet callouts. Gateway status fetched client-side; renders "—" on failure.
- Sidebar: mono uppercase eyebrows per section (as the app's "EARN · PROTOCOL VAULT"), all groups
  open, active item gold with a left hairline marker; external links (app, npm, PyPI) at the end.
- Right rail: on-this-page; footer mirrors the app's footer (links + © line).

## 6. Home (`/`)

Hero: one line ("Perpetual futures on Stellar, fully on-chain.") + one sentence. Three audience
cards in the app's stat-card style: Trade in ten minutes → /guides/getting-started; Build on the
API → /developers; Read the protocol → /protocol/architecture. "At a glance" as mono KPI tiles
generated from data: markets count, max leverage, maker/taker fee, min collateral, max position.
Popular pages list. No fabricated numbers: anything unavailable renders "—".

## 7. Content components (in app idiom)

Callout: quiet surface card, 2px status rule on the inline-start edge (info=accent, warn=gold,
error=short), no tinted fill. Tables: hairline rows, header eyebrow style, numerics in mono
right-aligned. Code blocks: surface-2, hairline border, copy button, Shiki dark theme tuned to
the palette. Tabs (curl / TypeScript / Python): gold underline like the app's Deposit/Withdraw
tabs, persisted choice. Steps: mono two-digit counters like the referrals page. Endpoint pages:
method chip + path in mono, parameter tables, request/response samples.

## 8. Information architecture (URLs unchanged unless marked new)

Guides: getting-started, trading, vault (titled "Earn: protocol vault"), trader-vaults, referrals,
faq. Developers: index (overview), authentication, rest-api/* (narrative overview kept; endpoint
pages under developers/reference/* generated, new), websocket, sdk-ts, sdk-py, errors;
api-explorer redirects to developers/reference. Protocol: architecture, oracle, trading-mechanics,
contracts (table generated), networks, security (new, from the main repo's SECURITY.md + audit
status), changelog (new, user-facing product changes only).

## 9. Content rules

- Base URL: the live gateway. Preferred hostname api.noether.exchange once bound on the
  container app (additive; falls back to the azurecontainerapps hostname).
- App links: testnet.noether.exchange. noether.exchange is the marketing/waitlist site.
- Referral economics: live on-chain (registry is the funded L1-18 build; numbers from
  `get_config`). Remove all "activates in v1.1" language.
- SDKs: document 0.2.0 from the CHANGELOGs, verified with a live smoke test.
- Markets: generated. Fees, limits, faucet amounts: re-verified against code before publishing.
- Voice: the app's. Sentence case everywhere. Terms follow the app nav: Trade, Portfolio, Earn,
  Vaults, Referrals, Leaderboard, Faucet. Prose measure capped at 68ch. No emoji in chrome.
- Callouts only where they change a decision (jurisdiction, LON wallet, testnet resets).
- Never publish internal incident narratives or key-management gaps; link SECURITY.md instead.

## 10. Verification gates before merge

Build passes in the /private/tmp clone; `npm run types:check`; llms.txt and openapi routes
respond; puppeteer pass at 1440 / 768 / 320 (no horizontal overflow, visible focus at every
stop, measured contrast for body, muted, code and callout text); Lighthouse a11y + perf ≥ 95;
verifier agents re-run live curls for every changed fact; the better-interface review on the
preview URL; then the preview link goes to Yahya for the merge decision.

## 11. Follow-ups outside this repo (flagged, not done here)

- Railway gateway still running against the retired market (cost + confusion). Shut down: Yahya's call.
- `web/app/referrals/page.tsx` still says fee sharing "goes live in v1.1"; economics are live.
- Gateway `API_CORS_ORIGIN` must include docs.noether.exchange for the API playground.
- Gateway OpenAPI `servers` says localhost:4000 (`API_PUBLIC_URL` unset); the fetch script patches it.
