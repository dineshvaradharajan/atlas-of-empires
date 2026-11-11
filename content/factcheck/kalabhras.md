# Kalabhras (`kalabhras`)

New profile `kalabhras` (appended to `content/empires/a2-early.json` after `pallava-empire`) for Cliopatria's realm
"Kalabhra Dynasty", and one new correction for that realm in `content/corrections.json`.

## Sources (all fetched)
- Wikipedia: Kalabhra dynasty — https://en.wikipedia.org/wiki/Kalabhra_dynasty (cited statements of Upinder Singh
  2008 pp. 557–558, Kulke & Rothermund, Darley, Peterson, Stein, R. S. Sharma; Buddhadatta's colophons via Sastri,
  *The Colas*, p. 108)
- K. A. Nilakanta Sastri, *A History of South India* (1958), Internet Archive full text —
  https://archive.org/details/dli.ernet.505532 (p. 3: incursion "about A.D. 300 or a little later"; pp. 139–140:
  Accutavikkanta, Amitasagara, denunciation as "evil kings"; pp. 144–146: overthrow in the last quarter of the 6th
  century by Simhavishnu (575–600) and Kadungon (590–620); Narasimhavarman I still claims a victory over Kalabhras)
- Wikipedia: Velvikudi inscription — https://en.wikipedia.org/wiki/Velvikudi_inscription (c. 769–770; lines 39–40,
  quoted in the Kalabhra article from H. Krishna Sastri, *Epigraphia Indica* XVII)
- Wikipedia: Kadunkon — https://en.wikipedia.org/wiki/Kadunkon (590–620 Majumdar/Sastri; c. 560–590 Karashima 2014)
- Wikipedia: Simhavishnu — https://en.wikipedia.org/wiki/Simhavishnu (Sastri 555–590, Sen 575–600, Mahalingam 575–615)
- Wikipedia: Buddhadatta — https://en.wikipedia.org/wiki/Buddhadatta
- Kasakudi plates of Nandivarman Pallavamalla, SII 2.73, DHARMA edition — https://dharmalekha.info/texts/INSSIIv02p0i0073
  (Simhavishnu "vanquished the Malaya, Kaḷabhra, Mālava, Chōḷa and Pāṇḍya (kings)")
- *Jaina Inscriptions in Tamilnadu*, Pallankovil plates — https://jainqq.org/pagetext/Jaina_Inscriptions_in_Tamilnadu/006562/449
- Schwartzberg, *Historical Atlas of South Asia*, DSAL — https://dsal.uchicago.edu/reference/schwartzberg/ ; plates
  III.D.1 "Gupta-Vakataka age c. 300–550" (manifest `The_Gupta-Vakataka_Age_c._A.D._300-500.json`, image 062) and
  III.D.2 "Pusyabhuti and Calukyan ascendancy c. 550–700" (image 063), read through DSAL's IIIF service.

## The evidence
- **Copper plates.** The Velvikudi grant of the Pandya Nedunjadaiyan (c. 770, 200+ years after the events) says a
  "Kali king named Kalabhran" drove out numberless *adhirajas* and resumed the Velvikudi grant, and that Kadungon then
  ended this "possession of her under others". The Kasakudi plates of Nandivarman II (8th century) list the Kalabhras
  among Simhavishnu's defeated enemies. The **Pallankoil (Pallankovil) plates** do *not* name the Kalabhras: they are
  a Pallava Simhavarman's grant (6th regnal year; the jainqq edition dates it 556 and identifies the king with
  Simhavishnu) to the Jain teacher Vajranandi for a Vardhamana temple at Kanchi. They are used in the profile only as
  evidence that Pallava kings still ruled at Kanchipuram in the mid-6th century.
- **Buddhist and Jain references.** Buddhadatta (5th century) wrote his *Vinayavinicchaya* in monasteries on the
  Kaveri "when the king of Cholas, Accutavikkaman, born in the lineage of the Kalamba family was ruling"; the oldest
  Pali manuscript reads *Kalabbha* (von Hinüber, cited on Wikipedia). The 10th-century Jain grammarian
  Amitasagara quotes verses about Achyuta; the late Tamil *Navalar Caritai* has him holding the three Tamil kings
  captive.
- **Literature.** Tirukkural, Silappatikaram and Manimekalai are often dated to this period and linked by Peterson
  and others to Jain/Buddhist patronage; Blackburn, Natarajan and Cutler (cited on Wikipedia) dispute this.
