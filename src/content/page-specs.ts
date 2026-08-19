/**
 * Planned section outlines for the pillar pages.
 *
 * These pages are NOT built yet — the current milestone is Lo-Fi Wireframes.
 * The outlines are transcribed from build documentation §4 so the routes are
 * walkable and so whoever picks up a page can see its spec without leaving the
 * app. Replace each stub with the real page as it is designed and built.
 *
 * Unlike the homepage, these pages combine authored editorial content with CMS
 * collections (§8).
 */

import type { PillarId } from "./site";

export type SectionSpec = {
  title: string;
  intent: string;
  /** Call to action, if the section has one. Many deliberately do not. */
  cta?: string;
};

export const pageSpecs: Record<PillarId | "resources", SectionSpec[]> = {
  wonder: [
    {
      title: "Intro / hero",
      intent:
        "Short banner reinforcing 'Guesting on Country'. Inspirational, not transactional.",
    },
    {
      title: "The Experience",
      intent:
        "One offer, not a listing grid — the 2 Night, 3 Day Guesting on Country experience. Guests camp; that is Stage 1 of the org's own accommodation roadmap, not a permanent limitation. Draft itinerary needs Suzanne/Steve validation before publishing.",
      cta: "Register interest / enquire",
    },
    {
      title: "Featured stories",
      intent:
        "Hand-picked editorial posts tagged Wonder. Editor-curated, not a live feed.",
      cta: "Read more → Resources",
    },
    {
      title: "Downloads",
      intent: "Brochure and magazine PDFs.",
      cta: "Download",
    },
  ],
  truth: [
    {
      title: "Intro / hero",
      intent:
        "Institutional but on-brand. Needs a clear subtitle — 'Truth' alone does not self-explain to this audience.",
    },
    {
      title: "What's been researched",
      intent:
        "Featured editorial posts tagged Truth, type Research/Publication. Eco-sounds, Marra Wonga, Rainbow Credits, the Bush University partnership with QUT and Griffith.",
      cta: "Read more",
    },
    {
      title: "Open research opportunities",
      intent:
        "Structured listing — discipline, description, status (open/closed).",
      cta: "Enquire per listing",
    },
    {
      title: "Partnership opportunities",
      intent:
        "Structured listing for the ESG/brand-buyer audience. Distinct from research opportunities.",
      cta: "Enquire per listing",
    },
    {
      title: "The Cultural Knowledge Precinct",
      intent:
        "Vision and roadmap — master plan Year 1, open to visitors Year 5, full precinct Year 8. Framed as direction, not an in-progress feature with a countdown. Moved here from Living Work.",
    },
    {
      title: "Partner with us",
      intent:
        "Primary enquiry form for this page, routed to the enquiry/CRM path rather than the newsletter list. Consider framing through the org's own Ngapartji-Ngapartji reciprocity principle.",
      cta: "Submit enquiry",
    },
  ],
  "living-work": [
    {
      title: "Intro / hero",
      intent: "Peer-to-peer tone. Generous with method, not a pitch.",
    },
    {
      title: "The Iningai Rangers",
      intent: "Team intro, linking to public Ranger projects and open roles.",
      cta: "View projects / View open roles",
    },
    {
      title: "Caring for Country in practice",
      intent:
        "Practice areas — fire-stick farming, ecology, biodiversity offsets, carbon farming, restoration.",
      cta: "Read more",
    },
    {
      title: "How we built this",
      intent:
        "Honest narrative of the model. Only what is real and working today — no unfinished-feature timeline.",
    },
    {
      title: "Newsletter signup",
      intent: "'Stay connected', not transactional.",
      cta: "Subscribe",
    },
  ],
  connect: [
    {
      title: "Connect index",
      intent:
        "Navigation to sub-pages plus a general contact form — distinct from Truth's partner enquiry and Wonder's register-interest form.",
    },
    { title: "About YACHATDAC", intent: "Org overview, full legal name, mission." },
    {
      title: "The YACHATDAC Team",
      intent: "Team bios — family and contractors; links to Ranger content.",
    },
    { title: "About Suzanne Thompson", intent: "Founder / vision-holder profile." },
    {
      title: "About Turraburra",
      intent:
        "The property itself — 8,870 hectares, formerly Gracevale Station, acquired 2019 with ILSC support. Distinct from YACHATDAC the organisation.",
    },
  ],
  resources: [
    {
      title: "Filterable grid",
      intent:
        "Every editorial entry lives here — filterable by pillar tag and content type, combinable. Visual grid, not a plain list. This is the site's real content hub, and it replaces the idea of a separate Events page.",
    },
    {
      title: "Sort & search",
      intent:
        "Newest first by default, plus oldest and featured. Ties into site search over the same index.",
    },
  ],
};
