"use client";

import { useEffect } from "react";
import { register, start, stop, watchVisibility } from "@/lib/motion-controller";
import { knowledgeGaps } from "@/content/resources";
import { hosting } from "@/lib/motion/recipes";

/**
 * THE GAPS DISCLOSE — `07 · Partnerships` §04, prototyped before it is drawn.
 *
 * WHY THIS EXISTS
 * ---------------
 * `flattenReveal` had zero consumers anywhere in the repo, so the effect
 * carrying this section had never been executed in a browser. Drawing seven
 * static frames of a behaviour nobody has watched run is the wrong order — the
 * same reason `gathering` was built before Our People §03 was drawn, which is
 * what caught the portrait-rule bug in `escape`.
 *
 * WHAT IT IS
 * ----------
 * The Record §03 renders these same four questions, from this same imported
 * object, as ABSENCE. Here they are an OFFER: the question is always legible,
 * and what discloses is what is already being done about it.
 *
 * ⚠ COPY IS IMPORTED, NEVER RETYPED. `knowledgeGaps` comes from
 * `src/content/resources.ts` so this page and The Record cannot drift apart —
 * which is the one thing the repo already got right about partnership content.
 */

/**
 * What is already measuring each gap. Every line is lifted from the gap's own
 * `detail` string in `src/content/resources.ts` — the second half of the
 * sentence the question already carries. Nothing here is new information.
 */
const ALREADY_RUNNING: Record<string, string> = {
  "How old is the wall?": "Nothing. Marra Wonga has never been dated.",
  "What lives here?": "Four recorders, logging into a database held with QUT.",
  "What is in the ground?": "Almost nothing has been examined.",
  "What does fire-stick farming actually do?": "Two flux towers, and the bore samples.",
};

export function HostingDemo() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>("[data-op='hosting']");
    if (!root) return;
    const unregister = register(hosting(root, 190));
    start();
    const unwatch = watchVisibility();
    return () => {
      unwatch();
      unregister();
      stop();
    };
  }, []);

  return (
    <section
      data-op="hosting"
      className="relative min-h-screen overflow-hidden bg-canvas px-6 py-24 lg:px-16"
    >
      <p className="eyebrow text-ochre">Still to be found</p>
      <h2
        data-heading
        className="headline mt-3 max-w-3xl text-4xl text-charcoal lg:text-5xl"
      >
        {knowledgeGaps.title}
      </h2>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-charcoal/70">
        {knowledgeGaps.lede}
      </p>

      <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
        {knowledgeGaps.gaps.map((gap) => (
          <article
            key={gap.question}
            className="rounded-sm bg-evergreen p-8 text-canvas"
          >
            {/* The question is never hidden. Only the answer discloses. */}
            <h3 className="headline text-2xl leading-tight">{gap.question}</h3>
            <p className="mt-3 text-sm leading-relaxed text-canvas/75">
              {gap.detail}
            </p>

            {/* The shutter and its source are SIBLINGS — flattenReveal looks for
                [data-vessel-source] in the shutter's parentElement. */}
            <div className="relative mt-6 min-h-[64px]">
              <div className="absolute inset-0 flex items-end" data-vessel-source>
                <p className="text-sm leading-relaxed">
                  <span className="eyebrow block text-[10px] text-gold">
                    Already running
                  </span>
                  {ALREADY_RUNNING[gap.question] ?? "—"}
                </p>
              </div>
              <div
                data-shutter
                aria-hidden="true"
                className="absolute inset-0 flex items-end bg-charcoal"
              >
                <p className="eyebrow p-2 text-[10px] text-canvas/50">
                  Already running ↓
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>

      <p className="mt-10 max-w-2xl border-l-2 border-oxide pl-4 text-xs leading-relaxed text-oxide">
        ⚠ Same four questions as The Record §03, from the same imported object.
        Stated there as absence; stated here as an offer. If these two ever read
        the same, this page has no reason to exist.
      </p>
    </section>
  );
}
