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
| D13 | Living Work's closing CTA: newsletter, or the draft's two endings | Proposed | Marc, Ivy |
| D14 | What follows the Truth descent | Proposed | Marc, Ivy |
| D15 | The Record's taxonomy: two facet axes | Proposed | Marc, David |
| D16 | Does `/partnerships` exist as a destination? | Proposed | Marc, August |
| D17 | Is `/our-people` a route? | Proposed | Marc |
| D18 | Persistent homepage navbar, or no nav until block 6? | Proposed | Marc, Ivy |
| D19 | Where the empty state's "ask us what exists" goes | Proposed | Marc |
| F1 | Homepage copy lives in the repo | **Superseded** by D12 | August |
| F2 | Homepage thread is a plain vertical rule | **On hold** | August, Ivy, JC |
| F3 | Homepage Truth beat is typographic | **On hold** | August, Ivy |
| F4 | Motion tiers, two signature moments | **Final** | JC |
| F5 | Only Work Sans is tracked in git | **Final** | August |
| F6 | Local dev runs on port 3001 | **Final** | August |

Risks and issues are in Part 4: R1–R15.

---

# Part 1 — Decisions still open

Seventeen open. Record each as **Proposed**; when it is answered, change the status
to **Final** and write the answer into *The decision* rather than starting a new
entry — the point is that the reasoning stays attached to the outcome.

**D13 now has its write-up.** It was claimed by a note on the Living Work lo-fi
frame (Figma node `13:100`) and carried for a while as a number with no entry.
That is exactly how decisions get lost, so it is written up below.

**D18 came out of a readout file, not a decision log.** It had been sitting in
`docs/design/hifi-figma-readout.md` §2 marked *"unresolved, and a genuine design
decision rather than an error. Flagged for the team"* — flagged, but never given
an ID or an owner, and it changes the header on every page.

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

## D14 — What follows the Truth descent

- **Category** — Information architecture / content
- **Status** — Proposed · **Visibility** — Shared · **Owner** — Marc, with Ivy
- **The decision** — Whether the five structured blocks below the Truth timeline
  — *The browsable record · What's been researched · Open research opportunities
  · Partnership opportunities · Partner with us* — stay on that page, move to
  Resources / The Record, or are replaced by something shorter.
- **Context** — Four things now point the same way.

  1. **The copy was never commissioned.** `src/content/truth.ts` has said so on
     its own face since it was written: *"NO SOURCE COPY EXISTS. The copy
     document ends at the Wattanuri entry, so roughly a fifth of this page is
     uncommissioned … Retaining it is a decision."*
  2. **The sitemap already dropped half of it.** STATUS.md note 6: the uploaded
     sitemap gives Truth only Open Research Opportunities. Partnership
     opportunities is gone.
  3. **The Record draft (21 Aug) writes real copy for the same content, on
     Resources.** *Everything in the record* is the browsable record, with a
     filter bar and twelve written entries. *What we do not know* is the research
     opportunities section, with four written gaps — and its CTA points at
     `/partnerships/#research-opportunities`, routing them off Truth entirely.
  4. **It reads badly, which is what the 21 Aug lo-fi walkthrough caught.** The
     Truth lo-fi frame is 14,205px. The descent's last entry is Wattanuri,
     closing on *"Lore is not a date. It is the floor everything above has been
     resting on the whole way down."* Roughly 313vh of card grids and a form then
     follow it. The layout puts four filterable grids underneath the floor the
     copy has just declared.

- **Why it matters** — This is a fifth of the longest page on the site, and it is
  the page's ending. It also moves the navigation: `src/content/site.ts` currently
  lists `/truth#researched` and `/truth#opportunities` as Truth's nav children, so
  answering this retargets two primary nav items. And it decides whether David
  models this content once or twice.
- **The constraint that does not move** — **`#partner` stays on Truth.** The About
  draft's own contact router sends *"Research or partnership — universities,
  funders, brands"* to `/truth#partner`, and Living Work links the same anchor.
  The enquiry form is Truth's job; the browsable archive is not.
