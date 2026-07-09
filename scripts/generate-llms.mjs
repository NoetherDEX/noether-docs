// Generates public/llms.txt (index) and public/llms-full.txt (full content)
// from pages/**/*.mdx. Runs automatically before every build (prebuild).
// Spec: https://llmstxt.org
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const PAGES = join(ROOT, 'pages')
// Set DOCS_SITE_URL (e.g. https://docs.noether.exchange) to emit absolute URLs.
const SITE = (process.env.DOCS_SITE_URL ?? '').replace(/\/$/, '')

async function walk(dir) {
  const out = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name)
    if (entry.isDirectory()) out.push(...(await walk(p)))
    else if (entry.name.endsWith('.mdx')) out.push(p)
  }
  return out
}

function routeOf(file) {
  let r = '/' + relative(PAGES, file).replace(/\.mdx$/, '').replace(/\\/g, '/')
  if (r.endsWith('/index')) r = r.slice(0, -'/index'.length)
  return r === '' ? '/' : r
}

function titleOf(src, route) {
  const m = src.match(/^#\s+(.+)$/m)
  return m ? m[1].trim() : route
}

function firstProse(src) {
  for (const raw of src.split('\n')) {
    const t = raw.trim()
    if (
      !t ||
      t.startsWith('#') ||
      t.startsWith('import ') ||
      t.startsWith('export ') ||
      t.startsWith('<') ||
      t.startsWith('```') ||
      t.startsWith('|') ||
      t.startsWith('{')
    )
      continue
    return t.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').slice(0, 220)
  }
  return ''
}

function sectionOf(route) {
  if (route === '/') return 'Overview'
  if (route.startsWith('/guides')) return 'User Guides'
  if (route.startsWith('/developers/rest-api')) return 'REST API Reference'
  if (route.startsWith('/developers')) return 'Developers'
  if (route.startsWith('/protocol')) return 'Protocol'
  return 'Other'
}

const SECTIONS = ['Overview', 'User Guides', 'Developers', 'REST API Reference', 'Protocol', 'Other']

const files = (await walk(PAGES)).sort()
const pages = []
for (const f of files) {
  const src = await readFile(f, 'utf8')
  const route = routeOf(f)
  pages.push({ route, title: titleOf(src, route), desc: firstProse(src), src })
}
pages.sort((a, b) => SECTIONS.indexOf(sectionOf(a.route)) - SECTIONS.indexOf(sectionOf(b.route)) || a.route.localeCompare(b.route))

let index = `# Noether Documentation

> Noether is a decentralized perpetual futures exchange on Stellar — orders, matches, and
> settlement all execute on-chain in Soroban smart contracts. These docs cover the trading
> app, the REST + WebSocket API, the TypeScript and Python SDKs, and the protocol itself.

- App: https://noether.exchange/trade (Stellar testnet)
- API base URL: https://noetherapi-production.up.railway.app (OpenAPI: /docs/json)
- SDKs: npm + PyPI package "noether-sdk"
`

for (const section of SECTIONS) {
  const inSection = pages.filter((p) => sectionOf(p.route) === section)
  if (!inSection.length) continue
  index += `\n## ${section}\n\n`
  for (const p of inSection) {
    index += `- [${p.title}](${SITE}${p.route})${p.desc ? ': ' + p.desc : ''}\n`
  }
}

let full = index + '\n---\n'
for (const p of pages) {
  const body = p.src
    .split('\n')
    .filter((l) => !l.trim().startsWith('import '))
    .join('\n')
    .trim()
  full += `\n\n<!-- PAGE: ${SITE}${p.route} -->\n\n${body}\n`
}

await writeFile(join(ROOT, 'public', 'llms.txt'), index)
await writeFile(join(ROOT, 'public', 'llms-full.txt'), full)
console.log(`llms.txt (${pages.length} pages) + llms-full.txt generated`)
