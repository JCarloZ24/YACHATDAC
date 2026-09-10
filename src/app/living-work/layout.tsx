import { SmoothScroll } from "@/components/motion/SmoothScroll";

/**
 * /living-work — the first v2 page promoted to its real route (31 Aug).
 *
 * Lenis mounts here, exactly as the /v2 segment layout mounts it, so the page
 * keeps the immersive build's scroll feel while the rest of the site keeps its
 * current one. *
 * The transition provider used to mount here as well. It moved to the ROOT
 * layout on 11 September 2026 so every route gets the blink, which is what
 * these comments always said would happen "when more pages promote".
 */
export default function LivingWorkLayout({
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
