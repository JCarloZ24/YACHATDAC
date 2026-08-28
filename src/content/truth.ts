/**
 * Truth — the descent.
 *
 * Source of truth: docs/content/drafts/truth/YACHATDAC-Truth-Copy-v3.md
 * (decision D5). The prototype this was converted from is titled "The Truth —
 * descending", and that is the page's whole structure: it runs backwards, from
 * what is being built next down to a seabed a hundred million years old.
 *
 * ⚠ THIS PAGE IS HELD BY COMMUNITY. The content status board tags it so, and
 * the draft says it on its own face. Suzanne Thompson's approval is required
 * and both of her open questions are unanswered — see `suzanne` below and
 * risk R5.
 *
 * ⚠ Do not apply terminology changes to the quotations. CR4 ("settlers" →
 * "colonists") and CR10 (the word "our") both land inside Suzanne's recorded
 * speech in the 1902 section. Both are held pending D15. The reasoning is in
 * docs/change-requests.md and the mechanics are in components/ui/PullQuote.
 *
 * ⚠ The old `src/content/page-specs.ts` entry for Truth described a section
 * stack — What's Been Researched, Open Research Opportunities, the Precinct,
 * Partner with Us. All four are still here, but as entries inside a chronology
 * rather than as top-level sections, which is why the anchors sit on entries
 * rather than on bands. That file is deleted as of this build.
 */

import type { Tone } from "@/lib/tone";

export const truthHero = {
  eyebrow: "The Truth",
  title: "Most people have never heard of the Iningai.",
  standfirst: "This is what happened here, told by the people it happened to.",
  actions: [
    /** The beginning is the bottom of the page. The page descends. */
    { label: "Start from the beginning", href: "#beginning" },
    { label: "Research & partnerships", href: "#research" },
  ],
} as const;

/**
 * The rail label that recurs down the page. It is not a date, and that is the
 * point of it: everything else on the rail is a moment, and Lore is the thing
 * that does not stop for any of them.
 */
export const loreMarker = "Lore — continuous";

/** Where a claim comes from. The draft labels every entry with one. */
export type TruthSource = "Written record" | "Living memory" | "Science";

export type TruthEntry = {
  /** Anchor, where something links to this entry specifically. */
  id?: string;
  /** The rail label — "Within five years", "Now", "2:30pm, 30 April 2019". */
  when: string;
  title: string;
  /** Where the title links, where the draft makes it a link. */
  href?: string;
  body: string[];
  /**
   * The line the draft sets apart under the body — the "and here is why that
   * matters" beat. It is the connective tissue of the whole descent: each one
   * explains why the thing below it had to happen first.
   */
  coda?: string;
  image?: string;
  caption?: string;
  source?: TruthSource;
  cta?: { label: string; href: string };
  /** Extra emphasis line, set large. Used once, on the engraving entry. */
  claim?: string;
  /** Footnote-weight material — citations, dating caveats. */
  footnotes?: readonly string[];
};

export type TruthEra = {
  id?: string;
  /** The era band's own rail label. */
  marker: string;
  title: string;
  tone: Tone;
  /** Render the Lore rail label above this era. */
  lore?: boolean;
  entries: readonly TruthEntry[];
};

/**
 * Everything above the 1902 section.
 *
 * Ordered as the page reads: newest first, descending. Do not sort this.
 */
