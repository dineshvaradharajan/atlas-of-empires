# Storyboard: Spanish–American War (1898)

File: `content/cinema/spanish-american-war.json`. 7 chapters, 46 claims (all pass), 8 occupied areas (26 keyframes), 32 arrows, 13 battles, no fronts.
Check: `validate.py` 0 errors; `check_history.py` 0 errors, 5 warnings (explained below). Frames rendered with `render_frames.py` and reviewed for every chapter.

## Chapters and why
The war was fought in four theatres thousands of kilometres apart, so each chapter frames one of them. Chapters are ordered by start date, so the Caribbean and Pacific chapters alternate.
1. **The Maine and the blockade of Cuba** (15 Feb – 14 Jun 1898, the Caribbean): the Maine, the blockade (21–22 Apr), Sampson's shelling of San Juan (12 May), Cervera's crossing to Santiago (19 May), Schley's squadron, and the Marine landing at Guantánamo (10 Jun). This chapter is mostly naval, so it has no occupied areas.
2. **Manila Bay and the Filipino rising** (25 Apr – 12 Jun, Manila Bay): Dewey's approach and victory (1 May), the landing at Cavite (2 May), Aguinaldo's return (19 May), Alapan (28 May), the whole of Cavite province by 31 May, the provinces round the bay by 9 June, and the independence proclamation at Kawit (12 Jun).
3. **Daiquirí to San Juan Hill** (20 Jun – 2 Jul, east of Santiago): the landings at Daiquirí and Siboney, Las Guásimas, El Caney, and Kettle Hill and San Juan Hill.
4. **The capture of Guam** (20–22 Jun).
5. **The sea battle and the surrender of Santiago** (3–17 Jul, the Santiago coast): Cervera's sortie and the chase to the Turquino River, the siege, and the surrender of the city and the Santiago district.
6. **Puerto Rico** (21 Jul – 13 Aug): Guánica, Yauco, Ponce, Arroyo and Guayama, Coamo, Silva Heights and Mayagüez, the check at Asomante, and the halt on 13 August.
7. **The Battle of Manila and the armistice** (25 Jul – 13 Aug, Manila): US reinforcements, the secret arrangement with Jáudenes, and the capture of Manila on 13 August, a day after the peace protocol.

## How it is drawn
- **Sides:** side 0 is the United States together with the Cuban Nationalists, as the war file sets them up. Filipino revolutionary areas are also drawn as side 0, because the side is named "United States, with Cuban and Filipino revolutionaries" and the two fought Spain together in 1898. Side 1 is Spain.
- **Base map: `baseYears` = 1897 for the whole storyboard** (15 Feb – 13 Aug 1898). I checked `public/data/clio/index.json`: the Kingdom of Spain and the US have snapshots for 1895–97 and 1898–99. The 1898–99 snapshot already draws Manila (and Malolos), Guam and the Santiago pocket as American for the whole year, while Puerto Rico stays Spanish. The 1895–97 snapshot draws all of them as Spanish, with the Cuban Nationalists holding eastern Cuba around a Spanish pocket at Santiago, which is the correct situation for spring 1898. So I chose the earlier borders and drew every wartime change as an occupied area on Spanish ground, rather than painting Spanish areas back over the wrong 1898 map.
- **Occupied areas (all side 0):**
  - American beachhead and siege lines at Santiago: 8 keys, Daiquirí (22 Jun) → Siboney → Las Guásimas → El Pozo → El Caney and San Juan Heights (1 Jul) → lines north of the city (10 Jul, held until 16 Jul) → the whole Spanish pocket after the surrender (17 Jul). Santiago stays a Spanish pocket until 17 July, and claims back it.
  - US-held Cavite naval station (from 2 May).
  - Filipino revolutionary-held Cavite (24–31 May; it ends on 9 June, when the larger area takes over).
  - Filipino revolutionary-held provinces round Manila (from 9 June): Cavite, Batangas, Laguna, Morong, Bulacan, Pampanga, Bataan and southern Zambales. Manila stays Spanish inside a notch reached by a channel across the bay. The channel is open water, so nothing is drawn there.
  - Filipino revolutionary-held central Luzon (12–30 June, growing to Lingayen Gulf).
  - Guam, surrendered to the United States (from 21 June).
  - US-held southern and western Puerto Rico: 10 keys, 25 Jul – 13 Aug. The last key follows the Wikipedia map of the municipalities under the US flag after the armistice. Aibonito and Asomante stay outside it.
  - US-held Manila (from 13 August).
