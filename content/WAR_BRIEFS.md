# War briefs: who fought, how big, how it was won, what it changed

Each war story opens with **the sides** (who took part, how big their armies were, who led them) and closes with
**the outcome** (who won, the strategies that decided it, what it cost and what it changed). Strategies also appear
in the middle of the story, at the stage where they happened. You write that data, one file per war:
`content/war-briefs/<war-id>.json`.

Read `content/FACTCHECK.md` first: the same source rules apply. Fetch every page you cite, and prefer Britannica,
university, museum and national-archive pages. Use English Wikipedia only for statements it cites itself. Never invent
URLs or figures. Where historians disagree, give the mainstream range and hedge ("c.", "perhaps", "by most estimates").
Stay neutral on contested politics: describe what each side did and say, not who was right.

Before writing, read the war in `content/wars/*.json` (its `sides`, `summary`, `casualties` and `events`) and its stages in
`content/cinema/<war-id>.json` (`chapters[].id`, `title`, `start`, `end`, `text`). Your brief must agree with them. If you
find an error in those files, don't edit them: note it in your change log.

## Writing
These lines are read by the public on a phone, one card at a time, like a short story. Write plain, vivid English
about the history: people, armies, places and decisions. Never mention maps, data, sources or this project. Short
sentences. No jargon without a gloss. British spelling is fine; be consistent within a file.

## Output: `content/war-briefs/<war-id>.json`
```json
{
  "war": "american-civil-war",
  "hook": "Eleven slave states broke away to keep slavery; the Union went to war to hold the country together.",
  "sides": [
    {
      "strength": "c. 2.1 million",
      "strengthWhat": "served over the war",
      "who": "23 Northern states, including the border slave states of Kentucky, Missouri, Maryland and Delaware",
      "leaders": ["Abraham Lincoln", "Ulysses S. Grant", "William T. Sherman"]
    },
    {
      "strength": "c. 750,000–1 million",
      "strengthWhat": "served over the war",
      "who": "11 Southern states",
      "leaders": ["Jefferson Davis", "Robert E. Lee", "Stonewall Jackson"]
    }
  ],
  "winner": 0,
  "status": "ended",
  "result": "Union victory",
  "resultLine": "Lee surrendered at Appomattox in April 1865; the last Confederate armies gave up by June, and slavery was abolished.",
  "strategies": [
    {
      "side": 0,
      "name": "The Anaconda Plan",
      "text": "A naval blockade of the whole Southern coast and control of the Mississippi slowly choked the Confederacy's trade and split it in two.",
      "chapter": "western-rivers"
    }
  ],
  "impact": [
    "Slavery ended in the United States with the Thirteenth Amendment (1865).",
    "Some 620,000–750,000 soldiers died, more than in any other American war.",
    "The federal government emerged far stronger than the states."
  ],
  "sources": [
    { "title": "Britannica: American Civil War", "url": "https://www.britannica.com/event/American-Civil-War" }
  ]
}
```

### Fields
- `hook`: one sentence, 15–30 words. Why the war started, told as the opening line of a story.
- `sides`: one entry per side in the war's `sides` array, **in the same order**. Use `{}` for a side you can't fill.
  - `strength`: a short figure, the way a reader would say it: "c. 40,000", "c. 2.1 million", "60,000–70,000".
    Use the most widely quoted figure and keep it comparable across sides: the same basis for every side of one war.
  - `strengthWhat`: what the figure counts, 2–5 words: "served over the war", "at its peak", "at the start",
    "in the invasion army". Leave out `strength` and `strengthWhat` if no credible figure exists.
  - `who`: who took part on this side, 4–25 words. Name the main states or peoples, beyond the side's name.
  - `leaders`: 1–3 names, the best-known commanders or rulers, as readers know them.
- `winner`: the index of the winning side in `sides`, or `null` for a stalemate, a draw or a war still being fought.
- `status`: `"ended"`, or `"ongoing"` for a war still being fought at the end of its `span`.
- `result`: 2–5 words, the way historians usually sum it up: "Union victory", "Stalemate; armistice",
  "Coalition victory", "Still being fought".
- `resultLine`: one sentence, 15–35 words. How it ended: the surrender, treaty or armistice, with its date.
- `strategies`: 2–3 entries. The decisive or distinctive strategies, tactics or choices that won or lost the war, such as
  blockades, scorched earth, Fabian delay, guerrilla war, new weapons, alliances, sieges, deception and logistics.
  - `side`: the index of the side that used it.
  - `name`: 2–6 words, its usual name if it has one ("Fabian strategy", "Island hopping").
  - `text`: 20–40 words. What they did and why it mattered.
  - `chapter`: the id of the stage in `content/cinema/<war-id>.json` where it mattered most, or `null`.
  At least one strategy should explain how the winner won. For a war without a winner, explain why neither side could.
- `impact`: 2–4 short sentences, 10–25 words each. What changed afterwards: borders, empires, peoples, ideas or
  technology. Don't repeat `resultLine`.
- `sources`: 2–6 pages you actually fetched that support the figures, strategies and impact.

Validate each file with `python3 -c "import json;json.load(open(PATH))"`.

## Change log
Write `content/factcheck/war-briefs-<slice>.md`:
- one line per war listing the figures you chose and their source;
- the figures you couldn't pin down or that sources dispute, and how you hedged them;
- any errors you noticed in `content/wars` or `content/cinema`, which you did not edit.
