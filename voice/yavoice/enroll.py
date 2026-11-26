"""Voice enrollment: sample intake, quality review, approval and cloning.

Samples live in voice/samples/<speaker>/ (gitignored, private). The manifest
records each sample's hash, QA result and review status. Only samples a person
marked "approved" can be listed in a consent record and uploaded.
"""
from __future__ import annotations

import datetime as dt
import json
import shutil
from dataclasses import asdict, dataclass, field
from pathlib import Path

from . import ffmpeg
from .consent import sha256

ROOT = Path(__file__).resolve().parents[1]
SAMPLES = ROOT / "samples"
ACCEPTED_EXT = {".wav", ".mp3", ".m4a", ".flac", ".ogg", ".webm", ".aac"}

# Thresholds follow common provider guidance (clean speech, no clipping, low
# noise, consistent level). They are review aids, not provider rules.
MIN_SECONDS, MAX_SECONDS = 5.0, 600.0
CLIP_PEAK_DB = -0.3
MAX_NOISE_FLOOR_DB = -50.0
LUFS_RANGE = (-26.0, -14.0)
MAX_SILENCE_RATIO = 0.35


@dataclass
class SampleQA:
    duration: float
    sample_rate: int
    lufs: float
    true_peak: float
    noise_floor_db: float | None
    silence_ratio: float
    issues: list[str] = field(default_factory=list)
    warnings: list[str] = field(default_factory=list)

    @property
    def passed(self) -> bool:
        return not self.issues


def analyse(path: Path) -> SampleQA:
    info = ffmpeg.probe(path)
    loud = ffmpeg.loudness(path)
    st = ffmpeg.stats(path)
    sil = ffmpeg.silences(path)
    sil_total = sum(e - s for s, e in sil)
    q = SampleQA(duration=round(info["duration"], 2), sample_rate=info["sample_rate"], lufs=loud["lufs"],
                 true_peak=loud["true_peak"], noise_floor_db=st["noise_floor_db"],
                 silence_ratio=round(sil_total / info["duration"], 3) if info["duration"] else 1.0)
    if q.duration < MIN_SECONDS:
        q.issues.append(f"too short ({q.duration}s < {MIN_SECONDS}s)")
    if q.duration > MAX_SECONDS:
        q.warnings.append("very long file; split into 1-5 minute takes for easier review")
    if q.true_peak > CLIP_PEAK_DB:
        q.issues.append(f"possible clipping (true peak {q.true_peak} dBTP)")
    if q.sample_rate and q.sample_rate < 22050:
        q.issues.append(f"low sample rate ({q.sample_rate} Hz); record at 44.1 or 48 kHz")
    if q.noise_floor_db is not None and q.noise_floor_db > MAX_NOISE_FLOOR_DB:
        q.warnings.append(f"noticeable background noise (floor {q.noise_floor_db:.1f} dB)")
    if not (LUFS_RANGE[0] <= q.lufs <= LUFS_RANGE[1]):
        q.warnings.append(f"level {q.lufs} LUFS is outside {LUFS_RANGE}; check mic gain/distance")
    if q.silence_ratio > MAX_SILENCE_RATIO:
        q.warnings.append(f"{int(q.silence_ratio * 100)}% silence; trim long pauses")
    return q


class Manifest:
    def __init__(self, speaker: str):
        self.dir = SAMPLES / speaker
        self.path = self.dir / "manifest.json"
        self.data = json.loads(self.path.read_text()) if self.path.exists() else {"speaker": speaker,
                                                                                   "samples": {}}

    def save(self) -> None:
        self.dir.mkdir(parents=True, exist_ok=True)
        self.path.write_text(json.dumps(self.data, indent=2))

    def add(self, src: Path, style: str = "conversational", note: str = "") -> dict:
        src = Path(src)
        if src.suffix.lower() not in ACCEPTED_EXT:
            raise ValueError(f"unsupported format {src.suffix}; use one of {sorted(ACCEPTED_EXT)}")
        self.dir.mkdir(parents=True, exist_ok=True)
        digest = sha256(src)
        dst = self.dir / f"{digest[:12]}{src.suffix.lower()}"
        if not dst.exists():
            shutil.copy2(src, dst)
        qa = analyse(dst)
        entry = {"file": dst.name, "sha256": digest, "original_name": src.name, "style": style, "note": note,
                 "added_at": dt.datetime.now(dt.timezone.utc).isoformat(),
                 "qa": asdict(qa) | {"passed": qa.passed}, "status": "pending"}
        self.data["samples"][digest] = entry
        self.save()
        return entry

    def set_status(self, digest_prefix: str, status: str, reviewer: str) -> dict:
        assert status in {"approved", "rejected", "pending"}
        matches = [k for k in self.data["samples"] if k.startswith(digest_prefix)]
        if len(matches) != 1:
            raise KeyError(f"{len(matches)} samples match {digest_prefix!r}")
        e = self.data["samples"][matches[0]]
        if status == "approved" and not e["qa"]["passed"]:
            raise ValueError(f"sample failed QA: {e['qa']['issues']}")
        e["status"], e["reviewed_by"] = status, reviewer
        e["reviewed_at"] = dt.datetime.now(dt.timezone.utc).isoformat()
        self.save()
        return e

    def remove(self, digest_prefix: str) -> None:
        matches = [k for k in self.data["samples"] if k.startswith(digest_prefix)]
        for k in matches:
            (self.dir / self.data["samples"][k]["file"]).unlink(missing_ok=True)
            del self.data["samples"][k]
        self.save()

    def approved(self) -> list[dict]:
        return [e for e in self.data["samples"].values() if e["status"] == "approved"]

    def approved_paths(self) -> list[Path]:
        return [self.dir / e["file"] for e in self.approved()]

    def summary(self) -> dict:
        ap = self.approved()
        return {"total": len(self.data["samples"]), "approved": len(ap),
                "approved_minutes": round(sum(e["qa"]["duration"] for e in ap) / 60, 1)}
