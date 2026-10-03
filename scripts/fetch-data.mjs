// Snapshot the live facts the docs render (contract addresses, market list) so
// they are generated, not typed. Run `npm run fetch:data` after a deploy.
import { mkdir, writeFile } from 'node:fs/promises';

const GATEWAY =
  process.env.NOETHER_API_URL ??
  'https://noether-api.proudmeadow-533cf0d8.germanywestcentral.azurecontainerapps.io';
const REPO_CONTRACTS = 'https://raw.githubusercontent.com/NoetherDEX/noether/main/contracts.json';

async function json(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} -> HTTP ${res.status}`);
  return res.json();
}

const health = await json(`${GATEWAY}/v1/health`);
const repo = await json(REPO_CONTRACTS).catch((err) => {
  console.warn(`warn: repo contracts.json unavailable (${err.message}); using gateway only`);
  return null;
});

const contracts = {};
for (const [key, value] of Object.entries(health.contracts ?? {})) {
  contracts[key] = typeof value === 'string' ? value : value.address;
}
if (repo?.contracts) {
  for (const [key, value] of Object.entries(repo.contracts)) {
    if (contracts[key] && contracts[key] !== value) {
      console.warn(`MISMATCH ${key}: gateway ${contracts[key]} vs repo ${value}`);
    }
    contracts[key] ??= value;
  }
}

const marketsRes = await json(`${GATEWAY}/v1/markets`);
// A pair is open for new positions only when the market holds a risk config
// for it; the gateway surfaces that as capacity.maxPositionSize (null = none,
// so the market rejects opens with #88 AssetRiskNotConfigured). A missing
// capacity block means the gateway could not read the chain: status unknown.
const stats = await json(`${GATEWAY}/v1/markets/stats`).catch(() => null);
const capacityOf = new Map((stats?.stats ?? []).map((r) => [r.asset, r.capacity]));
const markets = (marketsRes.markets ?? marketsRes).map((m) => {
  const a = typeof m.asset === 'object' ? m.asset : { symbol: m.asset, name: m.name, decimals: m.decimals };
  const cap = capacityOf.get(a.symbol);
  const status = !cap ? 'unknown' : cap.maxPositionSize ? 'open' : 'not-open';
  return { symbol: a.symbol, name: a.name, decimals: a.decimals, status };
});
const openCount = markets.filter((m) => m.status === 'open').length;

const fetchedAt = new Date().toISOString();
await mkdir('data', { recursive: true });
await writeFile(
  'data/contracts.json',
  JSON.stringify(
    {
      fetchedAt,
      network: health.network,
      gateway: GATEWAY,
      deployedAt: repo?.deployedAt ?? null,
      admin: repo?.admin ?? null,
      noeAsset: repo?.noeAsset ?? null,
      contracts,
    },
    null,
    2,
  ) + '\n',
);
await writeFile('data/markets.json', JSON.stringify({ fetchedAt, count: markets.length, openCount, markets }, null, 2) + '\n');
console.log(`contracts: ${Object.keys(contracts).length} addresses | markets: ${markets.length} listed, ${openCount} open`);
