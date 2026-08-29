# Hi-fi Figma readout — Homepage + Footer

Read 2026-08-20 from Marc's hi-fi frames, copied out of the team file
`EgXBAnO5vgQPVXYt9PrwGG` into `Qk35pAX0sz2ntNRXceY7Gb` (*Yachatdac Exploration*) because the team
file's Figma MCP quota is exhausted on the Starter plan.

Frames read: Homepage `17:875` (1440×7159), Footer `17:3421` (1440×2101).

This records what the **built design** does, as distinct from what the copy drafts say. Several
items in `docs/content/STATUS.md` are tracked there as copy problems; this confirms which of them
are already built into Figma, which is a different and worse state.

---

## 1 · The wrong-jurisdiction Acknowledgement is already built

`STATUS.md` note 1 flags the Northern Territory error in the **homepage copy draft**. It is also
already **built into the hi-fi Figma footer**, node `17:3700`:

> ACKNOWLEDGEMENT OF COUNTRY — *We respectfully acknowledge and honour the Aboriginal people of the
> Northern Territory and recognise the continuation of culture, connection to lands, water and
> country.*

That matters because the footer is a single shared component intended for every page. Fixing the
copy draft alone does not fix this; the Figma component has to be corrected too, or the error
propagates to all five routes via `src/components/layout/SiteFooter.tsx`.

**Do not reuse the hi-fi footer as-is.** Empty the Acknowledgement slot and annotate it pending
Suzanne's wording (open decision 3 — a genuine Welcome to Country is possible here).

---

## 2 · The hi-fi has a persistent navbar; the homepage copy draft says it should not

`17:877` is a `Navbar / 1 /` frame at y=0, above the hero, carrying WONDER · TRUTH · LIVING WORK ·
CONNECT.

The homepage copy draft specifies no navigation until block 6 (The Invitation) — blocks 1–5 are
pure immersion and the three invitation cards are the first navigation choice offered.

Unresolved, and a genuine design decision rather than an error. Flagged for the team.

---

## 3 · Block mapping — hi-fi and copy draft reconcile at 7 blocks

| # | Node | y | Eyebrow | Headline |
|---|---|---|---|---|
| 1 | `17:920` | 124 | WELCOME TO COUNTRY | Reconnection across time, across people. |
| 2 | `17:931` | 1024 | 01 — WONDER · GUESTING ON COUNTRY | The oldest sunrise you will ever stand under. |
| 3 | `17:1135` | 1924 | 02 — TRUTH · RESEARCH & DISCOVERY | What is etched in stone does not forget. |
| 4 | `17:1033` | 2888 | 03 — BELONGING | Everyone has a place to find their way back to. |
| 5 | `17:1237` | 3788 | 04 — LIVING WORK · CARING FOR COUNTRY | Caring for Country, in practice. |
| 6 | `17:1902` | 4688 | THE INVITATION, THEN THE WAY FORWARD | Every journey begins differently. |
| 7 | in footer | — | (Acknowledgement + newsletter) | — |

The child array order does **not** match visual order — beats 3 and 4 are transposed in the layer
list. Sort by `y`.

---

## 4 · Unreplaced placeholder copy in the hi-fi

None of these are in the copy drafts; the drafts are correct. These are Figma-side defects.

| Node | Defect |
|---|---|
| Beat 4 `17:1033` | Headline and body are the **same sentence**. The body was never written. |
| Invitation card 1 | Title duplicates the section headline. Should be **Wonder**, per copy draft line 35 and resolved decision **D5**. Not *Experience Country* — that is build documentation §2, which D5 explicitly supersedes. |
| Invitation card 2 | Body duplicates card 1's text. Should describe research partnership. |
| Invitation card 3 | CTA reads `EXPLORE EXPERIENCES`; should be **SEE THE WORK**. |
| Navbar | Relume placeholders `Link Four` … `Link Seven`, set in Roboto. |
| Footer nav | Three `Link One` placeholders; "Open **Search** Opportunities" is a typo for *Research*. |
| Footer newsletter | Relume default copy — "stay up to date on features and releases", and the grammar error "you agree to with our Privacy Policy". Not YACHATDAC voice. |

---

## 5 · The built type scale is not the documented one

| Role | Face / style | Size |
|---|---|---|
| Hero headline | Block Berthold Regular | **96** |
| Section headline | Block Berthold Regular | **64** (×5) |
| Card title | Block Berthold Regular | **32** |
| Hero eyebrow | Bantayog Sans Extrabold | 32 |
| Section eyebrow | Bantayog Sans Extrabold | 24 |
| Nav / CTA / footer heads | Bantayog Sans Extrabold / Bold | 16 |
| Lead body | Work Sans Medium | 24 |
| Card body | Work Sans Medium | 16 |
| Footer links | Work Sans Regular | 14 |
| Acknowledgement | Work Sans Regular | 20 |
| Scroll cue | GoodDog Plain Regular | 32 |

The Figma Typography board documents a 56 / 48 / 40 / 32 / 24 / 20 desktop ramp. **The values 56,
48 and 40 appear nowhere in the built design.** The working scale is **96 / 64 / 32**.

Anything built to the documented ramp will not match the homepage. Reconcile the ramp against the
built design, not the other way round.

