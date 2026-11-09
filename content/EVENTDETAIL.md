# Event details for empire journeys: brief

Each journey (content/journeys/*.json) has 8–15 `events`, each a one-line `text` (≤ 90 chars), e.g.
`{"year": -326, "text": "Alexander defeats Porus at the Hydaspes; his army mutinies at the Beas", "lonlat": [...]}`.
Readers want to understand each turning point. Add a `detail` field to EVERY event in your file.

## `detail`: 70–120 words, 3–5 sentences, plain English for a curious 14+ reader
1. **Context**: why this was happening (who, what was at stake).
2. **What happened**: the key facts (forces, leaders, outcome), with numbers only when sources agree.
3. **Consequence**: what it changed for the empire, especially its territory, power or survival. Tie it to the map
   ("the empire now reached the Indus", "Egypt was lost").
Example (Hydaspes): "After conquering Persia, Alexander crossed into the Punjab, where King Porus of the Paurava kingdom
blocked the Hydaspes (Jhelum) river with war elephants. In May 326 BCE Alexander crossed upstream at night in a storm and
defeated Porus, then confirmed him as a client king. Pushing east, his exhausted army refused to go beyond the Hyphasis
(Beas) river. The mutiny ended the expedition: Alexander turned back, and the Beas became the eastern limit of his empire."

## Rules
- Read `content/FACTCHECK.md`: the same source standards apply. Fetch what you cite; Britannica-tier or university/museum pages
  where they load, else Wikipedia statements that are themselves cited; hedge contested facts ("c.", "according to Arrian").
- Do NOT change `year`, `text`, `lonlat`, the event order, or any other field. Only add `detail` (and, if you used new pages,
  append them to the journey's `sources`, max 8 total).
- Fix an event's `text` only if it is factually wrong; log it.
- Edit only your own file. Keep valid JSON (indent 1, ensure_ascii False). Validate with
  `python3 -c "import json;json.load(open(PATH))"`.
- Log to `content/factcheck/eventdetail-<slice>.md`: count of details written, any `text` you corrected (old → new, source),
  and contested facts you hedged.
