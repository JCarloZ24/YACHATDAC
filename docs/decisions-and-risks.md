# Decisions, Risks & Issues — paste-ready

Everything here is written to be **copied straight into Proyekto**:

- **Decisions** → Management → Decisions → *Record a decision*
- **Risks & Issues** → Management → Risks & Issues

## Why this is a file and not already in Proyekto

The Proyekto MCP connector exposes projects, the roadmap (epics, features,
tasks, milestones), chat, members and comments. It has **no tools for
Decisions, Risks & Issues or Change Requests**, so those three sections cannot
be written to programmatically — they have to be entered through the web UI.

Roadmap tasks *can* be created and assigned through MCP. Where an item below is
really a piece of work rather than a decision or a risk, it is marked
**→ task** and can be created on request.

## Owners

| Name | Role on this project |
| --- | --- |
| **Marc** (Marc Dungog) | Design system, brand direction, UI — and the route to the client |
| **Ivy** (Jasmin Ivy C. Fedilo) | Web design, layout, wireframes |
| **JC** (Juan Carlos Gan) | Front end, 3D and animation |
| **David** (David Bato-bato) | Backend / development lead |
| **Joshua** (Joshua Mistal) | Image editing |
| **August** (August Teleg) | Project owner |
| **ven** | Video editing |

Field names below match the Decision modal exactly. The Risks & Issues form has
not been seen, so those entries use a plain shape — remap as needed.

---

# Part 1 — Decisions still open

Record these as **Proposed**. Change to **Final** when answered, and write the
answer into *The decision*.

---

## D1 — Blog and Resources: one thing or two?

- **Category** — Information architecture
- **Status** — Proposed · **Visibility** — Shared · **Owner** — Marc, with Ivy
- **The decision** — Whether the uploaded sitemap's top-level **Blog** area
  (Bookmarks, Categories, Archives, Search Blog, Blog Interior) is a second
  browse interface alongside **Resources**, or the same editorial collection
  under a different name. If they are one thing, which name survives.
- **Context** — The build documentation defines a single unified Blog/Editorial
  collection, with Resources as the one hub where everything is filterable by
  pillar and content type. The sitemap now shows both Blog and Resources as
  separate destinations, with overlapping contents.
- **Why it matters** — This is the largest open question in the IA and
  everything downstream waits on it: the navigation in `src/content/site.ts`,
  Ivy's lo-fi wireframes, and David's CMS content model. Two browse interfaces
  over the same posts confuses editors (which one do I publish to?) and
  visitors (why are there two archives?). Left unanswered, it gets resolved by
  accident during the build.
- **Options considered**
  1. **One collection, keep "Resources"** — matches the build documentation;
     Blog's Categories/Archives/Search become filters on the Resources hub.
  2. **One collection, rename to "Blog"** — more familiar to visitors, but
     "Resources" is what the client's own sitemap slide used.
  3. **Two genuinely separate areas** — needs a stated rule for what belongs in
     each, and doubles the editorial surface.

---

## D2 — Does Connect survive as a navigation item?

- **Category** — Information architecture
- **Status** — Proposed · **Visibility** — Shared · **Owner** — Marc
- **The decision** — Whether **Connect** remains in the navigation now that
  **About** and **Contact** have been lifted out of it to top level.
- **Context** — Connect was the utility hub holding About YACHATDAC, the team,
  Suzanne, Turraburra and Resources. The sitemap promotes About and Contact to
  the navbar, which leaves Connect holding a thinner set.
- **Why it matters** — Affects the primary navigation and the footer, both of
  which appear on every page. Cheap to settle now, expensive once wireframes
  and hi-fi mockups are built around it.
- **Options considered**
  1. Retire Connect; About and Contact stand alone, Resources goes top level.
  2. Keep Connect as the container and drop About/Contact back inside it.
  3. Keep all three, with Connect reduced to team and Turraburra.

---

## D3 — FAQs: scope, ownership and whether it is CMS-managed

- **Category** — Content
- **Status** — Proposed · **Visibility** — Shared · **Owner** — Marc, with David
- **The decision** — Whether the **FAQs** page in the sitemap footer is in
  scope, who writes it, and whether it is a CMS collection or a static page.
- **Context** — FAQs appear in the uploaded sitemap and nowhere in the build
  documentation. There is no spec, no content model and no named author.
