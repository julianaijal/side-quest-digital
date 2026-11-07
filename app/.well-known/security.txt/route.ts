import { absoluteUrl } from '@/lib/seo';

// RFC 9116. Prerendered at build time, so Expires moves forward with every
// deploy. Contact points to the contact section, which keeps the email
// address out of plain text for bots.
export const dynamic = 'force-static';

const VALID_DAYS = 365;

export function GET() {
  const expires = new Date(Date.now() + VALID_DAYS * 24 * 60 * 60 * 1000);
  const body = [
    `Contact: ${absoluteUrl('/#contact')}`,
    `Expires: ${expires.toISOString()}`,
    'Preferred-Languages: en, nl',
    `Canonical: ${absoluteUrl('/.well-known/security.txt')}`,
    `Policy: ${absoluteUrl('/privacy')}`,
    '',
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
