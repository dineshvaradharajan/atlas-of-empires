# The World Atlas

An interactive world map from **10,000 BCE to today**, live at https://www.worldatlas.site. Drag the timeline to any year and see who ruled
what, how far each empire reached, and what was happening in every region of the world.

- **Any year, accurate borders.** State borders come from Cliopatria (Seshat Global History Databank),
  a peer-reviewed dataset of 1,600+ polities with year-by-year territories.
- **Who ruled what.** Colonies and member states share their empire's colour (e.g. all of the Spanish
  Empire). Click a realm to see its territory through time, its greatest extent (dashed outline), its
  member lands, rulers, story and a reference map from Wikimedia Commons.
- **The state of the world.** 47 narrative chapters (3000 BCE → 2000 CE) cover the world's major powers
  and rulers, all 12 regions, and key events.
- **Unrecorded lands are grey.** Areas with no recorded state or people at that date are greyed out.
  Peoples and polities missing from Cliopatria appear as an approximate hatched layer; toggle it with ▨.

## Run locally

```bash
python3 -m http.server 8765 --directory public
```

Then open http://localhost:8765. Keyboard: ←/→ moves 10 years (hold Shift for 1 year), `[` and `]` jump
between chapters, Space plays and pauses, Esc clears the selection. Links are shareable, e.g. `#1683/Ottoman Empire`.

## Rebuild the data

```bash
python3 -I tools/build.py        # historical-basemaps snapshots -> public/data/<year>.json (peoples layer)
python3 -I tools/build_detail.py <ne_10m_admin_0_countries.geojson> # Natural Earth 1:10m land -> public/data/coast/ (the coast drawn when zoomed in)
python3 -I tools/build_clio.py   # Cliopatria -> public/data/clio/<chunk>.json + index.json (state borders, coasts carried to public/data/coast/)
python3 -I tools/build_patches.py <ne_10m_admin_0_countries.geojson> # content/borders/patches.json: sourced fixes to rows before 1992
python3 -I tools/build_modern.py <ne_10m_admin_0_countries.geojson>  # Natural Earth -> clio/1992.json (borders from 1992 to today)
python3 -I tools/content.py      # content/eras + content/empires + content/realm-notes.json -> public/data/content.json and realm-notes.json, links to Cliopatria
python3 -I tools/placeindex.py   # borders as drawn (corrections + reconstruction layers) -> public/data/place/ ("this place through time")
python3 -I tools/commons.py      # Wikimedia Commons reference maps -> public/data/commons.json
python3 -I tools/seo.py          # plain HTML pages, sitemaps and llms.txt for search engines (deploy.sh runs it; not committed)
.venv-paleo/bin/python tools/paleo.py <PaleoDEMS 6-minute zip>  # the ancient Earth, 540 million years ago to today -> public/data/paleo/ (needs numpy, netCDF4)
.venv-paleo/bin/python tools/climate.py                        # land colour from simulated climate, every 20 million years, and today's -> public/data/paleo/climate.png, climate-now.png (needs the Pohl et al. NetCDF files in data/prehistory/koppen/nc/ and Beck_KG_V1_present_0p083.tif in data/prehistory/koppen/beck/tif/)
.venv-paleo/bin/python tools/glacial.py                        # the last ice age's ice sheets, 25,000 to 12,000 years ago -> public/data/paleo/glacial.png (needs the NADI-1 OPTIMAL and DATED-1 mc shapefiles in data/prehistory/ice/)
python3 -I tools/narration.py     # the universe film's spoken commentary: public/universe/narration/narration.json -> one .m4a per line (macOS say and afconvert)
python3 -I tools/paleo_webp.py      # those maps as lossless WebP, checked pixel for pixel (needs cwebp and dwebp: brew install webp)
python3 -I tools/prehistory.py   # content/prehistory -> public/data/earth-history.json (the Earth history page at /earth-history/, with an Atlas view and a Space view)
```

