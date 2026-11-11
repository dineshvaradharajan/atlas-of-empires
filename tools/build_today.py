#!/usr/bin/env python3
"""Present-day borders from Natural Earth 1:10m (public domain), in place of Cliopatria's rows for 2024.

Cliopatria ends with one row per state for 2024. Those rows carry the same drawing errors as its historical rows
(missing small states, stray pieces, borders several km off, outdated names), which matter most on the one map every
reader can check. This step drops them and writes one row per present-day state from Natural Earth instead, running
from FROM (2024) to PRESENT. History before FROM is not touched.

Disputed places follow Natural Earth's default (de facto) view: who administers a place draws it. The dashed outlines
of public/data/disputed.json (tools/disputed.py) mark those places on top.

Input : ne_10m_admin_0_countries.geojson (github.com/nvkelso/natural-earth-vector, geojson/)
Output: public/data/clio/2024.json  the present-day rows, a chunk of their own (FROM..PRESENT)
        public/data/clio/2000.json  Cliopatria's rows for FROM removed
        public/data/clio/index.json timelines of the affected realms, new realms, the new chunk, "range" end = PRESENT
Run after build_clio.py (it rewrites the chunks and the index): python3 -I tools/build_today.py <ne_10m_admin_0_countries.geojson>
Then rebuild what reads the chunks: python3 -I tools/placeindex.py
"""
import collections
import json
import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from build import dp, inside, orient, label_point  # noqa: E402  (shared geometry helpers)

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public", "data", "clio")
FROM = 2024      # first year drawn from Natural Earth (Cliopatria's last year)
PRESENT = 2026   # the map's last year: raise it each January and rebuild
EPS = 0.01       # degrees (~1 km) along borders between states: today's map is the one readers zoom into and check
EPS_COAST = 0.03 # degrees (~3 km) along coasts, as in build_clio.py: most points are coastline, and it decides file size
TOL = 0.005      # degrees: how far a drawn edge (a great-circle arc) may stray from the straight lon/lat line
MIN_DIAG = 0.02  # islands smaller than this (~2 km) are dropped, unless they are among a state's KEEP_TOP largest
KEEP_TOP = 12    # or the state is smaller than SMALL km² (an atoll nation is nothing but such islands)
SMALL = 2000

