#!/usr/bin/env python3
"""Cross-check the atlas's dated border changes for 1816-1991 against the Correlates of War Territorial Change dataset v6
(read-only; writes a report, changes no data).

COW Territorial Change lists 842 dated transfers of territory 1816-2018 (year, month, gaining and losing entity as COW
state codes, the entity transferred, its area, the procedure, and whether it was an independence). It has no shapes, so
this script tests dates and the direction of change, not borders:

  atlas  public/data/clio/*.json with content/corrections.json and public/data/supplements.json applied, exactly as
         tools/check_cshapes.py reads them (imported from it: load_atlas() and its realm -> Gleditsch-Ward LINKS table;
         check_cshapes.py itself is not changed)
  COW    data/cow-territorial/tc2018.csv (the transfers), states2016.csv (COW state codes -> names and years) and
         Entities.pdf (codes of non-state entities -> names; read with pdftotext if it is installed)

For every transfer with a locatable territory, a representative point (lon, lat) is taken from a hand-written table:
by change number for partial transfers (Schleswig, Alsace-Lorraine, Nice and Savoy, the Mexican Cession...), else by
entity code for whole units (Texas, Hanover, Bosnia...). For each point the script asks which atlas realms hold it in
every year from 1815 to 1991, maps each realm to a COW code (check_cshapes.LINKS converted from GW to COW codes, plus a
table below for the pre-1886 states the CShapes check never needed), and compares with COW:

  1. dates      the atlas shows the gainer taking the point, but in a different year (by how many years)
  2. missing    the atlas never shows the gainer there within 25 years (nothing drawn, or no change shown)
  3. wrong side the atlas gives the point to a third state (wrong gainer), or the gainer takes it from someone other
                than the COW loser (wrong loser)
  4. independence  indep = 1 transfers whose new state the atlas starts drawing (anywhere) in a different year

A transfer in year Y matches if the atlas switches in Y or Y+1 (the atlas counts a realm in year Y if f <= Y <= t, and
COW dates mostly to the treaty). Transfers to or from the League of Nations or UN (codes 0 and 1) are counted, not
tested. From 1992 the atlas draws Natural Earth borders, so transfers after 1991 are counted, not ranked.

Output: content/factcheck/cow-check.md
Run:    python3 -I tools/check_cow.py [--window 25]

Source (required citation): Tir, Jaroslav, Philip Schafer, Paul F. Diehl, and Gary Goertz. 1998. "Militarized
Interstate Disputes and Territorial Change, 1816-1992." Conflict Management and Peace Science 16(2): 89-97.
(COW Territorial Change v6, https://correlatesofwar.org/data-sets/territorial-change/ .) State list: Correlates of War
Project. 2017. "State System Membership List, v2016." https://correlatesofwar.org/data-sets/state-system-membership/ .
The raw files stay in data/cow-territorial/ (gitignored); the report carries only derived figures and names.
Fetch:  mkdir -p data/cow-territorial && cd data/cow-territorial
        curl -LO https://correlatesofwar.org/wp-content/uploads/terr-changes-v6.zip && unzip terr-changes-v6.zip
        curl -LO https://correlatesofwar.org/wp-content/uploads/states2016.csv
"""
import argparse, collections, csv, datetime, os, re, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "tools"))
import check_cshapes as CS  # noqa: E402  (load_atlas, link, LINKS: read-only use)

COW_DIR = os.path.join(ROOT, "data", "cow-territorial")
TC_PATH = os.path.join(COW_DIR, "tc2018.csv")
STATES_PATH = os.path.join(COW_DIR, "states2016.csv")
ENT_PATH = os.path.join(COW_DIR, "Entities.pdf")
OUT = os.path.join(ROOT, "content", "factcheck", "cow-check.md")
Y0, Y1 = 1815, 1991  # atlas years read (1815 so that 1816 transfers have a year before)
CITATION = ('Tir, Jaroslav, Philip Schafer, Paul F. Diehl, and Gary Goertz. 1998. "Militarized Interstate Disputes and '
            'Territorial Change, 1816–1992." *Conflict Management and Peace Science* 16(2): 89–97. (COW Territorial '
            'Change v6.)')

# ---------------------------------------------------------------------------------------------------------------------
# Atlas realm -> COW code, for realms check_cshapes.LINKS does not cover (mostly states that ended before 1886) or where
# COW codes differ from GW. A value is a code or a list of (from, to, code).
# ---------------------------------------------------------------------------------------------------------------------
EXTRA = {
    # German Confederation members (COW lists the larger ones as states; Prussia is COW 255 "Germany" from 1816)
    "Kingdom of Prussia": 255, "North German Confederation": 255, "Kingdom of Bavaria": 245, "Kingdom of Württemberg": 271,
    "Grand Duchy of Baden": 267, "Republic of Baden": 267, "Kingdom of Saxony": 269, "Kingdom of Hanover": 240,
    "Electorate of Hesse": 273, "Grand Duchy of Hesse": 275, "Duchy of Mecklenburg": 280, "Duchy of Nassau": 254,
    "Free City of Frankfurt": 247, "Free City of Bremen": 246, "Free City of Hamburg": 248, "Duchy of Oldenburg": 257,
    "Duchy of Brunswick": 244, "Duchy of Anhalt": 241, "Principality of Lippe": 252,
    "Grand Duchy of Saxe-Weimar-Eisenach": 261, "Principality of Schwarzburg-Sonderhausen": 268,
    "Principality of Hohenzollern-Sigmaringen": 250, "Free City of Krakow": 2292, "Austrian Empire": 300,
    # Italian states (Sardinia is COW 325 "Italy" from 1816)
    "Kingdom of Sardinia": 325, "Kingdom of the Two Sicilies": 329, "Papal States": 327, "Grand Duchy of Tuscany": 337,
    "Duchy of Modena and Reggio": 332, "Duchy of Parma and Piacenza": 335, "Duchy of Lucca": 336,
    # other European
    "Bourbon Kingdom of France": 220, "French Second Republic": 220, "Second French Empire": 220,
    "Spanish Empire": 230, "First Spanish Republic": 230, "Portuguese Empire": 235, "British Empire": 200,
    "Prince-Bishopric of Montenegro": 341,
    "Principality of Moldavia": 640, "Principality of Wallachia": 640,  # Ottoman vassals until 1878 in COW
    "Slovak Republic": 317, "Turkish Republic of Northern Cyprus": 640,
    # Americas
    "Federated Republic of Mexico": 70, "Centralist Mexico": 70, "First Mexican Empire": 70, "Second Mexican Empire": 70,
    "Republic of Texas": 7, "Gran Colombia": 100, "Venezuela, New Granada and Ecuador": 100,
    "Republic of New Granada": 100, "Granadine Confederation": 100, "Río de la Plata": 160,
    "Peru-Bolivian Confederation": 145,  # COW codes its break-up (1839) as Peru seceding from Bolivia
    "United Provinces of Central America": 89, "Kingdom of Hawaï'i": 4, "Provisional Government of Hawaii": 4,
    "Republic of Hawai'i": 4,
    # Africa and Asia
    "Tokugawa Shogunate": 740, "Khedivate of Egypt": 651, "Muhammad Ali dynasty": [(1815, 1854, 640), (1855, 2100, 651)],
    "Beylik of Tunis": 616, "Regency of Algiers": 640, "Karamanli Dynasty": 640, "Imamate of Yemen": 678,
    "Nguyễn dynasty": 815, "Kingdom of Cambodia (post-Angkor)": 811, "Kingdom of Luang Phrabang": 812,
    "Konbaung Dynasty": 775, "Mahdist State": 625, "Talpur Dynasty": 7693, "Kashmir and Jammu": 7507,
    "Kingdom of Sikkim": 761, "Natalia Republic": 562, "Basotho Kingdom": 570, "Kingdom of Fiji": 950,
    "Durrani Empire": 700, "Durrani Dynasty": 700, "Kingdom of Hejaz": 671, "Asir": 672, "Republic of Yemen": 679,
    "Tonga": 955, "Samoa": 990,
    # microstates (check_cshapes leaves them out because GW does; COW lists them)
    "Antigua and Barbuda": 58, "Commonwealth of Dominica": 54, "Grenada": 55, "Kiribati": 946, "Marshall Islands": 983,
    "Micronesia": 987, "Nauru": 970, "Saint Kitts and Nevis": 60, "Saint Kitts": 60, "Saint Lucia": 56,
    "Saint Vincent": 57, "Seychelles": 591, "São Tomé and Príncipe": 403, "Tuvalu": 947, "Vanuatu": 935,
    "Kingdom of Monaco": 221, "Principality of Monaco": 221, "Principality of Andorra": 232,
    "Principality of Liechtenstein": 223, "Republic of San Marino": 331, "Vatican City": 328,
}
EXTRA_COLONIES = {
    "Antigua (British associated state)": 200, "Saint Vincent (British associated state)": 200,
    "French colonies": 220, "French Algeria": 220, "French India": 220, "British Cape Colony": 200, "Dutch Gold Coast": 210,
    "Danish Gold Coast": 390, "Saar Protectorate": 220,
}
EXTRA_FACTIONS = {
    "Confederate States of America": 2, "Riograndense Republic": 140, "State of Buenos Aires": 160,
    "Taiping Heavenly Kingdom": 710, "Panthay Rebellion": 710,
}
# COW codes the loser of the 1918-1920 settlements as Austria (305) or Hungary (310); the atlas draws Austria-Hungary.
LOSER_EQUIV = {305: {300}, 310: {300}}
# Before-years in which an occupier the atlas draws (Germany in 1918, the Axis in 1939-45) is not counted as a wrong loser
WARTIME = [(1914, 1920), (1938, 1945)]
# Whole-unit rows whose entity point would stand for far more than the territory transferred
SKIP_ENTITY_PT = {75}  # 1839, 5,560 km² of the Dutch East Indies: not Java
NAME_FIX = {7: "Texas", 0: "League of Nations", 1: "United Nations", 4: "Hawaii", 822: "Unfederated Malay States",
            815: "Vietnam (Annam)", 711: "Manchuria", 679: "Yemen", 89: "Central America", 563: "Transvaal",
            564: "Orange Free State"}

