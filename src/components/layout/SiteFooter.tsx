import Link from "next/link";
import { welcomeToCountry } from "@/content/homepage";
import {
  legalLinks,
  org,
  pillars,
  resourcesFooterLinks,
  resourcesHub,
} from "@/content/site";

/**
 * Site footer. Shared component, every route.
 *
 * Structure follows Marc's hi-fi footer, reconciled against the IA in
 * src/content/site.ts. Four differences from the hi-fi, all deliberate and all
 * recorded in the lo-fi's footer annotation:
 *
 *   1. Living Work is present. The hi-fi lists three pillars and omits the
 *      fourth, which is a navigation gap rather than a style choice — see
 *      STATUS.md note 6.
 *   2. "Open Research Opportunities", not "Open Search Opportunities".
 *   3. One Downloads under Resources, not two.
 *   4. The Cultural Knowledge Precinct appears under Truth.
 *
 * Labels are read from site.ts rather than typed here, so the footer cannot
 * drift from the navigation.
 *
 * ⚠ The Acknowledgement / Welcome to Country slot is deliberately empty. The
 * wording is blocked on Suzanne Thompson (risk R1) and must not be written on
 * her behalf, nor filled from the copy draft — the draft names the Northern
 * Territory, which is the wrong jurisdiction. The placeholder below is visibly
 * marked so it cannot ship by accident.
 */

/**
 * Footer columns, left to right.
 *
 * ⚠ The Connect pillar is titled "About" here, following Marc's hi-fi. That
 * pre-empts open decision D2 ("Does Connect survive as a navigation item?"),
 * so it is a label choice in one place rather than a rename in site.ts.
 */
const FOOTER_COLUMN_TITLES: Record<string, string> = { connect: "About" };

export function SiteFooter() {
  const columns = [
    ...pillars.map((pillar) => ({
      key: pillar.id,
      title: FOOTER_COLUMN_TITLES[pillar.id] ?? pillar.title,
      links: pillar.children,
    })),
    {
      key: "resources",
      title: resourcesHub.title,
      links: resourcesFooterLinks,
    },
  ];

  return (
    <footer className="bg-charcoal text-canvas">
      <div className="mx-auto max-w-7xl space-y-14 px-6 py-16 lg:px-16">
        {/* Acknowledgement — first, and above the navigation. Its placement is
            open decision 3: footer, text only, no ceremony element, no popup. */}
        <div className="space-y-3">
          <h2 className="eyebrow text-ochre">Acknowledgement of Country</h2>
          {welcomeToCountry.status === "awaiting-suzanne" ? (
            <p
              className="max-w-2xl text-sm text-canvas/40 italic"
              data-placeholder="welcome-to-country"
            >
              {welcomeToCountry.placeholder}
            </p>
          ) : null}
        </div>

        <div className="grid gap-10 border-t border-canvas/15 pt-12 md:grid-cols-3 lg:grid-cols-5">
          {columns.map((column) => (
            <div key={column.key} className="space-y-4">
              <h2 className="eyebrow text-ochre">{column.title}</h2>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link.title}>
                    <Link
                      href={link.href}
                      className="text-sm text-canvas/65 transition-colors hover:text-canvas"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 border-t border-canvas/15 pt-8 text-xs text-canvas/45 md:flex-row md:items-center md:justify-between">
          <p className="max-w-xl">{org.legalName}</p>
          <ul className="flex flex-wrap gap-6">
            <li>© {org.name}</li>
            {legalLinks.map((link) => (
              <li key={link.title}>
                <Link href={link.href} className="hover:text-canvas">
                  {link.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
