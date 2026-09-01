/**
 * Declares the colour a page's LAST section ends on, so the footer's wave
 * divider opens onto the same ground instead of the default canvas.
 *
 * The footer is a sibling of <main>, so a page cannot hand it a prop and a
 * CSS custom property set inside the page never reaches it — this renders a
 * one-rule style tag on :root instead. Server component, no client cost.
 *
 * Usage, at the end of any page whose final section is not canvas:
 *   <FooterGround color="var(--color-charcoal)" />
 */
export function FooterGround({ color }: { color: string }) {
  return <style>{`:root{--footer-ground:${color}}`}</style>;
}
