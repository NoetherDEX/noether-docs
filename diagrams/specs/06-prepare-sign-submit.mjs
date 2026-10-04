export default {
  slug: 'prepare-sign-submit',
  type: 'Sequence',
  title: 'Prepare, sign, submit',
  desc: 'A trade through the gateway: the client asks the gateway to prepare a simulated, unsigned transaction, signs it locally with the wallet so the key never reaches the gateway, submits the signed XDR, and the gateway sends it to the Stellar network and reports the final status.',
  build(L, slug) {
    const s = L.sequence(slug, {
      colW: 180,
      actors: [
        { id: 'wallet', name: 'Wallet', sub: 'keeps the key', kind: 'focal' },
        { id: 'client', name: 'Client', sub: 'SDK or bot' },
        { id: 'gateway', name: 'Gateway', sub: 'holds no keys' },
        { id: 'stellar', name: 'Stellar', sub: 'testnet RPC', kind: 'external' },
      ],
      messages: [
        { from: 'client', to: 'gateway', label: 'PREPARE', kind: 'link' },
        { from: 'gateway', self: true, label: 'SIMULATE' },
        { from: 'gateway', to: 'client', label: 'UNSIGNED XDR', dashed: true },
        { from: 'client', to: 'wallet', label: 'SIGN' },
        { from: 'wallet', to: 'client', label: 'SIGNED XDR', dashed: true },
        { from: 'client', to: 'gateway', label: 'SUBMIT', kind: 'link' },
        { from: 'gateway', to: 'stellar', label: 'SEND TX' },
        { from: 'stellar', to: 'gateway', label: 'STATUS', dashed: true },
        { from: 'gateway', to: 'client', label: 'SUCCESS', kind: 'accent', dashed: true },
      ],
    });
    const lg = L.legend(slug, s.bottom + 24, s.width, [
      { node: 'focal', label: 'Signs locally' }, { arrow: 'link', label: 'HTTP request' }, { arrow: 'muted', label: 'Call' },
      { arrow: 'muted', dashed: true, label: 'Response' }, { arrow: 'accent', label: 'Final status' },
    ]);
    return { w: s.width, h: s.bottom + 24 + lg.height + 8, body: s.markup + '\n' + lg.markup };
  },
};
