/**
 * The kit manifest — the central place the design kit lives.
 *
 * Ivy, 2026-08-30: the artwork, glyphs, wave dividers and plates "have no
 * central places to live on currently". They lived only in Figma. This file is
 * that place: every asset, where it came from, and what motion it may carry.
 *
 * Source: YACHATDAC-V2, file key 7XBvi0Mdbtmym10nkF9IGp.
 *   FOUNDATIONS · Artwork   2048:11157
 *   KIT · Truth             2051:2593   (zones 01-04)
 *
 * NOTHING HERE IS NEWLY AUTHORED. Every vector is an export of Leonard
 * Mickelo's supplied artwork or of Marc's drawn furniture. The zone 02 label in
 * Figma says it outright — "extracted from the artist's work". Redrawing any of
 * it in code, or generating something that resembles it, is the one thing the
 * cultural rules never permit.
 */

/* -------------------------------------------------------------------------
   Motion grade
   ------------------------------------------------------------------------- */

/**
 * How much of a thing may move.
 *
 * Replaces the old `MAY_ANIMATE: boolean`. A boolean could only say yes or no,
 * which forced everything sensitive into stillness. The grade says *which
 * channel* moves instead, which is what Ivy chose on 2026-08-30:
 *
 *   full   the image plane itself may be scrubbed, masked, pushed, warped.
 *   frame  the world moves and the record holds. The plate, ground, scrim,
 *          type and neighbouring layers all animate at full cinematic weight;
 *          the image plane inside them does not.
 *
 * `frame` is not a smaller ration. P1 full-bleed hold and P8 cinematic hold are
 * the heaviest plates in the kit, and both are `frame` plates.
 */
export type MotionGrade = "full" | "frame";

/* -------------------------------------------------------------------------
   Artwork — public/artwork/
   ------------------------------------------------------------------------- */

export type ArtworkPiece = {
  id: string;
  src: string;
  /** Figma node in YACHATDAC-V2. */
  node: string;
  /** Intrinsic size, straight off the export. Media needs explicit dimensions
      or ScrollTrigger computes its positions against the wrong layout. */
  width: number;
  height: number;
  /** Path count — a cheap integrity check against the Figma spec labels. */
  paths: number;
  note: string;
};

/**
 * Artwork motion is PERMITTED. Ivy authorised it on 2026-08-30, superseding the
 * "static imagery only" hold. Recorded in the motion skill's permissions.md;
 * Leonard Mickelo's own artist sign-off is still to be confirmed at the
 * milestone and is noted there.
 */
export const ARTWORK: ArtworkPiece[] = [
  {
    id: "dots-trail",
    src: "/artwork/dots-trail.svg",
    node: "2051:2801",
    width: 971.85,
    height: 80.05,
    paths: 562,
    note: "8 rosettes on a meander. The homepage trail, and the Guide's road (G1).",
  },
  {
    id: "dots-wave",
    src: "/artwork/dots-wave.svg",
    node: "2051:3365",
    width: 823.37,
    height: 93.25,
    paths: 481,
    note: "The flowing dot band. Footer grounds and river banks — G2 drifts this inside a mask.",
  },
  {
    id: "dots-rule",
    src: "/artwork/dots-rule.svg",
    node: "2051:3848",
    width: 1278,
    height: 21,
    paths: 172,
    note: "Dotted divider. Footer rules and section breaks.",
  },
  {
    id: "ring-a",
    src: "/artwork/ring-a.svg",
    node: "2051:4022",
    width: 415.952,
    height: 375.023,
    paths: 47,
    note: "Footer spiral, flattened. Same piece as FOUNDATIONS 2048:11102, kept once.",
  },
  {
    id: "ring-b",
    src: "/artwork/ring-b.svg",
    node: "2051:4024",
    width: 465.005,
    height: 469.992,
    paths: 158,
    note: "Footer spiral, flattened. The larger of the pair.",
  },
  {
    id: "ring-c",
    src: "/artwork/ring-c.svg",
    node: "2048:11150",
    width: 447,
    height: 452,
    paths: 129,
    note: "Third spiral, from FOUNDATIONS. No Truth-kit twin.",
  },
  {
    id: "cluster",
    src: "/artwork/cluster.svg",
    node: "2051:4026",
    width: 145,
    height: 128,
    paths: 7,
    note: "7-path dot cluster. One of the Guide's traveller candidates (the flock).",
  },
  {
    id: "blob-mask",
    src: "/artwork/blob-mask.svg",
    node: "2051:4029",
    width: 240,
    height: 269,
    paths: 1,
    note: "Single-path blob. A mask shape, not a mark — use it to clip media.",
  },
  {
    id: "band-a",
    src: "/artwork/band-a.svg",
    node: "2048:10083",
    width: 958.488,
    height: 82.997,
    paths: 274,
    note: "FOUNDATIONS band. The black footer background artwork.",
  },
  {
    id: "band-b",
    src: "/artwork/band-b.svg",
    node: "2048:10559",
    width: 958,
    height: 113,
    paths: 243,
    note: "FOUNDATIONS band, the taller cut.",
  },
];

