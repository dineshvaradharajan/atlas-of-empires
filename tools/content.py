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
    with open(os.path.join(ROOT, "public", "data", "supplements.json"), "w") as fh:
        json.dump(supplements, fh, ensure_ascii=False, separators=(",", ":"))

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

    out = os.path.join(ROOT, "public", "data", "content.json")
    with open(out, "w") as fh:
        json.dump({"eras": eras, "empires": empires, "moments": moments, "journeys": journeys}, fh, ensure_ascii=False, separators=(",", ":"))
    with open(os.path.join(ROOT, "content", "empires.json"), "w") as fh:
        json.dump(empires, fh, ensure_ascii=False, indent=1)
    print(f"{len(eras)} eras, {len(empires)} empires, {len(moments)} moments, {len(journeys)} journeys, {len(seen_clio)} clio links, {len(seen_alias)} aliases -> {os.path.relpath(out, ROOT)} ({os.path.getsize(out) // 1024} KB)")
    for pr in problems:
        print("  !", pr)


if __name__ == "__main__":
    main()
