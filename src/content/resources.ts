/**
 * Resources — "The Record".
 *
 * Source of truth:
 * docs/content/drafts/resources/YACHATDAC-Resources-Copy-v1.md (D5).
 *
 * ⚠ NAMING. Every v3 page calls this hub **The Record**. The repo, the sitemap
 * and decision **D1** call it **Resources**. Same route, different word. D1 is
 * Final and says Resources, so the route and the nav label stay `Resources`
 * and "The Record" is used as the page's own title — which is what the drafts
 * actually do when they link to it. Do not rename the route without reopening
 * D1.
 *
 * ⚠ NONE OF THESE ARTICLES EXIST. The thirteen items below are the record's
 * index; their bodies have not been written. src/app/resources/[slug] renders
 * each one's title and summary above a marked "not written yet" panel rather
 * than 404ing, because a dead link reads as a bug and inventing the article
 * would put words in the client's mouth.
 *
 * ⚠ This list is CMS content in waiting. Build documentation §8 makes
 * Resources a filterable collection; the browser in
 * components/resources/RecordBrowser.tsx filters this array today and should
 * filter a query tomorrow. Do not build anything that assumes these are
 * compile-time constants.
 */

/**
 * The draft's filter vocabulary. Both selects are closed sets.
 *
 * **D21 — Final (26 Aug).** Two facet axes, type and source, are adopted as the
 * draft has them: `source` is already carried on every item below. The draft's
 * five types are kept, and **Event** and **Update** are added back because the
 * settled position is "no separate Events page — Event is a content type inside
 * Resources", and dropping the type left events with nowhere to live. Neither
 * has a published entry yet; they exist so the first one has a home rather than
 * forcing a schema change later.
 *
 * **Activity** is deliberately not re-added. Nothing in any draft distinguishes
 * it from Event, and a filter facet nobody can tell apart from its neighbour is
 * worse than one fewer facet.
 */
export const recordTypes = [
  "Story",
  "Historical account",
  "Research",
  "Documentation",
  "Recording",
  "Event",
  "Update",
] as const;

export const recordSources = [
  "Iningai knowledge",
  "Colonial record",
  "Published research",
] as const;

export type RecordType = (typeof recordTypes)[number];
export type RecordSource = (typeof recordSources)[number];

export type RecordItem = {
  slug: string;
  type: RecordType;
  /**
   * Where the material comes from. This is not a formatting label — "Colonial
   * record" against a Mitchell journal entry and "Iningai knowledge" against
   * Suzanne's account are a statement about whose account it is, and the
   * filter exists so a reader can hold the two apart.
   */
  source: RecordSource;
  title: string;
  summary: string;
  /** The subject line under each card in the draft. */
  subjects: readonly string[];
  /**
   * Hashtags used for the curated rails on other pages — Wonder pulls #lore,
   * #country and #guesting. Distinct from `subjects`, which are editorial.
   */
  tags?: readonly string[];
  /** Art direction for the card thumbnail, where the draft gives a slot. */
  image?: string;
};

