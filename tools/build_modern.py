#!/usr/bin/env python3
"""Borders from 1992 to today from Natural Earth 1:10m (public domain), in place of Cliopatria's rows for those years.

Cliopatria's rows for recent decades carry the same drawing errors as its rows for 2024 (missing small states, stray
pieces, borders several km off, outdated names), on the maps readers know best and can check. This step drops every
Cliopatria row from FROM (1992, the first year after the Soviet Union's end) on and draws those years from Natural
Earth's present-day countries instead. The border changes since then are made by assigning Natural Earth's pieces to
the state that held them in each year (HELD_BY): Czechoslovakia to 1992, Eritrea in Ethiopia to 1992, Hong Kong
British to 1996, and so on. History before FROM is not touched (rows that run past it are cut at FROM - 1).

Disputed places follow Natural Earth's default view (Crimea with Russia from 2014; Kosovo, Northern Cyprus,
Somaliland, Taiwan, Palestine and Western Sahara east of the berm drawn on their own; Abkhazia, South Ossetia,
Transnistria and Nagorno-Karabakh inside the states they belong to). The dashed outlines of public/data/disputed.json
(tools/disputed.py) mark them all.

Input : ne_10m_admin_0_countries.geojson (github.com/nvkelso/natural-earth-vector, geojson/)
Output: public/data/clio/<FROM>.json  the rows FROM..PRESENT, a chunk of their own (later chunks are removed)
        public/data/clio/<c>.json     earlier chunks: Cliopatria rows from FROM on dropped, rows running past it cut
        public/data/clio/index.json   timelines, new realms, chunk list, "range" end = PRESENT
Run after build_clio.py (it rewrites the chunks and the index): python3 -I tools/build_modern.py <ne_10m_admin_0_countries.geojson>
Then rebuild what reads the chunks: python3 -I tools/placeindex.py
"""
import collections
import glob
import json
import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from build import densify, dp, inside, orient, label_point  # noqa: E402  (shared geometry helpers)

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public", "data", "clio")
FROM = 1992      # first year drawn from Natural Earth: the first year after the Soviet Union, as Cliopatria counts it
PRESENT = 2026   # the map's last year: raise it each January and rebuild
EPS = 0.01       # degrees (~1 km) along borders between states: recent maps are the ones readers zoom into and check
EPS_COAST = 0.03 # degrees (~3 km) along coasts, as in build_clio.py: most points are coastline, and it decides file size
TOL = 0.005      # degrees: how far a drawn edge (a great-circle arc) may stray from the straight lon/lat line
MIN_DIAG = 0.02  # islands smaller than this (~2 km) are dropped, unless they are among a state's KEEP_TOP largest
KEEP_TOP = 12    # or the state is smaller than SMALL km² (an atoll nation is nothing but such islands)
SMALL = 2000

