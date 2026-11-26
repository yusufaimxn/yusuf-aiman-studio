"""Pronunciation dictionary.

Entries map a written term to how it should be spoken. Because providers differ
(ElevenLabs and Cartesia both have server-side dictionaries; phoneme support
varies by model and language), the portable mechanism is an *alias*: a
respelling applied to the text before synthesis. Optional IPA is kept for
providers/models that accept it.

Files: voice/lexicon/*.json, merged in name order. Manual corrections go in
voice/lexicon/zz-overrides.json so they win over the defaults.
"""
from __future__ import annotations

import json
import re
from dataclasses import dataclass
from pathlib import Path

LEX_DIR = Path(__file__).resolve().parents[1] / "lexicon"


@dataclass
class Entry:
    term: str
    alias: str | None = None
    ipa: str | None = None
    lang: str | None = None  # restrict to segments in this language
    case_sensitive: bool = False
    note: str = ""


class Lexicon:
    def __init__(self, entries: list[Entry]):
        # Longest terms first so "Visual Studio Code" wins over "Code".
        self.entries = sorted(entries, key=lambda e: -len(e.term))

    @classmethod
    def load(cls, directory: Path = LEX_DIR) -> "Lexicon":
        merged: dict[str, Entry] = {}
        for f in sorted(Path(directory).glob("*.json")):
            for raw in json.loads(f.read_text())["entries"]:
                e = Entry(**raw)
                merged[e.term if e.case_sensitive else e.term.lower()] = e
        return cls(list(merged.values()))

    def apply(self, text: str, lang: str | None = None) -> tuple[str, list[str]]:
        """Return text with aliases applied and the list of terms that matched."""
        hits: list[str] = []
        for e in self.entries:
            if not e.alias or (e.lang and lang and e.lang != lang):
                continue
            flags = 0 if e.case_sensitive else re.IGNORECASE
            pat = re.compile(rf"(?<![\w-]){re.escape(e.term)}(?![\w-])", flags)
            text, n = pat.subn(e.alias, text)
            if n:
                hits.append(e.term)
        return text, hits

    def unknown_terms(self, text: str) -> list[str]:
        """Heuristic list of tokens that look technical (CamelCase, ALLCAPS, dotted,
        digits) and have no entry, so a reviewer can add pronunciations."""
        known = {e.term.lower() for e in self.entries}
        cand = set(re.findall(r"\b(?:[A-Z]{2,}\w*|[a-z]+[A-Z]\w*|\w+\.\w+|\w*\d\w*)\b", text))
        return sorted(t for t in cand if t.lower() not in known and not t.isdigit())
