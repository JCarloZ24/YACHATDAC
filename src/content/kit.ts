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
 * Figma says it outright — "extracted from the artist's work".
 *
 * ⚑ THE SECOND HALF OF THAT RULE IS SUPERSEDED. It used to end "Redrawing any
 * of it in code, or generating something that resembles it, is the one thing
 * the cultural rules never permit." The artwork amendment of 8 September 2026
 * (user direction, recorded in CLAUDE.md) lifts the iconography restriction:
 * generated artwork IS permitted, The Record's handprint aperture included.
 * What survives is the attribution rule, and it is the important half —
 * generated assets are recorded AS generated. They are not attributed to
 * Leonard Mickelo, and they are not treated as cultural records.
 *
 * The first half still stands for everything listed below: these are exports,
 * and they stay exports.
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

/**
 * Homepage loader, user reference 8 September 2026; reused by The Record's
 * readiness loader at user direction on 9 September 2026. Origin: existing supplied
 * vectors, dots-wave (2051:3365) gold instance and ring-b (2051:4024).
 * F8 artwork-motion permission: reveal the wave, hold the ring. No new artwork.
 */
export const HOME_LOADER_ARTWORK = {
  wave: "/artwork/dots-wave-gold.svg",
  ring: "/artwork/ring-b.svg",
};

/** User-supplied replacement, 9 September 2026; same-canvas reveal.
 * Origin: public/media/home/painting.png. Authorship/production method unconfirmed;
 * do not attribute this replacement to the artist of the earlier photograph.
 * User requested the SVG source: it embeds the PNG rather than vector paths.
 * No cropping, sharpening or resizing of the source. */
/* ⚠ NOT USED on `/` since 10 September 2026 (user direction): the homepage
 * opening no longer draws the painting, so nothing on that route requests
 * this file. /homepagev2 still does, from its own kit module. Left here
 * because it is a supplied asset with provenance, not a layout decision. */
export const HOME_PAINTING = {
  src: "/artwork/paintings/red-radial-painting.svg",
  origin: "User-supplied public/media/home/painting.svg (embedded painting.png); renamed without changes",
  width: 1656, height: 950,
  credit: "Artist unconfirmed",
};

/** 9 September 2026: exact Figma woodland road throughout the portal.
 * Original layers retained; credit/production method unconfirmed.
 * AMB-05: user permits local vegetation wind on this landscape only.
 *
 * ⚑ FULL-HEIGHT FOREGROUND, 9 September 2026, user direction. The Figma
 * source at 3371:41347 is 1440×1500. The previous derivative kept only its
 * top 1440×900, which is why every attempt to reach the near road landed on
 * treeline instead: the ground was not in the file. The whole photograph is
 * now carried — 600 more rows of real near road, ending in the speckled
 * charcoal dissolve the homepage frame shows above The Invitation. 350 KB
 * against the old crop's 328 KB, so R11's above-fold budget is unaffected.
 *
 * This SUPERSEDES the `extend` outpaint strip that stood here (a screen
 * capture, cropped and colour-corrected by a measured per-channel gain to
 * meet the photograph's bottom edge). None of it was wired into the canvas
 * yet, and it is no longer needed: the real pixels exist, so nothing has to
 * be generated or colour-matched to a join that no longer occurs.
 * public/media/home/derivatives/red-earth-track.webp is now unreferenced.
 *
 * `legacyHeight` is that old 900px crop. Every threshold in home-land.ts
 * — treeline, canopy, the sky bands, and the Truth sequence offsets that
 * multiply by a literal 900 — was calibrated against it, so the shader remaps
 * into that space rather than being re-tuned beat by beat. Do not change
 * either number without reading the legacyY note in that file. */
