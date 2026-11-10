# Storyboard: Paraguayan War (1864–1870)

File: `content/cinema/paraguayan-war.json`. 8 chapters, 47 claims (all pass), 6 occupied areas (44 keyframes), 25 arrows, 11 battles, no fronts.
Check: `validate.py` 0 errors; `check_history.py` 0 errors, 0 warnings.

## Chapters and why
1. **The invasion of Mato Grosso** (12 Nov 1864 – 30 Apr 1865): Marquês de Olinda seized, Coimbra, Corumbá, Miranda, Coxim; Cuiabá never reached.
2. **Corrientes and Riachuelo** (12 Apr – 21 Oct 1865): Corrientes taken 13 Apr, advance to Goya, Riachuelo 11 Jun, withdrawal ordered 3 Oct.
3. **The Uruguay River and Uruguaiana** (20 May – 18 Sep 1865): Estigarribia and Duarte, São Borja, Itaqui, Yatay, surrender at Uruguaiana. (Overlaps chapter 2 in time: two separate theatres.)
4. **Into Paraguay: Tuyutí and Curupayty** (15 Apr – 30 Sep 1866).
5. **The siege of Humaitá** (22 Jul 1867 – 5 Aug 1868): flank march to Tayí, passage of the ironclads, fall on 26 Jul 1868.
6. **The Dezembrada and the fall of Asunción** (26 Jul 1868 – 5 Jan 1869): advance to Palmas, Chaco road, Ytororó, Avay, Lomas Valentinas, Angostura, Asunción.
7. **The Campaign of the Hills** (1–19 Aug 1869): Piribebuy, Acosta Ñu, Caraguatay.
8. **The pursuit to Cerro Corá** (20 Aug 1869 – 1 Mar 1870): Curuguaty, Concepción, Cerro Corá.

## How it is drawn
- Side 0: Empire of Brazil (from 12 Nov 1864), Oriental Republic of Uruguay (from 20 Feb 1865, Flores in power; the Blanco government, Paraguay's ally, is left out), Argentine Confederation (from 13 Apr 1865; drawn as "Argentine Republic" after a correction relabel, matched by its original name). Side 1: Paraguay.
- `baseYears`: 1864 borders throughout. The yearly data enlarges Paraguay in 1865, cuts it to a fragment in 1868–69 and shades it Brazilian in 1870; wartime changes are drawn as areas instead.
- Paraguayan areas on allied ground: southern Mato Grosso (Dec 1864 – Apr 1868), Corrientes (Apr – Nov 1865), the Uruguay River columns (May – Sep 1865).
- Allied areas in Paraguay: lines before Humaitá (1866–68, a C-shape round the fortress from Nov 1867, the pocket backed by Humaitá claims); the river corridor to Asunción (1868–69, with the Chaco road and the Pikysyry pocket); allied-held Paraguay (Aug 1869 – Mar 1870, with a north-eastern remnant round Cerro Corá until 1 Mar 1870).
- Geometry follows the Commons map "Map of the Paraguayan War 1864-1870" and the campaign descriptions; positions from article coordinates (Tuyutí, Curupayty, Humaitá, Riachuelo, Lomas Valentinas, Cerro Corá).

## Map data gaps
- The 1864 base draws the Paraguay–Argentina border about 10–15 km west of the river at Humaitá, Corumbá as Bolivian, and the whole Chaco north of about 26.6°S (and a disputed strip north of the Apa, incl. Dourados) as Paraguayan, plus a Bolivian patch across the river from Asunción. Allied areas in the Chaco are limited to Caxias's road (Dec 1868); the rest of the Chaco stays Paraguayan-coloured.
- The coarse border puts Paso de los Libres on the Brazilian side; its claims are placed on the Argentine side of the column area.

## Uncertainties and choices
- Whether Paraguayan garrisons held São Borja and the upper Uruguay corridor after Yatay is unclear; the corridor is kept until the Uruguaiana surrender (18 Sep 1865), and only the Argentine bank near Paso de los Libres is dropped after Yatay.
- Locations of Ytororó, Avay, Palmas and Tayí are approximate (no coordinates in their articles). The extent of allied control of the interior in 1869 (south-east Paraguay, Misiones) is not documented in the cited pages and is drawn broadly.
- Disputed figures kept as ranges: Tuyutí allied losses 4,000–6,000; Curupayty allied losses 4,000–8,000 (infobox 4,227, main article over 8,000), Paraguayan losses 92–250; Humaitá fell 25 Jul (main article) vs 26 Jul (siege article; used).
- The "little visible change" rule was met by extending the allied rings' Argentine side (not drawn, since areas only show on enemy ground) and by starting chapters a day before their first keyframe.

## Sources fetched
Wikipedia: Paraguayan War, Mato Grosso campaign, Corrientes campaign, Siege of Uruguaiana, Battle of Yatay, Battle of Riachuelo, Battle of Tuyutí, Battle of Curupayty, Siege of Humaitá, Battle of Ytororó, Battle of Avay, Battle of Lomas Valentinas, Battle of Piribebuy, Battle of Acosta Ñu, Battle of Cerro Corá, Treaty of the Triple Alliance, Uruguayan War, Siege of Paysandú; Commons map above. Britannica refused automated fetches (403).
