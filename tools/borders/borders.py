"""The atlas's borders as readers see them, in pure Python, for checks and review sheets.

Ports public/app.js: Cliopatria chunks (public/data/clio/<start>.json) filtered by year, then the corrections layer
(public/data/corrections.json: clip, hide, asPeople, crop, relabel with group keys) and the reconstruction layers
(public/data/supplements.json, which replace the realms they name). Also ports correctTimelines() so area checks use
the corrected per-realm timelines.
"""
import json, math, os

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DATA = os.path.join(ROOT, "public", "data")


def _in(y, r):
    return r[0] <= y <= r[1]


def point_in_ring(pt, ring):
    x, y, inside = pt[0], pt[1], False
    n = len(ring)
    for i in range(n):
        x1, y1 = ring[i]
        x2, y2 = ring[(i + 1) % n]
        if (y1 > y) != (y2 > y) and x < (x2 - x1) * (y - y1) / ((y2 - y1) or 1e-12) + x1:
            inside = not inside
    return inside


def ring_area_km2(r):
    R = 6371.0
    a = 0.0
    for (x1, y1), (x2, y2) in zip(r, r[1:] + r[:1]):
        a += math.radians(x2 - x1) * (2 + math.sin(math.radians(y1)) + math.sin(math.radians(y2)))
    return abs(a * R * R / 2)


class State:
    """One drawn state polygon set in one year (after corrections)."""
    __slots__ = ("n", "k", "orig", "polys", "bboxes", "crop", "cut", "recon", "props")

    def __init__(self, props, polys, crop=None, recon=False, cut=None):
        self.props, self.n, self.k = props, props["n"], props.get("k") or props["n"]
        self.orig = props.get("fixed") or props["n"]
        self.polys, self.crop, self.recon, self.cut = polys, crop, recon, cut or []
        self.bboxes = []
        for poly in polys:
            xs = [p[0] for p in poly[0]]; ys = [p[1] for p in poly[0]]
            self.bboxes.append((min(xs), min(ys), max(xs), max(ys)))

    def contains(self, pt):
        if self.crop and not (self.crop[0] <= pt[0] <= self.crop[2] and self.crop[1] <= pt[1] <= self.crop[3]):
            return False
        if any(c[0] <= pt[0] <= c[2] and c[1] <= pt[1] <= c[3] for c in self.cut):
            return False
        for poly, b in zip(self.polys, self.bboxes):
            if b[0] <= pt[0] <= b[2] and b[1] <= pt[1] <= b[3] and point_in_ring(pt, poly[0]) and not any(point_in_ring(pt, h) for h in poly[1:]):
                return True
        return False

    def names(self):
        # a relabelled shape answers only to its new name and group, so claims can test that the old name is gone
        return {self.n, self.k}


