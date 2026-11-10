# Storyboard: Imjin War (1592–1598)

File: `content/cinema/imjin-war.json`. It has 8 chapters, 1 occupation track ("Japanese-held Korea", 25 keyframes), no front lines, 21 arrows, 22 battles and 41 claims. `validate.py` reports no errors. `check_history.py` reports 0 errors and 15 warnings, and all 41 claims pass.

## Chapters and why
1. **From Busan to Hanseong** (22 May – 12 Jun 1592): the landing, Busanjin, Dongnae, Sangju, Chungju and Hanseong.
2. **Pyongyang and the far north** (Jun – Sep 1592): the Imjin river, Pyongyang, Katō to Hoeryong and Zu Chengxun's repulse.
3. **Yi Sun-sin's fleet** (Jun – Oct 1592): Okpo, Hansan Island and the attack on Busan harbour. The war's turning point at sea gets its own frame on the south coast.
4. **Jinju and the Righteous Armies** (Sep – Nov 1592): the first siege of Jinju, with guerrilla recoveries (Cheongju, western Gyeongsang).
5. **The Ming army retakes the north** (Jan – Jun 1593): Pyongyang, Byeokjegwan, Haengju and the Japanese withdrawal to the coast.
6. **The fall of Jinju and the truce** (Jul 1593 – Mar 1597): the second siege of Jinju, the wajō and the collapse of the talks.
7. **The second invasion** (Aug – Nov 1597): Chilcheollyang, Namwon, Jiksan and Myeongnyang.
8. **Ulsan, Suncheon and Noryang** (Dec 1597 – 22 Dec 1598).

## How it is drawn
- **No continuous front.** The Japanese held roads, castles and coasts while guerrillas worked behind them. The storyboard draws one Japanese-held area that grows and shrinks.
- **Rings may run into the sea.** Occupied areas are only drawn on land, and pockets ignore sea, so the rings follow the coast loosely.
- **Arrows:**
  - Japanese columns and attacks on side 0.
  - Ming armies on side 2.
  - Korean fleet movements on side 1.
- **Naval battles** sit at sea.
- **baseYears 1595–1598 → 1594.** The 1595–99 data paints central Korea, including Hanseong, as Japanese, which never happened.

### Sources traced
Geometry and routes come from the "Map of invasions" in the Imjin War article and the routes it describes, plus the battle articles:
- Busanjin, Dongnae, Sangju, Chungju
- Imjin River, Pyongyang 1592/1593, Hansan, Busan
- Jinju 1592/1593, Byeokjegwan, Haengju
- Chilcheollyang, Namwon, Jiksan, Myeongnyang
- Ulsan, Sacheon 1598, Suncheon, Noryang

## Uncertainties
- **Calendars.** The main article mixes lunar and Gregorian dates. The battle articles' Gregorian dates are used, and two dates are deliberately vague:
  - The evacuation of Hanseong is shown between 15 May and 15 June 1593; claims test Hanseong on 1 Apr (Japanese) and 30 Jun (Korean).
  - The Battle of Busan is put at 5 Oct 1592 (the 1st day of the 9th lunar month).
- **Extent of Japanese control in 1592** is approximate:
  - Gangwon is shown as held along the coast route and Hwanghae as far as Haeju.
  - Jeolla and western Gyeongsang are shown as never held in 1592.
  - The northern Hamgyong towns, retaken by partisans, are dropped from late 1592.
- **Sacheon 1598.** The infobox gives only "October 1598", so the battle is placed on 30 October.

## Warnings left (15)
- **14 arrow warnings.** They are expected without fronts: attacks end at the besieged town or at sea.
- **1 pocket warning** (922 km² at 127.1°E 36.9°N, 4 Sep 1592). This is the interpolation between the 30 Aug and 6 Sep keyframes, when the Cheongju area is cut out; it is under the 2,500 km² error limit and lasts a few days.
