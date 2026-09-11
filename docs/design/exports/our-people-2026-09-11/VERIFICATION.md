# Our People — canvas verification

*Last updated: 11 September 2026*

Built against the existing `/our-people` page, following the homepage's single
Three.js stage. All ten sections share one renderer, one orthographic camera
and one ScrollTrigger. The original HTML remains the selectable, accessible
text layer. The shared footer follows outside the stage.

The [individual Figma captures](README.md) are reference assets only. The
renderer uses the page's existing optimised photographs and its token-resolved
solid colours; the headline mask uses the actual loaded brand font. No Figma
screenshot is shipped as a page texture.

| Check | Result |
| --- | --- |
| Existing words and destinations | Before/after `main.textContent` identical: 4,632 characters. All four contact link labels and destinations identical. Content modules and drafts untouched. |
| Desktop and mobile | Chromium at 1440 × 900, 375 × 812 and 390 × 812. One canvas and one pin. No horizontal document overflow on mobile. |
| Connected journey | Hero, Suzanne, decision, team, governance, acknowledgements and contact inspected. Reverse scrolling returns to the same hero composition. |
| Testimony in stillness | Across 720px of the desktop reading span, the quotation stayed at 270px from the viewport top while its final word changed from 0.28 to 1 opacity. |
| Keyboard and responsive rebuild | Focus remains on the contact link across desktop/mobile resizing. Tab advances to the next destination and brings that card fully into the native horizontal rail. |
| Contact anchor | Hard loading `/our-people#contact` seeks the shared clock; the contact section is visible on mobile. |
| Reduced motion and Escape | Full ordinary document, no pin, original photographs and headline restored. Live reduced-motion changes also tested. |
| JavaScript disabled / WebGL unavailable | All ten original sections remain in ordinary flow. The canvas is hidden. |
| WebGL context loss | Falls back to the document; context restoration builds exactly one canvas stage again. |
| Print | Print media restores normal flow, section backgrounds, photographs and headline. No pin remains. |
| Footer and route cleanup | Footer is outside the stage. Its position survives a resize. Navigating to Privacy removes the canvas and pin; going back creates one of each. |

The renderer paints with the timeline's update and on asset/viewport changes;
it has no independent animation loop. Pixel ratio is capped at 1.5 and portrait
frames move around held image pixels. Measurements happen during setup and
rebuild, not during the scroll render. See the Our People rows in
`docs/motion/motion-grammar.md` for the effect vocabulary and timing.

These are Chromium viewport checks, not a physical-device performance profile.

Final checks passed: `npm run typecheck`, `npm run lint`, `npm run check:type`
(165 files, zero errors or warnings), `npm run build` (all 44 pages), and
`git diff --check`. The final resize pass produced no WebGL warnings.

Implementation captures, from the local build at `localhost:3001`:

- [Desktop — photo-filled title](qa-desktop-hero.png)
- [Desktop — the gathering](qa-desktop-team.png)
- [Mobile — keyboard focus in the contact rail](qa-mobile-contact.png)
