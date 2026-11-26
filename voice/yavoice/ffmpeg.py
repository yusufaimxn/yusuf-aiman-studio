"""Thin FFmpeg/FFprobe helpers used by enrollment QA, post-production and QA."""
from __future__ import annotations

import json
import re
import shutil
import subprocess
from pathlib import Path

FFMPEG = shutil.which("ffmpeg") or "ffmpeg"
FFPROBE = shutil.which("ffprobe") or "ffprobe"


def run(args: list[str]) -> subprocess.CompletedProcess:
    p = subprocess.run(args, capture_output=True, text=True)
    if p.returncode != 0:
        raise RuntimeError(f"{' '.join(args[:3])}... failed: {p.stderr[-800:]}")
    return p


def probe(path: Path) -> dict:
    p = run([FFPROBE, "-v", "error", "-show_entries",
             "format=duration,format_name:stream=codec_name,sample_rate,channels",
             "-of", "json", str(path)])
    d = json.loads(p.stdout)
    s = (d.get("streams") or [{}])[0]
    return {"duration": float(d["format"].get("duration", 0)), "format": d["format"].get("format_name"),
            "codec": s.get("codec_name"), "sample_rate": int(s.get("sample_rate", 0) or 0),
            "channels": int(s.get("channels", 0) or 0)}


def loudness(path: Path) -> dict:
    """Integrated loudness (LUFS), true peak (dBTP) and loudness range via loudnorm analysis."""
    p = subprocess.run([FFMPEG, "-hide_banner", "-nostats", "-i", str(path), "-af",
                        "loudnorm=print_format=json", "-f", "null", "-"], capture_output=True, text=True)
    m = re.search(r"\{[^{}]*\"input_i\"[^{}]*\}", p.stderr, re.S)
    if not m:
        raise RuntimeError(f"loudness analysis failed for {path}")
    j = json.loads(m.group(0))
    return {"lufs": float(j["input_i"]), "true_peak": float(j["input_tp"]), "lra": float(j["input_lra"]),
            "threshold": float(j["input_thresh"])}


def silences(path: Path, noise_db: float = -40, min_dur: float = 0.35) -> list[tuple[float, float]]:
    p = subprocess.run([FFMPEG, "-hide_banner", "-nostats", "-i", str(path), "-af",
                        f"silencedetect=noise={noise_db}dB:d={min_dur}", "-f", "null", "-"],
                       capture_output=True, text=True)
    starts = [float(x) for x in re.findall(r"silence_start: (-?[\d.]+)", p.stderr)]
    ends = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", p.stderr)]
    if len(ends) < len(starts):  # trailing silence runs to the end
        ends.append(probe(path)["duration"])
    return list(zip(starts, ends))


def stats(path: Path) -> dict:
    """Peak level, RMS, noise floor estimate (RMS trough) and clipped-sample count."""
    p = subprocess.run([FFMPEG, "-hide_banner", "-nostats", "-i", str(path), "-af",
                        "astats=metadata=0:reset=0:measure_overall=Peak_level+RMS_level+RMS_trough+Number_of_samples"
                        "+Peak_count+Flat_factor", "-f", "null", "-"], capture_output=True, text=True)
    txt = p.stderr.split("Overall")[-1]

    def grab(name: str) -> float | None:
        m = re.search(rf"{name}:\s*(-?[\d.]+|-inf)", txt)
        if not m:
            return None
        return float("-inf") if m.group(1) == "-inf" else float(m.group(1))

    return {"peak_db": grab("Peak level dB"), "rms_db": grab("RMS level dB"),
            "noise_floor_db": grab("RMS trough dB"), "peak_count": grab("Peak count")}


def to_wav(src: Path, dst: Path, rate: int = 48000, mono: bool = True) -> Path:
    args = [FFMPEG, "-y", "-hide_banner", "-loglevel", "error", "-i", str(src), "-ar", str(rate)]
    if mono:
        args += ["-ac", "1"]
    run(args + ["-c:a", "pcm_s16le", str(dst)])
    return dst
