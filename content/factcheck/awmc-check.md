# Ancient border cross-check against the Ancient World Mapping Center (AWMC)

Written by `tools/check_awmc.py` on 2026-11-13. Read-only: nothing in the atlas was changed.

The Ancient World Mapping Center at the University of North Carolina publishes the vector layers behind its maps, drawn from the *Barrington Atlas of the Greek and Roman World* (Princeton, 2000). Its `political_shading` folder has ten layers: four Roman extents and province sets, the senatorial provinces, and the empires of Persia, Alexander, the Hasmoneans and Herod. They are small-scale map shading, not a dated border database: none carries a date or a name, so the year each stands for is inferred below, and their edges follow natural lines (deserts, rivers) at map scale.

> Source: Ancient World Mapping Center, geodata (ODbL 1.0), https://github.com/AWMC/geodata. Licence: [Open Database License 1.0](https://opendatacommons.org/licenses/odbl/1-0/). Derived from the Barrington Atlas and AWMC edits to OpenStreetMap data. This report carries only figures derived from the layers; the clone is not in the repository.

## How it was compared

- Grid: 0.1° cells (cell centres, even-odd rule; about 100 km² a cell at 40°N), land only: both shapes are clipped to the base-map land polygons of the nearest era (`public/data/<year>.json`).
- Atlas: the border chunks in `public/data/clio/` with every correction in `content/corrections.json` and the reconstruction layers in `public/data/supplements.json`, read by `load_atlas()` in `tools/check_cshapes.py`. A realm counts in year Y if its first year ≤ Y ≤ its last year. Client kingdoms and allies are separate realms in the atlas and count as "another realm" here.
- Overlap = shared area ÷ (AWMC ∪ atlas). *AWMC covered* = the share of AWMC's area the atlas gives to the realm; *atlas inside* = the share of the atlas realm that lies inside AWMC's shape.
- Disagreements are merged into contiguous blocks (8-neighbour) and named from a gazetteer of ancient regions and provinces in the script (the points that fall inside a block, else "near" the closest). Blocks under 2,000 km² (or 2% of a small layer's area) are not listed. *Sliver* = a strip along a shared border with almost no interior cells: the two draw the same frontier a little apart, not a different territory.
- Dates: the overlap is recomputed for every year in ±50 years where the atlas changes the realm's shape, plus fixed offsets. If a nearby year fits much better, the disagreement is a date offset; if no year fits, a shape difference.

## Summary

| Layer | Year compared | AWMC km² | Atlas km² | Shared km² | Overlap | AWMC covered | Atlas inside | Best atlas year (overlap) |
|---|---|---|---|---|---|---|---|---|
| [Roman Republic, 60 BCE](#roman-empire-bce-60) | 60 BCE | 1,200,000 | 1,623,000 | 1,074,000 | 61% | 90% | 66% | 63 BCE–51 BCE (61%) |
| [Roman Empire, 117 CE](#roman-empire-ce-117-extent) | 117 CE | 4,736,000 | 5,127,000 | 4,245,000 | 76% | 90% | 83% | 118 CE–126 CE (80%) |
| [Roman Empire, 200 CE](#roman-empire-ce-200-extent) | 200 CE | 4,688,000 | 4,565,000 | 4,180,000 | 82% | 89% | 92% | 215 CE–237 CE (84%) |
| [Roman provinces, 200 CE](#roman-empire-ce-200-provinces) | 200 CE | 4,688,000 | 4,565,000 | 4,180,000 | 82% | 89% | 92% | 215 CE–237 CE (84%) |
| [Roman provinces after Diocletian, c. 314 CE](#post-diocletian) | 314 CE | 4,490,000 | 4,218,000 | 3,955,000 | 83% | 88% | 94% | 364 CE (84%) |
| [Senatorial provinces under Augustus (14 CE)](#senatorial-province) | 14 CE | 995,000 | 3,416,000 | 731,000 | — | 73% | — | — |
| [Alexander's empire, 323 BCE](#alexanders-empire) | 323 BCE | 4,971,000 | 4,667,000 | 4,179,000 | 77% | 84% | 90% | 326 BCE–324 BCE (83%) |
| [Achaemenid Persian Empire at its height (c. 500 BCE)](#persian-extent) | 500 BCE | 5,811,000 | 5,533,000 | 4,682,000 | 70% | 81% | 85% | 500 BCE–481 BCE (70%) |
| [Hasmonean kingdom at its height (Alexander Jannaeus, d. 76 BCE)](#hasmonean) | 78 BCE | 26,000 | 31,000 | 21,000 | 59% | 83% | 68% | 77 BCE–67 BCE (62%) |
| [Herod's kingdom at his death (4 BCE)](#herod) | 4 BCE | 23,000 | 39,000 | 20,000 | 47% | 87% | 51% | 19 BCE–4 BCE (47%) |

For the senatorial provinces (a part of the empire by design) only *AWMC covered* is meaningful.

## Hand-checked disagreements

The five largest distinct disagreements that are not border slivers, each checked by hand against a published source. Repeats are left out: the same Saharan band in 117, 200 and 314 is counted once per issue. Verdicts: *atlas error* means the atlas should change. *AWMC simplification* means AWMC's small-scale shading is the coarser of the two. *ambiguous* means sources differ, or the land was a client or tributary area that either convention fits. These are judgements from the cited pages, not edits: nothing in the atlas was changed.

| # | Layer, year | Block | km² | Verdict | Why | Source |
|---|---|---|---|---|---|---|
| 1 | Achaemenid Persian Empire at its height (c. 500 BCE) | AWMC only: Kashmir, Punjab (Taxila), Khotan (Tarim Basin, south) (+3) — atlas has nothing drawn | 663,000 | **AWMC simplification** | Mostly AWMC's: about 450,000 km² of the block lies east of 75°E, a tongue of shading across Kashmir into the Tarim Basin (Khotan) that no source gives to the Achaemenids. But about 170,000 km² between the Indus and the Jhelum (Hindush, with Taxila as its probable capital) is an atlas gap: the atlas's Achaemenid empire stops at the Indus, and Taxila is blank in 500 BCE. | [Achaemenid conquest of the Indus Valley](https://en.wikipedia.org/wiki/Achaemenid_conquest_of_the_Indus_Valley) |
| 2 | Roman provinces after Diocletian, c. 314 CE | Numidia | — | **atlas error** | From 261 to 429 the atlas draws nothing over inland Numidia and the Mauretanias: Cirta, Sitifis, Lambaesis, Thamugadi and Altava are blank, though Diocletian split off Mauretania Sitifensis in 293 and the provinces stayed Roman until the Vandals (430s). Constantine renamed Cirta in 313. Only southern Tingitana (Volubilis, given up c. 285) is right to leave out. Part of the block is AWMC's wide desert band, as in 200 CE. | [Mauretania Caesariensis](https://en.wikipedia.org/wiki/Mauretania_Caesariensis); [Numidia (Roman province)](https://en.wikipedia.org/wiki/Numidia_(Roman_province)) |
| 3 | Roman Empire, 117 CE | atlas only: Adiabene (Assyria), Babylonia, Armenia (+1) | 507,000 | **ambiguous** | Trajan's provinces of Armenia (114), Mesopotamia (116) and Assyria (116). The atlas draws them in 117 only and gives them up from 118; AWMC leaves them out. Both fit "117": they were held at Trajan's death and Hadrian evacuated them that same year. Babylonia (the Ctesiphon area) is the weakest part of the atlas's shape, since a Parthian client king was set up there in 116. | [Mesopotamia (Roman province)](https://en.wikipedia.org/wiki/Mesopotamia_(Roman_province)) |
| 4 | Achaemenid Persian Empire at its height (c. 500 BCE) | atlas only: Siwa oasis (Ammon), Western Desert oases, Marmarica (+1) | 409,000 | **AWMC simplification** | The atlas draws Persian Libya (Cyrenaica, Marmarica, the Western Desert oases). Cambyses' army took the Pentapolis in 525 BCE and the Persians kept a satrapy there for about two centuries. AWMC shades only the Nile valley. How much of the empty Libyan desert to colour is a matter of convention. | [Cyrenaica](https://en.wikipedia.org/wiki/Cyrenaica) |
| 5 | Roman Empire, 200 CE | AWMC only: Gaetulia (pre-Saharan Algeria) — atlas has nothing drawn | 153,000 | **atlas error** | In 200 the atlas puts the African frontier 1–2° north of AWMC's line (at 13.4°E, for example, 32.2°N against 30.2°N). The forts of Q. Anicius Faustus on the Limes Tripolitanus (197–201: Gheriat el-Garbia, Bu Njem/Golaia), Castellum Dimmidi and Hadrian's Gemellae all lie inside AWMC's shape and outside the atlas's. AWMC uses the same desert line in 117, before most of these forts were built, so it fits that year less well. | [Limes Tripolitanus](https://en.wikipedia.org/wiki/Limes_Tripolitanus) |

Fixed on 2026-11-13 in content/borders/patches.json: Roman North Africa 261-429 (roman-africa-261-429), the Severan Saharan frontier (severan-saharan-frontier), Persian Thrace (persian-thrace-skudra), Gallia Narbonensis (gallia-narbonensis-121bce) and Batanaea/Trachonitis (herod-batanaea-trachonitis); verdicts are kept as found.

### Further checks (smaller blocks)

| # | Layer, year | Block | km² | Verdict | Why | Source |
|---|---|---|---|---|---|---|
| 1 | Alexander's empire, 323 BCE | atlas only: Punjab (Lahore), Kashmir, Pamir and Badakhshan | 254,000 | **ambiguous** | After the Hydaspes (326 BCE), Alexander reinstated Porus as his satrap over lands "as far as the Hyphasis" (Beas). The atlas includes this land and AWMC does not. About 58,000 km² of the block lies in Kashmir and the Pamir, which is less defensible. | [Porus](https://en.wikipedia.org/wiki/Porus) |
| 2 | Achaemenid Persian Empire at its height (c. 500 BCE) | Thrace | — | **atlas error** | Thrace was the Persian satrapy of Skudra from 513 BCE, re-subjugated in 492 BCE, with Persian rule ending between 479 and c. 465 BCE. The atlas's own note says Thrace was lost after Plataea, yet it draws nothing Persian there before 479 either. | [Skudra](https://en.wikipedia.org/wiki/Skudra) |
| 3 | Roman Republic, 60 BCE | AWMC only: near Gallia Narbonensis — atlas has nothing drawn | 2,300 | **atlas error** | Gallia Transalpina became a province in 121 BCE (Narbo was founded in 118 BCE). The atlas draws its western part (Tolosa, Nemausus, Carcaso) as Roman only from 50 BCE. | [Gallia Narbonensis](https://en.wikipedia.org/wiki/Gallia_Narbonensis) |
| 4 | Herod's kingdom at his death (4 BCE) | Batanaea | — | **atlas error** | Augustus gave Herod Trachonitis, Batanaea and Auranitis in 23/22 BCE. They passed to Philip at Herod's death. The atlas's Judea keeps one shape from 91 BCE to 5 CE and leaves them Roman. | [Herod the Great](https://en.wikipedia.org/wiki/Herod_the_Great) |

## Roman Republic, 60 BCE

<a id="roman-empire-bce-60"></a>AWMC layer `roman_empire_bce_60`. Year compared: **60 BCE**, from the layer's name; the shape has Gallia Narbonensis but not Caesar's Gaul (58–50 BCE), and Pompey's eastern provinces (Syria, Pontus, 64–63 BCE).

- Atlas realms compared: Roman Republic, Roman Empire (drawn in 60 BCE as Roman Republic; the atlas's own area figure for that year is 1,686,000 km²).
- AWMC 1,200,000 km²; atlas 1,623,000 km² (land, inside -12°…44°E, 26°…51°N); shared 1,074,000 km².
- Overlap **61.4%**; AWMC covered 89.5%; atlas inside 66.2%.
- AWMC only: 126,000 km² (47,000 km² another realm, 79,000 km² blank). Atlas only: 549,000 km².
- What the atlas draws on AWMC's land instead: nothing drawn 79,000 km²; Galatia 14,000 km²; Kingdom of Numidia 11,000 km²; Kingdom of Cappadocia 10,000 km²; Judea 5,400 km².

| # | Side | Where | km² | Atlas has |
|---|---|---|---|---|
| 1 | atlas only | Lusitania, Celtiberia (Meseta), Hispania Tarraconensis | 201,000 | — |
| 2 | atlas only | Syrtica | 84,000 | — |
| 3 | atlas only | Palmyrene (Syrian desert), Damascene, Syria Phoenice (+5) | 82,000 | — |
| 4 | atlas only | Dalmatia | 62,000 | — |
| 5 | atlas only | near Thrace | 33,000 | — |
| 6 | atlas only | Phrygia | 22,000 | — |
| 7 | AWMC only | near Italia | 21,000 | nothing drawn |
| 8 | atlas only | Commagene | 20,000 | — |
| 9 | AWMC only | near Hispania Tarraconensis | 12,000 | nothing drawn |
| 10 | atlas only | Lycia | 11,000 | — |
| 11 | AWMC only | near Africa (Tunisia) | 11,000 | Kingdom of Numidia |
| 12 | AWMC only | Isauria | 10,000 | Kingdom of Cappadocia |
| 13 | AWMC only | near Isauria | 8,400 | Galatia |
| 14 | atlas only | near Paphlagonia | 6,000 | — |
| 15 | AWMC only | near Alpes Maritimae | 5,100 | nothing drawn |

4 smaller blocks not listed.

Border slivers (5, 14,000 km² in all): atlas only near Alpes Maritimae 3,300 km²; AWMC only near Thracia 3,200 km²; atlas only near Gallia Narbonensis 3,200 km²; AWMC only near Bithynia et Pontus 2,400 km²; AWMC only near Gallia Narbonensis 2,300 km².

Atlas a few years either side:

| Atlas years | Drawn as | Atlas km² | Overlap | AWMC covered | Atlas inside |
|---|---|---|---|---|---|
| 110 BCE – 92 BCE | Roman Republic | 1,219,000 | 56% | 72% | 71% |
| 91 BCE – 88 BCE | Roman Republic | 1,323,000 | 54% | 74% | 67% |
| 87 BCE – 78 BCE | Roman Republic | 1,207,000 | 50% | 67% | 67% |
| 77 BCE – 67 BCE | Roman Republic | 1,360,000 | 56% | 77% | 68% |
| 66 BCE – 64 BCE | Roman Republic | 1,570,000 | 56% | 82% | 63% |
| 63 BCE – 51 BCE ← | Roman Republic | 1,623,000 | 61% | 90% | 66% |
| 50 BCE | Roman Republic | 2,123,000 | 48% | 90% | 51% |
| 49 BCE | Roman Republic | 2,124,000 | 48% | 90% | 51% |
| 48 BCE – 47 BCE | Roman Republic | 2,125,000 | 48% | 90% | 51% |
| 46 BCE – 45 BCE | Roman Republic | 2,252,000 | 46% | 91% | 48% |
| 44 BCE – 43 BCE | Roman Republic | 2,253,000 | 46% | 91% | 48% |
| 42 BCE | Roman Republic | 2,252,000 | 46% | 91% | 48% |
| 41 BCE | Roman Republic | 2,253,000 | 46% | 91% | 48% |
| 40 BCE – 37 BCE | Roman Republic | 2,123,000 | 46% | 87% | 49% |
| 36 BCE – 32 BCE | Roman Republic | 2,253,000 | 46% | 91% | 48% |
| 31 BCE | Roman Empire | 1,635,000 | 30% | 54% | 40% |
| 30 BCE | Roman Empire | 2,324,000 | 45% | 91% | 47% |
| 29 BCE – 28 BCE | Roman Empire | 2,719,000 | 38% | 91% | 40% |
| 27 BCE – 26 BCE | Roman Empire | 2,810,000 | 37% | 91% | 39% |
| 25 BCE – 23 BCE | Roman Empire | 3,077,000 | 35% | 93% | 36% |
| 22 BCE – 20 BCE | Roman Empire | 3,070,000 | 35% | 93% | 36% |
| 19 BCE – 15 BCE | Roman Empire | 3,032,000 | 36% | 94% | 37% |
| 14 BCE – 10 BCE | Roman Empire | 3,220,000 | 35% | 95% | 35% |

The layer's own year fits as well as any nearby year (best 61% against 61%), so the differences are in the shape, not the date.

## Roman Empire, 117 CE

<a id="roman-empire-ce-117-extent"></a>AWMC layer `roman_empire_ce_117_extent`. Year compared: **117 CE**, from the layer's name: the empire at Trajan's death (August 117).

- Atlas realms compared: Roman Republic, Roman Empire (drawn in 117 CE as Roman Empire; the atlas's own area figure for that year is 5,263,000 km²).
- AWMC 4,736,000 km²; atlas 5,127,000 km² (land, inside -14°…49°E, 18°…60°N); shared 4,245,000 km².
- Overlap **75.6%**; AWMC covered 89.6%; atlas inside 82.8%.
- AWMC only: 491,000 km² (12,000 km² another realm, 479,000 km² blank). Atlas only: 882,000 km².
- What the atlas draws on AWMC's land instead: nothing drawn 479,000 km²; Kingdom of Kush 12,000 km².

| # | Side | Where | km² | Atlas has |
|---|---|---|---|---|
| 1 | atlas only | Adiabene (Assyria), Babylonia, Armenia (+1) | 507,000 | — |
| 2 | AWMC only | Tripolitania, Tripolitanian pre-desert (Gheriat, Bu Njem), Gaetulia (pre-Saharan Algeria) | 406,000 | nothing drawn |
| 3 | atlas only | Western Desert oases | 131,000 | — |
| 4 | atlas only | Wallachia | 93,000 | — |
| 5 | atlas only | near Hejaz (north-west Arabia) | 46,000 | — |
| 6 | atlas only | near Dacia | 28,000 | — |
| 7 | atlas only | near Upper Egypt (Thebaid) | 24,000 | — |
| 8 | atlas only | near Mauretania Tingitana | 19,000 | — |
| 9 | AWMC only | near Lower Nubia | 12,000 | Kingdom of Kush |
| 10 | AWMC only | near Agri Decumates | 5,600 | nothing drawn |

Border slivers (4, 15,000 km² in all): AWMC only near Auranitis (Hauran) 6,100 km²; atlas only near Moesia Superior 3,800 km²; AWMC only near Frisia 2,900 km²; atlas only near Nabataea (Petra) 2,000 km².

Atlas a few years either side:

| Atlas years | Drawn as | Atlas km² | Overlap | AWMC covered | Atlas inside |
|---|---|---|---|---|---|
| 67 CE | Roman Empire | 4,187,000 | 74% | 80% | 91% |
| 68 CE – 77 CE | Roman Empire | 4,091,000 | 76% | 80% | 93% |
| 78 CE – 83 CE | Roman Empire | 4,094,000 | 77% | 81% | 94% |
| 84 CE – 90 CE | Roman Empire | 4,161,000 | 78% | 82% | 93% |
| 91 CE – 105 CE | Roman Empire | 4,136,000 | 78% | 82% | 94% |
| 106 CE – 113 CE | Roman Empire | 4,452,000 | 79% | 85% | 91% |
| 114 CE – 116 CE | Roman Empire | 4,767,000 | 79% | 89% | 88% |
| 117 CE ← | Roman Empire | 5,127,000 | 76% | 90% | 83% |
| 118 CE – 126 CE | Roman Empire | 4,522,000 | 80% | 87% | 91% |
| 127 CE – 153 CE | Roman Empire | 4,425,000 | 80% | 86% | 92% |
| 154 CE – 160 CE | Roman Empire | 4,445,000 | 80% | 86% | 92% |
| 161 CE – 164 CE | Roman Empire | 4,363,000 | 79% | 85% | 92% |
| 165 CE – 167 CE | Roman Empire | 4,483,000 | 80% | 86% | 91% |

The atlas of 118 CE–126 CE fits better (80% against 76%): part of the difference is a date offset.

## Roman Empire, 200 CE

<a id="roman-empire-ce-200-extent"></a>AWMC layer `roman_empire_ce_200_extent`. Year compared: **200 CE**, from the layer's name: the empire under Septimius Severus, after his province of Mesopotamia (198).

- Atlas realms compared: Roman Republic, Roman Empire (drawn in 200 CE as Roman Empire; the atlas's own area figure for that year is 4,731,000 km²).
- AWMC 4,688,000 km²; atlas 4,565,000 km² (land, inside -14°…48°E, 18°…61°N); shared 4,180,000 km².
- Overlap **82.4%**; AWMC covered 89.2%; atlas inside 91.6%.
- AWMC only: 508,000 km² (102,000 km² another realm, 407,000 km² blank). Atlas only: 386,000 km².
- What the atlas draws on AWMC's land instead: nothing drawn 407,000 km²; Kingdom of Osroene 50,000 km²; Kingdom of Kush 12,000 km²; Parthian Empire 12,000 km²; Kingdom of Adiabene 11,000 km².

| # | Side | Where | km² | Atlas has |
|---|---|---|---|---|
| 1 | AWMC only | near Syrtica | 163,000 | nothing drawn |
| 2 | AWMC only | Gaetulia (pre-Saharan Algeria) | 153,000 | nothing drawn |
| 3 | atlas only | Western Desert oases | 131,000 | — |
| 4 | AWMC only | Osrhoene (Edessa), Osrhoene, Syria (Euphrates bend) (+1) | 50,000 | Kingdom of Osroene |
| 5 | atlas only | near Hejaz (north-west Arabia) | 46,000 | — |
| 6 | atlas only | near Wallachia | 36,000 | — |
| 7 | atlas only | near Dacia | 28,000 | — |
| 8 | atlas only | near Singara (Jebel Sinjar) | 27,000 | — |
| 9 | atlas only | near Upper Egypt (Thebaid) | 24,000 | — |
| 10 | atlas only | near Sophene (upper Tigris) | 23,000 | — |
| 11 | atlas only | near Mauretania Tingitana | 19,000 | — |
| 12 | AWMC only | southern Scotland (between the Walls) | 19,000 | nothing drawn |
| 13 | AWMC only | near Lower Nubia | 12,000 | Kingdom of Kush |
| 14 | AWMC only | Singara (Jebel Sinjar) | 12,000 | Parthian Empire |
| 15 | AWMC only | Mesopotamia | 11,000 | Kingdom of Adiabene |

4 smaller blocks not listed.

Border slivers (6, 32,000 km² in all): atlas only near Colchis (western Georgia) 12,000 km²; atlas only near Pontic steppe (Scythia) 6,100 km²; AWMC only near Auranitis (Hauran) 6,000 km²; atlas only near Moesia Superior 3,800 km²; AWMC only near Armenia Minor 2,800 km²; atlas only near Nabataea (Petra) 2,000 km².

Atlas a few years either side:

| Atlas years | Drawn as | Atlas km² | Overlap | AWMC covered | Atlas inside |
|---|---|---|---|---|---|
| 150 CE – 153 CE | Roman Empire | 4,425,000 | 81% | 87% | 92% |
| 154 CE – 160 CE | Roman Empire | 4,445,000 | 81% | 87% | 92% |
| 161 CE – 164 CE | Roman Empire | 4,363,000 | 80% | 86% | 92% |
| 165 CE – 183 CE | Roman Empire | 4,483,000 | 81% | 88% | 92% |
| 184 CE – 196 CE | Roman Empire | 4,451,000 | 81% | 87% | 92% |
| 197 CE | Roman Empire | 4,475,000 | 81% | 87% | 91% |
| 198 CE – 206 CE ← | Roman Empire | 4,565,000 | 82% | 89% | 92% |
| 207 CE – 214 CE | Roman Empire | 4,504,000 | 84% | 89% | 93% |
| 215 CE – 237 CE | Roman Empire | 4,535,000 | 84% | 90% | 93% |
| 238 CE – 240 CE | Roman Empire | 4,519,000 | 84% | 90% | 93% |
| 241 CE – 246 CE | Roman Empire | 4,507,000 | 84% | 90% | 93% |
| 247 CE – 250 CE | Roman Empire | 4,505,000 | 84% | 90% | 93% |

The layer's own year fits as well as any nearby year (best 84% against 82%), so the differences are in the shape, not the date.

## Roman provinces, 200 CE

<a id="roman-empire-ce-200-provinces"></a>AWMC layer `roman_empire_ce_200_provinces` (boundary lines; outline from `roman_empire_ce_200_extent.geojson`). Year compared: **200 CE**, from the layer's name; boundary lines only, filled here inside the 200 CE extent.

- Atlas realms compared: Roman Republic, Roman Empire (drawn in 200 CE as Roman Empire; the atlas's own area figure for that year is 4,731,000 km²).
- AWMC 4,688,000 km²; atlas 4,565,000 km² (land, inside -14°…48°E, 18°…61°N); shared 4,180,000 km².
- Overlap **82.4%**; AWMC covered 89.2%; atlas inside 91.6%.
- AWMC only: 508,000 km² (102,000 km² another realm, 407,000 km² blank). Atlas only: 386,000 km².
- What the atlas draws on AWMC's land instead: nothing drawn 407,000 km²; Kingdom of Osroene 50,000 km²; Kingdom of Kush 12,000 km²; Parthian Empire 12,000 km²; Kingdom of Adiabene 11,000 km².

| # | Side | Where | km² | Atlas has |
|---|---|---|---|---|
| 1 | AWMC only | near Syrtica | 163,000 | nothing drawn |
| 2 | AWMC only | Gaetulia (pre-Saharan Algeria) | 153,000 | nothing drawn |
| 3 | atlas only | Western Desert oases | 131,000 | — |
| 4 | AWMC only | Osrhoene (Edessa), Osrhoene, Syria (Euphrates bend) (+1) | 50,000 | Kingdom of Osroene |
| 5 | atlas only | near Hejaz (north-west Arabia) | 46,000 | — |
| 6 | atlas only | near Wallachia | 36,000 | — |
| 7 | atlas only | near Dacia | 28,000 | — |
| 8 | atlas only | near Singara (Jebel Sinjar) | 27,000 | — |
| 9 | atlas only | near Upper Egypt (Thebaid) | 24,000 | — |
| 10 | atlas only | near Sophene (upper Tigris) | 23,000 | — |
| 11 | atlas only | near Mauretania Tingitana | 19,000 | — |
| 12 | AWMC only | southern Scotland (between the Walls) | 19,000 | nothing drawn |
| 13 | AWMC only | near Lower Nubia | 12,000 | Kingdom of Kush |
| 14 | AWMC only | Singara (Jebel Sinjar) | 12,000 | Parthian Empire |
| 15 | AWMC only | Mesopotamia | 11,000 | Kingdom of Adiabene |

4 smaller blocks not listed.

Border slivers (6, 32,000 km² in all): atlas only near Colchis (western Georgia) 12,000 km²; atlas only near Pontic steppe (Scythia) 6,100 km²; AWMC only near Auranitis (Hauran) 6,000 km²; atlas only near Moesia Superior 3,800 km²; AWMC only near Armenia Minor 2,800 km²; atlas only near Nabataea (Petra) 2,000 km².

Atlas a few years either side:

| Atlas years | Drawn as | Atlas km² | Overlap | AWMC covered | Atlas inside |
|---|---|---|---|---|---|
| 150 CE – 153 CE | Roman Empire | 4,425,000 | 81% | 87% | 92% |
| 154 CE – 160 CE | Roman Empire | 4,445,000 | 81% | 87% | 92% |
| 161 CE – 164 CE | Roman Empire | 4,363,000 | 80% | 86% | 92% |
| 165 CE – 183 CE | Roman Empire | 4,483,000 | 81% | 88% | 92% |
| 184 CE – 196 CE | Roman Empire | 4,451,000 | 81% | 87% | 92% |
| 197 CE | Roman Empire | 4,475,000 | 81% | 87% | 91% |
| 198 CE – 206 CE ← | Roman Empire | 4,565,000 | 82% | 89% | 92% |
| 207 CE – 214 CE | Roman Empire | 4,504,000 | 84% | 89% | 93% |
| 215 CE – 237 CE | Roman Empire | 4,535,000 | 84% | 90% | 93% |
| 238 CE – 240 CE | Roman Empire | 4,519,000 | 84% | 90% | 93% |
| 241 CE – 246 CE | Roman Empire | 4,507,000 | 84% | 90% | 93% |
| 247 CE – 250 CE | Roman Empire | 4,505,000 | 84% | 90% | 93% |

The layer's own year fits as well as any nearby year (best 84% against 82%), so the differences are in the shape, not the date.

### Provinces (45 filled pieces)

Province shares the atlas draws as Roman in the layer's year, most land missing first. A name with "/" is two provinces the AWMC lines do not separate (an open boundary) or that the reference points place in one piece.

| # | Province | AWMC km² | Atlas Roman | Missing km² | Atlas has instead |
|---|---|---|---|---|---|
| 1 | Africa Proconsularis | 283,000 | 70% | 84,000 | nothing drawn 84,000 |
| 2 | Creta et Cyrenaica | 150,000 | 46% | 80,000 | nothing drawn 80,000 |
| 3 | Mauretania Caesariensis | 233,000 | 69% | 71,000 | nothing drawn 71,000 |
| 4 | Numidia | 122,000 | 58% | 51,000 | nothing drawn 51,000 |
| 5 | Aegyptus | 481,000 | 91% | 45,000 | nothing drawn 33,000; Kingdom of Kush 12,000 |
| 6 | Osrhoene | 51,000 | 18% | 42,000 | Kingdom of Osroene 42,000 |
| 7 | Mesopotamia | 58,000 | 29% | 41,000 | Parthian Empire 12,000; Kingdom of Adiabene 11,000; Kingdom of Gordyene 8,000 |
| 8 | Britannia | 159,000 | 88% | 19,000 | nothing drawn 19,000 |
| 9 | Arabia Petraea | 109,000 | 95% | 5,000 | nothing drawn 5,000 |
| 10 | Italia | 131,000 | 96% | 4,900 | nothing drawn 4,900 |
| 11 | Sicilia | 50,000 | 90% | 4,800 | nothing drawn 4,800 |
| 12 | Germania Superior | 100,000 | 95% | 4,500 | nothing drawn 4,500 |
| 13 | Mauretania Tingitana | 51,000 | 91% | 4,400 | nothing drawn 4,400 |
| 14 | Syria Coele | 87,000 | 95% | 4,300 | Kingdom of Osroene 3,500; nothing drawn 800 |
| 15 | Thracia / Bithynia et Pontus | 158,000 | 97% | 4,000 | nothing drawn 4,000 |
| 16 | Achaea | 52,000 | 92% | 3,900 | nothing drawn 3,900 |
| 17 | Hispania Tarraconensis | 379,000 | 99% | 3,800 | nothing drawn 3,800 |
| 18 | Asia | 130,000 | 97% | 3,600 | nothing drawn 3,600 |
| 19 | Germania Inferior | 44,000 | 92% | 3,600 | nothing drawn 3,600 |
| 20 | Galatia / Cappadocia | 264,000 | 99% | 3,400 | Kingdom of Armenia 2,800; nothing drawn 700 |
| 21 | Syria Phoenice | 40,000 | 92% | 3,200 | nothing drawn 3,200 |
| 22 | Cilicia | 36,000 | 91% | 3,100 | nothing drawn 3,100 |
| 23 | Gallia Narbonensis | 90,000 | 97% | 2,600 | nothing drawn 2,600 |
| 24 | Noricum | 122,000 | 98% | 2,500 | nothing drawn 2,500 |
| 25 | Dalmatia | 83,000 | 98% | 1,400 | nothing drawn 1,400 |
| 26 | Lycia et Pamphylia | 38,000 | 96% | 1,400 | nothing drawn 1,400 |
| 27 | Epirus | 13,000 | 90% | 1,200 | nothing drawn 1,200 |
| 28 | Raetia | 53,000 | 98% | 1,200 | nothing drawn 1,200 |
| 29 | Moesia Inferior | 54,000 | 98% | 1,200 | nothing drawn 1,200 |
| 30 | Macedonia | 70,000 | 98% | 1,100 | nothing drawn 1,100 |

15 provinces are fully or almost fully drawn as Roman (under 1,000 km² missing each).

## Roman provinces after Diocletian, c. 314 CE

<a id="post-diocletian"></a>AWMC layer `roman_empire_provinces post_diocletian` (boundary lines; outline from `roman_empire_diocletian_and_Constantine_314_extent.shp`). Year compared: **314 CE**, from boundary lines only; AWMC ships them with an extent named "Diocletian and Constantine 314" (in the shapefile archive), which is used as the outline here, so the year compared is 314.

- Atlas realms compared: Roman Republic, Roman Empire (drawn in 314 CE as Roman Empire; the atlas's own area figure for that year is 4,347,000 km²).
- AWMC 4,490,000 km²; atlas 4,218,000 km² (land, inside -14°…46°E, 18°…60°N); shared 3,955,000 km².
- Overlap **83.2%**; AWMC covered 88.1%; atlas inside 93.8%.
- AWMC only: 534,000 km² (20,000 km² another realm, 514,000 km² blank). Atlas only: 263,000 km².
- What the atlas draws on AWMC's land instead: nothing drawn 514,000 km²; Kingdom of Kush 12,000 km²; Ripuarian Franks 3,400 km²; Kingdom of Armenia 2,800 km².

| # | Side | Where | km² | Atlas has |
|---|---|---|---|---|
| 1 | AWMC only | Tripolitania, Tripolitanian pre-desert (Gheriat, Bu Njem), Gaetulia (pre-Saharan Algeria) (+2) | 439,000 | nothing drawn |
| 2 | atlas only | Western Desert oases | 131,000 | — |
| 3 | atlas only | near Upper Egypt (Thebaid) | 24,000 | — |
| 4 | atlas only | near Sophene (upper Tigris) | 23,000 | — |
| 5 | atlas only | near Mesopotamia | 21,000 | — |
| 6 | atlas only | Mesopotamia (Nisibis, Khabur) | 19,000 | — |
| 7 | AWMC only | near Lower Nubia | 12,000 | Kingdom of Kush |
| 8 | AWMC only | near Hejaz (north-west Arabia) | 9,800 | nothing drawn |

Border slivers (9, 30,000 km² in all): AWMC only near Auranitis (Hauran) 6,100 km²; atlas only near Lazica (Trabzon coast) 5,700 km²; atlas only near Mauretania Tingitana 3,400 km²; AWMC only near Armenia Minor 2,800 km²; AWMC only near Frisia 2,600 km²; atlas only near Agri Decumates 2,600 km²….

Atlas a few years either side:

| Atlas years | Drawn as | Atlas km² | Overlap | AWMC covered | Atlas inside |
|---|---|---|---|---|---|
| 264 CE – 269 CE | Roman Empire | 2,639,000 | 52% | 54% | 93% |
| 270 CE – 271 CE | Roman Empire | 2,601,000 | 55% | 56% | 97% |
| 272 CE – 274 CE | Roman Empire | 3,513,000 | 69% | 73% | 93% |
| 275 CE – 282 CE | Roman Empire | 4,194,000 | 83% | 88% | 94% |
| 283 CE | Roman Empire | 4,253,000 | 82% | 88% | 93% |
| 284 CE – 286 CE | Roman Empire | 4,221,000 | 83% | 88% | 94% |
| 287 CE – 298 CE | Roman Empire | 4,224,000 | 83% | 88% | 94% |
| 299 CE – 305 CE | Roman Empire | 4,220,000 | 83% | 88% | 94% |
| 306 CE – 307 CE | Roman Empire | 4,215,000 | 83% | 88% | 94% |
| 308 CE – 310 CE | Roman Empire | 4,216,000 | 83% | 88% | 94% |
| 311 CE – 312 CE | Roman Empire | 4,217,000 | 83% | 88% | 94% |
| 313 CE – 323 CE ← | Roman Empire | 4,218,000 | 83% | 88% | 94% |
| 324 CE – 336 CE | Roman Empire | 4,218,000 | 83% | 88% | 94% |
| 337 CE | Roman Empire | 4,212,000 | 83% | 88% | 94% |
| 338 CE – 346 CE | Roman Empire | 4,211,000 | 83% | 88% | 94% |
| 347 CE – 352 CE | Roman Empire | 4,212,000 | 83% | 88% | 94% |
| 353 CE – 357 CE | Roman Empire | 4,215,000 | 83% | 88% | 94% |
| 358 CE – 363 CE | Roman Empire | 4,207,000 | 83% | 88% | 94% |
| 364 CE | Roman Empire | 4,176,000 | 84% | 88% | 94% |

The layer's own year fits as well as any nearby year (best 84% against 83%), so the differences are in the shape, not the date.

### Provinces (87 filled pieces)

Province shares the atlas draws as Roman in the layer's year, most land missing first. A name with "/" is two provinces the AWMC lines do not separate (an open boundary) or that the reference points place in one piece.

| # | Province | AWMC km² | Atlas Roman | Missing km² | Atlas has instead |
|---|---|---|---|---|---|
| 1 | Tripolitania | 215,000 | 26% | 160,000 | nothing drawn 160,000 |
| 2 | Libya Superior | 230,000 | 54% | 106,000 | nothing drawn 106,000 |
| 3 | Mauretania Caesariensis | 183,000 | 63% | 68,000 | nothing drawn 68,000 |
| 4 | Mauretania Sitifensis | 116,000 | 42% | 67,000 | nothing drawn 67,000 |
| 5 | Mauretania Tingitana | 51,000 | 34% | 34,000 | nothing drawn 34,000 |
| 6 | Thebais | 160,000 | 92% | 12,000 | Kingdom of Kush 12,000; nothing drawn 100 |
| 7 | Arabia Nova (Petra) / Palaestina | 104,000 | 90% | 10,000 | nothing drawn 10,000 |
| 8 | Byzacena | 47,000 | 86% | 6,700 | nothing drawn 6,700 |
| 9 | Arabia | 24,000 | 80% | 5,000 | nothing drawn 5,000 |
| 10 | Lucania et Bruttii / Sicilia | 49,000 | 90% | 4,800 | nothing drawn 4,800 |
| 11 | Germania Secunda | 45,000 | 91% | 4,000 | Ripuarian Franks 2,800; nothing drawn 1,200 |
| 12 | Thessalia / Achaea | 52,000 | 92% | 4,000 | nothing drawn 4,000 |
| 13 | Creta | 8,500 | 64% | 3,000 | nothing drawn 3,000 |
| 14 | Libya Inferior | 110,000 | 97% | 2,900 | nothing drawn 2,900 |
| 15 | Phoenice | 36,000 | 92% | 2,900 | nothing drawn 2,900 |
| 16 | Tarraconensis | 134,000 | 98% | 2,300 | nothing drawn 2,300 |
| 17 | Apulia et Calabria | 27,000 | 92% | 2,300 | nothing drawn 2,300 |
| 18 | Alpes Graiae et Poeninae / Viennensis / Narbonensis Prima / Alpes Maritimae | 87,000 | 98% | 2,100 | nothing drawn 2,100 |
| 19 | Bithynia / Europa | 63,000 | 97% | 2,100 | nothing drawn 2,100 |
| 20 | Caria | 16,000 | 88% | 2,000 | nothing drawn 2,000 |
| 21 | Germania Prima | 15,000 | 88% | 1,800 | nothing drawn 1,300; Ripuarian Franks 600 |
| 22 | Mesopotamia / Cappadocia / Armenia Minor | 143,000 | 99% | 1,800 | Kingdom of Armenia 1,800 |
| 23 | Isauria | 25,000 | 93% | 1,700 | nothing drawn 1,700 |
| 24 | Pontus Polemoniacus | 35,000 | 95% | 1,600 | Kingdom of Armenia 900; nothing drawn 700 |
| 25 | Cilicia | 30,000 | 95% | 1,600 | nothing drawn 1,600 |
| 26 | Venetia et Histria | 52,000 | 97% | 1,600 | nothing drawn 1,600 |
| 27 | Carthaginiensis | 170,000 | 99% | 1,500 | nothing drawn 1,500 |
| 28 | Africa Proconsularis (Zeugitana) | 58,000 | 98% | 1,400 | nothing drawn 1,400 |
| 29 | Lycia et Pamphylia | 24,000 | 95% | 1,300 | nothing drawn 1,300 |
| 30 | Asia | 14,000 | 91% | 1,300 | nothing drawn 1,300 |
| 31 | Flaminia et Picenum / Samnium / Valeria (Italia) | 30,000 | 96% | 1,100 | nothing drawn 1,100 |
| 32 | Dalmatia | 75,000 | 99% | 1,100 | nothing drawn 1,100 |
| 33 | Scythia | 15,000 | 93% | 1,100 | nothing drawn 600; Gothia 400 |
| 34 | Epirus Vetus | 13,000 | 92% | 1,000 | nothing drawn 1,000 |
| 35 | Rhodope | 19,000 | 95% | 1,000 | nothing drawn 1,000 |

50 provinces are fully or almost fully drawn as Roman (under 1,000 km² missing each).

## Senatorial provinces under Augustus (14 CE)

<a id="senatorial-province"></a>AWMC layer `senatorial_province`. Year compared: **14 CE**, from the provinces governed by proconsuls for the senate after 27 BCE; the shape has Cyprus and Narbonensis (senatorial from 22 BCE) and not Illyricum (imperial from 11 BCE), so it fits the end of Augustus' reign.

- Atlas realms compared: Roman Republic, Roman Empire (drawn in 14 CE as Roman Empire; the atlas's own area figure for that year is 3,513,000 km²).
- AWMC 995,000 km²; atlas 3,416,000 km² (land, inside -12°…42°E, 23°…52°N); shared 731,000 km².
- AWMC covered: **73.4%**. Of the 264,000 km² the atlas does not show as Roman, 1,600 km² is another realm and 263,000 km² is blank.
- What the atlas draws on AWMC's land instead: nothing drawn 263,000 km².

| # | Side | Where | km² | Atlas has |
|---|---|---|---|---|
| 1 | AWMC only | Tripolitanian pre-desert (Gheriat, Bu Njem), Tripolitania | 235,000 | nothing drawn |

Border slivers (1, 2,300 km² in all): AWMC only near Caria 2,300 km².

## Alexander's empire, 323 BCE

<a id="alexanders-empire"></a>AWMC layer `alexanders_empire`. Year compared: **323 BCE**, from the empire at Alexander's death (June 323 BCE): Macedonia and Thrace to the Indus.

- Atlas realm compared: Macedonian Empire (drawn in 323 BCE as Macedonian Empire; the atlas's own area figure for that year is 4,701,000 km²).
- AWMC 4,971,000 km²; atlas 4,667,000 km² (land, inside 14°…79°E, 18°…50°N); shared 4,179,000 km².
- Overlap **76.6%**; AWMC covered 84.1%; atlas inside 89.5%.
- AWMC only: 792,000 km² (473,000 km² another realm, 318,000 km² blank). Atlas only: 488,000 km².
- What the atlas draws on AWMC's land instead: nothing drawn 318,000 km²; Kingdom of Lysimachus 141,000 km²; Perdiccas (member of (Macedonian Empire)) 114,000 km²; Laomedon (member of (Macedonian Empire)) 103,000 km²; Kingdom of Armenia 82,000 km².

| # | Side | Where | km² | Atlas has |
|---|---|---|---|---|
| 1 | atlas only | Punjab (Lahore), Kashmir, Pamir and Badakhshan | 254,000 | — |
| 2 | AWMC only | Thrace, Moesia (Danube plain), Scythia Minor (Dobruja) | 141,000 | Kingdom of Lysimachus |
| 3 | AWMC only | Mesene (Characene), Babylonia | 114,000 | Perdiccas (member of (Macedonian Empire)) |
| 4 | AWMC only | Ituraea (Beqaa), Damascene, Batanaea and Trachonitis (+9) | 103,000 | Laomedon (member of (Macedonian Empire)) |
| 5 | AWMC only | Paphlagonia | 94,000 | nothing drawn |
| 6 | atlas only | Western Desert oases | 90,000 | — |
| 7 | AWMC only | Sophene (upper Tigris) | 82,000 | Kingdom of Armenia |
| 8 | AWMC only | near Sogdiana (Samarkand) | 71,000 | nothing drawn |
| 9 | AWMC only | Ustrushana and Ferghana | 62,000 | nothing drawn |
| 10 | atlas only | near Karakum desert | 46,000 | — |
| 11 | atlas only | Eastern Desert of Egypt | 42,000 | — |
| 12 | AWMC only | near Siwa oasis (Ammon) | 24,000 | nothing drawn |
| 13 | AWMC only | near Babylonia | 23,000 | nothing drawn |
| 14 | AWMC only | near Hyrcania (Gorgan) | 15,000 | nothing drawn |
| 15 | atlas only | near Sindh (lower Indus) | 13,000 | — |

5 smaller blocks not listed.

Border slivers (6, 24,000 km² in all): atlas only near Media Atropatene (Azerbaijan, Iran) 8,200 km²; atlas only near Palmyrene (Syrian desert) 4,100 km²; AWMC only near Batanaea and Trachonitis 3,500 km²; atlas only near Negev 3,100 km²; atlas only near Illyria (Albania) 2,500 km²; AWMC only near Sindh (lower Indus) 2,100 km².

Atlas a few years either side:

| Atlas years | Drawn as | Atlas km² | Overlap | AWMC covered | Atlas inside |
|---|---|---|---|---|---|
| 373 BCE – 367 BCE | Macedonian Empire | 29,000 | 1% | 1% | 99% |
| 366 BCE – 351 BCE | Macedonian Empire | 28,000 | 1% | 1% | 100% |
| 350 BCE – 338 BCE | Macedonian Empire | 56,000 | 1% | 1% | 80% |
| 337 BCE – 334 BCE | Macedonian Empire | 216,000 | 4% | 4% | 91% |
| 333 BCE – 332 BCE | Macedonian Empire | 580,000 | 11% | 11% | 96% |
| 331 BCE | Macedonian Empire | 1,421,000 | 24% | 25% | 87% |
| 330 BCE – 327 BCE | Macedonian Empire | 4,912,000 | 73% | 84% | 85% |
| 326 BCE – 324 BCE | Macedonian Empire | 5,011,000 | 83% | 91% | 90% |
| 323 BCE – 319 BCE ← | Macedonian Empire | 4,667,000 | 77% | 84% | 90% |
| 318 BCE – 316 BCE | Macedonian Empire | 4,771,000 | 78% | 86% | 90% |
| 315 BCE – 308 BCE | Macedonian Empire | 4,612,000 | 76% | 83% | 90% |
| 307 BCE – 302 BCE | Macedonian Empire | 1,516,000 | 24% | 25% | 83% |
| 301 BCE – 292 BCE | Macedonian Empire | 139,000 | 1% | 1% | 53% |
| 273 BCE | not drawn | — | — | — | — |

The atlas of 326 BCE–324 BCE fits better (83% against 77%): part of the difference is a date offset.

## Achaemenid Persian Empire at its height (c. 500 BCE)

<a id="persian-extent"></a>AWMC layer `persian_extent`. Year compared: **500 BCE**, from the layer gives only "extent"; it has Thrace, Egypt and the Indus, i.e. Darius I between the Scythian campaign (c. 513 BCE) and the loss of Thrace after 479 BCE, so 500 BCE is compared.

- Atlas realm compared: Achaemenid Empire (drawn in 500 BCE as Achaemenid Empire; the atlas's own area figure for that year is 5,636,000 km²).
- AWMC 5,811,000 km²; atlas 5,533,000 km² (land, inside 12°…92°E, 15°…50°N); shared 4,682,000 km².
- Overlap **70.3%**; AWMC covered 80.6%; atlas inside 84.6%.
- AWMC only: 1,129,000 km² (184,000 km² another realm, 945,000 km² blank). Atlas only: 851,000 km².
- What the atlas draws on AWMC's land instead: nothing drawn 945,000 km²; Zhangzhung 85,000 km²; Kingdom of Kush 47,000 km²; Macedonian Empire 28,000 km²; Greek City-States 25,000 km².

| # | Side | Where | km² | Atlas has |
|---|---|---|---|---|
| 1 | AWMC only | Kashmir, Punjab (Taxila), Khotan (Tarim Basin, south) (+3) | 663,000 | nothing drawn |
| 2 | atlas only | Siwa oasis (Ammon), Western Desert oases, Marmarica (+1) | 409,000 | — |
| 3 | atlas only | Kyzylkum desert, Sogdiana (Samarkand) | 214,000 | — |
| 4 | AWMC only | Caucasian Albania (Azerbaijan), Iberia (eastern Georgia), Colchis (western Georgia) | 126,000 | nothing drawn |
| 5 | AWMC only | Moesia (Danube plain), Illyria (Albania), Epirus | 99,000 | nothing drawn |
| 6 | AWMC only | near Kashmir | 85,000 | Zhangzhung |
| 7 | atlas only | Negev, Nabataea (Petra), Sinai (+2) | 80,000 | — |
| 8 | atlas only | near Hyrcania (Gorgan) | 64,000 | — |
| 9 | atlas only | Eastern Desert of Egypt | 62,000 | — |
| 10 | AWMC only | Lower Nubia | 47,000 | Kingdom of Kush |
| 11 | AWMC only | Macedonia | 28,000 | Macedonian Empire |
| 12 | AWMC only | near Babylonia | 24,000 | nothing drawn |
| 13 | atlas only | near Sindh (lower Indus) | 5,100 | — |
| 14 | AWMC only | near Chorasmia (Khwarazm) | 4,200 | nothing drawn |
| 15 | AWMC only | near Scythia Minor (Dobruja) | 3,500 | nothing drawn |

Border slivers (6, 32,000 km² in all): AWMC only Scythia Minor (Dobruja) 7,400 km²; AWMC only Lazica (Trabzon coast) 7,200 km²; atlas only near Palmyrene (Syrian desert) 6,200 km²; AWMC only near Macedonia 5,000 km²; AWMC only near Batanaea and Trachonitis 3,500 km²; AWMC only near Illyria (Albania) 2,900 km².

Atlas a few years either side:

| Atlas years | Drawn as | Atlas km² | Overlap | AWMC covered | Atlas inside |
|---|---|---|---|---|---|
| 550 BCE – 541 BCE | Achaemenid Empire | 3,310,000 | 50% | 52% | 91% |
| 540 BCE – 539 BCE | Achaemenid Empire | 3,682,000 | 56% | 58% | 92% |
| 538 BCE – 531 BCE | Achaemenid Empire | 4,244,000 | 63% | 67% | 92% |
| 530 BCE – 514 BCE | Achaemenid Empire | 4,240,000 | 63% | 67% | 92% |
| 513 BCE – 501 BCE | Achaemenid Empire | 4,284,000 | 64% | 68% | 92% |
| 500 BCE – 481 BCE ← | Achaemenid Empire | 5,533,000 | 70% | 81% | 85% |
| 480 BCE – 479 BCE | Achaemenid Empire | 5,515,000 | 70% | 80% | 85% |
| 478 BCE – 451 BCE | Achaemenid Empire | 5,489,000 | 70% | 80% | 84% |
| 450 BCE | Achaemenid Empire | 5,470,000 | 69% | 79% | 84% |

The layer's own year fits as well as any nearby year (best 70% against 70%), so the differences are in the shape, not the date.

## Hasmonean kingdom at its height (Alexander Jannaeus, d. 76 BCE)

<a id="hasmonean"></a>AWMC layer `hasmonean`. Year compared: **78 BCE**, from the kingdom's largest extent, reached under Alexander Jannaeus (103–76 BCE); 78 BCE is the last year of the atlas's -91…-78 shape before his death.

- Atlas realm compared: Judea (drawn in 78 BCE as Judea; the atlas's own area figure for that year is 32,000 km²).
- AWMC 26,000 km²; atlas 31,000 km² (land, inside 29°…41°E, 26°…38°N); shared 21,000 km².
- Overlap **59.4%**; AWMC covered 82.9%; atlas inside 67.7%.
- AWMC only: 4,400 km² (1,300 km² another realm, 3,100 km² blank). Atlas only: 10,000 km².
- What the atlas draws on AWMC's land instead: nothing drawn 3,100 km²; Nabataeans 1,300 km².

| # | Side | Where | km² | Atlas has |
|---|---|---|---|---|
| 1 | atlas only | Negev, Nabataea (Petra) | 9,300 | — |

Border slivers (1, 2,400 km² in all): AWMC only Galilee 2,400 km².

Atlas a few years either side:

| Atlas years | Drawn as | Atlas km² | Overlap | AWMC covered | Atlas inside |
|---|---|---|---|---|---|
| 128 BCE – 127 BCE | Judea | 5,900 | 21% | 22% | 95% |
| 126 BCE – 111 BCE | Judea | 15,000 | 52% | 54% | 94% |
| 110 BCE – 92 BCE | Judea | 16,000 | 55% | 57% | 95% |
| 91 BCE – 78 BCE ← | Judea | 31,000 | 59% | 83% | 68% |
| 77 BCE – 67 BCE | Judea | 32,000 | 62% | 86% | 68% |
| 66 BCE – 50 BCE | Judea | 31,000 | 59% | 83% | 68% |
| 49 BCE – 41 BCE | Judea | 31,000 | 59% | 83% | 68% |
| 40 BCE – 37 BCE | Judea | 32,000 | 59% | 83% | 67% |
| 36 BCE – 28 BCE | Judea | 31,000 | 59% | 83% | 68% |

The layer's own year fits as well as any nearby year (best 62% against 59%), so the differences are in the shape, not the date.

## Herod's kingdom at his death (4 BCE)

<a id="herod"></a>AWMC layer `herod`. Year compared: **4 BCE**, from Herod's kingdom after Augustus added Trachonitis, Batanea, Auranitis (23 BCE) and Gaulanitis/Panias (20 BCE); it was divided at his death in 4 BCE.

- Atlas realm compared: Judea (drawn in 4 BCE as Judea; the atlas's own area figure for that year is 39,000 km²).
- AWMC 23,000 km²; atlas 39,000 km² (land, inside 29°…42°E, 26°…38°N); shared 20,000 km².
- Overlap **47.3%**; AWMC covered 86.9%; atlas inside 50.9%.
- AWMC only: 3,000 km² (2,800 km² another realm, 200 km² blank). Atlas only: 19,000 km².
- What the atlas draws on AWMC's land instead: Roman Empire 2,800 km².

| # | Side | Where | km² | Atlas has |
|---|---|---|---|---|
| 1 | atlas only | Negev, Nabataea (Petra), Moab | 14,000 | — |

Border slivers (4, 7,900 km² in all): atlas only near Batanaea and Trachonitis 4,700 km²; AWMC only Galilee 2,200 km²; atlas only near Damascene 500 km²; AWMC only near Gaulanitis (Golan) 500 km².

Atlas a few years either side:

| Atlas years | Drawn as | Atlas km² | Overlap | AWMC covered | Atlas inside |
|---|---|---|---|---|---|
| 54 BCE – 50 BCE | Judea | 31,000 | 42% | 69% | 51% |
| 49 BCE – 41 BCE | Judea | 31,000 | 42% | 70% | 51% |
| 40 BCE – 37 BCE | Judea | 32,000 | 41% | 69% | 51% |
| 36 BCE – 28 BCE | Judea | 31,000 | 42% | 70% | 51% |
| 27 BCE – 26 BCE | Judea | 32,000 | 41% | 69% | 51% |
| 25 BCE – 23 BCE | Judea | 32,000 | 41% | 69% | 50% |
| 22 BCE – 20 BCE | Judea | 40,000 | 47% | 87% | 51% |
| 19 BCE – 4 BCE ← | Judea | 39,000 | 47% | 87% | 51% |
| 3 BCE – 5 CE | Judea | 32,000 | 41% | 69% | 51% |
| 6 CE – 46 CE | not drawn | — | — | — | — |

The layer's own year fits as well as any nearby year (best 47% against 47%), so the differences are in the shape, not the date.

## Limits

- AWMC's layers are small-scale shading for printed and web maps, with no dates or attributes; the years compared are inferred from layer names and contents (see each section).
- The 0.1° grid misses islands and strips narrower than a few cells; blocks under the listed threshold are dropped, and border slivers are reported apart.
- Land is the atlas's own base map of the nearest era, so coastline differences between the two datasets drop out.
- Province names come from capitals placed by hand in the script; where AWMC's lines leave a gap, two provinces share one piece.
- The atlas draws client kingdoms (Armenia, Nabataea, Thrace, Mauretania, Judaea …) as their own realms. AWMC sometimes shades them as Roman and sometimes not; these show up here as disagreements that are conventions.
