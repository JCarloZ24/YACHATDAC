import { STORY_WALL_DATING } from "./fields";

/**
 * Wonder — "Guesting on Country".
 *
 * Source of truth: docs/content/drafts/wonder/YACHATDAC-Wonder-Copy-v1.pdf
 * (decision D5 — the draft PDFs govern page copy). Copy here is verbatim: no
 * paraphrase, no tightening, no title-casing, no Americanised spelling. If a
 * sentence looks too long for its box, the box changes.
 *
 * ⚠ Copy status: draft, not approved. Governance circle: open.
 * See docs/content/STATUS.md.
 *
 * Audience: travellers and schools — the curious. One offer, not a listing
 * grid. No booking flow: "Country sets the days, not a timetable."
 *
 * Motion: Tier 2 only (F4). Entry staggers and hover states. No pinning, no
 * scrubbed media, no parallax — a CMS template must not be able to reach Tier 1.
 */

export type WonderCard = {
  eyebrow: string;
  title: string;
  body: string;
  /**
   * Cultural material whose imagery permission is unresolved. The slot renders
   * as a visible hold rather than a photograph. See permissions.md.
   */
  imageHeld?: string;
};

export const wonderHero = {
  eyebrow: "Guesting on Country",
  headline: "You will feel it before anyone explains it.",
  body: "An escarpment full of caves and blowholes, a story wall older than almost anything people have kept, and a sky with nothing in the way of it. Turraburra is met on foot, with the people who belong to it.",
  mediaNote:
    "Full-bleed — escarpment, caves, sky. Landscape, not cultural-site material. X5 scrim required.",
} as const;

export const firstNight = {
  eyebrow: "The first night",
  headline: "The dark out here still has stars in it.",
  body: [
    "No town glow, no traffic. When the fire burns down the sky comes all the way to the ground, and the stars that have been read from this Country for tens of thousands of years are just there, close enough to feel crowded by.",
    "People go quiet. Most say it is the part they were not expecting.",
  ],
  mediaNote: "Night sky, fire burning down.",
} as const;

export const whyGuesting = {
  eyebrow: "Why we say guesting",
  headline: "You'll be hosted, not toured.",
  body: [
    "We call this guesting on Country because that is what it is. You are welcomed on by the people who belong to this Country, into their care and to their fire.",
    "Guests get looked after. Guests also get trusted with more than a passing visitor would.",
  ],
  mediaNote: "Hosts welcoming guests.",
} as const;

export const onCountry = {
  eyebrow: "On Country",
  headline: "Country sets the days, not a timetable.",
  body: "What happens while you are here depends on the season, the weather, and what Country asks for that week. Rain the night before, and the morning might go to a cool burn. Seed on the grasses, and you will be out collecting it. None of it is put on for visitors — you join what is already underway, which is why no two groups get the same days.",
  cards: [
    {
      eyebrow: "The escarpment",
      title: "Walking the sites",
      // The draft reads "marked at least 55,000 years ago". Substituted for the
      // content field — see fields.ts and risk R2.
      body: `A labyrinth of weathered caves and blowholes runs along the edge of the Aramac Range. Inside is the story wall — marked at least ${STORY_WALL_DATING}, and still being read.`,
      imageHeld:
        "Story-wall material. permissions.md unresolved — treat as unavailable, build typographically. Do not fill.",
    },
    {
      eyebrow: "Native foods",
      title: "Harvesting on Country",
      body: "The scrub that looked empty on the drive in turns out to be full of food — herbs, fruits, seeds, nuts. You learn to see it, and then you cannot unsee it.",
    },
    {
      eyebrow: "First light",
      title: "The oldest sunrise",
      body: "Morning comes up over the escarpment the way it has here for longer than there have been words for it. Worth the early start.",
    },
    {
      eyebrow: "Caring for Country",
      title: "Hands in the work",
      body: "Cool burns, seed collecting, bringing a spring back. Hands in, if you would like — most people find they want to be.",
    },
  ] satisfies WonderCard[],
} as const;

export const yourHosts = {
  eyebrow: "Your hosts",
  headline: "You are with the people whose Country this is.",
  body: "Suzanne, Graham and the Iningai Rangers host every group themselves. This is the same Country they work every week — the fences, the burns, the springs. You are in their company the whole time you are here.",
  mediaNote: "Suzanne, Graham and the Iningai Rangers.",
} as const;

/**
 * The logistics strip.
 *
 * ⚠ The four labels are designer-authored UI chrome, not draft copy — they
 * appear nowhere in the source document. Every *value* is a verbatim fragment
 * of draft lines 47 and 49, deliberately, so no composed sentence can be
 * mistaken for approved copy.
 */
export const beforeYouCome = {
  eyebrow: "Before you come",
  headline: "Small groups. Swags. A long way from town.",
  logistics: [
    { label: "Location", value: "120km north of Barcaldine" },
    { label: "Property", value: "8,870 hectares" },
    { label: "Stay", value: "swag or tent" },
    { label: "Dates", value: "arranged with you directly" },
  ],
  body: [
    "Turraburra sits 120km north of Barcaldine in Central Western Queensland, 8,870 hectares of it. You will camp — swag or tent, meals shared, fire at night. Groups stay small on purpose, so it stays quiet.",
    "Dates move with the seasons and with the people hosting you, so they are arranged with you directly rather than picked off a list. Tell us who is coming and roughly when, and we will find the right time.",
  ],
  cta: { label: "Register your interest", href: "/connect#enquire" },
} as const;

/**
 * Editor-selected posts, not a live query.
 *
 * The draft carries an editorial note here — "[ Placeholder — three posts,
 * editor-selected from the Wonder collection ]" — which is addressed to the
 * team and is NOT page copy. The placeholders below stay visibly bracketed:
 * writing plausible sample titles is how placeholder copy ends up shipping,
 * and it hides that these are curated, which drives the component API.
 */
export const fromCountry = {
  eyebrow: "From Country",
  headline: "Stories from out here.",
  posts: [
    { title: "[ Story title ]", excerpt: "[ One-line excerpt ]" },
    { title: "[ Story title ]", excerpt: "[ One-line excerpt ]" },
    { title: "[ Story title ]", excerpt: "[ One-line excerpt ]" },
  ],
  cta: "Read more",
} as const;

export const downloads = {
  eyebrow: "Downloads",
  headline: "Take it with you.",
  body: "Download the brochure to share, print, or read offline.",
  cta: { label: "Download PDF", href: "/the-record?type=download" },
} as const;
