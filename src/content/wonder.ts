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
  standfirst:
    "A few days on Turraburra with the Traditional Custodians of this Country. You are welcome here, and you will be looked after.",
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

export const gettingHere = {
  title: "Getting here is part of it",
  body: [
    "From Barcaldine it is 120 kilometres north and the last stretch is dirt. Nobody arrives here by accident, and that is half the reason it is still what it is.",
    "Aramac is the last town, 67 kilometres up the road, with a large white bull standing in the main street. In 1870 Harry Redford lifted a thousand head of cattle off Bowen Downs and walked them to South Australia. He sold a white bull along the way to buy supplies, which is how they caught him. The jury acquitted him anyway.",
  ],
  stops: [
    {
      name: "Lake Dunn",
      detail:
        "Pajingo Bola, Big Fella Waterhole. The only wetland in Central West Queensland.",
    },
    {
      name: "Lake Dunn Sculpture Trail",
      detail:
        "A 200km loop out of Aramac, forty-plus sculptures built from scrap off local tips.",
    },
    { name: "Horsetailer's Gorge", detail: "And the Healing Circle." },
    { name: "Gray Rock", detail: "Keep this one in mind." },
  ],
  coda: "There are figures carved at Gray Rock that were almost certainly cut by the same hand as the figures on our wall, and in the story, Wattanuri comes from Gray Rock. You will drive past one end of it to reach the other.",
} as const;

export const turraburra = {
  title: "Turraburra",
  /**
   * ⚠ CR10 — applied 7 Sep on August's ruling. "bought back for our people"
   * now reads "bought back for the Iningai people". Two things this does NOT
   * do: it does not adopt Steve's "Innigai" — every draft and every file here
   * says "Iningai", R18 is still open, and it is the name of a nation; and it
   * does not touch "we renamed it", which is YACHATDAC describing its own act
   * rather than speaking of Iningai people in the first person.
   * D16 (the terminology sheet) still owes the standing ruling.
   */
  body: "The property was called Gracevale for most of a century. It was bought back for the Iningai people in April 2019, and on 1 October 2020 we renamed it Turraburra, after the Terraburra clan recorded on this Country in an 1884 map. It runs to 8,870 hectares.",
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
    title: "Arriving",
    body: [
      "You get in, meet whoever is here, and set up camp. Swag or tent, and the fire going by dark.",
    ],
    images: ["Pitching a tent.", "Morning talk around the table by the water."],
  },
  {
    title: "The first night",
    body: [
      "There is no town glow out this way. When the fire burns down, the sky comes all the way to the ground. That is when the stories get told, by the people they belong to.",
      "The Seven Sisters are up there, and they are carved into the wall you will walk in the morning. Same story, told twice, tens of thousands of years apart.",
    ],
    images: ["Guests around the fire at dusk."],
  },
  {
    title: "Walking out to the wall",
    body: [
      "Marra Wonga means place of many stories. We walk out through the woodland and come up under 160 metres of sandstone.",
    ],
    points: [
      "Fifteen thousand markings — tracks, stars, grooves and drilled holes",
      "A snake eleven metres long, and human feet with six toes",
      "Ten clusters running south to north, telling one story in sequence",
      "Never scientifically dated",
    ],
    images: [
      "Walking through woodland toward the escarpment.",
      "Walking along beneath the overhang.",
    ],
    coda: "We tell you what we are able to tell.",
  },
  {
    title: "Older than the wall",
    body: [
      "This Country was the floor of an inland sea. Creatures stood in the mud at the edge of it and the prints set. They are still here, along with petrified trees and what one visiting specialist thinks may be dinosaur eggs.",
    ],
    images: ["Fossil footprints preserved in rock."],
    coda: "Footprints set in what was once the mud of a shoreline.",
  },
  {
    title: "Out for food",
    body: [
      "The country that looked empty on the drive in is full of food. Herbs, fruits, seeds, nuts. First Peoples have eaten off this Country for tens of thousands of years and it is all still here.",
    ],
    images: ["Suzanne showing a plant to guests.", "Harvesting in the scrub."],
    coda: "You learn what to look at, and then you keep seeing it.",
  },
  {
    title: "Hands in the work",
    body: [
      "We do not run a set itinerary, because the work does not. Rain the night before and the morning goes to fire-stick farming while the ground is right. Seed on the grasses and we will be out collecting it. You join whatever is already happening, which is why no two groups get the same days and why nothing you see was put on for you.",
      "One of our springs had been trampled flat by a hundred years of stock. We cleaned it out, planted grasses, and carted a thousand litres to it twice a day through drought. Eight days in it held a puddle. Next morning there was a koala standing at it.",
    ],
    images: ["Standing at a spring in open country."],
    coda: "If you want to put your hands in, you are welcome to. Most people end up wanting to.",
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

export const whereYouSleep = {
  title: "Where you sleep",
  body: "Camping. Swag or tent, meals shared, fire at night. Cabins and a lodge are planned for later, but this is what it is now, and most people who come out here want it this way.",
  images: ["A tent going up at camp.", "Camp at dusk."],
} as const;

export const whatItIsLike = {
  title: "What it is like out here",
  points: [
    "Red dirt, spinifex, and kangaroos on the track at dusk.",
    "Hot days. Winter nights get close to freezing.",
    "May to September is the comfortable stretch.",
    "Phone service drops out and does not come back until you head home.",
    "Distances between anything are long. Fuel up in Aramac.",
  ],
  image: "Standing on top of the escarpment looking out over woodland.",
} as const;

export const whoYouAreWith = {
  title: "Who you are with",
  body: "Suzanne Thompson, Graham Ambridge and the Iningai Rangers host every group ourselves. This is the same Country we work every week, so you are with us the whole time rather than handed to a guide.",
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
