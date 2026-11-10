# Storyboard: American Revolutionary War

File: `content/cinema/american-revolutionary-war.json`. 9 chapters, 15 occupation areas (97 keyframes), 37 arrows, 25 battles, 57 claims (all pass), 38 sources. There are no front lines; occupation areas show who held what.

Checks: `tools/cinema/validate.py`: no errors. `tools/cinema/check_history.py american-revolutionary-war`: 0 errors, 3 warnings (explained below), with the corrected-borders version of `geo.py`.

## Chapters and why
1. **Lexington, Concord and the siege of Boston** (Apr 1775 – Mar 1776): the march to Concord and back, Bunker Hill (Charlestown becomes British on 17 Jun), Dorchester Heights, and the evacuation on 17 Mar.
2. **The fall of New York** (Jul–Nov 1776): Staten Island (3 Jul), Long Island (27 Aug), the Brooklyn evacuation (29–30 Aug), Kip's Bay (15 Sep), White Plains, and Forts Washington (16 Nov) and Lee (20 Nov).
3. **Trenton and Princeton** (Nov 1776 – Jan 1777): the British chain of posts across New Jersey, which then shrinks back to New Brunswick and Perth Amboy.
4. **Saratoga, 1777**: Burgoyne's corridor down Lake Champlain to Fort Edward and Freeman's Farm, the surrender on 17 Oct, and the withdrawal to Ticonderoga.
5. **Philadelphia and Valley Forge** (Jul 1777 – Jul 1778): Head of Elk, Brandywine, Philadelphia (26 Sep), Germantown, the Delaware forts, Valley Forge, the evacuation (18 Jun 1778) and Monmouth.
6. **The war turns south: Savannah and Charleston** (Dec 1778 – May 1780), including Campbell's few weeks at Augusta and the failed Franco-American siege.
7. **Camden to Eutaw Springs** (May 1780 – Sep 1781): British posts across South Carolina, Camden, Charlotte, Kings Mountain, Cowpens, Cornwallis's North Carolina campaign to Wilmington, and Greene's return. By September the British hold Charleston and Savannah only.
8. **Yorktown, 1781**: the move to Yorktown, the Washington–Rochambeau march, de Grasse, and the surrender on 19 Oct.
9. **The British leave the South; peace** (Oct 1781 – Sep 1783): Savannah evacuated on 11 Jul 1782 and Charleston on 14 Dec 1782, then the Treaty of Paris. The evacuation of New York on 25 Nov 1783 falls after the war's end date, so it is not mentioned.

Left out: Quebec 1775, Newport (no base shape at the point), the frontier and Indian wars, Stony Point and Paulus Hook, Hobkirk's Hill (no casualty data fetched), and the naval and European theatres.

## Corrections to the base map
- **1775**: the colonies are blank (only Boston's surroundings are British-coloured). `baseYears` shows the 1776 outline in 1775, and a "Patriot-held Thirteen Colonies (1775)" area covers it (to the Appalachian line, excluding Haudenosaunee country and Canada). A finer "Patriot siege lines around Boston" area leaves a notch for British-held Boston.
- **1776–80**: the United States shape includes the Montreal area, so "British-held Quebec province" corrects it (with the American occupation of Montreal from 13 Nov 1775 to mid-June 1776).
- **1778–80**: `baseYears` uses 1777 borders, because the 1778–79 data draws the Philadelphia area British all year, including Valley Forge and after the June 1778 evacuation, and the 1780 data draws the coast British from January. British-held New York, Philadelphia, Savannah and Charleston are drawn as areas instead.
- **1781–82**: Yorktown and Hampton Roads are drawn British for both years. American areas fix this before Cornwallis arrived and after the surrender. Charleston stays British in the data to the end of 1782, so an American area starts on 14 Dec 1782. Savannah is drawn American in 1781–82, so a British area covers it until 11 Jul 1782.
- **New York in 1776–77 and 1783** is drawn American, so the British New York area runs to the end of the war.

## Pockets
- After the White Plains manoeuvres (from 5 Nov 1776), the British New York area keeps only the Bronx to Kingsbridge, not the Pell's Point–New Rochelle lobe. That lobe had left American Westchester ground enclosed.
- The British South Carolina area is joined to the Savannah area through the Beaufort–Savannah River lowcountry (1780–81), so no American ground is left between the two.

## Maps traced
USMA (West Point) maps on Commons: principal campaigns 1775–83, Siege of Boston, and major operations in the South 1781. Routes come from those maps; places and dates come from the cited Wikipedia articles.

## Uncertainties (no claims rest on these)
- The British evacuation of New Jersey is keyed to 1 Jul 1777. The fetched source says only that by January 1777 a few outposts near New York remained.
- Westchester during the White Plains manoeuvres (18 Oct – 5 Nov 1776).
- The Ticonderoga garrison's withdrawal is keyed to 8 Nov 1777 (not found in the fetched articles).
- Augusta in 1779 (keyed 31 Jan – 14 Feb; the source says "a few weeks", abandoned in February). Augusta's reoccupation in June 1780 and its loss in June 1781 (the source confirms only "Augusta in 1781").
- British Wilmington (29 Jan – 18 Nov 1781) and Portsmouth, Virginia (Jan – Aug 1781) are approximate.
- The extent of the British posts in South Carolina in 1780–81 is a hull round the named posts (Camden, Ninety Six, Orangeburg, Georgetown, Beaufort and Winnsboro).
- A British-coloured shape near Brunswick, Georgia in the 1781–82 data is left as it is.
- The coastline of the base data is coarse at Boston and New York, so Boston's British-held peninsula is only a few kilometres across on the map.

## Warnings left
"Little visible change" in chapter 3 (Trenton and Princeton), chapter 5 (Philadelphia and Valley Forge) and chapter 7 (Camden to Eutaw Springs). In each, the British gain ground and lose it again inside the chapter: New Jersey is overrun and given back, Philadelphia is taken and evacuated, and the South Carolina backcountry is occupied and abandoned. The start and end frames are therefore similar, while the middle frames show the large changes. Chapter 5 also carries a held keyframe (New York, 30 Jun 1778) so the chapter has a position inside its dates.
