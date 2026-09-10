import type { ReactNode } from "react";

/**
 * X7 — the page's ground box. Goes in every page.tsx.
 *
 * ⚠ IT NO LONGER RENDERS A <ViewTransition> (August, 11 September 2026). It
 * did, and the route animation was built on the browser snapshots React
 * captures through it. Measured on this app, that fired inconsistently:
 * /wonder → /truth animated, /truth → /about produced no view-transition
 * pseudo-elements at all — polled every frame for sixteen seconds with the
 * durations stretched to 30s. Half the navigations blinked and half cut,
 * which was the reported flicker.
 *
 * The blink is now a panel this app owns and cannot have skipped — see
 * components/motion/RouteBlink, mounted once in the root layout. Nothing here
 * needs to co-operate with it, which is the point.
 *
 * What survives is the part that was always doing useful work: `ground` paints
 * the page's own colour behind everything, so the first frame the reader sees
 * when the lights come up is the colour the page opens on rather than whatever
 * was behind it. Pass a hex from the brand palette.
 */
export function PageTransition({
  ground,
  children,
}: {
  ground: string;
  children: ReactNode;
}) {
  return (
    <div
      data-page-root
      className="min-h-svh"
      style={{ backgroundColor: ground }}
    >
      {children}
    </div>
  );
}
