# Ancient sites and cultures: East Asia, Southeast Asia and Oceania (10,000 BCE – c. 500 CE)

Files: `content/ancient/sites-east-asia.json` (49 sites), `content/ancient/cultures-east-asia.json` (23 cultures).
Brief: `content/ANCIENT.md`; sourcing rules: `content/FACTCHECK.md`.

## Counts
- Sites: 49. By label: archaeology 34, written 9, disputed 5, legendary 1. 15 sites have a Commons image, and each one was viewed before use.
- Cultures: 23. By label: archaeology 20, disputed 2, written 1.
- Validation passed. JSON parses, ids are unique and kebab-case across both files, and sites are sorted by `built`. Every `culture` reference resolves. Rings are closed with 8–30 points and lon/lat are plausible. Years are ordered, and extent years fall inside culture years. Summary lengths are within 60–110 words (sites) and 40–90 (cultures).

## Sources actually used
- English Wikipedia raw wikitext for every site and culture cited, fetched to the scratch dir and read. Facts were taken from the cited statements: dates, sizes, discovery years, inscription years.
- Burley, Weisler & Zhao 2012, *PLoS ONE* 7(11) e48769 (Nukuleka U/Th dating), journals.plos.org, read in full abstract.
- Wikimedia Commons API (`imageinfo` with extmetadata) for image licences and authors, plus the raw Commons file page for *Plainofjars 2.jpg*, whose author is given only there (Oliver Spalt).
- Not accessible: whc.unesco.org (Cloudflare challenge for curl, HTTP 403 for WebFetch), britannica.com (403), science.org and pnas.org (403), smithsonianmag.com (403), metmuseum.org (429). UNESCO inscription years therefore come from the Wikipedia infoboxes and statements that cite UNESCO. No UNESCO URL is cited.
- The Wikimedia API rate limit (HTTP 429) blocked a Wikidata coordinate lookup. Coordinates come from the `{{coord}}` templates in the articles where present. Hand-placed points (approximate, about ±10 km): Shangshan, Pengtoushan, Peiligang, Liangzhu, Yinxu, Songguk-ri, Plain of Jars Site 1, the Đông Sơn village, the Lapita type site (Foué peninsula), the Budj Bim eel traps (Lake Condah), Murujuga, Rano Raraku, the Kutai yūpa find-spot (Muara Kaman). The Kutai point uses Muara Kaman, not the Wikipedia infobox value (1.03 N), which looks wrong for a site on the Mahakam River south of the equator.

## What is included, and why
- Required items: all included. Xianrendong, Jiahu, Peiligang, Banpo, Niuheliang, Liangzhu, Taosi, Shimao, Erlitou, Zhengzhou, Yinxu, Sanxingdui, Jinsha, the Terracotta Army, Sannai-Maruyama, Yoshinogari, early kofun (Hashihaka and Daisenryō), Ban Chiang, Đông Sơn, Óc Eo, Lapita sites (Teouma, the type site, Nukuleka), Nan Madol and the Rapa Nui moai.
- Cultures: all requested ones included except Pengtoushan and Peiligang, which are cultures, plus Hoabinhian, Shangshan, Jeulmun, Majiayao, Dapenkeng, Sanxingdui and Kofun.
- Foundations of the region: Kuk Swamp (independent invention of farming), Shangshan (early rice use), Spirit Cave (Hoabinhian foragers), Budj Bim (aquaculture, 6,600 years old), Bangudae (whale hunting carvings), the Korean dolmens, Manunggul (Austronesian jar burial), the Plain of Jars, Cổ Loa, Beikthano (Pyu), and the Kutai yūpa (the oldest inscriptions in Indonesia).
- Later antiquity, up to about 500 CE: Dujiangyan (still in use, `until: null`), Mawangdui, the Mogao Caves, the Gwanggaeto Stele and the Yungang Grottoes.
- Later than the period, each labelled so in `dateLabel` and the summary: Nan Madol (megalithic building c. 1180–1200 CE, capital until c. 1628), the Rapa Nui moai (mostly 1250–1500 CE), and Wairau Bar (c. 1288–1300 CE, settlement of New Zealand). They were added because the brief extends Oceania to the settlement of Polynesia.
- Two sites begin long before 10,000 BCE and continue into the atlas period. Murujuga (engravings from c. 45,000 years ago) has `built: -45000`. Xianrendong (pottery 20,000–19,000 BP) has `built: -18000`.
- Cultures that coexist with map states:
  - Erlitou (to 1500 BCE) overlaps the map's Shang realm (from -1600) by a century.
  - Đông Sơn (to the 1st century CE) overlaps the Nanyue and Han realms.
  - Sa Huỳnh and Ban Chiang lie outside any drawn state.
  - Jōmon, Yayoi and Kofun: no Japanese state is drawn before Asuka Japan (540), and Kofun ends in 538.
  - Mumun ends in 300 BCE, before the map's Gojoseon realm (-197).
  - Lapita lies outside all states.
  - No culture duplicates a realm in `public/data/clio/index.json`. Gojoseon, Funan, the Pyu city-states, Champa, Goguryeo and the Chinese dynasties are left to the map.

