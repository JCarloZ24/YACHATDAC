/**
 * /homepagev2 fork, 10 September 2026, user direction.
 *
 * A copy of src/content/homepage.ts, owned by /homepagev2 alone. The two
 * pages share NOTHING but the framework and the site chrome: edit this
 * freely and the live homepage is untouched, and vice versa.
 *
 * The cost of that is the usual one -- a fix made on one page does not
 * reach the other. Whichever page wins, delete the loser rather than
 * leaving both; `src/components/lofi` and `src/components/v2` are the
 * standing record of what two divergent copies turn into.
 */

/** Interface copy for the timed prototype requested 8 September 2026 (X1). */
export const homeLoader = { label: "Loading homepage" };

/** Figma/screenshot interface label, 8 September 2026; not narrative copy. */
export const homeHero = { scrollLabel: "Scroll" };

/** Screenshot text sequence, user direction 9 September 2026 (D5 hi-fi amendment). */
export const homePaintingCopy = {
  entrance: "You are entering",
  place: "Turraburra",
  story: "Story held in stone and starlight",
};

/**
 * Homepage copy.
 *
 * Source of truth: docs/content/drafts/homepage/YACHATDAC-Homepage-Copy-v3.md
 * (decision D5). The draft documents govern page copy. They do NOT govern web
 * design — that is the wireframes' job.
 *
 * Synced to **v3** on 24 Aug 2026. What changed from v2:
 *
 *   - SIX sections, not seven. The standalone `living-work` beat is gone; it
 *     survives as an Invitation card. `beats` is now four.
 *   - The `truth` beat is replaced outright. No "What's etched in stone
 *     doesn't forget", no wasp-nest sentence — that whole beat and the R2 note
 *     attached to it are retired. In its place, a sequence running from the
 *     Iningai Nation before 1861 down to the thirty-seven at Lake Dolly.
 *   - `belonging` is rewritten into first person plural and names Polly and
 *     Billy.
 *   - `wonder` and `belonging` now carry a call to action. Beats 2–5 had none
 *     in v2, deliberately; v3 changes that and the drafts govern.
 *   - Invitation card eyebrows and all three descriptions are rewritten. Card 2
 *     is "The record of this Country", not "Legacy, Research & Discovery".
 *   - `wayForward` gains four pathways and a rewritten body.
 *   - The footer acknowledgement is rewritten and no longer names the Northern
 *     Territory — but it is still a drafter's placeholder marked for Suzanne.
 *     See `welcomeToCountry`; it is deliberately NOT filled from v3.
 *
 * ⚠ This file is NOT the long-term home for this text. Homepage copy will be
 * editable in the CMS (decision D12, superseding the earlier position that it
 * stayed in git). What stays in code is the design, motion and section
 * structure; the words become editable content. Treat what follows as the
 * seed/default content the CMS is populated from, and do not build anything
 * that assumes these strings are compile-time constants.
 *
 * ⚠ Copy status: draft, not approved. See docs/content/STATUS.md.
 *
 * ⚠ Change requests touch this file. CR8 (a "more heroic" hero headline) is
 * withdrawn — no change needed. CR9 is applied to the Invitation card only,
 * see the note at `invitation` below. See docs/change-requests.md.
 */

export type BeatStep = {
  /**
   * Year or label for this step.
   *
   * ⚠ The prototype's Truth sequence is labelled by year — the conversion
   * notes read it as 1861 → 1862 → 1886 → 1902 — but only the first label
   * survived into the Markdown. The remaining steps are left unlabelled rather
   * than dated from inference: putting a year against a line about the Native
   * Police is not a formatting decision. Recover the labels from the prototype
   * in the Drive export before this beat is signed off.
   */
  label?: string;
  text: string;
};

