#!/usr/bin/env python3
"""Local dev server for public/ that tells the browser to revalidate every file (Cache-Control: no-cache).

Python's plain http.server sends no caching headers, so browsers guess and can keep running yesterday's app.js.
Run: python3 -I tools/serve.py [port]   (default 8765)
"""
import functools, http.server, os, sys

ROOT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "public")


class NoCache(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-cache")
        super().end_headers()


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8765
    http.server.ThreadingHTTPServer(("", port), functools.partial(NoCache, directory=ROOT)).serve_forever()
