# Fact-check: Princely states of India (`content/supplements/princely-states.json`)

This layer sits on top of Cliopatria's single "British Raj" shape (it does not replace it) for 1858–1948.
It has 75 time-bounded regions, all with key `Indian princely states` and kind `princely state`. 41 are single
states or detached parts of one state; 34 are groups of smaller states, split by agency and by contiguity.
Each region is one closed ring in [lon, lat] with no holes, rounded to 0.001°, with vertices about every
0.05–0.1°. A Shapely check found no overlaps between regions that are active in the same years, and every ring
is valid. There are also 15 capital sites; each falls inside its own state.

## Maps used

All the maps are public domain and come from Wikimedia Commons, which was fetched politely.

| Key | Map | Use |
|---|---|---|
| main | J. G. Bartholomew, *Political Divisions of the Indian Empire*, Imperial Gazetteer Atlas of India (1909), plate 20 (1498×1223 px) | Tehri Garhwal and Makran. Also used to check every OpenHistoricalMap outline |
| raj | IGI 1909 *Rajputana with Ajmer-Merwara* | Rajputana states |
| ci | IGI 1909 *Central India* | Gwalior, Indore, Bhopal, Rewa, Central India groups |
| bn / bs | IGI 1909 *Bombay (northern section) and Sind* / *Bombay (southern section)* | Baroda divisions, Junagadh, Kathiawar, Gujarat and Deccan groups |
| cp | IGI 1909 *Central Provinces* | Bastar, Surguja, Chhattisgarh groups |
| or | *Orissa Tributary States* (detail of the IGI Bengal map) | Mayurbhanj, Orissa group |
| pj | IGI 1909 *Punjab* | Patiala, Punjab plains and hill groups |
| ms | IGI 1909 *Madras (southern section) with Mysore, Coorg and Travancore* | Pudukkottai; Cochin–Travancore check |
| nw | IGI 1909 *North-West Frontier Province and Kashmir* | Chitral (hand-drawn) |

