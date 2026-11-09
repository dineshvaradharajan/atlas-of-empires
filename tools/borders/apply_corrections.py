#!/usr/bin/env python3
"""Merge border-review corrections (content/factcheck/border-review-*.json, key "corrections") into content/corrections.json.

Each review's "corrections" maps a realm name (as in public/data/clio/index.json) to operations in the existing format:
  clip [from, to]                     show the realm only in these years (replaces an existing clip; conflicts are reported)
  hide [[from, to], ...]              hide in these years (appended)
  asPeople [{from, to, name}]         draw as a people, not a state (appended)
  crop [{from, to, box: [w, s, e, n]}]  draw only inside a lon/lat box (appended)
  relabel [{from, to, name, key}]     the polygon is really another polity (appended; same from/to replaces)
  note "..."                          reader-facing map note (appended as a sentence; never names the data source)
  sources [{title, url}]              appended, deduplicated by url
Run: python3 -I tools/borders/apply_corrections.py <review.json> [...] [--target <corrections.json>] [--dry-run]
"""
import json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


def merge(entry, ops, who, log):
    if "clip" in ops:
        if entry.get("clip") and entry["clip"] != ops["clip"]:
            log.append(f"  ! clip conflict ({who}): had {entry['clip']}, now {ops['clip']}")
        entry["clip"] = ops["clip"]
    for k in ("hide", "asPeople", "crop"):
        for x in ops.get(k, []):
            if x not in entry.setdefault(k, []):
                entry[k].append(x)
    for x in ops.get("relabel", []):
        rl = [r for r in entry.get("relabel", []) if not (r["from"] == x["from"] and r["to"] == x["to"])]
        entry["relabel"] = rl + [x]
    if ops.get("note"):
        note = re.sub(r"\bCliopatria('s)?\b", "the map", ops["note"]).strip()
        if note not in entry.get("note", ""):
            entry["note"] = (entry.get("note", "") + " " + note).strip()
    for s in ops.get("sources", []):
        if all(x.get("url") != s.get("url") for x in entry.setdefault("sources", [])):
            entry["sources"].append(s)
    entry.setdefault("log", f"border review ({who})")


def main():
    args = sys.argv[1:]
    dry = "--dry-run" in args
    target = os.path.join(ROOT, "content", "corrections.json")
    if "--target" in args:
        i = args.index("--target"); target = args[i + 1]; del args[i:i + 2]
    files = [a for a in args if a != "--dry-run"]
    corr = json.load(open(target))
    realms = json.load(open(os.path.join(ROOT, "public", "data", "clio", "index.json")))["realms"]
    log = []
    for f in files:
        rv = json.load(open(f))
        who = os.path.basename(f)
        n = 0
        for name, ops in (rv.get("corrections") or {}).items():
            if name not in realms:
                log.append(f"  ! {who}: {name!r} is not a realm in the map data"); continue
            merge(corr["realms"].setdefault(name, {}), ops, who, log); n += 1
        log.insert(0, f"{who}: {n} realms corrected")
    print("\n".join(log))
    if not dry:
        json.dump(corr, open(target, "w"), ensure_ascii=False, indent=2)


if __name__ == "__main__":
    main()