# Natural Earth ADM0_A3 -> the atlas's name for the state. Cliopatria's 2024 name is kept wherever it is a correct
# current name, so realm pages, colours and links stay as they were; see RENAMED for the ones that were not.
NAMES = {
    "AFG": "Afghanistan", "ALB": "Republic of Albania", "DZA": "People's Democratic Republic of Algeria",
    "AND": "Principality of Andorra", "AGO": "Angola", "ATG": "Antigua and Barbuda", "ARG": "Argentine Republic",
    "ARM": "Republic of Armenia", "AUS": "Commonwealth of Australia", "AUT": "Second Republic of Austria",
    "AZE": "Republic of Azerbaijan", "BHR": "Kingdom of Bahrain", "BGD": "People's Republic of Bangladesh",
    "BRB": "Barbados", "BLR": "Republic of Belarus", "BEL": "Kingdom of Belgium", "BLZ": "Belize",
    "BEN": "Republic of Benin", "BTN": "Kingdom of Bhutan", "BOL": "Bolivia", "BIH": "Bosnia and Herzegovina",
    "BWA": "Republic of Botswana", "BRA": "Republic of Brazil", "BRN": "Sultanate of Brunei",
    "BGR": "Republic of Bulgaria", "BFA": "Burkina Faso", "BDI": "Republic of Burundi", "CPV": "Republic of Cabo Verde",
    "KHM": "Kingdom of Cambodia", "CMR": "Republic of Cameroon", "CAN": "Canada", "CAF": "Central African Republic",
    "TCD": "Republic of Chad", "CHL": "Republic of Chile", "CHN": "People's Republic of China",
    "COL": "Republic of Colombia", "COM": "Comoros", "CRI": "Republic of Costa Rica", "HRV": "Republic of Croatia",
    "CUB": "Cuba", "CYP": "Republic of Cyprus", "CZE": "Czech Republic", "COD": "Democratic Republic of the Congo",
    "DNK": "Denmark", "DJI": "Republic of Djibouti", "DMA": "Commonwealth of Dominica", "DOM": "Dominican Republic",
    "TLS": "East Timor", "ECU": "Republic of Ecuador", "EGY": "Arab Republic of Egypt", "SLV": "Republic of El Salvador",
    "GNQ": "Equatorial Guinea", "ERI": "State of Eritrea", "EST": "Republic of Estonia", "ETH": "Ethiopia",
    "FSM": "Micronesia", "FJI": "Republic of Fiji", "FIN": "Republic of Finland", "FRA": "French Fifth Republic",
    "GAB": "Gabon", "GMB": "Republic of The Gambia", "GEO": "Georgia", "DEU": "Germany", "GHA": "Ghana",
    "GRC": "Third Hellenic Republic", "GRD": "Grenada", "GTM": "Guatemala", "GIN": "Guinea",
    "GNB": "Republic of Guinea-Bissau", "GUY": "Guyana", "HTI": "Republic of Haiti", "HND": "Honduras", "HUN": "Hungary",
    "ISL": "Republic of Iceland", "IND": "Republic of India", "IDN": "Republic of Indonesia",
    "IRN": "Islamic Republic of Iran", "IRQ": "Republic of Iraq", "IRL": "Ireland", "ISR": "State of Israel",
    "PSX": "Palestine", "ITA": "Republic of Italy", "CIV": "Republic of Côte d'Ivoire", "JAM": "Jamaica", "JPN": "Japan",
    "JOR": "Kingdom of Jordan", "KAZ": "Kazakhstan", "KEN": "Republic of Kenya", "KIR": "Kiribati", "KOS": "Kosovo",
    "KWT": "Kuwait", "KGZ": "Kyrgyzstan", "LAO": "Laos", "LVA": "Republic of Latvia", "LBN": "Lebanon", "LSO": "Lesotho",
    "LBR": "Republic of Liberia", "LBY": "State of Libya", "LIE": "Liechtenstein", "LTU": "Republic of Lithuania",
    "LUX": "Luxembourg", "MDG": "Madagascar", "MWI": "Malawi", "MYS": "Malaysia", "MDV": "Maldives",
    "MLI": "Republic of Mali", "MLT": "Malta", "MHL": "Marshall Islands", "MRT": "Mauritania", "MUS": "Mauritius",
    "MEX": "Mexico", "MDA": "Republic of Moldova", "MCO": "Principality of Monaco", "MNG": "Mongolia",
    "MNE": "Montenegro", "MAR": "Morocco", "MOZ": "Mozambique", "MMR": "Myanmar", "NAM": "Namibia", "NRU": "Nauru",
    "NPL": "Nepal", "NLD": "Netherlands", "NZL": "New Zealand", "NIC": "Republic of Nicaragua",
    "NER": "Republic of the Niger", "NGA": "Federal Republic of Nigeria", "PRK": "Democratic People's Republic of Korea",
    "MKD": "North Macedonia", "CYN": "Turkish Republic of Northern Cyprus", "NOR": "Kingdom of Norway",
    "OMN": "Sultanate of Oman", "PAK": "Islamic Republic of Pakistan", "PLW": "Palau", "PAN": "Republic of Panama",
    "PNG": "Papua New Guinea", "PRY": "Paraguay", "PER": "Republic of Peru", "PHL": "Republic of the Philippines",
    "POL": "Republic of Poland", "PRT": "Portugal", "QAT": "State of Qatar", "SRB": "Republic of Serbia",
    "COG": "Republic of the Congo", "ROU": "Romania", "RUS": "Russian Federation", "RWA": "Republic of Rwanda",
    "KNA": "Saint Kitts and Nevis", "LCA": "Saint Lucia", "VCT": "Saint Vincent and the Grenadines", "WSM": "Samoa",
    "SMR": "San Marino", "SAU": "Kingdom of Saudi Arabia", "SEN": "Republic of Senegal", "SYC": "Seychelles",
    "SLE": "Sierra Leone", "SGP": "Republic of Singapore", "SVK": "Slovakia", "SVN": "Republic of Slovenia",
    "SLB": "Solomon Islands", "SOM": "Federal Republic of Somalia", "SOL": "Somaliland", "ZAF": "South Africa",
    "KOR": "Republic of Korea", "SDS": "South Sudan", "ESP": "Kingdom of Spain", "LKA": "Sri Lanka",
    "SDN": "Republic of Sudan", "SUR": "Republic of Suriname", "SWE": "Kingdom of Sweden", "CHE": "Swiss Confederation",
    "SYR": "Syria", "STP": "São Tomé and Príncipe", "TWN": "Republic of China", "TJK": "Republic of Tajikistan",
    "THA": "Kingdom of Thailand", "BHS": "Commonwealth of The Bahamas", "TGO": "Togo", "TON": "Tonga",
    "TTO": "Republic of Trinidad and Tobago", "TUN": "Republic of Tunisia", "TUR": "Republic of Turkey",
    "TKM": "Turkmenistan", "TUV": "Tuvalu", "UGA": "Republic of Uganda", "UKR": "Ukraine", "ARE": "United Arab Emirates",
    "GBR": "United Kingdom", "TZA": "Tanzania", "USA": "United States of America", "URY": "Oriental Republic of Uruguay",
    "UZB": "Republic of Uzbekistan", "VUT": "Vanuatu", "VAT": "Vatican City", "VEN": "Venezuela",
    "VNM": "Socialist Republic of Vietnam", "SAH": "Western Sahara", "YEM": "Republic of Yemen", "ZMB": "Zambia",
    "ZWE": "Republic of Zimbabwe", "SWZ": "Eswatini",
    # rows that gather dependencies (not Natural Earth codes)
    "BOT": "British Overseas Territories", "BCD": "British Crown Dependencies",
}
# Dependencies, leases and special regions are drawn with the state that holds them, as Cliopatria did
# (Greenland with Denmark, Puerto Rico with the United States); British territories keep their own two rows.
PART_OF = {
    "ATC": "AUS", "CSI": "AUS", "HMD": "AUS", "IOA": "AUS", "NFK": "AUS",
    "HKG": "CHN", "MAC": "CHN", "USG": "CUB", "FRO": "DNK", "GRL": "DNK", "ALD": "FIN",
    "CLP": "FRA", "PYF": "FRA", "ATF": "FRA", "NCL": "FRA", "BLM": "FRA", "MAF": "FRA", "SPM": "FRA", "WLF": "FRA",
    "KAB": "KAZ", "ABW": "NLD", "CUW": "NLD", "SXM": "NLD", "COK": "NZL", "NIU": "NZL",
    "WSB": "BOT", "ESB": "BOT", "AIA": "BOT", "BMU": "BOT", "IOT": "BOT", "VGB": "BOT", "CYM": "BOT", "FLK": "BOT",
    "GIB": "BOT", "MSR": "BOT", "PCN": "BOT", "SHN": "BOT", "SGS": "BOT", "TCA": "BOT",
    "GGY": "BCD", "IMN": "BCD", "JEY": "BCD",
    "ASM": "USA", "GUM": "USA", "MNP": "USA", "PRI": "USA", "UMI": "USA", "VIR": "USA",
    "KAS": "IND",  # Siachen Glacier: held by India since 1984
    "BRI": "BRA",  # Brazilian Island: administered by Brazil
}
# Not drawn as any state: Antarctica, reefs and banks without a settled holder, the UN buffer zone in Cyprus, unclaimed
# Bir Tawil, and the stretch of the Chile-Argentina border in the Southern Patagonian Ice Field that is not yet defined.
SKIP = {"ATA", "BJN", "SER", "SCR", "PGA", "CNM", "BRT", "SPI"}
# Composite (group) key of a row, as Cliopatria had it in 2024.
KEYS = {"Russian Federation": "(Russian Federation)", "Netherlands": "(Netherlands)",
        "United Kingdom": "(Commonwealth of Nations)", "British Overseas Territories": "(Commonwealth of Nations)",
        "British Crown Dependencies": "(Commonwealth of Nations)"}
