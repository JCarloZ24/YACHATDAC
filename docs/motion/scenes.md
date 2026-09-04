# The scene ledger

*Decided 30 August 2026. The third artefact — pacing, on paper, before it is pacing at 60fps.*

A film is not continuously intense, and heaviness only reads as heavy next to stillness. If
everything moves, nothing moves.

Read this top to bottom before building. **If it reads flat on paper it will read flat at
60fps** — and reading flat on paper is exactly what August was pointing at.

## How to read a row

```
# | act | what it says in one line | intensity 1-5 | vh | LOUD CHANNEL | plate | rest after?
```

The **loud channel** column is the one the brief does not have, and it is the one that makes
"too flat" a thing you can see. F7's pacing law: every screen declares ONE loud channel —
**media**, **type** or **transition** — and keeps the other two quiet.

Scan the column down a page. A column reading `type · type · type` is a flat page. Four `media`
in a row is a noisy one. Neither is a matter of opinion once it is written down.

## The rules this ledger is checked against

- **No more than two consecutive scenes at intensity 4–5.** Break a longer run with a rest
  scene, not by softening the heavy ones.
- **A rest scene is a real scene** — one line, one image, or one silence, held. It is where the
  previous scene lands. It cites the `hold` row of the grammar like anything else.
- **The heaviest scene gets the longest hold.** Weight is time, not volume.
- **No channel three times running.** If it happens, the middle one changes channel.

---

## Home — verb *opens* — 1775vh, 8 sections

Built to `00 · Home — HI-FI · Desktop · the opening` (Figma `2381:7027`, 15974px = 1775vh),
which supersedes the lo-fi's 903vh / 7 sections. The lo-fi spans remain the copy and structure
contract in `docs/design/lofi-spec.md`; the spans below are what was drawn.

| # | Act | What it says | ⚡ | vh | Loud channel | Ground | Rest after? |
|---|---|---|---|---|---|---|---|
| 01 | I | Reconnection — Country is already here | 5 | 140 | **media** | full bleed, `1.3.1` | ✓ hold |
| 02 | I | Wonder — the oldest sunrise you will ever stand under | 4 | 260 | **media** | full bleed ⟡ stand-in | — |
| 03 | I | **THE DRAIN** — 1861 to 1902, and the photograph withdraws | 5 | 520 | **type** | one plate → bare charcoal | ✓ pinned 340 |
| 04 | I | Belonging — some of us never left | 4 | 240 | **media** | full bleed `1.74.2`, `frame` grade | — |
| 04b | — | **BREATH** — one photograph, no words | 1 | 60 | **none** | `1.14.1`, held | ✓✓ |
| 05 | V | The Invitation — three ways in, the first navigation offered | 3 | 200 | **transition** | bone; three `Card / Truth` | — |
| 06 | V | The Way Forward — the one ask | 2 | 220 | **type** | evergreen; four `Card / Story` | ✓ |
| 07 | — | Footer — custodianship, stated plainly | 1 | 135 | **none** | charcoal + artwork band | — |

**Reads as:** media · media · type · media · none · transition · type · none. No channel three
times running; the two consecutive `media` screens at 01 and 02 are the permitted maximum and 03
breaks them.

**§03 is the page's argument, made in the image channel.** One frame of Country — `1.28.1`, the
plain, no people and no cultural site — runs behind the whole 1861–1902 sequence and is never
replaced, only withdrawn. The scrim ramps, the ground walks evergreen → roasted → oxide →
charcoal, and by *"By 1902 there were thirty-seven of us left"* the plate is at zero: bare
charcoal, no artwork, the only screen on the page with nothing behind the words. The pin then
releases on a **different** frame at full weight. The device is withdrawal, not spectacle —
nothing depicts violence, and no photograph illustrates a massacre.

⚠ **The drain is an editorial device with a cultural reading and is for Suzanne / EAG sign-off.**
Recorded on the ledger board in the Figma notes lane, not only here.

**Where the withholding lives:** 01–04 carry no navigation at all (D24). That is Act I's whole
argument and it is structural, not a motion choice.