export const HOME_PORTAL = {
  src: "/media/home/derivatives/woodland-road-full.webp",
  // ⚠ `sky` is unreferenced since 10 September 2026 (user direction). It was
  // the approximated daylight band the land wore before Truth; every beat now
  // reads the sequence layers below at its frame's own offset, so there is no
  // beat left that samples it. /homepagev2 still does, from its own kit.
  sky: "/media/home/derivatives/road-sky.webp",
  truthSky: "/media/home/derivatives/truth-sky-sequence.webp",
  truthLight: "/media/home/derivatives/truth-light-sequence.webp",
  width: 1440, height: 1500, legacyHeight: 900,
  grade: "full",
  credit: "Unconfirmed",
  origin: "Figma 7XBvi0Mdbtmym10nkF9IGp, background 3371:41346 and foreground 3371:41347; foreground re-extracted at its full 1440×1500 on 9 September 2026",
};

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
/**
 * Cursor copies — the site-wide custom pointer, user direction 10 September
 * 2026. See the pointer block in globals.css for the hot-point and the
 * fallback reasoning.
 *
 * ORIGIN: `chevron-right.svg`, supplied by August on 10 September 2026 as the
 * mark the CTAs carry. The path is used WHOLE and byte-identical — the cursor
 * files wrap it in a rotate (tip to north-west) and a drop shadow, and change
 * nothing else. No tail has been drawn onto it; see the pointer block in
 * globals.css for why that is a decision rather than an omission.
 *
 * The copies exist because `cursor: url()` renders an image at its intrinsic
 * size and CSS cannot scale it, so the cursor needs its own sized files.
 *
 * ⚑ IF THE EMU REPLACES THIS: record its origin here, say whether it is the
 * artist's or generated — the two are recorded differently, see the header —
 * and name its hot-point explicitly. An emu form is asymmetric, so the centre
 * is NOT its point; the click has to land where the shape says it does.
 */
export const CURSOR = {
  source: "/artwork/chevron-right.svg",
  origin: "Supplied by August, 10 September 2026 — the CTA chevron. Used whole; rotated and shadowed only.",
  default: { src: "/artwork/cursor/point.svg", size: 24, hotspot: [3, 3] },
  interactive: { src: "/artwork/cursor/point-lg.svg", size: 30, hotspot: [3, 3] },
} as const;

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
    id: "cluster-gold",
    src: "/artwork/cluster-gold.svg",
    node: "2892:25680",
    width: 145,
    height: 128,
    paths: 7,
    note:
      "The Record's cut of the same cluster — Yellow Gold at full opacity. The " +
      "`cluster` entry above is the footer's white-at-8% wash; that one is a " +
      "ground, this one is a mark on a photograph. Not interchangeable.",
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
 *
 * ⚠ /truth NO LONGER RENDERS THIS (client direction, 9 Sep 2026 — D26). The
 * page walks one ground, Off-White, keeping only the count's charcoal and the
 * 1950s band's travel down into it. This array stays exactly as it is: it is
 * the record of the Figma kit's zone 01, not a description of the built page,
 * and it is what a reversal would restore. Do not prune it to match the page.
 *
 * "Red is spent once" still holds, and now rests on one thing: the count's red
 * reads as the only red BECAUSE it lands on the only dark ground.
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
  /** Which delivered batch the master came from. */
  batch?: 1 | 2 | 3;
  /**
   * Bare master stem — the key into `brand/photo-notes/batch-N.md`.
   *
   * Nothing used to record that `country-wide.webp` came from
   * `378A7604_1.28.1`; the mapping lived only in somebody's memory. The stem is
   * stored rather than a path because the stem is already the join key across
   * the whole documentation set — the `###` heading in the notes files, the
   * table cell in `PHOTO-INDEX.md`, the citation in `ART-DIRECTION.md` §4 and
   * the frame list in `permissions.md`. A path would be greppable against none
   * of them.
   *
   * All eight values below were recovered by matching each derivative against
   * every master by image signature, not by guessing from the subject line.
   */
  master?: string;
  /** What it shows. Not a caption — naming people is Our People's job. */
  subject: string;
};

/**
 * Batch 1, transcoded from the Figma masters (72MB of PNG to 1.4MB of WebP at
 * 2000px, which is the delivery format agreed in the 18 Aug briefing).
 *
 * THESE FILES ARE IN GIT. They did not used to be: the library lived in Drive
 * and `.gitignore` excluded `/public/media/`. That reversed at `79d90f5` because
 * Vercel builds from this repo and an untracked library deploys a site with no
 * photographs. The Drive originals remain the source of truth; this is the
 * web-sized set. `.gitignore` still carries the reasoning at its line 57.
 *
 * To add a row: transcode the Drive original to WebP at 2000px, quality 82, and
 * commit the derivative beside the row. The artwork in `public/artwork/` is
 * tracked too — vectors are brand assets, like `public/brand/`.
 *
 * Grades follow what the frames actually show, checked by looking at every one
 * of them rather than by trusting a filename:
 *
 *   - Rock engravings and the teaching wall were `frame` — the world moves
 *     around them, the record holds (Ivy, 2026-08-30). **Raised to `full` on
 *     2026-08-31**, with the cultural-site bucket in `lofi/media.ts`.
 *   - The Elder portrait is `frame` too, on a separate and older rule: the
 *     brief's corollary that portraits of real people hold still. That one is
 *     not a permission anybody waived.
 *   - Open Country and work photography are `full`.
 *
 * Ivy's pool board in Figma (PHOTOS · Truth, 2051:7674) flags R10 material in
 * the layer names themselves, and is the authority for anything imported later.
 *
 * NOTE the collision: `Plate.grade` above and `Photo.grade` here are different
 * axes that happen to share a field name. A plate's grade is the highest grade
 * of material the plate is appropriate for; a photo's grade is what may move in
 * the photograph itself. Do not sweep them together.
 *
 * No batch-3 rows yet — nothing from that batch has a derivative in
 * `public/media/library/` to point at. See `brand/photo-notes/batch-3.md`.
 */
