import Link from "next/link";

/**
 * Marc's hi-fi furniture — the pieces that hand one ground to the next.
 *
 * These are HIS vectors, not Leonard's artwork, so they carry no artwork
 * permission flag (src/content/kit.ts, WAVE_DIVIDER). Every one of them is an
 * exported asset in /public: nothing here is hand-authored path data.
 *
 * Built for The Record (Figma 2463:8492), but deliberately generic — the same
 * four pieces recur across the hi-fi frames for Truth, Wonder and Living Work.
 */

/**
 * Wave / Divider (Figma 2051:2595). ONE path, recoloured by ground and
 * flipped in code rather than shipped as ten near-identical files.
 *
 * Figma's rule, from the component description: the fill is the colour of the
 * section it INTRODUCES, and it overlaps the bottom of the outgoing section.
 * So this renders as an absolutely positioned element pulled up out of the top
 * of the INCOMING section — give that section `relative` and it lands exactly
 * where the frame seats it.
 *
 * GEOMETRY. Figma seats the 1442x151 instance at y=795 over a 900-tall frame,
 * "so its 151px overhangs the join by 46". The INK does not overhang: the path
 * stops at y=105.324 and the remaining 46 of the box is empty, so the filled
 * foot lands exactly on 900. That is why the viewBox below is cropped to the
 * path's own height — the element is the ink, and its bottom edge IS the join.
 *
 * Inline SVG rather than a CSS mask, matching TruthHeroV2: the path is filled
 * directly so there is no mask-support question, and the box is pulled a pixel
 * INTO the incoming ground so the antialiased foot cannot read as a hairline
 * across the full width.
 */
export const WAVE_PATH =
  "M1470.04 7.9544C1427.51 -2.1372 1377.18 -2.66008 1333.96 6.57748C1270.32 20.155 1224.29 42.5343 1157.49 50.8132C1113.11 56.3209 1072.13 52.2598 1028.08 50.5343C969.069 48.2162 917.126 51.1444 860.791 61.48C807.923 71.1707 756.575 83.7895 700.999 88.7046C633.371 94.6829 564.487 84.9573 499.434 73.4888C434.382 62.0203 369.263 48.5648 300.776 46.7696C195.602 44.0157 95.7447 68.87 1.00558 93.1491L1.00123 105.324H1468.85L1470.04 7.97183V7.9544Z";

