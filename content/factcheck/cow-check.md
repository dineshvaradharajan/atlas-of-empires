# Dated territorial changes cross-checked against Correlates of War (1816–1991)

Written by `tools/check_cow.py` on 2026-11-13. Read-only: nothing in the atlas was changed.

The Correlates of War (COW) Territorial Change dataset v6 lists every transfer of territory involving at least one COW state from 1816 to 2018, with the year and month, the gaining and losing entity, the territory's area and whether it was an independence. It records no shapes, so this report tests *when* the atlas moves a territory and *to whom*, not where the borders run (for borders see `cshapes-check.md`, 1886–1991).

> Source: Tir, Jaroslav, Philip Schafer, Paul F. Diehl, and Gary Goertz. 1998. "Militarized Interstate Disputes and Territorial Change, 1816–1992." *Conflict Management and Peace Science* 16(2): 89–97. (COW Territorial Change v6.) Data [correlatesofwar.org/data-sets/territorial-change](https://correlatesofwar.org/data-sets/territorial-change/); state codes from the COW State System Membership List v2016 ([correlatesofwar.org](https://correlatesofwar.org/data-sets/state-system-membership/)). This report carries only figures derived from them; the raw files are not in the repository.

## How it was compared

- Atlas: the border chunks in `public/data/clio/` with `content/corrections.json` and `public/data/supplements.json` applied, read by `tools/check_cshapes.py`'s `load_atlas()` for 1815–1991. Each realm is mapped to a COW code with that script's realm → Gleditsch–Ward table (converted where COW differs: Serbia is COW 345, Yemen after 1990 679, united Germany 255) plus a table in `check_cow.py` for the states that ended before 1886 (Prussia, Sardinia, the German and Italian states, Mexico's regimes, Texas, Gran Colombia...). A colony counts for its owner.
- COW: each transfer gets a representative point inside the territory, written by hand: by change number for partial transfers (Schleswig, Holstein, Alsace, Lorraine, Savoy, Nice, the Oregon Country, Bessarabia...), else by the entity code for whole units (Texas, Hanover, Bosnia...). Transfers whose territory cannot be placed ("Russia gains unnamed land", small border rectifications) are counted and left out. Points marked *(approx.)* or *(guess)* stand for a vaguely described territory.
- For each point the atlas is read in every year from 1815 to 1991. A transfer in year Y **matches** if the atlas first shows the gainer there in Y or Y+1 and the year before that shows the loser. Otherwise it is *early* or *late* by the difference, or the atlas never shows the gainer there within 25 years (*missing*), or shows a third state (*wrong gainer*), or shows the gainer taking it from a state other than the COW loser (*wrong loser*; only tested when the loser is a state the atlas draws, the dates agree within a year, and the year before is not in 1914–1920 or 1938–1945, when the atlas rightly draws occupiers; COW's Austria and Hungary count as the atlas's Austria-Hungary).
- Independences (indep = 1): the first year the atlas draws the new state anywhere (as a state, not a colony) is compared with the COW year.
- COW dates a change to its treaty (or the end of fighting, a plebiscite or an act of annexation), and codes protectorates and occupations as transfers. Many differences below are those conventions; the verdicts in section 0 say which.

## Summary

- COW transfers 1816–1991: 802 (and 40 from 1992 to 2018, not tested: the atlas draws Natural Earth borders from 1992).
- Located and tested: 570 transfers (582 points); not located: 211; to or from the League of Nations / UN, not tested: 19; a state transferring to itself (UAE federation): 2.
- Of the 582 points: 262 match, 65 are one year off, 136 differ by 2 years or more, 56 never show the change (16 with no change drawn, 40 with nothing drawn), 36 show the gainer holding the point throughout, 0 give it to a third state, 12 show the gainer taking it from someone other than the COW loser, and 15 are 1991 changes whose year after falls in the Natural Earth period.
- Of the 136 differences of 2+ years, 54 have the atlas switching in a year ending in 0 or 5 (about 27 would by chance): many come from the decade or half-decade snapshots the atlas's base layer (Cliopatria) is built from, which move a border to the next snapshot year.
- Independences: 181; the atlas starts the new state in the COW year (or the next) for 123, one year off for 12, 2+ years off for 30, never draws it as a state for 1, drew it only before the COW date for 0, and 15 are 1991 independences (the state appears with the Natural Earth borders of 1992).

## 0. Hand-checked top findings

The five largest date errors in section 1 (ties broken by area), plus the largest-area items from sections 1, 3 and 4 that are not plainly a COW coding convention, each checked against a fetched source. *Atlas error*: the atlas is wrong by the historical record. *COW coding*: the atlas is right and COW's date or parties are a convention or a slip. *Ambiguous*: both are defensible readings.

| # | Finding | COW | Atlas | Source checked | Verdict |
|---|---|---|---|---|---|
| 1 | Santo Domingo (No. 39): the atlas draws Haiti 1822–1845 and the Dominican Republic from 1846 | 1821-11, Dominican Republic ← Spain (indep.) | change in 1846 (+24) | [Dominican War of Independence](https://en.wikipedia.org/wiki/Dominican_War_of_Independence) | **Ambiguous**: COW codes the five-week "Ephemeral Independence" of 9 November 1821 and records neither Haiti's takeover (9 February 1822) nor independence from Haiti (27 February 1844), so the 24 years are COW's choice of event. Against 1844, though, the atlas is two years late (atlas error). |
| 2 | Kaiser-Wilhelmsland (No. 524): drawn as "British Colonial Empire" 1921–1943, Australia only from 1944 | 1920-12, Australia ← Germany (mandate) | change in 1944 (+23) | [Territory of New Guinea](https://en.wikipedia.org/wiki/Territory_of_New_Guinea) | **Atlas error**: Australia held the League mandate from 17 December 1920. The land is drawn, but under the wrong holder: the atlas files the Australian mandate under the British empire until the Japanese war. |
| 3 | Essequibo (No. 383): British from 1877 in the atlas | 1899-10, United Kingdom ← Venezuela | change in 1877 (−22) | [Guayana Esequiba](https://en.wikipedia.org/wiki/Guayana_Esequiba) | **Ambiguous**: Britain held British Guiana from 1814 and settled west of the Essequibo (Cuyuni gold mines 1876, Schomburgk Line declared the provisional frontier 1886). The award of 3 October 1899 confirmed most of the claim. COW dates the award; the atlas shows British possession before it. |
| 4 | Kuwait (No. 384) drawn inside the Sultanate of Muscat and Oman 1900–1921; Qatar (No. 460) likewise 1916–1935 | 1899-01, United Kingdom ← Kuwait (protection agreement) | change in 1922 (+22) | [Sheikhdom of Kuwait](https://en.wikipedia.org/wiki/Sheikhdom_of_Kuwait) | **Atlas error**: Kuwait was a British-protected sheikhdom from the 1899 agreement, under nominal Ottoman suzerainty until 1914. It was never part of Muscat and Oman. The Omani polygon or label spills over the Gulf sheikhdoms (the same at Doha 1916–1935). |
| 5 | East Upper Silesia (No. 539): Katowice drawn as German 1919–1944 (nothing drawn 1934–1935) | 1922-08, Poland ← Germany | change in 1945 (+22) | [Upper Silesia plebiscite](https://en.wikipedia.org/wiki/Upper_Silesia_plebiscite) | **Atlas error**: East Upper Silesia (about 3,214 km², the industrial district round Katowice) went to Poland under the decision of 20 October 1921 and the Geneva Convention of 15 May 1922. It was the Silesian Voivodeship until 1939. It is too small for the CShapes check's 10,000 km² threshold. |
| 6 | Luxembourg (No. 180): covered by the Netherlands until 1889 (and still overlapped by it after 1890) | 1867-12, Luxembourg ← Netherlands (indep.) | Luxembourg from 1890 (+22) | [Treaty of London (1867)](https://en.wikipedia.org/wiki/Treaty_of_London_(1867)) | **Atlas error**: Luxembourg was a separate grand duchy in personal union with the Dutch crown until 1890, never Dutch territory, and the 1867 treaty confirmed its full independence. COW's 1867 date is itself a convention. The CShapes check found the same gap for 1886–1889. |
| 7 | Antofagasta (No. 265): Bolivian in the atlas until 1904 | 1884-04, Chile ← Bolivia (truce) | change in 1905 (+20) | [Treaty of Peace and Friendship (1904)](https://en.wikipedia.org/wiki/Treaty_of_Peace_and_Friendship_(1904)) | **Ambiguous**: Chile occupied the Litoral in 1879 and administered it under the Valparaíso truce of 1884. Bolivia recognised Chilean sovereignty only in the 1904 treaty. COW follows the truce, the atlas the de jure date. |
| 8 | Sudan (No. 276): nothing drawn 1885–1889, the Mahdist State only from 1890 | 1884-01, Sudan ← United Kingdom (indep.) | from 1890 (+5) | [Mahdist State](https://en.wikipedia.org/wiki/Mahdist_State) | **Atlas error**: Khartoum fell on 26 January 1885, and the Mahdist state held most of the Sudan until 1898–99. The atlas leaves about 2.5 million km² blank for five years. COW's January 1884 is a year early. |
| 9 | Papua New Guinea (No. 802): drawn as a state from 1946 | 1975-09, Papua New Guinea ← Australia (indep.) | from 1946 (−29) | [Territory of Papua and New Guinea](https://en.wikipedia.org/wiki/Territory_of_Papua_and_New_Guinea) | **Atlas error**: It was an Australian external territory (united administration from 1 July 1949) until independence on 16 September 1975. The CShapes check (section 3) found the same. |
| 10 | Somalia (No. 706): "British Africa" 1941–1959 | 1960-07, Somalia ← Italy (indep.); 1949 trusteeship to Italy (No. 638, UN, not tested) | British until 1959 | [Trust Territory of Somaliland](https://en.wikipedia.org/wiki/Trust_Territory_of_Somaliland) | **Atlas error (1950–1959)**: The British military administration of 1941–1950 is right, but Italy administered the UN trust territory from 1 April 1950 to 1960. |

## 1. Date mismatches (2 years or more)

The atlas shows the gainer taking the point, but in another year. *Error* = atlas year − COW year (negative: the atlas is early). Largest error first, then largest area. One-year differences are counted, not listed.

| # | COW year | No. | Territory (point) | Gainer ← loser | km² | Atlas before (year) | Atlas after (year) | Atlas change | Error |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 1821-11 | 39 | Dominican Republic (Santo Domingo) (18.80°N 70.50°W) | Dominican Republic ← Spain | 48,734 | Republic of Haiti (1845) | Republic of Haiti (1822) | 1846 | +24 |
| 2 | 1920-12 | 524 | New Guinea (German New Guinea) (Kaiser Wilhelmsland) (5.80°S 145.00°E) | Australia ← Germany | 240,870 | British Colonial Empire, Empire of Japan (1943) | British Colonial Empire (1921) | 1944 | +23 |
| 3 | 1899-10 | 383 | Venezuela: Essequibo (6.50°N 59.50°W) | United Kingdom ← Venezuela | 155,400 | nothing drawn (1876) | British Colonial Empire (1900) | 1877 | -22 |
| 4 | 1899-01 | 384 | Kuwait (29.30°N 47.80°E) | United Kingdom ← Kuwait | 15,540 | Sultanate of Muscat and Oman (1921) | Sultanate of Muscat and Oman (1900) | 1922 | +22 |
| 5 | 1922-08 | 539 | Germany/Prussia: Upper Silesia, Polish part (50.26°N 19.02°E) | Poland ← Germany | 3,221 | Nazi Germany (1944) | Weimar Republic (1923) | 1945 | +22 |
| 6 | 1867-12 | 180 | Luxemburg (49.80°N 6.13°E) | Luxembourg ← Netherlands | 2,567 | Netherlands (1889) | Netherlands (1868) | 1890 | +22 |
| 7 | 1884-04 | 265 | Bolivia: Antofagasta (23.00°S 69.00°W) | Chile ← Bolivia | 50,215 | Bolivia (1904) | Bolivia (1885) | 1905 | +20 |
| 8 | 1860-01 | 139 | Nicaragua: Mosquito Coast (Nicaragua) (13.00°N 84.00°W) | Nicaragua ← United Kingdom | 21,367 | United Provinces of Central America (1839) | Republic of Nicaragua (1861) | 1840 | -20 |
| 9 | 1878-07 | 242 | Rumania (44.60°N 25.50°E) | Romania ← Turkey | 118,213 | Principality of Wallachia (1858) | United Principalities of Moldavia and Wallachia (1879) | 1859 | -19 |
| 10 | 1859-11 | 133 | Honduras: Mosquitia (Honduras) (15.20°N 84.50°W) | Honduras ← United Kingdom | 33,701 | United Provinces of Central America (1839) | Honduras (1860) | 1840 | -19 |
| 11 | 1916-11 | 460 | Qatar (25.30°N 51.20°E) | United Kingdom ← Qatar | 22,014 | Sultanate of Muscat and Oman (1935) | Sultanate of Muscat and Oman (1917) | 1936 | +19 |
| 12 | 1875-12 | 224 | Japan: Sakhalin (50.50°N 142.80°E) | Russia ← Japan | 32,348 | nothing drawn (1856) | Russian Empire (1876) | 1857 | -18 |
| 13 | 1846-06 | 96 | Canada: Oregon (44.00°N 120.50°W) | United States of America ← United Kingdom | 739,652 | nothing drawn (1863) | nothing drawn (1847) | 1864 | +17 |
| 14 | 1890 | 326 | Swaziland (26.50°S 31.40°E) | United Kingdom ← Swaziland | 17,363 | Swaziland (1907) | Swaziland (1891) | 1908 | +17 |
| 15 | 1894-09 | 346 | South Africa: Pondoland (31.30°S 29.50°E) | United Kingdom ← — | 10,464 | nothing drawn (1876) | British Africa (1895) | 1877 | -17 |
| 16 | 1911-11 | 435 | Kamerun: Neukamerun (2.00°N 16.00°E) | Germany ← France | 259,000 | nothing drawn (1894) | German Africa (1912) | 1895 | -16 |
| 17 | 1886 | 292 | Aden: Aden hinterland (14.00°N 46.50°E) | United Kingdom ← — | 160,000 | nothing drawn (1869) | British Colonial Empire (1887) | 1870 | -16 |
| 18 | 1868-12 | 196 | Lesotho (Basutoland) (29.50°S 28.20°E) | United Kingdom ← Lesotho | 21,885 | nothing drawn (1884) | nothing drawn (1869) | 1885 | +16 |
| 19 | 1920-12 | 525 | Australia (25.00°S 134.00°E) | Australia ← United Kingdom | 7,695,094 | British Colonial Empire (1904) | Commonwealth of Australia (1921) | 1905 | -15 |
| 20 | 1885 | 285 | Rwanda-Urundi (2.80°S 29.80°E) | Germany ← — | 54,222 | nothing drawn (1899) | nothing drawn (1886) | 1900 | +14 |
| 21 | 1885-01 | 282 | Rio Muni (1.60°N 10.30°E) | Spain ← — | 26,017 | nothing drawn (1899) | nothing drawn (1886) | 1900 | +14 |
| 22 | 1848-02 | 103 | Mexico: Mexican Cession (Utah) (39.50°N 111.50°W) | United States of America ← Mexico | 1,370,153 | nothing drawn (1861) | nothing drawn (1849) | 1862 | +13 |
| 23 | 1980-04 | 819 | Zimbabwe (Rhodesia) (Southern Rhodesia) (19.40°S 29.80°E) | Zimbabwe ← United Kingdom | 390,622 | British colonies in Africa (1966) | Republic of Zimbabwe (1981) | 1967 | -13 |
| 24 | 1893-11 | 338 | Afghanistan: Waziristan (32.80°N 70.00°E) | United Kingdom ← Afghanistan | 104,980 | Emirate of Afghanistan (1879) | British Raj (1894) | 1880 | -13 |
| 25 | 1969-06 | 760 | Ifni (29.30°N 10.00°W) | Morocco ← Spain | 1,505 | French Africa (1955) | Morocco (1970) | 1956 | -13 |
| 26 | 1919-05 | 494 | South West Africa (German West Africa) (Namibia) (20.50°S 16.70°E) | South Africa ← Germany | 822,907 | British Africa (1931) | British Africa (1920) | 1932 | +12 |
| 27 | 1846-06 | 97 | United States of America: New Caledonia (British Columbia) (51.00°N 122.00°W) | United Kingdom ← United States of America | 429,536 | nothing drawn (1858) | nothing drawn (1847) | 1859 | +12 |
| 28 | 1840-01 | 78 | New Zealand (39.00°S 175.50°E) | United Kingdom ← — | 268,676 | nothing drawn (1852) | nothing drawn (1841) | 1853 | +12 |
| 29 | 1885 | 290 | Union of Soviet Socialist Republics / Russia: Merv (37.60°N 61.83°E) | Russia ← — | 175,000 | Khanate of Khiva (1872) | Russian Empire (1886) | 1873 | -12 |
| 30 | 1920-12 | 496 | Canada (46.00°N 75.00°W) | Canada ← United Kingdom | 9,571,661 | British Colonial Empire (1931) | British Colonial Empire (1921) | 1932 | +11 |
| 31 | 1920-12 | 519 | South Africa (32.00°S 23.00°E) | South Africa ← United Kingdom | 1,223,409 | British Africa (1931) | British Africa (1921) | 1932 | +11 |
| 32 | 1861-08 | 152 | Lagos: Lagos (6.50°N 3.40°E) | United Kingdom ← — | 12,950 | nothing drawn (1872) | nothing drawn (1862) | 1873 | +11 |
| 33 | 1884-07 | 274 | Kamerun (4.50°N 12.00°E) | Germany ← — | 336,700 | nothing drawn (1894) | nothing drawn (1885) | 1895 | +10 |
| 34 | 1832-12 | 67 | Ecuador: Pasto (1.20°N 77.30°W) | Colombia ← Ecuador | 140,976 | New Granada (1821) | nothing drawn (1833) | 1822 (lost again) | -10 |
| 35 | 1910-06 | 429 | Zaire (Kinshasa) (Belgian Congo): Lado Enclave (4.00°N 30.80°E) | United Kingdom ← Belgium | 38,850 | Mahdist State (1899) | British Africa (1911) | 1900 | -10 |
| 36 | 1873 | 215 | Union of Soviet Socialist Republics / Russia: Amu Darya right bank (approx.) (42.60°N 59.80°E) | Russia ← — | 228,800 | Khanate of Khiva (1863) | Russian Empire (1874) | 1864 | -9 |
| 37 | 1885 | 281 | Gabon: interior Gabon (1.00°S 12.00°E) | France ← — | 200,742 | nothing drawn (1894) | nothing drawn (1886) | 1895 | +9 |
| 38 | 1888 | 310 | French West Africa: French Sudan (Kita, approx.) (13.00°N 9.00°W) | France ← — | 635,821 | nothing drawn (1879) | French Africa (1889) | 1880 | -8 |
| 39 | 1849-12 | 106 | Kashmir: Kashmir valley (34.10°N 74.80°E) | United Kingdom ← Kashmir | 259,000 | Kashmir and Jammu (1857) | Kashmir and Jammu (1850) | 1858 | +8 |
| 40 | 1924-10 | 543 | Rwanda-Urundi (2.80°S 29.80°E) | Belgium ← Germany | 54,222 | German Africa (1915) | Belgian Congo (1925) | 1916 | -8 |
| 41 | 1926-06 | 550 | Iraq (Mesopotamia): Mosul (36.30°N 43.50°E) | United Kingdom ← Turkey | 91,009 | Ottoman Empire (1918) | British Africa (1927) | 1919 | -7 |
| 42 | 1867 | 181 | Cochin China: western Cochin China (10.40°N 105.40°E) | France ← Vietnam (Annam) | 33,864 | nothing drawn (1859) | French Indochina (1868) | 1860 | -7 |
| 43 | 1954-08 | 895 | Portugal: Dadra and Nagar Haveli (20.20°N 73.00°E) | India ← Portugal | 491 | British Raj (1946) | Republic of India (1955) | 1947 | -7 |
| 44 | 1854 | 121 | Union of Soviet Socialist Republics / Russia: Kazakh steppe (approx.) (49.00°N 70.00°E) | Russia ← — | 1,820,000 | Kazakh Khanate (1847) | Russian Empire (1855) | 1848 | -6 |
| 45 | 1874-06 | 201 | Paraguay: Formosa (Chaco) (25.00°S 59.50°W) | Argentina ← Paraguay | 117,000 | Paraguay (1867) | Argentine Republic (1875) | 1868 | -6 |
| 46 | 1888-05 | 304 | Sabah (North Borneo) (5.50°N 116.50°E) | United Kingdom ← — | 76,024 | nothing drawn (1894) | nothing drawn (1889) | 1895 | +6 |
| 47 | 1898-06 | 372 | Nigeria: Borgu (9.60°N 4.00°E) | United Kingdom ← France | 71,500 | nothing drawn (1904) | nothing drawn (1899) | 1905 | +6 |
| 48 | 1907-12 | 421 | Indonesia (Dutch East Indies): Aceh (4.30°N 96.50°E) | Netherlands ← — | 53,020 | nothing drawn (1913) | nothing drawn (1908) | 1914 | +6 |
| 49 | 1888-05 | 308 | Sarawak (2.20°N 112.50°E) | United Kingdom ← — | 48,250 | Kingdom of Sarawak (1894) | Kingdom of Sarawak (1889) | 1895 | +6 |
| 50 | 1859-04 | 135 | Indonesia (Dutch East Indies): Flores (8.60°S 121.50°E) | Netherlands ← Portugal | 15,850 | nothing drawn (1865) | nothing drawn (1860) | 1866 | +6 |
| 51 | 1878-07 | 241 | Turkey: Podgorica (42.44°N 19.26°E) | Montenegro ← Turkey | 4,610 | Ottoman Empire (1884) | Ottoman Empire (1879) | 1885 | +6 |
| 52 | 1884-01 | 276 | Sudan (Anglo-Egyptian) (14.00°N 32.50°E) | Sudan ← United Kingdom | 2,658,063 | nothing drawn (1889) | nothing drawn (1885) | 1890 | +5 |
| 53 | 1899-12 | 386 | French West Africa: Zinder (approx.) (13.80°N 8.99°E) | France ← — | 2,394,466 | nothing drawn (1904) | nothing drawn (1900) | 1905 | +5 |
| 54 | 1879 | 247 | Argentina: northern Patagonia (39.00°S 67.00°W) | Argentina ← — | 669,972 | nothing drawn (1884) | nothing drawn (1880) | 1885 | +5 |
| 55 | 1884 | 275 | Ethiopia (Abyssinia): Harar (approx.) (9.30°N 42.10°E) | Ethiopia ← Egypt | 468,000 | nothing drawn (1889) | nothing drawn (1885) | 1890 | +5 |
| 56 | 1890 | 328 | Angola: Angolan interior (approx.) (11.00°S 18.50°E) | Portugal ← — | 468,000 | nothing drawn (1884) | Kingdom of Portugal (1891) | 1885 | -5 |
| 57 | 1889-01 | 320 | Ivory Coast: Ivory Coast interior (7.70°N 5.00°W) | France ← — | 322,463 | nothing drawn (1894) | nothing drawn (1890) | 1895 | +5 |
| 58 | 1905-08 | 416 | Korea (Chosen) (36.40°N 127.80°E) | Japan ← Korea | 220,891 | Korean Empire (1910) | Korean Empire (1906) | 1911 | +5 |
| 59 | 1884-12 | 269 | British Somaliland (Somaliland Republic) (9.80°N 45.00°E) | United Kingdom ← — | 192,000 | nothing drawn (1889) | nothing drawn (1885) | 1890 | +5 |
| 60 | 1889-09 | 315 | Malawi (Nyasaland) (13.30°S 34.00°E) | United Kingdom ← — | 119,311 | nothing drawn (1894) | nothing drawn (1890) | 1895 | +5 |
| 61 | 1954-03 | 657 | German Democratic Republic (51.50°N 12.00°E) | German Democratic Republic ← Russia | 107,834 | Union of Soviet Socialist Republics, Soviet zone (1948) | German Democratic Republic (1955) | 1949 | -5 |
| 62 | 1853 | 118 | Union of Soviet Socialist Republics / Russia: Ak-Mechet (Syr Darya) (44.85°N 65.50°E) | Russia ← — | 66,120 | Kazakh Khanate (1847) | Russian Empire (1854) | 1848 | -5 |
| 63 | 1884-07 | 272 | German Togoland (7.00°N 1.10°E) | Germany ← — | 41,440 | nothing drawn (1889) | nothing drawn (1885) | 1890 | +5 |
| 64 | 1913-12 | 447 | Crete (35.25°N 24.90°E) | Greece ← United Kingdom | 8,715 | Cretan State (1907) | Kingdom of Greece (1914) | 1908 | -5 |
| 65 | 1839-12 | 77 | Luxemburg: Belgian Luxembourg (49.90°N 5.50°E) | Belgium ← Netherlands | 4,408 | Netherlands (1833) | Kingdom of Belgium (1840) | 1834 | -5 |
| 66 | 1909-01 | 428 | Mauritania: Adrar (Atar) (20.50°N 13.00°W) | France ← — | 893,700 | nothing drawn (1904) | French Africa (1910) | 1905 | -4 |
| 67 | 1880-04 | 252 | Transvaal (25.50°S 28.00°E) | Transvaal ← United Kingdom | 285,363 | British Cape Colony (1884) | British Cape Colony (1881) | 1885 | +4 |
| 68 | 1885-01 | 283 | Spanish Sahara (25.00°N 13.00°W) | Spain ← — | 266,000 | nothing drawn (1889) | nothing drawn (1886) | 1890 | +4 |
| 69 | 1826 | 54 | Cape Colony: Cape northern frontier (31.00°S 22.50°E) | United Kingdom ← — | 200,000 | nothing drawn (1821) | British Cape Colony (1827) | 1822 | -4 |
| 70 | 1868-06 | 197 | Tajikistan: Samarkand (39.65°N 66.96°E) | Russia ← Tajikistan | 156,000 | Emirate of Bukhara (1863) | Russian Empire (1869) | 1864 | -4 |
| 71 | 1890 | 331 | Tanzania (Tanganyika) (German east Africa): Tabora (5.00°S 32.80°E) | Germany ← — | 130,000 | nothing drawn (1894) | nothing drawn (1891) | 1895 | +4 |
| 72 | 1863-12 | 161 | Kampuchea (Cambodia) (11.80°N 104.80°E) | France ← Cambodia | 83,861 | Kingdom of Cambodia (post-Angkor) (1867) | Kingdom of Cambodia (post-Angkor) (1864) | 1868 | +4 |
| 73 | 1919-05 | 478 | Togo (French Togoland) (8.50°N 1.15°E) | France ← Germany | 56,600 | German Africa (1914) | French Africa (1920) | 1915 | -4 |
| 74 | 1890-11 | 323 | Kenya (British East Africa Protectorate): Machakos (approx.) (1.50°S 37.30°E) | United Kingdom ← — | 48,000 | nothing drawn (1894) | nothing drawn (1891) | 1895 | +4 |
| 75 | 1909-03 | 427 | Unfederated Malay States: Kelantan (5.50°N 102.00°E) | United Kingdom ← Thailand | 38,195 | Kelantan (1904) | British Colonial Empire (1910) | 1905 | -4 |
| 76 | 1824-03 | 47 | Singapore (1.35°N 103.82°E) | United Kingdom ← — | 583 | Sultanate of Johor (1819) | British Colonial Empire (1825) | 1820 | -4 |
| 77 | 1920-01 | 501 | Tanzania (Tanganyika) (German east Africa) (6.00°S 35.00°E) | United Kingdom ← Germany | 939,361 | German Africa (1916) | British Africa (1921) | 1917 | -3 |
| 78 | 1891 | 332 | Zambia (Northern Rhodesia) (14.50°S 28.40°E) | United Kingdom ← — | 624,107 | nothing drawn (1894) | nothing drawn (1892) | 1895 | +3 |
| 79 | 1919-05 | 479 | Cameroun (French Cameroons) (4.50°N 12.00°E) | France ← Germany | 432,012 | German Africa (1915) | French Africa (1920) | 1916 | -3 |
| 80 | 1893-07 | 340 | Zimbabwe (Rhodesia) (Southern Rhodesia) (19.40°S 29.80°E) | United Kingdom ← — | 389,362 | Mthwakazi (Ndebele kingdom) (1889) | British Africa (1894) | 1890 | -3 |
| 81 | 1852-01 | 115 | Transvaal (25.50°S 28.00°E) | Transvaal ← United Kingdom | 286,065 | nothing drawn (1855) | nothing drawn (1853) | 1856 | +3 |
| 82 | 1920-04 | 500 | Iraq (Mesopotamia) (33.00°N 44.00°E) | United Kingdom ← Turkey | 280,031 | Ottoman Empire (1916) | British Colonial Empire (1921) | 1917 | -3 |
| 83 | 1830-09 | 65 | Algeria: Algiers (36.50°N 3.00°E) | France ← Turkey | 275,317 | nothing drawn (1833) | nothing drawn (1831) | 1834 | +3 |
| 84 | 1919-06 | 480 | French Equatorial Africa: Neukamerun (2.00°N 16.00°E) | France ← Germany | 259,000 | German Africa (1915) | French Africa (1920) | 1916 | -3 |
| 85 | 1920-08 | 520 | Hejaz Sultanate (21.50°N 39.90°E) | Hejaz Sultanate ← Turkey | 259,000 | Ottoman Empire (1916) | Kingdom of Hejaz (1921) | 1917 | -3 |
| 86 | 1881-05 | 257 | Tunisia (35.68°N 10.10°E) | France ← Tunisia | 116,348 | Beylik of Tunis (1884) | Beylik of Tunis (1882) | 1885 | +3 |
| 87 | 1919-05 | 475 | British Cameroons (6.00°N 10.10°E) | United Kingdom ← Germany | 80,290 | German Africa (1915) | British Gold Coast (1920) | 1916 | -3 |
| 88 | 1845 | 95 | Gabon: Libreville estuary (0.40°N 9.60°E) | France ← — | 66,914 | nothing drawn (1848) | nothing drawn (1846) | 1849 | +3 |
| 89 | 1883-10 | 262 | Peru: Tarapacá (20.00°S 69.60°W) | Chile ← Peru | 51,480 | Republic of Peru (1879) | Republic of Chile (1884) | 1880 | -3 |
| 90 | 1947-02 | 618 | Rumania: Bessarabia (47.00°N 28.86°E) | Russia ← Romania | 49,987 | Kingdom of Romania (1943) | Union of Soviet Socialist Republics (1948) | 1944 | -3 |
| 91 | 1947-02 | 618 | Rumania: northern Bukovina (48.29°N 25.94°E) | Russia ← Romania | 49,987 | Nazi Germany (1943) | Union of Soviet Socialist Republics (1948) | 1944 | -3 |
| 92 | 1947-02 | 619 | Finland: Vyborg (Karelia) (60.71°N 28.75°E) | Russia ← Finland | 44,104 | Republic of Finland (1943) | Union of Soviet Socialist Republics (1948) | 1944 | -3 |
| 93 | 1881-02 | 260 | Union of Soviet Socialist Republics / Russia: Ili (Kulja) (43.90°N 81.30°E) | China ← Russia | 42,900 | Russian Empire (1884) | Russian Empire (1882) | 1885 | +3 |
| 94 | 1867-07 | 194 | Mecklenburg Schwerin (53.75°N 12.10°E) | Germany ← Mecklenburg Schwerin | 13,442 | Duchy of Mecklenburg (1870) | Duchy of Mecklenburg (1868) | 1871 | +3 |
| 95 | 1881-07 | 258 | Turkey: Thessaly (39.60°N 22.40°E) | Greece ← Turkey | 13,364 | Ottoman Empire (1884) | Ottoman Empire (1882) | 1885 | +3 |
| 96 | 1867-07 | 190 | Saxe Weimar (50.98°N 11.33°E) | Germany ← Saxe Weimar | 9,407 | Grand Duchy of Saxe-Weimar-Eisenach (1870) | Grand Duchy of Saxe-Weimar-Eisenach (1868) | 1871 | +3 |
| 97 | 1950-12 | 649 | Sikkim (27.50°N 88.60°E) | India ← Sikkim | 7,298 | British Raj, Sikkim (1946) | Republic of India, Kingdom of Sikkim (1951) | 1947 | -3 |
| 98 | 1867-07 | 182 | Oldenburg (52.90°N 8.10°E) | Germany ← Oldenburg | 6,291 | Duchy of Oldenburg (1870) | Duchy of Oldenburg (1868) | 1871 | +3 |
| 99 | 1867-07 | 191 | Brunswick (52.27°N 10.52°E) | Germany ← Brunswick | 3,691 | Duchy of Brunswick (1870) | Duchy of Brunswick (1868) | 1871 | +3 |
| 100 | 1839 | 74 | Sikkim: Darjeeling (27.04°N 88.26°E) | United Kingdom ← Sikkim | 3,016 | nothing drawn (1835) | British Empire (1840) | 1836 | -3 |
| 101 | 1867-07 | 185 | Mecklenburg Strelitz (53.36°N 13.06°E) | Germany ← Mecklenburg Strelitz | 2,725 | Free City of Lübeck (1870) | Free City of Lübeck (1868) | 1871 | +3 |
| 102 | 1867-07 | 189 | Anhalt Dessau (51.83°N 12.25°E) | Germany ← Anhalt Dessau | 2,383 | Duchy of Anhalt (1870) | Duchy of Anhalt (1868) | 1871 | +3 |
| 103 | 1867-07 | 187 | Lippe (51.94°N 8.88°E) | Germany ← Lippe | 1,577 | Principality of Lippe (1870) | Principality of Lippe (1868) | 1871 | +3 |
| 104 | 1849-12 | 108 | Hohenzollern Hechingen (48.35°N 8.97°E) | Germany ← Hohenzollern Hechingen | 1,173 | Principality of Hohenzollern-Sigmaringen (1852) | Principality of Hohenzollern-Sigmaringen (1850) | 1853 | +3 |
| 105 | 1867-07 | 188 | Schwartzburg Sonderhausen (51.37°N 10.87°E) | Germany ← Schwartzburg Sonderhausen | 1,121 | Principality of Schwarzburg-Sonderhausen (1870) | Principality of Schwarzburg-Sonderhausen (1868) | 1871 | +3 |
| 106 | 1867-07 | 186 | Hamburg (53.55°N 10.00°E) | Germany ← Hamburg | 352 | Free City of Hamburg (1870) | Free City of Hamburg (1868) | 1871 | +3 |
| 107 | 1867-07 | 184 | Schwartzburg Rodolstadt (50.72°N 11.33°E) | Germany ← Schwartzburg Rodolstadt | 329 | Principality of Schwarzburg-Sonderhausen (1870) | Principality of Schwarzburg-Sonderhausen (1868) | 1871 | +3 |
| 108 | 1824-12 | 46 | Brazil (20.00°S 45.00°W) | Brazil ← Portugal | 8,259,504 | Portuguese Empire (1821) | Empire of Brazil (1825) | 1822 | -2 |
| 109 | 1874 | 221 | Sudan (Anglo-Egyptian): Darfur (13.50°N 25.00°E) | Egypt ← — | 2,658,063 | Sultanate of Darfur (1876) | Sultanate of Darfur (1875) | 1877 | +2 |
| 110 | 1882-09 | 261 | Egypt/United Arab Republic (29.30°N 30.90°E) | United Kingdom ← Egypt | 1,021,081 | Khedivate of Egypt (1884) | Khedivate of Egypt (1883) | 1885 | +2 |
| 111 | 1819-12 | 37 | Colombia (Gran Colombia) (4.60°N 74.10°W) | Colombia ← Spain | 660,760 | New Granada (1821) | New Granada (1820) | 1822 | +2 |
| 112 | 1879-12 | 248 | Ethiopia (Abyssinia): Harar (approx.) (9.30°N 42.10°E) | Egypt ← Ethiopia | 468,000 | nothing drawn (1876) | Khedivate of Egypt (1880) | 1877 | -2 |
| 113 | 1902-05 | 397 | Transvaal (25.50°S 28.00°E) | United Kingdom ← Transvaal | 286,065 | South African Republic (1899) | British Africa (1903) | 1900 | -2 |
| 114 | 1953-12 | 661 | Laos (19.30°N 103.30°E) | Laos ← France | 236,800 | nothing drawn (1955) | French Indochina (1954) | 1956 | +2 |
| 115 | 1819-02 | 36 | Cuba: Florida (29.50°N 82.50°W) | United States of America ← Spain | 186,488 | Spanish Empire (1821) | Spanish Empire (1820) | 1822 | +2 |
| 116 | 1953-11 | 656 | Kampuchea (Cambodia) (11.80°N 104.80°E) | Cambodia ← France | 172,511 | nothing drawn (1955) | French Indochina (1954) | 1956 | +2 |
| 117 | 1902-05 | 398 | Orange Free State (Orange River Colony) (28.50°S 26.50°E) | United Kingdom ← Orange Free State | 129,153 | Free Orange State (1899) | British Africa (1903) | 1900 | -2 |
| 118 | 1843-02 | 87 | Sind (26.00°N 68.50°E) | United Kingdom ← Sind | 126,340 | Talpur Dynasty (1845) | Talpur Dynasty (1844) | 1846 | +2 |
| 119 | 1902-05 | 393 | Cuba (22.00°N 79.00°W) | Cuba ← United States of America | 114,525 | United States of America (1904) | United States of America (1903) | 1905 | +2 |
| 120 | 1875 | 225 | Al Hasa (25.40°N 49.60°E) | Turkey ← Al Hasa | 107,120 | Emirate of Nejd (1872) | Ottoman Empire (1876) | 1873 | -2 |
| 121 | 1914 | 455 | Asir (18.20°N 42.50°E) | Asir ← Turkey | 104,338 | Ottoman Empire (1916) | Ottoman Empire (1915) | 1917 | +2 |
| 122 | 1897 | 363 | Ghana (Gold Coast): Northern Territories (9.50°N 1.00°W) | United Kingdom ← — | 98,080 | nothing drawn (1899) | nothing drawn (1898) | 1900 | +2 |
| 123 | 1892-03 | 336 | United Arab Emirates (Trucail Oman) (24.30°N 55.50°E) | United Kingdom ← United Arab Emirates | 92,100 | Trucial States (1894) | Trucial States (1893) | 1895 | +2 |
| 124 | 1870-06 | 200 | Paraguay: Apa–Branco (approx.) (21.70°S 56.50°W) | Brazil ← Paraguay | 65,000 | Paraguay (1867) | Empire of Brazil (1871) | 1868 | -2 |
| 125 | 1874-01 | 219 | Federated Malay States: Perak (4.60°N 101.00°E) | United Kingdom ← — | 29,068 | Sultanate of Perak (1876) | Sultanate of Perak (1875) | 1877 | +2 |
| 126 | 1920-03 | 498 | Israel (32.30°N 34.95°E) | United Kingdom ← Turkey | 23,310 | Ottoman Empire (1917) | British Africa (1921) | 1918 | -2 |
| 127 | 1862-06 | 158 | Cochin China: eastern Cochin China (10.90°N 106.60°E) | France ← Vietnam (Annam) | 22,380 | nothing drawn (1859) | French Indochina (1863) | 1860 | -2 |
| 128 | 1975-11 | 799 | Egypt/United Arab Republic: Abu Rudeis (Sinai) (28.90°N 33.20°E) | Egypt ← Israel | 20,000 | State of Israel (1972) | State of Israel (1976) | 1973 (lost again) | -2 |
| 129 | 1874-12 | 218 | Fiji (17.80°S 178.00°E) | United Kingdom ← Fiji | 18,272 | Kingdom of Fiji (1876) | Kingdom of Fiji (1875) | 1877 | +2 |
| 130 | 1853-12 | 117 | New Caledonia and Dependencies (21.30°S 165.50°E) | France ← — | 16,112 | nothing drawn (1855) | nothing drawn (1854) | 1856 | +2 |
| 131 | 1980-07 | 821 | Vanuatu (New Hebrides) (15.40°S 167.00°E) | Vanuatu ← France | 14,760 | New Hebrides (1982) | New Hebrides (1981) | 1983 | +2 |
| 132 | 1915 | 458 | Qatar (25.30°N 51.20°E) | Qatar ← Turkey | 11,000 | Ottoman Empire (1912) | Sultanate of Muscat and Oman (1916) | 1913 (lost again) | -2 |
| 133 | 1946-08 | 608 | Lebanon (33.90°N 35.75°E) | Lebanon ← France | 10,400 | French Mandate for Syria and Lebanon (1943) | Lebanon (1947) | 1944 | -2 |
| 134 | 1887-05 | 299 | Kenya (British East Africa Protectorate): Mombasa coast (4.00°S 39.60°E) | United Kingdom ← Zanzibar | 7,020 | Sultanate of Zanzibar (1889) | Sultanate of Zanzibar (1888) | 1890 | +2 |
| 135 | 1947-02 | 616 | Italy/Sardinia: Istria (45.24°N 13.94°E) | Yugoslavia ← Italy | 3,600 | Nazi Germany (1944) | Socialist Federal Republic of Yugoslavia (1948) | 1945 | -2 |
| 136 | 1947-10 | 613 | Saar (49.35°N 7.00°E) | France ← German Federal Republic | 2,567 | Nazi Germany (1944) | French Fourth Republic, Saar Protectorate (1948) | 1945 | -2 |

65 one-year differences not listed.

### Same rows ranked by area

| # | COW year | Territory | Gainer ← loser | km² | Error |
|---|---|---|---|---|---|
| 1 | 1920-12 | Canada | Canada ← United Kingdom | 9,571,661 | +11 |
| 2 | 1824-12 | Brazil | Brazil ← Portugal | 8,259,504 | -2 |
| 3 | 1920-12 | Australia | Australia ← United Kingdom | 7,695,094 | -15 |
| 4 | 1884-01 | Sudan (Anglo-Egyptian) | Sudan ← United Kingdom | 2,658,063 | +5 |
| 5 | 1874 | Sudan (Anglo-Egyptian): Darfur | Egypt ← — | 2,658,063 | +2 |
| 6 | 1899-12 | French West Africa: Zinder (approx.) | France ← — | 2,394,466 | +5 |
| 7 | 1854 | Union of Soviet Socialist Republics / Russia: Kazakh steppe (approx.) | Russia ← — | 1,820,000 | -6 |
| 8 | 1848-02 | Mexico: Mexican Cession (Utah) | United States of America ← Mexico | 1,370,153 | +13 |
| 9 | 1920-12 | South Africa | South Africa ← United Kingdom | 1,223,409 | +11 |
| 10 | 1882-09 | Egypt/United Arab Republic | United Kingdom ← Egypt | 1,021,081 | +2 |
| 11 | 1920-01 | Tanzania (Tanganyika) (German east Africa) | United Kingdom ← Germany | 939,361 | -3 |
| 12 | 1909-01 | Mauritania: Adrar (Atar) | France ← — | 893,700 | -4 |
| 13 | 1919-05 | South West Africa (German West Africa) (Namibia) | South Africa ← Germany | 822,907 | +12 |
| 14 | 1846-06 | Canada: Oregon | United States of America ← United Kingdom | 739,652 | +17 |
| 15 | 1879 | Argentina: northern Patagonia | Argentina ← — | 669,972 | +5 |
| 16 | 1819-12 | Colombia (Gran Colombia) | Colombia ← Spain | 660,760 | +2 |
| 17 | 1888 | French West Africa: French Sudan (Kita, approx.) | France ← — | 635,821 | -8 |
| 18 | 1891 | Zambia (Northern Rhodesia) | United Kingdom ← — | 624,107 | +3 |
| 19 | 1884 | Ethiopia (Abyssinia): Harar (approx.) | Ethiopia ← Egypt | 468,000 | +5 |
| 20 | 1890 | Angola: Angolan interior (approx.) | Portugal ← — | 468,000 | -5 |
| 21 | 1879-12 | Ethiopia (Abyssinia): Harar (approx.) | Egypt ← Ethiopia | 468,000 | -2 |
| 22 | 1919-05 | Cameroun (French Cameroons) | France ← Germany | 432,012 | -3 |
| 23 | 1846-06 | United States of America: New Caledonia (British Columbia) | United Kingdom ← United States of America | 429,536 | +12 |
| 24 | 1980-04 | Zimbabwe (Rhodesia) (Southern Rhodesia) | Zimbabwe ← United Kingdom | 390,622 | -13 |
| 25 | 1893-07 | Zimbabwe (Rhodesia) (Southern Rhodesia) | United Kingdom ← — | 389,362 | -3 |
| 26 | 1884-07 | Kamerun | Germany ← — | 336,700 | +10 |
| 27 | 1889-01 | Ivory Coast: Ivory Coast interior | France ← — | 322,463 | +5 |
| 28 | 1852-01 | Transvaal | Transvaal ← United Kingdom | 286,065 | +3 |
| 29 | 1902-05 | Transvaal | United Kingdom ← Transvaal | 286,065 | -2 |
| 30 | 1880-04 | Transvaal | Transvaal ← United Kingdom | 285,363 | +4 |

## 2. Changes the atlas never shows

Within 25 years either side the atlas never shows the gainer arriving at the point. *unchanged*: the holder is the same before and after (often the loser, still drawn: a protectorate or suzerainty COW counts as a transfer); *blank*: nothing is drawn there after; *always*: the gainer already holds the point through the whole window (the atlas shows the change earlier, or COW codes a formal cession of land already held). Largest first.

| # | COW year | No. | Territory (point) | Gainer ← loser | km² | Atlas before (year) | Atlas after (year) | Kind |
|---|---|---|---|---|---|---|---|---|
| 1 | 1816-07 | 3 | Argentina (34.60°S 58.80°W) | Argentina ← Spain | 2,093,164 | Río de la Plata (1815) | Río de la Plata (1817) | always |
| 2 | 1975-09 | 802 | Papua New Guinea (6.00°S 145.00°E) | Papua New Guinea ← Australia | 462,840 | Papua New Guinea (1974) | Papua New Guinea (1976) | always |
| 3 | 1920-12 | 497 | Newfoundland (48.50°N 56.00°W) | Newfoundland ← United Kingdom | 421,481 | British Colonial Empire (1919) | British Colonial Empire (1921) | unchanged |
| 4 | 1828-12 | 58 | West Irian (Dutch New Guinea) (4.50°S 138.00°E) | Netherlands ← — | 412,781 | nothing drawn (1827) | nothing drawn (1829) | blank |
| 5 | 1933-12 | 563 | Newfoundland (48.50°N 56.00°W) | United Kingdom ← Newfoundland | 404,519 | British Colonial Empire (1932) | British Colonial Empire (1934) | always |
| 6 | 1818 | 35 | Hejaz Sultanate (21.50°N 39.90°E) | Turkey ← — | 388,500 | Ottoman Empire (1817) | Ottoman Empire (1819) | always |
| 7 | 1920-12 | 527 | New Zealand (39.00°S 175.50°E) | New Zealand ← United Kingdom | 268,676 | British Colonial Empire (1919) | British Colonial Empire (1921) | unchanged |
| 8 | 1942-01 | 589 | Ecuador: Maynas (Oriente) (2.50°S 75.00°W) | Peru ← Ecuador | 190,807 | Republic of Peru (1941) | Republic of Peru (1943) | always |
| 9 | 1976-04 | 807 | Spanish Sahara: Saguia el-Hamra (Smara) (26.70°N 11.70°W) | Morocco ← Spain | 177,667 | Francoist Spain (1975) | nothing drawn (1977) | blank |
| 10 | 1907-04 | 419 | Colombia (Gran Colombia): Japurá–Içá (approx.) (1.50°S 68.00°W) | Brazil ← Colombia | 162,500 | Brazilian Republic (1906) | Brazilian Republic (1908) | always |
| 11 | 1825 | 53 | Tunisia (35.68°N 10.10°E) | Tunisia ← Turkey | 116,348 | Beylik of Tunis (1824) | Beylik of Tunis (1826) | always |
| 12 | 1934-12 | 565 | Peru: Putumayo–Amazon (1.50°S 72.00°W) | Colombia ← Peru | 113,882 | Republic of Colombia (1933) | Republic of Colombia (1935) | always |
| 13 | 1871 | 211 | Asir (18.20°N 42.50°E) | Turkey ← Asir | 104,338 | Ottoman Empire (1870) | Ottoman Empire (1872) | always |
| 14 | 1908-02 | 425 | Bulgaria (42.70°N 25.00°E) | Bulgaria ← Turkey | 96,345 | Principality of Bulgaria (1907) | Kingdom of Bulgaria (1909) | always |
| 15 | 1976-04 | 804 | Spanish Sahara: Tiris al-Gharbiyya (22.80°N 14.80°W) | Mauritania ← Spain | 88,667 | Francoist Spain (1975) | nothing drawn (1977) | blank |
| 16 | 1980 | 820 | Mauritania: Tiris al-Gharbiyya (22.80°N 14.80°W) | Morocco ← Mauritania | 88,667 | nothing drawn (1979) | nothing drawn (1981) | blank |
| 17 | 1924-07 | 545 | Kenya (British East Africa Protectorate): Jubaland (0.50°N 42.00°E) | Italy ← United Kingdom | 85,470 | Italian Africa (1923) | Italian Africa (1925) | always |
| 18 | 1818-10 | 30 | Canada: Red River basin south of 49°N (47.50°N 97.00°W) | United States of America ← United Kingdom | 84,240 | nothing drawn (1817) | nothing drawn (1819) | blank |
| 19 | 1973-06 | 784 | Chad: Aouzou strip (21.83°N 17.43°E) | Libya ← Chad | 78,000 | Republic of Chad (1972) | Republic of Chad (1974) | unchanged |
| 20 | 1853-12 | 116 | Mexico: Gadsden Purchase (32.00°N 111.50°W) | United States of America ← Mexico | 76,768 | Federated Republic of Mexico (1852) | Federated Republic of Mexico (1854) | unchanged |
| 21 | 1896-08 | 358 | Sierra Leone: Sierra Leone hinterland (8.80°N 11.50°W) | United Kingdom ← — | 71,939 | British Africa (1895) | British Africa (1897) | always |
| 22 | 1910-01 | 430 | Bhutan (27.40°N 90.40°E) | United Kingdom ← Bhutan | 46,600 | Kingdom of Bhutan (1909) | Kingdom of Bhutan (1911) | unchanged |
| 23 | 1949-08 | 645 | Bhutan (27.40°N 90.40°E) | Bhutan ← India | 46,600 | Kingdom of Bhutan (1948) | Kingdom of Bhutan (1950) | always |
| 24 | 1878-07 | 238 | Yugoslavia/Serbia (44.00°N 20.80°E) | Yugoslavia ← Turkey | 42,994 | Principality of Serbia (1877) | Principality of Serbia (1879) | always |
| 25 | 1866-12 | 170 | Bolivia: Atacama 24°–25°S (24.50°S 70.00°W) | Chile ← Bolivia | 42,896 | Republic of Chile (1865) | Republic of Chile (1867) | always |
| 26 | 1818-10 | 32 | United States of America: Milk River basin north of 49°N (49.50°N 110.50°W) | United Kingdom ← United States of America | 41,600 | nothing drawn (1817) | nothing drawn (1819) | blank |
| 27 | 1906-05 | 418 | Sudan (Anglo-Egyptian): Lado Enclave (4.00°N 30.80°E) | Belgium ← United Kingdom | 38,850 | British Africa (1905) | British Africa (1907) | unchanged |
| 28 | 1864-06 | 167 | Union of Soviet Socialist Republics / Russia: Circassia (44.50°N 39.80°E) | Russia ← — | 36,400 | Russian Empire, Circassia (1863) | Russian Empire (1865) | always |
| 29 | 1867 | 195 | Kampuchea (Cambodia): Battambang (13.10°N 103.20°E) | Thailand ← France | 35,641 | Rattanakosin Kingdom (1866) | Rattanakosin Kingdom (1868) | always |
| 30 | 1916 | 461 | Spanish Morocco: Cape Juby (27.90°N 11.50°W) | Spain ← France | 33,020 | Kingdom of Spain (1915) | Kingdom of Spain (1917) | always |
| 31 | 1895-03 | 353 | Manchukuo: Pamirs (37.80°N 73.50°E) | Russia ← Afghanistan | 26,000 | Russian Empire (1894) | Russian Empire (1896) | always |
| 32 | 1909 | 426 | Bolivia: Madre de Dios (approx.) (12.00°S 69.50°W) | Peru ← Bolivia | 26,000 | Republic of Peru (1908) | Republic of Peru (1910) | always |
| 33 | 1824-03 | 49 | Indonesia (Dutch East Indies): Bencoolen (3.70°S 102.40°E) | Netherlands ← United Kingdom | 25,089 | Dutch East Indies (1823) | Dutch East Indies (1825) | always |
| 34 | 1899-11 | 382 | Solomon Islands: Choiseul (7.10°S 157.20°E) | United Kingdom ← Germany | 23,310 | nothing drawn (1898) | nothing drawn (1900) | blank |
| 35 | 1960-11 | 688 | Nicaragua: Mosquitia north of the Coco (14.80°N 84.50°W) | Honduras ← Nicaragua | 20,720 | Honduras (1959) | Honduras (1961) | always |
| 36 | 1979-05 | 817 | Egypt/United Arab Republic: El Arish (Sinai) (31.10°N 33.80°E) | Egypt ← Israel | 20,000 | nothing drawn (1978) | nothing drawn (1980) | blank |
| 37 | 1849-04 | 107 | Guinea (French Guinea) (Rivieres du Sud): Boké (Guinea coast) (10.95°N 14.30°W) | France ← — | 19,500 | nothing drawn (1848) | nothing drawn (1850) | blank |
| 38 | 1859-04 | 136 | Portuguese Timor (8.80°S 125.90°E) | Portugal ← Netherlands | 18,989 | Portuguese Colonies (1858) | Portuguese Colonies (1860) | always |
| 39 | 1914-05 | 452 | Unfederated Malay States: Johor (2.00°N 103.30°E) | United Kingdom ← Unfederated Malay States | 18,985 | British Colonial Empire (1913) | British Colonial Empire (1915) | always |
| 40 | 1856-03 | 126 | Union of Soviet Socialist Republics / Russia: Kars (guess) (40.60°N 43.10°E) | Turkey ← Russia | 18,557 | Ottoman Empire (1855) | Ottoman Empire (1857) | always |
| 41 | 1884-12 | 270 | Djibouti (Afar and Issas) (French Somaliland): Tadjoura (11.60°N 42.90°E) | France ← — | 16,000 | nothing drawn (1883) | nothing drawn (1885) | blank |
| 42 | 1887-11 | 296 | Vanuatu (New Hebrides) (15.40°S 167.00°E) | United Kingdom ← — | 14,763 | nothing drawn (1886) | nothing drawn (1888) | blank |
| 43 | 1887-11 | 300 | Vanuatu (New Hebrides) (15.40°S 167.00°E) | France ← — | 14,763 | nothing drawn (1886) | nothing drawn (1888) | blank |
| 44 | 1842-08 | 83 | United States of America: northern New Brunswick (47.60°N 67.50°W) | United Kingdom ← United States of America | 12,950 | British Colonial Empire (1841) | British Colonial Empire (1843) | always |
| 45 | 1878-07 | 239 | Turkey: Niš (43.30°N 21.90°E) | Yugoslavia ← Turkey | 11,097 | Principality of Serbia (1877) | Principality of Serbia (1879) | always |
| 46 | 1889 | 318 | Gambia: Gambia valley (13.50°N 15.00°W) | United Kingdom ← — | 11,000 | French Africa (1888) | French Africa (1890) | unchanged |
| 47 | 1922-08 | 538 | Germany/Prussia: Upper Silesia, German part (50.67°N 17.93°E) | Germany ← Poland | 9,702 | Weimar Republic (1921) | Weimar Republic (1923) | always |
| 48 | 1865-11 | 169 | Bhutan: Bengal Duars (26.70°N 90.00°E) | United Kingdom ← Bhutan | 8,889 | British Raj (1864) | British Raj (1866) | always |
| 49 | 1898-11 | 377 | Crete (35.25°N 24.90°E) | United Kingdom ← Turkey | 8,614 | Ottoman Empire (1897) | Ottoman Empire, Cretan State (1899) | unchanged |
| 50 | 1829-09 | 62 | Turkey: Akhaltsikhe (41.64°N 42.98°E) | Russia ← Turkey | 8,580 | Russian Empire (1828) | Russian Empire (1830) | always |
| 51 | 1817 | 28 | Senegal: Saint-Louis (15.90°N 16.30°W) | France ← United Kingdom | 7,819 | Bourbon Kingdom of France, Waalo (1816) | Bourbon Kingdom of France, Waalo (1818) | always |
| 52 | 1890 | 327 | Sikkim (27.50°N 88.60°E) | United Kingdom ← Sikkim | 7,298 | Sikkim (1889) | British Raj, Sikkim (1891) | always |
| 53 | 1939-10 | 582 | Poland: Vilnius (54.70°N 25.30°E) | Lithuania ← Russia | 6,656 | Second Polish Republic (1938) | Union of Soviet Socialist Republics (1940) | unchanged |
| 54 | 1843-06 | 90 | Ivory Coast: Grand-Bassam (5.40°N 3.80°W) | France ← — | 6,370 | nothing drawn (1842) | nothing drawn (1844) | blank |
| 55 | 1904-02 | 411 | French Indochina: Chanthaburi (12.60°N 102.10°E) | Thailand ← France | 6,076 | Rattanakosin Kingdom (1903) | Rattanakosin Kingdom (1905) | always |
| 56 | 1862-03 | 157 | Djibouti (Afar and Issas) (French Somaliland): Obock (12.00°N 43.00°E) | France ← — | 6,000 | nothing drawn (1861) | nothing drawn (1863) | blank |
| 57 | 1878-07 | 240 | Montenegro (42.60°N 19.00°E) | Montenegro ← Turkey | 4,584 | Montenegro (1877) | Montenegro (1879) | always |
| 58 | 1885-05 | 288 | Kenya (British East Africa Protectorate): Witu (2.40°S 40.45°E) | Germany ← — | 3,120 | nothing drawn (1884) | nothing drawn (1886) | blank |
| 59 | 1920-12 | 526 | Western Samoa (13.90°S 171.80°W) | New Zealand ← Germany | 2,823 | nothing drawn (1919) | nothing drawn (1921) | blank |
| 60 | 1963-12 | 729 | Zanzibar (6.10°S 39.30°E) | Zanzibar ← United Kingdom | 2,642 | British colonies in Africa (1962) | British colonies in Africa (1964) | unchanged |

32 more under 2,500 km² (mostly islands the atlas does not draw at all): 1920-12 U. S. Pacific Trust Territories (Japan ← Germany, blank); 1829 Fernando Po (Bioko) (United Kingdom ← Spain, unchanged); 1843 Fernando Po (Bioko) (Spain ← United Kingdom, always); 1947-04 U. S. Pacific Trust Territories (United States of America ← Japan, blank); 1903-11 Panama Canal Zone (United States of America ← Panama, unchanged); 1978-04 Panama Canal Zone (Panama ← United States of America, always); 1844 French Polynesia (France ← —, blank); 1860-09 Ifni (Spain ← Morocco, unchanged); 1892 Gilbert and Ellice Is. (United Kingdom ← —, blank); 1900-12 Tonga (United Kingdom ← Tonga, blank); 1970-06 Tonga (Tonga ← United Kingdom, blank); 1862 Bahrain (United Kingdom ← Bahrain, unchanged); 1979-07 Kiribati (Kiribati ← United Kingdom, blank); 1976-06 Seychelles (Seychelles ← United Kingdom, blank); 1885 U. S. Pacific Trust Territories: Marshall Islands (Germany ← —, blank); 1976-02 Mayotte (France ← Comoros, blank); 1917-12 Virgin Islands (United States of America ← Denmark, unchanged); 1887 Maldive Islands (United Kingdom ← Maldives, blank); 1965-07 Maldive Islands (Maldives ← United Kingdom, blank); 1888-12 Cook Is. (United Kingdom ← —, blank); 1986-10 Marshall Is. (Marshall Islands ← United States of America, blank); 1888 Christmas I. (United Kingdom ← —, blank); 1958-10 Cocos (Keeling) Is. (Australia ← United Kingdom, blank); 1888-09 Easter I. (Chile ← —, blank); 1847-01 Labuan I. (United Kingdom ← Brunei, blank); 1854 Oman (United Kingdom ← Oman, unchanged); 1978-10 Tuvalu (Tuvalu ← United Kingdom, blank); 1888 Nauru (Germany ← —, blank); 1919-07 Nauru (Australia ← Germany, blank); 1955-11 Cocos (Keeling) Is. (Australia ← United Kingdom, blank); 1857 Cocos (Keeling) Is. (United Kingdom ← —, blank); 1890-07 Heligoland (Germany ← United Kingdom, blank).

## 3. Wrong gainer or loser

*wrong gainer*: after the COW date the atlas gives the point to a state other than the COW gainer (and never to the gainer within 25 years). *wrong loser*: the atlas shows the gainer arriving, but the year before it shows a state other than the COW loser. Largest first.

| # | COW year | No. | Territory (point) | Gainer ← loser | km² | Atlas before (year) | Atlas after (year) | Kind | Atlas change |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 1964-04 | 736 | Zanzibar (6.10°S 39.30°E) | Tanzania ← Zanzibar | 942,003 | British colonies in Africa (1964) | Tanzania (1965) | wrong loser | 1965 (+0) |
| 2 | 1960-07 | 706 | Somalia (3.00°N 45.00°E) | Somalia ← Italy | 461,541 | British Africa (1959) | Federal Republic of Somalia (1960) | wrong loser | 1960 (+0) |
| 3 | 1949-01 | 643 | Kashmir: Kashmir valley (34.10°N 74.80°E) | India ← Pakistan | 139,860 | Kashmir and Jammu, Jammu and Kashmir (1947) | Republic of India (1948) | wrong loser | 1948 (-1) |
| 4 | 1949-01 | 646 | Kashmir: Muzaffarabad (34.37°N 73.47°E) | Pakistan ← India | 32,024 | Kashmir and Jammu, Jammu and Kashmir (1947) | Islamic Republic of Pakistan (1948) | wrong loser | 1948 (-1) |
| 5 | 1949-01 | 646 | Kashmir: Gilgit (35.90°N 74.30°E) | Pakistan ← India | 32,024 | Kashmir and Jammu, Jammu and Kashmir (1947) | Islamic Republic of Pakistan (1948) | wrong loser | 1948 (-1) |
| 6 | 1913-08 | 442 | Bulgaria: Štip (41.75°N 22.20°E) | Yugoslavia ← Bulgaria | 27,625 | Ottoman Empire (1911) | Kingdom of Serbia (1912) | wrong loser | 1912 (-1) |
| 7 | 1860-03 | 146 | Tuscany (43.50°N 11.20°E) | Italy ← Tuscany | 22,163 | Austrian Empire (1858) | Kingdom of Sardinia (1859) | wrong loser | 1859 (-1) |
| 8 | 1893-11 | 344 | Swaziland (26.50°S 31.40°E) | Transvaal ← United Kingdom | 17,363 | Swaziland (1894) | South African Republic (1895) | wrong loser | 1895 (+1) |
| 9 | 1878-07 | 243 | Turkey: Northern Dobruja (44.70°N 28.40°E) | Romania ← Turkey | 15,372 | Russian Empire (1879) | United Principalities of Moldavia and Wallachia (1880) | wrong loser | 1880 (+1) |
| 10 | 1866-07 | 175 | Hesse Electoral (51.30°N 9.50°E) | Germany ← Hesse Electoral | 9,586 | Kingdom of Hanover (1865) | Kingdom of Prussia (1866) | wrong loser | 1866 (+0) |
| 11 | 1921-03 | 532 | Turkey: Batumi (41.60°N 41.80°E) | Russia ← Turkey | 6,975 | Georgia (1921) | Union of Soviet Socialist Republics (1922) | wrong loser | 1922 (+0) |
| 12 | 1867-07 | 183 | Bremen (53.08°N 8.80°E) | Germany ← Bremen | 192 | Kingdom of Hanover (1865) | Kingdom of Prussia (1866) | wrong loser | 1866 (-1) |

## 4. Independence dates

COW transfers with indep = 1, against the first year the atlas draws a realm linked to the new state (anywhere, as a state). *Error* = atlas year − COW year. A start year of 1815 means the atlas draws it from before 1816. Largest error first; one-year differences counted, not listed.

| # | COW year | No. | New state | From | km² | Atlas draws it as | Atlas from | Error |
|---|---|---|---|---|---|---|---|---|
| 1 | 1920-12 | 497 | Newfoundland | United Kingdom | 421,481 | — | never | — |
| 2 | 1949-08 | 645 | Bhutan | India | 46,600 | Kingdom of Bhutan | 1815 (≤1815) | -134 |
| 3 | 1878-07 | 238 | Yugoslavia | Turkey | 42,994 | Principality of Serbia, Socialist Federal Republic of Yugoslavia | 1815 (≤1815) | -63 |
| 4 | 1878-07 | 240 | Montenegro | Turkey | 4,584 | Montenegro, Prince-Bishopric of Montenegro | 1815 (≤1815) | -63 |
| 5 | 1975-09 | 802 | Papua New Guinea | Australia | 462,840 | Papua New Guinea | 1946 | -29 |
| 6 | 1908-02 | 425 | Bulgaria | Turkey | 96,345 | People's Republic of Bulgaria, Kingdom of Bulgaria | 1880 | -28 |
| 7 | 1920-12 | 527 | New Zealand | United Kingdom | 268,676 | New Zealand | 1948 | +27 |
| 8 | 1821-11 | 39 | Dominican Republic | Spain | 48,734 | Dominican Republic | 1846 | +24 |
| 9 | 1867-12 | 180 | Luxembourg | Netherlands | 2,567 | Luxembourg | 1890 | +22 |
| 10 | 1878-07 | 242 | Romania | Turkey | 118,213 | Kingdom of Romania, Socialist Republic of Romania | 1859 | -19 |
| 11 | 1920-12 | 525 | Australia | United Kingdom | 7,695,094 | Commonwealth of Australia | 1905 | -15 |
| 12 | 1980-04 | 819 | Zimbabwe | United Kingdom | 390,622 | Rhodesia, Republic of Zimbabwe | 1967 | -13 |
| 13 | 1920-12 | 496 | Canada | United Kingdom | 9,571,661 | Canada | 1932 | +11 |
| 14 | 1920-12 | 519 | South Africa | United Kingdom | 1,223,409 | South Africa | 1932 | +11 |
| 15 | 1825 | 53 | Tunisia | Turkey | 116,348 | Beylik of Tunis, Republic of Tunisia | 1815 (≤1815) | -10 |
| 16 | 1828-12 | 59 | Greece | Turkey | 39,510 | Kingdom of Greece, Third Hellenic Republic | 1822 | -6 |
| 17 | 1884-01 | 276 | Sudan | United Kingdom | 2,658,063 | Republic of Sudan, Mahdist State | 1890 | +5 |
| 18 | 1954-03 | 657 | German Democratic Republic | Russia | 107,834 | German Democratic Republic | 1949 | -5 |
| 19 | 1880-04 | 252 | Transvaal | United Kingdom | 285,363 | South African Republic | 1885 | +4 |
| 20 | 1920-08 | 520 | Hejaz Sultanate | Turkey | 259,000 | Kingdom of Hejaz | 1916 | -4 |
| 21 | 1949-12 | 647 | Indonesia | Netherlands | 1,491,562 | Republic of Indonesia | 1946 | -3 |
| 22 | 1852-01 | 115 | Transvaal | United Kingdom | 286,065 | South African Republic | 1856 | +3 |
| 23 | 1824-12 | 46 | Brazil | Portugal | 8,259,504 | Empire of Brazil, Brazilian Republic | 1822 | -2 |
| 24 | 1819-12 | 37 | Colombia | Spain | 660,760 | Republic of Colombia, Republic of New Granada | 1822 | +2 |
| 25 | 1953-12 | 661 | Laos | France | 236,800 | Kingdom of Luang Phrabang, Kingdom of Laos | 1956 | +2 |
| 26 | 1953-11 | 656 | Cambodia | France | 172,511 | Kingdom of Cambodia (post-Angkor), Kingdom of Cambodia | 1956 | +2 |
| 27 | 1902-05 | 393 | Cuba | United States of America | 114,525 | Republic of Cuba, Cuba | 1905 | +2 |
| 28 | 1914 | 455 | Asir | Turkey | 104,338 | Asir | 1917 | +2 |
| 29 | 1980-07 | 821 | Vanuatu | France | 14,760 | Vanuatu | 1983 | +2 |
| 30 | 1915 | 458 | Qatar | Turkey | 11,000 | Qatar Dynasty, State of Qatar | 1913 | -2 |
| 31 | 1946-08 | 608 | Lebanon | France | 10,400 | Lebanon | 1944 | -2 |

12 one-year differences not listed. Not tested (independent from late 1991, drawn from 1992 with Natural Earth): Georgia, Croatia, Slovenia, Moldova, Belarus, Azerbaijan, Kyrgyzstan, Uzbekistan, Estonia, Latvia, Armenia, Tajikistan, Turkmenistan, Ukraine, Kazakhstan.

## 5. Not tested

211 transfers have no point (partial transfers with no named territory, or too small to place). The largest:

| COW year | No. | Entity | Gainer ← loser | km² |
|---|---|---|---|---|
| 1903 | 405 | Morocco | France ← Morocco | 499,870 |
| 1870 | 202 | Algeria | France ← — | 400,000 |
| 1902-05 | 396 | Ethiopia (Abyssinia) | United Kingdom ← Ethiopia | 292,500 |
| 1859 | 134 | Venezuela | Brazil ← Venezuela | 156,000 |
| 1840 | 79 | Angola | Portugal ← — | 140,000 |
| 1851 | 110 | Uruguay | Brazil ← Uruguay | 104,000 |
| 1898 | 374 | Solomon Islands | United Kingdom ← — | 71,728 |
| 1904-05 | 406 | Ecuador | Brazil ← Ecuador | 67,600 |
| 1907 | 420 | Bolivia | Brazil ← Bolivia | 65,000 |
| 1907-03 | 424 | French Indochina | Thailand ← France | 35,641 |
| 1874-03 | 220 | Cochin China | France ← Vietnam (Annam) | 33,864 |
| 1902 | 394 | Argentina | Chile ← Argentina | 27,708 |
| 1955 | 664 | Libya (Tripolitania, Cyrenaica, Fezzan) | France ← Libya | 26,000 |
| 1896-08 | 357 | Ghana (Gold Coast) | United Kingdom ← — | 24,484 |
| 1897 | 362 | Ethiopia (Abyssinia) | United Kingdom ← Ethiopia | 20,720 |
| 1902 | 395 | Chile | Argentina ← Chile | 20,470 |
| 1884-02 | 266 | Transvaal | United Kingdom ← Transvaal | 19,500 |
| 1972-07 | 782 | Pakistan | Pakistan ← India | 14,609 |
| 1971-12 | 774 | Pakistan | India ← Pakistan | 13,361 |
| 1895 | 351 | Paraguay | Brazil ← Paraguay | 13,000 |
| 1898-06 | 375 | French West Africa | France ← United Kingdom | 13,000 |
| 1889 | 317 | Somalia | United Kingdom ← Zanzibar | 10,000 |
| 1892 | 337 | Somalia | Italy ← United Kingdom | 10,000 |
| 1830 | 66 | Union of Soviet Socialist Republics / Russia | Russia ← — | 9,360 |
| 1889 | 316 | Federated Malay States | United Kingdom ← Federated Malay States | 7,334 |

Transfers from 1992 to 2018 (40, e.g. the break-up of Yugoslavia and Czechoslovakia, Eritrea, Hong Kong and Macau, South Sudan, Crimea) are not tested: the atlas draws Natural Earth's present-day borders from 1992.

## Limits

- One point stands for a whole territory, so a transfer the atlas draws for most but not all of the territory may still match or miss depending on where the point falls.
- Realm → COW links are by name and written by hand (here and in `check_cshapes.py`).
- COW codes protectorates (Tunisia 1881, Korea 1905, the Malay and Gulf states), wartime conquests confirmed later, and League/UN administration as transfers; the atlas mostly draws the protected state until annexation.
- COW's own sources (Langer's *Encyclopedia of World History*, Palmer's *Historical Atlas*) date some colonial acquisitions to a single proclamation for what was a long, piecemeal conquest.
