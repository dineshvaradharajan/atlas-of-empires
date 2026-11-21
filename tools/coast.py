"""Natural Earth 1:10m land as a queryable shape: where is the nearest coast, and which side of it is a point on.

Shared by tools/build_clio.py (realm coastlines carried out to the real coast), tools/build_detail.py (the detailed
coastline the map draws when zoomed in) and tools/content.py (occupied areas in the war stories carried out to the
sea). Pure Python: coast edges are bucketed in a grid, so a query touches only nearby edges.

    land = Land.tiles()           # public/data/coast/ (tools/build_detail.py), as committed
    land = Land.load(<ne_10m_admin_0_countries.geojson>)
    land.nearest_coast(lon, lat, r) -> (distance, [lon, lat] of the nearest coast point, point is on land) or None
    land.rings()                    -> the coastline as closed rings (land on the left), country borders dissolved

Distances are in degrees of latitude, with longitude scaled by cos(latitude) (about 111 km a degree).
"""
import collections
import json
import math

CELL = 0.25  # degrees: grid cell for the edge index


def polys_of(geom):
    if not geom:
        return []
    return [geom["coordinates"]] if geom["type"] == "Polygon" else geom["coordinates"]


def signed_area(r):
    return sum(r[i][0] * r[i + 1][1] - r[i + 1][0] * r[i][1] for i in range(len(r) - 1)) / 2


class Land:
    def __init__(self, polys=None, coast=None):
        # Every ring is turned so that land lies on its left (outer rings anticlockwise, holes clockwise). An edge two
        # countries share then runs once in each direction, and the coast is every edge whose reverse is not used.
        if coast is not None:
            self._index(coast)
            return
        edges = []
        for poly in polys:
            for k, r in enumerate(poly):
                r = [(p[0], p[1]) for p in r]
                if (signed_area(r) > 0) != (k == 0):
                    r = r[::-1]
                edges += [(a, b) for a, b in zip(r, r[1:]) if a != b]
        used = collections.Counter(edges)
        self._index([(a, b) for a, b in edges if not used[(b, a)]])

    def _index(self, coast):
        self.coast = coast
        self.grid = collections.defaultdict(list)  # cell -> indexes into self.coast
        for n, (a, b) in enumerate(self.coast):
            for c in self._cells(a, b):
                self.grid[c].append(n)

    @classmethod
    def load(cls, path):
        polys = []
        for f in json.load(open(path))["features"]:
            polys += polys_of(f["geometry"])
        return cls(polys)

    @classmethod
    def tiles(cls, folder=None):
        """The land of the detailed-coast tiles (already dissolved and turned land-left); the cuts along tile edges are
        not coast and are left out."""
        import glob, os
        folder = folder or os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "public", "data", "coast")
        T = json.load(open(os.path.join(folder, "index.json")))["tile"]
        coast = []
        for path in glob.glob(os.path.join(folder, "*_*.json")):
            tx, ty = (int(v) for v in os.path.basename(path)[:-5].split("_"))
            d = json.load(open(path))
            m = 10 ** d["scale"]
            for q in d["rings"]:
                x = y = 0
                pts = []
                for i in range(0, len(q), 2):
                    x += q[i]; y += q[i + 1]
                    pts.append((x, y))
                for (ax, ay), (bx, by) in zip(pts, pts[1:]):
                    if (ax == bx and ax in (tx * m, (tx + T) * m)) or (ay == by and ay in (ty * m, (ty + T) * m)):
                        continue
                    coast.append(((ax / m, ay / m), (bx / m, by / m)))
        return cls(coast=coast)

    @staticmethod
    def _cells(a, b):
        x0, x1 = sorted((a[0], b[0]))
        y0, y1 = sorted((a[1], b[1]))
        return [(i, j) for i in range(math.floor(x0 / CELL), math.floor(x1 / CELL) + 1)
                for j in range(math.floor(y0 / CELL), math.floor(y1 / CELL) + 1)]

    def nearest_coast(self, x, y, r):
        """The nearest coast point within r, and whether (x, y) is on land (decided by the side of that coast)."""
        c = max(0.05, math.cos(math.radians(y)))
        best, hits = r, []
        i0, j0 = math.floor(x / CELL), math.floor(y / CELL)
        ri, rj = math.ceil(r / c / CELL), math.ceil(r / CELL)
        seen = set()
        for i in range(i0 - ri, i0 + ri + 1):
            for j in range(j0 - rj, j0 + rj + 1):
                for n in self.grid.get((i, j), ()):
                    if n in seen:
                        continue
                    seen.add(n)
                    (ax, ay), (bx, by) = self.coast[n]
                    dx, dy = (bx - ax) * c, by - ay
                    px, py = (x - ax) * c, y - ay
                    L = dx * dx + dy * dy
                    t = 0 if L == 0 else max(0.0, min(1.0, (px * dx + py * dy) / L))
                    d = math.hypot(px - t * dx, py - t * dy)
                    if d < best - 1e-12:
                        best, hits = d, [(n, t, dx, dy, px, py)]
                    elif d <= best + 1e-12:
                        hits.append((n, t, dx, dy, px, py))
        if not hits:
            return None
        n, t = hits[0][0], hits[0][1]
        (ax, ay), (bx, by) = self.coast[n]
        point = [ax + t * (bx - ax), ay + t * (by - ay)]
        inner = [h for h in hits if 0 < h[1] < 1]
        if inner:  # nearest to the middle of an edge: its side decides
            _, _, dx, dy, px, py = inner[0]
            land = dx * py - dy * px > 0
        else:  # nearest to a corner: the two edges meeting there decide together (their averaged normal)
            nx = ny = 0.0
            for _, _, dx, dy, _, _ in hits:
                L = math.hypot(dx, dy) or 1
                nx, ny = nx - dy / L, ny + dx / L
            vx, vy = (x - point[0]) * c, y - point[1]
            land = vx * nx + vy * ny > 0
        return best, point, land

    def rings(self):
        """Chain the coast edges into closed rings."""
        out_of = collections.defaultdict(list)
        for a, b in self.coast:
            out_of[a].append(b)
        rings = []
        for start in list(out_of):
            while out_of[start]:
                ring, p = [start], start
                while True:
                    q = out_of[p].pop()
                    ring.append(q)
                    p = q
                    if p == start or not out_of[p]:
                        break
                if ring[-1] == start and len(ring) >= 4:
                    rings.append(ring)
        return rings


