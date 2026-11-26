#!/usr/bin/env python3
"""Land colour for the deep-time globe: what the ground looked like from space, from simulated climate, every 20 million years
from 540 million years ago to today.

Source: Pohl, Wong Hearing, Franc, Sepulchre & Scotese 2022, "Dataset of Phanerozoic continental climate and Köppen–Geiger
climate classes", Data in Brief 43, 108424; data https://doi.org/10.5281/zenodo.6620748 (CC BY 4.0). FOAM climate-model runs on the
same Scotese & Wright paleogeography as public/data/paleo/<Ma>.webp, 28 slices (0, 20 ... 540 Ma), on a 128 x 128 grid
(2.8125 deg of longitude from 0 deg east, 1.40625 deg of latitude from the south pole).

Input : the 28 NetCDF files from All_NC_files.zip, unpacked into data/prehistory/koppen/nc/ (not committed).
Output: public/data/paleo/climate.png, 910 x 520 RGB: 7 x 4 tiles of 130 x 130, slice i (age 20*i Ma) at column i % 7, row i // 7.
        Each tile is the 128 x 128 grid with one wrapped column on each side and the edge rows repeated, so the page's bilinear
        sampling never bleeds into the next tile. Rows run south to north, columns from 0 deg east. one.js reads the same layout.

How a cell gets its colour:
  - its Köppen-Geiger class (Table 3 of the article: 13 rainforest, 12 monsoon, 11 savanna, 10 steppe, 9 desert, 8/7/6 temperate
    humid / dry summer / dry winter, 5/4/3 cold humid / dry summer / dry winter, 2 frost (ice cap), 1 tundra);
  - the plant cover of the time: no land plants before about 470 Ma (bare rock and soil), low plants by about 420 Ma, forests from
    about 370 Ma (as the article's Table 2 assumed for the model's own surface: rocky desert to 460 Ma, tundra to 380, forest after);
  - a little darker where the annual rain is heavier.
Sea cells take the class of the nearest land, so the page has a colour wherever its own (finer, 5-million-year) coastlines put land.
Ice sheets are not in the model; one.js adds them from geological evidence, and snow on high mountains.

The model runs cold in the north (Pohl et al. 2022, section 3.1), so its recent slices put tundra where Siberia and Canada have
boreal forest. For the last few million years, when the continents sit where they are now, the page blends towards today's climate:
  Beck, Zimmermann, McVicar, Vergopolan, Berg & Wood 2018, Present and future Köppen-Geiger climate classification maps at 1-km
  resolution, Scientific Data 5:180214; data https://doi.org/10.6084/m9.figshare.6396959 (CC BY 4.0). The 0.083-degree present map
  (Beck_KG_V1_present_0p083.tif, 30 classes; legend.txt) from Beck_KG_V1.zip, in data/prehistory/koppen/beck/tif/ (not committed).
Output: public/data/paleo/climate-now.png, 1024 x 512 RGB, longitude -180..180 and latitude 90..-90, the same colours by class,
        averaged over each pixel's land and with the sea filled from the nearest land.

Needs numpy and netCDF4, like tools/paleo.py:  .venv-paleo/bin/python tools/climate.py [nc folder]
"""
import os, struct, sys, zlib

import netCDF4
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AGES = list(range(0, 541, 20))
N, PAD, COLS = 128, 1, 7
TILE = N + 2 * PAD

# natural colours, as from orbit: with plants (VEG) and before them (BARE: rock and soil, rusty where wet, pale where dry)
VEG = {13: (.20, .42, .18), 12: (.27, .47, .20), 11: (.56, .58, .31), 10: (.72, .65, .45), 9: (.87, .75, .53),
       8: (.30, .48, .24), 7: (.56, .56, .36), 6: (.40, .52, .28), 5: (.22, .36, .22), 4: (.42, .46, .34), 3: (.30, .40, .26),
       2: (.93, .95, .97), 1: (.63, .61, .53)}
BARE = {13: (.47, .34, .27), 12: (.50, .37, .29), 11: (.62, .45, .33), 10: (.72, .55, .41), 9: (.80, .61, .45),
        8: (.48, .38, .31), 7: (.60, .47, .37), 6: (.55, .43, .34), 5: (.50, .46, .42), 4: (.56, .51, .46), 3: (.52, .48, .44),
        2: (.93, .95, .97), 1: (.60, .58, .54)}


