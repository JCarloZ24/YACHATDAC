import { SmoothScroll } from "@/components/motion/SmoothScroll";

/**
 * /about — promoted to the motion stack with the seam pass (see
 * ./_components/Motion.tsx). Lenis mounts here, exactly as /living-work and
 * /truth mount it, so the page's scrubbed seams ride the smoothed scroll
 * while the rest of the site keeps its current feel. *
 * The transition provider used to mount here as well. It moved to the ROOT
 * layout on 11 September 2026 so every route gets the blink, which is what
 * these comments always said would happen "when more pages promote".
 */
export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-charcoal text-canvas">
      <SmoothScroll />
      {children}
    </div>
  );
}