export type Beat = {
  id: string;
  /** Small caps label above the headline. */
  eyebrow: string;
  /** Optional — the v3 Truth beat opens on a sequence rather than a headline. */
  headline?: string;
  /** One or two short paragraphs. Kept short — the imagery carries the weight. */
  body: string[];
  /**
   * A dated sequence, where the beat is built from one. Only Truth is.
   */
  sequence?: {
    /** The state being described before the sequence starts moving. */
    subject: string;
    subjectLabel: string;
    /** Descriptors of that state. */
    subjectDetail: readonly string[];
    steps: readonly BeatStep[];
  };
  /** v3 gives some beats an onward link. v2 gave none any. */
  cta?: { label: string; href: string };
  /**
   * Art direction note for whoever selects the media. Not rendered.
   *
   * ⚠ The image and gallery blocks in the draft documents are **placeholders** —
   * direction for what a shot should carry, not a specification of the final
   * asset. Nothing here names a file that exists. Treat every one as
   * swap-in-ready and do not build layout that depends on a specific crop.
   */
  mediaNote: string;
  /** Palette anchor for this beat, as a token name from globals.css. */
  tone: "evergreen" | "midnight" | "roasted" | "oxide" | "canvas" | "charcoal";
};

export const beats: Beat[] = [
  {
    id: "welcome",
    // The draft shows no eyebrow on the hero, unlike the other beats. Kept
    // because build documentation §3 names this section and the client's own
    // homepage slides label it — but it is a design-level call, so the
    // wireframes decide whether it renders.
    eyebrow: "Welcome to Country",
    // ⚠ CR8 — FNAN asked for "maybe something more heroic?" against this line.
    // Not applied. It is a direction rather than a brief, and it sits under a
    // Welcome to Country eyebrow whose wording is still blocked on Suzanne
    // (R1), so rewriting it first risks doing it twice.
    headline: "Reconnection — across time, across people.",
    body: [
      "You are entering Turraburra: story held in stone and starlight, still being lived today.",
    ],
    mediaNote:
      "A red dirt road running out through low scrub under a wide sky. Full-bleed hero video or still. No cultural-site material. No button; a scroll cue only.",
    tone: "charcoal",
  },
  {
    id: "wonder",
    eyebrow: "Wonder",
    headline: "The oldest sunrise you will ever stand under.",
    body: [
      "Deep time isn't a figure of speech here. The stars above the story wall are the same ones this Country has watched for longer than most of what humans call history.",
    ],
    cta: { label: "Guesting On-Country", href: "/wonder" },
    mediaNote: "Deep time, sensory — night sky, sunrise, the escarpment.",
    // 9 September 2026 user direction: continue the hero's dark ground for now.
    tone: "charcoal",
  },
  {
    id: "truth",
    eyebrow: "Truth",
    /**
     * ⚠ REPLACED IN v3. The old beat and its 55,000-year history are gone —
     * see R2 in docs/decisions-and-risks.md for why that claim was withdrawn.
     * Do not reinstate a date for the wall without the 2022 paper open.
     *
     * This beat is forty-one years told in seven lines. It has no headline of
     * its own in the draft; the sequence is the headline.
     */
    body: [
      "By 1902 there were thirty-seven of us left, camped at Lake Dolly, sharing eighteen pairs of blankets. That July the Protector of Aborigines removed fifty-two people to a mission at Durundur.",
      "Forty-one years. That is one part of a much longer story — fifteen thousand markings cut into a wall nobody has dated, an inland sea before that, a station called Gracevale bought back in 2019, a deed of grant signed in 2026.",
      "We tell it in the order that explains it.",
    ],
    sequence: {
      subject: "Iningai Nation",
      subjectLabel: "1861",
      subjectDetail: [
        "Nineteen and a half thousand square miles, from the Great Dividing Range west to Longreach, north to Muttaburra and Aramac",
        "Sandy plains, wooded country, and the Alice and the Thomson running through it",
        "Our people living into their nineties",
      ],
      steps: [
        {
          text: "Landsborough comes through. The squatters follow him onto Iningai Country.",
        },
        {
          text: "One cattle station, Bowen Downs, takes fifteen hundred square miles of it — and the Thomson River with it.",
        },
        {
          text: "The Native Police are sent to disperse us. Stock foul our waterholes. Disease follows, and we have no immunity to it.",
        },
        {
          text: "Drought. We cannot hunt and we cannot reach our water. The government calculates how many blankets we need.",
        },
      ],
    },
    cta: { label: "The full account", href: "/truth" },
    // ⚠ Story-wall imagery permission is UNRESOLVED (motion skill,
    // permissions.md). Treat as unavailable. No photograph of the engravings,
    // and no motion applied to cultural-site imagery in any form.
    mediaNote:
      "No imagery. Typographic beat until story-wall permission is resolved. Carry it on the words and the ground colour alone.",
    tone: "oxide",
  },
  {
    id: "belonging",
    eyebrow: "Belonging",
    headline: "Some of us never left. Others are still coming back.",
    body: [
      "Families stayed on this Country, or were removed and came back, or were brought back by the ones who stayed. Our great-great-great grandmother was Polly. Our great-great-great grandfather was Billy. That is how we know where to hunt out here, and which springs to go to.",
      "For anyone still finding their way home, this Country is patient.",
    ],
    cta: {
      label: "Meet the people keeping this Country",
      href: "/our-people",
    },
    mediaNote:
      "Real, unlabelled imagery of people. No names, no bios — that is Our People's job. The feeling, not the directory.",
    tone: "roasted",
  },
];

