# Episode tools (scammer-dapat-nombor)

Order of a rebuild:
1. `python3 tools/timing.py` – voice timeline + estimated word timing from `assets/audio/voice/supplied/01..12.mp3` → `timing.json`.
2. `python3 tools/build.py` – writes `index.html` (9:16), `tools/landscape.index.html` (16:9), `compositions/captions.html`, `captions.srt`.
3. `python3 tools/breakdown.py` – writes `breakdown.json`; then `python3 ../../scripts/validate_episode.py .`
4. `../../scripts/hf check --json`, `../../scripts/hf snapshot ...`
5. `../../scripts/hf render --quality delivery -o ../../renders/<slug>/v1_9x16.mp4`
   (16:9 only for long-form: `tools/prep_landscape.sh <dir>` then render from that dir).
6. `tools/loudnorm.sh <render> <export>` (−14 LUFS), `python3 tools/qc.py <mp4> <dir>`, `python3 tools/sync_check.py <mp4>`.

Character cut-outs (placeholder, from the locked reference renders):
`rembg i -m isnet-general-use -a <reference.png> <out.png>` (pip `rembg[cpu,cli]`, model from GitHub releases), then the rim light is baked into `*-lit.png` (CSS filters are too slow for CPU rendering).
