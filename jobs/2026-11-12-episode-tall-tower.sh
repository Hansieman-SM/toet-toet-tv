#!/bin/bash
# Episode (EN): The Big Four – Tall Tower! (ep/en10_tower.js: the friends find five colourful blocks; first try with the little blue block at the bottom
# and the big red block on top wobbles and falls (CRASH!) – "Let's try again!"; Ella's idea: big blocks at the bottom, small on top; they sort big → small
# and build again counting 1 red, 2 orange, 3 yellow, 4 green, 5 blue + a star on top – taller than Ella! Sunset recap 1–5;
# new music tower_long: ragtime-style honky-tonk piano with stride left hand, banjo-ish chops, brushes + woodblock, C major)
set -e; S=2026-11-12-episode-tall-tower; O=release/$S; mkdir -p $O
python3 ep/mix.py ep/en10_tower.js $O/audio.wav
SUBSCRIBE=1 OW=2560 OH=1440 node ep/en10_tower.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 2560x1440 -r 30 -i - -i $O/audio.wav -c:v libx264 -preset slow -tune animation -crf 16 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart -shortest $O/$S.mp4
STILL=121 OW=1280 OH=720 node ep/en10_tower.js $O/bg.png
OW=1280 OH=720 node tools/thumb2.js $O/bg.png $O/$S-thumbnail.png "Tall Tower!" "Big, small & count to 5!"
ffmpeg -v error -y -i $O/$S-thumbnail.png -q:v 2 $O/$S-thumbnail.jpg
rm -f $O/audio.wav $O/bg.png
