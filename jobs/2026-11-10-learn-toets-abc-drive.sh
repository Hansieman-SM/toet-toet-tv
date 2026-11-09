#!/bin/bash
# Learning series – ABC #1 (EN): Toet's ABC Drive (ep/learn02_abc.js: Little Truck Toet drives along the country road; per letter (5 s) the alphabet strip
# lights the current letter, a letter block (upper + lower case) pops up with a picture card + word card with coloured first letter and Toet says "A is for Apple!";
# A Apple, B Ball, C Cow, D Duck, E Egg, F Fish, G Grapes, H Hat, I Ice cream, J Juice, K Kite, L Leaf, M Moon, N Nest, O Owl, P Pig, Q Quilt, R Rainbow,
# S Sun, T Tree, U Umbrella, V Van, W Watermelon, X Xylophone, Y Yo-yo, Z Zebra; recap of all 26 letters, Toet drives home;
# new music abc_long: toy piano lead, mandolin tremolo chords, low marimba bass, finger snaps + shaker, G major)
set -e; S=2026-11-10-learn-toets-abc-drive; O=release/$S; mkdir -p $O
python3 ep/mix.py ep/learn02_abc.js $O/audio.wav
SUBSCRIBE=1 OW=2560 OH=1440 node ep/learn02_abc.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 2560x1440 -r 30 -i - -i $O/audio.wav -c:v libx264 -preset slow -tune animation -crf 16 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart -shortest $O/$S.mp4
THUMBBG=1 STILL=12.55 OW=1280 OH=720 node ep/learn02_abc.js $O/bg.png
OW=1280 OH=720 node tools/thumb2.js $O/bg.png $O/$S-thumbnail.png "Toet's ABC Drive" "Learn A to Z with Little Truck Toet"
ffmpeg -v error -y -i $O/$S-thumbnail.png -q:v 2 $O/$S-thumbnail.jpg
rm -f $O/audio.wav $O/bg.png
