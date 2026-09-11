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
 *
 * HEIGHT. 104 (sm:h-26) at 1440, where the frame's Wave Line ink is 105 tall;
 * 40 (h-10) on the phone, where every Wave Line in the 375 frames is drawn
 * 39–40 tall (2576:22128, 2576:22626, 2576:22821 …). Measured off the frame
 * renders on 8 Sep 2026 — the h-16 it had before was never checked against a
 * phone frame and ran the crest 60% too deep.
 */
export const WAVE_PATH =
  "M1470.04 7.9544C1427.51 -2.1372 1377.18 -2.66008 1333.96 6.57748C1270.32 20.155 1224.29 42.5343 1157.49 50.8132C1113.11 56.3209 1072.13 52.2598 1028.08 50.5343C969.069 48.2162 917.126 51.1444 860.791 61.48C807.923 71.1707 756.575 83.7895 700.999 88.7046C633.371 94.6829 564.487 84.9573 499.434 73.4888C434.382 62.0203 369.263 48.5648 300.776 46.7696C195.602 44.0157 95.7447 68.87 1.00558 93.1491L1.00123 105.324H1468.85L1470.04 7.97183V7.9544Z";

/** The path's own box, from the viewBox crop above. */
const WAVE_X0 = 1.00123;
const WAVE_W = 1467.84877;

/**
 * One seamless roll of the wave strip, in user units. The ink is tiled
 * three wide — original, mirrored, original — so both junctions meet at
 * matching heights (a raw repeat would step: the path's left foot sits at
 * y≈93 and its right at y≈8). Rolling the strip left by exactly two tile
 * widths lands the visible window on the third copy, which is identical to
 * the first — so a finished roll is pixel-equal to the static markup.
 * Exported for About's seam gates, which animate the roll.
 */
export const WAVE_ROLL = 2 * WAVE_W;

