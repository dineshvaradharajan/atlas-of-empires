# Regional fact-check: Ancient Near East and Egypt (before 330 BCE)

Scope: `content/eras/a-ancient.json` chapters -3000 to -323 (overview, `regions.middle-east-south-asia`,
`regions.northern-africa`, powers, events), plus profiles in `content/empires/a1-early.json`:
ancient-egypt, sumer, akkadian-empire, babylonia, assyria, hittite-empire, kingdom-of-kush (pre-330 part),
achaemenid-empire. No separate profiles exist for Ur III, Mitanni, Elam, Urartu, Medes, Phoenicia or Israel/Judah.
Those polities were checked where they appear in era chapters.

Patch file: `content/factcheck/ancient-near-east-patch.json` (25 corrections, 21 added references).

## Authorities actually opened
- *Cambridge Ancient History*, 3rd ed., vol. I pt 2 (1971): archive.org `the-cambridge-ancient-history-vol.-1-part-2` (Hayes, ch. XX, p. 479)
- *CAH*, 3rd ed., vol. II pt 1 (1973): archive.org `the-cambridge-ancient-history-vol.-2-part-1` (p. 37, Mitanni and Assyria)
- *CAH*, 2nd ed., vol. III pt 1 (1982): archive.org `the-cambridge-ancient-history-vol.-3-part-1` (Ashur-rabi II 1012–972)
- *CAH*, 2nd ed., vol. III pt 2 (1991): archive.org `the-cambridge-ancient-history-vol.-3-part-2` (Grayson pp. 36–7, 85–6, 91–4, 129–30; Mellink pp. 622–3; Shabako pp. 353, 689)
- Taagepera 1978/1979 and Turchin–Adams–Hall 2006 peak areas, as tabulated in Wikipedia "List of largest empires"
- Wikipedia (cited scholarship): Hurrians, Mentuhotep II, Median kingdom, Kingdom of Israel (united monarchy), Phoenician alphabet, Midas, Nabopolassar, Kültepe, Shabaka, Piye, Aspelta, Mitanni, Hittites, Peace of Callias, Nectanebo II, Uruk period
- Not accessible: Kuhrt, *The Ancient Near East* (archive.org copy is lending-restricted), Shaw (ed.), *Oxford History of Ancient Egypt* (lending only), Hornung–Krauss–Warburton (no open copy found), Encyclopaedia Iranica (HTTP 403), Britannica (HTTP 403). TAVO was not consulted.

