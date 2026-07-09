# Noether Documentation

Official documentation for [Noether](https://noether.exchange) — the decentralized
perpetual futures exchange on Stellar. User guides, REST/WebSocket API reference,
SDK quickstarts, and protocol documentation.

Built with [Nextra 3](https://nextra.site) on Next.js 14. Fully static — no
environment variables required.

## Development

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build (what Vercel runs)
```

> Tip: clone to a path that is **not** iCloud/Dropbox-synced — `node_modules`
> sync churn makes installs and builds slow.

## Updating the API reference

The interactive [API Explorer](/developers/api-explorer) and the REST reference are
based on `public/openapi.json`, a committed snapshot of the live gateway spec.
Refresh it after API deploys:

```bash
npm run fetch:openapi   # pulls https://noetherapi-production.up.railway.app/docs/json
```

Override the source with `NOETHER_OPENAPI_URL` if the gateway moves.

## Structure

```
pages/
  guides/       User guides — getting started, trading, vaults, referrals, FAQ
  developers/   REST + WebSocket reference, API explorer, SDK quickstarts, errors
  protocol/     Architecture, oracle price chain, trading mechanics, contracts
public/
  openapi.json  Committed snapshot of the gateway's OpenAPI spec
```

## Deployment

Deployed on Vercel (framework preset: Next.js, no env vars). Every push to `main`
auto-deploys.

## Related

- App (testnet): https://testnet.noether.exchange/trade
- Live API + Swagger: https://noetherapi-production.up.railway.app/docs
- TypeScript SDK: https://www.npmjs.com/package/noether-sdk
- Python SDK: https://pypi.org/project/noether-sdk/
- Main repo: https://github.com/NoetherDEX/noether
