"use client";

import { usePathname } from "next/navigation";
import { PageLoader } from "@/components/ui/PageLoader";
import { motionSettled } from "@/lib/motion-controller";
import { hasSeenIntro, introForced } from "@/lib/intro-gate";
import {
  footerNav,
  legalLinks,
  org,
  pillars,
  primaryAction,
  primaryNav,
  resourcesFooterLinks,
} from "@/content/site";

/**
 * ONE loading panel for the whole site, announcing whichever page it covers.
 * User direction 11 September 2026, replacing the per-page loaders.
 *
 * WHAT IT COVERS, and why it is not a connection test. August's first framing
 * was to show a panel only to readers on a slow connection. The measurements
 * say the problem is not bandwidth. On the production build, refreshing `/` on
 * a local server with a warm cache:
 *
 *   first paint → ~370ms   document 5,139px, ZERO pin spacers
 *   ~890ms onward          document 23,303px, pins built
 *
 * A 4.5x height change, and until it lands every pinned screen is stacked at
 * the same offset — the frame where the headline sits on top of the pathway
 * cards. That happens on fibre. It is GSAP building pins after paint, not
 * bytes arriving late, so `navigator.connection` cannot see it and a panel
 * gated on connection speed would miss the exact case that prompted this.
 *
 * So the gate is readiness — `motionSettled()`, which is true once
 * ScrollTrigger has refreshed against resolved fonts — and connection only
 * moves the CEILING (see SLOW_HARD_CAP_MS). A fast reader is covered for
 * roughly the time the page actually needs and the panel lifts without
 * announcing itself; a slow one gets the count and the page's name.
 *
 * WHERE IT DOES NOT RUN:
 * - Client-side navigations. PageLoader's own module flag handles this: the
 *   X7 route transition already covers them, and this component staying
 *   mounted across routes is what keeps that flag meaningful.
 * - `/` on a genuine first arrival, where the opening film is the front door
 *   (see below).
 * - Reduced motion (hidden by CSS) and JavaScript off (hidden by <noscript>) —
 *   both inherited from PageLoader, X6.
 * - The /lab, /v2 and /homepagev2 sandboxes, which are not the site.
 */

/**
 * Slow link, slow device: the panel may hold longer before giving up.
 *
 * Both are bounded from above by the CSS escape hatch in globals.css, which
 * lifts the panel at 8s with or without JavaScript. PageLoader's scripted
 * ceiling is `hardCap + dwell + 1.5s`, so the slow figure has to stay under
 * 5.3s for the scripted path to keep winning — the CSS is the last resort and
 * should never be the thing that ends an ordinary slow load.
 */
const SLOW_HARD_CAP_MS = 4500;
const DEFAULT_HARD_CAP_MS = 3200;

/**
 * Reach 100% inside this and the panel lifts without announcing the page.
 * Sized from the trace above: a healthy refresh settles around 900ms, so the
 * ordinary case passes through quietly and only a page that genuinely stalled
 * says "You're viewing …".
 */
const QUIET_LIFT_MS = 1400;

/** Sandboxes. `/lab/*` and `/v2/*` are not the site (CLAUDE.md, Layout). */
const SANDBOXES = ["/lab", "/v2", "/homepagev2"];

/**
 * Every route label the site already publishes, longest path first.
 *
 * Built FROM site.ts rather than typed out here, because nav is built from
 * site.ts and a loading panel that announced a different name than the header
 * would be its own bug. D5 also puts copy in the content modules: "Our people"
 * is sentence case there and stays sentence case here.
 */
