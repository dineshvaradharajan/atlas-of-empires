# Storyboard: First Crusade (1096–1099)

File: `content/cinema/first-crusade.json`. 6 chapters, 28 claims (all pass), 16 occupied areas (44 keyframes), 13 arrows, 7 battles, no fronts.
Check: `check_history.py`: 0 errors, 0 warnings. `validate.py`: 3 errors, all "side" – see below.

## Chapters and why
1. **The People's Crusade** (Aug–Oct 1096): Civetot camp, Xerigordos (taken, surrendered 29 Sep), massacre 21 Oct.
2. **Nicaea and Dorylaeum** (Apr–Jul 1097): siege, surrender to Byzantium (19 Jun), Dorylaeum (1 Jul).
3. **Across Anatolia** (Jul–Oct 1097): Iconium, Heraclea, Tancred and Baldwin in Cilicia (Tarsus, Adana, Mamistra), Marash, arrival at Antioch (20 Oct).
4. **The siege of Antioch** (Oct 1097 – Jul 1098): Turbessel, Edessa (10 Mar 1098), Antioch taken (3 Jun), Kerbogha beaten (28 Jun).
5. **Ma'arra and the road south** (Nov 1098 – May 1099): Ma'arra stormed and abandoned (13 Jan 1099), march south, Arqa (14 Feb – 13 May).
6. **Jerusalem and Ascalon** (May–Aug 1099): Ramla (3 Jun), Bethlehem (6 Jun), siege from 7 Jun, storm 15 Jul, Ascalon 12 Aug.

## How it is drawn
- The march from Constantinople to Antioch and on to Jerusalem: arrows plus a moving circle for "the crusader army on the march" (Anatolia 1097, and Ma'arra → Arqa → coast 1099), so arrowheads end on held ground.
- Crusader holdings as side-0 areas: Nicaea and the Byzantine reconquest of western Asia Minor (1097–98, Byzantium is a side-0 member in 1097–98), Cilicia, the Antioch camp and city, Baldwin's Turbessel/Edessa, al-Bara, Ma'arra, Ramla–Bethlehem–Jerusalem.
- **Fatimid Palestine is side 2** (three areas from Aug 1098: coast and Galilee, Jerusalem and Judea, Ascalon and the south). The Fatimids are the war's third side; no base-map year 1096–1099 shows them in Palestine.
- `baseYears`: 1 Jan – 14 Jul 1099 uses 1098 borders (the 1099 data already shows the Kingdom of Jerusalem).
- Geometry from the Commons maps "Map of First Crusade" and "County of Edessa 1098–1131".

## Uncertainties and choices
- The base map labels the Syrian emirates "Hamdanid Emirates" and they are not a side, so Aleppo and Ma'arra (under Ridwan of Aleppo) show as neutral; claims there were dropped.
- The extent of Fatimid control in 1098–99 (especially Galilee and the inland hills) is approximate; the start date is "by end of August 1098" for the capture of Jerusalem.
- Xerigordos's position uses the Wikidata coordinate on its article (near Nicaea); its exact site is unknown.
- Jerusalem casualties use the article's range 3,000–10,000 (casNum 6,500); Ascalon uses the contemporary Muslim figure 12,700.

## Validator and warnings
- `validate.py` rejects the three side-2 Fatimid areas because it only allows sides 0 and 1 (a World War I assumption); the app colours side 2 correctly (checked in the browser at #w/first-crusade/c6). Fix: allow `range(len(war sides))`.
- `check_history.py`: no warnings.

## Sources fetched
Wikipedia: First Crusade, People's Crusade, Siege of Xerigordos, Siege of Nicaea, Battle of Dorylaeum (1097), Siege of Antioch, County of Edessa, Baldwin I of Jerusalem, Tancred of Galilee, Siege of Ma'arra, March from Antioch to Jerusalem during the First Crusade, Siege of Jerusalem (1099), Battle of Ascalon; Commons maps listed in the file.
