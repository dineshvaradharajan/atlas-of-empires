#!/usr/bin/env python3
"""Rivers, lakes and sea names for the base map, from Natural Earth 1:50m (public domain, naturalearthdata.com).

Input : a folder with ne_50m_rivers_lake_centerlines.geojson, ne_50m_lakes.geojson and
        ne_50m_geography_marine_polys.geojson (from github.com/nvkelso/natural-earth-vector, geojson/)
Output: public/data/physical.json
  {"rivers": [{"n": name, "r": rank, "c": [[[lon, lat], ...], ...]}],   rank 1 = largest
   "lakes":  [{"n": name, "r": rank, "c": [[[[lon, lat], ...]]]}],       polygons (rings)
   "seas":   [{"n": name, "r": rank, "k": kind, "l": [lon, lat]}]}       label point well inside the water
Reservoirs are left out (modern). Run: python3 -I tools/physical.py <folder>
"""
import json, math, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
R2 = lambda pts: [[round(x, 2), round(y, 2)] for x, y in pts]


def thin(pts, tol=0.04):
    """Drop points closer than tol degrees to the last kept one (keeps the ends)."""
    out = [pts[0]]
    for p in pts[1:-1]:
        if abs(p[0] - out[-1][0]) + abs(p[1] - out[-1][1]) >= tol: out.append(p)
    out.append(pts[-1])
    return out


def lines(geom):
    return geom["coordinates"] if geom["type"] == "MultiLineString" else [geom["coordinates"]]


def polys(geom):
    return geom["coordinates"] if geom["type"] == "MultiPolygon" else [geom["coordinates"]]


def inside(x, y, ring):
    c = False
    for i in range(len(ring)):
        (x1, y1), (x2, y2) = ring[i - 1], ring[i]
        if (y1 > y) != (y2 > y) and x < (x2 - x1) * (y - y1) / (y2 - y1) + x1: c = not c
    return c


def seg_dist(px, py, ax, ay, bx, by):
    dx, dy = bx - ax, by - ay
    t = max(0, min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy or 1)))
    return math.hypot(px - ax - t * dx, py - ay - t * dy)


def label_point(geom):
    """A point deep inside the largest polygon (coarse pole of inaccessibility)."""
    best_poly = max(polys(geom), key=lambda p: len(p[0]))
    ring = best_poly[0]
    xs, ys = [p[0] for p in ring], [p[1] for p in ring]
    x0, x1, y0, y1 = min(xs), max(xs), min(ys), max(ys)
    best, bd = None, -1
    n = 40
    for i in range(1, n):
        for j in range(1, n):
            x, y = x0 + (x1 - x0) * i / n, y0 + (y1 - y0) * j / n
            if not inside(x, y, ring) or any(inside(x, y, h) for h in best_poly[1:]): continue
            d = min(seg_dist(x, y, *ring[k - 1], *ring[k]) for k in range(0, len(ring), max(1, len(ring) // 400)))
            if d > bd: best, bd = (x, y), d
    return [round(best[0], 2), round(best[1], 2)] if best else None


def main(src):
    load = lambda f: json.load(open(os.path.join(src, f + ".geojson")))["features"]
    rivers = []
    for f in load("ne_50m_rivers_lake_centerlines"):
        p = f["properties"]
        cs = [R2(thin(l)) for l in lines(f["geometry"]) if len(l) > 1]
        if cs: rivers.append({"n": p.get("name_en") or p.get("name") or "", "r": int(p["scalerank"]), "c": cs})
    lakes = []
    for f in load("ne_50m_lakes"):
        p = f["properties"]
        if p.get("featurecla") == "Reservoir": continue
        ps = [[R2(thin(r, 0.03)) for r in poly] for poly in polys(f["geometry"])]
        lakes.append({"n": p.get("name_en") or p.get("name") or "", "r": int(p["scalerank"]), "c": ps})
    seas = []
    for f in load("ne_50m_geography_marine_polys"):
        p = f["properties"]
        name = p.get("name_en") or p.get("name")
        if not name: continue
        if name.isupper(): name = name.title()
        lp = label_point(f["geometry"])
        if lp: seas.append({"n": name, "r": int(p["scalerank"]), "k": p.get("featurecla", "").lower(), "l": lp})
    out = {"source": "Natural Earth 1:50m (public domain)", "rivers": rivers, "lakes": lakes, "seas": seas}
    path = os.path.join(ROOT, "public", "data", "physical.json")
    json.dump(out, open(path, "w"), ensure_ascii=False, separators=(",", ":"))
    print(len(rivers), "rivers", len(lakes), "lakes", len(seas), "seas", os.path.getsize(path) // 1024, "KB")


if __name__ == "__main__":
    main(sys.argv[1])
