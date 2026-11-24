# The World Atlas: briefing for a code review

Project path: `/Users/dinesh/Projects/WorldHistory`
Live site: https://www.worldatlas.site · Repository: https://github.com/dineshvaradharajan/atlas-of-empires (branch `main`)
Written 24 November 2026, on top of commit `2ce27ab`.

This is context for a reviewer. `README.md` covers sources and licences; `CONTRIBUTING.md` says which file to edit for what.

## Ground rules

- Review only, unless asked to change something. **Do not commit, push or deploy** without the owner's explicit yes each time.
  `tools/deploy.sh` publishes to production; `sh tools/deploy.sh --dry-run` only builds (it exports HEAD, never uncommitted work).
- Leave these alone; they are other work in progress: `.claude/launch.json`, `content/factcheck/history-check-*.md`, `showcase/`,
  `data/wikidata-states.json`, `content/ONE_ATLAS_MOBILE.md`, `content/factcheck/portraits.md`.
- `.claude/worktrees/` holds five older checkouts of the same project. Exclude it from searches, or every hit appears six times.
- House style: static HTML, CSS and JavaScript with no framework, bundler or new dependencies. Python tools use only the standard
  library and run with `python3 -I` (`tools/paleo.py` is the exception: numpy and netCDF4 in `.venv-paleo`).
  Long lines and dense comments are deliberate; comments explain why, not what.
- Plain, specific English. Facts need a source. New pages use the atlas's own look.

## What it is

One timeline from the Earth's formation (4.57 billion years ago) to today:

- **World history** (10,000 BCE to 2026): a map of 1,706 named states and groups, plus reconstruction layers and archaeological cultures.
- **The Earth** (before 10,000 BCE): a WebGL globe of the ancient continents.
- **Earth history** (`/earth-history/`): an older, separate page with its own globe and stories.
- About 3,080 plain HTML pages for search engines and link previews, written at deploy time.

Content: 49 chapters, 219 empire profiles, 76 empire journeys, 169 moments, 30 wars, 1,708 short realm notes, 6 Earth stories.

## Run it

```bash
python3 -I tools/serve.py 8765     # http://localhost:8765, with no-cache headers
python3 -I tools/seo.py            # writes the plain pages and public/data/realm-pages.json (both gitignored)
```

Run `seo.py` once: `/realms/...` and `/earth/...` do not exist in a fresh checkout, and the share dialog needs them.
There is **no automated test suite**. Checks used so far: `node --check`, the read-only `tools/check_*.py` and `tools/maplint.py`
reports, and looking at the running page. Tools present here: Node 26, Python 3.14, wrangler.
`tools/content.py` rewrites files under `public/data/`, so do not run it just to look.

## Map of the code

| Part | Where | Notes |
|---|---|---|
| Home page | `public/index.html`, `public/one/one.js`, `phone.js`, `*.css` | Owns the timeline and the globe. World history runs in an iframe under it. |
| World history | `public/world.html`, `public/app.js` (4,985 lines, one IIFE), `public/style.css` | Map, cards, wars, journeys, moments, search. `grep "^// ---" public/app.js` lists its sections. |
| Frame glue | `public/one/hist-patch.js` | Makes `world.html` fit inside the home page (theme, hidden bars). |
| Earth history | `public/earth-history/` | `earth.js`, `earth.css` (Space look), `atlas.css` (light look). |
| Share dialog | `public/share.js`, `share.css` | Used by all three; from the iframe it opens on the parent page. |
| Release check | `public/release.js`, `relFetch` in `app.js`, `one.js`, `earth.js` | See "Caching". |
| Report an issue | `public/report/`, `functions/api/report.js` | Cloudflare Pages Function; emails through Resend; secrets live in the Pages project. |
| Plain pages | `tools/seo.py` | Also sitemaps, `llms.txt`, 404. |
| Share pictures | `tools/og.mjs` writing `public/og/` | Drives headless Chrome over its debugging port. |
| Deploy | `tools/deploy.sh` | Exports HEAD, stamps the release, builds pages, packs the map data, runs wrangler. |

Data: `content/` is the hand-written source; `public/data/` is mostly generated from it and committed. `public/data/clio/` holds the
borders in 64 time chunks; `index.json` there lists every realm. Raw datasets in `data/` are mostly not in git.

## Ideas to know before reading `app.js`

- **Feature keys.** A shape has `p.n` (its own name) and `p.k` (the group it is coloured with, such as `(Holy Roman Empire)`).
  They differ for group members. `S.sel` is the selected key; `matches(it, key)` tests both.
