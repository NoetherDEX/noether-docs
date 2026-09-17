'use client';

import { useEffect, useState } from 'react';
import { site } from '@/lib/site';

type State = { kind: 'loading' } | { kind: 'ok'; network: string } | { kind: 'down' };

// Live gateway status. Never fabricates a value: unreachable renders as such.
export function StatusStrip({ compact = false }: { compact?: boolean }) {
  const [state, setState] = useState<State>({ kind: 'loading' });

  useEffect(() => {
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), 6000);
    fetch(`${site.gateway}/v1/health`, { signal: ctl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((h: { network?: string }) => setState({ kind: 'ok', network: h.network ?? 'testnet' }))
      .catch(() => setState({ kind: 'down' }))
      .finally(() => clearTimeout(timer));
    return () => {
      clearTimeout(timer);
      ctl.abort();
    };
  }, []);

  const dot =
    state.kind === 'ok' ? 'bg-long' : state.kind === 'down' ? 'bg-short' : 'bg-faint';
  const label =
    state.kind === 'ok'
      ? `Gateway ok · ${state.network}`
      : state.kind === 'down'
        ? 'Gateway unreachable'
        : 'Gateway —';

  return (
    <div
      className={`noe-strip ${compact ? 'noe-strip-compact' : ''}`}
      role="status"
      aria-live="polite"
    >
      <span className="noe-pill noe-pill-gold">Testnet</span>
      <span className="text-fd-muted-foreground">funds are not real</span>
      <span className="ms-auto inline-flex items-center gap-1.5 font-mono text-[11px] text-fd-muted-foreground">
        <span className={`inline-block size-1.5 rounded-full ${dot}`} aria-hidden="true" />
        {label}
      </span>
    </div>
  );
}
