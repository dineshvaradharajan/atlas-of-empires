# Fact-check log: empires-a1 (content/empires/a1-early.json)

Scope: 45 profiles of states founded before 1400 CE. Checked start/end years, capitals, all ruler reigns,
peak area/year, and the dated or superlative claims in summary/legacy. Peak areas were compared with Taagepera
(1978, 1979, 1997), using the per-empire citations in Wikipedia's "List of largest empires", and with Turchin, Adams &
Hall (2006), Table 1, read directly from the JWSR PDF. Every profile now has a scholarly figure in peak.note where one
exists, plus a `sources` array. Britannica pages were read in a real browser session. Wikipedia pages were read
through the Wikipedia raw-wikitext endpoint.

Policy on peak areas: areaKm2 was changed only where Taagepera/Turchin cover the same polity and differ by more than
~25%. If only the date differs, peak.year was left alone and the scholarly date is recorded in the note. The one
exception is Aksum, where the note was also realigned.

## Corrections
- [sumer] peak.areaKm2: "250000" → "100000" — Taagepera (1978) puts the Neo-Sumerian (Ur III) state at c. 0.1M km²; 250,000 had no scholarly support — https://en.wikipedia.org/wiki/List_of_largest_empires
- [sumer] summary: "By about 3500 BCE towns such as Uruk had grown into cities of tens of thousands" → "Between about 3500 and 3000 BCE towns such as Uruk grew into cities of tens of thousands" — Uruk first passed c. 50,000 people during the Uruk period (to c. 3100 BCE), not already by 3500 BCE — https://en.wikipedia.org/wiki/Sumer
- [akkadian-empire] peak.areaKm2: "650000" → "800000" — Taagepera (1978) gives c. 0.8M km² for the Akkadian Empire at 2250 BCE (c. 0.65M at 2300 BCE) — https://en.wikipedia.org/wiki/List_of_largest_empires
- [babylonia] rulers.1.reign: "c. 1125 – 1104 BCE" → "c. 1121 – 1100 BCE" — current chronology (older works give 1125–1104; Britannica 1119–1098) — https://en.wikipedia.org/wiki/Nebuchadnezzar_I
- [macedonian-empire] start: "-808" → "-700" — historians date the kingdom to the 7th century BCE (Britannica: 700 BCE); 808 BCE is only a later legendary founding date — https://www.britannica.com/place/Macedonia-ancient-kingdom-Europe
- [macedonian-empire] summary: "Macedon was a kingdom in northern Greece, traditionally founded around 808 BCE and seen" → "Macedon was a kingdom in northern Greece that emerged in the 7th century BCE (later legend dated its founding to about 808 BCE); it was seen" — founding date presented only as legend; historical emergence 7th century BCE — https://www.britannica.com/place/Macedonia-ancient-kingdom-Europe
- [seleucid-empire] end: "-63" → "-64" — Pompey annexed the Seleucid remnant as the province of Syria in 64 BCE (Britannica: 312–64 BCE); Antiochus XIII deposed 64 BCE — https://www.britannica.com/place/Seleucid-Empire
- [seleucid-empire] summary: "for Rome in 63 BCE" → "for Rome in 64 BCE" — annexation of Syria dated 64 BCE — https://www.britannica.com/place/Seleucid-Empire
- [seleucid-empire] rulers.2.reign: "222 – 187 BCE" → "223 – 187 BCE" — Antiochus III acceded in 223 BCE — https://www.britannica.com/biography/Antiochus-III-the-Great
- [kingdom-of-kush] peak.areaKm2: "1000000" → "500000" — Taagepera (1978) gives c. 0.5M km² for the 25th (Kushite) Dynasty c. 715 BCE — https://en.wikipedia.org/wiki/List_of_largest_empires
- [kingdom-of-kush] rulers.1.reign: "c. 714 – 700 BCE" → "c. 705 – 690 BCE" — current sequence places Shebitku before Shabaka (Britannica, older order: c. 722–707); "714–700" matched no source — https://en.wikipedia.org/wiki/Shabaka
- [kingdom-of-aksum] peak.year: "525" → "350" — the c. 1.25M km² figure (Turchin, Adams & Hall 2006) is dated c. 350, under Ezana, not 525 — https://jwsr.pitt.edu/ojs/jwsr/article/download/369/381
- [kingdom-of-aksum] peak.note: "Under Kaleb, northern Ethiopia, Eritrea, parts of Nubia and Yemen across the Red Sea" → "Under Ezana: northern Ethiopia, Eritrea and campaigns into Nubia; Kaleb later ruled Yemen across the Red Sea c. 525; c. 1.25M km² c. 350 (Turchin, Adams & Hall 2006)" — note realigned with the dated scholarly estimate — https://jwsr.pitt.edu/ojs/jwsr/article/download/369/381
- [mali-empire] peak.areaKm2: "1300000" → "1100000" — Taagepera (1997) and Turchin, Adams & Hall (2006) both give c. 1.1M km² (c. 1380) — https://jwsr.pitt.edu/ojs/jwsr/article/download/369/381
- [kanem-bornu] rulers.3.reign: "c. 1564 – 1596" → "c. 1571 – 1603" — Britannica: Idris Alawma reigned c. 1571–1603 — https://www.britannica.com/place/Kanem-Bornu
- [great-zimbabwe] peak.areaKm2: "200000" → "50000" — the state centred on Great Zimbabwe probably covered c. 50,000 km², not the whole plateau — https://en.wikipedia.org/wiki/Great_Zimbabwe
- [great-zimbabwe] peak.note: "The Zimbabwe plateau between the Zambezi and Limpopo rivers" → "Core of the Zimbabwe plateau; the state centred on Great Zimbabwe probably covered c. 50,000 km²" — note overstated the extent (whole plateau) — https://en.wikipedia.org/wiki/Great_Zimbabwe
- [great-zimbabwe] summary: "at its height the city may have housed 10,000 to 18,000 people" → "at its height the city may have housed up to 10,000 people, though older estimates reach 18,000" — recent survey concludes population likely never exceeded 10,000; 18,000 is the traditional estimate — https://en.wikipedia.org/wiki/Great_Zimbabwe
- [great-zimbabwe] legacy: "the largest ancient stone complex south of the Sahara" → "the largest ancient stone complex in southern Africa" — sources say largest stone structure in precolonial southern Africa — https://en.wikipedia.org/wiki/Great_Zimbabwe
- [fatimid-caliphate] peak.areaKm2: "1800000" → "4100000" — Taagepera (1997) and Turchin, Adams & Hall (2006) both give c. 4.1M km² (c. 969) — https://jwsr.pitt.edu/ojs/jwsr/article/download/369/381
- [fatimid-caliphate] rulers.3.note: "Longest reign of any Muslim ruler; saw famine and decline" → "Longest reign of any caliph; saw famine and decline" — sources describe his reign as the longest of any caliph but only one of the longest of Muslim rulers generally — https://en.wikipedia.org/wiki/Al-Mustansir_Billah
- [carolingian-empire] rulers.5.reign: "881 – 888" → "881 – 887" — deposed November 887 (died January 888) — https://en.wikipedia.org/wiki/Charles_the_Fat
- [kievan-rus] peak.areaKm2: "1330000" → "2100000" — Taagepera (1997) and Turchin, Adams & Hall (2006) both give c. 2.1M km² (c. 1000) — https://jwsr.pitt.edu/ojs/jwsr/article/download/369/381
- [kievan-rus] rulers.1.reign: "regent c. 945 – 960" → "regent 945 – c. 957" — Olga was regent for Sviatoslav from 945 until c. 957 — https://en.wikipedia.org/wiki/Olga_of_Kiev
- [grand-duchy-of-lithuania] rulers.1.note: "Founded Vilnius and expanded into Rus lands" → "Made Vilnius his capital and expanded into Rus lands" — Vilnius is attested as his capital by 1323; its "founding" by Gediminas is legend — https://www.britannica.com/place/Lithuania/History
- [parthian-empire] rulers.1.reign: "c. 171 – 132 BCE" → "c. 165 – 132 BCE" — current dating of his reign — https://en.wikipedia.org/wiki/Mithridates_I_of_Parthia
- [parthian-empire] rulers.2.reign: "c. 124 – 88 BCE" → "c. 124 – 91 BCE" — current dating (older works: 123–88 BCE) — https://en.wikipedia.org/wiki/Mithridates_II_of_Parthia