# ---------------------------------------------------------------------------------------------------------------------
# Representative points (lon, lat). ENTITY_PTS: used for whole-unit transfers (portion 1) and independences, keyed by
# the COW entity code. CHANGE_PTS: keyed by the COW change number, for partial transfers and where the entity code does
# not name the territory; a value is a list of (lon, lat, label). Points sit inside the territory, away from its edges.
# ---------------------------------------------------------------------------------------------------------------------
ENTITY_PTS = {
    3: (-150, 64), 4: (-155.5, 19.6), 5: (-64.75, 17.73), 6: (-66.5, 18.2), 7: (-97.0, 31.0), 20: (-75.0, 46.0),
    21: (-56.0, 48.5), 31: (-77.9, 24.5), 40: (-79.0, 22.0), 42: (-70.5, 18.8), 51: (-77.3, 18.1), 52: (-61.3, 10.45),
    53: (-59.55, 13.15), 54: (-61.35, 15.4), 55: (-61.68, 12.12), 56: (-60.97, 13.9), 57: (-61.2, 13.25),
    58: (-61.8, 17.08), 60: (-62.75, 17.3), 70: (-101.0, 21.0), 80: (-88.7, 17.25), 95: (-80.5, 8.4), 96: (-79.7, 9.1),
    100: (-74.1, 4.6), 101: (-66.0, 9.0), 110: (-58.5, 5.5), 115: (-55.5, 4.5), 130: (-78.6, -1.0), 135: (-75.5, -12.0),
    140: (-45.0, -20.0), 145: (-66.0, -17.5), 155: (-70.7, -33.5), 160: (-58.8, -34.6), 165: (-56.0, -33.0),
    205: (-7.5, 53.0), 211: (4.5, 50.8), 212: (6.13, 49.8), 240: (9.5, 52.6), 241: (12.25, 51.83), 244: (10.52, 52.27),
    245: (11.7, 48.4), 246: (8.8, 53.08), 248: (10.0, 53.55), 250: (8.97, 48.35), 252: (8.88, 51.94),
    253: (13.06, 53.36), 254: (7.9, 50.35), 256: (7.0, 49.35), 257: (8.1, 52.9), 260: (8.6, 50.5), 261: (11.33, 50.98),
    265: (12.0, 51.5), 267: (8.0, 48.3), 268: (10.87, 51.37), 269: (13.2, 51.0), 270: (11.33, 50.72), 271: (9.3, 48.6),
    273: (9.5, 51.3), 275: (8.65, 49.87), 280: (12.1, 53.75), 290: (20.5, 52.0), 291: (18.65, 54.35),
    305: (15.6, 48.0), 310: (19.0, 47.2), 315: (15.0, 49.8), 317: (19.3, 48.75), 326: (13.77, 45.65), 327: (12.7, 42.0),
    329: (15.0, 40.9), 332: (10.93, 44.65), 335: (10.33, 44.8), 336: (10.5, 43.84), 337: (11.2, 43.5),
    338: (14.45, 35.9), 339: (20.0, 41.0), 341: (19.0, 42.6), 344: (16.3, 45.7), 345: (20.8, 44.0), 346: (18.0, 44.2),
    349: (14.8, 46.0), 350: (22.3, 37.5), 351: (24.9, 35.25), 352: (33.36, 35.12), 355: (25.0, 42.7), 359: (28.5, 47.3),
    360: (25.5, 44.6), 366: (25.5, 58.85), 367: (25.0, 56.9), 368: (24.0, 55.3), 369: (31.5, 49.5), 370: (28.0, 53.7),
    371: (44.8, 40.3), 372: (44.0, 42.0), 373: (47.5, 40.4), 375: (25.0, 61.8), 385: (10.0, 61.0), 395: (-19.0, 64.9),
    402: (-23.5, 15.1), 403: (6.6, 0.25), 404: (-15.0, 12.0), 411: (10.3, 1.6), 412: (10.3, 1.6), 413: (8.7, 3.5),
    420: (-15.3, 13.45), 432: (-6.0, 13.5), 433: (-15.5, 14.7), 434: (2.2, 8.0), 435: (-10.0, 18.5), 436: (6.0, 14.5),
    437: (-5.2, 7.6), 438: (-11.5, 10.5), 439: (-1.5, 12.4), 451: (-11.8, 8.5), 452: (-1.2, 7.5), 460: (1.1, 7.0),
    461: (1.15, 8.5), 462: (0.2, 8.5), 470: (12.0, 4.5), 471: (12.0, 4.5), 472: (10.1, 6.0), 475: (7.0, 8.0),
    481: (11.6, -0.8), 482: (20.0, 6.5), 483: (18.5, 12.5), 484: (15.3, -4.0), 490: (23.0, -3.0), 500: (32.5, 1.0),
    501: (37.0, -0.5), 510: (35.0, -6.0), 511: (39.3, -6.1), 515: (29.8, -2.8), 516: (29.9, -3.4), 517: (30.0, -2.0),
    520: (45.0, 3.0), 521: (45.0, 9.8), 522: (42.6, 11.6), 530: (39.0, 9.5), 531: (38.9, 15.3), 540: (15.0, -12.5),
    541: (35.0, -17.0), 551: (28.4, -14.5), 552: (29.8, -19.4), 553: (34.0, -13.3), 560: (23.0, -32.0),
    562: (30.8, -29.2), 563: (28.0, -25.5), 564: (26.5, -28.5), 565: (16.7, -20.5), 570: (28.2, -29.5),
    571: (24.5, -22.5), 572: (31.4, -26.5), 580: (47.3, -19.2), 581: (43.35, -11.65), 590: (57.55, -20.25),
    591: (55.45, -4.65), 600: (-6.0, 33.0), 601: (-5.8, 35.77), 602: (-5.26, 35.17), 605: (-10.0, 29.3),
    609: (-13.0, 25.0), 615: (3.0, 36.0), 616: (10.1, 35.68), 620: (13.0, 32.2), 625: (32.5, 14.0), 645: (44.0, 33.0),
    651: (30.9, 29.3), 652: (37.0, 35.0), 660: (35.75, 33.9), 663: (36.2, 31.0), 666: (34.95, 32.3), 671: (39.9, 21.5),
    672: (42.5, 18.2), 673: (49.6, 25.4), 678: (44.0, 15.0), 680: (47.0, 14.5), 690: (47.8, 29.3), 692: (50.55, 26.05),
    694: (51.2, 25.3), 696: (55.5, 24.3), 698: (58.2, 23.5), 701: (60.0, 39.0), 702: (69.0, 38.8), 703: (74.5, 41.5),
    704: (64.5, 40.0), 705: (68.0, 48.0), 711: (125.3, 43.9), 712: (103.0, 47.0), 713: (120.9, 23.7),
    730: (127.8, 36.4), 731: (126.5, 39.5), 732: (127.8, 36.4), 740: (138.5, 36.0), 741: (127.8, 26.3),
    750: (78.5, 23.0), 751: (79.8, 11.93), 752: (74.0, 15.4), 760: (90.4, 27.4), 761: (88.6, 27.5), 770: (70.6, 30.0),
    771: (90.4, 23.8), 775: (96.0, 21.5), 780: (80.7, 7.5), 781: (73.5, 4.2), 811: (104.8, 11.8), 812: (103.3, 19.3),
    815: (105.8, 21.0), 816: (105.8, 21.0), 817: (106.0, 11.5), 820: (101.8, 3.6), 823: (116.5, 5.5), 824: (112.5, 2.2),
    830: (103.82, 1.35), 835: (114.7, 4.6), 840: (121.0, 15.5), 850: (110.4, -7.3), 851: (138.0, -4.5),
    860: (125.9, -8.8), 900: (134.0, -25.0), 910: (145.0, -6.0), 911: (146.5, -8.0), 912: (145.0, -5.8),
    920: (175.5, -39.0), 925: (-159.77, -21.23), 930: (165.5, -21.3), 935: (167.0, -15.4), 940: (160.0, -9.6),
    945: (173.0, 1.4), 946: (173.0, 1.4), 947: (179.2, -8.5), 950: (178.0, -17.8), 955: (-175.2, -21.15),
    960: (-149.43, -17.65), 970: (166.93, -0.53), 980: (145.75, 15.18), 983: (171.2, 7.1), 985: (144.78, 13.45),
    987: (158.2, 6.9), 990: (-171.8, -13.9), 1151: (-109.35, -27.12), 1163: (-59.0, -51.7), 2249: (7.89, 54.18),
    2292: (19.94, 50.06), 3462: (17.8, 43.35), 4784: (7.7, 11.1), 5812: (45.15, -12.8), 7507: (74.8, 34.1),
    7693: (68.5, 26.0), 8231: (115.22, 5.3), 9002: (96.85, -12.15), 9452: (105.6, -10.5),
}
P = lambda lon, lat, label="": [(lon, lat, label)]  # noqa: E731
CHANGE_PTS = {
    # entity code does not name the territory
    28: P(-16.3, 15.9, "Saint-Louis"), 36: P(-82.5, 29.5, "Florida"), 45: P(33.6, 13.5, "Sennar"),
    73: P(45.0, 12.8, "Aden"), 105: P(74.0, 31.5, "Punjab (Lahore)"), 106: P(74.8, 34.1, "Kashmir valley"),
    166: P(19.9, 39.6, "Ionian Islands (Corfu)"), 197: P(66.96, 39.65, "Samarkand"), 216: P(60.36, 41.38, "Khiva"),
    221: P(25.0, 13.5, "Darfur"), 228: P(71.8, 40.4, "Kokand (Fergana)"), 286: P(171.2, 7.1, "Marshall Islands"),
    292: P(46.5, 14.0, "Aden hinterland"), 682: P(-12.0, 27.9, "Tarfaya strip"), 894: P(28.75, 60.71, "Vyborg (Karelia)"),
    895: P(73.0, 20.2, "Dadra and Nagar Haveli"),
    # partial transfers
    30: P(-97.0, 47.5, "Red River basin south of 49°N"), 32: P(-110.5, 49.5, "Milk River basin north of 49°N"),
    33: P(73.9, 18.5, "Peshwa's lands (Pune)"), 49: P(102.4, -3.7, "Bencoolen"), 54: P(22.5, -31.0, "Cape northern frontier"),
    55: P(93.6, 19.8, "Arakan"), 60: P(44.6, 40.1, "Erivan khanate"), 62: P(42.98, 41.64, "Akhaltsikhe"),
    65: P(3.0, 36.5, "Algiers"), 67: P(-77.3, 1.2, "Pasto"), 74: P(88.26, 27.04, "Darjeeling"),
    77: P(5.5, 49.9, "Belgian Luxembourg"), 82: P(-69.0, 46.8, "Aroostook (Maine)"), 83: P(-67.5, 47.6, "northern New Brunswick"),
    90: P(-3.8, 5.4, "Grand-Bassam"), 95: P(9.6, 0.4, "Libreville estuary"), 96: P(-120.5, 44.0, "Oregon"),
    97: P(-122.0, 51.0, "New Caledonia (British Columbia)"), 101: P(1.0, 35.3, "Tiaret (western Algeria)"),
    103: P(-111.5, 39.5, "Mexican Cession (Utah)"), 107: P(-14.3, 10.95, "Boké (Guinea coast)"), 114: P(96.5, 17.3, "Pegu"),
    116: P(-111.5, 32.0, "Gadsden Purchase"), 118: P(65.5, 44.85, "Ak-Mechet (Syr Darya)"),
    121: P(70.0, 49.0, "Kazakh steppe (approx.)"), 125: P(28.6, 45.7, "southern Bessarabia (guess)"),
    126: P(43.1, 40.6, "Kars (guess)"), 131: P(128.5, 51.5, "Amur left bank"), 133: P(-84.5, 15.2, "Mosquitia (Honduras)"),
    135: P(121.5, -8.6, "Flores"), 137: P(9.5, 45.4, "Lombardy"), 138: P(46.5, 42.5, "Dagestan"),
    139: P(-84.0, 13.0, "Mosquito Coast (Nicaragua)"), 141: P(-15.5, 16.4, "Walo (Senegal)"),
    142: [(6.3, 45.5, "Savoy"), (7.25, 43.85, "Nice")], 148: P(12.9, 43.3, "Umbria and Marche"),
    149: P(134.0, 45.5, "Ussuri (Primorye)"), 152: P(3.4, 6.5, "Lagos"), 157: P(43.0, 12.0, "Obock"),
    158: P(106.6, 10.9, "eastern Cochin China"), 163: P(10.6, 53.5, "Lauenburg"), 164: P(9.4, 54.6, "Schleswig"),
    165: P(10.0, 54.1, "Holstein"), 167: P(39.8, 44.5, "Circassia"), 169: P(90.0, 26.7, "Bengal Duars"),
    170: P(-70.0, -24.5, "Atacama 24°–25°S"), 171: P(10.0, 54.1, "Holstein"), 176: P(11.9, 45.5, "Venetia"),
    179: P(-66.0, -8.5, "Madeira–Purus (approx.)"), 181: P(105.4, 10.4, "western Cochin China"),
    195: P(103.2, 13.1, "Battambang"), 200: P(-56.5, -21.7, "Apa–Branco (approx.)"), 201: P(-59.5, -25.0, "Formosa (Chaco)"),
    204: P(-1.6, 5.2, "Dutch Gold Coast (Elmina)"), 205: P(24.0, -28.5, "Griqualand West"),
    206: [(7.5, 48.3, "Alsace"), (6.4, 49.0, "Lorraine (Metz)")], 210: P(81.3, 43.9, "Ili (Kulja)"),
    215: P(59.8, 42.6, "Amu Darya right bank (approx.)"), 219: P(101.0, 4.6, "Perak"), 224: P(142.8, 50.5, "Sakhalin"),
    226: P(155.8, 50.4, "northern Kurils"), 239: P(21.9, 43.3, "Niš"), 241: P(19.26, 42.44, "Podgorica"),
    243: P(28.4, 44.7, "Northern Dobruja"), 245: P(28.6, 45.7, "southern Bessarabia"), 246: P(43.1, 40.6, "Kars"),
    247: P(-67.0, -39.0, "northern Patagonia"), 248: P(42.1, 9.3, "Harar (approx.)"), 258: P(22.4, 39.6, "Thessaly"),
    260: P(81.3, 43.9, "Ili (Kulja)"), 262: P(-69.6, -20.0, "Tarapacá"), 265: P(-69.0, -23.0, "Antofagasta"),
    270: P(42.9, 11.6, "Tadjoura"), 275: P(42.1, 9.3, "Harar (approx.)"), 278: P(7.0, 5.5, "Oil Rivers (southern Nigeria)"),
    279: P(24.0, -26.5, "British Bechuanaland"), 281: P(12.0, -1.0, "interior Gabon"), 284: P(12.3, -5.0, "Cabinda"),
    287: P(155.3, -6.2, "Bougainville"), 288: P(40.45, -2.4, "Witu"), 290: P(61.83, 37.6, "Merv"),
    295: P(31.5, -28.0, "Zululand"), 299: P(39.6, -4.0, "Mombasa coast"), 309: P(102.5, 3.8, "Pahang"),
    310: P(-9.0, 13.0, "French Sudan (Kita, approx.)"), 312: P(38.6, -6.6, "Tanganyika coast"),
    318: P(-15.0, 13.5, "Gambia valley"), 320: P(-5.0, 7.7, "Ivory Coast interior"), 321: P(38.9, 15.3, "Eritrean highlands"),
    322: P(48.5, 6.0, "Hobyo / Majeerteen"), 323: P(37.3, -1.5, "Machakos (approx.)"), 325: P(40.45, -2.4, "Witu"),
    328: P(18.5, -11.0, "Angolan interior (approx.)"), 330: P(23.5, -17.8, "Caprivi Strip"), 331: P(32.8, -5.0, "Tabora"),
    338: P(70.0, 32.8, "Waziristan"), 339: P(160.0, -9.6, "Guadalcanal"), 341: P(-4.0, 15.0, "Macina (approx.)"),
    345: P(32.5, 0.5, "Buganda"), 346: P(29.5, -31.3, "Pondoland"), 348: P(2.0, 7.2, "Abomey (Dahomey)"),
    353: P(73.5, 37.8, "Pamirs"), 355: P(-1.6, 6.7, "Ashanti (Kumasi)"), 356: P(31.4, 1.5, "Bunyoro"),
    358: P(-11.5, 8.8, "Sierra Leone hinterland"), 363: P(-1.0, 9.5, "Northern Territories"), 372: P(4.0, 9.6, "Borgu"),
    382: P(157.2, -7.1, "Choiseul"), 383: P(-59.5, 6.5, "Essequibo"), 386: P(8.99, 13.8, "Zinder (approx.)"),
    402: P(-69.0, -9.5, "Acre"), 409: P(101.7, 19.25, "Sayaboury"), 411: P(102.1, 12.6, "Chanthaburi"),
    414: P(121.8, 39.1, "Kwantung"), 415: P(142.7, 47.0, "southern Sakhalin"), 418: P(30.8, 4.0, "Lado Enclave"),
    419: P(-68.0, -1.5, "Japurá–Içá (approx.)"), 421: P(96.5, 4.3, "Aceh"), 423: P(103.2, 13.1, "Battambang"),
    426: P(-69.5, -12.0, "Madre de Dios (approx.)"), 427: [(100.6, 6.0, "Kedah"), (102.0, 5.5, "Kelantan")],
    428: P(-13.0, 20.5, "Adrar (Atar)"), 429: P(30.8, 4.0, "Lado Enclave"), 434: P(20.8, 13.8, "Wadai (Abéché)"),
    435: P(16.0, 2.0, "Neukamerun"), 437: P(-5.5, 33.8, "Fez"), 442: P(22.2, 41.75, "Štip"), 443: P(21.17, 42.66, "Kosovo"),
    444: P(19.36, 43.36, "Pljevlja (Sandžak)"), 445: P(24.15, 41.15, "Drama"), 446: P(26.3, 39.2, "Lesbos"),
    448: P(21.8, 40.3, "western Macedonia (Kozani)"), 449: P(25.4, 41.12, "Western Thrace (Komotini)"),
    450: P(27.8, 43.6, "Southern Dobruja"), 452: P(103.3, 2.0, "Johor"), 461: P(-11.5, 27.9, "Cape Juby"),
    480: P(16.0, 2.0, "Neukamerun"), 482: [(7.5, 48.3, "Alsace"), (6.4, 49.0, "Lorraine (Metz)")],
    484: [(17.2, 52.3, "Posen"), (18.3, 53.5, "West Prussia (Corridor)")], 485: P(21.0, 50.0, "western Galicia"),
    490: P(11.2, 46.3, "South Tyrol / Trentino"), 492: [(14.6, 46.0, "Carniola"), (16.6, 43.65, "Dalmatia")],
    493: P(25.4, 41.12, "Western Thrace (Komotini)"), 504: P(25.3, 54.7, "Vilnius"), 505: P(14.63, 46.66, "Carinthia zone A"),
    507: P(21.25, 48.7, "Košice"), 508: P(13.94, 45.24, "Istria"), 510: [(19.85, 45.25, "Vojvodina"), (18.7, 45.55, "Slavonia")],
    511: P(28.86, 47.0, "Bessarabia"), 512: P(24.0, 46.5, "Transylvania"), 517: P(9.3, 55.1, "North Schleswig"),
    530: [(26.1, 52.1, "Polesia (Pinsk)"), (26.25, 50.62, "Volhynia (Rivne)")], 532: P(41.8, 41.6, "Batumi"),
    538: P(17.93, 50.67, "Upper Silesia, German part"), 539: P(19.02, 50.26, "Upper Silesia, Polish part"),
    545: P(42.0, 0.5, "Jubaland"), 550: P(43.5, 36.3, "Mosul"), 557: P(-70.25, -18.0, "Tacna"),
    564: P(118.0, 41.5, "Jehol"), 565: P(-72.0, -1.5, "Putumayo–Amazon"), 568: P(-61.5, -20.5, "Chaco Boreal"),
    572: P(114.5, 38.0, "North China"), 574: [(12.9, 50.25, "Sudetenland (Karlsbad)"), (15.05, 50.77, "Sudetenland (Reichenberg)")],
    576: P(18.16, 47.99, "southern Slovakia"), 579: P(23.0, 48.3, "Carpatho-Ukraine"), 582: P(25.3, 54.7, "Vilnius"),
    583: P(36.2, 36.3, "Hatay"), 584: P(27.8, 43.6, "Southern Dobruja"), 589: P(-75.0, -2.5, "Maynas (Oriente)"),
    594: P(18.16, 47.99, "southern Slovakia"), 597: P(21.0, 54.7, "Königsberg"),
    598: [(26.1, 52.1, "Polesia (Pinsk)"), (25.6, 49.55, "eastern Galicia (Ternopil)")], 599: P(23.0, 48.3, "Carpatho-Ukraine"),
    600: P(142.7, 47.0, "southern Sakhalin"), 602: P(114.5, 38.0, "North China"), 616: P(13.94, 45.24, "Istria"),
    618: [(28.86, 47.0, "Bessarabia"), (25.94, 48.29, "northern Bukovina")], 619: P(28.75, 60.71, "Vyborg (Karelia)"),
    640: P(35.26, 32.22, "West Bank (Nablus)"), 643: P(74.8, 34.1, "Kashmir valley"),
    646: [(73.47, 34.37, "Muzaffarabad"), (74.3, 35.9, "Gilgit")], 671: P(-5.26, 35.17, "northern zone (Chefchaouen)"),
    688: P(-84.5, 14.8, "Mosquitia north of the Coco"), 711: P(10.1, 6.0, "Southern Cameroons"),
    712: P(13.3, 10.3, "Northern Cameroons"), 748: P(33.75, 29.9, "Sinai (Nakhl)"), 750: P(35.26, 32.22, "West Bank (Nablus)"),
    784: P(17.43, 21.83, "Aouzou strip"), 789: P(33.6, 35.25, "northern Cyprus"), 799: P(33.2, 28.9, "Abu Rudeis (Sinai)"),
    804: P(-14.8, 22.8, "Tiris al-Gharbiyya"), 807: P(-11.7, 26.7, "Saguia el-Hamra (Smara)"),
    817: P(33.8, 31.1, "El Arish (Sinai)"), 820: P(-14.8, 22.8, "Tiris al-Gharbiyya"),
}


