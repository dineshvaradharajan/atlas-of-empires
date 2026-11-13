#!/usr/bin/env python3
"""Cross-check the atlas's state borders for 1886-1991 against CShapes 2.0 (read-only; writes a report, changes no data).

CShapes 2.0 (ETH Zurich, International Conflict Research) maps independent states and dependent territories with dated
boundary changes from 1886 to 2019, coded on the Gleditsch & Ward (GW) list of states. This script compares it with what
the atlas draws in the same years:

  atlas    public/data/clio/*.json (Cliopatria rows with content/borders/patches.json already applied by
           tools/build_patches.py), with every correction in content/corrections.json (clip, hide, asPeople, crop, cut,
           relabel) and the reconstruction layers in public/data/supplements.json, read the way tools/placeindex.py does
  CShapes  data/cshapes/cshapes_2_gw.topojson (the GW version with dependencies, from the CShapes R package
           cshapes_2.0.tar.gz, inst/extdata/cshapes_2_gw.topojson.xz, unpacked; the plain CShapes-2.0.geojson has the
           same 710 shapes but no status/owner columns)

Both are rasterised onto one grid (default 0.25 degrees, cell centres, even-odd rule; cell area from the latitude) and
compared year by year (default every year 1886-1991; a state counts in year Y if CShapes has it on 1 July of Y, the atlas
if f <= Y <= t). Each atlas realm is linked to a GW code by name (the LINKS table below, written by hand: matching by
area alone would hide exactly the disagreements this check is for). A dependency counts for its owner, so the atlas's
"British Africa" agrees with CShapes's Nigeria colony. Reported, ranked:

  1. territory   areas held by a different state in the two datasets (or blank in one), merged into year runs
  2. size        states whose total area (with dependencies) differs by more than a threshold
  3. dates       years a GW state is independent in CShapes but not drawn as a state in the atlas, or the reverse
  4. presence    atlas realms with no CShapes counterpart, and GW states the atlas never draws
  5. links       atlas realms that lie mostly outside the GW state they are linked to (a wrong link or a wrong border)

Output: content/factcheck/cshapes-check.md
Run:    python3 -I tools/check_cshapes.py [--step 5] [--res 0.25] [--min-area 10000]

Source: Schvitz, Guy, Luc Girardin, Seraina Rüegger, Nils B. Weidmann, Lars-Erik Cederman and Kristian Skrede Gleditsch.
2022. "Mapping the International System, 1886-2019: The CShapes 2.0 Dataset." Journal of Conflict Resolution 66(1):
144-161. https://doi.org/10.1177/00220027211013563 . Data: https://icr.ethz.ch/data/cshapes/ , licence CC BY-NC-SA 4.0.
The raw files stay in data/cshapes/ (gitignored); the report carries only derived figures and names, with this credit.
Fetch:  mkdir -p data/cshapes && cd data/cshapes
        curl -LO https://icr.ethz.ch/data/cshapes/cshapes_2.0.tar.gz
        tar xzf cshapes_2.0.tar.gz cshapes/inst/extdata/cshapes_2_gw.topojson.xz
        xz -dc cshapes/inst/extdata/cshapes_2_gw.topojson.xz > cshapes_2_gw.topojson
"""
import argparse, collections, datetime, glob, json, math, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CS_PATH = os.path.join(ROOT, "data", "cshapes", "cshapes_2_gw.topojson")
OUT = os.path.join(ROOT, "content", "factcheck", "cshapes-check.md")
Y0, Y1 = 1886, 1991

