#!/usr/bin/env python3
"""Records the universe film's spoken commentary from its script, public/universe/narration/narration.json.

Each cue becomes public/universe/narration/<n>.m4a (AAC, mono), and its length in seconds is written back into the script as
"dur", which the page uses for the subtitles and to check that a line ends before the next one starts. Run again after editing
the script; only lines whose text, engine, voice or settings changed are redone.

Two engines, chosen by "engine" in the script:
  "say"         the macOS voice named by "voice" at "rate" words a minute (offline; the older voices sound synthetic)
  "elevenlabs"  an ElevenLabs voice: "voice_id" if given, else found by its name ("voice"), with "model". Each line is sent with the lines either side as
                context, so the delivery runs on naturally. The API key is read from ~/.config/worldatlas/elevenlabs.key (or
                the ELEVENLABS_API_KEY variable); it is never stored in the project. Only the script's text is sent.

macOS only (afconvert, afinfo; say for the first engine).   Run: python3 -I tools/narration.py
"""
import hashlib, json, os, re, subprocess, sys, tempfile, urllib.error, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIR = os.path.join(ROOT, "public", "universe", "narration")
SCRIPT = os.path.join(DIR, "narration.json")
EL = "https://api.elevenlabs.io/v1"


def seconds(path):
    out = subprocess.run(["afinfo", path], capture_output=True, text=True, check=True).stdout
    return round(float(re.search(r"estimated duration: ([\d.]+)", out).group(1)), 2)


def el_key():
    k = os.environ.get("ELEVENLABS_API_KEY", "").strip()
    p = os.path.expanduser("~/.config/worldatlas/elevenlabs.key")
    if not k and os.path.exists(p): k = open(p).read().strip()
    if not k: sys.exit("No ElevenLabs key: save it in ~/.config/worldatlas/elevenlabs.key (one line)")
    return k


def el_call(path, key, body=None):
    req = urllib.request.Request(EL + path, data=json.dumps(body).encode() if body is not None else None,
                                 headers={"xi-api-key": key, "Content-Type": "application/json", "Accept": "*/*"}, method="POST" if body is not None else "GET")
    try:
        with urllib.request.urlopen(req, timeout=120) as r: return r.read()
    except urllib.error.HTTPError as e:
        sys.exit("ElevenLabs refused %s: %s %s" % (path.split("?")[0], e.code, e.read()[:300].decode("utf8", "replace")))


def el_voice(key, name):
    voices = json.loads(el_call("/voices", key))["voices"]
    for v in voices:
        if v["name"].lower() == name.lower() or v["name"].lower().startswith(name.lower() + " "): return v["voice_id"]
    sys.exit("No ElevenLabs voice called %r; yours are: %s" % (name, ", ".join(sorted(v["name"] for v in voices))))


def main():
    s = json.load(open(SCRIPT))
    engine, voice = s.get("engine", "say"), s["voice"]
    settings = s.get("settings", {}) if engine == "elevenlabs" else {"rate": s.get("rate")}
    model = s.get("model", "eleven_multilingual_v2")
    cues, key, vid = s["cues"], None, None
    with tempfile.TemporaryDirectory() as tmp:
        for i, c in enumerate(cues):
            sig = json.dumps([engine, voice, model if engine == "elevenlabs" else "", settings, c["text"]], sort_keys=True)
            name = f"{i + 1:02d}-{hashlib.sha1(sig.encode()).hexdigest()[:10]}.m4a"
            out = os.path.join(DIR, name)
            if c.get("file") != name or not os.path.exists(out):
                if engine == "elevenlabs":
                    if key is None: key = el_key(); vid = s.get("voice_id") or el_voice(key, voice)  # an id needs no voices_read permission
                    body = {"text": c["text"], "model_id": model, "voice_settings": settings,
                            "previous_text": cues[i - 1]["text"] if i else None, "next_text": cues[i + 1]["text"] if i + 1 < len(cues) else None}
                    src = os.path.join(tmp, "line.mp3")
                    open(src, "wb").write(el_call(f"/text-to-speech/{vid}?output_format=mp3_44100_128", key, body))
                else:
                    src = os.path.join(tmp, "line.aiff")
                    subprocess.run(["say", "-v", voice, "-r", str(s["rate"]), "-o", src, c["text"]], check=True)
                subprocess.run(["afconvert", "-f", "m4af", "-d", "aac", "-b", "96000" if engine == "elevenlabs" else "64000", "-c", "1", src, out], check=True)
                old = c.get("file")
                if old and old != name and os.path.exists(os.path.join(DIR, old)): os.remove(os.path.join(DIR, old))
                print("recorded", name, "-", c["text"][:60])
            c["file"], c["dur"] = name, seconds(out)
    json.dump(s, open(SCRIPT, "w"), ensure_ascii=False, indent=1)
    open(SCRIPT, "a").write("\n")
    print(f"{len(cues)} lines, {sum(c['dur'] for c in cues):.1f} s of speech")


if __name__ == "__main__":
    main()
