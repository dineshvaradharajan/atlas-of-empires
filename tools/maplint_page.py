#!/usr/bin/env python3
"""A review page for tools/maplint.py: summary, trend, and small maps of the worst cases (inline SVG).

Reads content/factcheck/map-lint.json; draws each case from the same data the app draws (tools/borders/borders.py,
the yearly base map as land, the war layers via tools/cinema/geo.py).
Run: python3 -I tools/maplint_page.py <out.html>
"""
import collections, hashlib, html, importlib.util, json, math, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def _load(name, path):
    sp = importlib.util.spec_from_file_location(name, path)
    m = importlib.util.module_from_spec(sp)
    sp.loader.exec_module(m)
    return m


ml = _load("maplint", os.path.join(ROOT, "tools", "maplint.py"))
geo = ml.geo
B = ml.borders.Borders()
REP = json.load(open(os.path.join(ROOT, "content", "factcheck", "map-lint.json")))
PAL = ["#c9a46b", "#8fb3a3", "#c98f86", "#9aa7c9", "#b9b07a", "#a98fb8", "#7fae86", "#d1a68f", "#86a9b8", "#b8957a"]
esc = html.escape


def colour(k):
    return PAL[int(hashlib.md5(k.encode()).hexdigest(), 16) % len(PAL)]


def clip(ring, b):
    """Sutherland–Hodgman clip of a ring to box b."""
    def cut(pts, inside, inter):
        out = []
        for i in range(len(pts)):
            p, q = pts[i - 1], pts[i]
            if inside(q):
                if not inside(p): out.append(inter(p, q))
                out.append(q)
            elif inside(p):
                out.append(inter(p, q))
        return out
    x0, y0, x1, y1 = b
    pts = [p[:2] for p in ring]
    for inside, inter in (
        (lambda p: p[0] >= x0, lambda p, q: [x0, p[1] + (q[1] - p[1]) * (x0 - p[0]) / ((q[0] - p[0]) or 1e-12)]),
        (lambda p: p[0] <= x1, lambda p, q: [x1, p[1] + (q[1] - p[1]) * (x1 - p[0]) / ((q[0] - p[0]) or 1e-12)]),
        (lambda p: p[1] >= y0, lambda p, q: [p[0] + (q[0] - p[0]) * (y0 - p[1]) / ((q[1] - p[1]) or 1e-12), y0]),
        (lambda p: p[1] <= y1, lambda p, q: [p[0] + (q[0] - p[0]) * (y1 - p[1]) / ((q[1] - p[1]) or 1e-12), y1])):
        if not pts: break
        pts = cut(pts, inside, inter)
    return pts


class Frame:
    def __init__(self, at, half=2.2, w=300, h=210):
        lon, lat = at
        self.k = math.cos(math.radians(lat))
        hw = half / self.k * (w / h) ** 0.5
        hh = half / (w / h) ** 0.5
        self.b = (lon - hw, lat - hh, lon + hw, lat + hh)
        self.w, self.h = w, h

    def xy(self, p):
        return ((p[0] - self.b[0]) / (self.b[2] - self.b[0]) * self.w, (self.b[3] - p[1]) / (self.b[3] - self.b[1]) * self.h)

    def path(self, rings):
        d = []
        for r in rings:
            c = clip(r, self.b)
            if len(c) < 3: continue
            pts, last = [], None
            for p in c:
                x, y = self.xy(p)
                q = (round(x, 1), round(y, 1))
                if q != last: pts.append(q); last = q
            if len(pts) >= 3:
                d.append("M" + "L".join(f"{x},{y}" for x, y in pts) + "Z")
        return "".join(d)

    def inbox(self, bb):
        return not (bb[2] < self.b[0] or bb[0] > self.b[2] or bb[3] < self.b[1] or bb[1] > self.b[3])


def land_paths(F, year):
    by = min(ml.BASE_YEARS, key=lambda v: abs(v - year))
    out = []
    for f in json.load(open(os.path.join(ml.DATA, f"{by}.json")))["features"]:
        g = f.get("geometry") or {}
        polys = g.get("coordinates") or []
        for poly in (polys if g.get("type") == "MultiPolygon" else [polys]):
            if poly:
                xs = [p[0] for p in poly[0]]; ys = [p[1] for p in poly[0]]
                if F.inbox((min(xs), min(ys), max(xs), max(ys))):
                    out.append(F.path(poly))
    return "".join(out)