/**
 * The Invitation. The first point in the page where the visitor is given a
 * choice. Three cards, one per pillar.
 *
 * The draft titles each card with the pillar name and carries the descriptive
 * phrase as an eyebrow above it — not the other way round.
 *
 * ⚠ CR9 — applied to the card only, scoped to Steve's literal note against
 * this homepage card. The Wonder page's own H1/route/breadcrumb keep
 * "Guesting On-Country" — renaming those too is a larger IA/branding change
 * than a suggested card title, and is left for a deliberate call rather than
 * inherited here. Worth noting for whoever settles D16 later: "Be our guest"
 * is first-person-plural ("our"), the same word CR10 asks not to use about
 * Indigenous people — applied now on explicit instruction, but flag it when
 * the terminology sheet is written.
 */
export const invitation = {
  eyebrow: "The invitation",
  /* Shortened to the frame, 9 September 2026, user direction. The clause
     "— we welcome you to walk alongside us." is removed. The draft carried
     the longer line and D5 had been holding it against the Figma frame and
     the prototype screenshot, which both show only the first sentence; the
     direction settles that the shorter line is the copy, so v3 is amended
     rather than overridden. "Walk alongside us" survives in the Wonder card
     description below, so the phrase is not lost from the section. */
  headline: "Every journey begins differently.",
  body: "",
  cards: [
    {
      eyebrow: "Be our guest",
      title: "Wonder",
      description:
        "Walk alongside us on Country — the wall, the food in the scrub, the fire at night.",
      cta: "Explore experiences",
      href: "/wonder",
    },
    {
      // v3 widens this again, from "Legacy, Research & Discovery". The card is
      // now about the record rather than about research alone, which matches
      // what the Truth page actually became.
      eyebrow: "The record of this Country",
      title: "Truth",
      description:
        "The story of this Country from today back to the seabed, and the research being done on it now.",
      cta: "Follow it back",
      href: "/truth",
    },
    {
      eyebrow: "Caring for Country",
      title: "Living Work",
      description:
        "Ranger programs, restoration, fire management and community-led practice.",
      cta: "See the work",
      href: "/living-work",
    },
  ],
} as const;

/**
 * The Way Forward. Legacy/template framing for other communities. This is NOT
 * a note about the build being unfinished (open decision 1).
 *
 * ⚠ D16. This body carries both "Indigenous traditions" and "First Nations" in
 * three sentences, and FNAN has flagged both words for checking — "We need to
 * triple check use of the words 'Indigenous' and 'First Nations'", 24 Aug.
 * Left as drafted. The terminology sheet D16 proposes is what settles it, not
 * an edit here.
 */