- **Origin theories.** Hill tribes (Thapar); Karnatas from the north (Narasimhacharya, Venkayya); Kallar/Kalvar or
  Kalappalar (Raghava Iyengar); Mutharaiyar (Gopinatha Rao, called speculative); Bangalore–Chittoor (Venkatarama Iyer);
  "nothing is known" (Kulke & Rothermund).
- **"Dark age".** The label and the image of "evil kings" come from records of their enemies; Darley stresses the
  "profound lack of evidence", Stein reads it as a tribal bid for the plains, R. S. Sharma as a peasant revolt, and
  some dismiss the interregnum as practically a myth.
- **End.** Sastri: ended in the last quarter of the 6th century by Simhavishnu (to the Kaveri) and Kadungon (Madurai).
  Singh (cited): "ended for certain by the last quarter of 6th century". Schwartzberg III.D.1: "Conquerors in late 4th
  century (?) of Colas, Pandyas, Ceras and of S'ern Pallava domains. Overthrown by Pallavas and Pandyas under
  Simhavisnu and Kadungon respectively by late 6th century"; III.D.2 labels the Kalabhras inland between Kongu and
  Uraiyur, "Immigrant dynasty crushed by Pallavas and Pandyas in late 6th century", and notes that the Gangas annexed
  Kongu in the mid-6th century (III.D.1) and extended power over Punnad, Kongu and Cera (III.D.2).

## Profile (`kalabhras`)
start 300 (Sastri: "about A.D. 300 or a little later"; Wikipedia: 3rd–6th century), end 590 (last quarter of the 6th
century; Kadungon's accession c. 590 in Sastri; the map's Kalabhra realm now ends in 591). Capital: unknown
(Wikipedia's infobox gives Kaveripumpattinam, which rests only on Buddhadatta's description of the town; written as
"sometimes proposed"). Peak: the map's 138,000 km², labelled rough, no Taagepera/Turchin figure. Rulers: only
Achyuta Vikranta. `aliases` is empty (no Kalabhra polygon in the historical-basemaps names).
Not used: the Pulankurichi inscription (Wikipedia calls it a Kalabhra record of 270 CE, but its only citation is for
its language, and the attribution is not in Sastri or Singh).

## Map check and correction
Cliopatria draws "Kalabhra Dynasty" 353–591 over the whole Tamil plain (76.0–80.2°E, 8.1–12.85°N, c. 138,000 km²) and
592–601 over the land north of the Kaveri plus Kongu (to 76.05°E, 10.05–12.9°N, c. 61,500 km²), with the Pandya
Dynasty drawn south of the Kaveri from 592.
- 353–591: kept. The Pandya revival in c. 590 (Sastri) matches the map's Pandya start in 592. Simhavishnu's conquest
  to the Kaveri (c. 575 in Singh/Sen) is not shown before 592, and the 4th-century northern edge is doubtful (Singh);
  both are stated in the note rather than cut, since a cut would leave blank land (the sa-pallava layer was cut to
  this polygon).
- 592–601: wrong for scholarship: by then Simhavishnu held the country up to the Kaveri and the Gangas held Kongu.

Correction added to `content/corrections.json` → `realms` → "Kalabhra Dynasty":
- `relabel` 592–601 → "Late Pallava Empire" (key "Late Pallava Empire", `addTo` ["Late Pallava Empire"]), with
- `crop` 592–601 to box [78.4, 10.0, 81.0, 13.5] (east of Kongu), and
- `note` on dates, the doubtful northern edge, the end and the 592–601 change; 5 sources; `log` kalabhras.md.
Effect: the Kalabhra realm ends in 591; in 592–601 the Chola country north of the Kaveri (c. 35,000 km² after the
crop) joins the Pallava realm, abutting the sa-pallava slice 555–601 and the Pandya polygon without overlap; Kongu is
left unrecorded. Caveat: `addTo` adds the uncropped 61,508 km² to the Pallava area timeline for 592–601 (c. 99,900 km²
instead of c. 73,000), as for other relabels; the Pallava profile peak (650) is unaffected.

## Unverifiable / disputed
- Start date (3rd vs late 4th century) and the northern limit before c. 450.
- Simhavishnu's and Kadungon's dates (Simhavishnu 555–590 / 575–600 / 575–615; Kadungon 590–620 / 560–590).
- Narasimhavarman I (630–668) and Chalukya records still claim victories over Kalabhras, so remnants may have
  survived into the 7th century; not drawn.
- Capital, religion and origin of the dynasty; attribution of Tamil classics to their patronage.

Items checked: 2 (profile, map realm). Corrections: 1 new profile, 1 new realm correction (note + relabel + crop).
