# Content status board

One row per document. Update it in the same commit that moves a file between
folders.

**Circle** is the internal governance tag (build documentation §12) — `open`,
`shared with care`, or `held by community`. It is never shown to visitors, but
it decides who has to sign off.

## Documents

| Document | Page | State | Circle | Blocked on |
| --- | --- | --- | --- | --- |
| `YACHATDAC-Homepage-Copy-v1.pdf` | Homepage | 📥 draft uploaded | open | Acknowledgement names the wrong jurisdiction — note 1 |
| `YACHATDAC-Wonder-Copy-v1.pdf` | Wonder | 📥 draft uploaded | open | Story wall dating — note 2 |
| `YACHATDAC-LivingWork-Copy-v1.pdf` | Living Work | 📥 draft uploaded | shared with care | Practitioner-audience "what we got wrong" section — note 3 |
| `YACHATDAC-Truth-Timeline-v1.pdf` | Truth | 📥 draft uploaded | **held by community** | **Suzanne Thompson's approval — stated on the document itself** |
| `YACHATDAC-Sitemap-v1.png` | Site-wide | 📥 draft uploaded | open | Diverges from the build documentation IA — note 6 |
| `YACHATDAC-About-Copy-v1.md` | About | 📥 draft uploaded | open | Legal-name spelling — note 10; two undefined routes — note 9 |
| `YACHATDAC-Resources-Copy-v1.md` | Resources / The Record | 📥 draft uploaded | **shared with care** | Taxonomy does not match the code — note 8; supersedes the Truth tail — note 7 |

The first five were uploaded 19 Aug 2026; About and The Record on 21 Aug 2026.
Nothing here is approved; nothing here has been built from.

### Why The Record is `shared with care`

It is the only one of the seven that is not plainly `open`. It carries Iningai
knowledge entries — Wattanuri and the Seven Sisters, the buyback story, the bush
foods calendar — and it defines an *"items marked on request"* gate that routes
cultural material to the **Elder Advisory Group** for release. That gate is a
governance mechanism appearing in public copy for the first time, so this
document needs the second approval gate, not only editorial sign-off.

### A note on the two markdown drafts

Both arrived as Google Docs exports with their images inlined as base64 — 2.3MB
and 23MB respectively. The images have been split out into `assets/` beside each
draft and the link definitions rewritten; the prose is byte-identical to what was
delivered, and now diffs. The extracted PNGs still total **18.6MB** — see note 11
before this is committed.

About is filed in a new `drafts/about/` folder. **That is filing, not an IA
decision.** It reflects the shape of the document, which is a standalone page
with its own contact band. It does not resolve **D2**, and the document itself
still links out to `/connect` in three places.

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

### 2. Story wall dating is inconsistent across drafts

| Draft | Claim |
| --- | --- |
| Homepage | "at least 55,000 years old, by the most conservative estimate" |
| Wonder | "marked at least 55,000 years ago" |
| Truth timeline | "AT LEAST 5,000 YEARS AGO — the engraving starts" (carries its own "dating under review" note) |

A factor-of-ten difference in a public claim about cultural heritage, on a page
whose argument is that the record has been got wrong before. Needs one number,
sourced, used everywhere. The Truth timeline already flags it, so this is
tracking it rather than discovering it.

### 3. "The parts that are not in the annual report"

The Living Work draft carries its own decision note: the failure section is
written for practitioners, who find failures more useful than successes, and may
sit badly with a government funder reading the same page. The draft says it can
be cut in one move.

Worth a deliberate answer rather than a default — the pillar's stated audience
is other Indigenous communities, not funders, and the section is the most
useful thing on the page for that reader.

### 4. Fee-for-service land management

Still has no home in the sitemap. The Living Work draft notes it sits at Year 4
in the Ten-Year Strategic Plan and leaves it off for now. That is a reasonable
holding position, not a resolution — see `docs/open-questions.md` item 8.

### 5. Truth page structure is a reverse chronology

The Truth draft is a scroll from *ahead* → *today* → back to *before people*,
with lore framed as the floor underneath rather than the oldest entry. That is a
stronger structure than the section outline currently in
`src/content/page-specs.ts`, which lists Truth as a conventional stack of
sections. Reconcile the two once the draft is approved.

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

## Notes from the About and The Record drafts (21 Aug 2026)

Same rule as above: none of these block uploading. They block publishing — and
notes 8 and 11 want an answer before other people build on them.

### 7. The Record supersedes the Truth page tail

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
| The browsable record | **Everything in the record** — filter bar plus 12 written entries |
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

Raised as **D14**. Nothing in `src/` has been changed. Note that if D14 lands as
proposed, `/truth#researched` and `/truth#opportunities` in `src/content/site.ts`
retarget to `/resources` — which changes the primary navigation, so it is not a
page-local edit.

### 8. The Record's taxonomy does not match the content model in code

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
David's content model rather than a copy question. Raised as **D15**.

### 9. Two routes are referenced that do not exist

- The Record draft links `/partnerships/#research-opportunities`. There is no
  partnerships page in `src/content/site.ts` or in the build documentation, and
  §4 places research opportunities on Truth. Raised as **D16** — and it is the
  same question as D14 seen from the other end.
- The About draft links `/our-people`. Build documentation §4 has *The YACHATDAC
  Team* and *About Suzanne Thompson* as separate items under Connect, not a
  combined people page. Raised as **D17**.

Both drafts' internal links carry a `docs.google.com/` host prefix throughout.
That is an export artefact; the path after the host is the intent.

### 10. "Yambangku or Yumbangku"

The About draft flags on its own face that *the logo and the published research
differ* on the spelling of the organisation's own name, and asks for it to be
confirmed.

`src/content/site.ts` asserts **Yambangku** in `org.legalName`, and that string
renders in the footer and in page metadata on **every route**. ICN and ABN are
also still blank in the draft. Raised as **R13** — cheap to settle now, and the
kind of error that gets quoted back at an organisation whose own argument is
about having been recorded wrongly.

### 11. 18.6MB of draft reference images

The 12 images extracted from the two drafts are photographs saved as PNG at
roughly 900×600 — a lossless format doing a lossy format's job. They total
**18.6MB**, and they are reference thumbnails inside a copy draft, not production
media. Production media goes through the CMS library, which `.gitignore` already
keeps out of the repo.

Re-encoded as JPEG they would land near 1.5MB with no visible difference at that
size. The same reasoning as **F5** applies: it is far easier to keep weight out of
a repository than to remove it from history afterwards. Worth settling before
this is committed.

### 12. "Ngapartji-Ngapartji is Western Desert language, not Iningai"

The About draft raises this itself, against the Strategic Plan's own framing of
reciprocity, and asks to confirm it with Suzanne.

`src/content/truth.ts` currently *recommends* framing the Truth enquiry form with
that principle. On the one page whose argument is that the record was got wrong
about these people, borrowing another nation's language for the reciprocity ask
is the error the page indicts. The client's own plan uses the term, so this is a
question for Suzanne rather than a correction to make unilaterally. Raised as
**R14**.
