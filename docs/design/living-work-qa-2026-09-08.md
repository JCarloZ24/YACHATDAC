# Living Work — QA pass, 8 Sep 2026

The build at `/living-work` read against `03 · Living Work — HI-FI · Desktop ·
the field notebook` (Figma `2137:2613`) and its twelve `NOTE ·` frames, ahead of
the review with August and Marc.

The notes lane is the spec. Every MOTION paragraph in it is a testable
assertion, and §2 below is that test.

**Round 1, 8 Sep:** `04a9b15` (accessibility), `834eb4d` (spacing, type, §08),
`34abcaa` (this document and two stale records), `aa6c054` (the image pipeline),
`313321e` (§03's rules).

**Round 2, 8 Sep — Ivy's review of the built page:** `c679550` (the gutter, the
hero scrim, §02's numbers, §04's rule, §09's gap), `daf54a7` (§08 whole names,
§07's sticky header), `47cd707` (§05 auto-runs, the ranger belt). See §6.

**Still not applied:** everything in §2 marked ⚠ that round 2 did not reach,
and the second half of §3.

---

## 1 · What the page got right

Worth stating, because the list below is all exceptions.

- **All ten sections in frame order**, with the load-bearing anchors intact
  (`#rangers`, `#streams`, `#infrastructure`, which `src/content/site.ts` and
  `/connect` both point at).
- **Every content set complete** — 13 challenges in 4 clusters, 7 streams,
  6 infrastructure blocks, 5 vessels, 3 paths.
- **Every placeholder still marked**: `[ name held ]`, §05's stand-in,
  R14's five unconfirmed status labels, R9's inert newsletter field.
- **Reduced motion cannot be forgotten.** `composition()` makes `cut` a required
  field of every recipe, so a screen cannot ship without its reduced-motion
  branch, and the server markup *is* the final state.
- **§09's cards follow the card rule** — coloured ground, artist glyph, gold
  eyebrow, 84px bottom-aligned title box, `mt-auto` CTA. The missing image band
  is the declared `Card / Story — no image` variant, not drift.
- **No CTA renders a route path.** `GET IN TOUCH`, `PARTNER WITH US`, `ENQUIRE`.
- **§08's numbers are exact**: 0.7s fill, fired at `top 65%`, 150ms cascade —
  precisely what the note specifies.

---

## 2 · Motion — the notes lane against the build

One row per assertion. ✅ built as specified · ⚠ diverges.

### §01 Hero — `fullBleedOpen`

| Note says | Build does | |
|---|---|---|
| X5 scrim, required where copy sits on media | `scrimRamp` on `[data-scrim]` | ✅ |
| M1 scrubbed push-in **1.00 → 1.06** on the photograph | `plateParallax` — a pure `yPercent` translation. No scale anywhere in the effect | ⚠ |
| B5 settles the headline line by line, **eyebrow first and lede last** | `settle` runs on `[data-heading]` only. The eyebrow and standfirst carry no motion hook at all | ⚠ |
| X2 scroll cue, killed permanently on first scroll | Not present. There is no scroll cue in the hero markup | ⚠ |

`pushIn` (M1) exists in the vocabulary and is registered; it is simply not the
effect this recipe reaches for. `plateParallax` is the *loud* variant of the
same grammar row, so the narrative role is right and the stated ratio is not.

### §02 The Aperture — `apertureSequence`

| Note says | Build does | |
|---|---|---|
| Y1 image-in-type, one per site, spent here | the aperture sequence | ✅ |
| M2 opens and closes the break-out | built | ✅ |
| C2 shared-element handoff, the site's only one, 0 → O | built; the §02 ghost and §03 title are measured against each other | ✅ |
| X6: digits at final value, static crop, no break-out, no FLIP | a dedicated `cut` branch, not `clearAll` | ✅ |
| **"Sticky, never pinned: no snap, no hijack, the page never stops advancing."** | `pin: true` | ⚠ **the significant one** |

Two other notes corroborate the spec: §05's says it is *"the page's only pin"*
and §07's says *"the page's one pin belongs to §05 The Spring."* The build has
two. This is the one divergence that changes how the page *feels* rather than
how it measures, so it should be settled before the review, not after.

### §03 Our challenges — `clusterDescent`

| Note says | Build does | |
|---|---|---|
| Ramp scrubbed against section progress | `groundRamp` | ✅ |
| Rows enter on X4 | `arrive` | ✅ |
| Band enters on M2, clip-path opening while the image counter-scales 1.30 → 1.00 | `frameOpen` | ✅ |
| Cluster labels are **sticky** while their rows scroll under them | no `sticky` anywhere in the section | ⚠ |
| …with a **live count**, counting up as its cluster passes | a static total, `group.items.length` | ⚠ |
| The ochre rule between damage and response **draws down on open (B1)** | a plain CSS `border-l`; nothing draws | ⚠ |

### §04 Iningai Rangers — `fullBleedOpen` + `RangerCarousel`

| Note says | Build does | |
|---|---|---|
| The motif behind it drifts at **0.15** ▲ | `data-plane="far"`, and `PARALLAX[0]` is exactly 0.15 | ✅ |
| The strip is **drag** … | Draggable + Inertia, and it loops | ✅ |
| … plus **scroll-velocity drift (M7)** | `velocityDrift` is registered in `effects/type.ts` and never called here | ⚠ |
| Portraits arrive **desaturated → full colour (M3)** | no `saturate`/`grayscale` anywhere | ⚠ |
| The artist's wave rule **draws in dot by dot (B1)** ▲ | a static `<img>` of `dots-wave.svg`, which cannot be drawn on | ⚠ |
| Each portrait counter-parallaxes inside its own frame | the belt scales cards on a cosine bell; no per-frame counter-parallax | ⚠ |

The two ▲ items are supplied artwork and still need Leonard Mickelo's sign-off,
so they are flagged rather than scheduled.

### §05 The Spring — `pinnedCount`

| Note says | Build does | |
|---|---|---|
| The counter scrubs 1 → 8 | `splitFlap`, snapped to `1/(steps-1)` | ✅ |
| The page's only pin; the one place scrolling controls time | `pin: true` + snap | ✅ (but see §02) |
| The photograph is identical across all eight | one image, held | ✅ |
| The coda uses **Y2 word emphasis**, its only use here | `dissolve`, not `dim`. Y2 is `dim` — *"words undim as they are spoken, no movement at all"* | ⚠ |

### §06 The work — `stickyStreams`

| Note says | Build does | |
|---|---|---|
| The four detail streams enter on **M2 frame-expand** | `frameOpen` | ✅ |
| **Anchors take M1 push-in** | `uses: ["stickyIndex", "frameOpen", "triad"]` — no `pushIn` | ⚠ |
| **Stream numbers settle with their row (B5)** | no `settle` in this recipe | ⚠ |

Note also that the build gives §06 a `stickyIndex`, which the notes attribute to
§07 alone. Not wrong in itself — but it means the sticky-index device now appears
twice on one page, which is worth a decision rather than leaving implicit.

### §07 Infrastructure — `whatItTakes`

| Note says | Build does | |
|---|---|---|
| Blocks **120ms apart** | `stagger: 0.12` | ✅ |
| The marker travels between pairs; the index reads 55 / 100 / 30% | built | ✅ |
| **Sticky only — no pin, no snap, no scroll hijack** | CSS `position: sticky`, `channel: "none"` | ✅ |
| Each row rises **20px** and fades over **500ms** | `arrive` is 16px at `DUR.medium` (550ms) | ⚠ minor |

### §07b Breath — `breath`

| Note says | Build does | |
|---|---|---|
| `channel: "none"`, and the build fails if anything loud is added | asserted by `composition()` | ✅ |
| A slow **1.00 → 1.04 push-in** across the band's full scroll | `hold` — nothing moves at all | ⚠ |

Arguable: the note's own next sentence is *"A rest, not an event"*, and `hold` is
the stricter reading. But the ratio is stated, so it is a choice to make rather
than a gap to leave.

### §08 What the work produces — `vessels`

| Note says | Build does | |
|---|---|---|
| Fill sweeps left to right over **700ms**, eased out | `duration: 0.7`, `EASE.country` | ✅ |
| …when the row passes **65%** of the viewport | `start: "top 65%"` | ✅ |
| …staggered **150ms** | `window.setTimeout(drain, 150)` | ✅ |
| **The blobs never animate** | they do not | ✅ |

The best-matched section on the page.

### §09 Get involved — `quietArrival`

| Note says | Build does | |
|---|---|---|
| Cards rise **24px**, fade, **80ms apart**, left to right | `triad`, `y: 24`, `each: 0.08` | ✅ |
| On hover the ground lifts 4% and the CTA arrow travels 6px | CSS transitions on the card | ✅ |

---

## 3 · Held — decisions that are not the builder's

**§02's rest state — RETRACTED 8 Sep.** This section previously claimed the
frame contradicted itself and that the figure order was wrong. **Both claims
were mistaken and the build was right all along.**

Rendering the frame settles it: `2137:2615` shows **120 at `04 / 04`**, which is
exactly the build's rest state. The layer is *named* `figure · 480`, which is
stale, and reading the layer name instead of the render is where the error came
from.

The note's `8,870→100 · 120→463 · 480→362 · 2019→624` is a table of
**x-positions** — each figure placed so its `0` lands on the aperture's x=833 —
not a running order. Nothing in the notes lane specifies a sequence, and the
build's `8,870 → 2019 → 480 → 120` ending on the figure whose `0` becomes the
portal is coherent and matches the drawn rest state.

No change was made to the figure order or the rest state.

**§03's ground ramp cannot carry warm text at its dark end.** Measured: the
deepened tone clears AA on the static ramp (6.31 / 5.13 / 4.68), but the ramp's
*animated* deep end is `#8a7455`, where no warm value passes — the darker you go
for the cream end, the worse it gets on the earth end. A ground that changes
luminance under the copy sitting on it is a design question for Marc.

**The column is 1152, the frame's is 1240.** Held deliberately: `max-w-7xl` is
what `SiteFooter` and every other hi-fi page uses, so matching the frame here
would align this page to the frame and misalign it from the site. Note that
`SiteHeader` (`max-w-[1440px] px-6 lg:px-16`, content from x=64) and `SiteFooter`
(`max-w-7xl`, content from x=144) already disagree with each other by 80px at
1440. That is a site-wide question this page merely exposes.

---

## 4 · The review pack — what August and Marc will ask

### "The fonts are wrong."

They are not. The Figma file draws in **Archivo** and **Baloo 2**; the site
ships **Bantayog Sans** and **Block Berthold**. This is a recorded decision, not
drift. A correctly built page agrees with the frame on **size, colour, weight
and position** and *disagrees on letterforms*.

Receipt: the repoint table in `.claude/skills/yachatdac-typography/SKILL.md`.

### "The hero is smaller than the frame."

Correct, and deliberate as of 8 Sep. The frame draws `Display/96`; the build
ships `text-h1`, which is 56 on desktop and 40 on the phone, from the
`YACHATDAC Type` variable collection that `globals.css` names as source of truth.

~~⚠ **Say this honestly: Wonder currently ships 96.**~~ **SETTLED 11 September
2026 (D26).** August's call is the rem column of Marc's sheet — the
`YACHATDAC Type` variable collection the tokens already carried. Wonder's
frame-literal ramp is retired and **every hero on the site is now `text-h1`:
56 at 1440, 40 on the phone, 120% leading**. Leading came from the sheet in the
same pass (H1–H3 120%, H4 130/140%, H5–H6 140%), replacing values tuned to a
Display/96 that no longer ships.

The answer to this question is now simply: yes, the hero is smaller than the
frame, on every page, deliberately, and they all match. What remains unmigrated
is section headings on /about, /partnerships, /connect and /our-people.

### "§09's cards have no photographs."

A declared `Card / Story — no image` variant — Marc's `Card / Truth` with the
image band removed, specified in that section's own note. Same radius, padding,
type ramp and ochre CTA.

### "The page is shorter than the frame."

Scroll span is not drawn height. The frame is 18,407px ≈ 2,045vh; the build's
scroll span is ~1,607vh because §02 and §05 pin. `docs/motion/scenes.md` records
the two should be reconciled before sign-off, and they have not been.

### Changes that alter what Marc drew — surfaced, not slipped through

1. **Warm eyebrows on light grounds are deepened**, `#d97804` → `#8a4a02`. At
   13px the eyebrow utility is not WCAG large text, so it needed 4.5:1 and had
   2.91:1. §04's eyebrow keeps the original tone — it sits on charcoal at
   6.13:1 and is correct as drawn.
2. **The focus ring is now two rings**, a charcoal outline inside a gold halo,
   replacing the single ochre outline at 2.30:1. No single colour can clear 3:1
   on both the cream and evergreen grounds; the window is empty.
3. **§07's block labels are 28px**, its index 258 and its gaps 82/60 — all taken
   from the frame, which the note calls load-bearing.
4. **§04's card pitch is 300**, not 304.
5. **§03's structural rules are 2px**, matching the frame, which draws the
   cluster underline and the damage/response divider at 2 and the row
   separators at 1. The build had flattened both to 1.
6. **Section padding steps on the phone** (`py-16 lg:py-32`).
7. **The photographs go through `next/image`.** Not a visual change — the same
   crops at the same positions — but a 375px phone now pulls a 640w variant of
   the hero rather than the 2000px original. §02 stays on raw `<img>` on
   purpose; the file says why.

---

## 5 · Doc drift found on the way — both corrected in this pass

- `.claude/skills/yachatdac-typography/SKILL.md` §"The shipped scale does not
  match this yet" had been false since `6bd7b2b`: it still said nothing in the
  codebase resolved to 56/48/40, and step 4 still pointed at `text-display` (96)
  and `text-beat` (44), both of which that commit deleted. Rewritten, and it now
  names all three scales currently in the tree so the next page knows which one
  it is in.
- `docs/motion/scenes.md`'s Living Work ledger had **nine rows for ten built
  sections** — §07 Infrastructure was missing, and §06's row had absorbed its
  phrase ("and what it takes") as though the two had been merged. Row added.


---

## 6 · Round 2 — Ivy's review of the built page

Nine comments. Two were build bugs, two were measurable divergences from the
frame, and the rest were UX judgements about sections that were faithful to the
artboard and still did not work for a reader.

| # | Comment | What it turned out to be |
|---|---|---|
| 1 | Hero crop differs from Figma | **Two causes.** The scrim was darker than drawn at both ends — a 20% haze over sky the frame leaves clear, and fully opaque where the frame stops at 88%. Ported exactly. The remaining difference is **aspect, not position**: the source is 1.78, the frame 1.44, and a `min-h-svh` hero is 1.78 at 1920×1080, so a wide screen shows the whole frame and crops nothing. |
| 2 | Should text align with the nav logo? | **Yes, and Living Work was the only page it was true of.** Four sibling pages already ship a 100px gutter; this page was the last on `max-w-7xl` at 144. Now on the house column, footer with it. The nav's 64 is Marc's `Navbar / 1 /` geometry and is left alone on every page. |
| 3 | The numbers make no sense | **A fixed `h-[30vw]` box around a `16vw` glyph** left ~200px of dead air and pushed the label to the foot of the screen at 12px. Now a two-column grid: numeral left, label beside it at 18px, swapping together. Also closed 45vh of dead screen in the timeline; span 430 → 400vh. |
| 4 | Rangers artwork leans left | The frame draws the rule at x=100 w=1240 — the full content width. The build capped it at `max-w-5xl` and left-aligned. |
| 5 | Card hierarchy and drag | Scale off a cosine bell against the viewport while the pitch stayed flat: the hierarchy flattened at the edges and the gaps grew 31 → 60 → 80. Now an even ramp with the pitch integrating the scale — constant 20px gaps. Wheel/trackpad added, horizontal intent only. |
| 6 | The Spring costs too much scroll | The eight days alone ate ~130vh. Auto-runs in ~2.2s now; pin 150 → 60vh. Trades away the note's "scrolling controls time", deliberately. |
| 7 | Infrastructure header should stay | Header sticky on `lg`, blocks pass under the artist's rule. The index parks below it via a measured custom property. |
| 8 | Don't ship the stroked text | It was Ivy's drawing of the animation, not a thing to ship. Three drawing layers collapse to one solid name wiped left-to-right; the rule and tick below carry the proportion, and Rainbow Credits' empty track is now the whole of how it reads as unstarted. |
| 9 | Are the cards that wide? | **No — at 362 they are the narrowest three-up on the site.** The gap was the problem: 32 against the frame's 77. Opened to the drawn value. The glyph now goes through `SeamGlyph`. |

### Two things deliberately not done

- **The frame's line under §02's rule** — *"The aperture opens as the figures
  change…"* — is a description of the motion. `CLAUDE.md` keeps notes in the
  notes lane, so it is not rendered.
- **No per-figure explanatory copy was written.** The label carries the meaning;
  inventing four new sentences would need sourcing and sign-off.
