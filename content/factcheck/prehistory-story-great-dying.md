# Story research log: great-dying ("The Great Dying and the recovery")

Story file: `content/prehistory/stories/great-dying.json`. Span 262 to 230 Ma, 12 chapters, oldest first.

## Chapters

| # | id | ma | place |
|---|----|----|-------|
| 1 | capitan-reef | 262 | El Capitan, Guadalupe Mountains, Texas |
| 2 | emeishan-crisis | 260 | Mount Emei, Sichuan, China |
| 3 | karoo-before-the-fall | 255 | Karoo Basin near Graaff-Reinet, South Africa |
| 4 | siberian-traps-erupt | 252.24 | Putorana Plateau, Siberia |
| 5 | meishan-boundary | 251.94 | Meishan, Zhejiang, China |
| 6 | forests-fall | 251.9 | Frazer Beach, Sydney Basin, Australia |
| 7 | hot-acid-breathless | 251.8 | Nanpanjiang Basin, south China |
| 8 | lystrosaurus-everywhere | 251.5 | Coalsack Bluff, Antarctica |
| 9 | slow-patchy-recovery | 248.9 | Paris Canyon, Idaho, USA |
| 10 | reptiles-return-to-sea | 248.4 | Majiashan quarry, Chaohu, Anhui, China |
| 11 | manda-dinosaur-cousins | 244 | Ruhuhu Basin, Tanzania |
| 12 | carnian-rains-dinosaurs-spread | 233 | Dolomites, Italy |

## What was included and why

- Opening at the Capitan Reef (Middle Permian, c. 265 to 260 Ma per NPS) sets the reef world that the brief asked for and fits the 262 Ma start of the span. The reef is described as built mainly by algae, microbes, sponges and bryozoans (NPS geologic formations and coral reefs pages); not by corals.
- The Capitanian crisis and Emeishan Traps (chapter 2) are dated "around 260 Ma". The Wikipedia Emeishan article gives a main eruptive phase of 262 to 261 Ma ending about 259 Ma; the Capitanian article cites Wu et al. 2026 putting the end-Guadalupian at 259.857 +/- 0.084 Ma. I used ma 260, dateLabel 262 to 259.
- Siberian Traps (chapter 4): ma 252.24 is the base of the Maymecha-Kotuy lavas (Burgess & Bowring 2015), about 300 kyr before the extinction. The existing event e:siberian-traps uses ma 252 with range 252.5 to 250.5, so this is consistent.
- Meishan (chapter 5): 251.941 +/- 0.037 to 251.880 +/- 0.031 Ma, 60 +/- 48 kyr (Burgess, Bowring & Shen 2014), matching e:end-permian-extinction (ma 251.94). Hindeodus parvus first appearance 251.902 Ma.
- Scale (chapter 6): 81% of marine species and 70% of land vertebrate species (Wikipedia, citing Stanley 2016 and Sahney & Benton 2008); "greatest known mass extinction of insects" and "may well be the only mass extinction to affect insect diversity significantly" (Wikipedia, citing Labandeira); no Early Triassic coal anywhere, with new peat-forming plants taking about 10 Myr (Wikipedia, citing Retallack 1996). Sydney Basin forest collapse: before 252.3 Ma, about 370 kyr before the marine extinction (Fielding et al. 2019 abstract).
- The chapter is anchored at ma 251.9 (the boundary) although the Sydney Basin collapse is older; the dateLabel says "c. 252.3 to 251.9 million years ago" and the text says the forests died "a few hundred thousand years before the extinction in the sea".
- Lystrosaurus (chapter 8): 95% figure, the Coalsack Bluff find by Colbert's team in 1969 to 1970, the distribution (South Africa, Antarctica, India, China, Russia) and the Antarctic tusk growth marks (Whitney & Sidor 2020) are all from the Wikipedia Lystrosaurus article.
- Recovery (chapter 9): Guiyang biota 250.83 to 250.72 Ma (Wikipedia; Science News on Dai et al. 2023), Paris biota earliest Spathian c. 249 Ma, Tirolites/Columbites beds 248.853 +/- 0.086 Ma (Wikipedia). Reefs: microbial reefs in the earliest Triassic, animal-built reefs back in the Olenekian, first scleractinian corals in the late Anisian (Wikipedia, Permian-Triassic extinction event, recovery section). Ten-million-year recovery estimate from the same article.
- Marine reptiles (chapter 10): Cartorhynchus bed dated 248.41 Ma, c. 40 cm long (Wikipedia); Chaohusaurus birth specimen c. 248 Ma, mother about 1 m (Motani et al. 2014, PLOS ONE); Spitsbergen tail vertebrae c. 250 Ma (NHM London news on Kear et al. 2023). Agrees with o:ichthyosaurs (fossilMa 250, Chaohu c. 248).
- Archosaurs and the Manda Beds (chapter 11): Ctenosauriscus c. 248 Ma reuses o:archosaurs. Asilisaurus 1 to 3 m (Wikipedia), Teleocrater oldest known bird-line archosaur (Wikipedia), Nyasasaurus possible earliest dinosaur (Nesbitt et al. 2013 via Wikipedia). Agrees with o:dinosaurs (claimMa 243).
- Carnian Pluvial Episode (chapter 12): 234 to 232 Ma, Dolomites footprint shares 0% / c. 40% / over 90% dinosaurs, Santa Maria 233.23 Ma, Ischigualasto 231.4 Ma (Bernardi et al. 2018). Agrees with e:carnian-pluvial-episode (ma 233) and e:ischigualasto (ma 231).

