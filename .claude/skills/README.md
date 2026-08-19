# Project skills

Skills scoped to this repo. Claude Code picks them up automatically from
`.claude/skills/<name>/SKILL.md`.

| Skill | Covers |
| --- | --- |
| `yachatdac-motion` | Scroll animation, motion and 3D. Cultural, accessibility and performance rules; the sketch library; the permissions status board; GSAP templates and the shared token set. |

## Reading `yachatdac-motion` is not optional

It is consulted **before** writing any animation code, not after. Several of
its rules are cultural rather than technical, and getting them wrong is not a
style bug. In particular:

- No animation of cultural-site imagery, in any form.
- No generated Aboriginal iconography in code — artwork comes from the artist.
- No heritage coordinates in map layers, markup, comments or source.

`references/permissions.md` is a live status board. Two open entries currently
affect real work (artwork motion, and land/terrain detail), and story-wall
imagery is unresolved — the homepage Truth beat is built typographically for
that reason.

## Where the skill touches the codebase

| Skill file | Ported / applied at |
| --- | --- |
| `assets/motion-tokens.css` | `src/app/motion-tokens.css` — palette aliased onto the Tailwind theme so hexes live in one place |
| `assets/motion-controller.js` | `src/lib/motion-controller.ts` |
| X4 entry stagger, X6 reduced-motion twin | `src/lib/motion.ts`, `src/components/ui/Reveal.tsx` |
| C1 continuous line (on hold → cleared plain-rule alternative) | `src/components/ui/ThreadLine.tsx` |
| X5 legibility scrim, X2 scroll cue | `src/components/sections/Hero.tsx` |
