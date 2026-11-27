"""Run QC on rendered MP4s (ffprobe, blackdetect/freezedetect, loudness, voice sync) and extract review frames.
Usage: python3 tools/qc.py <mp4> <out_dir>"""
import json, re, subprocess, sys
from pathlib import Path
EP = Path(__file__).resolve().parents[1]
T = json.load(open(EP / "timing.json"))
mp4, out = Path(sys.argv[1]), Path(sys.argv[2]); out.mkdir(parents=True, exist_ok=True)
res = {"file": mp4.name}
pr = json.loads(subprocess.check_output(["ffprobe", "-v", "error", "-show_streams", "-show_format", "-of", "json", str(mp4)]))
v = [s for s in pr["streams"] if s["codec_type"] == "video"][0]; a = [s for s in pr["streams"] if s["codec_type"] == "audio"]
res.update(codec=v["codec_name"], size=f'{v["width"]}x{v["height"]}', fps=v["r_frame_rate"], duration=float(pr["format"]["duration"]),
           audio=(a[0]["codec_name"] + f' {a[0]["sample_rate"]} Hz') if a else None, pix_fmt=v.get("pix_fmt"))
res["duration_ok"] = abs(res["duration"] - T["total"]) <= 0.1
err = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(mp4), "-vf", "blackdetect=d=0.2:pix_th=0.05,freezedetect=n=0.001:d=2", "-an", "-f", "null", "-"], capture_output=True, text=True).stderr
res["black"] = re.findall(r"black_start:([\d.]+) black_end:([\d.]+)", err)
res["freeze"] = re.findall(r"freeze_start: ([\d.]+)", err)
err = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(mp4), "-af", "ebur128=peak=true", "-f", "null", "-"], capture_output=True, text=True).stderr
summ = err[err.rfind("Summary:"):]
res["lufs"] = float(re.search(r"I:\s+(-?[\d.]+) LUFS", summ).group(1)); res["true_peak_dbtp"] = float(re.search(r"Peak:\s+(-?[\d.]+) dBFS", summ).group(1))
# voice sync: speech onsets in the render vs planned line starts (silence detect on the mix)
err = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(mp4), "-af", "silencedetect=noise=-38dB:d=0.25", "-vn", "-f", "null", "-"], capture_output=True, text=True).stderr
ends = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", err)]
sync = []
for l in T["lines"]:
    near = min(ends, key=lambda e: abs(e - l["speech_start"])) if ends else None
    sync.append((l["n"], l["speech_start"], near, None if near is None else round(near - l["speech_start"], 3)))
res["sync"] = sync
# review frames: first, each scene midpoint, last
times = [0.0] + [round(s["start"] + s["duration"] / 2, 2) for s in T["scenes"]] + [round(T["total"] - 0.1, 2)]
for t in times:
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(t), "-i", str(mp4), "-frames:v", "1", str(out / f"{mp4.stem}_t{t:05.2f}.png")])
res["frames"] = [f"{mp4.stem}_t{t:05.2f}.png" for t in times]
json.dump(res, open(out / f"{mp4.stem}_qc.json", "w"), indent=1)
print(json.dumps({k: v for k, v in res.items() if k != "sync"}, indent=1)); print("sync (line, planned, measured onset, delta):"); [print(" ", s) for s in sync]
