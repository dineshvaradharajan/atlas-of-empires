# Story research brief (shared by every story researcher)

You are researching a STORY for the "Earth history" page of an educational web atlas (project at
/Users/dinesh/Projects/WorldHistory, page at public/earth-history/). The page shows a globe of the ancient Earth (real
reconstructed continents for the last 540 million years; before that an artist's impression) and a timeline. A story is a
sequence of chapters the reader steps through: each chapter moves the timeline to a date, turns the globe to a place,
pins fossil sites, shows pictures and tells one step of the story in a few plain sentences. Audience: curious readers
aged 14+. Plain English, no markdown in strings. Each chapter is ONE step anchored at ONE place where the evidence is found.

ALREADY IN THE PROJECT (reuse, don't duplicate): read content/prehistory/events-a.json, events-b.json, origins.json and
periods-a.json / periods-b.json. Where a chapter matches an existing event or group, list its id in "refs" as "e:<id>" or
"o:<id>". Your dates must agree with theirs, or explain the difference in your log.

SOURCE RULES (read content/FACTCHECK.md; they apply): verify every claim on a page you actually fetched; never invent or
guess URLs; cite only pages you opened. Prefer peer-reviewed papers, museum and university pages (Natural History Museum
London, Smithsonian NMNH, UCMP, Royal Ontario Museum, Australian Museum), and cited Wikipedia statements. Check for
findings of the last 5 years before settling a date. Where scholars disagree keep the mainstream view, hedge, and set
evidence to "disputed" with both sides in evidenceNote. Fetch politely (about one request every 2 s per site). No
personal or project details in requests.

PICTURES: for each chapter 2–4 openly licensed images from Wikimedia Commons (public domain, CC0, CC BY, CC BY-SA only):
current life reconstructions, scenes, fossil photos, and present-day places where the evidence is. LOOK at each image
before listing it (download an ~800 px thumbnail into a new empty folder data/prehistory/raw/story-<story id>/ and open
it with your image-reading tool). Record licence and credit exactly as stated, credit shortened to a name. First check
content/prehistory/images.json (and images-more.json if it exists) and reuse an existing entry by giving its "id" in
"imageIds" rather than listing it again.

DELIVERABLES (write only these):
1. content/prehistory/stories/<story id>.json :
{"id": "<story id>", "title": "...", "summary": "2 sentences", "from": Ma, "to": Ma,
 "chapters": [{"id": "kebab-id", "title": "at most 7 words", "ma": number (millions of years ago), "dateLabel": "c. 518 million years ago",
   "focus": [lon, lat] (present-day place the globe turns to), "place": "present-day place name",
   "text": "3-5 plain sentences: what happened and why it mattered",
   "species": ["...", ...] (1-6 key species or groups of this step),
   "sites": [{"name": "...", "lonlat": [lon, lat] (present-day find spot, 2 decimals), "ma": number, "note": "one short sentence"}] (1-4),
   "route": null,
   "refs": ["e:...", "o:..."], "imageIds": ["existing-image-id", ...],
   "images": [{"id": "kebab, unique", "image": "https://upload.wikimedia.org/... (1000-1600 px thumb URL)", "page": "https://commons.wikimedia.org/wiki/File:...", "caption": "one sentence", "credit": "as stated, short", "license": "as stated", "note": "anything dated or uncertain, or null"}],
   "evidence": "fossil | geology | disputed", "evidenceNote": "one plain sentence on how we know",
   "sources": [{"title": "...", "url": "..."}] (2-5)}]}
2. content/factcheck/prehistory-story-<story id>.md : what you included, left out and why; every disputed point with
   both sides and who holds them; any coordinate you could not verify on a page; image licence doubts.

VALIDATE: JSON parses (python3 -c "import json;json.load(open(PATH))"); chapter ids unique and kebab-case; chapters oldest
first and inside the story's span; every ref exists; every imageId exists; lon/lat plausible; every image URL returns
HTTP 200 (HEAD, slowly, retry on 429). Stdlib Python only; run Python that reads downloaded files with python3 -I.

REPLY with: chapter list (title, date, place), counts of new and reused images, disputed points, anything you could not verify.
