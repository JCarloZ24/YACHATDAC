# Open questions & blockers

Live list. Resolve upward — anything marked **blocking** stops real work.
Cross-referenced to section 17 of the build documentation.

Every item carries its **D**/**R** number from
[`decisions-and-risks.md`](decisions-and-risks.md), which holds the same items
written up to paste straight into Proyekto's Decisions and Risks & Issues
sections. That file is the detail; this one is the glance.

**Ownership:** every item owned by Marc is co-owned by August (19 Aug).

**Last worked (20 Aug):** JC ran the list with the client side and closed
seven items — D1, D3, D6, D7 and R2, plus two new decisions, D13 and D14 — with
partial answers on D4 and D9. The numbering used in that walkthrough drifts
from this file from R4 onward; the map is at the top of
[`decisions-and-risks.md`](decisions-and-risks.md), and August has confirmed
it. The loose names are confirmed too: **Suzanne** (not Susan) Thompson;
**August** is the walkthrough's "Speaker A"; **Leo and Leonard Mickelo are
different people**; **Steve** is FNAN, not the owner of the words. **D10 is
settled — August owns copy on every page.**

Two things stay pending on documents that do not exist yet: **D4** (no legal
documentation) and the authoritative page content/copy, which August is
uploading.

---

## Blocking

Nothing downstream of these should be built on an assumption.

| # | Item | Why it blocks | Who |
| --- | --- | --- | --- |
| **R3 R4** | **Font licences** | Fonts are installed and working, but Block Berthold carries an Adobe / H. Berthold AG copyright — a commercial retail face, and a desktop licence does not cover `@font-face` distribution. Bantayog Sans shipped no licence at all. Only Work Sans (OFL) is clear. **20 Aug: ask Marc whether the fonts have been purchased** — and specifically whether the licence covers *webfont* use, which a desktop licence usually does not. Needed before the site reaches a public server, and before hi-fi locks the typography. | Marc and August → brand team |
| **R1** | **Welcome to Country wording** | Suzanne is an actual Traditional Owner, so a genuine Welcome to Country is possible in her own words. Footer, text only, no ceremony element, no popup. Not ours to write. **The homepage copy draft acknowledges the Northern Territory** — wrong jurisdiction; YACHATDAC is on Iningai Country, Central Western Queensland. Deliberately not copied into the code. **Both, in order (20 Aug):** Steve — FNAN, the organisation that brought YACHATDAC to us — reviews the wording and jurisdiction; **Suzanne remains the owner** and hers is the approval that lets it publish. | Marc and August → Steve (FNAN), then Suzanne Thompson |
| **R5** | **Suzanne's Truth-page testimony** | The Truth timeline draft carries her words from the Unfinished Business and Yacadak Framework recordings, edited for reading and re-ordered. The document states on its face that nothing publishes until she has signed it off. Held by community. It also asks her a specific question — whether re-ordering so the count of thirty-five comes before the blankets is acceptable. **Reconfirmed 20 Aug as critical path**, spelling confirmed as **Suzanne**. August is re-uploading the draft with the dating corrected (R2) — it must be right before it reaches her. | Marc and August → Suzanne Thompson |
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

---

## Open — other

| # | Item | Current state |
| --- | --- | --- |
| **R10** | **Artwork motion permission** | Vectorised artwork received from Leonard Mickelo; no motion permission recorded. Artwork stays static. Group L behaviours (derived from composition, not motifs) are cleared. |
| **R10** | **Land / terrain detail level** | Approved in principle for About and Research pages, detail level unconfirmed. Until confirmed: abstracted or generic terrain only. No real elevation data for Turraburra, no boundaries, no place names, no coordinates anywhere in data or source. |
| — | **Guesting itinerary validation** | The day-by-day 2 Night / 3 Day outline was reconstructed from crew interviews. Needs Suzanne/Steve sign-off before publishing. |
| — | **Email / SMTP full spec** | Reference the existing ImHereTravels build for template-builder scope, reply/inbox handling and SMTP credentials. Confirm against that codebase before estimating. |
| — | **Which events need RSVP** | RSVP is confirmed in scope for community gatherings and research visits. The exact list of recurring event types defaulting to RSVP vs announcement-only is a follow-up, not a blocker. |
| **R11** | **Media size and compression targets** | Client video runs to 2GB per file; no maximum sizes, compression targets or storage service decided. The homepage is video-led and the above-the-fold budget is under 2.5MB. |
| **R6** | **Lo-fi wireframes vs the open IA** | Largely mitigated on 20 Aug: **D1 and D3 are answered**, D4 is naming only and never blocked wireframes. **D2 was deliberately deferred to the lo-fi review** — the inversion of the original advice — so draw Connect as present and structurally liftable rather than baking in either answer. Downgraded to Medium. |
| **R7** | **Wireframes and motion structure** | Wireframes must state scroll spans in `vh` and mark which sections are Tier 1, or pinning gets retrofitted into a layout with no room for it. |
| **R9** | **Legal pages before any form goes live** | Privacy Policy, Terms and cookie notice are route stubs with no content. The homepage newsletter field is deliberately inert until they land. **20 Aug supplies placeholder copy (D4), not reviewed copy** — ship it marked as unreviewed to unblock the routes, and keep every data-collecting form off until the reviewed version lands. |
| **R8** | **DGR status** | Still unverified — verify against the org's actual ACNC and state registration, not against either prior answer. No longer blocking, because **donations are deferred out of launch scope (D13)**. The risk moves to whenever donations are built. |
| **D14** | **Approval attribution in the CMS** | Approvals are relayed by an intermediary, so a proxy-entered approval with no trail is indistinguishable from one nobody gave. The CMS should capture who approved, when, and on what basis. |
| **R12** | **Brand assets outstanding** | Logo vector files and the Good Dog Cool callout face not supplied. Low impact — both have marked placeholders. |

---

## Waiting on August

Not open questions — answered decisions waiting on a document.

| # | Waiting for | What it unblocks |
| --- | --- | --- |
| **D6 D5** | The **authoritative page content/copy documents**. Until they land, "keep the Living Work failure section" is the working position, not a closed one — if the uploaded document drops it, the document wins (D5). | Everything downstream of copy: the Living Work page, and D6 read as final rather than inferred. |
| **R2 R5** | The **Truth timeline** re-uploaded with **55,000** and the "dating under review" note dropped. | Suzanne's review (R5). Send her the corrected draft, not the current one. |
| **D7** | The **Living Work draft PDF** updated to include fee-for-service: informational, no published fees, ends in a consultation booking. | The Living Work page build. |

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
- **D6 — Living Work keeps its practitioner content**, failure section
  included. *Pending the authoritative copy document from August.* It was written to answer other Indigenous communities asking how
  the system was built, and that is the audience the pillar names. *Read with
  care:* the walkthrough confirmed the audience and the content without naming
  "The parts that are not in the annual report" outright — keep is the only
  reading consistent with it, and it reverses in one move if wrong.
- **D7 — fee-for-service land management sits under Living Work.** Page is
  informational, **no fees published**, ends in a call to book a consultation.
  The Living Work draft PDF is to be updated to include it.
- **D13 — donations are deferred out of launch scope**, pending confirmed DGR.
  A *not yet*, not a *never* — expected eventually, so leave the door open and
  build nothing that assumes either answer.
- **D14 — CMS roles are admin / editor / viewer**, and because elders and older
  community members will not log in, approvals are relayed by an intermediary,
  **Leo** — who is *not* Leonard Mickelo. That is the route, not the authority
  — D9 and R10 are unchanged.
- **R2 — the story wall is at least 55,000 years old.** Homepage and Wonder
  were right; the Truth timeline's 5,000 is the outlier and is being corrected
  in August's re-upload, before the draft goes to Suzanne.
  `src/content/homepage.ts` is already correct but its ⚠ comment and
  `docs/content/STATUS.md` note 2 are now stale.
  The figure is confirmed but still unattributed — the 2022 Marra Wonga study
  is the obvious citation.

**From this project's own decisions**

- **D5 — the draft PDFs govern copy.** The documents in `docs/content/drafts/`
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
