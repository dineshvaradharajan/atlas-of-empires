#!/usr/bin/env python3
"""Crawlable pages for search engines and AI assistants, built from the atlas's own data.

The atlas is one page whose views live behind hash links (#e/<id>, #w/<id>, #m/<id>, #1683/Ottoman Empire), so a
crawler sees a single page. This step writes a plain HTML page for every empire, war, moment, chapter, realm and
ancient site, with its text, structured data and a button that opens the atlas at the same view:

  /empires/<id>/  /wars/<id>/  /moments/<id>/  /eras/<year>/  /realms/<name>/  /sites/<id>/   (+ an index for each)
  /sitemap.xml (index of one sitemap per section)   /llms.txt   /404.html

Reads public/data (content.json, clio/index.json, media.json, sites.json, commons.json). The output is not
committed (see .gitignore): tools/deploy.sh runs this on the exported release, and you can run it locally to look:

  python3 -I tools/seo.py [--public DIR]
"""
import argparse
import html
import json
import math
import os
import re
import shutil
import sys
import unicodedata
from urllib.parse import quote

SITE = "https://www.worldatlas.site"
NAME = "The World Atlas"
TAGLINE = "An interactive map of world history from 10,000 BCE to today"
SECTIONS = {"empires": "Empires", "wars": "Wars", "moments": "Moments", "eras": "Chapters", "realms": "Realms", "sites": "Ancient sites"}
OUTPUTS = list(SECTIONS) + ["sitemap.xml", "llms.txt", "404.html"]  # plus sitemap-<section>.xml
REGIONS = {"southern-africa": "Southern Africa", "northern-africa": "Northern Africa", "europe": "Europe",
           "middle-east-south-asia": "Middle East & South Asia", "north-central-asia": "Northern & Central Asia",
           "east-asia": "East Asia", "southeast-asia": "Southeast Asia", "northern-north-america": "Northern North America",
           "southern-north-america": "Southern North America", "northern-south-america": "Northern South America",
           "southern-cone": "Southern Cone", "australasia": "Australasia & Oceania"}
DEFAULT_IMAGE = SITE + "/og.png"


def esc(s):
    return html.escape(str(s if s is not None else ""), quote=True)


def slug(s):
    s = unicodedata.normalize("NFKD", str(s)).encode("ascii", "ignore").decode().lower()
    return re.sub(r"[^a-z0-9]+", "-", s).strip("-")


def clean(name):  # Cliopatria writes groups of realms in brackets: "(Warring States China)"
    return re.sub(r"^\((.*)\)$", r"\1", name)


def yr(y):
    if y is None:
        return ""
    n = f"{abs(y):,}" if abs(y) >= 10000 else str(abs(y))
    return f"{n} BCE" if y < 0 else n


def span(a, b):
    if b is None or b >= PRESENT:
        return f"{yr(a)} – today" if a < 0 else f"since {a}"
    if a == b:
        return yr(a)
    if a < 0 and b < 0:
        return f"{yr(a).replace(' BCE', '')}–{yr(b)}"
    if a < 0:
        return f"{yr(a)} – {b} CE"
    return f"{a}–{b}"


def iso(y):  # ISO 8601 uses astronomical years: 1 BCE is 0000, 431 BCE is -0430
    a = y + 1 if y < 0 else y
    return f"-{-a:04d}" if a < 0 else f"{a:04d}"


def squash(s):
    return re.sub(r"\s+", " ", str(s or "")).strip()


def clip(s, n=158):
    s = squash(s)
    if len(s) <= n:
        return s
    cut = s[: n - 1]
    end = max(cut.rfind(". "), cut.rfind("; "))
    if end > n * 0.6:
        return cut[: end + 1]
    return cut[: cut.rfind(" ")].rstrip(",;:—–- ") + "…"


def sentences(s, k=2):
    parts = re.split(r"(?<=[.!?])\s+(?=[A-Z0-9“\"'])", squash(s))
    return " ".join(parts[:k])


def lede(text, k=2):  # the opening sentences large, the rest as plain paragraphs
    parts = re.split(r"(?<=[.!?])\s+(?=[A-Z0-9“\"'])", squash(text))
    head, rest = " ".join(parts[:k]), " ".join(parts[k:])
    return f'<p class="lede">{esc(head)}</p>' + (f"<p>{esc(rest)}</p>" if rest else "")


def km2(a):
    return f"{a / 1e6:.2f} million km²" if a >= 1e6 else f"{round(a):,} km²"


def app(hash_):
    return "/#" + hash_


def app_realm(year, name):  # the map's timeline runs from 10,000 BCE; there is no year 0
    year = max(-10000, min(PRESENT, year)) or 1
    return app(f"{year}/{quote(name, safe='')}")


