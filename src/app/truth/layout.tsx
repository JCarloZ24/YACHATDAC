import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { TransitionProvider } from "@/components/motion/TransitionProvider";
import "../v2/transitions.css";

/**
 * /truth — the descent runs on the immersive stack (Lenis + the transition
 * provider), mounted for this segment only so the rest of the site keeps its
 * exact scroll feel. This is the v2 build promoted to the real route
 * (2026-09-02); /v2/truth is retired.
 */
export default function TruthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-charcoal text-canvas">
      <SmoothScroll />
      <TransitionProvider />
      {children}
    </div>
  );
}
