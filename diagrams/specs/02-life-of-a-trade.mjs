export default {
  slug: 'life-of-a-trade',
  type: 'Sequence',
  title: 'Life of a trade',
  desc: 'Opening a position: the app fetches a signed Noeracle round, the trader signs one transaction, and inside it the router verifies and relays the price, the market reads it back and runs its risk checks, the vault reserves the payout and takes the fee, and the position_opened event returns to the app.',
  build(L, slug) {
    const s = L.sequence(slug, {
      colW: 160,
      actors: [
        { id: 'trader', name: 'Trader', sub: 'app + wallet', kind: 'input' },
        { id: 'router', name: 'Router', sub: 'verify, relay', kind: 'focal' },
        { id: 'noeracle', name: 'Noeracle', sub: '+ SEP-40 shim', kind: 'store' },
        { id: 'market', name: 'Market', sub: 'risk checks' },
        { id: 'vault', name: 'Vault', sub: 'reserve, fee' },
      ],
      messages: [
        { from: 'trader', self: true, label: 'FETCH ROUND', kind: 'link' },
        { from: 'trader', to: 'router', label: 'ONE SIGNED TX', kind: 'accent' },
        { from: 'router', self: true, label: 'CHECK BUNDLE' },
        { from: 'router', to: 'noeracle', label: 'RELAY ROUND' },
        { from: 'router', to: 'market', label: 'OPEN_POSITION', labelAt: 'source' },
        { from: 'market', to: 'noeracle', label: 'LASTPRICE' },
        { from: 'noeracle', to: 'market', label: 'PRICE', dashed: true },
        { from: 'market', self: true, label: 'RISK CHECKS' },
        { from: 'market', to: 'vault', label: 'RESERVE + FEE' },
        { from: 'market', to: 'trader', label: 'OPENED EVENT', kind: 'accent', dashed: true, labelAt: 'target' },
      ],
    });
    const lg = L.legend(slug, s.bottom + 24, s.width, [
      { node: 'focal', label: 'Verifies the price' }, { arrow: 'accent', label: 'Signed trade, result' },
      { arrow: 'muted', label: 'Call' }, { arrow: 'muted', dashed: true, label: 'Return' }, { arrow: 'link', label: 'HTTP' },
    ]);
    return { w: s.width, h: s.bottom + 24 + lg.height + 8, body: s.markup + '\n' + lg.markup };
  },
};