/**
 * Glyph / Truth — the three existing artist motifs, per the zone 03 spec label.
 * Figma draws four variants (circle, starburst, boomerang, slot); the fourth
 * reuses a motif, which is why only three distinct vectors exist.
 */
export const GLYPHS: ArtworkPiece[] = [
  { id: "glyph-a", src: "/artwork/glyph-a.svg", node: "2051:2626", width: 42.98, height: 42, paths: 30, note: "Truth motif." },
  { id: "glyph-b", src: "/artwork/glyph-b.svg", node: "2051:2626", width: 43.33, height: 42.0, paths: 13, note: "Truth motif." },
  { id: "glyph-c", src: "/artwork/glyph-c.svg", node: "2051:2626", width: 44.67, height: 37.23, paths: 43, note: "Truth motif." },
];

/**
 * Wave / Divider — Marc's colour handoff, and his furniture rather than
 * Leonard's, so it carries no artwork flag.
 *
 * Figma holds ten variants: five fills by flip up/down. They are ONE path. The
 * fill is a colour and the flip is a scaleY(-1), so the repo keeps a single
 * vector and varies it in code rather than shipping ten near-identical files.
 */
export const WAVE_DIVIDER: ArtworkPiece = {
  id: "wave-divider",
  src: "/artwork/wave-divider.svg",
  node: "2051:2602",
  width: 1442,
  height: 151,
  paths: 1,
  note: "One path, recoloured by ground. Carries the descent's colour handoff.",
};

/* -------------------------------------------------------------------------
   The descent ladder — KIT · Truth zone 01
   ------------------------------------------------------------------------- */

/**
 * "The descent, in order. Red is spent once."
 *
 * Chronological, not decorative: the ladder is how Truth encodes time, so the
 * order is load-bearing and must not be sorted or re-grouped. Ivy confirmed on
 * 2026-08-30 that the Figma kit is the live source where it disagreed with the
 * motion skill's older token list.
 */
export const DESCENT_LADDER = [
  { id: "evergreen", hex: "#22372B", label: "Deep Evergreen" },
  { id: "olive", hex: "#3F6B1F", label: "Olive Grove" },
  { id: "roasted", hex: "#4E3524", label: "Roasted Brown" },
  { id: "burnt", hex: "#D97804", label: "Burnt Ochre" },
  { id: "gold", hex: "#FBAE3D", label: "Yellow Gold" },
  { id: "rust", hex: "#C23D31", label: "Rust Red" },
  { id: "midnight", hex: "#122449", label: "Midnight Navy" },
  { id: "charcoal", hex: "#090E12", label: "Charcoal Black" },
  { id: "offwhite", hex: "#F6F6EC", label: "Off-White" },
] as const;

/* -------------------------------------------------------------------------
   Plates — KIT · Truth zone 04
   ------------------------------------------------------------------------- */

/**
 * Image presentation patterns. These are layout, but P8 and P9 are written as
 * timing on their own faces ("cinematic hold", "dissolve pair"), so each plate
 * names the grammar effect that carries it. Layout and motion agree by
 * construction rather than by two lists kept in step by hand.
 */
export type Plate = {
  id: string;
  node: string;
  title: string;
  /** Design size in the kit, px. */
  width: number;
  height: number;
  /** The motion-grammar effect this plate is built to carry. */
  effect: string;
  /** Highest grade of material this plate is appropriate for. */
  grade: MotionGrade;
};

