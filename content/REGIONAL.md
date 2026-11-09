# Regional specialist fact-check

You check one region's content against that region's **standard scholarly authorities**, the
specialist equivalents of Schwartzberg/Majumdar/Sarkar/Imperial Gazetteer for South Asia. Read
`content/FACTCHECK.md` (source standards) and `content/BRIEF.md` (context) first.

## Where the content is (READ ONLY: general fact-checkers are editing these files right now)
- `content/eras/*.json`: each chapter's `overview`, `regions[<your region keys>]`, `powers`, `events`.
- `content/empires/*.json`: profiles for realms in your region (grep by name/region key).
- `public/data/clio/index.json`: map borders' area timeline per realm (`realms[name].tl` =
  [[fromYear, toYear, areaKm2], ...]). You can't change borders. Report material disagreements
  with your atlases (wrong dates of existence, wildly wrong extent).

## How to use the authorities
Prefer openly readable copies: Internet Archive (archive.org full text and lending previews), HathiTrust,
Google Books previews, university digital libraries (e.g. Perry–Castañeda Library map collection at UT Austin,
DSAL Chicago), UNESCO's free PDFs, Encyclopaedia Iranica online, Pleiades/Barrington, CHGIS. Cite precisely
(work, volume, page or plate, or the URL). Older works can carry outdated or colonial-era views. Where modern
scholarship differs, follow the modern consensus and record the disagreement. Don't invent citations: cite only
what you actually opened.

## Output (write only these two files)
1. `content/factcheck/<slug>-patch.json`: JSON array of proposed corrections:
   `{"file": "content/eras/b-medieval.json", "item": 800, "field": "regions.east-asia", "old": "short exact substring", "new": "replacement", "source": "work, vol/page or URL"}`
   `item` = an era's year or a profile's `id`. `field` uses dots/brackets: `overview`, `regions.europe`,
   `powers[2].ruler`, `events[1].text`, `rulers[0].reign`, `peak.note`, `summary`, `capital`, `start`, `end`.
   Keep `old` a minimal exact substring (other agents may edit around it). For number fields (`start`, `end`, `peak.year`,
   `peak.areaKm2`) put the numbers in old/new.
   Add references with `{"file": ..., "item": ..., "addSource": {"title": "...", "url": "..."}}`.
2. `content/factcheck/<slug>.md`: human-readable log: corrections (old → new, reason, citation),
   border/extent discrepancies vs your atlases, disputed claims.

Reply with: number of proposed corrections, the 5 most significant, and the key border discrepancies.

## Authorities by region (use what you can access; add others of equal standing)
- **east-asia** (China, Mongolia, Korea, Japan, Tibet): Tan Qixiang, *Historical Atlas of China* (中国历史地图集) and Harvard
  CHGIS; Albert Herrmann, *Historical and Commercial Atlas of China* (1935, archive.org); *Cambridge History of China*;
  *Cambridge History of Japan*; Wilkinson, *Chinese History: A New Manual*; *Cambridge History of Korea*; Encyclopedia of Korean Culture.
- **ancient-near-east** (Mesopotamia, Levant, Anatolia, Egypt, Iran before 330 BCE): *Cambridge Ancient History*; Kuhrt,
  *The Ancient Near East c.3000–330 BC*; Shaw (ed.), *Oxford History of Ancient Egypt*; Hornung, Krauss & Warburton,
  *Ancient Egyptian Chronology*; Tübinger Atlas des Vorderen Orients (TAVO); Encyclopaedia Iranica (Achaemenids).
- **islamic-iran-central-asia** (Middle East, Iran, Central Asia, steppe, 330 BCE onward): C. E. Bosworth, *The New Islamic
  Dynasties* (ruler lists, archive.org); *Encyclopaedia Iranica* (iranicaonline.org); *Encyclopaedia of Islam*;
  *Cambridge History of Iran*; *Cambridge History of Inner Asia*; Grousset, *The Empire of the Steppes*; TAVO; Hodgson, *The Venture of Islam*.
- **europe** (Europe and the Mediterranean, antiquity to today): *Barrington Atlas of the Greek and Roman World* + Pleiades;
  *Cambridge Ancient History*; *Oxford Classical Dictionary*; *New Cambridge Medieval History*; *New Cambridge Modern History*;
  Shepherd, *Historical Atlas* (1923, PCL UT Austin online); *Cambridge Modern History Atlas* (1912); Euratlas (Nüssli) for border sanity checks.
- **africa** (northern and southern Africa): UNESCO *General History of Africa* (8 vols, free PDFs on unesdoc.unesco.org);
  *Cambridge History of Africa*; Fage, *An Atlas of African History*; Ajayi & Crowder, *Historical Atlas of Africa*; Levtzion, *Ancient Ghana and Mali*.
- **americas** (all four American regions): *Cambridge History of the Native Peoples of the Americas*; Smithsonian *Handbook of North
  American Indians*; *Handbook of Middle American Indians*; Martin & Grube, *Chronicle of the Maya Kings and Queens*; D'Altroy, *The Incas*;
  *Cambridge History of Latin America*; Paullin, *Atlas of the Historical Geography of the United States* (online, Univ. of Richmond).
- **southeast-asia-oceania** (Southeast Asia, Australasia, Pacific): *Cambridge History of Southeast Asia*; D. G. E. Hall,
  *A History of South-East Asia* (archive.org); Cribb, *Historical Atlas of Indonesia*; Coedès, *The Indianized States of Southeast Asia*;
  *Cambridge History of the Pacific Islanders*; *Cambridge History of Australia*.
