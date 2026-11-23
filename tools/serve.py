#!/usr/bin/env python3
"""Local dev server for public/ that tells the browser to revalidate every file (Cache-Control: no-cache).

Python's plain http.server sends no caching headers, so browsers guess and can keep running yesterday's app.js.
Run: python3 -I tools/serve.py [port]   (default 8765)

It also stands in for the "Report an issue" endpoint (functions/api/report.js, a Cloudflare Pages Function in production):
POST /api/report prints the report here and answers as the real one does, without sending any email. To see the panel's
other states, start the feedback text with "#fail" (the server errs), "#slow" (a 4 s wait) or "#limit" (too many reports).
To run the real function locally instead: wrangler pages dev public (with REPORT_DRY_RUN=1 and REPORT_TO in .dev.vars).
"""
import functools, http.server, json, os, sys, time

ROOT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "public")


class NoCache(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-cache")
        super().end_headers()

    def _json(self, status, body):
        data = json.dumps(body).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def do_POST(self):
        if self.path.split("?")[0] != "/api/report":
            return self._json(404, {"ok": False, "error": "not-found"})
        n = int(self.headers.get("Content-Length") or 0)
        if n > 24 * 1024:
            return self._json(413, {"ok": False, "error": "too-large"})
        try:
            b = json.loads(self.rfile.read(n) or b"{}")
        except ValueError:
            return self._json(400, {"ok": False, "error": "bad-json"})
        msg = str(b.get("message") or "").strip()
        if len(msg) < 3:
            return self._json(422, {"ok": False, "error": "message-required"})
        if msg.startswith("#slow"):
            time.sleep(4)
        if msg.startswith("#fail"):
            return self._json(502, {"ok": False, "error": "send-failed"})
        if msg.startswith("#limit"):
            return self._json(429, {"ok": False, "error": "rate-limited"})
        print("\n--- report (local mock, not sent) ---\n" + json.dumps(b, indent=2, ensure_ascii=False), flush=True)
        self._json(200, {"ok": True, "mock": True})


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8765
    http.server.ThreadingHTTPServer(("", port), functools.partial(NoCache, directory=ROOT)).serve_forever()
