// Refreshes public/openapi.json from the live gateway.
// Usage: npm run fetch:openapi  (override source with NOETHER_OPENAPI_URL)
import { writeFile } from 'node:fs/promises'

const SPEC_URL =
  process.env.NOETHER_OPENAPI_URL ??
  'https://noetherapi-production.up.railway.app/docs/json'

const res = await fetch(SPEC_URL)
if (!res.ok) {
  console.error(`Failed to fetch OpenAPI spec: HTTP ${res.status} from ${SPEC_URL}`)
  process.exit(1)
}

const spec = await res.json()
await writeFile(
  new URL('../public/openapi.json', import.meta.url),
  JSON.stringify(spec, null, 2) + '\n'
)
console.log(
  `public/openapi.json updated — ${spec.info?.title} v${spec.info?.version}, ${
    Object.keys(spec.paths ?? {}).length
  } paths`
)
