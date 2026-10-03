# Noether Documentation

Official documentation for [Noether](https://noether.exchange), the decentralized
perpetual futures exchange on Stellar. Live at **https://docs.noether.exchange**.

Built with [Fumadocs](https://fumadocs.dev) on Next.js, styled with the app's own
design tokens (see `app/global.css`). Dark only, like the app.

## Development

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build (what Vercel runs)
npm run types:check  # next typegen + tsc
```

Clone to a path that is not iCloud/Dropbox-synced; `node_modules` sync churn makes
installs and builds slow.

## Structure

```
app/                 Next.js app router: home, docs catch-all, llms.txt, OG, search
content/docs/        MDX pages + meta.json (sidebar order). Docs are mounted at "/".
  guides/            Trader guides
  developers/        Gateway overview, auth, REST guides, WebSocket, SDKs, errors
  developers/reference/   GENERATED endpoint reference (do not edit by hand)
  protocol/          Architecture, oracle, mechanics, contracts, networks, security, changelog
components/          MDX components, data-driven tables, status strip, wordmark
data/                GENERATED snapshots: contracts.json, markets.json
public/openapi.json  GENERATED, normalised copy of the gateway's OpenAPI spec
scripts/             fetch-openapi, fetch-data, generate-api
```

## Keeping facts generated

Addresses, the market list and the endpoint reference are generated from live
sources so they cannot drift from the deployment. After an API deploy or a
contract redeploy:

```bash
npm run fetch:all    # = fetch:openapi + fetch:data + generate:api
git add -A && git commit -m "chore: refresh generated data"
```

- `fetch:openapi` pulls the gateway spec, drops app-internal routes, sets `servers`
  to the public base URL and adds tags/operationIds. Override the source with
  `NOETHER_OPENAPI_URL`, the public base with `NOETHER_API_URL`.
- `fetch:data` snapshots `/v1/health` (contract addresses, cross-checked against the
  main repo's `contracts.json`) and `/v1/markets`.
- `generate:api` rebuilds `content/docs/developers/reference/` from the spec.

Code samples in MDX carry the base URL as a literal. If the hostname changes, run a
project-wide replace and update `lib/site.ts` together.

## Writing pages

- Frontmatter: `title`, `description`. Sentence case. No H1 in the body.
- Components available without imports: `Callout` (`type="info" | "warning" | "error"`),
  `Steps` (every `###` inside becomes a numbered step), `Tabs`/`Tab`, `Cards`/`Card`,
  `ContractsTable`, `ContractsMeta`, `Address name="market"`, `MarketsTable`.
- Callouts only where they change a decision. The testnet notice lives in the chrome.
- Link the app as `https://testnet.noether.exchange`; `noether.exchange` is the marketing site.

## Deployment

Vercel, GitHub-connected: every push to `main` deploys; other branches get preview URLs.
No environment variables are required.

## Related

- App (testnet): https://testnet.noether.exchange/trade
- TypeScript SDK: https://www.npmjs.com/package/noether-sdk
- Python SDK: https://pypi.org/project/noether-sdk/
- Main repo: https://github.com/NoetherDEX/noether
