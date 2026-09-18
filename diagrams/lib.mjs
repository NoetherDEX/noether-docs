// Diagram primitives following diagram-design (cathrynlavery/diagram-design):
// 4px grid, hairlines, no shadows, orthogonal connectors with r=8 elbows,
// masked arrow labels 8px clear of their stroke, legend as a bottom strip,
// accessible <title>/<desc>. Dark skin = the plugin's default dark tokens.
// Small text on the canvas uses two lightness-nudged variants (softText,
// linkText) so it clears WCAG 4.5:1; text inside boxes stays ink or muted.

export const C = {
  paper: '#2D3142',
  paper2: '#393E53',
  ink: '#F5F5F5',
  muted: '#BFC0C0',
  soft: '#8E98AC',
  softText: '#909AAE',
  accent: '#F08A59',
  accentTint: 'rgba(240,138,89,0.10)',
  link: '#6A95D8',
  linkText: '#6F9ADD',
  rule: 'rgba(245,245,245,0.12)',
  ruleSolid: 'rgba(191,192,192,0.25)',
  zoneFill: 'rgba(245,245,245,0.02)',
  zoneStroke: 'rgba(245,245,245,0.10)',
  lifeline: 'rgba(245,245,245,0.20)',
};

// Presentation type ramp (output-spec §2): names 16/600, sublabels and arrow
// labels 12, in-box tags and legend 10-11 (dense-annotation exception).
export const T = { name: 16, sub: 12, arrow: 12, tag: 10, legend: 11, zone: 10, callout: 16 };

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export const monoW = (s, size = T.arrow, track = 0.06) => s.length * size * 0.6 + Math.max(0, s.length - 1) * size * track;

const NODE = {
  protocol: { fill: C.paper2, stroke: C.ink, dash: null },
  focal: { fill: C.accentTint, stroke: C.accent, dash: null },
  store: { fill: 'rgba(245,245,245,0.05)', stroke: C.muted, dash: null },
  external: { fill: 'rgba(245,245,245,0.03)', stroke: C.soft, dash: null },
  input: { fill: 'rgba(191,192,192,0.10)', stroke: C.soft, dash: null },
  optional: { fill: 'rgba(245,245,245,0.02)', stroke: 'rgba(245,245,245,0.30)', dash: '4,3' },
  hub: { fill: C.ink, stroke: C.ink, dash: null },
};
const ARROW = {
  muted: { stroke: C.muted, text: C.muted, marker: 'a' },
  accent: { stroke: C.accent, text: C.accent, marker: 'a-accent' },
  link: { stroke: C.link, text: C.linkText, marker: 'a-link' },
};

export function text(x, y, s, { size = T.sub, font = 'mono', fill = C.muted, weight, anchor = 'middle', track, maxw, italic } = {}) {
  const attrs = [
    `x="${x}"`, `y="${y}"`, `class="dd-${font}"`, `font-size="${size}"`, `fill="${fill}"`, `text-anchor="${anchor}"`,
    weight ? `font-weight="${weight}"` : '', track ? `letter-spacing="${track}em"` : '', italic ? 'font-style="italic"' : '',
    maxw ? `data-maxw="${maxw}"` : '',
  ].filter(Boolean);
  return `<text ${attrs.join(' ')}>${esc(s)}</text>`;
}

export function node({ x, y, w, h = 64, kind = 'protocol', name, sub, tag }) {
  const k = NODE[kind];
  const cx = x + w / 2;
  const out = [
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="${C.paper}"/>`,
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="${k.fill}" stroke="${k.stroke}" stroke-width="1"${k.dash ? ` stroke-dasharray="${k.dash}"` : ''}/>`,
  ];
  let nameY = y + (sub ? 28 : h / 2 + 6);
  if (tag) {
    const tw = Math.ceil(monoW(tag, T.tag, 0.08) + 12);
    out.push(`<rect x="${x + 8}" y="${y + 8}" width="${tw}" height="16" rx="2" fill="none" stroke="${kind === 'focal' ? C.accent : C.muted}" stroke-opacity="0.4" stroke-width="0.8"/>`);
    out.push(text(x + 8 + tw / 2, y + 20, tag, { size: T.tag, fill: C.muted, track: 0.08 }));
    nameY = y + 44;
  }
  out.push(text(cx, nameY, name, { size: T.name, font: 'sans', weight: 600, fill: C.ink, maxw: w - 16 }));
  if (sub) out.push(text(cx, nameY + 19, sub, { size: T.sub, fill: C.muted, maxw: w - 16 }));
  return out.join('\n');
}