# ---------------------------------------------------------------------------------------------------------------------
# Atlas realm -> GW code. A value is a code, or a list of (from, to, code) for realms whose GW code changes with time.
# None = a polity GW does not list (a native state before conquest, a protected state, a breakaway, a union).
# ---------------------------------------------------------------------------------------------------------------------
LINKS = {
    # Americas
    "United States of America": 2, "Canada": 20, "Commonwealth of The Bahamas": 31, "Cuba": 40, "Communist Cuba": 40,
    "Republic of Cuba": 40, "Empire of Haiti": 41, "Republic of Haiti": 41, "Haiti (divided: northern State and southern Republic)": 41,
    "Dominican Republic": 42, "Jamaica": 51, "Republic of Trinidad and Tobago": 52, "Barbados": 53, "Mexico": 70, "Belize": 80,
    "Guatemala": 90, "Honduras": 91, "Republic of El Salvador": 92, "Republic of Nicaragua": 93, "Republic of Costa Rica": 94,
    "Republic of Panama": 95, "Republic of Colombia": 100, "United States of Colombia": 100, "Venezuela": 101, "Guyana": 110,
    "Republic of Suriname": 115, "Republic of Ecuador": 130, "Republic of Peru": 135, "Empire of Brazil": 140,
    "Brazilian Republic": 140, "Unitary State of Brazil": 140, "Federated Republic of Brazil": 140, "Republic of Brazil": 140,
    "Bolivia": 145, "Paraguay": 150, "Republic of Chile": 155, "Argentine Confederation": 160, "Argentine Republic": 160,
    "Oriental Republic of Uruguay": 165,
    # Europe
    "United Kingdom": 200, "Kingdom of Great Britain": 200, "Irish Free State": 205, "Ireland": 205, "Éire": 205,
    "Netherlands": 210, "Kingdom of Belgium": 211, "Luxembourg": 212, "French Third Republic": 220, "Vichy France": 220,
    "Free French": 220, "French Fourth Republic": 220, "French Fifth Republic": 220, "Swiss Confederation": 225,
    "Kingdom of Spain": 230, "Second Spanish Republic": 230, "Francoist Spain": 230, "Kingdom of Portugal": 235,
    "Portuguese Republic": 235, "Estado Novo": 235, "Portugal": 235,
    # GW: Germany 255 ends in 1945; the Federal Republic (260) continues as united Germany after 3 October 1990
    "German Empire": 255, "Weimar Republic": 255, "Nazi Germany": 255, "Germany": 260, "Federated Republic of Germany": 260,
    "Federal Republic of Germany": 260, "West Berlin": 260,
    "German Democratic Republic": 265, "Second Polish Republic": 290, "Polish People's Republic": 290, "Republic of Poland": 290,
    "Free City of Danzig": 291, "Austria-Hungary": 300, "Republic of Austria": 305, "Second Republic of Austria": 305,
    "Hungarian Republic": 310, "Kingdom of Hungary": 310, "Hungary": 310, "Hungarian People's Republic": 310,
    "Czechoslovakia": 315, "Kingdom of Italy": 325, "Republic of Italy": 325, "Malta": 338, "Albania": 339,
    "People's Socialist Republic of Albania": 339, "Republic of Albania": 339, "Principality of Serbia": 340,
    "Kingdom of Serbia": 340, "Revolutionary Serbia": 340, "Serbs": 340, "Serbia": 340, "Montenegro": 341,
    "Yugoslavia": 345, "Socialist Federal Republic of Yugoslavia": 345, "First Hellenic Republic": 350,
    "Second Hellenic Republic": 350, "Third Hellenic Republic": 350, "Kingdom of Greece": 350, "Greek junta": 350,
    "Republic of Cyprus": 352, "Principality of Bulgaria": 355, "Kingdom of Bulgaria": 355, "People's Republic of Bulgaria": 355,
    "Republic of Bulgaria": 355, "United Principalities of Moldavia and Wallachia": 360, "Kingdom of Romania": 360,
    "Socialist Republic of Romania": 360, "Romania": 360, "Russian Empire": 365, "Russian Republic": 365,
    "Russia (Civil War)": 365, "Republics of the Soviet Union": 365, "Union of Soviet Socialist Republics": 365,
    "Estonia": 366, "Republic of Latvia": 367, "Kingdom of Lithuania": 368, "Republic of Lithuania": 368,
    "Ukrainian People's Republic": 369, "Armenia": 371, "Georgia": 372, "Azerbaijan Democratic Republic": 373,
    "Republic of Finland": 375, "United Kingdoms of Sweden and Norway": 380, "Kingdom of Sweden": 380,
    "Kingdom of Norway": 385, "Denmark": 390, "Denmark-Norway": 390, "Kingdom of Iceland": 395, "Republic of Iceland": 395,
    # Africa
    "Republic of Cabo Verde": 402, "Republic of Guinea-Bissau": 404, "Equatorial Guinea": 411, "Republic of The Gambia": 420,
    "Republic of Mali": 432, "Mali Federation": 432, "Republic of Senegal": 433, "Republic of Dahomey": 434,
    "Republic of Benin": 434, "Mauritania": 435, "Republic of the Niger": 436, "Republic of Côte d'Ivoire": 437,
    "Guinea": 438, "Republic of Upper Volta": 439, "Burkina Faso": 439, "Republic of Liberia": 450, "Sierra Leone": 451,
    "Ghana": 452, "Togo": 461, "Republic of Cameroon": 471, "Federal Republic of Nigeria": 475, "Gabon": 481,
    "Central African Republic": 482, "Republic of Chad": 483, "Republic of the Congo": 484,
    "Democratic Republic of the Congo": 490, "Zaire": 490, "Republic of Uganda": 500, "Republic of Kenya": 501,
    "Tanganyika": 510, "Tanzania": 510, "Sultanate of Zanzibar": 511, "People's Republic of Zanzibar": 511,
    "Republic of Burundi": 516, "Republic of Rwanda": 517, "Federal Republic of Somalia": 520, "Republic of Djibouti": 522,
    "Ethiopian Empire": 530, "Ethiopia": 530, "People's Republic of Angola": 540, "Mozambique": 541, "Zambia": 551,
    "Rhodesia": 552, "Zimbabwe Rhodesia": 552, "Republic of Zimbabwe": 552, "Malawi": 553, "South Africa": 560,
    "South African Republic": 563, "Free Orange State": 564, "Namibia": 565, "Lesotho": 570, "Republic of Botswana": 571,
    "Swaziland": 572, "Eswatini": 572, "Merina Kingdom": 580, "Madagascar": 580, "Comoros": 581, "Mauritius": 590,
    "Morocco": 600, "People's Democratic Republic of Algeria": 615, "Republic of Tunisia": 616, "Kingdom of Libya": 620,
    "Libyan Arab Republic": 620, "Republic of Sudan": 625,
    # Middle East
    "Qajar Dynasty": 630, "Pahlavi Dynasty": 630, "Islamic Republic of Iran": 630, "Ottoman Empire": 640,
    "Ottoman Tripolitania": 640, "Republic of Turkey": 640, "Kingdom of Iraq": 645, "Iraqi Republic": 645,
    "Kingdom of Egypt": 651, "Republic of Egypt": 651, "United Arab Republic": 651, "Arab Republic of Egypt": 651,
    "Second Syrian Republic": 652, "Republic of Syria": 652, "Ba'athist Syria": 652, "Arab Socialist Ba'ath Party": 652,
    "Syria": 652, "Lebanon": 660, "Kingdom of Jordan": 663, "State of Israel": 666, "Emirate of Nejd": 670,
    "Kingdom of Hejaz and Nejd": 670, "Kingdom of Saudi Arabia": 670, "Mutawakkilite Kingdom of Yemen": 678,
    "North Yemen": 678, "Yemen Arab Republic": 678, "Republic of Yemen": 678, "People's Republic of Southern Yemen": 680,
    "People's Democratic Republic of Yemen": 680, "State of Kuwait": 690, "Kuwait": 690, "House of Khalifa": 692,
    "Kingdom of Bahrain": 692, "Qatar Dynasty": 694, "Qatar": 694, "Qatar Protectorate": 694, "State of Qatar": 694,
    "Trucial States": 696, "United Arab Emirates": 696, "Sultanate of Oman": 698, "Sultanate of Muscat and Oman": 698,
    # Asia and Oceania
    "Emirate of Afghanistan": 700, "Kingdom of Afghanistan": 700, "Republic of Afghanistan": 700, "Afghanistan": 700,
    "Qing Dynasty": 710, "Empire of China": 710, "Kuomintang": 710, "People's Republic of China": 710,
    "Republic of China": [(1886, 1949, 710), (1950, 2100, 713)], "Tibet": 711, "Great Mongol State": 712,
    "Mongolian People's Republic": 712, "Joseon": 730, "Korean Empire": 730, "Democratic People's Republic of Korea": 731,
    "Republic of Korea": 732, "Empire of Japan": 740, "Japan": 740, "Republic of India": 750, "Kingdom of Bhutan": 760,
    "Islamic Republic of Pakistan": 770, "People's Republic of Bangladesh": 771, "Burma": 775, "Myanmar": 775,
    "Union of Myanmar": 775, "Sri Lanka": 780, "Maldives": 781, "Nepal": 790, "Rattanakosin Kingdom": 800,
    "Kingdom of Thailand": 800, "Kingdom of Cambodia": 811, "Khmer Republic": 811, "Khmer Rouge": 811,
    "People's Republic of Kampuchea": 811, "State of Cambodia": 811, "Kingdom of Laos": 812, "Communist Laos": 812,
    "Laos": 812, "Democratic Republic of Vietnam": 816, "Socialist Republic of Vietnam": 816, "Republic of Vietnam": 817,
    "Federation of Malaya": 820, "Malaysia": 820, "Republic of Singapore": 830, "Sultanate of Brunei": 835,
    "Republic of the Philippines": 840, "Republic of Indonesia": 850, "Commonwealth of Australia": 900,
    "Papua New Guinea": 910, "New Zealand": 920, "Solomon Islands": 940, "Republic of Fiji": 950,
}
# Realms that stand for a colonial empire or a colony: they count for the owner's territory, not as the state itself.
COLONIES = {
    "British Africa": 200, "British Colonial Empire": 200, "British East Africa": 200, "British colonies in Africa": 200,
    "British Gold Coast": 200, "British Raj": 200, "Colony of Natal": 200, "Colony of Zululand": 200, "Natalia Republic": 200,
    "French Africa": 220, "French Indochina": 220, "French Mandate for Syria and Lebanon": 220, "German Africa": 255,
    "Italian Africa": 325, "Portuguese Colonies": 235, "Belgian Congo": 211, "Congo Free State": 211, "Ruanda-Urundi": 211,
    "Dutch East Indies": 210, "Netherlands Antilles": 210, "Surinam (Dutch colony)": 210, "Greenland": 390,
    "American zone": 2, "British zone": 200, "French zone": 220, "Soviet zone": 365,
}
# Factions and governments-in-rebellion inside a state: its territory, not a state of their own.
FACTIONS = {
    "Anti-Kuomintang Coalition": 710, "Chinese Communists": 710, "Communist Party of China": 710, "Cuban Communists": 40,
    "Hungarian Nationalists": 310, "Maderistas": 70, "Mujahideen": 700, "Polish Armed Forces": 290,
    "Provisional Priamurye Government": 365, "Spanish Nationalists": 230, "Yugoslav Partisans": 345,
}
# Sovereign microstates the GW list leaves out (population under 250,000 at independence): not in CShapes at all.
MICRO = {
    "Antigua (British associated state)", "Antigua and Barbuda", "Commonwealth of Dominica", "Grenada", "Kiribati",
    "Kingdom of Monaco", "Marshall Islands", "Micronesia", "Nauru", "Principality of Andorra", "Principality of Liechtenstein",
    "Principality of Monaco", "Republic of San Marino", "Saint Kitts", "Saint Kitts and Nevis", "Saint Lucia",
    "Saint Vincent", "Saint Vincent (British associated state)", "Samoa", "Seychelles", "São Tomé and Príncipe", "Tonga",
    "Tuvalu", "Vanuatu", "Vatican City",
}


