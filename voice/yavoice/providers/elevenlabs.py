"""ElevenLabs adapter.

Docs used (read 2026-11-26):
- TTS with timestamps: POST /v1/text-to-speech/{voice_id}/with-timestamps
  returns audio_base64 + character-level `alignment`.
- Malay ("ms") is listed for Multilingual v2, Flash v2.5, Eleven v3 and the
  Eleven v4 family. Professional Voice Cloning supports Malay.
- Professional Voice Cloning requires the speaker's own account and a
  voice-captcha verification, so a PVC must be created by Yusuf in his own
  ElevenLabs account. This engine therefore only *references* a PVC voice id;
  it can create Instant Voice Clones through the API, behind the consent gate.

Network: requires api.elevenlabs.io to be allow-listed.
"""
from __future__ import annotations

import base64
import json
import os
import urllib.error
import urllib.request
import uuid
from pathlib import Path

from .base import (
    Capabilities,
    CloneRequest,
    ProviderError,
    SynthesisRequest,
    SynthesisResult,
    VoiceProvider,
    WordTiming,
)

API = os.environ.get("ELEVENLABS_API_BASE", "https://api.elevenlabs.io")

# Language lists come from the ElevenLabs help-center language pages. Only the
# languages this studio needs are listed; extend when needed.
_STUDIO_LANGS = {"ms", "en"}


class ElevenLabsProvider(VoiceProvider):
    name = "elevenlabs"
    remote = True

    def __init__(self, api_key: str | None = None):
        self.api_key = api_key or os.environ.get("ELEVENLABS_API_KEY")

    # ------------------------------------------------------------------ caps
    def capabilities(self, model: str | None = None) -> Capabilities:
        model = model or "eleven_multilingual_v2"
        v3_family = model.startswith("eleven_v3") or model.startswith("eleven_v4")
        return Capabilities(
            languages=set(_STUDIO_LANGS),
            instant_clone=True,
            professional_clone=True,  # created in the ElevenLabs app by the speaker
            # v3/v4 interpret inline audio tags like [excited]; v2 models do not,
            # so on v2 we rely on voice settings + punctuation.
            emotion_mode="audio_tags" if v3_family else None,
            speed_control=not model.startswith("eleven_v4"),  # v4 PVC: no speed/style
            speed_range=(0.7, 1.2),
            ssml_break=not v3_family,
            word_timestamps=True,
            pronunciation_dictionary=True,
            output_formats=("mp3_44100_128", "pcm_44100", "pcm_24000"),
        )

    # ------------------------------------------------------------- helpers
    def _key(self) -> str:
        if not self.api_key:
            raise ProviderError("ELEVENLABS_API_KEY is not set (see .env.example)")
        return self.api_key

    def _request(self, method: str, path: str, body: bytes | None = None,
                 content_type: str = "application/json") -> dict:
        req = urllib.request.Request(API + path, data=body, method=method)
        req.add_header("xi-api-key", self._key())
        if body is not None:
            req.add_header("Content-Type", content_type)
        try:
            with urllib.request.urlopen(req, timeout=120) as r:
                raw = r.read()
        except urllib.error.HTTPError as e:  # surface the provider's message
            raise ProviderError(f"ElevenLabs {e.code}: {e.read()[:500]!r}") from e
        return json.loads(raw) if raw else {}

    # ---------------------------------------------------------- synthesize
    def synthesize(self, req: SynthesisRequest) -> SynthesisResult:
        model = req.model or "eleven_multilingual_v2"
        caps = self.capabilities(model)
        s = dict(req.settings)
        voice_settings = {
            k: s.pop(k) for k in ("stability", "similarity_boost", "style", "use_speaker_boost")
            if k in s
        }
        if caps.speed_control and req.speed != 1.0:
            lo, hi = caps.speed_range
            voice_settings["speed"] = max(lo, min(hi, req.speed))
        payload: dict = {"text": req.text, "model_id": model}
        if voice_settings:
            payload["voice_settings"] = voice_settings
        if s.pop("send_language_code", False):
            payload["language_code"] = req.language
        if s.pop("use_context", True) and not model.startswith("eleven_v3"):
            if req.previous_text:
                payload["previous_text"] = req.previous_text
            if req.next_text:
                payload["next_text"] = req.next_text
        if req.pronunciation_dictionary_ids:
            payload["pronunciation_dictionary_locators"] = [
                {"pronunciation_dictionary_id": d.split(":")[0],
                 **({"version_id": d.split(":")[1]} if ":" in d else {})}
                for d in req.pronunciation_dictionary_ids
            ]
        fmt = s.pop("output_format", "mp3_44100_128")
        data = self._request(
            "POST",
            f"/v1/text-to-speech/{req.voice_id}/with-timestamps?output_format={fmt}",
            json.dumps(payload).encode(),
        )
        audio = base64.b64decode(data["audio_base64"])
        align = data.get("normalized_alignment") or data.get("alignment") or {}
        words = chars_to_words(
            align.get("characters", []),
            align.get("character_start_times_seconds", []),
            align.get("character_end_times_seconds", []),
        )
        return SynthesisResult(
            audio=audio,
            audio_format="mp3" if fmt.startswith("mp3") else fmt,
            words=words,
            provider=self.name,
            model=model,
            voice_id=req.voice_id,
            raw_meta={"request_id": data.get("request_id")},
        )

    # --------------------------------------------------------------- clone
    def create_clone(self, req: CloneRequest, consent_record: dict | None) -> str:
        self.require_consent(consent_record, self.name, req.sample_paths)
        if req.kind == "professional":
            raise ProviderError(
                "ElevenLabs Professional Voice Clones must be created by the speaker in "
                "their own ElevenLabs account (voice-captcha verification). Create it "
                "there, then put its voice id in the profile."
            )
        fields = {"name": req.name, "description": req.description,
                  "labels": json.dumps({"language": req.language, "studio": "yusuf-aiman"})}
        body, ctype = _multipart(fields, [("files", p) for p in req.sample_paths])
        data = self._request("POST", "/v1/voices/add", body, ctype)
        return data["voice_id"]

    def delete_voice(self, voice_id: str) -> None:
        self._request("DELETE", f"/v1/voices/{voice_id}")


def chars_to_words(chars: list[str], starts: list[float], ends: list[float]) -> list[WordTiming]:
    words: list[WordTiming] = []
    cur, cs, ce = "", None, None
    for ch, s, e in zip(chars, starts, ends):
        if ch.isspace():
            if cur:
                words.append(WordTiming(cur, cs, ce))
            cur, cs, ce = "", None, None
            continue
        if not cur:
            cs = s
        cur += ch
        ce = e
    if cur:
        words.append(WordTiming(cur, cs, ce))
    return words


def _multipart(fields: dict[str, str], files: list[tuple[str, Path]]) -> tuple[bytes, str]:
    boundary = uuid.uuid4().hex
    out = bytearray()
    for k, v in fields.items():
        out += f"--{boundary}\r\nContent-Disposition: form-data; name=\"{k}\"\r\n\r\n{v}\r\n".encode()
    for k, p in files:
        p = Path(p)
        out += (f"--{boundary}\r\nContent-Disposition: form-data; name=\"{k}\"; "
                f"filename=\"{p.name}\"\r\nContent-Type: application/octet-stream\r\n\r\n").encode()
        out += p.read_bytes() + b"\r\n"
    out += f"--{boundary}--\r\n".encode()
    return bytes(out), f"multipart/form-data; boundary={boundary}"
