/**
 * Truth — the hi-fi wireframe's photography, slot by slot.
 *
 * Same contract as src/content/lofi/media.ts: the bucket (and with it the
 * motion grade) travels with the asset, and a null src renders an honest
 * tonal field, never a faked photograph.
 *
 * Every slot now draws from the dedicated Truth batch (2026-09-02) — the
 * earlier living-work reuse for the Today era was replaced when its montage
 * frame landed. All people-at-work material is the open `work` bucket.
 *
 * Everything cultural (the shelter wall, the engravings) stays null until a
 * graded asset lands — cultural-site material renders at `frame` grade when
 * it does (Ivy, 2026-08-30).
 */

import type { MediaSlot } from "@/content/lofi/media";

const TRUTH = "/media/library/truth";

/**
 * The hero — Country at dusk, trees against the last light. Batch delivered
 * 2026-09-02 (Downloads → public/media/library/truth). Country bucket: sky,
 * trees, grass — no cultural site, no people.
 */
export const truthHeroSlot: MediaSlot = {
  id: "truth-hero",
  bucket: "country",
  expects: "Country at dusk — the hi-fi hero frame",
  src: `${TRUTH}/truth-hero.webp`,
  tone: "charcoal",
};

/**
 * The Today entry plate — the hi-fi's 04 · ENTRY TODAY full-viewport frame
 * (1440×900 spec, 2026-09-02): a flame line working through timber, light
 * shafts in the smoke. The spec notes the earlier cut (1.40.3) served four
 * other pages; this is the dedicated fire-line frame. Work bucket — the burn
 * is the rangers' work, no cultural site in frame.
 */
export const truthTodayPlateSlot: MediaSlot = {
  id: "truth-today-plate",
  bucket: "work",
  expects:
    "A flame line working through timber, light shafts in the smoke — right-way fire",
  src: `${TRUTH}/truth-theworkgoingon.webp`,
  tone: "burnt",
};

/**
 * The 2026 entry plate (09 · ENTRY 2026, 1440×1044 spec, 2026-09-02): the
 * frame's 1.82.1 — standing before the escarpment at golden hour. The deed
 * entry's whole record (body, coda, source, CTA) sits on this plate under a
 * deepened scrim. Work bucket — a person on Country, not a cultural site.
 */
export const truthDeedPlateSlot: MediaSlot = {
  id: "truth-deed-plate",
  bucket: "work",
  expects: "Standing before the escarpment at golden hour — the deed of grant",
  src: `${TRUTH}/truth-boughtback.webp`,
  tone: "roasted",
};

