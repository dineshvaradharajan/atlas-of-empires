#!/usr/bin/env python3
"""Disputed areas for the map, from Natural Earth 1:10m "admin 0 disputed areas" (public domain).

Like Google Maps: everyone sees a disputed area outlined with a dashed line; a viewer in a country that claims it sees
it drawn their country's way (dotted, in their country's colour). The app picks the viewer's country from the browser's
time zone. Each area appears from the year its present dispute began (SINCE below; 1991 when not listed) and until it
was settled (UNTIL).

Input : ne_10m_admin_0_disputed_areas.geojson (github.com/nvkelso/natural-earth-vector, geojson/)
Output: public/data/disputed.json
  [{"id", "name", "note", "admin": ISO3|null, "claim": [ISO3...], "since", "until", "names": {ISO3: local name},
    "coords": MultiPolygon}]
Run: python3 -I tools/disputed.py <ne_10m_admin_0_disputed_areas.geojson>
"""
import json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Start of the present dispute or control (year); sources: the Wikipedia article of each dispute.
SINCE = {
    "B05": 1947, "C01": 1947, "B09": 1948, "B08": 1948, "B07": 1962, "B06": 1963, "B45": 1984, "B00": 1962,
    "B03": 1962, "B04": 1962, "B01": 1962, "B02": 1962, "B88": 2020,
    "B16": 1967, "B49": 1974, "B58": 2000, "B98": 1967, "B78": 1967, "B79": 1967, "B99": 1967, "B53": 1967, "B54": 1967,
    "B19": 1976, "B28": 1976, "B30": 1991, "B35": 1992, "B37": 1992, "B36": 1990, "C02": 2014, "C03": 2014,
    "B89": 2014, "B38": 1991, "B20": 1974, "B43": 1974, "B57": 2008, "B77": 1949, "B47": 1974, "B46": 1974,
    "B18": 1971, "B39": 1952, "B29": 1945, "B12": 1833, "B32": 1927, "B33": 1927, "B55": 1713, "B67": 1801,
    "B56": 1966, "B13": 2011, "B17": 2011, "B93": 1958, "B94": 1956, "B68": 1967, "B21": 1973, "B10": 1953, "B11": 1953,
    "B84": 1953, "B50": 1959, "B22": 1975, "B75": 1960, "B76": 1960, "B31": 1972, "B44": 1968, "B69": 1968,
}
UNTIL = {"B38": 2023, "B21": 2022, "B68": 2016}
# Areas Natural Earth gives no claimant for, where the claim is clear
EXTRA_CLAIM = {"B57": ["SRB"], "B53": [], "B54": []}
SKIP = {"B91", "B60", "B61", "B51", "B82", "B96", "B95", "C04", "B74", "B70"}  # whole countries, cities or no live claim

