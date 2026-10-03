import { docsLlms } from '@/lib/source';
import { site } from '@/lib/site';

export const revalidate = false;

// Absolute links, like the pre-2026-09 llms.txt, so the index works when an
// agent reads it out of context.
export async function GET() {
  const body = (await docsLlms.index())
    .replace(/^# Docs\s*$/m, `# Noether Docs\n\n> ${site.description}`)
    .replace(/\]\(\//g, `](${site.url}/`);
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
