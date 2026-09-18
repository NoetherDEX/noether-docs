'use client';

import { useEffect, useState } from 'react';

type State = { kind: 'loading' } | { kind: 'ok'; network: string } | { kind: 'down' };

// Live gateway status via the same-origin /api/status route. Never fabricates
// a value: unreachable renders as unreachable, loading renders as a dash.
export function StatusStrip({ compact = false }: { compact?: boolean }) {
  const [state, setState] = useState<State>({ kind: 'loading' });

  useEffect(() => {
    const ctl = new AbortController();
    fetch('/api/status', { signal: ctl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((s: { ok?: boolean; network?: string | null }) =>
        setState(s.ok ? { kind: 'ok', network: s.network ?? 'testnet' } : { kind: 'down' }),
      )
      .catch(() => setState({ kind: 'down' }));
    return () => ctl.abort();
  }, []);

  const dot = state.kind === 'ok' ? 'bg-long' : state.kind === 'down' ? 'bg-short' : 'bg-faint';
  const label =
    state.kind === 'ok' ? `Gateway ok · ${state.network}` : state.kind === 'down' ? 'Gateway unreachable' : 'Gateway —';

  if (compact) {
    return (
      <div className="noe-strip noe-strip-compact" role="status" aria-live="polite">
        <span className="noe-pill noe-pill-gold">Testnet</span>
        <span className="truncate text-fd-muted-foreground">Funds are not real</span>
        <span className="ms-auto inline-flex shrink-0 items-center" title={label}>
          <span className={`inline-block size-1.5 rounded-full ${dot}`} aria-hidden="true" />
          <span className="sr-only">{label}</span>
        </span>
      </div>
    );
  }

  return (
    <div className="noe-strip" role="status" aria-live="polite">
      <span className="noe-pill noe-pill-gold">Testnet</span>
      <span className="text-fd-muted-foreground">Funds are not real</span>
      <span className="ms-auto inline-flex items-center gap-1.5 font-mono text-[11px] text-fd-muted-foreground">
        <span className={`inline-block size-1.5 rounded-full ${dot}`} aria-hidden="true" />
        {label}
      </span>
    </div>
  );
}