- **Why it matters** — An unspecced page still needs a template, a content
  model and someone to write it. If it is CMS-managed it is another collection
  for David to model; if static it is another page for copy ownership.

---

## D4 — Legal page naming and the missing Cookie Policy

- **Category** — Legal / compliance
- **Status** — Proposed · **Visibility** — Shared · **Owner** — David
- **The decision** — Confirm the final labels and routes for the legal pages.
  The sitemap says **Terms & Conditions** plus a **Cookie Policy**; the repo
  currently has `/legal/privacy` and `/legal/terms` ("Terms of Use") and no
  cookie route.
- **Context** — The build documentation calls for a Privacy Policy, Terms of
  Use and a cookie/consent notice, since GA4 sets tracking cookies. The sitemap
  is probably right that a separate Cookie Policy is wanted.
- **Why it matters** — Renaming a legal page's URL after launch breaks inbound
  links and any reference from a Stripe receipt or email footer. It costs
  nothing to settle before the routes are built.
- **Options considered**
  1. Adopt the sitemap: `/legal/terms-and-conditions` + `/legal/cookies`.
  2. Keep `/legal/terms` and fold cookies into the Privacy Policy.

---

## D5 — Which homepage copy is the source of truth?

- **Category** — Content
- **Status** — Proposed · **Visibility** — Shared · **Owner** — Marc, with August
- **The decision** — Whether `src/content/homepage.ts` should be rewritten to
  match `YACHATDAC-Homepage-Copy-v1.pdf`.
- **Context** — The copy currently in the repo was reconstructed from the build
  documentation before the draft existed. The two differ in real ways — the
  hero subhead, and the Invitation cards are titled *Wonder / Truth / Living
  Work* in the draft versus *Experience Country / Research Together / Learn
  from Living Work* in the repo.
- **Why it matters** — Two versions of the homepage copy are in circulation.
  Whichever is chosen, the other should stop being edited.
- **Note** — → task once decided. The draft is not approved yet, so this is
  sequenced behind editorial sign-off.

---

## D6 — Keep or cut "The parts that are not in the annual report"

- **Category** — Content
- **Status** — Proposed · **Visibility** — Shared · **Owner** — Marc, with the client
- **The decision** — Whether the Living Work draft's failure section — the
  broken grader, the failed bore pump — stays on the public page.
- **Context** — The draft raises this itself and notes it can be cut in one
  move. It is written for practitioners, who find failures more useful than
  successes, and may sit badly with a government funder reading the same page.
- **Why it matters** — The pillar's stated audience is other Indigenous
  communities, not funders, and this is arguably the most useful section on the
  page for that reader. Cutting it to please a secondary audience would weaken
  the page for its primary one. Worth a deliberate answer rather than a default.

---

## D7 — Where fee-for-service land management lives

- **Category** — Information architecture
- **Status** — Proposed · **Visibility** — Shared · **Owner** — Marc
- **The decision** — Where to place fee-for-service land management and
  cultural advisory in the site structure.
- **Context** — The Ten-Year Strategic Plan names this as a real revenue stream
  (Goal 3.5). Its audience is neighbouring and regional landholders, which does
  not match any of the three pillars. The sitemap marks it **NOT YET PLACED /
  PENDING**; the Living Work draft notes it sits at Year 4 and leaves it off.
- **Why it matters** — Leaving it off is a reasonable holding position, but it
  is not a resolution, and a default placement would put it in front of the
  wrong audience.

---

## D8 — Backend build priority

- **Category** — Delivery
- **Status** — Proposed · **Visibility** — Shared · **Owner** — David
- **The decision** — Build the user-facing front end first, or build the
  CMS/backend in parallel with it.
- **Context** — Raised at the 18 August briefing and deferred to a follow-up
  meeting that has not happened. Already on the roadmap as an urgent Phase 0
  task.
- **Why it matters** — Launch is 14 September. The answer determines whether
  David starts the content model now or waits for the front end to settle.

---

## D9 — Who signs off motion decisions

- **Category** — Governance
- **Status** — Proposed · **Visibility** — Shared · **Owner** — Marc
- **The decision** — Whether motion sign-off sits with Marc, the board, or the
  Elder Advisory Group — and at which milestone.
