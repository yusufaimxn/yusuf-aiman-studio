"""Voice profile loading and resolution (which provider/model/voice a speaker uses)."""
from __future__ import annotations

import json
import os
from dataclasses import dataclass
from pathlib import Path

from .providers.base import ProviderError

PROFILE_DIR = Path(__file__).resolve().parents[1] / "profiles"


@dataclass
class ResolvedVoice:
    profile_id: str
    speaker: str
    provider: str
    model: str | None
    voice_id: str
    settings: dict
    profile: dict  # merged profile used by delivery planning
    status: str


def load_profile(pid: str) -> dict:
    return json.loads((PROFILE_DIR / f"{pid}.json").read_text())


def speaker_map() -> dict[str, str]:
    return json.loads((PROFILE_DIR / "speakers.json").read_text())


def resolve(speaker: str, provider_override: str | None = None) -> ResolvedVoice:
    smap = speaker_map()
    if speaker not in smap:
        raise ProviderError(f"No voice profile for speaker {speaker!r}; add it to profiles/speakers.json")
    p = load_profile(smap[speaker])

    if p.get("kind") == "synthetic" and p.get("mode") == "yusuf_alt":
        # Aiman performed with Yusuf's voice: only when explicitly enabled.
        if not p.get("allow_yusuf_voice"):
            raise ProviderError(f"{p['id']}: mode yusuf_alt needs allow_yusuf_voice=true (explicit opt-in)")
        alt = p["modes"]["yusuf_alt"]
        base = load_profile(alt["profile"])
        merged = {**base, "base_speed": alt.get("base_speed", base.get("base_speed", 1.0)),
                  "provider_settings": alt.get("provider_settings", base["provider_settings"]),
                  "delivery_limits": p.get("delivery_limits", base.get("delivery_limits", {})),
                  "id": p["id"] + "+yusuf_alt"}
        status = base["status"]
        provider, model, env = base["provider"], base.get("model"), base["voice_id_env"]
        p = merged
    elif p.get("kind") == "synthetic":
        m = p["modes"][p.get("mode", "synthetic")]
        provider, model, env = m["provider"], m.get("model"), m["voice_id_env"]
        status = p["status"]
    else:
        provider, model, env = p["provider"], p.get("model"), p["voice_id_env"]
        status = p["status"]

    if provider_override == "mock":
        return ResolvedVoice(p["id"], speaker, "mock", "mock", f"mock-{speaker.lower()}",
                             {}, {**p, "provider": "mock"}, status)
    voice_id = os.environ.get(env, "")
    if not voice_id:
        raise ProviderError(
            f"{p['id']}: no voice id in ${env}. "
            + ("Yusuf's voice has not been enrolled yet; no voice model exists."
               if p.get("kind") == "clone" else "Choose a stock voice, preview it and put its id there."))
    return ResolvedVoice(p["id"], speaker, provider, model, voice_id,
                         p.get("provider_settings", {}), p, status)
