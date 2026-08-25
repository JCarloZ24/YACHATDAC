# Open questions & blockers

*Last updated: 20 August 2026*

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

Needs an answer, not a default. Full write-ups in
[`decisions-and-risks.md`](decisions-and-risks.md).

| # | Item | Current state | Who |
| --- | --- | --- | --- |
| **D2** | **Does Connect survive as a nav item?** | About and Contact are lifted to top level in the sitemap, leaving Connect thinner. **Deliberately held (20 Aug) until Marc reviews the lo-fi.** That inverts R6's advice to settle it before wireframing — so draw Connect as present and structurally liftable, rather than baking in either answer. | Marc |
| **D4** | **Legal page naming** | Three different namings now in circulation — Terms of Use (docs) / Terms & Conditions (sitemap) / Terms of Service (homepage draft), and cookie notice / Cookie Policy / Cookie Settings. Settle before the routes are built; changing a legal URL after launch is avoidable churn. **Pending (20 Aug)** — there is no legal documentation for this site yet. The working intent is interim text from the existing YACHATDAC site or a generic Australian policy, and analytics setup is also pending so the cookie wording cannot be finalised. Labels and routes only, so it does not block wireframes. | David |
| **D8** | **Backend build priority** | User-facing front end first, or CMS/backend in parallel? Deferred at the 18 Aug briefing to a follow-up that has not happened. Urgent on the roadmap. **Not covered on 20 Aug** — the walkthrough's "D8/D9" was motion only. | David |
| **D9** | **Motion sign-off owner** | Marc, the board, or the Elder Advisory Group — and at which milestone. Unblocks R10 and the artwork/terrain permissions rather than being a separate ask. **20 Aug set the character, not the approver:** motion follows the documentation sent to Marc and should feel **grounded** — weighted and deliberate, not playful or bouncy. Consistent with F4, so nothing built changes. | Marc and August |
| **D11** | **Hosting / database accounts** | One shared project account or individual accounts. Handover to the client is far simpler if nothing is tied to a personal account. | David |
| **D20** | **What follows the Truth descent** | The five blocks below the timeline were never commissioned — `truth.ts` says so on its own face — the sitemap already drops half of them, and The Record draft now writes the same content for Resources and routes opportunities to `/partnerships`. The lo-fi walkthrough on 21 Aug caught it independently: ≈313vh of card grids sit underneath the line that calls itself the floor of the page. `#partner` stays regardless. | Marc, with Ivy |
| **D21** | **The Record's taxonomy** | The draft filters on two axes — type *and* source (Iningai knowledge / Colonial record / Published research). The code has one flat list, and no source concept at all. `Event`, `Activity` and `Update` are dropped, which collides with "Event is a content type inside Resources". David's content model. | Marc, with David |
| **D22** | **Does `/partnerships` exist?** | The Record draft links `/partnerships/#research-opportunities`; no such route exists anywhere in the project. Same question as D20 from the other end — answer them together. Bears on D7. | Marc and August |
| **D23** | **Is `/our-people` a route?** | The About draft's "Meet the people →". Build docs have Team and Suzanne as two items under Connect. Third thing pulled out of Connect after About and Contact — answer with D2. | Marc |
| **D19** | **Living Work's closing CTA** | The build spec says newsletter signup; the copy draft ends on "Talk to us →" and "Come on Country →". The pillar's audience is other Indigenous communities — the draft offers them a conversation, the spec offers them a mailing list. Built to the draft. | Marc, with Ivy |
| **D24** | **Homepage navbar, or no nav until block 6?** | Three sources disagree: the copy draft says no navigation until block 6 and that this *is* the page's argument; Marc's hi-fi and the sitemap both carry a persistent navbar. Changes the header on every page. Flagged in `hifi-figma-readout.md` §2 on 20 Aug and never given an ID until now. | Marc, with Ivy |
| **D25** | **Empty state destination** | The Record's empty state offers "ask us what exists" — a real invitation with nowhere to go. Only empty state on the site that opens a conversation rather than apologising. | Marc |

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
| **R6** | **Lo-fi wireframes vs the open IA** | Largely mitigated on 20 Aug: **D1 and D3 are answered**, D4 is naming only and never blocked wireframes. **D2 was deliberately deferred to the lo-fi review** — the inversion of the original advice — so draw Connect as present and structurally liftable rather than baking in either answer. Downgraded to Medium. |
| **R7** | **Wireframes and motion structure** | Wireframes must state scroll spans in `vh` and mark which sections are Tier 1, or pinning gets retrofitted into a layout with no room for it. |
| **R9** | **Legal pages before any form goes live** | Privacy Policy, Terms and cookie notice are route stubs with no content. The homepage newsletter field is deliberately inert until they land. **20 Aug supplies placeholder copy (D4), not reviewed copy** — ship it marked as unreviewed to unblock the routes, and keep every data-collecting form off until the reviewed version lands. |
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
| **R23** | **Four copy details unowned** | Phone-answering hours; the on-request response time and contact point; the doubled `2031` status on Five-Year Review; the Cultural Knowledge Precinct tagged *Written record* for a building that does not exist yet. Trivial individually — collectively the argument for settling **D10**. |

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
- **F4 — motion tiers.** Tier 1 (pinning, scrubbing, parallax, WebGL,
  signature moments) is homepage-only; everything else, including every
  CMS-generated page, is Tier 2. Two signature moments on the homepage, total.
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

## Not settled, deliberately

**F2 and F3 are on hold**, not decided — there is no final homepage design yet,
and the wireframes are the source of truth for that. What is built today (a
plain vertical thread rule; a typographic Truth beat) is the interim position.

The cultural constraints underneath them are a separate matter and do **not**
lift when a design arrives: sketch C1 is on hold because a meandering line with
waypoints reads as Aboriginal iconography, and story-wall imagery is
unavailable pending permission. Those clear when a permission is recorded — see
D9 and R10 — not when a wireframe specifies otherwise.