- **Options considered**
  1. **Recommended — one closing band, roughly 120vh instead of 313vh.** After
     Wattanuri: a quiet outbound line to The Record (one line, not a grid), two
     or three *named* open opportunities as a compact list, and the `#partner`
     enquiry form. Then the footer. The descent ends where its copy says it ends,
     and nothing is duplicated across two pages.
  2. **Keep the tail, commission the copy.** Honest, but it means writing a fifth
     of the page from scratch against a 14 September launch, and maintaining two
     browse interfaces over one collection — which is D1's problem again.
  3. **Cut everything including `#partner`.** Cleanest page, but it strands two
     inbound links and removes the site's only research-enquiry route.
- **Drawn, not built** — the proposed version is wireframed as
  `Truth — v2 PROPOSED` on the lo-fi canvas, below the reviewed row. The signed-off
  frame above it is untouched. No `src/` change until this is Final.

---

## D15 — The Record's taxonomy: two facet axes, and what happens to Event

- **Category** — Content model
- **Status** — Proposed · **Visibility** — Shared · **Owner** — Marc, with David
- **The decision** — Whether the Resources collection is filtered on one axis or
  two, and whether `Event`, `Activity` and `Update` survive as content types.
- **Context** — `resourcesHub.contentTypes` in `src/content/site.ts` is one flat
  list: History · Research · Publication · Event · Activity · Story · Update. The
  Record draft uses a different type list — Stories · Historical accounts ·
  Research · Documentation · Recordings — **plus a source axis that does not exist
  in the code at all**: Iningai knowledge · Colonial record · Published research.
- **Why it matters** — Two things, of different sizes.

  The small one: `Event` is dropped, which collides with the settled position
  *"no separate Events page; Event is a content type inside Resources."* If Event
  goes, events have nowhere to live.

  The large one: the source axis is an epistemology, not a format. *Who says so* —
  the community, the coloniser, or the journal — is the exact distinction the
  whole Truth page is built on, and offering it as a filter over the record is a
  stronger idea than the flat type list currently modelled. It is also a second
  required field on every entry and a second filter control in the UI, so it is
  David's content model and Ivy's layout, not a copy tweak.
- **Options considered**
  1. Adopt both axes as drafted, and re-add Event/Activity/Update to the type list.
  2. Adopt both axes exactly as drafted, and find another home for events.
  3. Keep one axis and express source as ordinary tags — cheapest, and loses the
     idea that makes the record worth browsing.

---

## D16 — Does `/partnerships` exist as a destination?

- **Category** — Information architecture
- **Status** — Proposed · **Visibility** — Shared · **Owner** — Marc and August
- **The decision** — Whether to create a partnerships page, or keep research and
  partnership opportunities where build documentation §4 puts them, on Truth.
- **Context** — The Record draft's *What we do not know* section links
  `/partnerships/#research-opportunities`. No such route exists in
  `src/content/site.ts` or in the build documentation. It is the first appearance
  of a partnerships destination anywhere in the project.
- **Why it matters** — It is the same question as **D14** seen from the other
  end, and the two should be answered together rather than separately. It also
  bears on **D7** — fee-for-service land management has no home in the sitemap
  and its audience is landholders, which is closer to a partnerships page than to
  any of the three pillars.

---

## D17 — Is `/our-people` a route?

- **Category** — Information architecture
- **Status** — Proposed · **Visibility** — Shared · **Owner** — Marc
- **The decision** — Whether the About draft's *"Meet the people →"* link
  (`/our-people`) is a new combined page, or Connect's existing team and Suzanne
  sections under a new name.
- **Context** — Build documentation §4 has *The YACHATDAC Team* and *About
  Suzanne Thompson* as two separate items under Connect. The About draft names
  Suzanne, the Iningai Rangers and the families in one paragraph and sends the
  reader to a single destination.
