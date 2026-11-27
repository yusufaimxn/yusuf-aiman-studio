# Yusuf Aiman AI Video Studio — permanent project rules

This repo turns a topic or script into a finished educational video featuring Yusuf Aiman (host) and Aiman (sidekick). Brand line: "Technology, Made Understandable."

## Non-negotiables
1. **Characters are locked.** Never change Yusuf's or Aiman's appearance from `characters/<name>/spec.md` without explicit owner approval. Never swap their traits (goatee + watch = Yusuf; glasses + headphones = Aiman).
2. **No pretend assets.** A flat reference image is not a rigged character. Static images cannot lip-sync. Placeholders are allowed in previews only and must be listed as placeholders in the episode's production report.
3. **No fabricated explanations.** Technical content must be accurate; when unsure, flag it in the report instead of inventing.
4. **Preserve supplied voiceover.** Never re-time, pitch-shift or replace a supplied recording; only trim silence, normalise loudness and mix.
5. **QC is real.** Never claim a check passed without running it on the actual output (`check`, ffprobe, decoded frames you looked at).
6. **Every scene has a purpose** stated in `breakdown.json` (hook, setup, explain, example, takeaway, outro) and supports the narrative.
7. **Secrets** live in environment variables or an untracked `.env`; never commit keys, voice samples or personal data.

## Stack
- Compositor and renderer: **HyperFrames 0.9.97** (HTML + GSAP → MP4). Always run it as `scripts/hf <command>` (pins the CLI, telemetry off). Read the `hyperframes` skill before writing compositions and follow its contract.
- 3D: **Blender 5.3 as Python module** (`.venv/bin/python`, `import bpy`). This machine has no GPU: Cycles ≈ 56 s/frame at 1080p. Use Blender for still plates, layers and very short loops; animate them in HyperFrames.
- 3D characters: `scripts/char3d` (import, rig, face, lipsync, render). Character renders run on the owner's GPU, never on this box. No 3D model is used in an episode before `characters/<name>/model/APPROVAL.md` exists. See `documentation/3d-character-pipeline.md`.
- Media: FFmpeg 6.1. Diagrams: SVG (hand-written or `npx mmdc` Mermaid → SVG), animated with GSAP.
- No second renderer (Remotion evaluated and rejected, see `documentation/phase-2-setup.md`).
- No CDN loads at render time: GSAP from `assets/vendor/gsap.min.js`, fonts via `@font-face` to `assets/fonts/*.woff2`.

## Layout
| Path | Owner / purpose |
|---|---|
| `brand/` | Tokens and standards (colour, type, timing, lighting, camera, subtitles, transitions, sound) |
| `characters/<yusuf\|aiman>/` | `spec.md` (locked), `reference/` (read-only), `expressions/ poses/ outfits/` (production cut-outs), `model/` (future 3D) |
| `assets/{2d,3d,audio,fonts}/` | Reusable assets; each needs source + licence in the folder's `manifest.json` |
| `environments/` | Blender scene scripts and rendered plates |
| `scenes/` | Reusable scene compositions |
| `templates/episode-base/` | Starting point for every episode |
| `episodes/<slug>/` | One HyperFrames project per episode |
| `voice/` | Voice engine (separate workstream). Per-episode audio goes in `episodes/<slug>/assets/audio/` |
| `skills/` | Project skills (linked into `.claude/skills/`) |
| `.claude/agents/` | Subagents |
| `renders/`, `exports/` | Generated, gitignored. Final deliverables are also copied to the shared project folder |

## Episode pipeline
1. `scripts/new-episode <slug>` → creates `episodes/<slug>/` from the template with `episode.yaml`.
2. Fill `episode.yaml` (topic, script, duration, formats, voiceover, preferences, language).
3. Plan: `breakdown.json` (scenes with purpose, duration, visuals, dialogue) → storyboard frames.
4. Build compositions (one scene per file in `compositions/`), using `brand/` tokens and `scenes/` components.
5. `scripts/hf check --json` → fix every error. `scripts/hf snapshot` → look at the frames.
6. Render 16:9 (1920×1080, 30 fps) and 9:16 (1080×1920, 30 fps), thumbnail, SRT, production report into `exports/<slug>/`.

## Defaults
- Language: Malay (Bahasa Melayu) with natural English tech terms unless `episode.yaml` says otherwise.
- Format: 1920×1080 at 30 fps; vertical 1080×1920 at 30 fps as a second export.
- Colours: primary #0066DE, navy #0B1E3F, cyan #00C2FF, orange #FF8A00, light #F5F7FA, dark #1F2937.
- Fonts: Sora (headings), Inter (body/UI), Plus Jakarta Sans (accent).

## Working style
Work in phases, inspect before installing, explain any new dependency, prefer reusable systems over one-off scenes, keep modules small.
