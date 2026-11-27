"""Generate index.html (9:16), landscape.html (16:9) and compositions/captions.html from timing.json.
Scenes in compositions/*.html are hand-written and read times from window.YA_T (absolute seconds)."""
import json, re, html
from pathlib import Path
EP = Path(__file__).resolve().parents[1]
T = json.load(open(EP / "timing.json"))
TOTAL = T["total"]

from sfx_list import SFX, BEDS

def audio_tags():
    out = []
    for l in T["lines"]:
        nxt = [x for x in T["lines"] if x["n"] == l["n"] + 1]
        dur = min(l["file_dur"], round(nxt[0]["start"] - l["start"], 3)) if nxt else l["file_dur"]  # trims trailing silence only
        out.append(f'<audio id="vo{l["n"]:02d}" class="clip" src="{l["file"]}" data-start="{l["start"]}" data-duration="{dur}" data-track-index="10" data-volume="1"></audio>')
    for k, (t, f, v, d) in enumerate(SFX):
        dur = f' data-duration="{d:.2f}"' if d else ""
        lane = 11 + (k % 2)
        out.append(f'<audio id="sfx{k:02d}" class="clip" src="assets/audio/sfx/{f}.mp3" data-start="{t:.2f}"{dur} data-track-index="{lane}" data-volume="{v}"></audio>')
    for k, (t, d, f, v) in enumerate(BEDS):
        out.append(f'<audio id="bed{k:02d}" class="clip" src="assets/audio/sfx/{f}.mp3" data-start="{t:.2f}" data-duration="{d:.2f}" data-track-index="13" data-volume="{v}"></audio>')
    return "\n      ".join(out)

def hosts(w, h):
    rows = []
    for cid, z, kind in (("bg", 1, "graphics"), ("cast", 4, "graphics"), ("hud", 7, "graphics")):
        rows.append(f'<div id="{cid}" data-composition-id="{cid}" data-composition-src="compositions/{cid}.html" data-start="0" data-duration="{TOTAL}" data-track-index="{z}" data-track-kind="{kind}" data-width="{w}" data-height="{h}" style="z-index:{z}"></div>')
    rows.append(f'<div id="iso-wrap" style="position:absolute;inset:0;z-index:3;opacity:0"><canvas id="iso-canvas" class="clip" data-start="0" data-duration="{TOTAL}" data-track-index="5" width="{w}" height="{h}" style="position:absolute;inset:0;width:{w}px;height:{h}px"></canvas></div>')
    rows.append(f'<div id="captions" data-composition-id="captions" data-composition-src="compositions/captions.html" data-start="0" data-duration="{TOTAL}" data-track-index="8" data-track-kind="captions" data-width="{w}" data-height="{h}" style="z-index:8"></div>')
    return "\n      ".join(rows)

def phrase_starts(l):
    ws = l["words"]; out = [ws[0]["start"]]
    for a, b in zip(ws, ws[1:]):
        if b["start"] - a["end"] > 0.15 or re.search(r"[.!?,]$", a["text"]): out.append(b["start"])
    return out
times = {"scenes": {s["id"]: s["start"] for s in T["scenes"]},
         "lines": {l["n"]: [l["speech_start"], l["speech_end"], l["speaker"]] for l in T["lines"]},
         "phr": {l["n"]: phrase_starts(l) for l in T["lines"]},
         "words": {l["n"]: [[w["text"], w["start"]] for w in l["words"]] for l in T["lines"]}, "total": TOTAL}

def index(w, h):
    return f"""<!doctype html>
<html lang="ms">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width={w}, height={h}" />
    <script src="assets/vendor/gsap.min.js"></script>
    <link rel="stylesheet" href="assets/studio.css" />
    <style>html, body {{ width: {w}px; height: {h}px; overflow: hidden; background: #0B1E3F; }}</style>
    <script>window.YA_T = {json.dumps(times)}; window.YA_LAND = {str(w > h).lower()};</script>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="{TOTAL}" data-width="{w}" data-height="{h}" data-fps="30">
      {hosts(w, h)}
      {audio_tags()}
    </div>
    <script>window.__timelines = window.__timelines || {{}}; window.__timelines["main"] = gsap.timeline({{ paused: true }});</script>
    <script type="module" src="assets/iso/iso.js"></script>
  </body>
</html>
"""

# ---- captions --------------------------------------------------------------------------------
KEY = {"apps", "apps?!", "phone", "OS.", "server.", "install", "login,", "app", "app.", "chat?", "bayar?", "jalan?", "komen", "Duit", "akaun"}
WARN = {"hilang.", "Takde.", "takde.", "Kosong.", "bandar.", "kedai."}
NUMS = []

