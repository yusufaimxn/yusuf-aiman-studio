# Yusuf Aiman AI Video Studio

Turns a topic or script into a finished educational video with Yusuf Aiman (host) and Aiman (sidekick).

- Rules and layout: [CLAUDE.md](CLAUDE.md)
- Setup on a fresh Ubuntu machine: `scripts/setup.sh`
- New episode: `scripts/new-episode <slug>`, fill `episodes/<slug>/episode.yaml`, validate with `.venv/bin/python scripts/validate_episode.py episodes/<slug>`
- HyperFrames CLI (pinned): `scripts/hf <command>` from an episode folder
- Phase reports: [documentation/](documentation/)