# Hand checks of the top findings (section 0 of the report), each against a source read on 2026-11-13.
W_ = "https://en.wikipedia.org/wiki/"
VERIFIED = [
    {"finding": "Santo Domingo (No. 39): the atlas draws Haiti 1822–1845 and the Dominican Republic from 1846",
     "cow": "1821-11, Dominican Republic ← Spain (indep.)", "atlas": "change in 1846 (+24)",
     "source": f"[Dominican War of Independence]({W_}Dominican_War_of_Independence)",
     "verdict": "Ambiguous",
     "why": "COW codes the five-week \"Ephemeral Independence\" of 9 November 1821 and records neither Haiti's takeover "
            "(9 February 1822) nor independence from Haiti (27 February 1844), so the 24 years are COW's choice of "
            "event. Against 1844, though, the atlas is two years late (atlas error)."},
    {"finding": "Kaiser-Wilhelmsland (No. 524): drawn as \"British Colonial Empire\" 1921–1943, Australia only from 1944",
     "cow": "1920-12, Australia ← Germany (mandate)", "atlas": "change in 1944 (+23)",
     "source": f"[Territory of New Guinea]({W_}Territory_of_New_Guinea)",
     "verdict": "Atlas error",
     "why": "Australia held the League mandate from 17 December 1920. The land is drawn, but under the wrong holder: "
            "the atlas files the Australian mandate under the British empire until the Japanese war."},
    {"finding": "Essequibo (No. 383): British from 1877 in the atlas",
     "cow": "1899-10, United Kingdom ← Venezuela", "atlas": "change in 1877 (−22)",
     "source": f"[Guayana Esequiba]({W_}Guayana_Esequiba)",
     "verdict": "Ambiguous",
     "why": "Britain held British Guiana from 1814 and settled west of the Essequibo (Cuyuni gold mines 1876, Schomburgk "
            "Line declared the provisional frontier 1886). The award of 3 October 1899 confirmed most of the claim. "
            "COW dates the award; the atlas shows British possession before it."},
    {"finding": "Kuwait (No. 384) drawn inside the Sultanate of Muscat and Oman 1900–1921; Qatar (No. 460) likewise "
                "1916–1935",
     "cow": "1899-01, United Kingdom ← Kuwait (protection agreement)", "atlas": "change in 1922 (+22)",
     "source": f"[Sheikhdom of Kuwait]({W_}Sheikhdom_of_Kuwait)",
     "verdict": "Atlas error",
     "why": "Kuwait was a British-protected sheikhdom from the 1899 agreement, under nominal Ottoman suzerainty until "
            "1914. It was never part of Muscat and Oman. The Omani polygon or label spills over the Gulf sheikhdoms "
            "(the same at Doha 1916–1935)."},
    {"finding": "East Upper Silesia (No. 539): Katowice drawn as German 1919–1944 (nothing drawn 1934–1935)",
     "cow": "1922-08, Poland ← Germany", "atlas": "change in 1945 (+22)",
     "source": f"[Upper Silesia plebiscite]({W_}Upper_Silesia_plebiscite)",
     "verdict": "Atlas error",
     "why": "East Upper Silesia (about 3,214 km², the industrial district round Katowice) went to Poland under the "
            "decision of 20 October 1921 and the Geneva Convention of 15 May 1922. It was the Silesian Voivodeship "
            "until 1939. It is too small for the CShapes check's 10,000 km² threshold."},
    {"finding": "Luxembourg (No. 180): covered by the Netherlands until 1889 (and still overlapped by it after 1890)",
     "cow": "1867-12, Luxembourg ← Netherlands (indep.)", "atlas": "Luxembourg from 1890 (+22)",
     "source": f"[Treaty of London (1867)]({W_}Treaty_of_London_(1867))",
     "verdict": "Atlas error",
     "why": "Luxembourg was a separate grand duchy in personal union with the Dutch crown until 1890, never Dutch "
            "territory, and the 1867 treaty confirmed its full independence. COW's 1867 date is itself a convention. "
            "The CShapes check found the same gap for 1886–1889."},
    {"finding": "Antofagasta (No. 265): Bolivian in the atlas until 1904",
     "cow": "1884-04, Chile ← Bolivia (truce)", "atlas": "change in 1905 (+20)",
     "source": f"[Treaty of Peace and Friendship (1904)]({W_}Treaty_of_Peace_and_Friendship_(1904))",
     "verdict": "Ambiguous",
     "why": "Chile occupied the Litoral in 1879 and administered it under the Valparaíso truce of 1884. Bolivia "
            "recognised Chilean sovereignty only in the 1904 treaty. COW follows the truce, the atlas the de jure date."},
    {"finding": "Sudan (No. 276): nothing drawn 1885–1889, the Mahdist State only from 1890",
     "cow": "1884-01, Sudan ← United Kingdom (indep.)", "atlas": "from 1890 (+5)",
     "source": f"[Mahdist State]({W_}Mahdist_State)",
     "verdict": "Atlas error",
     "why": "Khartoum fell on 26 January 1885, and the Mahdist state held most of the Sudan until 1898–99. The atlas "
            "leaves about 2.5 million km² blank for five years. COW's January 1884 is a year early."},
    {"finding": "Papua New Guinea (No. 802): drawn as a state from 1946",
     "cow": "1975-09, Papua New Guinea ← Australia (indep.)", "atlas": "from 1946 (−29)",
     "source": f"[Territory of Papua and New Guinea]({W_}Territory_of_Papua_and_New_Guinea)",
     "verdict": "Atlas error",
     "why": "It was an Australian external territory (united administration from 1 July 1949) until independence on "
            "16 September 1975. The CShapes check (section 3) found the same."},
    {"finding": "Somalia (No. 706): \"British Africa\" 1941–1959",
     "cow": "1960-07, Somalia ← Italy (indep.); 1949 trusteeship to Italy (No. 638, UN, not tested)",
     "atlas": "British until 1959",
     "source": f"[Trust Territory of Somaliland]({W_}Trust_Territory_of_Somaliland)",
     "verdict": "Atlas error (1950–1959)",
     "why": "The British military administration of 1941–1950 is right, but Italy administered the UN trust "
            "territory from 1 April 1950 to 1960."},
]


