"""Sound design for bahasa-sama, placed on word/scene times from timing.json.
SFX = (time, file, volume, duration|None). BEDS = (start, duration, file, volume).
hum/tick/powerdown/buzz/beep/shatter/sizzle/alarm/thud/whirr/ratchet are generated with FFmpeg (ours); the rest are Pixabay."""
import json
from pathlib import Path
EP = Path(__file__).resolve().parents[1]
T = json.load(open(EP / "timing.json"))
S = {s["id"]: s["start"] for s in T["scenes"]}
L = {l["n"]: l for l in T["lines"]}
def W(n, w):
    for x in L[n]["words"]:
        if x["text"].lower().startswith(w.lower()): return x["start"]
    raise KeyError((n, w))
LAST = lambda n: L[n]["words"][-1]["start"]

SFX = []
def add(t, f, v, d=None): SFX.append((round(max(0, t), 2), f, v, d))
cuts = [W(1, "Python") - 0.1, W(1, "Java") - 0.08, W(1, "C++") - 0.08, W(1, "JavaScript") - 0.08, W(1, "jadi") - 0.1, S["best"], W(2, "sebab") - 0.1, S["belajar"],
        S["tunggu"], S["senang"], W(5, "game") - 0.1, W(5, "phone") - 0.1, S["laju"], W(6, "code") - 0.1, W(6, "Student") - 0.1, S["bug"], W(7, "seluruh") - 0.1,
        S["toolbox"], W(8, "Macam") - 0.1, W(8, "Tukul") - 0.1, W(8, "screwdriver") - 0.1, S["mesin"], W(9, "satu") - 0.1, W(9, "Kosong") - 0.25, S["terjemah"],
        W(10, "Kita") - 0.1, S["akhir"]]
for i, t in enumerate(cuts): add(t - 0.12, "whoosh-short" if i % 2 else "whoosh", 0.15 if i % 2 else 0.12)
# hook: each language name pops, then they merge
add(0.0, "whoosh-cinematic", 0.28)
for w in ("Python", "Java", "C++", "JavaScript"): add(W(1, w), "pop", 0.24)
add(W(1, "satu") - 0.1, "riser", 0.2, 1.0); add(W(1, "bahasa"), "impact-bass-1", 0.5); add(W(1, "bahasa") + 0.05, "sparkle", 0.22)
add(W(1, "je"), "pop", 0.2)
# best: code bubbles + ticks
for i in range(6): add(W(2, "sebab") - 0.3 + i * 0.4, "whoosh-short", 0.08)
for i in range(6): add(W(2, "faham") + i * 0.14, "pop", 0.14)
add(W(2, "faham") + 0.9, "chime", 0.18)
# belajar: creations pop
for w in ("bahasa", "terus", "buat", "semua"): add(W(3, w), "pop", 0.24)
# tunggu: scale wobble
for i in range(4): add(S["tunggu"] + 0.3 + i * 1.05, "tick", 0.28)
add(W(4, "jap"), "pop", 0.2); add(W(4, "laju"), "riser", 0.16, 0.8)
# senang: tip, lag, hot phone
add(S["senang"] + 0.25, "thud", 0.45)
add(W(5, "lag"), "glitch-1", 0.3, 0.6); add(W(5, "lag") + 0.4, "glitch-1", 0.2, 0.4)
add(W(5, "phone") - 0.05, "sizzle", 0.22, 1.6); add(W(5, "panas"), "alarm", 0.16, 1.2)
# laju: tip, tangled code, student pening
add(S["laju"] + 0.25, "thud", 0.45)
add(W(6, "code") + 0.1, "whoosh", 0.16); add(W(6, "susah"), "glitch-1", 0.18, 0.5)
add(W(6, "pening") - 0.2, "pop", 0.2)
# bug: crawling ticks, then everything goes red
for i in range(6): add(S["bug"] + 0.1 + i * 0.22, "tick", 0.2)
add(W(7, "tu"), "glitch-1", 0.3, 0.6); add(W(7, "tu") + 0.05, "error", 0.25)
add(W(7, "seluruh"), "riser", 0.2, 1.6); add(W(7, "seluruh") + 0.3, "alarm", 0.14, 1.5)
add(W(7, "terkesan"), "impact-bass-1", 0.55); add(W(7, "terkesan") + 0.05, "shatter", 0.25)
# toolbox
add(S["toolbox"] + 0.35, "click", 0.35)
for i in range(4): add(S["toolbox"] + 0.7 + i * 0.28, "whoosh-short", 0.12)
add(W(8, "berbeza"), "chime", 0.16)
for t in (W(8, "untuk"), W(8, "paku"), W(8, "paku") + 0.4): add(t, "thud", 0.5)
add(W(8, "screwdriver"), "ratchet", 0.3); add(W(8, "skru"), "ratchet", 0.3)
# mesin: data flow, dive, 0 and 1 slam
add(S["mesin"] + 0.1, "beep", 0.12); add(S["mesin"] + 0.6, "typing", 0.1, 1.6)
add(W(9, "satu") - 0.15, "whoosh-cinematic", 0.28)
add(W(9, "Kosong") + 0.25, "impact-bass-1", 0.5); add(LAST(9) + 0.25, "impact-bass-1", 0.5); add(LAST(9) + 0.3, "sparkle", 0.2)
# terjemah: languages drop in, bits out
for i in range(4): add(S["terjemah"] + 0.4 + i * 0.5 + 0.85, "pop", 0.2)
add(S["terjemah"] + 1.2, "whirr", 0.22, 2.5)
add(W(10, "Kita"), "typing", 0.12, 0.8); add(W(10, "komputer") - 0.1, "chime", 0.24); add(W(10, "komputer"), "ping", 0.2)
# akhir
add(W(11, "Korang") - 0.1, "notification", 0.2); add(W(11, "Komen"), "pop", 0.2); add(L[11]["speech_end"] - 0.4, "click", 0.2)

TOTAL = T["total"]
BEDS = [(0.0, S["best"], "hum", 0.08), (S["bug"], S["toolbox"] - S["bug"], "hum", 0.1), (S["mesin"], S["akhir"] - S["mesin"], "hum", 0.08)]
