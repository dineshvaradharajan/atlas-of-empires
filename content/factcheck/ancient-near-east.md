# Regional fact-check: Ancient Near East and Egypt (before 330 BCE)

Scope: `content/eras/a-ancient.json` chapters -3000 to -323 (overview, `regions.middle-east-south-asia`,
`regions.northern-africa`, powers, events), plus profiles in `content/empires/a1-early.json`:
ancient-egypt, sumer, akkadian-empire, babylonia, assyria, hittite-empire, kingdom-of-kush (pre-330 part),
achaemenid-empire. No separate profiles exist for Ur III, Mitanni, Elam, Urartu, Medes, Phoenicia or Israel/Judah.
Those polities were checked where they appear in era chapters.

Patch file: `content/factcheck/ancient-near-east-patch.json` (25 corrections, 21 added references).

## Authorities actually opened
- *Cambridge Ancient History*, 3rd ed., vol. I pt 2 (1971): archive.org `the-cambridge-ancient-history-vol.-1-part-2` (Hayes, ch. XX, p. 479)
- *CAH*, 3rd ed., vol. II pt 1 (1973): archive.org `the-cambridge-ancient-history-vol.-2-part-1` (p. 37, Mitanni and Assyria)
- *CAH*, 2nd ed., vol. III pt 1 (1982): archive.org `the-cambridge-ancient-history-vol.-3-part-1` (Ashur-rabi II 1012–972)
- *CAH*, 2nd ed., vol. III pt 2 (1991): archive.org `the-cambridge-ancient-history-vol.-3-part-2` (Grayson pp. 36–7, 85–6, 91–4, 129–30; Mellink pp. 622–3; Shabako pp. 353, 689)
- Taagepera 1978/1979 and Turchin–Adams–Hall 2006 peak areas, as tabulated in Wikipedia "List of largest empires"
- Wikipedia (cited scholarship): Hurrians, Mentuhotep II, Median kingdom, Kingdom of Israel (united monarchy), Phoenician alphabet, Midas, Nabopolassar, Kültepe, Shabaka, Piye, Aspelta, Mitanni, Hittites, Peace of Callias, Nectanebo II, Uruk period
- Not accessible: Kuhrt, *The Ancient Near East* (archive.org copy is lending-restricted), Shaw (ed.), *Oxford History of Ancient Egypt* (lending only), Hornung–Krauss–Warburton (no open copy found), Encyclopaedia Iranica (HTTP 403), Britannica (HTTP 403). TAVO was not consulted.

