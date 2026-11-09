#!/usr/bin/env python3
"""Find an openly-licensed historical map image on Wikimedia Commons for each
polity's English Wikipedia article.

Input : data/clio/wiki_titles.json   {wiki title: [polity names]}
Output: public/data/commons.json     {wiki title: {file, thumb, page, license,
                                                    licenseUrl, artist, desc}}

Stdlib only. Run with:  python3 -I tools/commons.py [--cache DIR]
"""
import html
import json
import os
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IN_PATH = os.path.join(ROOT, "data", "clio", "wiki_titles.json")
OUT_PATH = os.path.join(ROOT, "public", "data", "commons.json")
API = "https://en.wikipedia.org/w/api.php"
UA = "AtlasOfEmpires/0.1 (educational world-history map; contact via project maintainer)"
SLEEP = 0.3
CANDIDATES_PER_TITLE = 3  # ranked fallbacks, in case the best one fails licence/repo checks


# ---------------------------------------------------------------- HTTP -----

def api_get(params, tries=6):
    params = dict(params, format="json", formatversion="2", maxlag="5")
    data = urllib.parse.urlencode(params).encode()
    delay = 2.0
    for attempt in range(tries):
        time.sleep(SLEEP)
        req = urllib.request.Request(API, data=data, headers={
            "User-Agent": UA,
            "Content-Type": "application/x-www-form-urlencoded",
        })
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                body = json.loads(r.read().decode("utf-8"))
            err = body.get("error")
            if err and err.get("code") == "maxlag":
                time.sleep(delay)
                delay *= 2
                continue
            if err:
                raise RuntimeError("API error: %r" % err)
            return body
        except urllib.error.HTTPError as e:
            if e.code == 429 or 500 <= e.code < 600:
                ra = e.headers.get("Retry-After")
                time.sleep(float(ra) if ra and ra.isdigit() else delay)
                delay *= 2
                continue
            raise
        except (urllib.error.URLError, TimeoutError, ConnectionError):
            time.sleep(delay)
            delay *= 2
    raise RuntimeError("giving up after %d tries" % tries)


def query_all(params):
    """Run a query, following `continue`, yielding each response."""
    cont = {}
    while True:
        body = api_get(dict(params, **cont))
        yield body
        if "continue" not in body:
            return
        cont = body["continue"]


def chunks(seq, n):
    for i in range(0, len(seq), n):
        yield seq[i:i + n]


# ------------------------------------------------------- cache helpers -----

def cached(cache_dir, name, fn):
    if cache_dir:
        p = os.path.join(cache_dir, name)
        if os.path.exists(p):
            with open(p, encoding="utf-8") as f:
                return json.load(f)
    val = fn()
    if cache_dir:
        os.makedirs(cache_dir, exist_ok=True)
        with open(os.path.join(cache_dir, name), "w", encoding="utf-8") as f:
            json.dump(val, f, ensure_ascii=False)
    return val


# ---------------------------------------------------- step 1: images -------

def fetch_article_images(titles):
    """Return {input title: [File:..., ...]} (order as returned by API)."""
    out = {t: [] for t in titles}
    done = 0
    for batch in chunks(titles, 50):
        page_images = {}
        back = {}  # resolved title -> set(input titles)
        for body in query_all({
            "action": "query", "prop": "images", "imlimit": "max",
            "titles": "|".join(batch), "redirects": "1",
        }):
            q = body.get("query", {})
            # map normalized/redirected titles back to inputs
            step = {t: t for t in batch}
            for n in q.get("normalized", []):
                for k, v in list(step.items()):
                    if v == n["from"]:
                        step[k] = n["to"]
            for rd in q.get("redirects", []):
                for k, v in list(step.items()):
                    if v == rd["from"]:
                        step[k] = rd["to"]
            for k, v in step.items():
                back.setdefault(v, set()).add(k)
            for p in q.get("pages", []):
                lst = page_images.setdefault(p["title"], [])
                for im in p.get("images", []):
                    if im["title"] not in lst:
                        lst.append(im["title"])
        for resolved, imgs in page_images.items():
            for inp in back.get(resolved, ()):
                out[inp] = imgs
        done += len(batch)
        print("  images: %d/%d" % (done, len(titles)), file=sys.stderr)
    return out


# ---------------------------------------------------- step 2: scoring ------