# Cliopatria's 2024 names that were wrong or out of date in 2024 -> the name used from FROM on (None = no such state;
# the land is drawn under the state Natural Earth gives it to).
RENAMED = {
    "Communist Cuba": "Cuba", "Communist Laos": "Laos", "Federated Republic of Germany": "Germany",
    "Former Yugoslav Republic of Macedonia": "North Macedonia", "People's Republic of Angola": "Angola",
    "Éire": "Ireland", "Union of Myanmar": "Myanmar", "Kingdom of Great Britain": "United Kingdom",
    "Mali Federation": "Republic of Mali", "Saint Kitts": "Saint Kitts and Nevis",
    "Saint Vincent": "Saint Vincent and the Grenadines",
    "Estado Novo": None, "Gaza/Hamas": None, "Mujahideen": None, "Netherlands Antilles": None,
    "Russian-occupied territories": None,
}
# Realm-page links for names the index does not have yet (Wikipedia article title, Wikidata id).
NEW_REALMS = {
    "Angola": ("Angola", "Q916"), "Cuba": ("Cuba", "Q241"), "Germany": ("Germany", "Q183"),
    "Ireland": ("Republic of Ireland", "Q27"), "Laos": ("Laos", "Q819"), "Republic of Mali": ("Mali", "Q912"),
    "Myanmar": ("Myanmar", "Q836"), "North Macedonia": ("North Macedonia", "Q221"),
    "United Kingdom": ("United Kingdom", "Q145"), "Saint Kitts and Nevis": ("Saint Kitts and Nevis", "Q763"),
    "Saint Vincent and the Grenadines": ("Saint Vincent and the Grenadines", "Q757"), "Comoros": ("Comoros", "Q970"),
    "Palestine": ("State of Palestine", "Q219060"), "Kiribati": ("Kiribati", "Q710"),
    "Liechtenstein": ("Liechtenstein", "Q347"), "Maldives": ("Maldives", "Q826"),
    "Marshall Islands": ("Marshall Islands", "Q709"), "Nauru": ("Nauru", "Q697"), "Samoa": ("Samoa", "Q683"),
    "San Marino": ("San Marino", "Q238"), "Somaliland": ("Somaliland", "Q34754"), "Tonga": ("Tonga", "Q678"),
    "Tuvalu": ("Tuvalu", "Q672"), "Vatican City": ("Vatican City", "Q237"), "Western Sahara": ("Western Sahara", "Q6250"),
    "British Crown Dependencies": ("Crown Dependencies", ""),
}
# Cliopatria gives these realms another country's Wikidata id.
WD_FIX = {"Guinea": "Q1006", "Republic of China": "Q865", "Republic of Korea": "Q884", "Republic of the Congo": "Q971"}


