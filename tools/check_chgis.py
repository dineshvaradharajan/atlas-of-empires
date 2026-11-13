#!/usr/bin/env python3
"""Cross-check the atlas's Chinese dynasties, 221 BCE-1911, against CHGIS V6 (read-only; writes a report, changes no data).

CHGIS V6 (China Historical GIS) maps the prefecture-level units of the Chinese state(s) as time-series polygons, each with
a begin and an end year (BEG_YR, END_YR). The union of the prefectures valid in a year is the extent of territory the
Chinese state(s) administered directly that year. This script compares it with what the atlas draws:

  atlas  public/data/clio/*.json with content/corrections.json and public/data/supplements.json applied, read by
         load_atlas() in tools/check_cshapes.py (imported, not copied; see that file for the details)
  CHGIS  data/chgis/v6_time_pref_pgn_utf_wgs84.{shp,dbf} (time-series prefecture polygons, WGS84, UTF-8 attributes),
         read here in pure Python (shapefile polygon records and dBASE III records)

Both are rasterised onto the 0.25-degree grid of check_cshapes.Grid (cell centres, even-odd rule, cell area from the
latitude) and compared in sample years (every 25 years from 221 BCE, the year after each dynasty transition, and 1911).
For each year the atlas side is the union of its Chinese realms (the CHINA table below, by name); per state in years of
division. CHGIS records carry no dynasty, so its side is always the union of all prefectures. Reported, ranked:

  1. per year     overlap, area CHGIS administers that the atlas gives to another realm or leaves blank, and area the
                  atlas includes beyond CHGIS (inside the CHGIS footprint, see below, or outside it)
  2. per state    in years with several Chinese realms: how much of each one CHGIS administers
  3. ranked       disagreements by modern province and year run: first CHGIS-administered land the atlas gives to
                  another realm or leaves blank, then atlas land CHGIS shows as not administered (frontier, lower rank)
  4. transitions  the years the atlas starts or ends a Chinese realm, against the nearest burst of CHGIS prefecture
                  turnover (the year most prefectures inside the realm were re-created, renamed or re-bounded)

CHGIS V6 was compiled region by region and does not cover all of China in every period (before the Yuan it has mainly
the south and Shanxi), so a cell counts as inside the CHGIS footprint in year Y only if CHGIS administers it in some
year <= Y and some year >= Y. Atlas land outside that footprint is reported but not ranked.

Output: content/factcheck/chgis-check.md
Run:    python3 -I tools/check_chgis.py [--step 25] [--res 0.25] [--min-area 10000]

Source: "CHGIS Version 6." (c) Fairbank Center for Chinese Studies and the Institute for Chinese Historical Geography at
Fudan University, Dec 2016. https://dataverse.harvard.edu/dataverse/chgis_v6 . LICENCE: non-commercial academic and
educational use only, no redistribution. The raw files stay in data/chgis/ (gitignored) and the report carries only
derived figures, years and place names, never coordinates or geometry from CHGIS.
Fetch:  mkdir -p data/chgis && cd data/chgis
        curl -L -o v6_time_pref_pgn_utf_wgs84.zip https://dataverse.harvard.edu/api/access/datafile/2966510
        unzip v6_time_pref_pgn_utf_wgs84.zip      (gives v6_time_pref_pgn_utf_wgs84.{shp,shx,dbf,prj,cpg})
"""
import argparse, array, collections, datetime, math, os, struct, sys, time

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "tools"))
import check_cshapes as cs  # noqa: E402  (atlas loading and the rasterising grid)

CHGIS = os.path.join(ROOT, "data", "chgis", "v6_time_pref_pgn_utf_wgs84")
OUT = os.path.join(ROOT, "content", "factcheck", "chgis-check.md")
Y0, Y1 = -221, 1911
WINDOW = (70, 10, 140, 56)  # atlas pieces whose bounding box misses this lon/lat box are not rasterised
CITATION = ('"CHGIS Version 6." (c) Fairbank Center for Chinese Studies and the Institute for Chinese Historical '
            'Geography at Fudan University, Dec 2016.')

# CHGIS unit types that are not directly administered prefectures: "non-administrative national territory" (Taiwan
# before 1683 and after 1895, Hainan's Zhuya before 533), "barbarian" and tribal areas, and the Yue client kingdoms.
NOT_ADMIN = {"Fei Zhengqu Xia", "Manyi", "Buluo", "Wangguo"}

# ---------------------------------------------------------------------------------------------------------------------
# Atlas realms that count as the Chinese state(s). "dynasty": a Chinese dynasty or a state of a period of division
# (conquest dynasties included); "rival": a rebel or breakaway regime inside a dynasty's land. Both count for the atlas
# side; any other realm is "another realm".
# ---------------------------------------------------------------------------------------------------------------------
DYNASTIES = [
    # Warring States and the Eighteen Kingdoms between Qin and Han
    "Qin", "Zhao", "Yan", "Qi", "Chu", "Wei", "Qin Dynasty", "Han", "Western Chu", "Zhai", "Dai", "Jibei", "Jiujiang",
    "Henan", "Hán", "Linjiang", "Chang-shan", "Sai", "Liaodong", "Jiaodong", "Yong", "Yin",
    "Han Dynasty", "Xin Dynasty", "Cao Cao", "Cao Wei", "Shu Han", "Eastern Wu", "Western Jin", "Eastern Jin",
    # Sixteen Kingdoms and Northern and Southern dynasties
    "Cheng Han", "Former Zhao", "Later Zhao", "Former Liang", "Former Yan", "Former Qin", "Western Qin", "Western Yan",
    "Later Liang", "Later Yan", "Later Qin", "Northern Liang", "Southern Liang", "Southern Yan", "Western Liang",
    "Northern Yan", "Xia", "Northern Wei", "Liu Song Dynasty", "Southern Qi", "Liang Dynasty", "Eastern Wei",
    "Western Wei", "Northern Qi", "Northern Zhou", "Chen Dynasty", "Later Western Liang",
    "Sui Dynasty", "Gao Kaidao", "Tang Dynasty",
    # Five Dynasties and Ten Kingdoms
    "Later Liang Dynasty", "Later Tang", "Later Jin", "Later Han", "Later Zhou", "Former Jin", "Yan Kingdom", "Qi Kingdom",
    "Former Shu", "Later Shu", "Southern Wu", "Southern Tang", "Wuyue", "Min", "Southern Han", "Southern Chu", "Jingnan",
    "Northern Han",
    "Northern Song", "Southern Song", "Liao Dynasty", "Western Xia", "Great Jin", "Mongol Empire", "Yuan Dynasty",
    "Ming Dynasty", "Southern Ming", "Later Jin Dynasty", "Qing Dynasty",
]
RIVALS = ["Li Zicheng", "Revolt of the Three Feudatories", "Kingdom of Tungning", "Taiping Heavenly Kingdom",
          "Panthay Rebellion"]
