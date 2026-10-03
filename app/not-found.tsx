import Link from 'next/link';
import { Wordmark } from '@/components/wordmark';

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-[720px] flex-1 flex-col justify-center px-4 py-20 sm:px-6">
      <Link href="/" className="inline-flex w-fit">
        <Wordmark />
      </Link>
      <p className="noe-eyebrow mt-10">404 · Page not found</p>
      <h1 id="main-content" tabIndex={-1} className="mt-3 text-2xl font-medium">This page does not exist.</h1>
      <p className="mt-3 max-w-[52ch] text-fd-muted-foreground">
        The docs moved to a new structure in September 2026, but every old address still resolves. If a link
        brought you here, it was probably typed by hand.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/" className="noe-btn">
          Go to the docs home
        </Link>
        <Link href="/guides/getting-started" className="noe-btn noe-btn-quiet">
          Getting started
        </Link>
        <Link href="/developers/reference" className="noe-btn noe-btn-quiet">
          Endpoint reference
        </Link>
      </div>
    </main>
  );
}
