# Storyboard: Taiping Rebellion (1851–1864)

File: `content/cinema/taiping-rebellion.json`. 11 chapters, 58 claims (all pass), 6 occupied areas (71 keyframes), 19 arrows, 15 battles, no fronts.
Check: `check_history.py`: 0 errors, 6 warnings (below). `validate.py`: no errors.

## Chapters and why
1. **Rising in Guangxi** (Jan 1851 – Apr 1852): Jintian rising (11 Jan 1851), march to Yong'an (25 Sep 1851).
2. **The march to the Yangtze** (Apr 1852 – Jan 1853): Guilin, Suoyi ford (10 Jun 1852), siege of Changsha (Sep–Nov), Yuezhou, Wuchang (12 Jan 1853).
3. **Down the Yangtze to Nanjing** (Jan – Apr 1853): Anqing (Feb), Nanjing (19 Mar), Yangzhou (Apr).
4. **The Northern Expedition** (May 1853 – May 1855): Yangzhou → Huaiqing → Shanxi → near Tianjin (30 Oct 1853) → retreat (5 Feb 1854) → destruction (1855).
5. **The Western Expedition and the Xiang Army** (May 1853 – May 1856): Anqing (10 Jun 1853), Luzhou (14 Jan 1854), Xiangtan (1 May 1854), Wuchang lost (14 Oct 1854) and retaken (3 Apr 1855), Jiangxi.
6. **Murder in the Heavenly Capital** (Jun 1856 – Dec 1858): Jiangnan camp broken (20 Jun 1856), Tianjing Incident (2 Sep), Wuchang lost for good (19 Dec 1856), Jiujiang (May 1858), Sanhe (16 Nov 1858).
7. **Breakout to the east** (Feb – Sep 1860): Hangzhou raid, rout of the Jiangnan Battalion (May), Changzhou (26 May), Suzhou (2 Jun), Shanghai repulse (Aug).
8. **The siege of Anqing** (Sep 1860 – Sep 1861): fall of Anqing (5 Sep 1861).
9. **Zhejiang and Shanghai** (Oct 1861 – Oct 1862): Ningbo (9 Dec), Hangzhou (31 Dec 1861), Shanghai, Ningbo retaken (10 May 1862), Cixi (21 Sep 1862).
10. **The reconquest of Jiangsu** (Nov 1862 – May 1864): north bank lost (Jun 1863), Kunshan (31 May 1863), Suzhou (Dec 1863), Changzhou (11 May 1864).
11. **The fall of Nanjing** (Mar – Jul 1864): investment (2 Mar), Hong's death (1 Jun), storming (19 Jul 1864).
Chapters 4 and 5 overlap in time (different theatres: north China and the middle Yangtze).

## How it is drawn
- **Base map.** `baseYears` draws 1852 borders for 1853–1864. The map's own Taiping realm outline is coarse and wrong for most years (Wuchang Taiping until 1861, Shanghai and Ningbo Taiping from 1861, Anqing until 1864, Nanjing all of 1864), so Taiping control is drawn entirely with dated side-1 areas over Qing ground. The yearly war playback still shows the realm as Cliopatria draws it (logged in wars-e-africa-asia.md).
- **Areas (side 1).** "Taiping army on the march (1851–1853)": a moving area for the army from Jintian to the gates of Nanjing (held ground, not conquest). "Taiping Heavenly Kingdom on the Yangtze": one continuous area per date, growing from Nanjing (Mar 1853) up the river to Anqing, Jiujiang and Wuchang, into central Anhui and northern Jiangxi (Nanchang excluded, never taken), shrinking as Wuchang (Dec 1856) and Jiujiang (May 1858) fall, expanding east to Suzhou (Jun 1860) and Zhejiang (Dec 1861), then shrinking with Anqing (Sep 1861), Ningbo and the Shanghai area (May 1862), the north bank and Kunshan (Jun 1863), Suzhou (Dec 1863) and Changzhou (May 1864). "Besieged Nanjing (March–July 1864)": the city alone after the investment of 2 March. Smaller areas: the Northern Expedition (moving), the Taiping column at Xiangtan (Apr–May 1854), Taiping forces in northern Zhejiang after Changzhou (May–Jul 1864).
- **Geometry** from the Commons map "Taiping Heavenly Kingdom map.svg" (early and late periods) and modern coordinates of the cities named in the sources; edges are approximate (the Taiping held cities, rivers and roads more than a clean polygon).

## Uncertainties and choices
- Hangzhou is inside the Zhejiang area from 9 Dec 1861 (when Ningbo fell), three weeks before the city itself fell (31 Dec), while it was under siege; no claim tests Hangzhou in between.
- Pudong and the Taiping positions closest to Shanghai (Jan–May 1862) are simplified: the area stops at Qingpu, west of Shanghai and Songjiang (Ward's base), so Shanghai never appears surrounded.
- Zuo Zongtang's recapture of Hangzhou is dated only "1864" in the fetched source; the area drops Hangzhou on 2 Mar 1864 (approximate; the city fell in spring 1864) and no claim tests it.
- The north-bank positions (Pukou, Yangzhou area) are kept until June 1863 (Third Battle of Nanjing: Jiufu Island and the whole north shore lost then); the earlier history of Yangzhou (retaken by Qing, re-entered by Taiping) is not drawn.
- Li Kaifang's capture: 31 Mar or 31 May 1855 (sources differ); the expedition area ends 31 May 1855 and no claim falls between those dates.
- The northern Zhejiang remnant area (May–Jul 1864) has no claims; it is backed only by the Taiping Rebellion article's statement that loyal forces kept fighting in northern Zhejiang.

## Warnings left (6, all arrows, not drawn in the app)
- Five Qing arrows end on Taiping-held ground: they are sieges and attacks on held cities (Sanhe outskirts 7 Nov 1858, Anqing Sep 1860, Nanjing May 1862, Suzhou Dec 1863, Changzhou May 1864), which is what the arrow means.
- "Li Xiucheng's raid on Hangzhou" ends on Qing ground: the Taiping took Hangzhou on 19 March 1860 and left at once, so no area is drawn there.

## Sources
Taiping Rebellion; Hong Xiuquan; Jintian Uprising; Feng Yunshan; Battle of Changsha (1852); Battle of Wuchang; Battle of Nanjing (1853); Li Kaifang; Northern Expedition (Taiping Rebellion); Western Expedition; Zeng Guofan; Tianjing Incident; Battle of Sanhe; Battle of Jiangnan (1860); Battle of Anqing; Taiping Heavenly Kingdom; Battle of Shanghai (1861–1862); Battle of Cixi; Charles George Gordon; Tan Shaoguang; Battle of Changzhou; Zuo Zongtang; Third Battle of Nanjing; Xiang Army (all English Wikipedia, raw wikitext fetched); Commons file Taiping Heavenly Kingdom map.svg.
