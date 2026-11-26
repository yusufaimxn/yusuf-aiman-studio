"""Script parser and segmenter.

Script format (plain text, easy for people and for an LLM to write):

    ---
    title: Apa itu AI?
    language: ms
    ---
    # scene intro | Pembukaan
    YUSUF (friendly): Assalamualaikum semua! Hari ni kita cerita pasal AI.
    AIMAN (curious, speed=1.03): Eh, AI tu sebenarnya apa?
    YUSUF (confident, lang=en, emphasis=pattern): It learns patterns from data.
    > SFX whoosh
    # scene explain | Penerangan
    YUSUF (calm, pause=0.8): Bayangkan macam ni...
      Lines indented under a speaker line continue that line.

Options in brackets: an emotion name, speed=, energy=, pause=, lang=,
emphasis=word|word, note="free text". `> SFX name` places a sound cue after
the previous line. Lines starting with // are comments.
"""
from __future__ import annotations

import hashlib
import re
from dataclasses import dataclass, field

from .delivery import EMOTIONS, Delivery

MAX_SEGMENT_CHARS = 260

_LINE = re.compile(r"^(?P<spk>[A-Z][A-Z0-9_ ]{1,30})\s*(?:\((?P<opts>[^)]*)\))?\s*:\s*(?P<text>.+)$")
_SCENE = re.compile(r"^#\s*scene\s+(?P<id>[\w-]+)\s*(?:\|\s*(?P<title>.*))?$", re.I)
# Sentence end: . ! ? … followed by space; avoid splitting "e.g." or decimals.
_SENT = re.compile(r"(?<=[.!?…])\s+(?=[\"'“‘(\[]?[A-Z0-9À-Ý])")
_ABBR = re.compile(r"\b(?:e\.g|i\.e|dll|dsb|Dr|Encik|En|Pn|Prof|Sdn|Bhd|etc|vs)\.$", re.I)


@dataclass
class Line:
    speaker: str
    text: str
    delivery: Delivery
    language: str
    scene_id: str
    sfx_after: list[str] = field(default_factory=list)


@dataclass
class Segment:
    id: str
    speaker: str
    text: str
    delivery: Delivery
    language: str
    scene_id: str
    line_index: int
    sfx_after: list[str] = field(default_factory=list)

    @property
    def text_hash(self) -> str:
        return hashlib.sha256(self.text.encode()).hexdigest()[:10]


@dataclass
class Script:
    meta: dict
    scenes: dict[str, str]
    lines: list[Line]

    def segments(self) -> list[Segment]:
        out: list[Segment] = []
        for li, ln in enumerate(self.lines):
            parts = split_sentences(ln.text)
            for si, part in enumerate(parts):
                last = si == len(parts) - 1
                d = ln.delivery
                if not last:  # short natural gap between sentences of one line
                    d = Delivery(d.emotion, d.speed, d.energy, 0.18, d.emphasis, d.instruction)
                out.append(Segment(id=f"{ln.scene_id}-{li:03d}-{si:02d}", speaker=ln.speaker, text=part,
                                   delivery=d, language=ln.language, scene_id=ln.scene_id, line_index=li,
                                   sfx_after=ln.sfx_after if last else []))
        return out


    def line_segments(self) -> list[Segment]:
        """One segment per script line (no sentence split), for supplied audio."""
        return [Segment(id=f"{ln.scene_id}-{li:03d}-00", speaker=ln.speaker, text=ln.text, delivery=ln.delivery,
                        language=ln.language, scene_id=ln.scene_id, line_index=li, sfx_after=ln.sfx_after)
                for li, ln in enumerate(self.lines)]


def parse(src: str) -> Script:
    meta: dict = {}
    body = src
    if src.lstrip().startswith("---"):
        _, fm, body = src.lstrip().split("---", 2)
        for row in fm.strip().splitlines():
            if ":" in row:
                k, v = row.split(":", 1)
                meta[k.strip()] = v.strip()
    default_lang = meta.get("language", "ms")
    scenes: dict[str, str] = {}
    lines: list[Line] = []
    scene = "s01"
    for raw in body.splitlines():
        if not raw.strip() or raw.strip().startswith("//"):
            continue
        s = raw.strip()
        if m := _SCENE.match(s):
            scene = m["id"]
            scenes[scene] = (m["title"] or "").strip()
            continue
        if s.startswith(">"):
            cue = s[1:].strip()
            if cue.upper().startswith("SFX") and lines:
                lines[-1].sfx_after.append(cue[3:].strip())
            continue
        if (m := _LINE.match(s)) and not raw.startswith((" ", "\t")):
            d, lang = _options(m["opts"] or "", default_lang)
            lines.append(Line(m["spk"].strip().upper(), m["text"].strip(), d, lang, scene))
            continue
        if lines:  # continuation
            lines[-1].text += " " + s
            continue
        raise ValueError(f"cannot parse script line: {raw!r}")
    scenes.setdefault("s01", "")
    return Script(meta, scenes, lines)


def _options(opts: str, default_lang: str) -> tuple[Delivery, str]:
    d, lang = Delivery(), default_lang
    for tok in re.findall(r'\w+="[^"]*"|[^,]+', opts):
        tok = tok.strip()
        if not tok:
            continue
        if "=" in tok:
            k, v = (x.strip() for x in tok.split("=", 1))
            v = v.strip('"')
            if k == "speed":
                d.speed = float(v)
            elif k == "energy":
                d.energy = float(v)
            elif k == "pause":
                d.pause_after = float(v)
            elif k == "lang":
                lang = v
            elif k == "emphasis":
                d.emphasis = [w for w in v.split("|") if w]
            elif k == "note":
                d.instruction = v
            else:
                raise ValueError(f"unknown option {k!r}")
        elif tok.lower() in EMOTIONS:
            d.emotion = tok.lower()
        else:
            raise ValueError(f"unknown emotion/option {tok!r}; emotions: {EMOTIONS}")
    return d, lang


def split_sentences(text: str, max_chars: int = MAX_SEGMENT_CHARS) -> list[str]:
    """Split into sentences, then merge short neighbours so each segment is a
    natural phrase group no longer than max_chars."""
    pieces: list[str] = []
    buf = ""
    for part in _SENT.split(text.strip()):
        buf = f"{buf} {part}".strip() if buf else part
        if _ABBR.search(buf):
            continue
        pieces.append(buf)
        buf = ""
    if buf:
        pieces.append(buf)
    merged: list[str] = []
    for p in pieces:
        if merged and len(merged[-1]) + len(p) + 1 <= max_chars and len(p) < 40:
            merged[-1] = f"{merged[-1]} {p}"
        elif len(p) > max_chars:
            merged.extend(_hard_wrap(p, max_chars))
        else:
            merged.append(p)
    return merged


def _hard_wrap(p: str, max_chars: int) -> list[str]:
    out, cur = [], ""
    for chunk in re.split(r"(?<=[,;:])\s+", p):
        if cur and len(cur) + len(chunk) + 1 > max_chars:
            out.append(cur)
            cur = chunk
        else:
            cur = f"{cur} {chunk}".strip()
    if cur:
        out.append(cur)
    return out
