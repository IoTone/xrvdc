#!/usr/bin/env bash
#
# Regenerate the Open Graph share card image from the live landing page.
#
# Captures a 1200x1500 screenshot of the landing page with headless Chrome,
# then crops the top 1200x630 (skipping the nav bar) to produce the OG card
# at static/images/og-share.png — matching the dimensions Discord, LinkedIn,
# Slack, X, and Facebook expect.
#
# Usage:
#   bash static/xr/scripts/regen-og-image.sh
#       Captures http://127.0.0.1:1313/  (default Hugo dev server)
#
#   bash static/xr/scripts/regen-og-image.sh https://xrvdc.pages.dev/
#       Captures the deployed production site instead
#
#   bash static/xr/scripts/regen-og-image.sh /ja/
#       Captures the Japanese landing on the local dev server
#
# Requires:
#   - Hugo dev server running OR deployed site reachable at the URL
#   - Google Chrome installed (macOS default path used)
#   - ImageMagick `magick` on PATH

set -euo pipefail

# ── Resolve URL ──────────────────────────────────────────────────────────
ARG="${1:-}"
if   [[ -z "$ARG"            ]]; then URL="http://127.0.0.1:1313/"
elif [[ "$ARG" =~ ^https?:// ]]; then URL="$ARG"
elif [[ "$ARG" =~ ^/         ]]; then URL="http://127.0.0.1:1313${ARG}"
else                                  URL="http://127.0.0.1:1313/${ARG}"
fi

# ── Paths ────────────────────────────────────────────────────────────────
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../../.." && pwd)"
OUTPUT="${REPO_ROOT}/static/images/og-share.png"
TMP_DIR="$(mktemp -d -t og-shot-XXXXXX)"
trap 'rm -rf "$TMP_DIR"' EXIT

# ── Pre-flight checks ────────────────────────────────────────────────────
if [[ ! -x "$CHROME" ]]; then
  echo "ERROR: Google Chrome not found at:" >&2
  echo "  $CHROME" >&2
  echo "Install Chrome or edit the CHROME variable at the top of this script." >&2
  exit 1
fi

if ! command -v magick >/dev/null 2>&1; then
  echo "ERROR: ImageMagick 'magick' not on PATH." >&2
  echo "Install with: brew install imagemagick" >&2
  exit 1
fi

if ! command -v curl >/dev/null 2>&1; then
  echo "ERROR: curl not on PATH." >&2
  exit 1
fi

# Quick reachability check (only for localhost; skip for remote)
if [[ "$URL" =~ ^http://(127\.0\.0\.1|localhost) ]]; then
  if ! curl -s -o /dev/null -w '%{http_code}' "$URL" | grep -q '^2'; then
    echo "ERROR: URL not reachable: $URL" >&2
    echo "Start the dev server first: hugo server" >&2
    exit 1
  fi
fi

# ── Capture ──────────────────────────────────────────────────────────────
echo "==> Capturing $URL"
"$CHROME" \
  --headless \
  --disable-gpu \
  --hide-scrollbars \
  --force-color-profile=srgb \
  --window-size=1200,1500 \
  --screenshot="$TMP_DIR/full.png" \
  "$URL" > "$TMP_DIR/chrome.log" 2>&1

if [[ ! -f "$TMP_DIR/full.png" ]]; then
  echo "ERROR: Chrome did not produce a screenshot. Log:" >&2
  cat "$TMP_DIR/chrome.log" >&2
  exit 1
fi

# ── Crop to OG dimensions ────────────────────────────────────────────────
# Skip top 60px (nav bar) and crop a 1200x630 hero region.
echo "==> Cropping to 1200x630 (offset y=60 to skip nav)"
magick "$TMP_DIR/full.png" -crop 1200x630+0+60 +repage "$OUTPUT"

bytes="$(stat -f '%z' "$OUTPUT" 2>/dev/null || stat -c '%s' "$OUTPUT")"
echo "==> Wrote $OUTPUT  ($((bytes / 1024)) KB)"
echo
echo "Hot-reload should pick this up automatically."
echo "After deploying, force-rescrape on each platform:"
echo "  LinkedIn: https://www.linkedin.com/post-inspector/"
echo "  Facebook: https://developers.facebook.com/tools/debug/"
echo "  Twitter:  https://cards-dev.twitter.com/validator"
echo "  Discord:  no inspector — append ?v=2 to the URL once to force a fresh fetch"
