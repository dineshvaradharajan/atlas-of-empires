# Fact-check log: prehistory "origin of species" dataset

File: `content/prehistory/origins.json` (90 groups, first life to Homo sapiens). Researched 21 Nov 2026.
Rules followed: `content/FACTCHECK.md` and the evidence labels in `content/PREHISTORY.md`.

## How it was checked
- Every URL in a `sources` array was opened during this work. Nothing was cited from memory or from a search-result snippet alone.
- Wikipedia: about 270 articles were read as raw wikitext (`index.php?title=...&action=raw`) and cited by their normal article URL. Used for statements that are themselves referenced there, and for taxobox ranges only as a cross-check.
- Papers on nature.com, PLOS, PMC (pmc.ncbi.nlm.nih.gov) and Cambridge Core: the article page itself was opened and the abstract read.
- Paywalled or bot-blocked publishers (science.org, pnas.org, cell.com, Wiley, Royal Society, PubMed): the abstract was read through the Europe PMC REST record. Those appear in `sources` as "Europe PMC record: ..." with the exact record URL that was opened (it returns JSON, not a web page). 14 citations (12 distinct records) are of this kind. If a reader-friendly link is preferred, they can be swapped for the DOI link, but I did not cite DOI pages I could not open.
- Molecular dates: TimeTree 5 pairwise API (`timetree.temple.edu/api/pairwise/<taxon ids>`), about 80 pairs queried, plus dated-tree papers (Moody 2024, Betts 2018, Morris 2018, Barba-Montoya 2018, Misof 2014, Kawahara 2023, Alvarez-Carretero 2022, Carlisle 2023).
- Museum and university pages: Smithsonian Human Origins, Natural History Museum London, UC Museum of Paleontology, University College Cork, Bristol, Wisconsin, Max Planck, UChicago repository.
- About one request every 2 seconds per site. No personal or project details were sent.

