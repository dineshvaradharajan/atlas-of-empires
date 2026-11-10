#!/usr/bin/env python3
"""Merge content/eras/*.json + content/empires/*.json into public/data/content.json
and report any `map` names / aliases that don't exist in the border data.

Run after editing content:  python3 -I tools/content.py
(If you change empire aliases, also re-run tools/build.py so extent timelines regroup.)
"""
import glob
import json
import os
import re
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
NAMES = os.path.join(ROOT, "data", "names")
REGIONS = {"southern-africa", "northern-africa", "europe", "middle-east-south-asia", "north-central-asia",
           "east-asia", "southeast-asia", "northern-north-america", "southern-north-america",
           "northern-south-america", "southern-cone", "australasia"}


def names_for(year):
    path = os.path.join(NAMES, f"{year}.txt")
    if not os.path.exists(path):
        return set()
    return {ln.split("\t")[0] for ln in open(path) if ln.strip() and not ln.startswith("#")}


STOP = {"the", "of", "and", "empire", "kingdom", "dynasty", "state", "states", "realm", "period", "first", "second",
          "early", "late", "great", "republic", "sultanate", "khanate", "emirate", "under", "rule", "in"}


def stem(t):
    for suf in ("ians", "ian", "ans", "an", "ese", "ic", "s"):
        if len(t) > len(suf) + 3 and t.endswith(suf):
            return t[: -len(suf)]
    return t


def toks(s):
    s = re.sub(r"[()'’,.\-/]", " ", s.lower())
    return {stem(t) for t in s.split() if t not in STOP and len(t) > 1}


def load_clio():
    path = os.path.join(ROOT, "public", "data", "clio", "index.json")
    return json.load(open(path))["realms"] if os.path.exists(path) else {}


def active(realms, year):
    return {n: next(a for f, t, a in r["tl"] if f <= year <= t) for n, r in realms.items()
            if any(f <= year <= t for f, t, _ in r["tl"])}


realms_wiki = {}


def tok_eq(a, b):
    return a == b or (min(len(a), len(b)) >= 4 and (a.startswith(b) or b.startswith(a)))


def fuzzy_j(want, have):
    """Jaccard similarity where 'maury'~'maurya', 'kiev'~'kievan', 'muscov'~'moscow' don't count; prefixes do."""
    if not have:
        return 0.0
    hit = sum(1 for w in want if any(tok_eq(w, h) for h in have))
    return hit / (len(want) + len(have) - hit)


def resolve_power(pw, year, act, by_profile):
    """Best Cliopatria realm for an era 'power' entry at that year, or None."""
    name = pw["name"]
    for cand in by_profile.get(name.lower(), []):
        if cand in act:
            return cand
    want = toks(name) | toks(pw.get("map") or "")
    best, score = None, 0.0
    for n, area in act.items():
        nn = n.strip("()")
        if nn.lower() == name.lower():
            return n
        have = toks(nn)
        wiki = toks(realms_wiki.get(n, ""))
        if not want or not (have or wiki):
            continue
        j = max(fuzzy_j(want, h) for h in (have, wiki))
        # "Kingdom of Kerma (Kush)" vs "Kerma": every realm token appears in the request
        if have and all(any(tok_eq(h, w) for w in want) for h in have):
            j = max(j, 0.5 + 0.1 * len(have))
        if j > score or (j == score and best and area > act[best]):
            best, score = n, j
    return best if score >= 0.5 else None


