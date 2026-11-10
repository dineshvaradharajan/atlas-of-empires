# Storyboard: Napoleonic Wars (`content/cinema/napoleonic-wars.json`)

Side index follows `content/wars/b-modern.json` (`napoleonic-wars`): **0 = French Empire and allies, 1 = Coalition powers**.
Result: 14 chapters, 97 claims (all pass), 21 occupied areas, 106 arrows, 70 battles, no fronts.
`tools/cinema/validate.py`: no errors. `tools/cinema/check_history.py napoleonic-wars`: 0 errors, 8 warnings (explained below).

## Chapters and why
| # | id | dates | place |
|---|----|-------|-------|
| 1 | channel-trafalgar | 1803-05-18 – 1805-10-21 | Channel and Atlantic coast: Boulogne camp, Villeneuve's run to Cádiz, the march to the Rhine, Trafalgar |
| 2 | ulm-austerlitz | 1805-09-08 – 1805-12-26 | Danube from the Rhine to Moravia: Austrian invasion of Bavaria, Ulm, Vienna, Austerlitz |
| 3 | jena | 1806-10-08 – 1806-11-11 | Thuringia, Saxony, Brandenburg: Jena–Auerstedt and the collapse of Prussia |
| 4 | eylau-friedland | 1806-11-04 – 1807-07-09 | Poland and East Prussia: Warsaw, Eylau, Danzig, Friedland, Tilsit |
| 5 | spain-rises | 1807-10-18 – 1809-05-12 | Iberia: Lisbon, Madrid, Bailén, Vimeiro, Napoleon's offensive, Corunna, Zaragoza, Porto |
| 6 | wagram | 1809-04-10 – 1809-07-12 | Bavaria and the Danube: Eckmühl, Vienna, Aspern-Essling, Wagram, Znaim |
| 7 | torres-vedras | 1809-07-03 – 1811-05-16 | Iberia: Talavera, conquest of Andalusia, Masséna in Portugal, Torres Vedras, Fuentes, Albuera |
| 8 | salamanca | 1812-01-08 – 1812-11-19 | Iberia: Ciudad Rodrigo, Badajoz, Salamanca, Madrid, Burgos and the retreat |
| 9 | russia-advance | 1812-06-24 – 1812-10-18 | Lithuania, Belarus, the Moscow road: Vilna to Moscow |
| 10 | russia-retreat | 1812-10-19 – 1812-12-14 | same: Maloyaroslavets, Vyazma, Krasnoi, Berezina, Kovno |
| 11 | germany-1813 | 1813-02-28 – 1813-11-02 | Saxony, Brandenburg, Silesia: Lützen, Bautzen, armistice, Dresden, Leipzig, retreat to the Rhine |
| 12 | vitoria-toulouse | 1813-05-22 – 1814-04-10 | northern Spain and south-west France: Vitoria, Pyrenees, San Sebastián, Pamplona, Orthez, Toulouse |
| 13 | france-1814 | 1813-12-21 – 1814-04-06 | north-east France: Rhine crossings, Six Days, Laon, Paris |
| 14 | waterloo | 1815-03-01 – 1815-07-08 | Belgium to Paris: return from Elba, Ligny, Quatre Bras, Waterloo, allies in Paris |

The Peninsular War gets four chapters because control there changed many times; Russia gets two so that each shows
real change (an advance-and-retreat chapter would start and end with almost no French-held ground). The Hundred Days
are framed on Belgium–Paris so the four June 1815 battles stay readable; the march from Golfe-Juan enters from the south.

