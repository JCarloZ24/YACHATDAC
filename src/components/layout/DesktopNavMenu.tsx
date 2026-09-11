"use client";

import { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import type { NavChild } from "@/content/site";
import { WaterNavLink } from "@/components/layout/WaterNavLink";

/**
 * D2 amendment, user direction 11 September 2026: About holds the existing
 * organisation pages. Native buttons and links keep click, touch and keyboard
 * navigation available. The panel changes state immediately; its links reuse
 * the header's existing water-fill interaction. No additional opening motion.
 */
export function DesktopNavMenu({
  label,
  links,
  overHero,
}: {
  label: string;
  links: NavChild[];
  overHero: boolean;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const panelId = useId();
  const pathname = usePathname();
  const [seenPath, setSeenPath] = useState(pathname);

  // A route can also change through the shared transition or browser history.
  if (pathname !== seenPath) {
    setSeenPath(pathname);
    setOpen(false);
  }

  useEffect(() => () => clearTimeout(hoverTimer.current), []);

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
        className="eyebrow flex min-h-11 items-center gap-2 text-base leading-[1.5] tracking-normal whitespace-nowrap text-night-black hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-4 data-[over-hero=true]:text-canvas"
      >
        {label}
        <svg aria-hidden width="12" height="8" viewBox="0 0 12 8" fill="none">
          <path d={open ? "M1 7L6 2L11 7" : "M1 1L6 6L11 1"} stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>
      <div
        id={panelId}
        hidden={!open}
        className="absolute right-0 top-full z-10 w-max min-w-56 max-w-72 pt-3"
      >
        <ul className="rounded-lg border border-charcoal/10 bg-white p-2 shadow-lg">
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
