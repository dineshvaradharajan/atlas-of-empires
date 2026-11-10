# War storyboards: brief

The atlas plays wars as **storyboards**: a war is split into chapters, each framing **one place** and animating
**only its own change**: the front or area held at the chapter's start (dashed) and end (solid), the ground that
changed hands in strong colour, the offensives that took it (arrows) and its battles. The reader steps through
chapters or plays them in turn. The First World War is done; you build others the same way.

**Worked example:** content/cinema/world-war-i.json (read it), and play it at http://localhost:8765/#w/world-war-i/c2
if the dev server is up. Lessons from its review (apply them):
- A chapter with too few positions shows nothing: put a front/area position at the chapter's start, at each turning
  point, and at its end (every 2–4 weeks while things move fast; none needed while static).
- Every capture the chapter text mentions must happen on the map on that date (a claim tests it).
- Never put events or battles from another theatre into a chapter (each chapter is one place: its `bbox`).
- Arrows end where the advance actually stopped, not beyond the front.
- The yearly base map is often wrong for a war (it may draw a country whole that was half-occupied, or lack the
  polity entirely). Correct it with **occupation areas** (side = who held it), which are drawn only on enemy or
  neutral states; add an area for each side where needed (WWI has "Allied-held ground behind the Western Front").
- `baseYears` can show another year's borders for a date range (WWI: 1917 borders until Brest-Litovsk).
- **One continuous area per side per region, no carved gaps.** Never draw each army's zone as a separate area with
  enemy ground showing between them, and never notch an area so an arrowhead or battle sits outside it (an arrow
  may end inside enemy ground). A hole or gap is allowed only where a place really held out (a besieged fortress, a
  city that never fell); back it with a sourced claim inside it on that date. The checker's **pockets** rule fails
  unexplained enemy ground over 2,500 km² inside or between one side's areas and warns from 600 km².

## Your file: `content/cinema/<war-id>.json` (war ids and sides: content/wars/*.json; side index = order of `sides`)
```json
{"war": "<war-id>", "start": "YYYY-MM-DD", "end": "YYYY-MM-DD",
 "note": "1–2 sentences: lines and areas are approximate reconstructions from campaign maps",
 "chapters": [ {"id": "kebab-id", "title": "...", "start": "...", "end": "...", "bbox": [w, s, e, n],
                "arrows": ["<arrow name>", ...], "text": "2–4 plain sentences for a 14+ reader"} ],
 "fronts": [ {"name": "...", "keys": [{"date": "...", "line": [[lon, lat], ...]}], "end"?: "date"} ],
 "occupations": [ {"name": "...", "side": 0, "keys": [{"date": "...", "coords": [[lon, lat], ...]}], "end"?: "date"} ],
 "arrows": [ {"name": "...", "side": 0, "start": "...", "end": "...", "path": [[lon, lat], ...]} ],
 "battles": [ {"name": "...", "start": "...", "end": "...", "lonlat": [lon, lat], "casualties": "mainstream range",
               "casNum": 12345} ],
 "claims": [ {"chapter": "<chapter id>", "place": "...", "lonlat": [lon, lat], "date": "...", "holder": 0,
              "source": {"title": "...", "url": "..."}} ],
 "baseYears"?: [{"start": "...", "end": "...", "year": 1917, "why": "..."}],
 "sources": [ {"title": "...", "url": "..."} ]}
```
- Dates are ISO; BCE dates are negative years: `"-216-08-02"` (months work for BCE too).
- **Chapters:** 6–12 per war (14–18 for very large wars), chronological by start, each the key episodes a reader
  should understand; `bbox` frames that place only.
- **Fronts** only where a continuous front line existed; otherwise use occupation areas (control) and arrows
  (campaigns). Lines run the same direction in every keyframe; rings are closed lists of [lon, lat].
- **Claims:** 4–8 per chapter: who held a named place on a date (`holder` = side index, or `"front"` for a place on
  the front line that day), each sourced. They are permanent regression tests.
- **Battles:** mainstream casualty ranges with a middle `casNum`; only battles in a chapter's place.

## Tools (repo root, `python3 -I`)
- `tools/cinema/validate.py content/cinema/<war-id>.json`: structure (dates, order, shapes).
- `tools/cinema/check_history.py <war-id>`: claims vs map, arrowheads vs fronts, chapters show change, keyframe gaps, pockets (stray enemy ground inside or between one side's areas),
  fronts vs occupied areas. **Done = 0 errors and every claim green**; explain any warning you leave.
- `tools/cinema/render_frames.py <war-id> <scratch-dir>`: each chapter at start/middle/end with a lon/lat grid;
  open the PNGs with Read and compare with reference maps. Look at every chapter.
- `python3 -I tools/content.py` rebuilds the app data (public/data/cinema/<war-id>.json) so you can view it in the app.

## Sources
Read content/FACTCHECK.md: fetch what you cite, never invent URLs. Geometry from campaign maps (West Point/USMA
atlases are public domain and on Wikimedia Commons; Commons and Wikipedia campaign maps); dates and places from cited
statements. Wikipedia rate-limits heavy API use: fetch raw wikitext via
`https://en.wikipedia.org/w/index.php?title=<T>&action=raw` slowly (~1 request every 2 s) or use WebFetch; Commons files
via `https://commons.wikimedia.org/wiki/Special:FilePath/<file>?width=1600`. User-Agent "AtlasOfEmpires/0.1 (educational map)".

## Deliverables (only your own files)
- `content/cinema/<war-id>.json` for each of your wars.
- `content/factcheck/storyboard-<war-id>.md`: chapters chosen and why, maps traced, uncertainties, warnings left.
- Reply with, per war: chapters, claims (all passing?), keyframes, arrows, battles, and the 3 hardest calls.
