import { SmoothScroll } from "@/components/motion/SmoothScroll";

/**
 * /about — promoted to the motion stack with the seam pass (see
 * ./_components/Motion.tsx). Lenis mounts here, exactly as /living-work and
 * /truth mount it, so the page's scrubbed seams ride the smoothed scroll
 * while the rest of the site keeps its current feel. *
 * The transition provider used to mount here as well. It moved to the ROOT
 * layout on 11 September 2026 so every route gets the blink, which is what
 * these comments always said would happen "when more pages promote".
 *
 * ⚠ THIS PAGE CARRIES A FAR HEAVIER WHEEL THAN THE REST OF THE SITE — 0.25
 * against the default 1, and it got there in three steps on 14 September 2026,
 * each one a reading of the built page: 0.7 ("the scroll is too quick in pacing
 * and user might miss some sections or text"), then 0.55 ("still need heavier
 * scrolling for this page again"), then 0.25 ("lower the scroll speed even more
 * like around 25%").
 *
 * Eleven sections, seven held screens and ~40 authored beats sit inside a
 * scroll budget fixed before most of those beats existed, so every beat's share
 * of the page had shrunk as the interiors were built out. Lengthening the page
 * was considered and declined, three times: at 0.25 a notch moves the document
 * a quarter as far, so every scrubbed beat costs 4x the wheel it did while the
 * document stays the ~23,700px page.tsx documents and not one span, section
 * height or seam measurement moves. End to end the page is now roughly 95,000px
 * of wheel travel, against ~23,700 at the site default.
 *
 * ⚠ THE GATES DID NOT GET HEAVIER WITH IT, and that is worth knowing rather
 * than assuming. `coverSeams` charges its hold from RAW `deltaY` read ahead of
 * lenis (see BUFFER), so a seam still fires on ~0.2 of a viewport of wheel
 * whatever this number is. At the site default, reading a 200vh section cost
 * about ten times the wheel its gate then asked for; at 0.25 it costs about
 * forty. The seams are proportionally much cheaper than the reading now. Raise
 * BUFFER if they start firing by accident — it has not been reported.
 *
 * It is set HERE rather than in the module because the weight is this page's
 * problem, not the site's: /truth, /living-work, /our-people and / were all
 * paced against the default and keep it. Wheel only — keyboard paging stays
 * native, touch never builds Lenis, and the deck's own gate charge reads raw
 * deltaY ahead of Lenis, so seams fire on exactly the travel they always did.
 */
export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-charcoal text-canvas">
      <SmoothScroll wheel={0.25} />
      {children}
    </div>
  );
}
