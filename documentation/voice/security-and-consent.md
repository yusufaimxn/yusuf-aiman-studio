# Voice ownership, consent and security

## Who may approve what

- **Yusuf Aiman** is the only person who can consent to cloning his voice. A teammate or an AI agent
  cannot give that consent for him.
- Each consent record names the providers it covers and lists the exact approved samples by SHA-256.
  Adding a new sample or a new provider needs a new or updated record.

## Enrollment flow

1. Yusuf records or uploads samples in the local enrollment UI (`python -m yavoice enroll-ui`). The UI
   only listens on `127.0.0.1`.
2. Every sample is checked automatically for length, clipping, noise, level and silence. A sample that
   fails cannot be approved.
3. A reviewer listens to each sample and marks it approved, rejected or deleted.
4. `python -m yavoice consent template > voice/consent/yusuf-elevenlabs.json` creates a record
   pre-filled with the approved sample hashes. Yusuf reads the statement, then sets
   `confirmed_by_speaker` to `true` and fills in `confirmed_at` and `confirmed_via`.
5. Upload to a provider only happens through `python -m yavoice clone ... --allow-remote`. The
   adapter checks the consent record before it opens any network connection.
   - **ElevenLabs PVC** is created by Yusuf himself in his own ElevenLabs account, which runs its own
     voice-captcha check. The engine then only stores the resulting voice id.
6. The new voice starts in `preview`. After listening tests, Yusuf sets the profile status to
   `approved`. Final exports refuse any voice that is not approved.

## Storage

| What | Where | In git? |
|---|---|---|
| Raw voice samples | `voice/samples/<SPEAKER>/` | No (gitignored) |
| Consent records | `voice/consent/*.json` | No (gitignored; only `TEMPLATE.md` is tracked) |
| API keys, voice ids | `.env` (from `.env.example`) or environment variables | No |
| Generated episode audio | `episodes/<slug>/assets/audio/voice/` | Your choice; treat as private until published |

Never paste API keys into scripts, profiles or chat. Never put samples in a public bucket or a public
repository.

## Voice model identification

`voice/profiles/YUSUF_AIMAN_VOICE_V1.json` holds the profile id, provider, model, the name of the
environment variable that holds the voice id, the status and a `history` list. Every generated segment
records the provider, model and voice id in its metadata, so any audio file can be traced back to the
voice that produced it.

## Deletion procedure

1. Remove samples locally: `python -m yavoice samples remove <sha-prefix> --speaker YUSUF`, or delete
   the folder `voice/samples/YUSUF/`.
2. Delete the voice at the provider. For ElevenLabs, delete it in the Voices page of Yusuf's account,
   or call `ElevenLabsProvider().delete_voice(id)`. Check the provider's retention policy for how long
   uploaded samples are kept after deletion.
3. Set `revoked: true` in the consent record, set the profile status to `rejected`, and remove the
   voice id from `.env`.

## Provider retention (to confirm before upload)

Read and save the current data-retention and usage terms of the chosen provider before the first
upload, and record the date checked here:
- ElevenLabs Terms of Service and Prohibited Use Policy (linked from the PVC guide). Not yet reviewed
  in full.
- Cartesia terms. Not yet reviewed.

## Use rules

- Use the cloned voice only for Yusuf Aiman studio content that Yusuf has approved.
- Never use it to make Yusuf appear to say something he has not approved, and never to impersonate
  anyone else.
- Aiman, a fictional character, gets a separate synthetic voice by default.
