import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { TransitionProvider } from "@/components/motion/TransitionProvider";
import "@/components/motion/transitions.css";

/**
 * /truth — the descent runs on the immersive stack (Lenis + the transition
 * provider), mounted for this segment only so the rest of the site keeps its
 * exact scroll feel. This is the v2 build promoted to the real route
 * (2026-09-02); /v2/truth is retired.
 */
export default function TruthLayout({ children }: { children: React.ReactNode }) {
  return (
    /* One ground, egg white — client direction, 9 September 2026. The segment
       wrapper is what shows through on overscroll, so it carries the same
       ground the page does or the rubber-band flashes the old charcoal. */
    <div className="bg-canvas text-charcoal">
      <SmoothScroll />
      <TransitionProvider />
      {children}
    </div>
  );
}