**Every card, glyph, wave and band on this page is an instance of the built kit**, not a
lookalike. §05 runs three `Card / Truth` (`2051:2728`) at native 362 × 574 — grounds evergreen /
charcoal / brown, glyphs circle / starburst / boomerang, with the coverflow entry drawn on its own
strip. §06 runs four `Card / Story — no image` (`2212:3122`) at 286 × 352; those four are
**detached**, because the component is 362 wide, four of those do not fit 1240, and instance
children refuse to resize. Their grounds alternate charcoal / brown — evergreen cards disappear
into §06's evergreen ground, which is why Living Work's equivalent section sits on bone.

**The artwork is ground, never furniture.** Rings run at 7–8% scaled 1.5–2.2× past native and
bleeding off an edge; `Dots / Trail` — the kit's own *homepage meander* — at 9% across §05;
`Dots / Wave` at 9% on §06 only, since its spec calls it the footer band; `Dots / Rule` used whole.
Opacity is driven from **one level only**: `Artwork / Ring A/B` bake 8% onto their inner vector, and
setting instance opacity as well is what renders Living Work's background rings at 0.68%.

**Two `Wave / Divider` hand-offs, not four.** Both `flip=down`, 1442 × 151 at `x = -1`, seated at
`sectionHeight − 105` so they overhang the join by 46px — the technique measured off every built
instance in Truth and Living Work. §03 → §04 takes no wave because the returning photograph is the
transition; §04b takes none because a divider through a 60vh held photograph contradicts the hold;
§06 takes none because the shared footer already carries its own Burnt Ochre wave.

## Truth — verb *descends* — 2229vh, 21 sections

The descent proper. Scroll advances time here; the rail is the chronology.

Spans below are measured off the built hi-fi (`02 · Truth — HI-FI · Desktop · the descent`,
Figma `2051:4176` at x=0, 1440 × 20,064px = 2229vh). A full-cinema ALT was proposed beside it at
x=16200 on 30 Aug 2026 and **was not approved**; it and its strips have been removed. This page is
the build target.

| # | Act | What it says | ⚡ | vh | Loud channel | Plate | Rest after? |
|---|---|---|---|---|---|---|---|
| 01 | II | Intro — the opening shot, and the door from Home | 4 | 117 | **media** | plate · wide | — |
| 02 | II | Ahead — the Cultural Knowledge Precinct | 3 | 120 | **type** | diptych | — |
| 03 | II | Partnerships — a guest on Country | 2 | 62 | **type** | `Card / Truth` | — |
| 04 | II | TODAY — the fire comes toward you | 5 | 100 | **media** | plate · wide | ✓ hold |
| 05 | II | TODAY montage — the work going on | 3 | 114 | **media** | field of four | — |
| 06 | II | 2022 — the site studied with its owners. Nothing moves here | 1 | 84 | **none** | — | ✓ |
| 07 | II | Research & discovery — a strip pulled across | 2 | 72 | **type** | evidence strip A | — |
| 08 | II | BREAK · Country now — you never see the join | 4 | 100 | **transition** | dissolve pair | ✓ |
| 09 | II | 2026 — the deed of grant | 4 | 116 | **media** | plate | — |
| 10 | II | 2020 — the name goes back | 3 | 104 | **transition** | diptych | — |
| 11 | II | 2019 — this beat is private | 2 | 107 | **type** | diptych | ✓ |
| 12 | II | **2003 — Suzanne's father. The portrait is held** | **5** | 116 | **media** | portrait 460×613 | ✓✓ hold |
| 13 | II | 1950s — the light goes out | 3 | 123 | **transition** | ⟡ held doc slot | — |
| 14 | II | BREAK · The escarpment — the film goes cold | 5 | 100 | **media** | dissolve pair | ✓ hold |
| 15 | **III** | **THE HARD STOP — the count. No photograph, no motion** | **1** | **104** | **none** | — | ✓✓ the longest hold on the site |
| 16 | IV | 1840s — what Mitchell recorded | 3 | 135 | **type** | ⟡ held journal scan | — |
| 17 | IV | Older than the record — the engraving wall | 2 | 69 | **none** | — | ✓ |
| 18 | IV | Still to be found — open research | 2 | 72 | **type** | evidence strip B | — |
| 19 | IV | About 100 million years ago — the Eromanga Sea | 3 | 161 | **transition** | strata stack | — |
| 20 | IV | Underneath all of it — the descent ends, looking up | 5 | 129 | **type** | dissolve pair | ✓✓ |
| 21 | — | Footer — the wave overlaps the last shot by 96px | 1 | 135 | — | — | — |

