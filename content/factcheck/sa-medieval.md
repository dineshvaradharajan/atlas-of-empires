# South Asia 1000–1550: reconstruction layer (`content/supplements/sa-medieval.json`, id `sa-medieval`)

The layer adds 55 states as 87 time-bounded regions and 58 capitals. It fills gaps in the Cliopatria border data, which for this
period draws only the big empires (Chola, Western Chalukya, Ghaznavid, Delhi dynasties, Vijayanagara, Bahmani, the Deccan
sultanates from 1492, Bengal, Jaunpur, Kashmir, Samma) and leaves most of Rajputana, Gujarat, Malwa, Odisha, Andhra, Kerala,
Assam and Sri Lanka empty or wrongly covered. `replaces` is empty: no Cliopatria realm is hidden. Where Cliopatria covers the
same ground with a large polygon (for example "Tughlaq Dynasty" over Gujarat, or "Vijayanagara Empire" over the Tamil country
in 1344–51), the reconstruction is drawn on top of it.

Checks:
- All rings are closed and have no self-intersections.
- A 0.02° grid test found no overlaps between regions active in the same years.
- The coastline clip handles the sea side, so seaward edges run offshore on purpose.

## States drawn

| State (key) | Slices |
|---|---|
| Madurai Sultanate | 1335–1370, 1371–1378 |
| Sambuvarayas (Tondaimandalam) | 1337–1362 |
| Vijayanagara Empire (before the border data starts) | 1336–1343 |
| Bahmani Sultanate (before the border data starts) | 1347–1351 |
| Reddi kingdom | 1325–1363, 1364–1423, 1424–1447 (Rajahmundry branch) |
| Musunuri Nayakas | 1336–1367 |
| Recherla Nayakas | 1368–1432 |
| Eastern Ganga Kingdom (after the border data stops) | 1352–1434 |
| Gajapati Empire, then Bhoi dynasty (same key) | 1435–1448, 1449–1463, 1464–1470 (peak), 1471–1484, 1485–1512, 1513–1540, 1541–1550 |
| Somavamshi dynasty | 1000–1110 |
| Kalachuris of Tripuri | 1000–1211 |
| Kalachuris of Ratnapura / Haihayas of Ratanpur | 1090–1225, 1226–1550 |
| Garha kingdom | 1440–1490, 1491–1550 |
| Khandesh Sultanate | 1382–1550 |
| Tomaras of Gwalior | 1394–1518 |
| Malwa Sultanate | 1401–1435, 1436–1518, 1519–1530 |
| Paramara Dynasty (after the border data stops) | 1236–1305 |
| Gujarat Sultanate | 1407–1471, 1472–1483, 1484–1530, 1531–1535 (with Malwa), 1536–1550 |
| Vaghela dynasty | 1244–1304 |
| Chudasama dynasty (Sorath) | 1000–1471 |
| Champaner (Khichi Chauhans) | 1305–1483 |
| Kutch (Samma-Jadeja chiefs) | 1147–1550 |
| Kingdom of Mewar | 1000–1302 (Guhilas), 1326–1432, 1433–1508, 1509–1527 (Rana Sanga), 1528–1550 |
| Kingdom of Marwar | 1395–1437, 1453–1531, 1532–1543 (Maldeo), 1545–1550 |
| Bikaner | 1465–1550 |
| Jaisalmer | 1156–1550 |
| Chahamanas of Jalor | 1160–1311 |
| Chahamanas of Ranthambore | 1192–1301 |
| Emirate of Multan | 1000–1009 |
| Soomra dynasty | 1026–1343 |
| Qabacha's sultanate (Multan and Uch) | 1206–1228 |
| Langah Sultanate | 1445–1527 |
| Arghun dynasty (Sindh) | 1521–1550 |
| Khasa Malla kingdom | 1100–1389 |
| Guge | 1000–1550 |
| Maryul (Ladakh) | 1000–1550 |
| Karnats of Mithila | 1097–1324 |
| Sonargaon Sultanate | 1338–1351 |
| Lakhnauti under Ilyas Shah (key "Sultanate of Bengal") | 1339–1351 |
| Kamata kingdom | 1257–1497 |
| Koch kingdom | 1515–1550 |
| Ahom kingdom | 1228–1396, 1397–1523, 1524–1535, 1536–1550 |
| Chutia kingdom | 1300–1523 |
| Dimasa (Kachari) kingdom | 1250–1535, 1536–1550 |
| Twipra (Tripura) | 1400–1489, 1490–1550 |
| Manipur | 1110–1550 |
| Chera Perumals | 1000–1123 |
| Venad | 1124–1550 |
| Kolathunadu | 1124–1550 |
| Calicut (Zamorin) | 1300–1550 |
| Cochin | 1124–1550 |
| Gampola | 1341–1411 |
| Kotte | 1412–1449, 1450–1467 (whole island), 1468–1520, 1521–1550 |
| Kandy | 1469–1550 |
| Sitawaka | 1521–1550 |

