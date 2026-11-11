# Pallava kingdom: gaps in the border data (`sa-pallava`)

File: `content/supplements/sa-pallava.json` (layer id `sa-pallava`, 353 to 897, `replaces: []`).
6 regions, all `name` = `key` = "Late Pallava Empire" (the Cliopatria realm's name, so they share its colour and open
the `pallava-empire` profile, 275–897). 1 site (Kanchipuram), 18 sources.

## The gaps
Cliopatria's "Late Pallava Empire" (`public/data/clio/index.json`) has two holes:
- 353–601: its shape lies north and inland (353–450: Cuddapah–Chittoor, 13.5–15.9°N; 451–601: the Krishna–Penner
  country with Nellore, 14.1–15.9°N). Kanchipuram (79.70E, 12.83N) and Tondaimandalam are in no state at all.
- 806–897: the realm ends in 805, although the later Pallavas ruled at Kanchi until Aditya I Chola annexed
  Tondaimandalam c. 897. Kanchipuram is again empty in every year 806–897.

## Slices drawn

| Years | Rulers | Extent drawn | Why it changes |
|---|---|---|---|
| 353–450 | Vishnugopa I to Simhavarman II | Tondaimandalam to about 12.6°N plus the Nellore coast to the Gundlakamma (about 3.3 deg²) | Cliopatria's Pallava shape is inland only |
| 451–554 | Simhavarman II to Simhavarman III | Tondaimandalam round Kanchi (2.4 deg²) | Cliopatria's shape now covers Nellore |
| 555–601 | Simhavarman III, Simhavishnu, Mahendravarman I | Tondaimandalam (2.2 deg²) | Cliopatria's Chalukya polygon takes the north edge from 555; Kalabhras still drawn south |
| 806–845 | Dantivarman | Pallava core round Kanchi, Mamallapuram, Uttaramerur, south to about 12.2°N (1.6 deg²) | Pandya encroachment; Rashtrakuta polygon covers the north |
| 846–868 | Nandivarman III | Tondaimandalam and Naduvil Nadu to the Vellar (2.8 deg²) | Recovery after Tellaru |
| 869–897 | Nripatunga, Kampavarman, Aparajita | to the Kollidam, including Bahour (3.5 deg²) | Nripatunga's recovery of the south |

## Method
- Base extents were drawn by hand on a lon/lat grid from the regions named in cited statements: Tondaimandalam =
  the Arani, Kosasthalaiyar and Palar–Cheyyar basins, from Pulicat Lake to north of the Ponnaiyar (Wikipedia,
  Tondaimandalam, citing Champakalakshmi 1993); the Krishna–Penner coast (Pallava dynasty: Skandavarman's
  dominions; Simhavarman II's recovery to the Krishna mouth); Simhavishnu's conquest to the Kaveri (Simhavishnu;
  Kalabhra dynasty); Dantivarman's kingdom "in and around Kanchipuram" (Dantivarman); Tellaru near Vandavasi,
  Kudamukku (Kumbakonam) and the Arisil river (Srimara Srivallabha); the Bahour plates of Nripatunga's 8th year
  (Nriputungavarman); Sripurambiyam near Kumbakonam and Chola gains round Thanjavur (Battle of Thirupurambiyam,
  Aditya I). The coast was drawn slightly offshore, since the app clips reconstruction layers to land.
- Checked against Schwartzberg's plates on DSAL, fetched through DSAL's IIIF service: "Gupta-Vakataka age,
  c. 300–550" (Pallavas labelled along the coast from the Krishna through Tondaimandalam; the Kalabhras noted as
  conquerors of "southern Pallava domains" in the late 4th century; Banas and Gangas to the west) and "Gurjara-Pratiharas,
  Palas and Rastrakutas, c. 700–975" (Pallavas labelled from Udayagiri and Nellore to Uttaramerur, Pallava
  inscriptions at Kalahasti and near Thanjavur; notes "890 overthrown by their Cola feudatory"). The plates have
  labels, not boundary lines; nothing was copied from them.