def signed_area(r):  # planar shoelace over an open ring; > 0 = counter-clockwise
    return sum(r[i - 1][0] * r[i][1] - r[i][0] * r[i - 1][1] for i in range(len(r))) / 2


def ring_km2(r):  # spherical area of an open ring
    a = 0.0
    for i in range(len(r)):
        (x1, y1), (x2, y2) = r[i - 1], r[i]
        a += math.radians(x2 - x1) * (2 + math.sin(math.radians(y1)) + math.sin(math.radians(y2)))
    return abs(a * 6371.0 * 6371.0 / 2)


def diag(pts):
    xs = [p[0] for p in pts]; ys = [p[1] for p in pts]
    return math.hypot(max(xs) - min(xs), max(ys) - min(ys))


def dissolve(polys):
    """Merge polygons of one row that share a border (Hong Kong with China, the Baikonur lease with Kazakhstan):
    an edge walked in both directions is an inner line and goes; what is left is stitched back into rings."""
    count = collections.Counter()
    for poly in polys:
        for r in poly:
            for i in range(len(r)):
                count[(r[i - 1], r[i])] += 1
    inner = {e for e in count if (e[1], e[0]) in count}
    if not inner:
        return polys
    keep, pool = [], []
    for poly in polys:
        if any((r[i - 1], r[i]) in inner for r in poly for i in range(len(r))):
            pool += [(r[i - 1], r[i]) for r in poly for i in range(len(r)) if (r[i - 1], r[i]) not in inner]
        else:
            keep.append(poly)
    nxt = collections.defaultdict(list)
    for a, b in pool:
        nxt[a].append(b)
    outers, holes = [], []
    for a in list(nxt):
        while nxt[a]:
            ring, cur = [a], nxt[a].pop()
            while cur != a:
                ring.append(cur)
                cur = nxt[cur].pop()
            if len(ring) >= 3:
                (outers if signed_area(ring) > 0 else holes).append(ring)
    outers.sort(key=lambda r: abs(signed_area(r)))
    merged = [[o] for o in outers]
    for h in holes:
        for poly in merged:  # smallest outer ring that contains the hole
            if inside(h[0], poly[0] + [poly[0][0]]):
                poly.append(h)
                break
    return keep + merged


def simplify_path(q, eps):
    """Douglas-Peucker with fixed ends; a path that returns to its start is done in two halves."""
    if len(q) < 4:
        return q
    if q[0] != q[-1]:
        return dp(q, eps)
    m = max(range(1, len(q) - 1), key=lambda i: (q[i][0] - q[0][0]) ** 2 + (q[i][1] - q[0][1]) ** 2)
    return dp(q[: m + 1], eps)[:-1] + dp(q[m:], eps)


