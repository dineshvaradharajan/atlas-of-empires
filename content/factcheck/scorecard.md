# Map accuracy scorecard

Written by `tools/scorecard.py` on 2026-11-21. Each row is one check of the map against an independent reference (or, for map lint, against itself); the full report is linked. Figures in brackets are the change since the previous scorecard (2026-11-21).

A mismatch is a lead, not a verdict: each one is checked against a published source before the map is changed (the reports' *checked by hand* sections record those verdicts).

| Check | Reference | Years | Result | Report |
|---|---|---|---|---|
| claims | Sourced claims (content/borders/claims-*.json) | all years | 1,654 of 1,665 claims pass | [border-check.md](border-check.md) (2026-11-21) |
| cow | Correlates of War territorial changes v6 | 1816–1991 | 331 of 582 transfers within a year | [cow-check.md](cow-check.md) (2026-11-21) |
| cshapes | CShapes 2.0 (ETH Zurich) | 1886–1991 | 90 wrong-owner and 124 blank runs to check | [cshapes-check.md](cshapes-check.md) (2026-11-21) |
| awmc | AWMC (Ancient World Mapping Center) | 500 BCE–314 CE | median shape overlap 76% across 9 layers | [awmc-check.md](awmc-check.md) (2026-11-21) |
| chgis | CHGIS V6 (Harvard, Fudan) | 221 BCE–1911 | atlas covers 99% of Chinese-administered land (median year) | [chgis-check.md](chgis-check.md) (2026-11-21) |
| geo | historical-basemaps (Ourednik) | 3000 BCE–2000 | 94.5% of land agrees 1880–2000, 56.3% before 1816 (-0.2) | [geo-check.md](geo-check.md) (2026-11-21) |
| lint | Map lint (no reference: drawing faults) | sampled years, war stages | 1,902 drawing problems listed | [map-lint.md](map-lint.md) (2026-11-21) |

## claims: Sourced claims (content/borders/claims-*.json)

- Claims that pass: 1,654 of 1,665
- Overlapping states: 231
- Dates off from Wikidata: 661
- Areas off: 83
- Gaps and jumps: 343

*ran in 20 s; script `tools/borders/check_borders.py`*

## cow: Correlates of War territorial changes v6

- Transfers on the right year (or the next): 266
- One year off: 65
- Two or more years off: 130 (-1)
- Change never drawn: 56
- Independences within a year: 137 of 181

*ran in 7 s; script `tools/check_cow.py`*

## cshapes: CShapes 2.0 (ETH Zurich)

- Disagreements over 10,000 km² (runs of years): 587
- … land given to a different state in peacetime: 90 (-1)
- … CShapes has a state, the atlas draws nothing: 124 (+1)
- State area off by more than 10%: 135
- Independence dates 2+ years off: 54
- Realms lying mostly outside their state: 24

*ran in 37 s; script `tools/check_cshapes.py`*

## awmc: AWMC (Ancient World Mapping Center)

- Roman Republic, 60 BCE: 61% overlap
- Roman Empire, 117 CE: 76% overlap
- Roman Empire, 200 CE: 82% overlap
- Roman provinces, 200 CE: 82% overlap
- Roman provinces after Diocletian, c. 314 CE: 83% overlap
- Alexander's empire, 323 BCE: 77% overlap
- Achaemenid Persian Empire at its height (c. 500 BCE): 70% overlap
- Hasmonean kingdom at its height (Alexander Jannaeus, d. 76 BCE): 59% overlap
- Herod's kingdom at his death (4 BCE): 47% overlap

*ran in 6 s; script `tools/check_awmc.py`*

## chgis: CHGIS V6 (Harvard, Fudan)

- Median share of CHGIS land the atlas covers: 99%
- Lowest years: 146 BCE 47%; 201 BCE 49%; 196 BCE 49%; 171 BCE 49%; 121 BCE 53%
- Runs where CHGIS land goes to another realm or is blank: 26
- Runs where the atlas draws China beyond CHGIS: 41

*ran in 6 s; script `tools/check_chgis.py`*

## geo: historical-basemaps (Ourednik)

- Snapshots compared: 47
- Land agreeing, 1880–2000 (weighted by state land): 94.5%
- Land agreeing, 3000 BCE–1815 (snapshots approximate): 56.3%
- Worst snapshot: 200 BCE (from 500 BCE on)

*ran in 16 s; script `tools/check_geo.py`*

## lint: Map lint (no reference: drawing faults)

- Slivers: 606
- Fragments: 130
- Blocky realms: 319
- Overlap pairs: 763
- War grey strips: 84

*ran in 380 s; script `tools/maplint.py`*

## Not covered

No independent reference is checked for the world before 1816 outside the Mediterranean and China (South Asia, Africa, the Americas, South-east Asia) beyond the approximate historical-basemaps snapshots and Wikidata's dates. There, the sourced claims in content/borders/claims-*.json are the only precise test.
