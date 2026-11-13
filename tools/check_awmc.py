#!/usr/bin/env python3
"""Cross-check the atlas's ancient borders against the Ancient World Mapping Center geodata (read-only; writes a report,
changes no data).

The Ancient World Mapping Center (AWMC, University of North Carolina) publishes the vector layers behind its maps, drawn
from the Barrington Atlas of the Greek and Roman World. Its political_shading folder has ten layers; none of them carries
a date or a name in its attributes, so the year each one stands for is read from the layer's name (and, for the late
provinces, from the 314 extent that ships with them in the AWMC shapefile archive):

  roman_empire_bce_60                 Roman provinces in 60 BCE (extent)                       compared in -60
  roman_empire_ce_117_extent          the empire at Trajan's death, 117 CE                     compared in 117
  roman_empire_ce_200_extent          the empire under Septimius Severus, c. 200 CE            compared in 200
  roman_empire_ce_200_provinces       province boundaries c. 200 CE (lines; filled here)       compared in 200
  roman_empire_provinces post_diocletian  province boundaries after Diocletian (lines), with
                                      the extent "roman_empire_diocletian_and_Constantine_314"
                                      from Cultural Shapefiles Apr 2024.zip                    compared in 314
  senatorial_province                 the senate's provinces under Augustus                    compared in 14
  alexanders_empire                   Alexander's empire at his death, 323 BCE                 compared in -323
  persian_extent                      the Achaemenid empire at its height (Thrace and the
                                      Danube to the Indus: Darius I, before 480 BCE)           compared in -500
  hasmonean                           the Hasmonean kingdom at its height (Alexander Jannaeus,
                                      d. 76 BCE)                                               compared in -78
  herod                               Herod the Great's kingdom at his death, 4 BCE            compared in -4

  atlas  public/data/clio/*.json with content/corrections.json and public/data/supplements.json applied, read by
         load_atlas() in tools/check_cshapes.py (imported, not copied). A realm counts in year Y if f <= Y <= t.

Both are rasterised onto one grid (default 0.1 degrees, cell centres, even-odd rule, spherical cell areas; helpers from
check_cshapes.py) and clipped to land (the base-map land polygons of the nearest era in public/data/<year>.json). For
each layer the script reports, in the layer's year:

  1. areas: AWMC area, atlas area of the matching realm, shared area, overlap (intersection over union), the share of
     AWMC's area the atlas covers and the share of the atlas realm that lies inside AWMC's shape
  2. disagreements: land AWMC includes that the atlas gives to another realm or leaves blank, and land the atlas
     includes that AWMC leaves out, merged into contiguous blocks (8-neighbour), named from a gazetteer of ancient
     regions and provinces in this script, and ranked by area; thin strips along a shared border are filed as slivers
  3. dates: the same overlap for the atlas a few years either side (every year the atlas changes the realm's shape
     within +-50 years, plus fixed offsets), to tell a date offset from a shape error
  4. provinces (the two line layers): the lines are rasterised as barriers and the extent is flood-filled into
     provinces, which are named from reference points (capitals) in this script; then, per province, the share the
     atlas draws as Roman and what it draws instead

Output: content/factcheck/awmc-check.md
Run:    python3 -I tools/check_awmc.py [--res 0.1] [--min-area 2000]

Source: Ancient World Mapping Center, geodata (ODbL 1.0), https://github.com/AWMC/geodata . The layers derive from the
Barrington Atlas of the Greek and Roman World (ed. R. J. A. Talbert, Princeton 2000) and AWMC edits to OpenStreetMap
data. The clone stays in data/awmc/ (gitignored); the report carries only derived figures and names, with this credit.
Fetch:  git clone --depth 1 https://github.com/AWMC/geodata.git data/awmc
"""
import argparse, collections, datetime, glob, json, math, os, struct, sys, time, zipfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "tools"))
import check_cshapes as cs  # noqa: E402  (load_atlas, Grid, polys_of, km)

AWMC = os.path.join(ROOT, "data", "awmc")
PS = os.path.join(AWMC, "Cultural-Data", "political_shading")
ZIP = os.path.join(AWMC, "Cultural Shapefiles Apr 2024.zip")
OUT = os.path.join(ROOT, "content", "factcheck", "awmc-check.md")
CREDIT = "Ancient World Mapping Center, geodata (ODbL 1.0), https://github.com/AWMC/geodata"
ROME = ["Roman Republic", "Roman Empire"]

# ---------------------------------------------------------------------------------------------------------------------
# Layers. year = the year the layer stands for (BCE negative, as in the atlas); realms = atlas realms it is compared with.
# ---------------------------------------------------------------------------------------------------------------------
LAYERS = [
    {"id": "roman_empire_bce_60", "path": "roman_empire_bce_60/roman_empire_bce_60.geojson", "year": -60,
     "title": "Roman Republic, 60 BCE", "realms": ROME, "names": "roman",
     "why": "the layer's name; the shape has Gallia Narbonensis but not Caesar's Gaul (58–50 BCE), and Pompey's eastern "
            "provinces (Syria, Pontus, 64–63 BCE)"},
    {"id": "roman_empire_ce_117_extent", "path": "roman_empire_ce_117_extent/roman_empire_ce_117_extent.geojson",
     "year": 117, "title": "Roman Empire, 117 CE", "realms": ROME, "names": "roman",
     "why": "the layer's name: the empire at Trajan's death (August 117)"},
    {"id": "roman_empire_ce_200_extent", "path": "roman_empire_ce_200_extent/roman_empire_ce_200_extent.geojson",
     "year": 200, "title": "Roman Empire, 200 CE", "realms": ROME, "names": "roman",
     "why": "the layer's name: the empire under Septimius Severus, after his province of Mesopotamia (198)"},
    {"id": "roman_empire_ce_200_provinces", "path": "roman_empire_ce_200_provinces/roman_empire_ce_200_provinces.geojson",
     "lines": True, "extent": ("geojson", "roman_empire_ce_200_extent/roman_empire_ce_200_extent.geojson"),
     "year": 200, "title": "Roman provinces, 200 CE", "realms": ROME, "names": "roman", "provinces": "P200",
     "why": "the layer's name; boundary lines only, filled here inside the 200 CE extent"},
    {"id": "post_diocletian", "path": "roman_empire_provinces post_diocletian/roman_empire_provinces post_diocletian.geojson",
     "lines": True, "extent": ("zip", "political_shading/roman_empire_ad_200_extent/"
                                      "roman_empire_diocletian_and_Constantine_314_extent.shp"),
     "year": 314, "title": "Roman provinces after Diocletian, c. 314 CE", "realms": ROME, "names": "roman",
     "provinces": "P314",
     "why": "boundary lines only; AWMC ships them with an extent named \"Diocletian and Constantine 314\" (in the "
            "shapefile archive), which is used as the outline here, so the year compared is 314"},
    {"id": "senatorial_province", "path": "senatorial_province/roman_senatorial_provinces.geojson", "year": 14,
     "title": "Senatorial provinces under Augustus (14 CE)", "realms": ROME, "names": "roman", "subset": True,
     "why": "the provinces governed by proconsuls for the senate after 27 BCE; the shape has Cyprus and Narbonensis "
            "(senatorial from 22 BCE) and not Illyricum (imperial from 11 BCE), so it fits the end of Augustus' reign"},
    {"id": "alexanders_empire", "path": "alexanders_empire/alexanders_empire.geojson", "year": -323,
     "title": "Alexander's empire, 323 BCE", "realms": ["Macedonian Empire"], "names": "east",
     "why": "the empire at Alexander's death (June 323 BCE): Macedonia and Thrace to the Indus"},
    {"id": "persian_extent", "path": "persian_extent/extent_of_the_persian_empire.geojson", "year": -500,
     "title": "Achaemenid Persian Empire at its height (c. 500 BCE)", "realms": ["Achaemenid Empire"], "names": "east",
     "why": "the layer gives only \"extent\"; it has Thrace, Egypt and the Indus, i.e. Darius I between the Scythian "
            "campaign (c. 513 BCE) and the loss of Thrace after 479 BCE, so 500 BCE is compared"},
    {"id": "hasmonean", "path": "hasmonean/hasmonean_kingdom.geojson", "year": -78,
     "title": "Hasmonean kingdom at its height (Alexander Jannaeus, d. 76 BCE)", "realms": ["Judea"], "names": "east",
     "why": "the kingdom's largest extent, reached under Alexander Jannaeus (103–76 BCE); 78 BCE is the last year of "
            "the atlas's -91…-78 shape before his death"},
    {"id": "herod", "path": "herod/herods_kingdom.geojson", "year": -4,
     "title": "Herod's kingdom at his death (4 BCE)", "realms": ["Judea"], "names": "east",
     "why": "Herod's kingdom after Augustus added Trachonitis, Batanea, Auranitis (23 BCE) and Gaulanitis/Panias "
            "(20 BCE); it was divided at his death in 4 BCE"},
]
OFFSETS = (-50, -25, -10, -5, -2, -1, 0, 1, 2, 5, 10, 25, 50)

