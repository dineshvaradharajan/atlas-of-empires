# Regional fact-check: Islamic world, Iran, Central Asia and steppe (330 BCE onward)

Scope: eras from -323 to 2000 (`overview`, `regions.middle-east-south-asia` (non-South-Asian parts), `regions.north-central-asia`, `powers`, `events`), and the profiles seleucid, parthian, sasanian, fatimid, mamluk, hunnic, umayyad, abbasid, seljuk, ilkhanate, timurid, ottoman, xiongnu, gokturk, golden-horde, chagatai, republic-of-turkey, safavid, qajar-pahlavi-iran, durrani, saudi-arabia, kazakh-khanate, crimean-khanate, bukhara, omani-empire.

Access note: Britannica and Encyclopaedia Iranica (iranicaonline.org) both returned HTTP 403 to automated fetches. The archive.org copy of Bosworth, *The New Islamic Dynasties* (`newislamicdynast0000bosw`) is a restricted lending item, and its text could not be downloaded. Because of that, the corrections below cite English Wikipedia articles, which in turn cite Iranica, the *Cambridge History of Iran* and the specialist literature, plus Taagepera/Turchin via Wikipedia's *List of largest empires*. Ruler lists that I checked against my own knowledge of Bosworth but could not open are marked "not re-verified" rather than cited.

## Proposed corrections (14, in `islamic-iran-central-asia-patch.json`)

- [durrani-empire] rulers[4].reign: "1845–1863" → "1843–1863". Dost Mohammad returned after the British withdrawal. The Wikipedia infobox gives his second reign as April 1843 to 9 June 1863, and the article body says 1842. 1845 is wrong either way. https://en.wikipedia.org/wiki/Dost_Mohammad_Khan
- [omani-empire] rulers[0].reign: "1649–1688" → "1649–1679". Sultan bin Saif I died in 1679 and was succeeded by Bil'arab. https://en.wikipedia.org/wiki/Sultan_bin_Saif
- [qajar-pahlavi-iran] summary: "In 1789 Agha Mohammad Khan … began defeating his rivals, made Tehran his capital and was crowned shah in 1796" → "After Karim Khan's death in 1779 … fought his way to power, made Tehran his capital in 1786, defeated the last Zand prince in 1794 and was crowned shah in 1796". The old sentence put the move to Tehran (12 March 1786) after 1789, and his struggle began in 1779. https://en.wikipedia.org/wiki/Agha_Mohammad_Khan_Qajar
- [fatimid-caliphate] rulers[3].note: "Longest reign of any Muslim ruler" → "Longest reign of any caliph". Al-Mustansir reigned 1036–1094, about 58 solar years. Sultan Hassanal Bolkiah of Brunei has reigned since 5 Oct 1967, so the old claim is no longer true. https://en.wikipedia.org/wiki/Al-Mustansir_Billah ; https://en.wikipedia.org/wiki/Hassanal_Bolkiah
- [parthian-empire] summary: "Arsaces I rebelled against the Seleucids around 247 BCE" → "founded the Arsacid dynasty around 247 BCE and, about 238 BCE, seized Parthia from its rebel Seleucid governor Andragoras". It was Andragoras who rebelled against the Seleucids (c. 245). The Parni under Arsaces invaded c. 238. 247 is the epoch of the Arsacid era. https://en.wikipedia.org/wiki/Arsaces_I_of_Parthia (citing Schippmann, EIr; Bivar, CHI 3; Dąbrowa 2012)
- [sasanian-empire] summary: "Shapur I defeated three Roman emperors and captured Valerian in 260" → "Shapur I defeated Gordian III, forced Philip the Arab to buy peace and captured Valerian in 260". "Defeated three emperors" repeats Shapur's own propaganda. Philip made a treaty and was not beaten in battle. https://en.wikipedia.org/wiki/Shapur_I
- [1600] powers[4].extent (Safavid): "Iran, the southern Caucasus and western Afghanistan" → "Iran and western Afghanistan; Tabriz and the southern Caucasus, ceded to the Ottomans in 1590, are retaken from 1603". Under the Treaty of Constantinople (1590) the Ottomans kept Georgia, Erivan, Karabakh, Shirvan and Azerbaijan with Tabriz until Abbas's war of 1603–1618. https://en.wikipedia.org/wiki/Treaty_of_Constantinople_(1590)
- [1400] regions.middle-east-south-asia: "the Ottomans hold western Anatolia" → "western and central Anatolia". Bayezid I had annexed Karaman (1397), Kadi Burhan al-Din's Sivas lands (1398) and Malatya/Elbistan, so "his domains extended to the Taurus Mountains". https://en.wikipedia.org/wiki/Bayezid_I
- [1400] powers[2].extent: "Western Anatolia and most of the Balkans" → "Western and central Anatolia and most of the Balkans". Same reason and source.
- [fatimid-caliphate] peak.note: added "Taagepera (1997) gives a larger c. 4.1M km² for 969, counting Saharan hinterlands". The profile's 1.8M is close to the map polygon (1.95M). https://en.wikipedia.org/wiki/List_of_largest_empires
- [abbasid-caliphate] peak.note: added Taagepera (1997), c. 11.1M km² in 750. The profile says 10M at 800. I kept the profile figure, since 750 is the moment of inheriting the Umayyad lands before Iberia and the Maghreb broke away.
- [hunnic-empire] peak.note: added c. 4.0M km² in 441 (Taagepera 1979).
- [parthian-empire] peak.note: added Taagepera (1979), c. 2.8M km² around 1 CE. The profile gives the same figure but dates it to 100 BCE.
- [gokturk-khaganate] peak.note: added c. 6.0M km² by 557 (Taagepera 1979). The profile has 580.