export function WaveDivider({
  ground,
  flip = false,
  className = "",
}: {
  /** CSS colour of the section this wave introduces. */
  ground: string;
  /** A crest that rises rather than falls (Figma's flip=up). */
  flip?: boolean;
  className?: string;
}) {
  return (
    <svg
      aria-hidden
      /* Cropped to the path's OWN box, not a rounded one, or the seam shows a
         hairline of the wrong ground down either edge.
           left   the path starts at x=1.00123, so a viewBox at 0 leaves a
                  sub-pixel column of crest unfilled.
           right  the bottom edge stops at H1468.85 and the path then closes
                  DIAGONALLY up to 1470.04, so a viewBox out to 1470 exposes a
                  ~1.2-unit unfilled wedge — widest at the foot, which is what
                  read as a pale sliver on the navy wave (and a navy one on the
                  canvas wave). Ending at 1468.85 cuts the wedge off entirely.
         preserveAspectRatio="none" stretches the crop back to full width. */
      viewBox="1.00123 0 1467.84877 105.324"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute inset-x-0 top-0 h-16 w-full -translate-y-[calc(100%-1px)] sm:h-26 ${
        flip ? "scale-y-[-1]" : ""
      } ${className}`}
    >
      <path d={WAVE_PATH} fill={ground} />
    </svg>
  );
}

/**
 * Button / Blob (Figma 2051:2721) — "not border-radius, a real vector shape
 * with the label nudged on top".
 *
 * The filled 276x56 variant, exported to /artwork/blob-button.svg. Used as a
 * mask so the tone comes from the palette rather than from the file: the
 * export's own fill is Burnt Ochre and the frames also call for muted holds.
 */
const BLOB_TONE = {
  burnt: "bg-burnt",
  ochre: "bg-ochre",
  /* Wonder's hi-fi (2033:4367) sets its two closing buttons in Oxide Red. */
  oxide: "bg-oxide",
  /* A held button — the shape is there, the action is not. `current`, not
     `canvas`: on §04's canvas ground a canvas-tinted shape and a canvas label
     were both invisible, so the affordance R14 asks to MARK was in practice
     silently dropped. Keyed to the section's ink it reads on either ground. */
  muted: "bg-current/10",
} as const;

const BLOB_MASK = {
  maskImage: "url(/artwork/blob-button.svg)",
  WebkitMaskImage: "url(/artwork/blob-button.svg)",
  maskSize: "100% 100%",
  WebkitMaskSize: "100% 100%",
  maskRepeat: "no-repeat",
  WebkitMaskRepeat: "no-repeat",
} as const;

function BlobShape({ tone }: { tone: keyof typeof BLOB_TONE }) {
  return (
    <span
      aria-hidden
      className={`absolute inset-0 ${BLOB_TONE[tone]}`}
      style={BLOB_MASK}
    />
  );
}

const BLOB_BOX =
  "relative inline-flex h-14 w-[17.25rem] max-w-full items-center justify-center px-6";

export function BlobButton({
  href,
  children,
  tone = "burnt",
  still = false,
  className = "",
}: {
  href: string;
  children: string;
  tone?: "burnt" | "ochre" | "oxide";
  /**
   * Drop the hover lift. For pages that are static by decision — /our-people,
   * /about and /partnerships do not move, and that includes under a pointer.
   * The blob is already a hand-drawn shape rather than a rectangle; it does
   * not need to answer a cursor to read as a button.
   */
  still?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`group ${BLOB_BOX} ${
        still
          ? ""
          : "transition-transform duration-(--dur-small) ease-quiet hover:-translate-y-0.5"
      } ${className}`}
    >
      <BlobShape tone={tone} />
      <span className="eyebrow relative text-xs text-canvas">{children}</span>
    </Link>
  );
}

/**
 * The same shape with nothing behind it. The frames draw a Download button on
 * every published document; no file for any of them is in the repo, so the
 * shape renders held rather than as a link to nowhere (R14 — a marked hold
 * beats a dead link, and beats silently dropping the affordance).
 */
export function BlobHold({
  children,
  className = "",
}: {
  children: string;
  className?: string;
}) {
  return (
    <span
      data-placeholder="blob-hold"
      className={`${BLOB_BOX} ${className}`}
    >
      <BlobShape tone="muted" />
      <span className="eyebrow relative text-[0.6875rem] text-current/55">
        {children}
      </span>
    </span>
  );
}

/**
 * Dots / Rule (Figma 2051:3848) — the artist's dotted divider, "where a
 * divider needs warmth". Gold on dark grounds, the plain cut on canvas.
 */
export function DottedRule({
  tone = "gold",
  className = "",
}: {
  /**
   * `canvas` is the dot vectors recoloured to Ground/Off-White — leaves
   * recoloured, never the container — which is what the rule wants on a dark
   * ground. Gold and black both vanish into navy.
   */
  tone?: "gold" | "plain" | "canvas";
  className?: string;
}) {
  return (
    <div
      aria-hidden
      data-artwork="dots-rule"
      className={`pointer-events-none h-6 w-full bg-repeat-x bg-[length:auto_100%] ${
        {
          gold: "bg-[url(/artwork/dots-rule-gold.svg)]",
          plain: "bg-[url(/artwork/dots-rule.svg)]",
          canvas: "bg-[url(/artwork/dots-rule-canvas.svg)]",
        }[tone]
      } ${className}`}
    />
  );
}

/**
 * Artwork / Ring (Figma 2051:4022 / 2051:4024) — the footer spirals used as
 * ground. Static: artwork motion is permitted (Ivy, 2026-08-30) but these
 * frames do not ask for it, and the GoldTrail rule keeps the default still.
 */
export function RingArtwork({
  piece,
  className = "",
  tone = "canvas",
}: {
  piece: "a" | "b" | "c";
  className?: string;
  /**
   * The rings ship in Ground/Off-White, which is invisible ON canvas. There
   * the frame swaps the path to Roasted Brown rather than filtering the
   * artwork to black — the leaves are recoloured, the container is not.
   * Only piece `a` has a roasted cut, which is the only one canvas asks for.
   */
  tone?: "canvas" | "roasted";
}) {
  return (
    <div
      aria-hidden
      data-artwork={`ring-${piece}`}
      className={`pointer-events-none absolute ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- decorative SVG artwork */}
      <img
        src={`/artwork/ring-${piece}${tone === "roasted" ? "-roasted" : ""}.svg`}
        alt=""
        className="h-full w-full"
        loading="lazy"
      />
    </div>
  );
}

/**
 * Glyph / Truth (Figma 2051:2626) — the three EXISTING artist motifs. No new
 * iconography is authored here; the fourth Figma variant is an empty slot
 * awaiting the artist's motif inventory, so it is not offered.
 */
export const SEAM_GLYPHS = ["a", "b", "c"] as const;
export type SeamGlyphMotif = (typeof SEAM_GLYPHS)[number];

export function SeamGlyph({
  motif,
  className = "",
}: {
  motif: SeamGlyphMotif;
  className?: string;
}) {
  return (
    /* eslint-disable-next-line @next/next/no-img-element -- decorative SVG artwork */
    <img
      src={`/artwork/glyph-${motif}.svg`}
      alt=""
      aria-hidden
      className={`pointer-events-none absolute ${className}`}
      loading="lazy"
    />
  );
}

/**
 * Artwork / Cluster (2051:4026) — the 7-path dot cluster on a frame's corner.
 *
 * TWO CUTS, and they are not interchangeable. `cluster.svg` is the FOOTER cut:
 * the same seven paths at `fill-opacity="0.08"` in white, which is a ground
 * wash and is what Truth's frames want. `cluster-gold.svg` is The Record's cut
 * (node 2892:25680) — the same seven paths in Yellow Gold at full opacity,
 * which is a mark ON the photograph.
 *
 * Both are real Figma exports. Recolouring the footer cut in CSS does not get
 * you the gold one: the 8% is baked into the file, so a mask against gold
 * paints at 7% and disappears into the sky. That was the first attempt.
 */
export function ClusterArtwork({
  tone = "canvas",
  className = "",
}: {
  /** `gold` is The Record's cut — a mark. `canvas` is the footer's 8% wash. */
  tone?: "canvas" | "gold";
  className?: string;
}) {
  return (
    /* eslint-disable-next-line @next/next/no-img-element -- decorative SVG artwork */
    <img
      src={tone === "gold" ? "/artwork/cluster-gold.svg" : "/artwork/cluster.svg"}
      alt=""
      aria-hidden
      data-artwork="cluster"
      className={`pointer-events-none absolute opacity-90 ${className}`}
      loading="lazy"
    />
  );
}
