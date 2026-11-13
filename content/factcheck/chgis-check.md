# Chinese dynasties cross-checked against CHGIS V6 (221 BCE–1911)

Written by `tools/check_chgis.py` on 2026-11-13. Read-only: nothing in the atlas was changed.

CHGIS V6 (China Historical GIS, Harvard and Fudan) maps the prefecture-level units of the Chinese state(s) from 221 BCE to 1911 as dated polygons. The union of the prefectures valid in a year is the territory the Chinese state(s) administered directly that year, so it is compared here with the atlas's Chinese realms. CHGIS records carry no dynasty, and V6 was compiled region by region: before the Yuan it covers mainly southern China and Shanxi, so the comparison is made inside the *CHGIS footprint* (land CHGIS administers at some time before and some time after the year in question). Frontier zones, protectorates and tributaries that were never prefectures fall outside CHGIS by design.

> Source: "CHGIS Version 6." (c) Fairbank Center for Chinese Studies and the Institute for Chinese Historical Geography at Fudan University, Dec 2016. [dataverse.harvard.edu/dataverse/chgis_v6](https://dataverse.harvard.edu/dataverse/chgis_v6). Licence: non-commercial academic and educational use only; no redistribution. This report carries only figures, years and place names derived from it; no CHGIS coordinates or geometry, and the raw files are not in the repository.

## How it was compared

- Years: every 25 years from 221 BCE to 1911, the year after each conventional dynasty transition, and 1911 (119 snapshots). A CHGIS prefecture counts in year Y if BEG_YR ≤ Y ≤ END_YR, an atlas row if its first year ≤ Y ≤ its last year.
- Atlas: the border chunks in `public/data/clio/` with every correction in `content/corrections.json` and the layers in `public/data/supplements.json`, read by `load_atlas()` in `tools/check_cshapes.py`. Its Chinese side is the union of the realms in the script's CHINA table: dynasties and states of the periods of division (conquest dynasties such as Liao, Jin, the Mongol Empire, Yuan and Qing included) and rebel regimes inside them (Taiping, the Three Feudatories, Tungning, Li Zicheng, the Panthay). Every other realm is "another realm".
- CHGIS: 3790 prefecture-level records; 40 left out (types that CHGIS marks as not administered: "non-administrative national territory" such as Taiwan before 1683 and after 1895, barbarian and tribal areas, and the Yue client kingdoms of the early Han).
- Both are laid on a 0.25° grid (cell centres; a cell is about 700 km² at 30°N). Region names are the nearest modern provincial capital (or neighbouring country), typed by hand in the script, plus the CHGIS prefectures that hold most of the area.
- Overlap = shared area ÷ the union of CHGIS and the atlas's Chinese realms inside the footprint. *Given to other / blank*: CHGIS administers it, the atlas gives it to a non-Chinese realm or draws nothing. *Beyond, in footprint*: the atlas draws a Chinese realm on land CHGIS has as prefectures before and after but not that year. *Outside footprint*: atlas Chinese land CHGIS never maps around that year (steppe, Tibet, the Western Regions, Korea, Vietnam, or regions V6 has not compiled for the period).

## Summary

- In the median sample year the atlas's Chinese realms cover 99% of the land CHGIS administers.
- Lowest coverage: 146 BCE 47%; 201 BCE 49%; 196 BCE 49%; 171 BCE 49%; 121 BCE 53%.
- 26 runs where CHGIS administers ≥ 10,000 km² that the atlas gives to another realm or leaves blank; 41 runs where the atlas draws a Chinese realm on land CHGIS shows as not administered that year (inside the footprint); atlas land outside the footprint is listed per year only.
- 12 of 83 testable realm start or end years in the atlas sit 3 or more years from the nearest burst of CHGIS prefecture turnover, with little turnover at the atlas year itself (section 4).

## 1. Per sample year

km². *CHGIS* = administered that year; *Atlas (fp)* = atlas Chinese realms inside the CHGIS footprint; *Covered* = share of CHGIS land inside an atlas Chinese realm.

| Year | Atlas Chinese realms | CHGIS | Atlas (fp) | Overlap | Covered | Given to other (largest) | Blank | Beyond, in fp | Outside fp (largest region) |
|---|---|---|---|---|---|---|---|---|---|
| 221 BCE | Qin, Qin Dynasty | 498,000 | 316,000 | 63% | 63% | 0 | 182,000 | 0 | 1,697,000 (Shaanxi) |
| 201 BCE (Han) | Han Dynasty | 891,000 | 500,000 | 46% | 49% | 347,000 (Nanyue) | 108,000 | 63,000 | 1,546,000 (Shaanxi) |
| 196 BCE | Han Dynasty | 891,000 | 500,000 | 46% | 49% | 347,000 (Nanyue) | 108,000 | 63,000 | 1,547,000 (Shaanxi) |
| 171 BCE | Han Dynasty | 891,000 | 500,000 | 46% | 49% | 347,000 (Nanyue) | 108,000 | 63,000 | 1,547,000 (Shaanxi) |
| 146 BCE | Han Dynasty | 861,000 | 500,000 | 43% | 47% | 347,000 (Nanyue) | 108,000 | 93,000 | 1,547,000 (Shaanxi) |
| 121 BCE | Han Dynasty | 977,000 | 574,000 | 51% | 53% | 347,000 (Nanyue) | 109,000 | 53,000 | 1,501,000 (Shaanxi) |
| 96 BCE | Han Dynasty | 1,135,000 | 1,055,000 | 83% | 88% | 0 | 141,000 | 61,000 | 2,191,000 (Shaanxi) |
| 71 BCE | Han Dynasty | 1,135,000 | 1,191,000 | 95% | 100% | 0 | 4,900 | 61,000 | 2,761,000 (Shaanxi) |
| 46 BCE | Han Dynasty | 1,142,000 | 1,199,000 | 94% | 100% | 0 | 4,900 | 61,000 | 3,285,000 (Shaanxi) |
| 21 BCE | Han Dynasty | 1,142,000 | 1,199,000 | 94% | 100% | 0 | 4,900 | 61,000 | 3,265,000 (Shaanxi) |
| 4 | Han Dynasty | 1,142,000 | 1,199,000 | 94% | 100% | 0 | 4,900 | 61,000 | 3,265,000 (Shaanxi) |
| 10 (Xin) | Xin Dynasty, Han Dynasty | 1,142,000 | 1,199,000 | 94% | 100% | 0 | 4,900 | 61,000 | 3,271,000 (Shaanxi) |
| 26 (Eastern Han) | Han Dynasty | 1,079,000 | 959,000 | 76% | 82% | 0 | 198,000 | 79,000 | 1,507,000 (Shaanxi) |
| 29 | Han Dynasty | 1,079,000 | 959,000 | 76% | 82% | 0 | 198,000 | 79,000 | 1,507,000 (Shaanxi) |
| 54 | Han Dynasty | 1,079,000 | 1,198,000 | 89% | 99% | 0 | 5,600 | 125,000 | 2,485,000 (Shaanxi) |
| 79 | Han Dynasty | 1,084,000 | 1,207,000 | 89% | 99% | 0 | 5,600 | 129,000 | 2,475,000 (Shaanxi) |
| 104 | Han Dynasty | 1,076,000 | 1,210,000 | 88% | 100% | 0 | 4,900 | 139,000 | 3,355,000 (Shaanxi) |
| 129 | Han Dynasty | 1,066,000 | 1,210,000 | 87% | 100% | 0 | 4,900 | 149,000 | 2,588,000 (Shaanxi) |
| 154 | Han Dynasty | 1,066,000 | 1,210,000 | 87% | 100% | 0 | 4,900 | 149,000 | 2,588,000 (Shaanxi) |
| 179 | Han Dynasty | 1,066,000 | 1,210,000 | 87% | 100% | 0 | 4,900 | 149,000 | 2,588,000 (Shaanxi) |
| 204 | Han Dynasty, Cao Cao | 1,065,000 | 1,209,000 | 87% | 99% | 0 | 5,600 | 150,000 | 2,425,000 (Shaanxi) |
| 221 (Three Kingdoms) | Cao Wei, Eastern Wu, Shu Han | 1,062,000 | 1,209,000 | 87% | 99% | 0 | 5,600 | 153,000 | 2,450,000 (Shaanxi) |
| 229 | Cao Wei, Eastern Wu, Shu Han | 1,062,000 | 1,209,000 | 87% | 99% | 0 | 5,600 | 153,000 | 3,146,000 (Shaanxi) |
| 254 | Cao Wei, Eastern Wu, Shu Han | 1,062,000 | 1,210,000 | 87% | 99% | 0 | 5,600 | 153,000 | 3,156,000 (Shaanxi) |
| 267 (Jin) | Western Jin, Eastern Wu | 1,096,000 | 1,223,000 | 89% | 99% | 0 | 5,600 | 133,000 | 3,119,000 (Shaanxi) |
| 279 | Western Jin, Eastern Wu | 1,096,000 | 1,223,000 | 89% | 99% | 0 | 5,600 | 133,000 | 3,119,000 (Shaanxi) |
| 281 (Jin takes Wu) | Western Jin | 1,073,000 | 1,223,000 | 87% | 99% | 0 | 5,600 | 155,000 | 3,119,000 (Shaanxi) |
| 304 | Western Jin | 1,076,000 | 1,226,000 | 87% | 99% | 0 | 5,600 | 156,000 | 3,110,000 (Shaanxi) |
| 305 (Sixteen Kingdoms) | Western Jin | 1,076,000 | 1,226,000 | 87% | 99% | 0 | 5,600 | 156,000 | 3,110,000 (Shaanxi) |
| 318 (Eastern Jin) | Eastern Jin, Former Zhao, Cheng Han | 1,066,000 | 1,226,000 | 86% | 99% | 0 | 5,600 | 166,000 | 2,575,000 (Shaanxi) |
| 329 | Eastern Jin, Former Zhao, Cheng Han, Former Liang | 1,029,000 | 1,226,000 | 83% | 99% | 0 | 5,600 | 203,000 | 2,575,000 (Shaanxi) |
| 354 | Eastern Jin, Former Yan, Former Qin, Former Liang | 1,028,000 | 1,226,000 | 83% | 99% | 0 | 5,600 | 203,000 | 2,570,000 (Shaanxi) |
| 379 | Eastern Jin, Former Qin | 1,028,000 | 1,226,000 | 83% | 99% | 0 | 5,600 | 203,000 | 2,582,000 (Shaanxi) |
| 387 (Northern Wei) | Eastern Jin, Later Yan, Northern Wei, Former Qin +4 | 1,028,000 | 1,226,000 | 83% | 99% | 0 | 5,600 | 203,000 | 2,703,000 (Shaanxi) |
| 404 | Eastern Jin, Later Qin, Northern Wei, Southern Yan +4 | 1,003,000 | 1,226,000 | 81% | 99% | 0 | 5,600 | 229,000 | 2,382,000 (Shaanxi) |
| 421 (Liu Song) | Liu Song Dynasty, Western Qin, Northern Wei, Xia +2 | 1,000,000 | 1,226,000 | 81% | 99% | 0 | 5,600 | 232,000 | 2,421,000 (Shaanxi) |
| 429 | Liu Song Dynasty, Xia, Western Qin, Northern Wei +2 | 1,000,000 | 1,226,000 | 81% | 99% | 0 | 5,600 | 232,000 | 2,298,000 (Shaanxi) |
| 440 (Northern Wei unites the north) | Liu Song Dynasty, Northern Wei, Northern Liang | 999,000 | 1,226,000 | 81% | 99% | 0 | 5,600 | 233,000 | 2,295,000 (Shaanxi) |
| 454 | Liu Song Dynasty, Northern Wei | 999,000 | 1,226,000 | 81% | 99% | 0 | 5,600 | 233,000 | 2,296,000 (Shaanxi) |
| 479 | Liu Song Dynasty, Northern Wei | 1,004,000 | 1,227,000 | 81% | 99% | 0 | 5,600 | 229,000 | 2,296,000 (Shaanxi) |
| 480 (Southern Qi) | Southern Qi, Northern Wei | 1,004,000 | 1,227,000 | 81% | 99% | 0 | 5,600 | 229,000 | 2,296,000 (Shaanxi) |
| 503 (Liang) | Liang Dynasty, Northern Wei | 1,016,000 | 1,237,000 | 81% | 99% | 0 | 5,600 | 227,000 | 2,286,000 (Shaanxi) |
| 504 | Liang Dynasty, Northern Wei | 1,016,000 | 1,237,000 | 81% | 99% | 0 | 5,600 | 227,000 | 2,286,000 (Shaanxi) |
| 529 | Liang Dynasty, Northern Wei | 1,020,000 | 1,241,000 | 81% | 99% | 0 | 5,600 | 227,000 | 2,282,000 (Shaanxi) |
| 536 (Wei splits) | Liang Dynasty, Western Wei, Eastern Wei | 1,024,000 | 1,243,000 | 82% | 99% | 0 | 5,600 | 224,000 | 2,280,000 (Shaanxi) |
| 554 | Liang Dynasty, Western Wei, Northern Qi | 1,026,000 | 1,248,000 | 81% | 99% | 0 | 5,600 | 228,000 | 2,182,000 (Shaanxi) |
| 558 (Chen, Northern Zhou) | Chen Dynasty, Northern Zhou, Northern Qi | 1,030,000 | 1,251,000 | 82% | 99% | 0 | 5,600 | 227,000 | 2,175,000 (Shaanxi) |
| 579 | Northern Zhou, Chen Dynasty, Later Western Liang | 1,047,000 | 1,110,000 | 72% | 86% | 0 | 147,000 | 210,000 | 1,744,000 (Shaanxi) |
| 582 (Sui) | Sui Dynasty, Chen Dynasty, Later Western Liang | 1,056,000 | 1,112,000 | 72% | 86% | 0 | 147,000 | 204,000 | 1,741,000 (Shaanxi) |
| 590 (Sui takes Chen) | Sui Dynasty | 1,268,000 | 1,247,000 | 88% | 93% | 0 | 93,000 | 72,000 | 1,790,000 (Shaanxi) |
| 604 | Sui Dynasty | 1,271,000 | 1,401,000 | 90% | 100% | 0 | 5,600 | 135,000 | 2,005,000 (Shaanxi) |
| 619 (Tang) | Sui–Tang rival regimes, Tang Dynasty, Gao Kaidao | 1,396,000 | 1,523,000 | 91% | 100% | 0 | 6,300 | 133,000 | 1,848,000 (Shaanxi) |
| 629 | Tang Dynasty | 1,405,000 | 1,560,000 | 89% | 100% | 0 | 6,300 | 161,000 | 1,816,000 (Shaanxi) |
| 654 | Tang Dynasty | 1,421,000 | 1,571,000 | 90% | 100% | 0 | 6,300 | 157,000 | 4,979,000 (Mongolia) |
| 679 | Tang Dynasty | 1,419,000 | 1,571,000 | 90% | 100% | 0 | 6,300 | 158,000 | 4,722,000 (Mongolia) |
| 704 | Tang Dynasty | 1,426,000 | 1,571,000 | 90% | 100% | 0 | 6,300 | 152,000 | 2,672,000 (Shaanxi) |
| 729 | Tang Dynasty | 1,442,000 | 1,587,000 | 90% | 100% | 0 | 6,300 | 152,000 | 2,438,000 (Shaanxi) |
| 754 | Tang Dynasty | 1,444,000 | 1,588,000 | 90% | 100% | 0 | 6,300 | 150,000 | 3,060,000 (Xinjiang (Ürümqi)) |
| 779 | Tang Dynasty | 1,467,000 | 1,596,000 | 91% | 100% | 0 | 6,300 | 136,000 | 1,495,000 (Shaanxi) |
| 804 | Tang Dynasty | 1,468,000 | 1,596,000 | 91% | 100% | 0 | 6,300 | 134,000 | 1,495,000 (Shaanxi) |
| 829 | Tang Dynasty | 1,471,000 | 1,598,000 | 91% | 100% | 0 | 6,300 | 133,000 | 1,494,000 (Shaanxi) |
| 854 | Tang Dynasty | 1,468,000 | 1,598,000 | 91% | 100% | 0 | 6,300 | 136,000 | 1,308,000 (Shaanxi) |
| 879 | Tang Dynasty | 1,468,000 | 1,598,000 | 91% | 100% | 0 | 6,300 | 136,000 | 1,515,000 (Shaanxi) |
| 904 | Tang Dynasty | 1,456,000 | 1,598,000 | 90% | 100% | 0 | 6,300 | 148,000 | 1,515,000 (Shaanxi) |
| 908 (Five Dynasties) | Later Liang Dynasty, Former Shu, Southern Chu, Southern Wu +7 | 1,452,000 | 1,601,000 | 90% | 100% | 0 | 6,300 | 155,000 | 1,653,000 (Shaanxi) |
| 924 (Later Tang) | Later Tang, Former Shu, Liao Dynasty, Southern Chu +5 | 1,453,000 | 1,601,000 | 90% | 100% | 0 | 6,300 | 154,000 | 1,815,000 (Shaanxi) |
| 929 | Liao Dynasty, Later Tang, Southern Chu, Southern Wu +4 | 1,453,000 | 1,600,000 | 90% | 100% | 0 | 7,000 | 154,000 | 3,154,000 (Mongolia (Gobi)) |
| 954 | Liao Dynasty, Later Zhou, Later Shu, Southern Wu +4 | 1,447,000 | 1,599,000 | 89% | 99% | 2,900 (Ngô Dynasty) | 6,300 | 161,000 | 3,094,000 (Mongolia (Gobi)) |
| 961 (Song) | Liao Dynasty, Northern Song, Southern Tang, Later Shu +4 | 1,449,000 | 1,600,000 | 90% | 99% | 2,900 (Ngô Dynasty) | 6,300 | 160,000 | 3,093,000 (Mongolia (Gobi)) |
| 979 | Liao Dynasty, Northern Song, Southern Tang, Southern Han +2 | 1,452,000 | 1,600,000 | 90% | 100% | 0 | 5,600 | 153,000 | 3,093,000 (Mongolia (Gobi)) |
| 980 (Song unites China proper) | Northern Song, Liao Dynasty | 1,456,000 | 1,599,000 | 90% | 100% | 0 | 5,600 | 149,000 | 3,094,000 (Mongolia (Gobi)) |
| 1004 | Northern Song, Liao Dynasty, Western Xia | 1,459,000 | 1,605,000 | 90% | 100% | 0 | 5,600 | 151,000 | 3,202,000 (Mongolia (Gobi)) |
| 1029 | Northern Song, Liao Dynasty, Western Xia | 1,455,000 | 1,605,000 | 90% | 100% | 0 | 5,600 | 155,000 | 3,202,000 (Mongolia (Gobi)) |
| 1054 | Northern Song, Liao Dynasty, Western Xia | 1,456,000 | 1,605,000 | 90% | 100% | 0 | 5,600 | 154,000 | 3,562,000 (Mongolia (Gobi)) |
| 1079 | Northern Song, Liao Dynasty, Western Xia | 1,457,000 | 1,622,000 | 89% | 100% | 0 | 5,600 | 171,000 | 3,580,000 (Mongolia (Gobi)) |
| 1104 | Northern Song, Liao Dynasty, Western Xia | 1,469,000 | 1,627,000 | 90% | 100% | 0 | 5,600 | 163,000 | 3,575,000 (Mongolia (Gobi)) |
| 1116 (Jurchen Jin) | Northern Song, Liao Dynasty, Western Xia | 1,473,000 | 1,637,000 | 89% | 100% | 0 | 5,600 | 169,000 | 3,565,000 (Mongolia (Gobi)) |
| 1128 (Jin takes the north) | Southern Song, Great Jin, Western Xia | 1,482,000 | 1,637,000 | 90% | 100% | 0 | 5,600 | 160,000 | 3,017,000 (Russian Far East) |
| 1129 | Southern Song, Great Jin, Western Xia | 1,480,000 | 1,637,000 | 90% | 100% | 0 | 5,600 | 162,000 | 3,017,000 (Russian Far East) |
| 1154 | Great Jin, Southern Song, Western Xia | 1,463,000 | 1,637,000 | 89% | 100% | 0 | 5,600 | 179,000 | 3,021,000 (Russian Far East) |
| 1179 | Great Jin, Southern Song, Western Xia | 1,475,000 | 1,637,000 | 89% | 100% | 0 | 5,600 | 167,000 | 3,021,000 (Russian Far East) |
| 1204 | Great Jin, Southern Song, Western Xia | 1,470,000 | 1,637,000 | 89% | 100% | 0 | 5,600 | 172,000 | 3,021,000 (Russian Far East) |
| 1229 | Mongol Empire, Southern Song, Great Jin | 1,501,000 | 1,704,000 | 87% | 99% | 0 | 8,100 | 211,000 | 15,222,000 (Tajikistan) |
| 1235 (Mongols take Jin) | Mongol Empire, Southern Song, Great Jin | 1,520,000 | 1,723,000 | 87% | 99% | 0 | 8,100 | 211,000 | 15,203,000 (Tajikistan) |
| 1254 | Mongol Empire, Southern Song | 1,653,000 | 1,856,000 | 88% | 100% | 0 | 5,600 | 209,000 | 24,014,000 (Tajikistan) |
| 1272 (Yuan) | Mongol Empire, Southern Song | 1,997,000 | 2,187,000 | 90% | 99% | 0 | 14,000 | 204,000 | 25,168,000 (Tajikistan) |
| 1279 | Mongol Empire | 2,809,000 | 2,835,000 | 97% | 99% | 2,800 (Pagan Kingdom) | 27,000 | 56,000 | 24,524,000 (Tajikistan) |
| 1280 (Song falls) | Mongol Empire | 2,954,000 | 2,980,000 | 97% | 99% | 2,800 (Pagan Kingdom) | 27,000 | 56,000 | 24,378,000 (Tajikistan) |
| 1304 | Yuan Dynasty | 3,405,000 | 3,412,000 | 98% | 99% | 27,000 (Shan States) | 6,200 | 40,000 | 10,817,000 (Russian Far East (Amur)) |
| 1329 | Yuan Dynasty | 3,734,000 | 3,720,000 | 98% | 99% | 47,000 (Shan States) | 6,200 | 40,000 | 10,508,000 (Russian Far East (Amur)) |
| 1354 | Yuan Dynasty | 3,844,000 | 3,790,000 | 99% | 99% | 47,000 (Shan States) | 6,200 | 0 | 10,440,000 (Russian Far East (Amur)) |
| 1369 (Ming) | Ming Dynasty | 3,752,000 | 3,293,000 | 85% | 86% | 60,000 (Shan States) | 448,000 | 48,000 | 863,000 (Gansu (Hexi)) |
| 1379 | Ming Dynasty | 3,761,000 | 3,327,000 | 84% | 86% | 62,000 (Shan States) | 465,000 | 93,000 | 830,000 (Inner Mongolia (Alxa)) |
| 1404 | Ming Dynasty | 3,682,000 | 3,883,000 | 93% | 99% | 28,000 (Lan Xang) | 6,200 | 236,000 | 1,566,000 (Inner Mongolia (Chifeng)) |
| 1429 | Ming Dynasty | 3,899,000 | 4,019,000 | 92% | 98% | 90,000 (Moghulistan) | 6,200 | 216,000 | 2,123,000 (Russian Far East) |
| 1454 | Ming Dynasty | 3,917,000 | 3,903,000 | 92% | 96% | 166,000 (Four Oirats) | 6,200 | 158,000 | 1,063,000 (Inner Mongolia (Chifeng)) |
| 1479 | Ming Dynasty | 3,717,000 | 3,573,000 | 89% | 92% | 287,000 (Mongol Khanate) | 6,200 | 150,000 | 767,000 (Inner Mongolia (Chifeng)) |
| 1504 | Ming Dynasty | 3,717,000 | 3,573,000 | 89% | 92% | 287,000 (Mongol Khanate) | 6,200 | 150,000 | 767,000 (Inner Mongolia (Chifeng)) |
| 1529 | Ming Dynasty | 3,539,000 | 3,473,000 | 95% | 96% | 118,000 (Mongol Khanate) | 6,200 | 59,000 | 269,000 (Liaoning) |
| 1554 | Ming Dynasty | 3,540,000 | 3,471,000 | 95% | 96% | 118,000 (Tümed) | 6,800 | 57,000 | 269,000 (Liaoning) |
| 1579 | Ming Dynasty | 3,540,000 | 3,402,000 | 93% | 94% | 188,000 (Tümed) | 6,800 | 57,000 | 264,000 (Liaoning) |
| 1604 | Ming Dynasty | 3,540,000 | 3,488,000 | 95% | 97% | 102,000 (Tümed) | 6,800 | 56,000 | 363,000 (Liaoning) |
| 1629 | Ming Dynasty, Later Jin Dynasty | 3,539,000 | 3,484,000 | 95% | 97% | 102,000 (Tümed) | 11,000 | 57,000 | 457,000 (Liaoning) |
| 1645 (Qing) | Qing Dynasty, Southern Ming | 3,575,000 | 3,263,000 | 83% | 87% | 82,000 (Tümed) | 388,000 | 157,000 | 2,551,000 (Russian Far East) |
| 1654 | Qing Dynasty, Southern Ming | 3,575,000 | 3,631,000 | 93% | 97% | 99,000 (Tümed) | 6,200 | 161,000 | 2,599,000 (Russian Far East) |
| 1679 | Qing Dynasty, Revolt of the Three Feudatories | 3,749,000 | 3,807,000 | 93% | 97% | 95,000 (Tümed) | 8,000 | 161,000 | 2,464,000 (Russian Far East) |
| 1684 (Qing takes Taiwan) | Qing Dynasty | 3,749,000 | 3,807,000 | 93% | 97% | 95,000 (Tümed) | 8,000 | 161,000 | 2,465,000 (Russian Far East) |
| 1704 | Qing Dynasty | 3,748,000 | 4,061,000 | 91% | 99% | 18,000 (Restored Toungoo Kingdom) | 8,000 | 339,000 | 4,870,000 (Russian Far East) |
| 1729 | Qing Dynasty | 4,302,000 | 4,258,000 | 94% | 97% | 139,000 (Tibet) | 8,000 | 103,000 | 4,901,000 (Russian Far East) |
| 1754 | Qing Dynasty | 4,451,000 | 4,395,000 | 97% | 98% | 83,000 (Tibet) | 8,000 | 35,000 | 4,948,000 (Russian Far East) |
| 1760 (Qing takes Xinjiang) | Qing Dynasty | 4,465,000 | 4,426,000 | 98% | 99% | 52,000 (Tibet) | 8,000 | 21,000 | 6,931,000 (Russian Far East) |
| 1779 | Qing Dynasty | 4,476,000 | 4,428,000 | 98% | 99% | 58,000 (Tibet) | 8,000 | 18,000 | 6,821,000 (Russian Far East) |
| 1804 | Qing Dynasty | 4,480,000 | 4,482,000 | 99% | 100% | 7,700 (Konbaung Dynasty) | 8,000 | 18,000 | 8,020,000 (Russian Far East) |
| 1829 | Qing Dynasty | 4,502,000 | 4,504,000 | 99% | 100% | 7,700 (Burma) | 8,000 | 18,000 | 7,805,000 (Russian Far East) |
| 1852 (Taiping) | Qing Dynasty | 4,502,000 | 4,503,000 | 99% | 100% | 9,200 (Burma) | 8,000 | 18,000 | 7,587,000 (Russian Far East) |
| 1854 | Qing Dynasty, Taiping Heavenly Kingdom | 4,502,000 | 4,492,000 | 99% | 99% | 9,200 (Burma) | 19,000 | 18,000 | 7,587,000 (Russian Far East) |
| 1879 | Qing Dynasty | 4,540,000 | 4,541,000 | 99% | 100% | 9,200 (Burma) | 8,000 | 18,000 | 6,576,000 (Mongolia) |
| 1904 | Qing Dynasty | 4,715,000 | 4,285,000 | 90% | 91% | 439,000 (Russian Empire) | 8,000 | 17,000 | 6,084,000 (Mongolia) |
| 1911 | Qing Dynasty | 5,374,000 | 5,334,000 | 99% | 99% | 32,000 (Russian Empire) | 7,400 | 0 | 5,762,000 (Mongolia) |

## 2. Per state, in years with several Chinese realms

CHGIS has no dynasty attribute, so it cannot say which state a prefecture belonged to. What it can say is how much of each atlas realm (inside the footprint) is administered land, and how much of CHGIS's administered land falls in each realm. A realm far below its neighbours, or a large share of CHGIS land in a realm that did not hold it, points at a misplaced border between the states. Realms under 20,000 km² are left out.

| Year | Realm | Atlas km² | In footprint | Of which CHGIS-administered | CHGIS km² inside |
|---|---|---|---|---|---|
| 221 BCE | Qin | 1,633,000 | 109,000 | 100% | 109,000 |
| 221 BCE | Qin Dynasty | 379,000 | 207,000 | 100% | 207,000 |
| 204 | Han Dynasty | 3,458,000 | 1,202,000 | 88% | 1,057,000 |
| 204 | Cao Cao | 176,000 | 7,000 | 37% | 2,500 |
| 221 | Eastern Wu | 1,399,000 | 1,070,000 | 89% | 957,000 |
| 221 | Cao Wei | 1,383,000 | 90,000 | 59% | 53,000 |
| 221 | Shu Han | 879,000 | 50,000 | 93% | 46,000 |
| 229 | Cao Wei | 2,080,000 | 90,000 | 59% | 53,000 |
| 229 | Eastern Wu | 1,399,000 | 1,070,000 | 89% | 957,000 |
| 229 | Shu Han | 879,000 | 50,000 | 93% | 46,000 |
| 254 | Cao Wei | 2,089,000 | 90,000 | 61% | 54,000 |
| 254 | Eastern Wu | 1,399,000 | 1,070,000 | 89% | 956,000 |
| 254 | Shu Han | 878,000 | 50,000 | 93% | 46,000 |
| 267 | Western Jin | 2,944,000 | 140,000 | 76% | 106,000 |
| 267 | Eastern Wu | 1,398,000 | 1,083,000 | 91% | 984,000 |
| 279 | Western Jin | 2,944,000 | 140,000 | 76% | 106,000 |
| 279 | Eastern Wu | 1,398,000 | 1,083,000 | 91% | 984,000 |
| 318 | Eastern Jin | 2,701,000 | 1,226,000 | 86% | 1,061,000 |
| 318 | Former Zhao | 652,000 | 0 | — | 0 |
| 318 | Cheng Han | 449,000 | 0 | — | 0 |
| 329 | Eastern Jin | 2,399,000 | 1,226,000 | 83% | 1,024,000 |
| 329 | Former Zhao | 652,000 | 0 | — | 0 |
| 329 | Cheng Han | 449,000 | 0 | — | 0 |
| 329 | Former Liang | 301,000 | 0 | — | 0 |
| 354 | Eastern Jin | 2,335,000 | 1,168,000 | 87% | 1,021,000 |
| 354 | Former Yan | 775,000 | 59,000 | 3% | 1,900 |
| 354 | Former Qin | 386,000 | 0 | — | 0 |
| 354 | Former Liang | 301,000 | 0 | — | 0 |
| 379 | Eastern Jin | 2,013,000 | 1,168,000 | 87% | 1,021,000 |
| 379 | Former Qin | 1,795,000 | 59,000 | 3% | 1,900 |
| 387 | Eastern Jin | 2,434,000 | 1,216,000 | 84% | 1,023,000 |
| 387 | Later Yan | 336,000 | 10,000 | 0% | 0 |
| 387 | Northern Wei | 316,000 | 0 | — | 0 |
| 387 | Former Qin | 269,000 | 0 | — | 0 |
| 387 | Later Liang | 234,000 | 0 | — | 0 |
| 387 | Western Yan | 116,000 | 0 | — | 0 |
| 387 | Western Qin | 114,000 | 0 | — | 0 |
| 387 | Later Qin | 111,000 | 0 | — | 0 |
| 404 | Eastern Jin | 2,435,000 | 1,217,000 | 82% | 997,000 |
| 404 | Later Qin | 490,000 | 0 | — | 0 |
| 404 | Northern Wei | 177,000 | 0 | — | 0 |
| 404 | Southern Yan | 154,000 | 9,500 | 0% | 0 |
| 404 | Later Yan | 119,000 | 0 | — | 0 |
| 404 | Northern Liang | 119,000 | 0 | — | 0 |
| 404 | Later Liang | 84,000 | 0 | — | 0 |
| 404 | Southern Liang | 31,000 | 0 | — | 0 |
| 421 | Liu Song Dynasty | 2,924,000 | 1,226,000 | 81% | 994,000 |
| 421 | Western Qin | 227,000 | 0 | — | 0 |
| 421 | Northern Wei | 177,000 | 0 | — | 0 |
| 421 | Xia | 136,000 | 0 | — | 0 |
| 421 | Northern Liang | 119,000 | 0 | — | 0 |
| 421 | Northern Yan | 64,000 | 0 | — | 0 |
| 429 | Liu Song Dynasty | 2,738,000 | 1,226,000 | 81% | 994,000 |
| 429 | Xia | 230,000 | 0 | — | 0 |
| 429 | Western Qin | 196,000 | 0 | — | 0 |
| 429 | Northern Wei | 177,000 | 0 | — | 0 |
| 429 | Northern Liang | 118,000 | 0 | — | 0 |
| 429 | Northern Yan | 65,000 | 0 | — | 0 |
| 440 | Liu Song Dynasty | 2,737,000 | 1,226,000 | 81% | 993,000 |
| 440 | Northern Wei | 666,000 | 0 | — | 0 |
| 440 | Northern Liang | 118,000 | 0 | — | 0 |
| 454 | Liu Song Dynasty | 2,357,000 | 1,183,000 | 84% | 993,000 |
| 454 | Northern Wei | 1,165,000 | 43,000 | 0% | 0 |
| 479 | Liu Song Dynasty | 2,357,000 | 1,184,000 | 84% | 998,000 |
| 479 | Northern Wei | 1,166,000 | 43,000 | 0% | 0 |
| 480 | Southern Qi | 2,357,000 | 1,184,000 | 84% | 998,000 |
| 480 | Northern Wei | 1,166,000 | 43,000 | 0% | 0 |
| 503 | Liang Dynasty | 2,357,000 | 1,193,000 | 85% | 1,010,000 |
| 503 | Northern Wei | 1,166,000 | 43,000 | 0% | 0 |
| 504 | Liang Dynasty | 2,357,000 | 1,193,000 | 85% | 1,010,000 |
| 504 | Northern Wei | 1,166,000 | 43,000 | 0% | 0 |
| 529 | Liang Dynasty | 2,358,000 | 1,197,000 | 85% | 1,014,000 |
| 529 | Northern Wei | 1,165,000 | 43,000 | 0% | 0 |
| 536 | Liang Dynasty | 2,037,000 | 1,199,000 | 85% | 1,019,000 |
| 536 | Western Wei | 861,000 | 0 | — | 0 |
| 536 | Eastern Wei | 624,000 | 43,000 | 0% | 0 |
| 554 | Liang Dynasty | 1,944,000 | 1,205,000 | 85% | 1,020,000 |
| 554 | Western Wei | 861,000 | 0 | — | 0 |
| 554 | Northern Qi | 624,000 | 43,000 | 0% | 0 |
| 558 | Chen Dynasty | 1,944,000 | 1,208,000 | 85% | 1,025,000 |
| 558 | Northern Zhou | 861,000 | 0 | — | 0 |
| 558 | Northern Qi | 621,000 | 43,000 | 0% | 0 |
| 579 | Northern Zhou | 1,770,000 | 150,000 | 17% | 25,000 |
| 579 | Chen Dynasty | 1,012,000 | 900,000 | 95% | 857,000 |
| 579 | Later Western Liang | 71,000 | 60,000 | 30% | 18,000 |
| 582 | Sui Dynasty | 1,770,000 | 153,000 | 22% | 34,000 |
| 582 | Chen Dynasty | 1,012,000 | 900,000 | 95% | 857,000 |
| 582 | Later Western Liang | 71,000 | 60,000 | 30% | 18,000 |
| 619 | Sui–Tang rival regimes (rival) | 1,852,000 | 1,239,000 | 90% | 1,121,000 |
| 619 | Tang Dynasty | 1,435,000 | 284,000 | 95% | 269,000 |
| 619 | Gao Kaidao | 84,000 | 0 | — | 0 |
| 908 | Later Liang Dynasty | 792,000 | 363,000 | 91% | 330,000 |
| 908 | Former Shu | 604,000 | 41,000 | 60% | 25,000 |
| 908 | Southern Chu | 416,000 | 338,000 | 80% | 270,000 |
| 908 | Southern Wu | 376,000 | 351,000 | 100% | 350,000 |
| 908 | Southern Han | 317,000 | 247,000 | 90% | 221,000 |
| 908 | Liao Dynasty | 266,000 | 0 | — | 0 |
| 908 | Wuyue | 126,000 | 121,000 | 100% | 121,000 |
| 908 | Min | 123,000 | 117,000 | 100% | 117,000 |
| 908 | Qi Kingdom | 95,000 | 0 | — | 0 |
| 908 | Former Jin | 72,000 | 19,000 | 44% | 8,500 |
| 908 | Yan Kingdom | 66,000 | 4,200 | 100% | 4,200 |
| 924 | Later Tang | 929,000 | 386,000 | 89% | 343,000 |
| 924 | Former Shu | 604,000 | 41,000 | 60% | 25,000 |
| 924 | Liao Dynasty | 429,000 | 0 | — | 0 |
| 924 | Southern Chu | 416,000 | 338,000 | 80% | 270,000 |
| 924 | Southern Wu | 376,000 | 351,000 | 100% | 350,000 |
| 924 | Southern Han | 317,000 | 247,000 | 90% | 221,000 |
| 924 | Wuyue | 126,000 | 121,000 | 100% | 121,000 |
| 924 | Min | 123,000 | 117,000 | 100% | 117,000 |
| 924 | Qi Kingdom | 95,000 | 0 | — | 0 |
| 929 | Liao Dynasty | 1,766,000 | 0 | — | 0 |
| 929 | Later Tang | 1,559,000 | 359,000 | 84% | 301,000 |
| 929 | Southern Chu | 416,000 | 338,000 | 80% | 270,000 |
| 929 | Southern Wu | 376,000 | 351,000 | 100% | 350,000 |
| 929 | Southern Han | 317,000 | 247,000 | 90% | 221,000 |
| 929 | Wuyue | 126,000 | 121,000 | 100% | 121,000 |
| 929 | Min | 123,000 | 117,000 | 100% | 117,000 |
| 929 | Jingnan | 70,000 | 67,000 | 98% | 66,000 |
| 954 | Liao Dynasty | 1,926,000 | 26,000 | 93% | 25,000 |
| 954 | Later Zhou | 795,000 | 294,000 | 86% | 254,000 |
| 954 | Later Shu | 602,000 | 41,000 | 60% | 25,000 |
| 954 | Southern Wu | 498,000 | 467,000 | 100% | 466,000 |
| 954 | Southern Chu | 416,000 | 338,000 | 78% | 263,000 |
| 954 | Southern Han | 259,000 | 244,000 | 89% | 218,000 |
| 954 | Wuyue | 127,000 | 122,000 | 100% | 122,000 |
| 954 | Jingnan | 69,000 | 67,000 | 98% | 65,000 |
| 961 | Liao Dynasty | 1,926,000 | 27,000 | 98% | 26,000 |
| 961 | Northern Song | 907,000 | 386,000 | 92% | 356,000 |
| 961 | Southern Tang | 775,000 | 691,000 | 89% | 616,000 |
| 961 | Later Shu | 602,000 | 41,000 | 60% | 25,000 |
| 961 | Southern Han | 260,000 | 245,000 | 89% | 219,000 |
| 961 | Wuyue | 127,000 | 122,000 | 100% | 122,000 |
| 961 | Jingnan | 69,000 | 67,000 | 98% | 65,000 |
| 961 | Northern Han | 26,000 | 21,000 | 49% | 10,000 |
| 979 | Liao Dynasty | 1,926,000 | 27,000 | 98% | 26,000 |
| 979 | Northern Song | 1,580,000 | 494,000 | 90% | 447,000 |
| 979 | Southern Tang | 774,000 | 690,000 | 90% | 621,000 |
| 979 | Southern Han | 260,000 | 245,000 | 90% | 220,000 |
| 979 | Wuyue | 127,000 | 122,000 | 100% | 122,000 |
| 979 | Northern Han | 26,000 | 21,000 | 49% | 10,000 |
| 980 | Northern Song | 2,767,000 | 1,572,000 | 91% | 1,424,000 |
| 980 | Liao Dynasty | 1,926,000 | 27,000 | 98% | 26,000 |
| 1004 | Northern Song | 2,765,000 | 1,576,000 | 90% | 1,426,000 |
| 1004 | Liao Dynasty | 1,926,000 | 28,000 | 98% | 27,000 |
| 1004 | Western Xia | 116,000 | 600 | 0% | 0 |
| 1029 | Northern Song | 2,765,000 | 1,576,000 | 90% | 1,422,000 |
| 1029 | Liao Dynasty | 1,926,000 | 28,000 | 98% | 27,000 |
| 1029 | Western Xia | 116,000 | 600 | 0% | 0 |
| 1054 | Northern Song | 2,764,000 | 1,576,000 | 90% | 1,423,000 |
| 1054 | Liao Dynasty | 1,925,000 | 28,000 | 98% | 27,000 |
| 1054 | Western Xia | 477,000 | 600 | 0% | 0 |
| 1079 | Northern Song | 2,800,000 | 1,594,000 | 89% | 1,424,000 |
| 1079 | Liao Dynasty | 1,925,000 | 28,000 | 98% | 27,000 |
| 1079 | Western Xia | 477,000 | 600 | 0% | 0 |
| 1104 | Northern Song | 2,800,000 | 1,598,000 | 90% | 1,437,000 |
| 1104 | Liao Dynasty | 1,925,000 | 28,000 | 98% | 27,000 |
| 1104 | Western Xia | 477,000 | 600 | 0% | 0 |
| 1116 | Northern Song | 2,800,000 | 1,604,000 | 90% | 1,442,000 |
| 1116 | Liao Dynasty | 1,925,000 | 32,000 | 79% | 25,000 |
| 1116 | Western Xia | 477,000 | 600 | 0% | 0 |
| 1128 | Southern Song | 2,800,000 | 1,604,000 | 90% | 1,451,000 |
| 1128 | Great Jin | 1,376,000 | 32,000 | 79% | 25,000 |
| 1128 | Western Xia | 478,000 | 600 | 0% | 0 |
| 1129 | Southern Song | 2,800,000 | 1,604,000 | 90% | 1,447,000 |
| 1129 | Great Jin | 1,376,000 | 32,000 | 85% | 27,000 |
| 1129 | Western Xia | 478,000 | 600 | 0% | 0 |
| 1154 | Great Jin | 2,121,000 | 291,000 | 86% | 251,000 |
| 1154 | Southern Song | 2,056,000 | 1,345,000 | 90% | 1,207,000 |
| 1154 | Western Xia | 481,000 | 600 | 0% | 0 |
| 1179 | Great Jin | 2,121,000 | 291,000 | 85% | 248,000 |
| 1179 | Southern Song | 2,056,000 | 1,345,000 | 91% | 1,221,000 |
| 1179 | Western Xia | 481,000 | 600 | 0% | 0 |
| 1204 | Great Jin | 2,121,000 | 291,000 | 84% | 243,000 |
| 1204 | Southern Song | 2,056,000 | 1,345,000 | 91% | 1,221,000 |
| 1204 | Western Xia | 481,000 | 600 | 0% | 0 |
| 1229 | Mongol Empire | 14,087,000 | 31,000 | 75% | 24,000 |
| 1229 | Southern Song | 2,056,000 | 1,377,000 | 91% | 1,253,000 |
| 1229 | Great Jin | 783,000 | 295,000 | 74% | 217,000 |
| 1235 | Mongol Empire | 14,087,000 | 31,000 | 75% | 24,000 |
| 1235 | Southern Song | 2,056,000 | 1,377,000 | 91% | 1,253,000 |
| 1235 | Great Jin | 783,000 | 314,000 | 75% | 235,000 |
| 1254 | Mongol Empire | 23,928,000 | 461,000 | 81% | 374,000 |
| 1254 | Southern Song | 1,942,000 | 1,395,000 | 91% | 1,273,000 |
| 1272 | Mongol Empire | 25,623,000 | 801,000 | 90% | 718,000 |
| 1272 | Southern Song | 1,733,000 | 1,386,000 | 91% | 1,264,000 |
| 1629 | Ming Dynasty | 3,782,000 | 3,484,000 | 98% | 3,427,000 |
| 1629 | Later Jin Dynasty | 159,000 | 0 | — | 0 |
| 1645 | Qing Dynasty | 3,629,000 | 1,222,000 | 88% | 1,075,000 |
| 1645 | Southern Ming | 2,185,000 | 2,041,000 | 99% | 2,030,000 |
| 1654 | Qing Dynasty | 6,030,000 | 3,434,000 | 95% | 3,274,000 |
| 1654 | Southern Ming | 200,000 | 196,000 | 100% | 196,000 |
| 1679 | Qing Dynasty | 4,340,000 | 2,008,000 | 93% | 1,857,000 |
| 1679 | Revolt of the Three Feudatories (rival) | 1,931,000 | 1,799,000 | 99% | 1,789,000 |
| 1854 | Qing Dynasty | 11,858,000 | 4,271,000 | 100% | 4,253,000 |
| 1854 | Taiping Heavenly Kingdom (rival) | 221,000 | 221,000 | 100% | 221,000 |

## 3. Ranked disagreements

Runs of consecutive sample years with at least 10,000 km² per atlas realm (or blank), ranked by peak area × √(number of samples). Regions are the nearest modern provincial capitals with their share of the run's area; for land the atlas draws beyond CHGIS the prefecture names are the nearest in time.

### 3a. CHGIS administers it; the atlas gives it to another realm or leaves it blank

| # | Years (samples) | Peak km² (year) | Atlas draws | Regions (share of area) | CHGIS prefectures there (most area) |
|---|---|---|---|---|---|
| 1 | 201 BCE–121 BCE (5) | 347,000 (146 BCE) | Nanyue | Guangdong 44%, Guangxi 26%, Hainan 9%, Jiangxi 7% (of 8 regions) | Guilin Jun 桂林郡, Nanhai Jun 南海郡, Xiang Jun 象郡, Yuzhang Jun 豫章郡 |
| 2 | 1369–1379 (2) | 465,000 (1379) | nothing | Yunnan 28%, Yunnan (Dali) 24%, Yunnan (Xishuangbanna) 14%, Gansu 14% (of 23 regions) | Lijiang Lu 丽江路, Weichu Lu 威楚路, Lin'an Lu 临安路, Yuanjiang Lu 元江路 |
| 3 | 1904–1911 (2) | 422,000 (1904) | Russian Empire | Jilin 29%, Liaoning 27%, Heilongjiang 21%, Inner Mongolia (Chifeng) 8% (of 12 regions) | Fengtian Fu 奉天府, Jilin Fu 吉林府, Xingjing Ting 兴京厅, Fenfen Ting 纷芬厅 |
| 4 | 1629–1645 (2) | 388,000 (1645) | nothing | Sichuan 33%, Chongqing 25%, Sichuan (Xichang) 15%, Shaanxi 9% (of 16 regions) | Sichuan Xingdusi 四川行都司, Chengdu Lu 成都府, Chongqing Fu 重庆府, Baoning Fu 保宁府 |
| 5 | 221 BCE–96 BCE (7) | 182,000 (221 BCE) | nothing | Hunan (west) 45%, Guangxi (Guilin) 24%, Hunan 20%, Jiangxi (Ganzhou) 3% (of 14 regions) | Wuling Jun 武陵郡, Changsha Guo 长沙国, Changsha Jun 长沙郡, Lingling Jun 零陵郡 |
| 6 | 1479–1529 (3) | 266,000 (1479) | Mongol Khanate | Gansu (Hexi) 52%, Qinghai 22%, Qinghai (Qaidam) 10%, Xinjiang (Hami, Turpan) 9% (of 12 regions) | Handong Wei 罕东卫, Xining Wei 西宁卫, Suzhou Wei 肃州卫, Lintao Fu 临洮府 |
| 7 | 201 BCE–171 BCE (3) | 165,000 (201 BCE) | Minyue | Jiangxi 45%, Jiangxi (Ganzhou) 25%, Guangdong (Shantou) 25%, Guangdong 4% | Yuzhang Jun 豫章郡, Nanhai Jun 南海郡, Zhang Jun 鄣郡, Changsha Guo 长沙国 |
| 8 | 26–29 (2) | 198,000 (26) | nothing | Hunan (west) 36%, Guangxi (Guilin) 20%, Jiangsu (Xuzhou) 20%, Jiangsu 8% (of 15 regions) | Wuling Jun 武陵郡, Lingling Jun 零陵郡, Donghai Jun 东海郡, Changsha Guo 长沙国 |
| 9 | 1554–1684 (8) | 91,000 (1554) | Tümed | Qinghai 67%, Gansu (Hexi) 27%, Ningxia 3%, Inner Mongolia (Alxa) 1% (of 7 regions) | Xining Wei 西宁卫, Suzhou Wei 肃州卫, Lintao Fu 临洮府, Ganzhou Wei 甘州卫 |
| 10 | 579–590 (3) | 147,000 (579) | nothing | Hunan (west) 49%, Guangxi (Guilin) 31%, Hunan 11%, Guizhou 4% (of 10 regions) | Yuanling Jun 沅陵郡, Shaoling Jun 邵陵郡, Lingling Jun 零陵郡, Tan Zhou 潭州 |
| 11 | 1729–1779 (4) | 103,000 (1729) | Tibet | Sichuan (Garzê) 48%, Tibet (Qamdo) 37%, Qinghai (Yushu) 14%, Yunnan (Dali) 1% | Yazhou Fu 雅州府, Lijiang Fu 丽江府 |
| 12 | 121 BCE (1) | 165,000 (121 BCE) | Minyue | Jiangxi 45%, Jiangxi (Ganzhou) 25%, Guangdong (Shantou) 25%, Guangdong 4% | Yuzhang Jun 豫章郡, Nanhai Jun 南海郡, Danyang Jun 丹阳郡, Guiji Jun 会稽郡 |
| 13 | 1429–1454 (2) | 68,000 (1454) | Moghulistan | Xinjiang (Lop Nur) 92%, Xinjiang (Hami, Turpan) 8% | Handong Wei 罕东卫 |
| 14 | 1579 (1) | 88,000 (1579) | First Toungoo Empire | Yunnan (Dali) 50%, Yunnan (Xishuangbanna) 48%, Myanmar 2% | Menglian Si 孟琏司, Yongchang Fu 永昌府, Cheli Si 车里宣慰司, Mengmian Si 孟缅司 |
| 15 | 1454 (1) | 76,000 (1454) | Four Oirats | Xinjiang (Hami, Turpan) 80%, Ningxia 9%, Gansu (Hexi) 7%, Inner Mongolia (Alxa) 4% (of 5 regions) | Handong Wei 罕东卫, Ningxia Wei 宁夏卫, Zhenfan Wei 镇番卫, Taiyuan Fu 太原府 |
| 16 | 1304–1379 (5) | 30,000 (1379) | Shan States | Yunnan (Dali) 90%, Myanmar 5%, Yunnan (Xishuangbanna) 5% | Dali Lu 大理路, Mangshi Lu 茫施路, Pingmian Lu 平缅路, Ruoyuan Lu 柔远路 |
| 17 | 1604–1684 (6) | 21,000 (1604) | Khoshut Khanate | Gansu (Hexi) 100% | Suzhou Wei 肃州卫, Ganzhou Wei 甘州卫, Gaotai Suo 高台所, Zhenyi Suo 镇夷所 |
| 18 | 1272–1280 (3) | 27,000 (1279) | nothing | Yunnan (Dali) 74%, Guangdong 6%, Fujian 6%, Zhejiang 6% (of 7 regions) | Dali Lu 大理路, Mangshi Lu 茫施路, Pingmian Lu 平缅路, Ruoyuan Lu 柔远路 |
| 19 | 1729–1754 (2) | 31,000 (1729) | Dzungar Khanate | Xinjiang (Hami, Turpan) 69%, Xinjiang (Lop Nur) 31% | Anxi Zhou 安西厅 |
| 20 | 1429–1554 (6) | 17,000 (1529) | Shan States | Yunnan (Xishuangbanna) 59%, Yunnan (Dali) 33%, Myanmar 8% | Menglian Si 孟琏司, Mengding Fu 孟定府, Longchuan Xuanfusi 陇川宣抚司, Jinchi Xuanweisi 金齿宣慰司 |
| 21 | 1654–1704 (4) | 17,000 (1654) | Restored Toungoo Kingdom | Yunnan (Xishuangbanna) 67%, Yunnan (Dali) 30%, Myanmar 2% | Menglian Si 孟琏司, Yongchang Fu 永昌府, Lijiang Fu 丽江府, Mengding Fu 孟定府 |
| 22 | 1369–1404 (3) | 19,000 (1379) | Lan Xang | Yunnan (Xishuangbanna) 77%, Laos 15%, Vietnam (north) 8% | Ningyuan Zhou 宁远州, Lin'an Fu 临安府, Cheli Lu 车里路, Heni Lu 和泥路 |
| 23 | 1329–1354 (2) | 19,000 (1329) | Sukhothai Kingdom | Yunnan (Xishuangbanna) 77%, Laos 15%, Vietnam (north) 8% | Ningyuan Zhou 宁远州, Cheli Lu 车里路, Heni Lu 和泥路 |
| 24 | 1854 (1) | 19,000 (1854) | nothing | Henan 44%, Jiangsu (Xuzhou) 14%, Guangdong 8%, Fujian 7% (of 9 regions) | Guide Fu 归德府, Chenzhou Fu 陈州府, Kaifeng Fu 开封府, Fengtian Fu 奉天府 |
| 25 | 1604–1629 (2) | 13,000 (1604) | Mongol khanates | Ningxia 50%, Inner Mongolia (Alxa) 23%, Inner Mongolia 13%, Beijing 13% | Ningxia Wei 宁夏卫, Wanquan Dusi 万全都司, Datong Fu 大同府, Zhenfan Wei 镇番卫 |
| 26 | 1379 (1) | 10,000 (1379) | Moghulistan | Xinjiang (Lop Nur) 94%, Xinjiang (Hami, Turpan) 6% | Shazhou Lu 沙州路 |

### Hand checks of the top five

Fixed on 2026-11-13 in content/borders/patches.json: Northern Yuan 1369 (ming-1368-1374), blank 908 (five-dynasties-908-910), blank 619 (tang-619-622) and the southern blank of 221-229 (eastern-wu-220-237); the verdicts below are kept as found.

Checked against Wikipedia (fetched 2026-11-13). *Atlas error*: the atlas should change. *CHGIS scope difference*: CHGIS maps as administered land that was not the Chinese state's (or vice versa); the atlas stands. *Ambiguous*: both readings are defensible.

| # | Disagreement | Verdict | Evidence |
|---|---|---|---|
| 1 | 201 BCE–121 BCE: Nanyue on 347,000 km² CHGIS land | CHGIS scope difference | Nanyue (204-111 BCE) was Zhao Tuo's kingdom of the Nanhai, Guilin and Xiang commanderies, a nominal Han vassal from 196 BCE but 'autonomous and mostly sovereign' until the Han conquest of 111 BCE. CHGIS keeps its commanderies as prefecture units (Nanhai Jun 206-111 BCE); the atlas is right to draw Nanyue. Source: Wikipedia 'Nanyue'. |
| 2 | 1369–1379: nothing drawn on 465,000 km² CHGIS land | not checked | — |
| 3 | 1904–1911: Russian Empire on 422,000 km² CHGIS land | not checked | — |
| 4 | 1629–1645: nothing drawn on 388,000 km² CHGIS land | not checked | — |
| 5 | 221 BCE–96 BCE: nothing drawn on 182,000 km² CHGIS land | not checked | — |

### 3b. The atlas draws a Chinese realm; CHGIS has no prefecture there that year (frontier; ranked lower)

Inside the CHGIS footprint only. Often a frontier the dynasty claimed or garrisoned without prefectures, a region lost and later regained, or a border drawn too far out.

| # | Years (samples) | Peak km² (year) | Atlas draws | Regions (share of area) | CHGIS prefectures there (most area) |
|---|---|---|---|---|---|
| 1 | 1645–1904 (15) | 339,000 (1704) | Qing Dynasty | Inner Mongolia 24%, Inner Mongolia (Chifeng) 19%, Shaanxi (Yulin) 17%, Beijing 16% (of 14 regions) | Dongsheng Ting 东胜厅, Duolunnuo'er Ting 多伦诺尔厅, Rehe Ting 热河厅, Anxi Zhou 安西厅 |
| 2 | 1369–1629 (12) | 236,000 (1404) | Ming Dynasty | Beijing 18%, Inner Mongolia 18%, Inner Mongolia (Chifeng) 16%, Gansu 12% (of 16 regions) | Shangdu Lu 上都路, Datong Lu 大同路, Xinghe Lu 兴和路, Zhuanglang Wei 庄浪卫 |
| 3 | 619–904 (13) | 161,000 (629) | Tang Dynasty | Guangxi (Guilin) 29%, Guangxi 20%, Hunan (west) 15%, Jiangsu (Xuzhou) 11% (of 17 regions) | Yuanling Jun 沅陵郡, Yongzhou Lu 邕州路, Feng Zhou 封州, Yidu Lu 益都路 |
| 4 | 318–404 (6) | 220,000 (404) | Eastern Jin | Hubei (Yichang) 30%, Jiangsu (Xuzhou) 20%, Guangxi 16%, Jiangsu 11% (of 15 regions) | Xiang Jun 象郡, Nan Jun 南郡, Ting Zhou 亭州, Donghai Jun 东海郡 |
| 5 | 421–479 (5) | 233,000 (440) | Liu Song Dynasty | Hubei (Yichang) 25%, Jiangsu (Xuzhou) 22%, Jiangsu 18%, Guangxi 14% (of 15 regions) | Guangling Jun 广陵郡, Xiang Jun 象郡, Ting Zhou 亭州, Yang Zhou 扬州 |
| 6 | 961–1116 (9) | 170,000 (1079) | Northern Song | Guangxi (Guilin) 24%, Guangxi 17%, Hunan (west) 16%, Jiangsu (Xuzhou) 14% (of 15 regions) | Sizhou Xuanfusi 思州宣抚司, Yidu Lu 益都路, Yongzhou Lu 邕州路, Jingjiang Lu 静江路 |
| 7 | 1128–1272 (9) | 157,000 (1129) | Southern Song | Guangxi 29%, Guangxi (Guilin) 26%, Hunan (west) 19%, Hubei (Yichang) 5% (of 18 regions) | Sizhou Xuanfusi 思州宣抚司, Yongzhou Lu 邕州路, Jingjiang Lu 静江路, He Zhou 贺州 |
| 8 | 26–204 (9) | 149,000 (129) | Han Dynasty | Hubei (Yichang) 40%, Guangxi 20%, Jiangsu (Xuzhou) 17%, Shanghai 5% (of 14 regions) | Nan Jun 南郡, Xiang Jun 象郡, Pengcheng Jun 彭城郡, Donghai Jun 东海郡 |
| 9 | 503–554 (5) | 185,000 (554) | Liang Dynasty | Hubei (Yichang) 27%, Jiangsu 21%, Guangxi 16%, Jiangsu (Xuzhou) 12% (of 14 regions) | Yang Zhou 扬州, Xiang Jun 象郡, Ting Zhou 亭州, Si Zhou 泗州 |
| 10 | 267–305 (5) | 156,000 (304) | Western Jin | Hubei (Yichang) 31%, Jiangsu (Xuzhou) 21%, Guangxi 16%, Guangxi (Guilin) 6% (of 15 regions) | Nan Jun 南郡, Xiang Jun 象郡, Donghai Jun 东海郡, Xu Zhou 徐州 |
| 11 | 558–582 (3) | 183,000 (558) | Chen Dynasty | Guangxi 30%, Hubei (Yichang) 19%, Jiangsu 16%, Hubei 10% (of 14 regions) | Xiang Jun 象郡, Yang Zhou 扬州, Ting Zhou 亭州, E Zhou 鄂州 |
| 12 | 201 BCE–4 (10) | 93,000 (146 BCE) | Han Dynasty | Jiangsu (Xuzhou) 27%, Fujian 23%, Guangxi 19%, Zhejiang 15% (of 10 regions) | Pengcheng Jun 彭城郡, Minzhong Jun 闽中郡, Xiang Jun 象郡, Guiji Jun 会稽郡 |
| 13 | 221–279 (5) | 115,000 (254) | Eastern Wu | Hubei (Yichang) 46%, Guangxi 24%, Jiangsu 6%, Shanghai 6% (of 11 regions) | Nan Jun 南郡, Xiang Jun 象郡, Xiapi Guo 下邳国, Yang Zhou 扬州 |
| 14 | 582–604 (3) | 135,000 (604) | Sui Dynasty | Jiangsu (Xuzhou) 28%, Hubei (Yichang) 18%, Guangxi 17%, Jiangsu 10% (of 15 regions) | Yongzhou Lu 邕州路, Yuanling Jun 沅陵郡, Donghai Jun 东海郡, Yang Zhou 扬州 |
| 15 | 480 (1) | 186,000 (480) | Southern Qi | Hubei (Yichang) 27%, Jiangsu 21%, Guangxi 17%, Jiangsu (Xuzhou) 12% (of 13 regions) | Xiang Jun 象郡, Guangling Jun 广陵郡, Ting Zhou 亭州, Yang Zhou 扬州 |
| 16 | 1154–1235 (5) | 79,000 (1235) | Great Jin | Shanxi 42%, Jiangsu (Xuzhou) 30%, Hebei 9%, Shandong 7% (of 8 regions) | Yidu Lu 益都路, Taiyuan Lu 太原路, Taiyuan Fu 太原府, Shi Zhou 石州 |
| 17 | 1254–1280 (4) | 87,000 (1254) | Mongol Empire | Shanxi 32%, Hunan (west) 19%, Jiangsu (Xuzhou) 14%, Hubei (Yichang) 8% (of 15 regions) | Taiyuan Lu 太原路, Sizhou Xuanfusi 思州宣抚司, Yidu Lu 益都路, Kuizhou Lu 夔州路 |
| 18 | 908–954 (4) | 75,000 (954) | Southern Chu | Guangxi (Guilin) 63%, Hunan (west) 23%, Guizhou 10%, Guangdong 4% (of 5 regions) | Yuanling Jun 沅陵郡, Jingjiang Lu 静江路, Zhao Zhou 昭州, Feng Zhou 封州 |
| 19 | 579 (1) | 125,000 (579) | Northern Zhou | Jiangsu (Xuzhou) 52%, Jiangsu 29%, Shanghai 6%, Anhui 5% (of 9 regions) | Yang Zhou 扬州, Xu Zhou 徐州, Si Zhou 泗州, Hai Zhou 海州 |
| 20 | 619 (1) | 118,000 (619) | Sui–Tang rival regimes | Guangxi (Guilin) 33%, Guangxi 27%, Hunan (west) 22%, Guizhou 6% (of 8 regions) | Yuanling Jun 沅陵郡, Yongzhou Lu 邕州路, Feng Zhou 封州, Lingling Jun 零陵郡 |
| 21 | 961–979 (2) | 75,000 (961) | Southern Tang | Guangxi (Guilin) 64%, Hunan (west) 22%, Guizhou 10%, Guangdong 4% (of 5 regions) | Sizhou Xuanfusi 思州宣抚司, Jingjiang Lu 静江路, Zhao Zhou 昭州, He Zhou 贺州 |
| 22 | 454–529 (6) | 43,000 (454) | Northern Wei | Jiangsu (Xuzhou) 97%, Shandong (Qingdao) 1%, Shandong 1% | Xu Zhou 徐州, Donghai Jun 东海郡, Bo Zhou 亳州, Pi Zhou 邳州 |
| 23 | 924–929 (2) | 58,000 (929) | Later Tang | Jiangsu (Xuzhou) 33%, Shanxi 18%, Shaanxi 16%, Hunan (west) 10% (of 10 regions) | Yidu Lu 益都路, Lan Zhou 岚州, Yuanling Jun 沅陵郡, Pu Zhou 蒲州 |
| 24 | 221–254 (3) | 37,000 (221) | Cao Wei | Jiangsu (Xuzhou) 79%, Anhui 9%, Hubei (Yichang) 5%, Shandong (Qingdao) 4% (of 6 regions) | Donghai Jun 东海郡, Xu Zhou 徐州, Bo Zhou 亳州, Pei Guo 沛国 |
| 25 | 908–979 (6) | 26,000 (908) | Southern Han | Guangxi 83%, Guangdong 14%, Vietnam (north) 3% | Yongzhou Lu 邕州路, Hengzhou Lu 横州路, Hepu Jun 合浦郡, Yulin Zhou 郁林州 |
| 26 | 10 (1) | 61,000 (10) | Xin Dynasty | Guangxi 41%, Jiangsu (Xuzhou) 38%, Shanghai 11%, Anhui 4% (of 7 regions) | Xiang Jun 象郡, Pengcheng Jun 彭城郡, Donghai Jun 东海郡, Guiyang Jun 桂阳郡 |
| 27 | 554–558 (2) | 43,000 (554) | Northern Qi | Jiangsu (Xuzhou) 97%, Shandong (Qingdao) 1%, Shandong 1% | Xu Zhou 徐州, Donghai Jun 东海郡, Bo Zhou 亳州, Pi Zhou 邳州 |
| 28 | 579–582 (2) | 42,000 (579) | Later Western Liang | Hubei (Yichang) 98%, Hubei 2% | Nan Jun 南郡, Ting Zhou 亭州, Gui Zhou 归州, Xia Zhou 硖州 |
| 29 | 1304–1329 (2) | 40,000 (1304) | Yuan Dynasty | Hunan (west) 63%, Guizhou 17%, Guangxi (Guilin) 14%, Chongqing 5% (of 5 regions) | Sizhou Xuanfusi 思州宣抚司, Huaiqing Lu 怀庆路 |
| 30 | 354 (1) | 57,000 (354) | Former Yan | Jiangsu (Xuzhou) 96%, Shandong (Qingdao) 3%, Shandong 1% | Donghai Jun 东海郡, Pei Guo 沛国, Linhuai Jun 临淮郡, Bo Zhou 亳州 |
| 31 | 379 (1) | 57,000 (379) | Former Qin | Jiangsu (Xuzhou) 96%, Shandong (Qingdao) 3%, Shandong 1% | Donghai Jun 东海郡, Pei Guo 沛国, Linhuai Jun 临淮郡, Bo Zhou 亳州 |
| 32 | 536 (1) | 43,000 (536) | Eastern Wei | Jiangsu (Xuzhou) 97%, Shandong (Qingdao) 1%, Shandong 1% | Xu Zhou 徐州, Donghai Jun 东海郡, Bo Zhou 亳州, Pi Zhou 邳州 |
| 33 | 954 (1) | 41,000 (954) | Later Zhou | Jiangsu (Xuzhou) 41%, Shanxi 22%, Shaanxi 19%, Henan 9% (of 7 regions) | Yidu Lu 益都路, Lan Zhou 岚州, Pu Zhou 蒲州, Jie Zhou 解州 |
| 34 | 908 (1) | 33,000 (908) | Later Liang Dynasty | Jiangsu (Xuzhou) 50%, Shaanxi 27%, Henan 12%, Hubei (Yichang) 6% (of 7 regions) | Yidu Lu 益都路, Pu Zhou 蒲州, Jie Zhou 解州, Bo Zhou 亳州 |
| 35 | 908–924 (2) | 16,000 (908) | Former Shu | Hunan (west) 63%, Hubei (Yichang) 25%, Chongqing 13% | Yuanling Jun 沅陵郡, Kuizhou Lu 夔州路, Huaide Fu 怀德府 |
| 36 | 954–961 (2) | 16,000 (954) | Later Shu | Hunan (west) 63%, Hubei (Yichang) 25%, Chongqing 13% | Yuanling Jun 沅陵郡, Sizhou Xuanfusi 思州宣抚司, Kuizhou Lu 夔州路, Huaide Fu 怀德府 |
| 37 | 961–979 (2) | 11,000 (961) | Northern Han | Shanxi 83%, Shaanxi (Yulin) 17% | Lan Zhou 岚州, Jingle Jun 静乐军, Kelan Zhou 岢岚军, Ninghua Jun 宁化军 |
| 38 | 908 (1) | 11,000 (908) | Former Jin | Shanxi 83%, Shaanxi (Yulin) 17% | Lan Zhou 岚州, Dai Zhou 代州 |
| 39 | 1645 (1) | 10,000 (1645) | Southern Ming | Guizhou 73%, Guangxi (Guilin) 20%, Guangxi 7% | Liping Fu 黎平府, Duyun Fu 都匀府, Zhenyuan Fu 镇远府, Lianzhou Fu 廉州府 |
| 40 | 1679 (1) | 10,000 (1679) | Revolt of the Three Feudatories | Guizhou 73%, Guangxi (Guilin) 20%, Guangxi 7% | Liping Fu 黎平府, Duyun Fu 都匀府, Zhenyuan Fu 镇远府, Lianzhou Fu 廉州府 |
| 41 | 387 (1) | 10,000 (387) | Later Yan | Jiangsu (Xuzhou) 94%, Shandong 6% | Donghai Jun 东海郡, Pei Guo 沛国 |

### 3c. Atlas Chinese land outside the CHGIS footprint (largest runs)

Not ranked as disagreements: protectorates, tributaries and steppe, or regions CHGIS V6 has not compiled for the period.

| # | Years (samples) | Peak km² (year) | Atlas realm | Regions (share of area) |
|---|---|---|---|---|
| 1 | 1229–1280 (6) | 24,822,000 (1272) | Mongol Empire | Tajikistan 23%, Kazakhstan 10%, Russia (Tuva) 7%, Russian Far East (Amur) 6% (of 72 regions) |
| 2 | 1645–1911 (16) | 8,020,000 (1804) | Qing Dynasty | Russian Far East 8%, Mongolia 6%, Mongolia (Gobi) 6%, Russian Far East (Amur) 6% (of 60 regions) |
| 3 | 1304–1354 (3) | 10,817,000 (1304) | Yuan Dynasty | Russian Far East (Amur) 11%, Russia (Transbaikal) 11%, Russia (Tuva) 11%, Mongolia 6% (of 59 regions) |
| 4 | 619–904 (13) | 4,979,000 (654) | Tang Dynasty | Shaanxi 9%, Sichuan 7%, Chongqing 5%, Henan 5% (of 59 regions) |
| 5 | 201 BCE–4 (10) | 3,285,000 (46 BCE) | Han Dynasty | Shaanxi 9%, Sichuan 7%, Henan 6%, Chongqing 5% (of 51 regions) |
| 6 | 26–204 (9) | 3,355,000 (104) | Han Dynasty | Shaanxi 9%, Sichuan 7%, Chongqing 5%, Gansu 5% (of 51 regions) |
| 7 | 1369–1629 (12) | 2,123,000 (1429) | Ming Dynasty | Liaoning 12%, Inner Mongolia (Chifeng) 11%, Jilin 8%, Gansu (Hexi) 6% (of 40 regions) |
| 8 | 267–305 (5) | 3,119,000 (281) | Western Jin | Shaanxi 7%, Xinjiang (Aksu, Kucha) 7%, Xinjiang (Lop Nur) 6%, Sichuan 5% (of 50 regions) |
| 9 | 908–1116 (13) | 1,900,000 (954) | Liao Dynasty | Mongolia (Gobi) 18%, Inner Mongolia (Chifeng) 16%, Inner Mongolia 13%, Mongolia 10% (of 19 regions) |
| 10 | 1128–1235 (7) | 1,830,000 (1154) | Great Jin | Russian Far East 21%, Inner Mongolia (Chifeng) 10%, Jilin 10%, Liaoning 7% (of 22 regions) |
| 11 | 421–479 (5) | 1,697,000 (421) | Liu Song Dynasty | Sichuan 11%, Guizhou 10%, Chongqing 9%, Yunnan 8% (of 33 regions) |
| 12 | 387–529 (11) | 1,122,000 (479) | Northern Wei | Shaanxi 15%, Henan 10%, Gansu 9%, Shanxi 9% (of 23 regions) |
| 13 | 961–1116 (9) | 1,206,000 (1079) | Northern Song | Shaanxi 17%, Sichuan 13%, Henan 10%, Chongqing 10% (of 31 regions) |
| 14 | 318–404 (6) | 1,475,000 (318) | Eastern Jin | Guizhou 11%, Yunnan 9%, Chongqing 8%, Vietnam (north) 7% (of 40 regions) |
| 15 | 1128–1272 (9) | 1,195,000 (1128) | Southern Song | Sichuan 17%, Chongqing 16%, Shaanxi 13%, Sichuan (Xichang) 9% (of 29 regions) |
| 16 | 582–604 (3) | 2,005,000 (604) | Sui Dynasty | Shaanxi 12%, Sichuan 9%, Henan 8%, Chongqing 6% (of 40 regions) |
| 17 | 221–254 (3) | 1,999,000 (254) | Cao Wei | Shaanxi 9%, Henan 8%, Xinjiang (Aksu, Kucha) 7%, Xinjiang (Lop Nur) 7% (of 33 regions) |
| 18 | 10 (1) | 3,271,000 (10) | Xin Dynasty | Shaanxi 6%, Xinjiang (Aksu, Kucha) 6%, Xinjiang (Lop Nur) 6%, Sichuan 5% (of 51 regions) |
| 19 | 354–387 (3) | 1,736,000 (379) | Former Qin | Shaanxi 20%, Henan 10%, Shaanxi (Yulin) 9%, Sichuan 7% (of 26 regions) |
| 20 | 503–554 (5) | 1,164,000 (503) | Liang Dynasty | Guizhou 13%, Yunnan 11%, Chongqing 10%, Sichuan 9% (of 27 regions) |
| 21 | 558–579 (2) | 1,620,000 (579) | Northern Zhou | Shaanxi 17%, Sichuan 13%, Gansu 9%, Gansu (Hexi) 8% (of 30 regions) |
| 22 | 924–929 (2) | 1,200,000 (929) | Later Tang | Shaanxi 16%, Henan 13%, Sichuan 9%, Shandong 7% (of 25 regions) |
| 23 | 1004–1204 (11) | 480,000 (1154) | Western Xia | Gansu (Hexi) 39%, Inner Mongolia (Alxa) 22%, Shaanxi (Yulin) 14%, Inner Mongolia 9% (of 8 regions) |
| 24 | 221 BCE (1) | 1,524,000 (221 BCE) | Qin | Shaanxi 13%, Sichuan 10%, Henan 9%, Hubei (Yichang) 8% (of 28 regions) |
| 25 | 221–254 (3) | 829,000 (229) | Shu Han | Sichuan 19%, Guizhou 16%, Chongqing 16%, Yunnan 14% (of 14 regions) |

## 4. Transition years

For each year the atlas starts or ends a Chinese realm (as drawn near China), the CHGIS prefectures inside the realm that year are tested for turnover: the share of their area where a prefecture record begins (is created, renamed or re-bounded) in each year within 20 years of the switch. A new regime usually renames and redraws prefectures within a year or two, so a burst of turnover a few years away from the atlas year suggests the atlas switches at a different time from CHGIS. Reforms inside a dynasty also cause bursts (Sui 607, Tang 742 and 758, Ming 1376), and some dynasties kept their predecessor's prefectures (Qing 1644), so this is a pointer, not a verdict. *Nearest burst*: the closest year with ≥ 20% turnover. *Flag*: that burst is 3 or more years from the atlas switch and turnover within a year of the switch is under 10%.

| Realm | Atlas | Conventional | CHGIS km² inside | Nearest burst ≥ 20% | Largest burst | Turnover at atlas year ±1 | Flag |
|---|---|---|---|---|---|---|---|
| Western Chu | starts 208 BCE | — | 123,000 | 206 BCE (30%) | 212 BCE (49%) | 0% |  |
| Zhai | starts 208 BCE | — | 377,000 | 206 BCE (26%) | 222 BCE (74%) | 0% |  |
| Qin Dynasty | last drawn 207 BCE | 206 BCE | 160,000 | 206 BCE (34%) | 222 BCE (66%) | 34% |  |
| Western Chu | last drawn 203 BCE | — | 133,000 | 201 BCE (41%) | 212 BCE (46%) | 41% |  |
| Xin Dynasty | starts 9 | 9 | 1,137,000 | 14 (57%) | 14 (57%) | 7% | **yes** |
| Xin Dynasty | last drawn 23 | 23 | 880,000 | 23 (52%) | 23 (52%) | 52% |  |
| Eastern Wu | starts 207 | 222 | 503,000 | 191 (29%) | 191 (29%) | 10% |  |
| Han Dynasty | last drawn 220 | 220 | 46,000 | 209 (100%) | 209 (100%) | 0% | **yes** |
| Shu Han | starts 221 | 221 | 46,000 | 209 (100%) | 209 (100%) | 0% | **yes** |
| Shu Han | last drawn 262 | 263 | 46,000 | 263 (100%) | 263 (100%) | 100% |  |
| Cao Wei | last drawn 264 | 266 | 101,000 | 263 (46%) | 263 (46%) | 8% |  |
| Western Jin | starts 265 | 266 | 106,000 | 263 (44%) | 263 (44%) | 13% |  |
| Eastern Wu | last drawn 279 | 280 | 984,000 | 282 (22%) | 265 (26%) | 14% |  |
| Western Jin | last drawn 316 | 316 | 1,061,000 | none | 331 (9%) | 1% |  |
| Eastern Jin | starts 317 | 317 | 1,061,000 | none | 331 (9%) | 1% |  |
| Eastern Jin | last drawn 420 | 420 | 994,000 | none | 420 (12%) | 12% |  |
| Liu Song Dynasty | starts 421 | 420 | 994,000 | none | 420 (12%) | 12% |  |
| Liu Song Dynasty | last drawn 479 | 479 | 998,000 | 479 (21%) | 479 (21%) | 21% |  |
| Southern Qi | starts 480 | 479 | 998,000 | 479 (21%) | 479 (21%) | 21% |  |
| Southern Qi | last drawn 501 | 502 | 998,000 | 502 (22%) | 502 (22%) | 22% |  |
| Liang Dynasty | starts 502 | 502 | 1,010,000 | 502 (23%) | 502 (23%) | 23% |  |
| Liang Dynasty | last drawn 556 | 557 | 1,021,000 | none | 560 (17%) | 6% |  |
| Chen Dynasty | starts 557 | 557 | 1,025,000 | none | 560 (17%) | 6% |  |
| Northern Zhou | last drawn 580 | 581 | 25,000 | 583 (87%) | 583 (87%) | 0% |  |
| Sui Dynasty | starts 581 | 581 | 25,000 | 583 (87%) | 583 (87%) | 0% |  |
| Later Western Liang | last drawn 586 | — | 37,000 | 583 (75%) | 607 (98%) | 16% |  |
| Chen Dynasty | last drawn 588 | 589 | 880,000 | 589 (61%) | 607 (98%) | 61% |  |
| Sui Dynasty | last drawn 618 | 618 | 1,379,000 | 621 (65%) | 607 (98%) | 15% |  |
| Sui–Tang rival regimes | starts 619 | — | 1,121,000 | 621 (69%) | 607 (98%) | 11% |  |
| Tang Dynasty | starts 619 | 618 | 269,000 | 619 (23%) | 607 (96%) | 35% |  |
| Sui–Tang rival regimes | last drawn 622 | — | 1,128,000 | 622 (39%) | 607 (96%) | 39% |  |
| Tang Dynasty | last drawn 907 | 907 | 1,446,000 | none | 907 (8%) | 8% |  |
| Former Shu | starts 908 | 907 | 25,000 | none | 908 (0%) | 0% |  |
| Later Liang Dynasty | starts 908 | 907 | 330,000 | none | 923 (6%) | 5% |  |
| Min | starts 908 | 909 | 117,000 | none | 908 (0%) | 0% |  |
| Southern Chu | starts 908 | 907 | 270,000 | 907 (33%) | 907 (33%) | 33% |  |
| Southern Han | starts 908 | 917 | 221,000 | none | 917 (17%) | 1% |  |
| Southern Wu | starts 908 | — | 350,000 | none | 920 (9%) | 0% |  |
| Wuyue | starts 908 | 907 | 121,000 | none | 906 (13%) | 11% |  |
| Later Liang Dynasty | last drawn 922 | 923 | 330,000 | none | 923 (6%) | 6% |  |
| Later Tang | starts 923 | 923 | 342,000 | none | 923 (6%) | 6% |  |
| Former Shu | last drawn 925 | 925 | 25,000 | none | 940 (14%) | 0% |  |
| Jingnan | starts 926 | — | 66,000 | none | 912 (17%) | 0% |  |
| Later Tang | last drawn 935 | 937 | 301,000 | none | 923 (7%) | 3% |  |
| Later Jin | starts 936 | 936 | 252,000 | none | 923 (8%) | 4% |  |
| Later Shu | starts 936 | 934 | 25,000 | none | 940 (14%) | 0% |  |
| Later Jin | last drawn 946 | 947 | 253,000 | none | 948 (7%) | 7% |  |
| Min | last drawn 946 | 945 | 117,000 | 948 (53%) | 948 (53%) | 53% |  |
| Later Han | starts 947 | 947 | 253,000 | none | 948 (7%) | 7% |  |
| Later Han | last drawn 950 | 951 | 254,000 | none | 948 (7%) | 1% |  |
| Later Zhou | starts 951 | 951 | 254,000 | none | 948 (7%) | 1% |  |
| Later Zhou | last drawn 959 | 960 | 254,000 | none | 977 (10%) | 4% |  |
| Southern Chu | last drawn 959 | 951 | 263,000 | 947 (31%) | 940 (31%) | 0% | **yes** |
| Southern Wu | last drawn 959 | — | 466,000 | 975 (26%) | 975 (26%) | 4% | **yes** |
| Northern Song | starts 960 | 960 | 356,000 | none | 957 (9%) | 3% |  |
| Southern Tang | starts 960 | 937 | 616,000 | 975 (20%) | 975 (20%) | 3% | **yes** |
| Jingnan | last drawn 969 | — | 65,000 | none | 964 (18%) | 0% |  |
| Later Shu | last drawn 969 | 965 | 25,000 | none | 964 (11%) | 0% |  |
| Southern Han | last drawn 979 | 971 | 220,000 | 972 (29%) | 972 (29%) | 3% | **yes** |
| Southern Tang | last drawn 979 | 976 | 621,000 | 975 (20%) | 975 (20%) | 13% |  |
| Wuyue | last drawn 979 | 978 | 122,000 | none | 977 (17%) | 15% |  |
| Liao Dynasty | last drawn 1125 | 1125 | 25,000 | 1129 (48%) | 1129 (48%) | 10% | **yes** |
| Great Jin | starts 1126 | 1115 | 25,000 | 1129 (48%) | 1129 (48%) | 10% | **yes** |
| Northern Song | last drawn 1126 | 1127 | 1,442,000 | none | 1142 (5%) | 4% |  |
| Southern Song | starts 1127 | 1127 | 1,445,000 | none | 1142 (5%) | 4% |  |
| Great Jin | last drawn 1235 | 1234 | 235,000 | 1235 (22%) | 1218 (32%) | 22% |  |
| Southern Song | last drawn 1278 | 1279 | 944,000 | 1277 (45%) | 1277 (45%) | 17% |  |
| Mongol Empire | last drawn 1293 | 1271 | 3,333,000 | 1277 (21%) | 1277 (21%) | 3% | **yes** |
| Yuan Dynasty | starts 1294 | 1271 | 3,334,000 | 1277 (20%) | 1277 (20%) | 3% | **yes** |
| Ming Dynasty | starts 1368 | 1368 | 3,340,000 | 1368 (32%) | 1368 (32%) | 32% |  |
| Li Zicheng | starts 1632 | 1644 | 30,000 | none | 1615 (14%) | 0% |  |
| Li Zicheng | last drawn 1644 | 1645 | 396,000 | none | 1648 (7%) | 0% |  |
| Ming Dynasty | last drawn 1644 | 1644 | 2,997,000 | none | 1661 (3%) | 2% |  |
| Southern Ming | starts 1645 | 1644 | 2,030,000 | none | 1661 (4%) | 2% |  |
| Southern Ming | last drawn 1658 | 1662 | 196,000 | 1661 (35%) | 1661 (35%) | 15% |  |
| Kingdom of Tungning | starts 1662 | 1661 | 35,000 | 1662 (100%) | 1662 (100%) | 100% |  |
| Kingdom of Tungning | last drawn 1672 | 1683 | 35,000 | 1663 (100%) | 1663 (100%) | 0% | **yes** |
| Revolt of the Three Feudatories | starts 1673 | 1673 | 934,000 | none | 1666 (9%) | 0% |  |
| Revolt of the Three Feudatories | last drawn 1682 | 1681 | 1,789,000 | none | 1687 (7%) | 3% |  |
| Taiping Heavenly Kingdom | starts 1853 | 1851 | 221,000 | none | 1863 (14%) | 0% |  |
| Panthay Rebellion | starts 1856 | 1856 | 340,000 | none | 1839 (5%) | 0% |  |
| Taiping Heavenly Kingdom | last drawn 1864 | 1864 | 186,000 | none | 1865 (0%) | 0% |  |
| Panthay Rebellion | last drawn 1872 | 1873 | 340,000 | none | 1887 (2%) | 0% |  |

Not tested (under 20,000 km² of CHGIS land inside, mostly northern states before the Song, where V6 has little coverage): Dai (starts 208 BCE); Han (starts 208 BCE); Jibei (starts 208 BCE); Wei (starts 208 BCE); Yan (starts 208 BCE); Chang-shan (starts 206 BCE); Henan (starts 206 BCE); Hán (starts 206 BCE); Jiaodong (starts 206 BCE); Jiujiang (starts 206 BCE); Liaodong (starts 206 BCE); Linjiang (starts 206 BCE); Qi (starts 206 BCE); Sai (starts 206 BCE); Yin (starts 206 BCE); Yong (starts 206 BCE); Chang-shan (last drawn 204 BCE); Dai (last drawn 204 BCE); Henan (last drawn 204 BCE); Hán (last drawn 204 BCE); Jiaodong (last drawn 204 BCE); Jibei (last drawn 204 BCE); Jiujiang (last drawn 204 BCE); Liaodong (last drawn 204 BCE); Linjiang (last drawn 204 BCE); Qi (last drawn 204 BCE); Sai (last drawn 204 BCE); Wei (last drawn 204 BCE); Yan (last drawn 204 BCE); Yin (last drawn 204 BCE); Yong (last drawn 204 BCE); Zhai (last drawn 204 BCE); Han Dynasty (last drawn 13); Cao Cao (starts 197); Cheng Han (starts 306); Former Zhao (starts 306); Former Liang (starts 324); Former Zhao (last drawn 336); Former Yan (starts 337); Later Zhao (starts 337); Cheng Han (last drawn 346); Later Zhao (last drawn 352); Former Qin (starts 353); Former Yan (last drawn 370); Former Liang (last drawn 377); Later Liang (starts 387); Later Qin (starts 387); Later Yan (starts 387); Northern Wei (starts 387); Western Qin (starts 387); Western Yan (starts 387); Former Qin (last drawn 393); Western Yan (last drawn 393); Northern Liang (starts 397); Southern Liang (starts 397); Western Qin (last drawn 401); Southern Yan (starts 402); Later Liang (last drawn 406); Western Liang (starts 407); Later Yan (last drawn 409); Southern Yan (last drawn 409); Western Liang (last drawn 409); Northern Yan (starts 410); Western Qin (starts 410); Xia (starts 410); Southern Liang (last drawn 413); Later Qin (last drawn 416); Northern Yan (last drawn 438); Western Qin (last drawn 438); Xia (last drawn 438); Northern Liang (last drawn 440); Northern Wei (last drawn 533); Eastern Wei (starts 534); Western Wei (starts 534); Eastern Wei (last drawn 549); Northern Qi (starts 550); Western Wei (last drawn 556); Northern Zhou (starts 557); Later Western Liang (starts 561); Northern Qi (last drawn 576); Gao Kaidao (starts 619); Gao Kaidao (last drawn 625); Former Jin (starts 908); Liao Dynasty (starts 908); Qi Kingdom (starts 908); Yan Kingdom (starts 908); Yan Kingdom (last drawn 921); Former Jin (last drawn 922); Qi Kingdom (last drawn 925); Northern Han (starts 960); Northern Han (last drawn 979); Western Xia (starts 990); Mongol Empire (starts 1206); Western Xia (last drawn 1226); Yuan Dynasty (last drawn 1368); Later Jin Dynasty (starts 1619).

## Limits

- CHGIS V6 maps prefectures only: protectorates (the Western Regions, Annam under the Tang), military commanderies outside the prefecture system, tributaries and steppe confederations are outside it by design, which is why the atlas's frontier area is ranked low.
- V6 does not cover every region in every period; the footprint rule hides regions it has not compiled, but it cannot tell a region compiled late from one first administered late, nor a gap in compilation from a real loss.
- CHGIS carries no dynasty attribute, so it cannot split land between states in periods of division; section 2 reports per atlas state instead.
- The 0.25° grid misses prefectures and islands smaller than a few cells.
- Turnover bursts mark administrative change, not conquest; reforms (Sui 583 and 607, Tang 742 and 758, Yuan 1277–1290s, Qing 1724–1735) also show up.

Citation: "CHGIS Version 6." (c) Fairbank Center for Chinese Studies and the Institute for Chinese Historical Geography at Fudan University, Dec 2016.