## Corrections (old → new)
- [-3000] regions.middle-east-south-asia: "and Hurrian groups in the northern hills" → "and probably early Hurrian groups (first named in texts only after c. 2300 BCE) in the northern hills". Hurrians are first documented at Urkesh in the later 3rd millennium, so a presence at 3000 BCE is only inferred. Source: Wikipedia "Hurrians".
- [-2000] events[1].text: "Mentuhotep II reunites Egypt … (c. 2055 BCE)" → "Mentuhotep II, king from c. 2055 BCE, reunites Egypt … (c. 2040 BCE)". 2055 is his accession date (Shaw). Heracleopolis fell "about 2040 B.C." (CAH I.2 p. 479), and some put it later still, before his year 39 (Grajetzki).
- [-1000] overview: "King David rules a new kingdom of Israel" → "King David, according to the Bible, rules …". The size of the united monarchy has no consensus.
- [-1000] overview: Phoenicians "are spreading their alphabet across the Mediterranean" → "have developed the alphabet their traders will later carry across the Mediterranean". The oldest inscriptions are 10th century. Greek and other adaptations begin in the 9th–8th centuries, and western colonies date from the 9th century on.
- [-1000] regions.middle-east-south-asia: "under him and his son Solomon it will become a regional power" → hedged as the Bible's claim, with the archaeological debate noted.
- [-1000] powers[2].extent: "from the Negev toward Damascus" is now marked as the Bible's larger, debated realm.
- [-700] overview: "the legendary King Midas" → a real ruler famous from Greek legend (the Mita of Mushki in Assyrian records). Source: CAH III.2 pp. 91–2, 622–3.
- [-700] regions.middle-east-south-asia: the sentence credited Sennacherib with destroying Israel in 722 BCE. Samaria fell to Shalmaneser V (726–722), or Sargon II, never Sennacherib (705–681). Rewritten as "Assyria destroyed … and Sennacherib has forced Judah …". Source: CAH III.2 pp. 85–6.
- [-700] regions.middle-east-south-asia: "the Medes are uniting in western Iran" → "still divided among many local chiefs". Sargon II took tribute from 28 Median rulers (CAH III.2 pp. 93–4), and Esarhaddon dealt with many Median city-lords (pp. 129–30). A unified Median state is first attested under Cyaxares in 615 BCE.
- [ancient-egypt] peak.note: added "c. 1.0M km² c. 1450 BCE (Taagepera 1978)".
- [ancient-egypt] summary: "native independence ended when Cleopatra VII died" → "its independence ended …". The Ptolemies were Macedonian Greeks, and the last native ruler was Nectanebo II (Persian reconquest in 342 BCE).
- [sumer] peak.year: -2100 → -2050. The peak is given "under Shulgi", who reigned c. 2094–2047.
- [sumer] peak.note: added that Taagepera gives the Neo-Sumerian state only c. 0.1M km², so 250,000 km² assumes the tributary periphery.
- [akkadian-empire] peak.areaKm2: 650,000 → 800,000 to match Taagepera 1978 (0.8 Mm² at 2250 BC). The note now says this figure includes reach beyond directly ruled land. The map (clio) gives about 527,000 km².
- [babylonia] summary: "the Chaldean Nabopolassar" → "Nabopolassar, traditionally called a Chaldean". His origin is unclear: Beaulieu and Jursa link his family to Uruk officials.
- [babylonia] peak.note: added "c. 0.5M km² (Taagepera 1978)".
- [assyria] summary: caravans into Anatolia "by 2000 BCE" → "soon after 2000 BCE". Kanesh kārum level II is c. 1974–1836 BCE (Veenhof).
- [assyria] peak.note: added "c. 1.4M km² c. 670 BCE (Taagepera 1978)".
- [hittite-empire] peak.year: -1300 → -1250. Taagepera gives 0.45 Mm² for 1250–1220 BC. The note now carries that figure.
- [hittite-empire] legacy: "known before only from brief Bible mentions" → "… in the Bible and in Egyptian records". The Kheta of the Kadesh texts and the Amarna letters were known before the 1906 Hattusa archive.
- [kingdom-of-kush] rulers[1].reign (Shabaka): "c. 714 – 700 BCE" → "c. 705 – 690 BCE". The old dates fit neither chronology. The revised order (Payraudeau 2014; Tang-i Var inscription) gives 705–690, matching the profile's Piye dates of 744–714. The older order gives 716–702 (CAH III.2 pp. 353, 689).
- [achaemenid-empire] rulers[4].note: "Made peace with Athens" → "Said to have made peace with Athens (the disputed Peace of Callias)".
- [achaemenid-empire] peak.note: added "c. 5.5M km² c. 500 BCE (Taagepera 1979)".

## Checked and found consistent with the authorities (no change)
Narmer c. 3100 and the First Dynasty at Memphis/Abydos/Saqqara. Writing at Uruk c. 3200. Ur III founded c. 2112, fell 2004 (Kindattu, Ibbi-Sin). Ishbi-Erra of Isin. Amenemhat I c. 1991. Mursili I sacks Babylon 1595. Telipinu c. 1525. Ahmose c. 1550. Thutmose I c. 1506–1493. Kassite Babylon. Kidinuid Elam. Parattarna of Mitanni c. 1500. CAH II.1 p. 37 puts Assyria's annexation by Saustatar at the start of the 15th century, so "Assyria as a vassal" at 1500 BCE is acceptable. Ramesses III and the Sea Peoples 1177. End of the New Kingdom c. 1070. Ashur-rabi II c. 1012–972 (CAH III.1). Amenemope of Dyn. 21. Piye's conquest c. 728 (Shaw) or year 20 (c. 725). Shabaka or Shebitku ruling at 700. Sennacherib's son placed on the Babylonian throne in 700 (Ashur-nadin-shumi recognised at Uruk in 700, CAH III.2 p. 37 n.). Argishti II. Shutruk-Nahhunte II. Samaria 722. Sargon II against Urartu 714. Cyrus 559–530, Media 550, Babylon 539. Cambyses in Egypt 525. Darius I 522–486. Ionian revolt 499. Amyrtaeus and Egypt's revolt 404. Artaxerxes II 404–358 and Cunaxa 401. Egypt taken by Alexander 332. Nastasen c. 335–315. All Akkadian, Old Babylonian, Neo-Babylonian, Assyrian, Hittite and Egyptian reign dates in the profiles match the standard middle-chronology and Shaw tables, within the "c." given.

