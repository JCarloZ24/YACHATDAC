# Info request — internal checklist (August + dev)

*Last updated: 14 September 2026*

This is the companion to [YACHATDAC-Website-Info-Form.md](YACHATDAC-Website-Info-Form.md), the
client-facing form. The form covers every **visible** placeholder that a client can answer. This file
covers:

- A: visible holds that have no client answer
- B: copy errors the sweep found in live text
- C: unconfirmed-but-finished-looking content held for round 2, so it isn't lost
- D: where each form answer lands in code

**Scope (Ivy, 14 Sep 2026):** round 1 asks only about what a visitor currently sees as a gap. The
sweep covered every live route: `/`, `/truth`, `/wonder`, `/living-work`, `/about`,
`/our-people`, `/partnerships`, `/the-record` and its articles, `/connect`, `/legal/*`, and the footer.
It excluded `lab/`, `v2/`, `lofi/` and `homepagev2/`.

---

## A. Visible holds with no client answer

| Hold on the site | Needs | Owner | Where |
| --- | --- | --- | --- |
| No domain, so there are no `metadataBase`, sitemap, robots or OG tags | Production domain and hosting account (D11) | David | `src/app/layout.tsx` |
| Cookies §03 `[ analytics provider to confirm — GA4 is not yet configured ]` | GA4 measurement ID, the consent model, and whether "Cookie Settings" is a dialog or a policy page (D4) | David | `src/content/legal.ts:193`, `:199` |
| Newsletter fields look live and do nothing (`/living-work`, `/the-record`) | A provider. The Record's "We will not pass your address to anyone" must match it (R9). | David | `src/components/ui/SignupField.tsx`, `src/app/the-record/_components/Signup.tsx`, `src/content/the-record.ts:463` |
| `/connect` "No form — and that is on purpose" and the "no Connect draft" note | Decide between a form and mailto; write a Connect draft (D10) | August / David | `src/app/connect/_components/Sections.tsx:305-321` |
| `/connect` `[ Email us — no confirmed address yet ]` | Clears once form Part 1 "Main email" lands | dev | `src/app/connect/_components/Sections.tsx:379-384` |
| All three `/legal/*`: specimen banner, `[ date ]`, `[ retention periods to confirm ]`, `[ providers to confirm ]`, `[ refund and cancellation terms to confirm ]`, `[ third-party services to confirm ]` | Counsel's text (R9). Remove `robots: { index: false }` **in the same commit** the text lands. | David + counsel (contact from form Part 3) | `src/content/legal.ts`, `src/app/legal/*/page.tsx:17` |
| Terms §03 `[ this clause is not a template — it must be drafted with the Traditional Owners ]` | The ICIP clause, drafted by counsel with Suzanne. Too heavy for the form, so arrange it separately via Steve. | David, Steve → Suzanne | `src/content/legal.ts:140` |
| `[ Image — Footprint engravings — image awaiting access. ]` | Drive access to file `1QZe4o4Sm-_mFT5_otZDn6jZnzOcmRwOV`, or a local copy | Ivy / August | `src/content/record-media.ts:392-401` |
| Ranger strip slot 7 "At the escarpment" is an empty dashed box | Photo 1.82.1 ("not yet gathered") | August | `src/app/living-work/_components/Sections.tsx:877` |
| Mitchell and Pollen cards print `[ no image supplied in the draft — this card carries type only ]` | Either an image or drop the bracket line. It's a design call, not a client fact. | Ivy / Marc | `src/app/the-record/_components/Grid.tsx:107-110` |
| The Record §06 empty fourth artwork slot | Leonard Mickelo's motif inventory | Marc → Leonard | `src/app/the-record/_components/Sections.tsx:469` |
| `/connect` `[ No hero image — typographic until a frame is chosen ]` | Choose a frame | Ivy / Marc | `src/app/connect/_components/Sections.tsx:193-198` |
| Footer `⚠ R15 — registration numbers not yet supplied` | Remove when ICN and ABN land (form Part 1) | dev | `src/components/layout/SiteFooter.tsx:221-226` |
| `/homepagev2` reachable by URL with no `noindex` | Add `robots: { index: false }` or remove the route | dev | `src/app/homepagev2/page.tsx` |

---

## B. Live copy errors found in the sweep

These articles were supplied text. Flag them to the author, don't silently fix them (house rule: raise
a drift).

- **Star count contradicts itself** in *Wattanuri, and the ones he followed*. It has seven stars plus a
  hidden eighth that is "one of the sisters" (`record-articles.ts:228`, `:248`), then "six of them in
  plain sight, and a seventh hidden" (`:272`).
- **Wall length.** *Gracevale becomes Turraburra* says "Two hundred metres of engravings"
  (`:524`). The markings article says 160 m (`:39`), which the 2 Sep audit confirmed.
- **Turraburra / Terraburra.** `:540` says Gracevale was renamed Turraburra, "the name Christison
  had written down". `:508` says Christison wrote Terraburra. Ask the author whether this means
  "after the name" rather than "the same name".
- **"Walking the country"** (Ranger strip caption, `living-work/_components/Sections.tsx:876`) should be
  *Country* per house style.
- **Stale records:**
  - `wonder.ts:15-17` says the inclusions are "Rendered" (they are not).
  - `homepage.ts:206-210` calls story-wall permission "UNRESOLVED" (`permissions.md` says Available).
  - `about/_components/Sections.tsx:179-181` refers to an Our People marker that was removed 14 Sep.
  - `STATUS.md` doesn't record that change.

---

## C. Held for round 2: reads finished, still unconfirmed

These are not in the client form by decision. They are not placeholders on the page, but none of them is
confirmed. Send them as a second, smaller round once round 1 is back.

