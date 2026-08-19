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

**Ownership rule (19 Aug):** every risk or issue owned by Marc is co-owned by
August. `→ someone` means the owner is the route to that person, not that the
person is accountable in Proyekto.

## Index

| | Decision | Status | Owner |
| --- | --- | --- | --- |
| D1 | Blog and Resources: one thing or two? | Proposed | Marc, Ivy |
| D2 | Does Connect survive as a nav item? | Proposed | Marc |
| D3 | FAQs: scope, ownership, CMS or static | Proposed | Marc, David |
| D4 | Legal page naming and Cookie Policy | Proposed | David |
| D5 | Draft PDFs are the source of truth for copy | **Final** | Marc, August |
| D6 | Keep or cut the Living Work failure section | Proposed | Marc, August |
| D7 | Where fee-for-service land management lives | Proposed | Marc, August |
| D8 | Backend build priority | Proposed | David |
| D9 | Who signs off motion decisions | Proposed | Marc, August |
| D10 | Copy ownership per page | Proposed | Marc, August |
| D11 | Hosting and database accounts | Proposed | David |
| D12 | Homepage copy is CMS-editable | **Final** | August |
| F1 | Homepage copy lives in the repo | **Superseded** by D12 | August |
| F2 | Homepage thread is a plain vertical rule | **On hold** | August, Ivy, JC |
| F3 | Homepage Truth beat is typographic | **On hold** | August, Ivy |
| F4 | Motion tiers, two signature moments | **Final** | JC |
| F5 | Only Work Sans is tracked in git | **Final** | August |
| F6 | Local dev runs on port 3001 | **Final** | August |

Risks and issues are in Part 4: R1–R12.

---

# Part 1 — Decisions still open

Ten open. Record each as **Proposed**; when it is answered, change the status to
**Final** and write the answer into *The decision* rather than starting a new
entry — the point is that the reasoning stays attached to the outcome.

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
- **Context** — Three different namings are now in circulation across three
  documents:

  | Source | Terms | Cookies |
  | --- | --- | --- |
  | Build documentation | Terms of Use | cookie/consent notice |
  | Sitemap (uploaded) | Terms & Conditions | Cookie Policy |
  | Homepage copy draft footer | Terms of Service | Cookie Settings |

  The repo currently has `/legal/privacy` and `/legal/terms` ("Terms of Use")
  and no cookie route. Note "Cookie **Settings**" in the draft implies a consent
  preferences dialog, not a policy page — those are different things and may
  both be wanted.
- **Why it matters** — Renaming a legal page's URL after launch breaks inbound
  links and any reference from a Stripe receipt or email footer. It costs
  nothing to settle before the routes are built.
- **Options considered**
  1. Adopt the sitemap: `/legal/terms-and-conditions` + `/legal/cookies`.
  2. Keep `/legal/terms` and fold cookies into the Privacy Policy.

---

## D6 — Keep or cut "The parts that are not in the annual report"

- **Category** — Content
- **Status** — Proposed · **Visibility** — Shared · **Owner** — Marc and August, with the client
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
- **Status** — Proposed · **Visibility** — Shared · **Owner** — Marc and August
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
- **Status** — Proposed · **Visibility** — Shared · **Owner** — Marc and August
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
- **Status** — Proposed · **Visibility** — Shared · **Owner** — Marc and August
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

# Part 2 — Decisions made

Settled. Recorded so the reasoning survives the people who were in the room.
Record as **Final**, except F1 which is **Superseded**.

---

## D5 — The draft PDFs are the source of truth for copy · **RESOLVED**

- **Category** — Content
- **Status** — **Final** · **Visibility** — Shared · **Owner** — Marc, with August
- **The decision** — The draft documents in `docs/content/drafts/` govern page
  **copy and content**. They do **not** govern web design — the lo-fi and hi-fi
  wireframes are the source of truth for that.
- **Context** — The copy in `src/content/homepage.ts` had been reconstructed
  from the build documentation before the drafts existed, and the two had
  drifted apart — different hero subhead, and Invitation cards titled
  *Experience Country / Research Together / Learn from Living Work* rather than
  *Wonder / Truth / Living Work*.
- **Why** — Two versions of the homepage copy were in circulation with no rule
  for which won. Splitting it by artefact type — drafts own words, wireframes
  own design — means neither has to arbitrate the other.
- **Done** — `src/content/homepage.ts` now matches
  `YACHATDAC-Homepage-Copy-v1.pdf`, with one deliberate exception: the draft's
  Acknowledgement of Country names the Northern Territory and was **not**
  copied across. See risk R1.

---

## F1 — Homepage copy lives in the repo, not the CMS · **SUPERSEDED**

- **Category** — Architecture · **Status** — **Superseded** by D12 · **Owner** — August
- **What it said** — Homepage copy lives in `src/content/homepage.ts` and
  changes only by pull request, because the homepage is one authored narrative
  rather than a collection of entries.
- **Why it was replaced** — Confirmed with August that homepage copy will be
  CMS-editable like every other page. The reasoning behind the original call
  (protecting a carefully written narrative from casual edits) is real, but it
  is an editorial-permissions problem, not an architectural one — the CMS
  already has a draft → review → approved workflow for exactly that.

