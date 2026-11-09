# Content brief — World History Atlas

An interactive world map (3000 BCE → 2000 CE). The reader drags a time slider through 47 border
snapshots and must understand **the state of the world at that moment**: who ruled what, how far each
empire extended, and what was happening in every region.

Border data: aourednik/historical-basemaps. For each snapshot year Y there is `data/names/<Y>.txt`
listing every polity/culture polygon on the map at that year, largest first, with its area in km².
Negative Y = BCE (e.g. `-323.txt` = 323 BCE; `-1.txt` = 1 BCE).

Snapshot years: -3000 -2000 -1500 -1000 -700 -500 -400 -323 -300 -200 -100 -1 100 200 300 400 500 600
700 800 900 1000 1100 1200 1279 1300 1400 1492 1500 1530 1600 1650 1700 1715 1783 1800 1815 1880 1900
1914 1920 1930 1938 1945 1960 1994 2000

## Regions (use these exact keys — they mirror the 12 rows of the SenseForMaps decade timeline poster)

| key | covers |
|---|---|
| `southern-africa` | Africa south of the equator incl. Madagascar |
| `northern-africa` | Sahara, Sahel, West Africa, Nile valley, Horn, Maghreb |
| `europe` | Europe incl. European Russia and Anatolia's Aegean fringe when Greek |
| `middle-east-south-asia` | Anatolia, Levant, Mesopotamia, Arabia, Iran, Afghanistan, Indian subcontinent |
| `north-central-asia` | Siberia, Central Asian steppe, Transoxiana, Mongolia's western steppe |
| `east-asia` | China, Mongolia, Korea, Japan, Tibet |
| `southeast-asia` | Mainland SE Asia, Indonesia, Philippines |
| `northern-north-america` | Canada, Alaska, Greenland, Arctic |
| `southern-north-america` | USA, Mexico, Central America, Caribbean |
| `northern-south-america` | Andes north of ~20°S, Amazon, Guianas, Brazil |
| `southern-cone` | Chile, Argentina, Uruguay, Paraguay, southern Brazil |
| `australasia` | Australia, New Guinea, New Zealand, Pacific |

## Rules
- Historically accurate, mainstream scholarship. Where dates are uncertain say "c." — never invent rulers.
- Name the actual ruler/dynasty **at that snapshot year** (e.g. at 323 BCE: Alexander just died, Perdiccas regent).
- Where the map polygon name differs from the usual historical name, still use exact map names in `map` fields.
- Write plainly for a curious general reader (age 14+). No markdown inside strings.
- Output must be valid JSON (validate with `python3 -c "import json;json.load(open(PATH))"` before finishing).