# ---------------------------------------------------------------- page shell
def page(path, title, description, body, crumbs=(), image=None, image_alt="", jsonld=(), kind="article"):
    url = SITE + path
    image = image or DEFAULT_IMAGE
    trail = [("Home", "/")] + list(crumbs)
    ld = [{"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
        {"@type": "ListItem", "position": i + 1, "name": n, "item": SITE + h} for i, (n, h) in enumerate(trail)]}]
    ld += list(jsonld)
    crumbs_html = " <span aria-hidden=\"true\">›</span> ".join(
        f'<a href="{esc(h)}">{esc(n)}</a>' for n, h in trail[:-1]) if len(trail) > 1 else ""
    nav = "".join(f'<a href="/{k}/">{esc(v)}</a>' for k, v in SECTIONS.items())
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{esc(title)}</title>
<meta name="description" content="{esc(description)}">
<link rel="canonical" href="{esc(url)}">
<meta property="og:site_name" content="{NAME}">
<meta property="og:type" content="{kind}">
<meta property="og:title" content="{esc(title)}">
<meta property="og:description" content="{esc(description)}">
<meta property="og:url" content="{esc(url)}">
<meta property="og:image" content="{esc(image)}">
<meta property="og:image:alt" content="{esc(image_alt or title)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{esc(title)}">
<meta name="twitter:description" content="{esc(description)}">
<meta name="twitter:image" content="{esc(image)}">
<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" href="/favicon-32.png" type="image/png" sizes="32x32">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<meta name="theme-color" content="#ffffff">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@600;800&amp;family=Inter:wght@400;600&amp;display=swap" rel="stylesheet">
<link rel="stylesheet" href="/pages.css">
<script type="application/ld+json">{json.dumps(ld if len(ld) > 1 else ld[0], ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")}</script>
</head>
<body>
<header class="top"><a class="brand" href="/"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18"/></svg>THE WORLD ATLAS</a><nav aria-label="Sections">{nav}</nav></header>
<main class="page">
{f'<nav class="crumbs" aria-label="Breadcrumb">{crumbs_html}</nav>' if crumbs_html else ''}
{body}
</main>
<footer class="foot"><p><a href="/">{NAME}</a>: an interactive map of world history from 10,000 BCE to today. Borders from <a href="https://github.com/Seshat-Global-History-Databank/cliopatria">Cliopatria</a> (CC BY 4.0) and <a href="https://www.naturalearthdata.com/">Natural Earth</a>; text written for the atlas (MIT). <a href="/#about">About and sources</a>.</p><nav aria-label="Browse">{nav}</nav></footer>
</body>
</html>
"""


def ttl(base, suffix="", short=""):  # keep titles short enough for a search result: shorten the suffix first
    for x in (suffix, short):
        if x and len(f"{base}{x} | {NAME}") <= 72:
            return f"{base}{x} | {NAME}"
    return f"{base}{short} | {NAME}"


def cta(href, text):
    return f'<p class="cta"><a class="btn" href="{esc(href)}">{esc(text)} <span aria-hidden="true">→</span></a></p>'


def figure(img):
    if not img or not img.get("image"):
        return ""
    cap, credit, lic = img.get("caption") or "", img.get("credit") or "", img.get("license") or ""
    who = " · ".join(x for x in (credit, lic) if x)
    link = f' <a href="{esc(img["page"])}">{esc(who)}</a>' if img.get("page") and who else (f" {esc(who)}" if who else "")
    return f'<figure><img src="{esc(img["image"])}" alt="{esc(cap)}" loading="lazy"><figcaption>{esc(cap)}{link}</figcaption></figure>'


def facts(rows):
    rows = [(k, v) for k, v in rows if v]
    if not rows:
        return ""
    return '<dl class="facts">' + "".join(f"<div><dt>{esc(k)}</dt><dd>{v}</dd></div>" for k, v in rows) + "</dl>"


def links(items, title):  # items: (href, label, note)
    items = [x for x in items if x]
    if not items:
        return ""
    lis = "".join(f'<li><a href="{esc(h)}">{esc(t)}</a>{f" <span>{esc(n)}</span>" if n else ""}</li>' for h, t, n in items)
    return f'<section><h2>{esc(title)}</h2><ul class="links">{lis}</ul></section>'


def sources(src):
    src = [s for s in (src or []) if s.get("url", "").startswith("http")]
    if not src:
        return ""
    lis = "".join(f'<li><a href="{esc(s["url"])}" rel="noopener">{esc(s.get("title") or s["url"])}</a></li>' for s in src)
    return f'<section class="sources"><h2>Sources</h2><ul>{lis}</ul></section>'


def timeline(events, title="Timeline"):
    if not events:
        return ""
    lis = []
    for e in events:
        when = e.get("label") or e.get("yearLabel") or yr(e.get("year"))
        detail = f'<p>{esc(e["detail"])}</p>' if e.get("detail") else ""
        lis.append(f'<li><time>{esc(when)}</time><div><b>{esc(e.get("text") or e.get("title") or "")}</b>{detail}</div></li>')
    return f'<section><h2>{esc(title)}</h2><ol class="timeline">{"".join(lis)}</ol></section>'


def article_ld(path, headline, description, image, about=None, extra=None):
    d = {"@context": "https://schema.org", "@type": "Article", "headline": headline[:110], "description": description,
         "url": SITE + path, "mainEntityOfPage": SITE + path, "image": image or DEFAULT_IMAGE, "inLanguage": "en",
         "isPartOf": {"@type": "WebSite", "name": NAME, "url": SITE + "/"},
         "author": {"@type": "Organization", "name": NAME, "url": SITE + "/"},
         "publisher": {"@type": "Organization", "name": NAME, "url": SITE + "/", "logo": {"@type": "ImageObject", "url": SITE + "/icon-512.png"}}}
    if about:
        d["about"] = about
    if extra:
        d.update(extra)
    return d


def wiki(title):
    return "https://en.wikipedia.org/wiki/" + quote(title.replace(" ", "_"), safe="_(),'-.:")


# The app corrects some Cliopatria timelines on load (content/corrections.json, app.js correctTimelines); do the same
# so dates and areas here match the map, and realms the app drops get no page.
def split_rows(tl, a, b):
    inside, outside = [], []
    for f, t, ar in tl:
        if t < a or f > b:
            outside.append([f, t, ar])
            continue
        if f < a:
            outside.append([f, a - 1, ar])
        inside.append([max(f, a), min(t, b), ar])
        if t > b:
            outside.append([b + 1, t, ar])
    return inside, outside


def sum_rows(a, b):
    cuts = sorted({y for f, t, _ in a + b for y in (f, t + 1)})
    at = lambda tl, y: next((ar for f, t, ar in tl if f <= y <= t), 0)
    out = []
    for i in range(len(cuts) - 1):
        f, t = cuts[i], cuts[i + 1] - 1
        v = at(a, f) + at(b, f)
        if v > 0:
            out.append([f, t, v])
    return out


def correct_timelines(R, corr):
    for name, c in corr.items():
        r = R.get(name)
        if not r:
            continue
        if c.get("clip"):
            r["tl"] = split_rows(r["tl"], *c["clip"][:2])[0]
        for h in c.get("hide") or []:
            r["tl"] = split_rows(r["tl"], h[0], h[1])[1]
        for p in c.get("asPeople") or []:
            r["tl"] = split_rows(r["tl"], p["from"], p["to"])[1]
        for rl in c.get("relabel") or []:
            inside, r["tl"] = split_rows(r["tl"], rl["from"], rl["to"])
            if not inside:
                continue
            if rl.get("addTo"):
                for t in rl["addTo"]:
                    if t in R:
                        R[t]["tl"] = sum_rows(R[t]["tl"], inside)
                continue
            if rl["key"].startswith("("):
                continue
            tgt = R.setdefault(rl["key"], {"tl": []})
            tgt["tl"] = sorted(tgt["tl"] + inside, key=lambda x: x[0])
        if not r["tl"]:
            del R[name]


def ring_area(coords):  # km² of a lon/lat ring on the sphere, as d3.geoArea (the smaller side of the ring)
    tot = 0.0
    for (x1, y1), (x2, y2) in zip(coords, coords[1:] + coords[:1]):
        tot += math.radians(x2 - x1) * (2 + math.sin(math.radians(y1)) + math.sin(math.radians(y2)))
    sr = abs(tot) / 2
    return round(min(sr, 4 * math.pi - sr) * 6371 * 6371)


def add_supplements(R, supps):  # reconstruction layers become realms in the app too (app.js prepareSupplements)
    recon = {}
    for sp in supps:
        for rg in sp["regions"]:
            f = rg["from"] if rg.get("from") is not None else sp["from"]
            t = rg["to"] if rg.get("to") is not None else sp["to"]
            if rg["name"] not in R:
                R[rg["name"]] = {"tl": [], "recon": True}
            R[rg["name"]]["tl"] = sorted(R[rg["name"]]["tl"] + [[f, t, ring_area(rg["coords"])]], key=lambda x: x[0])
            if R[rg["name"]].get("recon"):
                recon.setdefault(rg["name"], []).append((sp, rg))
    return recon


# ---------------------------------------------------------------- build
def main():
    global PRESENT
    ap = argparse.ArgumentParser()
    ap.add_argument("--public", default=os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "public"))
    P = ap.parse_args().public
    J = lambda *p: json.load(open(os.path.join(P, "data", *p), encoding="utf-8"))
    C, clio_ix, media, sites, commons = J("content.json"), J("clio", "index.json"), J("media.json"), J("sites.json"), J("commons.json")
    R = clio_ix["realms"]
    correct_timelines(R, J("corrections.json").get("realms") or {})
    recon = add_supplements(R, J("supplements.json"))
    culture_realm = {rg.get("key") or rg["name"]: n for n, lst in recon.items() for sp, rg in lst if sp.get("kind") == "cultures"}
    PRESENT = clio_ix["range"][1]
    empires, wars, moments, journeys, eras = C["empires"], C["wars"], C["moments"], C["journeys"], C["eras"]
    eras = sorted(eras, key=lambda e: e["year"])
    moments = sorted(moments, key=lambda m: (m["year"], m["title"]))
    sites = sorted(sites, key=lambda s: (s["built"] if s["built"] is not None else PRESENT, s["name"]))

    # ---- ids, slugs and cross-references
    by_clio, journey_of = {}, {}
    for e in empires:
        for c in e["clio"]:
            by_clio.setdefault(c, e)
    for j in journeys:
        journey_of.setdefault(j["profile"], j)
    emp_pages = list(empires) + [{"id": j["id"], "name": j["name"], "journeyOnly": j} for j in journeys
                                 if j["profile"] not in {e["id"] for e in empires}]
    emp_path = {e["id"]: f"/empires/{e['id']}/" for e in emp_pages}
    journey_page = {j["id"]: emp_path.get(j["profile"]) or emp_path[j["id"]] for j in journeys}

    realm_slug, taken = {}, set()
    for n in sorted(R, key=lambda n: (bool(R[n].get("group")), R[n]["tl"][0][0], n)):
        s = slug(clean(n)) or "realm"
        if s in taken:
            s = f"{s}-{slug(yr(R[n]['tl'][0][0]))}"
        while s in taken:
            s += "-x"
        taken.add(s)
        realm_slug[n] = s
    realm_path = lambda n: f"/realms/{realm_slug[n]}/"
    plain_slugs = {slug(n) for n in R if not R[n].get("group")}
    peak_of = lambda n: max(R[n]["tl"], key=lambda r: r[2])
    r_start = lambda n: R[n]["tl"][0][0]
    r_end = lambda n: R[n]["tl"][-1][1]
    members_of = {}
    for n, r in R.items():
        for g in r.get("memberOf") or []:
            members_of.setdefault(g, []).append(n)

    era_slug = lambda y: slug(yr(y))
    era_path = lambda e: f"/eras/{era_slug(e['year'])}/"
    def era_at(y):
        best = eras[0]
        for e in eras:
            if e["year"] <= y:
                best = e
        return best
    def era_range(i):
        return eras[i]["year"], eras[i + 1]["year"] if i + 1 < len(eras) else PRESENT + 1

    wars_by_clio, eras_by_clio, journeys_by_clio = {}, {}, {}
    for w in wars:
        for side in w["sides"]:
            for m in side["members"]:
                wars_by_clio.setdefault(m["clio"], [])
                if w not in wars_by_clio[m["clio"]]:
                    wars_by_clio[m["clio"]].append(w)
    for e in eras:
        for p in e["powers"]:
            if p.get("clio"):
                eras_by_clio.setdefault(p["clio"], [])
                if e not in eras_by_clio[p["clio"]]:
                    eras_by_clio[p["clio"]].append(e)
    for j in journeys:
        for link in j["chain"]:
            journeys_by_clio.setdefault(link["clio"], j)
    wars_for_moment = {}
    for w in wars:
        if w.get("moment"):
            wars_for_moment.setdefault(w["moment"], []).append(w)
    moment_ids = {m["id"] for m in moments}

    def realm_link(n, note=None):
        return (realm_path(n), clean(n), note if note is not None else span(r_start(n), r_end(n))) if n in R else None

    def realm_text_link(n):
        return f'<a href="{esc(realm_path(n))}">{esc(clean(n))}</a>' if n in R else esc(clean(n))

    pages = {k: [] for k in ["pages"] + list(SECTIONS)}  # (path, title, description) for the sitemap and llms.txt
    out = []  # (path, html)

    def emit(section, path, title, description, html_, label=None):
        pages[section].append((path, label or title, description))
        out.append((path, html_))

    # ---- empires
    def empire_app(e):
        j = journey_of.get(e["id"]) or e.get("journeyOnly")
        if j:
            return app(f"e/{quote(j['id'], safe='')}"), "Follow its story on the map"
        y = (e.get("peak") or {}).get("year")
        alive = [(c, next(a for f, t, a in R[c]["tl"] if f <= y <= t)) for c in e["clio"]
                 if c in R and y is not None and any(f <= y <= t for f, t, _ in R[c]["tl"])]
        if alive:
            return app_realm(y, max(alive, key=lambda x: x[1])[0]), "See it on the map"
        cs = [c for c in e["clio"] if c in R]
        if cs:
            c = max(cs, key=lambda c: peak_of(c)[2])
            return app_realm(peak_of(c)[0], c), "See it on the map"
        return app(str(e.get("start", 0))), "See the map"

    for e in emp_pages:
        path = emp_path[e["id"]]
        j = journey_of.get(e["id"]) or e.get("journeyOnly")
        if e.get("journeyOnly"):
            a, b = j["span"]
            clios = [l["clio"] for l in j["chain"]]
            summary, legacy, rulers, capital, peak, region, aliases, src = j["summary"], "", [], "", None, None, [], j["sources"]
        else:
            a, b = e["start"], e["end"]
            clios = list(e["clio"])
            summary, legacy, rulers, capital, peak = e["summary"], e.get("legacy"), e.get("rulers") or [], e.get("capital"), e.get("peak")
            region, aliases, src = REGIONS.get(e.get("region")), [x for x in e.get("aliases") or [] if x != e["name"]], e.get("sources")
            if j:
                src = (src or []) + [s for s in j["sources"] if s["url"] not in {x["url"] for x in src or []}]
        when = span(a, b)
        lead = (media.get(f"empire:{e['id']}") or [None])[0]
        href, label = empire_app(e)
        desc = clip(f"{e['name']} ({when}): {sentences(summary, 2)}")
        title = ttl(f"{e['name']} ({when})", ": history, rulers and map", ": history")
        body = f'<p class="kicker">Empire · {esc(when)}{f" · {esc(region)}" if region else ""}</p><h1>{esc(e["name"])}</h1>'
        if aliases:
            body += f'<p class="sub">Also known as {esc(", ".join(aliases))}</p>'
        body += lede(summary) + cta(href, label) + figure(lead)
        pk = ""
        if peak and peak.get("year") is not None:
            pk = esc(f"{yr(peak['year'])}" + (f", about {km2(peak['areaKm2'])}" if peak.get("areaKm2") else ""))
        body += facts([("Years", esc(when)), ("Capital", esc(capital)), ("Greatest extent", pk), ("Region", esc(region))])
        if peak and peak.get("note"):
            body += f'<p class="note">{esc(peak["note"])}</p>'
        if legacy:
            body += f'<section><h2>Legacy</h2><p>{esc(legacy)}</p></section>'
        if j:
            body += timeline(j["events"], f"Timeline of {e['name']}")
            if j.get("reigns"):
                body += '<section><h2>Periods and reigns</h2><ul class="links">' + "".join(
                    f'<li>{esc(r["name"])} <span>{esc(span(r["from"], r["to"]))}</span></li>' for r in j["reigns"]) + "</ul></section>"
        if rulers:
            body += '<section><h2>Rulers</h2><ul class="rulers">' + "".join(
                f'<li><b>{esc(r["name"])}</b>{f" <span>{esc(r["reign"])}</span>" if r.get("reign") else ""}{f"<p>{esc(r["note"])}</p>" if r.get("note") else ""}</li>'
                for r in rulers) + "</ul></section>"
        body += links([realm_link(c) for c in dict.fromkeys(clios)], "Realms on the map")
        ws = []
        for c in clios:
            for w in wars_by_clio.get(c, []):
                if w not in ws:
                    ws.append(w)
        body += links([(f"/wars/{w['id']}/", w["name"], w["dateLabel"]) for w in sorted(ws, key=lambda w: w["span"][0])], "Wars")
        es = []
        for c in clios:
            for x in eras_by_clio.get(c, []):
                if x not in es:
                    es.append(x)
        body += links([(era_path(x), f"The world in {yr(x['year'])}: {x['title']}", None) for x in sorted(es, key=lambda x: x["year"])], "Chapters")
        body += sources(src)
        about = {"@type": "Country", "name": e["name"]}
        same = [s["url"] for s in (src or []) if "wikipedia.org/wiki/" in s["url"]][:1]
        if same:
            about["sameAs"] = same
        ld = article_ld(path, f"{e['name']} ({when})", desc, lead and lead["image"], about,
                        {"temporalCoverage": f"{iso(a)}/{iso(b) if b is not None and b < PRESENT else '..'}"})
        emit("empires", path, title, desc, page(path, title, desc, body, [("Empires", "/empires/"), (e["name"], path)],
                                                lead and lead["image"], lead and lead["caption"], [ld]), f"{e['name']} ({when})")

    # ---- wars
    for w in wars:
        path = f"/wars/{w['id']}/"
        desc = clip(f"{w['name']} ({w['dateLabel']}): {sentences(w['summary'], 2)}")
        title = ttl(f"{w['name']} ({span(*w['span'])})", ": timeline and map", ": timeline")
        body = f'<p class="kicker">War · {esc(w["dateLabel"])}</p><h1>{esc(w["name"])}</h1>' + lede(w["summary"])
        body += cta(app(f"w/{quote(w['id'], safe='')}"), "Watch the war on the map")
        body += facts([("Dates", esc(w["dateLabel"])), ("Casualties", esc(w.get("casualties")))])
        sides = ""
        for s in w["sides"]:
            ms = "".join(f'<li>{realm_text_link(m["clio"])} <span>{esc(span(m["from"], m["to"]))}</span>'
                         f'{f" · part of <a href=\"{esc(emp_path[by_clio[m["clio"]]["id"]])}\">{esc(by_clio[m["clio"]]["name"])}</a>" if m["clio"] in by_clio and by_clio[m["clio"]]["name"] != clean(m["clio"]) else ""}</li>'
                         for m in s["members"])
            sides += f'<div><h3>{esc(s["name"])}</h3><ul class="links">{ms}</ul></div>'
        if sides:
            body += f'<section><h2>The sides</h2><div class="sides">{sides}</div></section>'
        body += timeline(w["events"], f"Timeline of the {w['name']}" if not w["name"].startswith("The ") else "Timeline")
        rel = []
        if w.get("moment") in moment_ids:
            m = next(m for m in moments if m["id"] == w["moment"])
            rel.append((f"/moments/{m['id']}/", m["title"], m["yearLabel"]))
        a, b = w["span"]
        rel += [(era_path(x), f"The world in {yr(x['year'])}: {x['title']}", None) for i, x in enumerate(eras)
                if era_range(i)[0] <= b and a < era_range(i)[1]]
        body += links(rel, "Related")
        body += links([(f"/wars/{x['id']}/", x["name"], x["dateLabel"]) for x in wars
                       if x is not w and x["span"][0] <= b + 50 and x["span"][1] >= a - 50], "Other wars of the time")
        body += sources(w["sources"])
        first_ll = next((ev.get("lonlat") for ev in w["events"] if ev.get("lonlat")), None)
        about = {"@type": "Event", "name": w["name"], "startDate": iso(a), "endDate": iso(b),
                 "eventStatus": "https://schema.org/EventScheduled"}
        if first_ll:
            about["location"] = {"@type": "Place", "geo": {"@type": "GeoCoordinates", "longitude": first_ll[0], "latitude": first_ll[1]}}
        same = [s["url"] for s in w["sources"] if "wikipedia.org/wiki/" in s["url"]][:1]
        if same:
            about["sameAs"] = same
        ld = article_ld(path, f"{w['name']} ({w['dateLabel']})", desc, None, about, {"temporalCoverage": f"{iso(a)}/{iso(b)}"})
        emit("wars", path, title, desc, page(path, title, desc, body, [("Wars", "/wars/"), (w["name"], path)], jsonld=[ld]),
             f"{w['name']} ({w['dateLabel']})")

    # ---- moments
    for i, m in enumerate(moments):
        path = f"/moments/{m['id']}/"
        img = (media.get(f"moment:{m['id']}") or [None])[0]
        desc = clip(f"{m['title']} ({m['yearLabel']}, {m['place']}): {sentences(m['summary'], 2)}")
        title = ttl(f"{m['title']} ({m['yearLabel'] if len(m['yearLabel']) <= 22 else yr(m['year'])})")
        body = f'<p class="kicker">{esc(m["category"].capitalize())} · {esc(m["yearLabel"])}</p><h1>{esc(m["title"])}</h1>'
        body += f'<p class="sub">{esc(m["place"])}</p>' + lede(m["summary"])
        body += cta(app(f"m/{quote(m['id'], safe='')}"), "See it on the map") + figure(img)
        body += f'<section><h2>Why it mattered</h2><p>{esc(m["why"])}</p></section>'
        if m.get("also"):
            body += f'<section><h2>Elsewhere</h2><p>{esc(m["also"])}</p></section>'
        x = era_at(m["year"])
        rel = [(era_path(x), f"The world in {yr(x['year'])}: {x['title']}", "chapter")]
        rel += [(f"/wars/{w['id']}/", w["name"], w["dateLabel"]) for w in wars_for_moment.get(m["id"], [])]
        if i > 0:
            rel.append((f"/moments/{moments[i - 1]['id']}/", moments[i - 1]["title"], "previous moment · " + moments[i - 1]["yearLabel"]))
        if i + 1 < len(moments):
            rel.append((f"/moments/{moments[i + 1]['id']}/", moments[i + 1]["title"], "next moment · " + moments[i + 1]["yearLabel"]))
        body += links(rel, "Related") + sources(m["sources"])
        about = {"@type": "Event", "name": m["title"], "startDate": iso(m["year"]),
                 "location": {"@type": "Place", "name": m["place"], "geo": {"@type": "GeoCoordinates", "longitude": m["lonlat"][0], "latitude": m["lonlat"][1]}}}
        ld = article_ld(path, f"{m['title']} ({m['yearLabel']})", desc, img and img["image"], about, {"temporalCoverage": iso(m["year"])})
        emit("moments", path, title, desc, page(path, title, desc, body, [("Moments", "/moments/"), (m["title"], path)],
                                                img and img["image"], img and img["caption"], [ld]), f"{m['title']} ({m['yearLabel']})")

    # ---- eras (the atlas's chapters)
    for i, e in enumerate(eras):
        path = era_path(e)
        lo, hi = era_range(i)
        y = yr(e["year"])
        desc = clip(f"The world in {y}, {e['title']}: {sentences(e['overview'], 2)}")
        title = f"The world in {y}: {e['title']} | {NAME}"
        body = f'<p class="kicker">Chapter · {esc(e["age"])}</p><h1>{esc(e["title"])}</h1><p class="sub">The world in {esc(y)}</p>'
        body += lede(e["overview"])
        body += cta(app(str(e["year"])), f"Open the map in {y}")
        if e.get("powers"):
            lis = ""
            for p in e["powers"]:
                n = p.get("clio")
                target = emp_path.get(by_clio[n]["id"]) if n in by_clio else (realm_path(n) if n in R else None)
                nm = f'<a href="{esc(target)}">{esc(p["name"])}</a>' if target else esc(p["name"])
                bits = [f"Ruler: {p['ruler']}" if p.get("ruler") else "", f"Capital: {p['capital']}" if p.get("capital") else "", p.get("extent") or ""]
                lis += f'<li><b>{nm}</b><p>{esc(" · ".join(b for b in bits if b))}</p></li>'
            body += f'<section><h2>The great powers</h2><ul class="rulers">{lis}</ul></section>'
        if e.get("regions"):
            body += "<section><h2>Region by region</h2>" + "".join(
                f'<h3>{esc(REGIONS.get(k, k))}</h3><p>{esc(v)}</p>' for k, v in e["regions"].items() if v) + "</section>"
        if e.get("events"):
            body += timeline([{"year": x["year"], "text": x["text"]} for x in e["events"]], "Events")
        body += links([(f"/moments/{m['id']}/", m["title"], m["yearLabel"]) for m in moments if lo <= m["year"] < hi], "Moments of this period")
        body += links([(f"/wars/{w['id']}/", w["name"], w["dateLabel"]) for w in wars if w["span"][0] < hi and w["span"][1] >= lo], "Wars of this period")
        nb = []
        if i > 0:
            nb.append((era_path(eras[i - 1]), f"The world in {yr(eras[i - 1]['year'])}: {eras[i - 1]['title']}", "previous chapter"))
        if i + 1 < len(eras):
            nb.append((era_path(eras[i + 1]), f"The world in {yr(eras[i + 1]['year'])}: {eras[i + 1]['title']}", "next chapter"))
        body += links(nb, "More chapters") + sources(e["sources"])
        ld = article_ld(path, f"The world in {y}: {e['title']}", desc, None, None, {"temporalCoverage": iso(e["year"])})
        emit("eras", path, title, desc, page(path, title, desc, body, [("Chapters", "/eras/"), (f"{y}: {e['title']}", path)], jsonld=[ld]),
             f"The world in {y}: {e['title']}")

    # ---- realms (every state in the border data)
    for n in sorted(R, key=lambda n: (r_start(n), n)):
        r, path, name = R[n], realm_path(n), clean(n)
        a, b = r_start(n), r_end(n)
        if n in recon:
            regs = recon[n]
            pk = peak_of(n)
            culture = regs[0][0].get("kind") == "cultures"
            rg0 = regs[0][1]
            when = rg0.get("dateLabel") if culture and rg0.get("dateLabel") else span(a, b)
            text = rg0.get("summary") if culture else " ".join(dict.fromkeys(squash(rg.get("note")) for _, rg in regs if rg.get("note")))
            text = text or regs[0][0].get("summary") or ""
            desc = clip(f"{name} ({when}): {sentences(text, 2)}")
            title = ttl(f"{name} ({when if len(when) <= 24 else span(a, b)})", ": archaeological culture" if culture else ": history and map", " on the map")
            body = f'<p class="kicker">{"Archaeological culture" if culture else "Realm · reconstruction"} · {esc(when)}</p><h1>{esc(name)}</h1>'
            body += lede(text) + cta(app_realm(pk[0], n), f"See {name} on the map in {yr(pk[0])}")
            caps = list(dict.fromkeys(rg["capital"] for _, rg in regs if rg.get("capital")))
            rul = [x for _, rg in regs for x in rg.get("rulers") or []]
            body += facts([("On the map", esc(span(a, b))), ("Capital", esc("; ".join(caps))),
                           ("Ports", esc(", ".join(dict.fromkeys(p for _, rg in regs for p in rg.get("ports") or [])))),
                           ("Attested in", esc("; ".join(dict.fromkeys(rg["attested"] for _, rg in regs if rg.get("attested")))))])
            if culture and rg0.get("evidenceNote"):
                body += f'<section><h2>How we know</h2><p>{esc(rg0["evidenceNote"])}</p></section>'
            if rul:
                seen = list(dict.fromkeys((x["name"], x.get("when") or "") for x in rul))
                body += '<section><h2>Rulers named in the sources</h2><ul class="links">' + "".join(
                    f'<li>{esc(nm)}{f" <span>{esc(w)}</span>" if w else ""}</li>' for nm, w in seen) + "</ul></section>"
            key = rg0.get("key") or n
            body += links([(f"/sites/{x['id']}/", x["name"], x["dateLabel"]) for x in sites if culture and x.get("culture") == key], "Sites")
            sps = list({id(sp): sp for sp, _ in regs}.values())
            if not culture:
                for sp in sps:
                    body += f'<section><h2>{esc(sp["title"])}</h2><p class="note">This realm is missing from the Cliopatria border data and is drawn from a reconstruction made for the atlas.</p><p>{esc(sp.get("summary") or "")}</p></section>'
            body += sources(rg0.get("sources") if culture and rg0.get("sources") else [x for sp in sps for x in sp.get("sources") or []])
            ld = article_ld(path, f"{name} ({when})", desc, None, {"@type": "Place" if culture else "Country", "name": name},
                            {"temporalCoverage": f"{iso(a)}/{iso(b)}"})
            emit("realms", path, title, desc, page(path, title, desc, body, [("Realms", "/realms/"), (name, path)], jsonld=[ld]), f"{name} ({when})")
            continue
        alive = b >= PRESENT - 1
        pk = peak_of(n)
        emp = by_clio.get(n)
        when = f"since {a}" if alive and a >= 0 else span(a, b)
        group = bool(r.get("group"))
        what = "Group of realms" if group else ("Country" if alive else "Realm")
        intro = (f"{name} is drawn on the map from {yr(a)} to {'today' if alive else yr(b)}. "
                 f"At its greatest recorded extent, in {yr(pk[0])}, it covered about {km2(pk[2])}.")
        if group:
            intro = (f"{name} groups several realms that the border data draws together, from {yr(a)} to {'today' if alive else yr(b)}. "
                     f"At its greatest recorded extent, in {yr(pk[0])}, its lands covered about {km2(pk[2])}.")
        desc = clip(intro + (f" Part of {emp['name']}." if emp and emp["name"] != name else ""))
        title = ttl(f"{name}{', all member realms' if group and slug(name) in plain_slugs else ''} ({when})", ": territory and map", " on the map")
        img = commons.get(r.get("wiki")) or (emp and commons.get(emp.get("name")))
        body = f'<p class="kicker">{what} · {esc(when)}</p><h1>{esc(name)}</h1><p class="lede">{esc(intro)}</p>'
        if emp:
            if emp["name"] != name:
                body += f'<p>One of the realms of <a href="{esc(emp_path[emp["id"]])}">{esc(emp["name"])}</a>. {esc(sentences(emp["summary"], 2))}</p>'
            else:
                body += f'<p>{esc(sentences(emp["summary"], 3))} <a href="{esc(emp_path[emp["id"]])}">More about {esc(emp["name"])}</a>.</p>'
        body += cta(app_realm(pk[0], n), f"See {name} on the map in {yr(pk[0])}")
        if img and img.get("thumb"):
            body += figure({"image": img["thumb"], "page": img.get("page"), "caption": f"Reference map: {re.sub(r'^File:|\.[a-z]+$', '', img.get('file') or '')}",
                            "credit": img.get("artist"), "license": img.get("license")})
        ext = [f'<a href="{esc(wiki(r["wiki"]))}" rel="noopener">Wikipedia: {esc(r["wiki"])}</a>'] if r.get("wiki") else []
        if r.get("wd"):
            ext.append(f'<a href="https://www.wikidata.org/wiki/{esc(r["wd"])}" rel="noopener">Wikidata {esc(r["wd"])}</a>')
        body += facts([("On the map", esc(span(a, b) if not alive else f"{yr(a)} – today")),
                       ("Greatest extent", esc(f"{yr(pk[0])}, about {km2(pk[2])}")),
                       ("Part of", ", ".join(realm_text_link(g) for g in r.get("memberOf") or [])),
                       ("Read more", " · ".join(ext))])
        rows = "".join(f"<tr><td>{esc(span(f, t))}</td><td>{esc(km2(ar))}</td></tr>" for f, t, ar in r["tl"])
        body += f'<section><h2>Territory through time</h2><table class="tl"><thead><tr><th>Years</th><th>Area drawn</th></tr></thead><tbody>{rows}</tbody></table></section>'
        body += links([realm_link(m) for m in sorted(members_of.get(n, []), key=lambda m: (r_start(m), m))], "Member realms")
        rel = []
        if emp:
            rel.append((emp_path[emp["id"]], emp["name"], "empire"))
        jr = journeys_by_clio.get(n)
        if jr and (not emp or journey_page[jr["id"]] != emp_path[emp["id"]]):
            rel.append((journey_page[jr["id"]], jr["name"], "empire story"))
        rel += [(f"/wars/{w['id']}/", w["name"], w["dateLabel"]) for w in wars_by_clio.get(n, [])]
        rel += [(era_path(x), f"The world in {yr(x['year'])}: {x['title']}", "chapter") for x in eras_by_clio.get(n, [])]
        body += links(rel, "Related")
        about = {"@type": "Country", "name": name}
        same = ([wiki(r["wiki"])] if r.get("wiki") else []) + ([f"https://www.wikidata.org/wiki/{r['wd']}"] if r.get("wd") else [])
        if same:
            about["sameAs"] = same
        ld = article_ld(path, f"{name} ({when})", desc, img and img.get("thumb"), about,
                        {"temporalCoverage": f"{iso(a)}/{'..' if alive else iso(b)}"})
        emit("realms", path, title, desc, page(path, title, desc, body, [("Realms", "/realms/"), (name, path)],
                                               img and img.get("thumb"), "Reference map of " + name, [ld]), f"{name} ({when})")

    # ---- ancient sites
    def dist(p, q):
        la1, la2 = math.radians(p[1]), math.radians(q[1])
        dl = math.radians(q[0] - p[0])
        return math.acos(max(-1, min(1, math.sin(la1) * math.sin(la2) + math.cos(la1) * math.cos(la2) * math.cos(dl))))

    for s in sites:
        path = f"/sites/{s['id']}/"
        img = s.get("image") if isinstance(s.get("image"), dict) else None
        kind = s["kind"].replace("-", " ")
        desc = clip(f"{s['name']} ({s['dateLabel']}): {sentences(s['summary'], 2)}")
        title = ttl(f"{s['name']}: {kind}", f", {s['dateLabel']}")
        body = f'<p class="kicker">Ancient site · {esc(kind.capitalize())}</p><h1>{esc(s["name"])}</h1>'
        if s.get("altNames"):
            body += f'<p class="sub">Also known as {esc(", ".join(s["altNames"]))}</p>'
        body += lede(s["summary"]) + cta(app(f"s/{quote(s['id'], safe='')}"), "See it on the map") + figure(img)
        body += facts([("Dates", esc(s["dateLabel"])), ("Still standing", "Yes" if s.get("standing") else "No, or only traces"),
                       ("UNESCO World Heritage", "Yes" if s.get("unesco") else ""),
                       ("Location", esc(f"{abs(s['lonlat'][1]):.2f}° {'N' if s['lonlat'][1] >= 0 else 'S'}, {abs(s['lonlat'][0]):.2f}° {'E' if s['lonlat'][0] >= 0 else 'W'}"))])
        if s.get("evidenceNote"):
            body += f'<section><h2>How we know</h2><p>{esc(s["evidenceNote"])}</p></section>'
        near = sorted((x for x in sites if x is not s), key=lambda x: dist(s["lonlat"], x["lonlat"]))[:6]
        body += links([(f"/sites/{x['id']}/", x["name"], x["dateLabel"]) for x in near], "Nearby sites")
        x = era_at(s["built"]) if s["built"] is not None and s["built"] >= eras[0]["year"] else None
        cul = culture_realm.get(s.get("culture"))
        body += links([(realm_path(cul), clean(cul), "archaeological culture") if cul else None,
                       (era_path(x), f"The world in {yr(x['year'])}: {x['title']}", "chapter") if x else None], "Related")
        body += sources(s["sources"])
        about = {"@type": "LandmarksOrHistoricalBuildings", "name": s["name"],
                 "geo": {"@type": "GeoCoordinates", "longitude": s["lonlat"][0], "latitude": s["lonlat"][1]}}
        ld = article_ld(path, s["name"], desc, img and img.get("image"), about)
        emit("sites", path, title, desc, page(path, title, desc, body, [("Ancient sites", "/sites/"), (s["name"], path)],
                                              img and img.get("image"), img and img.get("caption"), [ld]), f"{s['name']} ({s['dateLabel']})")

    # ---- section indexes
    def index_page(sec, heading, intro, groups):
        path = f"/{sec}/"
        n = sum(len(g[1]) for g in groups)
        title = f"{heading} | {NAME}"
        desc = clip(intro)
        body = f'<p class="kicker">{n:,} pages</p><h1>{esc(heading)}</h1><p class="lede">{esc(intro)}</p>'
        for gname, items in groups:
            lis = "".join(f'<li><a href="{esc(h)}">{esc(t)}</a>{f" <span>{esc(d)}</span>" if d else ""}</li>' for h, t, d in items)
            body += (f"<section><h2>{esc(gname)}</h2>" if gname else "<section>") + f'<ul class="links cols">{lis}</ul></section>'
        ld = {"@context": "https://schema.org", "@type": "CollectionPage", "name": heading, "url": SITE + path, "description": desc,
              "isPartOf": {"@type": "WebSite", "name": NAME, "url": SITE + "/"}, "mainEntity": {"@type": "ItemList", "numberOfItems": n,
              "itemListElement": [{"@type": "ListItem", "position": i + 1, "url": SITE + h} for i, (h, _, _) in enumerate(x for g in groups for x in g[1])][:1000]}}
        pages["pages"].append((path, heading, desc))
        out.append((path, page(path, title, desc, body, [(SECTIONS[sec], path)], jsonld=[ld], kind="website")))

    reg_groups = {}
    for e in emp_pages:
        reg = REGIONS.get(e.get("region"), "Other")
        a, b = (e["start"], e["end"]) if not e.get("journeyOnly") else e["journeyOnly"]["span"]
        reg_groups.setdefault(reg, []).append((a, (emp_path[e["id"]], e["name"], span(a, b))))
    index_page("empires", "Empires of world history",
               f"{len(emp_pages)} empires and kingdoms from Ancient Egypt to the present, each with its story, rulers, greatest extent and the realms it ruled, mapped year by year.",
               [(k, [x for _, x in sorted(v, key=lambda t: t[0])]) for k, v in sorted(reg_groups.items(), key=lambda kv: list(REGIONS.values()).index(kv[0]) if kv[0] in REGIONS.values() else 99)])
    index_page("wars", "Wars that redrew the map",
               f"{len(wars)} wars from the Peloponnesian War to today, each told event by event with the sides, front lines and casualties.",
               [("", [(f"/wars/{w['id']}/", w["name"], w["dateLabel"]) for w in sorted(wars, key=lambda w: w["span"][0])])])
    index_page("moments", "Moments that changed the world",
               f"{len(moments)} turning points in human history, from the first farmers to the present: what happened, where, and why it mattered.",
               [("", [(f"/moments/{m['id']}/", m["title"], m["yearLabel"]) for m in moments])])
    index_page("eras", "The world, chapter by chapter",
               f"{len(eras)} snapshots of the whole world from 3000 BCE to today: the great powers, every region and the events of each period.",
               [("", [(era_path(e), f"The world in {yr(e['year'])}: {e['title']}", e["age"]) for e in eras])])
    letters = {}
    for n in sorted(R, key=lambda n: slug(clean(n))):
        k = slug(clean(n))[:1].upper()
        letters.setdefault(k if k.isalpha() else "#", []).append((realm_path(n), clean(n), span(r_start(n), r_end(n))))
    index_page("realms", "Every realm on the map",
               f"All {len(R):,} states, kingdoms, empires, countries and archaeological cultures drawn in the atlas, from the first farming cultures to today, with the land each held through time.",
               sorted(letters.items()))
    index_page("sites", "Ancient sites",
               f"{len(sites)} ancient sites, from rock art 45,000 years old to the cities of the first empires: what they were, how they are dated and where they stand.",
               [("", [(f"/sites/{s['id']}/", s["name"], s["dateLabel"]) for s in sites])])

    # ---- 404 (a real "not found" also stops Cloudflare Pages serving the map for every unknown path)
    body404 = ('<h1>Page not found</h1><p class="lede">There is no page at this address. The map and every story start from the home page.</p>'
               + cta("/", "Open the atlas") + links([(f"/{k}/", v, None) for k, v in SECTIONS.items()], "Browse"))
    out.append(("/404.html", page("/404.html", f"Page not found | {NAME}", "This page isn't in the atlas.", body404, kind="website")
                .replace('<link rel="canonical" href="https://www.worldatlas.site/404.html">\n', '<meta name="robots" content="noindex">\n')))

    # ---- write
    for k in OUTPUTS:
        p = os.path.join(P, k)
        if os.path.isdir(p):
            shutil.rmtree(p)
        elif os.path.exists(p):
            os.remove(p)
    for f in os.listdir(P):
        if re.match(r"sitemap-.*\.xml$", f):
            os.remove(os.path.join(P, f))
    paths = set()
    for path, h in out:
        assert path not in paths, path
        paths.add(path)
        fp = os.path.join(P, path.lstrip("/"), "index.html") if path.endswith("/") else os.path.join(P, path.lstrip("/"))
        os.makedirs(os.path.dirname(fp), exist_ok=True)
        with open(fp, "w", encoding="utf-8") as fh:
            fh.write(h)

    # every internal link must land on a page
    bad = set()
    for path, h in out:
        for href in re.findall(r'href="(/[^"#]*)"', h):
            if href not in paths and not os.path.exists(os.path.join(P, href.lstrip("/"))) and href != "/":
                bad.add((path, href))
    if bad:
        for b in sorted(bad)[:20]:
            print("broken link:", *b, file=sys.stderr)
        sys.exit(f"{len(bad)} broken internal links")

    # ---- sitemaps
    def urlset(items):
        return ('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
                + "".join(f"<url><loc>{esc(SITE + p)}</loc></url>\n" for p in items) + "</urlset>\n")
    maps = []
    for sec, items in [("pages", ["/"] + [p for p, _, _ in pages["pages"]])] + [(k, [p for p, _, _ in pages[k]]) for k in SECTIONS]:
        name = f"sitemap-{sec}.xml"
        open(os.path.join(P, name), "w", encoding="utf-8").write(urlset(items))
        maps.append(name)
    open(os.path.join(P, "sitemap.xml"), "w", encoding="utf-8").write(
        '<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + "".join(f"<sitemap><loc>{SITE}/{m}</loc></sitemap>\n" for m in maps) + "</sitemapindex>\n")

    # ---- llms.txt (https://llmstxt.org)
    L = [f"# {NAME}", "",
         f"> {TAGLINE}: who ruled what in any year, how far every empire reached, the wars that redrew the map and the moments that "
         "changed it. State borders come from Cliopatria (Seshat Global History Databank, CC BY 4.0) and Natural Earth; the narrative "
         "text is written for the atlas and cites its sources on every page.", "",
         f"The interactive map is at {SITE}/ . Every page below is plain HTML with the same text the map shows, and a link that "
         "opens the map at that view. Years are written as in the atlas: negative or BCE years before the common era.", ""]
    def sec(title, key, limit=None):
        L.append(f"## {title}")
        L.append("")
        L.append(f"- [{SECTIONS.get(key, title)}: all pages]({SITE}/{key}/)")
        for p, t, d in pages[key][:limit]:
            L.append(f"- [{t}]({SITE}{p}): {d}")
        L.append("")
    sec("Chapters: the whole world at 49 moments in time", "eras")
    sec("Empires", "empires")
    sec("Wars", "wars")
    sec("Moments that changed the world", "moments")
    L += ["## Optional", "",
          f"- [Every realm on the map]({SITE}/realms/): {len(R):,} states, countries and archaeological cultures with their territory through time",
          f"- [Ancient sites]({SITE}/sites/): {len(sites)} archaeological sites",
          f"- [Sitemap]({SITE}/sitemap.xml)",
          "- [Source code and data](https://github.com/dineshvaradharajan/atlas-of-empires)", ""]
    open(os.path.join(P, "llms.txt"), "w", encoding="utf-8").write("\n".join(L))

    n = {k: len(v) for k, v in pages.items()}
    print(f"seo: {len(out)} pages ({', '.join(f'{v} {k}' for k, v in n.items())}), {len(maps)} sitemaps, llms.txt")


if __name__ == "__main__":
    main()
