# Open questions & blockers

*Last updated: 10 September 2026*

Live list. Resolve upward — anything marked **blocking** stops real work.
Cross-referenced to section 17 of the build documentation.

Every item carries its **D**/**R** number from
[`decisions-and-risks.md`](decisions-and-risks.md), which holds the same items
written up to paste straight into Proyekto's Decisions and Risks & Issues
sections. That file is the detail; this one is the glance.

**Ownership:** every item owned by Marc is co-owned by August (19 Aug).

**Renumbered (25 Aug):** D13–D19 and R13–R15 raised on the lo-fi branch are now
**D19–D25** and **R22–R23**; the old R13 folded into **R15**, which is the same
finding. `docs/change-requests.md` had independently taken D13–D18 and R16–R21
for the FNAN review round, and that file is written to be pasted into Proyekto,
so its numbering stands.

**Last worked (20 Aug):** JC ran the list with the client side and closed
seven items — D1, D3, D6, D7 and R2, plus two new decisions, D13 and D14 — with
partial answers on D4 and D9. The numbering used in that walkthrough drifts
from this file from R4 onward; the map is at the top of
[`decisions-and-risks.md`](decisions-and-risks.md), and August has confirmed
it. The loose names are confirmed too: **Suzanne** (not Susan) Thompson;
**August** is the walkthrough's "Speaker A"; **Leo and Leonard Mickelo are
different people**; **Steve** is FNAN, not the owner of the words. **D10 is
settled — August owns copy on every page.**

**D4** stays pending on legal documentation that does not exist yet.

**v2 copy uploaded (20 Aug, later the same day)** — homepage, Wonder, Living
Work and Truth. Per D5 those documents govern copy, so they moved three items
on their own: **R2 is re-answered the other way** (the site has never been
dated — the 55,000 figure is withdrawn), **D6 is superseded** (the Living Work
failure section is cut), and **D7 is done**. They also added **R13–R15**. The
full read is in [`content/STATUS.md`](content/STATUS.md).

---

## Blocking

Nothing downstream of these should be built on an assumption.

| # | Item | Why it blocks | Who |
| --- | --- | --- | --- |
| **R3 R4** | **Font licences** | Fonts are installed and working, but Block Berthold carries an Adobe / H. Berthold AG copyright — a commercial retail face, and a desktop licence does not cover `@font-face` distribution. Bantayog Sans shipped no licence at all. Only Work Sans (OFL) is clear. **20 Aug: ask Marc whether the fonts have been purchased** — and specifically whether the licence covers *webfont* use, which a desktop licence usually does not. Needed before the site reaches a public server, and before hi-fi locks the typography. | Marc and August → brand team |
| **R1** | **Welcome to Country wording** | Suzanne is an actual Traditional Owner, so a genuine Welcome to Country is possible in her own words. Footer, text only, no ceremony element, no popup. Not ours to write. **The homepage copy draft acknowledges the Northern Territory** — wrong jurisdiction; YACHATDAC is on Iningai Country, Central Western Queensland. Deliberately not copied into the code. **Both, in order (20 Aug):** Steve — FNAN, the organisation that brought YACHATDAC to us — reviews the wording and jurisdiction; **Suzanne remains the owner** and hers is the approval that lets it publish. **Still wrong in v2** — the footer paragraph is carried over word-for-word, Northern Territory included, through two rounds of drafting. | Marc and August → Steve (FNAN), then Suzanne Thompson |
| **R5** | **Suzanne's Truth-page testimony** | The Truth timeline draft carries her words from the Unfinished Business and Yacadak Framework recordings, edited for reading and re-ordered. The document states on its face that nothing publishes until she has signed it off. Held by community. **v2 asks her two questions, not one:** whether the re-ordering so the count comes before the blankets is right, **and the number itself** — her recording says thirty-five, the published figure is thirty-seven adults and three children, and the draft currently runs with thirty-seven (Hoch 1986, cited in Taçon et al. 2022). **Reconfirmed 20 Aug as critical path**, spelling confirmed as **Suzanne**. | Marc and August → Suzanne Thompson |
| **R10** | **Story-wall imagery permission** | Unresolved. Treat as unavailable — the homepage Truth beat is typographic because of it. Blocked behind D9, since there is no named approver. **20 Aug settled the route, not the authority:** approvals are relayed into the CMS by an intermediary, Leo (D14) — how an approval arrives, not who gives it. Leo is **not** Leonard Mickelo, so the artwork-motion permission is still an approval to be sought. | Marc and August → Elder Advisory Group |

---

## Open decisions

**Two.** Down from twelve on 26 August.

Nine were closed and one split on 26 August, by Ivy and JC, in the owners'
absence — the lo-fi review had not happened, hi-fi starts on 28 August, and five
of them were marked BLOCKS HI-FI. Everything that was a **design, layout, IA or
taxonomy** question was answered with its reasoning written out. Nothing about
history, cultural permission, legal text or unwritten content was touched. Full
write-ups in [`decisions-and-risks.md`](decisions-and-risks.md); the answers as
a single sheet are in
[`meetings/2026-08-21-lofi-review-agenda.md`](meetings/2026-08-21-lofi-review-agenda.md).

**Any of them can be overturned in one line.**

| # | Item | Current state | Who |
| --- | --- | --- | --- |
| **D8** | **Backend build priority** | User-facing front end first, or CMS/backend in parallel? Deferred at the 18 Aug briefing to a follow-up that has not happened. Urgent on the roadmap. **Not covered on 20 Aug** — the walkthrough's "D8/D9" was motion only. Nothing on a wireframe turns on it, which is why it survived 26 Aug untouched. | David |
| **D11** | **Hosting / database accounts** | One shared project account or individual accounts. Handover to the client is far simpler if nothing is tied to a personal account. | David |
| **D9** ⚠ | **Motion sign-off owner — the half that is still open** | **Split on 26 Aug; narrowed on 29 Aug.** *Which behaviours ship* is closed, and **F7 (the immersive mandate, 29 Aug) resolves motion-quantity authority — August directed cinematic motion site-wide.** What remains open is only the **cultural** approver: artwork motion and R10 permissions (any exception on cultural material still routes to Suzanne with R5). Naming that person is not a design decision. | Marc and August |

### Closed on 26 August

| # | Item | Answer |
| --- | --- | --- |
| **D2** | Does Connect survive as a nav item? | **No.** Retired from the nav, kept as a destination. Header is Wonder · Truth · Living Work · The Record · About, with *Get in touch* as a button. Both client drafting rounds produced this shape. |
| **D3** | FAQs — author | **August**, which D10 already said. An unfilled field, not a question. |
| **D4** | Legal page naming | **The copy draft's labels**, per D5: Privacy Policy · Terms of Service · Cookie Settings. `/legal/cookies` created — the footer had linked it on every page with nothing behind it. ⚠ **Naming only; the content stays held under R9.** |
| **D19** | Living Work's closing CTA | **v3 answered it** — the 24 Aug draft carries both the three get-involved paths and the newsletter. The either/or the entry was built on no longer exists. |
| **D20** | What follows the Truth descent | Already Final. **Carried further:** v3 ends on the descent, so the closing band went too. Resolves the two-`#partner` collision. |
| **D21** | The Record's taxonomy | **Both axes** — already implemented, so this was confirmation. **Event and Update return**; Activity does not, because nothing distinguishes it from Event. |
| **D22** | Does `/partnerships` exist? | **Yes.** Built, drawn, four live links already point at it. |
| **D23** | Is `/our-people` a route? | **Yes.** Falls out of D2. The consent constraint on its content is unchanged. |
| **D24** | Homepage navbar | **No navigation until The Invitation.** ⚠ **The code lags** — `SiteHeader` still renders persistently; recorded in that file. |
| **D25** | Empty state destination | **The *"Do you hold something?"* block on the same page**, not /connect — which has no form (R9). |

---

## Open — other

| # | Item | Current state |
| --- | --- | --- |
| **R10** | **Artwork motion permission** | Vectorised artwork received from Leonard Mickelo; no motion permission recorded. Artwork stays static. Group L behaviours (derived from composition, not motifs) are cleared. |
| **R10** | **Land / terrain detail level** | Approved in principle for About and Research pages, detail level unconfirmed. Until confirmed: abstracted or generic terrain only. No real elevation data for Turraburra, no boundaries, no place names, no coordinates anywhere in data or source. |
| — | ~~**Guesting itinerary validation**~~ | **Closed by v2.** The reconstructed day-by-day 2 Night / 3 Day outline is gone. Wonder v2 runs stages instead — Arriving / The first night / Walking out to the wall — and says plainly "we do not run a set itinerary, because the work does not". There is nothing left to validate. |
| — | **Email / SMTP full spec** | Reference the existing ImHereTravels build for template-builder scope, reply/inbox handling and SMTP credentials. Confirm against that codebase before estimating. |
| — | **Which events need RSVP** | RSVP is confirmed in scope for community gatherings and research visits. The exact list of recurring event types defaulting to RSVP vs announcement-only is a follow-up, not a blocker. |
| **R11** | **Media size and compression targets** | Client video runs to 2GB per file; no maximum sizes, compression targets or storage service decided. The homepage is video-led and the above-the-fold budget is under 2.5MB. |
| **R6** | **Lo-fi wireframes vs the open IA** | **Closeable.** The IA questions this risk was about — D1, D2, D22, D23 — are all Final as of 26 Aug, and the ten frames are drawn against them. Previously: largely mitigated on 20 Aug: **D1 and D3 are answered**, D4 is naming only and never blocked wireframes. **D2 was deliberately deferred to the lo-fi review** — the inversion of the original advice — so draw Connect as present and structurally liftable rather than baking in either answer. Downgraded to Medium. |
| **R7** | **Wireframes and motion structure** | Wireframes must state scroll spans in `vh` and mark each screen's loud channel (F7), or pinning gets retrofitted into a layout with no room for it — or every channel ends up loud at once. |
| **R9** | **Legal pages before any form goes live** | **Unchanged, and now the widest-reaching open risk.** It is why Truth's enquiry form was cut on 26 Aug, why Connect has no form, and why the newsletter field is inert. **D4 (26 Aug) settled the labels and created `/legal/cookies`, so all three routes now exist** — but Privacy Policy, Terms and Cookie Settings are still stubs with no content. The homepage newsletter field is deliberately inert until they land. **20 Aug supplies placeholder copy (D4), not reviewed copy** — ship it marked as unreviewed to unblock the routes, and keep every data-collecting form off until the reviewed version lands. |
| **R8** | **DGR status** | Still unverified — verify against the org's actual ACNC and state registration, not against either prior answer. No longer blocking, because **donations are deferred out of launch scope (D13)**. The risk moves to whenever donations are built. |
| **D14** | **Approval attribution in the CMS** | Approvals are relayed by an intermediary, so a proxy-entered approval with no trail is indistinguishable from one nobody gave. The CMS should capture who approved, when, and on what basis. |
| **R13** | **Wonder inclusions and cost** | Both flagged in the draft itself. *What's included / Guiding / Camping / Transfers* carries "NEEDS CONFIRMATION — every line above. This section is the most common reason an enquiry does not happen." Cost is "still undecided — publish a from-price, or state plainly that it is quoted per group." The page is built around a sticky enquiry panel, so both sit on its only conversion. |
| **R14** | **Living Work status labels and Rainbow Credits** | "Status labels to be confirmed before publishing" — *Registration underway / Building the record / In progress / Being developed* are public claims about carbon registration, biodiversity credits, IPA designation and Native Title. The **Rainbow Credits** card is marked "FOR YACHATDAC TO WRITE". |
| **R15** | **Legal name vs ORIC** | Homepage v2 footer: "confirm spelling against ORIC registration", and the About draft says why there is a doubt — the logo and the published research disagree on the spelling. `site.ts` hardcodes **Yambangku** into the footer and page metadata on every route. ICN and ABN still blank. Confirm against the ORIC register, not the logo. |
| **R2** | **Confirm the dating reversal was deliberate** | v2 withdraws the 55,000 claim across all three drafts. It is a large public claim to carry through v1 and then drop, so worth one confirmation — and the v2 homepage sentence needs a rewrite, because it does not parse: "The wasp nests that could be still sitting over the engravings, waiting for someone to ask." |
| **D5** | **Code vs the drafts** | `src/content/homepage.ts` is ✅ **synced to v2** (20 Aug) — withdrawn 55,000 claim replaced, card eyebrows re-cut, *Indigenous* → **Iningai**. Still open: `src/content/page-specs.ts` has Truth as a section stack and a "2 Night, 3 Day" experience that v2 replaced with stages; and v2's tagline sits in `homepage.ts` unrendered, pending a design call. |
| — | **Draft imagery is placeholder** | Confirmed 20 Aug. Every image, gallery and carousel block in the v2 documents is direction, not an asset — none names a file. Swap-in-ready, no layout that depends on a crop. Does not soften R11: placeholders are the cheapest time to set compression targets. |
| **R12** | **Brand assets outstanding** | Logo vector files and the Good Dog Cool callout face not supplied. Low impact — both have marked placeholders. |
| **R22** | **Ngapartji-Ngapartji is Western Desert language** | The client's Strategic Plan uses it for reciprocity; the About draft questions it. `truth.ts` currently recommends framing the Truth enquiry form with it — on the one page arguing that outsiders got the record wrong. Ask Suzanne; do not correct unilaterally. |
| **R23** | **Four copy details — now owned.** | **D10 is Final, so these are August's.** Phone-answering hours; the on-request response time and contact point; the doubled `2031` status on Five-Year Review; the Cultural Knowledge Precinct tagged *Written record* for a building that does not exist yet. Trivial individually — collectively the argument for settling **D10**. |

---

## Confirm on v2

The v2 upload arrived and answered its three waiting items. It changed two
things that had been recorded the other way, so those want one confirmation
each — not a re-argument, just a check that the change was intended.

| # | Confirm | Why |
| --- | --- | --- |
| **R2** | The **dating reversal**. v2 withdraws "at least 55,000 years" across all three drafts and says the site has **never been scientifically dated** — >5,000 on regional style sequences, wasp nests a method never taken up. Now properly sourced to the 2022 *Australian Archaeology* paper. | It reverses an answer given the same morning, and it is a public claim about cultural heritage. The v2 position looks like the defensible one; the v1 sentence appears to have described a dating that never happened. |
| **D6** | The **cut failure section**. "The parts that are not in the annual report" is not in Living Work v2; an expandable *Our challenges* list replaces it. | Recorded as **keep** hours earlier. Per D5 the document wins, so this is superseded rather than reversed — but worth knowing it was deliberate rather than lost in the rewrite. |
| **D7** | The button label — the decision says **book a consultation**, the draft says **Enquire**. | Trivial, but it needs one word. |

---

## Settled — do not reopen

**Settled 20 Aug**

- **D1 — Blog and Resources are one page, labelled Resources.** One editorial
  collection, several resource types filtered inside a single page. Blog is not
  a second browse interface and gets no top-level area. The label takes a
  parent term broad enough to hold every kind of thing inside it — media, blog
  posts, articles, guides, events, downloads — which "Blog" cannot do and
  "Resources" already does. `src/content/site.ts` keeps its current nav
  string.
- **D3 — FAQs are CMS-managed**, not a static page. No named author yet, and no
  scope for what it covers.
- **D10 — August owns the copy on every page.** One owner, all pages, not one
  per page. It does **not** extend to cultural content: Suzanne's words, the
  Truth timeline and the Welcome to Country are hers to approve.
- ~~**D6 — Living Work keeps its practitioner content.**~~ **Superseded by v2**
  — the failure section is not in the v2 draft, replaced by an *Our challenges*
  list. Per D5 the document governs copy, so the document wins. See *Confirm on
  v2*. It was written to answer other Indigenous communities asking how
  the system was built, and that is the audience the pillar names. *Read with
  care:* the walkthrough confirmed the audience and the content without naming
  "The parts that are not in the annual report" outright — keep is the only
  reading consistent with it, and it reverses in one move if wrong.
- **D7 — fee-for-service land management sits under Living Work.** Page is
  informational, **no fees published**, ends in a call to book a consultation.
  **Done in v2** ✅ — a *Being developed* card plus a **Land management
  services** pathway with an Enquire CTA.
- **D13 — donations are deferred out of launch scope**, pending confirmed DGR.
  A *not yet*, not a *never* — expected eventually, so leave the door open and
  build nothing that assumes either answer. Living Work v2 agrees with this on
  its own face: "consider a fourth card for donations if DGR status is in
  place".
- **D14 — CMS roles are admin / editor / viewer**, and because elders and older
  community members will not log in, approvals are relayed by an intermediary,
  **Leo** — who is *not* Leonard Mickelo. That is the route, not the authority
  — D9 and R10 are unchanged.
- **R2 — the story wall has never been scientifically dated.** *(Re-answered by
  v2, replacing the morning's "at least 55,000 years".)* The pecked designs are
  likely more than 5,000 years old on regional style sequences; mud wasp nests
  over some engravings could give minimum ages if they are ever sampled. All
  three v2 drafts agree, and Truth v2 carries the full citation — Marra Wonga,
  *Australian Archaeology*, 2022, with DOI. **`src/content/homepage.ts` still
  carries the withdrawn 55,000 sentence and must be changed.**

**From this project's own decisions**

- **D5 — the draft documents govern copy.** The documents in `docs/content/drafts/`
  are the source of truth for page copy and content. They do **not** govern web
  design — the lo-fi and hi-fi wireframes do.
- **D12 — homepage copy is CMS-editable.** Design, animation, motion and
  section structure stay in code. `src/content/homepage.ts` is the seed the CMS
  is populated from, not the long-term home. Supersedes the earlier position
  that homepage copy stayed in git.
- **F7 — the immersive mandate (supersedes F4, 29 Aug).** Motion is the default
  on every page, paced by the Loud Channel rule (one loud channel per screen:
  media, type, or transition); per-page vh/perf budgets replace the old tier
  split and homepage budget. CMS surfaces get a bounded standard kit. Cultural
  rules, reduced-motion cut, and performance floors unchanged.
- **F5 — only Work Sans is tracked in git.** Block Berthold and Bantayog Sans
  are distributed through the Proyekto resources section until their licences
  are confirmed.
- **F6 — local dev runs on port 3001.** Port 3000 is a local Proyekto instance.

**From the build documentation**

- **YACHATDAC is the organisation, Turraburra is the property.** Never used
  interchangeably.
- **Only show what is fully ready.** No "coming soon" flags for unfinished
  features on the public site. The Cultural Knowledge Precinct is a separate
  case — an existing public vision statement with real target years, so it
  stays visible.
- **No accommodation booking flow.** Camping is genuinely the current offer
  (Stage 1 of the org's own roadmap) — but don't write copy implying it is
  permanent either.
- **Merch shipping** is calculated by weight/location, not flat-rate.
- **Donations**: both one-time and recurring — but that is the *eventual*
  shape, **not launch scope**. Deferred pending DGR (D13).
- **Pillar page blog feeds** are hand-picked by editors, not query-driven.
  ⚠ **Wonder v2 specifies a hybrid instead** — three most recent Resources posts
  tagged #lore, #country or #guesting, editor can pin the first slot, falls back
  to most recent overall. Small, but it contradicts this line, so David should
  model it deliberately rather than inherit it.
- **Analytics**: GA4.
- **Reviewer/approver**: the CMS Admin role is the technical enforcement layer
  for the Elder Advisory Group's decisions — not an independent judgment call.
- **Commissioned artwork is not blocking.** Placeholder-first, swap-in-ready.
- **No separate Events page.** Event is a content type inside Resources.

---

## Truth interior motion — raised 9 September 2026

Three things the interior-scrub pass could not settle from the repo. None is
blocking; all three are places where a later pass could quietly invent an
answer, which is why they are written down.

- **The six sections with four image alternates each have no source.** The
  Truth motion brief states it plainly, but nothing in `docs/` mentions
  alternates and all 34 files in `public/media/library/truth/` are already
  referenced by `src/content/truth-media.ts` — there are no spare frames on
  disk. `MediaSlot` now carries an `alternates` field and the six slots that
  fit the description ("the same slot dimensions and motion behaviors") carry
  an explicit empty array. ⚠ Those six are **inferred** — the page's six
  full-bleed frames. If the real six are different sections, move the arrays;
  do not fill these in to match. **Needs: the documented swap-in list, or a
  pointer to the pool board it lives on.**

- **Partnerships is drawn as three cards and written as two.** The frame
  staggers L, M, R at ~100ms; `YACHATDAC-Truth-Copy-v3.md` carries "The
  Cultural Knowledge Precinct" and "Partnerships" and nothing else. The build
  staggers the two that exist rather than inventing a third card's copy (D5 —
  drafts govern copy). **Needs: either the third card's copy, or confirmation
  that the frame is ahead of the draft.**

- **The hero is now in motion, and the ledger said it was held.**
  `scenes.md` read "the hero … held at its rendered state"; the brief asks for
  a photograph that "breathes rather than sits still". Built as a 1.04 → 1.00
  settle on user direction and recorded as superseding that line — the copy is
  still held and the 20vh runway still exists to clear the navbar. **Needs:
  nothing, unless a reviewer wants the stillness back.**

Also fixed in the same pass, recorded because it was invisible rather than
broken: the 1950s dim overlay sat on the era `<section>`, so once the deck
pinned the article the overlay stayed behind in flow and stopped covering the
thing it darkens. It is now painted by the slide's own `::after` and deepens
0.10 → 0.45 as the band is read.

---

## Truth on one ground — raised 9 September 2026 (D26)

`/truth` now renders on a single egg-white ground. The decision and what it
supersedes are written up as **D26**; these are the loose ends it leaves.

- **The count's red measures 2.84:1 on charcoal** — below even the 3:1
  large-text floor, at Display scale. This is **pre-existing** and was not
  touched, but the change makes the count the page's only dark moment and so
  the most looked-at thing on it. It is not ours to fix unilaterally: "Rust Red
  is spent once" is doctrine, the count is under **R5**, and raising the red or
  lightening the ground is a palette call. **Needs: Steve / the Elder Advisory
  Group, alongside D26 itself.**

  ⚠ **Corrected 10 September 2026 — this failure is on the wrong screen.** The
  2.84:1 oxide is §15A's title and attribution (`#the-count`, "By 1902 there
  were thirty-seven."), not the count's numerals. `#the-count-figures` renders
  no red at all: charcoal ground, off-white numerals and detail, 17.83:1. The
  same mis-attribution is written into `globals.css`, `kit.ts`,
  `decisions-and-risks.md` D26 and `scenes.md` — all of which say the count's
  numerals are "the only red on the page". The claim survives at the level of
  the *band*, because §15A does carry the page's one oxide on the one dark
  ground; it is false of the screen every one of them names. The code comment
  in `truth-scenes.ts` was corrected in the same pass. **The five doc echoes
  are left as they are** — reworded governance entries in a motion commit is
  how a record stops being trustworthy. **Needs: a documentation pass, and the
  contrast question re-aimed at §15A.**

- **The 1902 count is now a display statistic, which `ART-DIRECTION.md` §337
  says it should not be until Suzanne settles it.** Raised 10 September 2026,
  when the count screen's display slot moved from the year to the figure on
  user direction: **37** and **7,500** are now `text-h1`, the years demoted to
  the rail-marker eyebrow. The argument for it is that prominence is
  *transferred* rather than added — the screen spends the same one display slot
  per row, so it is no louder — and the Hoch/Taçon citation still sits directly
  beneath, which is what keeps it a sourced figure rather than a headline. The
  argument against it is simply R5: **her recording says thirty-five and the
  published figure is thirty-seven, and nobody has asked her yet.** The number
  is set larger than it has ever been on a screen that goes to her for
  approval. `ART-DIRECTION.md:337` was deliberately **not** amended — that line
  is a cultural-safety guardrail and reversing it is not a build decision.
  **Needs: Suzanne Thompson, via the R5 presentation; then either the guardrail
  lifts or the display slot goes back to the year.**

- **Three artwork cuts have no light-ground version, so they were withdrawn
  rather than shipped invisible.** `ring-spiral-a.svg` (the 06 frame and *Older
  than the record*) and `dots-rule-gold.svg` (under every display title) are
  off-white and gold respectively — 1.0:1 and 1.72:1 on `#f6f6ec`. The house
  fix is a roasted repath at 0.30 (`ART-DIRECTION` §299-305), which `ring-a`
  and `ring-b` have and these do not. **Needs: a roasted cut of each, then
  restore the markup — the call sites carry a comment saying so.**
  `cluster.svg` was checked and left alone: all three of its uses sit over
  photographs, not on the ground.

- **The rail's traveller and legend are baked gold** (`trail-point.svg`,
  `lore-legend.svg`) at 1.72:1 on the new ground. Kept, because they are marks
  rather than text and the strand they ride was repointed to charcoal, but they
  are the weakest thing on the page now. **Needs: a light-ground cut.**

  ⚠ **Sharpened 10 September 2026.** The traveller now carries the era label at
  its tip, which makes the weakest mark on the page also the most looked-at one
  — it is what the reader's eye goes to for "where am I". The TYPE beside it
  did not inherit the problem: the label is `text-burnt-deep` (6.31:1) and the
  sub is charcoal, never gold. But an arrow at 1.72:1 introducing a label at
  6.31:1 is a visible mismatch, and the light-ground cut is now worth more than
  it was. **Needs: unchanged — a light-ground cut of `trail-point.svg`.**

- **/about carries the same eyebrow defect this pass avoided.** Truth's warm
  accents moved to `--color-burnt-deep` (6.31:1); /about still uses
  `text-burnt` (2.91:1) for its canvas eyebrows, against the deepening rule
  recorded in `living-work-qa-2026-09-08.md:238-241` that `/living-work`
  follows. Not changed here — it is a different page and a separate pass.