**Reads as:** no channel runs three deep. §10 carries the brown wave hand-off and is therefore
`transition`, which is what breaks the 09/10/11 run. The four 5s — 04, 12, 14, 20 — are never
consecutive, and §15 at ⚡1 is the rest after §14.

**The rail carries the chronology.** One frame (`2051:5368`) runs the full 2229vh, starting below
the header and **breaking at the count**. Both strands are instanced from Leonard Mickelo's
supplied meander — never redrawn, never chopped, never tiled. The only moving part is a **gold
mask whose height is the scroll position**, travelling over artwork that is itself static.

**The ground falls.** Colour is not repainted per section; it ramps down the ladder — evergreen
*living present* → roasted brown *the return* → charcoal → navy *before the record* → charcoal
*deep time* — with Marc's `Wave / Divider` as the visible seam at **five** hand-offs: evergreen
after §01, brown after §09, charcoal after §14, navy after §15, charcoal after §18. Each is seated
at `sectionHeight − 105` so the 151px wave overhangs the join by 46px, and each carries the colour
of the section it *introduces*. **Rust Red is spent once**, on the count, and nowhere else on the
site.

**Scene 06 is deliberately intensity 1.** The Figma note on that beat says it in as many words —
*"the page stops moving here, on purpose."* Story-wall material is withheld under F3.

**Scene 15 is the turn** (`spine.md` §5) and gets the longest hold on the site. Suzanne's
testimony, words not reproduced, no photograph, no motion, under **R5**. The lo-fi specifies a
genuine scroll lock with a keyboard escape; under `prefers-reduced-motion` the lock is **not
created** and degrades to a full-viewport band the reader scrolls through normally, rail broken
either side.

**Scene 17 carries no photograph as built.** That was originally a hard constraint — every
engraving frame in its pool was ⛔R10 quarantined — and it is **no longer.** Ivy released
story-wall and cultural-site imagery at `frame` grade on 30 Aug 2026 (`permissions.md`), so the
screen *may* now carry a held frame with its story in words. Until that photo pass happens the
screen stands as built: carried by type, coda at 40px, on bare navy.

## Living Work — verb *accumulates* — ~1607vh, 9 sections

Built to `03 · Living Work · HI-FI · the field notebook` (Figma 2137:2613, 18407px ≈ 2045vh).
Spans below are the built ones; the hi-fi's extra height is content that has not been cut down
yet, and the two should be reconciled before this page is signed off.

| # | Act | What it says | ⚡ | vh | Loud channel | Plate | Rest after? |
|---|---|---|---|---|---|---|---|
| 01 | V | Field notes from Turraburra — the country being brought back | 5 | 100 | **media** | P1 | — |
| 02 | V | **THE APERTURE** — the 0 is a portal onto the plain | 5 | 300 | **type** | — | ✓ pinned |
| 03 | V | Our challenges — the ground thins under you as you read | 3 | 330 | **transition** | — | — |
| 04 | V | Iningai Rangers — the human centre, on dark ground | 4 | 100 | **media** | P1 | ✓ |
| 05 | V | **THE SPRING** — eight days, counted | 5 | 150 | **media** | P8 | ✓ pinned, snapped |
| 06 | V | The work — seven streams, and what it takes | 3 | 360 | **media** | P5 | — |
| 07b | V | **BREATH** — held, no caption | 1 | 47 | **none** | P8 | ✓✓ |
| 08 | V | What the work produces — five vessels, four filling | 2 | 120 | **none** | — | — |
| 09 | V | Get involved — three paths | 2 | 100 | **type** | — | — |

**Reads as:** media · type · transition · media · media · media · none · none · type.