# ---------------------------------------------------------------------------------------------------------------------
# Gazetteer: (name, lon, lat). Used to name disagreement blocks (the points inside a block, else the nearest one).
# ---------------------------------------------------------------------------------------------------------------------
REGIONS = [
    # Europe
    ("Britannia (southern Britain)", -1.0, 52.0), ("northern Britain (Brigantes)", -2.0, 54.5),
    ("southern Scotland (between the Walls)", -3.3, 55.6), ("Caledonia (Scotland)", -4.0, 56.8), ("Hibernia (Ireland)", -8.0, 53.3), ("Armorica (Brittany)", -3.0, 48.2),
    ("Aquitania", 0.3, 45.3), ("Gallia Narbonensis", 4.0, 43.6), ("Gallia Lugdunensis", 1.5, 47.8),
    ("Gallia Belgica", 4.0, 49.6), ("Germania Inferior (Rhineland)", 6.5, 51.0), ("Agri Decumates", 8.8, 48.6),
    ("Germania Superior", 7.5, 48.0), ("Germania Magna", 10.5, 52.0), ("Frisia", 6.0, 53.0), ("Bohemia", 14.5, 49.8),
    ("Raetia", 10.5, 47.8), ("Noricum", 14.0, 47.3), ("Pannonia", 18.0, 46.5), ("Dalmatia", 17.0, 43.8),
    ("Illyria (Albania)", 19.8, 41.3), ("Epirus", 20.8, 39.6), ("Macedonia", 22.3, 40.9), ("Thessaly", 22.3, 39.5),
    ("Achaea (Greece)", 22.4, 37.8), ("Thrace", 25.5, 42.2), ("Moesia (Danube plain)", 24.5, 43.5),
    ("Scythia Minor (Dobruja)", 28.5, 44.4), ("Dacia (Transylvania)", 23.8, 46.0), ("Oltenia", 23.5, 44.4),
    ("Wallachia", 26.0, 44.7), ("Moldavia", 27.3, 47.0), ("Pontic steppe (Scythia)", 32.0, 47.0),
    ("Tauric Chersonese (Crimea)", 34.0, 45.0), ("Sarmatia (Hungarian plain, Iazyges)", 20.0, 46.6),
    ("Italia", 12.5, 42.5), ("Gallia Cisalpina (Po valley)", 10.0, 45.2), ("Transpadana (Alpine foothills)", 9.5, 45.9), ("Alpes", 7.5, 45.8), ("Sicilia", 14.2, 37.5),
    ("Sardinia", 9.0, 40.0), ("Corsica", 9.1, 42.1), ("Baleares", 3.0, 39.6), ("Lusitania", -7.0, 39.0),
    ("Baetica", -5.0, 37.5), ("Hispania Tarraconensis (Ebro)", -0.5, 41.5), ("Celtiberia (Meseta)", -3.5, 40.5),
    ("Gallaecia", -8.0, 42.5), ("Asturia and Cantabria", -5.0, 43.1), ("Carthaginiensis (Murcia)", -1.5, 38.3),
    # North Africa
    ("Mauretania Tingitana (northern Morocco)", -5.5, 34.5), ("Mauretania Caesariensis (Algeria)", 2.0, 35.5),
    ("Numidia", 6.5, 35.8), ("Africa (Tunisia)", 9.8, 35.8), ("Tripolitania", 13.5, 32.0),
    ("Gaetulia (pre-Saharan Algeria)", 4.0, 33.5), ("Hodna and Zab (Gemellae)", 5.2, 34.8),
    ("Tripolitanian pre-desert (Gheriat, Bu Njem)", 14.2, 30.7), ("Phazania (Fezzan)", 14.0, 26.5), ("Syrtica", 17.5, 30.8),
    ("Cyrenaica", 21.9, 32.5), ("Marmarica", 25.5, 31.2), ("Siwa oasis (Ammon)", 25.5, 29.2),
    ("Western Desert oases", 28.5, 26.5), ("Lower Egypt (Delta)", 31.0, 30.7), ("Middle Egypt", 30.8, 28.0),
    ("Upper Egypt (Thebaid)", 32.6, 25.7), ("Eastern Desert of Egypt", 33.5, 26.5), ("Lower Nubia", 32.8, 22.5),
    ("Kush (Meroe)", 33.0, 18.0), ("Crete", 24.9, 35.2), ("Cyprus", 33.2, 35.0),
    # Anatolia
    ("Asia (western Anatolia)", 27.8, 38.5), ("Caria", 28.2, 37.3), ("Lycia", 29.7, 36.5), ("Pamphylia", 30.9, 37.0),
    ("Pisidia", 30.9, 37.9), ("Phrygia", 30.5, 39.0), ("Bithynia", 30.0, 40.5), ("Paphlagonia", 33.7, 41.3),
    ("Pontus", 36.5, 40.5), ("Galatia", 32.9, 39.5), ("Lycaonia", 33.0, 37.9), ("Isauria", 33.0, 36.9),
    ("Cilicia", 35.0, 37.0), ("Cappadocia", 35.5, 38.6), ("Armenia Minor", 38.3, 39.8), ("Commagene", 38.3, 37.8),
    ("Hellespont (Troad)", 26.8, 39.8), ("Colchis (western Georgia)", 42.0, 42.2), ("Lazica (Trabzon coast)", 40.0, 40.9),
    # Levant and Arabia
    ("Syria (Antioch)", 36.5, 36.0), ("Syria (Euphrates bend)", 38.5, 36.3), ("Phoenicia (Lebanon coast)", 35.5, 33.9),
    ("Damascene", 36.3, 33.5), ("Palmyrene (Syrian desert)", 38.3, 34.6), ("Ituraea (Beqaa)", 36.0, 33.8),
    ("Galilee", 35.4, 32.85), ("Samaria", 35.2, 32.25), ("Judaea (Jerusalem)", 35.2, 31.78), ("Idumaea", 35.0, 31.3),
    ("Peraea", 35.7, 31.9), ("Gaulanitis (Golan)", 35.75, 32.95), ("Batanaea and Trachonitis", 36.35, 32.95),
    ("Auranitis (Hauran)", 36.55, 32.55), ("Decapolis", 35.95, 32.45), ("Philistine coast (Gaza)", 34.45, 31.5),
    ("Coastal plain (Joppa, Caesarea)", 34.85, 32.3), ("Moab", 35.75, 31.35), ("Negev", 34.8, 30.6),
    ("Nabataea (Petra)", 35.45, 30.4), ("Sinai", 33.8, 29.6), ("Hejaz (north-west Arabia)", 37.5, 27.5),
    ("north Arabian desert", 39.5, 30.5), ("Dumat (Jawf)", 39.9, 29.8), ("Tayma", 38.5, 27.6),
    # Mesopotamia, Caucasus, Iran
    ("Osrhoene (Edessa)", 38.8, 37.1), ("Mesopotamia (Nisibis, Khabur)", 41.0, 36.8), ("Singara (Jebel Sinjar)", 41.8, 36.3),
    ("Sophene (upper Tigris)", 40.5, 38.6), ("Armenia", 44.0, 39.8), ("Iberia (eastern Georgia)", 44.8, 41.8),
    ("Caucasian Albania (Azerbaijan)", 47.5, 40.8), ("Adiabene (Assyria)", 43.8, 36.3), ("Babylonia", 44.4, 32.5),
    ("Mesene (Characene)", 47.0, 30.8), ("Media Atropatene (Azerbaijan, Iran)", 47.0, 37.8), ("Media", 48.5, 34.8),
    ("Elymais and Susiana (Khuzestan)", 48.6, 32.0), ("Persis (Fars)", 53.0, 29.7), ("Carmania (Kerman)", 57.0, 29.5),
    ("Hyrcania (Gorgan)", 54.4, 36.8), ("Parthia (Khorasan)", 58.5, 37.0), ("Margiana (Merv)", 61.8, 37.6),
    ("Aria (Herat)", 62.2, 34.3), ("Drangiana (Sistan)", 61.7, 31.0), ("Arachosia (Kandahar)", 65.7, 31.6),
    ("Gedrosia (Makran)", 63.0, 26.3), ("Paropamisadae (Kabul)", 69.0, 34.6), ("Bactria (Balkh)", 67.0, 36.7),
    ("Sogdiana (Samarkand)", 66.9, 39.6), ("Ustrushana and Ferghana", 70.5, 40.4), ("Chorasmia (Khwarazm)", 60.5, 41.8),
    ("Saka lands beyond the Jaxartes (Syr Darya)", 68.5, 43.5), ("Kyzylkum desert", 63.5, 42.0),
    ("Karakum desert", 59.5, 39.0), ("Gandhara (Peshawar)", 71.7, 34.0), ("Punjab (Taxila)", 73.0, 33.0),
    ("Punjab (Lahore)", 74.2, 31.3), ("Sindh (lower Indus)", 68.5, 26.0), ("Thar desert", 71.5, 27.0),
    ("Pamir and Badakhshan", 72.0, 37.5), ("Kashgaria (Tarim Basin, west)", 76.5, 39.0),
    ("Khotan (Tarim Basin, south)", 80.5, 37.0), ("Tarim Basin (east)", 85.0, 38.5), ("Kashmir", 75.0, 34.2),
    ("Persian Gulf coast (Bahrain, Hasa)", 50.0, 26.0), ("Oman", 57.5, 22.5), ("central Arabia (Najd)", 45.0, 25.0),
]
# Province reference points (capitals or centres) for naming the filled provinces. A province may have several points.
P200 = [
    ("Britannia", -0.1, 51.5), ("Britannia", -1.08, 53.96), ("Gallia Lugdunensis", 0.69, 47.39),
    ("Gallia Lugdunensis", -1.5, 48.0), ("Aquitania", -0.58, 44.84), ("Aquitania", 1.4, 45.8),
    ("Gallia Narbonensis", 3.0, 43.18), ("Gallia Narbonensis", 4.36, 43.84), ("Gallia Belgica", 4.03, 49.26),
    ("Germania Inferior", 6.96, 50.94), ("Germania Superior", 8.27, 50.0), ("Germania Superior", 6.02, 47.24),
    ("Alpes Maritimae", 6.9, 44.0), ("Alpes Cottiae", 7.03, 45.14), ("Alpes Graiae et Poeninae", 7.07, 46.1),
    ("Raetia", 10.9, 48.37), ("Noricum", 14.37, 46.7), ("Pannonia Superior", 16.87, 48.1),
    ("Pannonia Inferior", 19.05, 47.56), ("Dalmatia", 16.48, 43.54), ("Moesia Superior", 21.2, 44.73),
    ("Moesia Inferior", 27.6, 43.3), ("Dacia", 22.79, 45.51), ("Dacia", 23.57, 46.07), ("Dacia", 24.4, 44.1),
    ("Thracia", 24.75, 42.15), ("Macedonia", 22.94, 40.64), ("Epirus", 20.73, 39.3), ("Achaea", 22.88, 37.9),
    ("Italia", 12.5, 41.9), ("Italia", 10.0, 45.3), ("Sicilia", 14.5, 37.4), ("Sardinia", 9.11, 39.6),
    ("Corsica", 9.2, 42.1), ("Hispania Tarraconensis", 1.25, 41.12), ("Hispania Tarraconensis", -4.0, 41.5),
    ("Baetica", -4.78, 37.88), ("Lusitania", -6.34, 38.92), ("Mauretania Tingitana", -5.55, 34.07),
    ("Mauretania Caesariensis", 2.19, 36.3), ("Numidia", 6.26, 35.49), ("Africa Proconsularis", 10.32, 36.6),
    ("Africa Proconsularis", 13.5, 32.3), ("Creta et Cyrenaica", 21.86, 32.6), ("Creta et Cyrenaica", 24.95, 35.1),
    ("Aegyptus", 31.25, 29.85), ("Aegyptus", 32.6, 25.7), ("Arabia Petraea", 36.48, 32.52),
    ("Arabia Petraea", 35.44, 30.33), ("Syria Palaestina", 35.23, 31.78), ("Syria Phoenice", 36.3, 33.5),
    ("Syria Coele", 36.6, 36.0), ("Mesopotamia", 41.22, 37.07), ("Osrhoene", 38.79, 37.15), ("Cyprus", 33.2, 35.0),
    ("Cilicia", 34.9, 36.92), ("Lycia et Pamphylia", 30.5, 36.8), ("Galatia", 32.86, 39.93), ("Cappadocia", 35.48, 38.72),
    ("Asia", 27.8, 38.5), ("Bithynia et Pontus", 30.4, 40.5), ("Bithynia et Pontus", 35.15, 41.8),
]
P314 = [  # Laterculus Veronensis (c. 314), by diocese
    # Oriens
    ("Libya Superior", 21.0, 32.4), ("Libya Inferior", 27.2, 31.0), ("Thebais", 32.6, 25.7), ("Thebais", 30.8, 27.8),
    ("Aegyptus Iovia", 29.9, 30.9), ("Aegyptus Herculia", 32.0, 30.5), ("Arabia", 36.5, 32.4),
    ("Arabia Nova (Petra)", 35.45, 30.3), ("Palaestina", 35.0, 32.0), ("Phoenice", 35.6, 33.8),
    ("Syria Coele", 36.6, 36.0), ("Augusta Euphratensis", 38.0, 36.6), ("Cilicia", 34.9, 37.0),
    ("Isauria", 33.4, 36.8), ("Cyprus", 33.2, 35.0), ("Mesopotamia", 40.8, 37.4), ("Osrhoene", 38.9, 36.9),
    # Pontica
    ("Bithynia", 30.2, 40.6), ("Cappadocia", 35.5, 38.7), ("Galatia", 32.9, 39.9), ("Paphlagonia", 33.6, 41.2),
    ("Diospontus", 35.8, 40.9), ("Pontus Polemoniacus", 38.0, 40.6), ("Armenia Minor", 38.0, 39.2),
    # Asiana
    ("Lycia et Pamphylia", 30.5, 36.7), ("Phrygia Prima", 29.3, 38.3), ("Phrygia Secunda", 31.0, 39.0),
    ("Asia", 27.4, 38.0), ("Lydia", 28.2, 38.6), ("Caria", 28.6, 37.4), ("Insulae", 28.1, 36.3),
    ("Pisidia", 31.5, 38.0), ("Hellespontus", 27.5, 40.0),
    # Thracia
    ("Europa", 28.0, 41.2), ("Rhodope", 25.4, 41.1), ("Thracia", 24.9, 42.2), ("Haemimontus", 26.8, 42.1),
    ("Scythia", 28.5, 44.3), ("Moesia Inferior", 27.0, 43.4),
    # Moesiae
    ("Dacia Ripensis", 23.0, 43.7), ("Dacia Mediterranea", 23.3, 42.7), ("Moesia Superior (Margensis)", 21.2, 44.5),
    ("Dardania", 21.2, 42.5), ("Macedonia", 22.9, 40.7), ("Thessalia", 22.3, 39.5), ("Achaea", 22.5, 37.7),
    ("Praevalitana", 19.4, 42.4), ("Epirus Nova", 19.9, 41.0), ("Epirus Vetus", 20.7, 39.4), ("Creta", 24.9, 35.2),
    # Pannoniae
    ("Pannonia Secunda", 19.3, 45.1), ("Savia", 16.4, 45.4), ("Dalmatia", 17.0, 43.6), ("Valeria", 18.6, 46.5),
    ("Pannonia Prima", 16.6, 47.3), ("Noricum Ripense", 14.5, 48.1), ("Noricum Mediterraneum", 14.2, 46.8),
    # Britanniae (the AWMC layer draws no internal lines in Britain)
    ("Britanniae", -1.0, 52.5),
    # Galliae
    ("Belgica Prima", 6.4, 49.5), ("Belgica Secunda", 3.5, 49.8), ("Germania Prima", 8.0, 49.5),
    ("Germania Secunda", 6.5, 51.0), ("Sequania", 6.2, 47.2), ("Lugdunensis Prima", 4.3, 46.8),
    ("Lugdunensis Secunda", 0.5, 49.0), ("Lugdunensis (Tertia)", -1.0, 47.8), ("Lugdunensis (Senonia)", 2.8, 48.2),
    ("Alpes Graiae et Poeninae", 6.8, 45.8),
    # Viennensis
    ("Viennensis", 5.2, 45.0), ("Narbonensis Prima", 3.0, 43.4), ("Narbonensis Secunda", 5.8, 43.7),
    ("Novem Populi", -0.3, 43.7), ("Aquitanica Prima", 2.3, 46.0), ("Aquitanica Secunda", -0.4, 45.3),
    ("Alpes Maritimae", 6.6, 44.4),
    # Italia
    ("Venetia et Histria", 12.5, 45.7), ("Aemilia", 10.8, 44.7), ("Liguria", 9.0, 45.3),
    ("Flaminia et Picenum", 13.0, 43.4), ("Tuscia et Umbria", 11.5, 43.2), ("Campania", 14.1, 41.2),
    ("Apulia et Calabria", 16.6, 41.0), ("Lucania et Bruttii", 16.0, 39.6), ("Sicilia", 14.2, 37.5),
    ("Sardinia", 9.0, 40.0), ("Corsica", 9.1, 42.1), ("Alpes Cottiae", 7.3, 44.9), ("Raetia Prima", 9.6, 46.8),
    ("Raetia Secunda", 10.9, 48.3), ("Samnium", 14.6, 41.6), ("Valeria (Italia)", 13.4, 42.1),
    # Hispaniae
    ("Baetica", -5.0, 37.5), ("Lusitania", -7.0, 39.0), ("Carthaginiensis", -2.0, 39.0), ("Gallaecia", -7.5, 42.5),
    ("Tarraconensis", 0.8, 41.5), ("Mauretania Tingitana", -5.6, 34.6), ("Balearica", 3.0, 39.6),
    # Africa
    ("Africa Proconsularis (Zeugitana)", 9.8, 36.6), ("Byzacena", 10.2, 35.3), ("Tripolitania", 13.5, 32.3),
    ("Numidia", 6.6, 35.9), ("Mauretania Caesariensis", 1.5, 35.6), ("Mauretania Sitifensis", 5.4, 36.0),
]


