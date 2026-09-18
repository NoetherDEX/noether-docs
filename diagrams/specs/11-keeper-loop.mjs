// Loop type (type-loop.md §2): stations on a circle, clockwise ring arcs,
// dashed spokes into one hub. Here the spokes are the transactions each
// keeper phase writes to the chain.
export default {
  slug: 'keeper-loop',
  type: 'Loop',
  title: 'The keeper cycle',
  desc: 'The keeper bot runs a five-second cycle: it pushes signed prices every 30 seconds, liquidates isolated and cross positions, updates trailing-stop peaks after a push, executes triggered orders, applies funding hourly and extends contract TTLs every six hours, each phase writing its transactions to the chain.',
  build(L, slug) {
    const { C, T, text, legend } = L;
    const R = 200, sw = 160, sh = 64, hw = 200, hh = 104, margin = 40;
    const W = 2 * (R + sw / 2 + margin), cx = W / 2, cy = margin + sh / 2 + R;
    const stations = [
      { name: 'Push prices', sub: 'every 30 s' },
      { name: 'Liquidate', sub: 'isolated, cross', focal: true },
      { name: 'Trailing peaks', sub: 'after a push' },
      { name: 'Execute orders', sub: 'limit, stops' },
      { name: 'Apply funding', sub: 'hourly' },
      { name: 'Bump TTLs', sub: 'every 6 h' },
    ];
    const N = stations.length;
    const snap = (v) => Math.round(v / 4) * 4;
    const boxes = stations.map((s, k) => {
      const th = (-90 + (k * 360) / N) * (Math.PI / 180);
      const x = snap(cx + R * Math.cos(th) - sw / 2), y = snap(cy + R * Math.sin(th) - sh / 2);
      return { ...s, th, x, y };
    });
    const norm = (a) => { while (a <= -Math.PI) a += 2 * Math.PI; while (a > Math.PI) a -= 2 * Math.PI; return a; };
    function hits(b) {
      const pts = [];
      for (const xe of [b.x, b.x + sw]) { const d = R * R - (xe - cx) ** 2; if (d >= 0) for (const s of [1, -1]) { const y = cy + s * Math.sqrt(d); if (y >= b.y && y <= b.y + sh) pts.push([xe, y]); } }
      for (const ye of [b.y, b.y + sh]) { const d = R * R - (ye - cy) ** 2; if (d >= 0) for (const s of [1, -1]) { const x = cx + s * Math.sqrt(d); if (x >= b.x && x <= b.x + sw) pts.push([x, ye]); } }
      const withA = pts.map(([x, y]) => ({ x, y, d: norm(Math.atan2(y - cy, x - cx) - b.th) }));
      return { exit: withA.filter((p) => p.d > 0).sort((a, b2) => a.d - b2.d)[0], entry: withA.filter((p) => p.d < 0).sort((a, b2) => b2.d - a.d)[0] };
    }
    const f = (v) => v.toFixed(3);
    const out = [];
    boxes.forEach((b, k) => {
      const j = (k + 1) % N;
      const ex = hits(b).exit, en = hits(boxes[j]).entry;
      const phi = Math.atan2(en.y - cy, en.x - cx) - 1.2 / R;
      out.push(`<path d="M ${f(ex.x)} ${f(ex.y)} A ${R} ${R} 0 0 1 ${f(cx + R * Math.cos(phi))} ${f(cy + R * Math.sin(phi))}" fill="none" stroke="${C.muted}" stroke-width="1.2" marker-end="url(#${slug}-a)"/>`);
    });
    const dist = (u, a, b) => Math.min(Math.abs(u[0]) > 1e-9 ? a / Math.abs(u[0]) : Infinity, Math.abs(u[1]) > 1e-9 ? b / Math.abs(u[1]) : Infinity);
    boxes.forEach((b) => {
      const pc = [b.x + sw / 2, b.y + sh / 2];
      const u = [cx - pc[0], cy - pc[1]]; const len = Math.hypot(...u); u[0] /= len; u[1] /= len;
      const s0 = [pc[0] + dist(u, sw / 2, sh / 2) * u[0], pc[1] + dist(u, sw / 2, sh / 2) * u[1]];
      const e0 = [cx - (dist(u, hw / 2, hh / 2) + 6) * u[0], cy - (dist(u, hw / 2, hh / 2) + 6) * u[1]];
      out.push(`<path d="M ${f(s0[0])} ${f(s0[1])} L ${f(e0[0])} ${f(e0[1])}" fill="none" stroke="${C.muted}" stroke-width="1" stroke-dasharray="4,3" marker-end="url(#${slug}-a)"/>`);
    });
    for (const b of boxes) out.push(L.node({ x: b.x, y: b.y, w: sw, h: sh, kind: b.focal ? 'focal' : 'protocol', name: b.name, sub: b.sub }));
    const hx = cx - hw / 2, hy = cy - hh / 2;
    out.push(`<rect x="${hx}" y="${hy}" width="${hw}" height="${hh}" rx="8" fill="${C.ink}" stroke="${C.ink}" stroke-width="1"/>`);
    out.push(text(cx, cy - 4, 'Stellar testnet', { size: T.name, font: 'sans', weight: 600, fill: C.paper, maxw: hw - 16 }));
    out.push(text(cx, cy + 16, 'contract state', { size: T.sub, fill: C.paper, maxw: hw - 16 }));
    const top = cy + R + sh / 2 + margin;
    const lg = legend(slug, top, W, [
      { node: 'protocol', label: 'Keeper phase' }, { node: 'focal', label: 'Liquidations' }, { node: 'hub', label: 'Chain state' },
      { arrow: 'muted', label: 'Next phase' }, { arrow: 'muted', dashed: true, label: 'Writes' },
    ]);
    out.push(lg.markup);
    return { w: W, h: top + lg.height + 8, body: out.join('\n') };
  },
};
