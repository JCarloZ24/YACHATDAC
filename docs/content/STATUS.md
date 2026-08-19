# Content status board

One row per document. Update it in the same commit that moves a file between
folders.

**Circle** is the internal governance tag (build documentation §12) — `open`,
`shared with care`, or `held by community`. It is never shown to visitors, but
it decides who has to sign off.

## Documents

| Document | Page | State | Circle | Blocked on |
| --- | --- | --- | --- | --- |
| `YACHATDAC-Homepage-Copy` | Homepage | ⏳ awaiting upload | open | — |
| `YACHATDAC-Wonder-Copy` | Wonder | ⏳ awaiting upload | open | — |
| `YACHATDAC-LivingWork-Copy` | Living Work | ⏳ awaiting upload | shared with care | Practitioner-audience "what we got wrong" section — see note 3 |
| `YACHATDAC-Truth-Timeline` | Truth | ⏳ awaiting upload | **held by community** | **Suzanne Thompson's approval — stated on the document itself** |
| `YACHATDAC-Sitemap` | Site-wide | ⏳ awaiting upload | open | — |

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
