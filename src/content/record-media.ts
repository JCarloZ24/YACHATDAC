/**
 * The Record — the hi-fi frame's photography, slot by slot.
 *
 * Same contract as src/content/lofi/media.ts and truth-media.ts: the bucket
 * travels with the asset and its motion grade is derived from it, and a null
 * src renders an honest tonal field rather than a faked photograph.
 *
 * BATCH DELIVERED 2026-09-04 — "The Record Assets", thirteen frames, into
 * public/media/library/record. The client's file numbering IS the frame's card
 * numbering: `therecord-story<N>.webp` is card N of the grid (Figma 2463:8495),
 * and the two numbers missing from the batch — 6 and 12 — are exactly the two
 * cards the frame itself marks ⟡ no image supplied. Nothing is inferred; the
 * gaps are the design's own.
 *
 * ⚠ `expects` DESCRIBES THE FRAME, NOT THE ENTRY. Three of the supplied
 * photographs do not depict their entry's subject — see the notes on cards 3,
 * 8 and 13. They are wired as delivered, because the batch is the client's own
 * assignment, but the alt text says what is in the picture rather than what the
 * story is about. Flagged for the next photo round rather than silently
 * papered over.
 *
 * ⚠ CULTURAL MATERIAL. Cards 2, 7 and 9 are Marra Wonga — the engraved wall and
 * its hand stencils — and card 4 shows the shelter with engravings along its
 * base. Available and used (Ivy, 2026-08-30, "everything we have can be USED"),
 * bucketed `story-wall` / `cultural-site` so MOTION_GRADE holds them at `frame`:
 * the world moves and the record holds. Do not re-bucket these to widen what
 * may animate.
 *
 * ⚠ CONSENT — CARD 5. Two children with clearly identifiable faces, beside a
 * staff member in branded clothing. brand/photo-notes/batch-2.md is explicit
 * that guardian consent is required regardless of crop, and that legible
 * branding ties the wearer to the organisation. The frame is wired because the
 * client supplied it for this slot; the consent record is not in the repo. This
 * must be confirmed before launch.
 */

import type { MediaSlot } from "@/content/lofi/media";

/** F7/F8 motion audit, 2026-09-08: The Record's documented frame grades
 * differ from the retired lo-fi bucket defaults. Carry the grade per asset
 * so cultural material and people remain held in cards and full-screen views. */
export type RecordMediaSlot = MediaSlot & { motionGrade: "full" | "frame" };

const RECORD = "/media/library/record";

/**
 * User screenshot direction, 2026-09-11 (D5/F8): the buyback article opens
 * with the original grass photograph under an evergreen media scrim. This
 * is an opening image, separate from the revised deed-signing card/body photo.
 * Origin: client-supplied The Record Assets, 2026-09-04, original story 1.
 * Website use supplied by the client; photographer credit not supplied.
 * Still image plane; no new motion. Explicit size reserves the hero layout.
 */
const recordArticleHeroOverrides: Readonly<Record<string, {
  src: string;
  width: number;
  height: number;
}>> = {
  "it-nearly-didnt-happen": {
    src: `${RECORD}/therecord-story1.webp`,
    width: 3840,
    height: 2024,
  },
};

/**
 * F7/F8 amendment, latest user correction 2026-09-08: the opening wall and
 * stone are Three.js stage furniture. One supplied ink print defines separate
 * holes: black opens through the wall; white remains stone. Surrounding prints
 * are faded red-ochre stencils on solid stone, using eight distinct impressions
 * from the user's 4-by-2 reference sheet, supplied on 2026-09-08.
 * Origin: user-supplied Image #5, 2026-09-08, copied unchanged. The sandstone
 * texture is generated with the built-in image-generation tool on that date.
 * Full source and prompt: public/artwork/record-portal-provenance.md.
 *
 * The ink mask is an interface asset, explicitly requested by the user. Its
 * creator was not supplied; it is not attributed to Leonard Mickelo or treated
 * as a record of the photographed rock art. The cards use the existing supplied
 * photographs and source credits below. Latest user direction, 2026-09-08:
 * whole canvas planes approach immediately at different speeds/depths, pass
 * beyond the screen and fade; the catalogue rises as the final pictures fade.
 * No image animates independently inside its frame; no preview captions.
 */
