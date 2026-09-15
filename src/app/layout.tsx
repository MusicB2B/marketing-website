import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import { loadContent } from '@/lib/store';
import './globals.css';

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  display: 'swap',
  variable: '--font-roboto',
});

export function generateMetadata(): Metadata {
  const { meta } = loadContent();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://fanbasedhq.com';
  return {
    metadataBase: new URL(siteUrl),
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: siteUrl,
      siteName: 'Fanbased',
      images: meta.ogImage ? [meta.ogImage] : undefined,
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title: meta.title, description: meta.description },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={roboto.variable}>
      <body>{children}</body>
    </html>
  );
}
