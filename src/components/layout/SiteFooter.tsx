import Link from "next/link";
import { org, pillars } from "@/content/site";
import { welcomeToCountry } from "@/content/homepage";

/**
 * Site footer.
 *
 * Carries the Welcome to Country / Acknowledgement (open decision 3): footer
 * placement, text only, no ceremony element and no popup. The wording itself
 * is blocked on Suzanne Thompson and must not be written on her behalf — the
 * placeholder below is visibly marked so it cannot ship by accident.
 */
export function SiteFooter() {
  return (
    <footer className="bg-charcoal text-canvas">
      <div className="mx-auto max-w-7xl space-y-14 px-6 py-16 lg:px-16">
        <div className="grid gap-10 md:grid-cols-4">
          {pillars.map((pillar) => (
            <div key={pillar.id} className="space-y-4">
              <h2 className="eyebrow text-ochre">{pillar.title}</h2>
              <ul className="space-y-2">
                {pillar.children.map((child) => (
                  <li key={child.title}>
                    <Link
                      href={child.href}
                      className="text-sm text-canvas/65 transition-colors hover:text-canvas"
                    >
                      {child.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="space-y-3 border-t border-canvas/15 pt-10">
          <h2 className="eyebrow text-canvas/60">Welcome to Country</h2>
          {welcomeToCountry.status === "awaiting-suzanne" ? (
            <p
              className="max-w-2xl text-sm text-canvas/40 italic"
              data-placeholder="welcome-to-country"
            >
              {welcomeToCountry.placeholder}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-4 border-t border-canvas/15 pt-8 text-xs text-canvas/45 md:flex-row md:items-center md:justify-between">
          <p className="max-w-xl">{org.legalName}</p>
          <ul className="flex gap-6">
            <li>
              <Link href="/legal/privacy" className="hover:text-canvas">
                Privacy
              </Link>
            </li>
            <li>
              <Link href="/legal/terms" className="hover:text-canvas">
                Terms
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
