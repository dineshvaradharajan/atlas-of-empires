# Event details, slice A: ancient empire journeys (content/journeys/a-ancient.json)

**Details written: 256 of 256 events, across all 20 journeys.** Each is 70–120 words and 3–5 sentences, ordered context → what happened → consequence. `year`, `lonlat`, event order and all other fields are unchanged; the only edits are `detail` on every event, three corrected `text` values, and new `sources` entries (no journey has more than 8).

Sources are English Wikipedia articles, fetched as plain text through the MediaWiki API, plus the World History Encyclopedia pages already cited. Britannica refused automated fetches (HTTP 403), as it did in the earlier journeys fact-check. Facts were checked against the pages fetched for each journey. Contested facts are hedged in the text ("c.", "according to …", "some accounts say …").

## Event texts corrected

- [kushan-empire 90] text: "Han general Ban Chao defeats a Kushan army near Khotan" → "Han general Ban Chao repels a Kushan army sent across the Pamirs".
  - **Reason:** none of the sources places the battle near Khotan. The Han dynasty article says the Kushan force was sent to Wakhan and withdrew when supplies ran out; the Ban Chao article gives 70,000 men, defeated in 90 CE.
  - **Sources:** https://en.wikipedia.org/wiki/Han_dynasty, https://en.wikipedia.org/wiki/Ban_Chao
  - **Still open:** the event's `lonlat` still points at Khotan (79.93, 37.11). It is outside this task's scope, so it was not moved.
- [kushan-empire 375] text: "Reign of Kipunada, the last Little Kushan ruler, ends" → "Kushan rule fades out as Kidarites and Guptas hold its former lands".
  - **Reason:** Kipunada reigned c. 335–350 (Kipunada and Kushan Empire articles), not until 375. The year c. 375 is the conventional end of Kushan rule, after the Kidarite invasions.
  - **Sources:** https://en.wikipedia.org/wiki/Kipunada, https://en.wikipedia.org/wiki/Kushan_Empire
- [sasanian-empire 299] text: "Peace of Nisibis after Narseh's defeat: land west of the Tigris ceded" → "Peace of Nisibis after Narseh's defeat: Rome gains five provinces east of the Tigris".
  - **Reason:** the old text was misleading. Persia ceded five satrapies *east* of the Tigris and recognised the river as the border.
  - **Source:** https://en.wikipedia.org/wiki/Peace_of_Nisibis_(299)

## Flagged, not changed (outside the `detail` task, or disputed rather than wrong)

- **maurya-empire −298**, "extends rule into the Deccan": this is disputed. The Bindusara article says the claim rests on a 16th-century Tibetan source (Taranatha), and several historians think he only kept what he inherited. The detail gives both views. Consider softening the text, e.g. "may have extended".
- **seleucid-empire −129**, "killed … at Ecbatana": the Parthian Empire article calls it the Battle of Ecbatana, while the Antiochus VII article says he was ambushed in the Zagros. The detail gives both.
- **achaemenid-empire −343**, Artaxerxes III's reconquest of Egypt: the Artaxerxes III article says probably 340 or 339. The detail says it is traditionally dated 343, with 340/339 preferred by many scholars.
- **gupta-empire 405**, "Ujjain a second capital": this is D. C. Sircar's theory (Chandragupta II article). The detail hedges it ("according to one theory").
- **Reigns outside scope, in two journeys:**
  - hittite-empire: the `reigns` entry dates Telipinu −1560→−1500, but the Telipinu article gives c. 1525–1500.
  - kushan-empire: the `reigns` entry "Little Kushans of Punjab (to Kipunada) 230–375" implies Kipunada ruled until 375.
- **Redirects:** "Sixth Syrian War" (ptolemaic-kingdom sources) now redirects to "Syrian Wars". "Eastern Han dynasty" (qin-han sources) redirects to "Han dynasty", so qin-han has two source entries that open the same page.

## Contested facts hedged in the details

- **sumer:**
  - Uruk's size and population are given as ranges.
  - Enmebaragesi is dated c. 2700–2600, and Gilgamesh is "probably" historical.
  - Mesilim is c. 2550 "by one estimate".
  - Eannatum's 3,600 enemy dead are credited to his own inscription.
  - Doubts about a single coherent reform by Urukagina are noted.
  - Lugalzagesi's reach to the Mediterranean "may have been little more than a raid", and his 25-year reign comes from the Sumerian King List.
- **akkadian-empire:**
  - Sargon's reign is given as c. 2334–2279, with 2316–2277 as an alternative. His cupbearer origin is marked as later legend, and his death has alternative dates.
  - Lugalzagesi's defeat is put "around 2300".
  - The murders of Rimush and Manishtushu are later tradition.
  - The Great Revolt and the Lullubi stele are undated within Naram-Sin's reign.
  - The drought (the 4.2-kiloyear event) is a cause of the collapse that "many historians" suggest.
