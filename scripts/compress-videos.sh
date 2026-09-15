#!/usr/bin/env bash
# Rebuild public/matches/*.mp4 from the platform repo's originals.
#
# Uses avconvert, which ships with macOS — no Homebrew, no ffmpeg. (ffmpeg is
# not installable on macOS 12 without building from source, since Homebrew
# stopped shipping Monterey bottles.)
#
# The originals are 720p and up to 3 minutes long: 66MB for the six. They
# render in a card roughly 200px wide and loop for 7 seconds, so nearly all of
# that weight is wasted on a page where load time costs conversions.
#
#   Preset            Resolution   Size per 8s clip
#   Preset640x480     640x360      ~3.0 MB   too heavy
#   PresetMediumQuality 568x320    ~0.9 MB   <- plenty at this display size
#   PresetLowQuality  224x128      ~0.2 MB   visibly soft
set -euo pipefail

SRC="${1:-$HOME/Code/Fanbased/proto-full/frontend/public}"
DEST="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/public/matches"

PRESET=PresetMediumQuality
SECONDS_PER_CLIP=6        # the panel rotates every 7s

# name:start — start offset skips intros and title cards.
CLIPS=(
  "adidas-campaign:2"
  "fred-again-live:3"
  "spindrift-campaign:2"
  "men-i-trust-live:8"
  "bulleit-campaign:1"
  "carter-faith:25"
)

mkdir -p "$DEST"

for entry in "${CLIPS[@]}"; do
  name="${entry%%:*}"
  start="${entry##*:}"
  input="$SRC/$name.mp4"

  if [[ ! -f "$input" ]]; then
    echo "  skip  $name (not found in $SRC)"
    continue
  fi

  /usr/bin/avconvert \
    --source "$input" \
    --output "$DEST/$name.mp4" \
    --preset "$PRESET" \
    --start "$start" \
    --duration "$SECONDS_PER_CLIP" \
    --replace >/dev/null 2>&1

  printf "  ok    %-22s %6s -> %6s\n" "$name" \
    "$(du -h "$input" | cut -f1 | tr -d ' ')" \
    "$(du -h "$DEST/$name.mp4" | cut -f1 | tr -d ' ')"
done

echo
echo "  total: $(du -ch "$DEST"/*.mp4 | tail -1 | cut -f1) (was 66M)"
