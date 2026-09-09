"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ConnectButton } from "@/components/layout/ConnectButton";
import { org, primaryAction, primaryNav } from "@/content/site";

/**
 * Navbar / Desktop — Marc's `Navbar / 1 /` (127:5287) geometry unchanged: a
 * 130px band, 64px side padding, links gap 32, actions gap 16, the CONNECT
 * blob on the right.
 *
 * ⚑ 9 Sep 2026, user direction. The band now carries the same behaviour the
 * mobile bar has had since 2026-09-02, and one addition of its own:
 *
 *   · Scroll-linked hide/show. The bar is fixed and moves WITH the wheel —
 *     each downward delta pushes it out by the same distance, any upward one
 *     drags it back, and when the scroll settles it snaps to the nearer edge.
 *     Not a timer, not a threshold.
 *   · The solid fade. Transparent over the hero with the white cut of the
 *     wordmark and cream links; ramped to solid white with the black cut and
 *     midnight links over the last 96px of the hero, so the white arrives
 *     with the scroll rather than switching at a line.
 *   · Hover-to-reveal (desktop only — there is no hover on the phone). With
 *     the pointer in the top band of the viewport the bar is pinned shown,
 *     whatever the scroll has done to it. Move away and the scroll takes it
 *     back. This is what replaces the phone's upward swipe.
 *
 * Both cuts of the wordmark are in the DOM and crossfade; swapping the src at
 * the threshold refetched and popped the mark. Per build documentation §5 the
 * mark is only ever rendered from its authored vectors — never redrawn here.
 */

/** How far down the viewport the pointer counts as "at the top". */
const HOVER_BAND = 130;

export function DesktopNav() {
  const bar = useRef<HTMLElement>(null);
  const solidMark = useRef<HTMLImageElement>(null);
  const glassMark = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const el = bar.current;
    if (!el) return;
    let last = window.scrollY;
    let offset = 0;
    let solid = -1;
    let raf = 0;
    let settle = 0;
    let hovering = false;

    const paint = () => {
      el.style.transform = `translate3d(0,${-offset}px,0)`;
    };
    const paintSolid = (next: number) => {
      if (next === solid) return;
      solid = next;
      el.style.backgroundColor = `rgba(255,255,255,${next})`;
      el.style.color = next > 0.5 ? "var(--color-midnight)" : "var(--color-canvas)";
      if (glassMark.current) glassMark.current.style.opacity = String(1 - next);
      if (solidMark.current) solidMark.current.style.opacity = String(next);
    };

    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const delta = y - last;
      last = y;
      const height = el.offsetHeight || 130;
      const heroY = window.innerHeight - height;

      paintSolid(Math.min(1, Math.max(0, (y - (heroY - 96)) / 96)));

      // Pointer in the top band pins the bar shown; otherwise the wheel
      // carries it, and over the hero it stays put.
      if (hovering || y < heroY || y <= 0) offset = 0;
      else offset = Math.min(height, Math.max(0, offset + delta));

      if (hovering) {
        // The reveal is the one moment the bar animates rather than tracks —
        // it has to cross whatever gap the scroll left, on its own.
        el.style.transitionProperty = "transform";
        el.style.transitionDuration = "var(--dur-small)";
        el.style.transitionTimingFunction = "var(--ease-quiet)";
      } else {
        el.style.transitionProperty = "none";
      }
      paint();

      window.clearTimeout(settle);
      settle = window.setTimeout(() => {
        if (hovering || offset === 0 || offset === height) return;
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
    const onPointerMove = (e: PointerEvent) => {
      // Coarse pointers (touch on a large tablet) have no hover to speak of —
      // a tap would otherwise pin the bar open until the next move.
      if (e.pointerType === "touch") return;
      const next = e.clientY <= HOVER_BAND;
      if (next === hovering) return;
      hovering = next;
      onScroll();
    };
    const onPointerLeave = () => {
      if (!hovering) return;
      hovering = false;
      onScroll();
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerleave", onPointerLeave);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
      cancelAnimationFrame(raf);
      window.clearTimeout(settle);
    };
  }, []);

  return (
    <nav
      ref={bar}
      aria-label="Primary"
      className="fixed inset-x-0 top-0 z-30 hidden bg-transparent text-white will-change-transform md:block"
    >
      <div className="mx-auto flex h-[130px] max-w-[1440px] items-center justify-between gap-8 px-6 lg:px-16">
        <Link
          href="/"
          aria-label={`${org.name} — home`}
          className="relative block shrink-0"
        >
          <Image
            ref={glassMark}
            src="/brand/logo-wordmark.svg"
            alt={org.name}
            width={216}
            height={64}
            priority
            className="h-9 w-auto sm:h-11"
          />
          <Image
            ref={solidMark}
            src="/brand/logo-wordmark-black.svg"
            alt=""
            aria-hidden
            width={216}
            height={64}
            priority
            className="absolute inset-0 h-9 w-auto opacity-0 sm:h-11"
          />
        </Link>

        <div className="flex items-center gap-4">
          <ul className="flex items-center gap-8">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  /* Colour is written on the band per frame (cream over the
                     hero, midnight on the white); the links inherit it so the
                     fade carries them with it. */
                  className="eyebrow text-xs whitespace-nowrap text-current transition-colors duration-(--dur-small) ease-quiet hover:text-gold"
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
      </div>
    </nav>
  );
}
