# Fact-check log: story "How humans evolved" (content/prehistory/stories/humans.json)

Researched 2026-11-21. Every claim in the chapter texts, site notes and evidence notes was checked against a page
that was actually opened (the chapter's `sources`). Paper abstracts were read through the Europe PMC REST service
(the long `ebi.ac.uk/europepmc/webservices/rest/search?query=DOI:...` URLs, the same form origins.json already uses),
because nature.com, pnas.org, pubmed and pmc pages refused automated requests. Those URLs return the paper's
title, authors, journal and abstract as JSON.

## Chapters (16, oldest first)

| # | id | date (ma) | anchor | evidence | refs |
|---|---|---|---|---|---|
| 1 | first-upright-apes | 7.0 | Toros-Menalla, Chad | disputed | o:hominins, e:grasslands-spread |
| 2 | lucys-kind | 3.66 | Laetoli, Tanzania | archaeology | o:australopiths |
| 3 | first-stone-tools | 3.3 | Lomekwi 3, Kenya | disputed | none |
| 4 | first-of-our-genus | 2.8 | Ledi-Geraru, Ethiopia | archaeology | o:homo |
| 5 | homo-erectus | 2.04 | Drimolen, South Africa | archaeology | o:homo |
| 6 | out-of-africa | 1.8 | Dmanisi, Georgia | archaeology | o:homo |
| 7 | java-and-china | 1.3 | Sangiran, Java | archaeology | o:homo |
| 8 | atapuerca | 0.43 | Sima de los Huesos, Spain | archaeology | o:neanderthals |
| 9 | our-species | 0.315 | Jebel Irhoud, Morocco | archaeology | o:homo-sapiens |
| 10 | many-kinds-of-humans | 0.3 | Rising Star cave, South Africa | disputed | none |
| 11 | denisovans | 0.2 | Denisova Cave, Siberia | genetic | none |
| 12 | island-humans | 0.1 | Liang Bua, Flores | disputed | none |
| 13 | across-the-sea-to-sahul | 0.065 | Madjedbebe, Australia | disputed | none |
| 14 | meeting-neanderthals | 0.045 | Ilsenhohle, Ranis, Germany | genetic | o:neanderthals, o:homo-sapiens |
| 15 | last-neanderthals | 0.04 | Gorham's Cave, Gibraltar | disputed | o:neanderthals |
| 16 | into-the-americas | 0.013 | Blackwater Draw, New Mexico | disputed | e:last-glacial-maximum, e:megafauna-extinctions |

### Agreement with origins.json / events-b.json
- `o:hominins`: origins dates the human line to c. 4.2 Ma (oldest undisputed biped, Kanapoi) with a claim at 7 Ma
  (Sahelanthropus). Chapter 1 sits at 7 Ma and is labelled `disputed`, matching origins' `claimMa` 7 and its account
  of the 2020 / 2022 / 2024 / 2026 bipedalism studies. The "between about 13 and 5 million years ago" DNA range in
  chapter 1 is origins' `clockMa` [5, 13] and its text.
- `o:australopiths`: 4.2 Ma Kanapoi (A. anamensis) is used as a site in chapter 2 with origins' coordinates.
- `o:homo`: 2.8 Ma LD 350-1 at Ledi-Geraru with origins' coordinates [40.87, 11.37].
- `o:neanderthals`: 430,000 years (Sima de los Huesos) and an end c. 40,000 years ago (chapter 15: 41,000-39,000,
  Higham et al. 2014) agree.
- `o:homo-sapiens`: 315,000 years (Jebel Irhoud, 315 +/- 34 ka) and Omo Kibish >= 233,000 agree. The brief said
  "c. 300,000"; I used 315,000 to match origins and the dating paper.
- `e:grasslands-spread` (7-6 Ma) is cited from chapter 1 because its text links the C4 grassland spread to the
  first upright apes. `e:last-glacial-maximum` (26,500-19,000) and `e:megafauna-extinctions` (50,000-10,000) are
  cited from chapter 16: Beringia exposed by low seas, White Sands footprints (23,000-21,000) during the LGM next to
  megafauna tracks, Clovis mammoth hunting. Their dates agree with the chapter.
- `e:younger-dryas` (12,900-11,700) is NOT referenced: the last chapter is dated 13,000 years ago (Clovis,
  13,050-12,750) and its text does not mention the cold snap; adding a sentence would have broken the 5-sentence
  limit. The page can still show it on the timeline.

## Recent findings checked (last 5 years) and used
- Sahelanthropus bipedalism: Williams et al. 2026 (Science Advances) for; Cazenave et al. 2024/2025 (JHE) against.
- Ledi-Geraru: Villmoare et al. 2025 (Nature): Homo at 2.78 and 2.59 Ma, an unnamed Australopithecus at 2.63 Ma.
- Nyayanga: Plummer et al. 2023 (Science), oldest Oldowan c. 2.9 Ma (via the Max Planck press release).
- Sima del Elefante face ATE7-1, 1.4-1.1 Ma: Huguet et al. 2025 (Nature).
- Harbin cranium identified as Denisovan by proteins and mtDNA: Fu et al. 2025 (Science; Cell).
- Mata Menge humerus: Kaifu et al. 2024 (Nature Communications), floresiensis line small since c. 700 ka.
- Homo naledi burial: Berger et al. 2025 (eLife) versus Martinon-Torres et al. 2024 (JHE).
- Neanderthal admixture timing: Sumer et al. 2025 (Nature, Ranis genomes, 45-49 ka); Iasi et al. 2024 (Science,
  50,500-43,500).
- Sahul arrival: Gandini et al. 2025 (Science Advances, mtDNA, c. 60 ka) via the University of Southampton release.
- White Sands: Pigati et al. 2023 (Science) and Springer et al. 2026 (Science Advances, 23.5-21.7 ka).
- Monte Verde: Surovell et al. 2026 (Science) argue it is mid-Holocene, not 14,500 years old.
- Sangiran: Matsu'ura et al. 2020 (Science), c. 1.3 Ma, no earlier than 1.5 Ma (via EurekAlert).

## Disputed points (both sides)
1. **Sahelanthropus walked upright?** For: Daver et al. 2022 (Nature); Williams et al. 2026 (Science Advances).
   Against or unproven: Macchiarelli et al. 2020; Meyer et al. 2023; Cazenave et al. 2024 (JHE). Also Beauvilain
   argued the skull was surface-collected, which weakens the 7.2-6.8 Ma cosmogenic date (Wikipedia: Sahelanthropus).
   Whether Ardipithecus belongs to the human line is also argued (Sarmiento vs. most others; Wikipedia: Ardipithecus).
2. **Lomekwi 3 (3.3 Ma).** Harmand et al. 2015 (Nature): in situ artefacts in undisturbed sediment. Dominguez-Rodrigo
   and Alcala (PaleoAnthropology 2016; Journal of African Archaeology 2019) argue the artefacts may have moved from
   younger sediment down a slope (reported in Science News; the PaleoAnthropology page refused connection, so only
   the Science News account was read).
3. **Homo naledi burial** (must be disputed per PREHISTORY.md). Berger et al. 2025 (eLife): deliberate burial is the
   best explanation. Martinon-Torres, Garate, Herries and Petraglia 2024 (JHE): "No scientific evidence that Homo
   naledi buried their dead and produced rock art". The Smithsonian naledi page leaves it open. The engraving claim is
   not mentioned in the text.
4. **Origins of H. floresiensis and H. luzonensis** (must be disputed). Brown et al. 2004 and van den Bergh et al. 2016
   and Kaifu et al. 2024 favour dwarfed early Asian H. erectus; the alternative (descent from a small early Homo or
   late Australopithecus that left Africa by c. 2 Ma) is set out in van den Bergh et al. 2016's abstract and on the
   Smithsonian floresiensis page (which also names the Dmanisi-like ancestor option). Text says "still argued".
5. **Madjedbebe 65 ka** (must be disputed). Clarkson et al. 2017 (Nature): occupation from c. 65 ka by optical dating.
   O'Connell et al. 2018 (PNAS): an age >50 ka is "unlikely to be valid". Gandini et al. 2025 (mtDNA) supports
   c. 60 ka; the Southampton release itself notes many geneticists favour 45-50 ka. The route is labelled `disputed`.
6. **White Sands and pre-16,000-year American sites** (must be disputed). Bennett et al. 2021 (Science) 23-21 ka from
   Ruppia seeds; Madsen et al. 2022 comment: reservoir effects may make the dates too old; Pigati et al. 2023:
   pollen and OSL agree; Springer et al. 2026 refine to 23.5-21.7 ka. Wikipedia "Settlement of the Americas" still
   lists White Sands as debated, so the chapter is `disputed`.
7. **Monte Verde** (new, 2026). Surovell et al. 2026 (Science): a tephra c. 11,000 years old lies under the
   artefacts; the site is mid-Holocene (8,200-4,200 BP). Dillehay (excavator) rejects it; Stafford and Santoro
   found the argument convincing (National Geographic). Shown as a disputed site, not as the anchor.
8. **Paisley Caves** human coprolites c. 14,300: critics question DNA leaching and the identification of the
   coprolites (Wikipedia: Paisley Caves). Noted in the site note.
9. **Last Neanderthals.** Higham et al. 2014: Mousterian ended 41,030-39,260 cal BP across Europe. Finlayson et al.
   2006: Neanderthals at Gorham's Cave until 28 kyr BP (radiocarbon). Wood et al. 2013: southern Iberian late dates
   are unreliable (Zafarraya re-dated >= 10 ka 14C older). Chapter labelled `disputed`.
10. **Shangchen (2.12 Ma) older than Dmanisi.** Zhu et al. 2018 (Nature) by magnetostratigraphy; it implies an
    earlier exit from Africa. Not formally disputed in what I read, but it rests on tools only, no bones; worded "may".
11. **Sangiran first appearance.** Matsu'ura et al. 2020: c. 1.3 Ma (max 1.5); earlier work 1.7 Ma; other studies
    younger (1.3-0.6 Ma). Used 1.3.

## Left out, and why
- **Misliya and Apidima** (early H. sapiens outside Africa, c. 180 and 210 ka; must be disputed): left out to keep
  each chapter on one place and within 16 chapters. If added, they belong as disputed sites in "our-species".
- **Toba eruption**: not part of this story's steps; no chapter.
- **Neanderthal cave art** (Spanish U-series dates, disputed) and Neanderthal symbolism: left out; the Neanderthal
  chapters stay on mixing and disappearance.
- **Sulawesi and other Indonesian cave-art dates**: not about evolution; left for an art story.
- **Megafauna cause**: referenced via `e:megafauna-extinctions` (which already gives both sides); chapter 16 says only
  that Clovis people hunted mammoths, not that they caused extinctions.
- Australopithecus sediba, A. africanus, Paranthropus boisei as separate steps, H. antecessor's own chapter, Skhul and
  Qafzeh, Blombos and the "symbols" story, Bluefish Caves, Chiquihuite, Cooper's Ferry, Meadowcroft: left out for
  length; several are disputed and would need their own both-sides treatment.
- Grotte Mandrin (54 ka sapiens claim, disputed): left out.
- The Kalinga butchered rhinoceros (Luzon, 777-631 ka; Ingicco et al. 2018) was read but not pinned, to keep the
  island chapter to three sites.

## Routes drawn
1. `out-of-africa`: East Africa (1.9) -> Red Sea coast -> Sinai -> Levant -> Dmanisi (1.8). `archaeology`. Only the
   end point is a dated site; the start is dated by the earliest H. erectus in Africa (Smithsonian: c. 1.89 Ma) and
   the middle points are interpolated between them. There are no securely dated sites older than 1.8 Ma on the way
   (Ubeidiya is younger), so the corridor is schematic.
2. `java-and-china`: Dmanisi (1.8) -> Iran coast -> Attirampakkam (1.51) -> mainland SE Asia -> Sundaland -> Sangiran
   (1.3). `archaeology`. Dated points: Dmanisi, Attirampakkam, Sangiran; others interpolated.
3. `across-the-sea-to-sahul`: Bab-el-Mandeb (0.07) -> southern Arabia -> western India -> Sri Lanka -> Andaman Sea ->
   Sundaland -> Wallacea -> Madjedbebe (0.065). `disputed`. Dated by Madjedbebe's contested 65 ka; all intermediate
   dates are interpolated. If the short chronology is right the whole route shifts to c. 55-47 ka.
4. `meeting-neanderthals`: Sinai (0.052) -> Levant (0.05) -> Anatolia -> Bosporus -> Bacho Kiro (0.046) ->
   Pannonian plain -> Ranis (0.045). `archaeology`. Dated points: Bacho Kiro (before 45 ka) and Ranis (c. 45 ka);
   the Levant/Sinai dates are set from the admixture window (50,500-43,500, Iasi et al. 2024) and are not site dates.
5. `into-the-americas`: Beringia (0.025) -> Pacific coast -> White Sands (0.0225). `disputed`. Dated only by White
   Sands; the coastal route is one of two models (Wikipedia: Settlement of the Americas says the coast was open by
   c. 17-16 ka; earlier passage, as White Sands implies, is unexplained). Drawn as a broad schematic corridor.

## Coordinates
Verified on a page: Lomekwi 3, Olduvai, Dmanisi, Sangiran, Attirampakkam, Mauer, Jebel Irhoud, Omo Kibish, Kabwe,
Denisova Cave, Callao Cave, Madjedbebe, Bacho Kiro, Gorham's Cave, Zafarraya, White Sands National Park, Monte Verde
(Wikipedia coordinates); Baishiya Karst Cave, Shangchen, Blackwater Draw, Paisley Caves, Zhoukoudian (Peking Man),
Rising Star (Wikipedia text or map links); Toros-Menalla TM 266, Lukeino Formation, Aramis, Laetoli, Drimolen Main
Quarry, Kokiselei, Nariokotome, Gran Dolina, Liang Bua, Mata Menge, Harbin, Ranis (Paleobiology Database collection
records; the PBDB TM 266 point, 16.24 N 17.48 E, matches the 16 deg 15' N, 17 deg 29' E quoted from a 2005 PNAS paper); Kanapoi, Ledi-Geraru, Sima de los Huesos, Hadar (origins.json and Wikipedia).

Not verified exactly / approximate:
- **Laetoli**: Wikipedia's coordinates (2.996 S, 35.352 E) are the same as Olduvai Gorge's, although the article says
  Site G is 45 km south of Olduvai, so they look wrong. Used PBDB's Laetoli Locality 7 record (35.21 E, 3.22 S),
  which sits among the other Laetoli localities; Site G is Locality 8, whose PBDB latitude (-3.0125) looks like a
  typo. Accurate to a few km.
- **Bokol Dora 1**: no coordinates found; placed 3-4 km from LD 350-1 inside the Ledi-Geraru project area (schematic).
- **Sima del Elefante**: PBDB gives -3.313, 42.299, about 17 km from the other Atapuerca sites, which lie together in
  the railway trench; I used the Gran Dolina PBDB coordinates for both, since the two caves are neighbours in the
  same trench (approximate to under 1 km).
- **Nyayanga**: (34.45 E, 0.40 S) from a Wikipedia mirror seen in a search result, consistent with Mount Homa
  (0.38 S, 34.50 E); not confirmed on a page I opened.
- **Pestera cu Oase**: no coordinates found on an opened page; placed near Anina, SW Romania (approximate).
- **Harbin**: the PBDB record for Harbin is the city area; the exact find spot of the skull was not checked.
- **White Sands**: the park's centre; the footprint localities lie within the park's dune field edge (approximate).
- **Ranis**: PBDB "Galgenberg, Ranis" locality (town area); Ilsenhohle is under Ranis castle, within about 1 km.
- **Focus points** equal the anchor site's coordinates.

## Pictures
32 new images (all from Wikimedia Commons) and 6 reused from images.json (`laetoli-footprints`, `lucy-skeleton`,
`lucy-face` in chapter 2; `neanderthal-mr-n` in chapter 14; `neanderthal-nhm`, `neanderthal-skull` in chapter 15).
Every new image was downloaded as a 500 px thumbnail into `data/prehistory/raw/story-humans/` and looked at (the
folder now holds only the 32 used). Licence, author and size come from the Commons API (`extmetadata`
LicenseShortName / Artist / Credit fields); the credit is copied as the file states it. `image` uses the 1920 px
thumbnail when the original is at least 1920 px wide, else 1280 or 960 px (all 32 are thumbnails). All 32 final URLs
were requested one at a time about 3 s apart and returned HTTP 200.

Dropped after the URL check: three good images narrower than 960 px, whose `image` would have had to be the original
file, kept returning HTTP 429 (Wikimedia rate limit, Retry-After 600 s) even after waiting, so a 200 could not be
confirmed: "Orrorin NMNH.jpg" (Orrorin femur cast, Jonathan Chen, CC BY-SA 4.0, 852x2592), "Stone tools from Jebel
Irhoud.png" (Mohammed Kamal, MPI EVA Leipzig, CC BY 4.0, 750x953) and "Homo longi holotype.jpg" (the Harbin skull,
"Fu et al. (2025)", CC BY 4.0, 909x987; its CC BY claim for a cropped journal figure was also unchecked). They can be
added back once their original URLs answer 200.

