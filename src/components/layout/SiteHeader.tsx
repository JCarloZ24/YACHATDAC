import { DesktopNav } from "@/components/layout/DesktopNav";
import { MobileNav } from "@/components/layout/MobileNav";

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
 * ⚑ 9 Sep 2026, user direction. The desktop band is no longer markup here: it
 * moved to DesktopNav so it can carry the mobile bar's scroll-linked
 * hide/show and white fade, plus a hover-at-the-top reveal of its own. This
 * component is now just the pairing of the two bars — both are fixed, so the
 * header itself holds no geometry.
 */
export function SiteHeader() {
  return (
    <header data-site-header className="absolute inset-x-0 top-0 z-30">
      {/* Below md: the solid white bar with the hamburger panel. From md: the
          130px band. Each owns its own breakpoint. */}
      <MobileNav />
      <DesktopNav />
    </header>
  );
}
