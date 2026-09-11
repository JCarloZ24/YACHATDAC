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

export type PrimaryNavItem = NavChild & { children?: NavChild[] };

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

/**
 * The primary navigation — **D2, Final (26 Aug)**.
 *
 * Connect is retired from the navigation and kept as a destination. Two
 * independent client drafting rounds (v2's footer nav, v3's working header)
 * both produced exactly this shape: the three pillars, the record, and About,
 * with "Get in touch" as a button rather than a nav item — while linking to
 * `/connect` from a dozen places. D23 (`/our-people` is a route) and D22
 * (`/partnerships` exists) fall out of the same decision, because Connect's
 * children move out to pages of their own.
 *
 * `pillars` below is unchanged and still describes the four content groupings
 * the footer columns are built from. This is the nav; that is the IA.
 *
 * Decided by Ivy and JC in Marc's absence, with hi-fi starting 28 Aug. One line
 * to override.
 *
 * D2 amendment, user direction 11 September 2026: About groups the existing
 * About YACHATDAC, Our people and Partners destinations in both headers.
 * The same links supply the footer's Organisation column (D12).
 */
export const organisationNav: NavChild[] = [
  { title: `About ${org.name}`, href: "/about" },
  { title: "Our people", href: "/our-people" },
  { title: "Partners", href: "/partnerships" },
];

export const primaryNav: PrimaryNavItem[] = [
  { title: "Wonder", href: "/wonder" },
  { title: "Truth", href: "/truth" },
  { title: "Living Work", href: "/living-work" },
  { title: "The Record", href: "/the-record" },
  { title: "About", href: "/about", children: organisationNav },
];

/**
 * The header's single button. Connect survives here, and only here.
 * "Connect" per the 31 Aug wireframe (it renders CONNECT — the eyebrow style
 * uppercases), replacing D2's "Get in touch" and matching the hi-fi pill.
 */
export const primaryAction = { title: "Connect", href: "/connect" } as const;

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
      { title: "Stories", href: "/the-record?type=story" },
      /* "Downloads" was `?type=download`, which is not one of the record's
         content types and would have matched nothing. The documents and
         reports section is what it meant. */
      { title: "Documents & reports", href: "/the-record#documents" },
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
      /*
        Was /truth#partner. The anchor resolves — TruthEra renders it — but it
        resolves to a two-sentence card inside Truth's descent, which is the
        wrong destination for the footer's most commercial link. contact.ts
        already sent this intent to /partnerships; now the footer agrees, and
        the site has one destination for "partner with us" instead of three.
      */
      { title: "Partner with Us", href: "/partnerships" },
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
      { title: "Caring for Country in Practice", href: "/living-work#streams" },
      { title: "How We Built This", href: "/living-work#infrastructure" },
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
      { title: "The Record", href: "/the-record" },
    ],
  },
];

/**
 * The Resources / Explore hub — the connective page of the whole site (§4).
 * Query-driven and filterable, unlike the hand-curated pillar pages.
 */
export const resourcesHub = {
  title: "The Record",
  href: "/the-record",
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
  { title: "Stories", href: "/the-record?type=story" },
  { title: "News / Updates", href: "/the-record?type=update" },
  /*
    "Downloads" and "Videos / Podcast" filtered on `download` and `video`,
    neither of which is a RecordType. They did not error — the-record/page.tsx
    matches the query against the closed set and falls through to no filter —
    so both links quietly delivered the WHOLE record under a promise of a
    subset. Misleading rather than broken, and worse for being neither.

    Downloads is the documents and reports section, which is what it always
    meant. Videos / Podcast maps onto Recording, a type that exists.
    `update` now resolves too, because D21 put Update back in the vocabulary.
  */
  { title: "Downloads", href: "/the-record#documents" },
  /* Was stub: true. One Recording exists, so the filter returns a result and
     the flag was stale. Route follows the /resources -> /the-record rename. */
  { title: "Videos / Podcast", href: "/the-record?type=Recording" },
];

/**
 * Legal row, from Homepage copy line 53.
 *
 * **D4 — Final (26 Aug) on labels and routes.** Three namings were in
 * circulation: build documentation said "Terms of Use" and a cookie/consent
 * notice, the sitemap said "Terms & Conditions" and "Cookie Policy", the copy
 * draft footer said "Terms of Service" and "Cookie Settings". D5 gives the
 * drafts authority over copy, so the draft's labels stand. `/legal/terms` keeps
 * its route so no inbound link breaks, and `/legal/cookies` now exists — it had
 * been rendered in the footer of every page with nothing behind it.
 *
 * ⚠ D4 is Final on NAMING ONLY. The content of all three is still held: R9
 * requires legal review rather than internal drafting, and the analytics setup
 * that governs the cookie wording is pending. Note "Cookie **Settings**"
 * implies a consent preferences dialog rather than a policy page — those are
 * different things and both may be wanted. Flagged, not resolved.
 */
export const legalLinks: NavChild[] = [
  { title: "Privacy Policy", href: "/legal/privacy" },
  { title: "Terms of Service", href: "/legal/terms" },
  { title: "Cookie Settings", href: "/legal/cookies" },
];

/**
 * Footer navigation — the hi-fi footer's four columns (frame 2137:2623),
 * replacing the earlier pillar-derived columns. PAGES is the primary nav minus
 * About (which moves under ORGANISATION as "About YACHATDAC"); GET IN TOUCH
 * names the three enquiry types and routes each to /connect, the one contact
 * destination D2 kept.
 */
export const footerNav: { title: string; links: NavChild[] }[] = [
  {
    title: "Pages",
    links: primaryNav.filter((link) => link.href !== "/about"),
  },
  {
    title: "Organisation",
    links: organisationNav,
  },
  {
    title: "Get in touch",
    links: [
      { title: "Guesting enquiries", href: "/connect" },
      { title: "Research & partnerships", href: "/connect" },
      { title: "Ranger exchange", href: "/connect" },
    ],
  },
];

/**
 * ⚠ Social profiles — the hi-fi footer lists these (FOLLOW column and the icon
 * row), but no profile URLs have been supplied. `href: null` renders each as a
 * held placeholder rather than a dead link; fill in the URL and it becomes one.
 */
export const socialLinks: { title: string; href: string | null }[] = [
  { title: "Facebook", href: null },
  { title: "Instagram", href: null },
  { title: "X", href: null },
  { title: "LinkedIn", href: null },
  { title: "YouTube", href: null },
];

/**
 * ⚠ R15 — corporation registration numbers, not yet supplied. The footer
 * renders bracketed holds and a visible warning until both are filled.
 */
export const registration: { icn: string | null; abn: string | null } = {
  icn: null,
  abn: null,
};

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
