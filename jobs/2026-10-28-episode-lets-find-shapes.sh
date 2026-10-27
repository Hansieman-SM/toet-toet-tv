#!/bin/bash
# Episode (EN): Little Truck Toet – Let's Find Shapes! (ep/en01_shapes.js, circle/triangle/square/star)
set -e; S=2026-10-28-episode-lets-find-shapes; O=release/$S; mkdir -p $O
python3 ep/mix.py ep/en01_shapes.js $O/audio.wav
node ep/en01_shapes.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 1920x1080 -r 30 -i - -i $O/audio.wav -c:v libx264 -preset medium -crf 20 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart -shortest $O/$S.mp4
STILL=41 OW=1280 OH=720 node ep/en01_shapes.js $O/bg.png
OW=1280 OH=720 node tools/thumb2.js $O/bg.png $O/$S-thumbnail.png "Let's Find Shapes!" "Circle, triangle, square and star with Little Truck Toet"
ffmpeg -v error -y -i $O/$S-thumbnail.png -q:v 2 $O/$S-thumbnail.jpg
rm -f $O/audio.wav $O/bg.png