/** Media strips keyed by TruthEntry id. Order within a strip is layout order. */
export const truthEntryMedia: Record<string, MediaSlot[]> = {
  /**
   * The hi-fi frame (1440×1078 SVG, 2026-09-02) dresses the precinct with
   * photographs, not the render: the elder at the seedling trays on the left,
   * the gathering ground at dusk on the right. The render slot returns when a
   * concept render actually exists — do not fake it (the batch rule).
   */
  precinct: [
    {
      id: "precinct-people",
      bucket: "work",
      expects: "The something worth building it for — an elder at the seedling trays",
      src: `${TRUTH}/truth-writtenrecord1.webp`,
      tone: "evergreen",
    },
    {
      id: "precinct-country",
      bucket: "country",
      expects: "The gathering ground the precinct will stand on, at dusk",
      src: `${TRUTH}/truth-writtenrecord2.webp`,
      tone: "roasted",
    },
  ],
  /**
   * The Today montage (05 · TODAY montage — GROUND, 2026-09-02): the era's
   * dedicated batch replaced the living-work reuse. Order is the frame's
   * layout order — lead, top right, small bottom-left, bottom right.
   */
  "today-fire": [
    {
      id: "today-grinding",
      bucket: "work",
      expects: "An elder grinding seed at the ute tray, dusk light",
      src: `${TRUTH}/truth-livingmemory1.webp`,
      tone: "roasted",
    },
    {
      id: "today-seedlings",
      bucket: "work",
      expects: "Checking seedling trays under the shade tunnel",
      src: `${TRUTH}/truth-livingmemory2.webp`,
      tone: "evergreen",
    },
    {
      id: "today-seed-hand",
      bucket: "work",
      expects: "A hand collecting seed in the grass, close",
      src: `${TRUTH}/truth-livingmemory3.webp`,
      tone: "eucalyptus",
    },
    {
      id: "today-picking",
      bucket: "work",
      expects: "Picking from the trees, bowl in hand",
      src: `${TRUTH}/truth-livingmemory4.webp`,
      tone: "evergreen",
    },
  ],
  /**
   * Research & discovery's six-up filmstrip (the 2022 frame, 2026-09-02):
   * the rd batch in delivery order — grinding bowl, seed pod, sap on bark,
   * canopy, flower on the stump, seedling tray. All open work/country
   * material, square crops.
   */
  "research-discovery": [1, 2, 3, 4, 5, 6].map((n) => ({
    id: `rd-${n}`,
    bucket: "work" as const,
    expects: "Research & discovery on Turraburra — the rd batch",
    src: `${TRUTH}/truth-rd${n}.webp`,
    tone: "evergreen" as const,
  })),
  /**
   * study-2022 carries NO media — the 06 frame (2026-09-02) is marked
   * ⛔ SILENT · typographic only: the story wall is withheld, and the beat
   * renders as copy alone. Do not re-add a strip here without the frame
   * changing first.
   */
  deed: [
    {
      id: "deed-signing",
      bucket: "work",
      expects:
        "Two people at a table on a timber deck, each at a laptop, a dog asleep beside them",
      src: null,
      tone: "roasted",
    },
  ],
  "just-us": [
    {
      id: "just-us-arrival",
      bucket: "country",
      expects: "The homestead, or the road in, on the day it changed hands",
      src: null,
      tone: "charcoal",
    },
  ],
  father: [
    {
      id: "father-archive",
      bucket: "story-wall",
      expects: "Photographs and envelopes — the archive he kept",
      src: null,
      tone: "roasted",
    },
  ],
  "art-gallery": [
    {
      id: "art-gallery-writeup",
      bucket: "story-wall",
      expects: "Document — archival 1950s write-up of the site",
      src: null,
      tone: "charcoal",
    },
  ],
  mitchell: [
    {
      id: "mitchell-journal",
      bucket: "story-wall",
      expects: "Document — a scan of the journal page, not a photograph",
      src: null,
      tone: "midnight",
    },
  ],
  engraving: [
    {
      id: "engraving-wall",
      bucket: "cultural-site",
      expects: "Marra Wonga — the wall, at frame grade when it lands",
      src: null,
      tone: "midnight",
    },
  ],
  seabed: [
    {
      id: "seabed-prints",
      bucket: "country",
      expects: "The prints in the set mud",
      src: null,
      tone: "midnight",
    },
    {
      id: "seabed-stone",
      bucket: "country",
      expects: "The sandstone, close",
      src: null,
      tone: "charcoal",
    },
    {
      id: "seabed-country",
      bucket: "country",
      expects: "The escarpment's Country from a lawful distance — not the site",
      src: null,
      tone: "midnight",
    },
  ],
};

/** The two full-bleed breaks. Country bucket only — see truthBreaks in truth.ts (R10). */
export const truthBreakMedia: Record<"countryNow" | "duskCountry", MediaSlot> = {
  countryNow: {
    id: "break-country-now",
    bucket: "country",
    expects: "Sunset over the plains from the outcrop — the 08 break's shot B. No caption.",
    src: `${TRUTH}/truth-break1.webp`,
    tone: "roasted",
  },
  duskCountry: {
    id: "break-dusk",
    bucket: "country",
    expects: "Open Country at dusk. No people, no caption, edge to edge.",
    src: null,
    tone: "charcoal",
  },
};
