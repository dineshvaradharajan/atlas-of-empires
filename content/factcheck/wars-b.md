# War playback, slice b (modern): fact-check and map-link log

File: `content/wars/b-modern.json`. It holds 5 wars and 118 events: Thirty Years' War (25 events), Seven Years' War (23), American Revolutionary War (25), Napoleonic Wars (28) and American Civil War (17).

Britannica refused automated fetches (HTTP 403), so it is not cited. The sources are English Wikipedia articles (cited statements), the US Office of the Historian (history.state.gov), the US National Archives, the National Army Museum (UK) and the American Battlefield Trust. Every cited URL was fetched in this session.

Validation passed: the JSON parses; ids are unique; `moment` ids exist in `content/moments-ce-b.json`; events are in date order; event years fall inside `span`; every member name exists in `public/data/clio/index.json`; no realm sits on two sides in the same year. The only years with no index row are the two deliberate exceptions for Prussia listed below.

## How the app matches members (important for future slices)
`warSideOf` matches a member against the *corrected* feature: `p.n` (realm name after relabel) or `p.k` (group key). A relabel in `content/corrections.json` replaces `n`, and replaces `k` unless the realm already belongs to a "(…)" group. So:
- **Britain**: "Kingdom of Great Britain" is relabelled "United Kingdom" from 1801, so the realm name alone stops matching after 1800. Its group key "(British Empire)" survives the relabel, so all British wars use **"(British Empire)"**.
- **Prussia 1809–1815**: Cliopatria draws Prussia under the names "Confederation of the Rhine" (1809–14) and "German Confederation" (1815–67). Corrections relabel both to "Kingdom of Prussia" (name and key). The member must therefore be **"Kingdom of Prussia"**, because the original names never match after the relabel. That realm has no index rows for 1812 and 1813 (only 1807–08 and 1814+ as slivers), so those two member-years are deliberate exceptions to the "years inside rows" rule. They colour the correct relabelled shape. `tools/content.py` checks only names, so the build accepts them.

## Member choices
**Thirty Years' War**
- Habsburg side: (Habsburg Monarchy) 1618–48; (Spanish Empire) 1619–48 (Spanish troops were at White Mountain and in the Palatinate); Duchy of Bavaria 1619–48 (Treaty of Munich, Oct 1619). Bavaria's 1647 Truce of Ulm lasted only months, so it is not split out. Electorate of Saxony 1620 (John George backed Ferdinand in exchange for Lusatia) and 1636–45 (after the Peace of Prague).
- Anti-Habsburg side: Principality of Transylvania 1619–26 (Bethlen); (Dutch Republic) 1621–47 (the Spanish–Dutch war resumed in 1621 and ended at Münster in Jan 1648); Denmark-Norway 1625–29; Swedish Empire 1630–48; Electorate of Saxony 1631 (Breitenfeld); Brandenburg-Prussia 1631–34; (Kingdom of France) 1635–48.
- Left out because they have no realm: the Bohemian rebel Estates, whose land is drawn inside Habsburg Monarchy, so 1618–20 shows Bohemia in Habsburg colours; the Electoral Palatinate and the Catholic League's other members (inside "Holy Roman Empire Minor States"); and Hesse-Kassel. England's 1625–30 war with Spain was marginal, so England is left out too.

**Seven Years' War**
- Britain's side: (British Empire); "English Colonial Empire" 1756–61 and 1763, a leftover ungrouped realm that draws Madras, which would otherwise stay grey; Kingdom of Prussia; Electorate of Hanover (not in the British group); (Portuguese Empire) 1762–63.
- France's side: (Kingdom of France), whose group includes New France and French India; (Habsburg Monarchy); Russian Empire 1757–62; Swedish Empire 1757–62; (Spanish Empire) 1762–63.
- Third side: Nawabs of Bengal 1756–57, Siraj ud-Daulah's war with the East India Company. It was linked to the Anglo-French war (a French artillery unit served at Plassey) but was not a formal alliance with France, so Bengal gets its own side rather than France's.
- Left out: the Reichsarmee and Brunswick / Hesse-Kassel (inside "Holy Roman Empire Minor States"); the Carnatic Sultanate and Hyderabad (client rulers on both sides); the Haudenosaunee (mostly neutral, partly British-allied from 1759).