# ---------------------------------------------------------------------------------------------------------------------
# Loading
# ---------------------------------------------------------------------------------------------------------------------
def num(v, default=-9):
    v = (v or "").strip()
    try: return int(float(v))
    except ValueError: return default


def load_cow():
    rows = []
    for r in csv.DictReader(open(TC_PATH, newline="", encoding="latin-1")):
        rows.append({"no": num(r["number"]), "year": num(r["year"]), "month": num(r["month"]), "g": num(r["gainer"]),
                     "l": num(r["loser"]), "ent": num(r["entity"]), "area": max(0.0, float(r["area"]) if r["area"].strip(" .") else 0.0),
                     "proc": num(r["procedur"]), "por": num(r["portion"]), "indep": num(r["indep"], 0)})
    return rows


def load_names():
    names = {}
    for r in csv.DictReader(open(STATES_PATH, newline="", encoding="latin-1")):
        names.setdefault(int(r["ccode"]), r["statenme"])
    ent = {}
    try:  # entity list (non-state codes); optional
        txt = subprocess.run(["pdftotext", "-layout", ENT_PATH, "-"], capture_output=True, text=True, timeout=60).stdout
        prev = ""  # long names wrap: the start of the name is on the line before the code
        for line in txt.splitlines():
            m = re.match(r"\s*(\d+)\s+(.+?)\s+(\d{4})\s+(\d{4})\s", line)
            if not m:
                prev = line.strip() if line.strip() and not line.strip().startswith(("Entity", "Number")) else prev
                continue
            name = m.group(2).strip()
            if prev and (name.count(")") > name.count("(") or name.startswith("(")): name = f"{prev} {name}"
            if name.count("(") == name.count(")"): ent.setdefault(int(m.group(1)), name)
            prev = ""
    except (OSError, subprocess.SubprocessError):
        pass
    return names, ent


