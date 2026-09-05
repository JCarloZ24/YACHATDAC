import { FooterGround } from "@/components/layout/FooterGround";
import type { Metadata } from "next";
import { Band, BandHeading } from "@/components/layout/Band";
import { PageHero } from "@/components/layout/PageHero";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { CtaLink } from "@/components/ui/CtaLink";
import { EditorialNote } from "@/components/ui/EditorialNote";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { FactGrid } from "@/components/ui/FactGrid";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { Reveal } from "@/components/ui/Reveal";
import {
  gettingHere,
  inclusions,
  inclusionsNote,
  stayStages,
  turraburra,
  whatItIsLike,
  whereYouSleep,
  whoYouAreWith,
  wonderClose,
  wonderGallery,
  wonderHero,
  wonderHighlights,
  wonderStories,
} from "@/content/wonder";

export const metadata: Metadata = {
  title: "Wonder — Guesting On-Country",
  description: wonderHero.standfirst,
};

/**
 * Wonder — Guesting On-Country.
 *
 * Built from the v3 draft (D5). The ground moves through the page —
 * evergreen → canvas → midnight for the night beat → canvas → roasted — for
 * the same reason the homepage beats do: it is a long page and the colour
 * change is what keeps the sections from running together.
 *
 * The `#experience` id on "What a stay looks like" is load-bearing: two nav
 * children in src/content/site.ts point at it.
 */