const ROUTE_TITLES: [href: string, title: string][] = [
  ...[
    ...primaryNav,
    primaryAction,
    ...legalLinks,
    ...resourcesFooterLinks,
    // The IA's own labels. This is where /partnerships is called
    // "Partnerships" rather than the footer column's "Partners".
    ...pillars.flatMap((pillar) => [
      { title: pillar.title, href: pillar.href },
      ...pillar.children,
    ]),
    ...footerNav.flatMap((column) => column.links),
  ]
    // Section links (/wonder#turraburra) and query links (/the-record?type=…)
    // are the same page under a different name; the route is what we announce.
    .filter((link) => !link.href.includes("#") && !link.href.includes("?"))
    .map((link): [string, string] => [link.href, link.title]),
  // The homepage announces the organisation. It has no nav entry of its own,
  // and "Home" is a word the site does not otherwise use.
  ["/", org.name],
];

/** "Our people" → "our-people", so a label can be compared with a route. */
const slugify = (title: string): string =>
  title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/**
 * Longest prefix wins, so /the-record/<slug> is announced as The Record.
 *
 * One href can carry SEVERAL labels — the footer calls /partnerships both
 * "Partners" and "Partner with Us", neither of which is the page's name — so
 * source order alone would announce whichever column happened to be declared
 * first. Where a label slugifies to the route's own last segment it is the
 * page's name rather than a link's name, and that wins: /partnerships is
 * "Partnerships". Otherwise the first-declared label stands, which is what
 * keeps /legal/privacy as "Privacy Policy" rather than a bare "Privacy".
 */
function titleFor(pathname: string): string | null {
  const matches = ROUTE_TITLES.filter(([href]) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`),
  );
  if (!matches.length) return null;
  const longest = Math.max(...matches.map(([href]) => href.length));
  const best = matches.filter(([href]) => href.length === longest);
  const segment = pathname.split("/").filter(Boolean).pop() ?? "";
  const named = best.find(([, title]) => slugify(title) === segment);
  return (named ?? best[0])[1];
}

/**
 * A slow link, as the browser understands it. Absent on Safari and Firefox,
 * where every reader takes the default ceiling — which is the right way round:
 * the ceiling only ever cuts a panel short, so not knowing costs nobody a
 * broken page.
 */
function onSlowConnection(): boolean {
  // This runs during render, and a client component still renders on the
  // server, where there is no navigator at all.
  if (typeof navigator === "undefined") return false;
  const connection = (
    navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    }
  ).connection;
  if (!connection) return false;
  if (connection.saveData) return true;
  return (
    connection.effectiveType === "slow-2g" ||
    connection.effectiveType === "2g" ||
    connection.effectiveType === "3g"
  );
}

/**
 * Is the homepage about to run its opening film?
 *
 * Asked at mount, not at render, because `sessionStorage` does not exist on
 * the server — see PageLoader's `suppressed`. The panel is in the homepage's
 * server HTML either way, and on a first arrival the film's own cover is later
 * in the document at the same z-index, so it paints over this one for the few
 * hundred milliseconds before this stands down. Nothing flashes.
 */
function introWillPlay(): boolean {
  return !hasSeenIntro() || introForced();
}

export function RouteLoader() {
  const pathname = usePathname();
  if (!pathname) return null;
  if (SANDBOXES.some((root) => pathname === root || pathname.startsWith(`${root}/`))) {
    return null;
  }

  const name = titleFor(pathname);
  if (!name) return null;

  const slow = onSlowConnection();

  return (
    <PageLoader
      // ⚠ NO `key`. Keying this on the pathname remounts the panel on every
      // client-side navigation, and a remounted panel renders its first frame
      // in the "loading" phase — visible, full-screen charcoal — before the
      // effect can stand it down. Measured on a nav from / to /wonder,
      // 11 September 2026: the panel was up for ~280ms over a page the route
      // transition was already covering. Staying mounted means it simply stays
      // lifted, and only the name beneath it changes.
      name={name}
      ready={motionSettled}
      hardCapMs={slow ? SLOW_HARD_CAP_MS : DEFAULT_HARD_CAP_MS}
      rampMs={slow ? 1600 : 700}
      sweepMs={slow ? 1500 : 650}
      dwellMs={1200}
      quietLiftMs={QUIET_LIFT_MS}
      suppressed={pathname === "/" ? introWillPlay : undefined}
    />
  );
}