export const recordPortalMedia = {
  wall: {
    kind: "generated-geometry",
    src: "/artwork/record-sandstone.webp",
    expects:
      "Sandstone with faded red-ochre handprints and one central handprint cut through the wall",
    motionGrade: "full",
  },
  mask: "/artwork/handprint-impression.png",
  stencilSheet: "/artwork/handprint-variations.png",
  previewSlugs: [
    "bringing-a-spring-back",
    "a-season-of-bush-foods",
    null, // User removed the central grass photo, 2026-09-09; preserve the other slots.
    "fire-stick-farming-and-the-carbon-in-the-soil",
    "you-are-standing-on-a-seabed",
    "wattanuri-and-the-ones-he-followed",
    "when-they-called-it-the-art-gallery",
    "gracevale-becomes-turraburra",
    "fifteen-thousand-markings-read-in-order",
    "what-the-recorders-hear-at-night",
  ],
} as const;

/**
 * 01 · Intro — FULL BLEED. Open Country under the bottom-weighted X5 scrim,
 * with the type block sitting in the dark lower half.
 */
export const recordHeroSlot: RecordMediaSlot = {
  id: "record-hero",
  motionGrade: "full",
  bucket: "country",
  expects:
    "Sunset from the outcrop — the plain running to the horizon under a banked sky",
  src: `${RECORD}/therecord-hero.webp`,
  tone: "charcoal",
};

/**
 * 06 · The record grows. The frame's note: "the work being done — new
 * material arrives because someone was out there".
 */
export const recordGrowsSlot: RecordMediaSlot = {
  id: "record-grows",
  motionGrade: "frame",
  bucket: "work",
  expects:
    "An elder grinding seed in a stone mortar at the ute tray, dusk — the work that puts new material in the record",
  src: `${RECORD}/therecord-keepingtherecord.webp`,
  tone: "charcoal",
};

/**
 * Card thumbnails, keyed by the item's slug in src/content/the-record.ts, in
 * the frame's card order.
 *
 * Ground is SOURCE-coded by the card itself (D21: the source axis is an
 * epistemology, not a format), so `tone` here is only the field's colour if a
 * slot ever loses its photograph — it deliberately echoes the card's ground.
 */
export const recordCardMedia: Record<string, RecordMediaSlot> = {
  /* 01 · User revision 2026-09-11 supersedes the earlier Country thumbnail:
     the supplied deed-signing photograph now carries the card and breakout.
     Identifiable people keep the image at frame grade (F7/F8). */
  "it-nearly-didnt-happen": {
    id: "card-buyback",
    motionGrade: "frame",
    bucket: "work",
    expects: "Two people sit at a table with laptops on a timber deck, with a dog in the foreground.",
    src: "/media/library/record/articles/two-people-laptops-on-deck.webp",
    tone: "evergreen",
  },
  /* 02 · story-wall → frame grade. */
  "wattanuri-and-the-ones-he-followed": {
    id: "card-wattanuri",
    motionGrade: "frame",
    bucket: "story-wall",
    expects:
      "The engraved wall at Marra Wonga — red ochre hand stencils over the incised sandstone",
    src: `${RECORD}/therecord-story2.webp`,
    tone: "evergreen",
  },
  /* 03 ⚠ SUBJECT MISMATCH — the entry is the spring restoration (a thousand
     litres carted twice a day); the delivered frame is a harvest. Wired as
     supplied; raise a spring frame in the next round. */
  "bringing-a-spring-back": {
    id: "card-spring",
    motionGrade: "frame",
    bucket: "work",
    expects: "An elder picking from the trees, bowl in hand, in open woodland",
    src: `${RECORD}/therecord-story3.webp`,
    tone: "evergreen",
  },
  /* 04 · the escarpment — the seabed floor. Engravings are legible along the
     base of the shelter, so this is cultural-site, not country. */
  "you-are-standing-on-a-seabed": {
    id: "card-seabed",
    motionGrade: "frame",
    bucket: "cultural-site",
    expects:
      "The sandstone overhang, a guide speaking beneath it — the escarpment that was the sea floor",
    src: `${RECORD}/therecord-story4.webp`,
    tone: "midnight",
  },
  /* 05 ⚠ CONSENT — two identifiable children and legible branding. See the
     file note; confirm before launch. */
  "a-day-with-the-rangers": {
    id: "card-rangers",
    motionGrade: "frame",
    bucket: "work",
    expects:
      "Walking through regrowth after a burn, talking as they go — a firestick workshop day",
    src: `${RECORD}/therecord-story5.webp`,
    tone: "evergreen",
  },
  /* 06 · the frame's own marker: ⟡ no image supplied. Not in the batch, and
     correctly so — Mitchell's account has no photograph, and inventing one
     would illustrate a stranger's record. */
  "what-mitchell-wrote-down": {
    id: "card-mitchell",
    motionGrade: "frame",
    bucket: "country",
    expects: "⟡ no image supplied — the draft's own marker",
    src: null,
    tone: "roasted",
  },
  /* 07 · story-wall → frame grade. Also carries BREAKOUT B. */
  "when-they-called-it-the-art-gallery": {
    id: "card-art-gallery",
    motionGrade: "frame",
    bucket: "story-wall",
    expects:
      "The wall close — a red hand stencil among the engravings the visitors renamed",
    src: `${RECORD}/therecord-story7.webp`,
    tone: "roasted",
  },
  /* 08 ⚠ SUBJECT MISMATCH — the entry is the renaming of the station; the
     delivered frame is a guiding shot from above. Children are present but at
     a distance and from overhead, so nobody is identifiable. */
  "gracevale-becomes-turraburra": {
    id: "card-gracevale",
    motionGrade: "frame",
    bucket: "work",
    expects:
      "From above — a guide pointing out across Country to a family on the rocks",
    src: `${RECORD}/therecord-story8.webp`,
    tone: "roasted",
  },
  /* 09 · User revision 2026-09-11: supplied wide shelter photograph, frame grade. */
  "fifteen-thousand-markings-read-in-order": {
    id: "card-markings",
    motionGrade: "frame",
    bucket: "cultural-site",
    expects: "Three people beneath a sandstone overhang, with engravings along the shelter wall.",
    src: "/media/library/record/articles/people-beneath-sandstone-overhang.webp",
    tone: "midnight",
  },
  /* 10 · the entry's own subject, exactly — the carbon in the soil. */
  "fire-stick-farming-and-the-carbon-in-the-soil": {
    id: "card-fire",
    motionGrade: "full",
    bucket: "work",
    expects:
      "A handful of dark soil held over burnt ground after fire-stick farming",
    src: `${RECORD}/therecord-story10.webp`,
    tone: "evergreen",
  },
  /* 11 · the entry's own subject. */
  "a-season-of-bush-foods": {
    id: "card-bush-foods",
    motionGrade: "full",
    bucket: "work",
    expects:
      "Seed dropped into a stone mortar, a jar of it and cuttings on the bench",
    src: `${RECORD}/therecord-story11.webp`,
    tone: "evergreen",
  },
  /* 12 · the frame's second ⟡ no image supplied, and not in the batch. */
  "pollen-at-sixty-metres": {
    id: "card-pollen",
    motionGrade: "frame",
    bucket: "country",
    expects: "⟡ no image supplied — the draft's own marker",
    src: null,
    tone: "midnight",
  },
  /* 13 ⚠ SUBJECT MISMATCH — the entry is the acoustic recorders listening at
     night; the delivered frame is seed grinding at dusk. It shares the batch's
     dusk register but not the subject. Wired as supplied. */
  "what-the-recorders-hear-at-night": {
    id: "card-recorders",
    motionGrade: "frame",
    bucket: "work",
    expects: "An elder grinding seed at the ute tray as the light goes",
    src: `${RECORD}/therecord-story13.webp`,
    tone: "evergreen",
  },
};