## Left out

- The Smithian-Spathian event is mentioned only in passing ("a further extinction about 249 million years ago"); no separate chapter, to keep within 12.
- The Middle Triassic reef return is folded into chapter 9 rather than given its own place (Dolomites or Great Bank of Guizhou), because a chapter there would have pushed the story past 12 chapters.
- The "fungal spike" and the ozone/UV and mercury hypotheses are mentioned only briefly in chapter 7 as possible extra stresses.
- The University of Washington news release on Penn et al. 2018 gives "96 percent of marine species"; this older figure was not used. The story uses 81% (Stanley 2016), as in the existing event.

## Disputed points (evidence set to "disputed")

1. Size of the Capitanian (end-Guadalupian) extinction (chapter 2). Large: Stanley & Yang 1994 (comparable to end-Cretaceous), Sepkoski 1996 (47% of marine genera), Stanley 2016 (33 to 35% of genera). Smaller: McGhee et al. 2013 (about 25%), Kaiho 2022 (18% of marine genera, mainly a land crisis). Clapham et al. 2016 see a gradual decline, not one event, and Lee et al. 2022 found no sudden extinction on Svalbard. Metcalfe et al. 2015 questioned whether it was global. Source: Wikipedia, Capitanian mass extinction event.
2. Kill mechanisms (chapter 7). Heat: Sun et al. 2012 (conodont oxygen isotopes, Nanpanjiang Basin) suggest sea surface about 40 C and tropical land 50 to 60 C (Leeds release via EurekAlert); the exact peak figures come from press coverage. Oxygen loss: Penn et al. 2018 model explains more than half of marine losses; Knoll & Bambach 2007 and Meyers 2008 (via Wikipedia) favour carbon dioxide poisoning or argue oxygen never fell very low. Acidification: Jurikova et al. 2020 find a pH drop at the onset; others (via Wikipedia) argue it was not global or not strong enough to stop shell-building, citing continued carbonate deposition in Guizhou and Yunnan.
3. Speed of the extinction is not marked disputed in chapter 5 (Burgess et al. give 60 +/- 48 kyr as a maximum), but the existing event e:end-permian-extinction marks the mechanisms as disputed and chapter 7 carries that.
4. Recovery speed (chapter 9). Dai et al. 2023 (Guiyang) argue a complete marine food web within about 1 Myr. Peter Roopnarine (California Academy of Sciences) thinks it may have been a short-lived assemblage; William Foster (Hamburg) suggests instead that the extinction did not wipe out whole trophic levels (Science News). Older estimates: about 10 Myr (Luoping biota) and about 3 Myr (Paris and Chaohu biotas).
5. Age of the Manda Beds (chapter 11). Conventionally Anisian (c. 247 to 242 Ma) by matching with the South African Cynognathus zone. Marsicano et al. 2015 and Ottone et al. 2014 (SHRIMP U-Pb dating of a similar fauna in Argentina, 233.8 to 237.8 Ma) suggest a Carnian age; Schneider et al. 2019 say SHRIMP is less accurate than CA-TIMS and Liu et al. 2018 support a late Anisian age for a related Chinese fauna (all via Wikipedia, Nyasasaurus). The Wikipedia Manda Formation page also cites a 2026 Dinodontosaurus study supporting a younger age; I did not open that paper.
6. Whether Nyasasaurus is a dinosaur (chapter 11): Nesbitt et al. 2013 (possibly), Baron et al. 2017 and Baron 2018 (dinosaur), Novas et al. 2021 (position uncertain). Text says "perhaps the earliest dinosaur of all".
7. CPE as driver of the dinosaurs' rise (chapter 12): Bernardi et al. 2018 link them; the Wikipedia CPE article notes some studies argue the CPE was not a major driver.
8. Ichthyosaur origin (chapter 10, evidence left as "fossil"): the Spitsbergen team (Kear et al. 2023; NHM quote from Aubrey Roberts) suggest ichthyosaurs evolved before the extinction; no pre-extinction fossils are known. The text says "their finders suggest".
9. Sydney Basin timing (chapter 6): Fielding et al. 2019 place the Glossopteris collapse before 252.3 Ma (about 370 kyr before the marine extinction; their introduction also gives about 410 kyr); McLoughlin et al. 2021 say a 252.10 +/- 0.06 Ma date at the Frazer Beach type section "is likely to be close to the age of the terrestrial EPE". The text avoids an exact gap ("a few hundred thousand years").

