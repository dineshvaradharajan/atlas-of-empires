# Prehistory, deep time, slice B: Mesozoic and Cenozoic units and events

Files: `content/prehistory/periods-b.json` (15 time units) and `content/prehistory/events-b.json` (54 events).
Researched 2026-11-21. Slice A (Hadean to Permian) is another researcher's; the two meet at 251.902 Ma.

## Counts
- Units: 15 (2 eras, 6 periods, 7 epochs). Evidence labels: geology 11, fossil 4 (the Mesozoic and its three periods).
- Events: 54. Evidence labels: geology 29, fossil 14, disputed 11. Kinds: continents 12, fossil-site 11, climate 9,
  ocean 8, volcanism 6, life 4, extinction 3, impact 1. 43 have a `lonlat`; 11 are planet-wide (null).
- 164 distinct source URLs, each matched by script against a page fetched in this session.

## ICS chart version
**International Chronostratigraphic Chart v2026/06** (the version distributed at STRATI 2026), read from
- the chart PDF: https://stratigraphy.org/ICSchart/ChronostratChart2026-06.pdf
- the ICS change log: https://stratigraphy.org/ICSchart/ChangeLog2012-2026.txt
- the ICS machine-readable chart (ages and colours): https://raw.githubusercontent.com/i-c-stratigraphy/chart/main/chart.ttl
  (linked from https://stratigraphy.org/data-models).

v2026/06 changed only three stage ages (Anisian, Olenekian, Wuchiapingian); none is a boundary of a unit in this
slice. Boundaries used (Ma): Triassic 251.902 ± 0.024; Jurassic 201.4 ± 0.2; Cretaceous 143.1 ± 0.6 (changed from 145.0
in v2024/12); Paleogene/Paleocene 66.00; Eocene 56.00; Oligocene 33.9; Neogene/Miocene 23.04 (was 23.03 before
v2024/12); Pliocene 5.333; Quaternary/Pleistocene 2.58; Holocene 0.0117. Colours are the `schema:color` hex values in
the ICS data file (CGMW colours): Mesozoic #67C5CA, Triassic #812B92, Jurassic #34B2C9, Cretaceous #7FC64E, Cenozoic
#F2F91D, Paleogene #FD9A52, Neogene #FFE619, Quaternary #F9F97F, Paleocene #FDA75F, Eocene #FDB46C, Oligocene #FEC07A,
Miocene #FFFF00, Pliocene #FFFF99, Pleistocene #FFEFAF, Holocene #FEEBD2.

## How sources were read (and what could not be opened)
- Peer-reviewed papers: abstracts read through the NCBI E-utilities API (the official programmatic route to PubMed);
  the cited URL is the public PubMed page of the same record (`https://pubmed.ncbi.nlm.nih.gov/<id>/`). Two open-access
  full texts were read through the PMC API and are cited by their PMC pages (Miller et al. 2020, PMC7228749; Huang et
  al. 2024, PMC11331090, the latter via the Europe PMC API). Only what the abstract (or, for those two, the text)
  states is used.
- Wikipedia: read as the wikitext of the article (`action=raw`), so that statements could be checked for a citation.
- **Could not be opened (HTTP 403 to automated requests, not worked around):** all UNESCO World Heritage pages
  (whc.unesco.org), the Smithsonian NMNH "Extinction over time" page, PubMed HTML pages, science.org. Consequence:
  World Heritage facts (Messel; Riversleigh inscribed 1994) rest on the Wikipedia infoboxes only; the Smithsonian is
  represented only by one Human Origins page; no British Geological Survey page was used.
- UCMP pages are old (written 1995–2011) and use the 2009 ICS dates; they are cited for descriptions of life and
  geography only, never for dates.

## What was included
- Units: every unit asked for. The two eras and the three Cenozoic periods have summary text and empty `changes`.
- Events: every item in the brief's list. "La Brea" and "Rancho La Brea" are the same site: one event. The Tasman
  gateway and "Australia leaves Antarctica" are two events (ocean, continents). The India-Asia collision and the rise
  of the Himalayas and Tibet are two events. The Ontong Java Plateau is folded into the OAE 1a event because its
  re-dating is the news.
- Human evolution: headline points only, as `changes` in the Miocene, Pliocene and Pleistocene units (Sahelanthropus
  7–6 Ma; Lomekwi tools 3.3 Ma; Jebel Irhoud c. 315,000 years; Madjedbebe c. 65,000 years; White Sands 23,000–21,000
  years). No human-origins events were written: they belong to the other part.

## What was left out, and why
- Manicouagan impact, Monte San Giorgio, the Jurassic Coast/Lyme Regis, Dinosaur Provincial Park, Tendaguru, Corral
  Bluffs, the Chesapeake Bay and Popigai impacts: not in the brief's list and not fetched; candidates if more points
  are wanted on the globe.
- Tanis (the claimed "day of the impact" site in North Dakota): contested and not fetched.
- The molecular-clock argument that flowering plants are much older than their fossils: not fetched, so the event
  `first-flowering-plants` is labelled `fossil` and its note says "that scientists agree on".
- The cause of Oceanic Anoxic Event 2 beyond Turgeon & Creaser's osmium evidence (which volcanic province) is not named.
- No `genetic` or `archaeology` labels are used: nothing in this slice rests mainly on DNA clocks, and the
  archaeological points are one-line mentions sourced to their papers.

## Stats: how each number was obtained
- **tempC and co2ppm (all 15 units):** time-weighted means of the per-stage medians (`GMST_50`, `CO2_50`) in
  `5_Outputs/PhanDA_GMSTandCO2_percentiles.csv` of the PhanDA data release (Judd et al. 2024, Science), rounded
  (temperature to 1 °C, CO2 to the nearest 10–50 ppm). The same file is used by slice A. Raw means: Mesozoic 26.3 °C /
  869 ppm; Triassic 24.2 / 922; Jurassic 24.2 / 859; Cretaceous 29.2 / 842; Cenozoic 24.8 / 739; Paleogene 27.3 / 877;
  Neogene 21.2 / 509; Quaternary 12.9 / 262; Paleocene 27.8 / 858; Eocene 28.9 / 1031; Oligocene 23.4 / 582; Miocene
  22.1 / 544; Pliocene 16.0 / 283; Pleistocene 12.9 / 262; Holocene 14.0 / 276. These are means over long units with
  wide uncertainty (the 5–95% band is often ±5 °C in the Mesozoic); stage medians range from 17.8 °C (Bathonian) to
  35.6 °C (Turonian). **Caution:** the Pliocene CO2 here (about 280 ppm) is lower than the roughly 400 ppm often
  quoted for the mid-Pliocene; I kept the dataset's value and wrote only "lower than today's" in the text.
  Holocene CO2 280 is the pre-industrial level; the 2026 value (426.69 ppm, Mauna Loa, October 2026) is in the text.
- **dayHours:** two measured anchors: 22.6 h (+0.46/−0.45) at 245 Ma (Huang et al. 2024, PNAS, cyclostratigraphy) and
  about 23.5 h (372 days a year) at 70 Ma (de Winter et al. 2020, via the AGU press release). Triassic 22.6 and
  Cretaceous 23.5 are those measurements (each from one point inside the unit, not the middle). **All other values are
  my straight-line interpolations between the anchors and today's 24 h** (Jurassic 23.0, Mesozoic 23.0, Paleocene 23.6,
  Eocene 23.7, Oligocene 23.8, Miocene 23.9, Pliocene/Pleistocene/Holocene 24.0, Paleogene 23.7, Neogene 23.9,
  Quaternary 24.0, Cenozoic 23.8). They are not independent estimates; set them to null if only measured values are
  wanted.
