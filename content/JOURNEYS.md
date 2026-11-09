# Empire journeys: brief

A reader picks an empire and the atlas shows its **whole life**: territory growing and shrinking year by year on the map,
its rulers, and the key events that drove expansion and collapse. You write the data for a set of empires.

Read `content/FACTCHECK.md` first: the same source rules apply (fetch every page you cite; prefer Britannica-tier,
university, museum and peer-reviewed sources, else Wikipedia statements that are themselves cited; hedge contested dates with
"c."; never invent URLs). Britannica often blocks automated fetches; don't cite what you couldn't open.

## The map data you must link to
The map's borders come from Cliopatria. `data/clio/realms.txt` lists every realm: name, first year, last year, peak area, Wikipedia
title (tab-separated). `public/data/clio/index.json` has each realm's area timeline: `realms[name].tl` = [[fromYear, toYear, areaKm2], …].
Names in parentheses, e.g. "(British Empire)", are composite groups (an empire = its member colonies and polities) and are
usually the right choice for colonial empires. `content/corrections.json` lists known fixes (relabels, trims). Respect them.
Existing written profiles are in `content/empires/*.json` (field `id`); link yours by `profile` when one matches.

## Output: one JSON array, one object per empire, in chronological order
```json
{
  "id": "alexander",                       // kebab-case, unique
  "name": "Empire of Alexander the Great",
  "profile": "macedonian-empire",          // id of an existing profile in content/empires/*.json, or null
  "chain": [                               // which Cliopatria realm(s) to draw, in order; EXACT names from realms.txt
    { "clio": "Macedonian Empire", "from": -359, "to": -323 }
  ],                                       // successive stages may use different realm names (e.g. Roman Republic → Roman Empire → Western Roman Empire); from/to must lie inside that realm's years in index.json
  "span": [-359, -323],                    // years the journey plays through (founding → fall/end); keep within the chain's coverage
  "summary": "…",                          // 2–3 sentences: arc of the empire's rise and fall
  "events": [                              // 8–15 key dated events: founding, decisive battles, conquests, peak, crises, fall
    { "year": -334, "text": "Alexander crosses into Asia; victory at the Granicus", "lonlat": [27.3, 40.2] }
  ],                                       // lonlat = where it happened (2 decimals) or null; text ≤ 90 chars; years ascending, inside span
  "reigns": [ { "name": "Philip II", "from": -359, "to": -336 }, { "name": "Alexander III the Great", "from": -336, "to": -323 } ],
                                           // the main rulers/dynasties across the span (5–20 entries), integer years, ascending, non-overlapping where possible
  "sources": [ { "title": "…", "url": "…" } ]   // 3–6 pages you actually fetched
}
```
Rules:
- Check each chain entry against `index.json`: the realm must have area rows covering most of from–to. If Cliopatria lacks an empire
  (e.g. before 3400 BCE or a missing polity), still write the entry but set `"chain": []` and say so in your change log.
- Long-lived empires (Rome, Byzantium, Egypt, China's dynasties, Ottoman, British) may span centuries: pick events that explain the
  territorial story (expansions and losses), not just famous moments.
- Validate: JSON parses; ids unique; chain names exist in index.json; events and reigns ascending and within span.

Also write `content/factcheck/journeys-<slice>.md`: one line per empire noting the chain chosen and any data gaps or disputed dates.
