# Story fact-check log: "The Cambrian explosion" (id: cambrian)

Span 580 to 485 million years ago, 12 chapters, oldest first. Deliverable: `content/prehistory/stories/cambrian.json`.

## Chapters and what they cover

1. **A warmer world after the ice** (580 Ma, Gaskiers, Newfoundland): the Sturtian and Marinoan freezes, the short Gaskiers glaciation (579.88 to 579.63 Ma, Pu et al. 2016 via Wikipedia), and the roughly 9-million-year gap before the first large fossils. Refs e:marinoan-glaciation, e:sponge-biomarkers, e:gondwana-assembles.
2. **Fronds on a deep sea floor** (570 Ma, Mistaken Point): rangeomorphs, Fractofusus, ash-buried communities (565 Ma ash), UNESCO 2016. Refs e:mistaken-point, o:ediacaran-biota.
3. **The first proven animals** (558 Ma, White Sea): Kimberella and Dickinsonia; Bobrovskiy et al. 2018 cholesterol finding (ANU release); Zimnie Gory ash 555.3 Ma (Martin et al. 2000). Refs o:animals, o:bilaterians, o:molluscs, o:ediacaran-biota.
4. **The puzzle of the Ediacara Hills** (555 Ma, Nilpena / Ediacara Hills): Sprigg 1946, Spriggina, Ikaria (Evans et al. 2020, UC Riverside), competing interpretations. Refs e:ediacara-hills, o:ediacaran-biota, o:bilaterians.
5. **The first shells, and the first drills** (550 Ma, Nama Group, Namibia): Cloudina, predatory borings in up to 20 per cent of tubes in places. Refs o:animals, o:ediacaran-biota.
6. **Burrows mark the Cambrian's start** (538.8 Ma, Fortune Head): Treptichnus pedum, the GSSP, its known flaw. Refs e:cambrian-explosion, o:bilaterians.
7. **A burst of new body plans** (535 Ma, Meishucun, Yunnan): small shelly fossils, 13 to 25 million years for most body plans, the "why" debate (oxygen, predation, genes, ecology) and Wood et al. 2019 pulses. Refs e:cambrian-explosion, o:molluscs, o:sponges, o:brachiopods, o:arthropods, o:animals.
8. **Eyes, hunters and armour** (521 Ma, Siberia; second site Emu Bay Shale 513 Ma): first trilobites, radiodonts, Anomalocaris eyes (Paterson et al. 2011, via Wikipedia), Parker's "light switch" and its critics. Refs o:trilobites, o:arthropods.
9. **Windows into an early Cambrian sea** (518 Ma, Chengjiang; sites Sirius Passet and Qingjiang). Refs e:chengjiang, o:arthropods, o:chordates, o:sponges, o:cnidarians, o:trilobites.
10. **The first animals with backbones** (518 Ma, Haikou): Haikouichthys, Myllokunmingia, the 2026 four-eyes study (Lei et al., Nature 650). Refs o:jawless-fish, o:chordates, e:chengjiang.
11. **The strange animals of the Burgess Shale** (508 Ma, Yoho; second site Marble Canyon): Opabinia, Hallucigenia, Wiwaxia, Pikaia; Marble Canyon (found 2012, published 2014). Refs e:burgess-shale, o:arthropods, o:chordates, o:molluscs, o:trilobites.
12. **Epilogue: the survivors of Fezouata** (485 Ma on the timeline; Zagora, Morocco): Burgess Shale-type animals into the Ordovician (Van Roy et al. 2010), Aegirocassis (Van Roy et al. 2015), link to the Great Ordovician Biodiversification. Refs o:arthropods, o:trilobites, o:echinoderms, o:sponges.

## Dates compared with existing project data

