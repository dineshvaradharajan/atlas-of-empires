# South Asia fact-check log

Scope: every South Asian statement in `content/eras/*.json` (overview, `regions.middle-east-south-asia`, powers, events) and the South Asian profiles (Indus, Maurya, Kushan, Gupta, Chola, Delhi Sultanate, Vijayanagara, Mughal, Maratha, Sikh, Durrani, British India, Republic of India, Pakistan). Each claim was checked against the four specialist authorities, plus standard references where those were silent or out of date:

- **Schwartzberg**, *A Historical Atlas of South Asia* (1978/1992), DSAL digital edition: https://dsal.uchicago.edu/reference/schwartzberg/ (plates and searchable text).
- **Majumdar** (gen. ed.), *The History and Culture of the Indian People*, 11 vols. Full text read on the Internet Archive: vol. II `ageofimperialuni07bhar`, III `classicalage03bhar`, V `struggleforempir05bhar`, VI (`hcip-6-delhi-sultanate…`), VII `mughulempire00bhar`, VIII `marathasupremacy08bhar`, IX `britishparamount09bhar`.
- **Jadunath Sarkar**: *Shivaji and His Times* (`shivajihistimes00sarkrich`), *History of Aurangzib*, *Fall of the Mughal Empire*, *Mughal Administration* (Internet Archive).
- **Imperial Gazetteer of India** (1907–09), DSAL edition: https://dsal.uchicago.edu/reference/gazetteer/ (full-text search).

Schwartzberg plates are cited by the DSAL section code and title (for example "pl. VI.A.3, The reigns of Jahangir, Shah Jahan, and Aurangzib"). Page numbers refer to Schwartzberg's text section. Where these older works differ from modern consensus, the modern view is used and the difference is noted.

The patch is `content/factcheck/south-asia-patch.json`. Each correction's `old` substring was checked against the live files on 2026-11-09, after the general fact-checkers' edits. All 17 matched exactly once.

## Corrections proposed (17)

### Eras
- [a-ancient −500] overview: "the Buddha and Mahavira preach in the kingdoms of the Ganges plain, where Magadha is rising" → "Magadha is rising among the kingdoms of the Ganges plain, where the Buddha and Mahavira lived and taught around this time (their exact dates are debated)". Reason: most modern scholars now date the Buddha c. 480–400 BCE (the "short chronology"), so "preaching in 500 BCE" rests only on the traditional c. 563–483 BCE dates. Sources: Schwartzberg text p. 166, pl. III.B (Pre-Mauryan Age); https://en.wikipedia.org/wiki/Gautama_Buddha
- [a-ancient −300] regions.middle-east-south-asia: "having given Arachosia and Gandhara to Chandragupta" → "having ceded Arachosia, the Paropamisadae (Kabul region) and probably Gedrosia to Chandragupta". Reason: Gandhara was already Mauryan; the treaty of c. 305–303 BCE ceded the satrapies west of the Indus. Majumdar adds Aria (Herat), which modern scholars doubt. Sources: Majumdar vol. II, p. 59; Schwartzberg text p. 171.
- [b-medieval 400] powers[2].extent: "from the Indus to Bengal" → "from the Punjab to Bengal". Reason: Gupta direct rule did not reach the Indus; the Punjab peoples paid tribute. Sources: Schwartzberg pl. III.D (Gupta-Vakataka Age) and text pp. 179–180; Majumdar vol. III.
- [b-medieval 500] regions.middle-east-south-asia: "(where the Ajanta caves are being painted)" → "(where the Ajanta caves were painted in the later 5th century)". Reason: the later Ajanta caves belong to Harishena's reign (c. 460–480 on Spink's chronology). Vakataka power was collapsing by 500. Sources: Schwartzberg text p. 180; https://en.wikipedia.org/wiki/Ajanta_Caves
- [b-medieval 1100] overview: "the Cholas still rule a maritime empire" → "the Cholas still rule the south, though Sri Lanka broke free in 1070". Reason: Vijayabahu I took Polonnaruva c. 1070, and Chola overseas power had faded by 1100. Sources: Majumdar vol. V, p. 247; Schwartzberg pl. IV.2.
- [c-earlymodern 1700] powers[0].extent: "from Kabul to the far south" → "from Kabul deep into the south, short of the southern tip". Reason: in 1707 the Mughal limit stopped short of Madurai, Travancore and the far south. Sources: Schwartzberg pl. VI.A.3; Majumdar vol. VII (fall of Bijapur in Sept. 1686 and Golconda in 1687).

