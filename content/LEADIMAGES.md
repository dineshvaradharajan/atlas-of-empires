# Empire lead images: brief

Each empire page in the atlas gets **one lead picture** at the top: something a reader would recognise the
civilisation by, made **by that civilisation in its own time**. For example a monument, a building, a sculpture, a
painting, a mosaic, a manuscript page, a coin or a well-known artefact. **Do not use** maps, flags, coats of arms,
modern reconstructions, modern illustrations, modern re-enactments or film stills. A photo of a surviving monument
today is fine (the Colosseum for Rome, Angkor Wat for the Khmer Empire).

## What qualifies (strict)
- **Licence:** public domain or a free licence (CC0, CC BY, CC BY-SA, PD-Art). Record it exactly as the Commons file
  page states it, and the author/credit as stated there. No fair-use or non-commercial files.
- **Source:** Wikimedia Commons only. Use the Commons API to read the licence and author:
  `https://commons.wikimedia.org/w/api.php?action=query&titles=File:<name>&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=900&format=json`
  (`extmetadata.LicenseShortName`, `extmetadata.Artist`, `extmetadata.ImageDescription`; `thumburl` is the image to link).
- **Look at every image before using it:** download the 900 px thumbnail into your scratchpad and open it with the Read
  tool. It must clearly show what your caption says, be sharp and well lit, and be a landscape or square photo (it is shown
  about 470 px wide and 260 px tall, cropped to fill). Prefer the famous, instantly recognisable object over an obscure one.
- **Facts:** the caption must be accurate: what it is, where, and roughly when it was made (e.g. "The Great Pyramid of
  Khufu at Giza, built c. 2560 BCE"). Check the date against the Wikipedia article of the object.

## Output (only your own files)
`content/media/leads-<slice>.json`, an object mapping `empire:<empire id>` to a one-item list:
```json
{
  "empire:ancient-egypt": [
    { "type": "photo", "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/…/900px-….jpg",
      "page": "https://commons.wikimedia.org/wiki/File:….jpg",
      "caption": "The pyramids of Giza, built for the kings of the 4th Dynasty, c. 2600–2500 BCE",
      "credit": "<Artist as on Commons, plain text>", "license": "CC BY-SA 4.0" }
  ]
}
```
Check each `image` URL returns HTTP 200 with an image content type. If nothing good qualifies for an empire, leave it out.
Also write `content/factcheck/leads-<slice>.md`: per empire, the file chosen and why, or why nothing qualified.

Be polite to servers: about 1 request per second, honour HTTP 429 Retry-After, User-Agent
"AtlasOfEmpires/0.1 (educational map)". Your empire list is in content/media/leads/_slices.json under your slice name.
