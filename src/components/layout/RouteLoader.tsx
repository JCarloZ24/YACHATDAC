"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { PageLoader } from "@/components/ui/PageLoader";
import { createPageReadiness, isPublicRoute, PAGE_LOAD_START } from "@/lib/page-readiness";
import { beginRoute, markRouteSettled } from "@/lib/motion/route-entry";
import { markEntered } from "@/lib/site-entry";
import { footerNav, legalLinks, org, pillars, primaryAction, primaryNav, resourcesFooterLinks } from "@/content/site";

/** X7 / SYS-02, August, 11 September 2026: the named cover runs for every
 * visit, including a warm link navigation, back/forward and hard refresh.
 * RouteBlink requests it before navigation; pathname changes also cover
 * programmatic navigation. One keyed instance owns each readiness cycle.
 * The first-visit homepage film follows this cover at its existing z-index.
 */

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

export function RouteLoader() {
  const pathname = usePathname();
  const [visit, setVisit] = useState({ id: 0, pathname, navigation: false, completed: false });
  const [seenPath, setSeenPath] = useState(pathname);
  const committed = useRef(pathname);
  const reader = useRef<ReturnType<typeof createPageReadiness> | null>(null);

  // A requested route keeps its existing panel across the commit. History
  // and programmatic navigation get a fresh panel before their first paint.
  if (pathname !== seenPath) {
    setSeenPath(pathname);
    if (visit.pathname !== pathname || visit.completed) {
      setVisit({ id: visit.id + 1, pathname, navigation: false, completed: false });
    }
  }

  useLayoutEffect(() => {
    committed.current = pathname;
    reader.current = createPageReadiness();
    // This runs before the incoming page's motion effects subscribe.
    beginRoute();
    if (!isPublicRoute(pathname)) {
      markEntered();
      markRouteSettled();
    }
  }, [pathname]);

  useEffect(() => {
    const request = (event: Event) => {
      const { pathname: destination, navigation = true } = (event as CustomEvent<{ pathname: string; navigation?: boolean }>).detail;
      if (!isPublicRoute(destination)) return;
      beginRoute();
      setVisit(current => ({ id: current.id + 1, pathname: destination, navigation, completed: false }));
    };
    window.addEventListener(PAGE_LOAD_START, request);
    return () => window.removeEventListener(PAGE_LOAD_START, request);
  }, []);

  if (!isPublicRoute(visit.pathname)) return null;
  const name = titleFor(visit.pathname) ?? org.name;
  return (
    <PageLoader
      key={visit.id}
      name={name}
      navigation={visit.navigation}
      ready={() => committed.current === visit.pathname && Boolean(reader.current?.check())}
      onReveal={() => {
        reader.current?.release();
        markEntered();
        markRouteSettled();
        setVisit(current => current.id === visit.id ? { ...current, completed: true } : current);
      }}
    />
  );
}
