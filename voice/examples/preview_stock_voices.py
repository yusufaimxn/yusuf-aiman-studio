"""Generate short Malay/English preview clips of ElevenLabs stock voices.

Used to pick by ear a stock voice for Yusuf (calm, confident host) and for
Aiman (curious, energetic sidekick). No cloning. Each clip is one short line,
so a full run costs only a few hundred credits.

    python3 voice/examples/preview_stock_voices.py --list          # free: list voices
    python3 voice/examples/preview_stock_voices.py --out DIR       # generate clips
    python3 voice/examples/preview_stock_voices.py --out DIR --yusuf ID1,ID2 --aiman ID3

Auth: sends the key from ELEVENLABS_API_KEY in the xi-api-key header (the
network proxy may replace it).
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys
import urllib.error
import urllib.request
from pathlib import Path

API = os.environ.get("ELEVENLABS_API_BASE", "https://api.elevenlabs.io")
MODEL = "eleven_multilingual_v2"

LINES = {
    "yusuf": ("Assalamualaikum semua. Hari ini kita nak faham macam mana AI "
              "sebenarnya belajar. Jom, kita mulakan."),
    "aiman": ("Eh, Abang Yusuf! Serius ke AI boleh belajar sendiri? "
              "Macam magic la pulak. Cepat, explain kat saya!"),
}
SETTINGS = {
    "yusuf": {"stability": 0.55, "similarity_boost": 0.75, "style": 0.1, "use_speaker_boost": True},
    "aiman": {"stability": 0.4, "similarity_boost": 0.75, "style": 0.25, "use_speaker_boost": True},
}
# Words in a voice's labels/description that suit each role.
HINTS = {
    "yusuf": ["calm", "confident", "warm", "deep", "narrat", "middle", "professional", "smooth"],
    "aiman": ["young", "energetic", "excited", "upbeat", "playful", "friendly", "casual", "cheer"],
}


def call(method: str, path: str, body: dict | None = None) -> bytes:
    req = urllib.request.Request(API + path, method=method,
                                 data=json.dumps(body).encode() if body else None)
    req.add_header("xi-api-key", os.environ.get("ELEVENLABS_API_KEY", "placeholder"))
    if body:
        req.add_header("Content-Type", "application/json")
    try:
        with urllib.request.urlopen(req, timeout=120) as r:
            return r.read()
    except urllib.error.HTTPError as e:
        sys.exit(f"ElevenLabs {e.code}: {e.read().decode(errors='replace')[:400]}")


def voices() -> list[dict]:
    return json.loads(call("GET", "/v2/voices?page_size=100&voice_type=default")).get("voices", [])


def text_of(v: dict) -> str:
    return (json.dumps(v.get("labels") or {}) + " " + (v.get("description") or "")).lower()


def pick(vs: list[dict], role: str, n: int) -> list[dict]:
    male = [v for v in vs if (v.get("labels") or {}).get("gender") == "male"]
    if role == "aiman":
        young = [v for v in male if "young" in text_of(v)]
        male = young + [v for v in male if v not in young]
    scored = sorted(male, key=lambda v: -sum(h in text_of(v) for h in HINTS[role]))
    return scored[:n]


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--list", action="store_true")
    ap.add_argument("--out", type=Path)
    ap.add_argument("--n", type=int, default=3)
    ap.add_argument("--yusuf", default="")
    ap.add_argument("--aiman", default="")
    a = ap.parse_args()

    # --yusuf/--aiman accept "Name:voice_id" pairs, which skips the voice
    # listing (a key without voices_read permission can still do TTS).
    explicit = {r: [x.split(":", 1) for x in getattr(a, r).split(",") if ":" in x]
                for r in ("yusuf", "aiman")}
    vs = [] if any(explicit.values()) and not a.list else voices()
    if a.list or not a.out:
        for v in vs:
            print(v["voice_id"], v["name"], json.dumps(v.get("labels")), (v.get("description") or "")[:80])
        return

    by_id = {v["voice_id"]: v for v in vs}
    a.out.mkdir(parents=True, exist_ok=True)
    manifest = []
    used: set[str] = set()
    for role in ("yusuf", "aiman"):
        ids = [i for i in getattr(a, role).split(",") if i and ":" not in i]
        chosen = [{"name": n, "voice_id": i} for n, i in explicit[role]] or \
            [by_id[i] for i in ids if i in by_id] or [
            v for v in pick([v for v in vs if v["voice_id"] not in used], role, a.n)]
        for k, v in enumerate(chosen, 1):
            used.add(v["voice_id"])
            audio = call("POST", f"/v1/text-to-speech/{v['voice_id']}?output_format=mp3_44100_128",
                         {"text": LINES[role], "model_id": MODEL,
                          "voice_settings": SETTINGS[role]})
            name = re.sub(r"[^a-z0-9]+", "-", v["name"].lower()).strip("-")
            f = a.out / f"{role}-{k}-{name}.mp3"
            f.write_bytes(audio)
            manifest.append({"role": role, "file": f.name, "voice_id": v["voice_id"],
                             "voice_name": v["name"], "labels": v.get("labels"),
                             "model": MODEL, "chars": len(LINES[role]), "text": LINES[role]})
            print("wrote", f)
    (a.out / "manifest.json").write_text(json.dumps(manifest, indent=2, ensure_ascii=False))
    print("credits used about", sum(m["chars"] for m in manifest))


if __name__ == "__main__":
    main()
