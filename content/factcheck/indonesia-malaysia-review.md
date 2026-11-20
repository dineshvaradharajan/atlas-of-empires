# Indonesia and Malaysia review (November 2026)

Triggered by a reader report: in 1895–1897 the map labelled the Dutch East Indies "Qajar Dynasty".

## Method

- Timelines of who the app draws at 68 places (Aceh to Merauke, Kedah to Sandakan, plus Pagaruyung, Siak, Kampar,
  Asahan, Deli), year by year from 600 to 2026. Exact point-in-shape tests on `public/data/clio`, with every
  correction in `content/corrections.json` and the reconstruction layers applied, as the app and `tools/placeindex.py` do.
- Each run of years was checked against the Wikipedia articles cited in the patches and corrections.
- Moments, realm notes and wars that cover the region were read too.

## Fixed

Border data (`content/borders/patches.json`):

| Patch | Problem | Fix |
|---|---|---|
| `dutch-east-indies-qajar-swap-1895` | Cliopatria swaps the outlines of the Qajar and Dutch East Indies rows in 1895–1897. Persia was drawn as Dutch and the Indies as Qajar. | Each row takes back its own outline. |
| `malacca-sultanate-1400-1511` | Malacca is missing at Malacca itself in 1402–1511. Its 15th-century extent sits in 1512–1528, after the Portuguese conquest. Majapahit is drawn over the peninsula and Sumatra until 1474. | Core area for 1400–1455, the 1512 outline for 1456–1511. No Majapahit on the peninsula or Sumatra after 1401. |
| `netherlands-new-guinea-1950-1962` | Western New Guinea is blank in 1950–1962. | Netherlands New Guinea is drawn. |
| `japanese-dutch-east-indies-1942` | Java, Sumatra, Sulawesi, the Moluccas and the Lesser Sundas are Dutch in 1942, and Singapore is blank. Portuguese Timor is drawn over the Japanese occupation in 1942–44. | Japanese for 1942. Timor Japanese 1942–45. |
| `aceh-kutaraja-1874-1913` | The north tip of Sumatra is blank in 1874–1913. | Dutch from 1874. The sultanate is shown on top until 1903. |
| `british-java-1811-1816` | The British interregnum is hidden under the Dutch shape in 1811–13 and ends in 1814. Malacca is Dutch in 1814–17. | British 1811–1816, Malacca to 1817. |
| `british-bencoolen-1685-1824` | No British Bencoolen. | Coast from Indrapura to Krui, British 1685–1824. |
| `penang-1786-1799` | Penang is British only from 1800. | Penang Island British from 1786. |
| `dutch-malacca-1641` | Malacca is Portuguese until 1647. | Dutch from 1641. |

Draw-time corrections (`content/corrections.json`):

- **Sultanate of Malacca:**
  - The note is rewritten as history.
  - The Sumatran shapes are cropped south of 1°S, so Jambi is not drawn as Malacca or Johor.
  - Kelantan is cut out of the post-1511 (Johor) shapes.
- **Sultanate of Johor** (new entry): history note. Jambi is not drawn as Johor before 1670, and Kelantan is not drawn as Johor.
- **Republic of Indonesia, Malaysia, Dutch East Indies:** the notes described the map, not the history, and the Malaysia note contradicted what was drawn. All three are rewritten as history.
- **Netherlands New Guinea:** new note.

Moments (15 new; until now the only moment in the region was Zheng He):

- Srivijaya (682)
- Borobudur (c. 800)
- Majapahit (1293)
- Malacca (c. 1400)
- Portuguese Malacca (1511)
- Batavia and Banda (1619–21)
- Tambora (1815)
- Singapore and the 1824 treaty (1819–24)
- Java War (1825–30)
- Krakatoa (1883)
- Indonesian independence (1945–49)
- Bandung Conference (1955)
- Merdeka and Malaysia (1957–65)
- The 1965–66 killings and the New Order
- The Indian Ocean tsunami (2004)

## Not fixed (for a later pass)

**Wrong:**
- **Hollandia (Jayapura), 1944–45:** drawn as Australian. It was retaken by US forces in April 1944 and then run by the Dutch (NICA).
- **Merauke, 1943–45:** inside Japan's New Guinea shape, although the Dutch held it throughout the war.
- **Malacca, Timor and Ambon, 1582–1639:** drawn as "Spanish Empire" (the Iberian Union) although they stayed under Portuguese administration. This is a global Cliopatria convention for Portugal's empire in those years.
- **Portuguese Timor, 1974–75:** still labelled "Estado Novo", although that regime fell in April 1974.

**Missing states (blank on the map):**
- Pagaruyung (Minangkabau), 14th century–1833
- Ternate and Tidore
- Banda
- Lombok under Balinese (Karangasem) rule, c. 1740–1894
- The old Pahang Sultanate, 1470–1623 (drawn as Johor)
- Portuguese Solor and Flores
- Mataram during the Trunajaya rebellion, 1677–82 (blank)

**Simplified:**
- Sarawak, 1888–1941: shown as British, not the Brooke Raj. This matches how the protected Malay states are drawn.
- Dutch Malacca, 1648–1795: reaches inland to Seremban.
- Selangor: starts in 1744 (the sultanate was founded c. 1766).
- Brunei: British from 1890, although the protectorate began in 1888.
- The Republic and the Dutch zones of 1946–49: drawn coarsely.
