/**
 * Homepage copy.
 *
 * Source of truth: docs/content/drafts/homepage/YACHATDAC-Homepage-Copy-v1.pdf
 * (decision D5). The draft PDFs govern page copy. They do NOT govern web
 * design — that is the wireframes' job.
 *
 * ⚠ This file is NOT the long-term home for this text. Homepage copy will be
 * editable in the CMS (decision D12, superseding the earlier position that it
 * stayed in git). What stays in code is the design, motion and section
 * structure; the words become editable content. Treat what follows as the
 * seed/default content the CMS is populated from, and do not build anything
 * that assumes these strings are compile-time constants.
 *
 * Structure: seven beats, one continuous scroll (build documentation §3). The
 * order mirrors Suzanne Thompson's own framework.
 *
 * ⚠ Copy status: draft, not approved. See docs/content/STATUS.md.
 */

import { STORY_WALL_DATING } from "./fields";

export type Beat = {
  id: string;
  /** Small caps label above the headline. */
  eyebrow: string;
  headline: string;
  /** One or two short paragraphs. Kept short — the imagery carries the weight. */
  body: string[];
  /** Art direction note for whoever selects the media. Not rendered. */
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
    headline: "Reconnection — across time, across people.",
    body: [
      "You are entering Turraburra: story held in stone and starlight, still being lived today.",
    ],
    mediaNote:
      "Full-bleed hero video or still. Country at first light — landscape and sky, no cultural-site material. No button; a scroll cue only.",
    tone: "charcoal",
  },
  {
    id: "wonder",
    eyebrow: "Wonder",
    headline: "The oldest sunrise you will ever stand under.",
    body: [
      "Deep time isn't a figure of speech here. The stars above the story wall are the same ones this Country has watched for longer than most of what humans call history.",
    ],
    mediaNote: "Deep time, sensory — night sky, sunrise, the escarpment.",
    tone: "midnight",
  },
  {
    id: "truth",
    eyebrow: "Truth",
    headline: "What's etched in stone doesn't forget.",
    body: [
      `A wasp nest built over the story wall's markings let researchers date them — at least ${STORY_WALL_DATING}, by the most conservative estimate. Lore and science, reading the same stone.`,
    ],
    // ⚠ RISK R2 — the homepage draft says "at least 55,000 years old"; the
    // Truth timeline draft says "at least 5,000 years ago" for the same
    // engravings, and flags its own dating as under review. A factor of ten
    // apart in a public claim about cultural heritage, on a site whose whole
    // argument is that the record has been got wrong before.
    //
    // Neither literal is used. The dating renders as a visible content field
    // until one sourced number exists — see src/content/lofi/fields.ts. D5 gives
    // the draft authority over copy, but it cannot arbitrate between two
    // drafts that disagree, and shipping both numbers on one site is the
    // specific failure R2 names. Wonder and Truth render the same field.
    //
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
    headline: "Some people never left. Everyone else can find their way back.",
    body: [
      "For the Iningai Nation, this has always been Country. For everyone else, belonging is something every person carries — even the ones who've forgotten where.",
    ],
    mediaNote:
      "Real, unlabelled imagery of people. No names, no bios — that is Connect's job. The feeling, not the directory.",
    tone: "roasted",
  },
  {
    id: "living-work",
    eyebrow: "Living Work",
    headline: "Caring for Country, in practice.",
    body: [
      "Fire-stick farming, carbon farming, spring restoration — work the Iningai Rangers do every week, by hand, not heritage kept behind glass.",
    ],
    mediaNote:
      "Hands-on ranger work. Right-way fire, restoration sites, the flux towers. Working imagery, not portraiture.",
    tone: "evergreen",
  },
];

/**
 * Beat 6 — The Invitation. The first point in the page where the visitor is
 * given a choice. Three cards, one per pillar.
 *
 * The draft titles each card with the pillar name and carries the descriptive
 * phrase as an eyebrow above it — not the other way round.
 */
export const invitation = {
  eyebrow: "The Invitation",
  headline:
    "Every journey begins differently — we welcome you to walk alongside us.",
  body: "",
  cards: [
    {
      eyebrow: "Guesting on Country",
      title: "Wonder",
      description:
        "Walk alongside us on Country through immersive experiences, native foods, stories, and seasonal knowledge.",
      cta: "Explore Experiences",
      href: "/wonder",
    },
    {
      eyebrow: "Research & Discovery",
      title: "Truth",
      description:
        "Partner with us on research and discovery that honours both Indigenous knowledge and contemporary practice.",
      cta: "Research & Partnerships",
      href: "/truth",
    },
    {
      eyebrow: "Caring for Country",
      title: "Living Work",
      description:
        "See Caring for Country in action — ranger programs, restoration, fire management, and community-led practice.",
      cta: "See the Work",
      href: "/living-work",
    },
  ],
} as const;

/**
 * Beat 7 — The Way Forward. Legacy/template framing for other communities.
 * This is NOT a note about the build being unfinished (open decision 1).
 */
export const wayForward = {
  eyebrow: "The Way Forward",
  headline: "A way forward, for whoever needs one.",
  body: "What's been rebuilt here — Country, culture, a way of working — is offered as one example, not the only one. Wherever you're standing, there's a way back to your own Country too.",
  signup: {
    label: "Stay connected",
    placeholder: "Your email address",
    cta: "Stay connected",
    /** Not transactional. Explicitly not a booking or donation prompt (§4). */
    note: "Occasional updates from Country. No more than that.",
  },
} as const;

/**
 * Acknowledgement / Welcome to Country — footer, text only, no ceremony
 * element and no popup (open decision 3).
 *
 * ⚠ BLOCKED, and deliberately NOT taken from the draft. The homepage draft
 * acknowledges "the Aboriginal people of the Northern Territory" — the wrong
 * jurisdiction. YACHATDAC is on Iningai Country, Central Western Queensland.
 * See risk R1.
 *
 * Final wording must come from Suzanne Thompson. She is an actual Traditional
 * Owner, so a genuine Welcome to Country is possible here, in her own words —
 * which is rarer than the Acknowledgement most sites carry. Do not write it on
 * her behalf, and do not paste the draft's version in as a stopgap.
 */
export const welcomeToCountry = {
  status: "awaiting-suzanne" as const,
  placeholder:
    "Welcome to Country wording to be provided by Suzanne Thompson before launch.",
};
