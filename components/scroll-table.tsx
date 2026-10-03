'use client';

import { useEffect, useRef, useState, type TableHTMLAttributes } from 'react';

// A table that scrolls sideways on narrow screens. When (and only when) it
// actually overflows, the wrapper joins the tab order with a name, so keyboard
// users can scroll it too (WCAG 2.1.1); wide screens get no extra tab stops.
export function ScrollTable({ label, ...props }: TableHTMLAttributes<HTMLTableElement> & { label?: string }) {
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
      className="relative my-6 overflow-auto prose-no-margin"
      {...(scrollable ? { tabIndex: 0, role: 'group', 'aria-label': label ? `Table: ${label}` : 'Table' } : {})}
    >
      <table {...props} />
    </div>
  );
}
