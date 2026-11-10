# Storyboard: First Italo-Ethiopian War (1895–1896)

File: `content/cinema/first-italo-ethiopian-war.json`. 7 chapters, 31 claims (all pass), 3 occupied areas (18 keyframes), 9 arrows, 6 battles, no fronts.
Check: `check_history.py`: 0 errors, 1 warning (below). `validate.py`: no errors.

## Chapters and why
1. **Coatit and Senafe** (12–20 Jan 1895): Ras Mengesha's invasion of Eritrea, Coatit (13 Jan), Senafe (15–16 Jan).
2. **Italy occupies Tigray** (Mar – Nov 1895): Adigrat (25 Mar), Adwa (2 Apr), Debra Ailà (9 Oct), Mekelle fortified (Oct), outposts to Amba Alagi.
3. **Amba Alagi** (1–14 Dec 1895): Toselli's outpost overrun (7 Dec), retreat through Mekelle.
4. **The siege of Mekelle** (15 Dec 1895 – 25 Jan 1896): fort surrounded (18 Dec), Menelik arrives (early Jan), surrender (21 Jan).
5. **The road to Adwa** (26 Jan – 29 Feb 1896): Menelik's march by Hawzen to Adwa; Baratieri moves west from Adigrat; council of war (29 Feb).
6. **The Battle of Adwa** (29 Feb – 5 Mar 1896): the night march and the rout of 1 March; retreat towards Adi Ugri and Adi Keyh.
7. **Retreat and peace** (6 Mar – 26 Oct 1896): Crispi falls, Adigrat evacuated (18 May), Treaty of Addis Ababa (26 Oct).

## How it is drawn
- The 1895–96 base map is right for the frame: Eritrea as "Italian Africa" (plus a small "Kingdom of Italy" polygon at Massawa) and Tigray inside the Ethiopian Empire, with the border along the Mareb line.
- **"Italian-occupied Tigray"** (side 0): Adigrat district (25 Mar 1895) → Adigrat–Adwa (2 Apr) → south to Mekelle and Debra Ailà (12 Oct) → Amba Alagi (15 Nov) → a corridor Adigrat–Mekelle after Amba Alagi (9 Dec) → Adigrat district only once Makonnen reaches Mekelle (18 Dec) → west towards Adwa as Baratieri advances (20 Feb 1896) → Adigrat only after Adwa (3 Mar) → ends 18 May 1896. The ring runs north into Eritrea so it joins the colony without a gap (occupied areas are drawn only on Ethiopian ground).
- **"Italian fort at Mekelle (besieged)"** (side 0): a small separate area 18 Dec 1895 – 21 Jan 1896, about 60 km from the Adigrat area; Ethiopian ground between them is real.
- **"Ras Mengesha's Tigrayan army in Eritrea"** (side 1): 12–16 Jan 1895, shrinking back towards the border after Coatit.
- Geometry from the campaign narratives (Wikipedia articles listed below) and modern coordinates of the towns; edges are approximate, since the Italians held towns, forts and roads rather than the whole countryside.

## Uncertainties and choices
- Adwa: the Senafe article says the Italians "cleared Adua again" in the rainy season of 1895; the area keeps Adwa from April to October 1895 and drops it by December. Only the dates 4 Apr 1895 (Italian) and 25 Feb / 1 Mar 1896 (Ethiopian) are claimed.
- Mekelle's occupation date (early 1895 or October 1895) differs between articles; the area reaches Mekelle on 12 Oct 1895, matching the October fort and the Debra Ailà account, and the claim is dated 25 Oct.
- The Adigrat garrison after Adwa was cut off until Baldissera relieved it; the area keeps a thin link to Eritrea to avoid a drawn gap.
- The exact Italian camp positions before Adwa (Sauria, Entiscio) are not named in the fetched sources, so the advance is drawn only as a westward extension of the Adigrat area to about 39°E.

## Warning left (1)
- "Italian night advance on Adwa" ends on Ethiopian ground: the Italian brigades attacked into the Ethiopian army's positions and were routed there, which is what the arrow shows (arrows are not drawn in the app).

## Sources
First Italo-Ethiopian War; Battle of Adwa; Battle of Coatit; Battle of Senafe; Battle of Debra Ailà; Battle of Amba Alagi (1895); Siege of Mekelle; Mekelle; Adigrat; Antonio Baldissera; Treaty of Addis Ababa (all English Wikipedia, raw wikitext fetched).
