"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { markIntroSeen } from "@/lib/intro-gate";

/**
 * Anywhere but the homepage means the reader is already inside the site, so
 * the front door is spent (10 September 2026, user direction).
 *
 * Without this, someone who arrives on /wonder from a search result or a shared
 * link, reads it, and then clicks the logo home is met by a 39-second opening
 * film halfway through their visit. Technically they have not seen it. In
 * practice it reads as a bug.
 *
 * ⚠ `route-entry`'s `navigated` flag CANNOT do this job, and it is worth saying
 * so here because it looks like it should. TransitionProvider — the only caller
 * of `beginRoute()` — is mounted in the about, living-work, truth and v2
 * layouts and NOWHERE ELSE: not in the root layout, not on `/`. So arriving on
 * the homepage never fires it. It is also set once and never cleared, and it
 * dies on reload.
 *
 * Rendered once in the root layout. A "use client" child does not make the
 * layout itself a client component.
 */
export function IntroGate() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname && pathname !== "/") markIntroSeen();
  }, [pathname]);

  return null;
}
