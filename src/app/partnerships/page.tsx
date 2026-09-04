import { FooterGround } from "@/components/layout/FooterGround";
import type { Metadata } from "next";
import { Band, BandHeading } from "@/components/layout/Band";
import { PageHero } from "@/components/layout/PageHero";
import { ContactBlock } from "@/components/sections/ContactBlock";
import { CtaLink } from "@/components/ui/CtaLink";
import { EditorialNote } from "@/components/ui/EditorialNote";
import { Reveal } from "@/components/ui/Reveal";
import { knowledgeGaps } from "@/content/the-record";

export const metadata: Metadata = {
  title: "Partnerships",
  description:
    "Research and partnership opportunities on Turraburra. A researcher on Country is a guest on Country.",
};

/**
 * Partnerships.
 *
 * ⚠ THIS PAGE HAS NO DRAFT. It is the third of the three routes the v3
 * prototypes link to and the IA does not contain — `/about` and `/our-people`
 * had drafts of their own, and this one does not.
 *
 * Two pages link to `#research-opportunities` specifically: Truth's "Open
 * research" entry and the Resources knowledge-gaps section. Left unbuilt, both
 * are dead links to a 404.
 *
 * So this page carries exactly two things and invents nothing:
 *
 *   1. The **research opportunities** the client has already written, taken
 *      verbatim from the Truth draft ("Most of this Country has never been
 *      studied…") and the Resources draft's "What we do not know". Those are
 *      the client's words about this subject, reused for the destination they
 *      already point at. `knowledgeGaps` is imported from content/the-record.ts
 *      rather than copied, so the two pages cannot drift apart.
 *
 *   2. A visible note saying the rest of the page is unwritten.
 *
 * It does NOT invent partnership tiers, benefits, process copy or a form. When
 * a Partnerships draft arrives, replace the note with it.
 *
 * ⚠ This route existing is not an answer to D2. The site nav is unchanged.
 */

/** Verbatim from the Truth v3 draft's "Open research" entry. */
const openResearch = {
  title: "Open research",
  body: "Most of this Country has never been studied. We are looking for researchers in palaeontology and archaeology, ecology and biodiversity, and medicinal botany.",
};

/** Verbatim from the Truth v3 draft's "Partnerships" entry. */
const partnershipPrinciple =
  "A researcher on Country is a guest on Country. Partnerships here are expected to give something back to the land and the people.";

export default function PartnershipsPage() {
  return (
    <>
      <PageHero
        eyebrow="Work with us"
        title="Partnerships"
        standfirst={partnershipPrinciple}
        tone="evergreen"
      />

      <Band id="research-opportunities" tone="canvas">
        <BandHeading
          eyebrow="Still to be found"
          title={openResearch.title}
          lede={openResearch.body}
          tone="canvas"
        />

        <div className="mt-14">
          <h3 className="eyebrow text-oxide">{knowledgeGaps.title}</h3>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-evergreen/80">
            {knowledgeGaps.lede}
          </p>

          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            {knowledgeGaps.gaps.map((gap, index) => (
              <Reveal key={gap.question} index={index}>
                <div className="border-t border-evergreen/20 pt-5">
                  <h4 className="headline text-lg text-evergreen">
                    {gap.question}
                  </h4>
                  <p className="mt-3 text-sm leading-relaxed text-evergreen/75">
                    {gap.detail}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal index={4}>
          <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3">
            <CtaLink href="/truth#partner" tone="canvas">
              How research works here
            </CtaLink>
            <CtaLink href="/the-record" tone="canvas">
              What has been found so far
            </CtaLink>
          </div>
        </Reveal>
      </Band>

      <Band tone="roasted">
        <div className="max-w-2xl">
          <EditorialNote label="No draft — this page is a landing point, not a page yet">
            <p>
              Three v3 prototypes link to <code>/partnerships</code> and there is
              no Partnerships draft. The section above reuses the research copy
              the client has already written, on the Truth and Resources drafts,
              because that is the anchor both of them link to.
            </p>
            <p>
              Everything a partnerships page would normally carry — what a
              partnership involves, what is expected of a partner, the research
              protocol, who to approach and how — is unwritten. The research
              protocol is already listed as &ldquo;in preparation&rdquo; in The
              Record, so this page and that document want writing together.
            </p>
            <p>
              This route existing does not settle D2. Whether Partnerships,
              About and Our People sit under Connect or at top level is still
              the open information-architecture question.
            </p>
          </EditorialNote>
        </div>
      </Band>

      <ContactBlock />
      <FooterGround color="var(--color-charcoal)" />
    </>
  );
}
