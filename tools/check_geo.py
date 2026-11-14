#!/usr/bin/env python3
"""Cross-check the atlas's borders against the historical-basemaps world snapshots (read-only; writes a report, changes
no data).

historical-basemaps (A. Ourednik, GPL-3.0) is a set of hand-drawn world maps, one per snapshot year from 123,000 BCE to
2010. It is the atlas's original map source and still feeds the peoples layer (tools/build.py), but the states are now
drawn from Cliopatria and the reconstruction layers, so the two can disagree. It is the only reference here that covers
the whole world before 1816 (CShapes starts in 1886, Correlates of War in 1816, AWMC and CHGIS cover one region each).
It is also the least careful of them: most snapshots before 1700 carry BORDERPRECISION 1 ("approximate"), so every
mismatch below is a lead to check against a published source, not a finding.

  atlas      public/data/clio/*.json with content/corrections.json and public/data/supplements.json applied, read by
             load_atlas() in tools/check_cshapes.py (imported, not copied). A realm counts in year Y if f <= Y <= t.
  snapshots  data/geo/world_<year>.geojson, every snapshot from 3000 BCE on (the atlas starts in 3400 BCE). A feature
             belongs to its SUBJECTO (the overlord) when it has one, else to its NAME.

Both are rasterised onto one grid (default 0.5 degrees, cell centres, even-odd rule; helpers from check_cshapes.py) and
clipped to the snapshot's land (the union of all its features). There is no hand-written link table: in each year an
atlas realm is linked to the snapshot polity it shares most land with, and the reverse; a cell agrees when its atlas
realm and its snapshot polity are linked either way. Snapshot entries that are peoples or ways of life rather than
states ("Bantu", "hunter-gatherers", "Maya city-states" ...) are filed apart by the PEOPLES pattern below. Reported:

  1. per snapshot: land, the share of the snapshot's state land the atlas covers, and the share where the two agree
  2. missing: land a snapshot gives to a state and the atlas leaves blank, merged into blocks (8-neighbour) and then
     across consecutive snapshots, ranked by area
  3. different owner: land both draw but give to different, unlinked polities, merged the same way
  4. shape: linked pairs over a size threshold whose overlap (intersection over union) is low
  5. absent: snapshot states over a size threshold that no atlas realm overlaps at all

A snapshot entry counts as a state when its name has a state word (STATEWORDS) or it is linked to an atlas realm in
some snapshot; the rest (Chukchi, Sami, Maori ...) are listed by name only, as the atlas leaves peoples blank on purpose.
Land south of 60 S (Antarctica, claimed in some snapshots) is left out.

Output: content/factcheck/geo-check.md
Run:    python3 -I tools/check_geo.py [--res 0.5] [--min-area 40000]

Source: A. Ourednik, historical-basemaps, https://github.com/aourednik/historical-basemaps , GPL-3.0. The files stay in
data/geo/ (gitignored); the report carries only derived figures and names, with this credit.
"""
import argparse, collections, datetime, glob, json, os, re, sys, time

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "tools"))
import check_cshapes as cs  # noqa: E402  (load_atlas, Grid, polys_of, km)

GEO = os.path.join(ROOT, "data", "geo")
OUT = os.path.join(ROOT, "content", "factcheck", "geo-check.md")
CREDIT = "A. Ourednik, historical-basemaps (GPL-3.0), https://github.com/aourednik/historical-basemaps"
FIRST = -3000
# snapshot entries that name a people, a culture or a way of life rather than a state
PEOPLES = re.compile(r"hunter|gatherer|farmer|cultur|tribe|peoples|nomad|pastoral|fisher|fichers|forag|herder|chiefdom|"
                     r"city-states|aborigin|neolithic|shellfish|mammal|bison|^semites$|^bantu$|^khoisan$|^papuans$|"
                     r"^austronesians$|^polynesians$|^ainus?$|^thule$|^inuit$|paleo-|^saami$|^siberians$|^tungus$|^berbers?$|"
                     r"^slavs$|^celts$|^germans$|^dravidians$|^malay$|^malagasy$|^maori$|^tupis$|^athabaskan$|^beothuk$", re.I)
