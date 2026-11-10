# Storyboard: Thirty Years' War (`content/cinema/thirty-years-war.json`)

Side index follows `content/wars/b-modern.json` (`thirty-years-war`): **0 = Habsburgs and Catholic League, 1 = Protestant states, Sweden and France**.

There was no continuous front line in this war, so the file has **no fronts**: control is shown with occupation areas
(24 areas, 140 keyframes), campaigns with 39 arrows, and 23 battles and sieges. 63 claims, 4–7 per chapter.
`validate.py`: 0 errors. `check_history.py` (with corrections.json applied and the pockets rule): **0 errors, every claim
green, no pocket warnings**, 1 warning (explained below). Two pockets are explained by sourced claims: imperial
Neubrandenburg in May 1631 (retaken by the Catholic League in 1631, inside Swedish and Brandenburg ground) and the
Weimar enclave around Rheinfelden in July 1638 (Rheinfelden and Freiburg taken in 1638, inside Habsburg ground).

## Chapters and why
1. **The Bohemian revolt** (May 1618 – Aug 1619). The war's origin: rebel Bohemia, Mansfeld taking Pilsen (21 Nov 1618), the revolt spreading to Moravia, Silesia and Lusatia, Thurn outside Vienna (June 1619), Budweis holding out and Sablat.
2. **White Mountain** (Jul – Dec 1620). Saxony occupies Lusatia for the emperor; the imperial–League army advances from Upper Austria through Budweis and Písek to the White Mountain (8 Nov); Bohemia falls, Moravia and Silesia remain in rebel hands at the chapter end.
3. **The Palatinate overrun** (Aug 1620 – Mar 1623). Spinola's invasion (Kreuznach 10 Sep, Oppenheim 14 Sep 1620), Mingolsheim, Wimpfen, Höchst, then Heidelberg (19 Sep 1622), Mannheim (2 Nov) and Frankenthal (20 Mar 1623).
4. **Denmark's war: Lutter to Lübeck** (Apr 1626 – Jun 1629). Dessau Bridge, Lutter, the imperial occupation of Lower Saxony, Holstein, Mecklenburg, Pomerania and Jutland to the Limfjord, Stralsund holding out, Wolgast, and the Lübeck peace restoring Danish lands.
5. **Gustavus Adolphus lands** (Jul 1630 – May 1631). Landing at Peenemünde, Stettin, the Oder estuary, Frankfurt an der Oder, the sack of Magdeburg.
6. **Breitenfeld and the march to the Rhine** (Sep 1631 – May 1632). Tilly in Saxony, Breitenfeld, Würzburg, Mainz, the Saxons in Prague, Rain and Munich.
7. **Wallenstein and Lützen** (May – Nov 1632). Prague retaken, the Alte Veste, Wallenstein in Saxony (Leipzig), Lützen.
8. **Nördlingen and the Peace of Prague** (May 1634 – May 1635). Regensburg retaken (26 Jul), Nördlingen (6 Sep), the reconquest of Württemberg and southern Germany.
9. **France against Spain: Corbie to Rocroi** (May 1635 – May 1643). France's entry, the Spanish crossing of the Somme and Corbie (15 Aug – 9 Nov 1636), Rocroi (19 May 1643). One place (the Picardy–Hainaut border) across eight years, because nothing else changed hands there that the map can show.
10. **Breisach and the Upper Rhine** (Feb – Dec 1638). Bernard of Saxe-Weimar's campaign in French pay: Rheinfelden, Freiburg, Breisach.
11. **Jankau and the march on Vienna** (Jan – Oct 1645). Torstensson's invasion of Bohemia, Jankau, the advance to the Danube opposite Vienna, the failed siege of Brno; Swedish-held Olomouc throughout.
12. **The last campaigns and the Peace of Westphalia** (May – Oct 1648). Zusmarshausen, the plunder of Bavaria between Lech and Isar and Piccolomini's counter-offensive, the Swedish seizure of Prague Castle and the Lesser Town, Westphalia.

