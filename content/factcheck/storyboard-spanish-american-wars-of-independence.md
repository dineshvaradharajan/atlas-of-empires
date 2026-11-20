# Storyboard: Spanish American Wars of Independence (South America), 1810–1826

File: `content/cinema/spanish-american-wars-of-independence.json` (19 April 1810 – 23 January 1826).
Checks: `validate.py` no errors; `check_history.py spanish-american-wars-of-independence` 0 errors, 11 warnings (all
under 1,000 km², explained below), all 91 claims green. Counts: 12 chapters, 91 claims, 29 held areas with 117
keyframes, 41 arrows, 23 battles, no fronts. Built by a scratch script (areas partly cut from the realm outlines
themselves); the JSON is the source of truth.

## Chapters and why
Centred on Bolívar's war in the north, with San Martín's southern campaign as the second front.
1. **The juntas of 1810 and the First Republic** (19 Apr 1810 – 1 Aug 1812): Caracas junta, independence (5 Jul 1811),
   loyal Coro/Maracaibo/Guayana, Monteverde's march from Coro, the earthquake, Valencia (3 May), Puerto Cabello lost
   (30 Jun), capitulation of San Mateo (25 Jul), Caracas entered (1 Aug).
2. **From Cartagena to Caracas: the Admirable Campaign** (15 Dec 1812 – 7 Aug 1813): Cartagena Manifesto, Magdalena
   campaign, Cúcuta (28 Feb), Mariño in the east, war to the death (Trujillo, 15 Jun), Caracas (6 Aug).
3. **War to the death: the fall of the Second Republic** (7 Aug 1813 – 12 Dec 1814): Boves's llaneros, Araure,
   La Victoria, San Mateo, first Carabobo, La Puerta (15 Jun 1814), Caracas lost (16 Jul), Urica, Maturín.
4. **Chile lost and won: Rancagua to Maipú** (1 Oct 1814 – 6 Apr 1818): Rancagua, the Army of the Andes at Mendoza,
   the two-column crossing (Los Patos, Uspallata), Chacabuco, Santiago, Cancha Rayada, Maipú. Overlaps chapters 5–6
   in time (a separate theatre), as the Paraguayan War's Uruguay River chapter does.
5. **Morillo's reconquest and the Jamaica Letter** (3 Apr 1815 – 31 Jul 1816): Morillo's landing, Santa Marta, the
   105-day siege of Cartagena, Calzada from the Venezuelan plains, Cachirí, Bogotá (6 May 1816). The Jamaica Letter
   (Kingston) is an event; it is outside the chapter's frame, so it has no claim.
6. **Angostura and the plains** (1 Jan 1817 – 3 Apr 1819): San Félix, Angostura (17 Jul 1817), Margarita, Páez on
   the Apure, the failed march on Caracas (1818), the Congress of Angostura, Las Queseras del Medio.
7. **Over the Andes to Boyacá** (26 May – 11 Aug 1819): flooded plains, Tame (11 Jun), the Páramo de Pisba (6 Jul),
   Vargas Swamp, Tunja, Boyacá, Bogotá (10 Aug).
8. **Gran Colombia and Carabobo** (17 Dec 1819 – 16 Jul 1821): Fundamental Law at Angostura, the 1820 truce,
   Maracaibo (28 Jan 1821), Carabobo (24 Jun), Caracas (29 Jun), Puerto Cabello holding out.
9. **San Martín lands in Peru** (20 Aug 1820 – 22 Sep 1821): Paracas/Pisco, Arenales's highland march, Trujillo,
   Lima, independence (28 Jul 1821), Callao (surrendered, occupied 21 Sep).
10. **Pichincha and the Guayaquil meeting** (9 Oct 1820 – 28 Jul 1822): Guayaquil, Sucre's march by Cuenca,
    Bomboná, Pichincha (24 May 1822), Pasto (6 Jun), the Guayaquil meeting (26–27 Jul).
11. **Junín and Ayacucho** (17 Jun 1823 – 10 Dec 1824): Lima lost twice (Jun 1823, Feb 1824 after the Callao mutiny),
    Bolívar's march from Trujillo, Junín, the royalist retreat, Lima retaken (5 Dec), Ayacucho (9 Dec).
12. **Bolivia and the last stronghold** (10 Dec 1824 – 23 Jan 1826): Sucre into Upper Peru (25 Feb 1825), Tumusla,
    Chuquisaca, Bolivia (6 Aug 1825), the siege of Callao to its surrender.
No camera `shots`: like the other American wars, each chapter's `bbox` frames it.