def svg(F, year, fills, mark, label):
    """fills: [(css colour, path d, title)] drawn over the land; mark: the problem's position."""
    mx, my = F.xy(mark)
    body = [f'<rect class="sea" width="{F.w}" height="{F.h}"/>', f'<path class="land" fill-rule="evenodd" d="{land_paths(F, year)}"/>']
    for col, d, t in fills:
        if d:
            body.append(f'<path fill="{col}" fill-rule="evenodd" stroke="#fff" stroke-width=".6" d="{d}"><title>{esc(t)}</title></path>')
    body.append(f'<circle class="mark" cx="{mx:.1f}" cy="{my:.1f}" r="16"/>')
    return f'<svg viewBox="0 0 {F.w} {F.h}" role="img" aria-label="{esc(label)}">{"".join(body)}</svg>'


def realm_map(at, year):
    F = Frame(at)
    fills = []
    for st in B.states(year):
        rings_all = []
        for poly, bb in zip(st.polys, st.bboxes):
            if F.inbox(bb):
                rings_all += poly
        if rings_all:
            fills.append((colour(st.k), F.path(rings_all), st.n))
    return F, fills


SIDE = ["#5b74c9", "#c9675b", "#5ba374", "#b49a4a"]


def war_map(g):
    Wr = geo.War(g["war"])
    ch = Wr.cine["chapters"][g["chapter"] - 1]
    t = (geo.frac(ch["start"]) + geo.frac(ch["end"])) / 2 if g.get("when") == "middle" else geo.frac(ch["end"]) - 1e-4
    F = Frame(g["at"], half=2.6)
    year = Wr.base_year(t)
    sm = Wr.sides(t)
    fills = []
    for st in B.states(year):
        rings_all = [r for poly, bb in zip(st.polys, st.bboxes) if F.inbox(bb) for r in poly]
        if rings_all:
            s = sm.get(st.n, sm.get(st.k, sm.get(st.orig)))
            fills.append(("var(--grey)" if s is None else SIDE[s % 4], F.path(rings_all), st.n))
    for o in Wr.occs:
        r = o.at(t)
        if r:
            sd = o.side if o.side is not None else 1
            fills.append((SIDE[sd % 4], F.path([r]), f"occupied ({Wr.war['sides'][sd]['name']})"))
    return F, fills, year


def yrs(v):
    return ml.yrs(v)