- **seaLevelM:** Triassic 20 and Jurassic 50 are rough readings of the cited sea-level descriptions in Wikipedia
  "Triassic" (near present at the start, 10–20 m above in the Early and Middle Triassic, up to 50 m above in the
  Carnian, 50 m below in the Rhaetian) and "Jurassic" (near present at the start, about 75 m in the Toarcian, "possibly
  as high as 140 metres" at the end). Cretaceous 100: "peaked at 100 ± 50 meters during the Cretaceous" (Miller et al.
  2005); other reconstructions (not fetched) put the peak much higher, so this is uncertain by a factor of two.
  Eocene 45: "40 to 50 m above present in the Eocene" (Miller et al. 2020; their ice-free line is 66 m). Oligocene 0:
  "near or below modern levels in the Oligocene" (same paper). Pliocene 17: 16.2–17.4 m at the mid-Piacenzian, 23.5 m
  at the Pliocene optimum (Dumitru et al. 2019). Holocene 0. **Null** for the eras, the Cenozoic periods, the
  Paleocene and Miocene (no single figure found on a fetched page) and the Pleistocene (it swung between about −130 m
  and a few metres above today; the range is in the text).
- **o2Percent:** Triassic 18.5: "the inertinite proxy suggests that pO2 would have declined substantially (to ~18.5%)
  by the mid-Triassic" (Krause et al. 2018, Nature Communications). Holocene 21 (today's air). **All other units
  null:** I found no reputable per-period figure on a page I could open. Wikipedia's "Geological history of oxygen"
  says only that oxygen "rose to above modern levels during the Jurassic and Cretaceous" and "fluctuated ... between
  15% and 25%" in the Cenozoic, uncited.