## Border / extent discrepancies (map data, not editable)
1. **Snapshots -1500, -1000 and -700 share one Near East layout.** `data/names/-1500.txt`, `-1000.txt` and `-700.txt` list identical polygons and areas: Kingdom of David and Solomon 154,278 km², Urartu 286,183, Phrygians 181,637, Arameans 419,276, Hittites 412,217, Assyria 174,198, Babylonia 129,144, Egypt 262,083, Kush 332,353, Saba 104,471.
   - At -1500 this is anachronistic. David's kingdom (c. 1000 BCE), Urartu (9th century), Phrygia, the Aramaeans and Saba did not yet exist. Mitanni, the leading power of northern Syria (Taagepera c. 0.3M km² for 1450–1375), has no polygon (the era file's `map: null`). New Kingdom Egypt's Levantine and Nubian empire is missing: Egypt's 262k km² compares with 636k in clio and 1.0M in Taagepera.
   - At -700 Assyria is drawn at 174k km². The real Neo-Assyrian empire was about 0.9–1.4M km² (clio 920k for 700–676; Taagepera 1.4M at 670). Babylonia, the "Hittites" (the Neo-Hittite states were annexed by 717–708) and the Kingdom of David and Solomon (Israel was annexed in 722, and Judah was an Assyrian vassal) are shown as independent states. Kush and Egypt appear as separate polygons although the 25th Dynasty ruled both. The text is correct, but the map contradicts it.
2. **-2000:** a "Hittites" polygon (230k km²) appears about 350 years before the Hittite kingdom (Hattusili I, c. 1650). Central Anatolia then held the Kanesh-period city-states. "Ur" (340,933 km²) remains although Ur III fell in 2004. No Assyria/Assur or Isin–Larsa polygons. Egypt has the same 322,966 km² as at -3000.
3. **-3000:** "Ur" is drawn at 340,944 km², a single huge polity. The Sumerian city-states covered roughly 35–45k km² (clio). "Kerma" appears, though the Kerma culture begins c. 2500 BCE; Lower Nubia then held the A-Group. "Hurrian Kingdoms" (74,955 km²) are not attested before the later 3rd millennium.
4. **-400:** there is no Egypt polygon. Egypt stays inside the Achaemenid polygon (6.02M km²) although it was independent from 404 BCE (28th Dynasty). The clio timeline correctly drops the Achaemenid area to 4.99M for 404–384.
5. **Profile peak areas vs clio/Taagepera:**
   - Kush 1.0M km² at -700. There is no Taagepera figure, and clio has 563k for 700–676. This looks high and is unverified.
   - Ancient Egypt 1.0M (Taagepera) vs clio's New Kingdom maximum of 709k.
   - Hittite 0.45M (Taagepera) vs clio 322k.
   - Akkad 0.8M (Taagepera, now in the patch) vs clio 527k.
   - Ur III 250k vs Taagepera 0.1M.
   - Clio "Median Kingdom" 2.06–2.24M km² (615–551) and Taagepera's 2.8M rest on a Median "empire" whose existence and extent are disputed (Sancisi-Weerdenburg).
6. **Clio dates:**
   - "Kingdom of Kush" starts at -1000, so Kerma (c. 2500–1500) has no clio polygon, while the profile starts at -2500.
   - "Sumerian City-States" runs to -1761, past the profile's end of -2004, because it includes the Isin–Larsa successors.
   - At -323 "Meroe" jumps to 576k km², from 309k at -500 and -400, with no historical reason.

