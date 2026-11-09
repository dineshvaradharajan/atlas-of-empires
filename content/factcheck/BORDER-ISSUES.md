# Map data issues found by the specialist review

These are problems in the **border data**, not the written content, so they can't be fixed by editing text.
Most are in Cliopatria (state borders); a few are in historical-basemaps (the hatched peoples layer).
Details and citations: the per-region logs in this folder (`europe.md`, `east-asia.md`, `south-asia.md`, …).

Fix options: (a) a small `corrections.json` the app applies on load (relabel, clip dates, hide, add a note);
(b) report to Cliopatria (github.com/Seshat-Global-History-Databank/cliopatria). They review fixes with historians.

## Wrong label (polygon belongs to a different polity)
| Realm as labelled | Problem | Source |
|---|---|---|
| Ptolemaic Kingdom, 331–324 BCE (4.83M km²) | This is Alexander's empire; the Ptolemaic kingdom begins 305 BCE and never exceeded ~1M km² | Europe, Africa |
| Almohad Caliphate, 1260–1343 | This is the Marinid sultanate (the Marinid timeline has a gap over exactly these years); the Almohads fell 1269 | Africa |
| Mamluk Sultanate, 1241–49 | Ayyubid Egypt | Africa |
| Golden Horde after 1502 (to 1695) | The Horde ended 1502; later polygons are successor khanates | Islamic world |
| "Ngô Dynasty" 947–1406 | The Ngô ruled 939–965 only | SE Asia |
| Malacca Sultanate after 1511 (to 1861) | Malacca fell 1511; later areas are Johor's successors | SE Asia |
| Natalia Republic to 1910 | Annexed 1843 | Africa |
| "People's Republic of Zanzibar" 1856–89 | That name dates from 1964 | Africa |

## Dates of existence wrong
| Realm | Map | Should be |
|---|---|---|
| Han | to 237 | 220 |
| Sui | to 627 | 618 |
| Tang | from 623 | 618 |
| Yuan | 1294–1374 | 1271–1368 |
| Ming | from 1375 | 1368 |
| Qing | from 1645 | 1636 |
| Tibetan Empire | to 849 | 842 |
| Goguryeo | to 681 | 668 |
| Shang | to −1001 | c. −1046 |
| Huns | to 673 | 469 |
| Parthia | to 237 | 224 |
| Sasanian Empire | to 643 | 651 |
| Ilkhanate / Golden Horde / Chagatai | from 1294 | 1256 / 1240s / 1220s (1279 snapshot shows none) |
| Saadi Sultanate | to 1740 | 1659 |
| Kongo | 1440–1669 only | c. 1390–1914 |
| Vijayanagara | to 1571 | 1646 (Aravidu kings) |
| Sur Empire | to 1594 | 1556–57 |
| Maratha | gap 1691–1717 | continuous |
| British Raj | none before 1859; keeps Burma after 1937 | 1858; Burma separated 1937 |
| Bangladesh | from 1973 | 1971 |
| Khmer Empire | to 1867 | c. 1431 (later = Cambodia) |
| Srivijaya | to 1293 | debated; profile 1377 |
| Champa | to 1652 | vassal until 1832 |
| Gran Colombia | to 1833 | 1831 |
| Canada | from 1932 | 1867 |
| South Africa | from 1932 | 1910 |
| Australia | from 1905 | 1901 |
| New Zealand | from 1948 | 1840/1907 |
| Xianbei | peak extent held 161–223 | confederation splintered after Tanshihuai's death in 181 (shown as tribes 182–223) |
| Inca Empire | still drawn 1534–39 and in 1600 | conquered 1532–33 (Neo-Inca to 1572) |
| Kingdom of Hungary | ends 1546 | 1918/1946 |
| Greek City-States | to 83 CE | — |

## Extent far from scholarly estimates (Taagepera / Turchin et al. 2006)
| Realm | Map peak | Scholarly |
|---|---|---|
| Xiongnu | 5.6M km² | 9.0M |
| Huns | 1.9M | 4.0M |
| Seleucids | 3.0M | 3.9M |
| Abbasid | 8.15M | 11.1M |
| Ottoman | 4.26M (1595) | 5.2M (1683) |
| Qing | 12.5M | 14.7M |
| Han | 4.58M | 6.0–6.5M |
| Tang | 8.7M | 5.4M |
| Yuan | 14.25M | 11M |
| Mongol Empire | 27.4M | 24M |
| Kievan Rus' | 1.2M | 2.1M |
| Maratha | 1.28M | 2.5M |
| Delhi Sultanate | 1.01M in 1312 | 3.2M in 1312 (Schwartzberg agrees with map's 1330s peak) |
| Chola | 0.52M | profile 1.0M (no scholarly figure) |
| Kanem | 20k km² | far larger |
| Republic of China 1950–2023 | 81k km² | ~36k (Taiwan) |
| Hawaii "allegiance to Britain" 1811–19 | 3.6M km² | ~16.6k |
| Norte Chico | 294k | a few coastal valleys |
| Xianbei | 5.22M, north to 56.5°N | c. 4.5M; northern edge = Dingling lands south of Baikal, not Xianbei (reader report vs Commons map c. 160) |

## Missing polities
Great Zimbabwe, Mutapa, Tiwanaku, Tuʻi Tonga, Mitanni, Viceroyalty of Peru (1600), any Sri Lankan state before 1072.

## historical-basemaps (hatched layer) issues
- −1500, −1000 and −700 share one identical Near East layout: David & Solomon, Urartu, Phrygia and Saba appear centuries early;
  Assyria at −700 is 174k km² (really 0.9–1.4M).
- "Hittites" at −2000 (≈350 years early); "Ur" at −2000 after its fall; Teotihuacan before it existed; Wari to 1200; Toltecs at 1200; Dutch Brazil at 1700;
  labels "Haiti" (1715), "Kingdom of Brazil" (1880/1900), "Canada" (1815).
- Mitigation already in the app: Cliopatria states are drawn on top, so these show only as approximate hatching underneath.
