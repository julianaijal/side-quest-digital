import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { site } from '@/content/site';
import { jsonLd, siteUrl } from '@/lib/seo';
import './globals.scss';

const inter = Inter({
  subsets: ['latin'],
  axes: ['opsz'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: site.meta.title,
  description: site.meta.description,
  applicationName: site.name,
  authors: [{ name: site.person }],
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    locale: 'nl_NL',
    url: '/',
    siteName: site.name,
    title: site.meta.title,
    description: site.meta.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: site.meta.title,
    description: site.meta.description,
  },
};

export const viewport: Viewport = {
  themeColor: '#F6F5F0',
  colorScheme: 'light',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="nl" className={inter.variable}>
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()).replace(/</g, '\\u003c') }}
        />
      </body>
    </html>
  );
}