## Disputed cases (label `disputed` unless noted)
1. **End-Triassic extinction: how the eruptions killed** (`end-triassic-extinction`). Agreed: the Central Atlantic
   Magmatic Province erupted at the same time (Blackburn et al. 2013; Marzoli et al. 1999). Mechanism: CO2-driven
   warming and ocean acidification (Capriolo et al. 2020); a methane release of at least 12,000 gigatonnes of carbon
   (Ruhl et al. 2011); gases from sills baking organic-rich sediments, starting about 100,000 years before the first
   known lavas (Davies et al. 2017); short, intense volcanic winters that insulated dinosaurs survived (Olsen et al.
   2022). The size of the loss is also soft: "up to ~50% loss in marine biodiversity" (Ruhl).
2. **Chicxulub versus the Deccan Traps** (`deccan-traps`, `end-cretaceous-extinction`). Impact as the cause: Schulte
   et al. 2010 (a large review); Hull et al. 2020 (most Deccan outgassing ended well before the impact, and only
   the impact coincides with the extinction); Chiarenza et al. 2020 (impact winter removes dinosaur habitat; Deccan
   warming would have helped them). Both together: Schoene et al. 2019 (U-Pb dating: four pulses, one starting tens
   of thousands of years before the impact); Renne et al. 2013 ("ecosystems already under near-critical stress").
   Timing of the lava itself is disputed between Schoene (U-Pb) and Sprain et al. 2019 (Ar-Ar: over 90% in under a
   million years, about 75% after the boundary).
3. **Were non-bird dinosaurs already declining?** (`were-dinosaurs-declining`). Yes: Sakamoto et al. 2016 (extinction
   outpaced speciation for tens of millions of years); Condamine et al. 2021 (decline from about 76 Ma, tied to cooling
   and falling herbivore diversity). No: Bonsor et al. 2020 (no strong support for a downturn); Dean et al. 2025 (the
   apparent North American decline is a sampling effect of how much rock is exposed).
4. **Ontong Java Plateau and Oceanic Anoxic Event 1a** (`oceanic-anoxic-event-1a`). Long-held view: the plateau's
   eruption caused the event (Wikipedia "Selli Event", "Ontong Java Plateau"). Davidson et al. 2023: new argon ages
   are up to 10 million years younger, so the plateau is too young. The trigger is open.
