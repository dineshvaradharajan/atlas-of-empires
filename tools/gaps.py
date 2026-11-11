#!/usr/bin/env python3
"""Coverage audit: historical states Wikidata knows that the atlas does not draw.

Asks Wikidata (SPARQL) for historical states, kingdoms, empires, sultanates, khanates, etc. with a start date,
an end date, a location and at least 8 Wikipedia language editions, then drops every one the map already has:
Cliopatria realms (each carries its Wikidata id) and the reconstruction layers (matched by name).
Writes content/factcheck/coverage-gaps.md: the missing states by region, most notable first.
Run: python3 -I tools/gaps.py [wikidata-results.json]   (without a file it queries Wikidata, ~1 minute)
"""
import glob, json, os, re, sys, urllib.parse, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE = os.path.join(ROOT, "data", "wikidata-states.json")
CLASSES = ("Q3024240 Q1250464 Q48349 Q417175 Q28171280 Q3624078 Q1520223 Q11514315 Q133311 Q164950 Q5398426 Q15642541 "
           "Q1336152 Q208500 Q154547 Q12759805 Q331644 Q1371288 Q217177 Q189898 Q133442")  # states, kingdoms, empires, sultanates, khanates, principalities, duchies, emirates, princely and vassal states, taifas, city-states
QUERY = ("SELECT ?item ?itemLabel ?start ?end ?coord ?sl WHERE { ?item wdt:P31 ?cls . VALUES ?cls { "
         + " ".join("wd:" + c for c in CLASSES.split()) +
         " } ?item wdt:P571 ?start . OPTIONAL { ?item wdt:P576 ?end } OPTIONAL { ?item wdt:P625 ?c1 } "
         "OPTIONAL { ?item wdt:P36 ?cap . ?cap wdt:P625 ?c2 } BIND(COALESCE(?c1, ?c2) AS ?coord) "
         "?item wikibase:sitelinks ?sl . FILTER(?sl >= 8) SERVICE wikibase:label { bd:serviceParam wikibase:language \"en\". } }")
# rough regions by longitude/latitude (the atlas's 12 regions, simplified)
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
]


STOP = {"kingdom", "kingdoms", "of", "the", "dynasty", "empire", "sultanate", "state", "states", "principality", "khanate", "emirate", "rule", "in", "and"}


def core(name):
    words = re.sub(r"\(.*?\)", " ", name.lower()).replace("-", " ").split()
    return " ".join(sorted(w.strip(".,'") for w in words if w not in STOP)) or name.lower()


def year(v):
    m = re.match(r"(-?)(\d+)-", v or "")
    return (-1 if m.group(1) else 1) * int(m.group(2)) if m else None


def main(src=None):
    if src:
        rows = json.load(open(src))["results"]["bindings"]
    else:
        url = "https://query.wikidata.org/sparql?" + urllib.parse.urlencode({"query": QUERY, "format": "json"})
        req = urllib.request.Request(url, headers={"User-Agent": "AtlasOfEmpires/0.1 (educational map)", "Accept": "application/sparql-results+json"})
        body = json.load(urllib.request.urlopen(req, timeout=180))
        json.dump(body, open(CACHE, "w"))  # re-run offline with: tools/gaps.py data/wikidata-states.json
        rows = body["results"]["bindings"]
    realms = json.load(open(os.path.join(ROOT, "public", "data", "clio", "index.json")))["realms"]
    have_q = {r.get("wd") for r in realms.values() if r.get("wd")}
    names = {n.strip("()").lower() for n in realms}
    for p in glob.glob(os.path.join(ROOT, "content", "supplements", "*.json")):
        for rg in json.load(open(p)).get("regions", []):
            names.add(rg["name"].lower())
    # names match loosely: "Madurai Sultanate (Ma'bar)" = "Madurai Sultanate"; "Kingdom of Cochin" = "Cochin kingdom"
    cores = {core(n) for n in names}
    items = {}
    for r in rows:
        q = r["item"]["value"].rsplit("/", 1)[1]
        label = r.get("itemLabel", {}).get("value", q)
        s, e = year(r.get("start", {}).get("value")), year(r.get("end", {}).get("value"))
        m = re.match(r"Point\(([-\d.]+) ([-\d.]+)\)", r.get("coord", {}).get("value", ""))
        if not m or s is None or e is None or e < -3400 or s > 2024 or q in have_q or core(label) in cores or re.fullmatch(r"Q\d+", label):
            continue
        x, y = float(m.group(1)), float(m.group(2))
        cur = items.get(q)
        if not cur or int(r["sl"]["value"]) > cur["sl"]:
            items[q] = {"q": q, "label": label, "from": s, "to": e, "x": x, "y": y, "sl": int(r["sl"]["value"])}
    by = {}
    for it in items.values():
        reg = next((n for n, f in REGIONS if f(it["x"], it["y"])), "Other")
        by.setdefault(reg, []).append(it)
    out = os.path.join(ROOT, "content", "factcheck", "coverage-gaps.md")
    with open(out, "w") as fh:
        fh.write("# Coverage gaps: historical states the atlas does not draw\n\nGenerated by tools/gaps.py from Wikidata "
                 "(states with start and end dates, a location and 8+ Wikipedia editions), minus every Cliopatria realm "
                 "(by Wikidata id) and every reconstruction-layer region (by name). Notability = number of Wikipedia "
                 "language editions. Some entries are vassal states, provinces or duplicates of a drawn realm under another "
                 "name: check before drawing.\n\n")
        fh.write(f"**{len(items)} missing** · " + " · ".join(f"{k} {len(v)}" for k, v in sorted(by.items(), key=lambda kv: -len(kv[1]))) + "\n")
        for reg, lst in sorted(by.items(), key=lambda kv: -len(kv[1])):
            fh.write(f"\n## {reg} ({len(lst)})\n\n| State | Years | Wikipedia editions | Wikidata |\n|---|---|---|---|\n")
            for it in sorted(lst, key=lambda i: -i["sl"]):
                fh.write(f"| {it['label']} | {it['from']}–{it['to']} | {it['sl']} | [{it['q']}](https://www.wikidata.org/wiki/{it['q']}) |\n")
    print(len(items), "missing;", {k: len(v) for k, v in by.items()}, "->", os.path.relpath(out, ROOT))


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else None)
