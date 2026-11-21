# Zoomed-in accuracy: coasts, borders and occupied areas

Why the map looked blocky and off the shore when zoomed in, what changed, and what it costs to download.
Screenshots are in `zoom-detail/` (before = main at 00cd766, with the coast band; after = this branch), desktop 1400×880 unless noted.

## Where detail was lost (measured)

| Layer | Source | Vertex spacing (median / 90th pct) | Coast off the real one (median / 90th pct) |
|---|---|---|---|
| Realm borders, before 1992 | Cliopatria (`build_clio.py`) | 19–22 km / 44–58 km in the source itself | 5–9 km / 15–32 km |
| Base map (peoples, unrecorded land) | historical-basemaps (`build.py`) | 14–29 km / 40–87 km | 3–17 km / 14–88 km |
| Realm borders, 1992 on | Natural Earth 10m (`build_modern.py`) | ~1.4 km | 0.5 km / 1.8 km |
| Rivers, lakes, sea names | Natural Earth 50m (`physical.py`) | | |
| Terrain shading | ETOPO5 (`relief.jpg`), ~18 km a cell; already fades out past zoom 6 | | |

Measured over the Channel/Biscay (6°W–3°E, 43–51.5°N), the Malay Peninsula (98–106°E, 1°S–8°N) and the Balkans
(13–30°E, 36–47°N), years 1370, 1520 and 1900 (`tools/coast.py` against Natural Earth 1:10m).

- The 0.03° simplification in `build_clio.py` was not the main loss: Cliopatria's own points are ~20 km apart, and
  simplifying removed only ~20% of them. It did split shared borders: in the source about half the edges in Europe
  in 1370 are shared exactly by two neighbours; after simplifying each realm on its own, a quarter of those no longer
  matched, which shows as double lines, slivers and gaps when zoomed in.
- Rounding to 0.01° (~1 km) is about one pixel at the closest zoom and is kept.
- `compact.py` is lossless (it checks every file round-trips) and is not a source of error.
- The app draws every shape at its source resolution at all zooms: the WebGL renderer projects once and scales, the
  2D overlay strokes cached paths, line widths are divided by the zoom. Nothing is re-simplified per zoom.
- Zoom: `scaleExtent([1, 24])`. On a 1400 px desktop that is ~4 px per degree at the world view and ~80 px per
  degree (about 1.4 km a pixel, a view ~17° wide) at the closest zoom; phones get 1 px per degree per zoom step
  (24 px per degree at most). So a 15–30 km coastal offset is under a pixel at world scale and 12–40 px zoomed in.
- War occupied areas (`content/cinema/*.json`) are hand-drawn rings of 4–60 points, resampled to 192 points and
  morphed between keyframes, then clipped to the land and to the occupier's own realms. Zoomed in they were clipped
  to the coarse base-map coast, so they inherited its steps and its overhang into the sea.
- The Hundred Years' War example (1374, Gascony): the grey strip west of the English lands was the base map's
  "English territory" polygon lying several km out over the Bay of Biscay, beyond Cliopatria's coast, which itself
  runs in 0.08° steps (`hundred-years-war-1374-*-before.jpg`).

## What changed

Three layers of detail, each only as fine as the zoom needs.

1. **Borders kept as Cliopatria draws them** (`tools/build_clio.py`). Simplification is gone. Two neighbours now
   share one line, with no slivers or double borders between them, for +2% download.
2. **Coasts carried out to the real coast** (`tools/coast.py`, `snap_ring`, run by `build_clio.py`). Each coastal
   point of a Cliopatria row moves to ~2 km past the nearest Natural Earth coast if all of these hold:
   - it lies on land, within 0.25° (~28 km) of the sea;
   - the sea lies straight out from the shape there (within 50°);
   - it is not inside a border shared with a realm of overlapping years (Cliopatria reuses points across
     centuries, so this is checked per period);
   - its way to the sea does not cross another realm of those years.

   Where a shared border reaches the coast, its end point moves the same way in both realms. 235,000 points move.
   Points already out at sea stay; the clip below trims them. The last guard came from a real failure: an unmatched
   Egypt–Israel border facing the Gulf of Aqaba pulled Egypt over Eilat in 1949. Adding points along coastal edges
   first would follow the coast more closely but costs ~10% more download (`STEP` in `coast.py`). Main's coast band
   (`BAND_KM`, e198715) fills those strips on screen for free.
3. **A detailed coastline when zoomed in** (`tools/build_detail.py` → `public/data/coast/`, `public/app.js`
   "detailed coastline"):
   - Natural Earth 1:10m land, country borders dissolved, simplified to ~450 m (half a pixel at the closest zoom),
     cut into 10° tiles.
   - Past 16 map pixels per degree (desktop zoom ~4, phone zoom 16) the page loads the tiles in view, then:
     - every fill and border is clipped to that land (a stencil bit in WebGL, a clip path in the 2D fallback);
     - land no realm covers shows as unrecorded;
     - the coast is stroked like a border;
     - the coast band, occupied areas, reconstructions and the selection, hover and journey outlines all clip to
       it too.
   - World view and phones at normal zoom download nothing extra.

