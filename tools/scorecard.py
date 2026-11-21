#!/usr/bin/env python3
"""Accuracy scorecard: run every map check, then put their headline numbers on one page.

Runs, one after another (each writes its own report in content/factcheck/):
  claims    tools/borders/check_borders.py  sourced "this place belonged to this realm in this year" claims
  cow       tools/check_cow.py              dated territorial changes, Correlates of War (1816-1991)
  cshapes   tools/check_cshapes.py          state borders, CShapes 2.0 (1886-1991)
  awmc      tools/check_awmc.py             ancient Mediterranean empires, AWMC
  chgis     tools/check_chgis.py            Chinese dynasties, CHGIS V6 (221 BCE-1911)
  geo       tools/check_geo.py              historical-basemaps world snapshots (3000 BCE-2010)
  lint      tools/maplint.py                drawing problems (slivers, fragments, blocky borders, overlaps)

then reads the numbers out of those reports and writes content/factcheck/scorecard.md (readable) and
scorecard.json (the numbers, so the next run can show what changed). Read-only for the map data.

    python3 -I tools/scorecard.py                 run every check, then write the scorecard
    python3 -I tools/scorecard.py --reuse         only re-read the reports already on disk
    python3 -I tools/scorecard.py --only cow,geo  run these checks, re-read the rest
"""
import argparse, datetime, json, os, re, statistics, subprocess, sys, time

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FC = os.path.join(ROOT, "content", "factcheck")
OUT_MD, OUT_JSON = os.path.join(FC, "scorecard.md"), os.path.join(FC, "scorecard.json")

# key: (script, report it writes, reference, years covered)
CHECKS = {
    "claims": ("tools/borders/check_borders.py", "border-check.md", "Sourced claims (content/borders/claims-*.json)", "all years"),
    "cow": ("tools/check_cow.py", "cow-check.md", "Correlates of War territorial changes v6", "1816–1991"),
    "cshapes": ("tools/check_cshapes.py", "cshapes-check.md", "CShapes 2.0 (ETH Zurich)", "1886–1991"),
    "awmc": ("tools/check_awmc.py", "awmc-check.md", "AWMC (Ancient World Mapping Center)", "500 BCE–314 CE"),
    "chgis": ("tools/check_chgis.py", "chgis-check.md", "CHGIS V6 (Harvard, Fudan)", "221 BCE–1911"),
    "geo": ("tools/check_geo.py", "geo-check.md", "historical-basemaps (Ourednik)", "3000 BCE–2000"),
    "lint": ("tools/maplint.py", "map-lint.md", "Map lint (no reference: drawing faults)", "sampled years, war stages"),
}


def num(s):
    return int(s.replace(",", ""))


def grab(pattern, text, cast=num):
    m = re.search(pattern, text)
    return cast(m.group(1)) if m else None


def pct(a, b):
    return round(100 * a / b, 1) if a is not None and b else None


def table(text, heading):
    """Rows (lists of cells) of the first markdown table under a ## heading."""
    m = re.search(rf"^## {re.escape(heading)}\n(.*?)(?=^## |\Z)", text, re.S | re.M)
    if not m:
        return []
    rows = [[c.strip() for c in ln.strip().strip("|").split("|")] for ln in m.group(1).splitlines() if ln.startswith("|")]
    return [r for r in rows[2:] if r]  # skip the header and the |---| line


# Each reader returns (headline, score or None, details: list of (label, value), numbers: dict for the change column)

def read_claims(t):
    ok, n = (grab(r"Claims: ([\d,]+) of", t), grab(r"Claims: [\d,]+ of ([\d,]+) pass", t))
    nums = {"claims pass": ok, "claims": n,
            "overlapping states": grab(r"Overlapping independent states: ([\d,]+)", t),
            "dates off from Wikidata": grab(r"Realm dates off from Wikidata: ([\d,]+)", t),
            "areas off": grab(r"Peak area/year off from published estimates: ([\d,]+)", t),
            "gaps and jumps": grab(r"Gaps and jumps: ([\d,]+)", t)}
    det = [("Claims that pass", f"{ok:,} of {n:,}" if ok is not None else None)] + [(k[0].upper() + k[1:], v) for k, v in nums.items() if k not in ("claims pass", "claims")]
    return (f"{ok:,} of {n:,} claims pass" if ok is not None else None), pct(ok, n), det, nums


