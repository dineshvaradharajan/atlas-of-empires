# Regional layer packs: brief

The atlas draws borders from Cliopatria, which leaves out many states. A coverage audit lists them:
`content/factcheck/coverage-gaps.md` (from Wikidata, most notable first; re-run offline with
`python3 -I tools/gaps.py data/wikidata-states.json`). You fill the gaps for one region with **reconstruction
layers**, exactly as the South Asia packs did: read `content/SOUTH_ASIA.md` (the full method; follow it, except
for the region-specific sources below) and look at `content/supplements/sa-medieval.json` as a worked example.

## Choosing what to draw
- Work down your region's list in the audit, most notable first. Skip, and list in your log with the reason:
  states the map already draws under another name or id (check `public/data/clio/index.json` realm names, rows and
  the existing `content/supplements/*.json`), regimes that are the same territory as a drawn state (e.g. a republic
  renamed), provinces and vassals inside a drawn state's outline unless they were effectively independent, and
  entities too small to draw at about 0.05° (e.g. single cities: draw city-states only if they ruled real territory).
- Prefer states that were independent and lasted at least ~25 years. Aim for the 40–80 most notable real gaps you
  can draw well; quality and correct dates matter more than count.

## Region-specific sources (all public domain unless noted; fetch what you cite)
- **Europe and the Mediterranean:** William R. Shepherd, *Historical Atlas* (1911/1923; scans at the University of
  Texas Perry-Castañeda Library and Wikimedia Commons); Gustav Droysen, *Allgemeiner historischer Handatlas* (1886);
  Muir's Historical Atlas (1911); freely licensed Commons maps per state. Euratlas and modern atlases (copyright):
  check extents only, never copy.
- **Middle East and Central Asia:** Shepherd; Droysen; Muir; Commons maps; the *Encyclopaedia Iranica* and
  *Encyclopaedia of Islam* (cite statements, do not copy maps).
- **Africa:** Shepherd's and Droysen's Africa plates (colonial-era, careful with pre-colonial states); Commons maps;
  UNESCO *General History of Africa* (free PDFs on unesdoc.unesco.org; cite statements); Ajayi & Crowder, *Historical
  Atlas of Africa* (copyright: check only). Pre-colonial African borders are especially approximate: say so.

## Your files
`content/supplements/<id>.json` (one layer, your assigned id) and `content/factcheck/<id>.md`. Same rules as the
South Asia brief: one region per state per stable extent, `key` = the state's own name, no overlaps between your
regions in the same years, `replaces` only for a Cliopatria realm you redraw better, render and compare with the
source maps, then run `python3 -I tools/content.py` and fix anything it reports about your file. Write only your
own files, do not commit, fetch politely (~1 request per 2 s, User-Agent "AtlasOfEmpires/0.1 (educational map)"),
use your own scratch directory (mktemp -d), never kill processes you did not start.