CHINA = {**{n: "dynasty" for n in DYNASTIES}, **{n: "rival" for n in RIVALS}}
# Realms the atlas only renames (same state, new name): no transition is tested at the rename.
RENAMED = {"Qin": "Qin Dynasty", "Han": "Han Dynasty", "Cao Cao": "Cao Wei", "Later Jin Dynasty": "Qing Dynasty"}

# Conventional dynasty transitions (the year the new regime took over; Wikipedia). The sample takes the year after.
TRANSITIONS = [
    (-202, "Han"), (9, "Xin"), (25, "Eastern Han"), (220, "Three Kingdoms"), (266, "Jin"), (280, "Jin takes Wu"),
    (304, "Sixteen Kingdoms"), (317, "Eastern Jin"), (386, "Northern Wei"), (420, "Liu Song"), (439, "Northern Wei unites the north"),
    (479, "Southern Qi"), (502, "Liang"), (535, "Wei splits"), (557, "Chen, Northern Zhou"), (581, "Sui"),
    (589, "Sui takes Chen"), (618, "Tang"), (907, "Five Dynasties"), (923, "Later Tang"), (960, "Song"),
    (979, "Song unites China proper"), (1115, "Jurchen Jin"), (1127, "Jin takes the north"), (1234, "Mongols take Jin"),
    (1271, "Yuan"), (1279, "Song falls"), (1368, "Ming"), (1644, "Qing"), (1683, "Qing takes Taiwan"),
    (1759, "Qing takes Xinjiang"), (1851, "Taiping"),
]
# Conventional start and end years of the main realms, for context in the transition table (Wikipedia).
CONVENTIONAL = {
    "Qin Dynasty": (-221, -206), "Han Dynasty": (-202, 220), "Xin Dynasty": (9, 23), "Cao Wei": (220, 266),
    "Shu Han": (221, 263), "Eastern Wu": (222, 280), "Western Jin": (266, 316), "Eastern Jin": (317, 420),
    "Former Qin": (351, 394), "Northern Wei": (386, 535), "Liu Song Dynasty": (420, 479), "Southern Qi": (479, 502),
    "Liang Dynasty": (502, 557), "Eastern Wei": (534, 550), "Western Wei": (535, 557), "Northern Qi": (550, 577),
    "Northern Zhou": (557, 581), "Chen Dynasty": (557, 589), "Sui Dynasty": (581, 618), "Tang Dynasty": (618, 907),
    "Later Liang Dynasty": (907, 923), "Later Tang": (923, 937), "Later Jin": (936, 947), "Later Han": (947, 951),
    "Later Zhou": (951, 960), "Southern Tang": (937, 976), "Wuyue": (907, 978), "Min": (909, 945),
    "Southern Han": (917, 971), "Southern Chu": (907, 951), "Former Shu": (907, 925), "Later Shu": (934, 965),
    "Northern Song": (960, 1127), "Southern Song": (1127, 1279), "Liao Dynasty": (916, 1125),
    "Western Xia": (1038, 1227), "Great Jin": (1115, 1234), "Mongol Empire": (1206, 1271), "Yuan Dynasty": (1271, 1368),
    "Ming Dynasty": (1368, 1644), "Southern Ming": (1644, 1662), "Later Jin Dynasty": (1616, 1636),
    "Qing Dynasty": (1636, 1912), "Taiping Heavenly Kingdom": (1851, 1864), "Kingdom of Tungning": (1661, 1683),
    "Revolt of the Three Feudatories": (1673, 1681), "Panthay Rebellion": (1856, 1873), "Li Zicheng": (1644, 1645),
}