Rejected after looking: a Denisova Cave photo that showed only a road sign; Bacho Kiro photos (dark tourist
passages); the Blackwater Draw roadside marker (its text gives an outdated "11,000 years" date); a Natural History
Museum photo of the Kabwe skull with visitors' faces; a full-length nude Homo erectus drawing (replaced by a museum
head model); a line drawing of the Harbin skull. No old "march of progress" pictures or racially stereotyped
reconstructions were used. Reconstructions used: the Natural History Museum Homo erectus head (and the reused
Neanderthal Museum and NHM Neanderthal models); their notes say skin, hair and expression are guesses.

Licence doubts:
- `xiahe-mandible` and `baishiya-karst-cave`: credited to Dongju Zhang (a researcher on the Xiahe jaw) under
  CC BY-SA 4.0; plausibly the author's own photographs, not checked further.
- `kenyanthropus-skull`: listed as Public domain by the photographer (Rama), while Rama's other photos of the same
  skull are CC BY-SA 3.0 fr; the file's own statement was followed.
- `homo-erectus-head-nhm`: the Artist field reads "Werner Ustorf]" with a stray bracket; credit given as
  "Werner Ustorf".
- `white-sands-footprints`: credit as stated, "US Geological Service" (the agency is the US Geological Survey); US
  federal work, public domain.
- `acheulean-hand-axe`: the Artist field is empty; the Credit field says "Didier Descouens, 13 April 2011", used as
  credit.
- Several museum photos may show casts rather than originals (Ardi in Addis Ababa, Turkana Boy in Nairobi,
  Kenyanthropus); captions or notes say so where it is likely.
