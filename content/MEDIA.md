# Period newspapers and photos: brief

For events after 1850, readers see a **newspaper clipping** from the time (the front-page headline) and **photos**,
where openly licensed ones exist. You find and verify them.

## What qualifies (strict)
- **Licence:** public domain or a free licence (CC0, CC BY, CC BY-SA, PD-US, "no known restrictions"). No fair-use,
  "all rights reserved", or non-commercial-only items. Record the licence exactly as the source states it.
- **Sources, in order of preference:**
  - Newspapers: Library of Congress *Chronicling America* (US newspapers to 1963), via loc.gov
    (`https://www.loc.gov/collections/chronicling-america/?q=…&dates=YYYY-MM-DD/YYYY-MM-DD&fo=json`) or chroniclingamerica.loc.gov.
    LoC states its digitised newspapers are believed to be public domain. Also public-domain front pages on Wikimedia Commons
    (e.g. category "Front pages of newspapers"), Trove (Australia), Gallica (France), Delpher (Netherlands) where the item is
    marked public domain.
  - Photos: Wikimedia Commons (free licence or PD, check the file page), Library of Congress Prints & Photographs ("No known
    restrictions"), US National Archives / NASA / US military (US federal works are public domain).
- **Relevance:** you MUST look at every image before using it: download it into your scratchpad and open it with the Read
  tool. A newspaper must carry a headline about this event, from within a few days of it. A photo must show this event,
  its people or its place at that time. If nothing qualifies, return an empty list. Never guess.

## Images to link
- Link images that load directly in a browser (`https://`), 600–1000 px wide, from the source's own servers
  (upload.wikimedia.org thumbnails, loc.gov `image_url`/IIIF, tile.loc.gov). Check each URL returns an image (HTTP 200, image/*).
- **Newspaper clipping:** crop to the top of the front page so the headline is readable. Use IIIF where the server supports it
  (e.g. `…/pct:0,0,100,32/800,/0/default.jpg`), or the source's own thumbnail of the page if cropping isn't possible.
  Look at the crop to confirm the headline is visible.

## Output
`content/media/<slice>.json`: an object mapping an item key to a list (max 1 newspaper + 2 photos per item):
```json
{
  "moment:cuban-missile-crisis": [
    { "type": "newspaper", "image": "https://…", "page": "https://www.loc.gov/resource/…/",
      "publication": "Evening Star (Washington, D.C.)", "date": "1962-10-22",
      "caption": "Front page: “Kennedy orders blockade of Cuba”", "credit": "Library of Congress, Chronicling America",
      "license": "No known restrictions (public domain)" },
    { "type": "photo", "image": "https://upload.wikimedia.org/…", "page": "https://commons.wikimedia.org/wiki/File:…",
      "caption": "U-2 reconnaissance photo of a missile site at San Cristóbal, 14 Oct 1962", "credit": "US Department of Defense",
      "license": "Public domain (US federal government)" }
  ]
}
```
Keys: `moment:<moment id>`; `war:<war id>:<event index>`; `journey:<journey id>:<event index>` (indices are 0-based positions in
the item's `events` array as stored in content/wars or content/journeys).
Also write `content/factcheck/media-<slice>.md`: per item, what you used or why nothing qualified.
Be polite to servers: about 1 request per second, honour HTTP 429 Retry-After, User-Agent "AtlasOfEmpires/0.1 (educational map)".
