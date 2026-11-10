# Ancient sites and cultures: brief

The atlas is being extended back to **10,000 BCE**. Before about 3400 BCE there are no states and no writing, so the
map shows **archaeological cultures** (approximate regions) and **sites and monuments** (points), each with an honest
**evidence label**. Later ancient monuments (to about 500 CE) are added too. You research one region.

## Evidence labels (required on every site and culture)
- `written`: attested in contemporary writing (inscriptions, texts) as well as archaeology.
- `archaeology`: known only from excavation and dating; no writing existed or none survives. Say how it is dated.
- `disputed`: real remains, but the identification, dating or interpretation is contested among scholars
  (e.g. the Xia dynasty and Erlitou; the dating of Dwarka's submerged structures). Say what is disputed.
- `legendary`: described in tradition or texts but not supported by archaeology (e.g. Kumari Kandam; Atlantis).
  Include only famous cases readers ask about; place them only if tradition gives a location, and say plainly
  "Not proven: no archaeological evidence has been found."
`evidenceNote` is one plain sentence a 14-year-old understands, e.g. "No writing existed; everything we know comes
from excavations since 1995 and radiocarbon dates." Never present a legend or a contested claim as fact.

## Sources
Read content/FACTCHECK.md (fetch what you cite; never invent URLs). Prefer site/museum/university/UNESCO pages and
peer-reviewed summaries; cited Wikipedia statements are fine. Use mainstream radiocarbon dates with "c."; give ranges.
Wikipedia rate-limits heavy API use: fetch raw wikitext via `https://en.wikipedia.org/w/index.php?title=<T>&action=raw`
slowly (~1 request every 2 s), or use WebFetch. Polite fetching, User-Agent "AtlasOfEmpires/0.1 (educational map)".

## Images (optional, one per site)
Openly licensed only (public domain, CC0, CC BY, CC BY-SA) from Wikimedia Commons; look at it before using it
(download to your scratch dir, open with Read). Link a 600–1000 px thumbnail on upload.wikimedia.org; record the
Commons file page, credit and licence exactly as stated.

## Deliverables (only your own files)
`content/ancient/sites-<region>.json`: a JSON list, 30–50 sites, earliest first:
```json
{"id": "gobekli-tepe", "name": "Göbekli Tepe", "altNames": [], "lonlat": [38.92, 37.22],
 "kind": "monument | settlement | city | temple | tomb | rock-art | earthwork | observatory | megalith | other",
 "built": -9600, "until": -8200, "dateLabel": "c. 9600–8200 BCE", "standing": true,
 "evidence": "archaeology", "evidenceNote": "...", "culture": "pre-pottery-neolithic-a",
 "summary": "60–110 words: what it is, why it matters, what was found",
 "unesco": true,
 "image": {"image": "https://upload.wikimedia.org/...", "page": "https://commons.wikimedia.org/wiki/File:...",
           "caption": "...", "credit": "...", "license": "CC BY-SA 4.0"},
 "sources": [{"title": "...", "url": "..."}]}
```
- `built`/`until`: years (negative = BCE) of construction/first occupation and end of use or abandonment
  (`until: null` only if still in use today). `standing`: true if substantial remains are visible today.
- Cover the famous and the foundational: first villages, first cities, temples, tombs, megaliths, observatories,
  rock art; for later antiquity (to ~500 CE) the landmark monuments of the region's civilizations.

`content/ancient/cultures-<region>.json`: a JSON list, 12–25 archaeological cultures / early civilizations:
```json
{"id": "natufian", "name": "Natufian culture", "from": -12500, "to": -9500, "dateLabel": "c. 12,500–9500 BCE",
 "evidence": "archaeology", "evidenceNote": "...", "summary": "40–90 words",
 "extents": [{"from": -12500, "to": -9500, "coords": [[lon, lat], ...]}],
 "sources": [{"title": "...", "url": "..."}]}
```
- `extents`: approximate areas from published distribution maps (closed rings, 8–30 points, [lon, lat]); several
  entries if the area changed over time. Keep to land the culture actually occupied; draw cores, not maximum spreads.
- Only cultures that end before the region's written states take over on the map (the map's state data starts
  3400 BCE in Mesopotamia/Egypt and later elsewhere), or that coexist outside those states (e.g. Jōmon, Lapita,
  Yamnaya, Nok). Do not duplicate states the map already draws (public/data/clio/index.json → realms).
- Validate: JSON parses; ids unique and kebab-case; rings closed; lon/lat plausible; years ordered.
- Log to `content/factcheck/ancient-<region>.md`: what you included, what you left out and why, and every
  disputed/legendary case with the scholarly positions.
- Reply with counts (sites, cultures, by evidence label) and the 5 most interesting inclusions.
