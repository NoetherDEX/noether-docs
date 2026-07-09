import { DocsThemeConfig } from 'nextra-theme-docs'

const config: DocsThemeConfig = {
  logo: (
    <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
      <img src="/logo.svg" alt="Noether" style={{ height: 24 }} />
      <span style={{ fontWeight: 700 }}>Noether Docs</span>
    </span>
  ),
  project: {
    link: 'https://github.com/NoetherDEX/noether'
  },
  docsRepositoryBase: 'https://github.com/NoetherDEX/noether-docs/blob/main',
  color: {
    hue: 258,
    saturation: 90
  },
  nextThemes: {
    defaultTheme: 'dark'
  },
  banner: {
    key: 'testnet-live',
    content: (
      <a href="https://noether.exchange/trade" target="_blank" rel="noreferrer">
        🧪 Noether is live on Stellar testnet — try it →
      </a>
    )
  },
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      <meta
        name="description"
        content="User guides and developer documentation for Noether — the decentralized perpetual futures exchange on Stellar."
      />
      <meta property="og:title" content="Noether Documentation" />
      <meta
        property="og:description"
        content="User guides and developer documentation for Noether — the decentralized perpetual futures exchange on Stellar."
      />
      <meta property="og:image" content="/og-image.png" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@Noetherdex" />
    </>
  ),
  footer: {
    content: (
      <span>
        © {new Date().getFullYear()} Noether — decentralized perpetual futures on Stellar.
      </span>
    )
  },
  sidebar: {
    defaultMenuCollapseLevel: 1,
    toggleButton: true
  },
  toc: {
    backToTop: true
  }
}

export default config