- **Why it matters** — Small on its own, but it is the third item pulling
  material out of Connect, after About and Contact. Answer it alongside **D2**
  rather than on its own; if Connect ends up holding only the team, that is the
  answer to both.

---

## D13 — Living Work's closing CTA

- **Category** — Content / conversion
- **Status** — Proposed · **Visibility** — Shared · **Owner** — Marc, with Ivy
- **The decision** — Whether Living Work ends on the build specification's
  **newsletter signup**, or on the two closing blocks the copy draft actually
  ends with — **"Talk to us →"** and **"Come on Country →"**.
- **Context** — The build specification names newsletter signup as this page's
  confirmed CTA. The copy draft ends somewhere else entirely, on a section headed
  *"Come and see it, or ask us."* — *"Communities working through the same
  questions are welcome here. It is easier to show than to write down, and most
  of what matters is not on this page."* The lo-fi is built to the draft, with the
  divergence flagged rather than silently resolved.
- **Why it matters** — This pillar's audience is other Indigenous communities, and
  the draft's two endings offer them a conversation. A newsletter signup offers
  them a mailing list. Those are different propositions, and the page's whole tone
  is peer-to-peer rather than broadcast.
- **Options considered**
  1. **Recommended — keep the draft's two endings primary**, and let the
     newsletter live in the footer band, which every page already carries.
  2. Newsletter as the page CTA, per the build specification, with the two
     endings demoted or cut.
  3. Both, stacked — most likely outcome is that neither gets used.
- **Note** — Do **not** refer to this as "D3" in motion or design panels. D3 is
  the FAQs decision, and it is also a Tier 1 sketch ID (depth-map parallax), which
  is dangerously ambiguous in any panel that lists sketch IDs alongside decisions.

---

## D18 — Persistent homepage navbar, or no navigation until block 6?

- **Category** — Information architecture / design
- **Status** — Proposed · **Visibility** — Shared · **Owner** — Marc, with Ivy
- **The decision** — Whether the homepage carries a persistent navigation bar from
  the first screen, or no navigation at all until block 6, *The Invitation*.
- **Context** — Three sources disagree.

  | Source | Says |
  | --- | --- |
  | Homepage copy draft | No navigation until block 6. Blocks 1–5 are pure immersion, and the three invitation cards are the first navigation choice offered. |
  | Marc's hi-fi | A `Navbar / 1 /` frame at `y=0`, above the hero, carrying WONDER · TRUTH · LIVING WORK · CONNECT. |
  | Uploaded sitemap | A persistent navbar. |

  The lo-fi is built to the copy draft, with a note on the frame saying so. The
  divergence was recorded in `docs/design/hifi-figma-readout.md` §2 on 20 Aug as
  *"unresolved, and a genuine design decision rather than an error"* — but it was
  never given an ID, an owner or a place in this file.
- **Why it matters** — It changes the header on **every page**, not just the
  homepage, so it touches all seven wireframes and the shared component that
  carries it. It is also a real argument rather than an oversight: the draft's
  position is that withholding navigation for five blocks *is* the homepage's
  argument. Overriding that should be a decision someone made, not a default that
  arrives with a component library.
- **Options considered**
  1. No nav until block 6, per the copy draft — strongest version of the page's
     own argument; unconventional, and some visitors will scroll looking for a menu.
  2. Persistent navbar from `y=0`, per the hi-fi and the sitemap — conventional and
     safe; costs the immersion the first five blocks are built for.
  3. Navbar that appears on scroll, after block 5 — keeps the argument and gives
     the reader a way out. Not in any source document; would need drawing.

---

## D19 — Where the empty state's "ask us what exists" goes

- **Category** — Information architecture / content
- **Status** — Proposed · **Visibility** — Shared · **Owner** — Marc
- **The decision** — What the offer in The Record's empty state actually links to.
- **Context** — The Record draft writes its own empty state, which is unusual:
  *"Nothing here yet under that. Try another subject, or ask us what exists."*
  The second half is a genuine offer, and it currently has no destination.
