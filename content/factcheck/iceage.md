# Ice age data (10,000 to 2000 BCE): sources, conversions, uncertainties

Output: `content/iceage/iceage.json` (`sealevel`, `ice`, `sources`). Each ice polygon also has two extra fields: `areaKm2` (geodesic area after simplification) and `note` (source slice and how wide the min–max envelope is).

## Calendar convention
All ages below are **calendar** years. BCE = cal BP − 1950. Both ice datasets are already in calendar years, so no radiocarbon conversion was needed:
- NADI-1: the abstract says it spans "25 to 1 ka in calendar years before present", with "presentation of all data and time-steps in calendar years".
- DATED-1 time slices are calendar ka (the abstract dates the Eurasian maximum to c. 21 ka, which is a calendar age). I couldn't fetch the full Boreas text (Wiley returned 403), so I haven't quoted its calibration sentence directly.
- If you ever use Dyke 2004 (GSC Open File 1574), note that its margins are labelled in 14C ka. For example, 10 14C ka ≈ 11.5 cal ka BP ≈ 9,550 BCE. I did not use Dyke 2004.

## 1. Sea-level curve
Source: Lambeck, Rouby, Purcell, Sun & Sambridge 2014, PNAS 111:15296. I used the open-access PDF from ANU Open Research: https://openresearch-repository.anu.edu.au/items/bacd8ad9-b17e-4143-9909-981eb02cf51e

The paper's numeric table (SI Appendix Table S3) is on pnas.org, which blocks automated access (403 plus a bot check). So I **digitised the red "adopted esl" curve in Fig. 4A** from the embedded figure image:
- The axes were calibrated on the gridlines: 2.22 px per m and 10.17 px per ka in the main panel, 5.05 px per m and 17.75 px per ka in the 0–9 ka inset.
- Values for 8.6 ka and younger come from the inset.
- Check against the paper: the digitised minimum is −134.7 m at about 20.5 ka. The paper says −134 m at the end of the 29–21 ka interval.

| BCE | cal BP | m | | BCE | cal BP | m |
|---|---|---|---|---|---|---|
| −10000 | 11950 | −62 | | −5500 | 7450 | −8.5 |
| −9500 | 11450 | −60 | | −5000 | 6950 | −5 |
| −9000 | 10950 | −53 | | −4500 | 6450 | −3.5 |
| −8500 | 10450 | −45 | | −4000 | 5950 | −2.5 |
| −8000 | 9950 | −39 | | −3500 | 5450 | −2 |
| −7500 | 9450 | −33 | | −3000 | 4950 | −1.5 |
| −7000 | 8950 | −24 | | −2500 | 4450 | −1 |
| −6500 | 8450 | −18 | | −2000 | 3950 | −0.5 |
| −6000 | 7950 | −12 | | | | |

How these fit the paper's text:
- It gives near-uniform rise of about 15 m per ka from 11.4 to 8.2 ka. My values give about 14 m per ka.
- It gives a slower rise from 8.2 to 6.7 ka.
- It says the total rise since 6.7 ka was about 4 m, with about 3 m of that between 6.7 and 4.2 ka, and at most 1 m after 4.2 ka.

The curve never reaches exactly 0 before 2000 BCE. It is within 1 m of today from about 2500 BCE, so treating it as 0 from about 2500 BCE is fair.

Uncertainties:
- The paper's Fig. 4C shows 95% errors of roughly 2–4 m for 12–8 ka, and under 1 m for the late Holocene.
- Digitising adds about ±1 m before 8.6 ka and about ±0.3 m in the inset.
- 10,000 BCE falls just after the Younger Dryas slowdown (12.5–11.5 ka), when sea level was almost flat.
- These are global ice-volume-equivalent values. Local relative sea level differs, sometimes by tens of metres, because of glacial isostatic adjustment. Near the former ice sheets (Hudson Bay, the Baltic, Scandinavia) land was still depressed, so applying a single global number there overstates how much land was exposed.

## 2. Ice-sheet outlines
**North America:** NADI-1 (Dalton et al. 2023, QSR 321:108345), the updated successor to Dalton et al. 2020 and to Dyke 2004. I used the "OPTIMAL" shapefiles from https://zenodo.org/records/8161764 (CC-BY-4.0). The MIN and MAX files were used only to set confidence.

**Eurasia:** DATED-1 (Hughes et al. 2016). I used the "most-credible" (mc) time slices from https://doi.pangaea.de/10.1594/PANGAEA.848117 (CC-BY-3.0). They are in a north-polar LAEA projection, which I reprojected to WGS84. The max and min files were used only for confidence.

