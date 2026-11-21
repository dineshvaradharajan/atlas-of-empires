#!/usr/bin/env python3
"""The detailed coastline the map draws when zoomed in: Natural Earth 1:10m land (public domain), in 10° tiles.

The border files are drawn from Cliopatria, whose coasts lie a median 5-9 km off the real coast (a tenth of points
15-30 km off); the base maps are as coarse. That is under a pixel at world scale but 5-30 pixels at the closest zoom,
where coasts looked blocky and realms stopped short of the sea or ran out over it. Zoomed in, the page loads the tiles
in view and clips every territory to this land, so the coast is drawn to within ~0.5 km (public/app.js, "detailed
coastline"). The tiles are only fetched past a zoom threshold, so the world view and phones download nothing extra.

Land = the countries' polygons with the borders between them dissolved (tools/coast.py), simplified to SIMPLIFY,
islands smaller than MIN_DIAG dropped, each ring cut to the tiles it crosses. Coordinates are stored like the packed
border files (tools/compact.py): whole numbers in thousandths of a degree, each a step from the one before.

Input : ne_10m_admin_0_countries.geojson (github.com/nvkelso/natural-earth-vector, geojson/)
Output: public/data/coast/<lon>_<lat>.json   {"scale": 3, "rings": [[dx, dy, ...], ...]}  (lon/lat: the tile's SW corner)
        public/data/coast/index.json         {"tile": 10, "tiles": {"<lon>_<lat>": bytes, ...}}
Run: python3 -I tools/build_detail.py <ne_10m_admin_0_countries.geojson>
"""
import json
import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from build import dp  # noqa: E402
from coast import Land  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public", "data", "coast")
TILE = 10          # degrees
SIMPLIFY = 0.004   # degrees (~450 m): half a pixel at the closest zoom on a wide screen
MIN_DIAG = 0.012   # degrees (~1.3 km): smaller islands are left out
SOUTH = -60        # no tiles south of this (the map shows the world to 57°S)
SCALE = 3          # decimals kept


def simplify(r):
    if len(r) > 8:
        m = len(r) // 2
        r = dp(r[: m + 1], SIMPLIFY)[:-1] + dp(r[m:], SIMPLIFY)
    return r


def clip(ring, x0, y0, x1, y1):
    """Sutherland-Hodgman: the part of a closed ring inside a box (edges along the box where the land was cut)."""
    pts = ring[:-1]
    for inside, cut in (
        (lambda p: p[0] >= x0, lambda a, b: [x0, a[1] + (b[1] - a[1]) * (x0 - a[0]) / (b[0] - a[0])]),
        (lambda p: p[0] <= x1, lambda a, b: [x1, a[1] + (b[1] - a[1]) * (x1 - a[0]) / (b[0] - a[0])]),
        (lambda p: p[1] >= y0, lambda a, b: [a[0] + (b[0] - a[0]) * (y0 - a[1]) / (b[1] - a[1]), y0]),
        (lambda p: p[1] <= y1, lambda a, b: [a[0] + (b[0] - a[0]) * (y1 - a[1]) / (b[1] - a[1]), y1]),
    ):
        if not pts:
            return []
        out = []
        for i, b in enumerate(pts):
            a = pts[i - 1]
            if inside(b):
                if not inside(a):
                    out.append(cut(a, b))
                out.append(b)
            elif inside(a):
                out.append(cut(a, b))
        pts = out
    return pts + pts[:1] if len(pts) >= 3 else []


def pack(ring):
    m = 10 ** SCALE
    out, px, py = [], 0, 0
    for x, y in ring:
        X, Y = round(x * m), round(y * m)
        if out and X == px and Y == py:
            continue
        out += [X - px, Y - py]
        px, py = X, Y
    return out if len(out) >= 8 else None


def main():
    land = Land.load(sys.argv[1])
    tiles = {}
    kept = dropped = 0
    for r in land.rings():
        r = [list(p) for p in r]
        xs, ys = [p[0] for p in r], [p[1] for p in r]
        if math.hypot(max(xs) - min(xs), max(ys) - min(ys)) < MIN_DIAG or max(ys) < SOUTH:
            dropped += 1
            continue
        r = simplify(r)
        if len(r) < 4:
            dropped += 1
            continue
        kept += 1
        for tx in range(math.floor(min(xs) / TILE) * TILE, math.floor(max(xs) / TILE) * TILE + 1, TILE):
            for ty in range(max(SOUTH, math.floor(min(ys) / TILE) * TILE), math.floor(max(ys) / TILE) * TILE + 1, TILE):
                part = clip(r, tx, ty, tx + TILE, ty + TILE)
                q = pack(part) if part else None
                if q:
                    tiles.setdefault(f"{tx}_{ty}", []).append(q)
    os.makedirs(OUT, exist_ok=True)
    for f in os.listdir(OUT):
        os.remove(os.path.join(OUT, f))
    index = {}
    for k, rings in sorted(tiles.items()):
        p = os.path.join(OUT, f"{k}.json")
        with open(p, "w") as fh:
            json.dump({"scale": SCALE, "rings": rings}, fh, separators=(",", ":"))
        index[k] = os.path.getsize(p)
    with open(os.path.join(OUT, "index.json"), "w") as fh:
        json.dump({"tile": TILE, "tiles": index}, fh, separators=(",", ":"))
    print(f"{kept} land rings ({dropped} islets dropped), {len(tiles)} tiles, {sum(index.values()) / 1e6:.1f} MB, "
          f"largest {max(index.values()) / 1e3:.0f} KB")


if __name__ == "__main__":
    main()
