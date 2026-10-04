import { site } from '@/lib/site';

// Same-origin gateway status for the status strip (the gateway's CORS policy
// does not include the docs origin, so the browser cannot ask it directly).
export const dynamic = 'force-dynamic';

export async function GET() {
  const headers = { 'Cache-Control': 's-maxage=30, stale-while-revalidate=60' };
  try {
    const res = await fetch(`${site.gateway}/v1/health`, { signal: AbortSignal.timeout(5000), cache: 'no-store' });
    if (!res.ok) return Response.json({ ok: false }, { headers });
    const health = (await res.json()) as { status?: string; network?: string };
    return Response.json({ ok: health.status === 'ok', network: health.network ?? null }, { headers });
  } catch {
    return Response.json({ ok: false }, { headers: { 'Cache-Control': 's-maxage=15' } });
  }
}
