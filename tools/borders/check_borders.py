#!/usr/bin/env python3
"""Border checks: are the atlas's empire borders right, in the right years?

Uses tools/borders/borders.py (the borders exactly as the app draws them, corrections included) and checks:
  claims     content/borders/claims-*.json: "this place belonged to this realm in this year" (sourced) -> ERRORS
  dates      each realm's first/last year on the map vs Wikidata inception/dissolution (content/borders/wikidata-dates.json)
  areas      peak area and peak year vs published estimates (content/borders/empire-areas.json: Taagepera, Turchin et al.)
  overlaps   two independent states drawn over the same land in the same year (1° grid over sample years)
  flicker    a realm that vanishes for a few years and returns, or jumps in size with no change of name
Writes content/factcheck/border-check.md (readable) and border-check.json (for reviewers). Exit 1 if any claim fails.
Run: python3 -I tools/borders/check_borders.py [--no-overlaps] [--claims-only]
"""
import glob, importlib.util, json, math, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location("borders", os.path.join(HERE, "borders.py"))
bm = importlib.util.module_from_spec(spec)
spec.loader.exec_module(bm)
ROOT = bm.ROOT

NOT_A_REALM = ("(Alliance", "(Allegiance", "(Personal union")
GENERIC = {"the", "of", "and", "empire", "kingdom", "republic", "dynasty", "state", "states", "city", "people", "peoples", "sultanate", "khanate", "caliphate", "period", "civilization", "first", "second", "third", "new", "old", "great", "late", "later", "early", "duchy", "principality", "confederation", "federation", "democratic", "united", "islamic", "socialist", "people's"}


def tokens(s):
    import re
    return {w for w in re.split(r"[^a-zà-ÿ]+", (s or "").lower()) if len(w) > 2 and w not in GENERIC}


OVERLAP_YEARS = [-1500, -1000, -500, -300, -200, 1, 200, 400, 600, 800, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1750, 1800, 1850, 1880, 1900, 1914, 1920, 1945, 1950, 1980, 2000, 2020]


def date_tol(y):
    return 100 if y < 1500 else 50 if y < 1800 else 10


def load_claims(trial=None):
    files = [trial] if trial else sorted(glob.glob(os.path.join(ROOT, "content", "borders", "claims-*.json")))
    out = []
    for f in files:
        for c in json.load(open(f)):
            c["_file"] = os.path.basename(f)
            out.append(c)
    return out