export const PHOTOS: Photo[] = [
  { id: "country-wide", src: "/media/library/country-wide.webp", width: 2000, height: 1054, grade: "full", batch: 1, master: "378A7604_1.28.1", subject: "Open Country, wide — mulga to the horizon" },
  { id: "country-sunset-grass", src: "/media/library/country-sunset-grass.webp", width: 2000, height: 1054, grade: "full", batch: 1, master: "378A7604_1.14.1", subject: "Grass heads at last light, Country behind" },
  { id: "work-seed", src: "/media/library/work-seed.webp", width: 2000, height: 1054, grade: "full", batch: 1, master: "378A7604_1.65.1", subject: "A seed pod held — hands working" },
  { id: "work-botanical", src: "/media/library/work-botanical.webp", width: 2000, height: 1054, grade: "full", batch: 1, master: "378A7604_1.55.1", subject: "Two people reading a plant on Country" },
  // Raised from "frame" to "full" with the cultural-site bucket, 2026-08-31.
  { id: "engravings-hand", src: "/media/library/engravings-hand.webp", width: 2000, height: 1054, grade: "full", batch: 1, master: "378A7604_1.11.1", subject: "A hand at an engraved rock face" },
  { id: "teaching-wall-visit", src: "/media/library/teaching-wall-visit.webp", width: 2000, height: 1054, grade: "full", batch: 1, master: "378A7604_1.7.2", subject: "Visitors at the engraved wall, stencils above" },
  { id: "escarpment-approach", src: "/media/library/escarpment-approach.webp", width: 2000, height: 1054, grade: "full", batch: 1, master: "378A7604_1.6.1", subject: "Walking toward the escarpment" },
  // STAYS "frame". This one is graded on the portrait rule, not the
  // cultural-site bucket, and nobody waived the portrait rule. A mechanical
  // frame->full sweep breaks precisely this entry.
  { id: "elder-portrait", src: "/media/library/elder-portrait.webp", width: 2000, height: 1054, grade: "frame", batch: 1, master: "378A7604_1.42.5", subject: "An Elder, working — portrait" },

  /* --- Living Work batch, gathered 2026-08-31 -----------------------------
     Exported per section slot rather than per frame — the filename is the
     slot it was gathered for, and the binding in living-work/_components/Sections.tsx is
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
  { id: "lw-fire", src: "/media/library/living-work/livingwork-work1.webp", width: 2000, height: 1054, grade: "full", subject: "Fire-stick farming — black ash, not scorched ground" },
  { id: "lw-seed-collect", src: "/media/library/living-work/livingwork-work2.webp", width: 2000, height: 1054, grade: "full", subject: "Collecting seed from the tree, bowl in hand" },
  { id: "lw-seed-sort", src: "/media/library/living-work/livingwork-work3.webp", width: 2000, height: 1054, grade: "full", subject: "Seeds falling from a hand into the grinding stone" },
  { id: "lw-seed-grind", src: "/media/library/living-work/livingwork-work4.webp", width: 2000, height: 1054, grade: "full", subject: "Grinding seed at the ute tailgate, dusk" },
  { id: "lw-regrowth-dusk", src: "/media/library/living-work/livingwork-work5.webp", width: 2000, height: 1054, grade: "full", subject: "A dead tree over regrowth at dusk" },
  { id: "lw-yumba-sign", src: "/media/library/living-work/livingwork-work6.webp", width: 1333, height: 2000, grade: "full", subject: "Doodtha Yumba amenities sign at the camp — portrait format" },
  { id: "lw-seed-grind-2", src: "/media/library/living-work/livingwork-work7.webp", width: 2000, height: 1054, grade: "full", subject: "Mortar and pestle at the ute — near twin of lw-seed-grind" },
  { id: "lw-seedhead", src: "/media/library/living-work/livingwork-infrastracture.webp", width: 2000, height: 1054, grade: "full", subject: "A hand and a seed head — the hi-fi's 1.65.1, the BREATH hinge" },
  { id: "lw-sunset-grass", src: "/media/library/living-work/livingwork-getinvolved.webp", width: 2000, height: 1054, grade: "full", subject: "Golden grass under trees at sunset" },

  /* --- Our People batch, derived 2026-09-05 -------------------------------
     Six frames for `06 · Our People`, derived from the batch-1 and batch-3
     masters the hi-fi names, at the same 2000px width as batch 1.

     ⚠⚠ EVERY ONE OF THESE IS A PLACEHOLDER FACE, and that is not a caption
     nicety. R24: Ivy's photo clearances are USE clearances, not IDENTIFICATION
     consent — you may show a face, you may not say whose it is. Batch 1 is an
     elder-and-knowledge shoot, so one of its portraits captioned under a role
     asserts that the person holds that role. None of these people holds the
     role their card names.

     The badge that says so lives on the card in the markup, never only here:
     a screenshot circulated without it is exactly how a placeholder becomes a
     claim. See src/app/our-people/_components/Sections.tsx.

     ⚠ op-card-01 is NOT Graham Ambridge. No photograph of him exists in any
     batch, so the one named card on the page carries a stand-in like the
     other five.

     ⚠ op-card-06 repeats op-card-01's subject in a different frame. The
     library holds five card-usable faces besides Suzanne's and the grid needs
     six; it is the only repeat on the page and it goes when the real
     portraits arrive.

     Suzanne is NOT here. She is the one person shown as herself and she is
     already in this file as `lw-hero` (378A7604_1.40.2) — and none of her
     frames may be reused in a team card, or a reader takes her for two
     people. */
  { id: "op-hero", src: "/media/library/our-people/op-hero.webp", width: 2000, height: 1500, grade: "full", batch: 3, master: "crew-walking-burnt", subject: "A crew walking burnt ground — ⟡ STAND-IN for the hero, two identifiable adults" },
  { id: "op-card-01", src: "/media/library/our-people/op-card-01.webp", width: 2000, height: 1054, grade: "full", batch: 1, master: "378A7604_1.80.1", subject: "Close portrait, a face at rest — ⟡ PLACEHOLDER FACE" },
  { id: "op-card-02", src: "/media/library/our-people/op-card-02.webp", width: 2000, height: 1054, grade: "full", batch: 1, master: "378A7604_1.77.1", subject: "Clean frontal portrait — ⟡ PLACEHOLDER FACE, carries the escape at full screen" },
  { id: "op-card-03", src: "/media/library/our-people/op-card-03.webp", width: 2000, height: 1054, grade: "full", batch: 1, master: "378A7604_1.42.1", subject: "Standing in grass, face legible at card size — ⟡ PLACEHOLDER FACE" },
  { id: "op-card-05", src: "/media/library/our-people/op-card-05.webp", width: 2000, height: 1054, grade: "full", batch: 1, master: "378A7604_1.72.1", subject: "Working at the seedling table, face in profile — ⟡ PLACEHOLDER FACE" },
  { id: "op-card-06", src: "/media/library/our-people/op-card-06.webp", width: 2000, height: 1054, grade: "full", batch: 1, master: "378A7604_1.74.2", subject: "⚠ Same person as op-card-01, different frame — ⟡ PLACEHOLDER FACE" },

  /* The two breaths. Country only — no people in either, which is why they
     carry no caption: a caption would make a breath an illustration. */
  { id: "op-breath-01", src: "/media/library/our-people/op-breath-01.webp", width: 2000, height: 1500, grade: "full", batch: 3, master: "country-wide-track", subject: "A track running out across open Country — ⟡ STAND-IN" },
  { id: "op-breath-02", src: "/media/library/our-people/op-breath-02.webp", width: 2000, height: 442, grade: "full", batch: 3, master: "burn-pano-sunset", subject: "Burnt ground at sunset, panorama — ⟡ STAND-IN" },

  /* ------------------------------------------------------------------ About.
     Six derivatives cut for `05 · About` (Figma 2653:19666). The other two
     frames that page draws are already here: §03's is `country-wide`
     (378A7604_1.28.1) and §07's left portrait is `op-card-01` (378A7604_1.80.1).

     ⚠ THE TWO §07 PORTRAITS ARE THE SAME MAN. batch-1.md:355 opens 1.77.4 with
     "The same older man" — the same person as 1.80.1, which the page already
     renders beside it. So `about-people-02` is a second frame of `op-card-01`'s
     subject, exactly the repeat `op-card-06` is. The library holds no second
     cleared face, the frame draws two, and inventing a third person is not an
     option. Both carry ⚠ CONSENT UNRESOLVED in the markup and neither is
     captioned with a name, which is what keeps this honest rather than false.
     It goes when real portraits arrive.

     Four of the six show no people at all, which is why they read as Country
     rather than as illustration. `about-reciprocity` shows hands only — the
     notes record no faces in frame at all (batch-2.md:109). */
  { id: "about-hero", src: "/media/library/about/about-hero.webp", width: 2000, height: 1334, grade: "full", batch: 2, master: "March22-2432", subject: "Three figures on a ledge beneath a banded sandstone escarpment — people as scale, no identifiable faces" },
  { id: "about-road", src: "/media/library/about/about-road.webp", width: 2000, height: 1124, grade: "full", batch: 2, master: "March22-0261", subject: "Aerial down a sandy two-wheel track through low bushland, one vehicle at the end — no people" },
  { id: "about-breath", src: "/media/library/about/about-breath.webp", width: 2000, height: 1054, grade: "full", batch: 1, master: "378A7604_1.76.2", subject: "Open woodland at sunset, sun low behind the trunks — no people" },
  { id: "about-fire", src: "/media/library/about/about-fire.webp", width: 2000, height: 1500, grade: "full", batch: 3, master: "fire-line-daylight", subject: "A flame line working through open timber, unburnt green grass in front of it — no people" },
  /* §04's cards 2 and 3. Their Figma image layers are unnamed — the only ones
     on the page that are — so the masters were identified by matching the
     frame's own exported fills against every original in the three batches
     (exact signature match, distance 0.0), not chosen. Card 4's fill matched
     `work-seed`, which is already a row above. */
  { id: "about-ochre", src: "/media/library/about/about-ochre.webp", width: 2000, height: 1334, grade: "full", batch: 2, master: "March22-1521", subject: "Two hands grinding ochre on a sandstone slab — hands only, nobody identifiable" },
  /* `frame` for the same reason `about-reciprocity` is: two children are in
     shot. They are walking away, incidental and unidentifiable (batch-2.md),
     which is what makes the frame usable at all — but the world moves around
     a picture with children in it, not the picture. */
  { id: "about-walking", src: "/media/library/about/about-walking.webp", width: 2000, height: 1334, grade: "frame", batch: 2, master: "March22-1641", subject: "Five walking away in single file along a woodland track — all from behind, no face identifiable" },
  /* `frame` grade, and not by default. The notes record at least four people
     cropped to hands and torsos and one of them a child (batch-2.md:109). The
     world moves around a picture of a child's hands; the picture does not. */
  { id: "about-reciprocity", src: "/media/library/about/about-reciprocity.webp", width: 2000, height: 1334, grade: "frame", batch: 2, master: "March22-1547", subject: "Ochre-marked adult palms held out over a grinding stone toward a child's — no faces in frame" },
  /* `frame` on the portrait rule, the same rule that holds `elder-portrait`. */
  { id: "about-people-02", src: "/media/library/about/about-people-02.webp", width: 2000, height: 1054, grade: "frame", batch: 1, master: "378A7604_1.77.4", subject: "⚠ Same man as op-card-01, full-length under a rock arch — ⚠ CONSENT UNRESOLVED" },

  /* ----------------------------------------------------------- Partnerships.
     Four cut for `07 · Partnerships` (Figma 2944:25988). The page's other two
     frames are already rows above: §04's gap 2 is `work-seed` and its gap 4 is
     `about-fire`. Gap 1 has NO photograph and is not missing one — no cleared
     frame of Marra Wonga exists, and the card stays typographic and says so.

     ⟡ STAND-IN LIFTED, 10 September 2026, user direction. August supplied a
     six-file set named for this page's slots, and four of them re-export the
     masters these rows already pointed at, at 2000px from the delivered
     originals. The frames are therefore no longer "closest honest match" —
     they are the selects for this page. The page still has no draft and no
     shot list; what changed is the status of the photographs, not the copy.

     ⚠ THE OTHER TWO SUPPLIED FILES ARE NOT NEW ROWS. "Whatliveshere" and
     "What does fire-stick" are `378A7604_1.65.1` and `fire-line-daylight`
     frame-for-frame — the masters behind `work-seed` and `about-fire`, which
     are already rows above and already 2000px. Giving them partnerships-local
     ids would have put one master under two ids and broken the reverse
     look-up this field exists for. §04's gaps 2 and 4 keep borrowing them.

     ⚠ THE CONSENT CAVEATS BELOW SURVIVE THE UPGRADE. Higher resolution makes
     an identifiable subject more identifiable, not less; neither R24 on
     `pt-research` nor the tattoo note on `pt-soil` is answered by a better
     export. Both were re-checked against the supplied files on 10 September
     and both still apply. */
  /* ⚠ 2880 AND NOT 2000, and it is the one row here that breaks the batch
     convention. Every other photograph on the site is a 2000px export because
     every other photograph sits in a box narrower than the viewport. This one
     went full-bleed at 1440 x 900 on 10 September, and at 2x — which is what
     the reviewer is actually looking at — a 1440 CSS-px box wants 2880 real
     pixels. next/image asks for 3840, gets capped at the source, and upscales
     whatever it is given: at 2000 the hero was visibly soft, which is the
     defect this row fixes. ASSETS.md's note that 2000px frames "do not have
     headroom for full-bleed at 1440" is exactly this, and the reason it can be
     answered here is that the batch-3 master is 4267px wide.

     546KB, against the 2.5MB above-the-fold budget (R11) and as the only
     above-fold media on the route. Do not raise it further without re-reading
     that budget — quality 82 was chosen against 78 and 86 on size, not taste.

     ⚠ ANY OTHER ROW GOING FULL-BLEED NEEDS THE SAME TREATMENT, and most of the
     collection cannot have it: a 2000px derivative whose master is also 2000px
     has nowhere to go. Check the master before promoting a photograph to a
     full-width hero.

     `frame`, and the layer name says why: "nobody is identifiable from height,
     the safe way to show a crew". Fifteen adults from directly above, no face
     legible at any resolution — the permission rests on the altitude, so the
     image plane does not move. */
  { id: "pt-hero", src: "/media/library/partnerships/pt-hero.webp", width: 2880, height: 2148, grade: "frame", batch: 3, master: "aerial-crew-burnedge", subject: "Drone view along an escarpment burn edge, a crew walking it on foot — no faces identifiable" },
  /* ⚠ CONSENT UNRESOLVED. The one research frame in the collection, and its
     subject's face is visible and identifiable (batch-1.md). R24 applies here
     exactly as it does on Our People and About §07: use was cleared,
     identification was never asked. Badged in the markup. */
  { id: "pt-research", src: "/media/library/partnerships/pt-research.webp", width: 2000, height: 1054, grade: "frame", batch: 1, master: "378A7604_1.45.2", subject: "An older man working a pestle in a stone mortar on a ute tray — ⚠ CONSENT UNRESOLVED" },
  /* ⚠ NO FACE, BUT A STAR TATTOO ON THE INNER FOREARM, and the notes are
     explicit that a distinctive tattoo is an identifier and should be treated
     as one. batch-3.md records that cropping the left edge removes it. Not
     cropped here — a crop is a design decision and this is the manifest — but
     `frame` grade and the caveat travels with the row. */
  { id: "pt-soil", src: "/media/library/partnerships/pt-soil.webp", width: 2000, height: 1500, grade: "frame", batch: 3, master: "hands-soil", subject: "A hand holding a fistful of dark soil over half-burnt ground — identifying tattoo in frame" },
  { id: "pt-breath", src: "/media/library/partnerships/pt-breath.webp", width: 2000, height: 1126, grade: "full", batch: 1, master: "378A7604_1.27.1", subject: "A wide plain of low green scrub through a screen of slender trees — no people" },
];

/** Look-ups used by the gallery and by section modules. */
export const photoById = (id: string) => PHOTOS.find((p) => p.id === id);
/**
 * The reverse look-up, which is the direction people actually need. "The index
 * flags `1.60.2` as weak — is it on the site?" and "we cleared `_1.19.1`, where
 * is it used?" were both unanswerable before `master` existed.
 */
export const photoByMaster = (master: string) =>
  PHOTOS.find((p) => p.master === master);
export const artworkById = (id: string) =>
  [...ARTWORK, ...GLYPHS, WAVE_DIVIDER].find((a) => a.id === id);