- Each base was rasterised at 0.02° and cut back, year by year, wherever the atlas already draws a state: all
  Cliopatria realms active that year (with `content/corrections.json` clips, hides and crop boxes applied; this
  includes Cliopatria's own Pallava shape, so the regions join it without overlap) and every region of the other
  `content/supplements/*.json` layers. Slices merge consecutive years whose cut shape changes by under 2%,
  and each slice is the intersection of its years' shapes, so it never overlaps a state drawn in any of its years
  (checked year by year at raster resolution: 0 overlapping cells). Strips narrower than about 0.16° (the
  offshore gap between Cliopatria's coarse coasts and the sea) were removed by a morphological opening, and pieces
  under 0.3 deg² dropped. Rings were traced from the raster and simplified (Douglas-Peucker, 0.01°).
- States the cut stops at: Kalabhra Dynasty (353–601), Western Ganga dynasty (sa-ancient), Vishnukundina dynasty
  (sa-ancient, 420–), Vakataka Kingdom, Chalukya Dynasty (555–), Rashtrakuta Dynasty (806–897, reaching
  south to about 13.0°N and covering Nellore, Kalahasti and Tirupati), Chola Empire (850–897), Pandya Dynasty.
- Renders over the relief basemap for the first and last year of every slice were checked visually.

## Uncertainties
- Southern edge in 353–601: the regions stop at Cliopatria's Kalabhra polygon (about 12.6°N east of Kanchi, so
  Uttaramerur is outside). Upinder Singh (cited on Wikipedia, Kalabhra dynasty) says the Kalabhras were not in
  power near the Penner and Vellar in the 4th century, and the 458 Lokavibhaga colophon dated by Simhavarman,
  "Lord of Kanchi", was copied at Patalika (Cuddalore), so the Pallava south probably reached further. Wikipedia's
  statements that the Cholas drove the Pallavas from Kanchi in the mid-4th century and that the Pallavas
  recaptured it from the Kalabhras in the 6th are marked "citation needed" and were not followed.
- Simhavishnu's conquest to the Kaveri (c. 575) is not visible: Cliopatria draws the Kalabhras there until 601, and
  the base for 575–601 is otherwise identical once cut, so 555–601 is one slice. Simhavishnu's dates vary
  (Sastri 555–590, Sen 575–600, Mahalingam 575–615).
- Simhavarman II's recovery of the coast up to the Krishna mouth (436) is not drawn: the Vishnukundinas (sa-ancient),
  Vakatakas and from 555 the Chalukyas already occupy that coast.
- 818–845: no Dantivarman inscriptions; the Telugu Choda Srikantha occupied Tondaimandalam with a junior Pallava,
  Abhimanasiddhi, as ruler. Drawn as Pallava throughout, with the interregnum in the note.
- The north after 805: Cliopatria's Rashtrakuta polygon covers Nellore, Kalahasti and Tirupati in all years
  806–897, although Schwartzberg places Pallava inscriptions at Kalahasti and the Rashtrakuta hold over Kanchi
  (803) was brief. Not drawn, as instructed (no overlaps).
- Southern edges in 806–897 (about 12.2°N, the Vellar, the Kollidam) are reconstructions from battle sites and
  grants, not from boundary descriptions. The Battle of Tellaru is dated 830 on Wikipedia, which conflicts with
  Nandivarman III's accession in 846 by the dates used here; the note says so.
- End date: Wikipedia (Aparajita Varman, Aditya I) gives c. 897; Sastri (cited on Wikipedia, Tondaimandalam) has
  the defeat of Aparajita about 890, and Schwartzberg notes 890 and 893. The layer follows c. 897, matching the
  profile, and Cliopatria's Chola Empire covers Tondaimandalam from 898.
- Sripurambiyam is dated 879 (Battle of Thirupurambiyam), 878 (Aditya I) or 885 (Aparajita Varman); the note says
  c. 879–885.

## Not changed
No shared files edited. Cliopatria's Late Pallava Empire is not replaced; the layer only fills its two gaps.
