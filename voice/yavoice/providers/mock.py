"""Offline mock provider for tests and dry runs.

It produces a soft tone whose length follows the text (about 14 characters a
second) plus evenly spaced word timings. Every result is flagged
`placeholder=True`; the QA stage refuses to approve placeholder audio for a
final export. It never pretends to be anyone's voice.
"""
from __future__ import annotations

import io
import zlib
import math
import struct
import wave

from .base import Capabilities, SynthesisRequest, SynthesisResult, VoiceProvider, WordTiming

RATE = 24000


class MockProvider(VoiceProvider):
    name = "mock"
    remote = False

    def capabilities(self, model: str | None = None) -> Capabilities:
        return Capabilities(languages={"ms", "en"}, speed_control=True, speed_range=(0.5, 2.0),
                            word_timestamps=True, output_formats=("wav",))

    def synthesize(self, req: SynthesisRequest) -> SynthesisResult:
        words = req.text.split()
        dur = max(0.4, len(req.text) / (14.0 * req.speed))
        freq = 180.0 + (zlib.crc32(req.voice_id.encode()) % 120)
        n = int(dur * RATE)
        buf = io.BytesIO()
        with wave.open(buf, "wb") as w:
            w.setnchannels(1)
            w.setsampwidth(2)
            w.setframerate(RATE)
            frames = bytearray()
            for i in range(n):
                env = min(1.0, i / 2400, (n - i) / 2400)
                frames += struct.pack("<h", int(3000 * env * math.sin(2 * math.pi * freq * i / RATE)))
            w.writeframes(bytes(frames))
        timings, t, step = [], 0.0, dur / max(1, len(words))
        for wd in words:
            timings.append(WordTiming(wd, round(t, 3), round(t + step * 0.9, 3)))
            t += step
        return SynthesisResult(audio=buf.getvalue(), audio_format="wav", words=timings,
                               provider=self.name, model="mock", voice_id=req.voice_id,
                               placeholder=True)