NAME_ISO = {
    "India": "IND", "Pakistan": "PAK", "China": "CHN", "Nepal": "NPL", "Syria": "SYR", "Lebanon": "LBN", "Palestine": "PSE",
    "Somalia": "SOM", "Suriname": "SUR", "Western Sahara": "SAH", "Morocco": "MAR", "Georgia": "GEO", "Venezuela": "VEN",
    "Azer.": "AZE", "Portugal": "PRT", "Moldova": "MDA", "Ukraine": "UKR", "Spain": "ESP", "South Sudan": "SSD", "Sudan": "SDN",
    "Cyprus": "CYP", "Uruguay": "URY", "Brazil": "BRA", "Argentina": "ARG", "Chile": "CHL", "Japan": "JPN", "Vietnam": "VNM",
    "Taiwan": "TWN", "Malaysia": "MYS", "the Philippines": "PHL", "Brunei": "BRN", "Mauritius": "MUS", "Seychelles": "SYC",
    "the Seychelles": "SYC", "Madagascar": "MDG", "Comoros": "COM", "Haiti": "HTI", "Ireland": "IRL", "Denmark": "DNK",
    "Iceland": "ISL", "Canada": "CAN", "UAE": "ARE", "Saudi Arabia": "SAU", "Cuba": "CUB", "Djibouti": "DJI",
    "Equatorial Guinea": "GNQ", "Honduras": "HND", "Guatemala": "GTM", "Vanuatu": "VUT", "Marshall Islands": "MHL",
    "Tokelau": "TKL", "Colombia": "COL", "Jamaica": "JAM", "Nicaragua": "NIC", "the United States": "USA", "Mauritius and Seychelles": None,
}
ADMIN_ISO = {"India": "IND", "China": "CHN", "Pakistan": "PAK", "Israel": "ISR", "Morocco": "MAR", "Russia": "RUS", "Spain": "ESP",
             "U.K.": "GBR", "U.K": "GBR", "U.S.A": "USA", "France": "FRA", "Egypt": "EGY", "Sudan": "SDN", "Kenya": "KEN", "Guyana": "GUY", "Bhutan": "BTN",
             "Brazil": "BRA", "Iran": "IRN", "Japan": "JPN", "South Korea": "KOR", "Denmark": "DNK", "Venezuela": "VEN",
             "U.S.A.": "USA", "Belize": "BLZ", "Gabon": "GAB", "Eritrea": "ERI"}
# Names follow Google Maps: neutral place names everywhere (no "occupied"); a local name only where Google shows one
LOCAL = {"B12": {"ARG": "Islas Malvinas (Falkland Islands)"}}
NAME_FIX = {"Shaksam Valley": "Shaksgam Valley", "Ilemi Triange": "Ilemi Triangle"}


def claimants(note):
    m = re.search(r"Claimed by (.+)$", note or "")
    if not m: return []
    parts = re.split(r",\s*(?:and\s+)?|\s+and\s+", m.group(1).replace(";", ",").strip(" ."))
    out = []
    for p in parts:
        p = p.strip()
        iso = NAME_ISO.get(p)
        if iso: out.append(iso)
    return out


def admin_of(note):
    m = re.search(r"Admin\.? by ([^;]+)", note or "", re.I)
    if not m: return None
    return ADMIN_ISO.get(m.group(1).strip(" .").replace("for U.S.A.", "").strip())


def simplify(geom, tol=0.02):
    polys = geom["coordinates"] if geom["type"] == "MultiPolygon" else [geom["coordinates"]]
    out = []
    for poly in polys:
        rings = []
        for r in poly:
            keep = [r[0]]
            for p in r[1:-1]:
                if abs(p[0] - keep[-1][0]) + abs(p[1] - keep[-1][1]) >= tol: keep.append(p)
            keep.append(r[-1])
            if len(keep) >= 4: rings.append([[round(x, 3), round(y, 3)] for x, y in keep])
        if rings: out.append(rings)
    return out


def main(src):
    out = []
    for f in json.load(open(src))["features"]:
        p = f["properties"]
        i = p["BRK_A3"]
        if i in SKIP: continue
        note = p.get("NOTE_BRK") or ""
        claim = EXTRA_CLAIM.get(i, claimants(note))
        coords = simplify(f["geometry"])
        if not coords: continue
        name = p["BRK_NAME"].strip("\ufeff ")
        out.append({"id": i, "name": NAME_FIX.get(name, name), "note": note, "admin": admin_of(note), "claim": claim,
                    "since": SINCE.get(i, 1991), "until": UNTIL.get(i), "names": LOCAL.get(i, {}), "coords": coords})
    path = os.path.join(ROOT, "public", "data", "disputed.json")
    json.dump(out, open(path, "w"), ensure_ascii=False, separators=(",", ":"))
    print(len(out), "areas,", os.path.getsize(path) // 1024, "KB")
    for a in out:
        if a["id"] in ("B05", "B07", "B06", "B08", "B09", "B45", "B89", "B77", "B12"): print(" ", a["id"], a["name"], a["admin"], a["claim"], a["since"])


if __name__ == "__main__":
    main(sys.argv[1])