# Natural Earth ADM0_A3 (and the atlas's own row ids) -> the atlas's name for the state. Cliopatria's name is kept
# wherever it is a correct current name, so realm pages, colours and links stay as they were. A state keeps one name
# for all of FROM..PRESENT (one page per country) unless DATED_NAMES says otherwise.
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
    "LBR": "Republic of Liberia", "LBY": "State of Libya", "LIE": "Principality of Liechtenstein", "LTU": "Republic of Lithuania",
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
    "SMR": "Republic of San Marino", "SAU": "Kingdom of Saudi Arabia", "SEN": "Republic of Senegal", "SYC": "Seychelles",
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
    # rows that are not one Natural Earth country
    "BOT": "British Overseas Territories", "BCD": "British Crown Dependencies",
    "CSK": "Czechoslovakia", "SCG": "Serbia-Montenegro",
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
    "CRM": "RUS",  # Crimea (split out of Natural Earth's Russia below): held by Russia since 2014
}
# Border changes since FROM: (piece, last year, holder until then). A piece is held by its PART_OF row (or is its own
# row) after the last year. Years are those in which the change took effect; one in late December counts from the next.
HELD_BY = [
    ("CZE", 1992, "CSK"), ("SVK", 1992, "CSK"),  # Czechoslovakia dissolved on 1 January 1993
    ("ERI", 1992, "ETH"),                        # Eritrea independent 24 May 1993 (de facto from 1991)
    ("KOS", 1998, "SCG"),                        # under UN administration from June 1999, independent 17 February 2008
    ("SRB", 2005, "SCG"), ("MNE", 2005, "SCG"),  # Montenegro independent 3 June 2006
    ("PLW", 1993, "USA"),                        # Palau independent 1 October 1994 (US trust territory before)
    ("HKG", 1996, "BOT"),                        # Hong Kong to China 1 July 1997
    ("MAC", 1999, "PRT"),                        # Macau to China 20 December 1999
    ("TLS", 1999, "IDN"),                        # Indonesia left East Timor in October 1999; independent 20 May 2002
    ("SDS", 2010, "SDN"),                        # South Sudan independent 9 July 2011
    ("CRM", 2013, "UKR"),                        # Crimea annexed by Russia in March 2014
]
# (row, last year, name until then): names of the time where a state was renamed and its old name is the one known.
DATED_NAMES = [("COD", 1996, "Zaire")]  # Zaire became the Democratic Republic of the Congo on 17 May 1997
# Composite (group) key of a row, as Cliopatria had it; (name, last year, key until then) for keys that changed.
KEYS = {"Russian Federation": "(Russian Federation)", "Netherlands": "(Netherlands)",
        "United Kingdom": "(Commonwealth of Nations)", "British Overseas Territories": "(Commonwealth of Nations)",
        "British Crown Dependencies": "(Commonwealth of Nations)"}
DATED_KEYS = [("United Kingdom", 1997, "(British Empire)"),  # the British Empire story ends with Hong Kong in 1997
              ("British Overseas Territories", 1997, "(British Empire)")]
# Not drawn as any state: Antarctica, reefs and banks without a settled holder, the UN buffer zone in Cyprus, unclaimed
# Bir Tawil, and the stretch of the Chile-Argentina border in the Southern Patagonian Ice Field that is not yet defined.
SKIP = {"ATA", "BJN", "SER", "SCR", "PGA", "CNM", "BRT", "SPI"}
# Cliopatria names drawn in FROM..2024 that are not drawn any more, and why.
REPLACED = {
    "Communist Cuba": "Cuba", "Communist Laos": "Laos", "Federated Republic of Germany": "Germany",
    "Former Yugoslav Republic of Macedonia": "North Macedonia", "People's Republic of Angola": "Angola (renamed 1992)",
    "Éire": "Ireland", "Union of Myanmar": "Myanmar", "Kingdom of Great Britain": "United Kingdom",
    "Mali Federation": "Republic of Mali", "Saint Kitts": "Saint Kitts and Nevis (the shape was Saint Croix)",
    "Saint Vincent": "Saint Vincent and the Grenadines", "Iraqi Republic": "Republic of Iraq",
    "Libyan Arab Republic": "State of Libya", "Estado Novo": "Portugal (the Estado Novo ended in 1974)",
    "Taliban": "Afghanistan", "Mujahideen": "Afghanistan and Syria", "Chechen Republic": "Russian Federation",
    "Gaza/Hamas": "Palestine", "Netherlands Antilles": "Netherlands",
    "Russian-occupied territories": "Republic of Moldova (Transnistria) and Georgia",
    "British Colonial Empire": "British Overseas Territories, and China for Hong Kong from 1997",
    "People's Republic of Kampuchea": "Kingdom of Cambodia",
}
# Realm-page links for names the index does not have yet (Wikipedia article title, Wikidata id).
NEW_REALMS = {
    "Angola": ("Angola", "Q916"), "Cuba": ("Cuba", "Q241"), "Germany": ("Germany", "Q183"),
    "Ireland": ("Republic of Ireland", "Q27"), "Laos": ("Laos", "Q819"), "Republic of Mali": ("Mali", "Q912"),
    "Myanmar": ("Myanmar", "Q836"), "North Macedonia": ("North Macedonia", "Q221"),
    "United Kingdom": ("United Kingdom", "Q145"), "Saint Kitts and Nevis": ("Saint Kitts and Nevis", "Q763"),
    "Saint Vincent and the Grenadines": ("Saint Vincent and the Grenadines", "Q757"), "Comoros": ("Comoros", "Q970"),
    "Palestine": ("State of Palestine", "Q219060"), "Kiribati": ("Kiribati", "Q710"),
    "Principality of Liechtenstein": ("Liechtenstein", "Q347"), "Maldives": ("Maldives", "Q826"),
    "Marshall Islands": ("Marshall Islands", "Q709"), "Nauru": ("Nauru", "Q697"), "Samoa": ("Samoa", "Q683"),
    "Republic of San Marino": ("San Marino", "Q238"), "Somaliland": ("Somaliland", "Q34754"), "Tonga": ("Tonga", "Q678"),
    "Tuvalu": ("Tuvalu", "Q672"), "Vatican City": ("Vatican City", "Q237"), "Western Sahara": ("Western Sahara", "Q6250"),
    "British Crown Dependencies": ("Crown Dependencies", ""), "Republic of Iraq": ("Iraq", "Q796"),
    "State of Libya": ("Libya", "Q1016"),
}
# Cliopatria gives these realms another country's Wikidata id.
WD_FIX = {"Guinea": "Q1006", "Republic of China": "Q865", "Republic of Korea": "Q884", "Republic of the Congo": "Q971",
          "Slovakia": "Q214", "Czechoslovakia": "Q33946"}


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
    """Merge polygons that share a border (Hong Kong with China, Eritrea with Ethiopia): an edge walked in both
    directions is an inner line and goes; what is left is stitched back into rings."""
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
    """r: open ring. Cut it where the set of pieces sharing the border changes, simplify each stretch on its own.
    The cuts come from Natural Earth's pieces, not from the rows, so a border is cut at the same points whichever
    pieces are merged in a given year, and the merged rows of different years still share their borders exactly."""
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


