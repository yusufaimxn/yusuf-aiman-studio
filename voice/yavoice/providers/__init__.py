from .base import (Capabilities, CloneRequest, ConsentRequired, ProviderError, SynthesisRequest,
                   SynthesisResult, VoiceProvider, WordTiming)


def get_provider(name: str) -> VoiceProvider:
    """Factory: the only place that knows concrete provider classes."""
    if name == "elevenlabs":
        from .elevenlabs import ElevenLabsProvider
        return ElevenLabsProvider()
    if name == "cartesia":
        from .cartesia import CartesiaProvider
        return CartesiaProvider()
    if name == "mock":
        from .mock import MockProvider
        return MockProvider()
    raise ProviderError(f"Unknown voice provider: {name!r}")


__all__ = ["Capabilities", "CloneRequest", "ConsentRequired", "ProviderError", "SynthesisRequest",
           "SynthesisResult", "VoiceProvider", "WordTiming", "get_provider"]