class Borders:
    def __init__(self, corrections=None):
        self.index = json.load(open(os.path.join(DATA, "clio", "index.json")))
        self.realms = self.index["realms"]
        self.chunk_starts = sorted(self.index["chunks"])
        cp = corrections or os.environ.get("CORRECTIONS_FILE") or os.path.join(DATA, "corrections.json")
        self.corr = json.load(open(cp)) if os.path.exists(cp) else {"realms": {}}
        if "realms" not in self.corr:
            self.corr = {"realms": self.corr}
        sp = os.path.join(DATA, "supplements.json")
        self.supps = json.load(open(sp)) if os.path.exists(sp) else []
        self._chunks, self._years = {}, {}

    def chunk(self, y):
        start = max([c for c in self.chunk_starts if c <= y] or [self.chunk_starts[0]])
        if start not in self._chunks:
            self._chunks[start] = json.load(open(os.path.join(DATA, "clio", f"{start}.json")))["features"]
        return self._chunks[start]

    def correct(self, props, y):
        """Port of correctFeature(): returns (props, crop box, cut boxes) or None (not drawn as a state this year)."""
        c = self.corr["realms"].get(props["n"])
        if not c:
            return props, None, []
        if c.get("clip") and not _in(y, c["clip"]):
            return None
        if any(_in(y, r) for r in c.get("hide", [])):
            return None
        if any(_in(y, (r["from"], r["to"])) for r in c.get("asPeople", [])):
            return None  # drawn as a people (hatched), not a state
        crop = next((r["box"] for r in c.get("crop", []) if _in(y, (r["from"], r["to"]))), None)
        cuts = [r["box"] for r in c.get("cut", []) if _in(y, (r["from"], r["to"]))]
        rl = next((r for r in c.get("relabel", []) if _in(y, (r["from"], r["to"]))), None)
        if not rl:
            return props, crop, cuts
        k = props.get("k") if props.get("k") != props["n"] and not str(rl.get("key", "")).startswith("(") else rl.get("key", rl["name"])
        return {**props, "n": rl["name"], "k": k, "fixed": props["n"]}, crop, cuts

    def states(self, y):
        if y in self._years:
            return self._years[y]
        out = []
        for f in self.chunk(y):
            p = f["properties"]
            if not (p["f"] <= y <= p["t"]) or p.get("people"):
                continue
            r = self.correct(p, y)
            if not r:
                continue
            g = f["geometry"]
            polys = g["coordinates"] if g["type"] == "MultiPolygon" else [g["coordinates"]]
            out.append(State(r[0], polys, r[1], cut=r[2]))
        act = [s for s in self.supps if s["from"] <= y <= s["to"]]
        if act:
            rep = {n for s in act for n in s.get("replaces", [])}
            out = [s for s in out if s.orig not in rep and s.n not in rep]
            for s in act:
                for rg in s["regions"]:
                    f, t = rg.get("from", s["from"]), rg.get("to", s["to"])
                    if f <= y <= t:
                        out.append(State({"n": rg["name"], "k": rg.get("key") or rg["name"]}, [[rg["coords"]]], recon=True))
        self._years[y] = out
        if len(self._years) > 40:
            self._years.pop(next(iter(self._years)))
        return out

    def at(self, pt, y, near_km=12):
        """States drawn at a point in year y. Coastal and river cities often fall just outside simplified coastlines,
        so if nothing is drawn exactly there, look on rings 4, 8 and 12 km away and return what is nearest."""
        hit = [s for s in self.states(y) if s.contains(pt)]
        if hit or not near_km:
            return hit
        for r in (4, 8, 12):
            if r > near_km:
                break
            dy, dx = r / 110.57, r / (111.32 * max(0.2, math.cos(math.radians(pt[1]))))
            found = []
            for i in range(12):
                a = i * math.pi / 6
                q = [pt[0] + dx * math.cos(a), pt[1] + dy * math.sin(a)]
                found += [s for s in self.states(y) if s.contains(q) and s not in found]
            if found:
                return found
        return []

    def timelines(self):
        """Port of correctTimelines(): realm name -> [[from, to, km2], ...] as the app uses them."""
        R = {n: {"tl": [list(x) for x in r["tl"]]} for n, r in self.realms.items()}

        def split(tl, a, b):
            inside, outside = [], []
            for f, t, ar in tl:
                if t < a or f > b:
                    outside.append([f, t, ar]); continue
                if f < a: outside.append([f, a - 1, ar])
                inside.append([max(f, a), min(t, b), ar])
                if t > b: outside.append([b + 1, t, ar])
            return inside, outside

        def sumrows(a, b):
            cuts = sorted({v for f, t, _ in a + b for v in (f, t + 1)})
            at = lambda tl, y: next((r[2] for r in tl if r[0] <= y <= r[1]), 0)
            return [[cuts[i], cuts[i + 1] - 1, at(a, cuts[i]) + at(b, cuts[i])] for i in range(len(cuts) - 1) if at(a, cuts[i]) + at(b, cuts[i]) > 0]

        for name, c in self.corr["realms"].items():
            r = R.get(name)
            if not r:
                continue
            if c.get("clip"):
                r["tl"] = split(r["tl"], *c["clip"])[0]
            for h in c.get("hide", []):
                r["tl"] = split(r["tl"], *h)[1]
            for ap in c.get("asPeople", []):
                r["tl"] = split(r["tl"], ap["from"], ap["to"])[1]
            for rl in c.get("relabel", []):
                inside, r["tl"] = split(r["tl"], rl["from"], rl["to"])
                if not inside:
                    continue
                if rl.get("addTo"):
                    for t in rl["addTo"]:
                        if t in R: R[t]["tl"] = sumrows(R[t]["tl"], inside)
                    continue
                if str(rl.get("key", "")).startswith("("):
                    continue
                tgt = R.setdefault(rl.get("key", rl["name"]), {"tl": []})
                tgt["tl"] = sorted(tgt["tl"] + inside)
            if not r["tl"]:
                del R[name]
        return {n: v["tl"] for n, v in R.items()}
