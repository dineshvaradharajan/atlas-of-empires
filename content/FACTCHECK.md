# Fact-check brief: Atlas of Empires content

Goal: make every factual statement in the atlas's written content accurate and cited, so readers
can trust it and follow the references. Read `content/BRIEF.md` for context (regions, audience, style).

## What you check
Every checkable claim in your slice: years and date ranges, rulers and reign dates, capitals,
battles and events, who conquered whom, founding and fall dates, population and area figures,
superlatives ("largest", "first"), and causal statements that make a factual assertion.

## Sources: what counts
Use web search and fetch pages to verify. Prefer, in order:
1. Encyclopaedia Britannica (britannica.com), Oxford/Cambridge reference works, university, museum or
   national-library pages (e.g. metmuseum.org Heilbrunn Timeline, British Museum, Smithsonian),
   Seshat Global History Databank (seshat-db.com), World History Encyclopedia only for basics.
2. English Wikipedia articles, used for statements that are themselves cited there.
3. Peer-reviewed papers and academic books (Google Books / publisher pages) for figures such as
   empire areas: Taagepera (1978, 1979, 1997) and Turchin, Adams & Hall (2006) for peak areas.
Never cite blogs, forums, AI-generated sites, or quiz/trivia pages. Where reputable sources disagree,
keep the mainstream view and hedge in the text ("c.", "by some estimates").

## What you change
- Fix wrong facts in place. Keep the existing writing style, length and structure; change only what's wrong
  or misleadingly imprecise. Don't add new topics.
- Add a `"sources"` array to EVERY item you check (each era object / each profile):
  `[{"title": "Britannica: Ottoman Empire", "url": "https://www.britannica.com/place/Ottoman-Empire"}]`
  2–6 entries, the pages you actually used, real URLs you fetched (never guessed URLs).
- Profiles only: verify `peak.areaKm2` and `peak.year` against Taagepera/Turchin where those exist; put the
  scholarly estimate and its source in `peak.note` (e.g. "c. 5.0M km² (Taagepera 1979)").
- Never touch these fields: `year`, `id`, `map`, `clio`, `aliases`, region keys, JSON structure.
- Keep the file valid JSON (validate with `python3 -c "import json;json.load(open(PATH))"` after edits).

## Change log
Write `content/factcheck/<your-slice>.md`: one line per correction:
`- [item] field: "old" → "new" — reason — <source URL>`
then a short "Unverifiable / disputed" list of claims you softened or couldn't confirm, and a count:
items checked, corrections made.
