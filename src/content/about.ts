/**
 * About YACHATDAC.
 *
 * Source of truth: docs/content/drafts/connect/YACHATDAC-About-Copy-v1.md
 * (D5). First draft of this page — the old page-specs file had no entry for it
 * at all.
 *
 * ⚠ FILED UNDER CONNECT, ROUTED AT TOP LEVEL. The draft lives in
 * `drafts/connect/` because build documentation §2 puts About inside Connect.
 * The prototype links it as `/about`, and so does the v3 homepage nav. This
 * page is built at `/about` because that is what every draft links to — but
 * that is a routing decision, **not an answer to D2**, which asks whether
 * Connect survives as a navigation item. The site nav is unchanged.
 *
 * ⚠ R15 and the ICN/ABN gap are the same piece of work. The draft carries its
 * own note about the legal-name spelling and both registration numbers; it
 * renders on the page.
 */

export const aboutHero = {
  eyebrow: "Custodians of Iningai Country",
  title: "About YACHATDAC",
  standfirst:
    "YACHATDAC is an Aboriginal corporation formed in 2016 by Traditional Custodian families of the Iningai Nation, based in Barcaldine, Central Western Queensland.",
  image: "A group walking through woodland toward the escarpment.",
} as const;

export const whatWeAre = {
  title: "What we are",
  body: [
    "Yambangku Aboriginal Cultural Heritage and Tourism Development Aboriginal Corporation. Most people say YACHATDAC.",
    "We were formed by key members of the Traditional Custodian families of the Iningai lands to protect our cultural heritage, care for Country, reawaken culture, and share cultural knowledge as a business so it keeps going.",
    /**
     * ⚠ CR10 (HELD) — "bought back for our people". Same request, same
     * reasoning, same hold as the Wonder page. See docs/change-requests.md.
     */
    "We manage Turraburra — 8,870 hectares 120km north of Barcaldine. It was called Gracevale until it was bought back for our people in 2019 and renamed in 2020.",
  ],
  facts: [
    {
      label: "Registered",
      value: "Office of the Registrar of Indigenous Corporations",
    },
    { label: "Charity status", value: "Registered with the ACNC" },
    {
      label: "Owned by",
      value: "Its members — Iningai Traditional Custodian families",
    },
    { label: "Based", value: "Barcaldine, Central Western Queensland" },
  ],
  /** ⚠ R15. The draft's own note, rendered rather than dropped. */
  pending:
    "Add ICN and ABN. Confirm spelling: Yambangku or Yumbangku — the logo and the published research differ.",
} as const;

export const whyWeExist = {
  title: "Why we exist",
  body: [
    "The Iningai people have cared for this Country for tens of thousands of years. We are building the organisation, the relationships and the enterprises that let that custodianship carry on — culturally, environmentally and economically.",
    "None of it is built for its own sake. Everything we do is measured against one question.",
  ],
  quote: "What does it leave for the generations who come after us?",
  attribution:
    "From the Foreword to our Ten Year Strategic Plan, written by the Board Directors",
  tagline:
    "Ancient traditions walking together with contemporary visions. It is on our logo, and it is how the work is actually done.",
} as const;

export const whatWeDo = {
  title: "What we do",
  lede: "Four things, and they hold each other up. If Country is not cared for there is nothing to harvest; if there is nothing to harvest there is no knowledge to share; if the knowledge is not shared it does not survive.",
  areas: [
    {
      title: "Caring for Country",
      body: "Fire-stick farming, land restoration, wildlife conservation, carbon and biodiversity — delivered by Iningai Rangers.",
      cta: { label: "Field notes from Turraburra", href: "/living-work" },
    },
    {
      title: "Cultural heritage",
      body: "Protecting Marra Wonga and the other sites, recovering language and story, and telling the truth of what happened here.",
      cta: { label: "Truth", href: "/truth" },
    },
    {
      title: "Guesting On-Country",
      body: "Bringing people onto Country as guests rather than tourists, and sharing what we are able to share.",
      cta: { label: "Guesting On-Country", href: "/wonder" },
    },
    {
      title: "Research and the record",
      body: "Two-way science with universities, and a public record of what is known about this Country.",
      cta: { label: "The Record", href: "/resources" },
    },
  ],
} as const;