Not given chapters: Stadtlohn (1623, the end of the Palatine phase, outside chapter 3's place), Wittstock (1636), the
Second Breitenfeld (1642) and the Torstensson War with Denmark (1643–45); the Wittstock and Breitenfeld II events stay
in the war's event list. The user's plan item "Rocroi if it fits" was merged into chapter 9 so the war stays at 12.

## Maps traced
- Wikimedia Commons, *Bohemian-Palatinate phase of the Thirty Years' War* (CC BY-SA 4.0): arrows for Mansfeld, Thurn, Bucquoy, the League army via Budweis to the White Mountain, Mansfeld in the Palatinate, Tilly to Wimpfen and Heidelberg; extents of the Lower and Upper Palatinate.
- Wikimedia Commons, *Danish period of the Thirty Years' War* (CC BY-SA 4.0): Christian IV's loop south of Wolfenbüttel back to Lutter, Tilly's pursuit, Mansfeld at Dessau, Tilly into Holstein/Jutland, Wallenstein to Stralsund, Wolgast; the Lower Saxon Circle outline used for the Danish-held area.
- Wikimedia Commons, *Swedish period in the Thirty Years' War* (CC BY-SA 4.0): the landing and march to Stettin and Frankfurt an der Oder, Tilly to Magdeburg, Breitenfeld–Mainz, Mainz–Rain–Munich, Wallenstein from Bohemia into Saxony and Gustavus to Lützen, the 1634 Spanish march from Lake Como to Nördlingen.
- Wikimedia Commons, Spruner, *Germany in the Thirty Years' War* (1854, public domain): political boundaries (Bohemian crown lands, Lusatia, Pomerania, Mecklenburg, the Lower Palatinate inset) used to place area edges.
- The atlas's own base polygons (public/data/clio) were used as outlines where they are right: the 1619–21 Bohemian crown polygon for the rebel area, the 1626–28 Danish polygon for Jutland, the 1632–35 Swedish German area for complementary edges.
- Dates and places come from the cited Wikipedia statements (listed per claim); battle casualties from the article infoboxes.

## Where the base map is wrong, and the occupation areas that correct it
- 1618 and 1620–21: Bohemia is Habsburg in 1618 and a neutral polygon in 1619–21. A rebel area (side 1) covers Bohemia (with Pilsen excluded until 21 Nov 1618 and Budweis throughout), then the whole crown; a Habsburg area (side 0) holds Budweis and then the reconquest; a Saxon area (side 0) Lusatia.
- 1620–23: the Palatinate is neutral until 1621 and Spanish from 1622; Palatine (side 1) and Spanish/League (side 0) areas show the conquest town by town.
- 1626–28: the Danish polygon reaches south to Hanover and Magdeburg; the imperial area covers what Tilly and Wallenstein took. 1629: a "Holstein restored to Denmark" area (Jun–Dec 1629) corrects the base, which draws Holstein as Habsburg in 1629–31.
- 1630–31: Sweden has no German territory in the base until 1632; Swedish areas cover Pomerania/Mecklenburg (to the end of the war) and central/southern Germany (Sep 1631 – Dec 1635).
- 1632–35: the base draws one huge Swedish area for all four years. An imperial–Bavarian area (side 0) removes Swabia and the Danube from it until the Swedes actually arrived (Donauwörth 6 Apr, Augsburg Apr 1632), keeps Ingolstadt and (until Nov 1633) Regensburg imperial, then grows after Regensburg (26 Jul 1634) and Nördlingen over Württemberg and southern Germany.
- 1636–39: the base draws the 1636 Spanish incursion (Péronne, St-Quentin, Roye, Guise) as Spanish for four years. A French area (side 1) corrects it before July 1636 and after the recapture of Corbie (9 Nov 1636), shrinking while the Spanish advanced.
- 1638: Upper Alsace (the Sundgau) is Habsburg in the base although French and Weimar troops held it; a French/Weimar area (1638–39) corrects it. Breisach is neutral in the base; a small Habsburg area holds it until 17 Dec 1638.
- 1645 and 1648: Swedish-held Olomouc (1642–50), the 1645 Swedish advance, the 1648 Franco-Swedish occupation of Bavaria and the Swedish hold on Prague's left bank are all drawn as areas on Habsburg or Bavarian ground.

## Rework for the pockets rule (one continuous area per side per region)
After the checker began applying corrections.json and testing for pockets, the first run gave 2 errors and 12 pocket
warnings. Changes made, all keeping each side's ground in one piece per region:
- **Upper Palatinate, 1632–35:** the base map's Swedish area takes in the eastern Upper Palatinate up to the Bohemian
  border, leaving a strip of Swedish ground between the imperial Danube area and Bohemia. The imperial–Bavarian area
  now runs to the Bohemian border (Amberg, Cham, Weiden) in every key; Bavaria held the Upper Palatinate from 1621.
- **Upper Swabia, Jan 1632:** the imperial area now reaches west to about 9.15°E so no Swedish sliver sits between it
  and the Habsburg Breisgau.
- **Bavaria, May 1632:** the Swedish Munich area is joined to the Swedish ground at Augsburg and runs south to the Alps,
  instead of floating with Bavarian ground between.
- **Saxons in Bohemia, Nov 1631 – May 1632:** the Saxon area reaches the Silesian border (the Saxons held north-eastern
  Bohemia as well as Prague) and, when Wallenstein drives them out, shrinks back onto that border rather than towards Dresden.
- **Wallenstein in Saxony, Nov 1632:** the area reaches the Bohemian border through the Erzgebirge and Vogtland.
- **Moravia after White Mountain:** the rebel area's narrow south-western wedge was dropped (that ground is shown as
  unoccupied Bohemian-crown land).
- **Mecklenburg and Pomerania, 1631:** the Swedish area covers western Pomerania from April 1631 (Demmin and the Tollense
  line were taken in early 1631), and Neubrandenburg, retaken by the Catholic League in 1631, is a claimed imperial pocket.