// Orthogonal polyline with r=8 quarter elbows. pts = [[x,y], ...].
export function route(slug, pts, { kind = 'muted', dashed = false, open = false, width } = {}) {
  const a = ARROW[kind];
  const r = 8;
  let d = `M ${pts[0][0]},${pts[0][1]}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const [px, py] = pts[i - 1], [cx, cy] = pts[i], [nx, ny] = pts[i + 1];
    const d1 = [Math.sign(cx - px), Math.sign(cy - py)], d2 = [Math.sign(nx - cx), Math.sign(ny - cy)];
    d += ` L ${cx - d1[0] * r},${cy - d1[1] * r} Q ${cx},${cy} ${cx + d2[0] * r},${cy + d2[1] * r}`;
  }
  const [ex, ey] = pts[pts.length - 1];
  d += ` L ${ex},${ey}`;
  const marker = open ? `${slug}-a-open` : `${slug}-${a.marker}`;
  return `<path d="${d}" fill="none" stroke="${a.stroke}" stroke-width="${width ?? (dashed ? 1 : 1.2)}"${dashed ? ' stroke-dasharray="4,3"' : ''} marker-end="url(#${marker})"/>`;
}

// Label above a horizontal segment centred on (mx, my): mask bottom 8px above the line.
export function labelH(mx, my, s, kind = 'muted', below = false) {
  const w = Math.ceil(monoW(s) + 12);
  const top = below ? my + 8 : my - 24;
  return `<rect x="${Math.round(mx - w / 2)}" y="${top}" width="${w}" height="16" rx="2" fill="${C.paper}" data-label-mask="1"/>\n` +
    text(mx, top + 12, s, { size: T.arrow, fill: ARROW[kind].text, track: 0.06, maxw: w });
}
// Label beside a vertical segment at x, centred on y: mask starts 8px to the side.
export function labelV(x, my, s, kind = 'muted', side = 'right') {
  const w = Math.ceil(monoW(s) + 12);
  const left = side === 'right' ? x + 8 : x - 8 - w;
  return `<rect x="${Math.round(left)}" y="${my - 8}" width="${w}" height="16" rx="2" fill="${C.paper}" data-label-mask="1"/>\n` +
    text(Math.round(left) + w / 2, my + 4, s, { size: T.arrow, fill: ARROW[kind].text, track: 0.06, maxw: w });
}

// Zone label sits inside the top edge; align it away from arrows entering there.
export function zone({ x, y, w, h, label, align = 'left' }) {
  const lw = Math.ceil(monoW(label, T.zone, 0.14) + 12);
  const lx = align === 'right' ? x + w - 12 - lw : align === 'center' ? Math.round(x + (w - lw) / 2) : x + 12;
  return [
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="${C.zoneFill}" stroke="${C.zoneStroke}" stroke-width="0.8"/>`,
    `<rect x="${lx}" y="${y + 8}" width="${lw}" height="16" rx="2" fill="${C.paper}"/>`,
    text(lx + lw / 2, y + 20, label, { size: T.zone, fill: C.softText, track: 0.14 }),
  ].join('\n');
}

// Flowchart shapes.
export function oval({ x, y, w, h = 48, name, kind = 'input' }) {
  const k = NODE[kind];
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="${C.paper}"/>\n` +
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="${k.fill}" stroke="${k.stroke}" stroke-width="1"/>\n` +
    text(x + w / 2, y + h / 2 + 6, name, { size: T.name, font: 'sans', weight: 600, fill: C.ink, maxw: w - 24 });
}
export function diamond({ cx, cy, w, h, name, kind = 'protocol' }) {
  const k = NODE[kind];
  const pts = `${cx},${cy - h / 2} ${cx + w / 2},${cy} ${cx},${cy + h / 2} ${cx - w / 2},${cy}`;
  const lines = Array.isArray(name) ? name : [name];
  const first = cy + 6 - (lines.length - 1) * 10;
  return `<polygon points="${pts}" fill="${C.paper}"/>\n<polygon points="${pts}" fill="${k.fill}" stroke="${k.stroke}" stroke-width="1"/>\n` +
    lines.map((l, i) => text(cx, first + i * 20, l, { size: T.sub + 2, font: 'sans', weight: 600, fill: C.ink, maxw: w * 0.62 })).join('\n');
}

// Italic serif editorial aside with a dashed leader (primitive-annotation).
export function callout({ x, y, lines, anchor = 'start', leader }) {
  const out = [];
  if (leader) out.push(`<path d="${leader}" fill="none" stroke="${C.muted}" stroke-width="1" stroke-dasharray="3,3"/>`);
  lines.forEach((l, i) => out.push(text(x, y + i * 20, l, { size: T.callout, font: 'serif', italic: true, fill: C.muted, anchor })));
  return out.join('\n');
}

