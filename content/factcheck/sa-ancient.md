# South Asia layer pack: earliest states to 1000 CE (`sa-ancient`)

File: `content/supplements/sa-ancient.json` (layer id `sa-ancient`, -500 to 1000, `replaces: []`).
80 regions for 21 states, 18 capitals, 27 sources.

## States drawn

| State (key) | Years drawn | Base extent | Capital |
|---|---|---|---|
| Western Ganga dynasty | 350–999 (east Gangavadi to 469; with Sendraka and northern Kongu 470–849) | Mysore, Hassan, Mandya, Ramanagara, Chamarajanagar, Tumkur, Kolar, Bangalore districts | Kolar, then Talakad |
| Licchavis of Nepal | 400–879 | Kathmandu Valley and central hills (Gorkha to Dolakha) | Kathmandu Valley |
| Zhangzhung | -500–644 (visible area shrinks after 623, when the Tibetan Empire is drawn) | Western Tibet (Ngari), Ladakh, Spiti | Khyunglung |
| Hindu Shahis | 875–1000 | Kabul valley, Gandhara, northern Punjab | Kabul, then Udabhanda (Hund) |
| Emirate of Multan | 855–1000 | southern Punjab round Multan | Multan |
| Rai dynasty (Sindh) | 489–631 (drawn mainly from 534; White Huns cover Sindh before) | Sindh and the Multan district | Alor |
| Brahman (Chach) dynasty of Sindh | 632–712 | same | Alor |
| Vishnukundina dynasty | 420–623 | Krishna–Godavari coast, Nalgonda, Guntur | Denduluru (Indrapalanagara per some) |
| Eastern Chalukyas | 624–1000 | Vengi, Pithapuram | Pishtapura, Vengi, Rajamahendravaram |
| Kalachuris of Tripuri | 850–1000 | Dahala (Chedi) round Jabalpur | Tripuri (Tewar) |
| Chera Perumals | 844–1000 | Kollam to Koyilandy, Palakkad Gap to Vembanad | Mahodayapuram (Kodungallur) |
| Eastern Ganga dynasty (early) | 498–1000 | Srikakulam, Vizianagaram, southern Ganjam | Dantapura, Kalinganagara |
| Shailodbhava dynasty | 620–775 | Kongoda (Ganjam, Khordha, Puri) | Kongoda (Banapur) |
| Bhauma-Kara dynasty | 736–944 (Kongoda added from 776) | Toshala, coastal Odisha north of the Mahanadi | Guhadevapataka (Jajpur) |
| Somavamshi dynasty | 882–1000 (Utkala added from 945) | eastern Dakshina Kosala (western Odisha) | Yayatinagara (Binka), then Jajpur |
| Sharabhapuriya dynasty | 475–590 (visible only 555–590; Gupta and Vakataka cover it before) | Dakshina Kosala (Chhattisgarh) | Sharabhapura |
| Panduvamshis of Dakshina Kosala | 620–790 | Dakshina Kosala | Shripura (Sirpur) |
| Later Gupta dynasty | 550–750 (visible from 647; Maukhari and Harsha cover Magadha before) | Magadha (southern Bihar) | Magadha |
| Kalachuris of Mahishmati | 550–625 | Malwa, central Gujarat, northern Konkan, Nashik | Mahishmati |
| Andhra Ikshvakus | 210–325 | eastern Krishna valley | Vijayapuri (Nagarjunakonda) |
| Pauravas (Porus) | -330 to -316 (Jhelum–Chenab; to the Beas from -326) | Jhelum–Chenab doab, then to the Beas | unknown |

## Method and maps
- No historical Imperial Gazetteer plate covers these centuries at usable scale, so the extents were drawn
  by hand on a lon/lat grid from the regions named in cited statements (districts, rivers, towns). They were
  checked against Schwartzberg's plates on DSAL (c. 300–500, c. 550–700 and c. 700–975; fetched through
  DSAL's IIIF service). Those plates mark dynasties with labels, not boundary lines, so they confirm where each
  state was but not its exact edges. Nothing was copied from them. For the Western Gangas the Commons
  locator map `Western-ganga-empire-map.svg` was also used as a check.
