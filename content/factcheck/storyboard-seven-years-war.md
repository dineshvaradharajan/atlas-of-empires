# Storyboard: Seven Years' War

File: `content/cinema/seven-years-war.json`. 11 chapters, 25 occupation areas (91 keyframes), 39 arrows, 21 battles, 66 claims (all pass), 38 sources. No front lines: the war had none, so occupation areas show control and arrows show campaigns.

Checks: `tools/cinema/validate.py`: no errors. `tools/cinema/check_history.py seven-years-war`: 0 errors, 2 warnings (explained below), with the corrected-borders version of `geo.py` and the pockets rule.

## Chapters and why
1. **Calcutta lost and retaken; Plassey** (Jun 1756 – Jul 1757, Bengal): the Nawab takes Calcutta (20 Jun 1756), Clive retakes it (2 Jan 1757), takes Chandernagore (23 Mar), wins at Plassey (23 Jun) and enters Murshidabad (29 Jun). Ends with Bengal under Company control through Mir Jafar. The Wikipedia infobox describes this as "de facto control".
2. **Frederick invades Saxony** (Aug–Oct 1756): three columns, Dresden on 9 Sep, the Saxon camp at Pirna (left as a hole in the Prussian area until the surrender), Lobositz.
3. **Prague and Kolín** (Apr–Jul 1757): the invasion of Bohemia, the siege of Prague (the city is a notch in the Prussian area), Kolín and the retreat.
4. **Rossbach and Leuthen** (Oct–Dec 1757): the Franco-Imperial army west of the Saale, the Austrian reconquest of Silesia (Schweidnitz, then Breslau on 25 Nov), Leuthen, and Breslau retaken on 19–20 Dec.
5. **Lally's offensive and the siege of Madras** (Apr 1758 – Feb 1759): Fort St David falls, and the French siege lines hold Madras's Black Town from 14 Dec to 17 Feb.
6. **1758: Louisbourg to Fort Duquesne**: Louisbourg (26 Jul), the repulse at Carillon, the Frontenac raid, and Forbes's expedition (Duquesne taken on 25 Nov).
7. **Quebec, 1759**: Île d'Orléans, Pointe-Lévy, the Montmorency camp, the Anse au Foulon and the Plains of Abraham, then the capitulation on 18 Sep.
8. **Kunersdorf** (Jul–Sep 1759): Kay, the Russians at Frankfurt, Kunersdorf, and the Imperial capture of Dresden (6 Sep, per the Battle of Maxen article).
9. **Wandiwash and the fall of Pondicherry** (Jan 1760 – Jan 1761).
10. **Montreal, 1760**: Sainte-Foy and the siege of Quebec, then three converging armies and the surrender of Canada (8 Sep).
11. **Prussia survives: the peace of Hubertusburg** (Jan 1762 – Feb 1763): Burkersdorf, Schweidnitz retaken (9 Oct), Freiberg. Austria still holds Dresden, south-east Saxony and Glatz (cited in the main article).

Left out: Minorca, Minden and Hanover, Zorndorf, Hochkirch, Torgau, Liegnitz, the Russian raid on Berlin (1760), Havana and Manila, and an Oswego/Fort William Henry chapter. The 1758 chapter text speaks of "two years of French successes" without naming those captures.

## Corrections to the base map (occupation areas and baseYears)
- **Saxony 1756** is drawn as the neutral Polish-Lithuanian Commonwealth, so it gets a "Prussian-occupied Saxony" area. In 1757–61 the data already draws Saxony as Prussian. In Jan–Feb 1763 it is the neutral Electorate, and the Prussian area (minus the Austrian south-east) shows again.
- **1762 borders** draw Silesia and Saxony as Austrian and East Prussia and Pomerania as Russian for the whole year. `baseYears` uses 1761 borders for 1762, and occupation areas carry the real changes: Russian East Prussia until the Treaty of St Petersburg (5 May 1762), Austrian Glatz and Schweidnitz until 9 Oct 1762, and Austrian Dresden.
- **Calcutta** lies in "Danish India" in 1757–62 and in the Nawab's realm in 1756. Company areas fix both.
- **Pondicherry** has no shape at the point. The French Pondicherry area supplies it.
- **Chandernagore** sits in the Nawab's shape, so a French area runs until 23 Mar 1757.
- **New France 1761** still draws Canada French. The British area that covers Canada from 8 Sep 1760 runs to the end of the war.

