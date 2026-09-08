import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { TransitionProvider } from "@/components/motion/TransitionProvider";
import "@/components/motion/transitions.css";

/**
 * /about — promoted to the motion stack with the seam pass (see
 * ./_components/Motion.tsx). Lenis and the transition provider mount here,
 * exactly as /living-work and /truth mount them, so the page's scrubbed seams
 * ride the smoothed scroll while the rest of the site keeps its current feel.
 * When more pages promote, this moves up to the root layout and these
 * per-route mounts go.
 */
export default function AboutLayout({
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
