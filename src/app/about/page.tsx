import { FooterGround } from "@/components/layout/FooterGround";
import type { Metadata } from "next";
import { Band, BandHeading } from "@/components/layout/Band";
import { PageHero } from "@/components/layout/PageHero";
import { ContactBlock } from "@/components/sections/ContactBlock";
import { CtaLink } from "@/components/ui/CtaLink";
import { EditorialNote } from "@/components/ui/EditorialNote";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { FactGrid } from "@/components/ui/FactGrid";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { PullQuote } from "@/components/ui/PullQuote";
import { Reveal } from "@/components/ui/Reveal";
import {
  aboutHero,
  howWeWork,
  partners,
  thePeople,
  whatWeAre,
  whatWeDo,
  whoDecides,
  whyWeExist,
} from "@/content/about";

export const metadata: Metadata = {
  title: "About",
  description: aboutHero.standfirst,
};

/**
 * About YACHATDAC.
 *
 * New route. Every v3 draft links to `/about` and nothing was there — one of
 * the three missing routes the change-request register lists as evidence
 * against D2. Building the route is not an answer to D2; the site navigation
 * is unchanged and Connect still exists.
 *
 * `#partners` is load-bearing: the v3 homepage footer links to it.
 */
export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow={aboutHero.eyebrow}
        title={aboutHero.title}
        standfirst={aboutHero.standfirst}
        tone="evergreen"
      />

      <Band tone="canvas">
        <div className="grid gap-14 lg:grid-cols-2 lg:items-start">
          <div>
            <BandHeading title={whatWeAre.title} tone="canvas" />
            <div className="mt-6 max-w-xl space-y-5">
              {whatWeAre.body.map((paragraph, index) => (
                <Reveal key={paragraph} index={index}>
                  <p className="text-base leading-relaxed text-evergreen/80">
                    {paragraph}
                  </p>
                </Reveal>
              ))}
            </div>

            <FactGrid
              facts={whatWeAre.facts}
              tone="canvas"
              columns={2}
              className="mt-12"
            />

            {/* R15 — the legal name, and both registration numbers. */}
            <div className="mt-10 max-w-xl">
              <EditorialNote>
                <p>{whatWeAre.pending}</p>
              </EditorialNote>
            </div>
          </div>

          <Reveal index={1}>
            <ImageSlot note={aboutHero.image} tone="canvas" aspect="portrait" />
          </Reveal>
        </div>
      </Band>

      <Band tone="roasted">
        <BandHeading title={whyWeExist.title} tone="roasted" />

        <div className="mt-6 max-w-2xl space-y-5">
          {whyWeExist.body.map((paragraph, index) => (
            <Reveal key={paragraph} index={index}>
              <p className="text-base leading-relaxed text-canvas/75">
                {paragraph}
              </p>
            </Reveal>
          ))}
        </div>

        <Reveal index={2}>
          <PullQuote
            tone="roasted"
            className="mt-12"
            attribution={whyWeExist.attribution}
          >
            {whyWeExist.quote}
          </PullQuote>
        </Reveal>

        <Reveal index={3}>
          <p className="headline mt-14 max-w-2xl text-xl text-ochre">
            {whyWeExist.tagline}
          </p>
        </Reveal>
      </Band>

      <Band tone="canvas">
        <BandHeading
          title={whatWeDo.title}
          lede={whatWeDo.lede}
          tone="canvas"
        />

        <div className="mt-14 grid gap-8 sm:grid-cols-2">
          {whatWeDo.areas.map((area, index) => (
            <Reveal key={area.title} index={index}>
              <article className="flex h-full flex-col justify-between gap-6 border-t border-evergreen/20 pt-5">
                <div>
                  <h3 className="headline text-xl text-evergreen">
                    {area.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-evergreen/80">
                    {area.body}
                  </p>
                </div>
                <CtaLink href={area.cta.href} tone="canvas">
                  {area.cta.label}
                </CtaLink>
              </article>
            </Reveal>
          ))}
        </div>
      </Band>

      <Band tone="evergreen">
        <BandHeading title={howWeWork.title} tone="evergreen" />

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {howWeWork.values.map((value, index) => (
            <Reveal key={value.title} index={index}>
              <div className="border-t border-canvas/20 pt-5">
                <h3 className="eyebrow text-ochre">{value.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-canvas/75">
                  {value.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-12 max-w-2xl">
          <EditorialNote label="Editorial note — why the list is three, not seven">
            <p>{howWeWork.pending}</p>
          </EditorialNote>
        </div>
      </Band>

      <Band tone="canvas">
        <BandHeading title={whoDecides.title} tone="canvas" />

        <div className="mt-6 max-w-2xl space-y-5">
          {whoDecides.body.map((paragraph, index) => (
            <Reveal key={paragraph} index={index}>
              <p className="text-base leading-relaxed text-evergreen/80">
                {paragraph}
              </p>
            </Reveal>
          ))}
        </div>

        <Reveal index={3}>
          <div className="mt-10">
            <CtaLink href={whoDecides.cta.href} tone="canvas">
              {whoDecides.cta.label}
            </CtaLink>
          </div>
        </Reveal>

        <div className="mt-12 max-w-2xl">
          <EditorialNote label="Editorial note — tense">
            <p>{whoDecides.pending}</p>
          </EditorialNote>
        </div>
      </Band>

      <Band tone="roasted">
        <BandHeading title={thePeople.title} tone="roasted" />
        <Reveal index={2}>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-canvas/75">
            {thePeople.body}
          </p>
        </Reveal>
        <Reveal index={3}>
          <div className="mt-8">
            <CtaLink href={thePeople.cta.href} tone="roasted">
              {thePeople.cta.label}
            </CtaLink>
          </div>
        </Reveal>
      </Band>

      <Band id="partners" tone="canvas">
        <BandHeading
          title={partners.title}
          lede={partners.body}
          tone="canvas"
        />

        <div className="mt-14 grid gap-10 md:grid-cols-3">
          {partners.groups.map((group, index) => (
            <Reveal key={group.title} index={index}>
              <div className="border-t border-evergreen/20 pt-5">
                <Eyebrow className="text-oxide">{group.title}</Eyebrow>
                <ul className="mt-4 space-y-2">
                  {group.names.map((name) => (
                    <li key={name} className="text-sm text-evergreen/80">
                      {name}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        {/*
          Names, not logos. The draft asks for approved logo files and does not
          have them; an unapproved partner logo is a worse problem than a plain
          name, and half this list may not be current.
        */}
        <div className="mt-12 max-w-2xl">
          <EditorialNote label="Not confirmed — list and logo files">
            <p>{partners.pending}</p>
          </EditorialNote>
        </div>

        <Reveal index={4}>
          <div className="mt-10">
            <CtaLink href={partners.cta.href} tone="canvas">
              {partners.cta.label}
            </CtaLink>
          </div>
        </Reveal>
      </Band>

      <ContactBlock />
      <FooterGround color="var(--color-charcoal)" />
    </>
  );
}
