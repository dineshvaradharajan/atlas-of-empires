# War playback log, slice c: the world wars (content/wars/c-worldwars.json)

Two wars, 30 events each, chronological, linked to moments `world-war-i` and `world-war-ii`
(content/moments-ce-b.json). Validated: the JSON parses, ids are unique, events are in date order, each `year` matches its date and falls inside `span`,
`text` is at most 90 characters, `detail` is 60–110 words, summaries are 162 and 170 words, and every member name exists in
public/data/clio/index.json with **every** year from `from` to `to` inside one of its `tl` rows (stricter than
checking the endpoints only). No realm is on two sides in the same year.

## Sources
Every cited URL was fetched while writing. Britannica refuses automated fetches (see moments-ce-b.md), so it is not used.
Cited in the JSON:
- WWI: Wikipedia World War I, Timeline of World War I, Allies of World War I, World War I casualties, Treaty of
  Brest-Litovsk, Armenian genocide, Arab Revolt.
- WWII: Wikipedia World War II, Axis powers, Allies of World War II, Pacific War, Operation Torch, Soviet–Japanese War,
  Atomic bombings of Hiroshima and Nagasaki; USHMM Holocaust Encyclopedia (Wannsee Conference).
Fetched to check single events, but not cited (the format allows at most 8 sources): RMS Lusitania (1,197 dead, 128 Americans),
Battle of Stalingrad (Uranus 19 Nov 1942; surrender 2 Feb 1943; c. 235,000 Axis captured), Battle of Midway (4–7 June 1942;
four carriers), Battle of Singapore (15 Feb 1942; c. 80,000 POWs), Guadalcanal campaign (7 Aug 1942 – 9 Feb 1943),
Battle of Okinawa (1 Apr – 22 Jun 1945; casualty figures), Operation Weserübung (9 Apr 1940), Battle of Britain
(10 Jul – 31 Oct 1940), Armistice of Cassibile (signed 3 Sep, announced 8 Sep 1943), Battle of Leyte Gulf (23–26 Oct 1944),
Operation Bagration (22 Jun 1944; Minsk 4 Jul; c. 450,000 German casualties), Normandy landings (156,115 troops; c. 5,000
ships), Armistice of 22 June 1940, Attack on Pearl Harbor (2,403 killed; declarations of 8 and 11 Dec), German Instrument
of Surrender (Reims 7 May; Karlshorst, effective 23:01 on 8 May).

## Member choices
### First World War
- Allies: "(British Empire)" (Kingdom of Great Britain shows as "United Kingdom" through the relabel in corrections.json, plus the Raj and the
  colonies), "(French Third Republic)" (metropole, French Africa, Indochina), "Commonwealth of Australia" (not in the
  British group), Belgium + Belgian Congo, Japan (declared war 23 Aug 1914), Montenegro (9 Aug 1914),
  "Kingdom of Italy" + "Italian Africa" from 1915, "Portuguese Republic" from 1916 (Germany declared war 9 Mar 1916;
  the realm includes Angola and Mozambique), Romania as "United Principalities of Moldavia and Wallachia" for 1916,
  "Kingdom of Hejaz" from 1916 (Arab Revolt, 10 Jun 1916), USA, Greece ("First Hellenic Republic", declared war 30 Jun 1917),
  Siam ("Rattanakosin Kingdom", 22 Jul 1917), China (see gaps), Brazil (26 Oct 1917), Liberia (1917).
- Russia: "Russian Empire" 1914–1916, "Russian Republic" 1917 only. Russia leaves the Allied colours from 1918: armistice on
  15 Dec 1917, Treaty of Brest-Litovsk on 3 Mar 1918.
- Central Powers: "German Empire" + "German Africa" 1914–1918, "Austria-Hungary", "Ottoman Empire" 1914–1918 (raid of 29 Oct
  1914; Russia declared war 1 Nov), "Principality of Bulgaria" from 1915 (declared war on Serbia 14 Oct 1915).
- Left out: Cuba, Panama, Guatemala and other minor declarers; Persia (neutral, though it was fought over).
### Second World War
- Three sides: Allies, Axis, and **Vichy France** as a separate side. Vichy was officially neutral and collaborated with Germany, but it was never a
  Tripartite Pact member, so putting it under "Axis" would be inaccurate.
- Allies: Poland 1939; "(British Empire)"; Australia, Canada and South Africa (separate realms, outside the British group);
  "(French Third Republic)" 1939, "Free French" 1940–44, "French Africa" 1943–44 (French North and West Africa joined the Allies after
  Torch), "(French Fourth Republic)" 1945; Norway 1940–45; "(Netherlands)" 1940–42 and 1945; Belgian Congo 1940–45 and
  Belgium 1945; Greece 1940 and 1945; "Yugoslav Partisans" 1944, "Yugoslavia" 1945; USSR and USA from 1941;
  "Republic of China" and "Communist Party of China" 1939–45 (both fought Japan; China at war with Japan since 1937);
  Mexico and Brazil 1942–45; Ethiopia 1942–45; "Kingdom of Italy" 1944–45 as co-belligerent; Mongolia 1945
  (declared war on Japan 10 Aug 1945); "French Mandate for Syria and Lebanon" from 1941 (taken by British and Free French forces
  in June–July 1941; year granularity colours it Allied for all of 1941).
