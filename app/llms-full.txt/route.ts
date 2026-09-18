import { docsLlms } from '@/lib/source';
import { site } from '@/lib/site';

export const revalidate = false;

// Only markdown link targets are made absolute; API paths in prose stay as-is.
export async function GET() {
  const body = (await docsLlms.full()).replace(/\]\(\//g, `](${site.url}/`);
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
