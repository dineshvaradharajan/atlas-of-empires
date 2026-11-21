# Deep-time research log: Hadean to Permian (slice A)

Files: `content/prehistory/periods-a.json` (17 time units) and `content/prehistory/events-a.json` (50 events).
Researched 2026-11-21. Rules followed: `content/FACTCHECK.md` and the evidence labels in `content/PREHISTORY.md`.

## Time scale used
- **International Chronostratigraphic Chart, version 2026/06** (ICS; `owl:versionInfo "2026-06"`, data file modified
  2026-06-20, "Strati2026 version of the Chart"). The chart page https://stratigraphy.org/chart is a script-driven page,
  so the boundary ages and colours were read from the ICS's own data file behind it (`chart.ttl`, release tag
  2026-06.9 of the `i-c-stratigraphy/chart` repository, the file the chart page itself loads).
- Boundary ages taken from it (Ma): Hadean 4567–4031; Archean 4031–2500; Proterozoic 2500–538.8 (Paleoproterozoic
  2500–1600, Mesoproterozoic 1600–1000, Neoproterozoic 1000–538.8; Tonian 1000–720, Cryogenian 720–635, Ediacaran
  635–538.8); Paleozoic 538.8–251.902 (Cambrian 538.8–486.85, Ordovician 486.85–443.1, Silurian 443.1–419.62,
  Devonian 419.62–358.86, Carboniferous 358.86–298.9, Permian 298.9–251.902).
- These differ from older charts still quoted on many pages (e.g. Hadean/Archean 4000, Cambrian/Ordovician 485.4,
  Ordovician/Silurian 443.8, Silurian/Devonian 419.2, Devonian/Carboniferous 358.9). UCMP and BGS pages cited here use
  2009 and 2012 time scales; only their descriptions were used, never their dates.
- The data file marks the Tonian/Cryogenian (720) and Cryogenian/Ediacaran (635) ages with the note "uncertain".
- `color` is the `schema:color` value given for each unit in the same file (the CGMW colours).

## What is in the files, and why
- **Units (17):** the three Precambrian eons; the three Proterozoic eras; the Neoproterozoic's three periods; the
  Paleozoic and its six periods; and the **Phanerozoic** eon.
  - **Tonian added** (not in the brief's list). Without it the Neoproterozoic's periods would cover only 720–538.8 and
    the "no gaps within a rank" check would fail inside that era. Periods therefore run without a gap from 1000 Ma.
    The Paleoproterozoic and Mesoproterozoic have no period-level children here (their eight ICS periods were left
    out as too fine for the page).
  - **Phanerozoic added** as the parent of the Paleozoic so that every `parent` id resolves. It spans both
    researchers' slices (538.8–0): keep one copy when merging with slice B.
  - **Parent units** (Proterozoic, Neoproterozoic, Phanerozoic, Paleozoic) have short text, no `changes` and all-null
    `stats`: a single "mid-unit" figure would mislead for spans in which everything changed.
  - Unit `sources` are capped at 8. A unit `changes` entry that repeats an event (same date and subject) is sourced in
    that event's `sources` in `events-a.json`.
- **Events (50):** the brief's list, trimmed to the 50 limit. Left out as separate events and covered in the unit text
  or inside another event instead: the Solar System's first solids (inside "The Earth forms"); "first oceans" (inside
  the Jack Hills zircon event); the Late Heavy Bombardment (a hypothesis that some researchers doubt; no dated point to show);
  the Pongola glaciation; the Barberton impact layers; the Great Ordovician Biodiversification; the first land plants
  (spores, Cooksonia); the Hirnantian glaciation (inside the Late Ordovician extinction, which carries its Sahara
  location); the Gaskiers glaciation (inside Mistaken Point); the Doushantuo "embryos"; the Carboniferous rainforest
  collapse; the Emeishan Traps and Capitanian extinction; Meganeura and Dimetrodon.
