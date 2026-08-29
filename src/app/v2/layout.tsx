import type { Metadata } from "next";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { TransitionProvider } from "@/components/motion/TransitionProvider";
import "./transitions.css";

/**
 * /v2 — the immersive build (F7), living ALONGSIDE the current pages: nothing
 * outside this segment is modified, and both builds run at once for
 * comparison (Ivy's instruction: new pages, never delete the current ones).
 *
 * Lenis and the transition provider mount here, not in the root layout, so
 * the current routes keep their exact scroll feel. Leaving the segment
 * unmounts both.
 *
 * noindex like /lab: this is a proposal, not the site.
 */

export const metadata: Metadata = {
  title: { template: "%s — v2 preview", default: "v2 preview" },
  robots: { index: false, follow: false },
};

export default function V2Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-charcoal text-canvas">
      <SmoothScroll />
      <TransitionProvider />
      {children}
    </div>
  );
}
