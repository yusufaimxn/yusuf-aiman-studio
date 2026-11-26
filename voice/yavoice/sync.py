"""Animation sync data for HyperFrames / Blender.

From timeline.json this writes cues.json with:
  * events: scene starts, line starts/ends, speaker changes, words, SFX cues
  * mouth: per-speaker mouth-open envelope at the video frame rate (0..1),
    derived from each speaker's stem loudness. This drives 2.5D mouth
    shapes (open/half/closed). It is amplitude-based, not phoneme lip-sync;
    true viseme lip-sync needs a rigged 3D face and a phoneme aligner.
"""
from __future__ import annotations

import array
import json
import math
import wave
from pathlib import Path


def mouth_envelope(stem: Path, fps: int = 30, floor_db: float = -45.0, ceil_db: float = -12.0) -> list[float]:
    with wave.open(str(stem), "rb") as w:
        rate, n = w.getframerate(), w.getnframes()
        pcm = array.array("h", w.readframes(n))
    hop = rate // fps
    env = []
    for i in range(0, len(pcm), hop):
        chunk = pcm[i:i + hop]
        if not chunk:
            break
        rms = math.sqrt(sum(x * x for x in chunk) / len(chunk)) / 32768
        db = 20 * math.log10(rms) if rms > 0 else -120
        v = (db - floor_db) / (ceil_db - floor_db)
        env.append(round(max(0.0, min(1.0, v)), 2))
    # light smoothing so the mouth does not flicker frame to frame
    return [round((env[max(0, i - 1)] + 2 * env[i] + env[min(len(env) - 1, i + 1)]) / 4, 2)
            for i in range(len(env))]


def write_cues(audio_dir: Path, fps: int = 30) -> Path:
    tl = json.loads((audio_dir / "timeline.json").read_text())
    ev: list[dict] = []
    for sc in tl["scenes"]:
        ev.append({"t": sc["start"], "type": "scene_start", "scene": sc["id"], "title": sc["title"]})
    last_spk = None
    for s in tl["segments"]:
        if s["speaker"] != last_spk:
            ev.append({"t": s["start"], "type": "speaker_change", "speaker": s["speaker"]})
            last_spk = s["speaker"]
        ev.append({"t": s["start"], "type": "line_start", "segment": s["id"], "speaker": s["speaker"],
                   "emotion": s["emotion"], "text": s["text"]})
        ev.append({"t": s["end"], "type": "line_end", "segment": s["id"], "speaker": s["speaker"]})
        for w in s["words"]:
            ev.append({"t": w["start"], "type": "word", "speaker": s["speaker"], "word": w["word"], "end": w["end"]})
        for name in s.get("sfx_after", []):
            ev.append({"t": round(s["end"] + 0.05, 3), "type": "sfx", "name": name})
    ev.sort(key=lambda e: e["t"])
    mouth = {spk: mouth_envelope(audio_dir / path.replace("assets/audio/voice/", ""), fps)
             for spk, path in tl["stems"].items()}
    out = audio_dir / "cues.json"
    out.write_text(json.dumps({"fps": fps, "duration": tl["duration"], "events": ev, "mouth": mouth},
                              ensure_ascii=False))
    return out
