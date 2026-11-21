# Prehistory page: map data sources (checked 2026-11-21)

What can be drawn for each stretch of time, and under which licence. Every source below was opened and its licence
read on the page named.

## What exists

| Span | Source | What it gives | Licence (where read) |
|---|---|---|---|
| 540 million years ago to today | Scotese & Wright 2018, *PALEOMAP Paleodigital Elevation Models (PaleoDEMs) for the Phanerozoic*, [doi:10.5281/zenodo.5460860](https://doi.org/10.5281/zenodo.5460860) | Height of the land and depth of the sea on a 1° grid (and a 6-minute grid), one map every 5 million years: 109 maps in the download | CC BY 4.0 (Zenodo record, and `License.txt` inside the zip) |
| 750 million years ago to today | Scotese, *PALEOMAP PaleoAtlas for GPlates*, [zenodo.org/records/10596610](https://zenodo.org/records/10596610) | Plate rotations and coastlines matching the elevation maps (to move today's places to where they were) | CC BY 4.0 (Zenodo record) |
| 1 billion years ago to today | Merdith et al. 2021, *Extending full-plate tectonic models into deep time*, Earth-Science Reviews, [zenodo.org/records/12525525](https://zenodo.org/records/12525525) | Outlines of continents and old cores (cratons), plate boundaries | CC BY 4.0 (Zenodo record) |
| 1.8 billion years ago to today | Cao et al. 2024, *Earth's tectonic and plate boundary evolution over 1.8 billion years*, Geoscience Frontiers, [doi:10.5281/zenodo.13628813](https://doi.org/10.5281/zenodo.13628813) | Outlines of continents, plate boundaries | CC BY 4.0 (Zenodo record) |
| before 1.8 billion years ago | none | No published global reconstruction. Only a few old cores of continents survive and their positions are not known. | — |

All four models are served by the GPlates Web Service (`https://gws.gplates.org/reconstruct/coastlines/?time=<Ma>&model=<name>`,
models `paleomap`, `merdith2021`, `cao2024`), which returns outlines at any age as GeoJSON (tested at 100, 800 and
1500 million years ago: 650–2,450 shapes, 40,000–98,000 points each). It can also move a present-day point to its
past position, which the page needs for fossil sites and craters.

## What this means for the page
- **540 million years ago to today:** real terrain and sea depth on the globe, changing every 5 million years. This is
  the richest part: mountains, shallow seas and deep oceans are all in the data.
- **1.8 billion to 540 million years ago:** continent outlines only (no terrain). Draw them plainly and say so:
  "outline only; heights are not known". Use Cao et al. 2024 for the whole stretch so it is one consistent model.
- **4.54 to 1.8 billion years ago:** no map is possible. Show the planet as a clearly labelled artist's impression
  (molten surface, then ocean world, then the first small continents).
- The models disagree with each other more the further back they go, and longitudes before about 200 million years
  ago are poorly known in all of them. Say this once on the page.

## Practical notes for the build
- The page uses the **6-minute** elevation maps (about 11 km per cell at the equator), chosen on 2026-11-21 over the
  1° text files (about 110 km per cell). They come only as NetCDF-4, so `tools/paleo.py` is the one tool that needs
  more than the Python standard library: numpy and netCDF4, kept in `.venv-paleo/` (not committed; the tool's header
  has the two commands). The 202 MB zip stays in `data/prehistory/paleodem/` (not committed) and is read in place.
- `tools/paleo.py` writes `public/data/paleo/<Ma>.png`, 109 maps from 0 to 540 million years ago in steps of 5, each
  2048 x 1024, height packed into 8 bits with the finest steps near sea level, and `index.json`. 36 MB in all
  (190–760 KB a map); a full rebuild takes about a minute.
- The download's file name says 88 maps; it holds 109, one for every 5 million years with none missing.
- Each map also has a stated age that is not a round number (the "65" map is the end of the Cretaceous, 66 million
  years ago); `index.json` keeps the stated description.
- A newer 6-minute set exists on Zenodo (record 14550344, CC BY 4.0) but holds only two maps; not usable on its own.
- Credit each model by name, authors, year and licence on the page, as the About page does for other data.

## Accuracy test (2026-11-21)

The Earth was drawn from the 1° elevation text files at 0, 65, 100, 150, 200, 250, 300, 400, 450 and 540 million
years ago, flat and as globes, and measured two ways.

### 1. The present-day map against the real coast
The data's map for today, compared with Natural Earth 1:50m land on quarter-degree cells, between 60°S and 60°N:
- land covers 26.8% of the surface as drawn, 26.5% in reality;
- 1.55% of the surface is drawn as the wrong one of land and sea;
- 97.5% of real land is drawn as land;
- the real coast is a median 27 km from the drawn coast, and 90% of it is within 111 km (one grid cell);
- of 24 named places checked, 22 are right. Crete and Hawaii are missing: islands smaller than a grid cell are lost.

So the drawing method and the data are sound; the limit at 1° is the grid.

The same test with the 6-minute maps, on tenth-of-a-degree cells:
- 0.45% of the surface is drawn as the wrong one of land and sea (1.55% at 1°);
- 99.4% of real land is drawn as land;
- half of the real coast falls in the same cell as the drawn coast, 90% is within 11 km and 99% within 81 km;
- of 18 further small places checked (Crete, Hawaii, Cyprus, Mallorca, Bali, Singapore, Mauritius, Tahiti, Jamaica,
  Zanzibar, Gotland and narrow seas such as the Gulf of Suez), 17 are right; the Isle of Man is missing.
The finer grid sharpens what is known. It does not make the older maps more certain: the detail in a 300-million-
year-old coast is today's rock outcrops carried back, not a surveyed shoreline.

### 2. Published models against each other
Ten present-day cities were moved back in time with three independent models (PALEOMAP, Merdith 2021, Torsvik &
Cocks 2017) through the GPlates Web Service. The distance between pairs of cities does not depend on how a model
turns the whole globe, so it measures whether the models agree on the arrangement of the continents:

| Age (million years ago) | Models differ on the distance between two places by (median) | 90% of pairs within |
|---|---|---|
| 50 | 60 km | 280 km |
| 100 | 220 km | 700 km |
| 200 | 400 km | 1,600 km |
| 300 | 400 km | 2,800 km |
| 400 | 600 km | 5,400 km |
| 500 | 1,600 km | 4,400 km |
| 600 | 2,300 km | 4,600 km |

Where a place sits on the globe (latitude and longitude together) differs far more: a median of about 1,000 km at 50–100
million years ago, 2,000 km at 200–300, 4,000 km at 400 and 6,000–7,000 km at 500–600. Most of that is longitude,
which no method fixes well before the oldest surviving sea floor (about 180 million years old); latitude comes from
magnetism frozen in rocks and agrees to about 5–6° (600 km) back to 300 million years ago.
Cao 2024 is identical to Merdith 2021 after 1 billion years ago and Müller 2022 uses a different reference frame on
purpose, so neither counts as an independent check.

### What the data does not contain
- **Colour.** The data is height only. Green land is our choice and is wrong before plants covered the land (first
  land plants about 470 million years ago, forests about 385): earlier land should be bare rock. Deserts, forests and
  ice caps are not in the data and need a separate source or must be left out.
- **Ice.** No ice sheets in any of these maps (the project's own ice outlines only cover the last 12,000 years).
- **The old sea floor.** All sea floor older than about 180 million years has been destroyed; older oceans are drawn
  at one flat depth because nothing is known.
- **Shallow seas over the continents** come from where marine rocks are found. Broadly right, not exact.
- **Time steps.** One map every 5 million years; anything shown in between is a blend, not data.
- **Detail fades with age.** The maps for 400–540 million years ago are visibly smoother: fewer rocks survive.
