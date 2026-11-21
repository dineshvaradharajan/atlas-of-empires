#!/usr/bin/env python3
"""The deep-time page's data: content/prehistory/*.json -> public/data/earth-history.json (the Earth history page, public/earth-history/).

Reads   periods-a.json, periods-b.json   the time units (eons, eras, periods, epochs) and what changed in each
        events-a.json, events-b.json     landmark events, with the place the evidence is found today
        origins.json                     when each group of living things first appears
        curves.json                      long records drawn along the timeline (temperature, CO2, ...)
        images.json                      openly licensed pictures (optional; used when present)
        images-more.json                 more pictures, in the same form (optional)
        stories/*.json                   stories told in chapters (content/STORIES_DEEP.md); each chapter's sites and the
                                         place the globe turns to are carried back in time like the events
        milestones.json                  the turning points for life marked on the timeline; each names an event (e:) or
                                         a group (o:) above, whose researched date and sources it uses
        positions.json                   where each event and fossil site sat on the globe at its own time (see below)
        public/data/paleo/index.json     the ages that have a map (tools/paleo.py)

Events and fossil sites are recorded where they are found today; the continents have moved since, so each one is
carried back to its own time with the PALEOMAP plate model (the model the maps are built on) through the GPlates Web
Service, https://gwsdoc.gplates.org. The answers are kept in content/prehistory/positions.json so a rebuild needs no
network; run with --positions to fetch the missing ones (about one request a second). Only the last 540 million
years have a map, so older places are not moved.

Run: python3 -I tools/prehistory.py [--positions]
"""
import glob, json, os, sys, time, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "content", "prehistory")
MAPPED = 540  # million years ago: the oldest map
# day lengths in periods-b that are measurements; its other values are straight lines drawn to today's 24 hours
MEASURED_DAY = {"triassic", "cretaceous", "holocene"}


def load(name, default=None):
    p = os.path.join(SRC, name)
    return json.load(open(p)) if os.path.exists(p) else default


YOUNG = 1  # million years: younger than this, places are where they are today (plates move a few tens of km at most)


def places(events, origins, stories=()):
    """-> {key: (lon, lat, Ma)} for everything that has a present-day place and a map at its time"""
    out = {}
    for s in stories:
        for c in s["chapters"]:
            if YOUNG <= c["ma"] <= MAPPED:
                out["c:%s:%s" % (s["id"], c["id"])] = (c["focus"][0], c["focus"][1], c["ma"])
                # a site is drawn on the chapter's map, so it is carried back to the chapter's date, not its own
                for i, t in enumerate(c.get("sites") or []): out["s:%s:%s:%d" % (s["id"], c["id"], i)] = (t["lonlat"][0], t["lonlat"][1], c["ma"])
    for e in events:
        if e.get("lonlat") and e["ma"] <= MAPPED: out["e:" + e["id"]] = (e["lonlat"][0], e["lonlat"][1], e["ma"])
    for o in origins:
        ll = (o.get("oldest") or {}).get("lonlat")
        if ll and o["fossilMa"] <= MAPPED: out["o:" + o["id"]] = (ll[0], ll[1], o["fossilMa"])
    return out


