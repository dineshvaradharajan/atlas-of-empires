# Ancient sites and cultures: the Americas and Sub-Saharan Africa (10,000 BCE – c. 500 CE)

Files: `content/ancient/sites-americas-africa.json` (46 sites) and `content/ancient/cultures-americas-africa.json` (22 cultures).
Brief: `content/ANCIENT.md`. Sourcing rules: `content/FACTCHECK.md`. North Africa and Nubia belong to the Near East researcher.

## Counts
- Sites: 46 in total, 32 in the Americas and 14 in Africa.
  - By label: archaeology 37, written 6, disputed 3, legendary 0.
  - 29 sites have a Commons image, and each image was downloaded and viewed before use.
- Cultures: 22 in total, 15 in the Americas and 7 in Africa.
  - By label: archaeology 20, written 2.
- Validation passed:
  - JSON parses. Ids are unique and kebab-case across both files and do not clash with the other regions' `content/ancient` files.
  - Sites are sorted by `built`, and every `culture` reference resolves.
  - Rings are closed with 8–30 points, years are ordered, and extent years fall inside culture years.
  - Summaries are 60–110 words for sites and 40–90 for cultures.
- Land check: I tested every ring vertex and site point against the modern country polygons in `public/data/2000.json`. All ring vertices fall on land. Two coastal site points fall just outside that coarse coastline: Huaca Prieta, on the beach, and the Paracas Peninsula. Both are correct real locations.

## Sources actually used
- English Wikipedia raw wikitext for every site and culture cited, fetched slowly (one request every 2 s) to the scratch folder and read. Dates, sizes and discovery years come from the statements in those articles that cite sources.
- Non-Wikipedia sources I opened:
  - Hildebrand et al. 2018, *PNAS* (PMC6130363): Lothagam North Pillar Site dates and burial count.
  - Sereno et al. 2008, *PLoS ONE* 3(8) e2995: Gobero phases, about 200 burials, and the triple burial.
  - Royal Museum for Central Africa news page on the Shum Laka ancient DNA (Lipson et al. 2020, *Nature*).
  - US National Park Service, Hopewell Culture NHP: the earthworks' function and their 2023 World Heritage listing.
- Wikimedia Commons API (`imageinfo` + extmetadata) for image licences and authors.
- Not accessible:
  - whc.unesco.org returned 403, so no UNESCO URL is cited. Inscription facts come from the Wikipedia infoboxes and statements that cite UNESCO.
  - britannica.com returned 403, metmuseum.org returned 429, and The Guardian is blocked for the fetch tool.
