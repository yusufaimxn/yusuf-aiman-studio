# Character framing rules (2.5D episodes)

Standing rule from the user, 2026-11-27. Applies to every video.

1. **Focus the speaker.** When one character speaks, frame a close-up of that character only; the other leaves the frame.
2. **Two-shot for conversation.** Quick back-and-forth or a reaction exchange: both characters, zoomed out.
3. **Never cut the head.** Head top sits below the graphics zone (about y ≥ 980 px in 1080×1920) and is never covered by cards or captions. Legs and lower body may leave the frame.
4. **Characters must read big.** Close-up ≈ 1.75× the full-body pose canvas, two-shot ≈ 1.35×.
5. **Dark shade at the bottom** whenever characters are zoomed, so the eye goes to the face. Captions sit on the shade (bottom ≈ 420 px, above TikTok's bottom UI).

## Implementation (reference: `episodes/deepfake-dato/compositions/cast.html`)
- Poses are normalised by `tools/cutouts.py` to a 640×800 canvas (same scale, feet on the bottom edge, legs centred), so they swap in place.
- `FRAMES` holds per-shot transforms (`A` Aiman close-up, `Y` Yusuf close-up, `AY` two-shot) for `#a-ch` / `#y-ch` with `transformOrigin: 50% 0%`; `SHOTS` is the shot list `[time, frame]`. Each cut moves in 0.4 s (power3.inOut) and the held shot slowly pushes in 5 % on `.cam`.
- `#shade` is a bottom gradient over the characters; opacity 1 in close-ups, 0.75 in two-shots.
- Pick shots from the script: a line longer than ~3.5 s, or a strong single reaction → close-up on the speaker; short replies inside an exchange → two-shot.
