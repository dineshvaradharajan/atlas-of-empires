# Storyboard: Hundred Years' War (`content/cinema/hundred-years-war.json`)

Sides follow `content/wars/a-early.json`: **0 = England and allies** (Burgundy 1419–1435), **1 = France and allies**.
Check (`tools/cinema/check_history.py hundred-years-war`): **0 errors, 69/69 claims green, 4 warnings** (explained below).
11 chapters, 12 occupation areas with 74 keyframes, 36 arrows, 16 battles, no fronts (there was never a continuous line).

## Chapters and why
| # | id | dates | why |
|---|----|-------|-----|
| 1 | crecy-calais | 12 Jul 1346 – 4 Aug 1347 | Edward III's Normandy campaign, Crécy, and Calais (the one lasting gain, English to 1558). The 1339–40 Flanders campaigns were left out: Tournai, Cambrai, Saint-Omer and Calais lie in shapes the border data gives to Flanders/Artois, so nothing on the map could show them. |
| 2 | black-prince | 5 Oct 1355 – 2 Oct 1356 | The great chevauchée to Narbonne and the Poitiers campaign (John II captured). |
| 3 | bretigny | 28 Oct 1359 – 24 Oct 1360 | Reims campaign and the Treaty of Brétigny/Calais: Aquitaine and Ponthieu in full sovereignty (bbox all France, because the campaign was in the north and the treaty lands in the south-west). |
| 4 | charles-v | 1 Jun 1369 – 31 Dec 1374 | Charles V's and Du Guesclin's piecemeal reconquest; La Rochelle, Poitiers; Gaunt's 1373 raid; by 1374 England back to coastal Gascony and Calais. |
| 5 | agincourt | 13 Aug – 16 Nov 1415 | Harfleur siege, march to Calais, Agincourt. |
| 6 | normandy-1417 | 1 Aug 1417 – 1 Aug 1419 | Conquest of Normandy: Caen, Falaise, Cotentin, Rouen, Pontoise. |
| 7 | troyes | 10 Sep 1419 – 11 Oct 1428 | Montereau murder, Burgundian alliance, Treaty of Troyes, Baugé, Cravant, Verneuil, Maine: English France at its height. |
| 8 | joan-of-arc | 12 Oct 1428 – 8 Sep 1429 | Siege of Orléans, Joan's relief, Loire campaign and Patay, coronation march to Reims, failed attack on Paris. |
| 9 | arras-paris | 21 Sep 1435 – 17 Apr 1436 | Treaty of Arras (Burgundy leaves England), the Pays de Caux rising, Paris retaken. |
| 10 | normandy-1449 | 31 Jul 1449 – 12 Aug 1450 | French reconquest of Normandy: Rouen, Harfleur, Honfleur, Formigny, Caen, Falaise, Cherbourg. |
| 11 | gascony | 1 May 1451 – 19 Oct 1453 | Bordeaux and Bayonne 1451, Talbot's return 1452, Castillon, Bordeaux 1453. |

