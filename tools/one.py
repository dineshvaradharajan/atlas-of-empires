#!/usr/bin/env python3
"""The combined atlas (public/one/): write its history frame, and at a release stamp its files with the version.

public/one/index.html shows World history inside a frame, public/one/hist.html. That frame is the home page itself with three
changes: a base address (so its files resolve from the folder above), no canonical link (search engines should not index it),
and the frame's own script (one/hist-patch.js) ahead of the map libraries. It used to be copied by hand; this writes it.

  python3 -I tools/one.py                         after editing public/index.html: refresh public/one/hist.html
  python3 -I tools/one.py --public DIR --version V   at a release (tools/deploy.sh): from the stamped index.html, and stamp one/index.html
"""
import argparse, os, re

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--public", default=os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "public"))
    ap.add_argument("--version", default="")
    a = ap.parse_args(); P, v = a.public, a.version
    s = open(os.path.join(P, "index.html"), encoding="utf-8").read()
    n = 0
    def once(pattern, repl, flags=0):
        nonlocal s, n
        s, k = re.subn(pattern, repl, s, count=1, flags=flags); n += k
    once(r'<meta charset="utf-8">', '<meta charset="utf-8">\n<!-- World history as the frame of the combined atlas (public/one/): written by tools/one.py from ../index.html. -->\n<base href="../">')
    once(r'<link rel="canonical"[^>]*>', '<meta name="robots" content="noindex">')
    once(r'<script src="vendor/d3-atlas', f'<script src="one/hist-patch.js{"?v=" + v if v else ""}"></script>\n<script src="vendor/d3-atlas')
    if n != 3: raise SystemExit(f"tools/one.py: expected to make 3 changes to index.html, made {n}")
    open(os.path.join(P, "one", "hist.html"), "w", encoding="utf-8").write(s)
    if v:  # a release: the page's own files and its data requests carry the version, as the other pages' do
        p = os.path.join(P, "one", "index.html"); t = open(p, encoding="utf-8").read()
        t, k = re.subn(r'(one\.css|phone\.css|one\.js|phone\.js|hist\.html)\?v=\d+', lambda m: f"{m.group(1)}?v={v}", t)
        if k != 5: raise SystemExit(f"tools/one.py: expected 5 versioned files in one/index.html, found {k}")
        t = t.replace('<meta charset="utf-8">', f'<meta charset="utf-8">\n<meta name="data-version" content="{v}">', 1)
        t = t.replace('"../fonts/fonts.css"', f'"../fonts/fonts.css?v={v}"')
        open(p, "w", encoding="utf-8").write(t)
    print(f"one: hist.html written{' and one/index.html stamped ' + v if v else ''}")

if __name__ == "__main__":
    main()