**For Suzanne (via Steve)**
- ⚠ **CR4: "colonists" inside her quote** on Truth was applied without her seeing it. The reply to
  Steve carrying the question was never sent (`change-requests.md:458-464`). *This is the most
  serious item here, so consider sending it with round 1 even though it is out of scope.*
- Truth 1902: 35 (her recording) or 37 (published), and whether the count may come before the
  blankets (R5). Shown as "37" on `/truth` and the homepage.
- CR10 "our people" (also the Our People page title) · Ngapartji-Ngapartji (R22) · Iningai vs
  Innigai (R18) · Indigenous vs First Nations (D16) · first-person voice.
- Suzanne's external roles (ERAC membership) on Our People.
- Uncle Vincent vs Uncle Winston Forrester (Our People, Wonder hosts hotspot, buyback article).
- "Mark, and the cousins who camped": full names. Trish Buck and Steve Smith: their roles.

**Consent and photos (R24)**
- Record card 5: two identifiable children, no consent record.
- Wonder full-bleed images with children (`wattle-bloom-gully`, `walking-seed-grass`).
- Adults in the Record hero fly-through · Wonder hosts photo (three named, five unnamed).
- `op-card-01` is shown as Graham Ambridge on Our People with no stand-in marker (About has one).
- `elder-portrait` (1.42.5) on the homepage offer is the frame Truth withdrew as "the wrong man".
- Visiting children in `lw-rangers2` / `lw-rangers5` (Ranger strip).
- No photographer credit anywhere on the site.

**Facts**
- Wonder inclusions line by line, and whether transfers meet the Barcaldine train (R13, CR6) · CR11
  "Who comes" message cut off.
- Homepage Truth sequence years (prototype labels, conflict with Truth's 1886).
- "Dinosaur eggs" on Truth (Wonder already dropped it).
- About partner list: current, active, logos.
- Living Work fill bars (`FILLS = [78, 58, 42, 26, 0]`) are invented. Replace them with form Part 3's
  percentages, or remove them.
- Articles: authors, publish dates and sources for all 11. *It nearly didn't happen* has no sources.
  Other gaps: the deed-signing photo subject, "Tilly" in the seabed article, the ERAC appointment link,
  the carbon-sink claim, the unnamed palaeontologist, and the promised recorder audio.
- Record "In preparation" documents: still committed, and the timing of each.

**August's calls**
- CR8 heroic homepage headline (approved, sequenced last).
- D7 "Enquire" vs "book a consultation".
- Sign-off on hi-fi-only labels across Wonder, Living Work, About and Our People (listed in the
  14 Sep sweep).
- "Walk with us" loader button: needs a Steve / Elder Advisory Group read.
- "fire work" (August's wording) on Wonder vs *fire-stick farming*.

---

## D. Where each form answer lands

Apply every answer in `src/content/` **and** the matching draft **and** `docs/terminology.md` in the
same pass (F8). Flip STATUS rows in the same commit.

| Form item | Code | Also |
| --- | --- | --- |
| Registered name | `src/content/site.ts:16-17`, `src/content/about.ts:37` (fix the "&"/"and" mismatch) | `public/brand/logo-stacked.png` if the spelling changes; `package.json` |
| ICN, ABN | `src/content/site.ts:312-315`, `src/content/contact.ts:50`, `src/content/about.ts:68-69` | remove the footer ⚠ R15 line; close R15 |
| Street address, PO Box | `src/content/contact.ts:41-42` | About and Our People drafts |
| Main email, phone, hours | `src/content/contact.ts:44-49`, `:107-108`; `/connect` primary action | R23 #1 |
| Per-purpose emails | `src/content/contact.ts` (new rows only if different) | `src/content/legal.ts:110` privacy contact |
| Reply time | `src/content/the-record.ts:452` | R23 #2, STATUS note 13 |
| Social links | `src/content/site.ts:300-306` (remove unused networks) | footer icon row |
| Documents | `public/` files + `src/content/the-record.ts:363-389`; Wonder brochure `src/app/wonder/_components/Sections.tsx:1528-1551` | R14 (brochure) |
| Research protocol | `src/content/the-record.ts:411-417`, `src/content/partnerships.ts:141-146` | |
| Rainbow Credits | `src/content/living-work.ts:407-412`, `:433` | Living Work v3 draft, R14 |
| Project statuses | `src/content/living-work.ts:386-415` (drop `outputsNote` when all are confirmed) | `FILLS` in `living-work/_components/Sections.tsx:84` |
| SWER / fuel | `src/content/living-work.ts:321-337` | CR5, R19 |
| Partnership answers | `src/content/partnerships.ts:141-146`, `partnerships/_components/Sections.tsx:1242-1319` | |
| Three stories | `src/content/record-articles.ts` (`a-day-with-the-rangers`, `when-they-called-it-the-art-gallery`, `cultural-knowledge-precinct`) | new drafts in `docs/content/drafts/the-record/articles/` |
| Refund policy, solicitor | `src/content/legal.ts:146` | R9 |
| Team, rangers | `src/content/our-people.ts:70-89`; Ranger names `src/app/living-work/_components/RangerCarousel.tsx` | `kit.ts` portraits; About Graham stand-in `about/_components/Sections.tsx:1855-1868` |
| Board, Elder Advisory Group | `src/content/our-people.ts:91-104`, `src/content/about.ts:168-169` | tense note |
| Welcome to Country | `src/content/homepage.ts:398-404` (flip `status`); heading `SiteFooter.tsx:171` | R1 |
| David Thompson photo | `src/content/truth-media.ts:233-246` | |
| The ones who got us here | `src/content/our-people.ts:124-162` | |
| Buyback names | `src/content/record-articles.ts:155`, `:216` | article md; `docs/terminology.md:224-225` |
