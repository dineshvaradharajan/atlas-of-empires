# War playback, slice e (East Asia and the steppe): fact-check and map-link log

File: `content/wars/e-asia.json`. It holds 2 wars: the Mongol conquests, 1206–1260 (28 events), and the Imjin War, 1592–1598 (25 events).

**Sources.** Britannica returned HTTP 403 to both curl and WebFetch, so it is not cited. Every cited source is an English Wikipedia article whose raw wikitext was fetched in this session (about one request every 2 s), and the statements used were checked against that text, mostly the parts with citations. Each war cites 8 pages; the storyboards cite 14 more.

**Validation passed.** The JSON parses, and both ids are unique across `content/wars/*.json`. Events are in date order, and every event's `year` matches its date and falls inside `span`. Every `text` is at most 90 characters, every `detail` is 60–110 words, and both summaries are 120–180 words. Every member name exists in `public/data/clio/index.json`, with `from`–`to` inside the realm's rows. `tools/content.py` reports no problems for these wars.

## Member choices

**Mongol conquests** (`moment`: `genghis-khan`; `sack-of-baghdad` also exists, and the war's start was preferred)
- Side 0, Mongol Empire, 1206–1260. Cliopatria starts the realm in 1206 and draws it as one realm until 1293. In the corrections, Syria is not Mongol after Ain Jalut.
- Side 1, "States the Mongols attacked (not allied with one another)". Each member is listed only for the years it was at war:
  - Western Xia: 1209–10 (toDate 1 Feb 1210, after the submission of January 1210), then 1225–26 with toDate 15 Sep 1227 (the surrender of September 1227; the realm's rows end in 1226).
  - Great Jin: 1211–1234 (toDate 9 Feb 1234). Kara-Khitans: 1218 only.
  - Khwarezmid Empire: 1219–1231 (toDate 15 Aug 1231, the death of Jalal al-Din). The realm's 1222–35 rows are his western Iranian state.
  - Kingdom of Georgia: 1220–22. Kievan Rus': 1223 only (Kalka). That polygon covers all of Rus' in 1223, so Vladimir-Suzdal and Novgorod, which did not fight, are coloured too.
  - The principalities of Ryazan (1237–38), Rostov-Suzdal (1238), Chernigov (1238–39), Pereyaslavl (1239), Kiev (1240) and Galicia-Volhynia (1240).
  - "(Duchies of Poland)": 1241. The group is used because the raid crossed Sandomierz, Kraków and Silesia.
  - Kingdom of Hungary: 1241–42. Abbasid Caliphate: 1257–58 (toDate 10 Feb 1258).
- Side 2, Mamluk Sultanate, 1260.
- Left out because they have no realm: the Nizari Ismaili state (shown in the storyboard as a side-1 area), the Cumans/Kipchaks and Alans, the Ayyubid emirates of Syria (their land is blank in 1241–59), and the Southern Song. The Song were Mongol allies against the Jin in 1233–34 and enemies from 1235; the war after 1235 is out of scope.

**Imjin War** (`moment`: null; no moment exists)
- Side 0, Japan: "Warring States Japan", 1592–98. This is the only Cliopatria realm for Japan in 1592; corrections.json has no relabel for it, and the side is named "Japan (Toyotomi Hideyoshi)".
- Side 1, Joseon, 1592–98. "(Allegiance of Joseon to Ming Dynasty)" ends in 1571.
- Side 2, Ming Dynasty, 1592–98, with fromDate 23 Aug 1592, when Zu Chengxun's force attacked Pyongyang.

## Gaps in the map data (for the storyboards; not changed in shared files)
- Western Xia: from 1216 the data draws only the Ordos as Xia; the Hexi corridor and Yinchuan are drawn as Mongol from 1219.
- The Jin keep Hebei, Shanxi and Shandong until 1235 in the data, although Muqali had taken most of them by the early 1220s.
- 1220: Transoxiana is already Mongol from January. 1221–26: Khorasan and Afghanistan are blank.
- 1241–49: the Mongol shape has fingers reaching into Silesia and the upper Tisza (Hungary).
- 1260: all of Syria is Mongol for the whole year. 1595–99: "Warring States Japan" covers central Korea, including Hanseong.

## Contested or uncertain facts
- Mongol death toll: the often-quoted 40–60 million comes from McEvedy and Jones (1978) and is disputed. The text says so, and it does not use chroniclers' city totals.
- Genghis Khan's death: 18 or 25 August 1227, cause uncertain. The event says "August 1227".
- The Imjin War article mixes Korean lunar and Gregorian dates (e.g. "Kaesong 19 January 1593" after Pyongyang on 8 February). Dates come from the individual battle articles, which give Gregorian dates. The Japanese evacuation of Hanseong is given only as "spring/May 1593", and the naval battle of Busan is placed on 5 October 1592 (the 1st day of the 9th lunar month).
- Casualties for the Imjin War follow the main article's infobox (over a million Koreans; more than 100,000 Japanese, a figure the article itself flags as poorly sourced; and over 30,000 Ming soldiers) and are hedged as uncertain.
