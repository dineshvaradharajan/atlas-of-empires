#!/usr/bin/env python3
"""Compact Cliopatria (Seshat Global History Databank, CC BY 4.0) for the web.

Input : data/clio/cliopatria_polities_only_v*.geojson
Output: public/data/clio/<century>.json   rows (with geometry) active in that century
        public/data/clio/index.json       per-realm metadata + territory timelines

A Cliopatria row = one polity's territory for FromYear..ToYear (inclusive).
Rows named "(X)" are composites (an empire = its member polities); members carry
MemberOf "(X)". We draw members, colour them by their outermost group, and use the
composite rows only for metadata/area (their geometry duplicates the members).

Run: python3 -I tools/build_clio.py
"""
import glob
import json
import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from build import dp, inside, orient, seg_dist  # noqa: E402  (shared geometry helpers)

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public", "data", "clio")
CHUNK = 100
EPS = 0.03  # degrees (~3 km): ample for a world map zoomed up to ~20x


def simplify_ring(r):
    out = []
    for x, y, *_ in r:
        p = [round(x, 2), round(y, 2)]
        if not out or p != out[-1]:
            out.append(p)
    if len(out) > 8:
        m = len(out) // 2
        out = dp(out[: m + 1], EPS)[:-1] + dp(out[m:], EPS)
    if out and out[0] != out[-1]:
        out.append(out[0])
    return out if len(out) >= 4 else None


def ring_area_planar(r):
    return abs(sum(r[i][0] * r[i + 1][1] - r[i + 1][0] * r[i][1] for i in range(len(r) - 1))) / 2


def label_point(poly):
    outer = poly[0]
    xs = [p[0] for p in outer]
    ys = [p[1] for p in outer]
    x0, x1, y0, y1 = min(xs), max(xs), min(ys), max(ys)
    step = max(1, len(outer) // 60)
    edges = [(outer[i], outer[i + 1]) for i in range(0, len(outer) - 1, step)]
    best, bp = -1, [(x0 + x1) / 2, (y0 + y1) / 2]
    n = 10
    for i in range(1, n):
        for j in range(1, n):
            p = [x0 + (x1 - x0) * i / n, y0 + (y1 - y0) * j / n]
            if not inside(p, outer) or any(inside(p, h) for h in poly[1:]):
                continue
            d = min(seg_dist(p, a, b) for a, b in edges)
            if d > best:
                best, bp = d, p
    return [round(bp[0], 2), round(bp[1], 2)]


# Chunk boundaries: borders change far more often in recent centuries, so chunks shrink.
STARTS = list(range(-3500, 1500, 100)) + list(range(1500, 1800, 50)) + list(range(1800, 2050, 25))


def next_start(c):
    i = STARTS.index(c)
    return STARTS[i + 1] if i + 1 < len(STARTS) else 10 ** 6


def groups_of(p):
    m = (p.get("MemberOf") or "").strip()
    return [g for g in m.split(";") if g and not g.startswith(("(Alliance", "(Allegiance"))] if m else []


def main():
    src = sorted(glob.glob(os.path.join(ROOT, "data", "clio", "cliopatria_polities_only_v*.geojson")))[-1]
    feats = json.load(open(src))["features"]
    os.makedirs(OUT, exist_ok=True)

    # overall size of each composite group -> pick the outermost group for colouring
    gsize = {}
    for f in feats:
        p = f["properties"]
        if p["Name"].startswith("("):
            gsize[p["Name"]] = max(gsize.get(p["Name"], 0), p["Area"])

    realms, chunks = {}, {}
    for i, f in enumerate(feats):
        p = f["properties"]
        name, fy, ty, area = p["Name"], int(p["FromYear"]), int(p["ToYear"]), round(p["Area"])
        comp = name.startswith("(")
        r = realms.setdefault(name, {"wiki": p.get("Wikipedia") or "", "wd": p.get("Wikidata") or "",
                                      "seshat": p.get("SeshatID") or "", "tl": [], "group": comp})
        r["tl"].append([fy, ty, area])
        gs = groups_of(p)
        if gs:
            r.setdefault("memberOf", [])
            for g in gs:
                if g not in r["memberOf"]:
                    r["memberOf"].append(g)
        if comp:
            continue  # composite: metadata only
        geom = f["geometry"]
        polys = [geom["coordinates"]] if geom["type"] == "Polygon" else geom["coordinates"]
        out, big = [], (0, None)
        for poly in polys:
            rings = [simplify_ring(rg) for rg in poly]
            if rings[0] is None:
                continue
            rings = [orient(rg, k == 0) for k, rg in enumerate(rings) if rg]
            out.append(rings)
            a = ring_area_planar(rings[0])
            if a > big[0]:
                big = (a, rings)
        if not out:
            continue
        key = max(gs, key=lambda g: gsize.get(g, 0)) if gs else name
        props = {"n": name, "f": fy, "t": ty, "a": area, "k": key}
        if big[1]:
            props["l"] = label_point(big[1])
        feat = {"type": "Feature", "properties": props, "geometry": {"type": "MultiPolygon", "coordinates": out}}
        for c in STARTS:
            if c <= ty and fy < next_start(c):
                chunks.setdefault(c, []).append(feat)
        if i % 2000 == 0:
            print(f"  {i}/{len(feats)}", flush=True)

    for c, fl in chunks.items():
        with open(os.path.join(OUT, f"{c}.json"), "w") as fh:
            json.dump({"type": "FeatureCollection", "features": fl}, fh, separators=(",", ":"))
    for r in realms.values():
        r["tl"].sort()
        for k in [k for k, v in r.items() if v in ("", [], False)]:
            del r[k]
    with open(os.path.join(OUT, "index.json"), "w") as fh:
        json.dump({"source": os.path.basename(src), "chunks": sorted(chunks),
                   "range": [min(f["properties"]["FromYear"] for f in feats), max(f["properties"]["ToYear"] for f in feats)],
                   "realms": realms}, fh, ensure_ascii=False, separators=(",", ":"))
    total = sum(os.path.getsize(os.path.join(OUT, f"{c}.json")) for c in chunks)
    print(f"{len(realms)} realms, {len(chunks)} chunks, {total / 1e6:.1f} MB chunks, "
          f"index {os.path.getsize(os.path.join(OUT, 'index.json')) / 1e3:.0f} KB")


if __name__ == "__main__":
    main()
