#!/usr/bin/env python3
"""Compact Cliopatria (Seshat Global History Databank, CC BY 4.0) for the web.

Input : data/clio/cliopatria_polities_only_v*.geojson
Output: public/data/clio/<century>.json   rows (with geometry) active in that century
        public/data/clio/index.json       per-realm metadata + territory timelines

A Cliopatria row = one polity's territory for FromYear..ToYear (inclusive).
Rows named "(X)" are composites (an empire = its member polities); members carry
MemberOf "(X)". We draw members, colour them by their outermost group, and use the
composite rows only for metadata/area (their geometry duplicates the members).

Coasts: each realm's coastline is carried out to the real coast (tools/coast.py,
snap_ring): Cliopatria's coasts lie a median 5-9 km inland or offshore of it, which showed as grey strips and stray
capes when zoomed in. Borders between realms are left exactly as Cliopatria draws them: no simplification either, so
two neighbours keep one shared line (simplifying each realm on its own split shared borders into slivers and gaps).

The real coast is Natural Earth 1:10m land as tools/build_detail.py stores it (public/data/coast/), so run that first
when Natural Earth changes.

Stairs: outlines traced from a grid run in stair steps; destair() cuts each step's corner at its midpoints, the same way
in every realm that shares the border, so neighbours keep one line.

Run: python3 -I tools/build_clio.py
"""
import glob
import json
import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from build import densify, inside, orient, seg_dist  # noqa: E402  (shared geometry helpers)
from coast import Land, snap_ring  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public", "data", "clio")
CHUNK = 100
TOL = 0.01  # degrees: how far a drawn edge (a great-circle arc) may stray from the straight lon/lat line it stands for


def simplify_ring(r):
    out = []
    for x, y, *_ in r:
        p = [round(x, 2), round(y, 2)]
        if not out or p != out[-1]:
            out.append(p)
    if out and out[0] != out[-1]:
        out.append(out[0])
    if len(out) < 4:
        return None
    dense = [out[0]]  # long east-west edges get points along them, so they are not drawn as bulging arcs
    for a, b in zip(out, out[1:]):
        for q in densify(a, b, TOL):
            q = [round(q[0], 2), round(q[1], 2)]
            if q != dense[-1]:
                dense.append(q)
        if b != dense[-1]:
            dense.append(b)
    return dense


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


def polys_of(geom):
    return [geom["coordinates"]] if geom["type"] == "Polygon" else geom["coordinates"]


def shared_edges(feats):
    """For every ring of every drawn row, which of its edges another row of overlapping years also has (a border
    between two realms), and the points inside such borders. Edges are compared exactly, as Cliopatria stores them."""
    key = lambda p: (p[0], p[1])
    by_edge = {}
    for i, f in enumerate(feats):
        p = f["properties"]
        if p["Name"].startswith("("):
            continue
        for pi, poly in enumerate(polys_of(f["geometry"])):
            for ri, r in enumerate(poly):
                for ei in range(len(r) - 1):
                    a, b = key(r[ei]), key(r[ei + 1])
                    by_edge.setdefault((a, b) if a < b else (b, a), []).append((i, pi, ri, ei))
    yrs = [(int(f["properties"]["FromYear"]), int(f["properties"]["ToYear"])) for f in feats]
    flags = {}
    for lst in by_edge.values():
        if len(lst) < 2:
            continue
        for x in lst:
            fx, tx = yrs[x[0]]
            if any(y[0] != x[0] and yrs[y[0]][0] <= tx and fx <= yrs[y[0]][1] for y in lst):
                flags.setdefault(x[:3], set()).add(x[3])
    pinned = {}  # point -> the years of the rows in which it lies inside a shared border
    for (i, pi, ri), es in flags.items():
        r = polys_of(feats[i]["geometry"])[pi][ri]
        n = len(r) - 1
        for e in es:
            if (e + 1) % n in es:
                pinned.setdefault(key(r[e + 1]), set()).add(yrs[i])
    return flags, pinned


class PinnedFor:
    """The points that stay put for one row: inside a border it shares with a realm of overlapping years. Cliopatria
    reuses points across centuries, so a point on a border in one era may be on the coast in another."""

    def __init__(self, pinned, years):
        self.pinned, (self.f, self.t) = pinned, years

    def __contains__(self, p):
        return any(a <= self.t and self.f <= b for a, b in self.pinned.get(p, ()))


STAIR_SEG = 0.3  # degrees: only short axis-aligned steps make a staircase (long straight borders keep their corners)


