# Content status board

*Last updated: 10 September 2026*

One row per document. Update it in the same commit that moves a file between
folders.

**Circle** is the internal governance tag (build documentation §12) — `open`,
`shared with care`, or `held by community`. It is never shown to visitors, but
it decides who has to sign off.

## Documents

| Document | Page | State | Circle | Blocked on |
| --- | --- | --- | --- | --- |
| `drafts/homepage/YACHATDAC-Homepage-Copy-v3.md` | Homepage | 📥 **v3** uploaded | open | Welcome to Country is marked draft for Suzanne — note 1 |
| `drafts/wonder/YACHATDAC-Wonder-Copy-v3.md` | Wonder | 📥 **v3** uploaded, "Getting here" revised 10 Sep 2026 | open | Inclusions still unconfirmed; cost now answered — note 7. Getting here rewritten on user direction (Redford story, per-stop details and Gray Rock coda removed); applied to `src/content/wonder.ts` in the same pass |
| `drafts/truth/YACHATDAC-Truth-Copy-v3.md` | Truth | 📥 **v3** uploaded | **held by community** | **Suzanne Thompson's approval — stated on the document itself.** Both her questions are still open — note 5 |
| `drafts/living-work/YACHATDAC-LivingWork-Copy-v3.md` | Living Work | 📥 **v3** uploaded | shared with care | Rainbow Credits unwritten; status labels unconfirmed — note 8 |
| `drafts/resources/YACHATDAC-Resources-Copy-v1.md` | Resources — "The Record" | 📥 **v1** uploaded | open | First draft of this page. Access-request response time and contact point unwritten — note 13 |
| `drafts/connect/YACHATDAC-About-Copy-v1.md` | About | 📥 **v1** uploaded | open | ICN/ABN missing; legal-name spelling unconfirmed — notes 10, 13 |
| `drafts/connect/YACHATDAC-OurPeople-Copy-v1.md` | Our People | 📥 **v1** uploaded | shared with care | Names, roles, photographs and consent to be named — note 13 |
| `sitemap/YACHATDAC-Sitemap-v1.png` | Site-wide | 📥 draft uploaded | open | Partly overtaken by D1 and D3, and now by v3's own nav — notes 6, 9 |

**v3 uploaded 24 Aug 2026**, replacing the v2 set from 20 Aug. Two things are
different about this upload:

1. **It arrived as HTML prototypes, not text documents.** Seven coded pages,
   Drive export `drive-download-20260824T052412Z-1-001`. Each has been
   converted to Markdown so it can be diffed and reviewed; the converted file
   carries a header recording which prototype it came from. Per **D5** the
   conversion keeps the **copy** and drops the layout, styling, scroll
   behaviour and interaction — those belong to the wireframes, not to a copy
   draft. Where a prototype implies a layout, it is a suggestion.
