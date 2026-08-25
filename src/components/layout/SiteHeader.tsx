import Image from "next/image";
import Link from "next/link";
import { org, pillars } from "@/content/site";

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
 * ⚠ THIS NAVBAR ITSELF IS AN UNRESOLVED DIVERGENCE — readout §2.
 * Marc's hi-fi carries a persistent navbar. The homepage copy draft specifies
 * NO navigation until block 6, and says so as an argument rather than an
 * oversight: "Blocks 1–5 carry NO nav bar and NO links. First navigation is
 * block 6. This is the page's argument, not an oversight." (lo-fi note 4:61).
 *
 * The code has always rendered a header, so it already sides with the hi-fi.
 * Left that way rather than silently switching sides mid-prototype, but it is
 * a genuine design decision for the team and not settled by this file.
 */

/** Marc's navbar: the three pillars, then CONNECT as a filled pill. */
const CONNECT_HREF = "/connect";

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
            {pillars.map((pillar) => (
              <li key={pillar.id}>
                <Link
                  href={pillar.href}
                  className="eyebrow text-xs text-white transition-colors hover:text-gold"
                >
                  {pillar.title}
                </Link>
              </li>
            ))}
          </ul>

          <Link
            href={CONNECT_HREF}
            className="eyebrow rounded-full bg-charcoal px-6 py-3 text-xs text-white transition-colors hover:bg-oxide"
          >
            Connect
          </Link>
        </div>
      </nav>
    </header>
  );
}
