import Link from 'next/link';
import { site } from '@/lib/site';

export function SiteFooter() {
  return (
    <footer className="border-t border-fd-border">
      <div className="mx-auto flex w-full max-w-[1120px] flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 py-6 text-xs text-fd-muted-foreground sm:px-6">
        <p>© {new Date().getFullYear()} Noether · decentralized perpetual futures on Stellar · testnet</p>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2">
          <a className="hover:text-fd-foreground" href={site.appTrade} target="_blank" rel="noreferrer">
            App
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          <a className="hover:text-fd-foreground" href={site.github} target="_blank" rel="noreferrer">
            GitHub
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          <a className="hover:text-fd-foreground" href={site.x} target="_blank" rel="noreferrer">
            X
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          <Link className="hover:text-fd-foreground" href="/protocol/security">Security</Link>
          <Link className="hover:text-fd-foreground" href="/protocol/changelog">Changelog</Link>
          <Link className="hover:text-fd-foreground" href="/llms.txt">llms.txt</Link>
        </nav>
      </div>
    </footer>
  );
}
