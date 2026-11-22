# Prehistory visuals: curves and pictures (source and licence log)

Checked on 21 November 2026. Covers `content/prehistory/curves.json` (9 curves) and `content/prehistory/images.json`
(140 pictures). Raw downloads are in `data/prehistory/raw/` (one folder per source; picture thumbnails in `raw/img/`).
Every licence line below was read on the page or file named, on the day of checking.

Format note for `curves.json`: besides the fields in the brief, some curves carry an extra `band` list of
`[ma, low, high]` (the uncertainty range that goes with `points`), `marine-genera` carries `artefactYoungerThan`
(see below) and `deep-sea-oxygen-isotopes` carries `invertAxis`. `oxygen-precambrian` has no single value, so its
`points` are `[ma, low, high]`. Points are sorted oldest first.

## Part A: curves

### 1. Global average temperature (`temperature`): delivered
- **Chosen:** Judd et al. (2024), "A 485-million-year history of Earth's surface temperature" (PhanDA), Science 385,
  eadk3705. 85 stage values with 5th to 95th percentile band, 486.85 Ma (base of the Tremadocian) to the Holocene.
- **File:** `5_Outputs/PhanDA_GMSTandCO2_percentiles.csv` in https://github.com/EJJudd/PhanDA (the paper's data
  statement: "files containing the GMST, CO2, and LTG values presented in this paper, are available on GitHub").
- **Licence evidence:** the repository `LICENSE` file opens "Attribution 4.0 International"; GitHub reports the
  licence as CC-BY-4.0; the README carries a "License: CC BY 4.0" badge. The Science article itself is not open
  access; only the data file is used.
- **Why this one:** newest, combines proxy data with climate models, gives an honest uncertainty band, and is the
  only candidate with a clearly open data file.
- **Candidates not used:** Scotese et al. (2021), Zenodo 8238875 (CC BY 4.0, checked): an older, partly hand-drawn
  curve that PhanDA supersedes; not mixed in. Westerhold et al. (2020) CENOGRID: the open file holds oxygen isotope
  values, not temperatures. Turning them into degrees needs the equations of Hansen et al. (2013), which I could not
  read reliably (they are images in the open full text), so I did not convert. The isotope record is delivered as it
  is, as a separate extra curve (9 below).
- **Caveats:** one value per geological stage (85 points, fewer than the 100 asked for; that is the record's real
  resolution). Short events do not show. The band is wide before 250 Ma. The Holocene value (14.0 °C) is the
  pre-industrial average.

### 2. Carbon dioxide (`co2` and `co2-fine`): delivered as two separate curves, not to be joined
- **`co2` (recommended):** the CO2 columns of the same PhanDA file, 85 stage values with band. Judd et al. (2024),
  Fig. 4 caption: "The CO2 reconstruction is largely based on the data from Foster et al. (2017) in the Paleozoic and
  Mesozoic, and the data from Rae et al. (2021) in the Cenozoic." Licence as for curve 1 (CC BY 4.0). Chosen as the
  main curve because it shares its time steps with the temperature curve and uses newer Cenozoic data.
- **`co2-fine`:** Foster, Royer & Lunt (2017), Nature Communications 8, 14845, Supplementary Data 2 ("LOESS Fit",
  840 rows, 0.5 Myr steps, 420 Ma to today), thinned to 310 points (every row to 66 Ma, every fourth before).
  Licence line on https://www.nature.com/articles/ncomms14845 : "This work is licensed under a Creative Commons
  Attribution 4.0 International License." The band is the 68% range. Caveat: later work (CenCO2PIP 2023) puts Eocene
  CO2 well above this line.
- **Candidate not delivered as a curve:** CenCO2PIP Consortium (2023), Science 382, eadi5177. The vetted proxy
  estimates are open (Zenodo 10.5281/zenodo.14537923, CC BY 4.0, checked) but they are per-study spreadsheets; the
  paper's 500,000-year mean curve is in the Science supplement, which is not openly licensed. Binning the raw
  estimates myself would be new analysis, so it was left out.
