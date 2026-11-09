# War playback, slice D (recent wars): log

File: `content/wars/d-recent.json`. It has 6 wars and 109 events. The JSON parses. Each id is unique across `content/wars/*.json`. Events are in date order. Every member realm exists in `public/data/clio/index.json`, and every year from `from` to `to` falls inside one of that realm's rows.

The pages behind every figure were fetched (Britannica returned 403, so I used Wikipedia statements, US State Dept Office of the Historian, NATO, the National Army Museum, CFR and the US National Archives). A few widely documented background details go beyond the fetched pages: the Han bridge demolition, Ridgway taking command after Walker's death, the Hungnam evacuation, Lehi being outlawed, the Kherson shelling and Prigozhin's death. They are worded without precise figures.

## Rule for side members
Members are states whose forces openly fought as units. Arms suppliers and covert or support roles are covered in the text only:
- Korea: the Soviet Union is left out (covert air units and advisers, about 72,000 personnel and 299 dead).
- Vietnam: China and the Soviet Union are left out. China sent about 320,000 support troops in total, and the Soviets sent advisers and missile crews. The Philippines (a non-combat civic-action group, 1966–70) and Taiwan are also left out.
- Ukraine: Belarus is left out. Its territory was a launch area and it brokered the Wagner deal, but its troops did not fight. North Korea is included for 2024 because its ground troops fought in Kursk.
- Rebels and militias with no realm are described in the text only: Yishuv militias before May 1948, the Arab Liberation Army, the Viet Cong, the Pathet Lao, the Khmer Rouge, the Northern Alliance in 2001 (drawn here as the realm `Afghanistan`), al-Qaeda, the Haqqani network and ISIS-K.

## Member choices by war
- **1948 Arab–Israeli War** (moment: none exists). The sides are `State of Israel` (1948–49), `Palestinians` (1948) and the Arab League states:
  - `Kingdom of Egypt`, `Kingdom of Jordan` (Transjordan in 1948; it took the name Jordan in 1949), `Second Syrian Republic`, `Kingdom of Iraq`, `Lebanon`, and `Kingdom of Saudi Arabia` (800–1,200 troops under Egyptian command).
  - Yemen is left out. Its roughly 300 troops are tagged "citation needed" on Wikipedia.
  - Span 1947–49: the civil war from November 1947, the invasion from 15 May 1948, and the last armistice on 20 July 1949.
- **Korean War** (moment `korean-war`).
  - South: South Korea plus the 16 states that sent combat forces: US, UK (`Kingdom of Great Britain`, shown as United Kingdom), Canada, Australia, New Zealand, South Africa, France (`French Fourth Republic`, the metropolitan realm, not the empire group), Belgium, Luxembourg, Netherlands, Greece, Turkey, Ethiopia, Colombia, the Philippines and Thailand.
  - North: North Korea and the People's Republic of China (1950–53).