- **ur-iii:**
  - Ur-Nammu "may have been" Utu-hengal's brother, and the Code is credited to him "or his son". His death in battle comes from a later poem.
  - Shulgi was deified by year 21, perhaps as early as year 12.
  - Ishbi-Erra's letters are later school copies.
  - The fall of Ur is c. 2004 on the middle chronology; 1940 is also given.
- **old-babylonian-empire:**
  - Larsa fell in 1763 (or 1764).
  - Mari was taken c. 1761 and destroyed by 1759.
  - The Code is "often c. 1753".
  - Rim-Sin II was "perhaps" Rim-Sin I's nephew.
  - Whether war or a deliberate retreat emptied Ur and Uruk is debated.
  - The Sealand stayed independent for 270–300 years.
  - The sack of Babylon is c. 1595, with proposed dates spread across up to 230 years.
- **hittite-empire:**
  - Hattusili I may be the same person as Labarna.
  - The Egyptian queen is "most likely" Ankhesenamun.
  - The plague as Suppiluliuma's cause of death is "often considered".
  - Kadesh is May 1274 "by the usual chronology", and 5,000–6,000 chariots "may have" taken part.
  - The treaty is c. 1259 (or 1258).
  - Hattusa was abandoned gradually, and Suppiluliuma II's fate is unknown.
- **egypt-new-kingdom:**
  - Avaris was taken by Ahmose's 18th or 19th year at the latest.
  - Thutmose III was between 2 and 13 at accession.
  - Megiddo is 1457, with 1482/1479 as alternatives.
  - Akhenaten acceded in 1353 or 1351.
  - Ramesses I reigned 1292–1290 or 1295–1294.
  - Kadesh was a stalemate.
- **neo-assyrian-empire:**
  - Qarqar is 853 (or 854) and was probably indecisive.
  - Tiglath-Pileser III was likely a usurper.
  - Samaria was probably taken by Shalmaneser V.
  - Both sides claimed Halule.
  - Harran fell in late 610 or early 609.
- **neo-babylonian-empire:**
  - The Medes invaded in 615 or 614.
  - Jerusalem fell in 587 (or 586); the Bible gives the siege as 18–30 months.
  - The 13-year siege of Tyre rests on Josephus alone.
  - Babylon fell "without battle" in Babylonian sources, while Greek writers describe a siege.
- **achaemenid-empire:**
  - Lydia fell in 547 (or 546).
  - Gaumata as an impostor is Darius's own account and suspected as propaganda.
  - Where Hindush lay is uncertain.
  - The Indus campaign is 516–515 in one reconstruction.
  - Marathon casualties are Herodotus's figures.
- **rome:**
  - 509 is the traditional date, and the founding story is probably legendary.
  - Britain was lost "around 410".
  - Trajan's peak is "about 5 million km²".
  - Carthage fell in 439 "apparently without a fight".
- **alexander:**
  - Chaeronea troop numbers are "according to Diodorus".
  - Perdiccas was murdered in 321 or 320.
  - Alexander died on 10 or 11 June 323.
  - Alexander IV was poisoned "according to Pausanias", some time between 311 and 304.
- **maurya-empire:**
  - Magadha was conquered c. 322–319.
  - The treaty with Seleucus is c. 303–302; only some of the ceded provinces are certain.
  - The legends that Ashoka killed his brothers are unconfirmed.
  - Kalinga is c. 261 (or 260).
  - Brihadratha was killed in 185 (or 180).
- **seleucid-empire:**
  - Seleucus returned to Babylon in 312 or 311.
  - Bactria broke away "around 245, very uncertain".
  - Panium is 200 (or 198).
  - Magnesia was December 190 or January 189.
  - Pompey annexed Syria in 64 or 63.
- **ptolemaic-kingdom:**
  - Ptolemy I took the royal title in 305/304.
  - The Raphia army sizes and Popillius's circle in the sand are "according to Polybius".
  - Ptolemy Apion's separate reign is "apparently" c. 105–101.
  - Cleopatra died of an asp bite by tradition, though poison is more likely.
- **parthian-empire:**
  - The meaning of the 247 era is disputed.
  - Ecbatana fell in 148 or 147.
  - Antony's army size and losses come from ancient sources that contradict each other.
  - Avidius Cassius invaded in 164 (or 165).
  - Severus took Ctesiphon in late 197 or early 198.
  - Artabanus IV revolted c. 212–213.
  - The site of Hormozdgan has never been found.
- **qin-han:**
  - Meng Tian's army is "said to" have numbered 300,000.
  - The First Emperor's quest for an elixir is "reportedly".
  - Gaixia was in the winter of 203–202.
  - Gaozu's escape at Baideng is "reportedly".
  - Huo Qubing reaching Lake Baikal is "reportedly".
  - The Protector-General post dates to 60 or 59.
