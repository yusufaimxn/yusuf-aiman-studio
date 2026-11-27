"""Sound design for website-down, placed on word/scene times from timing.json.
SFX = (time, file, volume, duration|None). BEDS = (start, duration, file, volume).
hum/tick are generated with FFmpeg (ours); the rest are Pixabay (see assets/audio/sfx/CREDITS-pixabay.md)."""
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
# hook: wifi ping, then a domino of error pops
add(W(1, "WiFi") - 0.05, "notification", 0.2)
t1 = W(1, "tapi") - 0.25
for i in range(9): add(t1 + i * 0.27, "error" if i % 3 == 0 else "pop", 0.14 if i % 3 else 0.12)
add(L[1]["speech_end"] - 0.1, "impact-bass-1", 0.3)
# cuts
shop = W(3, "shopping") - 0.35; close = W(10, "je") - 0.25
for t in (S["bandar"], S["google"], shop, S["assign"], S["office"], S["apps"], S["tanya"], S["request"], S["biasa"], S["error"], close, S["faham"], S["akhir"]):
    add(t - 0.15, "whoosh-short", 0.22)
# bandar: error spreads across the city
add(W(2, "semua") - 0.3, "riser", 0.2, 1.8); add(W(2, "down"), "impact-bass-1", 0.42); add(W(2, "down") + 0.1, "glitch-1", 0.25, 0.6)
# google + shopping
add(S["google"] + 0.2, "typing", 0.12, 1.2); add(W(3, "Tak"), "error", 0.22)
add(shop + 0.1, "whoosh", 0.16); add(W(3, "Pun"), "error", 0.22); add(W(3, "Pun") + 0.3, "pop", 0.2); add(W(3, "asyik"), "tick", 0.3)
# assignment: clock racing, fail
for i in range(6): add(S["assign"] + 0.2 + i * 0.3, "tick", 0.3)
add(W(4, "tak"), "glitch-1", 0.25, 0.5); add(W(4, "tak") + 0.05, "error", 0.22)
# office
for i in range(4): add(S["office"] + 0.3 + i * 0.3, "whoosh-short", 0.1)
add(W(5, "tak"), "error", 0.2); add(W(5, "meeting"), "click", 0.2); add(W(5, "terputus"), "impact-bass-1", 0.3)
# apps
for i in range(5): add(S["apps"] + 0.25 + i * 0.12, "pop", 0.12)
add(W(6, "down"), "glitch-1", 0.25, 0.6)
add(S["tanya"] + 0.05, "ping", 0.2)
# request journey
add(W(8, "request") - 0.3, "whoosh-cinematic", 0.26); add(W(8, "alamat") + 0.15, "ping", 0.28); add(W(8, "alamat") + 0.35, "chime", 0.14)
add(W(8, "lepas") - 0.2, "whoosh", 0.2)
for i in range(3): add(W(8, "ketuk") + 0.05 + i * 0.3, "click", 0.35)
# biasa: page builds
add(S["biasa"] + 0.3, "pop", 0.22)
for w in ("gambar", "video", "harga", "Semua"): add(W(9, w), "pop", 0.24)
add(W(9, "Semua") + 0.2, "chime", 0.18)
# error
add(S["error"] + 0.3, "whoosh", 0.2); add(S["error"] + 1.5, "tick", 0.3); add(S["error"] + 1.9, "tick", 0.3)
add(W(10, "browser") - 0.2, "whoosh-short", 0.2); add(W(10, "Error") - 0.15, "impact-bass-1", 0.5); add(W(10, "Error") - 0.1, "error", 0.3)
# faham / akhir
add(W(11, "jalan"), "whoosh-short", 0.16); add(W(11, "kedai"), "ping", 0.2)
for i in range(6): add(W(12, "tutup") - 0.6 + i * 0.16, "click-soft", 0.22)
add(W(12, "So"), "notification", 0.2); add(L[12]["speech_end"] - 1.4, "click", 0.2)

TOTAL = T["total"]
BEDS = [(S["bandar"], S["tanya"] - S["bandar"], "hum", 0.1), (S["error"], S["faham"] - S["error"], "hum", 0.12)]
