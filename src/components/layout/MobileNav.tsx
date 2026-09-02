"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { org, primaryAction, primaryNav } from "@/content/site";

/**
 * Navbar / Mobile — Marc's 375×80 frame (2026-09-02): a solid white bar,
 * the wordmark in black at 135×40 on the left, a 48px hamburger hit-area on
 * the right (icon vectors from the same frame), and a white panel of nav
 * links plus the Connect action when open. The desktop header stays the
 * transparent 130px band; this bar exists below `md` only.
 *
 * The black wordmark is public/brand/logo-wordmark-black.svg — the same
 * authored vectors as the white cut, per build documentation §5 (never
 * recreate or approximate the mark in code).
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // A route change is a navigation — the panel closes behind it.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="bg-white text-black md:hidden">
      <div className="flex h-16 items-center justify-between pl-5 pr-3">
        <Link href="/" aria-label={`${org.name} — home`} className="shrink-0">
          <Image
            src="/brand/logo-wordmark-black.svg"
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
                fill="black"
              />
            ) : (
              <path
                d="M19 17a1 1 0 1 1 0 2H4.938v-.004A1.001 1.001 0 0 1 4 18c0-.531.414-.965.938-.997V17H19Zm0-5a1 1 0 1 1 0 2H5a1 1 0 1 1 0-2h14Zm0-5a1 1 0 1 1 0 2H5a1 1 0 0 1 0-2h14Z"
                fill="black"
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
          <Link
            href={primaryAction.href}
            className="mt-4 flex h-10 items-center justify-center border border-black bg-black px-5 text-base leading-6 text-white"
          >
            {primaryAction.title}
          </Link>
        </nav>
      ) : null}
    </div>
  );
}
