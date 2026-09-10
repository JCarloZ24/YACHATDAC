/**
 * Where the page's opening screen ends, in document coordinates.
 *
 * Both bars — the desktop band in SiteHeader and the phone bar in MobileNav —
 * are transparent over the hero and white past it (9 September 2026, user
 * direction, from the supplied 2880×260 and 375×80 navbar drawings). They have
 * to agree on where that is, so the line is defined once, here.
 *
 * Each page marks its opening screen with `data-nav-hero`. A page with no
 * hero — the legal documents open straight onto cream — marks a zero-height
 * line at the top instead, which puts the white in from the first pixel.
 *
 * ⚠ WE MEASURE THE ELEMENT BELOW THE HERO, not the hero. Two of these heroes
 * hold the screen while the page moves under them, and a held element lies
 * about its own position in every API we have:
 *
 *   · Wonder's hero is `sticky top-0` — it rides the viewport while the facts
 *     section scrolls up over it. `getBoundingClientRect().bottom` and
 *     `offsetTop` alike report where it is PAINTED, which past the stick point
 *     is wherever the reader is; both say "still over the hero" for the length
 *     of the page.
 *   · the homepage hero is ScrollTrigger-PINNED, so it is `position: fixed`
 *     inside a `pin-spacer` and has no sibling of its own at all.
 *
 * The thing below the hero is in ordinary flow, so its top is the hero's real
 * foot — and it is also the thing that arrives under the bar and needs the
 * white. Hence the walk: take the first following sibling there is, climbing
 * out of the pin-spacer (and any other wrapper the hero is alone in) to find
 * one. A spacer keeps the pinned element's place in the flow, so its own
 * sibling is honest.
 *
 * Measured on every read rather than cached: these heroes stick, pin and grow
 * with their media, so a measurement taken at mount is stale before the reader
 * reaches it.
 *
 * Falls back to one viewport, which is what the phone bar used before the
 * marker existed.
 */
export function navHeroFoot(): number {
  if (typeof document === "undefined") return 0;
  const hero = document.querySelector<HTMLElement>("[data-nav-hero]");
  const y = window.scrollY;
  if (!hero) return window.innerHeight;

  for (
    let node: Element | null = hero;
    node && node !== document.body;
    node = node.parentElement
  ) {
    for (
      let below = node.nextElementSibling;
      below;
      below = below.nextElementSibling
    ) {
      // ⚠ SKIP WHAT IS NOT LAID OUT. On the homepage the three beat sections
      // are `display: none` whenever the hero canvas is running (see
      // home-hero.css) — and a box that is not laid out returns an all-zero
      // rect, which reads as "the hero ends at the top of the document" and
      // paints the bar white over the film. `getClientRects()` is the honest
      // question: it is empty for exactly those elements.
      if (below.getClientRects().length === 0) continue;
      return below.getBoundingClientRect().top + y;
    }
  }

  // Nothing follows the hero anywhere up the tree — it is the whole page.
  return hero.getBoundingClientRect().bottom + y;
}
