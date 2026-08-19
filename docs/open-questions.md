# Open questions & blockers

Live list. Resolve upward — anything marked **blocking** stops real work.
Cross-referenced to section 17 of the build documentation.

## Blocking

| # | Item | Why it blocks | Who |
| --- | --- | --- | --- |
| 1 | **DGR / charity status for donations** | Donation receipt copy must not claim tax-deductibility until verified directly against the org's ACNC/state registration. Earlier information said "registered DGR"; the Ten-Year Strategic Plan lists securing DGR as a *Year 1 goal*, which reads as not yet secured. This is a compliance risk, not a wording preference — do not rely on either prior answer. | Client |
| 2 | **Font licences** | Fonts are installed and working, but Block Berthold carries an Adobe / H. Berthold AG copyright — a commercial retail face, and a desktop licence does not cover `@font-face` distribution. Bantayog Sans shipped no licence at all. Only Work Sans (OFL) is clear. Needed before the site reaches a public server. | Brand team |
| 3 | **Story-wall imagery permission** | Unresolved. Treat as unavailable — the homepage Truth beat is built typographically because of it. | Elder Advisory Group / Marc |
| 4 | **Welcome to Country wording** | Suzanne Thompson is an actual Traditional Owner, so a genuine Welcome to Country is possible in her own words. Footer, text only, no ceremony element, no popup. Not ours to write. **The homepage copy draft currently acknowledges the Northern Territory** — wrong jurisdiction; YACHATDAC is on Iningai Country in Central Western Queensland. See `docs/content/STATUS.md` note 1. | Suzanne Thompson |
| 4a | **Suzanne's Truth-page testimony** | The Truth timeline draft carries her words from the Unfinished Business and Yacadak Framework recordings, edited for reading and re-ordered. The document states on its face that nothing publishes until she has seen and signed it off. Held by community. | Suzanne Thompson |
| 4b | **Story wall dating** | Drafts disagree by a factor of ten — 55,000 years on Homepage and Wonder, 5,000 on the Truth timeline. One sourced number, used everywhere. See `docs/content/STATUS.md` note 2. | Client / researchers |

## Open

| # | Item | Current state |
| --- | --- | --- |
| 5 | **Artwork motion permission** | Vectorised artwork received from Leonard Mickelo; no motion permission recorded. Artwork stays static. Group L behaviours (derived from composition, not motifs) are cleared. |
| 6 | **Land / terrain detail level** | Approved in principle for About and Research pages, detail level unconfirmed. Until confirmed: abstracted or generic terrain only. No real elevation data for Turraburra, no boundaries, no place names, no coordinates anywhere in data or source. |
| 7 | **Motion sign-off owner** | Marc to confirm whether it is him, the board, or the Elder Advisory Group — and at which milestone. |
| 8 | **Fee-for-service land management & cultural advisory** | A real revenue stream in the strategic plan (Goal 3.5) with no home in the sitemap. Audience is other landholders, which does not cleanly match any of the three pillars. Needs a decision, not a default placement. |
| 9 | **Backend build priority** | User-facing front end first, or CMS/backend in parallel? Deferred to a follow-up meeting. |
| 10 | **Page copy ownership** | Who writes the copy for each page was raised and not resolved. |
| 11 | **Guesting itinerary validation** | The day-by-day 2 Night / 3 Day outline was reconstructed from crew interviews. Needs Suzanne/Steve sign-off before publishing. |
| 12 | **Email / SMTP full spec** | Reference the existing ImHereTravels build for template-builder scope, reply/inbox handling and SMTP credentials. Confirm against that codebase before estimating. |
| 13 | **Which events need RSVP** | RSVP is confirmed in scope for community gatherings and research visits. The exact list of recurring event types defaulting to RSVP vs announcement-only is a follow-up, not a blocker. |
| 14 | **Hosting / database account** | Whether to use one shared Gmail account or individual accounts. Acknowledged, not elaborated. |

## Settled — do not reopen

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
