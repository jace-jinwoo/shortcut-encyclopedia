import type { MetadataRoute } from 'next';
import { PROGRAMS } from '@/lib/shortcuts';
import { absoluteUrl, LAST_UPDATED, STATIC_PATHS } from '@/lib/site';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const progPaths = PROGRAMS.map((p) => `/shortcuts/${p.slug}/`);
  return [...STATIC_PATHS, ...progPaths].map((path) => ({
    url: absoluteUrl(path),
    lastModified: LAST_UPDATED,
    changeFrequency: path === '/' || progPaths.includes(path) ? 'monthly' : 'yearly',
    priority: path === '/' ? 1 : progPaths.includes(path) ? 0.8 : 0.4,
  }));
}
