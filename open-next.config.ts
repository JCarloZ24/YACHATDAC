// OpenNext for Cloudflare. Default (no incremental cache override) because the
// site has no ISR; every route is static or prerendered. See wrangler.jsonc.
import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig();