# Border disagreements wholly inside these years are filed as wartime occupations (CShapes codes none, apart from the
# few states GW drops): the First World War and its aftermath, and Manchukuo, the Second World War and the occupations.
WARTIME = [(1914, 1923), (1931, 1952)]


def link(name, year, kind=None):
    """(GW code or None, role) for an atlas realm in a year. role: state | colony | faction | micro | none"""
    if kind == "princely state":  # Indian princely states: inside British India in CShapes until independence
        return (200, "colony") if year <= 1947 else (None, "none")
    if name in COLONIES: return COLONIES[name], "colony"
    if name in FACTIONS: return FACTIONS[name], "faction"
    if name in MICRO: return None, "micro"
    v = LINKS.get(name)
    if isinstance(v, list): v = next((c for a, b, c in v if a <= year <= b), None)
    return (v, "state") if v is not None else (None, "none")


# ---------------------------------------------------------------------------------------------------------------------
# Rasterising
# ---------------------------------------------------------------------------------------------------------------------
class Grid:
    def __init__(self, res):
        self.K = round(1 / res)
        self.NC, self.NR = 360 * self.K, 180 * self.K
        R = 6371.0088
        d = math.radians(1 / self.K)
        # exact spherical area of a cell row: R^2 * dlon * (sin(lat1) - sin(lat0))
        self.row_area = [R * R * d * (math.sin(math.radians((r + 1) / self.K - 90)) - math.sin(math.radians(r / self.K - 90)))
                         for r in range(self.NR)]

    def cells(self, polys, crop=None, cuts=()):
        """cell ids (row * NC + col) whose centre is inside the polygons (even-odd over all rings); columns wrap at 180"""
        K = self.K
        rows = collections.defaultdict(list)
        for poly in polys:
            for ring in poly:
                n = len(ring)
                for i in range(n):
                    x1, y1 = ring[i - 1][0] * K, ring[i - 1][1] * K
                    x2, y2 = ring[i][0] * K, ring[i][1] * K
                    if y1 == y2: continue
                    lo, hi = (y1, y2) if y1 < y2 else (y2, y1)
                    for r in range(math.ceil(lo - 0.5), math.floor(hi - 0.5) + 1):
                        yc = r + 0.5
                        if lo <= yc < hi: rows[r].append(x1 + (yc - y1) * (x2 - x1) / (y2 - y1))
        out = set()
        for r, xs in rows.items():
            gr = r + 90 * K
            if not 0 <= gr < self.NR: continue
            xs.sort()
            lat = (r + 0.5) / K
            for a, b in zip(xs[0::2], xs[1::2]):
                for c in range(math.ceil(a - 0.5), math.floor(b - 0.5) + 1):
                    lon = (c + 0.5) / K
                    if crop and not (crop[0] <= lon <= crop[2] and crop[1] <= lat <= crop[3]): continue
                    if cuts and any(bx[0] <= lon <= bx[2] and bx[1] <= lat <= bx[3] for bx in cuts): continue
                    out.add(gr * self.NC + (c + 180 * K) % self.NC)
        return out

    def lonlat(self, cell):
        r, c = divmod(cell, self.NC)
        return (c + 0.5) / self.K - 180, (r + 0.5) / self.K - 90


