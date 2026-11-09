# Americas regional fact-check

Scope: region keys `northern-north-america`, `southern-north-america`, `northern-south-america` and `southern-cone` in all 47 era chapters. Also the American sentences in `overview`, `powers` and `events`, and these profiles: Olmec, Maya, Teotihuacan, Aztec, Tiwanaku, Wari, Chimú, Inca, Thule (a2-early) and United States, Mexico, Gran Colombia, Brazil, Argentina, Canada, Haiti, plus the American parts of the Spanish and Portuguese empires (b-late).

Patch file: `content/factcheck/americas-patch.json` (14 text corrections, 15 addSource entries).

## Sources and access
- Opened and used: Martin & Velásquez García, "Polities and Places: Tracing the Toponyms of the Snake Dynasty", and Helmke & Awe, "Sharper than a Serpent's Tooth", both in *The PARI Journal* 17(2), 2016 (https://www.mesoweb.com/pari/journal/archive/PARI1702.pdf). These are the specialist epigraphic update to Martin & Grube's *Chronicle of the Maya Kings and Queens*. Also opened: Smith 2001, PNAS 98(4) (plant domestication); a summary of Friesen & Arnold 2008, *American Antiquity* 73(3):527–538, at historicalclimatology.com; *The Canadian Encyclopedia* (Dorset culture); and English Wikipedia pages where they cite the specialist literature (Kavanagh in HNAI vol. 13 for the Comanche, McCaa for Huayna Capac, Cyphers for San Lorenzo).
- Not readable: D'Altroy, *The Incas*; the *Cambridge History of the Native Peoples of the Americas*; HNAI vols 5, 9 and 13; and the *Cambridge History of Latin America*. Internet Archive has all of them, but only as lending copies, and full-text search returned 403. Britannica (403) and Cambridge Core were not reachable either. I cite none of these as opened.

## Corrections (old → new, reason, citation)
1. [-3000] regions.southern-north-america: "small-cobbed maize alongside squash and beans" → "small-cobbed maize alongside squash". Directly dated domesticated common beans in Mexico are only about 2,300 cal. years old (Coxcatlán Cave), so beans at 3000 BCE are an anachronism. Sources: Smith 2001, PNAS, https://pmc.ncbi.nlm.nih.gov/articles/PMC33375; Kaplan & Lynch 1999, *Economic Botany* 53(3).
2. [-1000] regions.southern-north-america: "are at their height at San Lorenzo … and La Venta is rising" → "rule from San Lorenzo … though its heyday is ending as La Venta rises". San Lorenzo peaked c. 1400–1000 BCE and declined in the Nacaste phase (c. 1000–800 BCE). https://en.wikipedia.org/wiki/San_Lorenzo_Tenochtitl%C3%A1n
3. [500] overview: "the Maya cities of Tikal and Calakmul are locked in rivalry" → "the Maya city of Tikal and the Kaan (Snake) kingdom, later ruled from Calakmul, are locked in rivalry". The Snake dynasty ruled from Dzibanché until the civil war of 636 and only then took Calakmul as its seat. The region text was already fixed by another agent; this brings the overview into line. Source: PARI Journal 17(2):23–33.
4. [1000] regions.northern-north-america: "The Thule people are beginning to expand east from Alaska, displacing the Dorset." → the Thule culture is taking shape in Alaska, and its migration begins only around 1200. Friesen & Arnold (2008) date the Thule spread to no earlier than the 13th century, and this is now the consensus. It also matches the atlas's own Thule profile.
5. [1100] regions.northern-north-america: Thule "spreading eastward across the Canadian Arctic … replacing the Dorset" → Thule still in Alaska, with the Dorset holding the Canadian Arctic. Same source.
6. [1200] regions.northern-north-america: Thule "have spread across the Arctic and are reaching Greenland … The Dorset culture is disappearing" → "are beginning a rapid migration east … within a century will reach Greenland". Dorset lasted to c. 1300–1400 CE (Canadian Encyclopedia).
7. [1400] regions.northern-south-america: removed a stray "(c.)" after "Viracocha Inca" (editorial).
8. [1650] regions.southern-north-america: removed "Powhatan" from the "powerful Indigenous nations". The Powhatan paramount chiefdom was dissolved by the Treaty of 1646. https://en.wikipedia.org/wiki/Powhatan_Confederacy. Another agent had already replaced the anachronistic "Comanche" with "Apache".
9. [1800] regions.southern-north-america: "Thomas Jefferson won the election that year." → Jefferson won, but his tie with Burr was settled by the House only on 17 Feb 1801. https://en.wikipedia.org/wiki/1800_United_States_presidential_election
10. [1880] regions.southern-north-america: "Spain still rules Cuba and Puerto Rico, where a ten-year independence war ended in 1878" → "Spain still rules Puerto Rico and Cuba, where …". The Ten Years' War was fought in Cuba only. https://en.wikipedia.org/wiki/Ten_Years%27_War
11. [1900] events[3].text: "the US takes Cuba, Puerto Rico, Guam and the Philippines" → "the US occupies Cuba and takes Puerto Rico, Guam and the Philippines". Spain gave up Cuba, which was to become independent, but ceded the other three. https://en.wikipedia.org/wiki/Treaty_of_Paris_(1898)
12. [2000] regions.northern-south-america: "Ecuador replaces its currency with the US dollar after a January coup" → "Ecuador adopts the US dollar, a plan announced just before a January coup". Mahuad announced dollarization before the 21 January coup. https://en.wikipedia.org/wiki/2000_Ecuadorian_coup_d%27%C3%A9tat
13. [inca-empire] rulers[3].note: "died of smallpox" → "died in an epidemic, possibly smallpox". The cause is disputed. https://en.wikipedia.org/wiki/Huayna_Capac
14. [canada] rulers[2].reign: Mackenzie King "1921–1930, 1935–1948" → "1921–1926, 1926–1930, 1935–1948". Meighen governed briefly in 1926. https://en.wikipedia.org/wiki/William_Lyon_Mackenzie_King

### Errors I found that other agents had already fixed (confirmed, no patch needed)
- [500] and [600] Kaan dynasty placed at Calakmul before c. 635. Now reads Dzibanché, then Calakmul.
- [1500] "Corte-Real brothers" in 1500. Now Gaspar Corte-Real, 1500–1501; Miguel sailed only in 1502.
- [1600] and [1650] "Comanche". Now "Apache". The Comanche are first recorded in 1706; "Apache" is first recorded in 1598.
- [1815] "a series of Supreme Directors since 1810". Now juntas, triumvirates and, from 1814, Supreme Directors.

## Disputed or unverified (no patch)
- [500] southern-cone: Aguada culture at 500 CE. It is usually dated c. 600–900/950 CE. I could not open a source, so no patch.
- [-1500] northern-north-america: the "Independence" tradition at 1500 BCE. Independence I is usually dated c. 2400–1800 BCE, so this may be slightly late. Minor.
- [700] "was setting up missions in Texas": the East Texas missions were abandoned in 1693 and refounded in 1716. Minor.
- [spanish-empire] summary: "mainland American colonies won independence by 1825". The last royalist holdouts (Callao, Chiloé) fell in January 1826.
- [united-states] Theodore Roosevelt "Built the Panama Canal": construction ran 1904–1914, after his presidency, but contemporaries (Goethals) called him its real builder. Acceptable shorthand.
- [gran-colombia] peak.areaKm2 2,400,000: Wikipedia's infobox gives 3,064,800 km², and the map shows 2.85–4.32M. Figures vary with claimed Amazon and Mosquito Coast lands. Flagged, not patched.
- Profile peak areas for Olmec (50,000), Teotihuacan (40,000), Tiwanaku (500,000) and Maya (400,000) describe culture or influence zones, not states. No Taagepera or Turchin figures exist for them. The Inca's 2.0M km² matches Taagepera.
- I checked all the other dated claims in the four region keys for 1492–2000 (rulers, coups, treaties, elections) and found them correct.

## Border and extent discrepancies (map data vs authorities; borders not editable)
Basemap snapshots (`data/names/<Y>.txt`):
- Inca at 1492: the polygon "Quechua" is only 779,089 km². By Rowe/D'Altroy chronology, Topa Inca (1471–93) had already conquered Chimor, Quito and Chile to the Maule (c. 1.8–2.0M km²), and the 1492 text says "from Ecuador to central Chile". Cliopatria also shows only 537k km² for 1482–1496 and 155k km² for 1450–1474, which lags far behind the conquests of c. 1463–1471.
- Inca Empire still drawn at 1600 (1,171,951 km²), and there is no Viceroyalty of Peru polygon at 1600. The Inca fell in 1532–33 and Vilcabamba in 1572. Cliopatria likewise keeps "Inca Empire" at 2.08M km² for 1534–1539.
- Huari (Wari) Empire drawn at 1000, 1100 and 1200 (c. 425,000 km²). Wari collapsed c. 1000 (the profile ends at 1000).
- Toltec Empire drawn at 1200, but Tula fell c. 1150.
- Thule drawn already at 800 and 900 (566,528 km²), while Dorset covers 1.89M km² until 1200. The Thule culture formed c. 1000 and migrated c. 1200–1300.
- No Tiwanaku polygon at any snapshot, although the text treats it as a major power from 500 to 1000.
- Teotihuacan drawn at -323 and -300, before the city existed (earliest buildings c. 200 BCE), and still drawn at 600 and 700 after the c. 550 burning. Cliopatria runs to 704.
- Chavín drawn at -200 and -100, but it ended c. 250 BCE (Burger). The -200 text correctly says "With the Chavín culture gone".
- Norte Chico at -3000 and -2000 covers 293,987 km², wildly overstated for a few coastal valleys (Supe, Pativilca, Fortaleza, Huaura).
- Dutch Brazil drawn at 1700 (339,141 km²). The Dutch were expelled in 1654.
- New France at 1650 and 1700 is only 53,777 km², which understates the St Lawrence and Great Lakes claims. Cliopatria keeps "New France" after 1763, through 1790.
- Label anachronisms: "Haiti" at 1715 (it was French Saint-Domingue); "Kingdom of Brazil" at 1880 (the Empire of Brazil) and 1900 (a republic); "Canada" at 1815 (British North America and Rupert's Land); "Viceroyalty of New Spain" at 1530 (created in 1535).
- Aztec at 1500: 344,983 km² against c. 200,000–220,000 km² (Cliopatria has 211,714 km²).

Cliopatria (`public/data/clio/index.json`):
- Olmec Civilization is shown only from -650 to -351, at 17,603 km². Profile: -1600 to -400, peak -900.
- Gran Colombia is shown from 1822 to 1833. The republic was proclaimed in 1819 and dissolved in 1830–31.
- Canada starts only in 1932. Profile start is 1867.
- Chimú: "Chimor" 911–1187 and "Chimu Empire" 1188–1481. The Inca conquered it c. 1470 (Rowe: 1462–70).
- Haiti: gap from 1916 to 1935 (the US occupation, 1915–34). "Empire of Haiti" is used as the label through 1915.

Counts: about 330 Americas claims checked across 47 era entries and 18 profiles. 14 corrections proposed; 5 more were already fixed concurrently.
