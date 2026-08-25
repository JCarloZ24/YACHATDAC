import type { ReactNode } from "react";
import { toneInk, type Tone } from "@/lib/tone";

/**
 * An expandable row. Living Work's "Our challenges" is fourteen of these.
 *
 * Built on native `<details>`/`<summary>` rather than a React accordion:
 *
 *   - It works before hydration, and this site's audience is often on the
 *     worst connection to it (see the font-preload note in app/layout.tsx).
 *   - Keyboard, screen-reader and find-in-page behaviour are the browser's,
 *     which is better than the version we would write.
 *   - It needs no client boundary, so a fourteen-row list stays a server
 *     component.
 *
 * The marker is drawn as a rotating glyph because the default triangle cannot
 * be styled consistently across browsers. `list-none` plus the WebKit override
 * in the class list removes the native one.
 */
export function Disclosure({
  summary,
  children,
  tone = "canvas",
}: {
  summary: string;
  children: ReactNode;
  tone?: Tone;
}) {
  const ink = toneInk[tone];

  return (
    <details className={`group border-t ${ink.border}`}>
      <summary
        className={`flex cursor-pointer list-none items-center justify-between gap-6 py-5 [&::-webkit-details-marker]:hidden ${ink.heading}`}
      >
        <span className="text-base leading-snug font-medium">{summary}</span>
        <span
          aria-hidden
          className={`shrink-0 text-xl leading-none ${ink.accent} transition-transform duration-(--dur-small) ease-quiet group-open:rotate-45`}
        >
          +
        </span>
      </summary>

      <div className={`max-w-2xl space-y-4 pb-7 text-sm leading-relaxed ${ink.body}`}>
        {children}
      </div>
    </details>
  );
}
