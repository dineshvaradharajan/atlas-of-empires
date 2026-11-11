#!/usr/bin/env python3
"""Compact the historical-basemaps snapshots into web-ready data.

Input : data/geo/world_<year>.geojson   (aourednik/historical-basemaps, GPL-3.0)
Output: public/data/<year>.json          compact per-snapshot GeoJSON
        public/data/index.json           years + per-polity area timeline
        data/names/<year>.txt            polity names per snapshot (for content authors)

Run: python3 -I tools/build.py
"""
import glob
import json
import math
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "data", "geo")
OUT = os.path.join(ROOT, "public", "data")
NAMES = os.path.join(ROOT, "data", "names")
EMPIRES = os.path.join(ROOT, "content", "empires.json")
R = 6371.0088
PREC = 2  # ~1 km at the equator; plenty for a world-scale map


def year_of(fn):
    y = os.path.basename(fn)[6:-8]
    return -int(y[2:]) if y.startswith("bc") else int(y)


def ring_area(r):
    a = 0.0
    for i in range(len(r) - 1):
        (x1, y1), (x2, y2) = r[i][:2], r[i + 1][:2]
        a += math.radians(x2 - x1) * (2 + math.sin(math.radians(y1)) + math.sin(math.radians(y2)))
    return abs(a * R * R / 2)


def polys(geom):
    if not geom:
        return []
    if geom["type"] == "Polygon":
        return [geom["coordinates"]]
    return geom["coordinates"]


def dp(pts, eps):
    """Douglas-Peucker on a list of [x, y]."""
    if len(pts) < 4:
        return pts
    keep = [False] * len(pts)
    keep[0] = keep[-1] = True
    stack = [(0, len(pts) - 1)]
    while stack:
        s, e = stack.pop()
        (x1, y1), (x2, y2) = pts[s], pts[e]
        dx, dy = x2 - x1, y2 - y1
        norm = math.hypot(dx, dy) or 1e-12
        best, idx = -1.0, -1
        for i in range(s + 1, e):
            x, y = pts[i]
            d = abs(dy * x - dx * y + x2 * y1 - y2 * x1) / norm
            if d > best:
                best, idx = d, i
        if best > eps and idx > 0:
            keep[idx] = True
            stack += [(s, idx), (idx, e)]
    return [p for p, k in zip(pts, keep) if k]


def simplify_ring(r):
    out = []
    for x, y, *_ in r:
        p = [round(x, PREC), round(y, PREC)]
        if not out or p != out[-1]:
            out.append(p)
    # A closed ring has identical endpoints, which DP can't anchor on:
    # split it in two at the midpoint and simplify each half.
    if len(out) > 8:
        m = len(out) // 2
        out = dp(out[: m + 1], 0.02)[:-1] + dp(out[m:], 0.02)
    if out and out[0] != out[-1]:
        out.append(out[0])
    return out if len(out) >= 4 else None


def orient(ring, clockwise):
    """d3-geo wants exterior rings clockwise and holes counter-clockwise
    (the reverse of RFC 7946); a wrongly wound ring renders as 'the whole
    globe except this polygon'."""
    s = sum((ring[i + 1][0] - ring[i][0]) * (ring[i + 1][1] + ring[i][1]) for i in range(len(ring) - 1))
    is_cw = s > 0
    return ring if is_cw == clockwise else ring[::-1]


def gc_mid(a, b):
    """Midpoint of the great-circle arc from a to b (lon/lat degrees)."""
    def v(p):
        lo, la = math.radians(p[0]), math.radians(p[1])
        return (math.cos(la) * math.cos(lo), math.cos(la) * math.sin(lo), math.sin(la))
    x, y, z = (s + t for s, t in zip(v(a), v(b)))
    return math.degrees(math.atan2(y, x)), math.degrees(math.atan2(z, math.hypot(x, y)))


def densify(a, b, tol, depth=0):
    """Points to add between a and b so that the great-circle arcs the app draws (d3.geoPath) stay within tol degrees
    of the straight lon/lat line the data means: a border along a parallel, like the 49th, would otherwise bulge
    toward the pole. The points depend only on the two ends, so two neighbours sharing an edge get the same ones."""
    if abs(a[0] - b[0]) < 0.5 or depth > 8:
        return []
    if tuple(a) > tuple(b):
        return densify(b, a, tol, depth)[::-1]
    m = ((a[0] + b[0]) / 2, (a[1] + b[1]) / 2)
    gx, gy = gc_mid(a, b)
    if math.hypot((gx - m[0]) * math.cos(math.radians(m[1])), gy - m[1]) <= tol:
        return []
    return densify(a, m, tol, depth + 1) + [m] + densify(m, b, tol, depth + 1)


