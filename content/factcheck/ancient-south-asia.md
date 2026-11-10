# Ancient South Asia, Sri Lanka and Central Asia (10,000 BCE – c. 500 CE)

Files: `content/ancient/sites-south-asia.json` (49 sites) and `content/ancient/cultures-south-asia.json`
(20 cultures). Built from scripts in the researcher's scratch folder; every statement in a summary was checked
against the cited page's text (Wikipedia raw wikitext fetched slowly with the atlas User-Agent, plus the other
pages listed). Britannica, UNESCO (whc.unesco.org), Smarthistory and harappa.com refused automated fetches (HTTP 403),
so UNESCO facts are taken from cited Wikipedia statements. The Sarnath inscription of 2026 is from a news report.

## Counts

- Sites: 49. Evidence: written 21, archaeology 20, disputed 7, legendary 1. UNESCO World Heritage: 15.
  Images: 33, all openly licensed (CC0/PD/CC BY/CC BY-SA). Each was viewed before use.
- Cultures: 20. Evidence: archaeology 19, disputed 1 (Mehrgarh Neolithic).
- Validation: JSON parses; ids unique and kebab-case; rings closed, clockwise, 8–26 points, no self-intersections;
  lon/lat inside 55–92 E, 5–56 N; years ordered (sites sorted by `built`). Every site with a `culture` lies inside
  that culture's ring, except Shortugai, which is a Harappan outpost far beyond the core. That is intended.

## What is included

Sites, earliest first: Bhimbetka, Kumari Kandam (legendary), Bhirrana, Mehrgarh, Jeitun, Rakhigarhi, Sarazm,
Kalibangan, Harappa, Kot Diji, Altyn-Depe, Dholavira, Burzahom, Mohenjo-daro, Gonur Depe, Lothal, Arkaim, Sintashta,
Shortugai, Sinauli, the submerged structures off Dwarka, Sivagalai, Hastinapur, Adichanallur, Taxila, Anuradhapura,
Hire Benakal, Pataliputra (Kumhrar), Keezhadi, Merv, Kodumanal, Pattanam, Ai-Khanoum, Sanchi, Sarnath, the Junagadh
(Girnar) rock inscriptions, Amaravati, the Lumbini pillar, Lauriya Nandangarh, Arikamedu, Ajanta (early caves),
Karla, Bharhut, Tillya Tepe, the Hathigumpha inscription, Takht-i-Bahi, the Iron Pillar of Delhi, Nalanda and
Sigiriya (477–495 CE, inside the ≤ 500 CE window).

Cultures: Balangoda (Mesolithic Sri Lanka), Mehrgarh Neolithic, Jeitun, Kelteminar, Early Harappan, Southern
Neolithic (ashmounds), Ahar–Banas, Northern Neolithic (Kashmir), Mature Harappan, BMAC, Sintashta, Andronovo,
Ochre Coloured Pottery, Late Harappan, Malwa, Yaz, Jorwe, Gandhara grave culture, Painted Grey Ware, and the
Iron Age megalithic cultures of South India.

## Overlaps the integrator should know about

- **Mature Harappan duplicates the Cliopatria realm "Indus Valley Civilization"** (−3000 to −1701 in
  `public/data/clio/index.json`). It is kept because the task explicitly asked for Early, Mature and Late Harappan.
  Drop it, or hide it while the realm is drawn, if the map shows both. Early Harappan (−3300 to −2600) also
  overlaps the realm's first centuries, because the realm begins in 3000 BCE.
- The historical-basemaps "peoples" layer (`public/data/<year>.json`) already has coarse polygons named Kelteminar
  culture, Namazga, Indus valley civilization, Oxus (BMAC), Sintashta, Andronovo, Gandhara grave culture and Iron Age
  megalith cultures. Ours are dated and drawn more tightly. They are not Cliopatria realms, so they are not
  duplicates under the brief.
- Sintashta, Arkaim and Andronovo lie in the southern Urals and Kazakh steppe. A "steppe" researcher may also
  cover them; ids are `sintashta`, `arkaim`, `sintashta-culture`, `andronovo-culture`.
- Megalithic South India: the culture runs c. 1200 BCE–200 CE, but its only extent ends at −300. From −291 the
  map draws the Early Cholas, Pandyas and Cheras, and from −225 the Satavahanas.