- **Layers.** Cliopatria states, then `content/corrections.json` (rename, hide, crop, cut), then reconstruction layers from
  `content/supplements/*.json` (`p.recon`). Corrected and reconstructed shapes are painted **last**, over ordinary ones.
- **Two renderers.** WebGL when available (`drawGL`, with a 2D canvas on top for lines and labels), otherwise all 2D (`draw`).
- **Addresses.** `#1492`, `#117/Roman%20Empire`, `#w/<war>`, `#e/<journey>/<year>`, `#m/<moment>`, `#earth/<million years>`,
  `#earth/s/<story>/<chapter>`. Anything after `#` never reaches a server, which is why the plain pages exist.
- **Card text for a realm:** a full profile (`empireOf`) if there is one, else a short note (`realmNote`, loaded on demand).
  A note may carry `wiki` to override a wrong link in the border data.

## Caching, the part most likely to surprise

- `app.js`, `style.css` and `/data/*` are served immutable for a year under `?v=<commit>`.
- During a rollout an edge server can return the **old** file under the **new** address, which browsers then keep. So every response
  carries `X-Release` (added to `_headers` by `deploy.sh`); `relFetch` refetches data on a mismatch, and `release.js` refetches
  scripts and styles and reloads once.
- Share pictures are cached for a day, so their address carries a hash of the file (`?v=<md5 prefix>`, `og_image` in `seo.py`).
- `index.html` must keep exactly six `one/...?v=N` references; `deploy.sh` stops otherwise.

## Recent work (newest first)

- the commit that added this file: share pictures repaint a realm on top when a corrected shape covers it (`S.ogTop`), six redrawn
- `2ce27ab` fingerprints in share picture addresses; share files stamped with the release
- `1584f75` share on the Earth history page; text on the Earth pictures
- `722775e` share on the Earth side; `/earth/` pages (22 periods, 6 stories) and their globe pictures
- `0c3e7c6` share dialog; share on realm cards
- `ab4a51e`, `067a582` a share picture for all 2,329 realm pages; shorter, relevant source lists; uncropped card images
- `92e5673` foldable notices on cards
- `a9b65cf` the `X-Release` stale-cache fix
- `7ce88b1` 65 new profiles, and a source-checked note for every other state

## State of the working tree

Nothing of this project's own is waiting to be committed. `git status` still lists the files named under "Ground rules" as other work in
progress; they are not part of the review.

## Where a review would help most

1. **`share.js`**: the click handler is attached only after `await sp.find()`, so the close button does nothing until the address
   lookup finishes (Escape works). Also check cross-frame use, focus return and the Instagram path. Sharing from a real phone has
   **not** been tested.
2. **Duplicated logic that must stay in step**: `reconSources()` in `app.js` and `recon_sources()` in `seo.py` (which sources belong
   to a reconstructed realm). It matches names in free text, so look for false matches and misses.
3. **Picture-only hooks in production code**: `window.atlasSelBox`, `S.ogFill`, `S.ogTop`. They should never run for readers. `ogTop`
   is painted only in `drawGL`, not in the 2D renderer.
4. **`release.js` and `relFetch`**: can they loop, reload during use, or add latency when the header is missing?
5. **Escaping and URLs**: cards are built with `innerHTML`; data should go through `esc()` and `safeUrl()`. The CSP is in `public/_headers`.
6. **`functions/api/report.js`**: the one server endpoint. Check abuse limits, input limits and what reaches the email.
7. **Performance**: `app.js` size, memory on phones, and `public/data` (about 125 MB on disk, loaded in pieces).
8. **Accessibility**: dialogs, focus order, contrast in the sage, midnight and Space looks, 44 px tap targets.

## Known issues, not yet fixed

- Some country dates look a year late (Barbados "since 1967", Equatorial Guinea "since 1969"): they follow the map data's years.
- Share pictures of far-flung states (Dutch Republic, New France, Belgium with the Congo) are framed to every possession, so the
  realm looks small. Kiribati, Fiji and the British Colonial Empire cross the date line and get the atlas's own view. The Clovis
  culture picture shows no shape.
- Source matching misses spelling variants (Baguirmi and Bagirmi) and keeps a few near misses (Hyderabad gets a Kashmir map).
- Relationship pages ("Allegiance of A to B") have no shape of their own on the map.
- `README.md` says 47 chapters; there are 49.
- Pushes to `main` bypass the repository's pull-request rule, and GitHub warns each time.
- `public/og` is committed, so each full redraw adds about 150 MB to the repository.
