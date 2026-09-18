export default {
  slug: 'trader-vaults',
  type: 'Sequence',
  title: 'How a trader vault works',
  desc: 'A leader creates a vault and seeds it, depositors buy shares at full NAV while the leader keeps at least 5% of them, the leader trades the pooled USDC through the vault factory so positions belong to the vault, depositors withdraw at NAV, and the leader claims 10% of gains above the high-water mark.',
  build(L, slug) {
    const s = L.sequence(slug, {
      colW: 184, boxW: 144,
      actors: [
        { id: 'leader', name: 'Leader', sub: 'runs the vault', kind: 'input' },
        { id: 'depositor', name: 'Depositor', sub: 'buys shares', kind: 'input' },
        { id: 'factory', name: 'Vault factory', sub: 'prices at NAV', kind: 'focal' },
        { id: 'market', name: 'Market', sub: 'isolated trades' },
      ],
      messages: [
        { from: 'leader', to: 'factory', label: 'CREATE VAULT', labelAt: 'source' },
        { from: 'leader', to: 'factory', label: 'SEED DEPOSIT', labelAt: 'source' },
        { from: 'depositor', to: 'factory', label: 'DEPOSIT USDC' },
        { from: 'factory', self: true, label: 'CHECK 5% RULE' },
        { from: 'factory', to: 'depositor', label: 'SHARES AT NAV', dashed: true },
        { from: 'leader', to: 'factory', label: 'LEADER TRADE', labelAt: 'source' },
        { from: 'factory', to: 'market', label: 'OPEN POSITION' },
        { from: 'depositor', to: 'factory', label: 'WITHDRAW' },
        { from: 'factory', to: 'depositor', label: 'USDC AT NAV', dashed: true },
        { from: 'leader', to: 'factory', label: 'CLAIM 10%', labelAt: 'source' },
        { from: 'factory', to: 'leader', label: 'PROFIT SHARE', kind: 'accent', dashed: true, labelAt: 'target' },
      ],
    });
    const lg = L.legend(slug, s.bottom + 24, s.width, [
      { node: 'focal', label: 'Holds the pool' }, { arrow: 'muted', label: 'Call' },
      { arrow: 'muted', dashed: true, label: 'Return' }, { arrow: 'accent', label: 'Leader fee' },
    ]);
    return { w: s.width, h: s.bottom + 24 + lg.height + 8, body: s.markup + '\n' + lg.markup };
  },
};