def plants(ma):
    if ma >= 470: return 0.0
    if ma >= 420: return .35 * (470 - ma) / 50
    if ma >= 370: return .35 + .65 * (420 - ma) / 50
    return 1.0


def fill_sea(k):
    """give every sea cell (0) the class of the nearest land cell, growing outward one ring at a time (longitude wraps)"""
    k = k.copy()
    while (k == 0).any():
        grown = k.copy()
        for dy, dx in ((0, 1), (0, -1), (1, 0), (-1, 0)):
            s = np.roll(k, dx, axis=1)
            s = np.roll(s, dy, axis=0) if dy else s
            if dy == 1: s[0] = 0
            if dy == -1: s[-1] = 0
            grown = np.where((grown == 0) & (s > 0), s, grown)
        if (grown == k).all(): break
        k = grown
    return k


def tile(path, ma):
    ds = netCDF4.Dataset(path)
    k = np.rint(np.ma.filled(ds["koppen"][:], 0)).astype(int).T            # (lat south->north, lon from 0 deg east)
    rain = np.ma.filled(ds["precip"][:], 0).mean(axis=2).T                  # mm per day, annual mean
    land = k > 0
    p = plants(ma)
    rgb = np.zeros(k.shape + (3,))
    for c in range(1, 14):
        rgb[k == c] = np.array(BARE[c]) * (1 - p) + np.array(VEG[c]) * p
    wet = np.clip(rain / 6.0, 0, 1)
    rgb *= (1.04 - .12 * wet * (k != 2))[..., None]                          # heavier rain, a little darker (not on ice)
    # sea cells: the colour of the nearest land
    idx = fill_sea(np.where(land, np.arange(k.size).reshape(k.shape) + 1, 0)) - 1
    rgb = rgb.reshape(-1, 3)[idx.ravel()].reshape(k.shape + (3,))
    # soften the 2.8-degree blocks a little (longitude wraps), then pad for the page's sampling
    sm = (rgb * 2 + np.roll(rgb, 1, 1) + np.roll(rgb, -1, 1) + np.vstack([rgb[:1], rgb[:-1]]) + np.vstack([rgb[1:], rgb[-1:]])) / 6
    t = np.concatenate([sm[:, -PAD:], sm, sm[:, :PAD]], axis=1)
    t = np.concatenate([t[:1].repeat(PAD, 0), t, t[-1:].repeat(PAD, 0)], axis=0)
    return t, int(land.sum())


def write_png_rgb(path, a):
    raw = b"".join(b"\x00" + a[y].tobytes() for y in range(a.shape[0]))
    chunk = lambda t, d: struct.pack(">I", len(d)) + t + d + struct.pack(">I", zlib.crc32(t + d) & 0xFFFFFFFF)
    with open(path, "wb") as f:
        f.write(b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", struct.pack(">IIBBBBB", a.shape[1], a.shape[0], 8, 2, 0, 0, 0))
                + chunk(b"IDAT", zlib.compress(raw, 9)) + chunk(b"IEND", b""))


# today's 30 Beck classes, coloured in the same family as VEG (deserts hot or cold, the temperate and cold forests by their summers)
BECK = {1: (.20, .42, .18), 2: (.27, .47, .20), 3: (.56, .58, .31), 4: (.87, .75, .53), 5: (.78, .71, .56), 6: (.72, .65, .45),
        7: (.68, .64, .48), 8: (.58, .57, .37), 9: (.52, .55, .35), 10: (.48, .52, .36), 11: (.42, .53, .28), 12: (.38, .50, .28),
        13: (.36, .47, .30), 14: (.33, .50, .25), 15: (.32, .49, .26), 16: (.36, .47, .32), 17: (.50, .51, .37), 18: (.46, .49, .36),
        19: (.44, .47, .37), 20: (.46, .47, .40), 21: (.34, .45, .27), 22: (.30, .42, .26), 23: (.26, .37, .24), 24: (.30, .36, .28),
        25: (.30, .46, .25), 26: (.26, .41, .23), 27: (.22, .35, .22), 28: (.28, .34, .27), 29: (.63, .61, .53), 30: (.93, .95, .97)}


