/**
 * /homepagev2 fork, 10 September 2026, user direction. A copy of
 * src/components/sections/BeatSection.tsx, owned by /homepagev2 alone.
 * The shared UI atoms it composes -- CtaLink, Eyebrow, Reveal, the tone
 * helpers -- stay shared: they are the site's vocabulary, not this page's
 * design, and forking them would fork the whole component library.
 */

import { CtaLink } from "@/components/ui/CtaLink";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import type { Beat } from "../_content/homepage";
import { toneBg, toneInk } from "@/lib/tone";

/**
 * Beats 2–4 — Wonder, Truth, Belonging.
 *
 * Each is a full-height panel. The background changes beat to beat while the
 * content holds its position, which is the "static foreground, moving
 * background" direction agreed in the 18 Aug briefing.
 *
 * ⚠ CHANGED IN v3. Two things that were true of this component are no longer:
 *
 *   - There were five beats. There are now four; the standalone Living Work
 *     beat is gone and survives as an Invitation card.
 *   - Beats carried no call to action, deliberately — the visitor was being
 *     carried, not routed, until the Invitation. v3 gives Wonder, Truth and
 *     Belonging one each. The drafts govern copy (D5), so the links render.
 *     Whether that was the right call for the page is a wireframe question,
 *     and it is worth putting to the review rather than absorbing quietly:
 *     three exits before the Invitation changes what the Invitation is for.
 *
 * The Truth beat is built from a sequence rather than a headline. See
 * `BeatSequence` below.
 */
export function BeatSection({ beat }: { beat: Beat }) {
  const ink = toneInk[beat.tone];

  return (
    <section
      id={beat.id}
      className={`relative flex min-h-svh items-center ${toneBg[beat.tone]}`}
    >
      {/* Artwork slot. Placeholder-first, swap-in-ready (open decision 10):
          the commissioned hero art and repeatable patterns are not blocking
          launch, so this stays a flat field until they arrive. */}
      <div
        aria-hidden
        data-placeholder="beat-media"
        className="absolute inset-0 opacity-0"
      />

      <div className="relative mx-auto w-full max-w-7xl px-6 py-28 lg:px-16">
        <Reveal>
          <Eyebrow className={ink.accent}>{beat.eyebrow}</Eyebrow>
        </Reveal>

        {beat.headline ? (
          <Reveal index={1}>
            <h2
              className={`headline mt-6 max-w-3xl text-h2 ${ink.heading}`}
            >
              {beat.headline}
            </h2>
          </Reveal>
        ) : null}

        {beat.sequence ? <BeatSequence beat={beat} /> : null}

        <div className="mt-8 max-w-xl space-y-5">
          {beat.body.map((paragraph, index) => (
            <Reveal key={paragraph} index={2 + index}>
              <p className={`text-base leading-relaxed ${ink.body}`}>
                {paragraph}
              </p>
            </Reveal>
          ))}
        </div>

        {beat.cta ? (
          <Reveal index={5}>
            <div className="mt-10">
              <CtaLink href={beat.cta.href} tone={beat.tone}>
                {beat.cta.label}
              </CtaLink>
            </div>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}

/**
 * The Truth beat's sequence — what the Iningai Nation was, and then four lines
 * of what happened to it.
 *
 * Set as a list rather than as prose because the drop is the argument: each
 * line takes something away, and running them together as a paragraph loses
 * the count. The subject block above the steps is the "before" the steps are
 * measured against.
 *
 * ⚠ The prototype scrubs this on scroll. That is Tier 1 motion and belongs to
 * the motion skill and the wireframes — not something to add here. The shared
 * Reveal entry stagger is all the movement this carries.
 *
 * ⚠ Only the first step label survived the Markdown conversion. See the note
 * on `BeatStep` in content/homepage.ts before dating the rest.
 */
function BeatSequence({ beat }: { beat: Beat }) {
  const sequence = beat.sequence;
  if (!sequence) return null;

  const ink = toneInk[beat.tone];

  return (
    <div className="mt-10 max-w-3xl">
      <Reveal index={1}>
        <div className={`border-t pt-6 ${ink.border}`}>
          <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
            <h2 className={`headline text-3xl sm:text-4xl ${ink.heading}`}>
              {sequence.subject}
            </h2>
            <Eyebrow className={ink.accent}>{sequence.subjectLabel}</Eyebrow>
          </div>

          <ul className="mt-5 space-y-2">
            {sequence.subjectDetail.map((detail) => (
              <li key={detail} className={`text-sm leading-relaxed ${ink.body}`}>
                {detail}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      <ol className="mt-8 space-y-5">
        {sequence.steps.map((step, index) => (
          <li key={step.text}>
            <Reveal index={2 + index}>
              <div
                className={`border-t pt-4 sm:grid sm:grid-cols-[6rem_minmax(0,1fr)] sm:gap-6 ${ink.border}`}
              >
                {/* Unlabelled by design — see the warning above. */}
                <Eyebrow className={step.label ? ink.accent : "opacity-0"}>
                  {step.label ?? "—"}
                </Eyebrow>
                <p
                  className={`mt-2 text-base leading-relaxed sm:mt-0 ${ink.body}`}
                >
                  {step.text}
                </p>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </div>
  );
}
