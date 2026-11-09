#!/usr/bin/env python3
"""Merge chapter-review patches into a war cinema file.

A patch (content/factcheck/chapter-review-*.json, key "patch") may contain:
  fronts:          {"<front name>": {"add": [{"date", "line"}], "remove": ["<date>", ...]}}
  occupations:     {"<name>": {"add": [{"date", "coords"}], "remove": [...], "end": "<date>"|null, "side": 0|1}}
  new_fronts:      [{"name", "keys": [...]}]
  new_occupations: [{"name", "side", "keys": [...], "end"?}]
  arrows:          {"<arrow name>": {"path"?, "start"?, "end"?, "side"?}}
  new_arrows:      [{"name", "side", "start", "end", "path"}]
  remove_arrows:   ["<arrow name>", ...]
  chapters:        {"<chapter id>": {"text"?, "arrows"?, "start"?, "end"?, "bbox"?}}
and the review file's top-level "claims" list is appended to the cinema file's "claims" (deduplicated).
An "add" keyframe with an existing date replaces it.

Run: python3 -I tools/cinema/apply_review.py <review.json> [<review.json> ...] [--target <cinema.json>] [--dry-run]
"""
import json, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


def merge_keys(keys, add, remove):
    by = {k["date"]: k for k in keys if k["date"] not in set(remove or [])}
    for k in add or []:
        by[k["date"]] = k
    return [by[d] for d in sorted(by)]


def apply(c, review, log):
    p = review.get("patch") or {}
    named = lambda lst: {x["name"]: x for x in lst}
    fr, oc, ar = named(c["fronts"]), named(c["occupations"]), named(c["arrows"])
    for n, ch in (p.get("fronts") or {}).items():
        if n not in fr:
            log.append(f"! unknown front {n!r}"); continue
        fr[n]["keys"] = merge_keys(fr[n]["keys"], ch.get("add"), ch.get("remove")); log.append(f"front {n}: +{len(ch.get('add') or [])} -{len(ch.get('remove') or [])}")
    for n, ch in (p.get("occupations") or {}).items():
        if n not in oc:
            log.append(f"! unknown occupation {n!r}"); continue
        oc[n]["keys"] = merge_keys(oc[n]["keys"], ch.get("add"), ch.get("remove"))
        for f in ("end", "side"):
            if f in ch:
                if ch[f] is None: oc[n].pop(f, None)
                else: oc[n][f] = ch[f]
        log.append(f"occupation {n}: +{len(ch.get('add') or [])} -{len(ch.get('remove') or [])}")
    for x in p.get("new_fronts") or []:
        c["fronts"] = [f for f in c["fronts"] if f["name"] != x["name"]] + [x]; log.append(f"new front {x['name']}")
    for x in p.get("new_occupations") or []:
        c["occupations"] = [o for o in c["occupations"] if o["name"] != x["name"]] + [x]; log.append(f"new occupation {x['name']}")
    for n, ch in (p.get("arrows") or {}).items():
        if n not in ar:
            log.append(f"! unknown arrow {n!r}"); continue
        ar[n].update({k: v for k, v in ch.items() if k in ("path", "start", "end", "side")}); log.append(f"arrow {n}: {', '.join(ch)}")
    for x in p.get("new_arrows") or []:
        c["arrows"] = [a for a in c["arrows"] if a["name"] != x["name"]] + [x]; log.append(f"new arrow {x['name']}")
    for n in p.get("remove_arrows") or []:
        c["arrows"] = [a for a in c["arrows"] if a["name"] != n]; log.append(f"removed arrow {n}")
    chs = {x["id"]: x for x in c.get("chapters", [])}
    for i, ch in (p.get("chapters") or {}).items():
        if i not in chs:
            log.append(f"! unknown chapter {i!r}"); continue
        chs[i].update({k: v for k, v in ch.items() if k in ("text", "arrows", "start", "end", "bbox", "title")}); log.append(f"chapter {i}: {', '.join(ch)}")
    seen = {(x.get("chapter"), x["place"], x["date"]) for x in c.get("claims", [])}
    for cl in review.get("claims") or []:
        k = (cl.get("chapter"), cl["place"], cl["date"])
        if k not in seen:
            c.setdefault("claims", []).append(cl); seen.add(k)
    log.append(f"claims now {len(c.get('claims', []))}")
    names = {a["name"] for a in c["arrows"]}
    for ch in c.get("chapters", []):
        bad = [a for a in ch.get("arrows", []) if a not in names]
        if bad:
            log.append(f"! chapter {ch['id']} names missing arrows {bad}")


def main():
    args = sys.argv[1:]
    dry = "--dry-run" in args
    target = None
    if "--target" in args:
        i = args.index("--target"); target = args[i + 1]; del args[i:i + 2]
    files = [a for a in args if a != "--dry-run"]
    target = target or os.path.join(ROOT, "content", "cinema", "world-war-i.json")
    c = json.load(open(target))
    log = []
    for f in files:
        log.append(f"== {os.path.basename(f)}")
        apply(c, json.load(open(f)), log)
    print("\n".join(log))
    if not dry:
        json.dump(c, open(target, "w"), ensure_ascii=False, indent=1)


if __name__ == "__main__":
    main()
