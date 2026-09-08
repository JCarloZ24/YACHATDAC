@AGENTS.md

# YACHATDAC website — working notes for Claude

Next.js 16 (App Router, Turbopack) + React 19 + TypeScript + Tailwind v4 + GSAP/ScrollTrigger.
Website for **YACHATDAC** (Yambangku Aboriginal Cultural Heritage & Tourism Development
Aboriginal Corporation), Iningai Country, Barcaldine QLD. Launch 14 Sep 2026. Deploys from
`main` on Vercel.

This file is the entry point. It points at the documents that hold the reasoning; it does
not repeat them. When a rule here and a doc disagree, the doc is newer — fix this file.

## Commands

```bash
npm run dev          # http://localhost:3001  (3000 is Proyekto — never change the port)
npm run build        # production build; run before pushing anything structural
npm run lint         # eslint (core-web-vitals + typescript)
npm run typecheck    # tsc --noEmit
npm run check:type   # scripts/check-type.mjs — typography lint, see below
```

Before committing: `npm run typecheck && npm run lint && npm run check:type`. There is no
test suite; the build is the check.

## Read first, by task

| Doing | Read |
| --- | --- |
| Any Next.js API or file convention | `node_modules/next/dist/docs/` — this Next differs from training data |
| Building or reviewing a hi-fi section | `.claude/skills/yachatdac-typography/SKILL.md` **before** writing markup |
| Anything that moves | `docs/motion/motion-grammar.md` (the table every effect must cite), `docs/motion/scenes.md`, `docs/MOTION-SYSTEM.md`, `docs/ART-DIRECTION.md` |
| Copy, wording, names | `docs/terminology.md`, then the page draft in `docs/content/drafts/` |
| Photos, artwork, fonts | `ASSETS.md`, `brand/README.md`, `brand/PHOTO-INDEX.md`, `public/brand/README.md`, `public/fonts/README.md` |
| Figma frames, rows, node ids | `docs/design/README.md`, `docs/design/lofi-spec.md`, `docs/design/hifi-figma-readout.md` |
| "Why is it like this?" | `docs/decisions-and-risks.md` (D/R/F numbers), `docs/change-requests.md` (CRn), `docs/open-questions.md` |
| Content state | `docs/content/STATUS.md` — one row per draft, updated in the same commit a file moves |

## Layout

```
src/app/<route>/page.tsx + _components/Sections.tsx   one route, one markup file
src/content/<route>.ts                                 the words (D5: drafts govern copy)
src/content/<route>-media.ts                           photo slots + motion grade per slot
src/content/kit.ts                                     artwork/furniture manifest with Figma node ids
src/content/site.ts                                    org identity + IA; nav is built from this
src/components/{layout,sections,ui,motion,transitions} shared pieces
src/components/{lofi,v2,lab}                           superseded / experimental — do not extend
src/lib/motion-controller.ts                           the single GSAP registry; modules register here
src/lib/motion/effects/                                named effects (gsap.registerEffect)
src/app/globals.css · fonts.css · motion-tokens.css    every token, declared once
brand/                                                 source-of-truth assets (photos gitignored)
docs/                                                  the record
```

`/lab/*` and `/v2/*` are sandboxes. `src/content/lofi/` and `src/components/lofi/` are the
retired lo-fi build kept as a record — leave their wording alone (see terminology sheet).

## Hard rules — survive every review, cannot be walked back

1. **No heritage-site coordinates** anywhere: data, markup, comments, commits. Git history
   keeps what a correction cannot remove.
2. **No generated Aboriginal iconography.** Leonard Mickelo's *supplied* vectors
   (`public/artwork/`, manifest in `kit.ts`) may be animated, masked, recoloured, recombined.
   Drawing new dots, rings, tracks, U-shapes or meandering paths in code or SVG is prohibited,
   even as a "simple" stand-in. Leave the slot empty instead.
