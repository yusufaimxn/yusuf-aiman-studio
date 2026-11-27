#!/usr/bin/env bash
# One-shot environment setup for Yusuf Aiman Studio (Ubuntu 24.04, Node >= 22, Python 3.13).
set -euo pipefail
cd "$(dirname "$0")/.."
npm ci || npm install
# Headless Blender as a Python module (official PyPI wheel; must match Python 3.13)
[ -d .venv ] || python3 -m venv .venv
.venv/bin/pip install -q -r requirements.txt
# Software EGL so Blender EEVEE/Workbench can render without a GPU (Cycles works without it)
if ! ldconfig -p | grep -q libEGL.so.1; then
  sudo apt-get update -q && sudo apt-get install -y -q libegl1 libgl1-mesa-dri libegl-mesa0
fi
# HyperFrames official skills ship inside the npm package; keep project copies in sync
mkdir -p .claude/skills && cp -r node_modules/hyperframes/dist/skills/* .claude/skills/
scripts/hf telemetry disable >/dev/null 2>&1 || true
scripts/hf doctor --json | grep -q '"ok"' && echo "Setup complete."