def polys_of(geom):
    if geom["type"] == "Polygon": return [geom["coordinates"]]
    if geom["type"] == "MultiPolygon": return geom["coordinates"]
    return []


# ---------------------------------------------------------------------------------------------------------------------
# Loading
# ---------------------------------------------------------------------------------------------------------------------
def cut_spans(spans, a, b):
    out = []
    for x, y in spans:
        if b < x or a > y: out.append((x, y)); continue
        if x < a: out.append((x, a - 1))
        if y > b: out.append((b + 1, y))
    return out


def load_atlas():
    """pieces drawn by the atlas in Y0..Y1: dicts {name, kind, a, b, geom, crop, cuts}, as tools/placeindex.py reads them"""
    corr = json.load(open(os.path.join(ROOT, "content", "corrections.json"))).get("realms", {})
    sp = os.path.join(ROOT, "public", "data", "supplements.json")
    supps = [s for s in (json.load(open(sp)) if os.path.exists(sp) else []) if s.get("kind") != "cultures"]
    replaced = collections.defaultdict(list)
    for s in supps:
        for n in s.get("replaces", []): replaced[n].append((s["from"], s["to"]))
    pieces, seen = [], set()
    for path in sorted(glob.glob(os.path.join(ROOT, "public", "data", "clio", "*.json"))):
        if path.endswith("index.json"): continue
        d = json.load(open(path))
        for f in d["features"] if isinstance(d, dict) else d:
            p = f["properties"]
            if p.get("people") or p["t"] < Y0 or p["f"] > Y1: continue
            key = (p["n"], p["f"], p["t"], round(p.get("a", 0)))
            if key in seen: continue
            seen.add(key)
            fr, to = p["f"], p["t"]
            c = corr.get(p["n"], {})
            if c.get("clip"): fr, to = max(fr, c["clip"][0]), min(to, c["clip"][1])
            spans = [(fr, to)] if fr <= to else []
            for a, b in c.get("hide", []): spans = cut_spans(spans, a, b)
            for r in c.get("asPeople", []): spans = cut_spans(spans, r["from"], r["to"])
            for a, b in replaced.get(p["n"], []): spans = cut_spans(spans, a, b)
            ranges = [(r["from"], r["to"]) for op in ("crop", "cut", "relabel") for r in c.get(op, [])]
            geom = {"polys": polys_of(f["geometry"])}  # shared by all pieces of this row (cells cached on it)
            for x, y in spans:
                x, y = max(x, Y0), min(y, Y1)
                if x > y: continue
                cuts = sorted({x, y + 1} | {v for a, b in ranges for v in (a, b + 1) if x < v <= y})
                for a, b in zip(cuts, cuts[1:]):
                    b -= 1
                    crop = next((r["box"] for r in c.get("crop", []) if r["from"] <= a <= r["to"]), None)
                    boxes = tuple(tuple(r["box"]) for r in c.get("cut", []) if r["from"] <= a <= r["to"])
                    rl = next((r for r in c.get("relabel", []) if r["from"] <= a <= r["to"]), None)
                    pieces.append({"name": rl["name"] if rl else p["n"], "kind": None, "a": a, "b": b, "geom": geom,
                                   "crop": tuple(crop) if crop else None, "cuts": boxes, "src": "Cliopatria"})
    for s in supps:
        for rg in s["regions"]:
            fr, to = max(rg.get("from", s["from"]), Y0), min(rg.get("to", s["to"]), Y1)
            if fr > to: continue
            pieces.append({"name": rg["name"], "kind": rg.get("kind"), "a": fr, "b": to,
                           "geom": {"polys": [[rg["coords"]]]}, "crop": None, "cuts": (), "src": "supplement " + s["id"]})
    return pieces


def load_cshapes():
    """CShapes units: dicts {gw, name, start, end, status, owner, sov, polys}"""
    d = json.load(open(CS_PATH))
    arcs = d["arcs"]
    tf = d.get("transform")

    def arc(i):
        pts = arcs[i if i >= 0 else ~i]
        if tf:  # quantised TopoJSON: delta-encoded integer positions
            sx, sy = tf["scale"]; tx, ty = tf["translate"]; x = y = 0; out = []
            for dx, dy in pts:
                x += dx; y += dy; out.append([x * sx + tx, y * sy + ty])
            pts = out
        return pts if i >= 0 else pts[::-1]

    def ring(ids):
        out = []
        for k, i in enumerate(ids):
            pts = arc(i)
            out.extend(pts if k == 0 else pts[1:])
        return out

    units = []
    for g in d["objects"]["cshapes_2_gw"]["geometries"]:
        p = g["properties"]
        if g["type"] == "Polygon": polys = [[ring(r) for r in g["arcs"]]]
        elif g["type"] == "MultiPolygon": polys = [[ring(r) for r in poly] for poly in g["arcs"]]
        else: continue
        if p["end"] < f"{Y0}-01-01" or p["start"] > f"{Y1}-12-31": continue
        owner = int(p["owner"]) if str(p["owner"]).lstrip("-").isdigit() else p["gwcode"]
        sov = p["gwcode"] if p["status"] == "independent" or owner in (0, 1) else owner
        units.append({"gw": p["gwcode"], "name": p["country_name"], "start": p["start"], "end": p["end"],
                      "status": p["status"], "owner": owner, "sov": sov, "polys": polys})
    return units