2. **It covers three pages that had no draft before** — Resources ("The
   Record"), About, and Our People. About and Our People are filed under
   `drafts/connect/` because build documentation §2 and `src/content/site.ts`
   put both under Connect. That is a **filing choice, not an answer to D2** —
   the prototypes themselves link to `/about` and `/our-people` as top-level
   routes. See note 13.

The v2 files are deleted rather than kept alongside — git history holds them.

**The embedded photography was not imported.** The seven prototypes carry 61
base64 JPEGs between them, about 12 MB. Per note 12 these are placeholder
direction, so each converted file records the slot and its art direction as an
`[ Image — … ]` marker instead. The originals stay in the Drive export. If any
of them turn out to be real commissioned assets rather than placeholders, they
need extracting properly into `public/` — raise it rather than pasting base64
back into a draft.

Nothing here is approved; nothing here has been built from. Per D5 these
documents govern **copy**, so where the repo disagrees with them, the repo is
what changes.

## What v3 changed

| | Change | Consequence |
| --- | --- | --- |
| **Acknowledgement rewritten** | The Northern Territory paragraph is **gone**. The footer now reads "Turraburra is Iningai Country. We are its Traditional Custodians, and we are still here." | **Closes the copy half of note 1 / R1.** The new text is marked "[ DRAFT for Suzanne to correct or replace ]" and notes it is a statement of custodianship and welcome, *not* an Acknowledgement. Her words are still outstanding. |
| **Homepage is six beats, not seven** | The standalone **Living Work** beat is gone. It survives only as an Invitation card. | Supersedes the seven-beat structure in `src/content/homepage.ts` and build documentation §3. Note 11. |
| **Homepage Truth beat replaced** | The "What's etched in stone doesn't forget" beat is replaced by a scroll-driven sequence: Iningai Nation → 1861 → 1862 → 1886 → 1902, ending on the thirty-seven at Lake Dolly. | **Closes note 2b** — the sentence fragment is gone with the sentence. The new copy says "fifteen thousand markings cut into a wall nobody has dated", consistent with note 2. |
| **Belonging rewritten into first person** | "Some of us never left. Others are still coming back," with Polly and Billy named. | Was third-person in v2 ("For the Iningai Nation, this has always been Country"). Note 11. |
| **Way Forward gains four pathways** | Come on Country / Research with us / Ranger exchange / Read the record, each with its own destination. | v2 had body copy and a signup only. `WayForward.tsx` renders neither the pathways nor the tagline. Note 11. |
| **Wonder cost answered** | "No fixed dates and no pricing on this page — every stay is arranged with you." | **Answers the COST half of note 7 / R13.** The inclusions half is still marked NEEDS CONFIRMATION. |
| **New nav, new routes** | Header: Wonder / Truth / Living Work / The Record / About, plus a *Get in touch* button. Prototypes link `/about`, `/our-people`, `/partnerships`, `/resources`. | Three of those routes do not exist in `src/content/site.ts` or in the sitemap. Evidence for D2, not an answer to it. Note 13. |
| **Resources is called "The Record"** | The page and every link to it use *The Record*; `src/content/site.ts` calls it *Resources*. | One of the two names has to win before nav is built. Note 13. |
| **Dating unchanged** | Truth and Resources both still say the site has never been scientifically dated. | R2 stands as re-recorded on 20 Aug. No new claim. |
| **Rainbow Credits unchanged** | Still "[ For YACHATDAC to write ]", status labels still "to be confirmed". | Note 8 and R14 unchanged. |

## What v2 changed

| | Change | Consequence |
| --- | --- | --- |
| **Dating reversed** | All three v2 drafts now say the site has **never been scientifically dated**. The 55,000 figure is gone everywhere. | **Reverses the answer recorded for R2 on 20 Aug.** See note 2 — this is the most important thing in the upload. |
| **Failure section cut** | Living Work's "The parts that are not in the annual report" is gone, replaced by an expandable **Our challenges** list. | **Supersedes decision D6**, which recorded "keep". Note 3. |
| **Fee-for-service placed** | Living Work now carries it as a *Being developed* card plus a **Land management services** pathway with an Enquire CTA. No prices. | **Satisfies D7.** Note 4. |
| **Acknowledgement unchanged** | Footer still reads "the Aboriginal people of the Northern Territory". | R1 unchanged and now overdue. Note 1. |
| **Nav shown as five items** | Homepage footer nav: About / Wonder / Truth / Living Work / Resources. No Connect, no Contact. | Bears on D2, but a copy draft does not govern IA. Note 9. |
| **Marra Wonga study cited in full** | Truth v2 carries the citation and DOI URL. | Closes R2's "confirmed but unattributed" gap — against a different figure. |

## Notes to resolve

These came out of reading the drafts. None of them block uploading — they block
publishing.

### 1. Acknowledgement of Country names the wrong jurisdiction

The homepage draft footer reads *"…the Aboriginal people of the **Northern
Territory**…"*. YACHATDAC is on **Iningai Country, Central Western Queensland**
— Turraburra sits 120km north of Barcaldine. This reads as boilerplate carried
over from another organisation's site.

For an organisation whose entire proposition is that the Iningai were written
out of the record, an acknowledgement naming the wrong Country is the single
worst copy error available on this site. It must not ship.

Related: open decision 3 — Suzanne is an actual Traditional Owner, so a genuine
**Welcome to Country** in her own words is possible here, which is rarer than
the Acknowledgement most sites carry. Her wording is still outstanding.

**Unchanged in v2 (20 Aug).** The footer paragraph is carried over
word-for-word, Northern Territory included. Two rounds of drafting have now
passed over it. Steve (FNAN) reviews the jurisdiction, Suzanne owns the words —
see R1. Note v2 also renames homepage section 1 to "Welcome to Country", which
is a *section heading*, not the footer paragraph; the two should not be confused
when this is finally fixed.

**Fixed in v3 (24 Aug) — as copy. ✅** The Northern Territory paragraph is gone.
The footer now opens *"Turraburra is Iningai Country. We are its Traditional
Custodians, and we are still here."* and carries its own build note:

> [ DRAFT for Suzanne to correct or replace. Note this is written as a
> statement of custodianship and a welcome, not an Acknowledgement of Country —
> an acknowledgement is made by visitors to Country that is not their own. ]

That distinction is right, and it is the point open decision 3 was circling.
**R1 is not closed**: the jurisdiction error is fixed, but the words are still a
drafter's placeholder awaiting Suzanne. Re-scope R1 from *"names the wrong
Country"* to *"awaiting Suzanne's own words"*, which is a much smaller risk.

`src/content/homepage.ts` deliberately never carried the NT wording (D5's one
exception), so nothing in code has to be unwound — but it now carries a
different placeholder from the draft's. Note 11.

### 2. Story wall dating — v2 reverses the answer

The v1 set disagreed by a factor of ten: 55,000 on Homepage and Wonder, 5,000
on the Truth timeline. On 20 Aug that was recorded as resolved at **55,000**.

**v2 says neither.** All three drafts now agree the site has **never been
scientifically dated**:

| v2 draft | Claim |
| --- | --- |
| Homepage | "over 15,000 markings across 160 metres of wall. **Nobody has dated it.** The wasp nests that could be still sitting over the engravings, waiting for someone to ask." |
| Wonder | "**Never scientifically dated**" (bullet, in the walk-out-to-the-wall list) |
| Truth | "The site has **never been scientifically dated**. The pecked designs are **likely more than 5,000 years old on regional style sequences**; mud wasp nests over some engravings **could give minimum ages if they are ever sampled**." |

This is now internally consistent, sourced, and defensible — Truth v2 carries
the full citation (Marra Wonga, *Australian Archaeology*, 2022, with DOI). The
wasp nests are a method that *could* be used, not a dating that *was* done. The
v1 homepage sentence — "A wasp nest built over the story wall's markings let
researchers date them — at least 55,000 years old" — appears to have been the
error all along, and 55,000 has no source behind it.

**Consequences**

1. **The 20 Aug answer to R2 is superseded.** Re-record it as: never dated;
   >5,000 on style sequences; wasp nests are an untaken opportunity.
2. **`src/content/homepage.ts` is now wrong** — it still carries the 55,000
   sentence, synced from v1 under D5. The v2 wording must replace it. This is a
   factual claim about cultural heritage, so it is the highest-priority code
   change in the repo.
3. The ⚠ comment above the Truth beat in that file describes the old 55,000 vs
   5,000 conflict and should go with it.
4. **Confirm the reversal is deliberate**, not a drafting slip — it is a large
   public claim to have carried through v1 and then dropped.

### 2b. The homepage Truth sentence does not parse — gone in v3 ✅

"The wasp nests that could be still sitting over the engravings, waiting for
someone to ask." is not a sentence. Whatever it becomes, it needs rewriting
before it is copied into code.

**Resolved by deletion (24 Aug).** v3 replaces the whole homepage Truth beat.
The fragment is gone along with the sentence it sat in. The replacement says
*"fifteen thousand markings cut into a wall nobody has dated"*, which is
consistent with note 2 and parses. `src/content/homepage.ts` still carries the
fragment verbatim, with the probable repair recorded in a comment — that
comment and the sentence both go when the file is synced. Note 11.

### 3. "The parts that are not in the annual report" — cut in v2

The v1 draft carried a failure section written for practitioners: the broken
grader, the failed bore pump. On 20 Aug that was recorded as **keep** (D6), on
the reasoning that the pillar's audience is other Indigenous communities and
failures are more useful to them than successes.

**It is not in v2.** In its place is **Our challenges** — an expandable list of
thirteen items covering overgrazing, degraded springs, soil carbon loss,
wrong-way fire, weeds and ferals, heat and drought, distance from town, no phone
reception, water security, site damage, unidentified species, ranger funding
ahead of income, and natural-capital market volatility.

That is a different thing. The challenges list describes the **condition of the
Country and the organisation's exposure**; the failure section described **work
this organisation tried that did not work**. The candour survives in places —
the spring that took a thousand litres carted twice a day for eight days, rangers
"learning the job as it went" — but as detail inside success stories rather than
as a section that names failures.

**Per D5 the document wins, so D6 is superseded.** Worth one confirmation that
the cut was deliberate rather than lost in the rewrite, since D6 was recorded as
"keep" only hours earlier.

### 4. Fee-for-service land management — placed in v2 ✅

**Resolved.** Living Work v2 carries it twice, exactly as D7 specified:

- Under *What the work produces*, a **Being developed** card: "Fee-for-service —
  Ranger skills offered to neighbouring properties: right-way fire, land
  management and cultural heritage advice."
- Under *Get involved*, a **Land management services** pathway: "Right-way fire,
  cultural heritage advice and Country management for properties in the
  district", with an **Enquire** call to action.

No prices published ✅, informational ✅, ends in an enquiry ✅. One small
difference from the decision as recorded: D7 said "book a consultation" and the
draft says "Enquire". Not a conflict — worth picking one word for the button.

### 5. Truth page structure, and Suzanne's two questions

**Structure confirmed in v2.** The page runs present → past: *ahead* (the
Cultural Knowledge Precinct, within five years) → *today* → 2022 → 2026 back to
2003 → the 1950s → **the seam** → 1840s → the engraving → 100 million years ago.
`src/content/page-specs.ts` still lists Truth as a conventional stack of
sections and is now the stale artefact — reconcile it, per D5.

**The seam** is a full-bleed dark break carrying Suzanne's words, marked in the
document as not publishable until she has seen and approved it. Unchanged, and
still the reason this document is `held by community`.

**She now has two questions to answer, not one.** v1 asked only about
re-ordering. v2 asks both:

1. Whether re-ordering so the count comes before the blankets is right.
2. **The number itself** — "Your recording says thirty-five; the published
   figure is thirty-seven adults and three children. Change it back if yours is
   the one that stands."

The draft currently runs with **thirty-seven**, sourced to Hoch (1986) as cited
in Taçon et al. 2022. Anything written against "thirty-five" is out of date.

**Two drifts between the draft and the build, noted 10 September 2026. Neither
is fixed here — raise them, do not reconcile them silently.**

1. The draft capitalises "**B**lankets" (`YACHATDAC-Truth-Copy-v3.md:217`);
   `src/content/truth.ts` has lowercase. Pre-existing, and the terminology
   sheet's own precedence rule says the site is what shipped.
2. `truth.ts` now stores each figure's leading numeral separately from its
   sentence, so the count screen can set the number in the display face and the
   year as its marker. **No word changed and the draft is untouched** — rejoin
   the two fields with a space and the draft's line is back exactly. D5 still
   governs the wording; the split is presentational only.

**Unchanged in v3 (24 Aug).** Both questions are still on the page, in the same
words, and the seam still carries *"Draft — Suzanne's words, awaiting her
approval"*. The prototype also adds a **build note** beside the seam — *"The
descent stops here. No rail, no markers, nothing else on screen, and no way past
it. It resumes below, older."* That is a design instruction sitting inside a
copy draft; under D5 it is direction for the wireframes, not a decision.

The structure is confirmed again in v3, one level deeper: *ahead* → *today* →
2022 → 2026 → 2003 → 1950s → **the seam** → 1840s → the engraving → 100 million
years ago, with a lane label on each entry (*Lore — continuous*, *Written
record*, *Living memory*, *Science*). `src/content/page-specs.ts` has been
deleted; the per-page content files (`src/content/truth.ts`,
`src/content/wonder.ts`, etc.) are its replacement.

### 6. Sitemap diverges from the build documentation IA

The uploaded sitemap is not the same information architecture as build
documentation §2, which is what `src/content/site.ts` is currently built from.
The differences are structural, not cosmetic, so the code has deliberately
**not** been changed — this needs a decision first.

**New top-level areas**

| In the sitemap | Build documentation says | Question |
| --- | --- | --- |
| **Blog** — Bookmarks, Categories, Archives, Search Blog, Blog Interior | One unified Blog/Editorial collection, surfaced through Resources/Explore. §4 is explicit that Resources *is* the content hub. | Are Blog and Resources two areas, or one collection surfaced twice? Two browse interfaces over the same posts will confuse both editors and visitors. If they are one thing, which name wins? |
| **Contact** — its own page with a contact form | The Connect index carries the general contact form, distinct from Truth's partner enquiry and Wonder's register-interest. | Is Contact replacing the Connect index, or sitting beside it? |
| **About** promoted into the navbar, separate from Connect | About YACHATDAC sits under Connect. | Does Connect survive as a nav item if About is lifted out of it? |
| **FAQs** in the footer | Not mentioned anywhere in the build documentation. | New content type with no spec — who writes it, and is it CMS-managed? |

**Things the sitemap drops**

- **Partnership opportunities** on Truth. §4 has this as a section distinct from
  research opportunities, aimed at the ESG/brand-buyer audience rather than
  researchers. The sitemap's Truth has only Open Research Opportunities.
- **Donations** and **Merch**. §7 has donations as live scope at launch and
  merch built-but-feature-flagged. Neither appears anywhere in the sitemap.
- **Site search** as a destination. §15 calls for in-site search across posts,
  opportunities, jobs and experiences; the sitemap has "Search Blog" scoped to
  Blog only.
- **Living Work** from the footer, though the other pillars are there.
- **The Cultural Knowledge Precinct** from the footer's Truth column.

**Probable errors in the diagram rather than decisions**

- Footer parent list reads About, Wonder, **Turth**, Resources, FAQs, Policies —
  "Truth" is misspelt.
- The footer's parent list and its child boxes do not line up: **FAQs** has no
  child box, and there is a **Connect** child box with no parent entry.
- That footer **Connect** column is character-for-character identical to the
  Resources column — Stories, News / Updates, Downloads, Videos / Podcasts.
  Reads as a copy-paste rather than an intent.

**Legend**

Green, orange and amber are used throughout with no key on the diagram. Adding
one would make the next review much faster — and if the colours encode build
status, that belongs in this status board too.

**Naming**

The sitemap says **Terms & Conditions** and adds a **Cookie Policy**; the repo
currently has `/legal/privacy` and `/legal/terms` ("Terms of Use") and no cookie
policy route. §11 does call for a cookie/consent notice, so the sitemap is
likely right — worth confirming the label before the routes are renamed, since
changing a legal page's URL after launch is avoidable churn.

---

### 7. Wonder — inclusions and cost are unwritten, and the draft says so

Two blocking gaps, both flagged in the document itself:

- *What's included / Guiding / Camping / Transfers* carries **"NEEDS
  CONFIRMATION — every line above. This section is the most common reason an
  enquiry does not happen."**
- **"COST — still undecided.** Publish a from-price, or state plainly that it is
  quoted per group."

The page is built around a sticky enquiry panel, so both sit directly on the
page's one conversion. See R13.

Also in v2: the day-by-day *2 Night / 3 Day* outline is **gone**, replaced by
stages (Arriving / The first night / Walking out to Marra Wonga / …) and the
explicit line "We do not run a set itinerary, because the work does not." That
closes the old *guesting itinerary validation* question — there is no
reconstructed itinerary left to validate — and makes
`src/content/page-specs.ts` stale where it describes "the 2 Night, 3 Day
Guesting on Country experience".

New names to record: **Graham Ambridge** hosts alongside Suzanne.

**v3 (24 Aug): cost answered, inclusions still not. Half-resolved.**

- **COST ✅** — the page now ends on *"No fixed dates and no pricing on this
  page — every stay is arranged with you."* That is the second of the two
  options the draft itself offered, stated plainly. R13's pricing half closes.
- **Inclusions ✗** — the section is now written out (Meals / Guiding / Camping /
  Transfers, with Suzanne, Graham and the Iningai Rangers named as hosts) but
  still carries **"NEEDS CONFIRMATION — every line above needs Suzanne or Steve
  to confirm before publishing."** Two of the lines are placeholders in
  substance as well as status: *"What we provide and what you bring"* is not an
  answer to what is provided.

### 8. Living Work — Rainbow Credits is unwritten, and the status labels are not confirmed

- The **Rainbow Credits** card is marked **"FOR YACHATDAC TO WRITE"**: "Needs
  describing in your words: what it is, what is measured, who it is for, and
  where it sits with the Rainbow Foundation."
- **"Status labels to be confirmed before publishing"** — *Registration
  underway*, *Building the record*, *In progress*, *Being developed*. These are
  public claims about regulatory and certification status, so they are not
  cosmetic.
- The draft also notes **"Consider a fourth card for donations if DGR status is
  in place"** — consistent with D13, and a useful marker for what to switch on
  when DGR lands.

See R14.

**Unchanged in v3 (24 Aug).** Both markers are carried over word for word —
*"[ For YACHATDAC to write ]"* on Rainbow Credits and *"[ Status labels to be
confirmed before publishing. ]"* under the card grid. Three rounds of drafting
have now passed over the status labels, which are public claims about
regulatory and certification standing. R14 unchanged.

