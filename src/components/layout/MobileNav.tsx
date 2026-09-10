"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton } from "@/components/layout/ConnectButton";
import { org, primaryAction, primaryNav } from "@/content/site";
import { navHeroFoot } from "@/lib/nav-hero";

/**
 * Navbar / Mobile — Marc's 375×80 frame (2026-09-02): the wordmark at 135×40
 * on the left, a 48px hamburger hit-area on the right (icon vectors from the
 * same frame), and a white panel of nav links plus the Connect action when
 * open. Over the hero — the first viewport height — the bar is transparent
 * with the white cut of the wordmark, like the desktop band; past it (or with
 * the panel open) it becomes the solid white bar with the black cut.
 *
 * ⚑ THIS BAR RUNS BELOW `lg`, NOT BELOW `md` (9 September 2026). The V2 file
 * has two grids — Mobile/375 and Desktop/1440 — and every number in the
 * desktop band is the 1440 column, so the band may only be drawn where `lg:`
 * values apply. Between 768 and 1024 there is no frame to build from, and
 * inventing a tablet step is what the house rule forbids: this bar covers it.
 *
 * The bar is fixed and scroll-linked: it slides away with a downward swipe
 * and is dragged back by any upward one, moving with the thumb rather than
 * on a timer, so the menu is always one gesture away without sitting on the
 * photography the whole time. The white fade across the hero's edge tracks
 * the scroll the same way.
 *
 * The black wordmark is public/brand/logo-wordmark-black.svg — the same
 * authored vectors as the white cut, per build documentation §5 (never
 * recreate or approximate the mark in code).
 */
/** Bar height, px — the supplied 375×80 frame (9 September 2026). Kept as a
 *  constant because the scroll-link measures against it before layout. */
