# Storyboard: Third Crusade (1189–1192)

File: `content/cinema/third-crusade.json`. 6 chapters, 31 claims (all pass), 12 occupied areas (35 keyframes), 14 arrows, 5 battles, no fronts.
Check: `check_history.py`: 0 errors, 2 warnings (below). `validate.py`: no errors.

## Chapters and why
1. **Barbarossa's march** (May 1189 – Jun 1190): Regensburg → Philippopolis (24 Aug 1189) → Adrianople (winter) → Asia; Philomelion (7 May), Iconium (18 May), drowning in the Saleph (10 Jun 1190). Text also gives Hattin and Saladin's 1187 conquests as background.
2. **The siege of Acre** (Aug 1189 – 12 Jul 1191): Tyre holds, Guy besieges Acre, Philip and Richard arrive, Acre surrenders.
3. **Richard takes Cyprus** (May–Jun 1191).
4. **From Acre to Jaffa** (Aug–Sep 1191): coastal march, Arsuf (7 Sep), Jaffa (10 Sep).
5. **Within sight of Jerusalem** (Oct 1191 – Jul 1192): Beit Nuba advances, Ascalon rebuilt, Darum (22 May 1192).
6. **Jaffa and the treaty** (Jul–Oct 1192): Saladin's attack on Jaffa, Richard's relief, Treaty of Jaffa (1–2 Sep), departure 9 Oct.

## How it is drawn
- Saladin's gains after Hattin are already on the base map from 1188 (Ayyubid realm covering the old kingdom except Tyre), so the storyboard opens on that picture; the war's sides start in 1189, so a 1187–88 chapter would show Saladin as "not in the war" and was not added.
- Side-0 areas: German army in Thrace (1189–90), Tyre, the Acre siege camp, Cyprus (grows over May 1191), the coastal strip retaken step by step from Acre to Jaffa (22 Aug – 10 Sep 1191), Ascalon (Jan–Sep 1192), Darum (May–Sep 1192), and from 2 Sep 1192 "the coast from Tyre to Jaffa" under the treaty. A side-1 circle marks Saladin's troops in Jaffa town (30 Jul – 1 Aug 1192).
- Moving circles mark the marching armies (Barbarossa 1190; the two inland advances to Beit Nuba) so arrows end on held ground.
- `baseYears`: 1 Jan – 1 Sep 1192 uses 1191 borders (the 1192 data already shows the coast and Ramla as crusader land, settled only by the treaty).
- Geometry from the Commons map "Crusader states in 1190" and modern coordinates.

## Uncertainties and choices
- The width of the coastal strip held after Arsuf is approximate (about 10–15 km).
- Darum's fate after the treaty is not stated in the fetched sources; its area ends on 2 Sep 1192 without a claim afterwards. Ascalon likewise (walls demolished, town returned to Saladin).
- Exact day Saladin's men broke into Jaffa is not given in the fetched article (siege began 27 Jul); no claim on that day.
- Arsuf casualties are uncertain; the article cites Ambroise for "several thousand" Ayyubid dead (casNum 3,000 as a floor). Acre uses the infobox figure of c. 19,000 crusader dead.

## Warnings left
- Chapter 2 (siege of Acre): little visible change (306 km²) – a two-year static siege; only the camp and Acre's plain change hands.
- Chapter 5 (Within sight of Jerusalem): 46 km² – the advances never held ground; only Ascalon and Darum were occupied.

## Pockets fixed
None needed: the pockets rule finds no stray enemy ground in this war. The two warnings above are chapter-change warnings, unchanged.

## Sources fetched
Wikipedia: Third Crusade, Frederick Barbarossa, Battle of Philomelion (1190), Battle of Iconium (1190), Siege of Acre (1189–1191), Conrad of Montferrat, Battle of Hattin, Richard I of England, Isaac Komnenos of Cyprus, Battle of Arsuf, Battle of Jaffa (1192), Treaty of Jaffa (1192), Siege of Jerusalem (1187), Siege of Tyre (1187); Commons map listed in the file.
