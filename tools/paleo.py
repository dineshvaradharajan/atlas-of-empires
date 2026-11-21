#!/usr/bin/env python3
"""The ancient Earth for the deep-time page: height of the land and depth of the sea, one map every 5 million years
from 540 million years ago to today, from the PALEOMAP PaleoDEMs (Scotese & Wright 2018, CC BY 4.0,
https://doi.org/10.5281/zenodo.5460860).

Input : the 6-minute NetCDF zip, Scotese_Wright_2018_Maps_1-88_6minX6min_PaleoDEMS_nc.zip (202 MB; keep it in
        data/prehistory/paleodem/, which is not committed). Each map is 1801 x 3601 grid points of metres, from 90°N
        and 180°W; it is read straight from the zip.
Output (equirectangular, -180..180 x 90..-90):
  public/data/paleo/<Ma>.png   8-bit grey, the height packed so that steps are finest near sea level:
                                 land (above 0 m)  v = 128 + 127 * sqrt(metres / LAND_MAX)   -> 129..255
                                 sea  (0 m, below) v = 127 - 127 * sqrt(-metres / SEA_MAX)   -> 0..127
                               so the coast is where v crosses 128, and the page unpacks with the same two numbers.
  public/data/paleo/index.json the ages, each map's name and stated age, the packing numbers and the credit.

Unlike the other tools this one needs numpy and netCDF4 (the maps are NetCDF-4 files):
  python3 -m venv .venv-paleo && .venv-paleo/bin/pip install numpy netCDF4
Run: .venv-paleo/bin/python tools/paleo.py <the zip> [width, default 2048]
"""
import json, os, re, struct, sys, zipfile, zlib

import netCDF4
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LAND_MAX, SEA_MAX = 9000.0, 11000.0


def pack(e):
    """metres -> 0..255 (see the header)"""
    land = 128 + np.clip(np.rint(127 * np.sqrt(np.clip(e, 0, LAND_MAX) / LAND_MAX)), 1, 127)
    sea = 127 - np.clip(np.rint(127 * np.sqrt(np.clip(-e, 0, SEA_MAX) / SEA_MAX)), 0, 127)
    return np.where(e > 0, land, sea).astype(np.uint8)


def unpack(v):
    v = v.astype(np.float64)
    return np.where(v > 128, ((v - 128) / 127) ** 2 * LAND_MAX, -(((127 - np.minimum(v, 127)) / 127) ** 2) * SEA_MAX)


def resample(e, w):
    """1801 x 3601 grid points -> h x w cell averages (w = 2h), by summing the area each cell covers"""
    h = w // 2
    cells = (e[:-1, :-1] + e[1:, :-1] + e[:-1, 1:] + e[1:, 1:]) / 4  # 1800 x 3600 cell centres
    H0, W0 = cells.shape
    if (w, h) == (W0, H0): return cells

    def squeeze(a, n, axis):  # area-weighted resize along one axis
        m = a.shape[axis]; edges = np.linspace(0, m, n + 1)
        cs = np.concatenate([np.zeros_like(np.take(a, [0], axis)), np.cumsum(a, axis)], axis)  # integral along the axis
        lo = np.floor(edges).astype(int); f = edges - lo; lo = np.minimum(lo, m)
        nxt = np.minimum(lo + 1, m)
        at = np.take(cs, lo, axis) + (np.take(cs, nxt, axis) - np.take(cs, lo, axis)) * (f.reshape([-1 if i == axis else 1 for i in range(a.ndim)]))
        return np.diff(at, axis=axis) / (m / n)

    return squeeze(squeeze(cells, h, 0), w, 1)


def write_png_gray(path, img):
    h, w = img.shape; a = img.astype(np.int16)
    sub = (a - np.concatenate([np.zeros((h, 1), np.int16), a[:, :-1]], 1)) % 256  # PNG filter 1: difference from the left
    up = (a - np.concatenate([np.zeros((1, w), np.int16), a[:-1]], 0)) % 256      # PNG filter 2: difference from above
    cost = lambda f: np.minimum(f, 256 - f).sum(1)
    use_up = cost(up) < cost(sub)
    rows = np.empty((h, w + 1), np.uint8); rows[:, 0] = np.where(use_up, 2, 1); rows[:, 1:] = np.where(use_up[:, None], up, sub)
    chunk = lambda t, d: struct.pack(">I", len(d)) + t + d + struct.pack(">I", zlib.crc32(t + d) & 0xffffffff)
    open(path, "wb").write(b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", struct.pack(">IIBBBBB", w, h, 8, 0, 0, 0, 0)) + chunk(b"IDAT", zlib.compress(rows.tobytes(), 9)) + chunk(b"IEND", b""))


def maps(zip_path):
    """-> [(Ma, name, bytes)], youngest first; where two maps share an age the later-numbered one is kept"""
    z = zipfile.ZipFile(zip_path); out = {}
    for n in sorted(z.namelist(), key=lambda s: float(re.search(r"Map([\d.]+)_", s).group(1)) if re.search(r"Map([\d.]+)_", s) else 0):
        m = re.search(r"Map([\d.]+)_PALEOMAP_6min_(.+?)_([\d.]+)Ma\.nc$", n)
        if not m or "__MACOSX" in n: continue
        out[int(round(float(m.group(3)) / 5) * 5)] = (m.group(2).replace("_", " ").strip(), n)
    return z, sorted(out.items())


def main(zip_path, width=2048):
    out = os.path.join(ROOT, "public", "data", "paleo"); os.makedirs(out, exist_ok=True)
    z, items = maps(zip_path); index = []; total = 0
    for ma, (name, member) in items:
        ds = netCDF4.Dataset("m", memory=z.read(member))
        e = np.array(ds.variables["z"][:], np.float64); lat = ds.variables["latitude"][:]
        if lat[0] < lat[-1]: e = e[::-1]  # north first
        e[0, :] = np.median(e[1, :]); e[-1, :] = np.median(e[-2, :])  # the pole rows hold stray values
        img = pack(resample(e, width)); p = os.path.join(out, "%d.png" % ma); write_png_gray(p, img)
        total += os.path.getsize(p)
        index.append({"ma": ma, "name": name, "stated": str(ds.getncattr("description")), "land": round(float((img > 128).mean()), 4)})
        print("%4d Ma  %-34s %4d KB" % (ma, name, os.path.getsize(p) // 1024), file=sys.stderr)
    json.dump({"width": width, "height": width // 2, "landMax": LAND_MAX, "seaMax": SEA_MAX,
               "credit": "PALEOMAP PaleoDEMs: C. R. Scotese & N. M. Wright 2018, doi:10.5281/zenodo.5460860, CC BY 4.0", "maps": index},
              open(os.path.join(out, "index.json"), "w"), separators=(",", ":"))
    print(len(index), "maps,", total // 1048576, "MB", file=sys.stderr)


if __name__ == "__main__":
    main(sys.argv[1], int(sys.argv[2]) if len(sys.argv) > 2 else 2048)
