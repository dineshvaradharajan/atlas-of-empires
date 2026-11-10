# Storyboard: Vietnam War (`content/cinema/vietnam-war.json`)

Sides follow `content/wars/d-recent.json`: **0 = North Vietnam and its allies, 1 = South Vietnam and its allies**. Span 2 Aug 1964 – 30 Apr 1975.

## Chapters and why
1. **The Gulf of Tonkin and escalation** (Aug 1964 – Jul 1965): the incident (the second, 4 August, attack is stated not to have happened), Rolling Thunder, the Marines at Da Nang.
2. **Ia Drang** (Oct–Nov 1965): Plei Me and the first big US–PAVN battle; the air-mobile war.
3. **The Tet Offensive** (Jan–Mar 1968): Hue held by PAVN/VC 31 Jan – 24 Feb (the only well-documented "area" of Tet), Saigon, Khe Sanh.
4. **Into Cambodia and Laos** (Apr 1970 – Mar 1971): Parrot's Beak and Fishhook incursions, Lam Son 719 to Tchepone.
5. **The Easter Offensive** (Mar–Sep 1972): Quang Tri, Loc Ninh, Dak To gained; An Loc and Kontum held; Quang Tri city retaken 16 Sep.
6. **The Paris Peace Accords** (Jan–Mar 1973): ceasefire in place.
7. **The Highlands and the coast fall** (Dec 1974 – Apr 1975): Phuoc Long, Ban Me Thuot, the Highlands retreat, Hue, Da Nang, the coast.
8. **Xuan Loc and the fall of Saigon** (Apr 1975).

## Areas and how they were made
- No front lines (insurgency). Areas are drawn only where control is well documented: Hue during Tet (hand ring around the city, shrinking to the Citadel from 12 Feb), the 1972 gains (northern Quang Tri north of the Cam Lo/Cua Viet, then north of the My Chanh on 1 May, then north of the Thach Han after 16 Sep; Loc Ninh; Dak To–Tan Canh), and the 1975 offensive in dated steps (Phuoc Long 6 Jan, Ban Me Thuot 11 Mar, Highlands 17 Mar, Quang Tri 19 Mar, Hue 26 Mar, I Corps 30 Mar, the central coast 2 Apr, Phan Rang/Phan Thiet 16 Apr, everything but Saigon and the delta 21 Apr, Saigon 30 Apr). Region polygons are hand-drawn from the Wikipedia campaign articles and clipped to South Vietnam's outline (1966 + 1973 base polygons, cut at the DMZ ~17°N) on a 0.02° raster; rings never paint Laos or Cambodia.
- **Base-map gap fixed:** the base map has no South Vietnamese state in 1967–72 (the corrected borders hide the old US-shaded shape), so the South was unrecorded land. A side-1 area "Held by the South Vietnamese government" covers South Vietnam 1967–1972, in four latitude bands (for finer outlines), leaving out the North Vietnamese areas of each date and, during Tet, Hue plus a thin corridor to the coast (so the Hue hole can be drawn without a ring hole). It ends 31 Dec 1972; from 1973 the base map has South Vietnam again.
- 1973–75: the base DRV polygon already reaches about 13.7°N along the western border (PRG zones); it is left as is.

## Uncertainties
- Ceasefire (1973) control was a patchwork of hamlets and cannot be mapped; the chapter says so and only the 1972 gains are shown.
- 1975 steps are province-scale approximations between dated city captures; the delta (IV Corps) is shown South-held until 30 April.
- Casualty figures are mostly claims by each side; ranges are given with a middle `casNum`. "Tet attacks on Saigon" uses the nationwide first-phase Tet figures (stated in the text).
- Plei Me and LZ X-Ray coordinates come from the Wikipedia article coordinates.

## Warnings left (check_history: 0 errors, 7 warnings)
- Arrows ending in enemy ground (Plei Me attack, Hue counter-attack, Kontum thrust): real attacks that stopped at or inside the objective; allowed for wars without fronts.
- "Little visible change" in Tet, Cambodia/Laos and Paris chapters: Hue appears and disappears within Tet (net change 0); no areas are drawn for 1970–71 or for the ceasefire by design.
- Pocket at 106.58°E 17.18°N during Tet: the tip of North Vietnam north of the DMZ lies between South-held South Vietnam and the Kingdom of Laos (a South-side member), so the checker closes the gap; it is real North Vietnamese territory, not a drawing gap.

## Counts
8 chapters, 39 claims (all pass), 11 areas with 145 keyframes, 18 arrows, 16 battles, 21 sources (all Wikipedia pages fetched as raw wikitext).