## How the map is drawn
The yearly border data is patchy for these years, so five base years are used (`baseYears`) and held areas correct
each one:
- **1811 borders, 1810–1814.** 1810 has no patriot state at all and 1812–13 has no Venezuelan republic; 1811 draws
  the Republic of Venezuela, New Granada (Cartagena and the interior) and the Río de la Plata. Areas: royal
  government in New Granada (to the Bogotá junta, 20 Jul 1810) and in the Río de la Plata (to 25 May 1810); royalist
  Paraguay (to 15 May 1811, after which Paraguay is neutral grey); royalist Montevideo (the Banda Oriental, then the
  besieged city to the end of June 1814); Cundinamarca (Bogotá is a royalist gap in the 1811 data); patriot Chile
  (Patria Vieja, to Rancagua); royalist Guayana; one area for Monteverde's advance and its retreat before the
  Admirable Campaign (shrinking at last to besieged Puerto Cabello); one for Boves's llaneros (1813–14); Bolívar's
  Magdalena and Cúcuta area (kept to Cachirí, Feb 1816, since the 1815 data also leaves the Magdalena royalist).
- **1815 borders, 1815 – 9 Aug 1819.** Venezuela and Chile royalist, New Granada patriot. Areas: Morillo's
  reconquest of New Granada (Cartagena besieged with a notch round the city until 6 Dec 1815; Casanare left patriot
  from May 1816, where refugees gathered under Santander); republican Margarita (from 1816); Páez's Apure plains;
  patriot Guayana growing into the Orinoco and plains area; patriot Chile (Patria Nueva) from 8 Feb 1817. The 1818–19
  data leaves Chile blank, so 1815 borders are kept.
- **1820 borders, 10 Aug 1819 – 1821.** New Granada (after Boyacá) and Chile patriot; Venezuela, Quito, Peru,
  Panama royalist. Areas: royalist Caribbean coast of New Granada, royalist Pasto, royalist Valdivia (to 4 Feb 1820),
  Guayaquil, San Martín's beachhead at Pisco, patriot Peru (Huacho, then the Trujillo intendancy, then Lima with
  Callao notched out until 21 Sep 1821), Maracaibo, patriot Venezuela after Carabobo (Puerto Cabello and, until the
  end of 1821, Cumaná notched out).
- **1823 borders, 1822 – 5 Aug 1825.** Gran Colombia and the Republic of Peru are drawn whole; Upper Peru and a small
  Lima–Callao block are Spanish. Areas: royalist Quito (shrinking with Sucre's advance) and Pasto; royalist Peru
  (highlands and south, reaching Lima in Jun–Jul 1823 and from 25 Feb 1824, pulling back after Junín, gone after
  Ayacucho); patriot Lima over the Spanish block (with only Callao patriot during Canterac's 1823 raid, and Callao
  excluded after the mutiny of 5 Feb 1824); royalist Puerto Cabello (to Oct 1823); Sucre's advance into Upper Peru,
  cut from the Spanish Upper Peru outline itself.
- **1825 borders, 6 Aug 1825 – end.** Bolivia drawn; a Spanish pocket at La Paz and the Lima–Callao block remain in
  the data, covered by patriot areas (Callao joins on 23 Jan 1826).
- Side members end on 1 Feb 1826 rather than 23 Jan so the last frame keeps its colours (membership ends
  exclusively; the playback clock runs about a week past the end).

## Map data gaps (not patched; for the border data maintainers)
- 1810: Spanish Empire everywhere; no patriot polity. 1812–13: no Republic of Venezuela; a "Guayaquil Junta" is
  drawn over Quito (the real State of Quito ended in Nov–Dec 1812). 1814: Republic of Venezuela and Cundinamarca
  return. 1811–14: Bogotá is a Spanish gap inside New Granada.
- 1815–19: New Granada is drawn patriot throughout, though Morillo held it from 1816 to 1819. Popayán and Pasto are
  Spanish in 1815–19 (Popayán was republican until June 1816).
- 1818–19: Chile is left blank (cropped by a correction from 1818) instead of being drawn as the Republic of Chile.
- 1820–21: New Granada includes Pasto (royalist until June 1822) and the whole Caribbean coast; Venezuela is wholly
  Spanish, including the patriot Orinoco and plains.
- 1822–25: the Republic of Peru covers the royalist highlands and south; a Spanish block at Lima–Callao and (1825) at
  La Paz; the land round Puno and Lake Titicaca is unrecorded.
- Upper Peru is not drawn in 1824 (hidden by the Gran Colombia correction) and Bolivia only from 1825.
- Chiloé stays Spanish to the end of the war; it in fact surrendered in January 1826, like Callao (Peruvian War of
  Independence article). No area was added because no fetched source gives the day.

## Uncertainties and judgment calls
- **Not drawn:** the Quito junta (1810–12), the Río de la Plata's Upper Peru campaigns (Castelli 1810–11, Belgrano
  1813, Rondeau 1815), Concepción's royalist turn in 1813, Morales's reoccupation of Coro and Maracaibo (1822–23),
  the Pasto risings after 1822 and the Mapuche frontier war. They lie outside the story's chapters.
