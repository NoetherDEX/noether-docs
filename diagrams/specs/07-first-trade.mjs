export default {
  slug: 'first-trade',
  type: 'Flowchart',
  title: 'Your first trade',
  desc: 'Six steps from an empty browser to a closed position: add a wallet set to Testnet, activate it through Friendbot, add the USDC trustline, claim test USDC, open a position and close it, with the wallet signatures each step needs.',
  build(L, slug) {
    const { node, route, legend } = L;
    const W = 776, w = 200;
    const p = [];
    p.push(route(slug, [[240, 112], [288, 112]]));
    p.push(route(slug, [[488, 112], [536, 112]]));
    p.push(route(slug, [[636, 144], [636, 184], [140, 184], [140, 224]]));
    p.push(route(slug, [[240, 256], [288, 256]], { kind: 'accent' }));
    p.push(route(slug, [[488, 256], [536, 256]]));
    p.push(node({ x: 40, y: 80, w, name: 'Add a wallet', sub: 'set it to Testnet' }));
    p.push(node({ x: 288, y: 80, w, name: 'Activate', sub: 'Friendbot, no sig' }));
    p.push(node({ x: 536, y: 80, w, name: 'USDC trustline', sub: '1 signature' }));
    p.push(node({ x: 40, y: 224, w, name: 'Claim test USDC', sub: 'no signature' }));
    p.push(node({ x: 288, y: 224, w, kind: 'focal', name: 'Open a position', sub: '1 signature' }));
    p.push(node({ x: 536, y: 224, w, name: 'Close it', sub: '1 signature' }));
    const lg = legend(slug, 320, W, [
      { node: 'protocol', label: 'Setup step' }, { node: 'focal', label: 'Your first trade' }, { arrow: 'muted', label: 'Next step' },
    ]);
    p.push(lg.markup);
    return { w: W, h: 320 + lg.height + 8, body: p.join('\n') };
  },
};
