/**
 * Media manifest — and the permission that travels with each slot.
 *
 * WHY THIS FILE EXISTS
 * --------------------
 * Whether a photograph may move is not a property of the component that shows
 * it. It is a property of the photograph. permissions.md records three closed
 * buckets and one open one, and if that knowledge lives only in code comments
 * then the first person to reuse a component in a new place breaks the rule
 * without ever seeing it.
 *
 * So the bucket is stored with the asset and its MOTION GRADE is derived from
 * it. MediaTile reads the bucket and refuses to move the image plane of a
 * graded slot even if a caller asks it to. The rule is enforced, not
 * documented.
 *
 * THE BUCKETS, straight from permissions.md
 * -----------------------------------------
 *   country        Landscape, sky, water, first light. No restriction.
 *   work           Rangers working, restoration, the flux towers. No
 *                  restriction — this is documentary photography of people
 *                  doing a job, not cultural material.
 *   artwork        Leonard Mickelo's commissioned artwork. Motion PERMITTED —
 *                  Ivy, 2026-08-30, superseding the old static-only hold. The
 *                  artist's own sign-off is noted outstanding in permissions.md.
 *   cultural-site  Marra Wonga, the engravings, the teaching wall, the
 *                  escarpment. Available and used, at `frame` grade: the world
 *                  moves and the record holds. Ivy, 2026-08-30.
 *   story-wall     Available — Ivy, 2026-08-30, "everything we have can be
 *                  USED". Graded `frame` for the same reason as cultural-site.
 *
 * Photography now exists — see src/content/kit.ts, which carries batch 1 with a
 * grade on every frame. Slots below still holding `src: null` render as tonal
 * squares; dropping a photograph in means setting `src` and nothing else.
 */

import type { MotionGrade } from "@/content/kit";

export type MediaBucket =
  | "country"
  | "work"
  | "artwork"
  | "cultural-site"
  | "story-wall";

/**
 * How much of a slot may move. Derived from permissions.md, not from anyone's
 * judgement at the call site.
 *
 *   full   the image plane itself may be scrubbed, masked, pushed, warped.
 *   frame  the world moves and the record holds — plate, ground, scrim, type
 *          and neighbouring layers animate at full weight; the image does not.
 *
 * `frame` is not a lesser ration. The heaviest plates in the kit — P1 full-bleed
 * hold, P8 cinematic hold, P9 dissolve pair — are all frame plates.
 *
 * This replaced a boolean. A boolean could only say yes or no, so everything
 * sensitive was forced into stillness; the grade says which channel moves
 * instead, which is what Ivy actually chose on 2026-08-30.
 */
export const MOTION_GRADE: Record<MediaBucket, MotionGrade> = {
  country: "full",
  work: "full",
  artwork: "full", // Ivy, 2026-08-30 — artwork motion permitted
  "cultural-site": "frame", // Ivy, 2026-08-30 — the world moves, the record holds
  "story-wall": "frame", // available (Ivy, 2026-08-30), graded as cultural material
};

/**
 * Whether a bucket may be shown at all. Everything the project holds is
 * available — Ivy, 2026-08-30: "everything we have can be USED".
 */
export const MAY_SHOW: Record<MediaBucket, boolean> = {
  country: true,
  work: true,
  artwork: true,
  "cultural-site": true,
  "story-wall": true,
};

export type MediaSlot = {
  id: string;
  bucket: MediaBucket;
  /** What this slot expects. A build note for whoever sources the photo. */
  expects: string;
  /** Real asset path once it lands. Null renders the placeholder square. */
  src: string | null;
  /** Palette anchor for the placeholder square while src is null. */
  tone: "evergreen" | "midnight" | "roasted" | "oxide" | "burnt" | "eucalyptus" | "charcoal";
};

/**
 * The Invitation grid — twelve slots that converge behind the heading.
 *
 * Deliberately country and work only. The reference site this behaviour comes
 * from animates photographs of artworks; here that subject matter is closed,
 * so the grid is built from the material that is open. Not a compromise —
 * Country and the work being done on it are the better subject anyway.
 */
export const invitationGrid: MediaSlot[] = [
  { id: "grid-01", bucket: "country", expects: "First light over the range", src: null, tone: "midnight" },
  { id: "grid-02", bucket: "work", expects: "Cool burn — right-way fire", src: null, tone: "oxide" },
  { id: "grid-03", bucket: "country", expects: "A spring running", src: null, tone: "evergreen" },
  { id: "grid-04", bucket: "work", expects: "Seed collecting", src: null, tone: "burnt" },
  { id: "grid-05", bucket: "country", expects: "Open Country, wide", src: null, tone: "roasted" },
  { id: "grid-06", bucket: "work", expects: "A flux tower on Country", src: null, tone: "evergreen" },
  { id: "grid-07", bucket: "country", expects: "Night sky", src: null, tone: "charcoal" },
  { id: "grid-08", bucket: "work", expects: "Fencing or restoration work", src: null, tone: "burnt" },
  { id: "grid-09", bucket: "country", expects: "Water on Country", src: null, tone: "midnight" },
  { id: "grid-10", bucket: "work", expects: "Rangers walking Country", src: null, tone: "evergreen" },
  { id: "grid-11", bucket: "country", expects: "Vegetation, close", src: null, tone: "eucalyptus" },
  { id: "grid-12", bucket: "work", expects: "Hands working — tools, seed, soil", src: null, tone: "roasted" },
];

