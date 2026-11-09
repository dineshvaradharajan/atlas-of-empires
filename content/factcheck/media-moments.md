# Media check: defining moments 1850 onwards (`content/media/moments.json`)

35 moments (year ≥ 1850 in moments-ce-b.json and moments-ce-c.json). 11 have a newspaper front page, 35 have photos (62 photos in all). Every image was downloaded and looked at; every image URL was checked to return HTTP 200 with an image content type, and every Commons/Internet Archive page URL to return 200.

## Method and sources

- **Chronicling America / loc.gov (first choice, not usable):** the loc.gov search API, resource pages and the old chroniclingamerica.loc.gov endpoints now redirect to a Cloudflare “verify you are human” check (HTTP 403 for scripts and for the web-fetch tool; an interactive CAPTCHA in a browser, which I may not complete). I tried a workaround through the still-open bulk-data folder listings (`chroniclingamerica.loc.gov/data/batches/`) to locate *Evening Star* issues and build `tile.loc.gov` IIIF crops, but those listings are rate-limited to roughly 25 requests before a long HTTP 429 block, and a test IIIF URL built from them returned 404, so I stopped. **If someone opens loc.gov in a normal browser, the Evening Star (sn83045462) would very likely give front pages for: Fort Sumter (13–15 Apr 1861), the 1918 flu (Oct 1918), 1–3 Sep 1939, the UN Charter (26–27 Jun 1945), Korea (26 Jun 1950), Congo/Nigeria independence (1 Jul / 1 Oct 1960) and the Cuban crisis (23 Oct 1962)** — these are the gaps.

- **Internet Archive / Wikimedia Commons, The New York Times (1861–62, 1894–1929):** Commons hosts the Internet Archive scans of NYT issues (“per new-york-times-magazine” series) marked public domain. The image links use Internet Archive's own IIIF server to crop the top of page 1; the `page` link is the Commons file page that states the licence.

