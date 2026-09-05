# YACHATDAC website

*Last updated: 19 August 2026*

Website for **YACHATDAC** — Yambangku Aboriginal Cultural Heritage & Tourism
Development Aboriginal Corporation, on Iningai Country, Barcaldine QLD.

> **YACHATDAC is the organisation. Turraburra is the property.** They are not
> interchangeable and are never used as if they were. "YACHATDAC cares for
> Turraburra."

The core narrative, in Suzanne Thompson's words: *"reconnection — across time,
from the deep past to now to the future, and across people."* Everything on the
site should trace back to that line.

## Status

**Current milestone: Lo-Fi Wireframes** (target 21 Aug 2026). Launch 14 Sep 2026.

This repo is the front-end foundation: design tokens, motion primitives, the
homepage narrative structure, and walkable routes for the rest of the IA. The
pillar pages render their own specification rather than real content — they are
marked "Not built yet" on screen so a stub is never mistaken for a finished
page.

## Stack

| | |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 — tokens in `src/app/globals.css` |
| Motion | GSAP + ScrollTrigger site-wide (F7); bounded IntersectionObserver + CSS kit for CMS surfaces |

## Getting started

```bash
npm install
npm run dev      # http://localhost:3001
```

Port 3001, not 3000 — 3000 is taken by Proyekto locally.

```bash
npm run build      # production build
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
```

## Motion, since decision F8 (31 Aug 2026)

The `yachatdac-motion` skill and its permissions board were removed under
**F8** (`docs/decisions-and-risks.md`): the team builds freely and the work is
reviewed by Steve (FNAN) and the Elder Advisory Group at presentation, with
corrections coming back as change requests. Motion character, artwork motion
and cultural-imagery treatment are design choices, not gated rules.
`docs/motion/` still documents the motion system itself.

Two lines survive F8 because a later review cannot walk them back:

- No heritage coordinates in map layers, markup, comments or source files.
- No generated Aboriginal iconography in code — the artist's *supplied*
  vectors may be used and animated freely; new iconography is not drawn
  procedurally.

## Layout

```
src/
  app/                      routes; globals.css, fonts.css, motion-tokens.css
  components/
    layout/                 header, footer, page stubs
    sections/               homepage beats
    ui/                     Reveal, ThreadLine, PathCard, SignupField, Eyebrow
  content/
    homepage.ts             homepage copy — seed for the CMS (D12)
    site.ts                 org identity + information architecture
    page-specs.ts           section outlines for pages not yet built
  lib/
    motion.ts               Tier 2 primitives (entry stagger, reduced motion)
    motion-controller.ts    Tier 1 GSAP registry — port of the skill's template
docs/
  brand.md                  how the brand kit is wired into code
  content/                  page copy and sitemaps — drafts → in-review → approved
  decisions-and-risks.md    paste-ready entries for Proyekto Decisions / Risks
  design/                   Figma links, milestone, wireframe requirements
  open-questions.md         blockers and open decisions
  meetings/                 briefing notes
public/
  fonts/                    self-hosted woff2 — see licence note below
  brand/                    ⏳ awaiting logo vectors and commissioned artwork
```

### The homepage

Homepage **copy is CMS-editable** (decision D12). What stays in code is the
design, motion and section structure — the words are content.

`src/content/homepage.ts` currently holds that copy as the seed the CMS will be
populated from, so the page renders today. Don't write anything that assumes
those strings are compile-time constants.

The homepage is one continuous scroll through seven beats — Welcome to Country,
Wonder, Truth, Belonging, Living Work, The Invitation, The Way Forward. Beats
1–5 offer **no navigation at all**. That restraint is the design, not an
oversight.

## Waiting on

| | Blocks |
| --- | --- |
| Block Berthold + Bantayog Sans **licences** | Production build. Fonts are installed and working; terms are unconfirmed. See `public/fonts/README.md` |
| Logo vector files | Header and footer currently render a text placeholder |
| Welcome to Country wording from Suzanne Thompson | Footer — marked placeholder, cannot ship as-is |
| Story-wall imagery permission | Homepage Truth beat is typographic until resolved |
| DGR / charity status verification | Any donation copy or receipt logic |
| Figma lo-fi and hi-fi links | `docs/design/README.md` |

Full list with owners: [`docs/open-questions.md`](docs/open-questions.md).

## Source documents

Not in this repo — they live in the Proyekto project **PRD - Yachatdac Website**
and the client Google Drive:

- Artwork Creative Brief (brand kit — colour, typography, logo, sitemap)
- YACHATDAC website build documentation
- Website briefing notes, 18 Aug 2026

Cross-reference the creative brief before finalising any visual or IA decision.
