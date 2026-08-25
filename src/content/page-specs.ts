/**
 * Planned section outlines for the pillar pages.
 *
 * Wonder, Truth and Living Work are now BUILT from their copy drafts — their
 * entries below are kept as the record of what each page is meant to contain,
 * and must be updated alongside the page rather than left to drift. Connect
 * and Resources are still stubs and still render from here via PageStub.
 *
 * The outlines were transcribed from build documentation §4 so the routes are
 * walkable and so whoever picks up a page can see its spec without leaving the
 * app.
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
  /**
   * ⚠ RESTRUCTURED. The draft is a descent — ahead → today → before people —
   * with lore framed as the floor underneath rather than the oldest entry.
   * STATUS.md note 5 recorded that as a stronger structure than the
   * conventional stack this list used to describe, and the page is built to
   * the draft. This outline now matches it.
   *
   * Governance circle: held by community. Elder Advisory Group endorsement
   * required before build or publish.
   */
  truth: [
    {
      title: "Intro",
      intent:
        "“Most people have never heard of the Iningai.” Jumps the reader to the OLDEST entry, at the bottom — the page descends.",
      cta: "Start from the beginning",
    },
    {
      title: "Ahead — The Cultural Knowledge Precinct",
      intent:
        "Exhibitions, teaching, research accommodation and a place for community to gather. Master planning underway. Moved here from Living Work.",
      cta: "Talk to us about being part of it",
    },
    {
      title: "Today — right-way fire, springs, two flux towers",
      intent: "The work going on now. Evidence type: living memory.",
      cta: "What the towers are showing",
    },
    {
      title: "2022 — the site is studied with its owners",
      intent:
        "Marra Wonga documented from archaeological and Iningai perspectives, community members as research partners rather than subjects. ⚠ Image slot is HELD — story-wall imagery permission unresolved.",
      cta: "Read the findings",
    },
    {
      title: "Full-bleed break — Country now",
      intent: "First light over the range, or a spring running. No caption.",
    },
    {
      title: "2019 — Gracevale becomes Turraburra",
      intent:
        "8,870 hectares bought for the custodians of the Iningai people, with the Indigenous Land and Sea Corporation.",
      cta: "How the buyback happened",
    },
    {
      title: "1950s — they called it The Art Gallery",
      intent:
        "The escarpment admired for decades under a name given to it by visitors.",
      cta: "Who named it, and what it was called before",
    },
    {
      title: "Full-bleed break — the escarpment",
      intent:
        "⚠ B4 is on hold on exactly this ground: subject matter must not be cultural-site material. Re-choose the subject or drop the break, pending a recorded permission.",
    },
    {
      title: "⛔ Hard stop — 1902 / 1886",
      intent:
        "Suzanne Thompson's testimony. WITHHELD pending her written approval — structure, scroll behaviour and weight only, never her words. The descent stops: rail absent, viewport held. Tier 1 on a Tier 2 page, exception pending D9.",
    },
    {
      title: "1840s — what Mitchell recorded",
      intent: "The first written account, written by someone who had just arrived.",
      cta: "Read the passage, and what it proves",
    },
    {
      title: "Older than the record — the engraving starts",
      intent:
        "Over 15,000 petroglyphs and 111 stencils along 160 metres of shelter wall. ⚠ Dating renders as a content field, never a literal — risk R2.",
      cta: "What the study found, and how",
    },
    {
      title: "Before people — the Eromanga Sea",
      intent:
        "Inland Queensland under water; the sediment becomes the sandstone the shelter is cut from.",
      cta: "How the seabed became the escarpment",
    },
    {
      title: "Underneath all of it — Wattanuri",
      intent:
        "Lore is not a date. The floor everything above rests on, which is why the rail runs beside the reader from the first screen.",
      cta: "As much as is told away from Country",
    },
    {
      title: "The browsable record",
      intent:
        "Every article, account, recording and paper — filterable grid, structured metadata per item. ⚠ No source copy exists below the timeline.",
    },
    {
      title: "What's been researched",
      intent:
        "Featured editorial posts tagged Truth, type Research/Publication. Eco-sounds, Marra Wonga, Rainbow Credits, the Bush University partnership with QUT and Griffith. Editor-curated.",
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
        "Structured listing for the ESG/brand-buyer audience. Distinct from research opportunities. ⚠ The uploaded sitemap drops this section; build documentation §4 keeps it — STATUS.md note 6. Retaining it is a decision.",
      cta: "Enquire per listing",
    },
    {
      title: "Partner with us",
      intent:
        "Primary enquiry form for this page, routed to the enquiry/CRM path rather than the newsletter list. Consider framing through the org's own Ngapartji-Ngapartji reciprocity principle. ⚠ Needs id=\"partner\" — /truth#partner is linked from Living Work.",
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