- `lonlat` is null for planet-wide events (supercontinents, the Moon-forming impact, the rise of oxygen, the start of
  plate tectonics). The three extinctions carry the best-known place where the evidence is read: Central Sahara
  (glacial deposits), the Kellwasser valley (type locality), Meishan (dated boundary section).

## How sources were checked
- Every claim was checked against a page that was fetched and read during this work. Wikipedia pages were read as
  full article text; statements were used only where the article gives them with a citation.
- Nature-family papers: the publisher's article page was fetched (title, authors, abstract; full text for the
  open-access Krause et al. 2018).
- **Papers in Science, Science Advances, PNAS, Phil. Trans. and Current Biology** (all `https://doi.org/...` links,
  31 of the 170 source URLs): the publishers' pages refuse automated fetches (HTTP 403), as do PubMed and PubMed
  Central. Their titles, authors, DOIs and abstracts were read from the **Europe PMC** record of each paper (the open
  Europe PMC web service), and the DOI link is given so a reader lands on the paper itself. These DOI pages were
  therefore **not opened directly**; if the rule "cite only pages you opened" is applied strictly, treat them as
  verified at abstract level through Europe PMC. One record (Algeo & Scheckler 1998) has a title and DOI but no
  abstract or author list in Europe PMC.
- Judd et al. 2024 (Science) was read in full from the accepted manuscript on the US NSF public-access repository;
  its per-stage numbers come from the data file in the authors' repository named in the paper.
- Not reachable (HTTP 403 or 404), so not cited: UNESCO World Heritage pages for Joggins, Mistaken Point, Chengjiang
  and Vredefort; the UCMP Archean page; PubMed Central copies. No Smithsonian NMNH page could be found for this slice.

## Stats (`stats`): where each number comes from
All are approximate; `null` means no figure I could verify and defend.
- **dayHours.** Archean 13: tidal layers 3.2 billion years old, Moodies Group, South Africa (Eulenfeld & Heubeck
  2023). Paleoproterozoic 17: 16.9 ± 0.2 h at 2.46 Ga, measured near the start of the era (Lantink et al. 2022).
  Mesoproterozoic 19: 18.68 ± 0.25 h at 1.4 Ga (Meyers & Malinverno 2018) and "about 19 h for about 1 billion years"
  (Mitchell & Kirscher 2023). Cryogenian and Ediacaran 21.9: 21.9 ± 0.4 h at about 620 Ma from tidal rhythmites
  (Williams 2000, as cited in Wikipedia "Tidal acceleration"); 620 Ma is in the Ediacaran, and the same figure is
  used for the Cryogenian as the nearest measurement. Devonian 22: "over 400 days per year in the Middle Devonian"
  from coral growth rings (Wells 1963, as cited in Wikipedia "Rugosa"); 8,766 hours ÷ 400 ≈ 21.9. Hadean null (the
  only figure found, "some five hours" just after the Moon formed, is in the text, not the stat). Tonian, Cambrian,
  Ordovician, Silurian, Carboniferous, Permian null: Huang et al. 2024 (PNAS) report that the day lengthened by about
  2.2 hours between 650 and 240 Ma with a stall from 500 to 350 Ma, but I could read no per-period values.
- **tempC and co2ppm, Ordovician to Permian.** Time-weighted means of the per-stage medians (`GMST_50`, `CO2_50`) in
  `5_Outputs/PhanDA_GMSTandCO2_percentiles.csv` of the PhanDA data release (Judd et al. 2024), rounded: Ordovician
  29.8 °C / 2135 ppm → 30 / 2100; Silurian 24.9 / 799 → 25 / 800; Devonian 25.5 / 1342 → 26 / 1300; Carboniferous
  15.9 / 397 → 16 / 400; Permian 19.1 / 574 → 19 / 570. These are **period averages, not mid-period values**; ranges
  within a period are wide (e.g. Ordovician stages 21–32 °C and 480–3300 ppm; Carboniferous 12–22 °C). The averaging
  is mine. Slice B should use the same file so the two halves match (the same calculation gives Triassic 24.2 °C /
  922 ppm).