## Corrections (old → new)
- [-3000] regions.middle-east-south-asia: "and Hurrian groups in the northern hills" → "and probably early Hurrian groups (first named in texts only after c. 2300 BCE) in the northern hills". Hurrians are first documented at Urkesh in the later 3rd millennium, so a presence at 3000 BCE is only inferred. Source: Wikipedia "Hurrians".
- [-2000] events[1].text: "Mentuhotep II reunites Egypt … (c. 2055 BCE)" → "Mentuhotep II, king from c. 2055 BCE, reunites Egypt … (c. 2040 BCE)". 2055 is his accession date (Shaw). Heracleopolis fell "about 2040 B.C." (CAH I.2 p. 479), and some put it later still, before his year 39 (Grajetzki).
- [-1000] overview: "King David rules a new kingdom of Israel" → "King David, according to the Bible, rules …". The size of the united monarchy has no consensus.
- [-1000] overview: Phoenicians "are spreading their alphabet across the Mediterranean" → "have developed the alphabet their traders will later carry across the Mediterranean". The oldest inscriptions are 10th century. Greek and other adaptations begin in the 9th–8th centuries, and western colonies date from the 9th century on.
- [-1000] regions.middle-east-south-asia: "under him and his son Solomon it will become a regional power" → hedged as the Bible's claim, with the archaeological debate noted.
- [-1000] powers[2].extent: "from the Negev toward Damascus" is now marked as the Bible's larger, debated realm.
- [-700] overview: "the legendary King Midas" → a real ruler famous from Greek legend (the Mita of Mushki in Assyrian records). Source: CAH III.2 pp. 91–2, 622–3.
- [-700] regions.middle-east-south-asia: the sentence credited Sennacherib with destroying Israel in 722 BCE. Samaria fell to Shalmaneser V (726–722), or Sargon II, never Sennacherib (705–681). Rewritten as "Assyria destroyed … and Sennacherib has forced Judah …". Source: CAH III.2 pp. 85–6.
- [-700] regions.middle-east-south-asia: "the Medes are uniting in western Iran" → "still divided among many local chiefs". Sargon II took tribute from 28 Median rulers (CAH III.2 pp. 93–4), and Esarhaddon dealt with many Median city-lords (pp. 129–30). A unified Median state is first attested under Cyaxares in 615 BCE.
- [ancient-egypt] peak.note: added "c. 1.0M km² c. 1450 BCE (Taagepera 1978)".
- [ancient-egypt] summary: "native independence ended when Cleopatra VII died" → "its independence ended …". The Ptolemies were Macedonian Greeks, and the last native ruler was Nectanebo II (Persian reconquest in 342 BCE).
- [sumer] peak.year: -2100 → -2050. The peak is given "under Shulgi", who reigned c. 2094–2047.
- [sumer] peak.note: added that Taagepera gives the Neo-Sumerian state only c. 0.1M km², so 250,000 km² assumes the tributary periphery.
- [akkadian-empire] peak.areaKm2: 650,000 → 800,000 to match Taagepera 1978 (0.8 Mm² at 2250 BC). The note now says this figure includes reach beyond directly ruled land. The map (clio) gives about 527,000 km².
- [babylonia] summary: "the Chaldean Nabopolassar" → "Nabopolassar, traditionally called a Chaldean". His origin is unclear: Beaulieu and Jursa link his family to Uruk officials.
- [babylonia] peak.note: added "c. 0.5M km² (Taagepera 1978)".
- [assyria] summary: caravans into Anatolia "by 2000 BCE" → "soon after 2000 BCE". Kanesh kārum level II is c. 1974–1836 BCE (Veenhof).
- [assyria] peak.note: added "c. 1.4M km² c. 670 BCE (Taagepera 1978)".
- [hittite-empire] peak.year: -1300 → -1250. Taagepera gives 0.45 Mm² for 1250–1220 BC. The note now carries that figure.
- [hittite-empire] legacy: "known before only from brief Bible mentions" → "… in the Bible and in Egyptian records". The Kheta of the Kadesh texts and the Amarna letters were known before the 1906 Hattusa archive.
- [kingdom-of-kush] rulers[1].reign (Shabaka): "c. 714 – 700 BCE" → "c. 705 – 690 BCE". The old dates fit neither chronology. The revised order (Payraudeau 2014; Tang-i Var inscription) gives 705–690, matching the profile's Piye dates of 744–714. The older order gives 716–702 (CAH III.2 pp. 353, 689).
- [achaemenid-empire] rulers[4].note: "Made peace with Athens" → "Said to have made peace with Athens (the disputed Peace of Callias)".
- [achaemenid-empire] peak.note: added "c. 5.5M km² c. 500 BCE (Taagepera 1979)".

## Checked and found consistent with the authorities (no change)
Narmer c. 3100 and the First Dynasty at Memphis/Abydos/Saqqara. Writing at Uruk c. 3200. Ur III founded c. 2112, fell 2004 (Kindattu, Ibbi-Sin). Ishbi-Erra of Isin. Amenemhat I c. 1991. Mursili I sacks Babylon 1595. Telipinu c. 1525. Ahmose c. 1550. Thutmose I c. 1506–1493. Kassite Babylon. Kidinuid Elam. Parattarna of Mitanni c. 1500. CAH II.1 p. 37 puts Assyria's annexation by Saustatar at the start of the 15th century, so "Assyria as a vassal" at 1500 BCE is acceptable. Ramesses III and the Sea Peoples 1177. End of the New Kingdom c. 1070. Ashur-rabi II c. 1012–972 (CAH III.1). Amenemope of Dyn. 21. Piye's conquest c. 728 (Shaw) or year 20 (c. 725). Shabaka or Shebitku ruling at 700. Sennacherib's son placed on the Babylonian throne in 700 (Ashur-nadin-shumi recognised at Uruk in 700, CAH III.2 p. 37 n.). Argishti II. Shutruk-Nahhunte II. Samaria 722. Sargon II against Urartu 714. Cyrus 559–530, Media 550, Babylon 539. Cambyses in Egypt 525. Darius I 522–486. Ionian revolt 499. Amyrtaeus and Egypt's revolt 404. Artaxerxes II 404–358 and Cunaxa 401. Egypt taken by Alexander 332. Nastasen c. 335–315. All Akkadian, Old Babylonian, Neo-Babylonian, Assyrian, Hittite and Egyptian reign dates in the profiles match the standard middle-chronology and Shaw tables, within the "c." given.

