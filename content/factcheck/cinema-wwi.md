# Cinema data: First World War (`content/cinema/world-war-i.json`)

Side index follows `content/wars/c-worldwars.json` (`world-war-i`): **0 = Allies (Entente), 1 = Central Powers**.

## Method
- **Maps opened.** Campaign maps were downloaded from Wikimedia Commons and read one by one. Most are US Military Academy (West Point) Department of History atlas plates, which are public domain. The full list is in `sources` in the JSON: plates 5, 11, 16, 18 and 23 for the Western Front; plates 4 and 41 and the 1918 operations plate for the East; plates 14, 15 and 20 for Italy; plate 50 for the Balkans. Other maps used:
  - Map 4, "Summer campaign in the East, 1915" (dated battle lines from April to November 1915)
  - Eastern Front at 15 August 1916, with the line before Brusilov's offensive
  - the Romanian campaign of 1916 and the Serbian campaign of 1915
  - British Official History (Falls) sketch 30, Megiddo at zero hour
  - the Sinai Peninsula, and the Palestine situation in 1917
  - the 1916 limit of the Russian advance in the Caucasus
  - the BnF war map of the Middle East
- **Tracing.** Lines were traced by hand as lon/lat points, anchored on towns and rivers marked on the maps. Examples: Nieuport–Dixmude–Ypres–Armentières–La Bassée–Arras–Albert–Roye–Noyon–Soissons–Craonne–Reims–Argonne–Verdun–St Mihiel–Pont-à-Mousson–Vosges–Swiss border; Riga–Dvinsk–Lake Narocz–Baranovichi–Pinsk–Lutsk–Tarnopol–Dniester; Stelvio–Lake Garda–Asiago–Grappa–Piave. Each keyframe was then resampled to a fixed number of points per front, ordered the same way every time: north→south, west→east, coast→inland, or Euphrates→Tigris→Persia. This lets the app interpolate vertex by vertex.
- **Hold keyframes.** Some keyframes repeat the previous line, for example 1916-06-03 in the East, 1918-03-20 in the West and 1917-10-23 in Italy. They stop interpolation from creeping across long static periods.
- **Occupied areas.** These are not freehand. The enemy side of each front line was closed off into a half-plane and intersected with 1914 borders from `data/geo/world_1914.geojson` (historical-basemaps), using France+Belgium+Luxembourg, the Russian Empire (including Transcaucasia), Austria-Hungary+Germany, Italy, Serbia+Montenegro, and the Ottoman Empire.
  - Romania: the basemap polygon is anachronistic (it includes Bessarabia and part of Transylvania), so the 1913 kingdom was drawn by hand.
  - Bessarabia is removed from the Eastern occupation.
  - Slivers narrower than about 4 km, left where traced rivers and borders don't match the basemap, are removed. Only the largest piece is kept, as one ring of 25–59 points, counter-clockwise from a fixed anchor.
  - Serbia's occupied area for 1914 and October–November 1915 comes from hand-drawn rings, clipped to Serbia, following the Serbian-campaign maps.
- **Casualties.** Totals come from Wikipedia's *List of battles by casualties*, which cites each figure, and from the infoboxes of the Caporetto, Vittorio Veneto and Megiddo articles. Where sources give a range, the text gives the range and `casNum` takes a mid or mainstream value.
- **Validation.** The JSON parses. Every date is ISO and falls between 1914-07-28 and 1918-11-11. Keyframes ascend. Rings are closed. Point counts are within limits: 8–40 per line, 25–59 per ring. Every coordinate falls inside a bounding box for its theatre.

## Counts
11 fronts (Gallipoli is split into Helles and Anzac/Suvla), 10 occupations, 30 arrows, 27 battles, 25 shots, 29 sources.

## Uncertainties and simplifications
- **Accuracy.** Lines are accurate to roughly 5–15 km in Europe and 20–50 km in the Middle East and Caucasus. The Middle Eastern fronts were often not continuous: the Mesopotamian "line" joins the Euphrates and Tigris columns across open desert. Treat these as fronts of control, not trench lines.
- **West, Aug–Sep 1914.** Before the trench line existed, the 1914-08-20 and 1914-09-05 keyframes start at Antwerp and mark the limit of the German advance. The 5 Sep line runs Amiens–Senlis–Meaux–Coulommiers–Esternay–St Gond–Vitry–Revigny–Verdun. Western Flanders and Antwerp were still unoccupied then. The Aug 20 occupied area includes all Belgian land east of Antwerp, slightly too much for that date.
- **Western keyframe limit.** The 12-keyframe cap merges some steps:
  - 2nd Ypres (May 1915) first appears in the 1916-07-11 key, so the shrinking Ypres salient and the Verdun bulge are interpolated across 1915.
  - The Lys and Michael bulges appear together on 1918-04-29.
  - The Aisne/Marne bulge appears on 1918-07-17, so the 27 May Aisne drive is interpolated.
  - Cambrai (Nov–Dec 1917) is net zero and not drawn.
