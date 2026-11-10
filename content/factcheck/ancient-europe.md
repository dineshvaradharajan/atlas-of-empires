# Ancient sites and cultures: Europe (10,000 BCE to about 500 CE)

Files: `content/ancient/sites-europe.json` (39 sites) and `content/ancient/cultures-europe.json` (24 cultures).

Sites by evidence label: 26 archaeology, 11 written, 1 disputed (Troy), 1 legendary (Atlantis).
Cultures by evidence label: 22 archaeology, 2 written (Early Mycenaean Greece, La Tène).
Images: 14 sites have an openly licensed Wikimedia Commons image. I looked at each one before using it.

## Sources and method
- Main source: English Wikipedia articles, read as raw wikitext and checked against the statements cited there. Each item lists only pages I actually fetched.
- Institutional pages fetched and cited: Historic Environment Scotland (Skara Brae), Heritage Malta (Ħal Saflieni, Ġgantija), South Tyrol Museum of Archaeology (Ötzi), and the State Museum of Prehistory in Halle (Nebra sky disc).
- Not reachable by automated fetch, so not cited: UNESCO World Heritage pages (403 / Cloudflare challenge), English Heritage (Stonehenge, Hadrian's Wall), the British Museum, worldheritageireland.ie, and Britannica. The `unesco` flags rely on the inscriptions recorded in the Wikipedia articles.
- Dates are mainstream radiocarbon or tree-ring dates, given with "c.". Where a site has a long later history, `built`/`until` cover the phase the entry is about, and `dateLabel` says so (for example Knossos palace 1900–1350 BCE, Hallstatt prehistoric mining 1200–350 BCE, Acropolis/Parthenon 447 BCE–1687 CE).
- Culture extents are hand-drawn cores based on the distribution maps and region descriptions in the cited articles, not maximum spreads. I plotted them over a coastline to check they sit on the right land.

## Included sites (earliest first)
Atlantis (legend), Star Carr, Lepenski Vir, Sesklo, Akrotiri, Starčevo, Vinča–Belo Brdo, Barnenez, Varna Necropolis, Carnac stones, Ħal Saflieni Hypogeum, Talianki, Dolmen of Menga, Ġgantija, Troy, Ness of Brodgar, Ötzi find site, Skara Brae, Newgrange, Stonehenge, Los Millares, El Argar, Knossos, Su Nuraxi, Mycenae, Nebra sky disc find site, Hallstatt, Olympia, Biskupin, Heuneburg, Pompeii, Acropolis of Athens, Tollund Man find site, Sarmizegetusa Regia, Pont du Gard, Colosseum, Hadrian's Wall, Pantheon, Theodosian Walls.

All the sites required in the brief are included. Troy is included because I could not confirm that the Near East researcher covers it. If both files list Troy, keep one (id `troy`).

## Included cultures
Iron Gates Mesolithic, Maglemosian, Sesklo, Starčevo, Linear Pottery (LBK), Vinča, Cucuteni–Trypillia, Varna, Funnelbeaker (TRB), Atlantic megalith builders, Maltese temple culture, Los Millares, Yamnaya, Corded Ware, Bell Beaker, Únětice, Argaric, Minoan, Early Mycenaean, Nordic Bronze Age, Nuragic, Urnfield, Hallstatt, La Tène.

### How they fit with states the map already draws
- **Minoan**: the map draws "Minoan civilization" as a realm from 1600 to 1401 BCE. The culture keeps its full date range (c. 3100–1100 BCE), but its extent runs only from 3100 to 1601 BCE, so the two never overlap.
- **Mycenaean**: the map draws "Mycenaean Greece" from 1500 to 1101 BCE. The culture's only extent is the early Shaft Grave phase in the southern Peloponnese, 1750–1501 BCE.
- **Nuragic** ends at the Roman takeover of Sardinia in 238 BCE. It overlaps Carthaginian coastal control, which matches how Nuragic life continued inland.
- **Hallstatt** runs only 800–450 BCE (Hallstatt C–D, the Early Iron Age). Hallstatt A–B (1200–800 BCE) belongs to the Urnfield culture, so the two are not drawn twice.
- **La Tène**: the second extent (300–50 BCE) is drawn back to the Alpine edge, so it stays out of Roman Cisalpine Gaul. It may still touch Gallia Narbonensis (Roman from 121 BCE) at its southern rim.
- **Yamnaya** is in the Pontic–Caspian steppe and may duplicate a steppe researcher's entry. Its extent stops at the Ural River.
- **Maglemosian**: the extent deliberately includes part of Doggerland, now under the North Sea, because it was dry land then and is described as such in the source.
- The **Iron Gates Mesolithic** starts at 13,000 BCE per the source, which is earlier than the atlas's 10,000 BCE start. `from` is left at -13000.

## Left out, and why
- Palaeolithic cave art (Lascaux, Altamira, Chauvet): before 10,000 BCE.
- Etruscan necropolis of Cerveteri: the Wikipedia article on the UNESCO site could not be fetched, and the Etruscans are already a realm on the map. Not needed for coverage.
- Goseck circle and other "observatory" claims: left out to avoid an over-claimed interpretation without good sources.
- Arkaim and the Sintashta culture: these belong to the steppe or Central Asia region.
- Pylos, Tiryns, Delphi, Avebury, Maeshowe, Callanish, Bibracte, Manching, the Vix grave and Kernavė: worthwhile, but omitted to keep the list at the brief's size, favouring the brief's required sites and a spread across regions.
- Tartessos: semi-legendary, with a debated link to real archaeology. Left out rather than treated superficially.

## Disputed and legendary cases (scholarly positions)
- **Atlantis (legendary)**: known only from Plato's *Timaeus* and *Critias* (c. 360 BCE). Present-day classicists agree the story is fictional, an allegory about the pride of nations. Some suggest Plato drew inspiration from the Thera eruption, the Sea Peoples or the Trojan War. Others reject any chain of tradition. Plato places it "beyond the Pillars of Heracles" and 9,000 years before Solon (Solon lived c. 638–558 BCE), which gives c. 9600 BCE. The point at [-9.5, 35.8] in the Atlantic west of Gibraltar marks only Plato's vague location. The note says plainly that no archaeological evidence has been found.
- **Troy (disputed)**: the archaeological site of Hisarlık is not in doubt. Hittite Wilusa/Taruisa is "now generally identified" with Troy VI–VII, a link first proposed in 1924. What remains debated is whether Homer's Trojan War reflects a real event. Some scholars see a kernel of truth, but the relationship between myth and reality is unresolved. The entry treats the war as tradition only.
- **Minoan writing**: Linear A (c. 1800–1450 BCE) and Cretan hieroglyphs are undeciphered, so the Minoans' own records can't be read. Knossos is labelled `written` only because later Linear B tablets in early Greek name it (Ko-no-so). Its note says the Minoan records themselves are unreadable. The Minoan culture is labelled `archaeology`.
- **Nebra sky disc dating**: the disc was looted in 1999 and recovered in a 2002 police sting, so its findspot and date depend on the looters' testimony, analysis of the soil and associated objects, and the bronze swords found with it. The mainstream date is the Early Bronze Age, with burial c. 1600 BCE (Únětice culture). In 2020 Gebhard and Krause argued for an Iron Age date. Pernicka and colleagues rejected this the same year. An earlier claim of forgery (Schauer, 2005) was rejected after analysis of the patina. I kept the label `archaeology` and mention the 2020 challenge in the note.
- **Thera eruption and Akrotiri**: radiocarbon puts the eruption most probably at 1620–1530 BCE, while archaeological synchronisms suggest 1570–1500 BCE. I used c. 1600 BCE and give the radiocarbon range in the note.
- **Talianki population**: estimates range from Harper's 6,300–11,000 (based on a revised area of 335 ha) to the widely cited 15,000, or 15,600–21,000 in a 2014 study. The summary gives the range "about 6,000 to more than 15,000".
- **Vinča symbols**: some have called them proto-writing, but most scholars do not accept them as writing. The notes say this.
- **Yamnaya and Indo-European**: under the widely accepted Kurgan/steppe hypothesis, the Yamnaya spoke a stage of Proto-Indo-European. This is a linguistic reconstruction, and the note says so.
- **Bell Beaker**: archaeologists debate whether it was a migrating people or a shared fashion. Ancient DNA (Olalde et al. 2018) shows a large population turnover in parts of western Europe. Both points are stated.
- **Heuneburg as Pyrene**: the hillfort has been identified with the Celtic town of Pyrene mentioned by Herodotus. This is a hypothesis, and the note calls it only a possibility.
- **Nuragic end date**: the traditional end is the Roman conquest in 238 BCE. Others argue Nuragic traditions lasted to the 2nd century CE or later in the Barbagia mountains. I used 238 BCE and hedged the later survival.
- **Lepenski Vir start date**: the start falls somewhere between 9500 and 7200 BCE. Both figures appear in `dateLabel`. Calling it Europe's "first city" is Pavlović's label, and the summary notes it was a village of foragers.

## Date choices and conflicts noted
- **Ħal Saflieni**: Wikipedia gives c. 4000–2500 BCE. Heritage Malta says it was in use 4000–1500 BCE. I used 2500 BCE, the end of the Maltese temple period.
- **Los Millares**: the infobox gives c. 3025–2000 BCE, while the lede says "fourth millennium BC". Rounded to c. 3000–2000 BCE.
- **Argaric culture**: the lede gives 2200–1550 BCE and the infobox 2200–1300 BCE. I used 2200–1550 BCE. The El Argar site page gives c. 2200–1500 BCE.
- **Dolmen of Menga**: the end of its use is not known, so `until` is the end of construction (c. 3650 BCE).
- **Barnenez**: `until` is -2000, since the article reports reuse in the 3rd millennium BCE.
- **Biskupin**: built 747–722 BCE (tree rings). A later-settlement radiocarbon date of 560 ± 150 BCE supports "lived in into the 6th century BCE" (`until` -550).
- **Mycenae**: `until` is -1100 for the Bronze Age citadel. The summary adds that a small town lasted until 468 BCE.
- **Olympia**: the Games end in the "390s CE". The source says 394, and 393 is often quoted.
- **Pont du Gard**: built in the 1st century CE (`built` 50 approximates this). The source says it was used perhaps until the 6th century (`until` 550, approximate).
- **Theodosian Walls**: the point [28.925, 41.02] is placed on the land walls, west of the city centre coordinate given in the article.
- **Tisenjoch (Ötzi)**: the coordinates are approximate for the pass named in the article.

## Image credits (all from Wikimedia Commons; licence as stated on the file page)
Lepenski Vir (Philipp Weigell, CC BY 3.0), Varna grave (Yelkrokoyade, CC BY-SA 3.0), Carnac (Steffen Heilfort, CC BY-SA 3.0), Ġgantija (FritzPhotography, CC BY-SA 4.0), Newgrange (Tjp finn, CC BY-SA 4.0), Skara Brae (Bewahrerderwerte, CC BY-SA 4.0), Stonehenge (garethwiscombe, CC BY 2.0), Mycenae (Andy Hay, CC BY 2.0), Akrotiri (Rt44, CC BY-SA 4.0), Su Nuraxi (Norbert Nagel, CC BY-SA 3.0), Parthenon (Steve Swayne, CC BY 2.0), Colosseum (FeaturedPics, CC BY-SA 4.0), Pont du Gard (Benh LIEU SONG, CC BY-SA 3.0), Biskupin (Luczkab16, CC BY-SA 4.0).

Not used:
- The Nebra disc photo: it is tagged PD-Art, but it was taken at a 2015 Gasometer exhibition and may show a replica.
- The Ötzi image: it shows a museum reconstruction, not the mummy.