const BAR_H = 80;

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const bar = useRef<HTMLDivElement>(null);
  const solidMark = useRef<HTMLImageElement>(null);
  const glassMark = useRef<HTMLImageElement>(null);
  const pathname = usePathname();

  /* Scroll-linked, not timed: on a phone the bar should move WITH the thumb.
     Two values are written straight to the DOM every frame (no React render
     per scroll):
       · offset — how far the bar has slid away (0 = fully shown, height =
         fully hidden). Each scroll delta moves it by the same distance, so
         a swipe down pushes it out and any swipe up drags it back; when the
         scroll settles it snaps to whichever edge is nearer.
       · solid — 0 over the hero (transparent bar, white cut of the wordmark)
         to 1 past it, ramped over the last 96px of the hero so the white
         fades in with the scroll instead of switching at a line. The hero's
         foot comes from `navHeroFoot`, so this bar and the desktop band hand
         over at the same edge; it used to be a flat viewport height, which was
         wrong on every hero that is not exactly 100svh.
     With the panel open the bar is pinned shown and solid. */
  useEffect(() => {
    const el = bar.current;
    if (!el) return;
    let last = window.scrollY;
    let offset = 0;
    let solid = -1;
    let raf = 0;
    let settle = 0;

    const paint = () => {
      el.style.transform = `translate3d(0,${-offset}px,0)`;
    };
    const paintSolid = (next: number) => {
      if (next === solid) return;
      solid = next;
      el.style.backgroundColor = `rgba(255,255,255,${next})`;
      el.style.color = next > 0.5 ? "#000" : "#fff";
      if (glassMark.current) glassMark.current.style.opacity = String(1 - next);
      if (solidMark.current) solidMark.current.style.opacity = String(next);
    };

    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const delta = y - last;
      last = y;
      const height = el.offsetHeight || BAR_H;
      const heroY = navHeroFoot() - BAR_H;

      if (el.dataset.open === "true") {
        offset = 0;
        el.style.transitionProperty = "none";
        paint();
        paintSolid(1);
        return;
      }

      // The ramp: transparent until 96px before the hero's edge, solid at it.
      paintSolid(Math.min(1, Math.max(0, (y - (heroY - 96)) / 96)));

      // Over the hero (and rubber-banding past the top) the bar stays put.
      if (y < heroY || y <= 0) offset = 0;
      else offset = Math.min(height, Math.max(0, offset + delta));
      el.style.transitionProperty = "none";
      paint();

      // When the thumb lifts and the scroll stops, settle to the nearer edge
      // with the short quiet ease — never leave the bar half-shown.
      window.clearTimeout(settle);
      settle = window.setTimeout(() => {
        if (offset === 0 || offset === height) return;
        offset = offset > height / 2 ? height : 0;
        el.style.transitionProperty = "transform";
        el.style.transitionDuration = "var(--dur-small)";
        el.style.transitionTimingFunction = "var(--ease-quiet)";
        paint();
      }, 120);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
      window.clearTimeout(settle);
    };
  }, []);

  // Opening pins the bar shown and solid at once. Closing is the exit in
  // two beats: the bar stays solid while the panel folds (the small
  // duration), then hands back to the scroll — and over the hero that
  // hand-back is a fade to transparent (background, colour and the wordmark
  // crossfade all transitioned for one small beat) rather than a cut.
  useEffect(() => {
    const el = bar.current;
    if (!el) return;
    if (open) {
      el.dataset.open = "true";
      window.dispatchEvent(new Event("scroll"));
      return;
    }
    const fade: HTMLElement[] = [el];
    if (glassMark.current) fade.push(glassMark.current);
    if (solidMark.current) fade.push(solidMark.current);
    const FOLD = 320; // --dur-small
    const t1 = window.setTimeout(() => {
      el.dataset.open = "false";
      fade.forEach((node) => node.classList.add("mobile-nav-exit"));
      window.dispatchEvent(new Event("scroll"));
    }, FOLD);
    const t2 = window.setTimeout(() => {
      fade.forEach((node) => node.classList.remove("mobile-nav-exit"));
    }, FOLD * 2);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [open]);

  const [seenPath, setSeenPath] = useState(pathname);

  // A route change is a navigation — the panel closes behind it. Done during
  // render (not in an effect) so it never paints an open panel on the new page.
  if (pathname !== seenPath) {
    setSeenPath(pathname);
    setOpen(false);
  }

  return (
    <div
      ref={bar}
      data-open={open}
      /* Initial paint: transparent over the hero with the white cut; the
         effect takes over from the first frame. Background/colour are
         written per frame, so only the wordmark crossfade is transitioned. */
      className="fixed inset-x-0 top-0 z-30 bg-transparent text-white will-change-transform lg:hidden"
    >
      <div className="flex h-20 items-center justify-between pl-5 pr-3">
        <Link
          href="/"
          aria-label={`${org.name} — home`}
          className="relative block h-10 shrink-0"
        >
          {/* Both cuts of the wordmark are in the DOM, stacked, and crossfade
              with the bar — swapping the image source at the threshold
              popped (and refetched) the mark on every crossing. */}
          <Image
            ref={glassMark}
            src="/brand/logo-wordmark.svg"
            alt={org.name}
            width={135}
            height={40}
            priority
            className="h-10 w-auto"
          />
          <Image
            ref={solidMark}
            src="/brand/logo-wordmark-black.svg"
            alt=""
            aria-hidden
            width={135}
            height={40}
            priority
            className="absolute inset-0 h-10 w-auto opacity-0"
          />
        </Link>
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex size-12 items-center justify-center"
        >
          {/* The frame's own menu icon — three rounded rules. The outer two
              turn into the cross and the middle one fades, the rules
              themselves moving rather than a swap between two glyphs. */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
            className="overflow-visible"
          >
            {[
              { y: 7, open: "translate(0, 5px) rotate(45deg)" },
              { y: 12, open: "scaleX(0)" },
              { y: 17, open: "translate(0, -5px) rotate(-45deg)" },
            ].map((rule) => (
              <line
                key={rule.y}
                x1="5"
                x2="19"
                y1={rule.y}
                y2={rule.y}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className={`origin-center transition-transform ${
                  open
                    ? "duration-(--dur-medium) ease-country"
                    : "duration-(--dur-small) ease-quiet"
                }`}
                style={{
                  transformBox: "fill-box",
                  transform: open ? rule.open : "none",
                }}
              />
            ))}
          </svg>
        </button>
      </div>

      {/* The panel is always in the DOM and folds open/closed on a grid row
          (0fr → 1fr), so it can animate both ways: opening unfolds at the
          medium duration with the country ease, the links stepping in on the
          line stagger; closing folds at the small duration with the quiet
          ease and the links leaving together, so the exit is quicker and
          quieter than the entrance. Reduced motion cuts both (global rule in
          motion-tokens.css). inert/aria-hidden keep the closed panel out of
          the tab order and the accessibility tree. */}
      <div
        className={`grid ${
          open
            ? "grid-rows-[1fr] duration-(--dur-medium) ease-country"
            : "grid-rows-[0fr] duration-(--dur-small) ease-quiet"
        } transition-[grid-template-rows]`}
        aria-hidden={!open}
        inert={!open}
      >
        <nav
          aria-label="Primary"
          className={`min-h-0 overflow-hidden px-5 transition-[padding] ${
            open ? "pb-10 pt-2" : "py-0"
          }`}
        >
          <ul className={`border-t transition-colors ${open ? "border-black/10" : "border-transparent"}`}>
            {primaryNav.map((item, i) => (
              <li
                key={item.href}
                className={`transition-[opacity,transform] ${
                  open
                    ? "translate-y-0 opacity-100 duration-(--dur-medium) ease-country"
                    : "translate-y-2 opacity-0 duration-(--dur-small) ease-quiet"
                }`}
                style={{
                  transitionDelay: open
                    ? `calc(${i + 1} * var(--stagger-line))`
                    : "0ms",
                }}
              >
                <Link
                  href={item.href}
                  className="block py-3 text-base leading-6 text-black"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
          {/* The same CONNECT blob as the desktop header — one CTA, one asset,
              one water fill (see ConnectButton). `onLight`, because the panel
              only ever opens on the solid white bar: the cream cut of the blob
              would be invisible on it (9 September 2026, user direction — the
              button is black wherever the bar is white). */}
          <div
            className={`mt-4 transition-[opacity,transform] ${
              open
                ? "translate-y-0 opacity-100 duration-(--dur-medium) ease-country"
                : "translate-y-2 opacity-0 duration-(--dur-small) ease-quiet"
            }`}
            style={{
              transitionDelay: open
                ? `calc(${primaryNav.length + 1} * var(--stagger-line))`
                : "0ms",
            }}
          >
            <ConnectButton
              href={primaryAction.href}
              label={primaryAction.title}
              tone="onLight"
            />
          </div>
        </nav>
      </div>
    </div>
  );
}
