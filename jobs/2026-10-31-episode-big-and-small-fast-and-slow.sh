#!/bin/bash
# Episode (EN): Little Truck Toet – Big and Small, Fast and Slow! (ep/en03_opposites.js: opposites big/small, fast/slow, up/down, loud/quiet; new oom-pah march music)
# rev2 2026-10-30: speech bubbles moved off the bunny/snail/balloon
set -e; S=2026-10-31-episode-big-and-small-fast-and-slow; O=release/$S; mkdir -p $O
python3 ep/mix.py ep/en03_opposites.js $O/audio.wav
OW=2560 OH=1440 node ep/en03_opposites.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 2560x1440 -r 30 -i - -i $O/audio.wav -c:v libx264 -preset slow -tune animation -crf 16 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart -shortest $O/$S.mp4
STILL=26 OW=1280 OH=720 node ep/en03_opposites.js $O/bg.png
OW=1280 OH=720 node tools/thumb2.js $O/bg.png $O/$S-thumbnail.png "Big and Small!" "Learn opposites with Little Truck Toet"
ffmpeg -v error -y -i $O/$S-thumbnail.png -q:v 2 $O/$S-thumbnail.jpg
rm -f $O/audio.wav $O/bg.png