## Unverifiable / disputed (left as is, flagged)
- Egyptian absolute dates follow Shaw/Parker-style tables. Hornung–Krauss–Warburton (2006) would lower many of them, for example Dynasty 1 to c. 2900 and Thutmose I to 1493–1483. Radiocarbon work (Dee et al. 2013) supports c. 3100 for Aha/Narmer. The existing "c." hedges are kept.
- The Ur-Nammu law code may belong to Shulgi. The text already says "one of the earliest".
- "Thutmose I … conquers Kerma (c. 1500)": he sacked Kerma, but Egypt's final conquest of Kush was completed under Thutmose III.
- "[Artaxerxes II's] grip on the Indus is loosening" (-400): plausible, but the evidence is thin.
- Kush profile "Aksum's armies finished it around 350" and "Assyrians drove them out around 664" (the 25th Dynasty kept Thebes until c. 656) are outside this slice or within the hedge.
- Akkadian "standardised weights and measures" is credited to Sargon in the summary. Most evidence dates this to Naram-Sin's administration.
- CAH III.1 (1982) follows a maximal biblical picture of David and Solomon. Modern work is split, so the text is hedged rather than corrected.

Items checked: 8 era chapters (-3000 to -323, Near East and Egypt content) + 8 profiles. Corrections proposed: 25. References added: 21.


---

# Ancient sites and cultures: Near East, Egypt, Nubia and North Africa (10,000 BCE – c. 500 CE)

This section logs the `content/ancient/` research for region `near-east` (brief: `content/ANCIENT.md`). The era fact-check above is a separate, earlier task and was left unchanged.

Files: `content/ancient/sites-near-east.json` (47 sites) and `content/ancient/cultures-near-east.json` (22 cultures).
Validation: both files parse; ids are unique kebab-case; every ring is closed with 8–30 vertices and does not cross itself; lon/lat fall inside the region; years are in order; site summaries run 57–88 words and culture summaries 40–90 words; every site `culture` id exists. The extents were also plotted over the repo's `world_bc4000` basemap to check that they sit on land and in the right places.

## Sources and method
- Each article's raw wikitext came from `en.wikipedia.org/w/index.php?action=raw`, fetched about one request every 2 s. Every summary claim was then checked against the text, and claims the article did not support were reworded or dropped (for example the Maykop "gold canopy", an 18 m height for the Western Deffufa, Abu Simbel's sun alignment, the Ebla discovery year, and Hattusa's Kadesh-treaty tablet). The Hattusa sentence now cites the Tudhaliya IV–Kurunta bronze tablet, which the article does document.
- Non-Wikipedia pages opened: the Hierakonpolis Expedition site ("About Hierakonpolis" and "Firsts of the First City") and the Çatalhöyük Research Project's "The Site" page. UNESCO's whc.unesco.org, Britannica and the Met all returned HTTP 403/429 to automated fetching. UNESCO status and inscription years therefore come from the infoboxes of the Wikipedia articles (Göbekli Tepe 2018, Çatalhöyük 2012, Tell es-Sultan 2023, Arslantepe 2021, the Ahwar of Southern Iraq 2016 for Ur, Uruk and Eridu, Babylon 2019, Dilmun 2019, Marib 2023, Bat 1988, Hegra 2008, Meroë 2011, Bisotun 2006, Susa 2015, Carthage 1979, Palmyra 1980, Hattusa 1986, Troy 1998, plus the 1979 Egyptian and Iranian sites).
- Coordinates come from the articles' {{coord}} templates, or from Wikidata P625 for Raqefet Cave, Karnak and the Djoser pyramid. Approximate points: the Maykop kurgan is placed in Maykop town (44.61 N, 40.10 E), because the article has no coordinates and the mound no longer exists. Tassili n'Ajjer is plotted at the centre of the plateau, not at a single panel.
- Images: 34 sites have an openly licensed Commons image (CC0, PD, CC BY or CC BY-SA). Each one was viewed before use. The record keeps the 800 px upload.wikimedia.org thumbnail, the file page, the author as Commons gives it, and the licence short name. No image was used for Tassili: the best candidate's photographer is unrecorded and it was copied from a third-party site.

