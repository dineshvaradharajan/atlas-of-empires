# Europe & Mediterranean specialist fact-check (slug: europe)

Scope covered: `regions.europe` in all 47 era snapshots; Greek, Roman, Carthaginian, Hellenistic and Byzantine statements in other regions' texts and in overviews, powers and events; 39 profiles (Minoans, Greek poleis, Macedon, Seleucids, Ptolemies, Carthage, Roman Republic and Empire, Byzantium, Huns, Merovingians, Carolingians, HRE, France, England, Kievan Rus', Bulgaria, Hungary, Poland, Lithuania, Venice, Muscovy, Córdoba, Spanish, Portuguese, British, French, Dutch and Belgian empires, Habsburgs, Russian Empire, USSR, Russian Federation, Poland-Lithuania, Sweden, Denmark-Norway, Prussia, Germany, Italy, Crimean Khanate).

Source access: Britannica (403) and the PCL Shepherd atlas (bot wall) were blocked, so I couldn't consult Shepherd or the Cambridge/Barrington volumes directly. Area figures were checked against the Taagepera (1979, 1997) and Turchin et al. (2006) values tabulated in Wikipedia's *List of largest empires*. Dates were checked against Wikipedia articles, using only statements that the articles source. Every URL cited below was opened.

## Proposed corrections (18, in `europe-patch.json`)

- [a-ancient -300] powers[2].extent (Ptolemaic Kingdom): "Egypt, Cyrenaica and Cyprus," → "Egypt and Cyrenaica (Cyprus is held by Demetrius from 306 until c. 294 BCE),". Demetrius took Cyprus at Salamis in 306, and it was Ptolemaic again only from 294. The same snapshot already lists Cyprus under Demetrius, so the two entries contradicted each other. https://en.wikipedia.org/wiki/Ptolemaic_Cyprus
- [a-ancient -100] powers[6].extent (Ptolemaic Kingdom under Ptolemy X): "Egypt and Cyprus" → "Egypt (Cyprus is held by his rival brother Ptolemy IX)". Ptolemy IX ruled Cyprus from 105 to 88 BCE. https://en.wikipedia.org/wiki/Ptolemy_IX_Soter
- [a-ancient -200] regions.europe and powers[1].extent: "Corsica and eastern Spain" → "Corsica and eastern and southern Spain". Rome inherited Carthage's southern holdings as well as the east coast, and in 197 BCE organised them as Hispania Citerior (east) and Ulterior (south). https://en.wikipedia.org/wiki/Hispania
- [b-medieval 700] powers[4].extent (Byzantium): "Sicily and southern Italy" → "Sicily, southern Italy and the Exarchate of Ravenna". Ravenna stayed Byzantine until 751. https://en.wikipedia.org/wiki/Exarchate_of_Ravenna
- [b-medieval 1000] powers[2].extent (Byzantium): "the Balkans," → "the eastern Balkans (western Bulgaria holds out until 1018),". In 1000, Samuel's Bulgaria still held the west. Basil's offensive only began that year, and Bulgaria submitted in 1018. https://en.wikipedia.org/wiki/Basil_II
- [c-earlymodern 1500] regions.europe: "Maximilian I was Holy Roman Emperor" → "Maximilian I ruled the Holy Roman Empire as King of the Romans (emperor-elect from 1508)". He was King of the Romans from 1486 and was proclaimed emperor-elect at Trent on 4 February 1508. https://en.wikipedia.org/wiki/Maximilian_I,_Holy_Roman_Emperor
- [d-modern 1945] regions.europe: "east of the Oder-Neisse line handed to Poland" → "…handed to Poland, except northern East Prussia, which the Soviet Union annexed". Königsberg became Soviet territory and later Kaliningrad Oblast. https://en.wikipedia.org/wiki/Potsdam_Agreement
- [d-modern 1945] powers[2].extent (British Empire): "Still about a fifth of the world's land" → "Still about a quarter…". The 1920, 1930 and 1938 entries all say "about a quarter", and the empire was territorially almost unchanged until 1947. Taagepera's 1920 peak is 35.5M km², about 24% of land. https://en.wikipedia.org/wiki/List_of_largest_empires
- [carthaginian-empire] peak.year: -264 → -220. Taagepera (1979) dates Carthage's peak (0.3M km²) to 220 BCE, after the Barcid conquest of Spain, and the clio timeline also peaks in 218 BCE. https://en.wikipedia.org/wiki/List_of_largest_empires
- [carthaginian-empire] peak.note: "Before the First Punic War: coastal North Africa, southern Spain, Sardinia, Corsica, western Sicily and the Balearics" → "After the Barcid conquests in Spain: coastal North Africa, southern and eastern Spain and the Balearics; c. 0.3M km² (Taagepera 1979)". Carthage held only coastal posts in Spain in 264, and the "southern Spain" territory came after 237. Same source.
- [carolingian-empire] rulers[5].reign: "881 – 888" → "881 – 887". Charles the Fat was deposed in November 887 and died in January 888, as the profile summary already says. https://en.wikipedia.org/wiki/Charles_the_Fat
- [kievan-rus] peak.note: appended "Taagepera (1997) gives a larger c. 2.1M km² for c. 1000". The 1.33M km² figure comes from other estimates, and clio shows c. 1.2M. Number left unchanged. List of largest empires.
- [ptolemaic-kingdom] peak.note: appended "c. 1.0M km² (Taagepera 1979)". Taagepera dates this to 301 BCE, but the -240 peak year was kept because Ptolemy III's holdings were larger. List of largest empires.
- [russian-empire] peak.year: 1866 → 1895. Taagepera (1997) and Turchin et al. give 22.8M km² in 1895: the Central Asian conquests more than offset the loss of Alaska, and clio also peaks in 1900–1904. List of largest empires.
- [russian-empire] peak.note: "Before the sale of Alaska to the United States in 1867" → "After the conquest of Central Asia, despite the sale of Alaska in 1867; c. 22.8M km² (Taagepera 1997)".
- [spanish-empire] peak.year: 1790 → 1810. Taagepera (1997) gives 13.7M km² in 1810, and clio also peaks in 1806–1810. List of largest empires.
- [spanish-empire] peak.note: appended "; c. 13.7M km² (Taagepera 1997)".

