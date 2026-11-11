#!/usr/bin/env python3
"""Sourced geometry fixes to Cliopatria's rows before 1992 (content/borders/patches.json).

The corrections layer (content/corrections.json) can rename, hide or clip a shape when the app draws it, but it cannot
add a shape that is missing, move one to other years, or take a stray piece out of the data. These patches do that, in
the data files themselves, so the app, the checks and "this place through time" all see the same borders:

  geometry    rows of `realm` in `years` take the outline of `from` (default: the same realm) in year `year`,
              or with "ne": a3 Natural Earth's outline of that country
  copy        a new row named `name` (default: `realm`) for `years`, with the outline `realm` has in year `year`;
              with "replace": true the named realm's own rows in those years go
  drop_parts  rows of `realm` in `years` lose their polygon pieces that lie wholly inside `box` [w, s, e, n]
  ne          a new row named `name` for `years`, outlined from Natural Earth country `a3`
              (island and enclave states the border data never drew); "replace": true as for copy
  drop_at     rows of `realm` in `years` lose the polygon pieces that contain any of the points `at`
  add_parts   rows of `realm` in `years` gain polygon pieces: those of `from` in year `year` (all, or the ones
              containing the points `at`), or the explicit rings `coords`
  shape       a new row named `name` for `years` with the explicit rings `coords` (`wiki` and `wd` for its page)
  holes       rows of `realm` in `years` lose the holes that lie inside `box` and get the rings `coords` as holes
              in the piece around them (an enclave redrawn, e.g. West Berlin inside the GDR)

Input : content/borders/patches.json, ne_10m_admin_0_countries.geojson (for "ne")
Output: public/data/clio/<chunk>.json and index.json, edited in place
Run after build_clio.py (which rewrites them; this step refuses to run twice) and before build_modern.py:
  python3 -I tools/build_patches.py <ne_10m_admin_0_countries.geojson>
"""
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from build_clio import STARTS, next_start  # noqa: E402
import build_modern as bm  # noqa: E402
from build import label_point  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public", "data", "clio")
PATCHES = os.path.join(ROOT, "content", "borders", "patches.json")


def ring_km2(r):
    return bm.ring_km2([tuple(p) for p in r[:-1]])


def poly_km2(q):
    return ring_km2(q[0]) - sum(ring_km2(h) for h in q[1:])


def row_id(f):
    p = f["properties"]
    return (p["n"], p["f"], p["t"], p["a"], p["k"], json.dumps(f["geometry"]["coordinates"][0][0][:2]))


def closed(r):
    r = [list(p) for p in r]
    return r if r[0] == r[-1] else r + [r[0]]


def orient_ring(r, outer):
    return bm.orient(r, outer)


def inside_poly(pt, q):
    """pt inside the polygon q (outer ring minus holes)."""
    return bm.inside(pt, q[0]) and not any(bm.inside(pt, h) for h in q[1:])


def overlaps(f, a, b):
    return f["properties"]["f"] <= b and a <= f["properties"]["t"]


def piece(f, a, b, props=None, coords=None):
    """f limited to the years a..b (and given new properties or outline)."""
    p = {**f["properties"], **(props or {}), "f": a, "t": b}
    return {"type": "Feature", "properties": p, "geometry": {"type": "MultiPolygon", "coordinates": coords or f["geometry"]["coordinates"]}}


