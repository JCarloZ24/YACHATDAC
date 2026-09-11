/**
 * Wonder — "Guesting On-Country".
 *
 * Source of truth: docs/content/drafts/wonder/YACHATDAC-Wonder-Copy-v3.md
 * (decision D5). The draft governs copy. It does not govern design — the
 * prototype it was converted from is a suggestion to the wireframes, not a
 * decision, and the layout below is this repo's, not the prototype's.
 *
 * ⚠ The old `src/content/page-specs.ts` entry for Wonder described a "2 Night,
 * 3 Day Guesting on Country experience" with a validated itinerary. That file
 * is deleted as of this build — see git history. v3 retires the itinerary
 * outright: "We do not run a set itinerary, because the work does not." What
 * replaced it is a sequence of stages, below, deliberately not tied to days.
 *
 * ⚠ Two open items live on this page and are marked in place:
 *   - R13 — the inclusions are written but unconfirmed, and the draft carries
 *     its own NEEDS CONFIRMATION note about it. Rendered, see `inclusions`.
 *   - CR6, CR7 — pending change requests from FNAN's 24 Aug review. Neither is
 *     applied here; the draft governs until a change request is answered.
 *     See docs/change-requests.md.
 */

export const wonderHero = {
  eyebrow: "Wonder · Guesting On-Country",
  title: "Guesting On-Country",
  /**
   * Revised 10 September 2026, August's direction: the standfirst now speaks
   * in the first person and issues the invitation ("come spend a few days
   * with us") rather than describing the stay in the third person. D5 —
   * mirrored into the v3 draft in the same pass.
   */
  standfirst:
    "Come spend a few days with us on Turraburra. We welcome you onto our Country, share our stories and knowledge, and look after you while you are here.",
  /**
   * The draft's summary line. Kept as separate items rather than one string so
   * it can be set as chips or as a run of text without re-splitting it.
   *
   * ⚠ CR3 — applied. "Cool burns" now reads "Fire-stick farming".
   */
  summary: [
    "Marra Wonga",
    "Native foods",
    "Fire-stick farming",
    "Camping",
    "Central Western Queensland",
    "Families & school groups",
  ],
  /**
   * ⚠ CR6 — applied. Steve (FNAN), 15:19: "They can also travel by train via
   * Rockhampton to Barcaldine." Rail is now a named arrival route here, and
   * the `inclusions` transfers line is reconciled to match — a supported route
   * a reader cannot get a transfer from would be worse than not listing it.
   * Whether transfers actually meet the train is unconfirmed and rides on R13
   * with the rest of that block.
   */
  facts: [
    { label: "Where", value: "Turraburra, 120km north of Barcaldine" },
    {
      label: "Getting here",
      value:
        "Fly to Barcaldine or Longreach and drive, or take the train to Barcaldine via Rockhampton. Transfers can be arranged.",
    },
    { label: "How long", value: "Half-day walks through to multi-day stays" },
    {
      label: "Sleeping",
      value: "Camping — swag or tent, shared meals, fire at night",
    },
    { label: "Best months", value: "May to September" },
    {
      label: "Who comes",
      value: "Families, school groups, group bookings, international visitors",
    },
  ],
} as const;

/** The opening gallery. Nine slots, no assets — see components/ui/ImageSlot. */
export const wonderGallery = [
  "Guests standing with Suzanne beneath the engraved escarpment wall at Marra Wonga.",
  "Camp chairs and tents around a fire at dusk.",
  "Red dirt road running out under a big sky.",
  "Suzanne pointing out features along the shelter wall.",
  "Suzanne handing lemongrass to a guest.",
  "A group walking through woodland toward the escarpment.",
  "Pitching a tent at camp.",
  "Fossil footprints in the rock.",
  "The escarpment seen from a distance.",
] as const;

/**
 * ⚠ CR7 — applied. Title turned positive per the client's suggestion; the
 * body keeps "no town glow" as the stated reason rather than losing the fact,
 * per the CR's own recommended approach. The same fact carries the "first
 * night" stage below.
 */
export const wonderHighlights = [
  {
    eyebrow: "Marra Wonga",
    title: "Place of many stories",
    body: "160 metres of sandstone carrying fifteen thousand markings, read south to north.",
    image: "The engraved wall.",
  },
  {
    eyebrow: "Native foods",
    title: "Country you can eat from",
    body: "Herbs, fruits, seeds and nuts, in scrub that looked empty on the drive in.",
    image: "Lemongrass passed hand to hand.",
  },
  {
    eyebrow: "After dark",
    title: "Magic at night",
    body: "There's no town glow out this way — when the fire burns down, the sky comes all the way to the ground.",
    image: "Fire at dusk.",
  },
] as const;

