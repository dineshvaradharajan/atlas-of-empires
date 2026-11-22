#!/bin/sh
# The two libraries the map needs, built to be served from the site itself (public/vendor/) instead of a CDN:
#   d3-atlas.min.js  only the parts of D3 the atlas uses (the list is in the entry file below), as one global `d3`
#   earcut.min.js    earcut as published, with its licence on top
# The versions are the ones inside d3.min.js 7.9.0, which the site loaded from cdnjs until now.
#
#   tools/vendor.sh [folder]   build. Needs node and npm. Packages are installed into the folder (default: a temporary
#                              one), never into the project. Also writes ?v=<hash of the file> on the two script tags in
#                              public/world.html, so the files can be cached for a year.
#   tools/vendor.sh check      no build: fail if a site script uses a d3.<name> that is not in the bundle.
#
# When app.js starts using another d3 member: add it to the entry file below, run this, commit public/vendor/.
set -e
cd "$(dirname "$0")/.."
OUT=public/vendor

check() { # every d3.<name> in the site's scripts must exist in the bundle, and the pieces reached indirectly must work
  node - "$OUT/d3-atlas.min.js" public/app.js public/one/one.js public/one/phone.js public/one/hist-patch.js <<'JS'
const fs = require("fs"), vm = require("vm"), [bundle, ...files] = process.argv.slice(2);
const box = vm.createContext({}); vm.runInContext(fs.readFileSync(bundle, "utf8"), box, { filename: bundle });
const d3 = box.d3, missing = [];
for (const f of files) if (fs.existsSync(f))
  for (const m of fs.readFileSync(f, "utf8").matchAll(/\bd3\.([A-Za-z_$][\w$]*)/g))
    if (!(m[1] in d3) && !missing.includes(`${m[1]} (${f})`)) missing.push(`${m[1]} (${f})`);
if (missing.length) { console.error("Not in " + bundle + ": d3." + missing.join(", d3.") + "\nAdd it to the entry file in tools/vendor.sh and rebuild."); process.exit(1); }
const sel = d3.select({}); // map zooms run as transitions on a selection: d3-transition has to be in the bundle
for (const k of ["transition", "interrupt", "call", "on"]) if (typeof sel[k] !== "function") { console.error(`selection.${k} is missing from ${bundle}`); process.exit(1); }
console.log(`${bundle}: ${Object.keys(d3).length} members, all the d3 names the site uses are there`);
JS
}
if [ "$1" = check ]; then check; exit; fi

W=${1:-$(mktemp -d)}
mkdir -p "$W" "$OUT"
cat > "$W/package.json" <<'JSON'
{
  "private": true,
  "dependencies": {
    "d3-geo": "3.1.1", "d3-zoom": "3.0.0", "d3-selection": "3.0.0", "d3-transition": "3.0.1", "d3-ease": "3.0.1",
    "earcut": "2.2.4", "esbuild": "0.28.1"
  },
  "overrides": {
    "d3-array": "3.2.4", "d3-color": "3.1.0", "d3-dispatch": "3.0.1", "d3-drag": "3.0.0", "d3-ease": "3.0.1",
    "d3-interpolate": "3.0.1", "d3-selection": "3.0.0", "d3-timer": "3.0.1", "d3-transition": "3.0.1", "internmap": "2.0.3"
  }
}
JSON
cat > "$W/d3-atlas.js" <<'JS'
// Everything the atlas reads from `d3` (public/app.js; public/one/one.js reaches the same object through the map's frame).
import "d3-transition"; // adds selection.transition() and selection.interrupt(), which the map's zooms run on
export { geoArea, geoBounds, geoCentroid, geoContains, geoDistance, geoEquirectangular, geoGraticule10, geoNaturalEarth1, geoPath } from "d3-geo";
export { select } from "d3-selection";
export { zoom, zoomIdentity } from "d3-zoom";
export { easeCubicInOut } from "d3-ease";
JS
(cd "$W" && npm install --ignore-scripts --no-audit --no-fund --loglevel=error)
(cd "$W" && node_modules/.bin/esbuild d3-atlas.js --bundle --minify --format=iife --global-name=d3 --legal-comments=none --log-level=warning --metafile=meta.json --outfile=d3-atlas.min.js)