⚠ **§04, §05 and §06 are three `media` screens running.** That breaks the no-channel-three-deep
rule. It is survivable because §05 pins and snaps — a pinned counter reads as its own kind of
screen rather than as a third helping of the same one — but it is the weakest stretch of the
page and the first thing to fix if the page reads noisy. The honest fix is to move §06 to
**transition** and let the sticky index carry it, since the streams' images are already
inheriting the bleed from §04.

**The 5s:** §01 and §02 are consecutive, which is the permitted maximum of two, and §03 drops to
3 immediately. §05 is the third 5 and sits well clear of them.

**§07b BREATH is the page's hinge** and the reason §06 and §08 both land. 47vh of one
photograph, no caption, nothing moving. The composition declares `channel: "none"` and the
build fails if anything loud is added to it — the only screen on the site where stillness is
enforced by the compiler rather than by discipline.

## The Record — verb *surfaces* — ~2050vh, 7 sections

Built to `04 · The Record — HI-FI · Desktop · the record surfaces` (Figma `2463:8492` at x=0,
1440 x 14,612px). The frame is 1,624vh; the scroll span is ~2,050vh because §02's three breakouts
pin 100vh each (+300) and §03 pins 300vh against 174vh drawn (+126) — the same convention as
Living Work §02 and §05, where the frame height is the composition and the span is the scroll.

The only catalogue page on the site: thirteen entries, eleven documents, a gaps section and a
subscribe block. Under F7 that makes it a CMS surface, which gets the full standard kit as a
bounded set an editor cannot break.

**Revised 30 Aug 2026 on Ivy's review.** Two sections were removed. The filter deck categorised
the entries a second time — TYPE appeared as pills there and again as the sticky index beside the
grid — so the controls moved into the rail and the deck went. The empty state was a dead 50vh
screen; it now lives on the filter strip, inside the sequence that produces it, with D25's link
intact. The back half of the page darkens.

**Two axes, two channels.** D21 settled that the source axis is *"an epistemology, not a format —
who says so"*. The page gives each axis its own channel and never explains either in words:

- **TYPE is position** — the sticky rail in the left lane. Stories 5 · Historical accounts 3 ·
  Research 2 · Documentation 2 · Recordings 1, summing to the thirteen the count reports. If those
  two ever disagree the page is lying about its own contents.
- **SOURCE is colour** — the card ground. Iningai knowledge `#22372b` · Colonial record `#4e3524`
  · Published research `#122449`. The rail's SOURCE keys are the legend and the control at once.

| # | Section | ⚡ | vh | Loud channel | Plate | Rest after? |
|---|---|---|---|---|---|---|
| 01 | Intro — what is known about this Country | 4 | 100 | **media** | full bleed | — |
| 02 | **The grid — the rail is the filter, three breakouts** | **5** | 738 | **media** | 3 x full bleed | — |
| 03 | **What we do not know — the page's one pin** | **5** | 174 → 300 pinned | **type** | navy ground | ✓✓ |
| 04 | Documents — the draft's own list, 4 downloadable | 3 | 229 | **type** | — | — |
| 05 | Items marked "on request" — held, dark run begins | 2 | 78 | **none** | — | ✓✓ |
| 06 | The record grows — dark run ends | 4 | 170 | **media** | full bleed band | — |
| 07 | Footer | 1 | 135 | — | — | — |

**Reads as:** `media · media · type · type · none · media · —`. No channel three deep. The two 5s
now sit next to each other because the empty state that separated them is gone, but §03 is
type-quiet against §02's media, so the pair reads as a change of register rather than two loud
screens in a row. §05 is the rest before §06's closing media beat.

**§02 is the signature.** 738vh, and the section Ivy asked for: a sticky presentation scroll that
is still a working catalogue. The rail is **sticky, not pinned** — a pin would take the scroll
away from someone browsing, which is exactly wrong for a CMS surface.

Two signals share the rail's column and must never be confused. **Weight is selection** and
changes only when a row is pressed; the **ochre tick is position**, scroll-driven and read-only.
That separation is what lets one column carry a filter and an index without either lying.

Three entries break out of the grid and take the screen, one per source, and come back. Two are
photographs; card 12 has no photograph in the draft, so it takes the screen as **type** on navy
with the 480-metre bore drawn to scale and the pollen marked at sixty. That is the page's verb at
its most literal.