- **xiongnu:**
  - Modu's coup is told "according to Sima Qian".
  - The blow against the Yuezhi is dated 178–176, and the final expulsion c. 165–162.
  - Mobei losses are "according to official Han reports".
  - Zhizhi's fort was "probably near Talas".
- **kushan-empire:**
  - Kujula's dates are c. 30–80 or 40–90.
  - The Ban Chao battle is 90 (or 86).
  - Vima Kadphises is c. 113–127, or from c. 95.
  - Vasudeva I died c. 225, but Chinese records suggest he may still have ruled in 229.
  - The Allahabad pillar's "Daivaputra-Shahi-Shahanushahi" is read by many historians as the Kushans; others suggest Kidara I.
  - The Kidarite takeover is c. 360–370.
- **sasanian-empire:**
  - Antioch was first sacked in 253 or 256.
  - Narseh's early victory was in 296 or 297.
  - Peroz's death in a hidden trench comes from later accounts.
  - Wahrez's force is given as 800 to 7,500 men.
  - The Jerusalem siege of about three weeks comes from one eyewitness account.
  - The invasion of Egypt began in 617 or 618.
  - The Avar–Slav army at Constantinople was "perhaps 80,000".
  - Qadisiyyah army sizes are approximate.
  - Nahavand is 642 (or December 641).
  - Yazdegerd's murder has two versions.
- **gupta-empire:**
  - Chandragupta I's 319–320 accession assumes he founded the Gupta era.
  - The Ramagupta story is of disputed truth.
  - Kalidasa "may have been" Chandragupta II's court poet.
  - The Western Satraps were conquered c. 397–409.
  - Nalanda's founder Shakraditya is "usually identified" with Kumaragupta I.
  - The date of the Huna war is uncertain.
  - The sack of Kausambi is inferred from seals, one of them of doubtful authenticity.
  - The outcome of Eran is debated.
  - Narasimhagupta's role in 528 is "possibly".

## New sources added (pages fetched and used; capped at 8 per journey)

- **sumer:** Uruk period, Royal Cemetery at Ur
- **akkadian-empire:** Victory Stele of Naram-Sin, Shu-turul
- **ur-iii:** Ur-Nammu, Shu-Sin, Ibbi-Sin, Kindattu
- **old-babylonian-empire:** Code of Hammurabi, Mari (Syria), Mursili I
- **hittite-empire:** Telipinu, Battle of Kadesh, Šuppiluliuma II
- **egypt-new-kingdom:** Thutmose I, Battle of Kadesh
- **neo-assyrian-empire:** Battle of Qarqar, Sennacherib, Fall of Nineveh
- **neo-babylonian-empire:** Nabopolassar, Nabonidus, Battle of Opis, Fall of Babylon, Siege of Tyre (586–573 BC)
- **achaemenid-empire:** Cyrus the Great, Cambyses II, Artaxerxes III, Bardiya
- **rome:** Fall of the Western Roman Empire, End of Roman rule in Britain, Pyrrhic War
- **alexander:** Battle of Ipsus, Battle of the Hydaspes, Battle of Chaeronea (338 BC)
- **maurya-empire:** Chandragupta Maurya, Seleucid–Mauryan War, Bindusara, Ashoka, Kalinga War
- **seleucid-empire:** Seleucus I Nicator, Treaty of Apamea, Tigranes the Great
- **ptolemaic-kingdom:** Battle of Raphia, Ptolemy Apion, Battle of Actium, Cleopatra
- **parthian-empire:** Antony's Atropatene campaign, Septimius Severus, Artabanus IV of Parthia, Battle of Hormozdgan
- **qin-han:** Ziying of Qin, Battle of Gaixia, Protectorate of the Western Regions
- **xiongnu:** Laoshang, Battle of Mayi, Battle of Zhizhi
- **kushan-empire:** Han dynasty, Ban Chao, Kushano-Sasanian Kingdom, Kipunada
- **sasanian-empire:** Byzantine–Sasanian War of 602–628, Khosrow I, Peace of Nisibis (299), Julian's Persian expedition
- **gupta-empire:** Chandragupta I, Samudragupta, Skandagupta, Toramana

Other pages were also read for the details but left out because of the 8-source cap. Examples: Battle of Edessa, Peroz I, Battle of al-Qadisiyyah, Battle of Nahavand and Yazdegerd III (sasanian); Kumaragupta I, Nalanda mahavihara, Eran, Yashodharman and Mihirakula (gupta); Kidarites, Huvishka and Vasudeva I (kushan); Battle of Baideng, Battle of Mobei and Wang Mang (qin-han).