- All event and group dates reused match `events-a.json` and `origins.json`: Mistaken Point 570 (range 575 to 560, ash 565), Ediacara Hills 555, base of Cambrian 538.8, trilobites 521, Chengjiang / chordates / jawless fish 518, Burgess Shale 508, animals and bilaterians 558, Cambrian end 486.85 (periods-a).
- **Fezouata.** The coordinator's brief gives c. 485 to 478 Ma. The sources I read give narrower ages for the fossil beds: Van Roy et al. 2010 say about 480 to 472 Ma (Lower and Upper Fezouata formations); Saleh and colleagues say about 479 to 478 Ma (late Tremadocian) for the main Lagerstätte beds; Lefebvre et al. 2018 place the lower exceptional interval in the upper Tremadocian and the upper one in the middle Floian. Because chapters must lie inside the story span, the chapter sits at ma 485 with the label "c. 485 to 478 million years ago", and the text says the richest beds are about 480 million years old. The site entry uses ma 480.
- **Anomalocaris size.** The existing `e:burgess-shale` text says Anomalocaris was "almost a metre long". Current Wikipedia (citing recent measurements) says the 1 m estimate is now considered unlikely: largest complete A. canadensis specimen about 20.5 cm, estimated body length 34 to 38 cm without appendages. I avoided giving a size in this story. The existing event text may want correcting.
- **Base-of-Cambrian GSSP ratification.** Wikipedia's Cambrian article gives 1992 (infobox) and 1994 (text); the Fortunian article gives 2007 for the Terreneuvian/Fortunian naming. I did not state a year.
- **Marble Canyon age.** The site entry uses ma 507 as "slightly older than or about the same as the Walcott Quarry". I could not confirm a precise age on a fetched page; treat it as approximate (same Burgess Shale Formation).

## Disputed points (both sides)

- **What the Ediacaran creatures were** (chapter 4, evidence "disputed"): animals (Dickinsonia, Kimberella, Ikaria; majority view, backed by the 2018 cholesterol finding) versus giant protists, lichens (Greg Retallack, broadly rejected), or the separate extinct group Vendobionta (Adolf Seilacher). Rangeomorph feeding: osmotrophy versus filter feeding (Wikipedia: Rangeomorph).
- **Dickinsonia cholesterol** (chapter 3): Bobrovskiy et al. 2018 (Science) say it proves animal affinity; Love and Zumberge 2021 argued the link between the cholesterol and the fossils is not definitive. Kept mainstream, hedged in evidenceNote.
- **Kimberella as a mollusc relative** (chapter 3): Fedonkin and Waggoner 1997 and others see it as mollusc-like (radula-type scratch marks Kimberichnus); others call it only a "probable bilaterian". Text says "many think ... though not all agree".
- **Why the Cambrian explosion happened and how fast** (chapter 7, evidence "disputed"): oxygen (correlation with diversity; Butterfield 2009 sees no forcing role), predation/arms race (Dawkins and Krebs 1979; but predation existed earlier), eyes / "light switch" (Andrew Parker 2003; many doubt it), developmental genes such as Hox (deRosa 1999; critics say this alone does not explain the timing), ecology and ecosystem engineering (the Cambrian substrate revolution). Speed: 13 to 25 million years in the classic view; Wood et al. 2019 argue for several pulses beginning at least 571 Ma in the Ediacaran; molecular clocks put many group origins much earlier but vary by a factor of two.
- **Light-switch hypothesis** (chapter 8): presented as Parker's idea, with "many scientists doubt" (Wikipedia: Cambrian explosion).
- **Haikouichthys and Myllokunmingia** (chapter 10): separate genera (Conway Morris and colleagues) or taphonomic variants of one animal (Hou et al. 2017). The four-eyes interpretation (Lei et al. 2026) is new; flagged in evidenceNote as still being tested.
- **Hallucigenia's relationships**: stem velvet worm versus basal panarthropod. Not discussed in the text beyond "spiny worm on legs".
- **Wiwaxia**: mollusc relative (majority, radula-like mouthparts) versus annelid (Walcott). Text says "probably a relative of the molluscs".
- **Cloudina's maker**: annelid / polychaete versus cnidarian; 2020 Nevada study supports a bilaterian. Text avoids naming a group.

## Left out, and why

- Sinsk event / Botomian extinction (c. 513 Ma): would need its own chapter; not in the brief.
- Archaeocyath reefs, Kalkarindji flood basalts, Shuram carbon excursion: interesting but beyond the 12-chapter limit.
- Chengjiang discoverer by name (Hou Xianguang): the Wikipedia page I read gives only "the 1984 discovery of the naraoiid Misszhouia", so I did not name him.
- Emu Bay Shale has its own exceptional fauna; used only as a second site for radiodont eyes.
- Specific size of Anomalocaris (see dates section).

## Coordinates not verified on a page (approximate)