- **Context** — The motion skill's permissions board lists this as unresolved.
  Several behaviours are already on hold waiting for a named approver.
- **Why it matters** — Without a named approver, blocked items stay blocked and
  nobody is wrong for not deciding. This unblocks the artwork-motion and
  land-detail questions rather than being a separate ask.

---

## D10 — Copy ownership per page

- **Category** — Content
- **Status** — Proposed · **Visibility** — Shared · **Owner** — Marc
- **The decision** — Name one person responsible for the copy on each page.
- **Context** — Raised at the 18 August briefing, acknowledged, not resolved.
  Four page drafts now exist without a recorded author.
- **Why it matters** — Approval routing depends on knowing who owns the words.

---

## D11 — Hosting and database accounts

- **Category** — Infrastructure
- **Status** — Proposed · **Visibility** — Shared · **Owner** — David
- **The decision** — Use one shared project account for hosting and database
  services, or individual accounts.
- **Context** — Raised at the briefing and noted without detail.
- **Why it matters** — Handover to the client at the end of the project is far
  simpler if the services were never tied to a personal account.

---

# Part 2 — Decisions already made, worth recording

These are settled. They are here so the reasoning survives the people who were
in the room — record as **Final**.

---

## F1 — Homepage copy lives in the repo, not the CMS

- **Category** — Architecture · **Status** — Final · **Owner** — August
- **The decision** — Homepage copy lives in `src/content/homepage.ts` and is
  changed by pull request. Every other long-form page comes from the CMS.
- **Why** — The homepage is one authored narrative, not a collection of
  entries, and it changes rarely. In git it is versioned, reviewed, and cannot
  be edited into incoherence from the admin UI.

---

## F2 — The homepage thread is a plain vertical rule

- **Category** — Motion / cultural governance · **Status** — Final · **Owner** — August
- **The decision** — The connecting "thread" through the homepage is a straight
  vertical progress rule. It does not meander and it has no waypoint nodes.
- **Why** — The motion skill's sketch C1 (continuous line with lit waypoints)
  is on **hold**: a meandering line with waypoints reads as Aboriginal
  iconography and needs sign-off. The skill records the plain vertical rule as
  the cleared alternative, so that is what was built. It does not get
  "improved" into a path without a recorded permission.

---

## F3 — The homepage Truth beat is typographic

- **Category** — Content / cultural governance · **Status** — Final · **Owner** — August
- **The decision** — The Truth beat carries no imagery. It is built on
  typography and ground colour alone.
- **Why** — Story-wall imagery permission is unresolved, so it is treated as
  unavailable. The motion skill also forbids animating cultural-site imagery in
  any form — motion turns a record into a spectacle. Revisit only when a
  permission is recorded.

---

## F4 — Motion tiers, and a budget of two signature moments

- **Category** — Motion · **Status** — Final · **Owner** — JC
- **The decision** — Tier 1 (pinning, scrubbing, parallax, WebGL, signature
  moments) is homepage-only. Everything else, including every CMS-generated
  page, is Tier 2: entry staggers and hover states. Two signature moments on
  the homepage, total.
- **Why** — A CMS template must not be able to produce Tier 1 motion, or the
  site's motion vocabulary drifts every time an editor publishes. In code the
  split is enforced by keeping Tier 2 on IntersectionObserver and CSS with no
  GSAP dependency.

---

## F5 — Only Work Sans is tracked in git

- **Category** — Legal / compliance · **Status** — Final · **Owner** — August
- **The decision** — Work Sans (SIL OFL 1.1) is committed. Block Berthold and
  Bantayog Sans are gitignored and distributed through the Proyekto resources
  section.
- **Why** — Block Berthold carries an Adobe / H. Berthold AG copyright. A
  commercial font binary is far easier to keep out of a repository than to
  remove from its history later. Reversing this is one line in `.gitignore`
  once licences are confirmed.

---

## F6 — Local dev runs on port 3001

- **Category** — Tooling · **Status** — Final · **Owner** — August
- **The decision** — `npm run dev` is pinned to port 3001.
- **Why** — Port 3000 is occupied by a local Proyekto instance. Next.js will
  report "Ready" on 3000 when its own earlier process holds the port, so a
  browser check can silently land on the wrong app — which happened once during
  setup.

---