# ---------------------------------------------------------------------------------------------------------------------
# Hand checks of the largest disagreements (written after a run; matched to report rows by layer and by a word in the
# block's name). verdict: atlas error | AWMC simplification | ambiguous
# ---------------------------------------------------------------------------------------------------------------------
W = "https://en.wikipedia.org/wiki/"
HAND = [
    # the five largest distinct (non-sliver) blocks
    {"top": True, "layer": "persian_extent", "side": "AWMC only", "match": "Khotan", "verdict": "AWMC simplification",
     "why": "Mostly AWMC's: about 450,000 km² of the block lies east of 75°E, a tongue of shading across Kashmir into "
            "the Tarim Basin (Khotan) that no source gives to the Achaemenids. But about 170,000 km² between the Indus "
            "and the Jhelum (Hindush, with Taxila as its probable capital) is an atlas gap: the atlas's Achaemenid "
            "empire stops at the Indus, and Taxila is blank in 500 BCE.",
     "sources": [("Achaemenid conquest of the Indus Valley", W + "Achaemenid_conquest_of_the_Indus_Valley")]},
    {"top": True, "layer": "post_diocletian", "side": "AWMC only", "match": "Numidia", "verdict": "atlas error",
     "why": "From 261 to 429 the atlas draws nothing over inland Numidia and the Mauretanias: Cirta, Sitifis, "
            "Lambaesis, Thamugadi and Altava are blank, though Diocletian split off Mauretania Sitifensis in 293 and "
            "the provinces stayed Roman until the Vandals (430s). Constantine renamed Cirta in 313. Only southern "
            "Tingitana (Volubilis, given up c. 285) is right to leave out. Part of the block is AWMC's wide desert band, "
            "as in 200 CE.",
     "sources": [("Mauretania Caesariensis", W + "Mauretania_Caesariensis"), ("Numidia (Roman province)", W + "Numidia_(Roman_province)")]},
    {"top": True, "layer": "roman_empire_ce_117_extent", "side": "atlas only", "match": "Adiabene", "verdict": "ambiguous",
     "why": "Trajan's provinces of Armenia (114), Mesopotamia (116) and Assyria (116). The atlas draws them in 117 only "
            "and gives them up from 118; AWMC leaves them out. Both fit \"117\": they were held at Trajan's death and "
            "Hadrian evacuated them that same year. Babylonia (the Ctesiphon area) is the weakest part of the atlas's "
            "shape, since a Parthian client king was set up there in 116.",
     "sources": [("Mesopotamia (Roman province)", W + "Mesopotamia_(Roman_province)")]},
    {"top": True, "layer": "persian_extent", "side": "atlas only", "match": "Siwa", "verdict": "AWMC simplification",
     "why": "The atlas draws Persian Libya (Cyrenaica, Marmarica, the Western Desert oases). Cambyses' army took the "
            "Pentapolis in 525 BCE and the Persians kept a satrapy there for about two centuries. AWMC shades only the "
            "Nile valley. How much of the empty Libyan desert to colour is a matter of convention.",
     "sources": [("Cyrenaica", W + "Cyrenaica")]},
    {"top": True, "layer": "roman_empire_ce_200_extent", "side": "AWMC only", "match": "Gaetulia", "verdict": "atlas error",
     "why": "In 200 the atlas puts the African frontier 1–2° north of AWMC's line (at 13.4°E, for example, 32.2°N "
            "against 30.2°N). The forts of Q. Anicius Faustus on the Limes Tripolitanus (197–201: Gheriat el-Garbia, "
            "Bu Njem/Golaia), Castellum Dimmidi and Hadrian's Gemellae all lie inside AWMC's shape and outside the "
            "atlas's. AWMC uses the same desert line in 117, before most of these forts were built, so it fits that "
            "year less well.",
     "sources": [("Limes Tripolitanus", W + "Limes_Tripolitanus")]},
    # further checks
    {"layer": "alexanders_empire", "side": "atlas only", "match": "Punjab (Lahore)", "verdict": "ambiguous",
     "why": "After the Hydaspes (326 BCE), Alexander reinstated Porus as his satrap over lands \"as far as the "
            "Hyphasis\" (Beas). The atlas includes this land and AWMC does not. About 58,000 km² of the block lies in "
            "Kashmir and the Pamir, which is less defensible.",
     "sources": [("Porus", W + "Porus")]},
    {"layer": "persian_extent", "side": "AWMC only", "match": "Thrace", "verdict": "atlas error",
     "why": "Thrace was the Persian satrapy of Skudra from 513 BCE, re-subjugated in 492 BCE, with Persian rule ending "
            "between 479 and c. 465 BCE. The atlas's own note says Thrace was lost after Plataea, yet it draws nothing "
            "Persian there before 479 either.",
     "sources": [("Skudra", W + "Skudra")]},
    {"layer": "roman_empire_bce_60", "side": "AWMC only", "match": "Gallia Narbonensis", "verdict": "atlas error",
     "why": "Gallia Transalpina became a province in 121 BCE (Narbo was founded in 118 BCE). The atlas draws its "
            "western part (Tolosa, Nemausus, Carcaso) as Roman only from 50 BCE.",
     "sources": [("Gallia Narbonensis", W + "Gallia_Narbonensis")]},
    {"layer": "herod", "side": "AWMC only", "match": "Batanaea", "verdict": "atlas error",
     "why": "Augustus gave Herod Trachonitis, Batanaea and Auranitis in 23/22 BCE. They passed to Philip at Herod's "
            "death. The atlas's Judea keeps one shape from 91 BCE to 5 CE and leaves them Roman.",
     "sources": [("Herod the Great", W + "Herod_the_Great")]},
]


