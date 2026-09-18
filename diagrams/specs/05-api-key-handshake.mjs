export default {
  slug: 'api-key-handshake',
  type: 'Sequence',
  title: 'Getting an API key',
  desc: 'The client asks the gateway for a challenge, has the wallet sign an envelope that embeds it, exchanges the signed XDR for an API key after the gateway verifies the signature and the closed-beta allowlist, then sends the key with an X-Timestamp header on each authenticated request.',
  build(L, slug) {
    const s = L.sequence(slug, {
      colW: 200,
      actors: [
        { id: 'wallet', name: 'Wallet', sub: 'holds the key', kind: 'input' },
        { id: 'client', name: 'Client', sub: 'SDK or script' },
        { id: 'gateway', name: 'Gateway', sub: 'noether-api' },
      ],
      messages: [
        { from: 'client', to: 'gateway', label: 'POST CHALLENGE', kind: 'link' },
        { from: 'gateway', to: 'client', label: 'CHALLENGE HEX', dashed: true },
        { from: 'client', to: 'wallet', label: 'SIGN ENVELOPE' },
        { from: 'wallet', to: 'client', label: 'SIGNED XDR', dashed: true },
        { from: 'client', to: 'gateway', label: 'POST /V1/KEYS', kind: 'link' },
        { from: 'gateway', self: true, label: 'VERIFY, BETA' },
        { from: 'gateway', to: 'client', label: 'API KEY', kind: 'accent', dashed: true },
        { from: 'client', to: 'gateway', label: 'BEARER + TIME', kind: 'link' },
        { from: 'gateway', to: 'client', label: '200 OK', dashed: true },
      ],
    });
    const lg = L.legend(slug, s.bottom + 24, s.width + 120, [
      { arrow: 'link', label: 'HTTP request' }, { arrow: 'muted', label: 'Local call' },
      { arrow: 'muted', dashed: true, label: 'Response' }, { arrow: 'accent', label: 'Key issued' },
    ]);
    return { w: s.width + 120, h: s.bottom + 24 + lg.height + 8, body: s.markup + '\n' + lg.markup };
  },
};
