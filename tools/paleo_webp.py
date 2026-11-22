"""Turn the ancient-Earth height maps (public/data/paleo/<Ma>.png, written by tools/paleo.py) into lossless WebP, about a quarter
smaller, and prove each one decodes back to exactly the same heights before the PNG is removed.

Needs cwebp and dwebp (libwebp: `brew install webp`). Run: python3 -I tools/paleo_webp.py
"""
import glob, os, struct, subprocess, sys, tempfile, zlib

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIR = os.path.join(ROOT, "public", "data", "paleo")


def png_gray(path):  # the pixels of an 8-bit grey, non-interlaced PNG (what tools/paleo.py writes)
    b = open(path, "rb").read(); i = 8; idat = b""; w = h = 0
    while i < len(b):
        n, t = struct.unpack(">I4s", b[i:i + 8]); d = b[i + 8:i + 8 + n]; i += 12 + n
        if t == b"IHDR":
            w, h, depth, ctype, _, _, inter = struct.unpack(">IIBBBBB", d)
            if (depth, ctype, inter) != (8, 0, 0): sys.exit("%s: not an 8-bit grey PNG" % path)
        elif t == b"IDAT": idat += d
    raw = zlib.decompress(idat); out = bytearray(); prev = bytearray(w)
    for y in range(h):
        f = raw[y * (w + 1)]; row = bytearray(raw[y * (w + 1) + 1:(y + 1) * (w + 1)])
        if f == 1:
            for x in range(1, w): row[x] = (row[x] + row[x - 1]) & 255
        elif f == 2:
            for x in range(w): row[x] = (row[x] + prev[x]) & 255
        elif f == 3:
            for x in range(w): row[x] = (row[x] + (((row[x - 1] if x else 0) + prev[x]) >> 1)) & 255
        elif f == 4:
            for x in range(w):
                a = row[x - 1] if x else 0; c = prev[x - 1] if x else 0; p = a + prev[x] - c
                pa, pb, pc = abs(p - a), abs(p - prev[x]), abs(p - c)
                row[x] = (row[x] + (a if pa <= pb and pa <= pc else prev[x] if pb <= pc else c)) & 255
        out += row; prev = row
    return w, h, bytes(out)


def main():
    pngs = sorted(glob.glob(os.path.join(DIR, "*.png")), key=lambda p: float(os.path.basename(p)[:-4]))
    if not pngs: sys.exit("no maps in " + DIR)
    before = after = 0
    with tempfile.TemporaryDirectory() as tmp:
        for p in pngs:
            q = p[:-4] + ".webp"
            subprocess.run(["cwebp", "-quiet", "-lossless", "-z", "9", "-exact", p, "-o", q], check=True)
            # check: decode with dwebp to raw RGBA and compare the red channel with the PNG's grey values
            raw = os.path.join(tmp, "d.pam"); subprocess.run(["dwebp", "-quiet", "-pam", q, "-o", raw], check=True)
            b = open(raw, "rb").read(); hdr, px = b.split(b"ENDHDR\n", 1)
            w, h, g = png_gray(p)
            if px[0::4] != g: sys.exit("%s: the WebP does not decode to the same heights" % q)
            before += os.path.getsize(p); after += os.path.getsize(q); os.remove(p)
            print(os.path.basename(q), end="  ", flush=True)
    print("\n%d maps: %.1f MB -> %.1f MB, every one checked pixel for pixel" % (len(pngs), before / 1e6, after / 1e6))


if __name__ == "__main__":
    main()