/**
 * User follow-up, 2026-09-11 (D5/F8): all article openings share the same
 * layout, but inherit their own catalogue photograph and source colour.
 * Dimensions measured from supplied files. Buyback keeps the explicitly
 * requested grass opening above. Missing card images remain tonal fields.
 * Origin/permission and subject caveats follow recordCardMedia above.
 */
const recordCardDimensions: Readonly<Record<string, readonly [number, number]>> = {
  "it-nearly-didnt-happen": [2000, 1500],
  "wattanuri-and-the-ones-he-followed": [3840, 2024],
  "bringing-a-spring-back": [3840, 2024],
  "you-are-standing-on-a-seabed": [2000, 1334],
  "a-day-with-the-rangers": [2000, 1334],
  "when-they-called-it-the-art-gallery": [3840, 2024],
  "gracevale-becomes-turraburra": [2000, 1124],
  "fifteen-thousand-markings-read-in-order": [2000, 1334],
  "fire-stick-farming-and-the-carbon-in-the-soil": [4267, 3200],
  "a-season-of-bush-foods": [3840, 2024],
  "what-the-recorders-hear-at-night": [3840, 2024],
};

export const recordArticleHeroMedia: Readonly<Record<string, {
  src: string | null;
  width: number;
  height: number;
}>> = Object.fromEntries(Object.entries(recordCardMedia).map(([slug, slot]) => {
  const dimensions = recordCardDimensions[slug];
  return [slug, recordArticleHeroOverrides[slug] ?? {
    src: slot.src,
    width: dimensions?.[0] ?? 1,
    height: dimensions?.[1] ?? 1,
  }];
}));

/**
 * The three breakouts — an entry taking the whole screen as the grid runs.
 *
 * A · Iningai knowledge — card 01. The same supplied photograph the card carries;
 *     the breakout IS that card at full size, so it is the same photograph.
 * B · Colonial record — card 07, the engraved wall. story-wall, frame grade.
 * C · Published research — card 12. The frame carries NO photograph at all:
 *     it is drawn as the bore, 480 metres to scale, with the pollen at sixty.
 */
