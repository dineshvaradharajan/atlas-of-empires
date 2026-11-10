"""Shared geometry for war cinema checks and renders.

Replays a war the way public/app.js draws it: keyframes are resampled to evenly spaced points, aligned to the
previous keyframe, and linearly interpolated; occupied areas hold until their `end` (or the end of the war),
fronts fade ~5 weeks after their last keyframe unless that is the war's end. Side membership follows the war's
`fromDate`/`toDate` (else whole years). Pure Python, no third-party packages.
"""
import json, re, math, os

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


def frac(d):
    """'1916-07-01' -> 1916.497 (same formula as fracDate in app.js)."""
    sd = str(d)
    parts = [int(x) for x in sd.lstrip("-").split("-") if x != ""]
    if sd.startswith("-"):
        parts[0] = -parts[0]  # BCE: '-216-08-02' -> -216 + months (year y spans [y, y+1))
    y, m, dd = (parts + [0, 0])[:3]
    return y + ((m - 1) * 30.4375 + (dd - 1 if dd else 0)) / 365.25 if m else float(y)


def km(a, b):
    lat = math.radians((a[1] + b[1]) / 2)
    return math.hypot((a[0] - b[0]) * math.cos(lat) * 111.32, (a[1] - b[1]) * 110.57)


def resample(pts, n, closed):
    P = [list(p) for p in pts]
    if closed and len(P) > 2 and P[0] == P[-1]:
        P.pop()
    if closed:
        P.append(P[0])
    L = [0.0]
    for i in range(1, len(P)):
        L.append(L[-1] + math.hypot((P[i][0] - P[i - 1][0]) * math.cos(math.radians(P[i][1])), P[i][1] - P[i - 1][1]))
    tot = L[-1] or 1
    out, m, j = [], (n if closed else n - 1), 0
    for s in range(n):
        d = s / m * tot
        while j < len(L) - 2 and L[j + 1] < d:
            j += 1
        u = (d - L[j]) / ((L[j + 1] - L[j]) or 1)
        out.append([P[j][0] + (P[j + 1][0] - P[j][0]) * u, P[j][1] + (P[j + 1][1] - P[j][1]) * u])
    return out