# ---------------------------------------------------------------------------------------------------------------------
# Reading
# ---------------------------------------------------------------------------------------------------------------------
def read_geojson(path):
    d = json.load(open(path))
    polys, lines = [], []
    for f in d["features"]:
        g = f.get("geometry")
        if not g: continue
        if g["type"] in ("Polygon", "MultiPolygon"): polys.extend(cs.polys_of(g))
        elif g["type"] == "LineString": lines.append(g["coordinates"])
        elif g["type"] == "MultiLineString": lines.extend(g["coordinates"])
    return polys, lines


def read_shp_polys(zpath, member):
    """polygons from an ESRI shapefile inside a zip (types 5/15/25; rings as parts, even-odd filled)"""
    b = zipfile.ZipFile(zpath).read(member)
    i, out = 100, []
    while i + 8 <= len(b):
        _, ln = struct.unpack(">ii", b[i:i + 8]); rec = b[i + 8:i + 8 + 2 * ln]; i += 8 + 2 * ln
        if len(rec) < 44 or struct.unpack("<i", rec[:4])[0] not in (5, 15, 25): continue
        npart, npt = struct.unpack("<ii", rec[36:44])
        parts = list(struct.unpack(f"<{npart}i", rec[44:44 + 4 * npart])) + [npt]
        o = 44 + 4 * npart
        pts = [list(struct.unpack("<dd", rec[o + 16 * k:o + 16 * k + 16])) for k in range(npt)]
        out.append([pts[a:z] for a, z in zip(parts, parts[1:])])
    return out


