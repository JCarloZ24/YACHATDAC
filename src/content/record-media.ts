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
 * F7/F8 amendment, latest user correction 2026-09-08: the opening wall and
 * stone are Three.js stage furniture. One supplied ink print defines separate
 * holes: black opens through the wall; white remains stone. No repeated prints.
 * Origin: user-supplied Image #5, 2026-09-08, copied unchanged. The sandstone
 * texture is generated with the built-in image-generation tool on that date.
 * Full source and prompt: public/artwork/record-portal-provenance.md.
 *
 * The ink mask is an interface asset, explicitly requested by the user. Its
 * creator was not supplied; it is not attributed to Leonard Mickelo or treated
 * as a record of the photographed rock art. The cards use the existing supplied
 * photographs and source credits below. Camera movement brings their whole
 * planes forward; no image animates independently inside its frame.
 */
export const recordPortalMedia = {
  wall: {
    kind: "generated-geometry",
    src: "/artwork/record-sandstone.webp",
    expects:
      "Sandstone with separate openings in the shape of one ink handprint",
    motionGrade: "full",
  },
  mask: "/artwork/handprint-impression.png",
  previewSlugs: [
    "bringing-a-spring-back",
    "a-season-of-bush-foods",
    "it-nearly-didnt-happen",
    "right-way-fire-and-the-carbon-in-the-soil",
    "you-are-standing-on-a-seabed",
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
  /* 01 · Country, not a portrait — the frame is explicit that this entry names
     a person and therefore does not show one. The delivered frame obeys it. */
  "it-nearly-didnt-happen": {
    id: "card-buyback",
    motionGrade: "full",
    bucket: "country",
    expects:
      "Grass heads catching the last light on the outcrop, the plain below — Country, not a portrait",
    src: `${RECORD}/therecord-story1.webp`,
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
  /* 09 · story-wall → frame grade. */
  "fifteen-thousand-markings-read-in-order": {
    id: "card-markings",
    motionGrade: "frame",
    bucket: "story-wall",
    expects:
      "A hand resting on the engraved sandstone, the markings running under it",
    src: `${RECORD}/therecord-story9.webp`,
    tone: "midnight",
  },
  /* 10 · the entry's own subject, exactly — the carbon in the soil. */
  "right-way-fire-and-the-carbon-in-the-soil": {
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
 * The three breakouts — an entry taking the whole screen as the grid runs.
 *
 * A · Iningai knowledge — card 01. The same Country frame the card carries;
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
