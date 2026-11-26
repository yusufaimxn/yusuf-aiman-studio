"""Command line for the Yusuf Aiman voice engine.

    python -m yavoice providers
    python -m yavoice samples add rec1.wav rec2.mp3 --speaker YUSUF --style excited
    python -m yavoice samples list --speaker YUSUF
    python -m yavoice samples approve <sha-prefix> --speaker YUSUF --reviewer "Yusuf Aiman"
    python -m yavoice samples reject|remove <sha-prefix> --speaker YUSUF
    python -m yavoice consent template > voice/consent/yusuf-elevenlabs.json
    python -m yavoice clone --speaker YUSUF --provider elevenlabs --consent voice/consent/yusuf-elevenlabs.json --allow-remote
    python -m yavoice lexicon check script.txt
    python -m yavoice synth script.txt --episode apa-itu-ai [--mock | --allow-remote] [--final] [--regen ID ...]
    python -m yavoice approve --episode apa-itu-ai --segment intro-000-00
    python -m yavoice qa --episode apa-itu-ai [--transcript t.json] [--target 90] [--final]
    python -m yavoice master --episode apa-itu-ai [--music bed.mp3]
    python -m yavoice enroll-ui [--port 8765]
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path


def _load_env() -> None:
    """Load KEY=VALUE pairs from the repo .env (gitignored) without overriding real env vars."""
    import os
    env = Path(__file__).resolve().parents[2] / ".env"
    if env.exists():
        for line in env.read_text().splitlines():
            if "=" in line and not line.lstrip().startswith("#"):
                k, v = line.split("=", 1)
                os.environ.setdefault(k.strip(), v.strip().strip('"'))


def main(argv: list[str] | None = None) -> int:
    _load_env()
    ap = argparse.ArgumentParser(prog="yavoice")
    sub = ap.add_subparsers(dest="cmd", required=True)

    sub.add_parser("providers")

    sp = sub.add_parser("samples")
    sp.add_argument("action", choices=["add", "list", "approve", "reject", "remove"])
    sp.add_argument("items", nargs="*")
    sp.add_argument("--speaker", default="YUSUF")
    sp.add_argument("--style", default="conversational")
    sp.add_argument("--reviewer", default="")

    cp = sub.add_parser("consent")
    cp.add_argument("action", choices=["template", "check"])
    cp.add_argument("--file")
    cp.add_argument("--provider", default="elevenlabs")
    cp.add_argument("--speaker", default="YUSUF")

    cl = sub.add_parser("clone")
    cl.add_argument("--speaker", default="YUSUF")
    cl.add_argument("--provider", default="elevenlabs")
    cl.add_argument("--consent", required=True)
    cl.add_argument("--kind", default="instant", choices=["instant", "professional"])
    cl.add_argument("--allow-remote", action="store_true")

    lx = sub.add_parser("lexicon")
    lx.add_argument("action", choices=["check"])
    lx.add_argument("script")

    sy = sub.add_parser("synth")
    sy.add_argument("script")
    sy.add_argument("--episode", required=True)
    sy.add_argument("--mock", action="store_true", help="offline placeholder tones; never final")
    sy.add_argument("--allow-remote", action="store_true", help="permit paid provider API calls")
    sy.add_argument("--final", action="store_true")
    sy.add_argument("--regen", nargs="*", default=[])
    sy.add_argument("--preset")

    apv = sub.add_parser("approve")
    apv.add_argument("--episode", required=True)
    apv.add_argument("--segment", required=True)
    apv.add_argument("--key")

    q = sub.add_parser("qa")
    q.add_argument("--episode", required=True)
    q.add_argument("--transcript")
    q.add_argument("--target", type=float)
    q.add_argument("--final", action="store_true")

    m = sub.add_parser("master")
    m.add_argument("--episode", required=True)
    m.add_argument("--music")
    m.add_argument("--preset")

    ui = sub.add_parser("enroll-ui")
    ui.add_argument("--port", type=int, default=8765)

    a = ap.parse_args(argv)

    if a.cmd == "providers":
        from .providers import get_provider
        rows = {}
        for name, model in [("elevenlabs", "eleven_multilingual_v2"), ("elevenlabs", "eleven_v3"),
                            ("cartesia", "sonic-3.6"), ("mock", None)]:
            c = get_provider(name).capabilities(model)
            rows[f"{name}:{model}"] = {k: (sorted(v) if isinstance(v, set) else v) for k, v in c.__dict__.items()}
        print(json.dumps(rows, indent=2))

    elif a.cmd == "samples":
        from .enroll import Manifest
        man = Manifest(a.speaker)
        if a.action == "add":
            for f in a.items:
                e = man.add(Path(f), style=a.style)
                print(json.dumps({k: e[k] for k in ("sha256", "original_name", "qa")}, indent=2))
        elif a.action == "list":
            for e in man.data["samples"].values():
                print(f"{e['sha256'][:12]}  {e['status']:8}  {e['qa']['duration']:7.1f}s  "
                      f"{'PASS' if e['qa']['passed'] else 'FAIL'}  {e['style']:14} {e['original_name']}  "
                      f"{'; '.join(e['qa']['issues'] + e['qa']['warnings'])}")
            print(json.dumps(man.summary()))
        elif a.action in ("approve", "reject"):
            for d in a.items:
                man.set_status(d, "approved" if a.action == "approve" else "rejected", a.reviewer or "unknown")
            print(json.dumps(man.summary()))
        else:
            for d in a.items:
                man.remove(d)
            print(json.dumps(man.summary()))

    elif a.cmd == "consent":
        if a.action == "template":
            from .enroll import Manifest
            man = Manifest(a.speaker)
            print(json.dumps({
                "speaker": "Yusuf Aiman",
                "confirmed_by_speaker": False,
                "statement": ("I, Yusuf Aiman, confirm these recordings are my own voice, and I consent to them "
                              "being sent to the providers listed to create a voice model used only for my own "
                              "content in the Yusuf Aiman studio."),
                "providers": [a.provider],
                "approved_sample_sha256": [e["sha256"] for e in man.approved()],
                "confirmed_at": "",
                "confirmed_via": "e.g. message in the project thread, link or date",
                "expires_at": None,
                "revoked": False}, indent=2))
        else:
            from .consent import load_consent, verify_consent
            from .enroll import Manifest
            verify_consent(load_consent(Path(a.file)), a.provider, Manifest(a.speaker).approved_paths())
            print("consent OK")

    elif a.cmd == "clone":
        from .consent import load_consent
        from .enroll import Manifest
        from .providers import CloneRequest, get_provider
        prov = get_provider(a.provider)
        if prov.remote and not a.allow_remote:
            print("Refusing: cloning uploads samples to a paid third-party API. Add --allow-remote.", file=sys.stderr)
            return 2
        man = Manifest(a.speaker)
        paths = man.approved_paths()
        if not paths:
            print("No approved samples. A voice model cannot be created without real recordings.", file=sys.stderr)
            return 2
        vid = prov.create_clone(CloneRequest(name="YUSUF_AIMAN_VOICE_V1", sample_paths=paths, language="ms",
                                             description="Yusuf Aiman host voice", kind=a.kind),
                                load_consent(Path(a.consent)))
        print(json.dumps({"voice_id": vid, "next": "put it in .env as YUSUF_VOICE_ID and set the profile "
                                                   "status to 'preview' to review it"}))

    elif a.cmd == "lexicon":
        from .lexicon import Lexicon
        from .script import parse
        lex = Lexicon.load()
        text = " ".join(l.text for l in parse(Path(a.script).read_text()).lines)
        print(json.dumps({"unknown_terms": lex.unknown_terms(text)}, indent=2))

    elif a.cmd == "synth":
        from .pipeline import Pipeline
        from .sync import write_cues
        p = Pipeline(a.episode, Path(a.script).read_text(), provider_override="mock" if a.mock else None,
                     allow_remote=a.allow_remote, mode="final" if a.final else "preview", preset=a.preset)
        res = p.run(regenerate=set(a.regen))
        write_cues(p.out)
        print(json.dumps({"duration": res["duration"], "segments": len(res["segments"]),
                          "placeholder_audio": res["placeholder_audio"], "out": str(p.out)}, indent=2))

    elif a.cmd == "approve":
        from .pipeline import episode_audio_dir
        vp = episode_audio_dir(a.episode) / "versions.json"
        v = json.loads(vp.read_text())
        hist = v[a.segment]
        tgt = next(h for h in reversed(hist) if a.key is None or h["key"] == a.key)
        for h in hist:
            h["approved"] = h is tgt
        vp.write_text(json.dumps(v, indent=2))
        print(f"approved {a.segment} take {tgt['take']}")

    elif a.cmd == "qa":
        from .pipeline import episode_audio_dir
        from .qa import run_qa
        tr = json.loads(Path(a.transcript).read_text()) if a.transcript else None
        r = run_qa(episode_audio_dir(a.episode), tr, a.target, a.final)
        print(json.dumps({k: r[k] for k in ("passed", "issues", "warnings", "listen_first")}, indent=2,
                         ensure_ascii=False))
        return 0 if r["passed"] else 1

    elif a.cmd == "master":
        from .pipeline import REPO, episode_audio_dir
        from .post import Preset, master
        d = episode_audio_dir(a.episode)
        tl = json.loads((d / "timeline.json").read_text())
        sfx_dir = REPO / "assets" / "audio" / "sfx"
        sfx, missing = [], []
        for s in tl["segments"]:
            for name in s.get("sfx_after", []):
                f = next(iter(sorted(sfx_dir.glob(f"{name}.*"))), None) if sfx_dir.exists() else None
                (sfx.append((f, s["end"] + 0.05, -8.0)) if f else missing.append(name))
        out = master(d / "narration.wav", d / "mix.wav", Preset.load(a.preset or tl["preset"]),
                     Path(a.music) if a.music else None, sfx)
        print(json.dumps({"mix": str(out), "sfx_placed": len(sfx), "sfx_missing": sorted(set(missing))}))

    elif a.cmd == "enroll-ui":
        from .server import serve
        serve(a.port)
    return 0


if __name__ == "__main__":
    sys.exit(main())
