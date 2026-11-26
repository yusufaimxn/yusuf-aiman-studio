"""Emotion and delivery engine.

A script line says *what* delivery it wants (one of 15 studio emotions, plus
speed / energy / pause / emphasis). This module turns that into whatever the
chosen provider and model actually support:

  audio_tags     ElevenLabs v3/v4: inline tags such as [curious]
  emotion_param  Cartesia: request-level emotion, English only per its docs
  voice settings ElevenLabs v2: stability / style
  fallback       punctuation, sentence splitting, pauses, small speed changes

The profile caps how far any of this may push the voice
(`delivery_limits`), so an emotion never overrides the natural identity.
"""
from __future__ import annotations

import re
from dataclasses import dataclass, field

from .providers.base import Capabilities

EMOTIONS = ("neutral", "friendly", "curious", "excited", "surprised", "confused", "sarcastic", "serious",
            "suspenseful", "dramatic", "frustrated", "inspirational", "humorous", "calm", "confident")


@dataclass(frozen=True)
class EmotionSpec:
    speed: float  # multiplier on the profile's base speed
    energy: float  # 0..1, used for stability/style mapping
    tag: str | None  # ElevenLabs v3/v4 audio tag text (without brackets)
    cartesia: str | None  # value from Cartesia's documented emotion list
    pause_after: float  # seconds of silence after the segment
    ending: str | None = None  # punctuation nudge when nothing else is available


SPECS: dict[str, EmotionSpec] = {
    "neutral": EmotionSpec(1.00, 0.40, None, "neutral", 0.30),
    "friendly": EmotionSpec(1.00, 0.55, "warmly", "content", 0.30),
    "curious": EmotionSpec(0.97, 0.55, "curious", "curious", 0.35, "?"),
    "excited": EmotionSpec(1.06, 0.85, "excited", "excited", 0.25, "!"),
    "surprised": EmotionSpec(1.03, 0.80, "surprised", "surprised", 0.35, "!"),
    "confused": EmotionSpec(0.95, 0.45, "confused", "confused", 0.40, "?"),
    "sarcastic": EmotionSpec(0.97, 0.50, "sarcastic", "sarcastic", 0.35),
    "serious": EmotionSpec(0.95, 0.35, "serious", "determined", 0.40, "."),
    "suspenseful": EmotionSpec(0.90, 0.40, "whispers", "mysterious", 0.60, "..."),
    "dramatic": EmotionSpec(0.92, 0.75, "dramatically", "determined", 0.55),
    "frustrated": EmotionSpec(1.02, 0.70, "frustrated", "frustrated", 0.35),
    "inspirational": EmotionSpec(0.96, 0.70, "inspired", "proud", 0.45),
    "humorous": EmotionSpec(1.03, 0.65, "playfully", "happy", 0.30),
    "calm": EmotionSpec(0.94, 0.25, "calmly", "calm", 0.40, "."),
    "confident": EmotionSpec(1.00, 0.60, "confidently", "confident", 0.30, "."),
}


@dataclass
class Delivery:
    emotion: str = "neutral"
    speed: float = 1.0  # extra multiplier from the script
    energy: float | None = None
    pause_after: float | None = None
    emphasis: list[str] = field(default_factory=list)  # words to stress
    instruction: str = ""  # free-text note kept in metadata / for instruction-based providers


@dataclass
class PlannedDelivery:
    text: str
    speed: float
    emotion_value: str | None
    settings: dict
    pause_after: float
    strategy: str
    notes: list[str]


def plan(text: str, d: Delivery, caps: Capabilities, language: str, profile: dict) -> PlannedDelivery:
    if d.emotion not in SPECS:
        raise ValueError(f"unknown emotion {d.emotion!r}; use one of {EMOTIONS}")
    spec = SPECS[d.emotion]
    limits = profile.get("delivery_limits", {})
    base_speed = profile.get("base_speed", 1.0)
    max_dev = limits.get("max_speed_deviation", 0.10)
    allowed = set(limits.get("allowed_emotions", EMOTIONS))
    notes: list[str] = []
    emotion = d.emotion
    if emotion not in allowed:
        notes.append(f"{emotion} not allowed by profile; using neutral")
        emotion, spec = "neutral", SPECS["neutral"]

    speed = base_speed * spec.speed * d.speed
    speed = max(base_speed * (1 - max_dev), min(base_speed * (1 + max_dev), speed))
    if caps.speed_control:
        speed = max(caps.speed_range[0], min(caps.speed_range[1], speed))
    else:
        if abs(speed - 1.0) > 1e-3:
            notes.append("provider/model has no speed control; speed ignored")
        speed = 1.0
    energy = min(d.energy if d.energy is not None else spec.energy, limits.get("max_energy", 0.8))
    out = text.strip()
    settings: dict = dict(profile.get("provider_settings", {}))
    emotion_value = None

    if caps.emotion_mode == "audio_tags":
        strategy = "audio_tags"
        if spec.tag and emotion != "neutral":
            out = f"[{spec.tag}] {out}"
    elif caps.emotion_mode == "emotion_param" and (caps.emotion_languages is None or language in caps.emotion_languages):
        strategy = "emotion_param"
        emotion_value = spec.cartesia
    elif "stability" in settings or profile.get("provider") == "elevenlabs":
        strategy = "voice_settings"
        base_stab = settings.get("stability", 0.5)
        # More energy -> slightly lower stability (more variation) within a narrow band.
        settings["stability"] = round(max(0.3, min(0.8, base_stab - (energy - 0.4) * 0.3)), 2)
        settings["style"] = round(min(limits.get("max_style", 0.35), max(0.0, (energy - 0.3) * 0.5)), 2)
    else:
        strategy = "fallback"
    if strategy in ("voice_settings", "fallback") or (strategy == "emotion_param" and emotion_value is None):
        out = _punctuate(out, spec.ending)
        if strategy == "fallback" and emotion != "neutral":
            notes.append(f"{emotion}: expressed through punctuation and pacing only")

    for w in d.emphasis:
        # Portable emphasis: no provider reliably honours SSML <emphasis>, so use a
        # short pause before the stressed word when breaks are supported.
        if caps.ssml_break and strategy != "audio_tags":
            out = re.sub(rf"\b({re.escape(w)})\b", r'<break time="150ms"/>\1', out, count=1)
        else:
            notes.append(f"emphasis on {w!r} left to natural delivery")

    pause = d.pause_after if d.pause_after is not None else spec.pause_after
    return PlannedDelivery(out, round(speed, 3), emotion_value, settings, pause, strategy, notes)


def _punctuate(text: str, ending: str | None) -> str:
    if not ending:
        return text
    stripped = text.rstrip(" .!?…")
    return stripped + ending