def simplify_arc(pts, shared):
    """Simplify one stretch of border (shared) or coast. It is always walked in the same direction, whichever
    neighbour's ring it came from, so both neighbours get the same points and no slivers open between them."""
    if len(pts) < 4:
        return pts
    rev = (pts[0], pts[1]) > (pts[-1], pts[-2])
    q = pts[::-1] if rev else pts
    out = simplify_path(q, min(EPS if shared else EPS_COAST, diag(q) / 15))
    return out[::-1] if rev else out


def simplify_ring(r, own):
    """r: open ring. Cut it where the set of states sharing the border changes, simplify each stretch on its own."""
    n = len(r)
    o = [own[p] for p in r]
    brk = [i for i in range(n) if o[i] != o[i - 1] or o[i] != o[(i + 1) % n]]
    if not brk:  # an island, or a border shared whole (an enclave and the hole it sits in): start at the smallest point
        i0 = min(range(n), key=lambda i: r[i])
        q = r[i0:] + r[:i0] + [r[i0]]
        return simplify_arc(q, len(o[0]) > 1)
    out = []
    for a, b in zip(brk, brk[1:] + [brk[0] + n]):
        arc = [r[i % n] for i in range(a, b + 1)]
        out += simplify_arc(arc, len(arc) > 2 and len(own[arc[1]]) > 1)[:-1]
    return out + [out[0]]


def gc_mid(a, b):
    def v(p):
        lo, la = math.radians(p[0]), math.radians(p[1])
        return (math.cos(la) * math.cos(lo), math.cos(la) * math.sin(lo), math.sin(la))
    x, y, z = (s + t for s, t in zip(v(a), v(b)))
    return math.degrees(math.atan2(y, x)), math.degrees(math.atan2(z, math.hypot(x, y)))


def densify(a, b, depth=0):
    """Points to add between a and b so the great-circle arcs the app draws stay within TOL of the straight
    lon/lat line (a border along a parallel, like the 49th, would otherwise bulge toward the pole)."""
    if abs(a[0] - b[0]) < 0.5 or depth > 8:
        return []
    if a > b:
        return densify(b, a, depth)[::-1]
    m = ((a[0] + b[0]) / 2, (a[1] + b[1]) / 2)
    gx, gy = gc_mid(a, b)
    if math.hypot((gx - m[0]) * math.cos(math.radians(m[1])), gy - m[1]) <= TOL:
        return []
    return densify(a, m, depth + 1) + [m] + densify(m, b, depth + 1)


