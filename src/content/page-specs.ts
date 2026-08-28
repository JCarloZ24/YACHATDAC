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
 *
 * `wonder` and `truth` are synced to the v2 drafts (docs/content/drafts/),
 * per decision D5 — the documents govern copy, this file governs nothing more
 * than a walkable stub of it. Truth runs present → past, not a section stack;
 * "the seam" carries Suzanne Thompson's words and stays held-by-community
 * until she approves it (R5). Wonder's stay is stages, not a fixed itinerary —
 * the old "2 Night, 3 Day" outline is gone. See docs/content/STATUS.md note 11.
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
      title: "What a stay looks like",
      intent:
        "One offer, not a listing grid — a stay run as stages, not numbered days: Arriving, The first night, Walking out to the wall, Older than the wall, Out for food, Hands in the work. Guests camp; that is Stage 1 of the org's own accommodation roadmap, not a permanent limitation. No fixed dates, no pricing — 'no set itinerary, because the work does not' (v2). Inclusions (meals/guiding/camping/transfers) and cost are both still unconfirmed by the client — see R13.",
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
        "'Most people have never heard of the Iningai. This is what happened here, told by the people it happened to.' Two entry points: scroll to the oldest section at the foot, or jump to research & partnerships mid-page.",
    },
    {
      title: "Ahead — what is being built, within five years",
      intent:
        "The Cultural Knowledge Precinct. Framed as direction, not an in-progress feature with a countdown — master planning is underway because there is something here worth building it for.",
      cta: "Talk to us about being part of it → /connect",
    },
    {
      title: "Inline card — Work with us / Partnerships",
      intent:
        "'A researcher on Country is a guest on Country.' Partnerships are expected to give something back to the land and the people. D2 note: v2 links this to /connect even though Connect is absent from the v2 homepage footer nav — evidence for the lo-fi review, not a decision.",
      cta: "→ /connect",
    },
    {
      title: "Today — the work going on now",
      intent:
        "Right-way fire, springs, and two flux towers. The Iningai Rangers' land management work, measured against grazed land — possible because Turraburra stopped being someone else's station seven years ago.",
      cta: "What the towers are showing → Resources",
    },
    {
      title: "2022 — the site is studied with its owners",
      intent:
        "The Marra Wonga study, with Iningai community members as research partners rather than subjects.",
      cta: "Read the findings → Resources",
    },
    {
      title: "Inline card — Still to be found / Open research",
      intent:
        "Most of this Country has never been studied. Researchers wanted in palaeontology and archaeology, ecology and biodiversity, and medicinal botany.",
      cta: "→ /partnerships/#research-opportunities",
    },
    {
      title: "2026 back to 2003 — bought back",
      intent:
        "Reverse-chronology beats: the deed of grant (26 June 2026) · Gracevale renamed Turraburra (1 Oct 2020) · the ILSC purchase and first night on the property (30 Apr 2019) · Suzanne's father, who protected the sites before her.",
      cta: "Suzanne's account of how it happened → Resources",
    },
    {
      title: "1950s — admired under the wrong name",
      intent:
        "The escarpment was written up and photographed for decades as 'The Art Gallery' — a visitor's name, not an Iningai one.",
      cta: "Who named it, and what it was called before → Resources",
    },
    {
      title: "The seam",
      intent:
        "Full-bleed dark break. The timeline stops — no rail, no markers, no way past it. Suzanne Thompson's words on 1902 and the massacre history, held by community: not published until she has seen and approved it. Two open questions for her — the reordering, and whether the figure is thirty-five or thirty-seven. See R5.",
    },
    {
      title: "1840s — before the runs were taken up",
      intent:
        "What Thomas Mitchell recorded passing through — the first written account, by someone who had just arrived.",
      cta: "Read the passage, and what it proves → Resources",
    },
    {
      title: "Older than the record — cut into the wall",
      intent:
        "The engraving: 15,000+ petroglyphs and 111 stencils along 160 metres, Marra Wonga. Never scientifically dated — likely 5,000+ years on regional style sequences. Full citation, Australian Archaeology 2022.",
      cta: "What the study found, and how → Resources",
    },
    {
      title: "Before people — about 100 million years ago",
      intent:
        "Closing section, full width, escarpment photograph behind. The Eromanga Sea, the sandstone, the tracks set in the mud.",
      cta: "How the seabed became the escarpment → Resources",
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
