"""Sound design for data-hilang, placed on word/scene times from timing.json.
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
def Wn(n, w, k):
    return [x["start"] for x in L[n]["words"] if x["text"].lower().startswith(w.lower())][k]
cuts = [W(1, "gambar") - 0.1, W(1, "video") - 0.1, W(1, "database") - 0.1, W(1, "tiba") - 0.1, S["gallery"], W(2, "Chat") - 0.1, W(2, "semua") - 0.1, S["hospital"], W(3, "rekod") - 0.1,
        S["flight"], W(4, "Sistem") - 0.1, S["seram"], S["vault"], W(6, "peti") - 0.1, W(6, "Sebenarnya") - 0.1, W(6, "nombor") - 0.1, S["padam"], S["dc"], W(8, "Berderet") - 0.1, W(8, "hard") - 0.1,
        S["backup"], W(9, "satu") - 0.1, W(9, "backup") - 0.1, S["selamat"], S["akhir"]]
for i, t in enumerate(cuts): add(t - 0.12, "whoosh-short" if i % 2 else "whoosh", 0.15 if i % 2 else 0.12)
# hook: data blocks pop, then everything dissolves
add(0.0, "whoosh-cinematic", 0.28); add(0.3, "beep", 0.1)
for w in ("gambar", "video", "database"): add(W(1, w) - 0.05, "pop", 0.24)
add(W(1, "tiba") - 0.1, "riser", 0.2, 1.2)
for i in range(10): add(W(1, "tiba") + 0.15 + i * 0.14, "glitch-1" if i % 3 == 0 else "tick", 0.14 if i % 3 == 0 else 0.18, 0.3)
add(W(1, "kosong"), "impact-bass-1", 0.55); add(W(1, "kosong") + 0.02, "powerdown", 0.3)
# gallery: photos wiped, chats wiped
add(S["gallery"] + 0.15, "click-soft", 0.3)
add(W(2, "kosong") - 0.2, "shatter", 0.22); add(W(2, "kosong"), "error", 0.22)
for i in range(5): add(W(2, "Chat") + 0.05 + i * 0.12, "pop", 0.16)
add(Wn(2, "kosong", 1) - 0.1, "glitch-1", 0.3, 0.5)
add(W(2, "hilang") - 0.1, "pop", 0.2)
# hospital
add(W(3, "rekod") + 0.1, "ratchet", 0.22); add(W(3, "kosong") - 0.3, "glitch-1", 0.22, 0.4); add(W(3, "kosong"), "error", 0.25); add(W(3, "kosong") + 0.25, "pop", 0.16)
# airport: beep ok... then refused
add(S["flight"] + 0.3, "beep", 0.12); add(W(4, "tak"), "buzz", 0.32, 0.7); add(W(4, "tak") + 0.05, "error", 0.22); add(W(4, "tak") + 0.4, "pop", 0.16)
# seram: dark, heartbeat thuds
add(S["seram"] + 0.05, "whoosh-cinematic", 0.22)
for i in range(3): add(W(5, "seram") + i * 0.55, "thud", 0.35)
add(W(5, "bank"), "impact-bass-1", 0.4)
# vault: wheel ratchet, door opens, cash becomes data and flies in
add(W(6, "peti"), "ratchet", 0.3); add(W(6, "ke?"), "thud", 0.45); add(W(6, "ke?") + 0.05, "whirr", 0.2, 0.8); add(W(6, "ke?") + 0.1, "pop", 0.16)
add(W(6, "Sebenarnya"), "sparkle", 0.22)
for i in range(6): add(W(6, "tidak") + i * 0.24, "whoosh-short", 0.08)
add(W(6, "nombor") - 0.05, "typing", 0.1, 1.2); add(W(6, "database"), "chime", 0.2)
# padam: glitch, wipe, alarm
add(W(7, "hilang") - 0.05, "glitch-1", 0.32, 0.7); add(W(7, "hilang") + 0.1, "shatter", 0.2)
add(Wn(7, "hilang", 1) - 0.05, "impact-bass-1", 0.55); add(Wn(7, "hilang", 1), "powerdown", 0.3); add(Wn(7, "hilang", 1) + 0.1, "alarm", 0.14, 1.2)
# data centre + disk
add(S["dc"] + 0.1, "beep", 0.12); add(W(8, "Berderet"), "whoosh", 0.14)
add(W(8, "hard"), "whirr", 0.22, 2.2); add(W(8, "simpan") - 0.05, "typing", 0.1, 0.8)
add(W(8, "kosong"), "impact-bass-1", 0.45); add(W(8, "satu"), "impact-bass-1", 0.5); add(W(8, "satu") + 0.05, "sparkle", 0.2)
# backup: one copy pulses, then copies fly to every site
for i in range(3): add(W(9, "satu") + i * 0.35, "tick", 0.22)
add(W(9, "backup") - 0.8, "riser", 0.18, 1.3)
for k in range(6): add(W(9, "backup") + 0.2 + k * 0.28, "ping", 0.14)
add(W(9, "banyak"), "chime", 0.18)
# selamat: one site blows, the others are still there
add(W(10, "rosak"), "impact-bass-1", 0.5); add(W(10, "rosak") + 0.02, "shatter", 0.22); add(W(10, "rosak") + 0.05, "alarm", 0.12, 1.0)
for k in range(5): add(W(10, "masih") + 0.1 + k * 0.07, "pop", 0.14)
add(W(10, "ada") + 0.1, "chime", 0.22)
# akhir: data city rebuilds, CTA
add(S["akhir"] + 0.25, "sparkle", 0.2); add(S["akhir"] + 0.3, "riser", 0.12, 1.2)
add(W(11, "Data") - 0.1, "notification", 0.2); add(W(11, "Komen"), "pop", 0.2); add(L[11]["speech_end"] - 0.4, "click", 0.2)

TOTAL = T["total"]
BEDS = [(0.0, S["gallery"], "hum", 0.08), (S["seram"], S["dc"] - S["seram"], "hum", 0.1), (S["dc"], S["akhir"] - S["dc"], "hum", 0.07)]