def finish(ring):
    """Closed, simplified ring -> densified, rounded, without repeats; None if nothing is left of it."""
    dec = 4 if diag(ring) < 0.05 else 3
    out = []
    for a, b in zip(ring, ring[1:]):
        for p in [a] + densify(a, b, TOL):
            q = [round(p[0], dec), round(p[1], dec)]
            if not out or q != out[-1]:
                out.append(q)
    while len(out) > 1 and out[0] == out[-1]:
        out.pop()
    if len(out) < 3 or abs(signed_area(out)) < 1e-9:
        return None
    return out + [out[0]]


def dated(table, ident, y, default):
    """Value from a [(ident, last year, value)] table for year y, else default."""
    best = None
    for i, last, v in table:
        if i == ident and y <= last and (best is None or last < best[0]):
            best = (last, v)
    return best[1] if best else default


def load_pieces(path):
    """Natural Earth countries -> {piece id: {"polys": [[ring, ...], ...], "label": [x, y] or None}}, rings open,
    outer rings counter-clockwise. Crimea is split out of Russia as its own piece (CRM)."""
    pieces = {}
    for f in json.load(open(path))["features"]:
        p = f["properties"]
        a3 = p["ADM0_A3"]
        if a3 in SKIP:
            continue
        if PART_OF.get(a3, a3) not in NAMES:
            sys.exit(f"Natural Earth feature {a3} ({p['ADMIN']}) is not mapped: add it to NAMES, PART_OF or SKIP")
        g = f["geometry"]
        polys = []
        for poly in g["coordinates"] if g["type"] == "MultiPolygon" else [g["coordinates"]]:
            rings = []
            for k, r in enumerate(poly):
                r = [(x, y) for x, y, *_ in r[:-1]]
                if (signed_area(r) > 0) != (k == 0):  # outer rings counter-clockwise, holes clockwise
                    r.reverse()
                rings.append(r)
            polys.append(rings)
        label = [round(p["LABEL_X"], 2), round(p["LABEL_Y"], 2)] if p.get("LABEL_X") is not None else None
        pieces[a3] = {"polys": polys, "label": label}
    crimea = [q for q in pieces["RUS"]["polys"]
              if 32 < min(x for x, _ in q[0]) and max(x for x, _ in q[0]) < 37 and 44 < min(y for _, y in q[0]) and max(y for _, y in q[0]) < 47]
    if len(crimea) != 1:
        sys.exit(f"expected one Crimea polygon in Natural Earth's Russia, found {len(crimea)}")
    pieces["RUS"]["polys"].remove(crimea[0])
    pieces["CRM"] = {"polys": crimea, "label": None}
    return pieces