# Hand checks of the top-ranked disagreements (section 3a), keyed by (kind, atlas realm or None for blank, a sample year
# inside the run): (verdict, note). Verdicts: atlas error | CHGIS scope difference | ambiguous. Checked 2026-11-13.
VERIFIED = {
    ("other", "Northern Yuan", 1369): (
        "atlas error",
        "The Ming was proclaimed at Nanjing on 23 January 1368 and took Dadu in September 1368; the Yuan court fled to "
        "the steppe. The atlas starts the Ming only in 1375 and draws China proper as Northern Yuan in 1369-1374 (its "
        "Ming note already says so). Only Yunnan (Basalawarmi, to 1381-82) and later Liaodong (Naghachu, 1375-87) "
        "stayed Yuan-loyal. Sources: Wikipedia 'Ming dynasty', 'Northern Yuan'."),
    ("blank", None, 908): (
        "atlas error",
        "The Tang ended on 1 June 907 when Emperor Ai abdicated to Zhu Wen (Later Liang); Former Shu, Wuyue, Wu and Chu "
        "date from 907 and Min from 909. The atlas leaves China empty in 908-910 (its Tang note admits this) where the "
        "Later Liang and the southern kingdoms should be drawn. Sources: Wikipedia 'Tang dynasty', 'Five Dynasties and "
        "Ten Kingdoms period'."),
    ("blank", None, 619): (
        "atlas error",
        "Li Yuan proclaimed the Tang on 18 June 618, but the atlas clips the Sui at 618 and starts the Tang in 623, so "
        "619-622 has no Chinese realm at all. The southern land CHGIS administers here was held by rival claimants "
        "such as Xiao Xian's Liang (to 621) and Lin Shihong (to 622), so the fix is to draw the Tang from 618 and the "
        "contenders, "
        "not to give everything to the Tang. Source: Wikipedia 'Tang dynasty'."),
    ("other", "Nanyue", -146): (
        "CHGIS scope difference",
        "Nanyue (204-111 BCE) was Zhao Tuo's kingdom of the Nanhai, Guilin and Xiang commanderies, a nominal Han vassal "
        "from 196 BCE but 'autonomous and mostly sovereign' until the Han conquest of 111 BCE. CHGIS keeps its "
        "commanderies as prefecture units (Nanhai Jun 206-111 BCE); the atlas is right to draw Nanyue. Source: "
        "Wikipedia 'Nanyue'."),
    ("blank", None, 221): (
        "atlas error",
        "Sun Quan made Bu Zhi Inspector of Jiao Province in 210 and took southern Jing Province (Changsha, Lingling, "
        "Guiyang, Wuling) from Liu Bei in 219, so in 221-237 Wu ruled Hunan, Guangdong, Guangxi and northern Vietnam. "
        "The atlas's Eastern Wu outline for 207-237 (about 0.6 million km², 1.4 million from 238) leaves them blank. "
        "Sources: Wikipedia 'Eastern Wu', 'Bu Zhi'."),
}

# Region labels: the nearest modern provincial capital (or neighbouring country's capital). Coordinates are general
# knowledge typed here, not taken from CHGIS; they only name where a disagreement lies.
PLACES = [
    ("Beijing", 116.4, 39.9), ("Tianjin", 117.2, 39.1), ("Hebei", 114.5, 38.0), ("Shanxi", 112.55, 37.87),
    ("Inner Mongolia", 111.7, 40.8), ("Inner Mongolia (Hulunbuir)", 119.7, 49.2), ("Inner Mongolia (Alxa)", 105.7, 38.8),
    ("Inner Mongolia (Chifeng)", 118.9, 42.3), ("Liaoning", 123.4, 41.8), ("Jilin", 125.3, 43.9),
    ("Heilongjiang", 126.6, 45.75), ("Heilongjiang (Qiqihar)", 123.9, 47.3), ("Heilongjiang (Heihe)", 127.5, 50.2),
    ("Shanghai", 121.5, 31.2), ("Jiangsu", 118.8, 32.06), ("Jiangsu (Xuzhou)", 117.2, 34.3), ("Zhejiang", 120.15, 30.27),
    ("Anhui", 117.27, 31.86), ("Fujian", 119.3, 26.08), ("Jiangxi", 115.9, 28.68), ("Jiangxi (Ganzhou)", 114.9, 25.8),
    ("Shandong", 117.0, 36.65), ("Shandong (Qingdao)", 120.4, 36.1), ("Henan", 113.65, 34.76), ("Hubei", 114.3, 30.6),
    ("Hubei (Yichang)", 111.3, 30.7), ("Hunan", 112.94, 28.23), ("Hunan (west)", 109.7, 28.3), ("Guangdong", 113.26, 23.13),
    ("Guangdong (Shantou)", 116.7, 23.4), ("Guangxi", 108.37, 22.82), ("Guangxi (Guilin)", 110.3, 25.3),
    ("Hainan", 110.35, 20.02), ("Chongqing", 106.55, 29.56), ("Sichuan", 104.07, 30.67), ("Sichuan (Garzê)", 100.0, 31.6),
    ("Sichuan (Xichang)", 102.3, 27.9), ("Guizhou", 106.71, 26.58), ("Yunnan", 102.71, 25.04), ("Yunnan (Dali)", 100.2, 25.6),
    ("Yunnan (Xishuangbanna)", 100.8, 22.0), ("Tibet", 91.1, 29.65), ("Tibet (Ngari)", 80.1, 32.5),
    ("Tibet (Qamdo)", 97.17, 31.14), ("Tibet (Nagqu)", 92.05, 31.5), ("Shaanxi", 108.94, 34.34),
    ("Shaanxi (Yulin)", 109.7, 38.3), ("Gansu", 103.83, 36.06), ("Gansu (Hexi)", 98.5, 39.7), ("Qinghai", 101.78, 36.62),
    ("Qinghai (Qaidam)", 94.9, 36.4), ("Qinghai (Yushu)", 97.0, 33.0), ("Ningxia", 106.27, 38.47),
    ("Xinjiang (Ürümqi)", 87.6, 43.8), ("Xinjiang (Kashgar)", 75.99, 39.47), ("Xinjiang (Hami, Turpan)", 92.0, 42.8),
    ("Xinjiang (Hotan)", 79.9, 37.1), ("Xinjiang (Ili)", 81.3, 43.9), ("Xinjiang (Aksu, Kucha)", 82.0, 41.4),
    ("Xinjiang (Lop Nur)", 88.5, 39.5), ("Taiwan", 121.0, 24.0), ("Mongolia", 106.9, 47.9), ("Mongolia (west)", 92.0, 48.0),
    ("Mongolia (Gobi)", 105.0, 43.5), ("North Korea", 125.75, 39.03), ("South Korea", 127.5, 36.5),
    ("Vietnam (north)", 105.85, 21.03), ("Vietnam (centre)", 107.6, 16.5), ("Myanmar", 96.1, 21.97),
    ("Laos", 102.13, 19.89), ("Russian Far East", 133.0, 46.0), ("Russian Far East (Amur)", 128.0, 52.5),
    ("Kazakhstan", 76.9, 43.25), ("Kyrgyzstan", 74.6, 41.5), ("Tajikistan", 71.0, 38.5), ("Nepal", 85.3, 27.7),
    ("India (Assam)", 92.5, 26.5), ("Bhutan", 90.5, 27.5), ("Pakistan (north)", 74.0, 35.5), ("Thailand (north)", 99.0, 18.8),
    ("Russia (Tuva)", 94.5, 51.7), ("Russia (Transbaikal)", 113.5, 52.0),
]


