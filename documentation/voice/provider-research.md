# Voice provider research and recommendation

Researched 2026-11-26 from each provider's official documentation and pricing pages (links below).
Prices change often, and ElevenLabs was running a time-limited promotion when this was checked, so
confirm the numbers before buying. Nothing here was tested with real audio yet: the network in the
cloud workspace blocks the provider APIs, and no paid account has been used.

## Summary

**Recommended primary provider: ElevenLabs.** Use a Professional Voice Clone (PVC) of Yusuf, created
by Yusuf in his own ElevenLabs account, with Multilingual v2 as the default model. Eleven v3 or v4 can
be used where audio tags give better emotion.

**Secondary/fallback: Cartesia Sonic 3.6.** It lists Malay and has instant and pro cloning. Its
emotion controls are English-only, so it is weaker for Malay narration.

**Not recommended for Yusuf's voice:** OpenAI TTS has no generally available voice cloning, and
Azure needs a Limited Access application. We also could not confirm Malay support for Azure's
personal or professional voices.

The engine is provider-independent (`voice/yavoice/providers/`). A profile names its provider and
model, so you can switch provider by editing one profile file.

## Comparison

| | ElevenLabs | Cartesia | OpenAI TTS | Azure AI Speech |
|---|---|---|---|---|
| Custom voice cloning | Instant (IVC, 1 to 2 min audio) and Professional (PVC, 30 min minimum, 1 to 3 h ideal) | Instant (10 to 60 s) and Pro Voice Clone (30+ min) | Custom voices are "supported but restricted" to eligible customers through sales | Personal voice and Professional voice, both gated by Limited Access approval |
| Malay (ms) | Listed for Multilingual v2, Flash v2.5, Eleven v3 and Eleven v4. PVC supports Malay | Listed for Sonic 3.5 and 3.6 (locale ms-MY) | About 50 languages following Whisper; "optimized for English" | ms-MY confirmed for speech-to-text. Malay TTS voices and personal/professional voice in Malay **not confirmed** in the pages read |
| Malay/English code-switching | Not documented. Multilingual models usually handle mixed text, but this needs a listening test | Documented only for Hindi/English | Not documented | Personal voice detects language per sentence; not documented within a sentence |
| Emotion control | v3/v4: inline audio tags (e.g. `[excited]`, `[whispers]`). v2: stability/style settings. v4 PVC: no style or speed setting | `emotion` parameter (beta) with a long list, **English only**. Speed 0.6 to 1.5 (not for Pro clones), volume, breaks, `[laughter]` | `instructions` text prompt for tone, but only for its built-in voices | SSML; personal voice does not support `express-as` styles and supports only `rate` in prosody |
| Word timings for lip-sync / captions | Yes: `/with-timestamps` returns character-level alignment | Not confirmed on the HTTP endpoint read; the engine aligns separately | Not documented | Word boundary and viseme events on the Phoenix base model |
| Pronunciation dictionary | Yes (server-side dictionaries; rules per model not confirmed, page blocked our fetch) | Yes (IPA or sounds-like; IPA only for English/Spanish) | No | SSML lexicon; phonemes on Phoenix only |
| Latency | Not needed for offline video; Flash models are the low-latency option | Under 90 ms to first audio | n/a | 200 to 1600 ms depending on base model |
| Price to start | Creator plan (needed for PVC) $22/mo regular, 121k credits; v4 TTS $0.08 and Flash/Turbo $0.04 per 1k characters on the API | Startup plan (needed for Pro clone) $49/mo, 1.25M credits; Pro $5/mo for instant clone | n/a for cloning | Pay as you go after approval |
| Commercial use | Paid plans (Starter and up) include a commercial licence | Pro and up include a commercial-use licence | n/a | Covered by Azure terms after approval |
| Consent model | PVC: only your own voice, verified by voice captcha. "Even with their consent, you cannot clone someone else's voice." | Not detailed in pages read | Consent recording required | Recorded verbal consent statement from the voice talent |

## Why ElevenLabs

1. It is the only provider where Malay is documented for both voice cloning and several current TTS models.
2. Its PVC verification means **only Yusuf can create his clone**, from his own account. This matches
   the consent rule for this project, and nobody else can create the voice model for him.
3. It returns character-level timestamps. The engine uses them for subtitles, animation cues and
   mouth movement.
4. Audio tags on v3/v4 give natural emotion control. On v2 the engine falls back to stability and
   style settings.

Risks to test before committing to a paid plan:
- **Malay accent quality.** Listen for a Malaysian accent, not an Indonesian or generic one, and check
  code-switching in real script lines. The first listening session decides between Multilingual v2,
  Eleven v3 and v4.
- **PVC on v4 has no speed or style settings.** If emotion range matters on v4, the engine uses tags
  and punctuation only.
- **Pronunciation dictionary rules** were not fully confirmed. The engine applies aliases (respellings)
  locally, so it does not depend on them.

## Plan options for Yusuf

- **Fast start:** Starter plan with an Instant Voice Clone from 1 to 2 minutes of clean audio. It is
  good enough to test Malay quality and the whole pipeline.
- **Production:** Creator plan or higher with a Professional Voice Clone from at least 30 minutes, and
  ideally 1 to 3 hours, of approved recordings. Fine-tuning takes about 3 to 6 hours.

## Aiman's voice

Aiman should use a separate synthetic voice made with ElevenLabs Voice Design or a licensed library
voice. It must not be a clone of any real person. The `yusuf_alt` mode, which performs Aiman with
Yusuf's voice, stays off unless someone turns it on explicitly.

## Local/offline option

HyperFrames 0.9.97 bundles a local Kokoro `tts` command. It cannot clone a voice, and Malay is not
among the languages we have seen listed for Kokoro. The engine uses its own offline mock provider for
tests, and every mock output is flagged as placeholder audio.

## Network allow-list needed

To use the providers from the cloud workspace, allow:
- `api.elevenlabs.io` (synthesis, cloning, timestamps)
- `api.cartesia.ai` (only if Cartesia is used)

## Sources

- ElevenLabs PVC languages: https://elevenlabs.io/docs/help-center/product/voices/voice-cloning/what-languages-are-supported-with-professional-voice-cloning-pvc
- ElevenLabs supported languages: https://elevenlabs.io/docs/help-center/other/what-languages-do-you-support
- ElevenLabs voices overview: https://elevenlabs.io/docs/overview/capabilities/voices
- ElevenLabs PVC guide: https://elevenlabs.io/docs/eleven-creative/voices/voice-cloning/professional-voice-cloning
- ElevenLabs TTS with timestamps: https://elevenlabs.io/docs/api-reference/text-to-speech/convert-with-timestamps
- ElevenLabs pricing: https://elevenlabs.io/pricing and https://elevenlabs.io/pricing/api
- Cartesia Sonic 3.6: https://docs.cartesia.ai/build-with-cartesia/tts-models/latest
- Cartesia advanced capabilities: https://docs.cartesia.ai/build-with-cartesia/capability-guides/advanced-capabilities
- Cartesia Malay: https://cartesia.ai/languages/malay
- Cartesia pricing: https://www.cartesia.ai/pricing
- OpenAI text to speech: https://developers.openai.com/api/docs/guides/text-to-speech
- OpenAI audio model updates: https://developers.openai.com/blog/updates-audio-models
- Azure personal voice: https://learn.microsoft.com/azure/ai-services/speech-service/personal-voice-how-to-use
- Azure professional voice training: https://learn.microsoft.com/azure/ai-services/speech-service/professional-voice-train-voice
- Azure language support: https://learn.microsoft.com/azure/ai-services/speech-service/language-support
