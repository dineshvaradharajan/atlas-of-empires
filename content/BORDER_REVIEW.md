# Border review: brief

The atlas draws who ruled what from 3400 BCE to 2024 from the Cliopatria dataset, plus a corrections layer
(content/corrections.json: clip, hide, asPeople, crop, relabel, notes). A first review compared each realm with one
reference map at one year. Now we test borders **over time**: is each place in the right realm in the right year?
A probe already found Constantinople still Byzantine in 1455 (it fell on 29 May 1453).

**Be adversarial.** Assume the map is wrong until a source shows it is right. Fuzzy frontiers (steppe, tributary
rings, sparsely governed land) are not errors; a city, province or capital in the wrong realm, or a realm that
appears/ends decades off, is.

## Tools (run from the repo root, /Users/dinesh/Projects/WorldHistory; use `python3 -I`)
- `tools/borders/check_borders.py` checks claims, dates vs Wikidata, peak areas vs published estimates, overlaps,
  gaps. Full run writes content/factcheck/border-check.md and border-check.json (read the current ones first: they
  list hundreds of leads). `--claims-only` is fast.
- Test your work WITHOUT touching shared files: `CLAIMS_FILE=<your claims.json>` checks only your claims and writes
  the report beside that file; `CORRECTIONS_FILE=<copy of content/corrections.json>` makes every tool use your copy.
  Apply your proposed corrections to the copy with
  `tools/borders/apply_corrections.py <your-review.json> --target <copy>`.
- `tools/borders/render_empire.py <journey-id | "Realm name"> <out-dir> [--years 8 | --at 1453,1460]` renders the
  map as the app draws it: the empire red, others grey and named, lon/lat grid, claims as squares (green = agrees).
  Open the PNGs with Read. Journey ids and their realm chains: public/data/content.json → "journeys".
- Realm names: public/data/clio/index.json → "realms" (each: tl = [[from, to, km²]], wiki, wd, memberOf). Names in
  parentheses are empire groups (e.g. "(British Empire)") that include colonies; a claim may accept several names.
- `tools/borders/borders.py` is the shared logic (how the app applies corrections) if you need to script checks.

## Sources
Read content/FACTCHECK.md: fetch what you cite, never invent URLs. Dates of conquests, treaties and capitals from
cited Wikipedia statements, university/museum pages, Britannica-tier references where they load. Reference maps from
Wikimedia Commons and academic atlases (download to your scratch dir and open with Read). Polite fetching (~1
request/second, honour 429, User-Agent "AtlasOfEmpires/0.1 (educational map)").

## Deliverables (only your own files)
1. `content/borders/claims-<your-id>.json`: a JSON list of claims, each
   `{"place": "Constantinople", "lonlat": [28.97, 41.01], "year": 1460, "realm": ["Ottoman Empire", "(Ottoman Empire)"],
     "not": ["Byzantine Empire"], "region": "<your-id>", "source": {"title": "...", "url": "..."}}`
   - Use land points in the town (coastal points are searched within 12 km). `realm`: a map realm name or list of
     acceptable names (realm, its group, or a relabel name from corrections); `null` = no state should be drawn.
   - Prefer pairs around a change (just before and just after a conquest/treaty), capitals, provinces that changed
     hands, and the realm's earliest/latest years. Every claim is sourced and becomes a permanent regression test.
2. `content/factcheck/border-review-<your-id>.json`:
   `{"reviewer": "<id>", "findings": [{"realm", "years", "severity": "error|warning", "issue", "fixed": bool,
     "source": {...}}], "corrections": {"<realm name>": {clip|hide|asPeople|crop|relabel|note|sources}}}`
   - A failing claim means either the claim is wrong (fix it, with a better source) or the map is wrong (propose a
     correction and re-test until the claim passes without breaking others). Notes are reader-facing, plain
     language, and never mention "Cliopatria" (say "the map").
   - Only correct realms you own (see your assignment). For others, record a finding with the evidence.
3. Reply with: counts (claims, failing before/after, corrections, findings) and the 5 most important errors found.

Done means: all your claims pass with your corrections applied to a copy, and each correction is sourced.
