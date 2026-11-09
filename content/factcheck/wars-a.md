# War playback, slice a (early): fact-check and map-link log

File: `content/wars/a-early.json`. It holds 6 wars and 127 events: Peloponnesian War (20 events), Second Punic War (24), First Crusade (15), Third Crusade (18), Hundred Years' War (28) and Wars of the Roses (22). The coordinator added the Wars of the Roses to the original five.

**Sources.** Britannica (HTTP 403), the Met Heilbrunn Timeline (HTTP 429) and Historic England (HTTP 403) refused automated fetches, so none of them is cited. The cited sources are English Wikipedia articles. Their text was fetched in this session through the Wikipedia API (plain-text extracts), and infobox figures were read with a page fetch. Every cited URL is a page that was read. Each war cites 5–8 of them (41 in all).

**Validation passed.** The JSON parses and ids are unique. Wars are in chronological order. Event years equal the date year and fall inside `span`. Every member name exists in `public/data/clio/index.json`, with every year from `from` to `to` inside one of the realm's rows. No realm is on two sides in the same year. `content/corrections.json` has no entries (clip, hide or relabel) for any member used here. Every `text` is at most 90 characters, every `detail` is 60–110 words, and every summary is 120–180 words.

**BCE dates.** `tools/content.py` sorts events by `(year, str(date))`. For BCE events a year-only date such as "-431" sorts before "-431-04-04", which would reorder same-year events. All BCE `date` fields are therefore the bare year ("-431"), the month or day is given in `label`, and same-year events keep their file order (the sort is stable). CE dates are ISO.

## Member choices

**Peloponnesian War** (`moment`: null, because no Peloponnesian War moment exists)
- Spartan side: Peloponnesian League, 431–404 BCE. Achaemenid Empire, 412–404 BCE. Persian satraps allied with Sparta after the Sicilian disaster. Wikipedia dates Persian support from 413; the first treaties and the reconquest of Ionia are 412, and that year is used for the start.
- Athenian side: Odrysian Kingdom, 431–429 BCE only. Sitalces allied with Athens at the start of the war and invaded Macedon in 429. **Athens and the Delian League have no realm.** Cliopatria's "Greek City-States" is a scattered residual layer. For 431 BCE it holds Crete, Magna Graecia, Thessaly, Massalia and Black Sea colonies, but **not** Athens or the Aegean islands (point tests at Athens, Samos, Mytilene and Melos all miss). Using it would colour neutral and enemy cities, so it is not used. From 428 BCE onward the panel shows the Athenian side as "not drawn on the map this year".
- Left out: Macedon (Perdiccas II changed sides several times), Syracuse (no realm), Thebes and Boeotia (outside the Peloponnesian League polygon).

**Second Punic War** (`moment`: null, because `carthage-corinth` is the Third Punic War)
- Rome: Roman Republic, 218–201 BCE. Aetolian League, 211–206 BCE, from the treaty of 211 until its separate peace with Philip V in 206. Kingdom of Pergamon, 209–208 BCE, the years Attalus I campaigned in Greece (he went home after 208).
- Carthage: Carthage, 218–201 BCE. Antigonid Macedonia, 215–205 BCE, from the treaty with Hannibal in summer 215 to the Peace of Phoenice.
- No realm, so described in the text only: Syracuse (allied with Carthage 214–212), Capua and the other defecting Italian cities, the Numidian kings Syphax and Masinissa, and the Gauls. "Kingdom of Numidia" starts only in 197 BCE. "Mauretania" (from 212) took no documented part.

**First Crusade** (`moment`: `first-crusade`)
- Crusaders and Byzantine allies: Byzantine Empire, 1097–1098. Alexios took Nicaea with the crusaders, but Bohemond treated the alliance as void after Alexios turned back in June 1098. County of Edessa, Principality of Antioch and Kingdom of Jerusalem, 1099, because their rows start in 1099.
- Seljuk Turks: Sultanate of Rum, 1096–1097 (Civetot, Nicaea, Dorylaeum). Danishmendids, 1097 (Gazi Gümüshtigin fought at Dorylaeum). Great Seljuk Empire, 1097–1098. Antioch, Aleppo, Damascus and Kerbogha's Mosul all lie inside this polygon.
- Fatimid Caliphate, 1099 (Jerusalem, Ascalon), as a separate third side.
- The crusader armies have no realm. Span is 1096–1099, as the brief gave it, so Clermont (Nov 1095) is described inside the first event.