- **tempC, Cambrian 24.** "c. 23–25 °C for the rest of the Cambrian" (Wikipedia "Cambrian", cited); the article
  notes other methods give over 40 °C. PhanDA starts at 485 Ma, so does not cover the Cambrian.
- **co2ppm, Cambrian and all Precambrian units: null.** For the Archean, Catling & Zahnle 2020 give CO2 "~10 to
  2500 times modern", too wide for one number.
- **o2Percent.** Archean 0: "<10^-6 times present" (Catling & Zahnle 2020). Cambrian 6, Ordovician 8: "oscillated
  between ~2 and 11% atm during the Cambrian to mid-Ordovician" (Krause et al. 2018). Silurian 15: the same paper's
  "transition to ... generally above 15%" and charcoal from 419 Ma. Devonian 17: "near modern-day levels", with a low
  of about 14.5% at 393 Ma. Carboniferous 25: above 25% early, about 20% at 323 Ma, peak 25–30% near 300 Ma. Permian
  27: "25–30% in the Permo-Carboniferous". **These are my rough readings of a model described in prose, not
  tabulated values**; the Ordovician and Silurian figures are the weakest. Proterozoic units null: estimates for the
  mid-Proterozoic run from "at most 0.1% of present" (Planavsky et al. 2014, Science) to about 10% of present
  (Wikipedia "Great Oxidation Event", cited), a hundredfold disagreement.
- **seaLevelM.** From the sea-level line of each Wikipedia period article, which cites Haq & Schutter 2008: Cambrian
  "rising steadily from 4 m to 90 m" → 50; Ordovician "180 m, rising to 220 m, falling sharply to about 140 m" → 200;
  Silurian "around 180 m" → 180; Devonian "relatively steady around 189 m, gradually falling to 120 m" → 170;
  Carboniferous "falling from 120 m to present-day level through the Mississippian, then rising to about 80 m" → 20
  at mid-period. Permian null: the article now says only "several tens of metres above present" early on, falling to
  about present level late. The mid-period picks are mine.

## Disputed cases (label `disputed`), with the positions
1. **Details of the Moon-forming impact.** Agreed: a giant impact (NASA; Apollo samples). Canup & Asphaug 2001: a
   glancing blow by a Mars-sized body late in Earth's growth. Problem: Moon and Earth rocks are isotopically almost
   identical. Ćuk & Stewart 2012: a fast-spinning Earth; Canup 2012: a larger impactor. Timing: "about 30 to 200
   million years after Solar System formation" (range quoted by Thiemens et al. 2019, who favour about 50 Myr);
   Barboni et al. 2017: by 4.51 Ga from Apollo 14 zircons.
2. **Jack Hills carbon (4.1 Ga).** Bell et al. 2015: graphite with light carbon in one zircon, "potentially
   biogenic". Against: a single grain; non-biological routes to light carbon exist (cf. Brasier et al. 2002);
   Wikipedia "Archean" calls it preliminary.
3. **Nuvvuagittuq.** Age: O'Neil et al. 2008 (4,280 Ma) and Sole et al. 2025 (about 4,160 Ma) from neodymium
   isotopes, versus zircon ages of about 3,750–3,780 Ma accepted by others. Fossils: Dodd et al. 2017 (haematite
   tubes and filaments as vent microbes, at least 3,770 Ma); doubted in later work on whether such filaments need
   life (cited in Wikipedia "Earliest known life forms").
4. **Isua.** Light-carbon graphite as biological: Mojzsis et al. 1996, Ohtomo et al. 2014; alternative: deposited
   from metamorphic or igneous fluids (the doubt Ohtomo et al. set out to answer). Stromatolites: Nutman et al. 2016
   for; Allwood et al. 2018 against (deformation structures).