/**
 * ⚠ REWRITTEN 10 September 2026, user direction, and the draft
 * (YACHATDAC-Wonder-Copy-v3.md §"Getting here is part of it") was rewritten
 * in the same pass — D5, drafts govern copy.
 *
 * What went: the Harry Redford cattle-duffing story, the per-stop details,
 * and the Gray Rock / Wattanuri coda. The stops are now a bare list of
 * places you may come across, introduced rather than annotated, and the
 * section closes on the arrival rather than on a second story. Anything
 * still wanted from the removed paragraphs has to come back through a draft,
 * not through markup.
 */
export const gettingHere = {
  title: "Getting here is part of it",
  body: [
    "Turraburra is about 120 kilometres north of Barcaldine, with the final stretch taking you along dirt roads. The journey slows you down before you arrive and gives you a sense of just how remote this Country is.",
    "Aramac is the last town before you head further north.",
  ],
  /** The line that introduces the list; it is copy, so it lives here. */
  stopsIntro: "Along the way and around the region, you may also come across:",
  /**
   * `detail` is optional now. Lake Dunn keeps its other names because they
   * are the place's names and not a description of it; the other three are
   * named and left alone.
   */
  stops: [
    { name: "Lake Dunn", detail: "Pajingo Bola, Big Fella Waterhole" },
    { name: "Lake Dunn Sculpture Trail" },
    { name: "Horsetailer's Gorge and the Healing Circle" },
    { name: "Gray Rock" },
  ] as readonly { name: string; detail?: string }[],
  coda: "By the time you reach us, you will already feel the landscape beginning to change.",
} as const;

export const turraburra = {
  title: "Turraburra",
  /**
   * Revised 10 September 2026, August's direction: the paragraph now opens on
   * whose Country this is rather than on the lease name, and says plainly that
   * "Terraburra" is the surveyor's spelling on the 1884 map — the house rule
   * that Turraburra (the property) and Terraburra (the 1884 clan record) are
   * each correct in their own sentence, made legible to a reader. CR10 below
   * is kept as the record of why the previous sentence read as it did; its
   * wording is superseded, its ruling is not.
   *
   * ⚠ CR10 — applied 7 Sep on August's ruling. "bought back for our people"
   * now reads "bought back for the Iningai people". Two things this does NOT
   * do: it does not adopt Steve's "Innigai" — every draft and every file here
   * says "Iningai", R18 is still open, and it is the name of a nation; and it
   * does not touch "we renamed it", which is YACHATDAC describing its own act
   * rather than speaking of Iningai people in the first person.
   * D16 (the terminology sheet) still owes the standing ruling.
   */
  body: "This Country is Iningai. For most of a century a pastoral lease called it Gracevale. We bought it back in April 2019, 8,870 hectares, and on 1 October 2020 we gave it its name again. Turraburra, after the Terraburra clan — that spelling is a surveyor's, written down on an 1884 map. We have been here considerably longer than the map.",
  image: "The escarpment across open country.",
  caption: "The escarpment runs along the edge of the Aramac Range.",
} as const;

export type StayStage = {
  title: string;
  body: string[];
  points?: readonly string[];
  images?: readonly string[];
  /** A line the draft sets apart from the body. Rendered larger. */
  coda?: string;
};

/**
 * What a stay looks like.
 *
 * Not an itinerary and not numbered days — that distinction is the point of
 * the "Hands in the work" stage and it is why the old spec was retired.
 */