SKIP_RE = re.compile(
    r"flag[ _]|flag\b|\bflag|coat[ _]of[ _]arms|\bcoa\b|emblem|\bseal\b|seal[ _]of|symbol|"
    r"commons-logo|wiki|question[ _]book|ambox|edit-clear|\blogo|icon|"
    r"portrait|bust[ _]of|\bbust\b|statue|coin|denarius|aureus|solidus|dirham|dinar|tetradrachm|"
    r"stamp|crown|insignia|banner|standard[ _]of|imperial[ _]standard|tamga|monogram|tughra|"
    r"signature|autograph|stub|disambig|padlock|lock-|red[ _]pog|blue[ _]pog|pog\.svg|"
    r"increase|decrease|steady|crystal[ _]clear|nuvola|gnome|folder|speaker|sound|audio|"
    r"\.ogg$|\.oga$|\.ogv$|\.webm$|\.mid$|\.wav$|\.mp3$|\.pdf$|\.djvu$|"
    r"star[ _]of|cross[ _]of|order[ _]of|medal|crest|heraldr|arms[ _]of|blason|escudo|wappen|"
    r"office-book|text[ _]document|people[ _]icon|p[ _]religion|p[ _]history|p[ _]war|"
    r"portal|book[ _]new|symbol[ _]|template|location[ _]dot|locator[ _]dot|red[ _]dot|"
    r"green[ _]pog|map[ _]pointer|transparent|blank\.png|1x1|spacer|\balam\b|ribbon|\bbar\.svg|"
    r"\bstandard\b|badge|vapen|dollar|currency|rupee|tael|lion[ _]and[ _]sun|sin[ _]foto|no[ _]image|silhouette|cscr-|featured|signature",
    re.I)

MAP_WORD_RE = re.compile(r"map|karte|carte|mapa|mappa|territor|extent|expansion|borders|"
                         r"boundar|greatest|largest|orthographic|location|locator", re.I)
# Words that make a map clearly about a polity's extent (vs. a generic locator map).
EXTENT_RE = re.compile(r"territor|extent|expansion|greatest|largest|maximum|borders|boundar|"
                       r"conquest|provinces|zenith|height|peak|apogee", re.I)
HIST_RE = re.compile(r"empire|kingdom|dynasty|caliphate|sultanate|khanate|realm|domain|"
                     r"conquest|campaign|state|polit|historic", re.I)
YEAR_RE = re.compile(r"(?<!\d)\d{1,4}[ _-]?(bce?|ce|ad|bc|a\.d|b\.c)(?![a-z])|\b(ad|ce)[ _]?\d{2,4}\b|"
                     r"(?<!\d)1\d{3}s?(?![\da-z])|(?<![\da-z.])[1-9]\d{2}s?(?![\da-z])|"
                     r"\b\d{1,2}(st|nd|rd|th)[ _-]?(century|c\b)", re.I)
# Things that are often non-map images even if a year or name appears.
WEAK_NEG_RE = re.compile(
    r"painting|photo|photograph|ruins|temple|palace|mosque|church|cathedral|tomb|mausoleum|"
    r"sculpture|relief|fresco|mural|miniature|manuscript|vase|pottery|artifact|artefact|"
    r"museum|battle[ _]of|depiction|engraving|illustration|drawing|tablet|inscription|"
    r"stele|stela|figurine|helmet|sword|armou?r|soldier|warrior|\bking\b|emperor|"
    r"sultan|\bshah\b|queen|pharaoh|portrait|family[ _]tree|genealog|chart|diagram|"
    r"timeline|\bgraph\b|codex|declaration|revolution|proclamation|poster|cartoon|caricature|"
    r"treaty|signing|newspaper|banknote|literacy|\brate\b|population|\bgdp\b|statistic|percent|"
    r"census|economy|exports?\b|imports?\b|growth|election|results|\bvote|demograph|pyramid|"
    r"railway|network|chronica|chronicle|collage|tower|torre|castle|bridge|aircraft|airline|airbus|boeing|"
    r"\bair\b|locomotive|folio|silk|scroll|mosaic|dsc\d|img[ _]\d", re.I)
LANG_SUFFIX_RE = re.compile(r"[-_ (](fr|es|de|it|pt|ru|zh|ja|ar|fa|tr|pl|nl|ca|uk|hu|cs|el)\)?\.\w+$", re.I)
STOP = {"the", "of", "and", "in", "a", "an", "de", "la", "le", "du", "al", "el", "von", "der", "di"}
GENERIC = {"empire", "dynasty", "kingdom", "sultanate", "caliphate", "khanate", "period", "state",
           "states", "republic", "civilisation", "civilization", "culture", "history", "era",
           "confederation", "confederacy", "principality", "duchy", "county", "city", "polity",
           "early", "late", "middle", "old", "new", "great", "greater", "first", "second", "third",
           "ancient", "medieval", "united", "federation", "union", "imperial", "chiefdom",
           "emirate", "khaganate", "kingdoms", "empires", "dynasties", "people", "peoples",
           "north", "south", "east", "west", "northern", "southern", "eastern", "western",
           "lower", "upper", "province", "region", "rule", "regime", "government"}