- Yaz culture ends at −550, when the Achaemenid realm covers Margiana and Bactria. Painted Grey Ware ends at −600,
  when the Janapada realms begin.

## Disputed and legendary cases (scholarly positions)

1. **Mehrgarh (site and Neolithic culture): disputed dating.** J.-F. Jarrige's excavation chronology puts the aceramic
   Neolithic at c. 7000–5500 BCE (some say as early as 8000 BCE). Mutin et al. (2025, *Scientific Reports*) Bayesian-modelled
   radiocarbon dates on tooth enamel from 23 burials. They found the cemetery began 5200–4900 BCE and lasted two to five
   centuries, with pottery not before the mid-5th millennium. `built` stays −7000 (the long-standing view), and the label
   gives both dates. Source: https://pmc.ncbi.nlm.nih.gov/articles/PMC12000376/
2. **Bhirrana: disputed dating.** The ASI reported two charcoal dates in the 8th–7th millennium BCE and called it the
   oldest Indus site. The same levels held Hakra Ware, dated to the 4th millennium elsewhere, and smelted copper.
   About six other early samples date 3200–2600 BCE. Wikipedia also records criticism of the ASI's ideological
   framing. `built` is −7500 (the claim), and the label says most scholars prefer the 4th millennium.
3. **Keezhadi: disputed dating.** The Tamil Nadu archaeology department reports radiocarbon dates in the
   6th century BCE. The excavator Amarnath Ramakrishna's report (submitted January 2023) proposes the 8th century
   BCE to the 3rd century CE. On 21 May 2025 the ASI asked for "concrete justification" of the 8th–5th century BCE
   phase, plus layer numbers (Scroll.in, 23 May 2025). B. Basak and E. Harsha Vardhan question whether the
   Tamil-Brahmi sherds come from the dated layers. This matches `content/factcheck/sangam.md` §3.
4. **Sivagalai: disputed.** A Tamil Nadu report (*Antiquity of Iron*, K. Rajan and R. Sivanantham, released
   23 January 2025) dated charcoal from iron-bearing layers to 3345–2953 BCE. Rice from an intact urn with iron tools
   dated c. 1248/1155 BCE. Wikipedia (*Iron Age in India*) notes the early dates are disputed: stratigraphic
   disturbance and mixed samples. The map uses c. 1200–700 BCE (rice and a potsherd dated 685 BCE).
5. **Submerged structures off Dwarka: disputed.** S. R. Rao (NIO dives 1983–90) argued for a city-state of
   c. 1500 BCE and identified it with Krishna's Dvaraka. That date rests on a single dated piece. Later NIO surveys
   (Gaur and colleagues) dated the structures to between the historical and late medieval periods, and noted that
   the stone-anchor types range from 2500 BCE to modern times. Wikipedia's *Dwarka* says the anchors point to a port
   of the Middle kingdoms period. Bet Dwarka has one Late Harappan thermoluminescence date (1570 BCE). The NIO
   repository (drs.nio.org) blocks automated access, so the Wikipedia statements are cited. The span is −1500 to
   1500, with the label stating the dispute. The epic events themselves are treated as tradition.
6. **Sinauli: disputed interpretation.** The burials and solid-wheeled carts (c. 2000–1500 BCE) are real. The ASI
   excavators called them horse-drawn chariots of a warrior elite, with Vedic links. Witzel (2019) and Parpola (2020),
   via Wikipedia, note that solid wheels belong to carts, not chariots. Most place the site in the OCP/Copper Hoard
   culture, not the Harappan.
7. **Pattanam: disputed identification.** The KCHR excavators identify it with Roman Muziris. Others favour
   Kodungallur, where no comparable excavation has been made.
8. **Kumari Kandam: legendary.** A Nakkeerar commentary (late 1st millennium CE) tells of Pandya land and the first
   two Sangams lost to the sea. A 15th-century commentary on the Silappatikaram places the lost land south of
   Kanyakumari. Tamil revivalists merged this with the 19th-century "Lemuria" idea, and the name Kumari Kandam
   dates from the 1930s. Plate tectonics disproved Lemuria, and no archaeology supports it. The point (77.5 E,
   7.3 N, in the sea south of Kanyakumari) only marks the traditional location. `built` −10000 and `until` −300
   are placeholders so the point shows in the ancient era; the `dateLabel` says "legendary; no real date". Hide it
   or re-time it if the map needs a different convention.

