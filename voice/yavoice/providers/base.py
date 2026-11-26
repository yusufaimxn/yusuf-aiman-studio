"""Provider-independent interface for speech synthesis and voice cloning.

Every provider adapter implements `VoiceProvider`. The rest of the engine only
talks to this interface, so switching provider means changing one field in a
voice profile, not rebuilding the pipeline.
"""
from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from pathlib import Path


class ProviderError(RuntimeError):
    pass


class ConsentRequired(ProviderError):
    """Raised when an action would send voice samples to a third party without consent."""


@dataclass
class Capabilities:
    """What a provider/model can actually do. Used by the delivery engine to
    pick a strategy instead of assuming every provider supports every control."""

    languages: set[str]
    instant_clone: bool = False
    professional_clone: bool = False
    # How emotion can be expressed: "audio_tags" (inline [tags]), "emotion_param"
    # (request-level enum), "instructions" (free-text style prompt), or none.
    emotion_mode: str | None = None
    emotion_languages: set[str] | None = None  # None means all supported languages
    speed_control: bool = False
    speed_range: tuple[float, float] = (1.0, 1.0)
    pitch_control: bool = False
    ssml_break: bool = False
    word_timestamps: bool = False  # word or character level alignment returned
    pronunciation_dictionary: bool = False
    output_formats: tuple[str, ...] = ("mp3",)


@dataclass
class SynthesisRequest:
    text: str
    voice_id: str
    language: str = "ms"
    model: str | None = None
    speed: float = 1.0
    emotion: str | None = None  # provider-native emotion value, already mapped
    settings: dict = field(default_factory=dict)  # provider-native extra settings
    previous_text: str | None = None  # context for natural transitions
    next_text: str | None = None
    pronunciation_dictionary_ids: list[str] = field(default_factory=list)


@dataclass
class WordTiming:
    word: str
    start: float
    end: float


@dataclass
class SynthesisResult:
    audio: bytes
    audio_format: str  # "wav" | "mp3" | "pcm_s16le_24000" ...
    words: list[WordTiming] = field(default_factory=list)
    provider: str = ""
    model: str = ""
    voice_id: str = ""
    placeholder: bool = False  # True for mock/offline audio never meant for final output
    raw_meta: dict = field(default_factory=dict)


@dataclass
class CloneRequest:
    name: str
    sample_paths: list[Path]
    language: str
    description: str = ""
    kind: str = "instant"  # "instant" | "professional"


class VoiceProvider(ABC):
    name: str = "base"
    #: True when synthesis sends text to a remote API (costs money / needs network)
    remote: bool = True

    @abstractmethod
    def capabilities(self, model: str | None = None) -> Capabilities: ...

    @abstractmethod
    def synthesize(self, req: SynthesisRequest) -> SynthesisResult: ...

    def create_clone(self, req: CloneRequest, consent_record: dict | None) -> str:
        """Create a cloned voice and return the provider voice id.

        Adapters must call `require_consent` first. Default: unsupported."""
        raise ProviderError(f"{self.name} does not support voice cloning via this engine")

    def delete_voice(self, voice_id: str) -> None:
        raise ProviderError(f"{self.name} does not support voice deletion via this engine")

    @staticmethod
    def require_consent(consent_record: dict | None, provider: str, sample_paths: list[Path]) -> None:
        from ..consent import verify_consent  # local import avoids a cycle

        verify_consent(consent_record, provider=provider, sample_paths=sample_paths)