export const erasBefore: readonly TruthEra[] = [
  {
    id: "research",
    marker: "Ahead",
    title: "What is being built",
    tone: "evergreen",
    lore: true,
    entries: [
      {
        id: "precinct",
        when: "Within five years",
        title: "The Cultural Knowledge Precinct",
        href: "/resources/cultural-knowledge-precinct",
        body: [
          "Exhibitions, teaching, research accommodation and a place for community to gather, in one place at Turraburra. Master planning is underway.",
        ],
        image:
          "Architectural render of the Cultural Knowledge Precinct, a curved timber lattice canopy over an open gathering space, with visitors walking on red earth.",
        caption: "Concept render of the Cultural Knowledge Precinct.",
        coda: "It is being built because there is something here worth building it for.",
        source: "Written record",
        cta: { label: "Talk to us about being part of it", href: "#partner" },
      },
      {
        id: "partner",
        when: "Work with us",
        title: "Partnerships",
        body: [
          "A researcher on Country is a guest on Country. Partnerships here are expected to give something back to the land and the people.",
        ],
        cta: { label: "Partner with us", href: "/connect" },
      },
    ],
  },
  {
    id: "researched",
    marker: "Today",
    title: "The work going on",
    tone: "canvas",
    entries: [
      {
        when: "Now",
        /**
         * ⚠ CR3 — applied everywhere else. This title and href are
         * deliberately still "right-way fire" — renaming them would rename
         * the linked article and, with it, the route below. That is an IA
         * change, not a copy change, and is raised separately as D17, still
         * open. Left as drafted until D17 is answered.
         */
        title: "Right-way fire, springs, and two flux towers",
        href: "/resources/right-way-fire-and-the-carbon-in-the-soil",
        body: [
          "The Iningai Rangers burn, fence, collect seed and bring springs back. Two towers measure what that does to the carbon in the soil — one on Country managed this way, one on grazed land, checked against each other.",
        ],
        coda: "They can do this work because, seven years ago, this stopped being someone else's station.",
        image: "People at work — fire-stick farming, seed collecting, or the flux tower.",
        source: "Living memory",
        cta: {
          label: "What the towers are showing",
          href: "/resources/right-way-fire-and-the-carbon-in-the-soil",
        },
      },
      {
        when: "2022",
        title: "The site is studied with its owners",
        href: "/resources/fifteen-thousand-markings-read-in-order",
        body: [
          "A two-year study documents Marra Wonga from both archaeological and Iningai perspectives, with Iningai community members as research partners rather than subjects. Ten clusters of engravings, read south to north, tell the Seven Sisters in sequence.",
        ],
        coda: "Iningai people could be partners in that research because, by then, there were Iningai people the researchers had to ask.",
        image: "Evidence — the shelter wall, engravings visible.",
        source: "Science",
        cta: {
          label: "Read the findings",
          href: "/resources/fifteen-thousand-markings-read-in-order",
        },
      },
      {
        when: "More of this",
        title: "Research & discovery",
        body: [
          "The bore, the recorders, the flux towers, the plants under study. What has been found on Turraburra so far, and how it was found.",
        ],
        cta: {
          label: "Explore our discoveries",
          href: "/resources#research-and-discovery",
        },
      },
    ],
  },
  {
    marker: "2026 back to 2003",
    title: "Bought back",
    tone: "roasted",
    lore: true,
    entries: [
      {
        when: "12:15pm, Friday 26 June 2026",
        title: "The deed of grant",
        href: "/resources/it-nearly-didnt-happen",
        body: [
          "Turraburra is signed over outright. No longer held on our behalf, no longer shackled to anyone else's conditions.",
        ],
        image:
          "Two people at a table on a timber deck, each at a laptop, a dog asleep beside them.",
        caption:
          "Signing at 12:15pm. Suzanne had finished telling the story of the buyback minutes earlier, then opened the laptop.",
        coda: "Owning it outright is not the same as getting it back. Getting it back took seven years longer, and nearly did not happen at all.",
        source: "Written record",
        cta: {
          label: "Suzanne's account of how it happened",
          href: "/resources/it-nearly-didnt-happen",
        },
      },
      {
        when: "1 October 2020",
        title: "Gracevale becomes Turraburra",
        body: [
          "The station is renamed and officially launched as Turraburra, after the Terraburra clan recorded on this Country in an 1884 map.",
        ],
        coda: "The name went back before the deed did.",
        source: "Written record",
      },
      {
        when: "2:30pm, 30 April 2019",
        title: "And then it was just us",
        href: "/resources/it-nearly-didnt-happen",
        body: [
          "The Indigenous Land and Sea Corporation had purchased the property and leased it to YACHATDAC eleven days earlier. Now the owner drove off it. There was no furniture in the house, so everyone slept on the floor. That first night Mark told them to be quiet and listen.",
        ],
        coda: "It had to be bought incognito. Once anyone knew who the money was really for, the price would have gone up.",
        source: "Living memory",
        cta: {
          label: "Read what it took",
          href: "/resources/it-nearly-didnt-happen",
        },
      },
      {
        when: "2003",
        title: "Suzanne's father",
        href: "/resources/it-nearly-didnt-happen",
        body: [
          "He spent his life fencing and protecting the sites out here, and holding two families together with photographs and envelopes and names. When she came back after he died, nothing had been done since.",
        ],
        coda: "He was carrying on his own father's work, and his grandfather's. The relationships that kept this Country reachable were held by people who never owned an acre of it.",
        source: "Living memory",
        cta: {
          label: "My father's dream",
          href: "/resources/it-nearly-didnt-happen",
        },
      },
    ],
  },
  {
    marker: "1950s",
    title: "Admired under the wrong name",
    tone: "charcoal",
    entries: [
      {
        when: "1950s",
        title: "They called it The Art Gallery",
        href: "/resources/when-they-called-it-the-art-gallery",
        body: [
          "By the 1950s the escarpment has a name given to it by visitors, and it is not an Iningai one. The site is written up, photographed and admired under that name for decades.",
        ],
        coda: "Nobody corrected them, because by then there was almost nobody left to do it.",
        image: "Document — archival 1950s write-up of the site.",
        source: "Written record",
        cta: {
          label: "Who named it, and what it was called before",
          href: "/resources/when-they-called-it-the-art-gallery",
        },
      },
    ],
  },
];

