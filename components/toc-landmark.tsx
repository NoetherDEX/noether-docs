'use client';

import { useEffect } from 'react';

// Fumadocs renders the "On this page" column outside any landmark. Name it as
// navigation so landmark users can reach it (axe `region`). Runs per page.
export function TocLandmark() {
  useEffect(() => {
    const toc = document.getElementById('nd-toc');
    if (toc && !toc.hasAttribute('role')) {
      toc.setAttribute('role', 'navigation');
      toc.setAttribute('aria-label', 'On this page');
    }
  }, []);
  return null;
}