- **Caveat for both:** the youngest value is pre-industrial (about 276 ppm), not today's.

### 3. Oxygen (`oxygen` and `oxygen-precambrian`): delivered as two curves
- **`oxygen` (541 Ma to today):** Mills, Krause, Jarvis & Cramer (2023), Annual Review of Earth and Planetary
  Sciences 51, 253-276, Figure 6 consensus curve with minimum and maximum. File `Mills_etal_2023_AREPS_O2.xlsx` from
  the lead author's repository https://github.com/bjwmills/AREPS_2023_O2_estimate (README: "Data from Figure 6 in
  Mills et al. (2023) in Annual Reviews"). 542 rows thinned to 272.
  **Licence, with a doubt:** the article is CC BY 4.0 according to the Crossref record for DOI
  10.1146/annurev-earth-032320-095425 (licence URL http://creativecommons.org/licenses/by/4.0/). The GitHub
  repository itself has no licence file, and the publisher's page refused automated access, so I could not read the
  licence line on the article page. I treat the figure data as covered by the article's CC BY 4.0; a human check of
  the article page is advised.
- **`oxygen-precambrian` (4000 to 541 Ma):** six range points, not a data file. Built from numbers stated in the
  text of Chen et al. (2022), Nature Communications 13, 5862 (CC BY 4.0, licence line read on the article page):
  "very low (<10^-7 to 10^-5 of the present atmospheric level [PAL]) for the first half of Earth history", "from
  10^-9 to 10^-5 PAL pre-GOE and 10^-4 to 10^-1 PAL during the 'boring' billion interval from ~2.0 to 1.0 Ga and
  10^-1 to ~1 PAL from ~0.5 Ga to present". Cross-checked with Kasting & Ji (2025), Phil. Trans. R. Soc. B (CC BY
  4.0): "10^-5 PAL is commonly quoted as an upper limit on atmospheric O2 levels during the Archean" and Proterozoic
  "estimates range approximately from 10^-4 PAL to 0.1 PAL", and with Lyons et al. (2021), Astrobiology (CC BY 4.0):
  the second rise came "between 800 and 600 million years ago". Converted to percent of the air by multiplying PAL
  by 20.95.
- **Candidates not used:** Lyons et al. (2014), Nature: the classic figure, not openly licensed; its numbers are
  taken from the open papers above that restate them. Krause et al. (2018), Nature Communications (CC BY 4.0): data
  only "from the corresponding author upon request". Chen et al. (2022) also offer a machine-learning oxygen curve
  for 4 billion years (Zenodo 10.5281/zenodo.7042193); it is a single new method, so I used only the consensus
  ranges it quotes.
- **Caveats:** the Precambrian shape between the six points is schematic and the limits are contested (Kasting & Ji
  argue for about 0.1 PAL in the mid-Proterozoic; chromium-isotope work argues for under 0.001 PAL). The two oxygen
  curves do not meet at 541 Ma (the Phanerozoic band starts at 0.1 to 15%, the Precambrian range ends at 2 to 21%):
  they come from different methods and should be drawn as separate pieces.

