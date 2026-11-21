# Prehistory page: brief

> **Superseded in part (2026-11-21).** The page was built map-first, not as chapters: a globe of the ancient Earth with a
> timeline, per-unit panels, events and a life timeline, at `public/earth-history/` ("Earth history"; the main atlas is "World history"). The data files it uses are described in
> `tools/prehistory.py`; map accuracy is in `content/factcheck/prehistory-mapdata.md`. The human-origins part below
> (species, sites, routes, firsts) is not built yet and this brief still applies to it.

The atlas map starts at **10,000 BCE** ("Before the first states"). This page tells the story **before** that, in two
parts, and ends with a button that opens the map at 10,000 BCE:
1. **Deep time:** the Earth forms (c. 4.54 billion years ago), life begins and changes, continents drift, the
   dinosaurs rise and fall, and mammals and then primates take over.
2. **Human origins:** the first upright apes (c. 7 million years ago) to the end of the Ice Age (c. 12,000 years ago).
Deep time is the prologue the human story grows out of, so give it fewer, broader chapters: the world as a whole, not
regions.

**Form:** a story page at `#prehistory` (and `#prehistory/<chapter-id>`), built like the war storyboards
(content/WAR_STORYBOARD.md): a sequence of chapters, each framing one part of the world, with its own geography, ice,
sites, species and routes. The reader steps through chapters or plays them in turn. No realms, borders or time slider:
the timeline is the chapter list, shown on a **logarithmic "years ago" scale** so 4.5 billion years don't swamp the last
100,000 (each part gets about half the scale; mark the eons and the start of the human part on it).

## Dates
- Everything before 12,000 years ago is in **years ago** (`ya`, a positive integer counted back from 1950, the
  radiocarbon convention). On screen: "c. 4.54 billion years ago", "c. 3.2 million years ago", "c. 45,000 years ago".
  Never BCE here.
- Deep-time dates and period names follow the International Chronostratigraphic Chart (ICS, the latest version);
  say "c." and round to what the evidence supports (e.g. "c. 66 million years ago", not "66.04").
- Use mainstream dates with "c." and give ranges where the dating method gives one (say which: radiocarbon,
  luminescence, uranium-series, argon-argon, palaeomagnetism). For dates older than about 50,000 years, radiocarbon
  cannot be used; say what was.
- 12,000 ya ≈ 10,000 BCE, where the map takes over.

## Evidence labels (required on every event, species, site, route and first)
The same idea as content/ANCIENT.md: `geology` (dated rocks, minerals, isotopes or meteorites: most of deep time),
`fossil` (dated fossils of plants and animals), `archaeology` (human fossils, tools or remains, dated), `genetic`
(worked out from DNA, e.g. most of what we know about Denisovans, or when two lineages split), `disputed` (real
evidence, but dating or meaning is contested; say what is disputed and who argues what). `evidenceNote` is one plain
sentence a 14-year-old understands.

Deep-time claims that must be `disputed`, with both sides cited: the earliest signs of life (Isua, Nuvvuagittuq,
Jack Hills carbon); how the Moon formed (the giant-impact idea is mainstream, its details are not); how far "Snowball
Earth" froze; the cause of the end-Permian extinction's speed; the role of the Deccan Traps alongside the Chicxulub
impact; the earliest animals (Ediacaran fossils, sponge biomarkers).

Claims that change every few years and must be `disputed` with dated sources (check for newer work before writing):
the Madjedbebe date for people in Australia; the White Sands footprints and other pre-16,000 ya American sites; burial
and engraving by *Homo naledi*; Neanderthal cave art; the early *H. sapiens* skulls outside Africa (Misliya, Apidima);
the effect of the Toba eruption; what killed the megafauna; where *H. floresiensis* and *H. luzonensis* came from;
the Sulawesi and Indonesian cave-art dates.

## Chapters (the story)
**Part 1: deep time** (the whole globe in each chapter; `where` is what to centre on)
| id | span (ya) | where | what it shows |
|---|---|---|---|
| `earth-forms` | 4.57B–4.0B | the whole planet | the Sun and planets form; the Earth forms; the Moon-forming impact; the first oceans; the oldest minerals (Jack Hills zircons) |
| `first-life` | 4.0B–2.5B | the first continents | the oldest rocks; the first signs of life; stromatolites; cyanobacteria start making oxygen |
| `oxygen` | 2.5B–720M | the supercontinents | the Great Oxidation Event; cells with a nucleus; the first many-celled life; Columbia and Rodinia |
| `snowball` | 720M–539M | Rodinia breaking up | the Snowball Earth glaciations; the Ediacaran creatures |
| `cambrian` | 539M–420M | the southern continents | the Cambrian explosion of animal life (Burgess Shale, Chengjiang); the first fish; plants reach land |
| `life-on-land` | 420M–252M | Pangaea forming | forests, insects, the first four-legged animals (Tiktaalik), reptiles; the coal forests; the end-Permian extinction |
| `dinosaurs` | 252M–66M | Pangaea breaking up | dinosaurs, the first mammals and birds, flowering plants; the Atlantic opens |
| `asteroid` | 66M–55M | Chicxulub, Mexico | the impact and extinction; mammals take over the empty world |
| `primates` | 55M–7M | Africa and Asia | early primates, monkeys, apes; India hits Asia and the Himalayas rise; Antarctica freezes; Africa dries |