export const stayStages: readonly StayStage[] = [
  {
    /**
     * Revised 10 September 2026, August's direction. The stage is now the
     * drive in rather than the setting-up: short paragraphs whose rhythm
     * ("Keep going.") is the point, so they stay separate and are not folded
     * into one, and the closing line carried in `coda` for the callout face.
     * The two old photo notes are replaced by the one aerial supplied with
     * the revision — see `stayStageMedia`.
     */
    title: "Arriving",
    body: [
      "The final stretch is a long one.",
      "The roads get quieter, the bitumen turns to dirt, and there is still a lot of Country between you and the homestead.",
      "Keep going.",
      "When you finally arrive, we will be here to meet you. Unpack, choose your spot, set up camp and settle in.",
    ],
    images: [
      "Aerial: a single vehicle on the two-wheel track, woodland running to the horizon.",
    ],
    /* 10 September 2026, August's direction: the closing line is set in the
       callout face. `coda` is the field that carries it — the only route to
       Good Dog in this section, and the same one the other five stops use. */
    coda: "You have made it to Turraburra.",
  },
  {
    /**
     * Revised 10 September 2026, August's direction. The stop is now the
     * quiet end of the day — the meal, the choice to stay out or turn in —
     * rather than the fire and the telling. The Seven Sisters paragraph goes
     * with it: that story belongs to the people who tell it, and this page no
     * longer stages it as an evening's entertainment. Closing line carried in
     * `coda` for the callout face, as August asked on stop 1.
     */
    title: "The first night",
    body: [
      "After the long journey, we settle in, eat together, talk and get to know each other.",
      "If you still have energy, stay outside a little longer. Listen to the animals, look across Country and take in the sky. Or head to bed early. There is no rush.",
    ],
    images: ["Trees in silhouette against the last of the light, dusk."],
    coda: "By morning, daylight reveals just how much is around you.",
  },
  {
    /**
     * Revised 10 September 2026, August's direction. Retitled from "Walking
     * out to the wall" — `stayStageMedia` is keyed by this title, so the key
     * moved with it. The four count-and-detail bullets are gone: the revision
     * folds the markings into one sentence and stops publishing figures we
     * have not confirmed (the snake's length, the six toes, "never
     * scientifically dated"). "Thousands", not "fifteen thousand", for the
     * same reason. The coda is now "share", not "tell", in both directions —
     * what is given and what is withheld are both ours to decide.
     */
    title: "Walking out to Marra Wonga",
    body: [
      "Marra Wonga means place of many stories.",
      "We walk with you through the woodland until the sandstone wall rises ahead.",
      "Across it are thousands of markings: tracks, stars, grooves, circles and figures, with parts of the story moving along the wall from south to north.",
    ],
    images: ["Walking through woodland toward the escarpment."],
    coda: "We share what we are able to share.",
  },
  {
    /**
     * Revised 10 September 2026, August's direction. Loses the visiting
     * specialist's "may be dinosaur eggs" — a second-hand maybe that the page
     * was carrying as fact-adjacent — and keeps the claims to what is in the
     * stone. Closing line in `coda` for the callout face, as on stops 1–3.
     */
    title: "Older than the wall",
    body: [
      "Long before people walked this Country, an inland sea covered this place.",
      "Its traces are still here in stone: ancient footprints, petrified trees and other signs of a landscape much older than us.",
    ],
    images: ["A host showing guests the water-filled hollows in the rock."],
    coda: "We take you out to see them.",
  },
  {
    /**
     * Revised 10 September 2026, August's direction. Retitled from "Out for
     * food" — `stayStageMedia` is keyed by the title, so its key moved too.
     * "Our people ... for thousands of generations" replaces "First Peoples
     * ... tens of thousands of years": first person, and a measure counted in
     * people rather than in a number nobody here has verified.
     */
    title: "Finding food on Country",
    body: [
      "What can look empty from the road is full of food.",
      "Seeds, fruits, herbs, nuts and plants have sustained our people on this Country for thousands of generations.",
    ],
    images: ["Collecting seed into a tub, three people working through scrub."],
    coda:
      "We show you what to look for. Once you start seeing it, the Country looks different.",
  },
  {
    /**
     * Revised 10 September 2026, August's direction. Two things left the
     * page with this pass, both deliberate and both raised with August:
     * the spring-and-koala paragraph (it survives as the Resources story
     * "Bringing a spring back", linked further down this page), and the line
     * "nothing you see was put on for you".
     *
     * ⚠ "fire work" is August's wording, kept verbatim. The house term is
     * *fire-stick farming* (docs/terminology.md) and this is the one place on
     * the site that now says it another way. Flagged, not silently corrected.
     */
    title: "Hands in the work",
    body: [
      "We do not run a fixed itinerary. Country decides the day.",
      "Rain might mean fire work. Seeding grasses might mean collecting. Other days take us to water, plants, animals or restoration.",
      "You join us in whatever needs doing, so no two stays are the same.",
    ],
    images: ["Watching the burn from the ridge above it, smoke over the range."],
    coda: "If you want to put your hands in and help, you are welcome to.",
  },
];

/**
 * ⚠ R13. Every line here needs Suzanne or Steve to confirm before publishing,
 * and the Transfers line now carries a second unconfirmed claim: CR6 added rail
 * as an arrival route, so this says transfers meet the train. Nobody has
 * confirmed that they do — it is the first thing to check in the R13 pass.
 * and the draft says so in its own words — carried through as
 * `inclusionsNote` and rendered on the page rather than dropped.
 *
 * The cost half of R13 is answered: there is no published pricing and the
 * closing note says why. The inclusions half is still open.
 */