**Third Crusade** (`moment`: null; `fall-of-acre` is 1291)
- Crusaders: Holy Roman Empire, 1189–1191 (Barbarossa, then Frederick of Swabia and Leopold until August 1191). Kingdom of Jerusalem, 1189–1192 (Guy and Conrad's rump kingdom). Angevin Empire, 1190–1192, which is Richard's realm in this slice; its key is "(Kingdom of England)". Kingdom of France, 1190–1191. The bare realm is used, not "(Kingdom of France)", so the vassal counties are not coloured.
- Ayyubid Sultanate, 1189–1192.
- Third side: Sultanate of Rum, 1190, which fought the German army (Philomelion, Iconium). It was not allied with Saladin, so it has its own side.
- Left out: Byzantium. It clashed with Barbarossa in Thrace in 1189 but was not at war with the crusade as a whole; the text covers this. Also left out: Cilician Armenia (Leo II's troops at Acre in 1191), Cyprus and the Italian and northern fleets.

**Hundred Years' War** (`moment`: null)
- England: Kingdom of England, 1337–1453. Its polygon includes Gascony and, after 1347, Calais, and in the 1420s–30s it covers English-held northern France, with Paris inside in 1430. Duchy of Burgundy, 1419–1435, from the alliance after John the Fearless's murder to the Treaty of Arras. The bare realm is used because Cliopatria puts Burgundy inside the "(Kingdom of France)" group.
- France: Kingdom of France, 1337–1453. The bare realm is used, not the group, because "(Kingdom of France)" also contains Duchy of Aquitaine, Duchy of Brittany and Duchy of Burgundy, which would colour English allies and Breton claimants as French. Kingdom of Scotland, 1337–1453 (Auld Alliance, Neville's Cross, the Scots at Baugé and Verneuil). Crown of Castile, 1369–1389, the Trastámara naval alliance (La Rochelle 1372) up to the Truce of Leulinghem.
- Left out: Duchy of Brittany (divided loyalties in the War of the Breton Succession), County of Flanders, Navarre and Portugal (proxy conflicts).

**Wars of the Roses** (`moment`: null). Added at the coordinator's request.
- Cliopatria has only the Kingdom of England, so the two houses are described in the text and shown through event pins. **Choice:** the Kingdom of England is coloured for the house holding the throne in most of each year. That is House of Lancaster for 1455–1460, House of York for 1461–1485, and Lancaster/Tudor again for 1486–1487. Year granularity means two short changes of control are not shown. Henry VI's Readeption (3 Oct 1470 – Apr 1471) stays in York colour; the Readeption event says so. Henry Tudor's reign from 22 Aug 1485 starts in 1486. The two sides never claim the same year, so the app's first-side-wins rule does not apply.
- Left out: France, Scotland and Burgundy. The Wikipedia infobox lists France and Scotland (1460–85) on the Lancastrian side and Burgundy on the Yorkist side, but their support was episodic (refuge, money, mercenaries), and colouring whole kingdoms would mislead. It is described in the text instead: Louis XI and Warwick in 1470, Burgundian aid in 1471 and 1487, French troops with Henry Tudor in 1485.

## Gaps and errors in the map data
- **Greek City-States (−450…−405)**: a residual mosaic that does not contain Athens or the Aegean islands, so the Delian League cannot be drawn. The Peloponnesian League polygon covers the Peloponnese and Corinth but not Thebes or Boeotia.
- **Athenian Coalition** (−323…−319, −264…−257) links to the Wikipedia page "Peloponnesian War", but its years do not cover that war. It looks like a mislabelled later realm.
- **Second Punic War**: the Carthage polygon includes Carthaginian Iberia, and Capua sits inside Carthage in −211. Saguntum, Massalia, Syracuse and Tarentum fall in no polygon. New Carthage turns Roman only in the −206 row, although Scipio took it in 209.
- **First Crusade**: Edessa lies inside "Byzantine Empire" for 1096–1098, although the Byzantines lost it to the Seljuks in 1087 and the Armenian Thoros ruled it. In the 1098 row Antioch and Jerusalem are still inside Great Seljuk Empire, although the crusaders took Antioch in June 1098 and the Fatimids took Jerusalem in 1098. The crusader states first appear in the 1099 row, although Edessa (Mar 1098) and Antioch (Jun 1098) were founded a year earlier. The Constantinople point falls outside the Byzantine polygon. **"Hamdanid Emirates"** draws a polygon of about 1M km² over Syria and Iraq from the 1090s to 1259, though the Hamdanid dynasty had ended by the early 11th century; it overlaps Great Seljuk Empire at Aleppo, Damascus and Ma'arra. It is not used.
- **Third Crusade**: Cyprus is drawn as Byzantine through 1191 (Isaac Komnenos ruled it independently), and "Kingdom of Cyprus" appears from 1192. Acre is inside Ayyubid Sultanate until the 1191 row ends (captured July 1191). The 1188–1191 Kingdom of Jerusalem shape (about 2,600 km²) lies inland of Tyre, and the city itself falls in no polygon.
- **Hundred Years' War**: in the 1340–1380 rows the points for Calais and Agincourt fall inside "Free County of Burgundy" (Franche-Comté), apparently a misplaced shape. Rennes is inside Kingdom of England in 1430, though Brittany was never English-ruled. The Kingdom of England row for 1440–1458 keeps Gascony until 1458, so the map still shows English Gascony after Castillon and the fall of Bordeaux in 1453. In 1453 Bordeaux is inside both England and France. Castillon is inside County of Périgord for 1440–1453.
- **Wars of the Roses**: no realm for either house (expected).

## Pins with approximate locations
Hannibal's Alpine pass (debated; shown near Mont Cenis/Little St Bernard), Cissa (location uncertain, shown at Tarraco), Upper Baetis (shown near Castulo), Zama (battlefield unknown), Great Plains (shown near Souk el-Kremis), Aegospotami, Civetot, the Arqa siege, Beit Nuba and the second Jerusalem advance, Ludford Bridge, Ravenspurn (a lost town at Spurn), and Bosworth (exact site disputed).

## Contested facts (hedged or noted in the text)
- Peloponnesian War: Pericles' death from the plague is attested only by Plutarch, and the text says so. Plague deaths of 75,000–100,000 (about a quarter of the population) follow Wikipedia; the main war article gives over 30,000 citizens, sailors and soldiers. Arginusae slaves and metics *may* have received citizenship; the text says only that they were enlisted. There is no overall casualty total.
- Second Punic War: Cannae dead are about 48,000 (Livy) to 70,000 (Polybius), and some modern historians go much lower. The Trebia was on 22 or 23 December. The traditional date of Zama (19 October) is not used; the text says October 202. There is no total.
- First Crusade: Nicaea surrendered on 18 June (First Crusade article) or 19 June (Siege of Nicaea article); 19 is used. For Antioch the crusaders entered on the night of 2/3 June, and 3 June is used. The cannibalism at Ma'arra is reported only by Latin chroniclers, and the text says so. For the Jerusalem massacre the text gives modern estimates of 3,000–10,000, not the 70,000+ of medieval Arab sources.
- Third Crusade: the Treaty of Jaffa was signed on 1 or 2 September 1192. The text calls Richard's role in Conrad's murder a suspicion only. The Acre casualty estimates in the infobox are inconsistent, so the casualty line says only "tens of thousands".
- Hundred Years' War: the casualty figures (about 185,000 killed in battle, about 556,000 military deaths) come from the Wikipedia infobox, are uncited there, and are framed as "one widely repeated compilation". Calais's capture is given by year only. The claim that 40% of the French nobility died at Agincourt is not used.
- Wars of the Roses: the total of about 105,000 killed in battle (Wikipedia infobox) is hedged against historians who argue for more limited fighting. The 28,000 reported dead at Towton is flagged as considered exaggerated (Ross and others). Wakefield is described as possibly a skirmish (recent research). Henry VI's death is "probably murdered". Wikipedia disagrees with itself on Burgundy's 1471 help: "precious little" in the main article, money, ships and men in the Tewkesbury article. The text says "some money, ships and men". The Ludford Bridge rout is dated only "Autumn 1459" (date field 1459-10).

## Count
6 wars, 127 events, 41 sources. No fact corrections apply, because this is new content.
