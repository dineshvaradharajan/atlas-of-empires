# Africa regional fact-check (post-pharaonic Africa)

Scope: `northern-africa` and `southern-africa` region texts for every era from -323 to 2000; African powers and events in the overviews; profiles for Kush (Meroitic phase), Carthage, the Ptolemaic kingdom, Aksum, Ghana, Mali, Kanem-Bornu, Great Zimbabwe, Kongo, the Ethiopian Empire, the Fatimids, Almohads, Mamluks, Songhai, Sokoto, Zulu, Asante, Mutapa, Merina, Morocco, South Africa, the Boer republics, Liberia, Belgium/Belgian Congo, and the Omani empire's Swahili side. I also checked the African claims in the colonial-empire profiles (Portuguese, British, French, Italian, German and Spanish).

Main authorities, all opened as full text on archive.org:
- UNESCO *General History of Africa* (GHA) II (Mokhtar 1981): https://archive.org/details/general-history-of-africa-vol-2
- GHA III (El Fasi & Hrbek 1988): https://archive.org/details/general-history-of-africa-vol-3
- GHA IV (Niane 1984): https://archive.org/details/unesco_general_history_africa_iv
- GHA V (Ogot 1992): https://archive.org/details/general-history-of-africa-vol-5
- GHA VI (Ajayi 1989): https://archive.org/details/general_history_africa_vi

Peak areas: Taagepera (1979, 1997) and Turchin, Adams & Hall (2006). I took these figures from the table in Wikipedia's *List of largest empires*, which cites them. I did not open the original papers.

Note: when I re-checked the files, the general fact-checkers had already fixed several errors I found. These are no longer in the patch:
- the Idrisid capital in 800, which was Walila/Volubilis, not Fez (GHA III pp. 254–5);
- the Mapungubwe chronology at 1100 and 1200;
- Said bin Sultan's seat in 1815.

Their fixes agree with GHA III, GHA VI and Huffman's chronology.

## Corrections (27, in `africa-patch.json`)

### Eras
- [500] regions.northern-africa: "the kingdom of Ghana is growing rich on trans-Saharan trade in gold and salt" → "may already be taking shape, though its great trans-Saharan gold trade is not recorded until the 700s". Reason: GHA III ch. 18, p. 475 dates Kumbi Saleh's gold trade to "not later than the eighth century", and the first written reference is al-Fazari, late 8th century. GHA III p. 129 allows that the state was founded much earlier, so I hedged the claim rather than deleting it.
- [600] regions.northern-africa: "The kingdom of Ghana prospers from gold and salt trade" → "is probably emerging, though written records of its gold trade begin only in the 700s". Same reason and source.
- [900] regions.northern-africa: Igbo-Ukwu "in the Niger delta region" → "in south-eastern Nigeria, east of the lower Niger". GHA III p. 477 places it about 35 km from Onitsha, which is not in the delta.
- [1100] regions.northern-africa: "whose king Hummay converted to Islam around 1085" → "whose Muslim king Hummay (c. 1075–1086) founded the Sayfawa dynasty". GHA III ch. 15 (Lange), pp. 445, 459–60: Hummay came to power c. 1075 and "was not the first Muslim ruler of Kanem". This also makes the era text match the Kanem-Bornu profile.
- [1783] regions.southern-africa: "The Omani Busaidi rulers controlled Zanzibar and the Swahili coast" → "held Zanzibar and claimed the Swahili coast, though their Mazrui governors in Mombasa acted almost independently". GHA VI ch. 9 (Salim), pp. 211–12.
- [1783] regions.southern-africa: Andrianampoinimerina "from about 1787" → "from about 1785". GHA VI ch. 16, p. 413: "In about 1785 Ramboasalama … proclaimed himself king under the name of Andrianampoinimerina".
- [1800] regions.southern-africa: "Oman ruled Zanzibar and the Swahili coast" → "Oman held Zanzibar and Kilwa, while its Mazrui governors in Mombasa were virtually independent". GHA VI pp. 211–12: around 1800 the Omani presence was "significantly evident in only three main centres: Mombasa, Zanzibar and Kilwa", and even Mombasa's Mazrui were autonomous. Said did not take Mombasa until 1837 (GHA VI p. 220).
- [-100] powers[6].extent (Ptolemaic Kingdom): "Egypt and Cyprus" → "Egypt (Cyprus was held by his exiled brother Ptolemy IX)". Ptolemy IX ruled Cyprus 105–88 BCE, and Ptolemy Apion held Cyrenaica until 96. Source: https://en.wikipedia.org/wiki/Ptolemy_IX_Soter_II

