/**
 * Homepage copy.
 *
 * Source of truth: docs/content/drafts/homepage/YACHATDAC-Homepage-Copy-v2.pdf
 * (decision D5). The draft PDFs govern page copy. They do NOT govern web
 * design — that is the wireframes' job.
 *
 * Synced to v2 on 20 Aug 2026. What changed from v1: the Truth beat (see the
 * note on that beat — the 55,000-year claim is withdrawn), and the Invitation
 * card eyebrows. Every other beat came through v2 unchanged.
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

export type Beat = {
  id: string;
  /** Small caps label above the headline. */
  eyebrow: string;
  headline: string;
  /** One or two short paragraphs. Kept short — the imagery carries the weight. */
  body: string[];
  /**
   * Art direction note for whoever selects the media. Not rendered.
   *
   * ⚠ The image and gallery blocks in the draft PDFs are **placeholders** —
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
      "The largest rock art site in central Queensland is here — over 15,000 markings across 160 metres of wall. Nobody has dated it. The wasp nests that could be still sitting over the engravings, waiting for someone to ask.",
    ],
    // ⚠ CHANGED IN v2 — risk R2. v1 said the markings were "at least 55,000
    // years old, by the most conservative estimate", dated from a wasp nest
    // built over them. All three v2 drafts withdraw that: the site has never
    // been scientifically dated. The pecked designs are likely more than 5,000
    // years old on regional style sequences, and the wasp nests are a method
    // that COULD give minimum ages if anyone ever sampled them — not a dating
    // that happened. Sourced in the Truth draft to Marra Wonga, Australian
    // Archaeology, 2022. Do not reinstate a figure without that paper open.
    //
    // ⚠ The third sentence above is transcribed verbatim from v2 and is a
    // sentence fragment as drafted. Not repaired here, because D5 makes the
    // draft the source of truth for copy and inventing a fix would put words in
    // the client's mouth. August is confirming the reversal; the rewrite goes
    // with it. Probable intent: "The wasp nests that could date them are still
    // sitting over the engravings, waiting for someone to ask."
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
      eyebrow: "Guesting On-Country",
      title: "Wonder",
      description:
        "Walk alongside us on Country through immersive experiences, native foods, stories and seasonal knowledge.",
      cta: "Explore Experiences",
      href: "/wonder",
    },
    {
      // v2 widened this from "Research & Discovery" and notes the change was
      // deliberate, to match the Truth page title: "Truth — Legacy, Research &
      // Discovery". Keep the two in step if either moves.
      eyebrow: "Legacy, Research & Discovery",
      title: "Truth",
      description:
        // v2 says Iningai, not Indigenous. The narrower word is the point:
        // this is one nation's knowledge, not a category.
        "Partner with us on research and discovery that honours both Iningai knowledge and contemporary practice.",
      cta: "Research & Partnerships",
      href: "/truth",
    },
    {
      eyebrow: "Caring for Country",
      title: "Living Work",
      description:
        // Ranger is capitalised in v2 throughout — it is a role here, not a
        // job description.
        "See Caring for Country in action — Ranger programs, restoration, fire management and community-led practice.",
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
  /**
   * New in v2, between the body and the signup. This is the organisation's own
   * line — it is on the logo, and Wonder and Living Work both carry it too.
   *
   * ⚠ NOT RENDERED YET. WayForward.tsx draws eyebrow, headline, body and the
   * signup field only. Wiring it in is a design-level call, so it waits on the
   * wireframes (D5) rather than being added on the way past.
   */
  tagline: "Ancient traditions walking together with contemporary visions.",
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
 * ⚠ STILL WRONG IN v2. The footer paragraph is carried over word for word,
 * Northern Territory included, through two rounds of drafting. This placeholder
 * therefore stays exactly as it is — it is the only thing stopping that
 * sentence reaching a page.
 *
 * Note v2 also names homepage section 1 "Welcome to Country". That is a section
 * heading, not this paragraph. Do not conflate them when the real wording lands.
 *
 * Final wording must come from Suzanne Thompson. She is an actual Traditional
 * Owner, so a genuine Welcome to Country is possible here, in her own words —
 * which is rarer than the Acknowledgement most sites carry. Do not write it on
 * her behalf, and do not paste the draft's version in as a stopgap. Steve
 * (FNAN) reviews the jurisdiction; Suzanne owns the words.
 */
export const welcomeToCountry = {
  status: "awaiting-suzanne" as const,
  placeholder:
    "Welcome to Country wording to be provided by Suzanne Thompson before launch.",
};
