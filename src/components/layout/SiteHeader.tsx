import Image from "next/image";
import Link from "next/link";
import { org, primaryAction, primaryNav } from "@/content/site";
import { ConnectButton } from "@/components/layout/ConnectButton";

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
 * D24 (no nav until The Invitation on the homepage) is SUPERSEDED by the
 * 31 Aug wireframe direction: this header is persistent and reused on every
 * page, homepage included. The code has always rendered it persistently, so
 * the direction and the behaviour now agree.
 */

/**
 * Geometry is Marc's `Navbar / 1 /` (127:5287): a 130px band, 64px side
 * padding at desktop, links gap 32, actions gap 16, and the CTA as a light
 * pill with dark text so it reads over photography. Items stay content-driven
 * (D2). The 31 Aug wireframe settled the pill wording on CONNECT (now in
 * `primaryAction`), links in canvas cream, and the pill's text in midnight.
 */
export function SiteHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <nav
        aria-label="Primary"
        className="mx-auto flex h-[130px] max-w-[1440px] items-center justify-between gap-8 px-6 lg:px-16"
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

        <div className="flex items-center gap-4">
          <ul className="hidden items-center gap-8 md:flex">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="eyebrow text-xs whitespace-nowrap text-canvas transition-colors duration-(--dur-small) ease-quiet hover:text-gold"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>

          {/* The CTA is the supplied blob asset with the water-fill hover —
              see ConnectButton. Label is baked into the asset. */}
          <ConnectButton href={primaryAction.href} label={primaryAction.title} />
        </div>
      </nav>
    </header>
  );
}
