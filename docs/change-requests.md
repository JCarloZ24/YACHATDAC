# Change Requests — paste-ready

*Last updated: 10 September 2026*

Companion to `docs/decisions-and-risks.md`. That file holds the standing
Decision and Risk registers; this one holds **Change Requests** — a request from
the client side to alter copy, content or scope that has already been drafted,
reviewed or coded.

Everything here is written to be **copied straight into Proyekto**:

- **Change Requests** → Management → Change Requests
- **Decisions** → Management → Decisions → *Record a decision*
- **Risks & Issues** → Management → Risks & Issues

**Uploaded 25 Aug 2026:** the delivery write tools went live on
`api.proyekto.tech/mcp` and this round was entered through them — CR1–CR11 are
`CR-001`–`CR-011` in Proyekto, D15–D18 are
`DEC-021`–`DEC-024`, R16–R21 are on the risk register as `internal`. Where an item is really a piece of work rather than a request for a ruling,
it is marked **→ task** and can be created through MCP on request — and once a
Change Request exists it can be **linked** to the epics, features, tasks and
deliverables it touches, which beats repeating file/line references into the
form.

Numbering continues the existing registers: change requests start at **CR1**,
decisions at **D15**, risks at **R16**. Owners are as listed in
`docs/decisions-and-risks.md`.

## Proyekto sync state — checked 7 September 2026

**The register in Proyekto is two rounds behind this file, and nothing in this
session could move it.** Read live, the rows are:

| CR | Proyekto status | Decision note there | This file |
| --- | --- | --- | --- |
| CR1 | `approved` | yes, 28 Aug | Applied |
| CR2 | `approved` | yes, 28 Aug | Applied |
| CR3 | `approved` | yes, 28 Aug | **Applied in full, 10 Sep** |
| CR4 | `submitted` | — | **Applied 7 Sep, in the quotation** |
| CR5 | `submitted` | — | Proposed |
| CR6 | `submitted` | — | **Applied 7 Sep** |
| CR7 | `approved` | yes, 28 Aug | Applied |
| CR8 | `withdrawn` | — | **Approved 7 Sep** |
| CR9 | `approved` | yes, 28 Aug | Applied, partial |
| CR10 | `submitted` | — | **Applied 7 Sep** |
| CR11 | `draft` | — | Blocked |

**Two token limits, and the second is new.** The MCP token in use lacks
`change_requests.decide`, so no status can be moved — retried three times on
7 Sep (CR6, then CR4 twice as its target status changed), FORBIDDEN every time.
The web UI, signed in as a project member, can do it; the connector cannot.

**Proyekto is Prodigitality's own product**, so the durable fix is to add
`change_requests.decide` to the connector's scopes rather than to keep pasting
notes by hand — the permission is defined in the `prdigy` monorepo's
`supabase/migrations/`. Until then every status flip in this register is manual.

It also turns out that
Proyekto locks a change request against **editing** once it leaves `draft` —
not only in `withdrawn` (already known from CR8) but in `submitted` too:
`change_request_update` on CR6 returns *"A change request in submitted can no
longer be edited."* So the 7 Sep resolutions cannot even be written into the
descriptions as a stopgap. **This file is the only record of them.**

Note also that the 28 Aug decision notes on CR1/2/3/7/9 were stamped by a
different account, not by the token this sync used — the presence of those
notes is not evidence the permission is available now.

### Hand-off — paste-ready decision notes

Retried 7 Sep: `change_request_decide` still returns FORBIDDEN for the MCP
token. The rows sit in **Awaiting decision** in the web UI, where an account
that holds the permission can open each record and paste the note below.
**CR8 is set aside** on August's instruction — it stays withdrawn in Proyekto
and approved in this file; do not re-raise it.

#### CR-004 → `approved`

> Applied 7 Sep, including inside Suzanne Thompson's recorded quotation on
> Truth, on August's explicit and repeated instruction and on the authority of
> Steve's flag.
>
> The word appears in exactly two places on the site and both are somebody
> speaking about themselves. Suzanne's quotation (`src/content/truth.ts:360`,
> Truth v3:235) now reads "In 1886 the colonists had all come…"; she said
> "settlers". Graham Ambridge's self-description (`our-people.ts:80`) is
> unchanged — not raised by Steve, not part of the instruction — so the two are
> now inconsistent.
>
> This was held first and the hold was overruled. D15 (who may edit a recorded
> quotation) was open at the time and remains open, so this edit precedes the
> ruling that governs it. R17 should be moved from `mitigating` to realised.
>
> Suzanne has NOT ratified this. The Truth v3 draft now carries a block telling
> her which word changed, what she actually said, and that reverting is one
> edit. Truth is held by community and cannot publish without her approval —
> that gate is what prevents an unratified edit to her words going public.

#### CR-010 → `approved`

> Applied 7 Sep, on August's ruling, in the site's narration only. The site now
> speaks of the Iningai people in the third person wherever it is the site
> narrating. Steve's note is satisfied everywhere except inside a quotation.
> Three lines changed, in both the coded content and the drafts:
> `src/content/wonder.ts` — "bought back for our people" → "for the Iningai
> people"; `src/content/about.ts` — the same sentence in miniature;
> `src/content/homepage.ts` — "the squatters follow him onto our Country" →
> "onto Iningai Country" (not flagged by Steve, but the same word, and it would
> have been noticed).
>
> Three things deliberately NOT done:
>
> 1. Steve's spelling was not adopted. He writes "Innigai peoples"; every draft,
>    every file in `src/content/`, and the Taçon et al. citation on Truth say
>    "Iningai". The applied text uses Iningai. R18 is still open — this is a
>    nation's name and it needs confirming with Suzanne regardless of which way
>    this CR went.
> 2. First-person where the corporation describes its own acts is untouched —
>    "We manage Turraburra", "we renamed it", "we were formed by". CR10 objects
>    to "our" used OF Indigenous people, not to YACHATDAC speaking as itself, and
>    flattening that would have cost the site its voice.
> 3. Suzanne's quotation is untouched and goes to her as a question — see CR4.
>
> D16 still owes the standing ruling and the terminology sheet
> (`docs/terminology.md`, drafted 7 Sep) still needs her on two entries. This
> settles the instances, not the principle.

#### CR-006 → `approved` — still outstanding from the same round

> Applied 7 Sep. "Getting here" now reads "Fly to Barcaldine or Longreach and
> drive, or take the train to Barcaldine via Rockhampton. Transfers can be
> arranged." in `src/content/wonder.ts` and the v3 draft.
>
> The knock-on was taken, not deferred: the Transfers inclusion now reads
> "Available from Barcaldine or Longreach airports, or the Barcaldine train, for
> an extra cost" — naming a rail arrival while transfers listed only airports
> would leave a reader with a supported route and no way off it.
>
> Carry forward: this adds a SECOND unconfirmed claim to a block already open
> under R13 — nobody has checked that transfers actually meet the train. Flagged
> in the code beside the R13 note, and it is the first thing to confirm in that
> pass.

#### Not to be touched

- **CR-005** stays `submitted` — August is supplying the SWER and fuel-tank
  facts directly, so `changes_requested` would misrecord what happened.