Keys that match a Cliopatria realm name continue that realm's timeline in the app: "Vijayanagara Empire", "Bahmani Sultanate",
"Eastern Ganga Kingdom", "Paramara Dynasty" and "Sultanate of Bengal".

## Maps traced and how

- **C. Joppen, *Historical Atlas of India* (1914; archive.org `historicalatlaso00jopprich`).** Maps 10–14: India in 1022, 1236,
  1318, 1398 and 1525. Each map is split over two scanned leaves and printed sideways. I rotated and viewed the leaves at full
  resolution and read positions against the printed 5° graticule (a conic projection, so I read locally along the curved
  parallels). Joppen is coarse. It was used for:
  - Gujarat, Malwa (Ujjain, Mandu, Chanderi, Bhilsa, Raisen) and Khandesh (Thalner) in 1398 and 1525;
  - Kutch and western Kathiawar as independent in 1318 and 1398;
  - the "Multan" strip in 1525;
  - Gondwana and Chhattisgarh.
  The accompanying text (pp. 14–21) supplied several dates.
- **Schwartzberg, *A Historical Atlas of South Asia* (DSAL scans).** Used for checking only, not traced:
  - plate V.2 (Khaljis and Tughluqs, c. 1290–1390): Ma'bar 1334–1378, the Mallas, the Karnats and the Sambuvarayas;
  - plates V.3 and V.4 (1390–1450, Lodis 1451–1526);
  - plate XIV.3 "Major powers 10th–15th centuries": the Eastern Ganga maximum, the Paramara core and the Bahmani extent.
- **Everything else** was placed from the geography that the cited sources give: rivers, passes, hill ranges and named towns
  (for example "between the Chandragiri and Korapuzha", "Lakhimpur, Dhemaji, Tinsukia", "between the Krishna and the
  Gundlakamma"). Every polygon was rendered over the basemap and the Cliopatria outlines, year by year (1100, 1250, 1340, 1350,
  1375, 1420, 1450, 1466, 1500, 1525, 1533, 1545), and the shapes were adjusted until they matched the sources and did not
  collide with each other.

Dates, capitals and rulers come from the English Wikipedia articles listed in `sources`, all fetched for this work (mostly
infobox and lead statements). Joppen and Schwartzberg were used for cross-checks.

## Skipped, and why

- **Already drawn by Cliopatria:**
  - Chola dynasty (= "Chola Empire"); Shah Mir dynasty (= "Kashmiri Sultanate"); Bengal Sultanate from 1352; Jaunpur;
    Samma; Bahmani from 1352.
  - Bijapur, Golconda, Ahmadnagar, Berar and Bidar (all drawn from 1492/1519; "Deccan sultanates" is the group of these).
  - Western Chalukyas, Chandelas (to 1313), Chaulukyas (to 1249), Gahadavalas, Chahamanas of Shakambhari, Hoysalas, Kakatiyas,
    Seuna Yadavas (from 1188), Pandyas, Polonnaruwa, Dambadeniya, Jaffna, Kathmandu Mallas.