Raw sources live in `data/` (`data/geo/` holds historical-basemaps, `data/clio/` holds Cliopatria). Natural Earth files
come from the `geojson/` folder of [natural-earth-vector](https://github.com/nvkelso/natural-earth-vector) and are passed
by path. `build_detail.py` only needs rerunning when Natural Earth changes; `build_clio.py` and `content.py` read its
tiles. Run the three border steps in this order: `build_clio.py` rewrites the files the other two edit, and
`build_patches.py` refuses to run twice. `PRESENT` in `build_modern.py` is the map's last year.

## Contributing

Found a wrong border, date or fact? [Open an issue](https://github.com/dineshvaradharajan/atlas-of-empires/issues/new/choose)
with a source, or send a pull request; see [CONTRIBUTING.md](CONTRIBUTING.md). Only the maintainer merges into `main` and deploys the site.

## Sources and licences

| What | Source | Licence |
|---|---|---|
| State borders | [Cliopatria](https://github.com/Seshat-Global-History-Databank/cliopatria), Seshat Global History Databank. Paper: *Scientific Data* (2025), [doi:10.1038/s41597-025-04516-9](https://doi.org/10.1038/s41597-025-04516-9). Geometry simplified for the web. | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |
| Borders from 1992 to today; island and micro states before 1992 | [Natural Earth](https://www.naturalearthdata.com/) 1:10m countries, in its default view of disputed places, with the border changes since 1992 dated by hand. Geometry simplified for the web. | Public domain |
| Peoples & other polities layer | [historical-basemaps](https://github.com/aourednik/historical-basemaps), A. Ourednik | GPL-3.0 |
| Reference maps | [Wikimedia Commons](https://commons.wikimedia.org/). Each image is credited with its author and licence in the app. | Per file (CC BY-SA, CC BY, PD, …) |
| Narrative text | Written for this project. Structure follows the 12 regional rows of the SenseForMaps decade-by-decade timeline. Short notes for states without a profile (`content/realm-notes.json`) are written for this project from Wikipedia and Wikidata, not copied. | MIT |
| Rivers, lakes, sea names, disputed areas | [Natural Earth](https://www.naturalearthdata.com/) 1:50m and 1:10m | Public domain |
| Terrain shading, ice-age coastline | [NOAA ETOPO5](https://www.ngdc.noaa.gov/mgg/global/relief/ETOPO5/TOPO/ETOPO5/) | Public domain |
| Ice-age sea level | Lambeck et al. 2014, *PNAS* 111:15296, [doi:10.1073/pnas.1411762111](https://doi.org/10.1073/pnas.1411762111) | (cited; values digitised) |
| Ice sheets | NADI-1, Dalton et al. 2023 ([Zenodo](https://zenodo.org/records/8161764)); DATED-1, Hughes et al. 2016 ([PANGAEA](https://doi.pangaea.de/10.1594/PANGAEA.848117)) | CC BY 4.0 / CC BY 3.0 |
| Empire pictures, ruler portraits, period photos | Wikimedia Commons, Library of Congress, US National Archives, UN Archives, Internet Archive; each credited in the app | Per item |
| Earth history globe (`/earth-history/`): land height and sea depth, 540 million years ago to today | PALEOMAP PaleoDEMs, C. R. Scotese & N. M. Wright 2018, [doi:10.5281/zenodo.5460860](https://doi.org/10.5281/zenodo.5460860); places carried back in time with the PALEOMAP plate model through the [GPlates Web Service](https://gwsdoc.gplates.org) | CC BY 4.0 |
| Home page globe: land colour from climate, 540 million years ago to today | A. Pohl, T. Wong Hearing, A. Franc, P. Sepulchre & C. R. Scotese 2022, Phanerozoic continental climate and Köppen–Geiger climate classes, *Data in Brief* 43, 108424; data [doi:10.5281/zenodo.6620748](https://doi.org/10.5281/zenodo.6620748). Ice sheets added from geological evidence (`iceAt` in `public/one/one.js`) | CC BY 4.0 |
| Home page globe: today's climate, blended in over the last few million years | H. E. Beck, N. E. Zimmermann, T. R. McVicar, N. Vergopolan, A. Berg & E. F. Wood 2018, Present and future Köppen–Geiger climate classification maps at 1-km resolution, *Scientific Data* 5:180214; data [doi:10.6084/m9.figshare.6396959](https://doi.org/10.6084/m9.figshare.6396959) | CC BY 4.0 |
| Home page globe: the last ice age's ice sheets, 25,000 to 12,000 years ago | NADI-1, Dalton et al. 2023 ([Zenodo](https://zenodo.org/records/8161764)); DATED-1, Hughes et al. 2016 ([PANGAEA](https://doi.pangaea.de/10.1594/PANGAEA.848117)), the same outlines as World history's ice | CC BY 4.0 / CC BY 3.0 |
| Deep-time records (temperature, CO2, oxygen, sea level, sea life, day length) and pictures | Listed with their licences in `content/prehistory/curves.json` and `images.json`, and on the page under "About this map" | CC BY 4.0, CC0, CC BY-SA or public domain, per item |
| Libraries and fonts | D3.js, earcut (ISC); Archivo, Inter (SIL OFL) | as stated |

All historical borders are scholarly approximations. Polities that existed but are absent from both
datasets can't be drawn. Please report errors to Cliopatria directly so that every user of the dataset benefits.

## Inspiration

The idea for this atlas came from [Bharat Rajya](https://www.bharatrajya.com/), an interactive map of the kingdoms of Indian history.

## Licence

The code and the atlas's own writing are released under the [MIT licence](LICENSE). Datasets and images keep their own licences (table above, and the About page at `#about`).
