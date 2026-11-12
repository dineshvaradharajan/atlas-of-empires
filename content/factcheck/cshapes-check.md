# Border cross-check against CShapes 2.0 (1886–1991)

Written by `tools/check_cshapes.py` on 2026-11-12. Read-only: nothing in the atlas was changed.

CShapes 2.0 (ETH Zurich, International Conflict Research) is a peer-reviewed dataset of the borders of independent states and their dependencies, with dated boundary changes, 1886–2019. It follows the Gleditsch & Ward (GW) list of states, so it leaves out microstates and counts a state only from the date GW recognise it; native states before conquest and protected states are inside their colonial owner. Some disagreements below are those conventions, not errors on either side.

> Source: Schvitz, G., L. Girardin, S. Rüegger, N. B. Weidmann, L.-E. Cederman and K. S. Gleditsch (2022). Mapping the International System, 1886–2019: The CShapes 2.0 Dataset. *Journal of Conflict Resolution* 66(1): 144–161. [doi:10.1177/00220027211013563](https://doi.org/10.1177/00220027211013563). Data [icr.ethz.ch/data/cshapes](https://icr.ethz.ch/data/cshapes/), licence [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/). This report carries only figures derived from it; the raw file is not in the repository.

## How it was compared

- Years: every year from 1886 to 1991 (106 snapshots). CShapes is read on 1 July of each year; the atlas row counts if its first year ≤ Y ≤ its last year.
- Atlas: the border chunks in `public/data/clio/` (Cliopatria with `content/borders/patches.json` applied), every correction in `content/corrections.json` and the reconstruction layers in `public/data/supplements.json`, as `tools/placeindex.py` reads them.
- Both are laid on a 0.25° grid (cell centres; a cell is about 800 km² at the equator), so states under ~2,300 km² are not measured reliably and are left out of the area tables.
- CShapes carries GW codes and names but no Wikidata ids, so each atlas realm is linked to a GW code by name (a hand-written table in the script; section 5 checks it). A colony counts for its owner, so "British Africa" agrees with CShapes's Nigeria colony; factions in a civil war count for the state they fight in.
- A territory disagreement is an area held by a different state in the two datasets, or blank in one; areas under 10,000 km² are not listed. Runs of consecutive years are merged and ranked by their largest single-year area.

## Summary

- 594 territory disagreements over 10,000 km² (runs of years): 125 gaps where CShapes has a state and the atlas draws nothing, 93 where the two give the land to different states outside wartime, 108 wartime occupations, 144 where the same land is a colony on one side and a state on the other (or a polity GW does not list), and 124 where CShapes has no state.
- 141 runs where a state's total area differs by more than 10% (and 50,000 km²).
- 58 date differences of 2 years or more between GW independence in CShapes and the years the atlas draws the state; 43 shorter offsets are counted, not listed.
- 92 atlas realms with no GW counterpart; 1 GW states the atlas never draws as a state in these years.
- 25 linked atlas realms lie mostly outside their GW state.

## 1. Largest territory disagreements

Peak = the largest single-year area of the run; typical = its median year. Where = the 10° square holding most of the disagreeing area in the peak year, with its share.

### 1a. Gaps and border disagreements (where to look for atlas errors)

*gap*: CShapes has a state, the atlas draws nothing. *border*: the two give the land to different states.

| # | Years | Peak km² (year) | Typical km² | Atlas draws | CShapes has | Where (most of it) | Kind |
|---|---|---|---|---|---|---|---|
| 1 | 1886–1991 | 6,508,000 (1886) | 273,000 | nothing drawn | Canada | 80°W–70°W, 50°N–60°N (8%) | gap |
| 2 | 1895–1903 | 4,582,000 (1900) | 4,503,000 | nothing drawn | French West Africa (colony, France) | 10°W–0°E, 20°N–30°N (22%) | gap |
| 3 | 1917–1928 | 4,031,000 (1920) | 2,130,000 | nothing drawn | China | 110°E–120°E, 40°N–50°N (20%) | gap |
| 4 | 1886–1991 | 2,751,000 (1918) | 370,000 | nothing drawn | Russia (Soviet Union) | 30°E–40°E, 50°N–60°N (25%) | gap |
| 5 | 1886–1889 | 2,430,000 (1886) | 2,430,000 | nothing drawn | Western Australia (colony, United Kingdom) | 120°E–130°E, 30°S–20°S (39%) | gap |
| 6 | 1886–1991 | 1,952,000 (1913) | 10,000 | nothing drawn | Mexico | 110°W–100°W, 20°N–30°N (44%) | gap |
| 7 | 1886–1959 | 1,820,000 (1888) | 25,000 | nothing drawn | Congo, Democratic Republic of (Zaire) (colony, Belgium) | 20°E–30°E, 10°S–0°N (43%) | gap |
| 8 | 1895–1897 | 1,601,000 (1895) | 1,601,000 | nothing drawn | Iran (Persia) | 50°E–60°E, 30°N–40°N (47%) | gap |
| 9 | 1895–1897 | 1,583,000 (1895) | 1,583,000 | Iran (Persia): Qajar Dynasty | Indonesia (colony, Netherlands) | 110°E–120°E, 10°S–0°N (24%) | border |
| 10 | 1912–1919 | 1,564,000 (1912) | 1,561,000 | Mongolia: Great Mongol State | China | 100°E–110°E, 40°N–50°N (42%) | border |
| 11 | 1921 | 1,557,000 (1921) | 1,557,000 | nothing drawn | Mongolia | 100°E–110°E, 40°N–50°N (42%) | gap |
| 12 | 1903–1904 | 1,498,000 (1903) | 1,498,000 | nothing drawn | Algeria (colony, France) | 0°E–10°E, 20°N–30°N (55%) | gap |
| 13 | 1898–1900 | 960,000 (1898) | 960,000 | nothing drawn | Congo (colony, France) | 10°E–20°E, 10°N–20°N (49%) | gap |
| 14 | 1889–1907 | 939,000 (1891) | 69,000 | nothing drawn | Kenya (protectorate, United Kingdom) | 30°E–40°E, 0°N–10°N (54%) | gap |
| 15 | 1913–1950 | 910,000 (1913) | 907,000 | China: Republic of China, Empire of China | Tibet | 90°E–100°E, 30°N–40°N (82%) | border |
| 16 | 1912–1952 | 907,000 (1912) | 13,000 | Tibet: Tibet | China | 80°E–90°E, 30°N–40°N (67%) | border |
| 17 | 1891–1916 | 901,000 (1891) | 56,000 | nothing drawn | Tanzania (Tanganyika) (colony, Germany (Prussia)) | 30°E–40°E, 10°S–0°N (88%) | gap |
| 18 | 1901–1904 | 854,000 (1901) | 854,000 | nothing drawn | Chad (occupied, France) | 10°E–20°E, 10°N–20°N (41%) | gap |
| 19 | 1921–1931 | 815,000 (1921) | 815,000 | United Kingdom: British Africa | Namibia (mandate, South Africa) | 10°E–20°E, 30°S–20°S (64%) | border |
| 20 | 1912 | 815,000 (1912) | 815,000 | Italy/Sardinia: Italian Africa, Kingdom of Italy | Turkey (Ottoman Empire) | 10°E–20°E, 20°N–30°N (58%) | border |
| 21 | 1904 | 796,000 (1904) | 796,000 | nothing drawn | Mauritania (protectorate, France) | 20°W–10°W, 10°N–20°N (34%) | gap |
| 22 | 1886–1920 | 756,000 (1900) | 28,000 | Russia (Soviet Union): Russian Empire, Russia (Civil War) | China | 120°E–130°E, 40°N–50°N (76%) | border |
| 23 | 1886–1945 | 723,000 (1886) | 105,000 | nothing drawn | Indonesia (colony, Netherlands) | 110°E–120°E, 10°S–0°N (37%) | gap |
| 24 | 1886–1991 | 684,000 (1886) | 190,000 | nothing drawn | United States of America | 110°W–100°W, 30°N–40°N (43%) | gap |
| 25 | 1926 | 561,000 (1926) | 561,000 | nothing drawn | Tibet | 90°E–100°E, 30°N–40°N (89%) | gap |
| 26 | 1891–1894 | 558,000 (1891) | 558,000 | nothing drawn | Zimbabwe (Rhodesia) (colony, United Kingdom) | 20°E–30°E, 20°S–10°S (56%) | gap |
| 27 | 1886–1904 | 462,000 (1899) | 164,000 | nothing drawn | Egypt (colony, United Kingdom) | 20°E–30°E, 20°N–30°N (77%) | gap |
| 28 | 1934–1935 | 461,000 (1934) | 461,000 | nothing drawn | Germany (Prussia) | 10°E–20°E, 50°N–60°N (46%) | gap |
| 29 | 1886–1917 | 417,000 (1886) | 16,000 | nothing drawn | Mozambique (colony, Portugal) | 30°E–40°E, 20°S–10°S (89%) | gap |
| 30 | 1950–1962 | 407,000 (1950) | 407,000 | nothing drawn | West Irian (Dutch New Guinea) (colony, Netherlands) | 130°E–140°E, 10°S–0°N (82%) | gap |
| 31 | 1946 | 371,000 (1946) | 371,000 | nothing drawn | China | 110°E–120°E, 40°N–50°N (67%) | gap |
| 32 | 1886–1904 | 354,000 (1886) | 104,000 | nothing drawn | Kamerun (colony, Germany (Prussia)) | 10°E–20°E, 0°N–10°N (92%) | gap |
| 33 | 1886–1894 | 342,000 (1886) | 324,000 | nothing drawn | Congo (colony, France) | 10°E–20°E, 10°S–0°N (58%) | gap |
| 34 | 1917 | 322,000 (1917) | 322,000 | nothing drawn | Tibet | 90°E–100°E, 30°N–40°N (71%) | gap |
| 35 | 1905 | 311,000 (1905) | 311,000 | Norway: Kingdom of Norway | Sweden | 10°E–20°E, 60°N–70°N (39%) | border |
| 36 | 1894–1915 | 304,000 (1894) | 36,000 | nothing drawn | Uganda (protectorate, United Kingdom) | 30°E–40°E, 0°N–10°N (74%) | gap |
| 37 | 1899–1904 | 294,000 (1899) | 150,000 | nothing drawn | Sudan (colony, United Kingdom) | 30°E–40°E, 0°N–10°N (58%) | gap |
| 38 | 1891–1913 | 289,000 (1891) | 230,000 | nothing drawn | Angola (colony, Portugal) | 20°E–30°E, 20°S–10°S (59%) | gap |
| 39 | 1886–1907 | 286,000 (1897) | 62,000 | nothing drawn | Ethiopia | 40°E–50°E, 0°N–10°N (66%) | gap |
| 40 | 1899 | 285,000 (1899) | 285,000 | nothing drawn | Philippines (colony, United States of America) | 120°E–130°E, 10°N–20°N (57%) | gap |
| 41 | 1976–1991 | 276,000 (1980) | 276,000 | nothing drawn | Morocco | 20°W–10°W, 20°N–30°N (91%) | gap |
| 42 | 1889 | 273,000 (1889) | 273,000 | nothing drawn | Zimbabwe (Rhodesia) (colony, United Kingdom) | 30°E–40°E, 20°S–10°S (47%) | gap |
| 43 | 1933–1972 | 266,000 (1933) | 11,000 | nothing drawn | Saudi Arabia | 40°E–50°E, 10°N–20°N (38%) | gap |
| 44 | 1889–1892 | 260,000 (1889) | 247,000 | nothing drawn | Cote D'Ivoire (protectorate, France) | 10°W–0°E, 0°N–10°N (96%) | gap |
| 45 | 1886–1899 | 255,000 (1886) | 255,000 | nothing drawn | Gabon (protectorate, France) | 10°E–20°E, 10°S–0°N (58%) | gap |
| 46 | 1893–1894 | 246,000 (1893) | 246,000 | nothing drawn | Cote D'Ivoire (colony, France) | 10°W–0°E, 0°N–10°N (94%) | gap |
| 47 | 1920–1945 | 230,000 (1920) | 230,000 | United Kingdom: British Colonial Empire | New Guinea (German New Guinea) (Kaiser Wilhelmsland) (mandate, Australia) | 140°E–150°E, 10°S–0°N (84%) | border |
| 48 | 1955 | 225,000 (1955) | 225,000 | nothing drawn | Laos | 100°E–110°E, 10°N–20°N (70%) | gap |
| 49 | 1886–1894 | 203,000 (1886) | 203,000 | nothing drawn | Algeria (colony, France) | 0°E–10°E, 30°N–40°N (95%) | gap |
| 50 | 1886–1921 | 189,000 (1898) | 189,000 | nothing drawn | Oman | 50°E–60°E, 10°N–20°N (68%) | gap |
| 51 | 1960 | 189,000 (1960) | 189,000 | Mali: Mali Federation | Senegal | 20°W–10°W, 10°N–20°N (100%) | border |
| 52 | 1958–1960 | 182,000 (1958) | 182,000 | Egypt: United Arab Republic | Syria | 30°E–40°E, 30°N–40°N (78%) | border |
| 53 | 1886–1896 | 182,000 (1886) | 182,000 | nothing drawn | Madagascar (Malagasy) | 40°E–50°E, 30°S–20°S (64%) | gap |
| 54 | 1897 | 182,000 (1897) | 182,000 | nothing drawn | Madagascar (Malagasy) (colony, France) | 40°E–50°E, 30°S–20°S (64%) | gap |
| 55 | 1955 | 182,000 (1955) | 182,000 | nothing drawn | Cambodia (Kampuchea) | 100°E–110°E, 10°N–20°N (100%) | gap |
| 56 | 1899–1904 | 174,000 (1899) | 153,000 | nothing drawn | Northern Nigeria (protectorate, United Kingdom) | 10°E–20°E, 10°N–20°N (41%) | gap |
| 57 | 1955 | 173,000 (1955) | 173,000 | nothing drawn | Vietnam, Republic of | 100°E–110°E, 10°N–20°N (89%) | gap |
| 58 | 1967–1972 | 171,000 (1967) | 171,000 | nothing drawn | Vietnam, Republic of | 100°E–110°E, 10°N–20°N (88%) | gap |
| 59 | 1886–1889 | 170,000 (1887) | 170,000 | nothing drawn | British Somaliland (Somaliland Republic) (colony, United Kingdom) | 40°E–50°E, 0°N–10°N (59%) | gap |
| 60 | 1921 | 162,000 (1921) | 162,000 | nothing drawn | Iraq (mandate, United Kingdom) | 40°E–50°E, 30°N–40°N (75%) | gap |

158 smaller runs are not listed (rerun with `--top`).

### 1b. Status, coverage and wartime differences (mostly coding conventions)

*status*: the same land is a colony or protectorate in one dataset and a state in the other (dominions, mandates, protected states, GW entry dates), or the atlas draws a polity GW does not list. *coverage*: the atlas draws a state where CShapes has none (unclaimed interiors before the partition of Africa and Arabia, Greenland, Svalbard, small islands). *wartime*: the two give the land to different states only within 1914–1923 or 1931–1952, which is almost always an occupation or a puppet state the atlas draws and CShapes does not code.

| # | Years | Peak km² (year) | Typical km² | Atlas draws | CShapes has | Where (most of it) | Kind |
|---|---|---|---|---|---|---|---|
| 1 | 1886–1931 | 9,358,000 (1911) | 5,368,000 | United Kingdom: British Colonial Empire | Canada | 120°W–110°W, 50°N–60°N (8%) | status |
| 2 | 1901–1904 | 7,638,000 (1901) | 7,638,000 | United Kingdom: British Colonial Empire | Australia | 120°E–130°E, 30°S–20°S (15%) | status |
| 3 | 1932–1945 | 2,679,000 (1944) | 2,601,000 | Japan: Empire of Japan | China | 120°E–130°E, 40°N–50°N (29%) | wartime |
| 4 | 1886–1991 | 2,445,000 (1945) | 177,000 | United States of America: United States of America | no state | 50°W–40°W, 60°N–70°N (18%) | coverage |
| 5 | 1962 | 2,308,000 (1962) | 2,308,000 | Algeria: People's Democratic Republic of Algeria | Algeria (colony, France) | 0°E–10°E, 20°N–30°N (44%) | status |
| 6 | 1890–1898 | 2,247,000 (1890) | 2,242,000 | Mahdist State (no GW counterpart) | no state | 20°E–30°E, 10°N–20°N (36%) | coverage |
| 7 | 1886–1940 | 2,222,000 (1936) | 172,000 | Denmark: Greenland, Denmark | no state | 50°W–40°W, 60°N–70°N (20%) | coverage |
| 8 | 1945–1991 | 2,222,000 (1946) | 2,222,000 | Denmark: Denmark | no state | 50°W–40°W, 60°N–70°N (20%) | coverage |
| 9 | 1899 | 2,164,000 (1899) | 2,164,000 | Mahdist State (no GW counterpart) | Sudan (colony, United Kingdom) | 20°E–30°E, 10°N–20°N (36%) | status |
| 10 | 1942–1945 | 1,780,000 (1943) | 1,766,000 | Japan: Empire of Japan | Indonesia (colony, Netherlands) | 110°E–120°E, 10°S–0°N (24%) | wartime |
| 11 | 1947 | 1,701,000 (1947) | 1,701,000 | India: Republic of India | India (colony, United Kingdom) | 80°E–90°E, 20°N–30°N (32%) | status |
| 12 | 1905–1932 | 1,655,000 (1932) | 459,000 | Saudi Arabia: Kingdom of Hejaz and Nejd, Emirate of Nejd | no state | 40°E–50°E, 20°N–30°N (61%) | coverage |
| 13 | 1946–1949 | 1,653,000 (1949) | 1,407,000 | Netherlands: Dutch East Indies | Indonesia | 110°E–120°E, 10°S–0°N (25%) | status |
| 14 | 1951 | 1,604,000 (1951) | 1,604,000 | Libya: Kingdom of Libya | Libya (mandate, United Kingdom) | 10°E–20°E, 20°N–30°N (47%) | status |
| 15 | 1943 | 1,535,000 (1943) | 1,535,000 | Italy/Sardinia: Italian Africa | Libya (occupied, United Kingdom) | 10°E–20°E, 20°N–30°N (49%) | status |
| 16 | 1946–1947 | 1,292,000 (1946) | 1,292,000 | Russia (Soviet Union): Union of Soviet Socialist Republics | China | 120°E–130°E, 40°N–50°N (56%) | wartime |
| 17 | 1960 | 1,244,000 (1960) | 1,244,000 | Mali: Mali Federation | Mali (colony, France) | 10°W–0°E, 10°N–20°N (53%) | status |
| 18 | 1910–1931 | 1,214,000 (1916) | 1,214,000 | United Kingdom: British Africa, Colony of Natal | South Africa | 20°E–30°E, 30°S–20°S (45%) | status |
| 19 | 1886–1991 | 1,188,000 (1887) | 338,000 | United Kingdom: British Colonial Empire, United Kingdom | no state | 20°E–30°E, 0°N–10°N (17%) | coverage |
| 20 | 1941 | 1,129,000 (1941) | 1,129,000 | United Kingdom: British Africa | Ethiopia | 30°E–40°E, 0°N–10°N (36%) | status |
| 21 | 1936–1940 | 1,126,000 (1940) | 1,126,000 | Italy/Sardinia: Italian Africa | Ethiopia | 30°E–40°E, 0°N–10°N (36%) | status |
| 22 | 1942–1944 | 1,076,000 (1943) | 1,028,000 | Germany (Prussia): Nazi Germany | Russia (Soviet Union) | 30°E–40°E, 50°N–60°N (35%) | wartime |
| 23 | 1961 | 880,000 (1961) | 880,000 | Tanzania (Tanganyika): Tanganyika | Tanzania (Tanganyika) (mandate, United Kingdom) | 30°E–40°E, 10°S–0°N (89%) | status |
| 24 | 1916–1920 | 815,000 (1916) | 815,000 | United Kingdom: British Africa | Namibia (occupied, South Africa) | 10°E–20°E, 30°S–20°S (64%) | wartime |
| 25 | 1886–1991 | 772,000 (1895) | 114,000 | France: French Africa, French Indochina | no state | 20°E–30°E, 0°N–10°N (43%) | coverage |
| 26 | 1975 | 762,000 (1975) | 762,000 | Portugal: Estado Novo | Mozambique | 30°E–40°E, 20°S–10°S (70%) | status |
| 27 | 1964 | 746,000 (1964) | 746,000 | United Kingdom: British colonies in Africa | Zambia | 20°E–30°E, 20°S–10°S (67%) | status |
| 28 | 1886–1991 | 720,000 (1890) | 44,000 | Portugal: Kingdom of Portugal, Estado Novo | no state | 10°E–20°E, 20°S–10°S (41%) | coverage |
| 29 | 1916–1918 | 718,000 (1916) | 718,000 | France: French Africa | Kamerun (occupied, United Kingdom) | 10°E–20°E, 0°N–10°N (92%) | wartime |
| 30 | 1915–1918 | 716,000 (1918) | 276,000 | Germany (Prussia): German Empire | Russia (Soviet Union) | 20°E–30°E, 50°N–60°N (49%) | wartime |

346 smaller runs are not listed (rerun with `--top`).

## 2. States whose total area differs

Area of everything linked to the GW code (the state with its colonies) in each dataset, in the year of the largest difference in the run.

| # | State (GW) | Years | Peak year | CShapes km² | Atlas km² | Atlas − CShapes | Typical difference |
|---|---|---|---|---|---|---|---|
| 1 | United Kingdom (200) | 1900–1931 | 1924 | 14,652,000 | 28,063,000 | +13,411,000 (+92%) | +11,120,000 |
| 2 | Canada (20) | 1886–1931 | 1886 | 9,516,000 | 0 | −9,516,000 (-100%) | −9,516,000 |
| 3 | Australia (900) | 1901–1904 | 1901 | 7,688,000 | 0 | −7,688,000 (-100%) | −7,688,000 |
| 4 | Japan (740) | 1886–1952 | 1943 | 660,000 | 7,052,000 | +6,392,000 (+968%) | +82,000 |
| 5 | France (220) | 1889–1904 | 1898 | 11,758,000 | 5,579,000 | −6,179,000 (-53%) | −4,262,000 |
| 6 | Russia (Soviet Union) (365) | 1918–1919 | 1918 | 21,849,000 | 17,764,000 | −4,085,000 (-19%) | −3,103,000 |
| 7 | China (710) | 1917–1927 | 1926 | 7,496,000 | 3,678,000 | −3,818,000 (-51%) | −2,485,000 |
| 8 | India (750) | 1947 | 1947 | 0 | 2,824,000 | +2,824,000 | +2,824,000 |
| 9 | Germany (Prussia) (255) | 1938–1944 | 1943 | 498,000 | 3,289,000 | +2,791,000 (+560%) | +1,381,000 |
| 10 | United Kingdom (200) | 1947 | 1947 | 16,532,000 | 13,853,000 | −2,679,000 (-16%) | −2,679,000 |
| 11 | China (710) | 1912 | 1912 | 11,110,000 | 8,438,000 | −2,672,000 (-24%) | −2,672,000 |
| 12 | United Kingdom (200) | 1895–1898 | 1898 | 20,606,000 | 23,164,000 | +2,558,000 (+12%) | +2,527,000 |
| 13 | Algeria (615) | 1962 | 1962 | 0 | 2,327,000 | +2,327,000 | +2,327,000 |
| 14 | France (220) | 1962 | 1962 | 3,020,000 | 707,000 | −2,313,000 (-77%) | −2,313,000 |
| 15 | United States of America (2) | 1941 | 1941 | 9,757,000 | 11,977,000 | +2,221,000 (+23%) | +2,221,000 |
| 16 | Denmark (390) | 1946–1991 | 1946 | 41,000 | 2,259,000 | +2,218,000 (+5397%) | +2,218,000 |
| 17 | United States of America (2) | 1945 | 1945 | 10,008,000 | 12,176,000 | +2,168,000 (+22%) | +2,168,000 |
| 18 | Denmark (390) | 1886–1941 | 1936 | 143,000 | 2,259,000 | +2,116,000 (+1476%) | +123,000 |
| 19 | South Africa (560) | 1910–1931 | 1916 | 2,042,000 | 0 | −2,042,000 (-100%) | −2,042,000 |
| 20 | United Kingdom (200) | 1941 | 1941 | 15,000,000 | 17,010,000 | +2,010,000 (+13%) | +2,010,000 |
| 21 | Belgium (211) | 1886–1889 | 1886 | 2,047,000 | 47,000 | −2,000,000 (-98%) | −2,000,000 |
| 22 | Mexico (70) | 1913–1919 | 1913 | 1,955,000 | 0 | −1,955,000 (-100%) | −1,955,000 |
| 23 | Netherlands (210) | 1943–1962 | 1943 | 2,070,000 | 152,000 | −1,918,000 (-93%) | −403,000 |
| 24 | Netherlands (210) | 1886–1897 | 1895 | 2,070,000 | 193,000 | −1,877,000 (-91%) | −607,000 |
| 25 | China (710) | 1938–1946 | 1945 | 7,496,000 | 5,732,000 | −1,764,000 (-24%) | −1,692,000 |
| 26 | Indonesia (850) | 1946–1949 | 1949 | 1,889,000 | 163,000 | −1,726,000 (-91%) | −1,444,000 |
| 27 | Italy/Sardinia (325) | 1943–1944 | 1943 | 300,000 | 1,999,000 | +1,699,000 (+567%) | +1,699,000 |
| 28 | Saudi Arabia (670) | 1905–1935 | 1932 | 0 | 1,659,000 | +1,659,000 | +460,000 |
| 29 | United Kingdom (200) | 1964–1981 | 1964 | 2,063,000 | 3,685,000 | +1,622,000 (+79%) | +72,000 |
| 30 | Libya (620) | 1951 | 1951 | 0 | 1,611,000 | +1,611,000 | +1,611,000 |
| 31 | Mongolia (712) | 1912–1919 | 1912 | 0 | 1,567,000 | +1,567,000 | +1,567,000 |
| 32 | Mongolia (712) | 1921 | 1921 | 1,560,000 | 0 | −1,560,000 (-100%) | −1,560,000 |
| 33 | Mali (432) | 1960 | 1960 | 0 | 1,446,000 | +1,446,000 | +1,446,000 |
| 34 | Italy/Sardinia (325) | 1936–1940 | 1940 | 2,512,000 | 3,848,000 | +1,336,000 (+53%) | +1,122,000 |
| 35 | Germany (Prussia) (255) | 1886–1894 | 1891 | 3,161,000 | 1,922,000 | −1,239,000 (-39%) | −546,000 |
| 36 | France (220) | 1960 | 1960 | 9,731,000 | 8,494,000 | −1,236,000 (-13%) | −1,236,000 |
| 37 | Ethiopia (530) | 1936–1941 | 1936 | 1,131,000 | 0 | −1,131,000 (-100%) | −1,131,000 |
| 38 | Tibet (711) | 1912–1952 | 1914 | 1,889,000 | 909,000 | −980,000 (-52%) | −901,000 |
| 39 | United Kingdom (200) | 1961 | 1961 | 4,892,000 | 3,914,000 | −978,000 (-20%) | −978,000 |
| 40 | Italy/Sardinia (325) | 1912 | 1912 | 781,000 | 1,752,000 | +971,000 (+124%) | +971,000 |

101 more runs not listed.

## 3. Independence and end dates

Years a GW state is independent in CShapes (on 1 July) but the atlas draws no realm linked to it as a state ("CShapes only"), or the reverse ("atlas only", with what CShapes has there instead). Longest first.

| # | State (GW) | CShapes independent | Atlas draws it as | Differs | Years | Which side | CShapes has there |
|---|---|---|---|---|---|---|---|
| 1 | Bhutan (760) | 1949-01-01 → 2019-12-31 | Kingdom of Bhutan | 1886–1948 | 63 | atlas only | Bhutan (protectorate, United Kingdom), India (colony, United Kingdom) |
| 2 | Canada (20) | 1886-01-01 → 2019-12-31 | Canada | 1886–1931 | 46 | CShapes only |  |
| 3 | New Zealand (920) | 1907-09-01 → 2019-12-31 | New Zealand | 1908–1947 | 40 | CShapes only |  |
| 4 | Saudi Arabia (670) | 1932-09-23 → 2000-06-11 | Kingdom of Saudi Arabia, Emirate of Nejd | 1895–1932 | 38 | atlas only | Turkey (Ottoman Empire), United Arab Emirates (protectorate, United Kingdom) |
| 5 | Afghanistan (700) | 1886-01-01 → 1888-12-30; 1919-05-01 → 2019-12-31 | Kingdom of Afghanistan, Emirate of Afghanistan | 1889–1918 | 30 | atlas only | Afghanistan (protectorate, United Kingdom), India (colony, United Kingdom) |
| 6 | Papua New Guinea (910) | 1975-09-16 → 2019-12-31 | Papua New Guinea | 1946–1975 | 30 | atlas only | Papua New Guinea (mandate, Australia), New Guinea (German New Guinea) (Kaiser Wilhelmsland) (mandate, Australia) |
| 7 | Iceland (395) | 1944-06-17 → 2019-12-31 | Republic of Iceland, Kingdom of Iceland | 1918–1939 | 22 | atlas only | Iceland (colony, Denmark) |
| 8 | South Africa (560) | 1910-05-31 → 2019-12-31 | South Africa | 1910–1931 | 22 | CShapes only |  |
| 9 | Qatar (694) | 1971-09-03 → 2019-12-31 | State of Qatar, Qatar Dynasty | 1886–1904 | 19 | atlas only | United Arab Emirates (protectorate, United Kingdom) |
| 10 | El Salvador (92) | 1886-01-01 → 2019-12-31 | Republic of El Salvador | 1979–1991 | 13 | CShapes only |  |
| 11 | Transvaal (563) | 1886-01-01 → 1910-05-29 | South African Republic | 1900–1909 | 10 | CShapes only |  |
| 12 | Orange Free State (564) | 1886-01-01 → 1910-05-29 | Free Orange State | 1900–1909 | 10 | CShapes only |  |
| 13 | Swaziland (Eswatini) (572) | 1968-09-06 → 2019-12-31 | Eswatini, Swaziland | 1886–1894 | 9 | atlas only | Transvaal |
| 14 | Bahrain (692) | 1971-08-15 → 2019-12-31 | Kingdom of Bahrain, House of Khalifa | 1886–1894 | 9 | atlas only | — |
| 15 | United Arab Emirates (696) | 1971-12-02 → 2019-12-31 | United Arab Emirates, Trucial States | 1886–1894 | 9 | atlas only | United Arab Emirates (protectorate, United Kingdom), Oman |
| 16 | Dominican Republic (42) | 1886-01-01 → 2019-12-31 | Dominican Republic | 1916–1923 | 8 | CShapes only |  |
| 17 | Austria (305) | 1918-11-03 → 2019-12-31 | Second Republic of Austria, Republic of Austria | 1938–1945 | 8 | CShapes only |  |
| 18 | Swaziland (Eswatini) (572) | 1968-09-06 → 2019-12-31 | Eswatini, Swaziland | 1900–1907 | 8 | atlas only | Swaziland (Eswatini) (colony, United Kingdom), Swaziland (Eswatini) (colony, Transvaal) |
| 19 | Morocco (600) | 1886-01-01 → 1904-01-01; 1956-03-02 → 2019-12-31 | Morocco | 1904–1911 | 8 | atlas only | Morocco (N/A, Morocco), Algeria (colony, France) |
| 20 | Mongolia (712) | 1921-03-13 → 2019-12-31 | Mongolian People's Republic, Great Mongol State | 1912–1919 | 8 | atlas only | China, Russia (Soviet Union) |
| 21 | Mexico (70) | 1886-01-01 → 2019-12-31 | Mexico | 1913–1919 | 7 | CShapes only |  |
| 22 | Japan (740) | 1886-01-01 → 2019-12-31 | Empire of Japan, Japan | 1946–1952 | 7 | CShapes only |  |
| 23 | Vietnam (Annam/Cochin China/Tonkin) (815) | 1886-01-01 → 1893-01-01 | — | 1886–1892 | 7 | CShapes only |  |
| 24 | Czechoslovakia (315) | 1918-11-11 → 1992-12-31 | Czechoslovakia | 1939–1944 | 6 | CShapes only |  |
| 25 | Ethiopia (530) | 1886-01-01 → 1993-05-23 | Ethiopian Empire, Ethiopia | 1936–1941 | 6 | CShapes only |  |
| 26 | Vietnam, Republic of (817) | 1954-05-01 → 1975-04-30 | Republic of Vietnam | 1967–1972 | 6 | CShapes only |  |
| 27 | Netherlands (210) | 1886-01-01 → 2019-12-31 | Netherlands | 1940–1944 | 5 | CShapes only |  |
| 28 | Belgium (211) | 1886-01-01 → 2019-12-31 | Kingdom of Belgium | 1940–1944 | 5 | CShapes only |  |
| 29 | Luxembourg (212) | 1886-01-01 → 2019-12-31 | Luxembourg | 1940–1944 | 5 | CShapes only |  |
| 30 | Poland (290) | 1918-11-11 → 2019-12-31 | Republic of Poland, Second Polish Republic | 1940–1944 | 5 | CShapes only |  |
| 31 | Albania (339) | 1913-01-01 → 2019-12-31 | People's Socialist Republic of Albania, Albania | 1939–1943 | 5 | CShapes only |  |
| 32 | Saudi Arabia (670) | 1932-09-23 → 2000-06-11 | Kingdom of Saudi Arabia, Emirate of Nejd | 1886–1890 | 5 | atlas only | Turkey (Ottoman Empire) |
| 33 | Luxembourg (212) | 1886-01-01 → 2019-12-31 | Luxembourg | 1886–1889 | 4 | CShapes only |  |
| 34 | Luxembourg (212) | 1886-01-01 → 2019-12-31 | Luxembourg | 1915–1918 | 4 | CShapes only |  |
| 35 | Yugoslavia (345) | 1918-12-01 → 1992-04-26 | Socialist Federal Republic of Yugoslavia, Yugoslavia | 1941–1944 | 4 | CShapes only |  |
| 36 | Greece (350) | 1886-01-01 → 2019-12-31 | Kingdom of Greece, Third Hellenic Republic | 1941–1944 | 4 | CShapes only |  |
| 37 | Denmark (390) | 1886-01-01 → 2019-12-31 | Denmark | 1941–1944 | 4 | CShapes only |  |
| 38 | Iraq (645) | 1932-10-03 → 2019-12-31 | Iraqi Republic, Kingdom of Iraq | 1943–1946 | 4 | CShapes only |  |
| 39 | Brunei (835) | 1984-01-01 → 2019-12-31 | Sultanate of Brunei | 1886–1889 | 4 | atlas only | Sarawak (protectorate, United Kingdom), Brunei (protectorate, United Kingdom) |
| 40 | Australia (900) | 1901-01-01 → 2019-12-31 | Commonwealth of Australia | 1901–1904 | 4 | CShapes only |  |
| 41 | Cuba (40) | 1902-05-20 → 2019-12-31 | Republic of Cuba, Cuba | 1902–1904 | 3 | CShapes only |  |
| 42 | Cuba (40) | 1902-05-20 → 2019-12-31 | Republic of Cuba, Cuba | 1908–1910 | 3 | CShapes only |  |
| 43 | Hungary (310) | 1918-11-03 → 2019-12-31 | Hungarian People's Republic, Kingdom of Hungary | 1944–1946 | 3 | CShapes only |  |
| 44 | Syria (652) | 1946-01-01 → 2019-12-31 | Syria, Second Syrian Republic | 1958–1960 | 3 | CShapes only |  |
| 45 | Qatar (694) | 1971-09-03 → 2019-12-31 | State of Qatar, Qatar Dynasty | 1913–1915 | 3 | atlas only | — |
| 46 | Germany (Prussia) (255) | 1886-01-01 → 1945-05-07 | German Empire, Weimar Republic | 1934–1935 | 2 | CShapes only |  |
| 47 | Hungary (310) | 1918-11-03 → 2019-12-31 | Hungarian People's Republic, Kingdom of Hungary | 1956–1957 | 2 | CShapes only |  |
| 48 | Bulgaria (355) | 1886-01-01 → 2019-12-31 | People's Republic of Bulgaria, Kingdom of Bulgaria | 1945–1946 | 2 | CShapes only |  |
| 49 | Rumania (360) | 1886-01-01 → 2019-12-31 | Kingdom of Romania, Socialist Republic of Romania | 1917–1918 | 2 | CShapes only |  |
| 50 | Rumania (360) | 1886-01-01 → 2019-12-31 | Kingdom of Romania, Socialist Republic of Romania | 1945–1946 | 2 | CShapes only |  |
| 51 | Lithuania (368) | 1918-02-16 → 1940-06-01; 1991-09-06 → 2019-12-31 | Republic of Lithuania | 1990–1991 | 2 | atlas only | Russia (Soviet Union), Poland |
| 52 | Iceland (395) | 1944-06-17 → 2019-12-31 | Republic of Iceland, Kingdom of Iceland | 1944–1945 | 2 | CShapes only |  |
| 53 | Guinea-Bissau (404) | 1974-09-10 → 2019-12-31 | Republic of Guinea-Bissau | 1973–1974 | 2 | atlas only | Guinea-Bissau (colony, Portugal), Guinea |
| 54 | Tibet (711) | 1913-01-01 → 1950-10-01 | Tibet | 1951–1952 | 2 | atlas only | China, Nepal |
| 55 | Cambodia (Kampuchea) (811) | 1953-11-09 → 2019-12-31 | Kingdom of Cambodia, People's Republic of Kampuchea | 1954–1955 | 2 | CShapes only |  |
| 56 | Laos (812) | 1954-05-01 → 2019-12-31 | Kingdom of Laos, Laos | 1954–1955 | 2 | CShapes only |  |
| 57 | Vietnam, Democratic Republic of (816) | 1954-05-01 → 2019-12-31 | Democratic Republic of Vietnam, Socialist Republic of Vietnam | 1954–1955 | 2 | CShapes only |  |
| 58 | Vietnam, Republic of (817) | 1954-05-01 → 1975-04-30 | Republic of Vietnam | 1954–1955 | 2 | CShapes only |  |

## 4. Present in one, missing in the other

### Atlas realms with no GW counterpart

Native states before conquest, protected states, breakaways and unions. CShapes puts their land inside the state or colony named on the right.

| # | Atlas realm | Wikidata | Years drawn | Peak km² | CShapes has there | Layer |
|---|---|---|---|---|---|---|
| 1 | Mahdist State | Q3125368 | 1890–1899 | 2,333,000 | no CShapes unit, Sudan (colony, United Kingdom), Egypt (colony, United Kingdom) | Cliopatria |
| 2 | Sokoto Caliphate | Q600524 | 1886–1904 | 746,000 | no CShapes unit, Northern Nigeria (protectorate, United Kingdom), Kamerun (colony, Germany (Prussia)) | Cliopatria |
| 3 | Emirate of Jabal Shammar | Q5362837 | 1886–1921 | 674,000 | no CShapes unit, Turkey (Ottoman Empire) | Cliopatria |
| 4 | Arab Federation | Q146713 | 1958 | 539,000 | Iraq, Jordan, Saudi Arabia | Cliopatria |
| 5 | Kingdom of Hejaz | Q956357 | 1916–1925 | 438,000 | no CShapes unit, Turkey (Ottoman Empire), Jordan (occupied, United Kingdom) | Cliopatria |
| 6 | Khanate of Khiva | Q491106 | 1918–1919 | 385,000 | Russia (Soviet Union), Khiva (protectorate, Russia (Soviet Union)), Bokhara (protectorate, Russia (Soviet Union)) | Cliopatria |
| 7 | Wadai Empire | Q1132786 | 1886–1910 | 279,000 | no CShapes unit, Chad (occupied, France), Congo (colony, France) | Cliopatria |
| 8 | East Turkestan Republic | Q840601 | 1945–1949 | 271,000 | China, Russia (Soviet Union), Mongolia | Cliopatria |
| 9 | Bornu Empire | Q1139762 | 1886–1894 | 229,000 | no CShapes unit, Kamerun (colony, Germany (Prussia)) | Cliopatria |
| 10 | Toucouleur Empire |  | 1886–1890 | 221,000 | no CShapes unit | supplement africa |
| 11 | Emirate of Bukhara | Q746558 | 1918–1919 | 219,000 | Bokhara (protectorate, Russia (Soviet Union)), Russia (Soviet Union), Khiva (protectorate, Russia (Soviet Union)) | Cliopatria |
| 12 | Hyderabad State | Q1240096 | 1947 | 217,000 | India (colony, United Kingdom) | Cliopatria |
| 13 | Lunda Empire |  | 1886–1887 | 207,000 | no CShapes unit, Congo, Democratic Republic of (Zaire) (colony, Belgium) | supplement africa |
| 14 | Gaza Empire |  | 1886–1895 | 193,000 | Mozambique (colony, Portugal), no CShapes unit, Zimbabwe (Rhodesia) (colony, United Kingdom) | supplement africa |
| 15 | Kashmir and Jammu | Q2571484 | 1947 | 183,000 | India (colony, United Kingdom), Tibet, Afghanistan | Cliopatria |
| 16 | Ashanti Empire | Q722071 | 1886–1897 | 153,000 | Ghana (colony, United Kingdom), no CShapes unit, Cote D'Ivoire (protectorate, France) | Cliopatria |
| 17 | Republic of Uryankhay | Q56282578 | 1912–1913 | 149,000 | China, Russia (Soviet Union) | Cliopatria |
| 18 | Kingdom of Luang Phrabang | Q190165 | 1886–1894 | 148,000 | Thailand, Vietnam (Annam/Cochin China/Tonkin), Laos (colony, France) | Cliopatria |
| 19 | Luba Empire |  | 1886–1889 | 142,000 | Congo, Democratic Republic of (Zaire) (colony, Belgium) | supplement africa |
| 20 | Sultanate of Hobyo | Q862404 | 1886–1894 | 139,000 | no CShapes unit, Italian Somaliland (colony, Italy/Sardinia) | Cliopatria |
| 21 | Lozi Kingdom (Barotseland) |  | 1886–1899 | 128,000 | Zimbabwe (Rhodesia) (colony, United Kingdom), no CShapes unit, Angola (colony, Portugal) | supplement africa |
| 22 | Kingdom of Sarawak | Q1658411 | 1886–1894, 1946 | 127,000 | Sarawak (protectorate, United Kingdom), no CShapes unit, Sarawak (colony, United Kingdom) | Cliopatria |
| 23 | Samorian State (Wassoulou Empire) |  | 1886–1898 | 127,000 | no CShapes unit, Cote D'Ivoire (colony, France), Cote D'Ivoire (protectorate, France) | supplement africa |
| 24 | Mthwakazi (Ndebele kingdom) |  | 1886–1893 | 113,000 | Zimbabwe (Rhodesia) (colony, United Kingdom), no CShapes unit, Botswana (protectorate, United Kingdom) | supplement africa |
| 25 | Imamate of Oman | Q2342282 | 1913–1919 | 105,000 | Oman, no CShapes unit | Cliopatria |
| 26 | Sultanate of Agadez |  | 1886–1899 | 101,000 | no CShapes unit, French West Africa (colony, France) | supplement africa |
| 27 | Asir | Q15728206 | 1917–1923 | 97,000 | no CShapes unit, Turkey (Ottoman Empire), Yemen (Arab Republic of Yemen) | Cliopatria |
| 28 | Independent State of Croatia | Q153128 | 1941–1944 | 95,000 | Yugoslavia | Cliopatria |
| 29 | Majeerteen Sultanate | Q2257830 | 1886–1889 | 93,000 | no CShapes unit, British Somaliland (Somaliland Republic) (colony, United Kingdom) | Cliopatria |
| 30 | Kingdom of Kongo | Q796583 | 1886–1889 | 76,000 | Angola (colony, Portugal), no CShapes unit | Cliopatria |
| 31 | Kingdom of Baguirmi |  | 1886–1897 | 74,000 | no CShapes unit | supplement africa |
| 32 | Cuban Nationalists | Q11256 | 1895–1899 | 57,000 | Cuba (colony, Spain), Cuba (occupied, United States of America), no CShapes unit | Cliopatria |
| 33 | Imamate of Futa Jallon |  | 1886–1896 | 49,000 | no CShapes unit, Guinea (colony, France) | supplement africa |
| 34 | Mahra Sultanate |  | 1886 | 49,000 | no CShapes unit | supplement me |
| 35 | Pahang Sultanate | Q30592233 | 1886–1889 | 45,000 | no CShapes unit, Pahang (colony, United Kingdom), Thailand | Cliopatria |
| 36 | Kénédougou Kingdom |  | 1886–1898 | 45,000 | no CShapes unit, French West Africa (colony, France) | supplement africa |
| 37 | Sultanate of Aceh | Q1061057 | 1886–1903 | 42,000 | Indonesia (colony, Netherlands), no CShapes unit | Cliopatria |
| 38 | Slovak Republic |  | 1939–1945 | 38,000 | Czechoslovakia, Hungary, Poland | supplement eu-east |
| 39 | Emirate of Trarza |  | 1886–1902 | 38,000 | no CShapes unit, French West Africa (colony, France) | supplement africa |
| 40 | Sultanate of Damagaram |  | 1886–1899 | 37,000 | no CShapes unit, French West Africa (colony, France), Northern Nigeria (protectorate, United Kingdom) | supplement africa |
| 41 | Buganda |  | 1886–1894 | 36,000 | no CShapes unit, Kenya (protectorate, United Kingdom), Uganda (protectorate, United Kingdom) | supplement africa |
| 42 | Kingdom of Champasak | Q403369 | 1886–1894 | 36,000 | Thailand, Laos (colony, France), Vietnam (Annam/Cochin China/Tonkin) | Cliopatria |
| 43 | Kingdom of Benin |  | 1886–1897 | 35,000 | Oil Rivers Protectorate (protectorate, United Kingdom), Lagos (colony, United Kingdom), no CShapes unit | supplement africa |
| 44 | Kingdom of Wogodogo (Mossi) |  | 1886–1896 | 32,000 | no CShapes unit, French West Africa (colony, France) | supplement africa |
| 45 | Kingdom of Kazembe |  | 1886–1894 | 31,000 | no CShapes unit, Zimbabwe (Rhodesia) (colony, United Kingdom), Congo, Democratic Republic of (Zaire) (colony, Belgium) | supplement africa |
| 46 | Sultanate of Jambi | Q1679856 | 1886–1904 | 27,000 | Indonesia (colony, Netherlands) | Cliopatria |
| 47 | Bunyoro (Bunyoro-Kitara) |  | 1886–1899 | 27,000 | no CShapes unit, Uganda (protectorate, United Kingdom), Kenya (protectorate, United Kingdom) | supplement africa |
| 48 | Kingdom of Rwanda |  | 1886–1897 | 27,000 | Tanzania (Tanganyika) (colony, Germany (Prussia)), no CShapes unit, Congo, Democratic Republic of (Zaire) (colony, Belgium) | supplement africa |
| 49 | Kingdom of Dahomey |  | 1886–1894 | 26,000 | no CShapes unit, German Togoland (colony, Germany (Prussia)) | supplement africa |
| 50 | Kingdom of Hawaï'i | Q156418 | 1886–1892 | 26,000 | no CShapes unit | Cliopatria |
| 51 | Provisional Government of Hawaii |  | 1893 | 26,000 | no CShapes unit | Cliopatria |
| 52 | Republic of Hawai'i | Q1057542 | 1894–1897 | 26,000 | no CShapes unit | Cliopatria |
| 53 | Kuba Kingdom |  | 1886–1900 | 25,000 | Congo, Democratic Republic of (Zaire) (colony, Belgium) | supplement africa |
| 54 | Zululand | Q13558877 | 1886 | 25,000 | no CShapes unit, Transvaal, Natal (colony, United Kingdom) | Cliopatria |
| 55 | Kingdom of Dagbon |  | 1886–1896 | 25,000 | no CShapes unit | supplement africa |
| 56 | Kong Empire |  | 1886–1897 | 24,000 | no CShapes unit, Cote D'Ivoire (colony, France), Cote D'Ivoire (protectorate, France) | supplement africa |
| 57 | Kingdom of Burundi |  | 1886–1899 | 23,000 | Tanzania (Tanganyika) (colony, Germany (Prussia)), no CShapes unit, Congo, Democratic Republic of (Zaire) (colony, Belgium) | supplement africa |
| 58 | Emirate of Brakna |  | 1886–1903 | 22,000 | no CShapes unit, French West Africa (colony, France) | supplement africa |
| 59 | Sultanate of Aussa |  | 1886–1895 | 22,000 | no CShapes unit, Djibouti (colony, France) | supplement africa |
| 60 | Warsangali Sultanate |  | 1886 | 20,000 | British Somaliland (Somaliland Republic) (colony, United Kingdom), no CShapes unit | supplement africa |
| 61 | Kingdom of Jolof |  | 1886–1890 | 19,000 | Senegal (colony, France) | supplement africa |
| 62 | Saloum |  | 1886–1891 | 16,000 | Senegal (colony, France) | supplement africa |
| 63 | New Hebrides | Q752431 | 1890–1982 | 16,000 | no CShapes unit | Cliopatria |
| 64 | Kasanje Kingdom |  | 1886–1911 | 15,000 | Angola (colony, Portugal), no CShapes unit | supplement africa |
| 65 | Sultanate of Terengganu | Q5769444 | 1886–1904 | 15,000 | Thailand, no CShapes unit, Federated Malay States (colony, United Kingdom) | Cliopatria |
| 66 | Yatenga |  | 1886–1895 | 12,000 | no CShapes unit, French West Africa (colony, France) | supplement africa |
| 67 | Ankole (Nkore) |  | 1886–1899 | 12,000 | Uganda (protectorate, United Kingdom), no CShapes unit, Kenya (protectorate, United Kingdom) | supplement africa |
| 68 | Dendi Kingdom |  | 1886–1898 | 11,000 | no CShapes unit, French West Africa (colony, France), Benin (colony, France) | supplement africa |
| 69 | Nieuwe Republiek | Q552157 | 1886–1889 | 10,000 | no CShapes unit, Transvaal | Cliopatria |
| 70 | Sultanate of Kedah | Q1317579 | 1886–1909 | 10,000 | Thailand, Unfederated Malay States (protectorate, United Kingdom) | Cliopatria |
| 71 | Kingdom of Kaffa |  | 1886–1897 | 10,000 | no CShapes unit, Ethiopia | supplement africa |
| 72 | Republic of the Rif | Q37102 | 1922–1925 | 8,800 | Spanish Morocco (protectorate, Spain) | Cliopatria |
| 73 | Kelantan | Q185944 | 1886–1904 | 8,500 | Thailand | Cliopatria |
| 74 | Geledi Sultanate |  | 1886–1889 | 7,700 | no CShapes unit | supplement africa |
| 75 | Mahra Sultanate (Socotra) |  | 1886 | 7,500 | no CShapes unit | supplement me |
| 76 | Kingdom of Sikkim |  | 1949–1974 | 7,500 | India, Nepal | supplement sikkim-protectorate |
| 77 | Sultanate of Bima | Q2817348 | 1886–1889 | 6,900 | Indonesia (colony, Netherlands), no CShapes unit | Cliopatria |
| 78 | Palestinians | Q201190 | 1948 | 6,600 | West Bank (occupied, Jordan), Jordan | Cliopatria |
| 79 | Karagwe |  | 1886–1890 | 6,200 | no CShapes unit | supplement africa |
| 80 | Cretan State | Q72785 | 1898–1907 | 5,100 | Turkey (Ottoman Empire) | Cliopatria |
| 81 | Turkish Republic of Northern Cyprus | Q23681 | 1976–1991 | 5,000 | no CShapes unit, Cyprus | Cliopatria |
| 82 | Negeri Sembilan | Q213893 | 1886–1894 | 3,900 | no CShapes unit, Straits Settlements (colony, United Kingdom) | Cliopatria |
| 83 | Baol |  | 1886–1894 | 3,700 | Senegal (colony, France) | supplement africa |
| 84 | Saar Protectorate |  | 1947–1956 | 3,500 | German Federal Republic, German Federal Republic (occupied, United States of America), France | supplement eu-west |
| 85 | Limmu-Ennarea |  | 1886–1891 | 3,100 | no CShapes unit | supplement africa |
| 86 | Kingdom of Sine |  | 1886–1891 | 3,000 | Senegal (colony, France), no CShapes unit | supplement africa |
| 87 | Bali | Q3125978 | 1886–1907 | 2,300 | Indonesia (colony, Netherlands) | Cliopatria |
| 88 | Free Territory of Trieste |  | 1947–1954 | 1,600 | Yugoslavia, no CShapes unit, Italy/Sardinia | supplement eu-west |
| 89 | Kedah-Perlis District | Q213467 | 1886–1910 | 1,500 | no CShapes unit | Cliopatria |
| 90 | Kingdom of Gomma |  | 1886 | 1,500 | no CShapes unit | supplement africa |
| 91 | Kingdom of Gera |  | 1886–1887 | 800 | no CShapes unit | supplement africa |
| 92 | Tangier International Zone | Q3497642 | 1912–1957 | 600 | Spanish Morocco (protectorate, Spain), Morocco, no CShapes unit | Cliopatria |

### GW states the atlas never draws as a state (1886–1991)

- Vietnam (Annam/Cochin China/Tonkin) (815): independent in CShapes 1886-01-01 → 1893-01-01

### Microstates the atlas draws that GW leaves out

Commonwealth of Dominica, Grenada, Kiribati, Micronesia, Principality of Andorra, Saint Lucia, Saint Vincent, Saint Vincent (British associated state), Samoa, Seychelles, São Tomé and Príncipe, Vanuatu.

## 5. Linked realms that lie mostly outside their GW state

Share of the realm's area (summed over the years it is drawn) that CShapes gives to the GW state it is linked to. A low share means a wrong link in the script, or a large border or status difference.

| # | Atlas realm | Linked to | Inside | Years drawn | Peak km² |
|---|---|---|---|---|---|
| 1 | Swaziland | Swaziland (Eswatini) (572) | 0% | 1886–1894, 1900–1907 | 17,000 |
| 2 | Sultanate of Zanzibar | Zanzibar (511) | 0% | 1886–1889, 1963 | 29,000 |
| 3 | Emirate of Nejd | Saudi Arabia (670) | 0% | 1886–1890, 1905–1925 | 1,052,000 |
| 4 | Trucial States | United Arab Emirates (696) | 0% | 1886–1894 | 74,000 |
| 5 | Qatar Dynasty | Qatar (694) | 0% | 1886–1904 | 15,000 |
| 6 | Greenland | Denmark (390) | 0% | 1886–1940 | 2,209,000 |
| 7 | Azerbaijan Democratic Republic | Azerbaijan (373) | 0% | 1918–1919 | 87,000 |
| 8 | Armenia | Armenia (371) | 0% | 1918–1919 | 40,000 |
| 9 | Georgia | Georgia (372) | 0% | 1918–1921 | 74,000 |
| 10 | Kingdom of Iceland | Iceland (395) | 0% | 1918–1939 | 110,000 |
| 11 | Ukrainian People's Republic | Ukraine (369) | 0% | 1919 | 524,000 |
| 12 | Kingdom of Hejaz and Nejd | Saudi Arabia (670) | 0% | 1926–1932 | 1,659,000 |
| 13 | British zone | United Kingdom (200) | 0% | 1945–1949 | 108,000 |
| 14 | Mali Federation | Mali (432) | 0% | 1960 | 1,446,000 |
| 15 | French zone | France (220) | 2% | 1945–1949 | 44,000 |
| 16 | Denmark | Denmark (390) | 6% | 1886–1940, 1945–1991 | 2,259,000 |
| 17 | Great Mongol State | Mongolia (712) | 20% | 1912–1919, 1922–1923 | 1,567,000 |
| 18 | Colony of Zululand | United Kingdom (200) | 24% | 1887–1897 | 25,000 |
| 19 | Emirate of Afghanistan | Afghanistan (700) | 25% | 1886–1925 | 643,000 |
| 20 | Nazi Germany | Germany (Prussia) (255) | 29% | 1936–1944 | 3,289,000 |
| 21 | Papua New Guinea | Papua New Guinea (910) | 33% | 1946–1991 | 480,000 |
| 22 | British Colonial Empire | United Kingdom (200) | 33% | 1886–1991 | 13,686,000 |
| 23 | Kingdom of Bhutan | Bhutan (760) | 36% | 1886–1991 | 73,000 |
| 24 | Sultanate of Brunei | Brunei (835) | 39% | 1886–1889, 1984–1991 | 12,000 |
| 25 | Empire of Japan | Japan (740) | 42% | 1886–1945 | 7,052,000 |

## Limits

- The 0.25° grid misses islands and enclaves smaller than a few cells; small states are checked only by their dates.
- CShapes follows GW coding: independence from GW's entry date, no microstates, protected states inside their protector, and no wartime occupations except where GW drops the state. These show up here as disagreements.
- Links are by name and written by hand in the script; section 5 is the check on them.
- CShapes ends at 2019 and the atlas switches to Natural Earth in 1992, so this check stops at 1991.
