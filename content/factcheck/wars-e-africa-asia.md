# Wars log: content/wars/e-africa-asia.json

Two non-Western wars: the Taiping Rebellion (1850–1864) and the First Italo-Ethiopian War (1895–1896).
Every page cited was fetched (Wikipedia raw wikitext, ~1 request / 2 s; Columbia Asia for Educators). Britannica returned 403 to both curl and WebFetch, so it is not cited.

## Taiping Rebellion (`taiping-rebellion`)
- **Members.** Side 0 "Qing Dynasty" 1850–1864 (rows 1848–1864 in index.json). Side 1 "Taiping Heavenly Kingdom" 1853–1864 (realm rows 1853–1864; no relabels in corrections.json). For 1850–52 there is no Taiping realm, so the side has no map colour in those years; the storyboard draws the rebel army as an occupied area.
- **Left out of members.** Britain and France, which fought the Taiping around Shanghai and Ningbo in 1862–64, are described in the text but not added: "(British Empire)" and "(Second French Empire)" would colour both empires worldwide for a few battalions, and in 1856–60 the same powers were at war *with* the Qing (Second Opium War). The Ever Victorious Army was a Qing unit. Co-belligerent rebels (Nian, Red Turbans, Small Swords) have no realm here except the separate "Panthay Rebellion" polygon, which was a distinct movement and is not listed.
- **Moment.** No moment for the Taiping itself; the Opium Wars moment only mentions it in its "also" line, so `moment` is null.
- **Map-data gaps.** The Taiping realm polygon is coarse and often wrong: Wuchang and Jiujiang stay Taiping until 1861 (lost for good in Dec 1856 and May 1858), Shanghai and Ningbo are Taiping from 1861 (Shanghai never fell), Anqing stays Taiping until 1864 (fell Sep 1861) and Nanjing for all of 1864 (fell 19 Jul). The storyboard therefore uses 1852 borders as its base (baseYears) and draws Taiping control itself; the yearly war playback still uses the realm as is. Logged here rather than corrected, since corrections.json is a shared file.
- **Contested / hedged.**
  - Death toll: 20–30 million is the mainstream estimate (Wikipedia; Columbia AFE says "more than twenty million"); figures up to 70–100 million exist and are mentioned only as "some estimates run far higher".
  - Start date: fighting began in late December 1850; the formal rising was 11 January 1851 (dateLabel "December 1850").
  - Li Kaifang's capture at Fengguantun: 31 March 1855 (Li Kaifang article) vs 31 May 1855 (Northern Expedition article). Event dated "May 1855" with both dates given in the detail.
  - Shanghai 1860: the Taiping Heavenly Kingdom article says the August 1860 attack was repulsed; the Battle of Shanghai (1861–1862) article says a Taiping army "reoccupied it for five months". Shanghai city and the settlements did not fall; the text follows the first.
  - Hangzhou: taken briefly in a raid on 19 March 1860 (then abandoned) and captured after a siege on 31 December 1861. Zuo Zongtang's recapture is only dated "1864" in the fetched source, so no day is given.
  - Suzhou: surrendered in early December 1863 (Tan Shaoguang article; Gordon article says November); dated "Dec 1863".
  - Nanjing 1864 deaths: Zeng Guofan's reports give 100,000 (Xiang Army article) to 200,000–300,000 "rebels" (Third Battle of Nanjing article); the text says "100,000 or more".
  - Wording: "rebellion" is the conventional English name; the summary notes it was a civil war, as recent historians (Platt, Meyer-Fong) argue.

## First Italo-Ethiopian War (`first-italo-ethiopian-war`)
- **Members.** Side 0 "Kingdom of Italy" + "Italian Africa" 1895–1896 (no "(Kingdom of Italy)" empire group exists; Italian Africa carries Eritrea and Italian Somaliland; the base map also keeps a small "Kingdom of Italy" polygon at Massawa). Side 1 "Ethiopian Empire" 1895–1896 (rows to 1935).
- **Moment.** `battle-of-adwa` (content/moments-ce-b.json).
- **Map-data gaps.** The base map has no Italian occupation of Tigray (Adigrat, Adwa, Mekelle, 1895–96); the storyboard adds it as occupied areas. The Ethiopian Empire's 1895–97 area in index.json (683,000 km²) is far below Ethiopia's real extent; not relevant to the storyboard frames.
- **Contested / hedged.**
  - Start: the war is usually dated from Coatit (13 January 1895); the Bahta Hagos revolt (December 1894) is background in the first event.
  - Adigrat: 25 March 1895 (Adigrat article) vs "March 8" in the war article; the Adigrat date is used.
  - Mekelle: the Senafe article puts its occupation in early 1895, the Debra Ailà and Mekelle articles imply October 1895 (fort built October 1895); events say Mekelle was occupied without a fight and fortified in October.
  - Mekelle surrender: white flag 19 January (Siege of Mekelle article) vs agreement on 21 January (war article); 21 January used.
  - Treaty of Addis Ababa: 26 October 1896 in the treaty article's text, 23 October in its infobox; 26 October used.
  - Adwa strengths and losses vary by source (Ethiopians 73,000–120,000; Italians 14,500–17,700; Italian dead 5,900–6,133; Ethiopian dead 3,886–7,000); ranges are given.
  - Crispi left office on 10 March 1896 (Crispi article).
- Count: 2 wars, 42 events (27 + 15), 16 source pages.
