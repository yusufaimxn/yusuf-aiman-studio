#!/usr/bin/env bash
# Extra tools for the 3D character pipeline (run after scripts/setup.sh).
# Rhubarb Lip Sync (MIT licence, offline): audio -> mouth shapes for lip sync.
set -euo pipefail
cd "$(dirname "$0")/.."
V=1.14.0
case "$(uname -s)" in
  Linux) OS=Linux ;; Darwin) OS=macOS ;; MINGW*|MSYS*|CYGWIN*) OS=Windows ;; *) echo "unknown OS"; exit 1 ;;
esac
if [ ! -d tools/rhubarb ]; then
  mkdir -p tools/rhubarb && cd tools/rhubarb
  curl -sSL -o r.zip "https://github.com/DanielSWolf/rhubarb-lip-sync/releases/download/v$V/Rhubarb-Lip-Sync-$V-$OS.zip"
  unzip -q r.zip && rm r.zip && cd ../..
fi
echo "Rhubarb: $(find tools/rhubarb -name 'rhubarb*' -type f -perm -u+x | head -1)"
