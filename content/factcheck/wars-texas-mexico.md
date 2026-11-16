# Wars: Texas Revolution and Mexican–American War

This log covers two war-playback entries, `texas-revolution` (19 events) and `mexican-american-war` (26 events). They were
written to the scratchpad file `wars-mexico.json`, to be merged into `content/wars/` (no repo data file was edited).
Neither war has a matching moment in `content/moments*.json`: the only moments for 1830–1850 are the Liverpool–Manchester
railway, the Opium Wars and the telegraph. So `moment` is `null` for both.

## Member choices

The map matches members against names after corrections (`public/app.js` `warSideOf` checks the drawn name `p.n`, the key `p.k`
and the original name `p.fixed`).

### Texas Revolution (2 Oct 1835 – 21 Apr 1836; final event, Treaties of Velasco, 14 May 1836)
- **Mexico: `Federated Republic of Mexico`, 1835 (fromDate 1835-10-02).** In 1835 the row 1825–1835 has no relabel, so Mexico
  is drawn under this name, even though the centralist turn had begun (the Bases Constitucionales date from October 1835).
- **Mexico: `Centralist Mexico`, 1836 (toDate 1836-05-15).** `corrections.json` relabels the Federated Republic polygons to
  "Centralist Mexico" for 1836–1841, so the realm `Centralist Mexico` covers all Mexican shapes in 1836.
- **Rebels: `Republic of Texas`, 1836 (fromDate 1836-03-02, the declaration of independence; toDate 1836-05-15).** This realm
  has rows for 1836–1845 and no corrections.
- The toDate values are one day after the last event, because `memberOn` uses `t < toDate`. That way the Velasco event still
  shows both sides coloured.
- The Texian/Tejano rebels of Oct 1835 – Feb 1836 have no realm. They are described in the side name and the text.
- The United States was not a belligerent (US volunteers took part, but the government stayed officially neutral), so it is left out.

### Mexican–American War (25 Apr 1846 – 2 Feb 1848; final event, exchange of ratifications, 30 May 1848)
- **US: `United States of America`, 1846–1848 (fromDate 1846-04-25, toDate 1848-05-31).** Texas is already inside the US shape
  from 1846, since the `Republic of Texas` rows end in 1845.
- **US: `California Republic`, 1846 (fromDate 1846-06-14).** This is the Bear Flag shape (15,546 km²), drawn under its own name
  through 1846. US forces held the area from 9 July, so it stays on the US side for the rest of 1846. In 1847 corrections relabel
  it to "Federated Republic of Mexico". Its `to` is 1846, so it then falls into Mexico's colour through the drawn-name match,
  which fits the legal position until 1848.
- **Mexico: `Federated Republic of Mexico`, 1846–1848 (fromDate 1846-04-25, toDate 1848-05-31).** There are rows for 1846–1847
  (2.80M km²) and 1848–1852 (2.09M km², after the cession), with no relabel after 1845. Federalism was in fact restored only in
  August 1846; Paredes's government at the outbreak was centralist.
- **Mexico: `Centralist Mexico`, 1846–1847.** This row is a 639 km² sliver labelled near [-97.65, 24.42], on the Tamaulipas
  coast inside Mexico. It is included only so that sliver is not left uncoloured inside Mexico. In "Sides in 1846/1847" the
  About tab will list "Centralist Mexico" next to the Federated Republic, which is harmless but a bit odd.
- The Californio insurgents (1846–47), the Taos rebels and the Saint Patrick's Battalion have no realms and appear only in the text.

## Map gaps noticed (for maintainers)
- The row `Centralist Mexico` 1846–1847 (639 km²) looks like a leftover fragment and could be relabelled to "Federated
  Republic of Mexico" or hidden.
- 1836–1841: the realm name "Centralist Mexico" is right for 1836. In 1835 Mexico is still drawn as the Federated Republic,
  although the centralist Siete Leyes were adopted in late 1835–1836. This is acceptable at yearly resolution.
- Yearly snapshots: in 1835 Texas is drawn inside Mexico for the whole war's first phase, while the rebels actually controlled
  most of Texas from December 1835. In 1836 the `Republic of Texas` polygon is drawn from 1 January, but it gets a side colour
  only from 2 March.
- There is no realm for the Republic of Yucatán (seceded 1841–1848, neutral in the war), so it is not shown separately.
- The Nueces–Rio Grande strip: the Republic of Texas polygon (374,109 km²) was not checked against the claimed Rio Grande line.
  Mexico's position in 1846 was that the border ran along the Nueces.

## Contested or inconsistent facts, and how they were handled
- **Battle of Gonzales date:** TSHA's Handbook gives 1 October 1835, Wikipedia gives 2 October. Most references and the
  conventional start date use 2 October, so the text uses 2 October.
- **Battle of Concepción:** the Battle of Concepción article gives 28 October 1835 (one reading of the main article gave the 27th).
  The text uses 28 October.
- **Goliad massacre toll:** about 350 (TSHA), about 342 (Texas Revolution article), 425–445 (Goliad massacre article). The text
  says "about 350 by the most common count, with some estimates higher".
- **Alamo:** 182–257 defenders killed; Mexican losses 400–600 killed and wounded (historians' range; the official Mexican report
  gave 60 killed and 250 wounded).
