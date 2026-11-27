"""Sound design for apps-hilang, placed on word/scene times from timing.json.
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
# hook: morning alarm, icons pop off the glass and whoosh away
add(0.0, "ring", 0.16, 0.9)
for i in range(11): add(0.2 + i * 0.17, "pop", 0.16 if i % 2 else 0.2)
add(0.3, "whoosh", 0.22); add(1.3, "whoosh", 0.18); add(W(1, "apps"), "impact-bass-1", 0.3)
# scene cuts
street = L[3]["speech_end"] + 0.35; city = W(4, "satu") - 0.45
for t in (S["setup"], S["trigger"], street, S["hidup"], S["os"], S["server"], S["balik"], S["akhir"]):
    add(t - 0.15, "whoosh-short", 0.24)
# setup: empty screen
add(W(2, "hilang"), "glitch-1", 0.22, 0.5)
# trigger: tap -> error x3, everything gone
for w in ("chat", "bayar", "jalan"):
    add(W(3, w) - 0.05, "click-soft", 0.3); add(W(3, w) + 0.3, "error", 0.22)
add(W(3, "Semua"), "glitch-1", 0.2, 0.6); add(W(3, "Kosong"), "impact-bass-1", 0.35)
# street (no voice): confused people, a car that never moves
for i in range(4): add(street + 0.3 + i * 0.56, "pop", 0.14)
add(street + 1.2, "error", 0.14); add(street + 2.4, "notification", 0.1)
# city: thousands of icons fly up
add(city - 0.2, "riser", 0.22, 1.6); add(W(4, "Dan"), "whoosh-cinematic", 0.3); add(W(4, "bandar"), "impact-bass-1", 0.4)
# hidup: still alive
add(W(5, "hidup") - 0.1, "ping", 0.3); add(W(5, "hidup") + 0.6, "chime", 0.16)
# OS: layers separate, shops pop, foundation lights up
add(S["os"] + 0.1, "whoosh", 0.22)
for i in range(6): add(W(6, "kedai") - 0.15 + i * 0.1, "pop", 0.16)
add(W(6, "OS") - 0.3, "whoosh-short", 0.22); add(W(6, "OS"), "impact-bass-1", 0.38); add(W(6, "tapak"), "ping", 0.22)
# server: data stream, coin + account, server lights
add(S["server"] + 0.2, "typing", 0.08, 1.5)
add(W(7, "Duit"), "chime", 0.2); add(W(7, "akaun"), "pop", 0.25); add(W(7, "Semua") - 0.1, "whoosh", 0.22); add(W(7, "server"), "sparkle", 0.25)
# balik: icons fly back in
for i in range(12): add(S["balik"] + 0.5 + i * 0.36, "pop", 0.13)
add(W(9, "Ha"), "sparkle", 0.25)
# ending
add(S["akhir"] + 0.25, "notification", 0.22); add(L[10]["speech_end"] - 1.2, "click", 0.2)

TOTAL = T["total"]
BEDS = [  # soft hum under the world-ending part, quieter under the explanation
    (S["setup"], street - S["setup"] + 0.3, "hum", 0.08),
    (street, S["hidup"] - street, "hum", 0.14),
    (S["os"], S["balik"] - S["os"], "hum", 0.06),
]
