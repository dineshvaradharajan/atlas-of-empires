# Earth history: acritarchs, Grypania and "the forces that shaped the Earth"

Date: 2026-11-22. Files written: `content/prehistory/events-a.json` (1 event improved, 3 added),
`content/prehistory/forces.json` (new, 8 forces). Build checked with `python3 -I tools/prehistory.py` (107 events, OK).
Every claim below was checked on a page that was opened. The URLs are in the `sources` arrays.

## Part 1: events

### Changed: `first-eukaryotes` ("The first cells with a nucleus", 1650 Ma, Changcheng Group, North China)
The oldest acritarchs are the oldest accepted eukaryote fossils, and this event already covered them (Changcheng Group, c. 1.65 Ga).
A separate "oldest acritarchs" event would have repeated it, so I rewrote its text instead:
- The text now says what acritarchs are: organic-walled microfossils whose makers can't be identified, mostly about 0.02 to 0.1 mm across
  (Miao et al. 2019 assemblage 22–108 µm, as reported; Roper *Satka* 24–100 µm). It also says ornamented ones from the
  Changcheng Group and northern Australia are about 1.65 Ga old (Knoll et al. 2006: Changcheng between 1780±20 and 1683±67 Ma,
  *Valeria* in the Mallapunyah Formation c. 1650 Ma; Miao et al. 2024: *Dictyosphaera*, *Valeria* etc. in the Changzhougou and lowermost
  Chuanlinggou formations; Riedman et al. 2023 Limbunya Group c. 1.64 Ga, via ScienceDaily, not cited).
- It adds a "Disputed" sentence on the older claims (see below).
- The Grypania sentence moved to the new `grypania` event. Sources: dropped "Wikipedia: Paleoproterozoic", "Rasmussen 2008" and "Wikipedia: Grypania"
  (now on the new event). Added Wikipedia: Acritarch, Knoll et al. 2006, Miao et al. 2024, Bengtson et al. 2017 and the NIGPAS page on Yin et al. 2020.
- Kept ma 1650, maRange [1800, 1600], dateLabel, lonlat and place. They agree with the Paleoproterozoic period text ("eukaryotes appear as fossils by about 1.65 billion years ago").

### Added: `grypania` ("Grypania: coiled ribbons in Michigan", 1870 Ma, disputed)
Place: Empire Mine, near Palmer, Michigan, USA, [-87.61, 46.46]. The coordinates are the Empire Mine's, as listed by Mineral Resource Map.
The mine works the Negaunee Iron Formation. Kind `life`, like `bangiomorpha`.
- Han & Runnegar (1992, *Science*) described hundreds of coiled carbonaceous fossils here as *Grypania spiralis* and dated them to 2.1 Ga.
  Wikipedia: Grypania says the age was revised to c. 1,870 Ma (citing Schneider et al. 2002). The 1992 paper details came from the
  search-result citation and Wikipedia; the PubMed page would not open (cookie wall), so the paper itself is not cited.
- Younger, segmented Grypania: Knoll et al. 2006 (Helena Formation, Montana, c. 1450 Ma; Chinese Mesoproterozoic populations);
  Miao et al. 2024 (Grypania from India, coiled, with evidence of multicellularity).
- Why it is worth an event of its own: the page already has a picture of Grypania (`grypania-fossils` in images-more.json), and Grypania was
  mentioned only in passing in `first-eukaryotes` and in the eukaryotes group of origins.json. It is also the oldest
  claimed eukaryote that can be seen without a microscope.
- Date check: the Paleoproterozoic period text does not mention Grypania. The image note says "about 1.9 to 1.4 billion years", which is consistent.
  origins.json (eukaryotes) says "the coiled Grypania (1.87 billion)", which is also consistent.
- Not used: Knoll et al. 2006 also mention c. 1850 Ma Grypania-like populations in Canada. I didn't find a second source, so it is left out.

### Added: `roper-group-microfossils` ("The Roper Group: a sea of early complex cells", 1450 Ma, range 1500–1400, fossil)
Place: Roper River area, Northern Territory, Australia, [134.53, -14.74]. These are Roper Bar's coordinates (Wikipedia: Roper Bar).
The fossils come from drill cores (Amoco 82-3, Golden Grove 1, Urapunga 4–6), and I couldn't find coordinates for the cores. Roper Bar stands for the
Roper River area the group is named after; the true spot may be tens of km away. The date is older than 540 Ma, so the
plate model does not move the point and nothing needs fetching for positions.json.
- Javaux & Knoll 2017 (*J. Paleontology*): more than 1000 m of Roper Group rocks, deposited c. 1500–1400 Ma (U-Pb zircon age 1492±4 Ma, Mainoru Fm; Re-Os
  1417±29 and 1361±21 Ma, Velkerri Fm). 34 taxa, 5 unambiguous eukaryotes (*Dictyosphaera*, *Satka*, *Valeria*, *Tappania*, *Lineaforma*). Diversity was
  highest in coastal, well-oxygenated shallow-shelf settings. They note that Butterfield read *Tappania* as a possible fungus.