**Font leakage:** `Roboto` in the navbar and footer newsletter (Relume leftovers). `Bantayog Sans
DEMO` — the trial cut — throughout, rather than the licensed family.

---

## 6 · Layout values, confirmed in the built design

| Value | px | Where |
|---|---|---|
| Page padding (horizontal) | 64 | Every section, navbar, footer |
| Section padding (vertical) | 112 | Invitation block `17:1902` |
| Gap | 80 | Invitation, footer, Acknowledgement blocks |

Narrative beats are a fixed **900px** band each — near-viewport, not content-driven. Hero is 1024.

---

## 7 · Imagery — slot ratios

| Slot | Size | Ratio |
|---|---|---|
| Hero background | 1539×1024 | 1.50, **overscanned** ~99px beyond the frame |
| Narrative beat background | 1440×900 | 1.60 — full-bleed, edge to edge |
| Invitation card | 395×500 | 0.79 (4:5 portrait) |

**Every narrative beat is a full-bleed photographic band with text laid over it.** This is already
the "static foreground, moving background" direction recorded in `docs/design/README.md` — the
wireframes should express it, not invent an alternative.

The footer carries two large organic `Vector` shapes (`17:3423` `#cb7722`, `17:3424` `#090e12`)
forming a curved top edge. These are placeholders for the commissioned artwork, not final design.

---

## 8 · Palette — the built design mixes both disputed sets

| Hex | Source |
|---|---|
| `#fbae3d` | Figma board — Yellow Gold. Dominant accent. |
| `#d97804` | Figma board — Burnt Ochre |
| `#cb7722` | **Branding guide PDF** — Burnt Ochre. The large footer curve. |
| `#32b0ae` | **Branding guide PDF** — Turquoise Blue |
| `#f6f6ec` | Off-White — body text on dark |
| `#090e12` | Charcoal Black — second footer curve |
| `#f9b24c` `#d57907` `#98470d` `#31afe3` `#fefefe` | **In neither palette** |

The two palettes were assumed to be an either/or choice. The built design uses **both**, plus five
undocumented values.

> ✅ **CLOSED, 29 August 2026.** Ivy settled this: the **client-approved Artwork Creative Brief set
> wins**. The paint styles in YACHATDAC-V2 were corrected in place — `Rust Red → Oxide Red #af231c`,
> `Sky Blue → Turquoise Blue #32b0ae`, `Olive Grove → Eucalyptus Green #5e7930`, Burnt Ochre
> `#d97804 → #cb7722`, Off-White `#fcf7f0 → #f6f6ec` — and `Colour/Yellow Ochre #d69828` was added.
> `Warm/Yellow Gold #fbae3d` stays as the hero scroll-cue accent; it is not a drift of Yellow Ochre.
> Editing the styles in place carried every bound node with them. **Do not reopen this as a
> question.**

Caveat: raw fill counts are inflated by the logo artwork's many vector paths. Treat this as
presence/absence evidence, not weighting.

---

## 9 · Constraint — the Figma MCP sandbox cannot load locally-installed fonts

Verified by control test: `figma.loadFontAsync({family:'Arial'})` fails with *"The font family
Arial does not exist"*. Arial is installed. The sandbox enumerates ~1,938 families — Figma's hosted
Google Fonts library only.

| Face | Loadable via MCP? | Why |
|---|---|---|
| Work Sans | ✅ | Google Font, hosted by Figma |
| Inter | ✅ | Hosted |
| Block Berthold | ❌ | Local install only |
| Bantayog Sans | ❌ | Local install only |
| GoodDog Plain | ❌ | Local install only |

This is not fixable by installing fonts differently — per-user and system-wide installs are both
invisible to the sandbox.

**Workaround in place.** Thirteen text styles were created in `Qk35pAX0sz2ntNRXceY7Gb` using Work
Sans as a stand-in, sized and tracked to the built design above. Each placeholder style carries its
target face in the style description. Changing the family on **seven** styles in the Figma UI
repoints every bound node at once:

| Style | Change family to |
|---|---|
| `Display/96`, `Heading/64`, `Card Title/32` | Block Berthold Regular |
| `Eyebrow/Hero-32`, `Eyebrow/Section-24`, `Nav & CTA/16`, `Nav & CTA/16 Bold` | Bantayog Sans ExtraBold / Bold |
| `Accent/Scroll-32` | GoodDog Plain Regular |

`Body/*` and `Link/*` are already correct — Work Sans is the real brand body face.

---

## 10 · Font availability on Ivy's machine, 2026-08-20

All four brand faces are installed per-user and correctly registered in
`HKCU\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Fonts`:

- **Block Berthold** Regular — `blockberthold.otf`
- **Bantayog Sans** 21 styles, plus SC and Baybayin variants — 49 files
- **Work Sans** 18 static styles
- **GoodDog Plain** *and* **GoodDog Cool** — `GOODDP_.TTF`, `GOODDC_.TTF`

GoodDog was previously recorded as unobtainable. That is no longer true. The design uses **Plain**;
the build documentation calls for **Good Dog Cool**. Both are now present — the team still needs to
say which is correct.

**Licence provenance is unresolved for Block Berthold** (`public/fonts/BlockBerthold-COPYRIGHT.txt`
carries an all-rights-reserved Berthold/Adobe notice with no licence grant), for Bantayog Sans, and
now for GoodDog. Only Work Sans has an OFL.