## Conventions used in the data
- `fossilMa`: oldest evidence that specialists generally accept. `claimMa`: an older claim that is contested or uncertain. Rule applied throughout: `claimMa` is set if and only if `evidence` is "disputed". That makes 33 "disputed" entries; some are mild ("probable" identifications, e.g. cycads, moth scales) and say so in `evidenceNote`.
- `clockMa`: [low, high] in Ma. Where TimeTree was used it is the 95% interval for the split of the group from its nearest sampled living relative (stem age), or [crown age, stem age] where both were fetched (amphibians, amniotes, carnivorans, primates, monkeys, great apes, rodents, ferns). It is `null` for extinct groups (no DNA) and where the only available clock figure is younger than the fossils (mammals, cephalopods, archosaurs, seed plants, conifers), because the page draws the faded bar backwards from the fossil date.
- `extinctMa` for dinosaurs is `null` because birds are dinosaurs; the text says the non-bird dinosaurs ended 66 Ma. Sauropods, ornithischians and tyrannosaurs carry 66. Theropods are `null` (birds).
- `peakMa` values are indicative, at the level of geological periods; they are not individually sourced to a statement and should be treated as a drawing aid.
- `oldest.lonlat`: approximate present-day position of the named locality, from general geographic knowledge of where the place is (only Mistaken Point's coordinates were read off a page). 10 entries have `lonlat: null` because the oldest evidence has no single find spot (see below).
- Sort: oldest `fossilMa` first; ties keep tree order.

## Included and left out
Included (90): all groups in the brief, plus sea scorpions, lamp shells, clubmosses and scale trees, giant early amphibians (temnospondyls), bird-hipped dinosaurs, snakes (separately from lizards), australopiths and Neanderthals.
Merged: teleosts are covered inside ray-finned fish; "first trees" and "forests" are one entry; sauropods use the whole long-necked line (Sauropodomorpha) so the bar starts at 233 Ma, with true sauropods (c. 200 Ma) explained in the note; crocodiles use the whole crocodile line (Crocodylomorpha), with modern crocodilians noted as Cretaceous; carnivorans use the stem group (64.5 Ma), with crown carnivorans (42 Ma) in the note.
Left out, with reasons:
- Spiders, griffinflies (giant dragonfly relatives), horseshoe crabs, coelacanths: I could not confirm a named oldest fossil with place and date on an opened page to the standard of the others. Griffinflies and true spiders are mentioned in the winged-insect and arachnid texts.
- Mosses, horsetails, crustaceans, corals as a separate bar, lungfish, frogs separately, Homo erectus, Denisovans: outside the brief or better handled by the human-origins part.
- Tikitherium (once called a 225 Ma mammal relative) is not mentioned: a 2024 study re-identified it as a much younger shrew.

## Disputed cases: who argues what
The nine cases the brief requires:
1. First life (fossilMa 3480, claimMa 4280). Accepted: Dresser Formation stromatolites and hot-spring deposits, Pilbara, 3.48 Ga (Djokic et al. 2017). Claimed: 3.7 Ga Isua stromatolites (Nutman et al. 2016), rejected as deformation structures by Allwood et al. 2018; 3.77 to possibly 4.28 Ga haematite tubes, Nuvvuagittuq, Quebec (Dodd et al. 2017), which critics read as non-biological; 4.1 Ga light carbon in a Jack Hills zircon (Bell et al. 2015), a single grain. Clock: LUCA 4.2 Ga, 4.09 to 4.33 (Moody et al. 2024); >3.9 Ga (Betts et al. 2018).
2. Eukaryotes (1650; 2100). Accepted: large ornamented microfossils c. 1.65 Ga, North China and northern Australia (Miao et al. 2024 calls these the oldest unambiguous; a 2026 Nature paper speaks of 1.75 to 1.4 Ga). Claimed: Francevillian biota, Gabon, 2.1 Ga (El Albani et al. 2010), read by Seilacher and others as pyrite pseudofossils or microbial colonies; Grypania, re-dated from 2.1 to 1.87 Ga, may be a giant bacterium or colony. Clock: crown eukaryotes <1.84 Ga (Betts 2018); TimeTree animal-plant split 1.23 to 1.68 Ga.
3. Animals (558; 890). Accepted: Dickinsonia with cholesterol biomarkers, White Sea, 558 Ma (Bobrovskiy et al. 2018) and Kimberella. Claimed: sponge biomarkers (24-ipc) before 635 Ma in Oman (Love et al. 2009), attributed instead to Rhizaria or algae by Nettersheim et al. 2019, and defended again with C31 steranes in 2025 (PNAS); 890 Ma "vermiform" reef textures as sponge bodies (Turner 2021), which the paper itself frames as conditional. Clock used: TimeTree human-sponge split 700 to 800 Ma.
4. Land plants (470; 480). Accepted: cryptospores, Dapingian of Argentina, 473 to 471 Ma (Rubinstein et al. 2010) and c. 470 Ma elsewhere. Body fossils are not known until c. 430 Ma (Cooksonia). Claimed: a 480 Ma Australian spore assemblage mixing Cambrian-type and plant-type spores (Strother and Foster 2021), who argue the older spore-like fossils record algae evolving towards plants rather than true plants. Clock: 515 to 474 Ma (Morris et al. 2018).
5. Flowering plants (130; 174). Accepted: Valanginian-Hauterivian pollen and Barremian plants such as Montsechia (Gomez et al. 2015). Claimed: Nanjinganthus, 174 Ma (Fu et al. 2018), read as a conifer by Coiro, Doyle and Hilton (2019). Clock: crown angiosperms 256 to 149 Ma (Barba-Montoya et al. 2018); Late Triassic (Li et al. 2019). Note on the date: Gomez et al. gave Montsechia as 130 to 125 Ma; on the newest time scale the Barremian is slightly younger, but angiosperm pollen is older (about 135 Ma), so "c. 130" stands for the group.
6. Birds (150; 160). Archaeopteryx, 150 Ma, is the traditional first bird; Anchiornis and Aurornis, c. 160 Ma, are avialans in some analyses and troodontid-like dinosaurs in others, and Archaeopteryx itself has been placed outside birds by a few. The dispute is about where to draw the line. Baminornis (Chen et al. 2025), about 150 Ma, is a second Jurassic bird; its claimed pygostyle has since been questioned (per its Wikipedia article).
7. Placental mammals (66; 160). No undisputed crown placental fossil is older than the K-Pg boundary (O'Leary et al. 2013 argue for a post-K-Pg origin). Clocks put the origin in the Late Cretaceous (Alvarez-Carretero et al. 2022; Carlisle et al. 2023; TimeTree 92 to 101 Ma), earlier studies as far back as the Jurassic. Juramaia (Luo et al. 2011), c. 160 Ma, is a eutherian (placental side of the split), not a placental; its age is queried (its Wikipedia taxobox gives "?Late Jurassic to Early Cretaceous"). The `oldest` object therefore names earliest Paleocene placentals in Montana rather than one species.
8. Primates (56; 65.9). Undisputed primates (Teilhardina and others) appear c. 56 Ma; Altiatlasius (c. 57 Ma, Morocco) is uncertain. Purgatorius, within 105 to 139 thousand years after the K-Pg boundary (Wilson Mantilla et al. 2021), is a plesiadapiform: a stem primate to its describers, not a true primate to others. Clock: TimeTree 66 to 80 (stem) and 69 to 74 (crown); Wikipedia cites about 85 Ma.
9. Hominins (4.2; 7). Sahelanthropus, Chad, 7 to 6 Ma (Brunet et al. 2002). Bipedal: Daver et al. 2022; Williams et al. 2026 (femoral tubercle). Not bipedal: Macchiarelli et al. 2020; Cazenave et al. 2024 (Max Planck); Meyer et al. 2023 on the ulna. Oldest undisputed biped: Australopithecus anamensis tibia, Kanapoi, 4.2 to 3.9 Ma (Leakey et al. 1995). Orrorin (c. 6 Ma) and Ardipithecus (5.6 to 4.4 Ma) fall between and are accepted by most but not all; I chose the strictly uncontested date. Clock: Wikipedia "13 to 5 Ma"; TimeTree median 6.4 (6.2 to 6.7) from 90 studies.

Other entries marked disputed (claim in brackets):
- Red algae (Rafatazmia, 1.6 Ga, India: "probable" crown red algae per Bengtson et al. 2017).
- Fungi (Ourasphaira c. 1 Ga, Loron et al. 2019; Congo 810 to 715 Ma, Bonneville et al. 2020; China 635 Ma "fungus-like", Gan et al. 2021). Oldest undoubted: Rhynie chert, 407 Ma. Loron et al. themselves say unambiguous fungi are otherwise absent until the mid-Palaeozoic.
- Sponges (same claims as animals). Oldest diagnostic remains: 535 Ma spicules (Nettersheim et al. 2019). Helicolocellus (551 to 539 Ma; Wang et al. 2024) is mentioned as "likely" but not used as fossilMa, being a single recent interpretation.
- Molluscs (Kimberella, 558 Ma, mollusc-like but not agreed to be one).
- Cephalopods (522 Ma Newfoundland cones, Hildenbrand et al. 2021; called chimaeras of other animals by Landing et al. 2023).
- Jawed fish and cartilaginous fish (Late Ordovician scales of uncertain owner; claimMa 455 is a mid-point for "Late Ordovician", not a dated fossil).
- Ray-finned fish (Andreolepis, 420 Ma, now often a stem bony fish).
- Insects (Rhyniognatha, 407 Ma: insect per Engel and Grimaldi 2004, centipede per Haug and Haug 2017).
- Cycads (probable foliage c. 300 Ma). Moths (probable scales in 236 Ma dung). Bees (100 Ma nests, Genise et al. 2020; Melittosphex in c. 100 Ma amber).
- Tetrapods (Zachelmie tracks, c. 390 Ma, Niedzwiedzki et al. 2010; rejected as tetrapod tracks by Lucas 2015).
- Modern amphibians (Gerobatrachus, 290 Ma). Amniotes (355 Ma clawed tracks, Long et al. 2025; challenged because claws may not be unique to amniotes; note also that some recent analyses put Hylonomus itself just outside crown amniotes, in which case the oldest sure amniotes are c. 307 Ma). Synapsids (Asaphestera, 318 Ma, fragmentary).
- Turtles (Eunotosaurus, c. 260 Ma). Snakes (167 Ma jaw fragments, Caldwell et al. 2015). Dinosaurs (Nyasasaurus, c. 243 Ma: "either the earliest dinosaur or its sister", Nesbitt et al. 2013). Ornithischians (Pisanosaurus, 229 Ma, now often a silesaurid).
- Mammals (Brasilodon, 225 Ma: mammal by tooth replacement per Cabreira et al. 2022; others keep it as a close relative). Marsupial line (Sinodelphys, 125 Ma, moved to the placental side by Bi et al. 2018, who give 110 Ma in western North America as the oldest metatherians).
- Modern birds (Vegavis, 69.2 to 68.4 Ma: crown bird per Torres et al. 2025, outside crown birds in other analyses). Whales (Himalayacetus, 53.5 Ma per Bajpai and Gingerich 1998, about 47 Ma per later work).

## Where fossils and molecular clocks disagree most
In years:
- Fungi: fossils 407 Ma, clocks 900 to 1,500 Ma (gap up to 1.1 billion years).
- First life, bacteria and archaea: fossils 3.48 Ga, LUCA clock 4.09 to 4.33 Ga (up to 850 million years).
- Red algae: 1,047 vs 1,160 to 1,450 Ma. Sponges: 535 vs 700 to 800 Ma. Animals: 558 vs 700 to 800 Ma. Bilaterians: 558 vs 646 to 797 Ma.
- Insects: 325 (oldest undoubted) vs 456 to 507 Ma. Myriapods: 425 vs 534 to 571 Ma.
- Flowering plants: 130 vs 149 to 256 Ma.
In proportion: hominins (4.2 vs up to 13), flowering plants, butterflies (56 vs about 100), bees (70 vs 111 to 135), modern birds (67 vs 95 to 114), snakes, placentals (66 vs 92 to 101), monotremes (125 vs 168 to 194), marsupial line (110 vs 152 to 166).
Agreement is good for apes (25.2 vs 25 to 30), whales, horses, elephants, bony fish and jawed fish.

## Child older than parent (fossil gaps)
- Ediacaran biota (574) under animals (558): the biota's oldest members are older than the first organism proven to be an animal, because the animal status of many Ediacaran forms is itself debated.
- Cnidarians (560) under animals (558): Auroralumina is dated 557 to 562 Ma, overlapping Dickinsonia's 558; the 2 Myr difference is inside the dating error.
No other child is older than its parent. Several children equal their parent (bacteria and archaea with first life; bilaterians with animals; jawless fish with chordates; winged insects with insects; sauropod line with dinosaurs; australopiths with hominins) because the oldest fossil of the parent is a member of the child.

## Recent finds (last 5 years) that moved a date
- 2026: Eosteus, oldest bony fish, 436 Ma (was Guiyu, 425). Williams et al. on Sahelanthropus. A Nature paper on 1.75 to 1.4 Ga eukaryote habitats.
- 2025: Vulcanidris, oldest ant, 113 Ma (was c. 100). Australian clawed tracks, 355 Ma (amniotes, contested). Baminornis and Vegavis skull. C31 sponge steranes. Ahvaytum, oldest northern dinosaur, c. 230 Ma (does not change the 233 Ma record).
- 2024: LUCA at 4.2 Ga. Qingshania, 1.63 Ga multicellular eukaryote. Thylakoids in 1.75 Ga cyanobacteria. Somerset forest, 390 Ma (was Cairo, New York, 385 to 386). Helicolocellus sponge. Mallorca gorgonopsian. Cooksonia beds re-dated to at most 426 Ma.
- 2023: Spitsbergen ichthyosaur, c. 250 Ma. Icaronycteris gunnelli, oldest bat skeleton. Butterfly origin c. 100 Ma. Cephalopod claim rebutted. Cryptovaranoides rejected as a squamate.
- 2022: Chongqing and Guizhou fish (jawed vertebrates at 439 to 436 Ma). Auroralumina. Brasilodon. Omo Kibish at 233 ka or older. Daver et al. on Sahelanthropus.
- 2021: Purgatorius at 65.9 Ma. Parioscorpio shown not to be a scorpion. Turner's 890 Ma sponge claim. 480 Ma spores.

## Could not verify, or weaker than the rest
- Ray-finned fish: "c. 415 Ma" for Meemannia is from background knowledge of Lu et al. 2016; the opened pages confirm only "Early Devonian, Yunnan" and the 2016 reassignment to ray-fins.
- Arthropods: 535 Ma is my rounding of "earliest Cambrian" for Rusophycus traces (Wikipedia taxobox gives 538.8); no single dated site was confirmed, so `lonlat` is null.
- Sponges, molluscs, brachiopods, ammonites, conifers, cycads: the oldest evidence is given as a kind of fossil and an age, not a named specimen; `lonlat` is null. Marsupials, butterflies and rodents likewise (region only).
- Sea scorpions: 467 Ma is the oldest named species (Pentecopterus); Wikipedia's lead says the earliest are c. 480 Ma (Tremadocian) without naming them. I kept 467 and say so in the note.
- Spores from Argentina: "north-west Argentina" and the coordinates are approximate; the abstract says only Argentina.
- Grasses: Wu et al. 2018 could not be opened; the Albian date rests on the referenced statement in Wikipedia (Poaceae) only. Coordinates for "northern China" are approximate.
- Kampecaris (Brookfield et al. 2020), Asaphestera (Mann et al. 2020), Proceratosaurus (Rauhut et al. 2010), Santa Maria dating (Langer et al. 2018), bee clock (Cardinal and Danforth 2013), beetle clock (McKenna et al. 2019), Sifrhippus (Secord et al. 2012), Chengjiang age (Yang et al. 2018), Bangiomorpha age (Gibson et al. 2018), Prasad et al. 2005: publisher pages blocked and no Europe PMC record; these facts rest on the referenced Wikipedia statements. The bee and beetle clock ranges come from TimeTree instead.
- dos Reis et al. 2015 (animal origin 833 to 650 Ma in my memory) could not be opened in full, so the animal clock uses TimeTree (700 to 800 Ma).
- Winged insects `clockMa` is [406, 406]: Misof et al. give a point estimate (about 406 Ma) and I did not open the confidence interval.
- Bilaterian and cnidarian clock ranges come from different TimeTree pairs and overlap in an order that is not strictly logical (the cnidarian split must be at least as old as the bilaterian one); both are reported as fetched.
- Neanderthals and Homo sapiens have `clockMa: null`: I did not open a source giving the sapiens-Neanderthal split with a range.
- Descriptive sentences in `text` (what a group is, why it mattered) were checked against the cited Wikipedia articles where they contain a number; general statements of textbook kind (for example "birds are living dinosaurs", "whales' closest living relatives are hippos") were confirmed on the cited pages where I looked, but not every clause was traced to a sentence.
- All coordinates are approximate (see Conventions).

## Counts
Items: 90. By group: microbes 5, algae-plants 13, fungi 1, invertebrates 22, fish 8, amphibians 3, reptiles 12, dinosaurs 5, birds 2, mammals 10, primates 4, humans 5.
By evidence: fossil 54, disputed 33, geology 2 (archaea, cyanobacteria), genetic 1 (butterflies).
Extinct groups with an end date: 15. Entries with a molecular range: 61. Entries with `lonlat: null`: 10.
Validation run: JSON parses; ids unique and kebab-case; every parent exists; extinctMa < fossilMa; sorted oldest first; lon/lat in range; text 41 to 61 words; 2 to 5 sources each; every cited URL matched against the fetch cache.