### Profiles
- [kingdom-of-kush] summary: "Aksum's armies finished it around 350" → Meroë "seems to have already collapsed when Aksum's armies raided the region around 350". GHA II ch. 10, p. 293: "the Meroitic kingdom had already collapsed at the time of Ezana's campaign".
- [kingdom-of-aksum] peak.year 525 → 350, and peak.note rewritten. The 1.25M km² figure is Turchin, Adams & Hall's (2006) estimate for c. 350 under Ezana. The new note says Kaleb also ruled Yemen in the 520s.
- [ghana-empire] rulers[0].reign "c. 4th century (oral tradition)" → "date unknown (tradition; Delafosse placed him in the late 8th century)". GHA III ch. 13 (Barry), p. 129: in Delafosse's reconstruction Kaya Maghan Cissé is the first Soninke tunka, "towards the end of the second/eighth century".
- [mali-empire] peak.areaKm2 1,300,000 → 1,100,000, and the Taagepera (1997) figure for c. 1380 added to the note.
- [fatimid-caliphate] rulers[3].note "Longest reign of any Muslim ruler" → "Longest reign of any caliph". Al-Mustansir reigned c. 60 lunar years. By 2026 Hassanal Bolkiah of Brunei (since 1967) has reigned longer, and Wikipedia's lead now calls al-Mustansir only "one of" the longest-reigning Muslim rulers. Source: https://en.wikipedia.org/wiki/Al-Mustansir_Billah
- [fatimid-caliphate] peak.note: added that Taagepera (1997) and Turchin et al. (2006) give c. 4.1M km² for 969, counting nominal Saharan lands. I left areaKm2 at 1.8M because it matches the mapped polygon (1.95M max in 970–1014). The editors should decide which figure to show.
- [almohad-caliphate] peak.note: added "c. 2.0–2.3M km² (Taagepera 1997; Turchin et al. 2006)". This agrees with the existing 2.3M.
- [mamluk-sultanate] peak.note: added "c. 2.1M km² (Taagepera 1997)". This agrees with the existing figure.
- [ptolemaic-kingdom] peak.note: added "c. 1.0M km² (Taagepera 1979, for c. 301 BCE)".
- [carthaginian-empire] peak.note: added Taagepera's c. 0.3M km² for c. 220 BCE.
- [songhai-empire] peak.areaKm2 1,400,000 → 800,000 and peak.year 1500 → 1550, with the source in the note. Taagepera (1997) gives 0.8M km² for 1550. The popular 1.4M figure has no scholarly source I could find, and the map polygon peaks at 0.67M.
- [morocco] rulers[1].note "Victor at the Battle of the Three Kings" → "Proclaimed sultan on the field of the Battle of the Three Kings". The summary is reworded to match. GHA V ch. 8, pp. 208–9: Sultan Abd al-Malik died during the battle, and Ahmad was "proclaimed king after the victory (which gave him his name, al-Mansur)".
- [merina-kingdom] rulers[1].reign "c. 1787–1810" → "c. 1785–1810", and the summary's "Around 1787" → "Around 1785". GHA VI p. 413.

I also added sources (GHA volumes, Wikipedia for Mapungubwe, SAHO, Said bin Sultan, Ptolemy IX, and List of largest empires) to every era item and profile I touched, plus Kanem-Bornu and the Omani empire.

