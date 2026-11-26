"""Cartesia adapter (secondary / fallback provider).

Docs used (read 2026-11-26):
- Sonic 3.6 (`sonic-3.6`) lists Malay (ms, locale ms-MY).
- Instant clone: 10 s minimum, up to 60 s on Sonic 3.6+. Pro Voice Clone: 30+ min.
- generation_config: speed 0.6-1.5 (not for Pro Voice Clones), volume 0.5-2.0,
  emotion (beta) **English only**. SSML-like tags: speed, volume, emotion, break, spell.
- Word timestamps were not confirmed for the bytes endpoint, so this adapter
  returns no word timings; the sync stage then aligns with a transcriber.

Network: requires api.cartesia.ai to be allow-listed.
"""
from __future__ import annotations

import json
import os
import urllib.error
import urllib.request

from .base import Capabilities, CloneRequest, ProviderError, SynthesisRequest, SynthesisResult, VoiceProvider
from .elevenlabs import _multipart

API = os.environ.get("CARTESIA_API_BASE", "https://api.cartesia.ai")
VERSION = os.environ.get("CARTESIA_VERSION", "2025-04-16")


class CartesiaProvider(VoiceProvider):
    name = "cartesia"
    remote = True

    def __init__(self, api_key: str | None = None):
        self.api_key = api_key or os.environ.get("CARTESIA_API_KEY")

    def capabilities(self, model: str | None = None) -> Capabilities:
        return Capabilities(
            languages={"ms", "en"},
            instant_clone=True,
            professional_clone=True,
            emotion_mode="emotion_param",
            emotion_languages={"en"},
            speed_control=True,
            speed_range=(0.6, 1.5),
            ssml_break=True,
            word_timestamps=False,
            pronunciation_dictionary=True,
            output_formats=("wav",),
        )

    def _req(self, path: str, body: bytes, ctype: str) -> bytes:
        if not self.api_key:
            raise ProviderError("CARTESIA_API_KEY is not set (see .env.example)")
        r = urllib.request.Request(API + path, data=body, method="POST")
        r.add_header("X-API-Key", self.api_key)
        r.add_header("Cartesia-Version", VERSION)
        r.add_header("Content-Type", ctype)
        try:
            with urllib.request.urlopen(r, timeout=120) as resp:
                return resp.read()
        except urllib.error.HTTPError as e:
            raise ProviderError(f"Cartesia {e.code}: {e.read()[:500]!r}") from e

    def synthesize(self, req: SynthesisRequest) -> SynthesisResult:
        model = req.model or "sonic-3.6"
        caps = self.capabilities(model)
        gen: dict = {}
        if req.speed != 1.0:
            lo, hi = caps.speed_range
            gen["speed"] = max(lo, min(hi, req.speed))
        if req.emotion and req.language in (caps.emotion_languages or set()):
            gen["emotion"] = req.emotion
        if "volume" in req.settings:
            gen["volume"] = req.settings["volume"]
        payload = {
            "model_id": model,
            "transcript": req.text,
            "voice": {"mode": "id", "id": req.voice_id},
            "language": req.language,
            "output_format": {"container": "wav", "encoding": "pcm_s16le", "sample_rate": 44100},
        }
        if gen:
            payload["generation_config"] = gen
        if req.pronunciation_dictionary_ids:
            payload["pronunciation_dict_id"] = req.pronunciation_dictionary_ids[0]
        audio = self._req("/tts/bytes", json.dumps(payload).encode(), "application/json")
        return SynthesisResult(audio=audio, audio_format="wav", provider=self.name,
                               model=model, voice_id=req.voice_id)

    def create_clone(self, req: CloneRequest, consent_record: dict | None) -> str:
        self.require_consent(consent_record, self.name, req.sample_paths)
        if req.kind != "instant" or len(req.sample_paths) != 1:
            raise ProviderError("Cartesia instant clone takes exactly one clip (10-60 s). "
                                "Pro Voice Clones are created in the Cartesia dashboard.")
        body, ctype = _multipart({"name": req.name, "language": req.language,
                                  "description": req.description},
                                 [("clip", req.sample_paths[0])])
        return json.loads(self._req("/voices/clone", body, ctype))["id"]
