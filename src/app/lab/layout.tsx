import type { Metadata } from "next";

/**
 * /lab — motion prototypes.
 *
 * Not site pages. These exist so behaviours from the motion reference can be
 * judged in a browser at real scroll speed before anyone commits to them, and
 * so the open permission questions get answered by looking at something.
 *
 * Noindex, and deliberately absent from the nav in src/content/site.ts.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function LabLayout({ children }: { children: React.ReactNode }) {
  return <div className="bg-charcoal">{children}</div>;
}
