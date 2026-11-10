# Storyboard: Peloponnesian War (431–404 BCE)

File: `content/cinema/peloponnesian-war.json`. 9 chapters, 53 claims (all pass), 50 occupied areas (64 keyframes), 27 arrows, 4 battles, no fronts.
Check: `check_history.py`: 0 errors, 3 warnings (below). `validate.py`: no errors.

## Chapters and why
1. **Plataea and the invasions of Attica** (Apr 431 – Jun 430): the opening blow and Pericles' strategy; the 431 and 430 invasions as temporary Spartan areas, plague in 430.
2. **Pylos and Sphacteria** (May–Sep 425): the Spartan surrender, the war's biggest shock.
3. **Brasidas in Thrace** (Aug 424 – Apr 421): Acanthus, Amphipolis, Torone; Cleon retakes Torone; Amphipolis 422; Peace of Nicias.
4. **The Sicilian expedition** (Jul 415 – Sep 413): Catana base, Epipolae, Gylippus, Demosthenes, retreat from 13 Sep 413 to the Assinarus.
5. **Decelea and the loss of Euboea** (Mar 413 – Nov 411): fort at Decelea, Oropus lost, Euboea revolts after Eretria (Sep 411).
6. **Ionia revolts, Persia pays** (May 412 – Aug 411): Chios, Erythrae, Clazomenae, Miletus, Rhodes; Samos stays loyal.
7. **The war for the Hellespont** (Jul 411 – Jun 407): Abydos, Byzantium revolts, Cyzicus (410), Alcibiades retakes Selymbria and Byzantium (408).
8. **Arginusae and Aegospotami** (Jul 406 – Dec 405): Lampsacus stormed, the fleet destroyed, the allies (Lesbos, Byzantium) lost; Samos holds.
9. **The surrender of Athens** (Oct 405 – 25 Apr 404): blockade, Aegina restored, Pausanias at the Academy, surrender.
Left out as chapters (no lasting change of ground): Mytilene 428–427, Delium 424, Mantinea 418, Melos 416.

## How it is drawn
- The base map has **no Athenian realm**: Attica, Euboea, the islands and the Ionian/Thracian/Hellespont coasts are unrecorded land (only the Peloponnesian League, Achaemenid Empire, Odrysians, Macedon and "Greek City-States" are mapped). The Delian League is drawn as side-0 areas by district (Attica, Euboea, Cyclades, Lesbos, Samos, Chios group, southern Ionia, Rhodes, Cos, Chersonese, Byzantium group) and as small circles for single cities (Eion, Potidaea, Abydos, Lampsacus, Cyzicus); revolts switch a district to a side-1 area on the sourced date.
- Small enclaves come first in the list because the map takes the first area containing a point (Decelea inside Attica, Plataea inside Boeotia, Oreus inside revolted Euboea, Eion beside Amphipolis).
- `baseYears`: 1 Jan – 24 Apr 404 BCE uses 405 borders, because the 404 data already puts Athens inside Sparta's alliance.
- Geometry traced from the Commons map "The Athenian Empire at the brink of the Peloponnesian War (431 BCE)", the Sicilian Expedition map and the Delian League campaign map; town positions from modern coordinates.

## IMPORTANT display limitation (needs an app change, not in my files)
`drawOccupations()` in `public/app.js` (and the `notown` clip in `render_frames.py`) clips occupied areas to **recorded states not on the occupier's side**. Unrecorded land is never painted, so almost all of the Delian League areas (Attica, Euboea, islands, Ionian and Thracian coasts) are **invisible on the main map**, although the claims pass (the checker counts unrecorded land as occupiable) and the chapter thumbnails show them. Suggested fix: clip to `landClip` minus own-side states instead of to the union of other states.

## Uncertainties and choices
- Ancient dates give seasons, not days: invasion windows (late May–July 431, c. 40 days in 430), Brasidas's captures (Acanthus late summer 424, Amphipolis and Torone winter 424/3), Euboea's revolt (after the battle of Eretria, Sept 411), Byzantium's recovery (408, claim placed in March 407 to be safe) and Aegospotami (late summer 405) carry approximate days.
- Oreus is shown held by Athens after the Euboean revolt (Thucydides 8.95), but no fetched page states it, so it has no claim.
- Lampsacus's brief revolt in 411 and Cyzicus's first revolt in 411 are omitted; Cyzicus is shown taken by Mindarus in spring 410 and retaken after the battle.
- Scione/Mende revolts (423) and Scione's fall (421) are not drawn (Pallene stays Athenian).
- Syracuse is drawn as a side-1 area (Sparta's ally), though it is not a listed side member.
- Naval battles without casualty figures in people (Cynossema, Abydos, Cyzicus, Notium, Arginusae, Eretria) are not in `battles`.

## Warnings left
- Arrow "Athenian retreat … to the Assinarus" ends on neutral ground: the army was destroyed in the open countryside, not on held ground.
- Chapter 2 (Pylos): little visible change (26 km²) – the Athenian fort and the island are tiny by nature.
- Chapter 4 (Sicily): 733 km² – the Athenians held only Catana–Naxos and their siege lines.

## Sources fetched
Wikipedia: Peloponnesian War, Delian League, Archidamus II, Plague of Athens, Battle of Pylos, Battle of Sphacteria, Battle of Amphipolis, Brasidas, Battle of Potidaea, Sicilian Expedition, Decelea, Battle of Eretria, Astyochus, Mindarus, Battle of Cynossema, Battle of Abydos, Battle of Cyzicus, Alcibiades, Battle of Arginusae, Battle of Aegospotami, Lysander, Siege of Melos, Thirty Tyrants, Siege of Plataea; Commons maps listed in the file. (Britannica pages were blocked to automated fetches.)