def line_cells(G, lines):
    """cells a polyline passes through (sampled at a third of a cell)"""
    out, K = set(), G.K
    for ln in lines:
        for (x1, y1), (x2, y2) in zip(ln, ln[1:]):
            n = max(1, int(math.hypot(x2 - x1, y2 - y1) * K * 3))
            for i in range(n + 1):
                x, y = x1 + (x2 - x1) * i / n, y1 + (y2 - y1) * i / n
                out.add(int(math.floor((y + 90) * K)) * G.NC + int(math.floor((x + 180) * K)) % G.NC)
    return out


def bbox(polys):
    xs = [p[0] for poly in polys for ring in poly for p in ring]
    ys = [p[1] for poly in polys for ring in poly for p in ring]
    return (min(xs), min(ys), max(xs), max(ys)) if xs else None


def land_cells(G, year):
    """land = the union of the base-map polygons of the era nearest the year (public/data/<year>.json)"""
    files = {}
    for p in glob.glob(os.path.join(ROOT, "public", "data", "*.json")):
        b = os.path.basename(p)[:-5]
        if b.lstrip("-").isdigit(): files[int(b)] = p
    y = min(files, key=lambda v: (abs(v - year), v))
    out = set()
    for f in json.load(open(files[y]))["features"]:
        out |= G.cells(cs.polys_of(f["geometry"]))
    return out, os.path.relpath(files[y], ROOT)


# ---------------------------------------------------------------------------------------------------------------------
# The atlas in a year, inside a box
# ---------------------------------------------------------------------------------------------------------------------
class Atlas:
    def __init__(self, G):
        cs.Y0, cs.Y1 = -700, 500  # load_atlas reads these module globals
        self.G = G
        self.pieces = cs.load_atlas()
        idx = json.load(open(os.path.join(ROOT, "public", "data", "clio", "index.json"))).get("realms", {})
        self.member = {n: v.get("memberOf", []) for n, v in idx.items()}
        self.tl = {n: v.get("tl", []) for n, v in idx.items()}
        self.cache = {}
        for p in self.pieces:
            g = p["geom"]
            if "bb" not in g: g["bb"] = bbox(g["polys"])

    def active(self, year): return [p for p in self.pieces if p["a"] <= year <= p["b"] and p["geom"]["bb"]]

    def cells(self, p, box):
        b = p["geom"]["bb"]
        if b[2] < box[0] or b[0] > box[2] or b[3] < box[1] or b[1] > box[3]: return set()
        crop = box if not p["crop"] else (max(box[0], p["crop"][0]), max(box[1], p["crop"][1]),
                                          min(box[2], p["crop"][2]), min(box[3], p["crop"][3]))
        key = (id(p["geom"]), crop, p["cuts"])
        if key not in self.cache: self.cache[key] = self.G.cells(p["geom"]["polys"], crop, p["cuts"])
        return self.cache[key]

    def realm(self, names, year, box):
        out = set()
        for p in self.active(year):
            if p["name"] in names: out |= self.cells(p, box)
        return out

    def realm_box(self, names, year):
        bbs = [p["geom"]["bb"] for p in self.active(year) if p["name"] in names]
        if not bbs: return None
        return (min(b[0] for b in bbs), min(b[1] for b in bbs), max(b[2] for b in bbs), max(b[3] for b in bbs))

    def holders(self, year, box, skip):
        """cell -> name of the most specific other realm drawn there (a named realm before a group, smaller first)"""
        cand = []
        for p in self.active(year):
            if p["name"] in skip: continue
            c = self.cells(p, box)
            if c: cand.append((p["name"].startswith("("), len(c), p["name"], c))
        out = {}
        for _, _, name, c in sorted(cand, reverse=True):  # largest group first, so the smallest named realm wins
            for x in c: out[x] = name
        return out

    def label(self, name, targets):
        if name is None: return "nothing drawn"
        grp = [g for g in self.member.get(name, []) if any(t in g for t in targets)]
        if name.startswith("(") and any(t in name for t in targets): return f"{name} (a group with the realm)"
        return f"{name} (member of {grp[0]})" if grp else name

    def changes(self, names, lo, hi):
        """years in [lo, hi] where a piece of the realm starts or ends"""
        ys = set()
        for p in self.pieces:
            if p["name"] in names:
                for y in (p["a"], p["b"]):
                    if lo <= y <= hi: ys.add(y)
        return ys