TOKEN_RE = re.compile(r"[^\W_]+", re.U)


def tokens(s):
    return [t for t in TOKEN_RE.findall(s.lower()) if t not in STOP]


def title_keys(title):
    base = re.sub(r"\s*\(.*?\)\s*", " ", title)  # drop "(Egypt)" style qualifiers
    toks = tokens(base)
    distinct = [t for t in toks if t not in GENERIC and len(t) > 2]
    return set(toks), set(distinct)


def score_file(fname, title=""):
    """Return a score (higher is better); <= 0 means 'not a map'.

    Tiers (x100): 3 = map-named and names the polity, OR names the polity in
    full plus a year (e.g. "Roman Empire Trajan 117AD.png"); 2 = map-named with
    a year; 1 = map-named about some historical extent. Generic locator maps
    ("Europe (orthographic projection).svg") with neither the polity name nor a
    year are rejected.
    """
    name = fname[5:] if fname.startswith("File:") else fname
    low = name.lower()
    if SKIP_RE.search(low):
        return 0
    ftoks = set(tokens(low.rsplit(".", 1)[0]))
    all_t, distinct = title_keys(title)
    full = bool(all_t) and all_t <= ftoks
    partial = bool(distinct & ftoks) or any(
        len(d) >= 5 and len(f) >= 5 and d[:6] == f[:6] for d in distinct for f in ftoks)
    mapw = bool(MAP_WORD_RE.search(low))
    year = bool(YEAR_RE.search(low))
    neg = bool(WEAK_NEG_RE.search(low))
    raster_or_vec = low.endswith((".png", ".svg", ".gif"))

    if mapw and (partial or full):
        tier = 3
    elif full and year and raster_or_vec and not neg:
        tier = 3
    elif mapw and year:
        tier = 2
    elif partial and year and raster_or_vec and not neg:
        tier = 2  # e.g. "Five Dynasties Ten Kingdoms 923 CE.png"
    elif mapw and EXTENT_RE.search(low) and HIST_RE.search(low):
        tier = 1
    elif partial and HIST_RE.search(low) and raster_or_vec and not neg:
        tier = 1  # e.g. "Ostrogothic Kingdom.png", "Inca Empire South America.png"
    elif year and raster_or_vec and not neg and len(ftoks) <= 7:
        tier = 1  # e.g. "Italy 1494.svg", "230 CE, Europe.svg"
    else:
        return 0
    if neg and not mapw:
        return 0

    bonus = 0
    if EXTENT_RE.search(low):
        bonus += 3
    if year:
        bonus += 2
    if mapw:
        bonus += 2
    if full:
        bonus += 1
    if partial:
        bonus += 3
    if neg:
        bonus -= 6
    if "animat" in low:
        bonus -= 5
    if low.endswith((".jpg", ".jpeg", ".tif", ".tiff")):
        bonus -= 2
    if LANG_SUFFIX_RE.search(low):
        bonus -= 2
    if ("orthographic" in low or "location" in low or "locator" in low) and not year:
        bonus -= 2  # modern locator globe: fine, but prefer a dated historical map
    return tier * 100 + bonus


def rank_candidates(images, title=""):
    scored = [(score_file(f, title), i, f) for i, f in enumerate(images)]
    scored = [x for x in scored if x[0] > 0]
    scored.sort(key=lambda x: (-x[0], x[1]))  # tie: first appearance in article
    return [f for _, _, f in scored]



# ---------------------------------------------------- step 3: imageinfo ----

def fetch_imageinfo(files):
    out = {}
    done = 0
    for batch in chunks(files, 50):
        for body in query_all({
            "action": "query", "prop": "imageinfo",
            "iiprop": "url|extmetadata|size", "iiurlwidth": "640",
            "titles": "|".join(batch),
        }):
            q = body.get("query", {})
            norm = {n["to"]: n["from"] for n in q.get("normalized", [])}
            for p in q.get("pages", []):
                ii = p.get("imageinfo")
                if not ii:
                    continue
                rec = dict(ii[0])
                rec["imagerepository"] = p.get("imagerepository", rec.get("imagerepository"))
                out[p["title"]] = rec
                if p["title"] in norm:
                    out[norm[p["title"]]] = rec
        done += len(batch)
        print("  imageinfo: %d/%d" % (done, len(files)), file=sys.stderr)
    return out