### Profiles
- [indus-valley-civilisation] summary: "granaries and great public baths" → "possible granaries and, at Mohenjo-daro, a Great Bath". Reason: there is only one known Great Bath, and the "granaries" are a disputed identification. Source: https://en.wikipedia.org/wiki/Mohenjo-daro
- [maurya-empire] peak.note: "some estimates reach 5 million km²" → "estimates range from c. 3.4 to 5.0 million km² (Taagepera 1979; Turchin, Adams & Hall 2006), much of it loosely controlled". Reason: this gives the scholarly range and reflects the modern "network of core regions" view; Schwartzberg (p. 171) calls his own frontiers tentative. Source: https://en.wikipedia.org/wiki/List_of_largest_empires
- [gupta-empire] rulers[3].note: "Founded the monastery-university of Nalanda" → "Traditionally credited with founding…". Reason: the attribution rests on Xuanzang's "Shakraditya", who is usually identified with Kumaragupta I. Sources: Schwartzberg p. 184; https://en.wikipedia.org/wiki/Nalanda
- [chola-empire] rulers[2].note: "conquered Sri Lanka" → "conquered northern Sri Lanka". Reason: Rajaraja annexed only the north (Anuradhapura fell c. 993); the whole island came under Rajendra I. Source: Majumdar vol. V, p. 234.
- [chola-empire] peak.note: "not covered by Taagepera or Turchin" → "…; the Cliopatria map shows only c. 0.5M km² under direct rule". Reason: the 1.0M km² figure is twice the polygon the reader sees on the map. Source: Schwartzberg pl. IV.2; `public/data/clio/index.json` (Chola max 522,021 km², 1028–33).
- [delhi-sultanate] capital: "Delhi (briefly Daulatabad from 1327)" → "…; Agra under the later Lodis". Reason: Sikandar Lodi moved the capital to Agra (c. 1505). Sources: Majumdar vol. VI, chronology (citing p. 145); Schwartzberg pl. V (Lodis).
- [british-india] capital: "New Delhi from 1911" → "Delhi from 1911-12 (New Delhi inaugurated 1931)". Reason: the transfer was announced in December 1911 and the government moved to (Old) Delhi in 1912; New Delhi was inaugurated on 13 February 1931. Source: https://en.wikipedia.org/wiki/New_Delhi
- [british-india] rulers[3].note: "Proclaimed Empress of India" → "Took the title Empress of India in 1876; proclaimed at Delhi on 1 January 1877". Reason: this reconciles the profile (1876) with the 1880 era text and event (1877). Source: Imperial Gazetteer vol. II, pp. 488, 517; vol. IV, p. 22.
- [british-india] peak.note: "(Wikipedia: British Raj)" → "(Wikipedia: British Raj; the 1901 census, by contrast, gave 1,766,597 sq mi, c. 4.58M km²)". Reason: the current figure of c. 5.0M km² is about 9% above the official census area, which already includes Burma and the Native States. Source: Imperial Gazetteer vol. I, p. 449 (British provinces 61.5%, Native States 38.5%).
- [republic-of-india] rulers[4].reign: "1998–2004" → "1996, 1998–2004". Reason: Vajpayee also held office for 13 days in 1996. Source: https://en.wikipedia.org/wiki/Atal_Bihari_Vajpayee
- [pakistan] rulers[5].note: "First woman to lead a Muslim-majority country" → "First woman elected to lead the government of a Muslim-majority country". Reason: earlier women ruled Muslim states; the atlas itself profiles Razia Sultana (1236–40). Source: https://en.wikipedia.org/wiki/Benazir_Bhutto