def fetch_positions(want, have):
    by_age = {}
    for k, (lon, lat, ma) in want.items():
        if k not in have: by_age.setdefault(int(round(ma)), []).append((k, lon, lat))
    for n, (age, items) in enumerate(sorted(by_age.items())):
        if age == 0:
            for k, lon, lat in items: have[k] = [lon, lat]
            continue
        url = "https://gws.gplates.org/reconstruct/reconstruct_points/?points=%s&time=%d&model=paleomap&return_null_points" % (
            ",".join("%s,%s" % (lon, lat) for _, lon, lat in items), age)
        try:
            got = json.load(urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": "AtlasOfEmpires/0.1 (educational map)"}), timeout=60))["coordinates"]
        except Exception as err:
            print("failed", age, err, file=sys.stderr); continue
        for (k, _, _), p in zip(items, got):
            have[k] = [round(p[0], 2), round(p[1], 2)] if p and abs(p[0]) <= 180 else None  # None: no land there yet (young sea floor or island)
        print("%d/%d  %d Ma  %d places" % (n + 1, len(by_age), age, len(items)), file=sys.stderr)
        time.sleep(1.1)
    return have


def main():
    units = load("periods-a.json", []) + load("periods-b.json", [])
    seen = set(); units = [u for u in units if not (u["id"] in seen or seen.add(u["id"]))]
    b_ids = {u["id"] for u in load("periods-b.json", [])}
    for u in units:
        if u["id"] in b_ids and u["id"] not in MEASURED_DAY: u["stats"]["dayHours"] = None
    units.sort(key=lambda u: (-u["from"], ["eon", "era", "period", "epoch"].index(u["rank"])))
    events = sorted(load("events-a.json", []) + load("events-b.json", []), key=lambda e: -e["ma"])
    origins = load("origins.json", [])
    images = load("images.json", []) + load("images-more.json", [])
    if len({i["id"] for i in images}) != len(images): sys.exit("images.json and images-more.json share an id")
    stories = []
    for f in sorted(glob.glob(os.path.join(SRC, "stories", "*.json"))):
        if os.path.basename(f).startswith("_") and not os.environ.get("STORY_TEST"): continue  # _name.json: a draft or a test fixture
        stories.append(json.load(open(f)))
    want = places(events, origins, stories); pos_path = os.path.join(SRC, "positions.json"); have = load("positions.json", {})
    if "--positions" in sys.argv:
        have = fetch_positions(want, have)
        json.dump({k: have[k] for k in sorted(have)}, open(pos_path, "w"), indent=0)
    for e in events: e["then"] = have.get("e:" + e["id"]) if "e:" + e["id"] in want else None
    for o in origins: o["then"] = have.get("o:" + o["id"]) if "o:" + o["id"] in want else None
    missing = [k for k in want if k not in have]
    by_img = {i["id"]: i for i in images}
    for s in stories:  # each chapter: its pictures (reused ones looked up), and where its places sat at the time
        for c in s["chapters"]:
            pics = []
            for iid in c.get("imageIds") or []:
                if iid not in by_img: sys.exit("story %s, chapter %s: no picture called %s" % (s["id"], c["id"], iid))
                pics.append(by_img[iid])
            c["pics"] = (c.get("images") or []) + pics
            c.pop("images", None); c.pop("imageIds", None)
            k = "c:%s:%s" % (s["id"], c["id"]); c["then"] = have.get(k) if k in want else (c["focus"] if c["ma"] < YOUNG else None)
            for i, t in enumerate(c.get("sites") or []):
                k = "s:%s:%s:%d" % (s["id"], c["id"], i); t["then"] = have.get(k) if k in want else (t["lonlat"] if c["ma"] < YOUNG else None)
            if c.get("route"): c["route"]["path"] = [p for p in c["route"]["path"]]  # routes are only drawn for the last million years or so: today's places
    ev = {"e:" + e["id"]: (e["ma"], e["title"]) for e in events}; ev.update({"o:" + o["id"]: (o["fossilMa"], o["name"]) for o in origins})
    miles = []
    for m in load("milestones.json", []):
        if m["ref"] not in ev: sys.exit("milestones.json: no event or group called %s" % m["ref"])
        miles.append({**m, "ma": ev[m["ref"]][0], "title": ev[m["ref"]][1]})
    miles.sort(key=lambda m: -m["ma"])
    maps = json.load(open(os.path.join(ROOT, "public", "data", "paleo", "index.json")))
    out = {"units": units, "events": events, "origins": origins, "curves": (load("curves.json") or {}).get("curves", []),
           "images": images, "milestones": miles, "stories": stories, "maps": maps}
    p = os.path.join(ROOT, "public", "data", "earth-history.json")
    json.dump(out, open(p, "w"), separators=(",", ":"), ensure_ascii=False)
    print("%d units, %d events, %d groups, %d curves, %d pictures, %d milestones, %d stories, %d maps -> %d KB" % (
        len(units), len(events), len(origins), len(out["curves"]), len(out["images"]), len(miles), len(stories), len(maps["maps"]), os.path.getsize(p) // 1024), file=sys.stderr)
    if missing: print("%d places not yet carried back in time (run with --positions): %s" % (len(missing), ", ".join(missing[:8])), file=sys.stderr)


if __name__ == "__main__":
    main()
