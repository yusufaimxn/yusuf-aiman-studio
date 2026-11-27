---
name: scene-builder
description: Build HyperFrames scene compositions for a Yusuf Aiman episode from its breakdown.json, using brand tokens, scene components and character assets. Use after the episode is planned.
---

# Scene builder

Read the `hyperframes` skill first and follow its contract. Run the CLI only as `scripts/hf <command>` from the episode folder.

## Steps
1. One composition per scene in `episodes/<slug>/compositions/<scene-id>.html`; one host per scene in `index.html` with matching ids, `data-start`/`data-duration` from `breakdown.json`. Set the root `data-duration` to `total_duration_s`.
2. Reuse `scenes/` components and `brand/` tokens before writing anything new. If you write a reusable piece, move it into `scenes/`.
3. Local only: GSAP from `assets/vendor/gsap.min.js`, fonts via `@font-face` to `assets/fonts/`. No CDN or network URLs.
4. Characters: use only files from `characters/<name>/{expressions,poses,outfits}`. If the needed file does not exist, use a clearly labelled placeholder and keep its `status: placeholder` in the breakdown. Do not animate a mouth on a static image unless mouth-shape assets exist.
5. Diagrams: hand-written SVG or Mermaid (`npx mmdc -i x.mmd -o assets/images/x.svg`), animated with GSAP (draw strokes, reveal nodes, move packets).
6. Keep text inside the 80% title-safe area; captions in the lower band.
7. `scripts/hf check --json` → fix all errors; then `scripts/hf snapshot` and look at the midpoint of every scene.