- **Vassals or usurpers within a drawn state:**
  - Seuna Yadavas before 1188, Kakatiyas before 1163 and Hoysalas before 1111 were feudatories.
  - The Kalachuris of Kalyani (1156–81) held the Western Chalukya throne inside the drawn Chalukya realm.
  - The Eastern Chalukyas of Vengi were Chola subordinates after 1000.
  - Kherla and the Chanda Gonds were tributaries.
  - The Oiniwar dynasty (Mithila, 1325–1526) was tributary to Delhi and Jaunpur.
  - The later Pandya princes of Tenkasi were Vijayanagara vassals.
  - Kingdom of Mysore (1399) and Keladi (1499) were Vijayanagara vassals.
- **Too small or too poorly bounded to draw well:** Amber (Kachhwahas, long tributary), the Alupas of Tulunadu, Idar, Sirohi,
  Dungarpur and Banswara, Vagad, Raigama (1521–38, folded into Sitawaka), the Vanni chiefs, Kangra, the Katyuri and Chand
  rulers of Kumaon, and Garhwal (unified only c. 1500; no source with dates was fetched).
- **Hindu Shahi (to 1026):** inside the Ghaznavid polygon for 1000–1014; no reliable frontier.
- **Chola 1260–1279 and Hoysala tail:** covered well enough by the Pandya and Hoysala polygons.
- **Modern states and colonial entities in the audit list:** another period's work.
- **Princely states:** Bikaner, Jaisalmer, Kutch, Manipur, Cochin, Mewar and Marwar continue past 1550. This layer stops at
  1550; the 1550–1857 periods belong to other researchers.

## Main uncertainties

1. **Frontiers.** No medieval source describes them. Every line is approximate, typically to ±0.3–0.5°. Cores (capital
   districts, river basins) are secure; frontiers between neighbours are not.
2. **Madurai Sultanate.** The southern limit (Tirunelveli, where Pandya princes survived) and the hold on the Thanjavur delta
   are uncertain. The 1371 shrink assumes Srirangam was lost when the Ranganatha image was reinstalled (1371). The fall date
   of 1378 is Wikipedia's; Schwartzberg agrees.
3. **Gajapati extents.**
   - The 1464–70 "peak" to the Kaveri was a short military occupation of the coastal belt.
   - Joppen's 1525 map gives the whole Andhra coast up to Odisha to Golconda. I followed the mainstream reading instead: the
     1519 treaty left the Gajapatis the land north of the Krishna, and Golconda's gains came later. The layer shows the
     Godavari delta as Gajapati.
4. **Start dates of the north-east states.**
   - Chutia: "early 13th century" per Wikipedia, prominent from the 14th; I used 1300.
   - Dimasa: unknown; I used 1250.
   - Tripura: c. 1400.
   - Manipur: 1110, per the infobox.
5. **Recherla, Reddi and Musunuri years.** Regnal years are approximate ("c.").
6. **Sambuvaraya end.** I used c. 1362 (Kampana's conquest). The Wikipedia infobox runs to 1375.
7. **Soomra end.** I used 1343, so the layer stops where the Samma polygon begins; Wikipedia says 1351.
8. **Kalachuris of Ratnapura after Pratapamalla.** I drew them as continuing Haihayas of Ratanpur to 1550, but the
   13th–14th-century record is thin.
9. **Guge and the Khasa Mallas.** The Khasa kings held sway in Guge-Purang in the 12th–14th centuries. Guge is still drawn
   for the whole span, with a note.
10. **Rulers lists.** Rulers with weakly attested dates are marked "c." or "traditional". Dimasa, Champaner, Jaisalmer,
    Venad, Calicut, Kolathunadu, Cochin and Sitawaka list only one or two names (titles for the Malabar kings), because the
    fetched sources give no secure list.
