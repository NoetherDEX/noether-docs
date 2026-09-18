export default {
  slug: 'liquidation',
  type: 'Flowchart',
  title: 'How an isolated position is liquidated',
  desc: 'A keeper checks each position: if equity is still above the 2% maintenance margin nothing happens; a bankrupt position is closed at once with its collateral going to the vault; a position above $1,000 notional is reduced by 20% and re-checked after at least 30 seconds; anything else is closed in full with a 1% penalty and the remaining equity refunded.',
  build(L, slug) {
    const { node, oval, diamond, route, labelH, labelV, callout, legend } = L;
    const W = 680;
    const p = [];
    p.push(route(slug, [[240, 88], [240, 120]]));
    p.push(route(slug, [[340, 176], [440, 176]]));
    p.push(route(slug, [[240, 232], [240, 264]]));
    p.push(route(slug, [[340, 320], [440, 320]]));
    p.push(route(slug, [[240, 376], [240, 408]]));
    p.push(route(slug, [[340, 464], [440, 464]]));
    p.push(route(slug, [[240, 520], [240, 560]], { kind: 'accent' }));
    p.push(route(slug, [[160, 592], [80, 592], [80, 176], [140, 176]], { dashed: true }));
    p.push(labelH(390, 176, 'NO'));
    p.push(labelV(240, 248, 'YES'));
    p.push(labelH(390, 320, 'YES'));
    p.push(labelV(240, 392, 'NO'));
    p.push(labelH(390, 464, 'NO'));
    p.push(labelV(240, 540, 'YES', 'accent'));
    p.push(labelV(80, 392, 'AFTER 30 S'));
    p.push(oval({ x: 140, y: 40, w: 200, name: 'Keeper check', kind: 'input' }));
    p.push(diamond({ cx: 240, cy: 176, w: 200, h: 112, name: ['Equity below', 'maintenance?'] }));
    p.push(diamond({ cx: 240, cy: 320, w: 200, h: 112, name: 'Bankrupt?' }));
    p.push(diamond({ cx: 240, cy: 464, w: 200, h: 112, name: ['Size above', '$1,000?'] }));
    p.push(oval({ x: 440, y: 152, w: 200, name: 'No action', kind: 'input' }));
    p.push(node({ x: 440, y: 288, w: 200, name: 'Close all', sub: 'collateral to vault' }));
    p.push(node({ x: 440, y: 432, w: 200, name: 'Close in full', sub: '1% penalty, refund' }));
    p.push(node({ x: 160, y: 560, w: 160, kind: 'focal', name: 'Close 20%', sub: 'then wait 30 s' }));
    p.push(callout({ x: 440, y: 536, lines: ['Penalty: 1% of the size closed,', 'half to the keeper, half to', 'the insurance buffer.'], leader: 'M 540,500 L 540,516' }));
    const lg = legend(slug, 660, W, [
      { node: 'input', label: 'Start or end' }, { diamond: true, label: 'Decision' }, { node: 'protocol', label: 'Close' },
      { node: 'focal', label: 'Partial step' }, { arrow: 'accent', label: 'Partial path' }, { arrow: 'muted', dashed: true, label: 'Re-check' },
    ]);
    p.push(lg.markup);
    return { w: W, h: 660 + lg.height + 8, body: p.join('\n') };
  },
};
