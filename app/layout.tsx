import { RootProvider } from 'fumadocs-ui/provider/next';
import localFont from 'next/font/local';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './global.css';
import { site } from '@/lib/site';

// Self-hosted variable fonts, the same files the app ships (web/app/fonts).
const inter = localFont({ src: './fonts/Inter.woff2', weight: '100 900', display: 'swap', variable: '--font-inter' });
const sora = localFont({ src: './fonts/Sora.woff2', weight: '100 800', display: 'swap', variable: '--font-sora' });
const mono = localFont({ src: './fonts/JetBrainsMono.woff2', weight: '100 800', display: 'swap', variable: '--font-jetbrains-mono' });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name, template: `%s | ${site.name}` },
  description: site.description,
  icons: { icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }] },
  openGraph: { siteName: site.name, type: 'website', images: [{ url: '/og-image.png', width: 1200, height: 630 }] },
  twitter: { card: 'summary_large_image', site: '@Noetherdex' },
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    // Dark only, like the app. Theme switching is disabled in RootProvider.
    <html lang="en" className={`dark ${inter.variable} ${sora.variable} ${mono.variable}`} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <a href="#main-content" className="noe-skip">
          Skip to content
        </a>
        <RootProvider theme={{ enabled: false }}>{children}</RootProvider>
      </body>
    </html>
  );
}
