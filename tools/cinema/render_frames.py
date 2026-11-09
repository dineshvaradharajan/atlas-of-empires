#!/usr/bin/env python3
"""Render storyboard chapters as review frames (SVG, plus PNG via macOS qlmanage when available).

For each chapter: its start, middle and end, drawn the way the app interpolates (tools/cinema/geo.py), at a fixed
scale over the chapter's map area, with a lon/lat grid and town labels so frames can be compared with campaign maps.
Fronts at the chapter start are dashed; occupied areas show their outline at the chapter start (dotted).
Claims from the cinema file are drawn as squares (green = map agrees, red = map disagrees).

Run: python3 -I tools/cinema/render_frames.py <war-id> <out-dir> [chapter-id ...]
"""
import importlib.util, math, os, shutil, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location("geo", os.path.join(HERE, "geo.py"))
geo = importlib.util.module_from_spec(spec)
spec.loader.exec_module(geo)

SIDE = ["#2B59D9", "#E5402A", "#2F7D6D", "#E9A93B"]


def tint(c, w=0.45):
    a = [int(c[i:i + 2], 16) for i in (1, 3, 5)]
    return "#" + "".join("%02x" % round(a[j] * w + 255 * (1 - w)) for j in range(3))


def proj(ext, W, H):
    lo0, lo1, la0, la1 = ext
    c = math.cos(math.radians((la0 + la1) / 2))
    s = min(W / ((lo1 - lo0) * c), H / (la1 - la0))
    ox, oy = (W - (lo1 - lo0) * c * s) / 2, (H - (la1 - la0) * s) / 2
    return lambda p: (round(ox + (p[0] - lo0) * c * s, 1), round(oy + (la1 - p[1]) * s, 1))


def path(pts, P, close=False):
    return "M" + "L".join("%s,%s" % P(p) for p in pts) + ("Z" if close else "")


def catmull(pts):
    if len(pts) < 3:
        return pts
    out = []
    for i in range(len(pts) - 1):
        p0 = pts[i - 1] if i else pts[i]
        p1, p2 = pts[i], pts[i + 1]
        p3 = pts[i + 2] if i + 2 < len(pts) else p2
        for s in range(8):
            u = s / 8
            out.append([0.5 * (2 * p1[c] + (-p0[c] + p2[c]) * u + (2 * p0[c] - 5 * p1[c] + 4 * p2[c] - p3[c]) * u * u + (-p0[c] + 3 * p1[c] - 3 * p2[c] + p3[c]) * u ** 3) for c in (0, 1)])
    out.append(pts[-1])
    return out


def arrow(a, P, upto, col):
    pts = [P(p) for p in catmull(a["path"])]
    L = [0]
    for i in range(1, len(pts)):
        L.append(L[-1] + math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]))
    want = L[-1] * upto
    cut = [pts[0]]
    for i in range(1, len(pts)):
        if L[i] <= want:
            cut.append(pts[i])
        else:
            u = (want - L[i - 1]) / ((L[i] - L[i - 1]) or 1)
            cut.append((pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * u, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * u))
            break
    if len(cut) < 2:
        return ""
    tip, bk = cut[-1], cut[max(0, len(cut) - 4)]
    ang = math.atan2(tip[1] - bk[1], tip[0] - bk[0])
    head = [(tip[0] + math.cos(ang) * 8, tip[1] + math.sin(ang) * 8), (tip[0] + math.cos(ang + 2.5) * 14, tip[1] + math.sin(ang + 2.5) * 14), (tip[0] + math.cos(ang - 2.5) * 14, tip[1] + math.sin(ang - 2.5) * 14)]
    d = "M" + "L".join("%.1f,%.1f" % q for q in cut)
    return (f'<path d="{d}" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round"/><path d="{d}" fill="none" stroke="{col}" stroke-width="5" stroke-linecap="round"/>'
            f'<path d="M{"L".join("%.1f,%.1f" % q for q in head)}Z" fill="{col}" stroke="#fff"/>')