export const inclusions = [
  {
    title: "Meals",
    points: [
      "Shared meals cooked on site",
      "Native foods where the season allows",
    ],
  },
  {
    title: "Guiding",
    points: [
      "Hosted throughout by Suzanne, Graham and the Iningai Rangers",
      "Access to Marra Wonga and the sites we are able to show",
    ],
  },
  {
    title: "Camping",
    points: [
      "What we provide and what you bring",
      "Toilet and washing facilities",
    ],
  },
  {
    title: "Transfers",
    points: [
      "Available from Barcaldine or Longreach airports, or the Barcaldine train, for an extra cost",
      "Arranged when you enquire",
    ],
  },
] as const;

export const inclusionsNote =
  "Every line above needs Suzanne or Steve to confirm before publishing.";

/**
 * Revised 10 September 2026, August's direction. Retitled "Where you sleep"
 * → "Where you stay": the section is now the whole of camp life, not the
 * bed. `body` became an array of paragraphs in the same pass — it was one
 * string and the revision is four — and `WonderWhereYouStay` maps it.
 * The two photo notes became ten with the carousel; see `whereYouStayMedia`.
 *
 * Revised again 11 September 2026, August's direction. Three substantive
 * changes, all in the words rather than the shape:
 *
 *  · "This is camp life." is now `lead` rather than the first item of `body`,
 *    because the revision sets it bold. The weight is a property of that
 *    sentence and not of its position, so it is carried here — markup must
 *    not decide which paragraph is emphasised (D5), and a CMS edit that
 *    reorders `body` must not move the bold with the index (D12).
 *  · The camp is named to the lake — "a shared camp area beside Yumba Lake" —
 *    and the day is described in two sentences (mornings over breakfast,
 *    everyone back together at the end of it) that the old copy did not have.
 *    "The Yumba lake" became "Yumba Lake": it is the place's name.
 *  · The last line closes on "close to Country", not "close to the land" —
 *    Country capitalised, per docs/terminology.md.
 *
 * Gone in the same pass: "shared meals", "a stocked pantry" and "space to
 * sit, talk, swim and slow down". The meals are now the breakfast sentence,
 * and the pantry is a Camping inclusion above, not a line of the picture.
 */
export const whereYouStay = {
  title: "Where you stay",
  /** Bold, set apart from `body` — see the note above. */
  lead: "This is camp life.",
  body: [
    "Swags and tents, simple bathrooms, and a shared camp area beside Yumba Lake where we cook, eat, sit around the fire and spend time together.",
    "It is where mornings start over breakfast and where everyone comes back together at the end of the day.",
    "There is plenty of space to spread out, slow down and make yourself comfortable.",
    "Cabins and a lodge may come later. For now, this is how we stay — simple, shared and close to Country.",
  ],
} as const;

/**
 * Revised 10 September 2026, August's direction. The substantive change is
 * the connectivity line: the page used to say service "does not come back
 * until you head home", which is now wrong — there are spots with signal, and
 * there is Wi-Fi at camp and in the vehicles. A visitor planning around the
 * old line would have made the wrong call about being reachable.
 */
export const whatItIsLike = {
  title: "What it is like out here",
  points: [
    "Red earth, spinifex and kangaroos along the track at dusk.",
    "Hot days and winter nights that can get close to freezing.",
    "May to September is usually the most comfortable time to visit.",
    "Mobile service is mostly out of range, with only a few spots where signal comes through. Wi-Fi is available around camp and in our vehicles when needed.",
    "Distances are long, so fuel up before leaving Aramac.",
  ],
  image: "Standing on top of the escarpment looking out over woodland.",
} as const;

/**
 * Revised 11 September 2026, August's direction. The substantive change is
 * that the section no longer NAMES who will be there.
 *
 * It used to promise "Suzanne Thompson, Graham Ambridge and the Iningai
 * Rangers host every group ourselves". That is a commitment about two
 * specific people on every booking, and it is not one the page can make: the
 * revision says so in its own second sentence — "the people with you may
 * change from visit to visit". What is constant is the standing, not the
 * roster, so the copy now names the standing: Traditional Custodians of this
 * Country and the Iningai Rangers who care for and work on it.
 *
 * `body` became an array in the same pass — it was one string and the
 * revision is two paragraphs — and `WonderWhoYouAreWith` maps it.
 *
 * ⚠ THE PHOTOGRAPH STILL NAMES THREE PEOPLE, which is `hostsPeople` in
 * wonder-media.ts and is not a contradiction: those three are named as who
 * is IN THAT FRAME, not as who will meet a visitor. If the client's team
 * photo replaces it (see `hostsSlot`), that index has to be re-made against
 * the new frame or dropped — it is positional.
 */