- Coordinates come from the `{{coord}}` templates in the articles, from the Wikipedia/Wikidata API, or as noted here:
  - Watson Brake and Grave Creek: from the article templates.
  - San Bartolo: Spanish Wikipedia.
  - Paso de la Amada: Wikidata.
  - Hand-placed or approximate points, each said in the entry: Lothagam (the Lothagam hill point in Wikidata), the Paracas cemeteries (Paracas Peninsula), Nok (the article's culture-area point) and Lydenburg (the town).

## What is included
- **Americas, required list:** all included. Monte Verde, Caral (Norte Chico), Huaca Prieta, Valdivia (as its type village, Real Alto), Watson Brake, Poverty Point, San Lorenzo, La Venta, Chavín de Huántar, Monte Albán, El Mirador, Teotihuacan, Tikal (early phase), the Nazca Lines, the Moche huacas (Huacas del Sol y de la Luna), Tiwanaku (early city) and the Hopewell earthworks (Newark, part of the Hopewell Ceremonial Earthworks WHS).
- **Americas, added foundational sites:**
  - Blackwater Draw, the Clovis type site.
  - Pedra Furada / Serra da Capivara (disputed early dates).
  - Guilá Naquitz, the first domesticated squash.
  - Cueva de las Manos.
  - Sechín Bajo, one of the oldest monumental plazas in the Americas (c. 3500 BCE).
  - Paso de la Amada, the oldest ballcourt.
  - San José Mogote, the forerunner of Monte Albán.
  - Kaminaljuyu, Cuicuilco and San Bartolo, the earliest Maya writing.
  - Grave Creek Mound (Adena) and the Great Serpent Mound (disputed).
  - The Paracas cemeteries, Cahuachi and Sipán.
- **Americas cultures:** Clovis, Valdivia, Caral–Supe (Norte Chico), Poverty Point, Olmec (early), early Zapotec, Preclassic Maya, Chavín, Paracas, Nazca, Moche, Tiwanaku (early), Adena, Hopewell and Basketmaker.
- **Africa, required list:**
  - Included: Apollo 11 Cave, Laas Geel, Nok (type site), Taruga, Djenné-Djenno, Aksum (stelae fields) and Matara.
  - Tassili n'Ajjer is left out of my file only because it is already in `content/ancient/sites-near-east.json` under the same id (`tassili-n-ajjer`, same point, evidence "disputed"). A second copy would duplicate the id. My Green Sahara culture covers its rock art, and its Wikipedia article is a source there.
- **Africa, added sites:**
  - Ounjougou: the oldest pottery in Africa, c. 9400 BCE.
  - Gobero: the oldest cemetery in the Sahara, in Niger.
  - The Lothagam North Pillar Site.
  - Dhar Tichitt.
  - Shum Laka: the probable Bantu homeland, with the first ancient DNA from West or Central Africa.
  - Yeha: the pre-Aksumite temple.
  - The Lydenburg Heads site: early Iron Age farmers in South Africa, c. 500 CE.
- **Africa cultures:**
  - Green Sahara hunter-fishers and herders.
  - Pastoral Neolithic of eastern Africa.
  - Kintampo.
  - Tichitt tradition.
  - Nok.
  - Bantu expansion, labelled "(approximate)" in its name, `dateLabel` and `evidenceNote`.
  - Pre-Aksumite / Proto-Aksumite (Dʿmt).
- **Sites that begin long before 10,000 BCE:**
  - Apollo 11 Cave has `built: -28000`. The painted slabs are about 30,000 years old (14C). Its `until: -27000` brackets the art horizon only, because the shelter was used on and off before and after.
  - Shum Laka has `built: -28000`, from its first occupation about 30,000 years ago.
  - Monte Verde has `built: -12500`.

## Overlap with states the map already draws (public/data/clio/index.json realms)
- **Olmec:** the "Olmec Civilization" realm runs from -650 to -351. The culture keeps its real dates (c. 1400–400 BCE), but its only extent stops at -650.
- **Zapotec:** the "Zapotec Civilization" realm starts at -500. The early Zapotec culture ends at -500. Monte Albán is a site with `culture: null`.
- **Maya:** the "Mayan City-States" realm starts at -247. The Preclassic Maya culture runs to 250 CE, but its extent stops at -250.
- **Teotihuacan:** a realm from -50, so no culture was added. Teotihuacan and Cuicuilco are sites only.
- **Aksum:** the "Kingdom of Axum" realm starts at -50. The Pre-Aksumite culture ends at -50. The Aksum site has `culture: null`.
- **Not drawn as realms, so drawn here:** Chavín, Paracas, Nazca, Moche, Tiwanaku, Adena, Hopewell and Basketmaker. Nazca and Moche run to 800 CE and Tiwanaku to 1050 CE in `to`, because those are their real end dates. Tiwanaku's extent covers only its early home area, from 100 to 500 CE.

## What is left out, and why
- **Mapungubwe:** c. 1075–1220 CE, far after the period. The brief says to omit it unless it has a context before 500 CE, and it has none.
- **Nabta Playa:** in Egypt, not south of the Sahara. It is already in the Near East file.
- **Tsodilo Hills:** its rock art spans tens of thousands of years, and the published dates are scattered and contested, from about 24,000 BP for some paintings to after 400 CE for others. I could not give it an honest `built`/`until`.
- **Kotosh:** the article's period dates are poorly sourced, cited only to a tourism page.
- **Birimi:** the Kintampo site's Wikidata point does not match the article's description of its location.
- **Broederstroom:** the Wikipedia article is about the modern village.
- **Adulis:** dropped to keep the Aksumite cluster to two sites, Aksum and Matara.
- **Izapa, Cerro Sechín, Meadowcroft, Paisley Caves and Cooper's Ferry:** room was limited. Paisley Caves is mentioned in the Clovis culture summary.
- **Images:**
  - Yeha's image is under the Free Art License, which is not on the allowed list.
  - The Apollo 11 image has text written over the art.
  - Paso de la Amada, Watson Brake, Laas Geel, Dhar Tichitt and Taruga had no image of at least 600 px.
  - The San Lorenzo colossal head has no author or credit recorded on Commons.
  - The Sechín image's Commons description does not say which Sechín site it shows.

## Disputed cases, with the scholarly positions
- **Monte Verde (disputed):**
  - Dillehay's team dated Monte Verde II to about 14,500 years ago (c. 12,500 BCE). For decades most archaeologists accepted this as the clearest site older than Clovis.
  - An older layer, Monte Verde I (about 18,500 cal BP), was never widely accepted.
  - Surovell et al. 2026 (*Science* 391:1283–1288) dated a tephra below MV-II to about 11,000 BP and argued that the camp is mid-Holocene, under 8,200 BP, with older material redeposited. Dillehay has challenged that.
  - Sources: Wikipedia "Monte Verde", which cites both sides.
- **Pedra Furada / Serra da Capivara (disputed):**
  - The rock paintings, some about 12,000 BP, and the later camps are accepted.
  - Guidon's claims of hearths and tools 48,000–32,000 years old are still debated (Meltzer 2021). Critics, including Dillehay in 1994, suggested the charcoal could come from natural fires and the "tools" could be geofacts, stones broken naturally or even by capuchin monkeys.
- **Great Serpent Mound (disputed):**
  - Radiocarbon work in 2014, corroborated in 2019, put construction at about 300 BCE by Adena people, with repairs about 1100 CE.
  - Brad Lepper argued that the dated material was organic sediment, not charcoal, and questioned the Adena attribution. The Fort Ancient date (c. 1000–1100 CE) remains the main alternative.
  - Both positions are stated in the entry.
- **Chavín, dating (labelled archaeology, with the debate noted):**
  - The site article gives c. 1200–500 BCE, from Rick's radiocarbon chronology.
  - The culture article gives c. 900–250 BCE, from the older Burger chronology.
  - I used both, each attached to its own entry, and the culture's `dateLabel` says that some scholars start it at c. 1200 BCE.
- **Tiwanaku founding date (labelled archaeology):**
  - Older claims of 1500 BCE, and fringe claims much older still, are rejected.
  - Consensus put the site no earlier than 200–300 BCE.
  - A statistical study of reliable radiocarbon dates gives a founding about 110 CE (50–170, 68%). I used c. 100 CE.
- **Laas Geel (labelled archaeology):** its dates (c. 5,500–4,500 years ago) are estimates from style and associated finds, not direct dating. The `evidenceNote` says so.
- **Tassili n'Ajjer:** not in my file. The Near East entry already labels it disputed for its rock-art chronology.
- **Taruga and iron:** the date of the earliest iron working (4th–3rd century BCE furnaces) is reported. Whether iron smelting spread from North Africa or was invented locally is debated, and the summary says so.
- **Bantu expansion:**
  - The routes and timing (c. 4000/3000 BCE – 500 CE) are reconstructions from linguistics, genetics and archaeology. Two "streams" are a common but contested model.
  - The four extents are rough, widening guides: homeland; rainforest by c. 1500 BCE; central Angola and the Great Lakes by c. 500 BCE; South Africa by c. 300 CE.
  - The extents are labelled approximate in the name, `dateLabel` and `evidenceNote`.
- **Shum Laka:** the region is the probable Bantu homeland, but the four sequenced individuals are not substantially ancestral to today's Bantu speakers (Lipson et al. 2020). For that reason the site is not linked to the Bantu culture.
- **Olmec writing:** the Cascajal Block and a few carvings may carry signs, but nothing can be read. Olmec entries are therefore labelled archaeology, not written.
- **Written labels:**
  - Tikal and Monte Albán: from their inscriptions. Zapotec glyphs are only partly understood.
  - San Bartolo: its texts of about 300–200 BCE are datable but mostly unreadable. It is labelled written because writing exists, and the note says it is unread.
  - Yeha, Matara and the Pre-Aksumite culture: South Arabian-script inscriptions. Matara's Hawulti is the oldest Geʽez inscription.
  - Aksum: "written" from its inscriptions, coins and Greco-Roman texts such as the *Periplus*.
- **Matara dates:** given as approximate. The 8th century BCE start is the hypothesised Dʿmt date, and the 7th century CE end is the Aksumite decline. The Wikipedia infobox's "fifth millennium BC" was not used because it is unsupported.
- **Real Alto:** the Wikipedia lead says the site was settled 6000–3800 BC, apparently pre-Valdivia occupation, but the same article puts the Valdivia town at c. 2500 BCE. The entry covers the Valdivia village, c. 3800–1500 BCE, and its `dateLabel` mentions earlier traces.

No legendary cases were added. No famous legend in this region has a traditional location that readers commonly ask about in this period.
