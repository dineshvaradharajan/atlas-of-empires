#!/usr/bin/env python3
"""Portraits for the notable rulers in content/empires/*.json.

For each ruler: find the English Wikipedia article (exact title first, then a search with the empire's name), check on
Wikidata that it is a person who was alive during the reign, take the article's lead image if it is a freely licensed
file on Wikimedia Commons (not a coat of arms, map, flag or signature), and record its licence and author.

Output: content/media/rulers.json  {"ruler:<empire id>:<index>": [{type, image, page, caption, credit, license}]}
        content/factcheck/portraits.md  (what matched, what was rejected and why)
Stdlib only. Run: python3 -I tools/portraits.py
"""
import glob, html, json, os, re, sys, time, urllib.parse, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "content", "media", "rulers.json")
REPORT = os.path.join(ROOT, "content", "factcheck", "portraits.md")
UA = "AtlasOfEmpires/0.1 (educational map)"
WP, WD, COM = "https://en.wikipedia.org/w/api.php", "https://www.wikidata.org/w/api.php", "https://commons.wikimedia.org/w/api.php"
BAD_FILE = re.compile(r"coat[ _]of[ _]arms|\bCoA\b|signature|autograph|\bmap\b|flag|blason|wappen|escudo|monogram|tughra|cypher|emblem|\.svg$|\.gif$|\.tif", re.I)


CACHE = os.environ.get("PORTRAIT_CACHE")  # optional folder: responses are kept there so a rerun resumes


def get(api, params, tries=14):
    params = dict(params, format="json", formatversion="2", maxlag="5")
    body_enc = urllib.parse.urlencode(sorted(params.items()))
    cpath = None
    if CACHE:
        import hashlib
        os.makedirs(CACHE, exist_ok=True)
        cpath = os.path.join(CACHE, hashlib.sha1((api + body_enc).encode()).hexdigest() + ".json")
        if os.path.exists(cpath): return json.load(open(cpath))
    delay = 3
    for _ in range(tries):
        time.sleep(1.0)
        req = urllib.request.Request(api, data=body_enc.encode(), headers={"User-Agent": UA})
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                body = json.loads(r.read())
            if body.get("error", {}).get("code") == "maxlag":
                time.sleep(delay); delay = min(delay * 2, 60); continue
            if cpath: json.dump(body, open(cpath, "w"))
            return body
        except urllib.error.HTTPError as e:
            if e.code == 429:
                wait = int(e.headers.get("Retry-After") or delay)
                print(f"429, waiting {wait}s", file=sys.stderr, flush=True)
                time.sleep(wait); delay = min(delay * 2, 60); continue
            raise
        except Exception:
            time.sleep(delay); delay = min(delay * 2, 60)
    raise RuntimeError("API failed")


def sparql(query):
    url = "https://query.wikidata.org/sparql?" + urllib.parse.urlencode({"query": query, "format": "json"})
    cpath = None
    if CACHE:
        import hashlib
        cpath = os.path.join(CACHE, "sq-" + hashlib.sha1(query.encode()).hexdigest() + ".json")
        if os.path.exists(cpath): return json.load(open(cpath))
    delay = 3
    for _ in range(10):
        time.sleep(1.0)
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "application/sparql-results+json"}), timeout=90) as r:
                body = json.loads(r.read())
            if cpath: json.dump(body, open(cpath, "w"))
            return body
        except urllib.error.HTTPError as e:
            print("sparql HTTP", e.code, e.read()[:300], file=sys.stderr, flush=True)
            time.sleep(int(e.headers.get("Retry-After") or delay) if e.code == 429 else delay); delay = min(delay * 2, 60)
        except Exception as e:
            print("sparql error", repr(e)[:300], file=sys.stderr, flush=True)
            time.sleep(delay); delay = min(delay * 2, 60)
    raise RuntimeError("SPARQL failed")


def years(text):
    """Years mentioned in a reign string, as signed ints (BCE negative)."""
    t = text.replace("–", "-").replace("—", "-")
    bce = bool(re.search(r"\b(BCE|BC)\b", t))
    ys = [int(x) for x in re.findall(r"\b(\d{1,4})\b", t)]
    if not ys: return None
    if bce:
        # "c. 2589 - 2566 BCE": all BCE; "27 BCE - 14 CE": first BCE, rest CE
        if re.search(r"\b(CE|AD)\b", t): ys = [-ys[0]] + ys[1:]
        else: ys = [-y for y in ys]
    return min(ys), max(ys)