- **Vietnam War** (moment `vietnam-war`).
  - North: `Democratic Republic of Vietnam` (1956–75).
  - South: `Republic of Vietnam` (1956–66 and 1973–75, see the gaps section). Allied years come from Free World Military Forces and the Australian history page: US 1964–73, South Korea 1965–73, Australia 1962–72 (advisers from August 1962), New Zealand 1965–72 and Thailand 1966–72.
  - Also on the South side: `Kingdom of Laos` 1959–75 (Royal Lao Government, "Laos (from 1959)" in Wikipedia's infobox) and `Kingdom of Cambodia` 1970–75. The second stands in for the Khmer Republic, because the map has no separate realm for it.
- **Soviet–Afghan War** (moment `soviet-afghan-war`). `Union of Soviet Socialist Republics` 1979–89 and `Afghanistan` 1979–86 against `Mujahideen` 1987–89 (see the gaps section).
- **War in Afghanistan 2001–2021** (moment `september-11-afghanistan`).
  - Coalition side: US, UK and `Afghanistan` 2001–21.
  - Taliban side: `Taliban` 2001–05.
  - Other contributors are left out because I did not source their deployment years. ISAF had 51 contributing nations, which the text mentions.
- **Russian invasion of Ukraine** (moment: none exists).
  - Sides: `Ukraine` 2022–24 against `Russian Federation` 2022–24 and `Democratic People's Republic of Korea` 2024.
  - I used `Russian Federation`, not the group `(Russian Federation)`. The group adds the `Russian-occupied territories` polygon, which is Transnistria, not occupied Ukraine.
  - The span ends at 2024 (the map's last year). The date label and the last event say the war continues.

## Gaps in the map data
- **Ukraine, 2022–2024**:
  - None of the land Russia occupied from 2022 (about 20% of Ukraine) is drawn as Russian. Ukraine's mainland polygon stays whole through 2024.
  - Crimea is in Russia from 2014 but stays inside Ukraine's polygon until 2023, so the two overlap. Ukraine's area drops by exactly Crimea's 21,857 km² only in 2024.
  - `Russian-occupied territories` is a fixed Transnistria/Gagauzia outline (as `corrections.json` already notes).
- **Afghanistan, 2001–2021**:
  - `Taliban` covers most of the country until 2005, and `Afghanistan` 2000–05 is only the Northern Alliance enclave in the north-east. So the map shows Taliban rule for four years after it fell in December 2001.
  - From 2006 `Afghanistan` is the whole country through 2024, so the Taliban return in August 2021 is not shown.
  - `Mujahideen` 2014–24 is a polygon in Syria and Iraq that has nothing to do with Afghanistan.
- **Soviet–Afghan War**: the `Afghanistan` realm stops after 1986. In 1987–89 `Mujahideen` covers almost the whole country (586,986 km²), although the government held Kabul and the cities until 1992. No realm stands for the Najibullah government after 1986.
- **Vietnam**:
  - `Republic of Vietnam` has no rows for 1967–72, so South Vietnam is blank during the Tet Offensive, My Lai, the Cambodian incursion and the Easter Offensive.
  - No Vietnamese realm exists in 1955 (the `French Indochina` row runs to 1955).
  - In 1973–75 the `Democratic Republic of Vietnam` polygon reaches south to about 13.7°N.
  - The Khmer Republic (1970–75) and the Pathet Lao zones are not drawn.
- **1948 war**:
  - `Palestinians` (1948 only, 5,477 km²) is the West Bank area, which in 1948 was in fact held mostly by the Transjordanian Arab Legion and Iraqi troops. From 1949 it is absorbed into `Kingdom of Jordan`. Jordan formally annexed it in 1950.
  - In 1947 Mandatory Palestine is drawn as part of `Kingdom of Great Britain`.
  - The Gaza Strip under Egypt and the All-Palestine Government have no realm of their own.
  - The 1948 realm `State of Israel` is drawn at 22,919 km².
- **Korea**: the realms for both Koreas are static for 1948–52, so the front lines and occupations of 1950–51 are not shown.

## Event placement
Pins mark where each event happened. I avoided far-off pins that would make the map zoom out across the world:
- These treaties and decisions are folded into the detail of nearby events, not pinned where they were signed: the UN partition vote (pinned at Jerusalem as part of the civil-war event), UN Resolution 194, the Geneva Accords of 1988 (pinned at Kabul as the start of the withdrawal) and the Bonn Agreement.
- The Paris Peace Accords are pinned at Saigon as the ceasefire taking effect across Vietnam.
- 9/11 and the US surge decision are covered in the detail of events in Afghanistan.
- Rhodes, Tokyo (MacArthur's headquarters), Doha, Istanbul and Moscow are pinned where the event happened.
- The founding place of the NLF (pinned in Tây Ninh province) and the Massoud assassination site (pinned at Khwaja Bahauddin, Takhar) are approximate.

## Contested or uncertain facts and how they are worded
- 1948: the death toll at Deir Yassin is given as at least 107 (the older figure of about 254 is mentioned as superseded). Palestinian dead are given as a range of 3,000–13,000. About 750,000 refugees: the UN Conciliation Commission counted 711,000 in 1951. Israelis call the war the War of Independence and Palestinians call it the Nakba; both names are given.
- Korea: Seoul's recapture is labelled "Sep 1950", not given a single day (Wikipedia's dates vary from 25 to 28 September; Rhee returned on 29 September).
- Vietnam: the start is given as "1955" (Wikipedia: "c. 1955"). The withdrawal of US combat troops is dated "Mar 1973" (within the 60 days set by the accords; the exact 29 March date on Wikipedia has no citation). South Vietnamese military dead differ between sources (313,000 or 392,369), so only the total Vietnamese range is used.
- Vietnam, Gulf of Tonkin: the text states that the second attack, reported on 4 August, did not happen.
- Soviet–Afghan War: Soviet dead are given as 14,453 official, up to 26,000 in other estimates. Afghan dead are given as 1–3 million. The date label uses 24 December (the Herat article) and the event uses 25 December (the infobox), with "24–25 December" in its detail.
- Afghanistan 2001: NATO took command of ISAF on 11 August 2003 (NATO's date; the CFR timeline says 8 August). British deaths are given as "about 450" (the NAM page gives both 453 and 454).
- Kakhovka Dam: most independent analysts blame Russian forces, and Russia's denial is stated. Bucha: UN-verified killings (at least 73) and Ukraine's figure of 458 bodies are both given.
- Ukraine casualties: military losses are given only as "hundreds of thousands on each side". Civilian deaths are the UN's 12,340 verified by 30 November 2024, via Kyiv Independent reporting of OHCHR, noted as an undercount.

Count: 6 wars, 109 events, 40 source entries.