---

## The count seam — raised 9 September 2026

- ~~**`railHiddenSlides` carries a dead selector.**~~ **CLOSED 10 September
  2026.** `[data-truth-ground="count"]` matched nothing while the band only
  ever rendered `withinDeck`. Splitting the hard stop into three screens gave
  two of them that attribute for real, so the selector now does the job it
  was written for and the rail is silent across all three.

- **The count's panel height is now load-bearing and nothing enforces it.** The
  ground and its crest cover the escarpment because panel + wave ≈ one
  viewport. That is a `min-h-[calc(100svh-7rem)]` floor plus content that
  happens to land at 798px on a 900px screen. Add a paragraph, unhold the
  portrait, or restore Suzanne's withheld block, and the crest goes off the top
  of the screen with no warning and the beat stops closing on the wave.
  **Needs: either a real cap, or a note in whatever unholds this section.**


---

## The type lint cannot see the type — raised 10 September 2026

`scripts/check-type.mjs` reported **0 errors on /truth** while the page carried
a 128px heading, three quotations set in the display face, and a hand-rolled
eyebrow in the wrong family. It is not broken; it is narrower than its name
suggests, and it was read as a pass.

Two reasons, both in the script:

- **It skips anything already carrying a font utility** —
  `if (/\bheadline\b|\beyebrow\b|\bcallout\b/.test(c)) continue;`. So
  `headline text-7xl sm:text-9xl` is never size-checked. The check is "does
  this look like a heading with no family?", not "is this size on the scale?".
