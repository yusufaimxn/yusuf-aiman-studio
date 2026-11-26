"""Script-to-speech pipeline.

script -> segments -> (lexicon, delivery plan) -> provider synthesis (cached,
versioned per segment) -> per-segment cleanup -> timeline assembly ->
narration + per-speaker stems + timeline.json + words.json + captions.srt.

Output goes to episodes/<slug>/assets/audio/voice/ so HyperFrames compositions
can reference it (media must resolve under the episode's assets/ folder).
"""
from __future__ import annotations

import datetime as dt
import hashlib
import json
import wave
from dataclasses import asdict
from pathlib import Path

from . import delivery as dlv
from . import ffmpeg
from .lexicon import Lexicon
from .post import Preset, loudnorm, process_segment
from .profiles import ResolvedVoice, resolve
from .providers import ProviderError, SynthesisRequest, get_provider
from .script import Script, Segment, parse

REPO = Path(__file__).resolve().parents[2]
RATE = 48000
LEAD_IN = 0.25  # seconds of silence before the first line


def episode_audio_dir(slug: str) -> Path:
    return REPO / "episodes" / slug / "assets" / "audio" / "voice"


class Pipeline:
    def __init__(self, slug: str, script_text: str, provider_override: str | None = None,
                 allow_remote: bool = False, mode: str = "preview", preset: str | None = None):
        assert mode in ("preview", "final")
        self.slug, self.mode = slug, mode
        self.script: Script = parse(script_text)
        self.provider_override = provider_override
        self.allow_remote = allow_remote
        self.lexicon = Lexicon.load()
        self.out = episode_audio_dir(slug)
        self.seg_dir = self.out / "segments"
        self.seg_dir.mkdir(parents=True, exist_ok=True)
        self.versions_path = self.out / "versions.json"
        self.versions = json.loads(self.versions_path.read_text()) if self.versions_path.exists() else {}
        self.preset_name = preset or self.script.meta.get("preset", "educational")
        self._voices: dict[str, ResolvedVoice] = {}

    # ----------------------------------------------------------- voices
    def voice(self, speaker: str) -> ResolvedVoice:
        if speaker not in self._voices:
            v = resolve(speaker, self.provider_override)
            prov = get_provider(v.provider)
            if prov.remote and not self.allow_remote:
                raise ProviderError(f"{v.provider} is a paid remote API. Re-run with --allow-remote "
                                    "once API use has been approved.")
            if v.provider != "mock":
                ok = {"approved"} if self.mode == "final" else {"approved", "preview"}
                if v.status not in ok:
                    raise ProviderError(f"{v.profile_id} status is {v.status!r}; {self.mode} needs {sorted(ok)}")
            self._voices[speaker] = v
        return self._voices[speaker]

    # -------------------------------------------------------- synthesis
    def _key(self, v: ResolvedVoice, plan: dlv.PlannedDelivery, lang: str, take: int) -> str:
        blob = json.dumps([v.provider, v.model, v.voice_id, plan.text, plan.speed, plan.emotion_value,
                           plan.settings, lang, take], sort_keys=True)
        return hashlib.sha256(blob.encode()).hexdigest()[:16]

    def synth_segment(self, seg: Segment, prev: Segment | None, nxt: Segment | None,
                      regenerate: bool = False) -> dict:
        v = self.voice(seg.speaker)
        prov = get_provider(v.provider)
        caps = prov.capabilities(v.model)
        spoken, hits = self.lexicon.apply(seg.text, seg.language)
        plan = dlv.plan(spoken, seg.delivery, caps, seg.language, v.profile)
        hist = self.versions.setdefault(seg.id, [])
        take = (max((h["take"] for h in hist), default=0) + 1) if regenerate else (hist[-1]["take"] if hist else 1)
        key = self._key(v, plan, seg.language, take)
        raw = self.seg_dir / f"{seg.id}.{key}.raw"
        meta_path = self.seg_dir / f"{seg.id}.{key}.json"
        clean = self.seg_dir / f"{seg.id}.{key}.wav"
        if not (clean.exists() and meta_path.exists()):
            res = prov.synthesize(SynthesisRequest(
                text=plan.text, voice_id=v.voice_id, language=seg.language, model=v.model, speed=plan.speed,
                emotion=plan.emotion_value, settings=plan.settings,
                previous_text=prev.text if prev and prev.speaker == seg.speaker else None,
                next_text=nxt.text if nxt and nxt.speaker == seg.speaker else None))
            raw = raw.with_suffix(f".raw.{res.audio_format.split('_')[0]}")
            raw.write_bytes(res.audio)
            pre = Preset.load(v.profile.get("preset", self.preset_name))
            tmp = self.seg_dir / f"{seg.id}.{key}.tmp.wav"
            ffmpeg.to_wav(raw, tmp, RATE)
            process_segment(tmp, clean, pre)
            tmp.unlink(missing_ok=True)
            meta = {"segment": seg.id, "speaker": seg.speaker, "profile": v.profile_id, "provider": res.provider,
                    "model": res.model, "voice_id": v.voice_id, "placeholder": res.placeholder,
                    "text": seg.text, "spoken_text": plan.text, "lexicon_hits": hits, "language": seg.language,
                    "emotion": seg.delivery.emotion, "strategy": plan.strategy, "notes": plan.notes,
                    "speed": plan.speed, "pause_after": plan.pause_after, "take": take, "key": key,
                    "words": [asdict(w) for w in res.words], "duration": ffmpeg.probe(clean)["duration"],
                    "created_at": dt.datetime.now(dt.timezone.utc).isoformat()}
            meta_path.write_text(json.dumps(meta, indent=2, ensure_ascii=False))
            if not any(h["key"] == key for h in hist):
                hist.append({"take": take, "key": key, "file": clean.name, "approved": False,
                             "created_at": meta["created_at"]})
            self._save_versions()
        return json.loads(meta_path.read_text()) | {"file": str(clean)}

    def _save_versions(self) -> None:
        self.versions_path.write_text(json.dumps(self.versions, indent=2))

    def approve(self, seg_id: str, key: str | None = None) -> None:
        hist = self.versions[seg_id]
        target = next(h for h in reversed(hist) if key is None or h["key"] == key)
        for h in hist:
            h["approved"] = h is target
        self._save_versions()

    # --------------------------------------------------------- assembly
    def run(self, regenerate: set[str] | None = None) -> dict:
        regenerate = regenerate or set()
        segs = self.script.segments()
        metas = [self.synth_segment(s, segs[i - 1] if i else None, segs[i + 1] if i + 1 < len(segs) else None,
                                    regenerate=s.id in regenerate)
                 for i, s in enumerate(segs)]
        return self.assemble(segs, metas)

    def assemble(self, segs: list[Segment], metas: list[dict]) -> dict:
        speakers = sorted({m["speaker"] for m in metas})
        cursor = LEAD_IN
        timeline = []
        placed: list[tuple[str, float, bytes]] = []
        for s, m in zip(segs, metas):
            with wave.open(m["file"], "rb") as w:
                frames = w.readframes(w.getnframes())
                dur = w.getnframes() / w.getframerate()
            words = m["words"]
            approx = False
            if not words:  # provider gave no timings: proportional estimate, flagged
                words, approx = _estimate_words(m["text"], dur), True
            else:
                # timings refer to the *spoken* (aliased) text; map back when word counts match
                orig = m["text"].split()
                if len(orig) == len(words):
                    words = [dict(w, word=o) for w, o in zip(words, orig)]
                scale = dur / max(1e-6, words[-1]["end"]) if words[-1]["end"] > dur else 1.0
                words = [dict(w, start=w["start"] * scale, end=w["end"] * scale) for w in words]
            timeline.append({"id": s.id, "scene": s.scene_id, "speaker": s.speaker, "text": m["text"],
                             "emotion": m["emotion"], "language": m["language"], "start": round(cursor, 3),
                             "end": round(cursor + dur, 3), "placeholder": m["placeholder"],
                             "words_approximate": approx, "sfx_after": s.sfx_after, "take": m["take"], "key": m["key"],
                             "words": [{"word": w["word"], "start": round(cursor + w["start"], 3),
                                        "end": round(cursor + w["end"], 3)} for w in words]})
            placed.append((s.speaker, cursor, frames))
            cursor += dur + m["pause_after"]
        total = cursor + 0.5
        n = int(total * RATE)
        stems = {spk: bytearray(n * 2) for spk in speakers}
        mixdown = bytearray(n * 2)
        for spk, start, frames in placed:
            off = int(start * RATE) * 2
            stems[spk][off:off + len(frames)] = frames
            _add_pcm(mixdown, off, frames)
        stem_dir = self.out / "stems"
        stem_dir.mkdir(exist_ok=True)
        for spk, buf in stems.items():
            _write_wav(stem_dir / f"{spk.lower()}.wav", buf)
        raw_mix = self.out / "narration.raw.wav"
        _write_wav(raw_mix, mixdown)
        narration = self.out / "narration.wav"
        loudnorm(raw_mix, narration, Preset.load(self.preset_name))
        raw_mix.unlink()
        scenes = _scene_spans(timeline, self.script.scenes)
        result = {"episode": self.slug, "mode": self.mode, "duration": round(total, 3),
                  "preset": self.preset_name, "speakers": speakers,
                  "placeholder_audio": any(t["placeholder"] for t in timeline),
                  "narration": "assets/audio/voice/narration.wav",
                  "stems": {s: f"assets/audio/voice/stems/{s.lower()}.wav" for s in speakers},
                  "scenes": scenes, "segments": timeline,
                  "generated_at": dt.datetime.now(dt.timezone.utc).isoformat()}
        (self.out / "timeline.json").write_text(json.dumps(result, indent=2, ensure_ascii=False))
        from .captions import write_srt
        write_srt(timeline, self.out / "captions.srt")
        return result


def _estimate_words(text: str, dur: float) -> list[dict]:
    words = text.split()
    total = sum(len(w) + 1 for w in words) or 1
    out, t = [], 0.0
    for w in words:
        d = dur * (len(w) + 1) / total
        out.append({"word": w, "start": t, "end": t + d * 0.92})
        t += d
    return out


def _scene_spans(timeline: list[dict], titles: dict[str, str]) -> list[dict]:
    spans: dict[str, dict] = {}
    for t in timeline:
        s = spans.setdefault(t["scene"], {"id": t["scene"], "title": titles.get(t["scene"], ""),
                                          "start": t["start"], "end": t["end"]})
        s["end"] = t["end"]
    return list(spans.values())


def _add_pcm(dst: bytearray, off: int, frames: bytes) -> None:
    import array
    a = array.array("h", bytes(dst[off:off + len(frames)]))
    b = array.array("h", frames)
    for i in range(len(b)):
        a[i] = max(-32768, min(32767, a[i] + b[i]))
    dst[off:off + len(frames)] = a.tobytes()


def _write_wav(path: Path, pcm: bytes) -> None:
    with wave.open(str(path), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(RATE)
        w.writeframes(bytes(pcm))
