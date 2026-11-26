"""Voice quality assurance.

Automatic checks (measured, not assumed):
  * every script segment has audio, timeline is ordered and non-overlapping
  * speaking rate per segment (catches truncated or run-on generations)
  * long pauses inside a segment (silencedetect)
  * clipping / true peak and loudness of the narration
  * noise floor
  * same provider/model/voice per speaker across the episode
  * optional transcript comparison (missing words, repeated words, wrong
    language) when a transcript is supplied, e.g. from `hyperframes transcribe`
  * placeholder (mock) audio blocks a final export

What it cannot verify by itself: whether pronunciation *sounds* right or the
voice *sounds* like Yusuf. Those need a listening pass; the report lists the
segments to listen to first.
"""
from __future__ import annotations

import difflib
import json
import re
from pathlib import Path

from . import ffmpeg

CPS_RANGE = (8.0, 22.0)  # characters/second; typical conversational speech sits ~12-17
MAX_INNER_PAUSE = 0.9
MAX_TRUE_PEAK = -1.0
MAX_NOISE_FLOOR = -55.0
EN_HINTS = set("the and is are you we this that with for of to it what how why".split())
MS_HINTS = set("yang dan ini itu kita kami awak saya tak nak ke dengan untuk dalam apa macam boleh".split())


def _norm(t: str) -> list[str]:
    return re.findall(r"[\w']+", t.lower())


def run_qa(audio_dir: Path, transcript: dict[str, str] | None = None, target_duration: float | None = None,
           final: bool = False) -> dict:
    tl = json.loads((audio_dir / "timeline.json").read_text())
    issues: list[dict] = []
    warnings: list[dict] = []
    listen_first: list[str] = []

    def flag(level: list, seg: str | None, check: str, msg: str):
        level.append({"segment": seg, "check": check, "message": msg})

    prev_end = 0.0
    voices: dict[str, set] = {}
    for s in tl["segments"]:
        seg_dir = audio_dir / "segments"
        mp = seg_dir / f"{s['id']}.{s.get('key', '')}.json"
        meta = json.loads(mp.read_text()) if mp.exists() else None
        if meta is None:
            flag(issues, s["id"], "missing_audio", "no audio for this segment")
            continue
        voices.setdefault(s["speaker"], set()).add((meta["provider"], meta["model"], meta["voice_id"]))
        if s["start"] < prev_end - 1e-3:
            flag(issues, s["id"], "sync", "segment overlaps the previous one")
        prev_end = s["end"]
        dur = s["end"] - s["start"]
        cps = len(s["text"]) / dur if dur else 0
        if not (CPS_RANGE[0] <= cps <= CPS_RANGE[1]):
            flag(warnings, s["id"], "speaking_rate", f"{cps:.1f} chars/s is unusual (possible truncation, "
                                                       "added words or very slow delivery)")
            listen_first.append(s["id"])
        wav = seg_dir / f"{s['id']}.{meta['key']}.wav"
        inner = [(a, b) for a, b in ffmpeg.silences(wav, -45, MAX_INNER_PAUSE) if a > 0.15 and b < dur - 0.15]
        if inner:
            flag(warnings, s["id"], "pause", f"{len(inner)} pause(s) over {MAX_INNER_PAUSE}s inside the line")
            listen_first.append(s["id"])
        if meta.get("lexicon_hits"):
            listen_first.append(s["id"])
        if s.get("words_approximate"):
            flag(warnings, s["id"], "timing", "word timings are estimated; run alignment before lip-sync")
        if transcript and s["id"] in transcript:
            _compare(s, transcript[s["id"]], issues, warnings, listen_first)
        _language_hint(s, warnings)
        if s["placeholder"]:
            (issues if final else warnings).append({"segment": s["id"], "check": "placeholder",
                                                    "message": "mock/placeholder audio, not a real voice"})

    for spk, v in voices.items():
        if len(v) > 1:
            flag(issues, None, "voice_identity", f"{spk} uses {len(v)} different provider/model/voice combos")

    narr = audio_dir / "narration.wav"
    loud = ffmpeg.loudness(narr)
    st = ffmpeg.stats(narr)
    if loud["true_peak"] > MAX_TRUE_PEAK:
        flag(issues, None, "clipping", f"narration true peak {loud['true_peak']} dBTP > {MAX_TRUE_PEAK}")
    if st["noise_floor_db"] is not None and st["noise_floor_db"] > MAX_NOISE_FLOOR and st["noise_floor_db"] != float("-inf"):
        flag(warnings, None, "noise", f"noise floor {st['noise_floor_db']:.1f} dB")
    if target_duration:
        dev = (tl["duration"] - target_duration) / target_duration
        if abs(dev) > 0.15:
            flag(warnings, None, "duration", f"narration {tl['duration']:.1f}s vs target {target_duration}s "
                                             f"({dev:+.0%})")
    report = {"episode": tl["episode"], "duration": tl["duration"], "segments": len(tl["segments"]),
              "narration_loudness": loud, "passed": not issues, "issues": issues, "warnings": warnings,
              "listen_first": sorted(set(listen_first)),
              "not_automatically_verifiable": ["pronunciation quality", "perceived voice identity",
                                               "emotional appropriateness"]}
    (audio_dir / "qa_report.json").write_text(json.dumps(report, indent=2, ensure_ascii=False))
    return report


def _compare(seg: dict, heard: str, issues: list, warnings: list, listen: list) -> None:
    exp, got = _norm(seg["text"]), _norm(heard)
    sm = difflib.SequenceMatcher(a=exp, b=got)
    missing = [w for tag, i1, i2, _, _ in sm.get_opcodes() if tag in ("delete", "replace") for w in exp[i1:i2]]
    extra = [w for tag, _, _, j1, j2 in sm.get_opcodes() if tag in ("insert", "replace") for w in got[j1:j2]]
    if sm.ratio() < 0.85 or len(missing) > max(1, len(exp) // 10):
        issues.append({"segment": seg["id"], "check": "missing_words",
                       "message": f"match {sm.ratio():.0%}; missing {missing[:8]} extra {extra[:8]}"})
        listen.append(seg["id"])
    reps = [got[i] for i in range(1, len(got)) if got[i] == got[i - 1] and
            not any(exp[j] == exp[j - 1] == got[i] for j in range(1, len(exp)))]
    if reps:
        warnings.append({"segment": seg["id"], "check": "repeated_words", "message": f"repeated: {reps}"})
        listen.append(seg["id"])


def _language_hint(seg: dict, warnings: list) -> None:
    words = set(_norm(seg["text"]))
    en, ms = len(words & EN_HINTS), len(words & MS_HINTS)
    if seg["language"] == "ms" and en >= 3 and ms == 0:
        warnings.append({"segment": seg["id"], "check": "language",
                         "message": "line looks fully English but is tagged ms; consider lang=en"})
    if seg["language"] == "en" and ms >= 3 and en == 0:
        warnings.append({"segment": seg["id"], "check": "language",
                         "message": "line looks Malay but is tagged en"})
