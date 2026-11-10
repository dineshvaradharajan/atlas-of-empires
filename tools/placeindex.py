#!/usr/bin/env python3
""""This place through time": who held each half-degree square of the world, period by period.

Reads the border chunks public/data/clio/*.json (Cliopatria + the app's reconstructions are not included) and the
"clip"/"hide" ranges of content/corrections.json, rasterises every shape onto a 0.5° grid (cell centres, even-odd rule),
and writes one small file per 10° tile:

  public/data/place/<lon0>_<lat0>.json  {"names": [...], "cells": {"<col>,<row>": [[from, to, nameIndex], ...]}}

col/row are the cell's offsets inside the tile (0-19, west→east, south→north; cell = floor(lon * 2)). Runs of the same realm in consecutive
years are merged. Run: python3 -I tools/placeindex.py
"""
import glob, json, math, os, collections

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public", "data", "place")
K = 2  # cells per degree


def rings(geom):
    polys = geom["coordinates"] if geom["type"] == "MultiPolygon" else [geom["coordinates"]]
    return [r for p in polys for r in p]


def cells_of(geom):
    """Grid cells (index = floor(deg * K)) whose centre lies inside the shape (even-odd over all rings, so holes work)."""
    rows = collections.defaultdict(list)
    for ring in rings(geom):
        n = len(ring)
        for i in range(n):
            x1, y1 = ring[i - 1][0] * K, ring[i - 1][1] * K; x2, y2 = ring[i][0] * K, ring[i][1] * K
            if y1 == y2: continue
            lo, hi = min(y1, y2), max(y1, y2)
            r0, r1 = math.ceil(lo - 0.5), math.floor(hi - 0.5)  # rows whose centre (r + .5) is in [lo, hi)
            for r in range(r0, r1 + 1):
                yc = r + 0.5
                if not (lo <= yc < hi): continue
                rows[r].append(x1 + (yc - y1) * (x2 - x1) / (y2 - y1))
    out = []
    for r, xs in rows.items():
        xs.sort()
        for a, b in zip(xs[0::2], xs[1::2]):
            for c in range(math.ceil(a - 0.5), math.floor(b - 0.5) + 1):
                out.append((c, r))
    return out


def main():
    corr = json.load(open(os.path.join(ROOT, "content", "corrections.json"))).get("realms", {})
    grid = collections.defaultdict(list)  # (lonCell, latCell) -> [(from, to, name)]
    seen = set()
    for path in sorted(glob.glob(os.path.join(ROOT, "public", "data", "clio", "*.json"))):
        if path.endswith("index.json"): continue
        d = json.load(open(path))
        for f in d["features"] if isinstance(d, dict) else d:
            p = f["properties"]
            key = (p["n"], p["f"], p["t"], round(p.get("a", 0)))
            if key in seen: continue  # a shape spanning two century chunks appears in both
            seen.add(key)
            fr, to = p["f"], p["t"]
            c = corr.get(p["n"], {})
            if c.get("clip"): fr, to = max(fr, c["clip"][0]), min(to, c["clip"][1])
            spans = [(fr, to)]
            for a, b in c.get("hide", []):  # drop hidden years
                nxt = []
                for x, y in spans:
                    if b < x or a > y: nxt.append((x, y)); continue
                    if x < a: nxt.append((x, a - 1))
                    if y > b: nxt.append((b + 1, y))
                spans = nxt
            spans = [(x, y) for x, y in spans if x <= y]
            if not spans: continue
            for cx, cy in cells_of(f["geometry"]):
                if -180 * K <= cx < 180 * K and -90 * K <= cy < 90 * K:
                    for x, y in spans: grid[(cx, cy)].append((x, y, p["n"]))
    os.makedirs(OUT, exist_ok=True)
    for old in glob.glob(os.path.join(OUT, "*.json")): os.remove(old)
    tiles = collections.defaultdict(dict)
    for (cx, cy), runs in grid.items():
        runs.sort()
        merged = []
        for fr, to, n in runs:  # merge touching runs of the same realm
            if merged and merged[-1][2] == n and fr <= merged[-1][1] + 1: merged[-1][1] = max(merged[-1][1], to)
            else: merged.append([fr, to, n])
        tx, ty = (cx // (10 * K)) * 10, (cy // (10 * K)) * 10  # tile name: its south-west corner in degrees
        tiles[(tx, ty)][(cx - tx * K, cy - ty * K)] = merged
    total = 0
    for (tx, ty), cells in tiles.items():
        names = sorted({n for runs in cells.values() for _, _, n in runs})
        ix = {n: i for i, n in enumerate(names)}
        doc = {"names": names, "cells": {f"{c},{r}": [[a, b, ix[n]] for a, b, n in runs] for (c, r), runs in cells.items()}}
        fn = os.path.join(OUT, f"{tx}_{ty}.json")
        json.dump(doc, open(fn, "w"), ensure_ascii=False, separators=(",", ":"))
        total += os.path.getsize(fn)
    print(len(grid), "cells,", len(tiles), "tiles,", total // 1024, "KB")


if __name__ == "__main__":
    main()