- **Other front pages:** Commons files marked public domain (Upsala Nya Tidning 1942, The Stars and Stripes 1945, Chicago Daily Tribune 1945, The Hindustan Times 1947, The Palestine Post 1948, People's Daily 1949); these are whole-page Commons thumbnails because Commons offers no crop service.

- **Photos:** Wikimedia Commons only (licence read from the file page metadata; US federal works, NARA, NASA, IWM, Bundesarchiv, Nationaal Archief, CC-licensed Flickr imports). Images linked as `upload.wikimedia.org` 960 px thumbnails, or the original file when it is 600–1000 px wide.

- After 1963 Chronicling America has nothing, and no public-domain or freely licensed front page about these events was found on Commons (front pages of 1964–2022 newspapers are copyrighted; Commons pages of e.g. 9/11 front pages or the 1969 Moon-landing papers are photos of copyrighted pages). Those moments have photos only.

## Per moment

### moment:indian-rebellion-1857: Indian Rebellion of 1857 (1857–1858)

- **Newspaper:** None. Chronicling America could not be searched (see Method); the NYT run on Commons/Internet Archive has no 1857–58 issues, and no other public-domain front page with a headline on the rising was found on Commons. (Illustrated London News pages of 1857 exist on Commons but are engravings, not headline front pages.)
- **Photo:** The mosque at Meerut “said to be the principal resort of the mutineers”, photographed in 1858. Robert and Harriet Tytler. Public domain. <https://commons.wikimedia.org/wiki/File:1857_mutineers_mosque_meerut2.jpg>
- **Photo:** Ruins of the Secundra Bagh palace at Lucknow after the siege, with human remains in the courtyard, 1858. Felice Beato / Imperial War Museum. Public domain. <https://commons.wikimedia.org/wiki/File:The_Indian_Mutiny_1857-1859_Q69824.jpg>
  - Both are 1858 photographs of the uprising's sites: Tytler's Meerut mosque (the city where it began) and Beato's Secundra Bagh, Lucknow. Rejected: a Mughal-court painting of Bahadur Shah Zafar (painting, c.1850) and a looting engraving (not a photograph).

### moment:origin-of-species: Darwin's On the Origin of Species (1859)

- **Newspaper:** None. the book's publication (24 Nov 1859) was not front-page headline news; nothing qualifies.
- **Photo:** Title page of the first edition of On the Origin of Species (John Murray, London, 1859). John Murray, publisher. Public domain. <https://commons.wikimedia.org/wiki/File:Origin_of_Species_title_page.jpg>
- **Photo:** Charles Darwin, photographed about 1854, while he was working on the theory. Henry Maull and John Polyblank. Public domain. <https://commons.wikimedia.org/wiki/File:Charles_Darwin_seated.jpg>
  - First-edition title page (1859) and Darwin c.1854 (five years before publication; the closest-dated free photo).

### moment:us-civil-war: American Civil War (1861–1865)

- **Newspaper:** The New York Times (New York), 1861-11-13. Front page: “The Great Rebellion … The success of the Great Expedition … the attack on the forts at Port Royal Entrance” (Union capture of Port Royal, South Carolina, 7 November 1861). Licence: Public domain (published in the US before 1930).
  - No public-domain front page from the days after Fort Sumter (12–14 Apr 1861) was reachable: the NYT run on Commons/Internet Archive starts in October 1861. Used the NYT of 13 Nov 1861 instead: a front page of the war itself, six days after the Union capture of Port Royal, S.C. (7 Nov 1861), headed “The Great Rebellion … The success of the Great Expedition”. Cropped (IIIF) to the top 35%; the column headlines are small but readable at 1000 px. Replace with a 13–15 Apr 1861 page from Chronicling America if you can reach loc.gov in a browser.
- **Photo:** Fort Sumter under the Confederate flag on 14 April 1861, the day after its surrender. US National Archives. Public domain. <https://commons.wikimedia.org/wiki/File:Fort_Sumter,_S.C.,_April_14,_1861,_under_the_Confederate_flag.jpg>
- **Photo:** “A Harvest of Death”: dead soldiers on the battlefield of Gettysburg, July 1863. Timothy H. O'Sullivan. Public domain. <https://commons.wikimedia.org/wiki/File:Timothy_H._O%27Sullivan_(American_-_A_Harvest_of_Death_-_Google_Art_Project_(cropped).jpg>
  - Fort Sumter on 14 Apr 1861 (where the war began) and O'Sullivan's Gettysburg photograph (1863).

### moment:meiji-restoration: Meiji Restoration (1868)

- **Newspaper:** None. no free-licensed or public-domain front page with a headline on the 3 Jan 1868 restoration was found (the Commons/Internet Archive NYT run has no 1868 issues; Chronicling America could not be searched (see Method)).
- **Photo:** Emperor Meiji in court dress, photographed in 1872. Uchida Kuichi. Public domain. <https://commons.wikimedia.org/wiki/File:Emperor_Meiji_Photograph_in_1872.jpg>
- **Photo:** Samurai of the Chōshū domain during the Boshin War period, late 1860s. Felice Beato. Public domain. <https://commons.wikimedia.org/wiki/File:Satsuma-samurai-during-boshin-war-period.jpg>
  - Uchida Kuichi's 1872 portrait of the emperor; Beato's Boshin-war-era samurai. The Commons file is named “Satsuma” but its description says Chōshū; caption follows the description.

### moment:berlin-conference: Berlin Conference and the Scramble for Africa (1884–1885)

- **Newspaper:** None. Chronicling America could not be searched (see Method); no NYT issues for Nov 1884–Feb 1885 on Commons/Internet Archive; nothing else found.
- **Photo:** Contemporary engraving of the Berlin Conference in session, with a map of Africa on the wall (Über Land und Meer, 1884). Adalbert von Rößler / Über Land und Meer. Public domain. <https://commons.wikimedia.org/wiki/File:Kongokonferenz.jpg>
  - Only a contemporary engraving exists (no photograph of the conference); it was published in Über Land und Meer in 1884 and shows the delegates and the map of Africa. Rejected: a French satirical cartoon of Bismarck carving Africa (CC0, but a caricature).

### moment:battle-of-adwa: Battle of Adwa (1896)

- **Newspaper:** The New York Times (New York), 1896-03-05. Front page: “Italy is awe-struck … Five thousand soldiers killed” (the defeat at Adwa). Licence: Public domain (published in the US before 1930).
  - NYT, 5 Mar 1896 (4 days after the battle): lead left-column headline “Italy is awe-struck … Five thousand soldiers killed”; the story under it names the defeat at Adowa by the Abyssinians. The NYT front pages of 3 and 4 Mar 1896 were checked and carry nothing on Adwa. Cropped (IIIF) to the left half of the top so the column headline is readable.
- **Photo:** Emperor Menelik II of Ethiopia, who led the army that defeated Italy at Adwa. Unknown photographer. Public domain. <https://commons.wikimedia.org/wiki/File:Emperor_Menelik_II.png>
- **Photo:** Italian soldiers taken prisoner in the war of 1895–96, photographed at Harar in 1897. Charles Michel. Public domain. <https://commons.wikimedia.org/wiki/File:Italian_prisoners_Ethiopia_1897_(cropped).jpg>
  - Menelik II portrait (date uncertain, late 19th/early 20th c.) and Italian prisoners photographed at Harar in 1897. Rejected: a coloured lithograph of prisoners (not a photograph).

### moment:world-war-i: World War I (1914–1918)

- **Newspaper:** The New York Times (New York), 1914-07-29. Front page: “Austria formally declares war on Servia; Russia threatens, already moving troops”. Licence: Public domain (published in the US before 1930).
  - NYT, 29 Jul 1914: banner “Austria formally declares war on Servia”. Cropped (IIIF) to the top 28% of the page.
- **Photo:** Police seize a man in Sarajevo moments after the assassination of Archduke Franz Ferdinand, 28 June 1914. Unknown photographer. Public domain. <https://commons.wikimedia.org/wiki/File:Ferdinand_Behr_arrested_in_Sarajevo_1914.jpg>
- **Photo:** British 8-inch howitzers firing during the Battle of the Somme, August 1916. John Warwick Brooke / Imperial War Museum. Public domain. <https://commons.wikimedia.org/wiki/File:British_39th_Siege_Battery_RGA_Somme_1916.jpg>
  - Sarajevo, 28 Jun 1914: Commons notes scholars think the man seized is the bystander Ferdinand Behr, not Princip, so the caption does not name him. Plus an IWM Somme photo (1916).

### moment:russian-revolution: Russian Revolution (1917–1922)

- **Newspaper:** The New York Times (New York), 1917-03-16. Front page: “Revolution in Russia; Czar abdicates”. Licence: Public domain (published in the US before 1930).
  - NYT, 16 Mar 1917 (day after the abdication): banner “Revolution in Russia; Czar abdicates”. Cropped (IIIF) to the top.
- **Photo:** Soldiers demonstrating in Petrograd during the February Revolution, 1917. Unknown photographer. Public domain. <https://commons.wikimedia.org/wiki/File:Soldiers_demonstration.February_1917.jpg>
- **Photo:** Crowd at the Winter Palace in Petrograd after its capture by the Bolsheviks, 26 October (7 November) 1917. Pyotr Novitsky. Public domain. <https://commons.wikimedia.org/wiki/File:After_the_capture_of_the_Winter_Palace_26_October_1917.jpg>
  - February 1917 soldiers' demonstration in Petrograd; Winter Palace crowd after its capture (film still, P. Novitsky).

### moment:influenza-pandemic-1918: The 1918 influenza pandemic (1918–1920)

- **Newspaper:** None. The NYT front pages of 1–26 Oct 1918 (Commons/Internet Archive) were checked through their OCR text: the flu appears only in small items and advertisements, never as a front-page headline (the war dominates). Chronicling America could not be searched (see Method). A Commons file of the Washington Times, 27 Sep 1918 (“Gauze mask to halt spread of plague”) is an uploader-made montage of a masthead and an inside clipping, not a front page, so it was not used.
- **Photo:** Emergency influenza ward at Camp Funston, Kansas, 1918. National Museum of Health and Medicine. Public domain. <https://commons.wikimedia.org/wiki/File:Emergency_hospital_during_Influenza_epidemic,_Camp_Funston,_Kansas_-_NCP_1603.jpg>
- **Photo:** Seattle police wearing gauze masks made by the Red Cross, December 1918. US National Archives. Public domain. <https://commons.wikimedia.org/wiki/File:Spanish_flu_in_1918,_Police_officers_in_masks,_Seattle_Police_Department_detail,_from-_165-WW-269B-25-police-l_(cropped).jpg>
  - Camp Funston, Kansas (the moment's place) and Seattle police in masks, Dec 1918. Also seen but not used: a Washington Times 27 Sep 1918 clipping collage on Commons (an uploader-made montage, not a front page).

### moment:great-depression: Wall Street Crash and the Great Depression (1929–1939)

- **Newspaper:** The New York Times (New York), 1929-10-30. Front page: “Stocks collapse in 16,410,030-share day”. Licence: Public domain (published in the US before 1930).
  - NYT, 30 Oct 1929 (day after Black Tuesday): “Stocks collapse in 16,410,030-share day”. Cropped (IIIF) to the top. 1929 publications are public domain in the US since 1 Jan 2025.
- **Photo:** Crowds gather on Wall Street outside the New York Stock Exchange after the crash, October 1929. US government (Social Security Administration). Public domain. <https://commons.wikimedia.org/wiki/File:Crowd_outside_nyse.jpg>
- **Photo:** Unemployed men queue outside a soup kitchen in Chicago, February 1931. US National Archives. Public domain. <https://commons.wikimedia.org/wiki/File:Unemployed_men_queued_outside_a_depression_soup_kitchen_opened_in_Chicago_by_Al_Capone,_02-1931_-_NARA_-_541927.jpg>
  - Wall Street crowd, Oct 1929; Chicago soup-kitchen queue, Feb 1931.

### moment:world-war-ii: World War II (1939–1945)

- **Newspaper:** The Stars and Stripes, Paris edition (US armed forces newspaper), 1945-05-02. Front page extra: “Hitler dead”, a week before Germany's surrender. Licence: Public domain.
  - No public-domain front page from 1–3 Sep 1939 was found (Chronicling America could not be searched (see Method); the Commons NYT run ends in 1929). Used The Stars and Stripes (Paris edition, US armed forces, public domain) of 2 May 1945, “Hitler dead”, a key event of the war's last week. The page carries a large Hitler portrait. Considered and not used: Honolulu Star-Bulletin “War!” extra of 7 Dec 1941 (Commons file is a photo of a museum display).
- **Photo:** A Polish soldier and refugees in besieged Warsaw, September 1939. Julien Bryan. Public domain. <https://commons.wikimedia.org/wiki/File:Warsaw_1939_refugees_and_soldier.jpg>
- **Photo:** German Heinkel He 111 bombers over Warsaw, September 1939. Unknown German photographer. Public domain. <https://commons.wikimedia.org/wiki/File:German_Heinkel_He_111_bombing_Warsaw_1939.jpg>
  - Julien Bryan's photo of besieged Warsaw (the moment's place), Sept 1939; German bombers over Warsaw, Sept 1939.

### moment:holocaust: The Holocaust (1941–1945)

- **Newspaper:** Upsala Nya Tidning (Uppsala, Sweden), 1942-12-18. Front page: “Planer på att utrota judarna förverkligas” (“Plans to exterminate the Jews being carried out”), on the Allied declaration of 17 December 1942. Licence: Public domain.
  - Upsala Nya Tidning (Sweden), 18 Dec 1942: headline “Planer på att utrota judarna förverkligas” (“Plans to exterminate the Jews being carried out”), reporting the Allied declaration of 17 Dec 1942 read by Anthony Eden. Commons states public domain; the file is already a crop of the page top.
- **Photo:** “Selection” of Hungarian Jews on the ramp at Auschwitz-Birkenau, May–June 1944 (Auschwitz Album). Bernhard Walter or Ernst Hofmann (Auschwitz Album) / Yad Vashem. Public domain. <https://commons.wikimedia.org/wiki/File:Selection_on_the_ramp_at_Auschwitz-Birkenau,_1944_(Auschwitz_Album)_1b.jpg>
- **Photo:** Jews of Würzburg, Germany, marched to deportation to occupied Poland, 25 April 1942. Unknown photographer / USHMM. Public domain. <https://commons.wikimedia.org/wiki/File:Deportation_of_Jews_from_W%C3%BCrzburg_to_the_Lublin_district,_25_April_1942_(USHMM_46207).jpg>
  - Auschwitz Album (Birkenau ramp, 1944) and the Würzburg deportation (1942). Graphic images (mass graves) deliberately avoided.

### moment:atomic-bombings: Atomic bombings of Hiroshima and Nagasaki (1945)

- **Newspaper:** Chicago Daily Tribune, 1945-08-08. Front page: “Atom bomb crew’s story!” and “4 sq. mi. of Hiroshima destroyed”. Licence: Public domain.
  - Chicago Daily Tribune, 8 Aug 1945 (two days after Hiroshima): “Atom bomb crew's story!” with “Blast rocks B-29 10 miles away; 4 sq. mi. of Hiroshima destroyed”. Commons states public domain (scan from MSU Libraries). Whole-page Commons thumbnail; the banner fills the top and is readable at 960 px. Note: the second banner line uses a wartime ethnic slur for the Japanese; the caption does not repeat it, but it is visible in the image.
- **Photo:** Hiroshima after the atomic bombing, 1945. US Navy. Public domain (US federal government). <https://commons.wikimedia.org/wiki/File:Hiroshima_aftermath.jpg>
- **Photo:** The mushroom cloud over Nagasaki, 9 August 1945. Charles Levy / US National Archives. Public domain (US federal government). <https://commons.wikimedia.org/wiki/File:Nagasakibomb.jpg>
  - Hiroshima ruins (US Navy) and the Nagasaki cloud (Charles Levy).

### moment:united-nations: The United Nations is founded (1945)

- **Newspaper:** None. Chronicling America could not be searched (see Method) and no public-domain or free front page of 26–27 Jun 1945 (Charter signing) was found on Commons.
- **Photo:** The Canadian delegation in session at the United Nations Conference on International Organization, San Francisco, May 1945. Nicholas Morant / National Film Board of Canada. Public domain. <https://commons.wikimedia.org/wiki/File:Canadian_Delegation_at_United_Nations_Conference_on_International_Organization_1945.jpg>
  - Only one usable free photo: the Canadian delegation at the San Francisco conference, May 1945 (NFB, public domain). Rejected: a UN-staff photo of three unidentified men (weak relevance, UN watermark); 2010s photos of UN Plaza (not of that time).

### moment:india-independence-partition: Indian independence and Partition (1947)

- **Newspaper:** The Hindustan Times (New Delhi), 1947-08-15. Front page: “India independent: British rule ends”. Licence: Public domain.
  - The Hindustan Times, Delhi edition, 15 Aug 1947: “India independent: British rule ends”. Commons file page states public domain. Whole-page Commons thumbnail (no crop service); headline is in the top fifth and readable at 960 px.
- **Photo:** Lord Mountbatten swears in Jawaharlal Nehru as independent India's first prime minister, 15 August 1947. Photo Division, Government of India. Public domain. <https://commons.wikimedia.org/wiki/File:Lord_Mountbatten_swears_in_Jawaharlal_Nehru_as_the_first_Prime_Minister_of_free_India_on_Aug_15,_1947.jpg>
- **Photo:** A refugee special train at Ambala station during Partition, with refugees riding on the roof. Photo Division, Government of India. Public domain. <https://commons.wikimedia.org/wiki/File:A_refugee_special_train_at_Ambala_Station_during_partition_of_India.jpg>
  - Nehru sworn in, 15 Aug 1947 (Photo Division, GoI) and a refugee train at Ambala. Rejected: “A refugee train, Punjab, 1947” (only 500 px wide, below the 600 px minimum).

### moment:prc-proclaimed: People's Republic of China proclaimed (1949)

- **Newspaper:** People's Daily (Renmin Ribao, Beijing), 1949-10-02. Front page (left) and back page: “Central People's Government of the People's Republic of China founded”. Licence: Public domain.
  - People's Daily (人民日报), 2 Oct 1949: front-page headline 中华人民共和国中央人民政府成立 (“Central People's Government of the PRC founded”) with a photo of Mao at the microphone. The Commons file is a two-page spread (front page left, back page right); whole-image Commons thumbnail.