# Part 3 — Risks & Issues

**Issue** = already true. **Risk** = might become true.

---

## R1 · ISSUE · High — Acknowledgement of Country names the wrong jurisdiction

- **Owner** — Marc → Suzanne Thompson
- **What is happening** — The homepage copy draft acknowledges *"the Aboriginal
  people of the Northern Territory."* YACHATDAC is on **Iningai Country,
  Central Western Queensland** — Turraburra sits 120km north of Barcaldine. It
  reads as boilerplate carried over from another organisation's site.
- **Impact** — For an organisation whose entire proposition is that the Iningai
  were written out of the record, an acknowledgement naming the wrong Country
  is the single worst copy error available on this site. It would be noticed,
  and it would be quoted.
- **Next step** — Do not fix by substitution. Suzanne is an actual Traditional
  Owner, so a genuine **Welcome to Country** in her own words is possible here,
  which is rarer than the Acknowledgement most sites carry. Her wording is
  already outstanding — this is the same ask.
- **Current mitigation** — The footer renders a visibly marked placeholder that
  cannot ship unnoticed.

---

## R2 · ISSUE · High — Story wall dating differs by a factor of ten

- **Owner** — Marc → client / researchers
- **What is happening** — Homepage and Wonder both say the engravings are at
  least **55,000** years old. The Truth timeline says at least **5,000**, and
  carries its own "dating under review" note.
- **Impact** — A public claim about cultural heritage, contradicted across the
  same site, on a page whose argument is that the record has been got wrong
  before. It is the kind of error a journalist or a researcher finds first.
- **Next step** — One sourced number, used everywhere. The 2022 Marra Wonga
  study is the obvious source.

---

## R3 · RISK · High — Block Berthold has no confirmed webfont licence

- **Owner** — Marc → brand team
- **What could go wrong** — Block Berthold ships an Adobe / H. Berthold AG
  copyright. It is a commercial retail typeface, and a desktop licence does not
  cover serving the file over the web; `@font-face` distribution needs a
  separate webfont licence, usually priced by pageviews or domain.
- **Impact** — Serving it without one exposes YACHATDAC to a licensing claim.
  Discovering this after launch means either buying a licence under pressure or
  re-typesetting every headline on the site.
- **Next step** — Confirm whether the brand team or YACHATDAC holds a webfont
  licence. If not, price one or choose a replacement headline face **before**
  hi-fi mockups lock the typography.
- **Current mitigation** — Installed and working locally; kept out of git.

---

## R4 · RISK · Medium — Bantayog Sans licence unknown

- **Owner** — Marc
- **What could go wrong** — Bantayog Sans arrived with no licence file at all.
  Terms are simply unknown.
- **Impact** — Same class of exposure as R3, on the subheadline and eyebrow
  face.
- **Next step** — Ask whoever supplied it for the licence, and file it beside
  `WorkSans-OFL.txt`.

---

## R5 · RISK · High — Suzanne's approvals are on the critical path

- **Owner** — Marc
- **What could go wrong** — Two items need Suzanne Thompson personally: the
  Welcome to Country wording, and the Truth timeline, which carries her words
  from the Unfinished Business and Yacadak Framework recordings and states on
  its own face that nothing publishes until she has signed it off.
- **Impact** — Neither can be worked around, delegated, or drafted on her
  behalf. Launch is 14 September. If these are left until content load, they
  become the thing that moves the date.
- **Next step** — Get both in front of her early, as one conversation. Note the
  Truth draft also asks her a specific question — whether re-ordering her story
  so the count of thirty-five comes before the blankets is acceptable, or
  whether it wants telling forwards.

---

## R6 · RISK · High — Lo-fi wireframes are due 21 August with the IA still open

- **Owner** — Ivy, with Marc
- **What could go wrong** — Lo-fi wireframes are due in two days, but the
  sitemap raises four unanswered structural questions (D1–D4) and the roadmap
  task "Define the site map and information architecture" is still open.
  Wireframing an IA that then changes means redrawing.
- **Impact** — Slips into the hi-fi window (28–31 August), which is already
  tight against a 14 September launch.
- **Next step** — Answer D1 and D2 first; they are the two that change page
  structure. D3 and D4 can trail without blocking wireframes.

---

