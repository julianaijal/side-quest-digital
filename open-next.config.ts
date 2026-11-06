import { defineCloudflareConfig } from '@opennextjs/cloudflare';
import staticAssetsIncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache';

// The page is prerendered at build time, so the cache only serves build output.
// Switch to the R2 cache once content needs revalidation (headless CMS, see ROADMAP.md).
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
});