def piece_owners(pieces):
    """Point -> the set of pieces it belongs to (decides where a border stretch starts and ends)."""
    sets = collections.defaultdict(set)
    for pid, pc in pieces.items():
        for poly in pc["polys"]:
            for r in poly:
                for pt in r:
                    sets[pt].add(pid)
    return {pt: frozenset(s) for pt, s in sets.items()}


def make_shape(pieces, ps, own, home=None):
    """The pieces ps merged, simplified, densified and rounded: {"coords": MultiPolygon, "area": km², "label": [x, y]}."""
    raw = [poly for p in sorted(ps) for poly in pieces[p]["polys"]]
    polys = dissolve(raw) if len(ps) > 1 else raw
    area = max(1, round(sum(ring_km2(p[0]) - sum(ring_km2(h) for h in p[1:]) for p in polys)))
    polys = sorted(polys, key=lambda p: -abs(signed_area(p[0])))
    out = []
    for i, poly in enumerate(polys):
        alone = all(len(own[pt]) == 1 for pt in poly[0])
        if i >= KEEP_TOP and alone and diag(poly[0]) < MIN_DIAG and area >= SMALL:
            continue  # a speck of an island
        rings = [finish(simplify_ring(r, own)) for r in poly]
        if rings[0] is None:
            continue
        out.append([orient(r, k == 0) for k, r in enumerate(rings) if r])
    if not out:
        sys.exit(f"nothing left of {sorted(ps)}")
    label = pieces[home]["label"] if home else None
    return {"coords": out, "area": area, "label": label or label_point(out[0])}