The open GIS data comes from **OpenHistoricalMap**, whose data is CC0 unless a feature carries a `license` tag
(https://www.openhistoricalmap.org/copyright). None of the relations used carries one. They were fetched with
the OHM Overpass API, and their relation pages resolve. The relations are: Hyderabad 2922156, Central Provinces
and Berar 2922175 minus Central Provinces 2922174 (giving Berar), Mysore 2922159, Jammu and Kashmir 2922316,
Travancore 2922413 (which also covers Cochin; see below), Kutch 2922108, Kolhapur 2922008, Sikkim 2922714,
Manipur 2923681, Hill Tipperah 2923675, Bahawalpur 2857299, Khairpur 2857308, Kalat 2922449, Kharan 2922441,
Las Bela 2922440 and Baroda 2922111 (only the Amreli, Kodinar and Okhamandal pieces).
On the georeferenced 1909 map, each of these lines up with the yellow "native state" colour within a few
kilometres. OHM's Gwalior, Rewa and Baroda were too incomplete to use. They were redrawn from the IGI maps.

## How the maps were georeferenced

- **Provincial maps.** The faint lat/long graticule was found by a global line search on a high-pass
  (median-minus-image) version of each scan. Meridians were fitted as straight lines and parallels as
  arcs. A second pass forced meridian tilt to change linearly with longitude, as on a conic projection,
  and gave all parallels a shared curvature. The degree labels printed on the frame identified each line.
  The line intersections are the control points, 12–20 per map. A 2nd-order polynomial fit gives residuals
  of 0.1–0.7 px RMS, about 0.01°. The Orissa detail has only a 2×2 grid, so it uses an affine fit.
- **Empire map.** 19 graticule intersections were read by eye from zoomed crops. The 3rd-order fit has
  2.6 px RMS, about 0.06°. A modern coastline overlay matches it closely.
- **Cross-checks.** OHM's Rajputana Agency outline falls on the edge of the yellow on the warped Rajputana
  map. The OHM states fit the warped empire map.

## How the outlines were made

1. For each map, "native state" pixels were classified by HSV colour (yellow hue, saturation above a cut
   point set per map from its histogram). Small gaps from text were then closed, and the masks were warped
   onto a 0.02° lon/lat grid.
2. For each named state, hand-drawn **partition zones** (scratch `zones.py`) were intersected with the mask
   of its own provincial map. A zone is generous where the neighbour is British territory, because there
   the colour decides. Where the neighbour is another state, the zone follows the dotted boundary read off
   the warped map at 0.0025–0.005° per pixel. The Bikaner, Jaisalmer and Jodhpur lines were traced closely.
   The others are read to about 0.1°.
3. Whatever is left in an agency's mask becomes **group** regions. Each connected piece is a separate
   region, named after the capitals that fall inside it. Pieces under about 350 km² were dropped.
4. Regions were processed in order: OHM states first, then single states, then groups. Each was simplified
   (0.02°) and cut back from those before it with a 0.0012° margin. Any enclave hole was opened with a
   0.003°-wide slit so that every region is a single ring.

## Grouping choices

- The groups are: Rajputana Agency (other states), Central India Agency (other states), Kathiawar states,
  Gujarat states (Palanpur/Mahi Kantha/Rewa Kantha/Surat), Deccan states (Southern Maratha Country, Satara
  jagirs, Savantvadi), Chhattisgarh feudatory states, Orissa feudatory states, Punjab states and Punjab hill
  states. Saraikela and Kharsawan are drawn on their own.
- 1909 names are used. "Eastern States" (the later agency of the Orissa and Chhattisgarh states) is mentioned
  in the notes rather than used as a group.
- **Shan States: excluded.** They were part of the province of Burma, and Wikipedia's *Princely state* lists
  Burma's 52 states separately from the Indian ones. Burma left British India in 1937.
- **Khasi States: excluded.** OHM's polygon covers the whole Khasi and Jaintia Hills district, including
  British areas. The 25 small states (3,778 sq mi) cannot be separated.
- **Excluded as too small or not resolvable:** Dir and Swat (not clear states in 1909), Cooch Behar and Rampur
  (the empire-map colour was not picked up), Benares, Banganapalle, Sandur and Janjira.
- **Gwalior and Indore** are drawn as their main blocks only. Their interleaved Malwa districts sit inside the
  Central India group, which names "Gwalior (Ujjain district)" and "Gwalior (Mandsaur district)".
- **Kotah** is drawn together with Jhalawar. The 1909 map labels the Shahabad tract "Jhalawar", and the line
  between the two could not be read.
- **Some small states are not separated:** Shahpura is inside Udaipur, and Nabha and Malerkotla are inside
  Patiala.

## Dates (from/to)

- Every region runs from 1858, except three:
  - Chitral from 1885 (allied with the Raj 1885–1947).
  - Sikkim from 1861 (Treaty of Tumlong).
  - Mysore splits into "under British commission" 1858–1880 and "Mysore" 1881–1947 (British administration
    from 1831, rendition in 1881).
- Berar runs 1858–1903 (assigned 1853, joined to the Central Provinces 1 October 1903).
- Regions end in their accession year:
  - Most states: 1947.
  - Jammu and Kashmir: 1947 (Instrument of Accession dated 26 October 1947).
  - Junagadh: 1947 (India took over on 7 November 1947).
  - Bahawalpur and Khairpur: 1947 (Pakistan).
  - Chitral: 1947 (6 November 1947).
  - Hyderabad: 1948 (Operation Polo, 13–18 September 1948).
  - Kalat: 1948 (27 March 1948).
  - Sikkim: 1948, the layer end. It became an Indian protectorate in 1950.
- The Orissa and Chhattisgarh states acceded in 1947, and their merger agreements took effect on
  1 January 1948. They end in 1947.
- Bhopal is also ended in 1947. Its later accession date was not confirmed from a fetched source.

## Uncertainties

1. **Internal boundaries between states** are about ±0.1–0.2° except where traced closely: Bikaner,
   Jaisalmer and Jodhpur, and the OHM states. The weakest are Indore, Bhopal, Gwalior's southern edge, the
   Baroda divisions (Kadi, Baroda, Navsari), Junagadh, Patiala, and the Cochin–Travancore line (cut by hand
   across OHM's Travancore polygon).
2. **Drawn areas.** These come from the polygons and are not official figures. They match the expected sizes
   for Hyderabad (c. 214,000 km²), Mysore, Bikaner, Jodhpur and Rewa. Chitral's hand-drawn outline
   (c. 19,000 km²) is larger than the 14,860 km² that Wikipedia gives from the 1951 census. Cutch includes
   the Great Rann. Jammu and Kashmir follows OHM's frontier, which includes claimed areas.
3. **Colour classification.** It can include cream background or miss pale yellow. Small unnamed pieces are
   labelled by place ("tract near Cambay", "small tract south of Kolhapur") because I could not tell which
   state they belong to. One dubious piece near Dholka was dropped.
4. **The outlines show c. 1909 boundaries for all of 1858–1948.** Later changes are not modelled except Berar
   and the Mysore status change. Examples are the creation of Benares State in 1911 and Kharan's separation
   from Kalat between the 1931 and 1941 censuses.
5. **Population figures are not given.** No fetched source gave reliable figures for every state, so the
   notes give drawn areas only.

Sources fetched: the Commons file pages and OHM pages listed in the JSON, plus these Wikipedia articles:
*Princely state* (565 states, c. 40% of area, subsidiary alliances, suzerainty/paramountcy),
*Political integration of India*, *Kingdom of Mysore*, *Berar Province*,
*Instrument of Accession (Jammu and Kashmir)*, *Khanate of Kalat*, *Bahawalpur (princely state)*,
*Khairpur (princely state)*, *Chitral (princely state)*, *Kingdom of Sikkim* and *Kingdom of Travancore*.

Regions: 75. Validator (`tools/content.py`): no messages about this file.