3. **Never edit anyone's recorded words** to match house style. Suzanne Thompson's quotations
   on Truth and Graham Ambridge's on Our People stay as spoken; questions go to the speaker.
4. **Do not recreate the logo** in code or text. Render `public/brand/logo-wordmark.svg`.
5. **Do not AI-upscale or re-author the three paintings.** 1.57MP is the permanent ceiling.

## Governance — F8, build-first (31 Aug 2026)

Pre-approval gates are lifted. Build freely; the work is reviewed by Steve (FNAN) and the
Elder Advisory Group at presentation and corrections arrive as change requests. The
`open` / `shared with care` / `held by community` tags in `docs/content/STATUS.md` say where a
reviewer will look hardest; they no longer block a build. Requests from Steve or August are
applied in `src/content/` **and** the matching draft **and** `docs/terminology.md` in the
same pass.

**Proyekto MCP is read/draft only** for this token: it cannot decide change requests or read
`internal` risks. Status flips happen in the web UI; record them in the docs file instead
of retrying.

## Content

- **Drafts govern copy, frames govern layout (D5).** Copy in `src/content/*.ts` is verbatim
  from `docs/content/drafts/<page>/YACHATDAC-<Page>-Copy-v<n>.md`. Where a frame carries
  copy a draft does not, add it to the content module with a hi-fi flag; do not type it in
  markup.
- **Copy is CMS-editable at launch (D12).** Never write code that assumes a content string
  is a compile-time constant.
- **YACHATDAC is the organisation; Turraburra is the property.** Turraburra is not
  Terraburra (the 1884 clan name) — both spellings are correct in their own sentence.
- House style: *Country* capitalised, *cultural heritage sites*, *fire-stick farming*
  (not "cool burn" / "right-way fire" except the held D17 article slug), *Iningai* (not
  Innigai), *Biological Sequestration*. Full table in `docs/terminology.md`.
- Placeholders are explicit: `[ … ]` markers in drafts, `[ Image — … ]` for photo slots,
  "Not built yet" on stubs. Never fill an `awaiting-suzanne` slot from a draft.
- Australian English; `lang="en-AU"`.

## Typography (enforced by `npm run check:type`)

Three families, reached only through utilities: `.headline` (Block Berthold, H1–H3),
`.eyebrow` (Bantayog Sans ExtraBold, uppercased by the utility — write sentence case),
default `<body>` (Work Sans), `.callout` (Good Dog, callouts only). **Never** write
`font-family` inline, never interpolate a font utility, never add Archivo or Baloo 2 — Figma
draws in those and the build repoints them. A build is expected to match the frame on size,
colour, weight and position and *not* on letterforms. Headings use the responsive `text-h1`…
`text-h6` tokens (V2 Figma variables, one `lg:` breakpoint); take leading and tracking from
the frame explicitly. Split text by line or word, never by character.

## Design tokens and Figma

- Colours live once, in the `@theme` block of `globals.css`, named for Country (`ochre`,
  `oxide`, `evergreen`…). Do not flatten to primary/secondary. Solid colours, no gradient
  washes; the media scrim is the one exception.
- The V2 file has two grids only, Desktop/1440 and Mobile/375. Classes are the 375 value by
  default and the 1440 value under `lg:`. Do not invent a tablet step.
- **Viewport margins:** 20 px / 1.25 rem on mobile (`px-5`), 64 px / 4 rem on desktop
  (`lg:px-16`). Every section's outer padding uses these two values and nothing else;
  full-bleed media is the only thing that touches the viewport edge.
- Figma → code: load the `figma:figma-design-to-code` skill before `get_design_context`.
  Row coordinates in `docs/design/README.md` are a snapshot — re-read them from the row
  labels before quoting. Never set the brand fonts through the Figma plugin API.
- Photo slots render a tonal field when the file is absent (`MediaOrField`). Tailwind cannot
  see computed classes, so tone maps are literal `Record`s.