### 4. Sea level (`sea-level`): delivered, coarse
- **Chosen:** Marcilly, Torsvik & Conrad (2022), "Global Phanerozoic sea levels from paleogeographic flooding maps",
  Gondwana Research 110, 128-142, Table 1, column "Modern land sea level ... Relative m", 53 values, 520 Ma to today
  in 10 Myr steps. Licence line on the article's first page: "This is an open access article under the CC BY license
  (http://creativecommons.org/licenses/by/4.0/)"; the Elsevier API record also gives
  http://creativecommons.org/licenses/by/4.0/. The numbers were read from the table in the PDF (open copy from the
  Norwegian research archive, reached through https://duo.uio.no/handle/10852/94891), not from a figure. Minus signs
  are a special glyph in the PDF and were restored (the column is negative only at 30 Ma, -2.88 m, and 10 Ma,
  -3.62 m). The values agree with the abstract (lowest about 210 Ma, peak about 280 m at 80 Ma).
- **Candidates not used:**
  - van der Meer et al. (2022), Gondwana Research 111, 103-121 (CC BY 4.0, checked): the curve is in Supplementary
    Table 1, which is only on the publisher's site; that site refused automated access, so the table could not be
    fetched. This would be the better curve (it includes ice volume); worth a manual download.
  - Miller et al. (2020), Science Advances 6, eaaz1346 (last 66 Ma): the article is CC BY-NC (Europe PMC licence
    field), and the NOAA copy of the data carries only a citation request, no open licence. Not allowed; left out.
  - Haq et al. (1987) and Haq & Schutter (2008): Science, not openly licensed; no open data file found.
  - Franziskakis et al. (2025), PANALESIS model (Zenodo 10.5281/zenodo.15396265, CC BY 4.0): 44 values, downloaded
    to `raw/panalesis/` and looked at. Not used: a conference-paper model whose curve differs strongly from the
    others (for example about +200 m in the Triassic).
  - Spratt & Lisiecki (2016), Climate of the Past (article CC BY 3.0): the last 800,000 years of ice-age sea level.
    The data file sits at NOAA without an explicit licence, so it was not taken. It would be the right source if
    the page later wants the ice-age swings.
- **Caveats:** 10 Myr steps hide the ice-age swings of about 120 m. Flooding-based sea level is uncertain by many
  tens of metres and runs higher than strontium-based estimates in the Paleozoic (the paper says so itself). There
  is no finer open curve for the last 66 Ma in this delivery.

### 5. Marine biodiversity (`marine-genera`): delivered
- **Chosen:** Paleobiology Database, data service 1.2, one call:
  `https://paleobiodb.org/data1.2/occs/diversity.txt?base_name=Metazoa&count=genera&time_reso=stage&envtype=marine&datainfo&rowcount`
  (1,092,300 occurrences, 98 stages, Fortunian to Late Pleistocene). Value = X_Ft + X_bL + X_FL + X_bt (all genera
  known or implied in the stage).
- **Licence evidence:** the response header reads "Data License: Creative Commons CC0", licence URL
  https://creativecommons.org/publicdomain/zero/1.0/.
- **Mass extinctions visible:** end-Ordovician (Katian 2248 to Hirnantian 1219), Late Devonian (Givetian 1956 to
  Frasnian 1532 and on down), end-Permian (Changhsingian 1362 to Induan 832), end-Triassic (Norian 1669 to Hettangian
  1040), end-Cretaceous (Maastrichtian 2598 to Danian 2152).
- **Candidates not used:** Sepkoski's compendium (online copy has no stated licence); Alroy et al. (2008), Science
  (sampling-standardised curve, not openly licensed).
- **Caveats:** raw counts, not corrected for how much rock has been searched, so stage-to-stage wiggles partly track
  sampling. The fall after about 12 Ma is an artefact (the database holds fossils only, so living genera without
  young fossils drop out); `artefactYoungerThan: 11.63` marks where to fade or cut the line. The Pridoli has no
  stage in the database. Stage dates are the database's own and differ slightly from the 2024 ICS chart.

### 6. Length of day (`day-length`): delivered, 11 points
- **Chosen:** Zhou et al. (2022), Geophysical Research Letters 49, e2022GL098304, Supporting Information Table S4
  ("Length of Day [h]"): ten rock sections from about 2465 Ma (17.18 h) to about 55 Ma (23.80 h), with their
  plus-or-minus; present day (24.0 h) added by hand.
- **Licence evidence:** figshare record https://doi.org/10.6084/m9.figshare.19225245 , licence field "CC BY 4.0"
  (read through the figshare API). The values were read from the table in the .docx, not from a figure.
- **Candidates not used:** Mitchell & Kirscher (2023), Nature Geoscience: not open access and no open data file
  found. Zhou et al. (2024), Science Advances, figshare 10.6084/m9.figshare.24910674 (CC BY 4.0): the file holds raw
  rock measurements, not day lengths.
- **Caveats:** Table S4 mixes the authors' own results with five earlier studies they compiled. Lucaogou (about
  269 Ma) has two values (22.41 h used; 22.78 h by another method). Ages are approximate. Mitchell & Kirscher (2023)
  argue the day stalled at about 19 and a half hours for roughly a billion years in the mid-Proterozoic (their paper
  is not open, so this is from its published summary, not re-read here); with only one point between 2465 and
  655 Ma this record cannot test that, so do not draw a confident smooth curve through the gap.