def main():
    all_names = set()
    for p in glob.glob(os.path.join(NAMES, "*.txt")):
        all_names |= names_for(os.path.basename(p)[:-4])

    problems = []
    realms = load_clio()
    realms_wiki.update({n: r.get("wiki", "") for n, r in realms.items()})
    raw_empires = []
    for p in sorted(glob.glob(os.path.join(ROOT, "content", "empires", "*.json"))):
        raw_empires += json.load(open(p))
    by_profile = {}
    for e in raw_empires:
        for n in e.get("clio", []):
            by_profile.setdefault(e["name"].lower(), []).append(n)
    eras = []
    for p in sorted(glob.glob(os.path.join(ROOT, "content", "eras", "*.json"))):
        for e in json.load(open(p)):
            eras.append(e)
            have = names_for(e["year"])
            missing = REGIONS - set(e.get("regions", {}))
            if missing:
                problems.append(f"era {e['year']}: missing regions {sorted(missing)}")
            act = active(realms, e["year"]) if realms else {}
            for pw in e.get("powers", []):
                if pw.get("map") and pw["map"] not in have:
                    pw["map"] = None
                pw["clio"] = resolve_power(pw, e["year"], act, by_profile) if act else None
                if act and not pw["clio"]:
                    problems.append(f"era {e['year']}: no Cliopatria realm for {pw['name']!r}")
    eras.sort(key=lambda e: e["year"])

    empires, seen_ids, seen_alias, seen_clio = [], set(), {}, {}
    if True:
        for e in raw_empires:
            if e["id"] in seen_ids:
                problems.append(f"empire id duplicated: {e['id']}")
                continue
            seen_ids.add(e["id"])
            keep = []
            for a in e.get("aliases", []):
                if a not in all_names:
                    problems.append(f"empire {e['id']}: alias not in data: {a!r}")
                elif a in seen_alias:
                    problems.append(f"empire {e['id']}: alias {a!r} already used by {seen_alias[a]}")
                else:
                    seen_alias[a] = e["id"]
                    keep.append(a)
            e["aliases"] = keep
            ck = []
            for n in e.get("clio", []):
                if realms and n not in realms:
                    problems.append(f"empire {e['id']}: clio name not in Cliopatria: {n!r}")
                elif n in seen_clio:
                    problems.append(f"empire {e['id']}: clio {n!r} already used by {seen_clio[n]}")
                else:
                    seen_clio[n] = e["id"]
                    ck.append(n)
            e["clio"] = ck
            if not ck and realms:
                problems.append(f"empire {e['id']}: no Cliopatria link")
            empires.append(e)

    def check_sources(label, item):
        src = item.get("sources") or []
        bad = [x for x in src if not str(x.get("url", "")).startswith(("http://", "https://"))]
        if not src:
            problems.append(f"{label}: no sources")
        for x in bad:
            problems.append(f"{label}: dropped non-http source {x!r}")
        item["sources"] = [x for x in src if x not in bad]
    for e in eras:
        check_sources(f"era {e['year']}", e)
    for e in empires:
        check_sources(f"empire {e['id']}", e)

    # Map corrections: validate realm names against Cliopatria, then publish for the app.
    corr_path = os.path.join(ROOT, "content", "corrections.json")
    if os.path.exists(corr_path):
        corr = json.load(open(corr_path))
        for name, c in corr.get("realms", {}).items():
            if realms and name not in realms:
                problems.append(f"correction: realm not in Cliopatria: {name!r}")
            for r in c.get("relabel", []):
                if not all(k in r for k in ("from", "to", "name", "key")):
                    problems.append(f"correction {name!r}: relabel needs from/to/name/key")
        with open(os.path.join(ROOT, "public", "data", "corrections.json"), "w") as fh:
            json.dump(corr, fh, ensure_ascii=False, separators=(",", ":"))

    # Defining moments (content/moments.json): validate and include.
    moments = []
    seen = set()
    for mpath in sorted(glob.glob(os.path.join(ROOT, "content", "moments*.json"))):
        for m in json.load(open(mpath)):
            if m.get("id") in seen:
                problems.append(f"moment id duplicated: {m.get('id')}")
                continue
            seen.add(m.get("id"))
            ll = m.get("lonlat")
            if not (isinstance(ll, list) and len(ll) == 2 and -180 <= ll[0] <= 180 and -90 <= ll[1] <= 90):
                problems.append(f"moment {m.get('id')}: bad lonlat {ll!r}")
                m["lonlat"] = None
            check_sources(f"moment {m.get('id')}", m)
            moments.append(m)
    moments.sort(key=lambda m: m["year"])

    # Reconstruction layers (content/supplements/*.json): polities the border data lacks or draws too crudely.
    supplements = []
    for sp in sorted(glob.glob(os.path.join(ROOT, "content", "supplements", "*.json"))):
        sup = json.load(open(sp))
        ok = []
        for rg in sup.get("regions", []):
            ring = rg.get("coords") or []
            if len(ring) < 4 or ring[0] != ring[-1]:
                problems.append(f"supplement {sup.get('id')}: region {rg.get('name')!r} ring not closed")
                continue
            ok.append(rg)
        sup["regions"] = ok
        check_sources(f"supplement {sup.get('id')}", sup)
        supplements.append(sup)
    # Archaeological cultures (content/ancient/cultures-*.json) become one reconstruction layer of kind "cultures":
    # approximate regions with an evidence label, drawn dashed and clipped to land like other reconstructions.
    EVID = {"written", "archaeology", "disputed", "legendary"}
    regions, cids = [], set()
    for p in sorted(glob.glob(os.path.join(ROOT, "content", "ancient", "cultures-*.json"))):
        for cu in json.load(open(p)):
            if cu.get("id") in cids:
                problems.append(f"culture id duplicated: {cu.get('id')}"); continue
            cids.add(cu["id"])
            if cu.get("evidence") not in EVID:
                problems.append(f"culture {cu['id']}: evidence must be one of {sorted(EVID)}")
            if not cu.get("sources"):
                problems.append(f"culture {cu['id']}: no sources")
            for ex in cu.get("extents", []):
                ring = ex.get("coords") or []
                if len(ring) < 4 or any(not (-180 <= q[0] <= 180 and -90 <= q[1] <= 90) for q in ring):
                    problems.append(f"culture {cu['id']}: bad extent ring"); continue
                if ring[0] != ring[-1]:
                    ring = ring + [ring[0]]
                regions.append({"name": cu["name"], "key": cu["id"], "from": ex.get("from", cu["from"]), "to": ex.get("to", cu["to"]), "coords": ring,
                                "evidence": cu.get("evidence"), "evidenceNote": cu.get("evidenceNote"), "dateLabel": cu.get("dateLabel"),
                                "summary": cu.get("summary"), "sources": cu.get("sources", []), "note": cu.get("evidenceNote")})
    if regions:
        supplements.append({"id": "ancient-cultures", "kind": "cultures", "title": "Archaeological cultures",
                            "from": min(r["from"] for r in regions), "to": max(r["to"] for r in regions), "replaces": [],
                            "summary": "Approximate areas of archaeological cultures, drawn from where their sites and artefacts have been found. Most left no writing.",
                            "regions": regions, "sources": []})
    with open(os.path.join(ROOT, "public", "data", "supplements.json"), "w") as fh:
        json.dump(supplements, fh, ensure_ascii=False, separators=(",", ":"))

    # Ancient sites and monuments (content/ancient/sites-*.json): points shown while in use, with an evidence label.
    sites, sids = [], set()
    for p in sorted(glob.glob(os.path.join(ROOT, "content", "ancient", "sites-*.json"))):
        for st in json.load(open(p)):
            if st.get("id") in sids:
                problems.append(f"site id duplicated: {st.get('id')}"); continue
            sids.add(st["id"])
            ll = st.get("lonlat") or []
            if len(ll) != 2 or not (-180 <= ll[0] <= 180 and -90 <= ll[1] <= 90):
                problems.append(f"site {st['id']}: bad lonlat"); continue
            if st.get("evidence") not in EVID:
                problems.append(f"site {st['id']}: evidence must be one of {sorted(EVID)}")
            undated_legend = st.get("built") is None and st.get("evidence") == "legendary"  # a legend has no construction date
            if not undated_legend and (not isinstance(st.get("built"), int) or (st.get("until") is not None and st["until"] < st["built"])):
                problems.append(f"site {st['id']}: built/until must be years with until >= built"); continue
            img = st.get("image") or {}
            if img and not (str(img.get("image", "")).startswith("https://") and img.get("license") and str(img.get("page", "")).startswith("http")):
                problems.append(f"site {st['id']}: image dropped (needs https image, page and licence)"); st.pop("image", None)
            check_sources(f"site {st['id']}", st)
            sites.append(st)
    sites.sort(key=lambda x: x["built"] if x.get("built") is not None else 10 ** 6)
    with open(os.path.join(ROOT, "public", "data", "sites.json"), "w") as fh:
        json.dump(sites, fh, ensure_ascii=False, separators=(",", ":"))

    # Empire journeys (content/journeys/*.json): validate chains against Cliopatria and include.
    journeys, jids = [], set()
    profile_ids = {e["id"] for e in empires}
    for p in sorted(glob.glob(os.path.join(ROOT, "content", "journeys", "*.json"))):
        for j in json.load(open(p)):
            if j.get("id") in jids:
                problems.append(f"journey id duplicated: {j.get('id')}")
                continue
            jids.add(j["id"])
            j["chain"] = [c for c in j.get("chain", []) if not (realms and c.get("clio") not in realms and not problems.append(f"journey {j['id']}: chain realm not in Cliopatria: {c.get('clio')!r}"))]
            if j.get("profile") and j["profile"] not in profile_ids:
                problems.append(f"journey {j['id']}: unknown profile {j['profile']!r}")
                j["profile"] = None
            a0, a1 = j.get("span", [None, None])
            if a0 is None or a1 is None or a0 > a1:
                problems.append(f"journey {j['id']}: bad span {j.get('span')!r}")
                continue
            j["events"] = sorted([e for e in j.get("events", []) if a0 <= e.get("year", a0 - 1) <= a1], key=lambda e: e["year"])
            j["reigns"] = sorted([r for r in j.get("reigns", []) if isinstance(r.get("from"), int) and isinstance(r.get("to"), int)], key=lambda r: r["from"])
            check_sources(f"journey {j['id']}", j)
            journeys.append(j)
    journeys.sort(key=lambda j: j["span"][0])

    # Wars (content/wars/*.json): event-by-event playback with sides coloured on the map.
    wars, wids = [], set()
    for p in sorted(glob.glob(os.path.join(ROOT, "content", "wars", "*.json"))):
        for w in json.load(open(p)):
            if w.get("id") in wids:
                problems.append(f"war id duplicated: {w.get('id')}"); continue
            wids.add(w["id"])
            for sd in w.get("sides", []):
                keep = []
                for m in sd.get("members", []):
                    if realms and m.get("clio") not in realms:
                        problems.append(f"war {w['id']}: member not in map data: {m.get('clio')!r}")
                    else:
                        keep.append(m)
                sd["members"] = keep
            a0, a1 = w["span"]
            w["events"] = sorted([e for e in w.get("events", []) if a0 <= e.get("year", a0 - 1) <= a1],
                                 key=lambda e: (e["year"], str(e.get("date", ""))))
            check_sources(f"war {w['id']}", w)
            wars.append(w)
    wars.sort(key=lambda w: w["span"][0])

    # Cinematic war layers (content/cinema/<war>.json): front lines, occupied areas, offensives, battles, camera shots.
    cdir = os.path.join(ROOT, "public", "data", "cinema")
    os.makedirs(cdir, exist_ok=True)
    by_id = {w["id"]: w for w in wars}
    iso = re.compile(r"^-?\d{1,4}(-\d{2}(-\d{2})?)?$")
    for p in sorted(glob.glob(os.path.join(ROOT, "content", "cinema", "*.json"))):
        c = json.load(open(p))
        wid = c.get("war")
        if wid not in by_id:
            problems.append(f"cinema {os.path.basename(p)}: unknown war {wid!r}"); continue
        bad = []
        for grp in ("fronts", "occupations"):
            for x in c.get(grp, []):
                ks = x.get("keys", [])
                if [k["date"] for k in ks] != sorted(k["date"] for k in ks):
                    bad.append(f"{grp} {x.get('name')}: keyframes not in date order")
                for k in ks:
                    if not iso.match(str(k.get("date", ""))):
                        bad.append(f"{grp} {x.get('name')}: bad date {k.get('date')!r}")
                    pts = k.get("line") or k.get("coords") or []
                    if len(pts) < 2 or any(not (-180 <= q[0] <= 180 and -90 <= q[1] <= 90) for q in pts):
                        bad.append(f"{grp} {x.get('name')} {k.get('date')}: bad coordinates")
        for a in c.get("arrows", []):
            if len(a.get("path", [])) < 2 or str(a.get("start")) > str(a.get("end")):
                bad.append(f"arrow {a.get('name')}: bad path or dates")
        problems += [f"cinema {wid}: {b}" for b in bad]
        check_sources(f"cinema {wid}", c)
        with open(os.path.join(cdir, f"{wid}.json"), "w") as fh:
            json.dump(c, fh, ensure_ascii=False, separators=(",", ":"))
        by_id[wid]["cinema"] = True

    # Period newspapers and photos (content/media/*.json): only https images with a licence and a source page.
    media = {}
    for p in sorted(glob.glob(os.path.join(ROOT, "content", "media", "*.json"))):
        for key, items in json.load(open(p)).items():
            ok = [m for m in items if str(m.get("image", "")).startswith("https://") and str(m.get("page", "")).startswith(("https://", "http://")) and m.get("license")]
            if len(ok) < len(items):
                problems.append(f"media {key}: dropped {len(items) - len(ok)} item(s) without https image, page or licence")
            if ok:
                media[key] = ok
    with open(os.path.join(ROOT, "public", "data", "media.json"), "w") as fh:
        json.dump(media, fh, ensure_ascii=False, separators=(",", ":"))

    out = os.path.join(ROOT, "public", "data", "content.json")
    with open(out, "w") as fh:
        json.dump({"eras": eras, "empires": empires, "moments": moments, "journeys": journeys, "wars": wars}, fh, ensure_ascii=False, separators=(",", ":"))
    with open(os.path.join(ROOT, "content", "empires.json"), "w") as fh:
        json.dump(empires, fh, ensure_ascii=False, indent=1)
    print(f"{len(eras)} eras, {len(empires)} empires, {len(moments)} moments, {len(journeys)} journeys, {len(wars)} wars, {len(seen_clio)} clio links, {len(seen_alias)} aliases -> {os.path.relpath(out, ROOT)} ({os.path.getsize(out) // 1024} KB)")
    for pr in problems:
        print("  !", pr)


if __name__ == "__main__":
    main()
    # history checks for war cinema layers (fronts, occupations, arrows, claims): see tools/cinema/check_history.py
    if glob.glob(os.path.join(ROOT, "content", "cinema", "*.json")):
        r = subprocess.run([sys.executable, "-I", os.path.join(ROOT, "tools", "cinema", "check_history.py")], capture_output=True, text=True)
        print(r.stdout.splitlines()[0] if r.stdout else r.stderr.strip()[:300])
        if r.returncode:
            print("  ! history check found errors: see content/factcheck/history-check-*.md")
    # border claims (who held which place in which year): see tools/borders/check_borders.py (full run adds dates, areas, overlaps)
    if glob.glob(os.path.join(ROOT, "content", "borders", "claims-*.json")):
        r = subprocess.run([sys.executable, "-I", os.path.join(ROOT, "tools", "borders", "check_borders.py"), "--claims-only"], capture_output=True, text=True)
        print(r.stdout.strip().splitlines()[-1] if r.stdout.strip() else r.stderr.strip()[:300])
        if r.returncode:
            print("  ! border claims failing: see content/factcheck/border-check.md")
