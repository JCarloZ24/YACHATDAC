---
name: yachatdac-typography
description: The YACHATDAC type system — which of the three licensed families every piece of text is set in, and the Figma→code repoint that means a built page never matches the frame's letterforms. Use whenever building or reviewing a hi-fi page, translating a Figma frame into markup, choosing a font utility, or when a page "looks wrong" typographically. Consult BEFORE writing markup for a section, not after.
---

# YACHATDAC typography

Three licensed families, and nothing else. Every piece of text on the site
resolves to one of them through a utility class — never through a raw
`font-family`, and never through a family name copied out of Figma.

## The three families

| Utility | Family | Token | Used for |
| --- | --- | --- | --- |
| `.headline` | Block Berthold | `--font-headline` | Display headings, page titles, big figures, names set large |
| `.eyebrow` | Bantayog Sans ExtraBold | `--font-eyebrow` | Eyebrows, micro-labels, roles, badges, CTA labels, status pills |
| *(none)* | Work Sans | `--font-body` | Everything else — body copy, ledes, captions, standfirsts |
| `.callout` | GoodDog Plain | `--font-callout` | Callouts only. Never body, never a long headline. |

Body is the **default on `<body>`**, so body copy takes no class. That is why an
element with no font utility is correct and not an oversight — but only if it is
actually body copy.

Declarations live in `src/app/fonts.css`; the tokens are aliased onto the
Tailwind theme in `src/app/globals.css`. All faces are self-hosted woff2 in
`public/fonts/`. Block Berthold additionally comes from an Adobe Fonts kit
(`qqn2php`) linked in `src/app/layout.tsx` — the kit face is first in the stack
and the self-hosted copy is the outage fallback.

## ⚠ THE REPOINT — read this before comparing a build to a frame

**The Figma file draws in two faces the site does not ship.** This is a
decision, not a drift, and it is why a correctly built page will never match the
frame on letterforms:

| Figma draws | The build ships | Recorded in |
| --- | --- | --- |
| **Archivo** ExtraBold | **Bantayog Sans** ExtraBold (`.eyebrow`) | `src/app/fonts.css`, on the 800 face |
| **Baloo 2** ExtraBold | **Block Berthold** (`.headline`) | `src/app/the-record/_components/Sections.tsx` |
| Block Berthold | Block Berthold | — |
| Work Sans | Work Sans | — |

So when `get_design_context` returns `font-['Archivo:ExtraBold']`, the answer is
`.eyebrow`. When it returns `font-['Baloo_2:ExtraBold']`, the answer is
`.headline`. **Never** add Archivo or Baloo 2 to the project, and never
hand-write those family names into markup.

A frame and a build are expected to agree on **size, colour, weight and
position**, and to disagree on letterforms. If someone reports the fonts "look
wrong", check that first — it is usually this, correctly implemented.

## Translating a frame

1. Read the Figma face from `get_design_context`.
2. Map it through the repoint table above to a utility.
3. Take the **size, leading and tracking from the frame**, explicitly. Figma
   sets leading as a px value or a ratio; Tailwind's defaults will not match it.
   Write `leading-[1.5]` rather than trusting `leading-relaxed` — The Record
   documents a case where a missing 4px of eyebrow leading pushed a whole hero
   stack off its y.
4. Sizes that already exist as tokens should use them: `text-display` (96),
   `text-eyebrow-hero` (32), `text-lead` (24), `text-scroll` (32),
   `text-beat` (44). These match the Figma text styles by number.

## The size scale — `YACHATDAC Type` variables, V2 Figma

**The V2 Figma variable collection is the source of truth for these numbers.**
Audited 7 Sep 2026 from `YACHATDAC Type` (18 variables, three groups).

| Figma variable | Desktop | Mobile | Family / utility |
| --- | --- | --- | --- |
| `Type/Desktop/Heading 1` | 56 | 40 | Block Berthold — `.headline` |
| `Type/Desktop/Heading 2` | 48 | 36 | Block Berthold — `.headline` |
| `Type/Desktop/Heading 3` | 40 | 32 | Block Berthold — `.headline` |
| `Type/Desktop/Heading 4` | 32 | 24 | Bantayog Sans ExtraBold **Alt** |
| `Type/Desktop/Heading 5` | 24 | 20 | Bantayog Sans ExtraBold **Alt** |
| `Type/Desktop/Heading 6` | 20 | 18 | Bantayog Sans ExtraBold **Alt** |
| `Type/Text/X-Large` | 20 | — | Work Sans (default) |
| `Type/Text/Large` | 18 | — | Work Sans (default) |
| `Type/Text/Medium` | 16 | — | Work Sans (default) |
| `Type/Text/Small` | 14 | — | Work Sans (default) |
| `Type/Text/X-Small` | 12 | — | Work Sans (default) |
| `Type/Tagline` | 16 | — | Good Dog — `.callout` |