## What was left out, and why
- Khok Phanom Di (Thailand): no fetchable source with its dates (the Wikipedia article is a stub). Replaced by Spirit Cave.
- Kuahuqiao (oldest canoe), Xinglongwa, Lingjiatan, Shijiahe, Baodun, Lajia: omitted to keep within 50 sites. Kuahuqiao was researched (c. 6000 BCE, flooded c. 7,550 years ago) and can be added.
- Ōdai Yamamoto I and Yuchanyan (pre-10,000 BCE pottery in Japan and China): Xianrendong represents early pottery, and Jōmon pottery is mentioned in the Jōmon culture.
- Upper Xiajiadian and the Liaoning bronze dagger culture: these are often used as stand-ins for Gojoseon, and that link is disputed. Gojoseon itself is drawn on the map from -197.
- Longmen Grottoes (begun 493), Mỹ Sơn (standing temples from the 7th century), Borobudur (8th century), the Goguryeo tomb murals, the Gaya tumuli, the Tarumanagara inscriptions, the Great Wall (a linear feature that is not suited to a point), and Niah Cave (mainly Pleistocene): outside the time window, or lower priority than the chosen landmarks.
- No image is used for Daisenryō: the Commons aerial photograph (GSI) carries a custom "Attribution" licence, not one of the allowed licences. The images for Beikthano (modern gate) and Kuk (satellite view) were viewed and rejected as uninformative.

## Disputed and legendary cases (scholarly positions)
1. **Erlitou and the Xia dynasty** (`disputed`, site and culture). A majority of Chinese archaeologists identify Erlitou with the later Xia of the *Shiji* and the *Bamboo Annals*. Many Western scholars call this premature or unproven, because no contemporary writing has been found, unlike the oracle bones of Late Shang. Some consider Xia legendary. Traditional dates differ: the "current text" *Bamboo Annals* give 1989–1558 BCE, and Pankenier/Nivison 1953–1555 BCE. Radiocarbon dating since 2007 narrows Erlitou to c. 1750–1500 BCE, against earlier estimates of c. 1900–1500. The atlas uses -1750.
2. **Gojoseon's founding in 2333 BCE** (`legendary`, Mausoleum of Tangun). The date and Tangun come from the 13th-century *Samguk yusa* (and *Jewang ungi*). In 1993 North Korea claimed bones in the tomb near Pyongyang were Tangun's (c. 5011 ± 267 years). It built a pyramid there in 1994. Scholars outside North Korea do not accept this, and a Goguryeo-period nail in the tomb is part of the controversy. Placed because tradition (and North Korea) gives a location. The evidence note reads: "Not proven: no archaeological evidence has been found…". `built: -2333` is the traditional date only.
3. **Ban Chiang dating** (`disputed`, site and culture). 1970s thermoluminescence dates (4420–3400 BCE) suggested the world's earliest bronze. These were later rejected. One camp (White) puts the first settlement c. 2000 BCE (rice phytoliths c. 2100 BCE) and bronze c. 2000 BCE. Higham's Bayesian AMS dates on human bone give settlement c. 1500 BCE and bronze c. 1000 BCE. The atlas uses -2000 with the label "c. 2000 or 1500 BCE".
4. **Plain of Jars dating** (`disputed`). OSL dating suggests jars were placed c. 1240–660 BCE. The Lao-Australian project (2016–2020) dated secondary burials at Site 1 to the 8th–13th centuries CE. How long the jars were used is unresolved. The atlas uses -1240 to 1300.
5. **Hashihaka Kofun** (`disputed`). Some (Shiraishi, Hirose) date it to the mid–late 3rd century and link it with Himiko (died 247/248, *Records of Wei*). Others put it in the 4th century, citing early-4th-century Nunome pottery and possible radiocarbon offsets. The Imperial Household Agency assigns it to Princess Yamato Totohi Momoso and restricts access.
6. **Daisenryō Kofun** (`disputed`). Built over about 20 years in the mid-5th century. Attribution to Emperor Nintoku is "commonly accepted" but cannot be confirmed: the Imperial Household Agency keeps it closed.
7. **Jiahu symbols** (site `archaeology`). There is no consensus. Some see proto-writing related to the oracle bone script. A 2003 *Antiquity* report and most scholars see sign use, not writing.
8. **Taosi** (`archaeology`). The city is not in doubt. Two things are argued: the "observatory" interpretation (Pankenier links it to calendrical astronomy), and the identification with the sage-king Yao. Both are noted as unproven.
9. **Sanxingdui and Jinsha as the kingdom of Shu** (`archaeology`). Many Chinese archaeologists link them to Shu, which is known from the *Shiji*, the *Shujing* and local annals. No readable writing has been found at either site, so the link is presented as a scholarly identification.
10. **Zhengzhou Shang City** (`archaeology`). It was probably an early Shang capital, but which one (Bo, Ao) is uncertain.
11. **Cổ Loa** (`archaeology`). Part of the inner rampart is dated to c. 400–350 BCE (Kim, Lai & Trinh 2010). The attribution to An Dương Vương and the Golden Turtle story come from much later chronicles and legend. The `until: -100` value is approximate.
12. **Yayoi start date** (culture `archaeology`, the date flagged in `dateLabel`). The traditional start is c. 300 BCE. AMS radiocarbon pushes it to the 10th–8th centuries BCE, and this is still debated. The atlas uses -900.
13. **Nukuleka as "cradle of Polynesia"**. Burley's U/Th dates put the founding at 2838 ± 8 BP (c. 888 BCE). The Wikipedia article notes that Okusitino Māhina questions the conclusions, and Samoa has long claimed the title. Note: the Wikipedia article contains vandalised wording, so the peer-reviewed PLoS paper is the primary citation.
14. **Bangudae petroglyphs** (`archaeology`). Rock art cannot be dated directly. Wikipedia gives c. 5000 BCE to the 9th century CE, and the main whale scenes are usually called Neolithic. The start date is marked approximate.
15. **Dapenkeng and the Austronesians**. Most archaeologists see Dapenkeng as ancestral to Taiwan's Indigenous Austronesian speakers. No mainland antecedent has been firmly identified, so the evidence note calls this a strong but indirect inference. The start date is debated.
16. **Spirit Cave**. Its 1970s claim as evidence of early agriculture is now deprecated (Higham & Thosarat 2012). The summary says so.
17. **Kofun as `written`**. Chinese histories (the *Book of Song*) record the kings of Wa and Yamato–China contacts from the late 4th century. Japan's own chronicles date only from 712/720. This is noted in the evidence note.

