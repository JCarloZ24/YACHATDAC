# Deploying to Cloudflare Workers

*Last updated: 8 November 2026*

## Why

The Vercel deployment was paused by Vercel ("This deployment is temporarily
paused", HTTP 503 `DEPLOYMENT_PAUSED`). The site moves to Cloudflare Workers, in
the same Cloudflare account that already hosts the Proyekto Workers.

## How it is built

- `@opennextjs/cloudflare` turns the Next build into a Worker plus static assets.
- `wrangler.jsonc` — Worker name `yachatdac-web`, assets binding, self-reference
  binding, and an `IMAGES` binding for `next/image` (AVIF/WebP, qualities
  75/85/90 from `next.config.ts`).
- `open-next.config.ts` — default config, **no R2 incremental cache**: no route
  uses ISR or `revalidate`, and `/the-record/[slug]` is prerendered with
  `generateStaticParams`. Add the R2 block from the adapter template if that changes.
- Next was bumped `16.3.1` → `16.4.5` because the adapter's peer range is
  `>=15.5.29 <16 || >=16.4.5`.

## Commands

```bash
npm run cf:build     # opennextjs-cloudflare build → .open-next/
npm run cf:preview   # build + run in local workerd
npm run cf:deploy    # build + wrangler deploy
```

`.open-next/` and `.wrangler/` are gitignored and excluded from `tsc` and ESLint
(they are generated and hundreds of MB; `tsc` with `allowJs` otherwise walks them).

## Limits to watch

- Worker bundle is about 11.6 MB, 2.9 MB gzipped. Under the 10 MB (paid) Workers
  limit; only just under the 3 MB free-plan limit.
- `next/og` `ImageResponse` cards (`src/lib/og/banner.tsx`) run on Workers.
  Checked in local workerd; recheck after any font or image added to the card.
- The `next.config.ts` redirects (`/resources` → `/the-record`) are handled by
  the adapter, not by Vercel.