def _d2(a, b):
    return (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2


def _sarea(r):
    return sum(p[0] * r[(i + 1) % len(r)][1] - r[(i + 1) % len(r)][0] * p[1] for i, p in enumerate(r))


def align(pts, prev, closed):
    if not prev:
        return pts
    if not closed:
        flip = _d2(pts[0], prev[0]) + _d2(pts[-1], prev[-1]) > _d2(pts[0], prev[-1]) + _d2(pts[-1], prev[0])
        return pts[::-1] if flip else pts
    r = pts[::-1] if (_sarea(pts) > 0) != (_sarea(prev) > 0) else pts
    best = min(range(len(r)), key=lambda o: sum(_d2(r[(j + o) % len(r)], prev[j]) for j in range(len(r))))
    return [r[(j + best) % len(r)] for j in range(len(r))]


class Track:
    """A front (line) or occupied area (ring) with interpolated keyframes."""

    def __init__(self, item, closed, war_end):
        self.item, self.closed, self.name = item, closed, item["name"]
        field = "coords" if closed else "line"
        prev, self.keys = None, []
        for k in item.get("keys", []):
            p = align(resample(k[field], 192 if closed else 128, closed), prev, closed)
            prev = p
            self.keys.append((frac(k["date"]), p))
        last = self.keys[-1][0] if self.keys else 0
        if item.get("end"):
            self.hold = frac(item["end"])
        elif closed:
            self.hold = war_end
        else:
            self.hold = war_end if last >= war_end - 0.06 else last + 0.1
        self.side = item.get("side")

    @property
    def t0(self):
        return self.keys[0][0] if self.keys else None

    def at(self, t):
        ks = self.keys
        if not ks or t < ks[0][0] or t > self.hold:
            return None
        if t >= ks[-1][0]:
            return ks[-1][1]
        for (t0, a), (t1, b) in zip(ks, ks[1:]):
            if t0 <= t <= t1:
                u = (t - t0) / (t1 - t0) if t1 > t0 else 1
                return [[p[0] + (q[0] - p[0]) * u, p[1] + (q[1] - p[1]) * u] for p, q in zip(a, b)]
        return None

    def keys_in(self, a, b):
        return [t for t, _ in self.keys if a - 1e-6 <= t <= b + 1e-6]


def point_in_ring(pt, ring):
    x, y, inside = pt[0], pt[1], False
    n = len(ring)
    for i in range(n):
        x1, y1 = ring[i]
        x2, y2 = ring[(i + 1) % n]
        if (y1 > y) != (y2 > y) and x < (x2 - x1) * (y - y1) / ((y2 - y1) or 1e-12) + x1:
            inside = not inside
    return inside


def dist_to_line(pt, line, closed=False):
    best = float("inf")
    segs = list(zip(line, line[1:] + ([line[0]] if closed else [])))
    lat = math.radians(pt[1])
    sx, sy = math.cos(lat) * 111.32, 110.57
    px, py = pt[0] * sx, pt[1] * sy
    for a, b in segs:
        ax, ay, bx, by = a[0] * sx, a[1] * sy, b[0] * sx, b[1] * sy
        dx, dy = bx - ax, by - ay
        L2 = dx * dx + dy * dy
        u = 0 if L2 == 0 else max(0, min(1, ((px - ax) * dx + (py - ay) * dy) / L2))
        best = min(best, math.hypot(px - (ax + u * dx), py - (ay + u * dy)))
    return best


def in_box(pt, b, pad=0.0):
    return pt and b[0] - pad <= pt[0] <= b[2] + pad and b[1] - pad <= pt[1] <= b[3] + pad


class War:
    """A war with its side members, cinema layers and the period's state borders."""

    def __init__(self, war_id):
        content = json.load(open(os.path.join(ROOT, "public", "data", "content.json")))
        self.war = next(w for w in content["wars"] if w["id"] == war_id)
        # CINEMA_FILE lets a reviewer test a patched copy without touching the shared file
        self.cine = json.load(open(os.environ.get("CINEMA_FILE") or os.path.join(ROOT, "content", "cinema", f"{war_id}.json")))
        self.t0, self.t1 = frac(self.cine["start"]), frac(self.cine["end"]) + 0.02
        self.fronts = [Track(f, False, self.t1) for f in self.cine.get("fronts", [])]
        self.occs = [Track(o, True, self.t1) for o in self.cine.get("occupations", [])]
        self.chunks = {}
        idx = json.load(open(os.path.join(ROOT, "public", "data", "clio", "index.json")))
        self.chunk_starts = sorted(idx["chunks"])

    def sides(self, t):
        m = {}
        for i, sd in enumerate(self.war["sides"]):
            for x in sd["members"]:
                a = frac(x["fromDate"]) if x.get("fromDate") else x["from"]
                b = frac(x["toDate"]) if x.get("toDate") else x["to"] + 1
                if a <= t + 1e-9 < b and x["clio"] not in m:
                    m[x["clio"]] = i
        return m

    def base_year(self, t):
        """Which year's borders to draw at time t ("baseYears" overrides, e.g. 1917 borders until Brest-Litovsk)."""
        for o in self.cine.get("baseYears", []):
            if frac(o["start"]) <= t <= frac(o["end"]):
                return o["year"]
        return int(math.floor(t))

    def borders(self):
        """The corrected borders (tools/borders/borders.py: corrections, crops, cuts, relabels), exactly as the app draws them."""
        if not hasattr(self, "_borders"):
            import importlib.util
            sp = importlib.util.spec_from_file_location("borders", os.path.join(ROOT, "tools", "borders", "borders.py"))
            bm = importlib.util.module_from_spec(sp)
            sp.loader.exec_module(bm)
            self._borders = bm.Borders()
        return self._borders

    def states(self, year):
        """(props, polygons) for each state drawn in a year, after corrections (for rendering)."""
        return [(s.props, s.polys) for s in self.borders().states(year)]

    def land(self, year):
        """Land as the app draws it (the nearest yearly base map): a list of (bbox, rings); test with is_land()."""
        if not hasattr(self, "_land"):
            self._land = {}
            d = os.path.join(ROOT, "public", "data")
            self._base_years = sorted(int(f[:-5]) for f in os.listdir(d) if re.fullmatch(r"-?\d+\.json", f))
        by = min(self._base_years, key=lambda v: abs(v - year))
        if by not in self._land:
            polys = []
            for f in json.load(open(os.path.join(ROOT, "public", "data", f"{by}.json")))["features"]:
                g = f.get("geometry") or {}
                for poly in (g.get("coordinates") or []) if g.get("type") == "MultiPolygon" else [g.get("coordinates") or []]:
                    if poly:
                        xs = [p[0] for p in poly[0]]; ys = [p[1] for p in poly[0]]
                        polys.append(((min(xs), min(ys), max(xs), max(ys)), poly))
            self._land[by] = polys
        return self._land[by]

    def is_land(self, pt, year):
        for (x0, y0, x1, y1), poly in self.land(year):
            if x0 <= pt[0] <= x1 and y0 <= pt[1] <= y1 and point_in_ring(pt, poly[0]) and not any(point_in_ring(pt, h) for h in poly[1:]):
                return True
        return False

    def controller(self, pt, t):
        """Side index holding a point at time t (occupation first, then the state it lies in), or None."""
        sm = self.sides(t)
        base, where = None, None
        for s in self.borders().states(self.base_year(t)):
            if s.contains(pt):
                base, where = sm.get(s.n, sm.get(s.k, sm.get(s.orig))), s.n  # original name too, as the app does
                break
        for o in self.occs:  # occupation counts on anything but the occupier's own ground (as the app draws it)
            r = o.at(t)
            side = o.side if o.side is not None else 1
            if r and base != side and point_in_ring(pt, r):
                return side, f"occupied ({where})"
        return base, where

    def front_dist(self, pt, t):
        best, name = float("inf"), None
        for f in self.fronts:
            ln = f.at(t)
            if ln:
                d = dist_to_line(pt, ln)
                if d < best:
                    best, name = d, f.name
        return best, name
