---
name: episode-planner
description: Turn a topic or script for a Yusuf Aiman episode into episode.yaml, a scene breakdown (breakdown.json) and storyboard notes. Use at the start of any new episode or when re-planning one.
---

# Episode planner

Input: `episodes/<slug>/episode.yaml` (create the episode first with `scripts/new-episode <slug>`).
Output: `episodes/<slug>/breakdown.json` (schema: `templates/breakdown.schema.json`) and `episodes/<slug>/storyboard/storyboard.md`.

## Steps
1. Read `episode.yaml`, `CLAUDE.md`, both `characters/*/spec.md`.
2. If `script.source` is `none`, write the script. Language follows `language` (default Malay with natural English tech terms). Yusuf explains; Aiman asks, reacts and relates to daily life.
3. Structure (scale to `target_duration_s`): hook → setup → explain (1–3 scenes) → real-world example → key takeaways → outro. Short form (≤60 s): hook → explain → takeaway.
4. Every scene gets a `purpose` and a one-sentence `goal` (what the viewer understands after it). Cut any scene without one.
5. Scenes are contiguous: `start_s` of each = previous `start_s + duration_s`; the sum equals `total_duration_s`. Before a voiceover exists, estimate durations at roughly 130–150 spoken words per minute and mark them as estimates; once voiceover timing exists, scene durations follow the real audio.
6. Mark every asset with `status`: `production`, `placeholder` or `missing`. Never mark a reference board crop as production.
7. Technical facts must be correct. If a claim is uncertain, add it to `storyboard.md` under "To verify".
8. Run `.venv/bin/python scripts/validate_episode.py episodes/<slug>` and fix every error.
