# War playback: brief

Readers can **play a war**: the map moves through it event by event, colouring each side's states and pinning each
battle, invasion or turning point, with a short explanation. You write the data for a set of wars.

Read `content/FACTCHECK.md` first: the same source rules apply. Fetch every page you cite; prefer official, academic or museum
pages, else Wikipedia statements that are themselves cited. Use mainstream casualty ranges, keep wording neutral on contested
politics, and never invent URLs.

## Linking to the map
Borders come from Cliopatria. `data/clio/realms.txt` lists every realm (name, first year, last year, peak area, Wikipedia title);
`public/data/clio/index.json` gives each realm's year rows (`realms[name].tl` = [[fromYear, toYear, areaKm2], …]). Side members
must use EXACT realm names from there, with from/to years inside that realm's rows. Names in parentheses are empire groups,
e.g. "(British Empire)", which colour a whole empire with its colonies; prefer them for colonial powers. Check
`content/corrections.json` for relabels: e.g. "Kingdom of Great Britain" shows as "United Kingdom" from 1801 but keeps its realm name.
If a belligerent has no realm (rebels, militias, alliances), leave it out of `members` and describe it in the text.
Look at `content/moments*.json` for an existing moment about this war and put its `id` in `moment`.

## Output: JSON array, one object per war, chronological
```json
{
  "id": "world-war-ii",
  "name": "Second World War",
  "moment": "world-war-ii",                       // id from content/moments*.json, or null
  "span": [1939, 1945],                           // integer years; negative = BCE
  "dateLabel": "1 September 1939 – 2 September 1945",
  "summary": "…",                                 // 120–180 words: causes, course, outcome
  "casualties": "…",                              // one sentence, mainstream range with "estimated"
  "sides": [                                      // 2–4 sides; members change over time (entry, exit, occupation)
    { "name": "Allies", "members": [ { "clio": "(British Empire)", "from": 1939, "to": 1945 } ] },
    { "name": "Axis", "members": [ { "clio": "Nazi Germany", "from": 1939, "to": 1944 } ] }
  ],
  "events": [                                     // 15–30 key events, strictly in date order
    { "date": "1939-09-01", "year": 1939, "label": "1 Sep 1939",
      "text": "Germany invades Poland",          // ≤ 90 chars
      "detail": "…",                              // 60–110 words: context → what happened → what it changed
      "lonlat": [20.0, 52.2],                     // where it happened, 2 decimals
      "kind": "battle" | "invasion" | "treaty" | "turning-point" | "atrocity" | "political" | "other" }
  ],
  "sources": [ { "title": "…", "url": "…" } ]     // 4–8 pages you actually fetched
}
```
- `date`: ISO "YYYY-MM-DD" or "YYYY-MM" (BCE: use the `year` field for ordering and put the month in `label`, e.g. "Aug 216 BCE").
- `year` must equal the event's year and lie inside `span`.
- Validate: JSON parses; ids unique; events in date order; all member names exist in index.json with years inside their rows.
- Log to `content/factcheck/wars-<slice>.md`: member choices, gaps in the map data, contested facts.
