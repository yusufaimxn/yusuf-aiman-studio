"""Google Cloud Text-to-Speech adapter (free monthly tier).

Pricing page (read 2026-11-26): Standard and WaveNet voices are free for the
first 4 million characters a month, Neural2 and Chirp 3: HD for the first 1
million. Billing must be enabled on the Google Cloud project; usage beyond the
free tier is charged automatically, so set a budget alert.

voice_id is a Google voice name, e.g. "ms-MY-Wavenet-A". Check which ms-MY
voices exist with `python -m yavoice google-voices` before choosing.

Auth: GOOGLE_TTS_API_KEY (an API key restricted to the Text-to-Speech API).
Network: texttospeech.googleapis.com.
"""
from __future__ import annotations

import base64
import json
import os
import urllib.error
import urllib.request

from .base import Capabilities, ProviderError, SynthesisRequest, SynthesisResult, VoiceProvider

API = "https://texttospeech.googleapis.com/v1"
LANG_CODES = {"ms": "ms-MY", "en": "en-US"}


class GoogleProvider(VoiceProvider):
    name = "google"
    remote = True

    def __init__(self, api_key: str | None = None):
        self.api_key = api_key or os.environ.get("GOOGLE_TTS_API_KEY")

    def capabilities(self, model: str | None = None) -> Capabilities:
        return Capabilities(languages={"ms", "en"}, speed_control=True, speed_range=(0.75, 1.25),
                            pitch_control=True, ssml_break=True, output_formats=("wav",))

    def _call(self, method: str, path: str, body: dict | None = None) -> dict:
        if not self.api_key:
            raise ProviderError("GOOGLE_TTS_API_KEY is not set (see .env.example)")
        req = urllib.request.Request(f"{API}{path}{'&' if '?' in path else '?'}key={self.api_key}",
                                     data=json.dumps(body).encode() if body else None, method=method)
        req.add_header("Content-Type", "application/json")
        try:
            with urllib.request.urlopen(req, timeout=120) as r:
                return json.loads(r.read())
        except urllib.error.HTTPError as e:
            raise ProviderError(f"Google TTS {e.code}: {e.read()[:500]!r}") from e

    def list_voices(self, language: str = "ms-MY") -> list[dict]:
        return self._call("GET", f"/voices?languageCode={language}").get("voices", [])

    def synthesize(self, req: SynthesisRequest) -> SynthesisResult:
        voice = req.voice_id
        lang = voice.rsplit("-", 2)[0] if voice.count("-") >= 2 else LANG_CODES.get(req.language, "ms-MY")
        has_ssml = "<break" in req.text
        text = f"<speak>{req.text}</speak>" if has_ssml else req.text
        body = {"input": {"ssml": text} if has_ssml else {"text": text},
                "voice": {"languageCode": lang, "name": voice},
                "audioConfig": {"audioEncoding": "LINEAR16", "sampleRateHertz": 48000,
                                "speakingRate": req.speed, "pitch": req.settings.get("pitch", 0.0)}}
        data = self._call("POST", "/text:synthesize", body)
        return SynthesisResult(audio=base64.b64decode(data["audioContent"]), audio_format="wav",
                               provider=self.name, model=voice, voice_id=voice)
