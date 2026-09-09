# Hi-fi Figma readout — Homepage + Footer

Read 2026-08-20 from Marc's hi-fi frames, copied out of the team file
`EgXBAnO5vgQPVXYt9PrwGG` into `Qk35pAX0sz2ntNRXceY7Gb` (*Yachatdac Exploration*) because the team
file's Figma MCP quota is exhausted on the Starter plan.

Frames read: Homepage `17:875` (1440×7159), Footer `17:3421` (1440×2101).

This records what the **built design** does, as distinct from what the copy drafts say. Several
items in `docs/content/STATUS.md` are tracked there as copy problems; this confirms which of them
are already built into Figma, which is a different and worse state.

---

## 1 · The wrong-jurisdiction Acknowledgement is already built

`STATUS.md` note 1 flags the Northern Territory error in the **homepage copy draft**. It is also
already **built into the hi-fi Figma footer**, node `17:3700`:

> ACKNOWLEDGEMENT OF COUNTRY — *We respectfully acknowledge and honour the Aboriginal people of the
> Northern Territory and recognise the continuation of culture, connection to lands, water and
> country.*

That matters because the footer is a single shared component intended for every page. Fixing the
copy draft alone does not fix this; the Figma component has to be corrected too, or the error
propagates to all five routes via `src/components/layout/SiteFooter.tsx`.

**Do not reuse the hi-fi footer as-is.** Empty the Acknowledgement slot and annotate it pending
Suzanne's wording (open decision 3 — a genuine Welcome to Country is possible here).

---

## 2 · The hi-fi has a persistent navbar; the homepage copy draft says it should not

`17:877` is a `Navbar / 1 /` frame at y=0, above the hero, carrying WONDER · TRUTH · LIVING WORK ·
CONNECT.

The homepage copy draft specifies no navigation until block 6 (The Invitation) — blocks 1–5 are
pure immersion and the three invitation cards are the first navigation choice offered.

Unresolved, and a genuine design decision rather than an error. Flagged for the team.

---

## 3 · Block mapping — hi-fi and copy draft reconcile at 7 blocks

| # | Node | y | Eyebrow | Headline |
|---|---|---|---|---|
| 1 | `17:920` | 124 | WELCOME TO COUNTRY | Reconnection across time, across people. |
| 2 | `17:931` | 1024 | 01 — WONDER · GUESTING ON COUNTRY | The oldest sunrise you will ever stand under. |
| 3 | `17:1135` | 1924 | 02 — TRUTH · RESEARCH & DISCOVERY | What is etched in stone does not forget. |
| 4 | `17:1033` | 2888 | 03 — BELONGING | Everyone has a place to find their way back to. |
| 5 | `17:1237` | 3788 | 04 — LIVING WORK · CARING FOR COUNTRY | Caring for Country, in practice. |
| 6 | `17:1902` | 4688 | THE INVITATION, THEN THE WAY FORWARD | Every journey begins differently. |
| 7 | in footer | — | (Acknowledgement + newsletter) | — |

The child array order does **not** match visual order — beats 3 and 4 are transposed in the layer
list. Sort by `y`.

---

## 4 · Unreplaced placeholder copy in the hi-fi

None of these are in the copy drafts; the drafts are correct. These are Figma-side defects.

| Node | Defect |
|---|---|
| Beat 4 `17:1033` | Headline and body are the **same sentence**. The body was never written. |
| Invitation card 1 | Title duplicates the section headline. Should be **Wonder**, per copy draft line 35 and resolved decision **D5**. Not *Experience Country* — that is build documentation §2, which D5 explicitly supersedes. |
| Invitation card 2 | Body duplicates card 1's text. Should describe research partnership. |
| Invitation card 3 | CTA reads `EXPLORE EXPERIENCES`; should be **SEE THE WORK**. |
| Navbar | Relume placeholders `Link Four` … `Link Seven`, set in Roboto. |
| Footer nav | Three `Link One` placeholders; "Open **Search** Opportunities" is a typo for *Research*. |
| Footer newsletter | Relume default copy — "stay up to date on features and releases", and the grammar error "you agree to with our Privacy Policy". Not YACHATDAC voice. |

---

## 5 · The built type scale is not the documented one