export function WaveDivider({
  ground,
  flip = false,
  mirror = false,
  seat = "overhang",
  hook,
  className = "",
}: {
  /** CSS colour of the section this wave introduces. */
  ground: string;
  /** A crest that rises rather than falls (Figma's flip=up). */
  flip?: boolean;
  /**
   * Where the ink sits relative to this element's own box.
   *
   * `overhang` (the default, and every caller before 11 September 2026) pulls
   * the wave UP out of the top of the section that owns it — Figma's rule,
   * where the divider overlaps the foot of the outgoing section.
   *
   * `inline` drops that pull-up and leaves the ink filling its own box. It
   * exists for a seam that is its OWN element rather than the lip of a
   * section: /living-work's §01 → §02 join is a transparent block between a
   * sticky hero and a pinned aperture, and there the wave has to sit inside
   * that block's height or it overhangs the photograph and undoes the
   * full-bleed hero the block exists to give. Give the owner the same height
   * the wave has (`h-10 sm:h-26`).
   */
  seat?: "overhang" | "inline";
  /** Thick end on the left — the frame's Wave Lines laid out at x=1441
      with a 1441 width are horizontally flipped instances. */
  mirror?: boolean;
  /** Optional motion hook, rendered as `data-seam` so a page's recipes can
      select this wave without reaching for structural classes. Inert unless a
      motion host wires it. ⚠ A mirrored wave is flipped on x, so an animated
      roll reads in the opposite direction — About's seams do not mirror. */
  hook?: string;
  className?: string;
}) {
  return (
    <svg
      aria-hidden
      data-seam={hook}
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
      className={`pointer-events-none absolute inset-x-0 top-0 h-10 w-full sm:h-26 ${
        seat === "overhang" ? "-translate-y-[calc(100%-1px)]" : ""
      } ${flip ? "scale-y-[-1]" : ""} ${
        mirror ? "scale-x-[-1]" : ""
      } ${className}`}
    >
      {/* The ink, as a three-tile strip (see WAVE_ROLL). At rest only the
          first tile shows — the others sit beyond the viewBox crop — so the
          static render is unchanged; a motion host may roll the group. All
          three are the SAME exported path, transformed: nothing here is
          hand-authored vector data. */}
      <g data-wave-ink>
        <path d={WAVE_PATH} fill={ground} />
        <path
          d={WAVE_PATH}
          fill={ground}
          transform={`translate(${2 * (WAVE_X0 + WAVE_W)} 0) scale(-1 1)`}
        />
        <path d={WAVE_PATH} fill={ground} transform={`translate(${WAVE_ROLL} 0)`} />
      </g>
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

/**
 * TWO SHAPES, AND THEY ARE NOT ONE SCALED.
 *
 * The kit holds two supplied blob exports — 264 x 56 and 276 x 56 — and the
 * frames use both: the hero and Ways in blobs are drawn 276, §08's ending
 * button 264 (readouts, 10 September 2026). Until August sent the 264 export
 * the code had only the wide one, so a narrow instance would have meant
 * stretching a 276 mask down 12px. `preserveAspectRatio="none"` would have let
 * it, silently — the hand-drawn wobble squashed against every other button on
 * the site rather than a second drawn shape.
 *
 * Compared end to end they are not a uniform scale: the outer curves sit at
 * 275.887 / 263.892 and 276.594 / 264.568, so the narrow cut takes ~12 out of
 * the flat middle and leaves both caps as Marc drew them. Scaling would have
 * pulled the caps in too.
 *
 * ⚠ THE EXPORT'S OWN FILL IS IRRELEVANT HERE and deliberately left alone.
 * These are used as MASKS, so only the alpha matters and the tone comes from
 * the palette — which is why the 264 file still carries the #AF231C it was
 * exported with while nothing on the page renders oxide.
 */
const BLOB_SHAPE = {
  wide: { box: "w-[17.25rem]", src: "/artwork/blob-button.svg" },
  narrow: { box: "w-[16.5rem]", src: "/artwork/blob-button-264.svg" },
} as const;

const blobMask = (src: string) =>
  ({
    maskImage: `url(${src})`,
    WebkitMaskImage: `url(${src})`,
    maskSize: "100% 100%",
    WebkitMaskSize: "100% 100%",
    maskRepeat: "no-repeat",
    WebkitMaskRepeat: "no-repeat",
  }) as const;

function BlobShape({
  tone,
  shape,
}: {
  tone: keyof typeof BLOB_TONE;
  shape: keyof typeof BLOB_SHAPE;
}) {
  return (
    <span
      aria-hidden
      className={`absolute inset-0 ${BLOB_TONE[tone]}`}
      style={blobMask(BLOB_SHAPE[shape].src)}
    />
  );
}

/* Width now comes from BLOB_SHAPE — the two exports are different widths. */
const BLOB_BOX = "relative inline-flex h-14 max-w-full items-center gap-2";

/**
 * WHERE THE LABEL SITS IN THE SHAPE.
 *
 * `center` is what every blob on the site did until 10 September 2026, and it
 * is a reasonable default for a shape nobody has a readout for.
 *
 * `frame` is the Partnerships hi-fi's own measurement, and it is NOT centred:
 * the label is inset 26 from the left and 63 from the right of the 276-wide
 * shape, which is 37px left of centre. The supplied blob artwork — the PNG
 * August sent with the label already drawn into it — is weighted the same way,
 * so this is the designer's placement rather than a rounding error in one
 * frame. Read off `primary CTA · Button / Blob` (label x=26, w=187, y=16,
 * h=24) and checked against the artwork export.
 *
 * ⚠ NOT MADE THE DEFAULT, deliberately. The shape is shared by Wonder,
 * Connect and The Record, and I have a readout for exactly one of them.
 * Flipping the default would move four other buttons against frames nobody
 * has checked. If those frames turn out to inset the same way — and the
 * artwork export suggests they do — this becomes the default and `center`
 * goes away.
 */
const BLOB_ALIGN = {
  center: "justify-center px-6",
  frame: "justify-start pl-[26px] pr-[63px]",
} as const;

/**
 * The chevron the Wonder hi-fi (2033:7104) sets after its two closing labels:
 * right for a link, down for a download.
 *
 * THE ARTIST'S MARKS, supplied 9 Sep 2026 (August) as the two full blob
 * exports — "Register your interest" 264 × 56 and "Download the brochure"
 * 276 × 56 — with the chevron as the last path of each. This replaced an
 * inline 2.5-weight stroke that stood in for them: a UI glyph where the
 * frame draws a brush stroke that tapers and hooks.
 *
 * THEY ARE NOT ONE MARK ROTATED. Measured off the exports, right is 9 × 16
 * and down is 16 × 9, and the two are drawn separately — the down stroke
 * hooks the other way, so rotating either one gives the wrong hand. Both
 * paths are carried here at their own bounding box, as a `viewBox` window on
 * the export's coordinates rather than re-originated, so what ships is the
 * supplied curve to the last decimal.
 *
 * `fill`, not `stroke`: these are filled shapes with a varying width, and
 * they take `currentColor` so a chevron always matches its label.
 */
const BLOB_CHEVRON = {
  right: {
    box: "234.5 20 9 16",
    size: "h-4 w-[9px]",
    d: "M234.763 20.3714C234.886 20.2493 235.033 20.1688 235.164 20.1163C235.684 19.9057 236.171 20.0187 236.625 20.1522C237.554 20.4262 238.62 21.2668 240.426 23.1512C241.048 23.8006 241.494 24.3456 241.849 24.7936C242.275 25.3323 242.648 25.8128 242.904 26.2431C243.17 26.69 243.478 27.2863 243.499 27.9306C243.504 28.0927 243.492 28.2519 243.462 28.4043C243.414 28.6542 243.325 28.915 243.181 29.2244C243.119 29.359 243.046 29.5 242.966 29.6427C242.728 30.0678 242.379 30.5289 241.857 31.1818C240.782 32.5257 239.583 33.7664 238.292 34.8684C238.251 34.9032 238.22 34.9295 238.202 34.9466C238.012 35.1149 237.538 35.4528 237.011 35.6953C236.488 35.9356 235.74 36.157 235.144 35.8482C234.697 35.616 234.475 35.249 234.502 34.7856C234.519 34.4929 234.634 34.2509 234.662 34.1956C234.811 33.8315 235.475 32.9926 236.396 31.8489C236.88 31.2474 237.337 30.6796 237.477 30.4502C237.53 30.3634 237.599 30.2619 237.679 30.1443C238.053 29.5942 238.68 28.6731 238.581 27.7788C238.546 27.4638 238.42 27.078 238.235 26.7208C237.658 25.604 236.53 24.2303 235.925 23.493L235.906 23.4702C235.505 22.9805 235.053 22.4167 234.787 21.9259C234.346 21.1116 234.494 20.6396 234.765 20.3702L234.763 20.3714Z",
  },
  down: {
    box: "241.5 23.878 16 9",
    size: "h-[9px] w-4",
    d: "M257.128 24.1417C257.25 24.2644 257.331 24.4118 257.383 24.5419C257.594 25.0626 257.481 25.5496 257.347 26.0037C257.073 26.9328 256.233 27.9989 254.348 29.804C253.699 30.4265 253.154 30.8723 252.706 31.2269C252.167 31.6533 251.687 32.0266 251.256 32.2825C250.81 32.5481 250.213 32.8563 249.569 32.8772C249.407 32.8825 249.248 32.8705 249.095 32.8406C248.845 32.7919 248.584 32.7029 248.275 32.5593C248.14 32.4972 248 32.4246 247.857 32.3446C247.432 32.1059 246.971 31.7573 246.318 31.2352C244.974 30.1601 243.733 28.9609 242.631 27.6705C242.596 27.6293 242.57 27.5987 242.553 27.5799C242.385 27.3899 242.047 26.9164 241.804 26.389C241.564 25.8661 241.343 25.118 241.651 24.5225C241.884 24.0751 242.25 23.8537 242.714 23.8806C243.007 23.8978 243.249 24.0123 243.304 24.0407C243.668 24.1896 244.507 24.8539 245.651 25.774C246.252 26.2581 246.82 26.7151 247.049 26.855C247.136 26.9082 247.238 26.977 247.355 27.057C247.905 27.4318 248.826 28.0587 249.721 27.9592C250.036 27.9241 250.421 27.7984 250.779 27.6136C251.896 27.0361 253.269 25.9087 254.007 25.3035L254.029 25.2848C254.519 24.8831 255.083 24.4312 255.574 24.1656C256.388 23.7243 256.86 23.8724 257.129 24.1432L257.128 24.1417Z",
  },
} as const;

function BlobChevron({ dir }: { dir: "right" | "down" }) {
  const mark = BLOB_CHEVRON[dir];
  return (
    <svg
      aria-hidden
      viewBox={mark.box}
      className={`relative shrink-0 ${mark.size}`}
      fill="currentColor"
    >
      <path d={mark.d} />
    </svg>
  );
}

/** Label sizes: the shared 12px, and the Wonder frame's CTA16 (2033:7108). */
const BLOB_LABEL = {
  sm: "text-xs",
  /* CTA16 carries no tracking (like the story-card links); the utility's
     0.12em pushed the label onto two lines inside the 276 shape. */
  lg: "text-base tracking-normal whitespace-nowrap",
  /* ⚑ `Nav & CTA/16` AS THE PARTNERSHIPS FRAME ACTUALLY SETS IT — 16px, 800,
     150%, letter-spacing 1.28px. That 1.28 is 0.08em at this size, which is
     the number `lg` is missing: `lg` zeroes tracking because the utility's
     own 0.12em wrapped Wonder's longer labels, and 0.08 is the value the
     frame asks for rather than either extreme. At 0.08em the label measures
     187px, which is exactly the width the readout gives it. */
  cta: "text-base tracking-[0.08em] whitespace-nowrap",
} as const;

export function BlobButton({
  href,
  children,
  tone = "burnt",
  still = false,
  icon,
  size = "sm",
  align = "center",
  shape = "wide",
  className = "",
}: {
  href: string;
  children: string;
  tone?: "burnt" | "ochre" | "oxide";
  /**
   * Drop the hover lift. For pages that are static by decision — /our-people
   * and /about do not move, and that includes under a pointer. The blob is
   * already a hand-drawn shape rather than a rectangle; it does not need to
   * answer a cursor to read as a button.
   *
   * ⚑ /partnerships LEFT THIS LIST on 11 September 2026. It was static by
   * decision and passed `still` on all three of its blobs; the page is now
   * scored, so the buttons answer the cursor like every other moving page's.
   * The flag itself is unchanged and still correct for the two pages above.
   */
  still?: boolean;
  /** Trailing chevron — right for a link, down for a download. */
  icon?: "right" | "down";
  size?: keyof typeof BLOB_LABEL;
  /** Where the label sits in the shape — see BLOB_ALIGN. */
  align?: keyof typeof BLOB_ALIGN;
  /** Which drawn blob — see BLOB_SHAPE. Sets the width as well as the mask. */
  shape?: keyof typeof BLOB_SHAPE;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`group ${BLOB_BOX} ${BLOB_SHAPE[shape].box} ${BLOB_ALIGN[align]} text-canvas ${
        still
          ? ""
          : "transition-transform duration-(--dur-small) ease-quiet hover:-translate-y-0.5"
      } ${className}`}
    >
      <BlobShape tone={tone} shape={shape} />
      <span className={`eyebrow relative ${BLOB_LABEL[size]}`}>{children}</span>
      {icon ? <BlobChevron dir={icon} /> : null}
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
  tone = "muted",
  icon,
  size = "sm",
  className = "",
}: {
  children: string;
  /**
   * The Wonder hi-fi (2033:7110) draws the brochure button in full Burnt
   * Ochre with a down chevron. Passing a solid tone renders it as the frame
   * does; it is still not a link, and data-placeholder still marks the hold.
   */
  tone?: keyof typeof BLOB_TONE;
  icon?: "right" | "down";
  size?: keyof typeof BLOB_LABEL;
  className?: string;
}) {
  const muted = tone === "muted";
  return (
    <span
      data-placeholder="blob-hold"
      className={`${BLOB_BOX} ${BLOB_SHAPE.wide.box} ${BLOB_ALIGN.center} ${muted ? "text-current/55" : "text-canvas"} ${className}`}
    >
      <BlobShape tone={tone} shape="wide" />
      <span
        className={`eyebrow relative ${muted ? "text-[11px]" : BLOB_LABEL[size]}`}
      >
        {children}
      </span>
      {icon ? <BlobChevron dir={icon} /> : null}
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
      src={
        tone === "gold" ? "/artwork/cluster-gold.svg" : "/artwork/cluster.svg"
      }
      alt=""
      aria-hidden
      data-artwork="cluster"
      className={`pointer-events-none absolute opacity-90 ${className}`}
      loading="lazy"
    />
  );
}