- Javaux, Knoll & Walter 2001 (*Nature*): the cytoskeletal and ecological groundwork for eukaryote diversification was in place c. 1.5 Ga.
  The "growing cell" reading of *Tappania*'s irregular processes comes from the search-result summary of this paper. The ORBi abstract I opened
  confirms the paper's main claim, not that detail; Javaux & Knoll 2017 confirm *Tappania* as an acanthomorphic acritarch.
- Lechte et al. 2026 (*Nature*, "Early fossil eukaryotes were benthic aerobes"), via Sci.News (the Nature page itself redirects to a login):
  microfossils from the McArthur and Birrindudu basins, c. 1.75–1.4 Ga, lived in near-shore, oxygenated settings on the sea floor.
- Recent work (last 5 years) checked: Lechte et al. 2026; Riedman et al. 2023; Miao et al. 2024; Yin et al. 2020.

### Added: `wengan-biota` ("Weng'an: spiny cysts and 'embryos'", 590 Ma, range 609–570, disputed)
Place: Weng'an County, Guizhou, China, [107.47, 27.08]. These are the county seat's coordinates (Wikipedia: Weng'an County). The fossil sections
(e.g. Beidoushan) lie in the same county, but I couldn't find their exact coordinates. Older than 540 Ma, so it is not moved by the plate model.
- Cunningham et al. 2017 (*J. Geol. Soc.*, open access, opened as the Bristol PDF): the biota is c. 570–609 Myr old. The Doushantuo Formation is 551–635 Ma. Acritarchs
  identical to those containing embryo-like fossils occur just above a 632.5±0.5 Ma ash in the Yangtze Gorges. Weng'an acritarchs belong to the
  Doushantuo–Pertatataka microbiota.
- Large spiny (acanthomorphic) acritarchs: Knoll et al. 2006 say early Ediacaran acritarch assemblages were the first dominated by forms with
  symmetrically arranged processes. Wikipedia: Doushantuo Formation (*Tianzhushania*, Zhou et al. 2001 giant acritarchs).
- Date check: the Ediacaran period (635–538.8 Ma) does not mention Weng'an. The 609–570 range and the c. 632 Ma remark fall inside it.

### Kind values used
`life` (Grypania) and `fossil-site` (Roper, Weng'an), both existing kinds.

## Part 2: forces.json
There are 8 forces, in the requested order. Following the coordinator's correction, refs use only `e:`, `o:` and `s:` (no `m:`).
Each ref was checked against events-a/b, origins.json and stories/*.json, and each example uses its item's own `ma`.
For stories I used the story's `from` (land 470, humans 7). One ref is null: "Farming begins", 0.0117 Ma, backed by
Wikipedia: Neolithic Revolution ("starting about 11,700 years ago").
I did not reference `s:mammals`: it does not exist yet, so its ma and title could not be checked.

Numbers used, and where they come from:
- Volcanism: Siberian Traps about 4 million km³ and about 7 million km² (Wikipedia: Siberian Traps). The CO2 thermostat comes from Wikipedia:
  Carbonate–silicate cycle; volcanic CO2 ending Snowball Earth from Wikipedia: Snowball Earth; lava floods matched to extinctions from Wikipedia: Large igneous province.
- Water: ocean covers c. 70.8% of the surface; oceans probably formed in the Hadean (Wikipedia: Ocean). Mediterranean refilled within "several months to
  two years" (Wikipedia: Zanclean flood). Note: that page gives two different peak-flow figures (1000 times and 450 times the Amazon). The forces text
  avoids the figure; the existing `zanclean-flood` event uses "about a thousand times".
- Oxygen: the air is c. 21% oxygen. The GOE fits the event dates 2.46–2.06 Ga. There were later rises in the Neoproterozoic (c. 850–550 Ma) and Paleozoic (c. 428–359 Ma)
  (Wikipedia: Geological history of oxygen). UCMP: the oxygen atmosphere was generated by cyanobacteria.
  Left out: the Carboniferous "35%" peak, because the page states it garbled ("1.6 atm") and other estimates are lower.
- Ice: "at least five major ice ages" and Huronian 2.4–2.1 Ga, Cryogenian 720–635 Ma (Wikipedia: Ice age; Snowball Earth for 717–635).
  LGM sea level c. 125 m lower, ice on 25% of land, c. 21,000 years ago (Wikipedia: Last Glacial Maximum). "Last 2.6 million years or so" follows
  the Quaternary start (2.58 Ma) on Wikipedia: Ice age. The page's `northern-hemisphere-glaciation` event says 2.7 Ma, so the forces text is deliberately
  vague ("2.6 million years or so") to stay compatible with both.
- Drift: plates move 10–40 mm a year at the Mid-Atlantic Ridge, "about as fast as fingernails grow" (Wikipedia: Plate tectonics). Supercontinent cycle
  300–500 Myr (Wikipedia: Supercontinent cycle).
- Impacts: c. 1 km asteroids about once every 500,000 years; Chicxulub impactor c. 10 km, crater c. 180 km (Wikipedia: Impact event); Moon from a giant
  impact c. 4.5 Ga (NASA Science). Vredefort (2.02 Ga) and Sudbury (1.85 Ga) are given as "about two billion years old", matching the existing events.
- Evolution: species alive today are under 1% of all that have lived; land plants c. 470 Ma (Wikipedia: Evolutionary history of life); Cambrian 538.8 Ma
  (ICS, as on the page); oldest accepted fossils 3.48 Ga (existing event).
- People: CO2 about 280 ppm before industry (Wikipedia: Carbon dioxide in Earth's atmosphere); 424.68 ppm global monthly mean for August 2026
  (NOAA GML, page updated 19 Nov 2026), written as "more than 420". "Higher than at any time for at least 3 million years": Wikipedia gives the highest
  in c. 14 million years (a 2023 estimate) and the IPCC's similar levels 3–3.3 million years ago, so the text uses the cautious figure. Farming c. 11,700 years ago.

Evidence labels: geology for volcanism, water, oxygen, ice, drift, impacts and people; fossil for evolution. Disputed details are hedged in the text
rather than labelling the whole force disputed.

## Disputed points (both sides)
- **Oldest eukaryote fossils / acritarchs.** Accepted: ornamented acritarchs c. 1.65 Ga (Changcheng Group, North China; northern Australia).
  For older: Yin et al. 2020 report ornamented acritarchs from the Hutuo Group, Shanxi (c. 2.15–1.95 Ga), as early eukaryotes. Against: even the
  institute's own news page calls the link between acritarchs and eukaryotic algae speculative, and Bengtson et al. 2017 call claims of eukaryotes
  among "simple acritarchs at 1.8 Ga" controversial. Archean and earliest Proterozoic "acritarchs" may be prokaryotes (Wikipedia: Acritarch, citing Yin 2020).
- **Grypania.** For a eukaryote: Han & Runnegar 1992 (alga); Knoll et al. 2006 call Grypania "very likely of eukaryotic origin" (mainly the Mesoproterozoic material).
  Against: Bengtson et al. 2017 say the Palaeoproterozoic Michigan fossil lacks the segments of the Mesoproterozoic type species, "may not be a true
  Grypania", and has been read as a giant cyanobacterium. Miao et al. 2024 say older records are controversial because no cells are preserved.
  Age: originally 2.1 Ga, now c. 1.87 Ga.
- **Tappania.** It is accepted as a eukaryote. What kind is open: Butterfield's reading as a possible fungus is reported by Javaux & Knoll 2017, who leave its
  affinity open. The text says only "it has been compared with fungi".
- **Weng'an "embryos".** For animal embryos: Xiao et al. 1998, followed by bilaterian and stem-animal claims (Chen et al.; Hagadorn et al. 2006; Schiffbauer
  et al. 2012). For giant sulfur bacteria: Bailey et al. 2007, which Cunningham et al. 2017 reject (ornamented envelopes, nuclei, and
  *Thiomargarita* does not form the bacterial pseudomorphs needed). For non-animal relatives (holozoans), algae or ciliates: Huldtgren et al. 2011; Butterfield 2011;
  Chen et al. 2014. Cunningham et al. 2017 call these plausible but unproven and conclude that no Weng'an fossil can yet be assigned to animals with confidence.
  *Vernanimalcula* as a bilaterian was rejected (Bengtson & Budd 2004) and is not mentioned.
- In forces.json, these disputes are hedged in the text: the cause of extinctions by lava floods, Snowball Earth completeness, the role of humans versus climate in the megafauna
  extinctions, the giant-impact details, and when plate tectonics began.

## Left out, and why
- A separate "oldest acritarchs" event would duplicate `first-eukaryotes` (same rocks, same date).
- A Hutuo Group event (c. 2.1 Ga): the claim is not widely accepted, and I could only open the institute news page, not the paper. It is mentioned as disputed instead.
- A Ruyang Group / *Shuiyousphaeridium* event: there is disagreement about its age (Knoll et al. 2006: between 1600 and 1000 Ma; Miao et al. 2024: c. 1650 Ma), and origins.json already names
  "Tappania ... Ruyang Group" for the eukaryotes group.
- A separate Pertatataka (Australia) event: it is the same Ediacaran acritarch assemblage as Weng'an.
- Exact drill-core and quarry coordinates (Roper, Weng'an): I couldn't find them on a page I could open; nearby named places are used instead (see above).

## Couldn't verify (and so didn't use)
- Han & Runnegar 1992 full text (PubMed cookie wall); Nature pages (login redirect); the USGS "This Dynamic Earth" and NOAA climate.gov pages (403).
- The precise sizes of Weng'an acritarchs (the paper's scale bars are not specimen sizes), so no size is given.
- Sharma & Shukla 2009 (Indian Grypania, Rohtas Formation) was seen only in search results. India is mentioned on the strength of Miao et al. 2024.

Counts: 1 event improved, 3 events added, 8 forces written. All ids unique across events-a/b (107). Every forces ref exists.
