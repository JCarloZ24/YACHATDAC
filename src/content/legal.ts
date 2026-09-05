/**
 * The three legal documents.
 *
 * Source of truth: Figma `09 · Legal — HI-FI · Desktop · the page holds`
 * (3113:27146). Three routes share one template — the frame says so in its own
 * §00, which is a route index and not a page — so the structure lives in
 * `LegalDocument` and only the words live here.
 *
 * ⚠⚠ EVERY WORD OF THIS IS SPECIMEN TEXT. It is not YACHATDAC's policy, it has
 * not been near a lawyer, and it must be replaced wholesale when counsel
 * supplies the real documents. It exists because a legal page drawn as clause
 * headings over dashed rules cannot be reviewed at its real length and rhythm
 * — 2026-09-02: *"add a placeholder content and just flag it to replace after
 * legals are provided. but for now, add soemthing."*
 *
 * ⚠ THE LINE THAT KEEPS THIS HONEST. Prose that is generic to the document
 * type is fine, because any privacy policy says it. **Anything that would come
 * from the client is bracketed and renders in oxide** — retention periods,
 * provider names, the contact address, refund terms, the date. Nothing here
 * asserts a fact about YACHATDAC that is not already true elsewhere in this
 * repo, and no bracketed value is ever filled in by guessing.
 *
 * The headings are the part designed to survive: they are the Australian
 * Privacy Principles' own subject areas, so counsel replaces the prose and the
 * structure stands.
 *
 * ⚠ R9 — these three documents are what the whole site is waiting on. No form
 * anywhere goes live until they exist for real: the signup field is inert, and
 * /connect draws its primary action without filling it in, for this reason.
 */

export type LegalClause = {
  /** Two-digit, as the frame sets them. */
  number: string;
  title: string;
  body: string;
  /**
   * The bracketed value counsel or the client has to supply. Rendered inline
   * at the end of `body`, in oxide, and never filled in by guessing.
   */
  held?: string;
};

export type LegalDoc = {
  slug: "privacy" | "terms" | "cookies";
  title: string;
  /** Browser tab and metadata. */
  metaTitle: string;
  /**
   * The note in the specimen banner — what this document is for and what has
   * to be true before it can be written. Carried over from `LegalStub`, which
   * is where it was first written and where the build documentation put it.
   */
  note: string;
  /** boomerang / circle / starburst — decorative, never a category. */
  glyph: "a" | "b" | "c";
  /** The frame's background spiral, and which side it sits on. */
  ring: { piece: "a" | "b"; side: "left" | "right" };
  clauses: readonly LegalClause[];
};

export const SPECIMEN_BANNER =
  "⟡ Specimen text · not legal advice · replace entirely when counsel supplies the document";

/** The value every document's date carries until there is a real one. */
export const LAST_UPDATED_HELD = "[ date ]";