REGIONS = [
    ("South Asia", lambda x, y: 60 <= x <= 98 and 5 <= y <= 37),
    ("East Asia", lambda x, y: 98 < x <= 146 and 18 <= y <= 55),
    ("Southeast Asia", lambda x, y: 92 <= x <= 141 and -11 <= y < 23),
    ("Central Asia and steppe", lambda x, y: 46 <= x <= 120 and 37 < y <= 60),
    ("Middle East", lambda x, y: 25 <= x < 63 and 12 <= y <= 42),
    ("Europe", lambda x, y: -25 <= x < 46 and 35 <= y <= 72),
    ("North Africa", lambda x, y: -18 <= x < 35 and 15 <= y < 38),
    ("Sub-Saharan Africa", lambda x, y: -18 <= x <= 52 and -35 <= y < 15),
    ("Americas", lambda x, y: -170 <= x <= -30),
    ("Oceania", lambda x, y: x > 110 and y < -11 or x > 141),
    ("Northern Eurasia", lambda x, y: y > 50),
]


STATEWORDS = re.compile(r"empire|kingdom|sultanate|caliphate|khanate|khaganate|dynasty|\bstates?\b|republic|emirate|"
                        r"principality|shogunate|duchy|tsardom|union|confederation|league|imamate|realm|regency|protectorate|"
                        r"colony|viceroyalty|federation|commonwealth|county|margraviate|electorate|order|knights", re.I)


# Leads checked by hand against the atlas (probing what it draws at a point) on 2026-11-14. Each is a candidate fix,
# still to be sourced before any border changes.
HANDCHECK = [
    ("Mexico", "1913–1919", "Nothing is drawn anywhere in Mexico (Mexico City, Chihuahua, Guadalajara all blank): the Cliopatria "
     "row skips the revolution years. CShapes flags the same gap. Mexico should be drawn throughout."),
    ("Mongolia", "1920–1921", "Blank between the Great Mongol State (to 1919) and its return (1922). China occupied Urga from "
     "late 1919; Ungern restored the Bogd Khan in February 1921 and the people's government took over in July 1921."),
    ("Canada, North-West Territories", "1870 – c. 1906", "The interior (Rupert's Land, bought by Canada in 1870) is blank until "
     "about 1906, when the British shape takes it in. Rupert's Land before 1870 (the Hudson's Bay Company) is also blank."),
    ("Iraq, Palestine, Transjordan", "1922–1947", "The British mandates are labelled \"British Africa\" (Baghdad to 1931, "
     "Jerusalem and Amman to the 1940s). Iraq in 1921 already shows the correct \"British Colonial Empire\"."),
    ("South-east Libya (Kufra)", "1912–1929", "Drawn as British Africa; Italy claimed all of Libya from 1912 and the Senussi "
     "held Kufra until Italy took it in January 1931. Britain and Egypt never held land west of 25° E here."),
    ("Horqin, Inner Mongolia", "1403 – c. 1510", "Drawn as Ming as far as 43.7° N, 121.3° E; the Ming gave up the Daning "
     "command in 1403 and the land went to the Uriankhai Mongols. Mongol from 1520 in the atlas."),
    ("Madagascar", "before 1792", "Blank until the Merina Kingdom appears in 1792; the Sakalava, Betsimisaraka and early "
     "Merina kingdoms (16th–18th centuries) are not drawn."),
    ("Andes: Wari and Tiwanaku", "c. 600–1000", "Neither is drawn at all (no atlas realm overlaps either snapshot shape)."),
]
REJECTED = ("Checked and left alone (the snapshot is wrong or it is a judgement call): the Amur as Qing in 1815 (Russian "
            "only from 1858), Safavid Azerbaijan in 1650–1700, Durrani Multan in 1815, Russia in Transbaikal in 1700, Ordos as "
            "Mongol in 1600, Qing Qinghai from 1700 (the Khoshut submitted in 1697), and the Anglo-Soviet occupation of Iran "
            "in 1945. Kanem and Bornu are drawn far too small before 1481, which content/corrections.json already notes.")