# ---------------------------------------------------------------------------------------------------------------------
# Cell-set helpers
# ---------------------------------------------------------------------------------------------------------------------
def area(G, cells): return sum(G.row_area[c // G.NC] for c in cells)


def nbrs(G, c, eight=True):
    r, k = divmod(c, G.NC)
    for dr, dk in ((1, 0), (-1, 0), (0, 1), (0, -1)) + (((1, 1), (1, -1), (-1, 1), (-1, -1)) if eight else ()):
        yield (r + dr) * G.NC + (k + dk) % G.NC


def components(G, cells, eight=True):
    left, out = set(cells), []
    while left:
        s = left.pop(); comp = [s]; stack = [s]
        while stack:
            c = stack.pop()
            for n in nbrs(G, c, eight):
                if n in left: left.remove(n); comp.append(n); stack.append(n)
        out.append(comp)
    return out


def centroid(G, cells):
    """area-weighted centre (lon, lat); fine for blocks far from the antimeridian"""
    sx = sy = sw = 0.0
    for c in cells:
        lon, lat = G.lonlat(c); w = G.row_area[c // G.NC]
        sx += lon * w; sy += lat * w; sw += w
    return sx / sw, sy / sw


def cell_of(G, lon, lat):
    return int(math.floor((lat + 90) * G.K)) * G.NC + int(math.floor((lon + 180) * G.K)) % G.NC


def dist(a, b):
    dx = (a[0] - b[0]) * math.cos(math.radians((a[1] + b[1]) / 2))
    return math.hypot(dx, a[1] - b[1])


def name_block(G, cells, gaz):
    """names of the gazetteer points inside the block (nearest the centre first), else 'near' the nearest one"""
    s = set(cells); cen = centroid(G, cells)
    inside = sorted((dist((x, y), cen), n) for n, x, y in gaz if cell_of(G, x, y) in s)
    seen, names = set(), []
    for _, n in inside:
        if n not in seen: seen.add(n); names.append(n)
    if names: return ", ".join(names[:3]) + (f" (+{len(names) - 3})" if len(names) > 3 else "")
    best = min(gaz, key=lambda g: dist((g[1], g[2]), cen))
    return f"near {best[0]}"


def is_sliver(G, cells, other):
    """a strip along a shared border: under a fifth of its cells are more than one cell away from `other` cells or
    the block's edge"""
    s = set(cells)
    core = 0
    for c in cells:
        if all(n in s for n in nbrs(G, c)): core += 1
    return core < 0.2 * len(cells) and len(cells) >= 1


def fmt_pct(x): return f"{100 * x:.0f}%" if x >= 0.995 or x <= 0.005 or abs(x * 100 - round(x * 100)) < 1e-9 else f"{100 * x:.1f}%"


def yr(y): return f"{-y} BCE" if y < 0 else f"{y} CE"


def km(v): return cs.km(v)


# ---------------------------------------------------------------------------------------------------------------------
# Comparing one layer
# ---------------------------------------------------------------------------------------------------------------------
def compare(G, atlas, L, args):
    path = os.path.join(PS, L["path"])
    polys, lines = read_geojson(path)
    if L.get("lines"):
        kind, member = L["extent"]
        ext = read_geojson(os.path.join(PS, member))[0] if kind == "geojson" else read_shp_polys(ZIP, member)
        aw_polys = ext
    else:
        aw_polys = polys
    land, land_src = land_cells(G, L["year"])
    A_full = G.cells(aw_polys)
    A = A_full & land
    names = L["realms"]
    gaz = REGIONS + (P200 if L["names"] == "roman" else [])
    ab = bbox(aw_polys)
    rb = atlas.realm_box(names, L["year"])
    box = (ab[0] - 5, ab[1] - 5, ab[2] + 5, ab[3] + 5)
    if rb: box = (min(box[0], rb[0]), min(box[1], rb[1]), max(box[2], rb[2]), max(box[3], rb[3]))
    box = tuple(round(v, 3) for v in box)
    res = {"L": L, "land_src": land_src, "box": box, "aw_area": area(G, A)}

    # ---- the layer's year
    T = atlas.realm(names, L["year"], box) & land
    shared, aw_only, at_only = A & T, A - T, T - A
    res.update(at_area=area(G, T), shared=area(G, shared), aw_only_area=area(G, aw_only), at_only_area=area(G, at_only))
    union = res["aw_area"] + res["at_area"] - res["shared"]
    res["iou"] = res["shared"] / union if union else 0
    res["cover"] = res["shared"] / res["aw_area"] if res["aw_area"] else 0
    res["inside"] = res["shared"] / res["at_area"] if res["at_area"] else 0
    res["drawn_as"] = sorted({p["name"] for p in atlas.active(L["year"]) if p["name"] in names})
    res["tl"] = next((a for n in names for f, t, a in atlas.tl.get(n, []) if f <= L["year"] <= t), None)

    # ---- disagreement blocks
    hold = atlas.holders(L["year"], box, set(names))
    by_holder = collections.defaultdict(set)
    for c in aw_only: by_holder[hold.get(c)].add(c)
    blocks = []
    min_area = min(args.min_area, 0.02 * res["aw_area"])
    for h, cells in by_holder.items():
        for comp in components(G, cells):
            a = area(G, comp)
            if a < min_area: continue
            blocks.append({"side": "AWMC only", "holder": atlas.label(h, names), "area": a,
                           "where": name_block(G, comp, gaz), "sliver": is_sliver(G, comp, T), "cells": comp})
    if not L.get("subset"):
        for comp in components(G, at_only):
            a = area(G, comp)
            if a < min_area: continue
            blocks.append({"side": "atlas only", "holder": "", "area": a, "where": name_block(G, comp, gaz),
                           "sliver": is_sliver(G, comp, A), "cells": comp})
    blocks.sort(key=lambda b: (b["sliver"], -b["area"]))
    res["blocks"], res["min_area"] = blocks, min_area
    res["blank"] = area(G, by_holder.get(None, ()))
    res["other"] = res["aw_only_area"] - res["blank"]
    res["holder_tot"] = sorted(((area(G, c), atlas.label(h, names)) for h, c in by_holder.items()), reverse=True)

    # ---- the atlas a few years either side
    y0 = L["year"]
    years = sorted({y0 + d for d in OFFSETS} | atlas.changes(names, y0 - 50, y0 + 50) |
                   {y - 1 for y in atlas.changes(names, y0 - 50, y0 + 50)} - {y0 - 51})
    scan, prev = [], None
    for y in years:
        Ty = atlas.realm(names, y, box) & land
        if not Ty: scan.append({"a": y, "b": y, "none": True}); continue
        key = (len(Ty), hash(frozenset(Ty)) if len(Ty) < 400000 else len(Ty))
        sh = area(G, Ty & A); at = area(G, Ty)
        row = {"a": y, "b": y, "at": at, "iou": sh / (res["aw_area"] + at - sh), "cover": sh / res["aw_area"],
               "inside": sh / at, "key": key, "names": sorted({p["name"] for p in atlas.active(y) if p["name"] in names})}
        if prev and prev.get("key") == key: prev["b"] = y; continue
        scan.append(row); prev = row
    merged = []
    for r in scan:
        if r.get("none") and merged and merged[-1].get("none"): merged[-1]["b"] = r["b"]; continue
        merged.append(r)
    res["scan"] = merged
    best = max((r for r in merged if not r.get("none")), key=lambda r: r["iou"], default=None)
    res["best"] = best

    # ---- provinces
    if L.get("provinces"):
        res["prov"] = provinces(G, atlas, L, A_full, line_cells(G, lines), land, T, hold, box)
    return res


def provinces(G, atlas, L, E, barrier, land, T, hold, box):
    """fill the extent E between the boundary lines; name each piece from the province table"""
    table = P200 if L["provinces"] == "P200" else P314
    free = E - barrier
    comps = components(G, free, eight=False)
    owner = {}
    for i, comp in enumerate(comps):
        for c in comp: owner[c] = i
    # give line cells to the neighbouring piece they touch most (repeat for lines more than a cell wide)
    todo = (E & barrier)
    for _ in range(6):
        nxt = set()
        for c in todo:
            cnt = collections.Counter(owner[n] for n in nbrs(G, c) if n in owner)
            if cnt: owner[c] = cnt.most_common(1)[0][0]
            else: nxt.add(c)
        if not nxt or nxt == todo: break
        todo = nxt
    cells_of = collections.defaultdict(list)
    for c, i in owner.items(): cells_of[i].append(c)
    names_of = collections.defaultdict(list)
    for n, x, y in table:
        i = owner.get(cell_of(G, x, y))
        if i is None:  # a point just off the shape (coast): nearest owned cell within 3 cells
            c0 = cell_of(G, x, y)
            r0, k0 = divmod(c0, G.NC)
            near = [(abs(dr) + abs(dk), owner[(r0 + dr) * G.NC + k0 + dk]) for dr in range(-3, 4) for dk in range(-3, 4)
                    if (r0 + dr) * G.NC + k0 + dk in owner]
            if near: i = min(near)[1]
        if i is not None and n not in names_of[i]: names_of[i].append(n)
    named = {i: " / ".join(v) for i, v in names_of.items()}
    # unnamed pieces (islands, slivers between lines): join the named piece whose cells are nearest
    centres = {i: centroid(G, cells_of[i]) for i in cells_of}
    unnamed = [i for i in cells_of if i not in named]
    pieces_named = {}
    for i in unnamed:
        j = min(named, key=lambda j: dist(centres[i], centres[j]))
        pieces_named[i] = named[j]
    groups = collections.defaultdict(set)
    for i, cells in cells_of.items():
        groups[named.get(i) or pieces_named[i]].update(cells)
    rows = []
    for n, cells in groups.items():
        cl = cells & land
        if not cl: continue
        a = area(G, cl)
        missing = cl - T
        by = collections.Counter()
        for c in missing: by[atlas.label(hold.get(c), L["realms"])] += G.row_area[c // G.NC]
        rows.append({"name": n, "area": a, "roman": area(G, cl & T), "missing": area(G, missing), "instead": by.most_common(3)})
    rows.sort(key=lambda r: -r["missing"])
    merged = [n for n in groups if " / " in n]
    missing_names = sorted({n for n, _, _ in table} - {x for g in groups for x in g.split(" / ")})
    return {"rows": rows, "merged": merged, "unplaced": missing_names, "n": len(groups)}


# ---------------------------------------------------------------------------------------------------------------------
# Report
# ---------------------------------------------------------------------------------------------------------------------
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--res", type=float, default=0.1, help="grid cell size in degrees (default 0.1)")
    ap.add_argument("--min-area", type=float, default=2000, help="smallest block listed, km² (default 2,000; "
                    "2%% of the layer's area for small layers)")
    ap.add_argument("--top", type=int, default=15, help="blocks listed per layer (default 15)")
    args = ap.parse_args()
    if not os.path.isdir(PS): raise SystemExit(f"missing {PS}: see the Fetch step in this script's header")
    t0 = time.time()
    G = cs.Grid(args.res)
    atlas = Atlas(G)
    print(f"{len(atlas.pieces)} atlas pieces (700 BCE – 500 CE), {args.res}° grid")
    results = []
    for L in LAYERS:
        r = compare(G, atlas, L, args)
        results.append(r)
        print(f"{L['id']}: {yr(L['year'])}, AWMC {km(r['aw_area'])} km², atlas {km(r['at_area'])} km², "
              f"overlap {r['iou'] * 100:.0f}%, {len(r['blocks'])} blocks ({time.time() - t0:.0f}s)", flush=True)

    L_ = []
    w = L_.append
    w("# Ancient border cross-check against the Ancient World Mapping Center (AWMC)")
    w("")
    w(f"Written by `tools/check_awmc.py` on {datetime.date.today().isoformat()}. Read-only: nothing in the atlas was "
      "changed.")
    w("")
    w("The Ancient World Mapping Center at the University of North Carolina publishes the vector layers behind its "
      "maps, drawn from the *Barrington Atlas of the Greek and Roman World* (Princeton, 2000). Its `political_shading` "
      "folder has ten layers: four Roman extents and province sets, the senatorial provinces, and the empires of "
      "Persia, Alexander, the Hasmoneans and Herod. They are small-scale map shading, not a dated border database: none "
      "carries a date or a name, so the year each stands for is inferred below, and their edges follow natural lines "
      "(deserts, rivers) at map scale.")
    w("")
    w(f"> Source: {CREDIT}. Licence: [Open Database License 1.0](https://opendatacommons.org/licenses/odbl/1-0/). "
      "Derived from the Barrington Atlas and AWMC edits to OpenStreetMap data. This report carries only figures derived "
      "from the layers; the clone is not in the repository.")
    w("")
    w("## How it was compared")
    w("")
    w(f"- Grid: {args.res}° cells (cell centres, even-odd rule; about {km(G.row_area[int(130 * G.K)])} km² a cell at "
      "40°N), land only: both shapes are clipped to the base-map land polygons of the nearest era "
      "(`public/data/<year>.json`).")
    w("- Atlas: the border chunks in `public/data/clio/` with every correction in `content/corrections.json` and the "
      "reconstruction layers in `public/data/supplements.json`, read by `load_atlas()` in `tools/check_cshapes.py`. A "
      "realm counts in year Y if its first year ≤ Y ≤ its last year. Client kingdoms and allies are separate realms in "
      "the atlas and count as \"another realm\" here.")
    w("- Overlap = shared area ÷ (AWMC ∪ atlas). *AWMC covered* = the share of AWMC's area the atlas gives to the realm; "
      "*atlas inside* = the share of the atlas realm that lies inside AWMC's shape.")
    w(f"- Disagreements are merged into contiguous blocks (8-neighbour) and named from a gazetteer of ancient regions "
      f"and provinces in the script (the points that fall inside a block, else \"near\" the closest). Blocks under "
      f"{km(args.min_area)} km² (or 2% of a small layer's area) are not listed. *Sliver* = a strip along a shared border "
      "with almost no interior cells: the two draw the same frontier a little apart, not a different territory.")
    w("- Dates: the overlap is recomputed for every year in ±50 years where the atlas changes the realm's shape, plus "
      "fixed offsets. If a nearby year fits much better, the disagreement is a date offset; if no year fits, a shape "
      "difference.")
    w("")
    w("## Summary")
    w("")
    w("| Layer | Year compared | AWMC km² | Atlas km² | Shared km² | Overlap | AWMC covered | Atlas inside | Best atlas year (overlap) |")
    w("|---|---|---|---|---|---|---|---|---|")
    for r in results:
        L = r["L"]; b = r["best"]
        by = (f"{yr(b['a'])}" + (f"–{yr(b['b'])}" if b["b"] != b["a"] else "") + f" ({b['iou'] * 100:.0f}%)") if b else "—"
        ins = "—" if L.get("subset") else f"{r['inside'] * 100:.0f}%"
        ov = "—" if L.get("subset") else f"{r['iou'] * 100:.0f}%"
        if L.get("subset"): by = "—"
        w(f"| [{L['title']}](#{L['id'].replace('_', '-')}) | {yr(L['year'])} | {km(r['aw_area'])} | {km(r['at_area'])} | "
          f"{km(r['shared'])} | {ov} | {r['cover'] * 100:.0f}% | {ins} | {by} |")
    w("")
    w("For the senatorial provinces (a part of the empire by design) only *AWMC covered* is meaningful.")
    w("")

    # ---- hand checks
    w("## Hand-checked disagreements")
    w("")
    def hand_table(hs):
        w("| # | Layer, year | Block | km² | Verdict | Why | Source |")
        w("|---|---|---|---|---|---|---|")
        for i, h in enumerate(hs, 1):
            r = next(x for x in results if x["L"]["id"] == h["layer"])
            blk = next((b for b in r["blocks"] if b["side"] == h["side"] and h["match"] in b["where"] + " " + b["holder"]),
                       None)
            a = km(blk["area"]) if blk else "—"
            what = f"{h['side']}: {blk['where']}" + (f" — atlas has {blk['holder']}" if blk and blk["holder"] else "") \
                if blk else h["match"]
            w(f"| {i} | {r['L']['title']} | {what} | {a} | **{h['verdict']}** | {h['why']} | "
              + "; ".join(f"[{t}]({u})" for t, u in h["sources"]) + " |")
        w("")

    w("The five largest distinct disagreements that are not border slivers, each checked by hand against a published "
      "source. Repeats are left out: the same Saharan band in 117, 200 and 314 is counted once per issue. Verdicts: "
      "*atlas error* means the atlas should change. *AWMC simplification* means AWMC's small-scale shading is the "
      "coarser of the two. *ambiguous* means sources differ, or the land was a client or tributary area that either "
      "convention fits. These are judgements from the cited pages, not edits: nothing in the atlas was changed.")
    w("")
    hand_table([h for h in HAND if h.get("top")])
    w("Fixed on 2026-11-13 in content/borders/patches.json: Roman North Africa 261-429 (roman-africa-261-429), the "
      "Severan Saharan frontier (severan-saharan-frontier), Persian Thrace (persian-thrace-skudra), Gallia Narbonensis "
      "(gallia-narbonensis-121bce) and Batanaea/Trachonitis (herod-batanaea-trachonitis); verdicts are kept as found.")
    w("")
    w("### Further checks (smaller blocks)")
    w("")
    hand_table([h for h in HAND if not h.get("top")])

    # ---- per layer
    for r in results:
        L = r["L"]
        w(f"## {L['title']}")
        w("")
        w(f"<a id=\"{L['id'].replace('_', '-')}\"></a>AWMC layer `{L['path'].split('/')[0]}`"
          + (f" (boundary lines; outline from `{os.path.basename(L['extent'][1])}`)" if L.get("lines") else "")
          + f". Year compared: **{yr(L['year'])}**, from {L['why']}.")
        w("")
        drawn = ", ".join(r["drawn_as"]) or "nothing"
        w(f"- Atlas realm{'s' if len(L['realms']) > 1 else ''} compared: {', '.join(L['realms'])} (drawn in "
          f"{yr(L['year'])} as {drawn}" + (f"; the atlas's own area figure for that year is {km(r['tl'])} km²" if r["tl"] else "")
          + ").")
        w(f"- AWMC {km(r['aw_area'])} km²; atlas {km(r['at_area'])} km² (land, inside {r['box'][0]:.0f}°…{r['box'][2]:.0f}°E, "
          f"{r['box'][1]:.0f}°…{r['box'][3]:.0f}°N); shared {km(r['shared'])} km².")
        if L.get("subset"):
            w(f"- AWMC covered: **{r['cover'] * 100:.1f}%**. Of the {km(r['aw_only_area'])} km² the atlas does not show as "
              f"Roman, {km(r['other'])} km² is another realm and {km(r['blank'])} km² is blank.")
        else:
            w(f"- Overlap **{r['iou'] * 100:.1f}%**; AWMC covered {r['cover'] * 100:.1f}%; atlas inside "
              f"{r['inside'] * 100:.1f}%.")
            w(f"- AWMC only: {km(r['aw_only_area'])} km² ({km(r['other'])} km² another realm, {km(r['blank'])} km² "
              f"blank). Atlas only: {km(r['at_only_area'])} km².")
        top_h = [f"{n} {km(a)} km²" for a, n in r["holder_tot"][:5] if a >= r["min_area"]]
        if top_h: w(f"- What the atlas draws on AWMC's land instead: {'; '.join(top_h)}.")
        w("")
        bl = r["blocks"]
        real = [b for b in bl if not b["sliver"]]
        sl = [b for b in bl if b["sliver"]]
        if real:
            w("| # | Side | Where | km² | Atlas has |")
            w("|---|---|---|---|---|")
            for i, b in enumerate(real[:args.top], 1):
                w(f"| {i} | {b['side']} | {b['where']} | {km(b['area'])} | {b['holder'] or '—'} |")
            if len(real) > args.top: w(""); w(f"{len(real) - args.top} smaller blocks not listed.")
            w("")
        else:
            w(f"No block over {km(r['min_area'])} km² apart from border slivers.")
            w("")
        if sl:
            w(f"Border slivers ({len(sl)}, {km(sum(b['area'] for b in sl))} km² in all): "
              + "; ".join(f"{b['side']} {b['where']} {km(b['area'])} km²" for b in sorted(sl, key=lambda b: -b["area"])[:6])
              + ("…" if len(sl) > 6 else "") + ".")
            w("")
        if not L.get("subset"):
            w("Atlas a few years either side:")
            w("")
            w("| Atlas years | Drawn as | Atlas km² | Overlap | AWMC covered | Atlas inside |")
            w("|---|---|---|---|---|---|")
            for s in r["scan"]:
                ys = yr(s["a"]) + (f" – {yr(s['b'])}" if s["b"] != s["a"] else "")
                if s.get("none"): w(f"| {ys} | not drawn | — | — | — | — |"); continue
                mark = " ←" if s["a"] <= L["year"] <= s["b"] else ""
                w(f"| {ys}{mark} | {', '.join(s['names'])} | {km(s['at'])} | {s['iou'] * 100:.0f}% | "
                  f"{s['cover'] * 100:.0f}% | {s['inside'] * 100:.0f}% |")
            w("")
            b = r["best"]
            cur = next((s for s in r["scan"] if not s.get("none") and s["a"] <= L["year"] <= s["b"]), None)
            if b and cur:
                gain = b["iou"] - cur["iou"]
                if gain < 0.03:
                    w(f"The layer's own year fits as well as any nearby year (best {b['iou'] * 100:.0f}% against "
                      f"{cur['iou'] * 100:.0f}%), so the differences are in the shape, not the date.")
                else:
                    w(f"The atlas of {yr(b['a'])}" + (f"–{yr(b['b'])}" if b["b"] != b["a"] else "")
                      + f" fits better ({b['iou'] * 100:.0f}% against {cur['iou'] * 100:.0f}%): part of the difference "
                        "is a date offset.")
                w("")
        if r.get("prov"):
            P = r["prov"]
            w(f"### Provinces ({P['n']} filled pieces)")
            w("")
            w("Province shares the atlas draws as Roman in the layer's year, most land missing first. A name with \"/\" "
              "is two provinces the AWMC lines do not separate (an open boundary) or that the reference points place "
              "in one piece.")
            w("")
            w("| # | Province | AWMC km² | Atlas Roman | Missing km² | Atlas has instead |")
            w("|---|---|---|---|---|---|")
            for i, p in enumerate(P["rows"], 1):
                if p["missing"] < 0.5 * r["min_area"] and i > 10: break
                inst = "; ".join(f"{n} {km(a)}" for n, a in p["instead"]) or "—"
                w(f"| {i} | {p['name']} | {km(p['area'])} | {p['roman'] / p['area'] * 100:.0f}% | {km(p['missing'])} | {inst} |")
            rest = [p for p in P["rows"] if p["missing"] < 0.5 * r["min_area"]]
            w("")
            w(f"{len(rest)} provinces are fully or almost fully drawn as Roman (under {km(0.5 * r['min_area'])} km² "
              "missing each).")
            if P["unplaced"]: w(f" Reference points outside the AWMC outline: {', '.join(P['unplaced'])}.")
            w("")
    w("## Limits")
    w("")
    w("- AWMC's layers are small-scale shading for printed and web maps, with no dates or attributes; the years compared "
      "are inferred from layer names and contents (see each section).")
    w(f"- The {args.res}° grid misses islands and strips narrower than a few cells; blocks under the listed threshold are "
      "dropped, and border slivers are reported apart.")
    w("- Land is the atlas's own base map of the nearest era, so coastline differences between the two datasets drop out.")
    w("- Province names come from capitals placed by hand in the script; where AWMC's lines leave a gap, two provinces "
      "share one piece.")
    w("- The atlas draws client kingdoms (Armenia, Nabataea, Thrace, Mauretania, Judaea …) as their own realms. AWMC "
      "sometimes shades them as Roman and sometimes not; these show up here as disagreements that are conventions.")
    w("")
    open(OUT, "w").write("\n".join(L_))
    print("wrote", os.path.relpath(OUT, ROOT), f"in {time.time() - t0:.0f}s")


if __name__ == "__main__":
    main()