The headline face **stops at H3** — H4–H6 are Bantayog Sans ExtraBold Alt, not
Block Berthold. Audited in V2 on 29 Aug 2026; see `docs/brand.md`.

### The shipped scale — migrated, but not everywhere

**Corrected 8 Sep 2026.** This section previously said the code still carried
`--text-display` (96) and `--text-beat` (44) and that nothing resolved to
56/48/40. `6bd7b2b` landed thirteen minutes after that was written and made it
false. Both tokens are **deleted**; `text-h1`…`text-h6` are live in
`globals.css` with the mobile values as defaults and the desktop column in a
single `@media (min-width: 64rem)`.

⚠ **Three scales are in the tree, and you must know which page you are in:**

| Where | Scale |
| --- | --- |
| The Record, Truth, Living Work, and the shared components (`PageHero`, `Hero`, `TruthHero`, `BeatSection`, `beats`, `InvitationV2`, `WayForwardV2`) | `text-h1`…`text-h6` |
| **Wonder** | frame-literal, via local `H1`/`H2`/`H3` constants — `text-[56px] lg:text-[96px]` and so on |
| Anything else | hand-built `text-4xl sm:text-5xl` ladders |

So **a token is still not automatically the answer** — check what the page you
are editing already uses, and do not half-migrate a page. Reconciling Wonder
against the tokens is an open question for August and Marc; see
`docs/design/living-work-qa-2026-09-08.md` §4.

Two faces this scale needs that are not shipped:

- **Bantayog Sans ExtraBold Alt** for H4–H6. `fonts.css` declares roman cuts
  only. `BantayogSans-ExtraBoldAlt.woff2` exists in the supplied font drop.
  Until it is declared, H4–H6 render in plain ExtraBold — close, but not the
  drawn letterforms.
- **Good Dog** for the Tagline. `brand.md` reads the V2 Tagline style as GoodDog
  **Cool**; the table at the top of this file says Plain. Unresolved, and
  neither binary is in `public/fonts/` — settle it before either is wired up.

## Rules

- **A font utility is never conditional or interpolated.** `.headline` and
  `.eyebrow` are literal strings in the class list. Tailwind cannot see
  `` `${x}` `` and the utility silently vanishes.
- **Never set `font-family` inline or in a component.** If a design seems to
  need a fourth face, it is wrong, or it is a decision for Marc and Ivy — not
  something to solve in a section file.
- **Testimony is never set in the callout face**, and never split by character.
  See `docs/motion/motion-grammar.md`.
- **`.eyebrow` is uppercase already** (`text-transform: uppercase`). Write the
  label in sentence case in the markup and let the utility case it, so the copy
  stays readable in the source and in the content module.
- **`.headline` carries its own `line-height: 1.05` and `-0.015em` tracking.**
  Override with an explicit `leading-[…]` when the frame says otherwise; do not
  add tracking on top without a reason from the frame.
- **`font-synthesis-weight: none` is set globally.** A weight with no real face
  will NOT be faked — it falls back to the nearest installed one. Bantayog Sans
  ships 400/500/600/700/800/900 romans and **no italics**. Block Berthold ships
  a single face mapped across 100–900.

## Checking a page

```
node scripts/check-type.mjs                 # whole app
node scripts/check-type.mjs src/app/our-people
```

It flags any sized text element that carries no font utility and looks like a
heading, plus any Archivo/Baloo 2 leakage and any inline `font-family`. It is a
lint, not a judge — body copy legitimately has no utility, so read what it says
rather than driving it to zero.

## Where the decisions live

- `src/app/fonts.css` — the faces, the licensing, and the repoint note
- `src/app/globals.css` — the `@utility` blocks and the type scale
- `public/fonts/README.md` — licence keys
- `docs/decisions-and-risks.md` — D-numbers for anything contested
