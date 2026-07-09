import { DocsThemeConfig, useConfig } from 'nextra-theme-docs'

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
  head: function Head() {
    const { title } = useConfig()
    const pageTitle = title ? `${title} – Noether Docs` : 'Noether Documentation'
    const description =
      'User guides and developer documentation for Noether — the decentralized perpetual futures exchange on Stellar.'
    return (
      <>
        <title>{pageTitle}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta name="description" content={description} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content="/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@Noetherdex" />
      </>
    )
  },
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