**American Revolutionary War**
- United States of America 1776–83; (Kingdom of France) 1778–83; (Spanish Empire) 1779–83 (allied with France, not formally with the US; the text says so); (Dutch Republic) 1780–83.
- (British Empire) 1775–83; Electorate of Hanover 1775–83 (Hanoverian troops defended Gibraltar).
- Left out: the Haudenosaunee, whose nations split (Mohawk, Seneca, Cayuga and Onondaga largely with Britain, Oneida and Tuscarora with the US), so a single colour would mislead; Loyalist militias; Hessian and other German auxiliaries; and the Kingdom of Mysore (the 1780–84 Second Anglo-Mysore War, allied with France, was not verified in this session's sources).

**Napoleonic Wars**
- French side: (French Consulate) 1803–04; (First French Empire) 1805–14; (Batavian Republic) 1803–10; Italian Republic 1803–13; Duchy of Bavaria 1805; (Spanish Empire) 1805–07; the kingdoms of Bavaria, Württemberg and Naples (Napoleonic) and the Grand Duchy of Baden 1806–13; Kingdom of Saxony 1807–13; Denmark-Norway 1807–14; Kingdom of Westphalia and Duchy of Warsaw 1809–13 (their rows start in 1809); Kingdom of Prussia and Austrian Empire 1812, as forced allies in the Russian campaign.
- Coalition side: (British Empire); Russian Empire 1805–07 and 1812–15; (Habsburg Monarchy) 1805; Austrian Empire 1809 and 1813–15; Swedish Empire 1805–09 and 1813–14; Kingdom of Prussia 1806–07 and 1813–15; Kingdom of Saxony 1806 (it fought beside Prussia at Jena before allying with France); (Portuguese Empire) 1807–15; (Spanish Empire) 1808–14 (Patriot Spain); (Netherlands) 1815 (Waterloo lies in the Netherlands shape).
- Hundred Days: France in 1815 is drawn only as "(Bourbon Kingdom of France)", so that member colours France on the French side for 1815. The side panel will therefore read "Bourbon Kingdom of France" for Napoleon's France in 1815; the event texts explain the situation.
- Left uncoloured: Russia 1808–11 (nominally allied with France after Tilsit and at war with Britain and Sweden); Bavaria, Württemberg and Baden after they changed sides in late 1813 (they stay on the French side for 1813); Murat's Naples, which switched in 1814 and fought Austria in 1815; the Ottoman Empire (Russo-Turkish War 1806–12, Anglo-Turkish War 1807–09); Sardinia; the Helvetic Republic.

**American Civil War**
- United States of America vs Confederate States of America, 1861–65. Border states, territories and Indigenous nations allied with either side are not drawn separately.

## Gaps in the map data
- **Prussia vanishes in 1807–08**: its core (Berlin, Königsberg, Eylau, Friedland) is drawn inside "First French Empire", and only a Memel sliver keeps the name. Friedland and Tilsit therefore show Prussian land in French colours.
- **Prussia 1809–15** is drawn under the wrong names "Confederation of the Rhine" and "German Confederation" (fixed by existing relabels; see above). The real Confederation of the Rhine has no shape; its members appear individually.
- **Paris in 1814** falls inside a 102,879 km² "Grand Duchy of Berg" shape that covers northern France (Berg's own rows in other years are 3,000–21,000 km²), so the 31 March and 6 April 1814 events pin a Berg-coloured Paris. This is worth a correction (relabel or crop) in `corrections.json`.
- **Saxony 1700–1762** has no Electorate of Saxony rows. Dresden and Pirna in 1756 are drawn as "Polish-Lithuanian Commonwealth" (personal union), so Prussia's invasion of Saxony colours nothing.
- **Thirteen Colonies 1775**: the colonies are drawn as "British Colonial Empire" and the United States starts only in 1776, so the 1775 events (Lexington, Bunker Hill) show the rebelling colonies in British colours. Charleston (1780) and Yorktown (1781) are also drawn as British (wartime occupation).
- **Gibraltar** is not drawn as British (no shape at the point) for 1779–82.
- **Pondicherry 1761** has no French India shape at the point. French India is otherwise drawn and grouped under (Kingdom of France).
- **Vienna 1805 and 1809, and Moscow, Smolensk and Vilnius 1812**, fall inside "First French Empire" (wartime occupation drawn as annexation; the 1812 case is already noted in corrections).
- **Washington, D.C.** is a hole in the 1861 United States shape (no realm at the point).
- **Italian Republic** keeps that name in 1805–13, when it was the Napoleonic Kingdom of Italy.
- **Lützen and Nördlingen** (1632, 1634) fall inside the Swedish-occupied area drawn as "Swedish Empire" (explained by the existing note on that realm).

## Contested or hedged facts
- Gustavus Adolphus's landing: the main Thirty Years' War article says June 1630, while the Swedish-intervention article says July 1630 (Julian vs Gregorian dating). I used Jul 1630.
- Sack of Magdeburg: Wikipedia's infobox casualty figures conflict with the text's "around 20,000" deaths. I used about 20,000, with about 5,000 survivors from some 25,000 inhabitants.
- Black Hole of Calcutta: death toll described as disputed; no number given.
- Saxony's 1645 truce with Sweden (Kötzschenbroda) was not explicitly confirmed in the fetched excerpts. I set Saxony's imperial membership to end in 1645 and mention the truce only in the Jankau detail.
- Pondicherry: the Battle of Wandiwash article gives 22 Jan 1761 for the surrender, while other sources give mid-January. I used month precision (Jan 1761).
- Seven Years' War deaths: no total is given in the article. The casualty line sums the per-power military figures cited there (about 880,000).
- American Civil War deaths: the American Battlefield Trust gives about 620,000 and the Wikipedia lead gives about 700,000. Stated as a range.
- Napoleonic Wars deaths: cited military figures (1.8 million+ on all sides, over 1 million French and allied). Civilian deaths are hedged as "many hundreds of thousands" (Peninsular War 1,000,000+ military and civilian; the Russian campaign about 1 million military and civilian).
- National Army Museum (Waterloo) says Napoleon was forced to abdicate after the Allies entered Paris on 7 July. Wikipedia (Hundred Days) gives 22 June for the abdication; 22 June is used.
- Battle of the Saintes: 9–12 April 1782; dated to the decisive day, 12 April.
- Month-only dates (no day verified): Aug 1619, May 1622, Mar and Jun 1629, Jul 1630, May 1635 (two events), Oct 1636, Dec 1638, Oct 1642, Mar 1645, May and Jul 1648, Jan 1761, May 1780 (Charleston), Dec 1780, Jul 1806, Aug and Nov 1807.

## Count
5 wars, 118 events, 36 sources (8 + 8 + 5 + 8 + 7), 2 deliberate member-year exceptions (Prussia 1812–13, relabel targets).