### 7. Optional curves: not delivered
- **Sun's brightness:** the standard formula is Gough (1981), Solar Physics 74, 21 (not open): luminosity relative
  to today = 1 / (1 + 0.4 × (1 − t / 4.57)), with t in billions of years since the Sun formed (about 70% at the
  start, rising steadily). I found no openly licensed data table, so no curve is in the file. Open papers confirm
  the size of the change in words only: "the Sun's luminosity has increased by nearly 30%" (Byrne et al. 2026, Space
  Science Reviews, CC BY 4.0) and "~4.2% increase in solar irradiance since the beginning of the Ordovician" (Judd
  et al. 2024). The formula as written here is from memory and should be checked against Gough's paper before use.
- **Large impacts:** the Earth Impact Database is not openly licensed. A Wikidata (CC0) query returned only 65
  craters, most without an age, and it includes unconfirmed structures; too thin to draw. Left out.

### 8. Extra curve: deep-sea oxygen isotopes (`deep-sea-oxygen-isotopes`)
- Westerhold et al. (2020) CENOGRID, PANGAEA dataset 10.1594/PANGAEA.917717, column `ISOBENd18oLOESSsmooth`, thinned
  from 23,629 rows to 395 (denser toward the present). File header: "License: Creative Commons Attribution 4.0
  International (CC-BY-4.0)".
- Not asked for by name; added because it is the detailed open record of the last 66 million years (the Eocene
  warmth, the freezing of Antarctica at 34 Ma, the ice-age wiggles). It is a proxy that mixes deep-sea temperature
  and ice volume, in per mil, lower = warmer; draw it with the axis inverted and do not label it in degrees.

## Part B: pictures

140 pictures, all from Wikimedia Commons, all found and described through the Commons API. Every one was opened and
looked at (960 px thumbnail) before being listed. Licence, author and size are as the API returned them. `image` is
the 1280 px thumbnail (or the original file where it is narrower than 1280 px), and every `image` URL was checked
with a HEAD request (see the end of this file).

### Subjects with no good open picture
- **Titanoboa:** nothing usable. The only candidate, a photo of a park sculpture, was dropped (sculptor's
  permission unverified, and France has no freedom of panorama).
- **Moon-forming impact:** no open picture of the impact itself. `moon-forming-impact-nasa` is NASA/JPL-Caltech's
  public domain painting of a similar collision at the star HD 172555, used as a stand-in; the note says so.
- **Eoraptor:** no acceptable life reconstruction; only a photo of skeleton casts with Herrerasaurus.
- **Juramaia:** nothing usable. Early mammals are covered by Morganucodon and Repenomamus.
- **Eohippus by that name:** covered by Sifrhippus (the oldest horse), a Messel Propalaeotherium skeleton and
  Knight's 1931 Orohippus mural.
- **Ambulocetus:** only a museum photo of a skeleton cast with an older model; Pakicetus and Basilosaurus are better.
- **Lystrosaurus, Tyrannosaurus rex and Triceratops as life reconstructions:** only middling ones (quality 3); the
  better-looking open ones are tagged inaccurate on Commons. The skeleton photos (Sue, Triceratops) are stronger.
