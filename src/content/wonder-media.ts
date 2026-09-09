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
 *   · stages 2–6 and the story plates for foods/spring
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
 * The hero film — "1MIN EDIT NO SUPERS" (Downloads, 8 Sep 2026), 60s, 4K
 * ProRes master (2.3 GB), H.264 + AAC in three tiers so the page can match
 * the device and the connection (HeroVideo picks one before the first byte
 * loads — see its `pickTier`):
 *
 *   small   960 × 540   ~0.8 Mb/s   phones, data saver, 2g/3g
 *   medium  1440 × 810  ~2.5 Mb/s   laptops and tablets
 *   large   1920 × 1080 ~3.5 Mb/s   wide screens on a fast link
 *
 * MP4 only: H.264 plays everywhere, and a VP9 set on top would double the
 * repo's video weight for a marginal size win. It replaced the "WITH SUPERS"
 * cut the same day: no burned-in titles, so nothing sits under the H1 and
 * `supersEnd` is 0. Content not yet reviewed for cultural sensitivity by
 * Suzanne or Marc — R-flag until it is.
 */
export const wonderHeroVideo = {
  tiers: {
    small: "/media/wonder/wonder-hero-960.mp4",
    medium: "/media/wonder/wonder-hero-1440.mp4",
    large: "/media/wonder/wonder-hero-1920.mp4",
  },
  supersEnd: 0,
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

/** TURRABURRA — the escarpment across open country, full-bleed.
 * F7, user direction 9 September 2026: full motion for this landscape;
 * sticky viewport, shallow scroll approach and pointer tilt/drift. Supersedes
 * Wonder's former page-wide frame-only treatment for this slot alone.
 */
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

/**
 * WHERE YOU SLEEP — two 400px cards. Both landed 9 Sep 2026.
 * Origin: Downloads/Wonder-WhereYouSleep1.jfif (900 × 599, 113,892 bytes)
 * and Wonder-WhereYouSleep2.jfif (1000 × 666, 159,296 bytes), user supplied.
 * Credit: photographer not supplied. Permission: supplied for Wonder;
 * review remains at presentation under F8.
 *
 * 9 Sep 2026, user requested better viewing and quality. The JPEGs are
 * byte-for-byte copies of those originals, replacing lossy WebP
 * inputs. Next Image makes responsive AVIF/WebP derivatives at quality 85;
 * no intermediate lossy encode, retouching or upscaling. Their original
 * exposure is shown without a dark overlay, and frame-grade motion keeps
 * both photographs still. The largest cards are 616 CSS px wide, so these
 * sources cannot fully resolve a 2× display; full-size exports would be
 * needed for additional photographic detail.
 */
export const whereYouSleepMedia: MediaSlot[] = [
  {
    id: "sleep-tent",
    bucket: "work",
    expects: "Pegging out a tent at camp, mallet in hand, in open woodland",
    src: `${WONDER}/wonder-sleep-tent.jpg`,
    tone: "roasted",
  },
  {
    id: "sleep-dusk",
    // The people in both sleep cards require frame-grade motion, explicitly
    // applied in Sections and sleepCards regardless of the scene bucket.
    bucket: "country",
    expects:
      "Camp at dusk — three tents, a group around the fire as the light goes",
    src: `${WONDER}/wonder-sleep-campfire.jpg`,
    tone: "midnight",
  },
];

/** WHAT IT IS LIKE OUT HERE — full-bleed, copy on the right.
 * F7, user direction 9 September 2026: full motion, sharing Turraburra's
 * sticky landscape, 80vh reading hold, scroll approach and mouse tilt/drift.
 */
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

/**
 * The three people in the hosts photograph the user identified on 9 Sep 2026,
 * left to right as they stand. The other five in frame are NOT named: they were
 * not identified, and guessing at a person in a photograph is not something a
 * build gets to do. So this is a partial index on purpose, and §10's pointer
 * interaction must read as "these three are named" rather than "five labels are
 * missing" — hovering a named figure lifts that one name; nothing appears over
 * anybody else.
 *
 * `left` / `top` are percentages of the photograph. `left` is the person's
 * own column; `top` is their CHEST, not their face — a label over somebody's
 * face is worse than no label at all, and that is what the first cut did
 * (corrected 9 Sep 2026 on user report). They are layout positions inside one
 * image, nothing more: the photograph is a `work`-bucket group portrait and
 * carries no place information.
 *
 * Portraits hold still (motion-grammar.md, the corollary on faces): the name is
 * brought up and the rest of the frame dims. The image plane never moves.
 *
 * Spellings and the form of address ("Uncle Vincent") are the user's own and
 * are not to be normalised to house style. Whether these three are content to
 * be named on the page at all is Steve's question at presentation, not ours.
 */
export const hostsPeople = [
  { name: "Uncle Vincent", left: 66, top: 62 },
  { name: "Graham", left: 74, top: 62 },
  { name: "Suzanne", left: 86, top: 66 },
] as const;

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