def inside(pt, ring):
    x, y = pt
    c = False
    j = len(ring) - 1
    for i in range(len(ring)):
        xi, yi = ring[i]
        xj, yj = ring[j]
        if (yi > y) != (yj > y) and x < (xj - xi) * (y - yi) / ((yj - yi) or 1e-12) + xi:
            c = not c
        j = i
    return c


def seg_dist(p, a, b):
    (px, py), (ax, ay), (bx, by) = p, a, b
    dx, dy = bx - ax, by - ay
    L = dx * dx + dy * dy
    t = 0 if L == 0 else max(0, min(1, ((px - ax) * dx + (py - ay) * dy) / L))
    return math.hypot(px - ax - t * dx, py - ay - t * dy)


def label_point(poly):
    """Rough pole-of-inaccessibility: grid search inside the outer ring."""
    outer = poly[0]
    xs = [p[0] for p in outer]
    ys = [p[1] for p in outer]
    x0, x1, y0, y1 = min(xs), max(xs), min(ys), max(ys)
    step = max(1, len(outer) // 120)
    edges = [(outer[i], outer[i + 1]) for i in range(0, len(outer) - 1, step)]
    best, bp = -1, [(x0 + x1) / 2, (y0 + y1) / 2]
    n = 14
    for i in range(1, n):
        for j in range(1, n):
            p = [x0 + (x1 - x0) * i / n, y0 + (y1 - y0) * j / n]
            if not inside(p, outer) or any(inside(p, h) for h in poly[1:]):
                continue
            d = min(seg_dist(p, a, b) for a, b in edges)
            if d > best:
                best, bp = d, p
    return [round(bp[0], 2), round(bp[1], 2)]


def clean(s):
    if s is None:
        return None
    s = str(s).strip()
    return s if s and not re.fullmatch(r"\d+", s) else None


def load_aliases():
    """Map dataset name -> canonical empire id (from content/empires.json)."""
    if not os.path.exists(EMPIRES):
        return {}
    m = {}
    for e in json.load(open(EMPIRES)):
        for a in e.get("aliases", []):
            m[a] = e["id"]
    return m


def main():
    os.makedirs(OUT, exist_ok=True)
    os.makedirs(NAMES, exist_ok=True)
    aliases = load_aliases()
    files = sorted(glob.glob(os.path.join(SRC, "world_*.geojson")), key=year_of)
    years, timeline = [], {}
    for fn in files:
        yr = year_of(fn)
        years.append(yr)
        src = json.load(open(fn))
        feats, names = [], {}
        for f in src["features"]:
            p = f["properties"]
            name = clean(p.get("NAME"))
            subj = clean(p.get("SUBJECTO")) or name
            part = clean(p.get("PARTOF"))
            area, out_polys, biggest = 0.0, [], (0, None)
            for poly in polys(f["geometry"]):
                a = ring_area(poly[0]) - sum(ring_area(h) for h in poly[1:])
                area += a
                rings = [simplify_ring(r) for r in poly]
                if rings[0] is None:
                    continue
                rings = [orient(r, k == 0) for k, r in enumerate(rings) if r]
                out_polys.append(rings)
                if a > biggest[0]:
                    biggest = (a, rings)
            if not out_polys:
                continue
            props = {"b": p.get("BORDERPRECISION") or 1}
            if name:
                props.update(n=name, a=round(area))
                if subj and subj != name:
                    props["s"] = subj
                if part and part not in (name, subj):
                    props["p"] = part
                eid = aliases.get(name) or aliases.get(subj)
                if eid:
                    props["e"] = eid
                if biggest[1]:
                    props["l"] = label_point(biggest[1])
                names[name] = names.get(name, 0) + area
                key = eid or subj
                timeline.setdefault(key, {})
                timeline[key][yr] = timeline[key].get(yr, 0) + area
            feats.append({"type": "Feature", "properties": props,
                          "geometry": {"type": "MultiPolygon", "coordinates": out_polys}})
        with open(os.path.join(OUT, f"{yr}.json"), "w") as fh:
            json.dump({"type": "FeatureCollection", "features": feats}, fh, separators=(",", ":"))
        label = f"{-yr} BCE" if yr < 0 else f"{yr} CE"
        with open(os.path.join(NAMES, f"{yr}.txt"), "w") as fh:
            fh.write(f"# Polities in snapshot {label}, largest first (area km²)\n")
            for n, a in sorted(names.items(), key=lambda kv: -kv[1]):
                fh.write(f"{n}\t{round(a):,}\n")
        print(f"{label:>10}: {len(feats):4d} features, {os.path.getsize(os.path.join(OUT, f'{yr}.json')) // 1024} KB")
    tl = {k: {str(y): round(a) for y, a in v.items()} for k, v in timeline.items()}
    with open(os.path.join(OUT, "index.json"), "w") as fh:
        json.dump({"years": years, "timeline": tl}, fh, separators=(",", ":"))


if __name__ == "__main__":
    main()
