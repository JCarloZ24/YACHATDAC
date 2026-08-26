# Lo-fi review — agenda and answer sheet

**21 August 2026 · internal · Marc, August, Ivy**

Eighteen questions, ordered the way the wireframes will be walked rather than by
owner, so the list tracks what is on screen. Every row carries its decision ID —
answers written here go back into
[`decisions-and-risks.md`](../decisions-and-risks.md) afterwards, flipping each
entry from **Proposed** to **Final** and writing the answer into *The decision*
rather than starting a new one.

⚠ **There is no Figma equivalent.** This sheet previously said the same eighteen
items were mirrored on a **⧉ Review board — internal · 21 Aug 2026** page in
[Yachatdac Exploration](https://www.figma.com/design/Qk35pAX0sz2ntNRXceY7Gb/Yachatdac-Exploration).
Checked 26 Aug: that file has one page and no such board. The eighteen items live
only here.

## ⚑ ANSWERED IN FULL, 26 AUGUST

**Sixteen of the eighteen are answered below. Two are not, and deliberately so.**

The meeting this sheet was written for has not happened, hi-fi starts on 28
August, and five of these rows were marked **⚑ BLOCKS HI-FI** — 01, 02, 07, 10,
15. Waiting was going to cost more than deciding. So Ivy and JC worked the board
on 26 August and answered everything that is a **design, layout, IA or taxonomy**
question, wrote the reasoning into each answer, and pushed it into
`decisions-and-risks.md` as **Final**.

**Any of these can be overturned in one line.** They are recorded with their
evidence precisely so that a person who disagrees can see what was weighed and
say so.

**What was NOT decided, because it is not ours:**

| # | Item | Whose |
| --- | --- | --- |
| 03 | **D9** — who signs off motion | Marc, August. A governance role, not a design call. |
| 09 | **R10** — story-wall imagery | Elder Advisory Group, via Marc. A cultural permission. |

The same line was held inside the answers: no history, dates, names, quantities,
permissions or legal text was invented. Where the wireframes carried an
unsourced fact, it was **removed**, not softened — see the fact audit in
[`../design/README.md`](../design/README.md).

Open decisions in `decisions-and-risks.md` go from **twelve to two**.

Full context and options for every item are in `decisions-and-risks.md`.

---

## Site-wide

### 01 · D1 — Blog and Resources: one thing or two?  ⚑ BLOCKS HI-FI
*Marc, with Ivy* — The sitemap has Blog as a top-level area alongside Resources;
the build documentation has one unified collection with Resources as the hub. The
new draft calls the same page **The Record**, which is a third name. Nav, the
wireframes and David's content model all wait on this.

**Answer: already Final (20 Aug).** One page, routed and labelled **Resources**;
every v3 page titles it *The Record* on the page itself. No further action — this
row should not have still been open.

### 02 · D2 — Does Connect survive as a nav item?  ⚑ BLOCKS HI-FI
*Marc* — About and Contact are lifted to top level in the sitemap, leaving Connect
thinner. The new About draft absorbs Contact entirely, yet still links `/connect`
three times. Affects the header and footer on every page.

**Answer: Final (26 Aug) — retire Connect from the navigation, keep `/connect`
as a destination.** The header becomes **Wonder · Truth · Living Work · The
Record · About**, with *Get in touch* as a button. Two independent client
drafting rounds produced exactly this shape while linking to `/connect` from
twelve places — which says Connect is somewhere people are *sent*, not somewhere
they browse to. Implemented as `primaryNav` and `primaryAction` in
`src/content/site.ts`; `pillars` is untouched and still drives the footer
columns. **This answers 14 (D23) and 16 (D22) in the same move**, because
Connect's children move out to pages of their own.
*Decided by Ivy and JC in Marc's absence, with hi-fi starting 28 Aug. One line
to override.*

### 03 · D9 — Who signs off motion decisions?
*Marc and August* — Marc, the board, or the Elder Advisory Group, and at which
milestone. Unblocks R10 and the artwork/terrain permissions rather than being a
separate ask. Several behaviours are on hold waiting for a named approver.

**Answer: split. The design half closes; the approver does not, and is not ours
to name.** Which behaviours ship is a design question and it is settled: the
Tier 1 exceptions on non-cultural furniture — the Truth rail and its
scroll-driven behaviour — are confirmed under the *grounded* motion character
already settled on 20 Aug. Any exception on cultural material stays blocked: the
hard stop carries Suzanne's testimony, and that routes to her with R5 where it
was always going.
**Who signs off motion is still open.** Assigning a governance role to a real
person is not a design decision. Still with Marc and August.

### 04 · D10 — Copy ownership per page
*Marc and August* — Raised at the 18 Aug briefing, still open. Six drafts now
exist with no recorded author, and R23 is four small copy questions that have gone
unanswered purely because no page has an owner.

**Answer: already Final (20 Aug).** August owns the copy on every page. This
also answers 06 — see below.

### 05 · D7 — Where fee-for-service land management lives
*Marc and August* — A real revenue stream in the Ten-Year Plan (Goal 3.5) whose
audience is neighbouring landholders, matching none of the three pillars. The
sitemap marks it NOT YET PLACED. If D22 creates `/partnerships`, that may be its
home.

**Answer: already Final (20 Aug).** Fee-for-service land management sits under
Living Work, and is done in v2. It surfaces on the page today as *Land
management services* in the Get involved band.

### 06 · D3 — FAQs: scope, ownership, CMS or static
*Marc, with David* — In the sitemap footer, nowhere in the build documentation. No
spec, no content model, no named author.

**Answer: Final (26 Aug) — the author is August.** Scope and CMS-vs-static were
already Final on 20 Aug; the only thing left open was the author, and D10
already says August owns the copy on every page. There was no separate question
here, just an unfilled field.

---

## Home

### 07 · D24 — Persistent navbar, or no nav until block 6?  ⚑ BLOCKS HI-FI
*Marc, with Ivy* — The copy draft says blocks 1–5 carry no navigation and that
this **is** the page's argument. Marc's hi-fi and the sitemap both show a
persistent navbar. Built to the draft. Changes the header on every page, not just
the homepage. Flagged in `hifi-figma-readout.md` §2 on 20 Aug and unowned until now.

**Answer: Final (26 Aug) — no navigation until The Invitation.** The copy
draft's position is that withholding navigation for the opening blocks *is* the
page's argument, and that is an argument rather than an oversight. Confirmed by
Ivy on 26 Aug. The lo-fi draws it: Home is the only one of the ten frames with
no header band, and it carries an annotation saying where the header appears.
⚠ **The code does not implement this yet.** `SiteHeader` still renders
persistently over the hero. It is a scroll-driven change in a shared layout
component, so it is recorded in that file and handed to whoever owns the header
rather than done here.

### 08 · F2 / F3 — confirm these stay on hold
*August, with Ivy and JC* — The homepage thread is a plain vertical rule (F2) and
the Truth beat is typographic (F3). Both are interim positions held because there
is no final homepage design. The cultural constraints under them — sketch C1 on
hold, story-wall imagery unavailable — do **not** lift when a design arrives.
Confirming, not reopening.

**Answer: confirmed on hold (26 Aug).** The homepage thread stays a plain
vertical rule and the Truth beat stays typographic. Both are interim positions
held because there is no final homepage design, and the cultural constraints
under them — sketch C1 on hold, story-wall imagery unavailable — do not lift
when a design arrives.

---

## Wonder

### 09 · Block 04 — the escarpment card describes the story wall (R10)
*Marc and August → Elder Advisory Group* — The card's copy describes Marra Wonga
directly. Story-wall imagery is unavailable pending permission, so the block is
built typographically. Confirm that stays until a permission is recorded.

**Answer: stays open — and stays typographic until a permission is recorded.**
Not ours. A cultural permission belongs to the Elder Advisory Group, via Marc.
Confirmed on the frames: the story-wall image slot is drawn HELD on Wonder stage
03 (*Walking out to the wall*), and the hold survived a full rebuild of that
section on 26 Aug — the permission does not travel with a redraw.

---

## Truth

### 10 · D20 — What follows the Truth descent?  ⚑ BLOCKS HI-FI
*Marc, with Ivy* — The five blocks below the timeline were never commissioned;
`truth.ts` says so on its own face. The sitemap already drops half of them, and The
Record draft now writes the same content for `/resources`. The proposal replaces
four card grids with one closing band and keeps the `#partner` form. Drawn as
**Truth — v2 PROPOSED**. Knock-on: two nav children retarget to `/resources`.

**Answer: already Final (26 Aug)** — one closing band, `#partner` kept.
⚑ **Carried further by v3, 26 Aug.** The v3 draft ends on the descent and writes
the tail's content elsewhere, so the closing band went too. *Where this goes*
declared itself SPEC — COPY NOT COMMISSIONED on its own face, and all three of
its research opportunities were already drawn twice. *Partner with us* was an
enquiry form, which R9 forbids until the legal pages exist. Both cut, 235vh.
That is D20's reasoning carried to its end rather than a reversal of it — and it
resolves the two-`#partner` collision without guesswork: one anchor, v3's card
near the top of the page.

### 11 · Tier 1 behaviours on a Tier 2 page
*JC, with Marc* — F4 makes Tier 1 homepage-only. Truth uses the rail and the hard
stop's viewport hold, both Tier 1. Recorded as an exception request pending D9.
Settle D9 first (item 03), then confirm.

**Answer: confirmed, on the non-cultural half.** See 03. The rail and its
scroll behaviour ship as recorded exceptions under the grounded character. The
hard stop's viewport hold is on Suzanne's testimony and goes to her with R5.

---

## Living Work

### 12 · D6 — Keep or cut "The parts that are not in the annual report"
*Marc and August, with the client* — The failure section: broken grader, failed
bore pump. Written for practitioners, who find failures more useful than
successes; may sit badly with a government funder reading the same page. Built as
one removable section so it can be cut in a single move.

**Answer: already Superseded.** The v2 draft cut the failure section and v3 does
not carry it either. Nothing to decide.

### 13 · D19 — Living Work's closing CTA
*Marc, with Ivy* — The build spec names newsletter signup. The copy draft ends on
**"Talk to us →"** and **"Come on Country →"**. The pillar's audience is other
Indigenous communities — the draft offers them a conversation, the spec offers
them a mailing list. Recommendation: keep the draft's two endings, move the
newsletter to the footer band every page already carries.

**Answer: Final (26 Aug) — and v3 answered it, not us.** D19 asked whether the
page ends on the build spec's newsletter or the copy draft's two endings. The 24
Aug draft carries **both**: three get-involved paths — *Ranger exchange · Fund
the work · Land management services* — and then *Get the work in your inbox*
underneath. The question was written against a draft that has since been
replaced.
The lo-fi had still been drawing the v2 ending. It now draws v3, with the
draft's own CTA labels: *Get in touch*, *Partner with us*, *Enquire*.

---

## About

### 14 · D23 — Is `/our-people` a route?
*Marc* — The draft's "Meet the people →" points there. Build documentation §4 has
The YACHATDAC Team and About Suzanne Thompson as two separate items under Connect.
Third thing pulled out of Connect after About and Contact — answer alongside 02.

**Answer: Final (26 Aug) — yes, `/our-people` is a route.** Built, drawn, and
linked from About and the homepage Belonging beat. Falls out of D2: Connect's
children move to pages of their own.

---

## The Record

### 15 · D21 — One facet axis or two?  ⚑ BLOCKS HI-FI
*Marc, with David* — The draft filters on **type AND source** (Iningai knowledge ·
Colonial record · Published research). The code has one flat list and no source
concept at all. Event, Activity and Update are dropped, contradicting "Event is a
content type inside Resources". The source axis is an epistemology, not a format —
*who says so* is the same distinction the Truth page is built on.

**Answer: Final (26 Aug) — adopt both facet axes, and put Event and Update
back.** The source axis is the stronger idea and it is already implemented:
every item in `src/content/resources.ts` carries `source`, and the browser
filters on it. So this was confirmation, not new work.
**Event and Update return to `recordTypes`.** Dropping Event contradicted the
settled position that there is no separate Events page *because* Event is a
content type inside Resources — which left events with nowhere to live. Neither
has a published entry yet; they exist so the first one has a home rather than
forcing a schema change later.
**Activity is deliberately not re-added.** Nothing in any draft distinguishes it
from Event, and a facet nobody can tell apart from its neighbour is worse than
one fewer facet.

### 16 · D22 — Does `/partnerships` exist as a destination?
*Marc and August* — The draft's "Research with us" points at
`/partnerships/#research-opportunities`, a route that exists nowhere in the
project. This is item 10 seen from the other end; answer them together or both
pages will assume the other is carrying it. Bears on 05.

**Answer: Final (26 Aug) — yes, `/partnerships` exists.** Built, drawn, and four
live links already point at it. Answered with D2 and D20, as the entry always
said it should be.

### 17 · D25 — Where does "ask us what exists" go?
*Marc* — The draft writes its own empty state: *"Nothing here yet under that. Try
another subject, or ask us what exists."* The second half is a real offer with no
destination. Candidates: the Connect contact form, or the "Do you hold something?"
block further down the same page.

**Answer: Final (26 Aug) — it links to *Do you hold something?* on the same
page.** That block is already the inbound-contribution route, and keeping a
reader on the page they are searching beats sending them to a contact page that
has no form (R9). Implemented: `browserCopy.emptyCta` in `resources.ts`, and the
contribute block now carries the `id` it points at.

---

## Truth — v2 PROPOSED

### 18 · Rail B shortened — accept or revert?
*Marc, with Ivy* — In the proposed version the rail ends with the descent at
Wattanuri rather than running to the foot of the page. This is the one change in
v2 that is a design opinion rather than a documented gap: if the rail *is* the
descent, it should not continue past the floor. One line to revert.

**Answer: accept (26 Aug).** Rail B ends with the descent at Wattanuri. Recorded
against **D20**, which went Final the same day — the v2 frame is now simply
`Truth`, and the earlier frame has been deleted.

---

## Routed elsewhere — not settleable in this room

The output for these is **who asks, by when** — not an answer.

| To | Items |
| --- | --- |
| **Suzanne / Elder Advisory Group** (via Marc) | R1 Welcome to Country wording · R2 story-wall dating · R5 testimony sign-off · R10 imagery permission · R15 Yambangku/Yumbangku + ICN/ABN · R22 Ngapartji-Ngapartji |
| **Brand team** | R3 Block Berthold webfont licence · R4 Bantayog Sans licence · R12 logo vectors and Good Dog Cool |
| **David** | D4 legal page naming · D8 backend build priority · D11 hosting accounts · R8 DGR status · R9 legal pages before forms · R11 media size targets |
| **Copy owner** — August (04 / D10 is Final, so this is no longer blocked) | R23 — phone-answering hours · on-request response time · the doubled 2031 status · the Precinct's evidence tag |

**Actions, 26 August:**

1. **Marc** — name a motion approver (03 / D9), and review the sixteen answers
   above. Overturning any of them is one line.
2. **Marc → Elder Advisory Group** — the story-wall imagery permission (09 /
   R10). Until it is recorded, Wonder stage 03 keeps a held image slot.
3. **August** — R23's four copy details. D10 is Final, so these have an owner
   now. One of them, the on-request response time, is the last unfilled field on
   The Record.
4. **Whoever owns the header** — D24 is Final but `SiteHeader` does not implement
   it yet. The homepage should have no navigation until The Invitation.
5. **Suzanne** — R1, R2, R5, R15, R22 are unchanged and still on the critical
   path. Nothing here touched them.

---

## Settled — do not reopen

- **D2** — Connect is retired from the nav and kept as a destination (26 Aug).
- **D3** — FAQs are CMS-managed; August is the author (26 Aug).
- **D4** — legal labels and routes: Privacy Policy · Terms of Service · Cookie
  Settings. **Naming only** — the content is still held under R9 (26 Aug).
- **D19** — Living Work ends on three get-involved paths plus the newsletter,
  because v3 carries both (26 Aug).
- **D21** — two facet axes; Event and Update return, Activity does not (26 Aug).
- **D22** — `/partnerships` exists (26 Aug).
- **D23** — `/our-people` is a route (26 Aug).
- **D24** — no homepage navigation until The Invitation (26 Aug).
- **D25** — the empty state links to *Do you hold something?* (26 Aug).
- **D5** — the drafts govern copy; the wireframes govern design.
- **D12** — homepage copy is CMS-editable; design, motion and section structure stay in code.
- **F4** — motion tiers; Tier 1 is homepage-only, two signature moments total.
- **F5** — only Work Sans is tracked in git.
- **F6** — local dev runs on port 3001.

---

## After the meeting

1. Type the answers into this file.
2. Move each into `decisions-and-risks.md` — status **Proposed → Final**, answer
   written into *The decision*, reasoning kept attached to the outcome.
3. Update `open-questions.md` to match.
4. Only then revise the wireframes.

---

## ID renumbering, 25 August 2026

The decision and risk IDs on this sheet moved on 25 Aug. They were written as
D13–D19 and R13–R15 on a branch while `docs/change-requests.md` independently
took D13–D18 and R16–R21 for the FNAN review round. That file is written to be
pasted into Proyekto, so its numbering stands and these moved:

| Was | Now | | Was | Now |
| --- | --- | --- | --- | --- |
| D13 | **D19** | | D18 | **D24** |
| D14 | **D20** | | D19 | **D25** |
| D15 | **D21** | | R13 | folded into **R15** |
| D16 | **D22** | | R14 | **R22** |
| D17 | **D23** | | R15 | **R23** |

**The 01–18 item numbers are unchanged.** There is no Figma review board to keep
in step — see the note at the top of this file — so the right-hand column is the
only place these IDs need to be correct.
