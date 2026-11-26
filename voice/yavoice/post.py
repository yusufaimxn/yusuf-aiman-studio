"""Audio post-production with FFmpeg.

Two stages, deliberately light so the generated voice keeps its identity:
  1. per-segment cleanup (`segment_chain`): high-pass, optional denoise,
     gentle EQ, de-ess, light compression, fades.
  2. episode master: loudness normalisation of the narration, music ducked
     under the voice with a sidechain compressor, SFX placed by timestamp,
     final limiter and EBU R128 loudness to the preset target.
"""
from __future__ import annotations

import json
from dataclasses import dataclass
from pathlib import Path

from . import ffmpeg

PRESET_DIR = Path(__file__).resolve().parents[1] / "presets"


@dataclass
class Preset:
    name: str
    highpass_hz: int = 70
    denoise: bool = False
    eq: list[dict] | None = None  # [{"f": 3000, "g": 1.5, "w": 1.0}]
    deess: float = 0.0  # 0 disables; 0.1-0.4 gentle
    comp_ratio: float = 2.0
    comp_threshold_db: float = -20.0
    target_lufs: float = -16.0
    true_peak: float = -1.5
    lra: float = 11.0
    music_db: float = -20.0  # music bed level before ducking
    duck_ratio: float = 6.0
    fade_ms: int = 12

    @classmethod
    def load(cls, name: str) -> "Preset":
        return cls(**json.loads((PRESET_DIR / f"{name}.json").read_text()))

    def segment_chain(self, duration: float) -> str:
        f = [f"highpass=f={self.highpass_hz}"]
        if self.denoise:
            f.append("afftdn=nr=10:nf=-50")
        for b in self.eq or []:
            f.append(f"equalizer=f={b['f']}:t=q:w={b.get('w', 1.0)}:g={b['g']}")
        if self.deess:
            f.append(f"deesser=i={self.deess}:m=0.5:f=0.5:s=o")
        if self.comp_ratio > 1:
            f.append(f"acompressor=threshold={self.comp_threshold_db}dB:ratio={self.comp_ratio}:attack=8:release=120:makeup=1")
        fd = self.fade_ms / 1000
        f.append(f"afade=t=in:d={fd}")
        f.append(f"afade=t=out:st={max(0.0, duration - fd):.3f}:d={fd}")
        return ",".join(f)


def process_segment(src: Path, dst: Path, preset: Preset) -> Path:
    dur = ffmpeg.probe(src)["duration"]
    ffmpeg.run([ffmpeg.FFMPEG, "-y", "-hide_banner", "-loglevel", "error", "-i", str(src), "-af",
                preset.segment_chain(dur), "-ar", "48000", "-ac", "1", "-c:a", "pcm_s16le", str(dst)])
    return dst


def loudnorm(src: Path, dst: Path, preset: Preset) -> Path:
    """Two-pass EBU R128 normalisation (measure, then apply linear gain where possible)."""
    m = ffmpeg.loudness(src)
    af = (f"loudnorm=I={preset.target_lufs}:TP={preset.true_peak}:LRA={preset.lra}:"
          f"measured_I={m['lufs']}:measured_TP={m['true_peak']}:measured_LRA={m['lra']}:"
          f"measured_thresh={m['threshold']}:linear=true")
    ffmpeg.run([ffmpeg.FFMPEG, "-y", "-hide_banner", "-loglevel", "error", "-i", str(src), "-af", af,
                "-ar", "48000", "-c:a", "pcm_s16le", str(dst)])
    return dst


def master(voice: Path, dst: Path, preset: Preset, music: Path | None = None,
           sfx: list[tuple[Path, float, float]] | None = None) -> Path:
    """Mix narration + optional music bed (ducked) + SFX [(path, time_s, gain_db)]."""
    inputs = ["-i", str(voice)]
    graph = ["[0:a]aformat=sample_rates=48000:channel_layouts=stereo,asplit=2[v][vkey]"]
    mix = ["[v]"]
    idx = 1
    if music:
        inputs += ["-stream_loop", "-1", "-i", str(music)]
        graph.append(f"[{idx}:a]aformat=sample_rates=48000:channel_layouts=stereo,volume={preset.music_db}dB[m]")
        graph.append(f"[m][vkey]sidechaincompress=threshold=0.03:ratio={preset.duck_ratio}:attack=20:release=400[md]")
        mix.append("[md]")
        idx += 1
    else:
        graph[0] = "[0:a]aformat=sample_rates=48000:channel_layouts=stereo[v]"
    for path, t, gain in sfx or []:
        inputs += ["-i", str(path)]
        ms = int(t * 1000)
        graph.append(f"[{idx}:a]aformat=sample_rates=48000:channel_layouts=stereo,volume={gain}dB,adelay={ms}|{ms}[s{idx}]")
        mix.append(f"[s{idx}]")
        idx += 1
    graph.append(f"{''.join(mix)}amix=inputs={len(mix)}:duration=first:normalize=0,"
                 f"alimiter=limit=0.89[mx]")
    tmp = dst.with_suffix(".premaster.wav")
    ffmpeg.run([ffmpeg.FFMPEG, "-y", "-hide_banner", "-loglevel", "error", *inputs, "-filter_complex",
                ";".join(graph), "-map", "[mx]", "-c:a", "pcm_s16le", str(tmp)])
    loudnorm(tmp, dst, preset)
    tmp.unlink(missing_ok=True)
    return dst
