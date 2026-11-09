# War chapter review: brief

The atlas plays the First World War as a storyboard of chapters (content/cinema/world-war-i.json, key `chapters`).
Each chapter frames one place and animates its change: fronts (lines), occupied areas (rings), offensive arrows,
battles. A reader found chapter 2 wrong: the data had only two front positions five weeks apart, so Russia's invasion
of East Prussia never appeared. Your job: make your chapters historically right, and prove it with checks.

**Be adversarial.** Assume the map is wrong until a source shows it is right. Look for what is missing (an invasion,
a retreat, a captured city) as much as what is misplaced.

## Tools (run from the repo root, /Users/dinesh/Projects/WorldHistory)
- `python3 -I tools/cinema/render_frames.py world-war-i <your-scratch-dir> <chapter-id> ...` renders each chapter at
  its start, middle and end (SVG + PNG). Open the PNGs with the Read tool. Dashed black = front at the chapter's
  start; solid = now; filled colour = occupied ground (only shown on enemy or neutral states); squares = claims
  (green = map agrees, red = disagrees). A lon/lat grid helps you compare with reference maps.
- `python3 -I tools/cinema/check_history.py world-war-i` runs the automated checks (claims, arrowheads vs fronts,
  battles near fronts, chapter change, keyframe gaps, front/occupation overlap). Report goes to
  content/factcheck/history-check-world-war-i.md.
- To test your fixes WITHOUT touching the shared file: copy content/cinema/world-war-i.json to your scratch dir,
  `python3 -I tools/cinema/apply_review.py <your-review.json> --target <copy>`, then run the two tools above with
  `CINEMA_FILE=<copy>` in the environment. Iterate until your chapters' frames match the sources and the checks pass.
- How the app draws (so your data does what you expect): keyframes are resampled and interpolated linearly between
  dates; an occupied area appears at its first key (fading in over ~2 weeks) and holds until its `end` or the war's
  end; a front fades ~5 weeks after its last key unless that key is the war's end. Front lines should run the same
  direction in every keyframe (north→south or west→east). Occupied areas are closed rings [lon, lat].

## Sources
Read content/FACTCHECK.md (fetch what you cite; never invent URLs). Best for geometry: the West Point (USMA) Atlas of
the Great War plates (public domain; on Wikimedia Commons, search "West Point" + campaign) and Commons/Wikipedia
campaign maps; for dates and places: Wikipedia articles' cited statements, official/museum pages. Download maps to
your scratch dir and open them with Read; place points by matching named towns/rivers to the lon/lat grid.

## What to deliver: `content/factcheck/chapter-review-<letter>.json` (only your file)
```json
{
  "reviewer": "<letter>",
  "chapters": ["<chapter id>", ...],
  "findings": [ { "chapter": "...", "severity": "error|warning", "issue": "...", "fixed": true,
                  "source": {"title": "...", "url": "..."} } ],
  "claims": [ { "chapter": "...", "place": "Lemberg", "lonlat": [24.03, 49.84], "date": "1914-09-03",
                "holder": 0, "source": {"title": "...", "url": "..."} } ],
  "patch": { see tools/cinema/apply_review.py docstring: fronts / occupations / new_occupations / arrows /
             new_arrows / remove_arrows / chapters }
}
```
- **claims**: 5–10 per chapter. Who held a named place on a date (holder = side index: 0 = Allies, 1 = Central
  Powers), or `"holder": "front"` for a place on the front line that day. Pick the turning points the chapter's text
  mentions (cities taken, lines reached, lines given up), each with a fetched source. These become permanent
  regression tests.
- **patch**: add front/occupation keyframes so each chapter's main moves happen on screen at the right dates (a
  position at least every 3–4 weeks while the front moves fast; static periods need none). Fix arrows whose path or
  dates are wrong. Rewrite a chapter's `text` only if it is wrong or misses its main event; keep it 2–4 plain
  sentences. Keep geometry inside the chapter; don't edit other reviewers' chapters except to keep a shared front
  continuous (say so in findings).
- Done means: your chapters' frames match the sources, every one of your claims is green, and `check_history.py`
  reports no errors for your chapters (explain any warning you leave).
- Reply with: chapters reviewed, counts of findings/claims/keyframes added, and the 3 most important fixes.
