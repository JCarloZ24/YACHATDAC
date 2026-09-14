"use client";

import { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import type { NavChild } from "@/content/site";
import { WaterNavLink } from "@/components/layout/WaterNavLink";
import { useWaterFill } from "@/components/layout/use-water-fill";
import { usePanelTransition } from "@/components/layout/use-panel-transition";

/**
 * D2 amendment, user direction 11 September 2026: About holds the existing
 * organisation pages. Native buttons and links keep click, touch and keyboard
 * navigation available. Its links reuse the header's existing water-fill
 * interaction.
 *
 * 14 September 2026, user direction: the rounded panel animates on entrance
 * and exit. Grammar: "the world opening", About nav panel — the panel rises
 * 6px into place and fades in from its top-right corner on `quiet` over
 * `--dur-small`, and leaves the same way. The state machine that keeps the
 * closing panel mounted is `usePanelTransition`, shared with the mobile
 * submenu. Nothing here is GSAP: a hover menu opens and closes many times a
 * minute and needs no registry.
 */
export function DesktopNavMenu({
  label,
  links,
  overHero,
  headerShown,
}: {
  label: string;
  links: NavChild[];
  overHero: boolean;
  headerShown: boolean;
}) {
  const [open, setOpen] = useState(false);
  const { mounted, state, ref: panelRef, onTransitionEnd } = usePanelTransition<HTMLUListElement>(open);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const panelId = useId();
  const pathname = usePathname();
  // The label is painted exactly as the five sibling links are — see
  // use-water-fill for why that is a rendering fix, not a hover one.
  const { ref: labelRef, handlers: labelHandlers } = useWaterFill<HTMLSpanElement>();
  const [seenPath, setSeenPath] = useState(pathname);

  // A route can also change through the shared transition or browser history.
  if (pathname !== seenPath) {
    setSeenPath(pathname);
    setOpen(false);
  } else if (!headerShown && open) {
    // D2, August, 11 September 2026: scrolling dismisses the whole header.
    // This panel extends below the band and would otherwise remain on-screen.
    setOpen(false);
  }

  useEffect(() => () => clearTimeout(hoverTimer.current), [pathname, headerShown]);

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !root.current?.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, [open]);

  return (
    <div
      ref={root}
      className="relative"
      onPointerEnter={(event) => {
        if (event.pointerType === "touch") return;
        // A brief hover intent avoids opening while crossing the nav. A click
        // cancels it so the first click opens rather than immediately closing.
        clearTimeout(hoverTimer.current);
        hoverTimer.current = setTimeout(() => setOpen(true), 150);
      }}
      onPointerLeave={() => {
        clearTimeout(hoverTimer.current);
        if (!root.current?.contains(document.activeElement)) setOpen(false);
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
      onKeyDown={(event) => {
        if (event.key !== "Escape" || !open) return;
        event.preventDefault();
        event.stopPropagation();
        clearTimeout(hoverTimer.current);
        setOpen(false);
        trigger.current?.focus();
      }}
    >
      <button
        ref={trigger}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        data-over-hero={overHero}
        onClick={() => {
          clearTimeout(hoverTimer.current);
          setOpen((value) => !value);
        }}
        {...labelHandlers}
        /* ⚠ NO `hover:text-gold` ANY MORE. The label below paints a gradient
           clipped to the glyphs, and `currentColor` is that gradient's UNFILLED
           stop — turning it gold on hover would flood the whole word gold and
           there would be nothing left for the fill to do. The chevron keeps a
           gold hover of its own, since it is not text and is not painted. */
        className="eyebrow group flex min-h-11 items-center gap-2 text-base leading-[1.5] tracking-normal whitespace-nowrap text-night-black focus-visible:outline-2 focus-visible:outline-offset-4 data-[over-hero=true]:text-canvas"
      >
        {/* The word is painted through the same utility and the same hook as
            the five links beside it. Before this it was the only item in the
            band rendered with subpixel antialiasing, which read as About being
            set bolder than its neighbours. */}
        <span ref={labelRef} className="water-fill">
          {label}
        </span>
        <svg
          aria-hidden
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
          className="transition-colors duration-(--dur-small) ease-quiet group-hover:text-gold motion-reduce:transition-none"
        >
          <path d={open ? "M1 7L6 2L11 7" : "M1 1L6 6L11 1"} stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>
      <div
        id={panelId}
        hidden={!mounted}
        className="absolute right-0 top-full z-10 w-max min-w-56 max-w-72 pt-3"
      >
        {/* Entrance and exit on the rounded panel: opacity, a 6px rise and a
            short scale about the top-right corner, where the panel hangs from
            the label. The closed pose is the first frame after `hidden`
            lifts, then the hook flips it open on the next commit; the closed
            pose is also the exit, so exit retraces entrance. Grammar: "the world opening",
            About nav panel (14 Sep 2026). */}
        <ul
          ref={panelRef}
          data-state={state}
          onTransitionEnd={onTransitionEnd}
          className="origin-top-right rounded-lg border border-charcoal/10 bg-white p-2 shadow-lg transition-[opacity,translate,scale] duration-(--dur-small) ease-quiet motion-reduce:transition-none data-[state=closed]:pointer-events-none data-[state=closed]:opacity-0 data-[state=closed]:scale-[0.96] data-[state=closed]:-translate-y-1.5"
        >
          {links.map((link) => (
            <li key={link.href}>
              <WaterNavLink
                href={link.href}
                aria-current={pathname === link.href ? "page" : undefined}
                onClick={() => setOpen(false)}
                className="eyebrow block rounded px-4 py-3 text-sm leading-5 tracking-normal text-night-black hover:bg-canvas focus-visible:bg-canvas focus-visible:outline-2 focus-visible:outline-offset-2 aria-[current=page]:bg-canvas"
              >
                {link.title}
              </WaterNavLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
