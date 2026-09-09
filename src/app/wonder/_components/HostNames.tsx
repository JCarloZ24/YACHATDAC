"use client";

import { useState, type ReactNode } from "react";

/**
 * §10 · Your hosts — the pointer names the people it can name.
 *
 * WHAT THIS IS NOT. It is not motion applied to a photograph of people. The
 * corollary in docs/motion/motion-grammar.md is absolute: "Portraits of real
 * people hold still. The world moves around them." So nothing here scales,
 * drifts, tilts or parallaxes the picture. What answers the pointer is a
 * label and a dim, which is attention rather than animation.
 *
 * The dim state came from the `dim` effect ("a person speaking"): the rest of
 * the frame stays visible and readable, it is simply not the part being
 * pointed at. It ran at 0.28 flat across the whole plate until 9 Sep 2026,
 * when August asked for the person to be held out of it — so the wash is now
 * masked (see the markup) and carries 0.5, because a dim that spares the
 * subject has to be deeper than one that covers them to read as a difference
 * at all. Interface response under a pointer, so it runs as a CSS transition
 * on `--dur-small` like the page's other hover work, not as a controller
 * timeline.
 *
 * THREE OF EIGHT. Only three people in this photograph were identified by the
 * user (9 September 2026); see `hostsPeople` in src/content/wonder-media.ts.
 * The other five carry no hotspot and no label, and are never guessed at. A
 * reader who hovers them gets nothing, which is correct.
 *
 * KEYBOARD AND TOUCH. Each name is a real focusable button, so the labels are
 * reachable without a pointer, and every name is rendered in the DOM at all
 * times — visually hidden until raised, but present for a screen reader. The
 * information is never hover-only.
 *
 * THE HOTSPOT IS THE FIGURE, NOT THE LABEL (August, 9 Sep 2026). The button
 * used to be the size of its own hidden text plus 8px of padding, so the only
 * way to raise a name was to find a thin invisible strip across somebody's
 * chest. It is now a standing box over the person — `HOTSPOT_W` wide and
 * `HOTSPOT_H` tall, centred on the anchor — which is roughly head-to-knee at
 * the width of one figure in an eight-person line-up. Wider would overlap the
 * neighbour; these three stand next to each other. `min-w` keeps it a real
 * touch target on the 200px phone plate, where 11% of the width is ~37px.
 *
 * THE LABEL SITS ABOVE THE HEAD (same pass). The anchor stays the chest — it
 * is what `hostsPeople` documents and what centres the box — and the name is
 * hung off the box's top edge (`bottom-full`), which clears the face instead
 * of covering it. The margin above that edge was 4/8px and is now 16/28px
 * (August, 9 Sep 2026): the box top lands about level with the hairline, and
 * Graham wears a hat, so the first cut sat on the brim. `pointer-events-none`
 * on the label: it overhangs the box,
 * and a name that extends its own hotspot upward would make the target a
 * different shape from the figure under it.
 */
/** The hotspot box, as percentages of the plate. See the note above. */
const HOTSPOT_W = "w-[11%] min-w-[44px]";
const HOTSPOT_H = "h-[58%]";
/** The lit ellipse held out of the dim: one figure wide, head-to-knee tall,
    fading to fully dim by `SPOT_FEATHER` of its own radius. Wider and the
    neighbour is lit too; tighter and it reads as a torch beam. */
const SPOT_W = "9%";
const SPOT_H = "34%";
const SPOT_FEATHER = "82%";
export function HostNames({
  people,
  children,
}: {
  people: ReadonlyArray<{ name: string; left: number; top: number }>;
  children: ReactNode;
}) {
  const [active, setActive] = useState<string | null>(null);
  const lit = people.find((person) => person.name === active) ?? null;

  return (
    <div className="relative h-[200px] w-full min-w-0 overflow-hidden rounded-3xl lg:h-[400px] lg:w-auto lg:flex-1">
      {children}
      {/* The dim, with the named person held out of it. The wash is one flat
          charcoal plane as before; what is new (August, 9 Sep 2026) is the
          mask, a soft ellipse centred on the anchor that lets the person
          being pointed at stay lit while everything around them goes down.
          The picture itself is untouched — no scale, no filter, no crop —
          which keeps the portraits corollary: the world dims around them.

          A GRADIENT, NOT A CUTOUT. The mask fades from clear at the figure to
          solid across `SPOT_FEATHER`, so there is no lit-shaped hole with an
          edge; a hard oval over a group photograph reads as a spotlight prop.
          Sizes are percentages of the plate, so the shape holds at 200px on
          the phone and 400 at 1440. `mask` is set as an inline custom
          property because the centre is per-person data, not a class. */}
      <div
        aria-hidden
        style={
          lit
            ? {
                maskImage: `radial-gradient(ellipse ${SPOT_W} ${SPOT_H} at ${lit.left}% ${lit.top}%, transparent 0%, black ${SPOT_FEATHER})`,
                WebkitMaskImage: `radial-gradient(ellipse ${SPOT_W} ${SPOT_H} at ${lit.left}% ${lit.top}%, transparent 0%, black ${SPOT_FEATHER})`,
              }
            : undefined
        }
        className={`pointer-events-none absolute inset-0 bg-charcoal transition-opacity duration-(--dur-small) ease-quiet ${
          active ? "opacity-[0.5]" : "opacity-0"
        }`}
      />
      {people.map((person) => {
        const on = active === person.name;
        return (
          <button
            key={person.name}
            type="button"
            aria-pressed={on}
            onPointerEnter={() => setActive(person.name)}
            onPointerLeave={() => setActive(null)}
            onFocus={() => setActive(person.name)}
            onBlur={() => setActive(null)}
            onClick={() => setActive(on ? null : person.name)}
            className={`absolute z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer ${HOTSPOT_W} ${HOTSPOT_H}`}
            style={{ left: `${person.left}%`, top: `${person.top}%` }}
          >
            <span
              className={`pointer-events-none absolute bottom-full left-1/2 mb-4 block -translate-x-1/2 font-eyebrow text-sm leading-none font-bold whitespace-nowrap text-canvas transition-opacity duration-(--dur-small) ease-quiet lg:mb-7 lg:text-base ${
                on ? "opacity-100" : "opacity-0"
              }`}
              style={{ textShadow: "0 1px 8px var(--color-charcoal)" }}
            >
              {person.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