def gw_to_cow(code, year):
    if code == 340: return 345  # COW codes Serbia as 345 (Yugoslavia) from 1878
    if code == 678 and year >= 1990: return 679
    if code == 260 and year >= 1991: return 255  # united Germany is COW 255 again after 3 October 1990
    if code == 711: return None  # GW Tibet; COW 711 is Manchuria and Tibet is not a COW state
    return code


def cow_link(name, year, kind):
    """(COW code or None, role) for an atlas realm in a year. role: state | colony | faction | micro | none"""
    if name in EXTRA:
        v = EXTRA[name]
        if isinstance(v, list): v = next((c for a, b, c in v if a <= year <= b), None)
        return v, "state"
    if name in EXTRA_COLONIES: return EXTRA_COLONIES[name], "colony"
    if name in EXTRA_FACTIONS: return EXTRA_FACTIONS[name], "faction"
    code, role = CS.link(name, year, kind)
    if code is None: return None, role
    return gw_to_cow(code, year), role


# ---------------------------------------------------------------------------------------------------------------------
# Point lookups
# ---------------------------------------------------------------------------------------------------------------------
def bbox(polys):
    xs = [p[0] for poly in polys for ring in poly for p in ring]
    ys = [p[1] for poly in polys for ring in poly for p in ring]
    return (min(xs), min(ys), max(xs), max(ys)) if xs else None


