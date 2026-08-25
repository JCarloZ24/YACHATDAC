import { CtaLink } from "@/components/ui/CtaLink";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { SignupField } from "@/components/ui/SignupField";
import { wayForward } from "@/content/homepage";

/**
 * The Way Forward — the last section.
 *
 * Legacy framing: what was built here can be a template for other communities.
 * This is NOT a "site under construction" note — open decision 1 resolved that
 * unfinished features are never surfaced to visitors.
 *
 * ⚠ CHANGED IN v3. Two additions, both previously recorded as not rendered:
 *
 *   - The four pathways. They route by intent — come, research, exchange,
 *     read — where the Invitation routes by pillar. That is why both exist.
 *   - The tagline. It is the organisation's own line, it is on the logo, and
 *     Wonder, Living Work and About all carry it. It sat in the content file
 *     unrendered through v2; v3 is where it lands on the page.
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

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {wayForward.paths.map((path, index) => (
            <Reveal key={path.href} index={3 + index}>
              <article className="flex h-full flex-col justify-between gap-6 border-t border-canvas/20 pt-5">
                <div>
                  <h3 className="headline text-xl text-canvas">{path.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-canvas/75">
                    {path.description}
                  </p>
                </div>
                <CtaLink href={path.href} tone="evergreen">
                  {path.cta}
                </CtaLink>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal index={7}>
          <p className="headline mt-20 max-w-2xl text-2xl text-ochre">
            {wayForward.tagline}
          </p>
        </Reveal>

        <Reveal index={8}>
          <div className="mt-12">
            <SignupField {...wayForward.signup} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
