// Refresh public/openapi.json from the live gateway. The gateway's own spec
// says `servers: localhost:4000`, carries no tags and no operationIds, and
// includes app-internal admin/waitlist/access routes, so this script
// normalises it for the public reference. Run `npm run fetch:openapi` after an
// API deploy, then `npm run generate:api`.
import { writeFile } from 'node:fs/promises';

const GATEWAY =
  process.env.NOETHER_API_URL ??
  'https://noether-api.proudmeadow-533cf0d8.germanywestcentral.azurecontainerapps.io';
const SOURCE = process.env.NOETHER_OPENAPI_URL ?? `${GATEWAY}/docs/json`;
const INTERNAL = [/^\/v1\/admin(\/|$)/, /^\/v1\/access(\/|$)/, /^\/v1\/waitlist(\/|$)/];
const TAGS = [
  { name: 'markets', display: 'Markets', match: (p) => (p.startsWith('/v1/markets') && !p.endsWith('/price')) || p === '/v1/trades' || p === '/v1/candles' },
  { name: 'oracle', display: 'Oracle and prices', match: (p) => p.startsWith('/v1/oracle') || p.endsWith('/price') },
  { name: 'account', display: 'Account', match: (p) => p.startsWith('/v1/account') },
  { name: 'positions', display: 'Positions', match: (p) => p.startsWith('/v1/positions') || p.startsWith('/v1/adl') },
  { name: 'trading', display: 'Orders and transactions', match: (p) => p.startsWith('/v1/orders') || p.startsWith('/v1/tx') },
  { name: 'vaults', display: 'Vaults', match: (p) => p.startsWith('/v1/vaults') },
  { name: 'referral', display: 'Referral', match: (p) => p.startsWith('/v1/referral') },
  { name: 'leaderboard', display: 'Leaderboard', match: (p) => p.startsWith('/v1/leaderboard') },
  { name: 'keys', display: 'API keys', match: (p) => p.startsWith('/v1/keys') },
  { name: 'system', display: 'Events and health', match: (p) => p.startsWith('/v1/events') || p.startsWith('/v1/health') },
];
const METHODS = ['get', 'post', 'put', 'patch', 'delete'];

const res = await fetch(SOURCE);
if (!res.ok) throw new Error(`${SOURCE} -> HTTP ${res.status}`);
const spec = await res.json();

spec.servers = [{ url: GATEWAY, description: 'Noether gateway (Stellar testnet)' }];
spec.info = { ...spec.info, title: 'Noether gateway API', description: spec.info?.description ?? 'REST API of the Noether gateway on Stellar testnet.' };
spec.tags = TAGS.map((t) => ({ name: t.name, 'x-displayName': t.display }));

let kept = 0, dropped = 0;
for (const [p, item] of Object.entries(spec.paths)) {
  if (INTERNAL.some((re) => re.test(p))) { delete spec.paths[p]; dropped++; continue; }
  const tag = TAGS.find((t) => t.match(p))?.name ?? 'system';
  for (const m of METHODS) {
    const op = item[m];
    if (!op) continue;
    op.tags = [tag];
    op.operationId ??= `${m}-${p.replace(/^\/v1\//, '').replace(/\{([^}]+)\}/g, 'by-$1').replace(/[^a-zA-Z0-9]+/g, '-').replace(/-+$/, '')}`;
    op.summary ??= `${m.toUpperCase()} ${p}`;
    kept++;
  }
}
await writeFile('public/openapi.json', JSON.stringify(spec, null, 2) + '\n');
console.log(`openapi: ${kept} operations kept, ${dropped} internal paths dropped, servers -> ${GATEWAY}`);
