"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton } from "@/components/layout/ConnectButton";
import { org, primaryAction, primaryNav } from "@/content/site";

/**
 * Navbar / Mobile — Marc's 375×80 frame (2026-09-02): the wordmark at 135×40
 * on the left, a 48px hamburger hit-area on the right (icon vectors from the
 * same frame), and a white panel of nav links plus the Connect action when
 * open. Over the hero — the first viewport height — the bar is transparent
 * with the white cut of the wordmark, like the desktop band; past it (or with
 * the panel open) it becomes the solid white bar with the black cut. The
 * desktop header stays the transparent 130px band; this bar exists below `md`
 * only.
 *
 * The bar is fixed: it slides away as the reader scrolls down and returns on
 * the first upward scroll, so the menu is always one gesture away without
 * sitting on the photography the whole time.
 *
 * The black wordmark is public/brand/logo-wordmark-black.svg — the same
 * authored vectors as the white cut, per build documentation §5 (never
 * recreate or approximate the mark in code).
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  // Hidden while scrolling down, back the moment the reader scrolls up.
  const [hidden, setHidden] = useState(false);
  // Transparent while the bar sits over the hero (the first viewport height);
  // solid white for everything after it.
  const [overHero, setOverHero] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    let last = window.scrollY;
    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      const delta = y - last;
      const heroY = window.innerHeight - 64;
      // Over the hero the bar is transparent, so there is nothing to hide —
      // it stays put. Past the hero, hiding needs deliberate downward travel
      // (a dead-zone so rubber-banding and jitters don't flicker it) but ANY
      // upward movement brings it straight back — a slow drag counts, not
      // just a flick.
      if (y < heroY) setHidden(false);
      else if (delta > 6) setHidden(true);
      else if (delta < 0) setHidden(false);
      setOverHero(y < heroY);
      last = y;
      ticking = false;
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  const [seenPath, setSeenPath] = useState(pathname);

  // A route change is a navigation — the panel closes behind it. Done during
  // render (not in an effect) so it never paints an open panel on the new page.
  if (pathname !== seenPath) {
    setSeenPath(pathname);
    setOpen(false);
  }

  // Over the hero the bar is transparent with the white cut of the wordmark;
  // everywhere else (and whenever the panel is open) it is the solid white bar.
  const onGlass = overHero && !open;

  const isHidden = hidden && !open;

  return (
    <div
      className={`fixed inset-x-0 top-0 z-30 transition-[transform,background-color] will-change-transform md:hidden ${
        onGlass ? "bg-transparent text-white" : "bg-white text-black"
      } ${
        // Asymmetric character: the bar gets out of the way quickly and
        // quietly on the way down, and glides back in on the way up — the
        // long `country` tail so it lands without a stop, like the section
        // moves elsewhere on the site.
        isHidden
          ? "-translate-y-full duration-(--dur-small) ease-quiet"
          : "translate-y-0 duration-(--dur-large) ease-country"
      }`}
    >
      <div className="flex h-16 items-center justify-between pl-5 pr-3">
        <Link href="/" aria-label={`${org.name} — home`} className="shrink-0">
          <Image
            src={onGlass ? "/brand/logo-wordmark.svg" : "/brand/logo-wordmark-black.svg"}
            alt={org.name}
            width={135}
            height={40}
            priority
            className="h-10 w-auto"
          />
        </Link>
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex size-12 items-center justify-center"
        >
          {/* The frame's own menu icon — three rounded rules. */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
            {open ? (
              <path
                d="M6.7 5.3a1 1 0 0 0-1.4 1.4L10.6 12l-5.3 5.3a1 1 0 1 0 1.4 1.4L12 13.4l5.3 5.3a1 1 0 0 0 1.4-1.4L13.4 12l5.3-5.3a1 1 0 0 0-1.4-1.4L12 10.6 6.7 5.3Z"
                fill="currentColor"
              />
            ) : (
              <path
                d="M19 17a1 1 0 1 1 0 2H4.938v-.004A1.001 1.001 0 0 1 4 18c0-.531.414-.965.938-.997V17H19Zm0-5a1 1 0 1 1 0 2H5a1 1 0 1 1 0-2h14Zm0-5a1 1 0 1 1 0 2H5a1 1 0 0 1 0-2h14Z"
                fill="currentColor"
              />
            )}
          </svg>
        </button>
      </div>

      {open ? (
        <nav aria-label="Primary" className="border-t border-black/10 px-5 pb-10 pt-2">
          <ul>
            {primaryNav.map((item) => (
              <li key={item.href}>
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
              one water fill (see ConnectButton). */}
          <div className="mt-4">
            <ConnectButton href={primaryAction.href} label={primaryAction.title} />
          </div>
        </nav>
      ) : null}
    </div>
  );
}