def read_cow(t):
    pts = grab(r"Of the ([\d,]+) points:", t)
    match, one, two = grab(r"points: ([\d,]+) match", t), grab(r"([\d,]+) are one year off", t), grab(r"([\d,]+) differ by 2 years", t)
    never = grab(r"([\d,]+) never show the change", t)
    ind, ind_ok, ind_one = grab(r"Independences: ([\d,]+);", t), grab(r"COW year \(or the next\) for ([\d,]+)", t), grab(r"Independences:.*?one year off for ([\d,]+)", t)
    near = (match or 0) + (one or 0) if match is not None else None
    nums = {"transfers within a year": near, "transfers tested": pts, "2+ years off": two, "never shown": never,
            "independences within a year": (ind_ok or 0) + (ind_one or 0) if ind_ok is not None else None, "independences": ind}
    det = [("Transfers on the right year (or the next)", match), ("One year off", one), ("Two or more years off", two),
           ("Change never drawn", never), ("Independences within a year", f"{nums['independences within a year']} of {ind}" if ind else None)]
    return (f"{near} of {pts} transfers within a year" if pts else None), pct(near, pts), det, nums


def read_cshapes(t):
    nums = {"territory disagreements": grab(r"- ([\d,]+) territory disagreements", t),
            "different state, peacetime": grab(r"([\d,]+) where the two give the land to different states outside wartime", t),
            "atlas blank": grab(r"([\d,]+) gaps where CShapes has a state and the atlas draws nothing", t),
            "area off >10%": grab(r"- ([\d,]+) runs where a state's total area differs", t),
            "independence dates 2+ years off": grab(r"- ([\d,]+) date differences of 2 years or more", t),
            "realms mostly outside their state": grab(r"- ([\d,]+) linked atlas realms lie mostly outside", t)}
    det = [("Disagreements over 10,000 km² (runs of years)", nums["territory disagreements"]),
           ("… land given to a different state in peacetime", nums["different state, peacetime"]),
           ("… CShapes has a state, the atlas draws nothing", nums["atlas blank"]),
           ("State area off by more than 10%", nums["area off >10%"]),
           ("Independence dates 2+ years off", nums["independence dates 2+ years off"]),
           ("Realms lying mostly outside their state", nums["realms mostly outside their state"])]
    n = nums["different state, peacetime"], nums["atlas blank"]
    head = f"{n[0]} wrong-owner and {n[1]} blank runs to check" if None not in n else None
    return head, None, det, nums


def read_awmc(t):
    rows = [r for r in table(t, "Summary") if len(r) >= 6 and r[5].endswith("%")]
    layers = [(re.sub(r"\[(.*?)\]\(.*?\)", r"\1", r[0]), int(r[5][:-1])) for r in rows]
    if not layers:
        return None, None, [], {}
    med = statistics.median(v for _, v in layers)
    return (f"median shape overlap {med:g}% across {len(layers)} layers", med,
            [(name, f"{v}% overlap") for name, v in layers], {"median overlap %": med})


def read_chgis(t):
    med = grab(r"median sample year the atlas's Chinese realms cover (\d+)%", t)
    low = re.search(r"Lowest coverage: ([^.\n]+)", t)
    other = grab(r"- ([\d,]+) runs where CHGIS administers", t)
    beyond = grab(r"; ([\d,]+) runs where the atlas draws a Chinese realm on land CHGIS shows as not administered", t)
    det = [("Median share of CHGIS land the atlas covers", f"{med}%" if med is not None else None),
           ("Lowest years", low.group(1) if low else None),
           ("Runs where CHGIS land goes to another realm or is blank", other),
           ("Runs where the atlas draws China beyond CHGIS", beyond)]
    return (f"atlas covers {med}% of Chinese-administered land (median year)" if med is not None else None), med, det, \
        {"median coverage %": med, "runs given away or blank": other, "runs beyond": beyond}