def region(lon, lat): return next((n for n, f in REGIONS if f(lon, lat)), "Other")
def year_of(fn):
    y = os.path.basename(fn)[6:-8]
    return -int(y[2:]) if y.startswith("bc") else int(y)
def ylab(y): return f"{-y} BCE" if y < 0 else str(y)
def is_people(name): return bool(PEOPLES.search(name or ""))


def load_snapshot(path, G, land_only=None):
    """cell -> (name, polity, precision) for one snapshot; polity = SUBJECTO or NAME (None for unnamed land)"""
    out = {}
    for f in json.load(open(path))["features"]:
        p = f["properties"]
        name = (p.get("NAME") or "").strip() or None
        if name and name.isdigit(): name = None  # a few features carry a number for a name
        sov = (p.get("SUBJECTO") or "").strip() or name
        if sov and sov.isdigit(): sov = name
        val = (name, sov, p.get("BORDERPRECISION") or 1)
        for c in G.cells(cs.polys_of(f["geometry"]) if f.get("geometry") else []):
            if c not in out or out[c][1] is None: out[c] = val
    return out


def atlas_at(pieces, year, G, cache, land):
    """cell -> realm drawn in that year (the smaller piece wins where two overlap, so a vassal shows over its overlord)"""
    best = {}
    for pc in pieces:
        if not pc["a"] <= year <= pc["b"]: continue
        key = (id(pc["geom"]), pc["crop"], pc["cuts"])
        if key not in cache: cache[key] = G.cells(pc["geom"]["polys"], pc["crop"], pc["cuts"])
        cells = cache[key]
        n = len(cells)
        for c in cells:
            if c not in land: continue
            if c not in best or best[c][1] > n: best[c] = (pc["name"], n)
    return {c: v[0] for c, v in best.items()}


