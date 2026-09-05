# Design files — placeholder

*Last updated: 26 August 2026*

**Current milestone: Lo-Fi Wireframes — complete, 26 August.** Target was 21
August 2026, so it landed five days late: the client's v3 prototypes arrived on
24 August, three days *after* the deadline, and invalidated parts of what had
been drawn. The correction pass ran on 26 August and is done.

**Ten frames, one row, every route covered.** Hi-fi can start. The full spec is
in [`lofi-spec.md`](lofi-spec.md); the canvas itself is deliberately quiet, and
what is still open and who holds it is at the foot of this file and in the
review sheet.

Design happens in Figma; this folder holds the links, exports and decisions
that the codebase needs to stay in step with it.

## Missing — needed here

| File | Owner | Milestone | Status |
| --- | --- | --- | --- |
| Figma file — **official, V2** | Ivy + Marc | — | ✅ [YACHATDAC-V2](https://www.figma.com/design/7XBvi0Mdbtmym10nkF9IGp/YACHATDAC-V2?node-id=0-1) — restructured 29 Aug into two pages |
| Figma link — lo-fi wireframes | Ivy (Jasmin Ivy C. Fedilo) | Lo-Fi Wireframes, 21 Aug | ✅ **Complete, ten frames** — now lane 2 of each page row in V2 |
| Figma link — hi-fi mockups | Marc + Ivy | Hi-Fi Mockups Approved, 31 Aug | ▲ **Seven built** — Home (1,775vh), Wonder (1,322vh), Truth (2,229vh), Living Work (2,045vh), The Record (1,624vh), About (2,053vh), Our People (1,805vh). Three rows still empty |
| Figma link — UI design system / component library | Marc | — | ✅ In V2 — 12 `Colour/*` paint styles, `Typography/*` text styles, `Desktop/1440` + `Mobile/375` grid styles, `Scrim/Media` |
| Relume Figma kit link | Marc → JC | — | ⏳ not supplied. Relume's leftovers are quarantined in V2 as `_relume (legacy — do not bind)` |
| Whiteboard sketches — scroll and animation behaviour | JC | Lo-Fi Wireframes | ⏳ not supplied |

Add each as a link in this file rather than committing exports, except where a
static reference is genuinely useful (spacing specs, redlines) — those go in
`docs/design/exports/`.

## Timeline

| Date | Milestone |
| --- | --- |
| 21 Aug 2026 | Lo-fi wireframes complete |
| 28–31 Aug 2026 | Hi-fi mockups approved |
| 14 Sep 2026 | Website launch |

Sprint cadence is twice-weekly meetings.

## Lo-fi scope

Four pieces, per the roadmap:

1. Lo-fi wireframes for the Heritage-style homepage sections — Ivy
2. Lo-fi wireframes for inner pages (About, informational) — Marc
3. Whiteboard sketches for scroll and animation behaviour — JC
4. Team review and sign-off

**⚠ In practice item 2 has been done entirely by Ivy, not Marc.** About, The
Record, Our People, Partnerships, Connect and the legal pages were all drawn on
the lo-fi canvas. The roadmap split above has not been formally changed — it is
recorded here so the divergence is visible rather than discovered, and so the
hours land against the right name.

### Frames on the canvas — ten, complete

Now in **YACHATDAC-V2**. Each frame is **lane 2** of its page's row on the
`YACHATDAC — Design` page, and there is **one row per page** — scrolling *right*
within a row walks that page's material. Marc's superseded Relume v1 frames moved
to the `Archive — superseded` page; nothing was deleted.

**Rows are laid out in bands, not one vertical stack — Ivy rearranged the file by
hand on 1 September and that arrangement is the live one.** A single 152,000px
column meant the built pages could only be compared by scrolling past one another.
Three bands now sit side by side, so a whole band is legible at one zoom level.
Read the coordinates off the row labels before quoting them; they move whenever
Ivy re-lays the canvas, and the table below is a snapshot, not a contract.

Rows are deliberately **not** wrapped in Figma Sections. A section has to be
resized every time something is added to it, and these rows are built to grow —
adding photos, proposals or a mobile mockup extends a row to the right and moves
nothing else in the file. Large text labels are the row headers instead.

The `x`/`y` columns below are the row **label's** top-left corner. Within a row the
hi-fi sits at `label x − 160` and the lo-fi at `label x + 3780`.

**The full spec now lives in [`lofi-spec.md`](lofi-spec.md)** — one section per
page, with the motion sketch IDs, the span arithmetic, the decisions behind each
page, and what is still held on it.

| # | Page | band | label x | label y | vh | Sections | Hi-fi |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Home | A | −24826 | −8071 | 903 | 7 | ✅ 1,775vh |
| 2 | Wonder | A | −10874 | −8221 | 1363 | 14 | ✅ 1,322vh |
| 3 | Truth | A | 8427 | −8588 | 1704 | 21 | ✅ 2,229vh |
| 4 | Living Work | A | 41649 | −9308 | 986 | 9 | ✅ 2,045vh — **11 sections**, reordered, swept |
| 5 | The Record | B | −25473 | 17049 | 1123 | 10 | ✅ 1,624vh |
| 6 | About | B | −2383 | 16452 | 1106 | 11 | ✅ 2,053vh — two full-bleed bands, §03 pinned |
| 7 | Our People | B | 18944 | 16646 | 814 | 9 | ✅ 1,835vh — **11 sections**, §03 pinned |
| 8 | Partnerships | C | −26193 | 39340 | 418 | 3 | ✅ 1,190vh — **10 sections**, §04 pinned, §08 is one action |
| 9 | Connect | C | −25473 | 40263 | 393 | 6 | ✅ 645vh — **5 sections**, the site’s single ending |
| 10 | Legal | C | 9479 | 40626 | 265 | 6 | ✅ 645vh — **5 sections**, one frame for three routes |

**Legal's row label reads `x 9479, y 40626`, not the `−25473 / 46224` this table carried until
2 September.** Row `y` drifts every time a hi-fi grows, and Legal's had moved out from under the
band-C column entirely. Re-read it from the label before quoting it — that is the standing rule
two paragraphs down, and this row is the example of what happens when it is skipped.

**Band C, 1 September.** Partnerships, Connect and Legal were left behind at `y ≈ 136000`
when the file was rearranged — roughly 100,000px below everything else, which is why they
could not be found. They now stack in a column **directly beneath The Record** at `x = −25473`,
on a 2,000px gutter, ending at `y = 49299`. They are three unbuilt pages: a row label and a
lo-fi each, nothing more.

**Two earlier diagnoses, both superseded by the band layout.** A uniform 2,000px restack of
the old vertical stack closed a 14,810px hole between Connect and Legal — that hole was real
and pre-existing, and it was why Legal read as deleted. Dashed **slot plates** were then added
at `x = 0` for rows 07–09, because those rows have no hi-fi and the column ran 15,000px empty
past Our People. Ivy removed the plates when she re-laid the canvas; band C solves the same
problem by putting the three rows where the eye already is, so they have not been rebuilt.
`04 THE RECORD`'s marker, which still read *"not started"* on a built page, stays retexted.

**Row y is read from the Figma row labels, not from the lo-fi frames.** Every value except
Home's had drifted — rows move whenever a hi-fi grows, and About's build moved rows 06–08
down twice. Re-read them before quoting them.

### Living Work — the correction pass, 29 Aug

A design review of the built hi-fi found one thing that mattered more than the rest.
**Twelve of the seventeen photographs came from batch 2, the *guiding* shoot** — the hero, all
seven Rangers slots, the Spring stand-in and the Get-involved band. Visiting children were the
subject of several. A page about ranger land management was illustrated almost entirely with
pictures of visitors, and read as a tourism page. It is now **fourteen batch-1 frames to four**.

| Change | What and why |
| --- | --- |
| Hero | `1.40.2`, an Iningai woman standing in the country being brought back, cropped so the headline never crosses her. The smoking-ceremony frame showed visitors being welcomed — it belongs on Wonder. |
| §02 | Rebuilt as **the aperture**: the 0 as a portal onto the plain, then the page's only full-bleed landscape. 55vh → 167vh. |
| §03 | Ground ramps bone → dust → dry earth across the four clusters; one silent landscape splits 263vh of list in two. |
| §04 | **Iningai Rangers moved up in front of The Spring** and onto charcoal, with the artist's wave rule and a motif ground. The spring copy is a ranger story, so this is the right adjacency. |
| §05 | The Spring's stand-in was children walking under *"eight days in it held a puddle"*. Now `1.87.1`, a dry creek — the state the copy describes first. |
| §06 | Streams 01, 04 and 07 become anchor tier (`L2`) and bleed to the page edge, breaking a seven-row metronome at zero height cost. |
| §09 | CTAs bottom-aligned, `Land management services` pulled back inside the 1340 margin, band deepened. |
| §10 | Section frame was filled **pure black**, putting a band above the wave; three nodes named *"removed — newsletter field"* were still rendering over the ABN line; the registration block was still in Roboto. All fixed. |

**Rangers moved to 04 and not to 03 for a structural reason:** the aperture ends by becoming the
**O of "Our challenges"**, so Challenges has to follow the numbers.

**Motion is now designed section by section** and recorded in each note in the NOTES lane, with
sketch IDs. Four behaviours ride on Leonard Mickelo's supplied artwork and are marked
`▲ ARTWORK MOTION — for Leonard's sign-off` in their layer names: the §04 wave rule draw-in, the
§04 motif drift, the §07 rule draw-in, and the footer motif drift. `permissions.md` records no
motion permission *received from the artist*; that is his to give, so the ask is flagged rather
than assumed.

### The five review notes, 29 Aug

A second review found the real reason three sections looked unfinished: **§07, §08 and §09 were all
running the same `hairline → label → title → body` template**, so three sections in a row read as
the same wireframe with different words in it. Each now takes the form of what it does.

| § | Was | Is |
| --- | --- | --- |
| 07 Infrastructure | 23 lines each carrying a literal `·` prefix | A **ruled register** — bullets gone, a rule under every line, and the quantities (480-metre, 240 volt, three, ten, six-month, 500m, Two, Four, six metres, 5km) set in gold so the numbers carry the eye. The artist's dotted rule now brackets both block rows. |
| 08 What the work produces | Five instruments in a 3+2 grid with a hole in it, and nothing tying them to the work | A **five-row ledger**: product, what it is, a status pill, and **the §06 streams that produce it**. The chips are the answer to "what is this section" — the lede already says *"The same activities, measured"*. |
| 09 Get involved | Bare headings, CTAs on three different baselines | **Three cards**, equal height, CTA pinned to the card bottom. |

⚠ **The stream mapping in §08 is a design proposal** derived from the existing bodies, not from the
draft. It is marked on the canvas and needs sign-off, like §03's cluster labels.

**§03's silent landscape is captioned** — *"The plain from the escarpment."* — and has its own note
in the lane at `y = 54906`, the first sub-section note in the row. A silent band a reviewer cannot
identify has failed.

### The second review, 29 Aug — §08 and §09

Two notes came back on the corrected page. The §09 note was a straight ask; the §08 note was the
same complaint for the third time, which meant the previous two answers had both been wrong.

**§09 now uses the real card.** `Card / Story - no image` is a new variant set in **`KIT · Living
Work`** (`2212:3122`, at `x = 7200` in the Living Work row), built from Marc's `Card / Truth` with
the image band and its scrim removed. Same 362 width, radius 24, 36 padding, type ramp and ochre
CTA. The **title box is 84 tall and bottom-aligned**, so a one-line and a two-line title share a
baseline and all three CTAs land on `y = 360` whatever the copy does.

| Card | Ground | Motif | Eyebrow |
| --- | --- | --- | --- |
| Ranger exchange | evergreen | circle | FOR OTHER RANGER GROUPS |
| Fund the work | brown | boomerang | FOR FUNDERS AND PARTNERS |
| Land management services | charcoal | starburst | FOR PROPERTIES IN THE DISTRICT |

On Truth the card's ground is **era-coded**. Here it is **decorative and carries no meaning** —
recorded in the component description and the note, because a reader of both pages will otherwise
assume it does. Charcoal sits last so the row hands off into the footer.

**§08 was rejected three times, and the third rejection was the useful one.** *"I really don't like
the template overall."* Three layouts had failed because all three were arrangements of the same
furniture — a grid, then rows, then columns with headers. The section is not a list. It is the
page's argument about whether any of this survives.

The rebuilt section **goes to charcoal** and sets each of the five names as a **vessel**: the name
flattened to a vector, filled with a hard-stop gradient — **solid to where the work has got,
outline for what is still to come**. A rule under the word and a gold tick stop at the same point.

| | Name | Fill | Status |
| --- | --- | --- | --- |
| 1 | Biological Sequestration | 0.78 | Registration underway |
| 2 | Biodiversity credits | 0.58 | Building the record |
| 3 | IPA designation | 0.42 | In progress |
| 4 | Fee-for-service | 0.26 | Being developed |
| 5 | **Rainbow Credits** | **0.00 — entirely hollow** | For YACHATDAC to write |

**Every name is measured against itself. No shared scale is claimed, because none exists** — you
cannot say a carbon registration is "further along" than a Native Title claim in common units. The
fill levels are the **client draft's own ordering**, flagged on canvas, and no percentage appears
anywhere on the page.

**The last thing you see is a hollow word on an empty track.** That is the honest state of Rainbow
Credits and it is the strongest moment in the section.

**`WHAT IT RESTS ON` is the client's own phrase, recovered.** §06's Monitoring stream says the
rangers record what changes *"so management decisions **and credit claims** both rest on evidence."*
That sentence is §08's thesis and it had been sitting two sections above it, unused, through three
redesigns. So each row now names the physical thing it rests on — two flux towers, four acoustic
recorders, the cultural heritage survey, the rangers' own skills, and for Rainbow Credits,
*nothing yet*. **§07 is the instruments; §08 is what they yield** — the page already contained the
apparatus one section earlier and no version had connected them.

**On brand, not on a wireframe.** A fourth note — *"it feels like a lo-fi when we're doing hi-fi"* —
closed three gaps at once:

- **Status is Marc's `Button / Blob`, stroke only.** No fill, 1.5px. A border-radius pill was
  generic UI, and a *solid* button would make an unconfirmed claim look like a commitment. Drawn,
  not filled, is the right weight for R14. All five are identical 246 x 44 blobs, right edge 1340,
  so the column scans.
- **The artist's work is the ground.** `Artwork / Ring B` at 9% top right, `Ring A` at 7% mid left,
  `Dots / Wave` at 11% along the bottom, and `Dots / Rule` used **whole** as the divider under the
  header. Ground, never furniture — no fragment is chopped out and repeated.
- **Every wireframe annotation left the canvas.** An audit found **7 visible flags on the whole
  page and 3 of them in §08**. All three are gone, along with the legend that explained the fill —
  a hi-fi should not need a key. They live in the note lane, which is what it is for. The two flags
  that remain page-wide (§04 ranger consent, §10 R15 registration numbers) are **content gaps the
  client must see**, not design commentary, and they stay.

**Ground rhythm.** §07 was already evergreen, so §07 + §08 now read as **one dark passage** — the
technical end of the argument — and §09 lifts back to bone for the ask. Three acts. A `Wave /
Divider` was considered at the bone-to-dark edge and **rejected**: the hard cut is stronger, and
Ivy's standing diagnosis is that vectors are what made the pages feel playful.

⚠ Still flagged for sign-off: the **standfirst**, the **WHAT IT RESTS ON** column, the **fill
levels**, and **R14** on every status label.

### The pacing pass, 29 Aug — §07 and §08 were reading as one section

Ivy: *"see the infrastructure and produces section in general — they are almost the same design.
the line dots, the text, the solid background colors... maybe thats why im having issues on the
produce section because a lot of info is there on two successions."*

That is the correct diagnosis and it reframes the whole §08 saga: §08 was never only §08's problem.
Two dense sections ran back to back sharing dotted rules, ruled text lines and a flat ground, with
no breath between them. **Her brief was explicit — not less information, less information *at
once*.**

**§07 · twenty-three facts, met four to eight at a time.** All twenty-three lines survive; nothing
was cut. The 3 x 2 grid becomes **two-up over three rows**, so you meet two systems instead of six,
with a **sticky index** at `x = 100` carrying the six labels — read at 55%, the current pair at
100%, still to come at 30%, gold marker on the pair you are in. The index is headed **`WHAT IT
TAKES`**, the client's own phrase lifted from this section's own lede three lines above it. It
replaced `SIX SYSTEMS` — engineering-speak, and an audit of all 50 caps labels on the page found it
was the **only** abstract one; everything else already reads in the client's register
(`OUR CHALLENGES`, `WHAT WE COULD LOSE`, `WHAT STAYS HERE`). It also sets up §08's
`WHAT IT ADDS UP TO`: what it takes, then what it adds up to. Block labels went from 12px caps to
**28px Baloo 2** so six systems are findable. Rows rise 20px and fade in over 500ms, blocks 120ms
apart.

⚠ **Sticky is not pinning.** The page's one pin belongs to §05 The Spring and is not spent twice —
`X3`'s budget is unchanged. §03's cluster labels already use sticky, so this is the page's own
device rather than a new behaviour, and the page's verb (**accumulates**) is what the index draws.

**§07b · a wordless breath.** A **420 full-bleed band, no caption**, between the two. §07 ends in
graders and flux towers; §08 opens on carbon registrations. Between them, `1.65.1` — a hand and a
seed head. *All that apparatus, for this.* A caption would make it an illustration; silence makes
it a hinge. Batch 1, no face, previously unspent, so nothing is asserted about who anyone is.

**The shared motif is split.** The artist's `Dots / Rule` now appears **once, in §07 only** — §08
gave it up and keeps the ring and wave artwork as *ground* instead. §07 is evergreen, two-up, ruled
and indexed; §08 is dark, full-width and typographic. They no longer rhyme.

**Cost: 1,925 → 2,040vh, against Truth's 2,229.** Worth stating plainly — the gap protecting Truth
has narrowed. It is defensible because the added height is *air and one photograph*, not cinema:
Living Work is still light-ground, still one pin, still no rail. **Density per screen is what
overwhelms, not total length** — the same twenty-three facts spread over more scroll read as
calmer, which was the entire brief. If the ratio has to come back, take it out of §03, not here.

### The notes lane is a spec, not a changelog

Ivy, on the §07 note: *"you talked about our conversation HERE — but the notes are for everyone to
describe how we want it to animate or transition."*

Correct, and the fault was page-wide rather than local to that note. Several Living Work notes had
drifted into narrating the redesign — *"the fault was pacing, not content"*, *"1.40.2 replaces the
smoking-ceremony frame"*, *"the stand-in was two children walking through scrub"*, and a footer note
titled **"three defects fixed"**, which is a commit message, not a design note.

**All twelve Living Work notes are rewritten to one shape**, and it is the standard from here:

1. **What it is** — structure and layout, present tense.
2. **MOTION** — the behaviours, with their IDs and numbers.
3. **⚠ What is held** — the sign-offs and unresolved content.

No history, no *was/now/replaces*, no defending a decision against an earlier version, and nothing
addressed to the designer rather than the builder. Where a reason genuinely constrains the build it
survives as a **constraint** — *"the photograph is identical across all eight and must stay that
way"* — not as an argument.

The notes got shorter for it: §07's dropped 682 → 430, §08's 892 → 787.

**Truth's 21 notes were audited against the same test and came back clean** — the drift was confined
to the notes written while iterating on Living Work.

### QA sweep, 29 Aug — copy against the draft, and geometry

A targeted pass: every substantive string on the page diffed against
`YACHATDAC-LivingWork-Copy-v3.md`, plus a geometric check for overlaps, clipping, margin breaches
and escaped content.

**Copy — 51 of 58 strings matched the draft verbatim. Seven did not, and four were real defects:**

| Where | Found | Fixed |
| --- | --- | --- |
| §01 lead | Authored. Dropped **the location** (120km north of Barcaldine) and **the 2019 buyback**, and asserted "run as a grazing station for a century" — the draft says *from the 1880s* | Rewritten from sourced facts only, keeping the tighter shape |
| §04 lede | A stray "the" before *fire-stick farming*, and the draft's last sentence — *"Training partnerships are being built so the jobs here can be filled from community"* — was missing | Restored |
| §06 stream 07 | *"Soil samples from the bore are held by QUT."* was missing | Restored |
| §08 Rainbow Credits | The brief to the client was cut after *"in your words"*, losing *what it is, what is measured, who it is for, and where it sits with the Rainbow Foundation* | Restored in full |

The other three are authored ledes (§03, §06, §09) and one CR3 rewrite in §06 stream 01. All four
are now **flagged in their notes as copy needing sign-off** rather than left to pass as draft copy.

**Geometry — one real collision and one workspace defect:**

- **§05 rest state contradicted itself**: the counter read `DAY 03` while the day-eight coda
  (*"Eight days in it held a puddle…"*) was on screen. The section now rests at **08**, which is
  what the note specifies and what the frame strip shows.
- **§04's lede ran into the strip counter** once it grew to three lines. 44px opened below it;
  section 1290 → 1334.
- **`HI-FI slot · 04 THE RECORD` was sitting 1,512px inside the Living Work frame's footprint** —
  the page had grown past it. Moved to `y = 70794`, aligned to its own row header. Every other row's
  slot checked and correct.
- Section layers were in append order rather than visual order; re-stacked 01 → 10 with the header
  instance on top.

**Clean:** no clipped text, no ink overlaps (the two bounding-box hits in §02 and §06 are empty
descender space, verified against `absoluteRenderBounds`), 12 notes with no stacking clash, four
frame strips with no collision, Truth untouched at 20064 / 29 children.

### Transition strips

A hi-fi frame shows a page at rest. It cannot show a scroll behaviour, so a
behaviour that only exists in a layer name is a design nobody can judge. The
answer is a **transition strip**: the same moment drawn as a run of real
1440 x 900 frames, one per state, with a caption and a scroll ruler under each.

| Strip | Row | x | Frames | Covers |
| --- | --- | --- | --- | --- |
| The aperture | Living Work | 9859 | 12 | §02 The numbers -> §03 Our challenges |
| Eight days | Living Work | **-6520** | 8 | §05 The Spring, days 01-08 |
| Four fill, one never does | Living Work | **-6520** | 5 | §08, the vessels filling on scroll |
| Six systems, two at a time | Living Work | **-6520** | 3 | §07, the rows accumulating with the sticky index |

`LIVING WORK - §05 THE SPRING - eight days` sits to the **left** of the page frame, top-aligned to
the section it documents. **The photograph is identical across all eight frames** — that is the
design (nothing changed for eight days) and also a necessity: `1.87.1` is the only usable
dry-country frame in either batch, and no photograph of a spring, a waterhole or water exists at
all. Only the counter moves, until day 08 lifts the scrim and the coda arrives.

`LIVING WORK - §02 -> §03 - THE APERTURE` sits in the Living Work row at
`x = 9859, y = 50842`, on a charcoal ground so it never reads as a page. It
spends **Y1** (image-in-type, one per site) and **C2** (shared-element handoff,
one per site) and records both. The built §02 is untouched: adopting the strip
grows it from 55vh to ~360vh, which is a separate reflow pass.

**Every route in `src/app` now has a frame.** Every frame's section heights sum
to its frame height exactly, every section name carries its span in `vh`, and
all 243 CTA and link nodes carry their destination as `→ /path`. Twenty distinct
destinations, every one of them a route that exists. Verified programmatically;
the overlap scan returns zero, as does the clipped-text scan.

### The canvas is deliberately quiet

The wireframes carried **66,700 characters of annotation** — about 11,000 words,
which read as "there is an enormous amount still to resolve" when the opposite
was true. That is now **6,100 characters, a 91% cut**, and the rule is simple:

> **Pink means one thing: a person has to fill this in.** Suzanne's wording, a
> name, a number, a permission, a status label. Nothing else is pink.

46 pink notes remain across ten frames, in 21 distinct messages. The ten SPEC
panels and the whole margin-note column are gone — their content is in
[`lofi-spec.md`](lofi-spec.md), in full rather than summarised.

### The header — Marc's geometry, D2's items

Built to Marc's `Navbar / 1 /` component (`127:5287`): 1440x130, 64px side
padding, container 1312x40, his own logo vector, nav links gap 32, actions gap
16, pill CTA. Items are D2's — Wonder · Truth · Living Work · The Record ·
About, with *Get in touch* as the button.

On nine frames. **Home carries none**, per D24, with a single line saying the
first navigation is section 05.

### Type — done, and the style names have changed

> ⚠ **This section records the old Exploration file.** Audited in YACHATDAC-V2 on
> 29 Aug 2026: **the font pass is complete** — the styles already carry the real
> faces, so the "flip eight families by hand" job described below is *done*.
>
> The names are different too. V2 uses `Typography/Desktop/H1…H6`,
> `Typography/Mobile/Heading 1…6`, `Typography/Tagline` and `Typography/Nav Link`
> — **not** `Display/96` / `Heading/64` / `Card Title/32`. Block Berthold covers
> **H1–H3 only**; H4–H6 are Bantayog Sans ExtraBold Alt; the tagline is GoodDog
> **Cool**. The desktop ramp is **96 / 56 / 40 / 36 / 20 / 14**, and it is the
> ramp that wins — the style-kit board and this document are what get corrected.
>
> The API warning below is **still live, and now sharper**: because the styles
> carry real Block Berthold and Bantayog Sans, no script can mutate a text node
> bound to them. Moving and renaming nodes is safe; editing text is not.

**The font pass is now a styles job.** Every headline, eyebrow, CTA and body
node in the ten frames is **bound to a text style**. Change the family on the
style and every node using it updates at once. Nothing has to be selected by
hand.

| Style | Set its font to | Currently | Nodes |
| --- | --- | --- | --- |
| `Display/96` | **Block Berthold** Regular | Work Sans SemiBold | 9 |
| `Heading/64` | **Block Berthold** Regular | Work Sans SemiBold | 58 |
| `Card Title/32` | **Block Berthold** Regular | Work Sans SemiBold | 116 |
| `Eyebrow/Section-24` | **Bantayog Sans** ExtraBold | Work Sans ExtraBold | 125 |
| `Eyebrow/Footer-12` | **Bantayog Sans** ExtraBold | Work Sans ExtraBold | 69 |
| `Nav & CTA/16` | **Bantayog Sans** ExtraBold | Work Sans ExtraBold | 237 |
| `Accent/Scroll-32` | **GoodDog Plain** Regular | Work Sans SemiBold | 1 |
| `Eyebrow/Hero-32` · `Nav & CTA/16 Bold` | as named | Work Sans | 0 — kit only |

**Each style carries the instruction in its own description**, visible in the
Figma styles panel, so it travels with the file rather than living in this
document.

`Body/*` and `Link/*` are **already correct** — Work Sans is the real body face.
Their descriptions say so. Do not change them.

⚠ **Do it in the Figma UI, on a machine with the fonts installed. Never through
the plugin API.** Figma cannot measure a font it cannot load, and Block
Berthold, Bantayog Sans and GoodDog Plain are all unavailable there. Setting
them from the API collapses every node to a 14px-tall box and the nodes then
cannot be repaired in place — that happened on 26 August and cost a full rebuild
of 108 headlines. It is the reason the styles ship pointing at Work Sans.

**What changed on 26 August to make this possible**

- The eight brand styles were **repointed to loadable Work Sans stand-ins** at
  matching weight, line height and tracking, so applying them is safe.
- **1,099 nodes were bound** — 615 headline-tier, 484 body and link. Binding
  moved nothing: not one frame changed height, because the stand-ins already
  carried each style's metrics exactly.
- **`Eyebrow/Footer-12` was created.** The kit had no 12px eyebrow, which is why
  the 69 footer labels had nowhere to point.
- **Eight nodes were mislabelled** — four `EB24 →` and four `CT32 →` that were
  actually 16px ExtraBold. Relabelled to `CTA16 →` rather than restyled, so the
  design is unchanged.
- **`__probe`** — a diagnostic style left behind by the earlier font
  investigation — was deleted.

**120 text nodes are deliberately unbound.** They are the annotation layer: the
Inter notes, the `[ held ]` slots and the 11–13px captions. They are not design,
and they should not take a brand face.

**Layer names still carry the prefix** — `D96 →` `H64 →` `CT32 →` `EB24 →`
`CTA16 →` `EB12 →` `Scroll32 →` — so the binding stays auditable at a glance.
They are now a record of what a node *is*, not a to-do list.

⚠ **Expect reflow when the real fonts land.** The stand-ins match on size, line
height and tracking, but Block Berthold and Bantayog Sans have different glyph
widths, so line breaks will move and some sections will change height. That is
normal and is hi-fi's business — but it does mean **the `vh` figures in the
frame names are measured against the stand-ins**, and want re-checking once the
faces are real.

### Still open on the frames

- **Living Work's five status labels** are unconfirmed (R14) and drawn in oxide.
  Rainbow Credits' body is empty.
- **Wonder stage 03 keeps a held story-wall image slot** — R10.
- **Our People** should not go to `in-review` until the consent question is
  answered. Eight of nine cards are unnamed. **The question now has an ID:
  `R24`** — it had none, and R10 does not cover it. The hi-fi is built so the
  gap is legible rather than hidden: a held person is a role at full weight and
  a gold rule where a name would be.
- **The Record's on-request response time** is the last unfilled field on that
  page (R23), owned by August per D10.
- **The Acknowledgement slot** is empty pending Suzanne (R1); ICN and ABN blank
  (R15).

## What wireframes must express

Motion is structural on this site, not a finishing layer. Two things have to be
decided at wireframe stage or they get retrofitted badly:

- **Scroll spans in `vh`, not `px`.** A pinned step-through needs ~320vh for
  four steps; a pinned panorama ~250vh; a standard section 100vh. If the span
  is not in the layout, the pin has nowhere to live.
- **Each screen's loud channel.** Under **F7 — the immersive mandate**
  (2026-08-29, supersedes F4's tiers and budget), motion is the default on every
  page; what a wireframe must mark is which ONE channel each screen turns up —
  **media**, **type**, or **transition** — with the other two quiet. CMS
  surfaces inherit the bounded standard kit (transitions, split-text reveals,
  hovers, media reveals), never hand-built signature modules.

**One verb per page — decided 29 Aug, extended under F7.** Truth *descends*: its
dissolves, breaks, darkening grounds and rail all encode chronology, so the motion is
the argument. Living Work *accumulates*: a working field notebook, quantities doing the
talking. Home *opens*. The Record *surfaces*: a catalogue that brings things up out of
itself. About *answers*: one question travels the page and everything on it is measured
against that question, including the photographs. Our People *gathers*: everything
on it converges — and the five held cards arrive in the same breath as the named
one and then hold still, which is how a page about people it may not name says so. Every remaining page is assigned its
verb when its v2 script is written. **Contrast between pages now comes from different
grammars, not from motion vs stillness** — do not carry Truth's grammar onto another page without asking what that
page's verb is.

⚠ **R10 extends to batch 2, and is untagged there.** `March22-2302` and the untitled
`March22` frame are story-wall material. They and the eight tagged batch-1 frames are
quarantined in `PHOTOS · Living Work`; that group is the only record of the batch-2 two.

Behaviours come from the sketch library in
`.claude/skills/yachatdac-motion/references/sketch-library.md`, by ID. Naming
the ID in the wireframe is what makes the handoff to front-end unambiguous.

## Reference sites

Sourced by Ivy from the GSAP showcase, confirmed by Marc as the design
direction:

- **Heritage** — the structural base for homepage sections
- **No Art Music**

> **Superseded 2026-08-29 by F7.** The two paragraphs below record the 18 Aug
> briefing's direction and are kept as history. August's directive of 29 Aug
> ("be more adventurous… STATIC is not our brand") replaces them: cinematic
> motion site-wide, governed by the Loud Channel rule. The v2 reference set is
> lumen-artspace.webflow.io, danu.ventures, pear.no, and GSAP Showreel 2025.

The client's Game-of-Thrones-style 3D map concept was assessed as too extreme
to implement and is not in scope. The agreed direction is more restrained:
static foreground, moving/changing background on scroll, fades rather than
drastic effects. The imagery and video are already strong enough — they do not
need heavy animation or gradients to land.

## Homepage vs inner pages

*(Superseded by F7 — see above.)* The homepage is the animation-heavy, visually
rich page, with an intro video/loading sequence in front of it. Inner pages stay
simple and straightforward. That split is deliberate and should be visible in
the wireframes.
