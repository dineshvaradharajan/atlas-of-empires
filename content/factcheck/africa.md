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