- **East.** Between 1916-09-20 and 1917-09-05 the Kerensky offensive's brief gains (July 1917) are not keyed, and the line interpolates from the Brusilov line to the Zbruch line. The Russian invasion of East Prussia in August 1914 appears only as the Tannenberg arrow. The Dec 1914 Russian foothold in East Prussia is dropped from the occupation ring because only one ring is kept.
- **Brest-Litovsk.** The 3 March 1918 line (Narva–Pskov–Polotsk–Borisov–Rogachev–Kiev–Dniester) is approximate, because the advance into Ukraine was still going on. The 8 May 1918 occupation uses the USMA "limit of occupation" line through Orsha, Gomel, Belgorod and Rostov, and includes Crimea. It keeps that extent to 11 Nov 1918, though German forces began leaving Ukraine only after the armistice.
- **Romania.** The 1916-09-15 line puts the Romanian advance into Transylvania, near Odorhei and Făgăraș and short of Sibiu. Dobruja positions follow the Rasova–Cobadin–Tuzla line. After January 1917 the Siret line (Oituz–Mărășești–Galați–Danube delta) is held until the Treaty of Bucharest (7 May 1918) and Romania's re-entry on 10 Nov 1918.
- **Salonika.** The Albanian sector (Italians from Valona to Lake Ohrid) is included only from the 19 Nov 1916 keyframe. The 1918-10-12 and 1918-11-01 keys are schematic lines across Serbia for the Allied advance to Niš and Belgrade. Bulgaria's occupation of Greek eastern Macedonia (Kavala, 1916) is not drawn as an occupation.
- **Italy.** An "Italian-held Austrian borderlands" occupation (the Isonzo strip, Cortina, Ala, and Trentino in Nov 1918) was tried and dropped. At this scale, mismatches between the traced border and the basemap swamped the real areas. The 4 Nov 1918 line is approximate (Trento, Cadore, Tagliamento). Trieste, taken by sea on 3 Nov, is outside it.
- **Gallipoli.** The beachhead lines are schematic, a few hundred metres to 2 km accurate. Evacuation is shown by collapsing each line onto its beach (Anzac/Suvla 20 Dec 1915, Helles 9 Jan 1916).
- **Palestine/Syria.** The Allied-held area south of the front includes Transjordan and desert east to the front's inland end, though much of it was held by Arab forces or by nobody. Hejaz is excluded.
- **Mesopotamia.** The British-held area also takes in the desert west of the Euphrates column. The Kirkuk area (taken in May 1918, then evacuated, retaken October 1918) is simplified.
- **Caucasus.** Shown:
  - the Ottoman Sarikamish incursion (2 Jan 1915)
  - the Van/Malazgirt bulge (July 1915)
  - Erzurum (Feb 1916)
  - the Trebizond–Erzincan–Mush–Bitlis–Van high-water line (Aug 1916), held until Feb 1918
  - the Ottoman return to the 1914 border (Mar 1918)
  - the May 1918 line at Batum–Akhaltsikhe–Alexandropol–Sardarabad–Nakhchivan

  The advance to Baku (Sept 1918) is not drawn. Russian operations in northern Persia are not drawn.
- **Not included.** German colonies (an optional item) and naval operations, except a battle marker for Jutland.
- **Casualty caveats.**
  - Gorlice–Tarnów sources range from 300,000 to over 1.08 million, so the text says so and `casNum` uses 500,000.
  - For Caporetto the casualty list gives only 60,000, which excludes prisoners. The text instead uses the article's infobox: 13,000 Italian dead, 30,000 wounded and 265,000–275,000 captured, plus c. 70,000 Austro-German.
  - For Megiddo only Allied losses are quantified (c. 5,300). The infobox says the Ottoman armies were destroyed or captured, and `casNum` reflects only the Allied figure.
  - For Vittorio Veneto the infobox totals are 40,917 Allied and 528,000 Austro-Hungarian (448,000 captured). The text rounds to "over 400,000 captured".