- **Ammonite alive:** fossils only.
- **Snowball Earth rocks** (dropstones, cap carbonates): only dull close-ups; one globe render is included, and it
  was drawn for the older Huronian glaciation.
- **Devonian first forests, a painted coal forest, a Paleocene life scene, a Triassic sea scene, Purgatorius:** none
  under an allowed licence. The coal forest is covered by three good museum diorama photos. A very good Purgatorius
  painting (File:Purgatorius PNAS.jpg) is "Attribution" only, which is not one of the four licences allowed.

### Licences I was unsure about
Kept, with the reason:
- `mosasaur-tylosaurus-atuchin`: Commons still lists it under "License review needed". I checked the stated source
  myself: DataCite gives the Zenodo record 10.5281/zenodo.20412621 the rights "Creative Commons Attribution 4.0
  International". Kept.
- `miocene-europe-landscape`, `pliocene-europe-landscape`, `last-glacial-europe` (Márton Zsoldos): taken from
  Czyżewski et al. (2026), Biological Conservation 316, 111749. The Elsevier record for DOI
  10.1016/j.biocon.2026.111749 gives the user licence http://creativecommons.org/licenses/by/4.0/. Kept.
- US National Park Service and Bureau of Land Management art tagged public domain on Commons, painted by named
  artists who may have been contractors: `clarno-nut-beds-mural` (Larry Felder), `turtle-cove-mural` (Roger Witter;
  the Commons page also carries CC BY 2.0 from the BLM's own Flickr upload), `jurassic-morrison-mural-nps` (Bob
  Walters and Tess Kissinger; in "Images from NPGallery to check"), `cretaceous-colorado-river-scene` (Benji
  Paysnoe), `coelophysis-martz`. Commons accepts them; a cautious publisher might ask the parks.
- `dickinsonia-fossil`: source line "Own work assumed". Long-standing, widely used file.
- `neanderthal-nhm`: a visitor's photo of a museum model in London; UK law allows photos of sculpture on permanent
  public display.
- Charles R. Knight paintings (`knight-world-before-life`, `uintatherium-orohippus-knight`, `miocene-plains-knight`,
  `woolly-mammoths-knight`, `la-brea-knight`): public domain in the US by Commons tags; Knight died in 1953.
- `darwinius-ida`: Commons states CC BY-SA 2.5 for this crop of a figure from a CC BY 2.5 article.

Dropped because of licence doubt: `titanoboa-model`; `lucy-model` (indoor photo of a copyrighted sculpture in
Germany); `jack-hills-zircons` (public domain claim rests on a NASA report reprinting university researchers'
images); the USGS "Trek Through Time" posters (art credited "Courtesy of Masato Hattori"); `File:Hadean planet.jpg`
(unclear source).

### Accuracy flags on pictures that are in the list
- `chicxulub-impact-davis` (NASA, Donald E. Davis, public domain) is in the Commons category "Inaccurate paleoart"
  because its pterosaurs look like Pteranodon, which died out long before the impact. It is the only good open
  picture of the impact and is kept with that caveat in its `note`. Remove it if that tag should be a hard rule.
- The four Knight paintings and a few museum dioramas are older reconstructions; their notes say what is dated.
- `griffinfly-fossil-arctotypus` has "Meganeura" in its file name but shows a Permian relative; do not caption it
  Meganeura.
- `shark-bay-stromatolites` and `hamelin-pool-stromatolites-panorama` show living stromatolites, filed under
  proterozoic.
- Gory scenes: `triassic-prestosuchus-riverbank`, `jurassic-mygatt-moore-dry-season`, `moschorhinus-lystrosaurus`.

### Display notes
- `credit` is the author text exactly as Commons gives it. Some are long or contain e-mail addresses or web
  addresses (`archaeopteryx-berlin-specimen`, `deinonychus-willoughby`, `jurassic-morrison-diplodocids`,
  `permian-lakeshore-karoo`, `marble-bar-banded-chert` and others); shorten for display but keep the name.
