#!/usr/bin/env python3
"""The last ice age's ice sheets for the deep-time globe, one mask per thousand years from 25,000 to 12,000 years ago, so that
the ice the globe shows at the join (10,000 BCE, about 12,000 years ago) is the ice World history starts from (data/iceage.json,
made from the same two sources; see content/factcheck/iceage.md).

Sources:
  North America  NADI-1, Dalton et al. 2023, Quaternary Science Reviews 321:108345; data https://zenodo.org/records/8161764
                 (CC BY 4.0). The OPTIMAL outlines, in calendar years; WGS84 longitude and latitude.
  Eurasia        DATED-1, Hughes et al. 2016, Boreas 45:1-45; data https://doi.pangaea.de/10.1594/PANGAEA.848117 (CC BY 3.0).
                 The "most credible" (mc) time slices TS12 to TS25, in calendar ka, in a north-polar Lambert azimuthal equal-area
                 projection, turned back into longitude and latitude here (on the sphere of equal area; a few km off at most).
Greenland, Iceland and the mountain glaciers of other continents are in neither; the page draws Greenland's ice itself.

Input : the OPTIMAL shapefiles from the NADI-1 zip in data/prehistory/ice/nadi1/shp/, and the TS*_mc shapefiles from
        DATED-1_TimeSlices_shp.zip in data/prehistory/ice/dated1/shp/ (neither committed).
Output: public/data/paleo/glacial.png, 1024 x 2240 grey: 14 frames of 1024 x 160 stacked top to bottom, frame i for
        25 - i thousand years ago (25 ka first, 12 ka last). Each frame covers longitude -180..180 (columns) and latitude
        35 deg N (top row) to 90 deg N (bottom row); 255 is ice, 0 is none, edges are anti-aliased. one.js reads the same layout.

Needs numpy (like tools/paleo.py and tools/climate.py):  .venv-paleo/bin/python tools/glacial.py
"""
import math, os, struct, sys, zlib

import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KA = list(range(25, 11, -1))                      # 25, 24 ... 12
W, H, LAT0, LAT1, SS = 1024, 160, 35.0, 90.0, 3   # SS: samples per pixel each way, for smooth edges
R = 6371007.18                                    # radius of the sphere with the WGS84 ellipsoid's area


def read_shp(path):
    """polygon records -> list of rings per record; each ring an (n, 2) array of x, y"""
    data = open(path, "rb").read()
    pos, recs = 100, []
    while pos + 8 <= len(data):
        _, clen = struct.unpack(">ii", data[pos:pos + 8])
        body = pos + 8
        st = struct.unpack("<i", data[body:body + 4])[0]
        if st in (5, 15, 25):
            nparts, npts = struct.unpack("<ii", data[body + 36:body + 44])
            p0 = body + 44 + 4 * nparts
            parts = list(struct.unpack("<%di" % nparts, data[body + 44:p0])) + [npts]
            pts = np.frombuffer(data[p0:p0 + 16 * npts], dtype="<f8").reshape(npts, 2)
            recs.append([pts[parts[i]:parts[i + 1]] for i in range(nparts)])
        pos = body + 2 * clen
    return recs


def laea_north_inverse(xy):
    x, y = xy[:, 0], xy[:, 1]
    rho = np.hypot(x, y)
    c = 2 * np.arcsin(np.clip(rho / (2 * R), -1, 1))
    lat = np.degrees(np.arcsin(np.cos(c)))
    lon = np.degrees(np.arctan2(x, -y))
    return np.stack([lon, lat], axis=1)


def rasterize(recs, grid):
    """even-odd fill of each record's rings into grid (rows lat LAT0..LAT1, columns lon -180..180), sampled SS x SS per pixel"""
    gh, gw = grid.shape
    lats = LAT0 + (np.arange(gh) + .5) / gh * (LAT1 - LAT0)
    for rings in recs:
        e = []
        for r in rings:
            if len(r) < 3: continue
            a, b = r, np.roll(r, -1, axis=0)
            e.append(np.concatenate([a, b], axis=1))
        if not e: continue
        e = np.concatenate(e)                                     # x1 y1 x2 y2
        lo, hi = np.minimum(e[:, 1], e[:, 3]), np.maximum(e[:, 1], e[:, 3])
        rows = np.nonzero((lats >= lo.min()) & (lats <= hi.max()))[0]
        for j in rows:
            la = lats[j]
            m = (lo <= la) & (hi > la)
            if not m.any(): continue
            x1, y1, x2, y2 = e[m].T
            xs = np.sort(x1 + (la - y1) * (x2 - x1) / (y2 - y1))
            for k in range(0, len(xs) - 1, 2):
                c0 = int(math.ceil((xs[k] + 180) / 360 * gw - .5)); c1 = int(math.floor((xs[k + 1] + 180) / 360 * gw - .5))
                if c1 >= c0: grid[j, max(c0, 0):min(c1, gw - 1) + 1] = 1
    return grid


def frame(ka):
    g = np.zeros((H * SS, W * SS), dtype=np.uint8)
    n = os.path.join(ROOT, "data", "prehistory", "ice", "nadi1", "shp", "%dka_cal_OPTIMAL_NADI-1_Dalton_etal_QSR.shp" % ka)
    d = os.path.join(ROOT, "data", "prehistory", "ice", "dated1", "shp", "TS%d_mc.shp" % ka)
    counts = []
    if os.path.exists(n):
        recs = read_shp(n); rasterize(recs, g); counts.append("NADI-1 %d" % len(recs))
    if os.path.exists(d):
        recs = [[laea_north_inverse(r) for r in rings] for rings in read_shp(d)]; rasterize(recs, g); counts.append("DATED-1 %d" % len(recs))
    cov = g.reshape(H, SS, W, SS).mean(axis=(1, 3))
    return (cov * 255 + .5).astype(np.uint8), counts


def write_png_gray(path, a):
    raw = b"".join(b"\x00" + a[y].tobytes() for y in range(a.shape[0]))
    chunk = lambda t, d: struct.pack(">I", len(d)) + t + d + struct.pack(">I", zlib.crc32(t + d) & 0xFFFFFFFF)
    with open(path, "wb") as f:
        f.write(b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", struct.pack(">IIBBBBB", a.shape[1], a.shape[0], 8, 0, 0, 0, 0))
                + chunk(b"IDAT", zlib.compress(raw, 9)) + chunk(b"IEND", b""))


def main():
    frames = []
    for ka in KA:
        f, counts = frame(ka)
        frames.append(f)
        print("%2d ka  %s  ice pixels %d" % (ka, ", ".join(counts) or "no source", int((f > 127).sum())))
    out = os.path.join(ROOT, "public", "data", "paleo", "glacial.png")
    write_png_gray(out, np.concatenate(frames, axis=0))
    print("wrote", os.path.relpath(out, ROOT), os.path.getsize(out), "bytes")


if __name__ == "__main__":
    main()