def blocks(cells, G):
    """split a set of cells into 8-connected blocks"""
    left, out = set(cells), []
    while left:
        seed = left.pop(); comp = [seed]; stack = [seed]
        while stack:
            c = stack.pop(); r, k = divmod(c, G.NC)
            for dr in (-1, 0, 1):
                for dk in (-1, 0, 1):
                    n = (r + dr) * G.NC + (k + dk) % G.NC
                    if n in left: left.remove(n); comp.append(n); stack.append(n)
        out.append(comp)
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--res", type=float, default=0.5)
    ap.add_argument("--min-area", type=float, default=40000, help="smallest block reported, km²")
    ap.add_argument("--shape-area", type=float, default=300000, help="smallest polity in the shape table, km²")
    args = ap.parse_args()
    t0 = time.time()
    G = cs.Grid(args.res)
    area = lambda c: G.row_area[c // G.NC]
    cs.Y0, cs.Y1 = -3500, 2015  # load_atlas reads these module globals
    pieces = cs.load_atlas()
    files = sorted((year_of(f), f) for f in glob.glob(os.path.join(GEO, "world_*.geojson")) if year_of(f) >= FIRST)
    cache = {}
    summary, events, shapes, absent, ever_linked = [], [], [], [], set()
    for year, path in files:
        snap = load_snapshot(path, G)
        for c in [c for c in snap if G.lonlat(c)[1] < -60]: del snap[c]  # Antarctica
        land = set(snap)
        atl = atlas_at(pieces, year, G, cache, land)
        shared = collections.Counter(); a_area = collections.Counter(); s_area = collections.Counter()
        for c, (nm, sov, _) in snap.items():
            w = area(c)
            if sov and not is_people(sov): s_area[sov] += w
            r = atl.get(c)
            if r: a_area[r] += w
            if r and sov and not is_people(sov): shared[(r, sov)] += w
        best_s, best_a = {}, {}
        for (r, s), w in shared.items():
            if w > best_s.get(r, (None, 0))[1]: best_s[r] = (s, w)
            if w > best_a.get(s, (None, 0))[1]: best_a[s] = (r, w)
        ever_linked.update(best_a)
        linked = lambda r, s: best_s.get(r, (None,))[0] == s or best_a.get(s, (None,))[0] == r
        miss, diff = collections.defaultdict(set), collections.defaultdict(set)
        st_land = cov = agree = 0.0
        prec = collections.Counter()
        for c, (nm, sov, pr) in snap.items():
            if not sov or is_people(sov): continue
            w = area(c); st_land += w; prec[pr] += w
            r = atl.get(c)
            if r is None: miss[sov].add(c); continue
            cov += w
            if linked(r, sov): agree += w
            else: diff[(r, sov)].add(c)
        summary.append((year, sum(area(c) for c in land), st_land, cov, agree, max(prec, key=prec.get) if prec else 1))
        for kind, groups in (("missing", miss), ("diff", diff)):
            for key, cells in groups.items():
                for comp in blocks(cells, G):
                    w = sum(area(c) for c in comp)
                    if w < args.min_area: continue
                    lon = sum(G.lonlat(c)[0] for c in comp) / len(comp); lat = sum(G.lonlat(c)[1] for c in comp) / len(comp)
                    names = collections.Counter(snap[c][0] for c in comp)
                    events.append({"kind": kind, "year": year, "key": key, "area": w, "lon": lon, "lat": lat,
                                   "names": [n for n, _ in names.most_common(3) if n], "cells": set(comp),
                                   "prec": snap[comp[0]][2]})
        for s, w in s_area.items():
            if w < args.shape_area: continue
            if s not in best_a: absent.append((year, s, w)); continue
            r, sh = best_a[s]
            iou = sh / (w + a_area[r] - sh)
            if iou < 0.5 and best_s.get(r, (None,))[0] == s:
                shapes.append((year, s, r, w, a_area[r], sh, iou))
        print(f"{ylab(year):>9}: {len(atl):6d} atlas cells, {len(events)} blocks so far, {time.time() - t0:.0f}s", flush=True)

    # merge blocks of the same pair across consecutive snapshots when they overlap
    order = [y for y, _ in files]
    nxt = {a: b for a, b in zip(order, order[1:])}
    events.sort(key=lambda e: (e["kind"], str(e["key"]), e["year"]))
    chains = []
    open_by_key = collections.defaultdict(list)
    for e in events:
        k = (e["kind"], e["key"])
        hit = next((ch for ch in open_by_key[k] if nxt.get(ch[-1]["year"]) == e["year"] and ch[-1]["cells"] & e["cells"]), None)
        if hit: hit.append(e)
        else: ch = [e]; chains.append(ch); open_by_key[k].append(ch)
    rows = []
    for ch in chains:
        big = max(ch, key=lambda e: e["area"])
        names = []
        for e in ch:
            for n in e["names"]:
                if n not in names: names.append(n)
        rows.append({"kind": ch[0]["kind"], "key": ch[0]["key"], "years": [e["year"] for e in ch], "area": big["area"],
                     "lon": big["lon"], "lat": big["lat"], "names": names[:4], "prec": max(e["prec"] for e in ch),
                     "score": big["area"] * len(ch) ** 0.5})
    rows.sort(key=lambda r: -r["score"])
    for r in rows:
        s = r["key"] if r["kind"] == "missing" else r["key"][1]
        r["state"] = bool(STATEWORDS.search(s)) or s in ever_linked
    absent = [a for a in absent if STATEWORDS.search(a[1]) or a[1] in ever_linked]
    write(rows, summary, shapes, absent, args, len(files), time.time() - t0)


def span(years):
    return ylab(years[0]) if len(years) == 1 else f"{ylab(years[0])} – {ylab(years[-1])} ({len(years)} snapshots)"


def write(rows, summary, shapes, absent, args, nfiles, secs):
    km = cs.km
    unclassified = collections.Counter()
    for r in rows:
        if r["kind"] == "missing" and not r["state"]: unclassified[r["key"]] += 1
    miss = [r for r in rows if r["kind"] == "missing" and r["state"]]
    diff = [r for r in rows if r["kind"] == "diff"]
    L = ["# historical-basemaps check", "",
         f"Generated by `tools/check_geo.py` on {datetime.date.today()} ({secs:.0f} s, grid {args.res}°, blocks from "
         f"{km(args.min_area)} km²). Read-only: it changes no data.", "",
         f"Compares the atlas with the {nfiles} historical-basemaps world snapshots from 3000 BCE to 2010. The snapshots are "
         "hand-drawn and mostly marked approximate before 1700, so each row is a lead to check against a published source. "
         "Snapshot peoples and ways of life (hunter-gatherers, cultures, tribes) are left out. Atlas realms are linked to "
         "snapshot polities by shared land, so a different name for the same state is not a mismatch.", "",
         f"Source: {CREDIT}.", "",
         "## Checked by hand", "",
         "The largest leads, probed against what the atlas draws at the place and year. These are errors in the atlas, "
         "not yet fixed:", "", "| Where | Years | What the atlas draws |", "|---|---|---|"]
    L += [f"| {w} | {y} | {t} |" for w, y, t in HANDCHECK]
    L += ["", REJECTED, "",
         "## Per snapshot", "",
         "| Year | Land km² | State land in snapshot | Atlas covers | Agrees | Snapshot precision |", "|---|---|---|---|---|---|"]
    for y, land, st, cov, ag, pr in summary:
        L.append(f"| {ylab(y)} | {km(land)} | {km(st)} | {cov / st:.0%} | {ag / st:.0%} | {pr} |" if st else
                 f"| {ylab(y)} | {km(land)} | 0 | – | – | {pr} |")
    for title, part, intro in (
        ("Missing: snapshot draws a state, atlas leaves the land blank", miss,
         "Largest first (area in the snapshot where the block is biggest; blocks in consecutive snapshots are merged)."),
        ("Different owner: both draw the land, under unlinked polities", diff,
         "The atlas realm, then the snapshot polity (and the snapshot's own names for the land)."),
    ):
        L += ["", f"## {title}", "", intro, ""]
        by_reg = collections.defaultdict(list)
        for r in part: by_reg[region(r["lon"], r["lat"])].append(r)
        L.append(f"{len(part)} rows. By region: " + ", ".join(f"{k} {len(v)}" for k, v in sorted(by_reg.items(), key=lambda kv: -len(kv[1]))) + ".")
        for reg, rs in sorted(by_reg.items(), key=lambda kv: -sum(r["score"] for r in kv[1])):
            L += ["", f"### {reg}", "", "| Years | km² | Atlas | Snapshot | Snapshot names | Near | Prec. |", "|---|---|---|---|---|---|---|"]
            for r in rs[:40]:
                a, s = (("blank", r["key"]) if r["kind"] == "missing" else r["key"])
                L.append(f"| {span(r['years'])} | {km(r['area'])} | {a} | {s} | {', '.join(r['names'])} | "
                         f"{r['lat']:.1f}, {r['lon']:.1f} | {r['prec']} |")
            if len(rs) > 40: L.append(f"| … {len(rs) - 40} more | | | | | | |")
    L += ["", "## Missing, probably not a state", "",
          "Snapshot entries with no state word in the name that no atlas realm matches in any snapshot: mostly peoples the "
          "atlas leaves blank on purpose (its peoples layer shows them). Name and number of blocks:", "",
          ", ".join(f"{k} ({v})" for k, v in unclassified.most_common()) + "."]
    L += ["", "## Shape: linked pairs with low overlap", "",
          f"Snapshot polities from {km(args.shape_area)} km² whose best atlas match covers under half the union of the two.", "",
          "| Year | Snapshot polity | Atlas realm | Snapshot km² | Atlas km² | Shared km² | Overlap |", "|---|---|---|---|---|---|---|"]
    for y, s, r, w, a, sh, iou in sorted(shapes, key=lambda t: t[6]):
        L.append(f"| {ylab(y)} | {s} | {r} | {km(w)} | {km(a)} | {km(sh)} | {iou:.0%} |")
    L += ["", "## Absent: snapshot states no atlas realm overlaps", "",
          "| Year | Snapshot polity | km² |", "|---|---|---|"]
    for y, s, w in sorted(absent, key=lambda t: -t[2]):
        L.append(f"| {ylab(y)} | {s} | {km(w)} |")
    open(OUT, "w").write("\n".join(L) + "\n")
    print(f"wrote {OUT}: {len(miss)} missing, {len(diff)} different-owner rows, {len(shapes)} shape, {len(absent)} absent")


if __name__ == "__main__":
    main()
