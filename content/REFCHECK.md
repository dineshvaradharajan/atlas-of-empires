# Reference-map check: brief for reviewers

The atlas draws borders from Cliopatria. Each realm also shows a Wikimedia Commons reference map. A reader found
they disagreed for the Xianbei (the map ran far north into Dingling lands and kept the peak after the confederation
had broken up). Your job: compare our map against the reference for a batch of realms and record real disagreements.

## Inputs
`<COMPARE>/index.json` lists the comparisons (path given in your task). Each entry: `realm`, `year`, `year_basis`
("reference date" = the year was read from the reference's title/caption; otherwise the realm's peak year),
`image` (PNG to open with the Read tool), `ref_file`, `ref_desc`, `reference` (Commons page URL).
Each PNG has **our map on top** (realm in red, other states grey, dashed lat/lon lines labelled) and the **reference
below**. Animated GIF references show their final frame.

## How to judge
1. First decide whether the pair is comparable. Mark **not-comparable** when the reference:
   - isn't a territorial map of this realm (a locator dot, battle plan, city plan, ethnic or language map), or
   - shows a clearly different date or polity than our map (read its legend or caption; e.g. a "1914" map against our 1683), or
   - is unreadable at this size.
2. If comparable, compare the realm's extent, region by region (use the lat/lon lines and coastlines):
   - **match**: same core and broadly the same limits (within ~10% of the extent, or fuzzy frontier zones).
   - **minor**: a frontier region differs, or the reference shows a vassal or sphere our map omits (or vice versa).
   - **major**: a large region (e.g. ≥15% of the extent, or a whole named province or country) is in one map but not the
     other, the realm is clearly the wrong size or shape, or our map is drawn for a year when the polity didn't exist in that form.
3. References are not automatically right; many are amateur reconstructions. For every **major** finding, check
   one reliable source (fetch it: Britannica if it loads, else a well-cited Wikipedia article or an academic page) to
   decide **which map is right**, and cite it. If the reference is wrong, say so (verdict stays major, `which_is_right: "ours"`).
4. Nomadic confederations and empires with tributary rings have fuzzy borders; don't flag differences that are
   just two reasonable ways of drawing a frontier zone. Do flag claims that cross into another people's well-documented territory.

## Output (write ONLY your batch file)
`content/factcheck/refcheck-<batch>.json`: a JSON array, one object per comparison in your batch:
```json
{
  "realm": "Xianbei", "year": 195, "verdict": "major",
  "which_is_right": "reference" | "ours" | "unclear" | null,
  "differences": ["Our map extends north to ~56°N into Dingling lands south of Baikal; reference stops at ~50°N"],
  "suggested": { "type": "note" | "clip" | "asPeople" | "relabel" | "none",
                 "detail": "one sentence a reader would see as a Map note",
                 "from": 182, "to": 223 },
  "source": { "title": "…", "url": "…" },
  "not_comparable_reason": null
}
```
- `suggested.type`: **note** = add a reader-facing explanation (most common); **clip** = hide the realm outside
  `from`–`to` (it outlasts the real polity); **asPeople** = show as people/tribes, not a state, in `from`–`to`; **relabel** = the polygon is
  really another polity (put the correct name in `detail`); **none** for match/minor/not-comparable.
- Keep `differences` concrete: name regions and use the lat/lon lines.
- Validate the JSON parses. Reply with counts per verdict and the 5 most important major findings.