- Axis: "Nazi Germany" 1939–44, "Empire of Japan" 1939–45, "Kingdom of Italy" + "Italian Africa" 1940–43,
  "Hungarian Republic" 1941–43, "Kingdom of Romania" and "Principality of Bulgaria" 1941–44 (both changed sides in Aug/Sep 1944;
  kept as Axis for all of 1944 so they are not double-coloured), "Independent State of Croatia" 1941–44,
  "Republic of Finland" 1941–44 (officially a co-belligerent in the Continuation War, not a pact member; noted here,
  not in the text), "Kingdom of Thailand" 1942–45 (declared war 25 Jan 1942).
- Vichy side: "(Vichy France)" 1940–42 (metropole, French Africa, Indochina), "French Mandate for Syria and Lebanon" 1940,
  "Vichy France" 1943, "French Indochina" 1943–44 (under Vichy administration with Japanese forces present until March 1945).
- Left out: Denmark (occupied, not formally a belligerent), New Zealand (no realm before 1948), Luxembourg, the Baltic states,
  Iraq, Iran and the late symbolic declarations of 1945 (Turkey, Egypt, Saudi Arabia, Lebanon).

## Gaps in the map data
- **Nazi Germany has no 1945 row.** Germany is uncoloured for the 1945 events (Okinawa, the surrender on 8 May), and no
  "Allied-occupied Germany" realm exists.
- **France, Jan–Jun 1940**: "(French Third Republic)" ends in 1939, and in 1940 the map already shows "(Vichy France)" and "Free
  French". France's part in the May–June 1940 campaign is shown only in the event text.
- **French Africa keyed to "(Vichy France)" in 1943–44**, although French North and West Africa sided with the Allies from Nov 1942. I list "French Africa"
  by name on the Allied side for 1943–44. If the renderer colours by group key and not by realm name, it may still show as Vichy.
  "(Vichy France)" for 1942 also keeps North Africa Vichy for the whole year, including after Torch.
- **Occupied countries vanish**: there are no rows for the Netherlands 1943–44, Belgium and Luxembourg 1940–44, Poland 1940–45,
  Greece 1941–44, Yugoslavia 1941–43, Denmark 1941–44, Albania 1939–43 or Hungary 1944–45. "Kingdom of Norway" 1941–44 is only 372 km², and
  "Kingdom of Italy" 1944 is only 267 km². There is no Italian Social Republic, Slovakia, Manchukuo, Mengjiang, Wang Jingwei regime or
  Philippines realm. They are presumably drawn inside the Nazi Germany, Empire of Japan and USA polygons.
- **First World War**: there is no Serbia row for 1916–17 ("Serbs" ends in 1915, and "Serbia" 1918 is only 18,522 km², the Macedonian-front
  area), no Montenegro for 1916–18, and no Romania for 1917–18 (gap between the "United Principalities" in 1916 and the "Kingdom of Romania" from 1919).
  Bulgaria is labelled "Principality of Bulgaria" although it had been a kingdom since 1908, and Greece is labelled "First Hellenic Republic"
  although it was a kingdom. No relabels exist in corrections.json for either.
- **China in 1917–18**: "Republic of China" has no rows for 1916–1929. The China-sized polygon for those years is labelled
  "Kuomintang", so it is used for China's entry (14 Aug 1917). The declaration was made by the Beijing (Beiyang) government;
  the Guangzhou government made its own declaration.
- **Canada and South Africa** exist only from 1932, so in WWI they are not coloured separately. Canada may sit in
  "British Colonial Empire", but this was not confirmed.
- **Russia's exit** falls inside 1917–18. "Russian Republic" also has a 1918 row, but it is not used, so Russia is uncoloured for all 1918 events.

## Contested or hedged facts
- WWI deaths: "an estimated 15 to 22 million" (Wikipedia casualties lead; that citation is tagged "failed verification" there,
  but the range is the one used in moments-ce-b.json).
- WWII deaths: "60 million to more than 75 million" (Wikipedia World War II).
- Armenian genocide: 600,000–1.5 million dead. The text states that almost all historians outside Turkey call it genocide and that the Turkish
  government rejects the term.
- Hiroshima and Nagasaki: kind "turning-point", not "atrocity". The text gives the death ranges by end-1945 and says the justification is still
  debated.
- Bulgaria's armistice is given as 29–30 September 1918 (the sources differ by a day). For Gallipoli, the withdrawal is given as
  "December 1915 and January 1916" because the sources date the final evacuation differently.
- Kursk is described as "some of the largest tank battles", not "the largest", which is disputed.

Count: 2 wars, 60 events, 15 cited sources (plus 15 verification pages), 0 corrections to existing files.
