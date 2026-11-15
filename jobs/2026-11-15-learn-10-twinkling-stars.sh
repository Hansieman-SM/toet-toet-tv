#!/bin/bash
# Learning series – Counting #4 (EN): 10 Twinkling Stars at Bedtime with The Big Four (ep/learn08_stars.js: the sun has gone down on the savanna;
# one by one ten friendly little stars light up in the sky (each its own colour + little face) – tray of 10, big numeral + number word, rising
# chime; the sky gets darker, Boris and Leo yawn; TEN!, gentle shooting star, recap 1–10, the moon rises, "Good night, stars!", the friends fall
# asleep (z z z) and the stars close their eyes; new music stars_long: French-horn lullaby in F 6/8 – nylon-guitar arpeggios, soft bass,
# string pad, triangle, no drums)
# rev2: crescent moon drawn as a clean crescent and rising in the middle of the sky (no overlap with stars or speech bubbles)
set -e; S=2026-11-15-learn-10-twinkling-stars; O=release/$S; mkdir -p $O
python3 ep/mix.py ep/learn08_stars.js $O/audio.wav
SUBSCRIBE=1 OW=2560 OH=1440 node ep/learn08_stars.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 2560x1440 -r 30 -i - -i $O/audio.wav -c:v libx264 -preset slow -tune animation -crf 16 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart -shortest $O/$S.mp4
STILL=117.1 OW=1280 OH=720 node ep/learn08_stars.js $O/bg.png
OW=1280 OH=720 node tools/thumb2.js $O/bg.png $O/$S-thumbnail.png "10 Twinkling Stars" "Count to 10 at bedtime with The Big Four"
ffmpeg -v error -y -i $O/$S-thumbnail.png -q:v 2 $O/$S-thumbnail.jpg
rm -f $O/audio.wav $O/bg.png