- **Lower Saxony, Nov 1627:** an extra keyframe (15 Nov 1627) keeps the Magdeburg–Dessau area imperial while the area grows
  into Jutland (interpolating straight from September to December cut that corner).
- **Upper Alsace, 1638:** the French/Weimar area now reaches the French border, leaving no Habsburg strip at Belfort.
The short-lived areas that represent an army's reach were kept where a claim or the chapter's change depends on them
(Tilly at Leipzig 1631, Wallenstein in Saxony 1632, the 1645 Swedish advance) and Thurn's tongue opposite Vienna (June
1619) was kept because without it the arrow would end on enemy ground and add a warning; none of them creates a pocket.

## Uncertainties and approximations
- **Thurn at Vienna (June 1619):** drawn as a short-lived tongue of the rebel area to the north bank opposite Vienna so the arrow can end where the army stopped; Vienna itself stays imperial.
- **Pilsen after White Mountain:** Mansfeld held Pilsen into 1621, but no fetched source dates this, so the Habsburg area covers all Bohemia from 20 Nov 1620. Moravia and Silesia stay rebel until the end of 1621 (the White Mountain article: Krnov's army fought on in Moravia), a deliberately vague end.
- **Palatine side:** Frederick V's Palatinate is not a member of either side in the war file; its towns and English garrisons are shown as side 1 (Protestant) occupation.
- **Imperial occupation in Brandenburg and Farther Pomerania:** Wallenstein's and Tilly's quarters reached Brandenburg's Altmark and Prignitz (the area covers Brandenburg west of the Havel line through 1631, when Brandenburg is on the Protestant side, so the map does not carve a sliver of Brandenburg between imperial zones) and all Pomerania (1627–31). It drops Farther Pomerania when the Swedes land (Kolberg actually held out for the emperor until 1631).
- **Munich 1632:** the Swedish area includes Munich and the Bavarian plain south to the Alps (the Rain article: Bavaria 'extensively pillaged') from 17 May to the end of June 1632 only, joined to the Swedish ground at Augsburg; the Rain article says Maximilian did not re-enter his capital for three years, but Swedish occupation after Gustavus left is not documented in fetched sources.
- **Regensburg, Nov 1633:** its capture by Bernard is placed on 14 Nov 1633 from general knowledge (the Nördlingen article confirms it was Swedish-held and isolated in May 1634); no claim rests on that date.
- **Augsburg after Nördlingen:** the imperial area covers Augsburg from Oct 1634, although the Swedish garrison held out into 1635.
- **Swedish landing date:** sources disagree between 4 and 6 July 1630 (and 20 July on the Stettin article, Old/New Style mixups); the keyframe is 6 July and the text says "summer of 1630". Stettin's claim is dated 25 July to be safe in either calendar.
- **1645 Swedish area:** drawn as a band from Jankov through Iglau to the Danube opposite Vienna; it represents the army's reach rather than garrisoned territory. The fetched sources (Jankau, Siege of Brno) give the march but not the garrisons.
- **1648 Bavaria:** the area runs between the Lech and the Isar (Freising, Landshut) and leaves out Munich and Ingolstadt, per the Zusmarshausen article; it includes Augsburg, which was not taken.
- **Wallenstein in Saxony, Oct–Dec 1632:** extent approximate (Leipzig in, Lützen just outside); it ends after the withdrawal into Bohemia.
- **Prague 1648 battle dates:** the fighting lasted 25 Jul – 1 Nov 1648, past the war's end date (24 Oct), so the marker ends on 24 Oct and the casualty note says the fighting went on to 1 November.

## Warning left
- `side dates: 'France declares war on Spain' (May 1635) but '(Kingdom of France)' has no fromDate` — this concerns the
  war file (content/wars/b-modern.json), not the storyboard: France is a side-1 member for whole years 1635–1648, so it
  counts from 1 Jan 1635 rather than 19 May. A `"fromDate": "1635-05-19"` on that member would clear it. No claim depends
  on French ground before May 1635.

## Sources
All URLs in the file's `sources` and in each claim were fetched (Wikipedia raw wikitext, the French Wikipedia article on
the siege of Corbie, and the Commons file pages). Main articles: Thirty Years' War, Bohemian Revolt, Siege of Pilsen,
Battle of Sablat, Battle of White Mountain, John George I of Saxony, Palatinate campaign, Frederick V of the Palatinate,
Siege of Heidelberg (1622), Capture of Mannheim, Siege of Frankenthal, Battle of Lutter, Siege of Stralsund (1628),
Treaty of Lübeck, Treaty of Stettin (1630), Swedish intervention in the Thirty Years' War, Sack of Magdeburg, Battle of
Breitenfeld (1631), Battle of Rain, Battle of the Alte Veste, Battle of Lützen (1632), Battle of Nördlingen (1634),
Crossing of the Somme, Siège de Corbie, Battle of Rocroi, Battle of Rheinfelden, Siege of Breisach, Bernard of
Saxe-Weimar, Battle of Jankau, Siege of Brno, Olomouc, Neubrandenburg, Battle of Zusmarshausen, Battle of Prague (1648), Peace of Westphalia.