### 9. Nav and routes disagree between drafts

Homepage v2's footer nav reads **About / Wonder / Truth / Living Work /
Resources** — no Connect, no Contact. But Truth v2 links a partnerships card to
**`/connect`**, and another to **`/partnerships/#research-opportunities`**, which
is a route in neither the nav nor the sitemap.

D5 gives the drafts authority over **copy**, not IA — the wireframes hold that.
So this is *evidence* for D2, not an answer to it: it suggests Connect survives
as a destination even where it is not in the nav. Take it to Marc's lo-fi review
rather than acting on it.

Related: Wonder v2 specifies its story feed as **"three most recent Resources
posts tagged #lore, #country or #guesting. Editor can pin the first slot. Falls
back to most recent overall."** The build documentation's settled position is
that pillar feeds are **hand-picked by editors, not query-driven**. v2 is a
pinned-plus-query hybrid. Small, but it contradicts something on the do-not-reopen
list, so David should model it deliberately rather than inherit it.

**v3 (24 Aug) hardens the evidence and adds to it.** The homepage prototype now
has a real header nav — **Wonder / Truth / Living Work / The Record / About**,
with *Get in touch* as a button rather than a nav item. Connect is reachable
from that button and from four other places, but it is not in the nav. That is
the same shape as v2's footer nav, arrived at twice. See note 13 for the routes
this introduces and the Resources / "The Record" naming clash.

