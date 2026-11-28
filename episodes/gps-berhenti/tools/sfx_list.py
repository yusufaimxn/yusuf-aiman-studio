"""Sound design for gps-berhenti, placed on word/scene times from timing.json.
SFX = (time, file, volume, duration|None). BEDS = (start, duration, file, volume).
hum/tick/powerdown/motor/waves/jet/buzz/beep/horn/shatter are generated with FFmpeg (ours); the rest are Pixabay."""
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

SFX = []
def add(t, f, v, d=None): SFX.append((round(max(0, t), 2), f, v, d))
# camera cuts (same list as hud/iso): alternate whoosh flavours
cuts = [W(1, "Maps") - 0.15, W(1, "tak") - 0.1, W(1, "korang") - 0.1, S["bulatan"], W(2, "tapi") - 0.1, S["rider"], W(3, "sebab") - 0.1, S["grab"], S["laut"],
        W(5, "pilot") - 0.1, W(5, "semua") - 0.1, S["ingat"], S["twist"], W(7, "bukan") - 0.1, S["jam"], S["lari"], W(9, "bank") - 0.1, W(9, "grid") - 0.1,
        W(9, "semua") - 0.15, W(9, "Lama") - 0.1, S["reveal"], W(10, "bukan") - 0.1, W(10, "jam") - 0.3, S["kira"], W(11, "phone") - 0.1, W(11, "kira") - 0.2,
        W(11, "dari") - 0.1, S["akhir"]]
for i, t in enumerate(cuts): add(t - 0.12, "whoosh-short" if i % 2 else "whoosh", 0.16 if i % 2 else 0.13)
# hook: deep space whoosh in, satellite beeps, lock on the dot, then satellites die one by one
add(0.0, "whoosh-cinematic", 0.3); add(0.25, "beep", 0.12); add(W(1, "Maps"), "ping", 0.22)
for i in range(6): add(W(1, "tak") + 0.25 + i * 0.17, "powerdown", 0.22)
add(W(1, "tak") + 0.2, "glitch-1", 0.25, 0.5)
add(W(1, "mana") - 0.15, "pop", 0.24); add(L[1]["speech_end"], "impact-bass-1", 0.32)
# bulatan: circle stretches
add(W(2, "jadi") - 0.2, "riser", 0.18, 1.3); add(W(2, "besar") + 0.25, "impact-bass-1", 0.32); add(W(2, "agak") + 0.2, "pop", 0.2)
# rider + grab
add(S["rider"], "motor", 0.22, 2.5); add(S["rider"] + 2.3, "motor", 0.2, 2.3); add(W(3, "tak"), "error", 0.2); add(W(3, "tak") + 0.05, "pop", 0.2)
add(S["grab"] + 0.1, "motor", 0.14, 1.4); add(W(4, "tunggu"), "horn", 0.2); add(W(4, "simpang"), "pop", 0.2)
add(W(4, "salah") - 0.05, "whoosh-short", 0.2); add(W(4, "salah") + 0.4, "error", 0.22)
# sea + sky + old ways
add(S["laut"], "waves", 0.3, 5.2); add(S["laut"] + 0.4, "tick", 0.25); add(S["laut"] + 0.75, "tick", 0.25)
add(W(5, "pilot") - 0.1, "jet", 0.26, 1.9); add(W(5, "cara") - 0.5, "whoosh", 0.18); add(W(5, "cara") - 0.1, "click", 0.25)
# ingat: calm before the twist
add(S["ingat"] + 0.2, "riser", 0.16, 3.0)
# twist: crash zoom, map shatters, giant clock slams
add(W(7, "Silap") - 0.05, "impact-bass-1", 0.5)
add(W(7, "bukan") + 0.1, "shatter", 0.3); add(W(7, "bukan") + 0.2, "glitch-1", 0.2, 0.5)
add(W(7, "Tapi") - 0.2, "whoosh-cinematic", 0.3); add(W(7, "jam") + 0.05, "impact-bass-1", 0.55)
for i in range(4): add(W(7, "jam") + 0.4 + i * 0.5, "tick", 0.32)
add(S["jam"] + 0.03, "ping", 0.2)
# lari: telco, bank, grid, all in sync... then drifting
add(S["lari"] + 0.2, "beep", 0.15); add(W(9, "bank") + 0.1, "chime", 0.16); add(W(9, "grid"), "buzz", 0.18, 1.2)
add(W(9, "sync"), "ping", 0.24)
for i in range(4): add(W(9, "Lama") + 0.1 + i * 0.5, "tick", 0.3)
for i in range(6): add(W(9, "jam") - 0.3 + i * 0.22, "tick", 0.28)
add(W(9, "lari") - 0.1, "glitch-1", 0.3, 0.6); add(W(9, "lari"), "impact-bass-1", 0.45); add(W(9, "lari") + 0.1, "buzz", 0.16, 1.0)
# reveal: satellite opens, atomic clock shimmers
add(S["reveal"] + 0.1, "whoosh-cinematic", 0.24)
add(W(10, "bukan") + 0.2, "click", 0.25); add(W(10, "bukan") + 0.5, "click", 0.25); add(W(10, "bukan") + 0.8, "whoosh", 0.18)
add(W(10, "jam") - 0.15, "sparkle", 0.26); add(W(10, "tepat") - 0.1, "chime", 0.22)
# kira: time pulses, fronts arriving, lock
for i in range(4): add(S["kira"] + 0.1 + i * 0.55, "beep", 0.1)
for i, w in enumerate(("dengar", "beberapa", "satelit,")): add(W(11, w), "ping", 0.18)
arr0 = W(11, "kira") - 0.2 + 0.5
for i in range(4): add(arr0 + i * 0.32, "pop", 0.22)
add(W(11, "tahu") - 0.05, "impact-bass-1", 0.3); add(W(11, "mana") - 0.1, "chime", 0.24)
# akhir
add(W(12, "Korang") - 0.1, "notification", 0.2); add(W(12, "Komen"), "pop", 0.2); add(L[12]["speech_end"] - 0.4, "click", 0.2)

TOTAL = T["total"]
BEDS = [(0.0, S["rider"], "hum", 0.08), (S["twist"], S["kira"] - S["twist"], "hum", 0.1)]
