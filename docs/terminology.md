# Terminology sheet

*Drafted 7 September 2026. Owner: August. Cultural authority: Suzanne Thompson.*

One page settling the site's words, so the review comments that arrived in
Round 1 (CR1, CR3, CR4, CR10) retire instead of repeating in Round 2.

## How to use this sheet — read this first

**This sheet does not block the build.** It is a record of the house style the
site is already written in, plus the questions still outstanding. Per **F8**
(build-first governance, pre-approval gates lifted 31 Aug), content changes
requested by Steve or August are applied when they are asked for, and this
sheet is updated to match — not consulted for permission first.

The order of operations is:

1. **Apply the change.** A request from Steve (FNAN) or a ruling from August is
   actioned in `src/content/` and the matching draft.
2. **Record it here**, in the same pass.
3. **Confirm with Suzanne** when the terminology package next goes to her.

Where this sheet and the built site disagree, **the site is what shipped and
this sheet is behind** — fix the sheet. The only entries that genuinely gate
anything are the two marked **⚠ NEEDS SUZANNE**, and even those gate
*publication of that specific word*, not the build.

---

## Part 1 — Settled house style

These are in use across the site and are not open questions.

| Term | Use | Not | Where it came from |
| --- | --- | --- | --- |
| **cultural heritage sites** | always | "cultural sites" | CR1, applied 28 Aug |
| **fire-stick farming** | the name of the practice | "cool burns", "cool burning" | CR3, applied 28 Aug |
| **Biological Sequestration** | the Living Work card title | "Carbon" | CR2, applied 28 Aug |
| **Country** (capitalised) | always, when it means Country | "country" | House style throughout; 367 uses |
| **Traditional Custodian** | the families who formed YACHATDAC | — | Used 12×, consistent |
| **Iningai** | the nation, the people, the Country, the lands | **"Innigai"** | See ⚠ R18 below |
| **Turraburra** | the property, since 1 Oct 2020 | "Gracevale" (except historically) | Correct in 83 places |
| **Terraburra** | **only** the 1884-map clan name | anything else | The two words are different things — see below |

### Turraburra and Terraburra are not a typo pair

Worth stating plainly, because it looks like an inconsistency and is not.
**Turraburra** is the property. **Terraburra** is the clan recorded on this
Country in an 1884 map, and the property is *named after* it. Both spellings
are correct, in their own sentence — "renamed it Turraburra, after the
Terraburra clan". Do not "fix" either one. Suzanne should still confirm the
clan spelling, since it comes from a colonial map.

### First person: who "we" and "our" mean

Settled 7 Sep, on August's ruling, answering CR10:

- **YACHATDAC speaking as itself** — "We manage Turraburra", "we renamed it",
  "we were formed by" — **keep the first person.** This is an Aboriginal
  corporation's own website; it is entitled to speak as itself.
- **The site narrating about Iningai people** — use the **third person**:
  "bought back for the Iningai people", "onto Iningai Country". Not "our
  people", not "our Country".
- **Inside a quotation** — change nothing, ever. See Part 2.

---

## Part 2 — The rule that outranks the rest

**Nobody's recorded words are edited to match this sheet.**

Applies to Suzanne Thompson's quotations on Truth, Graham Ambridge's
description of himself on Our People, and any recorded speech added later. If
a term in this sheet appears inside a quotation, it stays as spoken, and the
question goes to the speaker.

Two live instances:

- **`src/content/truth.ts:360`** — Suzanne's quote contains both "the settlers
  had all come" and "our people were off their lands", the two words CR4 and
  CR10 asked to change. **Left exactly as spoken.** Both requests are put to
  her as questions in the Truth v3 draft.
- **`src/content/our-people.ts:80`** — Graham Ambridge "speaks to the settler
  side of this history, which is his own". **Keeps "settler".** His own word
  about himself.

**D15** (who may edit a recorded quotation) is still formally open. This rule
is how the site behaves in the meantime.

---

## Part 3 — Open, and who answers

### ⚠ NEEDS SUZANNE — the Iningai spelling (R18)

The evidence is lopsided but it is still not a ruling. **148** uses of
*Iningai* across `src/content/` and the drafts, plus the Taçon et al. citation
carried on Truth. **Innigai** appears in Steve's WhatsApp messages and, in this
repo, only inside code comments explaining that we did not adopt it.

The site ships **Iningai** on the weight of that evidence. It is the name of a
nation and it should be confirmed by Suzanne regardless of which way it falls.

### ⚠ NEEDS SUZANNE — "Indigenous" vs "First Nations"

Steve, 15:34: *"triple-check"* these. Current state is a genuine mix —
**Indigenous** 23×, **First Nations** 13×, **Aboriginal** 24× (largely in
YACHATDAC's own registered name, which cannot change). No rule has been
applied, because none has been given. **D16** owes this.

### CR3 leftovers — swept 7 Sep

Four live strings had been missed by the 28 Aug pass (three of them image
`expects` / `subject` text, which screen readers read aloud, so they are
published words). Found and swept the same day:

- `src/content/kit.ts:357` — carried **both** retired terms, "A cool burn —
  right-way fire, black ash not scorched ground". Now: *"Fire-stick farming —
  black ash, not scorched ground"*. Rewritten rather than substituted, per
  CR3's own instruction that manner-phrasings be rewritten.
- `src/content/record-media.ts:167` — "after a cool burn" → *"after fire-stick
  farming"*.
- `src/content/truth-media.ts:45` — "— right-way fire" → *"— fire-stick
  farming"*.
- `src/content/lofi/*` — **deliberately left**. Lo-fi is served only under
  `/lab/lofi`, is superseded by the hi-fi build, and is a record of what the
  lo-fi build said. Same reasoning CR3 used to leave `docs/content/STATUS.md`
  alone: historical, not live copy.

No live use of "cool burn" or "right-way fire" now remains outside the
D17-held titles below.

### Held on D17 — the article slug

`/resources/right-way-fire-and-the-carbon-in-the-soil` and its matching titles
keep **"right-way fire"** deliberately. Renaming the term renames the article,
which renames a live route. **D17** decides whether the rename extends that
far; a redirect would be needed either way.

---

## Part 4 — Approval

Suzanne's approval is the one that counts, relayed by August per **D14** and
recorded with the real approver's name, date and basis per **R10**. A tick from
a team member is not the cultural approval.

Against the deliverable's acceptance criteria:

| Criterion | State |
| --- | --- |
| Iningai spelling confirmed with Suzanne | ⚠ open — evidence gathered, ruling outstanding |
| First-person voice ruling recorded | ✅ recorded (Part 1), pending Suzanne's confirmation |
| "Indigenous" / "First Nations" usage ruled | ⚠ open — no rule given |
| Fire-stick farming entry present | ✅ present; four missed strings swept 7 Sep |
| Suzanne's approval relayed and attributed | ⚠ open |
