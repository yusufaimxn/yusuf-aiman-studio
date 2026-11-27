#!/usr/bin/env bash
# End-to-end test of the 3D character pipeline with the PLACEHOLDER mannequin (no real character needed).
# Needs scripts/setup.sh + scripts/setup-3d.sh. Usage: scripts/char3d-smoke.sh [path/to/voice.mp3]
set -euo pipefail
cd "$(dirname "$0")/.."
scripts/char3d mannequin testdummy
scripts/char3d rig testdummy
scripts/char3d face testdummy
mkdir -p renders/char3d-smoke
AUDIO=${1:-}
cat > renders/char3d-smoke/shot.json <<JSON
{"character":"testdummy","camera":"full","yaw_deg":25,"resolution":[1080,1920],"scale_percent":40,
 "engine":"${ENGINE:-workbench}","frames":${AUDIO:+0}${AUDIO:-3},"expression":"02_happy",
 ${AUDIO:+"audio":"$AUDIO",}
 "pose":{"LeftArm":[0,0,60],"RightForeArm":[0,0,-50]},"out":"renders/char3d-smoke/out"}
JSON
scripts/char3d render renders/char3d-smoke/shot.json
ffprobe -v error -show_entries stream=codec_name,width,height -of csv renders/char3d-smoke/out.webm
