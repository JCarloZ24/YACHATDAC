# Living Work — QA pass, 8 Sep 2026

The build at `/living-work` read against `03 · Living Work — HI-FI · Desktop ·
the field notebook` (Figma `2137:2613`) and its twelve `NOTE ·` frames, ahead of
the review with August and Marc.

The notes lane is the spec. Every MOTION paragraph in it is a testable
assertion, and §2 below is that test.

**Applied in this pass:** commits `04a9b15` (accessibility) and `834eb4d` (the
page). **Not applied:** everything in §2 marked ⚠, which is held for Ivy's
motion comments, and §3, which needs a decision that is not the builder's.

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

**§02's rest state.** The frame contradicts itself: the progress rail reads
`04 / 04`, the figure drawn is `480`, and the caption beneath it is
`KILOMETRES SOUTH TO BARCALDINE`, which belongs to `120`. Three states composited
in one artboard.

Separately, the sequence order disagrees. The note gives
`8,870 → 120 → 480 → 2019` and says *"2019 is the only figure with digits after
the aperture, and it runs past the 1340 margin to the edge of the screen"* —
which only holds if 2019 is last. The build runs `8,870 → 2019 → 480 → 120` and
rests on `120`, with its own documented reason (the `0` of 120 becomes the
portal onto the plain).

Both readings are coherent. **The frame needs settling, not the code** — and it
is the same defect class as §05's rest state, which the 29 Aug Figma QA already
fixed once by making the section rest at `08`.

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

⚠ **Say this honestly: Wonder currently ships 96.** It takes its sizes literally
from its own frames via local `H1`/`H2`/`H3` constants
(`src/app/wonder/_components/Sections.tsx:125`). So the site now has two pages
disagreeing about hero size, and **that is a live inconsistency for August and
Marc to settle**, not a settled rule this page is following. Three scales are
currently in the tree: the `text-h*` tokens (The Record, Truth, the shared
components, and now Living Work), Wonder's frame-literal 96/56/40, and whatever
each remaining page hand-built.

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
5. **Section padding steps on the phone** (`py-16 lg:py-32`).

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