**Part 2: human origins**
| id | span (ya) | where | what it shows |
|---|---|---|---|
| `upright-apes` | 7M–4M | Central and East Africa | the split from chimpanzees; Sahelanthropus, Orrorin, Ardipithecus |
| `lucy` | 4M–2.6M | East Africa | Australopithecus, Laetoli footprints, the first stone tools (Lomekwi) |
| `first-humans` | 2.8M–1.8M | East and South Africa | the genus *Homo*, Oldowan tools, *H. habilis*, *H. erectus* |
| `first-exodus` | 1.9M–700k | Africa to Java and China | Dmanisi, Java, Zhoukoudian; hand-axes; fire |
| `many-humans` | 700k–300k | Old World | *H. heidelbergensis*, early Neanderthals, Denisovans, *H. naledi*, *H. floresiensis*, *H. luzonensis* |
| `our-species` | 300k–100k | Africa (and early exits) | Jebel Irhoud, Omo Kibish, Florisbad; Misliya, Skhul and Qafzeh |
| `symbols` | 100k–60k | Southern Africa | Blombos ochre and beads, Pinnacle Point; the Toba eruption |
| `great-dispersal` | 70k–45k | Africa to Asia and Sahul | the main spread of *H. sapiens*; the sea crossing to Sahul; mixing with Neanderthals and Denisovans |
| `last-neanderthals` | 45k–39k | Europe and western Asia | modern humans arrive (Bacho Kiro, Grotte Mandrin); the Neanderthals disappear |
| `ice-age-artists` | 51k–20k | Europe and Indonesia | Sulawesi cave art, Chauvet, Hohle Fels, the Lion-man, Dolní Věstonice, Sungir; needles and flutes |
| `coldest-time` | 26k–19k | the whole world | the Last Glacial Maximum: ice sheets, sea about 120 m lower, Beringia, Doggerland, Sundaland, Sahul, refuges |
| `americas` | 25k–13k | Beringia to Patagonia | the routes south; White Sands, Paisley Caves, Monte Verde, Clovis |
| `thaw` | 19k–12k | the whole world | warming and the Younger Dryas, the first dogs and pottery, megafauna extinctions, the Natufians; then "Open the map at 10,000 BCE" |

Chapter text: 3–5 plain sentences for a 14+ reader, every claim matched by a species, site, route or first shown in
that chapter, never something from another chapter's place.

## Files (all in `content/prehistory/`)
`chapters.json`: the table above, as data.
```json
{"id": "lucy", "title": "Lucy's world", "from": 4000000, "to": 2600000, "bbox": [w, s, e, n],
 "seaYa": 3200000, "species": ["australopithecus-afarensis"], "sites": ["laetoli", "hadar", "lomekwi-3"],
 "routes": [], "firsts": ["first-stone-tools"], "text": "..."}
```
`seaYa` picks which sea level and ice to draw (see "Map" below); null shows today's coast with a note. Deep-time
chapters use `paleoMa` instead (the age in millions of years of the continent reconstruction to draw) and `events` in
place of `species`, `sites`, `routes` and `firsts`.

`events.json`: 40–60 deep-time events and fossil finds, oldest first, for part 1.
```json
{"id": "chicxulub-impact", "title": "The Chicxulub impact", "ya": 66000000, "dateLabel": "c. 66 million years ago",
 "kind": "planet | rock | life | climate | extinction | continents | fossil", "lonlat": [-89.5, 21.4],
 "evidence": "geology", "evidenceNote": "...", "text": "40–80 words", "image": {}, "sources": [...]}
```
`lonlat` is where the evidence is found **today** (the crater, the rock, the fossil bed); the page moves it onto the
ancient map (see "Map"). null for planet-wide events. Include the famous fossils readers ask about (Burgess Shale,
Archaeopteryx, Tiktaalik, Sue the T. rex) and the five mass extinctions. Human fossils belong to part 2.

`species.json`: 15–25 hominin species, for the family tree and the chapters.
```json
{"id": "homo-erectus", "name": "Homo erectus", "common": "upright human", "from": 1900000, "to": 110000,
 "dateLabel": "c. 1.9 million to 110,000 years ago", "evidence": "archaeology", "evidenceNote": "...",
 "ancestor": "homo-habilis", "ancestorDisputed": true,
 "fossils": [{"name": "Turkana Boy", "site": "nariokotome", "ya": 1500000, "lonlat": [36.08, 4.13]}],
 "brainCc": [550, 1250], "summary": "50–90 words: who they were, where they lived, what they could do",
 "image": {}, "sources": [{"title": "...", "url": "..."}]}
```
`ancestor` draws the tree; set `ancestorDisputed: true` wherever scholars disagree (most links are disputed: draw them
dashed). `brainCc` only where measured. `fossils` are the famous finds (2–6), each tied to a site in `sites.json`.

