/**
 * Site-wide identity and information architecture.
 *
 * Source of truth: build documentation §2 (Site architecture) and the client's
 * own sitemap slide. Nav is driven from here so the IA lives in one place while
 * it is still moving.
 *
 * Naming rule (§1, and open decision 8): YACHATDAC is the *organisation*,
 * Turraburra is the *property*. They are not interchangeable.
 */

export const org = {
  /** Brand / acronym name. Used everywhere in UI. */
  name: "YACHATDAC",
  /** Full legal name. Used on About, in the footer, and in metadata. */
  legalName:
    "Yambangku Aboriginal Cultural Heritage & Tourism Development Aboriginal Corporation",
  /** The land itself — distinct from the organisation. */
  property: "Turraburra",
  /** Suzanne Thompson's words. Everything on the site traces back to this. */
  coreNarrative:
    "Reconnection — across time, from the deep past to now to the future, and across people.",
} as const;

export type PillarId = "wonder" | "truth" | "living-work" | "connect";

export type NavChild = {
  title: string;
  href: string;
  /** Not yet built — rendered but flagged, so nobody mistakes a stub for done. */
  stub?: boolean;
};

export type Pillar = {
  id: PillarId;
  /** One-word pillar name, as the client uses it. */
  title: string;
  /** Plain-language subtitle. "Truth" alone does not self-explain (§4). */
  subtitle: string;
  /** Who this pillar is written for. */
  audience: string;
  href: string;
  children: NavChild[];
};

export const pillars: Pillar[] = [
  {
    id: "wonder",
    title: "Wonder",
    subtitle: "Guesting on Country",
    audience: "Travellers and schools — the curious",
    href: "/wonder",
    children: [
      { title: "Guesting on Country", href: "/wonder#experience", stub: true },
      { title: "Experiences", href: "/wonder#experience", stub: true },
      { title: "Stories", href: "/resources?type=story", stub: true },
      { title: "Downloads", href: "/resources?type=download", stub: true },
    ],
  },
  {
    id: "truth",
    title: "Truth",
    subtitle: "Research & Discovery",
    audience:
      "Universities, funders, brands, researchers and partners — the practitioners",
    href: "/truth",
    children: [
      { title: "What's Been Researched", href: "/truth#researched", stub: true },
      { title: "Open Research Opportunities", href: "/truth#opportunities", stub: true },
      { title: "The Cultural Knowledge Precinct", href: "/truth#precinct", stub: true },
      { title: "Partner with Us", href: "/truth#partner", stub: true },
    ],
  },
  {
    id: "living-work",
    title: "Living Work",
    subtitle: "Caring for Country",
    audience: "Other Indigenous communities worldwide",
    href: "/living-work",
    children: [
      { title: "The Iningai Rangers", href: "/living-work#rangers", stub: true },
      { title: "Caring for Country in Practice", href: "/living-work#practice", stub: true },
      { title: "How We Built This", href: "/living-work#how-we-built-this", stub: true },
    ],
  },
  {
    id: "connect",
    title: "Connect",
    subtitle: "About & contact",
    audience: "All site visitors",
    href: "/connect",
    children: [
      { title: `About ${org.name}`, href: "/connect#about", stub: true },
      { title: "The YACHATDAC Team", href: "/connect#team", stub: true },
      { title: "About Suzanne Thompson", href: "/connect#suzanne", stub: true },
      { title: `About ${org.property}`, href: "/connect#turraburra", stub: true },
      { title: "Resources", href: "/resources", stub: true },
    ],
  },
];

/**
 * The Resources / Explore hub — the connective page of the whole site (§4).
 * Query-driven and filterable, unlike the hand-curated pillar pages.
 */
export const resourcesHub = {
  title: "Resources",
  href: "/resources",
  /** Filterable content types within the single unified Blog/Editorial collection. */
  contentTypes: [
    "History",
    "Research",
    "Publication",
    "Event",
    "Activity",
    "Story",
    "Update",
  ],
} as const;

/**
 * Deliberately out of scope this phase (§2). Listed so nobody re-adds them by
 * accident, and so reviewers can see the omissions are decisions, not gaps.
 */
export const outOfScope = [
  "Accommodation booking flow — camping is Stage 1 of the org's own roadmap",
  'Public-facing "circles of sharing" permission UI (internal workflow only)',
  "Live Eco Sounds / research-sensor data integration",
  "Capped or low-traffic booking logic",
  "Third-party storefront platform (Shopify etc.) — merch is hosted natively",
  "Separate Events page — Event is a content type inside Resources",
] as const;