- **Bohemia 1757–61** (and 1762 through the 1761 borders): the data draws a Prussian wedge from the Saxon border down to Prague, the 1757 invasion drawn as annexation. A border correction proposed in `content/factcheck/border-review-seven-years.json` cuts it out of "Kingdom of Prussia" for 1757–1761, using three boxes that keep Saxony, Lusatia, Silesia and Glatz. Corrections cannot add land, so the cut ground becomes unrecorded rather than Austrian.
  - In the storyboard, two Austrian areas, shaped like the cut boxes, paint that ground Austrian: one before the invasion (to 20 Apr 1757) and one after the Prussian retreat (from 29 Jul 1757 to the end of 1762).
  - During the invasion, the Prussian area runs from the Saxon border to Prague, with the city left out.
  - The storyboard passes the checks both with and without the correction applied.

## Pockets (enemy ground inside or between one side's areas)
- The Saxon occupation is split into a 1756 area and a 1763 area. In 1757–62 the data already draws Saxony Prussian, and a running area spilled onto Bohemian border cells, which made the Šluknov hook look like a pocket.
- The Prussian area in Bohemia now reaches the Saxon border, including the Šluknov hook along the Elbe supply line, so no Bohemian strip is left between it and Saxony. The 1757 Austrian area in Lusatia and Silesia now includes Zittau, which the Austrians took in July 1757 (Kolín article).
- Two pockets are real and explained by sourced claims:
  - **Glatz** (Prussian county and fortress, inside the Austrian ring in November 1757): Prussia held it until Laudon took it in 1760 (main article).
  - **Graslitz/Kraslice** (the Bohemian Asch–Graslitz salient beside Prussian-occupied Saxony in 1756): it stayed Austrian; the Lobositz article says the invasion of Bohemia was stopped.
- The Quebec chapter's area is drawn as one block (island, Beauport and Côte-de-Beaupré shore, the south shore, and west to the Jacques-Cartier side), and the chapter's map frame is wider. On a frame under 100 km across, the checker's 45 km gap-closing swallows the whole box.

## Maps traced
Commons: Seven Years' War in Europe (Carte Guerre de Sept Ans Europe); the 1760–61 winter-quarters map of Saxony (used for the Austrian Dresden pocket); the French and Indian War theatre map; Siege of Quebec 1759. Places were placed from their coordinates, and areas drawn round them as hulls of towns named in the cited articles.

## Uncertainties (approximate dates or shapes, no claims rest on them)
- The start date of the 1757 invasion of Bohemia (keyed 21 Apr) and the Prussian withdrawal (late July).
- The Franco-Imperial camp west of the Saale before Rossbach (26 Oct – 5 Nov).
- The Austrian recapture of Schweidnitz in April 1758: the occupation ends on 18 Apr. The fetched article for this siege failed to load.
- When Glatz was taken (keyed 26 Jul 1760; the main article confirms only that Laudon captured it in 1760). The storming of Schweidnitz on 1 Oct 1761 comes from the title of a Commons map.
- The Imperial army's hold on Freiberg before the battle (keyed from mid-October 1762).
- How far the French held inland forts in the Carnatic (Gingee, Tindivanam, Perumukkal, Chetpet, Tiruvannamalai) in 1758–59. The Wandiwash article says the British captured them after the battle, which implies French control before it. Pondicherry's surrender is dated 15 Jan 1761 (from the siege article; the Wandiwash article says 22 Jan).
- The Russian and Austrian area in the Neumark after Kunersdorf (held to mid-September, then ended on 15 Oct 1759).
- No arrow is drawn for Siraj ud-Daulah's march on Calcutta: the validator allows arrow sides 0 and 1 only, and the Nawab is side 2. The capture still shows (Calcutta returns to the Nawab's colour on 20 June), and a claim tests it.
- A small "British Colonial Empire" shape south of Calcutta stays blue in 1756 after the Company fled to Fulta. It is base data, and a side-2 area cannot be drawn to fix it.

## Warnings left
- Chapter 5 (Lally/Madras): "little visible change". It adds only Fort St David (about 1,100 km²); the siege of Madras is shown by the Black Town area, which appears and disappears inside the chapter. (The earlier chapter 4 warning cleared when the Bohemia correction was added.)
- Side dates: the war file gives the Russian Empire whole years (1757–1762), with no `toDate` for the 5 May 1762 peace. This is in `content/wars/b-modern.json`, not in this storyboard.
