import { DocsThemeConfig, useConfig } from 'nextra-theme-docs'

const config: DocsThemeConfig = {
  logo: (
    <span
      style={{
        fontWeight: 800,
        fontSize: '1.3rem',
        letterSpacing: '-0.02em',
        background:
          'linear-gradient(90deg, #ef4444, #f97316, #eab308, #22c55e, #3b82f6, #8b5cf6)',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        color: 'transparent'
      }}
    >
      Noether
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
