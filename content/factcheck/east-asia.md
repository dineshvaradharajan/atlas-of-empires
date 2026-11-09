# East Asia regional fact-check

Scope: `regions.east-asia` in all 47 era snapshots, East Asian sentences in overviews, East Asian `powers` and `events`, and 21 profiles: xiongnu, tibetan-empire, mongol-empire, shang, zhou, qin, han, sui, tang, song, yuan, ming, goryeo, joseon, classical-japan, mongolia, qing, republic-of-china, peoples-republic-of-china, tokugawa-shogunate, empire-of-japan. The atlas has no separate profiles for Western/Eastern Jin, Liao, Jurchen Jin, Goguryeo, Silla or Ashikaga Japan, so there was nothing to check there.

Several problems I found had already been fixed by the general fact-checkers by the time I wrote the patch, so they are not in it: Northern Wei was called "Turkic-origin" (now "Xianbei"), the Rouran ruler in 500 was given as Futu (now Nagai, r. 492–506), Michinaga was called "the regent" in 1000, and the Mongol Empire was called simply "largest land empire" (now "largest contiguous").

## Authorities used
- Albert Herrmann, *Historical and Commercial Atlas of China* (Harvard-Yenching, 1935), the openly readable Toruń (UMK) scan: https://archive.org/details/kpbc.umk.pl.Kartografia_040_POWER_001_10_258359. I used its plate list as a sanity check on extents and dates: Shang c. 1110 BC; Xiongnu 176 and 128–36 BC; Northern Wei/Southern Qi, boundaries of 500; Tang, boundaries of 700; Ming, boundaries of 1415 and 1580; Qing, boundaries of 1900.
- Peak areas: Taagepera 1978/1979/1997 and Turchin, Adams & Hall 2006, as tabulated at https://en.wikipedia.org/wiki/List_of_largest_empires.
- Wikipedia articles, used for statements that carry citations there. Each is listed per correction below.
- Not used: *Cambridge History of China*, *Cambridge History of Japan* and Wilkinson. The legitimate archive.org copies are lending-only, and their search-inside returned 403. The only full-text copies I found were unauthorised "PDFDrive" uploads, so I did not use them. Tan Qixiang and CHGIS were not opened, and I cite nothing from them.

## Corrections (27 in `east-asia-patch.json`)
- [-700] regions.east-asia: "powerful states such as Qi, Jin, Chu and Qin compete" → "…such as Zheng, Qi, Jin, Chu and Qin compete". Around 700 BCE, Zheng under Duke Zhuang was the leading state; Qi's hegemony starts only in 685. https://en.wikipedia.org/wiki/Spring_and_Autumn_period
- [-400], [-323], [-300] regions.east-asia: "the Zhangzhung kingdom holds western Tibet" → "western Tibet is home to Iron Age peoples later remembered in Tibetan tradition as the kingdom of Zhangzhung". The kingdom is first dated in the Tang Annals (634 CE). Anything earlier is later Bon/Tibetan tradition plus tentative archaeology. https://en.wikipedia.org/wiki/Zhangzhung
- [900] regions.east-asia: "Japan is ruled by Emperor Daigo and the Fujiwara clan" → "…Emperor Daigo, who governs without a Fujiwara regent though Fujiwara no Tokihira leads his court". Daigo is famous for ruling without a regent, and Tokihira was made regent only posthumously. https://en.wikipedia.org/wiki/Emperor_Daigo
- [1930] regions.east-asia: "Communists in the Jiangxi Soviet" → "Communists in their Jiangxi base area". This is an anachronism: the Chinese Soviet Republic was proclaimed at Ruijin on 7 Nov 1931. The first encirclement campaign ran Nov 1930 – Jan 1931. https://en.wikipedia.org/wiki/Jiangxi%E2%80%93Fujian_Soviet
- [ming-dynasty] summary: "and the Manchus founded the Qing." → "and the Manchu Qing dynasty, proclaimed by Hong Taiji in 1636, seized the throne." The Qing already existed before 1644. https://en.wikipedia.org/wiki/Qing_dynasty
- [classical-japan] rulers[2].reign: "regent c. 995 – 1027" → "dominant at court 995 – 1027 (regent 1016 – 1017)". Michinaga was formally sesshō only in 1016–17 and never kampaku. https://en.wikipedia.org/wiki/Fujiwara_no_Michinaga
- [goryeo] summary: "it became a vassal of the Mongols in 1270" → "it made peace with the Mongols in 1259 and became a vassal of the Yuan". Peace came in 1259 with Wonjong as hostage; 1270 is when the military regime ended and the court returned. https://en.wikipedia.org/wiki/Mongol_invasions_of_Korea
- [mongolia] summary: "in 1921 Mongolian revolutionaries … drove them and a White Russian warlord out" → Ungern-Sternberg expelled the Chinese from Urga in February 1921; Sükhbaatar's partisans, backed by the Red Army, then expelled Ungern and entered Urga in July. https://en.wikipedia.org/wiki/Mongolian_Revolution_of_1921
- [han-dynasty] peak.areaKm2: 6000000 → 6500000, with a new note. Taagepera 1979 gives Eastern Han 6.5M km² in 100 CE, which is the profile's peak year; 6.0M is the Western Han figure for 50 BCE.
- [sui-dynasty] peak.areaKm2: 4600000 → 3000000; peak.year: 609 → 589; new note. Taagepera 1979 gives 3.0M km² in 589, and the Sui infobox uses the same figure. 4.6M is unsupported, and the map's own maximum is 3.43M. https://en.wikipedia.org/wiki/Sui_dynasty
- peak.note citations added (figures unchanged): tang (5.4M; note that Taagepera's year is 715, not the profile's 669), song (3.1M, reached by 980), shang (1.25M, flagged as generous), zhou (Taagepera only c. 0.55M, flagged), qin (2.3M), xiongnu (9.0M), tibetan-empire (4.6M for 800), mongol-empire (24M), yuan (11M), ming (6.5M), qing (14.7M), empire-of-japan (7.4–8.5M).
- 32 addSource entries for the items above.

