#!/usr/bin/env python3
"""Render an empire's borders through its life as review frames (SVG + PNG via macOS qlmanage).

For an empire journey (content/journeys: its `chain` of realm names per period) or a single realm name, draws the
map as the app shows it (corrections included) at N years across its span: the empire in red, every other state
grey with its name, a lon/lat grid, and any claims (content/borders/claims-*.json) for that year window as squares
(green = map agrees, red = disagrees). Use with reference maps to judge extent and timing.

Run: python3 -I tools/borders/render_empire.py <journey-id | "Realm name"> <out-dir> [--years 8 | --at 1453,1520,...]
"""
import glob, importlib.util, json, math, os, shutil, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location("borders", os.path.join(HERE, "borders.py"))
bm = importlib.util.module_from_spec(spec)
spec.loader.exec_module(bm)
ROOT = bm.ROOT


def proj(ext, W, H):
    lo0, lo1, la0, la1 = ext
    c = math.cos(math.radians(max(-70, min(70, (la0 + la1) / 2))))
    s = min(W / ((lo1 - lo0) * c), H / (la1 - la0))
    ox, oy = (W - (lo1 - lo0) * c * s) / 2, (H - (la1 - la0) * s) / 2
    return lambda p: (round(ox + (p[0] - lo0) * c * s, 1), round(oy + (la1 - p[1]) * s, 1))


def main():
    target, out = sys.argv[1], sys.argv[2]
    os.makedirs(out, exist_ok=True)
    B = bm.Borders()
    content = json.load(open(os.path.join(ROOT, "public", "data", "content.json")))
    j = next((x for x in content["journeys"] if x["id"] == target), None)
    if j:
        chain = j["chain"]; span = j["span"]; title = j.get("name", target)
        keys_at = lambda y: {c["clio"] for c in chain if c["from"] <= y <= c["to"]}
    else:
        tl = B.timelines().get(target)
        if not tl:
            sys.exit(f"no journey or realm named {target!r}")
        span = [min(r[0] for r in tl), max(r[1] for r in tl)]; title = target
        keys_at = lambda y: {target}
    if "--at" in sys.argv:
        years = [int(v) for v in sys.argv[sys.argv.index("--at") + 1].split(",")]
    else:
        n = int(sys.argv[sys.argv.index("--years") + 1]) if "--years" in sys.argv else 8
        years = sorted({round(span[0] + i * (span[1] - span[0]) / (n - 1)) for i in range(n)})
    # frame on the empire's full reach (union of its extents in the sampled years)
    xs, ys = [], []
    for y in years:
        for s in B.states(y):
            if s.names() & keys_at(y):
                for b in s.bboxes:
                    xs += [b[0], b[2]]; ys += [b[1], b[3]]
    if not xs:
        sys.exit("empire not drawn in any sampled year")
    xs.sort(); ys.sort()
    lo0, lo1 = xs[int(len(xs) * 0.03)], xs[int(len(xs) * 0.97) - 1]
    la0, la1 = ys[int(len(ys) * 0.03)], ys[int(len(ys) * 0.97) - 1]
    pad = max(2.0, 0.12 * max(lo1 - lo0, la1 - la0))
    ext = [lo0 - pad, lo1 + pad, max(-85, la0 - pad), min(85, la1 + pad)]
    claims = []
    for f in sorted(glob.glob(os.path.join(ROOT, "content", "borders", "claims-*.json"))):
        claims += json.load(open(f))
    W, H = 1300, 1300
    P = proj(ext, W, H)
    ql = shutil.which("qlmanage")
    for y in years:
        ks = keys_at(y)
        g = [f'<rect width="{W}" height="{H}" fill="#ffffff"/>']
        labels = []
        for s in B.states(y):
            d = ""
            for poly, b in zip(s.polys, s.bboxes):
                if b[2] < ext[0] - 5 or b[0] > ext[1] + 5 or b[3] < ext[2] - 5 or b[1] > ext[3] + 5:
                    continue
                for ring in poly:
                    d += "M" + "L".join("%s,%s" % P(p) for p in ring) + "Z"
            if not d:
                continue
            on = bool(s.names() & ks)
            g.append(f'<path d="{d}" fill="{"#e5402a" if on else "#d9d9d4"}" fill-opacity="{0.85 if on else 1}" stroke="#fff" stroke-width="0.8" fill-rule="evenodd"/>')
            l = s.props.get("l")
            if l and ext[0] <= l[0] <= ext[1] and ext[2] <= l[1] <= ext[3] and s.props.get("a", 0) > 30000:
                labels.append((P(l), s.n, on))
        for lo in range(math.ceil(ext[0]), math.floor(ext[1]) + 1, 5 if ext[1] - ext[0] > 40 else 1):
            x0, _ = P([lo, ext[2]])
            g.append(f'<line x1="{x0}" y1="0" x2="{x0}" y2="{H}" stroke="#000" stroke-opacity="0.08"/><text x="{x0 + 3}" y="{H - 6}" font-size="11" fill="#888" font-family="Helvetica">{lo}°</text>')
        for la in range(math.ceil(ext[2]), math.floor(ext[3]) + 1, 5 if ext[3] - ext[2] > 30 else 1):
            _, y0 = P([ext[0], la])
            g.append(f'<line x1="0" y1="{y0}" x2="{W}" y2="{y0}" stroke="#000" stroke-opacity="0.08"/><text x="4" y="{y0 - 3}" font-size="11" fill="#888" font-family="Helvetica">{la}°</text>')
        for (x, yy), n, on in labels:
            g.append(f'<text x="{x}" y="{yy}" font-size="{14 if on else 12}" font-weight="{700 if on else 400}" fill="{"#fff" if on else "#555"}" text-anchor="middle" font-family="Helvetica" {"" if on else "stroke=\"#fff\" stroke-width=\"3\" paint-order=\"stroke\""}>{n}</text>')
        win = max(10, (span[1] - span[0]) / 20)
        for c in claims:
            if abs(c["year"] - y) <= win and ext[0] <= c["lonlat"][0] <= ext[1] and ext[2] <= c["lonlat"][1] <= ext[3]:
                want = set(c["realm"]) if isinstance(c.get("realm"), list) else {c.get("realm")}
                hits = B.at(c["lonlat"], int(c["year"]))
                ok = bool(set().union(*[s.names() for s in hits]) & want) if hits else (c.get("realm") is None)
                x, yy = P(c["lonlat"])
                g.append(f'<rect x="{x - 6}" y="{yy - 6}" width="12" height="12" fill="{"#1a9850" if ok else "#d73027"}" stroke="#fff" stroke-width="2"/><text x="{x + 9}" y="{yy - 7}" font-size="13" font-family="Helvetica" stroke="#fff" stroke-width="3" paint-order="stroke">{c["place"]} {c["year"]}</text>')
        lab = f"{abs(y)} BCE" if y < 0 else f"{y}"
        g.append(f'<rect width="{W}" height="54" fill="#fff" fill-opacity="0.9"/><text x="16" y="36" font-size="26" font-weight="700" font-family="Helvetica">{title} · {lab}</text>')
        fn = os.path.join(out, f"{target.replace(' ', '_').replace('/', '-')}_{y}.svg")
        open(fn, "w").write(f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">' + "".join(g) + "</svg>")
        if ql:
            subprocess.run([ql, "-t", "-s", "1300", "-o", out, fn], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print("frames:", ", ".join(str(y) for y in years), "->", out)


if __name__ == "__main__":
    main()