- **It knows nothing about the `text-h1`…`text-h6` tokens**, so it cannot tell
  a token from a hand-built ladder, and its heading threshold (1.875rem) sits
  above most of the page's body-scale ladders anyway.

Net: **a clean `check:type` run is not evidence that a page's typography is
right.** What caught this pass was measuring computed `fontSize`/`fontFamily`
in a real browser, which is what the verification for this work used.

Only 2 of ~41 sized elements in `src/app/truth/_components/Sections.tsx` use a
scale token; the rest are hand-built ladders that break at `sm` where the
tokens break at `lg`. This pass fixed the 1902 band, which is the new content.
**The rest of the page is unconverted and was left alone deliberately** — it is
the co-worker's shipped work and a page-wide migration is its own decision.
**Needs: a call on whether Truth migrates wholesale, and either a check-type
that understands the scale or an honest note in its output that it does not.**


---

## Not settled, deliberately

**F2 and F3 are on hold**, not decided — there is no final homepage design yet,
and the wireframes are the source of truth for that. What is built today (a
plain vertical thread rule; a typographic Truth beat) is the interim position.

The cultural constraints underneath them are a separate matter and do **not**
lift when a design arrives: sketch C1 is on hold because a meandering line with
waypoints reads as Aboriginal iconography, and story-wall imagery is
unavailable pending permission. Those clear when a permission is recorded — see
D9 and R10 — not when a wireframe specifies otherwise.