- **San Jacinto Mexican strength:** about 1,200 (Texas Revolution article) or 1,360 (San Jacinto article), so the text gives
  "about 1,200–1,360". Mexican dead: about 650; Texian dead: 11 (TSHA says 9). The Wikipedia figure is used.
- **Mexican army crossing the Rio Grande, 1836:** the vanguard crossed on 12 February (Alamo article), and the army was across
  the Nueces by the 17th. The text says "mid-February" with date "1836-02".
- **Harrisburg burned:** the sources give only mid-April 1836, so the date is "1836-04" with label "Mid-Apr 1836".
- **Casualties, Texas Revolution:** the Texas Revolution article totals are used (about 600 Texian and 1,000 Mexican dead).
- **Kearny at Santa Fe:** the Capture of Santa Fe article is internally inconsistent (arrival 15 Aug; proclamation 18 Aug). The US
  Army (USAICoE) history piece on DVIDS gives the capture as 18 August 1846. The text uses 18 August as the date of taking
  possession.
- **Siege of Los Angeles:** the Conquest of California article gives both 22 and 29 September 1846. The text uses
  "Late Sep 1846" with date 1846-09-29.
- **Veracruz landing strength:** 12,000 (main article) against 8,600 (Siege of Veracruz infobox). The number is left out of the
  text.
- **US Senate vote on the treaty:** 38–14 (Office of the Historian and Wikipedia) against 34–14 (National Archives page). The text
  uses 38–14.
- **Exchange of ratifications:** 30 May 1848 (National Archives) against 26 May (Wikipedia). The text uses 30 May.
- **War casualties:** Wikipedia gives US deaths of about 13,283 (1,733 killed in battle, about 11,550 from disease) and Mexican
  deaths "may have reached 25,000". The casualties line is hedged as "estimated … up to about 25,000".
- **Niños Héroes:** the story that Juan Escutia wrapped himself in the flag is disputed, so the text says only that six who died
  are honoured as the Niños Héroes.

## Pages fetched
Texas Revolution (all 8 are cited in the entry):
- https://en.wikipedia.org/wiki/Texas_Revolution (whole article, three passes)
- https://www.tshaonline.org/handbook/entries/texas-revolution
- https://en.wikipedia.org/wiki/Battle_of_Concepci%C3%B3n
- https://en.wikipedia.org/wiki/Siege_of_B%C3%A9xar
- https://en.wikipedia.org/wiki/Battle_of_the_Alamo
- https://en.wikipedia.org/wiki/Goliad_massacre
- https://en.wikipedia.org/wiki/Battle_of_San_Jacinto
- https://en.wikipedia.org/wiki/Treaties_of_Velasco

Mexican–American War (the first 8 are cited in the entry; the rest were used for checking only):
- https://en.wikipedia.org/wiki/Mexican%E2%80%93American_War (three passes)
- https://history.state.gov/milestones/1830-1860/texas-annexation
- https://www.archives.gov/milestone-documents/treaty-of-guadalupe-hidalgo
- https://en.wikipedia.org/wiki/Conquest_of_California
- https://en.wikipedia.org/wiki/Battle_of_Palo_Alto
- https://en.wikipedia.org/wiki/Battle_of_Buena_Vista
- https://en.wikipedia.org/wiki/Siege_of_Veracruz
- https://en.wikipedia.org/wiki/Battle_of_Chapultepec
- https://en.wikipedia.org/wiki/Battle_of_Churubusco (checking only: Churubusco casualties, San Patricios)
- https://en.wikipedia.org/wiki/Capture_of_Santa_Fe (checking only)
- https://www.dvidshub.net/news/545743/general-kearny-captures-santa-fe-18-aug-1846 (checking only: US Army Intelligence Center
  of Excellence historian; Santa Fe date, Army of the West about 1,600)
- Not found: https://en.wikipedia.org/wiki/Battle_of_Santa_Fe_(1846) returned 404, so it is not cited.

## Details from general knowledge not confirmed on a fetched page (worth a spot-check)
These are standard facts, but the fetched excerpts did not state them outright:
- Taylor reaching the Rio Grande in March 1846.
- Point Isabel as Taylor's supply base.
- Kearny wounded at San Pasqual.
- Robert E. Lee's reconnaissance at Cerro Gordo, and the yellow-fever motive for marching inland.
- Scott's occupation of Puebla and the siege of Puebla.
- The Molino del Rey cannon-foundry belief.
- The flag over the National Palace.
- The Mexican government gathering at Querétaro.
- Santa Anna in exile in Cuba and let through the blockade.
- Fort Brown and Brownsville.
- Coahuila y Texas.
- The Consultation favouring the 1824 constitution.
- The US leaving Mexico City in June 1848.

## Validation
The script is `validate_wars_mexico.py` in the scratchpad. It checks that:
- the JSON parses;
- the ids are exactly `texas-revolution` and `mexican-american-war`, unique, and not already in `content/wars/`;
- the wars are in chronological order;
- events are in date order, with `year` equal to the date's year and inside the span;
- `text` is at most 90 characters and `detail` is 60–110 words;
- the summary is 120–180 words, with 15–30 events and 4–8 sources;
- every member realm exists in `public/data/clio/index.json`, with each year inside its `tl` rows and not relabelled away in
  `corrections.json`;
- reader-facing text uses no map or meta words.

Result: all checks pass.
