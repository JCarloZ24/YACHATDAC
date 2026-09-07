import type { Metadata } from "next";
import Link from "next/link";
import { GovernanceTable } from "@/components/lofi/GovernanceTable";
import {
  Body,
  DraftNotice,
  Section,
} from "@/components/lofi/primitives";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import {
  comeAndSee,
  livingWorkHero,
  removableFailures,
  steps,
  stepsHeading,
  whyPublishing,
} from "@/content/lofi/living-work";

export const metadata: Metadata = {
  title: "Living Work — Caring for Country",
  description: whyPublishing.body[0],
};

/**
 * Living Work — Caring for Country. A numbered method, not a showcase.
 *
 * Tier 2 only (F4). Eight numbered steps are exactly the shape X3 (pinned
 * step-through) describes, and that is precisely why this page does NOT use
 * it: X3 is Tier 1 and Tier 1 is homepage-only. The steps are ordinary
 * sections with X4 entry staggers.
 *
 * ⚠ F2 (ambient particles) is banned outright and it matters most here: step
 * 04 is the fire step. "Fire on this site means fire-stick farming, a practice
 * and a responsibility. Embers as sparkle behind a headline trivialises it."
 * No particles, no sparks, no embers anywhere on this page.
 */
export default function LivingWorkPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-svh items-end overflow-hidden bg-charcoal">
        <div aria-hidden data-placeholder="hero-media" className="absolute inset-0" />
        {/* X5 — legibility scrim. The draft calls for machinery, smoke or
            water: high-contrast, high-variance frames, which is exactly the
            case X5 exists for. Re-test against the brightest frame. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-t from-charcoal/90 via-charcoal/45 to-charcoal/70"
        />
        <div className="relative mx-auto w-full max-w-7xl px-6 pt-32 pb-24 lg:px-16">
          <Eyebrow className="text-ochre">{livingWorkHero.eyebrow}</Eyebrow>
          <h1 className="headline mt-6 max-w-4xl text-h1 text-canvas">
            {livingWorkHero.headline}
          </h1>
          <p className="mt-8 max-w-2xl text-base leading-relaxed text-canvas/75">
            {livingWorkHero.body}
          </p>
          <div className="mt-10 max-w-xl">
            <DraftNotice
              circle="shared with care"
              blockedOn='decision D6 — keep or cut "the parts that are not in the annual report"'
            />
          </div>
        </div>
      </section>

      {/* Why we are publishing this */}
      <Section tone="bg-evergreen">
        <Reveal>
          <h2 className="headline max-w-3xl text-3xl text-canvas sm:text-4xl">
            {whyPublishing.headline}
          </h2>
        </Reveal>
        <Body paragraphs={whyPublishing.body} startIndex={1} />
        <Reveal index={3}>
          <p className="mt-10 max-w-2xl border-l-2 border-ochre/60 pl-5 text-sm text-canvas/50 italic">
            Peer-to-peer tone — generous with method, not a pitch. Audience is
            other Indigenous communities.
          </p>
        </Reveal>
      </Section>

      {/* Eight things */}
      <Section tone="bg-canvas">
        <Reveal>
          <h2 className="headline max-w-3xl text-3xl text-evergreen sm:text-4xl">
            {stepsHeading}
          </h2>
        </Reveal>
      </Section>

      {steps.map((step, index) => (
        <Section
          key={step.number}
          id={`step-${step.number}`}
          tone={index % 2 === 0 ? "bg-evergreen" : "bg-roasted"}
        >
          <div className="flex flex-col gap-10 lg:flex-row lg:gap-16">
            <Reveal>
              <p className="headline text-5xl text-ochre lg:text-6xl">
                {step.number}
              </p>
            </Reveal>

            <div className="flex-1">
              <Reveal index={1}>
                <h3 className="headline max-w-2xl text-2xl text-canvas sm:text-3xl">
                  {step.title}
                </h3>
              </Reveal>
              <Body paragraphs={step.body} startIndex={2} />
              <div className="mt-10">
                <GovernanceTable
                  travels={step.travels}
                  stays={step.stays}
                  index={2 + step.body.length}
                />
              </div>
            </div>
          </div>
        </Section>
      ))}

      {/* ⚠ REMOVABLE — decision D6. One section, one export, cut in one move. */}
      <Section tone="bg-canvas" className="border-y-2 border-dashed border-oxide/40">
        <Reveal>
          <p className="eyebrow text-oxide">
            ⚠ Removable section — decision D6 open
          </p>
        </Reveal>
        <Reveal index={1}>
          <h2 className="headline mt-5 max-w-3xl text-3xl text-evergreen sm:text-4xl">
            {removableFailures.headline}
          </h2>
        </Reveal>
        <Body
          paragraphs={removableFailures.body}
          onDark={false}
          startIndex={2}
        />
        <Reveal index={4}>
          <p className="mt-8 max-w-2xl text-sm text-evergreen/50 italic">
            Written for the practitioner audience, who find failures more useful
            than successes. May sit badly with a government funder reading the
            same page. Built to be cut in one move if so — not silently decided.
          </p>
        </Reveal>
      </Section>

      {/* Come and see it */}
      <Section tone="bg-charcoal">
        <Reveal>
          <h2 className="headline max-w-3xl text-3xl text-canvas sm:text-4xl">
            {comeAndSee.headline}
          </h2>
        </Reveal>
        <Body paragraphs={[comeAndSee.body]} startIndex={1} />
        <div className="mt-10 flex flex-wrap gap-4">
          {comeAndSee.ctas.map((cta, index) => (
            <Reveal key={cta.href} index={2 + index}>
              <Link
                href={cta.href}
                className="eyebrow inline-block border border-canvas/30 px-8 py-4 text-canvas transition-colors hover:border-ochre hover:text-ochre"
              >
                {cta.label} →
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
