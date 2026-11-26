"""eSpeak NG adapter: free, offline, runs on CPU, has a Malay voice ("ms").

It sounds robotic, so use it for timing drafts and previews, not as a final
brand voice. Install: `apt-get install espeak-ng`.
"""
from __future__ import annotations

import shutil
import subprocess
import tempfile
from pathlib import Path

from .base import Capabilities, ProviderError, SynthesisRequest, SynthesisResult, VoiceProvider


class EspeakProvider(VoiceProvider):
    name = "espeak"
    remote = False

    def capabilities(self, model: str | None = None) -> Capabilities:
        return Capabilities(languages={"ms", "en"}, speed_control=True, speed_range=(0.6, 1.6),
                            pitch_control=True, output_formats=("wav",))

    def synthesize(self, req: SynthesisRequest) -> SynthesisResult:
        exe = shutil.which("espeak-ng")
        if not exe:
            raise ProviderError("espeak-ng is not installed (apt-get install espeak-ng)")
        # voice_id examples: "ms", "ms+m3", "en-gb+f2" (language + variant)
        voice = req.voice_id or req.language
        if not voice.startswith(req.language):
            voice = req.language + ("+" + voice.split("+", 1)[1] if "+" in voice else "")
        wpm = int(160 * req.speed)
        pitch = str(req.settings.get("pitch", 50))
        text = req.text.replace("<", " ").replace(">", " ")  # no SSML here
        with tempfile.TemporaryDirectory() as td:
            out = Path(td) / "o.wav"
            subprocess.run([exe, "-v", voice, "-s", str(wpm), "-p", pitch, "-w", str(out), text],
                           check=True, capture_output=True)
            audio = out.read_bytes()
        return SynthesisResult(audio=audio, audio_format="wav", provider=self.name, model="espeak-ng",
                               voice_id=voice)
