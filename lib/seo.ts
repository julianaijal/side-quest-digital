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

// Wikidata entities for the services that have one, so search engines and
// AI systems can match the topics without guessing.
const wikidata: Partial<Record<(typeof site.services.items)[number]['id'], string>> = {
  'technical-seo': 'https://www.wikidata.org/wiki/Q180711',
  analytics: 'https://www.wikidata.org/wiki/Q10719477',
  webdev: 'https://www.wikidata.org/wiki/Q386275',
};

// Service titles that are too short to stand alone as a topic.
const topicNames: Partial<Record<(typeof site.services.items)[number]['id'], string>> = {
  performance: 'Web performance',
};

/**
 * schema.org graph for the site, the business and Julian. Placeholders are
 * left out. Image URLs point at the static files Next serves, with their
 * real dimensions.
 */
export function jsonLd() {
  const url = absoluteUrl('/');
  const websiteId = `${url}#website`;
  const businessId = `${url}#business`;
  const personId = `${url}#julian`;
  const linkedin = isPlaceholder(site.linkedin) ? [] : [site.linkedin];
  const address = { '@type': 'PostalAddress', addressLocality: site.city, addressCountry: 'NL' };
  const languages = ['en', 'nl'];

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': websiteId,
        url,
        name: site.name,
        description: site.meta.description,
        inLanguage: 'en',
        publisher: { '@id': businessId },
      },
      {
        '@type': 'ProfessionalService',
        '@id': businessId,
        name: site.name,
        url,
        description: site.meta.description,
        logo: {
          '@type': 'ImageObject',
          url: absoluteUrl('/icon-512.png'),
          width: 512,
          height: 512,
        },
        image: {
          '@type': 'ImageObject',
          url: absoluteUrl('/opengraph-image.png'),
          width: 1200,
          height: 630,
        },
        identifier: { '@type': 'PropertyValue', propertyID: 'KVK', value: site.kvk },
        areaServed: { '@type': 'Country', name: site.country },
        address,
        knowsLanguage: languages,
        knowsAbout: site.services.items.map((service) => ({
          '@type': 'Thing',
          name: topicNames[service.id] ?? service.title,
          sameAs: wikidata[service.id],
        })),
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: site.llms.servicesTitle,
          itemListElement: site.services.items.map((service) => ({
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              '@id': `${url}#${service.id}`,
              name: service.title,
              description: service.text,
              provider: { '@id': businessId },
            },
          })),
        },
        founder: { '@id': personId },
        sameAs: linkedin.length ? linkedin : undefined,
      },
      {
        '@type': 'Person',
        '@id': personId,
        name: site.person,
        jobTitle: site.jobTitle,
        url: site.personalSite,
        worksFor: { '@id': businessId },
        address,
        knowsLanguage: languages,
        sameAs: [...linkedin, site.personalSite],
      },
    ],
  };
}