`sites.json`: 50–80 sites, oldest first. Same fields as content/ANCIENT.md sites, with `ya` and `untilYa` in place of
`built` and `until`, `species` (ids found there) in place of `culture`, and kinds `fossil | footprints | tools | cave |
camp | rock-art | burial | other`.

`routes.json`: dispersals drawn as arrows, 10–20.
```json
{"id": "sapiens-to-sahul", "species": "homo-sapiens", "from": 70000, "to": 50000, "evidence": "disputed",
 "evidenceNote": "...", "path": [[lon, lat, ya], ...], "summary": "1–2 sentences", "sources": [...]}
```
`path` points are dated by the oldest site on the way (name it in the summary); follow the coast of the time, not
today's. Draw what the evidence supports, as broad corridors, not single lines through unknown ground.

`firsts.json`: 25–40 firsts in technology, art and belief (stone tools, fire, hand-axes, burial, ochre, beads, cave
art, figurines, flutes, needles, spear-throwers, bows, boats, dogs, pottery, grinding plants), each tied to a site.
```json
{"id": "first-pottery", "title": "Pottery", "ya": 20000, "site": "xianrendong", "evidence": "archaeology",
 "evidenceNote": "...", "text": "1–2 sentences", "sources": [...]}
```
"First" means the oldest known evidence. Say so ("the oldest known"), never "invented here".

## Map
- **Deep time: the continents move.** Today's map is wrong before a few million years ago, so part 1 draws
  reconstructed continents and coasts from a published plate model, one map per chapter (`paleoMa`), with the model,
  version and licence credited on the page. Candidates: the plate models used with GPlates (e.g. Merdith et al.
  2021, covering 1 billion years ago to today) and the PALEOMAP PaleoDEMs (Scotese & Wright 2018). Check each licence before using it; prefer CC BY. Use the same model to move each event's `lonlat`
  to where that spot was at the time. Nothing older than about 1 billion years can be mapped reliably: the earlier
  chapters show the whole planet as an illustration (molten, then ocean world, then small first continents), clearly
  marked "artist's impression", not a map.
- **Sea level and ice.** The map already draws the coast from a sea-level curve (`content/iceage/iceage.json`, Lambeck
  et al. 2014) on seabed down to 130 m (`public/data/shelf.png`), and ice-sheet outlines from DATED-1 and NADI-1, both
  only from 10,000 BCE. Extend both:
  - sea level back to 35,000 ya from the same Lambeck curve, and older from the Spratt & Lisiecki (2016) sea-level
    stack (0–798,000 ya, *Climate of the Past*), with the source on every point;
  - ice outlines back to 26,000 ya (NADI-1) and 40,000 ya (DATED-1), the slices those datasets publish.
  - Before 40,000 ya (or where a chapter spans many ice-age cycles) there are no ice outlines; draw today's coast and
    say "coastlines rose and fell many times in this period".
- **Species ranges** are not drawn as filled areas: we know find-spots, not ranges. Show fossil sites as points, coloured by species.
- **Nothing from the states map** (realms, borders, peoples layer) appears on this page.

## Sources
Read content/FACTCHECK.md (fetch what you cite; never invent URLs). For deep time prefer the ICS chart
(stratigraphy.org), the USGS, the Smithsonian National Museum of Natural History (Deep Time hall), the Natural History
Museum (London), the UC Museum of Paleontology (ucmp.berkeley.edu) and peer-reviewed papers. For human origins prefer
the Smithsonian Human Origins pages (humanorigins.si.edu), the Australian Museum, the Natural History Museum (London), university and museum pages, and
peer-reviewed papers (Nature, Science, PNAS, Journal of Human Evolution); cited Wikipedia statements are fine. For a
disputed claim, cite both the paper that made it and the main reply. Images: openly licensed only, as in content/ANCIENT.md.

## Research split
Each part writes only its own entries and logs to `content/factcheck/prehistory-<part>.md` (what was included, left out
and why, and every disputed case with the positions on each side).
1. `deep-time`: events.json and chapter text for `earth-forms` to `primates`.
2. `paleomaps`: choose the plate model, export one reconstruction per deep-time chapter and the code to move
   present-day points onto it (data and `tools/` changes only).
3. `species`: species.json (the whole tree).
4. `africa`: sites, firsts and chapter text for `upright-apes` to `symbols`.
5. `eurasia-sahul`: sites, routes, firsts and text for `first-exodus` (outside Africa), `great-dispersal`,
   `last-neanderthals`, `ice-age-artists`.
6. `americas-ice`: sites, routes, firsts and text for `coldest-time`, `americas`, `thaw`.
7. `iceage-data`: the sea-level and ice-sheet extension above (data and `tools/` changes only).

Validate: JSON parses; ids unique and kebab-case; every id referenced in chapters, events, species, routes and firsts exists;
lon/lat plausible; `ya` values decrease through each list and sit inside the chapter spans.
