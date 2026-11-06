import { site } from '@/content/site';

/** True for values that are still `[bracketed]` placeholders. */
export function isPlaceholder(value: string): boolean {
  return value.includes('[');
}

/**
 * Absolute base URL of the site. Uses `site.domain` once it is filled in.
 * Until then: NEXT_PUBLIC_SITE_URL (set it in the hosting environment), or localhost.
 */
export function siteUrl(): string {
  if (!isPlaceholder(site.domain)) return `https://${site.domain}`;
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  return 'http://localhost:3000';
}

/** Email address in a form bots do not recognise: "julian [@] example.com". */
export function obfuscatedEmail(): string {
  return `${site.emailUser} [@] ${site.emailDomain}`;
}

/** Absolute URL for a path on this site. */
export function absoluteUrl(path = '/'): string {
  return new URL(path, siteUrl()).toString();
}

/** schema.org graph for the business and Julian. Placeholders are left out. */
export function jsonLd() {
  const url = absoluteUrl('/');
  const businessId = `${url}#business`;
  const personId = `${url}#julian`;
  const sameAs = isPlaceholder(site.linkedin) ? undefined : [site.linkedin];

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfessionalService',
        '@id': businessId,
        name: site.name,
        url,
        description: site.meta.description,
        image: absoluteUrl('/opengraph-image'),
        areaServed: { '@type': 'Country', name: site.country },
        address: { '@type': 'PostalAddress', addressLocality: site.city, addressCountry: 'NL' },
        knowsAbout: site.services.items.map((service) => service.title),
        founder: { '@id': personId },
        sameAs,
      },
      {
        '@type': 'Person',
        '@id': personId,
        name: site.person,
        jobTitle: site.jobTitle,
        worksFor: { '@id': businessId },
        address: { '@type': 'PostalAddress', addressLocality: site.city, addressCountry: 'NL' },
        sameAs,
      },
    ],
  };
}