# ---------------------------------------------------------------------------------------------------------------------
# Comparing
# ---------------------------------------------------------------------------------------------------------------------
def runs(years, sample):
    """split a set of sampled years into runs of consecutive samples -> [(first, last)]"""
    idx = {y: i for i, y in enumerate(sample)}
    out = []
    for y in sorted(years):
        if out and idx[y] == idx[out[-1][1]] + 1: out[-1][1] = y
        else: out.append([y, y])
    return [tuple(r) for r in out]


def yr(a, b): return str(a) if a == b else f"{a}–{b}"


def km(v): return f"{round(v / 1000) * 1000:,.0f}" if v >= 10000 else f"{round(v, -2):,.0f}"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--step", type=int, default=1, help="years between samples (default 1: every year 1886-1991)")
    ap.add_argument("--res", type=float, default=0.25, help="grid cell size in degrees (default 0.25)")
    ap.add_argument("--min-area", type=float, default=10000, help="smallest disagreement reported, km² (default 10,000)")
    ap.add_argument("--top", type=int, default=60, help="rows in the territory table (default 60)")
    args = ap.parse_args()
    if not os.path.exists(CS_PATH): raise SystemExit(f"missing {CS_PATH}: see the Fetch steps in this script's header")

    G = Grid(args.res)
    pieces = load_atlas()
    units = load_cshapes()
    names = {}  # GW code -> CShapes name of the independent state (latest spelling)
    for u in units:
        if u["status"] == "independent": names[u["gw"]] = u["name"]
    sample = sorted(set(range(Y0, Y1 + 1, args.step)) | {Y1})
    print(f"{len(pieces)} atlas pieces, {len(units)} CShapes units, {len(sample)} sample years, {args.res}° grid")

    def cs_label(u):
        if u["status"] == "independent": return u["name"]
        return f"{u['name']} ({u['status']}, {names.get(u['owner'], u['owner'])})"

    def gw_label(code):
        return names.get(code, f"GW {code}") if code is not None else "—"

    # accumulators
    terr = collections.defaultdict(lambda: collections.defaultdict(collections.Counter))  # key -> year -> 10° tile -> area
    terr_role = {}  # key -> role of the atlas realm that speaks for the cells
    terr_names = collections.defaultdict(lambda: collections.defaultdict(collections.Counter))  # key -> year -> atlas names
    cs_sov_area = collections.defaultdict(dict)  # code -> year -> area (CShapes, with dependencies)
    at_sov_area = collections.defaultdict(dict)  # code -> year -> area (atlas, realms linked to the code)
    cs_ind_years = collections.defaultdict(set)  # code -> years CShapes has it independent
    at_state_years = collections.defaultdict(set)  # code -> years the atlas draws a realm linked to it as a state
    at_state_names = collections.defaultdict(collections.Counter)  # code -> atlas realm names drawn as the state
    under = collections.defaultdict(lambda: collections.defaultdict(collections.Counter))  # code -> year -> CS label -> area under atlas state
    realm_years = collections.defaultdict(dict)  # atlas name -> year -> area
    realm_in = collections.defaultdict(float)  # atlas name -> area-years inside its linked GW state (CShapes)
    realm_under = collections.defaultdict(collections.Counter)  # unlinked atlas name -> CS label -> area-years
    realm_src = {}

    for y in sample:
        date = f"{y}-07-01"
        csg = {}
        for i, u in enumerate(units):
            if not (u["start"] <= date <= u["end"]): continue
            if "cells" not in u: u["cells"] = G.cells(u["polys"])
            if u["status"] == "independent": cs_ind_years[u["gw"]].add(y)
            for c in u["cells"]: csg.setdefault(c, i)
        atg = {}
        active = [p for p in pieces if p["a"] <= y <= p["b"]]
        for p in active:
            if "cells" not in p:
                g = p["geom"]
                if p["crop"] or p["cuts"]: p["cells"] = G.cells(g["polys"], p["crop"], p["cuts"])
                else:
                    if "cells" not in g: g["cells"] = G.cells(g["polys"])
                    p["cells"] = g["cells"]
            realm_src.setdefault(p["name"], p["src"])
            for c in p["cells"]:
                v = atg.get(c)
                if v is None: atg[c] = [p]
                elif p not in v: v.append(p)
        cs_area = collections.Counter(); at_area = collections.Counter(); rarea = collections.Counter()
        for c in set(csg) | set(atg):
            a = G.row_area[c // G.NC]
            u = units[csg[c]] if c in csg else None
            ps = atg.get(c, [])
            sov = u["sov"] if u else None
            if u: cs_area[sov] += a
            links = []
            for p in ps:
                code, role = link(p["name"], y, p["kind"])
                links.append((code, role, p))
                rarea[p["name"]] += a
                if code is not None:
                    if u and code == sov: realm_in[p["name"]] += a
                else:
                    realm_under[p["name"]][cs_label(u) if u else "no CShapes unit"] += a
                if role == "state" and u: under[code][y][cs_label(u)] += a
            for code in {l[0] for l in links if l[0] is not None}: at_area[code] += a
            if u and any(l[0] == sov for l in links): continue  # agree
            if not u and all(l[1] == "micro" for l in links): continue  # microstates are outside GW by design
            # disagreement: pick the atlas realm that speaks for this cell (a linked one if any, else the smallest)
            if links:
                lk = sorted(links, key=lambda l: (l[0] is None, len(l[2]["cells"])))[0]
                atl = lk[2]["name"]
                akey = ("gw", lk[0]) if lk[0] is not None else ("realm", atl)
            else:
                atl, akey = None, ("blank", None)
            ckey = ("unit", u["name"], u["status"], u["owner"]) if u else ("blank", None)
            key = (akey, ckey)
            lon, lat = G.lonlat(c)
            terr[key][y][(math.floor(lon / 10) * 10, math.floor(lat / 10) * 10)] += a
            terr_role[key] = lk[1] if links else None
            if atl: terr_names[key][y][atl] += a
        for code, a in cs_area.items(): cs_sov_area[code][y] = a
        for code, a in at_area.items(): at_sov_area[code][y] = a
        for p in active:
            code, role = link(p["name"], y, p["kind"])
            if role == "state" and p["geom"]["polys"]:
                at_state_years[code].add(y); at_state_names[code][p["name"]] += 1
        for n, a in rarea.items(): realm_years[n][y] = a
        print(y, len(csg), "CShapes cells,", len(atg), "atlas cells", flush=True)

    # ---------------------------------------------------------------- 1. territory
    def akey_label(akey, key, a, b):
        if akey[0] == "blank": return "nothing drawn"
        if akey[0] == "realm": return f"{akey[1]} (no GW counterpart)"
        tot = collections.Counter()
        for y in range(a, b + 1): tot.update(terr_names[key].get(y, {}))
        top = [n for n, _ in tot.most_common(2)]
        return f"{gw_label(akey[1])}: {', '.join(top)}"

    def ckey_label(ckey):
        if ckey[0] == "blank": return "no state"
        _, name, status, owner = ckey
        return name if status == "independent" else f"{name} ({status}, {names.get(owner, owner)})"

    def tile_label(t):
        x, y = t
        ew = lambda v: f"{abs(v)}°{'E' if v >= 0 else 'W'}"
        ns = lambda v: f"{abs(v)}°{'N' if v >= 0 else 'S'}"
        return f"{ew(x)}–{ew(x + 10)}, {ns(y)}–{ns(y + 10)}"

    dep_of = collections.defaultdict(set)  # GW code -> owners CShapes ever gives it as a dependency
    for u in units:
        if u["status"] != "independent": dep_of[u["gw"]].add(u["owner"])

    rows = []
    for key, by in terr.items():
        tot = {y: sum(v.values()) for y, v in by.items()}
        big = {y for y, v in tot.items() if v >= args.min_area}
        for a, b in runs(big, sample):
            ys = [y for y in sample if a <= y <= b]
            peak_y = max(ys, key=lambda y: tot[y])
            vals = sorted(tot[y] for y in ys)
            tiles = by[peak_y]
            t, ta = tiles.most_common(1)[0]
            rows.append({"key": key, "a": a, "b": b, "peak": tot[peak_y], "peak_y": peak_y, "median": vals[len(vals) // 2],
                         "where": tile_label(t), "share": ta / tot[peak_y]})
    for r in rows:
        akey, ckey = r["key"]
        role = terr_role.get(r["key"])
        if akey[0] == "blank": r["kind"] = "gap"  # CShapes has a state, the atlas draws nothing
        elif ckey[0] == "blank": r["kind"] = "coverage"  # the atlas draws a state, CShapes has none
        elif akey[0] == "realm": r["kind"] = "status"  # the atlas draws a polity GW does not list
        else:
            code, (_, _, status, owner) = akey[1], ckey
            cs_gw = next(u["gw"] for u in units if u["name"] == ckey[1])
            if (role == "colony" and status == "independent") or code == cs_gw or code in dep_of.get(cs_gw, ()) \
                    or (status != "independent" and owner in dep_of.get(code, ())):
                r["kind"] = "status"  # dependency vs state: the same land, coded as a colony on one side
            elif any(w0 <= r["a"] and r["b"] <= w1 for w0, w1 in WARTIME):
                r["kind"] = "wartime"  # an occupation the atlas draws and CShapes, by design, does not
            else:
                r["kind"] = "border"
    rows.sort(key=lambda r: -r["peak"])
    problems = [r for r in rows if r["kind"] in ("gap", "border")]
    conventions = [r for r in rows if r["kind"] in ("status", "coverage", "wartime")]

    # ---------------------------------------------------------------- 2. size
    size_rows = []
    for code in set(cs_sov_area) | set(at_sov_area):
        diffs = {}
        for y in sample:
            c, t = cs_sov_area[code].get(y, 0), at_sov_area[code].get(y, 0)
            if c == 0 and t == 0: continue
            d = t - c
            if abs(d) >= max(5 * args.min_area, 0.10 * max(c, t)): diffs[y] = (c, t, d)
        for a, b in runs(set(diffs), sample):
            ys = [y for y in sample if a <= y <= b]
            py = max(ys, key=lambda y: abs(diffs[y][2]))
            c, t, d = diffs[py]
            med = sorted(diffs[y][2] for y in ys)[len(ys) // 2]
            size_rows.append({"code": code, "a": a, "b": b, "y": py, "cs": c, "at": t, "d": d, "med": med})
    size_rows.sort(key=lambda r: -abs(r["d"]))

    # ---------------------------------------------------------------- 3. dates
    def cs_periods(code):
        ps = sorted((u["start"], u["end"]) for u in units if u["gw"] == code and u["status"] == "independent")
        out = []
        for s, e in ps:
            if out:
                prev = datetime.date.fromisoformat(out[-1][1]); cur = datetime.date.fromisoformat(s)
                if (cur - prev).days <= 2: out[-1][1] = max(out[-1][1], e); continue
            out.append([s, e])
        return [(s, e) for s, e in out]

    date_rows, date_small = [], []
    for code in sorted(set(cs_ind_years) | set(at_state_years)):
        cy, ay = cs_ind_years.get(code, set()), at_state_years.get(code, set())
        if not cy: continue  # not a GW state in these years at all: see presence
        for side, ys in (("CShapes only", cy - ay), ("atlas only", ay - cy)):
            for a, b in runs(ys, sample):
                n = b - a + 1
                row = {"code": code, "side": side, "a": a, "b": b, "n": n}
                if side == "atlas only":  # what CShapes has under the atlas's state in those years
                    tot = collections.Counter()
                    for y in range(a, b + 1): tot.update(under[code].get(y, {}))
                    row["under"] = ", ".join(n for n, _ in tot.most_common(2)) or "—"
                (date_rows if n >= 2 * args.step else date_small).append(row)
    date_rows.sort(key=lambda r: (-r["n"], r["code"]))

    # ---------------------------------------------------------------- 4. presence
    unlinked = []
    for n, by in realm_years.items():
        code, role = link(n, max(by), next((p["kind"] for p in pieces if p["name"] == n), None))
        roles = {link(n, y, next((p["kind"] for p in pieces if p["name"] == n), None))[1] for y in by}
        if roles - {"none"}: continue
        yrs = sorted(by)
        unlinked.append({"name": n, "years": runs(set(yrs), sample), "peak": max(by.values()),
                         "under": realm_under[n].most_common(3), "src": realm_src.get(n, "")})
    unlinked.sort(key=lambda r: -r["peak"])
    idx = json.load(open(os.path.join(ROOT, "public", "data", "clio", "index.json"))).get("realms", {})
    for r in unlinked: r["wd"] = (idx.get(r["name"]) or {}).get("wd", "")
    never = [code for code in sorted(cs_ind_years) if not at_state_years.get(code)]
    micro_seen = sorted(n for n in realm_years if n in MICRO)

    # ---------------------------------------------------------------- 5. links
    link_rows = []
    for n, by in realm_years.items():
        kind = next((p["kind"] for p in pieces if p["name"] == n), None)
        if all(link(n, y, kind)[0] is None for y in by): continue
        tot = sum(by.values())
        if tot < 5 * args.min_area: continue
        share = realm_in[n] / tot
        if share < 0.5:
            codes = sorted({link(n, y, kind)[0] for y in by} - {None})
            link_rows.append({"name": n, "codes": codes, "share": share, "years": runs(set(by), sample),
                              "peak": max(by.values())})
    link_rows.sort(key=lambda r: r["share"])

    # ---------------------------------------------------------------- report
    L = []
    w = L.append
    w("# Border cross-check against CShapes 2.0 (1886–1991)")
    w("")
    w(f"Written by `tools/check_cshapes.py` on {datetime.date.today().isoformat()}. Read-only: nothing in the atlas was changed.")
    w("")
    w("CShapes 2.0 (ETH Zurich, International Conflict Research) is a peer-reviewed dataset of the borders of independent "
      "states and their dependencies, with dated boundary changes, 1886–2019. It follows the Gleditsch & Ward (GW) list of "
      "states, so it leaves out microstates and counts a state only from the date GW recognise it; native states before "
      "conquest and protected states are inside their colonial owner. Some disagreements below are those conventions, "
      "not errors on either side.")
    w("")
    w("> Source: Schvitz, G., L. Girardin, S. Rüegger, N. B. Weidmann, L.-E. Cederman and K. S. Gleditsch (2022). "
      "Mapping the International System, 1886–2019: The CShapes 2.0 Dataset. *Journal of Conflict Resolution* 66(1): "
      "144–161. [doi:10.1177/00220027211013563](https://doi.org/10.1177/00220027211013563). Data "
      "[icr.ethz.ch/data/cshapes](https://icr.ethz.ch/data/cshapes/), licence "
      "[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/). This report carries only figures derived "
      "from it; the raw file is not in the repository.")
    w("")
    w("## How it was compared")
    w("")
    step = "every year" if args.step == 1 else f"every {args.step} years"
    w(f"- Years: {step} from {sample[0]} to {sample[-1]} ({len(sample)} snapshots). CShapes is read on 1 July of each "
      "year; the atlas row counts if its first year ≤ Y ≤ its last year.")
    w("- Atlas: the border chunks in `public/data/clio/` (Cliopatria with `content/borders/patches.json` applied), every "
      "correction in `content/corrections.json` and the reconstruction layers in `public/data/supplements.json`, as "
      "`tools/placeindex.py` reads them.")
    w(f"- Both are laid on a {args.res}° grid (cell centres; a cell is about {km(G.row_area[G.NR // 2])} km² at the "
      f"equator), so states under ~{km(3 * G.row_area[G.NR // 2])} km² are not measured reliably and are left out of the "
      "area tables.")
    w("- CShapes carries GW codes and names but no Wikidata ids, so each atlas realm is linked to a GW code by name "
      "(a hand-written table in the script; section 5 checks it). A colony counts for its owner, so "
      "\"British Africa\" agrees with CShapes's Nigeria colony; factions in a civil war count for the state they fight in.")
    w(f"- A territory disagreement is an area held by a different state in the two datasets, or blank in one; areas "
      f"under {km(args.min_area)} km² are not listed. Runs of consecutive years are merged and ranked by their largest "
      "single-year area.")
    w("")
    cnt = collections.Counter(r["kind"] for r in rows)
    w("## Summary")
    w("")
    w(f"- {len(rows)} territory disagreements over {km(args.min_area)} km² (runs of years): {cnt['gap']} gaps where "
      f"CShapes has a state and the atlas draws nothing, {cnt['border']} where the two give the land to different "
      f"states outside wartime, {cnt['wartime']} wartime occupations, {cnt['status']} where the same land is a colony "
      f"on one side and a state on the other (or a polity GW does not list), and {cnt['coverage']} where CShapes has "
      "no state.")
    w(f"- {len(size_rows)} runs where a state's total area differs by more than 10% (and {km(5 * args.min_area)} km²).")
    w(f"- {len(date_rows)} date differences of {2 * args.step} years or more between GW independence in CShapes and the "
      f"years the atlas draws the state; {len(date_small)} shorter offsets are counted, not listed.")
    w(f"- {len(unlinked)} atlas realms with no GW counterpart; {len(never)} GW states the atlas never draws as a state "
      "in these years.")
    w(f"- {len(link_rows)} linked atlas realms lie mostly outside their GW state.")
    w("")

    def terr_table(rs, top):
        w("| # | Years | Peak km² (year) | Typical km² | Atlas draws | CShapes has | Where (most of it) | Kind |")
        w("|---|---|---|---|---|---|---|---|")
        for i, r in enumerate(rs[:top], 1):
            akey, ckey = r["key"]
            w(f"| {i} | {yr(r['a'], r['b'])} | {km(r['peak'])} ({r['peak_y']}) | {km(r['median'])} | "
              f"{akey_label(akey, r['key'], r['a'], r['b'])} | {ckey_label(ckey)} | {r['where']} ({r['share'] * 100:.0f}%) | {r['kind']} |")
        if len(rs) > top:
            w(""); w(f"{len(rs) - top} smaller runs are not listed (rerun with `--top`).")
        w("")

    w("## 1. Largest territory disagreements")
    w("")
    w("Peak = the largest single-year area of the run; typical = its median year. Where = the 10° square holding most "
      "of the disagreeing area in the peak year, with its share.")
    w("")
    w("### 1a. Gaps and border disagreements (where to look for atlas errors)")
    w("")
    w("*gap*: CShapes has a state, the atlas draws nothing. *border*: the two give the land to different states.")
    w("")
    terr_table(problems, args.top)
    w("### 1b. Status, coverage and wartime differences (mostly coding conventions)")
    w("")
    w("*status*: the same land is a colony or protectorate in one dataset and a state in the other (dominions, mandates, "
      "protected states, GW entry dates), or the atlas draws a polity GW does not list. *coverage*: the atlas draws a "
      "state where CShapes has none (unclaimed interiors before the partition of Africa and Arabia, Greenland, "
      "Svalbard, small islands). *wartime*: the two give the land to different states only within 1914–1923 or "
      "1931–1952, which is almost always an occupation or a puppet state the atlas draws and CShapes does not code.")
    w("")
    terr_table(conventions, args.top // 2)
    w("## 2. States whose total area differs")
    w("")
    w("Area of everything linked to the GW code (the state with its colonies) in each dataset, in the year of the "
      "largest difference in the run.")
    w("")
    w("| # | State (GW) | Years | Peak year | CShapes km² | Atlas km² | Atlas − CShapes | Typical difference |")
    w("|---|---|---|---|---|---|---|---|")
    for i, r in enumerate(size_rows[:40], 1):
        pct = f" ({r['d'] / r['cs'] * 100:+.0f}%)" if r["cs"] else ""
        w(f"| {i} | {gw_label(r['code'])} ({r['code']}) | {yr(r['a'], r['b'])} | {r['y']} | {km(r['cs'])} | "
          f"{km(r['at'])} | {'+' if r['d'] > 0 else '−'}{km(abs(r['d']))}{pct} | "
          f"{'+' if r['med'] > 0 else '−'}{km(abs(r['med']))} |")
    if len(size_rows) > 40:
        w(""); w(f"{len(size_rows) - 40} more runs not listed.")
    w("")
    w("## 3. Independence and end dates")
    w("")
    w("Years a GW state is independent in CShapes (on 1 July) but the atlas draws no realm linked to it as a state "
      "(\"CShapes only\"), or the reverse (\"atlas only\", with what CShapes has there instead). Longest first.")
    w("")
    w("| # | State (GW) | CShapes independent | Atlas draws it as | Differs | Years | Which side | CShapes has there |")
    w("|---|---|---|---|---|---|---|---|")
    for i, r in enumerate(date_rows, 1):
        per = "; ".join(f"{s[:10]} → {e[:10]}" for s, e in cs_periods(r["code"])
                        if e >= f"{Y0}-01-01" and s <= f"{Y1}-12-31")
        an = ", ".join(n for n, _ in at_state_names[r["code"]].most_common(2)) or "—"
        w(f"| {i} | {gw_label(r['code'])} ({r['code']}) | {per} | {an} | {yr(r['a'], r['b'])} | {r['n']} | "
          f"{r['side']} | {r.get('under', '')} |")
    w("")
    w("## 4. Present in one, missing in the other")
    w("")
    w("### Atlas realms with no GW counterpart")
    w("")
    w("Native states before conquest, protected states, breakaways and unions. CShapes puts their land inside the state "
      "or colony named on the right.")
    w("")
    w("| # | Atlas realm | Wikidata | Years drawn | Peak km² | CShapes has there | Layer |")
    w("|---|---|---|---|---|---|---|")
    for i, r in enumerate(unlinked, 1):
        ys = ", ".join(yr(a, b) for a, b in r["years"])
        un = ", ".join(n for n, _ in r["under"])
        w(f"| {i} | {r['name']} | {r['wd']} | {ys} | {km(r['peak'])} | {un} | {r['src']} |")
    w("")
    w("### GW states the atlas never draws as a state (1886–1991)")
    w("")
    if never:
        for code in never:
            per = "; ".join(f"{s[:10]} → {e[:10]}" for s, e in cs_periods(code) if s <= f"{Y1}-12-31")
            w(f"- {gw_label(code)} ({code}): independent in CShapes {per}")
    else:
        w("None.")
    w("")
    w("### Microstates the atlas draws that GW leaves out")
    w("")
    w(", ".join(micro_seen) + "." if micro_seen else "None.")
    w("")
    w("## 5. Linked realms that lie mostly outside their GW state")
    w("")
    w("Share of the realm's area (summed over the years it is drawn) that CShapes gives to the GW state it is linked "
      "to. A low share means a wrong link in the script, or a large border or status difference.")
    w("")
    w("| # | Atlas realm | Linked to | Inside | Years drawn | Peak km² |")
    w("|---|---|---|---|---|---|")
    for i, r in enumerate(link_rows, 1):
        ys = ", ".join(yr(a, b) for a, b in r["years"])
        w(f"| {i} | {r['name']} | {', '.join(f'{gw_label(c)} ({c})' for c in r['codes'])} | {r['share'] * 100:.0f}% | "
          f"{ys} | {km(r['peak'])} |")
    w("")
    w("## Limits")
    w("")
    w(f"- The {args.res}° grid misses islands and enclaves smaller than a few cells; small states are checked only by "
      "their dates.")
    w("- CShapes follows GW coding: independence from GW's entry date, no microstates, protected states inside their "
      "protector, and no wartime occupations except where GW drops the state. These show up here as disagreements.")
    w("- Links are by name and written by hand in the script; section 5 is the check on them.")
    w("- CShapes ends at 2019 and the atlas switches to Natural Earth in 1992, so this check stops at 1991.")
    w("")
    open(OUT, "w").write("\n".join(L))
    print("wrote", os.path.relpath(OUT, ROOT), f"({len(rows)} territory runs, {len(size_rows)} size runs, "
          f"{len(date_rows)} date runs, {len(unlinked)} unlinked realms, {len(link_rows)} doubtful links)")


if __name__ == "__main__":
    main()
