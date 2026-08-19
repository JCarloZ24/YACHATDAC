import path from "node:path";
import type { NextConfig } from "next";

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
  },

  // Australian English throughout, and the org is an Australian corporation.
  // Keep this in mind for date/number formatting in any future locale work.
};

export default nextConfig;
