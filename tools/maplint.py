#!/usr/bin/env python3
"""Map lint: measure what the map draws and list the drawing problems readers see, worst first.

Rasterises what the app draws (tools/borders/borders.py: the border chunks with every correction and reconstruction
layer; the yearly base map as land) on a 0.1° grid (about 11 km), for sampled years and for every war stage, and finds:

  slivers    unclaimed land that is thin: every part of it lies within ~20 km of a state, so it is a strip left
             between a realm's edge and the coast (shown hatched), or a gap between two realms, not real stateless land
  fragments  a piece of a realm cut off from its main body by a narrow unclaimed gap (a drawing break, not an exclave
             separated by another state)
  blocky     realms whose borders are mostly axis-aligned stair steps (a rasterised outline)
  overlaps   land drawn for two realms of different colour groups at once
  war grey   in a war stage, grey (neutral or unrecorded) land left thin along a side's areas: between an occupied area
             and the coast, or between the sides

Problems that persist over several sampled years are grouped. Pure Python, no third-party packages.
Writes content/factcheck/map-lint.md and map-lint.json.
Run: python3 -I tools/maplint.py [--years-only | --wars-only] [war-id ...]
"""
import array, collections, glob, importlib.util, json, math, os, re, sys, time

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, "public", "data")
R = 10                     # cells per degree
W, H = 360 * R, 180 * R
NEAR = 2                   # a sliver cell lies within this many cells of a state
MIN_KM2 = 600              # ignore slivers and gaps smaller than this
GAP_STEPS = 6              # fragments: a break of at most this many cells (~60 km) of unclaimed land
FRAG_MAX_KM2 = 50000       # larger detached pieces are geography (a strait, a peninsula), not a drawing break
STAIR_MIN_SEGS = 4         # a stair: at least this many consecutive axis-aligned segments turning at right angles
STAIR_MIN_KM = 40          # report realms with at least this much stair-stepped border


def _load(name, path):
    sp = importlib.util.spec_from_file_location(name, path)
    m = importlib.util.module_from_spec(sp)
    sp.loader.exec_module(m)
    return m


borders = _load("borders", os.path.join(ROOT, "tools", "borders", "borders.py"))
geo = _load("geo", os.path.join(ROOT, "tools", "cinema", "geo.py"))

cell_km2 = [111.32 * 110.57 / (R * R) * math.cos(math.radians((r + 0.5) / R - 90)) for r in range(H)]


def rows_of(rings, box=None):
    """Scanline fill (even-odd over the rings, so holes work): yields (row, c0, c1) runs of cells whose centre is inside."""
    xs_by_row = collections.defaultdict(list)
    for ring in rings:
        n = len(ring)
        for i in range(n):
            x1, y1 = (ring[i - 1][0] + 180) * R, (ring[i - 1][1] + 90) * R
            x2, y2 = (ring[i][0] + 180) * R, (ring[i][1] + 90) * R
            if y1 == y2:
                continue
            lo, hi = (y1, y2) if y1 < y2 else (y2, y1)
            for r in range(max(0, math.ceil(lo - 0.5)), min(H - 1, math.floor(hi - 0.5)) + 1):
                yc = r + 0.5
                if lo <= yc < hi:
                    xs_by_row[r].append(x1 + (yc - y1) * (x2 - x1) / (y2 - y1))
    cb = None
    if box:
        cb = ((box[0] + 180) * R, (box[1] + 90) * R, (box[2] + 180) * R, (box[3] + 90) * R)
    for r, xs in xs_by_row.items():
        if cb and not (cb[1] <= r + 0.5 <= cb[3]):
            continue
        xs.sort()
        for k in range(0, len(xs) - 1, 2):
            c0, c1 = max(0, math.ceil(xs[k] - 0.5)), min(W - 1, math.floor(xs[k + 1] - 0.5))
            if cb:
                c0, c1 = max(c0, math.ceil(cb[0] - 0.5)), min(c1, math.floor(cb[2] - 0.5))
            if c0 <= c1:
                yield r, c0, c1


