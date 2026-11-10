# Storyboard: Second World War (`content/cinema/world-war-ii.json`)

Sides follow `content/wars/c-worldwars.json` (`world-war-ii`): **0 = Allies, 1 = Axis, 2 = Vichy France**.

Counts: 18 chapters, 8 fronts, 60 occupation areas, 80 arrows, 46 battles, 126 claims.
`tools/cinema/validate.py`: no errors. `tools/cinema/check_history.py`: **0 errors, all 126 claims pass**, 124 warnings (explained below).

## Chapters and why
| # | id | span | why |
|---|----|------|-----|
| 1 | poland | 1939-09-01 – 10-06 | the invasion that started the war; three German thrusts, Warsaw, the Bug–San partition |
| 2 | norway | 1940-04-09 – 06-10 | Denmark in a day, Norway's ports, the Allied recapture and loss of Narvik |
| 3 | france | 1940-05-10 – 06-25 | Ardennes breakthrough, Dunkirk, Paris, armistice and the Vichy zone |
| 4 | britain | 1940-07-10 – 10-31 | shown honestly as an air battle: no front, no change of ground (claims only test who held London, Dover, Portsmouth, Calais) |
| 5 | desert | 1940-09-13 – 1942-07-01 | the coastal seesaw: Sidi Barrani, Compass, Rommel, besieged Tobruk, Crusader, Gazala, to El Alamein |
| 6 | balkans | 1940-10-28 – 1941-06-01 | Greek–Italian war in Albania, the April 1941 invasion of Yugoslavia and Greece, Crete |
| 7 | barbarossa | 1941-06-22 – 1942-01-07 | Barbarossa to the gates of Moscow and the December counter-offensive |
| 8 | japan-sweep | 1941-12-07 – 1942-05-31 | Japan's conquest of South-East Asia (Pearl Harbor is in the text; its marker lies far east of the frame) |
| 9 | guadalcanal | 1942-06-04 – 1943-02-09 | Papua (Kokoda, Buna–Gona) and Guadalcanal; Midway is context in the text (its marker is across the date line, outside any chapter frame) |
| 10 | stalingrad | 1942-06-28 – 1943-02-02 | Case Blue, the Caucasus, the city, Uranus and the pocket |
| 11 | alamein-tunis | 1942-10-23 – 1943-05-13 | El Alamein to Tripoli, Torch, Kasserine, the fall of Tunis |
| 12 | kursk | 1943-07-05 – 12-31 | Citadel, Orel and Kharkov, Smolensk, the Dnieper and Kiev |
| 13 | italy | 1943-07-10 – 1945-05-02 | Sicily, Salerno, Cassino/Anzio, Rome, the Gothic Line and the Po (one long chapter, so the 1944–45 front has a home) |
| 14 | pacific | 1943-11-20 – 1945-03-26 | island-hopping (Tarawa, Kwajalein, Saipan, Guam), Leyte, Manila, Iwo Jima |
| 15 | d-day | 1944-06-06 – 09-15 | Normandy, Cobra, Paris, Dragoon, to Belgium and the German border |
| 16 | bagration | 1944-06-22 – 08-31 | Bagration, Lvov–Sandomierz, Warsaw Uprising (text only), Romania changes sides |
| 17 | berlin | 1944-12-16 – 1945-05-08 | the Bulge, Vistula–Oder, the Rhine, the Elbe meeting, Vienna and Berlin |
| 18 | japan-end | 1945-04-01 – 09-02 | Okinawa, Hiroshima and Nagasaki (marked soberly as bombings with death tolls), Manchuria, surrender |

The Holocaust is not covered here (it is a separate moment); the Warsaw Uprising and Manila's civilian deaths are mentioned without detail.

