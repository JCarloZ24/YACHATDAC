import type { Metadata } from "next";
import { FooterGround } from "@/components/layout/FooterGround";
import { PageTransition } from "@/components/transitions/PageTransition";
import { org } from "@/content/site";
import {
  ConnectHero,
  ContactDetailsSection,
  NoForm,
  WaysIn,
} from "./_components/Sections";

export const metadata: Metadata = {
  title: "Connect",
  description: `Get in touch with ${org.name} — guesting, research and partnerships, ranger exchange, and material for the record.`,
};

/**
 * Connect — the hi-fi build (Figma 3028:28875, 08 · Connect — HI-FI · Desktop ·
 * the page reaches), promoted onto the real route the way /truth, /living-work,
 * /the-record, /our-people, /about and /partnerships were.
 *
 * The page's verb is REACHES, and it is the shortest on the site: five frames,
 * 645vh, of which the fifth is the footer. Its whole job is to hand the reader
 * off to a person, so it does one thing per screen — name itself, route them,
 * explain the missing form, give the details.
 *
 * ⚠ THIS PAGE IS STATIC BY DECISION, not by omission. No motion module, no
 * scroll animation, no hover. It renders the same with JavaScript on or off.
 *
 * ⚠⚠ THERE IS NO CONNECT DRAFT, and this is the most-linked destination on the
 * site — Truth, Living Work (three times), Resources, About and Our People all
 * point here. Every word is borrowed from a page that does have one, and each
 * section names its source. Do not add copy here without a provenance.
 *
 * ONE ANCHOR IS LOAD-BEARING. `#contact-details` (§04) is the hero's own
 * action, for the reader who already knows what they want.
 *
 * ⚠ WHAT IS HELD: R9 — no enquiry form until the Privacy Policy and Terms
 * exist, and both are still stubs. R15 — five of the six contact fields are
 * the drafter's square brackets, the email address included, so the primary
 * action is drawn and left unfilled rather than wired to a `mailto:` nobody
 * reads. D2 — whether Connect survives as a navigation item at all is still
 * open; building the page does not settle it either way, it stops six links
 * landing on a stub.
 */
export default function ConnectPage() {
  return (
    <PageTransition ground="#22372b">
      <ConnectHero />
      <WaysIn />
      <NoForm />
      <ContactDetailsSection />

      {/* §04 ends on charcoal, so the footer's band above its burnt crest is
          charcoal here — the same handover About makes. */}
      <FooterGround color="var(--color-charcoal)" />
    </PageTransition>
  );
}
