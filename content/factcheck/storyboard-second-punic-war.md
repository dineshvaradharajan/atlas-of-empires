# Storyboard: Second Punic War (218–201 BCE)

File: `content/cinema/second-punic-war.json`. 7 chapters, 59 claims (all pass), 25 occupied areas (60 keyframes), 22 arrows, 10 battles, no fronts.
Check: `check_history.py`: 0 errors, 4 warnings (grey ground, see "Grey pockets"). `validate.py`: no errors.

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

## Roman control in Italy, 213–203 BCE
From 212 BCE the base map paints all of southern Italy Carthaginian, Latin colonies included. The Roman area (now "Italy loyal to Rome, and its recoveries from Hannibal (from 216 BCE)", no end date) grows in dated keyframes:
- 216: the Pentri, the Frentani coast and the Latin colonies of Luceria and Beneventum are loyal from Cannae on. The colonies were loyal (Benevento was "one of the eighteen Latin colonies" still supplying troops in 209), so I drew them in, but only Beneventum has a claim.
- Jul 213: Arpi retaken by Fabius Maximus the younger (claims: Arpi held by Hannibal on 1 Mar 213, Roman on 1 Sep 213; Wikipedia: Arpi). Venusia and Canusium are joined through Ausculum. Herdonea, Salapia and Cannae stay Hannibal's.
- Sep 211: Capua and Campania retaken (the existing area; claim on 15 Oct 211).
- Jul 210: Salapia returns to Rome (claim on 1 Sep 210; Wikipedia: Salapia). Herdonea was destroyed by Hannibal that year.
- 209: Tarentum retaken (the existing circle; claim on 1 Sep 209, Wikipedia: Battle of Tarentum (209 BC)). From Oct 209 the area also covers the Hirpini and Caudine Samnites, joining Campania (Wikipedia: Hannibal, "the gradual reconquest by the Romans of Samnium and Lucania").
- Oct 207: after the Metaurus, Hannibal gives up everything outside Bruttium (Wikipedia: Battle of the Metaurus and Metapontum; claim: Metapontum Roman, 1 Mar 206). Hannibal's southern area gets a new keyframe that shrinks it to Bruttium. Thurii and Croton stay with him (claim: Croton, 1 Sep 203, Wikipedia: Hannibal).
- 205: Locri taken by Scipio. It is a Roman circle listed before Hannibal's Bruttium so that it shows through (claim on 1 Sep 205, Wikipedia: Scipio Africanus).
- Venusia, Bovianum and Beneventum have claims on 30 Oct 211, and Venusia again on 1 Jun 208. Abellinum (Hirpini) has a claim as Hannibal's on 17 Mar 213, which explains the Hirpini pocket.
- Not drawn: Bruttium's surrender after Hannibal left in autumn 203. From the -203 base map onward, Croton still shows Carthaginian and Thurii and Locri grey.

## Grey pockets (neutral or unrecorded ground)
- Ch 2, Placentia and Cremona: the notch in the Gallic area showed grey base ground. The colonies' area now fills the notch and Placentia's plain. Grey left: the Apennines south of Placentia (Ligurian hills, unrecorded on the base map), about 1,200 km². They are not shown as Roman or Gallic: no source.
- Ch 1, the Alps north of Lake Como (Raetian valleys, unrecorded): left. They lie outside the Gallic revolt.
- Ch 5, the Pyrenean foothills north of the Roman area in north-east Iberia (unrecorded): left. Rome held the coast, not the mountains.
- Ch 6, the Ligurian Alps south of the Gallic area near Cuneo (unrecorded): left. The Ligurians are not drawn as a side's area.

## Sources fetched
Wikipedia: Second Punic War, Hannibal's crossing of the Alps, Siege of Saguntum, Battle of Cissa, Battle of Ticinus, Battle of the Trebia, Battle of Lake Trasimene, Battle of Cannae, Siege of Capua (211 BC), Battle of Tarentum (212 BC), Siege of Syracuse (213–212 BC), Battle of Ibera, Battle of the Upper Baetis, Battle of New Carthage, Battle of Ilipa, Battle of the Metaurus, Hasdrubal Barca, Piacenza, Battle of Utica (203 BC), Battle of the Great Plains, Battle of Zama, Hannibal, Scipio Africanus; Commons maps listed in the file.