export const recordItems: readonly RecordItem[] = [
  {
    slug: "it-nearly-didnt-happen",
    type: "Story",
    source: "Iningai knowledge",
    title: "It nearly didn't happen",
    summary:
      "Suzanne Thompson on getting Turraburra back — the phone call on the road, the incognito purchase, and the night they slept on the floor.",
    subjects: ["The buyback"],
    image: "Story thumbnail — the buyback.",
  },
  {
    slug: "wattanuri-and-the-ones-he-followed",
    type: "Story",
    source: "Iningai knowledge",
    title: "Wattanuri, and the sisters he followed",
    summary:
      "Ten clusters of engravings run south to north along the wall. Read in that order they tell the Seven Sisters.",
    subjects: ["Seven Sisters", "Marra Wonga"],
    tags: ["lore"],
    image: "Story thumbnail — the engraved wall.",
  },
  {
    slug: "bringing-a-spring-back",
    type: "Story",
    source: "Iningai knowledge",
    title: "Bringing a spring back",
    summary:
      "A thousand litres carted twice a day through drought, until it held on its own. Eight days, then a koala.",
    subjects: ["Water & springs", "Rangers"],
    tags: ["guesting"],
    image: "Story thumbnail — a spring in open country.",
  },
  {
    slug: "you-are-standing-on-a-seabed",
    type: "Story",
    source: "Published research",
    title: "You are standing on a seabed",
    summary:
      "The Eromanga Sea covered inland Queensland. The escarpment is its floor, and the footprints set in the mud are still here.",
    subjects: ["Deep time & fossils"],
    image: "Story thumbnail — fossil footprints in rock.",
  },
  {
    slug: "a-day-with-the-rangers",
    type: "Story",
    source: "Iningai knowledge",
    title: "A day with the Rangers",
    summary:
      "Fire workshops, fencing, seed, machinery. Two days are never the same.",
    subjects: ["Rangers", "Fire"],
    tags: ["country"],
    image: "Story thumbnail — Rangers at work.",
  },
  {
    slug: "what-mitchell-wrote-down",
    type: "Historical account",
    source: "Colonial record",
    title: "What Mitchell wrote down",
    summary:
      "The explorer passed through in the 1840s and described huts built solidly enough to carry bark tiles. The first written account of the people here was written by a stranger.",
    subjects: ["First contact & the frontier"],
  },
  {
    slug: "when-they-called-it-the-art-gallery",
    type: "Historical account",
    source: "Colonial record",
    title: "When they called it The Art Gallery",
    summary:
      "By the 1950s the escarpment had a name given to it by visitors. It was written up and admired under that name for decades.",
    subjects: ["Marra Wonga", "First contact & the frontier"],
    image: "Archival thumbnail — a 1950s write-up of the site.",
  },
  {
    slug: "gracevale-becomes-turraburra",
    type: "Historical account",
    source: "Colonial record",
    title: "Gracevale becomes Turraburra",
    summary:
      "Bought back in April 2019, renamed on 1 October 2020 after the Terraburra clan recorded on this Country in an 1884 map.",
    subjects: ["The buyback"],
    image: "Archival thumbnail — the station sign.",
  },
  {
    slug: "fifteen-thousand-markings-read-in-order",
    type: "Research",
    source: "Published research",
    title: "Fifteen thousand markings, read in order",
    summary:
      "Our account of the two-year study of Marra Wonga, documented with Iningai people as research partners.",
    subjects: ["Marra Wonga", "Seven Sisters"],
    tags: ["lore"],
    image: "Research thumbnail — the shelter wall.",
  },
  {
    slug: "right-way-fire-and-the-carbon-in-the-soil",
    type: "Research",
    source: "Iningai knowledge",
    /**
     * ⚠ CR3 renames the term "right-way fire" to "fire-stick farming" site
     * wide, which would rename this article and, with it, the slug. That is an
     * IA change rather than a copy change and it is raised as **D17**. Two
     * pages link to this exact route. Change the title and the slug together
     * or not at all.
     */
    title: "Right-way fire and the carbon in the soil",
    summary:
      "Two flux towers, one on Country managed our way and one on grazed land, read against each other for more than a year.",
    subjects: ["Fire", "Carbon & climate"],
    image: "Research thumbnail — a flux tower.",
  },
  {
    slug: "a-season-of-bush-foods",
    type: "Documentation",
    source: "Iningai knowledge",
    title: "A season of bush foods",
    summary:
      "What comes on when, across the year, and the Country each one grows out of.",
    subjects: ["Bush foods"],
    tags: ["country"],
    image: "Documentation thumbnail — bush foods in season.",
  },
  {
    slug: "pollen-at-sixty-metres",
    type: "Documentation",
    source: "Published research",
    title: "Pollen at sixty metres",
    summary:
      "A 480-metre bore kept a soil sample every six metres. Sixty metres down, there was pollen. Samples held with QUT.",
    subjects: ["Deep time & fossils"],
  },
  {
    slug: "what-the-recorders-hear-at-night",
    type: "Recording",
    source: "Iningai knowledge",
    title: "What the recorders hear at night",
    summary:
      "Four acoustic recorders listen across the property, two of them at the springs. Frogs, birds at first light, and a good deal not yet identified.",
    subjects: ["Animals & birds"],
    image: "Recording thumbnail — an acoustic recorder at the springs.",
  },
];

/**
 * Slugs linked from other pages that are not items in the record.
 *
 * Truth links `/resources/cultural-knowledge-precinct` from its Precinct
 * entry. It is not in the index above, so it is listed here to keep the
 * article route from 404ing on a link the drafts actually ship.
 */
export const extraArticleSlugs = [
  {
    slug: "cultural-knowledge-precinct",
    title: "The Cultural Knowledge Precinct",
    summary:
      "Exhibitions, teaching, research accommodation and a place for community to gather, in one place at Turraburra. Master planning is underway.",
  },
] as const;

export const recordHero = {
  eyebrow: "The Record",
  title: "What is known about this Country",
  standfirst:
    "Stories, historical accounts, research and recordings from Turraburra. Some of it is science, some of it is memory. All of it comes from this Country.",
} as const;

export const browserCopy = {
  title: "Everything in the record",
  searchLabel: "Search the record",
  typeLabel: "All types",
  sourceLabel: "All sources",
  sortLabel: "Sort",
  clearLabel: "Clear",
  empty:
    "Nothing here yet under that. Try another subject, or ask us what exists.",
  /**
   * D25 — Final (26 Aug). "Ask us what exists" shipped as unlinked text, which
   * turns the only empty state on the site that offers a conversation into a
   * dead one. It points at the "Do you hold something?" block further down this
   * same page rather than at /connect: that block is already the inbound-
   * contribution route, and keeping the reader on the page they are searching
   * beats sending them to a contact page that has no form (R9).
   */
  emptyCta: { label: "Ask us what exists", href: "#do-you-hold-something" },
} as const;

