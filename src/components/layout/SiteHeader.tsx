import Image from "next/image";
import Link from "next/link";
import { org, primaryAction, primaryNav } from "@/content/site";

/**
 * Site header.
 *
 * ★ THE REAL WORDMARK IS NOW IN. Extracted from Marc's hi-fi navbar, node
 * 17:260 (a 15-vector group) on the "Reference — Marc's hi-fi" page, exported
 * whole to public/brand/logo-wordmark.svg.
 *
 * This is the correct way to satisfy build documentation §5 — "do NOT recreate
 * or approximate it in code". Exporting the artist's actual vector is not
 * recreating it; the previous text placeholder was an approximation and is now
 * gone. Do not restyle, recolour or redraw this asset. It ships as authored
 * (its paths are already fill="white", so it needs no filter over the hero).
 *
 * ⚑ D2 — FINAL (26 Aug). The nav is `primaryNav`: Wonder · Truth · Living Work
 * · The Record · About, with "Get in touch" as a button. Connect is retired as
 * a nav item and kept as a destination. This is the shape both the v2 and v3
 * client drafts independently produced.
 *
 * ⚠ D24 — FINAL (26 Aug), AND THIS FILE DOES NOT YET IMPLEMENT IT. The homepage
 * copy draft specifies NO navigation until The Invitation, and says so as an
 * argument rather than an oversight: "Blocks 1–5 carry NO nav bar and NO links.
 * First navigation is block 6. This is the page's argument, not an oversight."
 * D24 went Final in favour of the draft, so this header should not render over
 * the homepage hero — it should appear when The Invitation does.
 *
 * That is a scroll-driven behaviour change in a shared layout component and it
 * belongs with whoever owns the header, so it is recorded here rather than
 * done: the lo-fi draws it correctly (no header band on the Home frame, an
 * annotation saying where it appears) and the code still renders persistently.
 */

export function SiteHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-6 py-8 lg:px-16"
      >
        <Link href="/" aria-label={`${org.name} — home`} className="shrink-0">
          <Image
            src="/brand/logo-wordmark.svg"
            alt={org.name}
            width={216}
            height={64}
            priority
            className="h-9 w-auto sm:h-11"
          />
        </Link>

        <div className="flex items-center gap-6 lg:gap-10">
          <ul className="hidden items-center gap-6 md:flex lg:gap-10">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="eyebrow text-xs text-white transition-colors hover:text-gold"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>

          <Link
            href={primaryAction.href}
            className="eyebrow rounded-full bg-charcoal px-6 py-3 text-xs text-white transition-colors hover:bg-oxide"
          >
            {primaryAction.title}
          </Link>
        </div>
      </nav>
    </header>
  );
}
