# Western and central Europe: reconstruction layer (`content/supplements/eu-west.json`, id `eu-west`)

Scope: the "Europe" section of `coverage-gaps.md`, entries whose Wikidata point lies west of 15°E (Iberia, France, the Low
Countries, the British Isles, the German lands, Switzerland, Italy, the western Alps). Europe east of 15°E is another layer.

The layer adds 61 states (58 audit gaps plus continuations of the same state: county/duchy of Württemberg, Signoria/Duchy of Milan,
united Baden) as 103 time-bounded regions and 57 capitals. `replaces` is empty: no Cliopatria realm is hidden. Where Cliopatria covers
the ground with a generic or wrong polygon ("Holy Roman Empire Minor States", "Brythons", "Viking settlements", the Papal States over
Ferrara and Urbino, Grand Duchy of Tuscany over Lucca, Yugoslavia over Trieste, "United States"/"USSR" over occupied Germany), the
reconstruction is drawn on top.

Checks (scratch scripts, not committed):
- All rings closed, no self-intersections.
- A 0.02° grid test found no overlaps between any two regions active in the same years. Neighbours that coexist (the Irish kingdoms;
  Liège, Namur, Brabant, Limburg, Guelders, Utrecht, Cleves, Jülich; Palatinate, Mainz, Hesse; the Welf principalities; Ansbach,
  Bayreuth, Nuremberg, the Upper Palatinate; Württemberg and the two Badens; Milan, Mantua and the Este state; the four occupation
  zones and the Saar) share border vertices.
- Seaward edges run offshore on purpose (the app clips reconstructions to land).
- Rendered year by year over modern borders, rivers and the Cliopatria outlines, and compared with the Shepherd plates below.

## Method and sources
Geometry: William R. Shepherd, *Historical Atlas* (1923 ed., public domain; UT Perry-Castañeda Library scans), plates for the British
Isles c. 802 and c. 1300, Britain c. 600, Spain 910–1492, Central Europe 919–1125, 1378, 1477, 1547, 1648 and 1786, Wettin lands
1221–1485, Italy c. 1050 and 1494, the Netherlands 1559–1608. Shepherd's plates were read against their printed graticule and the
outlines traced by eye at about 0.05–0.1° detail onto known towns and rivers (Meuse, Rhine, Shannon, Po, Neckar, Elbe); they were not
digitised pixel by pixel, so every border is a simplified reconstruction. Several Irish, Welsh, Pictish and early medieval regions
(Meath, Osraige, Breifne, Fortriu, Dyfed, Ceredigion, Elmet, Gaeta) are not shown as states on Shepherd and follow the extents
described in the cited Wikipedia articles (dioceses, counties, rivers). The 1945–1956 regions follow the post-war Land and zone
boundaries.