/**
 * "What we do not know". The most useful section on the page for a researcher,
 * and the reason the record is kept at all.
 */
export const knowledgeGaps = {
  title: "What we do not know",
  lede: "Most of this Country has never been studied. These are the gaps we would like filled, and the reason we keep the record in the first place.",
  gaps: [
    {
      question: "How old is the wall?",
      detail:
        "Marra Wonga has never been scientifically dated. Mud wasp nests over some engravings could give minimum ages if anyone samples them.",
    },
    {
      question: "What lives here?",
      detail:
        "Four recorders are logging species and a good deal of it is unidentified. There is no full list of what is on this property.",
    },
    {
      question: "What is in the ground?",
      detail:
        "Fossil footprints, petrified trees, and what one visiting specialist thought might be dinosaur eggs. Almost none of it examined.",
    },
    {
      question: "What does right-way fire actually do?",
      detail:
        "Two flux towers are measuring it. More work is welcome, particularly on soil carbon at depth.",
    },
  ],
  cta: { label: "Research with us", href: "/partnerships#research-opportunities" },
} as const;

export type RecordDocument = {
  title: string;
  summary: string;
  meta: string;
  /** Published now, or still being produced. The draft distinguishes them. */
  state: "available" | "in-preparation";
};

/**
 * Documents and reports. The draft heads this "11 items" and then lists
 * eleven, which is why the count below is derived rather than typed.
 *
 * ⚠ Four are marked available for download and there is no PDF in the repo for
 * any of them. They render as titles rather than as links until an asset
 * exists — see the note on the page.
 */
export const documents: readonly RecordDocument[] = [
  {
    title: "Ten Year Strategic Plan",
    summary: "Where the work is going, in two phases. Published in full.",
    meta: "2026–2036 · PDF",
    state: "available",
  },
  {
    title: "Governance",
    summary:
      "Board composition, the Rule Book, Elder Advisory Group terms of reference, and our registration details.",
    meta: "Board · Rule Book · ORIC & ACNC",
    state: "available",
  },
  {
    title: "Research bibliography",
    summary:
      "Every paper written about Turraburra, cited and linked to the publisher.",
    meta: "Updated continuously",
    state: "available",
  },
  {
    title: "Financial statements",
    summary: "Audited accounts, published each year.",
    meta: "Annual · PDF",
    state: "available",
  },
  {
    title: "Annual report",
    summary:
      "What was done, what it cost, what changed. Published every year from here.",
    meta: "First edition in preparation",
    state: "in-preparation",
  },
  {
    title: "Country condition scorecard",
    summary:
      "Condition and trend for each thing we are managing for, and each threat against it.",
    meta: "Annual",
    state: "in-preparation",
  },
  {
    title: "Knowledge needs",
    summary:
      "What we do not know and would like studied. Start here if you are a researcher.",
    meta: "Updated as work progresses",
    state: "in-preparation",
  },
  {
    title: "Working with us — research protocol",
    summary:
      "How work on Turraburra is agreed: consent, access, who holds data, and what the Elder Advisory Group signs off.",
    meta: "For researchers and partners",
    state: "in-preparation",
  },
  {
    title: "Land Management Plan",
    summary: "The plan the Ranger workplans sit under.",
    meta: "Year 2",
    state: "in-preparation",
  },
  {
    title: "Workforce plan",
    summary: "Iningai employment targets and the pathway to them.",
    meta: "Year 1",
    state: "in-preparation",
  },
  {
    title: "Five-Year Review",
    summary:
      "External review, community consultation, and a revised plan. Committed to now.",
    meta: "2031",
    state: "in-preparation",
  },
];

export const onRequest = {
  title: "Items marked “on request”",
  body: [
    "Some material is not published openly — usually because it is raw data held with a research partner, or because it carries cultural detail that is shared with context rather than downloaded.",
    "Requests go to YACHATDAC and, where the material is cultural, to the Elder Advisory Group. Tell us who you are and what you need it for.",
  ],
  /** Unwritten. STATUS note 13 lists this as one of two holes in the page. */
  pending: "Response time and contact point to confirm.",
} as const;

export const recordGrows = {
  eyebrow: "Keeping the record",
  title: "The record grows",
  body: "New material goes up as the work happens — a season of burning, a paper published, a recording nobody has identified yet.",
  signup: {
    label: "Get new material as it lands",
    placeholder: "Your email address",
    cta: "Subscribe",
    note: "A few times a year, when something is added. What went up, and why it matters. No campaigns. We will not pass your address to anyone.",
  },
  contribute: {
    title: "Do you hold something?",
    body: "Plenty of what belongs to this Country sits in other people's sheds, albums and filing cabinets.",
    items: [
      "Photographs of the escarpment or the station, any era",
      "Station records, letters, diaries or maps",
      "Family papers mentioning Iningai people",
      "Old tour brochures, newspaper clippings, survey reports",
    ],
    cta: { label: "Tell us what you have", href: "/connect" },
  },
} as const;