def finish(ring):
    """Closed, simplified ring -> densified, rounded, without repeats; None if nothing is left of it."""
    dec = 4 if diag(ring) < 0.05 else 3
    out = []
    for a, b in zip(ring, ring[1:]):
        for p in [a] + densify(a, b):
            q = [round(p[0], dec), round(p[1], dec)]
            if not out or q != out[-1]:
                out.append(q)
    while len(out) > 1 and out[0] == out[-1]:
        out.pop()
    if len(out) < 3 or abs(signed_area(out)) < 1e-9:
        return None
    return out + [out[0]]


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    ne = json.load(open(sys.argv[1]))["features"]

    # 1. gather Natural Earth's polygons into the atlas's rows
    rows = {}
    for f in ne:
        p = f["properties"]
        a3 = p["ADM0_A3"]
        if a3 in SKIP:
            continue
        rid = PART_OF.get(a3, a3)
        if rid not in NAMES:
            sys.exit(f"Natural Earth feature {a3} ({p['ADMIN']}) is not mapped: add it to NAMES, PART_OF or SKIP")
        row = rows.setdefault(rid, {"name": NAMES[rid], "polys": [], "label": None, "parts": 0})
        row["parts"] += 1
        if rid == a3 and p.get("LABEL_X") is not None:
            row["label"] = [round(p["LABEL_X"], 2), round(p["LABEL_Y"], 2)]
        g = f["geometry"]
        for poly in g["coordinates"] if g["type"] == "MultiPolygon" else [g["coordinates"]]:
            rings = []
            for k, r in enumerate(poly):
                r = [(x, y) for x, y, *_ in r[:-1]]
                if (signed_area(r) > 0) != (k == 0):  # outer rings counter-clockwise, holes clockwise
                    r.reverse()
                rings.append(r)
            row["polys"].append(rings)
    missing = [a for a in NAMES if a not in rows]
    if missing:
        sys.exit(f"no Natural Earth feature for {missing}")
    for row in rows.values():
        if row["parts"] > 1:
            row["polys"] = dissolve(row["polys"])
        row["area"] = max(1, round(sum(ring_km2(p[0]) - sum(ring_km2(h) for h in p[1:]) for p in row["polys"])))

    # 2. which rows meet at each point (decides where a border stretch starts and ends)
    sets = collections.defaultdict(set)
    for rid, row in rows.items():
        for poly in row["polys"]:
            for r in poly:
                for pt in r:
                    sets[pt].add(rid)
    own = {pt: frozenset(s) for pt, s in sets.items()}

    # 3. simplify, densify, round
    feats, nv = [], 0
    for rid, row in sorted(rows.items(), key=lambda kv: kv[1]["name"]):
        polys = sorted(row["polys"], key=lambda p: -abs(signed_area(p[0])))
        out = []
        for i, poly in enumerate(polys):
            alone = all(len(own[pt]) == 1 for pt in poly[0])
            if i >= KEEP_TOP and alone and diag(poly[0]) < MIN_DIAG and row["area"] >= SMALL:
                continue  # a speck of an island
            rings = [finish(simplify_ring(r, own)) for r in poly]
            if rings[0] is None:
                continue
            rings = [orient(r, k == 0) for k, r in enumerate(rings) if r]
            out.append(rings)
            nv += sum(len(r) for r in rings)
        if not out:
            sys.exit(f"nothing left of {row['name']}")
        name = row["name"]
        props = {"n": name, "f": FROM, "t": PRESENT, "a": row["area"], "k": KEYS.get(name, name),
                 "l": row["label"] or label_point(out[0])}
        feats.append({"type": "Feature", "properties": props, "geometry": {"type": "MultiPolygon", "coordinates": out}})

    # 4. the chunks: Cliopatria's last chunk loses its rows for FROM, the present-day rows get a chunk of their own
    ipath = os.path.join(OUT, "index.json")
    idx = json.load(open(ipath))
    last = max(c for c in idx["chunks"] if c < FROM)
    path = os.path.join(OUT, f"{last}.json")
    chunk = json.load(open(path))
    old = [f["properties"] for f in chunk["features"] if f["properties"]["t"] >= FROM]
    if any(p["f"] < FROM for p in old):
        sys.exit("a row starts before FROM and runs past it: " + ", ".join(p["n"] for p in old if p["f"] < FROM))
    names = {f["properties"]["n"] for f in feats}
    for p in old:  # every name Cliopatria drew in 2024 is either still drawn or knowingly replaced
        if p["f"] == p["t"] == FROM and p["n"] not in names and p["n"] not in RENAMED:
            sys.exit(f"Cliopatria's 2024 row {p['n']!r} has no present-day row: map it in NAMES or RENAMED")
    if old:
        chunk["features"] = [f for f in chunk["features"] if f["properties"]["t"] < FROM]
        with open(path, "w") as fh:
            json.dump(chunk, fh, separators=(",", ":"))
    path = os.path.join(OUT, f"{FROM}.json")
    with open(path, "w") as fh:
        json.dump({"type": "FeatureCollection", "features": feats}, fh, separators=(",", ":"))
    idx["chunks"] = sorted(set(idx["chunks"]) | {FROM})

    # 5. the index: timelines end at FROM - 1, then one row FROM..PRESENT per present-day realm
    R = idx["realms"]
    for r in R.values():
        r["tl"] = [[a, min(b, FROM - 1), ar] for a, b, ar in r["tl"] if a < FROM]
    groups = collections.Counter()
    for f in feats:
        p = f["properties"]
        r = R.get(p["n"])
        if r is None:
            wiki, wd = NEW_REALMS[p["n"]]
            r = R[p["n"]] = {"wiki": wiki, "tl": []}
            if wd:
                r["wd"] = wd
        if p["k"] != p["n"]:
            groups[p["k"]] += p["a"]
            if p["k"] not in r.setdefault("memberOf", []):
                r["memberOf"].append(p["k"])
        r["tl"].append([FROM, PRESENT, p["a"]])
    for k, a in groups.items():
        R[k]["tl"].append([FROM, PRESENT, a])
    for n, wd in WD_FIX.items():
        R[n]["wd"] = wd
    gone = [n for n, r in R.items() if not r["tl"]]
    for n in gone:
        del R[n]
    idx["range"][1] = PRESENT
    with open(ipath, "w") as fh:
        json.dump(idx, fh, ensure_ascii=False, separators=(",", ":"))
    print(f"{len(old)} Cliopatria rows dropped, {len(feats)} rows {FROM}-{PRESENT}, {nv} points, "
          f"chunk {os.path.getsize(path) / 1e3:.0f} KB, {len(R)} realms" + (f", dropped {gone}" if gone else ""))


if __name__ == "__main__":
    main()