def split(f, a, b):
    """(part of f inside a..b or None, [parts outside])."""
    p = f["properties"]
    out = []
    if p["f"] < a:
        out.append(piece(f, p["f"], a - 1))
    if p["t"] > b:
        out.append(piece(f, b + 1, p["t"]))
    inner = piece(f, max(p["f"], a), min(p["t"], b)) if overlaps(f, a, b) else None
    return inner, out


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    spec = json.load(open(PATCHES))
    ipath = os.path.join(OUT, "index.json")
    idx = json.load(open(ipath))
    if idx.get("patched"):
        sys.exit("the chunks are already patched: run tools/build_clio.py first")
    chunks = {c: json.load(open(os.path.join(OUT, f"{c}.json"))) for c in idx["chunks"]}
    rows, order = {}, {}  # row id -> feature; chunk -> [row ids]
    for c, fc in chunks.items():
        order[c] = []
        for f in fc["features"]:
            i = row_id(f)
            rows.setdefault(i, f)
            order[c].append(i)
    repl = {}    # row id -> [features] replacing it
    added = []   # (anchor row id or None, feature)
    pieces = own = None

    def current(name):
        """Every live feature of `name` as (row id, index in its replacement list, feature)."""
        out = []
        for i, f in rows.items():
            for k, g in enumerate(repl.get(i, [f])):
                if g["properties"]["n"] == name:
                    out.append((i, k, g))
        return out

    def find(name, year):
        for _, _, g in current(name):
            if g["properties"]["f"] <= year <= g["properties"]["t"]:
                return g
        for _, g in added:
            if g["properties"]["n"] == name and g["properties"]["f"] <= year <= g["properties"]["t"]:
                return g
        sys.exit(f"patch: no row of {name!r} in {year}")

    def edit(name, a, b, fn):
        """Apply fn to the a..b part of every row of name; returns how many rows changed."""
        n = 0
        for i, f in rows.items():
            lst = repl.get(i, [f])
            new = []
            for g in lst:
                if g["properties"]["n"] == name and overlaps(g, a, b):
                    inner, outer = split(g, a, b)
                    res = fn(inner)
                    new += outer + ([res] if res else [])
                    n += 1
                else:
                    new.append(g)
            if new != lst:
                repl[i] = new
        return n

    def drop_rows(name, a, b):
        edit(name, a, b, lambda g: None)
        for k in range(len(added) - 1, -1, -1):
            g = added[k][1]
            if g["properties"]["n"] == name and overlaps(g, a, b):
                inner, outer = split(g, a, b)
                added[k:k + 1] = [(added[k][0], o) for o in outer]

    def has_rows(name, a, b):
        return any(overlaps(g, a, b) for _, _, g in current(name)) or any(g["properties"]["n"] == name and overlaps(g, a, b) for _, g in added)

    tl_edits = []  # (name, a, b, area or None to remove, scale)
    for patch in spec["patches"]:
        for op in patch["ops"]:
            kind, (a, b) = op["op"], op["years"]
            if b >= bm.FROM:
                sys.exit(f"patch {patch['id']}: years reach {bm.FROM}, where build_modern.py takes over")
            if kind == "geometry" and "ne" in op:  # Natural Earth's outline instead of another year's
                if pieces is None:
                    pieces = bm.load_pieces(sys.argv[1])
                    own = bm.piece_owners(pieces)
                sh = bm.make_shape(pieces, frozenset([op["ne"]]), own, op["ne"])
                src = {"properties": {"a": sh["area"], "l": sh["label"]}, "geometry": {"coordinates": sh["coords"]}}
                sp = src["properties"]
                if not edit(op["realm"], a, b, lambda g: piece(g, g["properties"]["f"], g["properties"]["t"], {"a": sp["a"], "l": sp["l"]}, src["geometry"]["coordinates"])):
                    sys.exit(f"patch {patch['id']}: {op['realm']!r} has no rows in {a}-{b}")
                tl_edits.append((op["realm"], a, b, sp["a"], None))
            elif kind == "geometry":
                src = find(op.get("from", op["realm"]), op["year"])
                sp = src["properties"]
                if not edit(op["realm"], a, b, lambda g: piece(g, g["properties"]["f"], g["properties"]["t"], {"a": sp["a"], "l": sp.get("l")}, src["geometry"]["coordinates"])):
                    sys.exit(f"patch {patch['id']}: {op['realm']!r} has no rows in {a}-{b}")
                tl_edits.append((op["realm"], a, b, sp["a"], None))
            elif kind in ("copy", "ne"):
                name = op.get("name", op.get("realm"))
                if has_rows(name, a, b):
                    if not op.get("replace"):
                        sys.exit(f"patch {patch['id']}: {name!r} already has rows in {a}-{b} (add \"replace\": true)")
                    drop_rows(name, a, b)
                    tl_edits.append((name, a, b, None, None))
                if kind == "copy":
                    src = find(op["realm"], op["year"])
                    k = name if src["properties"]["k"] == src["properties"]["n"] else src["properties"]["k"]
                    f = piece(src, a, b, {"n": name, "k": k})
                    anchor = row_id(src) if row_id(src) in rows else None
                else:
                    if pieces is None:
                        pieces = bm.load_pieces(sys.argv[1])
                        own = bm.piece_owners(pieces)
                    sh = bm.make_shape(pieces, frozenset([op["a3"]]), own, op["a3"])
                    f = {"type": "Feature", "properties": {"n": name, "f": a, "t": b, "a": sh["area"], "k": name, "l": sh["label"]},
                         "geometry": {"type": "MultiPolygon", "coordinates": sh["coords"]}}
                    anchor = None
                added.append((anchor, f))
                tl_edits.append((name, a, b, f["properties"]["a"], None))
            elif kind == "drop_parts":
                w, s, e, n = op["box"]
                dropped = [0]
                def cut(g, w=w, s=s, e=e, n=n, dropped=dropped):
                    keep = [q for q in g["geometry"]["coordinates"]
                            if not all(w <= x <= e and s <= y <= n for x, y in q[0])]
                    if len(keep) == len(g["geometry"]["coordinates"]) or not keep:
                        return g
                    dropped[0] += len(g["geometry"]["coordinates"]) - len(keep)
                    total = sum(poly_km2(q) for q in g["geometry"]["coordinates"]) or 1
                    scale = sum(poly_km2(q) for q in keep) / total
                    big = max(keep, key=lambda q: abs(poly_km2(q)))  # the label goes on the largest piece left
                    return piece(g, g["properties"]["f"], g["properties"]["t"], {"a": round(g["properties"]["a"] * scale), "l": label_point(big)}, keep)
                edit(op["realm"], a, b, cut)
                if not dropped[0]:
                    sys.exit(f"patch {patch['id']}: no piece of {op['realm']!r} in {a}-{b} lies wholly inside {op['box']}")
                tl_edits.append((op["realm"], a, b, None, "recount"))
            elif kind == "drop_at":
                hit = [0]
                def dropat(g, hit=hit):
                    keep = [q for q in g["geometry"]["coordinates"] if not any(inside_poly(pt, q) for pt in op["at"])]
                    if len(keep) == len(g["geometry"]["coordinates"]) or not keep:
                        return g
                    hit[0] += 1
                    lost = sum(poly_km2(q) for q in g["geometry"]["coordinates"] if q not in keep)
                    big = max(keep, key=lambda q: abs(poly_km2(q)))
                    return piece(g, g["properties"]["f"], g["properties"]["t"], {"a": max(1, round(g["properties"]["a"] - lost)), "l": label_point(big)}, keep)
                edit(op["realm"], a, b, dropat)
                if not hit[0]:
                    sys.exit(f"patch {patch['id']}: no piece of {op['realm']!r} in {a}-{b} contains {op['at']}")
                tl_edits.append((op["realm"], a, b, None, "recount"))
            elif kind == "add_parts":
                if "coords" in op:
                    extra = [[closed(r)] for r in op["coords"]]
                else:
                    src = find(op["from"], op["year"])["geometry"]["coordinates"]
                    extra = [q for q in src if "at" not in op or any(inside_poly(pt, q) for pt in op["at"])]
                if not extra:
                    sys.exit(f"patch {patch['id']}: nothing to add")
                extra = [[orient_ring(r, k == 0) for k, r in enumerate(q)] for q in extra]
                gain = sum(poly_km2(q) for q in extra)
                if not edit(op["realm"], a, b, lambda g: piece(g, g["properties"]["f"], g["properties"]["t"], {"a": round(g["properties"]["a"] + gain)}, g["geometry"]["coordinates"] + extra)):
                    sys.exit(f"patch {patch['id']}: {op['realm']!r} has no rows in {a}-{b}")
                tl_edits.append((op["realm"], a, b, None, "recount"))
            elif kind == "holes":
                w, s_, e, n = op["box"]
                rings = [orient_ring(closed(r), False) for r in op["coords"]]
                done = [0]
                def reh(g, done=done):
                    polys = []
                    delta = 0.0
                    for q in g["geometry"]["coordinates"]:
                        keep = [h for h in q[1:] if not all(w <= x <= e and s_ <= y <= n for x, y in h)]
                        delta -= sum(ring_km2(h) for h in q[1:] if h not in keep)
                        if bm.inside(rings[0][0], q[0]):
                            keep += rings
                            delta += sum(ring_km2(r) for r in rings)
                            done[0] += 1
                        polys.append([q[0]] + keep)
                    return piece(g, g["properties"]["f"], g["properties"]["t"], {"a": max(1, round(g["properties"]["a"] - delta))}, polys)
                edit(op["realm"], a, b, reh)
                if not done[0]:
                    sys.exit(f"patch {patch['id']}: no piece of {op['realm']!r} in {a}-{b} surrounds the new hole")
                tl_edits.append((op["realm"], a, b, None, "recount"))
            elif kind == "shape":
                name = op["name"]
                if has_rows(name, a, b):
                    sys.exit(f"patch {patch['id']}: {name!r} already has rows in {a}-{b}")
                polys = [[orient_ring(closed(r), True)] for r in op["coords"]]
                area = max(1, round(sum(poly_km2(q) for q in polys)))
                big = max(polys, key=lambda q: abs(poly_km2(q)))
                f = {"type": "Feature", "properties": {"n": name, "f": a, "t": b, "a": area, "k": name, "l": label_point(big)},
                     "geometry": {"type": "MultiPolygon", "coordinates": polys}}
                added.append((None, f))
                if name not in idx["realms"] and op.get("wiki"):
                    idx["realms"][name] = {"wiki": op["wiki"], "tl": [], **({"wd": op["wd"]} if op.get("wd") else {})}
                tl_edits.append((name, a, b, area, None))
            else:
                sys.exit(f"patch {patch['id']}: unknown op {kind!r}")

    # write the chunks: each row is replaced by its pieces, added rows follow their source row (or close the chunk),
    # and every row lands in the chunks whose years it overlaps (as build_clio.py places them)
    def window(c):
        return c, next_start(c) - 1
    starts = sorted(set(idx["chunks"]) | {c for _, f in added for c in STARTS if f["properties"]["f"] <= next_start(c) - 1 and c <= f["properties"]["t"]})
    for c in starts:
        lo, hi = window(c)
        out = []
        for i in order.get(c, []):
            out += [g for g in repl.get(i, [rows[i]]) if overlaps(g, lo, hi)]
            out += [g for anc, g in added if anc == i and overlaps(g, lo, hi)]
        out += [g for anc, g in added if (anc is None or anc not in order.get(c, [])) and overlaps(g, lo, hi)]
        fc = chunks.get(c, {"type": "FeatureCollection", "features": []})
        if out != fc["features"]:
            fc["features"] = out
            with open(os.path.join(OUT, f"{c}.json"), "w") as fh:
                json.dump(fc, fh, separators=(",", ":"))
    idx["chunks"] = sorted(set(idx["chunks"]) | {c for c in starts if os.path.exists(os.path.join(OUT, f"{c}.json"))})

    # the index: timelines follow the rows
    R = idx["realms"]
    live = {}
    for i, f in rows.items():
        for g in repl.get(i, [f]):
            live.setdefault(g["properties"]["n"], []).append(g)
    for _, g in added:
        live.setdefault(g["properties"]["n"], []).append(g)
    for name in {e[0] for e in tl_edits}:
        r = R.get(name)
        if r is None:
            wiki, wd = bm.NEW_REALMS[name]
            r = R[name] = {"wiki": wiki, "tl": []}
            if wd:
                r["wd"] = wd
        r["tl"] = sorted({(g["properties"]["f"], g["properties"]["t"], g["properties"]["a"]) for g in live.get(name, [])})
        r["tl"] = [list(x) for x in r["tl"]]
    idx["patched"] = [p["id"] for p in spec["patches"]]
    with open(ipath, "w") as fh:
        json.dump(idx, fh, ensure_ascii=False, separators=(",", ":"))
    print(f"{len(spec['patches'])} patches: {sum(len(v) for v in repl.values())} rows rewritten from {len(repl)}, {len(added)} rows added")


if __name__ == "__main__":
    main()