Peak-area annotations added to peak.note, with no change to the figure (not counted as corrections): ancient-egypt,
akkadian-empire, babylonia, assyria, hittite-empire, indus-valley-civilisation, macedonian-empire, seleucid-empire,
ptolemaic-kingdom, carthaginian-empire, kingdom-of-kush, mali-empire, kingdom-of-kongo, fatimid-caliphate, almohad-caliphate,
mamluk-sultanate, roman-republic, roman-empire, byzantine-empire, hunnic-empire, carolingian-empire, holy-roman-empire,
kievan-rus, kingdom-of-poland, grand-duchy-of-moscow, caliphate-of-cordoba, achaemenid-empire, parthian-empire,
sasanian-empire, maurya-empire.

## Unverifiable / disputed
- Peak areas with no Taagepera/Turchin figure and no other reliable source found; left unchanged: minoan-civilisation
  (15,000), greek-city-states (250,000), ghana-empire (350,000; the Wikipedia infobox gives an uncited 650,000 for 1000 CE),
  kanem-bornu (500,000), frankish-kingdom (600,000), kingdom-of-england (380,000, Angevin lands), kingdom-of-france (530,000),
  republic-of-venice (60,000), grand-duchy-of-moscow (2.8M in 1533; only 2.5M for 1505 found), bulgarian-empire (500,000 in 920;
  the Wikipedia infobox gives 287,000 for 925 and 400,000 for 850, neither from Taagepera).
