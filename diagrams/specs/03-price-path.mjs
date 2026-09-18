export default {
  slug: 'price-path',
  type: 'Architecture',
  title: 'How a price reaches the market',
  desc: 'Noeracle signs price rounds off-chain; the keeper pushes them on-chain on a heartbeat and the router relays a fresh round inside each trade, both into the Noeracle contract; the market reads the stored price through the SEP-40 shim and rejects prices older than 60 seconds on risk-increasing actions.',
  build(L, slug) {
    const { node, zone, route, labelH, labelV, legend } = L;
    const W = 840, w = 160;
    const p = [];
    p.push(zone({ x: 40, y: 40, w: 760, h: 244, label: 'OFF-CHAIN' }));
    p.push(zone({ x: 40, y: 320, w: 760, h: 260, label: 'STELLAR TESTNET · SOROBAN', align: 'center' }));
    p.push(route(slug, [[220, 112], [340, 112]], { kind: 'link' }));
    p.push(route(slug, [[380, 144], [380, 172], [140, 172], [140, 200]], { kind: 'link' }));
    p.push(route(slug, [[460, 144], [460, 172], [700, 172], [700, 200]], { kind: 'link' }));
    p.push(route(slug, [[140, 264], [140, 360]]));
    p.push(route(slug, [[700, 264], [700, 360]], { kind: 'accent' }));
    p.push(route(slug, [[620, 392], [220, 392]]));
    p.push(route(slug, [[700, 424], [700, 496]]));
    p.push(route(slug, [[620, 528], [220, 528]]));
    p.push(route(slug, [[140, 496], [140, 424]]));
    p.push(labelH(280, 112, 'PRICES', 'link'));
    p.push(labelH(260, 172, 'ROUNDS', 'link'));
    p.push(labelH(580, 172, 'LATEST ROUND', 'link'));
    p.push(labelV(140, 312, 'BATCH PUSH'));
    p.push(labelV(700, 312, 'ONE TX', 'accent', 'left'));
    p.push(labelH(420, 392, 'RELAY ROUND'));
    p.push(labelV(700, 460, 'EXECUTE'));
    p.push(labelH(420, 528, 'LASTPRICE'));
    p.push(labelV(140, 460, 'GET_PRICE_PERS'));
    p.push(node({ x: 60, y: 80, w, kind: 'external', name: 'Price sources', sub: 'market data' }));
    p.push(node({ x: 340, y: 80, w, kind: 'external', name: 'Noeracle API', sub: 'signs each round' }));
    p.push(node({ x: 60, y: 200, w, name: 'Keeper', sub: 'heartbeat push' }));
    p.push(node({ x: 620, y: 200, w, kind: 'input', name: 'Web app', sub: 'at trade time' }));
    p.push(node({ x: 60, y: 360, w, kind: 'store', name: 'Noeracle', sub: 'stored rounds' }));
    p.push(node({ x: 620, y: 360, w, kind: 'focal', name: 'Noether Router', sub: 'relays in-tx' }));
    p.push(node({ x: 60, y: 496, w, name: 'Noeracle shim', sub: 'SEP-40 read' }));
    p.push(node({ x: 620, y: 496, w, name: 'Market', sub: 'max age 60 s' }));
    const lg = legend(slug, 612, W, [
      { node: 'focal', label: 'Relays in the trade tx' }, { node: 'protocol', label: 'Contract or service' },
      { node: 'store', label: 'Price store' }, { node: 'external', label: 'External' }, { node: 'input', label: 'User' },
      { arrow: 'accent', label: 'Signed trade' }, { arrow: 'muted', label: 'Contract call' }, { arrow: 'link', label: 'HTTP' },
    ]);
    p.push(lg.markup);
    return { w: W, h: 612 + lg.height + 8, body: p.join('\n') };
  },
};
