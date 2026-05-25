import type { MetadataRoute } from 'next';

const BASE_URL = 'https://nabiart.com';
const LOCALES = ['ko', 'en', 'zh'];

const STATIC_ROUTES = [
  '',
  '/shows',
  '/booking',
  '/booking/lookup',
  '/people',
  '/rental',
  '/notices',
  '/support',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const route of STATIC_ROUTES) {
    for (const locale of LOCALES) {
      const prefix = locale === 'ko' ? '' : `/${locale}`;
      entries.push({
        url: `${BASE_URL}${prefix}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'daily' : 'weekly',
        priority: route === '' ? 1.0 : 0.8,
      });
    }
  }

  return entries;
}
