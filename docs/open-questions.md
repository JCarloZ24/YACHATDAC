# Open questions & blockers

Live list. Resolve upward — anything marked **blocking** stops real work.
Cross-referenced to section 17 of the build documentation.

Every item carries its **D**/**R** number from
[`decisions-and-risks.md`](decisions-and-risks.md), which holds the same items
written up to paste straight into Proyekto's Decisions and Risks & Issues
sections. That file is the detail; this one is the glance.

**Ownership:** every item owned by Marc is co-owned by August (19 Aug).

---

## Blocking

Nothing downstream of these should be built on an assumption.

| # | Item | Why it blocks | Who |
| --- | --- | --- | --- |
| **R8** | **DGR / charity status for donations** | Donation copy and receipt logic must not claim tax-deductibility until verified against the org's actual ACNC/state registration. Earlier information said "registered DGR"; the Ten-Year Strategic Plan lists securing it as a *Year 1 goal*, which reads as not yet secured. A compliance risk, not a wording preference — do not rely on either prior answer. | David, with the client |
| **R3 R4** | **Font licences** | Fonts are installed and working, but Block Berthold carries an Adobe / H. Berthold AG copyright — a commercial retail face, and a desktop licence does not cover `@font-face` distribution. Bantayog Sans shipped no licence at all. Only Work Sans (OFL) is clear. Needed before the site reaches a public server, and before hi-fi locks the typography. | Marc and August → brand team |
| **R1** | **Welcome to Country wording** | Suzanne is an actual Traditional Owner, so a genuine Welcome to Country is possible in her own words. Footer, text only, no ceremony element, no popup. Not ours to write. **The homepage copy draft acknowledges the Northern Territory** — wrong jurisdiction; YACHATDAC is on Iningai Country, Central Western Queensland. Deliberately not copied into the code. | Marc and August → Suzanne Thompson |
| **R5** | **Suzanne's Truth-page testimony** | The Truth timeline draft carries her words from the Unfinished Business and Yacadak Framework recordings, edited for reading and re-ordered. The document states on its face that nothing publishes until she has signed it off. Held by community. It also asks her a specific question — whether re-ordering so the count of thirty-five comes before the blankets is acceptable. | Marc and August → Suzanne Thompson |
| **R2** | **Story wall dating** | Drafts disagree by a factor of ten — 55,000 years on Homepage and Wonder, 5,000 on the Truth timeline. One sourced number, used everywhere. The 2022 Marra Wonga study is the obvious source. | Marc and August → client / researchers |
| **R10** | **Story-wall imagery permission** | Unresolved. Treat as unavailable — the homepage Truth beat is typographic because of it. Blocked behind D9, since there is no named approver. | Marc and August → Elder Advisory Group |

---

## Open decisions

Needs an answer, not a default. Full write-ups in
[`decisions-and-risks.md`](decisions-and-risks.md).

| # | Item | Current state | Who |
| --- | --- | --- | --- |
| **D1** | **Blog vs Resources** | The uploaded sitemap has Blog as a top-level area alongside Resources; the build documentation has one unified editorial collection with Resources as the hub. Two browse interfaces over the same posts, or one? **The largest open question in the IA** — nav, wireframes and the CMS model all wait on it. | Marc, with Ivy |
| **D2** | **Does Connect survive as a nav item?** | About and Contact are lifted to top level in the sitemap, leaving Connect thinner. | Marc |
| **D3** | **FAQs** | Appears in the sitemap footer, appears nowhere in the build documentation. No spec, no content model, no named author. | Marc, with David |
| **D4** | **Legal page naming** | Three different namings now in circulation — Terms of Use (docs) / Terms & Conditions (sitemap) / Terms of Service (homepage draft), and cookie notice / Cookie Policy / Cookie Settings. Settle before the routes are built; changing a legal URL after launch is avoidable churn. | David |
| **D6** | **"The parts that are not in the annual report"** | The Living Work draft's failure section. The draft raises this itself and says it can be cut in one move. The pillar's audience is other Indigenous communities, not funders — and it is arguably the most useful section on the page for that reader. | Marc and August, with the client |
| **D7** | **Fee-for-service land management** | A real revenue stream in the strategic plan (Goal 3.5) with no home in the sitemap, which marks it NOT YET PLACED. Its audience is other landholders, which matches none of the three pillars. Needs a decision, not a default placement. | Marc and August |
| **D8** | **Backend build priority** | User-facing front end first, or CMS/backend in parallel? Deferred at the 18 Aug briefing to a follow-up that has not happened. Urgent on the roadmap. | David |
| **D9** | **Motion sign-off owner** | Marc, the board, or the Elder Advisory Group — and at which milestone. Unblocks R10 and the artwork/terrain permissions rather than being a separate ask. | Marc and August |
| **D10** | **Page copy ownership** | Raised at the briefing, not resolved. Four drafts now exist with no recorded author. | Marc and August |
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
| **R6** | **Lo-fi wireframes vs the open IA** | Wireframes are due 21 Aug while D1–D4 are unanswered. Answer D1 and D2 first — they are the two that change page structure. |
| **R7** | **Wireframes and motion structure** | Wireframes must state scroll spans in `vh` and mark which sections are Tier 1, or pinning gets retrofitted into a layout with no room for it. |
| **R9** | **Legal pages before any form goes live** | Privacy Policy, Terms and cookie notice are route stubs with no content. The homepage newsletter field is deliberately inert until they land. |
| **R12** | **Brand assets outstanding** | Logo vector files and the Good Dog Cool callout face not supplied. Low impact — both have marked placeholders. |

---

## Settled — do not reopen

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
- **Donations**: both one-time and recurring.
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