| Atlas year | Slice used (cal ka BP) | Exact BCE of slice |
|---|---|---|
| −10000 | 12 ka (NADI-1 and DATED-1 TS12) | 10,050 |
| −9000 | 11 ka | 9,050 |
| −8000 | 10 ka | 8,050 |
| −7000 | NADI-1 9 ka | 7,050 |
| −6000 | NADI-1 8 ka | 6,050 |

**No Scandinavian ice after 8000 BCE.**
- DATED-1 ends at 10 ka. Its 10 ka slice still has about 163,000 km² of ice over the Scandinavian mountains.
- Stroeven et al. 2016 (QSR 147:91, open copy at https://apo.ansto.gov.au/bitstreams/7ba08336-e42a-41f1-b9cf-48aa318c5a5c/download) states that the last remnant "vanished after 9.7 cal kyr BP" in the Sarek Mountains, which is about 7,750 BCE.
- So the 7000 and 6000 BCE slices have no Fennoscandian ice.

**Greenland and Antarctica:** these are present-day outlines from Natural Earth 1:50m Glaciated Areas, plus Antarctic Ice Shelves for Antarctica (public domain): https://www.naturalearthdata.com/downloads/50m-physical-vectors/50m-glaciated-areas/
- The same outline is repeated for all five years, at confidence "low".
- In reality the ice extended beyond today's margins in the early Holocene: Greenland onto parts of its shelf, Antarctica into the Ross and Weddell seas.
- Lambeck et al. note that some Greenland margin retreat happened during the 6–4 ka climate optimum.
- The Antarctic ring passes through the pole along the ±180° seam (…, [180, −77.9], [180, −90], [−180, −90], [−180, −77.9]). That is standard for lon/lat data, but a renderer may draw it as a line from the pole.

Processing:
- Unioned each dataset, then removed parts under 2,500 km² and holes under 2,500 km².
- Simplified with a 0.1° tolerance, keeping topology. This gives about 0.25° effective detail.
- Rounded coordinates to 0.001°. Every ring is closed and every polygon is valid (checked with shapely).
- Outer rings run counter-clockwise and holes clockwise.
- Antarctica's thin gaps between the ice shelves and grounded ice were filled.
- NADI-1 includes part of the NW Greenland margin. I clipped it east of a Nares Strait / Baffin Bay centreline so it doesn't overlap the Greenland outline.
- I rendered every year in polar projection to check the shapes.

Polygons per year: 30 (10,000 BCE), 29 (9,000), 18 (8,000), 18 (7,000), 26 (6,000). Each year includes 6 Greenland and 2 Antarctic polygons.

Main shapes (km² after simplification):
- **10,000 BCE:**
  - Laurentide joined to Innuitian: 7.38 M
  - Cordilleran remnant: 356 k plus smaller pieces
  - Scandinavian: 1.11 M
  - Svalbard: 91 k
  - Franz Josef Land: 54 k
  - Novaya Zemlya: 27 k
  - Scottish Loch Lomond ice cap: 8 k
  - Small Newfoundland and Gaspé caps
- **9,000 BCE:** Laurentide 6.76 M; Scandinavian 698 k.
- **8,000 BCE:** Laurentide 5.41 M; Innuitian 429 k; Scandinavian 163 k.
- **7,000 BCE:** Laurentide 4.00 M (still over Hudson Bay).
- **6,000 BCE:** after the Hudson Bay collapse (8.5–8 ka in NADI-1), two remnants: Foxe–Baffin 805 k and Labrador–Québec 711 k. Also Innuitian caps (largest 131 k) and Baffin ice caps.

How confidence was set: within 0.5° of each polygon, I measured the area between the MAX and MIN margins as a share of the polygon's area. Under 35% is high, under 100% is medium, otherwise low. Polygons under 20,000 km² are capped at medium. The resulting labels are:
- Laurentide: high at 10,000 and 9,000 BCE, medium afterwards.
- Scandinavian: high, medium, medium.
- Small Cordilleran, Appalachian and Arctic-island caps: mostly low.

The names (Laurentide, Cordilleran, Innuitian, Svalbard, and so on) are my labels, assigned by location. The source files don't name individual polygons.

## Open uncertainties
- Each slice is a snapshot about 50 years from the atlas year. For example, 10,000 BCE uses 12.0 ka, which is 10,050 BCE. That error is negligible next to the 100–500-year margin uncertainty Stroeven gives for post–Younger Dryas Fennoscandia.
- The marine-terminating margins are the least certain: Hudson Strait, the Barents and Kara seas, and the Arctic channels.
- NADI-1 is the 2023 update of Dalton et al. 2020. I didn't download the 2020 GHub files (https://theghub.org/resources/4878), because the download may need a login and NADI-1 replaces them.
- Glacial lakes such as Agassiz–Ojibway and the Baltic Ice Lake are not included.
