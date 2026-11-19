# War briefs, slice B

Files written: `content/war-briefs/` wars-of-the-roses, conquest-of-the-aztec-empire, imjin-war, thirty-years-war,
seven-years-war, american-revolutionary-war (`.json`). All valid JSON. Side order matches `content/wars`. Every strategy
`chapter` is a real chapter id in the war's cinema file.

Access note: Britannica, World History Encyclopedia, Historic England, PBS, the Library of Congress (loc.gov) and Asia Society
all returned HTTP 403 to automated fetches, so none of them is cited. I used pages that did load: institutional pages
where possible, and otherwise English Wikipedia, only for statements it cites itself. I read the wikitext to check the citations.

## Figures chosen, by war
- **wars-of-the-roses**: strength at Bosworth 1485. Tudor 5,000–8,000 and Richard III 7,500–12,000 (Wikipedia, Battle of Bosworth Field, citing Ross 1999 and Mackie 1983). The Bosworth Battlefield Heritage Centre says only that Richard's army was "much larger". Royal income rising from £52,000 to £142,000 and the marriage uniting the houses: royal.uk, Henry VII. Stoke Field as the true end: Nottinghamshire HER. Towton archery: Wikipedia, Battle of Towton (Ross 1997, Gravett 2003).
- **conquest-of-the-aztec-empire**: 50,000–200,000 at the siege of 1521, of whom about 900–1,300 were Spaniards (Wikipedia, Fall of Tenochtitlan, citing Hassig). The 1520 smallpox epidemic killed 5–8 million, and the population did not recover until the 20th century: Acuña-Soto et al., *Emerging Infectious Diseases* (CDC). The 13 brigantines, the cut aqueduct and Mexico City built on the ruins: Wikipedia, Spanish conquest of the Aztec Empire.
- **imjin-war**: forces in the first campaign. Japan c. 158,000: 158,800 including labourers and sailors (Perrin 1979, Hawley 2005). Joseon c. 84,500 regulars, plus about 22,000 volunteers (Turnbull 2002, p. 109). Ming relief army c. 43,000 (Turnbull 2008, p. 58). Consequences (Ming finances, the Toyotomi decline and the Tokugawa rise, Korea's devastation): Wikipedia (Spence, Turnbull, Swope) and the UT Austin HIST 341K page.
- **thirty-years-war**: strength of each side's main army at its peak. Imperial army 110,000 (Wilson 2009, p. 395); Swedish army 100,000–140,000 (Wilson 2009, p. 484; Clodfelter). Population loss of a quarter to a third, princely sovereignty, recognition of Calvinism, and Dutch and Swiss independence: Library of Congress Country Studies, Germany (countrystudies.us). Wallenstein's methods, the Bärwalde subsidies and Breitenfeld tactics: Wikipedia (Wedgwood, O'Connell, Parker).
- **seven-years-war**: "served over the war", based on Peter Wilson's manpower totals (*Oxford Handbook of the Seven Years' War*, 2024, pp. 61–62), which count armies and navies at the start of the war plus recruits. **I summed them myself.** Britain 384,000 + Prussia 518,000 + Portugal 22,000 ≈ 925,000. France 540,000 + Austria 450,000 + Russia 536,000 + Spain 69,000 + Sweden 85,000 ≈ 1.7 million. Pitt's strategy and subsidies: Wikipedia and history.state.gov. Leuthen: Wikipedia. Plassey, with 3,100 Company troops and the bribing of Mir Jafar: Wikipedia, Battle of Plassey. Treaty terms and Louisiana going to Spain: history.state.gov and Wikipedia, Treaty of Paris (1763).
- **american-revolutionary-war**: strength at Yorktown 1781. Allied c. 19,900 (American and French together) against British c. 9,000 (American Battlefield Trust, Yorktown). French alliance and Spain's entry: history.state.gov. Treaty of 1783: history.state.gov. Boundaries, Spanish gains and Loyalist evacuations: Wikipedia.

## Disputed or unpinned figures, and how I hedged them
- Wars of the Roses: Bosworth estimates run from about 6,000 to 15,000 for Richard's army, so I gave ranges. The Stanleys' 4,000–6,000 men are left out of both sides. No credible figure exists for the war as a whole.
- Aztec side: I left `strength` out. The often-quoted 80,000 defenders and 200,000 Mexica rest on a PBS page I could not fetch and on uncited infobox figures. The allied 50,000–200,000 is itself a wide range.
- Seven Years' War, Nawab of Bengal: I left `strength` out, because the only credible figure (c. 50,000 at Plassey) has a different basis from the other two sides.
- Seven Years' War: the side totals are my own sums of Wilson's national figures, rounded and marked "c.". They exclude colonial troops and militia.
- Imjin War: `winner` is set to 1 (Joseon), but the result was a joint Joseon–Ming victory (Swope, Hawley). Korean deaths are hedged as "perhaps a million", because the source for that figure is weak.
- Thirty Years' War: `winner` is 1 and the result reads "Peace of Westphalia; Habsburgs checked". Historians describe a negotiated peace that favoured France and Sweden, not an outright victory.
- American Revolutionary War: I used Yorktown as the basis because the British infobox figure (48,000 average in North America) has no inline citation. The American totals of 200,000–250,000 who served have no comparable British figure.

## Possible issues in content/wars and content/cinema (not edited)
- `wars` imjin-war summary says "about 158,000 Japanese troops landed". The 158,800 figure includes labourers and sailors, so "men" would be more accurate than "troops".
- `wars` american-revolutionary-war casualties say "British military deaths are estimated at about 43,600". That number (43,633 in Burke 1785) counts rank-and-file deaths across all British forces worldwide, not just in America.
- `cinema` imjin-war, ming-relief: "about 40,000 under Li Rusong". Turnbull gives 43,000 Chinese, and the Wikipedia infobox gives 48,000. This is within normal hedging, but the figure is on the low side.
