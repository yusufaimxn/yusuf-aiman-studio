"""Consent gate for voice enrollment.

No sample is ever sent to a third-party provider unless a consent record:
  * names the speaker whose voice it is (YUSUF AIMAN for the host voice),
  * was confirmed by that speaker personally (not by someone on their behalf),
  * lists the provider by name,
  * lists the SHA-256 of every sample being uploaded (so only reviewed,
    approved samples can go out),
  * has not been revoked or expired.

Consent records live in voice/consent/ which is gitignored. A template is in
voice/consent/TEMPLATE.json.
"""
from __future__ import annotations

import datetime as dt
import hashlib
import json
from pathlib import Path

from .providers.base import ConsentRequired

REQUIRED = ("speaker", "confirmed_by_speaker", "statement", "providers", "approved_sample_sha256",
            "confirmed_at")


def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def load_consent(path: Path) -> dict:
    return json.loads(Path(path).read_text())


def verify_consent(record: dict | None, provider: str, sample_paths: list[Path]) -> None:
    if not record:
        raise ConsentRequired("No consent record. The speaker must confirm consent before any "
                              "upload (see documentation/voice/security-and-consent.md).")
    missing = [k for k in REQUIRED if k not in record]
    if missing:
        raise ConsentRequired(f"Consent record is missing fields: {missing}")
    if record.get("confirmed_by_speaker") is not True:
        raise ConsentRequired("Consent must be confirmed by the speaker personally.")
    if record.get("revoked"):
        raise ConsentRequired("Consent has been revoked.")
    exp = record.get("expires_at")
    if exp and dt.datetime.fromisoformat(exp) < dt.datetime.now(dt.timezone.utc):
        raise ConsentRequired("Consent has expired.")
    if provider not in record["providers"]:
        raise ConsentRequired(f"Consent does not cover provider {provider!r}.")
    approved = set(record["approved_sample_sha256"])
    unapproved = [str(p) for p in sample_paths if sha256(Path(p)) not in approved]
    if unapproved:
        raise ConsentRequired(f"These samples are not in the approved list: {unapproved}")
