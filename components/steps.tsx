import type { ReactNode } from 'react';

// Nextra-style steps: every `###` heading inside becomes a numbered step.
export function Steps({ children }: { children: ReactNode }) {
  return <div className="fd-steps [&_h3]:fd-step">{children}</div>;
}

export function Step({ children }: { children: ReactNode }) {
  return <div className="fd-step">{children}</div>;
}
