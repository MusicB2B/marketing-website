import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://fanbasd.com';
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/edit', '/api/'] },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
