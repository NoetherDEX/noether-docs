import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { Wordmark } from '@/components/wordmark';
import { site } from './site';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: <Wordmark />,
      url: '/',
    },
    githubUrl: site.github,
    links: [
      { text: 'Guides', url: '/guides', active: 'nested-url' },
      { text: 'Developers', url: '/developers', active: 'nested-url' },
      { text: 'Protocol', url: '/protocol', active: 'nested-url' },
      {
        type: 'custom',
        secondary: true,
        children: (
          <a href={site.appTrade} className="noe-btn" target="_blank" rel="noreferrer">
            Open app
          </a>
        ),
      },
    ],
  };
}