## Method
- **Occupied areas, not fronts.** French-held ground on enemy or neutral states is side 0 (e.g. "French-occupied
  Prussia and Saxony (1806–1808)", "French-held Spain", "French-occupied Russia (1812)"); coalition-held ground on
  French-side states is side 1 (e.g. "Coalition-held Prussia, Poland and northern Germany (1813–1814)", "Allied-held
  northern Spain and south-west France (1813–1814)", the two 1814 invasion areas, "Coalition-occupied France (1815)").
  A keyframe is placed at each capture the text mentions; holds repeat a shape so the map does not creep across quiet months.
- **Rings** are hand-traced lon/lat polygons anchored on towns and rivers (Danube, Inn, Lech, Iller, Vistula, Passarge,
  Niemen, Ebro, Douro, Tagus, Dvina, Berezina, Elbe, Aisne, Marne, Sambre). They may overshoot the sea or the occupier's
  own states, which the app clips. Where a capture happens on a precise day, a hold keyframe the day before stops interpolation
  from showing it early (e.g. Moscow 13/14 Sep 1812, Zaragoza 19/20 Feb 1809, Hamburg 29/30 May 1813, Madrid 31 Jul/10 Aug 1808).
- **Notches** keep besieged places out of the surrounding area until they fell: Magdeburg (to 11 Nov 1806), Danzig (to
  24 May 1807), San Sebastián (to 8 Sep 1813), Pamplona and the ground east of it (to 31 Oct 1813), Bayonne (never taken),
  Leipzig on 16 Oct 1813, Burgos castle in Sept–Oct 1812, Toulouse until 12 Apr 1814.
- **Arrows** end where the advance stopped. Because this war has no fronts, an arrowhead on enemy ground counts as an
  error in the checker, so the areas leave the endpoint open on that day where the attack really reached it (Grossbeeren,
  Dennewitz, Sorauren, Craonne, Saint-Dizier, Frasnes/Quatre Bras, Grouchy before Wavre).
- **Casualties** are from each battle article's infobox; `casNum` is a mid value. Siege of Zaragoza counts military and
  civilian dead (c. 76,000); the Berezina includes c. 30,000 French non-combatants; Katzbach is the battle plus the pursuit
  to 1 Sep (the infobox gives no battle-day French figure).

## Base map: what was wrong and what was done
The yearly border data draws occupied land inside the French Empire, and the app's corrections crop those shapes, which
leaves **blank land** there. Occupied areas are drawn only on enemy or neutral states, so they cannot fill a blank. Probing
the data (raw and as corrected by `content/corrections.json`):
- 1807–08: Berlin, Königsberg, Danzig drawn French (app: blank); Prussia shrinks to 1,787 km².
- 1809–11: Madrid, Salamanca, Zaragoza drawn French (app: blank); Kingdom of Spain only 132,000–234,000 km².
- 1812–13: Kovno, Vilna, Minsk, Smolensk and Moscow drawn French for the whole year (app: blank).
- 1809–14: Prussia is a polygon named "Confederation of the Rhine" (the app relabels it Prussia, the checker does not).
- 1814: Paris lies in a shape named "Grand Duchy of Berg"; the 1814 French Empire shape leaves out Paris.
- 1805: the Danube valley from Regensburg to east of Vienna is already French for the whole year.

**Fix:** `baseYears` shows **1806 borders for 1807-01-01 – 1812-12-31** (Prussia, Spain, Portugal and Russia whole) and
**1813 borders for 1814-01-01 – 1814-04-30** (France with Paris, Belgium and Holland). Occupied areas then carry the
changes. The cost: the Duchy of Warsaw, Westphalia, the Illyrian Provinces and the 1810 annexations are not drawn as
separate states in 1807–1812. For 1805 a side-1 area, "Austrian-held Upper and Lower Austria (until the French advance)",
cancels the French Danube strip and shrinks east as the French advanced (Linz, St Pölten, Vienna 13 Nov). For 1813 a
side-1 area covers Prussia, which also makes the checker (raw "Confederation" = neutral) agree with the app (Prussia).

## Uncertainties and simplifications
- Accuracy is roughly 10–30 km in Germany, Austria and Belgium, and 30–80 km in Spain and Russia. Spanish "French-held"
  areas show territory under French garrisons and armies; guerrillas contested much of it, and Galicia, Asturias, Valencia
  and Murcia changed hands more often than shown. 1811 (between chapters) jumps from the Torres Vedras shape to January 1812.
- 1806–07: Mecklenburg and the small Thuringian states lie inside the French area because they were overrun. In Poland
  the data draws Warsaw and Mazovia as Austrian (they were Prussian), and the app cuts that area out, so the occupation shows
  a hole around Warsaw in the app (the checker counts Warsaw correctly). After Tilsit the area is cut back to west of the
  Vistula (1 Dec 1807) and held until the evacuation of December 1808. Kolberg, Graudenz and Pillau held out but are not notched.
- 1809: the April Austrian occupation of Bavaria and the French occupation of Austria are schematic; Tyrol and the Italian
  and Polish fronts are not drawn. The French area is kept to the Treaty of Schönbrunn, then removed by 20 Nov 1809.
- 1812: Courland is drawn French-held from July (Macdonald's corps; Riga never fell); Schwarzenberg's and Reynier's ground in
  the Grodno–Slonim area is drawn to mid-December. Bobruisk (Russian fortress) is left outside.
- 1813: Dresden is shown allied from 20 Oct, though St Cyr held it until 11 Nov; Magdeburg, Wittenberg, Torgau, Erfurt,
  Küstrin, Glogau, Stettin and Danzig kept French garrisons for months and are not notched. Bavaria changed sides on 8 Oct,
  but the war data keeps it French-side to the end of 1813, so it is left out of the coalition area.
- 1814: the 1813 border data draws Koblenz, Mainz and the left bank north of Alsace as Nassau, Hesse and Würzburg (they were
  French). Blücher's crossing area covers them. Antwerp, Strasbourg, Metz and Besançon held out and are not notched.
- Side dates follow the war file's whole years. For example, Spain counts as coalition from 1 Jan 1808, though it rose in May,
  and Prussia from 1 Jan 1813, though it changed sides in March.

## Warnings left (8)
- Three naval arrows (Villeneuve to Cádiz, the combined fleet's sortie, Nelson's columns) end at sea: "neutral ground".
- 'Oudinot's thrust on Berlin' ends at Grossbeeren, where the battle was fought. The checker sees the raw "Confederation
  of the Rhine" polygon (neutral); the app shows Prussia.
- 'French retreat to the Rhine' ends at Mainz. The 1813 data draws Mainz as the Grand Duchy of Würzburg.
- Three side-date warnings for the war event "Treaty of Pressburg: Austria makes peace" against the Austrian Empire's
  1809/1812/1813 memberships. These come from the war file, not this storyboard. The 1805 member is "(Habsburg Monarchy)".

## Issues outside this file (for the maintainers)
- **App year label:** `updateHud()` and `go()` use `warYear(t)`, which returns the `baseYears` year. With this storyboard,
  the big year label (and the side panel's year) reads 1806 during 1807–1812 and 1813 in early 1814. Fix: show
  `Math.floor(t)` for the label and keep `warYear` only for choosing borders.
- **Checker vs app:** `tools/cinema/geo.py` ignores `content/corrections.json` (crops, cuts, relabels), so for some states the
  checker and the app disagree. The base-year choice above was made so the two agree for every claim.

## Sources
Maps opened and traced against (Commons):
- USMA plate "Ulm campaign – French strategic envelopment, 26 Sep–9 Oct 1805"
- USMA plate 51 "The retreat from Moscow, 18 Oct–5 Dec 1812"
- "The Iberian Peninsula 1807–1814"

Dates and places come from statements in the cited Wikipedia articles, which were fetched as raw wikitext. Each claim
names its article. The full list (battle articles for casualties included) is in `sources` in the JSON.
