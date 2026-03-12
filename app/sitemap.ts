import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://skillai.hk';

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/courses`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/friends`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ];

  // Dynamic article pages
  const articlesDir = path.join(process.cwd(), 'data', 'articles');
  let articlePages: MetadataRoute.Sitemap = [];

  try {
    if (fs.existsSync(articlesDir)) {
      const files = fs.readdirSync(articlesDir).filter(f => f.endsWith('.json'));
      articlePages = files.map(f => {
        const slug = f.replace('.json', '');
        const data = JSON.parse(fs.readFileSync(path.join(articlesDir, f), 'utf-8'));
        return {
          url: `${baseUrl}/friends/${slug}`,
          lastModified: data.date ? new Date(data.date) : new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        };
      });
    }
  } catch (err) {
    console.warn('Failed to load article pages for sitemap:', err);
  }

  // Course level pages
  const courseLevels = ['bronze', 'silver', 'gold', 'platinum', 'openclaw'];
  const coursePages: MetadataRoute.Sitemap = courseLevels.map(level => ({
    url: `${baseUrl}/courses/${level}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [...staticPages, ...coursePages, ...articlePages];
}