Wonder v3 keeps the pinned-plus-query story feed unchanged, in the same words.

### 10. The organisation's legal name is unconfirmed

Homepage v2 footer: "[ Yambangku Aboriginal Cultural Heritage and Tourism
Development Aboriginal Corporation — **confirm spelling against ORIC
registration** ]". The repo spells it out in `src/content/site.ts`. Worth
checking against the actual ORIC record before it ships in a footer on every
page. See R15.

**Still unconfirmed in v3 (24 Aug), and now asked in two places.** The homepage
footer carries *"[ Confirm spelling: Yambangku or Yumbangku. ]"*, and the About
draft carries *"[ Add ICN and ABN. Confirm spelling: Yambangku or Yumbangku —
the logo and the published research differ. ]"*. The About draft is the first
document to say **why** there is a doubt: the logo and the published research
do not agree. ICN and ABN are also still blank on the homepage footer, the About
page and the Our People contact block. R15 unchanged, now with a stated cause.

### 11. What the code now owes the drafts

Under D5 these are the repo's problems, not the documents':

| File | Drift | State |
| --- | --- | --- |
| `src/content/homepage.ts` | Truth beat carried the withdrawn 55,000 claim (note 2); Invitation card eyebrows read *Guesting on Country / Research & Discovery / Caring for Country* against v2's **Guesting On-Country / Legacy, Research & Discovery / Caring for Country**; card 2 description said *Indigenous* where v2 says **Iningai**. | ✅ **Synced to v2, 20 Aug.** The v2 Truth sentence is transcribed verbatim including its fragment — see note 2b — with the probable repair recorded in a comment rather than applied. v2's tagline "Ancient traditions walking together with contemporary visions" is added as a field but **not rendered**; wiring it into `WayForward.tsx` is a design call and waits on the wireframes. **Now stale against v3** — see the v3 row below. |
| `src/content/homepage.ts` **vs v3** | Six beats, not seven — the Living Work beat is gone. Truth beat replaced entirely (the 1861→1902 sequence). Belonging rewritten into first person. Invitation card eyebrows and all three descriptions rewritten. Way Forward body rewritten and gains four pathways. Footer acknowledgement rewritten. | ⬜ **Open — deliberately not synced on 24 Aug.** This is not a wording refresh; it changes the section count and replaces the page's most sensitive beat. It also touches the Welcome to Country placeholder, which is `awaiting-suzanne` and must not be filled from a draft that marks itself *"DRAFT for Suzanne to correct or replace"*. Sync as its own change, with the beat-count question settled first. |
| `src/content/page-specs.ts` | Truth as a section stack, not a reverse chronology (note 5). "2 Night, 3 Day Guesting on Country experience" no longer exists (note 7). | ⬜ Open — v3 confirms both, and adds Resources, About and Our People, which the spec does not describe at all. |
| `src/content/site.ts` | Legal name spelling unconfirmed (note 10). Nav question is D2's, not a sync. | ⬜ Open — v3 adds the Resources / "The Record" label clash and the `/about`, `/our-people`, `/partnerships` routes. Note 13. |

