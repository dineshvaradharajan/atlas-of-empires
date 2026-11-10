# Storyboard: Second Punic War (218–201 BCE)

File: `content/cinema/second-punic-war.json`. 7 chapters, 47 claims (all pass), 24 occupied areas (49 keyframes), 22 arrows, 10 battles, no fronts.
Check: `check_history.py`: 0 errors, 0 warnings. `validate.py`: no errors.

## Chapters and why
1. **Over the Alps** (May–Dec 218): New Carthage → Saguntum → Pyrenees → Rhône → Alps → Taurini; Gallic revolt; Ticinus, Trebia; Placentia holds; Scipio lands at Emporion, Cissa.
2. **Trasimene and Cannae** (Mar 217 – Aug 216): Apennines, Trasimene (21 Jun 217), Fabius, Cannae (2 Aug 216).
3. **Italy divided** (Aug 216 – Oct 211): defections (Capua, Bruttium, Locri 215), Nola holds, Tarentum (212), march on Rome and fall of Capua (211).
4. **Syracuse and Sicily** (Jun 214 – Dec 210): siege of Syracuse 213–212, Agrigentum 213–210.
5. **Scipio wins Spain** (Apr 211 – Oct 206): Upper Baetis, New Carthage (early 209), Baecula, Ilipa, Castulo.
6. **Hasdrubal and the Metaurus** (Apr–Jun 207): Hasdrubal over the Alps, Nero's march, Metaurus.
7. **Scipio in Africa and Zama** (Jun 204 – Apr 201): Castra Cornelia, Utica, Hadrumetum, Zama, peace.
The First Macedonian War is left out (no chapter; no territorial change worth a map).

## How it is drawn
- "Hannibal's hold on southern Italy": the base map already shows a Carthaginian south from 216/212; it is corrected with areas where it lags or errs: Bruttium/Lucania/Locri from Oct 216–Aug 215 (base shows them Roman until 213), Etruria–Umbria–Picenum kept Roman 216–213 (base wrongly shows Hannibal's 217 route as Carthaginian), Capua retaken Sept 211 (base: 208), Tarentum city 212–209, Nola held for Rome.
- Before Cannae a moving circle marks "ground held by Hannibal's army" (217–216); likewise Hasdrubal's army in 207. The chapter text says these circles are not conquests.
- Cisalpine Gauls (Boii from June 218, Insubres/Taurini from Nov 218) are a side-1 area with a notch that keeps the Roman colonies Placentia and Cremona Roman.
- "Rome's conquest of Spain": a growing Roman area in the north-east (Emporion → Tarraco/Ebro → coast towards Saguntum 208), New Carthage as its own enclave from March 209; after Ilipa, `baseYears` uses the 203 BCE borders from 15 May 206 to 31 Dec 204 (the 206–204 data still shows Carthaginian Spain). This also keeps every coordinate east of 5°W, inside `validate.py`'s hard-coded box.
- `baseYears` 1 Jan – 2 Aug 216 uses 217 borders (the 216 data already shows the post-Cannae defections).
- Africa: Scipio's beachhead grows from Castra Cornelia (204) to the lower Bagradas (203) and towards Zama (202); Carthage, Utica and Hadrumetum are side-1 circles (unrecorded points on the base map).
- Geometry from the Commons maps "Hannibal route of invasion", "Second Punic War battles", "Rome and Carthage at the start of the Second Punic War" and "Hannibal's travels".

## Uncertainties and choices
- Days are approximate for spring/summer/autumn events (Cissa, Ilipa, Upper Baetis, Hasdrubal's march, Scipio's landing). Zama uses the traditional 19 Oct 202.
- The Piacenza article dates Hasdrubal's failed siege of Placentia to "209 BC"; it was 207 (Livy); I cite the article only for Placentia holding out.
- Saguntum's Roman recapture (c. 212) is not claimed (no fetched source); its Carthaginian circle simply ends in 212.
- Ilipa's casualty figure is the ancient total (Roman 7,000; Carthaginian "over 48,500" per the article), casNum 55,000.
- Numidia appears Roman on the base map 212–204 and Massinissa is not a listed side, so no Numidian claims.

## Warnings left
None.

## Pockets fixed
The checker's pockets rule (stray enemy ground inside or between one side's areas) found 3 errors and 2 warnings; now 0 and 0.
- Ch 2 and 3, Pentrian Samnium (Bovianum, 216 and 213 BCE): a base-map error, not a holdout. The base map paints all Samnium Carthaginian after Cannae, but Livy (22.61) says every Samnite people except the Pentri went over. The Roman loyal area now also covers Pentrian Samnium (renamed "Etruria, Umbria, Picenum and Pentrian Samnium, loyal to Rome"); claims at Bovianum (Wikipedia: Pentri).
- Ch 2 and 3, Capua and northern Campania: real Carthaginian ground (Capua defected after Cannae) that the Pentri fix left between Rome's areas and Nola; claims at Capua on 1 Dec 216 and 17 Mar 213 (Wikipedia: Siege of Capua (211 BC)).
- Ch 2, Placentia and Cremona (Dec 217): real holdouts inside the Gallic revolt; claim at Placentia, 1 Dec 217 (Wikipedia: Piacenza: supplied by river while Hannibal held the countryside).
- Ch 3, Venusia (213): a real holdout ("faithful to Rome throughout the Hannibalic wars", Wikipedia: Venosa). Hannibal's southern area had swallowed the town; its edge now passes south of Venusia, and a claim checks it.
- Ch 7, Scipio's beachhead (Nov 203): real Roman ground next to Carthage; claim at Tunes, where Scipio camped after the Great Plains (Wikipedia: Battle of the Great Plains). Utica, which the beachhead had covered since 203 although it was never taken, is now left out through a narrow inlet from the coast; claim at Utica, 1 Jun 203 (Wikipedia: Battle of Utica (203 BC)).

## Sources fetched
Wikipedia: Second Punic War, Hannibal's crossing of the Alps, Siege of Saguntum, Battle of Cissa, Battle of Ticinus, Battle of the Trebia, Battle of Lake Trasimene, Battle of Cannae, Siege of Capua (211 BC), Battle of Tarentum (212 BC), Siege of Syracuse (213–212 BC), Battle of Ibera, Battle of the Upper Baetis, Battle of New Carthage, Battle of Ilipa, Battle of the Metaurus, Hasdrubal Barca, Piacenza, Battle of Utica (203 BC), Battle of the Great Plains, Battle of Zama, Hannibal, Scipio Africanus; Commons maps listed in the file.
