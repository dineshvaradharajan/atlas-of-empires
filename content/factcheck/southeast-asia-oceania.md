# Regional fact-check: Southeast Asia and Oceania

Scope: `regions.southeast-asia` and `regions.australasia` in all 47 era snapshots, SE Asian and Pacific powers, events and overview sentences, and the profiles khmer-empire, srivijaya, majapahit, pagan-kingdom, dai-viet, ayutthaya-kingdom, tui-tonga-empire, siam-thailand, toungoo-burma, konbaung-burma, malacca-sultanate, indonesia, kingdom-of-hawaii, australia, new-zealand (plus the Dutch East Indies parts of dutch-empire).

Authorities opened:
- G. Coedès, *The Indianized States of Southeast Asia* (East-West Center Press, 1968), full text: https://archive.org/details/george-coedes-the-indianized-states-of-southeast-asia-east-west-center-press-1968. Page numbers come from the djvu text layer and may be off by one.
- D. G. E. Hall, *A History of South-East Asia*, 4th ed. (1981), full text: https://archive.org/details/a-history-of-south-east-asia-4th-ed, including its appendix of dynastic lists.
- Wilmshurst et al. 2011, *PNAS* 108:1815, on the East Polynesian settlement chronology: https://pmc.ncbi.nlm.nih.gov/articles/PMC3033267/
- Supporting web pages, each cited per item below.

I did not open these authorities, so nothing here cites them: Cribb's *Historical Atlas of Indonesia*, the *Cambridge History of Southeast Asia*, the *Cambridge History of the Pacific Islanders* and the *Cambridge History of Australia*. No open copies were found during this pass.

## Proposed corrections (13, in southeast-asia-oceania-patch.json)