### 12. The imagery in the drafts is placeholder direction

Confirmed 20 Aug: **the images are just placeholders.** Every bracketed image,
gallery and carousel block in the v2 documents — the full-bleed hero, the
six-slot Wonder gallery, the rotating Ranger carousel, the "image row — the
camp, honestly" — describes *what a shot should carry*, not an asset that
exists. None of them names a file.

Consequences worth holding on to:

- Treat every slot as **swap-in-ready**, the same way commissioned artwork is
  already treated. Do not build layout that depends on a particular crop or
  aspect ratio.
- The `mediaNote` fields in `src/content/homepage.ts` are art direction, not an
  asset manifest. That is now stated in the file.
- This does **not** soften R11 (media size and compression targets). Targets
  should be set before real media is graded, and placeholders are the cheapest
  time to set them.
- R12 (logo vectors and the Good Dog Cool face) is unaffected — those are
  identity assets, not photography.

**v3 (24 Aug) puts pictures in the slots, and they still look like
placeholders.** The prototypes embed 61 base64 JPEGs — 30 on Wonder, 15 on
Living Work, 11 on Resources, 3 on Truth, 1 each on Homepage and About, none on
Our People. The same file sizes recur across pages, so it is a small pool of
images reused to fill a layout rather than a shot list.

They have **not** been imported. Committing 12 MB of base64 into a copy draft
would make the file undiffable and would dress placeholder art up as an asset
manifest, which is exactly what this note warns against. Each converted draft
records the slot and its alt text as `[ Image — … ]` instead, and the originals
stay in the Drive export.

