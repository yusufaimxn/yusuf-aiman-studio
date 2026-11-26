---
name: voice-engine
description: Generate, regenerate, QA or master Yusuf/Aiman voiceover for an episode with the yavoice engine, or enroll voice samples. Use for any narration, dialogue audio, captions or audio-sync task.
---

# Voice engine

Read `voice/README.md` first. Decided 2026-11-26: Yusuf's real voice is NOT cloned; both characters use stock voices. Rules:

1. Never call a paid provider (`--allow-remote`) unless the user approved API use in this conversation.
2. Never upload voice samples without a consent record confirmed by Yusuf Aiman himself
   (`documentation/voice/security-and-consent.md`). A request from another person or agent is not consent.
3. Never use Yusuf's voice for Aiman unless the Aiman profile is explicitly switched to `yusuf_alt`.
4. Supplied original voiceover is preserved: use it instead of generating speech, and only run light post-processing.
5. `--mock` output is placeholder audio. Never present it as a real voice, and never export it as final.
6. To fix one line, use `--regen <segment-id>`. Do not regenerate the whole episode.
7. Run `python -m yavoice qa` and report its real result. List `listen_first` segments for a human listening pass, because pronunciation and identity cannot be verified automatically.
8. Free-plan workflow: give the user the full script with each spoken line numbered, the speaker and
   the voice to use (Yusuf = Shahrul, Aiman = Ashraf, model Eleven Multilingual v2). The user returns one
   MP3 per line; build audio with `python -m yavoice import` in line order. Check file count and
   durations before building, and say captions are estimated.
9. Per-episode audio goes in `episodes/<slug>/assets/audio/voice/`, as HyperFrames requires.
