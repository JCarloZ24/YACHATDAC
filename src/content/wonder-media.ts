/**
 * Wonder — the hi-fi frame's photography, slot by slot
 * (`01 · Wonder · HI-FI · Desktop`, Figma 2033:4367).
 *
 * Same contract as src/content/truth-media.ts: the bucket (and with it the
 * motion grade) travels with the asset, and a slot whose file is not on disk
 * renders an honest tonal field, never a faked photograph.
 *
 * The Wonder batch has NOT been gathered yet (2026-09-05). Every slot below
 * names the file it expects under public/media/library/wonder/ so dropping
 * the export in is the whole job. Three slots point at batch-1 frames in the
 * meantime because the subject is an exact match, not a stand-in — the
 * engraved wall, a plant being read, the walk to the escarpment.
 */

import type { MediaSlot } from "@/content/lofi/media";

const WONDER = "/media/library/wonder";
const LIB = "/media/library";

/** The hero — the red dirt road running out under a big sky. */
export const wonderHeroSlot: MediaSlot = {
  id: "wonder-hero",
  bucket: "country",
  expects: "Red dirt road running north under a big sky — the hi-fi hero frame",
  src: `${WONDER}/wonder-hero.webp`,
  tone: "roasted",
};

/** HIGHLIGHTS — three 500px cards, in `wonderHighlights` order. */
export const wonderHighlightMedia: MediaSlot[] = [
  {
    id: "highlight-wall",
    bucket: "cultural-site",
    expects: "The engraved wall",
    src: `${LIB}/teaching-wall-visit.webp`,
    tone: "roasted",
  },
  {
    id: "highlight-foods",
    bucket: "work",
    expects: "Lemongrass passed hand to hand",
    src: `${LIB}/work-botanical.webp`,
    tone: "evergreen",
  },
  {
    id: "highlight-dark",
    bucket: "country",
    expects: "Fire at dusk, the sky coming down to the ground",
    src: `${WONDER}/wonder-afterdark.webp`,
    tone: "midnight",
  },
];

/** TURRABURRA — the escarpment across open country, full-bleed. */
export const turraburraSlot: MediaSlot = {
  id: "wonder-turraburra",
  bucket: "country",
  expects: "The escarpment running along the edge of the Aramac Range, golden hour",
  src: `${WONDER}/wonder-turraburra.webp`,
  tone: "burnt",
};

/**
 * WHAT A STAY LOOKS LIKE — one frame per stage, keyed by stage title. The
 * frame shows only the open stage's photograph; every stage gets one so any
 * of them can be the open one.
 */
export const stayStageMedia: Record<string, MediaSlot> = {
  Arriving: {
    id: "stay-arriving",
    bucket: "work",
    expects: "Pitching a tent at camp, a figure against the sky",
    src: `${WONDER}/wonder-arriving.webp`,
    tone: "roasted",
  },
  "The first night": {
    id: "stay-first-night",
    bucket: "country",
    expects: "Guests around the fire at dusk",
    src: `${WONDER}/wonder-firstnight.webp`,
    tone: "midnight",
  },
  "Walking out to the wall": {
    id: "stay-wall",
    bucket: "cultural-site",
    expects: "Walking through woodland toward the escarpment",
    src: `${LIB}/escarpment-approach.webp`,
    tone: "evergreen",
  },
  "Older than the wall": {
    id: "stay-older",
    bucket: "cultural-site",
    expects: "Fossil footprints preserved in rock",
    src: `${WONDER}/wonder-footprints.webp`,
    tone: "roasted",
  },
  "Out for food": {
    id: "stay-food",
    bucket: "work",
    expects: "Suzanne showing a plant to guests",
    src: `${WONDER}/wonder-food.webp`,
    tone: "eucalyptus",
  },
  "Hands in the work": {
    id: "stay-work",
    bucket: "work",
    expects: "Standing at a spring in open country",
    src: `${WONDER}/wonder-spring.webp`,
    tone: "evergreen",
  },
};

/** WHERE YOU SLEEP — two 400px cards. */
export const whereYouSleepMedia: MediaSlot[] = [
  {
    id: "sleep-tent",
    bucket: "work",
    expects: "A tent going up at camp",
    src: `${WONDER}/wonder-sleep-1.webp`,
    tone: "roasted",
  },
  {
    id: "sleep-dusk",
    bucket: "country",
    expects: "Camp at dusk",
    src: `${WONDER}/wonder-sleep-2.webp`,
    tone: "midnight",
  },
];

/** WHAT IT IS LIKE OUT HERE — full-bleed, copy on the right. */
export const whatItIsLikeSlot: MediaSlot = {
  id: "wonder-out-here",
  bucket: "country",
  expects: "Standing on top of the escarpment looking out over woodland",
  src: `${WONDER}/wonder-outhere.webp`,
  tone: "evergreen",
};

/** YOUR HOSTS — one 400px card. */
export const hostsSlot: MediaSlot = {
  id: "wonder-hosts",
  bucket: "work",
  expects: "Suzanne talking with a small group out on Country",
  src: `${WONDER}/wonder-hosts.webp`,
  tone: "burnt",
};

/** STORIES — one 320px plate per card, in `wonderStories.items` order. */
export const wonderStoryMedia: MediaSlot[] = [
  {
    id: "story-wattanuri",
    bucket: "cultural-site",
    expects: "The engraved wall, close",
    src: `${LIB}/engravings-hand.webp`,
    tone: "roasted",
  },
  {
    id: "story-foods",
    bucket: "work",
    expects: "Bush foods in hand",
    src: `${LIB}/work-seed.webp`,
    tone: "eucalyptus",
  },
  {
    id: "story-spring",
    bucket: "country",
    expects: "The spring holding water",
    src: `${WONDER}/wonder-spring-story.webp`,
    tone: "evergreen",
  },
];
