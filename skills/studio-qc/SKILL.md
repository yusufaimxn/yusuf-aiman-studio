---
name: studio-qc
description: Run quality control on a rendered Yusuf Aiman episode (durations, missing assets, audio sync, readability, aspect ratio, frame consistency, render errors) and write the QC section of the production report. Use after every render and before any export.
---

# Studio QC

Never report a check as passed without running it on the actual file.

1. Plan: `.venv/bin/python scripts/validate_episode.py episodes/<slug>` (schema, scene continuity, missing assets, supplied voiceover present).
2. Composition: `scripts/hf check --json` in the episode folder: 0 errors; list every warning with a decision.
3. File: `ffprobe` each output: codec h264, 30/1 fps, 1920×1080 or 1080×1920, duration within ±0.1 s of `total_duration_s`, audio stream present when voiceover/music exists.
4. Frames: `ffmpeg -vf blackdetect=d=0.2,freezedetect=d=2` for unintended black or frozen stretches.
5. Audio: loudness with `ffmpeg -af ebur128` (target about −14 LUFS integrated for online video, true peak ≤ −1 dBTP); no clipping.
6. Look: extract the midpoint frame of every scene plus the first and last frame; read them yourself and check text size, contrast, cropping, character consistency.
7. Write results (pass/fail per item, with the evidence) into `exports/<slug>/report.md`.