export const PLATES: Plate[] = [
  { id: "P1", node: "2051:2774", title: "full-bleed hold", width: 1440, height: 720, effect: "hold", grade: "frame" },
  { id: "P2", node: "2051:2776", title: "single plate", width: 1000, height: 300, effect: "pushIn", grade: "full" },
  { id: "P3", node: "2051:2778", title: "diptych, uneven", width: 920, height: 342, effect: "frameOpen", grade: "full" },
  { id: "P4", node: "2051:2781", title: "field of four", width: 910, height: 515, effect: "emanate", grade: "full" },
  { id: "P5", node: "2051:2786", title: "evidence strip", width: 920, height: 147, effect: "arrive", grade: "full" },
  { id: "P6", node: "2051:2793", title: "portrait + testimony", width: 920, height: 386, effect: "dim", grade: "frame" },
  { id: "P7", node: "2051:2797", title: "strata stack", width: 920, height: 736, effect: "ground", grade: "full" },
  { id: "P8", node: "2051:4075", title: "cinematic hold", width: 1440, height: 900, effect: "hold", grade: "frame" },
  { id: "P9", node: "2051:4081", title: "dissolve pair", width: 1440, height: 900, effect: "dissolve", grade: "frame" },
];

/* -------------------------------------------------------------------------
   Photography — public/media/library/
   ------------------------------------------------------------------------- */

export type Photo = {
  id: string;
  src: string;
  width: number;
  height: number;
  grade: MotionGrade;
  /** What it shows. Not a caption — naming people is Our People's job. */
  subject: string;
};

/**
 * Batch 1, transcoded from the Figma masters (72MB of PNG to 1.4MB of WebP at
 * 2000px, which is the delivery format agreed in the 18 Aug briefing).
 *
 * ⚠ THESE FILES ARE NOT IN GIT. `.gitignore` excludes `/public/media/` on a
 * deliberate decision — the client media library lives in Drive today and moves
 * into the CMS at launch. So this manifest describes files a fresh clone will
 * not have, and the gallery at /lab/effects will show empty frames until they
 * are fetched.
 *
 * To repopulate: pull the source images from YACHATDAC-V2 `PHOTO LIBRARY · 1st
 * batch` (2048:9525) and transcode to WebP at 2000px, quality 82. The artwork in
 * `public/artwork/` IS tracked — vectors are brand assets, like `public/brand/`.
 *
 * Grades follow what the frames actually show, checked by looking at every one
 * of them rather than by trusting a filename:
 *
 *   - Rock engravings and the teaching wall are `frame`. The world moves around
 *     them; the record holds. Ivy's decision, 2026-08-30.
 *   - The Elder portrait is `frame` too, on a separate and older rule: the
 *     brief's corollary that portraits of real people hold still. That one is
 *     not a permission anybody waived.
 *   - Open Country and work photography are `full`.
 *
 * Ivy's pool board in Figma (PHOTOS · Truth, 2051:7674) flags R10 material in
 * the layer names themselves, and is the authority for anything imported later.
 */
