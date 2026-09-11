"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { org, primaryAction, primaryNav } from "@/content/site";
import { ConnectButton } from "@/components/layout/ConnectButton";
import { WaterNavLink } from "@/components/layout/WaterNavLink";
import { MobileNav } from "@/components/layout/MobileNav";
import { DesktopNavMenu } from "@/components/layout/DesktopNavMenu";
import { navHeroFoot } from "@/lib/nav-hero";

/**
 * Site header.
 *
 * ★ THE REAL WORDMARK IS NOW IN. Extracted from Marc's hi-fi navbar, node
 * 17:260 (a 15-vector group) on the "Reference — Marc's hi-fi" page, exported
 * whole to public/brand/logo-wordmark.svg — with the black cut of the same
 * authored vectors at public/brand/logo-wordmark-black.svg.
 *
 * This is the correct way to satisfy build documentation §5 — "do NOT recreate
 * or approximate it in code". Exporting the artist's actual vector is not
 * recreating it; the previous text placeholder was an approximation and is now
 * gone. Do not restyle, recolour or redraw this asset. It ships as authored.
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
 * padding at desktop, links gap 32, actions gap 16, and the CTA as a pill.
 * Items stay content-driven (D2). The 31 Aug wireframe settled the pill
 * wording on CONNECT (now in `primaryAction`).
 *
 * ⚑ DEVIATION from that frame — 9 September 2026, user direction. The header's
 * GROUND spans the full viewport instead of stopping at 1440. Its CONTENTS do
 * not: that was tried and reported back as looking oversized on a 1920 monitor
 * the same day, which it was — 64px from the edges of a 1920 screen leaves a
 * quarter of the band empty in the middle. The ground is the full width, the
 * row inside it is the 1440 column.
 *
 * The same direction also shrank the band to a small corner mark — 88px tall,
 * 10px links on a 20px gap, a 32px blob. ⚑ THAT IS REVERSED (same day, later):
 * August supplied the frame's own CSS for the cluster and the band is back at
 * `Navbar / 1 /` size. Every number below is from that export:
 *
 * ⚠ EVERY ONE OF THESE IS A 1440 VALUE, and the band is built as such: it is
 * drawn from `lg` (1024) up, `MobileNav` covers everything below it — tablet
 * widths included, because there is no frame for one and CLAUDE.md forbids
 * inventing a step — and its contents sit on a centred `max-w-[1440px]` row
 * rather than on the viewport. Only the white ground is full-bleed.
 *
 *   | Frame          | Here                                              |
 *   | -------------- | ------------------------------------------------- |
 *   | band 130px     | `h-[130px]`                                       |
 *   | wordmark 56px  | `h-14` (188.888 × 56 at x=64)                      |
 *   | Column 642×44  | links + actions, `gap-8` (32)                      |
 *   | Nav links 494  | `gap-8` (32) between five links                    |
 *   | Link 16/150%   | `.eyebrow text-base leading-[1.5] tracking-normal` |
 *   | Link #000000   | `text-night-black`                                |
 *   | Actions 116×44 | `h-11` — the blob asset's own viewBox, 1:1         |
 *   | CONNECT #FFF   | `TONES.onLight.label` in ConnectButton            |
 *
 * ⚑ AND THE CONDENSE BEHAVIOUR IS GONE with it. It existed to answer "remove
 * the logo on the top left if we start scrolling down" while the band still
 * sat on the picture the whole time. The band now LEAVES on scroll entirely
 * (below), which answers that direction more completely than shrinking ever
 * did — and a shrunken band would contradict the frame the reveal is supposed
 * to bring back. Two directions, one behaviour. If the small corner cluster is
 * wanted again it is in the git history at this date, but it cannot coexist
 * with the supplied frame.
 *
 * ⚑ SECOND DEVIATION — 9 September 2026, user direction. The desktop band was
 * `absolute`, so it scrolled away with the first screen and the nav was gone
 * for the rest of the page. It is now `fixed`.
 *
 * ⚑ THIRD DEVIATION — 9 September 2026, user direction, from a supplied
 * 2880×260 navbar drawing. The desktop band now has TWO GROUNDS, and which
 * one it wears is decided by what is under it rather than by distance:
 *
 *   · OVER THE HERO — no ground at all. The band is transparent, the wordmark
 *     is the white cut, the links are canvas cream and the CONNECT blob is
 *     the supplied cream-with-midnight-label asset. This is the band as it
 *     has always been, and it is what sits on the photography.
 *   · PAST THE HERO — solid white. The wordmark is the black cut, the links
 *     are night black, and the blob inverts to black with a cream label
 *     (`tone="onLight"`, see ConnectButton). This is the supplied drawing.
 *
 * The crossing point is the foot of `[data-nav-hero]` — the element each page
 * marks as its opening screen — reaching the foot of the band, so a short hero
 * and a 130svh one both hand over at their own edge. Pages that mark no hero
 * fall back to one viewport, which is what the mobile bar has always used.
 * ⚠ IF A PAGE'S OPENING SECTION IS NOT TAGGED the band goes white a viewport
 * in, which on a taller hero means a white bar over photography. Tag the
 * hero; do not recolour the links per page.
 *
 * This retires the earlier "cannot know what it is over" warning: past the
 * hero the band now brings its own ground, so no section beneath it can take
 * the links quiet.
 *
 * ⚑ FOURTH DEVIATION — 9 September 2026, user direction: "hide nav bar when
 * scrolling down, show nav bar on hover on top section of screen." The band
 * now LEAVES once the reader is past `HIDE_AT`, sliding up by its own height,
 * and comes back when the pointer enters the top `REVEAL_ZONE` px of the
 * viewport. So the reading screen is clear and the navigation is one mouse
 * move away.
 *
 * Three things this has to get right, and each is a line of code below:
 *
 *   · SCROLLING UP IS NOT A TRIGGER. The usual pattern brings the bar back on
 *     any upward flick, which would have it appearing constantly and make the
 *     hover pointless. The direction named hover, so hover is what reveals it.
 *     Above `HIDE_AT` the band is simply always there.
 *   · THE HOVER ZONE INTERCEPTS NOTHING. It is a `pointermove` reading of
 *     `clientY`, not an invisible strip across the top of the page — a strip
 *     would eat clicks on whatever section is under it, on every page.
 *   · KEYBOARD REVEALS IT TOO. A hidden bar still holds five links and the
 *     CTA in the tab order, so a `focusin` anywhere inside it brings the band
 *     back. Without that, tabbing from the top of a page moves focus through
 *     six controls that are off-screen.
 *
 * A threshold, not a ramp: React renders on a crossing, not once a frame.
 *
 * ⚑ AND MOBILE NOW AGREES ON WHEN TO GO — 10 September 2026, "hide the nav bar
 * when scrolling down mobile/tablet/laptop/desktop". `MobileNav` used to stay
 * pinned for the whole hero while this band left at 130px, so the two bars
 * disagreed for the length of an opening screen. Both now leave once the
 * reader is past the bar's own height.
 *
 * They still differ on how they COME BACK, and that is the input, not a drift:
 * a phone has no pointer to hover with, so `MobileNav` is dragged back by any
 * upward swipe while this band waits for the pointer at the top of the screen.
 */