- **Zimnie Gory cliffs, White Sea**: no fetched page gave coordinates; I used the Winter Coast (Wikipedia: 65.49 N, 39.89 E), on which Zimnie Gory lies. The true cliff position may differ by tens of kilometres.
- **Nama Group (Cloudina)**: used the Wikipedia infobox point for the Nama Group (23.90 S, 16.70 E); the Zaris Formation Cloudina localities are in the same region but not pinned.
- **Meishucun section**: used Kunyang Subdistrict, Jinning (Wikipedia: 24.67 N, 102.59 E); the section lies in the Kunyang phosphate district, but no fetched page gave its exact point.
- **Earliest trilobites, Siberia**: reused `origins.json` trilobites point (127.3, 61.1).
- **Sirius Passet**: 82.79 N, 42.23 W from search-result snippets of Wikipedia and Harper et al. (Durham repository); the Wikipedia page I fetched did not print the coordinates.
- **Qingjiang biota**: used the county coordinates of Changyang (Wikipedia: 30.47 N, 110.87 E); the find spot on the Danshui River is not published precisely.
- **Marble Canyon**: the exact site is kept secret by Parks Canada and the ROM; I placed it at Marble Canyon in Kootenay National Park (approx. 51.19 N, 116.12 W), not verified on a page.
- **Fezouata**: placed north of Zagora (Zagora town per Wikipedia 30.33 N, 5.84 W); the Jbel Tizagzaouine sites are some kilometres north; position approximate.
- **Haikou (Ercaicun)**: reused origins.json point (102.57, 24.78).

## Images

26 new images (all looked at as ~800 px thumbnails in `data/prehistory/raw/story-cambrian/`) and 8 reused from `images.json`
(snowball-earth-globe, fractofusus-seafloor, dickinsonia-fossil, ediacaran-diorama-field-museum, anomalocaris-hunting,
hallucigenia-on-sponge, opabinia-seafloor, fezouata-biota-scene). Image URLs follow the coordinator's rule (1920 px thumbnail if
the original is at least 1920 px wide, else 1280, else 960, else the original file); width, height and type added to each.
Licences and credits are as stated in the Commons file metadata (LicenseShortName and Artist fields).

Licence and content notes:
- **cloudina-reconstruction** and **small-shelly-fossils-shaanxi** are figures from journal papers (Becker-Kerber et al.; Luo et al.) uploaded to Commons as CC BY-SA 4.0. Journal articles are often CC BY rather than BY-SA; the Commons tag is what is recorded. The Cloudina drawing carries number labels whose key is in the original paper.
- **charnia-masoni-cast** is a photo of a museum replica of the Charnia holotype from Charnwood Forest, England, used in the Mistaken Point chapter as an example of a rangeomorph frond (noted in the image note).
- **cryogenian-ediacaran-boundary-enorama** shows the end of the Marinoan glaciation in South Australia (635 Ma), not the Gaskiers deposits; no openly licensed photo of the Gaskiers diamictite was found.
- **anomalocaris-eye-emu-bay**: the Commons description says only "Fossilised Anomalocaris eye preserved in pyrite" (University of New England photo); that it is the Emu Bay Shale specimen of Paterson et al. 2011 is likely but not stated on the file page, so the caption does not name the site.
- **olenellus-trilobite-vermont** and **haikouichthys-fossil-ivpp** are museum photos that include display labels or ink outlines.
- **haikouichthys-reconstruction** (2024) shows one pair of eyes; the 2026 four-eyes study came later (noted).
- **pikaia-reconstruction**: Pikaia's anatomy was reinterpreted by Mussini et al. 2024; reconstructions differ (noted). A second Pikaia image (Alopesc) was rejected because it carries an e-mail watermark.
- **aegirocassis-reconstruction** includes the artist's signature "Jun (@ni075)" in a corner.
- **treptichnus-pedum-diagram** is a line drawing of the burrow pattern, typed as "reconstruction"; the photo of T. pedum at the Fortune Head GSSP (Martin Smith) was rejected because the burrow is not visible at thumbnail size.
- Original-file URLs (used for Kimberella quadrata and Ikaria, which are under 960 px wide) are throttled for scripted requests (HTTP 429 with Retry-After 600) but load normally in browsers.

## HTTP check

