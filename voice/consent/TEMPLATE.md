# Consent records

Real consent records (`*.json`) live in this folder and are gitignored.
Generate one with `python -m yavoice consent template --provider elevenlabs > voice/consent/yusuf-elevenlabs.json`.
Only Yusuf Aiman may set `confirmed_by_speaker` to `true`. See `documentation/voice/security-and-consent.md`.
