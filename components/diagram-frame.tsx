'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

// Scroll container for a diagram. On narrow screens the diagram keeps a
// legible minimum width and scrolls sideways; only then does the frame join
// the tab order, with a name, so keyboard users can scroll it (WCAG 2.1.1).
export function DiagramFrame({ label, children }: { label: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scrollable, setScrollable] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setScrollable(el.scrollWidth > el.clientWidth + 1);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="noe-diagram-frame"
      {...(scrollable ? { tabIndex: 0, role: 'group', 'aria-label': `${label}, scrolls sideways` } : {})}
    >
      {children}
    </div>
  );
}