def read_dbf(path):
    """records of a dBASE III table as dicts of stripped strings (numbers left as text; deleted records -> None)"""
    with open(path, "rb") as f:
        head = f.read(32)
        n, hlen, rlen = struct.unpack("<IHH", head[4:12])
        fields = []
        while True:
            d = f.read(32)
            if not d or d[0] == 0x0D: break
            fields.append((d[:11].split(b"\0")[0].decode("ascii"), d[16]))
        f.seek(hlen)
        out = []
        for _ in range(n):
            r = f.read(rlen)
            if r[:1] == b"*": out.append(None); continue
            row, o = {}, 1
            for name, ln in fields:
                row[name] = r[o:o + ln].decode("utf-8", "replace").strip(); o += ln
            out.append(row)
    return out


def read_shp(path):
    """polygons of an ESRI shapefile (types 5, 15, 25) in record order: each a list of rings [[x, y], ...]"""
    with open(path, "rb") as f:
        data = f.read()
    out, pos = [], 100
    while pos + 8 <= len(data):
        _, clen = struct.unpack(">ii", data[pos:pos + 8])
        body = pos + 8
        pos = body + 2 * clen
        st = struct.unpack("<i", data[body:body + 4])[0]
        if st == 0: out.append([]); continue  # null shape
        if st not in (5, 15, 25): raise SystemExit(f"unexpected shape type {st} in {path}")
        nparts, npts = struct.unpack("<ii", data[body + 36:body + 44])
        p0 = body + 44 + 4 * nparts
        parts = list(struct.unpack(f"<{nparts}i", data[body + 44:p0])) + [npts]
        xy = array.array("d"); xy.frombytes(data[p0:p0 + 16 * npts])
        if sys.byteorder == "big": xy.byteswap()
        out.append([[[xy[2 * i], xy[2 * i + 1]] for i in range(a, b)] for a, b in zip(parts, parts[1:])])
    return out


def bbox(polys):
    xs = [p[0] for poly in polys for ring in poly for p in ring]
    ys = [p[1] for poly in polys for ring in poly for p in ring]
    return (min(xs), min(ys), max(xs), max(ys)) if xs else None


def spans_of(years):
    """sorted set of ints -> [(first, last)] of consecutive runs"""
    out = []
    for y in sorted(years):
        if out and y == out[-1][1] + 1: out[-1][1] = y
        else: out.append([y, y])
    return [tuple(s) for s in out]


def ystr(y): return f"{-y} BCE" if y < 0 else str(y)


