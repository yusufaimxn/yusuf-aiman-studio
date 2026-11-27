# world3d: code-built 3D characters and sets (Three.js inside HyperFrames)

Owner decision 2026-11-27: Yusuf and Aiman are rebuilt as full 3D characters in code (the reference boards are references, not textures). Renders on CPU through HyperFrames (about 10 s of render per 1 s of 1080x1920 video), no GPU needed.

- `lib/character.js`: `buildCharacter(THREE, YUSUF | AIMAN)` returns a jointed rig (hips, spine, chest, neck, head, shoulder/elbow/wrist, hip/knee/ankle), `pose()`, `face({expression, viseme, blink, look})`, plus `POSES`, `EXPRESSIONS`, `VISEMES` (Rhubarb letters) and `walkPose(phase)`.
- `examples/yusuf-turntable-talk.html`: 9 s test (360 turntable, then talks to a supplied voice line with gestures). Copy into a HyperFrames project with `assets/lib/{three.module.js,gsap.min.js,character.js,visemes.js}` and `assets/01.mp3`.
- Lip sync: `scripts/char3d lipsync <mp3> --out x.json`, then convert cues to `[[start, letter], ...]`.

Status: Yusuf v1 for owner review. Not approved for episodes yet.
