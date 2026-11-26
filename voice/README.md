# Voice engine (`yavoice`)

Provider-independent voice cloning, script-to-speech, audio post-production, sync data and QA for
the Yusuf Aiman studio. Pure Python 3.11+ standard library plus FFmpeg; no pip installs needed.

Run commands from this folder: `cd voice && python -m yavoice <command>`.

## Flow

1. **Pick voices** (once): choose a stock voice for YUSUF and a different one for AIMAN, put the ids
   in `.env` (`YUSUF_VOICE_ID`, `AIMAN_VOICE_ID`), preview, then set each profile's status to
   `approved`. Decided 2026-11-26: Yusuf's real voice is **not** cloned.
2. *(Unused unless cloning is approved later)* Enrollment and cloning: `python -m yavoice enroll-ui`,
   `documentation/voice/recording-guide.md` and `documentation/voice/security-and-consent.md`.
3. **Write a script** in the studio format (see `examples/apa-itu-api.txt`): speaker lines with
   emotion and options, scene headers and SFX cues.
4. **Check pronunciations**: `python -m yavoice lexicon check script.txt`, then add fixes to
   `lexicon/zz-overrides.json`.
5. **Current workflow (Free plan, decided 2026-11-26):** the chosen voices (Shahrul for Yusuf,
   Ashraf for Aiman) are Voice Library voices, which the ElevenLabs API refuses on the Free plan. So
   the user makes one MP3 per script line on the ElevenLabs website and uploads them. Build the episode
   audio with `python -m yavoice import script.txt --episode <slug> line1.mp3 line2.mp3 ...` (files in
   script line order, exactly one per spoken line). Audio is kept as supplied; captions use estimated
   word timing (QA warns about it).
6. **Synthesise** (when API voices are available): `python -m yavoice synth script.txt --episode <slug> --allow-remote` (preview), or
   use `--mock` for an offline dry run with placeholder tones.
7. **Regenerate one line**: `--regen <segment-id>` makes a new take of only that segment. Approve a
   take with `python -m yavoice approve`.
8. **QA**: `python -m yavoice qa --episode <slug> --target 90 [--transcript t.json] [--final]`.
9. **Master**: `python -m yavoice master --episode <slug> --music bed.mp3`. SFX named in the script
   come from `assets/audio/sfx/<name>.*`.

## Outputs (`episodes/<slug>/assets/audio/voice/`)

| File | Use |
|---|---|
| `narration.wav` | All voices, loudness-normalised |
| `stems/<speaker>.wav` | Separate track per speaker |
| `mix.wav` | Narration + ducked music + SFX, mastered |
| `timeline.json` | Scenes, lines, word timings, emotions (drives HyperFrames timing) |
| `cues.json` | Animation events plus a per-speaker mouth-open envelope at 30 fps |
| `captions.srt` | Subtitles from word timings (original spelling, not pronunciation aliases) |
| `versions.json` | Take history per segment, with the approved take marked |
| `qa_report.json` | Automatic QA results and the segments to listen to first |

## Layout

- `yavoice/providers/`: `base.py` interface plus ElevenLabs, Cartesia and mock adapters
- `yavoice/delivery.py`: the 15 emotions mapped to each provider's real controls
- `yavoice/script.py`: script parser and sentence segmentation
- `yavoice/lexicon.py` + `lexicon/`: pronunciation dictionary
- `yavoice/post.py` + `presets/`: FFmpeg chains (educational, storytelling, cinematic, dialogue, shortform)
- `yavoice/pipeline.py`, `captions.py`, `sync.py`, `qa.py`
- `yavoice/enroll.py`, `consent.py`, `server.py` + `enroll_ui/`: enrollment
- `profiles/`: `YUSUF_AIMAN_VOICE_V1`, `AIMAN_CHARACTER_VOICE_V1`, speaker map

## Lip-sync scope

`cues.json` gives word timings and an amplitude-based mouth envelope for 2.5D characters. True
phoneme/viseme lip-sync needs a rigged 3D face. This is planned for the later 3D phase and is not
claimed here.

## Tests

`python3 -m unittest discover -s voice/tests` (run from the repo root). They run offline with the
mock provider and FFmpeg.