## Border / extent discrepancies (`public/data/clio/index.json`, not changeable here)
1. **Ptolemaic Kingdom**: polygons for -331..-327 (1.22M km²) and -326..-324 (4.83M km²) come before the kingdom existed (Ptolemy took the royal title in 305 BCE). The 4.83M figure is on the scale of Alexander's whole empire, so it is clearly a mislabel.
2. **Almohad Caliphate, 1260–1343 (388,669 km²)**: the Almohads fell in 1269. This polygon has exactly the area of the Marinid Sultanate in 1250–1259, and the Marinid timeline has a gap over the same years (1260–1343). It is a Marinid polygon labelled Almohad. Also, the 1250–1259 Almohad polygon is only 1,199 km², although they still held Marrakesh until 1269.
3. **Saadi Sultanate, 1556–1740**: the Saadis lost power in 1659 and the Alaouites ruled from the 1660s. The 1640–1669 polygon (384k) and the 653 km² polygon for 1670–1740 should not carry the Saadi name.
4. **Empire of Kanem, 1072–1384: only 20,167 km²**. This is far too small for a state that GHA III ch. 15 describes as ruling Kanem from the 9th century, and that Dunama Dabbalemi extended into the Sahara toward the Fezzan. It also starts too late: Kanem is attested from al-Ya'qubi's account of 872 (GHA III p. 445).
5. **Mali Empire**: the largest polygon is 1415–1462 (1.11M km²), while the 14th century has 973k. Mali's height was the 14th century (Taagepera's peak is 1380). The two periods look swapped or mis-dated.
6. **Mamluk Sultanate** starts in 1241. The 1241–1249 polygon (287k) is Ayyubid Egypt; the Mamluk state began in 1250.
7. **Kingdom of Kongo** covers only 1440–1669. The kingdom was founded c. 1390 and survived in weakened form until 1914.
8. **Great Zimbabwe and Mutapa** have no polygons at all; both profiles have an empty `clio`.
9. **Ashanti Empire** ends in 1897 (annexation was 1902) and peaks at 187k, below Iliffe's "over 250,000 km²" (via Wikipedia's list) and the profile's 259k.
10. **Natalia Republic** is labelled 1840–1910, but Britain annexed Natalia in 1843. The later polygons are the Colony of Natal.
11. **"People's Republic of Zanzibar"** is used for 1856–1889. That name dates from 1964; this is the Sultanate of Zanzibar.
12. **South Africa** starts in 1932, although the Union dates from 1910. Its 1932–1989 area (2.06M) includes the South West Africa mandate.
13. Minor issues:
   - The Tulunids run to 910, but the dynasty ended in 905 (era text 900 correctly says 905).
   - The Mahdist State starts in 1890 instead of 1885.
   - Songhai has 112–224 km² remnants for 1595–1608 (the Dendi rump, acceptable).
   - The Almoravid 1152–1205 remnant of 6,926 km² is the Banu Ghaniya in the Balearics (acceptable).

