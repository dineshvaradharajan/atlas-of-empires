# Storyboard: Spanish conquest of the Aztec Empire (1519–1521)

File: `content/cinema/conquest-of-the-aztec-empire.json`. 7 chapters, 33 claims (all pass), 8 occupied areas (31 keyframes), 17 arrows, 5 battles, no fronts.
Check: `validate.py` 0 errors; `check_history.py` 0 errors, 2 warnings (explained below).

## Chapters and why
1. **Landing on the Gulf coast** (21 Apr – 15 Aug 1519): landing camp opposite San Juan de Ulúa, Villa Rica, the Totonac alliance at Cempoala.
2. **Tlaxcala and Cholula** (16 Aug – 31 Oct 1519): march inland, battles of 2–5 Sep, alliance with Tlaxcala (23 Sep), Cholula massacre (18 Oct).
3. **Moctezuma's guests and captors** (1 Nov 1519 – 23 Jun 1520): entry into Tenochtitlan (8 Nov), Moctezuma held hostage, Narváez beaten at Cempoala (27 May), Toxcatl massacre.
4. **La Noche Triste and Otumba** (24 Jun – 12 Jul 1520): return to the city in revolt, breakout on 30 Jun, retreat round the northern lakes, Otumba (7 Jul).
5. **Regrouping in Tlaxcala** (13 Jul – 25 Dec 1520): Tepeaca campaign, smallpox, death of Cuitláhuac.
6. **Texcoco and the lakeshore** (26 Dec 1520 – 21 May 1521): Texcoco base, Chalco won over, raids round the lakes, Xochimilco.
7. **The siege and fall of Tenochtitlan** (22 May – 13 Aug 1521).

## How it is drawn
- The Aztec Empire is the base map (`Aztec Triple Alliance`, side 1). Its rows end in 1520, so the war member has `to: 1520, toDate: 1521-08-13`, and `baseYears` draws 1520 borders for 1 Jan – 13 Aug 1521 (the 1521 data already shows the Spanish Empire over central Mexico).
- Side 0 areas: landing camp; Villa Rica and the Totonac lands; one growing area for Tlaxcala and its allies (Tlaxcala + Huejotzingo Sep 1519 → + Cholula after the massacre → + Tepeaca Aug 1520 → + Texcoco/Acolhuacan Dec 1520 → + Chalco Mar 1521); the siege ring round the lakes from 26 May 1521.
- The siege ring has a zero-width slit leading to a hole for ground the Mexica still held: the lake and island (26 May), the island (15 Jun – 20 Jul), north Tlatelolco (1 Aug), nothing (13 Aug). The island hole is a real holdout, under the 600 km² pocket threshold, and backed by claims.
- Moving circles mark Cortés's army on the march (Aug–Sep and Oct–Nov 1519) and the retreat (1–11 Jul 1520); a 0.6 km circle marks the Spaniards' quarters in Axayacatl's palace (8 Nov 1519 – 30 Jun 1520).
- Lake shape and town positions follow the Commons map "Basin of Mexico 1519" (the base map treats the lake as land).

## Uncertainties and choices
- Cholula: the conquest timeline says pro-Tlaxcalan nobles replaced its leaders after the massacre, and Cholulan warriors served in Cortés's 1521 army (Fall of Tenochtitlan), but the main infobox lists Cholula under Tenochtitlan. It is drawn allied from 20 Oct 1519.
- The extent of Texcoco's lands (Acolhuacan) and of the south shore during the siege is approximate; one faction of Texcoco stayed loyal to the Aztecs.
- Dates disagree between Wikipedia articles: La Noche Triste 30 Jun/1 Jul (used 30 Jun, infobox), Otumba 7 Jul (Julian date, its article) vs 14 Jul (conquest article), siege start 10, 22 or 26 May (used 26 May, infobox; columns in position 22 May).
- Battle casualties are wide-range estimates; casNum for the siege uses 100,000 warriors + 40,000 civilians.

## Warnings left
- Chapter 3 and chapter 4: "little visible change". No ground changed hands while Moctezuma was hostage or during the retreat; the chapters show the army on the march, the palace and arrows. Inventing territory to clear the warning would be wrong.

## Sources fetched
Wikipedia: Spanish conquest of the Aztec Empire, Fall of Tenochtitlan, La Noche Triste, Battle of Otumba, Cholula massacre, Battle of Cempoala, Tlaxcala (Nahua state), Hernán Cortés; Commons: Basin of Mexico 1519 map. Britannica refused automated fetches (403) and is not cited.
