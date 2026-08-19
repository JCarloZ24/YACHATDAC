import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { SignupField } from "@/components/ui/SignupField";
import { wayForward } from "@/content/homepage";

/**
 * Beat 7 — The Way Forward.
 *
 * Legacy framing: what was built here can be a template for other communities.
 * This is NOT a "site under construction" note — open decision 1 resolved that
 * unfinished features are never surfaced to visitors.
 */
export function WayForward() {
  return (
    <section id="way-forward" className="bg-evergreen">
      <div className="mx-auto max-w-7xl px-6 py-28 lg:px-16">
        <Reveal>
          <Eyebrow className="text-ochre">{wayForward.eyebrow}</Eyebrow>
        </Reveal>

        <Reveal index={1}>
          <h2 className="headline mt-6 max-w-3xl text-4xl text-canvas sm:text-5xl">
            {wayForward.headline}
          </h2>
        </Reveal>

        <Reveal index={2}>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-canvas/75">
            {wayForward.body}
          </p>
        </Reveal>

        <Reveal index={3}>
          <div className="mt-12">
            <SignupField {...wayForward.signup} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