- indus-valley-civilisation: areaKm2 1,000,000 kept as the cultural extent. The Wikipedia Sumer article gives c. 1.2M km²,
  while Taagepera (1978) gives only c. 0.3M km² for a possible political unit. Both are now in the note.
- kingdom-of-kush, Shabaka: chronology is disputed. The newer Piye-Shebitku-Shabaka order (Wikipedia) gives c. 705–690 BCE.
  Britannica uses the older order: Piye c. 753–723, Shabaka c. 722–707 BCE. The newer order was chosen to match the
  profile's Piye and Taharqa dates.
- kanem-bornu: Hummay (file c. 1075–1086; Wikipedia c. 1085–1097), Dunama Dabbalemi (file c. 1210–1248; Wikipedia c. 1221–1259)
  and Ali Gaji (file c. 1465–1497; Wikipedia c. 1470–1503) follow different king-list chronologies. Left with "c.".
- mali-empire: Mansa Musa is given c. 1312–1337 (Wikipedia) but c. 1307–1332 in Britannica. Kept. Mansa Uli "c. 1255–1270" is
  conventional, but Wikipedia places his hajj somewhere in 1260–1277. Kept.
- hittite-empire: Suppiluliuma II "c. 1207–1178" and end year -1180. Wikipedia gives c. 1207–1190 and an end c. 1190 BCE.
  Britannica dates the neo-Hittite era from c. 1180. Kept. Britannica uses an older chronology for Suppiluliuma I
  (c. 1380–1346); the middle-chronology dates were kept.
- assyria: Ashurbanipal died 631 (Wikipedia) or 627 BCE (Britannica). "669 – c. 631" kept.
- kingdom-of-aksum: end year 940 kept. Wikipedia now gives 960, and decline dates are vague.
- ghana-empire: end year 1200 kept (Sosso takeover early 13th century). Britannica dates the final absorption into Mali to 1240.
- mali-empire end 1670 and kanem-bornu end 1893 are conventional. Wikipedia infoboxes give 1610 and 1902.
- carthaginian-empire: Magonid dynasty "c. 550–370 BCE". The Wikipedia article (flagged "more citations needed") gives 550–340.
- kingdom-of-kongo: António I is given 1660–1665 here and 1661–1665 in Wikipedia. Minor, kept.
- macedonian-empire: Perdiccas died 321 or 320 BCE (high vs low chronology). "323 – 321" kept.
- Britannica could not be fetched by plain HTTP (403). Its pages were read in the built-in browser, and some pages served
  only partial or paywalled text (Kush, Ptolemaic, Byzantine, Fatimid). For those profiles the Wikipedia pages were primary.

## Count
Items checked: 45 profiles (244 ruler reigns, 45 start/end pairs, 45 capitals, 45 peak figures).
Corrections made: 27 field changes (4 of them are linked note or summary edits that follow from another correction).
