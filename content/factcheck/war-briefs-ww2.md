# War briefs: World War II army sizes

File: `content/war-briefs/world-war-ii.json`. I added `strength` and `strengthWhat` to all three sides and swapped two `sources` entries. Nothing else changed. Validated with `json.load`.

Note on sources: britannica.com, iwm.org.uk and statista.com all returned HTTP 403 to the fetch tool, so none of them is cited. English Wikipedia is used only for figures it cites itself, and only as a cross-check in this log, not in `sources`.

## Figures chosen
The basis for Allies and Axis is "mobilised over the war": every man and woman who served in the armed forces, 1939–45. This matches the World War I brief.

- **Allies (side 0): "c. 80–90 million", mobilised over the war.**
  - Anchor: Military History Matters, citing Thames & Hudson's *World War II: Infographics*, gives 127,171,000 mobilised worldwide, of whom "70% were fighting on the Allied side". That is about 89 million. https://www.military-history.org/behind-the-image/behind-the-image-number-of-people-mobilised-in-world-war-ii.htm
  - Cross-check by summing the main members:
    - USSR 34,401,807 (Wikipedia, Red Army, cited).
    - USA 16.4 million (National WWII Museum, https://www.nationalww2museum.org/war/wwii-veteran-statistics).
    - China c. 14 million conscripted into the Nationalist army (Wikipedia, National Revolutionary Army, cited note 45).
    - Britain 5,896,000 (Military History Matters), plus the Indian Army's 2.5 million by 1945 (Wikipedia, Allies of WWII, cited), plus the Dominions and colonies.
    - The total also includes France (1939–40), Poland, Yugoslavia, the Free French and others.
  - USSR + USA + China alone come to c. 65 million. Adding the British Empire (c. 12–15 million on the mainstream estimate) and the smaller Allies gives c. 80–90 million. The lower bound of the range allows for the soft British Empire figure and the uncertain French and Polish ones.
- **Axis (side 1): "c. 35–40 million", mobilised over the war.**
  - Anchor: the other c. 30% of 127.2 million is c. 38 million (same source).
  - Cross-check by summing the main members:
    - Germany c. 18.2 million served in the Wehrmacht, 1935–45 (Wikipedia, Wehrmacht, citing Overmans 2004, Müller 2016 and Wette 2006).
    - Japan c. 9 million. This is the mainstream estimate. Wikipedia's Imperial Japanese Army article gives only the army's peak of 6,095,000 in August 1945, so I could not verify a total that includes the navy from a fetched page.
    - Italy c. 4 million. The Royal Italian Army numbered 3,500,000 in 1943 (Wikipedia, citing Cloutier, *Regio Esercito*, p. 211).
    - Romania, Hungary, Finland, Bulgaria, Croatia and Thailand add about 3–4 million.
  - The sum is c. 34–36 million, which fits the c. 38 million anchor.
- **Vichy France (side 2): "c. 100,000", Armistice Army, 1940–42.** This side can't be counted on the "mobilised over the war" basis, because the armistice of June 1940 capped its forces. The figure is the Armistice Army that Vichy kept until Germany dissolved it in November 1942. The source is a University of Sydney review of Paxton's *Vichy France: Old Guard and New Order*: "it maintained an Armistice Army of 100,000, unique in conquered Europe" (https://theory-practice.sydney.edu.au/?p=4496). Wikipedia (Armistice Army, Vichy France) gives the metropolitan establishment as 3,768 officers, 15,072 NCOs and 75,360 men, about 94,000, but that figure is tagged "citation needed". It also gives the dissolution as 26/27 November 1942.

## Disputed or hedged
- Published national totals differ. For the USA, sources give 16.1–16.4 million. The National WWII Museum's research-starter page lists 6,332,000 volunteers and 11,535,000 draftees, which add up to 17.9 million and are inconsistent with its own percentages. For Germany, sources give 17.9–18.2 million; 24/7 Wall St, quoting Statista, gives about 18.1 million. Hence the round side ranges.
- Some figures count all conscripts, others only those who served at some point. The Soviet 34.4 million includes 4.8 million already serving in June 1941.
- No fetched page gave a sourced total for the whole British Empire and Commonwealth. The 12–15 million used in the cross-check is the mainstream range, not a verified figure. Wikipedia's "Military production during WWII" page has per-country personnel tables (British Empire, Japan 8.1 million, Italy 4.3 million), but they carry no visible citations, so I did not rely on them.
- Vichy: Wikipedia, citing Abzac-Epezy (2012), says the Armistice Army "reached 550,000 men" in early 1942. That figure appears to include the Army of Africa and the colonial garrisons (Army of Africa c. 100,000–127,000, Levant c. 40,000, West Africa c. 33,000). I chose the 100,000 in France, which is the figure scholars usually quote, and labelled it "Armistice Army, 1940–42". It is not comparable with the two war-long totals.
- Japan and China figures are soft. The Chinese 14 million counts Nationalist conscripts only, not Communist forces.

## Sources changed
- Added: Military History Matters (side totals), University of Sydney review of Paxton (Vichy).
- Removed, to stay within the 6-source cap: "Battle of France (Wikipedia)" and "Vichy France (Wikipedia)". The Ardennes, Sedan and Channel strategy is still covered by "World War II (Wikipedia)", and the Vichy collaboration line is covered by the Paxton review.

## Possible issues in `content/wars` / `content/cinema` (not edited)
- None checked for this task. The task covered army sizes only.
