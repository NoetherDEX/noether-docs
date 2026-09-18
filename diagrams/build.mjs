// Build every diagram in diagrams/specs into three outputs:
//   diagrams/html/<slug>.html   plugin-style standalone page (Google Fonts)
//   diagrams/inline/<slug>.svg  docs variant: uses the page's own fonts
//   public/diagrams/<slug>.svg  standalone/README variant: fonts embedded
// Run: PYFTSUBSET=/path/to/pyftsubset node diagrams/build.mjs
import { readdir, readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import * as L from './lib.mjs';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const FONTS = {
  sans: { file: 'app/fonts/Inter.woff2', family: 'Inter', face: 'font-weight:100 900;' },
  mono: { file: 'app/fonts/JetBrainsMono.woff2', family: 'JetBrains Mono', face: 'font-weight:100 800;' },
  serif: { file: 'app/fonts/InstrumentSerifItalic.woff2', family: 'Instrument Serif', face: 'font-style:italic;font-weight:400;' },
};
const PYFTSUBSET = process.env.PYFTSUBSET || 'pyftsubset';
const only = process.argv.slice(2);

const unesc = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&');
function glyphsByFont(svg) {
  const out = { sans: new Set(), mono: new Set(), serif: new Set() };
  for (const m of svg.matchAll(/<text [^>]*class="dd-(sans|mono|serif)"[^>]*>([^<]*)<\/text>/g)) for (const ch of unesc(m[2])) out[m[1]].add(ch);
  return out;
}
function fontFaces(slug, glyphs, tmp) {
  let css = '';
  for (const [key, f] of Object.entries(FONTS)) {
    if (!glyphs[key].size) continue;
    const outFile = path.join(tmp, `${slug}-${key}.woff2`);
    execFileSync(PYFTSUBSET, [path.join(ROOT, f.file), `--text=${[...glyphs[key]].join('')} `, '--flavor=woff2', `--output-file=${outFile}`, '--layout-features=kern,liga,calt', '--no-hinting'], { stdio: 'pipe' });
    css += `@font-face{font-family:'${f.family}';src:url(data:font/woff2;base64,${readFileSyncB64(outFile)}) format('woff2');${f.face}}`;
  }
  return css;
}
import { readFileSync } from 'node:fs';
const readFileSyncB64 = (p) => readFileSync(p).toString('base64');

const html = (spec, svg) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${spec.title}</title>
  <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', system-ui, sans-serif; background: ${L.C.paper}; color: ${L.C.ink}; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 3rem 2rem; }
    .frame { max-width: 1000px; width: 100%; }
    .eyebrow { font-family: 'JetBrains Mono', ui-monospace, monospace; font-size: 0.66rem; font-weight: 500; letter-spacing: 0.18em; text-transform: uppercase; color: ${L.C.muted}; margin-bottom: 0.5rem; }
    h1 { font-family: 'Instrument Serif', serif; font-size: clamp(1.5rem, 2.4vw + 0.75rem, 2rem); font-weight: 400; letter-spacing: -0.02em; line-height: 1.15; margin-bottom: 1.5rem; }
    svg { width: 100%; min-width: 720px; height: auto; display: block; }
  </style>
</head>
<body>
  <div class="frame">
    <p class="eyebrow">${spec.type} · Noether</p>
    <h1>${spec.title}</h1>
${svg}
  </div>
</body>
</html>
`;

const files = (await readdir(path.join(ROOT, 'diagrams/specs'))).filter((f) => f.endsWith('.mjs')).sort();
const tmp = path.join(ROOT, 'diagrams/.tmp');
await rm(tmp, { recursive: true, force: true });
for (const d of ['diagrams/.tmp', 'diagrams/html', 'diagrams/inline', 'public/diagrams']) await mkdir(path.join(ROOT, d), { recursive: true });
const manifest = [];
for (const f of files) {
  const spec = (await import(path.join(ROOT, 'diagrams/specs', f))).default;
  if (only.length && !only.includes(spec.slug)) continue;
  const { w, h, body } = spec.build(L, spec.slug);
  const inline = L.svgDoc({ slug: spec.slug, title: spec.title, desc: spec.desc, w, h, body });
  const faces = fontFaces(spec.slug, glyphsByFont(inline), tmp);
  const standalone = L.svgDoc({ slug: spec.slug, title: spec.title, desc: spec.desc, w, h, body, fontFaces: faces, sized: true });
  await writeFile(path.join(ROOT, 'diagrams/inline', `${spec.slug}.svg`), inline + '\n');
  await writeFile(path.join(ROOT, 'public/diagrams', `${spec.slug}.svg`), standalone + '\n');
  await writeFile(path.join(ROOT, 'diagrams/html', `${spec.slug}.html`), html(spec, inline));
  manifest.push({ slug: spec.slug, title: spec.title, desc: spec.desc, w, h, bytes: standalone.length });
  console.log(`${spec.slug.padEnd(24)} ${w}x${h}  standalone ${(standalone.length / 1024).toFixed(0)} KB`);
}
await rm(tmp, { recursive: true, force: true });
if (!only.length) await writeFile(path.join(ROOT, 'diagrams/manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
