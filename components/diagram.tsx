import { readFileSync } from 'node:fs';
import path from 'node:path';
import manifest from '@/diagrams/manifest.json';
import { DiagramFrame } from '@/components/diagram-frame';

// Inline a generated diagram (diagrams/inline/<name>.svg) so its text uses the
// page's own fonts and stays selectable. Build the SVGs with `npm run diagrams`.
export function Diagram({ name, caption }: { name: string; caption?: string }) {
  const meta = manifest.find((d) => d.slug === name);
  if (!meta) throw new Error(`Unknown diagram "${name}"; run npm run diagrams`);
  const svg = readFileSync(path.join(process.cwd(), 'diagrams/inline', `${name}.svg`), 'utf8');
  return (
    <figure className="noe-diagram not-prose">
      <DiagramFrame label={meta.title}>
        <div
          className="noe-diagram-canvas"
          style={{ maxWidth: meta.w, minWidth: Math.round(meta.w * 0.9) }}
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      </DiagramFrame>
      <figcaption>
        {caption ?? meta.title}{' '}
        <a href={`/diagrams/${name}.svg`} target="_blank" rel="noreferrer">
          Open full size<span className="sr-only"> (opens in a new tab)</span>
        </a>
      </figcaption>
    </figure>
  );
}