| Role | Face / style | Size |
|---|---|---|
| Hero headline | Block Berthold Regular | **96** |
| Section headline | Block Berthold Regular | **64** (×5) |
| Card title | Block Berthold Regular | **32** |
| Hero eyebrow | Bantayog Sans Extrabold | 32 |
| Section eyebrow | Bantayog Sans Extrabold | 24 |
| Nav / CTA / footer heads | Bantayog Sans Extrabold / Bold | 16 |
| Lead body | Work Sans Medium | 24 |
| Card body | Work Sans Medium | 16 |
| Footer links | Work Sans Regular | 14 |
| Acknowledgement | Work Sans Regular | 20 |
| Scroll cue | GoodDog Plain Regular | 32 |

The Figma Typography board documents a 56 / 48 / 40 / 32 / 24 / 20 desktop ramp. **The values 56,
48 and 40 appear nowhere in the built design.** The working scale is **96 / 64 / 32**.

Anything built to the documented ramp will not match the homepage. Reconcile the ramp against the
built design, not the other way round.

**Font leakage:** `Roboto` in the navbar and footer newsletter (Relume leftovers). `Bantayog Sans
DEMO` — the trial cut — throughout, rather than the licensed family.

---

## 6 · Layout values, confirmed in the built design

| Value | px | Where |
|---|---|---|
| Page padding (horizontal) | 64 | Every section, navbar, footer |
| Section padding (vertical) | 112 | Invitation block `17:1902` |
| Gap | 80 | Invitation, footer, Acknowledgement blocks |

Narrative beats are a fixed **900px** band each — near-viewport, not content-driven. Hero is 1024.

---

## 7 · Imagery — slot ratios

| Slot | Size | Ratio |
|---|---|---|
| Hero background | 1539×1024 | 1.50, **overscanned** ~99px beyond the frame |
| Narrative beat background | 1440×900 | 1.60 — full-bleed, edge to edge |
| Invitation card | 395×500 | 0.79 (4:5 portrait) |

**Every narrative beat is a full-bleed photographic band with text laid over it.** This is already
the "static foreground, moving background" direction recorded in `docs/design/README.md` — the
wireframes should express it, not invent an alternative.

The footer carries two large organic `Vector` shapes (`17:3423` `#cb7722`, `17:3424` `#090e12`)
forming a curved top edge. These are placeholders for the commissioned artwork, not final design.

---

## 8 · Palette — the built design mixes both disputed sets

| Hex | Source |
|---|---|
| `#fbae3d` | Figma board — Yellow Gold. Dominant accent. |
| `#d97804` | Figma board — Burnt Ochre |
| `#cb7722` | **Branding guide PDF** — Burnt Ochre. The large footer curve. |
| `#32b0ae` | **Branding guide PDF** — Turquoise Blue |
| `#f6f6ec` | Off-White — body text on dark |
| `#090e12` | Charcoal Black — second footer curve |
| `#f9b24c` `#d57907` `#98470d` `#31afe3` `#fefefe` | **In neither palette** |

The two palettes were assumed to be an either/or choice. The built design uses **both**, plus five
undocumented values.

> ✅ **CLOSED, 29 August 2026.** Ivy settled this: the **client-approved Artwork Creative Brief set
> wins**. The paint styles in YACHATDAC-V2 were corrected in place — `Rust Red → Oxide Red #af231c`,
> `Sky Blue → Turquoise Blue #32b0ae`, `Olive Grove → Eucalyptus Green #5e7930`, Burnt Ochre
> `#d97804 → #cb7722`, Off-White `#fcf7f0 → #f6f6ec` — and `Colour/Yellow Ochre #d69828` was added.
> `Warm/Yellow Gold #fbae3d` stays as the hero scroll-cue accent; it is not a drift of Yellow Ochre.
> Editing the styles in place carried every bound node with them. **Do not reopen this as a
> question.**

Caveat: raw fill counts are inflated by the logo artwork's many vector paths. Treat this as
presence/absence evidence, not weighting.

---

## 9 · Constraint — the Figma MCP sandbox cannot load locally-installed fonts

Verified by control test: `figma.loadFontAsync({family:'Arial'})` fails with *"The font family
Arial does not exist"*. Arial is installed. The sandbox enumerates ~1,938 families — Figma's hosted
Google Fonts library only.

