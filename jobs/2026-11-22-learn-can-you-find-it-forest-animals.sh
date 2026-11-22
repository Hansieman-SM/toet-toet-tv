#!/bin/bash
# Learning series #16 – Can You Find It? #3: Forest Animals (ep/learn13_find_animals.js: Little Truck Toet parks on an autumn forest path by a
# leaf pile, a hollow log and a berry bush; per round three forest friends hide and only their ears / tail / spikes / eyes peek out; the animal
# word appears, Toet asks "Can you find the BUNNY?", quiet 3-dot pause, then the right friend hops up with a glow and Toet names the clue
# ("Long ears – it's the bunny!"); bunny, squirrel, hedgehog, owl, fox, mouse; recap of the six, everybody waves, Toet drives off;
# new music forestfind_long: accordion lead, harpsichord broken chords, triangle-wave bass, brush + wood clicks, D major tiptoe swing)
set -e; S=2026-11-22-learn-can-you-find-it-forest-animals; O=release/$S; mkdir -p $O
python3 ep/mix.py ep/learn13_find_animals.js $O/audio.wav
SUBSCRIBE=1 OW=2560 OH=1440 node ep/learn13_find_animals.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 2560x1440 -r 30 -i - -i $O/audio.wav -c:v libx264 -preset slow -tune animation -crf 16 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart -shortest $O/$S.mp4
THUMBBG=1 STILL=54 OW=1280 OH=720 node ep/learn13_find_animals.js $O/bg.png
OW=1280 OH=720 node tools/thumb2.js $O/bg.png $O/$S-thumbnail.png "Can You Find It?" "Who is hiding in the forest?"
ffmpeg -v error -y -i $O/$S-thumbnail.png -q:v 2 $O/$S-thumbnail.jpg
rm -f $O/audio.wav $O/bg.png
