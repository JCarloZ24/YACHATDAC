import { FooterGround } from "@/components/layout/FooterGround";
import type { Metadata } from "next";
import { Band, BandHeading } from "@/components/layout/Band";
import { PageHero } from "@/components/layout/PageHero";
import { ContactBlock } from "@/components/sections/ContactBlock";
import { CtaLink } from "@/components/ui/CtaLink";
import { EditorialNote } from "@/components/ui/EditorialNote";
import { Reveal } from "@/components/ui/Reveal";
import { org } from "@/content/site";

export const metadata: Metadata = {
  title: "Connect",
  description: `Get in touch with ${org.name} — guesting, research and partnerships, ranger exchange, and material for the record.`,
};

/**
 * Connect.
 *
 * ⚠ THERE IS NO CONNECT DRAFT, and this is the most-linked destination on the
 * site: Truth, Living Work (three times), Resources, About and Our People all
 * point here. It was a stub and every one of those links landed on a spec
 * outline.
 *
 * What it is built from is the "Get in touch" block that the About and Our
 * People drafts both carry word for word — the client has written a contact
 * block, just not a Connect page — plus the three routes into the
 * organisation that Living Work's "Get involved" section names.
 *
 * Nothing is invented. There is no enquiry form, because build documentation
 * §11 is explicit that the legal pages must exist before any form goes live
 * and neither the Privacy Policy nor the Terms have content yet (see R9). The
 * signup field elsewhere on the site is deliberately inert for the same
 * reason.
 *
 * ⚠ D2 — whether Connect survives as a navigation item now that About and
 * Contact have been lifted out of it — is still open. Two rounds of client
 * drafting have produced a nav with no Connect in it while linking here from
 * five places, which is evidence for the lo-fi review and not an answer.
 * Building this page does not settle it either way; it stops six links landing
 * on a stub.
 */

/** Named in Living Work's "Get involved". The three ways in, in its words. */
const ways = [
  {
    title: "Coming on Country",
    body: "Guesting for families, school groups and visitors. Small groups, and dates arranged with you rather than off a list.",
    cta: { label: "Guesting On-Country", href: "/wonder" },
  },
  {
    title: "Research and partnerships",
    body: "A researcher on Country is a guest on Country. Partnerships here are expected to give something back to the land and the people.",
    cta: { label: "Research opportunities", href: "/partnerships" },
  },
  {
    title: "Ranger exchange",
    body: "On-Country training camps and exchanges with other First Nations ranger groups.",
    cta: { label: "See the work", href: "/living-work#rangers" },
  },
  {
    title: "Something for the record",
    body: "Photographs of the escarpment or the station, station records, letters, diaries, maps, and family papers mentioning Iningai people.",
    cta: { label: "What is in the record", href: "/resources" },
  },
];

export default function ConnectPage() {
  return (
    <>
      <PageHero
        eyebrow="Connect"
        title="Get in touch"
        standfirst="Different things go to different people. Tell us which and it reaches the right person faster."
        tone="evergreen"
      />

      <Band tone="canvas">
        <BandHeading title="Ways in" tone="canvas" />

        <div className="mt-14 grid gap-8 sm:grid-cols-2">
          {ways.map((way, index) => (
            <Reveal key={way.title} index={index}>
              <article className="flex h-full flex-col justify-between gap-6 border-t border-evergreen/20 pt-5">
                <div>
                  <h3 className="headline text-xl text-evergreen">
                    {way.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-evergreen/80">
                    {way.body}
                  </p>
                </div>
                <CtaLink href={way.cta.href} tone="canvas">
                  {way.cta.label}
                </CtaLink>
              </article>
            </Reveal>
          ))}
        </div>

        <div className="mt-14 max-w-2xl">
          <EditorialNote label="No form — and that is on purpose">
            <p>
              There is no enquiry form on this page. Build documentation §11 and
              risk R9 both require the Privacy Policy and Terms to exist before
              any form goes live, and both legal routes are still placeholders.
            </p>
            <p>
              There is also no Connect draft. The block below is the &ldquo;Get
              in touch&rdquo; section the About and Our People drafts both
              carry, and the four ways in are Living Work&rsquo;s. When a
              Connect draft arrives, this page is where it goes.
            </p>
          </EditorialNote>
        </div>
      </Band>

      {/*
        showRoutes={false}: the four routes ContactBlock renders are the same
        four as "Ways in" above, which carries them in fuller words. Only the
        contact details are wanted here.
      */}
      <ContactBlock tone="charcoal" showRoutes={false} />
      <FooterGround color="var(--color-charcoal)" />
    </>
  );
}
