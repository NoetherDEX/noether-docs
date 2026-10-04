// Single source of the external facts the shell and components render.
export const site = {
  name: 'Noether Docs',
  url: 'https://docs.noether.exchange',
  description:
    'User guides, API reference and protocol documentation for Noether, the decentralized perpetual futures exchange on Stellar.',
  // Gateway base URL. Code samples in MDX carry the literal; change both together.
  gateway: 'https://noether-api.proudmeadow-533cf0d8.germanywestcentral.azurecontainerapps.io',
  app: 'https://testnet.noether.exchange',
  appTrade: 'https://testnet.noether.exchange/trade',
  marketing: 'https://noether.exchange',
  github: 'https://github.com/NoetherDEX/noether',
  docsRepo: 'https://github.com/NoetherDEX/noether-docs',
  npm: 'https://www.npmjs.com/package/noether-sdk',
  pypi: 'https://pypi.org/project/noether-sdk/',
  x: 'https://x.com/Noetherdex',
} as const;
