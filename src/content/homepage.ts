/**
 * Homepage copy.
 *
 * The homepage is deliberately NOT CMS-managed — it is a single authored
 * narrative, not a collection of entries, and it changes rarely. It lives in
 * the repo so it is versioned, reviewable in PRs, and cannot be edited into
 * incoherence from the admin UI. Every other long-form page on the site comes
 * from the CMS (build documentation §8).
 *
 * Structure: seven beats, one continuous scroll, no navigation choice until
 * beat 6 (§3). Order matters — it mirrors Suzanne Thompson's own framework.
 *
 * ⚠ Copy status: drafted from the build documentation and the client's own
 * homepage-content slides. Not yet signed off by Suzanne / the client.
 */

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
    eyebrow: "Welcome to Country",
    headline: "Reconnection — across time, across people.",
    body: [
      "Turraburra. Eight and a half thousand hectares of central Queensland held by the Iningai Nation, where the story is kept in stone and in starlight.",
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
      "Stars that have not moved in living memory. An escarpment that catches the first light the same way it always has.",
      "Deep time is not an idea here. It is the ground you are standing on.",
    ],
    mediaNote: "Deep time, sensory — night sky, sunrise, the escarpment.",
    tone: "midnight",
  },
  {
    id: "truth",
    eyebrow: "Truth",
    headline: "What's etched in stone doesn't forget.",
    body: [
      "At Marra Wonga, a wasp nest built over the engravings dates them to at least 55,000 years.",
      "Lore and science, reading the same stone and arriving at the same place.",
    ],
    // ⚠ Story-wall imagery is UNAVAILABLE — permission unresolved (motion
    // skill, permissions.md). Treat as unavailable and build this beat
    // typographically (B5 line-settle, Y2 word emphasis). No photograph of the
    // engravings, and no motion applied to cultural-site imagery in any form.
    mediaNote:
      "No imagery. Typographic beat until story-wall permission is resolved. Carry it on the words and the ground colour alone.",
    tone: "oxide",
  },
  {
    id: "belonging",
    eyebrow: "Belonging",
    headline: "Some people never left. Everyone else can find their way back.",
    body: [
      "The Iningai Nation never left this Country. That is the first meaning.",
      "The second is an invitation: wherever you come from, there is a place you belong to as well, and it is worth remembering.",
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
      "Fire-stick farming. Carbon farming. Spring restoration. Biodiversity work that is measured, not asserted.",
      "This is the Iningai Rangers' week, every week.",
    ],
    mediaNote:
      "Hands-on ranger work. Right-way fire, restoration sites, the flux towers. Working imagery, not portraiture.",
    tone: "evergreen",
  },
];

/**
 * Beat 6 — The Invitation. The first point in the page where the visitor is
 * given a choice. Three cards, one per pillar.
 */
export const invitation = {
  eyebrow: "The Invitation",
  headline: "Every journey begins differently.",
  body: "Whether you come to experience Country, deepen understanding, care for Country, or begin a conversation, we welcome you to walk alongside us.",
  cards: [
    {
      title: "Experience Country",
      description:
        "Walk alongside us on Country through immersive Indigenous experiences, native foods, stories, and seasonal knowledge.",
      cta: "Explore experiences",
      href: "/wonder",
    },
    {
      title: "Research Together",
      description:
        "Partner with us on research, discovery and projects that honour both Indigenous knowledge and contemporary practice.",
      cta: "Research & partnerships",
      href: "/truth",
    },
    {
      title: "Learn from Living Work",
      description:
        "See Caring for Country in action: ranger programs, restoration, fire management, biodiversity and community-led practice.",
      cta: "See the work",
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
  body: "What we are building here was built from nothing, and we would rather share the method than keep it. If your community is walking the same road, we would like to hear from you.",
  signup: {
    label: "Stay connected",
    placeholder: "Your email address",
    cta: "Sign up",
    /** Not transactional. Explicitly not a booking or donation prompt (§4). */
    note: "Occasional updates from Country. No more than that.",
  },
} as const;

/**
 * Acknowledgement / Welcome to Country — footer, text only, no ceremony
 * element and no popup (open decision 3).
 *
 * ⚠ BLOCKED: final wording must come from Suzanne Thompson before launch.
 * Suzanne is an actual Traditional Owner, so a genuine Welcome to Country is
 * possible here, in her own words — which is rarer than the Acknowledgement
 * most sites carry. Do not write it on her behalf.
 */
export const welcomeToCountry = {
  status: "awaiting-suzanne" as const,
  placeholder:
    "Welcome to Country wording to be provided by Suzanne Thompson before launch.",
};