| Face | Loadable via MCP? | Why |
|---|---|---|
| Work Sans | ✅ | Google Font, hosted by Figma |
| Inter | ✅ | Hosted |
| Block Berthold | ❌ | Local install only |
| Bantayog Sans | ❌ | Local install only |
| GoodDog Plain | ❌ | Local install only |

This is not fixable by installing fonts differently — per-user and system-wide installs are both
invisible to the sandbox.

**Workaround in place.** Thirteen text styles were created in `Qk35pAX0sz2ntNRXceY7Gb` using Work
Sans as a stand-in, sized and tracked to the built design above. Each placeholder style carries its
target face in the style description. Changing the family on **seven** styles in the Figma UI
repoints every bound node at once:

| Style | Change family to |
|---|---|
| `Display/96`, `Heading/64`, `Card Title/32` | Block Berthold Regular |
| `Eyebrow/Hero-32`, `Eyebrow/Section-24`, `Nav & CTA/16`, `Nav & CTA/16 Bold` | Bantayog Sans ExtraBold / Bold |
| `Accent/Scroll-32` | GoodDog Plain Regular |

`Body/*` and `Link/*` are already correct — Work Sans is the real brand body face.

---

## 10 · Font availability on Ivy's machine, 2026-08-20

All four brand faces are installed per-user and correctly registered in
`HKCU\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Fonts`:

- **Block Berthold** Regular — `blockberthold.otf`
- **Bantayog Sans** 21 styles, plus SC and Baybayin variants — 49 files
- **Work Sans** 18 static styles
- **GoodDog Plain** *and* **GoodDog Cool** — `GOODDP_.TTF`, `GOODDC_.TTF`

GoodDog was previously recorded as unobtainable. That is no longer true. The design uses **Plain**;
the build documentation calls for **Good Dog Cool**. Both are now present — the team still needs to
say which is correct.

**Licence provenance is unresolved for Block Berthold** (`public/fonts/BlockBerthold-COPYRIGHT.txt`
carries an all-rights-reserved Berthold/Adobe notice with no licence grant), for Bantayog Sans, and
now for GoodDog. Only Work Sans has an OFL.

---

## 11 · Wonder mobile frame `2576:21896` — drifts found 2026-09-09

Read while re-syncing `/wonder` at 375 against `01 · Wonder — HI-FI · Mobile`. Recorded here so
the build is not "corrected" toward the frame on either count.

### 11.1 The facts list carries duplicated cells — the BUILD is right

`Layout / 18` (`2576:22001`) is 1920 tall against the built section's 1379. The whole 541px is one
artefact: the fact `List` (`2576:22041`) holds roughly twelve cells where the draft has six.
**Where**, **Getting here** and **How long** each appear twice (`2576:22043`/`22063`,
`22046`/`22069`, `22049`/`22099`), and **Sleeping** twice (`22053`/`22066`) — a duplicated column
left in the frame, not a design decision.

`src/content/wonder.ts` carries the six the draft governs (D5) and the build renders those. Do not
add cells to match the frame; the frame needs the duplicates deleted.

With that one section set aside, the built page tracks the frame closely at 375 — 12,382px against
12,699px, and every other section within ~110px of its frame height.

### 11.2 The palette drifts from the V2 variable collection

The `@theme` block in `globals.css` is sourced from the client brand kit; four of its colours
disagree with the `Colour/*` variables the V2 file actually draws in:

| Token | globals.css | V2 variable | |
| --- | --- | --- | --- |
| `--color-oxide` | ~~#c23d31~~ **#af231c** | `Colour/Oxide Red` #AF231C | repointed 9 Sep, August |
| `--color-burnt` | #d97804 | `Colour/Burnt Ochre` #CB7722 | open |
| `--color-eucalyptus` | #3f6b1f | `Colour/Eucalyptus Green` #5E7930 | open |
| `--color-canvas` | #f6f6ec | `Colour/Off-White` #FCF7F0 | open |