def read_tiff_packbits(path):
    """the one GeoTIFF layout Beck_KG_V1 uses: 8-bit, tiled, PackBits-compressed, little or big endian"""
    b = open(path, "rb").read()
    e = "<" if b[:2] == b"II" else ">"
    off = struct.unpack(e + "I", b[4:8])[0]
    n = struct.unpack(e + "H", b[off:off + 2])[0]
    tags = {}
    for i in range(n):
        tag, typ, cnt, val = struct.unpack(e + "HHII", b[off + 2 + 12 * i:off + 14 + 12 * i])
        if typ == 3 and cnt == 1: val = struct.unpack(e + "H", b[off + 10 + 12 * i:off + 12 + 12 * i])[0]
        if cnt > 1 and typ == 4: val = struct.unpack(e + "%dI" % cnt, b[val:val + 4 * cnt])
        tags[tag] = val
    w, h, tw, th = tags[256], tags[257], tags[322], tags[323]
    assert tags[259] == 32773 and tags[258] == 8
    img = np.zeros(((h + th - 1) // th * th, (w + tw - 1) // tw * tw), dtype=np.uint8)
    across = (w + tw - 1) // tw
    for k, (o, c) in enumerate(zip(tags[324], tags[325])):
        src, out, i = b[o:o + c], bytearray(), 0
        while i < len(src) and len(out) < tw * th:
            m = src[i] - 256 if src[i] > 127 else src[i]; i += 1
            if m >= 0: out += src[i:i + m + 1]; i += m + 1
            elif m != -128: out += bytes([src[i]]) * (1 - m); i += 1
        r, q = divmod(k, across)
        img[r * th:(r + 1) * th, q * tw:(q + 1) * tw] = np.frombuffer(bytes(out[:tw * th]).ljust(tw * th, b"\0"), np.uint8).reshape(th, tw)
    return img[:h, :w]


def modern(tif, out_w=1024, out_h=512):
    k = read_tiff_packbits(tif)                                         # 2160 x 4320, row 0 at 90 deg N, column 0 at 180 deg W
    lut = np.zeros((256, 3), dtype=np.float32)
    for c, v in BECK.items(): lut[c] = v
    land = (k > 0).astype(np.float32)
    rgb = lut[k] * land[..., None]
    ys = (np.arange(out_h + 1) * k.shape[0] / out_h).astype(int); xs = (np.arange(out_w + 1) * k.shape[1] / out_w).astype(int)
    sum_rgb = np.add.reduceat(np.add.reduceat(rgb, ys[:-1], axis=0), xs[:-1], axis=1)
    sum_land = np.add.reduceat(np.add.reduceat(land, ys[:-1], axis=0), xs[:-1], axis=1)
    has = sum_land > 0
    col = np.where(has[..., None], sum_rgb / np.maximum(sum_land, 1)[..., None], 0)
    idx = fill_sea(np.where(has, np.arange(has.size).reshape(has.shape) + 1, 0)) - 1
    return col.reshape(-1, 3)[idx.ravel()].reshape(col.shape)


def main(src):
    rows = (len(AGES) + COLS - 1) // COLS
    sheet = np.zeros((rows * TILE, COLS * TILE, 3))
    for i, ma in enumerate(AGES):
        t, n = tile(os.path.join(src, "%dMa_Pohletal2022_DIB_PhaneroContinentalClimate.nc" % ma), ma)
        r, c = divmod(i, COLS)
        sheet[r * TILE:(r + 1) * TILE, c * TILE:(c + 1) * TILE] = t
        print("%3d Ma  plants %.2f  land cells %d" % (ma, plants(ma), n))
    out = os.path.join(ROOT, "public", "data", "paleo", "climate.png")
    write_png_rgb(out, (np.clip(sheet, 0, 1) * 255 + .5).astype(np.uint8))
    print("wrote", os.path.relpath(out, ROOT), sheet.shape[1], "x", sheet.shape[0], os.path.getsize(out), "bytes")
    tif = os.path.join(ROOT, "data", "prehistory", "koppen", "beck", "tif", "Beck_KG_V1_present_0p083.tif")
    if os.path.exists(tif):
        now = os.path.join(ROOT, "public", "data", "paleo", "climate-now.png")
        write_png_rgb(now, (np.clip(modern(tif), 0, 1) * 255 + .5).astype(np.uint8))
        print("wrote", os.path.relpath(now, ROOT), os.path.getsize(now), "bytes")
    else:
        print("no", os.path.relpath(tif, ROOT), "- skipped today's climate (climate-now.png)")


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, "data", "prehistory", "koppen", "nc"))