27 `addSource` entries record these references on the affected profiles and eras.

## Fixed concurrently by the general fact-checkers (dropped from my patch)
- [700] Tervel described as founder of the Bulgar state (Asparukh founded it in 681). Already reworded.
- [1500] Louis XII "opening" the Italian Wars (Charles VIII began them in 1494). Already reworded.
- [1530] Charles V "ruled" Milan (Francesco II Sforza was duke until 1535, under Spanish garrison). Already reworded. https://en.wikipedia.org/wiki/Francesco_II_Sforza
- [1994] last Russian troops leaving "the Baltic states" in August 1994 (Lithuania was cleared on 31 Aug 1993). Already changed to "Estonia and Latvia".

## Checked and found accurate (selection)
All 47 Europe region paragraphs were checked line by line for rulers, reign dates, battles and treaties. Correct examples include:
- the Tetrarchy's division of territory
- Merovingian kings in 600
- Svolder in 1000
- Marchfeld in 1278
- Kalmar 1397
- Narva in November 1700
- Utrecht/Rastatt gains
- First Partition 1772
- German Confederation of 39 states
- Dual Alliance 1879
- Second Naval Law 1900
- Trianon
- the Rhineland evacuation in June 1930
- the Ebro
- EEC/EFTA 1960
- Treaty of Nice

The Roman consuls named for 200 BCE (Galba and Cotta) and 100 BCE (Marius VI) are correct. Profile reign lists were all consistent with standard lists. Areas that match Taagepera/Turchin include:
- Macedon 5.2M (323 BCE)
- Seleucid 3.9M (301 BCE)
- Rome 5.0M (117)
- Byzantium 2.7M (555)
- Huns 4.0M
- Francia 1.2M (814)
- HRE 1.0M (1050)
- Córdoba 0.6M (1000)
- British 35.5M (1920)
- French 11.5M (1920)
- Dutch 2.1M (1938)
- Italy 3.8M

Germany's 3.5M km² for 1914 matches the 3,494,019 km² (1912) that Wikipedia's German colonial empire infobox gives; this includes the home country.

## Border / extent discrepancies (clio index vs profiles and authorities; can't be fixed here)
- **Ptolemaic Kingdom**: clio realm "Ptolemaic Kingdom" begins in -331 and peaks at **4.83M km² in 326–324 BCE**. That is Alexander's empire mislabelled. The kingdom dates from 323/305 BCE and was about 1.0M km² at most. This is a serious mislabel in the border data.
- **Minoan civilization**: clio has polygons only for -1600 to -1401, while the profile runs from -3100 to -1100 and the -3000 and -2000 snapshots name a "Minoan" map polygon. Check that the basemap actually has one at those years.
- **Hunnic Empire**: clio maximum is 1.91M km² (451) against the 4.0M of Taagepera/Turchin. The map greatly understates Attila's hegemony, which is partly a definitional matter because it was a loose tributary empire.
- **Seleucid Empire**: clio maximum is 2.98M km² against Taagepera's 3.9M (301 BCE).
- **Greek City-States**: clio continues to 83 CE, past the profile's end of -146.
- **Austria-Hungary**: clio peaks at 931,840 km² in 1918, which is presumably occupied Serbia, Montenegro and Romania. The standard figure is c. 676,000 km² (1914).
- **Denmark-Norway**: clio maximum is 634k km² because it excludes Greenland. The profile's 2.6M is "most of it Greenland, claimed but barely controlled" (Norse Greenland had died out by 1600 and was recolonised only from 1721). Consider stating the European area as well.
- **Kievan Rus'**: clio is about 1.2M km², while Taagepera gives about 2.1M (c. 1000).
- **Kingdom of Hungary**: the clio realm ends in 1546, so the Habsburg-era kingdom up to 1918 isn't drawn under this name.
- **Carthage**: clio peaks in 218 BCE (454k km²), which supports moving the peak year to -220.

## Disputed / softened, not patched
- [1880] British Empire "about a fifth of the world's land". The empire was probably about 15–17% then, so "about a sixth" may be closer, but I couldn't confirm an 1880 figure.
- [1945] "Communist-dominated governments are being installed" in all five occupied states. Czechoslovakia (a coalition until 1948) and Hungary (Smallholders won in November 1945) were not yet communist-dominated. It works as a description of a process, but it simplifies.
- [macedonian-empire] "ruled from 277 BCE by the Antigonids" leaves out Demetrius I's Antigonid reign over Macedon (294–288).
- [macedonian-empire] the founding date "c. 808 BCE" follows the Caranus tradition. Herodotus instead starts the dynasty with Perdiccas I (c. 700 BCE).
- [grand-duchy-of-lithuania] Gediminas "Founded Vilnius" is the traditional attribution, which Wikipedia also reports. Left as is.
- [kingdom-of-poland and polish-lithuanian-commonwealth] "Europe's first modern written constitution (1791)" is widely stated, though Corsica's 1755 constitution is sometimes cited against it.

Counts: 47 era snapshots and 39 profiles checked; 18 corrections proposed (plus 4 found already fixed); 27 source additions.
