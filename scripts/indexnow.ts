// Tells IndexNow search engines (Bing, Yandex, Seznam, Naver; they share
// pings) that the pages in the live sitemap changed. Runs after a deploy.
//
//   node scripts/indexnow.ts https://side-quest-digital.com
//
// First checks that the key file is live, because the engines reject a ping
// whose key they cannot fetch. Exits 1 when the ping is refused.

import { INDEXNOW_KEY } from '../lib/indexnow.ts';

const base = (process.argv[2] ?? 'https://side-quest-digital.com').replace(/\/$/, '');
const host = new URL(base).host;
const keyLocation = `${base}/${INDEXNOW_KEY}.txt`;

async function main() {
  const key = await fetch(keyLocation);
  if (!key.ok || (await key.text()).trim() !== INDEXNOW_KEY) {
    throw new Error(`Key file ${keyLocation} is not live (HTTP ${key.status}); deploy first.`);
  }

  const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
  const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  if (urlList.length === 0) throw new Error('No URLs found in the sitemap.');

  const response = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host, key: INDEXNOW_KEY, keyLocation, urlList }),
  });

  // 200 and 202 both mean the ping was accepted.
  if (response.status !== 200 && response.status !== 202) {
    throw new Error(`IndexNow refused the ping: HTTP ${response.status} ${await response.text()}`);
  }
  console.log(`IndexNow: ${urlList.length} URL(s) submitted (HTTP ${response.status}): ${urlList.join(', ')}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
