import { wayForward } from "@/content/lofi/homepage";
import { SignupField } from "@/components/ui/SignupField";
import { SplitReveal } from "@/components/motion/text/SplitReveal";

/**
 * The Way Forward — the page's quiet close. After the river and the cards,
 * this screen's loud channel is deliberately NONE of the three: the page has
 * made its argument, and ending at rest is what makes the argument land
 * (F7 rule 1 — stillness with a stated reason).
 *
 * Evergreen ground so the reused SignupField's canvas ink reads as designed.
 */
export function WayForwardV2() {
  return (
    <section className="bg-evergreen py-28 text-canvas sm:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-16">
        <p data-v2-arrive className="eyebrow text-ochre">
          {wayForward.eyebrow}
        </p>
        <SplitReveal
          as="h2"
          mode="lines"
          className="headline mt-6 max-w-3xl text-h2"
        >
          {wayForward.headline}
        </SplitReveal>
        <p data-v2-arrive className="mt-8 max-w-2xl leading-relaxed text-canvas/75">
          {wayForward.body}
        </p>

        <div data-v2-arrive className="mt-14">
          <SignupField
            label={wayForward.signup.label}
            placeholder={wayForward.signup.placeholder}
            cta={wayForward.signup.cta}
            note={wayForward.signup.note}
          />
        </div>
      </div>
    </section>
  );
}