def wd_year(claims, prop):
    for c in claims.get(prop, []):
        v = c.get("mainsnak", {}).get("datavalue", {}).get("value")
        if v and "time" in v:
            m = re.match(r"([+-])(\d+)-", v["time"])
            if m: return (-1 if m.group(1) == "-" else 1) * int(m.group(2))
    return None


def pages_info(titles):
    """title -> {title, pageimage, wikibase, description, disambig} for exact titles (redirects followed)."""
    out = {}
    for i in range(0, len(titles), 40):
        chunk = titles[i:i + 40]
        b = get(WP, {"action": "query", "titles": "|".join(chunk), "redirects": 1, "prop": "pageimages|pageprops|description",
                     "piprop": "name", "ppprop": "wikibase_item|disambiguation"})
        q = b.get("query", {})
        back = {}
        for n in q.get("normalized", []): back[n["to"]] = back.get(n["from"], n["from"])
        for r in q.get("redirects", []): back[r["to"]] = back.get(r["from"], r["from"])
        for p in q.get("pages", []):
            if p.get("missing"): continue
            src = p["title"]
            while src in back and back[src] != src: src = back[src]
            out[src] = {"title": p["title"], "pageimage": p.get("pageimage"), "wikibase": p.get("pageprops", {}).get("wikibase_item"),
                        "description": p.get("description", ""), "disambig": "disambiguation" in p.get("pageprops", {})}
    return out


def search(q):
    b = get(WP, {"action": "query", "list": "search", "srsearch": q, "srlimit": 3, "srnamespace": 0})
    return [s["title"] for s in b.get("query", {}).get("search", [])]


