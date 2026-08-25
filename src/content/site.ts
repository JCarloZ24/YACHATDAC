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

/**
 * ⚠ NAV IS UNCHANGED, AND THAT IS DELIBERATE (24 Aug 2026).
 *
 * The pillar pages are now built, so the child links below point at real
 * sections instead of at spec outlines, and the `stub` flags are cleared where
 * the destination exists. Three new routes also exist — `/about`,
 * `/our-people` and `/partnerships` — because every v3 draft links to them.
 *
 * None of that answers **D2**: whether Connect survives as a navigation item
 * now that About and Contact have been lifted out of it. Two rounds of client
 * drafting have produced a header nav with no Connect in it while linking to
 * `/connect` from five places. That is copy evidence for the lo-fi review, not
 * an IA decision, so the four top-level pillars below are untouched and
 * Connect still holds About, the team and Suzanne as children.
 *
 * When D2 is answered, this is the file that changes.
 */

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
      { title: "Guesting on Country", href: "/wonder#experience" },
      { title: "About Turraburra", href: "/wonder#turraburra" },
      { title: "Stories", href: "/resources?type=story" },
      /* "Downloads" was `?type=download`, which is not one of the record's
         content types and would have matched nothing. The documents and
         reports section is what it meant. */
      { title: "Documents & reports", href: "/resources#documents" },
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
      { title: "What's Been Researched", href: "/truth#researched" },
      { title: "Open Research Opportunities", href: "/truth#opportunities" },
      { title: "The Cultural Knowledge Precinct", href: "/truth#precinct" },
      { title: "Partner with Us", href: "/truth#partner" },
    ],
  },
  {
    id: "living-work",
    title: "Living Work",
    subtitle: "Caring for Country",
    audience: "Other Indigenous communities worldwide",
    href: "/living-work",
    children: [
      { title: "The Iningai Rangers", href: "/living-work#rangers" },
      { title: "Caring for Country in Practice", href: "/living-work#practice" },
      { title: "How We Built This", href: "/living-work#how-we-built-this" },
    ],
  },
  {
    id: "connect",
    title: "Connect",
    subtitle: "About & contact",
    audience: "All site visitors",
    href: "/connect",
    /*
      These pointed at `/connect#about`, `#team`, `#suzanne` and `#turraburra`
      — four anchors on a page that was a stub, so none of them resolved. They
      now point at the pages that carry that content. Connect itself is still
      here and still a nav item; see the D2 note above.
    */
    children: [
      { title: `About ${org.name}`, href: "/about" },
      { title: "Our people", href: "/our-people" },
      { title: "Partnerships", href: "/partnerships" },
      { title: `About ${org.property}`, href: "/wonder#turraburra" },
      { title: "Resources", href: "/resources" },
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
 * Resources column as it appears in the footer, per build documentation §2.
 *
 * Kept separate from `resourcesHub.contentTypes`: those are the filter facets
 * on the hub page, these are navigation links. Marc's hi-fi footer listed
 * "Downloads" twice here and omitted nothing else; the duplicate was a
 * copy-paste, not a decision.
 */
export const resourcesFooterLinks: NavChild[] = [
  { title: "Stories", href: "/resources?type=story", stub: true },
  { title: "News / Updates", href: "/resources?type=update", stub: true },
  { title: "Downloads", href: "/resources?type=download", stub: true },
  { title: "Videos / Podcast", href: "/resources?type=video", stub: true },
];

/**
 * Legal row, from Homepage copy line 53.
 *
 * ⚠ Decision D4 is open on naming and on the missing cookie route: the repo
 * has /legal/terms labelled "Terms of Use", the copy draft says "Terms of
 * Service", and the uploaded sitemap says "Terms & Conditions" plus a "Cookie
 * Policy". The copy draft governs copy (D5), so its labels are used here —
 * but the cookie route does not exist yet, hence the stub.
 */
export const legalLinks: NavChild[] = [
  { title: "Privacy Policy", href: "/legal/privacy" },
  { title: "Terms of Service", href: "/legal/terms" },
  { title: "Cookie Settings", href: "/legal/cookies", stub: true },
];

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