- Serve images as WebP/AVIF through `next/image` with explicit dimensions; ScrollTrigger
  measures against layout. Batch-2 frames (2000px) do not have headroom for Ken Burns or
  full-bleed at 1440.

## Motion

- Motion is the default site-wide (F7). Each screen turns up **one** loud channel — media,
  type, or transition — and keeps the other two quiet. One verb per page (Truth *descends*,
  Living Work *accumulates*, Home *opens*, The Record *surfaces*, About *answers*, Our
  People *gathers*); do not carry one page's grammar onto another.
- **Every animation cites a row of `docs/motion/motion-grammar.md`.** Add the row first, then
  the effect in `src/lib/motion/effects/<family>.ts`, then the `EffectName`. Uncited motion
  is decoration — delete it.
- All timelines go through `src/lib/motion-controller.ts`; modules expose `init`/`destroy`.
  Nothing calls `ScrollTrigger.killAll()`. Per-frame work is transform, opacity, clip-path
  and CSS custom properties only. Load the `gsap-react` / `gsap-scrolltrigger` skills for
  hook and cleanup patterns.
- Respect the **motion grade** on every media slot: `full` may scrub/mask/warp the image
  plane; `frame` moves the world around a held image. Portraits, cultural-site and
  story-wall material are `frame`.
- Reduced motion is honoured in the controller; scroll spans are specified in `vh`, not px.
  No global smooth-scroll on `html` (see the comment in `globals.css` for why).
- Testimony (a person speaking) is read in stillness: `dim` effect, no movement, never the
  callout face.

## Assets and licensing

- Fonts: Block Berthold via Adobe Fonts kit `qqn2php` (local woff2 is fallback only and
  gitignored); Bantayog Sans and Good Dog committed because Vercel builds from git and this
  repo is private. **If the repo ever goes public, purge them from history first.**
- `brand/photography/`, `brand/video/` and `.drive-export-raw/` stay out of git. The notes
  files are tracked precisely because the binaries are not — keep an **Origin** line on every
  photo entry. Never overwrite a master; edits go in `derivatives/`.
- Filename slugs describe what is visibly in frame, never what it means (no `sacred`,
  `ceremony`).
- No base64 media in drafts. Anything real gets extracted to `public/` with credit and
  permission recorded in its manifest (`*-media.ts`, `kit.ts`).
- Above-the-fold budget is 2.5 MB (R11). Preload only the two faces already in `layout.tsx`.

## Working conventions

- **Commit messages:** `type(scope): what it does, lowercase, no trailing period` —
  `feat(wonder): responsive pass to the 375 hi-fi frame`, `docs: …`, `chore(kit): …`. No
  attribution trailers (`includeCoAuthoredBy` is off). Commit only when asked.
- **Comment the why.** This codebase records decisions in doc comments at the top of every
  content module and component — who decided, when, and the D/R/F/CR number. Match that:
  when you deviate from a token or a rule, leave a comment saying what and why.
- Docs carry a `*Last updated: <date>*` line; bump it when you edit one. Convert relative
  dates to absolute.
- When a draft, the Figma file and the code disagree: draft wins on words, Figma wins on
  layout, `site.ts` follows the sitemap diagram, and `docs/terminology.md` follows the built
  site. Raise a drift rather than silently reconciling it.
- Do not extend `lofi/`, `v2/` or `lab/`. Do not add routes off the back of a draft — IA
  changes are a D-number.
- `AGENTS.md` is regenerated by `next dev`; the block it imports is Next's, not ours. Keep
  this file's first line as `@AGENTS.md` so the generator leaves this file alone.

## People

Suzanne Thompson (Traditional Owner; cultural authority — hers is the approval that counts) ·
Steve (FNAN, client-side reviewer) · Leonard Mickelo (artist; distinct from Leo) · August
(copy owner, D10) · Marc and Ivy (design, Figma) · JC (build, this repo) · David (CMS /
content model). Suzanne, Steve and Leonard have no Proyekto account.
