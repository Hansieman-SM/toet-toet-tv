#!/bin/bash
# Learning series – Counting #2 (EN): 10 Little Snowflakes with The Big Four (ep/learn03_snow.js: it snows on a winter savanna, ten big friendly
# snowflakes drift down one by one and land on Leo's nose, Ella's trunk, Nico's horn, Boris's tongue …; tray of 10 + big numeral/number word +
# rising chime per snowflake, TEN!, recap 1–10, the friends build a snowman; new music snow_long: celesta, harp waltz chords, string pad, sleigh bells, E-flat 3/4)
set -e; S=2026-11-11-learn-10-little-snowflakes; O=release/$S; mkdir -p $O
python3 ep/mix.py ep/learn03_snow.js $O/audio.wav
SUBSCRIBE=1 OW=2560 OH=1440 node ep/learn03_snow.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 2560x1440 -r 30 -i - -i $O/audio.wav -c:v libx264 -preset slow -tune animation -crf 16 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart -shortest $O/$S.mp4
STILL=7.0 OW=1280 OH=720 node ep/learn03_snow.js $O/bg.png
OW=1280 OH=720 node tools/thumb2.js $O/bg.png $O/$S-thumbnail.png "10 Little Snowflakes" "Count 1 to 10 with The Big Four"
ffmpeg -v error -y -i $O/$S-thumbnail.png -q:v 2 $O/$S-thumbnail.jpg
rm -f $O/audio.wav $O/bg.png
