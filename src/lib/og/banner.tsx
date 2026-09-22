import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { org } from "@/content/site";

/**
 * Link-preview banners — the image a chat app (WhatsApp, Messenger, iMessage,
 * Slack, X) shows under a shared link.
 *
 * User direction, 22 September 2026: use `public/brand/logo-stacked.png` on
 * every share card, and give each page path its own branded banner. The
 * supplied lockup is rendered as-is from a downscaled derivative
 * (`src/lib/og/logo-stacked.png`, 640px wide, sharp resize, nothing redrawn)
 * so the route stays inside next/og's 500 KB bundle budget. Rule 3 of
 * CLAUDE.md holds: the logo is rendered, never recreated.
 *
 * Every `opengraph-image.tsx` and `twitter-image.tsx` under `src/app/` calls
 * `renderBanner` so the cards read as one family: the lockup on a charcoal panel
 * at left, the page's eyebrow, title and standfirst on that page's own ground
 * at right. Copy comes from the content modules (D5), never typed here.
 *
 * Fonts: Satori reads ttf/otf/woff only, so `src/lib/og/fonts/` carries ttf
 * builds of two of the licensed faces (fontTools, no outline change):
 * Bantayog Sans ExtraBold for eyebrow and title, Work Sans 400 for the
 * standfirst. Block Berthold is licensed through Adobe Fonts as hosted
 * delivery only (public/fonts/README.md), so it is not embedded and the title
 * is set in the subheadline face instead — an OG card is not a hi-fi section,
 * and `check:type` does not lint this directory.
 *
 * Colours are the `@theme` tokens from globals.css, restated as hex because
 * Satori has no CSS custom properties. Keep them in step with that block.
 */

export const BANNER_SIZE = { width: 1200, height: 630 } as const;
export const BANNER_CONTENT_TYPE = "image/png";

/** Mirrors `--color-*` in src/app/globals.css. */
export const ground = {
  canvas: "#f6f6ec",
  charcoal: "#090e12",
  evergreen: "#22372b",
  midnight: "#122449",
  roasted: "#4e3524",
  ochre: "#d69828",
  oxide: "#af231c",
  gold: "#fbae3d",
} as const;

export type Ground = keyof typeof ground;

/** Grounds light enough to want charcoal ink; everything else takes canvas. */
const LIGHT: ReadonlySet<Ground> = new Set<Ground>(["canvas", "ochre", "gold"]);

export type BannerProps = {
  /** Short label above the title — the page's eyebrow. */
  eyebrow: string;
  title: string;
  /** Standfirst or summary; clamped to three lines. */
  standfirst?: string;
  /** Page ground — the colour the page itself opens on. */
  ground: Ground;
  /** Path shown bottom-right so the card names where it leads. */
  path: string;
};

const root = process.cwd();

async function assets() {
  const [logo, bantayog, workSans] = await Promise.all([
    readFile(join(root, "src/lib/og/logo-stacked.png")),
    readFile(join(root, "src/lib/og/fonts/BantayogSans-ExtraBold.ttf")),
    readFile(join(root, "src/lib/og/fonts/WorkSans-Regular.ttf")),
  ]);
  return {
    logoSrc: `data:image/png;base64,${logo.toString("base64")}`,
    fonts: [
      { name: "Bantayog Sans", data: bantayog, weight: 800 as const, style: "normal" as const },
      { name: "Work Sans", data: workSans, weight: 400 as const, style: "normal" as const },
    ],
  };
}

export async function renderBanner(props: BannerProps) {
  const { logoSrc, fonts } = await assets();
  const bg = ground[props.ground];
  const light = LIGHT.has(props.ground);
  const ink = light ? ground.charcoal : ground.canvas;
  const accent = light ? ground.oxide : ground.gold;
  const titleSize = props.title.length > 34 ? 52 : 68;
  const url = `yachatdac.vercel.app${props.path === "/" ? "" : props.path}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: bg,
          fontFamily: "Work Sans",
        }}
      >
        {/* Left panel — the supplied lockup on charcoal. The stacked PNG carries
            a white wordmark and legal name (it is the footer lockup), so it is
            unreadable on canvas; charcoal is the ground it was drawn for. On a
            charcoal page the two panels read as one ground, which is fine. */}
        <div
          style={{
            width: 420,
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: ground.charcoal,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- Satori renders a plain <img> */}
          <img src={logoSrc} width={300} height={352} alt="" style={{ objectFit: "contain" }} />
        </div>

        {/* Right panel — the page's own words on its own ground. */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "56px 64px 48px",
            color: ink,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontFamily: "Bantayog Sans",
                fontSize: 22,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: accent,
                marginBottom: 28,
              }}
            >
              {props.eyebrow}
            </div>
            <div
              style={{
                fontFamily: "Bantayog Sans",
                fontSize: titleSize,
                lineHeight: 1.05,
                letterSpacing: "-0.01em",
                marginBottom: 28,
              }}
            >
              {props.title}
            </div>
            {props.standfirst ? (
              <div
                style={{
                  fontSize: 26,
                  lineHeight: 1.35,
                  opacity: 0.88,
                  display: "block",
                  lineClamp: 3,
                }}
              >
                {props.standfirst}
              </div>
            ) : null}
          </div>

          {/* Footer line: the org label never wraps; a long article path may
              wrap, right-aligned, on its own side. */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              gap: 32,
              fontSize: 20,
              opacity: 0.8,
            }}
          >
            <div style={{ display: "flex", flexShrink: 0, whiteSpace: "nowrap" }}>
              {`${org.name} · Iningai Country`}
            </div>
            <div
              style={{
                display: "flex",
                fontFamily: "Bantayog Sans",
                fontSize: url.length > 40 ? 17 : 20,
                letterSpacing: "0.06em",
                textAlign: "right",
                wordBreak: "break-all",
              }}
            >
              {url}
            </div>
          </div>
        </div>
      </div>
    ),
    { ...BANNER_SIZE, fonts },
  );
}