- [1279] regions.southeast-asia: "Samudera Pasai in Sumatra is the region's first Muslim kingdom" → "is about to become one of the region's first Muslim kingdoms". In 1279 Pasai was not yet attested as Muslim. Marco Polo found Perlak Muslim in 1292, and Samudra's Islamization is dated by the tomb of Malik al-Saleh (d. 1297). Source: Coedès p. 202.
- [900] regions.southeast-asia: "Yasovarman I (r. c. 889–910)" → "(r. from 889)". Coedès (pp. 112–15) says his "reign ended around 900", and other lists give c. 910.
- [khmer-empire] rulers[1].reign: "889 – c. 910" → "889 – c. 900 (some lists c. 910)". Source: Coedès pp. 112–15.
- [khmer-empire] peak.note: adds the scholarly figure, c. 1.0M km² for c. 1290 (Taagepera 1997, via Wikipedia's List of largest empires). The profile's own 1,000,000 km² agrees with it.
- [srivijaya] start: 650 → 670. Srivijaya is first recorded when I-ching stopped at Fo-shih in 671, and its earliest inscription (Kedukan Bukit) dates from 682. Nothing supports 650. Source: Coedès pp. 81–83. The map timeline starts in 674.
- [srivijaya] rulers[0].reign: "c. 671 – 702" → "fl. 682 – 686". Dapunta Hyang is known only from the inscriptions of 682, 684 and 686, so his accession and death dates are not attested. Source: Coedès pp. 82–83.
- [srivijaya] peak.note: says that estimates for this loose maritime sphere vary widely. Turchin, Adams & Hall (2006) give c. 1.2M km² for c. 1200, against the profile's 700,000 km².
- [dai-viet] summary: "From the 16th century the realm was divided between rival lords" → "...divided, first by the Mạc usurpation of 1527 and then between rival lords". The Trịnh–Nguyễn division belongs to c. 1600 onward, and the 16th century was the Mạc–Lê split. Source: Hall, dynastic appendix ("The Mac, 1527-1677").
- [tui-tonga-empire] peak.note: "Land area of Tonga and dependent islands" is misleading. The 23,000 km² only works if Samoa, ʻUvea, Futuna and all of Fiji are counted, while Tonga itself is about 750 km² (717 km² of land). The new note says the extent of Tongan overlordship is debated. Source: https://en.wikipedia.org/wiki/Geography_of_Tonga
- [kingdom-of-hawaii] capital: "Lahaina, then Honolulu (from 1845)" leaves out the 1795–1820 courts. New value: "Kamehameha I's courts at Waikīkī, Honolulu and Kailua-Kona; Lahaina (1820–1845), then Honolulu (from 1845)". Source: https://en.wikipedia.org/wiki/Hawaiian_Kingdom
- [kingdom-of-hawaii] peak.areaKm2: 28300 → 16600. 28,311 km² is Hawaii's total area including 11,672 km² of water, and its land area is 16,638 km². The peak.note is updated to match. Source: https://en.wikipedia.org/wiki/Hawaii
- [indonesia] rulers[4].note: "First democratically elected president" → "First president chosen by a freely elected assembly (the MPR)". Wahid was elected indirectly by the MPR on 20 October 1999. Source: https://en.wikipedia.org/wiki/Abdurrahman_Wahid

The patch also carries addSource entries: Coedès and Hall for the classical-era profiles and eras, and Wilmshurst 2011 for the Polynesian-settlement eras.

## Found independently but already fixed by the general fact-checkers (dropped from the patch)
- [900/1000/1100] australasia: the East Polynesian settlement dates were too early, following the old long chronology. They now match Wilmshurst et al. 2011: Society Islands c. 1025–1120, remaining islands c. 1190–1290.
- [1994] australasia: "France still conducts nuclear tests" was wrong, since a moratorium ran from April 1992 to the June 1995 resumption. Source: The Conversation, https://theconversation.com/frances-final-nuclear-tests-in-the-south-pacific-30-years-on-256439. Now fixed.
- [2000] southeast-asia: "faces impeachment in December" was wrong. The House impeached Estrada on 13 November 2000, and the Senate trial ran from 7 December. Now fixed.
- [1938] australasia: "secretly fortifying" Micronesia has been softened to "fuelling suspicion". Large-scale military works in the mandate are generally dated to the late 1930s (1939–41).

## Border and extent discrepancies (public/data/clio/index.json; I can't change these)
- **Malacca Sultanate** ("Sultanate of Malacca"): the timeline runs **1459–1861**. The sultanate was founded c. 1400, and the Portuguese took Malacca in 1511. After 1511 the polygon is presumably its Johor/Perak successors under the wrong name, and before 1459 the realm is missing.
- **Đại Việt**: the polygon for 947–1406 is named "Ngô Dynasty", but the Ngô ruled only 939–965. It covers the Đinh, Lý, Trần and Hồ periods under that wrong label. A separate "Đại Việt" polygon for 1529–1833 is wiki-linked to the Mạc dynasty. The "Lê Dynasty" polygon ends in 1571. Mapped area peaks at about 190k km², against the profile's 300,000 km² for 1780. In 1780 Vietnam was split between the Trịnh, the Nguyễn lords and the Tây Sơn, so a single-polity 1780 figure is a construct.
- **(Allegiance of Kingdom of Hawaiʻi to British Empire)**, 1811–1819: the area is given as **3,600,147 km²**, which is plainly wrong for an island group of about 16,600 km² of land (the kingdom polygon itself is 24,850 km²).
- **Champa** ("Chámpa"): ends in 1652. Hall (1981) keeps a Cham court in the far south until 1720, and modern scholarship has Panduranga surviving as a Nguyễn vassal until 1832. 1652 at least marks the loss of real independence (Kauthara fell in 1653).
- **Khmer Empire**: the polygon runs 800–1867, continuing post-Angkorian Cambodia under the empire's name. The profile ends in 1431. Hall/Wolters also put a sack of Angkor in 1389, and the 1431 date is traditional.
- **Srivijaya**: the polygon runs 674–1293 and peaks at about 538k km² in 718–859. The profile has 1377 (the Majapahit expedition) and a peak in 1000. Its peak area of 700k km² is uncited, and Turchin's 1.2M km² is much higher.
- **Pagan**: the polygon peaks at about 440k km² (1188–1284), against the profile's 340,000 km², which is also uncited.
- **Konbaung Dynasty**: the polygon starts in **1741**, but Alaungpaya's rise began in 1752.
- **First Toungoo Empire**: the polygon runs 1502–1756, against 1510–1752. This is minor, and Hall dates the dynasty from 1486.
- **Commonwealth of Australia**: the polygon starts in **1905** instead of 1901. Its 8.23M km² maximum (1945) includes Papua/New Guinea.
- **New Zealand**: the polygon only starts in **1948**, so the colony and dominion (1840–1947) are absent.
- Late-starting post-colonial polygons: Philippines 1947 (independent 1946), Singapore 1967 (1965), Kingdom of Cambodia 1956 (1953), North Vietnam 1956 (1945/54), East Timor 2006 (2002). Papua New Guinea starts in 1946 but became independent in 1975, so before then it is presumably the Australian territory under the later name.
- **Tuʻi Tonga**: no polygon at all.
- **Republic of Indonesia**: the mapped maximum of 2.04M km² is about 6% above the real 1.92M km². This is minor polygon imprecision.

## Disputed or softened, no patch proposed
- Pagan's conquest of Thaton in 1057 (pagan-kingdom summary) is traditional. Michael Aung-Thwin (*The Mists of Rāmañña*, 2005) disputes the Mon-conquest story, but the mainstream view is kept.
- Ayutthaya's 1431 sack of Angkor is the traditional date. Wolters, as cited in Hall's appendix, also has a sack in 1389.
- The start of bronze-working in mainland SE Asia (eras −1500 and −1000) depends on whether the short chronology (c. 1100–1000 BCE, Higham) or a longer one is accepted. The current wording, "beginning to spread" at 1500 BCE, leans early.
- [−500] "Polynesians live in Fiji, Tonga and Samoa": Fijians are not usually called Polynesian, since ancestral Polynesian culture developed in Tonga and Samoa. This is a minor imprecision that I couldn't check against an opened source, so there is no patch.
- Majapahit's end in 1527 is conventional. Hall gives "c. 1520", and the last securely attested Majapahit king was ruling in 1516.
- Tuʻi Tonga "maritime empire" over Samoa and Fiji: the extent is debated in recent archaeology. The patched peak note says so.
- Peak areas without a scholarly source (Taagepera or Turchin): Majapahit, Pagan, Đại Việt, Ayutthaya, Toungoo, Konbaung, Malacca and Siam. All are labelled rough, and the Toungoo and Konbaung figures agree with the map within about 15%.

## Checked and found accurate (sample)
Era texts from −3000 to 2000 for both regions. Highlights: the Trưng sisters (43); Linyi founded 192 (Coedès p. 43); the Kutai inscriptions c. 400 (Coedès p. 53); Funan's Jayavarman, who died in 514 (Coedès p. 59); Mataram's collapse in 1016 (Coedès p. 145); Pagan founded 849; Gajah Mada as patih of Majapahit from 1331 (Coedès p. 236); Malacca founded c. 1400 with Muzaffar Shah as the first sultan (Hall); Mandalay as capital 1857–85 (Hall); Tabinshwehti from 1530; the Treaty of Zaragoza in 1529; Tasman in 1642; the VOC dissolved in 1799; Tambora in 1815; Ned Kelly in 1880; Fiji in 1874 and Tahiti in 1880; the federation act of 1900; the 1914 seizures of German New Guinea and Samoa; the PKI founded in 1920; the Yên Bái mutiny and Saya San's rebellion (1930); Phibun (1938); the 1945 proclamations; Palau's independence in 1994. Profile ruler lists for Pagan, Ayutthaya, Toungoo, Konbaung, Malacca, Siam, Australia and New Zealand all agree with Hall and standard lists.

Items checked: 94 era-region texts, 2 powers, 5 events, 15 profiles (plus Dutch East Indies content). Proposed corrections: 13. A further 4 errors I found had already been fixed by the general fact-checkers.
