#!/bin/bash
# Learning series #17 – Counting #6 (EN): 10 Colorful Kites with The Big Four (ep/learn17_kites.js: a windy autumn day on the savanna,
# leaves blow by; one by one ten smiling kites (each its own colour, fluttering bow tail) rise from behind the far hill – tray of 10,
# big numeral + number word, rising chime; TEN!, every kite does a loop in a gust, recap 1–10, the wind calms down, the kites float
# down behind the hill, "Bye-bye, kites!"; new music kites_long: breezy soft bossa in D – soft alto-sax lead, airy organ pad,
# pizzicato bass, rim clicks + shaker, wind chimes)
set -e; S=2026-11-24-learn-10-colorful-kites; O=release/$S; mkdir -p $O
python3 ep/mix.py ep/learn17_kites.js $O/audio.wav
SUBSCRIBE=1 OW=2560 OH=1440 node ep/learn17_kites.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 2560x1440 -r 30 -i - -i $O/audio.wav -c:v libx264 -preset slow -tune animation -crf 16 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart -shortest $O/$S.mp4
THUMBBG=1 STILL=79 OW=1280 OH=720 node ep/learn17_kites.js $O/bg.png
OW=1280 OH=720 node tools/thumb2.js $O/bg.png $O/$S-thumbnail.png "10 Colorful Kites" "Count to 10 with The Big Four"
ffmpeg -v error -y -i $O/$S-thumbnail.png -q:v 2 $O/$S-thumbnail.jpg
rm -f $O/audio.wav $O/bg.png
