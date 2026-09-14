# Our People — Marc's review, 14 Sep 2026

The built `/our-people` read back by Marc. Four notes. Three changed the build; one
turned out to be a mis-transcription and changed a different thing from the one it named.

Applied under **F8, build-first** — no pre-approval gate, corrections arrive as they arrive.
Nothing in this round touches anyone's recorded words: Graham Ambridge's biography still
says *settler* (**CR4**, held) and Suzanne Thompson's quotation is untouched.

*Last updated: 14 September 2026*

---

## 1 · What the review said, and what it meant

| # | As written in the review | What it meant |
| --- | --- | --- |
| 1 | "Animations still need to be fixed on this page especially on people cards" | The six team cards read as a mess — cards that appeared to move left and right. The entrance should be **The Record's**: fade in and out. |
| 2 | "Liked the layout of the people cards — noted the numbers appear too small and should be increased" | **The note was wrong.** There are no numerals on the team cards and never have been. Marc meant the **80 / 20 count animation**, which was not reading as a count. |
| 3 | "An editorial note / error message was visible on the page — confirmed it will be removed (IMPORTANT)" | Every rendered editorial note off the page, **⟡ markers included**. |
| 4 | "Order the card colors on the four cards at the last section" | Reorder the four doors. The colours themselves stay. |

---

## 2 · The card entrance

**What was there.** All six cards lit in one grouped `opacity` fade keyed to the *first* card's
document position, so row two was fully opaque long before its own `team-1` reading stop, and
nothing ever faded back out. The left/right travel Marc saw is `peopleGather` — the alternating
`x` arrival superseded by that fade on 14 September but still registered, still in the
`EffectName` union, and still being read off every card on every rendered frame by the canvas
(`our-people-world.ts` took `gsap.getProperty(frame, "x")` and wrote a counter-registering
`offset` uniform for a transform nothing had written since).

**What it is now.** The Record's rule, `cardPassOpacity` — a card fades up once its top is 12vh
inside the bottom edge and fades back out as its foot reaches 14vh from the crown, smoothstepped
over a span that differs per card. `/wonder` already borrowed The Record's entrance on 14
September ("one card entrance across the pages"); this is the third page on the same numbers,
so the rule was **exported from `src/lib/motion/record-masonry.ts`** rather than copied. The
Record and /wonder still call it through the module; their behaviour is unchanged.

**Why the module itself could not be reused.** `createRecordMasonry` builds a ScrollTrigger per
card and derives screen position from `self.scroll()`. `/our-people` is one pinned stage whose
HTML track is translated by a reading clock — a card's screen top is `box.top - travel`, and
there is no per-card trigger to ask. The *rule* is shared; the *host* is this page's own pass in
`paint()`.

**What was deliberately not taken.** The Record's per-column vertical drift. Marc's objection was
cards that moved, and a drift would also fight this page's `team-0` / `team-1` reading holds.

**Two things that came free.** A card below the fade threshold is now `visibility: hidden`, so it
cannot take a tab stop while invisible — the grouped tween used bare `opacity` and left all six
focusable. And the canvas reads the card's fade from a CSS custom property instead of computed
style, which takes six `getComputedStyle` calls out of every rendered frame.

`peopleGather` is **deleted**.

---

## 3 · The 80 / 20 count

**What was wrong.** The live figure was written to `"0%"` at build and counted up on a proxy with
`immediateRender: true`, which meant the tween touched the text the moment it was created and
scrubbing back above the start left the figure stranded part-counted.

**First attempt, reverted the same day.** The plan read Marc's note as *"the figure should rest at
the constitution's number"*, so each figure was drawn twice — a resting copy showing 80%, and a
counting copy swapped in when the ratio was reached. Checked in a browser, that put an **80% on
screen through the whole approach and then snapped it back to 3% to start counting**. A figure
that has to leap down before it can count is not a count, and the user said so plainly: *"the
percentages doesn't start at 0% on load."*

**What it is now.** The live figure **ships as `0%` in the markup** — the number on screen before
the ratio is reached is the number the count begins at — and nothing is written to it at build.
`immediateRender: false` holds that in both directions: the tween does not touch the text until
the playhead reaches it, and scrubbing back renders progress 0, which writes `0%` again. Measured
in a headless browser at 1440×900: `0%` at load, `0 → 80` as the gold four-fifths draws, then
`0 → 20` as the last fifth does, and the whole thing counts back down on reverse scroll. The
invisible sibling holds the box at the final width so the row never reflows, the `sr-only` copy
carries the fact throughout, and the MutationObserver still exempts the counting node so a count
is not mistaken for a content change. A fallback — no clock to reach the ratio with — shows 80/20
outright.

**Not changed:** the count's pace. `fill = 2.0` was *halved* by user direction earlier the same
day, after Living Work's rolling figures. Marc's note was about the resting state, so the span
is left where that direction put it. It is one constant if he wants it quicker.

---

## 4 · The editorial notes

Removed from render. **Every string stays in `src/content/our-people.ts`** — R14 / R20, the
content module is still the record — and each removal carries a comment in the markup saying so.

| Where | Removed |
| --- | --- |
| §01 hero | `⟡ Stand-in` |
| §03 cards | `⟡ Placeholder face` — all six |
| §03 cards | `⚠ Role to confirm`. **The whole role line goes when `roleUnconfirmed`**: the string in the content module *is* "Role to confirm", so dropping only the glyph would still have printed the note. The bio takes the role's top margin so the card does not open a gap. |
| §03 lede | "Placeholder roles below. Names, titles and photographs to be confirmed." |
| §03b breath | `⟡ Stand-in` |
| §05 | the three `⚠` identity questions under the acknowledgements |
| §05 | "Elders and family to add — Suzanne to complete…" |
| §05b breath | `⟡ Stand-in` |

**Kept:** `Seat held`, the `Not yet sitting` pill, the dashed Elder Advisory container, the gold
held-name rules and their `aria-label`s (accessible names for a drawn object, not visible notes),
and the `[ … ]` contact fields — R9 / R15 forbid making those live and the brackets are the
drafter's own mark for "not confirmed".

⚠ **This reverses a documented safeguard.** `docs/motion/scenes.md` and `src/content/kit.ts` kept
the ⟡ markers because *"a screenshot circulated without it is exactly how a placeholder becomes a
claim."* That reasoning has not gone away — the faces on this page are still stand-ins, and the
face on the named card is still not Graham Ambridge. Removing the markers is Marc's explicit
call; it is recorded here, in `scenes.md` under *What is held*, and in the component comments, so
it reads as a decision rather than as drift. **R24 remains the page's blocker.**

---

## 5 · The doors

`bg-roasted` → `bg-evergreen` → `bg-midnight` → `bg-charcoal`. Same four grounds, lightest to
darkest, so the row grades across instead of reading as four arbitrary picks. Literal classes
only — `ContactDoors` cannot take an interpolated `bg-${tone}`. `/about` passes its own
alternating pair to the same component and is untouched.

---

## 6 · Raised, not applied

**The footer still renders two editorial notes, on every page.** The shared footer carries
`[ WELCOME TO COUNTRY — held … ⚠ R1 — do not draft, paraphrase or place substitute text here. ]`
and `⚠ R15 — registration numbers not yet supplied`. They are visible on `/our-people` and are
plainly in the spirit of note 3, but they are site-wide chrome: removing them changes all eleven
routes, which is wider than a page review. **Marc's call** — say the word and they go in one
pass.