## Coordinates not verified on a page

- Chapter 7 focus and site "Nanpanjiang Basin sections" [106.5, 25.0]: an approximate centre for the basin in Guizhou/Guangxi. The sources name the basin but not the sections or their coordinates.
- Paris biota site [-111.4, 42.23]: coordinates of the town of Paris, Idaho (Wikipedia); the fossils are in Paris Canyon, west of the town.
- Majiashan quarry site [117.89, 31.62]: coordinates of Chaohu city (Wikipedia); the quarry is near the city.
- Spitsbergen site [16.0, 78.3]: reused from the existing o:ichthyosaurs entry; the exact position of Flower's Valley (Flowerdalen) was not found.
- Karoo sites [24.54, -32.25]: reused from e:karoo-fossil-beds (Graaff-Reinet).
- Ctenosauriscus site [9.9, 51.55], Santa Maria [-53.8, -29.7] and Ischigualasto [-67.9, -30.1]: reused from origins.json / events-b.json.
- Dolomites [11.85, 46.43]: Wikipedia coordinates for the range as a whole, not for a footprint site.
- Verified on pages: El Capitan (31.877, -104.858), Carlsbad Caverns (32.175, -104.444), Mount Emei (29.520, 103.333), Frazer Beach (33 11 37 S, 151 37 22 E, McLoughlin et al. 2021), Coalsack Bluff (-84.233, 162.417), Panchet Formation (23.6, 87.0, approximate on Wikipedia), Guiyang (26.647, 106.630), Manda Formation (10 18 S, 35 12 E), Chaohu (31.624, 117.890), Putorana [94.16, 69.05] reused from e:siberian-traps.

## Images

31 new images, 4 reused (permian-lakeshore-karoo, lystrosaurus-bogdanov, triassic-bulgo-sandstone-landscape, herrerasaurus-wierum). Each new image was viewed as a 500 px thumbnail in `data/prehistory/raw/story-great-dying/`. Thumbnail widths follow the standard-width rule (1920 / 1280 / 960 / original).

Licence and attribution doubts:
- marine-extinction-intensity-graph (Extinction intensity.svg): CC BY-SA 3.0 / GFDL, but the file page has no named author ("Files with no machine-readable author"); credited to the uploader Smith609 with the data source (Rohde and Muller 2005). The original SVG URL is used because the file is only 531 px wide.
- rubidgea-bogdanov: the Commons artist field contains broken markup around "Creator:Dmitry Bogdanov"; credited as Dmitry Bogdanov.
- putorana-plateau-cliffs: the Flickr description says only "Central Siberian Plateau"; the Putorana location comes from the file name.
- siberian-traps-native-iron: the caption's link between native iron and coal is the standard explanation for such rocks but is not stated on the file page.
- chaohusaurus-skeleton (718 px) and cartorhynchus-tamura (800 px) are small; original file URLs are used.
- URL check: all 31 new image URLs returned HTTP 200 (HEAD). The three original-file URLs (Extinction intensity.svg, Chaohusaurus.png, Cartorhynchus NT.jpg) first gave 429 (rate limit) and returned 200 on a later retry.
- Claraia photo credit is given as "Wolfgang Moroder" from the author line, which also asks for notification of use.
- Considered and rejected: Conodonts.jpg (public domain claimed but no author or source), two Merikanto temperature curves (own-work plots with no stated data source), Emeishan temple photos (not geology), Maternal Chaohusaurus (very narrow strip).
- No openly licensed photo of the Meishan section itself was found on Commons; chapter 5 uses a graph and a Permian brachiopod from Texas, and says so in the notes.

## Source check, 2026-11-22

Every chapter's cited pages were fetched again and each claim in title, dateLabel, text, species, site notes and evidenceNote was checked against them; chapter "ma" values all fall inside their dateLabels and none was changed.

