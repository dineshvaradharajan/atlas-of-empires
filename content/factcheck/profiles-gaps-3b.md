# Fact-check: profiles-gaps-3b

Scope: 8 new profiles in scratchpad `profiles/out-3b.json`: chen-dynasty, five-dynasties, liao-dynasty,
jin-dynasty-1115, later-jin-1616, southern-ming, eighteen-kingdoms, tibet-after-empire.
I checked peak areas against the Taagepera (1997) appendix tables and the Turchin, Adams & Hall (2006) Table 1. I checked "as drawn on this map" figures against `data/clio/cliopatria_polities_only_v021.geojson`.

## Corrections

- [chen-dynasty] peak.note: "...the land between the Huai and the Yangtze retaken in 573 and lost again by 580; c. 1.0M km² (as drawn on this map)" → "...taken from the Northern Qi in 573 and lost to the Northern Zhou by 580; c. 1.0M km² as drawn on this map, which does not show the 573 gains (no Taagepera figure)" — the land was Northern Qi's, not retaken. The Cliopatria Chen polygon stays at 1.01M km² for 561–591 and reaches no further north than 32.2°N, so the map figure leaves out the Huai gains — https://en.wikipedia.org/wiki/Chen_dynasty
- [chen-dynasty] summary: "but the Northern Zhou took it again by 580." → "but the Northern Zhou, having swallowed the Northern Qi, seized it by 580." — Wu Mingche took the land from the Northern Qi in 573. The Zhou conquered Qi in 577 and overran the area in the winter of 579, so it was not "again" — https://en.wikipedia.org/wiki/Chen_dynasty
- [liao-dynasty] summary: "helped a Chinese general found the Later Jin" → "helped the Shatuo general Shi Jingtang found the Later Jin" — Shi Jingtang was of Shatuo Turkic descent — https://en.wikipedia.org/wiki/Shi_Jingtang
- [jin-dynasty-1115] peak.note: "Manchuria and all of northern China to the Qinling Mountains and the Huai River; c. 2.3M km² in 1126" → "Manchuria and northern China after the capture of the Song capital (the border settled on the Qinling–Huai line only in 1141); c. 2.3M km² in 1126" — the Huai border came with the Treaty of Shaoxing (1141), not in 1126. Taagepera's 1126 entry reads "Sung capital taken" — https://en.wikipedia.org/wiki/Treaty_of_Shaoxing
- [jin-dynasty-1115] summary: "took Zhongdu in 1215 and drove the court south to Kaifeng." → "drove the court south to Kaifeng in 1214 and took Zhongdu in 1215." — the court moved in 1214, before Zhongdu fell on 1 June 1215 — https://en.wikipedia.org/wiki/Mongol_conquest_of_the_Jin_dynasty
- [later-jin-1616] summary: "forced Korea to submit in 1627" → "forced Korea to make peace on his terms in 1627" — the 1627 peace was a hostage-and-tribute settlement, often described as a "brotherly" relationship. Joseon's full submission as a vassal came in 1637, under the Qing — https://en.wikipedia.org/wiki/Later_Jin_invasion_of_Joseon
- [later-jin-1616] rulers[Hong Taiji].note: "Subdued Korea and the Chahar Mongols;" → "Forced terms on Korea in 1627 and subdued the Chahar Mongols;" — same reason. Korea surrendered fully in 1637, after the 1626–1636 Later Jin reign — https://en.wikipedia.org/wiki/Hong_Taiji
- [later-jin-1616] peak.note: "in his Manchu series that continues into the Qing" → "in his Manchu–PRC series, which starts with the Jurchen state in 1600 and runs on through the Qing" — clarification. Taagepera's Manchu–PRC series really does cover the pre-1636 state: 1600 0.3, 1620 2.0, 1635 3.4 ("Inner Mongolia, Korea"). The figure is honestly attributed — https://escholarship.org/content/qt3cn68807/qt3cn68807.pdf
- [southern-ming] peak.note: "Ming China south of the Yellow River plain after the fall of Beijing; c. 2.3M km² in 1644 (Taagepera 1997, +/- 0.8M, the end of his Ming series), shrinking fast after 1645" → "Ming China south of the Huai River after the fall of Beijing; c. 2.3M km² in 1644 (Taagepera 1997, +/- 0.8M: his Ming series at the Manchu conquest of north China, which he then runs down to zero by 1690; he has no separate Southern Ming series); c. 2.2M km² as drawn on this map for 1645–47, shrinking fast after that" — two fixes. (1) 1644 is not the end of the Ming series, which has a further point at 1690 = 0. The 1644 value is the Ming remnant after north China fell, so it is a fair proxy only if labelled as such. (2) The loyalists held the land south of the Huai, not the Yellow River. Map figure from Cliopatria (2.18M km², 1645–47) — https://en.wikipedia.org/wiki/Southern_Ming
- [southern-ming] rulers[Hongguang].note: "captured when the city fell to the Qing" → "fled the city as the Qing closed in (1645) and was captured soon after" — he fled Nanjing after the Qing crossed the Yangtze. He was captured on 15 June, after Nanjing surrendered — https://en.wikipedia.org/wiki/Southern_Ming
- [tibet-after-empire] peak.note: "for 850–1259" → "for 850–1249" — in Cliopatria the 'Tibetans' shape is c. 1.86M km² until 1249. For 1250–1259 it is only c. 2,000 km².
- [later-jin-1616] sources: added "Wikipedia: Later Jin invasion of Joseon". [liao-dynasty] sources: added "Wikipedia: Shi Jingtang". Both load (HTTP 200).