def main():
    args = sys.argv[1:]
    B = bm.Borders()
    realms = B.realms
    trial = os.environ.get("CLAIMS_FILE")
    out_dir = os.path.dirname(os.path.abspath(trial)) if trial or os.environ.get("CORRECTIONS_FILE") else os.path.join(ROOT, "content", "factcheck")
    rep = {"claims": [], "links": [], "dates": [], "areas": [], "overlaps": [], "flicker": []}
    errors = 0

    # claims
    for c in load_claims(trial):
        want = c.get("realm")
        want = set(want) if isinstance(want, list) else ({want} if want else set())
        hits = B.at(c["lonlat"], int(c["year"]))
        got = sorted({s.n for s in hits})
        names = set().union(*[s.names() for s in hits]) if hits else set()
        if not want:
            ok = not hits
        else:
            ok = bool(names & want)
        bad_not = sorted(names & set(c.get("not", [])))
        ok = ok and not bad_not
        rec = {"ok": ok, "place": c["place"], "year": c["year"], "lonlat": c["lonlat"], "expected": sorted(want) or ["(no state)"], "map": got or ["(nothing drawn)"],
               "region": c.get("region"), "source": c.get("source"), "file": c["_file"]}
        if bad_not:
            rec["forbidden"] = bad_not
        rep["claims"].append(rec)
        errors += 0 if ok else 1
    if "--claims-only" in args:
        return finish(rep, errors, out_dir)

    # corrected timelines
    tls = B.timelines()
    span = {n: (min(r[0] for r in tl), max(r[1] for r in tl)) for n, tl in tls.items() if tl}

    # dates vs Wikidata
    wd = json.load(open(os.path.join(ROOT, "content", "borders", "wikidata-dates.json")))["items"]
    for n, r in realms.items():
        q = r.get("wd")
        if not q or q not in wd or n not in span or n.startswith(NOT_A_REALM):
            continue
        s, e = wd[q]["start"], wd[q]["end"]
        a0, b0 = span[n]
        far = (s is not None and abs(a0 - s) > 1000) or (e is not None and b0 < 2023 and abs(b0 - e) > 1000)
        if far and not (tokens(n) & tokens(wd[q]["label"])):
            rep["links"].append({"realm": n, "wd": q, "label": wd[q]["label"], "wikidata_years": [s, e], "map_years": [a0, b0], "wiki": r.get("wiki")})
            continue
        a, b = span[n]
        for kind, ours, ref in (("starts", a, s), ("ends", b, e)):
            if ref is None or (kind == "ends" and b >= 2023):
                continue
            tol = date_tol(ref)
            if abs(ours - ref) > tol:
                rep["dates"].append({"realm": n, "kind": kind, "map": ours, "wikidata": ref, "diff": ours - ref, "wd": q, "label": wd[q]["label"]})
    rep["dates"].sort(key=lambda x: -abs(x["diff"]))

    # peak areas vs published estimates
    areas = json.load(open(os.path.join(ROOT, "content", "borders", "empire-areas.json")))["rows"]
    by_wiki = {}
    for n, r in realms.items():
        if r.get("wiki") and not n.startswith(NOT_A_REALM):
            by_wiki.setdefault(r["wiki"].replace("_", " "), []).append(n)
    for row in areas:
        names = by_wiki.get(row["title"]) or ([row["title"]] if row["title"] in tls else [])
        if not names:
            rep["areas"].append({"title": row["title"], "published_mkm2": row["peak_mkm2"], "published_year": row["peak_year"], "issue": "no realm on the map links to this article"})
            continue
        best = None
        for n in names:
            for f, t, ar in tls.get(n, []):
                if not best or ar > best[2]:
                    best = (n, f, ar)
        if not best:
            continue
        ratio = best[2] / 1e6 / row["peak_mkm2"]
        dy = (best[1] - row["peak_year"]) if row["peak_year"] is not None else None
        issue = []
        if ratio < 0.6 or ratio > 1.6:
            issue.append(f"peak area {best[2] / 1e6:.2f}M km² vs published {row['peak_mkm2']}M ({ratio:.0%})")
        if dy is not None and abs(dy) > 2 * date_tol(row["peak_year"]):
            issue.append(f"peak year {best[1]} vs published {row['peak_year']} ({dy:+d})")
        if issue:
            rep["areas"].append({"title": row["title"], "realm": best[0], "map_mkm2": round(best[2] / 1e6, 2), "map_year": best[1], "published_mkm2": row["peak_mkm2"], "published_year": row["peak_year"], "issue": "; ".join(issue)})

    # flicker: short gaps and unexplained jumps
    for n, tl in tls.items():
        tl = sorted(tl)
        if n.startswith(NOT_A_REALM) or max(r[2] for r in tl) < 100000:
            continue  # small polities and composite groups: too noisy to flag
        for (f0, t0, a0), (f1, t1, a1) in zip(tl, tl[1:]):
            gap = f1 - t0 - 1
            if 0 < gap <= 50:
                rep["flicker"].append({"realm": n, "issue": f"missing {t0 + 1}–{f1 - 1} ({gap} years), present before and after"})
            if f1 >= 1500 and min(a0, a1) > 50000 and gap == 0 and (a1 / a0 > 1.8 or a0 / a1 > 1.8):
                rep["flicker"].append({"realm": n, "issue": f"area jumps {a0:,.0f} → {a1:,.0f} km² at {f1}"})

    # overlaps on a 1° grid
    if "--no-overlaps" not in args:
        member = {n: r.get("memberOf") for n, r in realms.items()}
        mem = lambda n: member.get(n) if isinstance(member.get(n), list) else ([member[n]] if member.get(n) else [])
        for y in OVERLAP_YEARS:
            sts = B.states(y)
            cells = {}
            for i, s in enumerate(sts):
                for poly, b in zip(s.polys, s.bboxes):
                    for lo in range(math.floor(b[0]), math.ceil(b[2])):
                        for la in range(math.floor(b[1]), math.ceil(b[3])):
                            pt = (lo + 0.5, la + 0.5)
                            if s.contains(pt):
                                cells.setdefault(pt, set()).add(i)
            pairs = {}
            for pt, ids in cells.items():
                if len(ids) < 2:
                    continue
                ids = sorted(ids)
                for a in range(len(ids)):
                    for b2 in range(a + 1, len(ids)):
                        s1, s2 = sts[ids[a]], sts[ids[b2]]
                        if s1.k == s2.k or s1.n == s2.n or set(mem(s1.orig)) & s2.names() or set(mem(s2.orig)) & s1.names():
                            continue
                        key = tuple(sorted((s1.n, s2.n)))
                        pairs.setdefault(key, []).append(pt)
            for (a, b2), pts in pairs.items():
                if len(pts) >= 3:
                    xs = [p[0] for p in pts]; ys = [p[1] for p in pts]
                    rep["overlaps"].append({"year": y, "a": a, "b": b2, "cells": len(pts), "where": [round(sum(xs) / len(xs), 1), round(sum(ys) / len(ys), 1)]})
        rep["overlaps"].sort(key=lambda x: -x["cells"])
    return finish(rep, errors, out_dir)