- **Dates that sources disagree on:** Paracas landing 7 Sep (San Martín article) or 8 Sep 1820 (Liberating
  Expedition; used); Ocaña taken 10 Jan (Magdalena campaign) or 28 Jan 1813 (Admirable Campaign; the claim is dated
  1 Feb); Valencia entered 3 May 1812 (Military career; used) or "by mid-July" (First Republic article); Lima entered
  "two days after" 25 Jun 1821 (Peruvian War article) or around 12 Jul (San Martín article; the area adds Lima on
  12 Jul and the claim is dated 28 Jul); Puerto Cabello's surrender October (Venezuelan War article; used) or
  November 1823; Cancha Rayada 18 Mar (Chilean War article) or 19 Mar 1818 (battle article; used); the Jamaica
  Letter is dated September 1815 (completed 6 or 7 September; only the month is given).
- **Approximate timings (no fetched source gives the day):** the army's move from Pisco to Huacho (drawn 26 Oct –
  10 Nov 1820); Sucre's taking of Cuenca (drawn by 25 Feb 1822); Osorio's march north from Concepción (drawn from
  20 Feb 1818); the patriot retreat from the Calabozo salient after La Puerta (drawn by 15 May 1818); the Caribbean
  coast of New Granada is held royalist until Cartagena's surrender (drawn 10 Oct 1821), although Santa Marta fell
  earlier; the 1824 royalist line in the highlands after Junín.
- **Shapes:** the llanos, Orinoco and Peruvian highland areas are broad sketches of who controlled the country,
  not of garrisons. Where an area is cut from a realm outline, the app's even resampling of rings (192 points)
  shaves corners, so thin slivers along the Brazil border of Upper Peru and near Trinidad may take a side's tint.
- **Battle casualties** are infobox figures turned into ranges; disputed ones (San Mateo, Urica, Vargas Swamp,
  Bomboná) are hedged. Bomboná and Tumusla have no reliable figures; their `casNum` values (1,000 and 50) are only
  marker sizes, and the text says so in words.

## Warnings left (all under 1,000 km²)
- Chapter 2, 10 Apr 1813: two 987 km² cells where the Cúcuta area meets the New Granada and Venezuela outlines
  (the realm edges are coarse; the ground was contested).
- Chapter 3, 9 Apr 1814: 601 km² of the republic between Boves's plains area and royalist Guayana.
- Chapter 6, 17 Feb 1818: 673 km² of Spanish ground at Guasdualito between the Apure area and Casanare.
- Chapter 8, 15 Jul 1821: 601 km² at the New Granada–Venezuela border near Cúcuta.
- Chapter 10, 3 Sep 1821: 694 km² of royalist Peru at Tumbes between Guayaquil and the New Granada outline (which
  reaches 3.4° S in the data), and 925 km² of patriot New Granada east of the Pasto area.
- Chapter 12, 1 Jul 1825: four 608 km² cells at the edges of the Upper Peru outline (one is Brazilian border ground).

## Sources fetched
Wikipedia (English): Spanish American wars of independence; Venezuelan War of Independence; First and Second
Republic of Venezuela; Venezuelan Declaration of Independence; 1812 Caracas earthquake; Military career of Simón
Bolívar; Simón Bolívar; Cartagena Manifesto; Magdalena campaign; Admirable Campaign; Decree of War to the Death;
Battle of Cúcuta; Battle of Araure; Battle of La Victoria (1814); Battle of San Mateo (1814); Battle of Carabobo
(1814); Second Battle of La Puerta; Battle of Urica; José Tomás Boves; Jamaica Letter; Spanish reconquest of New
Granada; Siege of Cartagena (1815); Second Battle of Angostura; Battle of San Félix; Battle of Matasiete; Congress
of Angostura; Battle of Las Queseras del Medio; Battle of Vargas Swamp; Battle of Boyacá; Gran Colombia; Battle of
Carabobo; Battle of Lake Maracaibo; Crossing of the Andes; Army of the Andes; Chilean War of Independence; Battle
of Rancagua; Battle of Chacabuco; Battle of Cancha Rayada (1818); Battle of Maipú; Capture of Valdivia; Liberating
Expedition of Peru; Peruvian War of Independence; José de San Martín; First and Second siege of Callao; Free
Province of Guayaquil; Battle of Pichincha; Pasto Campaign; Guayaquil Conference; Battle of Junín; Battle of
Ayacucho; Bolivian War of Independence; Antonio José de Sucre; Battle of Tumusla; Siege of Montevideo (1812–1814);
May Revolution; Argentine War of Independence. Wikipedia (Spanish): Independencia de Trujillo; Expedición
Libertadora del Perú.
