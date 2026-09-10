import { SmoothScroll } from "@/components/motion/SmoothScroll";

/**
 * /truth — the descent runs on the immersive stack. Lenis is mounted for this
 * segment only so the rest of the site keeps its exact scroll feel. This is
 * the v2 build promoted to the real route (2026-09-02); /v2/truth is retired. *
 * The transition provider used to mount here as well. It moved to the ROOT
 * layout on 11 September 2026 so every route gets the blink, which is what
 * these comments always said would happen "when more pages promote".
 */
export default function TruthLayout({ children }: { children: React.ReactNode }) {
  return (
    /* One ground, egg white — client direction, 9 September 2026. The segment
       wrapper is what shows through on overscroll, so it carries the same
       ground the page does or the rubber-band flashes the old charcoal. */
    <div className="bg-canvas text-charcoal">
      <SmoothScroll />
      {children}
    </div>
  );
}
