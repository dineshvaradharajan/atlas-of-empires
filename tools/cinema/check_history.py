#!/usr/bin/env python3
"""History checks for war cinema layers: does the map show what the text says, on the right dates?

Replays each war exactly as the app draws it (tools/cinema/geo.py) and checks:
  claims    chapter claims ("Lemberg held by the Russians on 3 Sep 1914") against who holds the place on the map
  arrows    an offensive's arrowhead at its end date must sit on its own side's ground or near the front
  battles   battles and land events should be near an active front line when they happen
  chapters  each chapter must show change in its own area (a keyframe inside the chapter, visible movement),
            and fronts there should not go more than ~6 weeks without a position during the chapter
  overlap   a front line should not run deep inside an occupied area (the two disagree)
  sides     'X declares war / joins' events should match the side's entry date

Errors fail the run (exit 1); warnings are listed for review. Writes content/factcheck/history-check-<war>.md.
Run: python3 -I tools/cinema/check_history.py [war-id ...]   (default: every war with a cinema file)
"""
import glob, importlib.util, math, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location("geo", os.path.join(HERE, "geo.py"))
geo = importlib.util.module_from_spec(spec)
spec.loader.exec_module(geo)

ARROW_FRONT_KM = 60      # arrowhead may stop this far beyond the front
BATTLE_FRONT_KM = 150    # land battles happen at (or near) the front
CHANGE_KM = 15           # minimum front movement for a chapter to show change...
CHANGE_KM2 = 1500        # ...or minimum change in occupied area
GAP_YEARS = 0.12         # ~6 weeks without a front position during a chapter
OVERLAP_KM = 30          # front points this deep inside an occupied area count as disagreement
NAVAL = re.compile(r"naval|U-boat|Jutland|sea|Lusitania|warships|fleet", re.I)


def ring_area_km2(r):
    R = 6371.0
    a = 0.0
    for (x1, y1), (x2, y2) in zip(r, r[1:] + r[:1]):
        a += math.radians(x2 - x1) * (2 + math.sin(math.radians(y1)) + math.sin(math.radians(y2)))
    return abs(a * R * R / 2)