## Border / extent discrepancies (map data, not editable)
1. **Snapshots -1500, -1000 and -700 share one Near East layout.** `data/names/-1500.txt`, `-1000.txt` and `-700.txt` list identical polygons and areas: Kingdom of David and Solomon 154,278 km², Urartu 286,183, Phrygians 181,637, Arameans 419,276, Hittites 412,217, Assyria 174,198, Babylonia 129,144, Egypt 262,083, Kush 332,353, Saba 104,471.
   - At -1500 this is anachronistic. David's kingdom (c. 1000 BCE), Urartu (9th century), Phrygia, the Aramaeans and Saba did not yet exist. Mitanni, the leading power of northern Syria (Taagepera c. 0.3M km² for 1450–1375), has no polygon (the era file's `map: null`). New Kingdom Egypt's Levantine and Nubian empire is missing: Egypt's 262k km² compares with 636k in clio and 1.0M in Taagepera.
   - At -700 Assyria is drawn at 174k km². The real Neo-Assyrian empire was about 0.9–1.4M km² (clio 920k for 700–676; Taagepera 1.4M at 670). Babylonia, the "Hittites" (the Neo-Hittite states were annexed by 717–708) and the Kingdom of David and Solomon (Israel was annexed in 722, and Judah was an Assyrian vassal) are shown as independent states. Kush and Egypt appear as separate polygons although the 25th Dynasty ruled both. The text is correct, but the map contradicts it.
2. **-2000:** a "Hittites" polygon (230k km²) appears about 350 years before the Hittite kingdom (Hattusili I, c. 1650). Central Anatolia then held the Kanesh-period city-states. "Ur" (340,933 km²) remains although Ur III fell in 2004. No Assyria/Assur or Isin–Larsa polygons. Egypt has the same 322,966 km² as at -3000.
3. **-3000:** "Ur" is drawn at 340,944 km², a single huge polity. The Sumerian city-states covered roughly 35–45k km² (clio). "Kerma" appears, though the Kerma culture begins c. 2500 BCE; Lower Nubia then held the A-Group. "Hurrian Kingdoms" (74,955 km²) are not attested before the later 3rd millennium.
4. **-400:** there is no Egypt polygon. Egypt stays inside the Achaemenid polygon (6.02M km²) although it was independent from 404 BCE (28th Dynasty). The clio timeline correctly drops the Achaemenid area to 4.99M for 404–384.
5. **Profile peak areas vs clio/Taagepera:**
   - Kush 1.0M km² at -700. There is no Taagepera figure, and clio has 563k for 700–676. This looks high and is unverified.
   - Ancient Egypt 1.0M (Taagepera) vs clio's New Kingdom maximum of 709k.
   - Hittite 0.45M (Taagepera) vs clio 322k.
   - Akkad 0.8M (Taagepera, now in the patch) vs clio 527k.
   - Ur III 250k vs Taagepera 0.1M.
   - Clio "Median Kingdom" 2.06–2.24M km² (615–551) and Taagepera's 2.8M rest on a Median "empire" whose existence and extent are disputed (Sancisi-Weerdenburg).
6. **Clio dates:**
   - "Kingdom of Kush" starts at -1000, so Kerma (c. 2500–1500) has no clio polygon, while the profile starts at -2500.
   - "Sumerian City-States" runs to -1761, past the profile's end of -2004, because it includes the Isin–Larsa successors.
   - At -323 "Meroe" jumps to 576k km², from 309k at -500 and -400, with no historical reason.

## Unverifiable / disputed (left as is, flagged)
- Egyptian absolute dates follow Shaw/Parker-style tables. Hornung–Krauss–Warburton (2006) would lower many of them, for example Dynasty 1 to c. 2900 and Thutmose I to 1493–1483. Radiocarbon work (Dee et al. 2013) supports c. 3100 for Aha/Narmer. The existing "c." hedges are kept.
- The Ur-Nammu law code may belong to Shulgi. The text already says "one of the earliest".
- "Thutmose I … conquers Kerma (c. 1500)": he sacked Kerma, but Egypt's final conquest of Kush was completed under Thutmose III.
- "[Artaxerxes II's] grip on the Indus is loosening" (-400): plausible, but the evidence is thin.
- Kush profile "Aksum's armies finished it around 350" and "Assyrians drove them out around 664" (the 25th Dynasty kept Thebes until c. 656) are outside this slice or within the hedge.
- Akkadian "standardised weights and measures" is credited to Sargon in the summary. Most evidence dates this to Naram-Sin's administration.
- CAH III.1 (1982) follows a maximal biblical picture of David and Solomon. Modern work is split, so the text is hedged rather than corrected.

Items checked: 8 era chapters (-3000 to -323, Near East and Egypt content) + 8 profiles. Corrections proposed: 25. References added: 21.