War occupied areas are clipped to the detailed coast. Like realms, they can also be carried out to the coast, but
only where a war story asks for it: `"coast": true` on the war file or on one area. Doing it everywhere was
historically wrong: fronts often run within a few km of a coastal city the other side held, and it swallowed
Oranienbaum (1941–44), besieged Mariupol (March–May 2022) and Mykolaiv (never taken), even with a 9 km reach. No war
asks for it yet, so `public/data/cinema/` is unchanged.

## Sizes (brotli, as Cloudflare serves them)

| What | Before (main) | After |
|---|---|---|
| All border files (`clio/*.json`, packed by `compact.py`) | 2.98 MB | 3.10 MB (+4%) |
| One year's border file, e.g. 1900 / 1750 / 1300 | 150 / 112 / 82 KB | 157 / 116 / 86 KB |
| Coast tiles, whole world (371 tiles, 1.57 MB raw) | — | 620 KB, median tile 0.9 KB, largest 10.6 KB |
| Coast tiles for one zoomed-in view: Channel, desktop zoom 24 | — | 5 tiles, 22 KB |
| … Malacca, desktop zoom 24 | — | 6 tiles, 19 KB |
| … Channel, phone zoom 24 | — | 11 tiles, 34 KB |
| … all of Europe at the switch-on zoom (desktop zoom ~6) | — | 39 tiles, 102 KB |
| War files | 4.46 MB | unchanged |

Tiles go through the same `?v=` versioning as the other data, so they are cached for a year.

## Coastal land a realm reaches

Points 1 km inside the Natural Earth coast that fall inside a realm (realm shapes only, before the coast band):

| Year | Channel/Biscay | Malay Peninsula | Balkans |
|---|---|---|---|
| 1370 | 73.9% → 80.4% | 55.8% → 61.6% | 27.0% → 41.1% |
| 1520 | 73.9% → 80.4% | 47.4% → 53.1% | 28.8% → 43.6% |
| 1900 | 73.8% → 80.1% | 58.5% → 63.7% | 29.2% → 44.7% |

Most of what is left is islands Cliopatria does not draw (Dalmatian and Aegean islands, the Riau islands). Zoomed in,
they now show at their real shape as unrecorded land, where before they were missing or blobs.

## Screenshots (`zoom-detail/`)

Desktop 1400×880 unless marked `phone` (375×812). Zoom 24 is the closest.

- `channel-1900-k6`, `channel-1900-k24`: the English Channel. At 24, Brittany, the Cotentin and the English south
  coast change from 20–60 km straight segments to the real coastline.
- `malay-1520-k6`, `malay-1520-k24`: the Malay Peninsula. Johor and Malacca reach the real Strait of Malacca coast,
  and the Riau islands appear.
- `balkans-1900-k6`, `balkans-1900-k24`, `balkans-1400-k12`: the Adriatic and the Aegean. Italy's and
  Austria-Hungary's stepped coasts are gone, and the Dalmatian islands are drawn.
- `provence-1759-k12`, `provence-1759-k24`: Provence and Liguria with France selected. France's outline now runs
  along the real coast instead of through the band, and Sardinia's and Genoa's stepped coasts over the Ligurian Sea
  are gone. The stepped edge east of Genoa is an inland border Cliopatria itself draws that way.
- `hundred-years-war-1374-k10`, `hundred-years-war-1374-k24`: the "Charles V wins it back" stage. Gascony and the
  reconquered lands meet the real Biscay coast. The grey strip in the user's report was the old base map's
  "English territory" polygon lying several km out over the sea, which the clip removes.
- `phone-provence-1759-k24`: the same at phone size.

## Checks

- `tools/cinema/check_history.py`, this branch against main, both regenerated: no new errors. 9 more warnings over 5
  wars, all of one kind: a strip of coast between a hand-drawn occupied area and the sea now reads as the defender's
  realm instead of unrecorded, because realms reach the coast. These are leads for the war-story authors; each can
  be fixed by redrawing the area or by adding `"coast": true` after checking:
  - World War II: Crimea and Kerch 1941–43, Danube delta 1941;
  - Vietnam: near Quang Tri, February 1975;
  - Second Punic War: Syracuse 212 BCE;
  - Peloponnesian War: Attica 411 BCE;
  - Third Crusade: Jaffa, July 1192.
- `content.py`'s border claims: 1654/1665 pass, the same as main.
- Not covered:
  - The 2D (no-WebGL) fallback is written but was not exercised in a browser.
  - `tools/maplint.py` was not rerun on this branch: the map-lint session owns it.