- Base rings were smoothed (2 Chaikin passes). Then, at every year where a Cliopatria realm or another region
  of this layer changes, each base was cut back wherever the atlas already draws a state. A new time slice
  starts wherever the cut shape changes by more than 6%. Pieces smaller than 0.1 deg² were dropped. Regions of this
  layer never overlap each other (the largest shared area is about 1e-5 deg², from rounding coordinates to three
  decimals). The cutting order follows the priority in the table above.
- Because of this cutting, several states shrink or flicker where Cliopatria's own polygons change. Examples:
  the Eastern Chalukyas are reduced to slivers in 626–655 and 772–849, when Cliopatria's Chalukya and
  Rashtrakuta realms reach the coast. Kalachuri Tripuri and the Chera Perumals are partly covered by the
  Pratihara, Rashtrakuta and Pandya polygons.
- Renders of every 50–100 years were checked over the relief basemap. The scripts were kept in the scratch directory.

## Skipped, and why
- Chola dynasty: same state as the drawn Chola realms (Early Cholas, Chola Empire, and the Sangam layer).
- Hephthalites: Cliopatria draws them as "White Huns" (410–560). Kidarites are already drawn. The Alchon Huns
  are not drawn separately, because they would sit inside the White Huns and Hunnic polygons.
- Anuradhapura Kingdom: already drawn ("Anurādhapura", -291–1017).
- Kadamba, Vakataka, Kalabhra, Maitraka, Kamarupa, Pallava, Maukhari, Harsha, Karkota, Utpala, Gauda, Khadga, Chandra:
  already drawn by Cliopatria.
- Janapada and Pundravardhana: the main janapadas (Kuru, Panchala, Matsya, Surasena, Kosala, Vajji, Malla, Avanti,
  Ashmaka, Magadha) are already drawn as small Cliopatria polygons. Pundravardhana is a region, not a state.
- Guge (912–1630): its western Tibetan lands lie inside Cliopatria's "Tibetans" polygon (850–1259). Its founding
  falls in the 10th century, so it is left to the medieval layer.
- Thaton Kingdom (-299–1057): legendary before the 11th century (Southeast Asia).
- Champaner, Chamba, Suket, Kahlur, Barwani: tiny hill or fort states whose early foundation dates are traditional.
  They continued as princely states. Not drawn.
- Turk Shahis to 874: already drawn. The Hindu Shahis are drawn from 875 only, because Cliopatria's "Turk Shahis"
  (labelled Kabul Shahi) already covers 822–874.
- Patola Shahis of Gilgit, Kannauj after Harsha, the Gurjaras of Bhillamala, the Traikutakas, the Nalas: not drawn
  for lack of time and of good extents.

## Uncertainties
- Zhangzhung: the start date (c. 500 BCE) and the extent rest on late Bon and Tibetan tradition. Gilgit is not drawn.
  The conquest is dated 634 (Tang Annals) or 645 (Stein).
- Rai and Chach dynasties: known almost only from the 13th-century Chach Nama, whose reliability is debated.
- Bhauma-Kara start: the Bhauma era begins in 736 (Panigrahi) or in 831 (Sircar). 736 is used.
  The hand-over to the Somavamshis in the mid-10th century is approximate (945 is used).
- Shailodbhava end (775) and Later Gupta end (750) are approximate.
- Licchavi outer limits, the Chera Perumal eastern edge, and all edges in the hills are conventions.
- Sharabhapuriya dates are A. M. Shastri's estimates. Sircar and Mirashi put the dynasty 10–15 years earlier.
- Vishnukundina: some regnal dates overlap in the sources (Madhava Varma I c. 420–455, Madhava Varma II c. 440–460).
- Pauravas: Porus is known only from Greek sources. The end date (-316) uses his death "between 321 and 315 BCE".
