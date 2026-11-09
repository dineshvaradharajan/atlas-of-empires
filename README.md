# Atlas of Empires

An interactive world map from **3400 BCE to 2024 CE**. Drag the timeline to any year and see who ruled
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
python3 -I tools/content.py      # content/eras + content/empires -> public/data/content.json, links to Cliopatria
python3 -I tools/commons.py      # Wikimedia Commons reference maps -> public/data/commons.json
```

Raw sources live in `data/` (`data/geo/` holds historical-basemaps, `data/clio/` holds Cliopatria).

## Sources and licences

| What | Source | Licence |
|---|---|---|
| State borders | [Cliopatria](https://github.com/Seshat-Global-History-Databank/cliopatria), Seshat Global History Databank. Paper: *Scientific Data* (2025), [doi:10.1038/s41597-025-04516-9](https://doi.org/10.1038/s41597-025-04516-9). Geometry simplified for the web. | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |
| Peoples & other polities layer | [historical-basemaps](https://github.com/aourednik/historical-basemaps), A. Ourednik | GPL-3.0 |
| Reference maps | [Wikimedia Commons](https://commons.wikimedia.org/). Each image is credited with its author and licence in the app. | Per file (CC BY-SA, CC BY, PD, …) |
| Narrative text | Written for this project. Structure follows the 12 regional rows of the SenseForMaps decade-by-decade timeline. | — |

All historical borders are scholarly approximations. Polities that existed but are absent from both
datasets can't be drawn. Please report errors to Cliopatria directly so that every user of the dataset benefits.