/**
 * How we work — three of the seven values in the Strategic Plan.
 *
 * The draft's own reasoning for cutting the other four is worth keeping: they
 * are claimed by every organisation and read as filler in public, while these
 * three constrain actual decisions. That is an editorial judgement the client
 * made and it is why the list is short.
 */
export const howWeWork = {
  title: "How we work",
  values: [
    {
      title: "Country first",
      body: "Every decision respects Country — land, waters and sky, its ecological values and its cultural significance. Where Country and commercial sense disagree, Country wins.",
    },
    {
      title: "Iningai-led",
      body: "Iningai people lead. Governance, employment and benefit flow to community. Slower than contracting the work out, and the only version worth doing.",
    },
    {
      title: "Reciprocity",
      body: "Relationships with partners, funders and visitors carry mutual obligation. Everyone who comes here gives something back to the land and the people, not only takes.",
    },
  ],
  pending:
    "Three of the seven values in the Strategic Plan. The others — sharing and learning, respect, integrity, resilience — are claimed by every organisation and read as filler in public. These three constrain actual decisions. Also: the plan describes reciprocity as the Ngapartji-Ngapartji principle, which is Western Desert language, not Iningai. Confirm with Suzanne.",
} as const;

export const whoDecides = {
  title: "Who decides",
  body: [
    "The board holds accountability for performance, direction and cultural integrity. It is made up of 80% Aboriginal and 20% non-Aboriginal members under our constitution and ORIC requirements, and includes a formal Iningai Nation representative. It meets quarterly and reports to members at the Annual General Meeting.",
    "An Elder Advisory Group is being established to guide everything touching cultural integrity. Once it is sitting, no program involving the sharing of Iningai cultural knowledge, stories or sacred information will proceed without its endorsement.",
    "In 2031 an external reviewer commissioned by the board will assess our first five years against what we said we would do, with community consultation across the Iningai Nation. The revised plan goes to the AGM and to community.",
  ],
  cta: {
    label:
      "Governance documents, the Ten Year Plan and our financial statements are in The Record",
    href: "/resources",
  },
  /**
   * ⚠ Keep the Elder Advisory Group in the future tense until it is sitting.
   * The draft flags this and it is easy to lose in an edit — "is being
   * established" and "once it is sitting" are doing real work.
   */
  pending:
    "TENSE — keep the Elder Advisory Group in the future tense until it is sitting.",
} as const;

export const thePeople = {
  title: "The people",
  body: "Suzanne Thompson founded YACHATDAC and runs it. The Iningai Rangers do the work on Country. Three generations of families walked with ours to keep this Country reachable when we did not own an acre of it.",
  cta: { label: "Meet the people", href: "/our-people" },
} as const;

/**
 * Partners.
 *
 * ⚠ Names only. The draft carries no logos and the note asks for approved logo
 * files, so these render as text — an unapproved logo on a partner list is a
 * worse problem than a plain name.
 */
export const partners = {
  title: "Partners",
  body: "We work with universities, government and community organisations. Research on Turraburra is done with Iningai people as partners rather than subjects, and every partnership is expected to give something back to the land and the people.",
  groups: [
    {
      title: "Research",
      names: [
        "QUT",
        "Griffith University",
        "James Cook University",
        "University of Queensland",
      ],
    },
    {
      title: "Government and land",
      names: [
        "Indigenous Land & Sea Corporation",
        "Queensland Government",
        "Land Restoration Fund",
      ],
    },
    {
      title: "Industry and community",
      names: ["Queensland Tourism Industry Council", "Lake Eyre Basin Rangers"],
    },
  ],
  pending:
    "Confirm the current list, get approved logo files, and check whether each partnership is active. The 2024 flyer also listed Preston Campbell Foundation, ANFAB, Phyre Design, The Cameleers and Dixon Homes.",
  cta: { label: "Partner with us", href: "/connect" },
} as const;
