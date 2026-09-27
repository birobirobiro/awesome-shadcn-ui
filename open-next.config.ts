import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// All routes are prerendered at build time (see `force-static` + 
// `generateStaticParams` in the pages). This is the OpenNext documentation's
// recommended setup for fully static sites: the read-only Workers Static
// Assets incremental cache + cache interception, which serves cached routes
// without loading the Next.js server at all.
// https://opennext.js.org/cloudflare/caching#ssg-site
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
  enableCacheInterception: true,
});