# ---- carrying a coarse coastline out to the real one
# Cliopatria's coasts (and the hand-drawn occupied areas of the war stories) follow the real coast only roughly: a
# median 5-9 km off it, a tenth of points 15-30 km off (tools/build_detail.py measures it). Zoomed in, the land between
# such a coast and the sea showed as a grey strip. snap_ring() moves each point of a coastal stretch to just past the
# nearest real coast (MARGIN out to sea), adding points along the way so the stretch follows the coast; the map then
# clips the shape to the real coastline when zoomed in (public/app.js, "detailed coastline").
REACH = 0.25        # degrees (~28 km): points further than this from the sea are inland and stay where they are
JUNCTION = 0.15     # degrees: where a border shared with a neighbour reaches the coast, its last point moves if this close
STEP = 0            # degrees between points added along a coastal edge that cuts inland before it moves (0: none).
                    # 0.1 (~11 km) raised coastal land inside a realm from 35% to 44% (Balkans, 1370) but added ~10%
                    # to every border file's download; the app's coast band (BAND_KM) fills such strips for free
CUT_IN = 0.02       # degrees (~2 km): an edge whose middle is further inland than this cuts across the land
MARGIN = 0.02       # degrees (~2 km) past the coast: beyond the 0.01 rounding, so a moved point stays at sea
MAX_ANGLE = 50      # degrees: a point moves only if the sea lies roughly straight out from the shape there


