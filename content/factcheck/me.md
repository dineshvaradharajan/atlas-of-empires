# Middle East: reconstruction layer (`content/supplements/me.json`, id `me`)

The layer adds 76 states as 98 time-bounded regions and 60 capitals, filling gaps in the Cliopatria border data for
Anatolia, the Levant, Mesopotamia, Arabia, Iran and the South Caucasus (plus Ikhshidid Egypt, which ruled Palestine and
southern Syria). Span 2400 BCE–1886. `replaces` = `["Khanates of the Caucasus"]`: the border data draws the South
Caucasus khanates as one polygon (1748–1796); the layer redraws them individually (1743/1747–1827), covering the same
ground. Elsewhere, where Cliopatria covers the same area with a larger or mislabelled polygon (e.g. Egypt as "Abbasid
Caliphate" in 935–969, the Eretnid realm labelled "Ottoman Empire" 1344–1401, Kakheti-Hereti inside "Kingdom of
Georgia" 1010–1104, the over-large "Hamdanid Emirates" across Azerbaijan, Jibal and the Jazira), the reconstruction is
drawn on top and nothing is hidden.

Checks:
- All rings closed, no self-intersections (segment test).
- A 0.02° grid test found no overlaps between regions active in the same years.
- Seaward edges run offshore on purpose (the app clips reconstructions to land).
- Each region was tested against the Cliopatria polygons of its years (0.1° sample grid) to confirm the gap, and
  rendered over the coastline, rivers and Cliopatria outlines (stdlib rasteriser + ffmpeg) and inspected.
- `python3 -I tools/content.py` reports nothing for this layer.

## States drawn

| State (key) | Slices |
|---|---|
| Ebla | 2400–2300 BCE |
| Mari | 1830–1797 BCE, 1775–1761 BCE |
| Yamhad | 1810–1600 BCE |
| Kizzuwatna | 1500–1400 BCE |
| Arzawa | 1450–1320 BCE |
| Ugarit | 1400–1185 BCE |
| Bit Adini | 1000–856 BCE |
| Aram-Damascus | 950–843 BCE, 842–801 BCE, 800–733 BCE |
| Ammon | 1000–582 BCE |
| Moab | 900–582 BCE |
| Edom | 850–553 BCE |
| Mannaea | 850–616 BCE |
| Marion | 600–312 BCE |
| Paphos | 600–312 BCE |
| Kourion | 600–312 BCE |
| Amathus | 600–312 BCE |
| Soli | 600–312 BCE |
| Lapathus | 600–312 BCE |
| Tamassos | 600–345 BCE |
| Idalion | 600–451 BCE |
| Kition | 600–451 BCE, 450–345 BCE, 344–333 BCE, 332–312 BCE |
| Salamis | 600–312 BCE, 332–312 BCE |
| Characene | 141 BCE–222 |
| Elymais | 147 BCE–221 |
| Hatra | 150–241 |
| Kindah | 450–528 |
| First Islamic state | 622–627, 628–629, 630–632 |
| Emirate of Tbilisi | 830–1000, 1001–1122 |
| Kingdom of Lori | 979–1065 |
| Kingdom of Kakheti-Hereti | 1014–1104 |
| Kingdom of Syunik | 987–1104 |
| Kingdom of Vanand | 963–1065 |
| Shaddadids | 951–1075 |
| Sallarids | 941–983 |
| Rawadids | 984–1071 |
| Hasanwayhids | 959–1015 |
| Kakuyids | 1008–1051 |
| Marwanids | 990–1085 |
| Uqaylids | 990–1096 |
| Mirdasids | 1024–1080 |
| Mazyadids | 961–1150 |
| Burids | 1104–1154 |
| Ikhshidids | 935–945, 946–969 |
| Nizari Ismaili state | 1090–1256, 1091–1256, 1096–1256, 1132–1256 |
| Bavand dynasty | 1074–1210, 1238–1349 |
| Salghurids | 1148–1282 |
| Hazaraspids | 1155–1424 |
| Qutlugh-Khanids | 1222–1307 |
| Eldiguzids | 1146–1194, 1195–1225 |
| Saltukids | 1081–1202 |
| Mengujekids | 1072–1228 |
| Ahlatshahs | 1100–1207 |
| Artuqids | 1102–1183, 1184–1231, 1232–1409 |
| Eretnids | 1335–1352, 1353–1378 |
| Kadi Burhan al-Din | 1381–1398 |
| Emirate of Erzincan | 1353–1410 |
| Beylik of Tacettin | 1348–1428 |
| Beylik of Lâdik | 1262–1368 |
| Beylik of Alaiye | 1293–1471 |
| Mamluk Iraq | 1704–1831 |
| Sulayhids | 1047–1055, 1066–1138 |
| Jabrids | 1417–1524 |
| Bani Khalid Emirate | 1670–1795 |
| Kathiri Sultanate | 1516–1657 |
| Mahra Sultanate | 1549–1886, 1549–1886 |
| Sultanate of Lahej | 1728–1838 |
| Erivan Khanate | 1747–1827 |
| Nakhichevan Khanate | 1747–1827 |
| Karabakh Khanate | 1748–1805 |
| Ganja Khanate | 1747–1804 |
| Shaki Khanate | 1743–1805 |
| Shirvan Khanate | 1748–1805 |
| Baku Khanate | 1747–1806 |
| Quba Khanate | 1747–1758, 1759–1806 |
| Derbent Khanate | 1747–1758 |
| Talysh Khanate | 1747–1813 |

## Maps and sources

- **Shepherd, *Historical Atlas* (1923), PCL scans:** "Asia Minor and the States of the Crusaders in Syria, about
  1140" (Burid emirate of Damascus, Artuqid/Edessa frontier, Cilicia) and "The Assyrian Empire ... 750–625 B.C."
  (Damascus, Ammon/Moab/Edom, Cyprus). Compared by eye against the printed graticule (5° lines), not georeferenced
  pixel by pixel. The 1450 BCE, 1355 and Mongol plates were consulted but show none of these states, so they are not
  cited.
- **Dates, capitals, rulers:** the English Wikipedia article for each state (fetched; listed in the layer's
  `sources`), using statements those articles cite; Wikidata Q717451 for the Lâdik dates. Middle chronology for the
  Bronze Age.
- **Extents** follow the territorial descriptions in those articles (e.g. Erivan c. 19,500 km² incl. Iğdır and
  Sharur; Nakhichevan incl. Vayots Dzor; Kizzuwatna bounded by the Taurus and Nur mountains) and physical features
  (Aras, Kura, Euphrates, Zagros and Taurus crests). No copyrighted atlas was copied.

## Skipped (from the audit's Middle East list) and why

- **Already drawn under another name:** Persian Empire, Safavid Iran, Afsharid dynasty, Zand Iran, Qajar Iran,
  Pahlavi Iran (Cliopatria dynasties); Sheba (Sabaeans); Nabataean kingdom (Nabataeans); Attalid dynasty (Kingdom of
  Pergamon); Arsacid dynasty of Armenia (Kingdom of Armenia); Hasmonean Judea, Herodian Kingdom (Judea); Babylon, Old
  Babylonian Empire, Kassite dynasty (Babylonia); Middle Assyrian Empire (Assyria); Hatti (Hittites); Lagash
  (Sumerian City-States); Anshan Persia (Elam); Tulunid Emirate (Tulunids); Muzaffarids of Iran (Muzaffarids);
  Omani Empire, Sultanate of Muscat (Yarubid dynasty, Sultanate of Oman); Sheikhdom of Kuwait (Kuwait); Emirate of
  Nejd and Hasa (Emirate of Nejd); Kingdom of Yemen, Yemen Arab Republic (North Yemen); Kingdom of Kartli-Kakheti
  (Cliopatria "Kingdom of Georgia" 1763–1802); Democratic Republic of Georgia, First Republic of Armenia (Georgia,
  Armenia 1918–1921); Ba'athist Iraq, First Republic of Iraq, Coalition Provisional Authority (Iraqi Republic);
  Republic of Kuwait 1990 (Kuwait); United Arab States (United Arab Republic + North Yemen); Arab Kingdom of Syria
  (drawn as "Kingdom of Hejaz" 1919 and the French Mandate 1920); Carchemish, Gurgum, Bit Agusi, Quwê, Palistin
  (inside the "Neo-Hittite states"/Tabal grouping or the Neo-Assyrian outline). "First Kingdom of Kakheti" is drawn
  as Kingdom of Kakheti-Hereti (the audit row will remain, the names differ).
- **Provinces or vassals inside a drawn outline:** Ostikanate of Arminiya; Principality of Galilee, Lordship of
  Ibelin (Jerusalem fiefs); Zakarid Armenia (Georgian vassal); Principality of Khachen; Mukhrani; Ardalan, Mukriyan,
  Principality of Bitlis (Kurdish emirates under Safavid/Ottoman suzerainty); Urmia, Maku and Marand khanates (inside
  the Afsharid/Zand/Qajar outline); Bit Bahiani (Assyrian vassal from 894 BCE); Amurru, Mira, Seha River Land,
  Tarḫuntašša (Hittite vassals/appanage); Sharifate of Mecca (under Fatimid, Ayyubid, Mamluk and Ottoman suzerainty,
  inside their outlines); Kingdom of Candia (Venetian Crete, inside the Republic of Venice); mutasarrifate of Mount
  Lebanon, Principality of Samos (Ottoman autonomous provinces); Russian Armenia; Armenian SSR, Georgian SSR,
  Nakhchivan ASSR, Transcaucasian SFSR (inside the USSR); the Mandate states of Aleppo, Damascus, Alawites, Jabal
  Druze, the Syrian Federation, Hatay State, Mandatory Iraq (inside the French/British mandate outlines); Colony of
  Aden, Aden Protectorate, Federation of South Arabia and the protectorate states Qu'aiti, Upper Yafa, Beihan, Dhala,
  Audhali, Wahidi Balhaf/Bir Ali, Alawi, Maflahi, Aqrabi, Upper Aulaqi (inside the British outline from 1839/1870).
  Paduspanids: long-lived but mostly vassals with a small mountain domain; left out.
- **Short-lived (under ~25 years) or ephemeral:** Republic of Ararat, Kingdom of Kurdistan, Provisional National
  Government of the Southwestern Caucasus, Turkish Republic of Aras, Republic of Batumi, Gurian Republic, Free State
  of Icaria, Autonomous Turkish Cypriot Administration, Beylik of Tanrıbermiş, Beylik of Çubukoğulları.
- **Too small or a single city:** Troy, Der, Abarsal, Kingdom of Ḫana (poorly located), Hayasa-Azzi (poorly
  located), Beylik of Dilmaç, Lordship of Chios (an Aegean island; left to the Europe pack).
- **Outside this region (Egypt, Nubia, East Africa):** Ancient Egypt, Meroë, Kerma, Dotawo, Anglo-Egyptian Sudan,
  Italian Eritrea, People's Republic of Mozambique, Democratic Republic of Sudan.

Drawn although not in the audit (no Wikidata match, or under 8 editions): Arzawa, Ammon, the Cypriot kingdoms of
Paphos, Amathus, Tamassos and Idalion, Kingdom of Syunik, Kingdom of Vanand, Shaddadids, Sallarids, Rawwadids,
Hasanwayhids, Marwanids, Uqaylids, Mirdasids, Mazyadids, Burids, Bavandids, Salghurids, Hazaraspids,
Qutlugh-Khanids, Saltukids, Shah-Armens, Kadi Burhan al-Din, Sulayhids (outside Cliopatria's 1056–1065), Jabrids
and the khanates of Karabakh, Ganja, Shaki, Shirvan, Baku, Quba, Derbent and Talysh.

## Uncertainties

- **Every frontier is a reconstruction.** Medieval and ancient sources rarely describe borders; the polygons show
  core territory, following rivers and mountain crests where the articles name them.
- **Cyprus:** the division of the island among ten kingdoms is wholly conjectural; dates start at 600 BCE for all
  kingdoms although some are first attested later (Marion, Lapathus) and Kition's annexations (Idalion c. 450,
  Tamassos 340s) are approximate.
- **Bronze Age dates** use the middle chronology (Mari, Yamhad, Ebla); Kizzuwatna and Arzawa dates are approximate.
- **Kinda** and the 630–632 slice of the **First Islamic state** show tribal hegemony, not administered territory.
- **Status:** several states drawn were nominal vassals but effectively autonomous (Characene, Elymais, Hatra,
  Ikhshidids, Burids, Mazyadids, the atabegates, the Mamluk pashas of Baghdad, the khanates under Iranian
  suzerainty). Kingdom of Vanand's independence from Ani is disputed.
- **Dates that differ between sources:** Shirvan Khanate (Wikipedia 1761–1820; drawn from 1748, when khans ruled at
  Shamakhi); Hazaraspids (Wikipedia from 1115, drawn from 1155); Salghurid end (1282 per Wikidata; Abish Khatun
  ruled into the mid-1280s); Mirdasids (from 1024, earlier claims 1014); Jabrids (early 15th century–1520s,
  approximate); Derbent's annexation by Quba (1759).
- **Hadhramaut** after 1657 (Zaydi occupation, then fragmentation among Kathiri, Yafa'i and Qu'aiti powers) is left
  empty rather than guessed.
- The **Eretnid** extent before 1352 follows the shape Cliopatria itself draws (as "Ottoman Empire") for central and
  eastern Anatolia; the split of 1352–1353 (Erzincan autonomous) is simplified to one date.