- A few paintings carry a small signature in a corner; none has an overlay watermark.
- Very wide banners: `jurassic-morrison-mural-nps`, `clarno-nut-beds-mural`, `cretaceous-dinosaur-park-panorama`,
  `rhamphorhynchus-flock`. Portrait format: `anomalocaris-fossil`, `hallucigenia-on-sponge`,
  `archaeopteryx-berlin-specimen`, `darwinius-ida`, `lucy-skeleton`, `neanderthal-mr-n`, `neanderthal-nhm`,
  `chicxulub-crater-radar`, `triassic-bulgo-sandstone-landscape`.
- Under 1280 px wide (original file used): `cambrian-sea-linyi` (1269), `darwinius-ida` (1118), `sifrhippus-early-horse`
  (1041), `lucy-skeleton` (1000), `neanderthal-mr-n` (1171), `neanderthal-skull` (1098).
- 19 more pictures were viewed and passed the licence check but were left out to stay within 140 (mostly second
  views of the same subject or quality 3), and 13 Cenozoic spares were held back earlier (Gastornis, Hyaenodon,
  Livyatan, woolly rhinoceros and others). They can be added back if more are wanted.

## Validation
- `curves.json` and `images.json` both parse with `json.load`.
- Curves: 9, each with points sorted oldest first; value ranges checked for plausibility, and sea level and oxygen
  against their papers' abstracts (temperature 11 to 36 °C, CO2 239 to 3326 ppm, oxygen 1.8 to 37% within the band, sea level -4 to 304 m, genera
  139 to 3978, day 17.2 to 24 h).
- Images: 140, ids unique, pages unique, every unit and type value from the allowed lists.
- Every `image` URL returned HTTP 200 to a HEAD request (140 of 140), checked at one request per 2.2 seconds;
  Wikimedia answered some requests with 429 first and 200 on the retry 20 seconds later.
- By unit: hadean 2, archean 5, proterozoic 5, ediacaran 3, cambrian 8, ordovician 3, silurian 4, devonian 6,
  carboniferous 4, permian 8, triassic 9, jurassic 16, cretaceous 23, paleocene 2, eocene 9, oligocene 4, miocene 6,
  pliocene 4, pleistocene 14, holocene 5.
- By type: scene 56, reconstruction 40, fossil 31, landscape 9, rock 4.

## More pictures (round 2)

Checked on 21 November 2026. 134 new pictures in `content/prehistory/images-more.json` (same schema as
`images.json`; no Commons file or id repeats anything in `images.json`). All from Wikimedia Commons, metadata
(licence, author, size, maintenance categories) read through the Commons API; every picture was downloaded as a
thumbnail into `data/prehistory/raw/img/` and looked at before it was listed. Credits are short names; where the
stated author was a username that is known to be a person's account, the name is used (for example `ДиБгд` is
written "Dmitry Bogdanov").

**Image widths.** Wikimedia now serves thumbnails only at fixed widths (a 1600 px request returns HTTP 400). `image`
is the 1920 px thumbnail when the original is at least 1920 px wide, else the 1280 px one, else the 960 px one; a file
narrower than 960 px (`cooksonia-pertoni-render`, 900 px) uses the original file. Multi-page TIFFs use the
`lossy-page1-1920px-…jpg` form.

### Counts per unit (before, then after both files)
| unit | before | new | after |
|---|---|---|---|
| hadean | 2 | 10 | 12 |
| archean | 5 | 11 | 16 |
| proterozoic (incl. paleoproterozoic 2, mesoproterozoic 2) | 5 | 7 | 12 |
| ediacaran | 3 | 9 | 12 |
| cambrian | 8 | 5 | 13 |
| ordovician | 3 | 10 | 13 |
| silurian | 4 | 10 | 14 |
| devonian | 6 | 7 | 13 |
| carboniferous | 4 | 8 | 12 |
| permian | 8 | 8 | 16 |
| triassic | 9 | 5 | 14 |
| jurassic | 16 | 0 | 16 |
| cretaceous | 23 | 0 | 23 |
| paleocene | 2 | 11 | 13 |
| eocene | 9 | 3 | 12 |
| oligocene | 4 | 9 | 13 |
| miocene | 6 | 6 | 12 |
| pliocene | 4 | 8 | 12 |
| pleistocene | 14 | 0 | 14 |
| holocene | 5 | 7 | 12 |

