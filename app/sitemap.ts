import type { MetadataRoute } from 'next';
import { source } from '@/lib/source';
import { site } from '@/lib/site';

export const revalidate = false;

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = source.getPages().map((page) => ({
    url: `${site.url}${page.url}`,
    changeFrequency: 'weekly' as const,
    priority: page.url.startsWith('/developers/reference/') ? 0.5 : 0.7,
  }));
  return [{ url: site.url, changeFrequency: 'weekly', priority: 1 }, ...pages];
}