The breakout is **`escape`** — `handoff` made reversible. It flies a clone and leaves the real
cell at opacity 0, so the grid never reflows and the card returns to exactly where it was. Pinned
100vh, `country` 0.9s on enter, reversed on leave-back. **Never scrubbed:** Flip measures at
trigger time. The revision needed no new effect beyond it.

**§03 is the emotional centre**, and it is the page's second ground change. It sits on **navy
`#122449`** — the same ground the rail gives published research — with `Artwork / Ring B` bleeding
right at 15% and `Artwork / Ring A` bleeding bottom-left at 13%, both static instances of the
supplied components. The section that names the open questions and hands off to *research with us*
is the one section carrying the research ground, so the colour is an argument rather than a
decoration. It stays type-quiet inside that ground: no media, no plate, one pin. §02 has just spent
738vh on photographs and three full-bleed screens; if the section where the archive admits its own
edges were loud in a second channel too, the admission would read as another feature. X3 pinned
step-through, snap 1/3. The rule that opens the questions is `Dots / Rule` with the plate cleared
and the dot vectors recoloured to canvas — leaves recoloured, never the container.

Copy on navy measures 5.2:1 (gold eyebrow), 6.3:1 (body at 0.78) and 8.9:1 (headline and the active
question). The 0.28–0.35 states are the pin's out-of-focus steps and reach full weight at their own
step; they are transient by construction, not copy sitting at that ratio.

It ends on **one** thing: the section's own CTA as a `Button / Blob`, directly under the last
question. An earlier pass put a restated question row and two document cards there and it diluted
the moment — four questions have already made the case, and the button is the only thing that
should follow them. The Record names **which four questions are open**; Truth's `#opportunities`
entry and the Partnerships page carry the pitch and share the destination, so this section hands
off rather than competing with them.

**§04 is the draft's own list format, at hi-fi scale.** Title-led rows across the full column with
the deck beneath, meta and the action on the right — exactly the structure the lo-fi drew. What the
hi-fi adds is scale and the kit: 28px Baloo titles give the rows air, `Dots / Rule` carries the two
group dividers instead of a hairline, `Artwork / Ring A` sits behind at 30% on its roasted path —
the off-white path was invisible on canvas, so the frame recoloured it rather than dimmed it — and the four downloads
are `Button / Blob`. The state of a document is said by its action — **Download** or **In
preparation** — which is how the draft says it. The two group headings replace a 3px progress bar;
a meter has no business on a page with a standing no-odometer rule.

**§05 and §06 are the dark run.** §05 is a stated stillness exception under F7: charcoal, held, no
photograph. Giving the withheld material a picture would perform the withholding, and would put a
face on material whose whole point is that it is not simply available. The ground stays dark
through §06 and an off-white wave hands it into the footer. Before this revision the only wave on
the entire page was §01's; §04 → §05 and §05 → §06 were hard colour cuts. The page now carries
**five** `Wave / Divider` instances — §01 → §02 canvas, §02 → §03 navy, §03 → §04 off-white,
§04 → §05 charcoal, §06 → footer off-white — each seated at its section's height minus 105 so the
151px wave overhangs the join by 46. §02's closing hairline went with the change: a wave that ends
the grid and a rule that ends the grid are the same sentence twice.

**§06 carries the back half's only photograph.** §03, §04 and §05 run 415vh of type between them,
which is the longest stretch on the site without an image; §06 opens on a 440px full-bleed band of
the work being done, which is exactly what its own copy claims — *"new material goes up as the work
happens"*. Copy over it measures 8.24–14.99:1.

**What people still hold is a row of four coloured plates.** The four categories — photographs,
station records, family papers, clippings — run across the full 1240 column at 298 wide, grounds
alternating evergreen `#22372b` and roasted `#4e3524`, each carrying one of the artist's four glyph
motifs (circle, starburst, boomerang, slot) and its line verbatim. Four labelled slots read as the
shape of what is being asked for; four bullet rows read as a paste. The ask — `Button / Blob`,
*Tell us what you have* — sits directly beneath the row.