def main(out):
    sl, fr, bl, ov, wr = REP["slivers"], REP["fragments"], REP["blocky"], REP["overlaps"], REP["wars"]
    kinds = collections.Counter(g["kind"] for g in sl)
    km = collections.Counter()
    for g in sl: km[g["kind"]] += g["km2"]
    per_year = collections.Counter(); per_area = collections.Counter()
    for g in sl:
        for y in g["years"]: per_year[y] += 1; per_area[y] += g["km2"]
    years = sorted(per_year)
    # trend chart: slivers per sampled year
    cw, chh, pad = 640, 170, 34
    xs = lambda y: pad + (y - years[0]) / (years[-1] - years[0]) * (cw - pad - 8)
    top = max(per_year.values())
    ys = lambda v: chh - 22 - v / top * (chh - 40)
    bars = "".join(f'<line x1="{xs(y):.1f}" x2="{xs(y):.1f}" y1="{chh - 22}" y2="{ys(per_year[y]):.1f}" class="bar"><title>{y}: {per_year[y]} slivers, {per_area[y]:,} km²</title></line>' for y in years)
    ticks = "".join(f'<text x="{xs(y):.1f}" y="{chh - 6}" class="tick" text-anchor="middle">{"%d BCE" % -y if y < 0 else y}</text>' for y in (-3000, -1500, 0, 1000, 1500, 1900) if years[0] <= y <= years[-1])
    grid = "".join(f'<line x1="{pad}" x2="{cw - 8}" y1="{ys(v):.1f}" y2="{ys(v):.1f}" class="grid"/><text x="{pad - 6}" y="{ys(v) + 4:.1f}" class="tick" text-anchor="end">{v}</text>' for v in range(0, top + 1, 50))
    chart = f'<svg viewBox="0 0 {cw} {chh}" class="chart" role="img" aria-label="Slivers per sampled year">{grid}{bars}{ticks}</svg>'

    def cards(items, make, n):
        h = []
        for g in items[:n]:
            try:
                h.append(make(g))
            except Exception as e:  # a case that cannot be drawn is still listed
                h.append(f'<figure class="case"><figcaption><b>{esc(str(g.get("realm") or g.get("war") or g.get("realms")))}</b><span>(no picture: {esc(type(e).__name__)})</span></figcaption></figure>')
        return '<div class="cases">' + "".join(h) + "</div>"

    def sliver_card(g):
        y = max(g["years"], key=lambda v: v)
        F, fills = realm_map(g["at"], y)
        cap = f'<b>{esc(g["kind"].capitalize())}, {g["km2"]:,} km²</b><span>next to {esc(", ".join(g["realms"]))}</span><span class="when">{esc(yrs(g["years"]))} · shown {y}</span>'
        return f'<figure class="case">{svg(F, y, fills, g["at"], g["kind"])}<figcaption>{cap}</figcaption></figure>'

    def frag_card(g):
        y = g["years"][len(g["years"]) // 2]
        F, fills = realm_map(g["at"], y)
        cap = f'<b>{esc(g["realm"])}</b><span>{g["km2"]:,} km² piece, {g["gap_km"]} km from the rest</span><span class="when">{esc(yrs(g["years"]))} · shown {y}</span>'
        return f'<figure class="case">{svg(F, y, fills, g["at"], "fragment")}<figcaption>{cap}</figcaption></figure>'

    def blocky_card(g):
        y = g["years"][len(g["years"]) // 2]
        at = g.get("at") or [0, 0]
        F, fills = realm_map(at, y)
        cap = f'<b>{esc(g["realm"])}</b><span>{g["km"]:,} km of stair-stepped border</span><span class="when">{esc(yrs(g["years"]))} · shown {y}</span>'
        return f'<figure class="case">{svg(F, y, fills, at, "stair-stepped border")}<figcaption>{cap}</figcaption></figure>'

    def overlap_card(g):
        y = g["year"]
        F, fills = realm_map(g["at"], y)
        cap = f'<b>{esc(" / ".join(g["realms"]))}</b><span>about {g["km2"]:,} km² drawn twice</span><span class="when">{esc(yrs(g["years"]))} · shown {y}</span>'
        return f'<figure class="case">{svg(F, y, fills, g["at"], "overlap")}<figcaption>{cap}</figcaption></figure>'

    def war_card(g):
        F, fills, y = war_map(g)
        cap = f'<b>{esc(g["war"].replace("-", " ").capitalize())}, stage {g["chapter"]}</b><span>{esc(g["title"])} ({esc(g["date"])})</span><span>grey {esc(g["kind"])}, {g["km2"]:,} km²</span>'
        return f'<figure class="case">{svg(F, y, fills, g["at"], "grey strip")}<figcaption>{cap}</figcaption></figure>'

    def table_raw(rows, head):
        return '<div class="tw"><table><thead><tr>' + "".join(f"<th>{esc(h)}</th>" for h in head) + "</tr></thead><tbody>" + "".join(rows) + "</tbody></table></div>"

    def table(rows, head):
        return '<div class="tw"><table><thead><tr>' + "".join(f"<th>{esc(h)}</th>" for h in head) + "</tr></thead><tbody>" + "".join("<tr>" + "".join(f"<td>{c}</td>" for c in r) + "</tr>" for r in rows) + "</tbody></table></div>"

    by_kind = lambda k: [g for g in sl if g["kind"] == k]
    bd = REP.get("band")
    band_html = ""
    if bd:
        row = lambda label, k: f"<tr><td>{label}</td><td>{bd['before'][k]:,}</td><td>{bd['after'][k]:,}</td><td>{round(100 * (bd['after'][k] - bd['before'][k]) / bd['before'][k]):+d}%</td></tr>"
        band_html = ('<section><h2>What the coast band fixed</h2><p class="lede">Under every realm the map now draws a band of the realm\'s own colour, '
                     f'{bd["km"]} km beyond its edge and clipped to land, before any realm is filled. It shows only where no realm covers the land. '
                     'The lists and maps below are what is left after it.</p>'
                     + table_raw([row("Slivers of unclaimed land", "slivers"), row("Coastal strips", "coastal"), row("Gaps between realms", "gaps"),
                                  row("Sliver area, km²", "km2"), row("Grey strips in war stages", "wars"), row("of them between an area and the sea", "wars_coast")],
                                 ["", "Before", "After", "Change"]) + "</section>")
    war_by = collections.Counter(g["war"] for g in wr)
    page = f"""<title>Atlas Map Lint</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Space+Grotesk:wght@500;700&display=swap">
<style>
/* layout: one reading column; findings first, then the evidence as small maps */
:root {{ --bg:#f6f7f5; --fg:#1d2320; --muted:#5d6762; --rule:#d9ddd9; --card:#ffffff; --sea:#dbe6ec; --land:#e9e7df; --grey:#cfd2cc;
  --accent:#2f6f5e; --mark:#d2372b; --display:"Space Grotesk",system-ui,sans-serif; --body:"Inter",system-ui,sans-serif; }}
@media (prefers-color-scheme: dark) {{ :root:not([data-theme="light"]) {{ --bg:#141816; --fg:#e8ece9; --muted:#9aa49f; --rule:#2c3330; --card:#1c211f; --sea:#1f2c33; --land:#3a3a34; --grey:#55594f; --accent:#7cc4ad; --mark:#ff6a5c; color-scheme:dark }} }}
:root[data-theme="dark"] {{ --bg:#141816; --fg:#e8ece9; --muted:#9aa49f; --rule:#2c3330; --card:#1c211f; --sea:#1f2c33; --land:#3a3a34; --grey:#55594f; --accent:#7cc4ad; --mark:#ff6a5c; color-scheme:dark }}
body {{ background:var(--bg); color:var(--fg); font:15px/1.6 var(--body); padding-left:max(16px,env(safe-area-inset-left,0px)); padding-right:max(16px,env(safe-area-inset-right,0px)); padding-block:28px 60px; }}
main {{ max-width:1040px; margin:0 auto; display:grid; gap:34px; }}
h1,h2 {{ font-family:var(--display); line-height:1.15; text-wrap:balance; margin:0; }}
h1 {{ font-size:34px; }} h2 {{ font-size:23px; }}
p {{ margin:0; max-width:68ch; }} .lede {{ color:var(--muted); font-size:16px; }}
section {{ display:grid; gap:14px; }}
.nums {{ display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:10px; }}
.num {{ border-top:3px solid var(--accent); padding-top:8px; display:grid; gap:2px; }}
.num b {{ font:700 28px/1 var(--display); font-variant-numeric:tabular-nums; }} .num span {{ color:var(--muted); font-size:13px; }}
.key {{ background:var(--card); border:1px solid var(--rule); border-radius:10px; padding:16px 18px; display:grid; gap:8px; }}
.key b {{ font-family:var(--display); }}
.chart {{ width:100%; height:auto; }} .bar {{ stroke:var(--accent); stroke-width:4; }} .grid {{ stroke:var(--rule); }} .tick {{ fill:var(--muted); font:11px var(--body); }}
.cases {{ display:grid; grid-template-columns:repeat(auto-fill,minmax(230px,1fr)); gap:14px; }}
.case {{ margin:0; background:var(--card); border:1px solid var(--rule); border-radius:10px; overflow:hidden; display:grid; }}
.case svg {{ width:100%; height:auto; display:block; }}
.case figcaption {{ padding:10px 12px 12px; display:grid; gap:2px; font-size:13px; min-width:0; }}
.case figcaption b {{ font-size:14px; }} .case figcaption span {{ color:var(--muted); overflow-wrap:anywhere; }} .when {{ font-size:12px; }}
.sea {{ fill:var(--sea); }} .land {{ fill:var(--land); }} .mark {{ fill:none; stroke:var(--mark); stroke-width:2.5; }}
ol.fix {{ margin:0; padding-left:22px; display:grid; gap:10px; max-width:72ch; }}
details {{ border-top:1px solid var(--rule); padding-top:10px; }} summary {{ cursor:pointer; font-weight:600; }}
.tw {{ overflow-x:auto; margin-top:10px; }} table {{ border-collapse:collapse; font-size:13px; width:100%; }}
th,td {{ text-align:left; padding:5px 8px; border-bottom:1px solid var(--rule); vertical-align:top; }} td {{ font-variant-numeric:tabular-nums; }}
code {{ font-size:13px; }}
</style>
<main>
<header style="display:grid;gap:10px">
<h1>Atlas Map Lint</h1>
<p class="lede">What the map draws, measured on a 0.1° grid (about 11 km) in {len(years)} sampled years from {abs(years[0])} BCE to {years[-1]} and at every stage of {len(war_by) and len({g['war'] for g in wr})} war stories with problems. Generated {esc(REP['generated'])} by <code>tools/maplint.py</code>.</p>
</header>

<div class="nums">
<div class="num"><b>{len(sl):,}</b><span>slivers of unclaimed land</span></div>
<div class="num"><b>{kinds['coastal strip']:,}</b><span>of them coastal strips</span></div>
<div class="num"><b>{len(wr):,}</b><span>grey strips in war stages</span></div>
<div class="num"><b>{len(fr):,}</b><span>pieces cut off by a gap</span></div>
<div class="num"><b>{len(bl):,}</b><span>realms with stair-stepped borders</span></div>
</div>

<div class="key">
<b>The main finding</b>
<p>Before the fix, nine in ten slivers were strips of land between a realm's edge and the coast (2.9 million km², against 0.7 million km² in gaps between realms). They are not mainly errors in the realms. Even the borders from 1992 onwards, which come from Natural Earth's detailed coastline, leave 341 such strips against the land layer the app draws, because that land layer comes from a different source with a coastline of its own. Patching realms one by one would never end; the fix belongs in the drawing.</p>
</div>

{band_html}

<section>
<h2>How many slivers each sampled year</h2>
<p class="lede">The count rises as more, smaller realms are recorded: from {per_year.get(-1000, 0)} in 1000 BCE to {per_year.get(1900, 0)} in 1900.</p>
{chart}
</section>

<section>
<h2>Recommended fixes</h2>
<ol class="fix">
<li><b>Done: fill thin unclaimed land with the neighbouring realm's colour.</b> Under every realm, draw a wide stroke of its own colour clipped to land, then the realms on top. The stroke shows only where nothing else is drawn: the coastal strips and the thin gaps. It is one change in the renderer, works at every zoom and in war stages too, and leaves real stateless land almost untouched (a band of about 15 km).</li>
<li><b>Use one coastline.</b> Draw land from the same detailed coastline as the realms and the war areas (Natural Earth), or clip the realms to it, so the two layers cannot disagree. The zoom-detail session is measuring this together with sharper borders when zoomed in.</li>
<li><b>Snap war areas to the coast and to the borders below them</b> ({len(wr)} grey strips, {sum(1 for g in wr if g['kind'] == 'between an area and the coast')} of them between an occupied area and the sea).</li>
<li><b>Fix the gaps between realms and the cut-off pieces case by case</b> with sourced border patches, worst first, from the lists below.</li>
<li><b>Run the lint on every data build</b> and fail the build when a new sliver or fragment above a size appears.</li>
</ol>
</section>

<section>
<h2>Worst coastal strips</h2>
{cards(by_kind('coastal strip'), sliver_card, 9)}
</section>
<section>
<h2>Worst gaps between realms</h2>
{cards(by_kind('gap between realms'), sliver_card, 9)}
</section>
<section>
<h2>Grey strips in war stages</h2>
<p class="lede">Most strips: {esc(', '.join(f"{w.replace('-', ' ')} ({n})" for w, n in war_by.most_common(6)))}.</p>
{cards(wr, war_card, 9)}
</section>
<section>
<h2>Pieces cut off by a narrow gap</h2>
{cards(fr, frag_card, 6)}
</section>
<section>
<h2>Stair-stepped borders</h2>
{cards(bl, blocky_card, 6)}
</section>

<section>
<h2>Realms drawn over each other</h2>
<p class="lede">Land drawn for two realms of different colour groups at once. Many are vassals drawn over their overlord (which may be right); others, like the Mughal Empire over Rohilkhand and Garhwal in 1759, are one shape that should give way to the other.</p>
{cards([g for g in ov if g.get('at')], overlap_card, 9)}
</section>

<section>
<h2>Full lists</h2>
<details><summary>All {len(sl):,} slivers</summary>{table([[esc(g['kind']), f"{g['km2']:,}", esc(', '.join(g['realms'])), f"{g['at'][0]}, {g['at'][1]}", esc(yrs(g['years']))] for g in sl[:600]], ['Kind', 'km²', 'Next to', 'Lon, lat', 'Years'])}</details>
<details><summary>All {len(wr)} war grey strips</summary>{table([[esc(g['war']), str(g['chapter']), esc(g['date']), esc(g['kind']), f"{g['km2']:,}", f"{g['at'][0]}, {g['at'][1]}"] for g in wr], ['War', 'Stage', 'Date', 'Kind', 'km²', 'Lon, lat'])}</details>
<details><summary>All {len(fr)} cut-off pieces</summary>{table([[esc(g['realm']), f"{g['km2']:,}", str(g['gap_km']), f"{g['at'][0]}, {g['at'][1]}", esc(yrs(g['years']))] for g in fr], ['Realm', 'km²', 'Gap km', 'Lon, lat', 'Years'])}</details>
<details><summary>All {len(bl)} stair-stepped realms</summary>{table([[esc(g['realm']), f"{g['km']:,}", f"{round(100 * g['share'])}%", esc(yrs(g['years']))] for g in bl], ['Realm', 'Stair km', 'Share', 'Years'])}</details>
<details><summary>{len(ov)} overlapping pairs (many are vassals drawn over their overlords)</summary>{table([[esc(' / '.join(g['realms'])), f"{g['km2']:,}", esc(yrs(g['years']))] for g in ov[:300]], ['Realms', 'About km²', 'Years'])}</details>
</section>
</main>
"""
    open(out, "w").write(page)
    print(out, round(len(page) / 1024), "KB")


if __name__ == "__main__":
    main(sys.argv[1])
