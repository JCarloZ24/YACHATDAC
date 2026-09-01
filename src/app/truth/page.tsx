import { FooterGround } from "@/components/layout/FooterGround";
import type { Metadata } from "next";
import Link from "next/link";
import { Band } from "@/components/layout/Band";
import { PageHero } from "@/components/layout/PageHero";
import { TruthEraSection } from "@/components/sections/TruthEra";
import { EditorialNote } from "@/components/ui/EditorialNote";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { PullQuote } from "@/components/ui/PullQuote";
import { Reveal } from "@/components/ui/Reveal";
import {
  erasAfter,
  erasBefore,
  publication,
  suzanne,
  truthHero,
} from "@/content/truth";

export const metadata: Metadata = {
  title: "Truth",
  description: truthHero.standfirst,
};

/**
 * Truth — the descent, newest first.
 *
 * ⚠ HELD BY COMMUNITY. This page carries Suzanne Thompson's recorded words and
 * is not publishable until she has approved them. The draft warning renders on
 * the page, in place, above her section. Do not remove it to make the page
 * look finished; removing it is the failure mode it exists to prevent.
 *
 * Structure follows the draft exactly: eras above her account, then her
 * account on its own ground with nothing else on it, then the eras below —
 * older. The draft's build note explains why the section is isolated, and it
 * renders too.
 */
export default function TruthPage() {
  return (
    <>
      <PageHero
        eyebrow={truthHero.eyebrow}
        title={truthHero.title}
        standfirst={truthHero.standfirst}
        actions={truthHero.actions}
        tone="charcoal"
      />

      {erasBefore.map((era) => (
        <TruthEraSection key={era.marker} era={era} />
      ))}

      {/*
        The 1902 section. Oxide — the Land — and it is the only band on the
        page that uses it, which is the whole treatment: the descent stops
        here and the ground changes under it.
      */}
      <Band tone="oxide">
        <Reveal>
          <Eyebrow className="text-canvas">{suzanne.marker}</Eyebrow>
        </Reveal>

        {/* Not decoration. See the warning at the top of content/truth.ts. */}
        <div className="mt-8 max-w-2xl">
          <EditorialNote label="Draft — awaiting Suzanne Thompson's approval">
            <p>{suzanne.draftWarning}</p>
          </EditorialNote>
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-16">
          <div>
            <Reveal>
              <ImageSlot
                note={suzanne.image}
                tone="oxide"
                aspect="portrait"
              />
            </Reveal>
            <Reveal index={1}>
              <div className="mt-6">
                <p className="eyebrow text-canvas/60">Told by</p>
                <p className="headline mt-2 text-xl text-canvas">
                  {suzanne.attribution}
                </p>
                <p className="mt-1 text-sm text-canvas/70 italic">
                  {suzanne.role}
                </p>
              </div>
            </Reveal>
          </div>

          <div>
            <Reveal>
              <h2 className="headline max-w-2xl text-4xl text-canvas sm:text-5xl">
                {suzanne.title}
              </h2>
            </Reveal>

            <Reveal index={1}>
              <PullQuote
                tone="oxide"
                className="mt-10"
                attribution={suzanne.attribution}
                role={suzanne.role}
              >
                {suzanne.openingQuote}
              </PullQuote>
            </Reveal>

            <Reveal index={2}>
              <p className="mt-10 max-w-2xl text-base leading-relaxed text-canvas/80">
                {suzanne.lede}
              </p>
            </Reveal>

            <dl className="mt-10 max-w-2xl space-y-6">
              {suzanne.figures.map((figure, index) => (
                <Reveal key={figure.year} index={index}>
                  <div className="border-t border-canvas/25 pt-4 sm:grid sm:grid-cols-[6rem_minmax(0,1fr)] sm:gap-6">
                    <dt className="eyebrow text-canvas">{figure.year}</dt>
                    <dd className="mt-2 text-sm leading-relaxed text-canvas/80 sm:mt-0">
                      {figure.detail}
                    </dd>
                  </div>
                </Reveal>
              ))}
            </dl>

            <Reveal index={2}>
              <p className="mt-6 max-w-2xl text-xs leading-relaxed text-canvas/60">
                <Link
                  href={suzanne.citation.href}
                  className="underline underline-offset-4"
                  target="_blank"
                  rel="noreferrer"
                >
                  {suzanne.citation.text}
                </Link>
              </p>
            </Reveal>

            {/*
              ⚠ CR4 and CR10 both want words changed inside these two quotes.
              Both are HELD pending D15 — see R17 and the note in PullQuote.
            */}
            <div className="mt-12 space-y-8">
              {suzanne.quotes.map((quote, index) => (
                <Reveal key={quote} index={index}>
                  <PullQuote tone="oxide" attribution={suzanne.attribution}>
                    {quote}
                  </PullQuote>
                </Reveal>
              ))}
            </div>

            <Reveal index={1}>
              <p className="mt-12 max-w-2xl text-base leading-relaxed text-canvas/80">
                {suzanne.afterQuotes}
              </p>
            </Reveal>

            <Reveal index={2}>
              <PullQuote
                tone="oxide"
                className="mt-10"
                attribution={suzanne.attribution}
              >
                {suzanne.standingQuote}
              </PullQuote>
            </Reveal>

            <div className="mt-12 max-w-2xl space-y-6">
              {suzanne.closing.map((paragraph, index) => (
                <Reveal key={paragraph} index={index}>
                  <p className="text-base leading-relaxed text-canvas/80">
                    {paragraph}
                  </p>
                </Reveal>
              ))}
            </div>

            {/* Her two open questions. Neither has been answered. */}
            <div className="mt-14 max-w-2xl space-y-5">
              <EditorialNote label="For Suzanne to check — unanswered">
                <p>{suzanne.checkNote}</p>
              </EditorialNote>

              <EditorialNote label="Build note — for the wireframes">
                <p>{suzanne.buildNote}</p>
              </EditorialNote>
            </div>
          </div>
        </div>
      </Band>

      {erasAfter.map((era) => (
        <TruthEraSection key={era.marker} era={era} />
      ))}

      <Band tone="charcoal">
        <Reveal>
          <p className="eyebrow text-canvas/50">Published as</p>
        </Reveal>
        <Reveal index={1}>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-canvas/75">
            <Link
              href={publication.href}
              className="underline underline-offset-4 hover:text-ochre"
              target="_blank"
              rel="noreferrer"
            >
              {publication.title}
            </Link>
            <span className="block text-sm text-canvas/50 italic">
              {publication.journal}
            </span>
          </p>
        </Reveal>
      </Band>
      <FooterGround color="var(--color-charcoal)" />
    </>
  );
}