export default function WonderPage() {
  return (
    <>
      <PageHero
        eyebrow={wonderHero.eyebrow}
        title={wonderHero.title}
        standfirst={wonderHero.standfirst}
        tone="evergreen"
      >
        <p className="eyebrow mb-12 text-canvas/50">
          {wonderHero.summary.join(" · ")}
        </p>
        <FactGrid facts={wonderHero.facts} tone="evergreen" />
      </PageHero>

      {/* Opening gallery. Nine art-direction slots, no assets — STATUS note 12. */}
      <Band tone="canvas">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {wonderGallery.map((note, index) => (
            <Reveal key={note} index={index}>
              <ImageSlot note={note} tone="canvas" />
            </Reveal>
          ))}
        </div>
      </Band>

      <Band tone="canvas" className="pt-0">
        <BandHeading eyebrow="Highlights" title="What you come for" tone="canvas" />

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {wonderHighlights.map((highlight, index) => (
            <Reveal key={highlight.title} index={index}>
              <article>
                <ImageSlot note={highlight.image} tone="canvas" />
                <Eyebrow className="mt-6 text-oxide">
                  {highlight.eyebrow}
                </Eyebrow>
                <h3 className="headline mt-2 text-2xl text-evergreen">
                  {highlight.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-evergreen/80">
                  {highlight.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </Band>

      <Band tone="roasted">
        <BandHeading title={gettingHere.title} tone="roasted" />

        <div className="mt-8 grid gap-14 lg:grid-cols-2">
          <div className="max-w-xl space-y-5">
            {gettingHere.body.map((paragraph, index) => (
              <Reveal key={paragraph} index={index}>
                <p className="text-base leading-relaxed text-canvas/75">
                  {paragraph}
                </p>
              </Reveal>
            ))}
          </div>

          <div>
            <ul className="space-y-5">
              {gettingHere.stops.map((stop, index) => (
                <li key={stop.name}>
                  <Reveal index={index}>
                    <div className="border-t border-canvas/20 pt-4">
                      <p className="eyebrow text-ochre">{stop.name}</p>
                      <p className="mt-2 text-sm leading-relaxed text-canvas/75">
                        {stop.detail}
                      </p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>

            <Reveal index={4}>
              <p className="mt-8 text-base leading-relaxed text-canvas/75">
                {gettingHere.coda}
              </p>
            </Reveal>
          </div>
        </div>
      </Band>

      {/* #turraburra — the Connect nav's "About Turraburra" child points here. */}
      <Band id="turraburra" tone="canvas">
        <BandHeading title={turraburra.title} tone="canvas" />

        <div className="mt-8 grid gap-12 lg:grid-cols-2 lg:items-start">
          <Reveal>
            <p className="max-w-xl text-base leading-relaxed text-evergreen/80">
              {turraburra.body}
            </p>
          </Reveal>
          <Reveal index={1}>
            <ImageSlot
              note={turraburra.image}
              caption={turraburra.caption}
              tone="canvas"
              aspect="wide"
            />
          </Reveal>
        </div>
      </Band>

      {/* The stay. Midnight ground — the first night is the middle of it. */}
      <Band id="experience" tone="midnight">
        <BandHeading
          eyebrow="Guesting On-Country"
          title="What a stay looks like"
          lede="Stages, not days. Nothing here is an itinerary."
          tone="midnight"
        />

        <div className="mt-16 space-y-20">
          {stayStages.map((stage) => (
            <article
              key={stage.title}
              className="grid gap-10 border-t border-canvas/15 pt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"
            >
              <div>
                <Reveal>
                  <h3 className="headline text-2xl text-canvas">
                    {stage.title}
                  </h3>
                </Reveal>

                <div className="mt-5 max-w-xl space-y-5">
                  {stage.body.map((paragraph, index) => (
                    <Reveal key={paragraph} index={1 + index}>
                      <p className="text-base leading-relaxed text-canvas/75">
                        {paragraph}
                      </p>
                    </Reveal>
                  ))}
                </div>

                {stage.points ? (
                  <Reveal index={3}>
                    <ul className="mt-7 space-y-2">
                      {stage.points.map((point) => (
                        <li
                          key={point}
                          className="border-l border-ochre/40 pl-4 text-sm leading-relaxed text-canvas/70"
                        >
                          {point}
                        </li>
                      ))}
                    </ul>
                  </Reveal>
                ) : null}

                {stage.coda ? (
                  <Reveal index={4}>
                    <p className="headline mt-8 max-w-md text-xl text-ochre">
                      {stage.coda}
                    </p>
                  </Reveal>
                ) : null}
              </div>

              {stage.images ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 lg:gap-6">
                  {stage.images.map((note, index) => (
                    <Reveal key={note} index={index}>
                      <ImageSlot note={note} tone="midnight" />
                    </Reveal>
                  ))}
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </Band>

      <Band tone="canvas">
        <BandHeading title="What's included" tone="canvas" />

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {inclusions.map((group, index) => (
            <Reveal key={group.title} index={index}>
              <div className="border-t border-evergreen/20 pt-5">
                <h3 className="eyebrow text-oxide">{group.title}</h3>
                <ul className="mt-4 space-y-2">
                  {group.points.map((point) => (
                    <li
                      key={point}
                      className="text-sm leading-relaxed text-evergreen/80"
                    >
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        {/* R13. The draft carries this note itself; it is not ours to drop. */}
        <div className="mt-12 max-w-2xl">
          <EditorialNote>
            <p>{inclusionsNote}</p>
          </EditorialNote>
        </div>
      </Band>

      <Band tone="roasted">
        <div className="grid gap-14 lg:grid-cols-2">
          <div>
            <BandHeading title={whereYouSleep.title} tone="roasted" />
            <Reveal index={2}>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-canvas/75">
                {whereYouSleep.body}
              </p>
            </Reveal>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {whereYouSleep.images.map((note, index) => (
                <Reveal key={note} index={index}>
                  <ImageSlot note={note} tone="roasted" />
                </Reveal>
              ))}
            </div>
          </div>

          <div>
            <BandHeading title={whatItIsLike.title} tone="roasted" />
            <ul className="mt-8 space-y-4">
              {whatItIsLike.points.map((point, index) => (
                <li key={point}>
                  <Reveal index={index}>
                    <p className="border-t border-canvas/20 pt-4 text-sm leading-relaxed text-canvas/75">
                      {point}
                    </p>
                  </Reveal>
                </li>
              ))}
            </ul>

            <Reveal index={5}>
              <ImageSlot
                note={whatItIsLike.image}
                tone="roasted"
                aspect="wide"
                className="mt-10"
              />
            </Reveal>
          </div>
        </div>
      </Band>

      <Band tone="evergreen">
        <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
          <div>
            <BandHeading title={whoYouAreWith.title} tone="evergreen" />
            <Reveal index={2}>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-canvas/75">
                {whoYouAreWith.body}
              </p>
            </Reveal>
            <Reveal index={3}>
              <p className="headline mt-8 max-w-md text-xl text-ochre">
                {whoYouAreWith.tagline}
              </p>
            </Reveal>
          </div>

          <Reveal index={1}>
            <ImageSlot note={whoYouAreWith.image} tone="evergreen" aspect="wide" />
          </Reveal>
        </div>
      </Band>

      <Band tone="canvas">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <BandHeading
            title={wonderStories.title}
            lede={wonderStories.lede}
            tone="canvas"
          />
          <CtaLink href={wonderStories.href} tone="canvas">
            See all
          </CtaLink>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {wonderStories.items.map((item, index) => (
            <Reveal key={item.href} index={index}>
              <ArticleCard
                tag={item.tag}
                title={item.title}
                summary={item.summary}
                href={item.href}
                image="Story thumbnail."
                tone="canvas"
              />
            </Reveal>
          ))}
        </div>

        <div className="mt-12 max-w-2xl">
          <EditorialNote label="Editorial note — CMS behaviour, not copy">
            <p>{wonderStories.cmsNote}</p>
          </EditorialNote>
        </div>
      </Band>

      <Band tone="charcoal">
        <div className="grid gap-14 lg:grid-cols-2">
          <div>
            <BandHeading
              eyebrow={wonderClose.eyebrow}
              title={wonderClose.title}
              tone="charcoal"
            />
            <Reveal index={2}>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-canvas/75">
                {wonderClose.body}
              </p>
            </Reveal>

            <Reveal index={3}>
              <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
                <CtaLink href="/connect" tone="charcoal">
                  Register your interest
                </CtaLink>
              </div>
            </Reveal>

            {/*
              The brochure is a real download in the draft and there is no PDF
              in the repo. Rendered as a marked note rather than as a link that
              would 404 — build documentation §11 and the same rule the signup
              field follows.
            */}
            <div className="mt-10 max-w-md">
              <EditorialNote label="Not built — no asset">
                <p>{wonderClose.download}</p>
                <p>
                  &ldquo;Download the brochure&rdquo; needs a PDF before the
                  link can exist.
                </p>
              </EditorialNote>
            </div>
          </div>

          <div>
            <ul className="space-y-4">
              {wonderClose.facts.map((fact, index) => (
                <li key={fact}>
                  <Reveal index={index}>
                    <p className="border-t border-canvas/15 pt-4 text-sm text-canvas/70">
                      {fact}
                    </p>
                  </Reveal>
                </li>
              ))}
            </ul>

            <Reveal index={4}>
              <p className="mt-10 text-base leading-relaxed text-canvas/75 italic">
                {wonderClose.note}
              </p>
            </Reveal>

            <div className="mt-10">
              <EditorialNote label="Editorial note — planned, not built">
                <p>{wonderClose.futureNote}</p>
              </EditorialNote>
            </div>
          </div>
        </div>
      </Band>
      <FooterGround color="var(--color-charcoal)" />
    </>
  );
}