## R7 · RISK · Medium — Wireframes may omit scroll spans and motion tiers

- **Owner** — Ivy and JC
- **What could go wrong** — Motion is structural on this site. If wireframes do
  not state scroll spans in `vh` and mark which sections are Tier 1, pinning
  gets retrofitted into a layout that has no room for it.
- **Impact** — Rework at the front-end stage, and pins that land in the wrong
  place.
- **Next step** — Express spans in `vh` (standard section 100vh; pinned
  step-through ~320vh for four steps; pinned panorama ~250vh) and name
  behaviours by their sketch ID from the motion skill's library.

---

## R8 · RISK · High — DGR status is unverified but donations are launch scope

- **Owner** — David, with the client
- **What could go wrong** — Earlier information said YACHATDAC is a registered
  DGR. The Ten-Year Strategic Plan lists securing DGR status as a *Year 1
  goal*, which reads as not yet secured. Donations are live scope at launch.
- **Impact** — Donation copy or an emailed receipt claiming tax-deductibility
  without DGR status is a compliance problem, not a wording preference.
- **Next step** — Verify directly against the organisation's actual ACNC and
  state charity registration. Do not rely on either prior answer. Until then,
  keep all donation copy and receipt logic tax-deductibility-neutral.

---

## R9 · RISK · Medium — Legal pages must exist before any form goes live

- **Owner** — David
- **What could go wrong** — Newsletter signup, donations, merch orders and
  every enquiry form collect personal data. The Privacy Policy, Terms and
  cookie notice are currently route stubs with no content.
- **Impact** — Collecting personal data without a privacy policy is an
  Australian Privacy Act exposure. GA4 sets tracking cookies, which the notice
  must cover.
- **Next step** — Draft, then have them legally reviewed rather than only
  drafted internally. The newsletter field on the homepage is deliberately
  inert until this lands.

---

## R10 · RISK · Medium — Cultural permissions are unresolved and unowned

- **Owner** — Marc → Elder Advisory Group
- **What could go wrong** — Three permissions are open on the motion skill's
  board: artwork motion (vectorised artwork received, no motion permission
  recorded), land and terrain detail level, and story-wall imagery. None has a
  named approver, because D9 is itself unresolved.
- **Impact** — Work proceeds against placeholders indefinitely, or somebody
  makes the call informally — which is the specific failure the Elder Advisory
  Group exists to prevent.
- **Next step** — Settle D9 first, then take all three to whoever it names.
- **Current mitigation** — Artwork is static-only, terrain is abstracted with
  no real elevation data or place names, and the Truth beat is typographic.

---

## R11 · RISK · Medium — Media pipeline has no size or compression targets

- **Owner** — David, with ven and Joshua
- **What could go wrong** — Client video runs to 2GB per file and images are
  TIFF/RAW. No maximum file sizes or compression targets have been set, and the
  storage service has not been chosen.
- **Impact** — The homepage is video-led. Without targets, the above-the-fold
  payload budget (under 2.5MB) is decided by whoever exports last.
- **Next step** — Set targets before the homepage video is graded. Transcode
  background loops to roughly 1.2MB; never ship masters.

---

## R12 · RISK · Low — Brand assets outstanding

- **Owner** — Marc
- **What could go wrong** — Logo vector files (SVG/EPS) and the Good Dog Cool
  callout face have not been supplied.
- **Impact** — Low. The header renders a marked text placeholder and the
  callout face has a reserved slot; neither blocks the build.
- **Next step** — Supply when convenient. Do **not** recreate the logo in code
  in the meantime.

---

# Part 4 — Roadmap housekeeping

Small, and doable through MCP on request.

| Item | Action |
| --- | --- |
| "Set up the front-end project with fonts and design tokens" *(assigned JC)* | Substantially done — repo, tokens and fonts all landed. Move to **in_review**. |
| "Upload font assets (**Black Berto, Good Dog, Work Sense**)" | Meeting-transcript garble. Should read **Block Berthold, Good Dog Cool, Work Sans**. |
| "Lo-fi wireframes for inner pages (About, **Forums**, informational)" | There is no forum on this project. Likely "forms" or a mishearing — confirm and retitle. |
| "Define the site map and information architecture" *(urgent, open)* | Blocked on D1–D4. Consider marking **blocked** so the reason is visible. |
