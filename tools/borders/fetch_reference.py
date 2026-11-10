#!/usr/bin/env python3
"""Fetch reference data for border checks (polite: ~1 request/second, descriptive User-Agent).

1. Wikidata inception/dissolution years for every realm with a Wikidata id (P571/P576, else P580/P582)
   -> content/borders/wikidata-dates.json
2. Peak areas and years of large empires from Wikipedia's "List of largest empires" (itself cited to Taagepera,
   Turchin and others) -> content/borders/empire-areas.json
Run: python3 -I tools/borders/fetch_reference.py
"""
import json, os, re, time, urllib.parse, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
UA = "AtlasOfEmpires/0.1 (educational map; https://github.com/dineshvaradharajan/atlas-of-empires)"


def get(url):
    for attempt in range(5):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=60) as r:
                return json.load(r)
        except urllib.error.HTTPError as e:
            if e.code == 429:
                time.sleep(int(e.headers.get("Retry-After", "10"))); continue
            raise
        except Exception:
            time.sleep(3)
    raise RuntimeError(url)


def year(claims, prop):
    best = None
    for c in claims.get(prop, []):
        v = c.get("mainsnak", {}).get("datavalue", {}).get("value")
        if not isinstance(v, dict) or "time" not in v:
            continue
        m = re.match(r"([+-])(\d+)-", v["time"])
        if m:
            y = int(m.group(2)) * (-1 if m.group(1) == "-" else 1)
            best = y if best is None else (min(best, y) if prop in ("P571", "P580") else max(best, y))
    return best


def wikidata():
    realms = json.load(open(os.path.join(ROOT, "public", "data", "clio", "index.json")))["realms"]
    ids = {r["wd"] for r in realms.values() if r.get("wd")}
    ovp = os.path.join(ROOT, "content", "borders", "wd-overrides.json")
    if os.path.exists(ovp):
        ids |= {v["wd"] for v in json.load(open(ovp))["items"].values()}
    out_path = os.path.join(ROOT, "content", "borders", "wikidata-dates.json")
    have = json.load(open(out_path))["items"] if os.path.exists(out_path) else {}
    if "--missing" in __import__("sys").argv:
        ids = {q for q in ids if q not in have}
    ids = sorted(ids)
    out = dict(have)
    for i in range(0, len(ids), 50):
        batch = ids[i:i + 50]
        d = get("https://www.wikidata.org/w/api.php?" + urllib.parse.urlencode({"action": "wbgetentities", "ids": "|".join(batch), "props": "claims|labels", "languages": "en", "format": "json"}))
        for qid, e in d.get("entities", {}).items():
            cl = e.get("claims", {})
            s = year(cl, "P571") or year(cl, "P580")
            t = year(cl, "P576") or year(cl, "P582")
            out[qid] = {"label": e.get("labels", {}).get("en", {}).get("value"), "start": s, "end": t}
        time.sleep(1)
        print(f"wikidata {min(i + 50, len(ids))}/{len(ids)}")
    json.dump({"_about": "Wikidata inception (P571, else P580) and dissolution (P576, else P582) years; fetched by tools/borders/fetch_reference.py", "items": out},
              open(os.path.join(ROOT, "content", "borders", "wikidata-dates.json"), "w"), ensure_ascii=False, indent=1)


def areas():
    d = get("https://en.wikipedia.org/w/api.php?" + urllib.parse.urlencode({"action": "parse", "page": "List of largest empires", "prop": "wikitext", "format": "json", "formatversion": "2"}))
    wt = d["parse"]["wikitext"]
    rows = []
    tab = wt[wt.find("{|"):]
    tab = tab[: tab.find("\n|}")]
    strip = lambda c: re.sub(r"<ref[^>]*/>|<ref[^>]*>.*?</ref>", "", c, flags=re.S)
    for row in tab.split("\n|-")[1:]:
        cells = [l[1:].strip() for l in row.strip().split("\n") if l.startswith("|") and not l.startswith("|+")]
        if len(cells) < 5:
            continue
        link = re.search(r"\[\[([^\]|#]+)(?:\|[^\]]*)?\]\]", cells[0])
        area = re.match(r"\s*(\d+(?:\.\d+)?)", strip(cells[1]))
        ym = re.search(r"\{\{\s*[Dd]ate table sorting\|([^}]*)\}\}", cells[4])
        yr = None
        if ym:
            args = ym.group(1)
            n = re.search(r"(-?\d{1,4})", args)
            if n:
                yr = -abs(int(n.group(1))) if re.search(r"BC", args) or n.group(1).startswith("-") else int(n.group(1))
        else:
            n = re.search(r"(\d{1,4})\s*(BCE|BC)?", strip(cells[4]))
            if n:
                yr = -int(n.group(1)) if n.group(2) else int(n.group(1))
        if link and area:
            rows.append({"title": link.group(1).strip(), "peak_mkm2": float(area.group(1)), "peak_year": yr, "year_cell": strip(cells[4])[:80]})
    json.dump({"_about": "Peak areas (million km²) and years from Wikipedia 'List of largest empires' (cites Taagepera, Turchin et al.); parsed by tools/borders/fetch_reference.py — check raw cells when in doubt",
               "source": "https://en.wikipedia.org/wiki/List_of_largest_empires", "rows": rows},
              open(os.path.join(ROOT, "content", "borders", "empire-areas.json"), "w"), ensure_ascii=False, indent=1)
    print("areas", len(rows))


if __name__ == "__main__":
    import sys
    if "--areas" in sys.argv or len(sys.argv) == 1: areas()
    if "--wikidata" in sys.argv or "--missing" in sys.argv or len(sys.argv) == 1: wikidata()
