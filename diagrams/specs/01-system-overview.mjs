export default {
  slug: 'system-overview',
  type: 'Architecture',
  title: 'Noether system overview',
  desc: 'The web app and the keeper send transactions through the Noether Router, which relays signed Noeracle prices on-chain and calls the market; the market reads prices through the shim, settles with the vault, and emits events that the indexer projects for the API gateway.',
  build(L, slug) {
    const { node, zone, route, labelH, labelV, legend } = L;
    const W = 840, w = 160;
    const p = [];
    p.push(zone({ x: 40, y: 40, w: 760, h: 124, label: 'OFF-CHAIN' }));
    p.push(zone({ x: 40, y: 200, w: 760, h: 260, label: 'STELLAR TESTNET · SOROBAN', align: 'right' }));
    p.push(zone({ x: 40, y: 496, w: 760, h: 124, label: 'READ PATH' }));
    p.push(route(slug, [[340, 112], [220, 112]], { kind: 'link' }));
    p.push(route(slug, [[500, 112], [620, 112]], { kind: 'link' }));
    p.push(route(slug, [[140, 144], [140, 240]], { kind: 'accent' }));
    p.push(route(slug, [[680, 144], [680, 180], [180, 180], [180, 240]]));
    p.push(route(slug, [[220, 272], [340, 272]]));
    p.push(route(slug, [[140, 304], [140, 376]]));
    p.push(route(slug, [[400, 304], [400, 408], [220, 408]]));
    p.push(route(slug, [[500, 272], [620, 272]]));
    p.push(route(slug, [[440, 304], [440, 536]], { dashed: true }));
    p.push(route(slug, [[500, 568], [620, 568]]));
    p.push(labelH(280, 112, 'SIGNED ROUND', 'link'));
    p.push(labelH(560, 112, 'ROUNDS', 'link'));
    p.push(labelV(140, 192, 'ONE TX', 'accent', 'left'));
    p.push(labelH(430, 180, 'KEEPER TX'));
    p.push(labelH(280, 272, 'EXECUTE'));
    p.push(labelV(140, 340, 'RELAY ROUND'));
    p.push(labelH(310, 408, 'READ PRICE'));
    p.push(labelH(560, 272, 'SETTLE'));
    p.push(labelV(440, 478, 'EVENTS'));
    p.push(labelH(560, 568, 'POSTGRES'));
    p.push(node({ x: 60, y: 80, w, kind: 'input', name: 'Web app', sub: 'wallet signs' }));
    p.push(node({ x: 340, y: 80, w, kind: 'external', name: 'Noeracle API', sub: 'api.noeracle.org' }));
    p.push(node({ x: 620, y: 80, w, name: 'Keeper', sub: 'liquidates, fills' }));
    p.push(node({ x: 60, y: 240, w, kind: 'focal', name: 'Noether Router', sub: 'verify + relay' }));
    p.push(node({ x: 340, y: 240, w, name: 'Market', sub: 'positions, orders' }));
    p.push(node({ x: 620, y: 240, w, name: 'Vault', sub: 'LP pool, NOE' }));
    p.push(node({ x: 60, y: 376, w, kind: 'store', name: 'Noeracle + shim', sub: 'prices on-chain' }));
    p.push(node({ x: 340, y: 536, w, name: 'Indexer', sub: 'events, candles' }));
    p.push(node({ x: 620, y: 536, w, name: 'API gateway', sub: 'REST, WS /v1' }));
    const lg = legend(slug, 648, W, [
      { node: 'focal', label: 'Verify-then-trade' }, { node: 'protocol', label: 'Contract or service' },
      { node: 'store', label: 'Price store' }, { node: 'external', label: 'External' }, { node: 'input', label: 'User' },
      { arrow: 'accent', label: 'Signed trade' }, { arrow: 'muted', label: 'Transaction' },
      { arrow: 'link', label: 'HTTP' }, { arrow: 'muted', dashed: true, label: 'Events' },
    ]);
    p.push(lg.markup);
    return { w: W, h: 648 + lg.height + 8, body: p.join('\n') };
  },
};
