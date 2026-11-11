# Eastern Europe: reconstruction layer (`content/supplements/eu-east.json`, id `eu-east`)

Scope: the coverage audit's "Europe" entries located at or east of 15°E (147 of the 403). Another researcher has
Europe west of 15°E. The layer adds 16 states as 23 time-bounded regions and 14 sites. `replaces` is empty: no
Cliopatria realm is hidden. Where Cliopatria covers the same ground with a wrong or lumped polygon (for example
"Ottoman Empire" over Skanderbeg's Albania, "Crown of Aragon" over Acciaioli Athens, "Union of Soviet Socialist
Republics" over Poland in 1945–52), the reconstruction is drawn on top of it.

Most of the 147 audit entries turned out not to be drawable gaps: Cliopatria draws the region densely (Rus'
principalities, Silesian and Polish duchies, Serbian, Bulgarian, Albanian and Latin states, Georgian kingdoms), and
the rest of the list is dominated by short-lived 1917–1921 republics, Soviet and Yugoslav constituent republics,
and crown lands of Austria and Russia. That is why the count is well under the 40–80 aimed for.

Checks:
- All rings are closed and have no self-intersections.
- A 0.02° grid test found no overlaps between regions active in the same years (the Slovak Republic, 1939–45, and
  the Polish People's Republic, 1945–52, share the same Tatra border line). The same test against every other layer
  in `content/supplements/` finds no overlaps; Poland's Oder–Neisse edge reuses the points of eu-west's "Soviet zone"
  (1945–1949). Pomerania is eu-west's and is not drawn here.
- Every candidate was first tested against Cliopatria (point-in-polygon at its capital and sample points, year by
  year) and the existing supplements.
- The coastline clip handles the sea side, so seaward edges run offshore on purpose.

## States drawn

| State (key) | Slices | Why it was a gap |
|---|---|---|
| Dacia | −82 to −44 (Burebista), −43 to 106 | nothing drawn north of the lower Danube |
| Abasgia | 550–777 | Abkhaz coast empty (the Kingdom of Abkhazia, 778–1008, is drawn as "Georgia" inland, so not added) |
| Tmutarakan | 988–1094 | Taman and Kerch empty |
| Circassia | 1427–1822 (with Kabarda), 1823–1864 (western Circassia) | empty; Russian Empire shown only in some years |
| Emirate of Bari | 847–871 | painted "Aghlabid Dynasty"; Bari answered to the Abbasids |
| Principality of Arbanon | 1190–1215 | painted Byzantine, then Epirus |
| Principality of Albania (Thopia) | 1368–1392 | Durrës left uncovered; Clio's "Albanian Principalities" lumps the area |
| Principality of Zeta | 1371–1421 (Balšići), 1451–1496 (Crnojevići) | folded into "Serbian Despots", then "Duchy of Saint Sava"/Ottoman |
| League of Lezhë | 1444–1468 | painted Ottoman |
| Triarchy of Negroponte | 1205–1389 | painted "Duchy of Athens"/"Catalan Company" |
| Duchy of Athens (continuation) | 1388–1456 | painted "Crown of Aragon"/"Republic of Florence"/Venice |
| Archbishopric of Riga | 1255–1421 (two parts) | holes in Livonia between the Order's lands until "Livonian Conference" starts in 1422 |
| Bishopric of Ösel–Wiek | 1228–1421 (Wiek, Ösel, Dagö) | same holes |
| Prince-Bishopric of Montenegro | 1697–1796, 1797–1852 (with the Brda) | painted Ottoman until Clio's "Montenegro" starts in 1853 |
| Slovak Republic | 1939–1945 | painted Hungary / Nazi Germany |
| Polish People's Republic | 1945–1952 | painted USSR; Clio's "Republic of Poland" starts 1953 |

## Maps and sources
- **Shepherd, *Historical Atlas* (1911), PCL scans** (fetched): plate 88 (Baltic 1380–1560) for Livonia; plate 89
  (Byzantine Empire 1265 and 1355) for Negroponte, Albania and Zeta; plate 93 (Ottoman Empire 1451–1481) for
  Skanderbeg's Albania, which Shepherd shows as an inland strip behind the Venetian coast down to about Kastoria's
  latitude. The plates are at 1:15,000,000 or 1:7,500,000, too small to trace; they were read for extents, and the
  polygons were drawn from the described limits (rivers, towns, mountain crests) and checked against them.
- **Wikipedia** articles (fetched as wikitext, cited claims only) for dates, rulers and stated limits; the full list
  is in the layer's `sources`.
- Rendering: every polygon was rendered over a relief basemap with present-day borders and the Cliopatria outlines
  of the same year (1450 and 1380 Albania/Zeta, 1388 Euboea/Attica, 1300 Livonia, 1700 and 1840 Circassia, 1820
  Montenegro, 1940 Slovakia, 1950 Poland, −60 and 100 Dacia) and adjusted.

## Skipped, and why
- **Drawn under another name or lumped by Cliopatria:** Bulgarian Empire 1185–1396 (= "Second Bulgarian Empire");
  Byzantine Empire under the Palaiologoi (= "Byzantine Empire"); Moravian Serbia and the District of Branković
  ("Serbian Empire" / "Serbian Despots" 1375–1458); Realm of Stefan Dragutin (= "Kingdom of Syrmia"); Princedom of
  Albania's neighbours Kastrioti, Dukagjini and the Lordship of Prilep (inside "Albanian Principalities"); Duchy of
  Neopatria and Catalan Athens (inside "Catalan Company" / "Crown of Aragon"); Principality of Polotsk ("Principality
  of Polotsky", "Principality of Minsk"); Suzdal–Nizhny Novgorod ("Nizhny Novgorod"); Polish–Lithuanian union and
  Crown of the Kingdom of Poland (Kingdom of Poland / House of Jagiellon / Commonwealth); Civitas Schinesghe and the
  Duchy of Poland 966–1138 (= Kingdom of Poland); Kingdom of Serbs, Croats and Slovenes (= "Yugoslavia"); Federal
  Republic of Yugoslavia (= "Serbia-Montenegro"); Second Hellenic Republic, Albanian Kingdom and Republic, Interwar
  Latvia, Romanian Old Kingdom, Czech and Slovak Federal Republic, Federal People's Republic of Yugoslavia, Democratic
  Federal Yugoslavia, Romanian People's Republic, Second Hungarian Republic (same territory as a drawn state, renamed);
  Margraviate, Duchy, Archduchy and the inter-war republics of Austria (covered by HRE / Habsburg / "Republic of
  Austria"); United States of the Ionian Islands (drawn as British); Revolutionary Serbia ("Serbs" 1805–1915).
- **Provinces, appanages and vassals inside a drawn outline:** Ukrainian, Byelorussian, Estonian and other Soviet
  republics; Congress Poland and the Grand Duchy of Finland (inside the Russian Empire); Kingdom of Galicia and
  Lodomeria, Duchy of Bukovina, Croatia-Slavonia, Croatia in union with Hungary (inside Austria / Hungary); the
  Silesian duchies (Teschen, Opava, Brzeg, Nysa, Żagań, Oleśnica, Opole-Racibórz, Prudnik), Zator, Oświęcim, Siewierz
  and Bełz (Bohemian or Polish fiefs); Novgorod-Seversky, Goroden, Yaroslavl and Murom (Rus' appanages inside the
  drawn principalities or the Mongol overlordship Cliopatria shows); Maramureș (Hungarian county); Duchy of Aragvi
  (Georgian duchy); Principality of Lower Pannonia (Frankish vassal); Travunia (Serbian/Duklja sub-principality);
  Duchy of Estonia, Duchy of Livonia and the Duchy of Courland before 1734 (Swedish / Polish-Lithuanian provinces and
  fiefs; Clio covers them); Principality of Taranto and County of Apulia (inside Norman Italy / Sicily); Marquisate of
  Bodonitsa (small Achaean fief); WWII occupation regimes (Italian protectorate of Albania, Governorate of Montenegro,
  Hellenic State, Military Commander in Serbia, Lokot Autonomy).
- **Too short-lived (well under 25 years) or too small:** Hungarian and Slovak Soviet Republics, West Ukrainian
  People's Republic, Crimean, Kuban, Terek, Odesa, Donetsk–Krivoy Rog and other 1917–1921 republics, Makhnovshchina,
  Kholodny Yar, Republic of Central Lithuania, Finnish Democratic Republic, North Ingria, Uhtua, Karelian Labor Commune,
  Republic of German-Austria, Kingdom of Livonia (1570–78), Carpatho-Ukraine, Kruševo and Strandzha communes,
  Republic of Tamrash, Northern Epirus, Central Albania, Korçë, Prekmurje, Baranya-Baja, Lemko and Komańcza republics,
  Tarnobrzeg, Gagauz, Comrat and Pridnestrovian republics, Western Bosnia, SAO Eastern Slavonia, Zuyev Republic,
  Chalkidian League (a league of cities inside Clio's "Greek City-States").

## Uncertainties
- **Dacia:** Burebista's western and northern limits and his hold beyond the Danube are disputed; between 44 BC and
  AD 87 the kingdom was split, so the second slice is closer to Decebalus' realm than to the 1st-century fragments.
- **Abasgia:** Wikidata dates it 64–786; the region starts at c. 550, when Procopius describes a distinct Abasgian
  principality under Byzantine suzerainty.
- **Circassia:** the 1427 start is legendary (Inal the Great's dates come from 19th-century tradition, and Nogmov's
  1427 may be the year of his death); the split year 1822 follows the subjugation of Kabarda; inner limits with the
  Karachays and Balkars are approximate.
- **Emirate of Bari:** extent beyond the Terra di Bari is unknown.
- **Livonian bishoprics:** drawn to fill Cliopatria's holes, so their shape partly follows Cliopatria's Order
  polygon; the Order's share of Ösel is not separated out.
- **League of Lezhë:** frontiers moved with every campaign; ending in 1468 (Skanderbeg's death) rather than 1479.
- **Montenegro:** the Ottoman enclaves of Podgorica and Spuž are kept outside; the line with the Brda is approximate.
- **Slovak Republic:** southern border after the First Vienna Award and the March 1939 war is approximate (Košice,
  Lučenec, Rožňava, Levice outside; Michalovce inside).
- **Polish People's Republic:** formally the Republic of Poland until 1952; the 1951 border exchange is not shown.
