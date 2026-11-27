# 3D character pipeline (Yusuf & Aiman)

Status (2026-11-27): **tooling ready, no character model yet.** Episodes keep using the 2.5D cut-outs until a 3D model is approved by the owner.

## Decision
Owner chose (2026-11-27): generate the base meshes with a **free, open-source image-to-3D model running locally on the owner's GPU** (Hunyuan3D family, Tencent). No cloud 3D service, no upload of the character images to third parties. Final renders also run on the owner's GPU (this cloud workspace has no GPU: Cycles ≈ 56 s/frame at 1080p).

## Stages and gates
| # | Stage | Tool | Output | Gate |
|---|---|---|---|---|
| 0 | A-pose references | Owner's image tool | `characters/<name>/reference/apose-{front,side,back}.png` | Owner supplies |
| 1 | Base mesh | Hunyuan3D on owner GPU | `characters/<name>/model/source/*.glb` | Owner approves turntable |
| 2 | Import + clean | `scripts/char3d import` | `<name>.blend`, `meta.json` | – |
| 3 | Body rig | `scripts/char3d rig` (Mixamo bone names, landmarks.json) | armature + weights | Pose test renders reviewed |
| 4 | Face | separate eye/brow/mouth parts (see Face strategy) driven by the expression and viseme names in `characters/expressions.json` | 31 expressions + 9 visemes + blinks | Owner approves expression sheet |
| 5 | Accessories | Separate meshes: Yusuf watch; Aiman glasses, headphones, backpack | parented to bones | Owner approves |
| 6 | Motion | Mixamo-compatible FBX clips in `assets/3d/animations/` + `pose` overrides | reusable action library | – |
| 7 | Shot render | `scripts/char3d render shot.json` on GPU (Cycles/OptiX or EEVEE) | transparent PNG seq + WebM (VP9 alpha) | QC frames inspected |
| 8 | Composite | HyperFrames episode uses the WebM as a layer over environment plates | final MP4 | normal episode QC |

A model is production-ready only when `characters/<name>/model/APPROVAL.md` records the owner's approval (date + what was approved). Until then any 3D render is a preview and must be labelled as such.

## Why A-pose references are needed
The current Yusuf turnaround has hands in pockets and Aiman has a single front view. Image-to-3D fuses hands into pockets, and a rig cannot pull them out. The generator needs a neutral standing pose: arms ~45° from the body, fingers open, feet shoulder-width, plain background, same outfit and proportions as the locked spec. Aiman's glasses, headphones and backpack are better modelled as separate objects, so a set without them helps.

## Owner hardware (2026-11-27) and what fits
Windows desktop, Intel i5-12400, **RTX 5060 Ti 8 GB** (Blackwell, needs CUDA 12.8+), 16 GB DDR4, NVMe.

| Step | Fits 8 GB / 16 GB RAM? | Choice |
|---|---|---|
| AI shape (mesh) | Yes. Official README: 6 GB VRAM for shape. 2mini model is 0.6B. | Hunyuan3D-2 / 2mini shape via the **Hunyuan3D-2-WinPortable v4-cu129** bundle (Blackwell support, CUDA 12.9, PyTorch 2.8), MMGP `--profile 4` or `5` |
| AI texture | Borderline. Official: 16 GB VRAM for shape+texture; WinPortable low-VRAM profiles run in 6-8 GB but ask for 24 GB+ system RAM (owner has 16). | Do not depend on it. Colour the model with **material zones in Blender** (skin, hair, shirt, pants, sneakers, watch): flat stylised colours match the reference style better and stay identical across videos. Try AI texture once as an optional extra. |
| Hunyuan3D 2.1 full | No (about 10 GB shape + 21 GB texture) | Not used |
| TRELLIS / TRELLIS.2 | No (16 GB+) | Not used |
| Rig, face, lip sync | Yes (CPU/Blender) | `scripts/char3d` |
| Final render | Yes for one or two characters + set | Blender Cycles (OptiX) or EEVEE; 8 GB caps scene size, so environments stay as plates |

### Face strategy for this style
The reference face is simple: solid black oval eyes, thick separate brows, small mouth, goatee. Instead of sculpting 40 shape keys on a dense AI mesh, build **eyes, brows and mouth as separate clean parts** on the head (Pixar-style "facial features rig"). They are easy to animate for all 31 expressions, give clean lip sync, and look the same in every video. The AI mesh provides the head, hair, body and clothes.

### Install plan (over Remote Control on the owner's PC)
1. Check NVIDIA driver (> 550, ideally latest Studio driver) and free disk (about 25 GB).
2. Download WinPortable v4-cu129, run shape-only first on one A-pose image, measure VRAM/time.
3. Blender 5.x (Windows installer) for retopology, materials, face parts, rig and GPU render.
4. Clone this repo there and run `scripts/char3d` with Blender's Python.

Licence: Hunyuan3D models are under the Tencent Hunyuan Community License; read its territory and commercial-use terms before publishing (to confirm during install).

## Known limits (honest)
- Image-to-3D gives a good overall shape and texture, but the face comes out as a single sculpt. Expressions and mouth shapes are not generated: they are sculpted as shape keys (stage 4), which is the slowest manual step.
- Generated topology is dense triangles. Deformation at elbows, knees and mouth may need retopology (QuadriFlow/Instant Meshes, or manual) before stage 4.
- Lip sync uses Rhubarb Lip Sync with the language-independent `phonetic` recogniser (Malay works; accuracy is "good cartoon", not phoneme-perfect).
- Fingers are not rigged yet (hands move as one piece); add finger bones once the hand mesh is known.

## Commands
```
scripts/setup.sh && scripts/setup-3d.sh       # bpy 5.3 + Rhubarb
scripts/char3d-smoke.sh [voice.mp3]           # end-to-end test with a PLACEHOLDER mannequin
scripts/char3d import yusuf path/to/yusuf.glb --height 1.0
scripts/char3d rig yusuf                      # edit characters/yusuf/model/landmarks.json to fit joints
scripts/char3d face yusuf
scripts/char3d lipsync episodes/<slug>/assets/audio/01.mp3
scripts/char3d render shot.json               # see templates/char3d-shot.json
```
Expression and viseme weights: `characters/expressions.json` (names match the 31-expression guideline board).
