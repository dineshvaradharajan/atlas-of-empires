# Storyboard: Mongol conquests (1206–1260)

File: `content/cinema/mongol-conquests.json`. It has 12 chapters, 16 occupation tracks (93 keyframes), no front lines, 38 arrows, 28 battles and 68 claims. `validate.py` reports no errors. `check_history.py` reports 0 errors and 35 warnings, and all 68 claims pass.

## Chapters and why
The war covers half of Eurasia, so each chapter frames one campaign theatre. Together they are the campaigns the brief names, plus Qara Khitai and the two Western Xia campaigns that frame Genghis's reign.
1. **Western Xia submits** (1209–10): the first invasion of a settled state, with the siege of Zhongxing.
2. **Into Jin China** (1211–15): Yehuling, the Juyong pass and the fall of Zhongdu.
3. **Qara Khitai** (1218): Jebe and Kuchlug. It brings the Mongol border to Khwarazm.
4. **Otrar, Bukhara and Samarkand** (1219–20).
5. **Jebe and Subutai's great ride** (1220–23): Khunan and the Kalka.
6. **The destruction of Khwarazm and Khorasan** (1221): Gurganj, Merv, Nishapur, Parwan and the Indus.
7. **The end of Western Xia** (1226–27): Genghis's death.
8. **The fall of the Jin** (1230–34): Fengxiang, Sanfengshan, Kaifeng and Caizhou.
9. **The conquest of Rus'** (1237–40): Ryazan, Vladimir, the Sit, Kozelsk, Chernigov and Kiev.
10. **Poland and Hungary** (1241–42): Legnica, Mohi, the Danube crossing and the withdrawal.
11. **The Assassins and Baghdad** (1256–58).
12. **Syria and Ain Jalut** (1260).

## How it is drawn
There were no continuous fronts, so the storyboard uses no front lines. It uses:
- **Areas of conquered or overrun ground** (side 0). One track per theatre grows through the campaign and ends when the yearly base map catches up.
- **Moving circles** for armies on campaign rather than conquest: Jebe and Subutai in 1220–23, and Baidar and Kadan's raid through Poland in 1241.
- **Side-1 areas that correct the base map** where it draws enemy land as Mongol too early:
  - Western Xia in 1226–27, because the data shows the Hexi corridor and Yinchuan as Mongol from 1219.
  - Hungarian and Polish ground covered by the 1241 data's Mongol "fingers" into Silesia and the upper Tisza.
  - The Nizari castles of Rudbar until December 1256.
- **Mamluk areas** (side 2) for the advance from Gaza (July 1260) to Ain Jalut and Damascus.

### baseYears
| Dates | Borders shown | Why |
|---|---|---|
| 1220–21 | 1219 | The 1220 data already gives Transoxiana to the Mongols, and the 1221 data blanks Khorasan. |
| Jan–15 Sep 1227 | 1226 | The 1227 data shows Xia already Mongol. |
| 1 Jan–10 Feb 1258 | 1257 | The 1258 data shows Iraq Mongol from January. |
| Sep 1259–Sep 1260 | 1259 | The 1260 data makes all of Syria Mongol for the whole year. |

### Maps and sources traced
The geometry is approximate. It was traced from the campaign maps embedded in the Wikipedia articles and from the routes their texts describe:
- Mongol conquest of Western Xia and of the Jin dynasty
- Yehuling Campaign
- Mongol invasion of the Khwarazmian Empire (Rashid al-Din's and the article's campaign map)
- Mongol invasion of Kievan Rus'
- First Mongol invasion of Poland and of Hungary
- Siege of Baghdad
- Mongol invasions of Syria and its "Mongol raids in Syria and Palestine 1260" map
- Battle of Ain Jalut and its campaign map

Dates come from the battle and siege articles (14 cited in `sources`, plus Qara Khitai, Kozelsk, Vladimir, Ryazan, Kiev, Legnica, Alamut, Aleppo, Gurganj, Merv, Nishapur, Parwan and Bukhara in the claims).

## Uncertainties
- **Areas show overrun or dominated ground, not administered provinces.** The Rus' principalities, for example, were raided and made tributary rather than garrisoned. The note says so.
- **Wulahai.** Its location is disputed, so its claim point is marked "location approximate" and sits well inside the 1209 area.
- **Khunan.** The battle is placed in autumn 1220, following "Mongol invasions of Georgia" (first contact in the autumn of 1220). Some accounts put it in early 1221.
- **Chernigov's fall.** The article says only "the winter of 1239", so the claim is dated June 1240.
- **Kaifeng and Luoyang.** In 1232 the area covers west Henan, including Luoyang, which actually held out until 1233. The chapter text does not mention Luoyang.

## Warnings left (35)
- **18 arrow warnings.** They are expected for a war with no fronts: an arrow ends at the city it attacked, on enemy or neutral ground.
- **17 pocket warnings, all under 2,500 km² apart from grey ones:**
  - Slivers where coarse base-map edges (Jin's north-east, the Kara-Khitans' Fergana edge, Galicia's Carpathian corner) poke between ring vertices.
  - Grey neutral land a ring borders: the Ordos (Western Xia was a Mongol vassal in 1215), Kashmir (Lohara), Smolensk (never attacked in 1238–40) and the Song border after 1234.
  - Base-map gaps (blank land in Khorasan and Dzungaria).

  None is a place that held out, and none is large enough to fail.

## Base-map problems noted, not fixed (shared files untouched)
- 1242–49: the Silesian finger stays Mongol in the base map after the war; my Polish correction ends with 1241.
- 1222–26: Khorasan and Afghanistan are blank.
- `render_frames.py` draws only outer rings, so the Mamluk 1259 polygon, which has Syria cut out as a hole, looks green over Syria in the review PNGs. `geo.contains` honours the hole, and the claims test correctly.
