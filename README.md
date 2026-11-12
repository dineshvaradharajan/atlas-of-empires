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
python3 -I tools/build_clio.py   # Cliopatria -> public/data/clio/<chunk>.json + index.json (state borders)
python3 -I tools/build_patches.py <ne_10m_admin_0_countries.geojson> # content/borders/patches.json: sourced fixes to rows before 1992
python3 -I tools/build_modern.py <ne_10m_admin_0_countries.geojson>  # Natural Earth -> clio/1992.json (borders from 1992 to today)
python3 -I tools/placeindex.py   # border chunks -> public/data/place/ ("this place through time")
python3 -I tools/content.py      # content/eras + content/empires -> public/data/content.json, links to Cliopatria
python3 -I tools/commons.py      # Wikimedia Commons reference maps -> public/data/commons.json
python3 -I tools/seo.py          # plain HTML pages, sitemaps and llms.txt for search engines (deploy.sh runs it; not committed)
```

Raw sources live in `data/` (`data/geo/` holds historical-basemaps, `data/clio/` holds Cliopatria). Natural Earth files
come from the `geojson/` folder of [natural-earth-vector](https://github.com/nvkelso/natural-earth-vector) and are passed
by path. Run the three border steps in this order: `build_clio.py` rewrites the files the other two edit, and
`build_patches.py` refuses to run twice. `PRESENT` in `build_modern.py` is the map's last year.

## Sources and licences

| What | Source | Licence |
|---|---|---|
| State borders | [Cliopatria](https://github.com/Seshat-Global-History-Databank/cliopatria), Seshat Global History Databank. Paper: *Scientific Data* (2025), [doi:10.1038/s41597-025-04516-9](https://doi.org/10.1038/s41597-025-04516-9). Geometry simplified for the web. | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |
| Borders from 1992 to today; island and micro states before 1992 | [Natural Earth](https://www.naturalearthdata.com/) 1:10m countries, in its default view of disputed places, with the border changes since 1992 dated by hand. Geometry simplified for the web. | Public domain |
| Peoples & other polities layer | [historical-basemaps](https://github.com/aourednik/historical-basemaps), A. Ourednik | GPL-3.0 |
| Reference maps | [Wikimedia Commons](https://commons.wikimedia.org/). Each image is credited with its author and licence in the app. | Per file (CC BY-SA, CC BY, PD, …) |
| Narrative text | Written for this project. Structure follows the 12 regional rows of the SenseForMaps decade-by-decade timeline. | MIT |
| Rivers, lakes, sea names, disputed areas | [Natural Earth](https://www.naturalearthdata.com/) 1:50m and 1:10m | Public domain |
| Terrain shading, ice-age coastline | [NOAA ETOPO5](https://www.ngdc.noaa.gov/mgg/global/relief/ETOPO5/TOPO/ETOPO5/) | Public domain |
| Ice-age sea level | Lambeck et al. 2014, *PNAS* 111:15296, [doi:10.1073/pnas.1411762111](https://doi.org/10.1073/pnas.1411762111) | (cited; values digitised) |
| Ice sheets | NADI-1, Dalton et al. 2023 ([Zenodo](https://zenodo.org/records/8161764)); DATED-1, Hughes et al. 2016 ([PANGAEA](https://doi.pangaea.de/10.1594/PANGAEA.848117)) | CC BY 4.0 / CC BY 3.0 |
| Empire pictures, ruler portraits, period photos | Wikimedia Commons, Library of Congress, US National Archives, UN Archives, Internet Archive; each credited in the app | Per item |
| Libraries and fonts | D3.js, earcut (ISC); Archivo, Inter (SIL OFL) | as stated |

All historical borders are scholarly approximations. Polities that existed but are absent from both
datasets can't be drawn. Please report errors to Cliopatria directly so that every user of the dataset benefits.

## Inspiration

The idea for this atlas came from [Bharat Rajya](https://www.bharatrajya.com/), an interactive map of the kingdoms of Indian history.

## Licence

The code and the atlas's own writing are released under the [MIT licence](LICENSE). Datasets and images keep their own licences (table above, and the About page at `#about`).
