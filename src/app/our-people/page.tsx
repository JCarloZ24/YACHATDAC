import { FooterGround } from "@/components/layout/FooterGround";
import type { Metadata } from "next";
import { Band, BandHeading } from "@/components/layout/Band";
import { PageHero } from "@/components/layout/PageHero";
import { ContactBlock } from "@/components/sections/ContactBlock";
import { EditorialNote } from "@/components/ui/EditorialNote";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { PullQuote } from "@/components/ui/PullQuote";
import { Reveal } from "@/components/ui/Reveal";
import {
  acknowledgements,
  culturalAdvice,
  governance,
  ourPeopleHero,
  suzanneProfile,
  team,
  type Person,
} from "@/content/our-people";

export const metadata: Metadata = {
  title: "Our people",
  description: ourPeopleHero.standfirst,
};

/**
 * Our People.
 *
 * ⚠ Shared with care, and blocked on consent as much as on content. Most of
 * this page is placeholders, and they render as placeholders — see PersonCard.
 *
 * The cultural advice renders above the hero rather than inside the page body.
 * It is not a cookie banner: no dismiss, no collapse, and nothing above it.
 */
export default function OurPeoplePage() {
  return (
    <>
      {/*
        Above everything, including the hero. `pt-28` clears the absolute site
        header. Charcoal so it reads as part of the page's own opening rather
        than as a system message.
      */}
      <div className="bg-charcoal">
        <div className="mx-auto max-w-7xl px-6 pt-28 lg:px-16">
          <p className="max-w-3xl border-l-2 border-ochre pl-5 text-sm leading-relaxed text-canvas/70">
            {culturalAdvice}
          </p>
        </div>
      </div>

      <PageHero
        eyebrow={ourPeopleHero.eyebrow}
        title={ourPeopleHero.title}
        standfirst={ourPeopleHero.standfirst}
        tone="charcoal"
      />

      <Band tone="canvas">
        <div className="grid gap-14 lg:grid-cols-[20rem_minmax(0,1fr)] lg:gap-16">
          <div>
            <Reveal>
              <ImageSlot
                note={suzanneProfile.image}
                tone="canvas"
                aspect="portrait"
              />
            </Reveal>
            <Reveal index={1}>
              <div className="mt-6">
                <h2 className="headline text-2xl text-evergreen">
                  {suzanneProfile.name}
                </h2>
                <p className="mt-2 text-sm text-evergreen/70 italic">
                  {suzanneProfile.role}
                </p>
              </div>
            </Reveal>
          </div>

          <div>
            <div className="max-w-2xl space-y-5">
              {suzanneProfile.body.map((paragraph, index) => (
                <Reveal key={paragraph} index={index}>
                  <p className="text-base leading-relaxed text-evergreen/80">
                    {paragraph}
                  </p>
                </Reveal>
              ))}
            </div>

            <Reveal index={2}>
              <PullQuote
                tone="canvas"
                className="mt-10"
                attribution={suzanneProfile.name}
                role={suzanneProfile.role}
              >
                {suzanneProfile.quote}
              </PullQuote>
            </Reveal>

            {/*
              The sentence that governs the rest of the site. Set as a
              statement, not as a footnote — it is the reason Truth is held by
              community and the reason two change requests are on hold.
            */}
            <Reveal index={3}>
              <p className="headline mt-12 max-w-xl text-xl text-oxide">
                {suzanneProfile.authority}
              </p>
            </Reveal>

            <div className="mt-10 max-w-xl">
              <EditorialNote>
                <p>{suzanneProfile.pending}</p>
              </EditorialNote>
            </div>
          </div>
        </div>
      </Band>

      <Band tone="evergreen">
        <BandHeading title={team.title} lede={team.lede} tone="evergreen" />

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {team.people.map((person, index) => (
            <Reveal key={`${person.role}-${index}`} index={index}>
              <PersonCard person={person} />
            </Reveal>
          ))}
        </div>

        <div className="mt-12 max-w-2xl">
          <EditorialNote label="Blocked — needs consent, not just content">
            <p>{team.pending}</p>
          </EditorialNote>
        </div>
      </Band>

      <Band tone="canvas">
        <BandHeading title={governance.title} tone="canvas" />

        <div className="mt-6 max-w-2xl space-y-5">
          {governance.body.map((paragraph, index) => (
            <Reveal key={paragraph} index={index}>
              <p className="text-base leading-relaxed text-evergreen/80">
                {paragraph}
              </p>
            </Reveal>
          ))}
        </div>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {governance.people.map((person, index) => (
            <Reveal key={`${person.role}-${index}`} index={index}>
              <PersonCard person={person} tone="canvas" />
            </Reveal>
          ))}
        </div>

        <div className="mt-12 max-w-2xl">
          <EditorialNote label="Editorial note — tense, and unconfirmed names">
            <p>{governance.pending}</p>
          </EditorialNote>
        </div>
      </Band>

      <Band tone="roasted">
        <BandHeading
          title={acknowledgements.title}
          lede={acknowledgements.lede}
          tone="roasted"
        />

        <ul className="mt-14 space-y-8">
          {acknowledgements.people.map((person, index) => (
            <li key={person.name}>
              <Reveal index={index}>
                <div className="border-t border-canvas/20 pt-5 lg:grid lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-10">
                  <h3 className="headline text-lg text-ochre">{person.name}</h3>
                  <div className="mt-3 lg:mt-0">
                    <p className="max-w-2xl text-sm leading-relaxed text-canvas/75">
                      {person.detail}
                    </p>
                    {person.unconfirmed ? (
                      <p className="mt-2 text-xs text-ochre/80 italic">
                        {person.unconfirmed}
                      </p>
                    ) : null}
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>

        <div className="mt-12 max-w-2xl space-y-5">
          <EditorialNote label="Outstanding — Suzanne's decision">
            <p>{acknowledgements.outstanding}</p>
          </EditorialNote>
          <EditorialNote label="Every name needs checking">
            <p>{acknowledgements.pending}</p>
          </EditorialNote>
        </div>
      </Band>

      <ContactBlock />
      <FooterGround color="var(--color-charcoal)" />
    </>
  );
}

/**
 * One person, named or not.
 *
 * A person with no name renders as an explicitly empty slot: no bracketed
 * string that could be mistaken for a name, no invented placeholder like "Team
 * member". The role is real — the draft knows there are two Rangers, someone
 * on operations, someone on cultural heritage — so the role shows and the
 * identity does not.
 */
function PersonCard({
  person,
  tone = "evergreen",
}: {
  person: Person;
  tone?: "evergreen" | "canvas";
}) {
  const onCanvas = tone === "canvas";
  const named = person.name !== null;

  return (
    <article className="h-full">
      <ImageSlot
        note={named ? `Portrait — ${person.name}.` : "Portrait — to be confirmed."}
        tone={tone}
        aspect="portrait"
      />

      <div className="mt-5">
        {named ? (
          <h3
            className={`headline text-lg ${onCanvas ? "text-evergreen" : "text-canvas"}`}
          >
            {person.name}
          </h3>
        ) : (
          <p
            className={`text-lg italic ${onCanvas ? "text-evergreen/40" : "text-canvas/40"}`}
          >
            Name to be confirmed
          </p>
        )}

        <Eyebrow
          className={`mt-2 ${onCanvas ? "text-oxide" : "text-ochre"}`}
        >
          {person.role}
          {person.roleUnconfirmed ? " *" : ""}
        </Eyebrow>

        {person.bio ? (
          <p
            className={`mt-3 text-sm leading-relaxed ${
              onCanvas ? "text-evergreen/75" : "text-canvas/70"
            }`}
          >
            {person.bio}
          </p>
        ) : (
          <p
            className={`mt-3 text-sm italic ${
              onCanvas ? "text-evergreen/40" : "text-canvas/40"
            }`}
          >
            One or two lines — who they are and what they do here.
          </p>
        )}
      </div>
    </article>
  );
}
