#!/bin/bash
# Learning series – ABC #3 (EN): Food ABC Picnic with The Big Four (ep/learn07_food_abc.js: picnic on a checked blanket on the savanna; per letter
# (5 s) alphabet strip, letter block (upper + lower case), food picture card with a friendly face + word card with coloured first letter, one of
# the friends says "A is for Apple!", and a little copy of the food lands on the blanket; Apple … Zucchini; recap of 26 tiles, goodbye;
# new music foodabc_long: muted-trumpet lead, electric-piano comp, walking pizzicato bass, brushes + soft cowbell, B-flat swing)
set -e; S=2026-11-15-learn-food-abc-picnic; O=release/$S; mkdir -p $O
python3 ep/mix.py ep/learn07_food_abc.js $O/audio.wav
SUBSCRIBE=1 OW=2560 OH=1440 node ep/learn07_food_abc.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 2560x1440 -r 30 -i - -i $O/audio.wav -c:v libx264 -preset slow -tune animation -crf 16 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart -shortest $O/$S.mp4
THUMBBG=1 STILL=13.5 OW=1280 OH=720 node ep/learn07_food_abc.js $O/bg.png
OW=1280 OH=720 node tools/thumb2.js $O/bg.png $O/$S-thumbnail.png "Food ABC Picnic" "Learn the alphabet with The Big Four"
ffmpeg -v error -y -i $O/$S-thumbnail.png -q:v 2 $O/$S-thumbnail.jpg
rm -f $O/audio.wav $O/bg.png