/**
 * The Living Work dolly planes (D1). Three planes at fixed z.
 * Work photography — the open bucket, so these may move.
 */
export const livingWorkPlanes: MediaSlot[] = [
  { id: "dolly-far", bucket: "work", expects: "Wide — the work in its setting", src: null, tone: "charcoal" },
  { id: "dolly-mid", bucket: "work", expects: "Mid — people at the task", src: null, tone: "roasted" },
  { id: "dolly-near", bucket: "work", expects: "Close — hands, tools, detail", src: null, tone: "burnt" },
];

/**
 * The hero, day and night — REAL ASSETS, pulled from Marc's hi-fi.
 *
 * Frames 17:256 and 17:2802 on the "Reference — Marc's hi-fi" page are the
 * same photograph at sunset and under stars. Extracted from the image fill on
 * nodes 17:257 / 17:2803.
 *
 * Bucket is `country`: a dirt road, a tree, sky. No cultural site, no people,
 * no artwork. Nothing here is restricted, so it may move.
 *
 * ⚠ PROVENANCE UNCONFIRMED. This reads as stock photography rather than
 * Turraburra. A site about one specific place showing a generic outback road
 * is a claim it may not be able to back, and that is a content decision, not a
 * build one. Fine for the prototype; flag before anything is published.
 * public/media/ is gitignored ("client media library ... does not belong in
 * git"), so these stay local either way.
 */
export const heroSlot: MediaSlot = {
  id: "hero-day",
  bucket: "country",
  expects: "Country at first light — the beat's own mediaNote",
  src: "/media/hero-country-day.png",
  tone: "charcoal",
};

/**
 * The night cut of the same frame.
 *
 * ⚠ TWO FRAMES MAY BE TWO OPTIONS RATHER THAN A SEQUENCE. Marc has drawn the
 * homepage twice, once at sunset and once at night, and that most likely means
 * "pick one". It is used here as the opening state of the entry rewind — you
 * arrive at night and dawn breaks — because that is what the beat's own note
 * asks for ("Country at first light") and it costs nothing to reverse. If he
 * means pick one, set HERO_NIGHT_ENTRY to false in Hero.tsx; nothing else
 * changes.
 */
export const heroNightSlot: MediaSlot = {
  id: "hero-night",
  bucket: "country",
  expects: "The same frame under stars",
  src: "/media/hero-country-night.png",
  tone: "midnight",
};

/**
 * The dotted path across the bottom of the hero — Leonard Mickelo's artwork.
 *
 * ⛔ STATIC ONLY. NOT A DECORATION TO BE ANIMATED.
 * permissions.md: "Vectorised artwork received. No motion permission
 * recorded. Artwork is static imagery only. No animating, masking, revealing,
 * scrubbing, looping or transforming any artwork element."
 *
 * It is also NOT the C1 behaviour, and the resemblance is the trap. C1 — "a
 * continuous line with lit waypoints" — is on hold precisely because a
 * meandering path with waypoints reads as iconography when a machine draws it.
 * This is not drawn by a machine: node 17:312 is 562 individual vector nodes,
 * the artist's own work, exported whole. Using it is allowed. Generating
 * something that looks like it is not, and neither is animating this one.
 */
export const heroPathArtwork: MediaSlot = {
  id: "hero-path",
  bucket: "artwork",
  expects: "Supplied artwork — exported from Figma node 17:312",
  src: "/artwork/dots-trail.svg",
  tone: "charcoal",
};

/**
 * The loader's background field (X1).
 *
 * ⚠ Must be Country/landscape footage. NOT a cultural site: the loader loops
 * and scrubs, and neither is permitted on cultural-site material.
 */
export const loaderSlot: MediaSlot = {
  id: "loader",
  bucket: "country",
  expects: "Slow footage of Country — sky, water or grass. Never a cultural site.",
  src: null,
  tone: "charcoal",
};

/**
 * The A2 beats.
 *
 * ⚠ TRUTH IS ABSENT FROM THIS MAP AND MUST STAY ABSENT.
 * permissions.md on story-wall imagery: "Not resolved. Treat as unavailable.
 * Build the Truth beat typographically (B5, Y2)." Unavailable means there is
 * no slot — not a slot rendering a "held" box. A held box is still a piece of
 * furniture where the image would go; the instruction is to build the beat a
 * different way, which is what Y2 word emphasis is doing there instead.
 *
 * Wonder and Belonging are `country`, which carries no restriction.
 */
export const skyBeatSlots: Record<string, MediaSlot> = {
  wonder: {
    id: "beat-wonder",
    bucket: "country",
    expects: "Deep time, sensory — night sky, sunrise",
    src: null,
    tone: "midnight",
  },
  belonging: {
    id: "beat-belonging",
    bucket: "country",
    expects: "Country as somewhere to return to",
    src: null,
    tone: "roasted",
  },
};
