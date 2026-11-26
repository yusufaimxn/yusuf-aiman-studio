"""Validate an episode's episode.yaml and (if present) breakdown.json.
Usage: .venv/bin/python scripts/validate_episode.py episodes/<slug>"""
import json, sys, pathlib
import yaml, jsonschema

ROOT = pathlib.Path(__file__).resolve().parent.parent

def main(ep_dir: str) -> int:
    ep = pathlib.Path(ep_dir)
    errors = []
    spec = yaml.safe_load((ep / "episode.yaml").read_text())
    schema = json.loads((ROOT / "templates/episode.schema.json").read_text())
    errors += [f"episode.yaml: {e.message}" for e in jsonschema.Draft202012Validator(schema).iter_errors(spec)]
    vo = (spec or {}).get("voiceover", {})
    if vo.get("source") == "supplied" and not (ep / vo.get("file", "")).is_file():
        errors.append(f"episode.yaml: supplied voiceover not found: {vo.get('file')}")
    bd_path = ep / "breakdown.json"
    if bd_path.exists():
        bd = json.loads(bd_path.read_text())
        bschema = json.loads((ROOT / "templates/breakdown.schema.json").read_text())
        errors += [f"breakdown.json: {e.message}" for e in jsonschema.Draft202012Validator(bschema).iter_errors(bd)]
        t = 0.0
        for s in bd.get("scenes", []):
            if abs(s.get("start_s", 0) - t) > 0.01:
                errors.append(f"breakdown.json: scene {s.get('id')} starts at {s.get('start_s')}, expected {round(t, 2)} (gap or overlap)")
            t = s.get("start_s", 0) + s.get("duration_s", 0)
            for a in s.get("assets", []):
                if a.get("status") != "missing" and not (ep / a["path"]).exists():
                    errors.append(f"breakdown.json: scene {s.get('id')} asset not found: {a['path']}")
        if abs(t - bd.get("total_duration_s", t)) > 0.01:
            errors.append(f"breakdown.json: scenes sum to {round(t, 2)} s but total_duration_s is {bd.get('total_duration_s')}")
    for e in errors:
        print("ERROR", e)
    print("OK" if not errors else f"{len(errors)} error(s)")
    return 1 if errors else 0

if __name__ == "__main__":
    sys.exit(main(sys.argv[1] if len(sys.argv) > 1 else "."))
