#!/usr/bin/env python3
"""Apply regional specialist patches (content/factcheck/*-patch.json) to the content files.

Each patch entry: {"item": <era year | profile id>, "field": "regions.europe" | "powers[2].ruler" | ...,
                   "old": "...", "new": "...", "source": "..."}  or  {"item": ..., "addSource": {title, url}}
Items are located by era year / profile id across all content files (the "file" hint is advisory).
Text fields: replace the first exact occurrence of `old`. Number fields: replace when equal to `old`.
Writes content/factcheck/patch-report.md listing applied and skipped entries.

Run:  python3 -I tools/apply_patches.py [--dry-run]
"""
import glob
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DRY = "--dry-run" in sys.argv


def load_all():
    files = {}
    for p in sorted(glob.glob(os.path.join(ROOT, "content", "eras", "*.json")) + glob.glob(os.path.join(ROOT, "content", "empires", "*.json"))):
        files[p] = json.load(open(p))
    index = {}
    for p, items in files.items():
        for it in items:
            key = it.get("id", it.get("year"))
            index[str(key)] = it
    return files, index


def walk(obj, field):
    """Return (parent, key) for a dotted/bracketed path like powers[2].ruler or regions.east-asia."""
    parts = re.findall(r"[^.\[\]]+|\[\d+\]", field)
    cur = obj
    for i, part in enumerate(parts):
        key = int(part[1:-1]) if part.startswith("[") else part
        if i == len(parts) - 1:
            return cur, key
        cur = cur[key]
    raise KeyError(field)


def main():
    files, index = load_all()
    applied, skipped = [], []
    for pf in sorted(glob.glob(os.path.join(ROOT, "content", "factcheck", "*-patch.json"))):
        slug = os.path.basename(pf)[:-11]
        try:
            patches = json.load(open(pf))
        except Exception as e:  # noqa: BLE001
            skipped.append(f"{slug}: unreadable patch file ({e})")
            continue
        for p in patches:
            item = index.get(str(p.get("item")))
            label = f"[{slug}] {p.get('item')} {p.get('field', 'sources')}"
            if item is None:
                skipped.append(f"{label}: item not found")
                continue
            if "addSource" in p:
                src = p["addSource"]
                if not str(src.get("url", "")).startswith(("http://", "https://")):
                    skipped.append(f"{label}: non-http source")
                    continue
                item.setdefault("sources", [])
                if all(s.get("url") != src["url"] for s in item["sources"]):
                    item["sources"].append({"title": src.get("title") or src["url"], "url": src["url"]})
                    applied.append(f"{label}: + source {src.get('title')}")
                continue
            try:
                parent, key = walk(item, p["field"])
                cur = parent[key]
            except (KeyError, IndexError, TypeError):
                skipped.append(f"{label}: field not found")
                continue
            old, new = p.get("old"), p.get("new")
            if isinstance(cur, (int, float)) and not isinstance(cur, bool):
                try:
                    if float(cur) == float(old):
                        parent[key] = type(cur)(float(new)) if isinstance(cur, int) and float(new).is_integer() else float(new)
                        applied.append(f"{label}: {old} → {new} ({p.get('source', '')})")
                    else:
                        skipped.append(f"{label}: value is {cur}, expected {old}")
                except (TypeError, ValueError):
                    skipped.append(f"{label}: non-numeric patch for number field")
            elif isinstance(cur, str) and isinstance(old, str) and old and old in cur:
                parent[key] = cur.replace(old, new, 1)
                applied.append(f"{label}: “{old}” → “{new}” ({p.get('source', '')})")
            else:
                skipped.append(f"{label}: text not found (already changed?) — wanted “{old}”")
    if not DRY:
        for path, items in files.items():
            with open(path, "w") as fh:
                json.dump(items, fh, ensure_ascii=False, indent=1)
    report = os.path.join(ROOT, "content", "factcheck", "patch-report.md")
    with open(report, "w") as fh:
        fh.write(f"# Specialist patch report{' (dry run)' if DRY else ''}\n\nApplied: {len(applied)} · Skipped: {len(skipped)}\n\n## Applied\n")
        fh.writelines(f"- {a}\n" for a in applied)
        fh.write("\n## Skipped (review by hand)\n")
        fh.writelines(f"- {s}\n" for s in skipped)
    print(f"applied {len(applied)}, skipped {len(skipped)} -> {os.path.relpath(report, ROOT)}")


if __name__ == "__main__":
    main()