- **Photo:** Mao Zedong proclaims the People's Republic of China at Tiananmen, 1 October 1949. Unknown photographer. Public domain. <https://commons.wikimedia.org/wiki/File:Mao_Proclaiming_New_China.JPG>
  - Mao proclaiming the PRC, 1 Oct 1949 (the Commons file is a restored copy of the well-known photo).

### moment:korean-war: Korean War (1950–1953)

- **Newspaper:** None. Chronicling America could not be searched (see Method); no public-domain/free front page of 25–27 Jun 1950 found on Commons.
- **Photo:** A US Army howitzer crew near the Kum River, South Korea, 15 July 1950. US Army Signal Corps. Public domain (US federal government). <https://commons.wikimedia.org/wiki/File:KumRiver_Howitzer.jpg>
- **Photo:** Signing of the Korean War armistice at Panmunjom, 27 July 1953. F. Kazukaitis, US Navy / US Department of Defense. Public domain (US federal government). <https://commons.wikimedia.org/wiki/File:Korean_War_armistice_agreement_1953.jpg>
  - Kum River gun crew, July 1950; armistice signing at Panmunjom (the moment's place), July 1953.

### moment:vietnam-war: Vietnam War (1955–1975)

- **Newspaper:** None. the war's key US moments (1964–75) are after the Chronicling America cut-off, and no public-domain/free front page was found on Commons.
- **Photo:** A young US Marine waits on the beach during the Marine landing at Da Nang, 3 August 1965. US Marine Corps / US National Archives. Public domain (US federal government). <https://commons.wikimedia.org/wiki/File:Marine_da_nang.jpg>
- **Photo:** Civilians search the ruins of their homes in Cholon, Saigon, after the 1968 Tet Offensive. Joel D. Meyerson / US Army. Public domain (US federal government). <https://commons.wikimedia.org/wiki/File:Cholon_after_Tet_Offensive_operations_1968.jpg>
  - Da Nang landing, Aug 1965 (US escalation) and Cholon (Saigon, the moment's place) after Tet, 1968. Rejected: a blurry 1975 evacuation photo.

### moment:year-of-africa: The Year of Africa (1960)

- **Newspaper:** None. Chronicling America could not be searched (see Method); no public-domain/free front page on Nigerian or Congolese independence (1960) found on Commons.
- **Photo:** Nigeria's independence ceremony in Lagos, 1 October 1960: Governor-General Sir James Robertson, Princess Alexandra and Prime Minister Abubakar Tafawa Balewa. NSAG Crebolder Collection / African Studies Centre Leiden. CC BY-SA 4.0. <https://commons.wikimedia.org/wiki/File:ASC_Leiden_-_NSAG_-_Crebolder_2_-_40_-_Independence_ceremony._Robertson_GG,_Princess_Alexandra,_Abubakar_Tafawa_Balewa,_President_-_Lagos,_Nigeria_-_October_1,_1960.tif>
- **Photo:** Patrice Lumumba in Brussels during the talks on Congo's independence, 26 January 1960. Harry Pot / Nationaal Archief. CC0. <https://commons.wikimedia.org/wiki/File:LumumbaBrussel1960.jpg>
  - Nigeria's independence ceremony in Lagos (the moment's place), 1 Oct 1960; Lumumba in Brussels during the Congo independence talks, Jan 1960.

### moment:cuban-missile-crisis: Cuban Missile Crisis (1962)

- **Newspaper:** None. Chronicling America could not be searched (see Method) (the Evening Star of 22–23 Oct 1962 would qualify there); no public-domain/free front page found on Commons.
- **Photo:** U-2 reconnaissance photo of the San Cristóbal medium-range missile site, 14 October 1962. US Air Force / John F. Kennedy Presidential Library. Public domain (US federal government). <https://commons.wikimedia.org/wiki/File:Cuba_Missiles_Crisis_U-2_photo.jpg>
- **Photo:** President Kennedy signs the proclamation imposing the naval quarantine of Cuba, 23 October 1962. Cecil Stoughton, White House. Public domain (US federal government). <https://commons.wikimedia.org/wiki/File:President_Kennedy_signs_Cuba_quarantine_proclamation,_23_October_1962.jpg>
  - U-2 photo of San Cristóbal (14 Oct 1962) and JFK signing the quarantine proclamation (23 Oct 1962).

### moment:apollo-11: Apollo 11: humans on the Moon (1969)

- **Newspaper:** none. After the Chronicling America cut-off (1963) and no public-domain or free front page found on Commons.
- **Photo:** Apollo 11 lifts off from Kennedy Space Center, 16 July 1969. NASA. Public domain (US federal government). <https://commons.wikimedia.org/wiki/File:Apollo_11_Launch_-_GPN-2000-000630.jpg>
- **Photo:** Buzz Aldrin beside a seismic experiment, with the lunar module Eagle behind, 20 July 1969. Neil A. Armstrong / NASA. Public domain (US federal government). <https://commons.wikimedia.org/wiki/File:Aldrin_Looks_Back_at_Tranquility_Base_-_GPN-2000-001102.jpg>
  - Launch (16 Jul 1969) and Aldrin on the Moon (20 Jul 1969), NASA.

### moment:china-reform-opening: China's reform and opening-up (1978 onwards)

- **Newspaper:** none. After the Chronicling America cut-off (1963) and no public-domain or free front page found on Commons.
- **Photo:** Deng Xiaoping with President Jimmy Carter at the White House, 29 January 1979, a month after reform and opening-up began. White House / US National Archives. Public domain (US federal government). <https://commons.wikimedia.org/wiki/File:Deng_Xiaoping_and_Jimmy_Carter_at_the_arrival_ceremony_for_the_Vice_Premier_of_China._-_NARA_-_183157-restored.jpg>
  - No free photo of 1978–80 Shenzhen was found; used Deng with Carter, 29 Jan 1979 (Deng's US visit, one month after the 18 Dec 1978 launch of reform and opening-up).

### moment:soviet-afghan-war: Soviet–Afghan War (1979–1989)

- **Newspaper:** none. After the Chronicling America cut-off (1963) and no public-domain or free front page found on Commons.
- **Photo:** A Soviet soldier on guard in Afghanistan, 1988. Mikhail Evstafiev. CC BY-SA 3.0. <https://commons.wikimedia.org/wiki/File:Evstafiev-Soviet-soldier-Afghanistan.jpg>
- **Photo:** Afghan mujahideen fighters in Kunar province, August 1985. Erwin Lux. CC BY-SA 3.0. <https://commons.wikimedia.org/wiki/File:August_1985_Muja.jpg>
  - Mikhail Evstafiev (1988) and Erwin Lux (1985), both CC BY-SA 3.0.

### moment:world-wide-web: The World Wide Web (1989–1991)

- **Newspaper:** none. After the Chronicling America cut-off (1963) and no public-domain or free front page found on Commons.
- **Photo:** The NeXT computer Tim Berners-Lee used at CERN as the first web server, with its “do not power down” label (photographed in 2005). Coolcaesar (Wikimedia Commons). CC BY-SA 3.0. <https://commons.wikimedia.org/wiki/File:First_Web_Server.jpg>
  - Only the machine itself: the NeXT computer used as the first web server, photographed in 2005 at a CERN exhibition (the object is from 1990, the photo is not). Kept because it is the original hardware; drop it if a contemporary photo is required.

### moment:fall-of-berlin-wall: Fall of the Berlin Wall (1989)

- **Newspaper:** none. After the Chronicling America cut-off (1963) and no public-domain or free front page found on Commons.
- **Photo:** People on top of the Berlin Wall near the Brandenburg Gate, November 1989. Sue Ream. CC BY 3.0. <https://commons.wikimedia.org/wiki/File:BerlinWall-BrandenburgGate.jpg>
- **Photo:** East Berliners crossing at Bornholmer Straße, 10 November 1989. Hans Peter Lochmann / Bundesarchiv. CC BY-SA 3.0 de. <https://commons.wikimedia.org/wiki/File:Bundesarchiv_Bild_183-1989-1118-028,_Berlin,_Grenz%C3%BCbergang_Bornholmer_Stra%C3%9Fe.jpg>
  - Sue Ream's photo at the Brandenburg Gate (CC BY 3.0, Nov 1989) and Bundesarchiv photo at Bornholmer Straße, 10 Nov 1989.

### moment:dissolution-of-ussr: Dissolution of the Soviet Union (1991)

- **Newspaper:** none. After the Chronicling America cut-off (1963) and no public-domain or free front page found on Commons.
- **Photo:** Tanks near the Russian parliament building (the White House) in Moscow during the August 1991 coup attempt. Ole Husby. CC BY-SA 2.0. <https://commons.wikimedia.org/wiki/File:Tanks_by_the_White_House_(8000381755).jpg>
- **Photo:** Defenders of the Russian parliament during the coup attempt, Moscow, 20 August 1991. Oleg Klimov / Liberty.SU. CC BY-SA 4.0. <https://commons.wikimedia.org/wiki/File:1991_Oleg_Klimov_Liberty.SU_02.jpg>
  - Both from the August 1991 coup attempt in Moscow, which hastened the collapse. No free photo of the 25 Dec 1991 flag lowering or of the Belovezha signing was found.

### moment:end-of-apartheid: End of apartheid (1990–1994)

- **Newspaper:** none. After the Chronicling America cut-off (1963) and no public-domain or free front page found on Commons.
- **Photo:** F. W. de Klerk and Nelson Mandela shake hands at Davos, January 1992, during the negotiations to end apartheid. World Economic Forum. CC BY-SA 2.0. <https://commons.wikimedia.org/wiki/File:Frederik_de_Klerk_with_Nelson_Mandela_-_World_Economic_Forum_Annual_Meeting_Davos_1992.jpg>
  - De Klerk and Mandela at Davos, Jan 1992 (negotiation period). Rejected: Mandela casting his vote in 1994 (CC BY-SA, but only 538 px wide, below the 600 px minimum).

### moment:september-11-afghanistan: 9/11 and the war in Afghanistan (2001–2021)

- **Newspaper:** none. After the Chronicling America cut-off (1963) and no public-domain or free front page found on Commons.
- **Photo:** Smoke pours from the World Trade Center towers, 11 September 2001. Michael Foran. CC BY 2.0. <https://commons.wikimedia.org/wiki/File:WTC_smoking_on_9-11.jpeg>
- **Photo:** Maj. Gen. Chris Donahue, the last US soldier to leave Afghanistan, boards a C-17 in Kabul, 30 August 2021. Master Sgt. Alexander Burnett, US Central Command. Public domain (US federal government). <https://commons.wikimedia.org/wiki/File:Last_American_Soldier_leaves_Afghanistan.jpg>
  - WTC smoke on 9/11 (CC BY 2.0) and the last US soldier leaving Kabul, 30 Aug 2021 (US federal).

### moment:financial-crisis-2008: Global financial crisis (2007–2009)

- **Newspaper:** none. After the Chronicling America cut-off (1963) and no public-domain or free front page found on Commons.
- **Photo:** Lehman Brothers headquarters in New York on 15 September 2008, the day the bank filed for bankruptcy. Robert Scoble. CC BY 2.0. <https://commons.wikimedia.org/wiki/File:Lehman_Brothers-20080915.jpg>
- **Photo:** Customers queue outside a Northern Rock branch during the run on the British bank, September 2007. Dominic Alves. CC BY 2.0. <https://commons.wikimedia.org/wiki/File:Northern_Rock_Queue.jpg>
  - Lehman HQ on 15 Sep 2008 and the Northern Rock run, Sep 2007. Also checked: a Wikinews print edition of 16 Sep 2008 (CC BY 2.5), but its front page has no Lehman headline, so not used.

### moment:covid-19-pandemic: COVID-19 pandemic (2019–2023)

- **Newspaper:** none. After the Chronicling America cut-off (1963) and no public-domain or free front page found on Commons.
- **Photo:** A sports centre in Wuhan converted into a makeshift (Fangcang) hospital, February 2020. 汮汐 (Wikimedia Commons). CC BY-SA 4.0. <https://commons.wikimedia.org/wiki/File:%E5%A1%94%E5%AD%90%E6%B9%96%E4%BD%93%E8%82%B2%E4%B8%AD%E5%BF%83%E6%94%B9%E9%80%A0%E7%9A%84%E6%96%B9%E8%88%B1%E5%8C%BB%E9%99%A2_07.jpg>
- **Photo:** An exhausted medic at San Salvatore Hospital, Pesaro, Italy, March 2020. Alberto Giuliani. CC BY-SA 4.0. <https://commons.wikimedia.org/wiki/File:Covid-19_San_Salvatore_09.jpg>
  - Wuhan makeshift hospital, Feb 2020 (the moment's place) and Pesaro hospital, Mar 2020.

### moment:israel-nakba-1948: The creation of Israel, the 1948 war and the Nakba (1947–1949)

- **Newspaper:** The Palestine Post (Jerusalem), 1948-05-16. Front page: “State of Israel is born”. Licence: Public domain.
  - The Palestine Post, Jerusalem, 16 May 1948: “State of Israel is born”. Commons states public domain. The page also reports the Arab armies' invasion. Whole-image Commons thumbnail (already the top of the page).
- **Photo:** David Ben-Gurion proclaims the State of Israel in Tel Aviv, 14 May 1948. Rudi Weissenstein / Israel National Photo Collection. Public domain. <https://commons.wikimedia.org/wiki/File:Declaration_of_State_of_Israel_1948.jpg>
- **Photo:** Palestinian girls push their belongings in prams as they leave Jaffa, 1948. UN Archives (UNRWA). Public domain. <https://commons.wikimedia.org/wiki/File:Palestinians_fleeing_Jaffa_1948.jpg>
  - Ben-Gurion's proclamation (14 May 1948) and girls leaving Jaffa (UN Archives). Note: on Commons the author tooltip for the Ben-Gurion photo shows a vandalised Wikidata description for Rudi Weissenstein (an offensive Arabic phrase); the credit here uses only his name. Worth reporting to Wikidata.

### moment:iranian-revolution: The Iranian Revolution (1978–1979)

- **Newspaper:** none. After the Chronicling America cut-off (1963) and no public-domain or free front page found on Commons.
- **Photo:** Mass demonstration against the Shah in Tehran on Ashura, 11 December 1978. Bahman Jalali. Public domain. <https://commons.wikimedia.org/wiki/File:Tehran_Ashura_Demonstration,_11_December_1978_(10).jpg>
- **Photo:** Ayatollah Khomeini speaking to the press in exile at Neauphle-le-Château, France, 17 January 1979. Unknown photographer (iichs.ir). Public domain. <https://commons.wikimedia.org/wiki/File:Ruhollah_Khomeini_press_conference_of_17_January_1979,_Neauphle-le-Ch%C3%A2teau.jpg>
  - Ashura demonstration in Tehran (11 Dec 1978) and Khomeini's press conference in exile (17 Jan 1979).

### moment:rwandan-genocide: The genocide against the Tutsi in Rwanda (April–July 1994)

- **Newspaper:** none. After the Chronicling America cut-off (1963) and no public-domain or free front page found on Commons.
- **Photo:** Rwandan refugees at the Kitali camp, August 1994. TSgt. Val Gempis, US Air Force. CC0. <https://commons.wikimedia.org/wiki/File:Rwandan_refugees_at_the_Kitali_refugee_camp_DF-ST-99-05606.jpg>
  - Rwandan refugees at Kitali camp, Aug 1994 (CC0, US Air Force). Rejected: CDC photo of a refugee camp in Zaire (only 500 px wide) and post-2000 memorial photos (not of that time).

### moment:paris-agreement: The Paris Agreement on climate change (2015)

- **Newspaper:** none. After the Chronicling America cut-off (1963) and no public-domain or free front page found on Commons.
- **Photo:** Heads of delegations at the opening of the COP21 climate conference at Le Bourget, 30 November 2015. Presidencia de la República Mexicana. CC BY 2.0. <https://commons.wikimedia.org/wiki/File:COP21_participants_-_30_Nov_2015_(23430273715).jpg>
  - Leaders at the COP21 opening, 30 Nov 2015 (CC BY 2.0). No free photo of the 12 Dec adoption was found.

### moment:russian-invasion-of-ukraine: Russia's full-scale invasion of Ukraine (2022 onwards)

- **Newspaper:** none. After the Chronicling America cut-off (1963) and no public-domain or free front page found on Commons.
- **Photo:** Kyiv civilians prepare Molotov cocktails in a basement as Russian troops approach, 25 February 2022. Yan Boechat / VOA. Public domain (US federal government). <https://commons.wikimedia.org/wiki/File:Reporter%E2%80%99s_Notebook_-_Thriving_Kyiv_Becomes_Battle_Zone,_Almost_Overnight_03_(cropped).jpg>
- **Photo:** Destroyed Russian armoured vehicles on Vokzalna Street, Bucha, after the Russian withdrawal, April 2022. Ukrinform TV / Ukrainian Armed Forces. CC BY 3.0. <https://commons.wikimedia.org/wiki/File:Bucha_main_street,_2022-04-06_(0804).jpg>
  - VOA photo in Kyiv (the moment's place), 25 Feb 2022, and destroyed Russian armour in Bucha, April 2022. Rejected: a Kraków refugee rally photo (protest signs with profanity) and a 24 Feb Kyiv strike photo (damage not visible).

## Editorial change after review
- moment:atomic-bombings: the Chicago Daily Tribune front page (8 Aug 1945) was removed because its banner headline contains a wartime ethnic slur. The moment keeps its photos.
