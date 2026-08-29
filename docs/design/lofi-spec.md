# Lo-fi wireframe spec

*Companion to the Figma file. Last updated: 26 August 2026.*

**The canvas is deliberately quiet.** Everything that used to sit on it as a
spec panel or a margin note lives here instead. What remains on the frames is
only what a person still has to fill in — a name, a number, a permission, a
wording from Suzanne — drawn in pink so it cannot be mistaken for finished copy.

> **How to read a frame.** Section names are the handoff contract:
> `NN Title · [sketch IDs] · NNvh`. Spans are always in `vh`, never px, on a
> basis of 900px = 100vh. Every frame's section heights sum to its frame height
> exactly. CTAs carry their destination in the layer name as `→ /path`.

**File:** [Yachatdac Exploration](https://www.figma.com/design/Qk35pAX0sz2ntNRXceY7Gb/Yachatdac-Exploration)
· one page · ten frames in site order at a pitch of 2220, all top-aligned.

| Page | x | vh | Sections | Verb (F7) |
| --- | --- | --- | --- | --- |
| [Home](#home) | 0 | 903 | 7 | *opens* |
| [Wonder](#wonder) | 2220 | 1363 | 14 | TBD |
| [Truth](#truth) | 4440 | 1704 | 21 | *descends* |
| [Living Work](#living-work) | 6660 | 992 | 9 | *accumulates* |
| [The Record](#the-record) | 8880 | 1155 | 10 | TBD |
| [About](#about) | 11100 | 1091 | 11 | TBD |
| [Our People](#our-people) | 13320 | 820 | 9 | TBD |
| [Partnerships](#partnerships) | 15540 | 433 | 5 | TBD |
| [Connect](#connect) | 17760 | 393 | 6 | TBD |
| [Legal](#legal) | 19980 | 265 | 6 | TBD |

---

## Site-wide

### Motion doctrine — F7, the immersive mandate (supersedes F4)

**Motion is the default on every page** (client directive 2026-08-29 — decision
F7 in `decisions-and-risks.md`). Each page carries a motion script — entrance,
scroll choreography, transition out — governed by the **Loud Channel rule**:
every screen declares one loud channel (media, type, or transition) and keeps
the other two quiet. Spans are still documented in vh; the 60fps target and the
media budgets are the limits. The old tier split and two-signature-moment budget
are superseded. The per-page notes below describe the v1 lo-fi as built — it
stays live at the current routes while the v2 immersive pages are built
alongside them under `/v2`.

`X4` entry stagger remains the baseline for quiet screens: start `top 82%`,
`once: true`, y16 + fade, 60ms stagger. `X6` reduced-motion twin ships with
every behaviour — the same timeline at duration 0, final state y0 / opacity 1,
no pins created. **Never a slowed variant.**

`X5` legibility scrim is required on every full-bleed band carrying copy. It is a
readability requirement, not decoration: test at least 4.5:1 against the
*brightest* frame, not the average.

### The header — D2, Final 26 Aug

Wonder · Truth · Living Work · The Record · About, with **Get in touch** as a
button to `/connect`. Connect is retired from the navigation and kept as a
destination — both the v2 and v3 client drafting rounds independently produced
this shape while linking to `/connect` from a dozen places.

Geometry follows Marc's `Navbar / 1 /` component: 1440x130, 64px side padding,
container 1312x40, logo 135x40, nav links gap 32, actions gap 16.

**Not on the homepage** — D24 holds blocks 01 to 04 with no navigation at all.
The first navigation offered is section 05, The Invitation.

### The footer

Rebuilt to v3's four purpose columns — *Pages / Organisation / Get in touch /
Follow* — replacing Marc's five columns by pillar. All 160 links carry
`→ /destination` in their layer names.

- **The Acknowledgement slot is deliberately empty.** Marc's hi-fi footer carries
  Northern Territory wording, which is the wrong jurisdiction (**R1**). Suzanne
  is a Traditional Owner, so a genuine Welcome to Country in her own words is
  possible here — do not fix it by substitution.
- Artwork band and dotted divider are **supplied assets** from Leonard Mickelo,
  already vectorised. Static — no motion permission is recorded.
- The newsletter field is **inert until R9 clears**. Marc's hi-fi carries
  unmodified Relume boilerplate in Roboto here; that is placeholder, not copy.
- ICN and ABN are blank (**R15**).
- **Right margin fixed, 26 Aug.** The nav row's five fixed-width children summed
  to 1252 inside a 1240 content box, and the credits row to 1257 — so on **all
  ten frames** the *Follow* column and the social line sat 12–17px past the right
  margin and the social list rendered clipped. The four columns are `FILL` now
  and the legal row's gap is 24; every footer terminates at exactly 1340.

### Type — a styles job, not a selection job

Every headline, eyebrow, CTA and body node across the ten frames is **bound to a
text style**. Changing the family on a style updates every node using it.

| Style | Set its font to | Nodes |
| --- | --- | --- |
| `Display/96` | **Block Berthold** Regular | 9 |
| `Heading/64` | **Block Berthold** Regular | 58 |
| `Card Title/32` | **Block Berthold** Regular | 116 |
| `Eyebrow/Section-24` | **Bantayog Sans** ExtraBold | 125 |
| `Eyebrow/Footer-12` | **Bantayog Sans** ExtraBold | 69 |
| `Nav & CTA/16` | **Bantayog Sans** ExtraBold | 237 |
| `Accent/Scroll-32` | **GoodDog Plain** Regular | 1 |

Each style says the same thing in its own description, in the Figma styles
panel. `Body/*` and `Link/*` are already the real face and are marked correct.

⚠ **In the Figma UI only, with the fonts installed — never through the plugin
API.** Figma cannot measure a font it cannot load; the three brand faces are all
unavailable to the API, and setting them there collapses every node to a 14px
box that cannot then be written to at all. That is why the styles ship pointing
at Work Sans stand-ins matched on weight, line height and tracking.

1,099 nodes bound, and **not one frame changed height** when they were — the
stand-ins already carried the metrics. 120 nodes stay unbound on purpose: the
annotation layer, which is not design.

Layer-name prefixes — `D96 →` `H64 →` `CT32 →` `EB24 →` `CTA16 →` `EB12 →`
`Scroll32 →` — are kept so the binding is auditable, but they are a record now
rather than a task list.

⚠ **The `vh` figures are measured against the stand-ins.** Block Berthold and
Bantayog Sans have different glyph widths, so line breaks and section heights
will move when the real faces land. Re-check the spans then.

### Constraints that do not lift

- Cultural sites never move. Leonard Mickelo's artwork is static — no motion
  permission is recorded.
- Story-wall / Marra Wonga imagery is **unavailable** pending permission
  (**R10**). Affected slots are drawn HELD and must not be filled in hi-fi.
- No generated Aboriginal iconography — no concentric circles, dot fields,
  meandering paths, U-shapes or animal tracks.
- No heritage coordinates anywhere, including comments and source.
- Story-wall dating is **disputed** (**R2**). Render from a content field, never
  a literal; the era marker reads `{ story-wall-dating }` for that reason.

### Open, and whose

| Item | Whose |
| --- | --- |
| **D9** — who signs off motion | Marc, August |
| **R10** — story-wall imagery permission | Elder Advisory Group, via Marc |
| **R1 · R2 · R5 · R15 · R22** — wording, dating, testimony, legal name, language | Suzanne / EAG |
| **R13 · R14 · R23** — Wonder inclusions, status labels, four copy details | August |
| **R3 · R4 · R12** — font licences, logo vectors | Brand team |
| **D8 · D11** — backend priority, hosting accounts | David |

---

## Home

**Route** `/` · verb *opens* · **903vh** · 7 sections · frame `2:3`

Spans: 100 + 83 + 250 + 84 + 146 + 137 = 800vh, plus a 103vh footer.
Sections sum to 8129px exactly.

### The two signature moments

**A2 — sky coupled to content, pinned 417vh.** A page-length sky colour ramp
with a light source on an arc. The three narrative beats advance on the same
clock at 0.00 / 0.33 / 0.66 with overlapping fades. Beat 2 carries v3's
four-step 1861 to 1902 sequence and holds 250vh of that pin. Content layer
static, background moves — the agreed *static foreground, moving background,
fades not drastic effects* direction. The pin spans beats 02 to 04.

**M2 — frame expand, on the Wonder beat.** `clip-path: inset()` opens while the
image counter-scales 1.3 to 1. Moved here on 26 Aug: v3 deletes the standalone
Living Work beat that used to carry it, and Wonder is the stronger of the two
remaining beats that still hold media.

Supporting, not signature: `X1` honest loader · `X2` scroll cue · `X5` legibility
scrim · `B5` type that settles · `L1` radial emanation + `L2` scale triad on the
Invitation cards · `L4` dark ground · `X4` entry stagger · `X6` reduced-motion
twin.

**X6 reduced motion** — the A2 pin is *not created*. The three beats become three
static sections in normal document flow (83 / 250 / 84vh), the sky ramp holds at
its midpoint, and beat 2's four steps stack as ordinary content. M2's clip-path
opens at duration 0. Thread fill jumps rather than tweens.

**X5 is required** on blocks 01, 02, 04 and 05 — every full-bleed band carrying
copy.

### Notes

- **No navbar in blocks 01 to 04.** D24, Final. The first navigation is section
  05. Marc's hi-fi and the sitemap both show a persistent navbar; built to the
  copy draft, which argues that withholding navigation *is* the page's argument.
- **The thread is a plain vertical rule.** `C1` is on hold — *a meandering line
  with waypoints reads as iconography*. Do not curve it, do not add waypoints.
- **Copy diverges from Marc's hi-fi in five places** and the copy draft wins
  under **D5**: the Belonging headline, the Truth headline, the four eyebrows,
  the Invitation headline, and the hero carrying no eyebrow. Do not "correct"
  these back to the hi-fi.
- **L4 dark ground** is listed as supporting but is *not* expressed here — this
  lo-fi is light-ground greyscale. L4 is a site-wide decision to confirm before
  the component library is committed.
- ⚠ **Page padding is 100 here; the built hi-fi uses 64.** One value must win
  before component work starts.
- Block 04 imagery is unlabelled — no names, no captions. Naming people is Our
  People's job.

---

## Wonder

**Route** `/wonder` · verb TBD · **1363vh** · 14 sections · frame `2:5`

Rebuilt to v3 on 26 Aug: 8 sections became 13, plus the header. The draft adds a
fact strip, three highlight cards, Getting here, Turraburra, Where you sleep,
What it is like out here, and a closing CTA. No section pins — every span is
content-driven, so the figure documents the height rather than reserving scroll.

**One offer, not a listing grid.** No booking flow, no itinerary.

### 156vh cut, 26 Aug

*Why we say guesting*, the standalone *first night* band, and the heading and
lede of *What a stay looks like* were all drawn from `src/content/lofi/wonder.ts`
— the prototype namespace — and appear in **no draft**: *"You'll be hosted, not
toured"*, *"welcomed on by the people"*, *"Country sets the days, not a
timetable"*, and *"A labyrinth of weathered caves and blowholes"*.

Section 06 is now the draft's six named stages, verbatim: Arriving · The first
night · Walking out to the wall · Older than the wall · Out for food · Hands in
the work. The first night is stage 02 rather than a band of its own, which is
where the draft puts it.

### The two closing sections merged, 26 Aug — 1419vh → 1363vh

*Take it with you* had been drawn as its own 62vh band — eyebrow, 64px headline,
one line of copy and a **Download PDF** button — immediately above *Come and see
it*, which carries **Download the brochure** as its secondary CTA. The same
brochure, twice, in consecutive sections.

The draft nests them: `### Take it with you` contains `#### Come and see it`, and
`src/content/wonder.ts` already merges them into a single `wonderClose` object.
The wireframe was the only place they were siblings. The band is now one section
carrying the eyebrow, the headline, the four facts, the brochure line and both
CTAs — which is what the code renders.

### Held

- ⛔ **Stage 03's image slot** is story-wall material — HELD under R10. The hold
  survived the section rebuild; the permission does not travel with a redraw.
- ⚠ **What's included** — R13. Every line needs confirming before publishing, and
  the draft says so itself: *"the most common reason an enquiry does not
  happen."* There is no published pricing and the closing note says why.
- **Block 11, Stories from out here** — three posts. v2 specified
  editor-selected; v3 specifies a hybrid (three most recent tagged `#lore` /
  `#country` / `#guesting`, editor can pin the first slot, falls back to most
  recent overall). Drawn as editor-selected; the divergence is unresolved and
  drives the component API.
- Pending change requests: **CR6** adds rail via Rockhampton to Getting here.
  **CR7** may retitle *No town glow* to *Magic at night*. **CR9** may rename the
  page to *Be our guest*, which would also rename the homepage Invitation card
  pointing here.

---

## Truth

**Route** `/truth` · verb *descends* · **1704vh** · 21 sections · frame `143:2`

The descent — 00 Intro through *Underneath all of it* — carries both full-bleed
breaks and the hard stop.

### D20, Final — and carried further by v3

D20 replaced four uncommissioned card grids with one closing band. v3 then went
further: the draft ends on the descent and writes the tail's content elsewhere,
so the closing band went too. **235vh cut on 26 Aug.**

⚑ **This reversed a recorded decision, and it was raised late.** Build
documentation §4 puts *Partnership opportunities* on Truth, and
`src/content/lofi/truth.ts` says in as many words that **"Retaining it is a
decision."** D20 overturned that, and D20 was itself only recorded Final on
26 Aug — during this work, not before it. Ivy had said at the start of the
Figma pass that *"the spec homepage and truth proposed are final"* and asked to
be told what conflicts arose. The tail was cut without that being brought back.

**Reviewed on 26 Aug after the fact, and the cut stands** — Ivy's call, with the
tail's content intact in `src/content/lofi/truth.ts:240-273` if it is ever
wanted back. The frame carries a one-line note saying so, so the absence reads
as a decision rather than an oversight.

*Where this goes* declared itself **SPEC — COPY NOT COMMISSIONED** on its own
face, and all three of its research opportunities were already drawn twice — as
*Still to be found* above, and again on the Partnerships frame. *Partner with us*
was an enquiry form, which R9 forbids until the legal pages exist.

Why the original tail went, in the words of `src/content/truth.ts`: *"NO SOURCE
COPY EXISTS. The copy document ends at the Wattanuri entry, so roughly a fifth of
this page is uncommissioned … Retaining it is a decision."* The uploaded sitemap
had already dropped half of it, and The Record draft now writes real copy for the
same content on `/resources`.

And it read wrong. The descent ends on Wattanuri — *"Lore is not a date. It is
the floor everything above has been resting on the whole way down."* Putting four
filterable grids underneath the floor contradicts the structural claim the page
has just made about itself.

### One `#partner` anchor

v3 puts Partnerships near the top as a card whose CTA leaves for `/connect`, and
that is what `/truth#partner` resolves to. About and Our People both route
*"Research or partnership"* there, and both land on that card.

### The floor is Wattanuri, not the seabed

v3's last entry is *All of this was under water* — about 100 million years ago —
and it has no Wattanuri entry. This frame keeps Wattanuri underneath it, because
*lore is not a date, it is the floor* is the page's whole argument and the rail
has encoded it since the first screen. Ending on the seabed would make the
deepest thing on the page a geological fact rather than a living one.

**A deliberate departure from the draft.** D5 gives the drafts copy, not
sequence. The lore-floor consequence line is marked **SPEC — COPY NOT
COMMISSIONED** on the frame.

### Rails

- **Rail A** — persistent from the first screen, **stops at the hard stop**.
- **Rail B** — resumes below the hard stop, **ends with the descent at
  Wattanuri** rather than running to the foot of the page. If the rail *is* the
  descent, it should not continue past the floor. Agenda item 18, answered
  *accept* on 26 Aug.

### Held and binding

Governance circle **held by community**. Elder Advisory Group endorsement
required. Suzanne's testimony withheld pending her sign-off (**R5**) — the hard
stop carries it, which is why that one Tier 1 exception routes to her rather than
shipping under the motion character. Story-wall imagery unavailable (**R10**).
Dating disputed (**R2**).

**The hard stop keeps its specified behaviour:** no rail, no markers, nothing
else on screen, and no way past it. The viewport is held.

⚠ **R22** — `truth.ts` recommended framing the enquiry form with
Ngapartji-Ngapartji, which is Western Desert language rather than Iningai.
Cutting the form does not answer R22; ask Suzanne before that framing is used
anywhere.

---

## Living Work

**Route** `/living-work` · verb *accumulates* · **992vh** · 9 sections · frame `2:9`

Structure follows v3 exactly: hero, thirteen expandable challenges, Iningai
Rangers, the work as seven named streams, infrastructure and technology as six
blocks, what the work produces as five status cards, get involved.

`#how-we-built-this` resolves to the **infrastructure** band, which is what the
built page does.

### 562vh cut, 26 Aug

*Why we are publishing this* and an eight-step *How we built this* were drawn
from `src/content/lofi/living-work.ts` — the prototype namespace — rather than
from the client's draft or JC's modules. The v3 draft has no such section.

Two details in the cut copy appear in **no source document**: *"about twenty
hours of grader time"*, and the claim that black ash *"is a biochar in its own
right"*. The draft says only that rangers look for black ash rather than scorched
ground, and lists a grader under Machinery with no hours against it.

Everything else in it was real but already drawn twice — fire, springs, seed,
fencing and monitoring are all in section 04; the towers and recorders are in
section 05.

⚠ **The *what travels / what stays here* framing died with that cut.** It is a
knowledge-sovereignty device rather than decoration, and it is worth finding a
home for. It has none in v3. Three of the eight steps read *"WHAT STAYS HERE —
nothing restricted here"*, which was a real component state, not an empty cell.

### D19, Final — answered by v3

The 24 Aug draft carries **both** the three get-involved paths — *Ranger
exchange · Fund the work · Land management services* — and *Get the work in your
inbox* underneath. The either/or D19 was written against no longer exists. CTAs
are the draft's own: *Get in touch*, *Partner with us*, *Enquire*, all to
`/connect`.

**Do not refer to this as "D3"** in any panel that lists sketch IDs. D3 is the
FAQs decision *and* a Tier 1 sketch ID (depth-map parallax).

### Held

- ⚠ **All five status labels are unconfirmed (R14)** and drawn in oxide:
  *Registration underway · Building the record · In progress · Being developed*.
  They are public claims about carbon registration, biodiversity credits, IPA
  designation and Native Title.
- **Rainbow Credits' body is empty** — *for YACHATDAC to write*.
- ⚠ **Rangers are unnamed across the site.** A full list is needed, with consent
  to be named and photographed.
- Pending change requests: **CR5** is a *layout* question routed to Ivy — SWER
  and the fuel tanks would unbalance the Power block's three short bullets in a
  four-column grid. **CR2** may retitle the Carbon card *Biological
  Sequestration*, a longer string in a fixed card. **CR3** may sweep *cool burns*
  / *right-way fire* to *fire-stick farming*; stream 01 already uses it and the
  rest of the site does not.

`L3` hand irregularity is permitted here — seeded jitter of 40ms or less and 2px
or less, deterministic, never random per load.

---

## The Record

**Route** `/resources` · verb TBD · **1155vh** · 10 sections · frame `133:2`

Route and nav label stay **Resources** per D1; the page titles itself *The
Record*, which is what every v3 page calls it when it links here.

⚠⚠ **Governance circle: shared with care.** This page carries Iningai knowledge
entries and defines the *items marked on request* gate that routes cultural
material to the Elder Advisory Group. It needs the cultural gate, not only
editorial sign-off.

### D21, Final — two facet axes

Filtering is on **type AND source**. The source axis is the stronger idea: *who
says so* — the community, the coloniser, or the journal — is the same distinction
the Truth page is built on, and it is what makes this a record rather than a blog
archive. Every item already carries `source` in the code.

**Event and Update return** to the type list, because dropping Event contradicted
the settled position that there is no separate Events page *because* Event is a
content type inside Resources. Neither has a published entry yet. **Activity is
deliberately not re-added** — nothing in any draft distinguishes it from Event.

### D25, Final — the empty state

*"Nothing here yet under that. Try another subject, or ask us what exists."* The
second half links to **Do you hold something?** further down the same page, not
to `/connect` — that block is already the inbound-contribution route, and Connect
has no form (R9).

### Notes

- **13 entries**, all with real titles and decks from the draft. Two shipped
  without a photo and are drawn as typographic cards rather than given a grey box
  — the grid has to survive a mixed-media collection.
- ⛔ **Three cards are Marra Wonga / story-wall material** and their image slots
  are HELD (R10). Do not let hi-fi fill them.
- Filtering re-flows the grid. That is a state change, not a scroll animation.
- **Seven of the eleven documents are "in preparation"** and one is dated 2031.
  Publishing the shape of the record before the record exists is a deliberate and
  quite strong editorial position — but it needs a real status treatment, not a
  greyed-out download. Drawn as a status pill.
- ⚠ **Five-year review shows 2031 twice** — once as the meta line, once as the
  status pill, because the export collapsed two fields into `20312031`. Every
  other row is meta + status. The status probably wants to read *Committed*.
  Left as the draft has it: a question for the copy owner (**R23**), not a
  wireframe fix.
- ⚠ **The "on request" gate describes a process that does not exist yet** — the
  Elder Advisory Group is not yet sitting. Tense and response time both need
  resolving before publish.
- **Headline convention:** section headlines are the draft's own opening
  sentence, split out of the paragraph that follows. Sections 05 and 07. The only
  punctuation change on the page is *"— usually"* becoming *"Usually"* in 07.

---

## About

**Route** `/about` · verb TBD · **1091vh** · 11 sections · frame `115:2`

Source: `docs/content/drafts/about/YACHATDAC-About-Copy-v1.md`, 21 Aug 2026.
Governance circle: open. Copy is the draft's, verbatim.

Drawn as a standalone About that absorbs Contact, per the uploaded sitemap rather
than build documentation section 4. Section 09 is the sitemap's Contact page
folded in, which is why it carries both the contact block and the four-way
router.

**Headline convention:** section headlines are the draft's own opening sentence,
lifted out of the paragraph that follows — only the sentence boundary and its
capitalisation change. Sections 02, 04, 06, 07, 08 and 09. **Section 05 is the
exception:** the draft gives it no opening sentence, so the headline slot is
deliberately empty rather than filled with something invented.

The four cards in section 04 are the site's four pillars, and the fourth is the
interesting one — *Research and the record* points at `/resources`, which this
draft calls The Record.

### Held

- ⚠ **R15** — the organisation's own legal name is unconfirmed. The logo and the
  published research differ on **Yambangku / Yumbangku**, and
  `src/content/site.ts` hardcodes Yambangku into the footer and page metadata on
  every route. Confirm against the ORIC register, not the logo. ICN and ABN are
  blank.
- ⚠ **R22** — the reciprocity value is framed as Ngapartji-Ngapartji, which is
  Western Desert language, not Iningai. The draft raises this itself.
- ⚠ **R12** — no approved partner logo files exist, and the draft asks whether
  each partnership is still active. Every slot is a marked placeholder. A lapsed
  partner logo on an About page is worse than an empty grid.
- ⚠ **Tense** — the Elder Advisory Group is **not yet sitting**, and the draft
  says so on its own face. Everything about it stays future tense. This is the
  same group whose endorsement Truth and The Record both wait on, so it is a
  delivery dependency, not only a copy note.
- ⚠ **Three of the seven values** in the Strategic Plan appear here; the draft cut
  the other four.

---

## Our People

**Route** `/our-people` · verb TBD · **820vh** · 9 sections · frame `222:1996`

Drawn new on 26 Aug — neither designer had a frame for it and four inbound links
point at it: the homepage Belonging CTA, About's *Meet the people*, and the
footer's Organisation column. Source:
`docs/content/drafts/connect/YACHATDAC-OurPeople-Copy-v1.md`.

⚠⚠ **Eight of nine people cards are held.** Five team roles and three board seats
have no name, and **consent to be named and photographed has not been recorded
for any of them.** The frame establishes the card shape and the grid. It is not a
directory and must not be filled from a draft.

⚠ **This page should not go to `in-review` until the consent question is
answered.** Governance circle: shared with care.

### Notes

- The **ATSI advisory line sits above the eyebrow**, as its own block. That is
  the draft's own placement and it is not decoration.
- ⚠ **Tense** — the Elder Advisory Group is not yet sitting.
- ⚠ **The acknowledgements list is partial** — four of six entries transcribed.
  Every name needs checking against the buyback recording, and **Suzanne decides
  on naming people who have passed.**
- ⚠ One entry may be the same person recorded elsewhere as *Uncle Winston
  Forrester*. Confirm.
- ⚠ Suzanne's external roles are incomplete — a national emissions reduction board
  and possibly others.

---

## Partnerships

**Route** `/partnerships` · verb TBD · **433vh** · 5 sections · frame `225:1996`

Drawn new on 26 Aug, deliberately minimal. **D22, Final** — the page exists. Four
live links point at it: the homepage Way Forward, the footer's Get in touch
column, Truth's *Still to be found* card, and The Record's *What we do not know*.
Left undrawn, all four would reach hi-fi as dead ends.

**This page has no draft** — the only one of the three new routes the client has
not written. It invents nothing: the research opportunities are the client's own
words, reused from The Record's *What we do not know*.

**D7** makes this a candidate home for fee-for-service land management, which
currently sits on Living Work and whose audience is neighbouring landholders.
Not moved — that is a separate decision someone should take deliberately.

---

## Connect

**Route** `/connect` · verb TBD · **393vh** · 6 sections · frame `239:1996`

Drawn new on 26 Aug. **The most-linked destination in the project** — twelve
inbound links from Truth, Living Work, The Record, About and Our People — and it
had no wireframe.

It invents nothing: the four *ways in* are Living Work's *Get involved* section
verbatim, and the contact block is the one About and Our People both carry word
for word.

⚠ **No enquiry form, here or anywhere on the site.** R9 and build documentation
section 11 require the Privacy Policy and Terms to exist before any form collects
personal data, and all three legal bodies are still held. The frame draws the
absence rather than a greyed-out form.

⚠ **Every contact detail is a placeholder**, including `info@yachatdac.com.au`,
which looks real and is not. The square brackets are the drafter's. Six held
rows, no live-looking values, no `mailto:`.

⚠ **Turraburra has no reliable mobile coverage.** If a phone number is published,
say which hours it is answered (**R23**).

**Fixed here:** the shared contact router sent *Ranger exchange* and *Something
for the record* to `/connect` — links back to the page itself. Retargeted to
`/living-work#rangers` and `/resources`, matching what `connect/page.tsx` already
routes to, and the same fix went into `src/content/contact.ts`.

### The page carried its four routes twice — 446vh → 393vh

*Ways in* (section 02) and the router inside the *Get in touch* block (section
04) were **the same four destinations**, and they disagreed: *Ways in* sent
research to `/partnerships`, the router sent it to `/truth#partner`. Section 04's
headline *"Different things go to different people."* also repeated the hero
standfirst word for word.

Section 04 is now the contact details alone — eyebrow, the five detail columns,
the R23 note. *Ways in* keeps the four routes, in the fuller words it already
had.

**In code**, `ContactBlock` gained a `showRoutes` prop and `/connect` passes
`false`. About, Our People and Partnerships are the only pages that render the
router, and they are unchanged — on those three it is the only place the routes
appear, which is correct. `contactRoutes`' research destination moved to
`/partnerships`, the page that exists under **D22**.

---

## Legal

**Route** `/legal/privacy` · `/legal/terms` · `/legal/cookies` · verb TBD ·
**265vh** · 6 sections · frame `242:1996`

Three routes drawn as one frame because they are one template — the shape is
`src/components/layout/LegalStub.tsx`: eyebrow, title, and a bordered *awaiting
content* panel carrying the reason. Drawing them identically is the point; three
separate frames would read as three unfinished pages.

### D4, Final on labels and routes

Three namings were in circulation: build documentation said *Terms of Use* and a
cookie/consent notice; the sitemap said *Terms & Conditions* and *Cookie Policy*;
the homepage copy draft footer said *Terms of Service* and *Cookie Settings*. D5
gives the drafts authority over copy, so the draft's labels stand.
`/legal/terms` keeps its route so no inbound link breaks, and `/legal/cookies`
was created — the footer had linked it on every page with nothing behind it.

⚠ **Final on naming only. The content is not ours to write** — R9 requires legal
review rather than internal drafting, and the analytics setup that governs the
cookie wording is still pending. All three bodies stay visibly held.

⚠ *Cookie **Settings*** implies a consent preferences dialog, not a policy page.
Those are different things and both may be wanted. Flagged rather than resolved;
it needs the analytics decision first.

**Why this matters beyond legal:** R9 blocks every form on the site until these
exist. The newsletter field, Truth's cut enquiry form and Connect's absent one
are all downstream of this frame.