## Conventions worth knowing
- `built` is the first construction or occupation and `until` is the end of use. For temples and tombs that end is approximate. Egyptian temples (Karnak, Luxor, Abu Simbel) and Abydos end at c. 400 CE, when the old cults closed. The Old Kingdom tombs (Djoser, Giza) end at 30 BCE, the end of pharaonic Egypt. Behistun ends at 330 BCE, the fall of the empire that carved it. These numbers keep the markers on the map; they are not precise dates.
- `tower-of-babel` is `legendary` and has `built: null, until: null`, because a legend has no construction date. This breaks the template's "null only if still in use" rule on purpose. The integrator may want to show it at all times, or only next to Etemenanki.
- Cultures that overlap state polygons were trimmed in time. The Uruk core extent stops at 3400 BCE, when "Sumerian City-States" begins on the map, and only the northern "Uruk expansion" area continues to 3100 BCE. The later Naqada extent ends at 3000 BCE, when "Early Dynastic Period of Egypt" begins. Kerma (2500–1500 BCE) ends before the "Kingdom of Kush" realm starts in 1000 BCE. Dilmun, Umm an-Nar and the Garamantes are not realms in `public/data/clio/index.json`, so they are drawn as cultures.
- A few small rings (Dilmun, Tarout, the late Natufian Euphrates outlier, PPNB Cyprus, Badarian, early Kerma, early Ubaid) had extra vertices added at edge midpoints to reach the 8-point minimum. Their shapes are unchanged.

## Included
Sites, earliest first: ʿAin Mallaha, Raqefet Cave, Abu Hureyra, Tassili n'Ajjer, Jericho (tower and wall), Karahan Tepe, Göbekli Tepe, Çayönü, Nabta Playa, ʿAin Ghazal, Çatalhöyük, Jarmo, Ugarit, Tell Halaf, Eridu, Uruk (Eanna and the White Temple), Areni-1, Susa, Hierakonpolis, Arslantepe, Abydos, Ur (ziggurat and Royal Cemetery), Maykop kurgan, Troy, Ebla, Bat, Nineveh, Step Pyramid of Djoser, Giza, Kerma, Babylon, Dilmun Burial Mounds, Hattusa, Palmyra, Karnak, Etemenanki, Tower of Babel (legend), Luxor Temple, Abu Simbel, Chogha Zanbil, Carthage, Meroë, Marib Dam, Behistun, Persepolis, Petra, Hegra.

Cultures: Natufian, PPNA, PPNB, Capsian, Yarmukian, Hassuna, Samarra, Halaf, Shulaveri–Shomu, Ubaid, Ghassulian, Badarian, Naqada, Maadi–Buto, Uruk, A-Group, Maykop, Kura–Araxes, Umm an-Nar (Magan), Kerma, Dilmun, Garamantes.

## Left out, and why
- Shubayqa 1 (the oldest bread, c. 14,400 years ago) has no Wikipedia article and no other source I could open, so it appears in the Natufian summary instead. Nevalı Çori (now under a reservoir) and the other Taş Tepeler sites are represented by Göbekli Tepe and Karahan Tepe. Aşıklı Höyük and Hacılar were left out to keep within the 50-site cap.
- Tell Brak, Habuba Kabira, Mari, Kish, Nippur, Ashur and Nimrud are covered by the Uruk-expansion extent or by Babylon and Nineveh. Jerusalem, Byblos, Amarna, the Valley of the Kings, Philae, Gebel Barkal/Napata, Pasargadae, Alexandria and Leptis Magna were also cut for the cap. They are good candidates if the cap is raised.
- Aksum belongs to the Horn of Africa (another region) and is already a realm ("Kingdom of Axum"). Mehrgarh belongs to South Asia.
- Cultures left out: C-Group and Pan-Grave (Nubia; they overlap Kerma), the Hafit period (covered in the Bat site), Jemdet Nasr (folded into Uruk; the map shows states from 3400 BCE), Proto-Elamite (the "Elam" realm starts in 3200 BCE), Trialeti, Merimde, Faiyum A, and the Lodian/Nizzanim cultures (small, or poorly mapped).
- Legends considered and not placed: the Garden of Eden (tradition gives no locatable site), Noah's Ark (Genesis says only "the mountains of Ararat", and the Durupınar formation is natural), and Iram of the Pillars/Ubar (the Shisr identification is itself disputed). The Hanging Gardens are handled inside the Babylon summary, which says they may never have existed because no Babylonian text mentions them.