Other contested points handled inside archaeology/written labels:
- Lothal's basin: a dock (S. R. Rao) or an irrigation tank (Leshnik 1968, Yule 1982).
- Dholavira's phases: 2650–1450 BCE (older view) or 3500–1800 BCE (recent research). Labelled c. 3000–1500 BCE.
- Adichanallur: the Beta Analytic dates are 905–696 BCE. Claims of 3,800 years and 1500 ± 700 BCE are noted as debated.
- Hastinapur: Lal dated the PGW village to c. 1100–800 BCE. The 2021–22 dig reports PGW from c. 1500 BCE. Its link to
  the Mahabharata's Kuru capital (and the Nichakshu flood story) is presented as tradition.
- Bharhut: railings usually c. 125–100 BCE; some recent work argues for the 1st century CE.
- Arkaim: dated c. 2150–1650 BCE (Ural Federal University via Wikipedia). Nationalist speculation is mentioned as
  rejected (Shnirelman).
- Ashokan dates depend on when the reign began: Lumbini c. 249–242 BCE; Pillar Edicts c. 243–236 BCE.
- Jeitun: Wikipedia gives 7200–4500 BCE (after Vidale), but the excavators' radiocarbon suite (Harris, Gosden &
  Charles 1996) puts first occupation near 6000 cal BCE, for a few centuries. The excavators' dates are used.
- Sintashta culture: Wikipedia gives c. 2200–1900 BCE; the type site c. 2100–1800 BCE. Labelled with both.

## Left out, and why

- **Lahuradewa** (claimed 7th-millennium BCE rice): the claim is disputed (Irfan Habib; four of five early dates are
  4220–2879 BCE), but no clear end date or site sequence could be sourced. It is mentioned here only.
- **Bamiyan Buddhas**: radiocarbon-dated to the 6th–7th centuries CE, after the 500 CE cut-off.
- **Mamallapuram and Elephanta**: 6th–8th centuries CE, outside the window.
- **Fa Hien cave and Batadomba lena** (Sri Lanka): covered by the Balangoda culture. Their key dates are far older
  than 10,000 BCE.
- **Northern Black Polished Ware** (c. 700–200 BCE): it coincides with the Mahajanapada and Maurya realms already
  drawn.
- **Namazga culture**: already a basemap people. Altyn-Depe is included as a site, with no culture assigned
  because it lies outside the BMAC cores.
- **Epic sites** (Ayodhya, Kurukshetra, Lanka): their events are traditional, not dated history. Only Hastinapur and
  Dwarka are included, because they have real excavations, and they are labelled accordingly.

## `until` conventions

`until: null` is used only for monuments still standing as monuments, or places still in religious use: the
Anuradhapura sacred city, the Lumbini, Lauriya and Delhi pillars, the Junagadh rock and the Hathigumpha
inscription. Bhimbetka's `until: 1200` is a placeholder for "medieval" (Wikipedia: geometric paintings as recent
as the medieval period). Merv's 1700 stands for "18th century"; Amaravati's 1350 for "still known in the
14th century".

## Sources used (fetched)

- Wikipedia (raw wikitext): every site article named in the JSON `sources`, plus *South Asian Stone Age*,
  *Indus Valley Civilisation*, *Iron Age in India*, *Neolithic ashmounds*, *Gufkral*, *Sanganakallu*, *Muziris*,
  *Pataliputra*, *Major/Minor Pillar Edicts*, *Pillars of Ashoka*, *Dvārakā*, *Bet Dwarka*, *Lahuradewa*,
  *Kumari Kandam*, and the 15 culture articles.
- Mutin et al. 2025 (PMC12000376); Harris, Gosden & Charles 1996 (Cambridge Core abstract).
- Scroll.in, 23 May 2025 (Keeladi); Free Press Journal, 23 Jan 2025 (Sivagalai iron report) and July 2026
  (Sarnath inscribed at the 48th World Heritage Committee session, Busan, 25 July 2026).
- Wikimedia Commons API for image licences and credits.
