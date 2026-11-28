#!/bin/bash
# rev2 (QC): evening shot 3 s longer – Toet rolls away before the subscribe pill appears
# Learning series #21 (THEMES #11) – Counting: 10 Christmas Baubles with Little Truck Toet (ep/learn21_baubles.js: snowy village green,
# ten smiling baubles hop out of Toet's cargo box onto a Christmas tree one by one – tray of 10, numeral + number word, rising chime;
# TEN!, recap 1–10, blue evening: fairy lights switch on, the star lights up, "Merry Christmas!"; new music baubles_long: handbell lead,
# string pad, pizzicato bass, soft triangle, 3/4 in G)
set -e; S=2026-11-28-learn-10-christmas-baubles; O=release/$S; mkdir -p $O
python3 ep/mix.py ep/learn21_baubles.js $O/audio.wav
SUBSCRIBE=1 OW=2560 OH=1440 node ep/learn21_baubles.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 2560x1440 -r 30 -i - -i $O/audio.wav -c:v libx264 -preset slow -tune animation -crf 16 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart -shortest $O/$S.mp4
THUMBBG=1 STILL=80.6 OW=1280 OH=720 node ep/learn21_baubles.js $O/bg.png
OW=1280 OH=720 node tools/thumb2.js $O/bg.png $O/$S-thumbnail.png "10 Christmas Baubles" "Count to 10 with Little Truck Toet"
ffmpeg -v error -y -i $O/$S-thumbnail.png -q:v 2 $O/$S-thumbnail.jpg
rm -f $O/audio.wav $O/bg.png