# Which packages ended up in the bundle, with their versions: named in the header, licences in full in LICENSES.txt
PKGS=$(node -e '
const m = require(process.argv[1] + "/meta.json"), seen = new Set();
for (const [f, v] of Object.entries(Object.values(m.outputs)[0].inputs)) { const p = /node_modules\/([^/]+)\//.exec(f); if (p && v.bytesInOutput) seen.add(p[1]); }
console.log([...seen].sort().join(" "));' "$W")
LIST=$(for p in $PKGS; do printf '%s %s, ' "$p" "$(node -p 'require(process.argv[1]).version' "$W/node_modules/$p/package.json")"; done | sed 's/, $/./' | fold -s -w 112 | sed 's/^/ * /; s/ *$//')
{
  cat <<EOF
/*! d3-atlas: the parts of D3 7.9.0 (https://d3js.org) that The World Atlas uses, built by tools/vendor.sh from
$LIST
 * Copyright 2010-2024 Mike Bostock. ISC License:
 * Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby
 * granted, provided that the above copyright notice and this permission notice appear in all copies.
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
 * INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN
 * AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
 * PERFORMANCE OF THIS SOFTWARE.
 * Two of these packages carry further notices (d3-geo: GeographicLib, Charles Karney, MIT; d3-ease: easing equations,
 * Robert Penner, BSD): every package's licence is in full in LICENSES.txt beside this file. */
EOF
  cat "$W/d3-atlas.min.js"
} > "$OUT/d3-atlas.min.js"

# earcut: the published build, checked against the hash the page used to pin for the jsdelivr copy
E="$W/node_modules/earcut/dist/earcut.min.js"
[ "$(openssl dgst -sha384 -binary "$E" | openssl base64 -A)" = "2H0pAXlHBLfkdkuPuERxxSBlz7fMZ2EqrwxccEG7J9Svyk1SbUDaknB5UCoel/ZX" ] || { echo "earcut.min.js is not the 2.2.4 build the site used" >&2; exit 1; }
{
  cat <<'EOF'
/*! earcut 2.2.4 (https://github.com/mapbox/earcut). Copyright (c) 2016, Mapbox. ISC License:
 * Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby
 * granted, provided that the above copyright notice and this permission notice appear in all copies.
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
 * INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN
 * AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
 * PERFORMANCE OF THIS SOFTWARE. */
EOF
  cat "$E"
} > "$OUT/earcut.min.js"

{
  echo "Licences of the libraries in this folder (built by tools/vendor.sh)."
  for p in $PKGS earcut; do
    printf '\n\n================ %s %s ================\n\n' "$p" "$(node -p 'require(process.argv[1]).version' "$W/node_modules/$p/package.json")"
    cat "$W/node_modules/$p/LICENSE"
  done
} > "$OUT/LICENSES.txt"

check

# The script tags carry a hash of the file, so a rebuilt file is fetched afresh while the old one stays cached for a year
node - "$OUT" public/world.html <<'JS'
const fs = require("fs"), crypto = require("crypto"), [out, ...pages] = process.argv.slice(2);
for (const page of pages) {
  let s = fs.readFileSync(page, "utf8"), was = s;
  for (const f of ["d3-atlas.min.js", "earcut.min.js"]) {
    const v = crypto.createHash("sha256").update(fs.readFileSync(`${out}/${f}`)).digest("hex").slice(0, 10);
    s = s.replace(new RegExp(`(src="vendor/${f.replace(/\./g, "\\.")})(\\?v=[0-9a-f]*)?"`), `$1?v=${v}"`);
  }
  if (s !== was) { fs.writeFileSync(page, s); console.log("stamped " + page); }
}
JS
ls -l "$OUT"