/**
 * The 1902 section — Suzanne Thompson's own account.
 *
 * ⚠ EVERY WORD OF THIS IS HERS, awaiting her approval. The draft's own header
 * on this section: "Draft — Suzanne's words, awaiting her approval. Taken from
 * the Unfinished Business and Yacadak Framework recordings and lightly edited
 * for reading. Nothing here is published until she has seen it and signed it
 * off."
 *
 * That warning renders on the page. It is the single most important editorial
 * marker on this site and it does not get quietly dropped because the section
 * looks finished.
 *
 * Her two open questions are in `checkNote` and are also rendered. Neither has
 * been answered.
 */
export const suzanne = {
  marker: "1902, and then further back",
  draftWarning:
    "Draft — Suzanne's words, awaiting her approval. Taken from the Unfinished Business and Yacadak Framework recordings and lightly edited for reading. Nothing here is published until she has seen it and signed it off.",
  title: "By 1902 there were thirty-seven.",
  image: "Portrait — Suzanne.",
  attribution: "Suzanne Thompson",
  role: "Iningai custodian · Founder and Managing Director, YACHATDAC",
  openingQuote: "And I'm a descendant of one of those 37.",
  lede: "To understand that number you have to go back sixteen years, to a drought, and to a decision made out of concern.",
  figures: [
    {
      year: "1902",
      detail: "37 Iningai adults recorded in the area, and three children.",
    },
    {
      year: "1886",
      detail:
        "7,500 blankets calculated as necessary for the Iningai nation, sixteen years earlier. When they arrived, some still had to be cut in half, because there were not enough to go round.",
    },
  ],
  citation: {
    text: "Population figures recorded in Hoch (1986), cited in Taçon et al., Australian Archaeology, 2022.",
    href: "https://www.tandfonline.com/doi/full/10.1080/03122417.2022.2084666",
  },
  /**
   * ⚠ QUOTATIONS. CR4 wants "settlers" replaced here. CR10 wants "our people"
   * replaced here. Both HELD pending D15 — see R17. Do not edit these strings.
   */
  quotes: [
    "In 1886 the settlers had all come, and they'd established about 150 property landholdings. It was a great drought, and they were really concerned about the poor condition of the natives. Winter was coming. They were worried, because our people were off their lands and couldn't hunt, and had no access to their country or their foods.",
    "So they decided we needed blankets.",
  ],
  afterQuotes:
    "What was written in the history books afterwards is that we did not exist, that we had no rights, that we had been wiped out. Up until seven years ago, by the government's account, Iningai people did not exist at all.",
  standingQuote: "Well — we're still here.",
  closing: [
    "Our ancestors were dispossessed and massacred in a way that meant we never got to complete the proper cultural ceremony for that grieving. Another belief arrived and said it is done this way now. That is unfinished business. There are massacre sites out here. We know where they are.",
    "My great-great-great grandmother Polly. My great-great-great grandfather Billy. That is how I know where to hunt, and which springs to visit, and why my family is still on this Country.",
  ],
  checkNote:
    "For Suzanne to check — Every line above is yours, edited only for reading, and re-ordered so the count comes before the blankets. Two things to confirm: whether that reversal is right, and the number. Your recording says thirty-five; the published figure is thirty-seven adults and three children (Hoch 1986, cited in Taçon et al. 2022). We have used thirty-seven. Change it back if yours is the one that stands.",
  buildNote:
    "The descent stops here. No rail, no markers, nothing else on screen, and no way past it. It resumes below, older.",
} as const;

