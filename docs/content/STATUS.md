# Content status board

*Last updated: 20 August 2026*

One row per document. Update it in the same commit that moves a file between
folders.

**Circle** is the internal governance tag (build documentation §12) — `open`,
`shared with care`, or `held by community`. It is never shown to visitors, but
it decides who has to sign off.

## Documents

| Document | Page | State | Circle | Blocked on |
| --- | --- | --- | --- | --- |
| `YACHATDAC-Homepage-Copy-v2.pdf` | Homepage | 📥 **v2** uploaded | open | Acknowledgement **still** names the wrong jurisdiction — note 1 |
| `YACHATDAC-Wonder-Copy-v2.pdf` | Wonder | 📥 **v2** uploaded | open | Inclusions and cost unwritten — note 7 |
| `YACHATDAC-LivingWork-Copy-v2.pdf` | Living Work | 📥 **v2** uploaded | shared with care | Rainbow Credits unwritten; status labels unconfirmed — note 8 |
| `YACHATDAC-Truth-Copy-v2.pdf` | Truth | 📥 **v2** uploaded | **held by community** | **Suzanne Thompson's approval — stated on the document itself.** She now has *two* questions to answer, not one — note 5 |
| `YACHATDAC-Sitemap-v1.png` | Site-wide | 📥 draft uploaded | open | Partly overtaken by D1 and D3 — note 6 |

**v2 uploaded 20 Aug 2026**, replacing the v1 set from 19 Aug. The v1 files are
deleted rather than kept alongside — git history holds them. Note the Truth
document is also **renamed**: `YACHATDAC-Truth-Timeline-v1.pdf` →
`YACHATDAC-Truth-Copy-v2.pdf`.

Nothing here is approved; nothing here has been built from. Per D5 these
documents govern **copy**, so where the repo disagrees with them, the repo is
what changes.

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

### 2b. The homepage Truth sentence does not parse

"The wasp nests that could be still sitting over the engravings, waiting for
someone to ask." is not a sentence. Whatever it becomes, it needs rewriting
before it is copied into code.

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
stages (Arriving / The first night / Walking out to the wall / …) and the
explicit line "We do not run a set itinerary, because the work does not." That
closes the old *guesting itinerary validation* question — there is no
reconstructed itinerary left to validate — and makes
`src/content/page-specs.ts` stale where it describes "the 2 Night, 3 Day
Guesting on Country experience".

New names to record: **Graham Ambridge** hosts alongside Suzanne.

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

### 10. The organisation's legal name is unconfirmed

Homepage v2 footer: "[ Yambangku Aboriginal Cultural Heritage and Tourism
Development Aboriginal Corporation — **confirm spelling against ORIC
registration** ]". The repo spells it out in `src/content/site.ts`. Worth
checking against the actual ORIC record before it ships in a footer on every
page. See R15.

### 11. What the code now owes the drafts

Under D5 these are the repo's problems, not the documents':

| File | Drift | State |
| --- | --- | --- |
| `src/content/homepage.ts` | Truth beat carried the withdrawn 55,000 claim (note 2); Invitation card eyebrows read *Guesting on Country / Research & Discovery / Caring for Country* against v2's **Guesting On-Country / Legacy, Research & Discovery / Caring for Country**; card 2 description said *Indigenous* where v2 says **Iningai**. | ✅ **Synced to v2, 20 Aug.** The v2 Truth sentence is transcribed verbatim including its fragment — see note 2b — with the probable repair recorded in a comment rather than applied. v2's tagline "Ancient traditions walking together with contemporary visions" is added as a field but **not rendered**; wiring it into `WayForward.tsx` is a design call and waits on the wireframes. |
| `src/content/page-specs.ts` | Truth as a section stack, not a reverse chronology (note 5). "2 Night, 3 Day Guesting on Country experience" no longer exists (note 7). | ⬜ Open |
| `src/content/site.ts` | Legal name spelling unconfirmed (note 10). Nav question is D2's, not a sync. | ⬜ Open |

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
