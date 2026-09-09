import { Eyebrow } from "@/components/ui/Eyebrow";
import { CtaLink } from "@/components/ui/CtaLink";
import { toneBg, toneInk, type Tone } from "@/lib/tone";

/**
 * The opening band of an interior page.
 *
 * Deliberately not the homepage Hero. That one is full-viewport, has no
 * navigation and offers nothing but a scroll cue, because the first half of
 * the homepage is immersion. An interior page has been chosen — the visitor
 * arrived wanting something — so this states what the page is and gets on
 * with it.
 *
 * ⚠ SiteHeader is `fixed` over the top of the page with light text. Every
 * interior hero therefore has to be a dark ground and carry `pt-36` or more,
 * or the nav lands on top of the headline and disappears. That coupling is
 * why this component exists rather than each page rolling its own. Past the
 * first 48px the header condenses to a small cluster at the right
 * margin, so only the hero has to hold the full band's clearance.
 */
export function PageHero({
  eyebrow,
  title,
  standfirst,
  tone = "evergreen",
  actions = [],
  children,
}: {
  eyebrow: string;
  title: string;
  /** One or two sentences. The drafts always give the page one. */
  standfirst?: string;
  tone?: Tone;
  /** In-page jumps, where the draft opens with them. Truth does. */
  actions?: readonly { label: string; href: string }[];
  /** Meta rows — Wonder's fact grid, Truth's era label. */
  children?: React.ReactNode;
}) {
  const ink = toneInk[tone];

  return (
    <section data-nav-hero className={`${toneBg[tone]} relative`}>
      <div className="mx-auto max-w-7xl px-6 pt-36 pb-20 lg:px-16 lg:pt-44">
        <Eyebrow className={ink.accent}>{eyebrow}</Eyebrow>

        <h1
          className={`headline mt-6 max-w-4xl text-h2 ${ink.heading}`}
        >
          {title}
        </h1>

        {standfirst ? (
          <p className={`mt-7 max-w-2xl text-lg leading-relaxed ${ink.body}`}>
            {standfirst}
          </p>
        ) : null}

        {actions.length > 0 ? (
          <div className="mt-9 flex flex-wrap gap-x-8 gap-y-3">
            {actions.map((action) => (
              <CtaLink key={action.href} href={action.href} tone={tone}>
                {action.label}
              </CtaLink>
            ))}
          </div>
        ) : null}

        {children ? <div className="mt-14">{children}</div> : null}
      </div>
    </section>
  );
}
