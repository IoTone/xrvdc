#!/usr/bin/env python3
"""
Verify every ThreeMeshUI.Text content uses only characters present in the MSDF atlas.

Three-mesh-ui throws an uncaught TypeError when text contains a character not in
the loaded MSDF atlas, killing the render loop. This script catches that at
authoring time instead of runtime.

Usage:
    python3 static/xr/scripts/check-glyphs.py
Exit code 0 if clean, 1 if any unsupported glyphs found.
"""
import json
import re
import sys
import urllib.request
from pathlib import Path

FONT_URL = "https://cdn.jsdelivr.net/gh/felixmariotto/three-mesh-ui@master/examples/assets/Roboto-msdf.json"
JS_DIR = Path(__file__).resolve().parent.parent / "js"

def load_supported():
    with urllib.request.urlopen(FONT_URL) as r:
        atlas = json.load(r)
    chars = {c["id"] for c in atlas["chars"]}
    chars.add(ord(" "))
    chars.add(ord("\n"))
    return chars

def scan(path, supported):
    src = path.read_text(encoding="utf-8")
    # Match likely-rendered string fields. Add new field names as they appear.
    fields = ("content", "summary", "title")
    pattern = re.compile(
        r'(?:' + "|".join(fields) + r')\s*:\s*"((?:[^"\\]|\\.)*)"'
    )
    problems = []
    for m in pattern.finditer(src):
        s = bytes(m.group(1), "utf-8").decode("unicode_escape", errors="replace")
        for i, ch in enumerate(s):
            if ord(ch) not in supported:
                problems.append((path.name, m.start(), s, ch))
                break
    return problems

def main():
    supported = load_supported()
    problems = []
    for js in sorted(JS_DIR.glob("*.js")):
        problems.extend(scan(js, supported))
    if not problems:
        print("OK — all MSDF text is glyph-compatible.")
        return 0
    for fname, off, s, ch in problems:
        print(f"FAIL  {fname} @{off}: char {ch!r} (U+{ord(ch):04X}) in: {s[:90]!r}")
    return 1

if __name__ == "__main__":
    sys.exit(main())