def tokens(ws):
    """merge spelled-out numbers into one display token keeping first..last word timing"""
    out, i = [], 0
    while i < len(ws):
        for spoken, disp in NUMS:
            n = len(spoken.split())
            if " ".join(w["text"] for w in ws[i:i + n]) == spoken:
                out.append(dict(text=disp, start=ws[i]["start"], end=ws[i + n - 1]["end"])); i += n; break
        else:
            out.append(ws[i]); i += 1
    return out

def groups():
    gs = []
    for l in T["lines"]:
        ws = tokens(l["words"]); cur = []
        for i, w in enumerate(ws):
            cur.append(w)
            gap = ws[i + 1]["start"] - w["end"] if i + 1 < len(ws) else 9
            words_n = sum(len(x["text"].split()) for x in cur)
            # words left until the end of this sentence/clause
            rest = 0
            for x in ws[i + 1:]:
                rest += 1
                if re.search(r"[.!?,]$", x["text"]): break
            if re.search(r"[.!?]$", w["text"]) or (re.search(r",$", w["text"]) and words_n >= 2) or words_n >= 5 \
               or (words_n >= 4 and rest >= 2) or (gap > 0.15 and rest != 1):
                gs.append(dict(spk=l["speaker"], words=cur)); cur = []
        if cur: gs.append(dict(spk=l["speaker"], words=cur))
    return [dict(spk=g["spk"], text=" ".join(w["text"] for w in g["words"]), start=g["words"][0]["start"], end=g["words"][-1]["end"]) for g in gs]

def captions(w, h):
    gs = groups()
    items, js = [], []
    for i, g in enumerate(gs):
        st = round(g["start"] - 0.05, 3)
        nxt = gs[i + 1]["start"] - 0.05 if i + 1 < len(gs) else TOTAL
        en = round(min(g["end"] + 0.35, nxt), 3)
        spans = []
        for wd in g["text"].split():
            cls = "w"
            bare = wd
            if wd in WARN: cls += " warn"
            elif wd in KEY or False: cls += " key"
            spans.append(f'<span class="{cls}">{html.escape(wd)}</span>')
        tag = "cap-a" if g["spk"] == "AIMAN" else "cap-y"
        items.append(f'<div id="cap{i:03d}" class="cap {tag} clip" data-start="{st}" data-duration="{round(en - st, 3)}"><div class="cap-in">{" ".join(spans)}</div></div>')
        js.append(f'pop("#cap{i:03d}", {st}, {round(en - st, 3)});')
    return f"""<template>
  <style>
    #root {{ position: absolute; inset: 0; pointer-events: none; }}
  </style>
  <div id="root" data-composition-id="captions" data-width="{w}" data-height="{h}">
    {chr(10).join('    ' + x for x in items)}
  </div>
  <script>
    const tl = gsap.timeline({{ paused: true }});
    function pop(sel, st, d) {{
      const inner = sel + " .cap-in";
      tl.fromTo(inner, {{ opacity: 0, y: 18, scale: 0.92 }}, {{ opacity: 1, y: 0, scale: 1, duration: 0.16, ease: "back.out(2)" }}, st);
      tl.to(inner, {{ opacity: 0, duration: 0.1, ease: "power2.in" }}, st + d - 0.1);
    }}
    {chr(10).join('    ' + x for x in js)}
    window.__timelines["captions"] = tl;
  </script>
</template>
"""

def srt():
    """Cues built from the caption groups (estimated word timing), merged to <= 2 lines of <= 42 chars."""
    def ts(x):
        ms = int(round(x * 1000)); return f"{ms//3600000:02d}:{ms//60000%60:02d}:{ms//1000%60:02d},{ms%1000:03d}"
    def wrap(t):
        lines, line = [], ""
        for w in t.split():
            if line and len(line) + len(w) + 1 > 42: lines.append(line); line = w
            else: line = (line + " " + w).strip()
        return lines + [line]
    cues = []
    for g in groups():
        if cues and cues[-1]["spk"] == g["spk"] and g["start"] - cues[-1]["end"] < 0.6 and len(wrap(cues[-1]["text"] + " " + g["text"])) <= 2 \
           and not cues[-1]["text"].endswith(("?", "!", ".")) and g["end"] - cues[-1]["start"] <= 5.5:
            cues[-1]["text"] += " " + g["text"]; cues[-1]["end"] = g["end"]
        else: cues.append(dict(g))
    out = []
    for i, c in enumerate(cues, 1):
        out.append(f"{i}\n{ts(c['start'])} --> {ts(c['end'] + 0.2)}\n" + "\n".join(wrap(c["text"])) + "\n")
    return "\n".join(out)

(EP / "index.html").write_text(index(1080, 1920))
(EP / "compositions/captions.html").write_text(captions(1080, 1920))
(EP / "captions.srt").write_text(srt())
print("caption groups:", len(groups()))
for g in groups(): print(f'{g["start"]:6.2f}-{g["end"]:6.2f} {g["spk"][0]} {g["text"]}')