Navy is deliberately absent from that rotation: on the charcoal dark run a navy plate measures
1.26:1 against the ground and simply disappears. Evergreen and roasted clear it.

They cannot be photographed. The shoot covered Country and Rangers and holds **no archival material
at all** — no documents, letters, maps, albums or clippings — which is a content gap worth
commissioning, recorded here rather than worked around silently.

**Artwork is static everywhere it appears.** `Artwork / Ring B` at 15% and `Artwork / Ring A` at
13% behind §03's navy, `Artwork / Ring A` at 5% behind §04, `Artwork / Ring A` at 7% and
`Dots / Wave` at 9% behind §05, `Artwork / Ring B` at 8% behind §06 — all instances of supplied
components, and the darker the ground the higher the hold, because the ring vectors are canvas. `permissions.md`
records no artwork-motion permission, so none of it moves.

**The count is swapped, never counted.** No odometer on the filter count, and nothing in the
documents register counts up.

**Cards 02, 07 and 09 carry story-wall imagery at `frame` grade**, released by Ivy 2026-08-30 —
superseding the ⛔R10 markers those three cards carried in the lo-fi. Cards 06 and 12 have no
photograph in the draft and carry its own marker verbatim; the band flattens rather than the card
shortening, so the absence is visible instead of tidied away.

**Wherever the copy names a person, the photograph beside it does not show one.** Card 01 and
Breakout A both use open Country for that reason: their copy names Suzanne Thompson, and a person
in that frame would caption them into a role.

**⚠ One copy discrepancy.** `src/content/resources.ts` reads *"What does fire-stick farming
actually do?"*; the lo-fi (`2033:3339`) and the hi-fi both read *"right-way fire"*. The lo-fi is
authority for a hi-fi, so the frame stands and the content file is the one to reconcile.

## The scrub exceptions, marked

Per `spine.md`, scroll advances time in exactly three places. Everywhere else it reveals:

- **Home 03** — THE DRAIN, pinned 340vh. Scroll advances the 1861-1902 sequence, and the
  photograph's withdrawal is bound to it. This replaces the lo-fi's A2 sky clock, which put
  static content over a moving sky and could not give each sentence its own entrance.
- **Truth 01–20** — the descent, the rail, the chronology. The rail's gold mask is bound to
  scroll position; the artwork under it never moves.
- **Living Work 05** — THE SPRING. The hi-fi is explicit: "counter · X3 scrubbed 1→8, **the
  only place scroll controls time**" on that page. Eight days a spring ran, one per step,
  snapped so the reader is never stranded on a day that does not exist.

Any other scrub on any other screen is a mistake, not a variation. Note the distinction that
keeps this honest: plenty of screens are *scrubbed* — grounds ramp, plates parallax, apertures
open — but only these three use scroll to advance **time**. Scrubbing a texture is not the same
as scrubbing a chronology.

## Cultural material in this ledger

On The Record, cards 02, 07 and 09 and Breakout B carry `frame`-graded story-wall material on a
page that is otherwise a working catalogue. The grade is what makes that safe: the plate, ground,
scrim, type and the sticky rail animate at full weight around them and the image plane does not move.

Scenes 12, 14 and 17 carry `frame`-graded material — the portrait, the escarpment, the engraving
wall. The world moves around them: grounds sweep, wave dividers hand colour across, type comes
over the top, scrims carry the legibility. The record itself holds still.

**Scene 17 has no photograph as built** — the wall is carried by type on bare navy. The reason has
changed and the ledger should say so: it was a quarantine, and it is now a photo pass that has not
happened. Ivy released story-wall and cultural-site imagery at `frame` grade on 30 Aug 2026, so the
wall may be shown as a still photograph with its story in words. The ⛔R10 prefixes still carried on
the Figma pool boards are stale. Scene 15 is different and unchanged: it has no photograph because
Suzanne's testimony is withheld under **R5**, which no one has waived.

Scene 12 is a portrait of a real person. It is held at 460 × 613 in its **native aspect**: a
16:10 full bleed would mean cropping that photograph, which is a photo-pass decision and not one
this ledger makes. Frames are described by what they show, never by who the person is, and no
section captions a person into a role.

That is the deliberate design, not a limitation working around one.
