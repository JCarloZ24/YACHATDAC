# Brand implementation notes

*Last updated: 19 August 2026*

How the approved brand identity is wired into this codebase. The client's
"Artwork Creative Brief" is the source of truth; this file records where each
piece lives in code. Colour, typography and logo have all been approved by the
client.

## Colour

Every colour is tied to a real element of Country. **Keep the name/meaning
pairing** — do not flatten these to `primary` / `secondary` / `accent`.

| Token | Name | Meaning | Hex |
| --- | --- | --- | --- |
| `ochre` | Yellow Ochre | Morning Light | `#D69828` |
| `burnt` | Burnt Ochre | Country | `#CB7722` |
| `turquoise` | Turquoise Blue | Water & Sky | `#32B0AE` |
| `eucalyptus` | Eucalyptus Green | Vegetation | `#5E7930` |
| `oxide` | Oxide Red | The Land | `#AF231C` |
| `roasted` | Roasted Brown | Earth | `#4E3524` |
| `evergreen` | Deep Evergreen | Living Country | `#22372B` |
| `canvas` | Off-White | Natural Canvas | `#F6F6EC` |
| `midnight` | Midnight Navy | Night Sky | `#122449` |
| `charcoal` | Charcoal Black | Fire & Story | `#090E12` |

Declared once, in the `@theme` block of `src/app/globals.css`. The motion
skill's `--y-*` names are aliased onto those tokens in
`src/app/motion-tokens.css`, so a hex value is written down in exactly one
place.

**Solid colours, not gradients** — agreed in the 18 Aug briefing. The one
exception is the legibility scrim between media and copy (X5), which is a
readability requirement rather than decoration.

Contrast still needs verifying at AA for accent-on-dark combinations,
especially Eucalyptus Green and Turquoise Blue on Deep Evergreen.

## Typography

| Role | Family | Utility |
| --- | --- | --- |
| Headline | Block Berthold | `.headline` |
| Subheadline / eyebrow | Bantayog Sans | `.eyebrow` |
| Body | Work Sans | default on `body` |
| Callouts | Good Dog Cool | `.callout` — sparingly, never body or long headlines |

Motiva is scrapped and does not get reintroduced.

All three are **installed and self-hosted** as woff2 in `public/fonts`, with
the above-the-fold faces preloaded in the root layout. Good Dog Cool has not
been supplied; its `@font-face` slot is reserved so the file can be dropped in
without a code change.

⚠ **Licences are not settled.** Block Berthold ships an Adobe / H. Berthold AG
copyright — a commercial retail face, and a desktop licence does not cover
serving it over the web. Bantayog Sans arrived with no licence file at all. Only
Work Sans (SIL OFL 1.1) is unambiguous. Both unresolved families are gitignored
and come from the Proyekto resources section. Details in
`public/fonts/README.md`; this is a compliance question, not a preference.

Splitting text for animation is by **line or word, never by character** —
character splits break screen readers and read as a gimmick against this brand.

## Logo

A real logo exists and must not be recreated in code. See
`public/brand/README.md`.

## Artwork system

Commissioned separately from the logo, placeholder-first, not blocking launch.
See `public/brand/README.md`, and read the motion skill's permissions board
before doing anything with it — motion permission for artwork is not recorded.

## Voice

Brand attributes: grounded, honest, organic, human, respectful, awakened.

In motion terms that means things settle and never rebound, loaders report real
progress, layers move at uneven rates, the visitor sets the pace, motion
finishes before reading starts, and surprise is rationed. Overshoot and elastic
easing are banned — they read playful.

Truth-telling sections should move **less** than the rest of the site, not more.