HEAD requests on all 26 new image URLs: 24 returned 200. Two original-file URLs (images narrower than 960 px, so the rule says
use the original) returned 429 both times, the second time after waiting the full 600 s Retry-After:
`ikaria-wariootia-reconstruction` (593 px) and `small-shelly-fossils-shaanxi` (590 px). The Kimberella quadrata original
(696 px) returned 200. The 500 px thumbnails of both throttled files returned 200, so if the originals stay blocked, the
fallbacks are `.../thumb/3/36/Ikaria_wariootia.jpg/500px-Ikaria_wariootia.jpg` and the matching 500px thumbnail of the
small shelly fossils figure.

## Source check, 2026-11-22

Every chapter's title, dateLabel, text, species, site notes and evidenceNote re-checked against the cited pages (all
fetched again, about one request every 2 s per site), with extra sources where a cited page did not settle a claim.

Corrections:
- [burst-of-body-plans] text: "mostly one or two millimetres long" → "many only a few millimetres long" — the cited page gives "many only a few millimetres long" (and notes they are "not always small"); "one or two" was over-precise — https://en.wikipedia.org/wiki/Small_shelly_fauna
- [eyes-hunters-armour] text: "hold at least 16,000 lenses each" → "some with at least 16,000 lenses" — Paterson et al. 2011 eyes range from more than 3,000 lenses to at least 16,000 in some of them, not every eye — https://en.wikipedia.org/wiki/Emu_Bay_Shale
- [burgess-shale-oddities] text: "Pikaia, about 5 centimetres long" → "Pikaia, up to about 5 centimetres long" — average length about 3.8 cm; Walcott's longest individuals were 5 cm — https://en.wikipedia.org/wiki/Pikaia
- [fronds-of-mistaken-point] sources: added Matthews et al. 2020 (GSA Bulletin) — none of the cited pages gave the 565 Ma ash age in the text; this paper dates the E Surface to 565.00 ± 0.64 Ma and the oldest complex macrofossils at the reserve to 574.17 ± 0.66 Ma, which also supports "within about ten million years" of the Gaskiers in chapter 1 — https://ora.ox.ac.uk/objects/uuid:8891e6c5-3fef-459e-a45d-3a8ab82d4cae
- [burgess-shale-oddities] sources: "Royal Ontario Museum: Human's oldest ancestor found in Burgess Shale" → "Wikipedia: Pikaia" — the 2012 ROM release (live, HTTP 200) gives no size and calls Pikaia "the most primitive known vertebrate", which is outdated; the Wikipedia page gives the size, the chordate features and the 2024 reinterpretation, keeping the list at 5 sources — https://en.wikipedia.org/wiki/Pikaia

No "ma" values changed. All dateLabels agree with their ma.

Dead or replaced sources:
- None dead: all 40 distinct cited URLs (45 citations) returned HTTP 200 (the Caltech record redirects to its new address, authors.library.caltech.edu/records/32kvn-fa184; the Cambridge Meishucun page redirects to its /abs/ address).
- Replaced (not dead): the ROM Pikaia release, as above.

Softened or not confirmed on a fetched page:
- [white-sea-first-animals] "the oldest animal confirmed by chemistry" is the ANU release's own claim; the Love and Zumberge (2021) doubt is already in evidenceNote. Kept.
- [garden-of-ediacara] Ikaria "the size of a grain of rice" and its link to the burrows are not on the short UC Riverside page now online (it gives "tiny, wormlike" and "earliest bilaterian"); they match the 2020 PNAS paper as widely reported. Spriggina's "segmented body": Wikipedia (Ediacaran biota) notes its "segments" are offset halves (glide reflection), not true segments. Both left as written.
- [fezouata-epilogue] the dateLabel "c. 485 to 478 million years ago" runs from the base of the Fezouata Formation to the main late Tremadocian beds; the upper exceptional interval is mid-Floian (about 474 Ma). Left, as the text gives "about 480 million years" for the richest beds.
- [after-the-ice] Wikipedia gives two durations for the Gaskiers glaciation (about 250,000 years in its own article, 350,000 in Snowball Earth); the text's "a few hundred thousand years" covers both.

Counts: 12 chapters checked; 42 pages fetched and read (the 40 distinct cited URLs, plus Wikipedia: Pikaia and Matthews et al. 2020 on ORA, both now cited; a Memorial University news page tried along the way returned 404 and is not used); 5 corrections (3 text, 2 sources), 0 ma changes.