export const PHOTOS: Photo[] = [
  { id: "country-wide", src: "/media/library/country-wide.webp", width: 2000, height: 1054, grade: "full", subject: "Open Country, wide — mulga to the horizon" },
  { id: "country-sunset-grass", src: "/media/library/country-sunset-grass.webp", width: 2000, height: 1054, grade: "full", subject: "Grass heads at last light, Country behind" },
  { id: "work-seed", src: "/media/library/work-seed.webp", width: 2000, height: 1054, grade: "full", subject: "A seed pod held — hands working" },
  { id: "work-botanical", src: "/media/library/work-botanical.webp", width: 2000, height: 1054, grade: "full", subject: "Two people reading a plant on Country" },
  { id: "engravings-hand", src: "/media/library/engravings-hand.webp", width: 2000, height: 1054, grade: "frame", subject: "A hand at an engraved rock face" },
  { id: "teaching-wall-visit", src: "/media/library/teaching-wall-visit.webp", width: 2000, height: 1054, grade: "frame", subject: "Visitors at the engraved wall, stencils above" },
  { id: "escarpment-approach", src: "/media/library/escarpment-approach.webp", width: 2000, height: 1054, grade: "frame", subject: "Walking toward the escarpment" },
  { id: "elder-portrait", src: "/media/library/elder-portrait.webp", width: 2000, height: 1054, grade: "frame", subject: "An Elder, working — portrait" },

  /* --- Living Work batch, gathered 2026-08-31 -----------------------------
     Exported per section slot rather than per frame — the filename is the
     slot it was gathered for, and the binding in LivingWorkSections.tsx is
     the authority on where each one actually landed. Graded by looking at
     every frame, same rules as batch 1.

     ⚠ CONSENT — lw-rangers2 and lw-rangers5 show visiting children. The Our
     People consent question (R10's sibling) is unresolved; neither is bound
     to a page slot until that is answered. Registered so the record shows
     what was gathered, not as a licence to use. */
  { id: "lw-hero", src: "/media/library/living-work/livingwork-hero.webp", width: 2000, height: 1126, grade: "frame", subject: "An Iningai woman standing in the country being brought back — the hi-fi's 1.40.2. Portrait: holds still." },
  { id: "lw-plain", src: "/media/library/living-work/livingwork-thenumbers.webp", width: 2000, height: 1054, grade: "full", subject: "The plain from a rise — mulga to the horizon" },
  { id: "lw-escarpment-sunset", src: "/media/library/living-work/livingwork-ourchallenges.webp", width: 2000, height: 1067, grade: "frame", subject: "Red rock outcrop at last light, the plain behind — escarpment country" },
  { id: "lw-rangers1", src: "/media/library/living-work/livingwork-rangers1.webp", width: 2000, height: 1334, grade: "frame", subject: "A woman on Country, smiling — portrait" },
  { id: "lw-rangers2", src: "/media/library/living-work/livingwork-rangers2.webp", width: 2000, height: 1334, grade: "frame", subject: "A man walking Country with two visiting children — ⚠ consent unresolved" },
  { id: "lw-rangers3", src: "/media/library/living-work/livingwork-rangers3.webp", width: 2000, height: 1054, grade: "full", subject: "Silhouette at the seedling nursery, checking trays" },
  { id: "lw-rangers4", src: "/media/library/living-work/livingwork-rangers4.webp", width: 2000, height: 1054, grade: "full", subject: "A hand at seedlings in a propagation tray" },
  { id: "lw-rangers5", src: "/media/library/living-work/livingwork-rangers5.webp", width: 2000, height: 1334, grade: "frame", subject: "Guiding visitors through seed grass — ⚠ consent unresolved (child in frame)" },
  { id: "lw-spring-dry", src: "/media/library/living-work/livingwork-spring.webp", width: 2000, height: 1054, grade: "full", subject: "Emus moving through dry mulga — the dry state the copy describes first" },
  { id: "lw-fire", src: "/media/library/living-work/livingwork-work1.webp", width: 2000, height: 1054, grade: "full", subject: "A cool burn — right-way fire, black ash not scorched ground" },
  { id: "lw-seed-collect", src: "/media/library/living-work/livingwork-work2.webp", width: 2000, height: 1054, grade: "full", subject: "Collecting seed from the tree, bowl in hand" },
  { id: "lw-seed-sort", src: "/media/library/living-work/livingwork-work3.webp", width: 2000, height: 1054, grade: "full", subject: "Seeds falling from a hand into the grinding stone" },
  { id: "lw-seed-grind", src: "/media/library/living-work/livingwork-work4.webp", width: 2000, height: 1054, grade: "full", subject: "Grinding seed at the ute tailgate, dusk" },
  { id: "lw-regrowth-dusk", src: "/media/library/living-work/livingwork-work5.webp", width: 2000, height: 1054, grade: "full", subject: "A dead tree over regrowth at dusk" },
  { id: "lw-yumba-sign", src: "/media/library/living-work/livingwork-work6.webp", width: 1333, height: 2000, grade: "full", subject: "Doodtha Yumba amenities sign at the camp — portrait format" },
  { id: "lw-seed-grind-2", src: "/media/library/living-work/livingwork-work7.webp", width: 2000, height: 1054, grade: "full", subject: "Mortar and pestle at the ute — near twin of lw-seed-grind" },
  { id: "lw-seedhead", src: "/media/library/living-work/livingwork-infrastracture.webp", width: 2000, height: 1054, grade: "full", subject: "A hand and a seed head — the hi-fi's 1.65.1, the BREATH hinge" },
  { id: "lw-sunset-grass", src: "/media/library/living-work/livingwork-getinvolved.webp", width: 2000, height: 1054, grade: "full", subject: "Golden grass under trees at sunset" },
];

/** Look-ups used by the gallery and by section modules. */
export const photoById = (id: string) => PHOTOS.find((p) => p.id === id);
export const artworkById = (id: string) =>
  [...ARTWORK, ...GLYPHS, WAVE_DIVIDER].find((a) => a.id === id);