### Already fixed by the general fact-checkers (confirmed with the specialist sources, so not in the patch)
- 1880 era: "two-thirds" → "three-fifths" of the subcontinent under direct rule. Confirmed by Imperial Gazetteer vol. I, p. 449: Native States covered 679,393 sq mi, or 38.5% of 1,766,597 sq mi.
- 1783 era: Company territory "around Madras and Bombay" rather than "the Madras and Bombay coasts". Consistent with Schwartzberg pl. VII.A (1766–1819).
- 1600 era: Akbar's subjects now given as "well over 100 million". Consistent with Moreland and Habib estimates.
- maratha-empire: Baji Rao II now dated 1796–1818. Confirmed by Majumdar vol. VIII, p. 428 ("installed as the Peshwa … on December 5, 1796").
- durrani-empire: Dost Mohammad's second reign now 1843–1863. Confirmed by Majumdar vol. IX, p. 198 ("occupied the throne of Kabul in 1843").
- delhi-sultanate: Aibak "began" the Qutb Minar. Confirmed by Majumdar vol. VI, pp. 667–668: Aibak finished only the first storey and Iltutmish completed it. Razia is "the only woman to rule the Delhi Sultanate".
- pakistan: Rawalpindi interim capital 1959–67. mughal-empire: peak c. 4.0M km² (Taagepera 1997). maratha-empire: c. 2.5M km² (Turchin 2006). kushan-empire and gupta-empire: area ranges added.

### Checked against the authorities and found correct (no change)
These include Chandragupta and the 500 elephants (Majumdar vol. II p. 59) and Bindusara's southern conquests (Schwartzberg p. 171 says "probably"). Also correct: Shivaji's coronation on 6 June 1674 (Sarkar, *Shivaji and His Times*, p. 246) and Rajaram's death on 2 March 1700 (Majumdar vol. VII). So are the fall of Bijapur (1686) and Golconda (1687), Mahmud's victory over Jayapala (1001), and the Hindu Shahis ruling Kabul in 900 (Kabul reverted to them after the Saffarid capture of c. 870). Other correct items: Balban, Alauddin, Nasir-ud-din Mahmud Tughluq, Harihara II, Sikandar Lodi, Krishnadevaraya and Achyuta's succession, Babur's battles, Shah Abbas II taking Kandahar (1649), Farrukhsiyar and the Sayyids, Banda Singh's capture (1715), Ranjit Singh's Lahore (1799), the Anglo-Sikh annexation (1849), and every modern-era (1914–2000) South Asian statement.

## Border and area discrepancies: Cliopatria map vs Schwartzberg and scholarly figures
These are reported only, since the borders can't be changed. Figures come from `public/data/clio/index.json` `realms[...].tl`.

