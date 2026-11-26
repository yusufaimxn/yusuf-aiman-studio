# Phase 2 — Framework setup (2026-11-26)

## Installed (project-local)
| Component | Version | Purpose |
|---|---|---|
| hyperframes (npm) | 0.9.97 | Primary compositor/renderer: HTML + GSAP scenes to MP4 via headless Chrome + FFmpeg |
| HyperFrames official skills | bundled with 0.9.97 | `.claude/skills/{hyperframes,hyperframes-cli,media-use}` |
| gsap (npm) | 3.15.1 | Timeline animation inside scenes (copied per episode to `assets/vendor/`, no CDN at render time) |
| @fontsource/sora, plus-jakarta-sans, inter | 5.3.0 | Brand fonts as local woff2 (`@font-face` per composition) |
| @mermaid-js/mermaid-cli (dev) | 12.2.0 | Text diagrams to SVG |
| bpy (pip, `.venv`) | 5.3.0 | Headless Blender for 3D environments/props |
| libegl1, libgl1-mesa-dri, libegl-mesa0 (apt) | Ubuntu 24.04 | Software EGL so EEVEE/Workbench run without a GPU |

Run `scripts/setup.sh` on a fresh machine. Run HyperFrames through `scripts/hf <command>` (pins CLI 0.9.97, telemetry off).

## Measured results (4-core Xeon 2.1 GHz, no GPU)
| Test | Result |
|---|---|
| HyperFrames 10 s 1920x1080 30 fps render (2 scenes, typography + SVG diagram) | 22 s wall time; 300 frames, H.264, 10.000 s; `check` 0 errors |
| Blender Cycles CPU, 32 samples + denoise, 1080p | 56 s / frame |
| Blender Cycles CPU, 128 samples + denoise, 1080p | 163 s / frame |
| Blender EEVEE (software EGL), 32 samples, 1080p | 74 s / frame |
| Blender Workbench (grey preview), 1080p | 1.5 s / frame |

Implication: one minute of fully 3D-animated footage (1,800 frames) is about 28 hours of CPU time here with Cycles at 32 samples. On this machine Blender is used for still plates, short loops rendered at low frame counts, and layered backgrounds that HyperFrames animates (parallax, camera moves on 2D layers). Fully animated 3D needs a GPU machine.

## Network notes
Official docs sites (hyperframes.heygen.com, gsap.com, docs.blender.org) are blocked in the cloud environment; HyperFrames docs were read from the skills bundled in the npm package. cdn.jsdelivr.net and Google Fonts are blocked, so scenes must not load GSAP or fonts from CDNs.

## Remotion
Not adopted. Same role as HyperFrames (web tech to video); no capability gap found.