Fixed by the general checkers before I could patch (no patch needed):
- [1783] north-central-asia called Xinjiang "the new province". The text now says it was ruled through a military governor at Ili. Xinjiang became a province only in 1884 (https://en.wikipedia.org/wiki/Xinjiang_under_Qing_rule).
- [1400] north-central-asia said the Horde was "divided into the White and Blue Hordes". The text now says "reunited by Tokhtamysh but shattered by Timur". Edigu reunited Jochi's lands after the Vorskla (https://en.wikipedia.org/wiki/Edigu).

## Map border / extent discrepancies (public/data/clio/index.json)

- **Golden Horde**: the clio timeline runs to **1695**, with a 2.27M km² polygon still present in 1677–1686. The Horde ended in 1502 (Great Horde destroyed by Crimea). Whatever polity the dataset labels "Golden Horde" after 1502 (probably Nogai/Kalmyk steppe) is mislabelled.
- **Ilkhanate, Golden Horde, Chagatai Khanate**: the clio timelines all begin in **1294**. Before that the dataset folds them into the Mongol Empire, so the 1279 snapshot shows no separate Ilkhanate (founded 1256), Golden Horde (1242) or Chagatai (1225) polygons, although the text names them.
- **Hunnic Empire**: clio runs to **673**, with tiny 46–185 km² residual polygons from 469 to 673. The Huns ended in 469. The peak polygon (1.9M km² in 451) is about half of Taagepera's 4.0M.
- **Parthian Empire**: clio runs to **237**, with 2.05M km² in 224–237. The Arsacids fell in 224 (Ctesiphon c. 226). **Sasanian Empire** starts in 215 (Papak's Fars, acceptable) and ends in 643, not 651.
- **Ottoman Empire**: clio maximum is 4.26M km² in 1595. Taagepera (1997) gives 5.2M in 1683, which the profile uses. The gap is probably vassals and deserts excluded from the polygon.
- **Xiongnu**: clio maximum is 5.6M km²; Taagepera (1979) gives 9.0M in 176 BCE. **Abbasid**: clio maximum 8.15M in 778 vs Taagepera 11.1M. **Fatimid**: clio maximum 1.95M vs Taagepera 4.1M. **Umayyad**: clio 9.9M vs 11.1M. These are moderate differences in polygon method and are flagged in peak notes.
- **Safavid**: clio peaks at 2.85M km² in 1512–1515, under Ismail I before Chaldiran, when he held Iraq and Diyarbakır. The profile puts the peak in 1630 (2.9M, Oxford-cited). Both are defensible.
- **Umayyad Caliphate**: clio starts in 656 (Mu'awiya's Syria during the First Fitna) and keeps a 445k km² polygon in 755–756 (al-Andalus). These are only labelling artifacts.
- **Mamluk Sultanate**: clio starts in 1241 (Ayyubid Egypt under the Mamluk label). Minor.
- **Saudi State**: clio Emirate of Diriyah peaks at 2.28M km² in 1811, larger than the profile's 1934 peak (2.15M). The First Saudi State at its height did hold most of the peninsula, so this is plausible. The profile might note it.

## Unverifiable / disputed

- **Seleucid end date**: the profile says 63 BCE. Pompey deposed Antiochus XIII in 64 BCE and organised Syria as a province in 64/63. Wikipedia gives 312–63 BCE and the clio data ends in -64. No change made.
- **Mithridates I of Parthia**: "c. 171–132 BCE" mixes two schemes. The older scheme is 171–138; newer numismatic work gives c. 165–132. Kept with "c.".
- **Agha Mohammad Khan's reign "1789–1797"**: this is defensible (he was enthroned in 1789). Some lists begin in 1779 or 1794.
- **Kazakhstan, 1994**: "has given up its Soviet nuclear weapons". The return of the warheads was agreed and under way in 1994 (NPT ratified 14 Feb 1994), but the final transfer is usually dated to 1995. Left as is.
- **Shah Rukh 1405–1447**: he ruled Herat from 1405 and Samarkand only from 1409. Acceptable.
- **Göktürk split "around 582"**: the date is debated (581–603). Acceptable as written.
- **Bosworth ruler lists**: the ruler reigns for the Ilkhans, Timurids, Golden Horde, Chagatayids, Seljuks, Safavids, Qajars, Kazakh and Bukharan khans, Durranis and Saudis all agree with the standard lists as I know them. However, I could not open Bosworth to cite page numbers, so these are not re-verified against the book.

Count: 37 era snapshots (-323 to 2000) checked for this region, plus 25 profiles. 14 corrections proposed (9 factual fixes, 5 Taagepera peak-note additions), plus 12 source additions. 2 further errors had already been fixed by the general checkers.
