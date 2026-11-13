# Contributing to The World Atlas

Thanks for helping. Corrections to borders, dates and history text are the most useful contributions; every one is
checked against a source before it goes on the map at https://www.worldatlas.site.

## Report a mistake or suggest something

Open an issue and pick a template:

- **Border or date fix**: a realm drawn in the wrong place, too big or small, in the wrong years, or under the wrong name.
- **History text correction**: a wrong fact, ruler, date or spelling in a chapter, realm profile, war or moment.
- **Suggestion**: a feature, a missing realm or people, or anything else.

Please give the year, the realm or place, what is wrong and a source (a scholarly book or paper, an atlas, or a
Wikipedia article with references). A link like `https://www.worldatlas.site/#1683/Ottoman Empire` shows exactly
what you saw. If the error is in the underlying border data, consider reporting it to
[Cliopatria](https://github.com/Seshat-Global-History-Databank/cliopatria) as well, so every user of the dataset benefits.

## Send a fix as a pull request

1. Fork the repository and create a branch from `main`.
2. Make the change (see below for where things live) and run the site locally:
   `python3 -m http.server 8765 --directory public`, then open http://localhost:8765.
3. Open a pull request against `main` and fill in the template. Keep one fix per pull request.

Only the maintainer merges into `main` and deploys the site. Pull requests are reviewed by hand; a fix may be
reworded or applied differently, and you will be credited in the commit.

### Where things live

| To change | Edit | Then run |
|---|---|---|
| A realm's name, years, or a piece to hide, crop or cut | `content/corrections.json` (`realms`) | `python3 -I tools/content.py` and `python3 -I tools/placeindex.py` |
| A border shape before 1992 (move, copy or add a shape) | `content/borders/patches.json` | the border steps in the README (needs the raw sources) |
| Chapter text (the state of the world in a year) | `content/eras/*.json` | `python3 -I tools/content.py` |
| Realm profiles (rulers, story, links) | `content/empires/*.json` | `python3 -I tools/content.py` |
| Wars, moments, journeys | `content/wars/`, `content/moments*.json`, `content/journeys/` | `python3 -I tools/content.py` |
| The app itself | `public/app.js`, `public/style.css`, `public/index.html` | nothing; reload the page |

Every correction in `content/corrections.json` and `content/borders/patches.json` carries a `note` saying what was
wrong and a source; please add both. Commit the generated files under `public/data/` that the build step rewrites.
The raw datasets in `data/` are not in the repository; if your fix needs a rebuild you cannot run, open the pull
request with the source edit only and say so.

### Style

- Plain, specific English: say what happened, when and where. Dates as "1683" or "c. 1450"; BCE years as negatives in data.
- No new dependencies or build tools; the site is static HTML, CSS and JavaScript.
- Python tools run with `python3 -I` and use only the standard library.

## Licence

By contributing you agree that your contribution is released under the repository's [MIT licence](LICENSE).
Data you add must be compatible with the sources table in the README (public domain, CC BY, CC BY-SA or your own work).