### Corrections
- [siberian-traps-erupt] text: "and about 7 million square kilometres of basalt survive today." → "and their lavas still cover about 2.5 million square kilometres of Siberia, with more buried under younger rocks to the west." — the 7 million km² figure (Wikipedia, after Masaitis) is the inferred full extent of the province including buried and offshore rocks; the outcrop on the Siberian craton is about 2.5 million km², with basalt subcrops under the West Siberian Basin (Reichow et al. 2009 put the whole province at up to 5 million km²) — https://www.igm.nsc.ru/labs/lab212/~safonova/pdf/epsl-reichow2009.pdf
- [lystrosaurus-everywhere] text: "Lystrosaurus, a pig-sized dicynodont with a beak and two tusks." → "Lystrosaurus, a stocky dicynodont with a beak and two tusks, most kinds half a metre to a metre long." — the cited article gives L. murrayi about 50 cm and L. declivis just over 1 m; "pig-sized" overstated most species — https://en.wikipedia.org/wiki/Lystrosaurus
- [manda-dinosaur-cousins] text: "Ctenosauriscus lived in Germany about 248 million years ago" → "about 247 million years ago" — its latest Olenekian beds are dated 247.5 to 247.2 million years old — https://en.wikipedia.org/wiki/Ctenosauriscus
- [manda-dinosaur-cousins] site "Near Gottingen, Germany" ma: 248 → 247.4 — same reason (site pin date only; the chapter "ma" of 244 is unchanged) — https://en.wikipedia.org/wiki/Ctenosauriscus
- [carnian-rains-dinosaurs-spread] text: "about 40 percent dinosaur tracks during them, and over 90 percent soon after." → "about 40 percent dinosaur tracks near their end, and over 90 percent in the layers above." — Bernardi et al. give 40% for early Tuvalian ichnosites (the end of the episode) and over 90% for late Tuvalian to Norian sites, which span millions of years, not "soon after" — https://pmc.ncbi.nlm.nih.gov/articles/PMC5902586
- [carnian-rains-dinosaurs-spread] site note: "Dated trackways show dinosaurs appearing exactly when the rains began." → "Dated trackways show dinosaurs appearing during the rainy episode, not before it." — the paper shows dinosaurs absent from the pre-episode Julian formations and present in the Heiligkreuz-Travenanzes beds laid down during it; "exactly when the rains began" is more precise than the evidence — https://pmc.ncbi.nlm.nih.gov/articles/PMC5902586

### Sources added or replaced
- [capitan-reef] added Wikipedia: Guadalupian (https://en.wikipedia.org/wiki/Guadalupian): supports the evidenceNote's "world reference section for the Middle Permian" (the series is named after the Guadalupe Mountains and its base GSSP is at Stratotype Canyon there), which neither NPS page states.
- [karoo-before-the-fall] added Wikipedia: Inostrancevia (https://en.wikipedia.org/wiki/Inostrancevia): supports Inostrancevia in South Africa after Rubidgea, and its length of 3 to 3.5 m; the Gorgonopsia page gives the size but not the Karoo record.
- [siberian-traps-erupt] added Reichow et al. 2009 (university-hosted PDF of the EPSL paper) for the area figures.
- [manda-dinosaur-cousins] added Wikipedia: Ctenosauriscus for its age and find spot near Göttingen, which no cited page covered.
- No cited source was dead. Three are behind bot checks for scripted fetches but load normally: pmc.ncbi.nlm.nih.gov/articles/PMC4643808 (read through the Europe PMC full-text service instead), PMC3948271 (loaded on a second try) and the EurekAlert Leeds release (read with a browser-style fetch). They were kept.

### Softened or not fully confirmed
- [hot-acid-breathless] site note "About 15,000 conodonts from rocks here": the Leeds/EurekAlert release says 15,000 conodonts from two tonnes of rock "from South China", and the Sun et al. 2012 abstract (White Rose repository) names no basin. A search summary attributes the sections to the Nanpanjiang Basin, but I could not open a page that states it. Left unchanged.
- [karoo-before-the-fall] evidenceNote "dated by volcanic ash layers": the Beaufort Group page lists tuff among its rocks, and the Capitanian page cites U-Pb dating of a Karoo tuff; the Beaufort page itself does not discuss ash dating. Left unchanged.
- [siberian-traps-erupt] Burgess & Bowring 2015 find that the big sill pulse began with the extinction, not 300,000 years before it; the text does not date the sills, so it was left as is.
- [manda-dinosaur-cousins] evidenceNote "a younger, Late Triassic age": the Argentine SHRIMP date is 233.8 to 237.8 million years (mostly early Carnian), and the Manda Formation page says late Ladinian to early Carnian for South American Dinodontosaurus beds. "Late Triassic" is at the young end of that range but was kept, as the chapter is already marked disputed.
- Ctenosauriscus at about 247 million years is younger than the "c. 248" in o:archosaurs; that file was not edited (out of scope).

### Counts
- Chapters checked: 12
- Source pages fetched: 45 (the 38 cited pages plus Europe PMC full text of Burgess & Bowring 2015, Reichow et al. 2009, Wikipedia Guadalupian, Inostrancevia, Rubidgea and Ctenosauriscus, and the White Rose record of Sun et al. 2012); 5 more failed (Leeds news 404, a CUG page with DNS failure, ADS, Figshare and Durham repository 403)
- Corrections: 6 (5 text or note fixes, 1 site ma), plus 4 sources added
