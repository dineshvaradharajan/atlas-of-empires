"""Rewrite the map's border files and base maps in a compact form, for the deployed copy only.

Coordinates become whole numbers (scaled by 10^d, where d is the most decimals the file uses) stored as differences
from the previous point, which roughly halves the download. The page's data worker turns them back into the same
GeoJSON. Lossless: every file is decoded again and compared with the original before it is written; any mismatch
leaves that file as it was.

    python3 -I tools/compact.py --public <exported public dir>
"""
import argparse, glob, json, os, re, sys


def decimals(fc):
    s = json.dumps([f["geometry"]["coordinates"] for f in fc["features"]])
    return max((len(x) for x in re.findall(r"\.(\d+)", s)), default=0)


def encode(fc, d):
    m = 10 ** d
    for f in fc["features"]:
        polys = []
        for poly in f["geometry"]["coordinates"]:
            rings = []
            for ring in poly:
                px = py = 0
                out = []
                for x, y in ring:
                    X, Y = round(x * m), round(y * m)
                    out += [X - px, Y - py]
                    px, py = X, Y
                rings.append(out)
            polys.append(rings)
        f["geometry"] = {"type": "MultiPolygon", "q": polys}
    fc["scale"] = d
    return fc


def decode(fc):  # the same steps as unpackGeo() in public/app.js
    m = 10 ** fc["scale"]
    for f in fc["features"]:
        polys = []
        for poly in f["geometry"]["q"]:
            rings = []
            for q in poly:
                x = y = 0
                ring = []
                for i in range(0, len(q), 2):
                    x += q[i]
                    y += q[i + 1]
                    ring.append([x / m, y / m])
                rings.append(ring)
            polys.append(rings)
        f["geometry"] = {"type": "MultiPolygon", "coordinates": polys}
    del fc["scale"]
    return fc


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--public", required=True)
    pub = ap.parse_args().public
    files = [p for p in glob.glob(os.path.join(pub, "data/clio/*.json")) if not p.endswith("index.json")]
    files += [p for p in glob.glob(os.path.join(pub, "data/*.json")) if re.fullmatch(r"-?\d+\.json", os.path.basename(p))]
    before = after = done = 0
    for p in sorted(files):
        raw = open(p, encoding="utf-8").read()
        fc = json.loads(raw)
        if not fc.get("features") or any(f["geometry"]["type"] != "MultiPolygon" for f in fc["features"]):
            continue
        d = decimals(fc)
        packed = json.dumps(encode(json.loads(raw), d), separators=(",", ":"), ensure_ascii=False)
        if decode(json.loads(packed)) != fc:
            print(f"compact: {os.path.basename(p)} did not round-trip; left as it was", file=sys.stderr)
            continue
        open(p, "w", encoding="utf-8").write(packed)
        before += len(raw)
        after += len(packed)
        done += 1
    print(f"compact: {done} map files, {before / 1e6:.1f} MB -> {after / 1e6:.1f} MB")


if __name__ == "__main__":
    main()