/** Everything below the 1902 section. Still descending. */
export const erasAfter: readonly TruthEra[] = [
  {
    marker: "1840s",
    title: "Before the runs were taken up",
    tone: "roasted",
    lore: true,
    entries: [
      {
        when: "1840s",
        title: "What Mitchell recorded",
        href: "/resources/what-mitchell-wrote-down",
        body: [
          "The explorer Thomas Mitchell passes through and describes the Iningai — including huts built solidly enough to carry bark tiles on the roof.",
        ],
        coda: "The first written account of the people here was written by someone who had just arrived. Everyone who could have written it earlier had no reason to.",
        image: "Document — a scan of the journal page, not a photograph.",
        source: "Written record",
        cta: {
          label: "Read the passage, and what it proves",
          href: "/resources/what-mitchell-wrote-down",
        },
      },
    ],
  },
  {
    marker: "Older than the record",
    title: "Cut into the wall",
    tone: "canvas",
    entries: [
      {
        when: "Older than 5,000 years, and nobody knows how much older",
        title: "The engraving starts",
        href: "/resources/fifteen-thousand-markings-read-in-order",
        body: [
          "Over 15,000 petroglyphs and 111 stencils accumulate along 160 metres of shelter wall — animal tracks, lines, grooves, drilled holes, and human feet with six toes. The Iningai name for the place is Marra Wonga. It means place of many stories.",
          "Ten clusters of designs run south to north. They were made at different times. Read in that order, they tell the Seven Sisters — the sisters pursued, the boomerangs thrown, the Rainbow Serpent, the dingo watching over the one who stayed on Earth.",
          "The sisters are the Pleiades. Their story is told in more than eighty places across this continent, and in cultures on the other side of the world.",
          "Some of it is common knowledge. Some is women's and some is men's. What is written here is the part that is told away from Country.",
        ],
        claim:
          "No other rock art site is known anywhere in the world where a story runs across the whole site. Researchers have looked.",
        coda: "People were marking this wall for thousands of years before anyone arrived to write a word about them.",
        source: "Science",
        /**
         * ⚠ R2. The site has never been scientifically dated. The wasp nests
         * are a method that COULD give minimum ages if anyone sampled them —
         * not a dating that happened. An earlier draft claimed 55,000 years
         * and that claim is withdrawn. Do not reinstate a figure without the
         * 2022 paper open.
         */
        footnotes: [
          "The site has never been scientifically dated. The pecked designs are likely more than 5,000 years old on regional style sequences; mud wasp nests over some engravings could give minimum ages if they are ever sampled.",
        ],
        cta: {
          label: "What the study found, and how",
          href: "/resources/fifteen-thousand-markings-read-in-order",
        },
      },
      {
        id: "opportunities",
        when: "Still to be found",
        title: "Open research",
        body: [
          "Most of this Country has never been studied. We are looking for researchers in palaeontology and archaeology, ecology and biodiversity, and medicinal botany.",
        ],
        cta: {
          label: "Explore research opportunities",
          href: "/partnerships#research-opportunities",
        },
      },
    ],
  },
  {
    id: "beginning",
    marker: "Before people · about 100 million years ago",
    title: "All of this was under water",
    tone: "midnight",
    entries: [
      {
        when: "The Eromanga Sea",
        title: "The seabed that became the escarpment",
        body: [
          "The Eromanga Sea covers most of inland Queensland. Sediment settles on its floor, hardens, and becomes the sandstone of the escarpment. The wall they marked was already the oldest thing here.",
          "Creatures stand in the mud at the edge of it, where the mangroves would have been, and the prints set. They are still here. So are petrified trees, and what one visiting specialist thinks may be dinosaur eggs. The soil profiles match Winton, where the dinosaurs were found.",
        ],
        coda: "Almost none of it has been studied.",
        cta: {
          label: "How the seabed became the escarpment",
          href: "/resources/you-are-standing-on-a-seabed",
        },
      },
    ],
  },
];

/** The published paper the 2022 study became. Cited at the foot of the page. */
export const publication = {
  title:
    "Marra Wonga: Archaeological and contemporary First Nations interpretations of one of central Queensland's largest rock art sites",
  journal: "Australian Archaeology, 2022",
  href: "https://www.tandfonline.com/doi/full/10.1080/03122417.2022.2084666",
} as const;
