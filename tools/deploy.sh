#!/bin/sh
# Deploy the committed site to Cloudflare Pages (project "worldatlas" -> www.worldatlas.site).
# Exports HEAD (never uncommitted work), stamps the release version on index.html so app.js, style.css and
# every data request carry ?v=<commit>, which lets browsers and the edge cache them for a year (public/_headers),
# preloads the two data files the map needs first, writes the crawlable pages, sitemaps and llms.txt (tools/seo.py), and packs the map files (tools/compact.py).
set -e
cd "$(dirname "$0")/.."
sh tools/vendor.sh check # the trimmed map library (public/vendor/) has every d3 name the scripts use, or nothing is deployed
V=$(git rev-parse --short HEAD)
D=$(mktemp -d)
git archive HEAD public tools/seo.py tools/compact.py | tar -x -C "$D"
python3 -I "$D/tools/seo.py" --public "$D/public"
python3 -I "$D/tools/compact.py" --public "$D/public" # border files and base maps in packed form (about half the download)
# World history (public/world.html, the frame inside the home page): the version on its script, styles and data requests
python3 -I - "$D/public/world.html" "$V" <<'PY'
import sys
p, v = sys.argv[1], sys.argv[2]
s = open(p).read()
s = s.replace('href="style.css"', f'href="style.css?v={v}"').replace('src="app.js"', f'src="app.js?v={v}"').replace('src="one/hist-patch.js"', f'src="one/hist-patch.js?v={v}"')
s = s.replace('href="fonts/fonts.css"', f'href="fonts/fonts.css?v={v}"')  # browsers keep the font list for a day: a new release must not wait for it
head = (f'<meta name="data-version" content="{v}">\n'
        f'<link rel="preload" href="data/clio/index.json?v={v}" as="fetch" crossorigin>\n'
        f'<link rel="preload" href="data/content.json?v={v}" as="fetch" crossorigin>\n')
s = s.replace('<meta charset="utf-8">', '<meta charset="utf-8">\n' + head, 1)
open(p, "w").write(s)
PY
# The home page (public/index.html, the two atlases under one timeline): the version on its own files; one.js adds it to its data requests
python3 -I - "$D/public/index.html" "$V" <<'PY'
import sys, re
p, v = sys.argv[1], sys.argv[2]
s = open(p).read()
s, n = re.subn(r'(one/(?:one|phone)\.(?:css|js))\?v=\d+', lambda m: f"{m.group(1)}?v={v}", s)
if n != 4: sys.exit(f"index.html: expected 4 versioned files of its own, found {n}")
s = s.replace('href="fonts/fonts.css"', f'href="fonts/fonts.css?v={v}"')
s = s.replace('<meta charset="utf-8">', f'<meta charset="utf-8">\n<meta name="data-version" content="{v}">\n<link rel="preload" href="data/earth-history.json?v={v}" as="fetch" crossorigin>', 1)
open(p, "w").write(s)
PY
# Earth history (public/earth-history/): the same version on its page, its scripts and styles; earth.js adds it to every data request
python3 -I - "$D/public/earth-history/index.html" "$V" <<'PY'
import sys
p, v = sys.argv[1], sys.argv[2]
s = open(p).read()
for f in ("earth.js", "earth.css", "atlas.css"): s = s.replace(f'"{f}"', f'"{f}?v={v}"')
s = s.replace('"../fonts/fonts-earth.css"', f'"../fonts/fonts-earth.css?v={v}"')
s = s.replace('<meta charset="utf-8">', f'<meta charset="utf-8">\n<meta name="data-version" content="{v}">', 1)
open(p, "w").write(s)
PY
grep -q "data-version" "$D/public/index.html"
grep -q "data-version" "$D/public/world.html"
grep -q "data-version" "$D/public/earth-history/index.html"
test -f "$D/public/sitemap.xml" && test -f "$D/public/404.html"
wrangler pages deploy "$D/public" --project-name=worldatlas --branch=main --commit-dirty=true
rm -rf "$D"
echo "Deployed release $V"
