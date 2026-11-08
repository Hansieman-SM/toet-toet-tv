#!/bin/bash
# Learning series – Counting #1 (EN): 10 Falling Leaves with Little Truck Toet (ep/learn01_leaves.js: Toet parks under an autumn tree with 10 leaves,
# they fall one by one into his cargo box, tray of 10 + big numeral/number word + rising chime per leaf, wind gust at 6, bare tree, recap 1–10, drive off;
# new music leaves_long: recorder, harpsichord pluck, pizzicato bass, tambourine)
set -e; S=2026-11-08-learn-10-falling-leaves; O=release/$S; mkdir -p $O
python3 ep/mix.py ep/learn01_leaves.js $O/audio.wav
SUBSCRIBE=1 OW=2560 OH=1440 node ep/learn01_leaves.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 2560x1440 -r 30 -i - -i $O/audio.wav -c:v libx264 -preset slow -tune animation -crf 16 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart -shortest $O/$S.mp4
STILL=6.6 OW=1280 OH=720 node ep/learn01_leaves.js $O/bg.png
OW=1280 OH=720 node tools/thumb2.js $O/bg.png $O/$S-thumbnail.png "10 Falling Leaves" "Count 1 to 10 with Little Truck Toet"
ffmpeg -v error -y -i $O/$S-thumbnail.png -q:v 2 $O/$S-thumbnail.jpg
rm -f $O/audio.wav $O/bg.png