**One thing to confirm:** whether any of the 61 are real commissioned or
on-Country photographs rather than fillers. If they are, they need extracting
into `public/` as files with credits and permissions attached — particularly
anything showing the escarpment wall, which is still governed by the
unresolved story-wall imagery permission.

### 13. v3 introduces three new pages and four routes that do not exist

New in this upload, with no earlier version to compare against:

| Draft | Page | Notes |
| --- | --- | --- |
| `YACHATDAC-Resources-Copy-v1.md` | Resources | Titled **"The Record"** throughout. Filterable index (type / source / sort / search), thirteen story cards, a *What we do not know* block, documents and reports, an access-request path for material marked "on request", and a subscribe block. The access path is marked *"[ Response time and contact point to confirm. ]"* |
| `YACHATDAC-About-Copy-v1.md` | About | Organisation, registration, strategic plan framing, partners. ICN and ABN blank; legal-name spelling queried — note 10. |
| `YACHATDAC-OurPeople-Copy-v1.md` | Our People | Suzanne, Graham Ambridge, then **placeholder rows** for Rangers, operations, cultural heritage, guesting and three board seats. Also *"The ones who got us here"* — a named list of people outside the organisation. |

**Our People is the most governance-sensitive of the three.** It names people
who have passed, names living people who have not yet consented to be named or
photographed, and its own notes say so:

