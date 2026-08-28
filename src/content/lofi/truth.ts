import { STORY_WALL_DATING } from "./fields";

/**
 * Truth — a descending timeline.
 *
 * Source of truth: docs/content/drafts/truth/YACHATDAC-Truth-Timeline-v1.pdf
 * (decision D5). Copy is verbatim.
 *
 * ⚠⚠ GOVERNANCE CIRCLE: **held by community** — the most restricted of the
 * three (build documentation §12: "restricted, sacred"). This page cannot go
 * to build or publish without **Elder Advisory Group endorsement**: "no
 * program involving the sharing of Iningai cultural knowledge, stories, or
 * sacred information will proceed without Elder Advisory Group endorsement."
 *
 * ⛔ SUZANNE THOMPSON'S TESTIMONY IS NOT IN THIS FILE, AND MUST NOT BE.
 * The 1902 / 1886 block sits under a written approval gate stated on the draft
 * itself: "DRAFT — SUZANNE'S WORDS, AWAITING HER APPROVAL … Nothing here is
 * published until she has seen it and signed it off." That covers the count of
 * thirty-five, the descendant line, the blankets and their number, the
 * history-books passage, "we're still here", the massacre sites, and the Polly
 * and Billy line. The hard stop renders structure, scroll behaviour and weight
 * only — see hardStop below.
 *
 * STRUCTURE: the page descends. Newest at the top, deep past at the bottom,
 * with lore framed as the floor underneath rather than the oldest entry.
 * STATUS.md note 5 records this as a stronger structure than the conventional
 * stack in page-specs.ts, which has been updated to match.
 */

/** Evidence type per entry, from the draft's own enum. */
export type Evidence = "Written record" | "Science" | "Living memory";

export type TimelineEntry = {
  id: string;
  /** Section label — "Ahead", "Today", "1950s". */
  eraLabel: string;
  /** Second title line. Several entries have one; 2022 and Wattanuri do not. */
  descriptor?: string;
  /** The date itself, where it differs from the label. */
  eraDetail?: string;
  headline?: string;
  body: string;
  /** The sentence that hands this entry down to the next-older one. */
  consequence: string;
  evidence?: Evidence;
  cta?: string;
  media?: { note: string; held?: string };
};

export const truthIntro = {
  lead: "Most people have never heard of the Iningai.",
  body: "This is what happened here, told by the people it happened to.",
  jump: "Start from the beginning",
  /**
   * The draft's line "On the live page this scrolls the reader to the oldest
   * section, at the bottom" is a build note, not page copy. It is implemented
   * here rather than printed.
   */
  jumpTarget: "#underneath-all-of-it",
} as const;

