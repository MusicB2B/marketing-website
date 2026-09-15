import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://fanbasedhq.com';
  return {
    // The editor route is deliberately absent. A Disallow line is public, so
    // naming it there would advertise the path to every scanner that reads
    // this file. The editor carries a noindex tag instead, which keeps it out
    // of search results without publishing where it is.
    rules: { userAgent: '*', allow: '/', disallow: ['/api/'] },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