export const wayForward = {
  eyebrow: "The way forward",
  headline: "A way forward, for whoever needs one.",
  body: "What we have rebuilt here — Country, Indigenous traditions, an organisation that can carry them — is offered as one example, not the only one. Other First Nations groups are welcome to come and see how it was done, and to tell us where we have it wrong.",
  /**
   * New in v3: four pathways between the body and the signup.
   *
   * These are the page's second and last navigation, and they are a different
   * set from the Invitation's — that one routes by pillar, this one routes by
   * what the visitor wants to do.
   *
   * ⚠ They went unrendered when the old Way Forward section was replaced by
   * the statement panel, and came back on 9 September 2026, user direction,
   * as their own section below the pinned canvas. Titles, descriptions,
   * destinations and CTAs are the draft's, unchanged (D5).
   *
   * `eyebrow` is hi-fi only: it is on the prototype deck's cards and in no
   * draft, so it is here rather than typed into markup. The deck labels the
   * fourth card LIVING WORK, which is the third card's pillar and not this
   * one's — it routes to The Record — so that one reads as a slip in the deck
   * and is corrected here. Worth confirming at review.
   */
  paths: [
    {
      title: "Come on Country",
      eyebrow: "Guesting",
      description:
        "Guesting On-Country for families, school groups and visitors. Small groups, dates arranged with you.",
      cta: "Guesting On-Country",
      href: "/wonder",
    },
    {
      title: "Research with us",
      eyebrow: "Research",
      description:
        "What we do not know and would like studied — how old the wall is, what lives here, what is in the ground.",
      cta: "Open research",
      href: "/partnerships",
    },
    {
      title: "Ranger exchange",
      eyebrow: "Living Work",
      description:
        "On-Country training camps and exchanges with other First Nations ranger groups.",
      cta: "Get in touch",
      href: "/connect",
    },
    {
      title: "Read the record",
      eyebrow: "The Record",
      description:
        "Stories, historical accounts, research and recordings. Some of it is science, some of it is memory.",
      cta: "The Record",
      href: "/the-record",
    },
  ],
  /**
   * The organisation's own line — it is on the logo, and Wonder, Living Work
   * and About all carry it too. Rendered as of the v3 sync.
   */
  tagline: "Ancient traditions walking together with contemporary visions.",
  signup: {
    label: "Stay connected",
    placeholder: "Your email address",
    cta: "Stay connected",
    /** Not transactional. Explicitly not a booking or donation prompt (§4). */
    note: "New material a few times a year, when something is added.",
  },
} as const;

/**
 * Acknowledgement / Welcome to Country — footer, text only, no ceremony
 * element and no popup (open decision 3).
 *
 * ⚠ BLOCKED, and deliberately NOT taken from the draft.
 *
 * v1 and v2 acknowledged "the Aboriginal people of the Northern Territory" —
 * the wrong jurisdiction, carried word for word through two rounds. That is
 * risk R1 and it is the reason this placeholder exists.
 *
 * ✅ FIXED IN v3 (24 Aug), and this placeholder still stays. The Northern
 * Territory paragraph is gone; v3 reads "Turraburra is Iningai Country. We are
 * its Traditional Custodians, and we are still here." It also gets the
 * distinction right — that is a statement of custodianship and welcome, not an
 * Acknowledgement, which is what a visitor makes on Country not their own. But
 * v3 marks its own paragraph "[ DRAFT for Suzanne to correct or replace ]", so
 * it is a drafter's words, not hers. Copying it in would swap one placeholder
 * for another and make it look approved. R1 is downgraded, not closed.
 *
 * Note the drafts also name homepage section 1 "Welcome to Country". That is a
 * section heading, not this paragraph. Do not conflate them when the real
 * wording lands.
 *
 * Final wording must come from Suzanne Thompson. She is an actual Traditional
 * Owner, so a genuine Welcome to Country is possible here, in her own words —
 * which is rarer than the Acknowledgement most sites carry. Do not write it on
 * her behalf, and do not paste the draft's version in as a stopgap. Steve
 * (FNAN) reviews the jurisdiction; Suzanne owns the words.
 */
export const welcomeToCountry = {
  status: "awaiting-suzanne" as const,
  /* The hi-fi footer's own hold wording (2137:2623) — rendered verbatim,
     brackets included, so the hold cannot be mistaken for copy. */
  placeholder:
    "[ WELCOME TO COUNTRY — held. The wording comes from Suzanne Thompson and has not been supplied. ⚠ R1 — do not draft, paraphrase or place substitute text here. ]",
};

/**
 * Cultural advice. v3 carries it in the footer, and Our People carries its own
 * copy at the top of that page because the risk is concentrated there.
 */
export const culturalAdvice =
  "Aboriginal and Torres Strait Islander readers are advised that this website contains images and names of people who have passed away.";
