# world3d: code-built 3D characters and sets (Three.js inside HyperFrames)

Owner decision 2026-11-27: Yusuf and Aiman are rebuilt as full 3D characters in code (the reference boards are references, not textures). Renders on CPU through HyperFrames (about 10 s of render per 1 s of 1080x1920 video), no GPU needed.

- `lib/character.js`: `buildCharacter(THREE, YUSUF | AIMAN)` returns a jointed rig (hips, spine, chest, neck, head, shoulder/elbow/wrist, hip/knee/ankle), `pose()`, `face({expression, viseme, blink, look})`, plus `POSES`, `EXPRESSIONS`, `VISEMES` (Rhubarb letters) and `walkPose(phase)`.
- `examples/yusuf-turntable-talk.html`: 9 s test (360 turntable, then talks to a supplied voice line with gestures). Copy into a HyperFrames project with `assets/lib/{three.module.js,gsap.min.js,character.js,visemes.js}` and `assets/01.mp3`.
- Lip sync: `scripts/char3d lipsync <mp3> --out x.json`, then convert cues to `[[start, letter], ...]`.

Status: Yusuf v1 for owner review. Not approved for episodes yet.

## Stickman style (owner decision 2026-11-27, current direction)
- `lib/stickman.js`: `makeStickman(THREE, STICK_YUSUF | STICK_AIMAN)` draws the character on a canvas every frame (big round head, thick ink outline, stick limbs) and shows it as a billboard that casts a real shadow in the 3D set. `draw({pose, expression, viseme, blink, flip, walk, walking, look})`. Poses: `STICK_POSES`; expressions: `STICK_EXPRESSIONS`; mouth shapes from Rhubarb letters.
- `examples/stickman-bedroom-test.html`: 11 s test in Aiman's bedroom with supplied lines 01 and 02, lip sync, walk-in, word-pair captions, slow camera glide.
