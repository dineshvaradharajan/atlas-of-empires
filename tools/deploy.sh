#!/bin/sh
# Deploy the committed site to Cloudflare Pages (project "worldatlas" -> www.worldatlas.site).
# Exports HEAD (never uncommitted work), stamps the release version on index.html so app.js, style.css and
# every data request carry ?v=<commit>, which lets browsers and the edge cache them for a year (public/_headers),
# preloads the two data files the map needs first, and writes the crawlable pages, sitemaps and llms.txt (tools/seo.py).
set -e
cd "$(dirname "$0")/.."
V=$(git rev-parse --short HEAD)
D=$(mktemp -d)
git archive HEAD public tools/seo.py | tar -x -C "$D"
python3 -I "$D/tools/seo.py" --public "$D/public"
python3 -I - "$D/public/index.html" "$V" <<'PY'
import sys
p, v = sys.argv[1], sys.argv[2]
s = open(p).read()
s = s.replace('href="style.css"', f'href="style.css?v={v}"').replace('src="app.js"', f'src="app.js?v={v}"')
head = (f'<meta name="data-version" content="{v}">\n'
        f'<link rel="preload" href="data/clio/index.json?v={v}" as="fetch" crossorigin>\n'
        f'<link rel="preload" href="data/content.json?v={v}" as="fetch" crossorigin>\n')
s = s.replace('<meta charset="utf-8">', '<meta charset="utf-8">\n' + head, 1)
open(p, "w").write(s)
PY
grep -q "data-version" "$D/public/index.html"
test -f "$D/public/sitemap.xml" && test -f "$D/public/404.html"
wrangler pages deploy "$D/public" --project-name=worldatlas --branch=main --commit-dirty=true
rm -rf "$D"
echo "Deployed release $V"
