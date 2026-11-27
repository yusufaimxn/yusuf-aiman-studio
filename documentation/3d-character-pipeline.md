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
| 4 | Face | `scripts/char3d face` adds the shape-key slots, then each key is sculpted in Blender | 31 expressions + 9 visemes + blinks | Owner approves expression sheet |
| 5 | Accessories | Separate meshes: Yusuf watch; Aiman glasses, headphones, backpack | parented to bones | Owner approves |
| 6 | Motion | Mixamo-compatible FBX clips in `assets/3d/animations/` + `pose` overrides | reusable action library | – |
| 7 | Shot render | `scripts/char3d render shot.json` on GPU (Cycles/OptiX or EEVEE) | transparent PNG seq + WebM (VP9 alpha) | QC frames inspected |
| 8 | Composite | HyperFrames episode uses the WebM as a layer over environment plates | final MP4 | normal episode QC |

A model is production-ready only when `characters/<name>/model/APPROVAL.md` records the owner's approval (date + what was approved). Until then any 3D render is a preview and must be labelled as such.

## Why A-pose references are needed
The current Yusuf turnaround has hands in pockets and Aiman has a single front view. Image-to-3D fuses hands into pockets, and a rig cannot pull them out. The generator needs a neutral standing pose: arms ~45° from the body, fingers open, feet shoulder-width, plain background, same outfit and proportions as the locked spec. Aiman's glasses, headphones and backpack are better modelled as separate objects, so a set without them helps.

## Hunyuan3D on the owner's machine (to be done over Remote Control)
- Hunyuan3D 2.1 (shape + PBR texture) needs roughly 10 GB VRAM for shape and about 21 GB for texture per the official README; Hunyuan3D 2.0 / 2mini are lighter (about 6 GB shape, 16 GB with texture). Which one we use depends on the owner's GPU.
- Install from the official GitHub repo (Tencent-Hunyuan) with its pinned PyTorch/CUDA; weights download from Hugging Face on that machine.
- Check the model licence (Tencent Hunyuan Community License) for the owner's region and commercial use before publishing videos made with it.

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
