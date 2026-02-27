import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://skillai.hk';
  const now = '2026-02-27T00:00:00.000Z';
  return [
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/courses`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    ...['bronze', 'silver', 'gold', 'openclaw', 'platinum'].map(l => ({
      url: `${base}/courses/${l}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ];
}
