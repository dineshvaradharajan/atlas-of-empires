#!/usr/bin/env python3
"""Build side-by-side comparison images: our map (Cliopatria, with corrections) vs each realm's
Wikimedia Commons reference map, at the year the reference depicts.

Output: <out>/<slug>.png (left: our map cropped to the realm with a lat/lon graticule;
right: the Commons map) and <out>/index.json describing each pair.

Run:  python3 -I tools/compare_refs.py <out_dir> [--limit N]
Uses macOS `qlmanage` to rasterise SVG. Reference thumbnails are fetched from upload.wikimedia.org.
"""
import base64, glob, html, json, math, os, re, subprocess, sys, time, urllib.error, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = sys.argv[1]
LIMIT = int(sys.argv[sys.argv.index("--limit") + 1]) if "--limit" in sys.argv else None
# Wikimedia's robot policy asks for a descriptive User-Agent with a contact point and a modest request rate.
UA = {"User-Agent": "AtlasOfEmpires/0.1 (https://github.com/dineshvaradharajan/atlas-of-empires; educational map, reference comparison) python-urllib"}


def fetch(url, dest, tries=5):
    """Polite download: ~1 request/s, honour Retry-After on 429/503, exponential backoff."""
    delay = 5
    for _ in range(tries):
        try:
            req = urllib.request.Request(url, headers=UA)
            with urllib.request.urlopen(req, timeout=40) as resp, open(dest, "wb") as fh:
                fh.write(resp.read())
            time.sleep(1.1)
            return None
        except urllib.error.HTTPError as e:
            if e.code in (429, 503):
                wait = int(e.headers.get("Retry-After") or delay)
                time.sleep(min(wait, 120)); delay = min(delay * 2, 120)
                continue
            return f"HTTP {e.code}"
        except Exception as e:  # noqa: BLE001
            time.sleep(delay); delay = min(delay * 2, 120); err = str(e)
    return "gave up after retries"

R = json.load(open(f"{ROOT}/public/data/clio/index.json"))
REALMS, STARTS = R["realms"], R["chunks"]
COMMONS = json.load(open(f"{ROOT}/public/data/commons.json"))
CONTENT = json.load(open(f"{ROOT}/public/data/content.json"))
CORR = json.load(open(f"{ROOT}/content/corrections.json"))["realms"]
BASE_YEARS = json.load(open(f"{ROOT}/public/data/index.json"))["years"]


