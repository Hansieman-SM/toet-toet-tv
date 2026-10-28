#!/bin/bash
# Engelse versie van een bestaande Nederlandse video bouwen (1440p) + Engelse thumbnail.
# Gebruik: tools/build_en.sh <job> <script_en.js> <audio-commando> <thumb-tijd> ["Thumb title" "subtitle"]
#  audio-commando krijgt het wav-pad als laatste argument, bv. "python3 ep/e1_koeien.py" of "python3 ep/mix.py ep/av01_opa_oma_en.js"
set -e
S=$1; JS=$2; AUD=$3; TT=$4; O=release/$S; mkdir -p $O
$AUD $O/audio.wav > /dev/null
OW=2560 OH=1440 node $JS | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 2560x1440 -r 30 -i - -i $O/audio.wav -c:v libx264 -preset slow -tune animation -crf 16 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart -shortest $O/$S.mp4
if [ -n "$5" ]; then STILL=$TT OW=1280 OH=720 node $JS $O/bg.png; OW=1280 OH=720 node tools/thumb2.js $O/bg.png $O/$S-thumbnail.png "$5" "$6"; rm -f $O/bg.png
else THUMB=$TT OW=1280 OH=720 node $JS $O/$S-thumbnail.png; fi
ffmpeg -v error -y -i $O/$S-thumbnail.png -q:v 2 $O/$S-thumbnail.jpg
rm -f $O/audio.wav