5. **India-Asia collision** (`india-asia-collision`). About 55 Ma (Wikipedia "Geology of the Himalayas", "Indian
   plate"); "between 40 and 50 million years ago" (USGS, This Dynamic Earth); two stages, a microcontinent at about 50
   Ma and the main "hard" collision at 25–20 Ma (van Hinsbergen et al. 2012). The 59 ± 1 Ma estimate of Hu et al.
   (2016) is the reason the event's range starts at 59, but that paper could not be opened, so it is not cited.
6. **Drake Passage** (`drake-passage-opens`). Estimates run from 49 to 17 Ma (Scher & Martin 2006; Wikipedia). Scher &
   Martin: shallow Pacific inflow about 41 Ma. The event is dated 41 Ma with the full range as `maRange`.
7. **Why Antarctica froze** (`antarctic-ice-sheet-forms`, labelled `geology` because the date is firm). Ocean gateways
   and the circumpolar current (the older view, described in DeConto & Pollard 2003 and Scher et al. 2015) versus
   falling CO2 (DeConto & Pollard 2003, who find the gateways secondary). Scher et al. 2015 date the current to about
   30 Ma, a few million years after the ice sheet formed.
8. **Isthmus of Panama** (`isthmus-of-panama`). About 2.8 Ma (O'Dea et al. 2016, a large review that calls the
   evidence for older dates "inconclusive"); middle Miocene closure of the seaway (Montes et al. 2015, zircons in Colombian river
   sands); migration waves at about 20 and 6 Ma (Bacon et al. 2015, DNA and fossils). Mainstream date kept, range to
   15 Ma.
9. **Megafauna extinctions** (`megafauna-extinctions`). Humans: Sandom et al. 2014; Svenning et al. 2024 ("little
   support for any major influence of climate"). Climate: Cooper et al. 2015 (abrupt warming events); Stewart et al.
   2021 (North America: no link to human numbers, a link to temperature). Mixed or unresolved: Meltzer 2020 (read but
   not cited); the 2023 La Brea study (fire, people and warming together; museum press release). UCMP's page also
   calls the question unsolved.
10. **Younger Dryas impact hypothesis** (`younger-dryas`). For: Firestone et al. 2007; Kennett et al. 2009
    (nanodiamonds). Against: Holliday et al. 2016 (a blind test found the markers absent or not unique to the layer);
    Wikipedia's summary that the idea "has been widely rejected by most relevant experts"; the La Brea study also
    rules a comet out locally. Stated in the text as rejected by the mainstream. The fuller refutation (Holliday et al.
    2023, Earth-Science Reviews) could not be opened.
11. **Anthropocene** (`anthropocene-proposal`; Holocene unit). Not a formal unit. The Anthropocene Working Group
    proposed an epoch starting in 1952 at Crawford Lake; the Subcommission on Quaternary Stratigraphy voted it down
    and the IUGS and ICS confirmed that in March 2024 (IUGS-ICS statement; ICS news item 152). The 12-to-4 vote with 2
    abstentions is from Wikipedia (cited there), not from the statement itself. The other side (Zalasiewicz et al.
    2024, Nature) argues the term matters without a formal definition.

Smaller hedges inside `geology`/`fossil` items: the PETM carbon source (volcanic, Gutjahr et al. 2017 and Storey et
al. 2007, versus sea-floor methane); whether the Azolla blooms cooled the planet (a hypothesis); the Laramide dates
("in dispute", Wikipedia); which fossils are the first true mammals; whether Sahelanthropus walked upright and is on
the human line (text says "possibly"); Madjedbebe and White Sands (both marked as debated); Holocene temperature
(Kaufman et al. 2020 find a peak about 6,500 years ago; Osman et al. 2021 find steady slight warming instead: the
text says "by one reconstruction").

## Numbers and statements I could not verify well
- Interpolated `dayHours` and the rough `seaLevelM` for Triassic, Jurassic and Oligocene (see Stats).
- `lonlat` for ocean-opening events (central Atlantic, South Atlantic, Gondwana split, North Atlantic, Australia–
  Antarctica, Drake, Tasmanian gateway) and for the Deccan, Karoo, Paraná, Columbia River, Alps, Rockies and Altiplano
  are representative points I chose inside the named region, not published coordinates. Site coordinates (Ghost Ranch,
  Solnhofen, Messel, La Brea, Chicxulub, Morrison type locality, Yixian, Riversleigh, Wadi al-Hitan, Crawford Lake)
  are from Wikipedia infoboxes; Hell Creek is placed near Jordan, Montana, by me (the infobox point is in North
  Dakota); Fossil Butte, Bighorn Basin, Lomonosov Ridge, Giant's Causeway and Mount Everest are from memory.
- Ghost Ranch quarry date: "c. 210 Ma" is my midpoint of the range Wikipedia gives for Coelophysis (215–201.4 Ma).
- Hell Creek "c. 68–66 Ma": from "deposited in about 2 million years" ending at the boundary (Wikipedia).
- South Atlantic opening "c. 135–100 Ma": the start follows the Paraná-Etendeka lavas (136–132 Ma); the end
  ("middle Cretaceous") is Wikipedia's wording, without a figure.
- Central Atlantic "c. 195–175 Ma": bracketed by USGS ("began to break up about 225–200 million years ago") and
  Wikipedia "Pangaea" ("began to break apart about 175 million years ago"); no single dated source for first sea floor.
- India's speed "9 to 20 cm a year": USGS gives about 9 m a century, Wikipedia about 20 cm a year.
- Central Atlantic Magmatic Province area: "exceeded 7 million square kilometres" (Marzoli et al. 1999) is used;
  Wikipedia gives about 11 million.
- La Brea age span: the museum says "the last 50,000 years", UCMP "40,000 to 8,000 years ago"; "c. 50,000–10,000" used.
- Juramaia (160 Ma) and the Riversleigh faunal-zone ages are from Wikipedia only.
- Everything marked "from memory" above should be checked if exact positions matter on the globe.
