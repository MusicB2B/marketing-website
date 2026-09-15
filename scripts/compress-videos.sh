#!/usr/bin/env bash
# Rebuild public/matches/*.mp4 from the platform repo's originals.
#
# The originals are 720p and up to 3 minutes long, 66MB for the six. They
# display in a card roughly 300x220 CSS pixels and loop for 7 seconds, so
# almost all of that weight is wasted on a marketing page where load time
# costs conversions.
#
# Requires ffmpeg:  brew install ffmpeg
set -euo pipefail

SRC="${1:-$HOME/Code/Fanbased/proto-full/frontend/public}"
DEST="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/public/matches"

CLIP_SECONDS=8      # we only ever show a 7s rotation
WIDTH=720           # ~2x the rendered width, sharp on retina
CRF=30              # visually fine at this size; lower = bigger file

mkdir -p "$DEST"

for name in adidas-campaign fred-again-live spindrift-campaign \
            men-i-trust-live bulleit-campaign carter-faith; do
  input="$SRC/$name.mp4"
  if [[ ! -f "$input" ]]; then
    echo "  skip  $name (not found in $SRC)"
    continue
  fi

  ffmpeg -nostdin -loglevel error -y \
    -t "$CLIP_SECONDS" -i "$input" \
    -vf "scale=${WIDTH}:-2:flags=lanczos" \
    -c:v libx264 -profile:v main -pix_fmt yuv420p \
    -crf "$CRF" -preset slow \
    -movflags +faststart \
    -an \
    "$DEST/$name.mp4"

  printf "  ok    %-22s %s -> %s\n" "$name" \
    "$(du -h "$input"  | cut -f1 | tr -d ' ')" \
    "$(du -h "$DEST/$name.mp4" | cut -f1 | tr -d ' ')"
done

echo
echo "total: $(du -ch "$DEST"/*.mp4 | tail -1 | cut -f1)"