- **CR-008** stays `withdrawn`. Set aside 7 Sep; the approval lives in this file.
- **CR-011** stays `draft` until the rest of the thread arrives (R20).
- **CR-001/2/3/7/9** correctly rest at `approved`. `applied` is set only by
  `change_request_mark_applied` with the id of a real roadmap commit; these were
  code commits, not roadmap edits. Not a defect to fix.

### CR4 — the reply that goes back to Steve

Rewritten 7 Sep after the quotation was edited — the earlier draft said the
quote had been left alone and is no longer true.

> Hi Steve — coming back to you on the "settlers" → "colonists" note.
>
> Done. The Truth page now reads "In 1886 the colonists had all come…", and
> we have made the same change everywhere the site speaks in its own voice.
>
> One thing you should know, because it wasn't visible in the prototype: that
> line is inside Suzanne's recorded words. It renders as a large pull quote with
> the attribution out of shot, so it reads as our copy — it isn't. We have made
> the change and flagged it to her on the page itself, so she can keep it or put
> her original word back. Nothing on Truth publishes until she has approved it.
>
> We have not touched the "our" note (CR10) inside that same quotation — that
> one is still with her.
>
> Also for her while we are asking: you wrote "Innigai peoples"; every document
> we hold says "Iningai". We haven't switched on one message, because it is the
> name of the nation.

**Steve is the route to Suzanne — there is no other.** Confirmed 7 Sep: Steve
Mam is an Aboriginal man with direct contact to Suzanne; nobody on our side can
reach her except through him. So this reply is not just a courtesy to the
reviewer, it is **the mechanism by which Suzanne is asked**. Ask him explicitly
to put the changed word to her and bring back her ruling — do not assume the
reply alone reaches her.

---

## The Change Request form — confirmed 25 Aug

