/**
 * Wonder — the hi-fi frame's photography, slot by slot
 * (`01 · Wonder · HI-FI · Desktop`, Figma 2033:4367).
 *
 * Same contract as src/content/truth-media.ts: the bucket (and with it the
 * motion grade) travels with the asset, and a slot whose file is not on disk
 * renders an honest tonal field, never a faked photograph.
 *
 * The Wonder batch landed 8 Sep 2026 (Downloads/Wonder Assets, eight
 * stills + the 1-minute "supers" edit). Each still was resized to the
 * library's 2000-wide webp and written under public/media/library/wonder/.
 * Slots still naming a file that is not on disk render their tonal field.
 *
 * Still to come from the batch:
 *   · the hero is the batch's 1-minute edit, transcoded 8 Sep 2026 from the
 *     ProRes master (see `wonderHeroVideo`); its frame 0 is the hero still
 *   · stages 2–6, both sleep cards, and the story plates for foods/spring
 *   · the "Stories" placeholder supplied is the same frame as Highlights 1
 */

import type { MediaSlot } from "@/content/lofi/media";

const WONDER = "/media/library/wonder";
const LIB = "/media/library";

/**
 * The hero — the red dirt road running out under a big sky. Frame 0 of the
 * edit below, so the still, the poster and the film all open on one image.
 */
export const wonderHeroSlot: MediaSlot = {
  id: "wonder-hero",
  bucket: "country",
  expects: "Red dirt road running north under a big sky — the hi-fi hero frame",
  src: `${WONDER}/wonder-hero.webp`,
  tone: "roasted",
};

/**
 * The hero film — "1MIN EDIT WITH SUPERS" from the Wonder batch, 60s, 4K
 * ProRes master (2.3 GB, Drive) → 1600-wide H.264 + AAC and VP9 + Opus, per
 * brand/video/README.md. Burned-in supers run 0–12s (`supersEnd`); the hero
 * plays the film whole from 0 in both states by decision on 8 Sep 2026, and
 * HeroVideo's `silentFrom` can skip them again if that changes. Content not
 * yet reviewed for cultural sensitivity by Suzanne or Marc — R-flag until
 * it is.
 */
export const wonderHeroVideo = {
  mp4: "/media/wonder/wonder-hero.mp4",
  webm: "/media/wonder/wonder-hero.webm",
  supersEnd: 12,
  label:
    "Guesting on Turraburra — Suzanne Thompson walking a family through the engraved wall, the plants and the camp",
};

/** HIGHLIGHTS — three 500px cards, in `wonderHighlights` order. */
export const wonderHighlightMedia: MediaSlot[] = [
  {
    id: "highlight-wall",
    bucket: "cultural-site",
    expects: "A hand reading the engraved wall",
    src: `${WONDER}/wonder-highlight-wall.webp`,
    tone: "roasted",
  },
  {
    id: "highlight-foods",
    bucket: "work",
    expects: "A hand among seedlings in the nursery tray",
    src: `${WONDER}/wonder-highlight-foods.webp`,
    tone: "evergreen",
  },
  {
    id: "highlight-dark",
    bucket: "country",
    // 802 × 691 — the only small frame in the batch; fine for a 400px card.
    expects: "A ranger standing over the campfire's smoke by the waterhole",
    src: `${WONDER}/wonder-afterdark.webp`,
    tone: "midnight",
  },
];

/** TURRABURRA — the escarpment across open country, full-bleed. */
export const turraburraSlot: MediaSlot = {
  id: "wonder-turraburra",
  bucket: "country",
  expects: "The escarpment's red rock and grass at golden hour, woodland below",
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
    expects: "Looking out from under the overhang at sunset, hat on",
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
  expects: "Sunset over the woodland from the top of the escarpment",
  src: `${WONDER}/wonder-outhere.webp`,
  tone: "evergreen",
};

/** YOUR HOSTS — one 400px card. */
export const hostsSlot: MediaSlot = {
  id: "wonder-hosts",
  bucket: "work",
  expects: "The hosts and rangers lined up on the red dirt at dusk",
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
    // Placeholder from the batch — the same wall frame as Highlights 1.
    expects: "The spring holding water (placeholder: the engraved wall)",
    src: `${WONDER}/wonder-spring-story.webp`,
    tone: "evergreen",
  },
];