- **Why it matters** — Small, but it is the only empty state on the site that
  invites a conversation instead of apologising, and it fits the page's own
  argument that the record is incomplete. Left unanswered it will ship as
  unlinked text, which turns a good line into a dead one. Candidates are the
  general contact form on Connect and the *"Do you hold something?"* block further
  down the same page.

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

## R13 · ISSUE · Medium — The organisation's own legal name is unconfirmed and hardcoded sitewide

- **Owner** — Marc and August → Suzanne Thompson
- **What is happening** — The About draft flags on its own face that the logo and
  the published research disagree on the spelling: *"Confirm spelling: Yambangku
  or Yumbangku."* `src/content/site.ts` asserts **Yambangku** in `org.legalName`,
  and that string renders in the footer and in page metadata on **every route**.
  ICN and ABN are both still blank in the draft.
- **Impact** — Getting an organisation's registered name wrong across an entire
  site is a small error with a bad shape here: this is a client whose own argument
  is that they were recorded wrongly by other people. It would be quoted back.
- **Next step** — Confirm against the ORIC register, which is authoritative and
  public, rather than against the logo. Collect ICN and ABN in the same ask.
- **Current mitigation** — None. The name is a plain constant today, and reads as
  settled to anyone who opens the file. Worth marking as unconfirmed in the code
  once someone is chasing it.

---

## R14 · RISK · Medium — Ngapartji-Ngapartji is Western Desert language, not Iningai

- **Owner** — Marc and August → Suzanne Thompson
- **What could go wrong** — The client's Ten-Year Strategic Plan frames
  reciprocity as the *Ngapartji-Ngapartji* principle. The About draft flags that
  this is Western Desert language and asks for it to be confirmed.
  `src/content/truth.ts` currently *recommends* framing the Truth enquiry form
  with it.
- **Impact** — Truth's entire argument is that the record was got wrong about
  these people by outsiders who used the wrong names. Framing that page's
  reciprocity ask in another nation's language is the specific error the page
  indicts, and researchers are the audience most likely to notice.
- **Next step** — Ask Suzanne. The client's own plan uses the term, so this is a
  question, not a correction to make unilaterally — there may be a deliberate
  reason, or an Iningai word that belongs there instead.
- **Current mitigation** — It is a spec note in `truth.ts`, not rendered copy. The
  cost of settling it is zero until the enquiry form is written.

---

## R15 · ISSUE · Low — Four copy details are unanswered and unowned

- **Owner** — Marc and August → the copy owner (which is **D10**, still open)
- **What is happening** — Four small questions are marked on the wireframes and
  belong to nobody:

  | # | Detail | Where |
  | --- | --- | --- |
  | 1 | Turraburra has no reliable mobile coverage. If a phone number is published, which hours is it answered? | About, *Get in touch* |
  | 2 | The "on request" gate has no stated response time and no contact point. | The Record, *Items marked on request* |
  | 3 | Five-Year Review shows `2031` as both its meta line and its status pill — the export collapsed two fields into `20312031`. Every other row is `<meta>` + `<status>`, so the status probably wants to read *Committed*. | The Record, *Documents and reports* |
  | 4 | The Cultural Knowledge Precinct is tagged **Written record** in the copy draft, but it is a building that does not exist yet — *"master planning is underway"*. An evidence tag on a future facility reads as a PDF-extraction artefact. | Truth, *Ahead* |

- **Impact** — Individually trivial. Together they are the reason **D10** matters:
  four questions that any copy owner could answer in ten minutes have been sitting
  on wireframes because no page has a named owner. Items 1 and 2 are the ones that
  reach the public as a broken promise — a phone number nobody answers, and a
  request process with no stated response.
- **Next step** — Answer them in the same pass as D10, rather than as four
  separate asks.
- **Current mitigation** — All four are marked on the frames and none is invented
  copy; the drafts' own bracketed notes are preserved where they exist.

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