`--color-gold` (#fbae3d) already matches `Colour/Yellow Gold`, and `--color-roasted` (#4e3524)
matches `Colour/Roasted Brown` — so two of the six were synced to V2 already and four were not.

Oxide was repointed on 9 Sep on August's direction, off the Wonder CTA blob. **The other three are
raised, not reconciled**: they are a palette decision for Steve and the Elder Advisory Group, not a
side effect of a CTA fix, and each is site-wide — colours live once.

### 11.3 The §02 map ran at export size on desktop — fixed 9 Sep 2026

`facts-map.svg` was placed at its full export size, 1129 × 783 from x=205, which at 1440 pushed
Queensland past the section on every side: Cape York was cut off above the band and the east coast
ran off the right edge, so it read as background texture rather than as a map of anywhere.

August supplied the intended crop as a standalone SVG. It is the same artwork at 50.83% with the
window moved — verified against five paths to three decimals — so it was applied as a `viewBox`
(`446.59 0 682.66 637.42`) on the existing file rather than committed as a second copy: one map,
one set of `data-route`/`data-feature` draw tags, no chance of the two cuts diverging. The export's
`overflow="visible"` and `preserveAspectRatio="none"` came off with it — the first would have
defeated the crop, the second would stretch the state into the slot's taller box.

It now sits in the frame's own 600 × 640 Placeholder Image slot, measured at (760, 64) in the 1440
overlay.

**Still open:** the two cuts are not the same file and their fills disagree — `facts-map.svg` paints
the property `#C23D31` with a `#D97804` pin, `facts-map-mobile.svg` uses `#AF231C` and `#FBAE3D`.
The mobile pair is the V2 variable pair (and `#AF231C` is where `--color-oxide` now points, §11.2),
so the desktop cut is the one carrying the old brand-kit values. Left as supplied pending the
palette decision above.

### 11.4 The CTA chevrons are two marks, not one rotated — supplied 9 Sep 2026

`BlobChevron` in `src/components/ui/Furniture.tsx` was drawing a plain 2.5-weight stroke as a
stand-in, with a note that the hand-drawn mark "cannot be rotated into a UI glyph". August supplied
both blobs whole — "Register your interest" 264 × 56 and "Download the brochure" 276 × 56 — and the
chevron is the last path of each.

Measured off the exports, the right mark is **9 × 16** and the down mark is **16 × 9**, and they are
drawn separately: the down stroke hooks the other way, so neither is the other rotated. Both are now
carried at their own bounding box as a `viewBox` window on the export's coordinates, filled with
`currentColor`. This is site-wide — `BlobButton` is used on /about, /partnerships and /our-people too.

**Two things the exports confirm, both still open:**

- The Download blob is filled **`#CB7722`** — the V2 `Colour/Burnt Ochre`, not `--color-burnt`'s
  `#d97804`. Second independent confirmation of the §11.2 drift, now from artwork rather than a
  variable read.
- The two blobs are **different widths**, 264 and 276. `BLOB_BOX` sets one fixed `w-[17.25rem]`
  (276) for every blob on the site, so "Register your interest" renders 12px wider than drawn. Not
  changed: per-label blob widths are a component decision, not a Wonder one.

### 11.5 Itinerary rule, slider dots and two map re-crops — 9 Sep 2026

**The itinerary had a seventh dotted rule.** The frame's List (2576:22912) is twelve children —
Line, Item, Line, Item … — ending on the sixth item at 942 with no closing rule. The build drew a
line *after* each stage, so a seventh landed at 944 and pushed the wave down. The rule now heads
each item. Every other row already matched the frame's own y to the pixel (7/392, 399/7, 406/80,
486/7, 493/116 …), and does still.

**Slider dots on Highlights and Where you sleep — this reverses part of the 2026-09-05 CardRail
decision.** Ivy chose the peek rail over the frame's one-card slider because the peek needs no
JavaScript and dots do. That reasoning still holds for /about, /partnerships and /our-people, which
are static by decision and are **unchanged** — `dots` is opt-in and only /wonder passes it. Wonder
already ships client motion, and August asked for the frame's slider on 9 Sep. The row is still
native scroll-snap: with JS off it scrolls and snaps exactly as before and the dots simply rest on
card one. They indicate and shortcut; they are never the mechanism.