By type (new only): scene 45, landscape 34, reconstruction 28, fossil 19, rock 8. Quality: 5 for 5 pictures, 4 for
47, 3 for 78, 2 for 4. No `tonian` or `cryogenian` picture: see below.

### How the oldest units were filled
Hadean and Archean have no life scenes, so they use space-agency art (NASA Goddard's early-Earth panorama, NASA/JPL's
colliding planets, ESO's protoplanetary disc, NASA's "pale orange dot"), Apollo 17's cratered lunar highlands, a
Kīlauea lava lake and a deep-sea eruption (USGS, NOAA) as modern analogues, the oldest rocks (Acasta Gneiss, Isua
banded iron, komatiite, pillow lava, Barberton and Hamersley banded iron) and living stromatolites and microbial mats
(Lake Thetis, Shark Bay, Yellowstone). Every present-day photo says "today" or "modern analogue" in its caption.

### Subjects I could not find (or could not use)
- **Snowball Earth rocks, Tonian and Cryogenian:** still nothing good. The Elatina diamictite (`File:Elatina Fm
  diamictite.JPG`, CC BY-SA 3.0) and the Konnarock dropstone could not be downloaded for viewing (Wikimedia
  rate-limited them) or were too dull; the NSF "Evidence hints at global glaciation" and the Hoffman lecture slide are
  diagrams/text. No `tonian`/`cryogenian` picture was added.
- **Hadean surface art:** no openly licensed painting of a magma ocean or the Theia impact itself beyond those
  already used. `File:Early Earth.jpg` is a 1080 px AI-upscaled render (tagged so on Commons): not used.
- **Devonian forest scene:** none. Only an old blurry Riou engraving (`Devonianscene-green.jpg`) and a Retallack
  Prototaxites painting (a contested interpretation); not used. The Gilboa fossil stump (`gilboa-stump`, quality 2) is
  the only "first forest" picture.
- **Paleocene life scene:** still none. The Paleocene is covered by badlands landscapes (North Dakota, Zumaia), a
  1917 Gastornis drawing and mammal cut-outs. `File:Ectoconus restoration.png` is "No restrictions" (Flickr), not one of
  the four allowed licences: not used. NPS "Paleontology" line drawings (Plesiadapis, Champsosaurus) carry a heavy
  title frame: not used.
- **Pliocene hominin scene:** none. The Selam model photo (California Academy of Sciences) and the Gurche Paranthropus
  model photo (Smithsonian) are photos of sculptures in the United States, which has no freedom of panorama for 3D
  works: left out for licence doubt, as `lucy-model` was in round 1.
- **Holocene life scenes:** no open painting of the green Sahara; covered by the Ounianga lakes, Saharan rock art,
  Göbekli Tepe, the dodo and a 1928 thylacine photo.
- **Rejected as inaccurate (tagged "Inaccurate paleoart" on Commons):** `Dunkleosteus terrelli 2023 reconstruction.png`,
  `Muschelkalk marine ecosystem habitat diorama…`, `Reconstruction drawing of Titanis walleri.png`, `Faune d'Ediacara.jpg`,
  `Cameroceras attaquant Megalograptus.jpg`, `Tiktaalik hunting prey.jpg`, `Diorama of an Ediacaran seafloor`, and
  `Life in the Ediacaran sea.jpg`.
- `File:Dickinsonia - Ediacaran Fossil from Flinders Range in South Australia.jpg` carries "License review needed":
  not used. `File:European landscapes from the Miocene to the Holocene.jpg` also carries it: not used.

