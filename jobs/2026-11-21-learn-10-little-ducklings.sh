#!/bin/bash
# Learning series #15 – Counting #5: 10 Little Ducklings (ep/learn12_ducklings.js: Little Truck Toet parks by an autumn pond where Mama Duck
# calls her babies; one by one a duckling (each with its own little coloured bow) pops out of the reeds and swims to the line behind Mama
# Duck; tray of 10, big numeral + number word, peep + rising chime; "Ten little ducklings!", recap 1–10, Toet says goodbye (rev2: the duck family stays fully in view at the end; rev3: re-render after the batch run overwrote rev2);
# new music ducks_long: piccolo lead, plucked bass, marimba off-beats, temple blocks, water blips, C major)
set -e; S=2026-11-21-learn-10-little-ducklings; O=release/$S; mkdir -p $O
python3 ep/mix.py ep/learn12_ducklings.js $O/audio.wav
SUBSCRIBE=1 OW=2560 OH=1440 node ep/learn12_ducklings.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 2560x1440 -r 30 -i - -i $O/audio.wav -c:v libx264 -preset slow -tune animation -crf 16 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart -shortest $O/$S.mp4
THUMBBG=1 STILL=88 OW=1280 OH=720 node ep/learn12_ducklings.js $O/bg.png
OW=1280 OH=720 node tools/thumb2.js $O/bg.png $O/$S-thumbnail.png "10 Little Ducklings" "Count to 10 with Toet!"
ffmpeg -v error -y -i $O/$S-thumbnail.png -q:v 2 $O/$S-thumbnail.jpg
rm -f $O/audio.wav $O/bg.png