/** Entries above the hard stop, newest first. */
export const entriesAbove: TimelineEntry[] = [
  {
    id: "ahead",
    eraLabel: "Ahead",
    descriptor: "What is being built",
    eraDetail: "Within five years",
    headline: "The Cultural Knowledge Precinct",
    body: "Exhibitions, teaching, research accommodation and a place for community to gather, in one place at Turraburra. Master planning is underway.",
    consequence:
      "It is being built because there is something here worth building it for.",
    // ⚠ The draft tags a not-yet-existing building "Written record". An
    // evidence tag on a future facility reads as a PDF-extraction artefact.
    // Left as drafted — question for the copy owner, not a design fix.
    evidence: "Written record",
    cta: "Talk to us about being part of it",
  },
  {
    id: "today",
    eraLabel: "Today",
    descriptor: "The work going on",
    eraDetail: "Now",
    headline: "Right-way fire, springs, and two flux towers",
    body: "The Iningai Rangers burn, fence, collect seed and bring springs back. Two towers measure what that does to the carbon in the soil — one on Country managed this way, one on grazed land, checked against each other.",
    consequence:
      "They can do this work because, seven years ago, this stopped being someone else’s station.",
    evidence: "Living memory",
    cta: "What the towers are showing",
    media: { note: "People at work — cool burn, seed collecting or the flux tower" },
  },
  {
    id: "study-2022",
    eraLabel: "2022",
    headline: "The site is studied with its owners",
    body: "A two-year study documents Marra Wonga from both archaeological and Iningai perspectives, with Iningai community members as research partners rather than subjects. Ten clusters of engravings, read south to north, tell the Seven Sisters in sequence.",
    consequence:
      "Iningai people could be partners in that research because, by then, there were Iningai people the researchers had to ask.",
    evidence: "Science",
    cta: "Read the findings",
    media: {
      note: "The shelter wall, engravings visible",
      held:
        "story-wall imagery. permissions.md unresolved — treat as unavailable, build typographically (B5, Y2). The block is on the MATERIAL, not on one page.",
    },
  },
  {
    id: "buyback-2019",
    eraLabel: "2019",
    descriptor: "Bought back",
    headline: "Gracevale becomes Turraburra",
    body: "8,870 hectares are bought for the custodians of the Iningai people through YACHATDAC, with the Indigenous Land and Sea Corporation. The station changes hands, and changes name.",
    consequence:
      "Which raises the question of how it came to be somebody else’s to sell.",
    evidence: "Written record",
    cta: "How the buyback happened",
  },
  {
    id: "art-gallery-1950s",
    eraLabel: "1950s",
    descriptor: "Admired under the wrong name",
    headline: "They called it The Art Gallery",
    body: "By the 1950s the escarpment has a name given to it by visitors, and it is not an Iningai one. The site is written up, photographed and admired under that name for decades.",
    consequence:
      "Nobody corrected them, because by then there was almost nobody left to do it.",
    evidence: "Written record",
    cta: "Who named it, and what it was called before",
    media: { note: "Document — archival: 1950s write-up of the site" },
  },
];

/** Entries below the hard stop, continuing older. */
export const entriesBelow: TimelineEntry[] = [
  {
    id: "mitchell-1840s",
    eraLabel: "1840s",
    descriptor: "Before the runs were taken up",
    headline: "What Mitchell recorded",
    body: "The explorer Thomas Mitchell passes through and describes the Iningai — including huts built solidly enough to carry bark tiles on the roof.",
    consequence:
      "The first written account of the people here was written by someone who had just arrived. Everyone who could have written it earlier had no reason to.",
    evidence: "Written record",
    cta: "Read the passage, and what it proves",
    media: { note: "Document — not a photo: scan of the journal page" },
  },
  {
    id: "engraving",
    eraLabel: "Older than the record",
    descriptor: "Cut into the wall",
    // The draft reads "AT LEAST 5,000 YEARS AGO". Substituted for the content
    // field — see fields.ts and risk R2. The draft flags its own dating as
    // under review, and that note is not page copy.
    eraDetail: `At least ${STORY_WALL_DATING} years ago`,
    headline: "The engraving starts",
    body: "Over 15,000 petroglyphs and 111 stencils accumulate along 160 metres of shelter wall — animal tracks, lines, grooves, drilled holes, and human feet with six toes.",
    consequence:
      "People were marking this wall for thousands of years before anyone arrived to write a word about them.",
    evidence: "Science",
    cta: "What the study found, and how",
  },
  {
    id: "eromanga",
    eraLabel: "Before people",
    descriptor: "All of this was under water",
    eraDetail: "About 100 million years ago",
    headline: "The Eromanga Sea",
    body: "Most of inland Queensland is under water. The sediment settling on its floor becomes the sandstone the shelter is cut from. A seven-metre plant eater walks its shoreline, and will not be found until 1963.",
    consequence:
      "Even the wall they marked was made by something older than marking.",
    evidence: "Science",
    cta: "How the seabed became the escarpment",
  },
  {
    id: "underneath-all-of-it",
    eraLabel: "Underneath all of it",
    headline: "Wattanuri, and the sisters he followed",
    body: "The Seven Sisters travel across the sky and across the country, pursued. What they did on that journey shaped landforms that are still standing, and one figure at the southern end of the shelter is the pursuer himself.",
    consequence:
      "This is not at the bottom of the page because it is the oldest thing on it. Lore is not a date. It is the floor everything above has been resting on the whole way down — which is why the band has run beside the reader since the first screen.",
    cta: "As much as is told away from Country",
  },
];