## Base map and corrections
- **baseYears 1415–1453 → 1414.** The border data's own outlines for these years are wrong in ways occupation areas cannot undo: from 1415 a strip from Harfleur to Calais is English, 1429–39 England includes Brittany, 1440–58 Normandy is a fixed block without Rouen, and the corrections layer trims it differently again. With the 1414 borders, England is only Gascony and Calais, and English-held France is drawn entirely as occupation areas, timed from cited dates. Side effect: other 1415–53 border changes (e.g. Burgundian gains in the Netherlands) are not shown in the war view.
- **Occupation areas (side 0):** Calais siege camp at Nouville (west of the town, from the Siege of Calais article), then the Pale from 3 Aug 1347 until the base map draws it (1352). Reims siege camp (Nov 1359 – Jan 1360). The Brétigny lands (Aquitaine, drawn with the 1363 base-map outline checked against Johnston's *France after the Peace of Brétigny*) and Ponthieu, May–Oct 1360, held until the base map shows them (1363). Harfleur camp and town 1415. **"English-held Normandy, Paris and Maine"**: one area with 33 keyframes from Touques (1 Aug 1417) through Caen, Lower Normandy, Rouen, Pontoise, Paris (Nov 1420), Meaux (May 1422), Maine (1425) and the Loire towns (1428), then shrinking: Loire towns June 1429, Pays de Caux end 1435, Paris April 1436, Caux regained except Dieppe by 1442, Maine handed over 1448, then the 1449–50 collapse to Falaise (gone 21 Jul 1450). A separate north-Cotentin area (Cherbourg) from Oct 1449 to 11 Aug 1450. "Burgundian-held Paris, Champagne and Picardy" from Montereau (10 Sep 1419) to Arras (21 Sep 1435), shrinking when Champagne and then Laon, Soissons and Compiègne went over in July–August 1429. English siege forts at Orléans on the south bank and west (Tourelles from 24 Oct 1428) until 8 May 1429.
- **Occupation areas (side 1):** Brétigny lands retaken by Charles V (six keyframes 1369–1374; by 1374 everything outside the 1337 Gascony line). Ponthieu retaken in 1369 (Abbeville rose in spring 1369; Johnston shows it lost by 1380; the exact date is general knowledge, not a cited claim). "Gascony taken by Charles VII" over the base-map Gascony: Blaye/Bourg in May 1451, Bordeaux on 30 June, Bayonne on 20 Aug, Bordelais lost to Talbot on 23 Oct 1452, the Bordeaux pocket from 13 Aug 1453, all on 19 Oct 1453.
- Mont-Saint-Michel (never taken) and Orléans are left out of the English area by notches; both are backed by sourced claims.

## Maps traced
Johnston, *France in 1429* (Lancastrian obedience boundary, Loire, Champagne, Gascony strip); *La France en 1429* (Commons; English, Burgundian and Bourges zones); (the schematic Commons map *Hundred years war France England 1435* was looked at but not used, as it draws Brittany as English); Johnston, *France after the Peace of Brétigny 1360*; Commons route maps of Edward III's 1346 chevauchée and the Black Prince's 1355 chevauchée (arrow paths follow their dated stops). All are listed in `sources`.

## Uncertainties
- Area edges are schematic (Lancastrian "obedience" was a patchwork of garrisons and enclaves). Known simplifications: Chartres is drawn as lost by 1435 (it fell in 1432); Meaux and the Brie are dropped after August 1429 (Meaux held until 1439); Sens is not tracked after 1429; Louviers and Évreux (lost 1440–41) are not cut out of the 1442 keyframe; Le Crotoy and other isolated garrisons are not drawn.
- The membership file gives Burgundy whole years, so it is coloured as England's ally from 1 Jan 1419 (the alliance came after September 1419) and until 31 Dec 1435 (Arras was 21 September). The great fiefs (Brittany, Flanders, Anjou, Bourbon, Armagnac and others) appear neutral because only the shape named "Kingdom of France" is a member of side 1.
- Calais is not shown as Burgundian-besieged in 1436, and Calais and Ponthieu are not tracked after 1374 beyond the base map.
- Some keyframe dates are general knowledge and carry no claim: Le Mans/Maine 1425, Le Mans handed over in March 1448, the Pays de Caux rising (Oct–Dec 1435), Ponthieu 1369.
- Battle casualties are the ranges in each battle article's infobox. Barnet-style exaggerations don't arise here, but the Rouen figure (12,000) counts civilian deaths.

## Warnings left
1. *Arrow "Edward III's march through Burgundy to Paris and Chartres" ends on French ground.* It is meant to: the army ended the campaign encamped near Chartres while the Brétigny terms were agreed. No area is drawn for the camp.
2. and 3. *Chapters 1 and 5 show little change in area (250 km² and 185 km²).* These chapters really did change little ground: Calais (and its Pale) in 1347, and Harfleur in 1415. Their story is in the arrows and battles.
4. *Chapter 8, 7 Sep 1429: 2,106 km² of French ground between the English area and the Burgundian one, around Beauvais.* This is real: Beauvais, Senlis and Compiègne went over to Charles VII in August 1429 while Paris and Picardy stayed Anglo-Burgundian. A Compiègne claim (Joan of Arc article) is attached, but the gap is centred on Beauvais. I fetched no source for Beauvais's submission, so I left the gap open rather than paint Beauvais English.