def yr(a, b): return ystr(a) if a == b else f"{ystr(a)}–{ystr(b)}"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--step", type=int, default=25, help="years between regular samples (default 25)")
    ap.add_argument("--res", type=float, default=0.25, help="grid cell size in degrees (default 0.25)")
    ap.add_argument("--min-area", type=float, default=10000, help="smallest disagreement listed, km² (default 10,000)")
    ap.add_argument("--top", type=int, default=50, help="rows per ranked table (default 50)")
    args = ap.parse_args()
    for ext in (".shp", ".dbf"):
        if not os.path.exists(CHGIS + ext): raise SystemExit(f"missing {CHGIS + ext}: see the Fetch steps in this script's header")
    t0 = time.time()
    G = cs.Grid(args.res)
    km = cs.km
    area = lambda cells: sum(G.row_area[c // G.NC] for c in cells)

    # ------------------------------------------------------------------ CHGIS
    dbf, shp = read_dbf(CHGIS + ".dbf"), read_shp(CHGIS + ".shp")
    if len(dbf) != len(shp): raise SystemExit("CHGIS .dbf and .shp record counts differ")
    recs, skipped = [], collections.Counter()
    for row, rings in zip(dbf, shp):
        if row is None or not rings: skipped["empty"] += 1; continue
        if row["TYPE_PY"] in NOT_ADMIN: skipped[row["TYPE_PY"]] += 1; continue
        try: b, e = int(row["BEG_YR"]), int(row["END_YR"])
        except ValueError: skipped["no dates"] += 1; continue
        cells = G.cells([rings])
        if not cells: skipped["under one cell"] += 1; continue
        recs.append({"name": row["NAME_PY"], "ch": row["NAME_CH"], "type": row["TYPE_PY"], "b": b, "e": e, "cells": cells})
    first, last = {}, {}  # cell -> first and last year CHGIS administers it (the footprint bracket)
    by_cell = collections.defaultdict(list)  # cell -> record indices
    for i, r in enumerate(recs):
        for c in r["cells"]:
            by_cell[c].append(i)
            if r["b"] < first.get(c, 9999): first[c] = r["b"]
            if r["e"] > last.get(c, -9999): last[c] = r["e"]
    begins = collections.defaultdict(list)
    for i, r in enumerate(recs): begins[r["b"]].append(i)
    print(f"CHGIS: {len(recs)} prefecture records used, {sum(skipped.values())} skipped {dict(skipped)}", flush=True)

    def chgis_cells(y):
        out = set()
        for r in recs:
            if r["b"] <= y <= r["e"]: out |= r["cells"]
        return out

    def footprint(y): return {c for c in first if first[c] <= y <= last[c]}

    def pref_at(c, y):
        """CHGIS prefecture name for a cell in year y: the one valid then, else the nearest in time"""
        best = None
        for i in by_cell.get(c, ()):
            r = recs[i]
            d = 0 if r["b"] <= y <= r["e"] else min(abs(r["b"] - y), abs(r["e"] - y))
            if best is None or d < best[0]: best = (d, r)
        return f"{best[1]['name']} {best[1]['ch']}" if best else None

    # ------------------------------------------------------------------ atlas
    cs.Y0, cs.Y1 = Y0, Y1  # load_atlas() reads its year window from these module globals
    pieces = []
    for p in cs.load_atlas():
        g = p["geom"]
        if "bb" not in g: g["bb"] = bbox(g["polys"])
        b = g["bb"]
        if b and b[2] >= WINDOW[0] and b[0] <= WINDOW[2] and b[3] >= WINDOW[1] and b[1] <= WINDOW[3]: pieces.append(p)
    print(f"atlas: {len(pieces)} pieces near China, {time.time() - t0:.0f}s", flush=True)

    def pcells(p):
        if "cells" not in p:
            g = p["geom"]
            if p["crop"] or p["cuts"]: p["cells"] = G.cells(g["polys"], p["crop"], p["cuts"])
            else:
                if "cells" not in g: g["cells"] = G.cells(g["polys"])
                p["cells"] = g["cells"]
        return p["cells"]

    def atlas_at(y):
        """cell -> list of atlas pieces drawn there in year y"""
        out = collections.defaultdict(list)
        for p in pieces:
            if p["a"] <= y <= p["b"]:
                for c in pcells(p): out[c].append(p)
        return out

    # region label per cell: nearest place in PLACES
    place_of = {}

    def place(c):
        v = place_of.get(c)
        if v is None:
            lon, lat = G.lonlat(c)
            k = math.cos(math.radians(lat))
            v = min(PLACES, key=lambda p: ((p[1] - lon) * k) ** 2 + (p[2] - lat) ** 2)[0]
            place_of[c] = v
        return v

    # ------------------------------------------------------------------ sample years
    sample = sorted(set(range(Y0, Y1 + 1, args.step)) | {Y1} | {y + 1 for y, _ in TRANSITIONS if Y0 <= y + 1 <= Y1})
    trans_label = {y + 1: n for y, n in TRANSITIONS}
    print(f"{len(sample)} sample years", flush=True)

    yearly = []  # one dict per sample year
    states = {}  # year -> [(name, role, area, area in footprint, CHGIS share)]
    dis = collections.defaultdict(lambda: collections.defaultdict(float))  # key -> year -> area
    dis_pref = collections.defaultdict(lambda: collections.defaultdict(collections.Counter))  # key -> year -> prefecture -> area
    dis_reg = collections.defaultdict(lambda: collections.defaultdict(collections.Counter))  # key -> year -> region -> area
    for y in sample:
        C, F = chgis_cells(y), footprint(y)
        at = atlas_at(y)
        china_cells = collections.defaultdict(set)  # realm -> cells
        for c, ps in at.items():
            for p in ps:
                if p["name"] in CHINA: china_cells[p["name"]].add(c)
        A = set().union(*china_cells.values()) if china_cells else set()
        AF = A & F
        inter = C & A
        other = collections.Counter(); blank = 0.0
        for c in C - A:
            a = G.row_area[c // G.NC]
            ps = at.get(c)
            if ps:
                p = min(ps, key=lambda p: len(pcells(p)))
                other[p["name"]] += a
                key = ("other", p["name"])
            else:
                blank += a
                key = ("blank", None)
            dis[key][y] += a
            dis_reg[key][y][place(c)] += a
            dis_pref[key][y][pref_at(c, y)] += a
        beyond = collections.Counter()
        for c in AF - C:
            a = G.row_area[c // G.NC]
            names = [p["name"] for p in at[c] if p["name"] in CHINA]
            n = min(names, key=lambda n: len(china_cells[n]))
            beyond[n] += a
            key = ("beyond", n)
            dis[key][y] += a
            dis_reg[key][y][place(c)] += a
            dis_pref[key][y][pref_at(c, y)] += a
        outside = collections.Counter()
        for c in A - F:
            names = [p["name"] for p in at[c] if p["name"] in CHINA]
            outside[place(c)] += G.row_area[c // G.NC]
            key = ("outside", min(names, key=lambda n: len(china_cells[n])))
            dis[key][y] += G.row_area[c // G.NC]
            dis_reg[key][y][place(c)] += G.row_area[c // G.NC]
        union = C | AF
        yearly.append({"y": y, "realms": sorted(china_cells, key=lambda n: -len(china_cells[n])),
                       "C": area(C), "F": area(F), "AF": area(AF), "A": area(A), "inter": area(inter),
                       "iou": area(inter) / area(union) if union else None, "cov": area(inter) / area(C) if C else None,
                       "other": other, "blank": blank, "beyond": sum(beyond.values()), "outside": sum(outside.values()),
                       "outside_where": outside})
        rows = []
        for n, cells in china_cells.items():
            cf = cells & F
            rows.append((n, CHINA[n], area(cells), area(cf), area(cells & C) / area(cf) if cf else None, area(cells & C)))
        states[y] = sorted(rows, key=lambda r: -r[2])
        print(f"{ystr(y):>8}: CHGIS {km(area(C))} km², atlas China {km(area(A))} km², IoU in footprint "
              f"{(yearly[-1]['iou'] or 0) * 100:.0f}%", flush=True)

    # ------------------------------------------------------------------ ranked disagreements
    ranked = []
    for key, by in dis.items():
        big = {y for y, v in by.items() if v >= args.min_area}
        for a, b in cs.runs(big, sample):
            ys = [y for y in sample if a <= y <= b and y in by]
            peak_y = max(ys, key=lambda y: by[y])
            prefs, regs = collections.Counter(), collections.Counter()
            for y in ys:
                prefs.update(dis_pref[key].get(y, {})); regs.update(dis_reg[key].get(y, {}))
            tot = sum(regs.values()) or 1
            ranked.append({"key": key, "a": a, "b": b, "n": len(ys), "peak": by[peak_y], "peak_y": peak_y,
                           "sum": sum(by[y] for y in ys), "prefs": [p for p, _ in prefs.most_common(4) if p],
                           "regions": [(g, v / tot) for g, v in regs.most_common(4)], "nreg": len(regs)})
    problems = sorted([r for r in ranked if r["key"][0] in ("other", "blank")], key=lambda r: -r["peak"] * r["n"] ** 0.5)
    frontier = sorted([r for r in ranked if r["key"][0] == "beyond"], key=lambda r: -r["peak"] * r["n"] ** 0.5)
    outside_rows = sorted([r for r in ranked if r["key"][0] == "outside"], key=lambda r: -r["peak"] * r["n"] ** 0.5)

    # ------------------------------------------------------------------ transitions
    drawn = collections.defaultdict(set)  # realm -> years drawn near China
    for p in pieces:
        if p["name"] in CHINA:
            drawn[p["name"]].update(range(p["a"], p["b"] + 1))
    trans_rows = []
    for name, ys in drawn.items():
        for s, e in spans_of(ys):
            for kind, y_at in (("starts", s), ("ends", e)):
                if (kind == "starts" and (s <= Y0 or name in RENAMED.values())) or \
                        (kind == "ends" and (e >= Y1 or name in RENAMED)): continue
                ref = y_at if kind == "starts" else e + 1  # the first year of the new order
                cells = set()
                for p in pieces:
                    if p["name"] == name and p["a"] <= y_at <= p["b"]: cells |= pcells(p)
                Cin = cells & chgis_cells(y_at)
                cin = area(Cin)
                row = {"name": name, "kind": kind, "y": y_at, "ref": ref, "cin": cin, "conv": CONVENTIONAL.get(name)}
                trans_rows.append(row)
                if cin < 20000: continue
                turn = {}
                for t in range(ref - 20, ref + 21):
                    cells_t = set()
                    for i in begins.get(t, ()): cells_t |= recs[i]["cells"] & Cin
                    turn[t] = area(cells_t) / cin
                big = max(turn, key=lambda t: (turn[t], -abs(t - ref)))
                near = min((t for t in turn if turn[t] >= 0.2), key=lambda t: (abs(t - ref), -turn[t]), default=None)
                at_ref = max(turn[t] for t in (ref - 1, ref, ref + 1))
                row.update({"big": big, "big_share": turn[big], "near": near, "near_share": turn.get(near, 0),
                            "at_ref": at_ref,
                            "flag": near is not None and abs(near - ref) >= 3 and at_ref < 0.1})
    trans_rows.sort(key=lambda r: (r["y"], r["name"]))

    # ------------------------------------------------------------------ report
    L = []
    w = L.append
    w("# Chinese dynasties cross-checked against CHGIS V6 (221 BCE–1911)")
    w("")
    w(f"Written by `tools/check_chgis.py` on {datetime.date.today().isoformat()}. Read-only: nothing in the atlas was changed.")
    w("")
    w("CHGIS V6 (China Historical GIS, Harvard and Fudan) maps the prefecture-level units of the Chinese state(s) from "
      "221 BCE to 1911 as dated polygons. The union of the prefectures valid in a year is the territory the Chinese "
      "state(s) administered directly that year, so it is compared here with the atlas's Chinese realms. CHGIS records "
      "carry no dynasty, and V6 was compiled region by region: before the Yuan it covers mainly southern China and "
      "Shanxi, so the comparison is made inside the *CHGIS footprint* (land CHGIS administers at some time before and "
      "some time after the year in question). Frontier zones, protectorates and tributaries that were never prefectures "
      "fall outside CHGIS by design.")
    w("")
    w(f"> Source: {CITATION} [dataverse.harvard.edu/dataverse/chgis_v6](https://dataverse.harvard.edu/dataverse/chgis_v6). "
      "Licence: non-commercial academic and educational use only; no redistribution. This report carries only figures, "
      "years and place names derived from it; no CHGIS coordinates or geometry, and the raw files are not in the "
      "repository.")
    w("")
    w("## How it was compared")
    w("")
    w(f"- Years: every {args.step} years from {ystr(Y0)} to {Y1}, the year after each conventional dynasty transition, "
      f"and {Y1} ({len(sample)} snapshots). A CHGIS prefecture counts in year Y if BEG_YR ≤ Y ≤ END_YR, an atlas row if "
      "its first year ≤ Y ≤ its last year.")
    w("- Atlas: the border chunks in `public/data/clio/` with every correction in `content/corrections.json` and the "
      "layers in `public/data/supplements.json`, read by `load_atlas()` in `tools/check_cshapes.py`. Its Chinese side is "
      "the union of the realms in the script's CHINA table: dynasties and states of the periods of division (conquest "
      "dynasties such as Liao, Jin, the Mongol Empire, Yuan and Qing included) and rebel regimes inside them (Taiping, "
      "the Three Feudatories, Tungning, Li Zicheng, the Panthay). Every other realm is \"another realm\".")
    w(f"- CHGIS: {len(recs)} prefecture-level records; {sum(skipped.values())} left out (types that CHGIS marks as not "
      "administered: \"non-administrative national territory\" such as Taiwan before 1683 and after 1895, barbarian and "
      "tribal areas, and the Yue client kingdoms of the early Han).")
    w(f"- Both are laid on a {args.res}° grid (cell centres; a cell is about {km(G.row_area[120 * G.K])} km² "
      "at 30°N). Region names are the nearest modern provincial capital (or neighbouring country), typed by hand in the "
      "script, plus the CHGIS prefectures that hold most of the area.")
    w("- Overlap = shared area ÷ the union of CHGIS and the atlas's Chinese realms inside the footprint. *Given to other "
      "/ blank*: CHGIS administers it, the atlas gives it to a non-Chinese realm or draws nothing. *Beyond, in footprint*: "
      "the atlas draws a Chinese realm on land CHGIS has as prefectures before and after but not that year. *Outside "
      "footprint*: atlas Chinese land CHGIS never maps around that year (steppe, Tibet, the Western Regions, Korea, "
      "Vietnam, or regions V6 has not compiled for the period).")
    w("")
    n_prob = len(problems); n_front = len(frontier)
    w("## Summary")
    w("")
    good = [r for r in yearly if r["cov"] is not None and r["C"] >= 200000]
    if good:
        med = sorted(r["cov"] for r in good)[len(good) // 2]
        w(f"- In the median sample year the atlas's Chinese realms cover {med * 100:.0f}% of the land CHGIS administers.")
    worst = sorted(good, key=lambda r: r["cov"])[:5]
    w("- Lowest coverage: " + "; ".join(f"{ystr(r['y'])} {r['cov'] * 100:.0f}%" for r in worst) + ".")
    w(f"- {n_prob} runs where CHGIS administers ≥ {km(args.min_area)} km² that the atlas gives to another realm or "
      f"leaves blank; {n_front} runs where the atlas draws a Chinese realm on land CHGIS shows as not administered that "
      "year (inside the footprint); atlas land outside the footprint is listed per year only.")
    w(f"- {sum(1 for r in trans_rows if r.get('flag'))} of {sum(1 for r in trans_rows if 'big' in r)} testable realm "
      "start or end years in the atlas sit 3 or more years from the nearest burst of CHGIS prefecture turnover, with "
      "little turnover at the atlas year itself (section 4).")
    w("")
    w("## 1. Per sample year")
    w("")
    w("km². *CHGIS* = administered that year; *Atlas (fp)* = atlas Chinese realms inside the CHGIS footprint; "
      "*Covered* = share of CHGIS land inside an atlas Chinese realm.")
    w("")
    w("| Year | Atlas Chinese realms | CHGIS | Atlas (fp) | Overlap | Covered | Given to other (largest) | Blank | Beyond, in fp | Outside fp (largest region) |")
    w("|---|---|---|---|---|---|---|---|---|---|")
    for r in yearly:
        tag = f" ({trans_label[r['y']]})" if r["y"] in trans_label else ""
        realms = ", ".join(r["realms"][:4]) + (f" +{len(r['realms']) - 4}" if len(r["realms"]) > 4 else "")
        oth = sum(r["other"].values())
        o_top = r["other"].most_common(1)
        o_txt = f"{km(oth)} ({o_top[0][0]})" if o_top and oth >= 1000 else (km(oth) if oth else "0")
        ow = r["outside_where"].most_common(1)
        out_txt = f"{km(r['outside'])} ({ow[0][0]})" if ow and r["outside"] >= 1000 else (km(r["outside"]) if r["outside"] else "0")
        pct = lambda v: f"{v * 100:.0f}%" if v is not None else "—"
        w(f"| {ystr(r['y'])}{tag} | {realms or '—'} | {km(r['C'])} | {km(r['AF'])} | {pct(r['iou'])} | {pct(r['cov'])} | "
          f"{o_txt} | {km(r['blank']) if r['blank'] else '0'} | {km(r['beyond']) if r['beyond'] else '0'} | {out_txt} |")
    w("")
    w("## 2. Per state, in years with several Chinese realms")
    w("")
    w("CHGIS has no dynasty attribute, so it cannot say which state a prefecture belonged to. What it can say is how much "
      "of each atlas realm (inside the footprint) is administered land, and how much of CHGIS's administered land falls "
      "in each realm. A realm far below its neighbours, or a large share of CHGIS land in a realm that did not hold it, "
      "points at a misplaced border between the states. Realms under 20,000 km² are left out.")
    w("")
    w("| Year | Realm | Atlas km² | In footprint | Of which CHGIS-administered | CHGIS km² inside |")
    w("|---|---|---|---|---|---|")
    for y in sample:
        rows = [r for r in states[y] if r[2] >= 20000]
        if len(rows) < 2: continue
        for n, role, a, af, share, cin in rows:
            w(f"| {ystr(y)} | {n}{' (rival)' if role == 'rival' else ''} | {km(a)} | {km(af)} | "
              f"{f'{share * 100:.0f}%' if share is not None else '—'} | {km(cin)} |")
    w("")

    def regions(r):
        txt = ", ".join(f"{g} {v * 100:.0f}%" for g, v in r["regions"]) or "—"
        return txt + (f" (of {r['nreg']} regions)" if r["nreg"] > 4 else "")

    def dis_table(rs, top):
        w("| # | Years (samples) | Peak km² (year) | Atlas draws | Regions (share of area) | CHGIS prefectures there (most area) |")
        w("|---|---|---|---|---|---|")
        for i, r in enumerate(rs[:top], 1):
            kind, realm = r["key"]
            atl = "nothing" if kind == "blank" else realm
            w(f"| {i} | {yr(r['a'], r['b'])} ({r['n']}) | {km(r['peak'])} ({ystr(r['peak_y'])}) | {atl} | {regions(r)} | "
              f"{', '.join(r['prefs']) or '—'} |")
        if len(rs) > top:
            w(""); w(f"{len(rs) - top} smaller runs are not listed (rerun with `--top`).")
        w("")

    w("## 3. Ranked disagreements")
    w("")
    w(f"Runs of consecutive sample years with at least {km(args.min_area)} km² per atlas realm (or blank), ranked by "
      "peak area × √(number of samples). Regions are the nearest modern provincial capitals with their share of the "
      "run's area; for land the atlas draws beyond CHGIS the prefecture names are the nearest in time.")
    w("")
    w("### 3a. CHGIS administers it; the atlas gives it to another realm or leaves it blank")
    w("")
    dis_table(problems, args.top)
    w("### Hand checks of the top five")
    w("")
    w("Checked against Wikipedia (fetched 2026-11-13). *Atlas error*: the atlas should change. *CHGIS scope "
      "difference*: CHGIS maps as administered land that was not the Chinese state's (or vice versa); the atlas stands. "
      "*Ambiguous*: both readings are defensible.")
    w("")
    w("| # | Disagreement | Verdict | Evidence |")
    w("|---|---|---|---|")
    for i, r in enumerate(problems[:5], 1):
        kind, realm = r["key"]
        v = next((v for (k, n, y), v in VERIFIED.items() if k == kind and n == realm and r["a"] <= y <= r["b"]), None)
        what = f"{yr(r['a'], r['b'])}: {'nothing drawn' if kind == 'blank' else realm} on {km(r['peak'])} km² CHGIS land"
        w(f"| {i} | {what} | {v[0] if v else 'not checked'} | {v[1] if v else '—'} |")
    w("")
    w("### 3b. The atlas draws a Chinese realm; CHGIS has no prefecture there that year (frontier; ranked lower)")
    w("")
    w("Inside the CHGIS footprint only. Often a frontier the dynasty claimed or garrisoned without prefectures, a "
      "region lost and later regained, or a border drawn too far out.")
    w("")
    dis_table(frontier, args.top)
    w("### 3c. Atlas Chinese land outside the CHGIS footprint (largest runs)")
    w("")
    w("Not ranked as disagreements: protectorates, tributaries and steppe, or regions CHGIS V6 has not compiled for "
      "the period.")
    w("")
    w("| # | Years (samples) | Peak km² (year) | Atlas realm | Regions (share of area) |")
    w("|---|---|---|---|---|")
    for i, r in enumerate(outside_rows[:25], 1):
        w(f"| {i} | {yr(r['a'], r['b'])} ({r['n']}) | {km(r['peak'])} ({ystr(r['peak_y'])}) | {r['key'][1]} | {regions(r)} |")
    w("")
    w("## 4. Transition years")
    w("")
    w("For each year the atlas starts or ends a Chinese realm (as drawn near China), the CHGIS prefectures inside the "
      "realm that year are tested for turnover: the share of their area where a prefecture record begins (is created, "
      "renamed or re-bounded) in each year within 20 years of the switch. A new regime usually renames and redraws "
      "prefectures within a year or two, so a burst of turnover a few years away from the atlas year suggests the atlas "
      "switches at a different time from CHGIS. Reforms inside a dynasty also cause bursts (Sui 607, Tang 742 and 758, "
      "Ming 1376), and some dynasties kept their predecessor's prefectures (Qing 1644), so this is a pointer, not a "
      "verdict. *Nearest burst*: the closest year with ≥ 20% turnover. *Flag*: that burst is 3 or more years from the "
      "atlas switch and turnover within a year of the switch is under 10%.")
    w("")
    w("| Realm | Atlas | Conventional | CHGIS km² inside | Nearest burst ≥ 20% | Largest burst | Turnover at atlas year ±1 | Flag |")
    w("|---|---|---|---|---|---|---|---|")
    untested = []
    for r in trans_rows:
        conv = r.get("conv")
        conv_txt = "—" if not conv else (ystr(conv[0]) if r["kind"] == "starts" else ystr(conv[1]))
        atl = f"starts {ystr(r['y'])}" if r["kind"] == "starts" else f"last drawn {ystr(r['y'])}"
        if "big" not in r:
            untested.append(f"{r['name']} ({atl})"); continue
        near = f"{ystr(r['near'])} ({r['near_share'] * 100:.0f}%)" if r["near"] is not None else "none"
        w(f"| {r['name']} | {atl} | {conv_txt} | {km(r['cin'])} | {near} | {ystr(r['big'])} ({r['big_share'] * 100:.0f}%) | "
          f"{r['at_ref'] * 100:.0f}% | {'**yes**' if r['flag'] else ''} |")
    w("")
    if untested:
        w(f"Not tested (under 20,000 km² of CHGIS land inside, mostly northern states before the Song, where V6 has "
          f"little coverage): {'; '.join(untested)}.")
        w("")
    w("## Limits")
    w("")
    w("- CHGIS V6 maps prefectures only: protectorates (the Western Regions, Annam under the Tang), military "
      "commanderies outside the prefecture system, tributaries and steppe confederations are outside it by design, "
      "which is why the atlas's frontier area is ranked low.")
    w("- V6 does not cover every region in every period; the footprint rule hides regions it has not compiled, but it "
      "cannot tell a region compiled late from one first administered late, nor a gap in compilation from a real loss.")
    w("- CHGIS carries no dynasty attribute, so it cannot split land between states in periods of division; section 2 "
      "reports per atlas state instead.")
    w(f"- The {args.res}° grid misses prefectures and islands smaller than a few cells.")
    w("- Turnover bursts mark administrative change, not conquest; reforms (Sui 583 and 607, Tang 742 and 758, Yuan "
      "1277–1290s, Qing 1724–1735) also show up.")
    w("")
    w(f"Citation: {CITATION}")
    w("")
    open(OUT, "w").write("\n".join(L))
    print("wrote", os.path.relpath(OUT, ROOT), f"({len(problems)} problem runs, {len(frontier)} frontier runs, "
          f"{sum(1 for r in trans_rows if r.get('flag'))} flagged transitions) in {time.time() - t0:.0f}s")


if __name__ == "__main__":
    main()