> [ Rangers are the heart of Living Work and are currently unnamed across the
> site. Full list needed, with consent to be named and photographed. ]
>
> [ Every name here needs checking. The buyback recording garbles most of them
> — see the verification list. ]
>
> [ Suzanne to complete. Names of people who have passed need her decision on
> inclusion. ]

Filed as `shared with care`. It should not go to `in-review` until the consent
question is answered, and the decision on naming people who have passed is
Suzanne's, not an editorial one.

**Routes the prototypes link to that the repo does not have:** `/about`,
`/our-people`, `/partnerships` (and `/partnerships/#research-opportunities`).
`src/content/site.ts` has `/connect`, `/resources`, and the three pillars.
Per D5 this is copy evidence, not an IA decision — take it to D2 with note 9
rather than adding routes off the back of a draft.

**A naming clash to settle before nav is built:** every v3 page calls the hub
**The Record**; the repo and build documentation §4 call it **Resources**. The
route `/resources` is used consistently in both, so this is a label question,
not a routing one — but it is on every page, so pick one.


## Notes from the About and The Record drafts (21 Aug 2026)

Same rule as above: none of these block uploading. They block publishing — and
note 15 wants an answer before other people build on them.

Two notes from this pass are gone: the legal-name spelling is now note 10, which
states the cause the About draft gave; and the 18.6MB of extracted draft imagery
is settled — the raw Drive exports are parked outside git, see `.gitignore`.

