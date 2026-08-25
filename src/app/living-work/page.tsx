import type { Metadata } from "next";
import { Band, BandHeading } from "@/components/layout/Band";
import { PageHero } from "@/components/layout/PageHero";
import { CtaLink } from "@/components/ui/CtaLink";
import { Disclosure } from "@/components/ui/Disclosure";
import { EditorialNote } from "@/components/ui/EditorialNote";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { Reveal } from "@/components/ui/Reveal";
import { SignupField } from "@/components/ui/SignupField";
import {
  challenges,
  getInvolved,
  infrastructure,
  livingWorkHero,
  outputs,
  outputsNote,
  rangers,
  workStreams,
} from "@/content/living-work";

export const metadata: Metadata = {
  title: "Living Work — Caring for Country",
  description: livingWorkHero.standfirst,
};

/**
 * Living Work — Caring for Country.
 *
 * The longest page on the site: thirteen challenges, seven work streams, six
 * infrastructure blocks, five outputs. Structure carries most of the weight —
 * the challenges collapse, the work streams are numbered, and the ground
 * changes at each section boundary.
 *
 * Three anchors are load-bearing (src/content/site.ts points at all three):
 * #rangers, #practice, #how-we-built-this.
 */
export default function LivingWorkPage() {
  return (
    <>
      <PageHero
        eyebrow={livingWorkHero.eyebrow}
        title={livingWorkHero.title}
        standfirst={livingWorkHero.standfirst}
        tone="evergreen"
      >
        <p className="max-w-2xl text-base leading-relaxed text-canvas/75">
          {livingWorkHero.secondary}
        </p>
      </PageHero>

      <Band tone="canvas">
        <BandHeading
          eyebrow="Our challenges"
          title="What the work is up against"
          tone="canvas"
        />

        {/*
          Native <details>. Thirteen rows stay a server component, work before
          hydration, and are findable with the browser's own find-in-page.
        */}
        <div className="mt-12 border-b border-evergreen/20">
          {challenges.map((challenge) => (
            <Disclosure
              key={challenge.title}
              summary={challenge.title}
              tone="canvas"
            >
              <p>{challenge.problem}</p>
              <p className="text-evergreen/70">{challenge.response}</p>
            </Disclosure>
          ))}
        </div>
      </Band>

      <Band id="rangers" tone="evergreen">
        <BandHeading title={rangers.title} tone="evergreen" />

        <Reveal index={2}>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-canvas/75">
            {rangers.body}
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {rangers.gallery.map((note, index) => (
            <Reveal key={note} index={index}>
              <ImageSlot note={note} caption={note} tone="evergreen" />
            </Reveal>
          ))}
        </div>
      </Band>

      <Band id="practice" tone="canvas">
        <BandHeading
          eyebrow="The work"
          title="What Rangers do on the ground"
          tone="canvas"
        />

        <div className="mt-14 space-y-12">
          {workStreams.map((stream) => (
            <article
              key={stream.number}
              className="grid gap-8 border-t border-evergreen/20 pt-8 lg:grid-cols-[5rem_minmax(0,1fr)_minmax(0,18rem)] lg:gap-12"
            >
              <Reveal>
                <p className="headline text-3xl text-oxide/50">
                  {stream.number}
                </p>
              </Reveal>

              <div>
                <Reveal>
                  <h3 className="headline text-2xl text-evergreen">
                    {stream.title}
                  </h3>
                </Reveal>
                <Reveal index={1}>
                  <p className="mt-4 max-w-2xl text-base leading-relaxed text-evergreen/80">
                    {stream.lede}
                  </p>
                </Reveal>
                <Reveal index={2}>
                  <p className="mt-4 max-w-2xl text-sm leading-relaxed text-evergreen/65">
                    {stream.detail}
                  </p>
                </Reveal>
              </div>

              <Reveal index={2}>
                <ImageSlot
                  note={`${stream.title} — work in progress.`}
                  tone="canvas"
                />
              </Reveal>
            </article>
          ))}
        </div>
      </Band>

      <Band id="how-we-built-this" tone="charcoal">
        <BandHeading
          eyebrow="Infrastructure and technology"
          title="What it takes to run a property 120 kilometres from the nearest town"
          tone="charcoal"
        />

        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {infrastructure.map((block, index) => (
            <Reveal key={block.title} index={index}>
              <div className="h-full border-t border-canvas/15 pt-5">
                <h3 className="eyebrow text-ochre">{block.title}</h3>
                <ul className="mt-4 space-y-2">
                  {block.points.map((point) => (
                    <li
                      key={point}
                      className="text-sm leading-relaxed text-canvas/75"
                    >
                      {point}
                    </li>
                  ))}
                </ul>
                {block.note ? (
                  <p className="mt-4 text-xs leading-relaxed text-canvas/50 italic">
                    {block.note}
                  </p>
                ) : null}
              </div>
            </Reveal>
          ))}
        </div>

        {/* R19 / CR5 — see the warning in content/living-work.ts. */}
        <div className="mt-14 max-w-2xl">
          <EditorialNote label="Requested, not written — needs the client's own words">
            <p>
              FNAN has asked for Single-Wire Earth Return (SWER) and the on-site
              petrol and diesel tanks to be included under Power. What was
              supplied is a general definition of how SWER works, not a
              statement of what is on this property.
            </p>
            <p>
              Ask what the actual arrangement is before writing it. This block is
              read by funders and neighbouring properties, and an unverified
              infrastructure claim sits next to the carbon and biodiversity
              claims below. Risk R19, change request CR5.
            </p>
          </EditorialNote>
        </div>
      </Band>

      <Band tone="roasted">
        <BandHeading
          eyebrow="What the work produces"
          title="The same activities, measured"
          tone="roasted"
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {outputs.map((output, index) => (
            <Reveal key={output.title} index={index}>
              <article
                className={`h-full rounded-sm border p-6 ${
                  output.unwritten
                    ? "border-dashed border-ochre/50 bg-ochre/5"
                    : "border-canvas/20"
                }`}
              >
                <h3 className="headline text-xl text-canvas">{output.title}</h3>

                {/*
                  ⚠ R14. This label is an unconfirmed public claim about
                  registration or legal status. It is styled as provisional on
                  purpose — do not promote it to a confident badge until
                  someone has checked it against the actual registration state.
                */}
                <Eyebrow className="mt-3 text-ochre">{output.status}</Eyebrow>

                <p className="mt-4 text-sm leading-relaxed text-canvas/75">
                  {output.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        <div className="mt-12 max-w-2xl">
          <EditorialNote label="Not confirmed — blocks publishing this section">
            <p>{outputsNote}</p>
            <p>
              Risk R14. Every label above, and the retitle of &ldquo;Carbon&rdquo;
              to &ldquo;Biological Sequestration&rdquo; requested by FNAN
              (CR2), should be confirmed in one pass against what is actually
              registered.
            </p>
          </EditorialNote>
        </div>
      </Band>

      <Band tone="evergreen">
        <Reveal>
          <ImageSlot
            note={getInvolved.image}
            tone="evergreen"
            aspect="wide"
            className="mb-16"
          />
        </Reveal>

        <BandHeading
          eyebrow={getInvolved.eyebrow}
          title={getInvolved.title}
          tone="evergreen"
        />

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {getInvolved.paths.map((path, index) => (
            <Reveal key={path.title} index={index}>
              <article className="flex h-full flex-col justify-between gap-6 border-t border-canvas/20 pt-5">
                <div>
                  <h3 className="eyebrow text-ochre">{path.title}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-canvas/75">
                    {path.body}
                  </p>
                </div>
                <CtaLink href={path.cta.href} tone="evergreen">
                  {path.cta.label}
                </CtaLink>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal index={3}>
          <div className="mt-16">
            <SignupField {...getInvolved.signup} />
          </div>
        </Reveal>
      </Band>
    </>
  );
}