## Base map
The yearly border data draws German-held land as part of "Nazi Germany", drops Italy entirely in 1944 and draws post-war borders in 1945. So `baseYears` pins **1939** borders until 24 June 1940, **1940** borders until 21 June 1941 and **1941** borders (pre-Barbarossa) for the rest of the war; every later change is an occupation area. Membership is by whole year (the war file has no fromDate/toDate), which the areas correct where it matters:
- France and Belgium are not Allied members in 1940, so "Allied-held France and Belgium (1940)" (side 0) covers unoccupied France (and Belgium from 10 May) until the armistice, plus a Dunkirk pocket.
- Greece is not a member in 1941 and Yugoslavia never is before 1944: "Greek-held ground" and "Yugoslav-held ground (April 1941)".
- Egypt is neutral on the map: "British-held Egypt and Libya" (east of the desert front).
- Germany, Hungary and Croatia stop being Axis members after 1944, so 1945 has "Germany and the ground it still held" (north and south of the Elbe meeting point), "Axis-held Hungary (1944)", German-held Norway/Denmark and western Netherlands.
- Italy is Axis in 1943 and Allied in 1944–45: "Allied-held Sicily and southern Italy (1943)", then "German-held Italy (after the 1943 armistice)"; also Sardinia, German-occupied Albania/Montenegro, Vichy zone occupied from November 1942, Greece liberated 1944, Romania Allied from its switch (August 1944).
- The 1941 base draws Tobruk as British: "Axis-held Tobruk (1942)" covers June–November 1942.
- Soviet-occupied eastern Poland (17 September 1939) cannot be shown: the Soviet Union was not at war with the Allies and the format has no neutral occupier, so it stays as Polish ground (Allied tint until the end of 1939, neutral in 1940) until the 1940 borders take over on 25 June 1940. The chapter text says so.

## Review fixes (coordinator, chapter 17 and grey land)
- 5 May 1945: Denmark, Schleswig-Holstein, north-west Germany and the western Netherlands become Allied-held (surrender at Lüneburg Heath, effective 5 May); the German area north of the Elbe ends on 5 May and the Norway/Denmark area keeps only Norway until 8 May. Claims: Copenhagen and Amsterdam Allied-held on 7 May.
- The Soviet-held area now reaches the Elbe and Wismar (no grey wedge in Mecklenburg); the 1945 German areas overlap their neighbours slightly so no grey seams open between them; the US line of 5 May runs to Pilsen–Linz–Carinthia, so Tyrol is no longer an Axis pocket.
- Grey-land scan of every chapter (start, middle, end): added Danzig to the 1939 German area; Greek islands to Greek-held ground; Corsica (Allied 1940, liberated from October 1943); French North Africa (Allied in early 1940 and 1945, when the war file has no member for it); Partisan-held Yugoslavia in 1945; Axis-held Hungary now covers Ruthenia and Transylvania until the Soviet arrival; Buru, Seram and Ambon in the Japanese area; Allied-held Dutch New Guinea (south, then Hollandia, Biak and Sansapor in 1944); Japanese-occupied Attu and Kiska (1942–43); the Courland area stops at Liepāja (Memel and the Lithuanian coast were Soviet). The Netherlands, Luxembourg, Denmark, the Baltic states, Albania, the Protectorate and Slovakia were checked year by year and are held by a side throughout.
- The Soviet Kerch landing (26–30 December 1941) is drawn until the German recapture on 19 May 1942 (claim: Kerch Soviet-held on 5 January 1942).
- Neutral Andorra and Switzerland are explained by claims (holder null), since the pocket rule now also flags grey ground.
- Remaining small grey areas: Danzig on 1 September 1939 only, Lesbos in June 1941, slivers at the 1940 demarcation line in 1944, the Saar–Moselle triangle and the Pomeranian coast on 27 February 1945 (interpolation between keyframes), and the Netherlands from January to May 1940, shown as Allied because the war file lists the Netherlands for the whole of 1940.

