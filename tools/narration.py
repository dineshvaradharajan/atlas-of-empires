#!/usr/bin/env python3
"""Records the universe film's spoken commentary from its script, public/universe/narration/narration.json.

Each cue becomes public/universe/narration/<n>.m4a (AAC, 64 kbit/s, mono), spoken by the macOS voice and rate the script names,
and its length in seconds is written back into the script as "dur", which the page uses for the subtitles and for checking that a
line ends before the next one starts. Run again after editing the script; only lines whose text, voice or rate changed are redone.

macOS only: it uses the system's `say` and `afconvert`.   Run: python3 -I tools/narration.py
"""
import hashlib, json, os, re, subprocess, sys, tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIR = os.path.join(ROOT, "public", "universe", "narration")
SCRIPT = os.path.join(DIR, "narration.json")


def seconds(path):
    out = subprocess.run(["afinfo", path], capture_output=True, text=True, check=True).stdout
    return round(float(re.search(r"estimated duration: ([\d.]+)", out).group(1)), 2)


def main():
    s = json.load(open(SCRIPT))
    voice, rate = s["voice"], s["rate"]
    with tempfile.TemporaryDirectory() as tmp:
        for i, c in enumerate(s["cues"]):
            key = hashlib.sha1(f"{voice}|{rate}|{c['text']}".encode()).hexdigest()[:10]
            name = f"{i + 1:02d}-{key}.m4a"
            out = os.path.join(DIR, name)
            if c.get("file") != name or not os.path.exists(out):
                aiff = os.path.join(tmp, "line.aiff")
                subprocess.run(["say", "-v", voice, "-r", str(rate), "-o", aiff, c["text"]], check=True)
                subprocess.run(["afconvert", "-f", "m4af", "-d", "aac", "-b", "64000", "-c", "1", aiff, out], check=True)
                old = c.get("file")
                if old and old != name and os.path.exists(os.path.join(DIR, old)): os.remove(os.path.join(DIR, old))
            c["file"], c["dur"] = name, seconds(out)
    json.dump(s, open(SCRIPT, "w"), ensure_ascii=False, indent=1)
    open(SCRIPT, "a").write("\n")
    # warn where a line would still be speaking when the next one starts (scene starts follow the film's scene lengths)
    print(f"{len(s['cues'])} lines, {sum(c['dur'] for c in s['cues']):.1f} s of speech")


if __name__ == "__main__":
    main()
