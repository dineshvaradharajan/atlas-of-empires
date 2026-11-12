# South Asia reconstruction layer, 1550–1857 (`sa-earlymodern`)

File: `content/supplements/sa-earlymodern.json`. 68 regions for 42 states. `replaces: ["Kingdom of Mysore"]`: the layer redraws Mysore for its whole Cliopatria life (1572–1799) and on to 1857. Nothing else is replaced. Regions of different states never overlap in the same year; this was checked by a point-sampling script at 0.02° steps.

## How the gaps were found
The map was rendered as readers see it (Cliopatria plus `corrections.json`, using `tools/borders/borders.py`) for 1560, 1600, 1650, 1700, 1720, 1750, 1770, 1790, 1810, 1830, 1850 and 1856, over a modern land mask. These areas were blank:
- Kerala and Canara in every year.
- The southern peninsula after Cliopatria's Vijayanagara ends in 1571.
- Gondwana (central India) until the Maratha outline appears in 1752.
- The Brahmaputra valley and the north-eastern hills.
- The Kumaon and Garhwal hills and Ladakh.
- Rajputana and Kutch after the Mughal outline is cropped to Delhi (1752 onwards).
- Rohilkhand in the 1750s–60s.
- Balochistan.
- Awadh after 1802, Hyderabad after 1798 and Mysore after 1799. Cliopatria's "British Empire" polygon covers the princely states after c. 1818, so they are drawn on top of it to 1857.

## States drawn (years)
- **South:**
  - Venad 1550–1728, then Travancore 1729–1752 and 1753–1857.
  - Cochin 1550–1857.
  - Calicut (Zamorin) 1550–1765.
  - Keladi Nayakas 1565–1762.
  - Mysore in 8 slices: 1572–1609, 1610–72, 1673–1762, 1763–65, 1766–75, 1776–91, 1792–98, 1799–1857.
  - Vijayanagara (Aravidu) 1572–1614 and 1615–1646.
  - Nayaks of Gingee 1572–1649.
- **Deccan and centre:**
  - Hyderabad 1799–1803, 1804–53 (with Berar) and 1854–57.
  - Nagpur (Bhonsle) 1818–1853.
  - Satara 1818–1848.
  - Indore (Holkar; Indore–Nimar and Rampura blocks) 1818–1857.
  - Gwalior (Scindia; northern and Malwa blocks) 1846–1857. The map already has 1820–45 as a relabelled Maratha polygon, and the northern block continues that polygon.
  - Baroda (Baroda and Kadi blocks) 1818–1857.
  - Gond kingdoms: Garha 1550–63, Garha-Mandla 1564–1780, Deogarh 1590–1742, Chanda 1550–1751.
  - Bastar 1550–1751.
  - Ratanpur (Haihayas of Chhattisgarh) 1550–1740.
- **North and west:**
  - Mewar 1550–1614 and 1752–1857.
  - Marwar, Amber/Jaipur, Bikaner, Jaisalmer, Kota, Bundi and Bharatpur, all 1752–1857.
  - Kutch 1550–1857.
  - Rohilkhand 1748–1774.
  - Awadh (reduced) 1803–1856.
  - Kumaon 1550–1790.
  - Garhwal 1550–1803, then Tehri Garhwal 1815–1857.
  - Ladakh 1550–1842.
  - Sikkim 1642–1774, 1775–1834 and 1835–1857.
  - Khanate of Kalat 1666–1757 (Brahui core) and 1758–1857 (with Makran, Kharan, Las Bela and Kachhi).
- **North-east:**
  - Ahom 1550–1614, 1615–1681 and 1682–1826.
  - Koch kingdom 1550–1580.
  - Koch Bihar 1581–1710 and 1711–1857.
  - Koch Hajo 1581–1612.
  - Dimasa (Kachari) 1550–1749 and 1750–1832.
  - Jaintia 1550–1835.
  - Manipur 1550–1857.
  - Tripura 1550–1732 and 1733–1857.

