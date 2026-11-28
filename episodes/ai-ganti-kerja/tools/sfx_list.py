"""Sound design for ai-ganti-kerja, placed on word/scene times from timing.json.
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
cuts = [S["hook"], W(3, "Email") - 0.1, W(3, "Report") - 0.1, W(3, "Design") - 0.1, W(3, "Korang") - 0.1, S["domino"], W(4, "Kilang") - 0.1, W(4, "kedai") - 0.1, W(4, "bank") - 0.1,
        W(4, "semua") - 0.1, S["untung"], W(5, "sebab") - 0.1, S["soalan"], W(6, "siapa") - 0.1, S["sunyi"], W(7, "Barang") - 0.1, W(7, "Duit") - 0.1, S["ragu"], S["twist"], W(9, "tugas") - 0.1,
        W(9, "Sebab") - 0.1, S["manusia"], W(10, "salah") - 0.1, W(10, "keputusan") - 0.1, W(10, "perasaan") - 0.1, W(10, "bertanggungjawab") - 0.1, W(10, "Jadi") - 0.1, S["berubah"], W(11, "Dan") - 0.1, S["akhir"]]
for i, t in enumerate(cuts): add(t - 0.12, "whoosh-short" if i % 2 else "whoosh", 0.15 if i % 2 else 0.12)
# title + hook: AI core hums on, screens wake up
add(0.0, "whoosh-cinematic", 0.28); add(0.25, "beep", 0.12); add(W(1, "AI") - 0.05, "sparkle", 0.22); add(W(1, "Manusia") , "impact-bass-1", 0.4)
add(S["hook"] + 0.5, "typing", 0.12, 2.6); add(W(2, "AI."), "glitch-1", 0.3, 0.5); add(W(2, "AI.") + 0.02, "impact-bass-1", 0.45)
# siap: mails whoosh out, paper stack, design pops, "?"
for i in range(8): add(W(3, "Email") + 0.05 + i * 0.16, "whoosh-short", 0.08)
add(W(3, "balas"), "notification", 0.16)
for i in range(6): add(W(3, "Report") + i * 0.07, "click-soft", 0.18)
add(W(3, "siap"), "chime", 0.16); add(W(3, "Design"), "pop", 0.24); add(W(3, "Korang") + 0.25, "pop", 0.2)
# domino: desks flip like dominoes, then factory / shop / bank / city wave
for i in range(12): add(S["domino"] + 0.15 + i * 0.13, "tick", 0.16)
add(W(4, "Kilang"), "whirr", 0.25, 1.0); add(W(4, "Kilang") + 0.1, "ratchet", 0.2)
add(W(4, "kedai"), "beep", 0.18); add(W(4, "kedai") + 0.15, "ping", 0.14)
add(W(4, "bank"), "click", 0.25)
add(W(4, "semua") - 0.4, "riser", 0.2, 1.0); add(W(4, "semua") + 0.05, "whoosh-cinematic", 0.25); add(W(4, "sendiri"), "impact-bass-1", 0.5)
# untung: bars grow, payslips shatter
for i in range(5): add(W(5, "untung") - 0.3 + i * 0.12, "pop", 0.16)
add(W(5, "untung") + 0.2, "chime", 0.2); add(W(5, "gaji") - 0.1, "shatter", 0.28); add(W(5, "gaji"), "impact-bass-1", 0.45)
# soalan: quiet, wallets, giant ?
add(W(6, "tunggu"), "thud", 0.3); add(W(6, "takde"), "pop", 0.18)
add(W(6, "siapa") - 0.2, "whoosh-cinematic", 0.22); add(W(6, "beli") + 0.2, "impact-bass-1", 0.55); add(W(6, "beli") + 0.22, "thud", 0.4)
# sunyi: lights die, boxes thud, coins race, stop, break
add(S["sunyi"] + 0.1, "powerdown", 0.3)
for i in range(8): add(W(7, "Barang") + 0.1 + i * 0.12, "thud", 0.16)
add(W(7, "Duit") - 0.05, "whirr", 0.2, 1.4)
for i in range(5): add(W(7, "Duit") + i * 0.22, "tick", 0.16)
add(W(7, "berhenti"), "powerdown", 0.25); add(W(7, "berpusing"), "impact-bass-1", 0.55); add(W(7, "berpusing") + 0.03, "shatter", 0.3); add(W(7, "berpusing") + 0.1, "alarm", 0.12, 1.0)
# ragu + twist: card shatters into tasks, robot ticks them off
add(S["ragu"] + 0.1, "hum", 0.08, 3.5); add(W(8, "ke?"), "pop", 0.2)
add(W(9, "tak.") - 0.9, "riser", 0.16, 1.0); add(W(9, "tak."), "impact-bass-1", 0.6); add(W(9, "tak.") + 0.02, "shatter", 0.26)
for i in range(6): add(W(9, "tak.") + 0.08 + i * 0.06, "pop", 0.14)
for i in range(6): add(W(9, "Sebab") + i * 0.12, "whoosh-short", 0.08)
add(W(9, "Sebab") + 0.7, "typing", 0.12, 1.0)
for i in range(3): add(W(9, "Sebab") + 1.0 + i * 0.25, "ping", 0.16)
# manusia: wrong answer, check, decide, care, sign
add(W(10, "salah"), "error", 0.28); add(W(10, "check"), "chime", 0.22)
add(W(10, "keputusan") + 0.1, "click", 0.3); add(W(10, "keputusan") + 0.25, "pop", 0.2)
add(W(10, "perasaan") + 0.1, "sparkle", 0.2)
add(W(10, "bertanggungjawab") + 0.1, "key-press", 0.2); add(W(10, "bertanggungjawab") + 1.05, "thud", 0.45)
add(W(10, "Jadi") + 0.5, "riser", 0.14, 1.0)
for i in range(4): add(W(10, "Jadi") + 0.5 + i * 0.25, "ping", 0.14)
# berubah: robots pop in next to people, screens mix, speed
for i in range(12): add(S["berubah"] + 0.3 + i * 0.08, "pop", 0.1)
add(W(11, "berubah") - 0.3, "sparkle", 0.22)
add(W(11, "Dan"), "whoosh", 0.16); add(W(11, "laju") - 0.1, "chime", 0.22)
# akhir
add(S["akhir"] + 0.1, "whoosh-cinematic", 0.2)
add(W(12, "Kerja") - 0.1, "notification", 0.2); add(W(12, "Komen"), "pop", 0.2); add(L[12]["speech_end"] - 0.4, "click", 0.2)

TOTAL = T["total"]
BEDS = [(0.0, S["domino"], "hum", 0.07), (S["soalan"], S["twist"] - S["soalan"], "hum", 0.1), (S["twist"], S["akhir"] - S["twist"], "hum", 0.06)]
