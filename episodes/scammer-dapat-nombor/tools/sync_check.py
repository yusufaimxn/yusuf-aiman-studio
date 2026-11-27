"""Measure where each supplied voice line actually sits in a render (cross-correlation), vs the plan."""
import json, subprocess, sys
import numpy as np
from pathlib import Path
EP = Path(__file__).resolve().parents[1]; T = json.load(open(EP / "timing.json")); SR = 8000
def pcm(f): return np.frombuffer(subprocess.check_output(["ffmpeg", "-v", "error", "-i", str(f), "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"]), np.float32)
mix = pcm(sys.argv[1]); worst = 0
for l in T["lines"]:
    v = pcm(EP / l["file"])[: int(SR * 1.5)]
    s0 = int((l["start"] - 0.5) * SR); seg = mix[max(0, s0): s0 + len(v) + SR]
    c = np.correlate(seg, v, "valid"); k = int(np.argmax(c)); at = (max(0, s0) + k) / SR
    d = at - l["start"]; worst = max(worst, abs(d)); print(f"line {l['n']:02d}: planned {l['start']:.3f}s  measured {at:.3f}s  offset {d*1000:+.0f} ms")
print(f"max offset {worst*1000:.0f} ms")