---

## D12 — Homepage copy is CMS-editable · **RESOLVED**

- **Category** — Architecture
- **Status** — **Final** · **Visibility** — Shared · **Owner** — August
- **The decision** — Homepage **copy** is editable in the CMS. **Design,
  animation, motion and section structure are not** — those stay in code.
- **Context** — Supersedes F1. Confirmed with August.
- **Why** — The client's team is small and non-technical. Making them raise a
  pull request to fix a typo on the most-read page of the site is the wrong
  trade. Editorial safety comes from the CMS approval workflow instead.
- **Build implication** — The homepage becomes a CMS content type (a singleton
  page with one entry per beat), not a hardcoded module.
  `src/content/homepage.ts` is now the **seed/default** the CMS is populated
  from, and is marked as such in the file. Nothing downstream should assume
  those strings are compile-time constants.
- **Note** — → task for David: add the homepage to the CMS content model
  (Phase 6). Not blocking anything today.

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

# Part 3 — Decisions on hold

Deliberately not settled yet. There is no final homepage design, and the lo-fi
and hi-fi wireframes are the source of truth for web design — so these wait.

Each entry separates the **interim position** (what is built today, and what
would change) from **what does not change with the design** — the cultural
constraints underneath, which a wireframe cannot clear. Those lift when a
permission is recorded, not when a design is drawn.

---

## F2 — The homepage thread is a plain vertical rule · **ON HOLD**

- **Category** — Motion / cultural governance · **Status** — Proposed (on hold)
  · **Owner** — August, with Ivy and JC
- **On hold because** — There is no final homepage design yet. The lo-fi and
  hi-fi wireframes are the source of truth for web design, so this is not
  recorded as Final until they land.
- **The interim position** — What is built today: a straight vertical progress
  rule, no meander, no waypoint nodes.
- **What does not change with the design** — Sketch C1 (continuous line with
  lit waypoints) is on **hold** in the motion skill because a meandering line
  with waypoints reads as Aboriginal iconography and needs sign-off. That is a
  cultural constraint, not a design preference, so a wireframe drawing a
  meandering path does not clear it — decision D9 (who signs off motion) does.
  Until then the plain rule is the only cleared option.

---

## F3 — The homepage Truth beat is typographic · **ON HOLD**

- **Category** — Content / cultural governance · **Status** — Proposed (on
  hold) · **Owner** — August, with Ivy
- **On hold because** — Same as F2: the wireframes decide the visual treatment
  of this beat, and they do not exist yet.
- **The interim position** — What is built today: typography and ground colour
  alone, no imagery.
- **What does not change with the design** — Story-wall imagery permission is
  unresolved and is treated as unavailable, and the motion skill forbids
  animating cultural-site imagery in any form. A wireframe specifying a photo
  of the engravings would not unblock it; the permission would. See risk R10.

---

# Part 4 — Risks & Issues

**Issue** = already true. **Risk** = might become true.

---

## R1 · ISSUE · High — Acknowledgement of Country names the wrong jurisdiction

- **Owner** — Marc and August → Suzanne Thompson
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

- **Owner** — Marc and August → client / researchers
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

- **Owner** — Marc and August → brand team
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

- **Owner** — Marc and August
- **What could go wrong** — Bantayog Sans arrived with no licence file at all.
  Terms are simply unknown.
- **Impact** — Same class of exposure as R3, on the subheadline and eyebrow
  face.
- **Next step** — Ask whoever supplied it for the licence, and file it beside
  `WorkSans-OFL.txt`.

---

## R5 · RISK · High — Suzanne's approvals are on the critical path

- **Owner** — Marc and August
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

- **Owner** — Ivy, with Marc and August
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

- **Owner** — Marc and August → Elder Advisory Group
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

- **Owner** — Marc and August
- **What could go wrong** — Logo vector files (SVG/EPS) and the Good Dog Cool
  callout face have not been supplied.
- **Impact** — Low. The header renders a marked text placeholder and the
  callout face has a reserved slot; neither blocks the build.
- **Next step** — Supply when convenient. Do **not** recreate the logo in code
  in the meantime.

---

# Part 5 — Roadmap housekeeping

Small, and doable through MCP on request.

| Item | Action |
| --- | --- |
| "Set up the front-end project with fonts and design tokens" *(assigned JC)* | Substantially done — repo, tokens and fonts all landed. Move to **in_review**. |
| "Upload font assets (**Black Berto, Good Dog, Work Sense**)" | Meeting-transcript garble. Should read **Block Berthold, Good Dog Cool, Work Sans**. |
| "Lo-fi wireframes for inner pages (About, **Forums**, informational)" | There is no forum on this project. Likely "forms" or a mishearing — confirm and retitle. |
| "Define the site map and information architecture" *(urgent, open)* | Blocked on D1–D4. Consider marking **blocked** so the reason is visible. |
| **New task needed** — David, Phase 6 | Add the homepage to the CMS content model as a singleton page, one entry per beat. Follows from D12. Not blocking today. |
| **New task needed** — Marc/August | Confirm the legal page labels (D4) before the routes are built, so no URL has to change after launch. |