Dates, rulers and capitals: English Wikipedia articles for each state (listed in the layer's `sources`), using their cited statements;
intros fetched for every state. Where Wikidata's start date is legendary or refers to an earlier entity, the drawn start is later and
the region note says so.

## States drawn

| State (key) | Slices |
|---|---|
| Kingdom of Meath | 800–1172 |
| Kingdom of Osraige | 800–1169 |
| Kingdom of Breifne | 1000–1256 |
| Kingdom of Thomond | 1118–1194, 1195–1543 |
| Kingdom of Desmond | 1118–1176, 1177–1596 (MacCarthy Mór) |
| Tyrconnell | 1200–1607 |
| Fortriu | 430–684 (northern Picts), 685–848 (Pictland) |
| Kingdom of Dyfed | 410–919 |
| Kingdom of Ceredigion | 500–730 |
| Deheubarth | 920–1093, 1155–1197 |
| Elmet | 500–617 |
| Taifa of Málaga | 1026–1057 |
| Taifa of Majorca | 1076–1115, 1147–1203 (Banu Ghaniya); Mallorca, Menorca, Ibiza |
| Taifa of Menorca | 1228–1287 |
| Prince-Bishopric of Liège | 985–1365, 1366–1795 (with Loon); plus Thuin–Couvin piece |
| Duchy of Brabant | 1183–1259 |
| Duchy of Guelders | 1138–1543 (with the Upper Quarter) |
| Prince-Bishopric of Utrecht | 1024–1528 (Nedersticht, Oversticht) |
| County of Namur | 981–1421 |
| Duchy of Limburg | 1065–1288 |
| County of Luxembourg | 963–1259 |
| Duchy of Cleves | 1092–1520 |
| Duchy of Jülich | 1100–1520 |
| United Duchies of Jülich-Cleves-Berg | 1521–1609 (four pieces) |
| Duchy of Bar | 1033–1430 |
| County of Provence | 972–1245 |
| Electoral Palatinate | 1214–1328, 1329–1622 (with Upper Palatinate), 1623–1797 |
| Electorate of Mainz | 1200–1797 (four pieces) |
| Landgraviate of Hesse | 1264–1478, 1479–1567 (with Katzenelnbogen) |
| Duchy of Brunswick-Lüneburg | 1235–1268 |
| Principality of Lüneburg | 1269–1705 |
| Principality of Brunswick-Wolfenbüttel | 1269–1806 |
| Principality of Calenberg | 1495–1708 (with Göttingen) |
| Duchy of Saxe-Lauenburg | 1296–1689 |
| County of Oldenburg | 1180–1667 |
| Württemberg | 1083–1300, 1301–1494 (county), 1495–1802 (duchy) |
| Margraviate of Baden-Durlach | 1535–1771 |
| Margraviate of Baden-Baden | 1535–1771 |
| Margraviate of Baden | 1772–1802 |
| Principality of Ansbach | 1486–1791 |
| Principality of Bayreuth | 1486–1791 |
| Free Imperial City of Nuremberg | 1505–1796 |
| Prince-Archbishopric of Salzburg | 1328–1802 |
| Margraviate of Meissen | 1089–1422 |
| Duchy of Saxe-Wittenberg | 1296–1422 |
| Duchy of Pomerania | 1181–1324, 1325–1637 (runs east of 15°E) |
| Allied-occupied Germany | 1945–1949 (American, British, Soviet zones; French zone 1945–1946 with the Saar, 1947–1949 without) |
| Saar Protectorate | 1947–1956 |
| Milan (Signoria, then Duchy) | 1259–1329, 1330–1386, 1387–1394, 1395–1401 |
| Mantua (lordship, marquisate, duchy) | 1328–1432, 1433–1529, 1530–1708 |
| Duchy of Ferrara (Este state) | 1264–1287 (Ferrara), 1288–1597 (Ferrara, Modena, Reggio) |
| Republic of Siena | 1200–1555 |
| Republic of Lucca | 1160–1799 |
| Duchy of Lucca | 1815–1847 |
| Duchy of Urbino | 1443–1512, 1513–1631 |
| Duchy of Gaeta | 839–1140 |
| Principality of Piombino | 1399–1801 (with Elba) |
| Duchy of Montferrat | 1574–1708 |
| Free Territory of Trieste | 1947–1954 |

## Skipped, with reasons
- **Already drawn under another name or id:** Ancient Rome (Roman Kingdom/Republic/Empire realms); Old Swiss Confederacy (Swiss
  Confederation); Kingdom of Holland (Batavian Republic polygon 1803–1810); July Monarchy, French constitutional monarchy, Provisional
  Government of the French Republic (same territory as the drawn French regimes); German Reich (German Empire, Weimar, Nazi Germany);
  Fascist Italy, Italian Social Republic (Kingdom of Italy / Nazi Germany polygons); Spain under the Restoration, Hispanic Monarchy,
  Spain under Joseph Bonaparte (Kingdom of Spain); Muslim Sicily (Emirate of Sicily); Almohads (Almohad Caliphate); Duchy of Florence,
  Signoria of Florence (Republic of Florence); Electorate of Bavaria, Palatinate-Neuburg, Palatinate-Sulzbach (Duchy of Bavaria);
  Kingdom of Burgundy (Burgundian Kingdom, Upper/Lower Burgundy, Kingdom of Arles); Middle Francia (Middle Franks); United Kingdom of
  the Netherlands (Netherlands 1815–1830); Swedish Pomerania and Bremen-Verden (Swedish Empire); Duchy of Savoy (County of Savoy, House
  of Savoy, Kingdom of Sardinia; the 1536–1559 French occupation is drawn as France); Czechoslovak republics and Lands of the Bohemian
  Crown (Czechoslovakia, Kingdom of Bohemia); Grand Duchies of Mecklenburg-Schwerin and -Strelitz (Duchy of Mecklenburg, German
  Empire); Jorvik (Danelaw); Kingdom of Dublin (Cliopatria's "Viking settlements"); County of Sicily, Duchy of Apulia and Calabria,
  County of Aversa (Norman Italy); Visigothic Kingdom of Tolosa and of Toledo (Visigothic Kingdom); Kingdom of Glywysing (Morgannwg).
- **Colonial empires:** French, Dutch and German colonial empires (the home countries are drawn; overseas holdings belong to other
  regions).
- **Provinces, crown lands and sub-kingdoms inside a drawn state:** Austrasia, Lower Lotharingia, Duchy of Alsace, Duchy of
  Tridentum; Kingdom of Ireland 1542–1801 and Lordship of Ireland (drawn inside England/Great Britain); Principality of Wales
  1216–1542 (Gwynedd to 1284, then English crown land); Kingdoms of Valencia, Toledo, Murcia, Jaén, Seville and the Algarve (crown
  kingdoms of Aragon, Castile, Portugal); Kingdom of Lombardy–Venetia, Kingdom of Illyria, Duchy of Carniola, Gorizia and Gradisca,
  Duchy of Salzburg 1849–1918 (Austrian crown lands); Duchy of Schleswig (Danish fief); Seventeen Provinces (Habsburg Netherlands);
  County of Zeeland, Tournaisis, county of Louvain; Duchy of Magdeburg, Principalities of Halberstadt and Minden (Prussian provinces);
  Duchy of Limburg 1839–1866 (Dutch province); County of Nice (Savoyard province); Landgraviate of Upper Alsace (Habsburg); Bavarian
  partitions (Landshut, Munich, Ingolstadt, Straubing); March of Turin; Noricum (Roman province); Ifriqiya and the French protectorate
  of Tunisia (North African, and inside drawn polities); Protectorate of Bohemia and Moravia (inside the Nazi Germany outline; also
  straddles 15°E); Socialist Republic of Slovenia (inside Yugoslavia); Quisling regime (occupied Norway); Free People's State of
  Württemberg and the other 1918–1945 German Länder.
- **Too small to draw at ~0.05°, or fragmented into many tiny pieces:** the Anhalt, Saxon-Ernestine, Schwarzburg, Reuss,
  Hohenzollern-Hechingen, Schaumburg-Lippe, Nassau, Hohenlohe, Wied, Fürstenberg, Sayn-Wittgenstein, Salm, Leyen, Orange-Nassau and
  Nassau-Orange-Fulda territories; Palatinate-Zweibrücken; Hesse-Marburg, Hesse-Hanau; Mecklenburg-Güstrow and Mecklenburg-Stargard
  (partitions; Mecklenburg as a whole before 1806 is a remaining gap, not in this audit list); prince-bishoprics of Speyer, Eichstätt,
  Lübeck, Brixen, Brandenburg; Stavelot-Malmedy, County of Horne, County of Buren, Montbéliard, Principality of Sedan, Bidache,
  Republic of Mulhouse; Couto Misto, Republic of Noli, Republic of Cospaia, Marquisate of Finale, Duchies of Massa and Carrara,
  Guastalla, Mirandola, Castro and Sora, Principality of Sperlinga; Republic of Ancona; Montpellier seigneury, Counties of Astarac,
  Bigorre, Girona, Conflent, Sobrarbe, Cerdanya (Cliopatria's Berga and Rosellón cover them); Taifas of Lisbon, Lérida, Mértola, Molina
  (mostly inside the drawn Badajoz, Zaragoza and Seville taifas); Kingdom of Viguera; Dogfeiling.
- **Under ~25 years (short-lived regimes):** Transpadane, Parthenopean, Anconine, Brescian and Neapolitan (1647) republics, Republic of
  San Marco, Italian United Provinces, United Belgian States, Republic of Liège 1789–1791, Anglo-Corsican Kingdom, Kingdom of Corsica
  1736, Principalities of Elba, Ponte Corvo, Aschaffenburg and Erfurt, Valais Republic, Gozo 1798–1800, German Empire of 1848/49,
  Catalan Republic 1640–41, Irish Republic 1798, Limerick Soviet, Free State Bottleneck, Free State of Fiume, Italian Regency of
  Carnaro, People's State of Bavaria, Republic of Reuss, Free States of Coburg, Saxe-Gotha and Waldeck-Pyrmont, Regional Defence
  Council of Aragon, Sovereign Council of Asturias and León, Republic of Rose Island, Saxe-Eisenberg, Saxe-Gotha (1640–1680 is a
  partition), Kingdom of Tunisia 1956–57, Taifas of Baeza, Lorca, Jerez, Calatayud. (Allied-occupied Germany, the Saar Protectorate and
  the Free Territory of Trieste are drawn although short, because they were distinct, notable post-war entities and the border data
  shows them wrongly.)
- **Legendary or mislocated:** Alba Longa (legendary); Gaelic Ireland (a cultural term, not a state); "Isaaq chieftainship" (a
  Somali polity whose Wikidata point falls in Switzerland).

## Uncertainties
- Early medieval Ireland, Wales and Pictland: frontiers are not recorded; the Irish kingdoms follow later diocese and county lines,
  Fortriu follows the northern (Moray) location now preferred over Strathearn, and Elmet follows place-names. Start dates of 800
  (Meath, Osraige) and 1000/1200 (Breifne, Tyrconnell) are when the drawn extents are attested, not foundation dates.
- Holy Roman Empire territories were patchworks of enclaves; Liège, the Palatinate, Mainz, Hesse, Baden, Ansbach, Bayreuth and the
  Welf principalities are smoothed to their main blocks, and small exclaves are omitted. Welf partitions changed often; Wolfenbüttel
  is drawn at one extent for 1269–1806.
- The Este state ignores the loss of Reggio (1306–1409); Milan 1330–1386 is drawn at its mid-14th-century extent; Gian Galeazzo's
  1399–1402 conquests (Pisa, Siena, Perugia, Bologna) are not drawn, so Siena is shown independent then.
- Pomerania extends east of 15°E; the eastern researcher should not draw it again.
- Berlin and the American enclave of Bremen are not cut out of the Soviet and British zones.
- The Majorca taifa's dates follow Wikipedia (first taifa 1076–1116, Banu Ghaniya until 1203); Banu Ghaniya independence is dated from
  the fall of the Almoravids in al-Andalus (c. 1147).