def finish(rep, errors, out_dir):
    json.dump(rep, open(os.path.join(out_dir, "border-check.json"), "w"), ensure_ascii=False, indent=1)
    cl = rep["claims"]
    with open(os.path.join(out_dir, "border-check.md"), "w") as fh:
        fh.write("# Border check\n\nGenerated by tools/borders/check_borders.py.\n\n")
        fh.write(f"- Claims: {sum(c['ok'] for c in cl)} of {len(cl)} pass\n- Realms probably linked to the wrong Wikidata item: {len(rep['links'])}\n- Realm dates off from Wikidata: {len(rep['dates'])}\n- Peak area/year off from published estimates: {len(rep['areas'])}\n- Overlapping independent states: {len(rep['overlaps'])}\n- Gaps and jumps: {len(rep['flicker'])}\n\n")
        fh.write("## Failing claims\n" + ("".join(f"- {c['place']} {c['year']}: expected {', '.join(c['expected'])}; map shows {', '.join(c['map'])}{' (forbidden: ' + ', '.join(c['forbidden']) + ')' if c.get('forbidden') else ''} [{c['file']}]\n" for c in cl if not c["ok"]) or "- none\n"))
        fh.write("\n## Probably the wrong Wikidata item (names don't match, dates 1000+ years apart)\n" + "".join(f"- {l['realm']} → {l['wd']} '{l['label']}' (Wikidata {l['wikidata_years']}, map {l['map_years']})\n" for l in rep["links"]))
        fh.write("\n## Dates vs Wikidata (largest first)\n" + "".join(f"- {d['realm']} {d['kind']} {d['map']} on the map, {d['wikidata']} in Wikidata ({d['diff']:+d}; {d['wd']})\n" for d in rep["dates"][:400]))
        fh.write("\n## Areas vs published estimates\n" + "".join(f"- {a['title']}: {a['issue']}" + (f" (map realm: {a['realm']})" if a.get("realm") else "") + "\n" for a in rep["areas"]))
        fh.write("\n## Overlaps (largest first)\n" + "".join(f"- {o['year']}: {o['a']} × {o['b']}: {o['cells']} grid cells around {o['where']}\n" for o in rep["overlaps"][:400]))
        fh.write("\n## Gaps and jumps\n" + "".join(f"- {f['realm']}: {f['issue']}\n" for f in rep["flicker"][:400]))
    print(f"claims {sum(c['ok'] for c in cl)}/{len(cl)} pass · bad links {len(rep['links'])} · dates {len(rep['dates'])} · areas {len(rep['areas'])} · overlaps {len(rep['overlaps'])} · gaps/jumps {len(rep['flicker'])} -> {os.path.relpath(os.path.join(out_dir, 'border-check.md'), ROOT)}")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
