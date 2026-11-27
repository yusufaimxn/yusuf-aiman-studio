#!/usr/bin/env bash
# Build the 16:9 project next to the 9:16 one: same scenes, landscape root + 1920x1080 scene roots.
# Layout differences live in CSS media queries (min-aspect-ratio: 1/1) and window.YA_LAND.
set -euo pipefail
EP="$(cd "$(dirname "$0")/.." && pwd)"; OUT="${1:?output dir}"
rm -rf "$OUT"; mkdir -p "$OUT"
cp -r "$EP/assets" "$EP/compositions" "$EP/hyperframes.json" "$OUT/"
cp "$EP/tools/landscape.index.html" "$OUT/index.html"
sed -i 's/data-width="1080" data-height="1920"/data-width="1920" data-height="1080"/' "$OUT"/compositions/*.html