TAG_RE = re.compile(r"<[^>]+>")
WS_RE = re.compile(r"\s+")


def strip_html(s, limit):
    if not s:
        return ""
    s = TAG_RE.sub(" ", s)
    s = html.unescape(s)
    s = WS_RE.sub(" ", s).strip()
    if len(s) > limit:
        s = s[:limit - 1].rstrip() + "…"
    return s


FREE_RE = re.compile(r"\bcc0\b|\bcc[ -]by|public domain|^pd\b|^pd-|gfdl|gnu free|"
                     r"no restrictions|attribution|\bcopyrighted free use\b|free art license|\bodbl\b", re.I)
NONFREE_RE = re.compile(r"fair[ _]use|non-free|nonfree|\bnc\b|noncommercial|non-commercial|\bnd\b|noderiv", re.I)


def meta(em, key):
    v = em.get(key) or {}
    return v.get("value", "") if isinstance(v, dict) else str(v)


def acceptable(info):
    if not info or info.get("imagerepository") != "shared":
        return None
    em = info.get("extmetadata") or {}
    lic = strip_html(meta(em, "LicenseShortName"), 80)
    blob = " ".join([lic, meta(em, "License"), meta(em, "UsageTerms"),
                     meta(em, "Restrictions"), meta(em, "NonFree")])
    if meta(em, "NonFree").strip().lower() in ("true", "1"):
        return None
    if NONFREE_RE.search(blob) or not lic or not FREE_RE.search(lic):
        return None
    # skip tiny images (icons) — a map needs some size
    w, h = info.get("width", 0), info.get("height", 0)
    if w and h and max(w, h) < 300:
        return None
    return lic


def clean_thumb(url):
    # Wikimedia only serves standard thumbnail buckets (iiurlwidth=640 yields the
    # 960px bucket; files narrower than that come back unscaled). Normalise the
    # host to upload.wikimedia.org and drop the tracking query string.
    url = url.split("?", 1)[0]
    return url.replace("://thumb.wikimedia.org/", "://upload.wikimedia.org/")


def build_record(fname, info, lic):
    em = info.get("extmetadata") or {}
    lic_url = meta(em, "LicenseUrl").strip()
    if lic_url.startswith("//"):
        lic_url = "https:" + lic_url
    page = info.get("descriptionurl") or (
        "https://commons.wikimedia.org/wiki/" + urllib.parse.quote(fname.replace(" ", "_")))
    page = page.replace("://en.wikipedia.org/", "://commons.wikimedia.org/")
    return {
        "file": fname,
        "thumb": clean_thumb(info.get("thumburl") or info.get("url", "")),
        "page": page,
        "license": lic,
        "licenseUrl": lic_url,
        "artist": strip_html(meta(em, "Artist"), 120),
        "desc": strip_html(meta(em, "ImageDescription"), 200),
    }


# ---------------------------------------------------------------- main -----

def main():
    cache_dir = None
    if "--cache" in sys.argv:
        cache_dir = sys.argv[sys.argv.index("--cache") + 1]

    with open(IN_PATH, encoding="utf-8") as f:
        titles = list(json.load(f).keys())
    print("titles: %d" % len(titles), file=sys.stderr)

    images = cached(cache_dir, "images.json", lambda: fetch_article_images(titles))

    ranked = {t: rank_candidates(images.get(t, []), t)[:CANDIDATES_PER_TITLE] for t in titles}
    wanted = sorted({f for c in ranked.values() for f in c})
    print("candidate files: %d" % len(wanted), file=sys.stderr)

    info_cache = {}
    if cache_dir and os.path.exists(os.path.join(cache_dir, "imageinfo.json")):
        with open(os.path.join(cache_dir, "imageinfo.json"), encoding="utf-8") as f:
            info_cache = json.load(f)
    missing = [f for f in wanted if f not in info_cache]
    if missing:
        info_cache.update(fetch_imageinfo(missing))
        for f in missing:
            info_cache.setdefault(f, None)
        if cache_dir:
            with open(os.path.join(cache_dir, "imageinfo.json"), "w", encoding="utf-8") as f:
                json.dump(info_cache, f, ensure_ascii=False)

    result = {}
    for t in titles:
        for fname in ranked[t]:
            info = info_cache.get(fname)
            lic = acceptable(info)
            if lic:
                result[t] = build_record(fname, info, lic)
                break

    os.makedirs(os.path.dirname(OUT_PATH), exist_ok=True)
    with open(OUT_PATH, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=1, sort_keys=True)
    print("wrote %s: %d/%d titles with maps" % (OUT_PATH, len(result), len(titles)), file=sys.stderr)


if __name__ == "__main__":
    main()