def read_geo(t):
    rows = [r for r in table(t, "Per snapshot") if len(r) >= 5 and r[4].endswith("%")]
    if not rows:
        return None, None, [], {}
    def yr(s):
        return -int(s.split()[0]) if "BCE" in s else int(s)
    def weighted(sel):
        w = sum(num(r[2]) for r in sel)
        return round(sum(num(r[2]) * int(r[4][:-1]) for r in sel) / w, 1) if w else None
    old, new = [r for r in rows if yr(r[0]) <= 1815], [r for r in rows if yr(r[0]) > 1815]
    a_old, a_new = weighted(old), weighted(new)
    miss = len([ln for ln in re.findall(r"^## Missing: .*?\n(.*?)(?=^## )", t, re.S | re.M)[0].splitlines() if ln.startswith("| ") and not ln.startswith("| Year")]) if "## Missing: " in t else None
    det = [("Snapshots compared", len(rows)), ("Land agreeing, 1880–2000 (weighted by state land)", f"{a_new}%"),
           ("Land agreeing, 3000 BCE–1815 (snapshots approximate)", f"{a_old}%"),
           ("Worst snapshot", min(((int(r[4][:-1]), r[0]) for r in rows if yr(r[0]) >= -500))[1] + " (from 500 BCE on)")]
    return f"{a_new}% of land agrees 1880–2000, {a_old}% before 1816", a_new, det, \
        {"agree % 1880-2000": a_new, "agree % before 1816": a_old, "missing blocks": miss}


def read_lint(t):
    nums = {"slivers": grab(r"## Slivers of unclaimed land: ([\d,]+)", t),
            "fragments": grab(r"## Fragments cut off by a narrow gap: ([\d,]+)", t),
            "blocky realms": grab(r"## Blocky \(stair-stepped\) borders: ([\d,]+)", t),
            "overlap pairs": grab(r"## Overlaps between colour groups: ([\d,]+)", t),
            "war grey strips": grab(r"## Grey strips in war stages: ([\d,]+)", t)}
    det = [(k[0].upper() + k[1:], v) for k, v in nums.items()]
    tot = sum(v for v in nums.values() if v)
    return f"{tot:,} drawing problems listed", None, det, nums


READERS = {"claims": read_claims, "cow": read_cow, "cshapes": read_cshapes, "awmc": read_awmc,
           "chgis": read_chgis, "geo": read_geo, "lint": read_lint}


def run(key):
    script = CHECKS[key][0]
    report = os.path.join(FC, CHECKS[key][1])
    before = os.path.getmtime(report) if os.path.exists(report) else 0
    t = time.time()
    print(f"{key}: running {script} …", file=sys.stderr, flush=True)
    p = subprocess.run([sys.executable, "-I", os.path.join(ROOT, script)], cwd=ROOT, capture_output=True, text=True)
    secs = time.time() - t
    fresh = os.path.exists(report) and os.path.getmtime(report) > before
    # check_borders exits 1 when a claim fails: that is a result, not a crash
    status = "ran" if fresh else "failed"
    tail = (p.stderr or p.stdout).strip().splitlines()[-3:]
    print(f"{key}: {status} in {secs:.0f} s" + ("" if fresh else " — " + " | ".join(tail)), file=sys.stderr, flush=True)
    return {"status": status, "seconds": round(secs), "error": None if fresh else " | ".join(tail)}


def fmt(v):
    return "—" if v is None else f"{v:,}" if isinstance(v, int) else str(v)


