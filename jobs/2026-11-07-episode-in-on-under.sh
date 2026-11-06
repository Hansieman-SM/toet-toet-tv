#!/bin/bash
# Episode (EN): Little Truck Toet – In, On, Under! (ep/en07_hide.js: hide-and-seek with Kiki the kitten – IN the box, ON the wall, UNDER the bench,
# Toet tries to hide behind a tiny bush, Kiki rides ON his roof and sleeps IN her basket, recap; new bossa-nova music hide_long: ocarina, nylon guitar, clave)
set -e; S=2026-11-07-episode-in-on-under; O=release/$S; mkdir -p $O
python3 ep/mix.py ep/en07_hide.js $O/audio.wav
SUBSCRIBE=1 OW=2560 OH=1440 node ep/en07_hide.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 2560x1440 -r 30 -i - -i $O/audio.wav -c:v libx264 -preset slow -tune animation -crf 16 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart -shortest $O/$S.mp4
STILL=98.4 OW=1280 OH=720 node ep/en07_hide.js $O/bg.png
OW=1280 OH=720 node tools/thumb2.js $O/bg.png $O/$S-thumbnail.png "In, On, Under!" "Hide-and-seek with Little Truck Toet"
ffmpeg -v error -y -i $O/$S-thumbnail.png -q:v 2 $O/$S-thumbnail.jpg
rm -f $O/audio.wav $O/bg.png
