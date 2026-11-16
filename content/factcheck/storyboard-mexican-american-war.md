# Storyboard: Mexican–American War

File: `content/cinema/mexican-american-war.json` (built 25 April 1846 – 30 May 1848). Checks: `validate.py` no errors;
`check_history.py mexican-american-war` 0 errors, 2 warnings (explained below), all 58 claims green.
Counts: 9 chapters, 58 claims, 15 occupied areas with 84 keyframes, 41 arrows, 22 battles, no fronts.

## Chapters and why
1. **Taylor on the Rio Grande** (25 Apr – 18 May 1846): the Thornton Affair, the siege of Fort Texas, Palo Alto,
   Resaca de la Palma and the crossing to Matamoros, the opening that led to the declaration of war.
2. **Up the Rio Grande to Monterrey** (18 May – 26 Sep 1846): Camargo, Cerralvo and the three-day battle for Monterrey,
   ending with the armistice.
3. **The conquest of California** (14 Jun 1846 – 13 Jan 1847): Bear Flag Revolt, the navy's seizure of Monterey and
   Yerba Buena, Los Angeles taken, lost to the Californio rising and retaken (San Pasqual, San Gabriel, La Mesa, Cahuenga).
4. **Kearny takes New Mexico** (30 Jun 1846 – 3 Mar 1847): the Santa Fe Trail, Santa Fe without a shot, Doniphan's
   march to El Paso and Chihuahua, and the Taos Revolt. Placed after California because chapters are ordered by start
   date (the Bear Flag Revolt began before Kearny set out); the California text says Kearny came from New Mexico.
5. **Saltillo and Buena Vista** (13 Nov 1846 – 28 Feb 1847): Saltillo occupied, Wool's column, Taylor stripped of
   regulars, Santa Anna's march north and Buena Vista.
6. **The landing at Veracruz** (9 – 30 Mar 1847): Collado Beach, the siege line and the surrender.
7. **From Cerro Gordo to Puebla** (2 Apr – 16 May 1847): the National Road, Cerro Gordo, Jalapa, Perote, Puebla.
8. **The fall of Mexico City** (7 Aug – 15 Sep 1847): round Lake Chalco, Contreras, Churubusco, Molino del Rey,
   Chapultepec, entry into the capital.
9. **Occupation and peace** (15 Sep 1847 – 30 May 1848): siege of Puebla, Huamantla, the garrisons on the road to the
   coast, Querétaro, the Treaty of Guadalupe Hidalgo and the exchange of ratifications.

## How the map is drawn
- **Base borders:** `baseYears` uses 1847 borders for the whole war. The 1846 data draws a "California Republic" over
  the San Francisco Bay area for the whole year (neutral until 14 June, then US-coloured), and the 1848 data already
  shows the cession (California American, New Mexico and the Nueces Strip blank). In the 1847 data Texas is American,
  the Nueces Strip and all of Mexico Mexican.
- **No fronts:** US-held ground is drawn as side-0 occupied areas that grow with each advance, as the brief asks.
  Separate areas are used only where the ground really was separate (northeast Mexico, Tampico, New Mexico, Doniphan's
  column at El Paso and later Chihuahua, northern California, Monterey for its first three weeks, southern California,
  Veracruz, the National Road, Puebla, the Valley of Mexico and the autumn 1847 posts).
