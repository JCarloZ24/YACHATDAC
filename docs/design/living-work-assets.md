# Living Work — photography, gathered and landed 2026-08-31

18 frames from `Downloads/Living Work Assets` transcoded into `public/media/library/`
(WebP, 2000px, q82 — filenames kept exactly as gathered, `livingwork-*.webp`), registered
in `src/content/kit.ts` under `lw-*` ids with grades assigned by looking at every frame,
and bound in `src/app/living-work/_components/Sections.tsx`. `public/media/` stays gitignored;
this file is the record a fresh clone can rebuild from.

## Bindings

| Slot | Photo | Grade |
|---|---|---|
| §01 hero | `lw-hero` — the hi-fi's 1.40.2, an Iningai woman standing in the country being brought back | **frame** (portrait — the plane holds) |
| §02 aperture plain | `lw-plain` (`livingwork-thenumbers.webp`) | full |
| §03 silent landscape | `lw-escarpment-sunset` (`livingwork-ourchallenges.webp`) | frame (escarpment country) |
| §04 rangers ground | `lw-rangers3` — nursery silhouette | full |
| §05 the spring | `lw-spring-dry` — emus in dry mulga; **still the stand-in by design**, the restored waterhole holding water has never been photographed | full |
| §06 stream 01 anchor | `lw-fire` — cool burn | full |
| §06 stream 03 anchor | `lw-seed-collect` | full |
| §06 stream 06 anchor | `lw-yumba-sign` (portrait format) | full |
| §07b BREATH | `lw-seedhead` — the hi-fi's 1.65.1, a hand and a seed head (gathered as `livingwork-infrastracture.webp`) | full |

Every bound wrapper now stamps `data-motion` with its grade so grade-aware motion
modules can hold a `frame` image plane still while the world moves.

## §04 ranger strip and §09 — bound in the hi-fi build pass (31 Aug, later the same day)

The hi-fi §04 drag strip now binds `lw-rangers1/5/3/4`, `lw-seed-collect` and
`lw-rangers2` with the design's own captions; the seventh slot (1.82.1, at the
escarpment) renders a held placeholder. **`lw-rangers2` and `lw-rangers5` show visiting
children** — they ship because the hi-fi ships them, behind the section's own gold
consent warning; the consent question itself is still open. `lw-sunset-grass` opens §09.
Spare frames still unbound: `lw-seed-sort`, `lw-seed-grind`, `lw-seed-grind-2`,
`lw-regrowth-dusk`.

## Still missing

- A photograph of the spring holding water (§05's real frame).
- Fencing and monitoring frames — the correction pass wanted streams 01/**04**/**07**
  as anchors; photography exists for 01/03/06, so those bleed instead for now.
- GoodDog `.woff2` in `public/fonts/` (licence file is there, font is not).
- Homepage `hero-country-day.png` / `hero-country-night.png` (not Living Work, still absent).
