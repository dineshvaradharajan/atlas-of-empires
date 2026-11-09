#!/usr/bin/env python3
"""Turn reference-map review findings (content/factcheck/refcheck-*.json) into map corrections.

Policy
- Only `major` findings change anything; `minor`, `match` and `not-comparable` are just reported.
- `which_is_right: "ours"` changes nothing (the reference is wrong); it's listed in the summary.
- Notes are added for major findings where the reference is right or it's unclear.
- Structural operations (clip / asPeople / relabel) are applied only with a cited http(s) source and valid years,
  and never override an existing operation of the same kind on that realm.
- Reader-facing text never names the data source ("the map", not "Cliopatria").
Writes content/corrections.json and content/factcheck/refcheck-summary.md.

Run: python3 -I tools/apply_refcheck.py [--dry-run]
"""
import glob, json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DRY = "--dry-run" in sys.argv
REALMS = json.load(open(f"{ROOT}/public/data/clio/index.json"))["realms"]
CPATH = f"{ROOT}/content/corrections.json"


def plain(text):
    text = re.sub(r"\bCliopatria('s)?\b", "the map", text or "")
    text = re.sub(r"\bour map\b", "this map", text, flags=re.I)
    return text.strip()


def main():
    corr = json.load(open(CPATH))
    R = corr["realms"]
    findings = []
    for p in sorted(glob.glob(f"{ROOT}/content/factcheck/refcheck-*.json")):
        try:
            findings += [dict(f, _batch=os.path.basename(p)) for f in json.load(open(p))]
        except Exception as e:  # noqa: BLE001
            print("unreadable", p, e)
    counts, applied, ours, skipped = {}, [], [], []
    for f in findings:
        v = f.get("verdict", "?")
        counts[v] = counts.get(v, 0) + 1
        if v != "major":
            continue
        name = f.get("realm")
        if name not in REALMS:
            skipped.append(f"{name}: realm not in map data"); continue
        right = f.get("which_is_right")
        if right == "ours":
            ours.append(f"{name} ({f.get('year')}): {'; '.join(f.get('differences', []))[:200]}")
            continue
        s = f.get("suggested") or {}
        src = f.get("source") or {}
        has_src = str(src.get("url", "")).startswith(("http://", "https://"))
        entry = R.setdefault(name, {})
        detail = plain(s.get("detail") or "; ".join(f.get("differences", [])))
        # note (always, for major reference/unclear findings)
        if detail and detail not in (entry.get("note") or ""):
            entry["note"] = (entry.get("note", "") + " " + detail).strip()
        if has_src:
            srcs = entry.setdefault("sources", [])
            if all(x.get("url") != src["url"] for x in srcs):
                srcs.append({"title": src.get("title") or src["url"], "url": src["url"]})
        t, a, b = s.get("type"), s.get("from"), s.get("to")
        years_ok = isinstance(a, int) and isinstance(b, int) and a <= b
        what = "note"
        if t in ("clip", "asPeople", "relabel") and not has_src:
            skipped.append(f"{name}: {t} suggested without a cited source — note only")
        elif t == "clip" and years_ok and "clip" not in entry:
            entry["clip"] = [a, b]; what = f"clip {a}–{b}"
        elif t == "asPeople" and years_ok:
            nm = f"{name} (no unified state)" if "(" not in name else f"{name} — no unified state"
            if not any(x["from"] == a and x["to"] == b for x in entry.get("asPeople", [])):
                entry.setdefault("asPeople", []).append({"from": a, "to": b, "name": nm}); what = f"asPeople {a}–{b}"
        elif t == "relabel" and years_ok and s.get("detail"):
            new = re.sub(r"^.*?(?:really|is|as)\s+(?:the\s+)?", "", s["detail"]).strip(" .") if len(s["detail"]) > 60 else s["detail"].strip(" .")
            entry.setdefault("relabel", []).append({"from": a, "to": b, "name": new, "key": new}); what = f"relabel {a}–{b} → {new}"
        elif t in ("clip", "asPeople", "relabel"):
            skipped.append(f"{name}: {t} needs valid from/to years (or already set) — note only")
        entry.setdefault("log", f"reference check ({f['_batch']})")
        applied.append(f"{name} ({f.get('year')}): {what} — {detail[:160]}")
    if not DRY:
        json.dump(corr, open(CPATH, "w"), ensure_ascii=False, indent=2)
    out = f"{ROOT}/content/factcheck/refcheck-summary.md"
    with open(out, "w") as fh:
        fh.write("# Reference-map check: summary\n\n")
        fh.write("Verdicts: " + ", ".join(f"{k} {v}" for k, v in sorted(counts.items())) + f"  (total {len(findings)})\n\n")
        fh.write(f"## Applied ({len(applied)})\n" + "".join(f"- {x}\n" for x in applied))
        fh.write(f"\n## Reference was wrong; map kept ({len(ours)})\n" + "".join(f"- {x}\n" for x in ours))
        fh.write(f"\n## Skipped or downgraded ({len(skipped)})\n" + "".join(f"- {x}\n" for x in skipped))
    print(f"{len(findings)} findings: {counts}; applied {len(applied)}, reference-wrong {len(ours)}, skipped {len(skipped)}{' (dry run)' if DRY else ''}")


if __name__ == "__main__":
    main()
