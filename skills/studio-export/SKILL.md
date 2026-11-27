---
name: studio-export
description: Produce the final deliverables for a Yusuf Aiman episode - 16:9 and 9:16 MP4 at 30 fps, thumbnail, SRT captions and production report - in an organised exports folder. Use when an episode has passed QC.
---

# Studio export

Output folder: `exports/<slug>/`, then copy it to the shared project folder `/mnt/project-files/exports/<slug>/`.

| File | Spec |
|---|---|
| `<slug>_16x9.mp4` | 1920×1080, 30 fps, H.264 + AAC, `scripts/hf render --quality delivery` |
| `<slug>_9x16.mp4` | 1080×1920, 30 fps; render the vertical composition (re-laid out, not a crop) |
| `<slug>_thumbnail.png` | 1280×720 key frame with title text |
| `<slug>.srt` | From the voiceover timing; max 2 lines, about 42 characters per line |
| `report.md` | Inputs, scene list with purposes, assets with status (placeholders called out), QC results, render times |

Run the studio-qc skill first. Never export with QC errors unless the owner accepts them in writing.