def frame(W_, ch, t, label, claims):
    b = ch["bbox"]
    ext = [b[0] - 0.6, b[2] + 0.6, b[1] - 0.4, b[3] + 0.4]
    W, H = 1400, 1000
    P = proj(ext, W, H)
    sm = W_.sides(t)
    g = [f'<rect width="{W}" height="{H}" fill="#ffffff"/>']
    labels = []
    for p, polys in W_.states(W_.base_year(t)):
        d = "".join(path(poly[0], P, True) for poly in polys if any(ext[0] - 4 <= q[0] <= ext[1] + 4 and ext[2] - 4 <= q[1] <= ext[3] + 4 for q in poly[0]))
        if not d:
            continue
        s = sm.get(p["n"], sm.get(p.get("k")))
        g.append(f'<path d="{d}" fill="{tint(SIDE[s]) if s is not None else "#ecece8"}" stroke="#fff" stroke-width="0.8" fill-rule="evenodd"/>')
        if p.get("l") and ext[0] <= p["l"][0] <= ext[1] and ext[2] <= p["l"][1] <= ext[3]:
            labels.append((P(p["l"]), p["n"]))
    t0 = ch["t0"]
    for sd in range(len(W_.war["sides"])):  # occupied ground is only drawn on states not on the occupier's side
        d = "".join(path(poly[0], P, True) for p, polys in W_.states(W_.base_year(t)) if sm.get(p["n"], sm.get(p.get("k"))) != sd for poly in polys if any(ext[0] - 4 <= q[0] <= ext[1] + 4 and ext[2] - 4 <= q[1] <= ext[3] + 4 for q in poly[0]))
        g.append(f'<clipPath id="notown{sd}"><path d="{d}"/></clipPath>')
    for o in W_.occs:
        r = o.at(t)
        if r:
            sd = o.side if o.side is not None else 1
            col = SIDE[sd % 4]
            g.append(f'<g clip-path="url(#notown{sd})"><path d="{path(r, P, True)}" fill="{col}" fill-opacity="0.5" stroke="{col}" stroke-width="1.6"/></g>')
        r0 = o.at(t0)
        if r0 and t > t0 + 0.005:
            g.append(f'<path d="{path(r0, P, True)}" fill="none" stroke="{SIDE[(o.side if o.side is not None else 1) % 4]}" stroke-width="1.2" stroke-dasharray="2 3"/>')
    for f in W_.fronts:
        l0 = f.at(t0)
        if l0 and t > t0 + 0.005:
            g.append(f'<path d="{path(l0, P)}" fill="none" stroke="#111" stroke-width="2" stroke-dasharray="7 5" stroke-opacity="0.5"/>')
        ln = f.at(t)
        if ln:
            g.append(f'<path d="{path(ln, P)}" fill="none" stroke="#fff" stroke-width="5"/><path d="{path(ln, P)}" fill="none" stroke="#111" stroke-width="2.6"/>')
    for a in W_.cine.get("arrows", []):
        if a["name"] not in ch.get("arrows", []):
            continue
        a0, a1 = geo.frac(a["start"]), geo.frac(a["end"])
        if t >= a0:
            g.append(arrow(a, P, min(1, (t - a0) / ((a1 - a0) or 1e-6)), SIDE[a.get("side", 0) % 4]))
    for bt in W_.cine.get("battles", []):
        if bt.get("lonlat") and geo.in_box(bt["lonlat"], b) and geo.frac(bt["start"]) <= t + 0.003 and geo.frac(bt.get("end", bt["start"])) >= t0 - 0.01:
            x, y = P(bt["lonlat"])
            g.append(f'<circle cx="{x}" cy="{y}" r="6" fill="#111" stroke="#fff" stroke-width="2"/><text x="{x + 10}" y="{y + 5}" font-size="15" font-weight="700" font-family="Helvetica" stroke="#fff" stroke-width="4" paint-order="stroke">{bt["name"]}</text>')
    for cl in claims:
        if geo.frac(cl["date"]) <= t + 1e-6:
            got, _ = W_.controller(cl["lonlat"], geo.frac(cl["date"]))
            ok = got == cl["holder"] if cl.get("holder") != "front" else W_.front_dist(cl["lonlat"], geo.frac(cl["date"]))[0] <= 40
            x, y = P(cl["lonlat"])
            g.append(f'<rect x="{x - 6}" y="{y - 6}" width="12" height="12" fill="{"#1a9850" if ok else "#d73027"}" stroke="#fff" stroke-width="2"/><text x="{x + 10}" y="{y - 8}" font-size="14" font-family="Helvetica" stroke="#fff" stroke-width="4" paint-order="stroke">{cl["place"]} ({cl["date"]})</text>')
    for lo in range(math.ceil(ext[0]), math.floor(ext[1]) + 1):
        x0, _ = P([lo, ext[2]])
        g.append(f'<line x1="{x0}" y1="0" x2="{x0}" y2="{H}" stroke="#000" stroke-opacity="0.08"/><text x="{x0 + 3}" y="{H - 6}" font-size="11" fill="#888" font-family="Helvetica">{lo}°E</text>')
    for la in range(math.ceil(ext[2]), math.floor(ext[3]) + 1):
        _, y0 = P([ext[0], la])
        g.append(f'<line x1="0" y1="{y0}" x2="{W}" y2="{y0}" stroke="#000" stroke-opacity="0.08"/><text x="4" y="{y0 - 3}" font-size="11" fill="#888" font-family="Helvetica">{la}°N</text>')
    for (x, y), n in labels:
        g.append(f'<text x="{x}" y="{y}" font-size="14" fill="#444" text-anchor="middle" font-family="Helvetica">{n}</text>')
    g.append(f'<rect x="0" y="0" width="{W}" height="54" fill="#fff" fill-opacity="0.9"/><text x="16" y="36" font-size="26" font-weight="700" font-family="Helvetica">{ch["title"]} · {label}</text>')
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">' + "".join(g) + "</svg>"


def main():
    war_id, out = sys.argv[1], sys.argv[2]
    only = set(sys.argv[3:])
    os.makedirs(out, exist_ok=True)
    W_ = geo.War(war_id)
    ql = shutil.which("qlmanage")
    for i, ch in enumerate(W_.cine.get("chapters", [])):
        if only and ch["id"] not in only:
            continue
        ch["t0"], ch["t1"] = geo.frac(ch["start"]), geo.frac(ch["end"])
        claims = [c for c in W_.cine.get("claims", []) if c.get("chapter") == ch["id"]]
        for tag, t in (("start", ch["t0"]), ("middle", (ch["t0"] + ch["t1"]) / 2), ("end", ch["t1"])):
            y = math.floor(t)
            d = (t - y) * 365.25
            m = min(11, int(d // 30.4375))
            label = f"{tag} · {int(d - m * 30.4375) + 1} {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][m]} {y}"
            fn = os.path.join(out, f"{i + 1:02d}-{ch['id']}-{tag}.svg")
            open(fn, "w").write(frame(W_, ch, t, label, claims))
            if ql:
                subprocess.run([ql, "-t", "-s", "1400", "-o", out, fn], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print("frames in", out)


if __name__ == "__main__":
    main()
