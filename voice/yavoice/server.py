"""Local-only enrollment web UI (upload, record via microphone, review, approve/remove).

Binds to 127.0.0.1 so samples never leave the machine. Nothing here talks to a
voice provider; uploading to a provider is a separate, consent-gated CLI step.
"""
from __future__ import annotations

import json
import re
import tempfile
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from .enroll import ACCEPTED_EXT, Manifest

UI = Path(__file__).resolve().parents[1] / "enroll_ui" / "index.html"
MAX_UPLOAD = 200 * 1024 * 1024


class Handler(BaseHTTPRequestHandler):
    def _json(self, obj, code=200):
        body = json.dumps(obj).encode()
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _speaker(self) -> str:
        m = re.search(r"speaker=([A-Z_]+)", self.path)
        return m.group(1) if m else "YUSUF"

    def do_GET(self):
        if self.path in ("/", "/index.html"):
            body = UI.read_bytes()
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.end_headers()
            self.wfile.write(body)
        elif self.path.startswith("/api/samples"):
            man = Manifest(self._speaker())
            self._json({"samples": list(man.data["samples"].values()), "summary": man.summary()})
        elif self.path.startswith("/api/audio/"):
            name = Path(self.path.split("?")[0].rsplit("/", 1)[-1]).name  # no traversal
            f = Manifest(self._speaker()).dir / name
            if not f.exists():
                return self._json({"error": "not found"}, 404)
            self.send_response(200)
            self.send_header("Content-Type", "application/octet-stream")
            self.end_headers()
            self.wfile.write(f.read_bytes())
        else:
            self._json({"error": "not found"}, 404)

    def do_POST(self):
        n = int(self.headers.get("Content-Length", 0))
        if n > MAX_UPLOAD:
            return self._json({"error": "file too large"}, 413)
        data = self.rfile.read(n)
        man = Manifest(self._speaker())
        try:
            if self.path.startswith("/api/upload"):
                name = Path(self.headers.get("X-Filename", "recording.webm")).name
                ext = Path(name).suffix.lower()
                if ext not in ACCEPTED_EXT:
                    return self._json({"error": f"unsupported format {ext}"}, 400)
                with tempfile.TemporaryDirectory() as td:
                    p = Path(td) / name
                    p.write_bytes(data)
                    e = man.add(p, style=self.headers.get("X-Style", "conversational"))
                return self._json(e)
            body = json.loads(data or b"{}")
            if self.path.startswith("/api/status"):
                return self._json(man.set_status(body["sha256"], body["status"], body.get("reviewer", "")))
            if self.path.startswith("/api/remove"):
                man.remove(body["sha256"])
                return self._json({"ok": True})
        except Exception as ex:  # report to the page instead of dropping the connection
            return self._json({"error": str(ex)}, 400)
        self._json({"error": "not found"}, 404)

    def log_message(self, *args):
        pass


def serve(port: int = 8765) -> None:
    print(f"Enrollment UI on http://127.0.0.1:{port}  (local only, Ctrl+C to stop)")
    ThreadingHTTPServer(("127.0.0.1", port), Handler).serve_forever()