def change(new, old):
    if not isinstance(new, (int, float)) or not isinstance(old, (int, float)) or new == old:
        return ""
    d = new - old
    return f" ({'+' if d > 0 else ''}{d:g})" if isinstance(d, float) else f" ({d:+,})"


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("--reuse", action="store_true", help="do not run the checks; re-read the reports on disk")
    ap.add_argument("--only", default="", help="comma-separated checks to run (the rest are re-read): " + ",".join(CHECKS))
    a = ap.parse_args()
    only = [k for k in a.only.split(",") if k]
    bad = [k for k in only if k not in CHECKS]
    if bad:
        ap.error(f"unknown check(s): {', '.join(bad)}")
    prev = {}
    if os.path.exists(OUT_JSON):
        try:
            prev = json.load(open(OUT_JSON)).get("checks", {})
        except ValueError:
            prev = {}

    res = {}
    for key in CHECKS:
        r = run(key) if not a.reuse and (not only or key in only) else {"status": "re-read", "seconds": None, "error": None}
        path = os.path.join(FC, CHECKS[key][1])
        if os.path.exists(path):
            text = open(path, encoding="utf-8").read()
            r["report_date"] = datetime.date.fromtimestamp(os.path.getmtime(path)).isoformat()
            try:
                head, score, det, nums = READERS[key](text)
            except Exception as e:  # a report whose wording changed: say so rather than guess
                head, score, det, nums = None, None, [], {}
                r["error"] = f"could not read the report ({type(e).__name__}: {e})"
            if head is None and not r["error"]:
                r["error"] = "could not find the headline numbers in the report"
        else:
            head, score, det, nums = None, None, [], {}
            r["error"] = r["error"] or "no report yet"
        r.update(headline=head, score=score, details=det, numbers=nums)
        res[key] = r

    today = datetime.date.today().isoformat()
    L = [f"# Map accuracy scorecard\n",
         f"Written by `tools/scorecard.py` on {today}. Each row is one check of the map against an independent reference "
         f"(or, for map lint, against itself); the full report is linked. Figures in brackets are the change since the "
         f"previous scorecard{' (' + json.load(open(OUT_JSON)).get('date', '') + ')' if prev else ''}.\n",
         "A mismatch is a lead, not a verdict: each one is checked against a published source before the map is changed "
         "(the reports' *checked by hand* sections record those verdicts).\n",
         "| Check | Reference | Years | Result | Report |", "|---|---|---|---|---|"]
    for key, r in res.items():
        _, rep, ref, yrs = CHECKS[key]
        pk = prev.get(key, {}).get("score")
        head = (r["headline"] or f"*{r['error']}*") + change(r["score"], pk)
        L.append(f"| {key} | {ref} | {yrs} | {head} | [{rep}]({rep}) ({r.get('report_date', '—')}) |")
    L.append("")
    for key, r in res.items():
        L.append(f"## {key}: {CHECKS[key][2]}\n")
        if r["error"]:
            L.append(f"> {r['error']}\n")
        old = prev.get(key, {}).get("numbers", {})
        for label, v in r["details"]:
            nk = next((k for k, val in r["numbers"].items() if isinstance(v, int) and val == v), None)  # a plain count: show its change
            L.append(f"- {label}: {fmt(v)}{change(v, old.get(nk)) if nk else ''}")
        how = {"ran": f"ran in {r['seconds']} s", "re-read": "report re-read, not re-run", "failed": "the check failed to run"}[r["status"]]
        L.append(f"\n*{how}; script `{CHECKS[key][0]}`*\n")
    L.append("## Not covered\n")
    L.append("No independent reference is checked for the world before 1816 outside the Mediterranean and China "
             "(South Asia, Africa, the Americas, South-east Asia) beyond the approximate historical-basemaps snapshots "
             "and Wikidata's dates. There, the sourced claims in content/borders/claims-*.json are the only precise test.\n")
    open(OUT_MD, "w", encoding="utf-8").write("\n".join(L))
    json.dump({"date": today, "checks": {k: {kk: r[kk] for kk in ("status", "seconds", "report_date", "headline", "score", "numbers", "error") if kk in r}
                                         for k, r in res.items()}}, open(OUT_JSON, "w"), ensure_ascii=False, indent=1)
    for key, r in res.items():
        print(f"  {key:8} {r['headline'] or r['error']}")
    print(f"-> {os.path.relpath(OUT_MD, ROOT)}")
    return 1 if any(r["status"] == "failed" for r in res.values()) else 0


if __name__ == "__main__":
    sys.exit(main())
