# War briefs, slice C

Files: `content/war-briefs/{napoleonic-wars,war-of-1812,texas-revolution,mexican-american-war,taiping-rebellion,american-civil-war}.json`.
Britannica returned HTTP 403 to the fetch tool for every page tried, so it is not cited. Sources below were all fetched.

## Figures chosen
- **napoleonic-wars**: French forces c. 1.2 million at peak (1813) vs Coalition c. 3 million at peak (1813); Grande Armée of 1812 over 450,000, c. 120,000 left; Peace of Paris 20 Nov 1815; Waterloo 18 June 1815. Sources: Wikipedia Napoleonic Wars infobox, French invasion of Russia, Trachenberg Plan, Continental System; NAM Battle of Waterloo (peace until 1914 bar Crimea).
- **war-of-1812**: US c. 7,000 regulars at start vs British c. 5,200 regulars at start (Wikipedia infobox); Detroit, 15–16 Aug 1812, 2,188 Americans captured (Wikipedia Siege of Detroit); Ghent signed 24 Dec 1814 (history.state.gov), ratified 17 Feb 1815 (Wikipedia); Creek cession c. 23 million acres, 9 Aug 1814 (battlefields.org); lakes strategy (nps.gov).
- **texas-revolution**: Texian c. 2,000 vs Mexican c. 6,500 (Wikipedia infobox); San Jacinto c. 900 Texians, 630 Mexicans killed, 730 captured, 9 Texians killed; c. 350 shot at Goliad; Houston's retreat (TSHA Handbook of Texas).
- **mexican-american-war**: US c. 79,000 (78,718) vs Mexico c. 82,000 (Wikipedia infobox, citing Clodfelter 2017); 7 of 19 Mexican states contributed; four presidents in 1846 (Wikipedia); 55% of territory, c. 525,000 sq mi, $15 million, treaty 2 Feb 1848 (history.state.gov); flying artillery at Palo Alto (battlefields.org); Veracruz landing 9 Mar 1847, no losses, 20-day siege (Wikipedia Siege of Veracruz).
- **taiping-rebellion**: Qing c. 860,000 regulars, 1851 (Banners 250,000 + Green Standard 611,200) vs Taiping c. 500,000 in 1852 (Wikipedia infobox); Northern Expedition 70,000–80,000, destroyed by 1855; Anqing taken 5 Sept 1861; Ever Victorious Army c. 5,000; Nanjing fell 19 July 1864, Hong died 1 June 1864; deaths 20–30 million+ (Wikipedia; Columbia Asia for Educators, which also gives the "not recovered by the 1950s" point).
- **american-civil-war**: Union c. 2.2 million vs Confederacy c. 750,000–1 million served (Wikipedia infobox); blockade cut cotton exports c. 95% (Wikipedia Anaconda Plan); almost 200,000 Black soldiers and sailors (National Archives); Sherman 62,000 men, c. 300 miles (Wikipedia); deaths 620,000–750,000+, two-thirds from disease (battlefields.org Civil War Facts); 13th Amendment ratified 6 Dec 1865 (National Archives), c. 4 million freed (Wikipedia).

## Disputed or hedged
- Napoleonic strengths: both "at peak" (1813), but the French figure counts France alone (allies excluded) while the Coalition figure is all members combined; the infobox gives no matching French-and-allies peak. Hedged with "c.".
- War of 1812: regulars-at-start is the only like-for-like basis; it excludes c. 458,000 US militia enrolments and 10,000–15,000 Indigenous allies. Winner set to `null` (Treaty restored the status quo; history.state.gov says neither side had a clear advantage).
- Texas Revolution: the infobox's c. 2,000 / c. 6,500 do not state their basis; TSHA gives Santa Anna 6,000 to over 8,000. Labelled "in arms, 1835–36" with "c.".
- Mexican–American War: Clodfelter's totals do not say what they count; labelled "in arms over the war".
- Taiping: no like-for-like figure exists. The Qing figure is the paper strength of the old regular armies; the Taiping figure (1852) is the infobox's and may be high for that year. Both hedged with "c."; the regional armies that actually won (Xiang c. 130,000, Huai 60,000–70,000) are described in the strategy text instead.
- American Civil War: the brief's example used 2.1 million; Wikipedia gives 2.2 million and NPS counts 2,672,341 enlistments (re-enlistments counted twice), so "c. 2.2 million" is used. NPS gives Confederate enlistment as 750,000–1,227,890; the common 750,000–1 million range is kept. Deaths: 620,000 (Fox and Livermore) to 750,000+ (newer studies; battlefields.org says up to 850,000), hedged with "or more".
- Not used: "more than any other American war" (no fetched source said it), "federal government emerged stronger" (no fetched source said it).

## Possible errors noticed in content/wars and content/cinema (not edited)
- `american-civil-war` (b-modern.json) casualties says "620,000 to 700,000 or more"; newer estimates run to c. 750,000–850,000. Within the hedge, so not wrong.
- No other errors found in the six wars' sides, summaries or cinema chapter ids.