/** Height of the band, in px — `Navbar / 1 /`, restored 9 September 2026 from
 *  the supplied frame CSS. The hero hands the white over when its foot reaches
 *  this line rather than the top of the viewport. */
const BAND_H = 130;

/** Pixels of scroll before the band leaves. The band's own height, so it goes
 *  as the first screen goes rather than on the first twitch of the wheel. */
const HIDE_AT = BAND_H;

/** How deep the pointer-reveal strip runs, in px. Also the band's height: what
 *  arrives fills exactly the space the pointer went looking in. */
const REVEAL_ZONE = BAND_H;

export function SiteHeader() {
  /** True until the foot of the page's hero has passed under the band. */
  const [overHero, setOverHero] = useState(true);
  /** True once the reader is far enough down that the band has left. */
  const [gone, setGone] = useState(false);
  /** True while the pointer is in the top strip or the navigation. */
  const [called, setCalled] = useState(false);
  const [focused, setFocused] = useState(false);
  const desktopNav = useRef<HTMLElement>(null);

  useEffect(() => {
    let raf = 0;
    const read = () => {
      raf = 0;
      const y = window.scrollY;
      // Setting the same value is a no-op in React, so this is one render per
      // crossing rather than one per scroll event. The hero's foot is measured
      // by `navHeroFoot` so this band and the phone bar cross at one line.
      setOverHero(y + BAND_H < navHeroFoot());
      setGone(y > HIDE_AT);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  /* The pointer reveal. A `pointermove` reading rather than a hit area, so
     nothing on the page loses a click to an invisible strip — see the header
     note. `pointerout` with no `relatedTarget` is the pointer leaving the
     window entirely (out of the top of the screen, or to another app); without
     it the band would stay called back until the mouse returned. */
  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      // Setting the same value is a no-op in React, so a mouse crossing the
      // page renders this twice — in and out — not once per event.
      // D2 amendment, 11 September 2026: the About panel extends below the
      // reveal strip. Keep the header present while its links are in use.
      const insideNav = event.target instanceof Node && desktopNav.current?.contains(event.target);
      setCalled(event.clientY <= REVEAL_ZONE || Boolean(insideNav));
    };
    const onOut = (event: PointerEvent) => {
      if (!event.relatedTarget) setCalled(false);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerout", onOut, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerout", onOut);
    };
  }, []);

  /* Shown at the top of every page, and past that only when called back. */
  const shown = !gone || called || focused;

  return (
    <header className="fixed inset-x-0 top-0 z-30">
      {/* Navbar / Mobile — the solid white bar with the black wordmark and
          the hamburger panel. Below `lg` only; the band below is desktop's. */}
      <MobileNav />
      <nav
        ref={desktopNav}
        aria-label="Primary"
        data-over-hero={overHero}
        data-shown={shown}
        /* Focus inside a band that has left brings it back — see the header
           note. `focusin`/`focusout` bubble, so one pair on the nav covers
           every link and the CTA inside it. */
        onFocus={() => setFocused(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setFocused(false);
          }
        }}
        /* The offset is an inline `transform`, written the way `MobileNav`
           has written its own since 2 September: a single state-driven value
           is clearer read off the element than assembled from a data-variant
           utility. Nothing else on the band uses `transform` — the wordmark
           crossfades opacity only — so there is no property to fight over. */
        style={{ transform: shown ? "translateY(0)" : "translateY(-100%)" }}
        className="relative hidden h-[130px] transition-transform duration-(--dur-small) ease-quiet motion-reduce:transition-none lg:block"
      >
        {/* The white ground, faded rather than switched: the band crosses the
            hero's edge while the reader is moving, and a hard cut there reads
            as a flash. Behind everything, and inert to the pointer. */}
        <div
          aria-hidden
          data-over-hero={overHero}
          className="pointer-events-none absolute inset-0 -z-10 bg-white transition-opacity duration-(--dur-small) ease-quiet data-[over-hero=true]:opacity-0 motion-reduce:transition-none"
        />

        {/* THE 1440 ROW. The white ground above is full-bleed — a band that
            stopped at 1440 would read as a floating card — but everything IN
            the band is placed on the Desktop/1440 grid, because that is the
            only grid these numbers were drawn on. On a 1920 monitor the
            wordmark and the cluster therefore sit 64px inside a centred 1440
            column rather than 64px from the screen edges, which is what made
            the band read as oversized there (reported 9 September 2026). */}
        <div className="mx-auto flex h-full w-full max-w-[1440px] items-center justify-between gap-8 px-16">
          {/* 188.888 × 56 at x=64 in the frame — `h-14` and the viewport margin
            put it there. It no longer leaves on scroll: the whole band does. */}
          <Link
            href="/"
            aria-label={`${org.name} — home`}
            className="relative shrink-0"
          >
            {/* Two cuts of the SAME authored vector, cross-faded. Neither is
              recoloured in code (build documentation §5); the black cut is its
              own file, and MobileNav has used the pair since 2 September. The
              white one holds the box and the black one is laid over it, so
              the swap costs no layout. */}
            <Image
              src="/brand/logo-wordmark.svg"
              alt={org.name}
              width={216}
              height={64}
              priority
              className="h-14 w-auto"
            />
            <Image
              src="/brand/logo-wordmark-black.svg"
              alt=""
              aria-hidden
              width={216}
              height={64}
              priority
              data-over-hero={overHero}
              className="absolute inset-0 h-14 w-auto transition-opacity duration-(--dur-small) ease-quiet data-[over-hero=true]:opacity-0 motion-reduce:transition-none"
            />
          </Link>

          {/* Column — the frame's 642 × 44 cluster: the links block and the
            actions block, 32px apart, both centred on the band. (494 + 32 +
            116 = 642. The frame's other 16px gap is INSIDE Actions, between
            action items, and there is only one of those.) */}
          <div className="flex items-center gap-8">
            {/* D2, 11 September 2026: the About disclosure adds a chevron to
                the frame's five links; the 32px spacing stays the same. */}
            <ul className="flex items-center gap-8">
              {primaryNav.map((item) => (
                <li key={item.href}>
                  {item.children?.length ? (
                    <DesktopNavMenu label={item.title} links={item.children} overHero={overHero} />
                  ) : (
                    <WaterNavLink
                      href={item.href}
                      data-over-hero={overHero}
                      /* Link text — Bantayog Sans 700 / 16px / 150% / #000000 in
                     the frame. `.eyebrow` is the Bantayog utility (the repoint;
                     see the typography skill) and carries the house 0.12em
                     tracking, which `tracking-normal` takes back off: the
                     frame's own link widths (WONDER 67, TRUTH 51, LIVING WORK
                     101, THE RECORD 95, ABOUT 52 — 494 with the four gaps)
                     only add up at zero.

                     Cream over the photography, night black in the white
                     bar — the RESTING colour only. Hover is the CONNECT
                     blob's waterline, spreading gold from wherever the cursor
                     entered the word (10 September 2026; see WaterNavLink).
                     There is no `hover:text-gold` here any more: the gradient
                     paints the glyphs. `transition-colors` stays, so the base
                     still eases across the hero's edge underneath the fill.

                     ⚠ Gold is 2.83:1 on white, under AA for text. It is a
                     hover state on a five-item nav whose rest colour is #000,
                     and it was the direction. Do not copy this pairing into
                     page copy — see the warning on --color-ochre in
                     globals.css. */
                      className="eyebrow text-base leading-[1.5] tracking-normal whitespace-nowrap text-night-black transition-colors duration-(--dur-small) ease-quiet data-[over-hero=true]:text-canvas motion-reduce:transition-none"
                    >
                      {item.title}
                    </WaterNavLink>
                  )}
                </li>
              ))}
            </ul>

            {/* The CTA is the supplied blob asset with the water-fill hover —
              see ConnectButton. Label is baked into the asset; the tone flips
              the blob and the label, not the geometry. */}
            <ConnectButton
              href={primaryAction.href}
              label={primaryAction.title}
              tone={overHero ? "onDark" : "onLight"}
              /* Actions — 116 × 44 in the frame, which is the asset's own
               viewBox, so `h-11` renders it 1:1. */
              className="h-11 w-auto"
            />
          </div>
        </div>
      </nav>
    </header>
  );
}
