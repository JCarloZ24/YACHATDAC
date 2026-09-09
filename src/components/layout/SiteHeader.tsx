"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { org, primaryAction, primaryNav } from "@/content/site";
import { ConnectButton } from "@/components/layout/ConnectButton";
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
 * Geometry was Marc's `Navbar / 1 /` (127:5287): a 130px band, 64px side
 * padding at desktop, links gap 32, actions gap 16, and the CTA as a light
 * pill with dark text so it reads over photography. Items stay content-driven
 * (D2). The 31 Aug wireframe settled the pill wording on CONNECT (now in
 * `primaryAction`), links in canvas cream, and the pill's text in midnight.
 *
 * ⚑ DEVIATION from that frame — 9 September 2026, user direction. The nav is
 * now a small mark in the top corners rather than a band across the picture:
 * the header spans the full viewport instead of the 1440 grid, so the links
 * sit at the right viewport margin on any screen rather than centred in a
 * 1440 box with dead space beside them; the band drops 130px → 88px, links
 * 12px → 10px on a 20px gap, and the CONNECT blob 44px → 32px tall. Figma
 * still wins on layout everywhere else — this one was asked for directly, so
 * the frame is out of date rather than the code being wrong. The 64px / 20px
 * viewport margins are unchanged; they are what "right most" means here.
 *
 * ⚑ SECOND DEVIATION — 9 September 2026, user direction. The desktop band was
 * `absolute`, so it scrolled away with the first screen and the nav was gone
 * for the rest of the page. It is now `fixed`, with two states:
 *
 *   · at rest — the 88px band described above, wordmark left, links right;
 *   · condensed, past `CONDENSE_AT` — the wordmark goes (asked for directly:
 *     "remove the logo on the top left if we start scrolling down"), leaving
 *     the links and the CONNECT blob as one small cluster held at the right
 *     viewport margin. The band drops 88px → 56px, links 10px → 9px on a
 *     12px gap, and the blob 32px → 24px.
 *
 * The condensed cluster carries no ground of its own — asked for directly,
 * 9 September 2026, after a charcoal blur was tried behind it and rejected.
 * ⚠ The consequence to watch: this is the one element on the page that
 * cannot know what it is over, and every ground passes beneath it. Canvas
 * cream links survive the hero photography and the charcoal beats; a cream
 * or otherwise light section scrolling under them is where they will go
 * quiet. Fix that in the section's own ground, or by giving the links a
 * ground again — not by recolouring them per page.
 *
 * A threshold, not a ramp: two states with a short ease between them, so
 * React renders twice per crossing rather than once a frame. Mobile is
 * untouched — `MobileNav` has been fixed and scroll-linked since 2 September.
 */

/** Pixels of scroll before the band condenses. Under the mobile bar's hero
 *  ramp on purpose: this one answers the first flick, not the hero's edge. */
const CONDENSE_AT = 48;

export function SiteHeader() {
  const [condensed, setCondensed] = useState(false);

  useEffect(() => {
    let raf = 0;
    const read = () => {
      raf = 0;
      // Setting the same value is a no-op in React, so this is one render per
      // crossing rather than one per scroll event.
      setCondensed(window.scrollY > CONDENSE_AT);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <header data-site-header className="fixed inset-x-0 top-0 z-30">
      {/* Navbar / Mobile — the solid white bar with the black wordmark and
          the hamburger panel. Below md only; the band below is desktop's. */}
      <MobileNav />
      <nav
        aria-label="Primary"
        data-condensed={condensed}
        className="hidden h-[88px] items-center justify-between gap-8 px-6 transition-[height] duration-(--dur-small) ease-quiet data-[condensed=true]:h-14 motion-reduce:transition-none md:flex lg:px-16"
      >
        {/* Condensed, the mark leaves the picture and the tab order with it —
            a link nobody can see is not a link. */}
        <Link
          href="/"
          aria-label={`${org.name} — home`}
          aria-hidden={condensed}
          tabIndex={condensed ? -1 : undefined}
          data-condensed={condensed}
          /* `translate`, not `transform`: Tailwind v4's translate utilities
             write the individual property, so transitioning `transform`
             would ease the fade and cut the slide. */
          className="shrink-0 transition-[opacity,translate] duration-(--dur-small) ease-quiet data-[condensed=true]:pointer-events-none data-[condensed=true]:-translate-x-2 data-[condensed=true]:opacity-0 motion-reduce:transition-none"
        >
          <Image
            src="/brand/logo-wordmark.svg"
            alt={org.name}
            width={216}
            height={64}
            priority
            className="h-8 w-auto sm:h-9"
          />
        </Link>

        <div
          data-condensed={condensed}
          className="flex items-center gap-3 transition-[gap] duration-(--dur-small) ease-quiet data-[condensed=true]:gap-2.5 motion-reduce:transition-none"
        >
          <ul
            data-condensed={condensed}
            className="hidden items-center gap-5 transition-[gap] duration-(--dur-small) ease-quiet data-[condensed=true]:gap-3 motion-reduce:transition-none md:flex"
          >
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  data-condensed={condensed}
                  className="eyebrow text-[10px] whitespace-nowrap text-canvas transition-[color,font-size] duration-(--dur-small) ease-quiet data-[condensed=true]:text-[9px] hover:text-gold motion-reduce:transition-none"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>

          {/* The CTA is the supplied blob asset with the water-fill hover —
              see ConnectButton. Label is baked into the asset. */}
          <ConnectButton
            href={primaryAction.href}
            label={primaryAction.title}
            className={`w-auto transition-[height] duration-(--dur-small) ease-quiet motion-reduce:transition-none ${condensed ? "h-6" : "h-8"}`}
          />
        </div>
      </nav>
    </header>
  );
}
