/**
 * The Record's sticky-section switch.
 *
 * The hi-fi frame (Figma 2463:8492) builds the page as a DECK: each row of
 * cards and each breakout takes the screen and holds it, the deck snaps
 * between them, the filter rail sticks down the left of the grid, and "What we
 * do not know" pins for 300vh while its four gaps light one at a time.
 *
 * Turned off on 2026-09-04 at August's direction. The whole mechanism is left
 * in place and gated on this one constant rather than deleted, so the frame's
 * choreography can come back for the presentation by flipping it to `true`.
 *
 * Off, the page is ordinary flow: the grid scrolls, the rail scrolls with it,
 * the breakouts pass as full-bleed blocks, and the gaps section is a plain
 * list driven by its own scroll — which is the same fallback the small- and
 * short-viewport branches already used, so nothing here is a new code path.
 *
 * WHAT THIS DOES NOT TOUCH. Arrivals, the hero scrim ramp, the breakout
 * escape reveal and the grid's Flip reflow are not sticky behaviours and stay
 * on; they are gated by `prefers-reduced-motion` as before.
 *
 * Read by src/lib/motion/record.ts (the triggers) and
 * src/app/the-record/_components/Grid.tsx (the layout that makes the holds
 * possible). Both have to agree, which is why this is one shared constant and
 * not a class toggled in two places.
 */
export const RECORD_STICKY_SECTIONS = false;

/**
 * The filter rail's own stickiness, held SEPARATELY from the deck.
 *
 * The rail is not a "sticky section" in the sense the deck is — it is not a
 * slide that takes the screen, it is the page's filter, and a filter that
 * scrolls out of reach after the first row is a filter you cannot use for the
 * other twelve. So it went back on 2026-09-04 while the deck, the breakout
 * holds and the gaps pin stayed off.
 *
 * Because it sticks, it once again travels OVER the breakouts, so the rail's
 * `data-on-dark` ground/ink flip is gated on this rather than on the deck —
 * that flip is what keeps the index at 4.5:1 when a breakout is behind it.
 */
export const RECORD_STICKY_RAIL = true;

/**
 * THE BREAKOUT'S OWN PIN, held separately from the deck — the same split the
 * rail got, and for the same reason.
 *
 * §03's transition strip ("The breakout", 8 frames) is a Flip handoff: Flip
 * measures the card where it sits in the grid, measures the full bleed, and
 * animates the difference with transforms only, so the reader believes it is
 * the same photograph arriving somewhere new. That move has two hard
 * requirements the deck does not supply:
 *
 *   · The card has to be ON SCREEN when the flight starts. It cannot be a
 *     separate section a viewport below its card — fitting to a rect that is
 *     off-screen flies the plate in from nowhere, which is the objection the
 *     old escape/aperture treatment was written around.
 *   · Something has to hold still while the plate grows. The strip pins the
 *     frame for 100vh and runs the flight on enter, unscrubbed.
 *
 * So the row that contains the breakout entry and the screen it becomes are
 * ONE section, 200svh tall, whose frame sticks for the middle 100. The deck —
 * every OTHER row taking the screen, and the snap between them — stays off.
 *
 * Read by src/app/the-record/_components/Grid.tsx (which builds the section)
 * and src/lib/motion/record.ts (which flies it). The `breakout:` variant in
 * globals.css is the third party to the same agreement: it withholds the pin
 * under reduced motion, where the strip says the entry simply stays a card.
 */
export const RECORD_BREAKOUT_FLIGHT = true;

/**
 * EVERY ROW HOLDS THE SCREEN — the deck's layout, without the deck's snap.
 *
 * A row of cards takes the screen and keeps it for a viewport, which is what
 * the hi-fi frame asks for and what the breakout already does. Asked for on
 * 2026-09-04, after the flight shipped and the page read wrong: three sections
 * out of five held and the rest scrolled past, so the holds looked like a
 * glitch rather than the page's rhythm.
 *
 * ⚠ THIS IS NOT `RECORD_STICKY_SECTIONS`, which stays off. That flag gates the
 * SNAP — the module gliding the reader from one slide to the next — and it is
 * the part globals.css argues against at length ("the visitor sets the pace").
 * Held slides do not take the wheel; they only stop moving under it.
 *
 * Read by src/app/the-record/_components/Grid.tsx. The `hold:` variant in
 * globals.css withholds it under reduced motion and on any viewport too small
 * to hold a slide, because a slide taller than its screen is a trap.
 */
export const RECORD_STICKY_ROWS = true;
