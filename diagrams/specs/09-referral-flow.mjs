export default {
  slug: 'referral-flow',
  type: 'Sequence',
  title: 'How a referral pays out',
  desc: 'A referrer creates a code and shares the link, the referee binds to it once, and on every referee trade the market asks the referral registry for the split, charges the referee 4% less, sends 10% of the original fee to the registry as USDC, and the referrer claims it.',
  build(L, slug) {
    const s = L.sequence(slug, {
      colW: 180,
      actors: [
        { id: 'referrer', name: 'Referrer', sub: 'owns a code', kind: 'input' },
        { id: 'referee', name: 'Referee', sub: 'binds once', kind: 'input' },
        { id: 'registry', name: 'Registry', sub: 'referral_v1', kind: 'focal' },
        { id: 'market', name: 'Market', sub: 'fee path' },
      ],
      messages: [
        { from: 'referrer', to: 'registry', label: 'CREATE CODE', labelAt: 'source' },
        { from: 'referrer', to: 'referee', label: 'SHARE LINK', dashed: true, open: true },
        { from: 'referee', to: 'registry', label: 'BIND CODE' },
        { from: 'referee', to: 'market', label: 'OPEN TRADE', labelAt: 'source' },
        { from: 'market', to: 'registry', label: 'RECORD_TRADE' },
        { from: 'registry', to: 'market', label: '4% / 10%', dashed: true },
        { from: 'market', to: 'registry', label: 'PAYOUT USDC' },
        { from: 'registry', self: true, label: 'CREDIT' },
        { from: 'referrer', to: 'registry', label: 'CLAIM', labelAt: 'source' },
        { from: 'registry', to: 'referrer', label: 'USDC', kind: 'accent', dashed: true, labelAt: 'target' },
      ],
    });
    const lg = L.legend(slug, s.bottom + 24, s.width, [
      { node: 'focal', label: 'Holds the split' }, { arrow: 'muted', label: 'Call' }, { arrow: 'muted', dashed: true, label: 'Return' },
      { arrow: 'muted', dashed: true, open: true, label: 'Off-chain' }, { arrow: 'accent', label: 'Payout' },
    ]);
    return { w: s.width, h: s.bottom + 24 + lg.height + 8, body: s.markup + '\n' + lg.markup };
  },
};