export const legalDocs: readonly LegalDoc[] = [
  {
    slug: "privacy",
    title: "Privacy Policy",
    metaTitle: "Privacy Policy",
    note: "Required before any form collects personal data — newsletter, donations, merch orders and enquiry forms all trigger this. Must reflect Australian Privacy Act obligations, and must cover the GA4 tracking cookies.",
    glyph: "a",
    ring: { piece: "b", side: "right" },
    clauses: [
      {
        number: "01",
        title: "What we collect",
        body: "We collect what you give us directly: your name, email address and phone number when you contact us, register interest in an experience, subscribe to updates, or make a purchase or donation. We also collect what your browser sends automatically — your IP address, device type, and the pages you open.",
      },
      {
        number: "02",
        title: "Why we collect it",
        body: "We use your information to answer your enquiry, process bookings, purchases and donations, send the updates you asked for, and understand how the site is used so we can improve it. We do not sell your information, and we do not use it for anything you would not reasonably expect.",
      },
      {
        number: "03",
        title: "How we store and protect it",
        body: "Your information is held on secured servers and reached only by the people who need it to do their work. We keep it for as long as the purpose requires and for any period the law sets, then delete it.",
        held: "[ retention periods to confirm ]",
      },
      {
        number: "04",
        title: "Who we share it with",
        body: "We share information with the providers who run parts of this site for us — payment processing, email delivery and analytics — and only as far as they need it. We may also disclose it where the law requires.",
        held: "[ providers to confirm ]",
      },
      {
        number: "05",
        title: "Cookies and analytics",
        body: "This site uses cookies to keep working and to measure how it is read. Analytics cookies tell us, in aggregate, which pages people open and how they arrived. You can switch the non-essential ones off — see Cookie Settings.",
      },
      {
        number: "06",
        title: "Accessing your information, and complaints",
        /* The OAIC is the statutory complaints body under the Privacy Act; it
           is a fact about Australian law, not a claim about YACHATDAC. */
        body: "You can ask what we hold about you, ask us to correct it, or ask us to delete it. If you are not satisfied with how we handle that request, you can complain to the Office of the Australian Information Commissioner. Write to",
        held: "[ contact address ]",
      },
    ],
  },
  {
    slug: "terms",
    title: "Terms of Service",
    metaTitle: "Terms of Service",
    note: "Needed alongside the Privacy Policy once payments, donations and email collection go live. Labelled “Terms of Use” in the repo until D4; the route is unchanged so no inbound link breaks.",
    glyph: "b",
    ring: { piece: "a", side: "left" },
    clauses: [
      {
        number: "01",
        title: "Using this site",
        body: "This site carries information about YACHATDAC and the work on Country. By using it you accept these terms. Do not use it in a way that damages the site, interferes with anyone else’s use of it, or breaks the law.",
      },
      {
        number: "02",
        title: "Intellectual property",
        body: "The text, photographs, artwork and design here belong to YACHATDAC or to the people who made them, and appear with permission. You may read and share pages. You may not reproduce, adapt or sell any part of the site without written permission.",
      },
      {
        number: "03",
        title: "Indigenous Cultural and Intellectual Property",
        /* ⚠ THE ONE CLAUSE A TEMPLATE CANNOT SUPPLY, and the frame marks it as
           such on the canvas. The sentence below states the position; the real
           clause is drafted with the Traditional Owners, not adapted from a
           precedent, and nothing here should be read as sufficient. */
        body: "The stories, knowledge, language and images of Country on this site are Indigenous Cultural and Intellectual Property. They stay with the Traditional Owners and are not released into the public domain by appearing here.",
        held: "[ this clause is not a template — it must be drafted with the Traditional Owners ]",
      },
      {
        number: "04",
        title: "Purchases, payments and donations",
        body: "Prices are shown in Australian dollars. Payments are handled by a third-party processor and we do not store your card details. Refunds, cancellations and the treatment of donations are set out at the point of purchase.",
        held: "[ refund and cancellation terms to confirm ]",
      },
      {
        number: "05",
        title: "Third-party links and liability",
        body: "This site links to other organisations. We do not control those sites and are not responsible for their content or their handling of your data. We take care that what is here is accurate, but we do not warrant that the site will be uninterrupted or error-free.",
      },
      {
        number: "06",
        title: "Changes to these terms",
        body: "We may update these terms. The version on this page is always the current one, and the date it last changed is shown below. Continuing to use the site after a change means you accept it.",
      },
    ],
  },
  {
    slug: "cookies",
    title: "Cookie Settings",
    metaTitle: "Cookie Settings",
    /* ⚠ The frame opens this note with a warning rather than a description,
       because the route is new and its name may be wrong. "Settings" implies a
       consent preferences dialog; this is a policy page. Both may be wanted,
       and that is a decision nobody has taken. */
    note: "⚠ New route — the footer has linked /legal/cookies on every page with nothing behind it. “Settings” implies a consent preferences dialog rather than a policy page. Those are different things and both may be wanted.",
    glyph: "c",
    ring: { piece: "b", side: "right" },
    clauses: [
      {
        number: "01",
        title: "What a cookie is",
        body: "A cookie is a small file a site stores in your browser. It lets the site remember things between pages and between visits — that you have dismissed a notice, for instance, or what is in your cart.",
      },
      {
        number: "02",
        title: "Essential cookies",
        body: "These keep the site working: they hold your session, remember the cookie choices you have made, and protect forms against misuse. They cannot be switched off, because the site does not function without them.",
      },
      {
        number: "03",
        title: "Analytics cookies",
        body: "These tell us, in aggregate, which pages are read, how long people stay, and how they arrived. We use them to decide what to write next. They stay off until you accept them.",
        held: "[ analytics provider to confirm — GA4 is not yet configured ]",
      },
      {
        number: "04",
        title: "Third-party cookies",
        body: "Embedded video, maps and payment forms may set cookies of their own under their own policies. Each one is listed here with a link to its policy.",
        held: "[ third-party services to confirm ]",
      },
      {
        number: "05",
        title: "Managing your preferences",
        body: "You can change your choices from this page at any time, and you can clear or block cookies in your browser settings. Blocking the essential ones will stop parts of the site working.",
      },
      {
        number: "06",
        title: "Changes to this notice",
        body: "When we add or remove a cookie we update this page. The date it last changed is shown below.",
      },
    ],
  },
];

export const legalDocBySlug = (slug: LegalDoc["slug"]): LegalDoc => {
  const doc = legalDocs.find((d) => d.slug === slug);
  if (!doc) throw new Error(`No legal document for slug: ${slug}`);
  return doc;
};