## Checked and confirmed (selected)

- Nurhaci: beaten at Ningyuan in early 1626 and died on 30 Sept 1626, after the battle. Capitals: Hetu Ala 1616–1622, Liaoyang/Dongjing 1622–1625, Mukden 1625–1636. Jurchens renamed Manchu in 1635, Qing proclaimed in 1636.
- Five Dynasties peak: Taagepera's T'ang–Chin–Sung series gives "923 1.3? Later T'ang and Sha-T'o Turkic rule". The year is 923, the figure is marked uncertain, and there is no "1923" typo. The Cliopatria group polygon is 2.99M km² (911–935).
- Liao 947 2.6M ±0.5 (Taagepera) and Jin 1126 2.3M (Taagepera "W"): both also appear in Turchin, Adams & Hall (2006) Table 1.
- Chanyuan terms: 200,000 bolts of silk and 100,000 taels of silver; Daozong restored "Great Liao" in 1066. Chen ruler dates match Wikipedia's infobox. The Chen profile leaves out Emperor Fei (566–568), which is an acceptable selection. The Chen Shubao well story checks out. Archontology supports 557–589 and Jiankang.
- Tibet: Changchub Gyaltsen ruled 1354–1364 and took the regent's title desi. Güshi Khan came in 1642, the Qing protectorate began in 1720, independence was proclaimed in 1913, the 13th Dalai Lama took power in 1895 and the 14th in Nov 1950. The Ganden Phodrang polygon on the map is 1.60M km² for 1683–1701.
- Eighteen Kingdoms: Dong Yi surrendered at Gaonu without resistance; Zhang Han killed himself at Feiqiu in 205 BCE; Emperor Yi was murdered in 206 BCE on Xiang Yu's orders. The Cliopatria group polygon is 1.64M km² for 206–204 BCE.
- The Taagepera eScholarship PDF URL returns 403 to curl because of a bot check, but it is the correct paper (the permalink is escholarship.org/uc/item/3cn68807). The text was checked from a local copy.

## Unverifiable / disputed

- Yongli's flight into Burma: Wikipedia's Southern Ming and Li Dingguo articles put it in early 1659, after Kunming fell in January 1659. The Yongli Emperor article says "1661". 1659 is the mainstream date (Struve). The profile does not date the flight, so I made no change. He was handed over on 22 Jan 1662 and strangled in Kunming on 1 June 1662.
- Korea 1627: sources differ on whether the settlement made Later Jin an overlord or set up a "brotherly" equality. I hedged the profile ("make peace on his terms").
- Changchub Gyaltsen's takeover is dated 1354 by most sources. Wikipedia's Phagmodrupa article gives the period 1354–1358.
- Li Cunxu's death (926): "assassinated" follows Wikipedia. Other accounts say he was killed in a mutiny. Left as written.
- Chen peak year 576 is a judgement: the Huai gains were held c. 573–579. No scholarly area figure exists.

## Counts

Profiles checked: 8. Claims checked: c. 190. Corrections made: 11 (plus 2 sources added).
