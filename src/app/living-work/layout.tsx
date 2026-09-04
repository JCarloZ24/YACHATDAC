import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { TransitionProvider } from "@/components/motion/TransitionProvider";
import "@/components/motion/transitions.css";

/**
 * /living-work — the first v2 page promoted to its real route (31 Aug).
 *
 * Lenis and the transition provider mount here, exactly as the /v2 segment
 * layout mounts them, so the page keeps the immersive build's scroll feel
 * while the rest of the site keeps its current one. When more pages promote,
 * this moves up to the root layout and these per-route mounts go.
 */
export default function LivingWorkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-charcoal text-canvas">
      <SmoothScroll />
      <TransitionProvider />
      {children}
    </div>
  );
}