## Maps traced
- **Eastern Front**: the seven USMA-derived Commons maps *Eastern Front 1941-06 to 1941-12* … *1945-01 to 1945-05* share one frame. I georeferenced it from 39 town markers (cubic fit, median error ≈ 8 km), segmented the coloured phase zones and built the Axis-held Soviet area and the front line for every dated phase (9 Jul, 1 Sep, 9 Sep, 5 Dec 1941; 5 May, 7 Jul, 22 Jul, 1 Aug, 18 Nov, 12 Dec 1942; 18 Feb, 18 Mar, 1 Aug, 1 Dec 1943; 30 Apr, 19 Aug, 30 Aug, 31 Dec 1944). Hand-spliced intermediate lines: 20 Oct 1941 (Typhoon), 7 Jan 1942, 23 Aug and 30 Sep 1943, 4, 17 and 27 Jul 1944 (Bagration), and all 1945 lines (from the 1945 map and cited dates). Soviet-held ground beyond the 1941 border comes from the same zones.
- Theatre maps checked by eye: *Invasion of Yugoslavia and Greece, April 1941* (USMA), *Italy September 1943*, *OPERATION-TORCH-OVERVIEW*, *1939-1940 battle of france plan evolution*, *4June-12June Battle of France*, *Second world war asia 1937-1942 map en6*, *WW2, Western front 1944-1945*, *Western Front 1944-12-01*. Other lines (Poland, Norway, France 1940, desert, Tunisia, Albania, Italy, Normandy, Western Front 1944–45, the Pacific) are hand-traced from town positions and the dates in the cited articles.
- Areas are clipped to the corrected borders the app draws (`tools/borders`), but run out over the sea and over the occupier's own states (neither is drawn), so the app's 192-point resampling does not leave slivers along coasts and borders. Holes (a pocket of untaken land) become notches.

## Uncertainties and simplifications
- Accuracy: Eastern Front ≈ 10–25 km; hand-traced theatres ≈ 20–50 km; Pacific areas only say which islands Japan held (they include sea).
- Pockets not drawn as separate areas: Kutno/Bzura (1939), Demyansk and Kholm (1942), Korsun (1944), Budapest garrison, Breslau, Königsberg and the Ruhr pocket (1945), bypassed Pacific islands such as Rabaul and Truk (kept inside the Japanese areas) and the French Atlantic pockets. The Leningrad and Oranienbaum bridgehead, Sevastopol (until 4 July 1942), Tobruk (1941), the Stalingrad pocket, Courland and the Dunkirk pocket are drawn.
- China: Japan's 1941 holdings come from the base map; the 1944 Ichi-Go offensive is not drawn. Burma 1944–45 is drawn coarsely; the Chin Hills stay British until 1943–44 and Kengtung until the Thai occupation (June 1942).
- 25 August 1942 is keyed with the 18 November positions (Stalingrad's approaches and the Caucasus were largely reached by late August, Nalchik and Novorossiysk later).
- The Sandomierz bridgehead is shown by the front line only, not as a separate Soviet area.
- The final 1945 West–East line along the Elbe is a meeting line, not a front, but is drawn as the Western Front's last position.

## Warnings left (124)
- 13 battles far from any front: Pacific battles (no fronts there), the Battle of Britain, Dunkirk, Warsaw (no front drawn in 1939–40), the atomic bombings, Crete, Kiev and Bagration (marker at the encirclement/centre, behind the line).
- 14 front gaps: fast-moving periods with no traced intermediate position (Jul–Sep 1941, Oct–Dec 1941, Dec 1942–Feb 1943, Oct–Dec 1943, late 1944), the desert front after it hands over to the Tunisian front, and the Eastern Front seen faintly in the Italy chapter's frame.
- About 80 small pockets (600–2,400 km², mostly one grid cell), now including grey (neutral or unrecorded) ground: resampling and interpolation slivers between areas, Alpine and Adriatic edges, small neutral states. None reaches the 2,500 km² error level.
- 6 fronts running inside areas during transitions, and 3 side-date warnings from the war file's whole-year membership.

## Three hardest calls
1. **Base map strategy**: freezing the 1941 borders from Barbarossa to the end and drawing every later change as an area (including Germany itself in 1945, when it is no longer an Axis member on the map), instead of switching yearly borders that were snapshots of uncertain dates.
2. **The Soviet invasion of Poland** cannot be drawn (no neutral occupier), so the map shows only the German zone and the text carries the Soviet half.
3. **Pacific**: islands are mostly absent from the base map, so Japanese-held areas are drawn as sea-including regions (split into Indochina–Thailand, Malaya, Burma, Philippines, Borneo, Sumatra, Java, Celebes–Timor, western New Guinea, Hong Kong and the island groups) and US-held islands as small areas; Midway and Pearl Harbor lie across the date line from every chapter frame and are told in the text.
