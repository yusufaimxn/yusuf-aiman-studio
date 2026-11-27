"""Sound design for internet-hilang, placed on word/scene times from timing.json.
SFX = (time, file, volume, duration|None). BEDS = (start, duration, file, volume): the rising hum and the sea rumble.
hum/underwater/tick/splash are generated with FFmpeg (ours); the rest are Pixabay (see CREDITS)."""
import json
from pathlib import Path
EP = Path(__file__).resolve().parents[1]
T = json.load(open(EP / "timing.json"))
S = {s["id"]: s["start"] for s in T["scenes"]}
def W(n, w):
    for x in T["lines"][n - 1]["words"]:
        if x["text"].lower().startswith(w.lower()): return x["start"]
    raise KeyError((n, w))

SFX = []
def add(t, f, v, d=None): SFX.append((round(t, 2), f, v, d))
# hook: wifi dies
add(0.05, "error", 0.30); add(W(1, "hilang"), "glitch-1", 0.28, 0.5); add(W(1, "QR"), "error", 0.18)
add(W(2, "Cuba"), "riser", 0.2, 2.2); add(W(2, "dari") - 0.2, "whoosh-cinematic", 0.32); add(W(2, "bumi"), "impact-bass-1", 0.35)
# scene cuts A<->B get a whoosh
for sid in ("minit", "tidur", "jam", "dompet", "fakta", "telegram", "sehari", "bandar", "awan", "kabel", "jerung", "sauh", "akhir"):
    add(S[sid] - 0.15, "whoosh-short", 0.26)
# counter jumps
for t in (S["minit"], S["jam"], S["fakta"], S["sehari"], W(10, "Sehari"), W(11, "Seminggu")):
    add(t + 0.05, "tick", 0.5); add(t + 0.15, "tick", 0.45); add(t + 0.25, "impact-bass-1", 0.22)
# minit: bubbles pop grey and fall, clocks appear
for i in range(7): add(W(3, "senyap") + i * 0.18, "pop", 0.2)
add(W(3, "notification"), "notification", 0.12)
for i in range(4): add(W(3, "ikon") + i * 0.24, "click-soft", 0.22)
add(S["tidur"] + 0.6, "sparkle", 0.12)
# jam: card terminal fails, cash sign
add(W(5, "QR"), "error", 0.25); add(W(5, "kad"), "error", 0.25); add(W(5, "cash") - 0.1, "pop", 0.35); add(W(5, "cash"), "chime", 0.18)
for i in range(4): add(S["jam"] + 1.0 + i * 0.5, "key-press", 0.12)
# dompet: coins
for i in range(3): add(W(6, "tiga") + i * 0.22, "ping", 0.2)
# fakta: three numbers land
add(W(7, "pernah"), "impact-bass-1", 0.35); add(W(7, "2021"), "pop", 0.35); add(W(7, "enam"), "pop", 0.35); add(W(7, "Tiga"), "impact-bass-1", 0.4)
# telegram: crowd whooshes, counter climbing
for i in range(6): add(W(8, "tujuh") + i * 0.45, "whoosh-short", 0.12)
add(W(8, "Telegram!"), "sparkle", 0.22)
# bandar / pasar raya
add(W(10, "flight"), "error", 0.2); add(W(10, "barang"), "error", 0.18); add(W(10, "slow"), "impact-bass-1", 0.25)
add(W(11, "Lori"), "ring", 0.12, 0.8)
for i in range(6): add(W(11, "Rak") + i * 0.22, "pop", 0.14)
# kabel: splash into the sea, the reveal, hose pop
add(S["kabel"] + 0.05, "whoosh-cinematic", 0.32); add(W(13, "Lebih"), "riser", 0.2, 1.4); add(W(13, "sembilan"), "impact-bass-1", 0.42)
add(W(13, "hos") - 0.15, "pop", 0.4)
# sauh: shark, zero, ship, anchor, break, blackout
add(W(15, "kosong"), "ping", 0.3); add(W(15, "Yang") - 0.6, "whoosh", 0.22); add(W(15, "sauh") - 0.3, "whoosh-cinematic", 0.3)
add(W(15, "sauh") + 0.9, "impact-bass-1", 0.35); add(W(15, "nelayan") + 0.35, "glitch-1", 0.35, 0.8); add(W(15, "nelayan") + 0.4, "impact-bass-1", 0.45)
for i in range(5): add(W(15, "terputus") - 0.1 + i * 0.12, "click", 0.18)
# akhir
add(W(16, "Follow"), "notification", 0.25); add(W(16, "Part"), "sparkle", 0.25)

TOTAL = T["total"]
BEDS = [  # rising hum through the escalation, rumble under the sea
    (S["minit"] - 0.2, 26.0, "hum", 0.10),
    (S["fakta"] - 0.2, 21.0, "hum", 0.15),
    (S["bandar"] - 0.2, 19.0, "hum", 0.22),
    (S["kabel"], S["jerung"] - S["kabel"], "underwater", 0.35),
    (S["sauh"], S["akhir"] - S["sauh"], "underwater", 0.38),
]
