import type { Metadata } from "next";
import Link from "next/link";
import {
  Body,
  DraftNotice,
  HeldSlot,
  MediaSlot,
  Section,
  SectionHeader,
} from "@/components/sections/primitives";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import {
  beforeYouCome,
  downloads,
  firstNight,
  fromCountry,
  onCountry,
  whyGuesting,
  wonderHero,
  yourHosts,
} from "@/content/wonder";

export const metadata: Metadata = {
  title: "Wonder — Guesting on Country",
  description: wonderHero.body,
};

/**
 * Wonder — Guesting on Country. Eight blocks, one offer.
 *
 * Tier 2 only (F4): entry staggers and hovers. No pinning, no scrubbed media,
 * no parallax. Spans are content-driven here — nothing on this page reserves
 * scroll, because nothing on it pins.
 *
 * Not a listing grid and not a booking flow. "Country sets the days, not a
 * timetable" is the offer, so the CTA is an enquiry rather than a calendar.
 */
export default function WonderPage() {
  return (
    <>
      {/* 01 — Hero */}
      <section className="relative flex min-h-svh items-end overflow-hidden bg-evergreen">
        <div aria-hidden data-placeholder="hero-media" className="absolute inset-0" />
        {/* X5 — legibility scrim. Non-negotiable wherever copy sits on media. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-t from-evergreen/90 via-evergreen/40 to-evergreen/70"
        />
        <div className="relative mx-auto w-full max-w-7xl px-6 pt-32 pb-24 lg:px-16">
          <Eyebrow className="text-ochre">{wonderHero.eyebrow}</Eyebrow>
          <h1 className="headline mt-6 max-w-4xl text-4xl text-canvas sm:text-5xl lg:text-display">
            {wonderHero.headline}
          </h1>
          <p className="mt-8 max-w-2xl text-base leading-relaxed text-canvas/75">
            {wonderHero.body}
          </p>
          <div className="mt-10 max-w-xl">
            <DraftNotice circle="open" blockedOn="story wall dating — risk R2" />
          </div>
        </div>
      </section>

      {/* 02 — The first night */}
      <Section tone="bg-midnight">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeader
              eyebrow={firstNight.eyebrow}
              headline={firstNight.headline}
            />
            <Body paragraphs={firstNight.body} />
          </div>
          <Reveal index={2}>
            <MediaSlot note={firstNight.mediaNote} />
          </Reveal>
        </div>
      </Section>

      {/* 03 — Why we say guesting */}
      <Section tone="bg-canvas">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <MediaSlot
              note={whyGuesting.mediaNote}
              tone="bg-evergreen/10"
            />
          </Reveal>
          <div>
            <SectionHeader
              eyebrow={whyGuesting.eyebrow}
              headline={whyGuesting.headline}
              onDark={false}
            />
            <Body paragraphs={whyGuesting.body} onDark={false} />
          </div>
        </div>
      </Section>

      {/* 04 — On Country */}
      <Section tone="bg-roasted">
        <SectionHeader
          eyebrow={onCountry.eyebrow}
          headline={onCountry.headline}
        />
        <Body paragraphs={[onCountry.body]} />

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          {onCountry.cards.map((card, index) => (
            <Reveal key={card.title} index={index}>
              <article className="flex h-full flex-col gap-5 border border-canvas/15 p-7">
                {card.imageHeld ? (
                  <HeldSlot reason={card.imageHeld} />
                ) : (
                  <MediaSlot
                    note={card.title}
                    className="aspect-21/9"
                  />
                )}
                <Eyebrow className="text-ochre">{card.eyebrow}</Eyebrow>
                <h3 className="headline text-2xl text-canvas">{card.title}</h3>
                <p className="text-sm leading-relaxed text-canvas/75">
                  {card.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* 05 — Your hosts */}
      <Section tone="bg-canvas">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeader
              eyebrow={yourHosts.eyebrow}
              headline={yourHosts.headline}
              onDark={false}
            />
            <Body paragraphs={[yourHosts.body]} onDark={false} />
          </div>
          <Reveal index={2}>
            <MediaSlot note={yourHosts.mediaNote} tone="bg-evergreen/10" />
          </Reveal>
        </div>
      </Section>

      {/* 06 — Before you come · primary CTA */}
      <Section tone="bg-evergreen">
        <SectionHeader
          eyebrow={beforeYouCome.eyebrow}
          headline={beforeYouCome.headline}
        />

        <dl className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {beforeYouCome.logistics.map((item, index) => (
            <Reveal key={item.label} index={index}>
              <div className="border-t border-canvas/20 pt-4">
                <dt className="eyebrow text-canvas/50">{item.label}</dt>
                <dd className="mt-2 text-base text-canvas">{item.value}</dd>
              </div>
            </Reveal>
          ))}
        </dl>

        <Body paragraphs={beforeYouCome.body} startIndex={4} />

        <Reveal index={6}>
          <Link
            href={beforeYouCome.cta.href}
            className="eyebrow mt-10 inline-block bg-ochre px-8 py-4 text-charcoal transition-colors hover:bg-canvas"
          >
            {beforeYouCome.cta.label} →
          </Link>
        </Reveal>
      </Section>

      {/* 07 — From Country · editor-selected, not a live feed */}
      <Section tone="bg-canvas">
        <SectionHeader
          eyebrow={fromCountry.eyebrow}
          headline={fromCountry.headline}
          onDark={false}
        />
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {fromCountry.posts.map((post, index) => (
            <Reveal key={index} index={index}>
              <article className="flex h-full flex-col gap-4">
                <MediaSlot
                  note="editor-selected post"
                  className="aspect-video"
                  tone="bg-evergreen/10"
                />
                <h3 className="headline text-lg text-evergreen">
                  {post.title}
                </h3>
                <p className="text-sm text-evergreen/70">{post.excerpt}</p>
                <span className="eyebrow mt-auto text-oxide">
                  {fromCountry.cta} →
                </span>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* 08 — Downloads */}
      <Section tone="bg-charcoal">
        <SectionHeader
          eyebrow={downloads.eyebrow}
          headline={downloads.headline}
        />
        <Body paragraphs={[downloads.body]} />
        <Reveal index={3}>
          <Link
            href={downloads.cta.href}
            className="eyebrow mt-10 inline-block border border-canvas/30 px-8 py-4 text-canvas transition-colors hover:border-ochre hover:text-ochre"
          >
            {downloads.cta.label} ↓
          </Link>
        </Reveal>
      </Section>
    </>
  );
}