## Border and extent discrepancies (clio index vs authorities)
- **Shang**: one flat polygon of 154,175 km² from −1600 to −1001. It runs 45 years past the fall at Muye (c. 1046), and Zhou only starts at −1000. Herrmann maps a much larger Shang sphere c. 1110 BC, and the profile's peak is 1.25M km².
- **Xiongnu**: the map's maximum is 5.6M km² (−144 to −127), against Taagepera's 9.0M km² at 176 BCE. The map shows only 4.1M km² in 176 BCE. The map ends in 153; the profile ends in 216.
- **Han**: the timeline runs to 237 (224–237: 789,138 km²), but Han ended in 220. The map's maximum is 4.58M (91–105), against Taagepera's 6.0–6.5M. A separate "Han + Xiongnu alliance" group reaches 6.9M.
- **Sui**: ends 627, nine years after 618.
- **Tang**: starts 623 rather than 618. Its maximum is 8.73M (661–665), far above Taagepera's 5.4M, because the whole Protectorates are counted. It runs to 910 (fell 907).
- **Tibetan Empire**: starts 623 (618). The map's maximum is 3.86M against Taagepera's 4.6M. It runs to 849, though the empire collapsed in 842.
- **Mongol Empire**: 27.4M km² in 1279–84, against Taagepera/Turchin 24M. The polygon stops at 1293.
- **Yuan**: starts 1294 (proclaimed 1271; 1271–93 is drawn as "Mongol Empire"). Its 14.25M km² is above Taagepera's 11M. It runs to 1374 (expelled 1368), and Northern Yuan starts 1375.
- **Ming**: starts 1375 (founded 1368). Its maximum is 6.27M (1415–28), consistent with Taagepera's 6.5M and Herrmann's 1415 plate. The map peaks earlier than the profile's 1450.
- **Qing**: shown as "Later Jin Dynasty" for 1619–1644 and as Qing only from 1645, though the Qing was proclaimed in 1636. Its maximum is 12.5M (1794–95), against Taagepera's 14.7M in 1790. The map shows only 11.3M in 1788–90.
- **Republic of China, 1950–2023**: 81,057 km². Taiwan plus Penghu, Kinmen and Matsu is about 36,000 km², so this figure looks roughly double; the 2024 figure of 40,939 is close. This is a likely data error.
- **Goguryeo** runs to 681 (fell 668). **Silla** runs to 681, with "Unified Silla" from 682 (unification 676). **Great Jin** starts 1126 (founded 1115).
- The basemap labels attached to era `powers.map` fields are odd: Shang/Zhou "Zhoa", Tang 700 "Sui Empire", Jin 1200 "Liao", Ming 1400 "Great Khanate". These are aourednik basemap quirks and were not changed (`map` is protected).

## Unverifiable / disputed (left as is)
- Zhou peak 1.0M km² (−950): no authority found for this figure. Taagepera gives c. 0.55M and the map c. 0.70M. I only added a hedging note.
- Tibetan Empire reaching "Bengal": Wikipedia supports it, but it rests on later Tibetan histories. Kept.
- Goguryeo, Silla and Baekje "emerging" by 1 BCE: these follow the traditional founding dates (37, 57 and 18 BCE). Archaeology puts the state formation of Silla and Baekje later. Kept with "emerging".
- Western Zhou dates (Muye c. 1046; King Kang 1020–996 BCE, per the Xia–Shang–Zhou Chronology Project) are contested (Shaughnessy: 1045, and Kang c. 1005–978). Both readings fit the snapshot year −1000.
- Song "cities of a million people" and "world's first government paper money" (jiaozi, 1024): these are standard textbook claims. Kept.

Count: items checked: 47 era snapshots (East Asian content) and 21 profiles. Corrections proposed: 27, plus 32 source additions.