def fmt(t):
    y = math.floor(t)
    d = (t - y) * 365.25
    m = min(11, int(d // 30.4375))
    return f"{int(d - m * 30.4375) + 1} {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][m]} {y}"


def check(war_id):
    W = geo.War(war_id)
    C = W.cine
    errs, warns, oks = [], [], []
    side_name = lambda s: W.war["sides"][s]["name"] if s is not None and 0 <= s < len(W.war["sides"]) else "nobody / neutral"
    chapters = C.get("chapters", [])
    for ch in chapters:
        ch["t0"], ch["t1"] = geo.frac(ch["start"]), geo.frac(ch["end"])

    # claims
    for cl in C.get("claims", []):
        t = geo.frac(cl["date"])
        tag = f"claim [{cl.get('chapter', '-')}] {cl['place']} {cl['date']}"
        if cl.get("holder") == "front":
            d, fname = W.front_dist(cl["lonlat"], t)
            (oks if d <= 40 else errs).append(f"{tag}: should be on the front line; nearest front ({fname}) is {d:.0f} km away")
            continue
        got, where = W.controller(cl["lonlat"], t)
        if got == cl["holder"]:
            oks.append(f"{tag}: held by {side_name(got)} ✓")
        else:
            d, _ = W.front_dist(cl["lonlat"], t)
            errs.append(f"{tag}: should be held by {side_name(cl['holder'])}, map shows {side_name(got)} ({where}); {d:.0f} km from the front")

    # arrows
    for a in C.get("arrows", []):
        te, tip, side = geo.frac(a["end"]), a["path"][-1], a.get("side", 0)
        got, where = W.controller(tip, te)
        d, fname = W.front_dist(tip, te)
        if got == side or d <= ARROW_FRONT_KM:
            continue
        msg = f"arrow '{a['name']}' ends {a['end']} at {tip}: map shows {side_name(got)} ground ({where}), {d:.0f} km from the nearest front ({fname})"
        (errs if got is not None else warns).append(msg)

    # battles and land events near a front (only for wars that draw front lines; dynastic wars and insurgencies may not)
    for b in (C.get("battles", []) if W.fronts else []):
        if not b.get("lonlat") or NAVAL.search(b["name"]):
            continue
        t = (geo.frac(b["start"]) + geo.frac(b.get("end", b["start"]))) / 2
        d, fname = W.front_dist(b["lonlat"], t)
        if d > BATTLE_FRONT_KM:
            warns.append(f"battle '{b['name']}' ({fmt(t)}) is {d:.0f} km from any front line" + (f" (nearest: {fname})" if fname else " (no front active)"))
    for e in (W.war["events"] if W.fronts else []):
        if e.get("kind") not in ("battle", "invasion") or not e.get("lonlat") or NAVAL.search(e["text"]):
            continue
        t = geo.frac(e.get("date") or e["year"])
        if not (W.t0 <= t <= W.t1):
            continue
        d, fname = W.front_dist(e["lonlat"], t)
        if d > 1500:
            continue  # a theatre with no front data (e.g. the Pacific): nothing to compare
        if d > BATTLE_FRONT_KM:
            warns.append(f"event '{e['text']}' ({e.get('label', e['year'])}) is {d:.0f} km from any front line")

    # chapters show change in their own area
    for ch in chapters:
        b, a0, a1 = ch["bbox"], ch["t0"], ch["t1"]
        tag = f"chapter {chapters.index(ch) + 1} '{ch['title']}'"
        local_f = [f for f in W.fronts if any(geo.in_box(p, b) for p in (f.at(a1) or f.at(a0) or []))]
        local_o = [o for o in W.occs if any(geo.in_box(p, b) for p in (o.at(a1) or o.at(a0) or []))]
        nkeys = sum(len(x.keys_in(a0, a1)) for x in local_f + local_o)
        if not nkeys and (local_f or local_o):
            errs.append(f"{tag}: no front or occupation position falls inside {ch['start']} – {ch['end']}; the map can only slide between outside dates")
        move = 0.0
        for f in local_f:
            p0, p1 = f.at(a0), f.at(a1)
            if p0 and p1:
                ds = [geo.km(x, y) for x, y in zip(p0, p1) if geo.in_box(x, b) or geo.in_box(y, b)]
                if ds:
                    move = max(move, max(ds))
            elif p1 and not p0:
                move = max(move, 999)
        area = 0.0
        for o in local_o:
            r0, r1 = o.at(a0), o.at(a1)
            area = max(area, abs((ring_area_km2(r1) if r1 else 0) - (ring_area_km2(r0) if r0 else 0)))
        if (local_f or local_o) and move < CHANGE_KM and area < CHANGE_KM2:
            warns.append(f"{tag}: little visible change in its area (front moves ≤ {move:.0f} km, occupied area changes {area:,.0f} km²)")
        for f in local_f:
            ts = [t for t, _ in f.keys]
            cover = [t for t in ts if t <= a1] + [t for t in ts if t >= a1][:1]
            start = max(a0, ts[0])  # a front that opens during the chapter has no gap before it exists
            pts = sorted(set([start, a1] + [t for t in cover if start <= t <= a1] + [max([t for t in ts if t <= start], default=start)] + [min([t for t in ts if t >= a1], default=a1)]))
            for x, y in zip(pts, pts[1:]):
                if y - x > GAP_YEARS and x < a1 and y > start and (x in ts or x == start) and (y in ts or y == a1):
                    lo, hi = max(x, start), min(y, a1)
                    if hi - lo > GAP_YEARS:
                        warns.append(f"{tag}: '{f.name}' has no position between {fmt(lo)} and {fmt(hi)} ({(hi - lo) * 52:.0f} weeks)")
        oks.append(f"{tag}: {nkeys} keyframe(s) inside, front movement {move:.0f} km, occupied-area change {area:,.0f} km²")

    # fronts running through occupied areas
    seen = set()
    for o in W.occs:
        for t, ring in o.keys:
            for f in W.fronts:
                ln = f.at(t)
                if not ln:
                    continue
                deep = [p for p in ln if geo.point_in_ring(p, ring) and geo.dist_to_line(p, ring, closed=True) > OVERLAP_KM]
                if len(deep) >= 3 and (o.name, f.name) not in seen:
                    seen.add((o.name, f.name))
                    warns.append(f"'{f.name}' runs up to {max(geo.dist_to_line(p, ring, True) for p in deep):.0f} km inside '{o.name}' on {fmt(t)}")

    # side entry/exit dates vs events: the subject of "X declares war / joins / makes peace" should match X's dates
    rx = re.compile(r"\b(declares? war|joins|enters the war|signs an armistice|makes peace|leaves the war)\b", re.I)
    stem = lambda w: w.lower()[:6]
    generic = {"of", "the", "and", "empire", "kingdom", "republic", "principality", "commonwealth", "first", "second"}
    first_year = W.war["span"][0]
    for e in W.war["events"]:
        mt = rx.search(e["text"])
        if not mt:
            continue
        subj = {stem(w) for w in re.split(r"[\s,;()-]+", e["text"][: mt.start()]) if len(w) > 3}
        exit_ = bool(re.search(r"armistice|peace|leaves", mt.group(0), re.I))
        te = geo.frac(e.get("date") or e["year"])
        for sd in W.war["sides"]:
            for x in sd["members"]:
                words = [w for w in re.split(r"[\s()-]+", x["clio"]) if len(w) > 3 and w.lower() not in generic]
                hits = sum(stem(w) in subj for w in words)
                if not hits or (hits < 2 and len(words) > 1 and words[0].lower() == "united"):
                    continue
                if exit_ and x["to"] < math.floor(te) or not exit_ and x["from"] > math.floor(te):
                    continue  # this realm name isn't drawn that year (renamed before/after)
                key = "toDate" if exit_ else "fromDate"
                if x.get(key):
                    gap = (te - geo.frac(x[key])) * 365.25
                    if exit_ and "peace" in mt.group(0).lower() and gap > 0:
                        continue  # an armistice before the peace treaty is the real exit
                    if abs(gap) > 20:
                        warns.append(f"side dates: '{e['text']}' ({e.get('label')}) but '{x['clio']}' {key} is {x[key]}")
                elif not exit_ and x["from"] == first_year and te - first_year < 1:
                    continue  # at war from the start
                else:
                    warns.append(f"side dates: '{e['text']}' ({e.get('label')}) but '{x['clio']}' has no {key} (whole years {x['from']}–{x['to']})")

    trial = os.environ.get("CINEMA_FILE")  # testing a patched copy: keep the report beside it, not in the shared folder
    out = os.path.join(os.path.dirname(os.path.abspath(trial)), f"history-check-{war_id}.md") if trial else os.path.join(geo.ROOT, "content", "factcheck", f"history-check-{war_id}.md")
    with open(out, "w") as fh:
        fh.write(f"# History check: {W.war['name']}\n\nGenerated by tools/cinema/check_history.py. {len(errs)} errors, {len(warns)} warnings.\n\n")
        fh.write("## Errors\n" + ("".join(f"- {x}\n" for x in errs) or "- none\n"))
        fh.write("\n## Warnings\n" + ("".join(f"- {x}\n" for x in warns) or "- none\n"))
        fh.write("\n## Passed\n" + "".join(f"- {x}\n" for x in oks))
    print(f"{war_id}: {len(errs)} errors, {len(warns)} warnings -> {os.path.relpath(out, geo.ROOT)}")
    for x in errs:
        print("  ERROR", x)
    for x in warns:
        print("  warn ", x)
    return len(errs)


if __name__ == "__main__":
    ids = sys.argv[1:] or [os.path.basename(p)[:-5] for p in sorted(glob.glob(os.path.join(geo.ROOT, "content", "cinema", "*.json")))]
    sys.exit(1 if sum(check(i) for i in ids) else 0)
