# War briefs, slice E: change log

Files written: `content/war-briefs/korean-war.json`, `vietnam-war.json`, `soviet-afghan-war.json`,
`war-in-afghanistan-2001-2021.json`, `russian-invasion-of-ukraine.json`. Side order follows each war's `sides`
array in `content/wars/d-recent.json`; every strategy `chapter` is an id from `content/cinema/<war-id>.json`.

## Figures chosen
- **korean-war**: UN side c. 970,000 at peak (Wikipedia infobox 968,302: ROK 602,902, US 326,863), checked against
  Defense Media Network (932,539 UNC ground troops, July 1953); communist side c. 1.7 million at peak (Wikipedia
  infobox 1,742,000: China 1.45M, DPRK 266,600, USSR 26,000). c. 300,000 Chinese entering unseen (Army Heritage Center).
  c. 2 million Korean civilian dead (National Army Museum). Winner null, "Stalemate; armistice".
- **vietnam-war**: North c. 860,000 (1967) and South/allies c. 1.42 million (1968), both from the Wikipedia infobox;
  Paris Accords 27 Jan 1973 and fall of Saigon (State Dept Office of the Historian); 58,220 US dead (National Archives,
  given as "some 58,000").
- **soviet-afghan-war**: Soviet troops c. 115,000 (1986) to 120,000 (1987); mujahideen 200,000–250,000; 1–3 million
  Afghan dead; c. 5 million refugees (Wikipedia infobox). US aid $20–30M/yr (1980) to $630M/yr (1987), Saudi
  matching, ISI distribution, Stingers from 1986 (Wikipedia, Operation Cyclone). Taliban base for bin Laden (State Dept).
- **war-in-afghanistan-2001-2021**: Afghan forces "more than 307,000" on paper, April 2021 (SIGAR via Al Jazeera,
  given as c. 300,000); Taliban 55,000–85,000 (UN monitors, 2020, via Al Jazeera); ISAF over 130,000 from 51 nations
  (NATO); c. 1,000 US special forces in 2001 and Doha deal (CFR timeline); c. $90 billion on Afghan army, collapse after
  the Doha deal (SIGAR via Al Jazeera 2022); girls' and women's education bans (UNICEF).
- **russian-invasion-of-ukraine**: Ukraine c. 880,000 (Zelensky, 15 Jan 2025) and Russia c. 600,000 in or near Ukraine
  (CFR, June 2025, citing the same period); North Korean troops c. 11,000–12,000 (Pentagon, Nov–Dec 2024, via
  Military Times); "roughly a fifth" occupied (CFR Global Conflict Tracker); Kyiv defence by massed artillery and the
  role of long-range fires (RUSI); Russian fortifications and minefields (CSIS, Oct 2023); refugees 6.74M abroad and
  3.7M internally displaced, mid-2024 (UNRIC citing UNHCR; UNHCR's December 2024 flash update gives c. 6.81M);
  Finland and Sweden in NATO (NATO enlargement page, fetched but not listed in the file, limited to six sources).

## Disputed or hedged
- Korea peak strengths: sources count differently (ground forces only vs all services). Both sides use the Wikipedia
  infobox peak basis; given with "c.".
- Vietnam strengths come from the Wikipedia infobox only (Britannica returned 403 on every attempt), for slightly different
  years (1967 vs 1968). Hedged as "at the peak, late 1960s".
- Soviet–Afghan: no single source gives comparable peak figures for the Afghan government army, so side 0's strength is
  Soviet troops only (stated in `strengthWhat`). Winner set to the mujahideen with result "Soviet withdrawal", because
  the communist government survived until 1992.
- Afghanistan 2001–21: strengths compare 2020–21 figures. The Afghan figure is a paper strength; SIGAR and others say
  far fewer were actually serving, so it is labelled "on paper". The Taliban figure is a UN estimate, other estimates
  run from c. 60,000 (CTC West Point) to 75,000 (SIGAR) and higher.
- Ukraine: both strengths are official or official-sourced claims from early 2025, just after the war's span (2024);
  no comparable end-2024 pair was found. Casualties given only as "hundreds of thousands, by most estimates"; claims
  range widely (Syrskyi: 427,000 Russian killed and wounded to Dec 2024; US intelligence c. 750,000 Russian by
  March 2025; Zelensky: 425,000+ Ukrainian; Mediazona: 31,481 confirmed Russian dead in 2024 alone). "A fifth" occupied
  is CFR's undated figure, consistent with the war file's summary.
- Korean POW dispute: numbers refusing repatriation (c. 21,800–23,000) differ by source; the brief does not give a figure.

## Possible errors noticed in content/wars and content/cinema (not edited)
- `wars/d-recent.json`, vietnam-war, side 1: "Republic of Vietnam" members run 1956–1966 and 1973–1975, leaving a gap
  for 1967–1972, when South Vietnam was fighting throughout.
- `wars/d-recent.json`, vietnam-war, side 1: "Kingdom of Cambodia" is listed 1970–1975, but from October 1970 the state
  was the Khmer Republic (the kingdom under Sihanouk was officially neutral until the March 1970 coup).
- `wars/d-recent.json`, soviet-afghan-war: "Afghanistan" is listed only to 1986 and "Mujahideen" only from 1987,
  although the government and the resistance both fought throughout 1979–1989 (probably a map-polity artefact).
- `wars/d-recent.json`, war-in-afghanistan-2001-2021: side 0's name includes the Northern Alliance, but no Northern
  Alliance member is listed (probably a map-polity artefact).
- `cinema/vietnam-war.json`: stages begin only in August 1964, though the war's span starts in 1955. Not an error, but
  the 1955–1964 period has no stage.