def main():
    rulers = []
    for p in sorted(glob.glob(os.path.join(ROOT, "content", "empires", "*.json"))):
        for e in json.load(open(p)):
            for i, r in enumerate(e.get("rulers") or []):
                rulers.append({"key": f"ruler:{e['id']}:{i}", "name": r["name"], "reign": r.get("reign", ""), "empire": e["name"]})
    print(len(rulers), "rulers", file=sys.stderr)
    clean = lambda n: re.sub(r"\s*\(.*?\)\s*", " ", n).strip()
    info = pages_info(sorted({clean(r["name"]) for r in rulers}))

    # candidates per ruler: exact title (unless disambiguation), then search hits
    cand = {}
    for r in rulers:
        c = []
        ex = info.get(clean(r["name"]))
        if ex and not ex["disambig"]: c.append(ex)
        cand[r["key"]] = c
    need = [r for r in rulers if not cand[r["key"]]]
    print(len(need), "need search", file=sys.stderr)
    hits = {}
    for n, r in enumerate(need):
        hits[r["key"]] = search(f'{clean(r["name"])} {r["empire"]}')
        if n % 20 == 0: print("search", n, file=sys.stderr, flush=True)
    extra = pages_info(sorted({t for ts in hits.values() for t in ts}))
    for r in need: cand[r["key"]] = [extra[t] for t in hits[r["key"]] if t in extra and not extra[t]["disambig"]]

    # Wikidata check: human, alive during reign
    qids = sorted({c["wikibase"] for cs in cand.values() for c in cs if c.get("wikibase")})
    ent = {}  # qid -> {"human": bool, "b": year|None, "d": year|None}
    for i in range(0, len(qids), 25):
        vals = " ".join("wd:" + q for q in qids[i:i + 25])
        q = ("SELECT ?item (MAX(?h) AS ?human) (MIN(YEAR(?b)) AS ?by) (MAX(YEAR(?d)) AS ?dy) WHERE { VALUES ?item { " + vals + " } "
             "OPTIONAL { ?item wdt:P31 wd:Q5 . BIND(1 AS ?h) } OPTIONAL { ?item wdt:P569 ?b } OPTIONAL { ?item wdt:P570 ?d } } GROUP BY ?item")
        b = sparql(q)
        for row in b["results"]["bindings"]:
            qid = row["item"]["value"].rsplit("/", 1)[1]
            num = lambda k: int(float(row[k]["value"])) if k in row else None
            ent[qid] = {"human": "human" in row, "b": num("by"), "d": num("dy")}

    chosen, report = {}, []
    for r in rulers:
        ry = years(r["reign"])
        pick, why = None, "no article found"
        for c in cand[r["key"]]:
            cl = ent.get(c.get("wikibase") or "", {})
            if not cl.get("human"): why = f"{c['title']}: not a person on Wikidata"; continue
            b, d = cl.get("b"), cl.get("d")
            if ry and (b is not None or d is not None):
                if (b is not None and b > ry[0] + 2) or (d is not None and d < ry[1] - 2) or (b is not None and b < ry[0] - 100):
                    why = f"{c['title']}: lived {b}–{d}, reign {r['reign']}"; continue
            elif ry is None or (b is None and d is None):
                # no dates to compare: accept only an exact-name article whose description fits a ruler
                if not re.search(r"king|queen|emperor|empress|pharaoh|sultan|shah|khan|caliph|ruler|tsar|czar|prince|monarch|chief|ruler|lord|regent|president|leader|dictator|consul|tyrant|raja|maharaja|shogun|sapa|tlatoani|mansa|negus|oba|inca|rani", c["description"], re.I):
                    why = f"{c['title']}: no dates, description '{c['description']}' does not say ruler"; continue
            if not c.get("pageimage"): why = f"{c['title']}: no lead image"; pick = None; break
            if BAD_FILE.search(c["pageimage"]): why = f"{c['title']}: lead image is {c['pageimage']}"; pick = None; break
            pick = c; break
        if pick: chosen[r["key"]] = (r, pick)
        else: report.append(f"- {r['name']} ({r['empire']}): {why}")

    # Commons: licence, author, thumbnail (files only on English Wikipedia are non-free and skipped)
    files = sorted({p["pageimage"] for _, p in chosen.values()})
    meta = {}
    for i in range(0, len(files), 40):
        b = get(COM, {"action": "query", "titles": "|".join("File:" + f for f in files[i:i + 40]), "prop": "imageinfo",
                      "iiprop": "url|extmetadata|size", "iiurlwidth": 400})
        norm = {n["to"]: n["from"] for n in b.get("query", {}).get("normalized", [])}
        for p in b.get("query", {}).get("pages", []):
            if p.get("missing") or not p.get("imageinfo"): continue
            ii = p["imageinfo"][0]; em = ii.get("extmetadata", {})
            val = lambda k: html.unescape(re.sub(r"<[^>]+>", "", em.get(k, {}).get("value", ""))).strip()
            meta[norm.get(p["title"], p["title"])[5:]] = {"thumb": ii.get("thumburl"), "page": ii.get("descriptionurl"),
                "license": val("LicenseShortName"), "artist": val("Artist")[:120], "nonfree": val("NonFree").lower() == "true"}

    out, ok = {}, []
    for key, (r, p) in chosen.items():
        f = p["pageimage"].replace("_", " ")
        m = meta.get(f) or meta.get(p["pageimage"])
        if not m or not m["thumb"] or m["nonfree"] or not m["license"] or re.search(r"fair use|non-free", m["license"], re.I):
            report.append(f"- {r['name']} ({r['empire']}): {p['title']}: image not freely licensed on Commons"); continue
        out[key] = [{"type": "portrait", "image": m["thumb"], "page": m["page"], "caption": f"{r['name']} · {p['title']}",
                     "article": p["title"], "credit": m["artist"] or "Wikimedia Commons", "license": m["license"]}]
        ok.append(f"- {r['name']} ({r['empire']}) → [{p['title']}](https://en.wikipedia.org/wiki/{urllib.parse.quote(p['title'].replace(' ', '_'))}): {f} ({m['license']})")

    json.dump(out, open(OUT, "w"), ensure_ascii=False, indent=1)
    with open(REPORT, "w") as fh:
        fh.write(f"# Ruler portraits\n\nGenerated by tools/portraits.py. {len(out)} of {len(rulers)} rulers have a portrait.\n"
                 "Each match is a Wikipedia article whose Wikidata item is a person alive during the reign (or, without dates, "
                 "described as a ruler); the image is the article's lead image, freely licensed on Commons.\n\n"
                 f"## Matched ({len(ok)})\n" + "\n".join(sorted(ok)) + f"\n\n## No portrait ({len(report)})\n" + "\n".join(sorted(report)) + "\n")
    print(len(out), "portraits", file=sys.stderr)


if __name__ == "__main__":
    main()
