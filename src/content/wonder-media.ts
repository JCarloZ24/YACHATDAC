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
 *   small   960 × 540   ~0.8 Mb/s   data saver, 2g/3g, and phones for now
 *   medium  1440 × 810  ~2.5 Mb/s   laptops and tablets
 *   large   1920 × 1080 ~3.5 Mb/s   wide screens on a fast link
 *
 * ⚠ A FOURTH TIER IS MISSING, and phones are soft until it exists (August,
 * 10 September 2026). Full-bleed in a portrait phone, `object-cover`
 * magnifies this 16:9 frame 3.7× and shows the middle 27% of it, so 73% of
 * every byte is thrown away and no landscape encode fixes it — 1440 costs
 * 14.9 MB at CRF 30 and is still soft. What is needed is a cut FRAMED for
 * portrait, which is the editor's call and not ours: a blind centre crop
 * cuts Suzanne's head in half at 0:20 and slices the guests at 0:45. The
 * brief, with the measurements, is in brand/video/README.md; drop the file
 * in as `tiers.portrait` and HeroVideo will serve it to phones.
 *
 * Audio: all three are normalised to −23 LUFS. A replacement MUST be too —
 * the delivered mix was −17 LUFS and clipped once transcoded.
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
    // portrait: "/media/wonder/wonder-hero-portrait.mp4",  ← awaiting the re-cut
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
    // Replaced 10 September 2026, user direction: the supplied 802 × 691
    // placeholder gave way to a photograph off Country. 2000 × 1333, derived
    // from the master at brand/photography/wonder/003A5805.JPG.
    expects: "Last light behind the treeline, the sun breaking through a gum",
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
  /**
   * Replaced 10 September 2026, user supplied, with the revised "Arriving"
   * copy: the stage is now the drive in, so the frame is the drive in.
   * Origin: user upload, 10 September 2026, already WebP at the library's
   * 2000 wide, written through unmodified rather than re-encoded, so no
   * second lossy pass. Credit: photographer not supplied. Permission:
   * supplied for Wonder; review remains at presentation under F8. Bucket is
   * `country` — landscape, not a cultural site, nobody identifiable in it.
   *
   * `-drive` rather than reusing the old name: next/image caches its
   * derivatives by URL, so overwriting a path in place keeps serving the old
   * picture until the cache is cleared. A new filename is the fix that works
   * in dev, on Vercel and in any CDN in front of it. The 8 Sep
   * overhang-at-sunset frame it replaces was deleted in the same pass.
   */
  Arriving: {
    id: "stay-arriving",
    bucket: "country",
    expects:
      "Aerial: a single vehicle on the two-wheel track, woodland running to the horizon",
    src: `${WONDER}/wonder-arriving-drive.webp`,
    tone: "evergreen",
  },
  /**
   * Set 10 September 2026 with the revised "The first night" copy, which is
   * now the quiet end of the day rather than the fire.
   *
   * It shares `wonder-afterdark.webp` with the "After dark" highlight card:
   * the frame supplied for this stop is the same photograph that card already
   * carries, so this points at the one file rather than adding a second
   * encode of it. ⚠ That does mean the Wonder page shows one picture twice.
   * Raised with August 10 Sep 2026; supply a different dusk frame for either
   * slot and only this `src` needs to change.
   */
  "The first night": {
    id: "stay-first-night",
    bucket: "country",
    expects: "Trees in silhouette against the last of the light, dusk",
    src: `${WONDER}/wonder-afterdark.webp`,
    tone: "midnight",
  },
  /**
   * Key follows the stop's title, retitled 10 September 2026 (see
   * `stayStages`). The photograph stays at `${LIB}/escarpment-approach.webp`
   * and is deliberately NOT copied into the wonder folder: it is a batch-1
   * library asset registered in kit.ts and used by Home and the effects lab
   * as well, so a copy under `wonder/` would be the fourth reference to one
   * picture and a duplicate of exactly the kind cleaned up in this pass.
   */
  "Walking out to Marra Wonga": {
    id: "stay-wall",
    bucket: "cultural-site",
    expects: "Walking through woodland toward the escarpment",
    src: `${LIB}/escarpment-approach.webp`,
    tone: "evergreen",
  },
  /**
   * Landed 10 September 2026 with the revised "Older than the wall" copy.
   * Origin: user upload, 10 September 2026, WebP at the library's 2000 wide.
   * Credit: photographer not supplied. Permission: supplied for Wonder;
   * review remains at presentation under F8.
   *
   * Graded 10 September 2026 on August's direction to match the rest of the
   * Wonder set, which the ungraded frame sat flat and pale against. Measured
   * against the other nine, not eyeballed: brightness ×0.93, contrast ×1.10,
   * saturation ×1.45, no channel shift. That moves it from mean luminance
   * 100 / saturation 0.28 to 92 / 0.42, inside the set's band. Re-encoded
   * once at quality 86; re-run those three numbers on a fresh original if the
   * photograph is ever resupplied.
   *
   * Bucket stays `cultural-site`, so the grade stays `frame`. The subject is
   * palaeontological rather than cultural, which would argue for `country` —
   * but a host and four guests are identifiable in it and the ground is a
   * place people are taken to. The tiebreaker in lofi/media.ts sends anything
   * genuinely ambiguous to the more restrictive bucket.
   */
  "Older than the wall": {
    id: "stay-older",
    bucket: "cultural-site",
    expects: "A host showing guests the water-filled hollows in the rock",
    src: `${WONDER}/wonder-footprints.webp`,
    tone: "roasted",
  },
  /**
   * Key follows the stop's title, retitled 10 September 2026 (see
   * `stayStages`). Photograph landed the same day, user supplied, replacing
   * the never-delivered `wonder-food.webp`; the filename follows what is
   * visibly in frame. Origin: user upload, 10 September 2026, 2000 × 1333
   * JPEG (the client had resized it from a 6720 × 4480 original), encoded
   * once to WebP at quality 86. Credit: photographer not supplied.
   * Permission: supplied for Wonder; review remains at presentation under F8.
   *
   * Bucket `work`: three people collecting seed into a tub, no cultural
   * material in frame.
   *
   * Graded to sit with the set, same method as the other two frames added
   * today: brightness ×0.93, contrast ×1.08, saturation ×1.25, from
   * luminance 105 / saturation 0.34 to 96 / 0.44 — inside the set's band and
   * deliberately just under `wonder-turraburra.webp`, its top.
   *
   * ⚠ The frame is seed collecting, which is restoration work; the stop it
   * sits under is about food on Country. Close, not the same thing. Raised
   * with August 10 Sep 2026 — it may belong under "Hands in the work".
   */
  "Finding food on Country": {
    id: "stay-food",
    bucket: "work",
    expects: "Collecting seed into a tub, three people working through scrub",
    src: `${WONDER}/wonder-seed-collecting.webp`,
    tone: "eucalyptus",
  },
  /**
   * Landed 10 September 2026, user supplied, replacing the never-delivered
   * `wonder-spring.webp`. The frame is fire-stick farming watched from the
   * ridge above it, which is what the revised stop is about, so the filename
   * follows what is visibly in frame rather than the old slot's name.
   * Origin: user upload, 10 September 2026, WebP, 2000 × 1500. Credit:
   * photographer not supplied. Permission: supplied for Wonder; review
   * remains at presentation under F8.
   *
   * Bucket `work`: two people watching ground they have burnt, no cultural
   * material in frame — documentary photography of a job, and the tiebreaker
   * in lofi/media.ts puts the ranger burning grass away from a shelter here.
   *
   * Graded to sit with the set, same method as the stop-4 frame: brightness
   * ×0.88, contrast ×1.10, saturation ×1.30, from luminance 115 /
   * saturation 0.24 to 100 / 0.35. Deliberately short of the set's 0.42 —
   * the scene is smoke and overcast, and pushing it further would invent
   * colour the day did not have. `charcoal` replaces `evergreen` as the
   * tonal field: burnt ground and grey sky, not green.
   */
  "Hands in the work": {
    id: "stay-work",
    bucket: "work",
    expects: "Watching the burn from the ridge above it, smoke over the range",
    src: `${WONDER}/wonder-fire-ridge.webp`,
    tone: "charcoal",
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
/**
 * WHERE YOU STAY — the carousel, ten frames (10 September 2026, August's
 * direction: "make it a carousel, let's show other guests, mix the images").
 *
 * ORDER IS THE MIX, and it is deliberate rather than the order they arrived
 * in: camp, then people, then camp again, so a reader swiping never gets two
 * empty landscapes or two group shots in a row, and guests appear early
 * enough to be the point rather than a footnote. Eight frames landed with
 * this revision; the two that were already here (`sleep-tent`, `sleep-dusk`)
 * keep their ids and are shuffled into the run.
 *
 * The eight new ones: user upload, 10 September 2026, all at the library's
 * 2000 wide. Credit: photographer not supplied. Permission: supplied for
 * Wonder; review remains at presentation under F8. Every one was graded
 * toward the Wonder set's measured band on August's note that "some image
 * lighting/colouring need to be improved" — gentle contrast, then a solved
 * brightness and saturation per frame; the per-frame numbers are on each
 * slot. Nothing was pushed past what the light in it can carry.
 *
 * PEOPLE ARE IDENTIFIABLE in six of the ten. The image plane is held for the
 * whole rail (`data-motion="frame"` in Sections), as it was for the two
 * cards this replaces, whatever each slot's bucket.
 */
export const whereYouStayMedia: MediaSlot[] = [
  {
    // Gamma 0.74, then c×1.04 s×1.18 — 85/0.29 → 103/0.28. A linear lift
    // met the set's mean and still left the ground under the trees a black
    // mass in the 400px crop; the gamma opens it. Cool by nature: it is a
    // backlit dawn, and warming it would be inventing a different morning.
    id: "stay-dawn-camp",
    bucket: "country",
    expects: "Camp among the trees at first light, sun coming through",
    src: `${WONDER}/wonder-stay-dawn-camp.webp`,
    tone: "midnight",
  },
  {
    // Gamma 0.72 rather than a linear lift, then c×1.06 s×1.28 — 57/0.26
    // → 80/0.28. The frame is shadow-heavy under the shelter; a brightness
    // push flattened the highlights, opening the shadows did not.
    id: "stay-table",
    bucket: "country",
    expects: "Breakfast around the long table under the camp shelter",
    src: `${WONDER}/wonder-stay-table.webp`,
    tone: "evergreen",
  },
  {
    // b×0.78 c×1.08 s×1.47 — 125/0.24 → 97/0.35.
    id: "stay-tents-clearing",
    bucket: "country",
    expects: "Five tents pitched through open woodland",
    src: `${WONDER}/wonder-stay-tents-clearing.webp`,
    tone: "eucalyptus",
  },
  {
    // b×1.25 c×1.08 s×1.29 — 73/0.28 → 89/0.37.
    id: "stay-buggy",
    bucket: "country",
    expects: "Guests in the buggy beside the deck, heading out",
    src: `${WONDER}/wonder-stay-buggy.webp`,
    tone: "roasted",
  },
  {
    id: "sleep-tent",
    bucket: "work",
    expects: "Pegging out a tent at camp, mallet in hand, in open woodland",
    src: `${WONDER}/wonder-sleep-tent.jpg`,
    tone: "roasted",
  },
  {
    // b×0.82 c×1.08 s×1.43 — 120/0.23 → 97/0.33.
    id: "stay-fire-circle",
    bucket: "country",
    expects: "The circle of chairs around the fire between the tents",
    src: `${WONDER}/wonder-stay-fire-circle.webp`,
    tone: "burnt",
  },
  {
    // b×0.98 c×1.08 s×1.33 — 97/0.26 → 94/0.35.
    id: "stay-tents-morning",
    bucket: "country",
    expects: "Tents in the trees with the morning sun through them",
    src: `${WONDER}/wonder-stay-tents-morning.webp`,
    tone: "eucalyptus",
  },
  {
    // b×0.81 c×1.08 s×1.75 — 121/0.15 → 97/0.26. The saturation stops
    // short of the set: it is a galvanised-iron kitchen under a grey roof,
    // and the colour simply is not in the frame to recover.
    id: "stay-kitchen",
    bucket: "work",
    expects: "Cooking breakfast in the camp kitchen under the shelter",
    src: `${WONDER}/wonder-stay-kitchen.webp`,
    tone: "charcoal",
  },
  {
    id: "sleep-dusk",
    bucket: "country",
    expects:
      "Camp at dusk — three tents, a group around the fire as the light goes",
    src: `${WONDER}/wonder-sleep-campfire.jpg`,
    tone: "midnight",
  },
  {
    // b×0.78 c×1.08 s×1.15 — 145/0.26 → 111/0.33. Left brighter than
    // the rest on purpose: it is a pastel dusk sky and the set's band would
    // have turned it muddy. Last in the run, which is where it earns it.
    id: "stay-lake",
    bucket: "country",
    expects: "The Yumba lake at dusk, pink cloud reflected in still water",
    src: `${WONDER}/wonder-stay-lake.webp`,
    tone: "burnt",
  },
];

/** WHAT IT IS LIKE OUT HERE — full-bleed, copy on the right.
 * F7, user direction 9 September 2026: full motion, sharing Turraburra's
 * sticky landscape, 80vh reading hold, scroll approach and mouse tilt/drift.
 */
/**
 * Replaced 10 September 2026, user supplied with the revised copy. Origin:
 * user upload, WebP at the library's 2000 wide. Credit: photographer not
 * supplied. Permission: supplied for Wonder; review remains at presentation
 * under F8. Graded to the set: contrast ×1.10, brightness ×0.92,
 * saturation ×1.28 — 107/0.34 → 97/0.46.
 *
 * A NEW FILENAME, not an overwrite of `wonder-outhere.webp`: next/image keys
 * its derivatives by URL, so replacing a path in place keeps serving the old
 * frame until every cache expires. Same reason as `wonder-arriving-drive`.
 *
 * ⚠ PEOPLE ARE NOW IN THIS FRAME — a family, a child and their host on the
 * ridge — and this slot is `country`, so it grades `full`: the shared
 * landscape scene scrubs and tilts the image plane under the copy (F7, 9 Sep
 * 2026). That was decided for an empty sunset. It is still permitted, but if
 * the plane should hold now that there are guests in it, the change is
 * `bucket: "cultural-site"` here and nothing else — MediaTile enforces the
 * grade. Raised with August 10 Sep 2026.
 */
export const whatItIsLikeSlot: MediaSlot = {
  id: "wonder-out-here",
  bucket: "country",
  expects: "A family and their host on the ridge, woodland to the horizon",
  src: `${WONDER}/wonder-outhere-lookout.webp`,
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
    /* 10 September 2026: `wonder-spring-story.webp` was a byte-for-byte copy
       of the Highlights wall frame standing in for a spring that has not been
       photographed. Two names for one file, and the wrong subject under a
       spring's heading. The file is deleted and the slot renders its tonal
       field, which is the honest state until the real frame lands. */
    expects: "The spring holding water",
    src: null,
    tone: "evergreen",
  },
];