export const whoYouAreWith = {
  title: "Who you are with",
  body: [
    "You will be hosted by the Traditional Custodians of this Country and the Iningai Rangers who care for and work on Country.",
    "The people with you may change from visit to visit, but you will always be spending time with people who know this Country, work on it and have a connection to the stories and places they share with you.",
  ],
  image: "Suzanne talking with a small group out on Country.",
  /** The organisation's own line. It is on the logo and three pages carry it. */
  tagline:
    "Ancient traditions walking together with contemporary visions. It is on our logo, and it is also just how the work gets done out here.",
} as const;

/**
 * Editorially curated on the page, dynamic in the CMS. The draft's note:
 * three most recent posts carrying #lore, #country or #guesting, with the
 * first slot pinnable and a fall-back to most recent overall.
 *
 * Hard-coded here because the CMS does not exist yet and these three are the
 * ones the draft names. When Resources becomes a real collection, replace this
 * with a query and keep the pinning rule.
 */
export const wonderStories = {
  title: "Stories from out here",
  href: "/the-record?tag=lore",
  lede: "Pulled from the Resources collection, tagged #lore, #country and #guesting.",
  cmsNote:
    "Dynamic — three most recent posts from Resources carrying #lore, #country or #guesting. Editor can pin a post to the first slot. Falls back to most recent overall if fewer than three are tagged.",
  /** hi-fi — the card link label is the frame's (2033:7043); the draft
      carries no label for it. */
  cta: "Explore experiences",
  items: [
    {
      tag: "#lore",
      title: "Wattanuri and the sisters he followed",
      summary:
        "Ten clusters of engravings run south to north along the wall. Read in that order, they tell the Seven Sisters.",
      href: "/the-record/wattanuri-and-the-ones-he-followed",
    },
    {
      tag: "#country",
      title: "A season of bush foods",
      summary:
        "What comes on when, across the year, and the country each one grows out of.",
      href: "/the-record/a-season-of-bush-foods",
    },
    {
      tag: "#guesting",
      title: "Bringing a spring back",
      summary:
        "A thousand litres twice a day through drought, until it held on its own.",
      href: "/the-record/bringing-a-spring-back",
    },
  ],
} as const;

export const wonderClose = {
  eyebrow: "Take it with you",
  title: "Come and see it",
  body: "Dates move with the seasons and with the people hosting you, so we arrange them with you directly rather than off a list.",
  download: "Download the brochure to share, print, or read offline.",
  facts: [
    "120km north of Barcaldine",
    "Half-day to multi-day",
    "Camping, small groups",
    "Best May to September",
  ],
  /** R13's cost half, answered on the page itself. */
  note: "No fixed dates and no pricing on this page — every stay is arranged with you.",
  /** Carried so it is not lost. Not a build item yet. */
  futureNote: "FUTURE — reviews from groups who have already been.",
} as const;

/**
 * "Before you come" — the evergreen band the hi-fi adds between the stay
 * stages and Where you sleep (Figma 2033:6742, `01 · Wonder · HI-FI`).
 *
 * ⚠ HI-FI COPY, NOT DRAFT COPY. The v3 draft has no section of this name; the
 * body below is what Marc set in the frame, and its facts are the hero facts
 * restated. The frame's four fact cells still carry placeholder text copied
 * from the hero (LOCATION and STAY both read "Turraburra, 120km…"), so the
 * cells are filled from `wonderHero.facts` and `turraburra` here rather than
 * from the frame. Put to the copy review with the rest of the hi-fi.
 */
export const beforeYouCome = {
  eyebrow: "Before you come",
  title: "Small groups. Swags. A long way from town.",
  facts: [
    { label: "Location", value: "Turraburra, 120km north of Barcaldine" },
    { label: "Property", value: "8,870 hectares, renamed Turraburra in 2020" },
    {
      label: "Stay",
      value: "Camping — swag or tent, shared meals, fire at night",
    },
    {
      label: "Dates",
      value: "Arranged with you. May to September is the comfortable stretch.",
    },
  ],
  body: [
    "Turraburra sits 120km north of Barcaldine in Central Western Queensland, 8,870 hectares of it. You will camp — swag or tent, meals shared, fire at night. Groups stay small on purpose, so it stays quiet.",
    "Dates move with the seasons and with the people hosting you, so they are arranged with you directly rather than picked off a list. Tell us who is coming and roughly when, and we will find the right time.",
  ],
  action: { label: "Register your interest", href: "/connect" },
} as const;