Read from Proyekto's own schema; the earlier "form has not been seen" caveat is
retired. The fields: Reference `CR-nnn` (**auto-assigned per project in entry
order** — enter CR1–CR11 in order so the references line up, and keep "CR1 —"
in the title regardless); Title; Description; Requested by (a project member —
Steve has no account, so the entering account shows and "Raised by Steve
(FNAN)" stays in the description); Impact on scope (prose); Impact on timeline
(signed days); Target date before/after; Status; Decision note; Links.

The status vocabulary is fixed: `draft | submitted | approved | rejected |
changes_requested | withdrawn | applied`. This file's working statuses map as:

| In this file | In the form |
| --- | --- |
| Proposed | `submitted` — the client has asked; no ruling yet |
| **Held** (CR4, CR10) | `submitted`, with the hold and its reason in **Decision note** — held is a ruling pending, not a status |
| **Blocked** (CR11) | `draft` — the request itself is not fully captured |
| Type (Terminology / New content / Copy rewrite) | No field — first line of Description |
| The request / Raised by | Description |
| Where it lands / Assessment | Impact on scope |
| Approved, later | `approved` unlocks **Apply to roadmap**; `applied` is set only by an actual roadmap commit — never hand-pick it |
| Answered with options and sent back (CR5, CR7–CR9, once that happens) | `changes_requested` — the decider has returned it to the requester |

Each CR below now carries a **Form** line with its mapped status. Decision
entries match the Decision modal (`proposed | final | superseded` — exact
match for how this file already writes them); risk entries carry the same
Form line as the main register, including the likelihood a risk requires.

---

## Round 1 — FNAN review of the v3 prototypes (24 August 2026)

**Source.** WhatsApp, *FNAN ICT Team* (Pablito, Stephen, August), 24 Aug,
09:51–15:37. Six screenshots, supplied by August. All substantive feedback is
from **Stephen "Steve" Mam (FNAN)**, reviewing the v3 HTML prototypes uploaded
the same day. Pablito is named as agreeing with one item.

**Two things about this source that matter before anything is actioned.**

1. **Steve is the route to Suzanne, and not a substitute for her.** Confirmed
   7 Sep: Steve Mam is an Aboriginal man with direct contact to Suzanne, and he
   is the **only** channel to her — nobody on our side can reach her otherwise.
   That makes his flags better informed than a distant reviewer's, and it makes
   him the person through whom her ruling must be sought. It does not make him
   the author of her recorded words. `docs/decisions-and-risks.md` records that
   Suzanne Thompson is the authority on cultural content and on her own words,
   and
   **D10** makes August the copy owner on every page. Several requests below
   land directly on Suzanne's recorded speech. They are logged as requests, not
   as approved edits. See **D15**.
2. **The feedback is not complete.** Steve says at 10:40 that he has *"more
   minor wording feedback that is better talked through"*, one screenshot cuts
   off mid-item, and a `drive.google.com` link at the end of the thread has not
   been captured. See **R20**.

### Index

| | Change request | Type | Status | Owner |
| --- | --- | --- | --- | --- |
| CR1 | "cultural sites" → "cultural heritage sites" | Terminology | Proposed — straightforward | August → Marc |
| CR2 | Card title "Carbon" → "Biological Sequestration" | Terminology | Proposed — check it is accurate | August, with the client |
| CR3 | "Cool burns" and "right-way fire" → "fire-stick farming" | Terminology | **APPLIED IN FULL (10 Sep)** — the slug carve-out closed with D17 | August, JC |
| CR4 | "settlers" → "colonists" | Terminology | **Applied in the quotation (7 Sep)** — unratified; hold overruled | August → Suzanne |
| CR5 | Add SWER, and on-site petrol and diesel tanks | New content | Proposed — **facts unverified**. See R19 | August, with the client |
| CR6 | Add rail via Rockhampton to *Getting here* | New content | **APPLIED (7 Sep)** | August |
| CR7 | "No town glow" → "Magic at night" | Copy rewrite | Proposed — offered as a suggestion | August, Ivy |
| CR8 | Homepage hero — "maybe something more heroic" | Copy rewrite | **Approved — sequenced last.** Proyekto still reads `withdrawn`; see CR8 | August, Marc |
| CR9 | "Guesting On-Country" → "Be our guest" | Copy rewrite | Proposed — offered as a suggestion | August |
| CR10 | Do not use "our" of Indigenous people; use "Iningai peoples" | Terminology | **APPLIED (7 Sep)** in narration; quote to Suzanne | August → Suzanne |
| CR11 | *Who comes* — instruction not captured | Unknown | **Blocked** — need the rest of the thread | August |

New decisions raised: **D15**, **D16**, **D17**, **D18**.
New risks raised: **R16**–**R21**.
Approved in this round, and now locked: see Part 4.

---

# Part 1 — Change Requests

---

## CR1 — "cultural sites" becomes "cultural heritage sites" · **APPLIED (28 Aug)**

- **Form** — status `submitted` · timeline impact 0 days
- **Type** — Terminology · **Status** — **Applied** · **Owner** — August → Marc
- **Applied 28 Aug** — the accordion heading now reads "Damage and access to
  cultural heritage sites" in both `src/content/living-work.ts` and the v3
  draft. Mark `applied` in Proyekto.
- **Raised by** — Steve (FNAN), 10:04, against the Living Work *Damage and
  access to cultural sites* accordion.
- **The request** — Use **cultural heritage sites** wherever the site currently
  says *cultural sites*.
- **Where it lands** — one occurrence:
  `docs/content/drafts/living-work/YACHATDAC-LivingWork-Copy-v3.md:93` — the
  accordion heading **"Damage and access to cultural sites"**.
- **Already consistent elsewhere** — the drafts otherwise say *cultural
  heritage* (About, Living Work's fee-for-service card, the Resources page), so
  this is a single outlier rather than a sweep.
- **Assessment** — No conflict with anything on the registers. Safe to apply to
  the draft once someone confirms the sweep is genuinely one line.
- **→ task** — *Apply CR1 to Living Work v3*.

---

## CR2 — The card title "Carbon" becomes "Biological Sequestration" · **APPLIED (28 Aug), ahead of R14**

- **Form** — status `submitted` · decision note: apply with R14, not ahead of it
- **Type** — Terminology · **Status** — **Applied** · **Owner** — August, with the client
- **Applied 28 Aug, on explicit instruction, ahead of R14** — this entry
  originally recommended waiting for R14 (the status labels are unconfirmed);
  August asked to proceed anyway. The retitle is live in
  `src/content/living-work.ts` and the v3 draft. The card body and its
  "Registration underway" status label are untouched — R14 still stands and
  still needs the client's confirmation before publishing. Mark `applied` in
  Proyekto, noting R14 is unaffected.
- **Raised by** — Steve (FNAN), 10:27, against the Living Work *What the work
  produces* card grid.
- **The request** — Retitle the **Carbon** card **Biological Sequestration**.
- **Where it lands** —
  `docs/content/drafts/living-work/YACHATDAC-LivingWork-Copy-v3.md:296` — the
  `##### Carbon` heading. The card body ("a carbon farming project", "the
  practice being measured") was not queried and is unchanged.
- **Watch for** — the card sits in a row with *Biodiversity credits*, *IPA
  designation*, *Fee-for-service* and *Rainbow Credits*. Every one of those
  labels is already flagged as unconfirmed under **R14**; this retitle should be
  confirmed in the same pass rather than separately, and the new title checked
  against what is actually registered. "Biological sequestration" is a broader
  claim than "carbon" — it reads as covering soil and vegetation both.
- **Assessment** — Apply with **R14**, not ahead of it.

---

## CR3 — "Cool burns" and "right-way fire" both become "fire-stick farming" · **APPLIED IN FULL (10 Sep)**

- **Form** — status `submitted` · decision note: accepted as an edit pass, slug
  held on D17
- **Type** — Terminology · **Status** — **Applied in full** · **Owner** — August, JC
- **Applied 28 Aug** — every occurrence across `living-work.ts`, `wonder.ts`,
  `truth.ts`, `resources.ts` and the matching v3/v1 drafts now reads
  "fire-stick farming", including the two manner-phrasings, rewritten rather
  than substituted, per the note below. `docs/content/STATUS.md` was left
  alone — those two lines are historical quotes of what the v2 draft said on
  20 Aug, not live copy. **Not applied** — the Resources article title/slug
  (`right-way-fire-and-the-carbon-in-the-soil`) and the matching Truth link
  title were held on **D17**.
- **Applied 10 Sep — the carve-out closed.** D17 was resolved on August's
  direction (option 1) and the article was renamed title-and-slug together:
  `fire-stick-farming-and-the-carbon-in-the-soil`, *"Fire-stick farming and the
  carbon in the soil"*, with Truth's link title and both of its hrefs moved
  with it and a permanent redirect from the old route in `next.config.ts`.
  `record-media.ts` keys moved too. Nothing in the built site says "right-way
  fire" now. Mark `applied` in Proyekto with no carve-out.
- **Raised by** — Steve (FNAN), 15:15, against the Wonder chip list. Two
  instructions in one message: replace **"Cool Burns"** with **"Fire-stick
  Farming"**, *and* replace every occasion **"right-way fire"** has been used
  across the site with **"fire-stick farming"**.
- **The request** — A single term, **fire-stick farming**, replacing two
  existing ones.
- **Where it lands — 18 matching lines across 6 files**

  | File | Hits | Notes |
  | --- | --- | --- |
  | `docs/content/drafts/living-work/YACHATDAC-LivingWork-Copy-v3.md` | 9 | Body copy, the ranger list, the practice card, the fee-for-service card and the Land management services pathway |
  | `docs/content/drafts/the-record/YACHATDAC-Resources-Copy-v1.md` | 2 | An article **title** and a research question |
  | `docs/content/drafts/truth/YACHATDAC-Truth-Copy-v3.md` | 2 | A card link title and an image direction note |
  | `docs/content/drafts/wonder/YACHATDAC-Wonder-Copy-v3.md` | 2 | The chip list Steve screenshotted, and the "no set itinerary" paragraph |
  | `src/content/homepage.ts` | 1 | Line 146 — **already coded**, an image art-direction string |
  | `docs/content/STATUS.md` | 2 | Our own notes, not published copy — update for consistency |

- **The part that is not a find-and-replace** — Truth v3 links to
  `/resources/right-way-fire-and-the-carbon-in-the-soil`, and the Resources page
  carries that article under the same title. Renaming the term renames the
  article, which renames the route. That is an IA change, not a copy change —
  raised separately as **D17**.
- **Also note** — the About draft already says *Fire-stick farming* in its
  services list, so the client side has used both terms in the same upload. The
  request resolves that inconsistency in favour of one. `src/content/homepage.ts`
  carries the same split three lines apart — line 143 already says "Fire-stick
  farming", line 146 says "Right-way fire".
- **Watch for** — several sentences read awkwardly under substitution. "Rangers
  burn right way and look for black ash" and "Cool burning done right way is the
  practice being measured" describe *manner*, not the name of a practice;
  swapping the words in mechanically produces "Rangers fire-stick farming and
  look for black ash". Those lines need rewriting, not replacing.
- **Assessment** — Accept the term; do it as an edit pass, not a `sed`. Hold the
  slug until **D17** is answered.
- **→ task** — *Fire-stick farming terminology pass across the v3 drafts and
  `src/content/homepage.ts`*.

---

## CR4 — "settlers" becomes "colonists" · **APPLIED INSIDE THE QUOTATION (7 Sep), unratified**

- **Form** — status `submitted` in Proyekto · **needs the status moved by an
  account holding `change_requests.decide`**
- **Type** — Terminology · **Status** — **Resolved** · **Owner** — August → Suzanne
- **7 Sep, later — the hold was overruled and the quotation was edited.**
  August instructed, twice and explicitly, that *"the quote must change based on
  Steve's flag."* The concern below was put and was reaffirmed, so it was
  applied:
  - `src/content/truth.ts:360` and Truth v3:235 — Suzanne's recorded words now
    read **"In 1886 the colonists had all come…"**. She said **"settlers"**.
  - The change was made **before asking her**, on the authority of Steve's
    flag. `CLAUDE.md` says never edit a quotation; **D15**, which decides who
    may, was and is still open. This edit therefore sets a precedent D15 has
    not ruled on.
  - **CR10 was not applied** to the same string — it was not part of the
    instruction. "our people" stays as spoken, so the quotation is now half
    edited and half original.
  - **The `FOR SUZANNE` block on Truth v3 was rewritten** rather than left
    standing: it previously told her the changes had *not* been applied, which
    is no longer true. It now says plainly that one word was changed, which
    word, what she actually said, and that putting it back is one edit.
  - **Reversion is one edit**, and the original wording is preserved in the
    code comment at `src/content/truth.ts`, in the draft block, and here.
- **What still protects this** — Truth is **held by community** and cannot
  publish without Suzanne's approval (**R5**). That gate, not our process, is
  what stops an unratified edit to her words reaching the public. If Truth's
  approval requirement is ever relaxed, this line becomes live and must be
  revisited first.
- **R17 is realised, not mitigated.** Update it on the register: the risk was
  that a Traditional Owner's recorded speech would be altered on a reviewer's
  authority, and that has now happened.
- **Graham Ambridge's line is unchanged** (`src/content/our-people.ts:80`). The
  instruction was about the quotation; his self-description was not raised by
  Steve and was not part of it. The two are now inconsistent — one person's
  own word edited, another's kept — and that will be noticed.

### The original 7 Sep ruling, kept for the record

- **Superseded.** CR4 turned out to have **no
  occurrence outside somebody's own words.** A search of `src/content/` and the
  drafts finds "settler" in exactly two places, and both are a person speaking
  about themselves. So there is nothing to substitute, and the request resolves
  as two decisions rather than an edit:
  1. **Suzanne's quotation** (`src/content/truth.ts:360`, Truth v3:221) —
     **left exactly as spoken**, and now carries a marked block in the v3 draft
     putting CR4 and CR10 to her as *questions*, with the note that both
     changes have been made everywhere else and only her words are untouched.
     This satisfies the "Corrected Truth v3 package" criterion *"CR4 and CR10
     framed as questions, not applied"*.
  2. **Graham Ambridge's biography** (`src/content/our-people.ts:80`) —
     **keeps "settler"**. It is his own account of himself, Steve did not raise
     CR4 against it, and the principle that protects Suzanne's words protects
     his. Recorded in the file as a decision, not an oversight.
- **D15 is still open** and still owes the standing rule. This resolves the
  instance without pre-empting the principle.
- **Raised by** — Steve (FNAN), 15:11: *"Please don't use 'settlers' in this
  case maybe use 'colonists'. The land was already settled when they got
  there."*
- **The reasoning is sound and is not in question.** What is in question is who
  may make this edit.
- **Where it lands — two occurrences, and both are somebody's own words**
  1. `docs/content/drafts/truth/YACHATDAC-Truth-Copy-v3.md:207` — the
     screenshotted pull quote. It is inside a **blockquote of Suzanne Thompson
     speaking**: *"In 1886 the settlers had all come…"* Truth v3 is tagged
     **held by community** on the content status board and carries Suzanne's
     approval requirement on the document itself.
  2. `docs/content/drafts/our-people/YACHATDAC-OurPeople-Copy-v1.md:63` — **Graham
     Ambridge** describing himself: *"he speaks to the settler side of this
     history, which is his own."* Not flagged by Steve, but it is the same word
     and will be noticed if one changes and the other does not.
- **Why it was held** — Editing a recorded quotation changes what a Traditional
  Owner is shown to have said. Steve is the route to Suzanne and an Aboriginal
  man who knows her directly — which is why his flag carries weight — but the
  route to someone is not the same as their consent, and only Suzanne can
  ratify a change to her own words. Applying this without her is the single riskiest
  item in this round. See **D15** and **R17**.
- **What can be done now** — the same point can be carried in the *surrounding*
  narration, which is the site's voice and not a quotation, leaving the quote
  intact. Offer that as the option alongside asking Suzanne directly.
- **Outstanding, and it is the only part still open** — **Steve has not been
  told.** The ruling, the reasoning and the fact that his point was taken
  everywhere outside a quotation all live in this repo; from where he sits CR4
  has been silent since 24 August. The reply that closes it is drafted above,
  under *CR4 — the reply that goes back to Steve*. Sending it is what resolves
  CR4 with the person who raised it; the Proyekto status flip is bookkeeping
  after that.

---

## CR5 — Add SWER, and the on-site petrol and diesel tanks

- **Form** — status `submitted` · move to `changes_requested` once the ask for
  the actual SWER and fuel facts has gone back to Steve (R19)
- **Type** — New content · **Status** — Proposed · **Owner** — August, with the client
- **Raised by** — Steve (FNAN), 10:19 (edited): *"Can we please find an
  appropriate way to include Single-Wire Earth Return (SWER)"*, with a pasted
  Google definition, and *"Also they have on-site petrol and diesel tanks"*.
- **The request** — Two additions to Living Work's *Infrastructure and
  technology* section.
- **Where it lands** —
  `docs/content/drafts/living-work/YACHATDAC-LivingWork-Copy-v3.md:262` — the
  **Power** block, currently: solar with wifi-enabled regulators, remote data
  off the regulators, 240 volt supply to the mesh, and a note that renewable
  self-sufficiency is a Stage 4 goal.
- **The problem** — the material supplied is a **generic definition of SWER from
  a search result**, not a statement of what is on Turraburra. The draft
  currently implies the property runs on solar. Whether it is also on a SWER
  line, what that feeds, and what the fuel tanks are for and how big they are,
  are all facts nobody on our side has. Writing from a search snippet would put
  an unverified infrastructure claim on a public page. See **R19**.
- **Also weigh** — the Power block is four short bullets in a four-column
  layout. A SWER explanation of any length unbalances it. Ivy should see this
  before it is written, not after.
- **Next step** — Ask the client, through Steve, for the actual arrangement in
  one or two sentences, then write it. Do not paraphrase the definition.
- **7 Sep** — **left at `submitted` deliberately.** August is supplying the SWER
  and fuel-tank content directly rather than routing the ask through Steve, so
  the move to `changes_requested` would misrecord what happened. Nothing is
  written until that content arrives; if it does not, ship the Power block
  without it, which is complete as it stands (**R19**).

---

## CR6 — *Getting here* should include the train via Rockhampton · **APPLIED (7 Sep)**

- **Form** — status `submitted` in Proyekto · timeline impact 0 days ·
  **needs marking applied** — this sync's token lacks `change_requests.decide`
- **Type** — New content · **Status** — **Applied** · **Owner** — August
- **Applied 7 Sep** — *Getting here* now reads "Fly to Barcaldine or Longreach
  and drive, or take the train to Barcaldine via Rockhampton. Transfers can be
  arranged." in `src/content/wonder.ts` and the v3 draft.
- **The knock-on was taken, not deferred.** The Transfers inclusion now reads
  "Available from Barcaldine or Longreach airports, **or the Barcaldine train**,
  for an extra cost" — naming a rail arrival while the transfers line still
  listed only airports would leave a reader with a supported route and no way
  off it. **This adds a second unconfirmed claim to a block that was already
  unconfirmed:** nobody has checked that transfers actually meet the train. It
  is flagged in the code beside the R13 note and is the first thing to confirm
  in that pass.
- **Raised by** — Steve (FNAN), 15:19: *"They can also travel by train via
  Rockhampton to Barcaldine."*
- **Where it lands** —
  `docs/content/drafts/wonder/YACHATDAC-Wonder-Copy-v3.md:59` — *Getting here*:
  "Fly to Barcaldine or Longreach and drive. Transfers can be arranged." Check
  it against line 206, where transfers are listed as available from the two
  airports for an extra cost — if a rail arrival is now a supported route, that
  line needs to say whether transfers meet the train too.
- **Assessment** — Straightforward addition, but it has a knock-on into the
  inclusions list, which is already open under **R13**.
- **→ task** — *Add rail arrival to Wonder v3 and reconcile the transfers line*.

---

## CR7 — "No town glow" becomes something more positive, e.g. "Magic at night" · **APPLIED (28 Aug)**

- **Form** — status `submitted` · move to `changes_requested` when the drafted
  options go back (the Wonder options batch, Part 6 deliverable in
  `docs/decisions-and-risks.md`)
- **Type** — Copy rewrite · **Status** — **Applied** · **Owner** — August, Ivy
- **Applied 28 Aug** — took the client's own suggested title, "Magic at
  night", satisfying the note without losing the fact: the body now opens
  "There's no town glow out this way" as the stated reason, rather than
  dropping it. Applied in `src/content/wonder.ts` and the v3 draft. Mark
  `applied` in Proyekto.
- **Raised by** — Steve (FNAN), 15:23, against the Wonder *After dark* card.
  Phrased as a suggestion: *"Maybe an alternative title that is more positive
  like 'Magic at night'"*.
- **Where it lands** —
  `docs/content/drafts/wonder/YACHATDAC-Wonder-Copy-v3.md:99` (the card title)
  and line 136, where the same phrase carries the body: "There is no town glow
  out this way. When the fire burns down, the sky comes all the way to the
  ground."
- **The tension worth putting to the client** — the current title states a
  physical fact about the place, and the body depends on it. "Magic at night" is
  a claim about the experience and could be said of anywhere. There is a version
  that satisfies the note without losing the fact — the title turns positive
  while the body keeps "no town glow" as the reason. Take options to the client
  rather than a straight swap.
- **Assessment** — A suggestion, not a directive. Answer it with two or three
  drafted alternatives.

---

## CR8 — The homepage hero should be "more heroic" · **APPROVED (7 Sep), built last**

- **Form** — status `withdrawn` in Proyekto and **stuck there** · decision note:
  sequenced after R1 — the hero and the Welcome are one beat
- **Type** — Copy rewrite · **Status** — **Approved, sequenced last** · **Owner** — August, Marc
- **7 Sep — approved, and the record does not yet show it.** August has ruled
  that CR8 is accepted in principle and **built last, because the homepage is
  heavier than the other pages**. It is sequenced to the end of the build, not
  dropped. Two things stand in the way of recording that in Proyekto, and both
  need an account this sync did not have:
  1. The row was **withdrawn on 26 Aug** — by whom and why is not recorded, and
     the withdrawal carries no decision note.
  2. **`withdrawn` is terminal.** Proyekto refuses both the status change
     (`change_requests.decide` permission missing) and any edit to the row
     ("a change request in withdrawn can no longer be edited"). Reinstating CR8
     means an admin flips it, or it is **re-raised as a new CR** carrying this
     history forward. **Decided 7 Sep: neither — CR8 is set aside.** Re-raising
     was considered and declined: a duplicate row would paper over an
     unexplained withdrawal rather than resolve it, and the withdrawal itself
     (by whom, and why) is still worth an answer. **This file is the only record
     of the approval, and that is accepted rather than worked around.** The work
     is sequenced last regardless, so nothing is blocked by the record being
     out of step — but if this file were lost, the approval would not be
     recoverable from Proyekto.
- **Raised by** — Steve (FNAN), 15:31, against the homepage hero: *"Maybe
  something more heroic?"*
- **Where it lands — this one is already built**
  - `docs/content/drafts/homepage/YACHATDAC-Homepage-Copy-v3.md:41`
  - `src/content/homepage.ts:79` — the coded hero headline
  - `src/content/site.ts:22` — the longer form, used as the site description
- **What it is now** — "Reconnection — across time, across people." with the
  eyebrow *Welcome to Country* and the standfirst "You are entering Turraburra:
  story held in stone and starlight, still being lived today."
- **What is unclear** — "more heroic" is a direction, not a brief. It is the
  first line of the site, it sits under a **Welcome to Country** eyebrow, and
  the Welcome itself is still a placeholder awaiting Suzanne's words (**R1**).
  Rewriting the headline before her Welcome exists risks doing it twice.
- **Assessment** — Treat as a brief to be answered with options, and sequence it
  after **R1**. Flag to the client that the hero and the Welcome are one beat.

---

## CR9 — "Guesting On-Country" becomes "Be our guest" · **APPLIED (28 Aug), card only**

- **Form** — status `submitted` · move to `changes_requested` with the Wonder
  options batch, alongside CR7
- **Type** — Copy rewrite · **Status** — **Applied, partial** · **Owner** — August
- **Raised by** — Steve (FNAN), 15:36, against the homepage invitation card:
  *"Maybe different title such as 'Be our guest'?"*
- **Where it lands** —
  - `docs/content/drafts/homepage/YACHATDAC-Homepage-Copy-v3.md:100` and
    `src/content/homepage.ts` — the card eyebrow **Guesting On-Country**
  - `docs/content/drafts/wonder/YACHATDAC-Wonder-Copy-v3.md:47` — the Wonder
    page's own H1 is **Guesting On-Country**
- **The knock-on** — the card is the entry point to the Wonder page and
  currently shares its name. Renaming one and not the other breaks that link;
  renaming both is a larger change than the note asks for. **Decided 28 Aug:
  card only.** The homepage Invitation card eyebrow now reads "Be our guest";
  Wonder's own H1, route and breadcrumb keep "Guesting On-Country" — that's a
  bigger IA/branding move than a suggested card title and wasn't part of
  Steve's literal note.
- **Note against CR10, still live** — "Be our guest" is first-person plural in
  the organisation's voice, the same word CR10 asks not to use about
  Indigenous people. Applied anyway on explicit instruction (28 Aug); the
  terminology sheet (**D16**) isn't being built right now, but flag this line
  when it eventually is.
- **Assessment** — Applied as the card-only option. Mark `applied` in
  Proyekto, noting the scope decision and the open D16 tension.

---

## CR10 — Do not use "our" in reference to Indigenous people · **APPLIED (7 Sep)**

- **7 Sep — applied in the site's narration, on August's ruling.** The site now
  speaks of the Iningai people in the third person wherever it is the site
  narrating, and Steve's note is satisfied everywhere except inside a
  quotation. Three lines changed, in both the coded content and the drafts:
  - `src/content/wonder.ts` — "bought back for **our people**" → "bought back
    for **the Iningai people**"
  - `src/content/about.ts` — the same sentence in miniature, same change
  - `src/content/homepage.ts` — "the squatters follow him onto **our
    Country**" → "onto **Iningai Country**" (not flagged by Steve; the same
    word, and it would have been noticed)
- **Two things deliberately NOT done, and both matter:**
  1. **Steve's spelling was not adopted.** He writes *"Innigai peoples"*; every
     draft and every file in `src/content/` says **Iningai**, and so does the
     Taçon et al. citation on Truth. The applied text uses **Iningai**.
     **R18 is still open** — this is a nation's name and it should be confirmed
     with Suzanne regardless of which way this CR went.
  2. **First-person where the corporation describes its own acts is untouched**
     — "We manage Turraburra", "we renamed it", "we were formed by". CR10
     objects to "our" used *of Indigenous people*, not to YACHATDAC speaking as
     itself, and flattening that would have cost the site its voice.
- **Suzanne's quotation is untouched** and goes to her as a question — see CR4.
- **D16 still owes the standing ruling** and the terminology sheet still needs
  building; this settles the instances, not the principle.

### The original assessment, kept for the record

- **Form** — status `submitted` · **decision note: HELD — conflicts with the
  client's own first-person voice and lands partly inside Suzanne's quote;
  nothing moves until D16 and R18 are answered. Do not adopt the "Innigai"
  spelling.**
- **Type** — Terminology · **Status** — **Held** · **Owner** — August → Suzanne
- **Raised by** — Steve (FNAN), 15:25, against Wonder's Turraburra paragraph:
  *"Don't use 'our' in reference to Indigenous people. In this case maybe use
  'Innigai peoples'."*
- **Where it lands** —
  1. `docs/content/drafts/wonder/YACHATDAC-Wonder-Copy-v3.md:118` — "bought back
     for **our people** in April 2019" (the screenshotted line)
  2. `docs/content/drafts/about/YACHATDAC-About-Copy-v1.md:41` — "bought back
     for **our people** in 2019", the same sentence in miniature
  3. `docs/content/drafts/truth/YACHATDAC-Truth-Copy-v3.md:207` — "**our
     people** were off their lands", again inside Suzanne's quotation
- **Two problems, and they pull in opposite directions**
  1. **Whose "our".** YACHATDAC is an Aboriginal corporation formed by Iningai
     Traditional Custodian families. On its own website, "our people" is the
     client speaking in the first person about themselves — the About page uses
     "we" and "our" throughout for exactly that reason. The advice not to use
     "our" of Indigenous people is sound when a *third party* is writing; it
     reads differently when the site is the community's own voice. This needs
     Suzanne, not us. See **D16**.
  2. **The spelling.** Steve writes **"Innigai"**. Every draft and every coded
     file say **"Iningai"**. One of them is wrong and it is the name of a
     nation. See **R18**.
- **Assessment** — Held. Do not apply either the substitution or Steve's
  spelling until D16 and R18 are answered.

---

## CR11 — *Who comes* — the instruction was not captured

- **Form** — status `draft` — the request itself is not fully captured; it
  submits when the rest of the thread arrives (R20)
- **Type** — Unknown · **Status** — **Blocked** · **Owner** — August
- **Raised by** — Steve (FNAN), around 15:19–15:23. The screenshot shows the
  **WHO COMES** block — "Families, school groups, group bookings, international
  visitors" — and the message beneath it is cut off at the edge of the capture.
- **What is needed** — the text of that message, and everything after 15:37
  including the `drive.google.com` link.
- **Assessment** — Do not guess at it. Logged so the gap is visible rather than
  silently dropped. See **R20**.

---

# Part 2 — Decisions this round raises

Record each as **Proposed** — an exact match for Proyekto's `proposed` status
(confirmed 25 Aug). When answered, change the status to **Final** and write the
answer into *The decision* rather than opening a new entry, marking the winning
option **selected** in the options list.

---

## D15 — Who may edit a quotation once it is recorded?

- **Category** — Content governance
- **Status** — Proposed · **Visibility** — Shared · **Owner** — August, Marc
- **The decision** — Whether terminology corrections from FNAN may be applied to
  passages that are direct quotations from Suzanne Thompson, or whether every
  such edit goes back to her.
- **Context** — CR4 asks for "settlers" → "colonists" and CR10 asks that "our
  people" be replaced. Both land inside the same blockquote on Truth v3, a page
  the content status board marks **held by community** and which states
  Suzanne's approval requirement on its own face. The registers already record
  that FNAN reviews but does not own the words, and **D10** makes August the
  copy owner on every page. Nothing yet says what happens when a reviewer's
  correction and a speaker's recorded words disagree.
- **Why it matters** — It decides how a whole class of feedback is handled, not
  one word. Getting it wrong once — silently improving a Traditional Owner's
  recorded speech — is not recoverable by fixing it afterwards. It also sits on
  **R5**, Suzanne's approvals already being on the critical path.
- **Options considered**
  1. Quotations are never edited. Terminology notes are answered in the
     surrounding narration, which is the site's voice.
  2. Quotations may be edited only with Suzanne's explicit approval, item by
     item, recorded against the page.
  3. Quotations are marked as such in the drafts — a visible convention — so
     reviewers can see what is quoted before they comment.
- **Recommendation to put forward** — 1 and 3 together, with 2 available when
  the client asks for it.
- **⚠ Overtaken by events, 7 Sep.** CR4 was applied inside Suzanne's quotation
  on August's instruction while this decision was still `proposed`. The practice
  has therefore been set before the rule: a reviewer's terminology flag, endorsed
  by the copy owner, was sufficient to edit a Traditional Owner's recorded
  speech. D15 now either ratifies that or reverses it, and it should be answered
  before the next round rather than after — CR10 sits in the same sentence and
  is still held, so the register currently applies two different rules to one
  quotation.

---

## D16 — The terminology register: "our", "Indigenous", "First Nations", "Iningai"

- **Category** — Content governance
- **Status** — Proposed · **Visibility** — Shared · **Owner** — August, with Suzanne
- **The decision** — Settle, once, which words the site uses for the people and
  the community, and in whose voice the site speaks.
- **Context** — Three separate notes in this round point at the same thing:
  - 15:25 — do not use "our" of Indigenous people; try "Innigai peoples" (CR10)
  - 15:34 — *"We need to triple check use of the words 'Indigenous' and 'First
    Nations' — this is a note for later"*, raised against the homepage
    *A way forward* block, which currently uses both
  - the site simultaneously writes in the first person as an Iningai corporation
    ("we", "our people", "our cultural heritage") and in the third person about
    First Nations groups generally
- **Why it matters** — These words appear on every page, in the homepage hero
  region, in the About page's opening, and in Suzanne's quotations. Deciding
  them page by page as feedback arrives guarantees an inconsistent site. Steve
  has already flagged it as a note for later; making it a decision now means
  that later pass has something to check against.
- **Options considered**
  1. Write a one-page terminology sheet, approved by Suzanne, and hold every
     page to it — including a ruling on first-person voice.
  2. Handle each instance as it is raised.
- **Recommendation to put forward** — 1. The sheet is an hour's work and it
  retires an entire class of review comment.
- **→ task** — *Draft the YACHATDAC terminology sheet for client approval*.

---

## D17 — Does the fire-stick farming rename change a URL? · **FINAL — yes, 10 Sep 2026**

- **Category** — Information architecture
- **Status** — **Final (10 Sep 2026)** · **Visibility** — Shared · **Owner** — Marc, David
- **Ruled** — **Option 1, rename both.** August's direction, 10 Sep 2026, on the
  screenshots of Steve's 15:15 instruction: replace "right-way fire" *across the
  site*. The article is now
  `/the-record/fire-stick-farming-and-the-carbon-in-the-soil`, titled
  *"Fire-stick farming and the carbon in the soil"*; Truth's link title and both
  hrefs moved with it; the old route 301s in `next.config.ts`.
- **What it settles beyond this one article** — Record article slugs **track
  their titles**, and a rename ships with a permanent redirect. That is the
  answer David needed for Record routing, and it matches the pattern
  `/resources` → `/the-record` already set. Option 3 (stable short slugs
  independent of titles) is not taken.
- **Marc and David have not confirmed this.** They own the decision on paper and
  the ruling is August's, taken under F8 build-first. It stands as built and is
  reviewable at presentation like everything else.
- **The decision** — Whether CR3's terminology change extends to the Resources
  article slug `/resources/right-way-fire-and-the-carbon-in-the-soil`.
- **Context** — Truth v3 links to that route, and the Resources page carries the
  article under the matching title *"Right-way fire and the carbon in the
  soil"*. CR3 replaces the term everywhere it is used. Titles are copy and are
  covered by **D5**; routes are IA and are not.
- **Why it matters** — Nothing is published, so the change is free today and
  costs redirects later. It also sets the pattern for whether Resources article
  slugs track their titles at all, which David needs before the Resources
  routing is built.
- **Options considered**
  1. Rename both — `/resources/fire-stick-farming-and-the-carbon-in-the-soil`.
  2. Rename the title, keep the slug, and accept the mismatch.
  3. Give Resources articles stable short slugs independent of their titles.

---

## D18 — How a client suggestion becomes an approved change

- **Category** — Process
- **Status** — Proposed · **Visibility** — Shared · **Owner** — August, Marc
- **The decision** — What we do with feedback phrased as *"maybe"*, and who
  confirms the result.
- **Context** — Of eleven requests in this round, four are directives ("Can we
  please…") and four are suggestions ("Maybe…", "Maybe something more
  heroic?"). The suggestions are the expensive ones: CR8 rewrites the first line
  of the site, CR9 renames a page. Answering a suggestion with a straight
  substitution loses the chance to solve it better; answering it with three
  options costs a round trip. There is no agreed default, and **D10** says the
  copy owner is August, not the reviewer.
- **Why it matters** — It sets how much of the review cycle goes on round-trips,
  and it decides whether a "maybe" from FNAN counts as approval for work Suzanne
  has not seen.
- **Options considered**
  1. Directives are applied and reported; suggestions are answered with two or
     three drafted options in one batch per page.
  2. Everything is applied as received and reviewed in the next round.
  3. Everything, including directives, goes back as options.
- **Recommendation to put forward** — 1, with the batch going out as a single
  document per page rather than as WhatsApp replies.

---

# Part 3 — Risks & Issues this round raises

Continuing the numbering in `docs/decisions-and-risks.md`, which ends at R15.

---

## R16 · ISSUE · Medium — Copy feedback now lands on code as well as drafts

- **Form** — kind `issue` · severity `medium` · no likelihood · status
  `mitigating` (the same-commit rule below is the mitigation) · visibility
  `internal` · owner August
- **Owner** — August, JC
- **What has gone wrong** — v3 arrived as HTML prototypes and parts of it are
  already coded: the hero headline at `src/content/homepage.ts:79`, the site
  description at `src/content/site.ts:22`, the invitation card eyebrow at
  `src/content/homepage.ts:165`, and a "right-way fire" art-direction string at
  `src/content/homepage.ts:146`. CR3, CR8 and CR9 all change coded strings, not
  just draft Markdown.
- **Impact** — Two sources for the same sentence. Apply a change to the draft
  only and the site keeps shipping the old words; apply it to the code only and
  the draft — which **D5** makes the source of truth — is wrong.
- **Next step** — Every change request that touches a coded string is applied to
  both in the same commit, and the CR entry names the file and line. The tables
  above do this; keep doing it.

---

## R17 · RISK · **High** — Terminology edits are being asked for inside a Traditional Owner's recorded words

- **Form** — kind `risk` · severity `high` · likelihood `high` · status
  **`realised` (7 Sep — CR4 was applied inside Suzanne's quotation; CR10 is
  still held)** · visibility `internal` · owner August
- **Owner** — August → Suzanne, via Marc
- **What could go wrong** — CR4 and CR10 both land in the same blockquote on
  Truth v3, a page held by community and awaiting Suzanne's approval. Applied
  as received, they would alter what Suzanne is shown to have said, on the
  authority of someone who is the route to her but is not the owner of those
  words. (Steve is Aboriginal and in direct contact with Suzanne — that makes
  his flag well founded and makes him the only channel for her ruling; it is
  still not her ruling.)
- **Impact** — Cultural and relational, not technical, and not undone by a
  revert. It also risks Truth's approval, which **R5** already has on the
  critical path.
- **7 Sep — this risk has occurred.** CR4 was applied inside the quotation on
  August's instruction, overruling the hold, before D15 was answered and before
  Suzanne was asked. What remains is containment, not prevention: the edit is
  disclosed to her on the page, the original is recorded in three places, and
  reverting is one edit. **Truth's community hold (R5) is now the only thing
  standing between an unratified edit and publication** — treat that gate as
  load-bearing and do not relax it for schedule.
- **Next step** — Get Suzanne's ruling on the applied edit as a priority, not
  as part of the general Truth approval. Hold CR10 at the quotation. Answer
  **D15**. When the
  requests go back to the client, say plainly which lines are quotations and
  why they have been held — the reviewer almost certainly did not know he was
  editing a quote, since the prototype renders it as a display pull-quote with
  no attribution visible in the crop.

---

## R18 · ISSUE · Medium — "Innigai" and "Iningai" are both in circulation

- **Form** — kind `issue` · severity `medium` · no likelihood · status `open` ·
  visibility `internal` · owner August
- **Owner** — August
- **What has gone wrong** — Steve writes **"Innigai peoples"**. Every draft and
  every coded file write **"Iningai"** — thirteen lines of the About draft alone,
  plus `src/content/homepage.ts`, `src/content/page-specs.ts` and
  `src/content/site.ts`, including "Iningai Nation" and "Iningai Rangers".
- **Impact** — It is the name of the nation the entire site is about, and it
  appears in the About page's first paragraph. Publishing the wrong spelling is
  worse than the misspelt corporate name already logged as **R15**, and it would
  repeat on every page.
- **Next step** — Confirm the spelling with Suzanne and record it on the
  terminology sheet from **D16**. Do not adopt Steve's spelling on the strength
  of one message. Note the drafts also contain **"Terraburra"** as the clan name
  recorded on an 1884 map, distinct from **Turraburra** the property — confirm
  that pair in the same pass, since it looks like a typo and is not.

---

## R19 · RISK · Medium — SWER and the fuel tanks would be published from a search result

- **Form** — kind `risk` · severity `medium` · likelihood `medium` · status
  `open` · visibility `internal` · owner August
- **Owner** — August, with the client
- **What could go wrong** — CR5 asks for SWER on the Living Work infrastructure
  block, supported by a pasted Google definition of how SWER works in general.
  Nothing states what Turraburra actually has. The same message adds petrol and
  diesel tanks with no capacity, location or purpose.
- **Impact** — Living Work is read by funders, credit buyers and neighbouring
  properties. An infrastructure claim that turns out to be wrong sits next to
  the carbon and biodiversity claims already flagged under **R14** and damages
  the credibility of both. Fuel storage also carries compliance implications
  that a website should not be the first place to describe.
- **Next step** — Request the actual arrangement from the client in their own
  words before writing anything. If it does not arrive, ship the section without
  it — the block is complete as it stands.

---

## R20 · ISSUE · Medium — This round's feedback is incomplete and unconsolidated

- **Form** — kind `issue` · severity `medium` · no likelihood · status `open` ·
  visibility `internal` · owner August
- **Owner** — August
- **What has gone wrong** — The feedback exists as WhatsApp messages captured in
  six screenshots. Within it: one instruction is cut off mid-message (**CR11**),
  Steve states at 10:40 that he has *"more minor wording feedback that is better
  talked through"*, and a `drive.google.com` link at 15:37 has not been opened
  or recorded. Two client emails are also referenced but not seen — updated
  ranger objectives pegged to funding (09:57), and a request for projects to put
  forward for fundraising (10:39).
- **Impact** — Items get lost between rounds, and the ones that get lost are the
  small wording ones nobody can reconstruct. It also means this register is
  known to be partial on the day it is written.
- **Next step** — Get the full thread export and the Drive link; put the "better
  talked through" wording notes on a call and minute them into this file; chase
  both emails. Ask that future rounds come as one document per page.

---

## R21 · RISK · Low — Two pending client emails may reopen settled scope

- **Form** — kind `risk` · severity `low` · likelihood `medium` · status
  `monitoring` · visibility `internal` · owner August
- **Owner** — August, David
- **What could go wrong** — Steve has emailed YACHATDAC for **updated ranger
  objectives pegged to their funding, so the reporting requirements are
  covered** (09:57) and for **projects or specific items to put forward for
  fundraising** (10:39). Neither has landed with us.
- **Impact** — The first is likely to add or reword content in Living Work's
  ranger and *What the work produces* sections, which **R14** already holds
  open. The second points straight at fundraising, and **D13** deferred
  donations out of launch scope with **R8** still open on DGR status. If
  fundraising content arrives, D13 is reopened, not amended.
- **Next step** — Track both. When they arrive, log them here as new change
  requests rather than folding them into an existing one, so the scope movement
  stays visible.

---

# Part 4 — Approved in this round

Worth recording, because approval closes scope as surely as a change request
opens it. All from Steve (FNAN), 24 Aug.

| What was approved | Said | Effect |
| --- | --- | --- |
| The overall approach | 09:51 — *"Looks very in depth… exactly what is needed generally and for our first project"* | General endorsement of the v3 direction |
| **The Truth page** | 15:08 — *"great concise and easy to follow layout"* | Layout endorsed. Its **content** approval is separate and still open under **R5** |
| **"Lore — Continuous"** | 15:08 — *"is great"* | The Lore treatment on Truth stands |
| **The Truth timeline's milestones** | 15:08 — *"Love we have included significant milestones over time, including Suzanne's story, her father's story and publications"* | The timeline's scope is endorsed |
| **The homepage Truth section** | 15:37 — *"Pablito and I particularly like the Truth section on the home page"* | The only item with two named client-side endorsements. Treat as settled and protect it in any hero rework under **CR8** |

Note what this list does *not* cover: no page's **words** are approved by any of
these. Truth remains held by community, and the Welcome to Country is still a
placeholder (**R1**).

---

# Part 5 — What to do next

Steps 1–5 of the original list are done; what follows is what is left as of
7 September 2026. Nothing here is a code change — **every remaining item needs
a person, not a commit.**

1. **Paste the three decision notes into Proyekto** — CR-004, CR-010 and
   CR-006, ready to copy in *Proyekto sync state* above. The MCP connector
   cannot do it; the web UI can, and the rows are sitting in **Awaiting
   decision**. Until then the register misrepresents three resolved requests.
2. **Suzanne, in one conversation** — this is now the only thing blocking the
   round. Three questions, all hers, and they travel together:
   - the **Iningai / Innigai** spelling (**R18**), which is the name of the
     nation and appears on every page;
   - **CR4** and **CR10** as questions against her own quotation — both changes
     made everywhere else, her words alone untouched;
   - "Indigenous" vs "First Nations" (**D16**), which the terminology sheet
     leaves open pending her ruling.
   The corrected **Truth v3** package carries all three.
3. **CR5** — August to supply the actual SWER and fuel-tank arrangement. Do not
   write from the pasted definition (**R19**).
4. **CR11 and the rest of the thread** — the cut-off message, the Drive link,
   the two emails, and the "better talked through" wording notes (**R20**).
5. **The terminology sheet** (**D16**) — it is the thing that stops this
   round repeating in the next one. **Drafted 7 Sep: `docs/terminology.md`.**
   It is explicitly **non-blocking** per F8 — changes requested by Steve or
   August are applied first and the sheet updated to match, not the other way
   round. Two entries still need Suzanne (the Iningai spelling, and
   "Indigenous" vs "First Nations"); everything else is recorded house style.

---

## Appendix — source log

| Time | From | Item | Becomes |
| --- | --- | --- | --- |
| 09:51 | Steve | General endorsement | Part 4 |
| 09:57 | Steve | Emailed YACHATDAC for ranger objectives pegged to funding | R21 |
| 10:04 | Steve | "cultural sites" → "cultural heritage sites" | CR1 |
| 10:19 | Steve | Include SWER; on-site petrol and diesel tanks | CR5, R19 |
| 10:27 | Steve | "Carbon" → "Biological Sequestration" | CR2 |
| 10:39 | Steve | Emailed YACHATDAC for fundraising items | R21 |
| 10:40 | Steve | "more minor wording feedback… better talked through" | R20 |
| 12:30 | Steve | Dinner with Suzanne and Graham | Context — see 15:30 |
| 15:08 | Steve | Truth page, Lore, milestones — approved | Part 4 |
| 15:11 | Steve | "settlers" → "colonists" | CR4, D15, R17 |
| 15:15 | Steve | "Cool Burns" and "right-way fire" → "fire-stick farming" | CR3, D17 |
| 15:19 | Steve | Train via Rockhampton to Barcaldine | CR6 |
| ~15:19 | Steve | *Who comes* — instruction not captured | CR11, R20 |
| 15:23 | Steve | "No town glow" → "Magic at night" | CR7 |
| 15:25 | Steve | Do not use "our"; "Innigai peoples" | CR10, D16, R18 |
| 15:30 | Steve | Will ask Suzanne and Graham what is shared when guesting | Feeds **R13** — Wonder's inclusions |
| 15:31 | Steve | Hero — "maybe something more heroic?" | CR8 |
| 15:34 | Steve | Triple-check "Indigenous" and "First Nations" | D16 |
| 15:36 | Steve | "Guesting On-Country" → "Be our guest"? | CR9 |
| 15:37 | Steve, Pablito | Homepage Truth section — approved | Part 4 |
| 15:37 | Steve | `drive.google.com` link | R20 — not captured |