## Unverifiable / disputed (no change made)
- **Mapungubwe chronology**: SAHO follows the older chronology (capital on the hill c. 1045). Huffman (2005) and Chirikure et al. (2015) put it at c. 1220–1300. The current era texts follow Huffman, which is the modern consensus.
- **Hummay's dates**: GHA III gives both c. 1075–1086 (Lange, ch. 15) and c. 1080/1085–1097 (chs 3 and 4). The profile's c. 1075–1086 follows Lange.
- **Zulu Kingdom peak area**: the profile has 30,000 km² for the core kingdom, and the map has 25–26k. Gluckman (via Wikipedia's list) gives about 80,000 sq mi for 1822, which counts tributary lands. I left it alone because the profile note already explains this.
- **Kanem-Bornu (500k at 1590), Mutapa (500k), Ghana (350k), Sokoto (470k)**: these areas have no Taagepera/Turchin figure. Wesseling (via Wikipedia's list) gives Sokoto about 400k, so 470k is plausible. The map's Sokoto polygon is about 0.8M.
- **Ghana's start date (300)**: GHA III p. 129 says the foundations may be much older (1st millennium BCE hypotheses). The date is kept as conventional.
- **Asante**: Osei Bonsu's reign is given variously as 1800/1801/1804–1823/24.
- **Mutapa's end date (1760)**: a Zambezi-valley Mutapa state survived later. I did not verify this against an authority.

Items checked: 40 era items (every era from -323 to 2000, Africa regions plus African powers and events) and 25 profiles. Proposed corrections: 27, plus 30 source additions. Most era texts held up well against GHA II–VI, including ruler names, reign dates and battle dates from 1492 to 2000.


---

# Africa layer pack: reconstruction layer (`content/supplements/africa.json`, id `africa`)

This section is the log for the Africa layer pack (brief: `content/REGION_LAYERS.md`; the audit's "Sub-Saharan Africa" and "North Africa" sections). The fact-check above is a separate, earlier piece of work.

The layer adds **89 states as 117 time-bounded regions (430–1911) and 58 capitals**. `replaces` is empty: no realm in the border data is hidden. Where the border data covers the same ground with a large or crude polygon, the reconstruction is drawn on top of it, and the region's note says so. Examples are Oyo over Dahomey (1728–1840), Bornu over Baguirmi, Ethiopia over Aussa (1734–50), Mali over Gao (to 1299) and over Jolof and Kaabu, Umayyad over Altava and the Aurès (680s–700s), and Portugal's Angola outline over Kasanje (1885–1911).

**Pre-colonial African frontiers are especially approximate.** Few were surveyed or described, and many of these states ruled people, tribute and trade routes more than fixed land. Each outline is a conservative core: the lands under a state's own officials, not its sphere of tribute. Every region's `note` says this. Shapes are hand-placed control polygons, smoothed and densified to about 0.1° spacing. Seaward edges run offshore on purpose, because the coastline clip handles the sea.

Checks:
- All rings are closed.
- A 0.02° grid test found no overlaps between regions of this layer active in the same years.
- No region overlaps another layer's region. No other layer has regions in Africa; the nearest are the taifa of Málaga and Marion on Cyprus.
- I rendered every slice over the modern borders, the border data's realms for that year, and Natural Earth rivers and lakes, and looked at it (SVG to PNG via qlmanage).
- `python3 -I tools/content.py` reports nothing about this file. Its pre-existing warning "empire mutapa: no Cliopatria link" concerns the Mutapa profile, which still has no realm in the border data.

## Sources and how the maps were used

Dates, rulers and capitals come from the cited statements in the English Wikipedia articles listed in the layer's `sources`, fetched in full through the MediaWiki API. Where an article disagreed with the audit's dates, I followed the article and say so in the note. Examples: Agadez founded c. 1405, not 1449; Brakna from 1674; Futa Toro annexed 1859; Gumma conquered 1885; Warsangali consolidated from 1613; Pate's battle of Shela in 1813; Jolof losing Futa Toro in 1513 and Sine and Saloum in 1520.

Positions and extents come from freely licensed Commons maps. I georeferenced each on named towns or on its printed graticule:
- *Map of western Hausaland in the late 18th century* (CC BY-SA 4.0). Georeferenced on Birnin Kebbi, Jebba, Zaria and Say (about 320 px/°). Used for Gobir, Zamfara, Kebbi, Katsina's west, Zazzau and Nupe.
- *Map of the Jolof Empire* (CC0). Georeferenced on Cap-Vert, Podor and Barra (240 px/°). Used for the Wolof states and Saloum.
- *Kongo 1648* (J. Thornton; CC BY-SA 3.0). Georeferenced on its printed graticule. Used for Matamba, Ndongo and Loango.
- *Gibe kingdoms* (CC BY-SA 4.0). Gives the relative positions of the five Gibe kingdoms, checked against the borders stated in the articles (Gomma: Limmu to the north, Gumma to the west, Gera to the south).
- *Great Lakes Kingdoms* (CC BY-SA 3.0). Gives relative positions only.
- *Map sketches of the development of the Luba-Lunda Empire* (public domain). Used for Luba and Lunda.

I did not use the UNESCO *General History of Africa*, Shepherd or Ajayi & Crowder for this layer, so they are not cited.

## States drawn (key: slices)

| State | Slices |
|---|---|
| Jolof | 1360–1519, 1520–1549, 1550–1890 |
| Waalo | 1550–1855 |
| Cayor | 1550–1879 |
| Baol | 1555–1894 |
| Kingdom of Sine | 1520–1891 |
| Saloum | 1520–1891 |
| Kaabu | 1537–1867 |
| Empire of Great Fulo | 1513–1775 |
| Imamate of Futa Toro | 1776–1859 |
| Bundu | 1690–1858 |
| Imamate of Futa Jallon | 1725–1896 |
| Emirate of Trarza | 1640–1902 |
| Emirate of Brakna | 1674–1903 |
| Kaarta | 1754–1854 |
| Toucouleur Empire | 1855–1861, 1862–1890 |
| Wassoulou Empire | 1878–1891, 1892–1898 |
| Kénédougou Kingdom | 1825–1898 |
| Kong Empire | 1710–1745, 1746–1897 |
| Wogodogo | 1495–1896 |
| Yatenga | 1540–1895 |
| Kingdom of Dagbon | 1420–1896 |
| Gonja | 1675–1743 |
| Denkyira | 1620–1701 |
| Akwamu | 1629–1676, 1677–1730 |
| Kingdom of Allada | 1600–1723 |
| Kingdom of Whydah | 1650–1727 |
| Kingdom of Dahomey | 1625–1723, 1724–1727, 1728–1840, 1841–1894 |
| Kingdom of Benin | 1200–1439, 1440–1699, 1700–1897 |
| Nupe Kingdom | 1531–1804 |
| Kingdom of Kano | 1000–1804 |
| Kingdom of Katsina | 1350–1804 |
| Zazzau | 1450–1804 |
| Gobir | 1450–1699, 1700–1755, 1756–1804 |
| Kingdom of Zamfara | 1715–1755, 1756–1804 |
| Kingdom of Kebbi | 1516–1714, 1715–1804 |
| Gao Empire | 800–1299 |
| Dendi Kingdom | 1609–1700, 1701–1898 |
| Sultanate of Agadez | 1405–1899 |
| Sultanate of Damagaram | 1731–1850, 1851–1899 |
| Kingdom of Baguirmi | 1522–1897 |
| Mauro-Roman Kingdom | 430–578 |
| Kingdom of Altava | 579–700 |
| Kingdom of the Aurès | 484–703 |
| Sultanate of Tuggurt | 1414–1854 |
| Sultanate of Shewa | 900–1284 |
| Kingdom of Damot | 1100–1316 |
| Kingdom of Kaffa | 1390–1897 |
| Kingdom of Jimma | 1790–1884 |
| Limmu-Ennarea | 1801–1891 |
| Kingdom of Gomma | 1780–1886 |
| Kingdom of Gumma | 1770–1885 |
| Kingdom of Gera | 1835–1887 |
| Sultanate of Aussa | 1734–1895 |
| Shilluk Kingdom | 1490–1861 |
| Warsangali Sultanate | 1613–1886 |
| Sultanate of Mogadishu | 1250–1499 |
| Ajuran Sultanate | 1500–1695 |
| Geledi Sultanate | 1700–1889 |
| Kilwa Sultanate | 1000–1505 |
| Pate Sultanate | 1300–1813 |
| Buganda | 1500–1699, 1700–1894 |
| Bunyoro | 1500–1830, 1831–1899 |
| Ankole | 1500–1899 |
| Karagwe | 1450–1890 |
| Kingdom of Rwanda | 1600–1799, 1800–1897 |
| Kingdom of Burundi | 1680–1794, 1795–1899 |
| Kingdom of Loango | 1565–1883 |
| Kingdom of Ndongo | 1556–1579, 1580–1625 |
| Kingdom of Matamba | 1631–1744 |
| Kasanje Kingdom | 1620–1911 |
| Kuba Kingdom | 1625–1900 |
| Luba Empire | 1585–1799, 1800–1889 |
| Lunda Empire | 1680–1749, 1750–1887 |
| Kingdom of Kazembe | 1740–1894 |
| Kingdom of Mapungubwe | 1075–1290 |
| Kingdom of Zimbabwe | 1250–1450 |
| Kingdom of Mutapa | 1450–1628, 1629–1760 |
| Kingdom of Butua | 1451–1683 |
| Rozvi Empire | 1684–1834 |
| Mthwakazi | 1840–1893 |
| Maravi | 1480–1720 |
| Gaza Empire | 1824–1839, 1840–1895 |
| Mthethwa Paramountcy | 1780–1817 |
| Ndwandwe | 1780–1819 |
| Basotho Kingdom | 1824–1855, 1856–1868 |
| Barotseland | 1750–1839, 1864–1899 |
| Kololo Kingdom | 1840–1863 |
| Boina Kingdom | 1690–1823 |
| Menabe | 1650–1823 |


## Audit entries skipped, and why

- **Colonial units and protectorates:** Congo Free State, the International Association of the Congo, German East and South-West Africa, South-West Africa, Ruanda-Urundi, British Somaliland, Bechuanaland, Basutoland, Portuguese Mozambique, the British and French Togolands and Cameroons, Orange River Colony and Sovereignty, Dutch Loango-Angola, Italian Ethiopia, Spanish Sahara, the British Military Administration in Libya.
- **Post-colonial regimes and federations on the same territory as a drawn state:** Tanganyika, Union of South Africa, Upper Volta, the Federation of Rhodesia and Nyasaland, Central African Empire, the PDR of Ethiopia, the Senegambia Confederation, the People's Republic of Benin, Republic of Dahomey, Somali Democratic Republic, Somali Republic, State of Somaliland (1960), the People's Republic of the Congo, South Kasai, Republic of Cabinda, Federation of Ethiopia and Eritrea, Kenya 1963–64, the Federation and First and Second Republics of Nigeria, the Commonwealth realms of the Gambia, Uganda and Sierra Leone, Malagasy Republic, State of the Comoros, Sahel-Benin Union, the Federation of Arab Republics, Libyan Jamahiriya, Maakhir and Northland State (2007–09).
- **Already drawn under another name:**
  - Zulu Kingdom = the border data's "Zululand" (1820–1897).
  - Kingdom of Tlemcen = "Zayyanid dynasty".
  - Kingdom of Fes = the Idrisid, Marinid, Wattasid and Saadi realms and Morocco.
  - Empire Peul (Q536476, Wikipedia "Caliphate of Hamdullahi") = "Massina Empire" (1820–1861).
- **Inside a drawn state's outline, and not effectively independent:** Adamawa Emirate (a Sokoto emirate; the border data's Sokoto outline covers Yola); Hadiya (an Ethiopian tributary from the 1330s, inside the Ethiopian outline); Bida Emirate after 1835 (within Sokoto; the earlier Nupe Kingdom is drawn).
- **Too small, or short-lived, to draw at about 0.05°:** Republic of Salé (a pair of port towns); the Kotoko city-states; the Boer mini-republics (Stellaland, Goshen, Klein Vrystaat, Upingtonia, Lydenburg, Graaff-Reinet, Swellendam); Republic of Maryland (1854–57); the Tripolitanian Republic (1918–22, inside the Italian outline); the Kingdom of the Canary Islands (a Castilian vassal fief).
- **Not territorial, or location unknown:** Land of Punt (location disputed); Kingdom of Nri (ritual hegemony without defined territory); Aro Confederacy (a trade and oracle network); Empire of Kitara (legendary); Darawiish (1895–1920, a mobile resistance state inside the British and Italian outlines); the Hausa Kingdoms as a group (drawn individually instead).
- **Drawn, but under a name the audit's loose match will not catch, so they will stay listed:**
  - Ajuuraan state = "Ajuran Sultanate".
  - Pate Island = "Pate Sultanate".
  - Kingdom of Baluba = "Luba Empire".
  - Rozwi Empire = "Rozvi Empire".
  - Great Ardra = "Kingdom of Allada (Ardra)".
  - Bida Emirate = "Nupe Kingdom" (to 1804).
- **Not drawn for lack of time or evidence:**
  - Kingdom of Garo (Bosha), Baté Empire, Kingdom of Kuku and Ait Abbas: the last two are probably inside the Ottoman and Algiers outlines.
  - Kanem before 1072, the Yeke kingdom of Msiri, Kakongo and Ngoyo, Borgu, Tio (Anziku).
  - Kongo between 1670 and 1708: the border data draws Kongo to 1669 and again from 1709, through its mislabelled "Kingdom of Lunda" polygon, which corrections.json relabels Kongo.

Additions not in the audit: the audit matches Cliopatria by Wikidata id, and the mislabelled "Kingdom of Lunda" hid the real gap. I added the Lunda Empire, plus Futa Jallon, Kaarta, the Toucouleur Empire's first phase, Mossi Wogodogo and Yatenga, Dagbon, Gonja, Denkyira, Akwamu, Whydah, Allada, Nupe, the Hausa kingdoms, Ndongo, Matamba, Kasanje, Kuba, Luba, Kazembe, the Kingdom of Zimbabwe, Mthwakazi, the Basotho, Lozi and Kololo kingdoms, Menabe, Rwanda, Karagwe, the Sultanate of Shewa and the Kingdom of the Aurès.

## Uncertainties

- **Founding dates from king-lists and oral tradition** are marked as such in the notes: Benin, Mossi, Dagbon, Buganda, Bunyoro, Rwanda, Burundi, Karagwe, Kaffa, Shilluk, Kilwa, Pate, Sultanate of Shewa (896 rests on one chronicle entry), Damot, Gao, Kano and Katsina.
  - Katsina's Korau dynasty is now put in the mid-15th century; older works date it to c. 1348.
  - Mossi founding: c. 1495 is used here; tradition gives 1050–1182.
- **Archaeological states** (Mapungubwe, Great Zimbabwe) have extents inferred from site distributions.
- **Late-Roman Mauretania:** scholars disagree whether Masuna ruled one kingdom and how large it was.
- **Nomadic emirates** (Trarza, Brakna) and the Tuareg sultanate of Agadez had no fixed frontiers; only their core lands are outlined.
- **Gibe kingdoms:** small, and placed by their stated neighbours rather than traced.
- **End dates are effective-control dates and sit near colonial claims.** The border data's colonial outlines often start earlier, at the Berlin-era claims. Kasanje (to 1911) and Samori's second state (1892–98) are drawn on top of them. Ankole and Burundi end in 1899, Boina and Menabe in 1823, and Gonja in 1743, to avoid long overlaps with drawn outlines; their notes give the real end dates.
