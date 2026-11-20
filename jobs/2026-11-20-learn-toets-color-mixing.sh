#!/bin/bash
# Learning series #14 (approved 2026-11-12) – Toet's Color Mixing (ep/learn11_colormix.js: Little Truck Toet parks next to a big striped
# mixing bowl; per round (15 s) two paint cans pop up, Toet asks "Red and yellow make...?", both cans pour into the bowl, the colours swirl,
# a quiet 3-dot pause ("What will it be?"), then the reveal: the paint turns ORANGE with a little splash, the bowl smiles, the colour word
# appears in its own colour and Toet says "Red and yellow make orange!"; red+yellow=orange, blue+yellow=green, red+blue=purple,
# red+white=pink, blue+white=light blue; recap of the five mixes as paint-dot sums; new music colormix_long: xylophone + soft bell lead,
# harp arpeggios, pizzicato bass, brushes, finger cymbal, E-flat)
set -e; S=2026-11-20-learn-toets-color-mixing; O=release/$S; mkdir -p $O
python3 ep/mix.py ep/learn11_colormix.js $O/audio.wav
SUBSCRIBE=1 OW=2560 OH=1440 node ep/learn11_colormix.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 2560x1440 -r 30 -i - -i $O/audio.wav -c:v libx264 -preset slow -tune animation -crf 16 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart -shortest $O/$S.mp4
THUMBBG=1 STILL=21.8 OW=1280 OH=720 node ep/learn11_colormix.js $O/bg.png
OW=1280 OH=720 node tools/thumb2.js $O/bg.png $O/$S-thumbnail.png "Toet's Color Mixing" "Red + yellow = ?"
ffmpeg -v error -y -i $O/$S-thumbnail.png -q:v 2 $O/$S-thumbnail.jpg
rm -f $O/audio.wav $O/bg.png