- **Hold keys:** a copy of the 10 July Santiago ring is set on 16 July, and a copy of the 28 July Puerto Rico ring on 1 August. Without them the areas would creep forward while the lines were really static.
- **Geometry sources:** the Santiago area follows the Commons map "Santiago campaign 1898" (USMA style). Puerto Rico follows "Puerto Rico Expedition.png" (routes) and "Puerto Rico USA-España.png" (municipalities at the armistice). Luzon follows the province lists in the cited articles. Point positions come from article coordinates: Manila Bay, San Juan Hill, the Santiago naval battle, Guam, Alapan, Guantánamo Bay, the Vizcaya and Cristóbal Colón wrecks, and Baler.

## Warnings left (5)
- **4 naval arrows** do not end on their own side's ground. Sampson to Havana and Schley to Santiago end at sea, where no side holds ground. Sampson's shelling of San Juan ends at San Juan, which stayed Spanish. Cervera's sortie ends at the Cristóbal Colón wreck on the Cuban-held coast. All are true to events: blockades and bombardments, not captures.
- **Chapter 7 "little visible change" (123 km²):** this change is real. On 13 August only Manila itself (Intramuros, Binondo, Ermita and Malate) changed hands. The ground around it had been held by Filipino forces since June. Inventing more change would be wrong.

## Uncertainties and choices
- **Filipino control:** the main article lists the provinces held by 9 June, and the Philippine Revolution article says "nearly all of Luzon" except Manila and Cavite port was in Filipino hands by June. I drew only central Luzon, from Batangas to Lingayen Gulf. Mindoro, which the main article lists, is left out, and so is northern Luzon, where some Spanish garrisons held out longer and Baler held out until 1899. The eastern edge (Laguna, Morong and Nueva Ecija against Tayabas) is approximate.
- **Santiago:** the area east of Siboney, up to the Cuban-held hills, is drawn as American from 22–24 June, once the Spanish garrisons of Daiquirí, Siboney and Sigua had withdrawn. The siege lines north of the city (Lawton and García, 2–10 July) are approximate. Guantánamo town, which was in fact Spanish-garrisoned until the surrender, lies on Cuban Nationalist ground in the 1897 borders. I left it that way and placed no claim there.
- **Puerto Rico:** the coastal strip from Ponce to Arroyo is drawn as American from 2 August, so that the area stays one piece. No Spanish force held it. The date of Henry's column at Adjuntas and Utuado is not in the fetched sources, so the arrow only says "(August)" and the area there appears in the 13 August key. The Wikipedia battle list calls Asomante a US victory, but the Puerto Rico campaign article describes two American withdrawals there. I followed the campaign article and kept the pass Spanish. Fajardo (taken and given up between 5 and 9 August) is not drawn.
- **Guam:** it is drawn as American from 21 June, although no garrison was left on the island. The chapter text says so.
- **Casualties:** El Caney's American losses are not given separately in the fetched sources. The battle entry says "several hundred", and the chapter text gives the combined figure for 1 July (more than 200 killed, about 1,200 wounded). At Manila, American dead are given as 6 or 19 in different passages of the same article, so the entry uses a range. Spanish captured at Santiago (sea) are 1,612 to 1,889 depending on the count, given as "some 1,600 to 1,900".
- **Blockade date:** the main article says the blockade began on 21 April and the Office of the Historian says 22 April. The text says "21–22 April".
- **Map grid:** the 1897 borders are coarse (blocky Luzon, Guam and Puerto Rico; a straight-line Cuban coast), so some coastal claim points (Daiquirí, Cavite) sit just offshore of the drawn coast but inside the occupied ring.

## Sources fetched
Wikipedia (raw wikitext): Spanish–American War; USS Maine (1890); Bombardment of San Juan; Battle of Guantánamo Bay; Battle of Manila Bay; Battle of Alapan; Philippine Revolution; Philippine Declaration of Independence; Capture of Guam (1898); Battle of Las Guásimas; Battle of El Caney; Battle of San Juan Hill; Battle of Santiago de Cuba; Siege of Santiago; Spanish cruiser Cristóbal Colón; Spanish cruiser Vizcaya; Spanish cruiser Infanta Maria Teresa; Puerto Rico campaign; List of battles of the Spanish–American War; Battle of Manila (1898); Siege of Baler; Ponce, Coamo, Utuado and Mayagüez (Puerto Rico; nothing usable). Battle of El Caney order of battle (via WebFetch; no casualty totals).
Other: Office of the Historian, "The Spanish-American War, 1898" (history.state.gov); Naval History and Heritage Command, Cdr. Charles H. Davis to Capt. Francis J. Higginson, 30 July 1898 (surrender of Ponce on 28 July); Wikimedia Commons maps "Santiago campaign 1898.gif" and "Puerto Rico Expedition.png"; English Wikipedia file "Puerto Rico USA-España.png"; University of Nebraska Cuban Battlefields officers' reports (brigade-level figures only, not cited).
Refused or empty: Britannica (403); Library of Congress "World of 1898" pages (archived copies returned empty).