def inside(polys, x, y):
    """even-odd rule over every ring of every polygon (as check_cshapes.Grid.cells does)"""
    c = False
    for poly in polys:
        for ring in poly:
            n = len(ring)
            for i in range(n):
                x1, y1 = ring[i - 1][0], ring[i - 1][1]
                x2, y2 = ring[i][0], ring[i][1]
                if (y1 > y) != (y2 > y) and x < x1 + (y - y1) * (x2 - x1) / (y2 - y1): c = not c
    return c


class Atlas:
    def __init__(self):
        CS.Y0, CS.Y1 = Y0, Y1  # load_atlas reads these module globals; set before the call (the file is not edited)
        self.pieces = CS.load_atlas()
        for p in self.pieces:
            g = p["geom"]
            if "bbox" not in g: g["bbox"] = bbox(g["polys"])
        self.cache = {}
        # years each COW code is drawn as a state anywhere (for independence dates)
        self.state_years = collections.defaultdict(set)
        self.state_names = collections.defaultdict(collections.Counter)
        for p in self.pieces:
            if not p["geom"]["polys"]: continue
            for y in range(p["a"], p["b"] + 1):
                code, role = cow_link(p["name"], y, p["kind"])
                if code is not None and role == "state":
                    self.state_years[code].add(y); self.state_names[code][p["name"]] += 1
        self.all_codes = set()
        for p in self.pieces:
            for y in (p["a"], p["b"]):
                c, _ = cow_link(p["name"], y, p["kind"])
                if c is not None: self.all_codes.add(c)

    def hits(self, lon, lat):
        key = (lon, lat)
        if key not in self.cache:
            out = []
            for p in self.pieces:
                bb = p["geom"]["bbox"]
                if not bb or not (bb[0] <= lon <= bb[2] and bb[1] <= lat <= bb[3]): continue
                if p["crop"] and not (p["crop"][0] <= lon <= p["crop"][2] and p["crop"][1] <= lat <= p["crop"][3]): continue
                if any(b[0] <= lon <= b[2] and b[1] <= lat <= b[3] for b in p["cuts"]): continue
                if inside(p["geom"]["polys"], lon, lat): out.append(p)
            self.cache[key] = out
        return self.cache[key]

    def at(self, lon, lat, y):
        """(set of COW codes, list of realm names) holding the point in year y"""
        codes, names = set(), []
        for p in self.hits(lon, lat):
            if p["a"] <= y <= p["b"]:
                c, _ = cow_link(p["name"], y, p["kind"])
                if c is not None: codes.add(c)
                if p["name"] not in names: names.append(p["name"])
        return codes, names


# ---------------------------------------------------------------------------------------------------------------------
# Tests
# ---------------------------------------------------------------------------------------------------------------------
def check_point(A, t, lon, lat, W):
    Y, G, L = t["year"], t["g"], t["l"]
    yb, ya = Y - 1, min(Y + 1, Y1)
    hb, nb = A.at(lon, lat, yb)
    ha, na = A.at(lon, lat, ya)
    res = {"yb": yb, "ya": ya, "nb": nb, "na": na, "hb": hb, "ha": ha, "c": None, "err": None}
    lo, hi = max(Y0, Y - W), min(Y1, Y + W)
    loser_known = L in A.all_codes and L not in (G, -9)
    if G in ha:
        c = ya
        while c - 1 >= lo and G in A.at(lon, lat, c - 1)[0]: c -= 1
        res["c"] = c
        if c - 1 < lo:
            res["kind"] = "always"  # the gainer holds it throughout the window: no change shown
            return res
        res["err"] = 0 if c >= Y else c - Y  # negative = the atlas is early
    elif G in hb:  # the atlas has the gainer there before the COW date but not after it: early, then lost again
        c = yb
        while c - 1 >= lo and G in A.at(lon, lat, c - 1)[0]: c -= 1
        res["c"], res["err"], res["lost"] = c, c - Y, True
    elif Y == Y1:  # a 1991 change: the year after is drawn from Natural Earth, outside this check
        res["kind"] = "after 1991"
        return res
    else:
        c = next((y for y in range(ya + 1, hi + 1) if G in A.at(lon, lat, y)[0]), None)
        if c is not None:
            res["c"], res["err"] = c, c - ya  # positive = the atlas is late
        else:
            if not ha: res["kind"] = "blank"
            elif L in ha or ha == hb: res["kind"] = "unchanged"
            else: res["kind"] = "wrong gainer"
            return res
    # the gainer appears: who held it the year before the atlas's change?
    hp, npv = A.at(lon, lat, res["c"] - 1)
    res["hp"], res["np"] = hp, npv
    ok_losers = {L} | LOSER_EQUIV.get(L, set())
    wartime = any(a <= res["c"] - 1 <= b for a, b in WARTIME)
    if loser_known and not (ok_losers & hp) and (hp - {G}) and not wartime and abs(res["err"]) <= 1:
        res["kind"] = "wrong loser"
    elif res["err"] == 0:
        res["kind"] = "match"
    elif abs(res["err"]) == 1:
        res["kind"] = "off by one"
    else:
        res["kind"] = "date"
    return res


def check_indep(A, t, W):
    Y, G = t["year"], t["g"]
    ys = A.state_years.get(G, set())
    ya = min(Y + 1, Y1)
    if Y == Y1 and Y not in ys: return {"kind": "after 1991", "s": None, "err": None}
    if not ys: return {"kind": "never", "s": None, "err": None}
    if ya in ys or Y in ys:
        s = ya if ya in ys else Y
        while s - 1 in ys: s -= 1
        err = 0 if s >= Y else s - Y
    else:
        s = next((y for y in range(ya + 1, Y1 + 1) if y in ys), None)
        if s is None:
            before = [y for y in ys if y < Y]
            return {"kind": "ended", "s": max(before) if before else None, "err": None}
        err = s - ya
    return {"kind": "match" if err == 0 else ("off by one" if abs(err) == 1 else "date"), "s": s, "err": err}