## Disputed and legendary cases
- **Tower of Babel** (`legendary`): an origin story in Genesis 11. Because the Hebrew name Babel means Babylon, modern scholars most often link it to Etemenanki. That link is a hypothesis. A similar motif appears in the Sumerian "Enmerkar and the Lord of Aratta". No archaeological evidence exists for the tower of the story. Etemenanki itself is `written`: it is attested in Nebuchadnezzar II's inscriptions, the Esagila tablet (whose 91 m height modern scholars doubt) and Herodotus, and it was demolished on Alexander's orders in 323 BCE.
- **Troy** (`disputed`): most scholars accept Hisarlık as Homer's Troy/Ilion and the Hittite Wilusa. Troy VIIa was destroyed c. 1180 BCE. There is no definitive evidence of a Greek attack, and how far the Iliad reflects real events is unresolved (Jablonka 2011, cited in Wikipedia).
- **Nabta Playa** (`disputed`): the camps, cattle burials and megaliths are well dated. Wendorf and Malville proposed solstice and star alignments (a "C-line" to Sirius c. 4800 BCE). Brophy and Rosen (2005) argued for different and earlier star alignments. Malville, Schild, Wendorf et al. (2007) answered that those dates were about 1,500 years too early, and Brophy and Rosen in turn disputed the original orientation data. The astronomical reading is therefore not settled.
- **Tassili n'Ajjer** (`disputed`): the rock art is real, but its dating is contested. The sequence used in Wikipedia (Archaic from 10,000 BCE, Round Head 7550–5050 BCE, Pastoral, Horse, Camel) follows a "long chronology". Other specialists, notably Alfred Muzzolini (cited in the article), argued for much younger dates. The site's `built: -10000` should be read as the long-chronology start.
- **Jericho's walls and Joshua**: the Neolithic wall and tower (c. 8000 BCE) are not in doubt. For the biblical story, Sellin and Watzinger (1907–1911) first thought their walls supported it and later revised that view. Kenyon (1952–58) dated the last Bronze Age destruction to the 16th century BCE, and radiocarbon gives 1617–1530 BCE, earlier than the usual date for a conquest under Joshua. Labelled `archaeology`, with this stated in the summary and evidenceNote.
- **Raqefet Cave**: the flower-lined graves (Nadel et al. 2013) are well accepted. Liu et al. (2018) proposed beer brewing, and Eitam (2019) argued the mortars were for flour. The site is labelled `archaeology` and the beer claim is described as debated.
- **Abu Hureyra**: the claim that rye was cultivated about 13,000 years ago (Hillman) is presented as "possibly", because it remains debated.
- **Carthage**: the 814 BCE founding date comes from later tradition, so the evidenceNote says so.
- **Chogha Zanbil**: an end c. 645 BCE (Ashurbanipal) is the usual view. Some researchers prefer the late 12th century BCE.
- **Identifications**: Magan with Oman/UAE (Umm an-Nar, Bat) and Dilmun with Bahrain are mainstream identifications, not certainties. Both are worded as "usually identified".

## Date choices (where sources differ)
- Natufian c. 13,000–9500 BCE (Wikipedia: 15,000–11,500 BP; some authors begin at 12,500 BCE).
- Karahan Tepe c. 9750–9400 BCE, following the article's infobox. The article's lead says 10,000–9500 BCE, and the excavations, which began in 2019, are still refining the dates.
- Hassuna is given as "early 6th millennium BCE" (6000–5500). Other syntheses put it earlier, c. 6500–6000. Samarra follows Wikipedia at 5500–4800 BCE, although Tell es-Sawwan's earliest levels are dated earlier by some.
- Badarian 4400–4000 BCE, perhaps from 5000. Naqada 4000–3000 BCE, with the Oxford radiocarbon study (Dee et al. 2013) suggesting a start around 3800–3700. Kura–Araxes 3500–2000 BCE, with some authors starting it c. 4000. A-Group from the 4th millennium to c. 2900 BCE; the 3800 BCE start is a round figure for "4th millennium".
- Marib Dam from the 8th century BCE, as in the article lead. The infobox's 1750–1700 BCE refers to earlier irrigation works. Its final failure was in 570 or 575 CE.

Counts: 47 sites (26 written, 17 archaeology, 3 disputed, 1 legendary; 29 UNESCO; 34 with images) and 22 cultures (20 archaeology, 2 written).