- **Californio rising:** a side-1 area, "Californio-held southern California (September 1846 – January 1847)", shows the
  ground the Californios retook. It is needed because the 1847 border data covers only parts of Alta California (the
  Bay Area to Monterey, a patch round Los Angeles and the San Diego edge). Elsewhere the province is unrecorded land, on
  which the US areas still draw (the app paints occupation on any land that is not the occupier's own). It shrinks as
  Frémont (from the north) and Stockton and Kearny (from San Diego) advance, and ends at Cahuenga.
- **Taos Revolt:** the New Mexico area pulls back south of Santa Cruz de la Cañada on 20 January 1847 and moves north again
  after Cañada (24 Jan), Embudo Pass (29 Jan), Mora (1 Feb) and Taos Pueblo (3–5 Feb).
- **The National Road:** a corridor drawn 9 km either side of the road, extended to Plan del Río, Cerro Gordo, Jalapa,
  Perote and (from 1 May) to Puebla on 15 May. It ends on 7 August, when Scott "abandoned his line of communications".
  A new corridor from Veracruz through Puebla and Río Frío to Mexico City appears on 1 November 1847, for the garrisons
  the main article lists "by November".
- **Maps traced:** the Commons campaign map *Mexican–American War-en.svg* (routes of Taylor, Wool, Kearny, Doniphan,
  Scott and the Pacific Squadron) and its Scott's-campaign inset, plus places and dates from the cited articles
  (infobox coordinates for Palo Alto, Resaca, Thornton Affair, Cerro Gordo, Chapultepec, San Pasqual, La Mesa,
  Dominguez Rancho).

## Uncertainties and judgment calls
- **Jalapa in summer 1847:** Jalapa was in fact given up some weeks before Scott left Puebla. No fetched source gives
  the date, so the road is drawn held until 7 August, the sourced date when Scott cut loose from the coast.
- **Nueces Strip:** drawn US-held from the start of the war east of about 98° W (Taylor's march from Corpus Christi to
  the Rio Grande) and in full east of 99° W once Taylor moved up river to Camargo; the western strip by Laredo stays as
  the base map draws it (Mexican).
- **Mexican crossing in May 1846:** the US area is not carved around Arista's army between Fort Texas and Point Isabel,
  because Fort Texas held out inside that ground; the crossing is shown by an arrow (see warnings).
- **Santa Barbara** fell to the Californios on 1 October 1846, two days after Los Angeles; the southern US area shrinks
  to San Diego by 29 September and ends on 1 October, so Santa Barbara goes about two days early.
- **Victoria** (occupied about 25–29 December 1846) and Taylor's other 1846–47 posts in Tamaulipas are not drawn:
  the sources disagree on the date and do not say how long it was held. **Tampico** (taken by the navy 15 November 1846)
  is drawn as a small area but is outside every chapter's frame.
- **Dates that disagree:** Scott's march inland: the Cerro Gordo article says 2 April, the CMH-based campaigns article
  8 April; the text says "early April" and the corridor starts on 2 April. Ratifications: the main article says 26 May,
  the National Archives 30 May; 30 May is used. Kearny reached Santa Fe on 15 August and proclaimed himself governor
  on 18 August; the text and map use 18 August (also the campaigns article's date for the capture).
- **Battle of the Sacramento (28 Feb 1847):** in the text and on an arrow, but not a battle marker: no fetched source
  gives casualty figures (the Wikipedia infobox has none).
- **Casualties** are taken from the battle articles' infoboxes; where only US losses are known (Siege of Puebla,
  Huamantla) `casNum` is the US figure.

## Warnings left (2)
- `arrow 'Arista's army crosses the Rio Grande below Matamoros (30 April – 8 May 1846)' ends ... on United States
  ground`: deliberate. Arista's army crossed into the US-held strip and was beaten at Palo Alto and Resaca; the arrowhead
  stops at Palo Alto, where the attack was turned back. The checker allows this as a warning for wars without fronts.
- `chapter 6 'The landing at Veracruz': little visible change (566 km²)`: the siege line was only about 7 miles
  long and the city small, so the honest area is small. It is drawn growing from the beachhead (9 Mar) to the siege
  line (13 Mar) to the surrendered city (29 Mar). Enlarging it to pass the 1,500 km² test would overstate what
  Scott held.

## Sources fetched (all read in this session)
Wikipedia (raw wikitext via `index.php?action=raw`):
Mexican–American War; Mexican–American War campaigns; Thornton Affair; Siege of Fort Texas; Battle of Palo Alto;
Battle of Resaca de la Palma; Battle of Monterrey; Battle of Buena Vista; John E. Wool; Zachary Taylor; Ciudad Victoria;
Conquest of California; California Republic; Battle of Monterey; Siege of Los Angeles; Battle of Dominguez Rancho;
Battle of San Pasqual; Battle of Río San Gabriel; Battle of La Mesa; Treaty of Cahuenga; Army of the West (1846);
Capture of Santa Fe; Taos Revolt; Battle of Cañada; Battle of Embudo Pass; Siege of Pueblo de Taos; Battle of El Brazito;
Battle of Sacramento (Mexico); Alexander William Doniphan; Siege of Veracruz; Battle of Cerro Gordo; Puebla (city);
Battle of Contreras; Battle of Churubusco; Battle of Molino del Rey; Battle of Chapultepec; Battle for Mexico City;
Siege of Puebla (1847); Battle of Huamantla; Treaty of Guadalupe Hidalgo.
Other: Office of the Historian, https://history.state.gov/milestones/1830-1860/texas-annexation ; National Archives,
https://www.archives.gov/milestone-documents/treaty-of-guadalupe-hidalgo ; Commons map
https://commons.wikimedia.org/wiki/File:Mexican%E2%80%93American_War-en.svg .
Not usable: britannica.com (HTTP 403), an nps.gov/paal battle page (404), es.wikipedia Sacramento (not found); none cited.