def holder(piece, y):
    return dated(HELD_BY, piece, y, PART_OF.get(piece, piece))


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    pieces = load_pieces(sys.argv[1])
    for p, last, h in HELD_BY:
        if p not in pieces or h not in NAMES:
            sys.exit(f"HELD_BY entry {p, last, h} names an unknown piece or row")

    # 1. who holds what in each year -> runs of years with the same pieces, name and key = the rows
    runs = []  # [row id, name, key, frozenset(pieces), from, to]
    open_runs = {}
    for y in range(FROM, PRESENT + 1):
        held = collections.defaultdict(set)
        for p in pieces:
            held[holder(p, y)].add(p)
        seen = set()
        for rid, ps in held.items():
            name = dated(DATED_NAMES, rid, y, NAMES[rid])
            key = dated(DATED_KEYS, name, y, KEYS.get(name, name))
            sig = (name, key, frozenset(ps))
            cur = open_runs.get(rid)
            if cur and cur[0] == sig and cur[1][5] == y - 1:
                cur[1][5] = y
            else:
                run = [rid, name, key, frozenset(ps), y, y]
                runs.append(run)
                open_runs[rid] = (sig, run)
            seen.add(rid)
        for rid in [r for r in open_runs if r not in seen]:
            del open_runs[rid]

    # 2. which pieces meet at each point (decides where a border stretch starts and ends)
    own = piece_owners(pieces)

    # 3. geometry of each distinct set of pieces: merged, simplified, densified, rounded
    shapes = {}
    for rid, name, key, ps, fy, ty in runs:
        if ps not in shapes:
            shapes[ps] = make_shape(pieces, ps, own, rid if rid in ps else None)
    nv = sum(len(r) for sh in shapes.values() for q in sh["coords"] for r in q)
    feats = []
    for rid, name, key, ps, fy, ty in sorted(runs, key=lambda r: (r[1], r[4])):
        sh = shapes[ps]
        props = {"n": name, "f": fy, "t": ty, "a": sh["area"], "k": key, "l": sh["label"]}
        feats.append({"type": "Feature", "properties": props, "geometry": {"type": "MultiPolygon", "coordinates": sh["coords"]}})
    names = {f["properties"]["n"] for f in feats}

    # 4. the chunks: earlier chunks lose their rows from FROM on (rows running past FROM end at FROM - 1),
    #    later chunks go, and the new rows get a chunk of their own
    ipath = os.path.join(OUT, "index.json")
    idx = json.load(open(ipath))
    chunks = {c: json.load(open(os.path.join(OUT, f"{c}.json"))) for c in idx["chunks"]}
    gone_names = {f["properties"]["n"] for fc in chunks.values() for f in fc["features"] if f["properties"]["t"] >= FROM}
    unknown = sorted(n for n in gone_names - names if n not in REPLACED)
    if unknown:  # every name drawn from FROM on is either still drawn or knowingly replaced
        sys.exit(f"Cliopatria rows from {FROM} on with no row here: {unknown}: map them in NAMES or REPLACED")
    kept = sorted(c for c in idx["chunks"] if c < FROM)
    for c, fc in chunks.items():
        path = os.path.join(OUT, f"{c}.json")
        if c >= FROM:
            os.remove(path)
            continue
        out = []
        for f in fc["features"]:
            p = f["properties"]
            if p["f"] >= FROM:
                continue
            if p["t"] >= FROM:
                f = {**f, "properties": {**p, "t": FROM - 1}}
            out.append(f)
        if out != fc["features"]:
            fc["features"] = out
            with open(path, "w") as fh:
                json.dump(fc, fh, separators=(",", ":"))
    path = os.path.join(OUT, f"{FROM}.json")
    with open(path, "w") as fh:
        json.dump({"type": "FeatureCollection", "features": feats}, fh, separators=(",", ":"))
    idx["chunks"] = kept + [FROM]

    # 5. the index: timelines end at FROM - 1, then this step's rows; composite groups get the sum of their members
    R = idx["realms"]
    for r in R.values():
        r["tl"] = [[a, min(b, FROM - 1), ar] for a, b, ar in r["tl"] if a < FROM]
    group = collections.defaultdict(lambda: collections.Counter())  # key -> year -> km²
    for f in feats:
        p = f["properties"]
        r = R.get(p["n"])
        if r is None:
            wiki, wd = NEW_REALMS[p["n"]]
            r = R[p["n"]] = {"wiki": wiki, "tl": []}
            if wd:
                r["wd"] = wd
        if p["k"] != p["n"]:
            for y in range(p["f"], p["t"] + 1):
                group[p["k"]][y] += p["a"]
            if p["k"] not in r.setdefault("memberOf", []):
                r["memberOf"].append(p["k"])
        r["tl"].append([p["f"], p["t"], p["a"]])
    for k, by_year in group.items():
        rows = []
        for y in sorted(by_year):
            if rows and rows[-1][1] == y - 1 and rows[-1][2] == by_year[y]:
                rows[-1][1] = y
            else:
                rows.append([y, y, by_year[y]])
        R.setdefault(k, {"tl": [], "group": True})["tl"] += rows
    for r in R.values():
        r["tl"].sort()
    for n, wd in WD_FIX.items():
        R[n]["wd"] = wd
    dropped = sorted(n for n, r in R.items() if not r["tl"])
    for n in dropped:
        del R[n]
    idx["range"][1] = PRESENT
    with open(ipath, "w") as fh:
        json.dump(idx, fh, ensure_ascii=False, separators=(",", ":"))
    print(f"{len(feats)} rows {FROM}-{PRESENT} ({len(shapes)} distinct shapes, {nv} points), "
          f"chunk {os.path.getsize(path) / 1e3:.0f} KB, {len(R)} realms" + (f"; realms left with no rows: {dropped}" if dropped else ""))


if __name__ == "__main__":
    main()
