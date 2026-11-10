#!/usr/bin/env python3
"""Terrain shading and the ice-age shoreline layer, from NOAA ETOPO5 (public domain, 5-minute world elevation grid).

Input : ETOPO5.DAT (https://www.ngdc.noaa.gov/mgg/global/relief/ETOPO5/TOPO/ETOPO5/): 2160 rows x 4320 big-endian
        int16 metres, from 90°N and 0°E eastward.
Output (equirectangular, -180..180 x 90..-90, 10-minute cells, 2160 x 1080):
  public/data/relief.jpg  hillshade of land, white = flat or lit; the sea is white (multiplied over the map, white
                          changes nothing)
  public/data/shelf.png   for seabed connected to the open ocean and no deeper than 130 m: its depth in metres (1-130);
                          0 elsewhere. With the sea level of a past year (content/iceage), a cell is dry land when its
                          depth is less than how far the sea had fallen. Inland basins below sea level (Caspian, Dead Sea)
                          are not connected to the ocean and stay 0.
Needs ffmpeg (for the JPEG). Run: python3 -I tools/relief.py <ETOPO5.DAT>
"""
import array, collections, math, os, struct, subprocess, sys, tempfile, zlib

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
W0, H0 = 4320, 2160
W, H = 2160, 1080  # output: 10-minute cells


def write_png_gray(path, w, h, data):
    raw = b"".join(b"\x00" + bytes(data[y * w:(y + 1) * w]) for y in range(h))
    chunk = lambda t, d: struct.pack(">I", len(d)) + t + d + struct.pack(">I", zlib.crc32(t + d) & 0xffffffff)
    png = b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", struct.pack(">IIBBBBB", w, h, 8, 0, 0, 0, 0)) + chunk(b"IDAT", zlib.compress(raw, 9)) + chunk(b"IEND", b"")
    open(path, "wb").write(png)


def main(src):
    z = array.array("h"); z.frombytes(open(src, "rb").read())
    if sys.byteorder == "little": z.byteswap()
    # downsample 2x2 -> 10-minute cells, and roll so column 0 is 180°W
    e = array.array("f", bytes(4 * W * H))
    for y in range(H):
        r0, r1 = (2 * y) * W0, (2 * y + 1) * W0
        for x in range(W):
            sx = (2 * x + W0 // 2) % W0
            e[y * W + x] = (z[r0 + sx] + z[r0 + sx + 1] + z[r1 + sx] + z[r1 + sx + 1]) / 4
    print("read", file=sys.stderr)

    # --- hillshade (sun from the north-west, 45° up), land only
    az, alt = math.radians(315), math.radians(45)
    flat = math.sin(alt)
    shade = bytearray(b"\xff" * (W * H))
    cell = 10 / 60 * 111320  # metres per cell north-south
    exag = 30.0  # relief is faint at this scale; exaggerate the slopes
    for y in range(1, H - 1):
        lat = 90 - (y + 0.5) * 180 / H
        dxm = cell * max(0.05, math.cos(math.radians(lat)))
        for x in range(W):
            i = y * W + x
            if e[i] <= 0: continue
            xl, xr = (x - 1) % W, (x + 1) % W
            dzdx = (e[y * W + xr] - e[y * W + xl]) / (2 * dxm) * exag
            dzdy = (e[(y - 1) * W + x] - e[(y + 1) * W + x]) / (2 * cell) * exag  # north minus south
            slope = math.atan(math.hypot(dzdx, dzdy))
            aspect = math.atan2(dzdy, -dzdx)
            s = math.sin(alt) * math.cos(slope) + math.cos(alt) * math.sin(slope) * math.cos(az - math.pi / 2 - aspect)
            dark = max(0.0, (flat - s) / flat)  # only shadowed slopes darken; flat and lit ground stays white
            shade[i] = max(0, min(255, round(255 - 140 * dark ** 0.7 - min(40, e[i] / 120))))  # plus a little darkening with height
    print("shaded", file=sys.stderr)

    # --- seabed down to 130 m that the open ocean reaches (flood fill from deep water through cells below 0 m)
    ocean = bytearray(W * H)
    q = collections.deque(i for i in range(W * H) if e[i] < -1000)
    for i in q: ocean[i] = 1
    while q:
        i = q.popleft(); y, x = divmod(i, W)
        for j in ((y * W + (x + 1) % W), (y * W + (x - 1) % W), ((y - 1) * W + x) if y else -1, ((y + 1) * W + x) if y < H - 1 else -1):
            if j >= 0 and not ocean[j] and e[j] < 0: ocean[j] = 1; q.append(j)
    shelf = bytearray(W * H)
    for i in range(W * H):
        if ocean[i] and -130 <= e[i] < 0: shelf[i] = max(1, min(130, round(-e[i])))
    print("shelf", file=sys.stderr)

    out = os.path.join(ROOT, "public", "data")
    write_png_gray(os.path.join(out, "shelf.png"), W, H, shelf)
    with tempfile.TemporaryDirectory() as td:
        rawp = os.path.join(td, "relief.gray")
        open(rawp, "wb").write(bytes(shade))
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "gray", "-s", f"{W}x{H}", "-i", rawp,
                        "-q:v", "4", os.path.join(out, "relief.jpg")], check=True)
    for f in ("shelf.png", "relief.jpg"): print(f, os.path.getsize(os.path.join(out, f)) // 1024, "KB")


if __name__ == "__main__":
    main(sys.argv[1])