### Licence doubts
- **Museum dioramas and models photographed in the United States** (James St. John's Silurian, Ordovician, Devonian,
  Carboniferous and Permian diorama photos, `burgess-diorama-aysheaia`, `ediacaran-diorama-nmnh`): the photos are CC BY
  2.0 or CC0, but the US has no freedom of panorama for sculpture, so the diorama makers might hold rights. Commons hosts
  them, and round 1 already used the same series; a cautious publisher could swap them out.
- `meganeura-model-muse`: author Matteo De Stefano/MUSE, with VRTS permission confirmed on Commons. Fine.
- US government art tagged public domain: `rattlesnake-formation-mural` (Roger Witter, for the John Day Fossil Beds),
  the Horsfall drawings (published before 1930), `paraceratherium-herd-1923`, the Knight paintings
  (`silurian-knight-shore`, `dinictis-protoceras-knight`, `pliocene-knight-mural`; Knight died 1953) and
  `gastornis-1917`.
- `lunar-cataclysm-bombardment` (CC BY-SA 3.0): the file page asks to "credit Tim Wetherell - Australian National
  University"; credit is given as Tim Wetherell.
- `marjum-biota-scene`: CC BY 4.0 figure from a paper; the painting is by Holly Sullivan, credited.
- `shark-bay-stromatolites-underwater` is from a CC BY 4.0 book chapter by Ed Landing and Markes E. Johnson.
- `thylacine-hobart-1928`: public domain (Australian photo, 1928, author Harry Burrell); fine on Commons.
- `isthmus-of-panama-satellite`, `kanapoi-from-space`, `ounianga-lakes-iss`, `apollo-17-lunar-highlands`: NASA, public
  domain.

### Scientific notes worth knowing
- `lunar-cataclysm-bombardment`: the "late heavy bombardment" spike is now doubted; noted.
- `pale-orange-dot-archean`: the Archean haze is a hypothesis; noted.
- `strelley-pool-stromatolite-slab`, `grypania-fossils`, `kimberella-*`, `spriggina-tyrrell`, `nesonektris`,
  `andrewsarchus`: identities or biology still debated; each note says so.
- `isthmus-of-panama-satellite`: closure date debated (most say about 3 million years ago).
- Old paintings (Knight, Horsfall, Rungius Fulda) are flagged as dated in their notes.

### Credit clean-up in `images.json`
Shortened 24 credit strings (e-mail addresses, web addresses, "Creator:" prefixes and long author lists), nothing else
changed: `marble-bar-banded-chert`, `snowball-earth-globe`, `fractofusus-seafloor`, `rhamphorhynchus-flock`,
`cambrian-sea-linyi`, `eurypterus-fossil`, `eurypterus-swimming`, `hyneria-devonian-river`,
`triassic-coelophysids-landscape`, `paraceratherium-scene`, `permian-lakeshore-karoo`, `moschorhinus-lystrosaurus`,
`plesiosaurus-bogdanov`, `ichthyosaur-temnodontosaurus-hunting`, `archaeopteryx-berlin-specimen`,
`deinonychus-willoughby`, `jurassic-morrison-diplodocids`, `jurassic-mygatt-moore-dry-season`,
`cretaceous-gobi-azhdarchids-scene`, `triceratops-skeleton-la`, `darwinius-ida`, `arsinoitherium`,
`diprotodon-skeleton`, `glyptodon`.

### Validation (round 2)
- Both files parse with `json.load`; 274 ids unique across both files; 274 Commons pages unique; every `unit` and
  `type` from the allowed lists; every licence public domain, CC0, CC BY or CC BY-SA.
- Every `image` URL in `images-more.json` returned HTTP 200 to a HEAD request (134 of 134), at one request every 3 to
  4 seconds. Wikimedia answered many first requests with 429 (thumbnails not yet in its cache); those were retried
  later in the run and all came back 200.
