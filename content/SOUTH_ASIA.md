# South Asia layer pack: brief

The atlas draws borders from Cliopatria, which leaves out many South Asian states. A coverage audit lists them:
`content/factcheck/coverage-gaps.md`, section "South Asia" (from Wikidata; re-run with `python3 -I tools/gaps.py`).
You fill the gaps for one period with **reconstruction layers**, the same kind as `content/supplements/sangam.json`
(Sangam-age Tamilakam). Read that file and copy its structure exactly.

## Before you draw
- Check every candidate against what the map already has: `public/data/clio/index.json` (`realms[name].tl` =
  [[from, to, km²], …]; names such as "Vijayanagara Empire", "Bahmani Sultanate", "Nayaks of Madurai") and the
  other layers in `content/supplements/`. Some audit entries are duplicates under another Wikidata id (e.g.
  "Chola dynasty" = the drawn Chola realms), vassal provinces, or modern states: skip those and say so in your log.
- Princely states 1858–1948 are another researcher's (`princely-states.json`): end your regions by 1857 where a
  state continued as a princely state.
- Draw the most notable missing states first (Wikipedia editions in the audit), then as many more as you can do well.

## Sources (read content/FACTCHECK.md: fetch what you cite, never invent URLs)
- **Geometry**: the *Imperial Gazetteer of India* Atlas (1909, public domain), whose historical plates show India at
  dated moments (c. 1525, 1605, 1700, 1765, 1795, 1805, 1823, 1837, 1857, and earlier periods); find the scans on
  Wikimedia Commons or the Digital South Asia Library (dsal.uchicago.edu). Muir's Historical Atlas (1911, public
  domain) and freely licensed Commons maps of each dynasty. Georeference by the printed latitude/longitude grid.
- **Checking**: Schwartzberg, *A Historical Atlas of South Asia* (DSAL scans) to verify extents and dates; cite it,
  but do not copy its drawings. Dates and capitals from cited statements (Wikipedia articles' cited claims, university
  and museum pages).
- When sources disagree, take the mainstream reading and say so in the region's `note`.

## Your file
`content/supplements/sa-<period>.json`: one layer object like sangam.json (`id`, `title`, `from`, `to`, `summary`,
`regions`, `sites` (capitals, may be empty), `sources`, `replaces` usually `[]`).
- One region per state per stable extent: `name` (e.g. "Madurai Sultanate"), `key` = the state's own name (so each
  state has its own colour and all its time-slices share it), `kind` ("sultanate", "kingdom", …), `from`, `to`
  (several regions with the same key for a state whose extent changed), `capital`, `rulers` (2–6 named, with dates),
  `note` (status, sources, uncertainty), `coords` (closed [lon, lat] ring, about 0.05–0.1° detail).
- Regions of different states in the same years must not overlap each other.
- `replaces`: only list a Cliopatria realm name if your layer redraws that same state better; it is hidden for the
  layer's whole `from`–`to` span, so keep each layer's span tight.
- Render your polygons over a basemap to PNG (small stdlib/ffmpeg script) and look at them with the Read tool
  against the source maps, year by year, fixing shapes until they match.

Also write `content/factcheck/sa-<period>.md`: states drawn, maps traced and how georeferenced, states skipped and
why, uncertainties. Then run `python3 -I tools/content.py` (2–3 minutes) and fix anything it reports about your file.
Write only your own two files; do not edit shared files or commit. Fetch politely (~1 request per 2 s, User-Agent
"AtlasOfEmpires/0.1 (educational map)"); use your own scratch directory (mktemp -d); never kill processes you did
not start.
