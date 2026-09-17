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
    themeSwitch: { enabled: false },
    links: [
      { text: 'Guides', url: '/guides', active: 'nested-url', on: 'nav' },
      { text: 'Developers', url: '/developers', active: 'nested-url', on: 'nav' },
      { text: 'Protocol', url: '/protocol', active: 'nested-url', on: 'nav' },
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
