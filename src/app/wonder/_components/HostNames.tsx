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
 * The dim state is 0.28, borrowed deliberately from the `dim` effect ("a
 * person speaking"): the rest of the frame stays visible and readable, it is
 * simply not the part being pointed at. Interface response under a pointer,
 * so it runs as a CSS transition on `--dur-small` like the page's other
 * hover work, not as a controller timeline.
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
 */
export function HostNames({
  people,
  children,
}: {
  people: ReadonlyArray<{ name: string; left: number; top: number }>;
  children: ReactNode;
}) {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="relative h-[200px] w-full min-w-0 overflow-hidden rounded-3xl lg:h-[400px] lg:w-auto lg:flex-1">
      {children}
      {/* The dim. One flat charcoal wash over the whole plate while a name is
          raised, so the named person reads as picked out of the group without
          anybody else being darkened individually. */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 bg-charcoal transition-opacity duration-(--dur-small) ease-quiet ${
          active ? "opacity-[0.28]" : "opacity-0"
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
            className="absolute z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer p-2"
            style={{ left: `${person.left}%`, top: `${person.top}%` }}
          >
            <span
              className={`block font-eyebrow text-sm leading-none font-bold whitespace-nowrap text-canvas transition-opacity duration-(--dur-small) ease-quiet lg:text-base ${
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