// Horizontal legend strip below the content (y = top of the strip). Wraps to
// extra rows when needed; returns the strip height.
export function legend(slug, y, w, items) {
  const out = [
    `<line x1="40" y1="${y}" x2="${w - 40}" y2="${y}" stroke="${C.rule}" stroke-width="0.8"/>`,
    text(40, y + 28, 'LEGEND', { size: T.zone, fill: C.softText, anchor: 'start', track: 0.14 }),
  ];
  const x0 = 40 + Math.ceil(monoW('LEGEND', T.zone, 0.14)) + 24;
  let x = x0, row = 0;
  for (const it of items) {
    const itemW = (it.node || it.diamond ? 28 : 32) + Math.ceil(monoW(it.label, T.legend, 0.02)) + 28;
    if (x + itemW - 28 > w - 40 && x > x0) { row += 1; x = x0; }
    const ry = y + row * 28;
    if (it.diamond) {
      out.push(`<polygon points="${x + 10},${ry + 15} ${x + 20},${ry + 24} ${x + 10},${ry + 33} ${x},${ry + 24}" fill="${C.paper2}" stroke="${C.ink}" stroke-width="1"/>`);
      x += 28;
    } else if (it.node) {
      const k = NODE[it.node];
      out.push(`<rect x="${x}" y="${ry + 17}" width="20" height="14" rx="3" fill="${k.fill}" stroke="${k.stroke}" stroke-width="1"${k.dash ? ` stroke-dasharray="${k.dash}"` : ''}/>`);
      x += 28;
    } else {
      const a = ARROW[it.arrow];
      out.push(`<path d="M ${x},${ry + 24} L ${x + 22},${ry + 24}" stroke="${a.stroke}" stroke-width="1.2"${it.dashed ? ' stroke-dasharray="4,3"' : ''} marker-end="url(#${slug}-${it.open ? 'a-open' : a.marker})"/>`);
      x += 32;
    }
    out.push(text(x, ry + 28, it.label, { size: T.legend, fill: C.muted, anchor: 'start', track: 0.02 }));
    x += Math.ceil(monoW(it.label, T.legend, 0.02)) + 28;
  }
  return { markup: out.join('\n'), height: 48 + row * 28 };
}

// Sequence diagram: actors across the top, dashed lifelines, time flows down.
export function sequence(slug, { actors, messages, x0 = 40, colW = 160, boxW = 128, y0 = 40 }) {
  const cx = Object.fromEntries(actors.map((a, i) => [a.id, x0 + boxW / 2 + i * colW]));
  const parts = [];
  let y = y0 + 64 + 56;
  const rows = [];
  for (const m of messages) {
    if (m.self) {
      const x = cx[m.from];
      rows.push(route(slug, [[x, y], [x + 32, y], [x + 32, y + 24], [x + 2, y + 24]], { kind: m.kind || 'muted', dashed: !!m.dashed }));
      rows.push(`<rect x="${x + 40}" y="${y + 4}" width="${Math.ceil(monoW(m.label) + 12)}" height="16" rx="2" fill="${C.paper}" data-label-mask="1"/>`);
      rows.push(text(x + 46, y + 16, m.label, { size: T.arrow, fill: ARROW[m.kind || 'muted'].text, anchor: 'start', track: 0.06 }));
      y += 72;
      continue;
    }
    const a = cx[m.from], b = cx[m.to];
    const dir = Math.sign(b - a);
    rows.push(route(slug, [[a + dir * 2, y], [b - dir * 2, y]], { kind: m.kind || 'muted', dashed: !!m.dashed, open: !!m.open }));
    const lx = m.labelAt === 'source' ? a + dir * colW / 2 : m.labelAt === 'target' ? b - dir * colW / 2 : (a + b) / 2;
    rows.push(labelH(lx, y, m.label, m.kind || 'muted'));
    y += 56;
  }
  const bottom = y - 16;
  for (const a of actors) parts.push(`<line x1="${cx[a.id]}" y1="${y0 + 64}" x2="${cx[a.id]}" y2="${bottom}" stroke="${C.lifeline}" stroke-width="1" stroke-dasharray="3,3"/>`);
  parts.push(...rows);
  for (const a of actors) parts.push(node({ x: cx[a.id] - boxW / 2, y: y0, w: boxW, kind: a.kind || 'protocol', name: a.name, sub: a.sub }));
  return { markup: parts.join('\n'), bottom, cx, width: x0 + boxW + (actors.length - 1) * colW + 40 };
}

export function defs(slug) {
  const m = (id, fill) => `<marker id="${slug}-${id}" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="${fill}"/></marker>`;
  return `<defs>\n${m('a', C.muted)}\n${m('a-accent', C.accent)}\n${m('a-link', C.link)}\n` +
    `<marker id="${slug}-a-open" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><polyline points="0 0, 8 3, 0 6" fill="none" stroke="${C.muted}" stroke-width="1.2"/></marker>\n</defs>`;
}

export const FONT_CSS =
  `.dd-sans{font-family:var(--font-inter,'Inter'),system-ui,sans-serif}` +
  `.dd-mono{font-family:var(--font-jetbrains-mono,'JetBrains Mono'),ui-monospace,monospace}` +
  `.dd-serif{font-family:var(--font-instrument-serif,'Instrument Serif'),Georgia,serif}`;

// Assemble one SVG. fontFaces = '' for the docs variant (page fonts), or
// embedded @font-face rules for the standalone/README variant.
export function svgDoc({ slug, title, desc, w, h, body, fontFaces = '', sized = false }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}"${sized ? ` width="${w}" height="${h}"` : ''} role="img" aria-labelledby="${slug}-title ${slug}-desc" class="dd-svg">
<title id="${slug}-title">${esc(title)}</title>
<desc id="${slug}-desc">${esc(desc)}</desc>
<style>${fontFaces}${FONT_CSS}</style>
${defs(slug)}
<rect width="100%" height="100%" fill="${C.paper}"/>
${body}
</svg>`;
}