/**
 * Full-bleed breaks. No caption by design; they still need meaningful alt text.
 *
 * ⚠ The escarpment break is cultural-site material, and sketch B4 (pinned
 * horizontal panorama) is on hold on exactly that ground — "subject matter
 * must not be cultural-site material". Flagged, not resolved: a wireframe
 * cannot clear a permission. See R10.
 */
export const breaks = {
  countryNow: {
    id: "break-country-now",
    label: "Country now",
    note: "First light over the range, or a spring running. No caption.",
  },
  escarpment: {
    id: "break-escarpment",
    label: "The escarpment",
    note: "No people, no caption, edge to edge.",
    hold: "B4 is on hold — subject matter must not be cultural-site material. The escarpment IS the cultural site. Re-choose the subject or drop the break, pending a recorded permission.",
  },
} as const;

/**
 * ⛔ The hard stop. Structure only — no testimony.
 *
 * Nothing in this object reproduces Suzanne's words. The years are the era
 * marker the draft's own section heading requires; the count itself is a
 * withheld field, and the attribution line is a build description rather than
 * testimony.
 *
 * Behaviour, from the draft's build note: "The descent stops here. No rail, no
 * markers, nothing else on screen, and no way past it. It resumes below,
 * older." The rail genuinely breaks either side — see TruthRail.
 */
export const hardStop = {
  id: "hard-stop",
  years: "1902  ·  1886",
  countSlot: "[ THE COUNT — a single number, held alone on screen ]",
  holdTitle: "Suzanne Thompson — testimony · words not reproduced",
  holdBody:
    "Unapproved pending her sign-off. Drafted from the Unfinished Business and Yacadak Framework recordings and lightly edited for reading; she has also been asked whether the re-ordering is acceptable. The block, its scroll behaviour and its weight on the page are wireframed here — the text is deliberately absent and must stay absent until she signs it off.",
  attributionNote:
    "Includes a portrait slot and an attribution line: Iningai custodian · Founder and Managing Director, YACHATDAC.",
} as const;

/**
 * The structured tail below the timeline.
 *
 * ⚠ NO SOURCE COPY EXISTS. The copy document ends at the Wattanuri entry, so
 * roughly a fifth of this page is uncommissioned. Headings and decks below are
 * structural placeholders marked as such — not draft copy, and not approved.
 *
 * Partnership opportunities is retained per build documentation §4 (ESG /
 * brand-buyer audience, distinct from research opportunities). The uploaded
 * sitemap drops it — STATUS.md note 6. Retaining it is a decision.
 */
export const tail = [
  {
    id: "browsable-record",
    heading: "The browsable record",
    spec: "Every article, account, recording and paper — filterable grid, each item carrying structured metadata (title, evidence type, date).",
    facet: "evidence type",
  },
  {
    id: "researched",
    heading: "What's been researched",
    spec: "Curated, editor-selected.",
    facet: "discipline",
  },
  {
    id: "opportunities",
    heading: "Open research opportunities",
    spec: "Structured listing: discipline, description, status (open/closed), enquire per listing.",
    facet: "discipline · open / closed",
  },
  {
    id: "partnerships",
    heading: "Partnership opportunities",
    spec: "ESG / brand-buyer audience — distinct from research opportunities.",
    facet: "partnership type",
  },
] as const;

export const partnerWithUs = {
  id: "partner",
  heading: "Partner with us",
  spec: "Primary enquiry form for this page — routes to the enquiry / CRM path, NOT the newsletter ESP. Consider framing with Ngapartji-Ngapartji, the client’s own reciprocity principle.",
  cta: "Submit enquiry",
} as const;