## Maps traced and how
- *Imperial Gazetteer Atlas of India*, plate 28 (India 1765 and 1805) and plate 29 (India 1837 and 1857), public-domain scans on Wikimedia Commons (URLs in the file's `sources`). Neither plate has a graticule good enough to fit numerically at this scale: the meridians converge, a conic projection. So outlines were placed by named towns, rivers and coasts of known latitude and longitude, and then compared by eye with the plates. The plates were used for Travancore, Cochin, Mysore (1765/1805/1837/1857), the Nizam's dominions with and without Berar, the Bhonsle state (1837), Oudh (1837), Rohilkhand and Kumaon (1765), Cutch, Assam, Cooch Behar, Tipperah and Sikkim.
- The states the plates do not separate (each Rajput state, the Holkar, Scindia and Gaekwad blocks, the Gond and north-eastern kingdoms, Kalat, Ladakh) are reconstructed from rivers, hill lines and the later (1909) princely-state borders. They are approximate at roughly 0.1–0.3°.
- Gwalior's northern block reuses the map's own Cliopatria geometry for 1820–45.
- Coastal regions run offshore; the app clips supplement regions to the coastline.
- Every slice was rendered over the app's map (PNG via qlmanage) for 1560, 1600, 1650, 1700, 1740, 1765, 1785, 1805, 1820, 1840 and 1855, and checked against the plates.
- Schwartzberg's *Historical Atlas of South Asia* (DSAL) was **not** checked plate by plate, so it is not cited as a check.
- Dates and rulers come from the infoboxes and lead sections of the Wikipedia articles listed in `sources`, all fetched through the Wikipedia API.

## Skipped, and why
- **Deccan sultanates** (Ahmadnagar, Bijapur, Golconda, Bidar, Berar): already drawn by Cliopatria to their fall. "Deccan sultanates" in the audit is the collective, a duplicate.
- **Kingdom of Kandy:** already drawn, through the Dutch and British Ceylon relabels (1687–1814) and "Independent Sinhalese kingdoms" before that. Kotte (ended 1597) lies mostly before this period and belongs with the generic Sinhalese polygon.
- **Kingdom of Nepal / Gorkha:** drawn ("Gorkha Kingdom", "Kathmandu", "Nepal").
- **Bhutan:** drawn.
- **Sikh misls:** drawn ("Sikh Confederacy" 1762–1806, "Sikh Empire" 1799–1848). Patiala and the other cis-Sutlej states were left for the princely-states work.
- **Nawabs of Bengal** (1718–61), **Carnatic** (1713–1802), Awadh before 1803, Hyderabad 1727–98: drawn by Cliopatria.
- **Maratha houses before 1818:** they sit inside the map's Maratha Empire outline, so drawing them would double the confederacy.
- **Talpur Sindh:** drawn from 1820. Kalhora Sindh (1701–83) and Bahawalpur (1748–) were not done, for lack of time. Their extents also overlap the Durrani outline.
- **Smaller states left as gaps:** Kolathunadu (north Malabar), Coorg, Chitradurga, Sira, Kurnool, Pudukkottai/Ramnad/Sivaganga, Kolhapur, Sirohi, Dungarpur, Banswara, Alwar, Karauli, Tonk, Bhopal, the Orissa Garhjat states, the Punjab hill states (Kangra, Chamba, Jammu), Baltistan, Rampur, Benares. Bhopal and Tonk were not done for lack of time; the rest are minor and better handled as princely states.
- **Audit entries after 1857** (Dominions, Burma etc.): out of period.

## Main uncertainties
- **Overlaps with the base map.** Several regions are deliberately drawn over Cliopatria outlines that wrongly or loosely include them: the Himalayan kingdoms, Mewar 1550–1614, Kutch and the Gond kingdoms inside the Mughal outline; Kalat 1758–c. 1820 inside the Durrani outline; Garha-Mandla 1752–80 inside the Maratha outline; the princely states 1818–57 inside the "British Empire" polygon; Ladakh 1834–42 possibly inside the Sikh Empire. Each note says so.
- **Rajput states.** They are drawn only from 1752, when the Mughal outline stops covering Rajputana. Suraj Mal's larger Jat dominion is not drawn. See "Rajputana redrawn state by state" below for the 2026 rework.
- **Mysore under Hyder Ali and Tipu.** The 1776–91 northern frontier and the post-1792 cessions (Wayanad, Sonda) are mainstream simplifications.
- **Aravidu Vijayanagara and Gingee.** The frontiers against Golconda and Bijapur are rough, and the end dates (1646, 1649) are the conventional ones.
- **North-east.** The Ahom western frontier around Guwahati changed hands repeatedly (1615–82), and only the Barnadi convention is drawn. The date of the Dimasa move to Khaspur (1690s–1750s) is disputed; 1750 is used. The extent of Tripura's plains before 1733 is approximate.
- **Kalat and Sikkim.** Kalat's western limit in Makran and Sikkim's western limit before the 1770s are conventional.
- **Deogarh.** The fall is dated 1743 (Raghoji's control); Wikipedia's Nagpur article gives 1739.
- **Rohilkhand.** Its start year (1748) is a choice; Rohilla autonomy began in the 1730s–40s.

## Rajputana redrawn state by state (November 2026)

At 1803 the map showed hatched gaps between the Rajput states, because the layer drew only Mewar, Marwar, Amber, Bikaner,
Jaisalmer, Kota, Bundi, Bharatpur and Cutch, as coarse outlines (9–23 points) that did not meet. Rajputana (and Bahawalpur)
for 1752–1857 is now one gap-free set of outlines; Cutch and Mewar 1550–1614 are unchanged.

**States added:** Bahawalpur (1748–1857), Alwar (1775–), Dholpur (1805–), Karauli, Kishangarh, Sirohi, Dungarpur, Banswara,
Partabgarh, Shekhawati (key "Kingdom of Amber", same colour as Amber), Jhalawar (1838–), Tonk (Holkar's pargana 1753–1805,
Amir Khan's grant 1806–16, Tonk State 1817–57 with Aligarh, Nimbahera, Chhabra, Pirawa and Sironj), Rampura–Aligarh under
Holkar (1753–1816), Ajmer under the Scindias (1752–1817), then British Ajmer (1818–22) and Ajmer-Merwara (1823–57).
**Time slices of existing states:** Amber with Tonk (1752), with the Naruka lands (1753–74), without Alwar (1775–); Mewar with
Merwara and Nimbahera (1752–1816), with Merwara (1817–22), alone (1823–); Kota with Jhalawar (1752–1837), alone (1838–).
Dates come from the Wikipedia articles in the layer's `sources` (fetched through the Wikipedia API); where two articles
disagree the region note says so (Tonk to Holkar: 1753 in *Madho Singh I*, 1757 in *Malhar Rao Holkar*).

**How the outlines were made.**
1. *Imperial Gazetteer Atlas* plate 36, "Rajputana with Ajmer-Merwara" (1909, 1931 edition; 4934×4072 scan on Wikimedia
   Commons), was georeferenced by a second-order polynomial fitted to 30 towns of known position (Jaipur, Jodhpur, Bikaner,
   Udaipur, Ajmer, Kota, Alwar, Bharatpur, Dholpur, Jaisalmer, Barmer, Sirohi, Delhi, Dungarpur, Banswara, Palanpur, Umarkot,
   Sikar, Tonk, Bundi, Chittor, Nagaur, Pali, Karauli, Kishangarh, Jhunjhunu, Churu, Bhilwara, Neemuch, Deeg). Residuals are
   up to ~35 px, about 0.05–0.07°. (The printed graticule could not be traced reliably.)
2. The outer outlines come from the princely-states layer (1909 outlines). Its grouped polygons were split along boundaries
   read off the warped plate at 650–1100 px per degree: Alwar | Bharatpur (round the Nagar salient), Jaipur | Bharatpur,
   Alwar | Jaipur, Bharatpur | Karauli | Dholpur, Karauli | Jaipur (the yellow ribbon that leaves Hindaun and Gangapur to
   Jaipur), the Tonk and Rampura–Aligarh blocks, Bundi | Jaipur, the Mahi between Dungarpur and Banswara, Banswara |
   Partabgarh, Partabgarh | Mewar, Kota | Jhalawar. Nimbahera and Pirawa are outlined from the plate. Shekhawati's southern
   edge is not printed on the plate; it follows the later Sikar and Jhunjhunu district limits (approximate). Ajmer-Merwara
   is the gap the 1909 states leave (with the Kekri tract), split north of Beawar.
3. Overlaps were resolved by priority (traced small states first), remaining gaps and slivers were filled cell by cell
   (0.01°) from the nearest state, and all outlines were simplified together (shapely `coverage_simplify`, 0.012°), so
   neighbours share their edges exactly. Enclaves were removed: Tonk inside Jaipur is handled by splitting Jaipur into a main
   piece and the Uniara tract; Nimbahera and Pirawa reach the Gwalior and Indore borders as on the plate.
4. The coarse Scindia (1846–57) and Holkar Rampura–Bhanpura (1818–57) blocks were trimmed where they overlapped Dholpur,
   Karauli, Kota, Tonk's districts and Partabgarh. Point-sampled overlap between regions of different states: none.

**Keys.** No region uses a Cliopatria realm name as its key: the app shows a key under the name of the first region that
uses it, so a key such as "Maratha Empire" would rename that realm everywhere. Holkar's and Scindia's districts therefore
have their own keys and colours; their notes say they belonged to the Maratha chiefs.

**Corrections added** (content/corrections.json): Durrani Empire cut out of Rajputana 1762–71 (five boxes; 1764–71 it had
still covered Marwar, Jaisalmer, Bikaner and Ajmer west of the 75.5° crop); Mughal Empire cut out of Alwar, Bharatpur and
Karauli for 1752–1803; Maratha Empire cut out of Alwar for 1775–1804; Sikh Empire cut out of Bahawalpur south of the Sutlej
for 1820–48. Each was checked not to open new blank land outside the layer, except two slivers: the British Firozpur wedge
north of Bharatpur (about 0.03 sq°, 1752–1803) and the Sirsa edge north of Bikaner (about 0.1 sq°, 1762–71).

**Place index.** tools/placeindex.py used only Cliopatria with clip/hide, so "who ruled here" at Udaipur gave nothing for
1744–1823 and at Jodhpur and Ajmer gave the uncropped Mughal outline until 1856. It now applies every correction (crop, cut,
relabel, asPeople) and includes the reconstruction layers (with their `replaces`; archaeological cultures excluded).

**Checks.** At 1803 no land inside Rajputana is uncovered (shapely over the map's own state for 1780–1857 at sampled years);
the only uncovered Rajputana land in any year is Dholpur in 1752–c.1779, before the map's Maratha outline reaches it, which
this pass did not fill (the Jats of Bharatpur and then Mirza Najaf Khan held it; dates not established here). Border claims
are unchanged (1647/1665). Checked in the app at 1803: all states drawn, and the place panel names a state at Udaipur,
Jodhpur, Ajmer, Tonk, Alwar, Bahawalpur, Sirohi, Dungarpur, Banswara, Karauli, Dholpur, Kishangarh, Sikar, Jhalrapatan,
Kota, Bundi, Jaisalmer and Bikaner.

**Uncertain or left out.** Nimbahera before 1817 is drawn with Mewar, although Maratha chiefs held it for part of that time
(dates not established). Rampura–Aligarh before 1817 is assumed to have followed Tonk under Holkar. Jhalawar 1838–57 uses
its 1909 extent. Karauli's rulers' reign dates were not checked. Godwar (taken by Marwar from Mewar in the 18th century) and
Umarkot (Jodhpur's until 1813) are not drawn as changes. The app places the Mughal Empire's label at the centre of its
uncropped outline, so in 1762–1803 the label "Mughal Empire" appears over Bikaner and Marwar although the outline is not
drawn there (an app issue, not a data one). Sindh before 1820 and northern Gujarat remain blank next to Rajputana.
