"""Subtitle generation from the voice timeline (word timings -> SRT cues)."""
from __future__ import annotations

from pathlib import Path

MAX_LINE = 42
MAX_LINES = 2
MAX_CUE_SECONDS = 6.0
MIN_CUE_SECONDS = 0.9


def _ts(t: float) -> str:
    ms = int(round(t * 1000))
    h, ms = divmod(ms, 3_600_000)
    m, ms = divmod(ms, 60_000)
    s, ms = divmod(ms, 1000)
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"


def cues(timeline: list[dict]) -> list[tuple[float, float, str]]:
    out: list[tuple[float, float, str]] = []
    for seg in timeline:
        cur: list[dict] = []
        for w in seg["words"]:
            trial = " ".join(x["word"] for x in cur + [w])
            if cur and (len(trial) > MAX_LINE * MAX_LINES or w["end"] - cur[0]["start"] > MAX_CUE_SECONDS):
                out.append(_cue(cur))
                cur = []
            cur.append(w)
        if cur:
            out.append(_cue(cur))
    # Enforce a readable minimum duration without overlapping the next cue.
    fixed = []
    for i, (s, e, t) in enumerate(out):
        nxt = out[i + 1][0] if i + 1 < len(out) else e + MIN_CUE_SECONDS
        fixed.append((s, min(max(e, s + MIN_CUE_SECONDS), nxt - 0.02), t))
    return fixed


def _cue(words: list[dict]) -> tuple[float, float, str]:
    text = " ".join(w["word"] for w in words)
    if len(text) > MAX_LINE and " " in text:  # break into two balanced lines at a space
        mid = len(text) // 2
        cut = min((i for i, c in enumerate(text) if c == " "), key=lambda i: abs(i - mid))
        text = text[:cut] + "\n" + text[cut + 1:]
    return words[0]["start"], words[-1]["end"], text


def write_srt(timeline: list[dict], path: Path) -> Path:
    rows = [f"{i}\n{_ts(s)} --> {_ts(e)}\n{t}\n" for i, (s, e, t) in enumerate(cues(timeline), 1)]
    Path(path).write_text("\n".join(rows), encoding="utf-8")
    return path
