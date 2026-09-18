import type { ReactNode } from 'react';

// Numbered steps. Every heading of `level` that is a direct child becomes a
// step. Use level={2} when the steps are the page's top-level sections, so the
// outline never jumps from the h1 straight to an h3.
export function Steps({ children, level = 3 }: { children: ReactNode; level?: 2 | 3 }) {
  return <div className={level === 2 ? 'fd-steps [&>h2]:fd-step' : 'fd-steps [&>h3]:fd-step'}>{children}</div>;
}

export function Step({ children }: { children: ReactNode }) {
  return <div className="fd-step">{children}</div>;
}