Both frames draw **five** dots over rows of three cards and two — a Relume placeholder nobody wired
up — so the frames are followed on shape, position and colour and not on that number. The dot is one
hand-drawn blob from the export, translated 15.51 apart (every control point differs by exactly
that), so one path is carried and repeated. Its lit colour **#EFB35C is not a palette token** and is
not `--color-gold` (#fbae3d); logged with the other colour drifts in §11.2.

**Both maps were re-cropped from their desktop files rather than kept as second drawings.** In each
case the supplied SVG proved to be the same artwork under a moved window:

| Map | Scale | viewBox applied |
| --- | --- | --- |
| §02 facts | 50.83%, verified on 5 paths | `446.59 0 682.66 637.42` |
| §04 getting here (phone) | 44.47%, verified on 3 paths, both axes agreeing to 5 dp | `1284.02 425.01 762.30 771.31` |

So `facts-map.svg` now serves **both breakpoints** from one inlined instance — the phone's separate
cut was squashed by `preserveAspectRatio="none"` in a 506 × 359 box *and* painted #AF231C/#FBAE3D
against the desktop's #C23D31/#D97804, two maps of one place that did not match. `getting-here-map-
mobile.svg` is now the desktop file under the supplied window. Both are sized by aspect rather than
a fixed box, so neither can be squashed again. `facts-map-mobile.svg` is left on disk unreferenced —
supplied artwork, not ours to delete.

### 11.6 Frame 15423 (3439:30182) — the phone's Getting-here map, corrected

Reading the node itself corrected two things in §11.5's first pass at it.

**It is 343 × 343, square.** The map group inside it (3439:30164) sits at exactly (−571, −189) and is
1013 wide against the desktop artwork's 2277.93 — a scale of 0.444702 on x and 0.444701 on y, which
confirms the transform derived from the paths to six decimal places. The window is therefore
`1284.01 425.00 771.30 771.30`. The SVG August pasted exported at 339 wide, so the first crop was
9px narrow on the right; the frame is authoritative and the file now carries the square.

**It carries the four stops, and neither cut of the artwork does.** Checked both files' fills: no
icon colours in either, so the phone map had no stops at all — they are laid on the frame, exactly
as at 1440. Frame 15423 draws them as 3439:30185 / 30186 / 30192 / 30190; their centres, as
percentages of the 343 box, are

| Stop | Icon node | centre | width |
| --- | --- | --- | --- |
| Lake Dunn | 3439:30185 | 61.52%, 27.11% | 3.50% |
| Sculpture Trail | 3439:30186 | 53.64%, 32.65% | 3.50% |
| Horsetailer's Gorge | 3439:30192 | 59.48%, 37.03% | 4.08% |
| Gray Rock | 3439:30190 | 66.76%, 30.76% | 3.50% |

Percentages, not pixels, on both position and size: the frame draws these at 12–14px against 343,
and a fixed size would shrink against the map on a wider phone.

**Which icon is which** is cross-checked three ways and agrees on all four — the frame's relative
positions, August's reference render, and the desktop map's own coordinates: lake highest, sculpture
leftmost, gorge lowest, gray rock rightmost. Worth stating because these are named places on
Country, so a mis-assigned symbol would be an error of substance, not of styling.



### 11.6 Wonder itinerary restored - 9 September 2026

*Last updated: 9 September 2026*

User direction restores desktop `2033:5889` in place of the full-screen film.
Figma MCP `get_design_context` returned the View-seat tool-call limit;
`whoami` confirmed that seat on the file's Professional team. This pass uses
the user's screenshots, supplied Dev Mode CSS and the existing exported assets.
It does not claim a fresh MCP measurement.

At 1440 x 900: section padding 112px 200px 164px, outer flex gap 80px,
1040px content, 40px between heading and list, 48px row padding and 30px from
row heading to body. The photo is 500 x 400px. Rules keep the SVG's native
9.59848px height. The desktop reference includes a closing rule; the prior
11.5 note applies to the mobile frame, which still omits that rule.

GSAP enhances the same native disclosures at both widths. First stop open;
copy comes from the draft unchanged. Brand font repoint remains deliberate.


### 11.7 Viewport-aligned itinerary motion - 9 September 2026

Later user direction asks for automatic opening and text/picture entrances,
with the live effects lab as reference. `settle` and `frameOpen` were replayed
there and reused through the production registry. The accordion styling stays;
its desktop motion mode holds one reading screen and advances through six stops.

The held screen deliberately tightens row padding to 24px and the heading/list
gap to 24px. Top padding is 32px at 900px viewport height, rising to the original
112px on taller windows. This lets the longest current stop fit at 1440 x 900.
Horizontal spacing, type, 30px content gap, image size and exported furniture
retain the Figma dimensions. The original 11.6 spacing remains the base and
reduced-motion layout. No new Figma MCP read is claimed.
