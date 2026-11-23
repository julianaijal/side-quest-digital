import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { site } from '@/content/site';
import { jsonLd, siteUrl } from '@/lib/seo';
import { JsonLd } from '@/components/JsonLd';
import { analyticsEnabled, consentAndGtmScript } from '@/lib/analytics';
import './globals.scss';

const inter = Inter({
  subsets: ['latin'],
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
  verification: { other: { 'msvalidate.01': '6C74C8EC533D4FDCF004DF6D2255BC0B' } },
  openGraph: {
    type: 'website',
    locale: 'en_US',
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
  themeColor: '#0E1A18',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {analyticsEnabled && (
          <>
            <link rel="preconnect" href="https://www.googletagmanager.com" />
            <link rel="dns-prefetch" href="https://www.google-analytics.com" />
            <script dangerouslySetInnerHTML={{ __html: consentAndGtmScript() }} />
          </>
        )}
      </head>
      <body>
        <a href="#main" className="skip-link">
          {site.skipLabel}
        </a>
        {children}
        <JsonLd data={jsonLd()} />
      </body>
    </html>
  );
}
