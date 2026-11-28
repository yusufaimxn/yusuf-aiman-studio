"""Build the voice timeline + phrase/word timings from supplied MP3s (audio untouched).
Word timing = estimated: phrases split at detected pauses, words spread by character count."""
import json, re, subprocess, sys
from pathlib import Path
EP = Path(__file__).resolve().parents[1]
SUP = EP / "assets/audio/voice/supplied"
LINES = [l for l in (EP / "script.txt").read_text().splitlines() if re.match(r"^(YUSUF|AIMAN)", l)]
SCENE_OF = {}
scene = None; n = 0
for l in (EP / "script.txt").read_text().splitlines():
    m = re.match(r"^#\s*scene\s+(\S+)", l)
    if m: scene = m.group(1)
    elif re.match(r"^(YUSUF|AIMAN)", l): n += 1; SCENE_OF[n] = scene
GAP = {i: 0.15 for i in range(2, 40)}; GAP.update({4: 0.25, 7: 0.25, 8: 0.3, 9: 0.3, 11: 0.3})
START0 = 0.2

def probe(f):
    d = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(f)]))
    out = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(f), "-af", "silencedetect=noise=-40dB:d=0.12", "-f", "null", "-"], capture_output=True, text=True).stderr
    st = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", out)]
    en = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", out)]
    sil = list(zip(st, en + [d] * (len(st) - len(en))))
    lead = sil[0][1] if sil and sil[0][0] < 0.02 else 0.0
    sil = [s for s in sil if s[0] >= 0.02]
    end = sil[-1][0] if sil and sil[-1][1] >= d - 0.02 else d
    pauses = [s for s in sil if s[1] < d - 0.02]
    return d, lead, end, pauses

lines, t = [], START0
for i, l in enumerate(LINES, 1):
    spk, txt = l.split(":", 1)[0].split()[0], l.split(":", 1)[1].strip()
    d, lead, end, pauses = probe(SUP / f"{i:02d}.mp3")
    if i > 1: t = prev_end + GAP[i]
    start = round(t - lead, 3)  # audio clip start (lead silence kept inside clip)
    # speech segments between pauses
    segs, a = [], lead
    for ps, pe in pauses:
        if ps > a: segs.append((a, ps))
        a = pe
    segs.append((a, end))
    # split text into phrases at punctuation; map phrases to segments (merge/split by count)
    phrases = [p.strip() for p in re.split(r"(?<=[,.!?])\s+", txt) if p.strip()]
    # distribute phrases across segments proportional to char count
    words = txt.split()
    total_chars = sum(len(w) + 1 for w in words)
    speech = [(s, e) for s, e in segs]
    total_sp = sum(e - s for s, e in speech)
    # walk words through speech time by char share, skipping pauses; snap phrase starts to segment starts when counts match
    wt = []
    if len(phrases) == len(speech):
        for ph, (s, e) in zip(phrases, speech):
            pw = ph.split(); pc = sum(len(w) + 1 for w in pw); c = s
            for w in pw:
                dur = (e - s) * (len(w) + 1) / pc; wt.append((w, c, c + dur)); c += dur
    else:
        c_chars = 0
        def at(frac):
            x = frac * total_sp
            for s, e in speech:
                if x <= e - s: return s + x
                x -= e - s
            return speech[-1][1]
        for w in words:
            s0 = at(c_chars / total_chars); c_chars += len(w) + 1; wt.append((w, s0, at(c_chars / total_chars)))
    lines.append(dict(n=i, speaker=spk, scene=SCENE_OF[i], text=txt, file=f"assets/audio/voice/supplied/{i:02d}.mp3",
                      start=start, file_dur=round(d, 3), speech_start=round(start + lead, 3), speech_end=round(start + end, 3),
                      segments_matched=len(phrases) == len(speech),
                      words=[dict(text=w, start=round(start + a, 3), end=round(start + b, 3)) for w, a, b in wt]))
    prev_end = start + end
TOTAL = round(prev_end + 1.9, 2)
scenes = {}
for l in lines:
    s = scenes.setdefault(l["scene"], dict(id=l["scene"], start=l["start"], lines=[]))
    s["lines"].append(l["n"])
ids = list(scenes)
for k, sid in enumerate(ids):
    sc = scenes[sid]
    if k == 0: sc["start"] = 0.0
    else:
        prev = [l for l in lines if l["n"] == scenes[ids[k-1]]["lines"][-1]][0]
        sc["start"] = round((prev["speech_end"] + sc["start"]) / 2, 2) if sc["start"] - prev["speech_end"] > 0 else sc["start"]
for k, sid in enumerate(ids):
    nxt = scenes[ids[k+1]]["start"] if k + 1 < len(ids) else TOTAL
    scenes[sid]["duration"] = round(nxt - scenes[sid]["start"], 2)
json.dump(dict(total=TOTAL, lines=lines, scenes=list(scenes.values())), open(EP / "timing.json", "w"), indent=1, ensure_ascii=False)
print("total", TOTAL)
for s in scenes.values(): print(s)
for l in lines: print(l["n"], l["speaker"], l["start"], l["speech_end"], l["segments_matched"])