## Figures checked against sources (selected)
- Xianrendong 20,000–19,000 BP (Wu et al. 2012, *Science*, as cited). Shangshan 11,400–8,600 cal BP. Kuk drainage c. 9,000 years ago, bananas 6,900–6,400. Jiahu 7000–5700 BCE. Banpo 4700–3600 BCE (infobox). Sannai-Maruyama 3900–2300 BCE, with the six-post building c. 2600 BCE. Niuheliang 3500–3000. Liangzhu 3300–2300 with a 290 ha walled interior. Taosi 2300–1900 with a 280 ha enclosure. Shimao c. 2300–1800, 400 ha, a 70 m stepped pyramid with 11 platforms. Ōyu 2000–1500, Manza circle 46 m. Zhengzhou 1630–1400 in four phases. Sanxingdui 12th–11th centuries BCE for the pits. Late Shang at Yinxu c. 1250–1046, 12 kings.
- Jinsha, Shi'erqiao phase 1200–800 BCE. Teouma cemetery c. 3200–3000 years old. Lapita Site 13 dated c. 800 BCE. Classic Lapita in the Bismarcks 1600–1200 BCE. Manunggul Jar 890–710 BCE. Songguk-ri c. 850–300 BCE. Gochang dolmens c. 7th century BCE (442 dolmens).
- Dujiangyan c. 256 BCE, 5,300 km², 20 m mountain cut. Qin mausoleum begun 246 BCE, army buried 210–209 BCE, over 8,000 figures (2007 estimate), found on 29 March 1974. Mawangdui: Li Cang died 186 BCE, the son 168 BCE, excavated 1972–74.
- Beikthano walls radiocarbon 180 BCE–610 CE. Óc Eo 450 ha, a 68 km canal to Angkor Borei, Antoninus Pius medallions. Mogao: first caves 366 CE, about 500 temples, Diamond Sutra of 868. Kutai yūpa, second half of the 4th century CE. Gwanggaeto Stele: 414 CE, 6.39 m, 1,775 or 1,802 characters. Daisenryō: about 500 m mound, 840 m total, three moats. Yungang: c. 460–465, 471–494 and to 525; 53 caves, about 51,000 niches.
- Nan Madol: megalithic building 1180–1200 CE, Saudeleur rule to c. 1628. Moai: 1250–1500, over 900 statues, 394 still at Rano Raraku. Wairau Bar 1288–1300 CE. Budj Bim eel trap 6,600 years old. Murujuga: about 1 million engravings, 2,500 sites, World Heritage July 2025.

## Culture extents
All rings are hand-drawn cores following the distribution descriptions in the cited articles (provinces, river basins, islands). They are not digitised from published maps. Treat them as approximate. Lapita is drawn as seven island-group rings, with start years showing the eastward spread (Bismarcks -1600; Solomons, Vanuatu and New Caledonia -1200; Fiji -1000; Tonga -900; Samoa -800). Jōmon shrinks to eastern Japan and Hokkaido after 900 BCE. Yayoi spreads from northern Kyushu (-900) to western and central Japan (-400).