export const recordBreakoutMedia: Record<string, RecordMediaSlot | null> = {
  "it-nearly-didnt-happen": recordCardMedia["it-nearly-didnt-happen"],
  "when-they-called-it-the-art-gallery":
    recordCardMedia["when-they-called-it-the-art-gallery"],
  "pollen-at-sixty-metres": null,
};

/**
 * User-supplied article photographs, 2026-09-11 (D5/F8).
 * Origin links are from docs/revisions/the-record-content. Originals remain in
 * ignored brand/photography/record-revisions; metadata-free WebP derivatives
 * are served locally. No cropping, upscaling or generated imagery. Every plane
 * is held at frame grade. See brand/photo-notes/record-revisions.md for visual
 * checks, permissions, the unavailable footprint and the hand-stencil mismatch.
 */
export type RecordArticleMedia = {
  src: string | null;
  alt: string;
  width: number;
  height: number;
  motionGrade: "frame";
  origin: string;
  credit: string;
  permission: string;
};

export const recordArticleMedia: Readonly<Record<string, RecordArticleMedia>> = {
  "wall-wide": {
    "src": "/media/library/record/articles/people-beneath-sandstone-overhang.webp",
    "alt": "Three people beneath a sandstone overhang, with engravings along the shelter wall.",
    "width": 2000,
    "height": 1334,
    "motionGrade": "frame",
    "origin": "https://drive.google.com/file/d/1kmUR_jXLWJ3aJaiPWIOPsWdWHVN-6BOT/view",
    "credit": "Photographer not supplied",
    "permission": "User supplied for website use in the 11 September 2026 revision request (F8); photographer credit and depicted-person consent records not supplied."
  },
  "wall-detail": {
    "src": "/media/library/record/articles/sandstone-lines-and-hand-stencils.webp",
    "alt": "Incised lines and red hand stencils across a sandstone wall.",
    "width": 2000,
    "height": 1334,
    "motionGrade": "frame",
    "origin": "https://drive.google.com/file/d/1RXZTiEdI19g-OKRRHUZKzqp-scdcn513/view",
    "credit": "Photographer not supplied",
    "permission": "User supplied for website use in the 11 September 2026 revision request (F8); photographer credit and depicted-person consent records not supplied."
  },
  "footprints": {
    "src": null,
    "alt": "Footprint engravings — image awaiting access.",
    "width": 2000,
    "height": 1334,
    "motionGrade": "frame",
    "origin": "https://drive.google.com/file/d/1QZe4o4Sm-_mFT5_otZDn6jZnzOcmRwOV/view",
    "credit": "Photographer not supplied",
    "permission": "User supplied for website use in the 11 September 2026 revision request (F8); photographer credit and depicted-person consent records not supplied. Drive access required; file not downloaded."
  },
  "wall-guide": {
    "src": "/media/library/record/articles/hand-pointing-at-sandstone-markings.webp",
    "alt": "A person in a broad-brimmed hat points at markings on sandstone.",
    "width": 2000,
    "height": 1334,
    "motionGrade": "frame",
    "origin": "https://drive.google.com/file/d/1Wp1XrBRqrit3WPtg811VPGmF1NSfhAmk/view",
    "credit": "Photographer not supplied",
    "permission": "User supplied for website use in the 11 September 2026 revision request (F8); photographer credit and depicted-person consent records not supplied."
  },
  "hand-stencil": {
    "src": "/media/library/record/articles/red-hand-stencil-on-pale-sandstone.webp",
    "alt": "A red hand stencil on pale sandstone, with small holes in the rock.",
    "width": 2000,
    "height": 1333,
    "motionGrade": "frame",
    "origin": "https://drive.google.com/file/d/1gfJZk84wT7YpVGhuMAYNUMnj4NK0iSrU/view",
    "credit": "Photographer not supplied",
    "permission": "User supplied for website use in the 11 September 2026 revision request (F8); photographer credit and depicted-person consent records not supplied."
  },
  "deed-signing": {
    "src": "/media/library/record/articles/two-people-laptops-on-deck.webp",
    "alt": "Two people sit at a table with laptops on a timber deck, with a dog in the foreground.",
    "width": 2000,
    "height": 1500,
    "motionGrade": "frame",
    "origin": "https://drive.google.com/file/d/13hmMzMDbmNPnhjXMHRuHfc4hF2VsmYYO/view",
    "credit": "Photographer not supplied",
    "permission": "User supplied for website use in the 11 September 2026 revision request (F8); photographer credit and depicted-person consent records not supplied."
  }
};
