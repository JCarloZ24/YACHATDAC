import { ViewTransition } from "react";
import type { ReactNode } from "react";

/**
 * X7 — the route-transition wrapper. Goes in every /v2 page.tsx, never in a
 * layout: layouts persist across navigations, so enter/exit would never fire
 * there (installed guide, view-transitions.md).
 *
 * `ground` paints the page's own ground behind everything, which is what the
 * forward wipe reveals — pass the page's opening ground colour, as a hex from
 * the brand palette. The classes map to src/app/v2/transitions.css.
 */

const ENTER = {
  "nav-forward": "v2-wipe",
  "nav-back": "v2-fade",
  default: "v2-fade",
} as const;

const EXIT = {
  "nav-forward": "v2-hold",
  "nav-back": "v2-fade",
  default: "v2-fade",
} as const;

export function PageTransition({
  ground,
  children,
}: {
  ground: string;
  children: ReactNode;
}) {
  return (
    <ViewTransition enter={ENTER} exit={EXIT} default="none">
      <div
        data-page-root
        className="min-h-svh"
        style={{ backgroundColor: ground }}
      >
        {children}
      </div>
    </ViewTransition>
  );
}
