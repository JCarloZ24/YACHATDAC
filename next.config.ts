import path from "node:path";
import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

const nextConfig: NextConfig = {
  // Pin the workspace root. There is a lockfile in the parent Code/ directory
  // and Turbopack otherwise infers that as the root.
  turbopack: {
    root: path.resolve(import.meta.dirname),
  },

  images: {
    // WebP is the agreed delivery format for the whole photo library
    // (18 Aug briefing). AVIF first where the browser takes it.
    formats: ["image/avif", "image/webp"],
    // Next 16 allowlists qualities (default [75] only). 85 is for photographs
    // that are heavily cover-cropped — The Record's cards — where 75 showed
    // visible softening on the crop.
    qualities: [75, 85],
  },

  // Australian English throughout, and the org is an Australian corporation.
  // Keep this in mind for date/number formatting in any future locale work.

  /**
   * `/resources` became `/the-record` on 2026-09-04 (amends D1 — see
   * docs/decisions-and-risks.md). Every internal link was rewritten with it,
   * so these exist for links written OUTSIDE the repo: the drafts in
   * docs/content/drafts still say /resources, and so will anything already
   * sent to Marc, Ivy or the client.
   *
   * Permanent, and the query string carries over on its own — so
   * /resources?type=story still lands filtered.
   */
  async redirects() {
    return [
      { source: "/resources", destination: "/the-record", permanent: true },
      {
        source: "/resources/:slug",
        destination: "/the-record/:slug",
        permanent: true,
      },
      /**
       * D17 resolved 2026-09-10 (August's direction, option 1): CR3's
       * "right-way fire" → "fire-stick farming" rename was extended to this
       * article's title AND its slug, so Record slugs track their titles and a
       * rename ships with a redirect. Same reasoning as /resources above —
       * the drafts and anything already sent out still carry the old path.
       *
       * A hit on /resources/right-way-fire-… takes the wildcard above first
       * and lands here on the second hop. Two 301s, both permanent; not worth
       * a fourth rule to flatten.
       */
      {
        source: "/the-record/right-way-fire-and-the-carbon-in-the-soil",
        destination: "/the-record/fire-stick-farming-and-the-carbon-in-the-soil",
        permanent: true,
      },
    ];
  },
};

export default async function config(phase: string): Promise<NextConfig> {
  // Source inspection requested on 2026-09-08. Load the plugin only for
  // `next dev`, so source paths and the editor bridge stay out of production.
  if (phase !== PHASE_DEVELOPMENT_SERVER) return nextConfig;

  const { codeInspectorPlugin } = await import("code-inspector-plugin");

  return {
    ...nextConfig,
    turbopack: {
      ...nextConfig.turbopack,
      rules: codeInspectorPlugin({
        bundler: "turbopack",
        // Mount on every route, regardless of which page Turbopack compiles first.
        injectTo: path.resolve(import.meta.dirname, "src/app/layout.tsx"),
        hotKeys: ["metaKey", "shiftKey"],
        showSwitch: true,
      }),
    },
  };
}