### 14. The Record supersedes the Truth page tail

The Truth page currently ends with five structured blocks — *The browsable
record · What's been researched · Open research opportunities · Partnership
opportunities · Partner with us*. They come from build documentation §4 via
`src/content/page-specs.ts`, and they are **uncommissioned**. `src/content/truth.ts`
already carries the warning on its own face:

> ⚠ NO SOURCE COPY EXISTS. The copy document ends at the Wattanuri entry, so
> roughly a fifth of this page is uncommissioned … Retaining it is a decision.

The Record draft now writes real copy for the same content, on Resources:

| Truth tail block (no copy) | The Record draft (written copy) |
| --- | --- |
| The browsable record | **Everything in the record** — filter bar plus 13 written entries |
| What's been researched | the `Research` type and `Published research` source facets on that same grid |
| Open research opportunities | **What we do not know** — four written gaps, CTA to `/partnerships/#research-opportunities` |

So the draft routes research opportunities **off Truth entirely**. Note 6 already
recorded that the uploaded sitemap drops Partnership opportunities from Truth;
this is the second source to move the same material away.

There is also a structural argument, raised at the 21 Aug lo-fi walkthrough. The
Truth lo-fi frame is 14,205px tall. The descent's last entry is Wattanuri, whose
closing line is *"Lore is not a date. It is the floor everything above has been
resting on the whole way down."* Roughly **313vh** of card grids and a form then
follow it — four filterable grids placed underneath the floor the copy has just
declared. It contradicts the structural claim the page makes about itself.

**`#partner` is the exception and must stay on Truth.** The About draft's own
contact router sends *"Research or partnership"* to `/truth#partner`, and Living
Work links the same anchor.

Raised as **D20**. Nothing in `src/` has been changed. Note that if D20 lands as
proposed, `/truth#researched` and `/truth#opportunities` in `src/content/site.ts`
retarget to `/resources` — which changes the primary navigation, so it is not a
page-local edit.

### 15. The Record's taxonomy does not match the content model in code

`resourcesHub.contentTypes` in `src/content/site.ts` is a single flat list:

> History · Research · Publication · Event · Activity · Story · Update

The draft uses a different list, and **a second facet axis that does not exist in
the code at all**:

| Axis | Values in the draft |
| --- | --- |
| Type | Stories · Historical accounts · Research · Documentation · Recordings |
| Source | Iningai knowledge · Colonial record · Published research |

`Event`, `Activity` and `Update` are gone. `Event` in particular collides with a
settled position — *"no separate Events page; Event is a content type inside
Resources"* — so dropping it has to be deliberate rather than an omission.

The source axis is the more interesting half: it is an epistemology, not a
format. *Who says so* is exactly the distinction the Truth page is built on, and
carrying it as a filter on the record is a stronger idea than the flat type list
currently modelled. It is also a second dimension on every entry, which makes it
David's content model rather than a copy question. Raised as **D21**.

### 16. Two routes are referenced that do not exist

- The Record draft links `/partnerships/#research-opportunities`. There is no
  partnerships page in `src/content/site.ts` or in the build documentation, and
  §4 places research opportunities on Truth. Raised as **D22** — and it is the
  same question as D20 seen from the other end.
- The About draft links `/our-people`. Build documentation §4 has *The YACHATDAC
  Team* and *About Suzanne Thompson* as separate items under Connect, not a
  combined people page. Raised as **D23**.

Both drafts' internal links carry a `docs.google.com/` host prefix throughout.
That is an export artefact; the path after the host is the intent.

### 17. "Ngapartji-Ngapartji is Western Desert language, not Iningai"

The About draft raises this itself, against the Strategic Plan's own framing of
reciprocity, and asks to confirm it with Suzanne.

`src/content/truth.ts` currently *recommends* framing the Truth enquiry form with
that principle. On the one page whose argument is that the record was got wrong
about these people, borrowing another nation's language for the reciprocity ask
is the error the page indicts. The client's own plan uses the term, so this is a
question for Suzanne rather than a correction to make unilaterally. Raised as
**R22**.