# ---------------------------------------------------------------------------------------------------------------------
# Report helpers
# ---------------------------------------------------------------------------------------------------------------------
def km(v): return f"{v:,.0f}"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--window", type=int, default=25, help="years searched either side of a COW date (default 25)")
    args = ap.parse_args()
    for p in (TC_PATH, STATES_PATH):
        if not os.path.exists(p): raise SystemExit(f"missing {p}: see the Fetch steps in this script's header")
    W = args.window
    names, ent = load_names()

    def nm(code):
        if code in NAME_FIX: return NAME_FIX[code]
        if code is None or code < 0: return "—"
        return names.get(code) or ent.get(code) or f"COW {code}"

    def ent_nm(code):
        if code < 0: return "(no entity)"
        return ent.get(code) or names.get(code) or NAME_FIX.get(code) or f"entity {code}"

    def realms(ns):
        return ", ".join(ns[:3]) + (" …" if len(ns) > 3 else "") if ns else "nothing drawn"

    rows = load_cow()
    A = Atlas()
    print(f"{len(rows)} COW transfers, {len(A.pieces)} atlas pieces {Y0}-{Y1}", flush=True)

    in_range = [t for t in rows if 1816 <= t["year"] <= Y1]
    later = [t for t in rows if t["year"] > Y1]
    counts = collections.Counter()
    results = []  # (t, label, lon, lat, res)
    indeps = []
    for t in sorted(in_range, key=lambda t: (t["year"], t["no"])):
        if t["indep"] == 1: indeps.append((t, check_indep(A, t, W)))
        if 0 in (t["g"], t["l"]) or 1 in (t["g"], t["l"]):
            counts["intl"] += 1; continue
        if t["g"] == t["l"]:
            counts["self"] += 1; continue
        pts = CHANGE_PTS.get(t["no"])
        if pts is None and (t["por"] == 1 or t["indep"] == 1) and t["ent"] in ENTITY_PTS and t["no"] not in SKIP_ENTITY_PT:
            lon, lat = ENTITY_PTS[t["ent"]]
            pts = [(lon, lat, "")]
        if not pts:
            counts["unlocated"] += 1; continue
        if t["g"] not in A.all_codes:
            counts["gainer unmapped"] += 1
        counts["located"] += 1
        for lon, lat, label in pts:
            res = check_point(A, t, lon, lat, W)
            results.append((t, label, lon, lat, res))
    kinds = collections.Counter(r[4]["kind"] for r in results)
    ikinds = collections.Counter(r[1]["kind"] for r in indeps)
    print("points:", dict(kinds), "independence:", dict(ikinds), dict(counts))

    # ---------------------------------------------------------------- report
    L = []
    w = L.append

    def what(t, label):
        e = ent_nm(t["ent"])
        return f"{e}: {label}" if label else e

    def when(t):
        return f"{t['year']}" + (f"-{t['month']:02d}" if 1 <= t["month"] <= 12 else "")

    def side(t):
        return f"{nm(t['g'])} ← {nm(t['l'])}"

    def pt(lon, lat):
        return f"{abs(lat):.2f}°{'N' if lat >= 0 else 'S'} {abs(lon):.2f}°{'E' if lon >= 0 else 'W'}"

    w("# Dated territorial changes cross-checked against Correlates of War (1816–1991)")
    w("")
    w(f"Written by `tools/check_cow.py` on {datetime.date.today().isoformat()}. Read-only: nothing in the atlas was changed.")
    w("")
    w("The Correlates of War (COW) Territorial Change dataset v6 lists every transfer of territory involving at least one "
      "COW state from 1816 to 2018, with the year and month, the gaining and losing entity, the territory's area and "
      "whether it was an independence. It records no shapes, so this report tests *when* the atlas moves a territory "
      "and *to whom*, not where the borders run (for borders see `cshapes-check.md`, 1886–1991).")
    w("")
    w(f"> Source: {CITATION} Data [correlatesofwar.org/data-sets/territorial-change]"
      "(https://correlatesofwar.org/data-sets/territorial-change/); state codes from the COW State System Membership "
      "List v2016 ([correlatesofwar.org](https://correlatesofwar.org/data-sets/state-system-membership/)). This report "
      "carries only figures derived from them; the raw files are not in the repository.")
    w("")
    w("## How it was compared")
    w("")
    w("- Atlas: the border chunks in `public/data/clio/` with `content/corrections.json` and `public/data/supplements.json` "
      "applied, read by `tools/check_cshapes.py`'s `load_atlas()` for 1815–1991. Each realm is mapped to a COW code with "
      "that script's realm → Gleditsch–Ward table (converted where COW differs: Serbia is COW 345, Yemen after 1990 679, "
      "united Germany 255) plus a table in `check_cow.py` for the states that ended before 1886 (Prussia, Sardinia, the "
      "German and Italian states, Mexico's regimes, Texas, Gran Colombia...). A colony counts for its owner.")
    w("- COW: each transfer gets a representative point inside the territory, written by hand: by change number for "
      "partial transfers (Schleswig, Holstein, Alsace, Lorraine, Savoy, Nice, the Oregon Country, Bessarabia...), else by "
      "the entity code for whole units (Texas, Hanover, Bosnia...). Transfers whose territory cannot be placed (\"Russia "
      "gains unnamed land\", small border rectifications) are counted and left out. Points marked *(approx.)* or "
      "*(guess)* stand for a vaguely described territory.")
    w(f"- For each point the atlas is read in every year from {Y0} to {Y1}. A transfer in year Y **matches** if the atlas "
      "first shows the gainer there in Y or Y+1 and the year before that shows the loser. Otherwise it is *early* or "
      f"*late* by the difference, or the atlas never shows the gainer there within {W} years (*missing*), or shows a "
      "third state (*wrong gainer*), or shows the gainer taking it from a state other than the COW loser (*wrong loser*; "
      "only tested when the loser is a state the atlas draws, the dates agree within a year, and the year before is not "
      "in 1914–1920 or 1938–1945, when the atlas rightly draws occupiers; COW's Austria and Hungary count as the "
      "atlas's Austria-Hungary).")
    w("- Independences (indep = 1): the first year the atlas draws the new state anywhere (as a state, not a colony) is "
      "compared with the COW year.")
    w("- COW dates a change to its treaty (or the end of fighting, a plebiscite or an act of annexation), and codes "
      "protectorates and occupations as transfers. Many differences below are those conventions; the verdicts in "
      "section 0 say which.")
    w("")
    nloc = counts["located"]
    w("## Summary")
    w("")
    w(f"- COW transfers 1816–1991: {len(in_range)} (and {len(later)} from 1992 to 2018, not tested: the atlas draws "
      "Natural Earth borders from 1992).")
    w(f"- Located and tested: {nloc} transfers ({len(results)} points); not located: {counts['unlocated']}; to or from the "
      f"League of Nations / UN, not tested: {counts['intl']}; a state transferring to itself (UAE federation): {counts['self']}.")
    w(f"- Of the {len(results)} points: {kinds['match']} match, {kinds['off by one']} are one year off, "
      f"{kinds['date']} differ by 2 years or more, {kinds['unchanged'] + kinds['blank']} never show the change "
      f"({kinds['unchanged']} with no change drawn, {kinds['blank']} with nothing drawn), {kinds['always']} show the "
      f"gainer holding the point throughout, {kinds['wrong gainer']} give it to a third state, {kinds['wrong loser']} "
      f"show the gainer taking it from someone other than the COW loser, and {kinds['after 1991']} are 1991 changes "
      "whose year after falls in the Natural Earth period.")
    big_dates = [r for r in results if r[4]["kind"] == "date"]
    snap = sum(1 for r in big_dates if r[4]["c"] % 5 == 0)
    w(f"- Of the {len(big_dates)} differences of 2+ years, {snap} have the atlas switching in a year ending in 0 or 5 "
      f"(about {round(len(big_dates) / 5)} would by chance): many come from the decade or half-decade snapshots the "
      "atlas's base layer (Cliopatria) is built from, which move a border to the next snapshot year.")
    w(f"- Independences: {len(indeps)}; the atlas starts the new state in the COW year (or the next) for "
      f"{ikinds['match']}, one year off for {ikinds['off by one']}, 2+ years off for {ikinds['date']}, never draws it as "
      f"a state for {ikinds['never']}, drew it only before the COW date for {ikinds['ended']}, and {ikinds['after 1991']} "
      "are 1991 independences (the state appears with the Natural Earth borders of 1992).")
    w("")
    w("## 0. Hand-checked top findings")
    w("")
    w("The five largest date errors in section 1 (ties broken by area), plus the largest-area items from sections 1, "
      "3 and 4 that are not plainly a COW coding convention, each checked against a fetched source. *Atlas error*: the "
      "atlas is wrong by the historical record. *COW coding*: the atlas is right and COW's date or parties are a "
      "convention or a slip. *Ambiguous*: both are defensible readings.")
    w("")
    w("Fixed on 2026-11-13 in content/borders/patches.json and content/corrections.json: Kaiser-Wilhelmsland and "
      "Papua (papua-new-guinea-australian), Kuwait and Qatar (kuwait-qatar-not-omani), East Upper Silesia "
      "(east-upper-silesia-1922-1939), Luxembourg (luxembourg-not-dutch), Mahdist Sudan (mahdist-state-1885), Papua "
      "New Guinea before 1975 (relabelled as Australia) and Somaliland 1950-59 (somaliland-trust-territory-1950-1959); "
      "the verdicts below are kept as found.")
    w("")
    w("| # | Finding | COW | Atlas | Source checked | Verdict |")
    w("|---|---|---|---|---|---|")
    for i, v in enumerate(VERIFIED, 1):
        w(f"| {i} | {v['finding']} | {v['cow']} | {v['atlas']} | {v['source']} | **{v['verdict']}**: {v['why']} |")
    w("")

    def big(r): return -r[0]["area"]

    # ---- 1. date mismatches
    dates = [r for r in results if r[4]["kind"] in ("date", "off by one") and r[4]["err"]]
    dates.sort(key=lambda r: (-abs(r[4]["err"]), -r[0]["area"]))
    w("## 1. Date mismatches (2 years or more)")
    w("")
    w("The atlas shows the gainer taking the point, but in another year. *Error* = atlas year − COW year (negative: "
      "the atlas is early). Largest error first, then largest area. One-year differences are counted, not listed.")
    w("")
    w("| # | COW year | No. | Territory (point) | Gainer ← loser | km² | Atlas before (year) | Atlas after (year) | Atlas change | Error |")
    w("|---|---|---|---|---|---|---|---|---|---|")
    i = 0
    for t, label, lon, lat, res in dates:
        if abs(res["err"]) < 2: continue
        i += 1
        w(f"| {i} | {when(t)} | {t['no']} | {what(t, label)} ({pt(lon, lat)}) | {side(t)} | {km(t['area'])} | "
          f"{realms(res.get('np', []))} ({res['c'] - 1}) | {realms(res['na'])} ({res['ya']}) | {res['c']}"
          f"{' (lost again)' if res.get('lost') else ''} | {res['err']:+d} |")
    w("")
    w(f"{sum(1 for r in dates if abs(r[4]['err']) == 1)} one-year differences not listed.")
    w("")
    w("### Same rows ranked by area")
    w("")
    w("| # | COW year | Territory | Gainer ← loser | km² | Error |")
    w("|---|---|---|---|---|---|")
    for i, (t, label, lon, lat, res) in enumerate(sorted([r for r in dates if abs(r[4]["err"]) >= 2], key=big)[:30], 1):
        w(f"| {i} | {when(t)} | {what(t, label)} | {side(t)} | {km(t['area'])} | {res['err']:+d} |")
    w("")

    # ---- 2. missing
    miss = [r for r in results if r[4]["kind"] in ("unchanged", "blank", "always")]
    miss.sort(key=big)
    w("## 2. Changes the atlas never shows")
    w("")
    w(f"Within {W} years either side the atlas never shows the gainer arriving at the point. *unchanged*: the holder "
      "is the same before and after (often the loser, still drawn: a protectorate or suzerainty COW counts as a "
      "transfer); *blank*: nothing is drawn there after; *always*: the gainer already holds the point through the whole "
      "window (the atlas shows the change earlier, or COW codes a formal cession of land already held). Largest first.")
    w("")
    w("| # | COW year | No. | Territory (point) | Gainer ← loser | km² | Atlas before (year) | Atlas after (year) | Kind |")
    w("|---|---|---|---|---|---|---|---|---|")
    small = [r for r in miss if r[0]["area"] < 2500]
    for i, (t, label, lon, lat, res) in enumerate([r for r in miss if r[0]["area"] >= 2500], 1):
        w(f"| {i} | {when(t)} | {t['no']} | {what(t, label)} ({pt(lon, lat)}) | {side(t)} | {km(t['area'])} | "
          f"{realms(res['nb'])} ({res['yb']}) | {realms(res['na'])} ({res['ya']}) | {res['kind']} |")
    w("")
    w(f"{len(small)} more under 2,500 km² (mostly islands the atlas does not draw at all): "
      + "; ".join(f"{when(t)} {what(t, label)} ({nm(t['g'])} ← {nm(t['l'])}, {res['kind']})" for t, label, lon, lat, res in small)
      + ".")
    w("")

    # ---- 3. wrong side
    wrong = [r for r in results if r[4]["kind"] in ("wrong gainer", "wrong loser")]
    wrong.sort(key=big)
    w("## 3. Wrong gainer or loser")
    w("")
    w("*wrong gainer*: after the COW date the atlas gives the point to a state other than the COW gainer (and never to "
      f"the gainer within {W} years). *wrong loser*: the atlas shows the gainer arriving, but the year before it shows a "
      "state other than the COW loser. Largest first.")
    w("")
    w("| # | COW year | No. | Territory (point) | Gainer ← loser | km² | Atlas before (year) | Atlas after (year) | Kind | Atlas change |")
    w("|---|---|---|---|---|---|---|---|---|---|")
    for i, (t, label, lon, lat, res) in enumerate(wrong, 1):
        if res["kind"] == "wrong loser":
            before, by = res["np"], res["c"] - 1
            after, ay = A.at(lon, lat, res["c"])[1], res["c"]
        else:
            before, by, after, ay = res["nb"], res["yb"], res["na"], res["ya"]
        ch = f"{res['c']} ({res['err']:+d})" if res.get("c") else "—"
        w(f"| {i} | {when(t)} | {t['no']} | {what(t, label)} ({pt(lon, lat)}) | {side(t)} | {km(t['area'])} | "
          f"{realms(before)} ({by}) | {realms(after)} ({ay}) | {res['kind']} | {ch} |")
    w("")

    # ---- 4. independence
    w("## 4. Independence dates")
    w("")
    w("COW transfers with indep = 1, against the first year the atlas draws a realm linked to the new state (anywhere, "
      "as a state). *Error* = atlas year − COW year. A start year of 1815 means the atlas draws it from before 1816. "
      "Largest error first; one-year differences counted, not listed.")
    w("")
    w("| # | COW year | No. | New state | From | km² | Atlas draws it as | Atlas from | Error |")
    w("|---|---|---|---|---|---|---|---|---|")
    ind_rows = [(t, r) for t, r in indeps if r["kind"] in ("date", "never", "ended")]
    late91 = [t for t, r in indeps if r["kind"] == "after 1991"]
    ind_rows.sort(key=lambda x: (-(abs(x[1]["err"]) if x[1]["err"] is not None else 999), -x[0]["area"]))
    for i, (t, r) in enumerate(ind_rows, 1):
        an = ", ".join(n for n, _ in A.state_names[t["g"]].most_common(2)) or "—"
        if r["kind"] == "never": frm, err = "never", "—"
        elif r["kind"] == "ended": frm, err = f"only until {r['s']}" if r["s"] else "—", "—"
        else: frm, err = (f"{r['s']}" + (" (≤1815)" if r["s"] == Y0 else "")), f"{r['err']:+d}"
        w(f"| {i} | {when(t)} | {t['no']} | {nm(t['g'])} | {nm(t['l'])} | {km(t['area'])} | {an} | {frm} | {err} |")
    w("")
    w(f"{ikinds['off by one']} one-year differences not listed. Not tested (independent from late 1991, drawn from 1992 "
      "with Natural Earth): " + ", ".join(nm(t["g"]) for t in late91) + ".")
    w("")

    # ---- 5. not located
    w("## 5. Not tested")
    w("")
    nl = [t for t in in_range if not (0 in (t["g"], t["l"]) or 1 in (t["g"], t["l"]) or t["g"] == t["l"])
          and t["no"] not in CHANGE_PTS and not ((t["por"] == 1 or t["indep"] == 1) and t["ent"] in ENTITY_PTS
                                                and t["no"] not in SKIP_ENTITY_PT)]
    nl.sort(key=lambda t: -t["area"])
    w(f"{len(nl)} transfers have no point (partial transfers with no named territory, or too small to place). The "
      "largest:")
    w("")
    w("| COW year | No. | Entity | Gainer ← loser | km² |")
    w("|---|---|---|---|---|")
    for t in nl[:25]:
        w(f"| {when(t)} | {t['no']} | {ent_nm(t['ent'])} | {side(t)} | {km(t['area'])} |")
    w("")
    w(f"Transfers from 1992 to 2018 ({len(later)}, e.g. the break-up of Yugoslavia and Czechoslovakia, Eritrea, Hong "
      "Kong and Macau, South Sudan, Crimea) are not tested: the atlas draws Natural Earth's present-day borders from 1992.")
    w("")
    w("## Limits")
    w("")
    w("- One point stands for a whole territory, so a transfer the atlas draws for most but not all of the territory may "
      "still match or miss depending on where the point falls.")
    w("- Realm → COW links are by name and written by hand (here and in `check_cshapes.py`).")
    w("- COW codes protectorates (Tunisia 1881, Korea 1905, the Malay and Gulf states), wartime conquests confirmed later, "
      "and League/UN administration as transfers; the atlas mostly draws the protected state until annexation.")
    w("- COW's own sources (Langer's *Encyclopedia of World History*, Palmer's *Historical Atlas*) date some colonial "
      "acquisitions to a single proclamation for what was a long, piecemeal conquest.")
    w("")
    open(OUT, "w").write("\n".join(L))
    print("wrote", os.path.relpath(OUT, ROOT))


if __name__ == "__main__":
    main()
