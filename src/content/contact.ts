/**
 * The "Get in touch" block.
 *
 * Source of truth: the identical closing sections of
 * docs/content/drafts/connect/YACHATDAC-About-Copy-v1.md and
 * docs/content/drafts/connect/YACHATDAC-OurPeople-Copy-v1.md (decision D5).
 * Both v1 drafts carry the same block word for word, so it lives here once and
 * both pages import it — and so does /connect, which every other page links to
 * without there being a Connect draft of its own.
 *
 * ⚠ EVERY CONTACT DETAIL IS A PLACEHOLDER. The drafts write them as
 * `[ street address ]`, `[ PO Box, Barcaldine QLD 4725 ]`,
 * `[ info@yachatdac.com.au ]`, `[ number ]`, `ICN [ number ] · ABN [ number ]`.
 * The square brackets are the drafter's, and they mean "not confirmed" —
 * including the email address, which looks real and is not.
 *
 * They are modelled as `pending` rather than typed out as strings so the UI
 * cannot render one as a live mailto: or tel: by accident. Publishing an
 * unverified address on a contact page is worse than publishing none: mail
 * goes somewhere nobody reads and the sender thinks they have made contact.
 *
 * Fill these in by clearing `pending` and setting `value`. R15 (the ORIC legal
 * name) and the About draft's ICN/ABN note are the same piece of work.
 */

export type ContactDetail = {
  label: string;
  /** Confirmed value, or the shape of the value still being chased. */
  value: string;
  /** True while the draft still has this in square brackets. */
  pending?: boolean;
  /** Protocol to link with, once confirmed. Ignored while pending. */
  href?: "mailto" | "tel";
};

export const contactDetails: readonly ContactDetail[] = [
  {
    label: "Office",
    value: "Barcaldine, Central Western Queensland",
  },
  { label: "Street address", value: "To be confirmed", pending: true },
  { label: "Postal", value: "PO Box, Barcaldine QLD 4725", pending: true },
  {
    label: "Email",
    value: "info@yachatdac.com.au",
    pending: true,
    href: "mailto",
  },
  { label: "Phone", value: "To be confirmed", pending: true, href: "tel" },
  { label: "Registration", value: "ICN — · ABN —", pending: true },
];

/**
 * The router — "Different things go to different people."
 *
 * Worth keeping as four separate destinations rather than one form. A school
 * booking and a research partnership are answered by different people out of
 * different inboxes, and the draft says so in as many words.
 */
export const contactRoutes = {
  title: "What are you after?",
  lede: "Different things go to different people. Tell us which and it reaches the right person faster.",
  routes: [
    {
      title: "Coming on Country",
      description: "Guesting, school groups, bookings",
      href: "/wonder",
    },
    {
      title: "Research or partnership",
      description: "Universities, funders, brands",
      href: "/truth#partner",
    },
    {
      title: "Ranger exchange",
      description: "Other First Nations groups",
      href: "/connect",
    },
    {
      title: "Something for the record",
      description: "Photographs, papers, family records",
      href: "/connect",
    },
  ],
} as const;

/**
 * Carried on both drafts, directly under the contact block. It is a real
 * operational constraint from the Living Work draft — there is no dependable
 * mobile coverage on the property apart from patches on top of the escarpment
 * — and it is the reason a published phone number needs answering hours
 * against it.
 */
export const contactNote =
  "Turraburra has no reliable mobile coverage. If a phone number is published, say which hours it is answered.";