def year_from_ref(text, lo, hi):
    """Pick the year a reference map depicts from its file name / description."""
    t = text.replace("_", " ")
    cands = []
    for m in re.finditer(r"(?<!\d)(\d{2,4})\s*(BCE|BC|B\.C\.|AD|CE|A\.D\.)?(?!\d)", t):
        y, era = int(m.group(1)), (m.group(2) or "").upper()
        if era.startswith("B"):
            y = -y
        slack = max(25, (hi - lo) // 10)
        if lo - slack <= y <= hi + slack:
            cands.append(min(hi, max(lo, y)))
    # also "Nth century" → middle of that century
    for m in re.finditer(r"(\d{1,2})(st|nd|rd|th) century\s*(BCE|BC)?", t, re.I):
        c = int(m.group(1)); bc = bool(m.group(3))
        y = -(c * 100 - 50) if bc else c * 100 - 50
        if lo <= y <= hi:
            cands.append(y)
    return cands or None


def chunk_of(y):
    c = STARTS[0]
    for s in STARTS:
        if s <= y:
            c = s
    return c


_chunks = {}
def features(y):
    c = chunk_of(y)
    if c not in _chunks:
        _chunks[c] = json.load(open(f"{ROOT}/public/data/clio/{c}.json"))["features"]
    out = []
    for f in _chunks[c]:
        p = f["properties"]
        if not (p["f"] <= y <= p["t"]):
            continue
        corr = CORR.get(p["n"], {})
        if corr.get("clip") and not (corr["clip"][0] <= y <= corr["clip"][1]):
            continue
        if any(a <= y <= b for a, b in corr.get("hide", [])) or any(r["from"] <= y <= r["to"] for r in corr.get("asPeople", [])):
            continue
        rl = next((r for r in corr.get("relabel", []) if r["from"] <= y <= r["to"]), None)
        if rl:
            p = dict(p, n=rl["name"], k=rl["key"])
        out.append((p, f["geometry"]["coordinates"]))
    return out


_bases = {}
def land(y):
    by = min(BASE_YEARS, key=lambda v: abs(v - y))
    if by not in _bases:
        _bases[by] = [f["geometry"]["coordinates"] for f in json.load(open(f"{ROOT}/public/data/{by}.json"))["features"]]
    return _bases[by]


def ring_area(r):
    return abs(sum(r[i][0] * r[i + 1][1] - r[i + 1][0] * r[i][1] for i in range(len(r) - 1))) / 2


def render(name, y, ref_path, meta, out_png):
    feats = features(y)
    mine = [g for p, g in feats if p["n"] == name or p["k"] == name]
    if not mine:
        return False
    parts = [poly for g in mine for poly in g]
    big = max(ring_area(p[0]) for p in parts)
    main = [p for p in parts if ring_area(p[0]) >= big * 0.02]
    xs = [pt[0] for p in main for pt in p[0]]; ys = [pt[1] for p in main for pt in p[0]]
    x0, x1, y0, y1 = min(xs), max(xs), min(ys), max(ys)
    w, h = max(x1 - x0, 4), max(y1 - y0, 3)
    x0 -= w * 0.25; x1 += w * 0.25; y0 -= h * 0.25; y1 += h * 0.25
    # keep a sane aspect (map panel is 640x520)
    PW, PH = 980, 440
    kx = math.cos(math.radians((y0 + y1) / 2))  # equirectangular with latitude correction
    sx = PW / ((x1 - x0) * kx); sy = PH / (y1 - y0); s = min(sx, sy)
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
    P = lambda lon, lat: (PW / 2 + (lon - cx) * kx * s, PH / 2 - (lat - cy) * s)

    def path(geom_polys):
        d = []
        for poly in geom_polys:
            for ring in poly:
                pts = [P(a, b) for a, b in ring]
                d.append("M" + "L".join(f"{u:.1f},{v:.1f}" for u, v in pts) + "Z")
        return "".join(d)

    svg = [f'<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1000" viewBox="0 0 1000 1000">',
           '<rect width="1000" height="1000" fill="#fff"/>',
           f'<svg x="10" y="52" width="{PW}" height="{PH}" viewBox="0 0 {PW} {PH}"><rect width="{PW}" height="{PH}" fill="#dfeaf0"/>',
           f'<path d="{path([poly for g in land(y) for poly in g])}" fill="#e9e6df" stroke="none"/>']
    for p, g in feats:
        if not (p["n"] == name or p["k"] == name):
            svg.append(f'<path d="{path(g)}" fill="#cfcfc9" stroke="#fff" stroke-width=".6"/>')
    svg.append(f'<path d="{path(parts)}" fill="#e5402a" fill-opacity=".85" stroke="#111" stroke-width="1"/>')
    step = 5 if max(x1 - x0, y1 - y0) < 40 else 10
    for lon in range(int(x0 // step * step), int(x1) + step, step):
        (u, _), _ = P(lon, y0), None
        svg.append(f'<line x1="{u:.1f}" y1="0" x2="{u:.1f}" y2="{PH}" stroke="#7a8a96" stroke-width=".5" stroke-dasharray="3 3"/><text x="{u + 2:.1f}" y="{PH - 4}" font-size="11" fill="#33414c">{abs(lon)}°{"E" if lon >= 0 else "W"}</text>')
    for lat in range(int(y0 // step * step), int(y1) + step, step):
        _, v = P(x0, lat)
        svg.append(f'<line x1="0" y1="{v:.1f}" x2="{PW}" y2="{v:.1f}" stroke="#7a8a96" stroke-width=".5" stroke-dasharray="3 3"/><text x="3" y="{v - 3:.1f}" font-size="11" fill="#33414c">{abs(lat)}°{"N" if lat >= 0 else "S"}</text>')
    svg.append("</svg>")
    yl = f"{-y} BCE" if y < 0 else f"{y} CE"
    svg.append(f'<text x="10" y="22" font-size="18" font-weight="700" font-family="Helvetica">OUR MAP: {html.escape(name)} — {yl}</text>')
    svg.append(f'<text x="10" y="42" font-size="13" fill="#555" font-family="Helvetica">Cliopatria (+corrections); red = this realm, grey = other states</text>')
    mime = "image/png" if ref_path.lower().endswith(".png") else "image/gif" if ref_path.lower().endswith(".gif") else "image/jpeg"
    b64 = base64.b64encode(open(ref_path, "rb").read()).decode()
    svg.append(f'<text x="10" y="518" font-size="18" font-weight="700" font-family="Helvetica">REFERENCE (Wikimedia Commons)</text>')
    svg.append(f'<text x="10" y="538" font-size="12" fill="#555" font-family="Helvetica">{html.escape(meta[:150])}</text>')
    svg.append(f'<image x="10" y="548" width="980" height="445" preserveAspectRatio="xMidYMid meet" href="data:{mime};base64,{b64}"/>')
    svg.append("</svg>")
    svg_path = out_png[:-4] + ".svg"
    open(svg_path, "w").write("".join(svg))
    subprocess.run(["qlmanage", "-t", "-s", "1000", "-o", os.path.dirname(out_png), svg_path], capture_output=True, timeout=60)
    ql = svg_path + ".png"
    if os.path.exists(ql):
        os.replace(ql, out_png)
        os.remove(svg_path)
        return True
    return False


def main():
    os.makedirs(f"{OUT}/refs", exist_ok=True)
    want = set()
    for e in CONTENT["empires"]: want.update(e.get("clio", []))
    for j in CONTENT["journeys"]: want.update(c["clio"] for c in j["chain"])
    # one comparison per Commons map: the largest realm that uses it
    by_wiki = {}
    for n, r in REALMS.items():
        w = r.get("wiki")
        if not w or w not in COMMONS or not r["tl"] or re.match(r"^\((Alliance|Allegiance|Personal union)", n):
            continue
        peak = max(a for _, _, a in r["tl"])
        if n not in want and peak < 300000:
            continue
        if w not in by_wiki or peak > by_wiki[w][1]:
            by_wiki[w] = (n, peak)
    items = sorted(by_wiki.items(), key=lambda kv: -kv[1][1])
    if LIMIT:
        items = items[:LIMIT]
    index = []
    for i, (wiki, (name, _)) in enumerate(items):
        c = COMMONS[wiki]
        r = REALMS[name]
        lo, hi = r["tl"][0][0], r["tl"][-1][1]
        peak_row = max(r["tl"], key=lambda x: x[2])
        meta = f'{c["file"].replace("File:", "")} — {c.get("desc", "")}'
        ys = year_from_ref(meta, lo, hi)
        area_at = lambda yy: next((a for f, t, a in r["tl"] if f <= yy <= t), 0)
        y = max(ys, key=area_at) if ys else None  # ranges like "1206–1294": use the year of widest extent
        basis = "reference date" if y is not None else "realm's peak (no date in reference)"
        if y is None:
            y = (peak_row[0] + peak_row[1]) // 2
        # snap to a year with data for the realm
        if not any(f <= y <= t for f, t, _ in r["tl"]):
            y = min(((f + t) // 2 for f, t, _ in r["tl"]), key=lambda v: abs(v - y))
        slug = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")[:60] or f"r{i}"
        ext = os.path.splitext(c["thumb"].split("?")[0])[1].lower() or ".jpg"
        if ext not in (".png", ".jpg", ".jpeg", ".gif"):
            ext = ".png"  # svg thumbs are served as png
        ref = f"{OUT}/refs/{slug}{ext}"
        if not os.path.exists(ref) or os.path.getsize(ref) == 0:
            err = fetch(c["thumb"], ref)
            if err:
                if os.path.exists(ref): os.remove(ref)
                index.append({"realm": name, "wiki": wiki, "error": f"download failed: {err}"})
                continue
        if ref.endswith(".gif"):  # animated "expansion" maps: compare against the final frame
            last = ref[:-4] + ".last.png"
            if not os.path.exists(last):
                subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", ref, "-vf", "reverse", "-frames:v", "1", last], capture_output=True, timeout=120)
            if os.path.exists(last):
                ref = last
        png = f"{OUT}/{slug}.png"
        ok = os.path.exists(png) or render(name, y, ref, meta, png)
        index.append({"realm": name, "wiki": wiki, "year": y, "year_basis": basis, "image": png if ok else None,
                      "reference": c["page"], "ref_file": c["file"], "ref_desc": c.get("desc", ""), "slug": slug})
        if i % 25 == 0:
            print(f"{i}/{len(items)} {name}", flush=True)
    json.dump(index, open(f"{OUT}/index.json", "w"), ensure_ascii=False, indent=1)
    print(f"done: {sum(1 for x in index if x.get('image'))} images, {sum(1 for x in index if not x.get('image'))} without")


if __name__ == "__main__":
    main()
