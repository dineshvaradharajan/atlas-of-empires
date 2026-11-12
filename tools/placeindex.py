#!/usr/bin/env python3
""""This place through time": who held each half-degree square of the world, period by period.

Reads what the app draws: the border chunks public/data/clio/*.json with every correction in content/corrections.json
(clip, hide, asPeople, crop, cut, relabel), plus the reconstruction layers in public/data/supplements.json (which hide the
Cliopatria realms they replace during the layer's years; archaeological cultures are left out, they are not states).
Rasterises every shape onto a 0.5° grid (cell centres, even-odd rule), and writes one small file per 10° tile:

  public/data/place/<lon0>_<lat0>.json  {"names": [...], "cells": {"<col>,<row>": [[from, to, nameIndex], ...]}}

col/row are the cell's offsets inside the tile (0-19, west→east, south→north; cell = floor(lon * 2)). Runs of the same realm in consecutive
years are merged. Run after tools/content.py (which builds supplements.json): python3 -I tools/placeindex.py
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


def cut_spans(spans, a, b):
    """drop the years a..b from a list of (from, to) spans"""
    out = []
    for x, y in spans:
        if b < x or a > y: out.append((x, y)); continue
        if x < a: out.append((x, a - 1))
        if y > b: out.append((b + 1, y))
    return out


def in_box(cx, cy, box):  # cell centre inside a lon/lat box
    x, y = (cx + 0.5) / K, (cy + 0.5) / K
    return box[0] <= x <= box[2] and box[1] <= y <= box[3]


def main():
    corr = json.load(open(os.path.join(ROOT, "content", "corrections.json"))).get("realms", {})
    sp = os.path.join(ROOT, "public", "data", "supplements.json")
    supps = [s for s in (json.load(open(sp)) if os.path.exists(sp) else []) if s.get("kind") != "cultures"]
    replaced = collections.defaultdict(list)  # Cliopatria realm -> years a reconstruction layer redraws it
    for s in supps:
        for n in s.get("replaces", []): replaced[n].append((s["from"], s["to"]))
    grid = collections.defaultdict(list)  # (lonCell, latCell) -> [(from, to, name)]
    seen = set()
    for path in sorted(glob.glob(os.path.join(ROOT, "public", "data", "clio", "*.json"))):
        if path.endswith("index.json"): continue
        d = json.load(open(path))
        for f in d["features"] if isinstance(d, dict) else d:
            p = f["properties"]
            if p.get("people"): continue
            key = (p["n"], p["f"], p["t"], round(p.get("a", 0)))
            if key in seen: continue  # a shape spanning two century chunks appears in both
            seen.add(key)
            fr, to = p["f"], p["t"]
            c = corr.get(p["n"], {})
            if c.get("clip"): fr, to = max(fr, c["clip"][0]), min(to, c["clip"][1])
            spans = [(fr, to)] if fr <= to else []
            for a, b in c.get("hide", []): spans = cut_spans(spans, a, b)
            for r in c.get("asPeople", []): spans = cut_spans(spans, r["from"], r["to"])  # drawn as a people, not a state
            for a, b in replaced.get(p["n"], []): spans = cut_spans(spans, a, b)
            if not spans: continue
            # years where the crop / cut boxes or the relabelled name change
            ranges = [(r["from"], r["to"]) for op in ("crop", "cut", "relabel") for r in c.get(op, [])]
            cells = None
            for x, y in spans:
                cuts = sorted({x, y + 1} | {v for a, b in ranges for v in (a, b + 1) if x < v <= y})
                for a, b in zip(cuts, cuts[1:]):
                    b -= 1
                    crop = next((r["box"] for r in c.get("crop", []) if r["from"] <= a <= r["to"]), None)
                    boxes = [r["box"] for r in c.get("cut", []) if r["from"] <= a <= r["to"]]
                    rl = next((r for r in c.get("relabel", []) if r["from"] <= a <= r["to"]), None)
                    name = rl["name"] if rl else p["n"]
                    if cells is None: cells = cells_of(f["geometry"])
                    for cx, cy in cells:
                        if not (-180 * K <= cx < 180 * K and -90 * K <= cy < 90 * K): continue
                        if crop and not in_box(cx, cy, crop): continue
                        if any(in_box(cx, cy, bx) for bx in boxes): continue
                        grid[(cx, cy)].append((a, b, name))
    for s in supps:
        for rg in s["regions"]:
            fr, to = rg.get("from", s["from"]), rg.get("to", s["to"])
            for cx, cy in cells_of({"type": "Polygon", "coordinates": [rg["coords"]]}):
                if -180 * K <= cx < 180 * K and -90 * K <= cy < 90 * K: grid[(cx, cy)].append((fr, to, rg["name"]))
    os.makedirs(OUT, exist_ok=True)
    for old in glob.glob(os.path.join(OUT, "*.json")): os.remove(old)
    tiles = collections.defaultdict(dict)
    for (cx, cy), runs in grid.items():
        last = {}
        merged = []
        for fr, to, n in sorted(runs):  # merge touching or overlapping runs of the same realm
            m = last.get(n)
            if m and fr <= m[1] + 1: m[1] = max(m[1], to)
            else: m = last[n] = [fr, to, n]; merged.append(m)
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