def destair(feats):
    """Smooth stair-stepped borders (outlines traced from a grid) by cutting each step's corner at the midpoints of its
    two steps, which turns a staircase into a diagonal. The cut depends only on the corner and its two neighbours, and
    a corner is cut in a row only if every row of overlapping years that has the point has the same two neighbours
    there, so the realms on either side of a border change it identically (no gaps or overlaps open between them) and
    points where three realms meet stay put."""
    key = lambda q: (q[0], q[1])
    occ = {}   # point -> [(row, from, to, neighbour pair)]
    rings = []
    for i, f in enumerate(feats):
        p = f["properties"]
        if p["Name"].startswith("("):
            continue
        fy, ty = int(p["FromYear"]), int(p["ToYear"])
        for poly in polys_of(f["geometry"]):
            for r in poly:
                n = len(r) - 1
                if n < 4:
                    continue
                rings.append((i, fy, ty, r))
                for k in range(n):
                    v, a, c = key(r[k]), key(r[k - 1] if k else r[n - 1]), key(r[k + 1])
                    occ.setdefault(v, []).append((i, fy, ty, frozenset((a, c))))
    def step(a, b):  # "h" or "v" for a short, (nearly) axis-aligned step; the grid's columns lean a little
        dx, dy = abs(a[0] - b[0]), abs(a[1] - b[1])
        if not 0 < max(dx, dy) <= STAIR_SEG:
            return None
        return "h" if dy <= 0.06 * dx else "v" if dx <= 0.06 * dy else None
    def corner(a, v, c):
        s1, s2 = step(a, v), step(v, c)
        return bool(s1 and s2 and s1 != s2)
    def agreed(v, i, fy, ty, pair):
        return all(q == pair for j, f2, t2, q in occ[v] if j != i and f2 <= ty and fy <= t2)
    mid = lambda a, b: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
    cut = 0
    for i, fy, ty, r in rings:
        n, out = len(r) - 1, []
        for k in range(n):
            v, a, c = key(r[k]), key(r[k - 1] if k else r[n - 1]), key(r[k + 1])
            if corner(a, v, c) and agreed(v, i, fy, ty, frozenset((a, c))):
                pts = [mid(a, v), mid(v, c)]; cut += 1
            else:
                pts = [list(r[k][:2])]
            for q in pts:
                if not out or (q[0], q[1]) != (out[-1][0], out[-1][1]):
                    out.append(q)
        if len(out) > 1 and out[0] == out[-1]:
            out.pop()
        if len(out) >= 3:
            r[:] = out + [list(out[0])]
    return cut


def main():
    src = sorted(glob.glob(os.path.join(ROOT, "data", "clio", "cliopatria_polities_only_v*.geojson")))[-1]
    feats = json.load(open(src))["features"]
    os.makedirs(OUT, exist_ok=True)
    print(f"stairs: {destair(feats)} stair-step corners cut", flush=True)
    land = Land.tiles()
    if True:
        flags, pinned = shared_edges(feats)
        # A point never moves across another realm of overlapping years (an unmatched border that faces the sea, as
        # Egypt's at Eilat in 1949): the realms are indexed by 1° cell, as drawn before any point moves.
        yrs = [(int(f["properties"]["FromYear"]), int(f["properties"]["ToYear"])) for f in feats]
        cells = {}
        for i, f in enumerate(feats):
            if f["properties"]["Name"].startswith("("):
                continue
            for poly in polys_of(f["geometry"]):
                xs, ys = [q[0] for q in poly[0]], [q[1] for q in poly[0]]
                box = (min(xs), min(ys), max(xs), max(ys))
                item = (i, box, [list(map(tuple, r)) for r in poly])
                for cx in range(math.floor(box[0]), math.floor(box[2]) + 1):
                    for cy in range(math.floor(box[1]), math.floor(box[3]) + 1):
                        cells.setdefault((cx, cy), []).append(item)

        def other_realm(i):
            f0, t0 = yrs[i]

            def veto(x, y):
                for j, (x0, y0, x1, y1), rings in cells.get((math.floor(x), math.floor(y)), ()):
                    if j != i and x0 <= x <= x1 and y0 <= y <= y1 and yrs[j][0] <= t0 and f0 <= yrs[j][1] \
                            and inside((x, y), rings[0]) and not any(inside((x, y), h) for h in rings[1:]):
                        return True
                return False
            return veto

        moved = 0
        for i, f in enumerate(feats):
            if f["properties"]["Name"].startswith("("):
                continue
            polys = polys_of(f["geometry"])
            veto = other_realm(i)
            for pi, poly in enumerate(polys):
                for ri, r in enumerate(poly):
                    es = flags.get((i, pi, ri), ())
                    poly[ri], m = snap_ring(r, ri > 0, [e in es for e in range(len(r) - 1)], PinnedFor(pinned, yrs[i]), land, veto=veto)
                    moved += m
            if i % 2000 == 0:
                print(f"  coasts {i}/{len(feats)}", flush=True)
        print(f"coasts: {moved} points moved to the Natural Earth coast; {len(pinned)} points lie inside shared borders", flush=True)

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