def _push(land, x, y, reach, normal=None, veto=None):
    """Where (x, y) moves to: just past the nearest coast, or None if it stays (inland, at sea, or the sea is not
    straight out from the shape)."""
    hit = land.nearest_coast(x, y, reach)
    if not hit or not hit[2]:
        return None
    d, (cx, cy), _ = hit
    c = max(0.05, math.cos(math.radians(y)))
    ux, uy = (cx - x) * c, cy - y
    L = math.hypot(ux, uy)
    if L < 1e-9:
        return None
    ux, uy = ux / L, uy / L
    if normal is not None and ux * normal[0] + uy * normal[1] < math.cos(math.radians(MAX_ANGLE)):
        return None
    if veto and (veto(cx, cy) or veto((x + cx) / 2, (y + cy) / 2)):
        return None
    for m in (MARGIN, 2 * MARGIN, 4 * MARGIN):
        tx, ty = cx + ux * m / c, cy + uy * m
        h = land.nearest_coast(tx, ty, m * 3)
        if h is None or not h[2]:
            return [tx, ty]
    return None


def snap_ring(ring, hole, shared, pinned, land, step=None, reach=None, veto=None):
    """ring: closed [[lon, lat], ...]; hole: True for an inner ring; shared[i]: edge i (ring[i] -> ring[i+1]) is a border
    with a neighbouring realm; pinned: points that are inside a shared border somewhere (never moved). Returns the new
    ring and the number of points moved."""
    n = len(ring) - 1
    if n < 3:
        return ring, 0
    area = signed_area(ring)
    outside = 1 if (area > 0) != hole else -1  # +1: the shape lies left of its edges, so "out" is to the right
    lat = sum(p[1] for p in ring[:n]) / n
    c = max(0.05, math.cos(math.radians(lat)))

    def normal(a, b):
        dx, dy = (b[0] - a[0]) * c, b[1] - a[1]
        L = math.hypot(dx, dy) or 1
        return (dy / L * outside, -dx / L * outside)

    pts, kinds, norms, added = [], [], [], []  # kind: 0 free, 1 junction, 2 fixed
    for i in range(n):
        a, b = ring[i], ring[i + 1]
        prev_shared, next_shared = shared[i - 1], shared[i]
        if (a[0], a[1]) in pinned or (prev_shared and next_shared):
            kind = 2
        elif prev_shared or next_shared:
            kind = 1
        else:
            kind = 0
        na, nb = normal(ring[i - 1], a), normal(a, b)
        pts.append([a[0], a[1]]); kinds.append(kind); norms.append(((na[0] + nb[0]) / 2, (na[1] + nb[1]) / 2)); added.append(False)
        if not next_shared:  # a coastal edge (or one facing unrecorded land): points along it, if it is near the sea
            L = math.hypot((b[0] - a[0]) * c, b[1] - a[1])
            st = STEP if step is None else step
            k = int(L / st) if st else 0
            mid = land.nearest_coast((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, REACH) if k else None
            if mid and mid[2] and mid[0] > CUT_IN:  # only an edge that cuts across the land, not one already at the shore
                for s in range(1, k + 1):
                    u = s / (k + 1)
                    pts.append([a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u]); kinds.append(0); norms.append(nb); added.append(True)
    moved = [False] * len(pts)
    for i, (p, kind) in enumerate(zip(pts, kinds)):
        if kind == 2:
            continue
        q = _push(land, p[0], p[1], JUNCTION if kind == 1 else (reach or REACH), None if kind == 1 else norms[i], veto)
        if q:
            pts[i], moved[i] = q, True
    # Added points that did not move lie on the original straight edge: dropped again. Along a run of moved points, those
    # that add nothing at a SIMPLIFY tolerance are dropped too (a straight coast needs few).
    out, run = [], []
    for i, p in enumerate(pts):
        if moved[i] and kinds[i] == 0:
            run.append(p); continue
        if run:
            out += _thin(out[-1] if out else None, run, p); run = []
        if not added[i] or moved[i]:
            out.append(p)
    if run:
        out += _thin(out[-1] if out else None, run, out[0] if out else None)
    out = [p for i, p in enumerate(out) if i == 0 or p != out[i - 1]]
    out.append(list(out[0]))
    return out, sum(moved)


SIMPLIFY = 0.01  # degrees (~1 km, the rounding of the border files)


def _thin(before, run, after):
    """The points of a moved run worth keeping, between the fixed points before and after it."""
    if before is None or after is None or len(run) < 3:
        return run
    from build import dp  # noqa: E402  (shared Douglas-Peucker)
    return dp([before] + run + [after], SIMPLIFY)[1:-1]


# ---- the occupied areas of the war stories (content/cinema/*.json, published by tools/content.py)
# They are drawn by hand from campaign maps, a few dozen points each, and often stop short of the sea, leaving a grey
# strip of coast. Each keyframe's ring is carried out to the coast like a realm's (points added every OCC_STEP first,
# since these rings are coarse). Ground that the other side holds in an occupied area of its own at that date (a
# beachhead, a besieged port) is never taken: a point whose way to the sea crosses it stays. An occupied area marked
# "coast": false is left as drawn.
OCC_STEP = 0.05     # degrees (~5 km)
OCC_REACH = 0.08    # degrees (~9 km): most hand-drawn coastal points lie this close to the sea, while pockets the
                    # other side held on a coast run deeper (Oranienbaum 1941-44, Anzio 1944, Mykolaiv 2022), which a
                    # longer reach swallowed


def _inside(x, y, ring):
    c = False
    j = len(ring) - 1
    for i in range(len(ring)):
        xi, yi = ring[i][0], ring[i][1]
        xj, yj = ring[j][0], ring[j][1]
        if (yi > y) != (yj > y) and x < (xj - xi) * (y - yi) / ((yj - yi) or 1e-12) + xi:
            c = not c
        j = i
    return c


def snap_occupations(cine, land, frac_year):
    """Carry every occupied area's keyframes out to the coast (in place). frac_year: date string -> fractional year.
    Returns the number of points moved."""
    occ = cine.get("occupations", [])
    spans = []
    for o in occ:
        ks = o.get("keys", [])
        ts = [frac_year(k["date"]) for k in ks]
        end = frac_year(o["end"]) if o.get("end") else float("inf")
        spans.append((ts, end))
    moved = 0
    for oi, o in enumerate(occ):
        if o.get("coast", cine.get("coast")) is not True:
            continue
        side = o.get("side", 1)
        for k in o.get("keys", []):
            t = frac_year(k["date"])
            others = []  # the other side's areas at this date: the keyframe in force then
            for oj, x in enumerate(occ):
                if x.get("side", 1) == side or not x.get("keys"):
                    continue
                ts, end = spans[oj]
                if t < ts[0] or t > end:
                    continue
                kk = max(i for i, v in enumerate(ts) if v <= t)
                ring = x["keys"][kk]["coords"]
                xs, ys = [p[0] for p in ring], [p[1] for p in ring]
                others.append((min(xs), max(xs), min(ys), max(ys), ring))
            veto = (lambda px, py, others=others: any(a <= px <= b and c <= py <= d and _inside(px, py, r) for a, b, c, d, r in others))
            ring = [list(p) for p in k["coords"]]
            was_open = ring[0] != ring[-1]
            if was_open:
                ring.append(list(ring[0]))
            area = signed_area(ring)
            if area == 0:
                continue
            new, m = snap_ring(ring, False, [False] * (len(ring) - 1), set(), land, step=OCC_STEP, reach=OCC_REACH, veto=veto)
            if m:
                new = [[round(p[0], 3), round(p[1], 3)] for p in new]
                new = [p for i, p in enumerate(new) if i == 0 or p != new[i - 1]]
                if was_open and new[0] == new[-1]:
                    new.pop()
                k["coords"] = new
                moved += m
    return moved