def lonlat(i):
    r, c = divmod(i, W)
    return round((c + 0.5) / R - 180, 2), round((r + 0.5) / R - 90, 2)


# ------------------------------------------------------------------ land (the yearly base map, as the app clips to it)
_land = {}
BASE_YEARS = sorted(int(f[:-5]) for f in os.listdir(DATA) if re.fullmatch(r"-?\d+\.json", f))


def land_for(year):
    by = min(BASE_YEARS, key=lambda v: abs(v - year))
    if by not in _land:
        L = bytearray(W * H)
        for f in json.load(open(os.path.join(DATA, f"{by}.json")))["features"]:
            g = f.get("geometry") or {}
            polys = g.get("coordinates") or []
            for poly in (polys if g.get("type") == "MultiPolygon" else [polys]):
                if poly:
                    for r, c0, c1 in rows_of(poly):
                        L[r * W + c0: r * W + c1 + 1] = b"\x01" * (c1 - c0 + 1)
        _land.clear()
        _land[by] = L
    return by, _land[by]


# ------------------------------------------------------------------ what is drawn in a year
def raster(states):
    """owner[i] = 1 + index of the state drawn at cell i (0 = none); overlaps of different colour groups are counted."""
    owner = array.array("H", bytes(2 * W * H))
    over = collections.Counter()
    over_at = {}
    for si, st in enumerate(states, 1):
        for poly in st.polys:
            for r, c0, c1 in rows_of(poly, st.crop):
                base = r * W
                for c in range(c0, c1 + 1):
                    if st.cut:
                        x, y = (c + 0.5) / R - 180, (r + 0.5) / R - 90
                        if any(b[0] <= x <= b[2] and b[1] <= y <= b[3] for b in st.cut):
                            continue
                    i = base + c
                    o = owner[i]
                    if o == 0:
                        owner[i] = si
                    elif o != si and states[o - 1].k != st.k:
                        over[(o, si)] += 1
                        over_at.setdefault((o, si), []).append(i)
    for k, cells in over_at.items():  # the overlap's middle (for pictures)
        cx = sum(c % W for c in cells) / len(cells); cy = sum(c // W for c in cells) / len(cells)
        over_at[k] = [round((cx + .5) / R - 180, 2), round((cy + .5) / R - 90, 2)]
    raster.at = over_at
    return owner, over


BAND_CELLS = int(os.environ.get("BAND_CELLS", "1"))  # the app's coast band (BAND_KM in public/app.js, ~14 km) at 0.1°


def band_fill(owner, land, states):
    """What the app's coast band covers: unclaimed land next to an ordinary realm takes that realm's colour."""
    if not BAND_CELLS:
        return owner
    ok = [False] + [not (st.recon or st.crop or st.cut) for st in states]
    out = array.array("H", owner)
    for _ in range(BAND_CELLS):
        src = array.array("H", out)
        for i in range(W * H):
            if land[i] and not src[i]:
                for j in neighbours8(i):
                    o = src[j]
                    if o and ok[o]:
                        out[i] = o; break
    return out


def neighbours4(i):
    r, c = divmod(i, W)
    if c > 0: yield i - 1
    if c < W - 1: yield i + 1
    if r > 0: yield i - W
    if r < H - 1: yield i + W


def neighbours8(i):
    r, c = divmod(i, W)
    for dr in (-1, 0, 1):
        rr = r + dr
        if 0 <= rr < H:
            for dc in (-1, 0, 1):
                if dr or dc:
                    cc = (c + dc) % W
                    yield rr * W + cc


def slivers(owner, land, states):
    """Unclaimed land components lying wholly (90%+) within NEAR cells of a state."""
    near = bytearray(W * H)
    for i in range(W * H):  # state cells on an edge mark the unclaimed land within NEAR cells
        if owner[i] and any(land[j] and not owner[j] for j in neighbours4(i)):
            r, c = divmod(i, W)
            for rr in range(max(0, r - NEAR), min(H, r + NEAR + 1)):
                for cc in range(c - NEAR, c + NEAR + 1):
                    near[rr * W + cc % W] = 1
    seen = bytearray(W * H)
    out = []
    for i in range(W * H):
        if not land[i] or owner[i] or seen[i] or not near[i]:
            continue
        comp, stack, seen[i] = [], [i], 1
        coast, touch, nfar, big = False, collections.Counter(), 0, False
        while stack:
            a = stack.pop(); comp.append(a)
            if not near[a]:
                nfar += 1
                if nfar > 0.1 * max(10, len(comp)) and len(comp) > 50:
                    big = True
            for b in neighbours8(a):
                if not land[b]:
                    coast = True
                elif owner[b]:
                    touch[owner[b]] += 1
                elif not seen[b]:
                    seen[b] = 1; stack.append(b)
        if big or nfar > 0.1 * len(comp):
            continue
        km2 = sum(cell_km2[a // W] for a in comp)
        if km2 < MIN_KM2:
            continue
        names = [states[o - 1].n for o, _ in touch.most_common(3)]
        kind = "coastal strip" if coast else "gap between realms" if len(touch) >= 2 else "edge strip"
        cx = sum(a % W for a in comp) / len(comp); cy = sum(a // W for a in comp) / len(comp)
        out.append({"kind": kind, "km2": round(km2), "at": [round((cx + .5) / R - 180, 2), round((cy + .5) / R - 90, 2)], "realms": names})
    return out


def fragments(owner, land, states):
    """Pieces of a realm separated from its main body only by a narrow strip of unclaimed land."""
    comps = collections.defaultdict(list)  # state -> [cells per component]
    seen = bytearray(W * H)
    lab = array.array("i", bytes(4 * W * H))
    nlab = 0
    for i in range(W * H):
        o = owner[i]
        if not o or seen[i]:
            continue
        nlab += 1
        comp, stack, seen[i] = [], [i], 1
        while stack:
            a = stack.pop(); comp.append(a); lab[a] = nlab
            for b in neighbours4(a):
                if owner[b] == o and not seen[b]:
                    seen[b] = 1; stack.append(b)
        comps[o].append((nlab, comp))
    out = []
    for o, cs in comps.items():
        if len(cs) < 2:
            continue
        cs.sort(key=lambda x: -len(x[1]))
        main_lab, main = cs[0]
        total = sum(len(c) for _, c in cs)
        for lb, comp in cs[1:]:
            if len(comp) > 0.2 * total or len(comp) < 2 or sum(cell_km2[a // W] for a in comp) > FRAG_MAX_KM2:
                continue
            # breadth-first through unclaimed land only, up to GAP_STEPS cells, looking for the main body
            frontier, dist, hit = list(comp), {a: 0 for a in comp}, None
            while frontier and hit is None:
                nxt = []
                for a in frontier:
                    for b in neighbours4(a):
                        if b in dist:
                            continue
                        if lab[b] == main_lab:
                            hit = dist[a] + 1; break
                        if land[b] and not owner[b] and dist[a] < GAP_STEPS:
                            dist[b] = dist[a] + 1; nxt.append(b)
                    if hit is not None:
                        break
                frontier = nxt
            if hit is None:
                continue
            km2 = sum(cell_km2[a // W] for a in comp)
            cx = sum(a % W for a in comp) / len(comp); cy = sum(a // W for a in comp) / len(comp)
            out.append({"realm": states[o - 1].n, "km2": round(km2), "gap_km": round(hit * 111.32 / R * math.cos(math.radians(cy / R - 90)) + 0.5),
                        "at": [round((cx + .5) / R - 180, 2), round((cy + .5) / R - 90, 2)]})
    return out


def blocky(states):
    """Stair-stepped border: runs of consecutive axis-aligned segments that alternate horizontal and vertical."""
    out = []
    for st in states:
        if st.recon:
            continue
        tot = stair = 0.0
        where = None
        for poly in st.polys:
            for ring in poly:
                run, run_km, last = 0, 0.0, None
                for k in range(1, len(ring) + 1):
                    if k < len(ring):
                        (x1, y1), (x2, y2) = ring[k - 1][:2], ring[k][:2]
                        d = geo.km((x1, y1), (x2, y2)); tot += d
                        dirn = "h" if abs(y1 - y2) < 1e-9 and abs(x1 - x2) > 1e-9 else "v" if abs(x1 - x2) < 1e-9 and abs(y1 - y2) > 1e-9 else None
                    else:
                        dirn = None
                    if dirn and dirn != last and run:
                        run += 1; run_km += d
                    elif dirn:
                        if run >= STAIR_MIN_SEGS:
                            stair += run_km
                        run, run_km = 1, d
                    else:
                        if run >= STAIR_MIN_SEGS:
                            stair += run_km; where = where or [round(x1, 2), round(y1, 2)]
                        run, run_km = 0, 0.0
                    last = dirn
        if stair >= STAIR_MIN_KM:
            out.append({"realm": st.n, "km": round(stair), "share": round(stair / tot, 2) if tot else 0, "at": where})
    return out


def sample_years():
    ys = list(range(-3400, -500, 100)) + list(range(-500, 1000, 50)) + list(range(1000, 1991, 20))
    return ys + [1991]


def lint_years(years):
    B = borders.Borders()
    res = {"slivers": {}, "fragments": {}, "blocky": {}, "overlaps": {}}
    for y in years:
        t = time.time()
        states = B.states(y)
        by, land = land_for(y)
        owner, over = raster(states)
        sl = slivers(band_fill(owner, land, states), land, states)
        fr = fragments(owner, land, states)
        bl = blocky(states)
        for it in sl:
            k = (it["kind"], round(it["at"][0]), round(it["at"][1]), tuple(sorted(it["realms"][:2])))
            g = res["slivers"].setdefault(k, {"years": [], **it}); g["years"].append(y)
            if it["km2"] > g["km2"]: g.update(it, years=g["years"])
        for it in fr:
            k = (it["realm"], round(it["at"][0]), round(it["at"][1]))
            g = res["fragments"].setdefault(k, {"years": [], **it}); g["years"].append(y)
            if it["km2"] > g["km2"]: g.update(it, years=g["years"])
        for it in bl:
            g = res["blocky"].setdefault(it["realm"], {"years": [], **it}); g["years"].append(y)
            if it["km"] > g["km"]: g.update(it, years=g["years"])
        for (a, b), n in over.items():
            sa, sb = states[a - 1], states[b - 1]
            km2 = n * cell_km2[90 * R]  # rough (equator cell); ranking only
            if km2 < MIN_KM2 * 4:
                continue
            k = tuple(sorted((sa.n, sb.n)))
            g = res["overlaps"].setdefault(k, {"years": [], "realms": list(k), "km2": 0}); g["years"].append(y)
            if km2 > g["km2"]:
                g["km2"], g["at"], g["year"] = round(km2), raster.at.get((a, b)), y
        print(f"  {y}: {len(sl)} slivers, {len(fr)} fragments, {len(bl)} blocky, {len(over)} overlap pairs ({time.time() - t:.1f}s)", file=sys.stderr)
    return res


# ------------------------------------------------------------------ wars
def lint_war(war_id):
    Wr = geo.War(war_id)
    B = Wr.borders()
    out = []
    seen_issue = set()
    for n, ch, t, when in [(n, ch, t, w) for n, ch in enumerate(Wr.cine.get("chapters", []), 1)
                           for t, w in (((geo.frac(ch["start"]) + geo.frac(ch["end"])) / 2, "middle"), (geo.frac(ch["end"]) - 1e-4, "end"))]:
        b = ch.get("bbox")
        if not b:
            continue
        y = Wr.base_year(t)
        states = B.states(y)
        sm = Wr.sides(t)
        _, land = land_for(y)
        side = {}
        for st in states:  # base map: each state's side (or grey)
            s = sm.get(st.n, sm.get(st.k, sm.get(st.orig)))
            for poly in st.polys:
                for r, c0, c1 in rows_of(poly, st.crop):
                    for c in range(c0, c1 + 1):
                        x, yy = (c + 0.5) / R - 180, (r + 0.5) / R - 90
                        if not (b[0] - 1 <= x <= b[2] + 1 and b[1] - 1 <= yy <= b[3] + 1):
                            continue
                        if st.cut and any(q[0] <= x <= q[2] and q[1] <= yy <= q[3] for q in st.cut):
                            continue
                        side.setdefault(r * W + c, s)
        for _ in range(BAND_CELLS):  # the coast band: unclaimed land next to a realm takes that realm's colour
            grow = {}
            for i, s in side.items():
                if s is not None:
                    for j in neighbours8(i):
                        if j not in side and land[j]:
                            grow.setdefault(j, s)
            side.update(grow)
        for o in Wr.occs:  # occupied areas count on anything but the occupier's own ground
            ring = o.at(t)
            if not ring:
                continue
            sd = o.side if o.side is not None else 1
            for r, c0, c1 in rows_of([ring]):
                for c in range(c0, c1 + 1):
                    i = r * W + c
                    if side.get(i) != sd:
                        side[i] = sd
        # grey land in the stage's box lying thin along a side's areas
        c0, c1 = math.floor((b[0] + 180) * R), math.floor((b[2] + 180) * R)
        r0, r1 = math.floor((b[1] + 90) * R), math.floor((b[3] + 90) * R)
        inbox = lambda i: r0 <= i // W <= r1 and c0 <= i % W <= c1
        grey = lambda i: land[i] and side.get(i) is None
        sided = lambda i: side.get(i) is not None
        near = set()
        for i, s in side.items():
            if s is not None and inbox(i) and any(grey(j) for j in neighbours4(i)):
                r, c = divmod(i, W)
                for rr in range(r - NEAR, r + NEAR + 1):
                    for cc in range(c - NEAR, c + NEAR + 1):
                        near.add(rr * W + cc)
        seen = set()
        for i in sorted(near):
            if i in seen or not inbox(i) or not grey(i):
                continue
            comp, stack, nfar, coast, touch = [], [i], 0, False, collections.Counter()
            seen.add(i)
            while stack:
                a = stack.pop(); comp.append(a)
                if a not in near:
                    nfar += 1
                for q in neighbours8(a):
                    if not inbox(q):
                        continue
                    if not land[q]:
                        coast = True
                    elif sided(q):
                        touch[side[q]] += 1
                    elif q not in seen:
                        seen.add(q); stack.append(q)
                if len(comp) > 4000:
                    break
            if nfar > 0.1 * len(comp) or not touch:
                continue
            km2 = sum(cell_km2[a // W] for a in comp)
            if km2 < MIN_KM2:
                continue
            cx = sum(a % W for a in comp) / len(comp); cy = sum(a // W for a in comp) / len(comp)
            kind = "between an area and the coast" if coast and len(touch) == 1 else "between the sides" if len(touch) >= 2 else "along a side's edge"
            names = [Wr.war["sides"][s]["name"] for s in touch if s is not None and 0 <= s < len(Wr.war["sides"])]
            key = (n, round(cx / R), round(cy / R))
            if key in seen_issue:
                continue
            seen_issue.add(key)
            out.append({"war": war_id, "chapter": n, "title": ch.get("title", ""), "date": ch["end"], "when": when, "kind": kind, "km2": round(km2),
                        "at": [round((cx + .5) / R - 180, 2), round((cy + .5) / R - 90, 2)], "sides": names})
    return out


def yrs(v):
    v = sorted(v)
    runs, a = [], v[0]
    for p, q in zip(v, v[1:] + [None]):
        if q is None or q - p > 100:
            runs.append(f"{a}" if a == p else f"{a}–{p}"); a = q
    return ", ".join(runs)


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    do_years, do_wars = "--wars-only" not in sys.argv, "--years-only" not in sys.argv
    jp = os.path.join(ROOT, "content", "factcheck", "map-lint.json")
    rep = json.load(open(jp)) if os.path.exists(jp) and (not do_years or not do_wars) else {}  # a partial run keeps the other half
    rep.update({"generated": time.strftime("%Y-%m-%d"), "grid_deg": 1 / R})
    if do_years:
        print("years:", file=sys.stderr)
        res = lint_years(sample_years())
        score = lambda g: g["km2"] * len(g["years"])
        rep["slivers"] = sorted(res["slivers"].values(), key=lambda g: -score(g))
        rep["fragments"] = sorted(res["fragments"].values(), key=lambda g: -score(g))
        rep["blocky"] = sorted(res["blocky"].values(), key=lambda g: -g["km"] * len(g["years"]))
        rep["overlaps"] = sorted(res["overlaps"].values(), key=lambda g: -score(g))
    if do_wars:
        print("wars:", file=sys.stderr)
        wars = args or sorted(os.path.basename(p)[:-5] for p in glob.glob(os.path.join(ROOT, "content", "cinema", "*.json")))
        content_ids = {w["id"] for w in json.load(open(os.path.join(DATA, "content.json")))["wars"]}
        rep["wars"] = [g for g in rep.get("wars", []) if args and g["war"] not in args]
        for w in wars:
            if w not in content_ids:
                continue
            t = time.time()
            got = lint_war(w)
            rep["wars"] += got
            print(f"  {w}: {len(got)} grey strips ({time.time() - t:.1f}s)", file=sys.stderr)
        rep["wars"].sort(key=lambda g: -g["km2"])
    out = os.path.join(ROOT, "content", "factcheck")
    json.dump(rep, open(os.path.join(out, "map-lint.json"), "w"), ensure_ascii=False, indent=1)
    L = [f"# Map lint\n\nGenerated by tools/maplint.py on a {1 / R}° grid (about 11 km). Worst first; the same problem in several sampled years is listed once.\n"]
    if "slivers" in rep:
        tot = lambda k: sum(1 for g in rep["slivers"] if g["kind"] == k)
        L.append(f"## Slivers of unclaimed land: {len(rep['slivers'])} ({tot('coastal strip')} coastal strips, {tot('gap between realms')} gaps between realms, {tot('edge strip')} edge strips)\n")
        L += [f"- {g['kind']}, {g['km2']:,} km² at {g['at']} next to {', '.join(g['realms'])}: {yrs(g['years'])}" for g in rep["slivers"][:150]]
        L.append(f"\n## Fragments cut off by a narrow gap: {len(rep['fragments'])}\n")
        L += [f"- {g['realm']}: {g['km2']:,} km² at {g['at']}, {g['gap_km']} km from the main body: {yrs(g['years'])}" for g in rep["fragments"][:100]]
        L.append(f"\n## Blocky (stair-stepped) borders: {len(rep['blocky'])} realms\n")
        L += [f"- {g['realm']}: {g['km']:,} km of stair-stepped border ({round(100 * g['share'])}% of it){f' near {g[chr(97)+chr(116)]}' if g.get('at') else ''}: {yrs(g['years'])}" for g in rep["blocky"][:100]]
        L.append(f"\n## Overlaps between colour groups: {len(rep['overlaps'])} pairs\n")
        L += [f"- {' / '.join(g['realms'])}: about {g['km2']:,} km²: {yrs(g['years'])}" for g in rep["overlaps"][:60]]
    if "wars" in rep:
        L.append(f"\n## Grey strips in war stages: {len(rep['wars'])}\n")
        L += [f"- {g['war']} stage {g['chapter']} ({g['date']}) '{g['title']}': {g['kind']}, {g['km2']:,} km² at {g['at']} ({', '.join(g['sides'])})" for g in rep["wars"][:200]]
    open(os.path.join(out, "map-lint.md"), "w").write("\n".join(L) + "\n")
    print("-> content/factcheck/map-lint.md", file=sys.stderr)


if __name__ == "__main__":
    main()