5. **Pilbara stromatolites.** Dresser Formation (3.48 Ga; Djokic et al. 2017) and Strelley Pool (3.43 Ga; Allwood
   et al. 2006) are "generally accepted" (Nutman et al. 2016's words). Labelled disputed as the brief requires; the
   live dispute is the Apex chert "microfossils" (Brasier et al. 2002: artefacts) and whether every laminated
   structure is biological.
6. **Start of plate tectonics.** Hadean signs (Hopkins et al. 2008); 3.2–2.5 Ga (Cawood et al. 2018, who note
   published estimates "range from the Hadean to the Neoproterozoic"); modern-speed drift at 3.2 Ga (Brenner et al.
   2020). Wikipedia "Archean" and "Hadean" give yet another view (vigorous in the Hadean, slowing in the Archean).
7. **Vaalbara and Ur.** Both "hypothetical" (Wikipedia). Vaalbara: Kaapvaal plus Pilbara, crust 3.6–2.7 Ga. Ur
   (Rogers): India, Western Australia, southern Africa, about 3.1 Ga. Mitchell et al. 2021 prefer smaller, separate
   Archean "supercratons".
8. **Start of oxygen-making photosynthesis.** Early: Planavsky et al. 2014 (2.95 Ga, molybdenum isotopes); Patry
   et al. 2025 (2.87 Ga). Late: Kopp et al. 2005 (shortly before the rise of oxygen). 2.7 Ga biomarkers shown to be
   contamination (Rasmussen et al. 2008). The 2.5 Ga "whiff of oxygen" (Anbar et al. 2007) is contested by Slotznick
   et al. (2022/2023).
9. **Kenorland.** "Hypothetical" (Wikipedia); formed about 2.72 Ga if real; membership and form disputed.
10. **Francevillian biota (2.1 Ga).** El Albani et al. 2010: large colonial organisms. Against: Seilacher (pyrite
    pseudofossils); a 2016 study of similar Michigan structures (concretions), both as cited in Wikipedia.
11. **How completely Snowball Earth froze (Sturtian, Marinoan).** Hard snowball: Hoffman et al. 2017; ice at sea
    level in the tropics dated at 716.5 Ma (Macdonald et al. 2010). Open tropical water ("slushball"): Hyde et al.
    2000 climate models. Marinoan start poorly dated: "≥5 My" long (Hoffman et al.); 639–635 Ma (a 2025 paper cited
    in Wikipedia). I give 639 with a hedge.
12. **Sponge biomarkers / first animals.** For: Love et al. 2009 (24-isopropylcholestane, before 635 Ma, Oman);
    Zumberge et al. 2018 (a second sterane). Against: Nettersheim et al. 2019 (Rhizaria make both). Possible 890 Ma
    sponge body fossils (Turner 2021) are mentioned in the Tonian unit as disputed. Molecular clocks: crown animals
    arose "during the Cryogenian" as then defined (dos Reis et al. 2015).
13. **Pannotia.** Proposed supercontinent about 633–573 Ma (Powell 1995); a 2022 paper argues it never fully
    assembled (Wikipedia "Pannotia").
14. **Nature of the Ediacaran creatures.** Animals, protists, lichens, or Seilacher's separate "Vendobionta"
    (UCMP; Wikipedia). Bobrovskiy et al. 2018: cholesterol shows Dickinsonia was an animal.
15. **Cause of the Late Ordovician extinction.** Glaciation, cooling and habitat loss (Finnegan et al. 2012;
    Wikipedia), second pulse with anoxia. Alternative: volcanism and warming (studies cited in Wikipedia). The paper
    I wanted for the alternative, Bond & Grasby 2020 (Geology), could not be opened, so it is not named in the text.
16. **Cause of the Late Devonian extinctions.** Anoxia with several proposed drivers: land plants and nutrient
    run-off (Algeo & Scheckler 1998), volcanism (Judd et al. 2024 note large igneous provinces at the time), cooling
    and glaciation, ozone loss, a supernova (Fields et al. 2020), impact. Severity is itself contested ("around 40%
    of marine species", Wikipedia).
17. **End-Permian kill mechanism and speed.** Trigger agreed: Siberian Traps (Burgess & Bowring 2015). Mechanisms:
    warming plus oxygen loss (Penn et al. 2018); ocean acidification (Jurikova et al. 2020; limited by the NHM-reported
    2022 shell study); ozone loss and acid rain on land (Dal Corso et al. 2022). Timing on land versus sea:
    Gastaldo et al. 2020 put the Karoo turnover over 300,000 years before the marine extinction.

Not labelled disputed but hedged in the text: the meaning of the Jack Hills zircon chemistry (liquid water by 4.4 Ga);
the layout of Columbia/Nuna and Rodinia; whether the Huronian included a true Snowball Earth; the oldest eukaryote
fossils (1.65 Ga accepted; Grypania at 1.87 Ga doubtful; molecular clocks earlier).

## Numbers and details I could not verify, or that are approximate
- **Coordinates from memory, not from a fetched page** (plausible to within tens of kilometres): Isua [-49.9, 65.15];
  North Pole Dome, Pilbara [119.4, -21.15]; Changcheng Group near Jixian, North China [117.4, 40.1]; South Oman Salt
  Basin [55.5, 18.5]; Tiktaalik site on southern Ellesmere Island [-86.0, 77.2]; Kellwasser valley [10.43, 51.82];
  Meishan [119.71, 31.08]; central Appalachians [-80.5, 37.5]; central Sahara [9.0, 25.5] (taken from the Tassili
  n'Ajjer entry, standing for "North Africa" in the source); Hamersley iron beds [118.4, -22.5] (Karijini National
  Park). All other coordinates are those given on the Wikipedia page of the place. Wikipedia's coordinates for the
  Maotianshan Shales are plainly wrong (154.3 E), so Chengjiang's [102.98, 24.67] is used.
- The Jack Hills zircon and its three events share one point; "first eukaryotes" is tied to one fossil area although
  fossils of similar age occur elsewhere.
- Rhynie chert age: Wikipedia says "about 410 million years ago"; radiometric dates near 407 Ma exist but I did not
  open one.
- Mistaken Point: "575 to 560" and the 565 ± 3 Ma ash come from Wikipedia "Mistaken Point Formation"; the UNESCO
  page could not be opened.
- Ediacara Hills "c. 555" is by correlation with the dated White Sea rocks (Martin et al. 2000), not a date from the
  hills themselves.
- Zachełmie trackways: "almost 400 million years" and "about 18 million years older than the earliest tetrapod body
  fossils" are from the Nature abstract and summary; later doubts about the track-makers were not checked.
- "Algeo and Scheckler" as authors of the land-plant hypothesis: the Europe PMC record gives the title and DOI but no
  author list.
- Variscan dates ("c. 380 to 290") are a hedged reading of "began in the Devonian ... to form Pangaea" (Wikipedia)
  and a BGS memoir summary seen only in search results.
- Vredefort asteroid size (20–25 km, 2022 estimate; older estimate 10–15 km) and crater width (170–300 km) are as
  given in Wikipedia; no Earth Impact Database page was opened.
- The Late Heavy Bombardment is not shown as an event; Wikipedia describes it as "hypothesized" and doubted.
- The first beetles (Permian unit) rest on Wikipedia "Beetle" (oldest known beetle Coleopsis, earliest Permian),
  which is not in that unit's source list because of the 8-source cap.

## Counts
- Units: 17 (evidence: geology 8, fossil 9).
- Events: 50 (evidence: geology 19, disputed 18, fossil 12, genetic 1; kinds: continents 13, fossil-site 11, life 10,
  climate 5, impact 3, rock 3, extinction 3, planet 1, volcanism 1).
- Distinct source URLs: 170.


## Correction (2026-11-21)

- `burgess-shale`: removed "almost a metre long" for Anomalocaris. Current estimates give a body of about 34 to 38 cm, and Wikipedia calls the 1 m figure unlikely (flagged by the Cambrian story research, content/factcheck/prehistory-story-cambrian.md). The text now says it was one of the largest animals of its time.
