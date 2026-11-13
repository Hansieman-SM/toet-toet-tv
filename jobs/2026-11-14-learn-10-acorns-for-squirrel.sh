#!/bin/bash
# Learning series – Counting #3 (EN): 10 Acorns for Squirrel with Little Truck Toet (ep/learn06_acorns.js: autumn forest; Toet brings a box of
# acorns to Squirrel (new character); she hops each acorn up into her basket on the old oak – tray of 10, big numeral + number word, rising chime;
# basket full, recap 1–10, first snowflakes, Toet drives off; new music acorns_long: bassoon lead, marimba off-beat chords, pizzicato bass,
# woodblock + shaker, G major 6/8)
set -e; S=2026-11-14-learn-10-acorns-for-squirrel; O=release/$S; mkdir -p $O
python3 ep/mix.py ep/learn06_acorns.js $O/audio.wav
SUBSCRIBE=1 OW=2560 OH=1440 node ep/learn06_acorns.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 2560x1440 -r 30 -i - -i $O/audio.wav -c:v libx264 -preset slow -tune animation -crf 16 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart -shortest $O/$S.mp4
STILL=111.65 OW=1280 OH=720 node ep/learn06_acorns.js $O/bg.png
OW=1280 OH=720 node tools/thumb2.js $O/bg.png $O/$S-thumbnail.png "10 Acorns for Squirrel" "Count to 10 with Little Truck Toet"
ffmpeg -v error -y -i $O/$S-thumbnail.png -q:v 2 $O/$S-thumbnail.jpg
rm -f $O/audio.wav $O/bg.png
