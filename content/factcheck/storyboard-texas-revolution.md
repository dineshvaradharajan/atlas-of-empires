# Storyboard: Texas Revolution (1835–1836)

File: `content/cinema/texas-revolution.json`. 6 chapters, 41 claims (all pass), 5 occupied areas (38 keyframes), 28 arrows, 12 battles, no fronts.
Check: `validate.py` 0 errors; `check_history.py` 0 errors, 0 warnings.

## Chapters and why
1. **Gonzales and the Gulf Coast** (2 Oct – 4 Nov 1835): the cannon at Gonzales (2 Oct), the capture of Goliad (10 Oct) that cut Cos off from the coast, and the raid on Fort Lipantitlán (3–4 Nov) that left the Texians holding the Gulf Coast.
2. **The siege of Béxar** (12 Oct – 20 Dec 1835): Austin's march, Concepción (28 Oct), the siege, the storming (5–9 Dec), Cos's surrender (10 Dec) and departure (14 Dec). Overlaps chapter 1 in time: a separate place.
3. **Santa Anna's march and the Alamo** (12 Feb – 6 Mar 1836): Guerrero crossing (16 Feb), Béxar occupied (23 Feb), siege and assault (6 Mar); the declaration of independence (2 Mar) is mentioned but happens outside the frame.
4. **Urrea's coastal campaign and Goliad** (17 Feb – 27 Mar 1836): San Patricio, Agua Dulce, Refugio, Coleto, Victoria, the Goliad massacre. Overlaps chapter 3 in time: a separate place.
5. **The Runaway Scrape** (11 Mar – 13 Apr 1836): Gonzales burned (13 Mar), retreat to the Colorado and the Brazos, Groce's Landing (from 31 Mar); Gaona to Bastrop, Santa Anna into San Felipe (7 Apr), Urrea to Matagorda (13 Apr).
6. **San Jacinto** (12 – 22 Apr 1836): Thompson's Ferry, the dash to Harrisburg and New Washington, Houston's march to Lynch's Ferry, the battle (21 Apr), Santa Anna's capture (22 Apr), Urrea at Columbia and Brazoria. The storyboard ends on 22 April; the Mexican withdrawal (late April – June) is not drawn.

## How it is drawn
- Side 0 has no realm until the Republic of Texas joins on 2 March 1836 (its `fromDate`), so Texian-held ground before that is the occupied area "Texian-held Texas (Oct 1835 – Mar 1836)", which ends on 2 March. On the 1835 base it grows from the colonies east of the Guadalupe (2 Oct) to the San Antonio River and Copano (10 Oct), the approaches to Béxar (20 Oct) and the Nueces (4 Nov); after Cos left (14 Dec, "no longer an organized garrison of Mexican troops in Texas") it covers the whole of Texas as the 1836 base draws it, so the hand-over to the Republic of Texas on 2 March is seamless.
- A small area "Texian lines round Béxar" (28 Oct – 9 Dec 1835) is a C-shape round the town, open to the west, so Concepción (2 mi south) is Texian while the town holds out.
- From 1 Jan to 1 Mar 1836 the 1836 base draws the Republic of Texas, which is on no side until 2 March; the Texian area covers it, and Mexican areas are drawn on it from 17 Feb.
- Mexican areas: "Mexican-held ground in Texas (1836)" (17 keys, 17 Feb – 22 Apr) follows Santa Anna's, Ramírez y Sesma's, Gaona's and Urrea's columns; its southern half lies on Mexico's own ground and is not drawn. "Mexican siege lines round the Alamo" (23 Feb – 6 Mar) is a ring with a hole, so the Alamo itself stays Texian until the assault while Béxar town is Mexican (backed by claims). "Santa Anna's column from the Brazos" (14–21 Apr) is a narrow corridor from Thompson's Ferry to Harrisburg, New Washington and the San Jacinto camp, ending with the battle.
- No `baseYears`: 1835 borders in 1835, 1836 borders in 1836.
- Geometry follows the A. J. Houston 1938 "Military movements" map (Texan and Mexican frontier lines of 1835, routes to San Jacinto), the 1928 "Campaigns of the Texas Revolution" map and the "Routes of Santa Anna's and Houston's armies" map, with dates and places from the cited articles. Coordinates from article infoboxes (Gonzales, Concepción, Grass Fight, Alamo, Lipantitlán, San Patricio, Agua Dulce, Refugio, Coleto, Goliad, San Jacinto); others (Groce's Landing, Thompson's Ferry, Harrisburg, New Washington) are approximate.

## Map data gaps
- The 1836 base draws Texas south only to roughly the Nueces/Medina line, with San Patricio and Lipantitlán outside it; the Texian area includes a lobe there from November 1835 until San Patricio fell on 27 February 1836.
- The 1835 and 1836 eastern borders differ slightly along the Sabine and Red River; the Texian area is pulled in a few kilometres there so it is never drawn on the United States. The coast in the base map is coarse (Copano and Galveston sit on its edge).

## Uncertainties and choices
- Texian "control" in Oct–Dec 1835 is drawn as the settled, rebel-held country; the Comanche plains are included only after December because the base map's Republic of Texas includes them from March.
- Mexican control between the columns (the brush country between Béxar and San Patricio, the land between the Guadalupe and the Colorado in late March) is drawn as one continuous area: the Texians had evacuated it, but it was not garrisoned.
- Gaona's route and dates are loose (ordered to Mina on 24 March, occupied Bastrop into early April, reached Old Fort on 19 April); the area keeps the Bastrop salient to the end of the storyboard.
- Thompson's Ferry: sources put the crossing on 12 April (Runaway Scrape article, TSHA Day by Day) or complete by 14 April (state marker); keyframe 13 April, claim 14 April.
- Casualty ranges kept as ranges: Concepción Mexican dead 14–76; Alamo defenders 182–257, Mexican 400–600 killed and wounded (official 60 killed, 250 wounded); Refugio Mexican 150–600; Coleto Texian 51–67 wounded; storming of Béxar Texian 4–6 killed, 14–35 wounded (Barr vs Hardin).
- Brazoria taken 22 April and Columbia 21 April (TSHA Goliad Campaign entry); Victoria 21 March; Matagorda 13 April.

## Warnings left
None.

## Sources fetched
Wikipedia (raw wikitext): Texas Revolution, Battle of Gonzales, Battle of Goliad, Battle of Lipantitlán, Battle of Concepción, Grass Fight, Siege of Béxar, Battle of the Alamo, Battle of San Patricio, Battle of Agua Dulce, Battle of Refugio, Battle of Coleto, Goliad massacre, Goliad Campaign, Runaway Scrape, Battle of San Jacinto, Treaties of Velasco, Texian Army, Antonio Gaona (general).
Handbook of Texas (TSHA): Texas Revolution, Goliad Campaign of 1836, Urrea, José de, Filisola, Vicente, Runaway Scrape.
Wikimedia Commons (file pages and images): Military movements during the Texas Revolution.jpg (A. J. Houston, 1938), Campaigns of the Texas Revolution.jpg (Pageant of America, 1928), Routes of Santa Anna's and Houston's Armies 1836.jpg.
Web search only (not cited): Thompson's Ferry location (Texas Historical Commission atlas, marker in Richmond).
