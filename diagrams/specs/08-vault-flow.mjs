export default {
  slug: 'vault-flow',
  type: 'Architecture',
  title: 'Where the protocol vault money goes',
  desc: 'Depositors put USDC into the protocol vault, which takes the other side of every trade: trader fees and losses flow in and trader profits flow out; the vault routes a protocol share of fees into the insurance buffer, and to the treasury once the buffer is full; half of each liquidation penalty also goes to the buffer, which pays winning traders first.',
  build(L, slug) {
    const { node, route, labelH, labelV, legend } = L;
    const W = 840;
    const p = [];
    p.push(route(slug, [[200, 100], [320, 100]]));
    p.push(route(slug, [[320, 124], [200, 124]]));
    p.push(route(slug, [[640, 100], [520, 100]]));
    p.push(route(slug, [[520, 124], [640, 124]]));
    p.push(route(slug, [[440, 144], [440, 260]]));
    p.push(route(slug, [[344, 144], [344, 200], [120, 200], [120, 260]]));
    p.push(route(slug, [[680, 144], [680, 280], [520, 280]]));
    p.push(route(slug, [[520, 304], [720, 304], [720, 144]], { kind: 'accent' }));
    p.push(labelH(260, 100, 'DEPOSIT'));
    p.push(labelH(260, 124, 'WITHDRAW', 'muted', true));
    p.push(labelH(580, 100, 'FEES, LOSSES'));
    p.push(labelH(580, 124, 'PROFITS', 'muted', true));
    p.push(labelV(440, 214, 'FEE SHARE'));
    p.push(labelH(232, 200, 'WHEN FULL'));
    p.push(labelH(600, 280, 'HALF PENALTY'));
    p.push(labelH(620, 304, 'PAYS FIRST', 'accent', true));
    p.push(node({ x: 40, y: 80, w: 160, kind: 'input', name: 'Depositor', sub: '30 min cooldown' }));
    p.push(node({ x: 320, y: 80, w: 200, kind: 'focal', name: 'Protocol vault', sub: 'NOE = AUM / supply' }));
    p.push(node({ x: 640, y: 80, w: 160, name: 'Market', sub: 'all traders' }));
    p.push(node({ x: 40, y: 260, w: 160, kind: 'external', name: 'Treasury', sub: 'fee overflow' }));
    p.push(node({ x: 320, y: 260, w: 200, kind: 'store', name: 'Insurance buffer', sub: 'target 10% of reserve' }));
    const lg = legend(slug, 368, W, [
      { node: 'input', label: 'You' }, { node: 'focal', label: 'The pool' }, { node: 'protocol', label: 'Contract' },
      { node: 'store', label: 'First-loss buffer' }, { node: 'external', label: 'Treasury' },
      { arrow: 'muted', label: 'USDC flow' }, { arrow: 'accent', label: 'Paid first' },
    ]);
    p.push(lg.markup);
    return { w: W, h: 368 + lg.height + 8, body: p.join('\n') };
  },
};