1. **Delhi Sultanate (biggest mismatch with the text).** The profile now gives the peak as 1312 under Alauddin (3.2M km², Taagepera 1997). The map shows only 1.01M km² for 1305–13, because the Yadavas, Kakatiyas, Hoysalas and Pandyas remain separate polygons (tributaries). The map peaks at 2.45M km² in 1326–43 under Muhammad bin Tughluq, which is how Schwartzberg pl. V (Khaljis and Tughluqs, 1290–1390) also shows it. Recommend moving peak.year back to c. 1335, or adding a note.
2. **British Raj keeps Burma after 1937.** The map gives 4.94M km² for 1938 and 4.90M km² for 1939–42 and 1945–46, but drops by about 0.68M km² (Burma's area) only in 1943–44, under Japanese occupation. Burma was separated on 1 April 1937 (Schwartzberg pl. VIII.B), so the 1937–47 Raj should be c. 4.2M km². The map also has no "British Raj" polygon before 1859: Company territory from 1757 to 1858 is covered only by the global "British Empire" realm. The map's 4.87M km² for 1895–1910 is also above the 1901 census total of 4.58M km² (Imperial Gazetteer vol. I, p. 449).
3. **Maratha Empire.** The map's polygon is absent for 1691–1717, the whole Mughal–Maratha war and Shahu's early reign. It starts in 1677, not 1674, and peaks at only 1.28M km² (1772–74). Schwartzberg pl. VII.A (Mughal disintegration, 1707–1766) maps Maratha-held and tributary territory around 1758 reaching the Punjab. Turchin et al. give 2.5M km² for 1760.
4. **Vijayanagara.** The map's polygon ends in 1571, but the Aravidu dynasty ruled from Penukonda, Chandragiri and Vellore until 1646. Schwartzberg's major-powers plate XIV covers "Rathors and Aravidus" separately. The 1600 and 1650 snapshots therefore show no Vijayanagara state.
5. **Chola Empire.** The map's polygon tops out at 0.52M km², half the profile's 1.0M, and ends in 1259 rather than 1279 (Schwartzberg pl. IV.2; Majumdar vol. V).
6. **Gupta Empire.** The map shows 2.49M km² (2.87M with the Vakataka alliance group) for 410–450, against the profile's 3.5M (Turchin). This is consistent with Schwartzberg pl. III.D, which separates direct rule from tributaries.
7. **Maurya Empire.** The map shows 3.95M km² for 256–226 BCE, above the profile's 3.4M, and starts in 318 BCE rather than 322. It shrinks to 1.14M by 225 BCE. Schwartzberg pl. III.B (p. 171) warns that his frontiers beyond Arachosia and the Paropamisadae, and in the far south, are tentative.
8. **Sikh Empire.** The map peaks at only 0.40M km² (1842–45), against the profile's 0.52M (200,000 sq mi) for 1839.
9. **Sur Empire.** The map runs it to 1594, but the Sur dynasty fell in 1556–57 (Schwartzberg pl. XIV, "Surs"; pl. VI.A Babur–Humayun–Sher Shah). It overlaps Akbar's Mughal polygon.
10. **Bahmani Sultanate.** The map starts it in 1352 (founded 1347) and ends it in 1491; it lasted nominally until 1527 (Schwartzberg text p. 200).
11. **Modern states.** Bangladesh appears only from 1973, and Pakistan keeps 1.02M km², including East Pakistan, through 1972. Independence came on 16 December 1971. India gains no area when Sikkim joins in 1975 (3,180,058 km² falls to 3,180,006 km² in 1976). Pakistan's 1.02M km² for 1948–62 includes Pakistan-administered Kashmir, whereas the profile's 943,700 km² excludes it.
12. **Gaps.** No Sri Lankan state appears before Polonnaruwa (1072), so the Anuradhapura kingdom is missing. Nepal appears only from 1775 (Gorkha conquest of the Kathmandu valley, 1768–69). Hyderabad State is absent from 1799 to 1946, and Mysore ends in 1799, although both continued as princely states.
13. **Minor.** The Indus civilisation polygon peaks at 0.76M km² (profile 1.0M; Taagepera 0.3M for the core) and ends in 1701 BCE rather than c. 1300. The Kushan polygon starts in 43 CE rather than c. 30. The Durrani polygon runs to 1827, while the profile ends it in 1823.

## Disputed or unverifiable (softened or left as is)
- **Buddha, Mahavira and Magadhan chronology.** The traditional "long chronology" (Bimbisara c. 544–492, Buddha d. c. 483) underlies the −500 and −400 entries. The modern "short chronology" moves both about 80 years later. Text hedged ("c.", "debated"). Majumdar follows the older dates.
- **Mauryan regnal years.** Chandragupta's accession is given as c. 322 or 321 BCE, and Ashoka's accession c. 273 vs coronation c. 268. Both are kept as "c." values (the profile says c. 322, the −300 event c. 321; both are acceptable).
- **Empire areas without a Taagepera or Turchin figure:** Chola 1.0M, Vijayanagara 0.5M (other estimates up to 0.88M), Durrani 2.0M (Bosin 2009). These are rough; the map polygons differ, as listed above.
- **Indus area.** The c. 1M km² figure is the spread of sites; Taagepera's polity-style estimate is 0.3M km².
- **Ajanta and Vakataka end dates.** Spink's short chronology (c. 460–480) vs later 6th-century dates; the Vakataka end is c. 500, but the map runs to 554.
- **Karikala Chola** "c. 2nd century CE": the Sangam chronology is uncertain (1st century BCE to 2nd century CE).
- **Warren Hastings** "1773–1785": appointed under the Regulating Act of 1773, took office as governor-general in October 1774. Either is acceptable.
- **1899–1900 famine deaths** (already hedged by the general checker to 1–4.5 million) and **Mughal population c. 1600** (100–150 million): both estimates vary.
- **Framing in older sources.** Majumdar's volumes reflect a nationalist reading in places, and the Imperial Gazetteer a colonial one. Only factual data (dates, areas, census figures) were taken from them, never interpretation.

## Counts
- Items checked: 47 era snapshots (South Asian content of every chapter) and 14 South Asian profiles.
- Corrections proposed in the patch: 17. A further 10 were already made by the general fact-checkers and are confirmed here.
- addSource entries: 101, all DSAL Schwartzberg plates, DSAL Imperial Gazetteer pages, or Internet Archive copies of Majumdar and Sarkar. All 34 distinct URLs returned HTTP 200 on 2026-11-09, and every Schwartzberg plate's IIIF manifest exists.
- Border/area discrepancies reported: 13 groups.
